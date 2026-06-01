import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  Chip,
  StatusPill,
  SspTopBar,
  SspNamePlate,
  SspShead,
  SspExpGrid,
  SspProseRows,
  type ExpRow,
} from '@/components/Ssp'
import { GreenBeanInfoCard } from '@/components/GreenBeanInfoCard'
import { RoastLogTable } from '@/components/RoastLogTable'
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

  // Redesign Sprint 3 (2026-05-29) — re-skin to the Ssp* lab-document family.
  // Soft mobile-primary (consulted at the desk during V-set design): single
  // `.ssp-page` column tree, no dual-subtree (the .ssp-exp grid's <520px
  // narrow variant handles the transposed hypothesis table; the table is
  // design-intent reference with fewer rows than the cupping actuals, so no
  // transposed→slot-card recomposition is needed). The 6.3 IA is preserved —
  // Primary Question → Roast Hypothesis transposed table (variance-gated amber
  // lever rows) → Drop Rules inset → green-bean info → experiment frame → roast
  // log. Shared components below the re-skinned hypothesis card stay
  // legacy-skinned through the migration window (Chris-confirmed "keep the
  // seam" 2026-05-29) — they re-skin on a dedicated green shared-components
  // sprint that covers the remaining 4 shapes at once.
  const vLabel = latestExp ? formatVLabel(latestExp.experiment_id) : null
  const hypo = recipesForLatest.length > 0 ? buildHypothesisData(recipesForLatest) : null
  const showDropRules = recipesForLatest.some((r) => r.drop_rule_if_fast || r.drop_rule_if_slow)
  // Anchor caption — mono line above the table. control_baseline carries the
  // anchor/baseline reference (the same field the cupping view's "Anchor cup"
  // reuses per the 6.4 lock). Skipped when NULL.
  const anchorLine = latestExp?.control_baseline ?? null

  const metaPairs = [
    { label: 'Producer', value: bean.producer ?? '—' },
    { label: 'Origin', value: bean.origin ?? bean.terroir?.country ?? '—' },
    { label: 'Variety', value: bean.variety ?? bean.cultivar?.cultivar_name ?? '—' },
  ]
  const pills = [
    <StatusPill key="state" label="Waiting · Next Roast" tone="amber" />,
    ...(bean.process ? [<Chip key="proc" name={bean.process} tone="green" />] : []),
    ...(vLabel ? [<Chip key="vset" name={`${vLabel} · awaiting roast`} tone="plum" />] : []),
  ]

  return (
    <div className="ssp-page">
      <Link
        href="/green"
        className="font-mono text-xs uppercase tracking-[0.16em] text-latent-mid hover:text-latent-fg"
      >
        ← Back to Green Beans
      </Link>

      {/* Header — amber (roast-emphasis) cover marks the waiting-for-roast
          lifecycle state per the v2 artboard STATE["stage-1"]. */}
      <SspTopBar
        brewId={bean.lot_id ?? undefined}
        date={`${roasts.length} ROAST${roasts.length === 1 ? '' : 'S'}`}
        roaster="WAITING · NEXT ROAST"
        kind="Green Lot"
      />
      <SspNamePlate
        title={bean.name || bean.lot_id}
        coverColor="#A88037"
        edgeColor="#A88037"
        meta={metaPairs}
        pills={pills}
      />

      {/* Roast Hypothesis card — the load-bearing surface. Primary Question +
          transposed V_n design-intent grid + Drop Rules inset (amber). The
          V-label comes from experiment_id when set ("MX-DEV-v3" → "V3"). */}
      {latestExp ? (
        <div className="ssp-card state-roast">
          {/* Corner is just the V-label (not "· Gold Standard" from the
              artboard) — matches the shipped Sprint 2 cupping view and avoids
              the long badge colliding with the shead context line at 390. */}
          <span className="ssp-corner">{vLabel}</span>
          <SspShead
            ct={
              recipesForLatest.length > 0
                ? `${recipesForLatest.length} slot${recipesForLatest.length === 1 ? '' : 's'} · pre-roast design`
                : 'pre-roast design'
            }
          >
            Roast Hypothesis · {vLabel}
          </SspShead>

          {latestExp.primary_question && (
            <div className="ssp-question">
              <div className="lbl">Primary Question</div>
              <div className="body">{latestExp.primary_question}</div>
            </div>
          )}

          {/* Labelled so it doesn't read as a second font on the primary question
              (WR-2, 2026-05-30) — this is the V_(n-1) baseline we're moving from,
              a distinct reference field from the question above it. */}
          {anchorLine && (
            <div className="ssp-anchor">
              <div className="lbl">Anchor · baseline we&apos;re moving from</div>
              <div className="ssp-anchor-line">{anchorLine}</div>
            </div>
          )}

          {hypo && hypo.rows.length > 0 ? (
            <SspExpGrid cols={hypo.cols} rows={hypo.rows} />
          ) : recipesForLatest.length > 0 ? (
            <div className="font-sans text-sm text-latent-mid italic">
              Recipes exist but no predictions populated yet. Push design-time
              fields via patch_roast_recipe (predicted_fc_temp / predicted_fc_time
              / predicted_total_time / predicted_agtron_wb / rationale / etc.) to
              light up this table.
            </div>
          ) : (
            <div className="font-sans text-sm text-latent-mid italic">
              No recipes linked to this experiment yet. Recipes land when
              claude.ai pushes them via the push_roast_recipe MCP Tool — each
              batch (v_na / v_nb / v_nc) becomes one recipe row with curves, drop
              rules, and design-time predictions. Today the experiment frame is
              here ({experiments.length === 1 ? '1 experiment' : `${experiments.length} experiments`}{' '}
              logged for this lot, latest: {latestExp.experiment_id}); the
              per-batch design intent is pending.
            </div>
          )}

          {/* Drop Rules — amber .ssp-inset (grid mode) inside the hypothesis
              card per the v2 artboard, via the shared DropRulesCard primitive
              (passes a V-labelled title). Only renders when at least one recipe
              has a rule. Per scope doc § 5.5 drop rules are roast-side signals
              to watch during execution. */}
          {showDropRules && (
            <DropRulesCard recipes={recipesForLatest} title={`Drop Rules · ${vLabel}`} />
          )}
        </div>
      ) : (
        <div className="ssp-card state-roast">
          <SspShead ct="pre-roast design">Roast Hypothesis</SspShead>
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
        </div>
      )}

      {/* Shared components below — legacy chrome through the migration window
          (Chris-confirmed "keep the seam"). GreenBeanInfoCard first (lot
          identity), then the collapsed experiment frame, roast log, and
          per-roast reflections. */}
      <GreenBeanInfoCard bean={bean} />

      {latestExp && (
        <CollapsibleSection title={`EXPERIMENT FRAME · ${vLabel}`}>
          <ExperimentFrameCard latestExp={latestExp} title="" bare />
        </CollapsibleSection>
      )}

      <RoastLogTable
        roasts={roasts}
        cuppings={cuppings}
        defaultCollapsed
        highlightedBatchIds={Array.from(currentExpBatchIds)}
      />

      <PerRoastReflections roasts={roasts} />

      <details className="ssp-coll">
        <summary>
          Additional Information
          <span className="ct">Full history renders on the resolved view</span>
          <span className="chev" />
        </summary>
        <div className="body">
          <div className="ssp-sub">
            <div className="font-sans text-sm text-latent-mid italic">
              Deeper detail (cupping history, all experiments, roast learnings,
              related brews) renders on the resolved-lot page shape. The
              waiting-for-next-roast view stays focused on what&apos;s queued to
              roast.
            </div>
          </div>
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

// Sub-sprint 4a Bundle B — Hypothesis row truncation helper. Returns the
// first sentence + ellipsis when prose is long; the full string otherwise.
// First-sentence boundary = first sentence-terminating period (with at
// least one non-period char before it), falling back to a 70-char hard cap
// when no boundary found within ~120 chars (covers run-on prose / fragments
// without sentence boundaries).
function truncateHypothesis(prose: string): string {
  const trimmed = prose.trim()
  if (trimmed.length <= 70) return trimmed
  // Find first sentence boundary in the first 120 chars.
  const window = trimmed.slice(0, 120)
  const match = window.match(/[A-Za-z0-9)]\.\s/)
  if (match && match.index != null && match.index > 10) {
    return trimmed.slice(0, match.index + 1) + ' …'
  }
  // Hard cap fallback — trim to 70 chars at a word boundary, append …
  const hardCap = trimmed.slice(0, 70)
  const lastSpace = hardCap.lastIndexOf(' ')
  return (lastSpace > 30 ? hardCap.slice(0, lastSpace) : hardCap) + ' …'
}

// Build the Roast Hypothesis transposed grid for SspExpGrid (Redesign Sprint
// 3). Attributes as rows, V_n batches as columns. Each row only renders if at
// least one recipe has a non-null value for that field (so the table stays
// compact when predictions are sparsely populated). The "Hypothesis" row maps
// to roast_recipes.rationale (per-batch prose, distinct from the freer notes
// catch-all) and keeps the Bundle-B truncate-with-expander as a prose `.note`
// cell.
//
// Lever rows (Drop temp + Peak inlet) get the roast-emphasis amber tint
// (variant 'highlight' + labelAccent 'roast') when their values vary across
// batches — scope doc § 5.5 calls these out as the design knobs to watch
// during the roast. Single-value lever rows read as a deliberate hold, not a
// varying knob, so they stay neutral. Other rows (Expected FC / Total / End
// Condition / Agtron / Hypothesis) are descriptive, not levers.
function buildHypothesisData(recipes: RoastRecipe[]): { cols: { label: string }[]; rows: ExpRow[] } {
  type RowSpec = {
    label: string
    getValue: (r: RoastRecipe) => React.ReactNode
    has: (r: RoastRecipe) => boolean
    isLever?: boolean
    numeric?: boolean
    bold?: boolean
    // Raw value for variance detection — kept separate from getValue so the
    // React-node return of getValue doesn't have to be stringified.
    rawValue?: (r: RoastRecipe) => string | null
  }

  const specs: RowSpec[] = [
    {
      label: 'Drop temp',
      numeric: true,
      isLever: true,
      getValue: (r) =>
        r.end_condition_type === 'bean_temp' && r.end_condition_target != null
          ? `${r.end_condition_target}°C`
          : '—',
      has: (r) => r.end_condition_type === 'bean_temp' && r.end_condition_target != null,
      rawValue: (r) =>
        r.end_condition_type === 'bean_temp' && r.end_condition_target != null
          ? String(r.end_condition_target)
          : null,
    },
    {
      label: 'Peak inlet',
      numeric: true,
      isLever: true,
      // Computed from temperature_bezier max — deferred until bezier data
      // is populated. Today all backfilled recipes have NULL beziers.
      getValue: () => '—',
      has: () => false,
      rawValue: () => null,
    },
    {
      label: 'Expected FC',
      numeric: true,
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
      numeric: true,
      bold: true,
      getValue: (r) => r.predicted_total_time ?? '—',
      has: (r) => r.predicted_total_time != null,
    },
    {
      label: 'End Condition',
      numeric: true,
      getValue: (r) => {
        if (!r.end_condition_type) return '—'
        const unit = r.end_condition_type === 'bean_temp' ? '°C' : r.end_condition_type === 'dev_time' ? 's' : ''
        return `${r.end_condition_type.toUpperCase()}${r.end_condition_target != null ? ` ${r.end_condition_target}${unit}` : ''}`
      },
      has: (r) => r.end_condition_type != null,
    },
    {
      label: 'Predicted Agtron WB',
      numeric: true,
      getValue: (r) => (r.predicted_agtron_wb != null ? String(r.predicted_agtron_wb) : '—'),
      has: (r) => r.predicted_agtron_wb != null,
    },
    {
      // Sub-sprint 4a Bundle B — Hypothesis row truncate-with-expander, ported
      // verbatim into the SspExpGrid `.note` prose cell. Per Chris audit: the
      // Hypothesis prose is the longest row by far (often 100+ words per cell
      // on V3+); collapsing keeps the load-bearing numeric rows above visible
      // without scroll. Pure CSS via <details> + Tailwind group-open variant —
      // no JS, no hydration flicker, per-cell independent expansion.
      label: 'Hypothesis',
      getValue: (r) =>
        r.rationale ? (
          <details className="group">
            <summary className="cursor-pointer list-none">
              <span className="font-sans text-xs leading-relaxed group-open:hidden">
                {truncateHypothesis(r.rationale)}
              </span>
              <span className="hidden font-sans text-xs leading-relaxed group-open:inline">
                {r.rationale}
              </span>
              <span className="ml-1 text-latent-mid text-xxs select-none">
                <span className="inline group-open:hidden">▾</span>
                <span className="hidden group-open:inline">▴</span>
              </span>
            </summary>
          </details>
        ) : (
          '—'
        ),
      has: (r) => r.rationale != null,
    },
  ]

  // Only render rows where ANY recipe has the field populated. Empty rows
  // would just be a sea of em-dashes — collapse them so the table tracks
  // what's actually being designed.
  const visible = specs.filter((s) => recipes.some(s.has))

  // Per-row variance flag: lever rows with multiple distinct populated values
  // across recipes get the amber highlight on the whole row. Single-value
  // lever rows (all recipes match) read as "deliberate hold," not a varying
  // knob — no highlight.
  const varyingLevers = new Set(
    visible
      .filter((s) => s.isLever && s.rawValue)
      .filter((s) => {
        const values = recipes.map((r) => s.rawValue!(r)).filter((v) => v != null)
        return new Set(values).size > 1
      })
      .map((s) => s.label),
  )

  const cols = recipes.map((r) => ({ label: r.batch_slot ?? r.recipe_name ?? '?' }))
  const rows: ExpRow[] = visible.map((s) => {
    const amber = varyingLevers.has(s.label)
    return {
      label: s.label,
      numeric: s.numeric,
      ...(amber ? { variant: 'highlight' as const, labelAccent: 'roast' as const } : {}),
      cells: recipes.map((r) =>
        s.bold ? { content: s.getValue(r), className: 'bold' } : s.getValue(r),
      ),
    }
  })

  return { cols, rows }
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

  // Redesign Sprint 2 (2026-05-29) — re-skin to the Ssp* lab-document family,
  // mobile-first. First container-query dual-subtree in the codebase: the
  // desktop transposed Cupping Hypothesis table (.s2-desktop) can't `order-*`
  // into the mobile per-slot Taste-for cards (.s2-mobile), so both subtrees
  // render and `@container ssppage` reveals one at the 520px crossover. The
  // cupping data is the same on both — built once here, flattened per-slot for
  // mobile. The IA (recipe-first → reference signals collapsed) is preserved
  // from Bundle B; only the chrome + mobile composition changed. Shared
  // components below the toggle (CrossBatchNotes / DropRules / GreenBeanInfo /
  // ExperimentFrame / RoastLog / PerRoastReflections) stay legacy-skinned
  // through the migration window — they're shared with the 4 un-migrated green
  // views and re-skin on their own surface's sprint.
  const vLabel = latestExp ? formatVLabel(latestExp.experiment_id) : null
  const cup = latestExp ? buildCupHypoData(slotInfos, latestExp, bean, priorExp) : null
  const actuals = latestExp ? buildRoastActualsData(slotInfos, latestExp) : null
  const primaryQuestion = latestExp?.primary_question ?? null
  const hasTasteCards = !!cup && cup.mobileSlots.some((s) => s.taste)
  const hasPredictions = !!cup && cup.mobileSlots.some((s) => s.predictedCup)

  const metaPairs = [
    { label: 'Producer', value: bean.producer ?? '—' },
    { label: 'Origin', value: bean.origin ?? bean.terroir?.country ?? '—' },
    { label: 'Variety', value: bean.variety ?? bean.cultivar?.cultivar_name ?? '—' },
  ]
  const pills = [
    <StatusPill key="state" label="Waiting · Next Cupping" tone="lavender" />,
    ...(bean.process ? [<Chip key="proc" name={bean.process} tone="green" />] : []),
    ...(vLabel ? [<Chip key="vset" name={`${vLabel} · awaiting cupping`} tone="plum" />] : []),
  ]

  // Roast Actuals card — identical content in both subtrees, only the section
  // context line differs (foreground on desktop, "reference" on mobile).
  const actualsCard = (ct: string) =>
    actuals && actuals.rows.length > 0 ? (
      <div className="ssp-card state-roast">
        <SspShead ct={ct}>Roast Actuals · {vLabel}</SspShead>
        <SspExpGrid cols={actuals.cols} rows={actuals.rows} />
      </div>
    ) : latestExp && slotInfos.length > 0 ? (
      <div className="ssp-card state-roast">
        <SspShead ct={ct}>Roast Actuals · {vLabel}</SspShead>
        <div className="font-sans text-sm text-latent-mid italic">
          Latest experiment&apos;s batches not yet logged as roasts. Use
          push_roast from claude.ai to populate the actuals.
        </div>
      </div>
    ) : null

  return (
    <div className="ssp-page">
      <Link
        href="/green"
        className="font-mono text-xs uppercase tracking-[0.16em] text-latent-mid hover:text-latent-fg"
      >
        ← Back to Green Beans
      </Link>

      {/* Header — lavender (cup-emphasis) cover marks the waiting-for-cupping
          lifecycle state per the v2 artboard STATE["stage-2"]. */}
      <SspTopBar
        brewId={bean.lot_id ?? undefined}
        date={`${roasts.length} ROAST${roasts.length === 1 ? '' : 'S'}`}
        roaster="WAITING · NEXT CUPPING"
        kind="Green Lot"
      />
      <SspNamePlate
        title={bean.name || bean.lot_id}
        coverColor="#7A6E9E"
        edgeColor="#7A6E9E"
        meta={metaPairs}
        pills={pills}
      />

      {/* Cupping view — ONE canonical layout (no dual-subtree). Reshaped
          2026-05-30 (WC-2) from Chris's live-cupping audio recount to match how
          he actually cups: Producer notes (benchmark) → per-slot Predicted Cup
          (the primary read before each sip) → Roast Actuals (tertiary, glanced
          afterward, vs-Expected collapsed) → everything-else drawer (prior cup +
          taste-for + primary question). The mobile stack WAS the better layout
          ("I do this on my phone") so desktop adopts it; slot cards go
          side-by-side ≥520px for cross-slot comparison via .cup-slots grid. */}
      {latestExp && cup ? (
        <>
          {/* 1 · CUPPING — Producer notes + per-slot Predicted Cup */}
          <div className="ssp-card state-cup">
            <SspShead ct={`${slotInfos.length} slot${slotInfos.length === 1 ? '' : 's'} · taste against producer notes`}>
              Cupping · {vLabel}
            </SspShead>
            {cup.producerNotes && (
              <div className="ssp-why">
                <div className="hd">Producer notes — taste against this</div>
                <div className="body">{cup.producerNotes}</div>
              </div>
            )}
            {hasPredictions ? (
              <div
                className="cup-slots"
                style={{ ['--cup-slot-cols' as string]: cup.mobileSlots.length }}
              >
                {cup.mobileSlots.map((s) => (
                  <div className="ssp-slotcard" key={s.label}>
                    <div className="slot-lbl">{s.label}</div>
                    <div className="slot-pred-lbl">Predicted cup · given roast actuals</div>
                    <div className="slot-taste">{s.predictedCup ?? '—'}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="font-sans text-sm text-latent-mid italic">
                No per-slot cup predictions yet. They land when claude.ai pushes
                recipes + updates updated_cup_prediction_a/b/c/d.
              </div>
            )}
          </div>

          {/* 2 · ROAST ACTUALS — tertiary; numeric grid + collapsed vs-Expected */}
          {actualsCard('Achieved vs design intent')}
          {actuals && actuals.vsExpected.length > 0 && (
            <CollapsibleSection
              title="vs Expected"
              ct={`${actuals.vsExpected.length} slot${actuals.vsExpected.length === 1 ? '' : 's'} · how each roast diverged`}
            >
              <SspProseRows
                rows={actuals.vsExpected.map((s) => ({ label: s.label, value: s.delta }))}
              />
            </CollapsibleSection>
          )}

          {/* 3 · Reference & detail — prior cup + taste-for + primary question.
              Inner sections separated by hairline dividers (the All-Cuppings
              pattern), inside CollapsibleSection's single .ssp-sub. */}
          {(cup.otherSignals.length > 0 || hasTasteCards || primaryQuestion) && (
            <CollapsibleSection
              title="Reference & detail"
              ct="Prior cup · taste-for · primary question"
            >
              <div className="space-y-4">
                {cup.otherSignals.length > 0 && (
                  <div className="pb-4 border-b border-latent-hairline last:border-b-0 last:pb-0">
                    <div className="label">Previous leading cup</div>
                    <SspProseRows
                      rows={cup.otherSignals.map((p) => ({ label: p.k, value: p.v }))}
                    />
                  </div>
                )}
                {hasTasteCards && (
                  <div className="pb-4 border-b border-latent-hairline last:border-b-0 last:pb-0">
                    <div className="label">Taste for · cupping-table question</div>
                    <SspProseRows
                      rows={cup.mobileSlots
                        .filter((s) => s.taste)
                        .map((s) => ({ label: s.label, value: s.taste }))}
                    />
                  </div>
                )}
                {primaryQuestion && (
                  <div className="pb-4 border-b border-latent-hairline last:border-b-0 last:pb-0">
                    <div className="label">Primary question · what this V-set tests</div>
                    <div className="font-sans text-sm leading-relaxed">{primaryQuestion}</div>
                  </div>
                )}
              </div>
            </CollapsibleSection>
          )}
        </>
      ) : (
        <div className="ssp-card state-cup">
          <SspShead>Cupping Hypothesis</SspShead>
          <div className="font-sans text-sm text-latent-mid italic">
            No experiments designed yet for this lot. Cupping hypothesis lands
            when claude.ai designs a V-set via push_experiment + push_roast_recipe.
          </div>
        </div>
      )}

      {/* Shared components below the toggle — rendered once, legacy chrome
          unchanged through the migration window (see header note). */}
      <CrossBatchNotesBlock priorExp={priorExp} />

      {recipesForLatest.some((r) => r.drop_rule_if_fast || r.drop_rule_if_slow) && (
        <CollapsibleSection title="Recipe Design Intent">
          <DropRulesCard recipes={recipesForLatest} />
        </CollapsibleSection>
      )}

      <GreenBeanInfoCard bean={bean} />

      {latestExp && (
        <CollapsibleSection title={`EXPERIMENT FRAME · ${vLabel}`}>
          <ExperimentFrameCard latestExp={latestExp} skipControlBaseline title="" bare />
        </CollapsibleSection>
      )}

      <RoastLogTable
        roasts={roasts}
        cuppings={cuppings}
        defaultCollapsed
        highlightedBatchIds={Array.from(currentExpBatchIds)}
      />

      <PerRoastReflections roasts={roasts} />

      <details className="ssp-coll">
        <summary>
          Additional Information
          <span className="ct">Full history renders on the resolved view</span>
          <span className="chev" />
        </summary>
        <div className="body">
          <div className="ssp-sub">
            <div className="font-sans text-sm text-latent-mid italic">
              Deeper detail (full cupping history, all experiments archive, roast
              learnings, related brews) renders on the resolved-lot page shape in
              Sub Pages 6.5. The waiting-for-next-cupping view stays focused on
              the active V_n hypothesis + actuals.
            </div>
          </div>
        </div>
      </details>
    </div>
  )
}

// Redesign Sprint 2 — cupping data builder. Flattens the experiment's per-slot
// fields into one record per V-set slot so the desktop transposed table
// (SspExpGrid) and the mobile slot cards (.ssp-slotcard) share a single source.
// Replaces the pre-Sprint-2 CuppingHypothesisTable + CuppingReferenceBoxes.
//
// Rows preserve Bundle B's 2-row shape (Taste for / Predicted Cup, both
// lavender), each auto-hiding when all slots are NULL. Reference signals
// (Producer notes + Previous-leading-slot cup) feed the desktop cup .ssp-inset
// and the mobile T1 lead / T3 collapse.
type CupHypoData = {
  mobileSlots: { label: string; taste: string | null; predictedCup: string | null }[]
  producerNotes: string | null
  otherSignals: { k: string; v: string }[]
}

// Slot label with batch number — Chris navigates by roast number, not V-slot
// ("I always refer to them as 190/191/192, not v3a"). Mirrors the Roast Actuals
// `slot · #batch` composition. (WC-2b, 2026-05-30.)
function slotLabelWithBatch(info: SlotInfo): string {
  const slotLabel = info.recipe?.batch_slot ?? info.slot.toUpperCase()
  const batch = info.roast?.batch_id ?? info.declaredBatchId
  return batch ? `${slotLabel} · #${batch}` : slotLabel
}

// V_(n-1) winner cup: read priorExp.winner (free-text, e.g. "v2b") to find the
// slot, then read priorExp.observed_outcome_<slot>, falling back to key_insight.
function derivePriorWinnerCup(
  priorExp: any | null,
): { label: string; cup: string | null } {
  const base = 'Previous leading slot cup'
  if (!priorExp?.winner) return { label: base, cup: null }
  const slotMatch = String(priorExp.winner).toLowerCase().match(/[a-d](?!.*[a-d])/)
  const slot = slotMatch?.[0]
  const cup = slot
    ? ((priorExp[`observed_outcome_${slot}`] as string | null) ?? priorExp.key_insight ?? null)
    : (priorExp.key_insight ?? null)
  const label = priorExp.experiment_id
    ? `${base} (${priorExp.experiment_id} · ${priorExp.winner})`
    : base
  return { label, cup }
}

function buildCupHypoData(
  slotInfos: SlotInfo[],
  latestExp: any,
  bean: any,
  priorExp: any | null,
): CupHypoData {
  const mobileSlots = slotInfos.map((info) => ({
    label: slotLabelWithBatch(info),
    taste: (latestExp[`taste_for_${info.slot}`] as string | null) ?? null,
    predictedCup: (latestExp[`updated_cup_prediction_${info.slot}`] as string | null) ?? null,
  }))

  const producerNotes = bean.producer_tasting_notes ?? null
  // otherSignals = the non-producer reference rows (prior-winner cup). Producer
  // notes render foreground from `producerNotes`; this feeds the collapsed drawer.
  const { label: priorLabel, cup: priorWinnerCup } = derivePriorWinnerCup(priorExp)
  const otherSignals: { k: string; v: string }[] = []
  if (priorWinnerCup) otherSignals.push({ k: priorLabel, v: priorWinnerCup })

  return { mobileSlots, producerNotes, otherSignals }
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

// Sub-sprint 4a Bundle B — Roast Actuals helpers.
//
// parseTimeToSeconds: "04:50" → 290. Returns null on unparseable input.
// predictedDevSeconds: computed = predicted_total_time - predicted_fc_time
//   when both available on the recipe. Recipe has no predicted_dev_time
//   field so we compute it.
// formatActualVsPredicted: generic `predicted → actual` cell render. Used
//   by all numeric rows in Bundle B. Predicted half muted (text-latent-mid),
//   actual half foreground; both em-dash on missing.
function parseTimeToSeconds(t: string | null | undefined): number | null {
  if (!t) return null
  const m = t.match(/^(\d+):(\d+)$/)
  if (!m) return null
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10)
}

function predictedDevSeconds(recipe: RoastRecipe | null): number | null {
  if (!recipe) return null
  const fc = parseTimeToSeconds(recipe.predicted_fc_time)
  const total = parseTimeToSeconds(recipe.predicted_total_time)
  if (fc == null || total == null) return null
  return total - fc
}

function formatActualVsPredicted(
  predictedStr: string | null,
  actualStr: string | null,
): React.ReactNode {
  if (predictedStr == null && actualStr == null) return '—'
  if (predictedStr == null) return actualStr
  if (actualStr == null) return <span className="text-latent-mid">{predictedStr} → —</span>
  return (
    <span>
      <span className="text-latent-mid">{predictedStr}</span>
      <span className="text-latent-mid"> → </span>
      <span>{actualStr}</span>
    </span>
  )
}

// Redesign Sprint 2 — Roast Actuals data builder. 5 numeric RowSpec definitions
// (FC / Drop / Drop Temp / Dev / Agtron WB) re-shaped into SspExpGrid cols +
// rows. The "vs Expected" prose (delta_from_roast_<slot>) is split out into
// `vsExpected` so the render can collapse it by default (WC-3, 2026-05-30).
type RoastActualsData = {
  cols: { label: string }[]
  rows: ExpRow[]
  vsExpected: { label: string; delta: string | null }[]
}

function buildRoastActualsData(slotInfos: SlotInfo[], latestExp: any): RoastActualsData {
  type RowSpec = {
    label: string
    getValue: (info: SlotInfo) => React.ReactNode
    has: (info: SlotInfo) => boolean
  }

  // Sub-sprint 4a Bundle B — row order + content rewrite per Chris mockup
  // #2. 6 rows in this order: FC / Drop / Drop Temp / Dev / Agtron WB /
  // vs Expected. "Maillard" row dropped (not in mockup). "vs expected
  // total" renamed → "vs Expected" and moved to last position. All
  // numeric rows render as `predicted → actual` when the recipe carries
  // a prediction (predicted_fc_time / predicted_total_time /
  // end_condition_target / computed predicted dev / predicted_agtron_wb);
  // single-value actual when prediction is null. Drop temp keeps existing
  // formatDropTempDiff (with amber divergence emphasis); other rows use
  // the new generic formatActualVsPredicted.
  const rows: RowSpec[] = [
    {
      label: 'FC',
      getValue: (info) =>
        formatActualVsPredicted(
          info.recipe?.predicted_fc_time ?? null,
          info.roast?.fc_start ?? null,
        ),
      has: (info) =>
        info.roast?.fc_start != null || info.recipe?.predicted_fc_time != null,
    },
    {
      label: 'Drop',
      getValue: (info) =>
        formatActualVsPredicted(
          info.recipe?.predicted_total_time ?? null,
          info.roast?.drop_time ?? null,
        ),
      has: (info) =>
        info.roast?.drop_time != null || info.recipe?.predicted_total_time != null,
    },
    {
      // Cleanup-actions PR #25 + Bundle B: design → achieved drop_temp
      // diff render. Surfaces operator override visually. Amber tint
      // applies per-cell when the achieved value diverges from the design
      // target by > 0.5°C. Design pulls from recipe.end_condition_target
      // when end_condition_type is bean_temp.
      label: 'Drop Temp',
      getValue: (info) => formatDropTempDiff(info),
      has: (info) =>
        info.roast?.drop_temp != null || isDesignDropTempApplicable(info.recipe),
    },
    {
      label: 'Dev',
      getValue: (info) => {
        const predictedSec = predictedDevSeconds(info.recipe)
        const actualSec = info.roast?.dev_time_s ?? null
        return formatActualVsPredicted(
          predictedSec != null ? `${predictedSec}s` : null,
          actualSec != null ? `${actualSec}s` : null,
        )
      },
      has: (info) =>
        info.roast?.dev_time_s != null || predictedDevSeconds(info.recipe) != null,
    },
    {
      label: 'Agtron WB',
      getValue: (info) =>
        formatActualVsPredicted(
          info.recipe?.predicted_agtron_wb != null
            ? String(info.recipe.predicted_agtron_wb)
            : null,
          info.roast?.agtron != null ? String(info.roast.agtron) : null,
        ),
      has: (info) =>
        info.roast?.agtron != null || info.recipe?.predicted_agtron_wb != null,
    },
  ]
  // vs Expected prose (delta_from_roast_<slot>) is split OUT of the numeric grid
  // and returned separately so the render can collapse it by default — it's
  // tertiary at the cupping table ("not actively staring at this while drinking",
  // WC-3 2026-05-30). Was the amber last row of the grid.

  const visibleRows = rows.filter((row) => slotInfos.some(row.has))

  // One label per slot, shared by the numeric grid cols + the vs-Expected rows.
  const slotLabels = slotInfos.map(slotLabelWithBatch)
  const cols = slotLabels.map((label) => ({ label }))

  const expRows: ExpRow[] = visibleRows.map((row) => ({
    label: row.label,
    numeric: true,
    cells: slotInfos.map((info) => row.getValue(info)),
  }))

  const vsExpected = slotInfos
    .map((info, i) => ({
      label: slotLabels[i],
      delta: (latestExp[`delta_from_roast_${info.slot}`] as string | null) ?? null,
    }))
    .filter((s) => s.delta)

  return { cols, rows: expRows, vsExpected }
}

// ---------------------------------------------------------------------------
// Sub Pages 6.5 / Sub-sprint 4a — Resolved + Unresolved views
//
// Both lifecycle endpoints render the same dense archive shape; the only
// differences are a vocabulary + chrome rotation (Reference→Leading, green→
// gray tile, the "Why this roast won" verdict block, and a carry-forward
// caution). Redesign Sprint 4 (2026-05-29) re-skins both to the Ssp* lab-
// document family AND collapses the prior ~95%-duplicate ResolvedView /
// UnresolvedView into one shared ArchiveLotBody parameterized by `variant`,
// with two thin wrappers preserved as the dispatch entry points.
//
// IA is unchanged from 6.5 (chrome re-skin only): Reference/Leading Roast →
// Reference/Leading Recipe Design Intent disclosure → Reference/Leading Cup →
// Roasting Learnings → Carry-Forward → Green Bean Info → Roast Log → Per-Roast
// Reflections → All Cuppings → Experiment Journey. The shared components below
// the verdict cards are the PR1-re-skinned Ssp* versions.
//
// Resolved invariant (post Sub-sprint 4a): why_this_roast_won is populated —
// NULL-verdict lots route to the unresolved variant instead. The Design column
// renders em-dashes on lots with NULL recipe beziers (Phase 3 enrichment is
// intentionally empty per redesign doc § 7) and lights up as recipes enrich.
// ---------------------------------------------------------------------------

type ArchiveVariant = 'resolved' | 'unresolved'

const ARCHIVE_VARIANTS: Record<
  ArchiveVariant,
  {
    tile: string
    topbarLabel: string
    statusLabel: string
    statusTone: 'resolved' | 'archive'
    stateClass: 'state-resolved' | 'state-archive'
    roastTitle: string
    cupTitle: string
    cornerWord: string
    cupSynthLabel: string
    star: string
    showVerdict: boolean
    carryCaution: string | null
  }
> = {
  resolved: {
    tile: '#4A7C59',
    topbarLabel: 'RESOLVED',
    statusLabel: 'Resolved',
    statusTone: 'resolved',
    stateClass: 'state-resolved',
    roastTitle: 'Reference Roast',
    cupTitle: 'Reference Cup',
    cornerWord: 'Reference',
    cupSynthLabel: 'Best cup synthesis',
    star: 'reference',
    showVerdict: true,
    carryCaution: null,
  },
  unresolved: {
    tile: '#6B6B66',
    topbarLabel: 'CLOSED · NO REFERENCE',
    statusLabel: 'Unresolved',
    statusTone: 'archive',
    stateClass: 'state-archive',
    roastTitle: 'Leading Roast',
    cupTitle: 'Leading Cup',
    cornerWord: 'Leading',
    cupSynthLabel: 'Leading cup synthesis',
    star: 'leading',
    showVerdict: false,
    carryCaution:
      'These takeaways come from a lot that closed without a confirmed reference. Read as working hypotheses, not validated rules.',
  },
}

function ResolvedView(props: { bean: any; cuppings: any[]; brewsForLot: any[] }) {
  return <ArchiveLotBody {...props} variant="resolved" />
}

function UnresolvedView(props: { bean: any; cuppings: any[]; brewsForLot: any[] }) {
  return <ArchiveLotBody {...props} variant="unresolved" />
}

function ArchiveLotBody({
  bean,
  cuppings,
  brewsForLot,
  variant,
}: {
  bean: any
  cuppings: any[]
  brewsForLot: any[]
  variant: ArchiveVariant
}) {
  const v = ARCHIVE_VARIANTS[variant]

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
  const optimizedBrew = pickOptimizedBrew(brewsForLot, refRoastId, bean.optimized_brew_id ?? null)
  // Primary ground Agtron for the WB→Gnd Δ display — prefer the pourover's
  // ground reading; fall back to any cupping on the reference roast.
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

  // Best-cup synthesis prose: prefer the optimized brew's what_i_learned (most
  // narrative-rich on a closed lot); fall back to the pourover's `overall`.
  const bestCupSynthesis = optimizedBrew?.what_i_learned || pourover?.overall || null
  const refBatchLabel = batchNumber ?? rawBestBatchId ?? '?'

  const metaPairs = [
    { label: 'Producer', value: bean.producer ?? '—' },
    { label: 'Origin', value: bean.origin ?? bean.terroir?.country ?? '—' },
    { label: 'Variety', value: bean.variety ?? bean.cultivar?.cultivar_name ?? '—' },
  ]
  const pills = [
    <StatusPill key="state" label={v.statusLabel} tone={v.statusTone} />,
    ...(bean.process ? [<Chip key="proc" name={bean.process} tone="green" />] : []),
  ]

  // Design / Achieved spec strips (preserve the 6.5 two-group IA — chrome
  // re-skin, not the artboard's flattened single strip).
  const designCells = [
    { label: 'Peak inlet', value: renderPeakInlet(referenceRecipe) },
    { label: 'Drop temp', value: renderDropTemp(referenceRecipe) },
    { label: 'End condition', value: renderEndCondition(referenceRecipe) },
    { label: 'Charge / Hopper', value: renderChargeHopper(referenceRecipe) },
    { label: 'Fan curve', value: renderFanCurve(referenceRecipe) },
  ]
  const achievedCells = [
    { label: 'FC time', value: referenceRoast?.fc_start ?? '—' },
    {
      label: 'FC temp',
      value: referenceRoast?.fc_temp != null ? `${referenceRoast.fc_temp}°C` : '—',
    },
    { label: 'Drop time', value: referenceRoast?.drop_time ?? '—' },
    {
      label: 'Drop temp',
      value: referenceRoast?.drop_temp != null ? `${referenceRoast.drop_temp}°C` : '—',
    },
    {
      label: 'Agtron WB / Δ',
      value: (
        <span>
          {referenceRoast?.agtron != null ? referenceRoast.agtron : '—'}
          {wbGndDelta != null && (
            <span className="text-latent-mid ml-2">
              ({wbGndDelta > 0 ? '+' : ''}
              {wbGndDelta})
            </span>
          )}
        </span>
      ),
    },
  ]

  const optimizedDescriptors = optimizedBrew
    ? optimizedBrew.peak_expression ||
      [
        optimizedBrew.aroma,
        optimizedBrew.attack,
        optimizedBrew.mid_palate,
        optimizedBrew.body,
        optimizedBrew.finish,
      ]
        .filter(Boolean)
        .join(' · ')
    : null

  // Carry-forward rows + scope tags (scope_tags are loose-canonical text[],
  // mostly empty today per CLAUDE.md "deferred follow-up" — they render as
  // `.tag` chips only when populated, so the block degrades to plain prose).
  const carryRows = [
    {
      label: 'Cultivar takeaway',
      body: learnings?.cultivar_takeaway,
      scope: learnings?.cultivar_takeaway_scope_tags,
    },
    {
      label: 'Terroir takeaway',
      body: learnings?.terroir_takeaway,
      scope: learnings?.terroir_takeaway_scope_tags,
    },
    {
      label: 'General takeaway',
      body: learnings?.general_takeaway,
      scope: learnings?.general_takeaway_scope_tags,
    },
    {
      label: 'Starting hypothesis · similar lots',
      body: learnings?.starting_hypothesis,
      scope: learnings?.starting_hypothesis_scope_tags,
    },
  ].filter((r) => r.body)
  const anyScope = carryRows.some((r) => Array.isArray(r.scope) && r.scope.length > 0)

  return (
    <div className="ssp-page">
      <Link
        href="/green"
        className="font-mono text-xs uppercase tracking-[0.16em] text-latent-mid hover:text-latent-fg"
      >
        ← Back to Green Beans
      </Link>

      {/* Hero — green (resolved) / gray (archive) cover per the v2 STATE map. */}
      <SspTopBar brewId={bean.lot_id ?? undefined} roaster={v.topbarLabel} kind="Green Lot" />
      <SspNamePlate
        title={bean.name || bean.lot_id}
        coverColor={v.tile}
        edgeColor={v.tile}
        meta={metaPairs}
        pills={pills}
      />

      {/* Reference / Leading Roast */}
      <div className={`ssp-card ${v.stateClass}`}>
        <span className="ssp-corner">
          Batch #{refBatchLabel} · {v.cornerWord}
        </span>
        <SspShead ct="Recipe + actuals at a glance">{v.roastTitle}</SspShead>

        {v.showVerdict && (
          <div className="ssp-why">
            <div className="hd">Why this roast won</div>
            {learnings?.why_this_roast_won ? (
              <div className="body">{learnings.why_this_roast_won}</div>
            ) : (
              <div className="body italic text-latent-mid">
                Not yet populated. patch_roast_learnings(green_bean_id, why_this_roast_won:
                &quot;...&quot;) from claude.ai once the verdict prose is ready.
              </div>
            )}
          </div>
        )}

        <SpecStrip label="Design" cells={designCells} />
        <SpecStrip label="Achieved" cells={achievedCells} />

        {referenceRecipe == null && referenceRoast != null && (
          <div className="mt-3 font-sans text-xs italic text-latent-mid">
            Recipe row not linked to this roast yet. Design-side fields populate when the recipe
            is enriched via patch_roast_recipe.
          </div>
        )}
        {referenceRoast?.color_description && (
          <div className="mt-3 font-sans text-sm text-latent-mid leading-relaxed">
            <span className="label mr-2 inline-block">Color</span>
            {referenceRoast.color_description}
          </div>
        )}
      </div>

      {/* Reference / Leading Recipe Design Intent — collapsed drop-rules drill-in
          (Sub Pages 6.8). Auto-hides until the recipe carries a populated rule. */}
      {referenceRecipe &&
        (referenceRecipe.drop_rule_if_fast || referenceRecipe.drop_rule_if_slow) && (
          <CollapsibleSection title={`${v.cornerWord} Recipe Design Intent`}>
            <DropRulesCard recipes={[referenceRecipe]} />
          </CollapsibleSection>
        )}

      {/* Reference / Leading Cup */}
      <div className={`ssp-card ${v.stateClass}`}>
        <SspShead ct="Best cup + optimized brew">{v.cupTitle}</SspShead>

        {bestCupSynthesis && (
          <div className="ssp-why">
            <div className="hd">{v.cupSynthLabel}</div>
            <div className="body">{bestCupSynthesis}</div>
          </div>
        )}

        <div className="ssp-twopane">
          {/* Pourover cupping on the reference/leading roast */}
          <div className="pane">
            <div className="lbl">Cupping · #{refBatchLabel}</div>
            {pourover ? (
              <>
                <div className="font-mono text-xs text-latent-mid mb-2">
                  {pourover.rest_days != null ? `${pourover.rest_days}d rest` : 'rest ?'}
                  {pourover.eval_method && ` · ${pourover.eval_method}`}
                </div>
                {pourover.overall ? (
                  <div className="body">{pourover.overall}</div>
                ) : (
                  <div className="space-y-1.5 font-sans text-xs">
                    <CupRow label="Aroma" value={pourover.aroma} />
                    <CupRow label="Flavor" value={pourover.flavor} />
                    <CupRow label="Acidity" value={pourover.acidity} />
                    <CupRow label="Sweetness" value={pourover.sweetness} />
                    <CupRow label="Body" value={pourover.body} />
                    <CupRow label="Finish" value={pourover.finish} />
                    <CupRow label="Temperature behavior" value={pourover.temperature_behavior} />
                  </div>
                )}
                {pourover.sweetness && pourover.overall && (
                  <div className="mt-2 font-sans text-xs text-latent-mid">
                    <span className="label mr-1 inline-block">Sweetness</span>
                    {pourover.sweetness}
                  </div>
                )}
                {(pourover.aromatic_behavior || pourover.structural_behavior) && (
                  <div className="mt-3 space-y-2 font-sans text-xs leading-relaxed">
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
                No pourover cupping on the {v.cornerWord.toLowerCase()} roast. push_cupping a Day 7+
                pourover eval to surface the integrated read here.
              </div>
            )}
          </div>

          {/* Optimized brew joined via green_bean_id */}
          <div className="pane">
            <div className="lbl">Optimized Brew · #{refBatchLabel} retasted</div>
            {optimizedBrew ? (
              <>
                <div className="font-mono text-xs text-latent-mid mb-2">
                  {composeBrewRecipeLine(optimizedBrew) || '— recipe not populated —'}
                </div>
                {(optimizedBrew.extraction_strategy ||
                  (optimizedBrew.modifiers && optimizedBrew.modifiers.length > 0)) && (
                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    {optimizedBrew.extraction_strategy && (
                      <Chip name={optimizedBrew.extraction_strategy} tone="coral" />
                    )}
                    {optimizedBrew.modifiers && optimizedBrew.modifiers.length > 0 && (
                      <ModifierBadges modifiers={optimizedBrew.modifiers} />
                    )}
                  </div>
                )}
                {optimizedDescriptors && <div className="body">{optimizedDescriptors}</div>}
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
          <div className="ssp-cite">Producer notes: {bean.producer_tasting_notes}</div>
        )}
      </div>

      {/* Roasting Learnings — 3-up insight cards + signal pair-rows */}
      <div className="ssp-card state-roast">
        <SspShead ct="Levers · signals · boundaries">Roasting Learnings</SspShead>
        {learnings ? (
          <>
            <div className="ssp-insights">
              <InsightCard label="Primary Lever" body={learnings.primary_lever} />
              <InsightCard label="Acceptable Roast Window" body={learnings.roast_window_width} />
              <InsightCard label="Brewing Tolerance" body={learnings.brewing_tolerance} />
            </div>
            <div className="ssp-pair-rows">
              <PairRow label="Secondary levers" value={learnings.secondary_levers} />
              <PairRow label="Underdev signal" value={learnings.underdevelopment_signal} />
              <PairRow label="Overdev signal" value={learnings.overdevelopment_signal} />
              <PairRow label="What didn't matter" value={learnings.what_didnt_move_needle} />
              <PairRow label="Rest behavior" value={learnings.rest_behavior} />
            </div>
          </>
        ) : (
          <div className="font-sans text-sm italic text-latent-mid">
            No learnings row for this lot yet — push_roast_learnings to populate.
          </div>
        )}
      </div>

      {/* Carry-Forward — dark scope-tagged block */}
      {learnings && (
        <div className="ssp-learnings">
          <div className="hd">
            Roasting Learnings · To Carry Forward
            {anyScope && <span className="ct">{carryRows.length} scope-tagged takeaways</span>}
          </div>
          {v.carryCaution ? (
            <p className="intro">{v.carryCaution}</p>
          ) : anyScope ? (
            <p className="intro">
              Each takeaway carries one or more scope_tags — namespaced strings that make cross-lot
              SQL queries reliable. When a similar lot lands, scoped lessons surface automatically.
            </p>
          ) : null}
          {carryRows.length > 0 ? (
            carryRows.map((r) => (
              <div className="row" key={r.label}>
                <div className="row-hd">
                  <div className="lbl">{r.label}</div>
                  {Array.isArray(r.scope) && r.scope.length > 0 && (
                    <div className="scope">
                      {r.scope.map((t: string) => (
                        <span className="tag" key={t}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <p>{r.body}</p>
              </div>
            ))
          ) : (
            <p className="intro">
              Generalizations not yet drafted. patch_roast_learnings(cultivar_takeaway /
              terroir_takeaway / general_takeaway / starting_hypothesis) once cross-lot synthesis is
              done.
            </p>
          )}
        </div>
      )}

      {/* Shared components (PR1-re-skinned Ssp* chrome) */}
      <GreenBeanInfoCard bean={bean} />

      <RoastLogTable
        roasts={roasts}
        cuppings={cuppings}
        defaultCollapsed
        highlightedBatchIds={batchNumber ? [batchNumber] : []}
      />

      <PerRoastReflections roasts={roasts} />

      {cuppings.length > 0 && (
        <CollapsibleSection title="All Cuppings" ct={`${cuppings.length} evaluations`}>
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
                  className="pb-4 border-b border-latent-hairline last:border-b-0 last:pb-0"
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
                    {isRef && <span className="ml-2">⭐ {v.star}</span>}
                    {cup.recipe_variant && ` · ${cup.recipe_variant}`}
                    {cup.ground_agtron != null && ` · Gnd Agtron: ${cup.ground_agtron}`}
                  </div>
                  <div className="font-sans text-sm leading-relaxed">{descriptors || '—'}</div>
                  {cup.sweetness && cup.overall && (
                    <div className="font-sans text-sm leading-relaxed mt-1 text-latent-mid">
                      <span className="label mr-1 inline-block">Sweetness</span>
                      {cup.sweetness}
                    </div>
                  )}
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
        <CollapsibleSection title="Experiment Journey" ct={`${experimentsChrono.length} sets`}>
          <div className="space-y-6">
            {experimentsChrono.map((exp, i) => (
              <div
                key={exp.id ?? i}
                className="pb-6 border-b border-latent-hairline last:border-b-0 last:pb-0"
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

// Local render helpers for the archive views.

// Labelled paper KV strip (Design / Achieved). Replaces the pre-Sprint-4
// RecipeRow stack with the artboard `.ssp-roastspec` chrome.
function SpecStrip({
  label,
  cells,
}: {
  label: string
  cells: { label: string; value: React.ReactNode }[]
}) {
  return (
    <div className="mt-3">
      <div className="label mb-1.5">{label}</div>
      <div className="ssp-roastspec">
        {cells.map((c) => (
          <div className="c" key={c.label}>
            <b>{c.label}</b>
            <span>{c.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// 3-up amber lever card (Primary lever / Roast window / Brewing tolerance).
function InsightCard({ label, body }: { label: string; body?: string | null }) {
  return (
    <div className="card">
      <div className="lbl">{label}</div>
      {body ? (
        <div className="body">{body}</div>
      ) : (
        <div className="body italic text-latent-mid">Not populated</div>
      )}
    </div>
  )
}

// Signal pair-row (headline + body). Skips when the value is empty.
function PairRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="row">
      <div className="hd">{label}</div>
      <div className="body">{value}</div>
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
  const metaPairs = [
    { label: 'Producer', value: bean.producer ?? '—' },
    { label: 'Origin', value: bean.origin ?? bean.terroir?.country ?? '—' },
    { label: 'Variety', value: bean.variety ?? bean.cultivar?.cultivar_name ?? '—' },
  ]
  const pills = [
    <StatusPill key="state" label="In Inventory" tone="archive" />,
    ...(bean.process ? [<Chip key="proc" name={bean.process} tone="green" />] : []),
  ]

  return (
    <div className="ssp-page">
      <Link
        href="/green"
        className="font-mono text-xs uppercase tracking-[0.16em] text-latent-mid hover:text-latent-fg"
      >
        ← Back to Green Beans
      </Link>

      {/* Grey (inventory) cover per the v2 tile palette (--tile-inventory). */}
      <SspTopBar
        brewId={bean.lot_id ?? undefined}
        roaster="IN INVENTORY"
        kind="Green Lot"
      />
      <SspNamePlate
        title={bean.name || bean.lot_id}
        coverColor="#B4B4AE"
        edgeColor="#B4B4AE"
        meta={metaPairs}
        pills={pills}
      />

      <div className="ssp-card">
        <SspShead ct="Awaiting first V-set">In Inventory</SspShead>
        <div className="font-sans text-sm leading-relaxed text-latent-mid">
          This lot is in inventory — no experiments designed yet. Design V1 in
          claude.ai via push_experiment + push_roast_recipe to surface the
          waiting-for-next-roast view here. The /green index intentionally hides
          in-inventory lots; this page is only reachable via direct URL.
        </div>
      </div>

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
// Resolve the lot's optimized brew. Prefers the explicit green_beans
// .optimized_brew_id FK (migration 075 / MB-7); the roast_id === refRoastId
// heuristic survives only as a legacy fallback for lots closed before the
// column existed (and the first-row fallback for older data). See ADR-0019.
function pickOptimizedBrew(
  brewsForLot: any[],
  refRoastId: string | null,
  optimizedBrewId: string | null,
): any | null {
  if (brewsForLot.length === 0) return null
  if (optimizedBrewId) {
    const linked = brewsForLot.find((b) => b.id === optimizedBrewId)
    if (linked) return linked
  }
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

