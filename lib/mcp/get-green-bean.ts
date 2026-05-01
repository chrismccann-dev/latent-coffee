import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { lookupGreenBean, type LookupGreenBeanFilter } from '@/lib/roast-import'
import type { McpAuthContext } from '@/lib/mcp/auth'

// get_green_bean — read-only lookup of a green_bean row by lot_id,
// roest_inventory_id, or green_bean_id. Returns the row scoped to the
// authenticated user.
//
// Why this Tool exists (MCP feedback batch 3, 2026-05-01):
// push_green_bean is now UPSERT (returns existing row's IDs on conflict),
// which solves the same-session retry case. But cross-session retry —
// where claude.ai loses conversation context (e.g. computer crash) and
// needs to resume after the bean was already pushed — needs a way to
// recover green_bean_id without re-pushing. The model knows lot_id
// (deterministic from the bean name) and/or roest_inventory_id (from
// list_roest_inventory). This Tool covers both lookup keys.

export const getGreenBeanInputSchema = {
  lot_id: z.string().optional().describe(
    'Stable lot identifier (e.g. CGLE-MANDELA-XO-2026, GV-OMA-25-035). Most common lookup key — every bean has a lot_id, and it\'s deterministic from the bean name.',
  ),
  roest_inventory_id: z.number().int().optional().describe(
    'api.roestcoffee.com /inventories/{id}/. Use when seeded from list_roest_inventory + want to verify the bean is already in DB before push_green_bean.',
  ),
  green_bean_id: z.string().uuid().optional().describe(
    'Direct UUID lookup. Use when you already have the ID and just need the row content (terroir_id, cultivar_id, all fields).',
  ),
}

export function registerGetGreenBeanTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'get_green_bean',
    {
      title: 'Get Green Bean',
      description:
        'Look up / fetch / get / find / read / search an existing green coffee bean lot row by lot_id, roest_inventory_id, or green_bean_id (at least one required). Returns the full green_bean row scoped to the authenticated user. Use AFTER a crash / cross-session retry to recover green_bean_id when push_green_bean returns "already exists" (the UPSERT case where you lost the original ID), or BEFORE push_green_bean to check whether a lot is already in the DB without writing. Returns the row\'s terroir_id + cultivar_id which feed into push_roast / push_experiment / push_roast_learnings as the FK chain. Errors with not_found if no matching row exists for this user.',
      inputSchema: getGreenBeanInputSchema,
    },
    async (input) => {
      const filter = input as LookupGreenBeanFilter
      const result = await lookupGreenBean(auth.supabase, auth.userId, filter)
      if (!result.ok) {
        if (result.code === 'validation') {
          throw new Error(`Validation failed:\n${result.errors.map((e) => `  - ${e}`).join('\n')}`)
        }
        if (result.code === 'not_found') {
          throw new Error(result.message)
        }
        throw new Error(`Database error: ${result.message}`)
      }
      const out = result.row
      return {
        content: [{ type: 'text', text: JSON.stringify(out) }],
        structuredContent: out,
      }
    },
  )
}
