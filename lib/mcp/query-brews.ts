import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import {
  fetchBrewsFiltered,
  BREW_SCALAR_COLUMNS,
  QUERY_DEFAULT_COLUMNS,
  RECENT_DEFAULT_LIMIT,
  RECENT_MAX_LIMIT,
  type BrewScalarColumn,
} from '@/lib/mcp/brews'
import { EXTRACTION_STRATEGIES } from '@/lib/brew-import'
import { ROASTER_LOOKUP } from '@/lib/roaster-registry'
import { CULTIVAR_LOOKUP } from '@/lib/cultivar-registry'
import type { McpAuthContext } from '@/lib/mcp/auth'
import { withToolErrorLogging, toolJson } from '@/lib/mcp/tool-wrapper'

// query_brews — targeted brew-corpus lookups (2026-07-27 N=3 graduation).
//
// Why this Tool exists: list_recent_brews has only `limit`, so any question
// narrower than "what's recent?" meant pulling a 100-240K-char window and
// filtering client-side — a hard block on mobile sessions that can't do the
// save-to-file + jq recovery. The recurring shape is the sibling-variant
// lookup by roaster + coffee family (matching a sibling lot's terroir is what
// keeps two lots from the same farm resolving to one canonical row).
// list_recent_brews stays the unfiltered recency feed; this Tool owns filters
// + the trimmed projection.

// readonly arrays → z.enum tuple cast, same idiom as push-brew.
const extractionStrategyEnum = z.enum(EXTRACTION_STRATEGIES as readonly [string, ...string[]])
const brewFieldEnum = z.enum(BREW_SCALAR_COLUMNS as readonly [string, ...string[]])

export const queryBrewsInputSchema = {
  roaster: z
    .string()
    .optional()
    .describe(
      'Filter by roaster. Canonical-resolved through the roaster registry first (so "Hydrangea Coffee" and "Hydrangea Coffee Roasters" hit the same rows), then case-insensitive substring match. The go-to axis for sibling-variant / prior-brew lookups.',
    ),
  coffee_name: z
    .string()
    .optional()
    .describe('Filter by coffee name, case-insensitive substring match (e.g. "Fazenda Um" matches every variant of that farm\'s coffees).'),
  extraction_strategy: extractionStrategyEnum
    .optional()
    .describe('Filter by canonical extraction strategy.'),
  base_process: z
    .enum(['Washed', 'Honey', 'Natural', 'Wet-hulled'])
    .optional()
    .describe('Filter by canonical base process.'),
  cultivar: z
    .string()
    .optional()
    .describe('Filter by cultivar name. Canonical-resolved through the cultivar registry first (so "Geisha" hits "Gesha" rows), then case-insensitive substring match against the FK-joined cultivars row.'),
  since_date: z
    .string()
    .optional()
    .describe('Only brews created on/after this date, ISO format YYYY-MM-DD.'),
  green_bean_id: z
    .string()
    .optional()
    .describe('Filter by green_beans FK — all brews of one self-roasted lot.'),
  fields: z
    .array(brewFieldEnum)
    .optional()
    .describe(
      `Opt-in projection widener. Default rows carry ${QUERY_DEFAULT_COLUMNS.join(', ')} plus the FK-joined terroir / cultivar / green_bean. Pass extra scalar column names to widen (e.g. ["flavors", "what_i_learned", "strategy_notes"]).`,
    ),
  limit: z
    .number()
    .int()
    .min(1)
    .max(RECENT_MAX_LIMIT)
    .optional()
    .describe(`Max rows, latest-first. Default ${RECENT_DEFAULT_LIMIT}, hard cap ${RECENT_MAX_LIMIT}.`),
}

type QueryBrewsInput = {
  roaster?: string
  coffee_name?: string
  extraction_strategy?: string
  base_process?: string
  cultivar?: string
  since_date?: string
  green_bean_id?: string
  fields?: BrewScalarColumn[]
  limit?: number
}

export function registerQueryBrewsTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'query_brews',
    {
      title: 'Query Brews',
      description:
        `Query / search / filter / look up brews by roaster, coffee_name, extraction_strategy, base_process, cultivar, since_date, or green_bean_id — the targeted-question sibling of list_recent_brews (which stays the unfiltered recency feed). Returns a bounded JSON array of trimmed brew rows (identity + core recipe + FK-joined terroir / cultivar / green_bean), latest-first; widen per-call with \`fields\`. Use for "have I brewed this coffee before?" / "what did the sibling lot from this roaster/farm resolve to?" (match its terroir + cultivar so the same farm lands on the same canonical rows) / "show my Hybrid brews" / "all brews of this green lot". Filters AND together. Pair with get_brew(brew_id) for one row's full detail. Default limit ${RECENT_DEFAULT_LIMIT}, max ${RECENT_MAX_LIMIT}.`,
      inputSchema: queryBrewsInputSchema,
    },
    withToolErrorLogging('query_brews', async (rawInput) => {
      const input = rawInput as QueryBrewsInput

      // Resolve registry drift to the canonical form before matching; fall
      // back to the raw input as a substring when the registry can't place it.
      const { fields, limit, roaster, cultivar, ...rest } = input
      const roasterResolved = roaster ? ROASTER_LOOKUP.canonicalize(roaster) : null
      const filters = {
        ...rest,
        roaster: roasterResolved ?? roaster,
        cultivar: cultivar ? (CULTIVAR_LOOKUP.canonicalize(cultivar) ?? cultivar) : undefined,
      }

      const rows = await fetchBrewsFiltered(auth.supabase, auth.userId, filters, limit, fields)
      const out: Record<string, unknown> = { count: rows.length, brews: rows }
      if (roasterResolved && roasterResolved !== roaster) {
        out.roaster_resolved = roasterResolved
      }
      return toolJson(out)
    }),
  )
}
