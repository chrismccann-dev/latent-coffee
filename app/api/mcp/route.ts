import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { McpAuthError, authErrorResponse, requireApiKey, type McpAuthContext } from '@/lib/mcp/auth'
import { buildMcpServer } from '@/lib/mcp/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function internalErrorResponse(err: unknown): Response {
  const message = err instanceof Error ? err.message : String(err)
  console.error('[mcp] internal error:', err)
  return new Response(
    JSON.stringify({
      jsonrpc: '2.0',
      error: { code: -32603, message: `Internal error: ${message}` },
      id: null,
    }),
    { status: 500, headers: { 'Content-Type': 'application/json' } },
  )
}

async function handleMcpRequest(req: Request): Promise<Response> {
  let auth: McpAuthContext
  try {
    auth = await requireApiKey(req)
  } catch (err) {
    if (err instanceof McpAuthError) return authErrorResponse(err)
    return internalErrorResponse(err)
  }

  try {
    const transport = new WebStandardStreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    })
    const server = buildMcpServer(auth)
    await server.connect(transport)
    return await transport.handleRequest(req)
  } catch (err) {
    return internalErrorResponse(err)
  }
}

export const POST = handleMcpRequest
export const GET = handleMcpRequest
export const DELETE = handleMcpRequest
