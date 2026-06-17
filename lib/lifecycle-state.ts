// Sub Pages 6.2 (2026-05-13) — lifecycle state derivation for green bean lots.
//
// State is computed per row, not stored. See docs/roasting/redesign.md § 8
// for the source rules + § 3 for the four lifecycle states.
//
// The scope-doc rules (verbatim from § 8):
//   - Has green_bean but no experiments → in inventory
//   - Has experiments where the latest one has no roasts yet → waiting for next roast
//   - Has experiments where the latest one has roasts but no cuppings (or no
//     synthesis) → waiting for next cupping
//   - Has roast_learnings → resolved
//
// Sub-sprint 4a (2026-05-27) — added `unresolved` as a 5th state to separate
// "lot closed cleanly with a confirmed reference" (resolved) from "lot closed
// but no reference identified — we learned something, but didn't reach a
// verdict" (unresolved). The discriminator is `roast_learnings.why_this_roast_won`:
// populated = resolved, NULL = unresolved. Surfaced during the Phase 1/2 audit
// when Higuito + CGLE Sudan Rume Natural were both rendering on ResolvedView
// with the "Closed without identifying a reference roast" disambiguator card —
// internally contradictory page state. The new state-shape drops the verdict
// block + renames "Reference" → "Leading" in the UI so the page reads
// coherently.
//
// Two real-world edge cases the doc rules don't explicitly name (surfaced by
// the pre-flight DB audit at Sub Pages 6.1 kickoff):
//
//   1. "Synthesis done but V_(n+1) not designed yet." Latest experiment has
//      winner + key_insight populated, but no new experiment exists for V_(n+1)
//      yet. Per the doc's framing in § 3 — "the user moves from
//      waiting-for-next-roast → waiting-for-next-cupping → (back to
//      waiting-for-next-roast for V_(n+1)) repeatedly" — this is just back to
//      waiting-for-next-roast. The transitional state is conversational, not
//      page-state.
//
//   2. "Pre-framework legacy lot." Has roasts but no experiments at all
//      (e.g. Rancho Tio Emilio today — 1 roast, 0 experiments). Strict
//      scope-doc reading would call this "in inventory" but the lot is
//      clearly past inventory. Treat as waiting-for-next-roast (the closest
//      semantic match — there's roasting activity but no V-set framing yet).
//
// In-inventory lots ARE surfaced on the /green index as of migration 082
// (2026-06-17), positioned last (below Unresolved). The compute helper returns
// 'in_inventory'; the index renders it as its own section (was filtered out
// pre-082, when the index deferred to "the eventual inventory page").

export type LifecycleState =
  | 'in_inventory'
  | 'waiting_for_next_roast'
  | 'waiting_for_next_cupping'
  | 'waiting_for_brewing'
  | 'resolved'
  | 'unresolved'

// Lot Coordinator dogfood (migration 080, ADR-0024 § 6) — the stored
// green_beans.lot_status value set. Single source for the zod enum on
// patch_green_bean, the check:lifecycle-consistency gate, and the SQL
// CHECK constraint that lands once the live lot confirms the set.
//
// `waiting_for_brewing` is the one state derivation can't produce: the ball
// is in the brewing court (SPG execution or optimized brew, both claude.ai-
// side) and there is no row whose absence distinguishes "not handed off"
// from "handed off and waiting." The Roasting Brief holds WHICH brewing task.
export const LOT_STATUS_VALUES = [
  'in_inventory',
  'waiting_for_next_roast',
  'waiting_for_next_cupping',
  'waiting_for_brewing',
  'resolved',
  'unresolved',
] as const
export type LotStatus = (typeof LOT_STATUS_VALUES)[number]

/**
 * Stored-with-derived-fallback resolution (migration 080). The stored
 * lot_status wins when present and valid; NULL (every pre-080 row, incl.
 * the in-flight claude.ai lots) falls back to the derived computation so
 * those lots render unchanged. The derived logic survives as the validator
 * — scripts/check-lifecycle-consistency.ts flags stored-vs-derived
 * disagreement (with the one designed exception: stored waiting_for_brewing
 * where derivation, blind to the brewing handoff, says waiting_for_next_roast).
 */
export function resolveLifecycleState(
  stored: string | null | undefined,
  b: LifecycleInputs,
): LifecycleState {
  if (stored && (LOT_STATUS_VALUES as readonly string[]).includes(stored)) {
    return stored as LifecycleState
  }
  return computeLifecycleState(b)
}

// V-set batch slots — three real, fourth is rare (some V-sets run 4 batches).
// Shared across the cupping view (page.tsx `computeSlotInfos`) and
// CrossBatchNotesBlock so the slot order stays consistent.
export const SLOT_LETTERS = ['a', 'b', 'c', 'd'] as const
export type SlotLetter = (typeof SLOT_LETTERS)[number]

// Minimal shape for pickPriorExperiment's return + CrossBatchNotesBlock's
// input. Only the fields the cupping view actually reads — explicit so the
// `[k:string]:any` index signature drift doesn't leak into the component
// contract.
export type PriorExperimentShape = {
  id?: string
  experiment_id?: string | null
  winner?: string | null
  key_insight?: string | null
  created_at?: string | null
  observed_outcome_a?: string | null
  observed_outcome_b?: string | null
  observed_outcome_c?: string | null
  observed_outcome_d?: string | null
}

// Minimal shape — only the fields we read. Callers pass whatever bean shape
// they have (GreenBean + joined arrays); we read what we need. The cuppings
// array can be either nested under roasts (PostgREST-style join, preferred —
// keeps cupping membership tied to its roast) or omitted (treated as
// "0 cuppings everywhere," which routes to waiting_for_next_cupping when an
// experiment has roasts).
export type LifecycleInputs = {
  experiments?:
    | Array<{
        id?: string
        winner?: string | null
        batch_ids?: string | null
        created_at?: string | null
      }>
    | null
  roasts?:
    | Array<{
        id?: string
        batch_id?: string | null
        cuppings?: Array<{ id?: string }> | null
      }>
    | null
  roast_learnings?:
    | { id?: string; why_this_roast_won?: string | null }
    | Array<{ id?: string; why_this_roast_won?: string | null }>
    | null
    | undefined
}

/**
 * Compute the lifecycle state for a green bean lot.
 *
 * Order of checks matters — `roast_learnings` presence is the close-out
 * marker; it wins over experiment/roast/cupping signals. Within the
 * close-out branch, `why_this_roast_won` discriminates resolved vs
 * unresolved (Sub-sprint 4a 2026-05-27): populated verdict prose = the
 * lot reached a confirmed reference; NULL = the lot closed without a
 * confirmed reference (we learned something but didn't get a verdict).
 *
 * If a closed lot accumulates a new experiment (rare — usually means a fresh
 * V-set is being designed for a re-roast), it still reads as resolved/
 * unresolved per the verdict signal; the user can deliberately reopen by
 * deleting the learnings row.
 */
export function computeLifecycleState(b: LifecycleInputs): LifecycleState {
  // 1. Close-out branch: presence of a roast_learnings row.
  const learningsArr = Array.isArray(b.roast_learnings)
    ? b.roast_learnings
    : b.roast_learnings != null
      ? [b.roast_learnings]
      : []
  if (learningsArr.length > 0) {
    // Discriminate resolved vs unresolved on the verdict prose. Trim
    // whitespace-only values to NULL so a stray space doesn't flip the
    // state — defensive against drift in the prose source.
    const verdict = learningsArr[0]?.why_this_roast_won?.trim() || null
    return verdict ? 'resolved' : 'unresolved'
  }

  const experiments = b.experiments ?? []
  const roasts = b.roasts ?? []

  // 2. No experiments: either truly in inventory, or pre-framework legacy
  //    upload (has roasts but no V-set framing). Edge case #2 above.
  if (experiments.length === 0) {
    if (roasts.length === 0) return 'in_inventory'
    // Pre-framework legacy lot. Treat as waiting-for-next-roast — there's
    // active roasting but no formal V-set; the next move is to design one.
    return 'waiting_for_next_roast'
  }

  // 3. Has experiments. Find the latest one by created_at (lexical fallback
  //    when created_at missing). 'Latest' is the one that drives the current
  //    state per scope doc § 8.
  const latest = pickLatestExperiment(experiments)

  // 4. Latest experiment has no roasts yet → waiting for next roast.
  //    "No roasts yet" = none of the batch_ids in this experiment resolve to
  //    an existing roast row. batch_ids is free text ("139, 140, 141" or
  //    "139-141"); we extract numeric tokens and match against roasts.batch_id.
  const expBatchIds = new Set(parseBatchIds(latest.batch_ids ?? ''))
  const matchedRoasts = roasts.filter((r) => {
    const id = r.batch_id?.trim()
    return id != null && expBatchIds.has(id)
  })
  if (matchedRoasts.length === 0) return 'waiting_for_next_roast'

  // 5. Latest experiment has roasts. Per scope doc § 8 the cupping gate is
  //    "no cuppings OR no synthesis" — a disjunction. Either signal alone
  //    routes to waiting_for_next_cupping. Use cuppings nested under matched
  //    roasts as the cupping presence signal; use winner as the synthesis
  //    presence signal. This matches the mockup intent — Red Plum has
  //    synthesis but 0 cuppings logged, so the page should say "go log the
  //    cuppings" not "design V2."
  const cuppingCount = matchedRoasts.reduce(
    (sum, r) => sum + (r.cuppings?.length ?? 0),
    0,
  )
  if (cuppingCount === 0 || !latest.winner) return 'waiting_for_next_cupping'

  // 6. Latest experiment fully done (roasts + cuppings + synthesis) → back to
  //    waiting-for-next-roast for V_(n+1). Edge case #1 above — the
  //    transitional state the scope doc doesn't name explicitly but follows
  //    from § 3's loop framing.
  return 'waiting_for_next_roast'
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function pickLatestExperiment<
  T extends { created_at?: string | null; id?: string },
>(experiments: T[]): T {
  // Sort by created_at desc (null/missing sinks to the bottom). Stable order
  // by id as a tiebreaker so the result is deterministic across page loads.
  return [...experiments].sort((a, b) => {
    const at = a.created_at ?? ''
    const bt = b.created_at ?? ''
    if (at !== bt) return bt.localeCompare(at)
    return (a.id ?? '').localeCompare(b.id ?? '')
  })[0]
}

// Parse a free-text batch_ids string ("139, 140, 141", "139-141", "MX-139")
// into a list of batch_id strings. Conservative — we grab numeric runs and
// the original tokens; the caller dedupes via Set membership.
function parseBatchIds(raw: string): string[] {
  if (!raw) return []
  const tokens = raw
    .split(/[,;]/)
    .map((t) => t.trim())
    .filter(Boolean)
  const out = new Set<string>()
  for (const tok of tokens) {
    // If the token is a range "139-141", expand.
    const rangeMatch = tok.match(/^(\d+)\s*-\s*(\d+)$/)
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1], 10)
      const end = parseInt(rangeMatch[2], 10)
      if (Number.isFinite(start) && Number.isFinite(end) && end >= start && end - start < 100) {
        for (let i = start; i <= end; i++) out.add(String(i))
        continue
      }
    }
    // Otherwise add the raw token AND any numeric run inside it
    // (handles "MX-139" → "MX-139" + "139").
    out.add(tok)
    const numeric = tok.match(/\d+/)
    if (numeric) out.add(numeric[0])
  }
  // Array.from instead of [...spread] — tsconfig target is too low for
  // direct Set iteration. Same pattern as existing helpers in this repo.
  return Array.from(out)
}

// Display label for the right-column stage indicator on the index page.
// Mirrors scope doc § 5.1 mockup ("Next roast" / "Next Cupping" / "Reference").
// `referenceBatchLabel` lets the caller pass a "Batch #133" string for resolved
// rows; falls back to the generic word otherwise.
//
// Sub-sprint 4a (2026-05-27) — Unresolved label is "Closed without reference"
// (no batch number; the lot didn't reach a verdict so there's no canonical
// reference to surface in the right column).
export function lifecycleStageLabel(
  state: LifecycleState,
  referenceBatchLabel?: string | null,
): string {
  switch (state) {
    case 'waiting_for_next_roast':
      return 'Next roast'
    case 'waiting_for_next_cupping':
      return 'Next cupping'
    case 'waiting_for_brewing':
      return 'In brewing'
    case 'resolved':
      return referenceBatchLabel?.trim() ? referenceBatchLabel : 'Reference'
    case 'unresolved':
      return 'Closed without reference'
    case 'in_inventory':
      return 'In inventory'
  }
}

// Strip leading "Batch " / "Batch #" / "#" from a free-text best_batch_id so
// callers can compose "Batch #N" without double-prefixing. Handles all four
// historical shapes ("133" / "Batch 139" / "#94" / "Batch #25") consistently.
// Returns null on null/empty/whitespace-only input.
export function extractBatchNumber(raw: string | null | undefined): string | null {
  if (!raw) return null
  const stripped = raw.replace(/^Batch\s*#?\s*/i, '').replace(/^#/, '').trim()
  return stripped || null
}

// Section title for the /green index page header. Sentence case per scope doc
// § 5.1 ("Waiting for next roast" not "Waiting For Next Roast").
export function lifecycleSectionTitle(state: LifecycleState): string {
  switch (state) {
    case 'waiting_for_next_roast':
      return 'Waiting for next roast'
    case 'waiting_for_next_cupping':
      return 'Waiting for next cupping'
    case 'waiting_for_brewing':
      return 'Waiting for brewing'
    case 'resolved':
      return 'Resolved'
    case 'unresolved':
      return 'Unresolved'
    case 'in_inventory':
      return 'In inventory'
  }
}
