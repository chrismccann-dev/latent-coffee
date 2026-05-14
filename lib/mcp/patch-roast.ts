import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { patchRoast, ROAST_PATCH_FIELDS, type PatchRoastPayload } from '@/lib/roast-import'
import type { McpAuthContext } from '@/lib/mcp/auth'
import { checkEndConditionBounds } from '@/lib/mcp/end-condition-bounds'
import { withToolErrorLogging } from '@/lib/mcp/tool-wrapper'

export const patchRoastInputSchema = {
  roast_id: z.string().uuid().describe(
    'PK of the roast row to update. Get via get_bean_pipeline (returns roasts[] with id keyed by batch_id).',
  ),
  // UPSERT-key fields — patchable but rarely changed
  green_bean_id: z.string().uuid().optional().nullable(),
  batch_id: z.string().optional(),
  // Pass-through fields (mirror push_roast)
  roast_date: z.string().optional().nullable(),
  coffee_name: z.string().optional().nullable(),
  profile_link: z.string().optional().nullable(),
  drum_direction: z.string().optional().nullable(),
  batch_size_g: z.number().optional().nullable(),
  roasted_weight_g: z.number().optional().nullable(),
  weight_loss_pct: z.number().optional().nullable(),
  agtron: z.number().optional().nullable(),
  color_description: z.string().optional().nullable(),
  yellowing_time: z.string().optional().nullable(),
  fc_start: z.string().optional().nullable(),
  drop_time: z.string().optional().nullable(),
  charge_temp: z.number().optional().nullable(),
  fc_temp: z.number().optional().nullable(),
  drop_temp: z.number().optional().nullable(),
  dev_time_s: z.number().int().optional().nullable(),
  dev_ratio: z.string().optional().nullable(),
  roast_profile_name: z.string().optional().nullable(),
  tp_time: z.string().optional().nullable(),
  tp_temp: z.number().optional().nullable(),
  yellowing_temp: z.number().optional().nullable(),
  hopper_load_temp: z.number().optional().nullable(),
  fan_curve: z.string().optional().nullable(),
  inlet_curve: z.string().optional().nullable(),
  roest_log_id: z.number().int().optional().nullable(),
  // Phase 2 (#R57 / #R58 / #R61)
  roest_notes: z.string().optional().nullable().describe(
    'Pass-through Roest UI Notes. See push_roast.roest_notes - same semantics.',
  ),
  end_condition_type: z.enum(['bean_temp', 'dev_time', 'manual']).optional().nullable().describe(
    'Drop trigger as set on the Roest profile. See push_roast.end_condition_type.',
  ),
  end_condition_target: z.number().optional().nullable(),
  fc_total_cracks: z.number().int().min(0).optional().nullable(),
  what_worked: z.string().optional().nullable(),
  what_didnt: z.string().optional().nullable(),
  what_to_change: z.string().optional().nullable(),
  // Phase 2 (#R62) — tristate. Boolean accepted for back-compat (coerced).
  worth_repeating: z.union([z.boolean(), z.enum(['yes', 'no', 'pending'])]).optional().nullable().describe(
    'Tristate: "yes" | "no" | "pending". See push_roast.worth_repeating - same semantics.',
  ),
  is_reference: z.boolean().optional().nullable(),
  // Sub Pages 6.1 (migration 052)
  recipe_id: z.string().uuid().optional().nullable().describe(
    'FK to roast_recipes.id — design intent. Back-fill via patch_roast when the recipe row landed after the roast (e.g. retroactively wiring up an older lot to its recipes during Phase 3).',
  ),
}

export function registerPatchRoastTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'patch_roast',
    {
      title: 'Patch Roast',
      description:
        'Update / mark / fix / save / record / push field-level changes to an existing roast batch by roast_id. Sibling of push_roast (for new batches). Use this to mark a batch as the lot reference (`is_reference: true`) once Day-7 cupping confirms the winner, for post-hoc enrichment (fan_curve / inlet_curve / agtron added after the initial Roest pull, prose fields filled in days later), or any field-level correction. Field-level mutation: only fields you EXPLICITLY supply are updated; omitted fields are untouched. To find roast_id: call get_bean_pipeline (returns roasts[] with id keyed by batch_id). Returns { roast_id, updated_fields: [...], canonical_values: { ... } } — updated_fields echoes which columns landed; canonical_values echoes the actual values of enum-validated fields (end_condition_type, worth_repeating) so the caller can confirm the vocabulary landed without a follow-up read.',
      inputSchema: patchRoastInputSchema,
    },
    withToolErrorLogging('patch_roast', async (input) => {
      const payload = input as PatchRoastPayload
      // Sprint 3.2 #3 — cross-field validation when end_condition pair supplied.
      const boundsErr = checkEndConditionBounds(payload.end_condition_type, payload.end_condition_target)
      if (boundsErr) throw new Error(`Validation failed:\n  - ${boundsErr}`)
      const result = await patchRoast(auth.supabase, auth.userId, payload)
      if (!result.ok) {
        if (result.code === 'validation') {
          throw new Error(`Validation failed:\n${result.errors.map((e) => `  - ${e}`).join('\n')}`)
        }
        if (result.code === 'no_op') throw new Error(result.message)
        if (result.code === 'not_found') throw new Error(result.message)
        throw new Error(`Database error: ${result.message}`)
      }
      // Echo the diff. Mirrors patch_inventory + patch_experiment. Round-5
      // dogfood symmetry sweep (2026-05-10).
      const payloadObj = payload as unknown as Record<string, unknown>
      const updated_fields = ROAST_PATCH_FIELDS.filter(
        (k) => k in payloadObj && payloadObj[k] !== undefined,
      )
      // Round-7 dogfood (2026-05-12): echo VALUES of enum-validated fields
      // so the caller can confirm the level / vocabulary landed without a
      // follow-up read.
      const canonical_values: Record<string, unknown> = {}
      if (payloadObj.end_condition_type !== undefined) {
        canonical_values.end_condition_type = payloadObj.end_condition_type
      }
      if (payloadObj.worth_repeating !== undefined) {
        canonical_values.worth_repeating = payloadObj.worth_repeating
      }
      const out = { roast_id: result.roast_id, updated_fields, canonical_values }
      return {
        content: [{ type: 'text', text: JSON.stringify(out) }],
        structuredContent: out,
      }
    }),
  )
}
