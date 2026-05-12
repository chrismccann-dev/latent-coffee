# Per-batch failure_boundary breach record

Sprint 3.4 scoping doc. Output of the Sprint 3.1 architectural-queue brainstorm (2026-05-12).

**Status: SCOPED, awaiting plan-mode session.** This doc is a placeholder ahead of the Sprint 3.4 plan-mode brainstorm that will produce locked decisions + impl plan. The plan-mode session will be its own /sprint kickoff.

## Context

The `experiments` table carries `failure_boundary text` — a free-text condition list documenting "intentional limits this experiment will not cross." Example (Bean 4 / Wush Wush V1): `"maillard_max=50, dev_min_s=25, drop_max_c=207"`. Today this is prose, not structured.

Surfaced during Batch 18 dogfood (`feedback_v2_mcp_feedback_log.md`):

> **#R67 — `failure_boundary` is text-only.** Bean 4 (Wush Wush) wrote it as a comma-separated condition list. Programmatic boundary-breach detection at `push_roast` time would require structured shape: `{maillard_max: 50, dev_min_s: 25, drop_max_c: 207}`. Mid-future work — Wush Wush case is exactly the use case (all 3 batches breached, prose captures it but "show me all V1 batches that breached failure_boundary" is currently impossible).
>
> **#R68 — `failure_boundary_breached` field on `push_experiment` (or similar).** Currently no clean way to record "boundaries breached intentionally and why."

The 2.7.5 retro additionally flagged this as a **plan-mode candidate**: needs design pass on JSONB shape + `/green/[id]` render strategy before code. The brainstorm now has enough data points (Wush Wush V1 + Bean 4-6 cases) to lock decisions.

## Inputs

- **#R67** — `failure_boundary` text → structured JSON shape
- **#R68** — `failure_boundary_breached` field on `push_experiment` (or per-batch breach record)
- **2.7.5 plan-mode flag** — needs design pass on JSONB shape + `/green/[id]` render before code

## Data points

**Wush Wush V1 (Bean 4)** — all 3 batches breached failure_boundary. Prose captures it; query "show me all batches that breached" currently impossible. This is the canonical use case the design must serve.

**Bean 4-6 cases** — additional experiments where breach was recorded but only in `context` prose. Adds structured signal for "experiment quality" tracking if that becomes interesting downstream.

## Open questions for the plan-mode session

1. **Structured shape of `failure_boundary`**: JSONB object with arbitrary keys (`{maillard_max: 50, dev_min_s: 25, drop_max_c: 207}`), or a discriminated-union list of `{metric: 'maillard_max', op: '<', value: 50}` records?
   - Object form is denser but harder to evolve when a new metric appears.
   - List form is verbose but trivially extensible + supports `op` ≠ `<` cases (e.g. `drop_temp >= 195`).
   - Tradeoff: object form fits prosaic boundary statements; list form fits a future "automatic boundary-breach detector" cleaner.

2. **Per-batch vs per-experiment breach record**: Breaches happen per *batch* (a specific `roast` row), but the failure_boundary is declared at *experiment* scope. Where does the breach flag live?
   - (a) New `roasts.failure_boundary_breached jsonb` per batch (which metrics breached, by how much).
   - (b) New `experiments.batch_breaches jsonb[]` array indexed by `batch_id`.
   - (c) Both — `roasts` carries the breach detail, `experiments` carries a summary count.
   - Tradeoff: (a) is the cleanest data model (breaches happen on roasts); (b) co-locates with the boundary declaration; (c) is duplicated state.

3. **Relationship to existing `failure_boundary text`**: Keep both for back-compat (text as denormalized display, structured as machine-readable)? Migrate fully? Move text into `failure_boundary_notes` and reserve `failure_boundary` for structured?
   - Mirrors the Process taxonomy 1e.2 → 1e.3 → 1e.4 cadence (structured + legacy text → structured-only).
   - Migration drift risk: existing 18 imported experiments have text-only `failure_boundary`; need decompose helper.

4. **`/green/[id]` render strategy**: Where does breach info surface?
   - On the existing Experiments block (`<LearningField>` row showing "Breaches: 3/3 batches breached maillard_max")?
   - As a new section ("Boundary Breaches Across Batches")?
   - On the Roast Log table (a column flag indicating this batch breached)?
   - All three?
   - Tradeoff: visibility on the user job ("am I learning anything from breach patterns?") vs. UI clutter.

5. **`push_experiment` schema vs `push_roast` schema**: Where does the breach detection fire?
   - Server-side at `push_roast` time, comparing the roast values against the experiment's structured `failure_boundary` and persisting the breach flag.
   - Client-side (claude.ai-side) with explicit `failure_boundary_breached: true` on `push_experiment` payload.
   - Both — server detects at `push_roast`, claude.ai can override at `push_experiment` for intentional cases ("I knew this would breach and that's the point").
   - Tradeoff: server-side automation reduces friction but may surface false positives on prose-y boundaries; client-side is explicit but adds friction.

6. **Compose / decompose helpers**: Per the Process taxonomy pattern, structured columns get a `composeFailureBoundary(structured)` → text and `decomposeFailureBoundary(text)` → structured pair. Both ship in this sprint.

7. **MCP Tool surface impact**: Does `push_experiment` schema change shape (adds `failure_boundary` structured + `failure_boundary_text` legacy)? Does `patch_experiment` need new fields? Does a new `mark_batch_breach` Tool make sense, or does breach detection happen automatically?

## Scope (preliminary)

**In scope:**
- Structured `failure_boundary` shape on `experiments` (JSONB)
- Per-batch breach record (likely on `roasts`)
- Compose / decompose helpers for back-compat with text form
- Migration to convert existing 18 imported experiments
- `push_experiment` + `push_roast` schema updates
- `/green/[id]` render of breach info (location TBD in plan-mode)
- Schema describe() updates

**Out of scope (deferred to follow-ups):**
- Automatic breach detection as a separate analytics surface ("show all V1 batches that breached" cross-experiment query)
- Breach-tracking UI in `/add` or `/brews/[id]` (experiments are roast-side, not brew-side)
- Boundary recommendation engine ("based on prior breaches, recommend tightening this boundary")

## Acceptance criteria (preliminary)

Per-item (to be refined in plan-mode):
- **R67**: `experiments.failure_boundary` is JSONB. Wush Wush V1's prose `"maillard_max=50, dev_min_s=25, drop_max_c=207"` decomposes to `{maillard_max: 50, dev_min_s: 25, drop_max_c: 207}` (or list equivalent).
- **R68**: Per-batch breach record persists; query "show all batches that breached maillard_max" is structured.
- **/green/[id]**: Breach info renders on the appropriate section per plan-mode decision.
- **Back-compat**: 18 existing experiments migrate cleanly; no data loss.
- **End-to-end**: Re-create the Wush Wush V1 scenario (3 batches, all breach) end-to-end without manual JSON construction by claude.ai.

## Sizing

~1-2 day plan-mode brainstorm + ~1-2 day impl. ~3-4 day total.

## Build order placement

Sprint 3.4 (3rd in the 6-sprint queue). After Sprint 3.3 (auto-supersede); before Sprint 3.5 (Roest API parity). Cross-ref: Sprint 3.5 may need to surface breach flags via `pull_roest_log` if server-side breach detection lives there.

## Plan-mode session checklist

When kicking off Sprint 3.4's plan-mode session:
1. Re-read this scoping doc.
2. Survey: `feedback_v2_mcp_feedback_log.md` Cluster C (#R67 + #R68) + 2.7.5 retro plan-mode flag.
3. Query DB: list all 18 imported experiments + their `failure_boundary` text values + count breach-language occurrences.
4. AskUserQuestion rounds on Open Questions 1-7 above.
5. ExitPlanMode with locked decisions written to this file's "Locked decisions" section (added below the current Open Questions section).
6. Impl PR ships from PRODUCT.md § Active Sprints item #3 (Sprint 3.4).

## Files likely modified (TBD)

- `supabase/migrations/0??_failure_boundary_structured.sql` — new (number assigned at sprint time)
- `lib/mcp/push-experiment.ts` — schema reshape
- `lib/mcp/push-roast.ts` — possibly add breach detection
- `lib/experiments-failure-boundary.ts` — new helper module (compose / decompose)
- `app/(app)/green/[id]/page.tsx` — breach render
- Tool describe() strings on `push_experiment` + `push_roast`
- `docs/taxonomies/failure-boundaries.md` — possibly new, mirrors process taxonomy pattern
