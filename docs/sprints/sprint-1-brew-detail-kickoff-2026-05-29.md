# Sprint 1 — Brew Detail re-skin — KICKOFF BRIEF (2026-05-29)

Paste-ready brief to open in a **fresh** Claude Code session. First **per-surface** sprint of the Claude-Design redesign (PRODUCT.md § Active Sprints #5), following Sprint 0 Foundation ([#298](https://github.com/chrismccann-dev/latent-coffee/pull/298), main `20a18e4`). This is the **first mobile-primary "workflow-companion" surface** and the **first consumer of the `Ssp*` primitive family**.

## ⚙️ THIS IS AN EXECUTION SPRINT — the autonomy rule applies

Scope is concrete (this brief + the scope doc + the design bundle). Plan-mode first (a few interpretive calls — see Open Questions), then execute the approved plan as one flow: commit + push + PR + merge autonomously when verification passes. Per [feedback_autonomy.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_autonomy.md). Not a brainstorm.

## Read first

- **[docs/features/claude-design-redesign-scope-2026-05-29.md](docs/features/claude-design-redesign-scope-2026-05-29.md)** — § "Mobile-primary companion surfaces" says `/brews/[id]` is **already aligned, no round-trip needed**: `BrewDetailPolished` stacks recipe-first in tier order at every viewport; **mobile = `order-*` reordering of the same blocks** (single tree — NOT a dual-subtree; that's only for the cupping surface).
- **The design bundle** at `~/Documents/Latent Coffee Design System/Latent Design System - Full/project/`:
  - `subpage-system.jsx` → `BrewDetailPolished` (the exact tier composition + which `Ssp*` each block uses) + the `Ssp*` component bodies. Anchor data = **Pepe Jijón Finca Soledad — Sidra Wave Hybrid (Brew #143)** — use it as the visual reference.
  - `Latent - Sub Page System v1.html` `<style>` block — the `.ssp-*` CSS (already ported to `app/globals.css` in Sprint 0; only port additions if a primitive is missing chrome — see Open Q3 `.status`).
- **Sprint 0 substrate** (already shipped — your stable base): `components/Ssp.tsx` (the family), the `.ssp-*` CSS + `:root` vars + `latent-*` warm-paper tokens in `app/globals.css` + `tailwind.config.ts`, CLAUDE.md § Design / UX conventions (Ssp* family + container-query rule + workflow-companion framing).

## Goal

Re-skin `/brews/[id]` from the legacy `SectionCard`/`RecipeTable`/`PourStructureList`/`CollapsibleBlock` chrome to the `Ssp*` lab-document family, **mobile-primary** (the phone-at-the-brew-bench surface). The IA does **not** change — the page already runs the T1–T4 recipe-first stack; this is a chrome swap + the first real exercise of the `Ssp*` primitives, the `.ssp-page` container wrapper, and the `order-*` mobile pattern.

## Tier mapping (current section → `Ssp*`)

Current page = 7 sections ([app/(app)/brews/[id]/page.tsx](../../app/%28app%29/brews/%5Bid%5D/page.tsx)). Map onto `BrewDetailPolished`:

| Current | → `Ssp*` |
|---|---|
| 1. Header (cover + title + badge + meta) | `SspTopBar` (`Brew #N · date · roaster`, kind `Brew Detail`) + `SspNamePlate` (title, meta = Variety/Roaster/Producer, status pills = Purchased/Roasted + Roast level) |
| 2. **T1** Reference Brew Recipe | `SspShead` (ct = `brewer · filter`) + `SspKVStrip`/`SspRecipeHead` (6-cell Dose/Water/Ratio/Grind/Temp/Total) + Bloom + `SspTimeline` (from `parsePourSteps`) + `.ssp-tail` drawdown + Water Recipe line (`brew.water_recipe`) + `SspModifier` (strategy + modifier chips + detail via `splitModifierLabel`) |
| 3. **T2** Presentation | `SspFlavorAxis` (route `brew.flavors` → floral/fruit/tea/spice) + `SspStructure` (`structure_tags` → label-row + chip-row) |
| 4. **T3** Peak Expression | `.ssp-peak` dark block (`brew.peak_expression`; render only if present) |
| 5. **T4** Coffee Overview | `SspIdentGrid` (5-cell: Roast Level / Cultivar / Process / Terroir / Producer, with breadcrumb `sub` lines) |
| 6. **T4** What I Learned | `.ssp-learned` dark prose (`brew.what_i_learned`) |
| 7. **T4** Full Brew Notes | `details.ssp-coll` (sensory · `temperature_evolution` · takeaways · classification, conditional fields) |

Wrap the whole page in `.ssp-page` (carries `container-type` — activates the container queries). Stack in tier order at every viewport; mobile is `order-*` on the same blocks (the tiers are already in priority order, so a plain single-column stack likely needs *no* `order-*` at all — confirm against the artboard).

## Scope — IN
- `/brews/[id]` detail re-skin per the tier mapping above.
- Whatever small `Ssp.tsx` / `.ssp-*` additions the page needs (see Open Questions: flavor-axis routing helper, `.status` pills).
- A `lib/` helper routing the 3-axis flavor system → the 4 `SspFlavorAxis` categories (see Open Q2).

## Scope — OUT
- All other surfaces (green cupping companion = Sprint 2; aggregation + green index = later).
- The `/brews` **index** card re-skin + the ratification #2 **mono card-title flip** — decide in plan mode whether to fold it in (it's the index, not the companion detail) or split to its own sprint (Open Q1).
- Retiring the now-dead `RecipeTable` / `PourStructureList` (used ONLY by this page — they go dead after the swap): leave the files, flag for a cleanup follow-up (don't delete mid-sprint). `CollapsibleBlock` stays (6 other consumers).

## Files likely to touch
- `app/(app)/brews/[id]/page.tsx` (render rewrite to `Ssp*`).
- `components/Ssp.tsx` (extend a prop / add a `Status` pill if needed).
- `app/globals.css` (only if porting `.status` pill CSS or a missing `.ssp-*` rule).
- `lib/` (new flavor→axis routing helper).
- Docs: PRODUCT.md (move the bullet / shipped.md row), CLAUDE.md if a new convention emerges.

## Verification plan
- `npm run build` + `npx tsc --noEmit` in main repo (`/Users/chrismccann/latent-coffee`) or symlink `node_modules` into the worktree per build-hygiene.
- `preview_start` → log in (creds in `memory/reference_dev_login.md`) → screenshot a **real brew** (Pepe Jijón #143 if present) at **390 (primary) + 1024**. Confirm: recipe-first stack, `.ssp-*` chrome renders (black topbar, plum name plate, dark recipe strip, flavor axis, ident grid, dark peak/learned, collapse), container queries fire (6-cell recipe + 4-cell axis + 5-cell ident at desktop; collapse to fewer cols at 390), nothing lost vs the legacy page.
- Spot-check a brew with sparse data (no peak_expression, few flavors, no modifiers) — empty-state handling.

## Cross-system audit (six-actor)
- **Actor 6** (UI): `/brews/[id]` render + `Ssp.tsx` + flavor-axis helper. No schema/migration.
- **Actor 5** (docs): CLAUDE.md § Brews (if the page-structure description changes), PRODUCT.md roadmap currency + shipped.md.
- **Actors 2/3/4**: no-op (render-layer only). Confirm + state the skip.
- **Actor 1**: preview at 390 + 1024.

## Open questions for plan mode
1. **`/brews` index card-title mono flip (ratification #2):** fold into Sprint 1 (it's the sibling surface; small) or split to its own sprint? The companion (mobile-primary) is the *detail* page; the index is desktop-primary. Lean: keep Sprint 1 to the detail page; flip the index card titles in a fast-follow or its own sprint.
2. **Flavor → 4-axis routing:** `brew.flavors` is the 3-axis system (`{base, modifiers}`); `SspFlavorAxis` wants floral/fruit/tea/spice. `lib/flavor-registry.ts` `getFlavorFamily` gives 8 families — build a `lib/` helper mapping 8 families → 4 axis cats. **Decide where notes that don't fit (Sweet & Confection, Other, Nutty/Roasted) go** — a 5th cell, fold into Spice, or a muted hint line? The prototype hand-routed 4 notes only.
3. **Status pills:** `SspNamePlate` `pills` are `ReactNode[]`; the prototype uses `<span class="status">` (dot + tinted) which was **NOT** ported in Sprint 0 (only `.chip` was). Either port `.status`/`.status.amber` CSS + a small `<StatusPill>` in `Ssp.tsx`, or reuse `<Chip tone>`. Lean: add a `StatusPill` (the dot treatment is the Purchased/Roasted/Roast-level signal).
4. **`SspTimeline` from free-text `pour_structure`:** `parsePourSteps` is best-effort (`label`/`time`/`amount_g`/`method` optional). Decide the fallback when a step has only `raw` (render raw in `.desc`, blank `.t`/`.lbl`?), and whether to keep the existing `PourStructureList` fallback for un-parseable structures.

## Governing principle
Pull from the v2 system, don't adopt carte blanche — Latent's framework wins on naming/structure. The `Ssp*` components are the canonical chrome; `SectionCard`/`Tag` stay only where un-migrated.
