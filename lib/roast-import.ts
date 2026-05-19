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
import { fireQueueInserts, type QueuedEntry } from '@/lib/taxonomy-queue'

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
  // Workflow class (migration 054). True for single-batch sample lots
  // (~100-120g, no iteration possible). Routes through one-shot.md +
  // one-shot-closeout.md instead of the 4-prompt V-set pipeline. See
  // CONTEXT.md "One-shot lot" entry.
  is_one_shot?: boolean | null
}

export type PersistGreenBeanResult =
  | (PersistOk<'green_bean_id'> & {
      terroir_id: string | null
      cultivar_id: string | null
      // true on fresh INSERT, false when an existing (user_id, lot_id) row was
      // returned. Mirrors persistRoastLearnings + persistExperiment shape.
      created: boolean
      // Phase 3 — Site A queue echoes for net-new producer_override values.
      queued_for_taxonomy_review: QueuedEntry[]
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

  // UPSERT semantics on (user_id, lot_id). Mirrors persistRoastLearnings +
  // persistExperiment find-then-insert-or-skip pattern. MCP feedback batch 3
  // (2026-05-01) — the prior INSERT-only behavior threw a Postgres unique-
  // constraint violation on retry-after-crash with no recovery path. The
  // dog-food caller had no way to recover the existing green_bean_id.
  //
  // Idempotency choice: when a row already exists for (user_id, lot_id), we
  // return the existing row's IDs WITHOUT updating fields. The retry case is
  // "I lost track of the ID", not "I want to update fields" — accidentally
  // overwriting a curated row with a re-pushed payload would silently destroy
  // data. If the caller wants to update fields on an existing row, use the
  // app's /add or /edit UI (or a future patch_green_bean Tool).
  const { data: existing, error: lookupErr } = await supabase
    .from('green_beans')
    .select('id, terroir_id, cultivar_id')
    .eq('user_id', userId)
    .eq('lot_id', payload.lot_id)
    .maybeSingle()
  if (lookupErr) return { ok: false, code: 'db_error', message: lookupErr.message }

  if (existing) {
    return {
      ok: true,
      green_bean_id: existing.id as string,
      terroir_id: (existing.terroir_id as string | null) ?? null,
      cultivar_id: (existing.cultivar_id as string | null) ?? null,
      created: false,
      queued_for_taxonomy_review: [],
    }
  }

  // Producer canonicalization (text-only, allowOverride pattern same as brews)
  let canonicalProducer: string | null = null
  let producerNeedsQueue = false
  if (payload.producer?.trim()) {
    const pr = findOrCreateProducer(payload.producer, {
      allowOverride: payload.producer_override === true,
    })
    if (!pr.ok) return { ok: false, code: 'validation', errors: [pr.error] }
    canonicalProducer = pr.canonicalName
    producerNeedsQueue = pr.needsQueue
  }

  // Terroir + cultivar FK resolution (lazy find-or-create).
  // findOrCreateTerroir takes scalar args (country, macro, admin?, meso?),
  // not the candidate object. findOrCreateCultivar takes the name string.
  let terroirId: string | null = null
  let cultivarId: string | null = null
  let createdTerroir = false
  let createdCultivar = false

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
    createdTerroir = tr.created
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
    createdCultivar = cr.created
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
    // Phase 3 — provenance flags. 'auto_created' when this push materialized
    // the FK row. Surfaces in get_green_bean.
    terroir_provenance: createdTerroir ? 'auto_created' : 'canonical',
    cultivar_provenance: createdCultivar ? 'auto_created' : 'canonical',
    // Migration 054 — workflow class flag (default false at SQL level; explicit
    // override via payload).
    is_one_shot: payload.is_one_shot ?? false,
  }

  const { data, error } = await supabase
    .from('green_beans')
    .insert(insert)
    .select('id')
    .single()
  if (error || !data) {
    return { ok: false, code: 'db_error', message: error?.message ?? 'no row returned' }
  }

  // Phase 3 — Site A queue inserts for producer_override:true on a value that
  // didn't resolve canonically. Best-effort post-insert.
  const queued = await fireQueueInserts(
    supabase,
    userId,
    [{ axis: 'producer', raw_value: canonicalProducer, needsQueue: producerNeedsQueue }],
    { kind: 'green_bean', id: data.id as string },
  )

  return {
    ok: true,
    green_bean_id: data.id as string,
    terroir_id: terroirId,
    cultivar_id: cultivarId,
    created: true,
    queued_for_taxonomy_review: queued,
  }
}

// ---------------------------------------------------------------------------
// Green bean lookup (read-only — supports get_green_bean Tool)
// ---------------------------------------------------------------------------

export interface LookupGreenBeanFilter {
  lot_id?: string
  roest_inventory_id?: number
  green_bean_id?: string
}

export type GreenBeanRow = {
  id: string
  lot_id: string
  name: string
  producer: string | null
  origin: string | null
  region: string | null
  variety: string | null
  process: string | null
  importer: string | null
  seller: string | null
  exporter: string | null
  source_type: string | null
  link: string | null
  purchase_date: string | null
  price_per_kg: number | null
  quantity_g: number | null
  moisture: string | null
  density: string | null
  elevation_m: number | null
  producer_tasting_notes: string | null
  additional_notes: string | null
  roest_inventory_id: number | null
  terroir_id: string | null
  cultivar_id: string | null
  // Phase 3 (migration 045): provenance + re-resolution timestamp on FK fields.
  terroir_provenance: 'canonical' | 'auto_created'
  cultivar_provenance: 'canonical' | 'auto_created'
  canonicals_updated_at: string | null
  created_at: string
}

export type LookupGreenBeanResult =
  | { ok: true; row: GreenBeanRow }
  | { ok: false; code: 'validation'; errors: string[] }
  | { ok: false; code: 'not_found'; message: string }
  | { ok: false; code: 'db_error'; message: string }

export async function lookupGreenBean(
  supabase: SupabaseClient,
  userId: string,
  filter: LookupGreenBeanFilter,
): Promise<LookupGreenBeanResult> {
  // At least one filter must be provided. We validate up-front so the SELECT
  // doesn't accidentally return ALL of the user's beans on an empty filter.
  const errors: string[] = []
  if (!filter.lot_id && !filter.roest_inventory_id && !filter.green_bean_id) {
    errors.push('At least one of lot_id, roest_inventory_id, or green_bean_id is required.')
  }
  if (errors.length) return { ok: false, code: 'validation', errors }

  let q = supabase
    .from('green_beans')
    .select(
      'id, lot_id, name, producer, origin, region, variety, process, importer, seller, exporter, source_type, link, purchase_date, price_per_kg, quantity_g, moisture, density, elevation_m, producer_tasting_notes, additional_notes, roest_inventory_id, terroir_id, cultivar_id, terroir_provenance, cultivar_provenance, canonicals_updated_at, created_at',
    )
    .eq('user_id', userId)
  if (filter.lot_id) q = q.eq('lot_id', filter.lot_id)
  if (filter.roest_inventory_id != null) q = q.eq('roest_inventory_id', filter.roest_inventory_id)
  if (filter.green_bean_id) q = q.eq('id', filter.green_bean_id)

  const { data, error } = await q.maybeSingle()
  if (error) return { ok: false, code: 'db_error', message: error.message }
  if (!data) {
    const filterDesc = [
      filter.lot_id ? `lot_id="${filter.lot_id}"` : null,
      filter.roest_inventory_id != null ? `roest_inventory_id=${filter.roest_inventory_id}` : null,
      filter.green_bean_id ? `green_bean_id="${filter.green_bean_id}"` : null,
    ]
      .filter((s): s is string => s != null)
      .join(' + ')
    return {
      ok: false,
      code: 'not_found',
      message: `No green_bean found matching ${filterDesc}.`,
    }
  }
  return { ok: true, row: data as GreenBeanRow }
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
  // Phase 2 additions (#R57 / #R58 / #R61)
  roest_notes?: string | null
  end_condition_type?: 'bean_temp' | 'dev_time' | 'manual' | null
  end_condition_target?: number | null
  fc_total_cracks?: number | null
  // Sprint 11 (migration 061, 2026-05-20): RO-CP-3 4-value FC audibility enum.
  // audible / subtle / silent / ambiguous. See CONTEXT.md § FC audibility state.
  fc_audibility?: 'audible' | 'subtle' | 'silent' | 'ambiguous' | null
  // Prose (Chris-authored). worth_repeating accepts boolean for back-compat;
  // coerced to 'yes'/'no'/'pending' tristate on write per migration 044.
  what_worked?: string | null
  what_didnt?: string | null
  what_to_change?: string | null
  worth_repeating?: boolean | 'yes' | 'no' | 'pending' | null
  is_reference?: boolean | null
  // Schema sprint S2 (migration 056, 2026-05-18): forward-looking quality flag
  // during V-set iteration. Decoupled from is_reference (lot-level final) and
  // worth_repeating (judgment axis).
  is_reference_candidate?: boolean | null
  // Sub Pages 6.1 (migration 052, 2026-05-13): FK to roast_recipes — design
  // intent this roast executed. Phase 2 of docs/roasting/redesign.md § 7
  // expects new roasts to set this when pushed alongside a fresh recipe.
  recipe_id?: string | null
}

export type PersistRoastResult =
  | (PersistOk<'roast_id'> & {
      // true on fresh INSERT, false when an existing (user_id, green_bean_id,
      // batch_id) row was returned. Mirrors persistGreenBean / persistExperiment
      // / persistRoastLearnings shape.
      created: boolean
      // Soft-issue signals from the write path. Currently surfaces #R66 orphan
      // reconciliation hint (roest_log_id supplied + parent green_bean has NULL
      // roest_inventory_id). Empty by default.
      warnings: string[]
    })
  | PersistFail

// Coerce worth_repeating boolean → tristate text per migration 044. Pass-through
// for already-canonical strings; null stays null.
function coerceWorthRepeating(
  v: boolean | 'yes' | 'no' | 'pending' | null | undefined,
): 'yes' | 'no' | 'pending' | null {
  if (v == null) return null
  if (v === true) return 'yes'
  if (v === false) return 'no'
  return v
}

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

  // UPSERT semantics on (user_id, green_bean_id, batch_id). MCP feedback
  // batch 4 (2026-05-01) — same retry-after-crash failure mode that bit
  // push_green_bean before PR #77's UPSERT fix. Without this, push_roast
  // throws a Postgres unique-constraint violation on retry with no recovery
  // path, blocking Stage 4 cuppings (which need roast_id per batch).
  //
  // Idempotency choice mirrors persistGreenBean: when a row exists, return
  // the existing roast_id with `created: false` WITHOUT updating fields. If
  // the caller wants to update prose / curves on an existing batch, they
  // should use the app /add or /edit UI (or a future patch_roast Tool).
  const warnings: string[] = []

  const { data: existing, error: lookupErr } = await supabase
    .from('roasts')
    .select('id')
    .eq('user_id', userId)
    .eq('green_bean_id', payload.green_bean_id)
    .eq('batch_id', payload.batch_id)
    .maybeSingle()
  if (lookupErr) return { ok: false, code: 'db_error', message: lookupErr.message }

  if (existing) {
    return { ok: true, roast_id: existing.id as string, created: false, warnings }
  }

  // Phase 2 #R66 — orphan reconciliation hint. When the new roast carries a
  // roest_log_id but the parent green_bean has no roest_inventory_id, the FK
  // is silently disconnected. Bean 4 case: bean was pushed before Roest had
  // ingested it; the reconciliation later required a manual patch_green_bean.
  // We don't auto-mutate green_beans from a roast write (read-tool semantics)
  // but we surface the gap so the caller can patch_green_bean to close it.
  if (payload.roest_log_id != null) {
    const { data: parentBean, error: parentErr } = await supabase
      .from('green_beans')
      .select('roest_inventory_id')
      .eq('user_id', userId)
      .eq('id', payload.green_bean_id)
      .maybeSingle()
    if (!parentErr && parentBean && parentBean.roest_inventory_id == null) {
      warnings.push(
        `green_bean ${payload.green_bean_id} has roest_inventory_id=NULL but this roast carries roest_log_id=${payload.roest_log_id}. ` +
          'Consider patch_green_bean({green_bean_id, roest_inventory_id: <id>}) to backfill the FK so future pull_roest_log calls map cleanly.',
      )
    }
  }

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
      // Phase 2 additions (#R57 / #R58 / #R61 / #R62)
      roest_notes: payload.roest_notes ?? null,
      end_condition_type: payload.end_condition_type ?? null,
      end_condition_target: payload.end_condition_target ?? null,
      fc_total_cracks: payload.fc_total_cracks ?? null,
      // Sprint 11 (migration 061, 2026-05-20): RO-CP-3.
      fc_audibility: payload.fc_audibility ?? null,
      what_worked: payload.what_worked ?? null,
      what_didnt: payload.what_didnt ?? null,
      what_to_change: payload.what_to_change ?? null,
      worth_repeating: coerceWorthRepeating(payload.worth_repeating),
      is_reference: payload.is_reference ?? false,
      // Schema sprint S2 (migration 056): forward-looking candidate flag.
      is_reference_candidate: payload.is_reference_candidate ?? false,
      // Sub Pages 6.1 (migration 052): nullable FK to roast_recipes.
      recipe_id: payload.recipe_id ?? null,
    })
    .select('id')
    .single()
  if (error || !data) {
    return { ok: false, code: 'db_error', message: error?.message ?? 'no row returned' }
  }
  return { ok: true, roast_id: data.id as string, created: true, warnings }
}

// ---------------------------------------------------------------------------
// Cuppings
// ---------------------------------------------------------------------------

export interface CuppingPayload {
  roast_id: string
  cupping_date?: string | null
  rest_days?: number | null
  eval_method?: string | null
  // recipe_variant added MCP feedback batch 8 (migration 041). Free-text label
  // distinguishing two evaluations on the same (roast_id, cupping_date,
  // eval_method) - the dual-cupping workflow (e.g. xbloom-gate + Balanced-
  // Intensity pourover on the same Day 7). NULL = "single cupping per
  // method/date" (back-compat default; UPSERT idempotency preserved via
  // PG 17 NULLS NOT DISTINCT).
  recipe_variant?: string | null
  ground_agtron?: number | null
  ground_color_description?: string | null
  aroma?: string | null
  flavor?: string | null
  acidity?: string | null
  // Migration 046 (2026-05-07): distinct prose axis from acidity / body.
  // Surfaced via MCP in Schema sprint S3 (2026-05-18).
  sweetness?: string | null
  body?: string | null
  finish?: string | null
  overall?: string | null
  // Migration 046: parallel to brews.temperature_evolution — direction / when /
  // what changes prose across the cooling arc.
  temperature_behavior?: string | null
  // Schema sprint S1 (migration 055, 2026-05-18): explicit wb_agtron override
  // for the rare post-hoc re-measurement case. NULL or omitted = auto-populate
  // from joined roasts.agtron at insert time. wb_to_ground_delta is a
  // generated column; do NOT pass it on the payload.
  wb_agtron?: number | null
  // Sprint 11 (migration 062, 2026-05-20): two prose axes relocated from
  // roast_learnings per ADR-0008. They describe what a cup IS (per-tasting
  // observation), not what a lot TAUGHT.
  aromatic_behavior?: string | null
  structural_behavior?: string | null
}

export type PersistCuppingResult =
  | (PersistOk<'cupping_id'> & {
      // true on fresh INSERT, false when an existing row matched on
      // (user_id, roast_id, cupping_date, eval_method) was returned.
      // Mirrors persistGreenBean / persistRoast / persistExperiment /
      // persistRoastLearnings idempotency shape.
      created: boolean
    })
  | PersistFail

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

  // UPSERT on (user_id, roast_id, cupping_date, eval_method) per the DB unique
  // constraint cuppings_user_roast_date_method_unique. Mirrors persistRoast +
  // persistGreenBean + persistExperiment + persistRoastLearnings find-then-
  // insert-or-skip pattern. MCP feedback batch 6 (2026-05-02) — the prior
  // INSERT-only behavior threw a duplicate-constraint error on idempotent
  // re-syncs (e.g. mid-iteration prompt re-run), forcing the caller to track
  // what's already pushed via get_bean_pipeline. With UPSERT semantics the
  // re-push is harmless.
  //
  // Idempotency choice: on conflict we return the existing cupping_id with
  // `created: false` WITHOUT updating fields. Same rationale as #R9 / #R13 /
  // #R20 — the retry case is "I lost track of what's pushed", not "I want to
  // overwrite curated tasting notes." If the caller wants to update fields,
  // use the app /add or /edit UI (or a future patch_cupping Tool).
  //
  // The composite key includes 3 nullable fields (cupping_date, eval_method,
  // recipe_variant). The DB constraint uses PG 17 NULLS NOT DISTINCT so NULL
  // matches NULL on uniqueness — the lookup mirrors that semantic via
  // .is(null) for each null payload value. recipe_variant added migration 041
  // (MCP feedback batch 8) for the dual-cupping workflow.
  let lookup = supabase
    .from('cuppings')
    .select('id')
    .eq('user_id', userId)
    .eq('roast_id', payload.roast_id)
  lookup =
    payload.cupping_date != null
      ? lookup.eq('cupping_date', payload.cupping_date)
      : lookup.is('cupping_date', null)
  lookup =
    payload.eval_method != null
      ? lookup.eq('eval_method', payload.eval_method)
      : lookup.is('eval_method', null)
  lookup =
    payload.recipe_variant != null
      ? lookup.eq('recipe_variant', payload.recipe_variant)
      : lookup.is('recipe_variant', null)
  const { data: existing, error: lookupErr } = await lookup.maybeSingle()
  if (lookupErr) return { ok: false, code: 'db_error', message: lookupErr.message }

  if (existing) {
    return { ok: true, cupping_id: existing.id as string, created: false }
  }

  // Schema sprint S1 (migration 055, 2026-05-18): snapshot roasts.agtron into
  // cuppings.wb_agtron at insert time so the generated wb_to_ground_delta
  // column populates. Explicit payload override wins; otherwise join roast.
  let wbAgtron = payload.wb_agtron ?? null
  if (wbAgtron == null) {
    const { data: parentRoast } = await supabase
      .from('roasts')
      .select('agtron')
      .eq('user_id', userId)
      .eq('id', payload.roast_id)
      .maybeSingle()
    if (parentRoast && typeof parentRoast.agtron === 'number') {
      wbAgtron = parentRoast.agtron
    }
  }

  const { data, error } = await supabase
    .from('cuppings')
    .insert({
      user_id: userId,
      roast_id: payload.roast_id,
      cupping_date: payload.cupping_date ?? null,
      rest_days: payload.rest_days ?? null,
      eval_method: payload.eval_method ?? null,
      recipe_variant: payload.recipe_variant ?? null,
      ground_agtron: payload.ground_agtron ?? null,
      ground_color_description: payload.ground_color_description ?? null,
      aroma: payload.aroma ?? null,
      flavor: payload.flavor ?? null,
      acidity: payload.acidity ?? null,
      sweetness: payload.sweetness ?? null,
      body: payload.body ?? null,
      finish: payload.finish ?? null,
      overall: payload.overall ?? null,
      temperature_behavior: payload.temperature_behavior ?? null,
      wb_agtron: wbAgtron,
      // Sprint 11 (migration 062, 2026-05-20): RO-6 character relocation.
      aromatic_behavior: payload.aromatic_behavior ?? null,
      structural_behavior: payload.structural_behavior ?? null,
    })
    .select('id')
    .single()
  if (error || !data) {
    return { ok: false, code: 'db_error', message: error?.message ?? 'no row returned' }
  }
  return { ok: true, cupping_id: data.id as string, created: true }
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
  // Migration 050 (Round-4 dogfood): three free-text additions for prose that
  // didn't fit the structured slots. confidence is "Low" | "Medium" |
  // "Medium-High" | "High" - validated at the MCP edge via z.enum, plain text
  // in DB so the canonical set can relax without another migration.
  additional_notes?: string | null
  open_questions?: string | null
  key_insight_confidence?: string | null
  // Sub Pages 6.1 (migration 052, 2026-05-13): 16 cross-batch fields covering
  // the four temporal write moments of the iterative roasting workflow. See
  // docs/roasting/redesign.md § 4.2 for the rationale. All nullable; only
  // populated as the lot progresses (set immediately after roast, then after
  // cupping). Legacy expected_outcomes + observed_outcome_a-d stay populated
  // through Phase 3.
  updated_cup_prediction_a?: string | null
  updated_cup_prediction_b?: string | null
  updated_cup_prediction_c?: string | null
  updated_cup_prediction_d?: string | null
  taste_for_a?: string | null
  taste_for_b?: string | null
  taste_for_c?: string | null
  taste_for_d?: string | null
  delta_from_roast_a?: string | null
  delta_from_roast_b?: string | null
  delta_from_roast_c?: string | null
  delta_from_roast_d?: string | null
  delta_from_cup_a?: string | null
  delta_from_cup_b?: string | null
  delta_from_cup_c?: string | null
  delta_from_cup_d?: string | null
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
    additional_notes: payload.additional_notes ?? null,
    open_questions: payload.open_questions ?? null,
    key_insight_confidence: payload.key_insight_confidence ?? null,
    // Sub Pages 6.1 (migration 052): 16 cross-batch fields.
    updated_cup_prediction_a: payload.updated_cup_prediction_a ?? null,
    updated_cup_prediction_b: payload.updated_cup_prediction_b ?? null,
    updated_cup_prediction_c: payload.updated_cup_prediction_c ?? null,
    updated_cup_prediction_d: payload.updated_cup_prediction_d ?? null,
    taste_for_a: payload.taste_for_a ?? null,
    taste_for_b: payload.taste_for_b ?? null,
    taste_for_c: payload.taste_for_c ?? null,
    taste_for_d: payload.taste_for_d ?? null,
    delta_from_roast_a: payload.delta_from_roast_a ?? null,
    delta_from_roast_b: payload.delta_from_roast_b ?? null,
    delta_from_roast_c: payload.delta_from_roast_c ?? null,
    delta_from_roast_d: payload.delta_from_roast_d ?? null,
    delta_from_cup_a: payload.delta_from_cup_a ?? null,
    delta_from_cup_b: payload.delta_from_cup_b ?? null,
    delta_from_cup_c: payload.delta_from_cup_c ?? null,
    delta_from_cup_d: payload.delta_from_cup_d ?? null,
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
  // Legacy free-text identifier (e.g. "133", "Batch 139"). Kept populated
  // through Phase 3 of the roasting-redesign migration. New writes should
  // prefer best_roast_id (typed FK) below; this column stays for back-compat.
  best_batch_id?: string | null
  // Sub Pages 6.1 (migration 052, 2026-05-13): typed FK to the winning roast
  // execution. Per docs/roasting/redesign.md § 9.3 the reference is a roast
  // execution, not a recipe design intent.
  best_roast_id?: string | null
  why_this_roast_won?: string | null
  // Sprint 11 (migration 062, 2026-05-20): aromatic_behavior + structural_behavior
  // relocated to cuppings per ADR-0008.
  brewing_tolerance?: string | null
  roast_window_width?: string | null
  primary_lever?: string | null
  secondary_levers?: string | null
  what_didnt_move_needle?: string | null
  underdevelopment_signal?: string | null
  overdevelopment_signal?: string | null
  cultivar_takeaway?: string | null
  terroir_takeaway?: string | null
  general_takeaway?: string | null
  reference_roasts?: string | null
  starting_hypothesis?: string | null
  rest_behavior?: string | null
  // Sprint 12 (migration 064, 2026-05-21): per-field scope_tags arrays.
  // See ADR-0009. Loose-canonical prefix convention; write paths do NOT enforce.
  cultivar_takeaway_scope_tags?: string[] | null
  terroir_takeaway_scope_tags?: string[] | null
  general_takeaway_scope_tags?: string[] | null
  starting_hypothesis_scope_tags?: string[] | null
}

export type PersistRoastLearningsResult =
  | (PersistOk<'roast_learnings_id'> & { created: boolean })
  | PersistFail

export function validateRoastLearningsPayload(p: RoastLearningsPayload): ValidationResult {
  const errors: string[] = []
  if (!p.green_bean_id?.trim()) errors.push('green_bean_id is required')
  return errors.length ? { ok: false, errors } : { ok: true }
}

// One-shot lot constraint (migration 054, 2026-05-15). Lever-attribution fields
// on roast_learnings require cross-batch evidence (variable→lever promotion
// across V_n slots). One-shot lots (N=1, green_beans.is_one_shot=true) cannot
// populate them — the cup-quality observation is anchored on a single roast
// without comparative variance. Writing them on a one-shot contaminates the
// carry-forward pipeline that future start-lot.md / one-shot.md runs consume.
// Enforced Node-side here; the MCP server is the canonical writer per
// feedback_mcp_only_input.md.
//
// See docs/sprints/one-shot-lot-framework-kickoff.md for the sprint scope +
// CONTEXT.md "One-shot lot" entry for the workflow framing.
const ONE_SHOT_FORBIDDEN_FIELDS = [
  'primary_lever',
  'secondary_levers',
  'roast_window_width',
  'brewing_tolerance',
  'what_didnt_move_needle',
  'underdevelopment_signal',
  'overdevelopment_signal',
] as const

async function checkOneShotConstraint(
  supabase: SupabaseClient,
  userId: string,
  green_bean_id: string,
  fields: Partial<Record<(typeof ONE_SHOT_FORBIDDEN_FIELDS)[number], string | null | undefined>>,
): Promise<ValidationResult> {
  const populated = ONE_SHOT_FORBIDDEN_FIELDS.filter((f) => {
    const v = fields[f]
    return typeof v === 'string' && v.trim().length > 0
  })
  if (populated.length === 0) return { ok: true }

  const { data, error } = await supabase
    .from('green_beans')
    .select('is_one_shot')
    .eq('id', green_bean_id)
    .eq('user_id', userId)
    .maybeSingle()
  if (error) return { ok: false, errors: [`green_beans lookup failed: ${error.message}`] }
  if (!data) return { ok: false, errors: [`green_bean ${green_bean_id} not found`] }
  if (!data.is_one_shot) return { ok: true }

  return {
    ok: false,
    errors: populated.map(
      (f) =>
        `Field "${f}" requires cross-batch evidence (variable→lever attribution). One-shot lots (N=1) cannot populate this field. Move the prose to additional_notes on the experiment row, or to cultivar_takeaway / general_takeaway / starting_hypothesis with explicit "Low confidence - N=1, verify on next similar lot" prefix.`,
    ),
  }
}

export async function persistRoastLearnings(
  supabase: SupabaseClient,
  userId: string,
  payload: RoastLearningsPayload,
): Promise<PersistRoastLearningsResult> {
  const v = validateRoastLearningsPayload(payload)
  if (!v.ok) return { ok: false, code: 'validation', errors: v.errors }

  const oneShot = await checkOneShotConstraint(supabase, userId, payload.green_bean_id, payload)
  if (!oneShot.ok) return { ok: false, code: 'validation', errors: oneShot.errors }

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
    // Sub Pages 6.1 (migration 052): typed FK reference; coexists with text.
    best_roast_id: payload.best_roast_id ?? null,
    why_this_roast_won: payload.why_this_roast_won ?? null,
    brewing_tolerance: payload.brewing_tolerance ?? null,
    roast_window_width: payload.roast_window_width ?? null,
    primary_lever: payload.primary_lever ?? null,
    secondary_levers: payload.secondary_levers ?? null,
    what_didnt_move_needle: payload.what_didnt_move_needle ?? null,
    underdevelopment_signal: payload.underdevelopment_signal ?? null,
    overdevelopment_signal: payload.overdevelopment_signal ?? null,
    cultivar_takeaway: payload.cultivar_takeaway ?? null,
    terroir_takeaway: payload.terroir_takeaway ?? null,
    general_takeaway: payload.general_takeaway ?? null,
    reference_roasts: payload.reference_roasts ?? null,
    starting_hypothesis: payload.starting_hypothesis ?? null,
    rest_behavior: payload.rest_behavior ?? null,
    // Sprint 12 (migration 064): per-field scope_tags arrays. NOT NULL in DB
    // with default '{}'::text[] — explicit empty array when caller omits.
    cultivar_takeaway_scope_tags: payload.cultivar_takeaway_scope_tags ?? [],
    terroir_takeaway_scope_tags: payload.terroir_takeaway_scope_tags ?? [],
    general_takeaway_scope_tags: payload.general_takeaway_scope_tags ?? [],
    starting_hypothesis_scope_tags: payload.starting_hypothesis_scope_tags ?? [],
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

// ---------------------------------------------------------------------------
// Patch helpers (Sprint 2.6) — field-level mutation Tools
//
// One helper per push_* sibling. Each:
//   1. Looks up row by key (PK for most; composite for cupping per plan).
//   2. Returns `not_found` when no row matches.
//   3. Builds an UPDATE patch from supplied fields ONLY (key-in-payload check,
//      NOT `?? null` — that would clear unsupplied fields).
//   4. UPDATE + return the updated row's id.
//
// Terroir + cultivar updates on green_beans route through Sprint 2.6's strict
// findOrCreate* helpers (same path as persistGreenBean).
// ---------------------------------------------------------------------------

export type PatchResult<TIdField extends string> =
  | ({ ok: true } & Record<TIdField, string>)
  | { ok: false; code: 'validation'; errors: string[] }
  | { ok: false; code: 'no_op'; message: string }
  | { ok: false; code: 'not_found'; message: string }
  | { ok: false; code: 'db_error'; message: string }

// Build a Postgres UPDATE patch from a Partial<T> by including only keys that
// are PRESENT in the payload (using `in` operator so explicit `null` clears
// the field but `undefined` / missing leaves it unchanged).
function buildPatchObject<T extends object>(
  payload: Partial<T>,
  allowedKeys: readonly (keyof T)[],
): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const key of allowedKeys) {
    if (key in payload) out[key as string] = payload[key]
  }
  return out
}

// ---- patchGreenBean ------------------------------------------------------

export interface PatchGreenBeanPayload {
  green_bean_id: string
  // Re-routable through findOrCreate* on Sprint 2.6 strict-canonical path.
  terroir?: TerroirCandidate | null
  cultivar?: CultivarCandidate | null
  // Producer canonicalize (with override)
  producer?: string | null
  producer_override?: boolean
  // Pass-through fields (mirror GreenBeanPayload, all optional)
  lot_id?: string
  name?: string
  origin?: string | null
  region?: string | null
  variety?: string | null
  process?: string | null
  importer?: string | null
  seller?: string | null
  exporter?: string | null
  source_type?: string | null
  link?: string | null
  purchase_date?: string | null
  price_per_kg?: number | null
  quantity_g?: number | null
  moisture?: string | null
  density?: string | null
  elevation_m?: number | null
  producer_tasting_notes?: string | null
  additional_notes?: string | null
  roest_inventory_id?: number | null
  // Migration 054 — workflow class flag, patchable for retroactive flagging
  // (Rancho Tio backfill case + future post-intake reclassification).
  is_one_shot?: boolean | null
}

export const GREEN_BEAN_PATCH_FIELDS = [
  'lot_id', 'name', 'origin', 'region', 'variety', 'process',
  'importer', 'seller', 'exporter', 'source_type', 'link',
  'purchase_date', 'price_per_kg', 'quantity_g',
  'moisture', 'density', 'elevation_m',
  'producer_tasting_notes', 'additional_notes', 'roest_inventory_id',
  // Migration 054
  'is_one_shot',
] as const

export async function patchGreenBean(
  supabase: SupabaseClient,
  userId: string,
  payload: PatchGreenBeanPayload,
): Promise<PatchResult<'green_bean_id'>> {
  if (!payload.green_bean_id?.trim()) {
    return { ok: false, code: 'validation', errors: ['green_bean_id is required'] }
  }

  const { data: existing, error: lookupErr } = await supabase
    .from('green_beans')
    .select('id, terroir_id, cultivar_id')
    .eq('user_id', userId)
    .eq('id', payload.green_bean_id)
    .maybeSingle()
  if (lookupErr) return { ok: false, code: 'db_error', message: lookupErr.message }
  if (!existing) {
    return { ok: false, code: 'not_found', message: `green_bean "${payload.green_bean_id}" not found` }
  }

  const errors: string[] = []
  const patch = buildPatchObject(payload, GREEN_BEAN_PATCH_FIELDS)

  // Producer canonicalize (text-only, allowOverride).
  if ('producer' in payload) {
    if (payload.producer == null || (typeof payload.producer === 'string' && !payload.producer.trim())) {
      patch.producer = null
    } else {
      const pr = findOrCreateProducer(payload.producer, { allowOverride: payload.producer_override === true })
      if (!pr.ok) errors.push(pr.error)
      else patch.producer = pr.canonicalName
    }
  }

  // Terroir / cultivar — re-resolve via Sprint 2.6 strict findOrCreate*.
  // Round-7 dogfood (2026-05-12): when terroir_id or cultivar_id actually
  // CHANGES vs. the existing row, bump canonicals_updated_at so cross-session
  // FK drift is visible. Don't bump on a no-op re-resolution (same id back).
  let canonicalsChanged = false
  if ('terroir' in payload && payload.terroir) {
    const tr = await findOrCreateTerroir(
      supabase,
      userId,
      payload.terroir.country,
      payload.terroir.macro_terroir,
      payload.terroir.admin_region,
      payload.terroir.meso_terroir,
    )
    if (!tr.ok) errors.push(tr.error)
    else {
      patch.terroir_id = tr.id
      if (tr.id !== (existing.terroir_id ?? null)) canonicalsChanged = true
    }
  }
  if ('cultivar' in payload && payload.cultivar?.cultivar_name) {
    const cr = await findOrCreateCultivar(supabase, userId, payload.cultivar.cultivar_name)
    if (!cr.ok) errors.push(cr.error)
    else {
      patch.cultivar_id = cr.id
      if (cr.id !== (existing.cultivar_id ?? null)) canonicalsChanged = true
    }
  }
  if (canonicalsChanged) {
    patch.canonicals_updated_at = new Date().toISOString()
  }

  if (errors.length > 0) return { ok: false, code: 'validation', errors }
  if (Object.keys(patch).length === 0) {
    return { ok: false, code: 'no_op', message: 'no editable fields supplied' }
  }

  const { data, error } = await supabase
    .from('green_beans')
    .update(patch)
    .eq('id', payload.green_bean_id)
    .eq('user_id', userId)
    .select('id')
    .single()
  if (error || !data) {
    return { ok: false, code: 'db_error', message: error?.message || 'green_bean update failed' }
  }
  return { ok: true, green_bean_id: data.id as string }
}

// ---- patchRoast ----------------------------------------------------------

export interface PatchRoastPayload extends Partial<Omit<RoastPayload, 'green_bean_id' | 'batch_id'>> {
  roast_id: string
  // green_bean_id + batch_id are the UPSERT key on push_roast; technically
  // patchable here but rarely useful. Allow them through for completeness.
  green_bean_id?: string
  batch_id?: string
}

export const ROAST_PATCH_FIELDS = [
  'green_bean_id', 'batch_id',
  'roast_date', 'coffee_name', 'profile_link', 'drum_direction',
  'batch_size_g', 'roasted_weight_g', 'weight_loss_pct', 'agtron', 'color_description',
  'yellowing_time', 'fc_start', 'drop_time',
  'charge_temp', 'fc_temp', 'drop_temp', 'dev_time_s', 'dev_ratio',
  'roast_profile_name', 'tp_time', 'tp_temp', 'yellowing_temp', 'hopper_load_temp',
  'fan_curve', 'inlet_curve', 'roest_log_id',
  // Phase 2 (#R57 / #R58 / #R61)
  'roest_notes', 'end_condition_type', 'end_condition_target', 'fc_total_cracks',
  // Sprint 11 (migration 061, 2026-05-20): RO-CP-3
  'fc_audibility',
  'what_worked', 'what_didnt', 'what_to_change', 'worth_repeating', 'is_reference',
  // Schema sprint S2 (migration 056, 2026-05-18)
  'is_reference_candidate',
  // Sub Pages 6.1 (migration 052)
  'recipe_id',
] as const

export async function patchRoast(
  supabase: SupabaseClient,
  userId: string,
  payload: PatchRoastPayload,
): Promise<PatchResult<'roast_id'>> {
  if (!payload.roast_id?.trim()) {
    return { ok: false, code: 'validation', errors: ['roast_id is required'] }
  }

  const { data: existing, error: lookupErr } = await supabase
    .from('roasts')
    .select('id')
    .eq('user_id', userId)
    .eq('id', payload.roast_id)
    .maybeSingle()
  if (lookupErr) return { ok: false, code: 'db_error', message: lookupErr.message }
  if (!existing) {
    return { ok: false, code: 'not_found', message: `roast "${payload.roast_id}" not found` }
  }

  const patch = buildPatchObject(payload, ROAST_PATCH_FIELDS)
  // Phase 2 (#R62) — coerce worth_repeating boolean → tristate text. Caller may
  // pass true/false from pre-migration-044 codepaths; the column check
  // constraint rejects boolean now.
  if ('worth_repeating' in patch) {
    patch.worth_repeating = coerceWorthRepeating(
      patch.worth_repeating as boolean | 'yes' | 'no' | 'pending' | null,
    )
  }
  if (Object.keys(patch).length === 0) {
    return { ok: false, code: 'no_op', message: 'no editable fields supplied' }
  }

  const { data, error } = await supabase
    .from('roasts')
    .update(patch)
    .eq('id', payload.roast_id)
    .eq('user_id', userId)
    .select('id')
    .single()
  if (error || !data) {
    return { ok: false, code: 'db_error', message: error?.message || 'roast update failed' }
  }
  return { ok: true, roast_id: data.id as string }
}

// ---- patchCupping --------------------------------------------------------

// Module-level so the MCP Tool can import + compute updated_fields echo.
export const CUPPING_PATCH_FIELDS = [
  'cupping_date', 'rest_days', 'eval_method', 'recipe_variant',
  'ground_agtron', 'ground_color_description',
  'aroma', 'flavor', 'acidity', 'body', 'finish', 'overall',
  // Migration 046 (2026-05-07): two prose axes added at schema layer; reachable
  // via MCP in Schema sprint S3 (2026-05-18).
  'sweetness', 'temperature_behavior',
  // Sprint 11 (migration 062, 2026-05-20): RO-6 character relocation from
  // roast_learnings per ADR-0008.
  'aromatic_behavior', 'structural_behavior',
  // Schema sprint S1 (migration 055, 2026-05-18): explicit override for
  // post-hoc Agtron re-measurement. wb_to_ground_delta is a generated column,
  // NOT patchable.
  'wb_agtron',
] as const

// patch_cupping uses the migration-041 composite key for lookup
// (roast_id, cupping_date, eval_method, recipe_variant) with NULLS NOT
// DISTINCT semantics so NULL fields match NULL fields. Mirrors persistCupping's
// composite-key UPSERT lookup. Patching fields that are part of the key is
// allowed (the lookup matches OLD state, UPDATE writes NEW state).
export interface PatchCuppingPayload extends Partial<Omit<CuppingPayload, 'roast_id'>> {
  // Composite-key lookup fields (required to identify the row)
  roast_id: string
  cupping_date: string | null
  eval_method: string | null
  recipe_variant: string | null
  // Optional patch fields override the composite-key fields above when also
  // supplied as new values. To CHANGE recipe_variant from null → "xbloom_gate",
  // pass `recipe_variant: null` (lookup) and `new_recipe_variant: "xbloom_gate"`.
  // Or accept the simpler shape: lookup by old key, patch overwrites whatever
  // new fields are present. For now, the patch fields share names — passing
  // recipe_variant updates the field; lookup uses the SAME values. If you want
  // to change the key, do it via raw SQL or split into delete+re-push.
}

export async function patchCupping(
  supabase: SupabaseClient,
  userId: string,
  payload: PatchCuppingPayload,
): Promise<PatchResult<'cupping_id'>> {
  if (!payload.roast_id?.trim()) {
    return { ok: false, code: 'validation', errors: ['roast_id is required'] }
  }

  // Composite-key lookup with NULLS NOT DISTINCT semantics.
  let lookup = supabase
    .from('cuppings')
    .select('id')
    .eq('user_id', userId)
    .eq('roast_id', payload.roast_id)
  lookup = payload.cupping_date != null
    ? lookup.eq('cupping_date', payload.cupping_date)
    : lookup.is('cupping_date', null)
  lookup = payload.eval_method != null
    ? lookup.eq('eval_method', payload.eval_method)
    : lookup.is('eval_method', null)
  lookup = payload.recipe_variant != null
    ? lookup.eq('recipe_variant', payload.recipe_variant)
    : lookup.is('recipe_variant', null)
  const { data: existing, error: lookupErr } = await lookup.maybeSingle()
  if (lookupErr) return { ok: false, code: 'db_error', message: lookupErr.message }
  if (!existing) {
    const desc = `(roast_id="${payload.roast_id}", cupping_date=${payload.cupping_date ?? 'NULL'}, eval_method=${payload.eval_method ?? 'NULL'}, recipe_variant=${payload.recipe_variant ?? 'NULL'})`
    return { ok: false, code: 'not_found', message: `cupping ${desc} not found` }
  }

  // Patchable fields — every cuppings column EXCEPT the lookup key. The key
  // fields can technically be changed by patching them too (lookup matches old,
  // update writes new), but this is rare; document via tool description.
  const patch = buildPatchObject(payload, CUPPING_PATCH_FIELDS)
  if (Object.keys(patch).length === 0) {
    return { ok: false, code: 'no_op', message: 'no editable fields supplied' }
  }

  const { data, error } = await supabase
    .from('cuppings')
    .update(patch)
    .eq('id', existing.id)
    .eq('user_id', userId)
    .select('id')
    .single()
  if (error || !data) {
    return { ok: false, code: 'db_error', message: error?.message || 'cupping update failed' }
  }
  return { ok: true, cupping_id: data.id as string }
}

// ---- patchExperiment -----------------------------------------------------

export interface PatchExperimentPayload extends Partial<Omit<ExperimentPayload, 'green_bean_id' | 'experiment_id'>> {
  experiment_pk: string
  // green_bean_id + experiment_id are the UPSERT key on push_experiment;
  // patchable here for completeness (e.g. fix a typo in experiment_id).
  green_bean_id?: string
  experiment_id?: string
}

export const EXPERIMENT_PATCH_FIELDS = [
  'green_bean_id', 'experiment_id', 'batch_ids',
  'context', 'primary_question', 'control_baseline', 'shared_constants',
  'variable_changed', 'levels_tested', 'expected_outcomes', 'failure_boundary',
  'observed_outcome_a', 'observed_outcome_b', 'observed_outcome_c', 'observed_outcome_d',
  'winner', 'key_insight', 'what_changes_going_forward',
  'additional_notes', 'open_questions', 'key_insight_confidence',
  // Sub Pages 6.1 (migration 052): 16 cross-batch fields.
  'updated_cup_prediction_a', 'updated_cup_prediction_b', 'updated_cup_prediction_c', 'updated_cup_prediction_d',
  'taste_for_a', 'taste_for_b', 'taste_for_c', 'taste_for_d',
  'delta_from_roast_a', 'delta_from_roast_b', 'delta_from_roast_c', 'delta_from_roast_d',
  'delta_from_cup_a', 'delta_from_cup_b', 'delta_from_cup_c', 'delta_from_cup_d',
] as const

export async function patchExperiment(
  supabase: SupabaseClient,
  userId: string,
  payload: PatchExperimentPayload,
): Promise<PatchResult<'experiment_pk'>> {
  if (!payload.experiment_pk?.trim()) {
    return { ok: false, code: 'validation', errors: ['experiment_pk is required'] }
  }

  const { data: existing, error: lookupErr } = await supabase
    .from('experiments')
    .select('id')
    .eq('user_id', userId)
    .eq('id', payload.experiment_pk)
    .maybeSingle()
  if (lookupErr) return { ok: false, code: 'db_error', message: lookupErr.message }
  if (!existing) {
    return { ok: false, code: 'not_found', message: `experiment "${payload.experiment_pk}" not found` }
  }

  const patch = buildPatchObject(payload, EXPERIMENT_PATCH_FIELDS)
  if (Object.keys(patch).length === 0) {
    return { ok: false, code: 'no_op', message: 'no editable fields supplied' }
  }

  const { data, error } = await supabase
    .from('experiments')
    .update(patch)
    .eq('id', payload.experiment_pk)
    .eq('user_id', userId)
    .select('id')
    .single()
  if (error || !data) {
    return { ok: false, code: 'db_error', message: error?.message || 'experiment update failed' }
  }
  return { ok: true, experiment_pk: data.id as string }
}

// ---- patchRoastLearnings -------------------------------------------------

export interface PatchRoastLearningsPayload extends Partial<Omit<RoastLearningsPayload, 'green_bean_id'>> {
  roast_learnings_id: string
  // green_bean_id is the UPSERT key on push_roast_learnings (one per bean);
  // patchable but rarely changed.
  green_bean_id?: string
}

export const ROAST_LEARNINGS_PATCH_FIELDS = [
  'green_bean_id', 'best_batch_id', 'why_this_roast_won',
  // Sprint 11 (migration 062, 2026-05-20): aromatic_behavior + structural_behavior
  // relocated to cuppings per ADR-0008.
  'brewing_tolerance',
  'roast_window_width', 'primary_lever', 'secondary_levers',
  'what_didnt_move_needle', 'underdevelopment_signal', 'overdevelopment_signal',
  'cultivar_takeaway', 'terroir_takeaway', 'general_takeaway', 'reference_roasts',
  'starting_hypothesis', 'rest_behavior',
  // Sub Pages 6.1 (migration 052)
  'best_roast_id',
  // Sprint 12 (migration 064, 2026-05-21): per-field scope_tags arrays. ADR-0009.
  'cultivar_takeaway_scope_tags', 'terroir_takeaway_scope_tags',
  'general_takeaway_scope_tags', 'starting_hypothesis_scope_tags',
] as const

export async function patchRoastLearnings(
  supabase: SupabaseClient,
  userId: string,
  payload: PatchRoastLearningsPayload,
): Promise<PatchResult<'roast_learnings_id'>> {
  if (!payload.roast_learnings_id?.trim()) {
    return { ok: false, code: 'validation', errors: ['roast_learnings_id is required'] }
  }

  const { data: existing, error: lookupErr } = await supabase
    .from('roast_learnings')
    .select('id, green_bean_id')
    .eq('user_id', userId)
    .eq('id', payload.roast_learnings_id)
    .maybeSingle()
  if (lookupErr) return { ok: false, code: 'db_error', message: lookupErr.message }
  if (!existing) {
    return { ok: false, code: 'not_found', message: `roast_learnings "${payload.roast_learnings_id}" not found` }
  }

  const patch = buildPatchObject(payload, ROAST_LEARNINGS_PATCH_FIELDS)
  if (Object.keys(patch).length === 0) {
    return { ok: false, code: 'no_op', message: 'no editable fields supplied' }
  }

  // One-shot constraint applies on patch as well (migration 054). green_bean_id
  // sourced from the existing row OR the payload (when patching to repoint to a
  // different bean - rare but supported).
  const targetGreenBeanId = (payload.green_bean_id ?? existing.green_bean_id) as string
  const oneShot = await checkOneShotConstraint(supabase, userId, targetGreenBeanId, patch)
  if (!oneShot.ok) return { ok: false, code: 'validation', errors: oneShot.errors }

  const { data, error } = await supabase
    .from('roast_learnings')
    .update(patch)
    .eq('id', payload.roast_learnings_id)
    .eq('user_id', userId)
    .select('id')
    .single()
  if (error || !data) {
    return { ok: false, code: 'db_error', message: error?.message || 'roast_learnings update failed' }
  }
  return { ok: true, roast_learnings_id: data.id as string }
}

// ---------------------------------------------------------------------------
// Roast recipes (Sub Pages 6.1, 2026-05-13) — first-class entity for per-batch
// design intent. UPSERT on (user_id, experiment_id, batch_slot) when both are
// supplied (the canonical V-set framing — v1a / v1b / v1c), otherwise UPSERT
// on (user_id, green_bean_id, recipe_name) for one-off / calibration recipes
// outside the V-set framing. See docs/roasting/redesign.md § 4.3 + § 8.
// ---------------------------------------------------------------------------

export interface RoastRecipePayload {
  // FK + identity (required)
  green_bean_id: string
  // V-set framing: experiment_id + batch_slot disambiguate the recipe. Both
  // optional so one-off / calibration recipes can land outside the V framing
  // (in that case recipe_name + green_bean_id form the UPSERT key).
  experiment_id?: string | null
  batch_slot?: string | null
  recipe_name?: string | null
  // Lineage
  parent_recipe_id?: string | null
  // Per-batch Hypothesis prose (mockup row). Distinct from notes.
  rationale?: string | null
  notes?: string | null
  // Curve definition (bezier shape matches push_roast_profile)
  temperature_bezier?: unknown | null
  fan_bezier?: unknown | null
  rpm_bezier?: unknown | null
  power_bezier?: unknown | null
  end_condition_type?: string | null
  end_condition_target?: number | null
  preheat_temperature_c?: number | null
  // Design specs
  charge_temp?: number | null
  hopper_load_temp?: number | null
  // Design-time predictions (frozen at recipe creation)
  predicted_fc_temp?: number | null
  predicted_fc_time?: string | null
  predicted_total_time?: string | null
  predicted_maillard_pct?: number | null
  predicted_agtron_wb?: number | null
  predicted_cup?: string | null
  // Mockup "Drop Rules" card
  drop_rule_if_fast?: string | null
  drop_rule_if_slow?: string | null
  // Roest linkage
  roest_profile_id?: number | null
  roest_share_url?: string | null
  roest_profile_name?: string | null
  pushed_to_roest_at?: string | null
  // Schema sprint S4 (migration 057, 2026-05-18): backfill provenance.
  // was_backfilled=true when this recipe was authored as backfill (design
  // intent recovered after the roast). backfill_notes captures the
  // when/how/source prose. Default false on design-time pushes.
  was_backfilled?: boolean | null
  backfill_notes?: string | null
}

export type PersistRoastRecipeResult =
  | (PersistOk<'recipe_id'> & { created: boolean })
  | PersistFail

export function validateRoastRecipePayload(p: RoastRecipePayload): ValidationResult {
  const errors: string[] = []
  if (!p.green_bean_id?.trim()) errors.push('green_bean_id is required')
  // At least one disambiguator must be supplied (otherwise the UPSERT key is
  // ambiguous — multiple unnamed recipes per bean would all collide).
  const hasVSetKey = !!(p.experiment_id && p.batch_slot)
  const hasNameKey = !!(p.recipe_name && p.recipe_name.trim())
  if (!hasVSetKey && !hasNameKey) {
    errors.push(
      '(experiment_id + batch_slot) OR recipe_name is required for UPSERT key disambiguation',
    )
  }
  return errors.length ? { ok: false, errors } : { ok: true }
}

export async function persistRoastRecipe(
  supabase: SupabaseClient,
  userId: string,
  payload: RoastRecipePayload,
): Promise<PersistRoastRecipeResult> {
  const v = validateRoastRecipePayload(payload)
  if (!v.ok) return { ok: false, code: 'validation', errors: v.errors }

  // Composite-key lookup — V-set framing takes precedence when both fields
  // are present. Otherwise recipe_name is the disambiguator.
  let lookup = supabase
    .from('roast_recipes')
    .select('id')
    .eq('user_id', userId)
    .eq('green_bean_id', payload.green_bean_id)
  if (payload.experiment_id && payload.batch_slot) {
    lookup = lookup.eq('experiment_id', payload.experiment_id).eq('batch_slot', payload.batch_slot)
  } else if (payload.recipe_name) {
    lookup = lookup.eq('recipe_name', payload.recipe_name).is('batch_slot', null)
  }
  const { data: existing, error: lookupErr } = await lookup.maybeSingle()
  if (lookupErr) return { ok: false, code: 'db_error', message: lookupErr.message }
  const created = !existing

  const row = {
    user_id: userId,
    green_bean_id: payload.green_bean_id,
    experiment_id: payload.experiment_id ?? null,
    batch_slot: payload.batch_slot ?? null,
    recipe_name: payload.recipe_name ?? null,
    parent_recipe_id: payload.parent_recipe_id ?? null,
    rationale: payload.rationale ?? null,
    notes: payload.notes ?? null,
    temperature_bezier: payload.temperature_bezier ?? null,
    fan_bezier: payload.fan_bezier ?? null,
    rpm_bezier: payload.rpm_bezier ?? null,
    power_bezier: payload.power_bezier ?? null,
    end_condition_type: payload.end_condition_type ?? null,
    end_condition_target: payload.end_condition_target ?? null,
    preheat_temperature_c: payload.preheat_temperature_c ?? null,
    charge_temp: payload.charge_temp ?? null,
    hopper_load_temp: payload.hopper_load_temp ?? null,
    predicted_fc_temp: payload.predicted_fc_temp ?? null,
    predicted_fc_time: payload.predicted_fc_time ?? null,
    predicted_total_time: payload.predicted_total_time ?? null,
    predicted_maillard_pct: payload.predicted_maillard_pct ?? null,
    predicted_agtron_wb: payload.predicted_agtron_wb ?? null,
    predicted_cup: payload.predicted_cup ?? null,
    drop_rule_if_fast: payload.drop_rule_if_fast ?? null,
    drop_rule_if_slow: payload.drop_rule_if_slow ?? null,
    roest_profile_id: payload.roest_profile_id ?? null,
    roest_share_url: payload.roest_share_url ?? null,
    roest_profile_name: payload.roest_profile_name ?? null,
    pushed_to_roest_at: payload.pushed_to_roest_at ?? null,
    // Schema sprint S4 (migration 057): default false on design-time pushes.
    // Backfill flows pass was_backfilled=true + backfill_notes explicitly.
    was_backfilled: payload.was_backfilled ?? false,
    backfill_notes: payload.backfill_notes ?? null,
  }

  if (created) {
    const { data, error } = await supabase.from('roast_recipes').insert(row).select('id').single()
    if (error || !data) {
      return { ok: false, code: 'db_error', message: error?.message ?? 'no row returned' }
    }
    return { ok: true, recipe_id: data.id as string, created: true }
  } else {
    const { data, error } = await supabase
      .from('roast_recipes')
      .update(row)
      .eq('id', existing.id)
      .select('id')
      .single()
    if (error || !data) {
      return { ok: false, code: 'db_error', message: error?.message ?? 'no row returned' }
    }
    return { ok: true, recipe_id: data.id as string, created: false }
  }
}

// ---- patchRoastRecipe ----------------------------------------------------

export interface PatchRoastRecipePayload extends Partial<Omit<RoastRecipePayload, 'green_bean_id'>> {
  recipe_id: string
  green_bean_id?: string
}

export const ROAST_RECIPE_PATCH_FIELDS = [
  'green_bean_id', 'experiment_id', 'batch_slot', 'recipe_name',
  'parent_recipe_id', 'rationale', 'notes',
  'temperature_bezier', 'fan_bezier', 'rpm_bezier', 'power_bezier',
  'end_condition_type', 'end_condition_target', 'preheat_temperature_c',
  'charge_temp', 'hopper_load_temp',
  'predicted_fc_temp', 'predicted_fc_time', 'predicted_total_time',
  'predicted_maillard_pct', 'predicted_agtron_wb', 'predicted_cup',
  'drop_rule_if_fast', 'drop_rule_if_slow',
  'roest_profile_id', 'roest_share_url', 'roest_profile_name', 'pushed_to_roest_at',
  // Schema sprint S4 (migration 057, 2026-05-18)
  'was_backfilled', 'backfill_notes',
] as const

export async function patchRoastRecipe(
  supabase: SupabaseClient,
  userId: string,
  payload: PatchRoastRecipePayload,
): Promise<PatchResult<'recipe_id'>> {
  if (!payload.recipe_id?.trim()) {
    return { ok: false, code: 'validation', errors: ['recipe_id is required'] }
  }

  const { data: existing, error: lookupErr } = await supabase
    .from('roast_recipes')
    .select('id')
    .eq('user_id', userId)
    .eq('id', payload.recipe_id)
    .maybeSingle()
  if (lookupErr) return { ok: false, code: 'db_error', message: lookupErr.message }
  if (!existing) {
    return { ok: false, code: 'not_found', message: `roast_recipe "${payload.recipe_id}" not found` }
  }

  const patch = buildPatchObject(payload, ROAST_RECIPE_PATCH_FIELDS)
  if (Object.keys(patch).length === 0) {
    return { ok: false, code: 'no_op', message: 'no editable fields supplied' }
  }

  const { data, error } = await supabase
    .from('roast_recipes')
    .update(patch)
    .eq('id', payload.recipe_id)
    .eq('user_id', userId)
    .select('id')
    .single()
  if (error || !data) {
    return { ok: false, code: 'db_error', message: error?.message || 'roast_recipe update failed' }
  }
  return { ok: true, recipe_id: data.id as string }
}
