// Sprint 3.0: RFC 8414 Authorization Server Metadata.
// Public URL: /.well-known/oauth-authorization-server (via next.config.js rewrite).
// Declares the OAuth endpoints + supported flows. claude.ai web reads this to
// know where to send /authorize and /token requests.

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const origin = new URL(req.url).origin
  const body = {
    issuer: origin,
    authorization_endpoint: `${origin}/api/mcp/authorize`,
    token_endpoint: `${origin}/api/mcp/token`,
    response_types_supported: ['code'],
    grant_types_supported: ['authorization_code'],
    code_challenge_methods_supported: ['S256'],
    token_endpoint_auth_methods_supported: ['client_secret_basic', 'client_secret_post'],
    scopes_supported: ['mcp'],
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
