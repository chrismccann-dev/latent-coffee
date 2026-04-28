import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import * as z from 'zod/v4'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function getServer() {
  const server = new McpServer({
    name: 'latent-coffee',
    version: '0.1.0',
  })

  server.registerResource(
    'probe-canonical',
    'canonicals://test',
    {
      title: 'Probe Canonical',
      description: 'Phase 1 validate-first probe — confirms the HTTP transport works on Vercel.',
      mimeType: 'application/json',
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: 'application/json',
          text: JSON.stringify({ hello: 'world', phase: 1 }),
        },
      ],
    }),
  )

  server.registerTool(
    'echo',
    {
      title: 'Echo',
      description: 'Returns the input message back to the caller. Used to validate the tool call path.',
      inputSchema: { message: z.string().describe('Message to echo') },
    },
    async ({ message }) => ({
      content: [{ type: 'text', text: `echo: ${message}` }],
    }),
  )

  return server
}

async function handleMcpRequest(req: Request): Promise<Response> {
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  })
  const server = getServer()
  await server.connect(transport)
  return transport.handleRequest(req)
}

export const POST = handleMcpRequest
export const GET = handleMcpRequest
export const DELETE = handleMcpRequest
