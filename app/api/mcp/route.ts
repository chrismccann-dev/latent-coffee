import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { McpAuthError, authErrorResponse, requireApiKey, type McpAuthContext } from '@/lib/mcp/auth'
import { buildMcpServer } from '@/lib/mcp/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

async function handleMcpRequest(req: Request): Promise<Response> {
  let auth: McpAuthContext
  try {
    auth = await requireApiKey(req)
  } catch (err) {
    if (err instanceof McpAuthError) return authErrorResponse(err)
    throw err
  }

  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  })
  const server = buildMcpServer(auth)
  await server.connect(transport)
  return transport.handleRequest(req)
}

export const POST = handleMcpRequest
export const GET = handleMcpRequest
export const DELETE = handleMcpRequest
