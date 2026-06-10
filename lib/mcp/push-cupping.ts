import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { persistCupping, type CuppingPayload } from '@/lib/roast-import'
import type { McpAuthContext } from '@/lib/mcp/auth'
import { withToolErrorLogging, throwToolFail, toolJson } from '@/lib/mcp/tool-wrapper'

// push_cupping — single cupping evaluation insert. roast_id is required (FK).
// V4 evaluation protocol is Day 7 pourover — this Tool captures both Day 4
// table cupping (catastrophic-defect screen) and Day 7+ pourover sessions.

export const pushCuppingInputSchema = {
  roast_id: z.string().uuid().describe('FK to roasts.id. Use push_roast first if the batch isn\'t in DB.'),
  cupping_date: z.string().optional().nullable().describe('YYYY-MM-DD.'),
  rest_days: z.number().int().optional().nullable().describe('Days from roast to cupping. V4 evaluation gate: Day 7.'),
  eval_method: z.string().optional().nullable().describe('"Cupping" | "Pourover" | "Espresso" | etc. V4: Day 7 pourover is the only evaluation gate.'),
  recipe_variant: z.string().optional().nullable().describe(
    'OPTIONAL free-text label distinguishing two evaluations on the same (roast_id, cupping_date, eval_method) - the dual-cupping pattern (e.g. xbloom-gate cupping + Balanced-Intensity pourover on the same Day 7 for the same roast). Migration 041 (MCP feedback batch 8). Common labels: "xbloom_gate", "balanced_intensity_pourover", "extraction_push", "full_expression". Leave NULL when only one evaluation per (roast/date/method) exists - the unique constraint uses NULLS NOT DISTINCT so the single-cupping idempotency case still works. Free-text by design; canonicalize later if patterns stabilize.',
  ),
  ground_agtron: z.number().optional().nullable().describe(
    'Ground Agtron pre-brew (Lightcells CM-200). Pair with roasts.agtron for WB-to-Ground delta — V4 primary internal-development signal (target ≤3 points).',
  ),
  ground_color_description: z.string().optional().nullable(),
  aroma: z.string().optional().nullable(),
  flavor: z.string().optional().nullable(),
  acidity: z.string().optional().nullable(),
  sweetness: z.string().optional().nullable().describe(
    'Distinct prose axis from acidity / body / overall (migration 046, 2026-05-07 — surfaced via MCP in Schema sprint S3, 2026-05-18). Do NOT fold sweetness into acidity ("bright + sweet citrus") or body ("syrupy sweetness") — the axis stays implicit and uncross-queryable when you do. Examples: "Moderate, structurally honey-like" / "Hidden behind acidity; emerges at 50°C" / "Layered cane sugar → maple as it cools".',
  ),
  body: z.string().optional().nullable(),
  finish: z.string().optional().nullable(),
  overall: z.string().optional().nullable().describe('Overall impression / verdict prose.'),
  temperature_behavior: z.string().optional().nullable().describe(
    'Parallel to brews.temperature_evolution (migration 046, 2026-05-07 — surfaced via MCP in Schema sprint S3, 2026-05-18). Direction + when + what changes prose across the cooling arc. Examples: "Rose emerges below 50°C" / "Bitter tail resolves on cooling" / "Flattens cooler — V3a pattern".',
  ),
  // Sprint 11 RO-6 (migration 062, 2026-05-20) — character relocation from roast_learnings per ADR-0008.
  aromatic_behavior: z.string().optional().nullable().describe(
    'How aromatics present in time and intensity for THIS cup — immediate vs late-blooming, expressive vs muted, lifted vs grounded, sustained vs transient. Per-tasting observation tied to a specific cupping event. Relocated from roast_learnings in Sprint 11 / migration 062 / ADR-0008 — these describe what a cup IS, not what a lot TAUGHT (lot-aggregate carry-forward lives on roast_learnings.cultivar_takeaway / general_takeaway / etc.). On lots with multiple cuppings, the canonical pourover cupping on the reference roast is the authoritative home.',
  ),
  structural_behavior: z.string().optional().nullable().describe(
    'Shape and balance of acidity, body, and finish for THIS cup, separate from flavor. Per-tasting observation. Relocated from roast_learnings in Sprint 11 / migration 062 / ADR-0008 — see aromatic_behavior for the rationale.',
  ),
  cooling_arc_pattern: z.enum(['degrade', 'hold', 'improve', 'flat']).optional().nullable().describe(
    'Canonical 4-value enum for the cooling-arc SHAPE of this cup (Cluster 2, migration 078). degrade = gets worse as it cools (loses balance / turns bitter / flattens); hold = good and steady, no meaningful change; improve = opens up / gains sweetness / integrates better as it cools; flat = low-amplitude, little movement either way (distinct from hold: flat = muted, hold = good-and-steady). Independent of the temperature_behavior PROSE (which says direction + when + what changes) — this enum exists so cross-lot "which lots cooling-arc degrade vs hold" is canonical-queryable. Set it alongside temperature_behavior when you observe the arc; leave NULL when not assessed.',
  ),
  // Schema sprint S1 (migration 055, 2026-05-18): wb_agtron NOT exposed on
  // push_cupping. persistCupping snapshots roasts.agtron internally via
  // roast_id JOIN at insert time. wb_to_ground_delta is generated automatically.
  // Use patch_cupping(wb_agtron=...) for the rare post-hoc override case.
}

export function registerPushCuppingTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'push_cupping',
    {
      title: 'Push Cupping',
      description:
        'Log / record / save / push / archive a cupping evaluation (Day 7 post-roast pourover or Day 4 table cupping) — STAGE 4 of the self-roasted roasting pipeline; runs after the roast INSERT for each batch you cup. UPSERT semantics on (user_id, roast_id, cupping_date, eval_method, recipe_variant): safe to re-push during mid-iteration syncs — when a row already exists with the same composite key, the existing cupping_id is returned with `created: false` and field values are NOT overwritten (field-level updates run through the cupping-mutation companion of the same domain keyed on the same composite). The optional recipe_variant field lets you push TWO evaluations on the same (roast_id, date, method) for the dual-cupping workflow (e.g. xbloom-gate cupping + Balanced-Intensity pourover on the same Day 7) — set distinct recipe_variant labels per row. When only one evaluation per (roast/date/method) exists, leave recipe_variant NULL (the constraint uses NULLS NOT DISTINCT so single-cupping idempotency still works). Captures eval_method (Cupping vs Pourover), rest_days (V4 evaluation gate is Day 7), ground_agtron (paired with roasts.agtron for WB-to-Ground delta — wb_agtron is auto-snapshot from the joined roast at insert time per Schema sprint S1; wb_to_ground_delta is a generated column), the 10 prose fields (aroma / flavor / acidity / sweetness / body / finish / overall / temperature_behavior / aromatic_behavior / structural_behavior — last two relocated from roast_learnings in Sprint 11 / migration 062 / ADR-0008), and cooling_arc_pattern (canonical degrade / hold / improve / flat enum for the cooling-arc shape, Cluster 2 / migration 078 — independent of the temperature_behavior prose). Requires roast_id from a prior roast INSERT. Server-side date guard (Cluster 2 / migration 078): cupping_date must be at least 1 day after the parent roast\'s roast_date, and a supplied rest_days must match cupping_date − roast_date (±1 day) — a voice-to-text date slip (e.g. a bare "March 31" landing a negative rest_days) is rejected with a readable error rather than written. Returns { cupping_id, created, composite_key: { roast_id, cupping_date, eval_method, recipe_variant } } — composite_key echoes the tuple the row landed under so you can sanity-check without a follow-up read. Owned by Cupping Specialist per ADR-0011.',
      inputSchema: pushCuppingInputSchema,
    },
    withToolErrorLogging('push_cupping', async (input) => {
      const payload = input as CuppingPayload
      const result = await persistCupping(auth.supabase, auth.userId, payload)
      if (!result.ok) throwToolFail(result)
      // Echo the composite-key tuple back so the caller can sanity-check that
      // the row landed under the intended (roast_id, date, method, variant)
      // signature without a follow-up read. Roest write feedback round-4
      // (2026-05-11): when push_cupping creates a row with NULL recipe_variant
      // and a future push under the same (roast_id, date, method) ALSO uses
      // NULL, NULLS NOT DISTINCT collapses both to one row — surfacing the
      // composite key here lets the caller catch the collision before it
      // happens. user_id elided (carried from auth context, never user-supplied).
      const out = {
        cupping_id: result.cupping_id,
        created: result.created,
        composite_key: {
          roast_id: payload.roast_id,
          cupping_date: payload.cupping_date ?? null,
          eval_method: payload.eval_method ?? null,
          recipe_variant: payload.recipe_variant ?? null,
        },
      }
      return toolJson(out)
    }),
  )
}
