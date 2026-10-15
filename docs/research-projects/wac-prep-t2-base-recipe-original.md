# AeroPress Championship 2027 Prep - Track 2: Base Recipe on the Original (full-volume press vs champion concentrate-and-bypass)

*Research Project #10 (RP10) - AeroPress Championship 2027 Prep · OFFICE LANE, third occupant*
**Status:** SCOPED - arms, dose, coffee, water operator-signed 2026-10-04 to 10-06; sitting design Coordinator-drafted
**Coordinator:** persistent RP10 Coordinator session (kickoff 2026-10-02)
**Protocol authored:** 2026-10-06
**Gate:** does not start until the operator's AeroPress **Original** is physically at the office. Nothing scored runs on the Premium.
**Prior track:** [T1 rules + corpus](docs/research-projects/wac-prep-t1-rules-and-corpus.md) (CLOSED 2026-10-05)

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

Per [`office-lane.md`](docs/skills/research-coordinator/cluster/office-lane.md): ≤15 min per experiment cup all-in · serial cadence, ≤~3 cups/office day, sittings span calendar days · single TDS read per sample · no thermometer (stages by feel) · blank NUMBER recorded at every instrumented sitting open · one bench-free parameter max · actual brew date recorded per cup · physical count + weigh at Step 0 (shared freezer is volatile) · rinse the palate before the first scored cup · set up the blind shuffle BEFORE the first sip · TDS vial drawn before anything is added to a cup · small cups cool fast.

**TDS instrumentation fires AFFIRMATIVELY** - concentration varies by design. VST LAB III at every sitting, re-zeroed, blank number recorded.

**Charter exception, pre-declared:** sittings 3 and 4 each brew TWO cups back-to-back so a blind side-by-side is possible (RP9 sitting-3 precedent). Everything else is one cup per slot.

---

## Project framing

RP10 prepares the operator for the 2027 AeroPress Championship season. The coffee on the day is compulsory and unknown, so the project builds a repeatable base recipe plus fast adaptation, not a coffee-specific dial-in. Phase 1 runs seven tracks; this is the second and the first on the bench.

Track 1 verified the rules (2026 rulebook, updated 2026-06-09) and corrected the project's arithmetic. Track 2 answers the question everything else sits on: **which base architecture does the operator build from** - his own RP8 immersion-press, now legal undiluted at the new 20 g cap, or the shape all four 2022-2025 champions used.

**Operator frame (verbatim, 2026-10-03):** on his own recipe - "RP8 press winner scaled up - yep totally fine with me." On the champion shape - "yep can work with this, also kind of marries the concentrated pourover + the longer ratios with the fractionalization work i just did to an extent." On coffees - "I have time so we can keep doing coffees i know, but at some point yes i need to do it on a coffee i never dialed in before."

## Constraints block (inherited verbatim from Track 1 - valid for the 2026 rules only)

| Constraint | Value |
|---|---|
| Clock | 5:00 for everything: any preheat or pre-chill, grind, brew, dilute, pour into the judging vessel. **NOT enforced on this track** (operator call: no clock yet) - but record total elapsed per brew |
| Dose cap | **20 g** ground coffee per recipe |
| Yield floor | **150 g** brewed coffee; bypass counts in practice (unwritten) |
| Ingredients | Ground coffee and water only; **no mineral additions during or after brewing** |
| Brewer | One genuine AeroPress Original or Clear; chamber, plunger and cap all used |
| Filters | Any material, taste-neutral, inside the cap; rinsing allowed inside the clock only |
| Before the clock | Allowed: heat kettle water, weigh doses, assemble brewer, dry filter in cap. Not allowed: rinse filter, preheat brewer or vessels, grind |
| Water | Host water if provided, otherwise own neutral-tasting water; same standard for bypass |

## The two arms

Both arms: **20 g · EG-1 7.0 · 89°C · plain PA tap, nothing added · AeroPress Original, inverted · paper micro-filter · one continuous pour · 2 stirs (one N-S, one E-W, saturation only) · steep to 1:00 · flip ~10 s · slow press to first sustained hiss (~50-55 s) · ~2:00 total.** Only chamber water and dilution differ. This is the RP8 T5 amended method lock ([method card](docs/skills/brewing-assistant/cluster/aeropress-immersion-press.md)), scaled from 15 g to 20 g.

| Arm | Chamber water | Dilution | Expected (PREDICTION, not fact) |
|---|---|---|---|
| **A - full-volume press** (the operator's RP8 winner) | **200 g** (1:10) | none | Yield ~150-180 g (RP8 bed retention ran 15-41 g at 15 g, so this is genuinely uncertain); TDS ~1.1-1.2% |
| **B - champion shape** | **110 g** (1:5.5; the champions' 94-100 g on 18 g, scaled) | plain hot kettle water, to a pre-computed target weight | Concentrate ~70-90 g; strength unknown - RP8 never brewed tighter than 1:7.5 |

**B's dilution target is strength-matched to A** (calibration-arc matched-TDS primitive): the Assistant computes `target weight = concentrate g × concentrate TDS ÷ A's TDS` and the operator adds water on the scale to that weight. At matched strength the blind pair reads architecture, not strength.

**What B deliberately does NOT copy:** champion steep times (1:20-1:35), temperatures (84-96°C), agitation, or filters. Holding the operator's method fixed isolates the architecture. If B loses, "B at champion timing" is a named follow-up, not a failure of this design.

## Hypotheses (pre-state predicted outcomes before scoring)

- **H-legal:** Arm A at 20 g / 200 g fits the Original inverted and yields ≥150 g undiluted. *If yes, the operator's undiluted style is competition-legal as brewed. Brew 1 tests it directly.*
- **H-transfer:** the RP8 press character (round, layered, zero verdict-stage astringency, ~1.1-1.2% TDS) reproduces on the polypropylene Original at 20 g. *Cross-brewer, cross-coffee, memory-based comparison - tag it.*
- **H-coherent-B:** a 1:5.5 concentrate under this method is coherent when diluted to ~1:10-strength. *RP8 found percolation collapsed below 1:9 and the press held at 1:7.5; 1:5.5 is untested territory.*
- **H-arch (the track's verdict):** at matched strength, one architecture is preferred blind. *RP9 showed composition can differ at identical TDS; this is the same instrument on a new question.*
- **Sealed prediction (opted in):** which arm wins H-arch. The Assistant states its call FIRST in the read-back, then collects the operator's. Both logged before brew 1, neither revised.

## Track-2 coffee (LOCKED 2026-10-05 - PRESUMPTIVE until Step 0 physical count)

| Field | Value |
|---|---|
| Coffee | **Moonwake - La Dinastia Wilder Lazo - Lemongrass Yellow Honey Gesha - Colombia** |
| Archived control brew | `23b48be7-064b-4e47-9440-029e105b0cb3` (2026-09-24) - reference profile only, DIFFERENT brewer |
| Control recipe | SWORKS valve · 15 g / 240 g (1:16) · EG-1 6.3 · ~95°C · with Apax 1+1 cup-dose |
| Control profile | Dried apricot, jasmine, honey, green tea with a lemongrass bite; **peaks cool** |
| Stock | 8 vials × 15 g = **120 g nominal** (operator count 2026-10-05) |

**Budget arithmetic - read this twice.** Vials are 15 g; each brew is 20 g. Six brews need 120 g, which is every gram on the shelf with zero spare. Each dose is built from one vial plus 5 g from another. If Step 0's total weight is under 120 g, the plan drops to five brews (sitting 4 becomes a single winner repeat) - do NOT shave doses to 19 g to rescue the sixth.

**Coffee-specific cautions:**
- This coffee was dialed WITH Apax cup-dosing, and its notes call the dose "load-bearing for sweetness". This track runs plain tap with nothing added (operator-accepted default; drops are banned in competition and water is Track 5's job). **Expect less sweetness than the archived profile in BOTH arms. That is not an arm failure.** Judge the arms against each other, not against the control.
- It is a co-fermented honey Gesha; Track 1's census found compulsory coffees are 8/10 washed and never co-fermented. The architecture verdict here is single-coffee and off-profile - carry that scope note into the brief.
- RP9 T3: the lemongrass signature lives in the early extraction. Note whether either arm mutes or amplifies it.
- Verdicts weight the COOL read, but see § Two reads per cup.

## Two reads per cup (new for RP10 - competition judges taste immediately)

Every scored cup gets both, recorded separately:
1. **Judge-time read:** the first spoon or sip, taken as soon as the cup is assembled. This is what a WAC judge tastes.
2. **Cool read:** the operator's usual verdict stage (~45°C by feel).

In blind pairs the operator states a pick at EACH stage. A split verdict (one arm wins warm, the other cool) is a first-class finding for Track 4, not noise.

## Sitting plan (6 brews; spans office days)

| Sitting | Brews | What happens |
|---|---|---|
| **1 - Arm A solo** | 1 | Transcription-verify the method with the operator before the pour. Brew A. **Bench checks:** does 20 g + 200 g fit inverted without spilling at the flip; liquid yield; TDS; total elapsed. Two reads. Memory-based comparison to the RP8 press character and the archived control (tagged). |
| **2 - Arm B solo** | 1 | Brew B. Weigh the concentrate, draw the TDS vial, taste a spoon of the concentrate straight. Assistant computes the dilution target from sitting 1's TDS; operator dilutes on the scale; confirm TDS of the diluted cup. Two reads. Record final beverage weight against the 150 g floor. |
| **3 - Blind pair** | 2, back-to-back | Brew A, then B diluted to A's measured TDS from THIS sitting. Decant equal portions into identical cups, rest to temperature parity, shuffle blind BEFORE any sip (operator codes the cups). Pick at judge-time, pick at cool, then reveal. |
| **4 - Lived replicate (protected)** | 2, back-to-back | A later office day. Repeat sitting 3 exactly. Same pick sequence. This is the reproduction gate for H-arch. |

**Pre-planned decision points (rule first, taste second):**
- A does not fit inverted at 200 g → brew at the largest water weight that fits, record it, and treat the shortfall as an H-legal finding. Do not switch to upright mid-track.
- A yields under 150 g → record it; H-legal fails as brewed. Top up to 150 g with kettle water ONLY as a separate, labelled legal-form read after the undiluted reads are taken.
- B's diluted cup lands under 150 g at matched strength → record it; it is a constraint finding on the champion shape at this strength.
- B's concentrate reads sour, thin, or under-extracted → that is the H-coherent-B result. No grind, temperature, or steep fix on scored brews.
- Sittings 3 and 4 disagree → report as unresolved; do not break the tie by memory.
- If sitting 3 is a decisive, same-arm win at both stages AND the operator wants the last 40 g for an exploratory read instead of the replicate: allowed only with the rationale logged BEFORE brewing and H-arch tagged anecdote-until-reproduced.

**Bench-free parameter (one):** press duration, reported as a number after each brew. Dilution is done on the scale to a computed weight, not by feel.

## Step 0 (run to completion before any scored brew)

1. **Brewer check:** confirm the brewer on the bench is the Original (polypropylene, not the Premium). Confirm which cap and that the filters are the standard paper micro-filters.
2. **Physical count + total weigh:** count La Dinastia vials, weigh each, sum. Report total grams and how many 20 g doses that makes. Apply the budget rule above.
3. **VST re-zero + blank NUMBER** - at this and EVERY sitting open.
4. **Equipment:** EG-1 at 7.0 · kettle at 89°C · scale · timer · stable wide press vessel · two identical tasting cups for the blind pairs · something to code cups with.
5. **Water:** plain PA tap at the kettle, nothing added, whole track. Confirm no Apax goes in any cup, including the operator's habit dose.
6. **Method lock + transcription-verify (RP8-N17):** walk the full timeline back with the operator - pour, 2 stirs, steep to 1:00, flip ~10 s, press ~50-55 s to first sustained hiss, ~2:00 total. Ask whether the 20 g bed changes anything he expects (stir count, press feel).
7. **Filter rinse - pin it:** RP8 rinsed the paper. Under competition rules that rinse costs clock time. Ask the operator once whether this track rinses or goes dry, record the answer, and hold it for all six brews.
8. **Sealed prediction:** Assistant's call on H-arch first, then the operator's. Log both.
9. **Pre-state predicted outcomes** for H-legal, H-transfer, H-coherent-B.

## Recording sheet (per brew)

`sitting · brew # · arm · date · dose g (which vials) · chamber water g · stirs · steep end · press duration · total elapsed · concentrate/liquid yield g · TDS (blank #) · dilution added g + target · final beverage g · final TDS · judge-time read · cool read · astringency/dryness line · sweetness line · lemongrass line · flags (missed or compromised reads)`

Blind pairs add: `cup codes · portion g each · parity rest · pick at judge-time + reason · pick at cool + reason · reveal · post-reveal comments (flagged as post-reveal)`.

## Sitting-recap rule (operator-requested, RP9 retro)

At EVERY sitting open, in one message: both arm recipes in full (dose, water, grind, temperature, stirs, steep, press, dilution rule), where the track stands (brews done, grams left, verdict state, the sealed predictions), and exactly what this sitting does. Never "brew arm A again" by reference.

## Inherited lessons that change behavior in this track

- **RP8-N13 / N16** - weigh liquid yield at press stop, before anything else happens to the cup. Press-to-hiss carries ±9 g yield slack; yield is this track's load-bearing number (the 150 g floor hangs on it).
- **RP8-N15 + calibration-arc primitive 15** - strength tells break blinds; matched TDS removes the strength tell, parity rest removes the temperature tell. Cup volume must match too.
- **RP8-N17** - the method lock is a transcription; verify at brew 1.
- **RP9-N12** - draw the TDS vial before anything is added.
- **RP9-N9** - set up the shuffle before the first sip; sighted leans inverted twice in RP9.
- **RP8-N7** - tag missed or compromised reads at capture.
- **RP10-T1-N3** - a published champion recipe shows what was done under that year's rules; Arm B is a shape inspired by the corpus, not a replication of any champion.

## Exit conditions

Track closes when: sittings 1-4 are complete (or consciously curtailed with the reason logged) · H-legal, H-transfer, H-coherent-B and H-arch each carry a verdict or an explicit "unresolved because X" · both sealed predictions are scored · the handoff brief lands.

## Handoff brief - what the Coordinator needs from it

- The winning base recipe as a full lived recipe at 20 g, with yield, TDS, final weight, and total elapsed.
- H-legal stated plainly: does the undiluted 1:10 press clear 150 g on the Original, yes or no, with the yield numbers.
- Any judge-time vs cool split.
- What Track 3 (dilution types) should start from: the winner's dilution headroom, and whether B's concentrate is a usable base for staged dilution.
- Total elapsed per brew, as the first data toward Track 7.

## What this track does NOT do

No push_brew · no clock enforcement · no water building or drops · no sieve · no chilling tools · no Flow Control cap · no grind, temperature, or steep moves on scored brews · no champion-timing variant of Arm B · no substrate edits · no vocabulary or canon changes (grilling-queue item 58 evidence may be noted for the Coordinator, nothing resolved).

## Known confounders & limitations

- Single coffee, off the compulsory-coffee profile, brewed without the mineral dose it was dialed with.
- New brewer body AND new dose at once (Premium/15 g → Original/20 g); H-transfer cannot separate them.
- Arm B holds the operator's method, not a champion's; a B loss does not rule out the champion shape at champion timing.
- Matched TDS is a gift when it lands, not a guarantee (RP9: lived builds ran 0.05-0.21 below prediction). Record the residual gap in every pair.
- Zero coffee slack.

## Notes / friction / lessons / audit items (Assistant fills inline)

*(empty at scoping)*

---

## SESSION RECORD

*(Assistant fills from Step 0 onward)*

### Session open - 2026-10-14

**Gate:** operator confirms the AeroPress Original is physically at the office. Track opens.

**Read-back ambiguities, resolved before Step 0:**
1. Retention = water in minus liquid yield (held in puck + filter). Protocol cites 15-41 g at 15 g; method card says 30-41 g. Operator: measure it on brew 1. Assistant predictions use the method-card range scaled (~40-55 g at 20 g).
2. Blind-pair judge-time read is recorded as **judge-time (post-parity)** - it follows the parity rest + shuffle, not first sip at assembly. Solo sittings keep the true at-assembly read. Operator confirmed.
3. Dilution water = same 89°C kettle. Operator confirmed.
4. Sitting 2 draws two TDS reads (concentrate, diluted cup) - treated as two samples under the single-read charter rule. Operator confirmed.
5. Original on the bench - confirmed.

**Assistant sealed prediction on H-arch (logged before operator's):** Arm A preferred at the cool read; expect a warm/cool split with B winning or tying at judge-time (post-parity). Secondary predictions: A yield ~145-160 g (H-legal marginal); B concentrate ~60-70 g at ~1.9-2.2% TDS; B diluted to A-strength lands ~110-130 g, under the 150 g floor.

### Step 0
1. **Brewer check:** polypropylene Original, original cap, standard paper micro-filters. ✅
2. **Physical count:** 8 vials La Dinastia, operator states 15 g each = 120 g nominal → 6 brews. Assistant asked for an actual scale reading on at least one vial before accepting (zero-slack budget). *(pending)*
3. **VST blank number (session open 2026-10-14):** 0.00 ✅
4. **Equipment:** EG-1 7.0 · kettle 89°C · scale · timer · wide press vessel · two identical tasting cups · cup-coding means. ✅
5. **Water:** plain PA tap, nothing added, whole track; no Apax in any cup incl. habit dose. ✅
6. **Method lock, transcription-verified:** 20 g · EG-1 7.0 · 89°C · Original inverted · paper micro-filter · one continuous pour · 2 stirs (N-S, E-W, saturation only) · steep to 1:00 · cap + flip ~10 s · slow press to first sustained hiss ~50-55 s · ~2:00 total. Operator: "method is good for me at 20 g, I don't expect all that much difference." ✅
7. **Filter rinse - PINNED: DRY** (operator has been running dry; held for all brews). ✅
2. *(closed)* Vial gross 45.5 g incl. glass; operator pre-doses each vial to 15.0 g coffee on a scale at fill time. Accepted as 15 g × 8 = 120 g → **6 brews**. Each dose build (full vial + 5 g from a second) is read on the scale at brew time, which re-verifies.
8. **Sealed predictions on H-arch:** Assistant = **Arm A** at cool (split possible, B at judge-time). Operator = **Arm A**. Both logged 2026-10-14, neither revised.
9. **Pre-stated predicted outcomes (operator):** H-legal - fits inverted and clears 150 g. H-transfer - character carries over. H-coherent-B - not separately stated; "all transfer over" read as expecting coherent. Assistant's are in § Session open.

**Step 0 COMPLETE 2026-10-14.**

---

### Sitting 1 - Arm A solo (2026-10-14)
Blank number at open: 0.00 (Step 0 read, same session).

**Brew 1 - Arm A** · 2026-10-14 · dose 20 g (vial 1 + 5 g from vial 2; scale reading 20.0 g) · chamber 200 g · 2 stirs · steep 1:00 · flip+press 1:00→2:00 (press ≈50 s after ~10 s flip) · elapsed ~2:00 · dry filter
- Fit: 200 g fit inverted, "pretty much at the top" - no spill at the flip.
- **Liquid yield at press stop: 154.6 g** → retention 45.4 g. **H-legal: CLEARS the 150 g floor undiluted** (4.6 g margin).
- **TDS 1.43%** (blank 0.00). Well above the RP8 1.13-1.20% band at 1:10 on the Premium/15 g.
- Judge-time read (at assembly, hot): aroma fruity, sweet, a little lemongrass. Sip: fruity, sweet, "a little pungent"; operator: "maybe needs a little bit of dilution." No dilution applied (scored brew, undiluted arm).
- Operator note: this coffee tastes better as it cools, not only hot.
- Cool read (B, ~45°C by feel): "much brighter, sharper, sweeter" - lemongrass still there, an apricot-like sweetness, green-tea undertone on the finish. Operator: "I greatly prefer the B1 comparatively to the A1." SIGHTED, same-day, different pours - observation, not the H-arch verdict.
- Astringency/dryness line: not mentioned (none reported). Sweetness line: present, apricot-like. Lemongrass line: intact.

**Brew 1 - Arm A, late cool read (much cooler, after a long sit, taken alongside B's cool read):** mellowed a little; still a little astringency; "feels a little incomplete", more body-centric; not much sweetness. "About the same as before."

**Sitting 2 complete.** Day total 2 cups. Sitting 3 (2 cups) deferred to the next office day per the ≤3 cups/day charter.

**State after sittings 1-2:** 2 of 6 brews · 80 g on the shelf (vial 3 has 10 g left; vials 4-8 full) · H-legal PASS (A 154.6 g) · H-transfer weak (A 1.43%, astringent, not sweet) · H-coherent-B provisional YES (B diluted coherent, sweeter) · B under floor at matched strength (114.5 g) · H-arch open pending blind pairs; sighted lean is B, against both sealed predictions (A).
- Cool read (~45°C by feel): lemongrass, a little herbal, "almost green tea-like." Operator did not get this herbal/green-tea note on the concentrated pour-over or other brews of this coffee; suspects the bigger puck. Again: "feels like this could use some dilution." (Archived control profile does list "green tea with a lemongrass bite", so the note is on-signature; the Apax sweetness is absent by design.)
- Astringency/dryness line: a little astringency (captured late, after the cool read, before sitting 2). Sweetness line: not very sweet.
- H-transfer, provisional after brew 1: character does NOT cleanly reproduce - 1.43% vs the RP8 1.13-1.20% band, reads pungent/herbal and "wants dilution" at both stages. Memory-based, cross-brewer, cross-coffee, no Apax - tagged.
- Sitting 1 complete. Operator elects to run sitting 2 same day (2 cups today, within charter).

---

### Sitting 2 - Arm B solo (2026-10-14, same office day as sitting 1)
Blank number at open: *pending re-zero*

**Brew 2 - Arm B** · 2026-10-14 · dose 20 g (vial 2 remainder 10 g + vial 3; scale reading *pending*) · chamber 110 g · 2 stirs · steep 1:00 · flip+press 1:00→1:55 · elapsed ~1:55 · dry filter · blank *pending*
- **Concentrate TDS 1.78%** (vial drawn before dilution). Below the Assistant's 1.9-2.2% guess.
- Straight spoon of concentrate: "quite sharp, pretty lemongrass." Not described as sour or thin.
- **Concentrate weight at press stop: 92.1 g** → retention 17.9 g (vs 45.4 g on Arm A - retention is NOT constant across the two water charges).
- Dilution target: 92.1 × 1.78 ÷ 1.43 = **114.6 g final** → add **22.5 g** 89°C kettle water on the scale.
- **Pre-planned decision point fires:** matched-strength final weight 114.6 g is UNDER the 150 g floor - constraint finding on the champion shape at this strength (Assistant predicted 110-130 g). No extra water added.
- Dilution poured: 22.7 g (target 22.5). **Final beverage weight 114.5 g** (under the 150 g floor). **Final TDS 1.47%** vs A's 1.43% → residual gap +0.04 (matched-TDS landed; tighter than RP9's 0.05-0.21 band).
- Judge-time read (at assembly, hot): "still that lemongrass note, but sweeter" - lemongrass, green tea, a little jasmine, a little apricot. Operator (SIGHTED, different pour from A, not a blind pick): "definitely my preferred one, even while hot"; expects it to improve cool. Plain PA tap, nothing added.
- H-coherent-B, provisional: concentrate at 1:5.5 is coherent once diluted to A-strength - no sourness/thinness reported; sweeter than A at judge-time.
- Cool read: *pending*

**Sitting 4 rule, logged BEFORE sitting 3 brews (operator decision 2026-10-14):** operator does not want to spend 40 g re-running an A-vs-B pair whose answer is already clear. Agreed conditional, consistent with the protocol's curtailment decision point:
- Sitting 3 = same arm at BOTH judge-time (post-parity) and cool picks AND operator calls the margin decisive → track curtails after sitting 3; H-arch verdict tagged **anecdote-until-reproduced**; remaining 40 g carries to the Coordinator / Track 3.
- Sitting 3 = split picks, near-call, or against the sighted lean (B) → sitting 4 runs as the full protected replicate.
Assistant pushed back on skipping the blind pair entirely (sighted leans inverted twice in RP9) and on any B-variant brew in this track (out of scope; "B at champion timing" + dilution variants are Coordinator/Track 3 work). Operator accepted: sitting 3 runs as designed on the next office day.

---

### Sitting 3 - Blind pair (2026-10-15)
Blank number at open: *pending*

**Brew 3 - Arm A** · 2026-10-15 · dose 20 g (vial 3 remainder + vial 4; reading *pending*) · chamber 200 g · timing *pending* · dry filter
- **Yield 169.4 g** → retention 30.6 g (vs 45.4 g on brew 1). **TDS 1.33%** (vs 1.43% brew 1). Press-to-hiss yield slack at 20 g: ~15 g between days, ~0.10 TDS.

**Brew 4 - Arm B** · 2026-10-15 · dose 20 g (vial 4 remainder + vial 5; reading *pending*) · chamber 110 g · timing *pending* · dry filter
- **Concentrate 83.0 g** → retention 27.0 g. **TDS 2.07%** (vs 1.78% brew 2).
- Dilution target: 83 × 2.07 ÷ 1.33 = **129.2 g final** → add **46.2 g** 89°C water. Under the 150 g floor again at matched strength.
- Dilution 1 poured → **final 127.0 g**. First TDS read 1.78 (sample hot, rejected); re-read 1.62 (still hot/unstable). Cooled-vial re-reads (auto-retest, both vials ~2 min to ambient): **A 1.41** (brew 3 re-read; press-stop read was 1.33) · **B 1.57**. Gap 0.16 → not matched.
- Dilution 2: 127 × 1.57 ÷ 1.41 = **141.4 g final** → +14.4 g 89°C water. Final B by arithmetic ≈1.41%, not re-read. Residual gap: arithmetic 0.00, instrument uncertainty ~±0.1 given the read scatter.
- **Friction (RP10-T2):** VST reads on hot samples scattered 1.78 → 1.62 → 1.57 on the same cup, and A moved 1.33 → 1.41 cooled. Hot-sample reads are unreliable; the matched-TDS primitive needs a cooled vial as the canonical read. A's press-stop 1.33 superseded by the cooled 1.41 for the match.
- Doses confirmed 20.0 g each (operator first said 18 g, corrected). Blank 0.00. Both brews ~2:00 total, method followed exactly. B final weight 141.4 g - under the 150 g floor.
- Portions: equal pours into two identical cups (weights not reported). Cups coded Left / Right by position after an eyes-closed shuffle; mapping hidden.
- **Judge-time (post-parity) pick: NOT CAPTURED** - the TDS re-read loop ran long enough that both cups were already at the cooler end when tasting began (RP8-N7 flag).
- **Blind COOL pick: LEFT.** Left: sweet, a little sour, acidity, punchy, "not as smooth." Right: bright, "more characteristic," rounder feel. Back to back, twice: left is punchy/bright/strong acidity up front; right "a little flatter, meh." Operator: "less obviously clear than the other day which one is that much better, but left." Pick = left.
- **Reveal: Left = B, Right = A.** Blind cool pick = **Arm B**, consistent with the sitting-2 sighted lean, against both sealed predictions (A).
- Post-reveal comments (SIGHTED, remainder of both brews poured in): B punchier, brighter, cleaner, more clarity, lemongrass present at "the right amount." A more muddled, less crisp, a little more body, "less clear, one note." Operator's mechanism read: diluting B "keeps the sharpness and stretches it out," A "pulls across a lot more of the body" - parallels his concentrated pour-over idea on a punchier press and a bigger dose.
- **Sitting 3 complete.** Verdict state: single-stage blind pick for B at cool, margin narrower than sighted. Judge-time stage uncaptured.
- **Friction (RP10-T2):** cooled-vial TDS reads + two dilution passes consumed the hot window. For any future pair: draw both vials into a cold-water bath immediately, read once cooled, and portion/shuffle in parallel so the judge-time read survives.
- Portion weights: not weighed; operator estimate ~30 g per cup, both about equal (flagged).

**Sitting 4 plan, pre-declared 2026-10-15 (operator + Assistant):** runs on the next office day as the protected replicate. **Method change, logged before brewing:** B is diluted BY WEIGHT, no TDS reads before tasting, to preserve the judge-time read that sitting 3 lost to the read loop. Basis from sittings 1-3: A dissolved solids ≈ 2.2-2.4 g/brew (154.6×1.43, 169.4×1.41), B concentrate ≈ 1.65-1.72 g (92.1×1.78, 83×2.07) → B final weight ≈ 0.73 × A yield. Both vials drawn at portioning into a cold-water bath and read AFTER the cool pick, so the residual gap is still recorded (expected ±~0.1). Pair tagged "strength-matched by arithmetic, verified post hoc."
