import { createClient } from '@/lib/supabase/server'
import { GreenBean } from '@/lib/types'
import { IndexCap, LotStage, GrlRow } from '@/components/IndexList'
import {
  computeLifecycleState,
  extractBatchNumber,
  lifecycleSectionTitle,
  lifecycleStageLabel,
  type LifecycleState,
} from '@/lib/lifecycle-state'

// Sub Pages 6.2 (2026-05-13). Replaces the flat card grid with 3 lifecycle-
// state sections. State derived on read via computeLifecycleState (no stored
// `status` column on green_beans). In-inventory lots are not surfaced — per
// docs/roasting/redesign.md § 5.1 they wait for the eventual inventory page.
//
// Section order is the user's mental order (active work first, archive last):
// 1. Waiting for next roast — design landed, roasts pending
// 2. Waiting for next cupping — roasts done, cuppings + synthesis pending
// 3. Resolved — reference roast confirmed, archival
// 4. Unresolved — closed without confirmed reference (we learned something
//    but didn't reach a verdict). Sub-sprint 4a (2026-05-27).
//
// Row shape mirrors the scope-doc mockup: tile color + lot name + metadata
// line + right-aligned stage label. The tile color signals state (sage =
// active, near-black = resolved/roasted, gray = unresolved/incomplete) —
// green-to-brown is a real hue shift representing green coffee → roasted
// coffee; gray for unresolved signals "incomplete answer" without claiming
// a verdict. All token choices fit the design-conventions "hue-not-lightness"
// rule.

const SECTION_ORDER: LifecycleState[] = [
  'waiting_for_next_roast',
  'waiting_for_next_cupping',
  'resolved',
  'unresolved',
]

type GreenBeanIndexRow = GreenBean & {
  experiments: Array<{
    id: string
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
}

export default async function GreenBeansPage() {
  const supabase = createClient()

  // Fetch shape covers everything computeLifecycleState reads + the resolved
  // row's reference-batch label (from roast_learnings.best_batch_id).
  // cuppings nested under roasts so the cupping-presence gate ties to its
  // specific roast (matters when a batch_id matches the latest experiment but
  // its cuppings haven't landed yet).
  const { data: greenBeans, error } = await supabase
    .from('green_beans')
    .select(
      `
      *,
      experiments(id, batch_ids, winner, created_at),
      roasts(id, batch_id, cuppings(id)),
      roast_learnings(id, best_batch_id, best_roast_id, why_this_roast_won)
    `,
    )
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching green beans:', error)
  }

  const beans = (greenBeans || []) as GreenBeanIndexRow[]

  // Group by lifecycle state. In-inventory lots are computed but never
  // rendered — the index intentionally surfaces only the 3 active states.
  const beansByState = new Map<LifecycleState, GreenBeanIndexRow[]>()
  for (const bean of beans) {
    const state = computeLifecycleState(bean)
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
    <div className="max-w-3xl mx-auto px-6 py-8">
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
  // Right-column label: "Stage" for active sections, "Reference" for
  // resolved, "Status" for unresolved (the lot has no reference to point at;
  // the right column reads "Closed without reference" which is a status,
  // not a stage). Scope doc § 5.1 keeps the label even though it's redundant
  // with the section title — confirms the grouping at a glance.
  const columnHeader =
    state === 'resolved' ? 'Reference' : state === 'unresolved' ? 'Status' : 'Stage'

  return (
    <section>
      <LotStage
        title={title}
        summary={`${lots.length} ${lots.length === 1 ? 'lot' : 'lots'}`}
        rightLabel={columnHeader}
      />
      <div>
        {lots.map((bean) => (
          <LifecycleRow key={bean.id} bean={bean} state={state} />
        ))}
      </div>
    </section>
  )
}

// Lifecycle-tile gradient (Redesign Sprint 0, 2026-05-29): green-coffee →
// roasted-coffee across the stages — sage (next-roast) → olive-bronze
// (next-cupping) → roasted brown (resolved, ratification #5). Unresolved
// keeps neutral gray (`--subtle`): it sits outside the green-brown axis to
// signal "no verdict" distinctly from both active and confirmed lots.
const TILE_COLOR: Record<LifecycleState, string> = {
  in_inventory: 'var(--tile-inventory)',
  waiting_for_next_roast: 'var(--tile-next-roast)',
  waiting_for_next_cupping: 'var(--tile-next-cupping)',
  resolved: 'var(--tile-resolved)',
  unresolved: 'var(--subtle)',
}

function LifecycleRow({ bean, state }: { bean: GreenBeanIndexRow; state: LifecycleState }) {
  // best_batch_id is free text ("133" / "Batch 139" / "#94" / "Batch #25");
  // extractBatchNumber strips the prefix so we don't double up "Batch #" on
  // compose. Resolved-without-best_batch_id falls back to the generic
  // "Reference" label from lifecycleStageLabel.
  const learnings = bean.roast_learnings?.[0]
  const stripped = extractBatchNumber(learnings?.best_batch_id)
  const referenceLabel = stripped ? `Batch #${stripped}` : null
  const stageLabel = lifecycleStageLabel(state, referenceLabel)

  // Metadata line — origin · variety · process. Skips empties so pre-
  // framework lots (e.g. Rancho Tio with no origin) don't render dangling
  // separators.
  const metaParts = [bean.origin, bean.variety, bean.process].filter(Boolean)

  return (
    <GrlRow
      href={`/green/${bean.id}`}
      tileColor={TILE_COLOR[state]}
      name={bean.name || bean.lot_id}
      meta={metaParts.length > 0 ? metaParts.join(' · ') : undefined}
      right={stageLabel}
    />
  )
}
