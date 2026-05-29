// Process modifier-axis swatch colors — single source of truth.
//
// Centralized in Redesign Sprint 0 (2026-05-29): this map was duplicated verbatim
// in app/(app)/processes/page.tsx (MODIFIER_AXIS_COLOR) and
// app/(app)/processes/modifiers/[modifier]/page.tsx (AXIS_SWATCH_COLOR), plus an
// inline literal for the signature swatch. Hues are Latent's existing values
// (kept per the redesign's "semantic palettes stay Latent's" rule); only the
// duplication was removed. Hue-separated per the design-conventions rule.

export const PROCESS_AXIS_COLOR: Record<string, string> = {
  fermentation: '#722F4B',
  drying: '#8B6914',
  intervention: '#5B4A6B',
  experimental: '#5B4A6B',
}

/** Neutral fallback for an unrecognized axis key. */
export const PROCESS_AXIS_FALLBACK = '#5C6570'

/** Signature-method swatch on the /processes index — shares the intervention/experimental hue. */
export const SIGNATURE_SWATCH_COLOR = PROCESS_AXIS_COLOR.intervention

/** Resolve a modifier-axis key to its swatch color, falling back to the neutral. */
export function axisColor(axis: string): string {
  return PROCESS_AXIS_COLOR[axis] ?? PROCESS_AXIS_FALLBACK
}
