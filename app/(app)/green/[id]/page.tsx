import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SectionCard } from '@/components/SectionCard'
import { GreenBeanInfoCard } from '@/components/GreenBeanInfoCard'
import { RoastLogTable } from '@/components/RoastLogTable'
import { StrategyPill } from '@/components/StrategyPill'
import { ModifierBadges } from '@/components/ModifierBadges'
import { ExperimentFrameCard } from '@/components/ExperimentFrameCard'
import { CrossBatchNotesBlock } from '@/components/CrossBatchNotesBlock'
import { PerRoastReflections } from '@/components/PerRoastReflections'
import { CollapsibleSection } from '@/components/CollapsibleSection'
import { DropRulesCard } from '@/components/DropRulesCard'
import {
  computeLifecycleState,
  extractBatchNumber,
  SLOT_LETTERS,
  type SlotLetter,
  type PriorExperimentShape,
} from '@/lib/lifecycle-state'
import type { RoastRecipe } from '@/lib/types'

// Sprint 3.2 #14 — lot-header meta with FK fallback. Belt-and-suspenders
// against future rows where bean.origin / bean.variety might land NULL
// (the 4 rows surfaced in the 6.7 spot-check were fixed via migration 053
// backfill, but new inserts that skip those columns would otherwise blank
// out the subtitle). Falls back to the FK-joined terroir.country /
// cultivar.cultivar_name. Composed at the call sites — 4 lifecycle views
// share this string.
function composeLotMeta(bean: any): string {
  const origin = bean.origin ?? bean.terroir?.country ?? null
  const variety = bean.variety ?? bean.cultivar?.cultivar_name ?? null
  return [origin, variety, bean.process].filter(Boolean).join(' · ')
}

// Sub Pages 6.5 (2026-05-13). /green/[id] is fully state-driven per the
// scope doc § 5 — one URL renders one of four lifecycle shapes based on the
// state computed from joined data. 6.3 shipped waiting-for-next-roast; 6.4
// shipped waiting-for-next-cupping; 6.5 ships resolved and retires the
// pre-6.3 LegacyDetailRender fall-through. The remaining in_inventory state
// is filtered out of the /green index (scope doc § 5.1) and only reachable
// via direct URL — it routes to the minimal InventoryPlaceholder below.

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

  // Brews on this lot — projection richer than the pre-6.5 `id, coffee_name`
  // pair so ResolvedView can surface the "Optimized Brew" sub-card without a
  // second round trip. Other shapes ignore the array.
  const { data: brewsForLot } = await supabase
    .from('brews')
    .select(
      `id, coffee_name, roast_id, source, extraction_strategy, hybrid_subform,
       modifiers, strategy_notes, cooling_curve_target,
       brewer, filter, dose_g, water_g, ratio, grind, grinder, grind_setting, temp_c,
       bloom, pour_structure, total_time,
       aroma, attack, mid_palate, body, finish, peak_expression,
       flavor_notes, flavors, structure_tags, key_takeaways, what_i_learned,
       created_at`,
    )
    .eq('green_bean_id', params.id)

  // Lifecycle dispatch — 6.5 ships the third state-specific shape (resolved).
  // 6.3 = waiting-for-next-roast (V_n design view). 6.4 = waiting-for-next-
  // cupping (V_n actuals + hypothesis view). 6.5 = resolved (reference roast
  // + lessons archive). Sub-sprint 4a (2026-05-27) = unresolved (closed
  // without confirmed reference — same archive shape as resolved but with
  // "Reference" → "Leading" vocabulary rotation and verdict block dropped).
  // in_inventory is filtered out of /green per scope doc § 5.1 and only
  // reachable via direct URL — routes to InventoryPlaceholder.
  const state = computeLifecycleState(bean)
  if (state === 'waiting_for_next_roast') {
    return <WaitingForNextRoastView bean={bean} cuppings={cuppings} />
  }
  if (state === 'waiting_for_next_cupping') {
    return <WaitingForNextCuppingView bean={bean} cuppings={cuppings} />
  }
  if (state === 'resolved') {
    return <ResolvedView bean={bean} cuppings={cuppings} brewsForLot={brewsForLot ?? []} />
  }
  if (state === 'unresolved') {
    return <UnresolvedView bean={bean} cuppings={cuppings} brewsForLot={brewsForLot ?? []} />
  }

  return <InventoryPlaceholder bean={bean} />
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
            {composeLotMeta(bean)}
          </div>
        </div>
      </div>

      {/* Roasts · V_n card (cleanup-actions PR #23 reorder, was below
          ExperimentFrame pre-PR). The V-label comes from experiment_id
          when set (e.g. "MX-DEV-v3" → "V3"); falls back to the full label
          otherwise. */}
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

      {/* Green Bean Info — shared component (Sub Pages 6.4 extraction).
          Cleanup-actions PR #23 reorder: now slot 3 (was slot 4 pre-PR,
          below ExperimentFrame). The promotion reflects load-bearing-for-
          page-job hierarchy: the page's primary job is "what's queued to
          roast", so ROASTS card first, then the green-bean identity row,
          then the experiment frame as design-time context. */}
      <GreenBeanInfoCard bean={bean} />

      {/* Experiment Frame card (Sub Pages 6.7; cleanup-actions PR #23
          demoted from slot 2 to slot 4 — design-time context is useful but
          not load-bearing at execution prep). Auto-hides when no frame
          fields populated. */}
      {latestExp && (
        <ExperimentFrameCard
          latestExp={latestExp}
          title={`EXPERIMENT FRAME · ${formatVLabel(latestExp.experiment_id)}`}
        />
      )}

      <RoastLogTable
        roasts={roasts}
        cuppings={cuppings}
        highlightedBatchIds={Array.from(currentExpBatchIds)}
      />

      {/* Per-roast reflections (Sub Pages 6.7) — collapsed details surfacing
          what_worked / what_didnt / what_to_change per roast. Auto-hides
          when no roasts have any reflection field populated. */}
      <PerRoastReflections roasts={roasts} />

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
  experiments: Array<PriorExperimentShape>,
  pivot: { created_at?: string | null } | null,
): PriorExperimentShape | null {
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
            {composeLotMeta(bean)}
          </div>
        </div>
      </div>

      {/* Cupping Hypothesis card (cleanup-actions PR #24 reorder: now slot
          2, was slot 3 pre-PR with ExperimentFrame above it). Foreground
          signal for cupping prep — what claude.ai predicted + what to
          listen for. */}
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

      {/* Roast Actuals card (cleanup-actions PR #24: now slot 3, was slot
          4 pre-PR — moved up alongside Cupping Hypothesis since both are
          foreground signal for cupping prep). */}
      {latestExp && slotInfos.length > 0 && (
        <SectionCard title={`ROAST ACTUALS · ${formatVLabel(latestExp.experiment_id)}`}>
          <RoastActualsTable slotInfos={slotInfos} latestExp={latestExp} />
        </SectionCard>
      )}

      {/* Recipe Design Intent disclosure (Sub Pages 6.8) — collapsed drill-in
          surfacing drop rules from the V_n recipes for cupping-time retro
          ("did the operator follow the rule on the v2b batch?"). Stays out
          of foreground per redesign.md § 5.5 (amber surfaces are roast-prep
          signal, not cupping signal); the collapsed disclosure honors the
          lock while keeping rules consultable. Auto-hides until any recipe
          carries a populated rule. */}
      {recipesForLatest.some((r) => r.drop_rule_if_fast || r.drop_rule_if_slow) && (
        <CollapsibleSection title="Recipe Design Intent">
          <DropRulesCard recipes={recipesForLatest} />
        </CollapsibleSection>
      )}

      {/* Green Bean Info — shared 6.4 component. Cleanup-actions PR #24
          slot 4 (was slot 6 pre-PR). Identity / state of the bean — load-
          bearing for orientation but not for the active cupping decision. */}
      <GreenBeanInfoCard bean={bean} />

      {/* Experiment Frame card (Sub Pages 6.7). Cleanup-actions PR #24
          demoted from slot 2 to slot 5 — design-time frame is useful
          context but isn't consulted at cupping table time. skipControlBaseline
          stays true because control_baseline is already surfaced inside
          ReferenceSignalsCard as "Anchor cup"; rendering it twice would
          duplicate the same field. */}
      {latestExp && (
        <ExperimentFrameCard
          latestExp={latestExp}
          skipControlBaseline
          title={`EXPERIMENT FRAME · ${formatVLabel(latestExp.experiment_id)}`}
        />
      )}

      <RoastLogTable
        roasts={roasts}
        cuppings={cuppings}
        highlightedBatchIds={Array.from(currentExpBatchIds)}
      />

      {/* Cross-batch notes (Sub Pages 6.7) — collapsed details surfacing
          observed_outcome_a/b/c/d from V_(n-1). Reflective context for the
          cupping table, not foreground signal. Cleanup-actions PR #24
          demoted from slot 5 (between Roast Actuals and GreenBeanInfo) to
          the deep-archive group alongside PerRoastReflections — the 6.7
          framing called these "reflective context, not foreground signal"
          and the page's primary jobs (cupping prep + cupping in progress)
          don't consult V_(n-1) memory live. If Round-8 dogfood shows
          frequent consultation at cupping prep time, promote back to slot
          3 (one-line move). Auto-hides when priorExp is null or all 4
          slots are NULL. */}
      <CrossBatchNotesBlock priorExp={priorExp} />

      {/* Per-roast reflections (Sub Pages 6.7) — collapsed details surfacing
          what_worked / what_didnt / what_to_change per roast. Auto-hides
          when no roasts have any reflection field populated. */}
      <PerRoastReflections roasts={roasts} />

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
// Cleanup-actions PR #25 helpers. Surface Design (recipe.end_condition_target)
// vs Achieved (roast.drop_temp) on the ROAST ACTUALS table so operator
// override (machine fired automatically vs operator manually pulled the drop)
// is visible at cupping prep time. end_condition_target is only in °C when
// end_condition_type is bean_temp; other types (dev_time, manual) leave the
// design half blank since the target field carries seconds / nothing.
const DROP_TEMP_DIVERGENCE_THRESHOLD_C = 0.5

function isDesignDropTempApplicable(recipe: RoastRecipe | null): boolean {
  if (!recipe) return false
  const type = (recipe.end_condition_type ?? '').toLowerCase()
  return type === 'bean_temp' && recipe.end_condition_target != null
}

function formatDropTempDiff(info: SlotInfo): React.ReactNode {
  const designTarget = isDesignDropTempApplicable(info.recipe)
    ? (info.recipe!.end_condition_target as number)
    : null
  const achieved = info.roast?.drop_temp as number | null | undefined
  const designStr = designTarget != null ? `${designTarget}°C` : '—'
  const achievedStr = achieved != null ? `${achieved}°C` : '—'
  const diverged =
    designTarget != null &&
    achieved != null &&
    Math.abs(achieved - designTarget) > DROP_TEMP_DIVERGENCE_THRESHOLD_C
  if (designTarget == null && achieved == null) return '—'
  return (
    <span>
      <span className="text-latent-mid">{designStr}</span>
      <span className="text-latent-mid"> → </span>
      <span className={diverged ? 'text-latent-roast-emphasis font-semibold' : ''}>
        {achievedStr}
      </span>
    </span>
  )
}

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
      // Cleanup-actions PR #25: design → achieved drop_temp diff render.
      // Surfaces operator override visually at cupping prep time. Both
      // values come together; amber tint applies per-cell when the
      // achieved value diverges from the design target by > 0.5°C. The
      // design value pulls from recipe.end_condition_target when
      // end_condition_type is bean_temp (the dominant case); other end-
      // condition types (dev_time, manual) leave the design half blank
      // since end_condition_target isn't in °C for those.
      label: 'Drop temp',
      getValue: (info) => formatDropTempDiff(info),
      has: (info) =>
        info.roast?.drop_temp != null || isDesignDropTempApplicable(info.recipe),
      amber: false, // per-cell amber handled inside formatDropTempDiff
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
// Sub Pages 6.5 — Resolved view
//
// Scope doc § 5.4. The lot is closed; the page is a reference artifact for
// future re-roasts of the same coffee or for cultivar-/process-anchored lots
// that share its character. Top to bottom:
//
//   1. Lot header (green tile + "Resolved" badge)
//   2. Reference Roast card — "Why this roast won" + Reference Roast Recipe
//      (Design column from roast_recipes, Achieved column from the roasts row)
//   3. Reference Cup card — Best cup synthesis + two side-by-side sub-cards
//      (Cupping · pourover descriptors / Optimized Brew · brew recipe +
//      descriptors) + producer notes for comparison
//   4. Roasting Learnings · {lot} — 3 character cards (Primary Lever / Roast
//      Window / Elasticity) + 7 detail rows
//   5. Roasting Learnings · To Carry Forward — Cultivar / General / Starting
//      hypothesis takeaways
//   6. Green Bean Info (shared component, third consumer)
//   7. Roast log (shared component, defaultCollapsed=true, ref-batch
//      highlighted)
//   8. All cuppings (collapsed details, one row per cupping, ref starred)
//   9. Experiment journey (collapsed details, per-set summary cards in
//      chronological order)
//   10. Additional Information (collapsed placeholder)
//
// Today's resolved-lot count: 6 (CGLE Sudan Rume Hybrid Washed / CGLE Mandela
// XO / GV Surma / GV Oma / GUA Libertad / GUA El Socorro). All have typed
// best_roast_id FK post-6.1 backfill; 2 have rich why_this_roast_won prose
// (Sudan Rume + Mandela XO), 4 have NULL. Recipe rows backfilled 1:1 from
// existing roasts but with NULL beziers across the board (Phase 3 enrichment
// is intentionally empty per redesign doc § 7) — Design-side rows render
// em-dashes today and light up as recipes are enriched via patch_roast_recipe.
// ---------------------------------------------------------------------------

function ResolvedView({
  bean,
  cuppings,
  brewsForLot,
}: {
  bean: any
  cuppings: any[]
  brewsForLot: any[]
}) {
  const learnings =
    (Array.isArray(bean.roast_learnings) ? bean.roast_learnings[0] : bean.roast_learnings) ?? null
  const rawBestBatchId: string | null = learnings?.best_batch_id ?? null
  const batchNumber = extractBatchNumber(rawBestBatchId)
  const refRoastId: string | null = learnings?.best_roast_id ?? null

  const roasts = ((bean.roasts ?? []) as any[]).slice().sort((a, b) => {
    const ad = a.roast_date ?? a.created_at ?? ''
    const bd = b.roast_date ?? b.created_at ?? ''
    return ad.localeCompare(bd)
  })
  const referenceRoast = refRoastId ? roasts.find((r) => r.id === refRoastId) ?? null : null
  const referenceRecipe =
    referenceRoast?.recipe_id
      ? ((bean.recipes ?? []) as RoastRecipe[]).find((r) => r.id === referenceRoast.recipe_id) ?? null
      : null

  const pourover = pickPourover(cuppings, refRoastId)
  const optimizedBrew = pickOptimizedBrew(brewsForLot, refRoastId)
  // Primary ground Agtron for the WB→Gnd Δ display — prefer the pourover's
  // ground reading; fall back to any cupping on the reference roast that
  // measured ground Agtron.
  const primaryGroundAgtron =
    (typeof pourover?.ground_agtron === 'number' ? pourover.ground_agtron : null) ??
    (cuppings.find((c) => c.roast_id === refRoastId && typeof c.ground_agtron === 'number')
      ?.ground_agtron as number | undefined) ??
    null
  const wbGndDelta =
    typeof referenceRoast?.agtron === 'number' && typeof primaryGroundAgtron === 'number'
      ? Number((referenceRoast.agtron - primaryGroundAgtron).toFixed(1))
      : null

  const experimentsChrono = ((bean.experiments ?? []) as any[]).slice().sort((a, b) =>
    (a.created_at ?? '').localeCompare(b.created_at ?? ''),
  )

  const roastsById = new Map<string, any>(roasts.map((r) => [r.id, r]))

  // Best-cup synthesis prose source: prefer the optimized brew's
  // what_i_learned (most narrative-rich field on a closed lot — Sudan Rume's
  // brew shows the pattern); fall back to the pourover cupping's `overall`.
  const bestCupSynthesis = optimizedBrew?.what_i_learned || pourover?.overall || null
  const refBatchLabel = batchNumber ?? rawBestBatchId ?? '?'

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Link
        href="/green"
        className="font-mono text-xs text-latent-mid hover:text-latent-fg mb-6 inline-block"
      >
        ← Back to Green Beans
      </Link>

      {/* Lot header — green resolved-emphasis tile signals "the answer" per
          scope doc § 5.5. "Resolved" badge sits inline with the title, using
          the resolved-emphasis surface + border tokens. */}
      <div className="flex gap-6 mb-8">
        <div className="w-20 h-20 bg-latent-resolved-emphasis rounded-md flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 flex-wrap mb-2">
            <h1 className="font-sans text-2xl font-semibold">
              🌱 {bean.name || bean.lot_id}
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 text-xxs font-mono uppercase tracking-wide bg-latent-resolved-emphasis-surface text-latent-resolved-emphasis border border-latent-resolved-emphasis rounded">
              Resolved
            </span>
          </div>
          {bean.lot_id && (
            <div className="font-mono text-xs text-latent-mid mb-1">
              Lot: {bean.lot_id}
            </div>
          )}
          <div className="font-mono text-sm text-latent-mid">
            {composeLotMeta(bean)}
          </div>
        </div>
      </div>

      {/* Sub-sprint 4a (2026-05-27) — disambiguator card removed. Lots with
          NULL why_this_roast_won now route to UnresolvedView (the new 5th
          lifecycle state); the post-Bundle-A invariant for ResolvedView is
          that why_this_roast_won is populated. The disambiguator was the
          Sprint 3.2 #18 stop-gap before the proper view-shape split. */}

      {/* Reference Roast card */}
      <SectionCard title={`REFERENCE ROAST · BATCH #${refBatchLabel}`}>
        {/* Why this roast won — green-tinted verdict surface, the single
            most-important block on a resolved page. */}
        <div className="bg-latent-resolved-emphasis-surface border border-latent-resolved-emphasis rounded p-4 mb-6">
          <div className="label mb-2">Why this roast won</div>
          {learnings?.why_this_roast_won ? (
            <div className="font-sans text-sm leading-relaxed text-latent-fg">
              {learnings.why_this_roast_won}
            </div>
          ) : (
            <div className="font-sans text-xs italic text-latent-mid">
              Not yet populated. patch_roast_learnings(green_bean_id, why_this_roast_won: &quot;...&quot;)
              from claude.ai once the verdict prose is ready.
            </div>
          )}
        </div>

        {/* Reference Roast Recipe — Design vs Achieved two-column grid.
            Sprint 3.2 #20: min-w-0 on grid children so long prose values
            (e.g. fan_curve string) shrink-to-fit instead of overflowing. */}
        <div className="label mb-3">Reference Roast Recipe</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 font-sans text-sm">
          <div className="min-w-0">
            <div className="font-mono text-xxs uppercase tracking-wide text-latent-mid mb-2 opacity-70">
              Design
            </div>
            <RecipeRow label="Peak inlet" value={renderPeakInlet(referenceRecipe)} />
            <RecipeRow label="Drop temp" value={renderDropTemp(referenceRecipe)} />
            <RecipeRow label="End condition" value={renderEndCondition(referenceRecipe)} />
            <RecipeRow label="Charge / Hopper" value={renderChargeHopper(referenceRecipe)} />
            <RecipeRow label="Fan curve" value={renderFanCurve(referenceRecipe)} />
          </div>
          <div className="min-w-0">
            <div className="font-mono text-xxs uppercase tracking-wide text-latent-mid mb-2 opacity-70">
              Achieved
            </div>
            <RecipeRow label="FC time" value={referenceRoast?.fc_start ?? '—'} />
            <RecipeRow
              label="FC temp"
              value={referenceRoast?.fc_temp != null ? `${referenceRoast.fc_temp}°C` : '—'}
            />
            <RecipeRow label="Drop time" value={referenceRoast?.drop_time ?? '—'} />
            <RecipeRow
              label="Drop temp"
              value={referenceRoast?.drop_temp != null ? `${referenceRoast.drop_temp}°C` : '—'}
            />
            <RecipeRow
              label="Agtron WB / Δ"
              value={
                <span>
                  {referenceRoast?.agtron != null ? referenceRoast.agtron : '—'}
                  {wbGndDelta != null && (
                    <span className="text-latent-mid ml-2">
                      ({wbGndDelta > 0 ? '+' : ''}
                      {wbGndDelta})
                    </span>
                  )}
                </span>
              }
            />
          </div>
        </div>
        {referenceRecipe == null && referenceRoast != null && (
          <div className="mt-4 font-sans text-xs italic text-latent-mid">
            Recipe row not linked to this roast yet. Design-side fields populate when
            the recipe is enriched via patch_roast_recipe.
          </div>
        )}
      </SectionCard>

      {/* Reference Recipe Design Intent disclosure (Sub Pages 6.8) —
          collapsed drill-in surfacing drop rules for the single reference
          recipe, so the retrospective read ("what was the rule on the
          reference roast?") stays consultable without elevating amber to
          the resolved page's foreground (redesign.md § 5.5 lock). Renders a
          1-column DropRulesCard (referenceRecipe wrapped in a single-
          element array). Auto-hides until the reference recipe carries a
          populated rule. */}
      {referenceRecipe &&
        (referenceRecipe.drop_rule_if_fast || referenceRecipe.drop_rule_if_slow) && (
          <CollapsibleSection title="Reference Recipe Design Intent">
            <DropRulesCard recipes={[referenceRecipe]} />
          </CollapsibleSection>
        )}

      {/* Reference Cup card */}
      <SectionCard title="REFERENCE CUP">
        {bestCupSynthesis && (
          <div className="mb-6">
            <div className="label mb-2">Best cup synthesis</div>
            <div className="font-sans text-sm leading-relaxed">{bestCupSynthesis}</div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* LEFT — Pourover cupping on the reference roast.
              Sprint 3.2 #20: min-w-0 + break-words so long descriptor prose
              (e.g. Mandela XO's overall string) wraps instead of overflowing. */}
          <div className="bg-white border border-latent-border rounded p-4 min-w-0">
            <div className="label mb-1">Cupping · #{refBatchLabel}</div>
            {pourover ? (
              <>
                <div className="font-mono text-xs text-latent-mid mb-3">
                  {pourover.rest_days != null ? `${pourover.rest_days}d rest` : 'rest ?'}
                  {pourover.eval_method && ` · ${pourover.eval_method}`}
                </div>
                {pourover.overall ? (
                  <div className="font-sans text-sm leading-relaxed break-words">{pourover.overall}</div>
                ) : (
                  <div className="space-y-2 font-sans text-sm">
                    <CupRow label="Aroma" value={pourover.aroma} />
                    <CupRow label="Flavor" value={pourover.flavor} />
                    <CupRow label="Acidity" value={pourover.acidity} />
                    <CupRow label="Sweetness" value={pourover.sweetness} />
                    <CupRow label="Body" value={pourover.body} />
                    <CupRow label="Finish" value={pourover.finish} />
                    <CupRow label="Temperature behavior" value={pourover.temperature_behavior} />
                  </div>
                )}
                {/* Sprint 11 (migration 062, 2026-05-20): aromatic + structural behavior
                    relocated from roast_learnings per ADR-0008 — they render here as
                    per-cup character. Each renders as its own labeled block; conditional
                    on the value being present so empty cups stay clean. */}
                {(pourover.aromatic_behavior || pourover.structural_behavior) && (
                  <div className="mt-4 space-y-3 font-sans text-sm leading-relaxed break-words">
                    {pourover.aromatic_behavior && (
                      <div>
                        <div className="label">Aromatic behavior</div>
                        {pourover.aromatic_behavior}
                      </div>
                    )}
                    {pourover.structural_behavior && (
                      <div>
                        <div className="label">Structural behavior</div>
                        {pourover.structural_behavior}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="font-sans text-xs italic text-latent-mid">
                No pourover cupping on the reference roast. push_cupping a Day 7+ pourover
                eval to surface the integrated read here.
              </div>
            )}
          </div>

          {/* RIGHT — Optimized brew row joined via green_bean_id (prefers
              roast_id = best_roast_id, falls back to any brew on the lot).
              Sprint 3.2 #20: min-w-0 so the recipe-line + descriptors wrap
              inside the narrow column. */}
          <div className="bg-white border border-latent-border rounded p-4 min-w-0">
            <div className="label mb-1">Optimized Brew · #{refBatchLabel} retasted</div>
            {optimizedBrew ? (
              <>
                <div className="font-mono text-xs text-latent-mid mb-3">
                  {composeBrewRecipeLine(optimizedBrew) || '— recipe not populated —'}
                </div>
                {(optimizedBrew.extraction_strategy ||
                  (optimizedBrew.modifiers && optimizedBrew.modifiers.length > 0)) && (
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {optimizedBrew.extraction_strategy && (
                      <StrategyPill strategy={optimizedBrew.extraction_strategy} variant="row" />
                    )}
                    {optimizedBrew.modifiers && optimizedBrew.modifiers.length > 0 && (
                      <ModifierBadges modifiers={optimizedBrew.modifiers} />
                    )}
                  </div>
                )}
                {(() => {
                  const descriptors =
                    optimizedBrew.peak_expression ||
                    [
                      optimizedBrew.aroma,
                      optimizedBrew.attack,
                      optimizedBrew.mid_palate,
                      optimizedBrew.body,
                      optimizedBrew.finish,
                    ]
                      .filter(Boolean)
                      .join(' · ')
                  return descriptors ? (
                    <div className="font-sans text-sm leading-relaxed break-words">{descriptors}</div>
                  ) : null
                })()}
              </>
            ) : (
              <div className="font-sans text-xs italic text-latent-mid">
                No optimized brew logged for this lot yet. push_brew with source=&apos;self-roasted&apos;
                + roast_id={refRoastId ? `=${refRoastId}` : ' = <best_roast_id>'} to surface the
                retasted-with-final-recipe read here.
              </div>
            )}
          </div>
        </div>

        {bean.producer_tasting_notes && (
          <div className="mt-4 font-sans text-xs italic text-latent-mid leading-relaxed">
            <span className="font-mono uppercase tracking-wide not-italic mr-2 text-latent-subtle">
              Producer notes:
            </span>
            {bean.producer_tasting_notes}
          </div>
        )}
      </SectionCard>

      {/* Roasting Learnings: {lot} — three character cards + detail rows */}
      {learnings ? (
        <SectionCard title={`ROASTING LEARNINGS · ${bean.name || bean.lot_id}`}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <CharacterCard label="Primary Lever" value={learnings.primary_lever} />
            <CharacterCard label="Acceptable Roast Window" value={learnings.roast_window_width} />
            <CharacterCard label="Brewing Tolerance" value={learnings.brewing_tolerance} />
          </div>
          <div className="space-y-4 font-sans text-sm leading-relaxed">
            <LearningRow label="Secondary levers" value={learnings.secondary_levers} />
            <LearningRow label="Underdev signal" value={learnings.underdevelopment_signal} />
            <LearningRow label="Overdev signal" value={learnings.overdevelopment_signal} />
            <LearningRow label="What didn't matter" value={learnings.what_didnt_move_needle} />
            {/* Sprint 11 (migration 062, 2026-05-20): aromatic_behavior + structural_behavior
                relocated to cuppings per ADR-0008 — they render in the REFERENCE CUP pourover
                sub-card above as per-cup character, not as lot-aggregate learnings. */}
            <LearningRow label="Rest behavior" value={learnings.rest_behavior} />
          </div>
        </SectionCard>
      ) : (
        <SectionCard title="ROASTING LEARNINGS">
          <div className="font-sans text-sm italic text-latent-mid">
            No learnings row for this lot yet — push_roast_learnings to populate.
          </div>
        </SectionCard>
      )}

      {/* Roasting Learnings: To Carry Forward — generalization layer */}
      {learnings && (
        <SectionCard title="ROASTING LEARNINGS · TO CARRY FORWARD">
          {learnings.cultivar_takeaway ||
          learnings.terroir_takeaway ||
          learnings.general_takeaway ||
          learnings.starting_hypothesis ? (
            <div className="space-y-4 font-sans text-sm leading-relaxed">
              <LearningRow label="Cultivar takeaway" value={learnings.cultivar_takeaway} />
              <LearningRow label="Terroir takeaway" value={learnings.terroir_takeaway} />
              <LearningRow label="General takeaway" value={learnings.general_takeaway} />
              <LearningRow
                label="Starting hypothesis for similar lots"
                value={learnings.starting_hypothesis}
              />
            </div>
          ) : (
            <div className="font-sans text-sm italic text-latent-mid">
              Generalizations not yet drafted. patch_roast_learnings(cultivar_takeaway /
              terroir_takeaway / general_takeaway / starting_hypothesis) once cross-lot
              synthesis is done.
            </div>
          )}
        </SectionCard>
      )}

      {/* Green Bean Info — shared 6.4 component, third consumer */}
      <GreenBeanInfoCard bean={bean} />

      {/* Roast log — collapsed by default on resolved view; ref batch
          highlighted when expanded. defaultCollapsed=true gets its first
          real consumer here (6.4 forward investment). */}
      <RoastLogTable
        roasts={roasts}
        cuppings={cuppings}
        defaultCollapsed
        highlightedBatchIds={batchNumber ? [batchNumber] : []}
      />

      {/* Per-roast reflections (Sub Pages 6.7) — collapsed details surfacing
          what_worked / what_didnt / what_to_change per roast. Most densely
          populated on resolved lots where Chris has logged the full
          execution prose; auto-hides when no roasts have any reflection
          field populated. */}
      <PerRoastReflections roasts={roasts} />

      {/* All cuppings · {N} evaluations — collapsed details, one row per
          cupping in chronological order; ref roast's cuppings get
          font-semibold + a star marker. */}
      {cuppings.length > 0 && (
        <CollapsibleSection title={`All Cuppings (${cuppings.length} EVALUATIONS)`}>
          <div className="space-y-4">
            {cuppings.map((cup, i) => {
              const roast = cup.roast_id ? roastsById.get(cup.roast_id) : null
              const isRef = roast?.id === refRoastId
              const descriptors =
                cup.overall ||
                [cup.aroma, cup.flavor, cup.acidity, cup.sweetness, cup.body, cup.finish]
                  .filter(Boolean)
                  .join(' · ')
              return (
                <div
                  key={cup.id ?? i}
                  className="pb-4 border-b border-latent-border last:border-b-0 last:pb-0"
                >
                  <div
                    className={`font-mono text-xs mb-1 ${
                      isRef ? 'text-latent-fg font-semibold' : 'text-latent-mid'
                    }`}
                  >
                    Batch #{roast?.batch_id ?? '?'}
                    {' · '}
                    {cup.rest_days != null ? `${cup.rest_days}d rest` : 'rest ?'}
                    {cup.eval_method && ` · ${cup.eval_method}`}
                    {isRef && <span className="ml-2">⭐ reference</span>}
                    {cup.recipe_variant && ` · ${cup.recipe_variant}`}
                    {cup.ground_agtron != null && ` · Gnd Agtron: ${cup.ground_agtron}`}
                  </div>
                  <div className="font-sans text-sm leading-relaxed">{descriptors || '—'}</div>
                  {cup.temperature_behavior && (
                    <div className="font-sans text-sm leading-relaxed mt-1 text-latent-mid">
                      <span className="label mr-1 inline-block">Temp behavior</span>
                      {cup.temperature_behavior}
                    </div>
                  )}
                  {cup.wb_to_ground_delta != null && (
                    <div className="font-mono text-xs text-latent-mid mt-1">
                      WB→Gnd Δ: {cup.wb_to_ground_delta > 0 ? '+' : ''}
                      {cup.wb_to_ground_delta}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CollapsibleSection>
      )}

      {/* Experiment journey · V1 through V_n — collapsed details, per-set
          summary cards (primary_question + winner + key_insight only — per
          scope § 5.4 "curated narrative content, not chronology"). */}
      {experimentsChrono.length > 0 && (
        <CollapsibleSection title={`Experiment Journey (${experimentsChrono.length} SETS)`}>
          <div className="space-y-6">
            {experimentsChrono.map((exp, i) => (
              <div
                key={exp.id ?? i}
                className="pb-6 border-b border-latent-border last:border-b-0 last:pb-0"
              >
                <div className="font-mono text-sm font-semibold mb-1">{exp.experiment_id}</div>
                {exp.batch_ids && (
                  <div className="font-mono text-xs text-latent-mid mb-4">
                    Batches: {exp.batch_ids}
                  </div>
                )}
                <div className="space-y-3 font-sans text-sm leading-relaxed">
                  {exp.primary_question && (
                    <div>
                      <div className="label">Primary Question</div>
                      {exp.primary_question}
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
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Sprint 3.2 #19 — Additional Information placeholder removed. The
          resolved view's surface is already dense; the empty disclosure was
          forward-investment for content that didn't materialize. */}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-sprint 4a (2026-05-27) — Unresolved view
//
// Same archive shape as Resolved, but for lots that closed without a
// confirmed reference (why_this_roast_won IS NULL). Diffs from ResolvedView:
//   - Hero tile: gray (latent-mid) instead of green (resolved-emphasis)
//   - Badge: "Unresolved" with neutral gray treatment
//   - "Why this roast won" verdict block: omitted entirely (no placeholder)
//   - "REFERENCE" → "LEADING" across 4 surfaces: section titles, sub-card
//     labels, collapsible disclosure title
//   - Muted caution annotation under "ROASTING LEARNINGS · TO CARRY FORWARD"
//     so these takeaways read as working hypotheses, not validated rules
//   - "⭐ reference" cupping marker → "⭐ leading"
// Everything else (GreenBeanInfoCard / RoastLogTable / PerRoastReflections /
// All Cuppings / Experiment Journey) renders identically.
//
// Today's unresolved-lot examples: Higuito (Batch #185), CGLE Sudan Rume
// Natural (Batch #187), Rancho Tio Emilio (Batch #133 — pre-framework). All
// three have rich primary_lever + cultivar_takeaway + general_takeaway prose;
// all three have NULL why_this_roast_won + starting_hypothesis. Per the
// complementary-pass §1 diagnosis, the lifecycle helper used to route these
// to `resolved` and ResolvedView rendered a contradictory page (badge said
// "Resolved" + disambiguator said no-reference + reference card rendered
// anyway). The Sub-sprint 4a discriminator + new view-shape together fix it.
// ---------------------------------------------------------------------------

function UnresolvedView({
  bean,
  cuppings,
  brewsForLot,
}: {
  bean: any
  cuppings: any[]
  brewsForLot: any[]
}) {
  const learnings =
    (Array.isArray(bean.roast_learnings) ? bean.roast_learnings[0] : bean.roast_learnings) ?? null
  const rawBestBatchId: string | null = learnings?.best_batch_id ?? null
  const batchNumber = extractBatchNumber(rawBestBatchId)
  const refRoastId: string | null = learnings?.best_roast_id ?? null

  const roasts = ((bean.roasts ?? []) as any[]).slice().sort((a, b) => {
    const ad = a.roast_date ?? a.created_at ?? ''
    const bd = b.roast_date ?? b.created_at ?? ''
    return ad.localeCompare(bd)
  })
  const referenceRoast = refRoastId ? roasts.find((r) => r.id === refRoastId) ?? null : null
  const referenceRecipe =
    referenceRoast?.recipe_id
      ? ((bean.recipes ?? []) as RoastRecipe[]).find((r) => r.id === referenceRoast.recipe_id) ?? null
      : null

  const pourover = pickPourover(cuppings, refRoastId)
  const optimizedBrew = pickOptimizedBrew(brewsForLot, refRoastId)
  const primaryGroundAgtron =
    (typeof pourover?.ground_agtron === 'number' ? pourover.ground_agtron : null) ??
    (cuppings.find((c) => c.roast_id === refRoastId && typeof c.ground_agtron === 'number')
      ?.ground_agtron as number | undefined) ??
    null
  const wbGndDelta =
    typeof referenceRoast?.agtron === 'number' && typeof primaryGroundAgtron === 'number'
      ? Number((referenceRoast.agtron - primaryGroundAgtron).toFixed(1))
      : null

  const experimentsChrono = ((bean.experiments ?? []) as any[]).slice().sort((a, b) =>
    (a.created_at ?? '').localeCompare(b.created_at ?? ''),
  )

  const roastsById = new Map<string, any>(roasts.map((r) => [r.id, r]))

  const bestCupSynthesis = optimizedBrew?.what_i_learned || pourover?.overall || null
  const refBatchLabel = batchNumber ?? rawBestBatchId ?? '?'

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Link
        href="/green"
        className="font-mono text-xs text-latent-mid hover:text-latent-fg mb-6 inline-block"
      >
        ← Back to Green Beans
      </Link>

      {/* Lot header — gray tile signals "no confirmed answer" per the
          ratified Sub-sprint 4a decision (reuse latent-mid rather than
          adding a new token). "Unresolved" badge uses neutral gray
          treatment, distinct from Resolved's green-emphasis treatment. */}
      <div className="flex gap-6 mb-8">
        <div className="w-20 h-20 bg-latent-mid rounded-md flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-3 flex-wrap mb-2">
            <h1 className="font-sans text-2xl font-semibold">
              🌱 {bean.name || bean.lot_id}
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 text-xxs font-mono uppercase tracking-wide bg-latent-bg text-latent-fg border border-latent-mid rounded">
              Unresolved
            </span>
          </div>
          {bean.lot_id && (
            <div className="font-mono text-xs text-latent-mid mb-1">
              Lot: {bean.lot_id}
            </div>
          )}
          <div className="font-mono text-sm text-latent-mid">
            {composeLotMeta(bean)}
          </div>
        </div>
      </div>

      {/* Leading Roast card — same shape as Resolved's Reference Roast card
          but with the "Why this roast won" verdict block omitted entirely
          (per the ratified Sub-sprint 4a decision: drop verdict, keep grid).
          The Design/Achieved grid still surfaces the candidate's recipe +
          actuals because that data IS real — just not a confirmed reference. */}
      <SectionCard title={`LEADING ROAST · BATCH #${refBatchLabel}`}>
        {/* Leading Roast Recipe — Design vs Achieved two-column grid.
            min-w-0 on grid children so long prose values shrink-to-fit. */}
        <div className="label mb-3">Leading Roast Recipe</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 font-sans text-sm">
          <div className="min-w-0">
            <div className="font-mono text-xxs uppercase tracking-wide text-latent-mid mb-2 opacity-70">
              Design
            </div>
            <RecipeRow label="Peak inlet" value={renderPeakInlet(referenceRecipe)} />
            <RecipeRow label="Drop temp" value={renderDropTemp(referenceRecipe)} />
            <RecipeRow label="End condition" value={renderEndCondition(referenceRecipe)} />
            <RecipeRow label="Charge / Hopper" value={renderChargeHopper(referenceRecipe)} />
            <RecipeRow label="Fan curve" value={renderFanCurve(referenceRecipe)} />
          </div>
          <div className="min-w-0">
            <div className="font-mono text-xxs uppercase tracking-wide text-latent-mid mb-2 opacity-70">
              Achieved
            </div>
            <RecipeRow label="FC time" value={referenceRoast?.fc_start ?? '—'} />
            <RecipeRow
              label="FC temp"
              value={referenceRoast?.fc_temp != null ? `${referenceRoast.fc_temp}°C` : '—'}
            />
            <RecipeRow label="Drop time" value={referenceRoast?.drop_time ?? '—'} />
            <RecipeRow
              label="Drop temp"
              value={referenceRoast?.drop_temp != null ? `${referenceRoast.drop_temp}°C` : '—'}
            />
            <RecipeRow
              label="Agtron WB / Δ"
              value={
                <span>
                  {referenceRoast?.agtron != null ? referenceRoast.agtron : '—'}
                  {wbGndDelta != null && (
                    <span className="text-latent-mid ml-2">
                      ({wbGndDelta > 0 ? '+' : ''}
                      {wbGndDelta})
                    </span>
                  )}
                </span>
              }
            />
          </div>
        </div>
        {referenceRecipe == null && referenceRoast != null && (
          <div className="mt-4 font-sans text-xs italic text-latent-mid">
            Recipe row not linked to this roast yet. Design-side fields populate when
            the recipe is enriched via patch_roast_recipe.
          </div>
        )}
      </SectionCard>

      {/* Leading Recipe Design Intent disclosure — parallels ResolvedView's
          Reference Recipe Design Intent. Auto-hides until the leading
          recipe carries a populated drop rule. */}
      {referenceRecipe &&
        (referenceRecipe.drop_rule_if_fast || referenceRecipe.drop_rule_if_slow) && (
          <CollapsibleSection title="Leading Recipe Design Intent">
            <DropRulesCard recipes={[referenceRecipe]} />
          </CollapsibleSection>
        )}

      {/* Leading Cup card — parallels Reference Cup with vocabulary rotation. */}
      <SectionCard title="LEADING CUP">
        {bestCupSynthesis && (
          <div className="mb-6">
            <div className="label mb-2">Leading cup synthesis</div>
            <div className="font-sans text-sm leading-relaxed">{bestCupSynthesis}</div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* LEFT — Pourover cupping on the leading roast. */}
          <div className="bg-white border border-latent-border rounded p-4 min-w-0">
            <div className="label mb-1">Cupping · #{refBatchLabel}</div>
            {pourover ? (
              <>
                <div className="font-mono text-xs text-latent-mid mb-3">
                  {pourover.rest_days != null ? `${pourover.rest_days}d rest` : 'rest ?'}
                  {pourover.eval_method && ` · ${pourover.eval_method}`}
                </div>
                {pourover.overall ? (
                  <div className="font-sans text-sm leading-relaxed break-words">{pourover.overall}</div>
                ) : (
                  <div className="space-y-2 font-sans text-sm">
                    <CupRow label="Aroma" value={pourover.aroma} />
                    <CupRow label="Flavor" value={pourover.flavor} />
                    <CupRow label="Acidity" value={pourover.acidity} />
                    <CupRow label="Sweetness" value={pourover.sweetness} />
                    <CupRow label="Body" value={pourover.body} />
                    <CupRow label="Finish" value={pourover.finish} />
                    <CupRow label="Temperature behavior" value={pourover.temperature_behavior} />
                  </div>
                )}
                {(pourover.aromatic_behavior || pourover.structural_behavior) && (
                  <div className="mt-4 space-y-3 font-sans text-sm leading-relaxed break-words">
                    {pourover.aromatic_behavior && (
                      <div>
                        <div className="label">Aromatic behavior</div>
                        {pourover.aromatic_behavior}
                      </div>
                    )}
                    {pourover.structural_behavior && (
                      <div>
                        <div className="label">Structural behavior</div>
                        {pourover.structural_behavior}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="font-sans text-xs italic text-latent-mid">
                No pourover cupping on the leading roast. push_cupping a Day 7+ pourover
                eval to surface the integrated read here.
              </div>
            )}
          </div>

          {/* RIGHT — Optimized brew row joined via green_bean_id. */}
          <div className="bg-white border border-latent-border rounded p-4 min-w-0">
            <div className="label mb-1">Optimized Brew · #{refBatchLabel} retasted</div>
            {optimizedBrew ? (
              <>
                <div className="font-mono text-xs text-latent-mid mb-3">
                  {composeBrewRecipeLine(optimizedBrew) || '— recipe not populated —'}
                </div>
                {(optimizedBrew.extraction_strategy ||
                  (optimizedBrew.modifiers && optimizedBrew.modifiers.length > 0)) && (
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {optimizedBrew.extraction_strategy && (
                      <StrategyPill strategy={optimizedBrew.extraction_strategy} variant="row" />
                    )}
                    {optimizedBrew.modifiers && optimizedBrew.modifiers.length > 0 && (
                      <ModifierBadges modifiers={optimizedBrew.modifiers} />
                    )}
                  </div>
                )}
                {(() => {
                  const descriptors =
                    optimizedBrew.peak_expression ||
                    [
                      optimizedBrew.aroma,
                      optimizedBrew.attack,
                      optimizedBrew.mid_palate,
                      optimizedBrew.body,
                      optimizedBrew.finish,
                    ]
                      .filter(Boolean)
                      .join(' · ')
                  return descriptors ? (
                    <div className="font-sans text-sm leading-relaxed break-words">{descriptors}</div>
                  ) : null
                })()}
              </>
            ) : (
              <div className="font-sans text-xs italic text-latent-mid">
                No optimized brew logged for this lot yet. push_brew with source=&apos;self-roasted&apos;
                + roast_id={refRoastId ? `=${refRoastId}` : ' = <best_roast_id>'} to surface the
                retasted-with-final-recipe read here.
              </div>
            )}
          </div>
        </div>

        {bean.producer_tasting_notes && (
          <div className="mt-4 font-sans text-xs italic text-latent-mid leading-relaxed">
            <span className="font-mono uppercase tracking-wide not-italic mr-2 text-latent-subtle">
              Producer notes:
            </span>
            {bean.producer_tasting_notes}
          </div>
        )}
      </SectionCard>

      {/* Roasting Learnings: {lot} — three character cards + detail rows.
          Renders the same shape as ResolvedView — these prose fields are
          per-lot character that's real regardless of verdict. */}
      {learnings ? (
        <SectionCard title={`ROASTING LEARNINGS · ${bean.name || bean.lot_id}`}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <CharacterCard label="Primary Lever" value={learnings.primary_lever} />
            <CharacterCard label="Acceptable Roast Window" value={learnings.roast_window_width} />
            <CharacterCard label="Brewing Tolerance" value={learnings.brewing_tolerance} />
          </div>
          <div className="space-y-4 font-sans text-sm leading-relaxed">
            <LearningRow label="Secondary levers" value={learnings.secondary_levers} />
            <LearningRow label="Underdev signal" value={learnings.underdevelopment_signal} />
            <LearningRow label="Overdev signal" value={learnings.overdevelopment_signal} />
            <LearningRow label="What didn't matter" value={learnings.what_didnt_move_needle} />
            <LearningRow label="Rest behavior" value={learnings.rest_behavior} />
          </div>
        </SectionCard>
      ) : (
        <SectionCard title="ROASTING LEARNINGS">
          <div className="font-sans text-sm italic text-latent-mid">
            No learnings row for this lot yet — push_roast_learnings to populate.
          </div>
        </SectionCard>
      )}

      {/* Roasting Learnings: To Carry Forward — generalization layer.
          Sub-sprint 4a adds a muted caution annotation since these takeaways
          come from a lot without a confirmed verdict — read as working
          hypotheses, not validated rules. */}
      {learnings && (
        <SectionCard title="ROASTING LEARNINGS · TO CARRY FORWARD">
          <div className="font-sans text-xs italic text-latent-mid mb-4">
            These takeaways come from a lot that closed without a confirmed reference.
            Read as working hypotheses, not validated rules.
          </div>
          {learnings.cultivar_takeaway ||
          learnings.terroir_takeaway ||
          learnings.general_takeaway ||
          learnings.starting_hypothesis ? (
            <div className="space-y-4 font-sans text-sm leading-relaxed">
              <LearningRow label="Cultivar takeaway" value={learnings.cultivar_takeaway} />
              <LearningRow label="Terroir takeaway" value={learnings.terroir_takeaway} />
              <LearningRow label="General takeaway" value={learnings.general_takeaway} />
              <LearningRow
                label="Starting hypothesis for similar lots"
                value={learnings.starting_hypothesis}
              />
            </div>
          ) : (
            <div className="font-sans text-sm italic text-latent-mid">
              Generalizations not yet drafted. patch_roast_learnings(cultivar_takeaway /
              terroir_takeaway / general_takeaway / starting_hypothesis) once cross-lot
              synthesis is done.
            </div>
          )}
        </SectionCard>
      )}

      <GreenBeanInfoCard bean={bean} />

      <RoastLogTable
        roasts={roasts}
        cuppings={cuppings}
        defaultCollapsed
        highlightedBatchIds={batchNumber ? [batchNumber] : []}
      />

      <PerRoastReflections roasts={roasts} />

      {cuppings.length > 0 && (
        <CollapsibleSection title={`All Cuppings (${cuppings.length} EVALUATIONS)`}>
          <div className="space-y-4">
            {cuppings.map((cup, i) => {
              const roast = cup.roast_id ? roastsById.get(cup.roast_id) : null
              const isLeading = roast?.id === refRoastId
              const descriptors =
                cup.overall ||
                [cup.aroma, cup.flavor, cup.acidity, cup.sweetness, cup.body, cup.finish]
                  .filter(Boolean)
                  .join(' · ')
              return (
                <div
                  key={cup.id ?? i}
                  className="pb-4 border-b border-latent-border last:border-b-0 last:pb-0"
                >
                  <div
                    className={`font-mono text-xs mb-1 ${
                      isLeading ? 'text-latent-fg font-semibold' : 'text-latent-mid'
                    }`}
                  >
                    Batch #{roast?.batch_id ?? '?'}
                    {' · '}
                    {cup.rest_days != null ? `${cup.rest_days}d rest` : 'rest ?'}
                    {cup.eval_method && ` · ${cup.eval_method}`}
                    {isLeading && <span className="ml-2">⭐ leading</span>}
                    {cup.recipe_variant && ` · ${cup.recipe_variant}`}
                    {cup.ground_agtron != null && ` · Gnd Agtron: ${cup.ground_agtron}`}
                  </div>
                  <div className="font-sans text-sm leading-relaxed">{descriptors || '—'}</div>
                  {cup.temperature_behavior && (
                    <div className="font-sans text-sm leading-relaxed mt-1 text-latent-mid">
                      <span className="label mr-1 inline-block">Temp behavior</span>
                      {cup.temperature_behavior}
                    </div>
                  )}
                  {cup.wb_to_ground_delta != null && (
                    <div className="font-mono text-xs text-latent-mid mt-1">
                      WB→Gnd Δ: {cup.wb_to_ground_delta > 0 ? '+' : ''}
                      {cup.wb_to_ground_delta}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CollapsibleSection>
      )}

      {experimentsChrono.length > 0 && (
        <CollapsibleSection title={`Experiment Journey (${experimentsChrono.length} SETS)`}>
          <div className="space-y-6">
            {experimentsChrono.map((exp, i) => (
              <div
                key={exp.id ?? i}
                className="pb-6 border-b border-latent-border last:border-b-0 last:pb-0"
              >
                <div className="font-mono text-sm font-semibold mb-1">{exp.experiment_id}</div>
                {exp.batch_ids && (
                  <div className="font-mono text-xs text-latent-mid mb-4">
                    Batches: {exp.batch_ids}
                  </div>
                )}
                <div className="space-y-3 font-sans text-sm leading-relaxed">
                  {exp.primary_question && (
                    <div>
                      <div className="label">Primary Question</div>
                      {exp.primary_question}
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
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Inventory placeholder — in_inventory lots are filtered out of the /green
// index (scope doc § 5.1) but reachable via direct URL. Surface a minimal
// page so the route still resolves rather than 404s on a real lot. The
// dedicated inventory page is punted to a later sprint per scope doc § 6.
// ---------------------------------------------------------------------------

function InventoryPlaceholder({ bean }: { bean: any }) {
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
            {composeLotMeta(bean)}
          </div>
        </div>
      </div>

      <SectionCard title="IN INVENTORY">
        <div className="font-sans text-sm leading-relaxed text-latent-mid italic">
          This lot is in inventory — no experiments designed yet. Design V1 in claude.ai
          via push_experiment + push_roast_recipe to surface the waiting-for-next-roast
          view here. The /green index intentionally hides in-inventory lots; this page
          is only reachable via direct URL.
        </div>
      </SectionCard>

      <GreenBeanInfoCard bean={bean} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Helpers shared across the resolved view
// ---------------------------------------------------------------------------

// Latest pourover cupping on the reference roast. Falls back to any cupping
// on that roast if no pourover exists. Returns null when refRoastId is null
// or no cuppings match.
function pickPourover(cuppings: any[], refRoastId: string | null): any | null {
  if (!refRoastId) return null
  const onRef = cuppings.filter((c) => c.roast_id === refRoastId)
  if (onRef.length === 0) return null
  const pourovers = onRef.filter(
    (c) => typeof c.eval_method === 'string' && /pourover/i.test(c.eval_method),
  )
  const pool = pourovers.length > 0 ? pourovers : onRef
  return (
    [...pool].sort((a, b) => (b.cupping_date ?? '').localeCompare(a.cupping_date ?? ''))[0] ?? null
  )
}

// Optimized brew row for the lot. Prefers roast_id === refRoastId (cleanest
// linkage — Sudan Rume / Mandela XO patterns); falls back to first brew row
// on the lot (legacy data shape — Surma / Oma / Libertad / El Socorro have
// roast_id=NULL on their single brew row). Returns null when the lot has no
// brews at all.
function pickOptimizedBrew(brewsForLot: any[], refRoastId: string | null): any | null {
  if (brewsForLot.length === 0) return null
  if (refRoastId) {
    const matched = brewsForLot.find((b) => b.roast_id === refRoastId)
    if (matched) return matched
  }
  return brewsForLot[0] ?? null
}

// Compose a compact brew recipe line: brewer · filter · dose:water (ratio) ·
// temp · grinder + setting. Pieces that are null skip silently. Returns null
// when nothing is populated so the caller can render an em-dash fallback.
function composeBrewRecipeLine(brew: any): string | null {
  const parts: string[] = []
  if (brew.brewer) parts.push(brew.brewer)
  if (brew.filter) parts.push(brew.filter)
  if (brew.dose_g != null && brew.water_g != null) {
    const ratio = brew.ratio ? ` (${brew.ratio})` : ''
    parts.push(`${brew.dose_g}g:${brew.water_g}g${ratio}`)
  }
  if (brew.temp_c != null) parts.push(`${brew.temp_c}°C`)
  if (brew.grinder && brew.grind_setting) {
    parts.push(`${brew.grinder} ${brew.grind_setting}`)
  } else if (brew.grinder) {
    parts.push(brew.grinder)
  } else if (brew.grind) {
    parts.push(brew.grind)
  }
  return parts.length > 0 ? parts.join(' · ') : null
}

// roast_recipes-side renderers. All return em-dash when the underlying field
// is NULL. The 6 currently-resolved lots all have NULL beziers (Phase 3
// backfill is intentionally empty per redesign doc § 7) so Peak inlet + Fan
// curve render em-dashes today and light up as recipes are enriched.
function renderPeakInlet(recipe: RoastRecipe | null): React.ReactNode {
  if (!recipe?.temperature_bezier) return '—'
  try {
    const points = recipe.temperature_bezier as Array<Record<string, number>>
    if (!Array.isArray(points) || points.length === 0) return '—'
    const temps = points
      .map((p) => p.temp ?? p.value ?? null)
      .filter((v): v is number => typeof v === 'number')
    if (temps.length === 0) return '—'
    return `${Math.max(...temps)}°C`
  } catch {
    return '—'
  }
}

function renderDropTemp(recipe: RoastRecipe | null): React.ReactNode {
  if (recipe?.end_condition_type === 'bean_temp' && recipe.end_condition_target != null) {
    return `${recipe.end_condition_target}°C`
  }
  return '—'
}

function renderEndCondition(recipe: RoastRecipe | null): React.ReactNode {
  if (!recipe?.end_condition_type) return '—'
  const unit =
    recipe.end_condition_type === 'bean_temp'
      ? '°C'
      : recipe.end_condition_type === 'dev_time'
        ? 's'
        : ''
  return (
    <span className="font-mono text-xs">
      {recipe.end_condition_type.toUpperCase()}
      {recipe.end_condition_target != null ? ` ${recipe.end_condition_target}${unit}` : ''}
    </span>
  )
}

function renderChargeHopper(recipe: RoastRecipe | null): React.ReactNode {
  if (!recipe) return '—'
  const charge = recipe.charge_temp != null ? `${recipe.charge_temp}°C` : null
  const hopper = recipe.hopper_load_temp != null ? `${recipe.hopper_load_temp}°C` : null
  if (charge && hopper) return `${charge} / ${hopper}`
  return charge ?? hopper ?? '—'
}

function renderFanCurve(recipe: RoastRecipe | null): React.ReactNode {
  if (!recipe?.fan_bezier) return '—'
  try {
    const points = recipe.fan_bezier as Array<Record<string, number>>
    if (!Array.isArray(points) || points.length === 0) return '—'
    const pcts = points
      .map((p) => p.pct ?? p.value ?? null)
      .filter((v): v is number => typeof v === 'number')
      .map((v) => `${Math.round(v)}%`)
    return pcts.length > 0 ? (
      <span className="font-mono text-xs">{pcts.join(' → ')}</span>
    ) : (
      '—'
    )
  } catch {
    return '—'
  }
}

function RecipeRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-2 mb-1">
      <span className="font-sans text-xs text-latent-mid w-32 flex-shrink-0">{label}</span>
      <span className="font-sans text-sm">{value}</span>
    </div>
  )
}

function CupRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div>
      <span className="font-mono text-xxs uppercase tracking-wide text-latent-subtle mr-2">
        {label}
      </span>
      <span>{value}</span>
    </div>
  )
}

function CharacterCard({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="bg-white border border-latent-border rounded p-4">
      <div className="label mb-2">{label}</div>
      {value ? (
        <div className="font-sans text-sm leading-relaxed">{value}</div>
      ) : (
        <div className="font-sans text-xs italic text-latent-mid">Not populated</div>
      )}
    </div>
  )
}

function LearningRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div>
      <div className="label">{label}</div>
      {value}
    </div>
  )
}

