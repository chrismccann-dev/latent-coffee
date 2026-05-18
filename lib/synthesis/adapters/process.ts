// Process adapter — per-kind dispatcher for the Sub Pages 4 architecture.
//
// Each aggregation kind (base / honey_subprocess / modifier_combo /
// modifier_index / signature) produces a slightly different anchor + framing,
// but shares the same weighting / outputFormat / formatLearningRow as the
// original single-process adapter. Output remains a polished plain-text
// capsule ("What I've Learned About X") — the rest of the page chrome
// (Process Overview, Brew Archetype, Cup Profile) comes from authored
// content in lib/process-registry.ts rich exports.
//
// Backwards-compat: the original `processAdapter` export is preserved as a
// legacy-text-keyed alias of the base adapter (so any leftover consumer
// importing { processAdapter } continues to work). The /processes synthesize
// route was rewritten to call getProcessAdapter(kind, key, ctx) directly.

import {
  decomposeProcess,
  getProcessFamily,
  composeProcess,
  getBaseProcessEntry,
  getModifierEntry,
  getSignatureEntry,
  type BaseProcess,
  type HoneySubprocess,
  type StructuredProcess,
} from '@/lib/process-registry'
import { composeProcessDisplay } from '@/lib/process-registry'
import type { EntityAdapter, WeightingEntry } from '../types'

// ---------------------------------------------------------------------------
// Shared weighting + outputFormat (ported verbatim from the legacy adapter)
// ---------------------------------------------------------------------------

const SHARED_WEIGHTING: WeightingEntry[] = [
  {
    weight: 'highest',
    label: '"What I Learned" and "Key Takeaways" from individual brew pages',
    description: 'These contain the transferable brewing lessons.',
  },
  {
    weight: 'high',
    label: 'Extraction strategy labels',
    description:
      'Clarity-First, Balanced Intensity, Full Expression, Suppression, Extraction Push, Hybrid Sequential. Identify when this process behaves moderately vs. when it overrides cultivar and needs more push.',
  },
  {
    weight: 'high',
    label: 'Failure modes from recipe iterations',
    description:
      'Identify what under-extraction, over-extraction, excess agitation, excess heat, insufficient contact time, or cooling misreads look like for this process.',
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
]

const SHARED_OUTPUT_FORMAT = [
  "Process's core identity: what it tends to express, reward, or punish.",
  'Recurring flavor, acidity, body, texture, and structure.',
  'The main brewing trap or misread.',
  'How cultivar and terroir change, reinforce, or get overridden by the process.',
  'Temperature/cooling behavior if it appears repeatedly.',
]

const SHARED_EXTRA_RULES = [
  'If process dominates cultivar, say so. If cultivar dominates process, say so.',
]

const SHARED_LEARNING_ROW = (brew: Record<string, unknown>) => ({
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
})

// ---------------------------------------------------------------------------
// Per-kind adapter shapes
// ---------------------------------------------------------------------------

interface BaseAnchorContext {
  base: BaseProcess
}

interface HoneySubprocessAnchorContext {
  subprocess: HoneySubprocess
}

interface ModifierComboAnchorContext {
  base: BaseProcess
  structured: StructuredProcess
}

interface ModifierIndexAnchorContext {
  modifier: string
  byBase: Partial<Record<BaseProcess, number>>
}

interface SignatureAnchorContext {
  name: string
}

export type ProcessAnchorContext =
  | BaseAnchorContext
  | HoneySubprocessAnchorContext
  | ModifierComboAnchorContext
  | ModifierIndexAnchorContext
  | SignatureAnchorContext

// ---------------------------------------------------------------------------
// Adapter: Base process hub
// ---------------------------------------------------------------------------

function renderBaseAnchor(ctx: BaseAnchorContext): string | null {
  const entry = getBaseProcessEntry(ctx.base)
  const lines: string[] = [`- Base process: ${ctx.base}`]
  if (entry?.summary) lines.push(`- Authored summary: ${entry.summary}`)
  if (entry?.brewArchetype) {
    const a = entry.brewArchetype
    lines.push(`- Best brew archetype: ${a.bestArchetype}`)
    lines.push(`- Common failure mode: ${a.commonFailureMode}`)
    lines.push(`- Typical strength: ${a.typicalStrength}`)
  }
  return lines.join('\n')
}

const baseProcessAdapter: EntityAdapter<BaseAnchorContext> = {
  type: 'process',
  entityNoun: 'base process',
  capsuleNoun: 'living base-process knowledge capsule',
  renderAnchor: renderBaseAnchor,
  weighting: SHARED_WEIGHTING,
  outputFormat: SHARED_OUTPUT_FORMAT,
  extraRules: SHARED_EXTRA_RULES,
  formatLearningRow: SHARED_LEARNING_ROW,
}

// ---------------------------------------------------------------------------
// Adapter: Honey subprocess (e.g. White Honey / Generic Honey)
// ---------------------------------------------------------------------------

const HONEY_TIER_HINTS: Record<HoneySubprocess, string> = {
  'White Honey': 'very light mucilage retention, shortest drying window',
  'Yellow Honey': 'light-to-moderate mucilage retention',
  'Red Honey': 'moderate-to-heavy mucilage retention',
  'Black Honey': 'heaviest mucilage retention, longest drying window',
  'Purple Honey': 'purple-pulp cherry variants',
  'Generic Honey': 'pulp retention without a specified color tier',
  'Hydro Honey': 'hydrolytic honey variant',
}

function renderHoneySubprocessAnchor(ctx: HoneySubprocessAnchorContext): string | null {
  const lines = [
    `- Base process: Honey`,
    `- Subprocess (color tier): ${ctx.subprocess}`,
    `- Tier signal: ${HONEY_TIER_HINTS[ctx.subprocess] ?? ''}`,
  ]
  return lines.join('\n')
}

const honeySubprocessAdapter: EntityAdapter<HoneySubprocessAnchorContext> = {
  type: 'process',
  entityNoun: 'Honey subprocess',
  capsuleNoun: 'living Honey subprocess knowledge capsule',
  renderAnchor: renderHoneySubprocessAnchor,
  weighting: SHARED_WEIGHTING,
  outputFormat: SHARED_OUTPUT_FORMAT,
  extraRules: SHARED_EXTRA_RULES,
  formatLearningRow: SHARED_LEARNING_ROW,
}

// ---------------------------------------------------------------------------
// Adapter: Per-base modifier-combo mini-page
// ---------------------------------------------------------------------------

function renderModifierComboAnchor(ctx: ModifierComboAnchorContext): string | null {
  const composed = composeProcessDisplay(ctx.structured)
  const family = getProcessFamily(composed)
  const lines: string[] = [
    `- Specific process variant: ${composed}`,
    `- Base process: ${ctx.base}`,
  ]
  if (family && family !== 'Other') lines.push(`- Process family: ${family}`)
  if (ctx.structured.fermentation_modifiers.length > 0) {
    lines.push(`- Fermentation modifiers: ${ctx.structured.fermentation_modifiers.join(', ')}`)
  }
  if (ctx.structured.drying_modifiers.length > 0) {
    lines.push(`- Drying modifiers: ${ctx.structured.drying_modifiers.join(', ')}`)
  }
  if (ctx.structured.intervention_modifiers.length > 0) {
    lines.push(`- Intervention modifiers: ${ctx.structured.intervention_modifiers.join(', ')}`)
  }
  if (ctx.structured.experimental_modifiers.length > 0) {
    lines.push(`- Experimental modifiers: ${ctx.structured.experimental_modifiers.join(', ')}`)
  }
  return lines.join('\n')
}

const modifierComboAdapter: EntityAdapter<ModifierComboAnchorContext> = {
  type: 'process',
  entityNoun: 'specific process variant',
  capsuleNoun: 'living variant knowledge capsule',
  renderAnchor: renderModifierComboAnchor,
  weighting: SHARED_WEIGHTING,
  outputFormat: SHARED_OUTPUT_FORMAT,
  extraRules: [
    ...SHARED_EXTRA_RULES,
    'This is a specific multi-modifier variant — the brew sample is intentionally narrow. Draw conservatively from what the brews actually show; do not over-generalize.',
  ],
  formatLearningRow: SHARED_LEARNING_ROW,
}

// ---------------------------------------------------------------------------
// Adapter: Cross-base Modifier Index page
// ---------------------------------------------------------------------------

function renderModifierIndexAnchor(ctx: ModifierIndexAnchorContext): string | null {
  const entry = getModifierEntry(ctx.modifier)
  const lines: string[] = [`- Modifier: ${ctx.modifier}`]
  if (entry?.axis) lines.push(`- Axis: ${entry.axis}`)
  if (entry?.overview) lines.push(`- Authored overview: ${entry.overview}`)
  const baseBreakdown = (Object.entries(ctx.byBase) as [BaseProcess, number][])
    .filter(([_, count]) => (count ?? 0) > 0)
    .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0))
    .map(([base, count]) => `${base} ${count}`)
    .join(' / ')
  if (baseBreakdown) lines.push(`- Brews containing this modifier by base: ${baseBreakdown}`)
  return lines.join('\n')
}

const modifierIndexAdapter: EntityAdapter<ModifierIndexAnchorContext> = {
  type: 'process',
  entityNoun: 'modifier',
  capsuleNoun: 'living modifier knowledge capsule',
  renderAnchor: renderModifierIndexAnchor,
  weighting: SHARED_WEIGHTING,
  outputFormat: [
    'What does this modifier do at the bean level, and what cup behavior does it produce most consistently?',
    "Identify what's constant about this modifier across bases vs. what changes by base.",
    'Main brewing trap or extraction misread when this modifier is present.',
    'When the modifier dominates the cup vs. when the base process dominates.',
    'Temperature/cooling behavior if it shifts noticeably when this modifier is present.',
  ],
  extraRules: [
    ...SHARED_EXTRA_RULES,
    'This is a cross-base modifier aggregation. Highlight base-dependent behavior explicitly (e.g. "on Naturals this calls for Suppression; on Washeds it calls for Balanced Intensity"); do not collapse cross-base differences into a single rule.',
  ],
  formatLearningRow: SHARED_LEARNING_ROW,
}

// ---------------------------------------------------------------------------
// Adapter: Signature method page
// ---------------------------------------------------------------------------

function renderSignatureAnchor(ctx: SignatureAnchorContext): string | null {
  const entry = getSignatureEntry(ctx.name)
  if (!entry) return `- Signature method: ${ctx.name}`
  const lines: string[] = [
    `- Signature method: ${entry.name}`,
  ]
  if (entry.producer && entry.country) {
    lines.push(`- Producer: ${entry.producer}, ${entry.country}`)
  }
  lines.push(`- Base process: ${entry.base}`)
  if (entry.fermentation_modifiers && entry.fermentation_modifiers.length > 0) {
    lines.push(`- Fermentation modifiers: ${entry.fermentation_modifiers.join(', ')}`)
  }
  if (entry.drying_modifiers && entry.drying_modifiers.length > 0) {
    lines.push(`- Drying modifiers: ${entry.drying_modifiers.join(', ')}`)
  }
  if (entry.intervention_modifiers && entry.intervention_modifiers.length > 0) {
    lines.push(`- Intervention modifiers: ${entry.intervention_modifiers.join(', ')}`)
  }
  if (entry.experimental_modifiers && entry.experimental_modifiers.length > 0) {
    lines.push(`- Experimental modifiers: ${entry.experimental_modifiers.join(', ')}`)
  }
  if (entry.overview) lines.push(`- Authored overview: ${entry.overview}`)
  if (entry.observedCupProfile && entry.observedCupProfile.length > 0) {
    lines.push(`- Authored cup profile cues: ${entry.observedCupProfile.join('; ')}`)
  }
  return lines.join('\n')
}

const signatureAdapter: EntityAdapter<SignatureAnchorContext> = {
  type: 'process',
  entityNoun: 'signature method',
  capsuleNoun: 'living signature knowledge capsule',
  renderAnchor: renderSignatureAnchor,
  weighting: SHARED_WEIGHTING,
  outputFormat: SHARED_OUTPUT_FORMAT,
  extraRules: [
    ...SHARED_EXTRA_RULES,
    'This is a producer-specific signature method, not just a modifier stack. Treat the producer + protocol facts in the anchor as ground truth and pull the cup-behavior synthesis from the brew corpus.',
  ],
  formatLearningRow: SHARED_LEARNING_ROW,
}

// ---------------------------------------------------------------------------
// Dispatcher
// ---------------------------------------------------------------------------

export type ProcessAggregationKind =
  | 'base'
  | 'honey_subprocess'
  | 'modifier_combo'
  | 'modifier_index'
  | 'signature'

export function getProcessAdapter(kind: ProcessAggregationKind): EntityAdapter<ProcessAnchorContext> {
  switch (kind) {
    case 'base':
      return baseProcessAdapter as unknown as EntityAdapter<ProcessAnchorContext>
    case 'honey_subprocess':
      return honeySubprocessAdapter as unknown as EntityAdapter<ProcessAnchorContext>
    case 'modifier_combo':
      return modifierComboAdapter as unknown as EntityAdapter<ProcessAnchorContext>
    case 'modifier_index':
      return modifierIndexAdapter as unknown as EntityAdapter<ProcessAnchorContext>
    case 'signature':
      return signatureAdapter as unknown as EntityAdapter<ProcessAnchorContext>
  }
}

// ---------------------------------------------------------------------------
// Back-compat: legacy text-keyed processAdapter (deprecated, no longer
// consumed by /processes routes — preserved so any external import
// continues to compile until a follow-up cleanup sweep)
// ---------------------------------------------------------------------------

interface LegacyProcessAnchorContext {
  processName: string
}

function renderLegacyAnchor(ctx: LegacyProcessAnchorContext): string | null {
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

export const processAdapter: EntityAdapter<LegacyProcessAnchorContext> = {
  type: 'process',
  entityNoun: 'process style',
  capsuleNoun: 'living process knowledge capsule',
  renderAnchor: renderLegacyAnchor,
  weighting: SHARED_WEIGHTING,
  outputFormat: SHARED_OUTPUT_FORMAT,
  extraRules: SHARED_EXTRA_RULES,
  formatLearningRow: SHARED_LEARNING_ROW,
}
