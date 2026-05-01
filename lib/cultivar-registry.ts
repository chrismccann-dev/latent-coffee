// Canonical cultivar registry — the single source of truth for cultivar
// names, lineages, families, species, and aliases. Consumed by:
//   - /add + /brews/[id]/edit (enforcement via CanonicalTextInput)
//   - Claude-authored sync V1 (SYNC.md) — validation + decision prompts
//   - lib/brew-import.ts (CULTIVAR_REGISTRY thin-wraps this file)
//
// Source: docs/taxonomies/varieties.md (authored content) + DB snapshot
// reconciliation + Chris's 2026-04-22 Variety research pass (72 cultivars →
// 63 canonical after alias consolidation; Gesha 7 sub-selections collapsed
// to 1 per migration 016 precedent; Rosado + Pink Bourbon kept separate;
// Aruzi = Bourbon Aruzi collapsed; Catimor Group → Catimor (group);
// Ombligon → Ombligón; Icatu moved to Multi-parent hybrid lineage).
//
// Additions require a deliberate 3-step edit: (1) docs/taxonomies/varieties.md
// per-cultivar section, (2) CULTIVARS array below, (3) migration if a DB
// row already exists under a different name. See umbrella feature doc
// docs/features/reference-taxonomies-attribution.md for the adoption workflow.

import { makeCanonicalLookup } from './canonical-registry'

// ---------------------------------------------------------------------------
// Species + Family types
// ---------------------------------------------------------------------------

export const CULTIVAR_SPECIES = ['Arabica', 'Eugenioides', 'Liberica', 'Robusta'] as const
export type CultivarSpecies = (typeof CULTIVAR_SPECIES)[number]

// 5 Arabica families + 3 non-Arabica self-referential placeholders. The
// non-Arabica entries keep the family/lineage hierarchy shape intact for
// render code that expects family + lineage to be populated.
export const GENETIC_FAMILIES = [
  'Ethiopian Landrace Families',
  'Typica Family',
  'Bourbon Family',
  'Typica × Bourbon Crosses',
  'Modern Hybrids',
  'Eugenioides',
  'Liberica',
  'Robusta',
] as const
export type GeneticFamily = (typeof GENETIC_FAMILIES)[number]

// ---------------------------------------------------------------------------
// Rich per-cultivar entries
// ---------------------------------------------------------------------------

export interface CultivarEntry {
  name: string
  species: CultivarSpecies
  family: GeneticFamily
  lineage: string
}

export const CULTIVARS: readonly CultivarEntry[] = [
  // Ethiopian Landrace Families — JARC selection lineage
  { name: '74110', species: 'Arabica', family: 'Ethiopian Landrace Families', lineage: 'JARC selection lineage' },
  { name: '74112', species: 'Arabica', family: 'Ethiopian Landrace Families', lineage: 'JARC selection lineage' },
  { name: '74148', species: 'Arabica', family: 'Ethiopian Landrace Families', lineage: 'JARC selection lineage' },
  { name: '74158', species: 'Arabica', family: 'Ethiopian Landrace Families', lineage: 'JARC selection lineage' },
  { name: '74165', species: 'Arabica', family: 'Ethiopian Landrace Families', lineage: 'JARC selection lineage' },

  // Ethiopian Landrace Families — JARC blend lineage
  { name: '74158/74110/74112 blend', species: 'Arabica', family: 'Ethiopian Landrace Families', lineage: 'JARC blend lineage' },
  { name: 'Ethiopian Landrace Blend (74110/74112)', species: 'Arabica', family: 'Ethiopian Landrace Families', lineage: 'JARC blend lineage' },

  // Ethiopian Landrace Families — Gesha lineage (collapsed to one canonical per migration 016)
  { name: 'Gesha', species: 'Arabica', family: 'Ethiopian Landrace Families', lineage: 'Gesha lineage' },

  // Ethiopian Landrace Families — non-JARC landrace-derived selections
  { name: 'Chiroso', species: 'Arabica', family: 'Ethiopian Landrace Families', lineage: 'Ethiopian landrace-derived selection (non-JARC)' },
  { name: 'Dega', species: 'Arabica', family: 'Ethiopian Landrace Families', lineage: 'Ethiopian landrace-derived selection (non-JARC)' },
  { name: 'Ethiopian landrace population', species: 'Arabica', family: 'Ethiopian Landrace Families', lineage: 'Ethiopian landrace-derived selection (non-JARC)' },
  { name: 'Java', species: 'Arabica', family: 'Ethiopian Landrace Families', lineage: 'Ethiopian landrace-derived selection (non-JARC)' },
  { name: 'Kurume', species: 'Arabica', family: 'Ethiopian Landrace Families', lineage: 'Ethiopian landrace-derived selection (non-JARC)' },
  { name: 'Ombligón', species: 'Arabica', family: 'Ethiopian Landrace Families', lineage: 'Ethiopian landrace-derived selection (non-JARC)' },
  { name: 'Papayo', species: 'Arabica', family: 'Ethiopian Landrace Families', lineage: 'Ethiopian landrace-derived selection (non-JARC)' },
  { name: 'Pink Bourbon', species: 'Arabica', family: 'Ethiopian Landrace Families', lineage: 'Ethiopian landrace-derived selection (non-JARC)' },
  { name: 'Rosado', species: 'Arabica', family: 'Ethiopian Landrace Families', lineage: 'Ethiopian landrace-derived selection (non-JARC)' },
  { name: 'SL9', species: 'Arabica', family: 'Ethiopian Landrace Families', lineage: 'Ethiopian landrace-derived selection (non-JARC)' },
  { name: 'Sudan Rume', species: 'Arabica', family: 'Ethiopian Landrace Families', lineage: 'Ethiopian landrace-derived selection (non-JARC)' },
  { name: 'Wolisho', species: 'Arabica', family: 'Ethiopian Landrace Families', lineage: 'Ethiopian landrace-derived selection (non-JARC)' },
  { name: 'Wush Wush', species: 'Arabica', family: 'Ethiopian Landrace Families', lineage: 'Ethiopian landrace-derived selection (non-JARC)' },
  { name: 'Yemenia', species: 'Arabica', family: 'Ethiopian Landrace Families', lineage: 'Ethiopian landrace-derived selection (non-JARC)' },

  // Ethiopian Landrace Families — SL Bourbon lineage
  { name: 'SL28', species: 'Arabica', family: 'Ethiopian Landrace Families', lineage: 'SL Bourbon lineage' },
  { name: 'SL34', species: 'Arabica', family: 'Ethiopian Landrace Families', lineage: 'SL Bourbon lineage' },

  // Typica Family
  { name: 'Maragogype', species: 'Arabica', family: 'Typica Family', lineage: 'Typica lineage' },
  { name: 'Pache', species: 'Arabica', family: 'Typica Family', lineage: 'Typica lineage' },

  // Bourbon Family — Bourbon (classic)
  { name: 'Aruzi', species: 'Arabica', family: 'Bourbon Family', lineage: 'Bourbon (classic)' },
  { name: 'Bourbon', species: 'Arabica', family: 'Bourbon Family', lineage: 'Bourbon (classic)' },
  { name: 'Mokka', species: 'Arabica', family: 'Bourbon Family', lineage: 'Bourbon (classic)' },
  { name: 'Red Bourbon', species: 'Arabica', family: 'Bourbon Family', lineage: 'Bourbon (classic)' },
  { name: 'Red Bourbon / Mibirizi blend', species: 'Arabica', family: 'Bourbon Family', lineage: 'Bourbon (classic)' },

  // Bourbon Family — Bourbon mutation lineage
  { name: 'Bourbon / Caturra blend', species: 'Arabica', family: 'Bourbon Family', lineage: 'Bourbon mutation lineage' },
  { name: 'Bourbon Aji', species: 'Arabica', family: 'Bourbon Family', lineage: 'Bourbon mutation lineage' },
  { name: 'Caturra', species: 'Arabica', family: 'Bourbon Family', lineage: 'Bourbon mutation lineage' },
  { name: 'Laurina', species: 'Arabica', family: 'Bourbon Family', lineage: 'Bourbon mutation lineage' },
  { name: 'Pacas', species: 'Arabica', family: 'Bourbon Family', lineage: 'Bourbon mutation lineage' },
  { name: 'Purple Caturra', species: 'Arabica', family: 'Bourbon Family', lineage: 'Bourbon mutation lineage' },
  { name: 'Villa Sarchi', species: 'Arabica', family: 'Bourbon Family', lineage: 'Bourbon mutation lineage' },

  // Typica × Bourbon Crosses
  { name: 'Maracaturra', species: 'Arabica', family: 'Typica × Bourbon Crosses', lineage: 'Maragogype × Caturra lineage' },
  { name: 'Maragesha', species: 'Arabica', family: 'Typica × Bourbon Crosses', lineage: 'Maragogype × Gesha lineage' },
  { name: 'Catuaí', species: 'Arabica', family: 'Typica × Bourbon Crosses', lineage: 'Mundo Novo × Caturra lineage' },
  { name: 'Pacamara', species: 'Arabica', family: 'Typica × Bourbon Crosses', lineage: 'Pacas × Maragogype lineage' },
  { name: 'Catucaí', species: 'Arabica', family: 'Typica × Bourbon Crosses', lineage: 'Typica × Bourbon cross lineage' },
  { name: 'Mejorado', species: 'Arabica', family: 'Typica × Bourbon Crosses', lineage: 'Typica × Bourbon cross lineage' },
  { name: 'Mundo Novo', species: 'Arabica', family: 'Typica × Bourbon Crosses', lineage: 'Typica × Bourbon cross lineage' },
  { name: 'Sidra', species: 'Arabica', family: 'Typica × Bourbon Crosses', lineage: 'Typica × Bourbon cross lineage' },

  // Modern Hybrids
  { name: 'Castillo', species: 'Arabica', family: 'Modern Hybrids', lineage: 'Caturra × Timor Hybrid lineage' },
  { name: 'Batian', species: 'Arabica', family: 'Modern Hybrids', lineage: 'Multi-parent hybrid lineage' },
  { name: 'Icatu', species: 'Arabica', family: 'Modern Hybrids', lineage: 'Multi-parent hybrid lineage' },
  { name: 'Mandela', species: 'Arabica', family: 'Modern Hybrids', lineage: 'Multi-parent hybrid lineage' },
  { name: 'Mokkita', species: 'Arabica', family: 'Modern Hybrids', lineage: 'Multi-parent hybrid lineage' },
  { name: 'Ruiru 11', species: 'Arabica', family: 'Modern Hybrids', lineage: 'Multi-parent hybrid lineage' },
  { name: 'Ateng', species: 'Arabica', family: 'Modern Hybrids', lineage: 'Timor Hybrid-derived lineage' },
  { name: 'Catimor (group)', species: 'Arabica', family: 'Modern Hybrids', lineage: 'Timor Hybrid-derived lineage' },
  { name: 'Garnica', species: 'Arabica', family: 'Modern Hybrids', lineage: 'Timor Hybrid-derived lineage' },
  { name: 'Marsellesa', species: 'Arabica', family: 'Modern Hybrids', lineage: 'Timor Hybrid-derived lineage' },
  { name: 'Sarchimor (group)', species: 'Arabica', family: 'Modern Hybrids', lineage: 'Timor Hybrid-derived lineage' },
  { name: 'Sigarar Utang', species: 'Arabica', family: 'Modern Hybrids', lineage: 'Timor Hybrid-derived lineage' },
  { name: 'Tabi', species: 'Arabica', family: 'Modern Hybrids', lineage: 'Timor Hybrid-derived lineage' },

  // Non-Arabica species — self-referential scaffolding preserves hierarchy shape
  { name: 'Eugenioides', species: 'Eugenioides', family: 'Eugenioides', lineage: 'Eugenioides lineage' },
  { name: 'Liberica', species: 'Liberica', family: 'Liberica', lineage: 'Liberica lineage' },
  { name: 'Excelsa', species: 'Liberica', family: 'Liberica', lineage: 'Excelsa lineage' },
  { name: 'Robusta', species: 'Robusta', family: 'Robusta', lineage: 'Robusta lineage' },
]

// ---------------------------------------------------------------------------
// Derived canonical lists (legacy-compatible exports preserved for call sites
// that imported from this file pre-refactor)
// ---------------------------------------------------------------------------

export const CULTIVAR_NAMES = CULTIVARS.map((c) => c.name) as readonly string[]

export const CULTIVAR_LINEAGES = Array.from(
  new Set(CULTIVARS.map((c) => c.lineage)),
).sort() as readonly string[]

// ---------------------------------------------------------------------------
// Alias map — structural mappings to canonical names. Additions are as
// deliberate as adding a canonical name. Each alias is a documented drift
// pattern (trade-name spelling, common misnomer, sub-selection phenotype,
// color variant). Aliases do NOT make isCanonical return true — findClosest
// surfaces the suggestion so the sync can canonicalize on write.
//
// Source: Chris's aliases-and-misspellings doc (2026-04-22) + CSV research.
// ---------------------------------------------------------------------------

export const CULTIVAR_ALIASES: Readonly<Record<string, string>> = {
  // Gesha — collapsed sub-selections + common misspellings per B1-c
  Geisha: 'Gesha',
  'Panama Geisha': 'Gesha',
  'Panamanian Geisha': 'Gesha',
  'Ethiopian Gesha': 'Gesha',
  Gesia: 'Gesha',
  Guesha: 'Gesha',
  'Gesha (Brazilian Selection)': 'Gesha',
  'Gesha (Brazilian selection)': 'Gesha',
  'Gesha (Colombian Selection)': 'Gesha',
  'Gesha (Colombian selection)': 'Gesha',
  'Gesha (Panamanian Selection)': 'Gesha',
  'Gesha (Panamanian selection)': 'Gesha',
  'Gesha (green-tip selection)': 'Gesha',
  'Gesha (peaberry selection)': 'Gesha',
  'Gesha (Queen selection)': 'Gesha',
  'Gesha 1931': 'Gesha',
  'Green tip Gesha': 'Gesha',
  'Green Tip Gesha': 'Gesha',
  'Green-Tip Gesha': 'Gesha',
  'Bronze Tip Gesha': 'Gesha',
  'Bronze-Tip Gesha': 'Gesha',
  'Gesha Queen': 'Gesha',
  'Gesha peaberry': 'Gesha',

  // Aruzi — consolidated from Bourbon Aruzi per B5
  'Bourbon Aruzi': 'Aruzi',

  // Mejorado — keep DB canonical per B8
  'Typica Mejorado': 'Mejorado',

  // Sidra — spellings
  'Bourbon Sidra': 'Sidra',
  'Sidra Bourbon': 'Sidra',
  Sydra: 'Sidra',

  // Pink Bourbon + Rosado kept separate per Chris's modified rule; only
  // Bourbon Rosado aliases to Pink Bourbon (Rosado stays its own canonical)
  'Bourbon Rosado': 'Pink Bourbon',

  // Ethiopian landrace population — catch-all for unidentified Ethiopian lots
  Heirloom: 'Ethiopian landrace population',
  'Ethiopian Heirloom': 'Ethiopian landrace population',
  'Local Landrace': 'Ethiopian landrace population',
  'Indigenous varieties': 'Ethiopian landrace population',

  // Wush Wush
  Wushwush: 'Wush Wush',

  // Bourbon color variants per Chris's call (#3) — keep Red Bourbon canonical,
  // Yellow/Orange collapse to base Bourbon (classic)
  'Yellow Bourbon': 'Bourbon',
  'Orange Bourbon': 'Bourbon',

  // Caturra color variants per aliases doc — Purple Caturra stays canonical
  'Red Caturra': 'Caturra',
  'Yellow Caturra': 'Caturra',

  // Catuaí color variants + diacritic fixes
  'Yellow Catuaí': 'Catuaí',
  'Red Catuaí': 'Catuaí',
  Catuai: 'Catuaí',

  // Catucaí diacritic
  Catucai: 'Catucaí',

  // Ombligón — accent canonical per B10
  Ombligon: 'Ombligón',
  Ombligone: 'Ombligón',

  // Mokka family — market confusion
  Moka: 'Mokka',
  Mokha: 'Mokka',
  Mocha: 'Mokka',

  // Chiroso — legacy misnomer
  'Caturra Chiroso': 'Chiroso',

  // Java — misidentification with Typica
  'Typica Java': 'Java',

  // SL9 — labeling variants
  SL09: 'SL9',
  'Gesha Inca': 'SL9',

  // Sudan Rume word order
  'Rume Sudan': 'Sudan Rume',
  // Accented forms — claude.ai / ChatGPT default rendering of the variety
  // name carries Spanish-style accents. MCP feedback batch 2 (2026-05-01)
  // surfaced this when push_brew silently created a non-canonical
  // "Sudán Rumé" row with NULL lineage instead of aliasing to canonical.
  'Sudán Rumé': 'Sudan Rume',
  'Sudan Rumé': 'Sudan Rume',
  'Sudán Rume': 'Sudan Rume',

  // Maragogype spelling
  Maragogipe: 'Maragogype',

  // Group labels
  'Catimor Group': 'Catimor (group)',
  Catimor: 'Catimor (group)',
  Sarchimor: 'Sarchimor (group)',
  'Villa Sarchi Hybrid': 'Sarchimor (group)',

  // Marsellesa spelling
  Marshell: 'Marsellesa',

  // Legacy combined form — pre-Variety-sprint, 74110/74112 mixed lots were
  // canonicalized as "74110/74112". Now split: 74110 and 74112 are separate
  // canonicals for pure-lot cases; mixed lots use the blend form.
  '74110/74112': 'Ethiopian Landrace Blend (74110/74112)',
}

// ---------------------------------------------------------------------------
// Lookup bundles (canonical-registry factory — 3-tier classifier)
// ---------------------------------------------------------------------------

export const CULTIVAR_LOOKUP = makeCanonicalLookup(CULTIVAR_NAMES, CULTIVAR_ALIASES)
export const isCanonicalCultivar = CULTIVAR_LOOKUP.isCanonical
export const findClosestCultivar = CULTIVAR_LOOKUP.findClosest

export const CULTIVAR_LINEAGE_LOOKUP = makeCanonicalLookup(CULTIVAR_LINEAGES)
export const isCanonicalLineage = CULTIVAR_LINEAGE_LOOKUP.isCanonical
export const findClosestLineage = CULTIVAR_LINEAGE_LOOKUP.findClosest

// ---------------------------------------------------------------------------
// Rich-shape lookup helpers
// ---------------------------------------------------------------------------

const byLowerName = new Map(CULTIVARS.map((c) => [c.name.toLowerCase(), c]))

/**
 * Returns the full CultivarEntry for a canonical name (case-insensitive).
 * Returns null for aliases — callers should resolve the alias via
 * findClosestCultivar first, then look up the canonical.
 */
export function getCultivarEntry(name: string | null | undefined): CultivarEntry | null {
  if (!name) return null
  return byLowerName.get(name.trim().toLowerCase()) ?? null
}

/**
 * Resolves an input name to a CultivarEntry, consulting the alias map on
 * miss. Returns null if no canonical match (not even via substring/prefix).
 */
export function resolveCultivar(name: string | null | undefined): CultivarEntry | null {
  if (!name) return null
  const direct = getCultivarEntry(name)
  if (direct) return direct
  const closest = findClosestCultivar(name)
  return closest ? getCultivarEntry(closest) : null
}
