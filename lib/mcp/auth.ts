import { createHash } from 'crypto'
import type { SupabaseClient } from '@supabase/supabase-js'
import { createServiceClient } from '@/lib/supabase/service'

export class McpAuthError extends Error {
  constructor(public reason: 'missing' | 'malformed' | 'unknown') {
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
  const { data, error } = await supabase
    .from('api_keys')
    .select('id, user_id')
    .eq('key_hash', hashKey(raw))
    .is('revoked_at', null)
    .maybeSingle()
  if (error) throw error
  if (!data) throw new McpAuthError('unknown')

  // Fire-and-forget last-used timestamp; don't block the request on it.
  void supabase.from('api_keys').update({ last_used_at: new Date().toISOString() }).eq('id', data.id)

  return { userId: data.user_id, supabase }
}

export function authErrorResponse(err: McpAuthError): Response {
  const body = {
    jsonrpc: '2.0' as const,
    error: { code: -32001, message: `Authentication failed: ${err.reason}` },
    id: null,
  }
  return new Response(JSON.stringify(body), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  })
}
