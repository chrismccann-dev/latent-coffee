# Sprint 0 — Redesign Foundation — KICKOFF BRIEF (2026-05-29)

Paste-ready brief to open in a **fresh** Claude Code session. First execution sprint of the Claude-Design-led redesign (PRODUCT.md § Active Sprints #5).

## ⚙️ THIS IS AN EXECUTION SPRINT — the autonomy rule applies

Scope is concrete (this brief + the scope doc). Plan-mode first (the scope is interpretive in spots — see Open Questions), then execute the approved plan as one flow: commit + push + PR + merge autonomously when verification passes. Per [feedback_autonomy.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_autonomy.md). This is **not** a brainstorm — the brainstorm (which produced the scope) is done.

## Read first

- **[docs/features/claude-design-redesign-scope-2026-05-29.md](docs/features/claude-design-redesign-scope-2026-05-29.md)** — the governing scope. Q1-Q4 + the 5 ratifications + token/primitive migration strategy.
- **The design bundle** at `~/Documents/Latent Coffee Design System/Latent Design System - Full/project/` (parked from claude.ai/design 2026-05-29; verified present). Pixel specs live here:
  - `Latent - Design System v2.html` — **§01 Tokens** (the `:root` block) + **§07 Component Reference**.
  - `subpage-system.jsx` — the `Ssp*` component definitions + the `.ssp-*` CSS (in the host `Latent - Sub Page System v1.html` `<style>` block).
  - `mobile-handoff.css` + revised `subpage-green.jsx` — the verified cupping mobile reflow (for reference; the cupping surface itself ships in its per-surface sprint, not Sprint 0).
- CLAUDE.md § Design / UX conventions + PRODUCT.md § Design System (the surfaces this sprint updates).

## Goal

Land the v2 design-system **foundation** so every existing page inherits the new visual language with **zero layout reorganization**, and the per-surface sprints have a stable token + primitive base to build on. The big-bang is intrinsic (tokens are global) and bounded to chrome.

## Success criteria (concrete)

1. v2 tokens live in `tailwind.config.ts` + `app/globals.css`, with v2's prescribed **back-compat aliases** (`--acc-amber` etc. → semantic names).
2. The new shared primitive family exists in `components/` (RSC, lifting visual output not the prototype's babel structure).
3. Nav re-skinned to the v2 shape.
4. Container-query infra introduced (decision in plan mode — see Open Questions).
5. `lib/*-colors.ts` hex values re-derived from v2 (values only — registries stay source-of-truth per ratification #4).
6. `npm run build` green (and `npx tsc --noEmit` in the main repo per build-hygiene).
7. **Every existing route renders correctly at 390 + 1024** with the new palette/type — no page broken, no layout reorganized. This is the Sprint-0 acceptance test: the look propagates via tokens + primitives; pages are not yet re-composed.
8. Docs updated (see Cross-system audit).

## Scope — IN

- **Tokens** (warm neutrals `bg #F2F1EC` / `fg #0E0E0E` + `paper`/`surface`/`hairline`; 5 flavor accents green/coral/teal/amber/plum each w/ `-bg`+`-br`; semantic chrome amber/lavender/green + new `--archive-emphasis`; 4 lifecycle tiles grey→sage→olive-bronze→roasted-brown `#3a2418`; type scale w/ mono card titles per ratification #2; spacing `--s1..--s8`). Keep aliases.
- **New primitive family**: `SspTopBar`, `SspNamePlate`, `SspShead`, `SspKVStrip` (a.k.a. `SspRecipeHead`), `SspFlavorAxis`, `SspStructure`, `SspIdentGrid`, `Chip` (5 tones), `.blk` / `.blk.dark`, `.hero`, `details.ssp-coll`. Build the family; see Open Questions for the SectionCard/Tag coexistence call.
- **Nav re-skin** — centered destinations + invisible `.nav-tail` spacer (the `+ ADD` button is already gone). Do **not** wire `/producers` + `/experiments` routes (deferred); decide whether to reserve nav slots (Open Questions).
- **Container-query infra** + the 390/1024 model (drop the 768 tablet breakpoint) per ratification #3.
- **`lib/*-colors.ts` hex re-derivation** from v2 (brew/extraction/process/flavor/roaster/country/cultivar-family + temporal-salience). Registries stay the source-of-truth; only hex values change.

## Scope — OUT

- Any **per-surface layout/IA reorganization** — that's Sprints 1..N (companion-first: brew detail + green lifecycle, then roasters/cultivars/terroirs/processes, then `/green` index).
- The **companion-surface mobile reflows** (brew recipe-first; cupping slot-cards) — land in the brew + green per-surface sprints, using the verified `subpage-green.jsx` reflow as the spec.
- `/producers`, `/experiments`, homepage (deferred to their own later work).

## Files likely to touch

- `tailwind.config.ts`, `app/globals.css` (tokens + container-query infra + `@apply` primitives).
- `components/` — new `Ssp*` family + `Header.tsx` re-skin.
- `lib/*-colors.ts` (hex values).
- `package.json` (only if adopting the Tailwind `@container` plugin).
- Docs (below).

## Verification plan

- `npm run build` + `npx tsc --noEmit` in the main repo (`/Users/chrismccann/latent-coffee`) per build-hygiene (the worktree lacks `@anthropic-ai/sdk`; symlink trick or main-repo proxy).
- `preview_start` → screenshot **every existing route** at **390 + 1024** (`preview_resize`). Confirm new palette/type propagated, nav re-skinned, nothing broken, no layout reorg. Index + detail for: `/brews`, `/terroirs`, `/cultivars`, `/processes` (+ sub-page kinds), `/roasters`, `/green` (+ the 5 lifecycle shapes).

## Cross-system audit (six-actor)

- **Actor 6** (schema/UI/registries): tokens, new `components/Ssp*`, `lib/*-colors.ts` hex. No schema/migration (render-layer only).
- **Actor 5** (Claude Code docs): **PRODUCT.md § Design System** is the largest update (palette / type scale / component primitives / iconography / surfaces all shift); **CLAUDE.md § Design / UX conventions** (desktop-first → workflow-companion framing; container queries + 390/1024; the per-surface mobile-pattern rule `order-*` vs dual-subtree); **`feedback_design_conventions.md`** memory (the desktop-first entry gets the Q3 refinement).
- **Actors 2/3/4** (prompts / claude.ai / MCP): expected **no-op** — this is render-layer only, no Tool/Resource/prompt/vocabulary change. Confirm and state the skip explicitly.
- **Actor 1** (Chris): preview at 390 + 1024.

## Open questions for plan mode

1. **Container-query infra:** Tailwind `@container` plugin vs raw CSS `@container` in `globals.css`? (Lean: whichever keeps the token/utility story cleanest; the design uses raw `@container`.)
2. **Primitive coexistence:** do the new `Ssp*` primitives **replace** `SectionCard` / `Tag` / `TagLinkList` outright in Sprint 0, or do those stay until each surface migrates? Recommendation: build the new family + re-skin only the truly-global chrome (nav, `.label`, the `.section-card` base treatment) in Sprint 0; let per-surface sprints swap page-level composition — avoid a half-migrated `SectionCard`. Confirm.
3. **Nav slots:** reserve `/producers` + `/experiments` nav slots now (200-OK stubs) or wait until they have content? (v2 anticipates them; the routes are deferred.)
4. **Alias direction:** keep the existing `latent-*` token names as aliases pointing at new values, or introduce v2's names + alias the old → new? (v2 §08 prescribes keeping `--acc-*` as aliases; reconcile with Latent's `latent-` prefix convention.)
