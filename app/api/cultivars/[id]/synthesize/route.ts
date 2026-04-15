import { createClient } from '@/lib/supabase/server'
import { getCultivarKeywords, brewMatchesCultivar } from '@/lib/cultivar-matching'
import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic()

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()

  // Fetch the cultivar
  const { data: cultivar, error } = await supabase
    .from('cultivars')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !cultivar) {
    return NextResponse.json({ error: 'Cultivar not found' }, { status: 404 })
  }

  // Fetch brews using text-based matching
  const keywords = getCultivarKeywords(cultivar)
  let brewQuery = supabase
    .from('brews')
    .select('*')
    .order('created_at', { ascending: false })

  if (keywords.length > 0) {
    const orFilters = keywords.map(kw => `variety.ilike.%${kw}%`).join(',')
    brewQuery = brewQuery.or(orFilters)
  }

  const { data: brews } = await brewQuery
  const matchedBrews = (brews || []).filter(brew =>
    brewMatchesCultivar(brew.variety, cultivar)
  )

  if (matchedBrews.length === 0) {
    return NextResponse.json({
      synthesis: null,
      brew_count: 0,
      message: 'No brews found for this cultivar'
    })
  }

  // Collect all learning data from brews
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
  })).filter(d =>
    d.key_takeaways?.length || d.peak_expression || d.temperature_evolution || d.cultivar_connection
  )

  if (learningData.length === 0) {
    return NextResponse.json({
      synthesis: null,
      brew_count: matchedBrews.length,
      message: 'Brews found but no learning data to synthesize'
    })
  }

  // Build the prompt for Claude
  const prompt = `You are a coffee research assistant helping synthesize brewing knowledge about the cultivar "${cultivar.lineage || cultivar.cultivar_name}" (${cultivar.species}, ${cultivar.genetic_family}).

Here is all the brewing data collected across ${matchedBrews.length} coffees with this cultivar:

${JSON.stringify(learningData, null, 2)}

Write a concise synthesis (2-4 sentences, one paragraph) of the most important things learned about brewing this cultivar. Combine insights about:
- What makes this cultivar distinctive in the cup
- Key brewing/extraction patterns that matter
- How temperature and process affect expression
- Any reliable patterns or surprising discoveries

Write in first person ("I've found that...") as if the researcher is summarizing their own findings. Be specific with temperatures, techniques, and flavor descriptors where the data supports it. Do NOT use bullet points — write flowing prose. Focus on actionable knowledge that would help brew this cultivar better next time.`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5-20241022',
    max_tokens: 400,
    messages: [{ role: 'user', content: prompt }],
  })

  const synthesis = message.content[0].type === 'text' ? message.content[0].text : null

  // Save synthesis to the cultivar record
  if (synthesis) {
    await supabase
      .from('cultivars')
      .update({
        synthesis,
        synthesis_brew_count: matchedBrews.length,
      })
      .eq('id', params.id)
  }

  return NextResponse.json({
    synthesis,
    brew_count: matchedBrews.length,
  })
}
