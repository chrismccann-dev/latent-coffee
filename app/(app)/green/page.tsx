import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { GreenBean } from '@/lib/types'
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
//
// Row shape mirrors the scope-doc mockup: tile color + lot name + metadata
// line + right-aligned stage label. The tile color signals state (sage =
// active, near-black = resolved/roasted) — green-to-brown is a real hue shift
// representing green coffee → roasted coffee, fits the design-conventions
// "hue-not-lightness" rule.

const SECTION_ORDER: LifecycleState[] = [
  'waiting_for_next_roast',
  'waiting_for_next_cupping',
  'resolved',
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
      roast_learnings(id, best_batch_id, best_roast_id)
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
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-mono text-xs font-semibold tracking-wide uppercase text-latent-mid">
          GREEN BEANS
        </h1>
        <div className="font-mono text-xs text-latent-mid">
          {totalSurfaced} {totalSurfaced === 1 ? 'LOT' : 'LOTS'}
        </div>
      </div>

      {/* Empty state */}
      {totalSurfaced === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-latent-accent rounded-lg mx-auto mb-6 flex items-center justify-center">
            <span className="text-2xl">🌱</span>
          </div>
          <p className="font-mono text-sm text-latent-mid mb-6">NO GREEN BEANS YET</p>
          {/*
           * /add?type=self-roasted is the legacy form path. Slated for
           * deprecation in Sub Pages 6.6 per the MCP-only-input direction
           * (see feedback_mcp_only_input.md). Leaving the empty-state CTA
           * in place through 6.6; the route still works today.
           */}
          <Link href="/add?type=self-roasted" className="btn btn-primary">
            + ADD YOUR FIRST LOT
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
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
  const isResolved = state === 'resolved'
  const title = lifecycleSectionTitle(state)
  // Right-column header: "Stage" for active sections, "Reference" for
  // resolved. Scope doc § 5.1 keeps the column header even though it's
  // redundant with the section title — confirms the grouping at a glance
  // without scrolling back up.
  const columnHeader = isResolved ? 'Reference' : 'Stage'

  return (
    <section>
      <div className="flex justify-between items-baseline mb-3">
        <h2 className="font-sans text-sm font-semibold text-latent-fg">{title}</h2>
        <div className="font-sans text-xs text-latent-mid">{columnHeader}</div>
      </div>
      <div>
        {lots.map((bean) => (
          <LifecycleRow key={bean.id} bean={bean} state={state} />
        ))}
      </div>
    </section>
  )
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

  // Tile color signals lifecycle state. Sage (`latent-accent-light`) for
  // active lots (still iterating); near-black (`latent-fg`) for resolved
  // lots (roasted + archived). Hue shift, not just darker — green-to-brown
  // is a real semantic step. Both are existing chrome tokens, no new tokens
  // added.
  const tileClass = state === 'resolved' ? 'bg-latent-fg' : 'bg-latent-accent-light'

  // Metadata line — origin · variety · process. Skips empties so pre-
  // framework lots (e.g. Rancho Tio with no origin) don't render dangling
  // separators.
  const metaParts = [bean.origin, bean.variety, bean.process].filter(Boolean)

  return (
    <Link
      href={`/green/${bean.id}`}
      className="flex items-center gap-5 py-4 border-b border-latent-border hover:bg-latent-highlight/30 transition-colors -mx-4 px-4"
    >
      <div className={`w-12 h-12 ${tileClass} rounded flex-shrink-0`} />
      <div className="flex-1 min-w-0">
        <h3 className="font-sans text-sm font-semibold truncate">
          {bean.name || bean.lot_id}
        </h3>
        {metaParts.length > 0 && (
          <p className="font-sans text-xs text-latent-mid truncate">
            {metaParts.join(' · ')}
          </p>
        )}
      </div>
      <div className="font-sans text-xs text-latent-mid flex-shrink-0">{stageLabel}</div>
    </Link>
  )
}
