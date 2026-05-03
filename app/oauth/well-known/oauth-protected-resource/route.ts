// Sprint 3.0: RFC 9728 Protected Resource Metadata.
// Public URL: /.well-known/oauth-protected-resource (via next.config.js rewrite).
// Tells MCP clients (claude.ai web) where to find the authorization server.

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const origin = new URL(req.url).origin
  const body = {
    resource: `${origin}/api/mcp`,
    authorization_servers: [origin],
    bearer_methods_supported: ['header'],
    resource_documentation: `${origin}/api/mcp`,
  }
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
