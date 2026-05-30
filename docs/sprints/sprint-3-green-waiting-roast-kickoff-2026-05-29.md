# Sprint 3 — Green waiting-for-roast re-skin (`/green/[id]` waiting-for-next-roast) — KICKOFF

Third companion surface in the Claude-Design redesign (PRODUCT.md § Active Sprints #5). **Soft** mobile-primary per Q3 — usually consulted at the desk during V-set design, so desktop-primary with a strong mobile pass (not mobile-first like brew detail / green cupping). Execution sprint — plan-mode first (the shared-component decision is the key call), then ship autonomously after approval.

**Goal:** re-skin the `waiting_for_next_roast` shape of `/green/[id]` (`WaitingForNextRoastView`) to the `Ssp*` family inside `.ssp-page`. The 6.3 IA is correct (Primary Question + Roast Hypothesis transposed table with lever-row amber-highlight + Drop Rules card → green-bean info → roast log → additional info) — this is a chrome re-skin, not an IA change.

**Scope (in):**
- Header → `<SspTopBar>` + `<SspNamePlate>` with a **sage/amber** (`#A88037` roast-emphasis) cover per artboard `STATE["stage-1"]` (the per-surface tile reconciliation, like Sprint 2's lavender for cupping).
- Roast Hypothesis transposed table → `<SspExpGrid>` (already built in Sprint 2 — reuse it; lever rows Drop temp / Peak inlet use `variant: 'highlight'` amber tint when values vary across batches, replacing the current `bg-latent-roast-emphasis-surface` per-cell logic).
- Drop Rules card → amber `.ssp-inset` (Sprint 2 ported `.ssp-inset` + `.cup`; the roast/amber default variant is the base `.ssp-inset`).
- Primary Question → `.ssp-question`.

**Scope (out / migration-window seam, same as Sprint 2):** `<GreenBeanInfoCard>` / `<RoastLogTable>` / `<PerRoastReflections>` stay legacy-skinned below — shared with the still-un-migrated resolved / unresolved / cupping... wait, cupping is now migrated. After this sprint, only resolved / unresolved / inventory remain legacy. **Open question for plan-mode:** once waiting-for-roast + waiting-for-cupping are both `Ssp*`, is it worth re-skinning the shared components (so the two migrated views lose the seam), accepting that resolved/unresolved/inventory then show `Ssp*` shared components inside legacy `SectionCard` views? Or keep waiting until the resolved/unresolved sprint? Recommend: keep the seam until a dedicated "green shared-components + remaining shapes" sprint — re-skinning shared components mid-way splits the inconsistency rather than removing it.

**Mobile pass (soft):** waiting-for-roast is mostly a single-column stack already (Primary Question → table → drop rules → info → log). Likely needs only `order-*`-free stacking + the `.ssp-exp` narrow-container variant (already ported, handles the transposed table at <520). No dual-subtree expected — confirm in plan-mode by checking whether the hypothesis table reflows acceptably as-is at 390 (it's design-intent reference, fewer rows than cupping actuals).

**Read first:** `app/(app)/green/[id]/page.tsx` `WaitingForNextRoastView` + `HypothesisTable`/`DropRulesCard` + this sprint's CLAUDE.md § Green waiting-for-next-roast bullet + `subpage-green.jsx` `Stage1Body` artboard.

**Reuse from Sprint 2:** `SspExpGrid` + `SspProseRows` (`components/Ssp.tsx`); `.ssp-exp`/`.ssp-question`/`.ssp-inset`/`.ssp-prose-rows` CSS already in `globals.css`. The `Stage1` artboard uses `Inset` grid-mode for Drop Rules (V_n-columned rules) — may need the `.ssp-inset .inset-grid` CSS variant (NOT yet ported; Sprint 2 only ported the `.inset-stack` mode). Port it if Drop Rules renders as a transposed grid.

**Verify:** tsc + build; preview a real waiting-for-roast lot (e.g. Fazenda Um - Wush Wush Natural) at 1024 + 390; confirm lever-row amber variance highlight survives the `SspExpGrid` port. Execution sprint, autonomy rule applies post-approval.
