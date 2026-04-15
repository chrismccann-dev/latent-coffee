import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'
import { Cultivar } from '@/lib/types'

const anthropic = new Anthropic()

export async function POST(request: Request) {
  const body = await request.json()
  const { cultivarIds } = body as { cultivarIds: string[] }

  if (!cultivarIds?.length) {
    return NextResponse.json({ error: 'cultivarIds required' }, { status: 400 })
  }

  const supabase = createClient()

  // Fetch all cultivars in this lineage
  const { data: cultivars, error } = await supabase
    .from('cultivars')
    .select('*')
    .in('id', cultivarIds)

  if (error || !cultivars?.length) {
    return NextResponse.json({ error: 'Cultivars not found' }, { status: 404 })
  }

  const allCultivars = cultivars as Cultivar[]
  const primary = allCultivars[0]
  const lineageName = primary.lineage || primary.cultivar_name

  // Fetch brews matching ANY cultivar in this lineage via FK
  const { data: brews } = await supabase
    .from('brews')
    .select('*')
    .in('cultivar_id', cultivarIds)
    .order('created_at', { ascending: false })

  const matchedBrews = brews || []

  if (matchedBrews.length === 0) {
    return NextResponse.json({
      synthesis: null,
      brew_count: 0,
      message: 'No brews found for this lineage'
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
    cultivar_connection: brew.cultivar_connection,
    flavor_notes: brew.flavor_notes,
    classification: brew.classification,
    brewer: brew.brewer,
    extraction_strategy: brew.extraction_strategy,
    what_i_learned: brew.what_i_learned,
  })).filter(d =>
    d.key_takeaways?.length || d.peak_expression || d.temperature_evolution || d.cultivar_connection || d.what_i_learned
  )

  if (learningData.length === 0) {
    return NextResponse.json({
      synthesis: null,
      brew_count: matchedBrews.length,
      message: 'Brews found but no learning data to synthesize'
    })
  }

  const cultivarNames = allCultivars.map(c => c.cultivar_name).join(', ')

  const prompt = `You are a coffee research assistant helping synthesize brewing knowledge about the "${lineageName}" lineage (${primary.species}, ${primary.genetic_family}).

This lineage includes the following cultivar subtypes: ${cultivarNames}.

Here is all the brewing data collected across ${matchedBrews.length} coffees in this lineage:

${JSON.stringify(learningData, null, 2)}

Write a SHORT synthesis — strictly 2-4 sentences, one paragraph, no more than 80 words. Distill the single most important pattern about brewing this lineage, plus one actionable tip.

Write in first person ("I've found that..."). Be specific with temperatures, techniques, and flavor descriptors where the data supports it. No bullet points, no headers — just flowing prose.`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    })

    const synthesis = message.content[0].type === 'text' ? message.content[0].text : null

    // Save synthesis to all cultivars in the lineage
    if (synthesis) {
      await supabase
        .from('cultivars')
        .update({
          synthesis,
          synthesis_brew_count: matchedBrews.length,
        })
        .in('id', cultivarIds)
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
