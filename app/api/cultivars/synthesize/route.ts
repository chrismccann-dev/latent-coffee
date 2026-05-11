import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { Cultivar } from '@/lib/types'
import { runSynthesis } from '@/lib/synthesis/runSynthesis'
import { cultivarAdapter } from '@/lib/synthesis/adapters/cultivar'

export async function POST(request: Request) {
  const body = await request.json()
  const { cultivarIds } = body as { cultivarIds: string[] }

  if (!cultivarIds?.length) {
    return NextResponse.json({ error: 'cultivarIds required' }, { status: 400 })
  }

  const supabase = createClient()

  const { data: cultivars, error } = await supabase
    .from('cultivars')
    .select('*')
    .in('id', cultivarIds)

  if (error || !cultivars?.length) {
    return NextResponse.json({ error: 'Cultivars not found' }, { status: 404 })
  }

  const primary = (cultivars as Cultivar[])[0]

  const { data: brews } = await supabase
    .from('brews')
    .select('*')
    .in('cultivar_id', cultivarIds)
    .order('created_at', { ascending: false })

  try {
    const outcome = await runSynthesis({
      adapter: cultivarAdapter,
      entity: { primary },
      entityName: primary.cultivar_name,
      brews: brews ?? [],
    })

    if (outcome.synthesis) {
      await supabase
        .from('cultivars')
        .update({
          synthesis: outcome.synthesis,
          synthesis_brew_count: outcome.brewCount,
        })
        .in('id', cultivarIds)
    }

    return NextResponse.json({
      synthesis: outcome.synthesis,
      brew_count: outcome.brewCount,
      message: outcome.message,
    })
  } catch (err: any) {
    console.error('Cultivar synthesis error:', err?.message || err)
    return NextResponse.json(
      { error: err?.message || 'Failed to generate synthesis' },
      { status: 500 }
    )
  }
}
