// Process adapter for the directed-synthesis pipeline.
// Prompt structure ported verbatim from Chris's "Processes: Lessons Learned"
// sample-output file (the Anaerobic Natural capsule).

import { decomposeProcess, getProcessFamily, composeProcess } from '@/lib/process-registry'
import type { EntityAdapter } from '../types'

interface ProcessAnchorContext {
  processName: string
}

function renderAnchor(ctx: ProcessAnchorContext): string | null {
  const structured = decomposeProcess(ctx.processName)
  const family = getProcessFamily(ctx.processName)
  const composed = composeProcess(structured)

  const lines: string[] = []
  if (family && family !== 'Other') lines.push(`- Process family: ${family}`)
  if (structured.base_process) lines.push(`- Base process: ${structured.base_process}`)
  if (structured.subprocess) lines.push(`- Subprocess: ${structured.subprocess}`)
  if (structured.fermentation_modifiers?.length) {
    lines.push(`- Fermentation modifiers: ${structured.fermentation_modifiers.join(', ')}`)
  }
  if (structured.drying_modifiers?.length) {
    lines.push(`- Drying modifiers: ${structured.drying_modifiers.join(', ')}`)
  }
  if (structured.intervention_modifiers?.length) {
    lines.push(`- Intervention modifiers: ${structured.intervention_modifiers.join(', ')}`)
  }
  if (structured.experimental_modifiers?.length) {
    lines.push(`- Experimental modifiers: ${structured.experimental_modifiers.join(', ')}`)
  }
  if (structured.signature_method) {
    lines.push(`- Signature method (proper-name proprietary): ${structured.signature_method}`)
  }
  if (structured.decaf_modifier) lines.push(`- Decaf method: ${structured.decaf_modifier}`)
  if (composed && composed !== ctx.processName) {
    lines.push(`- Canonical composed string: ${composed}`)
  }

  return lines.length > 0 ? lines.join('\n') : null
}

export const processAdapter: EntityAdapter<ProcessAnchorContext> = {
  type: 'process',
  entityNoun: 'process style',
  capsuleNoun: 'living process knowledge capsule',
  renderAnchor,
  weighting: [
    {
      weight: 'highest',
      label: '"What I Learned" and "Key Takeaways" from individual brew pages',
      description: 'These contain the transferable brewing lessons.',
    },
    {
      weight: 'high',
      label: 'Extraction strategy labels',
      description: 'Clarity-First, Balanced Intensity, Full Expression, Suppression, Extraction Push, Hybrid Sequential. Identify when this process behaves moderately vs. when it overrides cultivar and needs more push.',
    },
    {
      weight: 'high',
      label: 'Failure modes from recipe iterations',
      description: 'Identify what under-extraction, over-extraction, excess agitation, excess heat, insufficient contact time, or cooling misreads look like for this process.',
    },
    {
      weight: 'high',
      label: 'Temperature evolution and peak expression',
      description: 'Identify whether this process tends to peak hot, warm, cool, or across a cooling arc.',
    },
    {
      weight: 'medium',
      label: 'Process + cultivar pairings',
      description: 'Identify when the process overrides cultivar behavior or when cultivar still dominates.',
    },
    {
      weight: 'medium',
      label: 'Process + terroir pairings',
      description: 'Identify whether the process behaves differently by origin or macro-terroir.',
    },
    {
      weight: 'medium',
      label: 'Repeated sensory notes',
      description: "Use these to define the process's recurring flavor and structure.",
    },
    {
      weight: 'low',
      label: 'Exact recipes and parameters',
      description: 'Use recipes only as supporting evidence, not as the main output.',
    },
    {
      weight: 'low',
      label: 'Roaster list',
      description: 'Lower value unless roaster style clearly explains a pattern.',
    },
  ],
  outputFormat: [
    "Process's core identity: what it tends to express, reward, or punish.",
    'Recurring flavor, acidity, body, texture, and structure.',
    'The main brewing trap or misread.',
    'How cultivar and terroir change, reinforce, or get overridden by the process.',
    'Temperature/cooling behavior if it appears repeatedly.',
  ],
  extraRules: [
    'If process dominates cultivar, say so. If cultivar dominates process, say so.',
  ],
  formatLearningRow: (brew) => ({
    coffee_name: brew.coffee_name,
    variety: brew.variety,
    roast_level: brew.roast_level,
    roaster: brew.roaster,
    key_takeaways: brew.key_takeaways,
    peak_expression: brew.peak_expression,
    temperature_evolution: brew.temperature_evolution,
    flavor_notes: brew.flavor_notes,
    classification: brew.classification,
    brewer: brew.brewer,
    extraction_strategy: brew.extraction_strategy,
    extraction_confirmed: brew.extraction_confirmed,
    what_i_learned: brew.what_i_learned,
  }),
}
