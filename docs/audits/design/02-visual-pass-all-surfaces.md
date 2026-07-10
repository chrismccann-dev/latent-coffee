# Design audit 02 - visual pass, all surfaces

> **Evidence:** captured live in-session via the Claude Code preview instrument (screenshots + DOM measurements embedded in the session transcript, session of 2026-07-09). Unlike run 01 there is no Dropbox PNG archive - every load-bearing claim below is backed by a *DOM measurement* quoted inline (scrollWidth, computed styles, grid-template-columns), which is the stronger evidence per D1. Shot names below are logical labels for the transcript captures.

Read-only visual/UX audit of every app surface (index + a representative detail, at 390 and 1024) plus the global header. Second run of `/design-review`; the first is [01-visual-pass-all-surfaces.md](docs/audits/design/01-visual-pass-all-surfaces.md) (2026-06-20). **This doc is the deliverable; no code was changed.**

- **Date:** 2026-07-09
- **Method:** logged into the live preview (`npm run dev` in the worktree, main-repo node_modules symlinked), drove the preview browser at true 390 and 1024 viewports, measured overflow as `scrollWidth - clientWidth` on every surface, inspected computed styles for every claimed defect, and held every surface against every other.
- **Critique baseline:** [docs/design-system.md](docs/design-system.md), CLAUDE.md § Design / UX conventions, [ADR-0018](docs/adr/0018-per-surface-mobile-pattern.md), plus audit 01 + its [execution log](docs/audits/design/01-execution-log.md) so shipped fixes and documented exceptions are not re-reported.
- **Surfaces covered:** `/terroirs` · `/cultivars` · `/processes` · `/roasters` · `/producers` · `/brews` · `/green` + `components/Header.tsx`.
- **Headline:** **the app is no longer broken anywhere - every surface measures overflow 0 at 390** (audit 01's two sideways-scrolling pages are fixed and holding). All five audit-01 Batch-1 fixes re-verified live. What remains splits cleanly in two: (a) the **deferred Producers index reshape** (audit-01 Findings 2+4), still the app's only structural inconsistency and now re-measured larger; (b) a set of **small cross-surface conventions that never got ratified** - where the corpus count lives on a detail page, how the extraction strategy is cased, one primitive misfit on the producer DECISION strip.

## 0. Fix verification (re-measure the seed)

Every audit-01 shipped fix was re-measured live before this pass looked for anything new:

| Audit-01 finding | Status today (measured) |
|---|---|
| 1 - `.chip` 390 overflow | **HOLDING.** All 7 index surfaces + all 6 detail families measure `overflow: 0` at 390. The pathological chip ("Double Anaerobic + Thermal Shock + Yeast Inoculated (3)") wraps to 3 lines. |
| 8 - cultivars tree truncation | **HOLDING.** 54 tree leaf names at 390, `clippedCount: 0`; both Ethiopian landrace entries fully distinguishable. |
| 3 - index-header corpus count | **HOLDING.** All four aggregation indexes render the same `<X> EXPLORED / COFFEES REPRESENTED · 102` sub-row, count stated once each. |
| 6 - zero-count chips | **HOLDING.** Zero `(0)` chips on `/processes` (live query returned `zeroChips: []`). |
| 7 - DECISION duplicate cells | **FIXED.** BUY POSTURE ("Compare future lots to the reference") and NEXT ACTION ("Re-source if a new lot fits the apex; otherwise retire.") now carry distinct copy. |
| 5 - cultivars mono leaves | Documented exception (design-system.md § Type scale); left alone, correctly. |
| 2 + 4 - Producers index grammar + filter chrome | **STILL LIVE, deferred by triage.** Carried forward below with fresh measurements. |

---

## 1. Lead recommendation

**Do this first: schedule the deferred Producers index consistency sprint (audit-01 Findings 2+4) - and take the small new DECISION-strip fix (Finding 2 below) with it as the warm-up.**

Nineteen days after audit 01 deferred the Producers reshape "pending intent," it is now the *only* structural inconsistency left in the app, and it has grown: **141 dossier cards, 21,936px tall at 1024 and 48,473px at 390** (every sibling index is 2,400-2,900px), with an always-expanded 6-pill + search + 3-dropdown filter stack that no other surface has and that ignores the ratified chrome-collapse pattern at 390. Everything else this pass found is S-effort polish. The blocker is not code, it is the unanswered open question from audit 01 (how much per-card richness is load-bearing sourcing-forward design) - so the decisive move is to *answer it and execute*, not to keep carrying the deferral forward audit after audit. Until it lands, the app has four indexes that read as one product and one that reads as another.

The **best new finding** (and the cheapest real defect) is the producer DECISION strip: it borrows the brew-recipe KV primitive (`ssp-rcphead`, three fixed ~107px columns at 390) for prose-length values, so mobile renders one word per line. One-surface fix, measured root cause, S effort.

---

## 2. Cross-surface consistency findings

### Finding 1: Corpus-count home drifts across the detail-page families   [MEDIUM impact]
- Surface(s): `/roasters/[id]` · `/producers/[id]` · `/green/[id]` vs `/terroirs/[id]` · `/cultivars/[id]` · `/processes/[id]` · Viewport: both
- Evidence: live topbar/section-head text reads (no screenshot needed - text-measured):
  - roaster topbar: `9 COFFEES · Clarity-First family` **and** Coffees section head: `...From This Roaster - 9 coffees` (count stated **twice** on one page)
  - producer topbar: `5 COFFEES · COLOMBIA` · green topbar: `RWA-NOVA-AN10-RB-2026 · 3 ROASTS`
  - terroir topbar: `Brazil` only (count only in the Coffees section head) · cultivar topbar: `Arabica` only (same)
  - process hub topbar: `Base Process` only - count lives in a **third** home, the nameplate meta (`COFFEES 47`)
- What I see now: `SspTopBar` has a dedicated `count` slot (props renamed `id/count/anchor` in the polish-audit sprint precisely to name these slots). Two of the five aggregation families fill it, two leave it empty and rely on the Coffees section head, and one (process) invents a nameplate row. Roaster fills it *and* keeps the section-head count.
- Why it's a problem: the topbar is the identity strip - "how much evidence backs this page" is the same question on all five aggregation families, answered in three different places. Same class of drift as audit-01 Finding 3 (which unified the *index* count row); the detail layer never got the same pass.
- Design-system fit: "Topbar = identity. Hero meta = differentiation. Never duplicate" (design-system.md § Detail-page composition rules) - the count slot exists; the convention for *when it's filled* was never written down.
- Proposed change: ratify one rule - the topbar count slot carries the corpus count on every aggregation detail (`N COFFEES`), the Coffees section head keeps its local count (it labels the list), and the process-hub nameplate `COFFEES` row goes away. Roaster's double-statement is then consistent (topbar = page evidence, shead = list label) or trimmed - operator's call, see Open Questions.
- Effort: S · Risk of regressing the system: Low
- Cross-surface: all five aggregation detail families + green.
- Layer: UI-only (Actor 6)

### Finding 2: Producer DECISION strip misuses the recipe-head primitive - prose in ~107px columns at 390   [MEDIUM impact]
- Surface(s): `/producers/[id]` detail · Viewport: 390 (1024 is acceptable)
- Evidence: producers-detail-390 capture; measured live: the DECISION grid is `class="ssp-rcphead"` with computed `grid-template-columns: 106.664px 106.664px 106.664px` at 390; cell width 107px.
- What I see now: the dark DECISION card renders 5 cells (LATENT FIT / BUY POSTURE / PRIMARY RISK / EVIDENCE LEVEL / NEXT ACTION) through `SspKVStrip`/`ssp-rcphead` - the primitive built for the brew recipe's terse values (`15g`, `225g`, `1:15`). Producer values are sentences ("Re-source if a new lot fits the apex; otherwise retire."), so at 390 every value wraps one word per line ("Process- / forward / stylized") down a ~1,600px-tall strip of ragged columns.
- Why it's a problem: this is the mobile-as-forcing-function law losing to a primitive default. The content is the page's narrative anchor (correctly dark) but is unreadable at exactly the width where a sourcing decision would be checked on the go. The recipe head works because its values are data atoms; these are prose.
- Design-system fit: the fix is inside the established family - either a stacked mode at the narrow width (`SspInset` already has grid/stack modes; `SspProseRows` is the prose-row primitive) or a container-query column drop on `.ssp-rcphead` when values exceed a length. No new token.
- Proposed change: at the narrow width, render the DECISION content as stacked label/value rows (one per line, full width); keep the 3-column strip at 1024. Choose the mechanism from the existing `Ssp*` members rather than a bespoke grid.
- Effort: S-M · Risk of regressing the system: Low (guard the brew recipe head - short-value strips must keep their 3-column shape)
- Cross-surface: only producers puts prose in `ssp-rcphead` today; the fix prevents the next surface from repeating it.
- Layer: UI-only (Actor 6)

### Finding 3: Extraction-strategy signal renders as two different primitives with two casings   [LOW impact]
- Surface(s): `/brews` index vs `/brews/[id]` detail · Viewport: both
- Evidence: measured live on the same brew: index cover badge renders `HYBRID` (uppercase, StrategyPill short-form); detail nameplate renders `class="chip coral"` with computed `text-transform: none`, mixed-case `Hybrid`, 10.5px - sitting in the same pill row as two `class="status"` pills that compute `text-transform: uppercase`, 9.5px.
- What I see now: one signal (extraction strategy), three renders: uppercase cover badge, uppercase filter pill, mixed-case content chip on the detail nameplate - the last one visually breaking the row it sits in (PURCHASED · ROAST · LIGHT · Hybrid).
- Why it's a problem: "Uppercase mono for every label, nav item, badge, pill" (design-system.md § Voice & casing). Chips carrying *content vocabulary* (flavor notes, process names) are legitimately mixed-case; the strategy is a classification signal rendered as a status everywhere else.
- Design-system fit: `StrategyPill` is the canonical strategy render (design-system.md § Component primitives); the nameplate appears to bypass it for a raw `Chip`.
- Proposed change: render the nameplate strategy through the same treatment as its status-pill siblings (uppercase, status sizing), keeping the strategy hue. If the mixed-case chip is a deliberate "strategy is vocabulary, not status" stance, document the exception instead.
- Effort: S · Risk of regressing the system: Low
- Cross-surface: brews only today, but the pill-row pattern (status + chips mixed) also appears on green nameplates - a ratified casing rule keeps the next surface honest.
- Layer: UI-only (Actor 6)

### Finding 4: Process-hub nameplate meta repeats the h1 and the topbar anchor   [LOW impact]
- Surface(s): `/processes/[id]` hub pages · Viewport: both
- Evidence: measured live on `/processes/washed`: topbar = `Base Process / Process Hub`, h1 = `Washed`, nameplate meta = `BASE PROCESS: Washed · COFFEES: 47`.
- What I see now: the meta row restates the page title verbatim under itself and restates the topbar's category anchor as its label. Zero differentiating information; sibling detail pages use the meta row for genuinely differentiating attributes (FAMILY/LINEAGE on cultivar, ADMIN REGION/ELEVATION/CLIMATE on terroir).
- Why it's a problem: "Topbar = identity. Hero meta = differentiation. Never duplicate" - this is the exact pattern the polish-audit dedupe sweep removed from 5 other surfaces (2026-06-11); the process hub was missed.
- Design-system fit: covered by the existing composition rule; no new anything.
- Proposed change: drop the `BASE PROCESS: Washed` meta row; the `COFFEES: 47` row moves to the topbar count slot per Finding 1.
- Effort: S · Risk of regressing the system: Low
- Cross-surface: process hubs only (variant pages carry real meta).
- Layer: UI-only (Actor 6)

### Finding 5: Duplicate flavor chip renders verbatim ("Grape · Grape · Dark Chocolate")   [LOW impact]
- Surface(s): `/brews` index cover + `/brews/[id]` detail flavor axis · Viewport: both
- Evidence: brews-index-390 capture (first card, 74165); measured live on the detail: the Flavor Notes block renders two identical `chip green` elements, text `Grape`, no `title`, no modifier anywhere in the DOM; the section head says "3 notes".
- What I see now: the same flavor note twice, on both the cover line and the detail chips - nothing distinguishes them at any width.
- Why it's a problem: photographs as a bug ("is my data double-written?") on the app's front page. Either the `flavors` jsonb genuinely holds a duplicate base with no modifier (a write-path validation gap in `push_brew`) or two entries differ only by modifiers that no surface renders - in which case the render drops the only disambiguating information.
- Design-system fit: n/a (data shape, not chrome).
- Proposed change: **a decision, not a fix** - first inspect the row's `flavors` jsonb. If a true duplicate: dedupe the row + consider a same-base-same-modifiers guard in the import path. If modifier-differentiated: render the modifier when it is the only disambiguator.
- Effort: S · Risk: Low
- Cross-surface: any brew with duplicate bases; only this row visibly today.
- Layer: **implies a data/IA change** (six-actor trace at execution: `lib/brew-import.ts` validation + MCP `push_brew` schema description if a guard is added)

### Finding 6: "Roasters Reference Brew Recipe" - missing apostrophe   [LOW impact]
- Surface(s): `/roasters/[id]` detail section head · Viewport: both
- Evidence: no screenshot - text-measured; the section head DOM text is `Roasters Reference Brew Recipe`.
- What I see now: a possessive without its apostrophe, in a first-person research notebook whose other heads are grammatically careful ("Coffees I Have Brewed From This Roaster", "What I've Learned...").
- Why it's a problem: copy polish on a mature surface; reads as a typo.
- Design-system fit: § Voice & casing (first-person research notebook).
- Proposed change: `Roaster's Reference Brew Recipe` (or `Reference Brew Recipe` - the page context already says whose).
- Effort: S · Risk: Low · Cross-surface: roasters only.
- Layer: UI-only (Actor 6)

### Carried forward (deferred, not new): Producers index grammar + filter chrome (audit-01 Findings 2 + 4)   [HIGH impact]
- Fresh measurements (2026-07-09): 141 producer cards; page height **21,936px at 1024** and **48,473px at 390** (siblings: 2,400-2,900px); the filter apparatus (6 toggle pills + search field + 3 dropdowns) renders fully expanded at 390 with no `FILTERS ▾` collapse, occupying the screen above the first card; the dossier-card density is unchanged since audit 01.
- Status: deferred at audit-01 triage pending the sourcing-forward intent decision (audit-01 Open Question 1). Not re-argued here - see Lead recommendation: answer the question and execute, or ratify the divergence explicitly so future audits stop flagging it.
- **CLOSED 2026-07-09 (Producers index reshape sprint).** Intent answered: the index's job is filtered scanning; dossier reading belongs to the detail page. Default view = Priority targets (23 cards, ~4,300px at 1024), terse single-column cards at `max-w-3xl`, facet row behind `FILTERS ▾` below lg, Needs enrichment demoted to a muted end-of-row pill, Indexed pill dropped. Detail page untouched. See [page-ia.md § Producers](docs/architecture/page-ia.md).

---

## 3. Per-surface walk

### `/brews`
Index: book-cover grid clean at both widths, `FILTERS ▾` collapses correctly at 390, strategy filter pills read well at 1024. Detail: still the strongest workflow-companion surface - dark recipe anchor, amber pour timeline, collapsed Additional Information. Participates in Findings 3 (strategy casing) + 5 (duplicate chip, first card).

### `/green`
Index: lifecycle sections ordered active-work-first (Waiting for next roast → Resolved → Unresolved → In inventory 38 lots), tile colors reading exactly per IA principle #3; overflow 0 at 390. Detail (waiting-for-roast): hero binds lifecycle green, Roast Hypothesis table leads, amber drop accents - textbook. No findings.

### `/terroirs`
Still the reference implementation of the grouped-list index. Detail clean. Participates in Finding 1 (no topbar count).

### `/cultivars`
Tree healthy at 390 post-fix (0 of 54 names clipped). Detail clean. Participates in Finding 1. One content observation routed to Open Questions (synthesis capsule's last bullet reads truncated).

### `/processes`
Index: portals + modifier index clean at both widths; no zero-count chips. Hub detail: participates in Findings 1 + 4 (nameplate duplication). Note: the Honey portal now renders *no* chips at all (0 pure suppressed, no combo above threshold) - correct behavior of the ratified suppression rule, see Considered-and-left-alone.

### `/roasters`
Index clean; family hue separation good. Detail: roaster exception rendering correctly (Coffees list primary, synthesis collapsed). Participates in Findings 1 (double count) + 6 (apostrophe). Topbar wraps to two lines at 390 with a hanging `·` separator - cosmetic, below finding threshold.

### `/producers`
Detail: strong page; DECISION de-dup landed; prose sections read well; participates in Finding 2 (DECISION strip at 390). Index: carried-forward deferral (above).

### Header
7 destinations, active state bold at desktop and in the mobile overlay (re-verified live - the audit-01 phantom stays dead). Hamburger is the sanctioned drawn SVG. No findings.

---

## 4. Considered-and-left-alone

Things that look "off" at a glance but are intentional. **Execution session: do not "fix" these.**

- **The Honey portal has no chips at all** ("0 pure · 10 modified", zero chip affordances). This is the audit-01 Finding-6 suppression rule working as ratified - the eligible-combo threshold plus zero-pure gate leaves nothing to render. Do not re-add zero-count chips; the chips return when the data does.
- **Cultivars mono leaf names.** Documented exception (design-system.md § Type scale, design-audit 01). Stays.
- **Roaster index swatches are identical within a family.** The swatch encodes the *family* hue (the signal); per-roaster discrimination was never the design. Not a defect.
- **The detail column looks left-pinned in scaled screenshots at 1024.** Measured: `.ssp-page` is perfectly centered (margins 99px / 99px around the 820px column at a 1018px client width). A screenshot-scaling artifact - D1's "a claimed defect was false" catch, run 02 edition.
- **The synthesis capsule renders 2 paragraphs + takeaway bullets before the `FULL SYNTHESIS` disclosure.** That IS the short-form capsule (capsule inversion, 2026-06-11); its length is corpus-tier-driven, not a failure to collapse.
- **Green's "In inventory" section (38 lots) renders last despite being the largest.** Active-work-first lifecycle ordering is the IA; inventory is the archive tail. Correct.
- **`/brews/[id]` topbar carries date + roaster, no count.** Single-entity page - the count slot is legitimately N/A; Finding 1 is about aggregation families only.
- **Producers dossier density at 1024.** Under the deferred intent decision; don't partially reshape it in a polish batch.

---

## 5. Open questions (need Chris's judgment)

1. **The Producers deferral (Lead).** The intent question from audit 01 is still open. Decide it: (a) row-density reshape into the index family, (b) a systematized dense card + collapsing filter chrome, or (c) ratify Producers as a sanctioned divergent surface and document it so audits stop flagging it.
2. **Count-home canon (Finding 1).** Topbar count slot on every aggregation detail? And does roaster keep the shead count too (topbar = page evidence, shead = list label) or state it once?
3. **Strategy casing (Finding 3).** Align the detail nameplate strategy to the uppercase status treatment, or document mixed-case-chip-as-vocabulary as deliberate?
4. **Cultivar synthesis capsule truncation.** The Red Bourbon capsule's final bullet ends mid-thought ("...the decisive lever on natural lots: clamping"). If short-form generation is clipping on `max_tokens`, that's a synthesis-pipeline check (`buildShortFormPrompt.ts` budget), not a UI edit - route to a pipeline look, not the execution batch.
5. **Duplicate Grape (Finding 5).** Inspect the row: true duplicate (dedupe + write guard) or modifier-differentiated (render the modifier)?

---

## 6. Effort / impact summary

| # | Finding | Surface(s) | Impact | Effort | Risk | Layer |
|---|---|---|---|---|---|---|
| CF | Producers index grammar + filter chrome (audit-01 F2+F4, deferred) | producers | **HIGH** | L | Med | UI (+intent decision) |
| 2 | DECISION strip: prose in ~107px recipe-head columns at 390 | producers detail | MEDIUM | S-M | Low | UI |
| 1 | Corpus-count home drift (topbar vs shead vs nameplate) | 5 aggregation details + green | MEDIUM | S | Low | UI |
| 4 | Process-hub nameplate repeats h1 + topbar anchor | processes hub | LOW | S | Low | UI |
| 3 | Strategy signal: two primitives, two casings | brews | LOW | S | Low | UI |
| 5 | Duplicate flavor chip renders verbatim | brews | LOW | S | Low | **data** (trace at execution) |
| 6 | "Roasters" missing apostrophe | roasters detail | LOW | S | Low | UI |

**Suggested sequence:** answer Open Question 1 and run the Producers sprint (CF) with Finding 2 as its warm-up · then one small "detail-chrome consistency" batch = Findings 1 + 4 + 3 + 6 (all S, all UI-only, one PR) · Finding 5 starts with a data inspection, not an edit.

---

*Method note: run 02 verified all five audit-01 shipped fixes before looking for new findings (§0), per the spine's re-measure-the-seed rule. All measurements taken live against the preview on 2026-07-09 at true 390 + 1024 CSS viewports.*
