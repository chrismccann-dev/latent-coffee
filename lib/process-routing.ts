// URL routing helpers for the Sub Pages 4 /processes architecture.
// One place for slug encoding, reverse parsing, and the sub-page eligibility
// threshold so the rule lives in a single tunable constant.
//
// Page surface inventory the helpers cover:
//   /processes                                            — index
//   /processes/[base]                                     — base hub
//   /processes/[base]/[subprocess]                        — Honey subprocess sub-page
//   /processes/[base]/modifiers/[combo]                   — per-base modifier-combo mini-page
//   /processes/modifiers/[modifier]                       — cross-base Modifier Index page
//   /processes/signatures/[name]                          — signature method page

import {
  BASE_PROCESSES,
  type BaseProcess,
  HONEY_SUBPROCESSES,
  type HoneySubprocess,
  FERMENTATION_MODIFIERS,
  type FermentationModifier,
  DRYING_MODIFIERS,
  type DryingModifier,
  INTERVENTION_MODIFIERS,
  type InterventionModifier,
  EXPERIMENTAL_MODIFIERS,
  type ExperimentalModifier,
  SIGNATURE_NAMES,
  type StructuredProcess,
} from './process-registry'

/**
 * The eligibility threshold for "earns its own sub-page" (Chris's Rule 1).
 * Signature methods (Rule 2) and Honey color tiers (Rule 3) ignore this.
 * Tune in one place if needed.
 */
export const SUB_PAGE_THRESHOLD = 3

// ---------------------------------------------------------------------------
// kebab-case slug helpers
// ---------------------------------------------------------------------------

function kebab(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/[+]/g, '-')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function baseSlug(base: BaseProcess): string {
  return kebab(base)
}

/**
 * Honey subprocess slugs strip the "Honey" suffix — `/processes/honey/white`,
 * `/processes/honey/generic`. Avoids the redundant "honey-honey" in the URL.
 */
export function subprocessSlug(subprocess: HoneySubprocess): string {
  return kebab(subprocess.replace(/\s+Honey$/i, ''))
}

export function modifierSlug(modifier: string): string {
  return kebab(modifier)
}

export function signatureSlug(name: string): string {
  return kebab(name)
}

/**
 * Deterministic kebab-case slug from a structured modifier-combo. Modifiers
 * across all axes are merged into one alphabetized list so the same combo
 * always produces the same slug regardless of which axis a modifier lives in.
 * Honey subprocess (when present) is appended as a separate prefix segment
 * because it's a within-base structural variant, not a modifier.
 */
export function modifierComboSlug(s: StructuredProcess): string {
  const modifiers = [
    ...s.fermentation_modifiers,
    ...s.drying_modifiers,
    ...s.intervention_modifiers,
    ...s.experimental_modifiers,
  ]
    .map((m) => kebab(m))
    .sort()
  return modifiers.join('-')
}

// ---------------------------------------------------------------------------
// Reverse parsers (slug → canonical names)
// ---------------------------------------------------------------------------

const baseBySlug = new Map(BASE_PROCESSES.map((b) => [baseSlug(b), b]))
const subprocessBySlug = new Map(HONEY_SUBPROCESSES.map((s) => [subprocessSlug(s), s]))

const fermBySlug = new Map(FERMENTATION_MODIFIERS.map((m) => [kebab(m), m]))
const dryingBySlug = new Map(DRYING_MODIFIERS.map((m) => [kebab(m), m]))
const interventionBySlug = new Map(INTERVENTION_MODIFIERS.map((m) => [kebab(m), m]))
const experimentalBySlug = new Map(EXPERIMENTAL_MODIFIERS.map((m) => [kebab(m), m]))

const signatureBySlug = new Map(SIGNATURE_NAMES.map((s) => [signatureSlug(s), s]))

export function parseBaseSlug(slug: string): BaseProcess | null {
  return baseBySlug.get(slug) ?? null
}

export function parseSubprocessSlug(slug: string): HoneySubprocess | null {
  return subprocessBySlug.get(slug) ?? null
}

export function parseSignatureSlug(slug: string): string | null {
  return signatureBySlug.get(slug) ?? null
}

/**
 * Resolves a single-modifier slug to canonical names across all axes. Returns
 * `{ name, axis }` for the canonical modifier matching the slug, or null when
 * the slug doesn't match any modifier in any axis.
 */
export type ModifierAxis = 'fermentation' | 'drying' | 'intervention' | 'experimental'

export function parseModifierSlug(slug: string): { name: string; axis: ModifierAxis } | null {
  const ferm = fermBySlug.get(slug)
  if (ferm) return { name: ferm, axis: 'fermentation' }
  const drying = dryingBySlug.get(slug)
  if (drying) return { name: drying, axis: 'drying' }
  const interv = interventionBySlug.get(slug)
  if (interv) return { name: interv, axis: 'intervention' }
  const exp = experimentalBySlug.get(slug)
  if (exp) return { name: exp, axis: 'experimental' }
  return null
}

/**
 * Parses a per-base modifier-combo slug back into a StructuredProcess.
 * Splits the slug on `-`, then greedily matches segments against canonical
 * modifier names in each axis (longest-first so multi-word modifiers like
 * "double-anaerobic" or "thermal-shock" match before "anaerobic" / "shock"
 * fragments would). Returns null when any segment doesn't resolve.
 */
export function parseModifierComboSlug(
  combo: string,
  base: BaseProcess,
): StructuredProcess | null {
  if (!combo) return null

  // Build a lookup of every modifier slug → { name, axis }, sorted by slug
  // length descending so longest match wins on greedy parse.
  const allModifiers: { slug: string; name: string; axis: ModifierAxis }[] = [
    ...FERMENTATION_MODIFIERS.map((m) => ({ slug: kebab(m), name: m as string, axis: 'fermentation' as const })),
    ...DRYING_MODIFIERS.map((m) => ({ slug: kebab(m), name: m as string, axis: 'drying' as const })),
    ...INTERVENTION_MODIFIERS.map((m) => ({ slug: kebab(m), name: m as string, axis: 'intervention' as const })),
    ...EXPERIMENTAL_MODIFIERS.map((m) => ({ slug: kebab(m), name: m as string, axis: 'experimental' as const })),
  ].sort((a, b) => b.slug.length - a.slug.length)

  const ferment: FermentationModifier[] = []
  const drying: DryingModifier[] = []
  const intervention: InterventionModifier[] = []
  const experimental: ExperimentalModifier[] = []

  let remaining = combo
  while (remaining.length > 0) {
    const match = allModifiers.find(
      (m) => remaining === m.slug || remaining.startsWith(m.slug + '-'),
    )
    if (!match) return null

    switch (match.axis) {
      case 'fermentation':
        ferment.push(match.name as FermentationModifier)
        break
      case 'drying':
        drying.push(match.name as DryingModifier)
        break
      case 'intervention':
        intervention.push(match.name as InterventionModifier)
        break
      case 'experimental':
        experimental.push(match.name as ExperimentalModifier)
        break
    }

    remaining = remaining.slice(match.slug.length)
    if (remaining.startsWith('-')) remaining = remaining.slice(1)
  }

  return {
    base_process: base,
    subprocess: null,
    fermentation_modifiers: ferment,
    fermentation_qualifiers: [],
    drying_modifiers: drying,
    intervention_modifiers: intervention,
    experimental_modifiers: experimental,
    decaf_modifier: null,
    signature_method: null,
  }
}

// ---------------------------------------------------------------------------
// Aggregation cache keys (mirror page URLs but stripped of routing prefixes)
// ---------------------------------------------------------------------------

export type AggregationKind =
  | 'base'
  | 'honey_subprocess'
  | 'modifier_combo'
  | 'modifier_index'
  | 'signature'

export function baseAggregationKey(base: BaseProcess): string {
  return baseSlug(base)
}

export function honeySubprocessAggregationKey(subprocess: HoneySubprocess): string {
  return subprocessSlug(subprocess)
}

export function modifierComboAggregationKey(base: BaseProcess, combo: string): string {
  return `${baseSlug(base)}/${combo}`
}

export function modifierIndexAggregationKey(modifier: string): string {
  return modifierSlug(modifier)
}

export function signatureAggregationKey(name: string): string {
  return signatureSlug(name)
}

// ---------------------------------------------------------------------------
// URL builders (for cross-link convenience)
// ---------------------------------------------------------------------------

export function baseHubUrl(base: BaseProcess): string {
  return `/processes/${baseSlug(base)}`
}

export function honeySubprocessUrl(subprocess: HoneySubprocess): string {
  return `/processes/honey/${subprocessSlug(subprocess)}`
}

export function modifierComboUrl(base: BaseProcess, combo: string): string {
  return `/processes/${baseSlug(base)}/modifiers/${combo}`
}

export function modifierIndexUrl(modifier: string): string {
  return `/processes/modifiers/${modifierSlug(modifier)}`
}

/**
 * Cross-link URL for a base-process value coming off a brew row (a plain
 * string, not the `BaseProcess` union). Applies the canonical `kebab` so the
 * 4 detail pages that build a "/processes/{base}" cross-link stop re-inlining
 * the slug regex (Candidate 4 of the detail-page dedup audit). Identical output
 * to `baseHubUrl` for the canonical bases, but accepts any string.
 */
export function processCrossLinkUrl(baseProcess: string): string {
  return `/processes/${kebab(baseProcess)}`
}

export function signatureUrl(name: string): string {
  return `/processes/signatures/${signatureSlug(name)}`
}
