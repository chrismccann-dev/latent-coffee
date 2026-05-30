# Redesign Sprint 6 — Index-surface re-skin (the index arc) — KICKOFF

Sixth surface-arc of the Claude-Design redesign (PRODUCT.md § Active Sprints #5). With Sprint 5 closed, **every detail surface is `Ssp*` and `SectionCard` + `Tag` are deleted.** The only un-migrated surfaces left in the first redesign arc are the **6 index pages**. This sprint re-skins them to the v2 look on the now-stable token + primitive base.

**Execution sprint** — plan-mode first (the index-treatment call + scope-split below are interpretive), then ship per the autonomy rule. Desktop-primary reference surfaces — mobile must-not-regress, spot-check 390 + 1024 (1024 primary).

## Goal
Re-skin the 6 index pages to the v2 warm-paper / lab-document aesthetic, IA preserved (chrome re-skin only — these are navigation surfaces, not data-model changes). After this sprint the **entire first redesign arc is complete** (`/producers` + `/experiments` + homepage remain explicitly deferred per the scope doc).

## ⟦Decide first in plan-mode⟧
1. **Index treatment — is there an `Ssp*` shape for list/grid indexes, or a new pattern?** The detail-page artboards drove Sprints 1-5; the v2 bundle may or may not have an index/list artboard. **Read [docs/features/claude-design-redesign-scope-2026-05-29.md](../features/claude-design-redesign-scope-2026-05-29.md) + the v2 source FIRST.** Likely outcomes: (a) indexes wrap in `.ssp-page` and reuse `SspTopBar`/`SspShead`/`Chip` + grouped lists styled with existing `.ssp-*` rhythm; (b) a small net-new index primitive lands (e.g. a section-grouped list row). Don't invent chrome — pull from v2 or compose existing `.ssp-*`.
2. **Scope split.** Recommend grouping by shape, not one-PR-each: **PR1** `/green` index (lifecycle-sectioned flat list — the simplest, and the lifecycle-tile gradient already landed Sprint 0). **PR2** the 4 **aggregation indexes** (`/roasters` `/cultivars` `/terroirs` `/processes` — all grouped-header → linked-row lists, near-identical shape; high shared-chrome amortization, likely one shared grouped-list primitive). **PR3** `/brews` index (the book-cover grid + `BrewsFilterBar` — the richest, and the index-card-unification item (§ Longer Term) can finally resolve here). Alt: per-surface (6 PRs — more ceremony, lower amortization). Confirm in plan-mode.
3. **Brew-card unification (PR3).** The `/brews` book-cover grid card vs. the aggregation-index row shapes are the remaining half of the brew-list-unification item (PRODUCT.md § Longer Term, detail-page half resolved by `CoffeesList` in Sprint 5). Decide whether PR3 unifies the index card with `CoffeesList`'s row, or keeps the grid distinct (it's a genuinely different shape — grid of covers vs. list of rows). Likely keep distinct; flag the call.

## Scope (in)
- `/green` index ([app/(app)/green/page.tsx](app/%28app%29/green/page.tsx)) — 4 lifecycle sections (Waiting for next roast / cupping / Resolved / Unresolved) + tile colors per the Sprint 0 lifecycle-tile gradient + the MCP-only empty state.
- `/roasters` `/cultivars` `/terroirs` `/processes` indexes — grouped-header → linked-row lists (family/species/country/base groupings; 0-brew groups hidden per the event-driven rule). The `/processes` index has 3 nav surfaces (Core Portals / Modifier Index / Signature Methods).
- `/brews` index ([app/(app)/brews/page.tsx](app/%28app%29/brews/page.tsx)) + [components/BrewsFilterBar.tsx](components/BrewsFilterBar.tsx) — book-cover grid + the 2-filter bar (Strategy pills + by-roaster popover) + the mobile FILTERS disclosure. Keep the all-content-on-cover card rule.
- [components/Header.tsx](components/Header.tsx) — already re-skinned in Sprint 0 (centered white nav); confirm it still reads right against the re-skinned indexes, no changes expected.

## Scope (out)
- `/producers` + `/experiments` + homepage — deferred per the scope doc.
- No IA / schema / MCP / registry / prompt changes (Actors 1-4 no-op).
- The brew index card ↔ `CoffeesList` row unification is a *decision* in PR3, not a mandate.

## Read first
- [docs/features/claude-design-redesign-scope-2026-05-29.md](../features/claude-design-redesign-scope-2026-05-29.md) — esp. any index/list artboard treatment.
- CLAUDE.md § the 6 index sections (the per-index IA) + § Design conventions (token rules, container-query 390/1024, `.ssp-*` family).
- `components/Ssp.tsx` + the `.ssp-*` block in `app/globals.css`.
- Sprint 5 shipped.md row + retro ([memory/project_redesign_sprint_5_aggregation_detail.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/project_redesign_sprint_5_aggregation_detail.md)) — the "foundation-first PR split amortizes shared chrome" + "screenshot-after-programmatic-scroll is blank at 1024, trust getBoundingClientRect/inspect" lessons.

## Verify
- tsc clean (worktree `ln -sf ../../../node_modules node_modules` → `npx tsc --noEmit` → `rm node_modules`; stage paths explicitly).
- Preview @1024 (primary) + 390 (regression) for each index: `/green` (all 4 lifecycle sections populated), the 4 aggregation indexes (grouped headers + 0-brew hiding), `/brews` (grid responsive shape `1→2→3→4→5` cols + both filters + mobile FILTERS disclosure). Confirm filter server-round-trips still work on `/brews`.
- `/simplify` before each commit (the 4 aggregation indexes will share a grouped-list shape — high dedup; expect a shared primitive).
- Six-actor: Actor 6 UI + Actor 5 docs (CLAUDE.md § the 6 index sections + § Design conventions if a new index primitive lands + PRODUCT.md #5 "index arc complete" + shipped.md row). Actors 1-4 no-op. After this sprint the redesign's first arc is **complete** — note it.

## Sizing
~1-2 sessions, ~3 PRs. Lower per-surface risk than the detail pages (simpler chrome, IA preserved, desktop-primary). The grouped-list amortization across the 4 aggregation indexes is the main efficiency lever.
