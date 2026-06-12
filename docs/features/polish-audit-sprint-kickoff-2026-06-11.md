# Polish Audit Sprint — kickoff brief (2026-06-11)

**Source:** Claude Design polish audit (claude.ai/design, 2026-06-11) — `Latent - Polish Audit.html`, share id `umNlSKVvagWziDGFAAdfCA`. The audit returned 12 ranked execution items + 4 system-level questions. Every factual claim spot-verified against the codebase 2026-06-11 (hardcoded hexes, prop names, thresholds, line sites — all held, re-verified after PR #429 merged). System-level items are grilling-queue 52-54; execution items are this sprint.

**Goal:** Enforce the design system's own ratified rules where implementation drifted — one polish sprint, no new aesthetic. Headline item: invert `SynthesisCard` to short-form-capsule-default at every width, which is the audit-supplied scoping of the parked roadmap entry "Synthesis surface rethink."

**This is a planned-execution brief.** Chris approved the sprint shape 2026-06-11; the autonomy rule applies to Passes 1-4. The GATED items below are NOT approved — they wait on Chris's answers to Q1-Q3 (recorded against grilling-queue items 52-54).

## Scope — in

### Pass 1 — Green lifecycle rebind + topbar dedupe (audit items 02 + 03 + S3)

- Rebind all green detail hero `coverColor`/`edgeColor` sites to the lifecycle tile tokens (`--tile-*`): waiting-roast hardcoded `#A88037` (~line 316), waiting-cupping hardcoded `#7A6E9E` (~line 896), `ARCHIVE_VARIANTS.resolved.tile: '#4A7C59'` → `--tile-resolved` `#3a2418`, unresolved → `--tile-inventory`-adjacent grey, InventoryPlaceholder `#B4B4AE` (~line 2024) → token. Implements the resync-grill 2026-05-31 reconciliation (hero = lifecycle state, consistent index→detail; in-content amber/lavender/green task-salience accents STAY — they are the other color axis and are correct).
- Fix the unresolved index-card contrast bug: near-white text on `--subtle` (#B4B4AE) ≈ 1.9:1. Standardize index + detail on `--mid` per the design-system doc ("unresolved keeps neutral mid").
- Topbar/hero dedupe, 5 surfaces (rule: topbar = identity, hero meta = differentiation, never duplicate):
  - `/brews/[id]` — drop the `Roaster` meta row (topbar already carries it); meta keeps Variety / Producer.
  - `/cultivars/[id]` — drop `Species`; keep Family / Lineage.
  - `/terroirs/[id]` — drop `Country`; keep Admin Region / Elevation / Climate.
  - `/roasters/[slug]` — drop `Family`; keep Location; move `Coffees · N` into the topbar count slot (the CoffeesList shead currently repeats the count a third time).
  - `/green/[id]` active views — lifecycle state renders once: keep the toned StatusPill in the hero, topbar holds lot id + roast count + "Green Lot".
- `SspTopBar` prop rename `brewId/date/roaster` → `id/count/anchor` (`components/Ssp.tsx` + ~12 call sites; zero visual change). The brew-vocabulary props are what invited the misuse the dedupe fixes (`roaster="WAITING · NEXT ROAST"` etc.).

### Pass 2 — Synthesis capsule inversion (audit item 01) — PREVIEW CHECKPOINT before merge

- `components/SynthesisCard.tsx`: render `short_form_capsule` at every width (not just `md:hidden`); long-form essay moves behind a lightweight inline disclosure ("Full synthesis", `.chev`, no extra card chrome); delete the `md:` split (the last `@media` usage on migrated detail surfaces, and at 768 — the dropped breakpoint); NULL-capsule fallback to long-form unchanged (post-migration rows).
- Replace the `animate-spin` loading border (motion-rule violation: "color transitions only") with a static mono `SYNTHESIZING FROM N COFFEES…` line.
- `Regenerate` → `REGENERATE` (the only sentence-case interactive label in the product).
- **Checkpoint:** `preview_screenshot` at 390 + 1024 on one page per aggregation family (terroir / cultivar / process / roaster) before merging this pass — it changes the desktop reading experience of every aggregation page. Roaster-page collapsible treatment unchanged this sprint (see Q5).

### Pass 3 — Mechanical fixes (audit items 05 / 06 / 07 / 08 / 10 / 11)

- Merge `CollapsibleSection` + `CollapsibleBlock` (byte-similar; one component + a `padded` prop, keep both export names). Standardize all expand affordances on `.chev`: CoffeesList's rotating `▾`, the waiting-roast hypothesis-cell `▾/▴` glyph swap.
- `/processes` portal cards: hand-drawn combo chips (`bg-latent-highlight` + `rounded` + `text-chip` 8px — the deleted `.tag` look reborn) → the canonical `Chip` primitive; drop `rounded-md`/`rounded` for the square-to-3px register. Portals stay richer cards otherwise.
- `DetailBackLink` import swap ×5 (`/brews/[id]` + the 4 rendered green views carry inline copies). Snap `tracking-[0.16em]` to the scale: use `tracking-widest` (0.15em) unless the optical delta is visible at preview, in which case add a deliberate `0.16` token and document it.
- `/green` index shell `max-w-6xl` → `max-w-[1200px]` (aligns the card grid with /brews + header).
- Waiting-roast "Additional Information" currently opens to a body that only says deeper detail lives on the resolved view — drop the `details` chrome, render the pointer as one muted mono line (an affordance must not promise content it doesn't have).
- `app/page.tsx` bare `<a href="/login">` → server redirect (authed → `/brews`, else → `/login`). Login/signup header shells `max-w-6xl` → 1200.

### Pass 4 — Doc currency sweep (audit item 12 + decision outcomes)

`docs/design-system.md` + `docs/architecture/page-ia.md` + `globals.css` comments:
- Hover spec: shipped is `translateY(-1px)` + custom soft shadow + 120ms (not `shadow-lg + -translate-y-1 scale-[1.01]` 200ms), and `.green-card` lifts too — "brew-card hover is the one exception" → "index-card hover."
- Count bars: `barBlocks` is absolute-threshold; globals.css + page-ia.md still say "normalized to the page max."
- Shell width: `.ssp-page` is 820px, not `max-w-3xl` (768). The 820 is right — update the doc.
- Unresolved tile: doc says `mid`, index code said `subtle` (resolved by Pass 1).
- Remove the "Known drift: topbar duplicated against the hero" parenthetical once Pass 1 lands.
- Hamburger SVG exception line (pending Q4) + chrome @media exception text (pending Q1).

### GATED — do not ship until Chris answers (grilling-queue 52-54)

- **Audit item 04** (ConfidenceCard 🟢🟡🔴 emoji → 5-block bar, white-fill blocks inside the dark card, keep mono LOW/MEDIUM/HIGH + desc) — gated on **Q3** (queue 54): the `barBlocks` and `confidenceFor` scales must be reconciled in the same change.
- **Q1** (queue 52): chrome @media exception ratification — design-system.md amendment + optional Header/BrewsFilterBar `md:` → `lg:` moves.
- **Q2** (queue 53): `--tile-next-roast` re-derivation off #4A7C59 — one token value, hue picked at preview against the other 3 tile stops.

## Scope — out

New aesthetics, new parallel components, icon libraries, homepage landing-page *design* (redirect only), synthesis pipeline/prompt changes (render-side only), `/producers` + `/experiments` (routes don't exist), roaster-page synthesis rank change (Q5 deferred).

## Files likely to touch

`components/SynthesisCard.tsx` · `components/Ssp.tsx` · `components/CollapsibleSection.tsx` · `components/CollapsibleBlock.tsx` · `components/CoffeesList.tsx` · `components/DetailBackLink.tsx` · `app/page.tsx` · `app/(app)/green/page.tsx` · `app/(app)/green/[id]/page.tsx` · `app/(app)/brews/[id]/page.tsx` · `app/(app)/processes/page.tsx` · `app/(app)/cultivars/[id]/page.tsx` · `app/(app)/terroirs/[id]/page.tsx` · `app/(app)/roasters/[slug]/page.tsx` · login/signup layouts · `app/globals.css` · `docs/design-system.md` · `docs/architecture/page-ia.md` · `docs/grilling-queue.md` (drain 52-54 with Chris's answers). Gated adds: `lib/confidence.ts` · `components/ConfidenceCard.tsx` · `components/IndexList.tsx` · `tailwind.config.ts`.

## Verification plan

- `preview_start`; spot-check every touched surface at 390 + 1024 (`preview_resize`). Screenshot the green index → detail color continuity for all 4 lifecycle states (the point of Pass 1). Pass 2 preview checkpoint as above.
- `npx tsc --noEmit` from the main repo (or node_modules symlink) — the SspTopBar rename ripples across ~12 call sites; `npm run build` before push.
- `npm run check:doc-links` after the doc sweep (root-relative links).
- Six-actor trace: Actor 6 (UI render) + Actor 5 (design-system.md / page-ia.md) only — no schema, no MCP Tool surface, no prompts, no claude.ai instructions touched; hops 2/3/4 explicitly skipped. Actor 1 = the preview screenshots.
- Roadmap currency: if Pass 2 ships and Chris confirms the capsule shape at the preview checkpoint, move "Synthesis surface rethink" out of roadmap § Needs Chris's design thinking + add the shipped.md row, same PR. If Chris feels a structural rethink remains beyond render-weight, re-add a narrower line instead.
- `/simplify` after implementation, before commit (Passes 1 + 3 touch repeated patterns across 5+ files).

## Open questions (answers recorded against grilling-queue 52-54; recommendations inline)

- **Q1 (queue 52):** Ratify the chrome @media exception? Recommended: yes, option (a) — container queries govern detail surfaces; viewport chrome (header / filter bars / index grids) uses Tailwind @media — and move the Header + BrewsFilterBar collapse `md:` → `lg:` so chrome honors the 390/1024 model. Consequence: tablets 768-1023 get the hamburger; consistent with "tablet falls out of fluid behavior."
- **Q2 (queue 53):** Which meaning keeps #4A7C59? Recommended: `resolved-emphasis` keeps it (most call sites, strongest semantic weight); `tile-next-roast` re-derives toward a yellower leaf-green; the focus ring keeps the hex (interaction chrome, not a data signal).
- **Q3 (queue 54):** Unify the evidence scales? Recommended: `barBlocks` fills at 1 / 2 / 3-4 / 5-7 / 8+ so HIGH (5+) lights the 4th block; the Chris-locked LOW/MEDIUM/HIGH thresholds stay byte-identical. Then ship audit item 04 in the same change.
- **Q4:** Hamburger SVG — keep it, document as the single sanctioned drawn-icon exception in § Iconography? Recommended: yes (a ☰ glyph renders worse at 14px and varies by platform).
- **Q5:** After capsules land, soften the roaster-page synthesis from collapsed-tertiary toward an open capsule? Recommended: defer — the roaster exception (Coffees list primary) was a deliberate ratification; revisit after living with capsule weight.
