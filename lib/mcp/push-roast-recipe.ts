import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { persistRoastRecipe, type RoastRecipePayload } from '@/lib/roast-import'
import type { McpAuthContext } from '@/lib/mcp/auth'
import { checkEndConditionBounds } from '@/lib/mcp/end-condition-bounds'
import { withToolErrorLogging, throwToolFail, toolJson } from '@/lib/mcp/tool-wrapper'

// push_roast_recipe — UPSERT on (user_id, experiment_id, batch_slot) when both
// fields supplied (canonical V-set framing), otherwise UPSERT on
// (user_id, green_bean_id, recipe_name) for one-off / calibration recipes.
// Sub Pages 6.1 (migration 052, 2026-05-13). See docs/roasting/redesign.md
// §§ 4.3 (field rationale) + 8 (Operational Notes for Claude as Sole Writer).

export const pushRoastRecipeInputSchema = {
  green_bean_id: z.string().uuid().describe('FK to green_beans.id.'),
  experiment_id: z.string().uuid().optional().nullable().describe(
    'FK to experiments.id when this recipe is part of a V-set (v1a / v1b / v1c). Combine with batch_slot to disambiguate. Leave null for one-off / calibration recipes outside the V framing — in that case recipe_name is the disambiguator.',
  ),
  batch_slot: z.string().optional().nullable().describe(
    'Position within the experiment set: "v1a" / "v2b" / "v3c" / "v3d". Required when experiment_id is set; together they form the UPSERT key. Null for one-off recipes.',
  ),
  recipe_name: z.string().optional().nullable().describe(
    'Human-readable recipe name (e.g. "Higuito - v3a", "Calibration shot 91-93C"). Required when experiment_id + batch_slot are null (used as the UPSERT key for one-off recipes). Optional but recommended for V-set recipes — surfaces in the page UI.',
  ),
  parent_recipe_id: z.string().uuid().optional().nullable().describe(
    'Lineage pointer (directional-ancestor, not strict-replication). Set this when v3a was directly informed by v2b\'s design intent — including the case where v3a represents a SHIFTED SPREAD anchored on v2b\'s curve (e.g. "v3a tests peak inlet 2°C below v2b\'s peak, holding everything else constant"), not only the case where v3a is a strict replicate. Makes "what design choices flow from what" queryable. Optional; leave NULL when the recipe is genuinely novel (no prior recipe directly informed this one) or when the lineage is ambiguous across multiple parents.',
  ),
  rationale: z.string().optional().nullable().describe(
    'Per-batch Hypothesis prose — the "why this specific recipe / what we expect to learn from this batch" reasoning. Renders in the design-table Hypothesis row on the waiting-for-next-roast page. Distinct from notes (which is the freer catch-all).',
  ),
  notes: z.string().optional().nullable().describe('General per-recipe notes catch-all.'),
  // Curve definition — bezier shape mirrors push_roast_profile's TEMP_BEZIER /
  // PCT_BEZIER (jsonb in DB). When push_roast_profile sends a profile to the
  // Roest tablet, it should also call this Tool to create / update the
  // corresponding roast_recipes row with the same bezier blobs.
  temperature_bezier: z.unknown().optional().nullable().describe(
    'Inlet temperature curve as bezier control points (jsonb). Same shape as push_roast_profile.temperature_bezier.',
  ),
  fan_bezier: z.unknown().optional().nullable().describe('Fan curve as bezier control points (jsonb).'),
  rpm_bezier: z.unknown().optional().nullable().describe('Drum RPM curve as bezier control points (jsonb).'),
  power_bezier: z.unknown().optional().nullable().describe('Power curve as bezier control points (jsonb). Optional.'),
  end_condition_type: z.string().optional().nullable().describe(
    'Mirrors roasts.end_condition_type enum: "bean_temp" / "dev_time" / "manual". Free text on this column so Roest tablet labels (e.g. "BEAN_TEMP") can pass through verbatim.',
  ),
  end_condition_target: z.number().optional().nullable(),
  preheat_temperature_c: z.number().optional().nullable(),
  charge_temp: z.number().optional().nullable(),
  hopper_load_temp: z.number().optional().nullable(),
  // Design-time predictions (frozen at recipe creation, NOT updated after
  // seeing roast actuals — that goes to experiments.updated_cup_prediction_*).
  predicted_fc_temp: z.number().optional().nullable(),
  predicted_fc_time: z.string().optional().nullable().describe('mm:ss display string (e.g. "3:43").'),
  predicted_total_time: z.string().optional().nullable().describe('mm:ss display string (e.g. "4:17").'),
  predicted_maillard_pct: z.number().optional().nullable(),
  predicted_agtron_wb: z.number().optional().nullable(),
  predicted_cup: z.string().optional().nullable().describe(
    'Frozen design-time cup prediction. Stays put once written — post-roast cup updates go to experiments.updated_cup_prediction_a/b/c/d (the two-moment storage pattern, see docs/roasting/redesign.md § 4.2).',
  ),
  // Drop rules — mockup "Drop Rules" card (two rows per recipe in the
  // waiting-for-next-roast view).
  drop_rule_if_fast: z.string().optional().nullable().describe(
    'What to do if the roast hits end_condition_target before predicted_total_time (e.g. "Let run to 4:10 minimum. Override end condition.").',
  ),
  drop_rule_if_slow: z.string().optional().nullable().describe(
    'What to do if the roast overruns predicted_total_time without hitting end_condition_target (e.g. "Drop at 4:30 regardless of bean temp.").',
  ),
  // Roest linkage — populated when push_roast_profile pushes the recipe to
  // the Roest tablet. Phase 2 of docs/roasting/redesign.md § 7 wires this
  // automatically; for now callers populate manually if known.
  roest_profile_id: z.number().int().optional().nullable(),
  roest_share_url: z.string().optional().nullable(),
  roest_profile_name: z.string().optional().nullable().describe('Exact name on the Roest tablet.'),
  pushed_to_roest_at: z.string().optional().nullable().describe('ISO timestamp the recipe was pushed to Roest.'),
  // Schema sprint S4 (migration 057, 2026-05-18)
  was_backfilled: z.boolean().optional().nullable().describe(
    'Provenance flag — TRUE when this recipe was authored as backfill (design intent recovered AFTER the roast). Set TRUE when calling push_roast_recipe from log-cupping.md STAGE 0 / log-roast.md STAGE 1(b) inline-backfill paths or operational backfill prompts. FALSE (default) for design-time pushes BEFORE the roast — the normal log-roast.md design flow. Pairs with backfill_notes which captures source + date prose. Migration 057 backfilled the 129 migration-052 legacy shells with was_backfilled=true.',
  ),
  backfill_notes: z.string().optional().nullable().describe(
    'Provenance prose for backfilled rows. Standard phrasing: "Recovered from <source> at <event>, <date>". Source examples: "prior session chat memory" / "cupping prose" / "Roest tablet log". Distinct from notes (general catch-all). Only set when was_backfilled=true.',
  ),
}

export function registerPushRoastRecipeTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'push_roast_recipe',
    {
      title: 'Push Roast Recipe',
      description:
        'Create / save / record / push a roast recipe — first-class design-intent entity, separate from the as-recorded roast that executes it. UPSERTs on (user_id, experiment_id, batch_slot) when both supplied (V-set framing — v1a / v1b / v1c are three recipes), otherwise on (user_id, green_bean_id, recipe_name) for one-off recipes outside the V framing. Use when designing an experiment set: create the experiments row first, then 3 (or N) roast_recipes rows referencing it. Recipe-deduplication is deliberate — each batch execution = one recipe, even when curves are identical (matches Roest tablet semantics). Recipe predictions (predicted_fc_temp / predicted_cup / etc.) are frozen at design time; the post-roast cup re-prediction lives on experiments.updated_cup_prediction_* instead. Returns { recipe_id, created }. Owned by Roast Recorder per ADR-0011 (co-owned with Roest API Worker for the post-design linkage path via patch_roast_recipe).',
      inputSchema: pushRoastRecipeInputSchema,
    },
    withToolErrorLogging('push_roast_recipe', async (input) => {
      const payload = input as RoastRecipePayload
      // Sprint 3.2 #3 + #4 — cross-field validation. Recipe rows mirror the
      // profile shape; if the recipe later seeds push_roast_profile, the
      // same bounds apply. power_bezier on roast_recipes follows the same
      // INLET_TEMP-only rule (Chris's exclusive mode).
      const boundsErr = checkEndConditionBounds(payload.end_condition_type, payload.end_condition_target)
      if (boundsErr) throw new Error(`Validation failed:\n  - ${boundsErr}`)
      const pb = payload.power_bezier as unknown
      if (Array.isArray(pb) && pb.length > 0) {
        throw new Error(
          'Validation failed:\n  - power_bezier must be null/empty on INLET_TEMP recipes (Chris\'s exclusive mode — see push_roast_profile). The server controls power to hit inlet target.',
        )
      }
      const result = await persistRoastRecipe(auth.supabase, auth.userId, payload)
      if (!result.ok) throwToolFail(result)
      const out = { recipe_id: result.recipe_id, created: result.created }
      return toolJson(out)
    }),
  )
}
