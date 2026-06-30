---
name: design-review
description: Read-only visual/UX audit across app surfaces — screenshots at 390+1024, critiques against the project's own design system, and emits a findings report (cross-surface consistency + per-surface walk + considered-and-left-alone + decisive lead) then stops, never editing code.
disable-model-invocation: true
---

<what-this-is>

`design-review` runs one read-only visual/UX audit across the app's surfaces and produces an implementation-ready findings report. It **follows the [review-skill spine](.claude/skills/review-skill-spine.md)** (READ-ONLY stop-at-report · re-measure the seed · mandatory considered-and-left-alone · decisive lead · compose-don't-duplicate); the D1-D8 rules below are its **visual/UX specialization**, every one a lived correction from the first run ([docs/audits/design/01-visual-pass-all-surfaces.md](docs/audits/design/01-visual-pass-all-surfaces.md), 2026-06-20) + its execution, not theorized. It is the visual-design sibling of `/architecture-review`, but a **cross-surface sweep by default**: a visual pass's value concentrates in the inconsistencies *between* surfaces (a chip styled three ways, a header count labelled four ways), not within one file.

Two spine invariants take a sharp form here, plus the domain hard rules:
- **D6 (considered-and-left-alone) - it protects deliberate choices.** On a mature design half the value is the leave-alone calls - they stop the execution session from "fixing" an intentional decision (run 01 left the synthesis-light card, the book-cover proportion, the cultivars ASCII tree alone).
- **D8 (decisive lead) - it takes a side on the real ones.** Opens with "**Do this first:** ...", scopes each finding, states cost of inaction, never edits.
- **D2 (domain) - critique against the project's OWN design system, not generic taste.** A finding that fights an intentional convention is a non-finding - it goes in `Considered-and-left-alone`. (And **D1: measure, don't eyeball** - "looks off" is a hypothesis; in run 01 a *claimed* defect was false.)

</what-this-is>

<vocabulary>

- **Surface** - an index or detail page family; the unit of the sweep.
- **Cross-surface consistency** - whether sibling surfaces render the same concept the same way. The heart of a visual pass; its own first-class report section.
- **Priority stack** - the `primary / secondary / tertiary` content ranking (never "tiers" - the term collides with corpus/strictness/sub-skill tiers). The detail-page grammar in [docs/design-system.md](docs/design-system.md).
- **Design-system fit** - whether a token / primitive / convention already covers a finding (the visual analog of arch-review's adoption-gap fork). Cite the file.
- **Considered-and-left-alone** - the deliberate choices a finding must NOT touch.
- **Layer** - `UI-only (Actor 6)` vs `implies a data/IA change` (the latter routes OUT to a grill/feature and a six-actor trace, not the execution batch). The escalation tag.

</vocabulary>

<the-process>

## Step 0 - Re-measure the seed (D1). Do this first, every time.

The surface brief / prior counts / a "looks off" hunch are hypotheses. In run 01 the chip overflow was a precise live measurement (`scrollWidth` 543 and 471, not eyeballed), and a *claimed* defect - the open mobile menu "renders all 7 destinations at equal weight" - turned out **false**, contradicted by the audit's own screenshot (BREWS was already bold). Measure live with `preview_eval`; treat every seed claim as folklore until measured. **A finding that can't be measured or pointed at in a screenshot is not yet a finding.**

## Step 1 - Orient (read-only)

Read the design substrate before the surfaces: [docs/design-system.md](docs/design-system.md) (token map / palette / primitives / detail-page grammar / chrome exceptions), [CLAUDE.md](CLAUDE.md) § Design / UX conventions, [docs/adr/0018-per-surface-mobile-pattern.md](docs/adr/0018-per-surface-mobile-pattern.md) (the 390+1024 container-query model), and the relevant [docs/architecture/page-ia.md](docs/architecture/page-ia.md) section. The deliberate choices live here. A finding that fights one (dark-vs-light semantics, hue-not-lightness, the priority stack, the book-cover proportion) is a non-finding.

## Step 2 - Capture: the mechanical scan (D3)

There is **no standing CI gate** for visual design (you can't cheaply detect "inconsistent header counts" in CI) - unlike arch-review's `check:hotspots`, **the preview pass IS the mechanical instrument.**

- `preview_start`; authenticate using the **Dev preview login** memory (`reference_dev_login.md`) via `preview_fill` + `preview_click`.
- For every surface: the index AND a representative detail (navigate the index, click the first card - don't hardcode IDs), at **BOTH 390 and 1024** (`preview_resize`). Latent's surfaces: `/terroirs` `/cultivars` `/processes` `/roasters` `/producers` `/brews` `/green` + the global header (`components/Header.tsx`). ~30 shots.
- **Save every PNG** with a `<surface>-<index|detail>-<viewport>.png` name. Screenshots are the evidence the triage step judges against. (Per the run-01 corpus policy: report markdown lands in `docs/audits/design/`; the heavy PNGs go to Dropbox, out of git - see the worked example's header note.)
- Measure overflow as `document.documentElement.scrollWidth` vs the viewport width. Zero overflow at 390 is the foundational guarantee (ADR-0018); a sideways-scrolling phone is the app breaking its own first law.

## Step 3 - Critique pass: the design-critique lens + Latent dimensions (D4)

For each surface, after capturing its screenshots:
- Run the **`design:design-critique`** skill on them as the structured lens (usability / hierarchy / consistency).
- Then layer the project-specific dimensions the generic skill can't know:
  - **design-system adherence** - does a token/primitive/convention already cover this? cite it.
  - **priority-stack correctness** - primary leads / never collapses, tertiary collapses (the detail-page grammar). Note the surface exceptions (the roaster page inverts the default).
  - **hue-not-lightness** for semantic signals.
  - **the 390 forcing function** - overflow, truncation, chrome eating the first screen.
- **Hold every surface against every other for consistency drift.** This is where the value concentrates (run 01: 5 of its 8 findings were cross-surface).

## Step 4 - Classify each finding's layer (D5), BEFORE scoring

Tag every finding **`UI-only (Actor 6)`** or **`implies a data/IA change`**. The latter is a **decision, not a fix** - it routes OUT to a grill / feature scope and a six-actor trace, *not* the execution batch. Run 01's Finding 7 (a duplicated DECISION cell) looked like a copy bug but was a derivation gap that became its own substrate feature (close-lot producer-disposition capture). This is the visual analog of arch-review's "a decision, not a refactor" gate. Don't force an escalation into the execution batch; don't cite this to dodge a genuine UI fix.

## Step 5 - Finding cards (v1 format)

One card per finding:

```
### Finding N: <short title>   [HIGH | MEDIUM | LOW impact]
- Surface(s): <pages>  · Viewport: 390 | 1024 | both
- Evidence: <screenshot name(s)>   - REQUIRED when the issue is visible in a shot. If the
  finding is inherently non-visual (a copy / IA / density note that doesn't photograph), write
  "no screenshot - <reason>" and KEEP it. Never drop a real finding for lack of an image.
- What I see now: <grounded in the screenshot / live measurement>
- Why it's a problem: <hierarchy / density / consistency / readability / mobile / polish>
- Design-system fit: <does a token/primitive/convention already cover this? cite the file>   (D2)
- Proposed change: <plain English visual direction, NO code>
- Effort: S|M|L · Risk of regressing the system: Low|Med|High
- Cross-surface: <does this pattern repeat elsewhere? where?>
- Layer: UI-only (Actor 6) | implies a data/IA change (six-actor trace at execution)   (D5)
```

`Proposed change` is **plain English, never code** - this is a scoping report, not a patch.

## Step 6 - Considered-and-left-alone (D6, mandatory)

A first-class section listing what looks "off" at a glance but is intentional, each naming the convention that protects it (run 01: synthesis renders light per its secondary rank + the capsule inversion; the book-cover proportion; the cultivars tree expressing genuine 4-level depth). **Execution session: do not "fix" these.** Kill the bad ideas explicitly - the doc-pruning "kill bad ideas" discipline, verbatim.

## Step 7 - The durable report (D7)

Structure, in order: **Lead recommendation** (the single highest-leverage move, as a stance) -> **Cross-surface consistency findings** (the heart) -> **Per-surface walk** (1-2 line read each, then its cards) -> **Considered-and-left-alone** -> **Open questions** (what needs the operator's judgment) -> **Effort/impact summary table**. Write it to `docs/audits/design/NN-<scope>.md`.

</the-process>

<the-downstream-flow>

The skill **stops at the report.** The lived end-to-end (run 01) is a three-phase coordinator flow - document it so the operator can reproduce it:

1. **Triage** (operator + a coordinator thread): kill the not-worth-it findings, decide the escalations, answer the open questions. Producers index reshape and the close-lot feature were *deferred* here; the clean wins batched.
2. **Execution** (a separate session): implement the approved batch, verify each finding against its named live check, run `/simplify`, `npm run build` (tsc), open a PR, **stop before merge**.
3. **Walkthrough** (back in the coordinator): confirm against the verification lines, then merge.

**Execution-side discipline (D1, applied at execution).** The execution session must **re-verify each finding against its screenshot / live state before editing.** An audit's prose can contradict its own evidence (run 01's phantom mobile active-state - already implemented in main; the execution session caught it via `git blame` + the audit's own screenshot and refused to fabricate an edit). **"Already satisfied, no change" is a valid, valuable outcome, not a failure.** Compose - don't restate `/simplify` or the preview verification workflow.

</the-downstream-flow>

<verification-and-safety-net>

Latent has no test suite - the net is **preview verification + tsc**. Each finding card's evidence + the `Why it's a problem` measurement IS its verification matrix (name the live check: `scrollWidth` at 390, the two indistinguishable cultivar names, the four index headers). A visual pass is usually **UI-only (Actor 6) - no six-actor trace**; say so per finding. A finding tagged `implies a data/IA change` DOES need the six-actor trace at execution (per [CLAUDE.md](CLAUDE.md) § Cross-system audit).

</verification-and-safety-net>

<stop-condition>

The audit session **stops at the report.** Do not edit code. End with: the decisive lead recommendation, the finding cards, the considered-and-left-alone list, the open questions, and the effort/impact table. Print the lead + the impact table in the final message so the path is visible.

</stop-condition>

<worked-example-corpus>

- [docs/audits/design/01-visual-pass-all-surfaces.md](docs/audits/design/01-visual-pass-all-surfaces.md) - the first run (all 7 surface families + header). Establishes the cross-surface emphasis, the considered-and-left-alone discipline, the layer-escalation (Finding 7 -> the close-lot disposition feature), and the phantom-finding catch (header active-state). Screenshots archived in Dropbox per the report header.
- [docs/audits/design/01-execution-log.md](docs/audits/design/01-execution-log.md) - the Batch-1 execution record: per-finding verification lines + the "already satisfied, no change" outcome that proves D1 at execution.

</worked-example-corpus>

<relationship-to-the-rest>

- **Operator-invoked, no cron, no feature-ship coupling** - visual judgment is interpretive (the considered-and-left-alone calls can't be automated). Unlike `/architecture-review`, there is **no standing CI gate**; the preview pass is the per-run instrument.
- **Compose, don't duplicate:** `design:design-critique` is the structured lens, the `preview_*` tooling is the instrument, `/simplify` runs execution-side. This skill orchestrates them and keeps the project-specific judgment they can't.
- **Sibling of `/architecture-review`** (code structure) and the doc-pruning mechanism (doc substrate) - same operator-invoked, judgment-heavy, kill-bad-ideas-and-push-the-real-ones character. Reach for arch-review when the smell is structural (duplication, mixed-concern files); reach for design-review when the smell is visual (hierarchy, density, cross-surface inconsistency).

</relationship-to-the-rest>
