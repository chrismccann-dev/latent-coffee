# Concentrated Pour-Over — Track 2: Motta Abbreviated Ladder (Research Project #8, Office Lane)

*Coffee Research · Latent · Research Project*

**Version:** 1.0 (scoped)
**Date drafted:** 2026-08-03
**Status:** SCOPED — coffee locked by operator (Moonwake Motta), design consumes the Track-1 handoff brief
**Location:** Office (Downtown Palo Alto)
**Coordinator session:** RP8 Coordinator (persistent)
**Prior track:** [Track 1 — El Oasis Full Ladder](docs/research-projects/concentrated-pourover-t1-full-ladder.md) (CLOSED 2026-08-03; handoff brief appended there)

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
- Walk the operator through Step 0 sub-steps to completion before any scored brew
- Run scored brews one-at-a-time (tool-call-per-brew pacing; serial cadence)
- Re-present the scoring rubric inside EVERY scored brew's tool call
- Capture friction + new lessons + audit items inline in this doc
- Produce a handoff brief per `docs/skills/research-coordinator/cluster/templates/handoff-brief-template.md`
- Commit + push THIS doc to your session branch at termination; report branch + SHA in the brief's `Archive location:` header
- TERMINATE the session after the handoff brief

Full primitive doc: `docs/skills/research-coordinator/cluster/role-discipline.md`

---

## Project Context

Track 2 of **Research Project #8 — Concentrated Pour-Over / High-Strength Filter** (office lane; WBC routine-differentiation bet). Track 1 (El Oasis, delicate washed Gesha) validated the ladder methodology and the style itself: **1:10 beat the coffee's optimized 1:16 control** (1.50% TDS, 1.70×, caramel/honey/wine-grape *transformation*), with the boundary at 1:8 (full Gesha collapse signature) and 1:9 as the degradation zone. The winner closed **anecdote-unreproduced** (repeat vial turned out to be a 5 g bag excess), so **this track carries the project's reproduction burden**: a second coffee whose concentrated optimum wins AND repeats is what unlocks the low-pressure branch.

**Why Motta (Coordinator recommendation, operator-confirmed 2026-08-03):** the Track-1 brief's escalation asked for a *sturdier* coffee to test whether the boundary moves. Motta is the archive's definitional sturdy case — the only confirmed **Full Expression** Gesha ("most extraction-demanding Gesha in the archive"; it needed pushing to come alive), control on the exact locked Kalita + xBloom setup. If the degradation zone recedes (1:9 stays coherent here), boundary location is coffee-structural; if it doesn't, the boundary may be ratio-intrinsic.

Vocabulary stays grilling item 56's (evidence pointer already filed there at Track-1 fold). Trial records live in this doc — **no push_brew**.

## Inherited from Track 1 (the operative amendments)

| # | Lesson / finding | What it changes in THIS track |
|---|---|---|
| Key finding 3 / RP8-N4 | −0.1 EG-1/pt is iso-extraction (EY flat) but taste-too-fine below 1:10; implied taste-fit ≈ −0.07/pt. TDS/EY confirms mechanism, cannot arbitrate the ladder. | **Starting-grind rule amended to −0.07/pt** (see § Design). Running it IS the H2 retest. |
| Key finding 2 | 1:8 collapse was cultivar-legible (hollow mid + tannin); ladders don't need sub-1:9 rungs unless the coffee is sturdier. | Ladder is 1:10 + 1:9; **no 1:8 rung** — 1:9's behavior on a sturdy coffee is the boundary-movement read. |
| Key finding 4 | H3 (warm-to-cool payoff) counter-evidenced: the winning concentrate was excellent HOT; stage-differentiation compressed as ratio shortened. | Staged scoring unchanged; stage-compression is now a hypothesis under retest (H3′), not an assumption. |
| RP8-N1 | A "vial" can be a bag-excess partial. | Step 0 **weighs every vial** before the budget is trusted. |
| RP8-N2 | Archived control can predate the office water-baseline lock. | **Resolved at scoping: plain PA tap, whole track** (matches the Motta control; zero additions). |
| RP8-N3 / friction 1–2 | Office-lane capture trims are the lane's real shape. | **Pre-declared** (§ Design): single TDS read per cup · no thermometer, temp stages by feel (labels approximate) · no pour timestamps beyond pour count + rough final-pour timing. Distilled blank bottle is standing office equipment; the sitting-open line records the blank NUMBER, not just the act. |
| Friction 4 | The rule's cumulative grind jump alarms at first sight. | Rung presentation pre-explains the arithmetic (control − 0.07 × ratio-point delta) BEFORE showing the start value. |

## Track-2 coffee (LOCKED 2026-08-03)

| Field | Value |
|---|---|
| Coffee | **Moonwake — Jeferson Motta, Motta Farm Anaerobic Washed Gesha** (Huila, Colombia) |
| Archived control brew ID | `21c7ce72-0cbf-4729-8858-f1cee83d3471` |
| Control recipe | Kalita Wave 155 (Tsubame) + xBloom paper · 15 g / 225 g (**1:15**) · **EG-1 6.0** · **98°C** · Full Expression · drawdown 3:00–3:30 (Assistant pulls full pour structure from the row at Step 0) |
| Control profile | Candied strawberry, orange, hibiscus · peak cool ~45–50°C |
| Control pour structure (transcribed from row at Step 0, 2026-08-03) | Bloom 45 g, full saturation in circles, firm swirl, 45 s wait · 0:45 → spiral to 120 g (~15 s) · 1:20 → let bed drop, spiral to 175 g (~12 s) · 1:50 → let bed drop, center pour to 225 g (~10 s) · total 3:00–3:30 |
| Control agitation ceiling (row key takeaway — operative for rung scaling) | Firm bloom swirl ONLY; spiral pours stop short of bed edge; low agitation during main pours non-negotiable at 98°C. The "energy" this coffee wanted was extraction pressure (temp + grind), NOT pour turbulence — § Design's "hold the control's own energy level" reads as: firm bloom swirl + restrained mains. |
| Vials | **4 × 15 g** (fill-weight verify at Step 0 — RP8-N1) |
| Water | Plain PA tap, nothing added, whole track (RP8-N2 resolved at scoping) |

**Coffee-specific cautions:**
- This is the archive's boundary-condition Gesha: it REWARDED extraction pressure at normal ratio (98°C + fine grind). The failure signature at short ratio may not be the El Oasis hollow-mid + tannin shape — capture whatever it actually is; new failure vocabulary is a finding.
- 98°C rides all rungs (H5 discipline unchanged: no rung flaw gets a temp fix by default).
- Anaerobic washed ferment character under 1.7× concentration is unmapped — watch for ferment amplification (the process side going loud before the structure fails).

## Hypotheses (pre-state before scoring)

- **H2′ (amended coefficient):** −0.07 EG-1/pt lands the starting grind within ±0.1 of the taste optimum at 1:10 on a second coffee. *This IS the retest of Track 1's Key finding 3.*
- **H-boundary (movement):** on a sturdy, extraction-demanding coffee the degradation zone recedes — 1:9 stays coherent (vs El Oasis where balance was already slipping). *No 1:8 rung; 1:9 is the read.*
- **H-repro (the project gate):** the winning rung's cup reproduces on a later day (profile + TDS within noise). *A second-coffee win + repeat = the low-pressure branch unlock condition met.*
- **H3′ (stage compression):** the concentrated winner again reads compelling from hot onward (stage-differentiation compressed vs the control's cool-peak). *Second-coffee test of Track 1's Key finding 4.*
- **H5 (temp not the lever):** 98°C unchanged all rungs; flaws addressed by grind/contact first.

## Step 0 (run to completion BEFORE any scored rung)

1. **Vial fill-weight check (RP8-N1) — FIRST.** Weigh all 4 vials; confirm 4 true ~15 g doses. If any is a partial, STOP and re-plan the budget with the operator before anything brews.
2. **Coffee + control verification:** pull brew `21c7ce72` via MCP; transcribe full pour structure into the table above; verify grind/temp complete. (Row's brewer reads "Kalita Tsubame" — operator-confirmed 2026-08-03 this is the same physical unit as the locked brewer: **Kalita Wave Tsubame Stainless 155**. Not a drift; no action.)
3. **Equipment physical check:** Kalita Wave 155 + xBloom paper stock + EG-1 + Stagg EKG Pro on-site.
4. **VST LAB III:** distilled blank on-site (standing equipment), zero at sitting start — **record the blank number** (not just "zeroed"), every sitting. Sample convention unchanged from Track 1: syringe filter, first drops to waste, cooled sample, single reading (pre-declared trim).
5. **Water:** plain PA tap confirmed at the kettle — no TONIK/JAMM, no DAK, whole track.
6. **Rung-0 control re-brew (vial 1):** exactly per the archived row at 1:15 / 6.0 / 98°C. Calibration shot + fresh control reference + control TDS baseline (the archived row has no TDS). Fully scored.
7. **Grind purge** (2–3 g) at every setting change.

## Design — abbreviated ladder (4 vials exactly, no buffer)

| Rung | Ratio | Water (15 g dose) | Starting grind (rule: 6.0 − 0.07 × (15 − rung ratio), rounded to 0.1) | Notes |
|---|---|---|---|---|
| 0 | control 1:15 | 225 g | 6.0 (per archive) | Step 0 item 6 |
| 1 | 1:10 | 150 g | **5.7** (6.0 − 0.35) | The H2′ retest rung |
| 2 | 1:9 | 135 g | **5.6** (6.0 − 0.42) | The H-boundary read |
| R | repeat of winning rung (LATER DAY) | per winner | winner's final adjusted grind | The H-repro gate — do not skip, do not same-day it |

**Grind arithmetic, pre-explained (friction fix 4):** the rule subtracts 0.07 per ratio point below the control's 1:15. 1:10 is 5 points below → −0.35 → 5.65, rounded coarse-side to **5.7** (Track 1 showed the taste optimum drifts coarser than iso-extraction). ±0.1 taste micro-adjust within a rung allowed; log start → final.

**Pour scaling (Exp B pattern, from the Motta control's own pours):** bloom 45 g; ~⅔ total around 0:40–0:45; final pour EARLY (~1:10–1:15 territory) keeping the bed hot + wet; pour energy per the control's character (this coffee tolerated — wanted — energy at normal ratio; hold the control's own energy level rather than El Oasis-gentle, and note it).

**Cadence:** serial, ≤3/office day, unblinded — ordering claims carry the unblinded-serial tag; the optimum claim carries anecdote-until-reproduced until rung R lands. Office-lane trims pre-declared (see Inherited table).

**Stop rule:** if 1:10 itself collapses (unexpected on this coffee), 1:9 becomes operator's-call; the repeat vial always stays protected. **The repeat is not expendable this track** — it is the project's reproduction gate (P8-AI-3). If a vial is somehow spared, it MAY fund the H1 ratio-only cup at 1:10 (P8-AI-2, oldest open test: control recipe/grind, just 150 g water) — operator's call.

## Scoring — per-rung record (rubric re-presented in EVERY rung's tool call)

1. **Build:** ratio / water g / grind start→final / 98°C confirm / pour count + rough final-pour time / drawdown end.
2. **TDS** (single read, convention per Step 0) + ×control multiple + ~EY.
3. **Staged sensory** hot / warm / cool (stages by feel, labels approximate): aroma / attack / mid-palate / body+texture / finish. Texture explicit at every stage. H3′ watch: is the hot read already compelling?
4. **Flags:** ferment-amplification (Y/N + character) · sour-collapse · dryness/astringency · clarity-loss · hollow-mid.
5. **Vs-control + vs-prior-rung call** [unblinded-serial], operator verbatim.
6. **Peak window** + whether cooling improved, neutral, or harmed.
7. Friction / lessons / audit items inline.

## Exit conditions (track close)

1. Rungs 0–2 + R executed (or stop-rule path documented).
2. Winner named with final grind / pours / TDS / staged profile; **repeat verdict explicit** — reproduced (profile + TDS ±0.05%) or not.
3. H2′ / H-boundary / H-repro / H3′ / H5 each resolved with evidence pointers.
4. **Low-pressure unlock assessment:** with Track 1 + this track, does "optimum repeatable across 2+ coffees" now hold? State it plainly — this line gates the branch.
5. Handoff brief per template (incl. track-3 guidance: coffee-selection criteria given two coffees' coefficients, and whether RP8-N3 trims graduate to the office-lane template — second-fire condition now met or not).
6. This doc committed + pushed to the session branch; branch + SHA in the brief header.

## What this track does NOT do

No push_brew · no vocabulary locking (grilling item 56's) · no water variables (plain PA tap locked) · no SWORKS/valve work · no low-pressure work (this track only *assesses* the unlock) · no substrate edits of any kind · no 1:8 rung (deliberate — Key finding 2).

## Known confounders & limitations

- Serial unblinded tasting; single-operator; stage labels by feel (pre-declared trims).
- Ratio + grind move together by design (mapping the style, not isolating ratio).
- Two coffees will still be a 2-sample style corpus at close — findings stay style-directional, not style-canonical (that bar is grilling's + more tracks).
- Motta control predates the office water-baseline lock; whole-track plain-tap keeps internal comparability, at the cost of divergence from current office practice — deliberate, scoping-resolved.

## Notes / friction / lessons / audit items (Assistant fills inline)

*(empty at scoping)*

---

## SESSION RECORD

*(Assistant appends per-rung records + handoff brief here at execution)*

### Step 0 log — 2026-08-03

1. **Vial fill-weight check:** operator confirmed all 4 vials true ~15 g doses. Budget trusted; no re-plan needed.
2. **Control verification:** brew `21c7ce72` pulled via MCP; pour structure transcribed into the coffee table above. Operator's from-memory recall matched the row except a typo ("17g" → 175 g pour-2 target, corrected against the row). Agitation-ceiling nuance recorded (firm bloom swirl only; low-agitation mains).
3. **Equipment:** Kalita Wave 155 (Tsubame) + xBloom papers + EG-1 + Stagg EKG Pro confirmed on-site.
4. **VST LAB III:** distilled blank standing; operator will zero + record the blank NUMBER at sitting open (pending — recorded below when read).
5. **Water:** plain PA tap confirmed at the kettle, zero additions, whole track.
6. **Rung-0 control re-brew:** pending (next action).
7. **Grind purge:** 2–3 g at every setting change — acknowledged.

**VST blank (sitting 1 open, 2026-08-03): 0.00** ✓

### Rung 0 — control re-brew 1:15 (vial 1) — 2026-08-03

1. **Build:** 15 g / 225 g / EG-1 6.0 (no adjust) / 98°C / archived pour structure (bloom + 3 pours); drawdown end + final-pour timing not separately reported (office-lane trim; no anomaly flagged by operator).
2. **TDS: 1.21%** (single read, convention per Step 0). ~EY ≈ 15.7% (assuming ~2.0 g/g retention, ~195 g beverage — approximate, mechanism-only). **This is the control baseline** — the archived row had no TDS. ×control multiple = 1.00 by definition.
3. **Staged sensory (operator verbatim, condensed):**
   - *Hot:* aroma fruity-sweet with a bit of roast character. Attack a little flat/muted. Operator explicitly not judging hot (matches archived heat-masking behavior).
   - *Warm:* opening up, sweeter up front, body calming down, less "generic coffee profile."
   - *Cool:* much more sweet-candied up front (could still use a little more), blends into body; body smoother, less harsh. Candied strawberry / orange / hibiscus present + light brown tea; nice cool finish. "This is how you remember the cup."
4. **Flags:** none — no ferment-amplification, sour-collapse, dryness, clarity-loss, or hollow-mid noted.
5. **Vs archive:** matches the archived profile + temperature arc (roast note hot → transforms cool). Control validated as reference.
6. **Peak window:** cool, by far — cooling clearly improved. Consistent with archived ~45–50°C peak.
7. **Friction/notes:** operator noted the cup "could probably use some water treatment" — correctly self-parked; plain PA tap is locked whole-track (RP8-N2). Also "could be improved upon, but stick with this as the control" — control accepted as-is.

### Rung 1 — 1:10 (vial 2) — 2026-08-03

1. **Build:** 15 g / 150 g (1:10) / grind start 5.7 → final 5.7 (no in-rung micro-adjust; coarser instinct logged for downstream, see notes) / 98°C / Exp B pour scaling (bloom 45 g + spiral to ~100 g + early center pour to 150 g); drawdown/final-pour timing not separately reported (office trim). First sip missed truly-hot (cup found already warm-ish — H3′ hot read partially compromised, noted).
2. **TDS: 1.77%** → **×control 1.46×** (1.77/1.21) · ~EY ≈ 14.2% (≈120 g beverage assumed).
3. **Staged sensory (operator verbatim, condensed):**
   - *Hot/warm-hot:* aroma a little flat, a little roasty. More syrupy than control.
   - *Warm:* **not as good as the control** — sweetness/candiedness not appearing enough; emphasizes body over attack; texture (syrupy) liked.
   - *Cool:* candied sweetness finally arrives — concentrated, punchier candied strawberry up front; mandarin/orange initially missing, then re-emerges *embedded in the body* as it cools further. Long cool-down, same temperature-arc character as the control ("even in its concentrated form, it tends to keep its characteristics"). Body side reads "maybe a little over-extracted."
4. **Flags:** ferment-amplification N · sour-collapse N · dryness N · clarity-loss mild-partial (orange/mandarin submerged into body rather than distinct) · hollow-mid N.
5. **Vs-control call [unblinded-serial], operator verbatim gist:** "not as good as the control" at warm; at cool it becomes "a unique, different kind of cup… concentrated, punchier version… which I like." A transformation read, not a clean win — unlike Track 1's 1:10, this does not clearly beat its control yet.
6. **Peak window:** cool, again — cooling clearly improved. Cool-peak survives concentration (H3′ evidence AGAINST stage-compression on this coffee: hot read was NOT already compelling; note hot stage partially missed).
7. **Notes/lessons:** operator self-diagnosis: "maybe shouldn't have went as extreme on the grind" — body over-extraction attributed to 5.7 being too fine at 98°C. H2′ signal: taste optimum likely at/above 5.8, i.e. at the EDGE of the rule's ±0.1 tolerance. Water-treatment temptation surfaced again (acidity/balance) — parked per lock; logged as a possible future-track variable, not this track's.

### Rung 2 — 1:9 (vial 3) — 2026-08-03

1. **Build:** 15 g / 135 g (1:9) / grind start 5.6 → final 5.6 (operator chose rule value over taste-adjust to keep the coefficient retest clean) / 98°C / Exp B scaling (bloom 45 g + spiral ~90 g + early center pour to 135 g); timing detail per office trim.
2. **TDS: 1.98%** → **×control 1.64×** (1.98/1.21) · ~EY ≈ 13.9% (≈105 g beverage assumed). EY continues sliding DOWN the ladder (15.7 → 14.2 → 13.9) — the −0.07/pt coefficient is NOT iso-extraction on this coffee; under-extraction pressure is building as ratio shortens.
3. **Staged sensory (operator verbatim, condensed):**
   - *Hot:* flat, bitter, a little fruit underneath — "not that great hot."
   - *Warm:* still a bit harsh, a bit LESS sweetness now.
   - *Cool:* more fruit sweetness but turning **sour — "almost feels underextracted"** on the front end while the backend reads "a bit too overextracted." Concentration + mouthfeel liked; **"the balance feels off."**
4. **Flags:** ferment-amplification not observed (N) · **sour-collapse: partial Y (front-end sour/under-extracted)** · dryness/astringency: backend harshness noted, not named astringent · clarity-loss: Y-mild · hollow-mid: N.
5. **Vs-control + vs-1:10 [unblinded-serial]:** clearly below both. 1:10 is the track's winning rung.
6. **Peak window:** cool again, but cooling only partially rescued it — improved sweetness while unmasking the sourness.
7. **Notes/lessons:**
   - **New failure signature (finding, per coffee-specific caution):** NOT El Oasis's hollow-mid + tannin. Motta's 1:9 failure = **split-balance incoherence** — simultaneously sour/under-extracted front + over-extracted backend in one cup. Consistent with the EY slide: the rule's coarser trajectory under-extracts the front while 98°C + concentration overdrives the back.
   - No ferment amplification anywhere on the ladder — anaerobic character stayed integrated at 1.6×.
   - **Operator hardware insight (capture-only, no SWORKS work this track):** below 1:10 he'd want hold-and-release stage control (SWORKS) rather than a full-flow brewer like the Kalita — flow-restriction as the missing lever at very short ratios. → handoff brief / track-3 guidance.

### Rung R — repeat of winning rung 1:10 (vial 4, LATER DAY) — 2026-08-10

**VST blank (sitting 2 open, 2026-08-10): 0.00** ✓ · Later-day gate confirmed (ladder sitting was a prior day; repeat run 2026-08-10).

1. **Build:** exact reproduction of rung 1 — 15 g / 150 g (1:10) / EG-1 5.7 (no adjust; coarser instinct deliberately NOT applied) / 98°C / same pours (bloom 45 g firm swirl → spiral ~100 g → early center pour to 150 g).
2. **TDS: 1.78%** → vs rung-1 target 1.77% → **Δ +0.01%, well inside the ±0.05 gate. TDS REPRODUCED.** ×control 1.47×.
3. **Staged sensory (operator):** aroma fruit + dark-tea tannin · hot: dark tea, a lot of tannin, a bit harsh, syrupy texture · warm: candied sweet + dark tea · cool: candied sweet, orange + strawberry present, dark tea persists.
4. **Flags:** ferment-amp N · sour-collapse N · dryness/tannin: Y (dark-tea tannin thread, all stages) · clarity-loss N-significant · hollow-mid N.
5. **Reproduction verdict (operator, explicit): "more than reproduced."** The dark-tea tannin is not novel to this cup — operator recalls it "in all of the ones with the Motta in particular," attributing it to the 98°C + finer-grind combination. Rung 1's partially-missed hot stage explains why the thread was under-recorded there, not absent. [unblinded-serial, across-days]
6. **Peak window:** cool again; cooling improved (candied + fruit emerge, tannin persists but integrates).
7. **Notes:** operator's forward direction stated at close, twice-consistent with rung 2's instinct: "hold the front, flush the back" → **T3 = SWORKS valve experimentation BEFORE water experimentation**, at 1:10 (not shorter), keeping the optimized brew's temp AND grind, making up the contact-time difference with the valve mechanism instead of grind. Possible later refinement: 1:10.5–1:11.

### Hypothesis resolutions (track close, 2026-08-10)

- **H2′ (−0.07/pt): HELD AT THE EDGE, with a mechanism caveat.** 5.7 produced the winning, reproduced cup; operator's taste optimum reads ~5.8 (within the ±0.1 tolerance, at its boundary). But EY slid down the ladder (15.7% → 14.2% → 13.9%): the coefficient is NOT iso-extraction on this extraction-demanding coffee, and the tannin thread is attributed to fine-grind + 98°C. Coefficient verdict: usable as a starting rule, biased slightly fine; the real T3 direction abandons grind-compensation entirely (valve-based contact control at constant grind).
- **H-boundary (movement): NOT RECEDED.** 1:9 failed on the sturdy coffee too — boundary location leans ratio-intrinsic (2-coffee, style-directional). But the failure SIGNATURE is coffee-structural: El Oasis = hollow-mid + tannin collapse; Motta = split-balance incoherence (sour/under-extracted front + over-extracted back). New failure vocabulary captured per the coffee-specific caution.
- **H-repro (project gate): MET.** 1.78% vs 1.77% (Δ 0.01, gate ±0.05) + operator-explicit "more than reproduced" profile verdict, later-day, protected vial. First reproduced concentrated optimum of the project.
- **H3′ (stage compression): COUNTER-EVIDENCED on Motta.** The concentrate was NOT compelling hot (flat/harsh hot on rungs 1, 2, R); the coffee kept its full cool-peak temperature arc under 1.46× concentration. Track 1's stage-compression finding is therefore coffee-dependent, not style-intrinsic.
- **H5 (temp not the lever): HELD.** 98°C rode all rungs; zero temp deviations; all adjustments discussed were grind/contact/flow.

---

## HANDOFF BRIEF FOR COMPILE SESSION (RP8 Track 2 — Motta Abbreviated Ladder Close-Out)

**Date:** 2026-08-10
**Session role:** execution + handoff brief production (no substrate edits)
**Archive location:** branch `claude/pour-over-track-2-research-a0adb1` @ `74f8a4764931bff4f336e6f38b3a12d2c51f80d9` (content commit; a header-fill commit follows it on the same branch), pushed to origin (archive doc committed; substrate is NOT; not merged to main). See [`role-discipline.md` § Archive persistence](docs/skills/research-coordinator/cluster/role-discipline.md).
**Methodology verdict:** ✅ VALIDATES — abbreviated-ladder methodology executed clean on 4 vials exactly; the project's reproduction gate is MET.

This brief is the canonical close-out of RP8 Track 2. The Coordinator consumes it to update the RP8 end-document + roadmap and to scope Track 3; the compile session applies § Substrate edit specifications without re-derivation. All raw records live in § SESSION RECORD above.

### TL;DR

- **The low-pressure-branch unlock condition is MET** per H-repro's pre-stated definition: a second coffee's concentrated optimum (1:10) won AND reproduced later-day (TDS 1.78% vs 1.77%, Δ 0.01 inside the ±0.05 gate; operator-explicit "more than reproduced").
- **1:10 is the style's optimum on both coffees tested; 1:9 is the boundary on both** — boundary location leans ratio-intrinsic; failure *signature* is coffee-structural (Motta's is a new one: split-balance incoherence — sour/under-extracted front + over-extracted back).
- **−0.07/pt held at the edge** (winner at 5.7; taste optimum ~5.8) but is NOT iso-extraction on an extraction-demanding coffee (EY slid 15.7% → 14.2% → 13.9% down the ladder).
- **Track 1's stage-compression finding is coffee-dependent:** Motta kept its full cool-peak arc at 1.46× concentration; the concentrate was never compelling hot.
- **No ferment amplification anywhere** — anaerobic-washed character stayed integrated under concentration.
- **T3 direction (operator-stated, twice-consistent):** SWORKS valve experimentation at 1:10, constant temp + constant optimized grind, contact time made up by the valve — BEFORE any water experimentation.
- **RP8-N3 office-lane capture trims: second fire clean — GRADUATE to the office-lane template.**

### Execution summary

4 brews executed over 2 sittings (ladder sitting: rungs 0–2 serial same-day; repeat sitting 2026-08-10), exactly the 4-vial budget, no losses. Step 0 ran to completion in order (all 4 vials verified true 15 g; control row pulled + pour structure transcribed — catching a from-memory pour-2 typo; blank numbers recorded both sittings: 0.00 / 0.00). One protocol-internal decision surfaced mid-track: operator chose the rule grind (5.6) over a taste-adjusted 5.7 for rung 2 to keep the coefficient retest clean. No temp deviations, no stop-rule fire, no substrate edits. H1 ratio-only cup unfunded (no spared vial) — P8-AI-2 stays open.

### Equipment / conditions

| Item | Value |
|---|---|
| Coffee | Moonwake — Jeferson Motta anaerobic washed Gesha (Huila) · 4 × 15 g vials |
| Brewer / filter | Kalita Wave Tsubame 155 + xBloom Premium paper |
| Grinder | EG-1 (purge 2–3 g at every setting change) |
| Water | Plain PA tap, zero additions, whole track (RP8-N2 scoping-resolved) |
| Temp | 98°C all brews (Stagg EKG Pro) |
| TDS | VST LAB III; blank 0.00 both sittings; syringe filter / first drops to waste / cooled / single read |
| Agitation | Firm bloom swirl only; restrained mains short of bed edge (control's archived ceiling) |

### Per-pull raw data

| Rung | Ratio | Water | Grind start→final | TDS | ×control | ~EY* | Verdict (operator) [unblinded-serial] |
|---|---|---|---|---|---|---|---|
| 0 (control re-brew) | 1:15 | 225 g | 6.0→6.0 | **1.21%** | 1.00× | ~15.7% | Matches archive; cool peak; accepted as reference |
| 1 | 1:10 | 150 g | 5.7→5.7 | **1.77%** | 1.46× | ~14.2% | Not a clean control-beat; liked "punchier transformation" cup at cool; **track winner** |
| 2 | 1:9 | 135 g | 5.6→5.6 | **1.98%** | 1.64× | ~13.9% | Below both; split-balance failure; boundary |
| R (repeat of 1, later day) | 1:10 | 150 g | 5.7 | **1.78%** | 1.47× | ~14.3% | **"More than reproduced"** — profile + TDS gates both pass |

*EY approximate: assumes ~2.0 g/g retention; mechanism-read only, never arbitrated the ladder (per protocol).

### Analysis

TDS scaled smoothly with ratio (1.21 → 1.77 → 1.98) while EY declined monotonically — the −0.07/pt grind rule under-compensates contact-time loss on this coffee, the inverse of Track 1's −0.1/pt which held EY flat but tasted too fine. Palate optimum sat at/above the rule value on both tracks: the taste-fit coefficient is coffee-dependent within a narrow band (≈ −0.07 to −0.1/pt), and grind-compensation itself is the limiting mechanism — it buys strength at the cost of a fine-grind tannin/texture tax at 98°C. Repeat: Δ TDS 0.01%, profile confirmed with the dark-tea tannin thread recognized as a standing Motta character (under-recorded in rung 1's partially-missed hot stage), not a reproduction failure. 1:9 failed with a signature distinct from El Oasis's, while the boundary *location* repeated exactly.

### Final output

**Motta concentrated recipe (reproduced):** 1:10 · 15 g / 150 g · EG-1 5.7 · 98°C · Kalita 155 + xBloom paper · plain PA tap · bloom 45 g firm swirl 45 s → spiral ~100 g ~0:45 → early center pour to 150 g ~1:10–1:15, restrained mains · **1.77–1.78% TDS, 1.46× control** · concentrated punchy candied-strawberry front, mandarin embedded in syrupy body, dark-tea tannin thread, cool peak. Status: reproduced optimum (first of the project); not a clean beat of the 1:15 control (a distinct liked style), improvement path assigned to T3 (valve) not grind/temp/water.

### Key findings

1. **Reproduction gate MET (project-first).** 1:10 winner repeated later-day within Δ 0.01% TDS + explicit profile confirmation. Backing: rungs 1 + R. Substrate implication: low-pressure branch unlock condition satisfied per H-repro's pre-stated definition; RP8 end-doc gate line flips.
2. **1:10 optimum + 1:9 boundary replicated across two opposite-character coffees.** Boundary location leans ratio-intrinsic (style-directional, 2-sample). Implication: future ladders can start abbreviated (control + 1:10 + 1:9) by default.
3. **Failure signature is coffee-structural:** El Oasis = hollow-mid + tannin collapse; Motta = split-balance incoherence (sour front + over-extracted back, simultaneously). New vocabulary candidate for grilling item 56.
4. **−0.07/pt: taste-adequate, mechanically under-compensating.** Winner at rule value; optimum ~0.1 coarser; EY slides on extraction-demanding coffee. Implication: keep −0.07/pt as the ladder *starting* rule; stop treating any single coefficient as iso-extraction.
5. **Stage compression (T1 Key finding 4) is coffee-dependent, not style-intrinsic.** Motta's concentrate peaked cool at every rung; coffee's native temperature arc survives concentration. Implication: T1's "excellent hot" claim must not generalize into style vocabulary.
6. **No ferment amplification** on an anaerobic washed at up to 1.64× — the hypothesized process-loudness failure mode did not appear.
7. **Operator-identified next lever: flow restriction, not grind.** "Hold the front, flush the back" (stated at rungs 2 + R): SWORKS valve at constant grind/temp is T3's design center, before water.

### Substrate edit specifications for compile session

DO NOT execute these edits in this session — the compile session integrates substrate.

1. **Cluster doc — office-lane template graduation:** in the research-coordinator cluster's office-lane/template surface (Coordinator locates exact file; RP8-N3's declared home), graduate the RP8-N3 capture trims (single TDS read · no thermometer, stages by feel · no pour timestamps beyond count + rough final-pour · blank NUMBER recorded at every sitting open) from per-track pre-declaration to standing office-lane template text. Source: exit condition 5, second fire clean this track. Rationale: two tracks ran the trims with zero data loss; pre-declaring per-track is now ceremony.
2. **Grilling queue item 56 (docs/grilling-queue.md):** append a Track-2 evidence pointer: new failure-signature vocabulary candidate "split-balance incoherence" (sour/under-extracted front + over-extracted back in one cup) alongside Track 1's collapse signature; note ferment-amplification non-event; vocabulary locking remains item 56's, not the tracks'. Source: Key findings 3 + 6.
3. **RP8 project end-document (Coordinator-owned):** record H-repro MET + the low-pressure unlock line flipped (see § Recap map caveat); fold hypothesis resolutions + T3 guidance. Source: § Hypothesis resolutions.
4. **Audit items:** P8-AI-3 (reproduction gate) → RESOLVED-met. P8-AI-2 (H1 ratio-only cup) → stays OPEN, unfunded two tracks running; Coordinator decides whether T3 budgets a vial for it or retires it.
5. **Optional, Coordinator's call — Motta reference surface:** the reproduced 1:10 concentrated recipe (§ Final output) could be recorded as an alternate-format note wherever Motta's brewing reference lives (freezer-stock entry / archive). Deferred brew-row archival stands — no push_brew.

### New lessons captured

| # | Lesson | Substrate implication |
|---|---|---|
| RP8-N5 | A grind-compensation coefficient that is taste-fit is not thereby iso-extraction; on extraction-demanding coffees EY slides down the ladder while the cup still wins. | TDS/EY stays mechanism-read only; never promote a coefficient to iso-extraction language. |
| RP8-N6 | Boundary location can replicate across coffees while the failure signature diverges — capture the signature as a per-coffee finding, not a style constant. | Ladder protocols keep the "capture whatever it actually is" caution permanently. |
| RP8-N7 | A missed stage read resurfaces as apparent non-reproduction later (rung 1's missed hot stage vs rung R's tannin thread). | Rung records should tag any missed/compromised stage read at capture time (done here); repeat verdicts consult those tags before calling profile drift. |
| RP8-N8 | When a rung's result argues against the rule's next value, surfacing rule-vs-taste as an explicit operator choice preserved the coefficient retest without friction. | Candidate protocol-template line for future ladders: pre-plan the "rule vs micro-adjust" decision point between rungs. |

### Audit items queued

| # | Item | Status | Implication |
|---|---|---|---|
| P8-AI-2 | H1 ratio-only cup (control recipe/grind, short water) — still never run | OPEN, unfunded 2 tracks | Coordinator: fund in T3 or retire |
| P8-AI-3 | Project reproduction gate | RESOLVED — met this track | Unlock line flips |
| P8-AI-4 (new) | Is the dark-tea tannin thread on concentrated Motta grind-driven (fine + 98°C) as operator hypothesizes, or concentration-intrinsic? T3's constant-grind valve design answers it for free. | QUEUED for T3 | Shapes T3 scoring sheet |

### Open data items

- Ladder-sitting calendar date not operator-confirmed (logged 2026-08-03 from the scoping date; operator confirmed only "a different, earlier day" than the 2026-08-10 repeat). Cosmetic; correct at retro if desired.
- Rung 1 hot-stage read partially missed (cup found already warm) — H3′ resolution rests on rungs 0/2/R hot reads plus rung 1's warm read; direction was unanimous, so treated as resolved, but noted.
- EY figures are retention-assumed (~2.0 g/g), not measured — fine for mechanism reads, not comparable outside RP8.

### Recap map for compile session

Integrate first: edits 1–2 (template graduation + item-56 evidence pointer) — mechanical and self-contained. Then Coordinator folds 3–4 into the RP8 end-doc and roadmap. **Escalate to operator:** the low-pressure unlock caveat — the pre-stated H-repro condition ("second-coffee win + repeat") is met, but read strictly, "optimum repeatable across 2+ coffees" has reproduction on ONE coffee (Track 1's winner remains anecdote-unreproduced) and Track 2's win is best-concentrated-cup rather than a clean control-beat. Assistant's plain statement: **condition MET as pre-defined; whether the branch opens now or after a T1-coffee re-confirmation is an operator call.** Also operator-adjudicated: edit 5 (Motta reference surface) and P8-AI-2's fate. Track-3 scoping is ready: SWORKS valve, 1:10, constant temp + optimized grind, valve-made contact time; watch P8-AI-4; water experimentation explicitly sequenced after.

### Protocol-execution friction captured

1. Operator's from-memory control recall carried a pour-2 typo ("17g" for 175 g) — the Step 0 mandatory row-pull caught it; keep the row-pull mandatory.
2. Rung 1's hot stage was missed because the cup sat before first sip — consider a "first sip before anything else" line in the rung presentation.
3. Water-treatment temptation surfaced at 3 of 4 brews; the whole-track lock held, but future office-lane tracks should expect and pre-park it (one standing line in the protocol worked well as the parking mechanism).
4. Session spanned calendar days; per-rung records should capture the actual brew date at brew time rather than inheriting the doc date (see Open data items).

---

### Execution Session Termination

Per Lesson #40 role-discipline rule:
- ❌ NO substrate edits (registry / cluster docs / ADR / MCP)
- ❌ NO merge to main, NO substrate PR
- ❌ NO `npx tsc --noEmit` runs
- ✅ Protocol doc updated in-place as canonical archive (authorized per "doc IS the archive" framing)
- ✅ Archive doc committed + pushed to branch `claude/pour-over-track-2-research-a0adb1` (SHA in Archive location header, filled at commit)
- ✅ Handoff brief produced above; branch + SHA in the `Archive location:` header for the compile session
- 🛑 Session terminating after this brief lands. The compile session integrates substrate per the design pattern.

End of RP8 Track 2 (Motta Abbreviated Ladder) close-out.
