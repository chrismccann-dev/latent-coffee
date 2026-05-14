import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import {
  authedWrite,
  getRoestCustomerInfo,
} from '@/lib/roest-client'
import type { McpAuthContext } from '@/lib/mcp/auth'
import { checkEndConditionBounds } from '@/lib/mcp/end-condition-bounds'
import { withToolErrorLogging } from '@/lib/mcp/tool-wrapper'

// push_roast_profile — server-side POST /profiles/ to api.roestcoffee.com.
// Constructs an INLET_TEMP counterflow profile from claude.ai-supplied beziers
// + end-condition + name, posts to Roest, optionally enables sharing, and
// returns { profile_id, share_url? } for use in chat context. No DB write
// (Phase 1) — the trace is captured later via pull_roest_log when the roast
// runs against this profile.
//
// Trust model: claude.ai already has BMR + ROASTING.md + the per-bean v1a
// archive in context, so the Tool description is intentionally schema-style /
// neutral rather than directive. Bezier shape decisions live in ROASTING.md;
// this Tool just enforces structural sanity (≥2 points, msec=0 first, strictly
// ascending, value bounds) before the API call.
//
// end_condition mapping — confirmed against the Roest UI Profiles page dropdown
// (screenshot from Chris 2026-05-06). The dropdown order maps 1:1 to the
// OpenAPI integer enum, so BEAN_TEMP is enum 4 (not 1 as the existing read
// decoder in lib/roest-client.ts mapEndConditionEnum had assumed). The read
// decoder is being corrected as part of this sprint's cross-system audit.
//
//   NONE       → 0   ("None" — no auto-drop, manual operator control)
//   TOTAL_TIME → 1   (Roasting time target)
//   DEV_TIME   → 2   (Development time target)
//   DTR        → 3   (Development time percentage)
//   BEAN_TEMP  → 4   (Chris's default per ROASTING.md § Drop Temp as the Primary Drop Signal)

type EndConditionLabel = 'NONE' | 'TOTAL_TIME' | 'DEV_TIME' | 'DTR' | 'BEAN_TEMP'

const END_CONDITION_TO_INT: Record<EndConditionLabel, number> = {
  NONE: 0,
  TOTAL_TIME: 1,
  DEV_TIME: 2,
  DTR: 3,
  BEAN_TEMP: 4,
}

// Hardcoded counterflow defaults — constant across every Chris roast on the
// L200 Ultra. If he ever runs a non-counterflow / non-INLET profile, surface
// these as inputs at that point. YAGNI for now.
const COUNTERFLOW_DEFAULTS = {
  // OpenAPI labels enum 2 ambiguously ("S100/L100 p17"); empirically Chris's
  // L200 Ultra profiles serialize with machinetype: 2. If a future Roest
  // schema update reassigns enum values, surface as input.
  machinetype: 2,
  // INLET_TEMP profile — server controls power to hit inlet target. Chris's
  // exclusive mode per ROASTING.md.
  profile_type: 5,
  reversed_drum_direction: true,
  is_bbp_profile: false,
} as const

// Bezier validator — ≥2 points, first msec=0, strictly ascending msec,
// value bounds per axis. No precedent in codebase for tuple-array validation,
// so a custom superRefine. Bounds:
//   temperature → [50, 300]  °C
//   fan / rpm / power → [0, 100] %
function refineBezier(label: string, valueBounds: readonly [number, number]) {
  return (curve: [number, number][], ctx: z.RefinementCtx) => {
    if (curve.length === 0) return
    if (curve[0][0] !== 0) {
      ctx.addIssue({
        code: 'custom',
        message: `${label}: first point msec must be 0 (profile starts at charge); got ${curve[0][0]}`,
      })
    }
    for (let i = 1; i < curve.length; i++) {
      if (curve[i][0] <= curve[i - 1][0]) {
        ctx.addIssue({
          code: 'custom',
          message: `${label}: msec must be strictly ascending; point ${i} (${curve[i][0]}) ≤ point ${i - 1} (${curve[i - 1][0]})`,
        })
      }
    }
    const [lo, hi] = valueBounds
    for (let i = 0; i < curve.length; i++) {
      const v = curve[i][1]
      if (!Number.isFinite(v) || v < lo || v > hi) {
        ctx.addIssue({
          code: 'custom',
          message: `${label}: value at point ${i} (${v}) must be in [${lo}, ${hi}]`,
        })
      }
    }
  }
}

const TEMP_BEZIER = z
  .array(z.tuple([z.number(), z.number()]))
  .min(2)
  .superRefine(refineBezier('temperature_bezier', [50, 300]))

const PCT_BEZIER = (label: string) =>
  z.array(z.tuple([z.number(), z.number()])).min(2).superRefine(refineBezier(label, [0, 100]))

export const pushRoastProfileInputSchema = {
  name: z.string().min(1).describe(
    'Profile name as it will appear on the Roest tablet. Chris\'s existing pattern is `<short-name> - v<N><letter>` (e.g. "Bukure - v1a", "WushWush - v1c", "SR Natural - v4a") — keep the version suffix at the end and total length short, since the Roest tablet truncates from the right and version letters get clipped on long names. v1a/v1b/v1c iteration convention from ROASTING.md § Naming Conventions.',
  ),
  notes: z.string().optional().nullable().describe(
    'Free-text notes attached to the profile, visible in Roest Connect. Useful for capturing batch hypothesis (e.g. "v1a peak inlet 235°C, drop on 200°C bean — develops mid-Maillard energy on a Bukure-class anaerobic"). Max 2047 chars.',
  ),
  batch_weight_g: z.number().default(100).describe(
    'Green coffee batch weight in grams. Chris always 100g for L200 Ultra batch testing.',
  ),
  preheat_temperature_c: z.number().describe(
    'Air preheat target °C — the inlet air temperature ramped to during the preheat phase, before charge. The Roest UI labels this "Preheat air temp". Distinct from the first bezier point (the inlet target at the charge moment) AND from `hopper_load_temp` on push_roast (which is the bean probe reading at hopper-load, ~125°C V4 standard — different signal). Chris\'s typical air preheat for counterflow V1/V2 profiles: 210°C.',
  ),
  temperature_bezier: TEMP_BEZIER.describe(
    'Inlet temp curve as [msec, °C] tuples. Typically 4-7 control points covering charge → mid-drying → late drying / early Maillard → peak (late Maillard) → into FC → development → safety floor. ROASTING.md § Standard Inlet Curve Template fixes 7 timestamps for V1 experiments (00:00 / 01:15 / 02:30 / 03:15 / 04:00 / 05:00 / 06:00). First msec must be 0; msec strictly ascending; °C in [50, 300].',
  ),
  fan_bezier: PCT_BEZIER('fan_bezier').describe(
    'Fan curve as [msec, %] tuples. Counterflow shaped curves required — Chris\'s pattern is high airflow during drying (75-80%), step down to 50-65% post-FC for development. ROASTING.md § Fan Strategy. First msec must be 0; msec strictly ascending; values in [0, 100].',
  ),
  rpm_bezier: PCT_BEZIER('rpm_bezier').describe(
    'Drum RPM curve as [msec, rpm] tuples. Chris\'s L200 Ultra runs flat at 65 rpm across V1/V2 profiles (confirmed in Roest UI 2026-05-06). Use [[0, 65], [720000, 65]] for a 12-minute flat curve unless specifically modulating. First msec must be 0; msec strictly ascending; values in [0, 100].',
  ),
  power_bezier: z
    .array(z.tuple([z.number(), z.number()]))
    .nullable()
    .default(null)
    .describe(
      'Burner power curve as [msec, %] tuples. NULL for INLET_TEMP profiles (the server controls power to hit inlet target) — Chris uses profile_type 5 (INLET_TEMP) so this stays null. Provide only if running a power-driven profile type.',
    ),
  end_condition: z
    .enum(['NONE', 'TOTAL_TIME', 'DEV_TIME', 'DTR', 'BEAN_TEMP'])
    .default('BEAN_TEMP')
    .describe(
      'Drop trigger type, matching the Roest UI End condition dropdown 1:1 (None / Total time / Dev time / Dev time % / Bean temp). BEAN_TEMP is Chris\'s usual choice per ROASTING.md § Drop Temp as the Primary Drop Signal — machine auto-drops at the threshold, cleanest mechanism, required on silent-FC coffees (Mandela XO, anaerobic naturals). DEV_TIME serves as a safety-net pattern: set Dev time = 0:50 + manually drop on 208°C bean temp (V2 Higuito-style hybrid; the safety net catches the case where the operator misses the manual signal). NONE leaves drop entirely to the operator. TOTAL_TIME / DTR are supported but rarely Chris\'s choice.',
    ),
  end_condition_value: z.number().describe(
    'Numeric target for end_condition. For BEAN_TEMP, it\'s °C — typical window 198-208°C depending on bean development target (Chris\'s V1a/V2a Bukure profile uses 206.5°C; CGLE Sudan Rume Hybrid Washed uses ~205°C). For DEV_TIME and DTR-as-safety-net, it\'s seconds (e.g. 50 for a 0:50 dev-time safety net). For TOTAL_TIME, seconds. For NONE, ignored (pass 0).',
  ),
  enable_share: z.boolean().default(true).describe(
    'When true, follow up the create with PUT /profiles/{id}/enable_share/ to get a public share_url. Returned in the Tool result. Chris pastes this on the tablet or browser to load the profile cross-device.',
  ),
}

type PushRoastProfileInput = {
  name: string
  notes?: string | null
  batch_weight_g: number
  preheat_temperature_c: number
  temperature_bezier: [number, number][]
  fan_bezier: [number, number][]
  rpm_bezier: [number, number][]
  power_bezier: [number, number][] | null
  end_condition: EndConditionLabel
  end_condition_value: number
  enable_share: boolean
}

// Roest API request / response shapes — minimal, only fields we send / read.
type CreateProfileBody = {
  name: string
  notes: string | null
  batch_weight: number
  preheat_temperature: number
  temperature_bezier: [number, number][]
  fan_bezier: [number, number][]
  rpm_bezier: [number, number][]
  power_bezier: [number, number][] | null
  end_condition: number
  end_condition_value: number
  machinetype: number
  profile_type: number
  reversed_drum_direction: boolean
  is_bbp_profile: boolean
  customer: string
}

type CreateProfileResponse = {
  id: number
}

type EnableShareResponse = {
  share_uuid?: string | null
  share_url?: string | null
}

export function registerPushRoastProfileTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'push_roast_profile',
    {
      title: 'Push Roast Profile',
      description:
        'Push / create / upload / save / send a roast profile to Chris\'s Roest L200 Ultra via api.roestcoffee.com POST /profiles/. Constructs an INLET_TEMP counterflow profile (Chris\'s exclusive mode) from claude.ai-supplied beziers + end-condition + name. Hardcoded counterflow defaults: machinetype=2, profile_type=5 (INLET_TEMP), reversed_drum_direction=true, is_bbp_profile=false, customer resolved at call time. Validates bezier shapes BEFORE the API call: ≥2 points, first msec=0, strictly ascending msec, sane value bounds (temp 50-300°C, fan/rpm/power 0-100). Bezier inputs use msec-since-charge: convert mm:ss timestamps from the experiment-design table (e.g. 01:15 → 75000) before passing. end_condition mapping matches the Roest UI dropdown 1:1: NONE=0 / TOTAL_TIME=1 / DEV_TIME=2 / DTR=3 / BEAN_TEMP=4. When enable_share=true, follows up with PUT /profiles/{id}/enable_share/ and returns the share_url so claude.ai can paste it back into chat or onto the tablet UI. No DB write — the trace is captured later via pull_roest_log once the roast runs. Idempotency: create-new, allow duplicates (re-pushing v1a yields a second row; Chris deletes via the Roest UI). For iteration naming + bezier shape conventions + drop-temp philosophy, see ROASTING.md.',
      inputSchema: pushRoastProfileInputSchema,
    },
    withToolErrorLogging('push_roast_profile', async (input) => {
      const i = input as PushRoastProfileInput
      // Sprint 3.2 #3 + #4 — cross-field validation before posting to Roest.
      const boundsErr = checkEndConditionBounds(i.end_condition, i.end_condition_value)
      if (boundsErr) throw new Error(`Validation failed:\n  - ${boundsErr}`)
      if (i.power_bezier !== null && i.power_bezier.length > 0) {
        throw new Error(
          'Validation failed:\n  - power_bezier must be null on INLET_TEMP profiles (profile_type=5 is hardcoded — Chris\'s exclusive mode). The server controls power to hit inlet target. If you need power-driven profiles, surface profile_type as an input first.',
        )
      }
      const { url: customerUrl } = await getRoestCustomerInfo()
      const body: CreateProfileBody = {
        name: i.name,
        notes: i.notes ?? null,
        batch_weight: i.batch_weight_g,
        preheat_temperature: i.preheat_temperature_c,
        temperature_bezier: i.temperature_bezier,
        fan_bezier: i.fan_bezier,
        rpm_bezier: i.rpm_bezier,
        power_bezier: i.power_bezier,
        end_condition: END_CONDITION_TO_INT[i.end_condition],
        end_condition_value: i.end_condition_value,
        ...COUNTERFLOW_DEFAULTS,
        customer: customerUrl,
      }
      const created = await authedWrite<CreateProfileBody, CreateProfileResponse>(
        'POST',
        '/profiles/',
        body,
      )
      let share_url: string | null = null
      if (i.enable_share) {
        const shared = await authedWrite<Record<string, never>, EnableShareResponse>(
          'PUT',
          `/profiles/${created.id}/enable_share/`,
          {},
        )
        // Roest returns either share_url directly or a share_uuid we compose into the Connect URL.
        if (shared.share_url) {
          share_url = shared.share_url
        } else if (shared.share_uuid) {
          share_url = `https://connect.roestcoffee.com/shared_profile/${shared.share_uuid}`
        }
      }
      void auth
      const out = {
        profile_id: created.id,
        share_url,
      }
      return {
        content: [{ type: 'text', text: JSON.stringify(out) }],
        structuredContent: out,
      }
    }),
  )
}
