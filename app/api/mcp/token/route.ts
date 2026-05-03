// Sprint 3.0: OAuth 2.1 Token endpoint.
// Public URL: /api/mcp/token
//
// claude.ai web POSTs here with grant_type=authorization_code + code +
// code_verifier + redirect_uri + resource. We:
//   1. Validate client credentials (Basic header OR form body, both spec-allowed).
//   2. Look up the auth code, verify not expired/consumed, redirect_uri + resource match.
//   3. Verify PKCE: sha256(code_verifier) base64url-encoded == stored code_challenge.
//   4. Mark code consumed.
//   5. Mint a new api_keys row, return raw token as access_token.
//
// We can't reuse the existing Bearer because we only store its sha256 hash —
// the raw value isn't recoverable. So /token mints a fresh api_key per
// successful exchange. Same Bearer-validation path on /api/mcp afterward.

import { createHash, randomBytes } from 'crypto'
import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ACCESS_TOKEN_TTL_SECONDS = 31536000 // 1 year — no refresh tokens v1

function errorResponse(error: string, description?: string, status = 400): NextResponse {
  return NextResponse.json(
    { error, ...(description ? { error_description: description } : {}) },
    { status, headers: { 'Cache-Control': 'no-store' } },
  )
}

function parseBasicAuth(header: string | null): { id: string; secret: string } | null {
  if (!header) return null
  const parts = header.split(/\s+/)
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'basic') return null
  try {
    const decoded = Buffer.from(parts[1], 'base64').toString('utf8')
    const colon = decoded.indexOf(':')
    if (colon < 0) return null
    return { id: decoded.slice(0, colon), secret: decoded.slice(colon + 1) }
  } catch {
    return null
  }
}

function base64UrlSha256(input: string): string {
  return createHash('sha256').update(input).digest('base64url')
}

export async function POST(req: Request) {
  // Body can be application/x-www-form-urlencoded (per OAuth 2.1) or JSON.
  let form: URLSearchParams
  const contentType = req.headers.get('content-type') ?? ''
  try {
    if (contentType.includes('application/x-www-form-urlencoded')) {
      form = new URLSearchParams(await req.text())
    } else if (contentType.includes('application/json')) {
      const json = await req.json()
      form = new URLSearchParams(Object.entries(json).map(([k, v]) => [k, String(v)]))
    } else {
      // Be lenient — try form-urlencoded first.
      form = new URLSearchParams(await req.text())
    }
  } catch {
    return errorResponse('invalid_request', 'malformed body')
  }

  // Client credentials: Basic header takes precedence; fall back to body.
  const basic = parseBasicAuth(req.headers.get('authorization'))
  const clientId = basic?.id ?? form.get('client_id')
  const clientSecret = basic?.secret ?? form.get('client_secret')

  const expectedClientId = process.env.OAUTH_CLIENT_ID
  const expectedClientSecret = process.env.OAUTH_CLIENT_SECRET
  if (!expectedClientId || !expectedClientSecret) {
    return errorResponse('server_error', 'OAuth client credentials not configured', 500)
  }
  if (clientId !== expectedClientId || clientSecret !== expectedClientSecret) {
    return errorResponse('invalid_client', 'unknown client credentials', 401)
  }

  const grantType = form.get('grant_type')
  if (grantType !== 'authorization_code') {
    return errorResponse('unsupported_grant_type', 'only authorization_code is supported')
  }

  const code = form.get('code')
  const redirectUri = form.get('redirect_uri')
  const codeVerifier = form.get('code_verifier')
  const resource = form.get('resource')

  if (!code || !redirectUri || !codeVerifier) {
    return errorResponse('invalid_request', 'code, redirect_uri, code_verifier are required')
  }

  const service = createServiceClient()

  const { data: row, error: lookupErr } = await service
    .from('oauth_authorization_codes')
    .select('user_id, client_id, redirect_uri, resource, code_challenge, code_challenge_method, expires_at, consumed_at')
    .eq('code', code)
    .maybeSingle()
  if (lookupErr) {
    console.error('[mcp/token] lookup failed:', lookupErr)
    return errorResponse('server_error', 'failed to look up authorization code', 500)
  }
  if (!row) return errorResponse('invalid_grant', 'unknown code')
  if (row.consumed_at) return errorResponse('invalid_grant', 'code already used')
  if (new Date(row.expires_at).getTime() < Date.now()) {
    return errorResponse('invalid_grant', 'code expired')
  }
  if (row.client_id !== clientId) return errorResponse('invalid_grant', 'client mismatch')
  if (row.redirect_uri !== redirectUri) return errorResponse('invalid_grant', 'redirect_uri mismatch')
  if (resource && resource !== row.resource) {
    return errorResponse('invalid_target', 'resource mismatch')
  }

  // PKCE: sha256(code_verifier), base64url, no padding == stored challenge.
  if (row.code_challenge_method !== 'S256') {
    return errorResponse('invalid_grant', 'unsupported PKCE method on stored code')
  }
  if (base64UrlSha256(codeVerifier) !== row.code_challenge) {
    return errorResponse('invalid_grant', 'PKCE verifier mismatch')
  }

  // Mark consumed BEFORE issuing the token so a duplicate request races itself
  // out via the unique key on `code`.
  const { error: consumeErr } = await service
    .from('oauth_authorization_codes')
    .update({ consumed_at: new Date().toISOString() })
    .eq('code', code)
    .is('consumed_at', null)
  if (consumeErr) {
    console.error('[mcp/token] consume failed:', consumeErr)
    return errorResponse('server_error', 'failed to consume code', 500)
  }

  // Mint a fresh api_keys row. Raw token returned to claude.ai web; only the
  // sha256 hash persists in the table (matches existing Bearer pattern).
  const rawToken = randomBytes(32).toString('base64url')
  const keyHash = createHash('sha256').update(rawToken).digest('hex')
  const { error: keyErr } = await service.from('api_keys').insert({
    user_id: row.user_id,
    key_hash: keyHash,
    label: 'claude-web-oauth',
  })
  if (keyErr) {
    console.error('[mcp/token] api_keys insert failed:', keyErr)
    return errorResponse('server_error', 'failed to issue access token', 500)
  }

  return NextResponse.json(
    {
      access_token: rawToken,
      token_type: 'Bearer',
      expires_in: ACCESS_TOKEN_TTL_SECONDS,
      scope: 'mcp',
    },
    { status: 200, headers: { 'Cache-Control': 'no-store' } },
  )
}
