# 0018 — Per-surface mobile pattern: one shared IA, mobile as forcing function

## Context

The redesign arc (Sprints 1-6, 2026-05-29 → 05-30) re-skinned every surface to the `Ssp*` lab-document chrome, and each page had to work at both desktop (1024) and phone (390). Desktop was designed first — it was the surface the redesign was authored against. The open question on every surface was: *how does this same page render well at both widths?*

Two surfaces are genuinely mobile-primary ("workflow-companion" surfaces, used at the bench with no computer): **`/brews/[id]`** (kitchen — pull the frozen single-dose, the recipe block answers "what grind, what temp") and **`/green/[id]` waiting-for-cupping** (cupping table — three V-set roasts prepped at once, the operator references "producer notes + what should I expect from the actuals" while tasting). Rather than design a separate mobile IA for these, the narrow width was used as a **forcing function**: 390px has the least room, so it forced the question "what is the *single most important* information, and in what order?" On the cupping surface that ranking came out as producer-notes + taste-for (primary) → roast actuals (secondary) → everything else (tertiary). That ranking was then pushed *back up* into the desktop surface, so both widths serve one information architecture.

This pattern was applied consistently across the green views (Sprints 1-4) but lived only as prose in CLAUDE.md § Design conventions, so the next surface re-derives it.

## Decision

**One shared IA per surface; mobile is a forcing function, not a second design target.** Derive the priority order from the most-constrained surface, then express *that same order* at every width. There is never a divergent mobile IA — at most, the tertiary tier collapses behind progressive disclosure (a `<details>`) on the narrow width. Desktop and mobile present the same information in the same priority; they differ only in how much of the tail is folded away.

The single shared IA is expressed at both widths using one of **two techniques**, chosen by *how the narrow layout relates to the wide one*:

1. **`order-*` single tree** — when the narrow width is a **resequence of the same blocks**. One copy of each block in the DOM; CSS changes the visual order (or blocks are already in priority order and just stack). This is the default. Used on `/brews/[id]` and `/green/[id]` waiting-for-roast.

2. **Container-query dual-subtree** — when the narrow width needs a **different DOM composition of the same data** that reordering cannot reach. The canonical case: a desktop *transposed table* (rows = attributes, columns = batch slots) that a phone wants as *per-slot cards* (one card per batch, attributes stacked). Two subtrees (`.s2-desktop` / `.s2-mobile`) both live in the DOM; a container query reveals one at the **520px crossover** on `.ssp-page`'s content-box (~552px viewport). Used on `/green/[id]` waiting-for-cupping.

**The decision test:** *same blocks, different order → single tree. Different composition of the same data (blocks split / merged / reshaped) → dual-subtree.* The dual-subtree is a rendering mechanism for one shared IA — it is **never** a license for divergent mobile content.

**Infra:** responsiveness is CSS **container queries** (`@container ssppage`), not `@media` — wrap a page in `.ssp-page` (carries `container-type: inline-size; container-name: ssppage`) to activate. **Two-point model: 390 + 1024.** The 768 tablet breakpoint is dropped. No Tailwind container-query plugin — raw CSS in `globals.css`.

## Consequences

- The dual-subtree duplicates the data in markup. That cost is accepted **only** when the composition genuinely differs at the narrow width; single-tree `order-*` is the default and should be preferred whenever the narrow layout is a reorder.
- Because both subtrees are in the DOM, divergent mobile *content* is a code smell — if the two subtrees carry different information, the shared-IA rule has been violated, not the technique.
- Future per-surface work (including Cluster A surfaces) picks the technique by lookup against this ADR rather than re-deriving it.
- The "mobile as forcing function" principle is captured as a design-convention term (see CLAUDE.md § Design conventions / the partner term to "workflow-companion surface") so it can be invoked by name in future design work.

## Sources

- Redesign Sprints 1-4 (2026-05-29) — the four surfaces the pattern was derived + applied across; see `docs/sprints/project_redesign_sprint_{1,2,3,4}_*.md` retros and CLAUDE.md § Design conventions "per-surface mobile pattern rule" + ratification #3.
- Chris-articulated at the resync grill (2026-05-31): the decision was an information-architecture call, not a technical/mechanical one — mobile was the forcing function to rank information, then desktop was edited to match so the two are one shared IA.
