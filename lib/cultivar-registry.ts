// Canonical registries for the archive-format Cultivar field (see BREWING.md
// § Step 4): a single canonical variety name, with lineage available as a
// secondary validation hook for future analytics. Both are flat
// CanonicalLookup bundles — sibling varieties must be distinguished precisely
// (Mokka ≠ Mokkita, Gesha ≠ Sidra, Pink Bourbon ≠ Rosado), so no
// composite/hierarchical structure is warranted.
//
// Source: `SELECT DISTINCT cultivar_name|lineage FROM cultivars` (2026-04-21
// — 26 canonical cultivar names / 13 lineages). Additions require a
// deliberate decision, not drift.
//
// Alias map: "Geisha" is the common trade-name spelling; "Gesha" is the
// botanical canonical. The archive format asks for Gesha, but Chris and
// roasters routinely write Geisha — the alias makes the sync suggest the
// canonical form instead of returning null or a wrong prefix-match.

import { makeCanonicalLookup } from './canonical-registry'

export const CULTIVAR_NAMES = [
  '74110/74112',
  '74158',
  '74158/74110/74112 blend',
  'Bourbon / Caturra blend',
  'Bourbon Aruzi',
  'Castillo',
  'Catimor Group',
  'Catuaí',
  'Caturra',
  'Ethiopian landrace population',
  'Garnica',
  'Gesha',
  'Java',
  'Laurina',
  'Maracaturra',
  'Marsellesa',
  'Mejorado',
  'Mokkita',
  'Pacamara',
  'Pink Bourbon',
  'Purple Caturra',
  'Red Bourbon',
  'Red Bourbon / Mibirizi blend',
  'Rosado',
  'Sidra',
  'Sudan Rume',
] as const

// Known trade-name / spelling aliases that resolve to canonical. Additions
// here are as deliberate as adding a canonical name — each alias is a
// documented drift pattern, not a typo catch-all.
export const CULTIVAR_ALIASES: Readonly<Record<string, string>> = {
  Geisha: 'Gesha',
}

export const CULTIVAR_LINEAGES = [
  'Bourbon (classic)',
  'Bourbon mutation lineage',
  'Caturra × Timor Hybrid lineage',
  'Ethiopian landrace-derived selection (non-JARC)',
  'Gesha lineage',
  'JARC blend lineage',
  'JARC selection lineage',
  'Maragogype × Caturra lineage',
  'Multi-parent hybrid lineage',
  'Mundo Novo × Caturra lineage',
  'Pacas × Maragogype lineage',
  'Timor Hybrid-derived lineage',
  'Typica × Bourbon cross lineage',
] as const

export const CULTIVAR_LOOKUP = makeCanonicalLookup(CULTIVAR_NAMES, CULTIVAR_ALIASES)
export const isCanonicalCultivar = CULTIVAR_LOOKUP.isCanonical
export const findClosestCultivar = CULTIVAR_LOOKUP.findClosest

export const CULTIVAR_LINEAGE_LOOKUP = makeCanonicalLookup(CULTIVAR_LINEAGES)
export const isCanonicalLineage = CULTIVAR_LINEAGE_LOOKUP.isCanonical
export const findClosestLineage = CULTIVAR_LINEAGE_LOOKUP.findClosest
