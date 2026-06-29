// Canonical SWORKS Bottomless Dripper valve-dial taxonomy.
//
// Single brewer instance today: SWORKS Bottomless Dripper (home + office). The valve
// dial is an integer 0-7 with a wrap-around state past 7. Dials 1-4 are dead
// zones with a real coffee bed — restriction at those positions doesn't
// differentiate from Dial 0 due to bed resistance. Useful dial states:
// 0 (Closed) / 5 (Restricted) / 6 (Half-Open) / 7 (Open) / past-7 (Maximum
// Flow recovery).
//
// **Self-only canonical sub-taxonomy.** Structurally analogous to the EG-1
// grinder registry (one owned instrument with per-setting enumerated entries).
// Authoritative authored content: docs/skills/brewing-equipment-expert/cluster/sworks.md.
// This file is the validation mirror.
//
// Wave 1 (2026-05-26, ADR-0011): authored doc migrated from
// docs/taxonomies/sworks.md to the Brewing Equipment Expert sub-skill
// cluster. Old path is a redirect stub for back-compat.
//
// **Not a comprehensive registry.** Captures only what Chris owns. Adding a
// second valve-modulated brewer would be a deliberate registry extension.
//
// Vocabulary-only today: no `brews` column references this registry yet.
// Per-pour valve-dial structure lives in brews.pour_structure free-text;
// future structured-pour-structure sprint may extract it to a column with
// validation against `validDials`. See CR-7 scoping decision
// (docs/audits/2026-05-18/CR-7-sworks-valve-flow-scoping.md) for future
// promotion triggers.

import { makeCanonicalLookup, type CanonicalLookup } from './canonical-registry'

// Per-dial status. Most dials are 'normal'; Dial 1-4 carry 'dead_zone' to
// signal "don't use with real coffee bed". Past-7 carries 'recovery_only'
// to signal "not a brewing position".
export type SworksDialStatus = 'normal' | 'dead_zone' | 'recovery_only'

export interface SworksDialEntry {
  value: number                  // integer dial position (0-7 + past-7 sentinel as 8)
  state: string                  // canonical state name (Closed / Restricted / Half-Open / Open / Dead Zone / Maximum Flow)
  flowBehavior?: string          // free-text description of flow
  flowRateSecPer100g?: number    // calibrated sec per 100g at EG-1 6.0 + xBloom Premium Paper + real bed
  useCase?: string
  notes?: string
  status: SworksDialStatus
}

export interface SworksEntry {
  name: string                   // canonical, used wherever a brews/sworks reference is needed
  displayName?: string
  manufacturer: string
  owned: boolean
  filterPairing?: string
  geometry?: string              // 'cone' / 'flat' / etc.
  dialMin: number
  dialMax: number
  dialStep: number
  validDials: SworksDialEntry[]
}

// Single canonical entry today. Adding entries = deliberate registry edit
// (docs/skills/brewing-equipment-expert/cluster/sworks.md + this file)
// per the 2-step pattern.
export const SWORKS_DRIPPERS: SworksEntry[] = [
  {
    name: 'SWORKS Bottomless Dripper',
    displayName: 'SWORKS Bottomless',
    manufacturer: 'SWORKS',
    owned: true,
    filterPairing: 'Kalita 155 / xBloom Premium Paper (office); any small flat-bottom paper except April Brewer paper (home)',
    geometry: 'cone',
    dialMin: 0,
    dialMax: 7,
    dialStep: 1,
    validDials: [
      {
        value: 0,
        state: 'Closed',
        flowBehavior: 'Zero flow — true immersion',
        useCase: 'Bloom phase only (~20 seconds)',
        notes: 'Pour to target weight, close fully, saturate 20s, then crack to Restricted. Do NOT hold beyond ~25s — cup starts reading muddy.',
        status: 'normal',
      },
      {
        value: 1,
        state: 'Dead Zone',
        flowBehavior: 'Indistinguishable from Closed with a real coffee bed',
        useCase: 'Never (with brewing coffee)',
        notes: 'Bed resistance dominates valve restriction. Skip 1-4 entirely; jump 0 → 5 directly.',
        status: 'dead_zone',
      },
      {
        value: 2,
        state: 'Dead Zone',
        flowBehavior: 'Indistinguishable from Closed with a real coffee bed',
        useCase: 'Never (with brewing coffee)',
        status: 'dead_zone',
      },
      {
        value: 3,
        state: 'Dead Zone',
        flowBehavior: 'Indistinguishable from Closed with a real coffee bed',
        useCase: 'Never (with brewing coffee)',
        status: 'dead_zone',
      },
      {
        value: 4,
        state: 'Dead Zone',
        flowBehavior: 'Indistinguishable from Closed with a real coffee bed',
        useCase: 'Never (with brewing coffee)',
        status: 'dead_zone',
      },
      {
        value: 5,
        state: 'Restricted',
        flowBehavior: 'Very slow controlled drip',
        flowRateSecPer100g: 60,
        useCase: 'Early main pours (Pour 1, sometimes Pour 2). Core extraction lever — most brew time happens here.',
        notes: 'Artificially slows drawdown without finer grind. Calibrated at xBloom Premium Paper + real bed at EG-1 6.0.',
        status: 'normal',
      },
      {
        value: 6,
        state: 'Half-Open',
        flowBehavior: 'Moderate — controlled percolation',
        flowRateSecPer100g: 45,
        useCase: 'Later pours, transitioning to faster drain; Clarity-First main pours; standard "main" dial for anaerobic-natural Suppression brews',
        notes: 'Starting position for Clarity-First where full restriction would over-extract.',
        status: 'normal',
      },
      {
        value: 7,
        state: 'Open',
        flowBehavior: 'Fast — bottomless baseline (very fast)',
        flowRateSecPer100g: 30,
        useCase: 'Final flush, ending extraction cleanly, tail-cut. Sequential Hybrid drawdown phase.',
        notes: 'Open is faster than most open brewers. Open is NOT a "normal" setting — it is a fast setting. Use deliberately.',
        status: 'normal',
      },
      {
        value: 8,
        state: 'Maximum Flow',
        flowBehavior: '~20 sec / 100g — full turn past 7 (wraps back to 0 mechanically)',
        flowRateSecPer100g: 20,
        useCase: 'Rare; emergency over-extraction recovery only',
        notes: 'Not a brewing position; a recovery state. Wraps back to position 0 mechanically but flows at maximum rate momentarily before re-closing.',
        status: 'recovery_only',
      },
    ],
  },
]

// Module-level lookups. Built once at import to avoid Array.find on each access.
const SWORKS_BY_NAME: Map<string, SworksEntry> = new Map(
  SWORKS_DRIPPERS.map((d) => [d.name, d]),
)

export function getSworksEntry(name: string | null | undefined): SworksEntry | null {
  if (!name) return null
  return SWORKS_BY_NAME.get(name) ?? null
}

export function getSworksDial(
  dripperName: string,
  dialValue: number,
): SworksDialEntry | null {
  const dripper = getSworksEntry(dripperName)
  if (!dripper) return null
  return dripper.validDials.find((d) => d.value === dialValue) ?? null
}

// Strict canonical lookup against the dripper-name surface.
export const SWORKS_NAMES: readonly string[] = SWORKS_DRIPPERS.map((d) => d.name)

// Aliases for short-form references in prose; resolve via canonicalize on save.
const SWORKS_ALIASES: Record<string, string> = {
  'SWORKS Bottomless': 'SWORKS Bottomless Dripper',
  'SWORKS': 'SWORKS Bottomless Dripper',
  'Sworks Bottomless': 'SWORKS Bottomless Dripper',
  'S-Works Bottomless Dripper': 'SWORKS Bottomless Dripper',
}

export const SWORKS_LOOKUP: CanonicalLookup = makeCanonicalLookup(
  SWORKS_NAMES,
  SWORKS_ALIASES,
)

// Strict canonical lookup against the per-dial state vocabulary.
// Vocabulary anchor — caller can validate `state` strings against this set
// when a future column or render surface needs to canonicalize a state name.
export const SWORKS_DIAL_STATES: readonly string[] = [
  'Closed',
  'Restricted',
  'Half-Open',
  'Open',
  'Dead Zone',
  'Maximum Flow',
] as const

export const SWORKS_DIAL_STATE_LOOKUP: CanonicalLookup = makeCanonicalLookup(
  SWORKS_DIAL_STATES,
)

// Default export for ergonomics.
export const SWORKS = SWORKS_DRIPPERS[0]
