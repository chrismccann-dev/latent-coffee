# Sprint 4 — Green shared-components re-skin + remaining lifecycle shapes — KICKOFF

Fourth surface in the Claude-Design redesign (PRODUCT.md § Active Sprints #5). This is **the seam-closure sprint** flagged in Sprints 2 + 3: it re-skins the shared `/green` components to `Ssp*` AND re-skins the 3 remaining lifecycle shapes (resolved / unresolved / inventory), so all 5 `/green` views land on `Ssp*` at once and the migration-window inconsistency disappears.

Execution sprint — **plan-mode first** (scope-split is the key call), then ship autonomously after approval. The autonomy rule applies post-approval.

## Why now
After Sprints 2 + 3, waiting-for-cupping + waiting-for-roast are `Ssp*` but render **legacy-skinned shared components** below their re-skinned cards (`<GreenBeanInfoCard>` / `<RoastLogTable>` / `<PerRoastReflections>` / `<ExperimentFrameCard>` / `<CrossBatchNotesBlock>` / `<DropRulesCard>`). Chris ratified "keep the seam" both times on the explicit understanding that a **dedicated sprint** would re-skin the shared components + remaining shapes together — removing the inconsistency cleanly rather than splitting it across views. This is that sprint.

## ⟦Decide first in plan-mode⟧ Scope split
ResolvedView is the **densest shape in the codebase** (6.5: Reference Roast 2-col Design/Achieved grid, Reference Cup two-pane, Roasting Learnings 3 mini-cards + 7 rows, Carry-Forward, All Cuppings, Experiment Journey, ~13 inline helpers: `renderPeakInlet`/`renderDropTemp`/`renderEndCondition`/`renderChargeHopper`/`renderFanCurve`, `pickPourover`/`pickOptimizedBrew`/`composeBrewRecipeLine`, `<RecipeRow>`/`<CupRow>`/`<CharacterCard>`/`<LearningRow>`). UnresolvedView is forked from it. So the realistic options:

- **Option A (recommended): two PRs in one sprint.** PR1 = shared components → `Ssp*` (+ re-verify the 2 already-migrated views inherit cleanly, the whole point) + InventoryPlaceholder (trivial). PR2 = ResolvedView + UnresolvedView (the dense pair, shared chrome). Keeps each PR reviewable; PR1 de-risks the shared-component blast radius before the dense work.
- **Option B: one PR.** Everything together. Larger blast radius, harder to verify, but one clean "seam closed" landing.
- **Option C: three sprints.** Shared+inventory, then resolved, then unresolved. Slower; only if PR2 proves too big.

Recommend **A**. Surface to Chris before touching shared components — re-skinning them changes how the 2 *already-shipped* views render, so PR1's verification must include cupping + waiting-roast at 390 + 1024 (regression sweep), not just the new shapes.

## Scope (in)
**Shared components → `Ssp*`** (`components/`):
- `GreenBeanInfoCard` → the artboard's neutral `.ssp-card` + `SspShead ct="Lot intake data"` + `SspProseRows` (artboard `GreenBeanInfoCard`, subpage-green.jsx ~line 99). Note: it already surfaces `canonicals_updated_at`/`*_provenance` footer + moisture/density bare-number convention — preserve.
- `RoastLogTable` → `.ssp-log-wrap` + `.ssp-log` dense mono table (artboard `GreenRoastLog`, ~line 389). Keep the 9 columns + `defaultCollapsed` prop + `highlightedBatchIds` winner/highlight rows + `↗` profile link. Port `.ssp-log`/`.ssp-log-wrap` CSS (NOT yet in globals.css).
- `PerRoastReflections` / `ExperimentFrameCard` / `CrossBatchNotesBlock` → `Ssp*` chrome (collapsed `details.ssp-coll` / `.ssp-card` + `SspShead` as fits). No artboard 1:1 — design to match the family.
- `DropRulesCard` → reconcile with the inline `.ssp-inset` grid-mode already built in Sprint 3's waiting-roast view. **Likely: extract a shared `SspInset` (grid + stack modes) primitive** now that inset appears in 3 places (cupping inset-stack, waiting-roast inset-grid, resolved/cupping `DropRulesCard`). Sprint 3 deferred this (rule-of-2 precedent: Sprint 2 inlined). Rule-of-3 is now hit — evaluate extraction in plan-mode.

**Remaining shapes → `Ssp*`:**
- `ResolvedView` → artboard stage-3 (`GreenRefRoast` + `GreenRefCup` + `GreenRoastLearnings` + `GreenCarryForward` + `GreenRoastLog`, anchor case CGLE Sudan Rume Natural). Green tile `#4A7C59` (resolved-emphasis). The 6.5 IA is correct — chrome re-skin, not IA change. Map the dense helpers into `Ssp*` cards (`.ssp-why` for "Why this roast won" + "Best cup synthesis", `.ssp-roastspec` for the Design/Achieved grid, `.ssp-twopane` for Cupping/Optimized-Brew, `.ssp-insights` 3-up + `.ssp-pair-rows` for Roasting Learnings, `.ssp-learnings` dark block for Carry-Forward — all already in the artboard).
- `UnresolvedView` → artboard stage-3-noref (`Stage3ClosedNoRef`, Pacamara). Gray/archive tile `#6B6B66` (archive-emphasis). Preserve the Reference→Leading vocabulary rotation + dropped verdict block + carry-forward caution annotation.
- `InventoryPlaceholder` → minimal `Ssp*` re-skin (back-link + `SspNamePlate` + one empty-state card routing to claude.ai + `GreenBeanInfoCard`).

**Tile reconciliation (the deferred per-surface tile work):** detail-view hero tiles still use old bindings. Bind resolved → `#4A7C59`, unresolved → `#6B6B66` per artboard `STATE`. After this sprint all 5 green covers are reconciled (waiting-roast amber / cupping lavender / resolved green / unresolved gray / inventory grey).

## Scope (out)
- One-shot lots have no distinct view shape (implicit via single-element `batch_ids`); the artboard `one-shot` state (RTE) is a design variant, not a 6th route — don't add a route.
- No IA changes to any shape (all re-skin only).
- No schema / MCP / registry / prompt changes (render-layer only — actors 2/3/4 no-op).

## CSS to port (from the host `Latent - Sub Page System v1.html` / artboard)
`.ssp-log`/`.ssp-log-wrap`, `.ssp-roastspec`, `.ssp-twopane` (Sprint 2 may have it — check), `.ssp-insights`, `.ssp-pair-rows`, `.ssp-learnings` (+ `.scope`/`.tag`), `.ssp-why`, `.ssp-cite`, `.state-archive` corner/stripe. Check globals.css first — Sprints 0-3 ported a chunk already.

## Read first
- `app/(app)/green/[id]/page.tsx` — `ResolvedView` / `UnresolvedView` / `InventoryPlaceholder` + the 6 shared components in `components/`
- This sprint's CLAUDE.md § Green bullets (resolved shape 6.5 / Unresolved Bundle A / Bundle D color_description+sweetness render)
- Artboard `~/Documents/Latent Coffee Design System/Latent Design System - Full/project/subpage-green.jsx` (stage-3 is the anchor case) + `Latent - Sub Page System v1.html` (host CSS)
- Sprints 2 + 3 shipped.md rows + retros (`memory/project_redesign_sprint_{2,3}_*.md`) — the seam decision + the `.ssp-corner`+`ct` 390-collision lesson

## Verify
- tsc clean (worktree: symlink `../../../node_modules`, `npx tsc --noEmit`, then `rm node_modules`); `/simplify` before commit.
- Preview at 1024 + 390: a resolved lot (CGLE Sudan Rume Hybrid Washed or Mandela XO — rich `why_this_roast_won` + FK-matched optimized brew), an unresolved lot (Higuito / GV Oma / GUA Libertad), inventory via direct URL.
- **Regression sweep (critical):** re-verify waiting-for-cupping + waiting-for-roast at 390 + 1024 — they now render the re-skinned shared components. This is the seam-closure proof.
- Six-actor: Actor 6 UI + Actor 5 docs (CLAUDE.md § Green + PRODUCT.md #5 + shipped.md); confirm the migration-window seam language is removed once all 5 views are `Ssp*`.

## Sizing
Largest green sprint (ResolvedView density). ~1-2 sessions depending on the scope-split call. Execution sprint, autonomy rule applies post-approval.
