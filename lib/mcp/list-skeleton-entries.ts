import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { McpAuthContext } from '@/lib/mcp/auth'
import { listSkeletonProducers } from '@/lib/producer-registry'
import { listSkeletonRoasters } from '@/lib/roaster-registry'
import { withToolErrorLogging } from '@/lib/mcp/tool-wrapper'

// list_skeleton_entries — discovery surface for skeleton canonical entries
// (rich-registry entries promoted with thin metadata + an explicit
// `skeleton: true` flag pending arbiter enrichment). Third arbiter queue type
// alongside doc_proposals + taxonomy_overrides_queue.
//
// Why a separate Tool (not an extension of list_taxonomy_queue):
// - Skeleton entries are NOT a queue. They're a fixed registry state with a
//   maintenance backlog. No pending → resolved lifecycle, no per-row decision
//   moment. The `skeleton: true` flag flips false (or is removed) by editing
//   the registry file directly during the arbiter session.
// - Conflating "pending decision" (override queue) with "committed thin state"
//   (skeleton entries) in one Tool muddies the mental model.
//
// Sprint 12 / CR-4 (2026-05-21). Tool count 34 → 35. Pairs with CR-10
// (RoasterEntry.skeleton flag added the same sprint, Latent backfilled).

const AXIS_VALUES = ['producer', 'roaster'] as const

export interface SkeletonEntry {
  axis: (typeof AXIS_VALUES)[number]
  name: string
  // Geography hints for arbiter context.
  country: string | null
  location: string | null
  // What the skeleton entry already has populated. Helps the arbiter judge
  // promote vs. alias-retroactively vs. reject.
  populated_fields: string[]
}

export const listSkeletonEntriesInputSchema = {
  axis: z.enum(AXIS_VALUES).optional().describe(
    'Optional filter: "producer" (currently 5 skeleton entries) or "roaster" (currently 1: Latent). When omitted, returns both axes.',
  ),
}

function summarizeProducer(p: ReturnType<typeof listSkeletonProducers>[number]): SkeletonEntry {
  const populated: string[] = []
  if (p.tier) populated.push('tier')
  if (p.producerSystem) populated.push('producerSystem')
  if (p.referenceRole) populated.push('referenceRole')
  if (p.farmName) populated.push('farmName')
  if (p.country) populated.push('country')
  if (p.adminRegion) populated.push('adminRegion')
  if (p.macroTerroir) populated.push('macroTerroir')
  if (p.farmingModel) populated.push('farmingModel')
  if (p.primaryCultivars?.length) populated.push('primaryCultivars')
  if (p.knownFor?.length) populated.push('knownFor')
  if (p.typicalFlavorProfile?.length) populated.push('typicalFlavorProfile')
  if (p.exporters?.length) populated.push('exporters')
  if (p.importers?.length) populated.push('importers')
  if (p.roasterReferences?.length) populated.push('roasterReferences')
  return {
    axis: 'producer',
    name: p.name,
    country: p.country ?? null,
    location: [p.adminRegion, p.macroTerroir].filter(Boolean).join(' / ') || null,
    populated_fields: populated,
  }
}

function summarizeRoaster(r: ReturnType<typeof listSkeletonRoasters>[number]): SkeletonEntry {
  const populated: string[] = []
  if (r.displayName) populated.push('displayName')
  if (r.location) populated.push('location')
  if (r.country) populated.push('country')
  if (r.strategyTag) populated.push('strategyTag')
  if (r.houseStyle) populated.push('houseStyle')
  if (r.bmrHouseStyle) populated.push('bmrHouseStyle')
  if (r.roastStyle) populated.push('roastStyle')
  if (r.brewGuideLink) populated.push('brewGuideLink')
  if (r.developmentBias) populated.push('developmentBias')
  if (r.restCurve) populated.push('restCurve')
  return {
    axis: 'roaster',
    name: r.name,
    country: r.country ?? null,
    location: r.location ?? null,
    populated_fields: populated,
  }
}

export function registerListSkeletonEntriesTool(server: McpServer, _auth: McpAuthContext) {
  // Underscore-prefix the auth param — registry reads are pure module-level
  // static data, no per-user scoping. Tool still routes through the auth-wrapped
  // registration path for consistency with the rest of the Tool surface.
  server.registerTool(
    'list_skeleton_entries',
    {
      title: 'List Skeleton Canonical Entries',
      description:
        'List / browse / discover skeleton canonical entries — rich-registry entries promoted with thin metadata + `skeleton: true` pending arbiter enrichment. Third arbiter queue type alongside `doc_proposals` (prose) and `taxonomy_overrides_queue` (canonical promotions). Used by Chris-as-arbiter (Claude Code session) during "process pending arbitration" runs. Returns entries from `producer` axis (lib/producer-registry.ts; currently 5 skeleton entries: Miguel Estela / Nelsyn Hernández / Jannette & Kai Janson / + 2 MCP-feedback skeletons) and `roaster` axis (lib/roaster-registry.ts; currently 1: Latent). Each entry surfaces (axis, name, country, location, populated_fields[]) — populated_fields lists which rich-registry fields are already filled so the arbiter can judge promote-to-full vs. alias-retroactively vs. reject. **No DB row, no status flip** — the skeleton flag flips by editing the registry file directly during the arbiter session (`lib/<axis>-registry.ts` + `docs/taxonomies/<axis>.md`). Mirrors the queue-entry resolution path\'s registry-edit pattern. See ARBITER.md § Skeleton review for the full playbook. Sprint 12 / CR-4 (2026-05-21).',
      inputSchema: listSkeletonEntriesInputSchema,
    },
    withToolErrorLogging('list_skeleton_entries', async ({ axis }) => {
      const entries: SkeletonEntry[] = []
      if (!axis || axis === 'producer') {
        for (const p of listSkeletonProducers()) entries.push(summarizeProducer(p))
      }
      if (!axis || axis === 'roaster') {
        for (const r of listSkeletonRoasters()) entries.push(summarizeRoaster(r))
      }
      const out = { entries, total: entries.length }
      return {
        content: [{ type: 'text', text: JSON.stringify(out) }],
        structuredContent: out as unknown as { [k: string]: unknown },
      }
    }),
  )
}
