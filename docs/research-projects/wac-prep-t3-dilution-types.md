# AeroPress Championship 2027 Prep - Track 3: Dilution Types on the Concentrate

*Research Project #10 (RP10) - AeroPress Championship 2027 Prep · OFFICE LANE, third occupant*
**Status:** SCOPED - architecture, coffee, and "straight to dilution types" operator-signed 2026-10-20; sitting design Coordinator-drafted
**Coordinator:** persistent RP10 Coordinator session (kickoff 2026-10-02)
**Protocol authored:** 2026-10-20
**Prior tracks:** [T1 rules + corpus](docs/research-projects/wac-prep-t1-rules-and-corpus.md) (CLOSED 2026-10-05) · [T2 base recipe](docs/research-projects/wac-prep-t2-base-recipe-original.md) (CLOSED 2026-10-20)

---

## ⚠️ LOAD-BEARING ROLE-DISCIPLINE RULE - READ THIS FIRST

You (the session reading this at execution time) are the **Research Assistant** for this track. Your job is **execution + handoff brief production.** Your job is **NOT substrate integration.**

**DO NOT:**
- Edit `lib/*-registry.ts` files
- Edit `docs/skills/*/cluster/*.md` files
- Edit ADR files
- `git commit` / `git push` SUBSTRATE edits, merge to main, or `gh pr create` (the archive-persist commit of THIS doc is the ONE authorized exception)
- Run `npx tsc --noEmit` against substrate edits (you won't be making any)
- Call `push_brew` - RP10 default is doc-only trial records; opt-in has NOT been given
- Re-open the architecture question (no full-volume press arm on this track; the operator closed it 2026-10-20)
- Continue past the handoff brief to "finish the job"

**DO:**
- Read this doc in full BEFORE Step 0
- Walk the operator through Step 0 to completion before any scored brew
- One tool call per scored brew/read (tool-call-per-cup pacing)
- Open EVERY sitting with the full recap (see § Sitting-recap rule)
- Capture friction + lessons + audit items inline in this doc (the doc IS the archive)
- Produce a handoff brief per `docs/skills/research-coordinator/cluster/templates/handoff-brief-template.md`
- Commit + push THIS doc to your session branch at termination; report branch + the actual SHA in the brief's `Archive location:` header
- Terminate with the explicit termination declaration block

Full primitive doc: `docs/skills/research-coordinator/cluster/role-discipline.md`

---

## Office-lane charter (inherited wholesale - do not re-negotiate)

Per [`office-lane.md`](docs/skills/research-coordinator/cluster/office-lane.md): ≤15 min per experiment cup all-in · serial cadence, ≤~3 cups/office day, sittings span calendar days · single TDS read per sample · no thermometer (stages by feel) · blank NUMBER recorded at every instrumented sitting open · one bench-free parameter max · actual brew date recorded per cup · physical count + weigh at Step 0 · rinse the palate before the first scored cup · set up the blind shuffle BEFORE the first sip · TDS vial drawn before anything is added · small cups cool fast.

**TDS instrumentation fires AFFIRMATIVELY.** VST LAB III at every sitting, re-zeroed, blank number recorded.

**Charter exception, pre-declared:** sittings 2-6 are split-cup pairs from ONE brew (two conditions per 20 g dose). One brew per slot still holds.

## Two rules graduated from Track 2 (apply on every pair)

1. **Cooled-vial rule.** VST reads on hot samples scatter (T2: 1.78 → 1.62 → 1.57 on one cup). Draw the concentrate vial into a cold-water bath at press stop; read once cooled. That single read drives the dilution arithmetic. Verification reads on the diluted cups come AFTER the cool pick, never before tasting.
2. **Weigh every portion.** Each half of a split and each tasting portion is weighed and recorded. "Equal by eye" is a flag, not data (T2 missed it on both pairs).

---

## Project framing

Track 2 settled the base architecture: a 1:5.5 concentrate (20 g / 110 g, the operator's RP8 method otherwise) bypassed to strength beat the full-volume press blind 3 of 3 across two sittings. It also found that the concentrate carries only ~1.5-1.7 g of dissolved solids, so the competition-legal cup (≥150 g) lands at **~1.0-1.15% TDS** - and that cup was never tasted. Every Track 2 pair was diluted to ~1.4%, under the floor.

**Operator decision (2026-10-20, verbatim):** "I think we can go straight to dilution types on the concentrate." The full-volume press is left behind; no A-vs-B pair runs here. (Named follow-up stays open on the roadmap: A bypassed to optimum vs B at equal strength. Not this track.)

**What Track 3 asks:** given the fixed concentrate, **how** should the bypass be done? The corpus (T1 D5) shows champions vary exactly this: 7 of 12 podium recipes dilute with room-temperature or cooler water, the 2024 champion staged hot-then-room-temperature, the 2025 champion poured 50°C water into the carafe first, and one 2023 podium recipe ran a second pass of cooler water through the pressed bed. The operator's own levers from scoping: "staged hot/cool bypass, final-step temperature, own-tail splash vs plain water."

## Constraints block (verified, 2026 rules - inherit verbatim)

20 g cap · **150 g floor (bypass counts in practice)** · coffee + water only, no minerals added to the cup · Original, inverted, dry paper micro-filter · bypass and ice allowed at any temperature, same neutrality standard as brew water · everything incl. grind inside 5:00 (not enforced here; elapsed recorded) · **second pass through the pressed bed: rules silent, one 2023 podium precedent - OPEN ruling.**

## The fixed concentrate (from Track 2 - LOCKED, never varied on this track)

**20 g · EG-1 7.0 · 89°C plain PA tap · AeroPress Original inverted · dry paper micro-filter · 110 g in one continuous pour · 2 stirs (N-S, E-W, saturation only) · steep to 1:00 · cap + flip ~10 s · very slow press to first sustained hiss (~50 s) · ~2:00 total.** T2 yield: concentrate 74-92 g at 1.8-2.1%, retention 18-36 g and NOT constant - every brew gets its own cooled TDS read.

**Strength target for every diluted cup: the floor-legal strength**, defined at sitting 1 as the TDS the concentrate reaches when bypassed to exactly 150 g (expected ~1.0-1.15%). Call it **T\***. Every later cup is diluted to T\* so pairs compare dilution TYPE at matched strength and matched weight.

## Hypotheses (pre-state predicted outcomes before scoring)

- **H-floor:** the floor-legal cup (concentrate bypassed to 150 g, ~T\*) is coherent and liked - not thin, not hollow. *This is the first time the actual competition cup is tasted. If it reads thin, that is the track's headline, and the Coordinator re-scopes before sitting 2.*
- **H-temp:** bypass-water temperature changes the judge-time read more than the cool read. *Prediction: hot vs room-temperature bypass splits at judge-time and converges cool.* **Sealed prediction on which wins at judge-time: Assistant first, then operator.**
- **H-staged:** a two-step dilution (hot first, room-temperature finish - the 2024 champion's shape) is preferred over single-step at the same final strength and weight.
- **H-tail (exploratory, legality OPEN):** replacing part of the bypass water with a second pass of 89°C water through the pressed bed (the RP9 "own-tail splash" idea, ~15-20 g) is preferred over plain water at matched strength. *Run only as sitting 5; tagged exploratory; legality unresolved.*

## Track-3 coffee (LOCKED 2026-10-20 - PRESUMPTIVE until Step 0 physical count)

| Field | Value |
|---|---|
| Coffee | **Picolot - S203 Agricola Geisha 36-hr CF Ox Natural** (Panama, Boquete; Manuel Barsallo; 2025 Best of Panama 3rd) |
| Archived control brew | `87689687-90d8-41cd-8f82-7f802e1075f0` (2026-10-06, locked in 2 cups as the RP10 control) - reference profile only, DIFFERENT brewer, Apax-dosed |
| Control recipe | SWORKS valve house style 0→5→5→6 · 15 g / 240 g · EG-1 6.5 · 93°C · Apax 1+1 cup-dose |
| Control profile | Baked peach, grape, kiwi tang, white tea, eucalyptus/herbal line. **Peaks WARM (~54°C)** - hot is sweetest, cool is most herbal |
| Stock | 8 vials × 15 g = **120 g** (operator count 2026-10-06) → **6 brews at 20 g, zero spare** |

**Why this coffee:** the only office coffee with a locked control and enough vials; a clean Panama Gesha natural is nearer the compulsory-coffee profile than La Dinastia; and it peaks warm - the judge-time window - so the judge-time read is a real verdict on this coffee, not a compromised one.

**Coffee-specific cautions:**
- Dialed WITH Apax. This track runs plain tap. Expect less sweetness than the archived profile in every cup; judge cups against each other.
- The archive note "hollow mid on this lot = valve contact time" came from the SWORKS; on the press it has no direct analog - do not chase it.
- The herbal/eucalyptus line rises as the cup cools. Record it on every read; it is this coffee's temperature tell.

**Budget rule (read twice):** 120 g = exactly 6 doses (vial + 5 g from the next, scale-read at build). Under 120 g at Step 0 → drop sitting 6 (buffer) first, then sitting 5 (exploratory). Never shave a dose.

## Two reads per cup (RP10 standing)

1. **Judge-time read:** first spoon or sip as soon as the cup is assembled. **On this track the two cups of a pair will NOT be at the same temperature when the dilution temperature is the variable - that is the point. No parity rest before the judge-time read.** Record which cup feels hotter.
2. **Cool read:** operator's usual verdict stage (~45°C by feel). By then the pair has converged.

In blind pairs the operator states a pick at EACH stage, naming the stage out loud before picking. A judge-time/cool split is a first-class finding.

**Blind honesty:** a temperature difference is a tell. Weight judge-time picks accordingly (RP8-N15). The cool pick is the cleaner one on H-temp; the judge-time pick is the competition-relevant one. Report both without averaging.

## Split-cup method (sittings 2-6)

1. Brew the fixed concentrate. Weigh it at press stop. Draw the TDS vial into the cold-water bath immediately.
2. Read the cooled vial. Compute water per half: `water_half = (conc_g / 2) × (TDS_conc / T* − 1)`.
3. Split the concentrate into two identical cups by weight (record both weights).
4. Dilute each half per the sitting's two conditions to the SAME final weight; record every water addition in grams and its temperature class (89°C kettle / room / other as specified).
5. Shuffle blind before the first sip (eyes closed, operator codes Left/Right). Judge-time pick → cool pick → reveal.
6. Verification TDS on both cups AFTER the cool pick (post-hoc vials, cooled). Record the residual gap; do not chase it.

**Half-cup volumes** will be ~75 g each at T\*. Taste from the full half; no further portioning needed.

## Sitting plan (6 brews; spans office days; one brew per slot)

| Sitting | Brew | Conditions | Purpose |
|---|---|---|---|
| **1 - The legal cup** | 1 | Whole concentrate bypassed with **89°C** water to **exactly 150 g**. Record TDS = **T\***. Two reads. | H-floor. Sets T\* for the track. Also time the grind (Track 7 input). |
| **2 - Temperature** | 2 (split) | **Hot (89°C)** bypass vs **room-temperature** bypass, both to T\*, equal weight. | H-temp + the sealed prediction. |
| **3 - Staging** | 3 (split) | **Single-step** at the sitting-2 winning temperature vs **two-step: 89°C water to ~2/3 of the bypass, then room-temperature water for the rest** (2024 champion shape; order fixed hot-then-cool). | H-staged. |
| **4 - Replicate (protected)** | 4 (split) | Repeat whichever of sittings 2 / 3 produced the LARGER margin, exactly. | Reproduction gate for the track's verdict. |
| **5 - Own-tail (exploratory)** | 5 (split) | Best dilution type so far, plain water vs the same with **15-20 g of the bypass replaced by a second pass of 89°C water pressed through the spent bed** (re-add water to the chamber on the same filter, press, combine). Both to T\*, equal weight. | H-tail. Legality OPEN - tag every line. |
| **6 - Buffer** | 6 | Operator's call, rationale logged BEFORE brewing: a second replicate, a cooler-than-room (ice-chilled water) bypass arm, or the 2025-champion "cool water into the carafe first" ordering. | Optional. |

**Pre-planned decision points (rule first, taste second):**
- Sitting 1 reads thin/hollow/incomplete at both stages → STOP, surface to the operator; the Coordinator decides whether T\* moves (e.g. a 20 g / 100 g concentrate) before sitting 2. Do not improvise a stronger concentrate.
- A pair splits (one condition wins judge-time, the other cool) → record both; the competition-relevant winner for sitting 3's carry-forward is the **judge-time** pick, stated as such.
- A pair is a coin-flip → say so; carry forward the simpler condition (single-step / hot) and tag the hypothesis unresolved.
- Second pass in sitting 5 yields too little or stalls → record it; do not add a third pass.
- Running short on coffee → drop 6, then 5, per the budget rule.

**Bench-free parameter (one):** press duration, reported as a number. Water additions are on the scale; temperature classes are kettle-set or room, never measured.

## Step 0 (run to completion before any scored brew)

1. **Physical count + total weigh:** Agricola vials, each weighed, summed; report the 20 g dose count. Apply the budget rule.
2. **VST re-zero + blank NUMBER** - this and every sitting open. Cold-water bath on the bench for vials.
3. **Equipment:** Original + original cap + dry paper micro-filters · EG-1 at 7.0 · kettle at 89°C · a vessel of room-temperature water, filled at sitting open · scale · timer · two identical cups + two identical half-cups · cup-coding means · a timer for the grind.
4. **Water:** plain PA tap, nothing added, both brew and bypass. No Apax anywhere, including the habit dose.
5. **Method lock + transcription-verify (RP8-N17):** walk the concentrate recipe back with the operator; confirm nothing changed on the Original since Track 2.
6. **Arithmetic walk-through:** do the half-split formula once with made-up numbers with the operator, so the bench computation is routine by sitting 2.
7. **Sealed prediction on H-temp (judge-time winner):** Assistant first, then operator. Log both.
8. **Pre-state predicted outcomes** for H-floor, H-staged, H-tail.

## Recording sheet (per brew)

`sitting · brew # · date · dose g (vials) · grind time s · press duration · total elapsed · concentrate g · concentrate TDS (cooled; blank #) · T* used · half weights · condition L/R · water added per half (g, temperature class, steps) · final weights · judge-time: hotter cup / pick / reason · cool: pick / reason · reveal · post-hoc TDS both cups + residual gap · sweetness line · herbal line · astringency line · flags`

## Sitting-recap rule (operator-requested, RP9 retro)

At EVERY sitting open, in one message: the fixed concentrate recipe in full, T\* and how it was set, the half-split formula, where the track stands (brews done, grams left, verdicts so far, sealed predictions), and exactly what this sitting's two conditions are and how each is poured. Never "dilute like last time" by reference.

## Inherited lessons that change behavior in this track

- **RP10-T2-N1 / N2** - cooled-vial read is canonical; retention varies, so every concentrate gets its own read before dilution. Weight-only dilution is unsafe.
- **RP10-T2-N7 + calibration-arc portion rule** - weigh halves and portions.
- **RP8-N15** - temperature is a tell; judge-time picks on H-temp are only partly blind. Say so in the record.
- **RP9-N9** - shuffle before the first sip; name the stage before each pick.
- **RP8-N17** - transcription-verify at brew 1.
- **RP8-N7** - tag missed or compromised reads at capture.

## Exit conditions

Track closes when: sittings 1-4 complete (5-6 complete or consciously dropped with reason) · H-floor, H-temp, H-staged carry verdicts (H-tail a verdict or "not run") · the sealed prediction is scored · the handoff brief lands.

## Handoff brief - what the Coordinator needs from it

- **T\*** and the legal-cup read (H-floor) stated plainly.
- The recommended dilution recipe as a full lived procedure: water temperatures, steps, grams, order, final weight, TDS.
- Any judge-time vs cool split, per pair.
- Grind time and total elapsed (Track 7 inputs).
- Whether the second pass is worth an email to hello@aero.press (operator decides whether to send).
- What Track 4 (serving temperature / chilling) should start from: the best dilution's serving temperature by feel, and whether cooler bypass already does the job.

## What this track does NOT do

No push_brew · no clock enforcement · no concentrate changes (ratio, grind, temp, steep, press) · no full-volume press arm · no minerals or drops · no sieve · no chilling tools (ice-chilled WATER as a bypass arm is allowed only as the sitting-6 buffer option) · no substrate edits · no canon or grilling-queue changes.

## Known confounders & limitations

- Single coffee, Panama Gesha natural, no Apax; verdicts are single-coffee.
- Temperature-as-variable makes judge-time blinds partial by construction.
- T\* is set from one brew (sitting 1); concentrate variance (T2: 1.8-2.1%) means later cups match T\* by arithmetic, not by identical concentrates.
- Second-pass legality is unresolved; sitting 5 is evidence for a decision, not a routine candidate.
- Zero coffee slack.

## Notes / friction / lessons / audit items (Assistant fills inline)

*(empty at scoping)*

---

## SESSION RECORD

*(Assistant fills from Step 0 onward)*
