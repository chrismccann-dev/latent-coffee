// Shared validation + persistence for the purchased-coffee import flow.
// Used by both the UI (via /api/brews/import) and programmatic callers.

import type { SupabaseClient } from '@supabase/supabase-js'
import type { InsertBrew } from './types'
import {
  GENETIC_FAMILIES as CANONICAL_GENETIC_FAMILIES,
  type GeneticFamily as CanonicalGeneticFamily,
  CULTIVARS,
  resolveCultivar,
} from './cultivar-registry'
import {
  TERROIRS,
  type TerroirEntry,
  getTerroirEntry,
  canonicalizeMacroInCountry,
  macrosForAdminRegion,
} from './terroir-registry'
import {
  BASE_PROCESSES,
  type BaseProcess,
  HONEY_SUBPROCESSES,
  type HoneySubprocess,
  FERMENTATION_LOOKUP,
  type FermentationModifier,
  FERMENTATION_QUALIFIER_LOOKUP,
  DRYING_LOOKUP,
  type DryingModifier,
  INTERVENTION_LOOKUP,
  type InterventionModifier,
  EXPERIMENTAL_LOOKUP,
  type ExperimentalModifier,
  DECAF_MODIFIERS,
  type DecafModifier,
  SIGNATURE_LOOKUP,
  composeProcess,
  decomposeProcess,
  structuredProcessColumns,
  type StructuredProcess,
} from './process-registry'
import { ROASTER_LOOKUP } from './roaster-registry'
import {
  cleanFlavors,
  cleanStructureTags,
  composeFlavorNotes,
} from './flavor-registry'
import { cleanModifiers, type Modifier } from './extraction-modifiers'
import { cleanPours, type PourStep } from './pour-structure'
import { HYBRID_SUBFORMS, isCanonicalHybridSubform } from './hybrid-subform'
import { ROAST_LEVEL_LOOKUP } from './roast-level-registry'
import { GRINDER_LOOKUP, isResolvableSetting } from './grinder-registry'
import { PRODUCER_LOOKUP } from './producer-registry'
import { BREWER_LOOKUP } from './brewer-registry'
import { FILTER_LOOKUP } from './filter-registry'
import type { CanonicalLookup } from './canonical-registry'
import {
  fireQueueInserts,
  type QueuedEntry,
} from './taxonomy-queue'

// ---------------------------------------------------------------------------
// Canonical registries
// ---------------------------------------------------------------------------

// Sprint Extraction Strategy v2 (2026-04-27): 3 → 5 strategies. Two new
// entries are added at the ends of the intensity gradient. `Suppression` sits
// below Clarity-First — same coarse-low-temp-low-agitation mechanics, but
// applied with the *opposite* intent (hold an over-expressive coffee back
// rather than protect a delicate one). `Extraction Push` sits above Full
// Expression mechanically (fine + high temp) but with low agitation
// (Melodrip) — push yield on a *clean* coffee while preserving transparency,
// not force-develop a co-ferment. Mechanics-vs-intent symmetry: Suppression
// got promoted because intent matters at strategy-selection time; same logic
// promoted Extraction Push.
//
// v8.4 (2026-05-06): `Hybrid` promoted to a 6th first-class strategy. Five
// describe extraction intensity (single-mode logic running throughout); Hybrid
// describes extraction structure (phase boundaries where the brewer changes
// mode, immersion <-> percolation). Selection rule: if the brew has phase
// boundaries with distinct sensory targets per phase, it's Hybrid. The
// Immersion modifier from v8.3 was absorbed - what was "Balanced + Immersion"
// is now "Hybrid (Sequential)" with the intensity range as a recipe parameter.
// See lib/hybrid-subform.ts for the 5 canonical sub-forms.
export const EXTRACTION_STRATEGIES = [
  'Suppression',
  'Clarity-First',
  'Balanced Intensity',
  'Full Expression',
  'Extraction Push',
  'Hybrid',
] as const
export type ExtractionStrategy = (typeof EXTRACTION_STRATEGIES)[number]

// Genetic families + cultivar registry now source from lib/cultivar-registry.ts
// (single source of truth after the Variety sprint — 2026-04-22). This file
// re-exports them in the shape existing call sites expect, and derives
// CULTIVAR_REGISTRY from the canonical CULTIVARS array.

export const GENETIC_FAMILIES = CANONICAL_GENETIC_FAMILIES
export type GeneticFamily = CanonicalGeneticFamily

// Terroir registry sourced from lib/terroir-registry.ts (single source of truth
// after the Region sprint - 2026-04-22). 127 country-scoped entries across
// 121 distinct macros / 38 countries. This re-export preserves the
// TERROIR_REGISTRY / TerroirRegistryEntry names consumed by /add + /api/brews/parse
// for back-compat; new code should import directly from './terroir-registry'.
export type TerroirRegistryEntry = TerroirEntry
export const TERROIR_REGISTRY = TERROIRS

export interface CultivarRegistryEntry {
  cultivar_name: string
  genetic_family: GeneticFamily
  lineage: string
  species: string
}

export const CULTIVAR_REGISTRY: CultivarRegistryEntry[] = CULTIVARS.map((c) => ({
  cultivar_name: c.name,
  genetic_family: c.family,
  lineage: c.lineage,
  species: c.species,
}))

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Sprint 3.2 (item #1) — admin_region drift-tolerant matcher. The pre-3.2
// behavior used strict-lowercase equality, which silently false-missed when
// claude.ai wrote a drift-shaped region ("Tolima Department" vs registry
// "Tolima") or a single-dept caller against a multi-dept canonical
// ("Antioquia" vs "Antioquia / Caldas / Quindío / Tolima"). Tokenization +
// subset comparison fixes both: either side a token-subset of the other =
// match. Strips slashes / commas / hyphens so multi-dept registry shapes
// tokenize cleanly. Locale-aware lowercase preserves diacritics.
function adminRegionTokens(s: string | null | undefined): Set<string> {
  if (!s) return new Set()
  return new Set(
    s
      .toLowerCase()
      .replace(/[\/,;\-–—]+/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 0),
  )
}

export function adminRegionMatches(
  a: string | null | undefined,
  b: string | null | undefined,
): boolean {
  const ta = adminRegionTokens(a)
  const tb = adminRegionTokens(b)
  if (ta.size === 0 || tb.size === 0) return ta.size === 0 && tb.size === 0
  const [small, large] = ta.size <= tb.size ? [ta, tb] : [tb, ta]
  const tokens = Array.from(small)
  for (let i = 0; i < tokens.length; i++) if (!large.has(tokens[i])) return false
  return true
}

// ---------------------------------------------------------------------------
// Payload shape (subset of InsertBrew, plus the classification candidates)
// ---------------------------------------------------------------------------

export interface TerroirCandidate {
  country: string
  admin_region?: string | null
  macro_terroir?: string | null
  meso_terroir?: string | null
  elevation_min?: number | null
  elevation_max?: number | null
  climate_stress?: string | null
}

export interface CultivarCandidate {
  cultivar_name: string
  species?: string | null
  genetic_family?: GeneticFamily | string | null
  lineage?: string | null
}

export interface BrewPayload {
  // Coffee details
  coffee_name: string
  // Sprint 2.5: widen to accept self-roasted brews via push_brew. SR brews
  // require green_bean_id; persistBrew enforces this in validation.
  source?: 'purchased' | 'self-roasted'
  green_bean_id?: string | null
  roast_id?: string | null
  roaster?: string | null
  // Transient: opt-out of strict roaster canonical enforcement for this brew.
  // When true, a non-resolvable roaster string persists verbatim (escape hatch
  // for legitimately new roasters before they land in lib/roaster-registry.ts).
  roaster_override?: boolean
  producer?: string | null
  // Transient: opt-out of strict producer canonical enforcement for this brew.
  // Same shape as `roaster_override` / `grinder_override` — accepts a verbatim
  // string when the producer isn't yet in lib/producer-registry.ts. Net-new
  // producers appear more often than net-new cultivars, so adopting the
  // override path was a deliberate choice (sprint 1l plan-mode round 1).
  producer_override?: boolean
  variety?: string | null
  process?: string | null
  roast_level?: string | null
  flavor_notes?: string[] | null
  // Sprint 1g 3-axis flavor taxonomy. `flavors` is the structured form
  // (array of {base, modifiers}); `flavor_notes` is the denormalized display
  // recomposed via composeFlavorNotes() at insert. `structure_tags` stores
  // per-coffee structure descriptors as "Axis:Descriptor" keys.
  flavors?: { base: string; modifiers: string[] }[] | null
  structure_tags?: string[] | null

  // Classification (required)
  terroir: TerroirCandidate
  cultivar: CultivarCandidate

  // Recipe
  brewer?: string | null
  // Net-new brewers (new Orea bases, new Sibarist systems) appear in the
  // wild more often than net-new cultivars; opt-out persists a verbatim
  // string when the brewer isn't yet in lib/brewer-registry.ts.
  brewer_override?: boolean
  filter?: string | null
  // Same opt-out for filter — Sibarist FAST variants and Cafec roast-pack
  // SKUs churn frequently.
  filter_override?: boolean
  dose_g?: number | null
  water_g?: number | null
  ratio?: string | null
  // `grind` is the legacy denormalized display string ("EG-1 6.5"). Callers
  // can supply structured `grinder` + `grind_setting` instead; persistBrew
  // recomposes the legacy column from them.
  grind?: string | null
  grinder?: string | null
  // Transient: opt-out of strict grinder canonical enforcement for this brew.
  // Same shape as `roaster_override` — accepts the verbatim string when the
  // grinder isn't yet in the registry.
  grinder_override?: boolean
  grind_setting?: string | null
  temp_c?: number | null
  // Free-text water formula / source (Sub-sprint 4c Bundle A, migration 071).
  water_recipe?: string | null
  bloom?: string | null
  pour_structure?: string | null
  // data-model session (migration 074, 2026-05-30): structured pour steps.
  // Canonical forward shape; legacy bloom + pour_structure stay as fallback.
  pours?: PourStep[] | null
  total_time?: string | null

  // Extraction strategy + modifiers (Axis 2, sprint Extraction Strategy v2;
  // Hybrid promoted in v8.4 2026-05-06). `modifiers` is a jsonb array of
  // {type, ...subfields} entries. Optional, stackable (3 types post-v8.4 —
  // Immersion was absorbed into the Hybrid strategy). See
  // lib/extraction-modifiers.ts and lib/hybrid-subform.ts.
  extraction_strategy?: ExtractionStrategy | string | null
  // v8.4: required when extraction_strategy = 'Hybrid', NULL otherwise.
  // Canonical: see HYBRID_SUBFORMS in lib/hybrid-subform.ts.
  hybrid_subform?: string | null
  extraction_confirmed?: string | null
  // Free-text within-strategy gradient + recipe nuance ("Balanced Intensity
  // (lower edge)" etc.) that doesn't fit the canonical 6-value enum.
  // Distinct from extraction_confirmed (cross-strategy divergence) and
  // classification (lot-code stash).
  strategy_notes?: string | null
  modifiers?: Modifier[] | null
  // v8.4 named consideration. Free-text. Default null = normal cooling
  // progression. Populated when peak evaluation window IS the strategy
  // (e.g. "40-45°C peak", "evaluate below 50°C").
  cooling_curve_target?: string | null

  // Sensory
  aroma?: string | null
  attack?: string | null
  mid_palate?: string | null
  body?: string | null
  finish?: string | null
  temperature_evolution?: string | null
  peak_expression?: string | null

  // Learnings
  key_takeaways?: string[] | null
  classification?: string | null
  terroir_connection?: string | null
  cultivar_connection?: string | null
  what_i_learned?: string | null

  // Process flags
  is_process_dominant?: boolean
  process_category?: string | null
  process_details?: string | null

  // Structured process columns. `process` is the denormalized composed
  // string; callers that only supply legacy `process` have it decomposed
  // at save time via seedStructuredProcess.
  base_process?: BaseProcess | null
  subprocess?: HoneySubprocess | null
  fermentation_modifiers?: string[] | null
  fermentation_qualifiers?: string[] | null
  drying_modifiers?: string[] | null
  intervention_modifiers?: string[] | null
  experimental_modifiers?: string[] | null
  decaf_modifier?: DecafModifier | null
  signature_method?: string | null
  // Sprint 12 / MCP-1 (2026-05-21, migration 063): opt-out of strict
  // signature_method canonical enforcement. Mirrors producer_override —
  // accepts a verbatim string when the signature isn't yet in the 15-entry
  // canonical registry, queues a taxonomy_overrides_queue row for arbiter
  // review. Net-new proprietary processes (Alchemy, TIM, Enzyflow, etc.)
  // emerge from producers regularly; the override is the escape hatch
  // before the registry lands the new canonical.
  signature_method_override?: boolean
}

// Grinder helpers. Same shape pattern as the process helpers: a structured
// pair (`grinder`, `grind_setting`) is the source of truth; the legacy
// `brews.grind` text column is the denormalized display recomposed at save.

export interface StructuredGrind {
  grinder: string | null
  grind_setting: string | null
}

export function composeGrind(s: StructuredGrind): string | null {
  if (!s.grinder) return null
  return s.grind_setting ? `${s.grinder} ${s.grind_setting}` : s.grinder
}

// Shared validate-and-normalize for the 5 text-only canonical fields
// (`brews.roaster` / `producer` / `grinder` / `brewer` / `filter`). None of
// these have a FK to a separate table — the rich entry lives in
// lib/<axis>-registry.ts and the brews row stores the canonical name as
// text. `allowOverride` passes a non-resolvable string through verbatim
// for legitimately new entries before they land in the registry.
//
// `needsQueue` is set to true when allowOverride is taken AND the value
// didn't resolve canonically. Phase 3 — persistBrew/persistGreenBean read
// this flag post-insert to fire taxonomy_overrides_queue rows.
export type CanonicalTextResult =
  | { ok: true; canonicalName: string | null; resolved: boolean; needsQueue: boolean }
  | { ok: false; error: string; status: 400 }

function validateCanonicalText(
  raw: string | null | undefined,
  lookup: CanonicalLookup,
  label: string,
  opts: { allowOverride?: boolean } = {},
): CanonicalTextResult {
  const trimmed = typeof raw === 'string' ? raw.trim() : ''
  if (!trimmed) return { ok: true, canonicalName: null, resolved: false, needsQueue: false }
  const canonical = lookup.canonicalize(trimmed)
  if (canonical) return { ok: true, canonicalName: canonical, resolved: true, needsQueue: false }
  if (opts.allowOverride) {
    return { ok: true, canonicalName: trimmed, resolved: false, needsQueue: true }
  }
  return {
    ok: false,
    status: 400,
    error: `${label} "${trimmed}" is not in the canonical registry. To add a new ${label}, use /add with override.`,
  }
}

export type FindOrCreateGrinderResult = CanonicalTextResult

export function findOrCreateGrinder(
  rawName: string | null | undefined,
  opts: { allowOverride?: boolean } = {},
): FindOrCreateGrinderResult {
  return validateCanonicalText(rawName, GRINDER_LOOKUP, 'grinder', opts)
}

// Sprint 12 / MCP-1 (2026-05-21): signature_method joins the override-eligible
// canonical-text pattern. Mirrors findOrCreateRoaster / Producer / etc. exactly.
// SIGNATURE_LOOKUP is the 15-canonical registry from lib/process-registry.ts
// (post Sprint T1 / BR-1 expansion from 3 to 15 entries).
export type FindOrCreateSignatureMethodResult = CanonicalTextResult

export function findOrCreateSignatureMethod(
  rawName: string | null | undefined,
  opts: { allowOverride?: boolean } = {},
): FindOrCreateSignatureMethodResult {
  return validateCanonicalText(rawName, SIGNATURE_LOOKUP, 'signature_method', opts)
}

export function seedStructuredProcess(payload: Partial<BrewPayload>): StructuredProcess {
  if (payload.base_process) {
    return {
      base_process: payload.base_process,
      subprocess: payload.subprocess ?? null,
      fermentation_modifiers: (payload.fermentation_modifiers ?? []) as StructuredProcess['fermentation_modifiers'],
      fermentation_qualifiers: (payload.fermentation_qualifiers ?? []) as StructuredProcess['fermentation_qualifiers'],
      drying_modifiers: (payload.drying_modifiers ?? []) as StructuredProcess['drying_modifiers'],
      intervention_modifiers: (payload.intervention_modifiers ?? []) as StructuredProcess['intervention_modifiers'],
      experimental_modifiers: (payload.experimental_modifiers ?? []) as StructuredProcess['experimental_modifiers'],
      decaf_modifier: payload.decaf_modifier ?? null,
      signature_method: payload.signature_method ?? null,
    }
  }
  return decomposeProcess(payload.process)
}

// ---------------------------------------------------------------------------
// Registry lookups (pure — no DB)
// ---------------------------------------------------------------------------

export function terroirInRegistry(country: string, macro_terroir: string | null | undefined): boolean {
  if (!macro_terroir) return false
  return TERROIR_REGISTRY.some(
    (t) => t.country.toLowerCase() === country.toLowerCase() && t.macro_terroir.toLowerCase() === macro_terroir.toLowerCase()
  )
}

export function cultivarInRegistry(cultivar_name: string | null | undefined): boolean {
  if (!cultivar_name) return false
  return CULTIVAR_REGISTRY.some((c) => c.cultivar_name.toLowerCase() === cultivar_name.toLowerCase())
}

// ---------------------------------------------------------------------------
// DB match (uses supabase, scoped by user_id via RLS)
// ---------------------------------------------------------------------------

export type TerroirMatch =
  | { isNew: false; id: string; inRegistry: boolean; terroir: TerroirCandidate }
  | { isNew: true; inRegistry: boolean; terroir: TerroirCandidate }

export async function matchTerroir(
  supabase: SupabaseClient,
  userId: string,
  terroir: TerroirCandidate
): Promise<TerroirMatch> {
  const inRegistry = terroirInRegistry(terroir.country, terroir.macro_terroir || null)

  if (!terroir.country || !terroir.macro_terroir) {
    return { isNew: true, inRegistry, terroir }
  }

  // Sprint 2.6 — meso is part of the match key. The pre-2.6 behavior matched
  // on (country, macro) only, which silently collapsed beans with different
  // localities onto the first matching row (the R12 Las Margaritas → Trujillo
  // highlands silent-collapse failure mode). Now: same macro + different meso
  // → distinct rows. NULL meso matches NULL meso (mirrors the persistCupping
  // NULLS NOT DISTINCT pattern from migration 041).
  let lookup = supabase
    .from('terroirs')
    .select('id, admin_region')
    .eq('user_id', userId)
    .eq('country', terroir.country)
    .eq('macro_terroir', terroir.macro_terroir)
  lookup = terroir.meso_terroir
    ? lookup.eq('meso_terroir', terroir.meso_terroir)
    : lookup.is('meso_terroir', null)
  const { data: rows } = await lookup

  if (rows && rows.length > 0) {
    // After meso filter, multi-row case is (same country+macro+meso, different
    // admin_region). Prefer the row whose admin_region tokens overlap with
    // caller input (Sprint 3.2 #1: tokenized so "Tolima" matches a multi-dept
    // canonical "Antioquia / Caldas / Quindío / Tolima"), else fall back to
    // the first row.
    const byAdmin = terroir.admin_region
      ? rows.find((r: any) => adminRegionMatches(r.admin_region, terroir.admin_region))
      : null
    const match = byAdmin || rows[0]
    return { isNew: false, id: match.id, inRegistry, terroir }
  }
  return { isNew: true, inRegistry, terroir }
}

export type CultivarMatch =
  | { isNew: false; id: string; inRegistry: boolean; cultivar: CultivarCandidate }
  | { isNew: true; inRegistry: boolean; cultivar: CultivarCandidate }

export async function matchCultivar(
  supabase: SupabaseClient,
  userId: string,
  cultivar: CultivarCandidate
): Promise<CultivarMatch> {
  const inRegistry = cultivarInRegistry(cultivar.cultivar_name)

  if (!cultivar.cultivar_name) {
    return { isNew: true, inRegistry, cultivar }
  }

  const { data: rows } = await supabase
    .from('cultivars')
    .select('id')
    .eq('user_id', userId)
    .ilike('cultivar_name', cultivar.cultivar_name)

  if (rows && rows.length > 0) {
    return { isNew: false, id: rows[0].id, inRegistry, cultivar }
  }
  return { isNew: true, inRegistry, cultivar }
}

// Sprint 2.6: `created` flag distinguishes "found existing row" from "inserted
// fresh row" — used by persistBrew to populate createdTerroir / createdCultivar
// in its response without a separate pre-existence DB check. False when input
// is empty (no FK resolved) and on the find-existing branch; true on insert.
export type FindOrCreateResult =
  | { ok: true; id: string | null; created: boolean }
  | { ok: false; error: string; status: 400 | 500 }

export async function findOrCreateCultivar(
  supabase: SupabaseClient,
  userId: string,
  rawName: string | null | undefined,
): Promise<FindOrCreateResult> {
  const raw = typeof rawName === 'string' ? rawName.trim() : ''
  if (!raw) return { ok: true, id: null, created: false }

  const entry = resolveCultivar(raw)
  if (!entry) {
    return {
      ok: false,
      status: 400,
      error: `cultivar "${raw}" is not in the canonical registry. To add a new cultivar, use /add.`,
    }
  }

  const { data: existingRows } = await supabase
    .from('cultivars')
    .select('id')
    .eq('user_id', userId)
    .ilike('cultivar_name', entry.name)
  if (existingRows && existingRows.length > 0) {
    return { ok: true, id: existingRows[0].id, created: false }
  }

  const { data: created, error: createErr } = await supabase
    .from('cultivars')
    .insert({
      user_id: userId,
      cultivar_name: entry.name,
      species: entry.species,
      genetic_family: entry.family,
      lineage: entry.lineage,
    })
    .select('id')
    .single()
  if (createErr || !created) {
    return { ok: false, status: 500, error: createErr?.message || 'cultivar create failed' }
  }
  return { ok: true, id: created.id, created: true }
}

export type FindOrCreateRoasterResult = CanonicalTextResult
export type FindOrCreateProducerResult = CanonicalTextResult
export type FindOrCreateBrewerResult = CanonicalTextResult
export type FindOrCreateFilterResult = CanonicalTextResult

export function findOrCreateRoaster(
  rawName: string | null | undefined,
  opts: { allowOverride?: boolean } = {},
): FindOrCreateRoasterResult {
  return validateCanonicalText(rawName, ROASTER_LOOKUP, 'roaster', opts)
}

export function findOrCreateProducer(
  rawName: string | null | undefined,
  opts: { allowOverride?: boolean } = {},
): FindOrCreateProducerResult {
  return validateCanonicalText(rawName, PRODUCER_LOOKUP, 'producer', opts)
}

export function findOrCreateBrewer(
  rawName: string | null | undefined,
  opts: { allowOverride?: boolean } = {},
): FindOrCreateBrewerResult {
  return validateCanonicalText(rawName, BREWER_LOOKUP, 'brewer', opts)
}

export function findOrCreateFilter(
  rawName: string | null | undefined,
  opts: { allowOverride?: boolean } = {},
): FindOrCreateFilterResult {
  return validateCanonicalText(rawName, FILTER_LOOKUP, 'filter', opts)
}

export async function findOrCreateTerroir(
  supabase: SupabaseClient,
  userId: string,
  country: string | null | undefined,
  rawMacro: string | null | undefined,
  adminOverride?: string | null,
  mesoOverride?: string | null,
): Promise<FindOrCreateResult> {
  const countryTrim = typeof country === 'string' ? country.trim() : ''
  const rawMacroTrim = typeof rawMacro === 'string' ? rawMacro.trim() : ''

  if (!countryTrim && !rawMacroTrim) return { ok: true, id: null, created: false }
  if (!countryTrim) {
    return {
      ok: false,
      status: 400,
      error: 'country is required when setting a terroir',
    }
  }
  if (!rawMacroTrim) return { ok: true, id: null, created: false }

  // Country-scoped canonicalize. Closes the Item 22 cross-country fuzzy-match
  // bug where global findClosest could surface a macro from the wrong country
  // as the suggestion (e.g. "Minas Gerais" for Brazil cross-matching to
  // "Mindanao Highlands" because they're alphabetically adjacent globally).
  // The resolver only ever suggests in-country candidates; the admin_region
  // hint covers the most common lived case where the caller typed an
  // admin_region as if it were a macro.
  const canonical = canonicalizeMacroInCountry(countryTrim, rawMacroTrim)
  if (!canonical) {
    const adminHintMacros = macrosForAdminRegion(countryTrim, rawMacroTrim)
    const hint = adminHintMacros.length > 0
      ? ` "${rawMacroTrim}" looks like an admin_region for ${countryTrim} — macros there are: ${adminHintMacros.join(', ')}.`
      : ''
    return {
      ok: false,
      status: 400,
      error: `macro terroir "${rawMacroTrim}" is not in the canonical registry for country "${countryTrim}".${hint} Add to docs/taxonomies/regions.md + lib/terroir-registry.ts before pushing, or call propose_canonical_addition.`,
    }
  }

  // Country-scoped resolver only returns macros registered for this country,
  // so the pair lookup is defensive against a future drift between the
  // country-scoped lookup cache and the rich TERROIRS table.
  const entry = getTerroirEntry(countryTrim, canonical)
  if (!entry) {
    return {
      ok: false,
      status: 500,
      error: `internal: country-scoped resolver returned "${canonical}" but pair lookup failed for "${countryTrim}". Likely a registry sync issue.`,
    }
  }

  // Pass meso to the meso-aware match (Sprint 2.6 — closes R12 silent-collapse).
  const mesoTrim = (typeof mesoOverride === 'string' && mesoOverride.trim())
    ? mesoOverride.trim()
    : null
  const match = await matchTerroir(supabase, userId, {
    country: countryTrim,
    macro_terroir: canonical,
    admin_region: adminOverride ?? null,
    meso_terroir: mesoTrim,
  })
  if (!match.isNew) {
    return { ok: true, id: match.id, created: false }
  }

  // Registry's admin_region wins over caller input when caller's value differs
  // from canonical (warn via console — Sprint 2.6 closes R7/R8 silent-NULL by
  // preferring registry metadata over caller-supplied fields). Caller's meso
  // is always preserved (meso is per-bean, not in the rich registry).
  const callerAdmin = (typeof adminOverride === 'string' && adminOverride.trim()) || null
  const admin = entry.admin_region
  if (callerAdmin && !adminRegionMatches(callerAdmin, admin)) {
    console.warn(
      `[findOrCreateTerroir] admin_region drift: caller sent "${callerAdmin}" but registry has "${admin}" for ${countryTrim}/${canonical}. Using registry value.`,
    )
  }

  const { data: created, error: createErr } = await supabase
    .from('terroirs')
    .insert({
      user_id: userId,
      country: countryTrim,
      admin_region: admin,
      macro_terroir: canonical,
      meso_terroir: mesoTrim,
    })
    .select('id')
    .single()
  if (createErr || !created) {
    return { ok: false, status: 500, error: createErr?.message || 'terroir create failed' }
  }
  return { ok: true, id: created.id, created: true }
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export type ValidationResult = { ok: true } | { ok: false; errors: string[] }

export function validateBrewPayload(payload: BrewPayload): ValidationResult {
  const errors: string[] = []

  if (!payload.coffee_name || !payload.coffee_name.trim()) {
    errors.push('coffee_name is required')
  }
  if (payload.source && payload.source !== 'purchased' && payload.source !== 'self-roasted') {
    errors.push(`source must be "purchased" or "self-roasted" (got "${payload.source}")`)
  }
  if (payload.source === 'self-roasted' && !payload.green_bean_id?.trim()) {
    errors.push('green_bean_id is required when source = "self-roasted"')
  }

  if (payload.extraction_strategy && !EXTRACTION_STRATEGIES.includes(payload.extraction_strategy as ExtractionStrategy)) {
    errors.push(
      `extraction_strategy must be one of: ${EXTRACTION_STRATEGIES.join(', ')} (got "${payload.extraction_strategy}")`
    )
  }

  // v8.4: hybrid_subform conditional. Required when strategy='Hybrid', forbidden otherwise.
  if (payload.extraction_strategy === 'Hybrid') {
    if (!payload.hybrid_subform?.trim()) {
      errors.push(
        `hybrid_subform is required when extraction_strategy = 'Hybrid'. Canonical: ${HYBRID_SUBFORMS.join(', ')}`
      )
    } else if (!isCanonicalHybridSubform(payload.hybrid_subform)) {
      errors.push(
        `hybrid_subform must be one of: ${HYBRID_SUBFORMS.join(', ')} (got "${payload.hybrid_subform}")`
      )
    }
  } else if (payload.hybrid_subform) {
    errors.push(
      `hybrid_subform must be null unless extraction_strategy = 'Hybrid' (got strategy "${payload.extraction_strategy ?? 'null'}", hybrid_subform "${payload.hybrid_subform}")`
    )
  }

  if (!payload.terroir || !payload.terroir.country?.trim()) {
    errors.push('terroir.country is required')
  }
  if (!payload.cultivar || !payload.cultivar.cultivar_name?.trim()) {
    errors.push('cultivar.cultivar_name is required')
  }

  // If we're going to create a new cultivar, the classification has to be well-formed
  if (payload.cultivar?.cultivar_name && !cultivarInRegistry(payload.cultivar.cultivar_name)) {
    if (payload.cultivar.genetic_family && !GENETIC_FAMILIES.includes(payload.cultivar.genetic_family as GeneticFamily)) {
      errors.push(
        `cultivar.genetic_family must be one of: ${GENETIC_FAMILIES.join(', ')} (got "${payload.cultivar.genetic_family}")`
      )
    }
  }

  // Structured process validation — each axis canonical-or-null.
  if (payload.base_process && !BASE_PROCESSES.includes(payload.base_process)) {
    errors.push(`base_process must be one of: ${BASE_PROCESSES.join(', ')} (got "${payload.base_process}")`)
  }
  if (payload.subprocess && !HONEY_SUBPROCESSES.includes(payload.subprocess as HoneySubprocess)) {
    errors.push(`subprocess must be one of: ${HONEY_SUBPROCESSES.join(', ')} (got "${payload.subprocess}")`)
  }
  for (const [axis, lookup, list] of [
    ['fermentation_modifiers', FERMENTATION_LOOKUP, payload.fermentation_modifiers],
    ['fermentation_qualifiers', FERMENTATION_QUALIFIER_LOOKUP, payload.fermentation_qualifiers],
    ['drying_modifiers', DRYING_LOOKUP, payload.drying_modifiers],
    ['intervention_modifiers', INTERVENTION_LOOKUP, payload.intervention_modifiers],
    ['experimental_modifiers', EXPERIMENTAL_LOOKUP, payload.experimental_modifiers],
  ] as const) {
    if (!list) continue
    for (const v of list) {
      if (!lookup.isCanonical(v)) errors.push(`${axis}: "${v}" is not canonical`)
    }
  }
  if (payload.decaf_modifier && !DECAF_MODIFIERS.includes(payload.decaf_modifier)) {
    errors.push(`decaf_modifier must be one of: ${DECAF_MODIFIERS.join(', ')} (got "${payload.decaf_modifier}")`)
  }
  // Sprint 12 / MCP-1: signature_method validation moved to persistBrew via
  // findOrCreateSignatureMethod (mirrors roaster/producer override pattern).
  // Strict-canonical check stays here ONLY when override is not set; the
  // helper in persistBrew handles the override branch.

  if (payload.modifiers !== undefined && payload.modifiers !== null) {
    const m = cleanModifiers(payload.modifiers)
    if (!m.ok) errors.push(m.error)
  }

  if (payload.pours !== undefined && payload.pours !== null) {
    const p = cleanPours(payload.pours)
    if (!p.ok) errors.push(p.error)
  }

  return errors.length ? { ok: false, errors } : { ok: true }
}

// ---------------------------------------------------------------------------
// Persistence — resolves/creates terroir + cultivar, inserts the brew
// ---------------------------------------------------------------------------

// Sprint 2.6: PersistOptions retained for back-compat with /add UI + /api/brews/import
// callers, but `confirmNewTerroir` / `confirmNewCultivar` are now NO-OPS. The new
// strict-canonical model fails fast on non-canonical terroir/cultivar input — there
// is no "confirm new" flow because non-registry entries can't be persisted at all.
// The confirm_required PersistResult variant is also retained for back-compat but
// is never returned from persistBrew post-2.6.
export interface PersistOptions {
  /** @deprecated Sprint 2.6 — no-op; persistBrew always routes through findOrCreateTerroir which fails fast on non-canonical input. */
  confirmNewTerroir?: boolean
  /** @deprecated Sprint 2.6 — no-op; persistBrew always routes through findOrCreateCultivar which fails fast on non-canonical input. */
  confirmNewCultivar?: boolean
}

export type PersistResult =
  | {
      ok: true
      brewId: string
      terroirId: string
      cultivarId: string
      createdTerroir: boolean
      createdCultivar: boolean
      queuedForTaxonomyReview: QueuedEntry[]
    }
  | { ok: false; code: 'confirm_required'; newTerroir?: TerroirMatch; newCultivar?: CultivarMatch }
  | { ok: false; code: 'validation'; errors: string[] }
  | { ok: false; code: 'db_error'; message: string }

export async function persistBrew(
  supabase: SupabaseClient,
  userId: string,
  payload: BrewPayload,
  opts: PersistOptions = {}
): Promise<PersistResult> {
  // Aggregate ALL validation errors into one response (MCP feedback batch 3,
  // 2026-04-30 — "validation surfaces one error at a time" was the highest-
  // leverage friction point: multi-field problems used to require N round-
  // trips, now they collapse to one). Order of accumulation:
  //   1. validateBrewPayload (already accumulates internally).
  //   2. Each text-only canonical (roaster / producer / brewer / filter /
  //      grinder + grind_setting / roast_level) — run all in sequence, push
  //      every failure, only fail-out as a batch.
  // Aggregation runs BEFORE any DB write so a failed validation never leaves
  // orphan terroir/cultivar inserts.
  const errors: string[] = []
  const validation = validateBrewPayload(payload)
  if (!validation.ok) errors.push(...validation.errors)

  const roasterResult = findOrCreateRoaster(payload.roaster, { allowOverride: payload.roaster_override === true })
  if (!roasterResult.ok) errors.push(roasterResult.error)
  const producerResult = findOrCreateProducer(payload.producer, { allowOverride: payload.producer_override === true })
  if (!producerResult.ok) errors.push(producerResult.error)
  const brewerResult = findOrCreateBrewer(payload.brewer, { allowOverride: payload.brewer_override === true })
  if (!brewerResult.ok) errors.push(brewerResult.error)
  const filterResult = findOrCreateFilter(payload.filter, { allowOverride: payload.filter_override === true })
  if (!filterResult.ok) errors.push(filterResult.error)
  const grinderResult = findOrCreateGrinder(payload.grinder, { allowOverride: payload.grinder_override === true })
  if (!grinderResult.ok) errors.push(grinderResult.error)
  // Sprint 12 / MCP-1: signature_method joins the override-eligible pattern.
  const signatureMethodResult = findOrCreateSignatureMethod(payload.signature_method, {
    allowOverride: payload.signature_method_override === true,
  })
  if (!signatureMethodResult.ok) errors.push(signatureMethodResult.error)
  if (
    grinderResult.ok &&
    grinderResult.canonicalName &&
    payload.grind_setting?.trim() &&
    !isResolvableSetting(grinderResult.canonicalName, payload.grind_setting)
  ) {
    errors.push(`grind_setting "${payload.grind_setting}" is not valid on ${grinderResult.canonicalName}`)
  }
  let canonicalRoastLevel: string | null = null
  if (payload.roast_level?.trim()) {
    canonicalRoastLevel = ROAST_LEVEL_LOOKUP.canonicalize(payload.roast_level)
    if (!canonicalRoastLevel) {
      errors.push(`roast_level "${payload.roast_level}" is not in the canonical registry`)
    }
  }

  // cleanFlavors / cleanStructureTags also accumulate into the same batch so
  // a payload with both a bad roaster AND bad flavors gets both errors back
  // in one round-trip. Deferred until after the canonical-text checks so we
  // don't burn cleaning cycles when the upstream fields are already failing.
  const flavorsResult = cleanFlavors(payload.flavors ?? null)
  if (!flavorsResult.ok) errors.push(flavorsResult.error)
  const structureResult = cleanStructureTags(payload.structure_tags ?? null)
  if (!structureResult.ok) errors.push(structureResult.error)

  if (errors.length > 0) {
    return { ok: false, code: 'validation', errors }
  }
  // Discriminated-union narrowing for the rest of the function — every
  // findOrCreate* + clean* has succeeded above. TS can't infer this through
  // the accumulator pattern, so we re-assert as a safety net.
  if (
    !roasterResult.ok ||
    !producerResult.ok ||
    !brewerResult.ok ||
    !filterResult.ok ||
    !grinderResult.ok ||
    !signatureMethodResult.ok ||
    !flavorsResult.ok ||
    !structureResult.ok
  ) {
    return { ok: false, code: 'validation', errors: ['unreachable: post-aggregation narrowing'] }
  }
  const cleanedFlavors = flavorsResult.value
  const cleanedStructureTags = structureResult.value
  // Structured pours: NULL (not []) signals "legacy row, use the free-text
  // fallback render". Validated above; cleanPours trims + drops unknown keys.
  const poursResult = payload.pours == null ? null : cleanPours(payload.pours)
  const cleanedPours: PourStep[] | null = poursResult && poursResult.ok ? poursResult.value : null

  // Sprint 2.6 — terroir + cultivar route through the strict-canonical
  // findOrCreate* helpers. Closes 4 silent-failure modes from the dog-food log
  // (R7 silent-NULL, R8 silent-create-non-canonical, R12 meso-collapse, R23
  // misattributed-canonical). Errors aggregate into the same accumulator that
  // collects roaster/producer/etc validation failures so a multi-field problem
  // reports every error in one round-trip. Run in parallel (Promise.all) since
  // they're independent DB calls. The opts.confirmNew{Terroir,Cultivar} flags
  // are NO-OPS in this path — strict-canonical model has no "confirm new" flow.
  const [terroirResult, cultivarResult] = await Promise.all([
    findOrCreateTerroir(
      supabase,
      userId,
      payload.terroir.country,
      payload.terroir.macro_terroir,
      payload.terroir.admin_region,
      payload.terroir.meso_terroir,
    ),
    findOrCreateCultivar(supabase, userId, payload.cultivar.cultivar_name),
  ])
  if (!terroirResult.ok) errors.push(terroirResult.error)
  if (!cultivarResult.ok) errors.push(cultivarResult.error)
  if (errors.length > 0) {
    return { ok: false, code: 'validation', errors }
  }
  // Post-FK narrowing — both must be ok past the errors-length check above.
  if (!terroirResult.ok || !cultivarResult.ok) {
    return { ok: false, code: 'validation', errors: ['unreachable: post-FK narrowing'] }
  }
  if (!terroirResult.id || !cultivarResult.id) {
    // findOrCreate* returns id:null on empty input. validateBrewPayload already
    // requires terroir.country + cultivar.cultivar_name, so this is unreachable
    // unless validation regresses. Surface as validation error rather than crash.
    return {
      ok: false,
      code: 'validation',
      errors: ['terroir and cultivar must resolve to non-null IDs (post-validation guard)'],
    }
  }
  const terroirId = terroirResult.id
  const cultivarId = cultivarResult.id
  const createdTerroir = terroirResult.created
  const createdCultivar = cultivarResult.created

  // Compute ratio if possible
  let ratio = payload.ratio ?? null
  if (!ratio && payload.dose_g && payload.water_g) {
    const r = payload.water_g / payload.dose_g
    ratio = `1:${r.toFixed(1)}`
  }

  const structured = seedStructuredProcess(payload)
  // Sprint 12 / MCP-1: when payload.signature_method was explicitly supplied,
  // override structured.signature_method with the canonicalized form (which
  // also covers the override-flag passthrough where canonicalName === verbatim).
  // Decomposed signature_method (when caller supplies legacy `process` only)
  // bypasses this — same back-compat behavior as before.
  if (typeof payload.signature_method === 'string') {
    structured.signature_method = signatureMethodResult.canonicalName
  }
  const composed = composeProcess(structured)
  const structuredGrind: StructuredGrind = {
    grinder: grinderResult.canonicalName,
    grind_setting: payload.grind_setting?.trim() || null,
  }
  const composedGrind = composeGrind(structuredGrind) ?? payload.grind ?? null

  // Phase 3 — provenance columns. 'auto_created' when this push materialized
  // the FK row for the first time; 'canonical' (default) when an existing row
  // was returned. Surfaces in get_green_bean / future get_brew so claude.ai
  // can flag "this row's terroir/cultivar was just minted" to the arbiter.
  const brewInsert: Partial<InsertBrew> & {
    terroir_provenance: 'canonical' | 'auto_created'
    cultivar_provenance: 'canonical' | 'auto_created'
  } = {
    user_id: userId,
    source: payload.source ?? 'purchased',
    green_bean_id: payload.green_bean_id ?? null,
    roast_id: payload.roast_id ?? null,
    terroir_id: terroirId,
    cultivar_id: cultivarId,
    terroir_provenance: createdTerroir ? 'auto_created' : 'canonical',
    cultivar_provenance: createdCultivar ? 'auto_created' : 'canonical',
    coffee_name: payload.coffee_name.trim(),
    roaster: roasterResult.canonicalName,
    producer: producerResult.canonicalName,
    variety: payload.variety ?? null,
    process: payload.process ?? composed,
    ...structuredProcessColumns(structured),
    roast_level: canonicalRoastLevel,
    flavors: cleanedFlavors,
    structure_tags: cleanedStructureTags,
    flavor_notes: cleanedFlavors.length > 0 ? composeFlavorNotes(cleanedFlavors) : (payload.flavor_notes ?? null),
    brewer: brewerResult.canonicalName,
    filter: filterResult.canonicalName,
    dose_g: payload.dose_g ?? null,
    water_g: payload.water_g ?? null,
    ratio,
    grinder: structuredGrind.grinder,
    grind_setting: structuredGrind.grind_setting,
    grind: composedGrind,
    temp_c: payload.temp_c ?? null,
    water_recipe: payload.water_recipe ?? null,
    bloom: payload.bloom ?? null,
    pour_structure: payload.pour_structure ?? null,
    pours: cleanedPours,
    total_time: payload.total_time ?? null,
    extraction_strategy: payload.extraction_strategy ?? null,
    hybrid_subform: payload.extraction_strategy === 'Hybrid' ? (payload.hybrid_subform ?? null) : null,
    extraction_confirmed: payload.extraction_confirmed ?? null,
    strategy_notes: payload.strategy_notes ?? null,
    cooling_curve_target: payload.cooling_curve_target?.trim() || null,
    modifiers: payload.modifiers ?? [],
    aroma: payload.aroma ?? null,
    attack: payload.attack ?? null,
    mid_palate: payload.mid_palate ?? null,
    body: payload.body ?? null,
    finish: payload.finish ?? null,
    temperature_evolution: payload.temperature_evolution ?? null,
    peak_expression: payload.peak_expression ?? null,
    key_takeaways: payload.key_takeaways ?? null,
    classification: payload.classification ?? null,
    terroir_connection: payload.terroir_connection ?? null,
    cultivar_connection: payload.cultivar_connection ?? null,
    roast_connection: null,
    is_process_dominant: payload.is_process_dominant ?? false,
    process_category: payload.process_category ?? null,
    process_details: payload.process_details ?? null,
    what_i_learned: payload.what_i_learned ?? null,
  }

  const { data: brew, error: brewError } = await supabase
    .from('brews')
    .insert(brewInsert)
    .select('id')
    .single()

  if (brewError || !brew) {
    return { ok: false, code: 'db_error', message: brewError?.message || 'brew insert failed' }
  }

  // Phase 3 — Site A queue inserts. Fire AFTER the brew row lands so source_id
  // points at a real row. Best-effort; failures log but don't fail the push.
  const queuedForTaxonomyReview = await fireQueueInserts(
    supabase,
    userId,
    [
      { axis: 'roaster', raw_value: roasterResult.canonicalName, needsQueue: roasterResult.needsQueue },
      { axis: 'producer', raw_value: producerResult.canonicalName, needsQueue: producerResult.needsQueue },
      { axis: 'brewer', raw_value: brewerResult.canonicalName, needsQueue: brewerResult.needsQueue },
      { axis: 'filter', raw_value: filterResult.canonicalName, needsQueue: filterResult.needsQueue },
      { axis: 'grinder', raw_value: grinderResult.canonicalName, needsQueue: grinderResult.needsQueue },
      // Sprint 12 / MCP-1 (migration 063): signature_method joins the queue.
      { axis: 'signature_method', raw_value: signatureMethodResult.canonicalName, needsQueue: signatureMethodResult.needsQueue },
    ],
    { kind: 'brew', id: brew.id },
  )

  return {
    ok: true,
    brewId: brew.id,
    terroirId,
    cultivarId,
    createdTerroir,
    createdCultivar,
    queuedForTaxonomyReview,
  }
}

// ---------------------------------------------------------------------------
// Patch — field-level mutation for an existing brew row.
//
// Sprint 2.6 — extracted from `app/api/brews/[id]/route.ts` PATCH handler so
// the MCP `patch_brew` Tool and the route can share canonical-validation
// logic verbatim. The route becomes a thin NextResponse wrapper around this
// helper; `lib/mcp/patch-brew.ts` calls the same path.
//
// Patch semantics: only fields PRESENT in the body are UPDATEd. Omitted
// fields are untouched. Empty-string is normalized to null on text fields.
//
// Validation: aggregates all field-level errors into a single PatchBrewResult
// (mirrors persistBrew batch-error behavior post-2.4.3) so multi-field
// problems collapse to one round-trip.
// ---------------------------------------------------------------------------

// Whitelist for direct patch. `cultivar_id` / `terroir_id` are resolved
// server-side via findOrCreateCultivar / findOrCreateTerroir from
// `cultivar_name` / `country` / `terroir_name` body keys.
export const PATCH_BREW_EDITABLE_FIELDS = [
  'coffee_name',
  'roaster',
  'producer',
  'variety',
  'process',
  'roast_level',
  'flavor_notes',
  'flavors',
  'structure_tags',
  'brewer',
  'filter',
  'dose_g',
  'water_g',
  'ratio',
  'grind',
  'grinder',
  'grind_setting',
  'temp_c',
  'water_recipe',
  'bloom',
  'pour_structure',
  'pours',
  'total_time',
  'extraction_strategy',
  'hybrid_subform',
  'extraction_confirmed',
  'strategy_notes',
  'cooling_curve_target',
  'modifiers',
  'aroma',
  'attack',
  'mid_palate',
  'body',
  'finish',
  'temperature_evolution',
  'peak_expression',
  'key_takeaways',
  'classification',
  'terroir_connection',
  'cultivar_connection',
  'what_i_learned',
  'is_process_dominant',
  'process_category',
  'process_details',
  'base_process',
  'subprocess',
  'fermentation_modifiers',
  'fermentation_qualifiers',
  'drying_modifiers',
  'intervention_modifiers',
  'experimental_modifiers',
  'decaf_modifier',
  'signature_method',
  'green_bean_id',
  'roast_id',
] as const

export type PatchBrewResult =
  | { ok: true; brewId: string }
  | { ok: false; code: 'validation'; errors: string[] }
  | { ok: false; code: 'no_op'; message: string }
  | { ok: false; code: 'not_found'; message: string }
  | { ok: false; code: 'db_error'; message: string }

// Aggregating canonicalize for text-only-no-FK fields with allowOverride
// (roaster / producer / brewer / filter / grinder). Mutates `patch[field]`
// in place; pushes errors into the accumulator instead of returning. Mirrors
// `canonicalizeOverridable` from app/api/brews/[id]/route.ts but error-shape
// is plain string (not NextResponse).
function canonicalizeOverridablePatch(
  patch: Record<string, unknown>,
  body: Record<string, unknown>,
  field: string,
  lookup: CanonicalLookup,
  overrideKey: string,
  errors: string[],
): void {
  if (!(field in patch)) return
  const v = patch[field]
  if (v === '' || v === null) {
    patch[field] = null
    return
  }
  if (typeof v !== 'string') {
    errors.push(`${field} must be a string`)
    return
  }
  const canonical = lookup.canonicalize(v)
  if (canonical) {
    patch[field] = canonical
    return
  }
  if (body[overrideKey] === true) {
    patch[field] = v.trim()
    return
  }
  errors.push(`${field} "${v}" is not in the canonical registry. Send ${overrideKey}:true to bypass.`)
}

export async function patchBrew(
  supabase: SupabaseClient,
  userId: string,
  brewId: string,
  body: Record<string, unknown>,
): Promise<PatchBrewResult> {
  const errors: string[] = []
  const patch: Record<string, unknown> = {}
  for (const key of PATCH_BREW_EDITABLE_FIELDS) {
    if (key in body) patch[key] = body[key]
  }

  const hasCanonicalKey = 'cultivar_name' in body || 'terroir_name' in body || 'country' in body
  const recomposeProcess = body.recompose_process === true
  if (Object.keys(patch).length === 0 && !hasCanonicalKey && !recomposeProcess) {
    return { ok: false, code: 'no_op', message: 'no editable fields in body' }
  }

  // extraction_strategy
  if ('extraction_strategy' in patch) {
    const s = patch.extraction_strategy
    if (s !== null && s !== '' && !EXTRACTION_STRATEGIES.includes(s as ExtractionStrategy)) {
      errors.push(
        `extraction_strategy must be one of: ${EXTRACTION_STRATEGIES.join(', ')} (got "${String(s)}")`,
      )
    } else if (s === '') patch.extraction_strategy = null
  }

  // v8.4: hybrid_subform conditional. Validate the in-patch pair when either is
  // supplied. When extraction_strategy moves AWAY from 'Hybrid' in the same
  // patch, auto-clear hybrid_subform (mirrors the recompose-process pattern).
  if ('hybrid_subform' in patch) {
    const v = patch.hybrid_subform
    if (v === '' || v === null) {
      patch.hybrid_subform = null
    } else if (typeof v !== 'string' || !isCanonicalHybridSubform(v)) {
      errors.push(`hybrid_subform must be one of: ${HYBRID_SUBFORMS.join(', ')} (got "${String(v)}")`)
    }
  }
  // If strategy is in the patch, enforce the conditional rule using the
  // patch's own intended pair (don't second-guess the existing row's strategy
  // on a partial patch — the caller is responsible for keeping the pair coherent).
  if ('extraction_strategy' in patch) {
    if (patch.extraction_strategy === 'Hybrid') {
      // Required when explicitly setting Hybrid AND no sub-form supplied in same patch.
      if (!('hybrid_subform' in patch) || !patch.hybrid_subform) {
        errors.push(
          `hybrid_subform is required when extraction_strategy = 'Hybrid'. Canonical: ${HYBRID_SUBFORMS.join(', ')}`,
        )
      }
    } else if (patch.extraction_strategy !== undefined) {
      // Strategy moved away from Hybrid — auto-clear sub-form (don't error
      // if the caller didn't explicitly null it; this is the natural shape).
      patch.hybrid_subform = null
    }
  }

  // cooling_curve_target — free-text, normalize empty -> null
  if ('cooling_curve_target' in patch) {
    const v = patch.cooling_curve_target
    if (v === '' || v === null) {
      patch.cooling_curve_target = null
    } else if (typeof v !== 'string') {
      errors.push('cooling_curve_target must be a string')
    } else {
      patch.cooling_curve_target = v.trim() || null
    }
  }

  // water_recipe — free-text, normalize empty -> null (Sub-sprint 4c Bundle A)
  if ('water_recipe' in patch) {
    const v = patch.water_recipe
    if (v === '' || v === null) {
      patch.water_recipe = null
    } else if (typeof v !== 'string') {
      errors.push('water_recipe must be a string')
    } else {
      patch.water_recipe = v.trim() || null
    }
  }

  // modifiers
  if ('modifiers' in patch) {
    const result = cleanModifiers(patch.modifiers)
    if (!result.ok) errors.push(result.error)
    else patch.modifiers = result.value
  }

  // pours — structured pour steps. null passes through untouched (clears back
  // to the legacy fallback); an array validates + normalizes via cleanPours
  // (mirrors modifiers).
  if ('pours' in patch && patch.pours !== null) {
    const result = cleanPours(patch.pours)
    if (!result.ok) errors.push(result.error)
    else patch.pours = result.value
  }

  // structured process axes
  if ('base_process' in patch) {
    const v = patch.base_process
    if (v !== null && (typeof v !== 'string' || !BASE_PROCESSES.includes(v as BaseProcess))) {
      errors.push(`base_process must be one of: ${BASE_PROCESSES.join(', ')}`)
    }
  }
  if ('subprocess' in patch) {
    const v = patch.subprocess
    if (v !== null && v !== '' && (typeof v !== 'string' || !HONEY_SUBPROCESSES.includes(v as HoneySubprocess))) {
      errors.push(`subprocess must be one of: ${HONEY_SUBPROCESSES.join(', ')}`)
    } else if (v === '') patch.subprocess = null
  }
  for (const [key, lookup] of [
    ['fermentation_modifiers', FERMENTATION_LOOKUP],
    ['fermentation_qualifiers', FERMENTATION_QUALIFIER_LOOKUP],
    ['drying_modifiers', DRYING_LOOKUP],
    ['intervention_modifiers', INTERVENTION_LOOKUP],
    ['experimental_modifiers', EXPERIMENTAL_LOOKUP],
  ] as const satisfies ReadonlyArray<readonly [string, CanonicalLookup]>) {
    if (!(key in patch)) continue
    const v = patch[key]
    if (!Array.isArray(v) || v.some((x) => typeof x !== 'string' || !lookup.isCanonical(x))) {
      errors.push(`${key} must be an array of canonical values`)
    }
  }
  if ('decaf_modifier' in patch) {
    const v = patch.decaf_modifier
    if (v !== null && v !== '' && (typeof v !== 'string' || !DECAF_MODIFIERS.includes(v as DecafModifier))) {
      errors.push(`decaf_modifier must be one of: ${DECAF_MODIFIERS.join(', ')}`)
    } else if (v === '') patch.decaf_modifier = null
  }
  if ('signature_method' in patch) {
    const v = patch.signature_method
    if (v !== null && v !== '' && (typeof v !== 'string' || !SIGNATURE_LOOKUP.isResolvable(v))) {
      errors.push(`signature_method "${String(v)}" is not in the canonical registry`)
    } else if (v === '') patch.signature_method = null
  }

  // roast_level — strict canonical, canonicalize on write
  if ('roast_level' in patch) {
    const v = patch.roast_level
    if (v === '' || v === null) {
      patch.roast_level = null
    } else if (typeof v !== 'string') {
      errors.push('roast_level must be a string')
    } else {
      const canonical = ROAST_LEVEL_LOOKUP.canonicalize(v)
      if (!canonical) errors.push(`roast_level "${v}" is not in the canonical registry`)
      else patch.roast_level = canonical
    }
  }

  // text-only-no-FK with allowOverride
  canonicalizeOverridablePatch(patch, body, 'roaster', ROASTER_LOOKUP, 'roaster_override', errors)
  canonicalizeOverridablePatch(patch, body, 'producer', PRODUCER_LOOKUP, 'producer_override', errors)
  canonicalizeOverridablePatch(patch, body, 'grinder', GRINDER_LOOKUP, 'grinder_override', errors)
  canonicalizeOverridablePatch(patch, body, 'brewer', BREWER_LOOKUP, 'brewer_override', errors)
  canonicalizeOverridablePatch(patch, body, 'filter', FILTER_LOOKUP, 'filter_override', errors)

  // grind_setting — pair-aware with the grinder from same patch
  if ('grind_setting' in patch) {
    const v = patch.grind_setting
    if (v === '' || v === null) {
      patch.grind_setting = null
    } else if (typeof v !== 'string') {
      errors.push('grind_setting must be a string')
    } else {
      const trimmed = v.trim()
      const grinderForLookup = typeof patch.grinder === 'string' ? patch.grinder : null
      if (grinderForLookup && !isResolvableSetting(grinderForLookup, trimmed)) {
        errors.push(`grind_setting "${trimmed}" is not valid on ${grinderForLookup}`)
      } else {
        patch.grind_setting = trimmed
      }
    }
  }

  // flavors / structure_tags
  if ('flavors' in patch) {
    const result = cleanFlavors(patch.flavors)
    if (!result.ok) errors.push(result.error)
    else {
      patch.flavors = result.value
      patch.flavor_notes = composeFlavorNotes(result.value)
    }
  }
  if ('structure_tags' in patch) {
    const result = cleanStructureTags(patch.structure_tags)
    if (!result.ok) errors.push(result.error)
    else patch.structure_tags = result.value
  }

  // Recompute legacy `grind` display column when either structured field changes.
  if ('grinder' in patch || 'grind_setting' in patch) {
    patch.grind = composeGrind({
      grinder: typeof patch.grinder === 'string' ? patch.grinder : null,
      grind_setting: typeof patch.grind_setting === 'string' ? patch.grind_setting : null,
    })
  }

  // coffee_name non-empty when supplied
  if ('coffee_name' in patch) {
    const name = typeof patch.coffee_name === 'string' ? patch.coffee_name.trim() : ''
    if (!name) errors.push('coffee_name cannot be empty')
    else patch.coffee_name = name
  }

  if (errors.length > 0) {
    return { ok: false, code: 'validation', errors }
  }

  // Resolve cultivar_name + terroir_name to FK ids (Sprint 2.6: strict canonical
  // via the new findOrCreate*; auto-populates registry-derived fields on create).
  if ('cultivar_name' in body) {
    const result = await findOrCreateCultivar(
      supabase,
      userId,
      typeof body.cultivar_name === 'string' ? body.cultivar_name : null,
    )
    if (!result.ok) return { ok: false, code: 'validation', errors: [result.error] }
    patch.cultivar_id = result.id
  }
  if ('terroir_name' in body || 'country' in body) {
    const result = await findOrCreateTerroir(
      supabase,
      userId,
      typeof body.country === 'string' ? body.country : null,
      typeof body.terroir_name === 'string' ? body.terroir_name : null,
      typeof body.admin_region === 'string' ? body.admin_region : null,
      typeof body.meso_terroir === 'string' ? body.meso_terroir : null,
    )
    if (!result.ok) return { ok: false, code: 'validation', errors: [result.error] }
    patch.terroir_id = result.id
  }

  // Recompose legacy `process` display when any structured-process field
  // changes OR when the caller explicitly requests recomposition (cleanup of
  // legacy verbose paste-text rows where structured cols are correct but the
  // display string was never run through composeProcess). Mirrors the grind
  // recompute pattern above.
  const PROCESS_FIELDS = [
    'base_process', 'subprocess', 'fermentation_modifiers', 'fermentation_qualifiers',
    'drying_modifiers', 'intervention_modifiers', 'experimental_modifiers',
    'decaf_modifier', 'signature_method',
  ] as const
  if (recomposeProcess || PROCESS_FIELDS.some((k) => k in patch)) {
    const { data: row } = await supabase
      .from('brews')
      .select('base_process, subprocess, fermentation_modifiers, fermentation_qualifiers, drying_modifiers, intervention_modifiers, experimental_modifiers, decaf_modifier, signature_method')
      .eq('id', brewId)
      .eq('user_id', userId)
      .single()
    if (!row) {
      return { ok: false, code: 'not_found', message: `brew "${brewId}" not found (or not owned by this user)` }
    }
    const merged: StructuredProcess = {
      base_process: ('base_process' in patch ? patch.base_process : row.base_process) as StructuredProcess['base_process'],
      subprocess: ('subprocess' in patch ? patch.subprocess : row.subprocess) as StructuredProcess['subprocess'],
      fermentation_modifiers: ('fermentation_modifiers' in patch ? patch.fermentation_modifiers : row.fermentation_modifiers) as readonly FermentationModifier[],
      fermentation_qualifiers: ('fermentation_qualifiers' in patch ? patch.fermentation_qualifiers : row.fermentation_qualifiers) as StructuredProcess['fermentation_qualifiers'],
      drying_modifiers: ('drying_modifiers' in patch ? patch.drying_modifiers : row.drying_modifiers) as readonly DryingModifier[],
      intervention_modifiers: ('intervention_modifiers' in patch ? patch.intervention_modifiers : row.intervention_modifiers) as readonly InterventionModifier[],
      experimental_modifiers: ('experimental_modifiers' in patch ? patch.experimental_modifiers : row.experimental_modifiers) as readonly ExperimentalModifier[],
      decaf_modifier: ('decaf_modifier' in patch ? patch.decaf_modifier : row.decaf_modifier) as StructuredProcess['decaf_modifier'],
      signature_method: ('signature_method' in patch ? patch.signature_method : row.signature_method) as StructuredProcess['signature_method'],
    }
    patch.process = composeProcess(merged)
  }

  // RLS scopes to the owning user; `.eq('user_id')` is belt-and-suspenders.
  const { data, error } = await supabase
    .from('brews')
    .update(patch)
    .eq('id', brewId)
    .eq('user_id', userId)
    .select('id')
    .single()

  if (error?.code === 'PGRST116') {
    return { ok: false, code: 'not_found', message: `brew "${brewId}" not found (or not owned by this user)` }
  }
  if (error || !data) {
    return { ok: false, code: 'db_error', message: error?.message || 'brew update failed' }
  }
  return { ok: true, brewId: data.id }
}

