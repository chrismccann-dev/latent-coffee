import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { Terroir } from '@/lib/types'
import { runSynthesis } from '@/lib/synthesis/runSynthesis'
import { terroirAdapter } from '@/lib/synthesis/adapters/terroir'

export async function POST(request: Request) {
  const body = await request.json()
  const { terriorIds } = body as { terriorIds: string[] }

  if (!terriorIds?.length) {
    return NextResponse.json({ error: 'terriorIds required' }, { status: 400 })
  }

  const supabase = createClient()

  const { data: terroirs, error } = await supabase
    .from('terroirs')
    .select('*')
    .in('id', terriorIds)

  if (error || !terroirs?.length) {
    return NextResponse.json({ error: 'Terroirs not found' }, { status: 404 })
  }

  const allTerroirs = terroirs as Terroir[]
  const primary = allTerroirs[0]
  const macroName = primary.macro_terroir || primary.admin_region || primary.country

  const { data: brews } = await supabase
    .from('brews')
    .select('*')
    .in('terroir_id', terriorIds)
    .order('created_at', { ascending: false })

  const mesoSet = new Set<string>()
  for (const t of allTerroirs) {
    if (t.meso_terroir) {
      for (const meso of t.meso_terroir.split(',')) {
        const trimmed = meso.trim()
        if (trimmed) mesoSet.add(trimmed)
      }
    }
  }

  try {
    const outcome = await runSynthesis({
      adapter: terroirAdapter,
      entity: { primary, mesoTerroirs: Array.from(mesoSet) },
      entityName: macroName,
      brews: brews ?? [],
    })

    if (outcome.synthesis) {
      await supabase
        .from('terroirs')
        .update({
          synthesis: outcome.synthesis,
          synthesis_brew_count: outcome.brewCount,
        })
        .in('id', terriorIds)
    }

    return NextResponse.json({
      synthesis: outcome.synthesis,
      brew_count: outcome.brewCount,
      message: outcome.message,
    })
  } catch (err: any) {
    console.error('Terroir synthesis error:', err?.message || err)
    return NextResponse.json(
      { error: err?.message || 'Failed to generate synthesis' },
      { status: 500 }
    )
  }
}
