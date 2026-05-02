import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { fetchByBean } from '@/lib/mcp/roasts'
import type { McpAuthContext } from '@/lib/mcp/auth'

// get_bean_pipeline — read-only fetch of the full SR pipeline for one
// green_bean_id. Returns { green_bean, roasts[], cuppings[], experiments[],
// roast_learnings } in a single call. Mirrors the existing
// roasts://by-bean/{green_bean_id} Resource exactly (same fetchByBean helper).
//
// Why this Tool exists (MCP feedback batch 4, 2026-05-01):
// push_roast is now UPSERT (returns existing roast_id on conflict, per #R13),
// which solves same-payload retry. But cross-session retry where the model
// needs to map batch_id → roast_id for STAGE 4 cuppings (or experiment_id →
// experiment_pk for STAGE 5 updates) needs a bulk read path. Calling
// push_roast 20 times to discover existing roast_ids is wasteful + indirect.
// One get_bean_pipeline call covers the entire FK-chain recovery for a lot.
//
// The Resource (roasts://by-bean/{id}) already exists but isn't reliably
// surfaced to claude.ai's tool_search per the "Tools-as-model-surface"
// architectural rule from MCP feedback batch 2 #8. Tool wrapper closes the
// gap.

export const getBeanPipelineInputSchema = {
  green_bean_id: z.string().uuid().describe(
    'green_bean UUID. Get via get_green_bean({lot_id}) if you only know the lot_id.',
  ),
}

export function registerGetBeanPipelineTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'get_bean_pipeline',
    {
      title: 'Get Bean Pipeline',
      description:
        'Look up / fetch / get / list / read all roasts + cuppings + experiments + roast_learnings for a green coffee bean lot in one call. Returns { green_bean, roasts[], cuppings[], experiments[], roast_learnings }. Use this AFTER a crash / cross-session retry to recover roast_ids (for the push_cupping FK chain), experiment_pks (for push_experiment UPSERT key matching), or just to verify pipeline state across sessions. Most common workflow: get_green_bean({lot_id}) recovers green_bean_id, then get_bean_pipeline({green_bean_id}) recovers all downstream IDs the FK chain needs. Mirrors the roasts://by-bean/{green_bean_id} Resource exactly.',
      inputSchema: getBeanPipelineInputSchema,
    },
    async (input) => {
      const green_bean_id = input.green_bean_id as string
      const payload = await fetchByBean(auth.supabase, auth.userId, green_bean_id)
      if (!payload) {
        throw new Error(
          `Green bean ${green_bean_id} not found (or not owned by this api_key's user). Use get_green_bean({lot_id}) to look up by lot_id, or list_roest_inventory to discover the inventory.`,
        )
      }
      return {
        content: [{ type: 'text', text: JSON.stringify(payload) }],
        structuredContent: payload as unknown as { [k: string]: unknown },
      }
    },
  )
}
