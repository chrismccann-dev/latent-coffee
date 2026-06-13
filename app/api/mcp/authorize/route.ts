// Sprint 3.0: OAuth 2.1 Authorization endpoint.
// Public URL: /api/mcp/authorize
//
// claude.ai web sends the user-agent here to start the OAuth flow. We:
//   1. Validate the request shape (response_type, client_id, redirect_uri,
//      code_challenge, code_challenge_method, resource).
//   2. Check Supabase session. If logged in, mint an auth code and redirect
//      back to redirect_uri with code + state. If not, redirect to /login
//      with ?next= preserving all query params, then come back here after
//      sign-in to complete the flow.
//
// No consent screen — single-user, you're approving your own integration.

import { randomBytes } from 'crypto'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ALLOWED_REDIRECT_URI = 'https://claude.ai/api/mcp/auth_callback'
const CODE_TTL_SECONDS = 300

function errorRedirect(redirectUri: string | null, state: string | null, error: string, description?: string): NextResponse {
  if (!redirectUri) {
    return NextResponse.json({ error, error_description: description ?? error }, { status: 400 })
  }
  const url = new URL(redirectUri)
  url.searchParams.set('error', error)
  if (description) url.searchParams.set('error_description', description)
  if (state) url.searchParams.set('state', state)
  return NextResponse.redirect(url)
}

export async function GET(req: Request) {
  try {
    return await handleAuthorize(req)
  } catch (err) {
    // Sprint 3.2 #9 — top-level wrapper. Unhandled errors used to bubble up
    // as Next.js default HTML 500s; OAuth callers expect JSON / 302 with
    // ?error params. We can't redirect without a validated redirect_uri, so
    // fall back to a JSON 500 with the inner err logged.
    console.error('[mcp/authorize] unhandled error:', err)
    return NextResponse.json(
      { error: 'server_error', error_description: 'unexpected authorize endpoint error' },
      { status: 500 },
    )
  }
}

async function handleAuthorize(req: Request): Promise<NextResponse> {
  const u = new URL(req.url)
  const params = u.searchParams

  const responseType = params.get('response_type')
  const clientId = params.get('client_id')
  const redirectUri = params.get('redirect_uri')
  const state = params.get('state')
  const codeChallenge = params.get('code_challenge')
  const codeChallengeMethod = params.get('code_challenge_method') ?? 'plain'
  const scope = params.get('scope')
  const resource = params.get('resource')

  // 1. redirect_uri exact-match against the published claude.ai callback.
  //    Validated FIRST so we don't redirect errors to attacker-controlled URIs.
  if (!redirectUri || redirectUri !== ALLOWED_REDIRECT_URI) {
    return NextResponse.json(
      { error: 'invalid_request', error_description: 'redirect_uri must be the registered claude.ai callback' },
      { status: 400 },
    )
  }

  // 2. response_type=code only.
  if (responseType !== 'code') {
    return errorRedirect(redirectUri, state, 'unsupported_response_type', 'only response_type=code is supported')
  }

  // 3. client_id matches the env-configured static client.
  const expectedClientId = process.env.OAUTH_CLIENT_ID
  if (!expectedClientId) {
    return errorRedirect(redirectUri, state, 'server_error', 'OAUTH_CLIENT_ID not configured')
  }
  if (clientId !== expectedClientId) {
    return errorRedirect(redirectUri, state, 'invalid_client', 'unknown client_id')
  }

  // 4. PKCE S256 required.
  if (!codeChallenge) {
    return errorRedirect(redirectUri, state, 'invalid_request', 'code_challenge is required')
  }
  if (codeChallengeMethod !== 'S256') {
    return errorRedirect(redirectUri, state, 'invalid_request', 'code_challenge_method must be S256')
  }

  // 5. resource (RFC 8707) must be the canonical MCP server URI.
  const expectedResource = `${u.origin}/api/mcp`
  if (!resource || resource !== expectedResource) {
    return errorRedirect(
      redirectUri,
      state,
      'invalid_target',
      `resource must be ${expectedResource}`,
    )
  }

  // 6. Supabase session check. If not logged in, bounce to /login?next=<this>.
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    const next = `${u.pathname}${u.search}`
    return NextResponse.redirect(`${u.origin}/login?next=${encodeURIComponent(next)}`)
  }

  // 6b. Owner pin (remediation #2). This is a single-user app, but the endpoint
  //     previously minted a token for ANY logged-in user. Only the owner may
  //     complete the flow. Fail closed if OWNER_USER_ID is unconfigured —
  //     existing tokens keep working; only NEW authorizations are blocked.
  const ownerId = process.env.OWNER_USER_ID
  if (!ownerId) {
    return errorRedirect(redirectUri, state, 'server_error', 'OWNER_USER_ID not configured')
  }
  if (user.id !== ownerId) {
    return errorRedirect(redirectUri, state, 'access_denied', 'not authorized for this resource')
  }

  // 7. Mint authorization code.
  const code = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + CODE_TTL_SECONDS * 1000).toISOString()

  const service = createServiceClient()
  const { error } = await service.from('oauth_authorization_codes').insert({
    code,
    user_id: user.id,
    client_id: clientId,
    redirect_uri: redirectUri,
    resource,
    code_challenge: codeChallenge,
    code_challenge_method: codeChallengeMethod,
    scope,
    expires_at: expiresAt,
  })
  if (error) {
    console.error('[mcp/authorize] failed to insert auth code:', error)
    return errorRedirect(redirectUri, state, 'server_error', 'failed to issue authorization code')
  }

  // 8. Redirect back to claude.ai with code + state.
  const callback = new URL(redirectUri)
  callback.searchParams.set('code', code)
  if (state) callback.searchParams.set('state', state)
  return NextResponse.redirect(callback)
}
