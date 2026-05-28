// Roaster adapter for the directed-synthesis pipeline.
// Prompt structure ported verbatim from Chris's "Roaster: Lessons Learned"
// sample-output file (the Picolot capsule).

import { getRoasterEntry } from '@/lib/roaster-registry'
import type { EntityAdapter } from '../types'

interface RoasterAnchorContext {
  roaster: string
}

function renderAnchor(ctx: RoasterAnchorContext): string | null {
  const entry = getRoasterEntry(ctx.roaster)
  if (!entry) return null

  // Prefer authored bmrHouseStyle prose when present; supplement with CSV fields.
  const lines: string[] = []
  if (entry.strategyTag) lines.push(`- Strategy tag: ${entry.strategyTag}`)
  // Brew guide provenance (Sub-sprint 4b Bundle B 2026-05-28): tells the model
  // whether the recipe baseline below is roaster-verified (`official`) or
  // community-derived best-guess (`implied`), so it can weight divergence
  // calls accordingly. `none` skips the recipe baseline framing entirely.
  if (entry.brewGuideStatus === 'official') {
    lines.push(`- Brew guide status: official (recipe baseline below is roaster-authored)`)
  } else if (entry.brewGuideStatus === 'implied') {
    lines.push(`- Brew guide status: implied (recipe baseline below is community-derived; treat as working hypothesis)`)
  }
  if (entry.bmrHouseStyle) lines.push(`- House style (authored): ${entry.bmrHouseStyle}`)
  else if (entry.houseStyle) lines.push(`- House style (CSV): ${entry.houseStyle}`)
  if (entry.roastStyle) lines.push(`- Roast style: ${entry.roastStyle}`)
  if (entry.developmentBias) lines.push(`- Development bias: ${entry.developmentBias}`)
  if (entry.restCurve) lines.push(`- Rest curve: ${entry.restCurve}`)
  if (entry.primaryDriver) lines.push(`- Primary driver: ${entry.primaryDriver}`)
  if (entry.extractionPurpose) lines.push(`- Extraction purpose: ${entry.extractionPurpose}`)
  if (entry.extractionIntent) lines.push(`- Extraction intent: ${entry.extractionIntent}`)
  if (entry.failureMode) lines.push(`- Common failure mode: ${entry.failureMode}`)
  if (entry.overExtractionTolerance) lines.push(`- Over-extraction tolerance: ${entry.overExtractionTolerance}`)
  if (entry.processSensitivity) lines.push(`- Process sensitivity: ${entry.processSensitivity}`)
  if (entry.brewAdjustmentMethod) lines.push(`- Brew adjustment method: ${entry.brewAdjustmentMethod}`)
  if (entry.calibrationRole) lines.push(`- Calibration role: ${entry.calibrationRole}`)
  if (entry.tempC || entry.doseG || entry.waterG || entry.ratio || entry.typicalBrewTime) {
    const recipeBits = [
      entry.doseG && `${entry.doseG} dose`,
      entry.waterG && `${entry.waterG} water`,
      entry.ratio && `ratio ${entry.ratio}`,
      entry.tempC && `${entry.tempC}`,
      entry.typicalBrewTime && `~${entry.typicalBrewTime}`,
      entry.agitationLevel && `agitation: ${entry.agitationLevel}`,
    ].filter(Boolean)
    if (recipeBits.length) lines.push(`- Recipe baseline: ${recipeBits.join(' / ')}`)
  }
  if (entry.primaryBrewer || entry.filterType) {
    const gear = [entry.primaryBrewer, entry.filterType].filter(Boolean).join(' + ')
    if (gear) lines.push(`- Typical brewer/filter: ${gear}`)
  }
  if (entry.confidenceLevel) lines.push(`- House-style confidence: ${entry.confidenceLevel}`)
  if (entry.notes) lines.push(`- Notes: ${entry.notes}`)
  if (entry.bmrNotes) lines.push(`- Authored notes: ${entry.bmrNotes}`)

  return lines.length > 0 ? lines.join('\n') : null
}

export const roasterAdapter: EntityAdapter<RoasterAnchorContext> = {
  type: 'roaster',
  entityNoun: 'roaster',
  capsuleNoun: 'living roaster knowledge capsule',
  renderAnchor,
  weighting: [
    {
      weight: 'highest',
      label: '"What I Learned" and "Key Takeaways" from individual brew pages',
      description: 'These contain the transferable brewing lessons.',
    },
    {
      weight: 'high',
      label: "The roaster's house style or brewing guide (above)",
      description: 'Use this as the baseline, then compare actual results against it. If the corpus pushes back, surface the divergence specifically.',
    },
    {
      weight: 'high',
      label: 'Recipe iteration failure modes from individual brew pages',
      description: "Identify what happens when this roaster's coffees are under-extracted, over-extracted, over-agitated, too cool, too hot, too fast, or too slow.",
    },
    {
      weight: 'high',
      label: 'Temperature evolution and peak expression',
      description: "Identify whether this roaster's coffees tend to peak hot, warm, cool, or across a cooling arc.",
    },
    {
      weight: 'medium',
      label: 'Process + extraction strategy pairings',
      description: 'Identify whether the roaster style changes by washed, natural, honey, anaerobic, yeast-inoculated, thermal shock, etc.',
    },
    {
      weight: 'medium',
      label: 'Cultivar + terroir mix',
      description: 'Separate roaster-level conclusions from cultivar- or origin-specific behavior.',
    },
    {
      weight: 'medium',
      label: 'Repeated sensory notes',
      description: "Use these to define the roaster's recurring flavor, texture, and structure.",
    },
    {
      weight: 'low',
      label: 'Exact recipes and parameters',
      description: 'Use recipes only as supporting evidence, not as the main output.',
    },
  ],
  outputFormat: [
    "Roaster's core identity: what they reward, punish, or emphasize in the cup.",
    'Recurring flavor, acidity, body, texture, and structure.',
    'How their house guide or brew philosophy translates into actual cups.',
    'The main brewing trap or misread.',
    'How process, cultivar, and terroir create exceptions to the house style.',
    'Temperature/cooling behavior if it appears repeatedly.',
  ],
  extraRules: [
    'If the house guide works only for some coffees, say where it works and where it breaks.',
    'If process overrides roaster style, say so.',
  ],
  formatLearningRow: (brew) => ({
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
    // SYN-6 Q5: flag heavy-process brews so the SHARED_RULE directs the
    // model to attribute observations to the process, not the roaster style.
    is_process_dominant: brew.is_process_dominant ?? false,
  }),
  // SYN-6: richest cross-source row — Latent is the only roaster where this
  // path returns data. Pulls the full lot-level structured learnings layer
  // (primary lever / brewing tolerance / underdev / overdev / aromatic /
  // structural / rest behaviors) plus the 4 carry-forward fields + their
  // matching scope_tags. Other roasters receive empty roastLearnings arrays
  // from the synthesize route (they have no associated roast_learnings rows).
  formatRoastLearningRow: (rl) => {
    const gb = rl.green_bean as Record<string, unknown> | undefined
    return {
      lot_name: gb?.name ?? null,
      primary_lever: rl.primary_lever,
      acceptable_roast_window: rl.acceptable_roast_window,
      brewing_tolerance: rl.brewing_tolerance,
      underdevelopment_signal: rl.underdevelopment_signal,
      overdevelopment_signal: rl.overdevelopment_signal,
      aromatic_behavior: rl.aromatic_behavior,
      structural_behavior: rl.structural_behavior,
      rest_behavior: rl.rest_behavior,
      cultivar_takeaway: rl.cultivar_takeaway,
      terroir_takeaway: rl.terroir_takeaway,
      general_takeaway: rl.general_takeaway,
      starting_hypothesis: rl.starting_hypothesis,
      cultivar_takeaway_scope_tags: rl.cultivar_takeaway_scope_tags,
      terroir_takeaway_scope_tags: rl.terroir_takeaway_scope_tags,
      general_takeaway_scope_tags: rl.general_takeaway_scope_tags,
      starting_hypothesis_scope_tags: rl.starting_hypothesis_scope_tags,
    }
  },
}
