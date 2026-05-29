# Claude-Design-led redesign — BRAINSTORM kickoff (2026-05-28)

Paste-ready context to open this in a **fresh** Claude Code session. This is the last gate before the redesign becomes an Active sprint (PRODUCT.md § Active Sprints #5).

## ⚠️ THIS IS A BRAINSTORM SESSION — DO NOT EXECUTE

Default mode = **think with Chris, ask, don't ship.** The autonomy rule does NOT apply — this is interpretive scoping work where Chris's audio is the load-bearing signal (per [feedback_grilling_vs_executing_distinction.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_grilling_vs_executing_distinction.md)). No code, no migrations, no plan-mode-to-implementation. **The only deliverable is a scoping doc** that decides the open questions below and proposes a sprint structure — it feeds *plan → roadmap*, it is not itself a plan to execute. Chris's framing for the whole brainstorm tier: "separate brainstorms that feed into plan that feed into roadmap."

Consider opening with the `product-management:brainstorm` (or `product-brainstorming`) skill, or just run it as a long-form interview. Either way: surface 2-3 options per fork with tradeoffs + a recommendation, let Chris's audio drive the call.

## Why now — trigger state

The redesign has three gates (PRODUCT.md § 5). Two are now met:
1. ✅ **Writing-path surface polish series complete** (sub-sprints 1-4, closed 2026-05-27 — all in-app human-write surfaces deprecated; claude.ai → MCP → Claude Code is the sole writing path).
2. ✅ **Read-path surface polish series complete** (4a-4f, closed 2026-05-28 — green-bean / roasters / brews / cultivars / terroirs / processes detail + index surfaces all audited and polished; the app now has the right informational scaffolding to *redesign*, not patch).
3. ⬜ **This brainstorm** — the last gate. Running it + producing the scoping doc is what promotes the redesign to an Active sprint.

The sequencing was deliberate (Chris, Sprint R): polish the read-path FIRST so the redesign has correct information architecture to work from, rather than redesigning over scaffolding that's about to change.

## Source inputs (where this came from)

- **Sprint R input #8:** Chris has a design system **already built via claude.ai/design** — an authored design system that lives outside the app today. The redesign is largely about merging that authored system INTO the app.
- **Sprint R input #9 + Group F Round 2 audio:** Chris's own framing — *"whole other brainstorming session... decide if multiple sprints or one mega sprint... designed with mobile reconstruction in mind, so probably gonna end up being a much bigger thing."*
- PRODUCT.md § Design System (current token map / palette / type scale / primitives) + § Active Sprints #5 + § Brainstorms to schedule ("Claude-Design redesign sprint planning").

## Open questions to decide (the brainstorm's job)

1. **Multi-sprint vs one mega-sprint?** Chris leans "probably a much bigger thing." Decide the decomposition: per-surface sprints (mirror the polish series structure that just worked), per-layer (tokens → primitives → pages), or a single mega-sprint. Tradeoffs: the 4a-4f series proved per-surface incremental shipping works well here; a mega-sprint risks a long-lived branch.
2. **Mobile reconstruction — concurrent or after?** The app is **desktop-primary** today (the standing design convention). Does the redesign rebuild mobile in lockstep, or desktop-first then a mobile pass? This is entangled with Q3.
3. **Revisit the desktop-first rule.** The convention ("Desktop is the primary design target; mobile must not regress") predates the workflow shift: **brewing-side workflow now lives in mobile claude.ai** (Chris reads/works brew sessions on his phone; the in-app write surfaces are gone). So the app is increasingly a *read/reference* surface on mobile + a *richer reference* surface on desktop. Does desktop-primary still hold, flip to mobile-primary for the reference-reading job, or go genuinely responsive-equal? This is arguably THE foundational call — it shapes everything downstream.
4. **Authored design system → app merge sequencing.** How does the claude.ai/design system land in `tailwind.config.ts` + `app/globals.css` + the primitive components? Token-first (land the new palette/scale, then re-skin), or component-first? What's the migration story for the existing token families (chrome tokens, semantic palettes in `lib/*-colors.ts` / registries, the temporal-salience tokens)?

## Context the fresh session needs (it won't have this conversation)

- **App state:** Next.js 14 App Router, server-components-default. All read + write surface polish is DONE. Pages: `/brews` (+ detail), 4 aggregation surfaces (`/terroirs` `/cultivars` `/processes` `/roasters`, each index + detail), `/green` (5 lifecycle-state-driven detail shapes). No in-app forms — MCP-only writes.
- **Design system today (the thing being replaced/extended):** tokens in `tailwind.config.ts` + `app/globals.css`; type scale `text-chip`(8px) → `text-2xl`(24px), no display type; chrome tokens (`latent-fg/bg/mid/...`) + temporal-salience tokens (`latent-{cup,roast,resolved}-emphasis`); semantic color helpers one-per-system in `lib/*-colors.ts` + registries. Full map in PRODUCT.md § Design System. Conventions in CLAUDE.md § Design conventions + [feedback_design_conventions.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_design_conventions.md) (desktop-first, hue-not-lightness, all-content-on-card, one-color-helper-per-system, the new app-wide confidence-bar rule).
- **Primitives that exist** (the redesign re-skins these, shouldn't reinvent them): `SectionCard`, `Tag`, `TagLinkList`, `StrategyPill`, `FlavorNotesByFamily`, `CollapsibleBlock` (collapse-by-default everywhere post-4e), `RecipeTable`, `ProcessCoffeesList` (10+expand post-4f), `confidenceFor` (lib/confidence.ts, the one confidence-bar helper post-4f).
- **Deferred-into-redesign items already flagged:** brew-list/card unification across aggregation pages (flagged low-priority across 4b/4e → "belongs to the broader Claude-Design redesign"); phone-scope mobile full passes (deferred from every read-path sub-sprint as desktop-primary).

## Docs to load at session start

- PRODUCT.md — § Design System + § Active Sprints #5 + § Brainstorms to schedule
- CLAUDE.md — § Design / UX conventions
- [feedback_design_conventions.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_design_conventions.md)
- Chris's authored design system from claude.ai/design (Chris brings this in — it's the primary input, not in-repo)

## What "done" looks like

A scoping doc (likely `docs/features/claude-design-redesign-scope-<date>.md`) that: (a) answers Q1-Q4 with Chris's ratified calls, (b) proposes the sprint decomposition + sequencing, (c) names the token/primitive migration strategy, (d) lists what's in/out of the first sprint. Then the redesign promotes from § Active Sprints #5 (queued) to Active, and a separate plan-mode sprint executes against the scope doc.
