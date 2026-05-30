# Redesign Sprint 5 — Aggregation detail-page re-skin (roasters / cultivars / terroirs / processes) — KICKOFF

Fifth surface of the Claude-Design redesign (PRODUCT.md § Active Sprints #5). Re-skins the **4 aggregation detail-page families** — the last detail surfaces still on legacy `SectionCard`/`Tag` chrome — to the `Ssp*` lab-document family, in the agreed order **roasters → cultivars → terroirs → processes**. Chris greenlit doing **all four in one sprint** (PR-per-surface).

Execution sprint — **plan-mode first** (the migration-approach + scope-split calls below), then ship autonomously per the autonomy rule. IA is preserved on every page (chrome re-skin only).

## Why now
Sprint 4 closed the `/green` seam — `/brews/[id]` + all 5 `/green` views are `Ssp*`. The 4 aggregation detail pages are the **last un-migrated detail surfaces**, and (confirmed 2026-05-29) the shared chrome they use — `SectionCard`, `Tag`, `TagLinkList`, `FlavorNotesByFamily`, `CollapsibleBlock`, `SynthesisCard`, `ProcessCoffeesList`/`ProcessBreakdownRow`/`ProcessConfidenceCard` — is now used **exclusively by these 4 families** (8 page files + their chrome components). Nothing in `/brews/[id]` or `/green` touches them anymore. So the shared-primitive work amortizes across all 4 and **leaks nowhere** — the same property that made the green seam clean. After this sprint `SectionCard` + `Tag` are fully dead → delete them.

**Posture shift from Sprints 1-4:** these are **desktop-primary reference surfaces** (sourcing/study, not phone-at-a-station), so mobile is **must-not-regress**, not mobile-first. No dual-subtrees expected — `order-*`/single-tree reflow per the per-surface rule. Spot-check **390 + 1024**; 1024 is primary.

## ⟦Decide first in plan-mode⟧

### 1. Scope split (recommend: one sprint, PR-per-surface)
- **PR1 — Foundation + roasters.** Re-skin the shared aggregation chrome (below) + the **roasters** page (simplest, the warm-up). Re-verify roasters at 1024 + 390.
- **PR2 — cultivars.** **PR3 — terroirs.** **PR4 — processes** (the long pole — 6 page-kinds: base hub / honey-subprocess / modifier-combo / modifier-index / signature + the index; its own PR last).
Same shape as Sprint 4's two-PR split; foundation lands in PR1 so PR2-4 are page-composition swaps. (Alt: bundle all in one PR — larger blast radius, harder to verify the processes family. Not recommended.)

### 2. Migration approach (recommend: swap + re-skin-in-place hybrid, then delete the dead legacy)
The redesign model = **pages swap their composition to `Ssp*`; legacy primitives die when their last consumer migrates.** These ARE the last consumers, so:
- **Page-level `SectionCard` wrappers → swap directly** to `.ssp-card` + `<SspShead>` in each page (like the green views did).
- **Content-logic components** keep their name + logic but render `Ssp*` chrome internally (re-skin in place, since they're aggregation-exclusive): `TagLinkList` (cross-link blocks — `Tag`→`Chip`, wrapper→`.ssp-card`/bare), `FlavorNotesByFamily` (family-grouped notes — `Tag`→`Chip`, keep `getFamilyColor` family labels), `CollapsibleBlock` → `.ssp-coll` (direct analog of the `CollapsibleSection`→`.ssp-coll` move from Sprint 4), `ProcessCoffeesList` / `ProcessBreakdownRow` / `ProcessConfidenceCard` (processes-specific — re-skin to `Ssp*`; keep the 10+expand `<details>` logic + confidence thresholds).
- **`SynthesisCard`** (the one `'use client'` component — regenerate button + auto-regen effect): swap its `<SectionCard>` for `.ssp-card` + `<SspShead>`, **keep all client logic**. See call #3.
- **Confidence card** (`SectionCard dark` via `lib/confidence.ts` `confidenceFor`) → `.ssp-card.dark` (exists in globals.css) or `.blk.dark`; keep the shared `confidenceFor` thresholds (5+ HIGH / 2-4 MED / 1 LOW — do NOT re-inline).
- **End the sprint by deleting `components/SectionCard.tsx` + `components/Tag.tsx`** (zero consumers left) + dropping their imports. This is the final death of the legacy chrome family — the headline cleanup of the sprint.

### 3. SynthesisCard mobile split (recommend: keep at `md:`, note it)
`SynthesisCard` renders short-form `<md:` and long-form `md:`+ via `md:hidden`/`hidden md:block` (Tailwind `@media`, 768px) — the *only* `@media` breakpoint left in the migrated surfaces, and it rubs against the redesign's "container-query, 390/1024, no-768" model. But it's a **content switch** (mobile gets the digest), not layout reflow, so the simplest faithful call is to **keep the `md:` short/long split** and just re-skin the card chrome around it. Flag in the plan; convert to container-query only if it reads wrong at the crossover.

### 4. Hero swatches
Each page has a colored hero swatch from its semantic palette — roaster family (`lib/roaster-registry.ts` `getFamilyColor`), cultivar family (`lib/cultivar-family-colors.ts`), country (`lib/country-colors.ts`, terroirs), process family/axis (`lib/process-axis-colors.ts` / process-registry). Map each to `<SspNamePlate coverColor={...}>`. **These keep Latent's hues** (semantic palettes were not re-derived in v2).

## Scope (in)
The 4 detail-page families (IA preserved per the CLAUDE.md § Roasters / Cultivars / Terroirs / Processes bullets — chrome re-skin only):
- **roasters/[slug]** — 9 sections (Hero → Brewing Philosophy → Roasting Philosophy → Reference Brew Recipe 2-col grid → Resting Info → Coffees list → Synthesis → Additional Information collapse → Confidence). The 2-col label/value grids (`<LabelledField>`) → `.ssp-ident` (5-cell tabular) or `SspProseRows`; the Baseline Recipe inline composition stays.
- **cultivars/[id]** — 9 sections (Hero → Genetic Background → Cultivar Context grid → Brewing & Cup Profile grid → Roasting Characteristics grid → Synthesis (conditional ≥2 brews) → Coffees list → Additional Information collapse → Confidence). The `<GridField>` 2-col grids → `.ssp-ident`/`SspProseRows`.
- **terroirs/[id]** — 10 sections (Hero → High Level Summary → Meso tags → Terroir Context → Terroir Character → Typical Production → Synthesis → Coffees list → Additional Information collapse → Confidence). Only page using `Tag` directly (meso cluster) → `Chip`.
- **processes/** — 6 page-kinds. Base hub + honey-subprocess + modifier-combo + modifier-index + signature each: Hero → breakdown rows (`ProcessBreakdownRow`) → `ProcessCoffeesList` (10 + `<details>` expander) → Additional Information collapse → Confidence (`ProcessConfidenceCard`). Base hubs also render authored `summary` + `brewArchetype`. Watch the `ProcessAdditionalInfo` inline block (per § 4f it's inlined across 5 process pages — re-skin in place; the deferred extraction is a separate grilling-queue item, don't fold it in).
- **Coffees lists** — all 4 surface a book-cover coffees list (`lib/brew-colors.ts` covers). Re-skin the list chrome; covers keep their colors.

## Scope (out)
- `/green` index + `/brews` index — separate later sprints (indexes, not detail pages).
- `/producers` + `/experiments` + homepage — deferred per the scope doc.
- No IA changes (chrome re-skin only). No schema / MCP / registry / prompt changes (Actors 1-4 no-op).
- `ProcessAdditionalInfo` extraction + the F4 arbiter-reminder — already on [docs/grilling-queue.md](../grilling-queue.md), out of scope.

## CSS
Most `.ssp-*` CSS exists (Sprints 0-4). Likely already-present + reusable: `.ssp-card`(+`.dark`), `.ssp-shead`, `.ssp-coll`, `.ssp-ident`, `.ssp-prose-rows`, `.chip`. Check `globals.css` first — may need a small **cross-link chip block** style (for `TagLinkList`) or a **2-col aggregation grid** if `.ssp-ident` (which caps at 5-cell tabular) doesn't fit the longer label/value lists; if so add a named class, don't arbitrary-`[Npx]`.

## Read first
- This sprint's CLAUDE.md § Roasters / § Cultivars / § Terroirs / § Processes (the per-page section maps — authoritative IA)
- The 8 page files under `app/(app)/{roasters,cultivars,terroirs,processes}/` + the shared chrome components (`SectionCard` / `Tag` / `TagLinkList` / `FlavorNotesByFamily` / `CollapsibleBlock` / `SynthesisCard` / `ProcessCoffeesList` / `ProcessBreakdownRow` / `ProcessConfidenceCard`)
- `components/Ssp.tsx` (the target primitives) + the `.ssp-*` block in `app/globals.css`
- The Sprint 4 shipped.md row + retro (`memory/project_redesign_sprint_4_green_shared_components.md`) — the "re-skin the shared collapse primitive once flips every consumer" + "delete legacy when last consumer migrates" patterns

## Verify
- tsc clean (worktree: `ln -sf ../../../node_modules node_modules`, `npx tsc --noEmit`, `rm node_modules`). **Stage changed files explicitly** (`git add <paths>`) — the worktree `node_modules` symlink is NOT gitignored here.
- Preview at **1024 (primary) + 390 (regression)** for each surface: a populated roaster (e.g. Onyx/Sey), a ≥2-brew cultivar (Gesha), a multi-country terroir, and the processes family across **at least base-hub + signature + modifier-index + honey-subprocess kinds** (the 6 kinds share chrome but differ in composition). Confirm SynthesisCard still regenerates + renders (client logic intact) + the confidence card + the Additional Information collapse.
- `/simplify` before each commit (the 4 pages will share a lot of new composition — high dedup surface; expect shared-helper extraction).
- Six-actor: Actor 6 UI + Actor 5 docs (CLAUDE.md § the 4 page sections + PRODUCT.md #5 + shipped.md row + Ssp* family list if a new primitive lands + note SectionCard/Tag deletion); Actors 1-4 no-op. Confirm the "migration window" language can finally drop to "closed for all detail pages; only the indexes remain."

## Sizing
Largest remaining redesign sprint by surface count, but lowest per-surface risk (shared chrome amortizes, IA preserved, desktop-primary). ~1-2 sessions, 4 PRs. Execution sprint — autonomy rule applies post-plan-approval.
