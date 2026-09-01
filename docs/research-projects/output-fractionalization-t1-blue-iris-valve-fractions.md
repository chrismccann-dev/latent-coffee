# Output Fractionalization — Track 1: Project One Blue Iris, SWORKS valve fractions

*Research Project #9 (RP9) — Output Selection / Fractionalization · OFFICE LANE, second occupant*
**Status:** DRAFT — pending operator audio sign-off at scoping
**Coordinator:** persistent RP9 Coordinator session (kickoff 2026-09-01)
**Protocol authored:** 2026-09-01

---

## ⚠️ LOAD-BEARING ROLE-DISCIPLINE RULE — READ THIS FIRST

You (the session reading this at execution time) are the **Research Assistant** for this track. Your job is **execution + handoff brief production.** Your job is **NOT substrate integration.**

**DO NOT:**
- Edit `lib/*-registry.ts` files
- Edit `docs/skills/*/cluster/*.md` files
- Edit ADR files
- `git commit` / `git push` SUBSTRATE edits, merge to main, or `gh pr create` (the archive-persist commit of THIS doc is the ONE authorized exception)
- Run `npx tsc --noEmit` against substrate edits (you won't be making any)
- Continue past the handoff brief to "finish the job"
- Call `push_brew` — RP9 default is doc-only trial records (kickoff § 8; the item-56 representation pattern exists but opt-in has NOT been given for this project)

**DO:**
- Read this doc in full BEFORE Step 0
- Walk the operator through Step 0 primitives
- One tool call per scored cup/condition (tool-call-per-pull pacing)
- Capture friction + lessons + audit items inline in this doc (the doc IS the archive)
- Produce a handoff brief per `docs/skills/research-coordinator/cluster/templates/handoff-brief-template.md`
- Commit + push THIS doc to your session branch at termination; report branch + SHA in the brief's `Archive location:` header
- Terminate with the explicit termination declaration block

Full primitive doc: `docs/skills/research-coordinator/cluster/role-discipline.md`

---

## Office-lane charter (inherited wholesale — do not re-negotiate)

Per [`office-lane.md`](docs/skills/research-coordinator/cluster/office-lane.md): ≤15 min per experiment cup all-in · serial cadence, ≤~3 cups/office day, sessions span calendar days · single TDS read per sample · no thermometer (stages by feel) · no pour timestamps beyond count + rough final-pour timing · blank NUMBER recorded at every instrumented sitting open · one bench-free parameter max · actual brew date recorded per cup · per-vial weigh + physical count at Step 0 (shared freezer is volatile; coffee locks are PRESUMPTIVE until the physical check).

**TDS instrumentation rule fires AFFIRMATIVELY for this track** — concentration varies by design across fractions; the VST LAB III deploys at every sitting, re-zeroed with recorded blank number.

---

## Project framing (why this track)

RP9 asks: **which coffees reward output selection, and which don't** — by physically separating a brew's fractions, reading each (VST + palate), and recombining selectively. The project deepens the EXISTING `output_selection` canonical modifier + the WBC Output Selection family (Front-Cut/Back-Cut · Yield Cutoff · Bypass); it does not redefine them (redefinitions route to the grilling queue).

**Operator thesis (captured verbatim at scoping, 2026-09-01):** "one reason i might like these short ratio cups (concentrated pourover) of 1:8-1:10 is i would think that it has more of the Bloom + Pour 1 characteristics to it, and physically cuts off the remainder. So keeps more of the front of the extraction and cuts the end off. now the question would be 1) is it really doing this? 2) is that really my ideal part of the brew? if so i can lean into that more."

**Project central question (carried from RP8):** is selective fraction REMOVAL a genuinely different lever from bypass DILUTION, or bypass with extra steps? RP8 sanctioned bypass-to-optimum as strength-targeting ("no dilution past optimum"); fractionation removes extracted compounds rather than diluting them.

**Track structure:** track = coffee (RP8's shape), exploratory posture. Track 1 = Project One Blue Iris on the SWORKS valve (the valve can HOLD flow between fractions — the natural fractionation instrument, operator call). AeroPress/WAC coupling deliberately deferred: SWORKS first; immersion has no natural fractions (operator call at scoping).

## Hypotheses (pre-state predicted outcomes before scoring, per Lesson #16)

- **H1 (front-retention — the operator thesis):** a concentrated ~1:10 valve cup of this coffee reads closer in character to the **bloom + pour 1 recombination** than to the full cup. *Test: sitting 3 side-by-side (fraction brew's B+P1 recombo vs a fresh 1:10 concentrated cup, temp-matched). Note the strength confound: B+P1 is inherently stronger than the full cup — the comparison is character-shaped (aromatics, structure, finish), not strength-shaped.*
- **H2 (fraction TDS gradient + mass balance):** TDS declines steeply bloom → pour 1 → pour 2; and the fractions' dissolved-solids masses (weight × TDS) sum to the full cup's within instrument noise. *The arithmetic is the cross-check (calibration-arc "arithmetic adjudicates") AND the predictor: any recombination's TDS is computable before it's built. Record predicted vs measured for every recombination.*
- **H3 (removal ≠ dilution — the central question, first read):** the tail-cut condition (B+P1) differs from the full cup in ways NOT describable as strength alone (e.g. finish character, late-cup drying, structural notes present/absent). *Directional read this track; the cross-coffee pattern is the project's output.*
- **H-artifact (method validity — verdict-bearing for the whole project):** the full recombination (B+P1+P2) reads close to the archived control profile — i.e. the fractionation choreography (full drain + valve close + cup swap at boundaries) does not itself materially change the brew. *If this FAILS, flag to Coordinator before designing track 2: every fraction claim would carry a method artifact.*
- **Open read (no prediction):** is the front actually the operator's ideal part of this brew? Per-fraction and per-combo preference notes feed the taxonomy.

## Track-1 coffee (LOCKED at scoping 2026-09-01 — PRESUMPTIVE until Step 0 physical count)

| Field | Value |
|---|---|
| Coffee | **Moonwake — Project One Light Blue Iris — Yeast Anaerobic Honey Catimor — China** (Olina Cai, Mangshi/DeHong Yunnan, 1300-1500 m; Agtron 77.6) |
| Archived control brew ID | `f404e3b0-3d43-4da0-8e29-38c9ddad4494` (2026-05-04, the 3-brew-iterated reference) |
| Control recipe | **SWORKS Bottomless** + xBloom Premium paper · 15 g / 240 g (**1:16**) · **EG-1 6.3** · **95°C** · bloom 45 g, 10 s spiral, valve CLOSED (Dial 0) 20 s then crack to Restricted (Dial 5) · Pour 1 at 0:45 to 140 g, 15 s slow spiral, Dial 5 · Pour 2 at 1:40 to 240 g, Dial 5 → Half-Open (Dial 6) at ~190 g · total ~3:00 |
| Control profile | Lychee / elderflower / Calpico / black tea / cardamom · aromatic top temperature-gated — integrates below ~50°C, **evaluate near 45°C** · sweetness builds with cooling |
| Vials | **5 × 15 g** (operator-stated 2026-09-01; weigh + count at Step 0) |

**Why this coffee:** operator call — the only office coffee with an archived SWORKS-valve reference recipe (RP8 rejected it for exactly the reason RP9 wants it), 5 vials, and a recipe with three clean pour segments that ARE the fraction boundaries. Recipe stays untouched (operator call: fidelity to the real recipe is the point of H1).

**Coffee-specific cautions (from the archive — surface at Step 0):**
- **Evaluate below ~50°C before any verdict** — the aromatic top is temperature-gated on this lot; fraction/combo verdicts weight the cool read. Fractions are small volumes that cool fast — this coffee is favorable for that.
- The control's unlock was the **earlier valve transition shortening tail contact** — already an output-selection-adjacent finding; the tail fraction (P2) is where the archived bitter-tail risk lives. Expect P2 straight to be the least pleasant read; that is signal, not failure.

## Fractionation method (the track's one new move)

Brew the control recipe exactly, with this added choreography at each pour boundary:

1. At the end of each pour segment, let the bed **drain to a trickle** at the recipe's dial setting.
2. **Close the valve (Dial 0)**, swap the receiving cup, label it (F-B / F-P1 / F-P2).
3. Start the next pour on the recipe's schedule (or as close as the swap allows — record actual rough timing drift).

Three fractions per brew: **F-B** (bloom water, ~10-20 g expected after bed retention), **F-P1** (to 140 g cumulative), **F-P2** (to 240 g cumulative). Weigh every fraction at capture (per-fraction grams are load-bearing — all recombination + mass-balance math hangs on them). One VST read per fraction.

**Known fidelity caveat (pre-declared):** the control never fully drains between pours; fractionation forces it to. This IS the method artifact H-artifact tests. Do not "fix" it mid-track.

**Bench-free parameter:** none new. The "drain to a trickle" judgment at boundaries is the only operator call; pin your interpretation at brew 1 and keep it constant.

## Sitting plan (5 vials; sittings span office days; ≤15 min/cup; serial)

| Sitting | Vials | What happens |
|---|---|---|
| **1 — Straight fractions + full recombination** | 1 | Fraction brew → weigh + VST each fraction → taste each straight (cool-weighted) → recombine ALL into full cup → VST + taste vs archived control profile (H-artifact read; archived-comparison waiver, tagged memory-based). Mass-balance check (H2). |
| **2 — Pairwise combos** | 1 | Fraction brew → weigh + VST fractions (quick confirm vs sitting 1) → build **B+P1**, **B+P2**, **P1+P2** by proportional aliquot from actual fraction weights (Assistant computes shares at the bench; F-B is scarce — small pours, sip-scale is fine) → predicted-vs-measured TDS per combo → taste all three, cool-weighted, preference-ordered. |
| **3 — H1 head-to-head** | 2 | Same sitting, back-to-back: fraction brew → build B+P1 recombo; separately brew a **1:10 concentrated valve cup** (15 g / 150 g; grind per the RP8 starting rule ~−0.4 from 6.3 → ~5.9, taste-fit, this is the ONE place a grind move is sanctioned since 1:10 has no archived recipe on this coffee — record what you use). Temp-match, taste side-by-side. H1 verdict + H3 read. |
| **(reserve)** | 1 | Buffer / repeat of whichever sitting produced the track's verdict-bearing claim (charter: protected when it gates a project-level claim; droppable-with-anecdote-tag otherwise). |

**Budget-conditional waivers (chosen consciously at scoping, per charter):**
- **Pre-pull-1 calibration shot WAIVED** — the recipe is the operator's own 3-brew-iterated reference, practiced on this exact bench. In exchange: **RP8-N17 transcription-verify at cup 1** — walk the recipe timeline + valve dials + the new cup-swap choreography back with the operator BEFORE the first pour.
- **Rung-0 control re-brew WAIVED** — sitting 1's full recombination is the in-cup control analog, read against the archived control profile (RP8-N10 waiver pattern; tag the archived comparison memory-based/cross-days).

## Step 0 (run to completion before any scoring)

1. **Physical count + per-vial weigh** (primitive 9) — all 5 presumptive vials. Log actual count + grams each.
2. **VST re-zero + blank number recorded** (primitive 7) — at EVERY sitting open, not just the first. Distilled blank bottle is standing office equipment.
3. **Transcription-verify** (RP8-N17) — recipe + choreography walk-back with operator at cup 1.
4. **Cup logistics check** — 4+ labeled vessels on hand (3 fraction cups + serving/combo cups); sanity-check the SWORKS swap is physically clean (no drips mid-swap ruining fraction weights).
5. **Pre-state H1-H4 predicted outcomes** in this doc before the first scored read.

## Recording sheet (per fraction / per combo)

`sitting # · brew date · vial weight · fraction/combo ID · weight (g) · TDS (blank #) · predicted TDS (combos only) · taste note (cool-weighted; aroma / structure / finish) · preference position · flags (missed/compromised reads per RP8-N7)`

## Inherited lessons that change behavior in this track

- **RP8-N7** — tag missed/compromised stage reads at capture.
- **RP8-N9 / primitive 11** — one bench-free parameter, pinned (here: the drain-to-trickle judgment).
- **RP8-N13** — record liquid weight at every capture; per-gram math hangs on it.
- **RP8-N15** — strength-delta comparisons are only partly blindable; H1's read is character-shaped and unblinded by design (operator call: no blind this track) — weight verdicts accordingly; recency bias acknowledged on serial cups.
- **RP8-N17** — a protocol's transcription of a lived recipe is a claim to verify at cup 1.
- **Lesson #7** — tool-call-per-cup pacing; the per-read reasoning is the payload.

## Exit conditions

Track closes when: sittings 1-3 complete (or consciously curtailed with reason), H1/H2/H3/H-artifact each carry a verdict or an explicit "unresolved because X," and the handoff brief lands. If H-artifact FAILS at sitting 1, pause and surface to the operator: continuing vs re-scoping is a Coordinator-level call.

## Open questions (carried from scoping)

- Recombination-vs-bypass (H3) gets its first single-coffee read here; the project-level answer needs cross-coffee pattern.
- WAC/AeroPress fraction read: deferred (immersion has no natural fractions); revisit at project close.
- Track 2 candidate shape: second coffee, contrast on process/structure (a clean washed vs this yeast-anaerobic honey) — Coordinator scopes after this brief lands.

---

## Notes / friction / lessons / audit items (Assistant: append inline during execution)

*(empty at authoring)*
