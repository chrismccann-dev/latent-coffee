import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { Variables } from '@modelcontextprotocol/sdk/shared/uriTemplate.js'
import { CANONICAL_AXES, getCanonicalPayload } from '@/lib/mcp/canonicals'
import { fetchBrewById, fetchRecentBrews } from '@/lib/mcp/brews'
import { fetchByBean } from '@/lib/mcp/roasts'
import { isKnownDoc, listTaxonomyAxes, readDoc, readDocSection } from '@/lib/mcp/docs'
import { registerPushBrewTool } from '@/lib/mcp/push-brew'
import { registerProposeDocChangesTool } from '@/lib/mcp/propose-doc-changes'
import { registerDocTools } from '@/lib/mcp/doc-tools'
import { registerCanonicalTools } from '@/lib/mcp/canonical-tools'
import { registerPushGreenBeanTool } from '@/lib/mcp/push-green-bean'
import { registerPushRoastTool } from '@/lib/mcp/push-roast'
import { registerPushCuppingTool } from '@/lib/mcp/push-cupping'
import { registerPushExperimentTool } from '@/lib/mcp/push-experiment'
import { registerPushRoastRecipeTool } from '@/lib/mcp/push-roast-recipe'
import { registerPatchRoastRecipeTool } from '@/lib/mcp/patch-roast-recipe'
import { registerPushRoastLearningsTool } from '@/lib/mcp/push-roast-learnings'
import { registerPushRoastProfileTool } from '@/lib/mcp/push-roast-profile'
import { registerPushInventoryTool } from '@/lib/mcp/push-inventory'
import { registerPatchInventoryTool } from '@/lib/mcp/patch-inventory'
import { registerPullRoestLogTool } from '@/lib/mcp/pull-roest-log'
import { registerListRoestInventoryTool } from '@/lib/mcp/list-roest-inventory'
import { registerListRoestLogsTool } from '@/lib/mcp/list-roest-logs'
import { registerGetGreenBeanTool } from '@/lib/mcp/get-green-bean'
import { registerGetBeanPipelineTool } from '@/lib/mcp/get-bean-pipeline'
import { registerListRecentBrewsTool } from '@/lib/mcp/list-recent-brews'
import { registerGetBrewTool } from '@/lib/mcp/get-brew'
import { registerPatchBrewTool } from '@/lib/mcp/patch-brew'
import { registerPatchGreenBeanTool } from '@/lib/mcp/patch-green-bean'
import { registerPatchRoastTool } from '@/lib/mcp/patch-roast'
import { registerPatchCuppingTool } from '@/lib/mcp/patch-cupping'
import { registerPatchExperimentTool } from '@/lib/mcp/patch-experiment'
import { registerPatchRoastLearningsTool } from '@/lib/mcp/patch-roast-learnings'
import { registerListTaxonomyQueueTool } from '@/lib/mcp/list-taxonomy-queue'
import { registerProposeCanonicalAdditionTool } from '@/lib/mcp/propose-canonical-addition'
import { registerResolveQueueEntryTool } from '@/lib/mcp/resolve-queue-entry'
import {
  assertToolDiscoverability,
  type ToolDescriptor,
} from '@/lib/mcp/discoverability-check'
import type { McpAuthContext } from '@/lib/mcp/auth'

function templateVar(variables: Variables, key: string): string {
  const raw = variables[key]
  const value = Array.isArray(raw) ? raw[0] : raw
  return typeof value === 'string' ? value : ''
}

export function buildMcpServer(auth: McpAuthContext): McpServer {
  const server = new McpServer({ name: 'latent-coffee', version: '0.3.0' })

  registerCanonicalResources(server)
  registerBrewResources(server, auth)
  registerRoastResources(server, auth)
  registerDocResources(server)
  registerPushBrewTool(server, auth)
  registerProposeDocChangesTool(server, auth)
  registerDocTools(server)
  registerCanonicalTools(server)
  registerPushGreenBeanTool(server, auth)
  registerPushRoastTool(server, auth)
  registerPushCuppingTool(server, auth)
  registerPushExperimentTool(server, auth)
  registerPushRoastLearningsTool(server, auth)
  registerPushRoastProfileTool(server, auth)
  registerPushRoastRecipeTool(server, auth)
  registerPatchRoastRecipeTool(server, auth)
  registerPushInventoryTool(server, auth)
  registerPatchInventoryTool(server, auth)
  registerPullRoestLogTool(server, auth)
  registerListRoestInventoryTool(server, auth)
  registerListRoestLogsTool(server, auth)
  registerGetGreenBeanTool(server, auth)
  registerGetBeanPipelineTool(server, auth)
  registerListRecentBrewsTool(server, auth)
  registerGetBrewTool(server, auth)
  registerPatchBrewTool(server, auth)
  registerPatchGreenBeanTool(server, auth)
  registerPatchRoastTool(server, auth)
  registerPatchCuppingTool(server, auth)
  registerPatchExperimentTool(server, auth)
  registerPatchRoastLearningsTool(server, auth)
  registerListTaxonomyQueueTool(server, auth)
  registerProposeCanonicalAdditionTool(server, auth)
  registerResolveQueueEntryTool(server, auth)

  // Discoverability guard (MCP feedback batch 4). Dev-only — fires fast on the
  // first MCP request after a tool description regresses into the "Inserts a
  // ..." / "UPSERTs a..." anti-pattern that blocked Stages 1-6 of the Sudan
  // Rume Hybrid Washed dog-food. Production silently skips so a description
  // regression doesn't take down /api/mcp.
  if (process.env.NODE_ENV === 'development') {
    assertToolDiscoverability(collectToolDescriptors(server))
  }

  return server
}

// Walks the SDK-private _registeredTools map. The SDK type annotates this as
// private; we narrow via a single explicit cast in this one spot. If the SDK
// renames the field in a future version, the standalone scripts/check-mcp-
// tools.ts script + the dev-only assertion fail loudly here, surfacing the
// drift before it silently starts skipping the check.
function collectToolDescriptors(server: McpServer): ToolDescriptor[] {
  const internal = server as unknown as {
    _registeredTools?: Record<string, { description?: string }>
  }
  const map = internal._registeredTools ?? {}
  return Object.entries(map).map(([name, tool]) => ({
    name,
    description: tool.description ?? '',
  }))
}

function registerCanonicalResources(server: McpServer) {
  server.registerResource(
    'canonicals',
    new ResourceTemplate('canonicals://{axis}', {
      list: async () => ({
        resources: CANONICAL_AXES.map(({ axis, title, description }) => ({
          uri: `canonicals://${axis}`,
          name: `canonicals/${axis}`,
          title,
          description,
          mimeType: 'application/json',
        })),
      }),
    }),
    {
      title: 'Canonical Registries',
      description:
        'All 12 canonical-taxonomy registries served as JSON. Each axis exposes the registry list, alias map, and any structural metadata (genetic family / strategy tag / grinder valid_settings / etc.).',
      mimeType: 'application/json',
    },
    async (uri, variables) => {
      const axis = templateVar(variables, 'axis')
      const payload = getCanonicalPayload(axis)
      if (!payload) {
        throw new Error(
          `Unknown canonical axis: ${axis}. Valid: ${CANONICAL_AXES.map((a) => a.axis).join(', ')}`,
        )
      }
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify(payload),
          },
        ],
      }
    },
  )
}

function registerBrewResources(server: McpServer, auth: McpAuthContext) {
  server.registerResource(
    'brews-recent',
    'brews://recent',
    {
      title: 'Recent Brews',
      description:
        'Most recent 20 brews scoped to the authenticated user. Returns trimmed JSON with FK-joined terroir / cultivar / green_bean. Filtered fetches (by strategy / process / cultivar) belong on a future query_brews Tool, not this static Resource — the SDK URI matcher is strict on parameterized templates.',
      mimeType: 'application/json',
    },
    async (uri) => {
      const rows = await fetchRecentBrews(auth.supabase, auth.userId)
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify({ count: rows.length, brews: rows }),
          },
        ],
      }
    },
  )

  server.registerResource(
    'brews-by-id',
    new ResourceTemplate('brews://by-id/{uuid}', {
      list: undefined,
    }),
    {
      title: 'Brew by ID',
      description: 'Full brew row with all FK joins (terroir, cultivar, green_bean) for one UUID.',
      mimeType: 'application/json',
    },
    async (uri, variables) => {
      const id = templateVar(variables, 'uuid')
      if (!id) throw new Error('brews://by-id requires a UUID path segment')
      const row = await fetchBrewById(auth.supabase, auth.userId, id)
      if (!row) throw new Error(`Brew ${id} not found (or not owned by this api_key's user)`)
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify(row),
          },
        ],
      }
    },
  )
}

function registerRoastResources(server: McpServer, auth: McpAuthContext) {
  server.registerResource(
    'roasts-by-bean',
    new ResourceTemplate('roasts://by-bean/{green_bean_id}', { list: undefined }),
    {
      title: 'Roasts by Bean',
      description:
        'Full roast history for one green bean: { green_bean, roasts[], cuppings[], experiments[], roast_learnings, roast_recipes[] }. Cuppings are joined via roast_id; experiments + lessons + recipes are filtered by green_bean_id. roast_recipes added Sub Pages 6.1 (2026-05-13). One fat JSON per fetch — mirrors brews://by-id pattern.',
      mimeType: 'application/json',
    },
    async (uri, variables) => {
      const id = templateVar(variables, 'green_bean_id')
      if (!id) throw new Error('roasts://by-bean requires a green_bean_id path segment')
      const payload = await fetchByBean(auth.supabase, auth.userId, id)
      if (!payload) {
        throw new Error(`Green bean ${id} not found (or not owned by this api_key's user)`)
      }
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify(payload),
          },
        ],
      }
    },
  )

  // Sub Pages 6.1 (2026-05-13). roast_recipes is queryable by experiment so
  // claude.ai can look up the design intent for a V-set in one call when
  // logging roasts — discover the recipe_id to set on push_roast via the
  // matching (experiment_id, batch_slot) pair.
  server.registerResource(
    'roast-recipes-by-experiment',
    new ResourceTemplate('roast_recipes://by-experiment/{experiment_id}', { list: undefined }),
    {
      title: 'Roast Recipes by Experiment',
      description:
        'All roast_recipes rows for one experiment (V-set), ordered by batch_slot. Returns { experiment_id, recipes[] }. Use after push_experiment + push_roast_recipe calls when you need to map a Roest log back to its design intent (recipe.id) for push_roast.recipe_id. Sub Pages 6.1 (2026-05-13).',
      mimeType: 'application/json',
    },
    async (uri, variables) => {
      const id = templateVar(variables, 'experiment_id')
      if (!id) throw new Error('roast_recipes://by-experiment requires an experiment_id path segment')
      const { data, error } = await auth.supabase
        .from('roast_recipes')
        .select('*')
        .eq('user_id', auth.userId)
        .eq('experiment_id', id)
        .order('batch_slot', { ascending: true, nullsFirst: false })
      if (error) throw new Error(`roast_recipes fetch failed: ${error.message}`)
      const payload = { experiment_id: id, recipes: data ?? [] }
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: JSON.stringify(payload),
          },
        ],
      }
    },
  )
}

function registerDocResources(server: McpServer) {
  // Bare full-file fetches for the two brewing-domain docs.
  server.registerResource(
    'docs-brewing',
    'docs://brewing.md',
    {
      title: 'Brewing Master Reference',
      description:
        'Full BREWING.md served live from the deploy filesystem. For one section by anchor, use docs://brewing.md#<Section%20Name>.',
      mimeType: 'text/markdown',
    },
    async (uri) => {
      const text = await readDoc('docs://brewing.md')
      return { contents: [{ uri: uri.href, mimeType: 'text/markdown', text }] }
    },
  )

  server.registerResource(
    'docs-brewing-roasters',
    'docs://brewing/roasters.md',
    {
      title: 'Roaster Brewing Lessons',
      description:
        'Per-roaster brewing lessons + house-style cards. Split out of BREWING.md SECTION 2 in Sprint 2.4 so each roaster is a `## {Canonical Name}` section. Use docs://brewing/roasters.md#<Roaster%20Name> for one card.',
      mimeType: 'text/markdown',
    },
    async (uri) => {
      const text = await readDoc('docs://brewing/roasters.md')
      return { contents: [{ uri: uri.href, mimeType: 'text/markdown', text }] }
    },
  )

  // Section-anchor variants for both brewing docs.
  server.registerResource(
    'docs-brewing-section',
    new ResourceTemplate('docs://brewing.md#{anchor}', { list: undefined }),
    {
      title: 'BREWING.md (one section)',
      description:
        'Returns the body of one BREWING.md section by header text (case-sensitive, URL-encoded). Throws if the anchor is not found — useful for catching stale propose_doc_changes citations.',
      mimeType: 'text/markdown',
    },
    async (uri, variables) => {
      const anchor = decodeURIComponent(templateVar(variables, 'anchor'))
      if (!anchor) throw new Error('docs://brewing.md#{anchor} requires an anchor')
      const body = await readDocSection('docs://brewing.md', anchor)
      if (body == null) {
        throw new Error(`Section not found in BREWING.md: ${anchor}`)
      }
      return { contents: [{ uri: uri.href, mimeType: 'text/markdown', text: body }] }
    },
  )

  server.registerResource(
    'docs-brewing-roasters-section',
    new ResourceTemplate('docs://brewing/roasters.md#{anchor}', { list: undefined }),
    {
      title: 'docs/brewing/roasters.md (one section)',
      description:
        'Returns the body of one roaster card by header text (e.g. anchor=Hydrangea%20Coffee). Anchor must match the canonical roaster name exactly.',
      mimeType: 'text/markdown',
    },
    async (uri, variables) => {
      const anchor = decodeURIComponent(templateVar(variables, 'anchor'))
      if (!anchor) throw new Error('docs://brewing/roasters.md#{anchor} requires an anchor')
      const body = await readDocSection('docs://brewing/roasters.md', anchor)
      if (body == null) {
        throw new Error(`Section not found in docs/brewing/roasters.md: ${anchor}`)
      }
      return { contents: [{ uri: uri.href, mimeType: 'text/markdown', text: body }] }
    },
  )

  // ROASTING.md — sibling of BREWING.md. Sprint 2.5 verbatim port from V4.
  server.registerResource(
    'docs-roasting',
    'docs://roasting.md',
    {
      title: 'Roasting Master Reference',
      description:
        'Full ROASTING.md served live from the deploy filesystem. For one section by anchor, use docs://roasting.md#<Section%20Name>. Seeded 2026-04-30 from Coffee_Roasting_Master_Reference_Guide_V4.md (~770 lines, hyphen-normalized).',
      mimeType: 'text/markdown',
    },
    async (uri) => {
      const text = await readDoc('docs://roasting.md')
      return { contents: [{ uri: uri.href, mimeType: 'text/markdown', text }] }
    },
  )

  server.registerResource(
    'docs-roasting-section',
    new ResourceTemplate('docs://roasting.md#{anchor}', { list: undefined }),
    {
      title: 'ROASTING.md (one section)',
      description:
        'Returns the body of one ROASTING.md section by header text (case-sensitive, URL-encoded). Throws if the anchor is not found.',
      mimeType: 'text/markdown',
    },
    async (uri, variables) => {
      const anchor = decodeURIComponent(templateVar(variables, 'anchor'))
      if (!anchor) throw new Error('docs://roasting.md#{anchor} requires an anchor')
      const body = await readDocSection('docs://roasting.md', anchor)
      if (body == null) {
        throw new Error(`Section not found in ROASTING.md: ${anchor}`)
      }
      return { contents: [{ uri: uri.href, mimeType: 'text/markdown', text: body }] }
    },
  )

  // Taxonomy MD files: one bare template + one section template (covers all 10 axes).
  // Distinct from canonicals://{axis} (JSON registry for validation); these serve the
  // human-authored markdown so claude.ai's project no longer has to paste-and-drift.
  server.registerResource(
    'docs-taxonomy',
    new ResourceTemplate('docs://taxonomies/{axis}.md', {
      list: async () => ({
        resources: listTaxonomyAxes().map((axis) => ({
          uri: `docs://taxonomies/${axis}.md`,
          name: `docs/taxonomies/${axis}.md`,
          title: `Taxonomy: ${axis}`,
          mimeType: 'text/markdown',
        })),
      }),
    }),
    {
      title: 'Taxonomy MD (full file)',
      description:
        'Full markdown file for one of the 10 canonical taxonomies (regions, varieties, processes, roasters, producers, brewers, filters, flavors, grinders, roast-levels). Use docs://taxonomies/{axis}.md#<Section%20Name> for one section.',
      mimeType: 'text/markdown',
    },
    async (uri, variables) => {
      const axis = templateVar(variables, 'axis')
      const docUri = `docs://taxonomies/${axis}.md`
      if (!isKnownDoc(docUri)) {
        throw new Error(
          `Unknown taxonomy axis: ${axis}. Valid: ${listTaxonomyAxes().join(', ')}`,
        )
      }
      const text = await readDoc(docUri)
      return { contents: [{ uri: uri.href, mimeType: 'text/markdown', text }] }
    },
  )

  server.registerResource(
    'docs-taxonomy-section',
    new ResourceTemplate('docs://taxonomies/{axis}.md#{anchor}', { list: undefined }),
    {
      title: 'Taxonomy MD (one section)',
      description:
        'Returns the body of one section of a taxonomy markdown file. Throws on unknown axis or missing anchor.',
      mimeType: 'text/markdown',
    },
    async (uri, variables) => {
      const axis = templateVar(variables, 'axis')
      const anchor = decodeURIComponent(templateVar(variables, 'anchor'))
      if (!anchor) throw new Error('docs://taxonomies/{axis}.md#{anchor} requires an anchor')
      const docUri = `docs://taxonomies/${axis}.md`
      if (!isKnownDoc(docUri)) {
        throw new Error(
          `Unknown taxonomy axis: ${axis}. Valid: ${listTaxonomyAxes().join(', ')}`,
        )
      }
      const body = await readDocSection(docUri, anchor)
      if (body == null) {
        throw new Error(`Section not found in ${docUri}: ${anchor}`)
      }
      return { contents: [{ uri: uri.href, mimeType: 'text/markdown', text: body }] }
    },
  )
}
