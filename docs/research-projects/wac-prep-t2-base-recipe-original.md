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
