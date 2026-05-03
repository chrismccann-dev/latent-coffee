import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { patchBrew } from '@/lib/brew-import'

// Sprint 2.6: PATCH route is now a thin NextResponse wrapper around
// `patchBrew()` in lib/brew-import.ts. The underlying validation +
// canonicalize logic is shared verbatim with the MCP `patch_brew` Tool —
// single source of truth for brew patch semantics.
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 })
  }

  const result = await patchBrew(supabase, user.id, params.id, body)
  if (result.ok) {
    return NextResponse.json({ ok: true, brewId: result.brewId })
  }
  if (result.code === 'validation') {
    return NextResponse.json({ error: 'validation', errors: result.errors }, { status: 400 })
  }
  if (result.code === 'no_op') {
    return NextResponse.json({ error: result.message }, { status: 400 })
  }
  if (result.code === 'not_found') {
    return NextResponse.json({ error: result.message }, { status: 404 })
  }
  return NextResponse.json({ error: result.message }, { status: 500 })
}
