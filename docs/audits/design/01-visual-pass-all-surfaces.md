# Design audit 01 — visual pass, all surfaces

> **Evidence:** the 31 full-page PNGs are archived in Dropbox at `Latent Coffee Design Audits/01-visual-pass-2026-06-20/screenshots/` (kept out of git for weight). The `docs/audits/design/screenshots/<name>.png` paths referenced throughout are the original capture filenames - look them up in that Dropbox folder.

Read-only visual/UX audit of every app surface (index + a representative detail, at 390 and 1024) plus the global header. Design-side sibling of `/architecture-review`. **This doc is the deliverable; no code was changed.** A separate execution session implements approved findings and must run the six-actor trace on any finding tagged "implies a data/IA change."

- **Date:** 2026-06-20
- **Method:** logged into the live preview (`npm run dev`), drove a headless Chrome at true 390 + 1024 viewports, captured 31 full-page PNGs under `docs/audits/design/screenshots/`, ran above-the-fold + overview crops through the `design:design-critique` lens, then layered Latent-specific dimensions (design-system adherence, priority-stack correctness, hue-not-lightness, the 390 forcing function) and held every surface against every other.
- **Critique baseline:** `docs/design-system.md` (token map / palette / primitives / detail-page grammar), CLAUDE.md § Design / UX conventions, `docs/adr/0018-per-surface-mobile-pattern.md`. Findings are scored against *Chris's* system, not generic taste. A finding that fights an intentional convention is in § Considered-and-left-alone, not in the findings.
- **Surfaces covered:** `/terroirs` · `/cultivars` · `/processes` · `/roasters` · `/producers` · `/brews` · `/green` + `components/Header.tsx`.
- **Headline:** the redesign arc (Sprints 0-6 + the 2026-06-11 polish-audit) left the app remarkably consistent — the 4 aggregation **detail** families share one grammar, the lifecycle color system reads cleanly, the header and workflow-companion mobile surfaces are textbook. **Almost every finding below is concentrated on the two newest, not-yet-through-the-consistency-pass surfaces: the Producers index (shipped 2026-06-19) and the chip primitive as used on Processes.** The mature surfaces are clean.

---

## 1. Lead recommendation

**Do this first: make the `.chip` primitive wrap or clamp long labels so it can never force horizontal page scroll at 390.**

This is the single highest-leverage move because it is the *only place the app is actually broken* (not merely inconsistent): two surfaces scroll sideways on a phone. `/processes` overflows its 390 viewport by **+153px** and `/producers` by **+81px**, both from a single root cause — a `.chip` with a long label that can't wrap, measured live:

- `/processes`: `SPAN.chip.green` = "Double Anaerobic + Thermal Shock + Yeast Inoculated (3)" renders 390px wide and pushes `scrollWidth` to 543.
- `/producers`: `SPAN.chip` = "Best of Panama (2008 #12; 2025 Geisha #6 Natural…)" renders 430px wide and pushes `scrollWidth` to 471.

Every other surface measured `overflow = 0` at 390. The fix is one primitive (`white-space`/`max-width`/`overflow-wrap` on `.chip`, or clamp + title-tooltip for the pathological award strings), near-zero regression risk, and it restores the foundational guarantee every other surface already honors: *one shared IA, mobile as the forcing function* (ADR-0018). A reference app that scrolls sideways on a phone has broken its own first law of responsive design.

The **largest consistency move** (bigger payoff, more effort, partly intentional) is Finding 2 — reconciling the Producers index with the index-family grammar. Lead with the chip fix; it is also a prerequisite sub-step of the Producers cleanup.

---

## 2. Cross-surface consistency findings

These are the inconsistencies only visible when surfaces are held against each other — the heart of the pass.

### Finding 1: `.chip` long labels force horizontal scroll at 390   [HIGH impact]
- Surfaces: `/processes` (index portal cards + detail variants), `/producers` (index dossier cards + detail) · Viewport: 390
- Evidence: `docs/audits/design/screenshots/processes-index-390.png`, `processes-detail-390.png`, `producers-index-390.png` (note the empty page-background band on the right edge = content wider than the viewport)
- What I see now: a single un-wrapping chip ("Double Anaerobic + Thermal Shock + Yeast Inoculated (3)" on processes; "Best of Panama (2008 #12; 2025 Geisha #6 Natural…)" on producers) is wider than 390, so the whole page gains a horizontal scrollbar. Measured live: processes `scrollWidth` 543 (overflow +153), producers 471 (overflow +81). All five other surfaces = 0.
- Why it's a problem: mobile horizontal scroll is the most basic responsive defect; it violates ADR-0018's "one shared IA, mobile as forcing function." The chip is a shared primitive, so the bug is latent on any future surface that renders a long-labelled chip.
- Design-system fit: the `Chip` primitive (`components/Ssp.tsx` + `.chip` in `globals.css`) is the single source of truth — fixing it there is exactly the "one helper per system" discipline. No new token needed.
- Proposed change: let `.chip` wrap (`overflow-wrap: anywhere` / allow multi-line) OR clamp to one line with ellipsis + full text on tap/title; either way cap its width to the container. Prefer wrap for process-modifier combos (the full name is information) and clamp for the producer award strings (provenance trivia).
- Effort: S · Risk of regressing the system: Low
- Cross-surface: the primitive is used app-wide; this is the only place the labels are long enough to overflow today, but the fix is preventative everywhere.
- Layer: UI-only (Actor 6)

### Finding 2: Producers index sits outside the index-family grammar   [HIGH impact]
- Surfaces: `/producers` index vs `/terroirs` · `/cultivars` · `/roasters` · `/processes` indexes · Viewport: both
- Evidence: `producers-index-1024.png` (full page is ~21,900px tall — roughly 10× every other aggregation index) and `producers-index-390.png` vs `terroirs-index-1024.png` / `roasters-index-1024.png`
- What I see now: every other aggregation index is a compact, scannable **grouped list** of one-line rows (swatch + name + count + 5-block bar). Producers is a **2-column grid of bordered dossier cards**, each carrying a name + tier badge + reference chip + a full prose paragraph + 2-3 chip clusters + a "5 brews · 3 roasters · 2 lots · 3 learnings" line + a footer action — preceded by a filter/sort apparatus no other index has. It is visually a different product page.
- Why it's a problem: consistency. The index layer had one job — let you scan a taxonomy fast — and four of five surfaces deliver it identically. Producers replaces "scan" with "read," loses the count/bar density cue entirely, and is the only index with bordered (boxed) cards. Newest surface (2026-06-19), hasn't had the redesign-arc consistency pass.
- Design-system fit: the index-page family is specified — `IndexCap` / `GrlRow` (count → 5-block `barBlocks` bar) / `GrlGroupHeader` (`components/IndexList.tsx`, design-system.md line 25). Producers uses none of it. The book-cover (`/brews`) and lifecycle-tile (`/green`) grids are sanctioned grid exceptions, but both stay *terse per card*; Producers' per-card density is the outlier, not the grid itself.
- Proposed change: keep the sourcing-forward *intent* but bring the chrome back into the family — adopt the `IndexCap` caption header, demote the per-card dossier to the established row/compact-card density (name + key sourcing chips + the count/bar scannability cue), move the full prose to the producer *detail* (which already carries it well), and make the filter bar match the brews pattern (Finding 4). See Open Questions for how much richness is load-bearing.
- Effort: L · Risk of regressing the system: Med (intent ambiguity — confirm with Chris)
- Cross-surface: this is the index-family's only defector; resolving it makes all 5 aggregation indexes read as one system.
- Layer: UI-only (Actor 6), but confirm sourcing-forward intent before reshaping (IA judgment)

### Finding 3: Aggregation-index header + corpus-count (97) presentation drifts   [MEDIUM impact]
- Surfaces: `/terroirs` · `/cultivars` · `/processes` · `/roasters` indexes · Viewport: both
- Evidence: `terroirs-index-1024.png`, `cultivars-index-1024.png`, `processes-index-1024.png`, `roasters-index-1024.png`
- What I see now: the same corpus total (97) is labelled four different ways and placed in two different rows:
  - terroirs — caption "28 REGIONS · 16 COUNTRIES"; sub-row "TERROIRS EXPLORED / COFFEES REPRESENTED · 97"
  - roasters — caption "29 ROASTERS · 6 FAMILIES"; sub-row "ROASTERS EXPLORED / COFFEES REPRESENTED · 97"
  - cultivars — caption "15 LINEAGES · 4 FAMILIES · **97 BREWS**"; sub-row "CULTIVARS EXPLORED / COFFEES REPRESENTED · **97**" → the 97 is stated **twice**, once as "BREWS" and once as "COFFEES"
  - processes — caption "3 BASE · 8 MODIFIERS · 3 SIGNATURES · **97 COFFEES**"; **no** "EXPLORED / COFFEES REPRESENTED" sub-row at all (jumps straight to "CORE PROCESS PORTALS")
- Why it's a problem: four sibling pages, four different answers to "how many coffees back this view, and what do we call them." Cultivars double-counts; processes omits the shared sub-header. Small, but it's exactly the kind of drift a reader notices subconsciously as "these pages aren't quite the same thing."
- Design-system fit: `IndexCap` is the caption primitive (design-system.md line 25); the inconsistency is in *what data each page feeds it* + whether the second "EXPLORED / COFFEES REPRESENTED" row is rendered, not in the primitive.
- Proposed change: pick one term for the corpus unit ("COFFEES REPRESENTED · 97" reads best) and one home for it (the sub-row), render the "X EXPLORED / COFFEES REPRESENTED · N" sub-row on all four (including processes), and drop the redundant "97 BREWS" from the cultivars caption.
- Effort: S · Risk of regressing the system: Low
- Cross-surface: unifies the 4 aggregation index headers; complements Finding 2.
- Layer: UI-only (Actor 6) (copy + which count is passed)

### Finding 4: Filter-bar behavior is inconsistent between the two filtered indexes   [MEDIUM impact]
- Surfaces: `/brews` vs `/producers` indexes · Viewport: both (worst at 390)
- Evidence: `brews-index-390.png` (collapsed "FILTERS ▾") vs `producers-index-390.png` (full filter apparatus expanded above content)
- What I see now: both are filterable indexes, but they filter differently. Brews uses a `FILTERS ▾` disclosure that **collapses on mobile** and colored strategy pills on desktop. Producers shows an always-expanded stack — toggle-pills with counts ("ALL PRODUCERS 141", "PRIORITY TARGETS 22", …), a search field, and three "ALL …" dropdowns — that does **not** collapse on mobile, pushing the first card far down the page.
- Why it's a problem: same job (filter this index), two visual languages and two mobile behaviors. On a phone the producers controls eat most of the first screen before any content. The redesign ratified `@media` collapse for chrome (design-system.md "Chrome @media exception") and the brews bar follows it; producers doesn't.
- Design-system fit: `BrewsFilterBar` is the established filtered-index chrome and is named in the chrome-collapse exception. Producers introduced a parallel, non-collapsing filter chrome.
- Proposed change: route the producers filters through the brews collapse pattern (`FILTERS ▾` on mobile) and align the pill/dropdown styling to the brews bar so the two read as one control system.
- Effort: M · Risk of regressing the system: Low
- Cross-surface: only these two indexes filter; aligning them defines the index-filter pattern for any future filtered surface.
- Layer: UI-only (Actor 6)

### Finding 5: Aggregation-index name typography splits (cultivars mono vs terroirs/roasters/processes sans-bold)   [LOW impact]
- Surfaces: `/cultivars` vs `/terroirs` · `/roasters` · `/processes` indexes · Viewport: both
- Evidence: `cultivars-index-1024.png` vs `terroirs-index-1024.png` / `roasters-index-1024.png`
- What I see now: terroirs/roasters/processes render the entity name as **sans-bold** in the `GrlRow`. Cultivars renders an all-**mono** ASCII tree (├─ └─ connectors) with mono leaf names.
- Why it's a problem: a reader moving between the four "explore a taxonomy" indexes meets two different name treatments. (Partly defensible — see Considered-and-left-alone for why the *tree* itself should stay; the open question is only the leaf-name font.)
- Design-system fit: ratification #2 (design-system.md line 81) puts mono on *brew-card / lot-card* names specifically; it does not extend mono to the grouped-list aggregation indexes, which use sans-bold. The cultivars tree is a bespoke component, not `GrlRow`.
- Proposed change: keep the tree structure; consider sans-bold leaf names to match the sibling indexes (or, if mono is deliberate because cultivar names are code-like — SL28, 74158 — document that exception). Pairs with the cultivars mobile-truncation fix (Finding 8).
- Effort: S · Risk of regressing the system: Low
- Cross-surface: aligns the 4 aggregation index name treatments.
- Layer: UI-only (Actor 6)

---

## 3. Per-surface walk

### `/terroirs`
Reads as the reference implementation of the grouped-list index: country group headers (colored swatch + name + count), one sans-bold row per macro terroir with elevation sub-line + count + 5-block bar. Detail is the clean aggregation grammar (black topbar → swatch nameplate → sectioned KV grids → light synthesis → dark confidence footer). Mobile rows wrap names gracefully to two lines (`terroirs-index-390.png`) — no truncation, because there's only one level of group indent.
- No surface-specific findings. Participates in Finding 3 (header) and is the model the others should match.

### `/cultivars`
A 4-level mono ASCII tree (Species → Family → Lineage → Cultivar) with small family swatches + count/bar on each leaf. Detail matches the aggregation grammar. The tree is the right call for genuinely 4-deep data — but it's the one index that pays for its depth on mobile.

#### Finding 8: Cultivars tree truncates leaf names to ~10 chars at 390   [MEDIUM impact]
- Surface(s): `/cultivars` index · Viewport: 390
- Evidence: `cultivars-index-390.png`
- What I see now: the fixed tree indentation (5+ levels of connectors) consumes the horizontal budget, so leaf names clamp to ~10 chars: "Red Bourbo…", "Ethiopian …", "Bourbon, C…", "74158/7411…", "Catimor (g…". "Ethiopian landrace population" and "Ethiopian Landrace Blend" both collapse to "Ethiopian …" — indistinguishable.
- Why it's a problem: this inverts the mobile-as-forcing-function law — the *indentation chrome* wins and the *primary content* (the name) is sacrificed. The count/bar survives on the right while the thing being counted becomes unreadable.
- Design-system fit: ADR-0018 says the most-constrained width ranks information by importance; here the name should outrank the indent. The tree component is bespoke (not `GrlRow`), so this is local CSS.
- Proposed change: at 390, compress per-level indent (or switch to a single small indent + lineage label), let names use the reclaimed width, and allow a second line before truncating. Pairs with Finding 5.
- Effort: M · Risk of regressing the system: Low
- Cross-surface: cultivars-only (only deep-tree index).
- Layer: UI-only (Actor 6)

### `/processes`
Three-tier IA: bordered "CORE PROCESS PORTALS" cards (Washed / Natural / Honey, big swatch + chips) → "MODIFIER INDEX" rows → "SIGNATURE METHODS" rows. The rows match the grouped-list family; the portal cards are a justified per-page primitive. Detail is clean (the `processes-detail-1024.png` screenshot happens to capture the synthesis *loading* state — the sanctioned static mono line, see Considered-and-left-alone). This surface carries the worst chip overflow (Finding 1).

#### Finding 6: "Pure Honey (0)" zero-count chip on the Honey portal   [LOW impact]
- Surface(s): `/processes` index · Viewport: both
- Evidence: `processes-index-1024.png` (Honey portal: "0 pure · 9 modified" with a "Pure Honey (0)" chip)
- What I see now: the Honey portal shows a chip for a variant with a zero count.
- Why it's a problem: a "(0)" chip reads as a dead/empty affordance — there's nothing behind it to explore. Minor, but it's a small "is this broken?" beat.
- Design-system fit: read-only-chrome principle (design-system.md IA #1) — every affordance should resolve to content. A 0-count portal chip resolves to nothing.
- Proposed change: suppress chips whose count is 0 (or render the count muted/non-interactive).
- Effort: S · Risk of regressing the system: Low
- Cross-surface: any count-bearing chip set could show a 0; same suppression rule applies (e.g. modifier portals).
- Layer: UI-only (Actor 6)

### `/roasters`
Grouped by roaster family (Clarity-First / Balanced / Extraction-Forward) with well hue-separated family swatches (sage / tan / terracotta — hue, not lightness). Rows match the terroirs grammar exactly. Detail correctly implements the **roaster exception**: "COFFEES I'VE BREWED FROM THIS ROASTER" leads as primary, brewing philosophy follows, synthesis stays collapsed — confirmed at both widths (`roasters-detail-390.png`).
- No surface-specific findings. Best-in-class example of the per-page priority-stack exception working.

### `/producers`
Detail is strong and on-system: black topbar ("5 COFFEES · COLOMBIA / PRODUCER PROFILE"), plum-edged nameplate with FARM/REGION/TIER/REFERENCE-ROLE, a **dark** "DECISION" card (the 3-axis sourcing-priority model as the narrative anchor — correct dark-surface usage), then process-signature / sourcing-lens sections. The **index** is the problem child (Findings 1, 2, 4).

#### Finding 7: Producer DECISION card repeats the same text in two cells   [LOW impact]
- Surface(s): `/producers/[id]` detail · Viewport: both
- Evidence: `producers-detail-390.png` (DECISION grid: BUY POSTURE = "Compare future lots to the reference"; NEXT ACTION = "Compare future lots to the reference")
- What I see now: two cells of the 6-cell decision grid carry identical prose.
- Why it's a problem: duplicate content in a compact decision matrix wastes a cell and reads as a data-fill gap rather than two distinct axes.
- Design-system fit: "Topbar = identity, hero meta = differentiation, never duplicate" (design-system.md detail-page composition) — the same no-duplication spirit applies inside a KV/decision grid.
- Proposed change: differentiate the two axes (buy posture vs next action should say different things), or collapse to one cell when they're genuinely the same for a given producer.
- Effort: S · Risk of regressing the system: Low
- Cross-surface: producer-only, but it's a data-shape question (do these two axes ever diverge?) as much as a layout one.
- Layer: implies a data/IA change (flag for six-actor trace at execution — is the duplication a synthesis/data default or a real equivalence?)

### `/brews`
Book-cover grid (`BrewCard`): colored cover face (process×flavor hue) + mono variety name + flavor line + strategy pill, over a warm-paper foot (producer / region / via-roaster). The `FILTERS ▾` bar collapses correctly on mobile. Detail is the mobile-primary recipe bench — a **dark** "REFERENCE BREW RECIPE" anchor card (dose/water/ratio/grind/temp/total grid + amber-marked pour timeline), then extraction strategy / flavor / structure / peak. Textbook priority-stack: recipe primary, dark = narrative anchor, amber = task salience (`brews-detail-390.png`).
- No surface-specific findings. The strongest workflow-companion surface in the app.

### `/green`
Lifecycle-tile index: stage sections ("Waiting for next roast" leaf-green, "Waiting for next cupping" olive-bronze, "Resolved" roasted-brown) with colored tile cards (lot name + V-set badge + meta + lot code). The tile color is the fastest read on the page — IA principle #3 ("lifecycle drives color") doing exactly its job. Detail (waiting-for-roast) leads with the Roast Hypothesis transposed table (batch columns), amber-accented Drop-temp row, drop rules — the hero binds to the lifecycle green while in-content accents stay task-salience amber, the two color axes correctly living in different page zones (`green-detail-390.png`).
- No surface-specific findings. Cleanest expression of the lifecycle color system + the gold-standard table shape.

### Header (`components/Header.tsx`)
Desktop: white surface bar, typographic "LATENT RESEARCH" wordmark left, 7 centered mono-uppercase destinations with bold active state, bottom hairline. Mobile: wordmark + the single sanctioned drawn-SVG hamburger (per design-system.md Iconography Q4), opening a full-screen overlay menu with hairline-divided destinations + X close.
- No findings. One small note for Open Questions: the open mobile menu doesn't mark the current destination (all 7 render at equal weight), whereas the desktop bar bolds the active item — a minor lost affordance, not a defect.

---

## 4. Considered-and-left-alone

Things that look "off" at a glance but are intentional per the design system. **Execution session: do not "fix" these.**

- **Synthesis renders as a LIGHT card, only Confidence is DARK.** Measured live across all four aggregation details: "WHAT I'VE LEARNED" = `ssp-card` (paper `rgb(250,250,247)`), "CONFIDENCE" = `ssp-card dark` (`rgb(14,14,14)`). This is *consistent across all four* and matches synthesis's **secondary** priority rank + the 2026-06-11 capsule inversion. It does technically contradict one line in design-system.md § Detail-page composition rules that lists "synthesis" among dark/narrative-anchor surfaces — that's a doc drift, not a render bug (see Open Questions). Leave the render; reconcile the doc.
- **"Synthesizing knowledge from 46 washed coffees…" on the processes detail screenshot.** This is the sanctioned static-mono synthesis *loading* line ("no spinners — the synthesis loading state is a static mono line", design-system.md § Surfaces/motion). The screenshot caught it mid-generation; a later live read showed the full generated essay. Working as designed.
- **Cultivars renders as a tree while terroirs/roasters render as flat grouped lists.** The cultivar taxonomy is genuinely 4 levels deep (Species → Family → Lineage → Cultivar) vs 1-level grouping elsewhere; the tree expresses real structure. Keep the tree (Finding 8 fixes only its mobile truncation; Finding 5 only questions the leaf-*font*).
- **`/brews` and `/green` are multi-column grids, not lists.** Sanctioned grid primitives (`BrewCard` book covers; lifecycle tiles). The grid is fine; only Producers' per-card *density* is the outlier (Finding 2), not the existence of a grid.
- **Tall book-cover faces with the flavor line pinned to the bottom + empty mid-space.** The deliberate "book cover" proportion (design-system.md § Content on cards — colored cover face + paper foot). Not wasted space; it's the format.
- **No shadows, no gradients, flat surfaces, mono-uppercase labels everywhere.** Core brand voice ("quiet research notebook"). The density and restraint are the point, not blandness.
- **Producer detail's dark DECISION card.** Correct dark = narrative-anchor usage (the sourcing-priority model is the page's anchor), exactly parallel to the brew recipe / peak-expression / confidence dark cards.

---

## 5. Open questions (need Chris's judgment before implementation)

1. **Producers index intent (Finding 2).** How much of the per-card dossier is load-bearing "sourcing-forward" design vs richness that belongs on the detail page? The fix's shape depends entirely on this — full reduction to `GrlRow` density, or a denser-but-still-systematized producer card?
2. **Cultivars leaf-name font (Finding 5).** Is the mono treatment a deliberate "cultivar names are codes" choice (SL28 / 74158 / Castillo), or just inherited from the tree being bespoke? If deliberate, it should be documented as an exception rather than aligned to sans-bold.
3. **Synthesis dark-vs-light doc reconciliation.** design-system.md § Detail-page composition rules lists synthesis among dark surfaces, but it renders light (correctly, per its secondary rank). Reconcile the doc line — this is a substrate edit, not a UI edit (route via a grill / `propose_doc_changes`, not the execution session).
4. **Producer DECISION duplicate cells (Finding 7).** Do BUY POSTURE and NEXT ACTION ever carry different content, or are they the same axis? Determines fix vs collapse.
5. **Open mobile menu active state (Header note).** Worth marking the current destination in the overlay, or is the back-context enough?

---

## 6. Effort / impact summary

| # | Finding | Surface(s) | Impact | Effort | Risk | Layer |
|---|---|---|---|---|---|---|
| 1 | `.chip` long labels force 390 horizontal scroll | processes, producers | **HIGH** | S | Low | UI |
| 2 | Producers index outside the index-family grammar | producers | **HIGH** | L | Med | UI (+IA judgment) |
| 3 | Aggregation-index header / corpus-count (97) drift | terroirs, cultivars, processes, roasters | MEDIUM | S | Low | UI |
| 4 | Filter-bar mobile behavior inconsistent | brews vs producers | MEDIUM | M | Low | UI |
| 8 | Cultivars tree truncates leaf names at 390 | cultivars | MEDIUM | M | Low | UI |
| 5 | Index name typography splits (mono vs sans-bold) | cultivars vs others | LOW | S | Low | UI |
| 6 | "Pure Honey (0)" zero-count chip | processes | LOW | S | Low | UI |
| 7 | Producer DECISION card duplicate cells | producers | LOW | S | Low | UI (+data) |

**Suggested sequence:** Finding 1 (unblocks mobile + is a sub-step of 2) → Finding 3 (cheap header unification) → Finding 4 → Finding 2 (the big consistency move, after intent is confirmed) → Finding 8 → Findings 5/6/7 (polish). Findings 3 + 5 + 6 are all small `IndexCap`/index-family edits that could ship as one "index header + chrome consistency" PR.

---

*Evidence: all 31 screenshots in `docs/audits/design/screenshots/` (`<surface>-<index|detail>-<390|1024>.png` + `header-nav-*`). Captured against the live preview at true 390 + 1024 viewports on 2026-06-20.*
