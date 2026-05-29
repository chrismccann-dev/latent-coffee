# Claude-Design-led redesign — SCOPING DOC (2026-05-29)

Output of the redesign **brainstorm** session (kickoff: [claude-design-redesign-brainstorm-kickoff-2026-05-28.md](../sprints/claude-design-redesign-brainstorm-kickoff-2026-05-28.md)). This doc answers the four open questions with Chris's ratified calls, proposes the sprint decomposition + sequencing, and names the token/primitive migration strategy. **It feeds plan → roadmap; it is not itself a plan to execute.** No code, no migrations were written in the brainstorm.

Running this session + producing this doc is the **third gate** (§ Active Sprints #5). With it met, the redesign promotes from QUEUED to an Active sprint, and separate plan-mode sprints execute against this scope.

## Provenance — the design input

The primary input is Chris's authored design system from **claude.ai/design**, delivered as two handoff bundles:

1. **`Latent - Design System v2.html`** + `subpage-*.jsx` + the three `HANDOFF - *.md` docs — the full v2 system (8 sections: §01 Tokens → §08 Handoff/Roadmap). Covers nav, 5 index archetypes, brew + 4 sibling detail pages, the green 5-state lifecycle dispatcher, a component reference, and a 10-step migration order.
2. **`Latent - Mobile Handoff (390).html`** + `mobile-handoff.css` + revised `subpage-green.jsx` — the round-trip output produced *during this brainstorm* to land the mobile-primary companion-surface artboards (see § Mobile-primary surfaces).

**Bundle location (parked 2026-05-29):** `~/Documents/Latent Coffee Design System/Latent Design System - Full/project/` (exported from claude.ai/design — *not* mirrored into the repo, per the design-workspace convention in PRODUCT.md § Design System). All spec files verified present: `Latent - Design System v2.html` (§01 tokens + §07 components), `subpage-*.jsx` (the `Ssp*` family), `mobile-handoff.css` + revised `subpage-green.jsx` (verified cupping reflow), `Latent - Sub Page System v1.html` (host `.ssp-*` CSS). This scope doc captures the **decisions**; the bundle holds the **pixel specs**. (The `/tmp` copies the brainstorm fetched are ephemeral — the `~/Documents` path is canonical.)

## Governing principle (Chris-locked)

> **The v2 system is a source to pull from and adapt into Latent's framework — not adopted carte blanche.**

Every naming/structure decision downstream is governed by this. Where v2's medium (CSS-var token names, prototype component names, babel-mounted demos) diverges from Latent's conventions (Tailwind tokens, `lib/*-registry.ts` source-of-truth, React server components), **Latent's framework wins** and the coding agent reconciles names at build time. Naming reconciliation is *not* round-tripped through claude.ai/design — the coding side holds the canonical names.

## The four questions — ratified

### Q3 (foundational) — desktop-primary default + named mobile-primary "workflow-companion" surfaces

The old convention ("desktop is the primary target; mobile must not regress") predates the workflow shift: brewing-side writing now lives entirely in mobile claude.ai, so the app is a read/reference surface, much of it phone-read. Ratified resolution:

- **Default: desktop-primary, mobile-must-not-regress** for reference/study surfaces (aggregation pages, indexes, resolved lots, archive reading).
- **Exception: "workflow-companion" surfaces are mobile-primary** — pages whose moment-of-use is physically *at a station* with the phone in hand:
  1. **`/brews/[id]` recipe** — phone at the brew bench.
  2. **`/green/[id]` waiting-for-cupping** — phone at the cupping table, V-set in front.
  3. **(soft) `/green/[id]` waiting-for-roast** — usually desktop, so a strong mobile pass rather than mobile-first.

The decision is defensible by **job**, not by guess — same logic that made the read-path series (4a-4f) work.

### Q2 — mobile concurrent or after? Resolved by Q3: **per-surface, not global.**

Mobile-primary companion surfaces are designed mobile-first **concurrently** (the primary device is an upstream layout decision, can't be bolted on after). Desktop-primary surfaces take desktop-first + a mobile pass **folded into that surface's own sprint**, with a light closing **mobile regression sweep** as a checkpoint (not a separate big mobile sprint).

### Q1 — decomposition: **Option 2 — foundation-first + per-surface, companion surfaces ordered first.**

The hard constraint that shapes this: **token migration is intrinsically global.** The moment new tokens land in `tailwind.config.ts` + `globals.css`, every page re-skins at once (the whole app consumes the same tokens + one-helper-per-system palette files). Pure per-surface (mirroring 4a-4f) is therefore impossible for the *token* layer; it works fine for the *layout* layer. Mega-sprint (one branch) carries the flagged long-lived-branch risk. So:

- **Sprint 0 — Foundation.** v2 tokens (+ back-compat aliases) → build the new shared `Ssp*` / `.blk` / `.hero` primitive family → re-skin nav → introduce container-query infra. *Medium-heavy* (primitives are **rebuilt**, not recolored — see § Primitive migration).
- **Sprints 1..N — per-surface**, mirroring the 4a-4f cadence, on the now-stable token + primitive base. **Order: the two mobile-primary companion surfaces first** (brew detail + green lifecycle — highest daily-phone use + most net-new design work), then roasters / cultivars / terroirs / processes, then the `/green` index.
- Convergence check: this *is* the design's own §08 migration order ("each step shippable on its own") — foundation + per-surface.

### Q4 — token/primitive migration: **token-first, then primitive rebuild, then pages.**

Token-first sequences correctly (the new primitives consume the new tokens), but be honest about scale: "component" work here is a **rebuild of the primitive family** (the `.ssp-*` lab-document vocabulary), not a recolor — so Sprint 0 carries both tokens *and* the new primitive library. Adopt v2 §08's migration detail: **keep `--acc-amber` / `--acc-lavender` / `--acc-green` etc. as back-compat aliases; new code uses the semantic names.**

## The five ratifications

| # | Call | Decision |
|---|---|---|
| 1 | **Scope boundary** | First redesign arc = re-skin **existing** surfaces only. `/producers` + `/experiments` + homepage spin out as their own later work (the design itself marks them "still open"/future). |
| 2 | **Coffee-card titles** | Adopt v2's **mono** treatment for card variety/lot names (brew-card 18px mono, lot-card 17px mono). A deliberate change from the current "title-case sans for coffee names" convention. Detail-page `<h1>` titles stay sans (v2 hero h1 = sans 22px). |
| 3 | **Responsive infra** | Adopt **container queries** (`@container`, not `@media`) + the **390 / 1024 two-point model** (drop the hard 768 tablet breakpoint). Anchor 390 + 1024; tablet falls out of fluid container behavior + a spot-check. Sprint 0 carries the one-time container-query infra introduction (Tailwind `@container` plugin or raw CSS in `globals.css`). |
| 4 | **Semantic palettes home** | Keep the registries in `lib/*-colors.ts` as **source-of-truth** (tied to validation + the hue-separation rule). Re-derive hex from v2; mirror chrome-layer tokens as CSS vars where useful. Do **not** move the semantic palettes wholesale to CSS vars. |
| 5 | **Resolved tile** | Adopt v2's **green→roasted-brown** lifecycle metaphor: resolved tile goes roasted-brown (`#3a2418`) instead of today's near-black `latent-fg`. Completes the green-coffee → roasted-coffee gradient (grey → sage → olive-bronze → brown). |

## Mobile-primary companion surfaces (the Q3 detail + verified design output)

The two companion surfaces' critical-path stacks were locked in the brainstorm, then a claude.ai/design round-trip produced the 390px artboards. Verified against the round-trip's `subpage-*.jsx`:

**`/brews/[id]` (brew detail) — already aligned, no round-trip needed.** `BrewDetailPolished` stacks recipe-first in tier order at every viewport: Hero → **T1 Reference Brew Recipe** → T2 Presentation → T3 Peak Expression → T4 Coffee Overview / What I Learned / Additional Information. Mobile = `order-*` reordering of the same blocks.

**`/green/[id]` waiting-for-cupping — round-trip delivered, verified.** Critical-path stack at 390px:
- **T1 (lead):** Producer Notes (lot-level prose, "taste against this") + **Taste-for as stacked slot cards** (one card per V-set slot: label + action-verb taste line, lavender `state-cup` chrome). *Not* a transposed table row.
- **T2 (informational):** Primary Question (lot-level) + Roast Actuals (**demoted**, table shape kept, `state-roast`).
- **T3 (collapsed "Reference & Detail"):** reference signals · slot predictions (original vs updated) · green-bean info · roast log · experiment journey.
- **Desktop (≥520px crossover) preserved byte-for-byte** — the transposed Cupping Hypothesis table leads, exactly as before. `deriveStage2Slots` flattens existing `cupHypoCols` data into per-slot records — **no new data, no schema change.**

**Per-surface mobile pattern rule (a scope decision this surfaced):**
- Use **`order-*` reordering** (single component tree) where mobile is a *resequencing* of the same blocks (brew detail).
- Use a **container-query dual-subtree reflow** (`.s2-desktop` / `.s2-mobile`, both in DOM, one revealed by `@container`) where mobile needs a *genuinely different composition* (cupping: transposed table → slot cards — you can't `order-*` from a table to cards).
- Both are no-`@media`, consistent with ratification #3.

The `taste_for` field's tight action-verb format (shipped green-bean Sub-sprint 4a Bundle C, going-forward) is what makes the slot-card lead clean — the redesign inherits it.

## Token migration — divergence summary (Sprint 0 input)

Fonts unchanged (Inter + JetBrains Mono). The rest:

| Layer | Today | v2 | Migration |
|---|---|---|---|
| Neutrals | cool near-white (`bg #FAFAFA` / `fg #1A1A1A`) | **warm paper** (`bg #F2F1EC` / `fg #0E0E0E` + new `paper #FAFAF7` / `surface #FFF` / `hairline #EDEBE5`) | mechanical re-map; affects every surface |
| Accents | single sage chrome | **5 flavor accents** (green/coral/teal/amber/plum, each w/ `-bg` + `-br`) — labels/chips/dots only | additive; new token family |
| Semantic chrome | `latent-{cup,roast,resolved}-emphasis` | amber / **lavender** / green, same three roles **+ new `--archive-emphasis`** | clean 1:1 map + 1 addition |
| Lifecycle tiles | ad-hoc (`accent-light` / `fg` / `mid`) | **4 formal tokens** grey → sage → olive-bronze → roasted-brown | formalize; resolved goes brown (ratification #5) |
| Type scale | `text-chip` 8px → `text-2xl` 24px, 14px body | same intent, 13px body, **card titles mono** | re-map scale; ratification #2 |
| Family / strategy / process colors | `lib/*-colors.ts` (TS, source-of-truth) | CSS vars (`--fam-*` / `--strat-*` / `--proc-*`) | **stay in TS** (ratification #4); re-derive hex |
| Spacing | Tailwind defaults | explicit `--s1..--s8` (4/8/12/16/22/32/48/64) "used loosely" | mostly compatible; `22/48/64` are non-standard steps |

## Primitive migration — the heavy part of Sprint 0

The `.ssp-*` "lab-document" family is **net-new component structure, not re-skinned primitives.** It replaces today's `SectionCard` / `Tag` / `TagLinkList` rather than recoloring them. New vocabulary (fully spec'd in the bundle `subpage-*.jsx` + v2 §07 component reference):

- `SspTopBar` (black mono strip, per-page kind badge) · `SspNamePlate` (plum-edged plate, per-page meta keys) · `SspShead` (hairline-prefixed section head + optional right-aligned context) · `SspRecipeHead` / `SspKVStrip` (dark mono key-value strip) · `SspTimeline` (brew-specific, time/label/desc) · `SspFlavorAxis` (4-cell categorical, teal/coral/amber/plum) · `SspStructure` (label-row + chip-row) · `SspIdentGrid` (5-cell tabular metadata, highly reusable across siblings) · `Chip` (5 tones) · `.blk` / `.blk.dark` (accent top-stripe blocks) · `.hero` (cover + 3px accent bar) · `details.ssp-coll` (Additional Information collapse).
- Mapped to React server components in Latent's `components/` — lift the visual output, not the prototype's babel-mount structure (per the bundle README: "recreate pixel-perfectly in whatever technology fits; don't copy the prototype's internal structure").

## IA convergence note (why this is low-risk)

v2 §03 lists six "load-bearing" IA principles — **all six are already shipped in Latent**: read-only/MCP-only chrome · above-the-fold = the job · lifecycle drives color · three semantic chrome roles · the lot (not the roast) is the unit · transposed tables for design intent. The redesign is a **visual/chrome re-skin on an IA that is already correct** — which is exactly why the read-path polish series ran first. The design also independently derived the T1-T4 critical-path tiers + mobile-collapse rule we locked in the brainstorm.

## In / out of the first redesign arc

**In:**
- Sprint 0 foundation (tokens + aliases + new primitive family + nav re-skin + container-query infra).
- Per-surface re-skins of existing surfaces: brew (index + detail), 4 aggregation surfaces (index + detail each), `/green` (index + 5 lifecycle detail shapes via the dispatcher), header/nav.
- The two mobile-primary companion surfaces' mobile-first treatment.

**Out (deferred to their own later work — the design's "still open" / future bucket):**
- `/producers` detail page (mirror the `/roasters` polished scaffold; new route).
- `/experiments` cross-lot queryable corpus (no design yet; needs its own scoping).
- Homepage (logged-in root is still a login stub; v2 sketches a recent-brews + active-lots + directed-synthesis shape — "bundle with the redesign sprint when active sprints clear").
- Per-roast Reflections drill-down v2 chrome carry (roast-emphasis stripe) — small follow-on.

## Cross-system implications (six-actor preview — full traces happen per implementation sprint)

This redesign is substrate-touching (tokens, primitives, conventions). Per-sprint, the implementation work will need to trace:
- **Actor 6 (schema/UI/registries):** `tailwind.config.ts` + `globals.css` tokens; new `components/Ssp*`; `lib/*-colors.ts` hex re-derivation (values only — the registries stay source-of-truth).
- **Actor 5 (Claude Code docs):** **PRODUCT.md § Design System** is the biggest update surface (palette / type scale / primitives / iconography / surfaces sections all shift); **CLAUDE.md § Design / UX conventions** (the desktop-first rule → workflow-companion framing; container-queries; the per-surface mobile-pattern rule); **`feedback_design_conventions.md`** memory (the desktop-first entry needs the Q3 refinement). No MCP Tool / Resource / prompt surface changes (this is render-layer only) — Actors 2/3/4 are largely no-ops, but confirm per sprint.
- **Actor 1 (Chris):** each surface previewed at 390 + 1024 before ship (the companion surfaces mobile-first).

## Open items

- Design bundle parked at `~/Documents/Latent Coffee Design System/Latent Design System - Full/project/` (verified present) — implementation sprints read the specs from there.
- **520px crossover** — the cupping dual-subtree switches at 520px (between the 390 mobile anchor + 1024 desktop). Sensible; flagged so it's a known value, not drift.
- **Container-query infra choice** — Tailwind `@container` plugin vs raw CSS in `globals.css`. Decide in Sprint 0 plan-mode.
- The design's own "still open" list (producers / experiments / homepage / per-roast reflections chrome) — tracked as future work, not first-arc.

## Next steps

1. Promote the redesign from PRODUCT.md § Active Sprints #5 (QUEUED) to **Active**; mark gate #3 met.
2. Open a plan-mode sprint for **Sprint 0 (Foundation)** against this scope.
3. Then per-surface plan-mode sprints, companion-surfaces-first, mirroring the 4a-4f cadence.
