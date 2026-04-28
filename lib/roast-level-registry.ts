// Canonical roast-level taxonomy for brews.roast_level. 8 buckets anchored to
// Agtron whole-bean color readings (Lighttells CM200 workflow). Marketing tags
// like "Nordic Light" / "Ultra Light" are aliases that resolve to the closest
// objective bucket — they don't live as first-class canonical values. Marketing
// tags conceptually belong on roaster.roastStyle (follow-up sprint 1h.3).
//
// Authoritative authored content: docs/taxonomies/roast-levels.md. This file is
// the validation mirror.

import { makeCanonicalLookup, type CanonicalLookup } from './canonical-registry'

export interface RoastLevelEntry {
  name: string
  // Inclusive whole-bean Agtron range (CM200 reading). Ground-bean ranges are
  // out of scope — Chris doesn't grind-to-measure outside controlled roasting.
  agtronWholeBean: [number, number]
}

export const ROAST_LEVELS: RoastLevelEntry[] = [
  { name: 'Extremely Light', agtronWholeBean: [91, 130] },
  { name: 'Very Light',      agtronWholeBean: [81, 90]  },
  { name: 'Light',           agtronWholeBean: [71, 80]  },
  { name: 'Medium Light',    agtronWholeBean: [61, 70]  },
  { name: 'Medium',          agtronWholeBean: [51, 60]  },
  { name: 'Moderately Dark', agtronWholeBean: [41, 50]  },
  { name: 'Dark',            agtronWholeBean: [31, 40]  },
  { name: 'Very Dark',       agtronWholeBean: [0,  30]  },
]

export const ROAST_LEVEL_NAMES: readonly string[] = ROAST_LEVELS.map((e) => e.name)

// Marketing-tag + drift-variant aliases. Keys are lowercased by the factory,
// so one entry covers all case variants (e.g. 'Light Roast' covers 'light roast',
// 'LIGHT ROAST', etc.). Values must be canonical title-case forms.
export const ROAST_LEVEL_ALIASES: Record<string, string> = {
  // Marketing tags (roasters' self-positioning — resolve to objective bucket)
  'Ultra Light': 'Extremely Light',
  'UL': 'Extremely Light',
  'Nordic Light': 'Very Light',
  'Nordic': 'Very Light',
  'Specialty Light': 'Light',
  'Modern Light': 'Light',
  'Omni Light': 'Medium Light',

  // Drift — Light family
  'Light Roast': 'Light',

  // Drift — Medium Light family (center of gravity + common typos)
  'Light-Medium': 'Medium Light',
  'Light Medium': 'Medium Light',
  'Medium-Light': 'Medium Light',
  'Light to Medium': 'Medium Light',
  'med-light': 'Medium Light',

  // Drift — Medium
  'Medium Roast': 'Medium',

  // Drift — Moderately Dark
  'Medium Dark': 'Moderately Dark',
  'Medium-Dark': 'Moderately Dark',

  // Drift — Dark
  'Dark Roast': 'Dark',

  // Drift — extremes
  'Extra Light': 'Extremely Light',
  'Extra-Light': 'Extremely Light',
}

export const ROAST_LEVEL_LOOKUP: CanonicalLookup = makeCanonicalLookup(
  ROAST_LEVEL_NAMES,
  ROAST_LEVEL_ALIASES,
)

export const isCanonicalRoastLevel = ROAST_LEVEL_LOOKUP.isCanonical
export const findClosestRoastLevel = ROAST_LEVEL_LOOKUP.findClosest

export function getRoastLevelEntry(name: string | null | undefined): RoastLevelEntry | undefined {
  if (!name) return undefined
  return ROAST_LEVELS.find((e) => e.name === name)
}

// Map a CM200 whole-bean Agtron reading to the canonical bucket. Returns null
// for out-of-range readings. Future-valuable for auto-populating roast_level
// from measurement in /green or a roast logger.
export function roastLevelFromAgtron(agtron: number | null | undefined): string | null {
  if (agtron == null || !Number.isFinite(agtron)) return null
  const hit = ROAST_LEVELS.find(({ agtronWholeBean: [min, max] }) => agtron >= min && agtron <= max)
  return hit?.name ?? null
}
