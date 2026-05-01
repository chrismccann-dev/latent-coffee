// Roast import / persist helpers (Sprint 2.5).
//
// Mirrors `lib/brew-import.ts` but covers the roasting domain entities:
//   - green_beans (top-level entity; FK target for everything below)
//   - roasts (per-batch roast log; FK to green_beans)
//   - cuppings (per-roast cupping evaluation; FK to roasts)
//   - experiments (per-bean experiment set; FK to green_beans)
//   - roast_learnings (one-per-bean compiled lessons row; FK to green_beans)
//
// Each entity has a `*Payload` input type, a `validate*Payload` returning
// `ValidationResult`, and a `persist*` returning a discriminated `PersistResult`.
//
// Reuses existing helpers from `lib/brew-import.ts`:
//   - findOrCreateTerroir / findOrCreateCultivar (FK resolution for green_beans)
//   - findOrCreateProducer (canonicalize producer text)

import type { SupabaseClient } from '@supabase/supabase-js'
import {
  findOrCreateTerroir,
  findOrCreateCultivar,
  findOrCreateProducer,
  type TerroirCandidate,
  type CultivarCandidate,
} from '@/lib/brew-import'

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

// Local validation type — name-shadows brew-import's `ValidationResult` export
// to avoid namespace collisions if both modules are imported in the same file.
type ValidationResult = { ok: true } | { ok: false; errors: string[] }

export type PersistOk<TIdField extends string> = {
  ok: true
} & Record<TIdField, string>

export type PersistFail =
  | { ok: false; code: 'validation'; errors: string[] }
  | { ok: false; code: 'db_error'; message: string }

// ---------------------------------------------------------------------------
// Green beans
// ---------------------------------------------------------------------------

export interface GreenBeanPayload {
  // Identity (required)
  lot_id: string
  name: string
  // Origin / FK targets — terroir + cultivar fields use the same shape as brews
  terroir?: TerroirCandidate | null
  cultivar?: CultivarCandidate | null
  // Origin / free-text fallbacks (kept on the row even when terroir/cultivar
  // FKs resolve, since green_beans has its own legacy origin/region/variety
  // columns that pre-date the FK joins)
  origin?: string | null
  region?: string | null
  variety?: string | null
  process?: string | null
  // Provenance
  producer?: string | null
  producer_override?: boolean
  importer?: string | null
  seller?: string | null
  exporter?: string | null
  source_type?: string | null
  link?: string | null
  // Lot economics
  purchase_date?: string | null
  price_per_kg?: number | null
  quantity_g?: number | null
  // Bean specs
  moisture?: string | null
  density?: string | null
  elevation_m?: number | null
  // Notes
  producer_tasting_notes?: string | null
  additional_notes?: string | null
  // Roest cross-ref
  roest_inventory_id?: number | null
}

export type PersistGreenBeanResult =
  | (PersistOk<'green_bean_id'> & {
      terroir_id: string | null
      cultivar_id: string | null
    })
  | PersistFail

export function validateGreenBeanPayload(p: GreenBeanPayload): ValidationResult {
  const errors: string[] = []
  if (!p.lot_id?.trim()) errors.push('lot_id is required')
  if (!p.name?.trim()) errors.push('name is required')
  if (p.terroir && !p.terroir.country?.trim()) {
    errors.push('terroir.country is required when terroir is set')
  }
  if (p.cultivar && !p.cultivar.cultivar_name?.trim()) {
    errors.push('cultivar.cultivar_name is required when cultivar is set')
  }
  if (p.elevation_m != null && (p.elevation_m < 0 || p.elevation_m > 5000)) {
    errors.push(`elevation_m out of range (0-5000m), got ${p.elevation_m}`)
  }
  return errors.length ? { ok: false, errors } : { ok: true }
}

export async function persistGreenBean(
  supabase: SupabaseClient,
  userId: string,
  payload: GreenBeanPayload,
): Promise<PersistGreenBeanResult> {
  const v = validateGreenBeanPayload(payload)
  if (!v.ok) return { ok: false, code: 'validation', errors: v.errors }

  // Producer canonicalization (text-only, allowOverride pattern same as brews)
  let canonicalProducer: string | null = null
  if (payload.producer?.trim()) {
    const pr = findOrCreateProducer(payload.producer, {
      allowOverride: payload.producer_override === true,
    })
    if (!pr.ok) return { ok: false, code: 'validation', errors: [pr.error] }
    canonicalProducer = pr.canonicalName
  }

  // Terroir + cultivar FK resolution (lazy find-or-create).
  // findOrCreateTerroir takes scalar args (country, macro, admin?, meso?),
  // not the candidate object. findOrCreateCultivar takes the name string.
  let terroirId: string | null = null
  let cultivarId: string | null = null

  if (payload.terroir) {
    const tr = await findOrCreateTerroir(
      supabase,
      userId,
      payload.terroir.country,
      payload.terroir.macro_terroir,
      payload.terroir.admin_region,
      payload.terroir.meso_terroir,
    )
    if (!tr.ok) {
      const code = tr.status === 400 ? 'validation' : 'db_error'
      return code === 'validation'
        ? { ok: false, code: 'validation', errors: [tr.error] }
        : { ok: false, code: 'db_error', message: tr.error }
    }
    terroirId = tr.id
  }
  if (payload.cultivar?.cultivar_name) {
    const cr = await findOrCreateCultivar(supabase, userId, payload.cultivar.cultivar_name)
    if (!cr.ok) {
      const code = cr.status === 400 ? 'validation' : 'db_error'
      return code === 'validation'
        ? { ok: false, code: 'validation', errors: [cr.error] }
        : { ok: false, code: 'db_error', message: cr.error }
    }
    cultivarId = cr.id
  }

  const insert = {
    user_id: userId,
    lot_id: payload.lot_id,
    name: payload.name,
    producer: canonicalProducer,
    origin: payload.origin ?? null,
    region: payload.region ?? null,
    variety: payload.variety ?? null,
    process: payload.process ?? null,
    importer: payload.importer ?? null,
    seller: payload.seller ?? null,
    exporter: payload.exporter ?? null,
    source_type: payload.source_type ?? null,
    link: payload.link ?? null,
    purchase_date: payload.purchase_date ?? null,
    price_per_kg: payload.price_per_kg ?? null,
    quantity_g: payload.quantity_g ?? null,
    moisture: payload.moisture ?? null,
    density: payload.density ?? null,
    elevation_m: payload.elevation_m ?? null,
    producer_tasting_notes: payload.producer_tasting_notes ?? null,
    additional_notes: payload.additional_notes ?? null,
    roest_inventory_id: payload.roest_inventory_id ?? null,
    terroir_id: terroirId,
    cultivar_id: cultivarId,
  }

  const { data, error } = await supabase
    .from('green_beans')
    .insert(insert)
    .select('id')
    .single()
  if (error || !data) {
    return { ok: false, code: 'db_error', message: error?.message ?? 'no row returned' }
  }
  return {
    ok: true,
    green_bean_id: data.id as string,
    terroir_id: terroirId,
    cultivar_id: cultivarId,
  }
}

// ---------------------------------------------------------------------------
// Roasts
// ---------------------------------------------------------------------------

export interface RoastPayload {
  // FK + identity (required)
  green_bean_id: string
  batch_id: string
  // Provenance / context
  roast_date?: string | null
  coffee_name?: string | null
  profile_link?: string | null
  drum_direction?: string | null
  // Mass + color
  batch_size_g?: number | null
  roasted_weight_g?: number | null
  weight_loss_pct?: number | null
  agtron?: number | null
  color_description?: string | null
  // Times (mm:ss)
  yellowing_time?: string | null
  fc_start?: string | null
  drop_time?: string | null
  // Temps + dev
  charge_temp?: number | null
  fc_temp?: number | null
  drop_temp?: number | null
  dev_time_s?: number | null
  dev_ratio?: string | null
  // Sprint 2.5 enrichments (V4-derived)
  roast_profile_name?: string | null
  tp_time?: string | null
  tp_temp?: number | null
  yellowing_temp?: number | null
  hopper_load_temp?: number | null
  fan_curve?: string | null
  inlet_curve?: string | null
  roest_log_id?: number | null
  // Prose (Chris-authored)
  what_worked?: string | null
  what_didnt?: string | null
  what_to_change?: string | null
  worth_repeating?: boolean | null
  is_reference?: boolean | null
}

export type PersistRoastResult = PersistOk<'roast_id'> | PersistFail

export function validateRoastPayload(p: RoastPayload): ValidationResult {
  const errors: string[] = []
  if (!p.green_bean_id?.trim()) errors.push('green_bean_id is required')
  if (!p.batch_id?.trim()) errors.push('batch_id is required')
  return errors.length ? { ok: false, errors } : { ok: true }
}

export async function persistRoast(
  supabase: SupabaseClient,
  userId: string,
  payload: RoastPayload,
): Promise<PersistRoastResult> {
  const v = validateRoastPayload(payload)
  if (!v.ok) return { ok: false, code: 'validation', errors: v.errors }
  const { data, error } = await supabase
    .from('roasts')
    .insert({
      user_id: userId,
      green_bean_id: payload.green_bean_id,
      batch_id: payload.batch_id,
      roast_date: payload.roast_date ?? null,
      coffee_name: payload.coffee_name ?? null,
      profile_link: payload.profile_link ?? null,
      drum_direction: payload.drum_direction ?? null,
      batch_size_g: payload.batch_size_g ?? null,
      roasted_weight_g: payload.roasted_weight_g ?? null,
      weight_loss_pct: payload.weight_loss_pct ?? null,
      agtron: payload.agtron ?? null,
      color_description: payload.color_description ?? null,
      yellowing_time: payload.yellowing_time ?? null,
      fc_start: payload.fc_start ?? null,
      drop_time: payload.drop_time ?? null,
      charge_temp: payload.charge_temp ?? null,
      fc_temp: payload.fc_temp ?? null,
      drop_temp: payload.drop_temp ?? null,
      dev_time_s: payload.dev_time_s ?? null,
      dev_ratio: payload.dev_ratio ?? null,
      roast_profile_name: payload.roast_profile_name ?? null,
      tp_time: payload.tp_time ?? null,
      tp_temp: payload.tp_temp ?? null,
      yellowing_temp: payload.yellowing_temp ?? null,
      hopper_load_temp: payload.hopper_load_temp ?? null,
      fan_curve: payload.fan_curve ?? null,
      inlet_curve: payload.inlet_curve ?? null,
      roest_log_id: payload.roest_log_id ?? null,
      what_worked: payload.what_worked ?? null,
      what_didnt: payload.what_didnt ?? null,
      what_to_change: payload.what_to_change ?? null,
      worth_repeating: payload.worth_repeating ?? null,
      is_reference: payload.is_reference ?? false,
    })
    .select('id')
    .single()
  if (error || !data) {
    return { ok: false, code: 'db_error', message: error?.message ?? 'no row returned' }
  }
  return { ok: true, roast_id: data.id as string }
}

// ---------------------------------------------------------------------------
// Cuppings
// ---------------------------------------------------------------------------

export interface CuppingPayload {
  roast_id: string
  cupping_date?: string | null
  rest_days?: number | null
  eval_method?: string | null
  ground_agtron?: number | null
  ground_color_description?: string | null
  aroma?: string | null
  flavor?: string | null
  acidity?: string | null
  body?: string | null
  finish?: string | null
  overall?: string | null
}

export type PersistCuppingResult = PersistOk<'cupping_id'> | PersistFail

export function validateCuppingPayload(p: CuppingPayload): ValidationResult {
  const errors: string[] = []
  if (!p.roast_id?.trim()) errors.push('roast_id is required')
  return errors.length ? { ok: false, errors } : { ok: true }
}

export async function persistCupping(
  supabase: SupabaseClient,
  userId: string,
  payload: CuppingPayload,
): Promise<PersistCuppingResult> {
  const v = validateCuppingPayload(payload)
  if (!v.ok) return { ok: false, code: 'validation', errors: v.errors }
  const { data, error } = await supabase
    .from('cuppings')
    .insert({
      user_id: userId,
      roast_id: payload.roast_id,
      cupping_date: payload.cupping_date ?? null,
      rest_days: payload.rest_days ?? null,
      eval_method: payload.eval_method ?? null,
      ground_agtron: payload.ground_agtron ?? null,
      ground_color_description: payload.ground_color_description ?? null,
      aroma: payload.aroma ?? null,
      flavor: payload.flavor ?? null,
      acidity: payload.acidity ?? null,
      body: payload.body ?? null,
      finish: payload.finish ?? null,
      overall: payload.overall ?? null,
    })
    .select('id')
    .single()
  if (error || !data) {
    return { ok: false, code: 'db_error', message: error?.message ?? 'no row returned' }
  }
  return { ok: true, cupping_id: data.id as string }
}

// ---------------------------------------------------------------------------
// Experiments — UPSERT on (user_id, green_bean_id, experiment_id)
// ---------------------------------------------------------------------------

export interface ExperimentPayload {
  green_bean_id: string
  experiment_id: string
  batch_ids?: string | null
  context?: string | null
  primary_question?: string | null
  control_baseline?: string | null
  shared_constants?: string | null
  variable_changed?: string | null
  levels_tested?: string | null
  expected_outcomes?: string | null
  failure_boundary?: string | null
  observed_outcome_a?: string | null
  observed_outcome_b?: string | null
  observed_outcome_c?: string | null
  observed_outcome_d?: string | null
  winner?: string | null
  key_insight?: string | null
  what_changes_going_forward?: string | null
}

export type PersistExperimentResult =
  | (PersistOk<'experiment_pk'> & { created: boolean })
  | PersistFail

export function validateExperimentPayload(p: ExperimentPayload): ValidationResult {
  const errors: string[] = []
  if (!p.green_bean_id?.trim()) errors.push('green_bean_id is required')
  if (!p.experiment_id?.trim()) errors.push('experiment_id is required')
  return errors.length ? { ok: false, errors } : { ok: true }
}

export async function persistExperiment(
  supabase: SupabaseClient,
  userId: string,
  payload: ExperimentPayload,
): Promise<PersistExperimentResult> {
  const v = validateExperimentPayload(payload)
  if (!v.ok) return { ok: false, code: 'validation', errors: v.errors }

  // Find existing row to determine create-vs-update before upsert.
  const { data: existing, error: lookupErr } = await supabase
    .from('experiments')
    .select('id')
    .eq('user_id', userId)
    .eq('green_bean_id', payload.green_bean_id)
    .eq('experiment_id', payload.experiment_id)
    .maybeSingle()
  if (lookupErr) return { ok: false, code: 'db_error', message: lookupErr.message }
  const created = !existing

  const row = {
    user_id: userId,
    green_bean_id: payload.green_bean_id,
    experiment_id: payload.experiment_id,
    batch_ids: payload.batch_ids ?? null,
    context: payload.context ?? null,
    primary_question: payload.primary_question ?? null,
    control_baseline: payload.control_baseline ?? null,
    shared_constants: payload.shared_constants ?? null,
    variable_changed: payload.variable_changed ?? null,
    levels_tested: payload.levels_tested ?? null,
    expected_outcomes: payload.expected_outcomes ?? null,
    failure_boundary: payload.failure_boundary ?? null,
    observed_outcome_a: payload.observed_outcome_a ?? null,
    observed_outcome_b: payload.observed_outcome_b ?? null,
    observed_outcome_c: payload.observed_outcome_c ?? null,
    observed_outcome_d: payload.observed_outcome_d ?? null,
    winner: payload.winner ?? null,
    key_insight: payload.key_insight ?? null,
    what_changes_going_forward: payload.what_changes_going_forward ?? null,
  }

  if (created) {
    const { data, error } = await supabase.from('experiments').insert(row).select('id').single()
    if (error || !data) {
      return { ok: false, code: 'db_error', message: error?.message ?? 'no row returned' }
    }
    return { ok: true, experiment_pk: data.id as string, created: true }
  } else {
    const { data, error } = await supabase
      .from('experiments')
      .update(row)
      .eq('id', existing.id)
      .select('id')
      .single()
    if (error || !data) {
      return { ok: false, code: 'db_error', message: error?.message ?? 'no row returned' }
    }
    return { ok: true, experiment_pk: data.id as string, created: false }
  }
}

// ---------------------------------------------------------------------------
// Roast learnings — UPSERT on (user_id, green_bean_id)
// ---------------------------------------------------------------------------

export interface RoastLearningsPayload {
  green_bean_id: string
  best_batch_id?: string | null
  why_this_roast_won?: string | null
  aromatic_behavior?: string | null
  structural_behavior?: string | null
  elasticity?: string | null
  roast_window_width?: string | null
  primary_lever?: string | null
  secondary_levers?: string | null
  what_didnt_move_needle?: string | null
  underdevelopment_signal?: string | null
  overdevelopment_signal?: string | null
  cultivar_takeaway?: string | null
  general_takeaway?: string | null
  reference_roasts?: string | null
  starting_hypothesis?: string | null
  rest_behavior?: string | null
}

export type PersistRoastLearningsResult =
  | (PersistOk<'roast_learnings_id'> & { created: boolean })
  | PersistFail

export function validateRoastLearningsPayload(p: RoastLearningsPayload): ValidationResult {
  const errors: string[] = []
  if (!p.green_bean_id?.trim()) errors.push('green_bean_id is required')
  return errors.length ? { ok: false, errors } : { ok: true }
}

export async function persistRoastLearnings(
  supabase: SupabaseClient,
  userId: string,
  payload: RoastLearningsPayload,
): Promise<PersistRoastLearningsResult> {
  const v = validateRoastLearningsPayload(payload)
  if (!v.ok) return { ok: false, code: 'validation', errors: v.errors }

  const { data: existing, error: lookupErr } = await supabase
    .from('roast_learnings')
    .select('id')
    .eq('user_id', userId)
    .eq('green_bean_id', payload.green_bean_id)
    .maybeSingle()
  if (lookupErr) return { ok: false, code: 'db_error', message: lookupErr.message }
  const created = !existing

  const row = {
    user_id: userId,
    green_bean_id: payload.green_bean_id,
    best_batch_id: payload.best_batch_id ?? null,
    why_this_roast_won: payload.why_this_roast_won ?? null,
    aromatic_behavior: payload.aromatic_behavior ?? null,
    structural_behavior: payload.structural_behavior ?? null,
    elasticity: payload.elasticity ?? null,
    roast_window_width: payload.roast_window_width ?? null,
    primary_lever: payload.primary_lever ?? null,
    secondary_levers: payload.secondary_levers ?? null,
    what_didnt_move_needle: payload.what_didnt_move_needle ?? null,
    underdevelopment_signal: payload.underdevelopment_signal ?? null,
    overdevelopment_signal: payload.overdevelopment_signal ?? null,
    cultivar_takeaway: payload.cultivar_takeaway ?? null,
    general_takeaway: payload.general_takeaway ?? null,
    reference_roasts: payload.reference_roasts ?? null,
    starting_hypothesis: payload.starting_hypothesis ?? null,
    rest_behavior: payload.rest_behavior ?? null,
  }

  if (created) {
    const { data, error } = await supabase.from('roast_learnings').insert(row).select('id').single()
    if (error || !data) {
      return { ok: false, code: 'db_error', message: error?.message ?? 'no row returned' }
    }
    return { ok: true, roast_learnings_id: data.id as string, created: true }
  } else {
    const { data, error } = await supabase
      .from('roast_learnings')
      .update(row)
      .eq('id', existing.id)
      .select('id')
      .single()
    if (error || !data) {
      return { ok: false, code: 'db_error', message: error?.message ?? 'no row returned' }
    }
    return { ok: true, roast_learnings_id: data.id as string, created: false }
  }
}
