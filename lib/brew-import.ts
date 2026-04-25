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
  TERROIR_MACRO_LOOKUP,
  getTerroirEntry,
} from './terroir-registry'
import {
  BASE_PROCESSES,
  type BaseProcess,
  HONEY_SUBPROCESSES,
  type HoneySubprocess,
  FERMENTATION_LOOKUP,
  DRYING_LOOKUP,
  INTERVENTION_LOOKUP,
  EXPERIMENTAL_LOOKUP,
  DECAF_MODIFIERS,
  type DecafModifier,
  SIGNATURE_LOOKUP,
  composeProcess,
  decomposeProcess,
  structuredProcessColumns,
  type StructuredProcess,
} from './process-registry'
import { ROASTER_LOOKUP } from './roaster-registry'
import { ROAST_LEVEL_LOOKUP } from './roast-level-registry'
import { GRINDER_LOOKUP, isResolvableSetting } from './grinder-registry'

// ---------------------------------------------------------------------------
// Canonical registries
// ---------------------------------------------------------------------------

export const EXTRACTION_STRATEGIES = [
  'Clarity-First',
  'Balanced Intensity',
  'Full Expression',
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
  source?: 'purchased' // always purchased in this flow; default applied below
  roaster?: string | null
  // Transient: opt-out of strict roaster canonical enforcement for this brew.
  // When true, a non-resolvable roaster string persists verbatim (escape hatch
  // for legitimately new roasters before they land in lib/roaster-registry.ts).
  roaster_override?: boolean
  producer?: string | null
  variety?: string | null
  process?: string | null
  roast_level?: string | null
  flavor_notes?: string[] | null

  // Classification (required)
  terroir: TerroirCandidate
  cultivar: CultivarCandidate

  // Recipe
  brewer?: string | null
  filter?: string | null
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
  bloom?: string | null
  pour_structure?: string | null
  total_time?: string | null

  // Extraction strategy
  extraction_strategy?: ExtractionStrategy | string | null
  extraction_confirmed?: string | null

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
  drying_modifiers?: string[] | null
  intervention_modifiers?: string[] | null
  experimental_modifiers?: string[] | null
  decaf_modifier?: DecafModifier | null
  signature_method?: string | null
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

export function structuredGrindColumns(s: StructuredGrind): {
  grinder: string | null
  grind_setting: string | null
} {
  return { grinder: s.grinder, grind_setting: s.grind_setting }
}

// Bridge — accepts either structured fields (grinder + grind_setting) or a
// legacy `grind` string, and returns the structured pair. The structured
// fields win when present. The legacy string is decomposed back-compat for
// rows written before brews.grinder / brews.grind_setting existed.
const LEGACY_GRIND_FORWARD_RE =
  /^(?:Grind:\s*)?(?:Weber\s+Workshop\s+|Weber\s+)?EG-?1\s*[-:@]?\s*(.+?)\s*$/i
const LEGACY_GRIND_REVERSE_RE =
  /^(\d+(?:[.\-]\d+)?(?:\s*\([^)]*\))?)\s*\((?:Weber\s+(?:Workshop\s+)?)?EG-?1[^)]*\)\s*$/i

export function seedStructuredGrind(
  payload: Partial<Pick<BrewPayload, 'grinder' | 'grind_setting' | 'grind'>>,
): StructuredGrind {
  const grinderRaw = payload.grinder?.trim() ?? null
  if (grinderRaw) {
    return {
      grinder: GRINDER_LOOKUP.canonicalize(grinderRaw) ?? grinderRaw,
      grind_setting: payload.grind_setting?.trim() || null,
    }
  }
  const legacy = payload.grind?.trim()
  if (!legacy) return { grinder: null, grind_setting: null }

  const reverse = legacy.match(LEGACY_GRIND_REVERSE_RE)
  if (reverse) return { grinder: 'EG-1', grind_setting: reverse[1].trim() }
  const forward = legacy.match(LEGACY_GRIND_FORWARD_RE)
  if (forward) return { grinder: 'EG-1', grind_setting: forward[1].trim() }

  // Unknown legacy shape — fall back to whole string on grinder so the
  // strict registry surfaces it as non-resolvable on the next edit.
  return { grinder: legacy, grind_setting: null }
}

export type FindOrCreateGrinderResult =
  | { ok: true; canonicalName: string | null; resolved: boolean }
  | { ok: false; error: string; status: 400 }

// Mirror of findOrCreateRoaster — validate-and-normalize only (no DB write
// since brews.grinder is a text-only column with no FK). `allowOverride`
// passes a non-resolvable string through verbatim for legitimately new
// grinders before they land in lib/grinder-registry.ts.
export async function findOrCreateGrinder(
  _supabase: SupabaseClient,
  _userId: string,
  rawName: string | null | undefined,
  opts: { allowOverride?: boolean } = {},
): Promise<FindOrCreateGrinderResult> {
  const raw = typeof rawName === 'string' ? rawName.trim() : ''
  if (!raw) return { ok: true, canonicalName: null, resolved: false }
  const canonical = GRINDER_LOOKUP.canonicalize(raw)
  if (canonical) return { ok: true, canonicalName: canonical, resolved: true }
  if (opts.allowOverride) return { ok: true, canonicalName: raw, resolved: false }
  return {
    ok: false,
    status: 400,
    error: `grinder "${raw}" is not in the canonical registry. To add a new grinder, edit lib/grinder-registry.ts.`,
  }
}

export function seedStructuredProcess(payload: Partial<BrewPayload>): StructuredProcess {
  if (payload.base_process) {
    return {
      base_process: payload.base_process,
      subprocess: payload.subprocess ?? null,
      fermentation_modifiers: (payload.fermentation_modifiers ?? []) as StructuredProcess['fermentation_modifiers'],
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

  // Fetch ALL rows matching country + macro_terroir. There can be multiple
  // (same macro across different admin regions - e.g. Colombia's Western
  // Andean Cordillera has rows for both Valle del Cauca and Cauca). Prefer
  // the one whose admin_region matches, else fall back to the first row.
  // Meso tiebreak removed in sprint 1d.1 (meso demoted to free-text).
  const { data: rows } = await supabase
    .from('terroirs')
    .select('id, admin_region')
    .eq('user_id', userId)
    .eq('country', terroir.country)
    .eq('macro_terroir', terroir.macro_terroir)

  if (rows && rows.length > 0) {
    const byAdmin = terroir.admin_region
      ? rows.find((r: any) => r.admin_region?.toLowerCase() === terroir.admin_region?.toLowerCase())
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

export type FindOrCreateResult =
  | { ok: true; id: string | null }
  | { ok: false; error: string; status: 400 | 500 }

export async function findOrCreateCultivar(
  supabase: SupabaseClient,
  userId: string,
  rawName: string | null | undefined,
): Promise<FindOrCreateResult> {
  const raw = typeof rawName === 'string' ? rawName.trim() : ''
  if (!raw) return { ok: true, id: null }

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
    return { ok: true, id: existingRows[0].id }
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
  return { ok: true, id: created.id }
}

// Validate-and-normalize for `brews.roaster`. No DB write — `brews.roaster` is
// text-only (no FK / no roasters table), so this resolves aliases → canonical
// or short-circuits when the caller supplied `allowOverride`. Returns the form
// to persist (canonical if resolved, verbatim if overridden, null if empty).
// Shape mirrors findOrCreateCultivar / findOrCreateTerroir for signature
// parity — if a real roasters table lands in sprint 2.x, this helper absorbs
// the find-or-create logic without changing callers.
export type FindOrCreateRoasterResult =
  | { ok: true; canonicalName: string | null; resolved: boolean }
  | { ok: false; error: string; status: 400 }

export async function findOrCreateRoaster(
  _supabase: SupabaseClient,
  _userId: string,
  rawName: string | null | undefined,
  opts: { allowOverride?: boolean } = {},
): Promise<FindOrCreateRoasterResult> {
  const raw = typeof rawName === 'string' ? rawName.trim() : ''
  if (!raw) return { ok: true, canonicalName: null, resolved: false }
  const canonical = ROASTER_LOOKUP.canonicalize(raw)
  if (canonical) return { ok: true, canonicalName: canonical, resolved: true }
  if (opts.allowOverride) return { ok: true, canonicalName: raw, resolved: false }
  return {
    ok: false,
    status: 400,
    error: `roaster "${raw}" is not in the canonical registry. To add a new roaster, use /add with override.`,
  }
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

  if (!countryTrim && !rawMacroTrim) return { ok: true, id: null }
  if (!countryTrim) {
    return {
      ok: false,
      status: 400,
      error: 'country is required when setting a terroir',
    }
  }
  if (!rawMacroTrim) return { ok: true, id: null }

  const canonical = TERROIR_MACRO_LOOKUP.isCanonical(rawMacroTrim)
    ? rawMacroTrim
    : TERROIR_MACRO_LOOKUP.findClosest(rawMacroTrim)
  if (!canonical) {
    return {
      ok: false,
      status: 400,
      error: `macro terroir "${rawMacroTrim}" is not in the canonical registry. To add a new macro terroir, use /add.`,
    }
  }

  const match = await matchTerroir(supabase, userId, {
    country: countryTrim,
    macro_terroir: canonical,
    admin_region: adminOverride ?? null,
  })
  if (!match.isNew) {
    return { ok: true, id: match.id }
  }

  const entry = getTerroirEntry(countryTrim, canonical)
  const admin = (typeof adminOverride === 'string' && adminOverride.trim())
    ? adminOverride.trim()
    : entry?.admin_region ?? null
  const meso = (typeof mesoOverride === 'string' && mesoOverride.trim())
    ? mesoOverride.trim()
    : null

  const { data: created, error: createErr } = await supabase
    .from('terroirs')
    .insert({
      user_id: userId,
      country: countryTrim,
      admin_region: admin,
      macro_terroir: canonical,
      meso_terroir: meso,
    })
    .select('id')
    .single()
  if (createErr || !created) {
    return { ok: false, status: 500, error: createErr?.message || 'terroir create failed' }
  }
  return { ok: true, id: created.id }
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
  if (payload.source && payload.source !== 'purchased') {
    errors.push('source must be "purchased" for this import flow')
  }

  if (payload.extraction_strategy && !EXTRACTION_STRATEGIES.includes(payload.extraction_strategy as ExtractionStrategy)) {
    errors.push(
      `extraction_strategy must be one of: ${EXTRACTION_STRATEGIES.join(', ')} (got "${payload.extraction_strategy}")`
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
  if (payload.signature_method && !SIGNATURE_LOOKUP.isResolvable(payload.signature_method)) {
    errors.push(`signature_method "${payload.signature_method}" is not in the canonical registry`)
  }

  return errors.length ? { ok: false, errors } : { ok: true }
}

// ---------------------------------------------------------------------------
// Persistence — resolves/creates terroir + cultivar, inserts the brew
// ---------------------------------------------------------------------------

export interface PersistOptions {
  confirmNewTerroir?: boolean
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
  const validation = validateBrewPayload(payload)
  if (!validation.ok) {
    return { ok: false, code: 'validation', errors: validation.errors }
  }

  // Validate roaster + grinder + roast_level before any DB writes — failures
  // here would otherwise leave orphan terroir/cultivar inserts.
  const roasterResult = await findOrCreateRoaster(supabase, userId, payload.roaster, {
    allowOverride: payload.roaster_override === true,
  })
  if (!roasterResult.ok) {
    return { ok: false, code: 'validation', errors: [roasterResult.error] }
  }
  const grinderResult = await findOrCreateGrinder(supabase, userId, payload.grinder, {
    allowOverride: payload.grinder_override === true,
  })
  if (!grinderResult.ok) {
    return { ok: false, code: 'validation', errors: [grinderResult.error] }
  }
  if (
    grinderResult.canonicalName &&
    payload.grind_setting?.trim() &&
    !isResolvableSetting(grinderResult.canonicalName, payload.grind_setting)
  ) {
    return {
      ok: false,
      code: 'validation',
      errors: [`grind_setting "${payload.grind_setting}" is not valid on ${grinderResult.canonicalName}`],
    }
  }
  let canonicalRoastLevel: string | null = null
  if (payload.roast_level?.trim()) {
    canonicalRoastLevel = ROAST_LEVEL_LOOKUP.canonicalize(payload.roast_level)
    if (!canonicalRoastLevel) {
      return {
        ok: false,
        code: 'validation',
        errors: [`roast_level "${payload.roast_level}" is not in the canonical registry`],
      }
    }
  }

  const terroirMatch = await matchTerroir(supabase, userId, payload.terroir)
  const cultivarMatch = await matchCultivar(supabase, userId, payload.cultivar)

  if ((terroirMatch.isNew && !opts.confirmNewTerroir) || (cultivarMatch.isNew && !opts.confirmNewCultivar)) {
    return {
      ok: false,
      code: 'confirm_required',
      newTerroir: terroirMatch.isNew ? terroirMatch : undefined,
      newCultivar: cultivarMatch.isNew ? cultivarMatch : undefined,
    }
  }

  // Resolve terroir
  let terroirId: string
  let createdTerroir = false
  if (!terroirMatch.isNew) {
    terroirId = terroirMatch.id
  } else {
    const t = payload.terroir
    const { data, error } = await supabase
      .from('terroirs')
      .insert({
        user_id: userId,
        country: t.country,
        admin_region: t.admin_region ?? null,
        macro_terroir: t.macro_terroir ?? null,
        meso_terroir: t.meso_terroir ?? null,
        elevation_min: t.elevation_min ?? null,
        elevation_max: t.elevation_max ?? null,
        climate_stress: t.climate_stress ?? null,
      })
      .select('id')
      .single()
    if (error || !data) return { ok: false, code: 'db_error', message: error?.message || 'terroir insert failed' }
    terroirId = data.id
    createdTerroir = true
  }

  // Resolve cultivar
  let cultivarId: string
  let createdCultivar = false
  if (!cultivarMatch.isNew) {
    cultivarId = cultivarMatch.id
  } else {
    const c = payload.cultivar
    const { data, error } = await supabase
      .from('cultivars')
      .insert({
        user_id: userId,
        species: c.species ?? 'Arabica',
        genetic_family: c.genetic_family ?? null,
        lineage: c.lineage ?? null,
        cultivar_name: c.cultivar_name,
      })
      .select('id')
      .single()
    if (error || !data) return { ok: false, code: 'db_error', message: error?.message || 'cultivar insert failed' }
    cultivarId = data.id
    createdCultivar = true
  }

  // Compute ratio if possible
  let ratio = payload.ratio ?? null
  if (!ratio && payload.dose_g && payload.water_g) {
    const r = payload.water_g / payload.dose_g
    ratio = `1:${r.toFixed(1)}`
  }

  const structured = seedStructuredProcess(payload)
  const composed = composeProcess(structured)
  const structuredGrind: StructuredGrind = {
    grinder: grinderResult.canonicalName,
    grind_setting: payload.grind_setting?.trim() || null,
  }
  const composedGrind = composeGrind(structuredGrind) ?? payload.grind ?? null

  const brewInsert: Partial<InsertBrew> = {
    user_id: userId,
    source: 'purchased',
    green_bean_id: null,
    roast_id: null,
    terroir_id: terroirId,
    cultivar_id: cultivarId,
    coffee_name: payload.coffee_name.trim(),
    roaster: roasterResult.canonicalName,
    producer: payload.producer ?? null,
    variety: payload.variety ?? null,
    process: payload.process ?? composed,
    ...structuredProcessColumns(structured),
    roast_level: canonicalRoastLevel,
    flavor_notes: payload.flavor_notes ?? null,
    brewer: payload.brewer ?? null,
    filter: payload.filter ?? null,
    dose_g: payload.dose_g ?? null,
    water_g: payload.water_g ?? null,
    ratio,
    grinder: structuredGrind.grinder,
    grind_setting: structuredGrind.grind_setting,
    grind: composedGrind,
    temp_c: payload.temp_c ?? null,
    bloom: payload.bloom ?? null,
    pour_structure: payload.pour_structure ?? null,
    total_time: payload.total_time ?? null,
    extraction_strategy: payload.extraction_strategy ?? null,
    extraction_confirmed: payload.extraction_confirmed ?? null,
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

  return {
    ok: true,
    brewId: brew.id,
    terroirId,
    cultivarId,
    createdTerroir,
    createdCultivar,
  }
}

// ---------------------------------------------------------------------------
// Drift detection — auto-correct casing/whitespace, warn on mis-pairings
// ---------------------------------------------------------------------------

function normalizeForMatch(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function canonicalizeMacroTerroir(
  country: string | null | undefined,
  macro: string | null | undefined
): { canonical: TerroirRegistryEntry | null; sameCountry: boolean; crossCountry: TerroirRegistryEntry | null } {
  if (!macro) return { canonical: null, sameCountry: false, crossCountry: null }
  const nm = normalizeForMatch(macro)
  const nc = country ? normalizeForMatch(country) : ''
  const sameCountry = TERROIR_REGISTRY.find(
    (t) => normalizeForMatch(t.macro_terroir) === nm && normalizeForMatch(t.country) === nc
  )
  if (sameCountry) return { canonical: sameCountry, sameCountry: true, crossCountry: null }
  const crossCountry = TERROIR_REGISTRY.find((t) => normalizeForMatch(t.macro_terroir) === nm)
  return { canonical: null, sameCountry: false, crossCountry: crossCountry ?? null }
}

export function canonicalizeCultivar(name: string | null | undefined): CultivarRegistryEntry | null {
  if (!name) return null
  const n = normalizeForMatch(name)
  return CULTIVAR_REGISTRY.find((c) => normalizeForMatch(c.cultivar_name) === n) ?? null
}

export interface TerroirDrift {
  kind: 'casing' | 'cross-country' | 'none'
  message?: string
  suggestion?: { country: string; macro_terroir: string; admin_region: string }
}

export interface CultivarDrift {
  kind: 'casing' | 'lineage-mismatch' | 'family-mismatch' | 'none'
  message?: string
  suggestion?: { cultivar_name: string; genetic_family: GeneticFamily; lineage: string }
}

export interface DriftReport {
  terroir: TerroirDrift
  cultivar: CultivarDrift
}

export function detectDrift(payload: BrewPayload): DriftReport {
  const report: DriftReport = { terroir: { kind: 'none' }, cultivar: { kind: 'none' } }

  // --- Terroir ---
  if (payload.terroir?.country && payload.terroir?.macro_terroir) {
    const canon = canonicalizeMacroTerroir(payload.terroir.country, payload.terroir.macro_terroir)
    if (canon.canonical && canon.canonical.macro_terroir !== payload.terroir.macro_terroir) {
      report.terroir = {
        kind: 'casing',
        message: `Canonical spelling is "${canon.canonical.macro_terroir}"`,
        suggestion: canon.canonical,
      }
    } else if (!canon.canonical && canon.crossCountry) {
      report.terroir = {
        kind: 'cross-country',
        message: `"${payload.terroir.macro_terroir}" is canonical for ${canon.crossCountry.country}, not ${payload.terroir.country}. Did you mean a ${payload.terroir.country} terroir, or did you mean ${canon.crossCountry.country}?`,
      }
    }
  }

  // --- Cultivar ---
  if (payload.cultivar?.cultivar_name) {
    const canon = canonicalizeCultivar(payload.cultivar.cultivar_name)
    if (canon) {
      const nameDrift = canon.cultivar_name !== payload.cultivar.cultivar_name
      const lineageDrift =
        !!payload.cultivar.lineage && normalizeForMatch(payload.cultivar.lineage) !== normalizeForMatch(canon.lineage)
      const familyDrift =
        !!payload.cultivar.genetic_family &&
        normalizeForMatch(String(payload.cultivar.genetic_family)) !== normalizeForMatch(canon.genetic_family)

      if (lineageDrift || familyDrift) {
        const parts: string[] = []
        if (lineageDrift)
          parts.push(`lineage should be "${canon.lineage}" (got "${payload.cultivar.lineage}")`)
        if (familyDrift)
          parts.push(`genetic family should be "${canon.genetic_family}" (got "${payload.cultivar.genetic_family}")`)
        report.cultivar = {
          kind: lineageDrift ? 'lineage-mismatch' : 'family-mismatch',
          message: `Known cultivar "${canon.cultivar_name}": ${parts.join('; ')}`,
          suggestion: {
            cultivar_name: canon.cultivar_name,
            genetic_family: canon.genetic_family,
            lineage: canon.lineage,
          },
        }
      } else if (nameDrift) {
        report.cultivar = {
          kind: 'casing',
          message: `Canonical spelling is "${canon.cultivar_name}"`,
          suggestion: {
            cultivar_name: canon.cultivar_name,
            genetic_family: canon.genetic_family,
            lineage: canon.lineage,
          },
        }
      }
    }
  }

  return report
}

// ---------------------------------------------------------------------------
// Deterministic parser for Chris's structured-paste format
// ---------------------------------------------------------------------------

// Supports two input shapes:
//   1. Pipe-delimited recipe line in the order documented in the sprint brief.
//   2. Labeled-prose: "Field Name: value" lines (case-insensitive).
//
// Unlabeled free prose is ignored — Claude-parse is the path for that.

const RECIPE_PIPE_FIELDS = [
  'coffee_name',
  'brewer',
  'filter',
  'dose_g',
  'water_g',
  'grind',
  'extraction_strategy',
  'temp_c',
  'bloom',
  'pour_structure',
  'total_time',
  'aroma',
  'attack',
  'mid_palate',
  'body',
  'finish',
  'temperature_evolution',
  'peak_expression',
  'what_i_learned',
] as const

const LABEL_ALIASES: Record<string, keyof BrewPayload | 'country' | 'admin_region' | 'macro_terroir' | 'meso_terroir' | 'elevation' | 'cultivar_name' | 'genetic_family' | 'lineage' | 'species' | 'extraction_confirmed' | 'flavor_notes' | 'key_takeaways' | 'classification'> = {
  'coffee': 'coffee_name',
  'coffee name': 'coffee_name',
  'name': 'coffee_name',
  'roaster': 'roaster',
  'variety': 'variety',
  'cultivar': 'cultivar_name',
  'cultivar name': 'cultivar_name',
  'species': 'species',
  'genetic family': 'genetic_family',
  'lineage': 'lineage',
  'process': 'process',
  'roast level': 'roast_level',
  'flavor notes': 'flavor_notes',
  'country': 'country',
  'admin region': 'admin_region',
  'region': 'admin_region',
  'macro terroir': 'macro_terroir',
  'meso terroir': 'meso_terroir',
  'elevation': 'elevation',
  'brewer': 'brewer',
  'filter': 'filter',
  'dose': 'dose_g',
  'dose (g)': 'dose_g',
  'water': 'water_g',
  'water (g)': 'water_g',
  'grind': 'grind',
  'temp': 'temp_c',
  'temperature': 'temp_c',
  'bloom': 'bloom',
  'pour structure': 'pour_structure',
  'total time': 'total_time',
  'extraction strategy': 'extraction_strategy',
  'extraction strategy confirmed': 'extraction_confirmed',
  'extraction confirmed': 'extraction_confirmed',
  'aroma': 'aroma',
  'attack': 'attack',
  'mid-palate': 'mid_palate',
  'mid palate': 'mid_palate',
  'body': 'body',
  'finish': 'finish',
  'temperature evolution': 'temperature_evolution',
  'peak expression': 'peak_expression',
  'key takeaways': 'key_takeaways',
  'classification': 'classification',
  'terroir connection': 'terroir_connection',
  'cultivar connection': 'cultivar_connection',
  'what i learned': 'what_i_learned',
  'what i learned from this coffee': 'what_i_learned',
}

function parseNumber(s: string | undefined | null): number | null {
  if (!s) return null
  const m = s.match(/-?\d+(\.\d+)?/)
  if (!m) return null
  const n = parseFloat(m[0])
  return Number.isFinite(n) ? n : null
}

function parseElevation(s: string): { min: number | null; max: number | null } {
  // Handles "1800-2000m", "1800 to 2000", "1800", etc.
  const nums = s.match(/\d+/g)?.map((n) => parseInt(n, 10)).filter((n) => Number.isFinite(n)) || []
  if (nums.length >= 2) return { min: nums[0], max: nums[1] }
  if (nums.length === 1) return { min: nums[0], max: nums[0] }
  return { min: null, max: null }
}

function splitList(s: string): string[] {
  return s
    .split(/[,;•\n]|\s-\s/)
    .map((x) => x.trim().replace(/^[-*•]\s*/, ''))
    .filter(Boolean)
}

// ---------------------------------------------------------------------------
// Tabbed spreadsheet sections (Chris's native workflow)
//
// The user typically pastes 4 header-then-data blocks from Google Sheets:
//   Section 1: Coffee   — Roaster, Coffee Name, Origin, Variety, Process, Producer, Elevation, Roast level, Flavor notes, Link
//   Section 2: Terroir  — Country, Admin Region, Macro Terroir, Meso Terroir, Micro Terroir, Context, Elevation Band, Climate, Soil, Farming Model, Dominant Varieties, Typical Processing, Cup Profile, Acidity Character, Body Character, Why It Stands Out
//   Section 3: Cultivar — Cultivar, Species, Genetic Family, Lineage, + many optional character fields
//   Section 4: Brew     — Coffee Name, Brewer, Filter, Dose, Water, Grind, Extraction Strategy, Temp, Bloom, Pour Structure, Total Time, Aroma, Attack, Mid-Palate, Body, Finish, Temperature Evolution, Peak Expression, What I learned from this coffee, Extraction Strategy Confirmed
//
// Each block is one header row + one data row, tab-separated. Blocks are
// separated by blank lines. Columns are matched by normalized header name.
// ---------------------------------------------------------------------------

const TAB_HEADER_ALIASES: Record<string, string> = {
  // Coffee block
  'roaster': 'coffee.roaster',
  'coffee name': 'coffee.coffee_name',
  'origin': 'coffee.origin',
  'variety': 'coffee.variety',
  'process': 'coffee.process',
  'producer': 'coffee.producer',
  'elevation': 'coffee.elevation',
  'roast level': 'coffee.roast_level',
  'flavor notes': 'coffee.flavor_notes',
  'flavor notes (primary)': 'coffee.flavor_notes',
  'link': 'coffee.link',
  // Terroir block
  'country': 'terroir.country',
  'admin region': 'terroir.admin_region',
  'macro terroir': 'terroir.macro_terroir',
  'meso terroir': 'terroir.meso_terroir',
  'micro terroir': 'terroir.micro_terroir',
  'context': 'terroir.context',
  'elevation band': 'terroir.elevation_band',
  'climate': 'terroir.climate_stress',
  'soil': 'terroir.soil',
  'farming model': 'terroir.farming_model',
  'dominant varieties': 'terroir.dominant_varieties',
  'typical processing': 'terroir.typical_processing',
  'cup profile': 'terroir.cup_profile',
  'acidity character': 'terroir.acidity_character',
  'body character': 'terroir.body_character',
  'why it stands out': 'terroir.why_it_stands_out',
  // Cultivar block
  'cultivar': 'cultivar.cultivar_name',
  'species': 'cultivar.species',
  'genetic family': 'cultivar.genetic_family',
  'lineage': 'cultivar.lineage',
  // Brew block
  'brewer': 'brew.brewer',
  'filter': 'brew.filter',
  'dose': 'brew.dose_g',
  'water': 'brew.water_g',
  'grind': 'brew.grind',
  'extraction strategy': 'brew.extraction_strategy',
  'temp': 'brew.temp_c',
  'bloom': 'brew.bloom',
  'pour structure': 'brew.pour_structure',
  'total time': 'brew.total_time',
  'aroma': 'brew.aroma',
  'attack': 'brew.attack',
  'mid-palate': 'brew.mid_palate',
  'mid palate': 'brew.mid_palate',
  'body': 'brew.body',
  'finish': 'brew.finish',
  'temperature evolution': 'brew.temperature_evolution',
  'peak expression': 'brew.peak_expression',
  'what i learned': 'brew.what_i_learned',
  'what i learned from this coffee': 'brew.what_i_learned',
  'extraction strategy confirmed': 'brew.extraction_confirmed',
}

function normalizeHeader(h: string): string {
  return h.toLowerCase().trim().replace(/\s+/g, ' ')
}

function splitRatio(s: string): { dose?: number; water?: number } {
  // Handles "18g", "288g (1:16)", "250"
  const nums = s.match(/\d+(\.\d+)?/g)?.map(parseFloat) || []
  if (nums.length === 0) return {}
  return { dose: undefined, water: nums[0] }
}

// Parse a single labeled tab-separated block (header row + data row).
// Returns a flat map of canonical dotted keys → string value.
function parseTabBlock(headerLine: string, dataLine: string): Record<string, string> {
  const headers = headerLine.split('\t').map((h) => normalizeHeader(h))
  const values = dataLine.split('\t').map((v) => v.trim())
  const out: Record<string, string> = {}
  headers.forEach((h, i) => {
    if (!h || !values[i]) return
    const alias = TAB_HEADER_ALIASES[h]
    if (!alias) return
    // If a key already has a value (e.g. "Coffee Name" appears in both Coffee
    // and Brew blocks), prefer the richer/longer version — brew block tends to
    // have the full descriptive name like "Colibri Finca La Reserva Gesha..."
    const existing = out[alias]
    if (!existing || values[i].length > existing.length) {
      out[alias] = values[i]
    }
  })
  return out
}

// Detect tabbed-section blocks in the paste. Returns merged dotted-key map
// if at least one Coffee/Terroir/Cultivar/Brew block is recognized, else null.
function parseTabbedSections(text: string): Record<string, string> | null {
  const lines = text.split('\n')
  const merged: Record<string, string> = {}
  let anyBlock = false

  // Walk lines, looking for a tab-containing header that we recognize, then
  // pair it with the next non-empty tab-containing line as data.
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line.includes('\t')) continue
    const headers = line.split('\t').map((h) => normalizeHeader(h))
    const recognizedCount = headers.filter((h) => TAB_HEADER_ALIASES[h]).length
    // Need at least 2 recognized headers to treat this as a spreadsheet header row
    if (recognizedCount < 2) continue

    // Find next non-empty line that also has tabs
    let j = i + 1
    while (j < lines.length && (!lines[j].trim() || !lines[j].includes('\t'))) j++
    if (j >= lines.length) continue

    const block = parseTabBlock(line, lines[j])
    Object.assign(merged, block)
    anyBlock = true
    i = j // skip past data row
  }

  return anyBlock ? merged : null
}

// Merge a dotted-key map into a partial BrewPayload.
function applyTabbedBlock(out: Partial<BrewPayload>, t: TerroirCandidate, c: CultivarCandidate, map: Record<string, string>): void {
  const num = (s: string | undefined): number | null => (s ? parseNumber(s) : null)

  for (const [key, raw] of Object.entries(map)) {
    const value = raw.trim()
    if (!value) continue
    switch (key) {
      // --- Coffee ---
      case 'coffee.roaster':
        out.roaster = value
        break
      case 'coffee.producer':
        out.producer = value
        break
      case 'coffee.coffee_name':
        // Only set from the Coffee block if Brew block didn't already set it
        if (!out.coffee_name) out.coffee_name = value
        break
      case 'coffee.origin':
        // Origin is free prose like "Ciudad Bolívar, Antioquia, Colombia"; don't overwrite terroir fields
        break
      case 'coffee.variety':
        out.variety = value
        if (!c.cultivar_name) c.cultivar_name = value
        break
      case 'coffee.process':
        out.process = value
        break
      case 'coffee.elevation': {
        const { min, max } = parseElevation(value)
        if (min !== null && t.elevation_min == null) t.elevation_min = min
        if (max !== null && t.elevation_max == null) t.elevation_max = max
        break
      }
      case 'coffee.roast_level':
        // "Balanced Intensity" in the Coffee block actually maps to extraction strategy,
        // not roast level (roast level is Light/Medium/Dark). Treat it as extraction_strategy
        // if it matches one of the canonical strategies.
        if (EXTRACTION_STRATEGIES.includes(value as ExtractionStrategy)) {
          out.extraction_strategy = value as ExtractionStrategy
        } else {
          // Canonicalize via ROAST_LEVEL_LOOKUP. Historical-import-tolerant —
          // warn on drift but pass through if truly unresolvable so legacy
          // paste blocks don't silently drop data.
          const canonical = ROAST_LEVEL_LOOKUP.canonicalize(value)
          if (canonical && canonical !== value) {
            console.warn(`[brew-import] roast_level drift: "${value}" → "${canonical}"`)
          }
          out.roast_level = canonical ?? value
        }
        break
      case 'coffee.flavor_notes':
        out.flavor_notes = splitList(value)
        break
      // --- Terroir ---
      case 'terroir.country':
        t.country = value
        break
      case 'terroir.admin_region':
        t.admin_region = value
        break
      case 'terroir.macro_terroir':
        t.macro_terroir = value
        break
      case 'terroir.meso_terroir':
        t.meso_terroir = value
        break
      case 'terroir.climate_stress':
        t.climate_stress = value
        break
      case 'terroir.elevation_band': {
        const { min, max } = parseElevation(value)
        if (min !== null) t.elevation_min = min
        if (max !== null) t.elevation_max = max
        break
      }
      // --- Cultivar ---
      case 'cultivar.cultivar_name':
        c.cultivar_name = value
        break
      case 'cultivar.species':
        c.species = value
        break
      case 'cultivar.genetic_family':
        c.genetic_family = value
        break
      case 'cultivar.lineage':
        c.lineage = value
        break
      // --- Brew ---
      case 'brew.brewer':
        out.brewer = value
        break
      case 'brew.filter':
        out.filter = value
        break
      case 'brew.dose_g':
        out.dose_g = num(value)
        break
      case 'brew.water_g': {
        // "288g (1:16)" → extract first number
        const n = num(value)
        if (n !== null) out.water_g = n
        // Capture ratio if present
        const rm = value.match(/1\s*:\s*(\d+(?:\.\d+)?)/)
        if (rm) out.ratio = `1:${rm[1]}`
        break
      }
      case 'brew.grind':
        out.grind = value
        break
      case 'brew.extraction_strategy':
        // Only take canonical values; otherwise ignore
        if (EXTRACTION_STRATEGIES.includes(value as ExtractionStrategy)) {
          out.extraction_strategy = value as ExtractionStrategy
        } else {
          out.extraction_strategy = value
        }
        break
      case 'brew.temp_c':
        out.temp_c = num(value)
        break
      case 'brew.bloom':
        out.bloom = value
        break
      case 'brew.pour_structure':
        out.pour_structure = value
        break
      case 'brew.total_time':
        out.total_time = value
        break
      case 'brew.aroma':
        out.aroma = value
        break
      case 'brew.attack':
        out.attack = value
        break
      case 'brew.mid_palate':
        out.mid_palate = value
        break
      case 'brew.body':
        out.body = value
        break
      case 'brew.finish':
        out.finish = value
        break
      case 'brew.temperature_evolution':
        out.temperature_evolution = value
        break
      case 'brew.peak_expression':
        out.peak_expression = value
        break
      case 'brew.what_i_learned':
        out.what_i_learned = value
        break
      case 'brew.extraction_confirmed':
        out.extraction_confirmed = value
        // If extraction_strategy wasn't set and this is a canonical strategy name, use it
        if (!out.extraction_strategy && EXTRACTION_STRATEGIES.includes(value as ExtractionStrategy)) {
          out.extraction_strategy = value as ExtractionStrategy
        }
        break
    }
  }
}

export function parseSpreadsheetRow(text: string): Partial<BrewPayload> | null {
  if (!text || !text.trim()) return null

  const out: Partial<BrewPayload> = {}
  const terroir: TerroirCandidate = { country: '' }
  const cultivar: CultivarCandidate = { cultivar_name: '' }

  // 0. Try tabbed spreadsheet sections first (Chris's native workflow)
  const tabbed = parseTabbedSections(text)
  if (tabbed) {
    applyTabbedBlock(out, terroir, cultivar, tabbed)
  }

  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)

  // 1. Try pipe-delimited recipe line on the FIRST line that contains >=5 pipes
  const pipeLineIdx = lines.findIndex((l) => (l.match(/\|/g) || []).length >= 5)
  if (pipeLineIdx >= 0) {
    const parts = lines[pipeLineIdx].split('|').map((p) => p.trim())
    parts.forEach((val, i) => {
      if (!val) return
      const key = RECIPE_PIPE_FIELDS[i]
      if (!key) return
      if (key === 'dose_g' || key === 'water_g' || key === 'temp_c') {
        const n = parseNumber(val)
        if (n !== null) (out as any)[key] = n
      } else {
        ;(out as any)[key] = val
      }
    })
  }

  // 2. Labeled prose: "Label: value"
  for (const line of lines) {
    const m = line.match(/^([A-Za-z][A-Za-z 0-9()-]+?):\s*(.+)$/)
    if (!m) continue
    const labelRaw = m[1].trim().toLowerCase()
    const value = m[2].trim()
    const key = LABEL_ALIASES[labelRaw]
    if (!key) continue

    switch (key) {
      case 'country':
        terroir.country = value
        break
      case 'admin_region':
        terroir.admin_region = value
        break
      case 'macro_terroir':
        terroir.macro_terroir = value
        break
      case 'meso_terroir':
        terroir.meso_terroir = value
        break
      case 'elevation': {
        const { min, max } = parseElevation(value)
        terroir.elevation_min = min
        terroir.elevation_max = max
        break
      }
      case 'cultivar_name':
        cultivar.cultivar_name = value
        break
      case 'species':
        cultivar.species = value
        break
      case 'genetic_family':
        cultivar.genetic_family = value
        break
      case 'lineage':
        cultivar.lineage = value
        break
      case 'flavor_notes':
        out.flavor_notes = splitList(value)
        break
      case 'key_takeaways':
        out.key_takeaways = splitList(value)
        break
      case 'dose_g':
      case 'water_g':
      case 'temp_c': {
        const n = parseNumber(value)
        if (n !== null) (out as any)[key] = n
        break
      }
      case 'is_process_dominant':
        out.is_process_dominant = /^(yes|true|1)$/i.test(value)
        break
      default:
        ;(out as any)[key] = value
    }
  }

  // Variety fallback → cultivar_name
  if (!cultivar.cultivar_name && out.variety) {
    cultivar.cultivar_name = out.variety
  }

  if (terroir.country) out.terroir = terroir
  if (cultivar.cultivar_name) out.cultivar = cultivar

  // If we got nothing useful at all, return null so callers can fall back to Claude parse
  if (!out.coffee_name && !out.brewer && !out.terroir && !out.cultivar) return null
  return out
}
