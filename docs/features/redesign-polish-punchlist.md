# Redesign Polish Punch-List

Source: Chris's "New Design Feedback - Latent" doc (2026-05-30), desktop pass at 1024
+ "Mobile - New Design Feedback" doc (2026-05-30), mobile pass at 390. Mobile section captured
below — desktop items all still hold on mobile (Chris did not re-list them).

## STATUS — both polish PRs SHIPPED (2026-05-30)

- **PR1** — [#317](https://github.com/chrismccann-dev/latent-coffee/pull/317), main `b197574`:
  T-A tick scale · T-B corner badge · T-C collapsible alignment · BI-1 brew-card heights ·
  MB-1 mobile roaster popover · CI-1 cultivar tree spline.
- **PR2** — [#318](https://github.com/chrismccann-dev/latent-coffee/pull/318), main `8c9cbe4`:
  WC-2 cupping reshape (+ WC-1/WC-2b/WC-3/WC-5) · WR-2 anchor label.
- **STILL OPEN (separate sessions, NOT started):** `naming` · `data-audit` · `data-model`
  (pour-structure bug — highest-priority functional follow-up) · `side-quest` MB-6. See the
  "Punt" list under FINAL batching below.

### Retro (what surprised us / what we'd carry forward)
- **The single biggest lesson: capture-first paid off enormously.** WC-2 looked like a 2-row
  swap from the written note; Chris's *audio* recount of two live cuppings revealed it was a
  full reshape (mobile-is-the-target, demote taste-for + primary-question, batch numbers in
  labels). Had we implemented off the written note we'd have built the wrong thing. Audio on
  interpretive UI work is load-bearing — ask for it.
- **Stale `preview_logs` bit twice.** A mid-edit JSX parse error stays in the dev-server stderr
  buffer after the fix; `preview_logs --level error` showed a PR1 error during PR2. Confirm
  staleness by actually fetching the route (200 + expected content) rather than trusting the log.
- **The worktree `--delete-branch` "error" on merge is benign** — `gh pr merge` tries to check
  out main, which the sibling worktree holds; the squash-merge itself succeeds. Don't chase it.
- **Eval double-toggle.** Driving disclosure/popover state via repeated `preview_eval` clicks
  races itself (each call re-toggles). Drive with single clicks + check state between, or do the
  whole open-sequence in one eval.

Capture-first review session. No app edits until the punch-list is complete (desktop + mobile)
and the batching is approved. Several items are open decisions or belong to separate sessions
(data audits / data-model / naming) — flagged inline.

## Legend

- **type**: `polish` (clear design fix, batchable) · `decision` (needs Chris call) ·
  `data-audit` (separate audit session) · `data-model` (broader sprint, e.g. pour structure) ·
  `naming` (abbreviation/label cleanup, candidate for own sprint)
- **scope**: `page-local` vs `shared-primitive` (shared = fixing once fixes N surfaces)

---

## Recurring themes (highest leverage — fix once, propagates)

- **T-A · Representation tick scale** (`polish`, shared-primitive) — the 5-block bar on the
  index pages currently normalizes relative to the page-max (`barBlocks(count, max)` in
  `components/IndexList.tsx`). Chris wants **absolute, fixed thresholds** so bars mean the same
  thing across every index. Flagged on Terroir / Cultivar / Roaster indexes; applies to all grl
  indexes (also Processes modifier/signature rows). Proposed scale (de-overlapped from Chris's
  dictation): `1→1 · 2-3→2 · 4-5→3 · 6-7→4 · 8+→5`. **Open: confirm boundaries** (his dictated
  set overlapped: 1-2 / 2-4 / 4-6 / 6-8 / 8+).
- **T-B · Green state-card corner badge reads as an artifact** (`polish`, shared-primitive) —
  the `.ssp-corner` chip (e.g. "V2", "BATCH #179 · LEADING") floats top-right and has faint
  **background text behind it** ("DEV" / "RECIPE"). Chris: on waiting-for-roast "get rid of the
  top-right V2 box, seems like an artifact"; on unresolved "right-adjust that and get rid of the
  background text." Seen on a handful of sub-pages. Fix: remove the background/ghost text, clean
  up or drop the corner chip. **Open: drop the corner entirely vs keep a clean right-aligned
  chip?**
- **T-C · Collapsible section-header alignment is inconsistent** (`polish`, shared-primitive) —
  across green views the collapsible headers mix left- and right-adjusted meta+chevron. Some put
  the count next to the title ("EXPERIMENT FRAME · V2 ▾", "ROAST LOG · 3 ROASTS ▾"), others
  right-adjust it ("PER-ROAST REFLECTIONS … 3 POPULATED ▾", "ADDITIONAL INFORMATION … FULL
  HISTORY RENDERS ON THE RESOLVED VIEW ▾"). Chris: make all consistent, **right-adjust
  everything**. Root: `CollapsibleSection` / `.ssp-coll` summary layout + how each green view
  passes meta.

---

## Brew Index (`/brews`)

- **BI-1 · Inconsistent card heights** (`polish`, shared-primitive: `components/BrewCard.tsx`)
  — cards should be uniform height for BOTH the colored cover face AND the white producer foot.
  Longer producer info should size the whole grid's cards up to match, not stretch one card.
  Chris: a little negative space inside containers is fine — prefer consistent over per-card
  resizing. Mockup provided (equal-height grid). Fix: equalize card height (flex column +
  min-height / grid auto-rows; foot grows to fill).
- **BI-2 · Tag/abbreviation/naming cleanup** (`naming` — Chris OK to punt to its own sprint)
  — long titles on covers. Examples he called out:
  - "Dark Room Dried" → **DRD** acronym (Mokkita; Sidra)
  - "El Placer (Farm)" → drop "(Farm)" → "El Placer"
  - "Ethiopian Landrace Population" → "Ethiopian Landrace" (drop "Population")
  - "Generic Honey" → "Honey"
  - "Ethiopian Landrace Blend 74110/74112" → "Ethiopian Landrace Blend" (drop numbers)
  - "Catimor (group)" → "Catimor"
  - "Bourbon Caturra (field blend)" → "Bourbon Caturra blend"
  - "Red Bourbon / Mibirizi blend" → "Red Bourbon, Mibirizi blend"
  - "74158 [dark listing]" → "74158"
  - "Gesha Panama lineage Washed" → "Gesha"
  - "Laurina (Bourbon Pointu)" → "Laurina"
  - "Ethiopian landraces (JARC 74110, 74112)" / "(74158, 74110, 74112)" → "Ethiopian landraces blend"
  - Overflow handling with "…" is good — keep it.
  - **Needs a standard blend-naming convention** (broader than the index).
  - **Heritage Collection Natural** → Chris suspects "Heritage" isn't actually the variety →
    `data-audit` item (verify variety).

## Brew Sub-Pages (`/brews/[id]`)

- **BS-1 · Pour-structure rendering is wrong on multiple brews** (`data-model` — Chris notes
  it's broader than design polish; likely the `pour_structure` free-text parser + storage shape).
  The recipe *layout* is liked; the *data* doesn't map cleanly:
  - [2026 Ruarai AA Separation](https://www.latentcoffee.com/brews/da937ce6-2877-4436-84f4-8191d93e5528)
    — timeline shows `0:00 Bloom` → `· Pour 1` (no start time) → `~3:00 Bloom` (should be the
    second POUR, not "Bloom" again). Also **no producer listed** (`data-audit`; Chris will supply).
  - [Garrido Mokkita Cold Room](https://www.latentcoffee.com/brews/7ad09c9b-35c3-4635-88eb-248bb38b42bc)
    — cleaner (`0:00`/`0:50`/`1:40`) but Pour 3 starts at "·" because it's a 2-pour recipe with a
    dial change at the end of pour 2.
  - [Release 056 - El Placer](https://www.latentcoffee.com/brews/71c1d610-5a13-4dbc-ad73-cb211a455f0f)
    — 2-pour brew showing only 1 pour (Pours 3/4 are "Office tap water" / "Kettle on base
    throughout" with "·" times). Also filter label "CAFEC Abaca+ Cup 1 Cone Paper Filter" →
    **"CAFEC Abaca+ Cone"** (`naming`).
  - [Ethiopia Heirloom Cold Room Natural](https://www.latentcoffee.com/brews/0d93118c-555e-4778-905f-17d166e33a8f)
    — pour structure not represented correctly.
  - [Altieri Gesha CHOMBI Natural Dry Fermentation](https://www.latentcoffee.com/brews/4fc7e914-095d-4d1e-9af6-3a6c7c556c9b)
    — pour structure all off.
  - [Apricoast](https://www.latentcoffee.com/brews/53c552ec-3046-4090-a6ec-4e9dba14c523)
    — showing two blooms (pour-structure data). Also filter "CAFEC T-92 - Cup 4 Light Roast Paper
    Filter" → **"CAFEC T-92"** (`naming`).

## Terroir Index (`/terroirs`)

- **TI-1 · Representation tick scale** → see **T-A**. Otherwise good.

## Terroir Sub-Pages — ✅ no comments, good.

## Cultivar Index (`/cultivars`)

- **CI-1 · Lineage spline / genealogical tree** (`decision`) — Chris likes the lineage spline
  text-tree from the original redesign mock (├ └ genealogy, "LINEAGES MAPPED · N LINEAGES · N
  FAMILIES · N BREWS"). Current deployed cultivar index uses the grl grouped-row list (lineage as
  indented sub-label) per Sprint 6 PR2. He's asking: is the tree worth bringing back, knowing it'd
  be different from the other index pages? **Decision needed: keep grouped rows, or adopt the
  tree spline (and accept the cultivar index being a one-off shape).**
- **CI-2 · Representation tick scale** → see **T-A**.

## Cultivar Sub-Pages — ✅ good, no comments.

## Processes Index — ✅ good, no comments. (Tick scale T-A still applies to its grl rows.)
## Processes Sub-Pages — ✅ good, no comments.

## Roaster Index (`/roasters`)

- **RI-1 · Representation tick scale** → see **T-A**. Otherwise good.

## Roasters Sub-Pages — ✅ good.

## Green Bean Index (`/green`)

- **GI-1 · Design good; data wrong** (`data-audit`, separate session per Chris) — these lots
  should all be resolved but aren't rendering that way: Costa Rica Anaerobic Dry Process Higuito ·
  CGLE Sudan Rume Natural · Gesha Village Oma (Lot 25/035) · Guatemala Libertad (Aurelio del
  Cerro) · Guatemala El Socorro (Java variety). Needs a quick lifecycle-state audit.

## Green — Waiting-for-next-roast (`/green/[id]`)

[Fazenda Um - Wush Wush Natural DRD](https://www.latentcoffee.com/green/038ef36d-0b9f-4630-be61-eec176694910)

- **WR-1 · Top-right "V2" corner box is an artifact** → see **T-B**.
- **WR-2 · Primary-question block has two different fonts** (`decision`/`polish`) — the sans
  primary-question prose is followed by a smaller mono paragraph ("V1 leading slot v1a (Batch
  173)…"). These are two different fields: `experiments.primary_question` (the `.ssp-question`)
  + the anchor line from `experiments.control_baseline` (the `.ssp-anchor-line`). Chris asks if
  they're the same field. **Decision: label the second one (e.g. an "Anchor / V1 reference"
  caption) or unify the type so it doesn't read as a font glitch.**
- **WR-3 · Hypothesis collapsible field + drop-temp/drop-rules** — ✅ liked, "exactly what I was
  looking for." No action.
- **WR-4 · Collapsible header alignment inconsistent** → see **T-C**.

## Green — Waiting-for-next-cupping (`/green/[id]`)

[El Paraiso Red Plum Castillo](https://www.latentcoffee.com/green/be477009-20ca-4b7f-acbc-71c089e16117)

- **WC-1 · Text overflow** (`polish`, page-local) — the transposed cupping table's V2C
  (right-most) column prose overflows its container. Fix: word-break / min-width / cell padding on
  `SspExpGrid` cells.
- **WC-2 · Reshape the cupping view to the actual cupping flow** (`polish`→`reshape`, page-local)
  — **REFINED via Chris's 2026-05-30 audio note (recounting two live cuppings that morning).**
  The headline: the **mobile stack layout IS the target for desktop too** — "the mobile one has
  actually done much better than the desktop one... I typically do this while I'm on my phone."
  So collapse the Sprint-2 dual-subtree into ONE canonical layout = the mobile composition.

  **Cupping priority order (Chris's literal mental model at the table):**
  1. **Producer notes** — the benchmark, top/foreground ("taste against this").
  2. **Predicted Cup given roast actuals** — per-slot, THE primary read before each sip. "It only
     matters how it actually went in reality, not how we thought it would go."
  3. *(far secondary)* Previous leading slot cup memory — "nice to have," dense, hard to parse.
  4. *(tertiary)* Roast Actuals — "not actively staring at this while drinking"; vs-Expected
     prose collapses by default (= WC-3).
  5. *(very tertiary)* Taste-for cupping-table question — "didn't happen, so I'd rather go for
     actuals." Demote out of the foreground.
  6. Primary Question — lot-level framing, not read during cupping. Demote.

  **Target layout (single tree, both breakpoints):**
  - **CUPPING card:** Producer notes ("taste against this") → per-slot stack cards, each = slot
    label **with batch number** (`V3A · #190` — Chris explicitly asked; mirror the Roast Actuals
    `slot · #batch` format) + **Predicted Cup** as the card's primary content.
  - Previous-leading-cup + Taste-for + Primary Question → a collapsed tertiary disclosure below.
  - **ROAST ACTUALS card** stays below; the long `vs Expected` prose row collapses by default.
  - Desktop: slot cards MAY go side-by-side (3-col) for comparison ("comparatively from 190 to
    191, how is 192 reading") via a container-query grid on the slot row — ONE content def, not a
    second DOM subtree. (Open Q below.)

  **This supersedes:** Bundle-B's 2-row transposed table (Taste-for/Predicted-Cup) AND the
  Sprint-2 `.s2-desktop`/`.s2-mobile` dual-subtree. Both are intentionally retired here — the
  retire is the point, not a regression. WC-1 (table overflow) dissolves with the table.

  **Build decisions (Chris-locked 2026-05-30, follow-up):**
  - Desktop slot cards **side-by-side** (3-col container-query grid); mobile stacks. One content
    def, not a second subtree.
  - Tertiary content → **one collapsed "Reference & detail" drawer** (prior-leading-cup +
    taste-for + primary-question together).
  - Prior-leading-cup density → **just collapse as-is**; the rewrite is a DATA/content problem
    (how claude.ai writes `observed_outcome_*`), punted to the `naming`/`data` bucket — NOT this PR.

- **WC-2b · Batch number in slot labels** — slot cards/columns label as `V3A · #190` not bare
  `V3A`; Chris navigates by roast number, not V-slot. Data already on `info.roast.batch_id` /
  `info.declaredBatchId` (Roast Actuals already composes this).
- **WC-3 · "Roast Actuals" vs-Expected cells should collapse by default** (`polish`, page-local)
  — section is liked; the long "vs Expected" prose per column should be a collapsible like the
  hypothesis collapsible. Collapse by default.
- **WC-4 · Collapsible arrows right-adjust / consistent** → see **T-C**.
- **WC-5 · "Previous leading slot cup" heading is absurdly long** (`polish`, page-local) — on
  [Gesha Clouds - Forest](https://www.latentcoffee.com/green/0f6e1e49-e7d6-41fc-8754-be249fbe4349)
  the label column renders the full derived string (experiment_id + V2C + caveats prose) as the
  *label*. Fix: the label should be a short fixed caption; the prose belongs in the value column.

## Green — Resolved Lot Page — ✅ good, liked, no comments.

## Green — Unresolved Lot Page (`/green/[id]`)

[Rancho Tio Emilio - Typica Mejorado Washed](https://www.latentcoffee.com/green/b0c57fd5-2a43-46b4-9cf8-197ec97bd6ab)

- **UR-1 · "LEADING ROAST" corner chip floats above heading + has background text** → see
  **T-B**. ("BATCH #179 · LEADING" chip top-right with ghost "RECIPE" text behind.)
- **UR-2** — otherwise good.

## Green — In-inventory (direct URL) — not walked in this pass.

---

## MOBILE PASS (390) — additional items only

Chris's mobile pass was light. Desktop items all still apply on mobile; these are net-new.

- **MB-1 · Roaster filter popover clips names on mobile** (`polish`, page-local:
  `components/BrewsFilterBar.tsx` + `FilterPopover`) — on `/brews` mobile, opening the ROASTER
  filter popover pushes its left edge off-screen so every option's first chars are clipped
  ("olibri" = Colibri, "ongzhe" = Dongzhe, "ower Child" = Flower Child, "oonwake" = Moonwake,
  etc.). The popover anchors `right-0 md:left-0` with `max-w-[calc(100vw-3rem)]`; on a narrow
  viewport the right-anchor + max-width is letting content overflow its left edge. Fix: clamp the
  popover to the viewport (left/right inset + `overflow` so the text column starts on-screen).
  Chris otherwise loves the brew index on mobile.
- **MB-2 · /brews/[id] mobile** — ✅ "design wise mobile brew pages look great." (Pour-structure
  data bug from BS-1 still applies — already logged as `data-model`.)
- **MB-3 · Cultivar / Terroir / Processes indexes + sub-pages on mobile** — ✅ all good.
- **MB-4 · Waiting-for-cupping mobile** ([El Paraiso Red Plum Castillo](https://www.latentcoffee.com/green/be477009-20ca-4b7f-acbc-71c089e16117))
  — ✅ "I like this one a lot - this is perfect." (The s2-mobile dual-subtree from Redesign
  Sprint 2 lands well.)
- **MB-5 · Bourbon cultivar is a skeleton page** (`data-audit`, NOT a mobile issue — Chris
  flagged it here) — [Bourbon](https://www.latentcoffee.com/cultivars/ddfce7fc-4595-41f9-9ee4-a788af8a792b)
  renders as a skeleton/empty page but should have full data. → folds into the `data-audit`
  bucket alongside GI-1.
- **MB-6 · Green index mobile = brew-card treatment** (`side-quest`, optional) — Chris likes the
  brew index card look on mobile and wonders about giving `/green` a similar card grid instead of
  the flat lifecycle list. He'll mock it up; explicitly **"optional design sprint in side quests,
  not critical."** → roadmap side quest, not this round.

---

## FINAL batching (mobile pass folded in — ready to build)

- **PR 1 — Shared-primitive + index polish.** Highest leverage; touches every index + every
  green view at once.
  - T-A tick scale (absolute) — `components/IndexList.tsx` `barBlocks` + drop `max` threading
  - T-B corner badge — `.ssp-corner` ghost-text removal + right-align (`Ssp.tsx` / globals.css)
  - T-C collapsible header alignment (right-adjust all) — `CollapsibleSection` / `.ssp-coll`
  - BI-1 brew-card equal heights — `components/BrewCard.tsx`
  - MB-1 roaster filter popover clip on mobile — `components/BrewsFilterBar.tsx` / `FilterPopover`
  - CI-1 cultivar tree spline (sequenced LAST; split off if fiddly) — `cultivars/page.tsx` + CSS
- **PR 2 — Green page-local polish.** All in `app/(app)/green/[id]/page.tsx` + green view
  components.
  - WC-1 cupping table overflow
  - WC-2 cupping section reorder (verify vs Bundle-B IA first)
  - WC-3 vs-Expected collapse-by-default
  - WC-5 "Previous leading slot cup" long-label fix
  - WR-2 primary-question anchor-line labeling
- **Punt (separate sessions, NOT this polish round):**
  - `naming` — BI-2 abbreviations + blend-naming convention + filter-label shortening (BS-1
    filter sub-items). Own sprint per Chris.
  - `data-audit` — GI-1 unresolved lots, BS-1 Ruarai missing producer, BI-2 Heritage variety,
    MB-5 Bourbon skeleton page.
  - `data-model` — BS-1 pour-structure parsing/storage (the recurring "two blooms / missing
    pour / · time" bug across 6 brews). Broader than polish; **highest-priority functional
    follow-up after this round.**
  - `side-quest` — MB-6 green index card treatment (Chris will mock; explicitly optional).

## Decisions — LOCKED (Chris, 2026-05-30)

1. **T-A · tick scale** → ✅ **absolute thresholds**, switching off relative-to-page-max.
   Scale: `1→1 · 2-3→2 · 4-5→3 · 6-7→4 · 8+→5`. Change `barBlocks(count, max)` in
   `components/IndexList.tsx` to a `barBlocks(count)` absolute mapping; drop the `max` prop
   threading from all 4 aggregation index callers.
2. **T-B · corner badge** → ✅ **keep a clean right-aligned chip**; remove ONLY the ghost
   background text. Applies to `.ssp-corner` on all green state cards.
3. **CI-1 · cultivar tree spline** → ✅ **build it now, in PR1, sequenced last.** ~1-2 hrs —
   data tree already built in `cultivars/page.tsx`; pure render swap to `├ └ │` connectors +
   spline CSS. Chris: "take a stab at it now, split off if it gets fiddly, iterate as needed."
   Becomes the one index not using `GrlRow` (accepted one-off).
4. **WC-2 · cupping reorder** → still need to confirm it doesn't conflict with the locked
   Bundle-B cupping IA. Verify against `app/(app)/green/[id]/page.tsx` cupping view + the
   redesign Sprint 2 notes before implementing PR2.

## Remaining open item

- **WC-2** — cross-check the requested reorder (Reference Signals above the V2A/B/C table;
  Predicted-Cup above Taste-for inside the table) against the Bundle-B locked 2-row order so we
  don't re-introduce something a prior sprint deliberately removed. Resolve at PR2 build time.
