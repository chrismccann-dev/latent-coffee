import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { Variables } from '@modelcontextprotocol/sdk/shared/uriTemplate.js'
import { CANONICAL_AXES, getCanonicalPayload } from '@/lib/mcp/canonicals'
import { fetchBrewById, fetchRecentBrews } from '@/lib/mcp/brews'
import { isKnownDoc, listTaxonomyAxes, readDoc, readDocSection } from '@/lib/mcp/docs'
import { registerPushBrewTool } from '@/lib/mcp/push-brew'
import { registerProposeDocChangesTool } from '@/lib/mcp/propose-doc-changes'
import { registerDocTools } from '@/lib/mcp/doc-tools'
import type { McpAuthContext } from '@/lib/mcp/auth'

function templateVar(variables: Variables, key: string): string {
  const raw = variables[key]
  const value = Array.isArray(raw) ? raw[0] : raw
  return typeof value === 'string' ? value : ''
}

export function buildMcpServer(auth: McpAuthContext): McpServer {
  const server = new McpServer({ name: 'latent-coffee', version: '0.2.0' })

  registerCanonicalResources(server)
  registerBrewResources(server, auth)
  registerDocResources(server)
  registerPushBrewTool(server, auth)
  registerProposeDocChangesTool(server, auth)
  registerDocTools(server)

  return server
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

function registerDocResources(server: McpServer) {
  // Bare full-file fetches for the brewing-domain docs.
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
    'docs-roasting',
    'docs://roasting.md',
    {
      title: 'Roasting Master Reference',
      description:
        'Full ROASTING.md served live from the deploy filesystem. Sibling to BREWING.md for the self-roasted side. Compounds edit-by-edit via the V2 sync pipeline + the doc-proposal arbiter. For one section by anchor, use docs://roasting.md#<Section%20Name>.',
      mimeType: 'text/markdown',
    },
    async (uri) => {
      const text = await readDoc('docs://roasting.md')
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

  // Section-anchor variants for the brewing-domain docs.
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
    'docs-roasting-section',
    new ResourceTemplate('docs://roasting.md#{anchor}', { list: undefined }),
    {
      title: 'ROASTING.md (one section)',
      description:
        'Returns the body of one ROASTING.md section by header text (case-sensitive, URL-encoded). Throws if the anchor is not found - useful for catching stale propose_doc_changes citations against this doc.',
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
