import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: Request) {
  const body = await request.json()
  const { process: processName } = body as { process: string }

  if (!processName) {
    return NextResponse.json({ error: 'process required' }, { status: 400 })
  }

  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  // Fetch all brews with this process
  const { data: brews } = await supabase
    .from('brews')
    .select('*')
    .eq('process', processName)
    .order('created_at', { ascending: false })

  const matchedBrews = brews || []

  if (matchedBrews.length === 0) {
    return NextResponse.json({
      synthesis: null,
      brew_count: 0,
      message: 'No brews found for this process',
    })
  }

  const learningData = matchedBrews.map(brew => ({
    coffee_name: brew.coffee_name,
    variety: brew.variety,
    roast_level: brew.roast_level,
    key_takeaways: brew.key_takeaways,
    peak_expression: brew.peak_expression,
    temperature_evolution: brew.temperature_evolution,
    flavor_notes: brew.flavor_notes,
    classification: brew.classification,
    brewer: brew.brewer,
    extraction_strategy: brew.extraction_strategy,
    extraction_confirmed: brew.extraction_confirmed,
    what_i_learned: brew.what_i_learned,
  })).filter(d =>
    d.key_takeaways?.length || d.peak_expression || d.temperature_evolution || d.what_i_learned
  )

  if (learningData.length === 0) {
    return NextResponse.json({
      synthesis: null,
      brew_count: matchedBrews.length,
      message: 'Brews found but no learning data to synthesize',
    })
  }

  const prompt = `You are a coffee research assistant helping synthesize brewing knowledge about the "${processName}" process style.

Chris's palate has widened — he used to prize clean, washed, tea-like profiles almost exclusively, but now genuinely enjoys controlled naturals, co-ferments, and red-wine-structured coffees. The synthesis should compound learnings about *when this process delivers vs. when it goes off*, not score the process as good or bad wholesale.

Here is all the brewing data collected across ${matchedBrews.length} coffees using this process:

${JSON.stringify(learningData, null, 2)}

Write a SHORT synthesis — strictly 2-4 sentences, one paragraph, no more than 90 words. Focus on:
- What conditions make this process sing (variety, roast, extraction strategy, temperature window).
- Tipping-point signals — what pushes it from interesting to overdone. Be specific about variety/origin combinations that carry vs. collapse under this style.

Write in first person ("I've found that..."). No bullet points, no headers — flowing prose only.`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 220,
      messages: [{ role: 'user', content: prompt }],
    })

    const synthesis = message.content[0].type === 'text' ? message.content[0].text : null

    if (synthesis) {
      await supabase
        .from('process_syntheses')
        .upsert({
          user_id: user.id,
          process: processName,
          synthesis,
          synthesis_brew_count: matchedBrews.length,
          updated_at: new Date().toISOString(),
        })
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
