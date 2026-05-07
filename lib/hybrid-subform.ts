// Hybrid sub-form taxonomy — required sub-axis when extraction_strategy = 'Hybrid'
// (v8.4 promotion, 2026-05-06). Mirrors the WBC competition-recipe taxonomy
// (docs/brewing/wbc-recipes.md § Hybrid Systems) reduced to the 5 sub-forms
// Chris's single-origin / SWORKS + Switch context actually exercises. The
// remaining WBC subtypes (Alternating Phase Control, Parametric Hybrid,
// Temperature-Sandwich Hybrid) are blend territory or competition stagecraft
// and are deliberately deferred — promote when a real brew warrants it.
//
// Canonical IDs are snake_case for DB / wire stability; display labels are
// title-case. composeHybridSubformLabel() handles the transform; do not
// hand-format these strings on render sites.

export const HYBRID_SUBFORMS = [
  'sequential',
  'phase_mapped',
  'selective_bloom',
  'intensity_clarity_split',
  'temperature_staged',
] as const

export type HybridSubform = (typeof HYBRID_SUBFORMS)[number]

const HYBRID_SUBFORM_SET = new Set<string>(HYBRID_SUBFORMS)

export function isCanonicalHybridSubform(v: unknown): v is HybridSubform {
  return typeof v === 'string' && HYBRID_SUBFORM_SET.has(v)
}

const SUBFORM_LABELS: Record<HybridSubform, string> = {
  sequential: 'Sequential',
  phase_mapped: 'Phase-Mapped',
  selective_bloom: 'Selective Bloom',
  intensity_clarity_split: 'Intensity-Clarity Split',
  temperature_staged: 'Temperature-Staged',
}

const SUBFORM_DESCRIPTIONS: Record<HybridSubform, string> = {
  sequential:
    'Immersion phase then percolation phase (or reverse), each doing one job. Closest to the canonical Hario Switch recipe and the SWORKS slow/slow/open pattern (closed bloom + restricted main + open finish to rinse).',
  phase_mapped:
    'Each phase has an explicit sensory target (e.g. saturation / body / clarity / finish). More deliberate than Sequential — the role per phase is named at brief time and iteration targets the failing-role pour.',
  selective_bloom:
    'Bloom liquid is separated from the main brew, evaluated independently, and either added back or discarded. Bridges Hybrid + Output Selection — classify under Hybrid when bloom-separation IS the strategy.',
  intensity_clarity_split:
    'Immersion phase builds tactile body and integration; percolation phase recovers clarity and aromatic definition. Phase order matters (intensity first, clarity second). Best fit for heavy co-ferment lots on the SWORKS where the goal is structured extraction without muddiness.',
  temperature_staged:
    'Phase boundaries coincide with temperature changes (e.g. low-temp closed immersion for aroma preservation, then high-temp opened percolation for structure). Distinct from a standalone Inverted Temperature Staging modifier because the temperature change is bound to the phase boundary.',
}

export function composeHybridSubformLabel(s: HybridSubform | string | null | undefined): string | null {
  if (!s) return null
  if (isCanonicalHybridSubform(s)) return SUBFORM_LABELS[s]
  return null
}

export function describeHybridSubform(s: HybridSubform): string {
  return SUBFORM_DESCRIPTIONS[s]
}

export interface HybridSubformEntry {
  id: HybridSubform
  label: string
  description: string
}

export const HYBRID_SUBFORM_ENTRIES: HybridSubformEntry[] = HYBRID_SUBFORMS.map((id) => ({
  id,
  label: SUBFORM_LABELS[id],
  description: SUBFORM_DESCRIPTIONS[id],
}))
