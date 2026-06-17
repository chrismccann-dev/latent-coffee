import { createClient } from '@/lib/supabase/server'
import { GreenBean } from '@/lib/types'
import { IndexCap, LotStage } from '@/components/IndexList'
import { GreenCard, type GreenCardData } from '@/components/GreenCard'
import {
  extractBatchNumber,
  lifecycleSectionTitle,
  pickLatestExperiment,
  resolveLifecycleState,
  type LifecycleState,
} from '@/lib/lifecycle-state'

// /green index — lifecycle-sectioned lot-card grid (side-quest MB-6,
// 2026-05-30). Replaces the flat GrlRow list (Sub Pages 6.2) with a
// BrewCard-style card grid, one grid per lifecycle section. Lifecycle sections
// are preserved (Chris's MB-6 call: "yes lifecycles survive, that's one of the
// most important things") — the v2 §04 lot-card grid that Redesign Sprint 6 PR1
// rejected is now adopted, but grouped by state rather than flattened.
//
// State is the stored green_beans.lot_status with derived fallback
// (resolveLifecycleState, migration 080 / ADR-0024 § 6) — pre-080 rows are
// NULL and keep rendering from the derived computation unchanged.
// In-inventory lots ARE surfaced as of migration 082 (2026-06-17), positioned
// last (below Unresolved) — this index IS the inventory page that
// docs/roasting/redesign.md § 5.1 deferred to.
//
// Section order is the user's mental order (active work first, archive, then
// inventory last):
// 1. Waiting for next roast — design landed, roasts pending
// 2. Waiting for next cupping — roasts done, cuppings + synthesis pending
// 3. Waiting for brewing — ball in the brewing court (SPG execution or
//    optimized brew, claude.ai-side). Stored-only state; derivation can't
//    see the handoff. Lot Coordinator dogfood (2026-06-11).
// 4. Resolved — reference roast confirmed, archival
// 5. Unresolved — closed without confirmed reference (we learned something
//    but didn't reach a verdict). Sub-sprint 4a (2026-05-27).
// 6. In inventory — sitting in storage awaiting first roast (no experiment
//    yet). Surfaced last, below Unresolved, per Chris's call (migration 082,
//    2026-06-17). Phase 2 adds the roast_priority stack-rank ordering here.
//
// Card content is state-dependent (see GreenCard.tsx): active lots show
// identity + lot code; resolved / unresolved lots show the reference/leading
// brew's tasting notes + reference batch + the V-set/roast/cupping tally.

const SECTION_ORDER: LifecycleState[] = [
  'waiting_for_next_roast',
  'waiting_for_next_cupping',
  'waiting_for_brewing',
  'resolved',
  'unresolved',
  // Inventory surface (migration 082, 2026-06-17): in_inventory lots are now
  // rendered, positioned LAST — below Unresolved on the navigation spine, per
  // Chris's call. Lots sitting in storage awaiting their first roast (no
  // experiment yet). Previously filtered out; this IS the inventory page.
  'in_inventory',
]

const ARCHIVE_STATES = new Set<LifecycleState>(['resolved', 'unresolved'])

type GreenBeanIndexRow = GreenBean & {
  // is_one_shot lives on the green_beans table but isn't in the GreenBean type.
  is_one_shot: boolean | null
  experiments: Array<{
    id: string
    experiment_id: string | null
    batch_ids: string | null
    winner: string | null
    created_at: string | null
  }>
  roasts: Array<{
    id: string
    batch_id: string | null
    cuppings: Array<{ id: string }> | null
  }>
  roast_learnings: Array<{
    id: string
    best_batch_id: string | null
    best_roast_id: string | null
    why_this_roast_won: string | null
  }>
  brews: Array<{
    id: string
    roast_id: string | null
    flavor_notes: string[] | null
    created_at: string | null
  }>
}

// Lifecycle-tile gradient (Redesign Sprint 0, 2026-05-29): green-coffee →
// roasted-coffee across the stages — leaf green (next-roast) → olive-bronze
// (next-cupping) → roasted brown (resolved). Unresolved keeps neutral mid
// grey (`--mid`, polish-audit Pass 1 — `--subtle` put near-white face text at
// ~1.9:1): it sits outside the green-brown axis to signal "no verdict"
// distinctly from both active and confirmed lots. The card uses this as the
// face background; light text reads cleanly on all five.
const TILE_COLOR: Record<LifecycleState, string> = {
  in_inventory: 'var(--tile-inventory)',
  waiting_for_next_roast: 'var(--tile-next-roast)',
  waiting_for_next_cupping: 'var(--tile-next-cupping)',
  // Steel blue — water. Hue shift off the green-brown roast axis to signal
  // "with brewing, not roasting" distinctly (hue-not-lightness rule).
  waiting_for_brewing: 'var(--tile-brewing)',
  resolved: 'var(--tile-resolved)',
  unresolved: 'var(--mid)',
}

export default async function GreenBeansPage() {
  const supabase = createClient()

  // Fetch shape covers computeLifecycleState's inputs + everything the card
  // builder reads: experiment_id (V-set pill), roasts.batch_id (authoritative
  // reference batch via best_roast_id), nested cuppings (tally + cupping gate),
  // and brews (flavor line on archive cards, picked by roast_id = best_roast_id).
  const { data: greenBeans, error } = await supabase
    .from('green_beans')
    .select(
      `
      *,
      experiments(id, experiment_id, batch_ids, winner, created_at),
      roasts(id, batch_id, cuppings(id)),
      roast_learnings(id, best_batch_id, best_roast_id, why_this_roast_won),
      brews!green_bean_id(id, roast_id, flavor_notes, created_at)
    `,
    )
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching green beans:', error)
  }

  const beans = (greenBeans || []) as GreenBeanIndexRow[]

  // Group by lifecycle state. Every state in SECTION_ORDER renders, including
  // in_inventory (appended last, migration 082). A state not in SECTION_ORDER
  // (none today) would be skipped by the guard below.
  const beansByState = new Map<LifecycleState, GreenBeanIndexRow[]>()
  for (const bean of beans) {
    const state = resolveLifecycleState(bean.lot_status, bean)
    if (!SECTION_ORDER.includes(state)) continue
    const arr = beansByState.get(state) ?? []
    arr.push(bean)
    beansByState.set(state, arr)
  }

  const totalSurfaced = SECTION_ORDER.map((s) => beansByState.get(s)?.length ?? 0).reduce(
    (a, b) => a + b,
    0,
  )

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <IndexCap left="GREEN" right={`${totalSurfaced} ${totalSurfaced === 1 ? 'LOT' : 'LOTS'}`} />

      {/* Empty state. Sub Pages 6.6 (2026-05-13) — claude.ai via the Latent
       * MCP server is the sole writer for every roasting-side entity. The
       * legacy /add?type=self-roasted CTA was removed; new lots land here
       * once a roasting session in claude.ai calls push_green_bean. */}
      {totalSurfaced === 0 ? (
        <div className="text-center py-16">
          <p className="font-mono text-sm text-latent-mid mb-3">NO GREEN BEANS YET</p>
          <p className="text-sm text-latent-mid max-w-sm mx-auto">
            Lots land here once a roasting session in claude.ai writes via the Latent MCP server.
            Open a roasting session to add your first lot.
          </p>
        </div>
      ) : (
        <div>
          {SECTION_ORDER.map((state) => {
            const lots = beansByState.get(state) ?? []
            if (lots.length === 0) return null
            return <LifecycleSection key={state} state={state} lots={lots} />
          })}
        </div>
      )}
    </div>
  )
}

function LifecycleSection({ state, lots }: { state: LifecycleState; lots: GreenBeanIndexRow[] }) {
  const title = lifecycleSectionTitle(state)
  // Right-column label: "Stage" for active sections, "Reference" for the
  // archive sections (resolved + unresolved) — matches Chris's MB-6 mock.
  const columnHeader = ARCHIVE_STATES.has(state) ? 'Reference' : 'Stage'

  return (
    <section className="mb-8">
      <LotStage
        title={title}
        summary={`${lots.length} ${lots.length === 1 ? 'lot' : 'lots'}`}
        rightLabel={columnHeader}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-3">
        {lots.map((bean) => (
          <GreenCard key={bean.id} lot={buildCardData(bean, state)} />
        ))}
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Card data builder
// ---------------------------------------------------------------------------

// Build the presentational GreenCardData from a joined bean row + its computed
// lifecycle state. Owns the FK joins + pick logic so GreenCard stays a dumb
// renderer.
//
// NOTE: pickLatestExperiment is shared from lib/lifecycle-state.ts. formatVLabel
// and pickRefBrew are kept local — the detail view (app/(app)/green/[id]/page.tsx)
// has near-twins, but their contracts differ deliberately (detail's formatVLabel
// returns "V?" on null to always render a label; here we return null to omit the
// pill), so merging would change behavior.
function buildCardData(bean: GreenBeanIndexRow, state: LifecycleState): GreenCardData {
  const learnings = bean.roast_learnings?.[0]
  const bestRoastId = learnings?.best_roast_id ?? null

  // Authoritative reference batch: best_roast_id → roasts.batch_id. The
  // free-text roast_learnings.best_batch_id field has historically drifted
  // (CGLE Sudan Rume Natural's best_batch_id once said "185" while its actual
  // reference roast was batch 187 — since corrected in the data), so the
  // FK-derived value wins; best_batch_id is the fallback.
  const refRoast = bestRoastId ? bean.roasts?.find((r) => r.id === bestRoastId) : null
  const batchNum =
    extractBatchNumber(refRoast?.batch_id) ?? extractBatchNumber(learnings?.best_batch_id)

  const archive = ARCHIVE_STATES.has(state)

  // --- Face pill ---
  let pill: string | null = null
  if (archive) {
    pill = batchNum ? `#${batchNum}` : null
  } else if (bean.is_one_shot) {
    pill = 'ONE-SHOT'
  } else {
    const latestExp = pickLatestExperiment(bean.experiments ?? [])
    pill = latestExp ? formatVLabel(latestExp.experiment_id) : null
  }

  // --- Face lines ---
  const identityLine =
    [bean.origin, bean.variety, bean.process].filter(Boolean).join(' · ') || null
  const refBrew = pickRefBrew(bean.brews ?? [], bestRoastId)
  const flavorLine =
    refBrew?.flavor_notes && refBrew.flavor_notes.length > 0
      ? refBrew.flavor_notes.slice(0, 6).join(' · ')
      : null

  // --- Foot ---
  const lotCode = bean.lot_id ?? null
  let referenceLabel: string | null = null
  let summaryLine: string | null = null
  if (state === 'resolved') {
    referenceLabel = batchNum ? `Reference: Batch #${batchNum}` : null
  } else if (state === 'unresolved') {
    referenceLabel = batchNum ? `Leading Candidate: Batch #${batchNum}` : null
  }
  if (archive) {
    summaryLine = bean.is_one_shot ? 'One-Shot Lot' : composeTally(bean)
  }

  return {
    id: bean.id,
    name: bean.name || bean.lot_id,
    tileColor: TILE_COLOR[state],
    state,
    pill,
    identityLine,
    flavorLine,
    lotCode,
    referenceLabel,
    summaryLine,
  }
}

// "5 V-Sets · 16 Roasts · 20 Cuppings". V-Sets = experiment count, Roasts =
// roast-row count, Cuppings = cuppings nested under all roasts. Mirrors the
// resolved detail page's tally.
function composeTally(bean: GreenBeanIndexRow): string {
  const nExp = bean.experiments?.length ?? 0
  const nRoasts = bean.roasts?.length ?? 0
  const nCuppings = (bean.roasts ?? []).reduce((sum, r) => sum + (r.cuppings?.length ?? 0), 0)
  return [
    `${nExp} ${nExp === 1 ? 'V-Set' : 'V-Sets'}`,
    `${nRoasts} ${nRoasts === 1 ? 'Roast' : 'Roasts'}`,
    `${nCuppings} ${nCuppings === 1 ? 'Cupping' : 'Cuppings'}`,
  ].join(' · ')
}

// Parse the V-number out of an experiment_id ("...-V3" → "V3", "RANCHO-...-V1"
// → "V1"). Mirrors the detail page's formatVLabel.
function formatVLabel(experimentId: string | null | undefined): string | null {
  if (!experimentId) return null
  const match = experimentId.match(/[vV](\d+)(?!.*[vV]\d)/)
  if (match) return `V${match[1]}`
  return experimentId
}

// Reference/leading brew for the lot: prefer roast_id === bestRoastId (the
// canonical reference-roast brew, even when the lot has several brews of other
// batches), fall back to the first brew. Mirrors pickOptimizedBrew.
function pickRefBrew(
  brews: GreenBeanIndexRow['brews'],
  bestRoastId: string | null,
): GreenBeanIndexRow['brews'][number] | null {
  if (brews.length === 0) return null
  if (bestRoastId) {
    const matched = brews.find((b) => b.roast_id === bestRoastId)
    if (matched) return matched
  }
  return brews[0] ?? null
}
