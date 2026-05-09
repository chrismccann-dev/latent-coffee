import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { runSynthesis } from '@/lib/synthesis/runSynthesis'
import { roasterAdapter } from '@/lib/synthesis/adapters/roaster'

export async function POST(request: Request) {
  const body = await request.json()
  const { roaster } = body as { roaster: string }

  if (!roaster) {
    return NextResponse.json({ error: 'roaster required' }, { status: 400 })
  }

  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { data: brews } = await supabase
    .from('brews')
    .select('*')
    .eq('roaster', roaster)
    .order('created_at', { ascending: false })

  try {
    const outcome = await runSynthesis({
      adapter: roasterAdapter,
      entity: { roaster },
      entityName: roaster,
      brews: brews ?? [],
    })

    if (outcome.synthesis) {
      await supabase.from('roaster_syntheses').upsert({
        user_id: user.id,
        roaster,
        synthesis: outcome.synthesis,
        synthesis_brew_count: outcome.brewCount,
        updated_at: new Date().toISOString(),
      })
    }

    return NextResponse.json({
      synthesis: outcome.synthesis,
      brew_count: outcome.brewCount,
      message: outcome.message,
    })
  } catch (err: any) {
    console.error('Roaster synthesis error:', err?.message || err)
    return NextResponse.json(
      { error: err?.message || 'Failed to generate synthesis' },
      { status: 500 }
    )
  }
}
