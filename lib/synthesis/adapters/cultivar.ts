// Cultivar adapter for the directed-synthesis pipeline.
// Prompt structure ported verbatim from Chris's "Cultivar: Lessons Learned"
// sample-output file (the Gesha capsule).

import type { Cultivar } from '@/lib/types'
import type { EntityAdapter } from '../types'

interface CultivarAnchorContext {
  primary: Cultivar
}

function renderAnchor(ctx: CultivarAnchorContext): string | null {
  const c = ctx.primary
  const lines: string[] = []
  if (c.species) lines.push(`- Species: ${c.species}`)
  if (c.genetic_family) lines.push(`- Genetic family: ${c.genetic_family}`)
  if (c.lineage) lines.push(`- Lineage: ${c.lineage}`)
  if (c.genetic_background) lines.push(`- Genetic background: ${c.genetic_background}`)
  if (c.typical_origins?.length) lines.push(`- Typical origins: ${c.typical_origins.join(', ')}`)
  if (c.altitude_sensitivity) lines.push(`- Altitude sensitivity: ${c.altitude_sensitivity}`)
  if (c.terroir_transparency) lines.push(`- Terroir transparency: ${c.terroir_transparency}`)
  if (c.common_processing_methods?.length) {
    lines.push(`- Common processing methods: ${c.common_processing_methods.join(', ')}`)
  }
  if (c.typical_flavor_notes?.length) {
    lines.push(`- Typical flavor notes: ${c.typical_flavor_notes.join(', ')}`)
  }
  if (c.acidity_style) lines.push(`- Acidity style: ${c.acidity_style}`)
  if (c.body_style) lines.push(`- Body style: ${c.body_style}`)
  if (c.aromatics) lines.push(`- Aromatics: ${c.aromatics}`)
  if (c.extraction_sensitivity) lines.push(`- Extraction sensitivity: ${c.extraction_sensitivity}`)
  if (c.roast_tolerance) lines.push(`- Roast tolerance: ${c.roast_tolerance}`)
  if (c.brewing_tendencies) lines.push(`- Brewing tendencies: ${c.brewing_tendencies}`)
  if (c.common_pitfalls?.length) lines.push(`- Common pitfalls: ${c.common_pitfalls.join(', ')}`)
  if (c.roast_behavior) lines.push(`- Roast behavior: ${c.roast_behavior}`)
  if (c.resting_behavior) lines.push(`- Resting behavior: ${c.resting_behavior}`)
  if (c.limiting_factors?.length) lines.push(`- Limiting factors: ${c.limiting_factors.join(', ')}`)
  if (c.market_context) lines.push(`- Market context: ${c.market_context}`)

  return lines.length > 0 ? lines.join('\n') : null
}

export const cultivarAdapter: EntityAdapter<CultivarAnchorContext> = {
  type: 'cultivar',
  entityNoun: 'cultivar lineage',
  capsuleNoun: 'living cultivar knowledge capsule',
  renderAnchor,
  weighting: [
    {
      weight: 'highest',
      label: '"What I Learned" and "Key Takeaways" from individual brew pages',
      description: 'These contain the transferable brewing lessons.',
    },
    {
      weight: 'high',
      label: 'Repeated sensory notes across coffees',
      description: "Use these to define the cultivar's recurring flavor and structure.",
    },
    {
      weight: 'high',
      label: 'Temperature evolution and peak expression',
      description: 'Identify whether the cultivar tends to peak hot, warm, cool, or across a cooling arc.',
    },
    {
      weight: 'medium',
      label: 'Extraction strategy labels',
      description: 'Clarity-First, Balanced Intensity, Full Expression, Suppression, etc. Use these to understand how the cultivar behaves under different process types.',
    },
    {
      weight: 'medium',
      label: 'Process + origin pairings',
      description: 'Identify when process, terroir, or origin changes the default brewing strategy.',
    },
    {
      weight: 'low',
      label: 'Exact recipes and parameters',
      description: 'Use these only as supporting evidence, not as the main output.',
    },
  ],
  outputFormat: [
    "Cultivar's core identity: what it tends to expose, reward, or punish.",
    'Recurring flavor and structure pattern.',
    'The main brewing trap or misread.',
    'How process and origin change the default brewing approach.',
    'Temperature/cooling behavior if it appears repeatedly.',
  ],
  extraRules: [
    'If the data shows different behavior by process type, separate the cultivar default from the process override (e.g. "washed lots usually behave this way, but yeast-inoculated or anaerobic lots often need a different strategy").',
  ],
  formatLearningRow: (brew) => ({
    coffee_name: brew.coffee_name,
    variety: brew.variety,
    process: brew.process,
    roaster: brew.roaster,
    key_takeaways: brew.key_takeaways,
    peak_expression: brew.peak_expression,
    temperature_evolution: brew.temperature_evolution,
    cultivar_connection: brew.cultivar_connection,
    flavor_notes: brew.flavor_notes,
    classification: brew.classification,
    brewer: brew.brewer,
    extraction_strategy: brew.extraction_strategy,
    what_i_learned: brew.what_i_learned,
    // SYN-6 Q5: flag heavy-process brews so the SHARED_RULE directs the
    // model to attribute observations to the process, not the cultivar.
    is_process_dominant: brew.is_process_dominant ?? false,
  }),
  // SYN-6: cross-source roast_learnings row formatter. Pulls cultivar-scoped
  // carry-forward fields + scope_tags (Sprint 12 forward-investment).
  formatRoastLearningRow: (rl) => {
    const gb = rl.green_bean as Record<string, unknown> | undefined
    return {
      lot_name: gb?.name ?? null,
      cultivar_takeaway: rl.cultivar_takeaway,
      general_takeaway: rl.general_takeaway,
      starting_hypothesis: rl.starting_hypothesis,
      cultivar_takeaway_scope_tags: rl.cultivar_takeaway_scope_tags,
      general_takeaway_scope_tags: rl.general_takeaway_scope_tags,
      starting_hypothesis_scope_tags: rl.starting_hypothesis_scope_tags,
    }
  },
}
