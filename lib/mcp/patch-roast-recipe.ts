import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import {
  patchRoastRecipe,
  ROAST_RECIPE_PATCH_FIELDS,
  type PatchRoastRecipePayload,
} from '@/lib/roast-import'
import type { McpAuthContext } from '@/lib/mcp/auth'
import { checkEndConditionBounds } from '@/lib/mcp/end-condition-bounds'
import { withToolErrorLogging } from '@/lib/mcp/tool-wrapper'

export const patchRoastRecipeInputSchema = {
  recipe_id: z.string().uuid().describe(
    'PK of the roast_recipes row to update. Get via push_roast_recipe (returns { recipe_id }), or via the roasts://by-bean/{green_bean_id} Resource which now joins roast_recipes.',
  ),
  // UPSERT-key fields — patchable but rarely changed
  green_bean_id: z.string().uuid().optional(),
  experiment_id: z.string().uuid().optional().nullable(),
  batch_slot: z.string().optional().nullable(),
  recipe_name: z.string().optional().nullable(),
  // Pass-through fields (mirror push_roast_recipe)
  parent_recipe_id: z.string().uuid().optional().nullable(),
  rationale: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  temperature_bezier: z.unknown().optional().nullable(),
  fan_bezier: z.unknown().optional().nullable(),
  rpm_bezier: z.unknown().optional().nullable(),
  power_bezier: z.unknown().optional().nullable(),
  end_condition_type: z.string().optional().nullable(),
  end_condition_target: z.number().optional().nullable(),
  preheat_temperature_c: z.number().optional().nullable(),
  charge_temp: z.number().optional().nullable(),
  hopper_load_temp: z.number().optional().nullable(),
  predicted_fc_temp: z.number().optional().nullable(),
  predicted_fc_time: z.string().optional().nullable(),
  predicted_total_time: z.string().optional().nullable(),
  predicted_maillard_pct: z.number().optional().nullable(),
  predicted_agtron_wb: z.number().optional().nullable(),
  predicted_cup: z.string().optional().nullable(),
  drop_rule_if_fast: z.string().optional().nullable(),
  drop_rule_if_slow: z.string().optional().nullable(),
  roest_profile_id: z.number().int().optional().nullable(),
  roest_share_url: z.string().optional().nullable(),
  roest_profile_name: z.string().optional().nullable(),
  pushed_to_roest_at: z.string().optional().nullable(),
  // Schema sprint S4 (migration 057, 2026-05-18)
  was_backfilled: z.boolean().optional().nullable().describe(
    'True when the recipe row was populated AFTER the roast it describes, rather than designed up-front. Distinguishes design-time recipes (false) from inline-backfill / migration-052 legacy shells (true). Patch when retroactively marking a legacy recipe as backfilled (e.g. enrichment of a migration-052 shell that\'s since been populated with design intent recovered from session memory).',
  ),
  backfill_notes: z.string().optional().nullable().describe(
    'Free-text note describing the backfill source + date when was_backfilled = true. Standard phrasing: "Recovered from <source> at <event>, <date>".',
  ),
}

export function registerPatchRoastRecipeTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'patch_roast_recipe',
    {
      title: 'Patch Roast Recipe',
      description:
        'Update / save / record / push field-level changes to an existing roast_recipes row by recipe_id (the primary-key path). The companion INSERT path of the same domain UPSERTs by composite (experiment_id, batch_slot) or recipe_name (so iterative design works cleanly); this Tool uses the PK so you can correct the batch_slot label itself, fix prose typos in rationale / notes / drop_rule_*, or backfill Roest linkage (roest_profile_id / roest_share_url) AFTER the Roest profile push lands. Field-level mutation: only fields you EXPLICITLY supply are updated; omitted fields are untouched. Returns { recipe_id, updated_fields: [...] } — updated_fields echoes which columns landed in the patch so you can sanity-check without a follow-up read. Co-owned by Roast Recorder (was_backfilled recipe rows + slot-fallback patches) + Roest API Worker (roest_profile_id / roest_share_url / roest_profile_name / pushed_to_roest_at linkage post Roest-profile push) per ADR-0011.',
      inputSchema: patchRoastRecipeInputSchema,
    },
    withToolErrorLogging('patch_roast_recipe', async (input) => {
      const payload = input as PatchRoastRecipePayload
      // Sprint 3.2 #3 + #4 — cross-field validation when relevant fields supplied.
      const boundsErr = checkEndConditionBounds(payload.end_condition_type, payload.end_condition_target)
      if (boundsErr) throw new Error(`Validation failed:\n  - ${boundsErr}`)
      const pb = payload.power_bezier as unknown
      if (Array.isArray(pb) && pb.length > 0) {
        throw new Error(
          'Validation failed:\n  - power_bezier must be null/empty on INLET_TEMP recipes (Chris\'s exclusive mode — see push_roast_profile). The server controls power to hit inlet target.',
        )
      }
      const result = await patchRoastRecipe(auth.supabase, auth.userId, payload)
      if (!result.ok) {
        if (result.code === 'validation') {
          throw new Error(`Validation failed:\n${result.errors.map((e) => `  - ${e}`).join('\n')}`)
        }
        if (result.code === 'no_op') throw new Error(result.message)
        if (result.code === 'not_found') throw new Error(result.message)
        throw new Error(`Database error: ${result.message}`)
      }
      const payloadObj = payload as unknown as Record<string, unknown>
      const updated_fields = ROAST_RECIPE_PATCH_FIELDS.filter(
        (k) => k in payloadObj && payloadObj[k] !== undefined,
      )
      const out = { recipe_id: result.recipe_id, updated_fields }
      return {
        content: [{ type: 'text', text: JSON.stringify(out) }],
        structuredContent: out,
      }
    }),
  )
}
