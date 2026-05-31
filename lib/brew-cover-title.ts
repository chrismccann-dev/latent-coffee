import type { Brew } from './types'
import { composeProcessDisplay, type StructuredProcess } from './process-registry'

/**
 * Cover-title display layer for the /brews book-cover card (NAMING session,
 * 2026-05-30). Render-only abbreviation — the canonical registries + DB rows
 * stay untouched (Chris's Q1 = render-layer). The cover shows short, clean
 * titles; the cultivar / process taxonomy pages keep their full canonical
 * names.
 *
 * Two of the messy blend names ("Bourbon / Caturra blend", "Red Bourbon /
 * Mibirizi blend") were ALSO renamed at the canonical level to the new
 * `X, Y (Blend)` convention (cultivar-registry + migration 073), so when a
 * brew shows them via `cultivar_name` they're already clean. The map below
 * still carries the old + free-text forms for robustness — matching is
 * idempotent (a string that's already clean simply passes through).
 *
 * Scope guard: this only transforms the explicit set Chris flagged after
 * reading every cover (plus a generic " (group)" disambiguator strip). Any
 * unlisted title passes through verbatim — we do NOT widen silently.
 */

// Keyed on the lowercased+trimmed rendered title. Irregular renames only;
// the regular " (group)" trim is handled generically below.
const COVER_TITLE_MAP: Record<string, string> = {
  // Ethiopian landrace family — collapse the verbose population / JARC-number
  // forms to the friendly bag-label shorthand.
  'ethiopian landrace population': 'Ethiopian Landrace',
  'ethiopian landrace': 'Ethiopian Landrace',
  'ethiopian landrace blend (74110/74112)': 'Ethiopian Landrace (Blend)',
  '74158/74110/74112 blend': 'Ethiopian Landrace (Blend)',
  'ethiopian landraces (jarc 74110, 74112)': 'Ethiopian Landrace (Blend)',
  'ethiopian landraces (74158, 74110, 74112)': 'Ethiopian Landrace (Blend)',
  // Field blends — canonical `X, Y (Blend)` shape. The first two also exist as
  // renamed canonicals; the rest are legacy free-text `variety` values.
  'bourbon, caturra (field blend)': 'Bourbon, Caturra (Blend)',
  'bourbon / caturra blend': 'Bourbon, Caturra (Blend)',
  'red bourbon / mibirizi blend': 'Red Bourbon, Mibirizi (Blend)',
  'purple caturra, bourbon': 'Purple Caturra, Bourbon (Blend)',
  // Drop geographic / sub-variety parentheticals we don't track elsewhere.
  'gesha (panama lineage)': 'Gesha',
  'laurina (bourbon pointu)': 'Laurina',
  // Gesha variants — Geisha (spelling), Green-Tip / 1931 (phenotypic + regional
  // markers, not separate cultivars per the registry) all collapse to Gesha.
  geisha: 'Gesha',
  'green-tip gesha': 'Gesha',
  'gesha 1931': 'Gesha',
  // JARC prefix is provenance, not part of the canonical selection number.
  'jarc 74158': '74158',
  // Field blend -> convention shape.
  'sidra bourbon': 'Sidra, Bourbon (Blend)',
}

/**
 * Abbreviates a cover title (variety || cultivar_name). Explicit map first,
 * then a generic trailing " (group)" strip (Catimor (group) -> Catimor,
 * Sarchimor (group) -> Sarchimor). Unknown titles pass through unchanged.
 */
export function displayVariety(raw: string | null | undefined): string {
  if (!raw) return ''
  const s = raw.trim()
  const mapped = COVER_TITLE_MAP[s.toLowerCase()]
  if (mapped) return mapped
  return s.replace(/\s*\(group\)\s*$/i, '')
}

/**
 * Composes the cover's process line from the structured columns (so the
 * "Anaerobic Anaerobic" / "Aerobic Anaerobic" dedup + `+`-join from
 * composeProcessDisplay applies on the cover, not just /processes), then
 * trims two cover-only abbreviations: Dark Room Dried -> DRD, Generic Honey
 * -> Honey. Falls back to the stored display string if the row somehow lacks
 * a base_process.
 */
export function displayCoverProcess(brew: Brew): string {
  if (!brew.base_process) return brew.process ?? ''
  const s: StructuredProcess = {
    base_process: brew.base_process,
    subprocess: brew.subprocess,
    fermentation_modifiers: brew.fermentation_modifiers ?? [],
    fermentation_qualifiers: brew.fermentation_qualifiers ?? [],
    drying_modifiers: brew.drying_modifiers ?? [],
    intervention_modifiers: brew.intervention_modifiers ?? [],
    experimental_modifiers: brew.experimental_modifiers ?? [],
    decaf_modifier: brew.decaf_modifier,
    signature_method: brew.signature_method,
  } as unknown as StructuredProcess
  return composeProcessDisplay(s)
    .replace(/Dark Room Dried/g, 'DRD')
    .replace(/Generic Honey/g, 'Honey')
}

/**
 * Producer foot trim — drop a trailing " (farm)" disambiguator
 * ("El Placer (farm)" -> "El Placer"). Leaves meaningful parentheticals
 * intact (e.g. "Mama Cata Estate (Garrido Family)").
 */
export function displayProducerShort(raw: string | null | undefined): string {
  if (!raw) return ''
  return raw.replace(/\s*\(farm\)\s*$/i, '')
}
