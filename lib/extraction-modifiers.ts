// Axis 2 — Extraction Modifiers (sprint Extraction Strategy v2, 2026-04-27).
//
// Stackable, optional techniques layered on top of any of the 6 strategies in
// EXTRACTION_STRATEGIES (lib/brew-import.ts). Persisted in `brews.modifiers`
// as a jsonb array of discriminated-union objects. Empty array is the
// default + by far the most common state — modifiers are deliberate
// additions, not defaults.
//
// v8.4 (2026-05-06): The Immersion modifier was REMOVED from the canonical
// type set. v8.3 had folded SWORKS valve-modulated immersion staging + Hario
// Switch staged immersion into a 4th modifier slot. v8.4 promotes Hybrid to
// a 6th first-class strategy (lib/brew-import.ts) and absorbs the Immersion
// modifier into it via the conditional hybrid_subform sub-field. What was
// "Balanced Intensity + Immersion (sequential)" is now "Hybrid (Sequential)"
// with intensity range as a recipe parameter. See lib/hybrid-subform.ts.
//
// v8.5 (2026-05-08): MODIFIER_TYPES grows from 3 -> 4 with the addition of
// `role_based_pulse` (assigning each pour an explicit sensory role on a
// percolation-only brewer; Justin Bull 2025 Phase-Mapped logic without the
// Hybrid immersion phase). OUTPUT_SELECTION_FORMS grows from 3 -> 4 with the
// addition of `dilution` (post-brew dilution; carries optional `dilution_g`
// sub-field on OutputSelectionModifier). Cross-cutting calibration axes
// (water strength / agitation taper / filter behavior / pre-brew
// conditioning) deliberately stay in the wbc-reference.md doc layer rather
// than promoting to canonical modifiers - Chris's "keep compact strategy
// set, add separate doc layer" framing.
//
// Sourced from Chris's WBC research (see docs/brewing/wbc-recipes.md +
// docs/brewing/wbc-reference.md): four orthogonal techniques. Each maps to
// one of the WBC taxonomy's foundational axes (Output Selection /
// Time-Distributed / External Control). Folded into one heterogeneous bucket
// because Chris's current brewing context (single origin, home/office)
// doesn't combine them in ways that would warrant per-axis sub-bucketing yet.

export type CleanResult<T> = { ok: true; value: T } | { ok: false; error: string }

// ---------------------------------------------------------------------------
// Canonical types
// ---------------------------------------------------------------------------

export const MODIFIER_TYPES = [
  'output_selection',
  'inverted_temperature_staging',
  'aroma_capture',
  'role_based_pulse',
] as const
export type ModifierType = (typeof MODIFIER_TYPES)[number]

export const OUTPUT_SELECTION_FORMS = ['early_cut', 'late_cut', 'both', 'dilution'] as const
export type OutputSelectionForm = (typeof OUTPUT_SELECTION_FORMS)[number]

export interface OutputSelectionModifier {
  type: 'output_selection'
  form: OutputSelectionForm
  brew_weight?: number | null   // grams brewed
  cup_yield?: number | null     // grams kept after cuts
  dilution_g?: number | null    // grams of water added post-brew (form='dilution' only)
  notes?: string | null
}

export interface InvertedTemperatureStagingModifier {
  type: 'inverted_temperature_staging'
  phases?: string | null  // free-text e.g. "86°C → 92°C across two phases"
}

export interface AromaCaptureModifier {
  type: 'aroma_capture'
  application?: string | null  // free-text e.g. "Paragon ball on bloom + Pour 1"
}

export interface RoleBasedPulseModifier {
  type: 'role_based_pulse'
  roles?: string | null  // free-text e.g. "Pour 1=saturation · Pour 2=body · Pour 3=clarity"
}

export type Modifier =
  | OutputSelectionModifier
  | InvertedTemperatureStagingModifier
  | AromaCaptureModifier
  | RoleBasedPulseModifier

// ---------------------------------------------------------------------------
// Display
// ---------------------------------------------------------------------------

const TYPE_LABELS: Record<ModifierType, string> = {
  output_selection: 'Output Selection',
  inverted_temperature_staging: 'Inverted Temperature Staging',
  aroma_capture: 'Aroma Capture',
  role_based_pulse: 'Role-Based Pulse',
}

const FORM_LABELS: Record<OutputSelectionForm, string> = {
  early_cut: 'early cut',
  late_cut: 'late cut',
  both: 'early + late cut',
  dilution: 'post-brew dilution',
}

export function modifierTypeLabel(type: ModifierType): string {
  return TYPE_LABELS[type]
}

export function outputSelectionFormLabel(form: OutputSelectionForm): string {
  return FORM_LABELS[form]
}

/** Split composeModifierLabel output at the em-dash so the type/form portion
 *  can render as a pill while the prose detail renders separately.
 *  Returns { head, detail } where detail is null when the modifier carries
 *  no sub-fields. Used by /brews/[id] to surface "Modifier Detail" as its
 *  own labeled subblock under the recipe pills. */
export function splitModifierLabel(m: Modifier): { head: string; detail: string | null } {
  const full = composeModifierLabel(m)
  const idx = full.indexOf(' — ')
  if (idx === -1) return { head: full, detail: null }
  return { head: full.slice(0, idx), detail: full.slice(idx + 3) }
}

/** Render a modifier as a single line for display. Examples:
 *    "Output Selection (late cut) — kept 245g of 288g"
 *    "Inverted Temperature Staging — 86°C → 92°C across two phases"
 *    "Aroma Capture — Paragon ball on bloom + Pour 1"
 *    "Output Selection (late cut)"      // when no sub-data populated
 */
export function composeModifierLabel(m: Modifier): string {
  const head = TYPE_LABELS[m.type]
  switch (m.type) {
    case 'output_selection': {
      const form = `(${FORM_LABELS[m.form]})`
      const detail =
        m.form === 'dilution' && m.dilution_g != null
          ? ` — added ${m.dilution_g}g water`
          : m.cup_yield != null && m.brew_weight != null
            ? ` — kept ${m.cup_yield}g of ${m.brew_weight}g`
            : m.notes
              ? ` — ${m.notes}`
              : ''
      return `${head} ${form}${detail}`
    }
    case 'inverted_temperature_staging':
      return m.phases ? `${head} — ${m.phases}` : head
    case 'aroma_capture':
      return m.application ? `${head} — ${m.application}` : head
    case 'role_based_pulse':
      return m.roles ? `${head} — ${m.roles}` : head
  }
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const MODIFIER_TYPE_SET = new Set<string>(MODIFIER_TYPES)
const OUTPUT_FORM_SET = new Set<string>(OUTPUT_SELECTION_FORMS)

function isModifierType(v: unknown): v is ModifierType {
  return typeof v === 'string' && MODIFIER_TYPE_SET.has(v)
}

function isOutputForm(v: unknown): v is OutputSelectionForm {
  return typeof v === 'string' && OUTPUT_FORM_SET.has(v)
}

function nullableNum(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null
  const n = typeof v === 'number' ? v : Number(v)
  return Number.isFinite(n) ? n : null
}

function nullableStr(v: unknown): string | null {
  if (v === null || v === undefined) return null
  const s = typeof v === 'string' ? v.trim() : String(v).trim()
  return s.length ? s : null
}

/** Strict cleaner: validates discriminator + per-type sub-fields, drops
 *  unknown keys, rejects entries whose type isn't canonical. Returns the
 *  cleaned array (may be shorter than input if entries were dropped, but
 *  never silently — invalid types raise an error).
 *
 *  v8.4 note: 'immersion' is no longer a canonical type. cleanModifiers()
 *  REJECTS it (returns ok:false) so a stale payload from a v8.3-era client
 *  fails loudly rather than silently dropping data. The 4 brews that carried
 *  immersion modifiers were migrated in 046_extraction_strategy_v8_4.sql
 *  (3 reclassified to Hybrid, 1 kept Full Expression with modifiers cleared).
 *
 *  v8.5 note: 'role_based_pulse' added as a 4th canonical type and 'dilution'
 *  added as a 4th OUTPUT_SELECTION_FORMS value. Pre-v8.5 clients sending
 *  payloads without these are still valid; post-v8.5 clients sending them
 *  round-trip cleanly. */
export function cleanModifiers(input: unknown): CleanResult<Modifier[]> {
  if (input == null) return { ok: true, value: [] }
  if (!Array.isArray(input)) {
    return { ok: false, error: 'modifiers must be an array' }
  }

  const out: Modifier[] = []
  for (let i = 0; i < input.length; i++) {
    const raw = input[i]
    if (!raw || typeof raw !== 'object') {
      return { ok: false, error: `modifiers[${i}]: expected object, got ${typeof raw}` }
    }
    const type = (raw as { type?: unknown }).type
    if (!isModifierType(type)) {
      const hint = type === 'immersion'
        ? ' — the immersion modifier was removed in v8.4 (2026-05-06); use extraction_strategy="Hybrid" with hybrid_subform set instead'
        : ''
      return {
        ok: false,
        error: `modifiers[${i}].type "${String(type)}" is not one of: ${MODIFIER_TYPES.join(', ')}${hint}`,
      }
    }
    switch (type) {
      case 'output_selection': {
        const form = (raw as { form?: unknown }).form
        if (!isOutputForm(form)) {
          return {
            ok: false,
            error: `modifiers[${i}].form must be one of: ${OUTPUT_SELECTION_FORMS.join(', ')}`,
          }
        }
        out.push({
          type: 'output_selection',
          form,
          brew_weight: nullableNum((raw as { brew_weight?: unknown }).brew_weight),
          cup_yield: nullableNum((raw as { cup_yield?: unknown }).cup_yield),
          dilution_g: nullableNum((raw as { dilution_g?: unknown }).dilution_g),
          notes: nullableStr((raw as { notes?: unknown }).notes),
        })
        break
      }
      case 'inverted_temperature_staging': {
        out.push({
          type: 'inverted_temperature_staging',
          phases: nullableStr((raw as { phases?: unknown }).phases),
        })
        break
      }
      case 'aroma_capture': {
        out.push({
          type: 'aroma_capture',
          application: nullableStr((raw as { application?: unknown }).application),
        })
        break
      }
      case 'role_based_pulse': {
        out.push({
          type: 'role_based_pulse',
          roles: nullableStr((raw as { roles?: unknown }).roles),
        })
        break
      }
    }
  }
  return { ok: true, value: out }
}

/** Spread-friendly: returns a fresh empty modifier object for the picker UI
 *  to seed when the user clicks "+ Add modifier" of a given type. */
export function emptyModifier(type: ModifierType): Modifier {
  switch (type) {
    case 'output_selection':
      return { type, form: 'late_cut', brew_weight: null, cup_yield: null, dilution_g: null, notes: null }
    case 'inverted_temperature_staging':
      return { type, phases: null }
    case 'aroma_capture':
      return { type, application: null }
    case 'role_based_pulse':
      return { type, roles: null }
  }
}
