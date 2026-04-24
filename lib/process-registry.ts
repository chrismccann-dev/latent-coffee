// Canonical process registry — the single source of truth for process names
// across a composable taxonomy (base + subprocess + modifier axes + signature).
// Consumed by:
//   - /processes index + detail pages (family grouping via back-compat classifier)
//   - /brews page filters (process-family filter pill)
//   - /add + /brews/[id]/edit (enforcement via CanonicalTextInput — lands in 1e.3)
//   - sprint 1e.2 schema migration (decomposeProcess + LEGACY_DECOMPOSITIONS)
//
// Source: docs/taxonomies/processes.md (authored content) + Chris's Process
// Taxonomy Registry CSV (2026-04-22, revised 2026-04-23) + Process Aliases
// CSV + Roberta Sami's process taxonomy + Robert (Moonwake) producer notes +
// 55-brew corpus decomposition.
//
// Unlike Variety + Region (flat canonical lists), Process is COMPOSABLE —
// every brew carries a base + optional Honey subprocess + up to 4 stackable
// modifier axes + optional decaf + optional signature. The registry exports
// a CanonicalLookup per axis; the full StructuredProcess type is consumed
// by the 1e.2 migration + 1e.3 picker.
//
// Additions require a deliberate 3-step edit: (1) docs/taxonomies/processes.md
// per-axis section, (2) the axis's canonical list below, (3) a migration if
// existing brew rows need re-decomposing.

import { makeCanonicalLookup } from './canonical-registry'

// ---------------------------------------------------------------------------
// Base processes (4)
// ---------------------------------------------------------------------------

export const BASE_PROCESSES = ['Washed', 'Honey', 'Natural', 'Wet-hulled'] as const
export type BaseProcess = (typeof BASE_PROCESSES)[number]

export const BASE_PROCESS_ALIASES: Readonly<Record<string, string>> = {
  // Washed family
  'Fully Washed': 'Washed',
  'Traditional Washed': 'Washed',
  'Wet Processed': 'Washed',
  Lavado: 'Washed',
  'Lavado Tradicional': 'Washed',
  'Classic Washed': 'Washed',

  // Honey family
  'Pulped Natural': 'Honey',
  Miel: 'Honey',
  'Honey Process': 'Honey',
  'Miel Process': 'Honey',
  // Semi-washed is Honey in LATAM context; sync should flag non-LATAM uses.
  'Semi-washed': 'Honey',
  'Semi Washed': 'Honey',

  // Natural family
  'Traditional Natural': 'Natural',
  'Dry Processed': 'Natural',
  'Sun Dried': 'Natural',
  Unwashed: 'Natural',
  Seco: 'Natural',
  // Supernatural dropped from canonical per 1e.1 design — Robert's research
  // found no consistent distinct operation beyond "good natural."
  Supernatural: 'Natural',

  // Wet-hulled family
  'Wet Hulled': 'Wet-hulled',
  'Wet-hulling': 'Wet-hulled',
  'Giling Basah': 'Wet-hulled',
}

export const BASE_PROCESS_LOOKUP = makeCanonicalLookup(BASE_PROCESSES, BASE_PROCESS_ALIASES)
export const isCanonicalBaseProcess = BASE_PROCESS_LOOKUP.isCanonical
export const findClosestBaseProcess = BASE_PROCESS_LOOKUP.findClosest

// ---------------------------------------------------------------------------
// Honey subprocesses (color tiers — the only subprocess axis)
// ---------------------------------------------------------------------------

export const HONEY_SUBPROCESSES = [
  'White Honey',
  'Yellow Honey',
  'Red Honey',
  'Black Honey',
  'Purple Honey',
  'Generic Honey',
  'Hydro Honey',
] as const
export type HoneySubprocess = (typeof HONEY_SUBPROCESSES)[number]

export const HONEY_SUBPROCESS_ALIASES: Readonly<Record<string, string>> = {
  Blanco: 'White Honey',
  Amarillo: 'Yellow Honey',
  Rojo: 'Red Honey',
  Negro: 'Black Honey',
  'Purple Mucilage': 'Purple Honey',
}

export const HONEY_SUBPROCESS_LOOKUP = makeCanonicalLookup(
  HONEY_SUBPROCESSES,
  HONEY_SUBPROCESS_ALIASES,
)

// ---------------------------------------------------------------------------
// Fermentation modifiers (13)
// ---------------------------------------------------------------------------

export const FERMENTATION_MODIFIERS = [
  'Anaerobic',
  'Double Anaerobic',
  'Triple Anaerobic',
  'Aerobic',
  'Carbonic Maceration',
  'Nitrogen Maceration',
  'Cold Fermentation',
  'Cryomaceration',
  'Thermal Shock',
  'Yeast Inoculated',
  'Lactic Fermentation',
  'Acetic Fermentation',
  'Mossto',
] as const
export type FermentationModifier = (typeof FERMENTATION_MODIFIERS)[number]

export const FERMENTATION_ALIASES: Readonly<Record<string, string>> = {
  Anoxic: 'Anaerobic',
  'No Oxygen': 'Anaerobic',
  'Zero O2': 'Anaerobic',
  'Oxygen Free': 'Anaerobic',
  'Sealed Tank': 'Anaerobic',
  'Hermetic Fermentation': 'Anaerobic',
  'Double Fermentation Anaerobic': 'Double Anaerobic',
  'Double Fermentation': 'Double Anaerobic',
  Oxidator: 'Aerobic',
  'Oxidation Fermentation': 'Aerobic',
  CM: 'Carbonic Maceration',
  Carbonic: 'Carbonic Maceration',
  'CO2 Maceration': 'Carbonic Maceration',
  'Nitrogen Flushed': 'Nitrogen Maceration',
  'N2 Maceration': 'Nitrogen Maceration',
  'Cold Ferment': 'Cold Fermentation',
  'Cold Fermented': 'Cold Fermentation',
  Cryo: 'Cryomaceration',
  Thermalshock: 'Thermal Shock',
  'Hot Cold Shock': 'Thermal Shock',
  'Hot-Cold Fermentation': 'Thermal Shock',
  'Inoculated Yeast': 'Yeast Inoculated',
  'Cultured Yeast': 'Yeast Inoculated',
  'Selected Yeast': 'Yeast Inoculated',
  'Yeast Fermentation': 'Yeast Inoculated',
  Lactic: 'Lactic Fermentation',
  Acetic: 'Acetic Fermentation',
  Mosto: 'Mossto',
  'Coffee Mosto': 'Mossto',
}

export const FERMENTATION_LOOKUP = makeCanonicalLookup(
  FERMENTATION_MODIFIERS,
  FERMENTATION_ALIASES,
)

// ---------------------------------------------------------------------------
// Drying modifiers (5)
// ---------------------------------------------------------------------------

export const DRYING_MODIFIERS = [
  'Dark Room Dried',
  'Slow Dry',
  'Anaerobic Slow Dry',
  'Raised Bed',
  'Patio Dried',
] as const
export type DryingModifier = (typeof DRYING_MODIFIERS)[number]

export const DRYING_ALIASES: Readonly<Record<string, string>> = {
  DRD: 'Dark Room Dried',
  'Dark Room': 'Dark Room Dried',
  'Shade Dried': 'Dark Room Dried',
  LDE: 'Dark Room Dried',
  'Slow Dried': 'Slow Dry',
  ASD: 'Anaerobic Slow Dry',
  'African Bed': 'Raised Bed',
}

export const DRYING_LOOKUP = makeCanonicalLookup(DRYING_MODIFIERS, DRYING_ALIASES)

// ---------------------------------------------------------------------------
// Intervention modifiers (7) — co-ferments + infusions
// ---------------------------------------------------------------------------

export const INTERVENTION_MODIFIERS = [
  'Co-ferment',
  'Fruit Co-ferment',
  'Floral Co-ferment',
  'Spice Co-ferment',
  'Cascara Co-ferment',
  'Cascara Infusion',
  'Infusion',
] as const
export type InterventionModifier = (typeof INTERVENTION_MODIFIERS)[number]

export const INTERVENTION_ALIASES: Readonly<Record<string, string>> = {
  Coferment: 'Co-ferment',
  'Co Fermented': 'Co-ferment',
  'Fruit Fermented': 'Fruit Co-ferment',
  'Fruit Coferment': 'Fruit Co-ferment',
  'Cascara Fermented': 'Cascara Co-ferment',
  'Cascara Infused': 'Cascara Infusion',
  Infused: 'Infusion',
  'Flavor Infused': 'Infusion',
  'Spice Fermented': 'Spice Co-ferment',
}

export const INTERVENTION_LOOKUP = makeCanonicalLookup(
  INTERVENTION_MODIFIERS,
  INTERVENTION_ALIASES,
)

// ---------------------------------------------------------------------------
// Experimental modifiers (4)
// ---------------------------------------------------------------------------

export const EXPERIMENTAL_MODIFIERS = ['Koji', 'SCOBY', 'Enzyme-Assisted', 'Barrel-Aged'] as const
export type ExperimentalModifier = (typeof EXPERIMENTAL_MODIFIERS)[number]

export const EXPERIMENTAL_ALIASES: Readonly<Record<string, string>> = {
  'Koji Fermentation': 'Koji',
  'Kombucha Fermentation': 'SCOBY',
  'Enzyme Processed': 'Enzyme-Assisted',
  Enzymatic: 'Enzyme-Assisted',
  'Barrel Aged': 'Barrel-Aged',
  'Barrel Fermented': 'Barrel-Aged',
  'Whiskey Barrel': 'Barrel-Aged',
  'Rum Barrel': 'Barrel-Aged',
  'Wine Barrel': 'Barrel-Aged',
}

export const EXPERIMENTAL_LOOKUP = makeCanonicalLookup(
  EXPERIMENTAL_MODIFIERS,
  EXPERIMENTAL_ALIASES,
)

// ---------------------------------------------------------------------------
// Decaf modifiers (4) — orthogonal single-value axis
// ---------------------------------------------------------------------------

export const DECAF_MODIFIERS = [
  'Swiss Water',
  'Mountain Water',
  'Ethyl Acetate',
  'CO2 Process',
] as const
export type DecafModifier = (typeof DECAF_MODIFIERS)[number]

export const DECAF_ALIASES: Readonly<Record<string, string>> = {
  SWP: 'Swiss Water',
  MWP: 'Mountain Water',
  EA: 'Ethyl Acetate',
  'Sugarcane Decaf': 'Ethyl Acetate',
  'Sugarcane EA': 'Ethyl Acetate',
  'CO2 Decaf': 'CO2 Process',
  'Carbon Dioxide Decaf': 'CO2 Process',
}

export const DECAF_LOOKUP = makeCanonicalLookup(DECAF_MODIFIERS, DECAF_ALIASES)

// ---------------------------------------------------------------------------
// Signature methods (proper-name proprietary techniques)
// ---------------------------------------------------------------------------

export interface SignatureEntry {
  name: string
  producer: string
  country: string
  base: BaseProcess
  fermentation_modifiers?: readonly FermentationModifier[]
  drying_modifiers?: readonly DryingModifier[]
  intervention_modifiers?: readonly InterventionModifier[]
}

export const SIGNATURE_METHODS: readonly SignatureEntry[] = [
  // Moonshadow is defined by the shade-dry + extended LDE drying protocol;
  // typically applied to a Natural ferment but a rare Washed variant exists
  // (MSW1 Airworks x Shoebox x Alo special lot, 2024). Base here reflects
  // the typical shape — individual brews can carry signature:Moonshadow with
  // their own base_process.
  {
    name: 'Moonshadow',
    producer: 'Alo Coffee',
    country: 'Ethiopia',
    base: 'Natural',
    drying_modifiers: ['Dark Room Dried', 'Slow Dry'],
  },
  {
    name: 'TyOxidator',
    producer: 'Pepe Jijon / Finca Soledad',
    country: 'Ecuador',
    base: 'Washed',
    fermentation_modifiers: ['Aerobic'],
  },
  {
    name: 'Hybrid Washed',
    producer: 'Café Granja La Esperanza (CGLE)',
    country: 'Colombia',
    base: 'Washed',
    fermentation_modifiers: ['Anaerobic', 'Aerobic'],
  },
]

export const SIGNATURE_NAMES = SIGNATURE_METHODS.map((s) => s.name) as readonly string[]

export const SIGNATURE_ALIASES: Readonly<Record<string, string>> = {
  'Moonshadow Natural': 'Moonshadow',
  'Moonshadow Washed': 'Moonshadow',
}

export const SIGNATURE_LOOKUP = makeCanonicalLookup(SIGNATURE_NAMES, SIGNATURE_ALIASES)

const signatureByLowerName = new Map(SIGNATURE_METHODS.map((s) => [s.name.toLowerCase(), s]))

export function getSignatureEntry(name: string | null | undefined): SignatureEntry | null {
  if (!name) return null
  return signatureByLowerName.get(name.trim().toLowerCase()) ?? null
}

// ---------------------------------------------------------------------------
// Structured process type — shape consumed by 1e.2 migration + 1e.3 picker
// ---------------------------------------------------------------------------

export interface StructuredProcess {
  base_process: BaseProcess
  subprocess: HoneySubprocess | null
  fermentation_modifiers: readonly FermentationModifier[]
  drying_modifiers: readonly DryingModifier[]
  intervention_modifiers: readonly InterventionModifier[]
  experimental_modifiers: readonly ExperimentalModifier[]
  decaf_modifier: DecafModifier | null
  signature_method: string | null
}

const EMPTY_STRUCTURE: Pick<
  StructuredProcess,
  'fermentation_modifiers' | 'drying_modifiers' | 'intervention_modifiers' | 'experimental_modifiers'
> = {
  fermentation_modifiers: [],
  drying_modifiers: [],
  intervention_modifiers: [],
  experimental_modifiers: [],
}

function structured(partial: Partial<StructuredProcess> & { base_process: BaseProcess }): StructuredProcess {
  return {
    subprocess: null,
    decaf_modifier: null,
    signature_method: null,
    ...EMPTY_STRUCTURE,
    ...partial,
  }
}

// ---------------------------------------------------------------------------
// Legacy decompositions — the 20 distinct brews.process values as of
// 2026-04-23. Used by decomposeProcess; mirrored into brews.base_process /
// subprocess / *_modifiers / decaf_modifier / signature_method via
// migration 025.
// ---------------------------------------------------------------------------

export const LEGACY_DECOMPOSITIONS: Readonly<Record<string, StructuredProcess>> = {
  Washed: structured({ base_process: 'Washed' }),
  Natural: structured({ base_process: 'Natural' }),
  'Anaerobic Washed': structured({
    base_process: 'Washed',
    fermentation_modifiers: ['Anaerobic'],
  }),
  'White Honey': structured({ base_process: 'Honey', subprocess: 'White Honey' }),
  'Anaerobic Honey': structured({
    base_process: 'Honey',
    subprocess: 'Generic Honey',
    fermentation_modifiers: ['Anaerobic'],
  }),
  'Anaerobic Natural': structured({
    base_process: 'Natural',
    fermentation_modifiers: ['Anaerobic'],
  }),
  'Cold Fermented Washed': structured({
    base_process: 'Washed',
    fermentation_modifiers: ['Cold Fermentation'],
  }),
  // MSW1 Airworks x Shoebox x Alo special-lot Washed variant of Moonshadow.
  // Moonshadow is typically Natural; this is the exception, not a mis-label.
  'Moonshadow Washed': structured({
    base_process: 'Washed',
    drying_modifiers: ['Dark Room Dried', 'Slow Dry'],
    signature_method: 'Moonshadow',
  }),
  'Anoxic Natural': structured({
    base_process: 'Natural',
    fermentation_modifiers: ['Anaerobic'],
  }),
  'Double Anaerobic Thermal Shock': structured({
    base_process: 'Washed',
    fermentation_modifiers: ['Double Anaerobic', 'Thermal Shock', 'Yeast Inoculated'],
  }),
  'Tamarind + Red Fruit Co-ferment Washed': structured({
    base_process: 'Washed',
    fermentation_modifiers: ['Yeast Inoculated'],
    intervention_modifiers: ['Fruit Co-ferment'],
  }),
  'Yeast Inoculated Natural': structured({
    base_process: 'Natural',
    fermentation_modifiers: ['Yeast Inoculated'],
  }),
  'Yeast Anaerobic Natural': structured({
    base_process: 'Natural',
    fermentation_modifiers: ['Anaerobic', 'Yeast Inoculated'],
  }),
  'Dark Room Dry Natural': structured({
    base_process: 'Natural',
    drying_modifiers: ['Dark Room Dried'],
  }),
  Honey: structured({ base_process: 'Honey', subprocess: 'Generic Honey' }),
  'Double Fermentation Thermal Shock': structured({
    base_process: 'Washed',
    fermentation_modifiers: ['Double Anaerobic', 'Thermal Shock', 'Yeast Inoculated'],
  }),
  'ASD Natural': structured({
    base_process: 'Natural',
    fermentation_modifiers: ['Anaerobic'],
    drying_modifiers: ['Slow Dry'],
  }),
  'Washed Sakura Co-ferment': structured({
    base_process: 'Washed',
    intervention_modifiers: ['Floral Co-ferment'],
  }),
  TyOxidator: structured({
    base_process: 'Washed',
    fermentation_modifiers: ['Aerobic'],
    signature_method: 'TyOxidator',
  }),
  'Washed Cascara Infused': structured({
    base_process: 'Washed',
    intervention_modifiers: ['Cascara Infusion'],
  }),
}

/**
 * Shallow-copies the structured fields into an object shaped for a
 * `brews` row insert/update. Spreads the 4 readonly modifier arrays into
 * mutable arrays at the boundary. Used at every save site to avoid
 * repeating the 8-field spread.
 */
export function structuredProcessColumns(s: StructuredProcess) {
  return {
    base_process: s.base_process,
    subprocess: s.subprocess,
    fermentation_modifiers: [...s.fermentation_modifiers],
    drying_modifiers: [...s.drying_modifiers],
    intervention_modifiers: [...s.intervention_modifiers],
    experimental_modifiers: [...s.experimental_modifiers],
    decaf_modifier: s.decaf_modifier,
    signature_method: s.signature_method,
  }
}

/**
 * True when every entered value resolves canonically. Modifier arrays must
 * be strictly canonical (no aliases); signature and decaf may be aliases
 * (resolved on save). Used by /add + /edit save gates.
 */
export function isProcessResolvable(s: StructuredProcess): boolean {
  if (!BASE_PROCESSES.includes(s.base_process)) return false
  if (s.subprocess && !HONEY_SUBPROCESSES.includes(s.subprocess)) return false
  if (s.decaf_modifier && !DECAF_MODIFIERS.includes(s.decaf_modifier)) return false
  if (s.signature_method && !SIGNATURE_LOOKUP.isResolvable(s.signature_method)) return false
  for (const m of s.fermentation_modifiers) if (!FERMENTATION_LOOKUP.isCanonical(m)) return false
  for (const m of s.drying_modifiers) if (!DRYING_LOOKUP.isCanonical(m)) return false
  for (const m of s.intervention_modifiers) if (!INTERVENTION_LOOKUP.isCanonical(m)) return false
  for (const m of s.experimental_modifiers) if (!EXPERIMENTAL_LOOKUP.isCanonical(m)) return false
  return true
}

// ---------------------------------------------------------------------------
// composeProcess — structured → display string
// ---------------------------------------------------------------------------

/**
 * Builds a canonical display string from structured fields. Used to populate
 * the denormalized `brews.process` column for back-compat with the existing
 * `/processes` page (string-equality grouping) until 1e.4 redesigns it.
 *
 * Rules:
 *   1. If signature_method is set, return the signature name alone.
 *   2. Otherwise concatenate: modifiers (alphabetized within each axis) →
 *      subprocess or base. Space-separated.
 *
 * The output is canonical and may differ from legacy DB strings (e.g.
 * "Yeast Anaerobic Natural" → "Anaerobic Yeast Inoculated Natural"). 1e.2
 * decides whether to rewrite the denormalized column or preserve legacy.
 */
export function composeProcess(s: StructuredProcess): string {
  if (s.signature_method) return s.signature_method

  const parts: string[] = []

  const sortedFerment = [...s.fermentation_modifiers].sort()
  const sortedDrying = [...s.drying_modifiers].sort()
  const sortedIntervention = [...s.intervention_modifiers].sort()
  const sortedExperimental = [...s.experimental_modifiers].sort()

  parts.push(...sortedFerment)
  parts.push(...sortedDrying)
  parts.push(...sortedIntervention)
  parts.push(...sortedExperimental)
  if (s.decaf_modifier) parts.push(s.decaf_modifier)

  const tail = s.subprocess ?? s.base_process
  parts.push(tail)

  return parts.join(' ')
}

// ---------------------------------------------------------------------------
// decomposeProcess — legacy string → structured
// ---------------------------------------------------------------------------

/**
 * Parses a legacy `brews.process` string into structured fields. Primary
 * strategy is the LEGACY_DECOMPOSITIONS lookup, covering all 20 distinct
 * values in the 55-brew corpus as of 2026-04-23. Fallback returns a
 * best-effort StructuredProcess with base_process matching BASE_PROCESS_LOOKUP
 * if possible, else defaulting to Washed with a signal via the caller.
 *
 * For sprint 1e.2: decomposition is run once against the 20 legacy values
 * and written to the new structured columns via batch UPDATE. After that,
 * new brews write structured columns directly; this helper is kept for any
 * future string-only input path.
 */
export function decomposeProcess(legacy: string | null | undefined): StructuredProcess {
  if (!legacy) return structured({ base_process: 'Washed' })
  const trimmed = legacy.trim()
  if (!trimmed) return structured({ base_process: 'Washed' })

  // Case-insensitive match against the legacy map.
  const matchKey = Object.keys(LEGACY_DECOMPOSITIONS).find(
    (k) => k.toLowerCase() === trimmed.toLowerCase(),
  )
  if (matchKey) return LEGACY_DECOMPOSITIONS[matchKey]

  // Fallback: try to resolve the whole string as a base/alias.
  const baseResolved = BASE_PROCESS_LOOKUP.findClosest(trimmed)
  const base = (baseResolved ?? 'Washed') as BaseProcess
  return structured({ base_process: base })
}

// ---------------------------------------------------------------------------
// Back-compat exports — preserved unchanged for the 4 current consumers
// (components/BrewsFilterBar.tsx, app/(app)/processes/page.tsx,
// app/(app)/processes/[slug]/page.tsx, app/(app)/brews/page.tsx).
// Do not remove without coordinated updates.
// ---------------------------------------------------------------------------

export const PROCESS_FAMILIES = ['Washed', 'Natural', 'Honey', 'Anaerobic', 'Experimental'] as const
export type ProcessFamily = (typeof PROCESS_FAMILIES)[number]

// Fermentation modifiers that route a brew to the Anaerobic family regardless
// of base. Matches the 5-family grouping in legacy lib/process-families.ts.
const ANAEROBIC_SIGNAL_FERMENTS = new Set<FermentationModifier>([
  'Anaerobic',
  'Double Anaerobic',
  'Triple Anaerobic',
  'Carbonic Maceration',
  'Thermal Shock',
  'Yeast Inoculated',
])

// Legacy 5-family FAMILY_MAP preserved verbatim for exact back-compat on the
// 23 known strings that the filter + /processes index already consume.
const FAMILY_MAP: Record<string, ProcessFamily> = {
  Washed: 'Washed',
  'Moonshadow Washed': 'Washed',
  'Cold Fermented Washed': 'Washed',
  Natural: 'Natural',
  'Dark Room Dry Natural': 'Natural',
  Honey: 'Honey',
  'White Honey': 'Honey',
  'Anaerobic Washed': 'Anaerobic',
  'Anaerobic Natural': 'Anaerobic',
  'Anaerobic Honey': 'Anaerobic',
  'Anoxic Natural': 'Anaerobic',
  'ASD Natural': 'Anaerobic',
  'Yeast Anaerobic Natural': 'Anaerobic',
  'Yeast Inoculated Natural': 'Anaerobic',
  'Double Anaerobic Thermal Shock': 'Anaerobic',
  'Double Fermentation Thermal Shock': 'Anaerobic',
  TyOxidator: 'Anaerobic',
  'Tamarind + Red Fruit Co-ferment Washed': 'Experimental',
  'Washed Sakura Co-ferment': 'Experimental',
  'Washed Cascara Infused': 'Experimental',
}

function familyFromStructured(s: StructuredProcess): ProcessFamily | 'Other' {
  if (s.intervention_modifiers.length > 0 || s.experimental_modifiers.length > 0) {
    return 'Experimental'
  }
  if (s.fermentation_modifiers.some((m) => ANAEROBIC_SIGNAL_FERMENTS.has(m))) {
    return 'Anaerobic'
  }
  switch (s.base_process) {
    case 'Washed':
      return 'Washed'
    case 'Natural':
      return 'Natural'
    case 'Honey':
      return 'Honey'
    case 'Wet-hulled':
      return 'Other'
  }
}

/**
 * Classifies a legacy `brews.process` string into one of 5 families + 'Other'.
 * Primary lookup is FAMILY_MAP (exact match on the 23 known legacy strings);
 * fallback decomposes and derives family from the structured form, so any
 * canonical string produced by composeProcess also classifies correctly.
 */
export function getProcessFamily(process: string | null | undefined): ProcessFamily | 'Other' {
  if (!process) return 'Other'
  const direct = FAMILY_MAP[process]
  if (direct) return direct
  return familyFromStructured(decomposeProcess(process))
}

const FAMILY_COLORS: Record<ProcessFamily | 'Other', string> = {
  Washed: '#4A7C59',
  Natural: '#8B4513',
  Honey: '#8B6914',
  Anaerobic: '#722F4B',
  Experimental: '#5B4A6B',
  Other: '#5C6570',
}

export function getFamilyColor(family: ProcessFamily | 'Other' | string): string {
  return FAMILY_COLORS[family as ProcessFamily | 'Other'] || FAMILY_COLORS.Other
}
