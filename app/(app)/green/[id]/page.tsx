import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SectionCard } from '@/components/SectionCard'
import { GreenBeanInfoCard } from '@/components/GreenBeanInfoCard'
import { RoastLogTable } from '@/components/RoastLogTable'
import { computeLifecycleState } from '@/lib/lifecycle-state'
import type { RoastRecipe } from '@/lib/types'

// Sub Pages 6.3 (2026-05-13). /green/[id] is now state-driven per the scope
// doc § 5 — one URL renders one of 3 page shapes based on the lifecycle state
// computed from joined data. 6.3 ships the waiting-for-next-roast shape; 6.4
// + 6.5 add the cupping + resolved shapes. Until those land, lots in other
// states fall back to the legacy single-shape render below.

function LearningField({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div>
      <div className="label">{label}</div>
      {value}
    </div>
  )
}

export default async function GreenBeanDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  // Fetch shape extended for 6.1+ — recipes via roasts.recipe join + nested
  // cuppings so lifecycle-state derivation matches the index page's compute.
  // Recipes-per-experiment join (`recipes:roast_recipes(...)`) is what the new
  // waiting-for-next-roast shape needs — it surfaces the design intent for
  // the latest V_n separate from the roast log's as-recorded facts.
  const { data: bean, error } = await supabase
    .from('green_beans')
    .select(`
      *,
      terroir:terroirs(*),
      cultivar:cultivars(*),
      roasts(*, cuppings(id)),
      experiments(*),
      roast_learnings(*),
      recipes:roast_recipes(*)
    `)
    .eq('id', params.id)
    .single()

  if (error || !bean) {
    notFound()
  }

  // Get cuppings for each roast (top-level fetch, full records). The nested
  // cuppings(id) join above is just for lifecycle-state cupping-presence
  // signal; the legacy render below needs full cupping rows.
  const roastIds = bean.roasts?.map((r: any) => r.id) || []
  let cuppings: any[] = []
  if (roastIds.length > 0) {
    const { data } = await supabase
      .from('cuppings')
      .select('*')
      .in('roast_id', roastIds)
      .order('cupping_date', { ascending: true })
    cuppings = data || []
  }

  const { data: relatedBrews } = await supabase
    .from('brews')
    .select('id, coffee_name')
    .eq('green_bean_id', params.id)

  // Lifecycle dispatch — 6.3 shipped waiting-for-next-roast; 6.4 added
  // waiting-for-next-cupping; resolved + in_inventory fall through to the
  // legacy render until 6.5 ships the resolved-view shape.
  const state = computeLifecycleState(bean)
  if (state === 'waiting_for_next_roast') {
    return <WaitingForNextRoastView bean={bean} cuppings={cuppings} />
  }
  if (state === 'waiting_for_next_cupping') {
    return <WaitingForNextCuppingView bean={bean} cuppings={cuppings} />
  }

  return <LegacyDetailRender bean={bean} cuppings={cuppings} relatedBrews={relatedBrews ?? []} />
}

// ---------------------------------------------------------------------------
// Sub Pages 6.3 — Waiting-for-next-roast view
//
// Scope doc § 5.2. The page Claude just designed V_n recipes for. Top sections:
//   1. Lot header (color tile + name + lot_id + meta)
//   2. Roasts · V_n card — Primary Question + Roast Hypothesis transposed
//      table (attributes as rows, batches as columns) + Drop Rules card
//   3. Green Bean Info card
//   4. Roast Log card (current-experiment rows highlighted)
//   5. Additional Information collapsed block
//
// Today's data shape note (2026-05-13): no recipes link to any experiment yet
// — the 129 backfilled recipes were created 1:1 from existing roasts with
// experiment_id NULL (scope doc § 7 "no aggressive dedupe"). So the
// transposed table will render empty cells on today's 4 lots in this state
// until claude.ai pushes new recipes via push_roast_recipe (which sets the
// experiment_id + predictions). Page is built for the new workflow.
// ---------------------------------------------------------------------------

function WaitingForNextRoastView({
  bean,
  cuppings,
}: {
  bean: any
  cuppings: any[]
}) {
  // Latest experiment by created_at desc (matches lifecycle-state derivation
  // for "current V_n"). If no experiments yet (pre-framework legacy lot,
  // e.g. Rancho Tio with 1 roast and 0 experiments), surface a placeholder
  // explaining the next move.
  const experiments = (bean.experiments ?? []) as any[]
  const latestExp = experiments.length
    ? [...experiments].sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''))[0]
    : null

  // Recipes for the latest experiment, sorted by batch_slot. When recipes
  // have explicit batch_slot values (v1a/v1b/v1c) we sort by them; otherwise
  // fall back to created_at order so the table columns stay deterministic.
  const allRecipes = (bean.recipes ?? []) as RoastRecipe[]
  const recipesForLatest = latestExp
    ? allRecipes
        .filter((r) => r.experiment_id === latestExp.id)
        .sort((a, b) => {
          if (a.batch_slot && b.batch_slot) return a.batch_slot.localeCompare(b.batch_slot)
          return (a.created_at ?? '').localeCompare(b.created_at ?? '')
        })
    : []

  // Current-experiment batch IDs as a Set for fast Roast Log highlighting.
  const currentExpBatchIds = parseBatchIdsForHighlight(latestExp?.batch_ids)

  // Roasts ordered by date ascending (chronological reading order in the log).
  const roasts = ((bean.roasts ?? []) as any[]).slice().sort((a, b) => {
    const ad = a.roast_date ?? a.created_at ?? ''
    const bd = b.roast_date ?? b.created_at ?? ''
    return ad.localeCompare(bd)
  })

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Back */}
      <Link
        href="/green"
        className="font-mono text-xs text-latent-mid hover:text-latent-fg mb-6 inline-block"
      >
        ← Back to Green Beans
      </Link>

      {/* Lot header — sage tile matches the /green index "active" state.
          Tabler ti-leaf swap (scope doc § 9) still deferred — no icon library
          installed yet; 🌱 emoji holds until a dedicated icon-library
          decision lands. */}
      <div className="flex gap-6 mb-8">
        <div className="w-20 h-20 bg-latent-accent-light rounded-md flex-shrink-0" />
        <div>
          <h1 className="font-sans text-2xl font-semibold mb-2">
            🌱 {bean.name || bean.lot_id}
          </h1>
          {bean.lot_id && (
            <div className="font-mono text-xs text-latent-mid mb-1">
              Lot: {bean.lot_id}
            </div>
          )}
          <div className="font-mono text-sm text-latent-mid">
            {[bean.origin, bean.variety, bean.process].filter(Boolean).join(' · ')}
          </div>
        </div>
      </div>

      {/* Roasts · V_n card. The V-label comes from experiment_id when set
          (e.g. "MX-DEV-v3" → "V3"); falls back to the full label otherwise. */}
      {latestExp ? (
        <SectionCard title={`ROASTS · ${formatVLabel(latestExp.experiment_id)}`}>
          {/* Primary Question — prose */}
          {latestExp.primary_question && (
            <div className="mb-6">
              <div className="label">Primary Question</div>
              <div className="font-sans text-sm leading-relaxed">
                {latestExp.primary_question}
              </div>
            </div>
          )}

          {/* Roast Hypothesis sub-block. Header line composes anchor +
              ceiling + window from per-recipe data when available; falls
              back to a generic "Hypothesis" header otherwise. The
              transposed table is the load-bearing surface. */}
          <div>
            <div className="label mb-2">Roast Hypothesis</div>
            {recipesForLatest.length > 0 ? (
              <HypothesisTable recipes={recipesForLatest} />
            ) : (
              <div className="font-sans text-sm text-latent-mid italic">
                No recipes linked to this experiment yet. Recipes land when
                claude.ai pushes them via the push_roast_recipe MCP Tool —
                each batch (v_na / v_nb / v_nc) becomes one recipe row with
                curves, drop rules, and design-time predictions. Today the
                experiment frame is here ({experiments.length === 1 ? '1 experiment' : `${experiments.length} experiments`}{' '}
                logged for this lot, latest: {latestExp.experiment_id}); the
                per-batch design intent is pending.
              </div>
            )}
          </div>

          {/* Drop Rules — only renders if at least one recipe has a rule.
              Amber-tinted surface (latent-roast-emphasis tokens, added Sub
              Pages 6.4) per scope doc § 5.5 — drop rules are roast-side
              signals to watch during execution. */}
          {recipesForLatest.some((r) => r.drop_rule_if_fast || r.drop_rule_if_slow) && (
            <div className="mt-6">
              <DropRulesCard recipes={recipesForLatest} />
            </div>
          )}
        </SectionCard>
      ) : (
        <SectionCard title="ROASTS">
          {/* Rancho-Tio edge case: roasts exist but no experiments. The
              lifecycle state still routes here (pre-framework legacy upload
              gets waiting_for_next_roast per the lifecycle helper's edge
              case rules). Surface the gap explicitly so the user knows the
              next move is design a V-set in claude.ai. */}
          <div className="font-sans text-sm text-latent-mid italic">
            No experiments designed yet for this lot. Roasts logged but no
            V-set framing — design the first experiment in claude.ai via
            push_experiment + push_roast_recipe to populate this surface.
          </div>
        </SectionCard>
      )}

      {/* Green Bean Info + Roast Log — shared components (Sub Pages 6.4
          extraction). The roast log highlights rows belonging to the current
          experiment via the highlightedBatchIds prop. */}
      <GreenBeanInfoCard bean={bean} />

      <RoastLogTable
        roasts={roasts}
        cuppings={cuppings}
        highlightedBatchIds={Array.from(currentExpBatchIds)}
      />

      {/* Additional Information — collapsed block for the rest. Defers the
          deep surface (roast learnings prose / cupping history / experiments
          archive / related brews) to 6.5 when the resolved-view shape lands.
          For now: collapsed details summary with a hint about what's
          deferred. Keeps the active page focused on "what's queued to
          roast" while not erasing the existing surface. */}
      <details className="mt-6 group">
        <summary className="cursor-pointer font-mono text-xs text-latent-mid hover:text-latent-fg uppercase tracking-wide">
          Additional Information
        </summary>
        <div className="mt-4 font-sans text-sm text-latent-mid italic">
          Deeper detail (cupping history, all experiments, roast learnings,
          related brews) renders on the resolved-lot page shape in Sub Pages
          6.5. The waiting-for-next-roast view stays focused on what's
          queued. To see the full archive surface today, the legacy detail
          render is still available — it's just no longer routed to for
          waiting-for-next-roast lots once 6.3 ships.
        </div>
      </details>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Helpers for the waiting-for-next-roast view
// ---------------------------------------------------------------------------

// "MX-DEV-v3" → "V3" / "CGLE-SRUME-NATURAL-2026-V4" → "V4" / "v1-peak-spread"
// → "V1". Matches the trailing v|V + digit run; falls back to the full
// label if no version segment is present.
function formatVLabel(experimentId: string | null | undefined): string {
  if (!experimentId) return 'V?'
  const match = experimentId.match(/[vV](\d+)(?!.*[vV]\d)/)
  if (match) return `V${match[1]}`
  return experimentId
}

// Parse batch_ids text ("167, 168, 169" or "139-141") into a Set<string> for
// fast "is this roast row in the current experiment?" membership checks.
// Mirrors parseBatchIds in lib/lifecycle-state.ts but inlined here to avoid
// importing it just for one display concern.
function parseBatchIdsForHighlight(raw: string | null | undefined): Set<string> {
  if (!raw) return new Set()
  const out = new Set<string>()
  for (const tok of raw.split(/[,;]/).map((s) => s.trim()).filter(Boolean)) {
    const rangeMatch = tok.match(/^(\d+)\s*-\s*(\d+)$/)
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1], 10)
      const end = parseInt(rangeMatch[2], 10)
      if (Number.isFinite(start) && Number.isFinite(end) && end >= start && end - start < 100) {
        for (let i = start; i <= end; i++) out.add(String(i))
        continue
      }
    }
    out.add(tok)
    const numeric = tok.match(/\d+/)
    if (numeric) out.add(numeric[0])
  }
  return out
}

// Transposed batch table — attributes as rows, batches as columns. Each row
// only renders if at least one recipe has a non-null value for that field
// (so the table stays compact when predictions are sparsely populated). The
// "Hypothesis" row maps to roast_recipes.rationale (per-batch prose) which
// is distinct from the freer notes catch-all.
//
// Lever rows (Drop temp + Peak inlet) get the roast-emphasis amber tint when
// their values vary across batches — scope doc § 5.5 calls these out as the
// design knobs to watch during the roast. Other rows (Expected FC / Total /
// End Condition / Agtron / Hypothesis) are descriptive, not levers, so they
// keep neutral treatment even when their values diverge.
function HypothesisTable({ recipes }: { recipes: RoastRecipe[] }) {
  type RowSpec = {
    label: string
    getValue: (r: RoastRecipe) => React.ReactNode
    has: (r: RoastRecipe) => boolean
    isLever?: boolean
    // Raw value for variance detection — kept separate from getValue so the
    // React-node return of getValue doesn't have to be stringified.
    rawValue?: (r: RoastRecipe) => string | null
  }

  const rows: RowSpec[] = [
    {
      label: 'Drop temp',
      getValue: (r) =>
        r.end_condition_type === 'bean_temp' && r.end_condition_target != null
          ? `${r.end_condition_target}°C`
          : '—',
      has: (r) => r.end_condition_type === 'bean_temp' && r.end_condition_target != null,
      isLever: true,
      rawValue: (r) =>
        r.end_condition_type === 'bean_temp' && r.end_condition_target != null
          ? String(r.end_condition_target)
          : null,
    },
    {
      label: 'Peak inlet',
      getValue: () => '—',
      // Computed from temperature_bezier max — deferred until bezier data
      // is populated. Today all backfilled recipes have NULL beziers.
      has: () => false,
      isLever: true,
      rawValue: () => null,
    },
    {
      label: 'Expected FC',
      getValue: (r) => {
        const parts = [r.predicted_fc_time, r.predicted_fc_temp != null ? `${r.predicted_fc_temp}°C` : null]
          .filter(Boolean)
          .join(' / ')
        return parts || '—'
      },
      has: (r) => r.predicted_fc_time != null || r.predicted_fc_temp != null,
    },
    {
      label: 'Expected Total',
      getValue: (r) => (r.predicted_total_time ? <strong>{r.predicted_total_time}</strong> : '—'),
      has: (r) => r.predicted_total_time != null,
    },
    {
      label: 'End Condition',
      getValue: (r) => {
        if (!r.end_condition_type) return '—'
        const unit = r.end_condition_type === 'bean_temp' ? '°C' : r.end_condition_type === 'dev_time' ? 's' : ''
        return (
          <span className="font-mono text-xs">
            {r.end_condition_type.toUpperCase()}
            {r.end_condition_target != null ? ` ${r.end_condition_target}${unit}` : ''}
          </span>
        )
      },
      has: (r) => r.end_condition_type != null,
    },
    {
      label: 'Predicted Agtron WB',
      getValue: (r) => (r.predicted_agtron_wb != null ? String(r.predicted_agtron_wb) : '—'),
      has: (r) => r.predicted_agtron_wb != null,
    },
    {
      label: 'Hypothesis',
      getValue: (r) =>
        r.rationale ? (
          <span className="font-sans text-xs leading-relaxed">{r.rationale}</span>
        ) : (
          '—'
        ),
      has: (r) => r.rationale != null,
    },
  ]

  // Only render rows where ANY recipe has the field populated. Empty rows
  // would just be a sea of em-dashes — collapse them so the table tracks
  // what's actually being designed.
  const visibleRows = rows.filter((row) => recipes.some(row.has))

  // Per-row variance flag: lever rows with multiple distinct populated values
  // across recipes get the amber highlight applied to every cell in the row.
  // Single-value lever rows (all recipes match) read as "deliberate hold,"
  // not a varying knob — no highlight.
  const varyingLeverRows = new Set(
    visibleRows
      .filter((row) => row.isLever && row.rawValue)
      .filter((row) => {
        const values = recipes.map((r) => row.rawValue!(r)).filter((v) => v != null)
        return new Set(values).size > 1
      })
      .map((row) => row.label),
  )

  if (visibleRows.length === 0) {
    return (
      <div className="font-sans text-sm text-latent-mid italic">
        Recipes exist but no predictions populated yet. Push design-time
        fields via patch_roast_recipe (predicted_fc_temp / predicted_fc_time
        / predicted_total_time / predicted_agtron_wb / rationale / etc.) to
        light up this table.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-latent-border">
            <th className="text-left py-2 pr-4 font-sans font-normal text-latent-mid text-xs">
              {/* attribute column header — blank */}
            </th>
            {recipes.map((r) => (
              <th
                key={r.id}
                className="text-left py-2 px-3 font-sans font-semibold text-latent-fg text-xs"
              >
                {r.batch_slot ?? r.recipe_name ?? '?'}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row) => {
            const isVaryingLever = varyingLeverRows.has(row.label)
            const cellClass = isVaryingLever
              ? 'py-2 px-3 font-sans text-sm align-top bg-latent-roast-emphasis-surface text-latent-roast-emphasis font-semibold'
              : 'py-2 px-3 font-sans text-sm align-top'
            return (
              <tr key={row.label} className="border-b border-latent-border last:border-b-0">
                <td className="py-2 pr-4 font-sans text-xs text-latent-mid align-top">
                  {row.label}
                </td>
                {recipes.map((r) => (
                  <td key={r.id} className={cellClass}>
                    {row.getValue(r)}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// Drop rules card — 2 rows (if running fast / slow) × N batches. Renders
// only when at least one recipe has a rule populated; per-cell fallback to
// em-dash when individual recipes don't. Amber-tinted (roast-emphasis token,
// added Sub Pages 6.4) per scope doc § 5.5 — drop rules are roast-side
// signals to watch during execution.
function DropRulesCard({ recipes }: { recipes: RoastRecipe[] }) {
  return (
    <div className="bg-latent-roast-emphasis-surface border border-latent-roast-emphasis rounded p-4">
      <div className="label mb-3">Drop Rules</div>
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left pr-4 font-sans font-normal text-latent-mid text-xs pb-2">
              {/* row-label column — blank header */}
            </th>
            {recipes.map((r) => (
              <th
                key={r.id}
                className="text-left px-3 font-sans font-semibold text-latent-fg text-xs pb-2"
              >
                {r.batch_slot ?? r.recipe_name ?? '?'}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="pr-4 font-sans text-xs text-latent-mid align-top py-2">
              <div>If running fast</div>
              <div className="text-latent-subtle font-normal">hits end before exp. total</div>
            </td>
            {recipes.map((r) => (
              <td key={r.id} className="px-3 align-top py-2 text-xs leading-relaxed">
                {r.drop_rule_if_fast ?? '—'}
              </td>
            ))}
          </tr>
          <tr>
            <td className="pr-4 font-sans text-xs text-latent-mid align-top py-2">
              <div>If running slow</div>
              <div className="text-latent-subtle font-normal">past exp. total no end hit</div>
            </td>
            {recipes.map((r) => (
              <td key={r.id} className="px-3 align-top py-2 text-xs leading-relaxed">
                {r.drop_rule_if_slow ?? '—'}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub Pages 6.4 — Waiting-for-next-cupping view
//
// Scope doc § 5.3. The page Claude has just logged the V_n roasts on but
// hasn't yet cupped. Top sections:
//   1. Lot header
//   2. Cupping Hypothesis · V_n card — Primary Question + Summary transposed
//      table (Original prediction / Updated prediction / Taste for) +
//      Reference signals sub-card (Producer notes / V_(n-1) winner cup /
//      Anchor cup)
//   3. Roast Actuals · V_n card — 6 rows × N batches of as-recorded facts
//   4. Green Bean Info card (shared component)
//   5. Roast Log card (shared component, current-experiment rows highlighted)
//   6. Additional Information collapsed block
//
// Today's data shape (2026-05-13): 3 lots route here (Bukure / Red Plum /
// Fazenda); none have recipes linked to their latest experiment and none
// have cuppings logged. Most cells render empty-state explainers prompting
// push_cupping / patch_experiment / push_roast_recipe MCP calls. Page is
// built for the new workflow, not the legacy data.
// ---------------------------------------------------------------------------

const SLOT_LETTERS = ['a', 'b', 'c', 'd'] as const
type SlotLetter = (typeof SLOT_LETTERS)[number]

type SlotInfo = {
  slot: SlotLetter
  recipe: RoastRecipe | null
  roast: any | null
  declaredBatchId: string | null
}

// Parse a free-text batch_ids field preserving declared order. Same parsing
// rules as parseBatchIdsForHighlight but returns an ordered string[] so the
// Nth declared batch maps to slot a/b/c/d. "139, 140, 141" → ["139","140","141"];
// "139-141" → ["139","140","141"]; "MX-139, MX-140" → ["MX-139","MX-140"].
function parseDeclaredBatchOrder(raw: string | null | undefined): string[] {
  if (!raw) return []
  const out: string[] = []
  for (const tok of raw.split(/[,;]/).map((s) => s.trim()).filter(Boolean)) {
    const rangeMatch = tok.match(/^(\d+)\s*-\s*(\d+)$/)
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1], 10)
      const end = parseInt(rangeMatch[2], 10)
      if (Number.isFinite(start) && Number.isFinite(end) && end >= start && end - start < 100) {
        for (let i = start; i <= end; i++) out.push(String(i))
        continue
      }
    }
    out.push(tok)
  }
  return out
}

// Build the slot-to-recipe/roast mapping for the current experiment. Two
// sources for slot order:
//   1. If any recipes link to the experiment, use them in sorted order (the
//      recipe's batch_slot is the authoritative slot). Roast match via
//      recipes[i].id == roast.recipe_id; fallback to batch_id position in
//      latestExp.batch_ids when recipe_id is null (legacy backfill).
//   2. Otherwise (legacy / pre-recipe-framework lots), parse
//      latestExp.batch_ids in declared order — first token = slot a, second
//      = b, etc. Roast match by string equality on batch_id.
function computeSlotInfos(
  latestExp: { batch_ids?: string | null } | null,
  recipesForLatest: RoastRecipe[],
  roasts: any[],
): SlotInfo[] {
  const declared = parseDeclaredBatchOrder(latestExp?.batch_ids)
  const findRoastByBatchId = (batchId: string | null | undefined) =>
    batchId == null
      ? null
      : roasts.find((r) => String(r.batch_id) === String(batchId)) ?? null

  if (recipesForLatest.length > 0) {
    return recipesForLatest.slice(0, 4).map((recipe, i) => {
      const slot = SLOT_LETTERS[i]
      // Match by recipe_id FK first; fallback to declared batch_ids position.
      let roast: any | null =
        roasts.find((r) => r.recipe_id != null && r.recipe_id === recipe.id) ?? null
      if (!roast && declared[i]) {
        roast = findRoastByBatchId(declared[i])
      }
      return {
        slot,
        recipe,
        roast,
        declaredBatchId: declared[i] ?? roast?.batch_id ?? null,
      }
    })
  }

  return declared.slice(0, 4).map((batchId, i) => ({
    slot: SLOT_LETTERS[i],
    recipe: null,
    roast: findRoastByBatchId(batchId),
    declaredBatchId: batchId,
  }))
}

// Pick the most recent experiment whose created_at is strictly less than
// `pivot.created_at` — the V_(n-1) the cupping table should reference.
// Stable on null tie-break by id so the choice is deterministic.
function pickPriorExperiment(
  experiments: Array<{ id?: string; created_at?: string | null }>,
  pivot: { created_at?: string | null } | null,
): { id?: string; winner?: string | null; created_at?: string | null; [k: string]: any } | null {
  if (!pivot?.created_at) return null
  const earlier = experiments.filter(
    (e) => e.created_at != null && pivot.created_at != null && e.created_at < pivot.created_at,
  )
  if (earlier.length === 0) return null
  return [...earlier].sort((a, b) => {
    const at = a.created_at ?? ''
    const bt = b.created_at ?? ''
    if (at !== bt) return bt.localeCompare(at)
    return (a.id ?? '').localeCompare(b.id ?? '')
  })[0]
}

function WaitingForNextCuppingView({
  bean,
  cuppings,
}: {
  bean: any
  cuppings: any[]
}) {
  const experiments = (bean.experiments ?? []) as any[]
  const latestExp = experiments.length
    ? [...experiments].sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''))[0]
    : null
  const priorExp = pickPriorExperiment(experiments, latestExp)

  const allRecipes = (bean.recipes ?? []) as RoastRecipe[]
  const recipesForLatest = latestExp
    ? allRecipes
        .filter((r) => r.experiment_id === latestExp.id)
        .sort((a, b) => {
          if (a.batch_slot && b.batch_slot) return a.batch_slot.localeCompare(b.batch_slot)
          return (a.created_at ?? '').localeCompare(b.created_at ?? '')
        })
    : []

  const roasts = ((bean.roasts ?? []) as any[]).slice().sort((a, b) => {
    const ad = a.roast_date ?? a.created_at ?? ''
    const bd = b.roast_date ?? b.created_at ?? ''
    return ad.localeCompare(bd)
  })

  const slotInfos = latestExp ? computeSlotInfos(latestExp, recipesForLatest, roasts) : []
  const currentExpBatchIds = parseBatchIdsForHighlight(latestExp?.batch_ids)

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Back */}
      <Link
        href="/green"
        className="font-mono text-xs text-latent-mid hover:text-latent-fg mb-6 inline-block"
      >
        ← Back to Green Beans
      </Link>

      {/* Lot header — same sage tile pattern as the waiting-for-next-roast
          view (both are "active" lots, just at different lifecycle moments). */}
      <div className="flex gap-6 mb-8">
        <div className="w-20 h-20 bg-latent-accent-light rounded-md flex-shrink-0" />
        <div>
          <h1 className="font-sans text-2xl font-semibold mb-2">
            🌱 {bean.name || bean.lot_id}
          </h1>
          {bean.lot_id && (
            <div className="font-mono text-xs text-latent-mid mb-1">
              Lot: {bean.lot_id}
            </div>
          )}
          <div className="font-mono text-sm text-latent-mid">
            {[bean.origin, bean.variety, bean.process].filter(Boolean).join(' · ')}
          </div>
        </div>
      </div>

      {/* Cupping Hypothesis card */}
      {latestExp ? (
        <SectionCard title={`CUPPING HYPOTHESIS · ${formatVLabel(latestExp.experiment_id)}`}>
          {latestExp.primary_question && (
            <div className="mb-6">
              <div className="label">Primary Question</div>
              <div className="font-sans text-sm leading-relaxed">
                {latestExp.primary_question}
              </div>
            </div>
          )}

          <CuppingHypothesisTable
            slotInfos={slotInfos}
            latestExp={latestExp}
          />

          <div className="mt-6">
            <ReferenceSignalsCard
              bean={bean}
              latestExp={latestExp}
              priorExp={priorExp}
            />
          </div>
        </SectionCard>
      ) : (
        <SectionCard title="CUPPING HYPOTHESIS">
          <div className="font-sans text-sm text-latent-mid italic">
            No experiments designed yet for this lot. Cupping hypothesis lands
            when claude.ai designs a V-set via push_experiment + push_roast_recipe.
          </div>
        </SectionCard>
      )}

      {/* Roast Actuals card */}
      {latestExp && slotInfos.length > 0 && (
        <SectionCard title={`ROAST ACTUALS · ${formatVLabel(latestExp.experiment_id)}`}>
          <RoastActualsTable slotInfos={slotInfos} latestExp={latestExp} />
        </SectionCard>
      )}

      {/* Green Bean Info + Roast Log (shared 6.4 components) */}
      <GreenBeanInfoCard bean={bean} />

      <RoastLogTable
        roasts={roasts}
        cuppings={cuppings}
        highlightedBatchIds={Array.from(currentExpBatchIds)}
      />

      {/* Additional Information — collapsed placeholder, same shape as 6.3 */}
      <details className="mt-6 group">
        <summary className="cursor-pointer font-mono text-xs text-latent-mid hover:text-latent-fg uppercase tracking-wide">
          Additional Information
        </summary>
        <div className="mt-4 font-sans text-sm text-latent-mid italic">
          Deeper detail (full cupping history, all experiments archive, roast
          learnings, related brews) renders on the resolved-lot page shape in
          Sub Pages 6.5. The waiting-for-next-cupping view stays focused on
          the active V_n hypothesis + actuals.
        </div>
      </details>
    </div>
  )
}

// Cupping Hypothesis transposed table — 3 rows × N batches:
//   1. Original prediction (muted) — recipe.predicted_cup
//   2. Updated prediction (purple) — experiments.updated_cup_prediction_*
//   3. Taste for (purple) — experiments.taste_for_*
// Each row auto-hides when ALL slots are NULL. If all 3 rows hide AND no
// recipes link, fall back to a single empty-state explainer.
function CuppingHypothesisTable({
  slotInfos,
  latestExp,
}: {
  slotInfos: SlotInfo[]
  latestExp: any
}) {
  if (slotInfos.length === 0) {
    return (
      <div className="font-sans text-sm text-latent-mid italic">
        Latest experiment&apos;s batch_ids aren&apos;t set yet, so there&apos;s
        nothing to project per-batch. Use patch_experiment to populate batch_ids
        once the V-set is designed.
      </div>
    )
  }

  type RowSpec = {
    label: string
    sublabel: string
    getValue: (info: SlotInfo) => string | null
    tint: 'muted' | 'cup'
  }

  const rows: RowSpec[] = [
    {
      label: 'Original prediction',
      sublabel: 'from design',
      getValue: (info) => info.recipe?.predicted_cup ?? null,
      tint: 'muted',
    },
    {
      label: 'Updated prediction',
      sublabel: 'given roast actuals',
      getValue: (info) =>
        (latestExp[`updated_cup_prediction_${info.slot}`] as string | null) ?? null,
      tint: 'cup',
    },
    {
      label: 'Taste for',
      sublabel: 'cupping-table question',
      getValue: (info) => (latestExp[`taste_for_${info.slot}`] as string | null) ?? null,
      tint: 'cup',
    },
  ]

  const visibleRows = rows.filter((row) => slotInfos.some((info) => row.getValue(info) != null))

  if (visibleRows.length === 0) {
    return (
      <div className="font-sans text-sm text-latent-mid italic">
        No recipes linked to this experiment yet. Cupping predictions land
        when claude.ai pushes recipes via push_roast_recipe (which freezes the
        design-time predicted_cup) and updates the experiment via patch_experiment
        with updated_cup_prediction_a/b/c/d + taste_for_a/b/c/d once the
        roasts are logged.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-latent-border">
            <th className="text-left py-2 pr-4 font-sans font-normal text-latent-mid text-xs" />
            {slotInfos.map((info) => (
              <th
                key={info.slot}
                className="text-left py-2 px-3 font-sans font-semibold text-latent-fg text-xs"
              >
                {info.recipe?.batch_slot ?? info.slot.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row) => {
            const rowClass =
              row.tint === 'cup'
                ? 'bg-latent-cup-emphasis-surface border-l-2 border-latent-cup-emphasis'
                : ''
            const valueClass = row.tint === 'muted' ? 'text-latent-mid' : 'text-latent-fg'
            return (
              <tr
                key={row.label}
                className={`border-b border-latent-border last:border-b-0 ${rowClass}`}
              >
                <td className="py-3 pr-4 font-sans text-xs align-top">
                  <div className="font-medium text-latent-fg">{row.label}</div>
                  <div className="text-latent-subtle font-normal">{row.sublabel}</div>
                </td>
                {slotInfos.map((info) => {
                  const value = row.getValue(info)
                  return (
                    <td
                      key={info.slot}
                      className={`py-3 px-3 font-sans text-sm align-top leading-relaxed ${valueClass}`}
                    >
                      {value ?? '—'}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// Reference signals sub-card — 3 rows surfaced for the cupping table:
// producer notes (always-on lot reference) + V_(n-1) winner cup (prior
// experiment's reference) + anchor cup (cross-lot reference, lives on
// experiments.control_baseline per Sub Pages 6.4 locked decision).
function ReferenceSignalsCard({
  bean,
  latestExp,
  priorExp,
}: {
  bean: any
  latestExp: any
  priorExp: any | null
}) {
  const producerNotes = bean.producer_tasting_notes ?? null
  const anchorCup = latestExp.control_baseline ?? null

  // V_(n-1) winner cup: read priorExp.winner (free-text, e.g. "v2b") to
  // figure out the slot, then read priorExp.observed_outcome_<slot>. If the
  // winner doesn't resolve to a slot letter, fall back to priorExp.winner +
  // priorExp.key_insight as a best-effort reference.
  let priorWinnerCup: string | null = null
  if (priorExp?.winner) {
    const slotMatch = String(priorExp.winner).toLowerCase().match(/[a-d](?!.*[a-d])/)
    const slot = slotMatch?.[0]
    if (slot) {
      priorWinnerCup =
        (priorExp[`observed_outcome_${slot}`] as string | null) ??
        priorExp.key_insight ??
        null
    } else {
      priorWinnerCup = priorExp.key_insight ?? null
    }
  }

  const hasAny = producerNotes || priorWinnerCup || anchorCup

  if (!hasAny) {
    return (
      <div className="bg-latent-cup-emphasis-surface border border-latent-cup-emphasis rounded p-4">
        <div className="label mb-2">Reference signals for the cupping table</div>
        <div className="font-sans text-xs text-latent-mid italic">
          No references populated. Anchor cup lives on experiments.control_baseline
          (patch_experiment); producer notes live on green_beans.producer_tasting_notes
          (patch_green_bean); prior winner cup auto-derives once a V_(n-1) experiment
          synthesizes.
        </div>
      </div>
    )
  }

  return (
    <div className="bg-latent-cup-emphasis-surface border border-latent-cup-emphasis rounded p-4">
      <div className="label mb-3">Reference signals for the cupping table</div>
      <div className="space-y-3 font-sans text-sm leading-relaxed">
        {producerNotes && (
          <div>
            <div className="font-medium text-latent-fg text-xs mb-1">Producer notes</div>
            <div className="text-latent-fg">{producerNotes}</div>
          </div>
        )}
        {priorWinnerCup && priorExp && (
          <div>
            <div className="font-medium text-latent-fg text-xs mb-1">
              V_(n-1) winner cup
              {priorExp.winner && (
                <span className="ml-2 text-latent-mid font-normal">
                  ({priorExp.experiment_id} · winner: {priorExp.winner})
                </span>
              )}
            </div>
            <div className="text-latent-fg">{priorWinnerCup}</div>
          </div>
        )}
        {anchorCup && (
          <div>
            <div className="font-medium text-latent-fg text-xs mb-1">Anchor cup</div>
            <div className="text-latent-fg">{anchorCup}</div>
          </div>
        )}
      </div>
    </div>
  )
}

// Roast Actuals transposed table — 6 rows × N batches of as-recorded facts
// from the roasts that match the current experiment's batch_ids. Same
// compact-table rule as the hypothesis table (hide rows where all batches
// are NULL). The "vs expected total" row uses roast-emphasis amber text per
// scope doc § 5.5 — surfaces "+5s overran" deltas Chris writes into
// experiments.delta_from_roast_*.
function RoastActualsTable({
  slotInfos,
  latestExp,
}: {
  slotInfos: SlotInfo[]
  latestExp: any
}) {
  type RowSpec = {
    label: string
    getValue: (info: SlotInfo) => React.ReactNode
    has: (info: SlotInfo) => boolean
    amber?: boolean
  }

  const rows: RowSpec[] = [
    {
      label: 'FC',
      getValue: (info) => info.roast?.fc_start ?? '—',
      has: (info) => info.roast?.fc_start != null,
    },
    {
      label: 'Drop',
      getValue: (info) => info.roast?.drop_time ?? '—',
      has: (info) => info.roast?.drop_time != null,
    },
    {
      label: 'vs expected total',
      getValue: (info) => {
        const delta = latestExp[`delta_from_roast_${info.slot}`] as string | null
        return delta ?? '—'
      },
      has: (info) => (latestExp[`delta_from_roast_${info.slot}`] as string | null) != null,
      amber: true,
    },
    {
      label: 'Dev time',
      getValue: (info) =>
        info.roast?.dev_time_s != null ? `${info.roast.dev_time_s}s` : '—',
      has: (info) => info.roast?.dev_time_s != null,
    },
    {
      label: 'Maillard',
      getValue: (info) =>
        info.roast?.maillard_pct != null ? `${info.roast.maillard_pct}%` : '—',
      has: (info) => info.roast?.maillard_pct != null,
    },
    {
      label: 'Agtron WB',
      getValue: (info) =>
        info.roast?.agtron != null ? String(info.roast.agtron) : '—',
      has: (info) => info.roast?.agtron != null,
    },
  ]

  const visibleRows = rows.filter((row) => slotInfos.some(row.has))

  if (visibleRows.length === 0) {
    return (
      <div className="font-sans text-sm text-latent-mid italic">
        Latest experiment&apos;s batches not yet logged as roasts. Use
        push_roast from claude.ai to populate the actuals.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-latent-border">
            <th className="text-left py-2 pr-4 font-sans font-normal text-latent-mid text-xs" />
            {slotInfos.map((info) => {
              const slotLabel = info.recipe?.batch_slot ?? info.slot.toUpperCase()
              const batchSuffix = info.roast?.batch_id
                ? ` · #${info.roast.batch_id}`
                : info.declaredBatchId
                  ? ` · #${info.declaredBatchId}`
                  : ''
              return (
                <th
                  key={info.slot}
                  className="text-left py-2 px-3 font-sans font-semibold text-latent-fg text-xs"
                >
                  {slotLabel}
                  {batchSuffix}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row) => {
            const cellClass = row.amber
              ? 'py-2 px-3 font-sans text-sm align-top text-latent-roast-emphasis'
              : 'py-2 px-3 font-sans text-sm align-top'
            return (
              <tr key={row.label} className="border-b border-latent-border last:border-b-0">
                <td className="py-2 pr-4 font-sans text-xs text-latent-mid align-top">
                  {row.label}
                </td>
                {slotInfos.map((info) => (
                  <td key={info.slot} className={cellClass}>
                    {row.getValue(info)}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Legacy detail render — used for resolved + in_inventory lots until 6.5
// ships the resolved-view shape. Preserves the existing single-shape page
// verbatim (still keeps its inline Green Bean Info + Roast Log; the third
// consumer materializes when 6.5 instantiates the shared-component swap).
// ---------------------------------------------------------------------------

function LegacyDetailRender({
  bean,
  cuppings,
  relatedBrews,
}: {
  bean: any
  cuppings: any[]
  relatedBrews: { id: string; coffee_name: string | null }[]
}) {
  const learnings = bean.roast_learnings?.[0] || bean.roast_learnings
  const bestBatchId = learnings?.best_batch_id

  const primaryGroundAgtronByRoast: Record<string, number> = {}
  for (const cup of cuppings) {
    if (
      cup.roast_id &&
      typeof cup.ground_agtron === 'number' &&
      !(cup.roast_id in primaryGroundAgtronByRoast)
    ) {
      primaryGroundAgtronByRoast[cup.roast_id] = cup.ground_agtron
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Link
        href="/green"
        className="font-mono text-xs text-latent-mid hover:text-latent-fg mb-6 inline-block"
      >
        ← Back to Green Beans
      </Link>

      <div className="flex gap-6 mb-8">
        <div className="w-20 h-20 bg-latent-accent rounded-md flex-shrink-0" />
        <div>
          <h1 className="font-sans text-2xl font-semibold mb-2">
            🌱 {bean.name || bean.lot_id}
          </h1>
          {bean.lot_id && (
            <div className="font-mono text-xs text-latent-mid mb-1">
              Lot: {bean.lot_id}
            </div>
          )}
          <div className="font-mono text-sm text-latent-mid">
            {bean.origin} · {bean.variety} · {bean.process}
          </div>
        </div>
      </div>

      <SectionCard title="GREEN BEAN DETAILS">
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 font-sans text-sm">
          {bean.producer && <div><strong>Producer:</strong> {bean.producer}</div>}
          {bean.region && <div><strong>Region:</strong> {bean.region}</div>}
          {bean.importer && <div><strong>Importer:</strong> {bean.importer}</div>}
          {bean.purchase_date && <div><strong>Purchased:</strong> {bean.purchase_date}</div>}
          {bean.price_per_kg && <div><strong>Price:</strong> ${bean.price_per_kg}/kg</div>}
          {bean.quantity_g && <div><strong>Quantity:</strong> {bean.quantity_g}g</div>}
          {bean.moisture && <div><strong>Moisture:</strong> {bean.moisture}%</div>}
          {bean.density && <div><strong>Density:</strong> {bean.density} g/L</div>}
        </div>
      </SectionCard>

      {bestBatchId && (
        <SectionCard title="🏆 BEST ROAST" dark>
          <div className="font-mono text-lg font-semibold mb-3">
            Batch #{bestBatchId}
          </div>
          {learnings?.why_this_roast_won && (
            <div className="font-sans text-sm leading-relaxed">
              <strong>Why it won:</strong> {learnings.why_this_roast_won}
            </div>
          )}
        </SectionCard>
      )}

      {bean.roasts && bean.roasts.length > 0 && (
        <SectionCard title={`ROAST LOG (${bean.roasts.length} ROASTS)`}>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Batch</th>
                  <th>Date</th>
                  <th>FC</th>
                  <th>FC Temp</th>
                  <th>Drop</th>
                  <th>Drop Temp</th>
                  <th>Dev</th>
                  <th>Agtron</th>
                  <th title="Whole bean Agtron minus ground Agtron (primary cupping). ROASTING.md targets |Δ| ≤ 2 for even internal development.">WB→Gnd Δ</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {bean.roasts.map((roast: any) => {
                  const groundAgtron = primaryGroundAgtronByRoast[roast.id]
                  const delta =
                    typeof roast.agtron === 'number' && typeof groundAgtron === 'number'
                      ? Number((roast.agtron - groundAgtron).toFixed(1))
                      : null
                  return (
                  <tr
                    key={roast.id}
                    className={String(roast.batch_id) === String(bestBatchId) ? 'highlight' : ''}
                  >
                    <td className={String(roast.batch_id) === String(bestBatchId) ? 'font-semibold' : ''}>
                      #{roast.batch_id} {String(roast.batch_id) === String(bestBatchId) && '★'}
                    </td>
                    <td>{roast.roast_date || '—'}</td>
                    <td>{roast.fc_start || '—'}</td>
                    <td>{roast.fc_temp ? `${roast.fc_temp}°C` : '—'}</td>
                    <td>{roast.drop_time || '—'}</td>
                    <td>{roast.drop_temp ? `${roast.drop_temp}°C` : '—'}</td>
                    <td>
                      {roast.dev_time_s ? `${roast.dev_time_s}s` : '—'}
                      {roast.dev_ratio && ` (${roast.dev_ratio})`}
                    </td>
                    <td>{roast.agtron || '—'}</td>
                    <td title={groundAgtron != null ? `Ground Agtron: ${groundAgtron}` : 'No cupping with ground Agtron'}>
                      {delta != null ? `${delta > 0 ? '+' : ''}${delta}` : '—'}
                    </td>
                    <td>
                      {roast.profile_link && (
                        <a
                          href={roast.profile_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-latent-mid hover:text-latent-fg"
                          title="Roest profile"
                        >
                          ↗
                        </a>
                      )}
                    </td>
                  </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {bean.experiments && bean.experiments.length > 0 && (
        <SectionCard title={`EXPERIMENTS (${bean.experiments.length})`}>
          {bean.experiments.map((exp: any, i: number) => (
            <div
              key={exp.id}
              className={`${i < bean.experiments.length - 1 ? 'mb-6 pb-6 border-b border-latent-border' : ''}`}
            >
              <div className="font-mono text-sm font-semibold mb-1">{exp.experiment_id}</div>
              {exp.batch_ids && (
                <div className="font-mono text-xs text-latent-mid mb-4">Batches: {exp.batch_ids}</div>
              )}
              <div className="space-y-4 font-sans text-sm leading-relaxed">
                {exp.primary_question && (
                  <div>
                    <div className="label">Question</div>
                    {exp.primary_question}
                  </div>
                )}
                {exp.variable_changed && (
                  <div>
                    <div className="label">Variable</div>
                    {exp.variable_changed}
                  </div>
                )}
                {exp.winner && (
                  <div className="bg-latent-highlight p-3 rounded">
                    <div className="label">Winner</div>
                    {exp.winner}
                  </div>
                )}
                {exp.key_insight && (
                  <div>
                    <div className="label">
                      Key Insight
                      {exp.key_insight_confidence && (
                        <span className="ml-2 text-latent-mid font-normal">
                          ({exp.key_insight_confidence} confidence)
                        </span>
                      )}
                    </div>
                    {exp.key_insight}
                  </div>
                )}
                {exp.open_questions && (
                  <div>
                    <div className="label">Open Questions</div>
                    {exp.open_questions}
                  </div>
                )}
                {exp.what_changes_going_forward && (
                  <div>
                    <div className="label">What Changes Going Forward</div>
                    {exp.what_changes_going_forward}
                  </div>
                )}
                {exp.additional_notes && (
                  <div>
                    <div className="label">Additional Notes</div>
                    {exp.additional_notes}
                  </div>
                )}
              </div>
            </div>
          ))}
        </SectionCard>
      )}

      {learnings && (
        <SectionCard title="🔥 ROAST LEARNINGS">
          <div className="space-y-4 font-sans text-sm leading-relaxed">
            <LearningField label="Aromatic Behavior" value={learnings.aromatic_behavior} />
            <LearningField label="Structural Behavior" value={learnings.structural_behavior} />
            <LearningField label="Elasticity" value={learnings.elasticity} />
            <LearningField label="Roast Window Width" value={learnings.roast_window_width} />
            <LearningField label="Primary Lever" value={learnings.primary_lever} />
            <LearningField label="Secondary Levers" value={learnings.secondary_levers} />
            <LearningField label="What Didn't Move the Needle" value={learnings.what_didnt_move_needle} />
            <LearningField label="Underdevelopment Signal" value={learnings.underdevelopment_signal} />
            <LearningField label="Overdevelopment Signal" value={learnings.overdevelopment_signal} />
            <LearningField label="Cultivar Takeaway" value={learnings.cultivar_takeaway} />
            <LearningField label="General Takeaway" value={learnings.general_takeaway} />
            <LearningField label="Rest Behavior" value={learnings.rest_behavior} />
            <LearningField label="Reference Roasts" value={learnings.reference_roasts} />
            <LearningField label="Starting Hypothesis" value={learnings.starting_hypothesis} />
          </div>
        </SectionCard>
      )}

      {cuppings.length > 0 && (
        <SectionCard title={`CUPPING HISTORY (${cuppings.length} EVALUATIONS)`}>
          {cuppings.map((cup: any, i: number) => {
            const roast = bean.roasts?.find((r: any) => r.id === cup.roast_id)
            return (
              <div
                key={cup.id}
                className={`${i < cuppings.length - 1 ? 'mb-4 pb-4 border-b border-latent-border' : ''}`}
              >
                <div className="font-mono text-xs text-latent-mid mb-1">
                  Batch #{roast?.batch_id || '?'} · {cup.rest_days}d rest · {cup.eval_method}
                  {cup.recipe_variant && ` · ${cup.recipe_variant}`}
                  {cup.ground_agtron && ` · Gnd Agtron: ${cup.ground_agtron}`}
                </div>
                <div className="font-sans text-sm">
                  {cup.overall || [cup.aroma, cup.flavor, cup.acidity, cup.body, cup.finish].filter(Boolean).join(' · ')}
                </div>
              </div>
            )
          })}
        </SectionCard>
      )}

      {relatedBrews && relatedBrews.length > 0 && (
        <div className="mt-6">
          <div className="label">RELATED BREWS</div>
          {relatedBrews.map((brew) => (
            <Link
              key={brew.id}
              href={`/brews/${brew.id}`}
              className="flex justify-between items-center bg-white border border-latent-border rounded p-4 mb-2 hover:border-latent-mid transition-colors"
            >
              <div className="font-mono text-sm font-semibold">{brew.coffee_name}</div>
              <span className="text-latent-mid">→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
