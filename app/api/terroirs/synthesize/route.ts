import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'
import { Terroir } from '@/lib/types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: Request) {
  const body = await request.json()
  const { terriorIds } = body as { terriorIds: string[] }

  if (!terriorIds?.length) {
    return NextResponse.json({ error: 'terriorIds required' }, { status: 400 })
  }

  const supabase = createClient()

  // Fetch all terroirs in this macro group
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

  // Fetch brews linked to any terroir in the group (via terroir_id FK)
  const { data: brews } = await supabase
    .from('brews')
    .select('*')
    .in('terroir_id', terriorIds)
    .order('created_at', { ascending: false })

  const matchedBrews = brews || []

  if (matchedBrews.length === 0) {
    return NextResponse.json({
      synthesis: null,
      brew_count: 0,
      message: 'No brews found for this terroir'
    })
  }

  // Collect learning data from all matched brews
  const learningData = matchedBrews.map(brew => ({
    coffee_name: brew.coffee_name,
    variety: brew.variety,
    process: brew.process,
    key_takeaways: brew.key_takeaways,
    peak_expression: brew.peak_expression,
    temperature_evolution: brew.temperature_evolution,
    terroir_connection: brew.terroir_connection,
    flavor_notes: brew.flavor_notes,
    classification: brew.classification,
    brewer: brew.brewer,
    extraction_strategy: brew.extraction_strategy,
    what_i_learned: brew.what_i_learned,
  })).filter(d =>
    d.key_takeaways?.length || d.peak_expression || d.temperature_evolution || d.terroir_connection || d.flavor_notes?.length || d.classification || d.what_i_learned
  )

  if (learningData.length === 0) {
    return NextResponse.json({
      synthesis: null,
      brew_count: matchedBrews.length,
      message: 'Brews found but no learning data to synthesize'
    })
  }

  // Collect meso terroir names for context
  const mesoTerroirs = new Set<string>()
  for (const t of allTerroirs) {
    if (t.meso_terroir) {
      for (const meso of t.meso_terroir.split(',')) {
        const trimmed = meso.trim()
        if (trimmed) mesoTerroirs.add(trimmed)
      }
    }
  }

  const prompt = `You are a coffee research assistant helping synthesize brewing knowledge about the "${macroName}" terroir region in ${primary.country}.

This macro terroir includes the following meso terroirs: ${Array.from(mesoTerroirs).join(', ') || 'none specified'}.

Here is all the brewing data collected across ${matchedBrews.length} coffees from this terroir:

${JSON.stringify(learningData, null, 2)}

Write a SHORT synthesis — strictly 2-4 sentences, one paragraph, no more than 80 words. Distill the single most important pattern about how this terroir expresses itself in the cup, plus one actionable brewing tip specific to coffees from this region.

Write in first person ("I've found that..."). Be specific with temperatures, techniques, and flavor descriptors where the data supports it. No bullet points, no headers — just flowing prose.`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    })

    const synthesis = message.content[0].type === 'text' ? message.content[0].text : null

    // Save synthesis to all terroirs in the macro group
    if (synthesis) {
      await supabase
        .from('terroirs')
        .update({
          synthesis,
          synthesis_brew_count: matchedBrews.length,
        })
        .in('id', terriorIds)
    }

    return NextResponse.json({
      synthesis,
      brew_count: matchedBrews.length,
    })
  } catch (err: any) {
    console.error('Anthropic API error:', err?.message || err)
    return NextResponse.json(
      { error: err?.message || 'Failed to generate synthesis' },
      { status: 500 }
    )
  }
}
