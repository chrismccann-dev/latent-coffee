import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { persistRoast, type RoastPayload } from '@/lib/roast-import'
import type { McpAuthContext } from '@/lib/mcp/auth'
import { checkEndConditionBounds } from '@/lib/mcp/end-condition-bounds'
import { withToolErrorLogging } from '@/lib/mcp/tool-wrapper'

// push_roast — single batch roast log insert. green_bean_id is required (FK).
// All other fields optional. The 8 Sprint-2.5 enrichment columns (added in
// migration 039) are documented inline so claude.ai can populate them when
// the source is the V4 doc / Roest profile data.

export const pushRoastInputSchema = {
  // Required identity
  green_bean_id: z.string().uuid().describe(
    'FK to green_beans.id. Use push_green_bean first if the lot isn\'t in DB yet.',
  ),
  batch_id: z.string().describe(
    'Stable batch identifier — typically the Roest batch number ("139") or lot-batch composite ("MX-139").',
  ),
  // Provenance
  roast_date: z.string().optional().nullable().describe('YYYY-MM-DD.'),
  coffee_name: z.string().optional().nullable(),
  profile_link: z.string().optional().nullable().describe('Roest connect.roestcoffee.com/shared_log URL.'),
  drum_direction: z.string().optional().nullable().describe('"Counterflow" | "Conventional".'),
  // Mass + color
  batch_size_g: z.number().optional().nullable().describe('Green coffee weight in g (typically 100).'),
  roasted_weight_g: z.number().optional().nullable(),
  weight_loss_pct: z.number().optional().nullable().describe('Decimal fraction (0.124 = 12.4%) OR percentage value (12.4); persistRoast accepts either.'),
  agtron: z.number().optional().nullable().describe('Whole-bean Agtron post-roast (Lightcells CM-200).'),
  color_description: z.string().optional().nullable(),
  // Times
  yellowing_time: z.string().optional().nullable().describe('mm:ss text.'),
  fc_start: z.string().optional().nullable().describe('First crack time as mm:ss text.'),
  drop_time: z.string().optional().nullable(),
  // Temps + dev
  charge_temp: z.number().optional().nullable().describe('Drum temp °C at charge. V4 standard: 117°C.'),
  fc_temp: z.number().optional().nullable().describe('Bean temp °C at FC. V4 target window: 200-205°C for Sudan Rume Washed (coffee-specific).'),
  drop_temp: z.number().optional().nullable().describe('Bean temp °C at drop. Drop on temp, not on clock — primary control gate per V4.'),
  dev_time_s: z.number().int().optional().nullable(),
  dev_ratio: z.string().optional().nullable().describe('Decimal as text ("0.124" = 12.4%).'),
  // Sprint 2.5 V4 enrichments
  roast_profile_name: z.string().optional().nullable().describe(
    'Roest profile template name (e.g. "Sudan Rume Washed - 119"). Distinct from profile_link (data-graph URL).',
  ),
  tp_time: z.string().optional().nullable().describe(
    'Turning Point time as mm:ss. V4: TP probe reads consistently low (78-81°C) on this machine — diagnostic-only, not a primary lever.',
  ),
  tp_temp: z.number().optional().nullable(),
  yellowing_temp: z.number().optional().nullable().describe('Bean temp °C at yellowing. V4 standard: ~165°C.'),
  hopper_load_temp: z.number().optional().nullable().describe(
    'Drum temp °C at hopper pre-load. V4 standard: 125°C (was 120°C pre-Sudan-Rume-Washed). Primary control lever.',
  ),
  fan_curve: z.string().optional().nullable().describe(
    'Shaped fan curve as display string (e.g. "80% at 0:00 -> 70% at 1:45 -> 65% at 2:30 -> 72% at 4:15 -> 75% at 5:30"). Source: Roest profile fan_bezier.',
  ),
  inlet_curve: z.string().optional().nullable().describe(
    'Shaped inlet temp curve as display string. Source: Roest profile temperature_bezier - this is the as-DESIGNED template, not the as-recorded operator-set curve. Mid-roast inlet adjustments (operator nudging the curve during the roast) are not exposed by the Roest API and therefore not captured. If you need to record divergence between designed and actual, note it in what_didnt or what_to_change.',
  ),
  roest_log_id: z.number().int().optional().nullable().describe(
    'api.roestcoffee.com /logs/{id}/ — set when seeded from pull_roest_log.',
  ),
  // Roest UI pass-through (Phase 2 #R57). Preserves the Roest "Notes" / comment
  // verbatim; pull_roest_log populates this from log.first_comment.comment.
  roest_notes: z.string().optional().nullable().describe(
    'Pass-through of the Roest UI Notes / first_comment.comment. pull_roest_log auto-populates this; preserve as-is rather than folding into what_worked / what_to_change (those are Chris\'s analytical prose).',
  ),
  // End-condition trigger (Phase 2 #R58) — distinct from drop_temp (where the
  // machine actually dropped). Captures what the operator SET as the trigger.
  end_condition_type: z.enum(['bean_temp', 'dev_time', 'manual']).optional().nullable().describe(
    'Drop trigger as set on the Roest profile. bean_temp = drop when bean reaches end_condition_target °C; dev_time = drop after end_condition_target seconds post-FC; manual = operator-controlled with no machine trigger. **Case discipline**: this column takes LOWERCASE values (bean_temp / dev_time / manual) — the sibling push_roast_profile takes the Roest API\'s ALL-CAPS enum (BEAN_TEMP / DEV_TIME / TOTAL_TIME / DTR / NONE). Same concept, different conventions: push_roast_profile mirrors the Roest UI dropdown labels, push_roast mirrors the DB column enum. Don\'t cross-pollinate. Distinct from drop_temp / dev_time_s (what the machine actually recorded). On silent-FC coffees, bean_temp is the more reliable trigger; setting this lets the arbiter detect when a roast diverged from intent.',
  ),
  end_condition_target: z.number().optional().nullable().describe(
    'Numeric target for the end_condition_type. °C when bean_temp; seconds when dev_time; null when manual. Phase 2 (#R58).',
  ),
  // FC audibility signal (Phase 2 #R61).
  fc_total_cracks: z.number().int().min(0).optional().nullable().describe(
    'Total audible cracks counted from the FC event through drop. 0 on silent-FC coffees (anaerobic naturals, heavy co-ferments). Strong audibility signal that complements fc_temp / fc_start. Phase 2 (#R61).',
  ),
  // Sprint 11 RO-CP-3 (migration 061, 2026-05-20). 5th value did_not_fire added
  // Group 3 / Item 31 (migration 066, 2026-05-24).
  fc_audibility: z.enum(['audible', 'subtle', 'silent', 'ambiguous', 'did_not_fire']).optional().nullable().describe(
    'FC audibility / occurrence state for this batch (5-value enum). audible: multi-snap canonical FC, cell-wall intact. subtle: partial detection, some snaps but not the canonical signature; operationally treated as not-audible AND dev_time_s is trustable from the timestamp (subtle FC marks are real events, not noise — Round 14 Bukure v2b clarification). silent: no audibility — heavy-ferment cellulose modification; FC structurally happened but produced no snap (inaudible is a near-synonym used when hedging on detection vs asserting bean-property silence). ambiguous: operator-property uncertainty — couldn\'t tell whether FC happened, missed it, or it\'s still upcoming. did_not_fire: bean did NOT reach FC temperature; FC structurally did not happen (Round 14 Bukure v2a / Mt Elgon batch 199 case — bean topped out below FC range with 0 cracks). Four of the five (subtle / silent / ambiguous / did_not_fire) trigger the same downstream protocol stack: bean-temp end_condition_type, drop-ceiling-primary, Agtron + WB→Gnd delta as proxies. The distinction matters for cause attribution and for predicting audibility on future similar lots — track it per batch, not just on the lot. When did_not_fire is set, fc_start / fc_temp / dev_time_s MUST be null (no event to anchor to). See CONTEXT-roasting.md § FC audibility state.',
  ),
  // Prose
  what_worked: z.string().optional().nullable(),
  what_didnt: z.string().optional().nullable(),
  what_to_change: z.string().optional().nullable(),
  // Tristate: yes | no | pending. Existing callers passing boolean coerce on
  // write (true → 'yes', false → 'no'). Phase 2 (#R62).
  worth_repeating: z.union([
    z.boolean(),
    z.enum(['yes', 'no', 'pending']),
  ]).optional().nullable().describe(
    'Tristate: "yes" | "no" | "pending". Use "pending" for "yes at the structural-roast level but waiting on Day 7 cupping confirmation" - boolean true/false can\'t represent the conditional case (Bean 6 V1B). Boolean true/false also accepted for back-compat (coerced to "yes"/"no" on write).',
  ),
  is_reference: z.boolean().optional().nullable().describe(
    'True for the lot\'s confirmed reference roast — the batch the resolved-view page renders as THE reference. **Decoupled from worth_repeating**: is_reference is a structural axis ("this row is the lot\'s reference roast for page-render purposes"), worth_repeating is a judgment axis ("I\'d run this exact recipe again if I had more green"). On V-set lots both default to true together at close-out (close-lot.md STAGE 2). On one-shot lots (one-shot-closeout.md STAGE 2) is_reference: true is set UNCONDITIONALLY regardless of Outcome A/B — the single batch IS structurally the reference, even on Outcome B "Closed without reference" lots where worth_repeating: "no" and roast_learnings.why_this_roast_won = NULL. The Sprint 3.2 #18 ResolvedView sub-card triggers on why_this_roast_won = NULL, NOT on is_reference = false. One per closed bean typically.',
  ),
  is_reference_candidate: z.boolean().optional().nullable().describe(
    'Forward-looking quality flag during V-set iteration (Schema sprint S2, migration 056, 2026-05-18). Set TRUE on the leading slot per V-set when it\'s plausibly the lot reference at close-out. **Decoupled from is_reference AND worth_repeating**: candidate is mid-flight ("the leading slot in V3 looks reference-quality, pending V4 confirmation"); is_reference is final ("yes, this is the lot reference"); worth_repeating is a recipe-replay judgment. The Round 3 #8 Fazenda Um case ("V1B is leading but best-of-the-worst, not a reference example") is the canonical negative case → candidate=false. Candidate does NOT auto-flip to is_reference at close-out — the close-lot.md / one-shot-closeout.md flow makes the promotion explicit via patch_roast(is_reference: true). Multiple V-sets on one lot can each have a candidate; only one batch ultimately gets is_reference=true.',
  ),
  // Sub Pages 6.1 (migration 052, 2026-05-13).
  recipe_id: z.string().uuid().optional().nullable().describe(
    'FK to roast_recipes.id — the design intent this roast executed. Phase 2 of docs/roasting/redesign.md § 7: when push_roast follows a push_roast_profile, the matching recipe row was created at push_roast_profile time; set this FK so the roast links to its design intent. Discoverable by querying roast_recipes for (green_bean_id, experiment_id, batch_slot) or via the roasts://by-bean/{green_bean_id} Resource.',
  ),
}

export function registerPushRoastTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'push_roast',
    {
      title: 'Push Roast',
      description:
        'Log / record / save / push / import a single roast batch (Roest log or manual entry) scoped to a green_bean_id. Mirrors the roasts table 1:1 plus the Sprint 2.5 + Phase 2 enrichments (roast_profile_name, tp_time/temp, yellowing_temp, hopper_load_temp, fan_curve, inlet_curve, roest_log_id, roest_notes, end_condition_type/target, fc_total_cracks, fc_audibility 5-value enum per Sprint 11 / migration 061 / RO-CP-3 + Group 3 / migration 066 — adds did_not_fire for the underdeveloped-low-energy-probe case, worth_repeating tristate). UPSERT semantics on (user_id, green_bean_id, batch_id): safe to retry after crash — when a row already exists, the existing roast_id is returned with `created: false` and field values are NOT overwritten (field-level updates run through the roast_id-keyed mutation companion of the same domain). Pull from Roest via the Roest log pull path first when the source is a real machine batch — that returns a normalized roast-shaped payload with most fields populated; augment with prose and push. Returns warnings[] when a green_bean parent has roest_inventory_id NULL but the roast is being pushed with a roest_log_id (orphan reconciliation hint per #R66 — backfill the FK via the green-beans field-level mutation companion). Owned by Roast Recorder per ADR-0011.',
      inputSchema: pushRoastInputSchema,
    },
    withToolErrorLogging('push_roast', async (input) => {
      const payload = input as RoastPayload
      // Sprint 3.2 #3 — cross-field validation on end_condition pair.
      const boundsErr = checkEndConditionBounds(payload.end_condition_type, payload.end_condition_target)
      if (boundsErr) throw new Error(`Validation failed:\n  - ${boundsErr}`)
      const result = await persistRoast(auth.supabase, auth.userId, payload)
      if (!result.ok) {
        if (result.code === 'validation') {
          throw new Error(`Validation failed:\n${result.errors.map((e) => `  - ${e}`).join('\n')}`)
        }
        throw new Error(`Database error: ${result.message}`)
      }
      // Phase 3 (#R47): push_roast itself doesn't trigger queue inserts (the
      // roasts table has no canonical text fields with override flags;
      // canonicals live on the parent green_beans). Always-empty echo
      // preserves response-shape symmetry with push_brew + push_green_bean.
      const out = {
        roast_id: result.roast_id,
        created: result.created,
        warnings: result.warnings,
        queued_for_taxonomy_review: [] as Array<{
          axis: string
          raw_value: string
          queue_id: string
        }>,
      }
      return {
        content: [{ type: 'text', text: JSON.stringify(out) }],
        structuredContent: out,
      }
    }),
  )
}
