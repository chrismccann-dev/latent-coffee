// Canonical grinder taxonomy for brews.grinder + brews.grind_setting.
//
// Single grinder today: Weber Workshop EG-1 with ULTRA (SSP) 80mm flat burrs.
// Setting axis is enumerated per-grinder, NOT free-text — Chris dials in
// specific decimal-dial positions and wants consistent input across brews.
//
// EG-1 setting range: 3.0 to 8.0 in 0.1 steps (51 canonical settings). 16 of
// those carry rich content (D50 / zone / extraction behavior / use case)
// sourced from Chris's authored CSV (Taxonomy Reference - Grinder and Grind
// Setting). 6.6 is included with status='needs_fresh_measurement' because
// past brews used it but the D50 reading was contaminated and needs a fresh
// measurement session. 7.0 is the anomalous bailout (reads finer than 6.9).
// Settings outside Chris's typical range (5.0-7.0) carry outOfTypicalRange
// so the picker can soften their visual weight.
//
// Authoritative authored content: docs/taxonomies/grinders.md. This file is
// the validation mirror.
//
// **Not a comprehensive registry.** Per Chris's framing, this taxonomy
// captures only what he owns and uses. Adding a new grinder is a deliberate
// edit — registry + docs/taxonomies/grinders.md + a migration if existing
// brews need reclassification.

import { makeCanonicalLookup, type CanonicalLookup } from './canonical-registry'

export type GrinderScaleType = 'decimal_dial' | 'click_count' | 'numeric_notch'

// Status flag for settings whose measurement is incomplete or anomalous.
// Surface in the picker so Chris sees the caveat without losing the value.
export type GrinderSettingStatus = 'needs_fresh_measurement' | 'anomalous'

export interface GrinderSettingEntry {
  value: string                 // canonical decimal string, persisted to brews.grind_setting
  d50?: number                  // D50 in µm (Chris's particle-distribution measurements)
  zone?: string                 // 'A - Clarity' / 'B - Transition' / 'C - Compression' / 'D - Plateau' / 'D - Floor'
  extractionBehavior?: string
  useCase?: string
  status?: GrinderSettingStatus
  outOfTypicalRange?: boolean   // true outside Chris's actual brewing range
}

export interface GrinderEntry {
  name: string                  // canonical, used in brews.grinder
  displayName?: string          // short form for tight UI surfaces
  manufacturer: string
  scaleType: GrinderScaleType
  settingMin: number
  settingMax: number
  settingStep: number
  burrs?: string                // current burr set (e.g. 'ULTRA (SSP)') — swappable on the EG-1
  burrShape?: string            // 'Flat' / 'Conical' — geometry, not the specific burr brand
  burrSize?: string             // '80mm' / '64mm' / etc.
  typicalRangeMin?: number      // dial-position floor of Chris's actual usage
  typicalRangeMax?: number      // dial-position ceiling of Chris's actual usage
  notes?: string                // BMR-style structural prose
  validSettings: GrinderSettingEntry[]
}

// Per-setting rich content from Chris's Taxonomy Reference CSV (15 rows) +
// 6.6 status flag + 7.0 anomalous note (from Brewing.md). All other settings
// in the 3.0-8.0 range are valid but carry no measurement yet.
const EG1_SETTING_CONTENT: Record<string, Partial<GrinderSettingEntry>> = {
  '7.0': {
    d50: 1116,
    zone: 'A - Clarity',
    extractionBehavior: 'Very coarse — anomalous (reads finer than 6.9)',
    useCase: 'Bailout setting; remeasured March 2026',
    status: 'anomalous',
  },
  '6.9': {
    d50: 1216,
    zone: 'A - Clarity',
    extractionBehavior: 'Very high clarity / low extraction',
    useCase: 'Delicate washed Gesha; highest aromatic separation',
  },
  '6.8': {
    d50: 1133,
    zone: 'A - Clarity',
    extractionBehavior: 'Balanced clarity-coarse',
    useCase: 'Washed Ethiopians; high-end washed coffees',
  },
  '6.7': {
    d50: 1103,
    zone: 'A - Clarity',
    extractionBehavior: 'Balanced clarity + sweetness',
    useCase: 'Default washed starting point',
  },
  '6.6': {
    status: 'needs_fresh_measurement',
    useCase: 'Past brews used this; D50 reading contaminated and needs fresh session',
  },
  '6.5': {
    d50: 1083,
    zone: 'B - Transition',
    extractionBehavior: 'Balanced extraction',
    useCase: 'General washed; balanced cups',
  },
  '6.4': {
    d50: 977,
    zone: 'B - Transition',
    extractionBehavior: 'High extraction onset',
    useCase: 'Honey, light naturals, denser coffees',
  },
  '6.3': {
    d50: 1050,
    zone: 'C - Compression',
    extractionBehavior: 'Strong extraction / compression begins',
    useCase: 'Natural, anaerobic washed',
  },
  '6.2': {
    d50: 1023,
    zone: 'C - Compression',
    extractionBehavior: 'Similar to 6.3',
    useCase: 'Functionally same as 6.3; adjust for flow',
  },
  '6.1': {
    d50: 1001,
    zone: 'C - Compression',
    extractionBehavior: 'High extraction',
    useCase: 'Dense high elevation; heavy processing',
  },
  '6.0': {
    d50: 1061,
    zone: 'C - Compression',
    extractionBehavior: 'Full expression entry',
    useCase: 'Sey / high extraction styles',
  },
  '5.5': {
    d50: 842,
    zone: 'D - Plateau',
    extractionBehavior: 'Sharp extraction increase (step change)',
    useCase: 'Key transition into heavy extraction',
  },
  '5.0': {
    d50: 882,
    zone: 'D - Plateau',
    extractionBehavior: 'Compressed extraction',
    useCase: 'Full expression; risk of heaviness',
  },
  '4.5': {
    d50: 867,
    zone: 'D - Plateau',
    extractionBehavior: 'Minimal change',
    useCase: 'Little benefit vs 5.0',
  },
  '4.0': {
    d50: 874,
    zone: 'D - Plateau',
    extractionBehavior: 'Plateau confirmed',
    useCase: 'Redundant range',
  },
  '3.5': {
    d50: 819,
    zone: 'D - Floor',
    extractionBehavior: 'Fines-driven / unstable',
    useCase: 'Edge case testing only',
  },
  '3.0': {
    d50: 816,
    zone: 'D - Floor',
    extractionBehavior: 'Floor confirmed',
    useCase: 'Lower bound of filter grinding',
  },
}

const EG1_TYPICAL_MIN = 5.0
const EG1_TYPICAL_MAX = 7.0

function eg1ValidSettings(): GrinderSettingEntry[] {
  const settings: GrinderSettingEntry[] = []
  // 8.0 down to 3.0 inclusive in 0.1 steps. Loop to 2.95 to dodge floating-point drift.
  for (let v = 8.0; v >= 2.95; v -= 0.1) {
    const value = v.toFixed(1)
    const content = EG1_SETTING_CONTENT[value]
    const outOfTypicalRange = v < EG1_TYPICAL_MIN || v > EG1_TYPICAL_MAX
    settings.push({
      value,
      ...content,
      outOfTypicalRange,
    })
  }
  return settings
}

export const GRINDERS: GrinderEntry[] = [
  {
    name: 'EG-1',
    displayName: 'EG-1',
    manufacturer: 'Weber Workshop',
    scaleType: 'decimal_dial',
    settingMin: 3.0,
    settingMax: 8.0,
    settingStep: 0.1,
    burrs: 'ULTRA (SSP)',
    burrShape: 'Flat',
    burrSize: '80mm',
    typicalRangeMin: EG1_TYPICAL_MIN,
    typicalRangeMax: EG1_TYPICAL_MAX,
    notes:
      'Two units in rotation (home: distilled + remineralized water; office: tap, Downtown Palo Alto), both calibrated to identical settings. Settings 6.0-6.3 produce D50 in the ~1000-1060 µm band due to burr-geometry compression; 6.0->5.5 is the steepest meaningful step (~95 µm). Below 5.0 the burr hits a D50 floor of ~820-880 µm regardless of dial. High-EY roasters (Picky Chemist, Sey, Flower Child) target ~450 µm D50 on different burr geometry — physically unachievable on the EG-1; compensate via temperature (boiling), agitation, filter (T-92), and brew time (4-5 minutes), not via dial.',
    validSettings: eg1ValidSettings(),
  },
]

export const GRINDER_NAMES: readonly string[] = GRINDERS.map((g) => g.name)

// Drift variants observed in DB (pre-1k audit). Setting decimals decompose
// at migration / save time via the regex set in lib/brew-import.ts; the
// grinder portion resolves through this alias map.
export const GRINDER_ALIASES: Record<string, string> = {
  'Weber EG-1': 'EG-1',
  'Weber Workshop EG-1': 'EG-1',
  'EG1': 'EG-1',
  'Weber EG1': 'EG-1',
  'Weber Workshop EG1': 'EG-1',
  'Eg-1': 'EG-1',
  'Eg1': 'EG-1',
}

export const GRINDER_LOOKUP: CanonicalLookup = makeCanonicalLookup(
  GRINDER_NAMES,
  GRINDER_ALIASES,
)

export const isCanonicalGrinder = GRINDER_LOOKUP.isCanonical
export const findClosestGrinder = GRINDER_LOOKUP.findClosest

export function getGrinderEntry(name: string | null | undefined): GrinderEntry | undefined {
  if (!name) return undefined
  const lower = name.toLowerCase()
  return GRINDERS.find((g) => g.name.toLowerCase() === lower)
}

export function getSettingEntry(
  grinderName: string | null | undefined,
  settingValue: string | null | undefined,
): GrinderSettingEntry | undefined {
  if (!grinderName || !settingValue) return undefined
  const grinder = getGrinderEntry(grinderName)
  if (!grinder) return undefined
  const trimmed = settingValue.trim()
  return grinder.validSettings.find((s) => s.value === trimmed)
}

// Strict per-grinder setting validation. Used by save-gate + PATCH route.
// Empty setting is treated as resolvable so callers can use it for an
// optional-field gate. When the setting is non-empty, it must match a
// canonical value in the grinder's validSettings (case-insensitive trim).
export function isResolvableSetting(
  grinderName: string | null | undefined,
  settingValue: string | null | undefined,
): boolean {
  if (!settingValue || !settingValue.trim()) return true
  if (!grinderName) return false
  return getSettingEntry(grinderName, settingValue) !== undefined
}
