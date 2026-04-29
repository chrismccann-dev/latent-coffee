import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { Variables } from '@modelcontextprotocol/sdk/shared/uriTemplate.js'
import { CANONICAL_AXES, getCanonicalPayload } from '@/lib/mcp/canonicals'
import { fetchBrewById, fetchRecentBrews } from '@/lib/mcp/brews'
import { listDocs, readDoc } from '@/lib/mcp/docs'
import { registerPushBrewTool } from '@/lib/mcp/push-brew'
import type { McpAuthContext } from '@/lib/mcp/auth'

function templateVar(variables: Variables, key: string): string {
  const raw = variables[key]
  const value = Array.isArray(raw) ? raw[0] : raw
  return typeof value === 'string' ? value : ''
}

export function buildMcpServer(auth: McpAuthContext): McpServer {
  const server = new McpServer({ name: 'latent-coffee', version: '0.1.0' })

  registerCanonicalResources(server)
  registerBrewResources(server, auth)
  registerDocResources(server)
  registerPushBrewTool(server, auth)

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
  for (const doc of listDocs()) {
    server.registerResource(
      doc.name,
      doc.uri,
      { title: doc.title, description: 'Repo file served live from filesystem.', mimeType: doc.mimeType },
      async (uri) => {
        const text = await readDoc(uri.href)
        return {
          contents: [
            {
              uri: uri.href,
              mimeType: doc.mimeType,
              text,
            },
          ],
        }
      },
    )
  }
}
