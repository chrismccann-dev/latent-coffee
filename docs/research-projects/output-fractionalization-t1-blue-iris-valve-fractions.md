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

## Step 0 log (2026-09-01)

**Ambiguity pins (operator-confirmed before Step 0):**
- Step 0 item 5's "H1-H4" = H1/H2/H3/H-artifact (typo at authoring); open read stays prediction-free.
- **Drain-to-trickle pin:** DRAIN WINS over the pour schedule at fraction boundaries. Operator experience: 45 s is long enough for a full bloom drain at Dial 5, so F-B should be fully captured before Pour 1's scheduled start. Interpretation pinned for all brews this track.
- Sitting 2 aliquots: pairwise combos preserve the two fractions' actual captured weight ratio, scaled to sip-scale (F-B scarce).
- Sitting 3 grind: 1:10 cup starts ~5.9, taste-fit sanctioned, actual recorded.

**Step 0 items:**
1. Physical count + per-vial weigh: **5 vials × 15 g confirmed** (operator-performed, 2026-09-01).
2. VST re-zero: done, **blank # = 0.00** (distilled). Repeats at every sitting open.
3. Transcription-verify (RP8-N17): **DONE 2026-09-01** — full recipe timeline + valve dials + cup-swap choreography walked back; operator confirmed with no corrections. Step 0 COMPLETE.
4. Cup logistics: confirmed, 4+ labeled vessels available, swap judged clean.
5. Predicted outcomes — pre-stated below.

**Pre-stated predictions (Lesson #16, before any scored read):**
- **H1 — predict SUPPORTED with caveats:** the 1:10 cup reads closer in character to B+P1 than to the full cup on aromatics + finish (shorter tail contact = less of the archived bitter-tail character), but not identical — the 1:10 cup's higher-concentration extraction dynamics differ from a 1:16 front-cut.
- **H2 — predict SUPPORTED:** steep TDS decline F-B ≫ F-P1 > F-P2 (F-B small volume but very concentrated); mass balance sums within instrument noise (±0.03-0.05 TDS equivalent).
- **H3 — predict WEAKLY SUPPORTED (directional):** B+P1 vs full cup differs on finish character (less late-cup drying/bitterness), not fully describable as strength; but single-coffee read, low confidence.
- **H-artifact — predict PASSES:** full recombination reads recognizably as the archived control profile (lychee/elderflower/Calpico/black tea/cardamom), with some drift attributable to the forced full-drain choreography + memory-based comparison; not a material character change.

---

## Sitting 1 — 2026-09-01 (1 vial, 15 g · blank # 0.00)

| Fraction | Water in (g) | Output (g) | TDS | Solids (g) | Taste (operator, cool-weighted) |
|---|---|---|---|---|---|
| F-B | 47 | 25.8 | 1.72 | 0.44 | Very intense; fruit-sweet, slightly syrupy; a little astringency; "I kinda like this" |
| F-P1 | ~95 (compromised — see flags) | 57.6 | 1.87 | 1.08 | Caramelly, somewhat pungent; "I like pour 1 a lot, maybe even by itself" |
| F-P2 | 101 | 103.3 | 0.65 | 0.67 | Thinnest, tea-like, not much going on — "more of the dilution water" (matches archive expectation: tail = least pleasant, signal not failure) |

**Totals:** water in 243 g · output 186.7 g · solids 2.19 g · implied full-cup TDS **1.17%** · EY ≈ **14.6%** · bed retention ≈ 56 g (high vs typical ~2 g/g; likely drain-to-trickle leaving liquid + valve holdup — watch at sitting 2).

**Ad-hoc combos (operator-initiated, remainders, unweighed, no VST):**
- **B + P1 (rest of each):** "Rich, sweet, a lot of things going on… it's kinda like that concentrated pour-over thing that I go for."
- **B + P1 + a little P2:** "Opens it up… this is almost like a concentrated pour-over to me. Holding true to what I was thinking ahead of time." → Early unscored signal FOR H1/thesis.

**H2 read (partial):** gradient contradicts the pre-stated shape on one point — **F-P1 (1.87) > F-B (1.72)**, not a monotonic decline from bloom. Decline P1 → P2 is steep as predicted. Plausible cause: bloom output is early bed liquid diluted by absorption dynamics at small volume; P1 pulls the peak-extraction band. Mass-balance sum-check vs a MEASURED full cup did not run (see flags). Predicted B+P1 combo TDS from these numbers: **1.82%**.

**Flags (RP8-N7):**
- F-P1 pour compromised (cumulative-weigh confusion mid-brew; operator targeted 95 g as best he could). Tagged, not fatal.
- **H-artifact NOT READ:** the protocol'd full recombination → VST + taste vs archived control profile was displaced by ad-hoc remainder tasting (fractions partially consumed straight). Method-validity check is UNREAD, not failed. Surfaced to operator — see remedy options below.

**Friction / lessons (inline):**
- **Operational intensity is real:** cup-swapping breaks cumulative scale weighing. Operator fix discovered mid-brew: **re-tare per pour, recipe expressed as per-pour weights** — bloom 45 g / pour 1 95 g / pour 2 100 g. ADOPTED for all remaining brews this track. → Audit item for handoff: fractionation protocols should state recipes per-pour, not cumulative.

**Post-sitting-1 operator debrief (2026-09-01):**
- Sitting-1 gradient + mass-balance numbers tagged **provisional** — operator attributes the F-P1 > F-B inversion and retention oddity partly to the compromised pour 1; no conclusions until a clean brew (sitting 2 confirm read is now load-bearing).
- **Thesis sharpened (operator, verbatim):** "it's almost like the bloom + pour 1 = the 'concentrated pourover' — and then the last pour was basically splashing in some dilution water at the end."
- **Recipe restated per-pour (canonical for the rest of the track; tare scale between pours):**
  - Bloom — 45 g, 10 s spiral, valve CLOSED (Dial 0) 20 s, then crack to Restricted (Dial 5). Valve close at 0:45, swap cups.
  - Pour 1 — TARE. Start 0:45, pour to 95 g, 15 s slow spiral, Dial 5. Valve close at 1:40, swap cups.
  - Pour 2 — TARE. Start 1:40, pour to 100 g, Dial 5 → Half-Open (Dial 6) at ~50 g into the pour (was "~190 g cumulative").
- **TDS batching fix adopted:** collect a labeled sample per fraction, run all VST reads at end of brew (one re-zero, no per-read cleaning churn). → Audit item for handoff.
- **H-artifact re-homed to sitting 2 (operator-agreed):** combos are sip-scale, so after combo aliquots are drawn, build a weight-exact proportional full recombination from remainders → VST + taste vs archived profile (memory-based, waiver-tagged). Reserve vial stays protected for repeating the verdict-bearing claim.

## Sitting 2 — 2026-09-09 (1 vial, 15 g · per-pour recipe · VST re-zeroed at open, operator-reported)

| Fraction | Output (g) | TDS | Solids (g) |
|---|---|---|---|
| F-B | 20.0 | 1.88 | 0.376 |
| F-P1 | 76.2 | 1.48 | 1.128 |
| F-P2 | 103.8 | 0.70 | 0.727 |

**Totals:** output 200.0 g of 240 g in (retention 40 g — sane vs sitting 1's 56 g) · solids 2.23 g · implied full-cup TDS **1.12%** · EY ≈ 14.9%.

**H2 confirm read:** gradient is MONOTONIC this time — F-B 1.88 > F-P1 1.48 > F-P2 0.70. Sitting 1's F-P1 > F-B inversion attributed to the compromised pour 1; sitting 2 is the trusted shape. Steep P1→P2 decline replicated.

**Combo build sheet (ratio-true, ~25 g each; F-B usage capped at 9.2 g of 20):**
| Combo | Build | Predicted TDS | Measured TDS | Taste / preference |
|---|---|---|---|---|
| B+P1 | 5.2 g B + 19.8 g P1 | 1.56 | **1.50** | Fruity + light tea aroma; strong, intense, "lychee-fruit" punch; "kinda like the concentrated pourover — I'd probably dilute this a little more." **Preference #1** |
| B+P2 | 4.0 g B + 21.0 g P2 | 0.89 | **0.83** | Light, thin, muted, least flavorful. **Preference #3** |
| P1+P2 | 10.6 g P1 + 14.4 g P2 | 1.03 | **0.95** | High clarity, bright, acid-leaning; "intensity plus clarity" if blended into #1. **Preference #2** |
| FULL recomb (H-artifact) | 10.8 g B + 41.1 g P1 + 56.1 g P2 (108 g) | 1.12 | **1.05** | "Has all the different flavors — intensity, clarity, fruit, sweet. I'd like this too." Explicit operator call (2026-09-09): "yes, was just like the full cup as I recall." **H-artifact PASS** (memory-based comparison, waiver-tagged). |

**Predicted-vs-measured (H2 core):** all four combos landed 0.05-0.08 BELOW prediction — a small, consistent offset (plausible: evaporation during the long bench sequence, slight aliquot drift, or meter bias), not scatter. **The arithmetic predicts recombination TDS to within ~0.07 across a 1.50-0.83 range → H2 mass-balance/predictability SUPPORTED.**

**Head-to-heads (operator):**
- B+P1 vs full: B+P1 more punchy (as remembered — temp mismatch acknowledged, combos ran cooler); the punch is what he likes.
- P1+P2 vs full: P1+P2 has more clarity + acidity; full is "all those flavors mixed in."
- **Overall favorite (key taxonomy datum, operator verbatim-ish): all three fractions together but RE-PROPORTIONED front-weighted** — "the bloom, thinned out with some of the pour 1 and some of the pour 2… I like the combination of all of them together, just in a slightly different recombination" — not a hard tail cut. "That's what the short ratio does for me: a little bit of the bloom, a little of pour 1, and a little of pour 2 — which is kind of the thesis I had."

**Flags (RP8-N7):** unblinded + known build order (operator call, logistics); temperature mismatch across cups (small combos cooled faster than the 108 g full recomb; head-to-heads partly confounded); small combo volumes limited aromatic reads. Blank # at sitting open: **0.00** (operator-confirmed 2026-09-09).

**H-artifact VERDICT: PASS.** The fractionation choreography (full drain + valve close + cup swap) does not materially change the brew — the full recombination read as the known Blue Iris cup. Fraction claims this track stand without a method-artifact asterisk (within the memory-based-comparison waiver's limits). Track 2 design is unblocked on this axis.

## Sitting 3 — 2026-09-09+ (2 vials, back-to-back · H1 head-to-head)

**Brew A — fraction brew:** F-B 21.2 g · F-P1 77.6 g · F-P2 106.1 g (output 204.9 g — consistent with sitting 2). B+P1 cup = all of F-B + F-P1 = **98.8 g**; predicted TDS ~1.57 raw (~1.50 with the sitting-2 offset). F-P2 reserved for splash.

**Brew B — 1:10 concentrated valve cup:** 15 g / 150 g. Grind + pour structure: pending operator report.

**Tastes (temp-equalized, operator):**
- **A (B+P1):** aroma fruity, sweet, pungent, light lychee; sip: concentrated, sweet, slight cardamom bite at the end that fades as it cools. "I like this one a lot."
- **B (1:10):** similar aroma, maybe more caramelization; reads "a little flatter."
- **A vs B head-to-head:** A = bright, sweet, juicy, lychee, crisper — **preferred**. B = more depth of flavor but more muted/rounded. Operator can't pin why B is flatter.

**TDS reads:** A (B+P1) = **1.42** · B (1:10) = **1.41** — the two cups landed at essentially IDENTICAL strength (unplanned but decisive: character differences between A and B are therefore NOT strength differences).

**Splash experiments:**
- **A + 15 g P2** → predicted (from measured A) 1.33, measured **1.31** ✓. Taste: similar aroma, more acidic, more diluted, less punchy. Head-to-head vs B: operator prefers B's punch — "15 g is a little too diluted."
- **B + 7 g P2 (ad-hoc, cross-brew, improvised):** measured **1.36**. Taste: "Nice, sweet, clarity… adding just a splash — this is almost perfect. I really like this a lot." **The track's best cup by operator preference.**

**Sitting 3 verdicts:**
- **H1: SUPPORTED.** The 1:10 concentrated cup landed at B+P1's strength (1.41 vs 1.42) and in its character family (shared fruit/sweet aroma) — it reads far closer to the front-fraction recombination than to the full cup. The operator thesis holds: short ratio ≈ keeping the front.
- **H3: SUPPORTED (directional, single-coffee) — and sharper than designed.** At *equal TDS*, A (physical tail removal) read brighter/crisper/juicier; B (1:10, native extraction) read deeper but flatter/rounder. A character difference at matched strength is exactly "not describable as strength alone." Removal and concentrated-brewing are neighboring but NOT identical levers on this coffee.
- **Refined preference finding:** the optimum was neither the hard front-cut (A) nor heavy re-dilution (A+15 g), but **a concentrated cup + a small tail splash (~5% of cup mass)** — front-weighted with the tail present in trace. Consistent with sitting 2's "re-proportioned, not removed" finding.

**Brew B recipe (operator-reported):** grind **5.9** (per the −0.4 starting rule, no taste-fit move needed) · bloom 45 g, valve CLOSED 45 s → Dial 5 · pour 1 at 0:45 all the way to 150 g total · stop, natural drain (end time not recorded).

**Flags:** B's grind + pour structure still unreported (asked; needed for the record) — RESOLVED, see recipe above. B+7g splash is cross-brew (P2 from brew A into brew B) and unweighed-output on B — improvisation tagged per RP8-N7. Predicted-vs-measured continued to track (1.33 vs 1.31).

## Reserve vial — single-brew replication of the "almost perfect" cup (PLANNED, operator-designed; scheduled next office day)

Goal: turn the cross-brew improvised "1:10 + 7 g tail" cup into a repeatable single-brew recipe claim.

**Protocol (one vial, one coherent brew):**
1. VST re-zero, record blank #.
2. Brew the 1:10 concentrated cup exactly as sitting 3's Brew B (grind 5.9 · bloom 45 g, Dial 0, 45 s → Dial 5 · pour to 150 g at 0:45 · natural drain).
3. Valve CLOSE → swap cups → pour a full "pour 2" (100 g, tared) through the same bed into a separate cup — this is the brew's own tail fraction. Weigh + VST it.
4. Weigh + VST the 1:10 cup.
5. Splash **7 g** of the tail back into the 1:10 cup (replicating the sitting-3 winner; predicted TDS computed at bench). Taste. Optionally add +3 g more (→10 g total) as a second read if 7 feels shy — record which wins.
6. Cool-weighted verdict: does "almost perfect" replicate as a single coherent brew?

### Reserve vial — EXECUTED 2026-09-14 (blank # 0.00)

| Read | Weight (g) | TDS | Notes |
|---|---|---|---|
| 1:10 cup | 109.6 | 1.33 | |
| Tail pour (100 g through spent bed) | 100.2 | **0.54** | Lower than the 1:16 brew's P2 (0.70) — front already extracted harder at 1:10; consistent with theory |
| 1:10 + 7 g tail | 116.6 | 1.21 | Predicted 1.28; measured low, consistent with the standing small offset |
| 1:10 + 10 g tail | 119.6 | 1.33 | Predicted 1.26; measured UP on dilution — flagged anomalous (likely temperature-of-sample reading; operator: "grain of salt") |

**Tastes (operator, cool-weighted):**
- **+7 g:** fruity sweet complex aroma; fruit-sweet with "a little bit of an over-steeped feeling" that persisted through cooling; sweetness building as it cooled.
- **+10 g:** "Starting to open up — a lot more fruit, a lot more sweet… it just lightens it, sweetens it up, takes a little of the harshness away." **Preferred over 7 g.**
- **+10 g + standard office Apax dosing (1 drop JAMM + 1 drop TONIK):** "Fruit, sweet, round, complex… I think this is it. I like this a lot." **Track's final winning cup.**

**Replication verdict: the CLAIM replicates, the exact number moved.** "Concentrated 1:10 + small tail splash" confirmed as the preference peak on a single coherent brew; the optimum splash on this brew was **10 g (~8% of cup mass)**, not 7 g. Reasonable given brew-to-brew variation (this tail was weaker at 0.54, and the sitting-3 winner was cross-brew). Recipe claim recorded as: **1:10 concentrated valve cup + ~7-10 g of its own tail pour, taste-fit within that window, + standard Apax cup-dosing.** Signature-method-candidate flag for the Coordinator.

---

## Notes / friction / lessons / audit items (Assistant: append inline during execution)

*(consolidated into the handoff brief below at close)*

---

## HANDOFF BRIEF FOR COMPILE SESSION (RP9 Track 1 — Blue Iris SWORKS valve fractions Close-Out)

**Date:** 2026-09-14
**Session role:** execution + handoff brief production (no substrate edits)
**Archive location:** branch `claude/output-fractionalization-track-1-d88554` @ `d043ae360f30bedacf0cbb34cf18f1ed3f68e8de (archive commit; SHA header corrected in follow-up commit on same branch)`, pushed to origin (the compile session fetches/branches from here — the archive doc is committed; substrate is NOT; not merged to main). See [`role-discipline.md` § Archive persistence](docs/skills/research-coordinator/cluster/role-discipline.md).
**Methodology verdict:** ✅ VALIDATES — fractionation choreography is artifact-clean (H-artifact PASS), the arithmetic predicts recombinations (H2), and the operator thesis held with a refinement: front-*weighting*, not front-*cutting*, is the preference peak.

This brief closes RP9 Track 1 (Project One Blue Iris, SWORKS valve, 5 vials, sittings 2026-09-01 → 2026-09-14). Consume top-down: TL;DR + Key findings for the taxonomy claims, Substrate edit specifications for the fold, raw data in the sitting logs above (this doc IS the archive; the recording sheets live in the sitting sections).

### TL;DR

- **H-artifact PASS:** full recombination of the three fractions read "just like the full cup" — the drain/close/swap choreography does not materially alter the brew; RP9's method is validated for future tracks.
- **H2 SUPPORTED:** clean monotonic TDS gradient (F-B 1.88 > F-P1 1.48 > F-P2 0.70 at sitting 2) and predicted-vs-measured recombination TDS tracked within ~0.05-0.08 (consistent small downward offset, likely evaporation) across a 1.50-0.83 range.
- **H1 SUPPORTED:** a fresh 1:10 concentrated valve cup landed at the SAME TDS as the B+P1 front-recombination (1.41 vs 1.42) and in its character family — short-ratio brewing really does approximate keeping the front.
- **H3 SUPPORTED (directional):** at *matched TDS*, tail-removal (B+P1) read brighter/crisper/juicier while the native 1:10 read deeper but flatter/rounder — a character difference not describable as strength. Removal and concentration are neighboring but distinct levers on this coffee.
- **Preference peak (open read answered):** NOT a hard front-cut — all three fractions re-proportioned front-weighted. Final winning recipe: **1:10 concentrated valve cup + ~7-10 g of its own tail pour (taste-fit; 10 g won on the reserve brew) + standard Apax cup-dosing.** Signature-method candidate.
- Blue Iris taxonomy entry: **rewards output selection** — front-weighted re-proportion, tail in trace (~5-8% of cup mass), never absent (B+P2 "muted" and bloom-alone can't carry dilution: the P1 body layer is load-bearing).

### Execution summary

4 brews + 1 reserve executed across 3 sittings + reserve (5 vials, all consumed; physical count/weigh confirmed 5 × 15 g). Charter held: serial cadence, VST re-zero + blank number (0.00) at every sitting open, per-fraction weights at every capture, one bench-free parameter (drain-to-trickle, pinned "drain wins" at brew 1). Divergences: sitting 1's pour 1 was compromised (cumulative-weigh confusion — fixed by per-pour tare recipe restatement) and its protocol'd full-recombination H-artifact read was displaced by ad-hoc tasting; H-artifact was re-homed into sitting 2 via remainder recombination and PASSED there. Both pre-declared waivers honored with substitutes run (transcription-verify at cup 1; archived-profile comparison, memory-based, for the control).

### Equipment / conditions

| Item | Value |
|---|---|
| Coffee | Moonwake Project One Light Blue Iris (yeast anaerobic honey Catimor, Yunnan; Agtron 77.6), 5 × 15 g vials |
| Brewer | SWORKS Bottomless + xBloom Premium paper, valve fractionation (Dial 0 close at boundaries) |
| Control recipe (per-pour restatement, canonical) | EG-1 6.3 · 95°C · Bloom 45 g (Dial 0 20 s → Dial 5, close at 0:45) · TARE, Pour 1 to 95 g (Dial 5, close at 1:40) · TARE, Pour 2 to 100 g (Dial 5 → Dial 6 at ~50 g in) |
| 1:10 concentrated recipe (recorded) | EG-1 **5.9** · 15 g / 150 g · bloom 45 g Dial 0 45 s → Dial 5 · pour to 150 g at 0:45 · natural drain |
| Instrument | VST LAB III, distilled blank 0.00 at every sitting open |
| Water | Office PA tap + Apax (JAMM+TONIK cup-dosing on the final cup only, per standing office practice) |
| Blinding | None (operator call at scoping; RP8-N15 acknowledged) |

### Per-pull / per-measurement raw data

Complete recording sheets live in the sitting logs above (§ Sitting 1 / § Sitting 2 / § Sitting 3 / § Reserve vial): per-fraction weights + TDS, per-combo builds + predicted/measured TDS, taste notes, flags. Not duplicated here — this doc is the archive; the brief travels with it.

### Analysis

- **Gradient:** sitting 2 (clean brew) is canonical: F-B 1.88 / F-P1 1.48 / F-P2 0.70; sitting 1's F-B/F-P1 inversion attributed to its compromised pour. Sitting 3 weights replicated the fraction-mass shape (~20/77/105 g).
- **Mass balance / predictability:** implied full-cup TDS from fraction arithmetic 1.12% (sitting 2); every built recombination measured 0.05-0.08 below prediction — consistent offset, not scatter → arithmetic adjudicates; recombination TDS is computable pre-build.
- **Equal-strength character split (the track's sharpest datum):** sitting 3's A (B+P1, 1.42) vs B (1:10, 1.41) — same strength, same aroma family, different structure (bright/crisp vs deep/round-flat). This is H3's "not strength alone" in its cleanest form.
- **Preference topology:** B+P1 > P1+P2 > B+P2 among pairs; full recomb liked but less interesting; peak = concentrated cup + trace tail. The tail is a seasoning, not a member or an amputee.

### Final output

**Blue Iris fractionalization taxonomy entry:** REWARDS output selection. Optimal expression: front-weighted re-proportion — 1:10 concentrated valve cup + 7-10 g of its own tail (captured via valve-close + follow-pour), taste-fit within that window; + standard Apax cup-dosing. Hard tail removal is inferior to trace tail inclusion; bloom cannot carry a cup without P1's body layer.

### Key findings

1. **Fractionation choreography is artifact-clean on the SWORKS valve** (H-artifact PASS, sitting 2, memory-based waiver). Substrate implication: RP9 tracks can trust fraction reads; method needs no redesign for track 2.
2. **Fraction TDS gradient is monotonic and steep** (1.88/1.48/0.70) and **recombination TDS is predictable by weight arithmetic** to ~0.07 (H2). Implication: aliquot math can design target cups pre-build; a small consistent evaporation-shaped offset should be expected on long bench sequences.
3. **1:10 concentrated brewing ≈ front-fraction retention** (H1): equal TDS and shared character family with B+P1. Implication: the `output_selection` modifier and the concentration modifier genuinely overlap on this coffee; RP8's concentrated pour-over canon has a mechanistic account.
4. **Removal ≠ dilution ≠ concentration** (H3, directional): at matched strength, physical tail removal reads brighter/crisper; native concentrated extraction reads deeper/rounder. Implication: these are adjacent-but-distinct levers; the WBC Output Selection family's Front-Cut is not merely "strong bypass."
5. **The preference peak is front-weighted re-proportion, not front-cut:** trace tail (~5-8% of cup mass) "lightens, sweetens, takes the harshness away"; its absence leaves an over-steeped/punchy edge, its natural share (52%) flattens. Implication: taxonomy vocabulary needs a value between "cut" and "keep" — *down-weight*.
6. **Winning recipe replicated as a single coherent brew** (reserve vial): 1:10 + 10 g own-tail + Apax = "this is it." The exact splash number moved (7→10 g) across brews — claim is the window, not the gram. Implication: signature-method candidate for Blue Iris; doc-only per RP9 default (no push_brew — opt-in not given).
7. **P2's TDS depends on what preceded it** (0.70 after a 1:16 front vs 0.54 after a 1:10 front) — the tail is bed-state-dependent, reinforcing that "own-brew tail" is the right splash source.

### Substrate edit specifications for compile session

DO NOT execute these edits in this session — the compile session integrates substrate.

1. **Cluster doc — office-lane / RP9 project page** (wherever the Coordinator keeps RP9 state, e.g. the RP9 end-document): record Track 1 CLOSED with the four verdicts (H-artifact PASS / H2 SUPPORTED / H1 SUPPORTED / H3 directional-SUPPORTED) + the taxonomy entry in § Final output. Source: Key findings 1-5.
2. **Brewing substrate — Blue Iris per-coffee thread / roaster card note** (Moonwake / Project One Blue Iris entry): append the validated preparation: "1:10 SWORKS valve concentrated cup (grind 5.9, bloom 45 g/45 s Dial 0→5, pour to 150 g, natural drain) + 7-10 g own-tail splash (valve-close, 100 g follow-pour, taste-fit) + standard Apax dosing." Source: Key finding 6 + § Reserve vial log. Rationale: this is the coffee's current best-known cup; a fresh session should find it without reading this archive.
3. **CONTEXT-brewing / output_selection vocabulary (grilling-queue candidate, NOT a direct edit):** queue the term **"down-weight" (front-weighted re-proportion)** as a possible value alongside Front-Cut/Back-Cut in the WBC Output Selection family — redefinitions route to the grilling queue per RP9 framing. Source: Key findings 4-5.
4. **Fractionation method note for track 2 protocol:** carry forward (a) per-pour tared recipes (never cumulative) for fraction brews, (b) sample-vial + batched end-of-brew TDS reads, (c) expect ~0.05-0.08 evaporation offset on predictions, (d) own-brew tail as splash source. Source: friction items 1-2, Key findings 2 and 7.

### New lessons captured

| # | Lesson | Substrate implication |
|---|---|---|
| RP9-N1 | Fraction brews break cumulative scale weighing — state fraction recipes as per-pour weights with TARE between pours. | Track-2+ protocol authoring rule (spec edit 4a). |
| RP9-N2 | Serial per-fraction VST reads mid-brew are high-friction; capture sample vials and batch reads at end of brew. | Track-2+ protocol authoring rule (spec edit 4b). |
| RP9-N3 | Long bench sequences depress measured vs predicted TDS by ~0.05-0.08, consistently — treat as offset, not error. | Prediction bookkeeping rule (spec edit 4c). |
| RP9-N4 | Matched-TDS side-by-sides are the cleanest "character vs strength" instrument — when two conditions land at equal TDS, exploit it deliberately. | Candidate cross-project primitive (route via process-retro ratification). |
| RP9-N5 | A displaced protocol step (sitting 1's H-artifact) can be re-homed into a later sitting via remainder recombination when combos are sip-scale — cheaper than spending a vial. | Assistant repertoire note. |

### Audit items queued

| # | Item | Status | Implication |
|---|---|---|---|
| P9-AI-1 | Is the ~0.05-0.08 prediction offset evaporation, aliquot drift, or meter bias? Never isolated. | Open | If meter bias, affects all office-lane TDS work, not just RP9. |
| P9-AI-2 | Reserve +10 g cup measured TDS UP on dilution (1.21 → 1.33) — flagged temperature-of-sample artifact, taken with grain of salt. | Open (single anomaly) | Cool-to-read-temp discipline for VST samples may need a charter line. |
| P9-AI-3 | "Down-weight" vocabulary vs existing Front-Cut/Back-Cut values. | Queued for grilling queue via spec edit 3 | Canonical-vocabulary decision, operator-level. |

### Open data items

- The 7-vs-10 g splash optimum moved across brews; window claimed (7-10 g, taste-fit), point value unresolved by design — no re-run needed unless the signature-method route demands a locked number.
- Sitting 1's fraction data remains tagged provisional (compromised pour); sitting 2 is the canonical gradient. No re-run needed.
- H3 is single-coffee/directional; the project-level removal-vs-dilution answer needs track 2's contrasting coffee (clean washed suggested at scoping).

### Recap map for compile session

Integrate first: spec edits 1-2 (project state + the Blue Iris recipe — immediately useful at the bench). Then spec edit 4 into the track-2 protocol at authoring time. Route spec edit 3 (vocabulary) to the grilling queue — do not ship a canonical change directly. Escalate to operator: nothing blocking; P9-AI-1/-2 are watch-items, and track-2 coffee selection (contrasting process) is the Coordinator's next scoping call per the protocol's open questions.

### Protocol-execution friction captured

1. Cumulative-weight recipe transcription caused the sitting-1 pour error; per-pour restatement fixed it (→ RP9-N1).
2. Per-fraction serial TDS reads + meter cleaning were the sitting's slowest segment (→ RP9-N2).
3. Small (~25 g) combo volumes limited aromatic evaluation and cooled faster than larger cups, partially confounding head-to-heads — future pairwise designs should equalize volumes or accept the flag.
4. Ad-hoc operator tasting momentum at sitting 1 displaced a protocol'd read (H-artifact); recovered via re-homing, but future protocols should schedule the verdict-bearing read BEFORE free tasting of remainders.
5. Temp-matching a fresh hot brew against bench-aged recombinations is approximate at best; the equal-TDS coincidence rescued sitting 3, but the charter's no-thermometer rule makes temp-matching claims soft.

---

### Execution Session Termination

Per Lesson #40 role-discipline rule:
- ❌ NO substrate edits (registry / cluster docs / ADR / MCP)
- ❌ NO merge to main, NO substrate PR
- ❌ NO `npx tsc --noEmit` runs
- ✅ Protocol doc updated in-place as canonical archive (authorized per "doc IS the archive" framing)
- ✅ Archive doc committed + pushed to branch `claude/output-fractionalization-track-1-d88554` @ `d043ae360f30bedacf0cbb34cf18f1ed3f68e8de (archive commit; SHA header corrected in follow-up commit on same branch)` (the authorized archive-persist exception)
- ✅ Handoff brief produced above; branch + SHA in the `Archive location:` header for the compile session
- 🛑 Session terminating after this brief lands. The compile session integrates substrate per the design pattern.

End of RP9 Track 1 close-out.
