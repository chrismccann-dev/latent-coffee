import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'
import { Terroir, Cultivar } from '@/lib/types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

/**
 * Bulk re-synthesis endpoint.
 * Regenerates AI synthesis for all terroir macro groups and cultivar lineages.
 * POST /api/synthesize-all
 * Body: { type: "terroirs" | "cultivars" | "all" }
 */
export async function POST(request: Request) {
  const body = await request.json()
  const { type = 'all' } = body as { type?: 'terroirs' | 'cultivars' | 'all' }

  const supabase = createClient()
  const results: { terroirs: Record<string, string>; cultivars: Record<string, string> } = {
    terroirs: {},
    cultivars: {},
  }

  // --- TERROIRS ---
  if (type === 'all' || type === 'terroirs') {
    const { data: allTerroirs } = await supabase
      .from('terroirs')
      .select('*')
      .order('country')

    if (allTerroirs) {
      // Group by macro_terroir + country
      const macroGroups = new Map<string, Terroir[]>()
      for (const t of allTerroirs as Terroir[]) {
        const key = `${t.country}::${t.macro_terroir || t.admin_region}`
        if (!macroGroups.has(key)) macroGroups.set(key, [])
        macroGroups.get(key)!.push(t)
      }

      for (const [groupKey, terroirs] of macroGroups) {
        const terriorIds = terroirs.map(t => t.id)
        const primary = terroirs[0]
        const macroName = primary.macro_terroir || primary.admin_region || primary.country

        // Fetch brews for this group
        const { data: brews } = await supabase
          .from('brews')
          .select('*')
          .in('terroir_id', terriorIds)

        const matchedBrews = brews || []
        if (matchedBrews.length === 0) {
          results.terroirs[groupKey] = 'skipped (no brews)'
          continue
        }

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
          results.terroirs[groupKey] = 'skipped (no learning data)'
          continue
        }

        const mesoTerroirs = new Set<string>()
        for (const t of terroirs) {
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

          if (synthesis) {
            await supabase
              .from('terroirs')
              .update({ synthesis, synthesis_brew_count: matchedBrews.length })
              .in('id', terriorIds)

            results.terroirs[groupKey] = `✓ ${matchedBrews.length} brews`
          }
        } catch (err: any) {
          results.terroirs[groupKey] = `error: ${err?.message}`
        }
      }
    }
  }

  // --- CULTIVARS ---
  if (type === 'all' || type === 'cultivars') {
    const { data: allCultivars } = await supabase
      .from('cultivars')
      .select('*')
      .order('lineage')

    if (allCultivars) {
      // Group by lineage
      const lineageGroups = new Map<string, Cultivar[]>()
      for (const c of allCultivars as Cultivar[]) {
        const key = c.lineage || c.cultivar_name
        if (!lineageGroups.has(key)) lineageGroups.set(key, [])
        lineageGroups.get(key)!.push(c)
      }

      for (const [lineageName, cultivars] of lineageGroups) {
        const cultivarIds = cultivars.map(c => c.id)
        const primary = cultivars[0]

        // Fetch brews for this lineage
        const { data: brews } = await supabase
          .from('brews')
          .select('*')
          .in('cultivar_id', cultivarIds)

        const matchedBrews = brews || []
        if (matchedBrews.length === 0) {
          results.cultivars[lineageName] = 'skipped (no brews)'
          continue
        }

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
          results.cultivars[lineageName] = 'skipped (no learning data)'
          continue
        }

        const cultivarNames = cultivars.map(c => c.cultivar_name).join(', ')

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

          if (synthesis) {
            await supabase
              .from('cultivars')
              .update({ synthesis, synthesis_brew_count: matchedBrews.length })
              .in('id', cultivarIds)

            results.cultivars[lineageName] = `✓ ${matchedBrews.length} brews`
          }
        } catch (err: any) {
          results.cultivars[lineageName] = `error: ${err?.message}`
        }
      }
    }
  }

  return NextResponse.json({
    terroirs_count: Object.keys(results.terroirs).length,
    cultivars_count: Object.keys(results.cultivars).length,
    results,
  })
}
