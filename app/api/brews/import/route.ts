import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { persistBrew, type BrewPayload } from '@/lib/brew-import'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as
    | { payload?: BrewPayload; confirmNewTerroir?: boolean; confirmNewCultivar?: boolean }
    | null

  if (!body?.payload) {
    return NextResponse.json({ error: 'payload required' }, { status: 400 })
  }

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const result = await persistBrew(supabase, user.id, body.payload, {
    confirmNewTerroir: body.confirmNewTerroir,
    confirmNewCultivar: body.confirmNewCultivar,
  })

  if (!result.ok) {
    if (result.code === 'validation') {
      return NextResponse.json({ error: 'validation', errors: result.errors ?? [] }, { status: 400 })
    }
    if (result.code === 'confirm_required') {
      return NextResponse.json(
        {
          error: 'confirm_required',
          newTerroir: result.newTerroir,
          newCultivar: result.newCultivar,
        },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: result.message ?? 'unknown error' }, { status: 500 })
  }

  return NextResponse.json({
    brewId: result.brewId,
    terroirId: result.terroirId,
    cultivarId: result.cultivarId,
    createdTerroir: result.createdTerroir,
    createdCultivar: result.createdCultivar,
  })
}
