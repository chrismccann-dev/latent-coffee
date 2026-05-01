import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { searchRoestInventories, roestInventoryToPushGreenBeanPayload } from '@/lib/roest-client'
import type { McpAuthContext } from '@/lib/mcp/auth'

// list_roest_inventory — search Chris's Roest inventory (customer 2424).
// Returns an array of inventories with normalized push_green_bean-shaped
// payloads. Use to discover roest_inventory_id values for pull_roest_log
// cross-ref or to seed push_green_bean for a new bean.
//
// Returns up to 50 results by default. Pagination is server-side via Roest;
// the Tool returns the first page only (sufficient for human-in-the-loop
// search workflows).

export const listRoestInventoryInputSchema = {
  search: z.string().optional().describe(
    'Substring search against inventory name (case-insensitive). Roest API behavior. Omit to list all.',
  ),
  archived: z.boolean().optional().describe(
    'Filter by archived status. true = closed/finished lots only. false = active only. Omit for both.',
  ),
  limit: z.number().int().min(1).max(50).optional().describe('Default 20.'),
}

export function registerListRoestInventoryTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'list_roest_inventory',
    {
      title: 'List Roest Inventory',
      description:
        'Search Chris\'s Roest inventory by name (substring) or archived status. Returns normalized push_green_bean-shaped payloads with roest_inventory_id pre-set. Use to discover inventory IDs before calling pull_roest_log on per-batch logs, or to seed push_green_bean for a new bean. Roest credentials never leave the server.',
      inputSchema: listRoestInventoryInputSchema,
    },
    async (input) => {
      const inventories = await searchRoestInventories({
        search: input.search,
        archived: input.archived,
        limit: input.limit ?? 20,
      })
      const normalized = inventories.map(roestInventoryToPushGreenBeanPayload)
      void auth
      const out = { count: normalized.length, inventories: normalized }
      return {
        content: [{ type: 'text', text: JSON.stringify(out) }],
        structuredContent: out,
      }
    },
  )
}
