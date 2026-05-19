// Terroir adapter for the directed-synthesis pipeline.
// Prompt structure ported verbatim from Chris's "Terroir: Lessons Learned"
// sample-output file (the Central Andean Cordillera capsule).

import type { Terroir } from '@/lib/types'
import type { EntityAdapter } from '../types'

interface TerroirAnchorContext {
  primary: Terroir
  mesoTerroirs: string[]
}

function renderAnchor(ctx: TerroirAnchorContext): string | null {
  const t = ctx.primary
  const lines: string[] = []
  lines.push(`- Country: ${t.country}`)
  if (t.admin_region) lines.push(`- Admin region: ${t.admin_region}`)
  if (t.macro_terroir) lines.push(`- Macro terroir: ${t.macro_terroir}`)
  if (ctx.mesoTerroirs.length) {
    lines.push(`- Meso terroirs in this group: ${ctx.mesoTerroirs.join(', ')}`)
  }
  if (t.elevation_min || t.elevation_max) {
    const range = t.elevation_min && t.elevation_max
      ? `${t.elevation_min}–${t.elevation_max}m`
      : `${t.elevation_min ?? t.elevation_max}m`
    lines.push(`- Elevation: ${range}`)
  }
  if (t.climate_stress) lines.push(`- Climate stress: ${t.climate_stress}`)
  if (t.soil) lines.push(`- Soil: ${t.soil}`)
  if (t.farming_model) lines.push(`- Farming model: ${t.farming_model}`)
  if (t.cup_profile) lines.push(`- Cup profile (documented): ${t.cup_profile}`)
  if (t.why_it_stands_out) lines.push(`- Why it stands out: ${t.why_it_stands_out}`)
  if (t.acidity_character) lines.push(`- Acidity character: ${t.acidity_character}`)
  if (t.body_character) lines.push(`- Body character: ${t.body_character}`)
  if (t.dominant_varieties?.length) {
    lines.push(`- Dominant varieties: ${t.dominant_varieties.join(', ')}`)
  }
  if (t.typical_processing?.length) {
    lines.push(`- Typical processing: ${t.typical_processing.join(', ')}`)
  }
  if (t.context) lines.push(`- Context notes: ${t.context}`)

  return lines.length > 1 ? lines.join('\n') : null
}

export const terroirAdapter: EntityAdapter<TerroirAnchorContext> = {
  type: 'terroir',
  entityNoun: 'terroir region',
  capsuleNoun: 'living terroir knowledge capsule',
  renderAnchor,
  weighting: [
    {
      weight: 'highest',
      label: '"What I Learned" and "Key Takeaways" from individual brew pages',
      description: 'These contain the transferable brewing lessons.',
    },
    {
      weight: 'high',
      label: 'Process + extraction strategy pairings',
      description: 'Identify how washed, natural, honey, anaerobic, yeast-inoculated, thermal shock, etc. change the terroir expression.',
    },
    {
      weight: 'high',
      label: 'Temperature evolution and peak expression',
      description: 'Identify whether coffees from this terroir tend to peak hot, warm, cool, or in multiple modes depending on process.',
    },
    {
      weight: 'medium',
      label: 'Repeated sensory notes',
      description: "Use these to define the terroir's recurring flavor and structure.",
    },
    {
      weight: 'medium',
      label: 'Terroir context (above)',
      description: 'Altitude, climate, soil, farming model, and meso-terroir differences.',
    },
    {
      weight: 'medium',
      label: 'Cultivar mix',
      description: 'Separate terroir-level conclusions from cultivar-specific behavior.',
    },
    {
      weight: 'low',
      label: 'Exact recipes and parameters',
      description: 'Use recipes as supporting evidence, not the main output.',
    },
    {
      weight: 'low',
      label: 'Roaster list',
      description: 'Lower value unless roaster style clearly explains a pattern.',
    },
  ],
  outputFormat: [
    "Terroir's core identity: what it tends to express, reward, or punish.",
    'Recurring flavor, acidity, body, and structure.',
    'The main brewing trap or misread.',
    'How process, cultivar, and meso-terroir change the default brewing approach.',
    'Temperature/cooling behavior if it appears repeatedly.',
  ],
  extraRules: [
    'If the dataset is cultivar-narrow (e.g. all lots are one variety), say so explicitly and frame conclusions as "X-through-this-terroir", not as a terroir rule.',
    'If process dominates terroir, say so. If terroir dominates process, say so.',
  ],
  formatLearningRow: (brew) => ({
    coffee_name: brew.coffee_name,
    variety: brew.variety,
    process: brew.process,
    roaster: brew.roaster,
    key_takeaways: brew.key_takeaways,
    peak_expression: brew.peak_expression,
    temperature_evolution: brew.temperature_evolution,
    terroir_connection: brew.terroir_connection,
    flavor_notes: brew.flavor_notes,
    classification: brew.classification,
    brewer: brew.brewer,
    extraction_strategy: brew.extraction_strategy,
    what_i_learned: brew.what_i_learned,
    // SYN-6 Q5: flag heavy-process brews so the SHARED_RULE directs the
    // model to attribute observations to the process layer, not the terroir.
    is_process_dominant: brew.is_process_dominant ?? false,
  }),
  // SYN-6: cross-source roast_learnings row formatter. Pulls terroir-scoped
  // carry-forward fields + scope_tags (Sprint 12 forward-investment; arrays
  // are empty today on all rows but populate going forward per ADR-0009).
  formatRoastLearningRow: (rl) => {
    const gb = rl.green_bean as Record<string, unknown> | undefined
    return {
      lot_name: gb?.name ?? null,
      terroir_takeaway: rl.terroir_takeaway,
      general_takeaway: rl.general_takeaway,
      starting_hypothesis: rl.starting_hypothesis,
      terroir_takeaway_scope_tags: rl.terroir_takeaway_scope_tags,
      general_takeaway_scope_tags: rl.general_takeaway_scope_tags,
      starting_hypothesis_scope_tags: rl.starting_hypothesis_scope_tags,
    }
  },
}
