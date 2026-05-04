import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { fetchBrewById } from '@/lib/mcp/brews'
import type { McpAuthContext } from '@/lib/mcp/auth'

// get_brew — Tool surface for the brews://by-id/{uuid} Resource.
//
// Why this Tool exists (MCP feedback batch 12, Sprint 3.0 Phase D, 2026-05-03):
// Same architectural reason as list_recent_brews — Resources aren't visible
// to the model on claude.ai web. Pair the two Tools so list-then-drill works:
// list_recent_brews returns a trimmed shape with brew_ids, get_brew(brew_id)
// returns the full row with all FK joins.

export const getBrewInputSchema = {
  brew_id: z
    .string()
    .uuid()
    .describe(
      'UUID of the brew row to fetch. Typically obtained from list_recent_brews / get_bean_pipeline / push_brew, or remembered from a prior conversation.',
    ),
}

export function registerGetBrewTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'get_brew',
    {
      title: 'Get Brew',
      description:
        'Fetch / get / read / show / look up / pull / find a single brew row by brew_id. Returns the full row with all columns and FK joins (terroir, cultivar, green_bean) — use this when list_recent_brews surfaced a brew you want full detail on, when claude.ai gets a brew_id from a previous conversation and needs to recover its content, or when push_brew returns a brew_id and you want to verify what landed. The trimmed shape from list_recent_brews already covers most fields; reach for get_brew when you need fields list_recent_brews omits or want to confirm post-write state. Errors with not_found if no matching row exists for this user.',
      inputSchema: getBrewInputSchema,
    },
    async (input) => {
      const { brew_id } = input as { brew_id: string }
      const row = await fetchBrewById(auth.supabase, auth.userId, brew_id)
      if (!row) {
        throw new Error(`Brew ${brew_id} not found (or not owned by this api_key's user)`)
      }
      return {
        content: [{ type: 'text', text: JSON.stringify(row) }],
        structuredContent: row,
      }
    },
  )
}
