# Dogfood polish PR — reconciliation summary

Reference doc for the parallel Claude Code session reconciling the 8 post-grilling cluster followup files (2026-05-14 through 2026-05-17). Authored 2026-05-18 after the dogfood loop closed at Round 7.

**Purpose**: dedupe + sequence the dogfood polish PR (= Sprints 6-8 of `post-grilling-sequencing.md`) against the post-grilling cluster followups. Where there's overlap, surface it explicitly so the parallel session can either coordinate or fold items together.

## TL;DR: What was learned in the dogfood loop

7 dogfood rounds across 2026-05-14 → 2026-05-18, each touching a different lot at a different lifecycle stage. Goal was to find friction in the new prompt rewrite (PR #157, V-set 4-prompt lifecycle) + one-shot framework (PR #158).

**Headline findings** (all confirmed twice or more across different lots):

1. **Pre-rewrite lots arrive at log-cupping.md with NULL fields the new prompt assumes are populated.** `updated_cup_prediction_*` / `taste_for_*` / `predicted_cup` on recipes. Claude.ai keeps having to infer-and-backfill from existing prose. Recurring across Rounds 1/3/4/6.
   - **Fix in polish PR**: A #2 — log-cupping.md STAGE 0 state-shape migration with worked-content examples.

2. **Routing pattern claude.ai keeps inventing**: "Path C" — V-set isn't done, but next move isn't a new V-set. Two variants observed:
   - **C-1**: Design blocked on missing calibration data (Fazenda Um Round 3 — Untold paired roasted reference cup not yet tasted)
   - **C-2**: Design blocked on cup-side discriminator (Higuito V3 Round 7 — real-pourover comparison on already-roasted beans, triggered when xBloom alone produced a winner AND prior V-sets show recipe_variant inversions)
   - **Fix in polish PR**: A #3 — log-cupping.md STAGE 4 Path C expansion with both variants enumerated.
   - **Future product expansion** (post-Sprint-R, not in polish PR): formalize Path C into a first-class workflow state per `docs/sprints/pourover-discriminator-and-optimized-brew-states-kickoff.md`.

3. **Schema-description discipline as primary information surface works.** Every time a tool description was explicit + load-bearing, claude.ai navigated the constraint correctly without needing to ask. Validates the architectural choice of "schema descriptions are the primary surface, not external prose."
   - **Fix in polish PR**: Sub-PR B — 9 schema-description edits across 6 MCP tool files for items that were under-described.

4. **Page-render section order isn't yet aligned with operator job-shape.** WaitingForNextRoastView + WaitingForNextCuppingView both surface the V_n-specific question after the cross-cutting context cards; should be reversed.
   - **Fix in polish PR**: Sub-PR C — 3 page-render reorders + Design/Achieved diff render on WaitingForNextCuppingView.

5. **CONTEXT.md vocabulary expansion needed** for two recurring concepts:
   - "Pre-V_n calibration gate" (Round 3 invention) — when the cup-side anchor isn't a same-bean reference but a peer-roasted/peer-lot reference
   - `is_reference` orthogonality from `worth_repeating` (Round 5 Rancho Tio insight) — for one-shot lots the only batch IS the reference even when not worth repeating
   - `key_insight_confidence` ladder operationalization (Round 7 insight) — Low/Medium/Medium-High/High need explicit heuristics so calibration is consistent

## What's changing in the polish PR (full enumeration)

Mapped to Sprints 6/7/8 of `post-grilling-sequencing.md`. Full per-item brief with rationale in `docs/sprints/cleanup-queue-handoff-brief-2026-05-17.md`.

### Sub-PR A (Sprint 6) — Prompt edits (13 items)

Files touched: `docs/prompts/log-roast.md` + `log-cupping.md` + `close-lot.md` + `one-shot.md` + `one-shot-closeout.md`.

Highest-leverage (sprint-killers):
- A #2: log-cupping.md STAGE 0 state-shape migration (Round 6 #4)
- A #3: log-cupping.md STAGE 4 Path C expansion to TWO variants (Round 3 #1 + Round 7 #7)

Other prompt edits (alphabetical):
- A #1: log-roast.md STAGE 1 halt-and-report relaxation
- A #4: log-cupping.md STAGE 2 rest_days + date-drift handling
- A #5: log-cupping.md STAGE 3 winner format guidance
- A #6: log-cupping.md STAGE 3 prose-field disambiguation guide
- A #7: log-cupping.md stage-write directive checklists at each STAGE
- A #8: one-shot-closeout.md + close-lot.md STAGE 2 is_reference vs worth_repeating decoupling
- A #9: log-roast.md STAGE 1 batch_slot NULL fallback (infer from roast_profile_name)
- A #10: one-shot.md + one-shot-closeout.md stage-write directive checklists
- A #11: log-cupping.md + close-lot.md STAGE 3 key_insight_confidence ladder operationalization
- A #12: log-cupping.md STAGE 6 "skip and report why" language
- A #13: log-cupping.md STAGE 3 delta_from_cup_* description extension (walk three taste_for points)

### Sub-PR B (Sprint 7) — MCP schema-description + behavior fixes (9 items)

Files touched: `lib/mcp/*.ts` (Zod schemas + tool descriptions across 6 files) + `lib/mcp/patch-experiment.ts` (one behavior fix).

- B #14: patch-experiment.ts omit `canonical_values: {}` when empty
- B #15: push-experiment.ts + patch-experiment.ts delta_from_cup_* description fallback
- B #16: push-roast-recipe.ts parent_recipe_id semantics relax (directional-ancestor)
- B #17: push-roast-profile.ts + push-roast.ts BEAN_TEMP vs bean_temp case notes
- B #18: push-roast.ts + patch-roast.ts is_reference description decouple from worth_repeating
- B #19: push-experiment.ts + patch-experiment.ts batch_ids description + 16 cross-batch field enumeration
- B #20: propose-doc-changes.ts ASCII-vs-Unicode normalization documentation
- B #21: patch-experiment.ts winner canonical_values echo
- B #22: push-experiment.ts + patch-experiment.ts key_insight_confidence ladder description

### Sub-PR C (Sprint 8) — Page-render polish (3 items) + CONTEXT.md additions (3 items)

Files touched: `app/(app)/green/[id]/page.tsx` + `CONTEXT.md`.

- C #23: WaitingForNextRoastView section reorder
- C #24: WaitingForNextCuppingView section reorder
- C #25: Design/Achieved diff render on WaitingForNextCuppingView ROAST ACTUALS card

CONTEXT.md additions:
- #26: "Pre-V_n calibration gate" entry under § Forward design
- #27: "Closed without reference" entry clarifier on is_reference orthogonality
- #28: `key_insight_confidence` ladder operationalization entry

## Deduplication notes — potential overlap with post-grilling followups

This section identifies specific items where the polish PR + post-grilling cluster followups might step on each other. The parallel session reconciling post-grilling docs should check these explicitly.

### Files the polish PR touches

Anything in these files at Sprint 6/7/8 time might collide with concurrent post-grilling work:

- **`docs/prompts/log-roast.md`** — A #1, A #9
- **`docs/prompts/log-cupping.md`** — A #2, A #3, A #4, A #5, A #6, A #7, A #11, A #12, A #13 (heavy editing — 9 items)
- **`docs/prompts/close-lot.md`** — A #8, A #11
- **`docs/prompts/one-shot.md`** — A #10
- **`docs/prompts/one-shot-closeout.md`** — A #8, A #10
- **`lib/mcp/push-experiment.ts`** — B #15, B #19, B #22
- **`lib/mcp/patch-experiment.ts`** — B #14, B #15, B #19, B #21, B #22
- **`lib/mcp/push-roast-recipe.ts`** — B #16
- **`lib/mcp/push-roast-profile.ts`** — B #17
- **`lib/mcp/push-roast.ts`** — B #17, B #18
- **`lib/mcp/patch-roast.ts`** — B #18
- **`lib/mcp/propose-doc-changes.ts`** — B #20
- **`app/(app)/green/[id]/page.tsx`** — C #23, C #24, C #25
- **`CONTEXT.md`** — #26, #27, #28

### Known overlap risks with post-grilling clusters

Based on the inventory section of `post-grilling-sequencing.md` (I read through A.1 Roasting + A.2 Brewing + A.3 MCP / Sync + A.4 Canonical registries):

1. **RO-4 (Audit docs/prompts/ for new vocabulary)** in the roasting cluster — POST-dogfood per the sequencing doc. **Overlap**: this item is meant to land AFTER RO-1/3/6 schema migrations (renames + new columns). The polish PR's prompt edits don't touch RO-1/3/6 vocabulary (those columns don't exist yet). Coordination: RO-4 runs AFTER the polish PR lands, so no conflict if both ship sequentially per the sequencing doc.

2. **SYN-8 (BREWING.md ↔ ROASTING.md cross-coffee section naming asymmetry)** — POST-dogfood, ships in Sprint 9 unified. **No direct overlap** with polish PR (different files; polish PR doesn't touch ROASTING.md cross-coffee section names).

3. **Canonical registries cluster (CR-1 through CR-13)** — mostly PRE-dogfood (registry edits + alias cleanup + scoping docs). **No direct overlap** with polish PR (polish PR doesn't touch `lib/*-registry.ts` files or `docs/taxonomies/*.md`).

4. **MCP-1 (Signature method as override-eligible axis on `taxonomy_overrides_queue`)** — POST-dogfood per sequencing doc. **Overlap**: touches `lib/mcp/push-green-bean.ts` which the polish PR does NOT touch — so no file-level conflict. But MCP-1 ships in Sprint 12 of the sequencing doc, well after the polish PR's Sprint 7.

5. **WBC cluster** — mostly doc-only edits in `docs/brewing/wbc-reference.md` / `wbc-sourcing.md` / `wbc-roasting.md`. **No direct overlap** with polish PR (different files).

### Deduplication rule for the reconciling session

If a post-grilling followup item touches a file in the "Files the polish PR touches" list above AND ships in a sprint before or concurrent with Sprints 6/7/8, coordinate by:

- (a) Having the polish PR include the post-grilling edit (if scope is minor)
- (b) Sequencing the polish PR to ship first + the post-grilling edit to rebase on the polish PR's merge
- (c) Sequencing the other direction if the post-grilling edit is structural and the polish PR's edit is description-level

Default to (b) — polish PR is the dogfood-cleanup deliverable, ship it first.

## What's NOT in the polish PR (don't reconcile against these)

- Schema migration sprint candidates (4-5 candidates, separate sprint): `cuppings.wb_to_ground_delta` / `is_reference_candidate` / `cuppings.sweetness` / `roast_recipes.was_backfilled` / `experiments.taste_for_validation_*`
- CCIL consolidation arbiter task (recurring doc-maintenance)
- Pour-over discriminator + optimized brew lifecycle states (post-Sprint-R, near-term priority per Chris 2026-05-18; full scope at `docs/sprints/pourover-discriminator-and-optimized-brew-states-kickoff.md`)
- Operational backfills (Chris-driven, not in any PR scope): CGLE Sudan Rume Natural V5 recipe rows + historical end_condition backfill on roasts ≤batch 169
- Higuito V3 real-pourover discriminator (operational brewing-side work, Chris-driven)

## How to use this doc

Open it in the parallel Claude Code session reconciling post-grilling docs takeaways. Cross-reference the "Files the polish PR touches" list against your post-grilling cluster items. Flag any item that touches the same file + flags potential sequencing conflict to surface to Chris.

For deeper detail on any polish PR item, the full enumeration with rationale + round-of-origin is in `docs/sprints/cleanup-queue-handoff-brief-2026-05-17.md`. The per-round triage notes are in `memory/feedback_mcp_continuous_log.md` Rounds 1-7.

## Cross-references

- **Master plan**: `.claude/worktrees/goofy-liskov-46a997/docs/sprints/post-grilling-sequencing.md`
- **Polish PR scope**: `docs/sprints/cleanup-queue-handoff-brief-2026-05-17.md`
- **Per-round dogfood triage**: `~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_mcp_continuous_log.md`
- **Future product expansion**: `docs/sprints/pourover-discriminator-and-optimized-brew-states-kickoff.md`
- **PRs shipped**: #157 (V-set 4-prompt rewrite, merged 2026-05-15) + #158 (one-shot framework, merged 2026-05-15)
