// Producer aggregation + derivation layer for the /producers surface
// (Producers-first-class sprint, 2026-06-19). There is NO `producers` DB table:
// aggregation is text-equality on `brews.producer` / `green_beans.producer`,
// canonicalized through PRODUCER_LOOKUP, exactly like `brews.roaster` on
// /roasters. This module is the single source of truth for:
//   - canonical keying (producerKey)
//   - per-producer evidence aggregation (aggregateProducers)
//   - relationshipState / enrichmentStatus derivation
//   - the relationship badge + tab membership
//   - the detail-page decision strip (Latent fit · Buy posture · Primary risk ·
//     Evidence level · Next action) — rule-derived for v1
// See docs/features/producers-first-class-scoping-2026-06-18.md.

import {
  PRODUCERS,
  PRODUCER_LOOKUP,
  getProducerEntry,
  type ProducerEntry,
} from './producer-registry'
import { ROASTER_LOOKUP } from './roaster-registry'
import { confidenceFor } from './confidence'
import type { Brew, GreenBean, RoastLearning } from './types'

// ---------------------------------------------------------------------------
// Canonical keying
// ---------------------------------------------------------------------------

/**
 * Resolve a raw producer string to its aggregation key: the canonical registry
 * name when it resolves, else the trimmed raw value (so evidence producers not
 * yet in the registry still aggregate cleanly — mirrors how /roasters renders
 * brewed roasters absent from the registry). Null for empty input.
 */
export function producerKey(name: string | null | undefined): string | null {
  if (!name) return null
  const trimmed = name.trim()
  if (!trimmed) return null
  return PRODUCER_LOOKUP.canonicalize(trimmed) ?? trimmed
}

// ---------------------------------------------------------------------------
// Relationship + enrichment state
// ---------------------------------------------------------------------------

// `indexed_only` = catalogued in the registry but with zero personal evidence
// (no brews / green / learnings). Named "Indexed" user-facing — deliberately NOT
// "target": a curated sourcing-priority (the real shortlist, strategy.md § 7)
// is a separate future `sourcingPriority` field, not this evidence-derived state.
export type RelationshipState =
  | 'indexed_only'
  | 'brewed_purchased'
  | 'sourced_green'
  | 'self_roasted'
  | 'resolved_reference'

export type EnrichmentStatus = 'complete' | 'usable' | 'skeleton' | 'needs-review'

export type ProducerTab =
  | 'all'
  | 'in_inventory'
  | 'roasted'
  | 'brewed'
  | 'indexed'
  | 'needs_enrichment'

// Lot lifecycle statuses that mean a held lot has entered the roast cycle (but
// is not yet resolved). `resolved` and the presence of a roast_learnings row are
// the strong "reference" signal handled separately.
const ROASTING_STATUSES = new Set([
  'waiting_for_next_roast',
  'waiting_for_next_cupping',
  'waiting_for_brewing',
])

export interface ProducerAggregate {
  key: string
  entry: ProducerEntry | null
  brews: Brew[]
  purchasedBrews: Brew[]
  selfRoastedBrews: Brew[]
  greenLots: GreenBean[]
  roastLearnings: RoastLearning[]
  /** Distinct `brews.roaster` strings observed for this producer. */
  brewedRoasters: string[]
  relationshipState: RelationshipState
  enrichmentStatus: EnrichmentStatus
}

function hasResolved(greenLots: GreenBean[], roastLearnings: RoastLearning[]): boolean {
  return roastLearnings.length > 0 || greenLots.some((g) => g.lot_status === 'resolved')
}

export function deriveRelationshipState(
  brews: Brew[],
  greenLots: GreenBean[],
  roastLearnings: RoastLearning[],
): RelationshipState {
  if (hasResolved(greenLots, roastLearnings)) return 'resolved_reference'
  if (
    greenLots.some((g) => g.lot_status != null && ROASTING_STATUSES.has(g.lot_status)) ||
    brews.some((b) => b.source === 'self-roasted')
  ) {
    return 'self_roasted'
  }
  if (greenLots.length > 0) return 'sourced_green'
  if (brews.length > 0) return 'brewed_purchased'
  return 'indexed_only'
}

export function deriveEnrichmentStatus(entry: ProducerEntry | null): EnrichmentStatus {
  // Evidence-only producer with no registry record is always usable (visible in
  // the default index), never skeleton — skeleton is a registry flag, not the
  // absence of one.
  if (!entry) return 'usable'
  if (entry.skeleton === true) return 'skeleton'
  if (
    entry.processSignatureConfidence === 'needs-review' ||
    entry.processSignatureConfidence === 'generated'
  ) {
    return 'needs-review'
  }
  if (entry.processSignatureConfidence === 'hand-authored' && entry.processSignature) {
    return 'complete'
  }
  return 'usable'
}

// ---------------------------------------------------------------------------
// Aggregation
// ---------------------------------------------------------------------------

/**
 * Build one ProducerAggregate per producer across the universe of (registry ∪
 * evidence). Registry producers with zero evidence surface as `indexed_only`
 * (catalogued, not yet sourced); evidence producers absent from the registry surface
 * with `entry: null`. Both index and detail call this with the full (tiny) row
 * sets and filter in memory — text-equality canonicalization rules out a `.eq`
 * query.
 */
export function aggregateProducers(
  brews: Brew[],
  greenLots: GreenBean[],
  roastLearnings: RoastLearning[],
): ProducerAggregate[] {
  const byKey = new Map<
    string,
    {
      brews: Brew[]
      greenLots: GreenBean[]
      roastLearnings: RoastLearning[]
    }
  >()

  const ensure = (key: string) => {
    let bucket = byKey.get(key)
    if (!bucket) {
      bucket = { brews: [], greenLots: [], roastLearnings: [] }
      byKey.set(key, bucket)
    }
    return bucket
  }

  for (const brew of brews) {
    const key = producerKey(brew.producer)
    if (!key) continue
    ensure(key).brews.push(brew)
  }

  const greenById = new Map<string, GreenBean>()
  for (const lot of greenLots) {
    greenById.set(lot.id, lot)
    const key = producerKey(lot.producer)
    if (!key) continue
    ensure(key).greenLots.push(lot)
  }

  for (const rl of roastLearnings) {
    const lot = greenById.get(rl.green_bean_id)
    const key = producerKey(lot?.producer)
    if (!key) continue
    ensure(key).roastLearnings.push(rl)
  }

  // Seed every registry producer so indexed-only producers appear.
  for (const entry of PRODUCERS) ensure(entry.name)

  const aggregates: ProducerAggregate[] = []
  for (const [key, bucket] of Array.from(byKey.entries())) {
    const entry = getProducerEntry(key)
    const purchasedBrews = bucket.brews.filter((b) => b.source === 'purchased')
    const selfRoastedBrews = bucket.brews.filter((b) => b.source === 'self-roasted')
    const brewedRoasters = bucket.brews
      .map((b) => b.roaster)
      .filter((r): r is string => !!r)
      .filter((r, i, a) => a.indexOf(r) === i)
    const relationshipState = deriveRelationshipState(
      bucket.brews,
      bucket.greenLots,
      bucket.roastLearnings,
    )
    aggregates.push({
      key: entry?.name ?? key,
      entry,
      brews: bucket.brews,
      purchasedBrews,
      selfRoastedBrews,
      greenLots: bucket.greenLots,
      roastLearnings: bucket.roastLearnings,
      brewedRoasters,
      relationshipState,
      enrichmentStatus: deriveEnrichmentStatus(entry),
    })
  }
  return aggregates
}

// ---------------------------------------------------------------------------
// Badge + tabs
// ---------------------------------------------------------------------------

export type RelationshipBadgeTone = 'blue' | 'teal' | 'amber'

/**
 * The card / header relationship badge. Three hues per the validated mockup
 * (Brewed = blue · self-roast side = teal · Target = amber); the teal family
 * carries a state-specific label (In inventory / Roasted by me / Reference) so
 * the richer relationship reads through without a fourth hue.
 */
export function relationshipBadge(
  state: RelationshipState,
): { label: string; tone: RelationshipBadgeTone } {
  switch (state) {
    case 'brewed_purchased':
      return { label: 'Brewed', tone: 'blue' }
    case 'sourced_green':
      return { label: 'In inventory', tone: 'teal' }
    case 'self_roasted':
      return { label: 'Roasted by me', tone: 'teal' }
    case 'resolved_reference':
      return { label: 'Reference', tone: 'teal' }
    case 'indexed_only':
      return { label: 'Indexed', tone: 'amber' }
  }
}

export function isVisibleInDefaultIndex(agg: ProducerAggregate): boolean {
  return agg.enrichmentStatus === 'complete' || agg.enrichmentStatus === 'usable'
}

/** Tab membership — a producer can match more than one (tabs are views, not a
 *  partition). `all` = default index (complete|usable); `needs_enrichment` =
 *  skeleton|needs-review. */
export function matchesTab(agg: ProducerAggregate, tab: ProducerTab): boolean {
  switch (tab) {
    case 'all':
      return isVisibleInDefaultIndex(agg)
    case 'needs_enrichment':
      return agg.enrichmentStatus === 'skeleton' || agg.enrichmentStatus === 'needs-review'
    case 'in_inventory':
      return (
        isVisibleInDefaultIndex(agg) &&
        (agg.relationshipState === 'sourced_green' ||
          agg.greenLots.some((g) => g.lot_status === 'in_inventory'))
      )
    case 'roasted':
      return (
        isVisibleInDefaultIndex(agg) &&
        (agg.roastLearnings.length > 0 ||
          agg.selfRoastedBrews.length > 0 ||
          agg.greenLots.some(
            (g) =>
              g.lot_status === 'resolved' ||
              (g.lot_status != null && ROASTING_STATUSES.has(g.lot_status)),
          ))
      )
    case 'brewed':
      return isVisibleInDefaultIndex(agg) && agg.purchasedBrews.length > 0
    case 'indexed':
      return isVisibleInDefaultIndex(agg) && agg.relationshipState === 'indexed_only'
  }
}

// ---------------------------------------------------------------------------
// Sorting — evidence depth → tier → brew count (open-question lean, accepted)
// ---------------------------------------------------------------------------

/** Total evidence rows — the primary sort weight. */
export function evidenceDepth(agg: ProducerAggregate): number {
  return agg.brews.length + agg.greenLots.length + agg.roastLearnings.length
}

export function compareProducers(a: ProducerAggregate, b: ProducerAggregate): number {
  const depthDelta = evidenceDepth(b) - evidenceDepth(a)
  if (depthDelta !== 0) return depthDelta
  const tierA = a.entry?.tier ?? 99
  const tierB = b.entry?.tier ?? 99
  if (tierA !== tierB) return tierA - tierB
  const brewDelta = b.brews.length - a.brews.length
  if (brewDelta !== 0) return brewDelta
  return a.key.localeCompare(b.key)
}

// ---------------------------------------------------------------------------
// Sourcing lens — channel type rough-derive (v1 lean: from importer presence)
// ---------------------------------------------------------------------------

export function channelType(entry: ProducerEntry | null): string | null {
  if (!entry) return null
  if (entry.importers.length > 0) return 'Importer-distributed'
  if (entry.exporters.length > 0) return 'Direct export'
  return 'Direct / relationship'
}

// ---------------------------------------------------------------------------
// Decision strip — 5 rule-derived cells (v1)
// ---------------------------------------------------------------------------

export interface DecisionCell {
  label: string
  value: string
}

// Lane-C / process-forward markers — heavy fermentation / engineered processing
// that risks burying terroir clarity (the apex risk for the Latent cup).
const STYLIZED_MARKERS = [
  'thermal shock',
  'double anaerobic',
  'anaerobic',
  'carbonic',
  'co-ferment',
  'co-fermentation',
  'yeast',
  'mosto',
  'mossto',
  'biocatalysis',
  'maceration',
  'nitrogen',
  'enzyme',
]

const CLARITY_MARKERS = ['clarity', 'clean washed', 'classic', 'precision washed']

function processHaystack(entry: ProducerEntry | null): string {
  if (!entry) return ''
  return [
    ...(entry.processingStyleTags ?? []),
    ...(entry.processingSystemTags ?? []),
    ...(entry.knownFor ?? []),
    entry.processSignature ?? '',
    entry.producerSystem ?? '',
  ]
    .join(' ')
    .toLowerCase()
}

function isStylized(entry: ProducerEntry | null): boolean {
  const hay = processHaystack(entry)
  return STYLIZED_MARKERS.some((m) => hay.includes(m))
}

export function latentFit(entry: ProducerEntry | null): string {
  if (!entry) return 'Unverified'
  if (entry.tier === 1) return 'High'
  if (entry.tier === 2) return 'Medium'
  return 'Exploratory'
}

export function buyPosture(agg: ProducerAggregate): string {
  const cult = agg.entry?.primaryCultivars?.[0]
  switch (agg.relationshipState) {
    case 'indexed_only':
      return 'Find a clean, disclosed lot'
    case 'resolved_reference':
      return 'Compare future lots to the reference'
    case 'self_roasted':
      return 'Continue the roast cycle'
    case 'sourced_green':
      return 'Roast the held lot'
    case 'brewed_purchased':
      return cult ? `Watch for green ${cult} lots` : 'Watch for green lots'
  }
}

export function primaryRisk(entry: ProducerEntry | null): string {
  if (!entry) return 'Unknown — unresearched'
  if (isStylized(entry)) return 'Process-forward / stylized'
  const hay = processHaystack(entry)
  if (CLARITY_MARKERS.some((m) => hay.includes(m)) || hay.includes('washed')) {
    return 'Low — clarity-forward'
  }
  return 'Moderate'
}

export function evidenceLevel(agg: ProducerAggregate): string {
  const b = agg.brews.length
  const l = agg.greenLots.length
  const r = agg.roastLearnings.length
  if (b + l + r === 0) return 'None yet'
  const tier = confidenceFor(b).label // HIGH / MEDIUM / LOW on brew count
  const word = tier === 'HIGH' ? 'Strong' : tier === 'MEDIUM' ? 'Emerging' : 'Anecdotal'
  const parts: string[] = []
  if (b) parts.push(`${b} brew${b === 1 ? '' : 's'}`)
  if (l) parts.push(`${l} lot${l === 1 ? '' : 's'}`)
  if (r) parts.push(`${r} learning${r === 1 ? '' : 's'}`)
  return `${word} (${parts.join(' · ')})`
}

export function nextAction(agg: ProducerAggregate): string {
  const posture = buyPosture(agg)
  const stylized = isStylized(agg.entry)
  if (agg.relationshipState === 'indexed_only') {
    return stylized
      ? `${posture}; confirm clarity survives the processing.`
      : `${posture}; verify disclosure before buying.`
  }
  if (agg.relationshipState === 'brewed_purchased') {
    return `${posture}; ${stylized ? 'check the green is cleanly processed.' : 'green should hold the cup.'}`
  }
  return `${posture}.`
}

export function deriveDecisionStrip(agg: ProducerAggregate): DecisionCell[] {
  return [
    { label: 'Latent fit', value: latentFit(agg.entry) },
    { label: 'Buy posture', value: buyPosture(agg) },
    { label: 'Primary risk', value: primaryRisk(agg.entry) },
    { label: 'Evidence level', value: evidenceLevel(agg) },
    { label: 'Next action', value: nextAction(agg) },
  ]
}

// ---------------------------------------------------------------------------
// Index card data — the serializable shape passed from the server page to the
// client ProducersIndex (tab + facet filtering happens client-side, so the
// payload is lightweight: counts + derived strings, never full evidence rows).
// ---------------------------------------------------------------------------

const ALL_TABS: ProducerTab[] = [
  'all',
  'in_inventory',
  'roasted',
  'brewed',
  'indexed',
  'needs_enrichment',
]

export interface ProducerCardData {
  key: string
  slug: string
  name: string
  farmName: string | null
  tier: number | null
  referenceRole: string | null
  country: string | null
  region: string | null
  producerSystem: string | null
  processSignature: string | null
  knownFor: string[]
  primaryCultivars: string[]
  relationship: { state: RelationshipState; label: string; tone: RelationshipBadgeTone }
  enrichmentStatus: EnrichmentStatus
  evidence: { brews: number; roasters: number; lots: number; learnings: number }
  evidenceDepth: number
  roasterSignals: RoasterSignal[]
  nextAction: string
  /** Which tabs this producer belongs to (tabs are views, not a partition). */
  tabs: ProducerTab[]
  // facet fields
  processTags: string[]
  marketTier: string | null
}

export function toCardData(agg: ProducerAggregate): ProducerCardData {
  const e = agg.entry
  return {
    key: agg.key,
    slug: encodeURIComponent(agg.key),
    name: e?.displayName ?? e?.name ?? agg.key,
    farmName: e?.farmName ?? null,
    tier: e?.tier ?? null,
    referenceRole: e?.referenceRole ?? null,
    country: e?.country ?? null,
    region: e?.adminRegion ?? null,
    producerSystem: e?.producerSystem ?? null,
    processSignature: e?.processSignature ?? null,
    knownFor: e?.knownFor ?? [],
    primaryCultivars: e?.primaryCultivars ?? [],
    relationship: {
      state: agg.relationshipState,
      ...relationshipBadge(agg.relationshipState),
    },
    enrichmentStatus: agg.enrichmentStatus,
    evidence: {
      brews: agg.brews.length,
      roasters: agg.brewedRoasters.length,
      lots: agg.greenLots.length,
      learnings: agg.roastLearnings.length,
    },
    evidenceDepth: evidenceDepth(agg),
    roasterSignals: roasterSignals(agg),
    nextAction: nextAction(agg),
    tabs: ALL_TABS.filter((t) => matchesTab(agg, t)),
    processTags: e?.processingStyleTags ?? [],
    marketTier: e?.marketTier ?? null,
  }
}

// ---------------------------------------------------------------------------
// Roaster signal — roasterReferences with a ✓ where actually brewed
// ---------------------------------------------------------------------------

export interface RoasterSignal {
  name: string
  brewed: boolean
}

/**
 * `roasterReferences` annotated with whether each roaster appears in this
 * producer's `brews.roaster` set (the ✓-brewed tick). No "followed" indicator —
 * there is no follow-roasters concept in Latent.
 */
export function roasterSignals(agg: ProducerAggregate): RoasterSignal[] {
  const refs = agg.entry?.roasterReferences ?? []
  // Canonicalize both sides through the roaster registry so a short-form
  // reference ("Moonwake") still ticks against the canonical brew value
  // ("Moonwake Coffee Roasters").
  const canon = (s: string) => (ROASTER_LOOKUP.canonicalize(s) ?? s).toLowerCase()
  const brewedSet = new Set(agg.brewedRoasters.map(canon))
  return refs.map((name) => ({ name, brewed: brewedSet.has(canon(name)) }))
}
