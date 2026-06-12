import { createHash } from 'crypto'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createServiceClient } from '@/lib/supabase/service'

export class McpAuthError extends Error {
  constructor(public reason: 'missing' | 'malformed' | 'unknown' | 'expired') {
    super(reason)
  }
}

export type McpAuthContext = {
  userId: string
  supabase: SupabaseClient
}

function hashKey(raw: string): string {
  return createHash('sha256').update(raw).digest('hex')
}

function extractBearer(req: Request): string {
  const header = req.headers.get('authorization')
  if (!header) throw new McpAuthError('missing')
  const parts = header.split(/\s+/)
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer' || !parts[1]) {
    throw new McpAuthError('malformed')
  }
  return parts[1]
}

export async function requireApiKey(req: Request): Promise<McpAuthContext> {
  const raw = extractBearer(req)
  const supabase = createServiceClient()
  // `select('*')` (not an explicit column list) is deliberate: it keeps this
  // lookup working even if migration 081 (expires_at) hasn't been applied yet —
  // a missing column is simply absent from the row rather than erroring the
  // whole query, so the auth path can't 500 during a migration/deploy window.
  const { data, error } = await supabase
    .from('api_keys')
    .select('*')
    .eq('key_hash', hashKey(raw))
    .is('revoked_at', null)
    .maybeSingle()
  if (error) throw error
  if (!data) throw new McpAuthError('unknown')

  // Security remediation #1: enforce token expiry server-side. NULL expires_at
  // = non-expiring (legacy desktop key, or pre-migration rows). OAuth-minted
  // tokens carry now()+TTL and are rejected once past it.
  if (data.expires_at && new Date(data.expires_at).getTime() <= Date.now()) {
    throw new McpAuthError('expired')
  }

  // Fire-and-forget last-used timestamp; don't block the request on it.
  // (Remediation #7: the previous `void <builder>` never executed — supabase-js
  // builders are lazy thenables, so the HTTP request only fires once awaited /
  // .then()'d. This restores the leaked-key detection signal.)
  supabase
    .from('api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', data.id)
    .then(({ error: updateErr }) => {
      if (updateErr) console.error('[mcp/auth] last_used_at update failed:', updateErr)
    })

  return { userId: data.user_id, supabase }
}

function resourceMetadataUrl(req: Request): string {
  const u = new URL(req.url)
  return `${u.origin}/.well-known/oauth-protected-resource`
}

export function authErrorResponse(err: McpAuthError, req?: Request): Response {
  const body = {
    jsonrpc: '2.0' as const,
    error: { code: -32001, message: `Authentication failed: ${err.reason}` },
    id: null,
  }
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (req) {
    // RFC 9728 / MCP authorization spec: 401 must point clients at the resource metadata
    // so they can discover the authorization server and start the OAuth flow.
    headers['WWW-Authenticate'] = `Bearer realm="latent-coffee-mcp", resource_metadata="${resourceMetadataUrl(req)}"`
  }
  return new Response(JSON.stringify(body), {
    status: 401,
    headers,
  })
}
