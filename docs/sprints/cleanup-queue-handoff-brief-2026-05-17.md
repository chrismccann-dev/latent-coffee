# Cleanup queue handoff brief (post Round 7)

Paste-ready brief for a fresh Claude Code session that doesn't see the multi-day dogfood thread that produced this queue. Authored 2026-05-17, updated 2026-05-18 after Round 7 (Higuito V3 cupping) landed, updated again 2026-05-18 post-schema-sprint.

## Status (2026-05-18, post-#174 + schema sprint)

**Polish PR shipped + merged**: [latent-coffee#174](https://github.com/chrismccann-dev/latent-coffee/pull/174) — 28 items across Sub-PRs A (prompts) + B (MCP) + C (page) + CONTEXT.md additions. The bulk of the cleanup queue closed.

**Remaining dogfooding-queue items:**

| # | Item | Status | Next action |
|---|---|---|---|
| Schema sprint | S1-S4 candidates (S5 closed via prompt-level path in #174) | ✅ Shipped 2026-05-18 (this session) — migrations 055/056/057 + S3 MCP-exposure fold-in. See `docs/sprints/shipped.md` for the per-item landmark | — |
| CCIL consolidation | ARBITER.md playbook extension + ROASTING.md CCIL promote/retire pass | Ready to start (~1-2h) — natural next sprint | See § CCIL consolidation kickoff below |
| `patch_roast` + `read_doc_section` intermittent failures | Vercel logs investigation | Deferred — investigate when next intermittent surfaces (pattern more informative than archaeology). Vercel MCP is available, no setup needed | See § Vercel investigation note below |
| CGLE Sudan Rume Natural V5 missing recipe rows | V5 still auto-handles via STAGE 0; V1-V4 history backfill **shipped 2026-05-18** | No action — 13/13 V1-V4 recipe rows linked (experiment_id + batch_slot); batch 154 `(experiment_id, batch_slot)` collision defused by renaming its slot to `v3b_switched` | Archived prompt in § V1-V4 historical backfill below |
| Historical `end_condition` backfill on roasts ≤169 | Counterflow portion **shipped 2026-05-18**; pre-counterflow dropped from scope | 49/49 in-scope counterflow rows patched (SR Hybrid Washed 17 / Mandela XO 13 / SR Natural 12 / Gesha Clouds 3 + 4 stranded recovery). 6 additional rows flipped to `manual` via override rule. Pre-counterflow 4 lots (61 roasts: El Socorro / Libertad / GV Oma / GV Surma) deliberately dropped per counterflow-only archive rule | Archived prompt in § End-condition backfill prompt below |
| `manual` end_condition target convention (surfaced 2026-05-18) | DB inconsistent: 14 rows null target, 1 row (Red Plum batch 180) preserves it | ADR + standardization deferred to its own task — spawned 2026-05-18 | See spawned task chip |
| Round 8 dogfood (first one-shot.md production run) | Chris has auction samples ready to bundle 2026-05-18 | Bundle when an auction sample lands; exercises full one-shot.md pipeline end-to-end | See § Round 8 bundling note below |

## Schema sprint kickoff

Paste-ready for a fresh Claude Code session:

```
Working through the dogfooding-queue schema-migration sprint — the
deferred S1-S4 candidates from the cleanup-actions PR (latent-coffee#174,
merged 2026-05-18). S5 was closed via the prompt-level path in #174 so
it's no longer in scope.

Brief lives at:
  docs/sprints/cleanup-queue-handoff-brief-2026-05-17.md
  § Schema migration sprint — 4-5 candidates (original scope)
  § Schema sprint kickoff (this section, distilled)

The 4 candidates:

  S1. cuppings.wb_to_ground_delta — derived column (computed from
      roasts.agtron - cuppings.ground_agtron). Round 3 #6. Currently
      computed inline in page.tsx; promoting to a column lets queries
      filter / sort on it.

  S2. is_reference_candidate boolean on experiments OR roasts —
      distinct from "no winner yet" and from "leading slot IS reference
      quality". Round 3 #8. Open design question: does it live on
      experiments (V-set-scoped) or roasts (batch-scoped)?

  S3. cuppings.sweetness column — currently folded into
      acidity/body/flavor. Round 4 #12. The sweetness axis has stayed
      implicit in cup descriptors; promoting gives queries a dedicated
      column.

  S4. roast_recipes.was_backfilled boolean OR backfill_notes text —
      distinguishes design-intent-captured-at-design-time from
      design-intent-recovered-after-fact (the inline-backfill path
      #174 added to log-cupping.md STAGE 0 + log-roast.md STAGE 1 (b)).
      Round 5 #5. Makes the recipe-quality axis queryable.

Sprint shape (expected):
  - Plan mode first per CLAUDE.md sprint cadence #1 (each migration
    has interpretive scope; S2 + S4 in particular have design choices
    worth surfacing before coding via AskUserQuestion)
  - 4 migrations in supabase/migrations/ (sequential numbering, likely
    055-058 — check existing migration count)
  - MCP Tool schema updates for any new field on push_* / patch_*
    (push_experiment / push_roast / push_cupping / push_roast_recipe
    and their patch_* siblings)
  - Page render updates where derived columns become first-class
    (S1 wb_to_ground_delta on the resolved view + cupping cards;
    S3 sweetness on the cupping cards)
  - shipped.md row + cross-system audit per the six-actor matrix

Load-bearing reference docs (priority order):
  1. docs/sprints/cleanup-queue-handoff-brief-2026-05-17.md
     § Schema migration sprint (the canonical scope) + § Status
     (post-#174 state)
  2. memory/feedback_mcp_continuous_log.md Rounds 3-5 (per-round
     friction context that surfaced each item)
  3. CONTEXT.md — terminology + Closed without reference + Key-insight
     confidence ladder (recently added in #174)
  4. docs/roasting/redesign.md § 4.2 (cross-batch field write moments
     — relevant for S4's backfilled-vs-original distinction)
  5. CLAUDE.md sprint cadence rules (#1 plan-mode + #4 strengthened
     cross-system audit / six-actor matrix)
  6. PR #174 commit body — establishes the prompt-level baseline these
     migrations build on

Out of scope:
  - S5 taste_for_validation_a/b/c/d (closed via prompt-level path
    in #174's A #13)
  - CCIL consolidation arbiter task (separate ~1-2h sprint after this)
  - Pour-over discriminator + optimized brew lifecycle states
    (post-Sprint-R per master plan)
  - Round 8 one-shot dogfood (Chris bundles when an auction sample lands)
  - Grill-with-docs followups (separate sequential-track sprints per
    post-grilling-sequencing.md)

Operating preferences (standing):
  - Plan before coding when scope is interpretive (per CLAUDE.md #1)
  - AskUserQuestion on interpretive design decisions (e.g. S2's
    experiments-vs-roasts placement, S4's boolean-vs-text shape)
  - Only commit / push when explicitly asked
```

## CCIL consolidation kickoff

Smaller sprint (~1-2h). Run after schema sprint closes. Paste-ready:

```
Running the CCIL (Cross-Coffee Insight Layer) consolidation arbiter
task — Round 4 #11 from the dogfooding queue. ~1-2h. Two motions:

  1. Promote High-confidence hypotheses in ROASTING.md's Cross-Coffee
     Insight Layer to a Confirmed Patterns subsection (or equivalent
     stable section). Threshold: key_insight_confidence = High AND
     repeated across ≥2 lots OR strong cross-lot corroboration.

  2. Retire Low-confidence entries that haven't repeated across N
     lots (suggested threshold: 3+ similar lots without corroboration).
     Move to an archive section or delete depending on age.

  3. Extend ARBITER.md playbook with a "CCIL consolidation pass"
     section codifying the cadence (quarterly? when CCIL section
     crosses a row count?) and the promote/retire heuristics.

Reference docs:
  - ROASTING.md § Cross-Coffee Insight Layer (current entries)
  - CONTEXT.md § Key-insight confidence ladder (operational
    definitions, single source of truth for the 4 levels)
  - ARBITER.md (existing playbook structure)
  - memory/feedback_mcp_continuous_log.md Round 4 #11 (original
    surface)

This is doc-maintenance, not code. Probably one PR with ROASTING.md
+ ARBITER.md edits + a shipped.md row.
```

## Vercel investigation note

Pattern: `patch_roast` + `read_doc_section` occasionally surface in `tool_search` but error on execution; retries succeed. Anthropic request IDs from the dogfood log: `req_011CawGMmSjMThH9XeESJs`, `req_011CawGMmSjMNWThH9XeESJs`, `req_011Cb3bFZiMduh6ZkKcFSSqy`. Those don't map directly to Vercel request IDs (different service).

What to actually query in Vercel (via the wired MCP):
- `get_runtime_logs(projectId, level: ['error', 'fatal'], source: ['serverless'], query: 'patch_roast OR read_doc_section', since: '14d')`
- Cross-ref with Anthropic-side timestamps from the dogfood log.

Triage rule: **defer until the next intermittent surfaces**. Repeating pattern is more informative than log archaeology — one more failure gives a fresh timestamp window and an active reproduction.

## V1-V4 historical backfill (shipped 2026-05-18)

**Closed.** 13/13 V1-V4 historical recipe rows linked via `patch_roast_recipe` from a claude.ai session. Batch 154's `(experiment_id, batch_slot)` collision with batch 153 was defused by renaming 154's slot from `v3b` to `v3b_switched` directly via SQL (no DB-level unique constraint exists, but `persistRoastRecipe`'s `.maybeSingle()` lookup would have errored on the next `push_roast_recipe` call against that slot pair). V5 batches 187/188/189 still auto-handle via `log-cupping.md` STAGE 0 on the next cupping. Prompt below retained as historical reference:



```
Backfill V1-V4 historical recipe row linkages for CGLE Sudan Rume Natural
(green_bean_id 1cf02eb8-accb-4e74-8ce5-52892b4ecfd7). 13 recipe rows in
`roast_recipes` have NULL `experiment_id` + NULL `batch_slot` from
pre-PR-#157 days. Match each recipe by its `recipe_name` or its joined
roast's batch_id, then `patch_roast_recipe` to set:
  - experiment_id (UUID for CGLE-SRUME-NATURAL-2026-V<n> — get from
    get_bean_pipeline)
  - batch_slot ("v<n><letter>")
Don't write design-intent fields (predicted_*) — those were never authored
at design time for these legacy V's; leaving them NULL is honest. Optionally
patch_roast_recipe.was_backfilled = true once S4 lands.

Recipe → batch_id → V<n><letter> map (from execute_sql, 2026-05-18):
  v1: batches 128/130/131 → slots a/b/c
  v2: batches 142/143/144 → slots a/b/c (recipe_names use "v130a"-style
       drift typos but roast_profile_name confirms a/b/c; patch
       consistently to v2a/v2b/v2c)
  v3: batches 152/153/154/155 → slots a/b/b-switched-c/c
       (154 is the "switched mid-roast" hybrid; canonical slot v3b)
  v4: batches 167/168/169 → slots a/b/c

V5 (batches 187/188/189) is handled separately by log-cupping.md STAGE 0
on the next cupping run — don't backfill V5 manually here.
```

## End-condition backfill prompt (counterflow shipped 2026-05-18; pre-counterflow dropped)

**Closed (counterflow portion).** 49/49 in-scope counterflow rows patched across two claude.ai turns:

- Turn 1 (45 rows): SR Hybrid Washed 17 / Mandela XO 13 / SR Natural 12 / Gesha Clouds Forest 3. All came back `dev_time` from the Roest API; unit conversion (ms → s) applied at patch time. Override rule never fired.
- Turn 2 (4 rows, stranded-row recovery): SR Washed 146/147/148 + SR Natural 144. `roest_log_id` was NULL on these (NULL `profile_link` too), so Chris pulled the log_ids manually from the Roest UI. Patched via `pull_roest_log` → `patch_roast` with `roest_log_id` included in the same call to close the FK gap.
- 6 additional rows flipped to `manual` via the >0.5°C override rule + Chris's manual confirmation: SR Natural V5 187/188/189 (already-set bean_temp from Round 7, divergences 0.8/2.3/2.3°C) + Gesha Clouds Forest 170/171/172 (dev_time profiles where FC was silent or operator dropped short — functionally manual).

**Pre-counterflow lots (61 roasts) deliberately dropped** per the counterflow-only archive rule: El Socorro / Libertad / GV Oma / GV Surma. Their `green_beans.roest_inventory_id` is NULL and their `roasts.roest_log_id` is also NULL — recovery would require URL extraction from `profile_link` + Roest retention check, and these lots are already resolved + outside the active archive.

**Convention question surfaced:** 14 manual rows have `end_condition_target = NULL`, 1 row (Red Plum batch 180, created 2026-05-09) preserves the programmed target. Spawned as its own task 2026-05-18 — see the spawned task chip / new status-table row.

Prompt below retained as historical reference:



```
Backfill `end_condition_type` + `end_condition_target` on historical roasts
≤batch 169 across 8 lots. Original push happened before pull_roest_log
surfaced these fields (Round-7 capability landed 2026-05-14). The Roest
API has them now; re-pull + patch.

For each green_bean_id below, loop over its batches:
  1. list_roest_logs({inventory_id: <get via get_green_bean>}) to find
     each roast's log_id.
  2. pull_roest_log(log_id) — payload now includes end_condition_type +
     end_condition_target from the Roest API.
  3. patch_roast({roast_id, end_condition_type, end_condition_target}).
  4. Operator-override check: if end_condition_target and drop_temp
     diverge >0.5°C in a way unexplained by Roest behavior, set
     end_condition_type: "manual" instead of trusting the API payload.

Lots (descending null count, per execute_sql 2026-05-18):
  - Guatemala El Socorro · 22 roasts (batches 29-88)
    green_bean_id: 25bc4034-63b7-43c5-831d-0335c0f75f89
  - Guatemala Libertad · 22 roasts (batches 33-94)
    green_bean_id: b952f657-242b-4213-979e-40425683b3d9
  - CGLE Sudan Rume Hybrid Washed · 20 roasts (batches 104-148)
    green_bean_id: 0d3212f8-3f18-4ff7-b54e-7bd4b3363e86
  - CGLE Sudan Rume Natural · 13 roasts (batches 128-169)
    green_bean_id: 1cf02eb8-accb-4e74-8ce5-52892b4ecfd7
  - CGLE Mandela XO · 13 roasts (batches 100-151)
    green_bean_id: a88f3d97-1f20-417a-96b1-70766a2825eb
  - GV Oma · 9 roasts (batches 52-99)
    green_bean_id: 6756d000-9581-4f1a-8b04-269d11a9888e
  - GV Surma · 8 roasts (batches 18-27)
    green_bean_id: a2010599-7837-427f-85d9-6b414505727b
  - Gesha Clouds Forest · 3 roasts (batches 161-163)
    green_bean_id: 0f6e1e49-e7d6-41fc-8754-be249fbe4349

Total: 110 roasts across 8 lots. Report a summary table at the end:
{ lot, patched_count, manual_overrides, already_set, errors }.
```

## Round 8 bundling note

Chris confirmed 2026-05-18 he has auction sample lots ready to run and plans to bundle Round 8 with the first auction-sample one-shot lot. Trigger: next auction sample lands. Process: paste the contents of `docs/prompts/one-shot.md` into a claude.ai session, fill the LOT SPEC block per the prompt's intake template, run STAGES 1-4 end-to-end. Then close via `one-shot-closeout.md`. This exercises the full one-shot pipeline end-to-end (tolerance-anchored design + carry-forward search) on a fresh-from-the-start lot — distinct from Rancho Tio which was retroactive backfill. Append findings to `memory/feedback_mcp_continuous_log.md` as Round 8 entry once it lands.

## Goal for the next session

**Ship the polish PR(s) closing out the V-set + one-shot prompt-rewrite cycle.** Round 7 was the final dogfood datapoint — all recurring friction patterns are now confirmed twice or more across different lots, so the polish PR can ship with confidence that proposed edits cover real-world friction. The dogfood loop continues with Round 8 (first auction-lot sample landing → first one-shot.md production run on a fresh-from-the-start one-shot lot) but that's independent of the polish PR shipping.

## Load-bearing reference docs

- **[memory/feedback_mcp_continuous_log.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_mcp_continuous_log.md)** — Rounds 0-6 with full triage notes. THE source of truth for which items came from which round. Round 7 entry will be appended here.
- **PR [latent-coffee#157](https://github.com/chrismccann-dev/latent-coffee/pull/157)** (merged 2026-05-15) — 4-prompt rewrite (start-lot / log-roast / log-cupping / close-lot) + CONTEXT.md polish.
- **PR [latent-coffee#158](https://github.com/chrismccann-dev/latent-coffee/pull/158)** (merged 2026-05-15) — One-shot lot framework: migration 054 + persistRoastLearnings validation + one-shot.md + one-shot-closeout.md + CONTEXT.md additions.
- **[docs/sprints/one-shot-lot-framework-kickoff.md](docs/sprints/one-shot-lot-framework-kickoff.md)** — Original sprint scope for PR #158 with locked decisions.
- **[CONTEXT.md](CONTEXT.md)** — Latent terminology glossary. Vocabulary referenced throughout the prompts.
- **[CLAUDE.md](CLAUDE.md)** — Codebase + workflow rules. Standing-rules section is load-bearing for sprint discipline.

## Polish PR scope (~25 items across 3 layers)

Three natural sub-PR chunks if you want to ship in stages — A first, then B + C bundled after Round 8 confirms no new patterns surface. Or one chunky PR if you'd rather minimize review cycles.

**The two biggest items (sprint-killers if dropped):**
- A #2: log-cupping.md STAGE 0 state-shape migration (Round 6 #4)
- A #3: Path C expansion to TWO variants (Round 3 #1 + Round 7 #7)

Both close recurring patterns confirmed twice or more across different lots.

### Sub-PR A: Prompt edits (13 items)

Targets: `docs/prompts/log-roast.md` + `log-cupping.md` + `close-lot.md` + `one-shot.md` + `one-shot-closeout.md`.

| # | Item | Round |
|---|---|---|
| 1 | log-roast.md STAGE 1 halt-and-report relaxation (allow backfill when design intent is reconstructable from session memory) | 1 #1 |
| 2 | **log-cupping.md STAGE 0 state-shape migration** (load-bearing — supersedes prior items 3/5/7). Detects pre-rewrite lots in STAGE 1 and one-pass-backfills `updated_cup_prediction_*` / `taste_for_*` on experiment + `predicted_cup` on recipes. With worked-content examples (1-2 sentences each) closing the prose-granularity ambiguity | 6 #4 |
| 3 | **log-cupping.md STAGE 4 Path C expansion to TWO variants** (load-bearing — confirmed recurring across Rounds 3 + 7). Path C-1: design blocked on missing calibration data (Fazenda Um — Untold paired roasted reference cup). Path C-2: design blocked on cup-side discriminator (Higuito V3 — real-pourover comparison on already-roasted beans, triggered when V-set cupped at one recipe_variant only AND prior V-sets on the lot show recipe_variant inversions). Both distinct from "control experiment" (which IS a new V-set replicating leading slot). | 3 #1 + 7 #7 |
| 4 | log-cupping.md STAGE 2 rest_days flag + date-drift handling | 3 #4 + #10 |
| 5 | log-cupping.md STAGE 3 winner format guidance ("everything past V<n><letter> (Batch <Roest#>) goes in additional_notes") | 3 #7 |
| 6 | log-cupping.md STAGE 3 prose-field disambiguation guide (additional_notes vs what_changes_going_forward vs open_questions) | 3 #9 |
| 7 | log-cupping.md stage-write directive checklists ("this STAGE writes: X / Y / Z") at top of each STAGE | 6 #5 |
| 8 | one-shot-closeout.md STAGE 2 + close-lot.md STAGE 2 is_reference vs worth_repeating decoupling (Outcome B + only-batch case: is_reference: true ALWAYS for one-shots; A/B distinction is about worth_repeating + why_this_roast_won) | 5 #4 + #6 |
| 9 | log-roast.md STAGE 1 fallback: when `roast_recipes.batch_slot` is NULL (pre-rewrite lot), infer slot from `roasts.roast_profile_name` matching `*v<n><letter>*` | 3 #2 |
| 10 | one-shot.md + one-shot-closeout.md stage-write directive checklists (propagated from #7) | 6 #5 |
| 11 | **log-cupping.md + close-lot.md STAGE 3 `key_insight_confidence` ladder operationalization.** Document the heuristic: Low = "interesting hypothesis"; Medium = "consistent with 1-2 prior data points"; Medium-High = "strong evidence, ready to be a working assumption"; High = "ready to promote to a protocol change in ROASTING.md". | 7 #8 |
| 12 | log-cupping.md STAGE 6 "skip and report why" language. When downstream evidence is imminent (real-pourover discriminator pending, V_(n+1) imminent), defer the doc proposal to the next round. | 7 #9 |
| 13 | log-cupping.md STAGE 3 `delta_from_cup_*` description extension: walk the three taste_for_* reference points (producer notes / prior V_(n-1) memory / specific adjustment) noting which materialized as expected vs not. (Alternative: schema migration option in Sub-PR D below.) | 7 #10 |

### Sub-PR B: MCP schema-description + behavior fixes (9 items)

Targets: `lib/mcp/*.ts` Zod schemas + tool descriptions + `lib/mcp/patch-experiment.ts` behavior fix.

| # | Item | Round |
|---|---|---|
| 14 | `lib/mcp/patch-experiment.ts` — omit `canonical_values: {}` when empty (currently echoes empty object even when no enum fields touched) | 1 #7 |
| 15 | `lib/mcp/push-experiment.ts` + `patch-experiment.ts` — `delta_from_cup_*` description: "vs `updated_cup_prediction_*` if populated, else vs design-time `predicted_cup`" | 4 #8 |
| 16 | `lib/mcp/push-roast-recipe.ts` — `parent_recipe_id` semantics relax from strict-replication to directional-ancestor ("set when v3a was directly informed by v2b's design intent, including shifted spread anchored on v2b") | 4 #9 |
| 17 | `lib/mcp/push-roast-profile.ts` + `push-roast.ts` — BEAN_TEMP vs bean_temp case discipline notes (push_roast_profile takes all-caps Roest API enum; push_roast takes lowercase column enum) | 4 #10 |
| 18 | `lib/mcp/push-roast.ts` + `patch-roast.ts` — `is_reference` description: decouple from worth_repeating. "For one-shot lots with N=1, true by default after close-out - orthogonal to worth_repeating" | 5 #4 |
| 19 | `lib/mcp/push-experiment.ts` + `patch-experiment.ts` — `batch_ids` description clarification ("Omit field entirely to leave NULL at design time. Do NOT pass the string 'null'") + enumerate the 16 cross-batch fields more readably | 6 #6 + #7 |
| 20 | `lib/mcp/propose-doc-changes.ts` — document ASCII-vs-Unicode normalization behavior in tool description | 6 #8 |
| 21 | `lib/mcp/patch-experiment.ts` — `winner` canonical_values echo extension (currently free-text; add regex validation echo) | 3 #7 + 6 #9 |
| 22 | `lib/mcp/push-experiment.ts` + `patch-experiment.ts` — `key_insight_confidence` description: add the operational ladder per A #11 | 7 #8 |

### Sub-PR C: Page-render polish (3 items)

Targets: `app/(app)/green/[id]/page.tsx` (the WaitingForNextRoastView / WaitingForNextCuppingView function bodies).

| # | Item | Round |
|---|---|---|
| 23 | WaitingForNextRoastView section reorder: (1) ROASTS · V_n SectionCard with Primary Question + Roast Hypothesis, (2) `<GreenBeanInfoCard>`, (3) `<ExperimentFrameCard>` (demoted from current top position), rest unchanged | 1 #12 |
| 24 | WaitingForNextCuppingView section reorder: (1) CUPPING HYPOTHESIS · V_n, (2) ROAST ACTUALS · V_n, (3) **TBD-clarify-at-PR-time** (likely CrossBatchNotesBlock slot when V_(n-1) exists), (4) GreenBeanInfoCard, (5) ExperimentFrameCard, (6) RoastLogTable | 1 #13 |
| 25 | Design/Achieved diff render on WaitingForNextCuppingView ROAST ACTUALS card (currently shows drop_temp actual but not Design-side end_condition_target from recipe row — surfaces operator-override visually at cupping prep time) | 3 #2 |

### CONTEXT.md additions (3 items)

| # | Item | Round |
|---|---|---|
| 26 | "Pre-V_n calibration gate" entry under § Forward design (next to "Adjustment" + "Tolerance-anchored design") | 3 #11 |
| 27 | Clarifier on "Closed without reference" entry: `is_reference: true` can coexist with `why_this_roast_won = NULL` on one-shot Outcome B lots | 5 #4 |
| 28 | `key_insight_confidence` ladder operationalization entry: documents the heuristic (Low / Medium / Medium-High / High) so confidence calibration is consistent across syncs | 7 #8 |

## Schema migration sprint (separate, 4-5 candidates)

Defer to its own sprint. Bundle when timing makes sense (e.g. after Round 8 surfaces additional schema-shape items):

| # | Item | Round |
|---|---|---|
| S1 | `cuppings.wb_to_ground_delta` derived column (computed from `roasts.agtron - cuppings.ground_agtron`) | 3 #6 |
| S2 | `is_reference_candidate` boolean on experiments OR roasts (distinct from "no winner yet" + "leading slot IS reference quality") | 3 #8 |
| S3 | `cuppings.sweetness` column (currently folded into acidity/body/flavor) | 4 #12 |
| S4 | `roast_recipes.was_backfilled` boolean OR `backfill_notes` text column (distinguishes design-intent-captured-at-design-time from design-intent-recovered-after-fact) | 5 #5 |
| S5 | (Optional, defer or alternative to A #13) `experiments.taste_for_validation_a/b/c/d` text columns: post-cup verification of whether the three taste_for reference points each materialized as predicted. Default: handle via A #13 prompt-level extension instead. Promote to schema if structural treatment preferred after the prompt-level approach is dogfooded. | 7 #10 |

## Other queued items

- **CCIL consolidation arbiter task** (Round 4 #11). Recurring doc-maintenance: promote High-confidence hypotheses in ROASTING.md's Cross-Coffee Insight Layer to a Confirmed Patterns subsection + retire Low-confidence ones that haven't repeated across N lots. Lives in ARBITER.md playbook (or extends it).
- **patch_roast + read_doc_section intermittent failures** (Round 1 #4 + #5). req_011CawGMmSjMThH9XeESJs / req_011CawGMmSjMNWThH9XeESJs / req_011Cb3bFZiMduh6ZkKcFSSqy. Pattern: tool surfaces in tool_search but errors on execution. Retries succeeded. Open for Vercel logs investigation when there's a pause.

## Operational backfills (closed 2026-05-18)

- ~~**CGLE Sudan Rume Natural V1-V4 historical recipe linkage**~~ (Round 1 #2) — **shipped 2026-05-18.** 13/13 rows linked via `patch_roast_recipe` from claude.ai; batch 154 slot collision defused via SQL rename to `v3b_switched`. V5 still auto-handles via STAGE 0.
- ~~**Historical end_condition backfill on roasts ≤batch 169**~~ (Round 1 #8) — **counterflow portion shipped 2026-05-18.** 49/49 in-scope counterflow rows patched + 6 additional rows flipped to `manual` via override rule. Pre-counterflow 61 roasts deliberately dropped from scope.

## Newly queued (2026-05-18)

- **`manual` end_condition_target convention** — DB inconsistent (14 rows null target, 1 row Red Plum batch 180 preserves it). Spawned as its own task; ADR + standardization pending. See status table row above.

## Pending dogfood rounds

- **Round 7: Higuito V3 cupping** (target 2026-05-19, possibly 2026-05-18 if convenient). First cupping on a fresh-from-rewrite V-set lot (V3 recipes have full bezier + design intent + Roest linkage end-to-end). Should NOT hit the STAGE 0 migration friction since the lot ran through new prompts from V3 design onward. If Round 7 is clean, that's confirmation the polish PR scope is correctly sized + doesn't have unforeseen interactions.
- **Round 8: First auction-lot sample** (timing depends on when Chris's friend forwards samples or sourcing conversations land). First production run of `one-shot.md` on a fresh-from-the-start one-shot lot (not retroactive backfill like Rancho Tio was). Exercises the full one-shot pipeline end-to-end including tolerance-anchored design + carry-forward search across similar prior lots.

## How to use this brief in a fresh Claude Code session

Paste verbatim. Add as a first-message preamble: "Working through the cleanup queue from the recent Latent dogfood pass. Brief at `docs/sprints/cleanup-queue-handoff-brief-2026-05-17.md`. Round 7 just landed — see Round 7 entry in `memory/feedback_mcp_continuous_log.md`. Want to start with Sub-PR A (prompt edits)."

The new session will have full context via:
1. The brief (this file)
2. The memory log (Rounds 0-6 + Round 7 once landed)
3. The two PRs as commit-history reference
4. CONTEXT.md + CLAUDE.md as standing guidance
