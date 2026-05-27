# Sub-sprint 4a — Green-bean polish bundle — kickoff 2026-05-27

**Series**: Read-path surface polish series (PRODUCT.md § Active Sprints #4) — first sub-sprint, opened immediately after Writing-path series closed (Sub-sprint 4 shipped 2026-05-27 via [PR #270](https://github.com/chrismccann-dev/latent-coffee/pull/270) / main `d8b30d1`).

## ⚠️ CRITICAL: THIS IS NOT A PLANNED-EXECUTION SPRINT

**The autonomy rule does NOT apply here.** Per Chris on session handoff (2026-05-27):

> "The next one is going to require a lot more of my time not just having you (claude code) look at the green bean side but me spending time with all of the in-process and resolved green beans and me to go every page line by line and make little info design, UX design, etc suggestions and wrap that all together in one big package. So don't just rush to start fixing stuff but wait for me to give full summary and look through then you can also look through to make sure I didn't miss anything either."

**Default mode for the next session: LISTEN, DO NOT EXECUTE.** Treat this like a grilling session per [feedback_grilling_vs_executing_distinction.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_grilling_vs_executing_distinction.md). The audio-confirm signal will come AFTER Chris has done his own audit pass + your complementary pass + a bundled-plan review — not before.

**Failure mode to avoid**: opening the session, glancing at the scope notes in PRODUCT.md § Sub-sprint 4a, and starting to fix Item 12 (WaitingForNextRoastView section reorder) or Item 13 because they look "mechanical." They are not yet sized + bundled + ratified. The whole point of this sprint is to NOT pick items off in isolation — wait for the full package, then plan-mode review, then ship.

## Process

**Three phases, strictly sequential. Do not advance until each phase produces an explicit handoff signal.**

### Phase 1 — Chris's page-by-page audit (Chris-driven, multi-hour, multi-session if needed)

Chris walks every green-bean page line-by-line and captures info design / UX design / information-architecture suggestions. Surfaces to walk (see § Audit surfaces below for the canonical list).

**Claude's role in Phase 1**:
- Be available for clarifying questions ("what's the original intent of this section?", "where does this data come from?", "is this field populated for all lots?").
- Stay in **listening mode**. Do NOT propose alternative designs unless explicitly asked. Do NOT start a parallel "I noticed X" feedback stream — that comes in Phase 2 after Chris hands off.
- If Chris asks for a quick read of a code section to ground a UX decision (e.g. "is this section's data actually live or is it a placeholder?"), answer the specific question — don't expand.

**Handoff signal**: Chris says "OK that's my full audit pass" or equivalent. Until then, do not advance.

### Phase 2 — Claude's complementary pass (Claude-driven, single session)

Claude reads the FULL feedback log + the audit-history docs + the in-flight scope items from PRODUCT.md + the live `/green/[id]` code paths, AND Chris's Phase 1 notes, and surfaces:

1. Items in the feedback log that Chris did NOT mention in his audit but probably should.
2. Cross-cutting patterns across Chris's individual notes (e.g. "you flagged this on 3 different lifecycle states — it's actually one shared component").
3. Substrate fields that exist but render nowhere (`canonicals_updated_at`, `terroir_provenance` / `cultivar_provenance`, `aromatic_behavior` / `structural_behavior` on cuppings, `inlet_curve_recorded` from Sprint 3.5, etc.).
4. Anything in Chris's notes that's structurally bigger than he framed it (e.g. "this UX suggestion implies a new entity, not a render tweak").
5. Anything in Chris's notes that's structurally smaller than he framed it (so Chris can de-scope confidently).

**Output of Phase 2**: a single complementary-pass document appended to or paired with Chris's audit notes. NOT an implementation plan yet — still in audit mode.

**Handoff signal**: Chris reads the complementary pass and either approves it as-is or asks for revisions. Once approved, the combined audit (Chris's notes + Claude's pass) is "the bundle."

### Phase 3 — Bundling + plan-mode review

Claude takes the combined audit and produces a single implementation plan:
- Groups items into bundle-coherent PRs (NOT one giant PR; NOT one PR per item — bundles that share substrate / share components / share migration).
- For each bundle: scope + files touched + verification plan + sizing estimate + risk callout.
- Surfaces any decisions that need Chris's audio-confirm BEFORE implementation (e.g. "this means a new schema column — confirm the name + nullability?").
- Routes through plan mode (ExitPlanMode tool) for review.

**Only after plan approval does any code change.** No exceptions. If Chris says "go" mid-audit on a single item, gently push back: "let's hold that for the bundled plan so we don't fragment the PR." (If Chris explicitly overrides, fine — but the default is hold.)

## Audit surfaces

### Pages to walk

The single URL family is `app/(app)/green/`:

1. **`/green` (index)** — [app/(app)/green/page.tsx](app/(app)/green/page.tsx). 3 lifecycle sections (Waiting for next roast / Waiting for next cupping / Resolved); in-inventory lots intentionally not surfaced. Tile color + label + metadata line per row.

2. **`/green/[id]` — InventoryPlaceholder** — only reachable via direct URL today (in-inventory lots are filtered off the index per scope doc § 5.1). Walk only if Chris has any in-inventory lots; otherwise skip.

3. **`/green/[id]` — WaitingForNextRoastView** — V-set design view. Sections: hero / `ROASTS · V_n` SectionCard (Primary Question + Hypothesis transposed table + Drop Rules card) / `<GreenBeanInfoCard>` / `<RoastLogTable>` / `<PerRoastReflections>` collapsed details / Additional Information.

4. **`/green/[id]` — WaitingForNextCuppingView** — V-set cupping view. Sections: hero / `CUPPING HYPOTHESIS · V_n` (Primary Question + Summary transposed table + Reference signals sub-card) / `ROAST ACTUALS · V_n` / Recipe Design Intent collapsible (Sub Pages 6.8) / `<GreenBeanInfoCard>` / `<RoastLogTable>` / `<PerRoastReflections>` / cross-batch notes from V_(n-1).

5. **`/green/[id]` — ResolvedView** — closed-lot archive. Sections: hero (resolved-emphasis tile + Resolved badge) / `REFERENCE ROAST · BATCH #N` (Why this roast won + Recipe Design + Achieved 2-col grid) / Reference Recipe Design Intent collapsible / `REFERENCE CUP` (Best cup synthesis + cupping/optimized brew 2-col grid) / `ROASTING LEARNINGS · {lot}` (3 character cards + 7 detail rows) / `ROASTING LEARNINGS · TO CARRY FORWARD` (3 fields) / `<GreenBeanInfoCard>` / `<RoastLogTable>` (defaultCollapsed) / All Cuppings collapsible / Experiment Journey collapsible / Additional Information / "Closed without reference" disambiguator card when `why_this_roast_won` is null.

### One-shot lot variations

Per CLAUDE.md, one-shot lots flow through the same lifecycle helper as V-set lots — `batch_ids` cardinality 1 routes through `waiting_for_next_cupping` → `resolved` normally. There is no separate one-shot page shape. Verify on the resolved one-shot lots (Round 12 + close-lots from R12-R14) that the V-set-flavored copy doesn't read awkwardly when N=1.

PRODUCT.md § Sub-sprint 4a previously framed this as "5 page shapes" (including "one-shot waiting / one-shot resolved"), but the code has 4 functions. The "shapes" framing was scope-doc framing; the audit should treat one-shot variations as state-of-data sub-checks inside the 3 active views.

### Lots to walk

Per CLAUDE.md as of 2026-05-13, there were 13 green bean lots. The count has grown since (dogfood rounds 9-14 added more closures). Quick command at session start to enumerate current lifecycle distribution:

```bash
# Fast check on the current lot state via MCP
# (list_recent_brews returns brews, not green beans — use the green index UI or
#  a direct SQL/MCP read to enumerate)
# Or just open /green in the preview server and copy the list.
```

The audit should explicitly walk:
- **Every Resolved lot** — these have the densest UI surface and the most lived archive value.
- **Every active V-set lot** (Waiting for next roast + Waiting for next cupping) — these are the lots Chris actively touches week-to-week, so UX friction here has the highest payoff.
- **Each one-shot resolved lot** — verify V-set copy doesn't grate at N=1.
- **In-inventory lots if any** — confirm the placeholder text is still right.

## Known candidate items (catalog, NOT implementation list)

These items are **on the radar** going into the audit — Chris may want to keep some, drop some, expand some, merge some. Do not pre-commit to any of them.

### From [feedback_mcp_continuous_log.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_mcp_continuous_log.md) Outstanding follow-ups

- **Item 11** (Round 7) — `/green/[id]` design refresh: recipe_variant in lightweight summary, WB→Gnd delta column, provenance flags surfaced.
- **Item 12** (Round 1, Higuito V3 spot-check) — WaitingForNextRoastView section reorder: front-load `ROASTS · V_n` SectionCard with Primary Question + Roast Hypothesis; demote `<GreenBeanInfoCard>` + `<ExperimentFrameCard>` down.
- **Item 13** (Round 2, Fazenda Um V1 spot-check) — WaitingForNextCuppingView parallel section reorder: front-load `CUPPING HYPOTHESIS · V_n` + `ROAST ACTUALS · V_n` + `<CrossBatchNotesBlock>` (when V_(n-1) exists); demote `<GreenBeanInfoCard>` + `<ExperimentFrameCard>`.

### From the same log, scattered observations (not in the "Outstanding follow-ups" list — verify whether they're still live)

- **Round 14 Item 12 (Mt Elgon, 2026-05-23)** — "Drop rules disappear from waiting-for-roast page view after roast logged." Operator needs drop rules AT the machine during the roast; the view that surfaces them changes the moment you log the roast. Possible fix: keep drop rules visible on the cupping-view via the Sub Pages 6.8 collapsible. Verify whether 6.8 already addressed this.
- **Round 11 Item 11 (CGLE Sudan Rume V5)** — "No formal 'candidate run-off pourover' concept" — currently both candidate run-off + post-optimization recipe use `recipe_variant: real_pourover`. Suggests `is_run_off: bool` or `run_off_brew_recipe` field. Schema-shape question for ResolvedView's REFERENCE CUP rendering.
- **Round 10 Item 12 (Sudan Rume V5)** — "Rest-days drift not queryable as a structured field" — currently prose-only via `additional_notes` prefix `REST_DAYS_DRIFT:`. UI surface implication: should the resolved view's REFERENCE CUP block surface rest-days drift?

### From PRODUCT.md § Sub-sprint 4a scope notes

- **Schema additions** — `cuppings.sweetness` + `cuppings.temperature_behavior` parser wiring. Schema landed Sprint S3 / 2026-05-18 via migration 046; `push_cupping` + `patch_cupping` Zod schemas + `persistCupping` already expose both per CLAUDE.md § cuppings. Render wiring on ResolvedView's REFERENCE CUP card + All Cuppings collapsible needs verification — confirm both fields actually render.
- **Phase 3 provenance UI** — `terroir_provenance` / `cultivar_provenance` / `canonicals_updated_at` are queryable but unrendered. Sprint 3.2 #8 already added a footer rendering when set on `<GreenBeanInfoCard>` — but today's 13 lots all have `provenance = 'canonical'` and no auto-creations, so the render is dormant. Decide: is this still worth surfacing pre-emptively, or wait until first auto-created provenance lands?
- **Reference Roasts entity** — new `reference_roasts` table replacing `roast_learnings.best_batch_id` + `roasts.is_reference`. Sprint B of [docs/features/reference-roast-and-guide.md](docs/features/reference-roast-and-guide.md). This is potentially a big chunk — possibly its own PR within the bundle.
- **POD-1 absorption** — simulated-pourover routing UI. Schema preference locked (`eval_method = 'Simulated Pourover'`). 1 of 4 promotion triggers fired; Path C-2 framing validated 2026-05-21. Confirm trigger conditions before pulling in.

### From Sprint 3.5 (Sub-sprint 1 of writing-path series, shipped 2026-05-26)

- **`roasts.inlet_curve_recorded`** — net-new text column populated by `pull_roest_log`. As-designed vs as-recorded inlet curve diff. Should render on ResolvedView's Reference Roast Recipe table (Design column has as-designed; Achieved column could add an as-recorded row with delta callout when they diverge).
- **3 RoR columns** — `ror_at_2_30` / `ror_at_4_00` / `ror_at_fc_minus_30s` populated by `pull_roest_log`. Cross-lot comparable anchors. Could render on `<RoastLogTable>` as 3 new columns OR inside `<PerRoastReflections>` as a small RoR sub-card.
- **R57 rewire** — `roasts.color_description` (previously `roest_notes`) now coalesces Roest UI Notes content. Verify the ResolvedView's REFERENCE ROAST block surfaces this somewhere (Agtron + color description go together).
- **R64** — Chris's inlet-curve screenshot comparison was gated post-merge. Confirm with Chris during audit whether his Bean 6 V1C check landed.

### From Sub Pages 6 series retrospective items (not in active feedback log)

- **`<PerRoastReflections>` adoption** — added Sub Pages 6.7; populated 99/92/91% on existing data. Verify it renders correctly on all 3 view shapes and that the prose density isn't overwhelming.
- **`<ExperimentFrameCard>` + `<CrossBatchNotesBlock>` adoption** — added Sub Pages 6.7. Items 12 + 13 above suggest the placement isn't quite right — that's the section-reorder candidate.
- **Lever variance amber highlighting** — Drop temp + Peak inlet cells amber-highlight when values vary across batches (Sub Pages 6.4). Verify the variance-detect logic still fires correctly on lots with mixed null/populated lever data.

### Cross-cutting candidates (Claude should pre-think these)

- **Mobile layout** — `/green/[id]` is dense; mobile rendering on the transposed per-batch tables may overflow. CLAUDE.md notes desktop is primary, mobile is spot-check. Verify whether mobile got tablet-spot-check on Sub Pages 6.3-6.5 ship.
- **Empty-state copy** — already shipped Sub-sprint 4 update for `/brews` empty state ("Brews land here once a brewing session in claude.ai writes via the Latent MCP server."). `/green` index already has analogous copy from Sub Pages 6.6. Verify both for consistency / typography / accuracy.
- **Cross-link tag blocks** — `<GreenBeanInfoCard>` may render terroir / cultivar / process tags that link to aggregation pages; verify these still work post Sub Pages 2-5 read-side reorganization.

## Files likely touched (do NOT pre-edit)

The audit is read-only at first. Surfaces likely in scope when implementation eventually starts:

- [app/(app)/green/page.tsx](app/(app)/green/page.tsx) — index lifecycle sections
- [app/(app)/green/[id]/page.tsx](app/(app)/green/%5Bid%5D/page.tsx) — 4 state-dispatched views + helpers (`extractBatchNumber`, `pickPourover`, `pickOptimizedBrew`, `composeBrewRecipeLine`, 5 recipe-side render helpers, 4 row primitives)
- [components/GreenBeanInfoCard.tsx](components/GreenBeanInfoCard.tsx) — shared info card
- [components/RoastLogTable.tsx](components/RoastLogTable.tsx) — 9-column roast log
- [components/PerRoastReflections.tsx](components/PerRoastReflections.tsx) — per-roast drill-down
- [components/ExperimentFrameCard.tsx](components/ExperimentFrameCard.tsx) — 6 experiment frame fields
- [components/CrossBatchNotesBlock.tsx](components/CrossBatchNotesBlock.tsx) — V_(n-1) observed-outcome notes
- [components/DropRulesCard.tsx](components/DropRulesCard.tsx) — drop rules per V-set
- [components/ReferenceSignalsCard.tsx](components/ReferenceSignalsCard.tsx) — cupping-view reference cup signals
- [components/HypothesisTable.tsx](components/HypothesisTable.tsx) — transposed per-batch hypothesis table
- [lib/lifecycle-state.ts](lib/lifecycle-state.ts) — state derivation helper
- Possibly `lib/synthesis/adapters/*` if any aggregation cards turn out to need wiring

**Likely net-new for the bundle**: `reference_roasts` table migration + corresponding component(s) (Sprint B of reference-roast-and-guide.md). Anything else net-new should surface in plan mode, not inline.

## Methodology notes

### For Chris (Phase 1)

- Walk lifecycle-state by lifecycle-state. Don't jump between Resolved and WaitingForNextCupping in the same pass — the page shapes are different enough that context-switching costs accumulate.
- Within a lifecycle state, walk lot-by-lot. Each lot exercises slightly different data combinations (e.g. some have populated `temperature_behavior`, some don't; some have a typed `best_roast_id`, some have legacy text `best_batch_id`); the audit catches what renders correctly under each combination.
- For each surface, note:
  - **Info design** — is this the right data here? Is it in the right grouping?
  - **UX design** — does the user (Chris) actually need this front-and-center, or can it move?
  - **IA** — does the section order tell the right story for "I'm about to do X with this lot"?
  - **Noise** — is anything rendering that I never read?
  - **Missing** — is anything populated in the DB that I want here?
- Note "this is fine, keep it" decisions too — those help Claude's complementary pass de-prioritize re-flagging them.

### For Claude (Phase 2)

When Phase 1 hands off:

1. **Read Chris's notes top-to-bottom before opening any code.** Form the gestalt first.
2. **Then read the feedback log + PRODUCT.md scope notes + this kickoff brief's "Known candidate items" section.** Compare against Chris's notes. Flag delta.
3. **Then sanity-check substrate**: query the DB for fields-populated-but-not-rendered + render-paths-that-may-be-dormant. Cross-ref CLAUDE.md § Green for the canonical surface map.
4. **Author the complementary pass as a single doc.** Don't fragment across multiple files.
5. **Categorize Claude's findings**:
   - "Chris flagged this — agree" (no value-add; skip)
   - "Chris didn't flag this — recommend adding to bundle"
   - "Chris flagged this — pushback / scope different than framed"
   - "Cross-cutting pattern across multiple of Chris's notes"
   - "Substrate gap (field exists, render missing)"
6. **Do not propose implementation specifics in Phase 2.** That's Phase 3.

### For Phase 3 bundling

- A single overarching plan with 3-6 bundle-coherent PR sketches is the target output. Too many bundles = fragmented review; too few = giant PRs.
- Each bundle should be independently shippable (no inter-bundle blockers).
- Schema-changing bundles (Reference Roasts entity, any cuppings-side wiring) should ship FIRST in the bundle order — UI bundles can layer on top.
- For each bundle: sketch the verification plan (which lots / which lifecycle states the bundle is tested against, since coverage matters more here than on most sprints).

## Sizing

PRODUCT.md says "1-2 stacked sprints." Chris's framing suggests this is at the high end — full lot-by-lot audit is hours of human time, complementary pass + bundling is 1-2 hours Claude time, then each implementation PR is 1-2 hours Claude time. Realistic total: **multi-week elapsed, several focused Claude sessions across the arc**.

Do not pressure-test the sizing — let Chris's audit set the pace.

## Open questions for kickoff

These don't need answers immediately, but flag during Phase 1 if Chris's audit doesn't naturally address them:

1. **Reference Roasts entity** — is it in scope for this sub-sprint, or does it earn its own sub-sprint within Read-path? The entity creation is non-trivial (new table, migration, MCP Tools, render path). If Chris's audit surfaces only minor adjustments to the existing `roast_learnings.best_batch_id` rendering, the entity work may be a separate item.
2. **POD-1 absorption** — verify the 4 trigger conditions before pulling in. If 3 of 4 haven't fired yet, defer.
3. **`canonicals_updated_at` / `*_provenance` render** — worth surfacing pre-emptively for the eventual first auto-created row, or wait until that row exists? 13 lots are all `canonical` provenance today.
4. **Mobile** — in scope, or punt to a dedicated mobile-pass sprint per Chris's design conventions ("desktop is primary; mobile spot-check on every UI sprint; phone-scope lives in its own sprint")?

## Cross-system audit reminder (for the implementation phase)

When bundles ship, each substrate-touching bundle must trace through the six-actor chain per CLAUDE.md sprint cadence #4. Read-side bundles touch Actor 6 (UI + lib) most heavily; Actor 4 (MCP) only if a new field is exposed via a Tool. Actor 5 (CLAUDE.md § Green) needs editing every time the page surface changes shape. Actor 1 (Chris's verifier role) is the final gate.

## Related docs

- [docs/sprints/writing-path-surface-polish-series-2026-05-26.md](docs/sprints/writing-path-surface-polish-series-2026-05-26.md) — predecessor series umbrella (closed 2026-05-27)
- [docs/roasting/redesign.md](docs/roasting/redesign.md) — Sub Pages 6 series scope doc (the 4 lifecycle states + page shapes were defined here)
- [docs/features/reference-roast-and-guide.md](docs/features/reference-roast-and-guide.md) — Reference Roasts entity scope (Sprint B)
- [feedback_grilling_vs_executing_distinction.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_grilling_vs_executing_distinction.md) — the rule that bounds this sprint's pacing
- [feedback_mcp_continuous_log.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_mcp_continuous_log.md) — source for known candidate items (Outstanding follow-ups + per-round observations)
- CLAUDE.md § Green — the canonical surface map; cross-ref every audit observation against this

## Session-start checklist

When the next session opens, before doing anything else:

- [ ] Read this kickoff brief in full.
- [ ] Confirm you are in audit-listening mode, NOT execution mode.
- [ ] Acknowledge to Chris that you understand the 3-phase process.
- [ ] Ask Chris how he'd like to start (does he want to dive into a specific lifecycle state? does he want you to enumerate the current lot list first? does he want a brief on the substrate fields-populated-but-not-rendered before he starts his audit, or after?).
- [ ] Do NOT open `/green/[id]/page.tsx` and start scanning until Chris says "go" or asks a clarifying question that needs a code read.
