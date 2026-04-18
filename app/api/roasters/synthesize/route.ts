import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'
import { getRoasterMetadata } from '@/lib/roaster-registry'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

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

  const matchedBrews = brews || []

  if (matchedBrews.length === 0) {
    return NextResponse.json({
      synthesis: null,
      brew_count: 0,
      message: 'No brews found for this roaster',
    })
  }

  const learningData = matchedBrews.map(brew => ({
    coffee_name: brew.coffee_name,
    variety: brew.variety,
    process: brew.process,
    producer: brew.producer,
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

  const meta = getRoasterMetadata(roaster)
  const earlyData = matchedBrews.length < 3

  const bmrBlock = meta?.bmrStrategy || meta?.bmrHouseStyle
    ? `Documented house-style read for ${roaster} (from Chris's Brewing Master Reference — treat this as a working hypothesis, not ground truth):
- Strategy tag: ${meta?.bmrStrategy || 'unspecified'}
- House style: ${meta?.bmrHouseStyle || 'unspecified'}
${meta?.notes ? `- Prior notes: ${meta.notes}` : ''}

If the brew corpus confirms this read, say so concisely. If the corpus has pushed back — for example multiple lots landing at a different extraction strategy than the documented tag — surface that divergence specifically.`
    : `No documented house-style card exists for ${roaster} yet — synthesize purely from the brew corpus below.`

  const earlyDataBlock = earlyData
    ? `\nThis is early data — only ${matchedBrews.length} ${matchedBrews.length === 1 ? 'lot' : 'lots'} archived. Frame patterns as tentative; flag where one more data point would settle a question.`
    : ''

  const prompt = `You are a coffee research assistant helping synthesize brewing knowledge about the roaster "${roaster}" from Chris's archive.

Chris's palate has widened — he used to prize clean, washed, tea-like profiles almost exclusively, but now genuinely enjoys controlled naturals, co-ferments, and red-wine-structured coffees. Funky/anaerobic that's well-controlled is interesting, not bad. The synthesis should compound learnings about *when this roaster's style sings vs. misses*, not score the roaster as good or bad wholesale.

${bmrBlock}
${earlyDataBlock}

Here is all the brewing data Chris has collected for ${matchedBrews.length} ${matchedBrews.length === 1 ? 'coffee' : 'coffees'} from ${roaster}:

${JSON.stringify(learningData, null, 2)}

Write a SHORT synthesis — strictly 2-4 sentences, one paragraph, no more than 100 words. Focus on:
- Which variety/process combinations from this roaster have delivered for me, and which extraction strategy carried them.
- Tipping-point signals — what pushes this roaster's lots from clean expression to overdone, or where the documented house-style needed to flex.
- Temperature/cooling behavior or rest timing if it shows up across multiple lots.

Write in first person ("I've found that..."). No bullet points, no headers — flowing prose only.`

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 240,
      messages: [{ role: 'user', content: prompt }],
    })

    const synthesis = message.content[0].type === 'text' ? message.content[0].text : null

    if (synthesis) {
      await supabase
        .from('roaster_syntheses')
        .upsert({
          user_id: user.id,
          roaster,
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
