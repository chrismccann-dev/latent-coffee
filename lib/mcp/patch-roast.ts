import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { patchRoast, type PatchRoastPayload } from '@/lib/roast-import'
import type { McpAuthContext } from '@/lib/mcp/auth'

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
  what_worked: z.string().optional().nullable(),
  what_didnt: z.string().optional().nullable(),
  what_to_change: z.string().optional().nullable(),
  worth_repeating: z.boolean().optional().nullable(),
  is_reference: z.boolean().optional().nullable(),
}

export function registerPatchRoastTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'patch_roast',
    {
      title: 'Patch Roast',
      description:
        'Update / save / record / push field-level changes to an existing roast batch by roast_id. Sibling of push_roast (for new batches). Use this for post-hoc enrichment (fan_curve / inlet_curve / agtron added after the initial Roest pull, prose fields filled in days later, mark `is_reference: true` once Day-7 cupping confirms the lot winner), or any field-level correction. Field-level mutation: only fields you EXPLICITLY supply are updated; omitted fields are untouched. To find roast_id: call get_bean_pipeline (returns roasts[] with id keyed by batch_id).',
      inputSchema: patchRoastInputSchema,
    },
    async (input) => {
      const result = await patchRoast(auth.supabase, auth.userId, input as PatchRoastPayload)
      if (!result.ok) {
        if (result.code === 'validation') {
          throw new Error(`Validation failed:\n${result.errors.map((e) => `  - ${e}`).join('\n')}`)
        }
        if (result.code === 'no_op') throw new Error(result.message)
        if (result.code === 'not_found') throw new Error(result.message)
        throw new Error(`Database error: ${result.message}`)
      }
      const out = { roast_id: result.roast_id }
      return {
        content: [{ type: 'text', text: JSON.stringify(out) }],
        structuredContent: out,
      }
    },
  )
}
