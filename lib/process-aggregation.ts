// Aggregation helpers for the Sub Pages 4 /processes architecture.
//
// One source of truth for "which brews land in which aggregation bucket" so
// page surfaces, eligibility checks, and synthesis dispatch all read from the
// same shape.
//
// Aggregation kinds (mirror lib/process-routing.ts AggregationKind):
//   base               — every brew with base_process = X
//   honey_subprocess   — every Honey brew with subprocess = X
//   modifier_combo     — brews with same (base + modifier-set + subprocess); signature
//                        brews get a separate combo since signature_method splits the key
//   modifier_index     — brews containing X in any axis, across all bases (including signatures)
//   signature          — every brew with signature_method = X
//
// Pure base = no modifiers in any axis + no subprocess + no signature.

import type { Brew } from './types'
import {
  type BaseProcess,
  type HoneySubprocess,
  type StructuredProcess,
} from './process-registry'
import {
  SUB_PAGE_THRESHOLD,
  modifierComboSlug,
  type ModifierAxis,
} from './process-routing'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isPure(brew: Brew): boolean {
  return (
    !brew.subprocess &&
    (brew.fermentation_modifiers?.length ?? 0) === 0 &&
    (brew.drying_modifiers?.length ?? 0) === 0 &&
    (brew.intervention_modifiers?.length ?? 0) === 0 &&
    (brew.experimental_modifiers?.length ?? 0) === 0 &&
    !brew.signature_method
  )
}

function brewToStructured(brew: Brew): StructuredProcess {
  return {
    base_process: brew.base_process as BaseProcess,
    subprocess: (brew.subprocess as HoneySubprocess | null) ?? null,
    fermentation_modifiers: (brew.fermentation_modifiers ?? []) as readonly any[],
    fermentation_qualifiers: (brew.fermentation_qualifiers ?? []) as readonly any[],
    drying_modifiers: (brew.drying_modifiers ?? []) as readonly any[],
    intervention_modifiers: (brew.intervention_modifiers ?? []) as readonly any[],
    experimental_modifiers: (brew.experimental_modifiers ?? []) as readonly any[],
    decaf_modifier: null,
    signature_method: brew.signature_method,
  }
}

/**
 * A modifier-combo entry: the structured pattern (sans base, since combos are
 * grouped within a base hub) + count + eligibility flag + display label.
 */
export interface ModifierComboEntry {
  slug: string  // e.g. "anaerobic" or "double-anaerobic-thermal-shock-yeast-inoculated"
  label: string  // e.g. "Anaerobic" or "Double Anaerobic + Thermal Shock + Yeast Inoculated"
  count: number
  eligible: boolean  // count >= SUB_PAGE_THRESHOLD
  axis: ModifierAxis | 'multi' | null  // null when no modifiers (pure base)
  structured: StructuredProcess
}

function structuredLabel(structured: StructuredProcess): string {
  const fermentHasAnaerobic = structured.fermentation_modifiers.some(
    (m) => m === 'Anaerobic' || m === 'Double Anaerobic' || m === 'Triple Anaerobic',
  )
  const sortedDrying = [...structured.drying_modifiers].sort().map((m) =>
    fermentHasAnaerobic && /^Anaerobic\s/i.test(m) ? m.replace(/^Anaerobic\s+/i, '') : m,
  )
  const all = [
    ...[...structured.fermentation_modifiers].sort(),
    ...sortedDrying,
    ...[...structured.intervention_modifiers].sort(),
    ...[...structured.experimental_modifiers].sort(),
  ]
  return all.join(' + ')
}

function detectAxis(structured: StructuredProcess): ModifierAxis | 'multi' | null {
  const axes: ModifierAxis[] = []
  if (structured.fermentation_modifiers.length > 0) axes.push('fermentation')
  if (structured.drying_modifiers.length > 0) axes.push('drying')
  if (structured.intervention_modifiers.length > 0) axes.push('intervention')
  if (structured.experimental_modifiers.length > 0) axes.push('experimental')
  if (axes.length === 0) return null
  if (axes.length === 1) return axes[0]
  return 'multi'
}

// ---------------------------------------------------------------------------
// Per-hub aggregation
// ---------------------------------------------------------------------------

export interface BaseHubAggregation {
  all: Brew[]
  pure: Brew[]
  modified: Brew[]
  modifierCombos: ModifierComboEntry[]  // sorted by count desc, then alphabetic
  honeySubprocesses: { name: HoneySubprocess; count: number; eligible: boolean }[]
  signatures: { name: string; count: number }[]  // always eligible per Rule 2
}

export function aggregateBaseHub(brews: Brew[], base: BaseProcess): BaseHubAggregation {
  const all = brews.filter((b) => b.base_process === base)
  const pure = all.filter(isPure)
  const modified = all.filter((b) => !isPure(b))

  // Group non-pure non-signature non-subprocess brews by modifier-combo slug.
  // Signatures + Honey subprocesses are split into their own clusters.
  const combosMap = new Map<string, { brews: Brew[]; structured: StructuredProcess }>()
  for (const brew of modified) {
    if (brew.signature_method) continue
    if (brew.subprocess) continue
    const structured = brewToStructured(brew)
    const slug = modifierComboSlug(structured)
    if (!slug) continue  // shouldn't happen for non-pure brews but guard
    const existing = combosMap.get(slug)
    if (existing) existing.brews.push(brew)
    else combosMap.set(slug, { brews: [brew], structured })
  }

  const modifierCombos: ModifierComboEntry[] = Array.from(combosMap.entries()).map(
    ([slug, { brews, structured }]) => ({
      slug,
      label: structuredLabel(structured),
      count: brews.length,
      eligible: brews.length >= SUB_PAGE_THRESHOLD,
      axis: detectAxis(structured),
      structured,
    }),
  )
  modifierCombos.sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))

  // Honey subprocesses — always eligible per Rule 3 once count >= 1.
  const subprocessCounts = new Map<HoneySubprocess, number>()
  for (const brew of all) {
    if (!brew.subprocess) continue
    subprocessCounts.set(
      brew.subprocess as HoneySubprocess,
      (subprocessCounts.get(brew.subprocess as HoneySubprocess) ?? 0) + 1,
    )
  }
  const honeySubprocesses = Array.from(subprocessCounts.entries())
    .map(([name, count]) => ({ name, count, eligible: count >= 1 }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))

  // Signatures — always eligible per Rule 2.
  const sigCounts = new Map<string, number>()
  for (const brew of all) {
    if (!brew.signature_method) continue
    sigCounts.set(brew.signature_method, (sigCounts.get(brew.signature_method) ?? 0) + 1)
  }
  const signatures = Array.from(sigCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))

  return { all, pure, modified, modifierCombos, honeySubprocesses, signatures }
}

// ---------------------------------------------------------------------------
// Mini-page aggregations
// ---------------------------------------------------------------------------

export function aggregateModifierCombo(
  brews: Brew[],
  base: BaseProcess,
  combo: StructuredProcess,
): Brew[] {
  const slug = modifierComboSlug(combo)
  return brews.filter((b) => {
    if (b.base_process !== base) return false
    if (b.signature_method) return false
    if (b.subprocess) return false
    return modifierComboSlug(brewToStructured(b)) === slug
  })
}

export function aggregateHoneySubprocess(
  brews: Brew[],
  subprocess: HoneySubprocess,
): Brew[] {
  return brews.filter((b) => b.base_process === 'Honey' && b.subprocess === subprocess)
}

export function aggregateSignature(brews: Brew[], name: string): Brew[] {
  return brews.filter((b) => b.signature_method === name)
}

// ---------------------------------------------------------------------------
// Cross-base Modifier Index aggregation
// ---------------------------------------------------------------------------

export interface ModifierIndexAggregation {
  all: Brew[]
  byBase: Partial<Record<BaseProcess, number>>
  commonStacks: { label: string; base: BaseProcess; count: number }[]  // top 5
}

function brewContainsModifier(brew: Brew, modifier: string): boolean {
  return (
    (brew.fermentation_modifiers ?? []).includes(modifier) ||
    (brew.drying_modifiers ?? []).includes(modifier) ||
    (brew.intervention_modifiers ?? []).includes(modifier) ||
    (brew.experimental_modifiers ?? []).includes(modifier)
  )
}

export function aggregateModifierIndex(
  brews: Brew[],
  modifier: string,
): ModifierIndexAggregation {
  const all = brews.filter((b) => brewContainsModifier(b, modifier))

  const byBase: Partial<Record<BaseProcess, number>> = {}
  for (const brew of all) {
    const b = brew.base_process as BaseProcess
    byBase[b] = (byBase[b] ?? 0) + 1
  }

  // Common stacks: bucket brews by (base + full structural fingerprint).
  // Label includes signature method when present per Chris's "Anaerobic + Aerobic (Hybrid Washed)" hint.
  const stackMap = new Map<string, { label: string; base: BaseProcess; count: number }>()
  for (const brew of all) {
    const structured = brewToStructured(brew)
    const modifierParts = [
      ...structured.fermentation_modifiers,
      ...structured.drying_modifiers,
      ...structured.intervention_modifiers,
      ...structured.experimental_modifiers,
    ].sort()
    let label = modifierParts.length === 0 ? `Pure ${structured.base_process}` : modifierParts.join(' + ')
    if (structured.signature_method) label = `${label} (${structured.signature_method})`
    const key = `${structured.base_process}|${label}`
    const existing = stackMap.get(key)
    if (existing) existing.count += 1
    else stackMap.set(key, { label, base: structured.base_process, count: 1 })
  }
  const commonStacks = Array.from(stackMap.values())
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, 8)  // cap at 8 stacks

  return { all, byBase, commonStacks }
}

// ---------------------------------------------------------------------------
// Eligibility helpers (for /processes index + base hub chip rendering)
// ---------------------------------------------------------------------------

/**
 * Returns eligible modifier-combo slugs for a given base. A combo is eligible
 * when ≥ SUB_PAGE_THRESHOLD non-signature non-subprocess brews share its
 * structural fingerprint.
 */
export function eligibleModifierCombos(brews: Brew[], base: BaseProcess): string[] {
  const hub = aggregateBaseHub(brews, base)
  return hub.modifierCombos.filter((c) => c.eligible).map((c) => c.slug)
}

/**
 * Returns eligible cross-base Modifier Index entries. A modifier is eligible
 * when ≥ SUB_PAGE_THRESHOLD brews (across all bases, including signatures)
 * contain it in any axis. Returns the canonical modifier name + total count.
 */
export interface ModifierIndexEntry {
  name: string
  axis: ModifierAxis
  count: number
  byBase: Partial<Record<BaseProcess, number>>
}

export function eligibleModifierIndexEntries(brews: Brew[]): ModifierIndexEntry[] {
  // Build inverted index: modifier name → { axis, brews containing it }
  const buckets = new Map<string, { axis: ModifierAxis; brews: Set<Brew> }>()
  for (const brew of brews) {
    for (const m of brew.fermentation_modifiers ?? []) addToBucket(buckets, m, 'fermentation', brew)
    for (const m of brew.drying_modifiers ?? []) addToBucket(buckets, m, 'drying', brew)
    for (const m of brew.intervention_modifiers ?? []) addToBucket(buckets, m, 'intervention', brew)
    for (const m of brew.experimental_modifiers ?? []) addToBucket(buckets, m, 'experimental', brew)
  }

  const entries: ModifierIndexEntry[] = []
  for (const [name, { axis, brews: brewSet }] of Array.from(buckets.entries())) {
    if (brewSet.size < SUB_PAGE_THRESHOLD) continue
    const byBase: Partial<Record<BaseProcess, number>> = {}
    for (const b of Array.from(brewSet)) {
      const bp = b.base_process as BaseProcess
      byBase[bp] = (byBase[bp] ?? 0) + 1
    }
    entries.push({ name, axis, count: brewSet.size, byBase })
  }
  entries.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
  return entries
}

function addToBucket(
  buckets: Map<string, { axis: ModifierAxis; brews: Set<Brew> }>,
  modifier: string,
  axis: ModifierAxis,
  brew: Brew,
) {
  const existing = buckets.get(modifier)
  if (existing) {
    existing.brews.add(brew)
  } else {
    buckets.set(modifier, { axis, brews: new Set([brew]) })
  }
}

/**
 * Returns the list of signatures that have at least 1 brew in the corpus.
 * Signatures are always eligible per Rule 2 — this filter exists only to
 * surface signatures that have brewed at least once.
 */
export function brewedSignatures(brews: Brew[]): { name: string; count: number; base: BaseProcess | null }[] {
  const counts = new Map<string, { count: number; base: BaseProcess | null }>()
  for (const brew of brews) {
    if (!brew.signature_method) continue
    const existing = counts.get(brew.signature_method)
    if (existing) existing.count += 1
    else counts.set(brew.signature_method, { count: 1, base: brew.base_process as BaseProcess })
  }
  return Array.from(counts.entries())
    .map(([name, { count, base }]) => ({ name, count, base }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}
