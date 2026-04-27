// Axis 2 — Extraction Modifiers (sprint Extraction Strategy v2, 2026-04-27).
//
// Stackable, optional techniques layered on top of any of the 5 strategies in
// EXTRACTION_STRATEGIES (lib/brew-import.ts). Persisted in `brews.modifiers`
// as a jsonb array of discriminated-union objects. Empty array is the
// default + by far the most common state — modifiers are deliberate
// additions, not defaults.
//
// Sourced from Chris's WBC research (see BREWING.md § WBC Reference): three
// orthogonal techniques that map to three of the WBC taxonomy's five
// foundational axes (Output Selection / Time Distribution / External
// Control). Folded into one heterogeneous bucket because Chris's current
// brewing context (single origin, home/office) doesn't combine them in ways
// that would warrant per-axis sub-bucketing yet.

export type CleanResult<T> = { ok: true; value: T } | { ok: false; error: string }

// ---------------------------------------------------------------------------
// Canonical types
// ---------------------------------------------------------------------------

export const MODIFIER_TYPES = [
  'output_selection',
  'inverted_temperature_staging',
  'aroma_capture',
  'immersion',
] as const
export type ModifierType = (typeof MODIFIER_TYPES)[number]

export const OUTPUT_SELECTION_FORMS = ['early_cut', 'late_cut', 'both'] as const
export type OutputSelectionForm = (typeof OUTPUT_SELECTION_FORMS)[number]

export interface OutputSelectionModifier {
  type: 'output_selection'
  form: OutputSelectionForm
  brew_weight?: number | null  // grams brewed
  cup_yield?: number | null    // grams kept after cuts
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

export interface ImmersionModifier {
  type: 'immersion'
  application?: string | null  // free-text e.g. "Switch closed 0-1:30, opened for 1:30-3:00 percolation finish"
}

export type Modifier =
  | OutputSelectionModifier
  | InvertedTemperatureStagingModifier
  | AromaCaptureModifier
  | ImmersionModifier

// ---------------------------------------------------------------------------
// Display
// ---------------------------------------------------------------------------

const TYPE_LABELS: Record<ModifierType, string> = {
  output_selection: 'Output Selection',
  inverted_temperature_staging: 'Inverted Temperature Staging',
  aroma_capture: 'Aroma Capture',
  immersion: 'Immersion',
}

const FORM_LABELS: Record<OutputSelectionForm, string> = {
  early_cut: 'early cut',
  late_cut: 'late cut',
  both: 'early + late cut',
}

export function modifierTypeLabel(type: ModifierType): string {
  return TYPE_LABELS[type]
}

export function outputSelectionFormLabel(form: OutputSelectionForm): string {
  return FORM_LABELS[form]
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
      const yieldStr =
        m.cup_yield != null && m.brew_weight != null
          ? ` — kept ${m.cup_yield}g of ${m.brew_weight}g`
          : m.notes
            ? ` — ${m.notes}`
            : ''
      return `${head} ${form}${yieldStr}`
    }
    case 'inverted_temperature_staging':
      return m.phases ? `${head} — ${m.phases}` : head
    case 'aroma_capture':
      return m.application ? `${head} — ${m.application}` : head
    case 'immersion':
      return m.application ? `${head} — ${m.application}` : head
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
 *  never silently — invalid types raise an error). */
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
      return {
        ok: false,
        error: `modifiers[${i}].type "${String(type)}" is not one of: ${MODIFIER_TYPES.join(', ')}`,
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
      case 'immersion': {
        out.push({
          type: 'immersion',
          application: nullableStr((raw as { application?: unknown }).application),
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
      return { type, form: 'late_cut', brew_weight: null, cup_yield: null, notes: null }
    case 'inverted_temperature_staging':
      return { type, phases: null }
    case 'aroma_capture':
      return { type, application: null }
    case 'immersion':
      return { type, application: null }
  }
}
