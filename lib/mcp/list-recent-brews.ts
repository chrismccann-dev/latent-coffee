import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { fetchRecentBrews, RECENT_DEFAULT_LIMIT, RECENT_MAX_LIMIT } from '@/lib/mcp/brews'
import type { McpAuthContext } from '@/lib/mcp/auth'

// list_recent_brews — Tool surface for the brews://recent Resource.
//
// Why this Tool exists (MCP feedback batch 12, Sprint 3.0 Phase D, 2026-05-03):
// claude.ai surfaces Tools to the model and Resources only as a catalog. The
// brews://recent Resource has been on the server since Sprint 2.3 but the model
// can't call it directly — the architectural rule re-surfaced cleanly during
// Sprint 3.0's web verification. Promoting to a Tool gives the brewing prompt
// a callable "what did I brew recently?" path on web (Sprint 3.0 made web the
// load-bearing surface; before that desktop's mcp-remote shim could fetch
// Resources via the catalog UI, but web has no equivalent).
//
// The Resource at brews://recent is preserved verbatim — Resources are still
// useful as a catalog UI surface for any client that exposes them, and the
// duplication is invisible from the model's perspective.

export const listRecentBrewsInputSchema = {
  limit: z
    .number()
    .int()
    .min(1)
    .max(RECENT_MAX_LIMIT)
    .optional()
    .describe(
      `Max number of brews to return, latest-first. Default ${RECENT_DEFAULT_LIMIT}, hard cap ${RECENT_MAX_LIMIT}. Bump when you need a wider window for "what have I brewed this month?" / "show me everything since the last bag" queries; leave at default for general "what's recent?" lookups.`,
    ),
}

export function registerListRecentBrewsTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'list_recent_brews',
    {
      title: 'List Recent Brews',
      description:
        `List / fetch / show / view / get / read / browse / pull the most recent brews scoped to the authenticated user. Returns a trimmed JSON array of brew rows ordered latest-first, each carrying id, source, classification, roaster, coffee_name, producer, roast_level, brewer + filter + grinder, recipe (dose / water / ratio / temp / bloom / pour_structure / total_time), structured process columns, extraction_strategy + hybrid_subform + modifiers + extraction_confirmed + strategy_notes + cooling_curve_target, flavors + structure_tags, full taste-arc fields (aroma / attack / mid_palate / body / finish / temperature_evolution / peak_expression / what_i_learned), and FK-joined terroir + cultivar + green_bean. Use to answer "what did I brew recently?" / "show me my last few brews" / "when did I last brew X?" / "pull recent brew history" / "what's the latest in my brew log?" Pair with get_brew(brew_id) to drill into any one row's full detail. Default limit ${RECENT_DEFAULT_LIMIT}, max ${RECENT_MAX_LIMIT}. Filtered fetches (by strategy / process / cultivar / since_date) belong on a future query_brews Tool — this one returns latest-first across all sources.`,
      inputSchema: listRecentBrewsInputSchema,
    },
    async (input) => {
      const limit = (input as { limit?: number }).limit ?? RECENT_DEFAULT_LIMIT
      const rows = await fetchRecentBrews(auth.supabase, auth.userId, limit)
      const out = { count: rows.length, brews: rows }
      return {
        content: [{ type: 'text', text: JSON.stringify(out) }],
        structuredContent: out,
      }
    },
  )
}
