import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { patchRoastLearnings, type PatchRoastLearningsPayload } from '@/lib/roast-import'
import type { McpAuthContext } from '@/lib/mcp/auth'

export const patchRoastLearningsInputSchema = {
  roast_learnings_id: z.string().uuid().describe(
    'PK of the roast_learnings row to update (one row per closed bean). Get via get_bean_pipeline (returns roast_learnings.id).',
  ),
  // UPSERT-key — patchable but rarely changed
  green_bean_id: z.string().uuid().optional().nullable(),
  // Pass-through fields (mirror push_roast_learnings)
  best_batch_id: z.string().optional().nullable(),
  why_this_roast_won: z.string().optional().nullable(),
  aromatic_behavior: z.string().optional().nullable(),
  structural_behavior: z.string().optional().nullable(),
  elasticity: z.string().optional().nullable(),
  roast_window_width: z.string().optional().nullable(),
  primary_lever: z.string().optional().nullable(),
  secondary_levers: z.string().optional().nullable(),
  what_didnt_move_needle: z.string().optional().nullable(),
  underdevelopment_signal: z.string().optional().nullable(),
  overdevelopment_signal: z.string().optional().nullable(),
  cultivar_takeaway: z.string().optional().nullable(),
  general_takeaway: z.string().optional().nullable(),
  reference_roasts: z.string().optional().nullable(),
  starting_hypothesis: z.string().optional().nullable(),
  rest_behavior: z.string().optional().nullable(),
}

export function registerPatchRoastLearningsTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'patch_roast_learnings',
    {
      title: 'Patch Roast Learnings',
      description:
        'Update / save / record / push field-level changes to the per-bean roast lessons row by roast_learnings_id. Sibling of push_roast_learnings (which UPSERTs by green_bean_id, one row per closed bean). Use this for post-close-out edits — e.g. starting_hypothesis revision after a related bean lands, or correcting a prose field on the canonical "lot lessons" record without a full re-push. Field-level mutation: only fields you EXPLICITLY supply are updated; omitted fields are untouched. To find roast_learnings_id: call get_bean_pipeline (returns the roast_learnings record).',
      inputSchema: patchRoastLearningsInputSchema,
    },
    async (input) => {
      const result = await patchRoastLearnings(auth.supabase, auth.userId, input as PatchRoastLearningsPayload)
      if (!result.ok) {
        if (result.code === 'validation') {
          throw new Error(`Validation failed:\n${result.errors.map((e) => `  - ${e}`).join('\n')}`)
        }
        if (result.code === 'no_op') throw new Error(result.message)
        if (result.code === 'not_found') throw new Error(result.message)
        throw new Error(`Database error: ${result.message}`)
      }
      const out = { roast_learnings_id: result.roast_learnings_id }
      return {
        content: [{ type: 'text', text: JSON.stringify(out) }],
        structuredContent: out,
      }
    },
  )
}
