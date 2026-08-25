# Concentrated Pour-Over — Track 5: AeroPress Low-Pressure Branch (Research Project #8, Office Lane)

*Coffee Research · Latent · Research Project*

**Version:** 1.0 (scoped)
**Date drafted:** 2026-08-25
**Status:** SCOPED — coffee PRESUMPTIVE (Moonwake Project One Peach; operator verifies vials at office; substitutes: Guadalupe Hill / Project One Blue Iris — ping Coordinator before spawn if swapped)
**Location:** Office (Downtown Palo Alto)
**Coordinator session:** RP8 Coordinator (persistent)
**Prior tracks:** [T1 El Oasis](docs/research-projects/concentrated-pourover-t1-full-ladder.md) · [T2 Motta](docs/research-projects/concentrated-pourover-t2-motta-abbreviated-ladder.md) · [T3 Loud Giants valve](docs/research-projects/concentrated-pourover-t3-loud-giants-valve.md) · [T4 Chombi drops](docs/research-projects/concentrated-pourover-t4-chombi-postbrew-drops.md) (all CLOSED)

---

## ⚠️ LOAD-BEARING ROLE-DISCIPLINE RULE — READ THIS FIRST

You (the session executing this protocol) are the **Research Assistant** for this track. Your job is **execution + handoff brief production.** Your job is **NOT substrate integration.**

**DO NOT:**
- Edit `lib/*-registry.ts` files
- Edit `docs/skills/*/cluster/*.md` files
- Edit ADR files
- `git commit` / `git push` SUBSTRATE edits, merge to main, or `gh pr create` (the archive-persist commit of THIS doc is the ONE authorized exception)
- Run `npx tsc --noEmit` against substrate edits (you won't be making any)
- Call `push_brew` — brew-row archival is explicitly DEFERRED for this project
- Continue past the handoff brief to "finish the job"

**DO:**
- Read this doc in full BEFORE Step 0
- Walk the operator through Step 0 sub-steps to completion before any scored cup
- Run scored cups one-at-a-time (tool-call-per-cup pacing; serial cadence)
- Re-present the scoring rubric inside EVERY scored cup's tool call
- Capture friction + new lessons + audit items inline in this doc
- Produce a handoff brief per `docs/skills/research-coordinator/cluster/templates/handoff-brief-template.md`
- Commit + push THIS doc to your session branch at termination; report branch + SHA in the brief's `Archive location:` header
- TERMINATE the session after the handoff brief

Full primitive doc: `docs/skills/research-coordinator/cluster/role-discipline.md`

---

## Project Context

Track 5 of **Research Project #8 — Concentrated Pour-Over / High-Strength Filter** (office lane; WBC routine-differentiation bet), and the **low-pressure branch** — formally unlocked at T2's reproduction gate, hardware acquired, sequenced here by operator call. State of the project: 1:10 is the gravity/valve optimum on three coffees with the boundary at 1:9; valve-driven contact is the style's best current form (T3; tannin tax = grind-driven); the concentrate tolerates and benefits from finished-cup drops, with the locked office TONIK+JAMM dose winning blind at ~4× intensity (T4). This is the LAST mechanism track before project close-out shape (end-document → process retro → grilling item 56 drain).

**What this track tests:** the third non-grind contact mechanism — **immersion + slow press**. The operator has already run ~15+ home AeroPress brews in preparation (uncontrolled, no water optimization — deliberate play), which settled the platform decisions below and produced a lived seed recipe. This track transfers that recipe to a controlled office read on a track coffee with an archived control profile, TDS instrumentation, and the project's comparison discipline.

**Operator platform decisions (lived practice — these are settled, not up for re-litigation):**
- **Inverted brewing.** Upright leaks brew water. (Assistant: re-invert carefully; the Premium is the glass-chamber model — stable wide vessel, gentle press, stop if anything flexes.)
- **No flow-control cap.** Owned, tried several times, rejected on taste/feel. Parked.
- **Soup-style method:** tried, technique admired, cup not preferred. Parked.
- **Paper micro-filter** (project identity is paper-filtered clarity); gold-tone metal filter parked.
- **Seed recipe (operator's best, 3 brews on 2026-08-25 morning):** 20 g · EG-1 **7.0** · **89°C** · 150 g all at once (1:7.5) · stir just enough to wet the whole bed · **1 minute total steep** · re-invert · **very slow press lasting ~2 minutes** (the press IS contact time; total ~3 min). Read: "delicateness of a pourover with the concentrated intensity of a concentrated pour-over / soup shot without being too much." Operator note: 93–94°C over-extracted at home (likely the agitation), 90→89°C better.

**Championship prior art (external input, operator-reviewed — context, not contract):** 2022–2025 World AeroPress Champions share one architecture: 18 g / ~100 g chamber (≈1:5.5) / coarse / long immersion / gentle 20–40 s press / 60–80 g concentrate / **bypass to ~150–170 g (≈1:8–1:9 final)**. Pressure is secondary — press SPEED is the reproducible control (Ahrend 2025: 1–2 g/s output). **The sharpest differentiation fact in the whole project: every recent champion bypasses; RP8's style is defined as no-bypass undiluted.** The operator's build is closer to a percolation-adjacent full-volume press than the champion concentrate-and-bypass. This track's dilution arm (cup 3) tests that identity boundary EXPLICITLY — its answer feeds grilling item 56, whichever way it goes.

**~0.3–1.0 bar territory; force sanity:** chamber ≈ 26 cm², so 0.25 bar ≈ 6.6 kg of hand force. The 2-minute press is far below that. No pressure targeting — press speed by feel, output time recorded.

Vocabulary stays grilling item 56's. **No push_brew.** P8-AI-7/8 stay parked (low priority). Shimmy sieve (fines removal) explicitly OUT of this track — grind-distribution confound; it belongs to a future probe or the routine-construction project.

## Track-5 coffee (PRESUMPTIVE — verify at office before spawn)

| Field | Value |
|---|---|
| Coffee | **Moonwake — Project One Peach** (Catimor yeast-anaerobic natural, Yunnan; "Peach Oolong") — presumptive |
| Archived control brew ID | `7aef16d6-2ea3-482f-ac52-d7b9e31e7162` |
| Control (reference profile, DIFFERENT brewer — comparison is cross-mechanism, not same-bench) | Kalita + xBloom · 15 g / 225 g (1:15) · EG-1 6.3 · 96°C · Balanced Intensity · peach candy / pu'er / milky jasmine tea · peak cool <45°C ("any decision above 50°C would have been wrong") |
| Why this coffee | Most vials remaining (7 at 2026-07-30 inventory); dessert-register profile; **it PUNISHES fine-grind extraction pressure** (grind floor 6.3; pushing separated components + added astringency) — the ideal stress test for a coarse (7.0), cool (89°C), pressure-gentle mechanism. The coffee that vetoed the grind mechanism auditions the press mechanism. |
| Vials | **verify ≥4 true 15 g vials at Step 0** (RP8-N1 — and freezer stock is shared-space volatile: a coworker consumed Ngoma stock; physical count only) |
| Water | Plain PA tap, zero additions, whole track (mechanism baseline; T4's drops verdict is a separate serving-side layer, not re-tested here) |

**Coffee-specific cautions:** cooling-dependent integration is this coffee's defining trait — hot it reads disjointed/broken and that is NOT a mechanism failure; rung verdicts weight the cool read (<45°C). Watch whether the immersion-press concentrate compresses that (T1's stage-compression appeared on one coffee, not the other — coffee-dependent per T2).

## Hypotheses (pre-state before scoring)

- **H-press (mechanism baseline):** the operator's immersion-press recipe, scaled to 15 g, produces a coherent liked concentrate on the track coffee — the third non-grind contact mechanism validates on a controlled read.
- **H-boundary-m (the track's sharpest question):** 1:7.5 immersion-press is coherent where 1:9 collapsed under percolation — i.e., **the concentration boundary is mechanism-dependent, not ratio-intrinsic.** Cup 1 directly tests territory below the gravity boundary.
- **H-ratio (within-mechanism):** which ratio wins under immersion-press — 1:7.5 (lived recipe) or 1:10 (the project optimum)? Serial unblinded call, cup 1 vs cup 2.
- **H-dilution (the identity test):** blind split-cup — undiluted half vs diluted-back half (+~30% hot water, moving 1:7.5→~1:10-strength or 1:10→~1:13-strength). Does the no-bypass identity hold under blind tasting, or does the champion architecture have a point? *Answer feeds item 56 either way.*
- **H-fixed:** grind 7.0 · 89°C · 1-min steep · ~2-min slow press held constant on every cup — ratio and dilution are the ONLY variables. (This is the H5 analog: no flaw gets a grind/temp/steep fix by default; a deviation is an explicit logged exploratory decision.)

## Step 0 (run to completion BEFORE any scored cup)

1. **Vial count + fill-weight check (RP8-N1) — FIRST.** Physical count, weigh each; need ≥4 true doses. Under 4 → stop, re-plan with operator (coffee may swap; Coordinator patches).
2. **Coffee + control verification:** pull brew `7aef16d6` via MCP; confirm the reference profile above. (Reference only — different brewer; there is no rung-0 re-brew on this track: the comparison is cross-mechanism vs the archived profile + the T1–T4 concentrate corpus, both memory/record-based and tagged as such. RP8-N10 consciously waived — logged here, don't re-litigate.)
3. **Equipment:** AeroPress Premium + paper micro-filters on-site (gold-tone + flow-control cap stay in the drawer) · stable wide press vessel · EG-1 at 7.0 · Stagg EKG Pro at 89°C · timer.
4. **VST LAB III:** distilled blank, zero, record the NUMBER. Single read per cup (pre-split on cup 3). Sample convention unchanged.
5. **Water:** plain PA tap at the kettle, nothing added, whole track. Drops temptation → parked note (T4 already answered the drops question; don't re-run it inside this track).
6. **Method lock (walk it once verbally with the operator before cup 1):** invert · 15 g at 7.0 · pour target water at 89°C in one continuous pour · stir just to wet the bed (count the stirs, record) · steep to 1:00 total · cap with rinsed paper filter · re-invert onto the vessel · press very slowly, ~2:00 press duration target, stop at first sustained hiss · record actual press duration + liquid yield (RP8-N12 — yield at press stop, and per-half at split on cup 3).

## Design — 4 cups (5th = buffer if vials allow)

All cups: **15 g · EG-1 7.0 · 89°C · plain tap · inverted · wet-the-bed stir · 1:00 steep · ~2:00 slow press.** Only ratio and dilution vary.

| Cup | Vial | What | Purpose |
|---|---|---|---|
| 1 | 1 | **1:7.5** (15 g / 112 g) — the lived recipe, scaled | H-press + H-boundary-m (below the gravity boundary!) · TDS + yield |
| 2 | 2 | **1:10** (15 g / 150 g), same method | H-ratio — the project-optimum ratio under the new mechanism · TDS + yield |
| 3 | 3 | **Winner of 1-vs-2, split-cup blind:** undiluted half vs diluted-back half (+~30% hot same-kettle water to the treatment half; operator codes; forced pre-reveal pick; T4 split protocol verbatim — equal halves by weight, first sip both, reveal after pick) | H-dilution — the no-bypass identity test |
| R | 4 | **Later-day repeat of the overall winner** (undiluted form) | Reproduction discipline (protected vial — not skippable, not same-day-able) |
| (5) | buffer | If a 5th vial exists: operator's-call exploratory (press-speed contrast OR a 1:9 mid-rung) — rationale logged before brewing | Optional |

**Cross-mechanism scoring context (memory-based, tagged):** each cup gets a vs-archived-control impression AND a "vs the gravity/valve concentrates (T1–T4 character)" impression — explicitly cross-track memory, tag it.

**Cadence:** serial, ≤3/office day, unblinded except cup 3's split; actual brew date per cup; first sip before anything else (then park the cup and RE-READ COOL — this coffee's verdicts live <45°C); missed reads tagged (RP8-N7). Office capture trims pre-declared (single TDS read · no thermometer, stages by feel · press duration + yield ARE captured — they're this mechanism's load-bearing numbers, not ceremony).

## Scoring — per-cup record (rubric re-presented in EVERY cup's tool call)

1. **Build:** ratio / water g / 7.0 + 89°C confirm / stir count / steep end time / press duration (actual) / liquid yield / date.
2. **TDS** + ×archived-control-strength estimate + ~EY (mechanism-read only, RP8-N5).
3. **Staged sensory** hot / warm / cool (cool is the verdict stage on this coffee): aroma / attack / mid / body+texture / finish; texture explicit (the "delicate + concentrated" duality is the thing to describe); astringency/dryness line explicit (this coffee's known failure mode).
4. **Cup 3 split:** T4 protocol — grams per half, codes, dilution amount, forced pre-reveal pick + reason, reveal, post-reveal flagged.
5. **Flags:** disjointed-hot (expected, not a failure) · astringency · thinness · component separation (this coffee's pressure signature) · any new failure shape (RP8-N6).
6. Friction / lessons / audit items inline.

## Exit conditions (track close)

1. Cups 1–3 + R executed (buffer optional).
2. H-press / H-boundary-m / H-ratio / H-dilution / H-fixed each resolved with evidence pointers; H-boundary-m gets a plain-language verdict (boundary mechanism-dependent: yes / no / unresolved).
3. Winner named (recipe + TDS + yield + staged profile); repeat verdict explicit (±0.05% + profile, RP8-N7 tag check).
4. **Project-level mechanism map statement:** with grind (T1/T2), valve (T3), drops (T4), and press (T5) all read — the brief states the style's best form(s) and where each mechanism belongs. This is the close-out-shaping paragraph: it feeds the end-document, the retro, and item 56's drain.
5. Handoff brief per template, incl. candidate substrate specs (SPECIFIED, not applied), close-out guidance (end-doc → retro → item 56), and RP8-N candidates.
6. This doc committed + pushed; branch + SHA in the brief header.

## What this track does NOT do

No push_brew · no vocabulary locking · no water variables or drops (T4 closed that) · no flow-control cap, gold-tone filter, soup method, or Shimmy sieve (all parked) · no grind/temp/steep/press-speed moves on scored cups (H-fixed; buffer cup is the sanctioned exception) · no pressure targeting (speed by feel, duration recorded) · no substrate edits.

## Known confounders & limitations

- Cross-mechanism comparisons are memory/record-based (different brewer than every prior track) — directional, tagged.
- The archived control is a different brewer AND this track skips a fresh control re-brew (budget + no same-brewer control exists) — RP8-N10 waived, logged.
- Press "slow" is by feel; duration + yield are the reproducibility anchors (RP8-N9 analog: ONE bench-free parameter, recorded as a number).
- This coffee's cooling-dependence means early reads mislead by design — the cool re-read is mandatory before any verdict.
- Single coffee; single reads except the split pair and the repeat.

## Notes / friction / lessons / audit items (Assistant fills inline)

*(empty at scoping)*

---

## SESSION RECORD

*(Assistant appends per-cup records + handoff brief here at execution)*
