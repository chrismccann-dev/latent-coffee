# Sprint 2 — Green cupping re-skin (`/green/[id]` waiting-for-cupping) — KICKOFF

Second mobile-primary "workflow-companion" surface (phone at the cupping table, V-set in front) and the first container-query dual-subtree reflow. Execution sprint — plan-mode first (the dual-subtree composition is interpretive), then ship autonomously.

**Goal:** re-skin the `waiting_for_next_cupping` shape of `/green/[id]` to the `Ssp*` family, mobile-first. Unlike brew detail (a plain `order-*`-free stack), this surface needs a genuinely different mobile composition: the desktop transposed Cupping Hypothesis table → mobile per-slot cards. Use a `.s2-desktop`/`.s2-mobile` dual-subtree (both in DOM, one revealed by `@container` at the 520px crossover), per the scope doc § Per-surface mobile pattern rule. Desktop preserved byte-for-byte.

**Mobile critical-path stack (390):** T1 Producer Notes + Taste-for as stacked slot cards (lavender state-cup, uses `taste_for` action-verb format) → T2 Primary Question + Roast Actuals (demoted, table kept, state-roast) → T3 collapsed "Reference & Detail" (reference signals · slot predictions · green-bean info · roast log · experiment journey). `deriveStage2Slots` flattens existing `cupHypoCols` — no new data, no schema change.

**Read first:** `docs/features/claude-design-redesign-scope-2026-05-29.md` (§ Mobile-primary companion surfaces) + the round-trip artboard in the design bundle (`subpage-green.jsx` + `mobile-handoff.css`) + the current `app/(app)/green/[id]/page.tsx` `WaitingForNextCuppingView`.

**Likely-new primitives/CSS:** `state-cup`/`state-roast` card variants already exist (`.ssp-card.state-*`); may need a slot-card primitive + the `.s2-desktop`/`.s2-mobile` container-query toggle CSS. StatusPill lavender/resolved/archive tones already ported in Sprint 1.

**Verify:** tsc + build; preview a real waiting-for-cupping lot at 390 (slot cards lead, desktop table hidden) + 1024 (transposed table, unchanged) + spot-check the 520px crossover. This is an execution sprint, not a grilling session — autonomy rule applies after plan approval.

---

**Outcome (shipped 2026-05-29):** see [shipped.md](docs/sprints/shipped.md) row + the approved plan. Two interpretive calls resolved without re-asking: (1) dual-subtree scope = the reflowing cupping composition only — shared components (`GreenBeanInfoCard`/`RoastLogTable`/`CrossBatchNotesBlock`/`ExperimentFrameCard`/`PerRoastReflections`) stay legacy-skinned below the toggle through the migration window (they're shared with the 4 un-migrated `/green` shapes); (2) IA preserved from Bundle B (2-row hypothesis table), not regressed to the artboard mock's 3-row Original/Updated/Taste-for. New primitives `SspExpGrid` + `SspProseRows` added to `components/Ssp.tsx`.
