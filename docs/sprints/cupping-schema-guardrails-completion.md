# Completion report — Cupping / Roast Schema Guardrails (feedback-pipeline Cluster 2)

> Paste this back into a Claude Code session here to close the loop. It restates the
> plan so it stands alone, reports what shipped per item, and lists the verification
> actually run. Kickoff brief: [cupping-schema-guardrails-kickoff.md](docs/sprints/cupping-schema-guardrails-kickoff.md).

## 1. The plan, as executed

The kickoff asked for three small, additive cupping/roast schema guardrails — each a
place where a real signal lived only in prose (uncross-queryable) or where a transcript
slip could write nonsense with no guard. All independent of the bigger lifecycle-state
rework (SPG/calibration-gate state #22 + deferred-proposals #23), which was deliberately
OUT of scope and belongs to the Lot Coordinator + V-Set Assistant sprint.

In scope:
1. `cooling_arc_pattern` enum on `cuppings` (`degrade` / `hold` / `improve` / `flat`).
2. Server-side `cupping_date ≥ roast_date + 1` + rest_days consistency check.
3. Derived `roast.execution_diverged_from_recipe` boolean.

Open question #6 (per-batch failure-boundary breach JSONB array on experiments): default
was "leave it out." Decision below.

## 2. What shipped, per item

### #27 — `cuppings.cooling_arc_pattern` enum  ✅ matched plan
- **Migration:** [`078_cupping_roast_guardrails.sql`](supabase/migrations/078_cupping_roast_guardrails.sql)
  adds `cooling_arc_pattern text` + a CHECK constraint `IN ('degrade','hold','improve','flat')`
  (text + CHECK, matching the `fc_audibility` enum pattern from migrations 061/066), plus a
  column COMMENT. No backfill — historical cuppings stay NULL (operator patches on re-review).
- **MCP write path:** added to `pushCuppingInputSchema` ([push-cupping.ts](lib/mcp/push-cupping.ts))
  + `patchCuppingInputSchema` ([patch-cupping.ts](lib/mcp/patch-cupping.ts)) as a `z.enum`,
  with a describe block contrasting it with the `temperature_behavior` prose. Persisted in
  `persistCupping`, added to `CUPPING_PATCH_FIELDS`, and an enum guard added to
  `validateCuppingPayload` + `patchCupping` (mirrors the DB CHECK so a bad value fails with a
  readable MCP error). New exported `COOLING_ARC_PATTERNS` / `CoolingArcPattern` in
  [roast-import.ts](lib/roast-import.ts).
- **Type + UI:** `Cupping.cooling_arc_pattern` added to [lib/types.ts](lib/types.ts); the
  `/green/[id]` page (read path is `select('*')`, so the column flows automatically) renders a
  "Cooling arc" row next to "Temperature behavior" in both the pourover-gate block and the
  per-cup list (guarded on the value, so invisible until a value lands).
- **Prompt:** [log-cupping.md](docs/prompts/log-cupping.md) STAGE 3 gained a `cooling_arc_pattern`
  bullet (pick the enum alongside the prose, not instead of it).
- **Glossary:** "Cooling arc pattern" headword added to [CONTEXT-roasting.md](CONTEXT-roasting.md)
  § Cupping and cup-character interpretation.

### #31 — cupping_date / rest_days consistency guard  ✅ matched plan (MCP-layer, not DB)
- **Where:** enforced in the MCP write path, NOT the DB — it needs the joined
  `roasts.roast_date` and produces a per-field readable error, matching the
  `end-condition-bounds.ts` pattern. New helper
  [`lib/mcp/cupping-date-bounds.ts`](lib/mcp/cupping-date-bounds.ts) `checkCuppingDateConsistency(roastDate, cuppingDate, restDays)`.
- **Rules:** (1) `rest_days < 0` → reject (always, needs no dates — catches the bare-date
  voice slip that wrote a -23 rest); (2) `cupping_date < roast_date + 1 day` → reject (a cup is
  evaluated at least a day after the roast; same-day or earlier = a slip); (3)
  `|rest_days − (cupping_date − roast_date)| > 1` → reject (±1 day tolerance absorbs
  timezone/boundary slips, per the brief's "modulo timezone"). Date checks skip cleanly when
  `roast_date` or `cupping_date` is absent.
- **Wiring:** `persistCupping` now always fetches the parent roast's `roast_date` (alongside the
  `agtron` it already fetched for the wb_agtron snapshot) and runs the guard before insert.
  `patchCupping` re-runs the guard when a patch touches `cupping_date` or `rest_days`, using the
  patched-or-existing effective values. Both Tool descriptions document the guard.
- **Hard-reject, not warn:** these cases are unambiguously wrong (a cup can't precede its roast),
  so the guard hard-rejects with a clear message rather than accept-and-warn.

### #26 — `execution_diverged_from_recipe` derived boolean  ✅ shipped as a VIEW (design call)
- **Why a view, not a generated column:** the divergence is cross-table — it needs
  `recipe.end_condition_target` (on `roast_recipes`, joined via `roasts.recipe_id`) AND
  `roast.end_condition_type`. A Postgres STORED generated column can only reference columns in
  the same row, so a view is the only correct DB-level derived surface (and it's always
  consistent, with zero write-path change / no staleness risk).
- **What shipped:** migration 078 creates `public.roast_recipe_divergence` (`WITH (security_invoker = true)`
  so it respects the querying role's RLS) exposing `roast_id` / `user_id` / `recipe_id` /
  `roast_end_condition_type` / `recipe_end_condition_type` / `recipe_end_condition_target` /
  `execution_diverged_from_recipe`. The boolean is
  `(rec.end_condition_target IS NOT NULL AND r.end_condition_type = 'manual')`. Roasts with no
  recipe read FALSE (LEFT JOIN). Documented via a view COMMENT.
- **Not surfaced via MCP/types:** the brief framed #26 as an analytics-read field; no read Tool
  projects it and the brief didn't ask, so it's left as a queryable view (kept tight).

### Open-Q #6 — failure-boundary breach JSONB array  ❌ left out (per brief default)
Kept the sprint to the three guardrails. #6 is plan-mode-shaped and the lowest-value rider; it
was only to be pulled in if trivial alongside #26, and #26 turned out to be a view (no
experiments-table touch), so there was no trivial-adjacency. Route it back as its own item if it
keeps recurring.

## 3. PR + merge SHA

- PR: [#385](https://github.com/chrismccann-dev/latent-coffee/pull/385)
- main commit SHA: `5ebecc2`

## 4. Verification results (what was actually run/seen)

- **Build-kickoff migration gate (PROD):** PostgREST probe with the service-role key confirmed
  every dependency column is live — `roasts.end_condition_type`, `roasts.recipe_id`,
  `roast_recipes.end_condition_target`, `cuppings.temperature_behavior`, `cuppings.rest_days` all
  `EXISTS`; `cuppings.cooling_arc_pattern` returns `42703` (clean to add).
- **tsc:** `npx tsc --noEmit` exits 0 (worktree, symlinked main-repo node_modules per CLAUDE.md).
- **Date guard unit run:** ran the real `checkCuppingDateConsistency` through 11 cases via
  `sucrase/register` — all pass, including: valid Day 7 / Day 10, ±1 rest tolerance OK, off-by-2
  rejected, cupping == roast rejected, **cupping-before-roast "March 31" slip rejected**,
  **rest_days -23 rejected**, negative-rest-with-no-cupping_date rejected, and missing-date skips.
  Confirmed no em-dash in any error string (Chris's plain-hyphens rule).
- **Cross-system audit:** `check:doc-sizes` → all Tier-1 surfaces within cap (CONTEXT-roasting +
  log-cupping additions didn't cross anything); `check:mcp` → 35 Tools (no new Tool — fields added
  to existing Tools). No new `docs://` Resource, so `check:mcp-bundle` N/A.
- **Post-apply (migration 078 applied by Chris 2026-06-05, "Success. No rows returned"):**
  read-only PostgREST verification against PROD with the service-role key —
  - `cuppings.cooling_arc_pattern` column now resolves (HTTP 200; was `42703` pre-apply). The
    CHECK constraint applied with the migration (the `ALTER ... ADD CONSTRAINT` succeeded).
  - `roast_recipe_divergence` view live: 145 roast rows, **13 read `execution_diverged_from_recipe = true`**,
    and a boolean-integrity check confirmed every diverged row is genuinely
    `(roast_end_condition_type = 'manual' AND recipe_end_condition_target IS NOT NULL)` — e.g. a
    real manual-drop roast whose recipe targeted 205°C bean-temp. The derivation is correct on
    live data and immediately surfaces 13 lots where the operator dropped by feel against a
    recipe that planned a machine target.
  - **Deliberately NOT done:** a live sample `push_cupping` write. Writing a junk cupping to PROD
    violates the MCP-canonical-input discipline; the date guard (#31) is unit-proven (11 cases)
    and lives in the persist path, and the enum CHECK is confirmed applied, so no live write was
    needed to close the verification.

## 5. Deferred / surprising / newly surfaced

- **Migration apply is operator-gated.** This environment has no `execute_sql` MCP tool and no
  Postgres connection string, so DDL can't be self-applied. Migration 078 self-registers
  (`applied_migrations` convention) and the `check:migrations` daily cron backstops a forgotten
  paste — but the live sample-push verification is genuinely pending Chris applying it.
- **claude.ai catalog cache.** `cooling_arc_pattern` is a new field on an *existing* Tool's input
  schema, so per the catalog-cache rule it won't be callable from claude.ai until a fresh session
  re-handshakes the MCP catalog. Not a new Tool, so no count delta to watch — just expect the
  field to be invisible until the next claude.ai session start.
- **#26 framing.** The brief said "derived/generated column on `roasts` if doing it at the DB
  level," but the cross-table dependency made a generated column impossible — a view is the
  correct read. Flagging in case the intent was a roast-row column the app reads inline (it isn't,
  today); easy to add a read-Tool projection later if analytics wants it on the roast object.

---

When you paste this back: flip backlog items #27 / #31 / #26 `open → shipped` (remove their lines
per the backlog status lifecycle), confirm the `docs/sprints/shipped.md` row landed, and
`route-feedback` anything in §5 worth tracking as fresh feedback.
