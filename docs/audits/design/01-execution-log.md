# Design audit 01 — Batch 1 execution log

Implementation record for the first batch of approved findings from
`docs/audits/design/01-visual-pass-all-surfaces.md` (the read-only visual/UX
pass dated 2026-06-20; the audit deliverable + 31 before-screenshots live on the
audit's own branch/worktree). This batch is **5 findings, all UI-only**.

- **Date:** 2026-06-20
- **Branch:** `claude/friendly-bell-aaacca` (off `main`)
- **Scope:** Findings 1, 8, 3, 6 + the Header open-question note. Findings 2, 4, 5, 7 are NOT in this batch.
- **Verification:** live preview (`npm run dev`), Chrome driven at true 390 + 1024 CSS viewports (`documentElement.clientWidth`); overflow measured as `scrollWidth − clientWidth`. `npx tsc --noEmit` green. `/simplify` run (4 agents) — one cleanup applied, one skipped (below).

## Layer note — no six-actor trace required

Every change in this batch is **UI-only (Actor 6, render path only)**: CSS in
`app/globals.css` + JSX in three React render files. **No** schema / migration /
`lib/types.ts` change, **no** MCP Tool/Resource change, **no** doc-substrate /
CONTEXT / prompt / claude.ai change, **no** registry change. The six-actor
cross-system trace (CLAUDE.md § Cross-system audit) is therefore **not
applicable** — confirmed per finding below. No `propose_doc_changes` /
canonical-queue side effects.

---

## Finding 1 (Item 1) — `.chip` long labels force 390 horizontal scroll  [the lead]

**Files touched:** `app/globals.css` (base `.chip`; new `.chip.clamp2`; `.ssp-corner` nowrap re-pin), `components/ProducerCard.tsx` (knownFor chips → `chip clamp2` + `title`).

**Root cause:** `app/globals.css` base `.chip` had `white-space: nowrap`, so a long label rendered wider than the 390 viewport and forced page-level horizontal scroll on `/processes` and `/producers`.

**Fix:** base `.chip` now `white-space: normal; overflow-wrap: anywhere; max-width: 100%;` (wraps + caps to its container). The absolutely-positioned corner badge is a **separate selector** (`.ssp-card .ssp-corner`, NOT a `.chip` — confirmed: rendered as `<span className="ssp-corner">` in `app/(app)/green/[id]/page.tsx`, no `.chip` class), so the base wrap can't reach it; nonetheless its `white-space: nowrap` was pinned explicitly to harden the Chris-locked (2026-05-30) single-line "BATCH #N · …" guarantee. Producer award strings (provenance trivia) get a 2-line `.chip.clamp2` + `title` for the full text; process-modifier combos (information-bearing) wrap freely.

**Verification (live):**
- `/processes` @ 390: `scrollWidth 390 == clientWidth 390`, **overflow 0** (was 161; audit reported +153). Widest chip "Double Anaerobic + Thermal Shock + Yeast Inoculated (3)" now 196px wrapping to 3 lines (was 390px single-line). ✓
- `/producers` @ 390: `scrollWidth 390`, **overflow 0** (was 81; audit +81). ✓
- Producer award chip "Best of Panama (2008 #12; 2025 Geisha #6 Natural / #7 Washed)": `class="chip clamp2"`, capped at 2 lines (37px), fits container, `title` carries the full string. ✓
- Corner badge "Batch #200 · Reference" (`/green/[id]` resolved lot): `white-space: nowrap`, single line at **both** 390 and 1024. ✓
- Short chips unaffected (e.g. "Best of Panama winners" stays 1 line / 24px). ✓

**Six-actor:** UI-only (CSS + one JSX className/title). No trace required.

---

## Finding 8 (Item 2) — Cultivars tree truncates leaf names to ~10 chars at 390

**Files touched:** `app/globals.css` (new `@media (max-width: 640px)` block scoping `.cultivar-tree`).

**Root cause:** the bespoke cultivar genealogy tree (NOT `GrlRow`) uses a fixed per-level `├─ └─` connector indent; at 390 the indent chrome consumed the horizontal budget and the leaf-name column collapsed to a fixed 92px (~10 chars), so "Ethiopian landrace population" and "Ethiopian Landrace Blend" both rendered as "Ethiopian …".

**Fix:** at the sm/640 index-chrome `@media` breakpoint (index pages are fluid — no `.ssp-page` container query — so `@media` is the sanctioned tool per design-system.md "Chrome @media exception"): compress the leaf grid (`auto auto 1fr 26px 52px`, gap 7), shrink the connector font (13→10px) and the count-bar blocks (9→7px), and let `.name` wrap to two lines (`-webkit-line-clamp: 2`). The name wins the reclaimed width — ADR-0018: the name outranks the indent chrome. 1024 is untouched.

**Verification (live):**
- @ 390: leaf-name box **154px** (was 92px); names wrap to 2 lines, `clipped: false`. "Ethiopian landrace population" and "Ethiopian Landrace Blend (74110/74112)" both fully shown and **distinguishable**. Page overflow 0. ✓
- @ 1024: tree **unchanged** — names `white-space: nowrap`, full 470px box, **0 truncated**, both Ethiopians fully shown. ✓
- Branch rows (species/family/lineage) still render `auto 1fr` (connector + name) at 390. ✓

**Six-actor:** UI-only (CSS). No trace required.

---

## Finding 3 (Item 3) — Aggregation-index header / corpus-count (97) drift

**Files touched:** `app/(app)/cultivars/page.tsx` (IndexCap right), `app/(app)/processes/page.tsx` (import `GrlCap`; IndexCap right; new `<GrlCap>` sub-row). `terroirs` + `roasters` already conformed — **no change**.

**Root cause:** the corpus total (97) was labelled four ways across the four aggregation indexes — cultivars stated it twice ("97 BREWS" in the caption AND "97" in the `GrlCap` sub-row); processes omitted the `GrlCap` sub-row entirely and put "97 COFFEES" in the caption.

**Fix (display unification only — the same existing `totalCoffees` value is passed, no new field):** drop the redundant corpus segment from the cultivars + processes `IndexCap` captions; render the shared `GrlCap` ("&lt;X&gt; EXPLORED / COFFEES REPRESENTED · N") sub-row on processes too. All four now state the count **once**, same term, same row.

**Verification (live), each index cap → GrlCap sub-row:**
- terroirs: "28 REGIONS · 16 COUNTRIES" → "TERROIRS EXPLORED / COFFEES REPRESENTED · 97" ✓ (unchanged)
- roasters: "29 ROASTERS · 6 FAMILIES" → "ROASTERS EXPLORED / COFFEES REPRESENTED · 97" ✓ (unchanged)
- cultivars: "15 LINEAGES · 4 FAMILIES" (no more "97 BREWS") → "CULTIVARS EXPLORED / COFFEES REPRESENTED · 97" ✓
- processes: "3 BASE · 8 MODIFIERS · 3 SIGNATURES" (no more "97 COFFEES") → "PROCESSES EXPLORED / COFFEES REPRESENTED · 97" ✓ (sub-row now present)
- Verified at both 1024 and 390. ✓

**Six-actor:** UI-only (copy + which existing count is passed to an existing primitive). No trace required.

---

## Finding 6 (Item 4) — "Pure Honey (0)" zero-count chip on the Honey portal

**Files touched:** `app/(app)/processes/page.tsx` (`CorePortalCard`).

**Root cause:** the Honey portal rendered a "Pure Honey (0)" chip — a dead affordance that resolves to nothing.

**Fix (general rule, not Honey-specific):** gate the Pure chip on `hub.pure.length > 0`. This applies to every base's Pure chip. The combo chips are pre-filtered to `eligible` (count ≥ threshold, per `lib/process-aggregation.ts`), so Pure is the only variant that can reach 0.

**Verification (live):** `/processes` @ 1024 + 390 → zero `(0)` chips on the page (`Pure Honey (0)` gone). Non-zero chips intact: Washed keeps "Pure Washed (28)" / "Anaerobic (5)" / "Double Anaerobic… (3)"; Natural keeps "Pure Natural (21)" / "Anaerobic (5)" / "Dark Room Dried (3)". No other portal lost a non-zero chip. ✓

**Six-actor:** UI-only (a render conditional). No trace required.

---

## Finding (Item 5) — Open mobile menu doesn't mark the current destination

**Files touched:** **NONE — already implemented in `main`.**

**Outcome:** the mobile overlay in `components/Header.tsx` already applies the active treatment: `isActive(href) ? 'font-semibold text-latent-fg' : 'font-medium text-latent-mid'` — **identical to the desktop bar's** active treatment. `git blame` dates this logic to 2026-04/05, well before the 2026-06-20 audit; the audit's own `header-nav-390-open.png` screenshot in fact shows BREWS rendered bold/dark while the others are grey, contradicting the prose note "all 7 render at equal weight."

**Verification (live):** @ 390 on `/roasters`, menu open — `ROASTERS` computes `color rgb(14,14,14)` / `font-weight 600` (active); the other six compute `rgb(107,107,102)` / `500` (inactive). Confirmed visually (screenshot). ✓

**Conclusion:** no code change. Flagged for the coordinator walkthrough as **already-satisfied** rather than fabricating a redundant edit. If a *stronger* mobile active treatment than desktop is wanted, that's a new scope decision (beyond "match the desktop active treatment").

**Six-actor:** N/A (no change).

---

## /simplify outcome

- **Applied:** removed a redundant `.cultivar-tree .tree-row.species/.family/.lineage { grid-template-columns: auto 1fr }` re-declaration inside the new `@media` block — the base branch-row rule (specificity 0,3,0) already wins over the `@media` `.tree-row` rule (0,2,0); re-verified branch rows still render `auto 1fr` at 390.
- **Skipped:** consolidating the two `-webkit-line-clamp: 2` declarations (`.chip.clamp2` + the cultivar `.name`) into a new shared `.line-clamp-2` utility. The codebase's established house style inlines the clamp per selector (`.brew-card .flav`, `.green-card .face .line` both do); a new shared utility would be half-applied (inconsistent) or require refactoring those existing selectors outside this diff.
- Reuse / altitude / efficiency reviews: clean.

## PR

PR: _to be appended after the PR is opened_
