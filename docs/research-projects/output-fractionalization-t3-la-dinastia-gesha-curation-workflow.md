# Output Fractionalization — Track 3: La Dinastia Lemongrass Honey Gesha, the curation-workflow validation

*Research Project #9 (RP9) — Output Selection / Fractionalization · OFFICE LANE*
**Status:** CLOSED 2026-10-01 — handoff brief at bottom; operator sign-off 2026-09-24 at spawn (session branch `claude/output-fractionalization-curation-8d67ff`)
**Coordinator:** persistent RP9 Coordinator session
**Protocol authored:** 2026-09-24

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
- Call `push_brew` — RP9 default is doc-only trial records (opt-in has NOT been given). `patch_brew` is likewise out of scope (the producer-field correction on the control row is P9-AI-5, queued for the fold session, NOT yours).

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

Per [`office-lane.md`](docs/skills/research-coordinator/cluster/office-lane.md): ≤15 min per experiment cup all-in · serial cadence, ≤~3 cups/office day, sessions span calendar days · single TDS read per sample · no thermometer · blank NUMBER at every instrumented sitting open · one bench-free parameter max · actual brew date per cup · per-vial weigh + physical count at Step 0 (coffee lock PRESUMPTIVE until the physical check).

**TDS fires AFFIRMATIVELY** — VST LAB III, re-zeroed with recorded blank number, per the RP9-N8 cadence (fraction TDS at sitting 1; later sittings only where verdict-bearing).

## Track 1-2 bench refinements (BAKED IN — operating defaults)

- **Per-pour tared recipe, never cumulative** (RP9-N1). **Three cups only** on a fraction brew — no separate flush cup (T2 friction 1; moot here anyway: the lived recipe has no flush).
- **Sample vials + batched TDS at end of brew** (RP9-N2); **fraction TDS at sitting 1 only** unless verdict-bearing (RP9-N8).
- **Expect a downward measured-vs-predicted offset**, band now 0.05-0.14 (RP9-N3 + T2 evidence; P9-AI-1 open); predictions from prior-day fraction TDS carry extra softness.
- **Blind position-shuffle on every preference-ordering read** (RP9-N9 — operator-executable solo, incl. re-cupping to kill volume tells).
- **Verdict-bearing reads BEFORE free tasting** (T1 friction 4).
- **Matched-TDS side-by-sides**: exploit explicitly when they land (RP9-N4).
- **Name built cups after their contents**, never size adjectives (T2 friction 2).
- **Combos taste warm-to-cool only** — don't pretend a hot/warm/cool ladder survives a long bench sequence (T2 friction 4).
- **Lived-brew replicate is the closing move** for the verdict-bearing claim (RP9-N7).

## Project framing (why this track — THE WORKFLOW TRACK)

Tracks 1-2 gave the taxonomy its two poles: Blue Iris (yeast-anaerobic honey) — tax = TAIL, winner = front-weighted + trace tail; Tabaco Pata (clean washed SL9) — tax = BLOOM, winner = bloom-cut, keep P1+P2. The taxonomy is 2-dimensional (rewards-selection? × which-fraction-is-the-tax), there is NO default winning shape (T1's winner finished last on T2, blind), and the straight-fraction probe is the shape-picker (RP9-N6).

**Operator synthesis (captured verbatim 2026-09-23 — this track exists to validate it):**

> "Fractionalization is not just about removing the last fraction and calling it a day, but rather a more iterative process than that.
> 1) Brewing each fraction (bloom, pour 1, pour 2) and then figuring out which one has the most tax in it. What has the most astringency, bitterness, sourness, etc. thats probably going to be slightly different between coffee to coffee especially in different roast levels.
> 2) Once I figured out what fraction has the most "tax" then we can reconstruct a coffee to emphasize the good and cut the bad. More of a curation exercise than anything else. For example if the pour 2 carries all the bitterness, its more about cutting that. Or if the bloom has way too much acidity and astringency it could be cutting the bloom out.
> 3) once I know which fraction has the most "tax" then it would be about recombining the rest of the fractions to create the cup I'm looking for. This could be a more concentrated cup or could be a more lengthened cup. Almost like what a mixologist would do when constructing a new cocktail. You can either concentrate and emphasize or lengthen and smooth out."

**Track 3 runs this 3-step curation workflow AS the protocol** on a deliberate middle-case coffee, and tests two things Tracks 1-2 couldn't:

1. **Predictiveness:** can the tax fraction be called ex ante from process/roast/archive knowledge? Operator and Assistant each pre-state a sealed tax prediction BEFORE the probe (the operator wrote his down at dial-in time — collect it sealed, reveal after sitting 1).
2. **The curation step, including LENGTHENING:** Tracks 1-2 only recombined ratio-true or trace-splashed. Step 3 of the workflow includes lengthen-and-smooth — keepers + hot water past natural strength. That is bypass used INSIDE a curation, which closes the RP8 removal-vs-dilution question from the inside: a curated cup may legitimately use both levers.

## Hypotheses (pre-state predicted outcomes before scoring)

- **H-workflow (the track's verdict-bearer):** the 3-step probe → cut → curate workflow, run cold on a new coffee, lands a blind-preferred cup vs the full brew within the track budget. *Test: sitting 3 lived-brew blind pair (RP9-N7). PASS = the workflow is the project's shippable output; FAIL = the taxonomy stays descriptive.*
- **H-predict (predictiveness):** at least one of the two sealed ex-ante tax predictions (operator / Assistant) names the fraction the probe convicts. *Both wrong = tax is not yet predictable at n=3; log honestly — T2's Assistant lean was falsified blind and that was the primitive working.*
- **H-curate (concentrate vs lengthen):** given this coffee's archived read (Balanced Intensity lower edge; hot cup "slightly drying, reserved front"; sweetness arriving cool), predict the winning curation is a **lengthened** build (keepers + water) rather than a concentrated one — the cup wants smoothing, not emphasis. *Directional; the curation menu tests both.*
- **H2-t3 (arithmetic, standing confirm):** gradient monotonic; recombination/curation TDS predictable within the 0.05-0.14 offset band. Lengthened builds are the new test: predicted TDS = keeper solids ÷ (keeper mass + added water).
- **H-artifact is NOT re-tested** — method validated on two coffees; sitting 1 still builds the full recombination as the probe's reference cup (same-day control memory), but a surprising read is a flag, not a track-stopper.

## Track-3 coffee (LOCKED at scoping 2026-09-24 — PRESUMPTIVE until Step 0 physical count)

| Field | Value |
|---|---|
| Coffee | **Moonwake — La Dinastia — Wilder Lazo — Lemongrass Yellow Honey Gesha — Colombia** (Huila; lemongrass co-ferment yellow honey; first brew 2026-09-24) |
| Archived control brew ID | `23b48be7-064b-4e47-9440-029e105b0cb3` (2026-09-24, converged cup 1, locked deliberately as the RP9 control; recorded AS LIVED per the P9-AI-4 lesson — no transcription drift expected) |
| Control recipe (per-pour, tared) | **SWORKS Bottomless** + xBloom Premium paper · 15 g / 240 g (**1:16**) · **EG-1 6.3** · ~95°C (boil + 60-90 s off-base) · office PA tap + Apax cup-dosing · Bloom 45 g Dial 0 (~30 s drain) → TARE, Pour 1 to **105 g** (Dial 5, = 150 g cum) → TARE, Pour 2 to **90 g** (Dial 5, = 240 g cum in, then **Dial 6 to dry bed — NO flush**) · total ~3:00-3:30 |
| Control profile | Dried apricot / jasmine / lemongrass / honey / green tea · hot: slight drying, reserved front · warm: herbal-forward, sweetness recessed · cool: sweetness up, lemongrass as a bite on the tea finish · **cool-weighted verdicts** |
| Vials | **~14 × 15 g** reserved for Track 3 (weigh + count at Step 0) |
| Track budget | **5 vials** (probe 1 · curation 2 · lived pair 2); reserve extension possible but ask, don't drift |

**Fraction boundaries** = 45 / 150 / 240 g (stated in the control's strategy_notes): **F-B** (bloom, expect ~20-25 g out) · **F-P1** (Dial-5 window to 150 g cum) · **F-P2** (Dial-5 pour + Dial-6 drawdown to dry bed). Valve close (Dial 0) + cup swap + TARE at each boundary; drain-to-trickle wins over the pour schedule. **Three cups only.**

**Known data flag (P9-AI-5, seeded at scoping):** the control row's `producer` field reads "Wilton Benitez" — wrong; the coffee is Wilder Lazo (name field + dial-in session agree). Correction via `patch_brew` belongs to the FOLD session, not this track. Ignore at the bench.

**Coffee-specific cautions:**
- **Middle case by design** — the archive gives ambiguous tax candidates (hot drying could implicate the tail; the herbal-grassy recessed warm phase could be P2 or bloom; the lemongrass bite rides the tea finish). Do NOT let the archive read pre-convict a fraction; the sealed predictions exist precisely to be falsified.
- **Cool-weighted verdicts** — sweetness arrives cool on this cup.
- Process-forward co-ferment: if the lemongrass localizes in ONE fraction, that's a taxonomy-grade observation on its own (where does an infusion layer live in the extraction?). Record it even though it's not a hypothesis.

## The 3-step workflow as sitting plan (5 vials)

| Sitting | Vials | Workflow step | What happens |
|---|---|---|---|
| **1 — The probe** | 1 | Step 1: find the tax | Collect BOTH sealed tax predictions FIRST (operator's written one + Assistant's, logged in this doc before the brew). Fraction brew → weights + batched fraction TDS → full recombination built ratio-true as the reference cup (taste vs same-day control memory) → straight fractions, cool-weighted, blind-shuffled where volumes allow → **operator names the tax fraction + the keeper profile** ("what am I curating toward?"). Reveal predictions vs verdict (H-predict). Then, with the operator, **pre-register the sitting-2 curation menu** (2-3 builds) — designs follow the probe, not prior tracks (RP9-N6). |
| **2 — The curation menu** | 1 | Steps 2-3: cut + recombine | Fraction brew → build the pre-registered menu from keepers. Menu MUST span both intents: at least one **concentrated** build (keepers at or above natural strength) and at least one **lengthened** build (keepers + hot office-kettle water to a predicted target TDS ~0.15-0.25 below the keepers' natural strength — predicted TDS computed pre-build). A down-weighted tax variant (tax fraction in trace, T1-style) is the third slot IF the probe suggests the tax has something to contribute. Blind position-shuffle (RP9-N9), warm-to-cool reads, preference order. **Winner = the curated build.** |
| **3 — The lived pair** | 2 | Workflow validation | Translate the winning curated build into a LIVED single-brew recipe (e.g. "cut the bloom, lengthen with 40 g water at the end" or "stop at 150 g, splash 10 g tail" — whatever the winner implies). Brew it for real; brew the full control recipe alongside; blind 2-cup pair (RP9-N7 shape, uninstrumented waiver available if strengths are already on file). **H-workflow verdict.** |
| **(reserve)** | 1 | — | Repeat/tie-break of the verdict-bearing read, or a second curation iteration if sitting 2's menu misses (the workflow claims to be iterative — one iteration loop is in-scope; more than one, surface to the Coordinator). |

**Budget-conditional waivers (conscious, logged):** calibration shot WAIVED (operator's own day-old converged recipe; substitute: RP8-N17 transcription-verify at cup 1 — expected trivial since the card was recorded as-lived). Rung-0 control re-brew WAIVED (sitting 1 full recombination + same-day control memory; sitting 3 brews the real control anyway as the blind pair's second cup — the track's strongest control read arrives there).

## Step 0 (run to completion before any scoring)

1. **Physical count + per-vial weigh** (primitive 9) — ~14 presumptive; 5 allocated.
2. **VST re-zero + blank number** (primitive 7) — every instrumented sitting open.
3. **Sealed tax predictions collected + logged** — operator's (written at dial-in, unrevealed) and Assistant's own, with one-line reasoning each. This is Step 0's NEW primitive-candidate; it must land before the first pour.
4. **Transcription-verify** (RP8-N17) — walk the lived recipe back; capture pour start times if the operator has them.
5. **Cup logistics** — three fraction cups + sample vials + combo cups; kettle available at sitting 2 for lengthened builds (hot water is an ingredient this track).
6. **Pre-state H-workflow / H-predict / H-curate / H2-t3 predicted outcomes** in this doc.

## Recording sheet (per fraction / per build)

`sitting # · brew date · vial weight · fraction/build ID (content-named) · build spec (g of each fraction + g water) · weight (g) · TDS (blank #) · predicted TDS · taste note (warm-to-cool; aroma / structure / finish) · blind position + preference · flags (RP8-N7)`

## Exit conditions

Track closes when: the probe convicts a tax fraction (or explicitly convicts NONE — "doesn't reward selection" is a legitimate taxonomy entry that would end the track early at 2-3 vials with the full cup as winner), the curation menu runs with both intents represented, the lived pair delivers an H-workflow verdict, and the handoff brief lands with: the La Dinastia taxonomy entry (tax fraction + winning build + lived recipe), the H-predict scorecard, and a **workflow writeup sharp enough to run on coffee #4 without fractionating gear beyond cups + a scale** — that writeup is the project's shippable payload and the end-document's centerpiece.

## Open questions (carried)

- P9-AI-1 (offset cause) / P9-AI-2 (sample-temp reads): open watch-items; note evidence, don't chase.
- P9-AI-5 (control-row producer field): fold session's, not yours.
- Grilling item 58 ("down-weight" vocabulary + concentration overlap): generate evidence, don't resolve.
- Where does a co-ferment infusion layer live in the extraction? Opportunistic observation, not a hypothesis.
- Project close is expected after this track: end-document + retro next. Flag anything the retro should chew on.

---

## Step 0 log (2026-09-24, session open)

| # | Sub-step | Result |
|---|---|---|
| 1 | Physical count + weigh | **14 vials confirmed** on hand (presumptive lock → CONFIRMED). 5 allocated to this track, 9 stay in reserve. Per-vial weigh: sitting-1 vial recorded at the sitting-1 row (nominal 15 g). |
| 2 | VST re-zero + blank | Blank **0.00** (sitting 1 open). |
| 3 | Sealed tax predictions | Both logged below, BEFORE the first pour. Locked; no revision after the probe. |
| 4 | Transcription-verify (RP8-N17) | Operator re-stated the lived recipe (pasted card): 15 g / 240 g / 1:16 · EG-1 6.3 · PA tap + Apax (1 JAMM + 1 TONIK per ~200 mL) · 0:00 bloom 45 g Dial 0 hold ~30 s (≤25-30 s closed) · 0:30 pour 1 to 150 g cum Dial 5 · 1:30 pour 2 to 240 g cum Dial 5, then Dial 6 to dry bed, no flush · target 3:00-3:30. **Matches the protocol card — zero drift on pours/valve/boundaries.** ONE as-lived caveat captured: **the kettle stayed ON (on-base) the whole brew**, so the "~60-90 s off-base wait" describes the stance, not what happened; effective pour temperature ran closer to boil than ~95°C. Logged as-lived; the fraction brews replicate the kettle-on stance so the probe matches the control. |
| 5 | Cup logistics | Three fraction cups + sample vials + combo cups; kettle available at sitting 2 (hot water is an ingredient). Lengthened-build water convention: kettle-off-boil straight into the keepers, read warm-to-cool, no thermometer (operator OK'd). |
| 6 | Hypothesis outcomes pre-stated | See block below. |

**Operator decisions at Step 0 (ergonomic, operator-owned):** sighted straight fractions at sitting 1 (bloom ~20-25 g vs ~90-105 g pours makes volume an unavoidable tell; blind shuffle reserved for sittings 2 + 3). Spawn = scoping sign-off.

### Sealed tax predictions (logged before the first pour — LOCKED)

**Operator (written at dial-in, transcribed verbatim from his Step 0 reply):**
> "I think the bloom will be pretty pungent for this one but i think a more front loaded version of this one would be better to push the fruit characteristic a bit more. Either all bloom + P1 or potentially bloom + p1 + a splash of p2. p2 is probably going to be more grassy and thin"

→ Operator's call: **tax = F-P2** (grassy, thin). Keeper profile = front-loaded fruit: F-B + F-P1, optionally + trace F-P2. Bloom flagged pungent but NOT called the tax.

**Assistant (Claude, this session):**
→ Call: **tax = F-P2.** Reasoning: the archived control's three tax-shaped notes (hot "slight drying", warm "herbal-forward, sweetness recessed", cool "lemongrass as a bite on the tea finish") are all late-extraction signatures — drying + tea + grassy are what a Dial-6-to-dry-bed drawdown pulls from a honey-process bed. The bloom on a lemongrass co-ferment should carry the infusion aromatics + honey sweetness (keeper, not tax), which is the Blue Iris shape (honey co-ferment → tail tax), not the Tabaco Pata shape (clean washed → bloom tax). Secondary lean: if P2 is NOT the tax, the bloom is (pungent acidity/astringency), and P1 is the keeper either way.

**Independence caveat (friction, logged honestly):** the Assistant's prediction was written AFTER reading the operator's, because both arrived in the same reply. Same fraction named by both, so H-predict cannot separate "two independent calls" from "one call echoed." Next time: Assistant states its prediction in the read-back message BEFORE asking the operator for his. See friction 1 below.

### Pre-stated hypothesis outcomes

- **H-workflow:** PASS predicted — a front-loaded curated single-brew (stop or restrict at the 150 g boundary, then lengthen or trace-splash) beats the full control blind at sitting 3.
- **H-predict:** PASS predicted (both calls = F-P2). If the probe convicts F-B instead, the co-ferment bloom pungency was the tax and both ex-ante calls were anchored on the archive's tail language — log as the primitive working.
- **H-curate:** LENGTHENED wins predicted (F-B + F-P1 + hot water to a target ~0.15-0.25 below the keepers' natural strength). Risk: the operator's own keeper language is "push the fruit" (an emphasize intent), so a concentrated F-B+F-P1 build is the live competitor.
- **H2-t3:** gradient monotonic (F-B > F-P1 > F-P2 TDS); recombination + concentrated build measured 0.05-0.14 below predicted; lengthened build within the same band using keeper solids ÷ (keeper mass + water).

---

## Sitting 1 — the probe (brew date: 2026-09-24, same day as the archived control)

Order at the bench (deviation from the card, operator-requested + Assistant-accepted): straight fractions FIRST (sighted, cool-weighted), full recombination AFTER from the remainders, all TDS batched at the end. Justification: control brewed the same morning, so same-day memory covers the reference-cup role; recombination kept for the H2-t3 arithmetic point + artifact flag. Blank 0.00. Kettle-on stance replicated. Vial weight **15.0 g**. Total brew time ~3:00 (not clocked precisely: valve-close + cup-swap + tare at each boundary makes fraction-brew time non-comparable to the single brew; operator judgement call, logged as friction 5).

| Fraction | Out (g) | TDS | Solids (g, TDS×mass/100) | Taste (warm → cool) |
|---|---|---|---|---|
| **F-B** (bloom 45 g in) | 24.1 | **1.81** | 0.436 | Punchy, acidic, sour-grassy. **The lemongrass lives here.** "Good flavoring agent, on its own quite punchy." Cool: same, lemongrass/grassy up a notch. |
| **F-P1** (to 150 g cum) | 90.5 | **1.37** | 1.240 | Nutty, darker tea. Little sweetness hot. Cool: some perceived sweetness, **majority of the body**, but **a drying edge persists**. |
| **F-P2** (to 240 g + dry bed) | 87.2 | **0.65** | 0.567 | Delicate tea. Cool: **much smoother, higher perceived sweetness, no drying note.** Operator: "this coffee wants to be more back-weighted." |
| **Recombination** (all remainders, stirred) | (n/a, post-tasting remainders) | **1.14** | — | Lemongrass tea, grassy, a little sweetness. Reads slightly LESS sweet than the morning control — see Apax confound below. |

Total out 201.8 g of 240 g in (retention ~38 g, normal). **Gradient monotonic** (1.81 > 1.37 > 0.65): H2-t3 gradient leg CONFIRMED.

**Recombination arithmetic:** predicted ratio-true TDS = 2.243 g solids ÷ 201.8 g = **1.11**. Measured **1.14**, i.e. **+0.03 ABOVE predicted** — outside (and opposite in sign to) the 0.05-0.14 downward band. Caveat: the recombined cup was built from post-tasting remainders, not the full fractions, so the proportions are unknown; the operator likely drank unequal shares. Weak evidence; logged for P9-AI-1, not chased. Full-fraction builds at sitting 2 are the clean test.

**Co-ferment infusion layer — LOCALIZED.** The lemongrass sits in the bloom, and barely elsewhere (P1 reads nutty/tea, P2 reads tea/sweet). Taxonomy-grade observation: on this yellow-honey co-ferment the infusion layer is a front-fraction phenomenon. Recorded per the protocol's opportunistic-observation clause.

**Operator's live curation lean (pre-conviction, pre-reveal):** back-weighted — keep P2 as the base, add the bloom for punch ("taking the back and putting in the bloom"); P1 is where the drying edge lives.

### Probe verdict (operator, 2026-09-24)

- **Tax fraction: F-B (bloom).** Not "delete it": it is the most VOLATILE fraction — carries most of the lemongrass sourness. Usable as a flavoring agent, minimal or not at all.
- **Keeper profile:** back-weighted. P2 as the base (cleanliness, smoothness, sweetness), with the bloom's punch layered in at trace. P1 is body-plus-drying-edge: keep some for layering, not all.
- **Curation intent named by the operator:** "cleanliness of P2 but the punch of the bloom."

### Sealed-prediction reveal — H-predict scorecard

| Predictor | Sealed call | Probe verdict | Result |
|---|---|---|---|
| Operator (dial-in) | tax = F-P2 (grassy, thin) | tax = F-B | **WRONG** |
| Assistant | tax = F-P2 (drawdown signatures) | tax = F-B | **WRONG** |

**H-predict: FAIL (0 of 2).** Both calls anchored on the archive's tail language (drying / tea / grassy) and both were falsified blind-to-outcome: P2 turned out to be the SMOOTHEST, sweetest fraction, and the grassy-sour punch the archive attributed to the finish lives in the bloom. Third coffee, third time the sealed-lean was wrong or partial (T2 Assistant lean falsified; T3 both falsified). Standing read for the end-document: **at n=3 the tax fraction is NOT predictable from process/roast/archive notes; the probe is mandatory, not optional.** That is the primitive working, not a failure. Note also: the operator's keeper INTENT ("front-loaded, push the fruit") inverted to "back-weighted" after the probe — the probe picks the shape (RP9-N6) on the intent axis too, not just the fraction axis.

**Interpretive note for the taxonomy (surface at retro, don't resolve here):** the operator's two proposed builds cut P1 (fully or partly) while keeping bloom at trace-to-full. So the "tax" on this coffee is arguably two-dimensional — the bloom is the *volatility* tax (sourness), P1 is the *texture* tax (drying edge). The Step 1 single-fraction conviction is bloom; the menu below tests both readings. Feeds grilling item 58 (down-weight vocabulary).

**Confound flagged by the operator:** the control cup carried the Apax cup-dose (1 JAMM + 1 TONIK per ~200 mL); the fractions did not, because the dose cannot be split across three cups. Straight fractions therefore read with slightly less fruit-sweetness than the control. Decision: the curated builds at sittings 2 and 3 get the standard cup-dose AFTER assembly, so the winner is compared like-for-like with the control. Logged as friction 3.

---

## Sitting 2 — the curation menu (PRE-REGISTERED 2026-09-24 at sitting-1 close, operator-confirmed — FROZEN)

Built from ONE vial (operator declined the reserve; small builds accepted). All builds UNDOSED (Apax cannot scale to 40-70 g cups; dosing resumes at the full-size lived pair, sitting 3). Blank number at open. Fraction quantities below assume sitting-1 weights/TDS; **recompute at the bench from that day's fraction reads before pouring**, preserving the ratios. Blind position-shuffle (RP9-N9), warm-to-cool reads, preference order. Winner = the curated build.

| Build (content-named) | Spec (from sitting-1 reads) | Predicted TDS | Intent slot |
|---|---|---|---|
| **P2 + bloom** | 30 g P2 + 8 g bloom (38 g) | 0.89 | concentrated (keepers at natural strength); operator build A, ratio-true; tests "P1 is the tax" |
| **P2 + P1 + trace bloom** | 30 g P2 + 30 g P1 + 5 g bloom (65 g) | 1.07 | concentrated; operator build B (layered); tests "bloom is the tax, down-weighted" |
| **Lengthened P2 + P1 + trace bloom** | 27 g P2 + 27 g P1 + 4.5 g bloom + **15 g off-boil kettle water** (73.5 g) | **0.85 target** (natural 1.07 − 0.22) | lengthened (mandated); same keepers as B, smoothed |

Predicted-vs-measured offset expectation: 0.05-0.14 below (RP9-N3). Lengthened-build arithmetic: solids ÷ (keeper mass + water). Down-weighted-tax third slot is folded into build B (trace bloom) rather than a fourth cup.

### Sitting 2 bench (brew date 2026-09-25)

Blank **0.00** · vial **15.0 g** · fraction brew per sitting-1 recipe, kettle-on, undosed.

| Fraction | Out (g) | TDS | Solids (g) | vs sitting 1 |
|---|---|---|---|---|
| F-B | 22.4 | 1.63 | 0.365 | −1.7 g / −0.18 |
| F-P1 | 96.3 | 1.45 | 1.396 | +5.8 g / +0.08 |
| F-P2 | 84.3 | 0.73 | 0.615 | −2.9 g / +0.08 |

Total out 203.0 g; ratio-true full-cup TDS would be 1.17. Gradient monotonic again. Day-to-day fraction drift is small but real (bloom −0.18): supports the "recompute at the bench" rule.

**Builds recomputed (ratios preserved, P2 shares trimmed to fit 84.3 g):**

| Build | Spec (today) | Solids (g) | Predicted TDS |
|---|---|---|---|
| **P2 + bloom** | 29 g P2 + 8 g bloom (37 g) | 34.2/100 | **0.92** |
| **P2 + P1 + trace bloom** | 29 g P2 + 29 g P1 + 5 g bloom (63 g) | 71.4/100 | **1.13** |
| **Lengthened P2 + P1 + trace bloom** | 26 g P2 + 26 g P1 + 4.5 g bloom + **14 g off-boil water** (70.5 g) | 64.0/100 | natural 1.13 → **target 0.91** |

Lengthened arithmetic: 0.640 g ÷ (56.5 g + 14 g) = 0.91. Specs + predictions written BEFORE assembly (protocol gate honored). Leftover: ~9 g bloom, ~41 g P1.

### Sitting 2 reads (blind position-shuffle, operator solo; cups had cooled during assembly so reads are warm-to-cool compressed)

| Position | Build (revealed after) | Pred TDS | Meas TDS | Offset | Taste |
|---|---|---|---|---|---|
| Left | Lengthened P2 + P1 + trace bloom | 0.91 | **0.83** | −0.08 | Nutty, tea-forward, little sweetness; a touch more sweetness on the rinsed re-sip, still "nutty category." |
| Middle | P2 + P1 + trace bloom | 1.13 | **0.99** | −0.14 | More sweetness, a little more pungent. Head-to-head vs right: "more things going on, more complexity." |
| Right | P2 + bloom | 0.92 | **0.83** | −0.09 | Much lighter, daintier; head-to-head: "a little more thin." |

**Preference order: 1st = P2 + P1 + trace bloom (middle).** Middle beat left directly and beat right head-to-head; left vs right was not head-to-headed (2nd/3rd unordered).

**Winner = the curated build: P2 + P1 + trace bloom** (29 g P2 + 29 g P1 + 5 g bloom → the layered, concentrated-intent build).

**H-curate: FAIL.** Predicted a lengthened winner; the lengthened build did not win (and read the flattest of the three: nutty/tea, sweetness recessed). On this coffee, water smoothed the sweetness away rather than the drying edge. The complexity/sweetness came from keeping P1 in.

**H2-t3 (arithmetic): CONFIRMED.** All three offsets inside 0.05-0.14 (−0.08 / −0.14 / −0.09); the lengthened build's solids ÷ (keepers + water) formula held (0.91 → 0.83).

**Matched-TDS side-by-side landed (RP9-N4):** the lengthened build and P2 + bloom both measured 0.83 yet read completely differently (nutty/tea vs light/dainty). Composition, not strength, drove the read. Strong evidence for the taxonomy that "how long" and "which fractions" are separate levers.

**Translation note (surfaced to the operator before sitting 3):** the winning build is close to ratio-true. Bloom share of keepers = 5/58 = 8.6% vs 12.4% in the full cup; P1:P2 = 1:1 vs 1.14:1 in the full cup. So the winner is "full cup with the bloom down-weighted by about a third, P1 and P2 kept whole." A faithful lived translation splashes back ~15 g of the ~22 g bloom; the operator's stated intent ("minimal or not at all") points to a ~5 g trace splash instead. Decision logged below.


**Operator decisions at sitting-2 close (2026-09-25):** trace translation (5 g bloom splash-back, NOT the proportion-faithful 15 g) — operator intent "bloom minimal" wins over ratio fidelity; TDS read on BOTH cups at sitting 3; Apax 1 JAMM + 1 TONIK in both cups regardless of the ~185 g vs 240 g volume gap. Operator observation on Apax: "the JAMM and TONIK were adding a lot more sweetness and character to the cup than I realized — without it they all feel darker-tea-centric." Logged for the office-lane charter + RP6 water memory (dosed water is part of this coffee's signature, not a neutral carrier).

## Sitting 3 — the lived pair (PRE-REGISTERED 2026-09-25 — FROZEN)

2 vials. Blank number at open, both vials weighed. Both cups dosed 1 JAMM + 1 TONIK post-brew. TDS read on both cups (translation check on the curated cup). Blind 2-cup pair, operator solo position-shuffle, cool-weighted verdict. **H-workflow verdict.**

**Cup A — Control (full lived recipe, 240 g):** 15 g / EG-1 6.3 / kettle-on off-boil / bloom 45 g Dial 0 ~30 s → pour 1 to 150 g cum Dial 5 → pour 2 to 240 g cum Dial 5 → Dial 6 to dry bed, no flush. Single serving cup throughout.

**Cup B — Curated (bloom-cut with trace splash-back, "La Dinastia curated"):** 15 g / EG-1 6.3 / kettle-on off-boil. Bloom 45 g Dial 0 ~30 s **into a side cup**. Close valve, swap to the serving cup, tare. Pour 1 to 105 g on the tared scale, Dial 5 (= 150 g cum in). Pour 2 to 90 g, Dial 5, then Dial 6 to dry bed, no flush (= 240 g cum in), all into the serving cup. **Splash 5 g of the bloom from the side cup into the serving cup**; discard the rest (~17 g). Predicted TDS (from sitting-2 fraction reads): (1.396 + 0.615 + 0.082) ÷ 185.6 = **1.13**; expect measured ~1.00-1.08. Control predicted ratio-true ~1.17.

### Sitting 3 reads (brew date 2026-09-28; operator solo blind pair; both cups dosed; kettle-on stance; grind 6.3 re-confirmed at the bench)

| Position | Cup (revealed after) | Pred TDS | Meas TDS | Taste (hot → cooler) |
|---|---|---|---|---|
| Left | **Curated** (bloom-cut + 5 g splash) | 1.13 | **0.92** | Hot: bright, brown-tea. Cooler: darker, caramelly tea, some complexity. Head-to-head: "nutty tea, a little underneath." |
| Right | **Control** (full cup) | ~1.17 | **0.70** (anomalous, see below) | Hot: a little lighter. Cooler: **lemongrass present, which the left lacks** — "adding complexity rather than just tea." Head-to-head: "a lot more going on." |

**Preference: RIGHT = the FULL CUP.** Operator's blind guess mid-read was that the lemongrass cup was the one "where the bloom is added in" — correct mechanism, wrong cup: the lemongrass cup was the control, because the curated cup had cut ~78% of the bloom and the bloom is where the lemongrass lives (sitting 1).

**H-workflow: FAIL as run.** The 3-step workflow, run cold, did NOT land a blind-preferred cup vs the full brew on this coffee. Operator's own close: "fractionalization and taking the best fraction only works in certain circumstances but not always — especially not worth the extra effort."

**Two flags on the read, logged honestly:**

1. **Control TDS 0.70 is anomalous.** A 15 g / 240 g brew that read 1.14 as a remainder-recombination and predicts ~1.17 ratio-true came in at 0.70 — a −0.47 miss, far outside any offset band, while the curated cup's −0.21 is merely wide. Candidate causes: vial drawn after dosing/dilution, vial mix-up between cups, a channelled/fast brew (total time was not reported), or a read error. The operator DID perceive the control as "lighter," which is consistent with a genuinely weak brew. Not chased (office-lane charter: single read per sample). Consequence: the blind pair compared a curated cup at 0.92 against a full cup at 0.70, so the verdict carries a strength confound — and the weaker cup still won on complexity. P9-AI-1 evidence.
2. **The trace translation overshot the winning proportion.** Sitting 2's winner carried bloom at 8.6% of keepers; the full cup carries 12.4%; the lived curated cup carried ~2.7%. The Assistant recommended trace over the proportion-faithful 15 g splash, reasoning that a faithful version would be a blind coin-flip. The lived pair then lost precisely on the lemongrass that the deeper cut removed. **The faithful translation was never tested.** Accountability: this was the Assistant's recommendation, operator-confirmed; it is the one place the track deviated from "the winning build IS the recipe."

**Taxonomy read for La Dinastia (provisional, pending the operator's close decision):** *does not reward selection at the bloom-cut depth tested.* Tax fraction convicted straight = bloom (volatile lemongrass sourness), but at full-cup dilution that same fraction is the coffee's signature layer — the "tax" is a flavoring agent, exactly as the operator said at the probe. Cutting it removes the thing the cup is about. Winner = the full cup. The infusion-layer localization (lemongrass = bloom) is the durable finding.

**Operator resolution on the flags (2026-09-28):** the control's vial was probably drawn AFTER the Apax dose went in → **0.70 read STRUCK** (procedure slip, not a coffee finding; the anomaly does not feed P9-AI-1). Control total time not recalled, "felt pretty normal." **Close decision: option 2 — one extension pair on 2 reserve vials, on a different day, to test the proportion-faithful translation and to confirm the sitting-3 verdict.** Budget extension explicitly authorized by the operator (5 → 7 vials of 14; 7 remain).

## Sitting 4 — extension pair: the faithful translation (PRE-REGISTERED 2026-09-28 — FROZEN)

2 vials. Blank number at open, both vials weighed. **Draw BOTH sample vials BEFORE dosing** (sitting-3 lesson). Clock total time on BOTH brews and report it with the weights. Then dose both cups 1 JAMM + 1 TONIK. Blind 2-cup pair, operator solo shuffle, cool-weighted verdict.

**Cup A — Control (full lived recipe):** unchanged from sitting 3.

**Cup B — Curated-faithful ("bloom down-weighted by a third"):** 15 g / EG-1 6.3 / kettle-on off-boil. Bloom 45 g Dial 0 ~30 s **into a side cup**. Close, swap to the serving cup, tare. Pour 1 to 105 g Dial 5. Pour 2 to 90 g Dial 5, then Dial 6 to dry bed, no flush. **Splash back 15 g of the bloom** from the side cup (weigh it in); discard the remaining ~7 g. Bloom share of keepers ≈ 15/181 = 8.3% (sitting-2 winner was 8.6%). Predicted TDS (sitting-2 fraction reads): (1.396 + 0.615 + 15×1.63/100 = 0.245) ÷ 195.6 = **1.15**; control ratio-true ~1.17. Expect both measured ~1.03-1.12.

**Reading of outcomes, pre-stated:**
- Faithful curated preferred blind → H-workflow flips to PASS at one iteration (the workflow needed its cut-depth loop; sitting 3's loss was a translation error, not a workflow failure). Taxonomy: rewards selection, tax = bloom down-weighted ~1/3, keep P1 + P2 whole.
- Control preferred again, or a coin-flip → H-workflow FAIL confirmed at two depths. Taxonomy: does not reward selection; full cup wins; lemongrass = bloom.
- Either way, both control TDS reads (pre-dose this time) replace the struck 0.70.

### Sitting 4 reads (brew date 2026-10-01; both vials drawn pre-dose; both times clocked)

| Cup | Brew time | Pred TDS | Meas TDS | Sighted first-pass | Blind position | Blind read (hot → cooler) |
|---|---|---|---|---|---|---|
| A — Control | ~2:30 | ~1.17 | **0.99** | Aroma fruit/sweet/light acid; sip fruit, sweet, "a little flatter" hot | **Right** | A little more acidity; "pretty close to the other one." Cooler: improved more than the other; softer-yet-placed acidity, "doesn't feel jumbled, feels more placed." |
| B — Curated-faithful (15 g bloom back) | ~2:40 (cup-swap + bloom drain) | 1.15 | **0.99** | Aroma fruity/sweet/little tart; "nicer acidity, less flat" hot | **Left** | "The flatter one." Cooler: improving, bouncy acidity, "better." |

**Matched TDS, 0.99 / 0.99** — the cleanest matched-TDS side-by-side of the project (RP9-N4). Both ~0.16-0.18 under prediction, inside/at the band edge; the sitting-3 0.70 is confirmed as a post-dose artifact.

**Blind preference: RIGHT = CONTROL (slight).** Operator's sighted first pass had leaned B (curated); blind, with the cups cooler, the lean flipped to the control and the sighted lean was wrong — same inversion as sitting 3. Operator's blind guess ("this is the curated cup") was wrong again. Operator's close: "there's such a little difference — taking a little bit of the bloom out is not really affecting the cup that much. Going through this work just to take out a little bit in the bloom is not worth it. Full cup won out."

**H-workflow: FAIL, confirmed at two cut depths** (trace 2.7% bloom at sitting 3; faithful 8.3% at sitting 4). Both lost to the full cup blind; the faithful one was near-indistinguishable.

**Taxonomy entry locked: La Dinastia does NOT reward selection.** Winner = full cup. Convicted volatile fraction = bloom (lemongrass carrier); cutting it removes signature (deep cut) or does nothing (shallow cut).

---

## HANDOFF BRIEF FOR COMPILE SESSION (RP9 Track 3 — La Dinastia Gesha curation-workflow Close-Out)

**Date:** 2026-10-01
**Session role:** execution + handoff brief production (no substrate edits)
**Archive location:** branch `claude/output-fractionalization-curation-8d67ff` @ `a460130e (brief commit; the SHA-fill commit that follows is the final tip)`, pushed to origin (the compile session fetches/branches from here — the archive doc is committed; substrate is NOT; not merged to main). See [`role-discipline.md` § Archive persistence](docs/skills/research-coordinator/cluster/role-discipline.md).
**Methodology verdict:** ❌ **H-workflow FAILS on this coffee (two cut depths, blind); H-predict FAILS (0/2); H-curate FAILS (lengthened lost); H2-t3 CONFIRMS.** The 3-step curation workflow ran cleanly end-to-end and produced a correct, legitimate taxonomy entry — "does not reward selection" — which is the exit condition the protocol named. The workflow is validated as a *classifier*; it is NOT validated as a cup-improver on a middle-case coffee.

This brief closes the expected final track of RP9. Consume it for: the La Dinastia taxonomy entry, the H-predict scorecard, the coffee-#4 workflow writeup (§ Final output), and the project-close/retro flags. All bench detail is in the doc body above; the brief is the structured cut.

### TL;DR

- **Full cup wins La Dinastia blind, twice** (vs a trace-bloom curated cup at sitting 3; vs a proportion-faithful curated cup at matched 0.99/0.99 TDS at sitting 4). Taxonomy: does not reward selection.
- **The probe convicted the bloom** (sour, punchy, 1.6-1.8 TDS straight) — and the bloom is where the **lemongrass co-ferment layer lives**. The "tax" straight is the signature at cup dilution.
- **Both sealed ex-ante predictions were wrong** (both said P2; P2 was the smoothest fraction). At n=3 coffees, the tax fraction is not predictable from archive/process notes; the probe is mandatory.
- **Lengthening lost** (flattest of three builds); the layered concentrated build (P2 + P1 + trace bloom) won the sitting-2 menu but did not beat the full cup when translated.
- **Arithmetic held throughout**: monotonic gradients both probes; all full-fraction build offsets inside −0.05 to −0.14; lengthened-build formula solids ÷ (keepers + water) verified (0.91 → 0.83).
- **Two matched-TDS side-by-sides**: 0.83/0.83 at sitting 2 read completely different (composition lever); 0.99/0.99 at sitting 4 read near-identical (shallow bloom cut is inert).
- **Sighted lean inverted blind at both lived pairs** — RP9-N9 (blind everything) earned its keep twice in one track.

### Execution summary

4 sittings over 8 calendar days (2026-09-24 → 10-01), 7 vials of 14 consumed (5 allocated + 2 operator-authorized extension), 7 remain. Sitting 1 probe (fractions + remainder recombination), sitting 2 three-build curation menu from one vial, sitting 3 lived pair (trace translation), sitting 4 extension lived pair (faithful translation). Protocol held with three logged deviations: fractions tasted before recombination at sitting 1 (same-day control justified it); straight fractions sighted at sitting 1 (volume tell, operator-owned); trace translation chosen over proportion-faithful at sitting 3 (Assistant recommendation, later corrected by sitting 4). One struck read (sitting-3 control 0.70, post-dose vial). Both waivers (calibration shot, rung-0 re-brew) honored with their substitutes. No `push_brew` / `patch_brew` calls. No substrate edits.

### Equipment / conditions

| Item | Value |
|---|---|
| Coffee | Moonwake — La Dinastia — Wilder Lazo — Lemongrass Yellow Honey Gesha — Colombia (Huila); 15 g vials, 14 on hand at Step 0 |
| Brewer / filter / grinder | SWORKS Bottomless + xBloom Premium paper + EG-1 @ 6.3 |
| Recipe (per-pour tared) | 15 g / 240 g (1:16) · bloom 45 g Dial 0 ~30 s · pour 1 to 150 g cum Dial 5 · pour 2 to 240 g cum Dial 5 → Dial 6 to dry bed · no flush |
| Water | PA office tap; **kettle stayed on-base throughout (near-boil pours)** on every brew incl. the archived control — card's "60-90 s off-base" was stance, not practice |
| Mineral dose | Apax 1 JAMM + 1 TONIK per finished cup — **control only at sitting 1; none at sitting 2; both cups at sittings 3-4 (post-vial-draw at 4)** |
| TDS | VST LAB III, blank 0.00 at every sitting; one read per sample; sample vials drawn per cup, batched |
| Control brew row | `23b48be7-064b-4e47-9440-029e105b0cb3` (2026-09-24); producer field wrong (P9-AI-5, fold's) |

### Per-pull / per-measurement raw data

| Sitting / date | Cup (content-named) | Spec | Out (g) | Pred TDS | Meas TDS | Offset | Blind pos / pref | Verdict-bearing note |
|---|---|---|---|---|---|---|---|---|
| S1 09-24 | F-B | bloom 45 g in | 24.1 | — | 1.81 | — | sighted | punchy, sour-grassy, **lemongrass here** |
| S1 | F-P1 | to 150 g cum | 90.5 | — | 1.37 | — | sighted | nutty/dark tea, body, drying edge |
| S1 | F-P2 | to 240 g + dry bed | 87.2 | — | 0.65 | — | sighted | smooth, sweetest, delicate tea |
| S1 | Recombination | post-tasting remainders | n/a | 1.11 | 1.14 | +0.03* | — | *remainders, proportions unknown; weak |
| S2 09-25 | F-B | bloom | 22.4 | — | 1.63 | — | — | fraction read |
| S2 | F-P1 | pour 1 | 96.3 | — | 1.45 | — | — | fraction read |
| S2 | F-P2 | pour 2 | 84.3 | — | 0.73 | — | — | fraction read |
| S2 | P2 + bloom | 29 P2 + 8 B | 37 | 0.92 | 0.83 | −0.09 | right / 2nd-3rd | light, dainty, thin |
| S2 | P2 + P1 + trace bloom | 29 P2 + 29 P1 + 5 B | 63 | 1.13 | 0.99 | −0.14 | middle / **1st** | sweet, pungent, complex |
| S2 | Lengthened P2 + P1 + trace bloom | 26 P2 + 26 P1 + 4.5 B + 14 water | 70.5 | 0.91 | 0.83 | −0.08 | left / 2nd-3rd | nutty, tea, flat |
| S3 09-28 | Curated (trace, 5 g bloom back) | lived single brew | ~186 | 1.13 | 0.92 | −0.21 | left / lost | nutty tea, no lemongrass |
| S3 | Control | full recipe | ~240 | ~1.17 | ~~0.70~~ STRUCK | — | right / **won** | lemongrass present, complexity; vial post-dose |
| S4 10-01 | Curated-faithful (15 g bloom back) | lived, 2:40 | ~196 | 1.15 | 0.99 | −0.16 | left / lost (slight) | flatter → bouncy acidity cool |
| S4 | Control | full recipe, 2:30 | ~240 | ~1.17 | 0.99 | ~−0.18 | right / **won** (slight) | more placed acidity cool; "pretty close" |

### Analysis

- **Gradients:** monotonic both probes (1.81/1.37/0.65; 1.63/1.45/0.73). Day-to-day fraction drift small but real (bloom −0.18 TDS day 2), validating "recompute specs at the bench."
- **Offsets:** full-fraction builds −0.08 / −0.09 / −0.14; lived cups −0.16 / −0.18 / −0.21. Band holds for bench builds; lived single brews sit at or just past the lower edge (predictions came from prior-day fraction reads, the RP9-N3 softness). Sign anomaly at S1 (+0.03) is a remainder-proportion artifact, discounted.
- **Lengthened formula** solids ÷ (keeper mass + added water) predicted 0.91, measured 0.83 — inside band. Formula validated; the intent lost.
- **Cut-depth ladder:** bloom share of keepers 12.4% (full) → 8.3% (faithful) → 2.7% (trace). Full > faithful ≈ full > trace. The curve is flat-to-negative; there is no interior optimum.
- **Matched-TDS pairs:** 0.83 vs 0.83 (S2 lengthened vs P2+bloom) read as different cups → fraction composition is a lever independent of strength. 0.99 vs 0.99 (S4) read near-identical → a 4-point bloom down-weight is below the perceptual floor on this coffee.
- **Blind vs sighted:** the operator's sighted lean was for the curated cup at S4 and for "the bloom-added cup" at S3; both inverted blind. Two for two.

### Final output

**1. La Dinastia taxonomy entry (RP9 2-axis taxonomy)**

| Field | Value |
|---|---|
| Coffee | La Dinastia lemongrass yellow-honey Gesha (co-ferment, Moonwake) |
| Rewards selection? | **NO** |
| Convicted volatile fraction (probe) | **Bloom** — sour/punchy straight; carries the lemongrass infusion layer |
| Winning build | **Full cup** (ratio-true) — beat trace-bloom curated (S3) and faithful-bloom curated at matched TDS (S4), both blind |
| Lived recipe | the archived control, unchanged: 15/240, EG-1 6.3, 45 Dial 0 → 150 Dial 5 → 240 Dial 5 → Dial 6 dry bed, no flush, Apax 1+1 |
| Sealed predictions | Operator P2 ✗ · Assistant P2 ✗ |
| Infusion-layer locus | Bloom (taxonomy-grade; first observation of where a co-ferment layer lives in the extraction) |

**2. H-predict scorecard (project-level, n=3):** T2 Assistant lean falsified; T3 operator + Assistant both falsified. 0 clean ex-ante hits on the convicted fraction across the project. **The tax fraction is not callable from process/roast/archive at n=3.**

**3. The coffee-#4 workflow writeup (cups + scale only) — the project's shippable payload**

> **Fraction-curation workflow, v1 (RP9 close)**
>
> *Gear:* your normal brewer with a closable valve (or a swap-cup under an open brewer), 3 cups + 1 side cup, scale, kettle. Refractometer optional (the arithmetic is nice, not required).
>
> **Step 0 — Seal a guess.** Write down which fraction you think carries the tax, and why. Don't revise after tasting. (Expect to be wrong; three coffees in, nobody has called it.)
>
> **Step 1 — Probe (1 dose).** Brew your lived recipe, but close the valve + swap cups + re-tare at each pour boundary so bloom, pour 1, and pour 2 land in separate cups. Three cups only, no flush. Taste each straight, cool-weighted. Name the most *volatile* fraction (sour / astringent / bitter / thin) and the *keeper base*. Note what each fraction *carries* (aromatics, sweetness, body), not just what it taxes. Then pour the remainders together and taste against your memory of the full cup — if it's a different coffee, your fraction brew went wrong.
>
> **Step 2 — Decide the cut depth BEFORE deciding the shape.** The volatile fraction is only a tax if the cup is better without it. Test that first and cheaply: brew the lived recipe twice, once as-is, once with the volatile fraction diverted to the side cup and ~2/3 of it poured back. Blind pair, cool-weighted. **If the full cup wins or it's a coin-flip, stop: this coffee does not reward selection.** You just saved the menu sitting.
>
> **Step 3 — Only if the shallow cut won: build the menu (1 dose).** Fraction-brew again. Build 2-3 cups from the keepers, named after their contents: one at natural strength (concentrate-and-emphasize), one with hot water added to a pre-computed strength ~0.2 below natural (lengthen-and-smooth), optionally one with the volatile fraction at trace. Shuffle, taste warm-to-cool, pick a winner. Dose minerals on the assembled cup, never on fractions.
>
> **Step 4 — Translate and replicate (2 doses).** Turn the winning build into a single-brew recipe by *matching its proportions* (divert-and-pour-back for the bloom; stop-at-weight for a tail cut). Brew it beside the full cup, blind pair. The real cup wins or the workflow didn't earn its keep.
>
> *Rules that cost us:* blind everything, including re-cupping to kill volume tells; sighted leans inverted twice. Draw TDS vials before dosing. Translate the winner faithfully first — sharpen the cut on a second pass, never on the translation. Rinse before the first cup.

### Key findings

1. **La Dinastia does not reward selection.** Full cup beat the curated cup blind at two cut depths (S3 trace, S4 faithful at matched 0.99 TDS). Substrate: third taxonomy entry; first "NO" on the rewards-selection axis.
2. **The convicted fraction was the signature carrier.** Bloom = lemongrass locus (S1); deep cut removed the lemongrass and lost (S3); shallow cut was inert (S4). Substrate: the taxonomy's "tax fraction" axis needs a companion field, "what the fraction carries" — tax and signature can be the same fraction.
3. **Tax is not predictable at n=3.** Both sealed calls wrong; both anchored on archive tail language that turned out to describe the bloom at cup dilution. Substrate: the probe is a mandatory step, not a shortcut-able one; sealed-prediction primitive validated as a calibration instrument (it measured the gap honestly).
4. **Lengthening lost on a coffee predicted to want it.** H-curate falsified; water flattened sweetness, not the drying edge. Substrate: RP8's removal-vs-dilution question gets an inside answer — on this coffee, dilution and fraction-removal are separable levers (0.83/0.83 read differently) and dilution was the weaker one.
5. **The sitting-2 menu winner did not beat the full cup when translated.** A build that wins a 3-way bench menu among curated cups is not evidence against the full cup. Substrate: the workflow needs the full cup IN the menu or a cut-depth gate before the menu (writeup Step 2).
6. **Arithmetic is settled.** Monotonic gradient 2/2; bench-build offsets −0.08 to −0.14; lived-brew offsets −0.16 to −0.21 (prior-day predictions); lengthened formula verified. Substrate: P9-AI-1 band widens to −0.05 to −0.21 with a lived-vs-bench split; close as characterized, not as explained.
7. **Blind inversion twice.** Sighted leans at S3 and S4 both flipped blind. Substrate: RP9-N9 graduates with two more data points.
8. **Dosed water is part of this coffee's signature.** Undosed fractions and builds read "darker-tea-centric"; operator realized the Apax dose carries more sweetness/character than assumed. Substrate: office-lane charter note + RP6 water memory pointer.
9. **Kettle-on stance drift** on the archived control card (off-base wait written, kettle-on lived). Substrate: control row's temperature text is aspirational; fold session may annotate alongside P9-AI-5.

### Substrate edit specifications for compile session

DO NOT execute these edits in this session — the compile session integrates substrate.

1. **RP9 project end-document / taxonomy table** (path per Coordinator's project doc): add the La Dinastia entry verbatim from § Final output item 1; add a third column/field "fraction carries" (Finding 2). Mark the table complete at n=3 with one NO entry. Source: Findings 1-2.
2. **RP9 end-document — workflow writeup section:** paste § Final output item 3 as the end-document's centerpiece, titled "Fraction-curation workflow v1." Source: Findings 3, 5, 7.
3. **RP9 end-document — H-predict ledger:** record the project-level 0/3 scorecard (§ Final output item 2) and the standing read "probe mandatory." Source: Finding 3.
4. **freezer-stock doc, La Dinastia entry** (`docs/brewing/freezer-stock.md`): vial count 14 → 7; append brew note: "Full cup wins — does not reward fraction selection (RP9 T3, 2026-10-01). Bloom carries the lemongrass; don't cut it. Apax 1+1 is load-bearing for sweetness." Source: Findings 1, 2, 8.
5. **Control brew row `23b48be7`** (fold session, with P9-AI-5 producer fix via `patch_brew`): optionally annotate strategy_notes that the kettle stayed on-base (near-boil pours) as lived. Source: Finding 9. Coordinator's judgment whether it merits a row touch.
6. **P9-AI-1 evidence append** (RP9 ledger): offsets −0.08/−0.09/−0.14 (bench builds) and −0.16/−0.18/−0.21 (lived cups, prior-day predictions); S1 +0.03 discounted (remainders). Recommend closing as "characterized: −0.05 to −0.14 bench, to −0.21 lived." Source: Finding 6.
7. **Concentrated Pour-Over canon / RP8 removal-vs-dilution note** (Coordinator judgment): one line that RP9 T3 found dilution and fraction-removal separable at matched TDS and dilution the weaker lever on La Dinastia. Source: Finding 4.
8. **Grilling queue item 58** ("down-weight" vocabulary): evidence appended, not resolved — a down-weight below ~1/3 of the fraction was perceptually inert; above that it removed signature. Suggest the vocabulary distinguish "trace" (<5% of cup) from "down-weight" (1/3-2/3 of the fraction). Source: Findings 1-2.
9. **Office-lane charter** (`docs/skills/research-coordinator/cluster/office-lane.md`): add "dose the assembled cup, never the fractions; draw TDS vials before dosing" (friction 3 + sitting-3 strike). Source: Finding 8, lessons N12/N15.

### New lessons captured

Provisional numbering (continues RP9-N9; Coordinator reconciles).

| # | Lesson | Substrate implication |
|---|---|---|
| RP9-N10 | **Sealed predictions, Assistant first.** State the Assistant's tax call in the read-back message before collecting the operator's; both landed in one reply here, so H-predict had one independent data point, not two. | Spawn-prompt template section 9 / Step 0 item 3 ordering. |
| RP9-N11 | **Convict the fraction, then test the cut depth before the menu.** A fraction that is a tax straight may be the signature at cup dilution; a cheap shallow-cut blind pair against the full cup gates the menu sitting. | Workflow writeup Step 2; candidate cluster primitive. |
| RP9-N12 | **Dose the assembled cup, never the fractions; draw vials before dosing.** Cup-dosed minerals can't be split across fraction cups, and a post-dose vial produced a struck read. | Office-lane charter line. |
| RP9-N13 | **Translate the winning build proportion-faithfully first.** Sharpening toward operator intent at translation time skipped the build that won; the sharpened cut lost on the removed signature. | Workflow writeup Step 4. |
| RP9-N14 | **The full cup belongs in (or gates) the curation menu.** A menu of curated-only builds can crown a winner that the full cup still beats. | Workflow writeup Steps 2-3. |
| RP9-N15 | **Fraction-brew time is not comparable to single-brew time**; clock only the lived pair, and ask for the timer before the first sip. | Recording-sheet note. |
| RP9-N16 | **Small-cup menus compress the temperature ladder**; on a cool-weighted coffee that's fine, on a hot-weighted one assemble the biggest build last. | Office-lane bench note. |

### Audit items queued

| # | Item | Status | Implication |
|---|---|---|---|
| P9-AI-1 | Measured-vs-predicted offset cause | **refined** — characterized as −0.05 to −0.14 bench / to −0.21 lived (prior-day predictions); recommend close-as-characterized | ledger edit spec 6 |
| P9-AI-2 | Sample-temperature reads | open; no new evidence (all reads batched at room temp) | none |
| P9-AI-5 | Control row `23b48be7` producer = "Wilton Benitez" (should be Wilder Lazo) | **queued for fold** (`patch_brew`); optionally pair with kettle-on annotation | edit spec 5 |
| P9-AI-6 (new) | Taxonomy needs a "fraction carries" field alongside "tax fraction" | open → end-document | edit spec 1 |
| P9-AI-7 (new) | Co-ferment infusion layer localizes in the bloom (n=1 coffee) — does this generalize to other infused/co-ferment lots? | open; opportunistic on any future co-ferment fraction brew | taxonomy note |

### Open data items

- The sitting-1 recombination (+0.03, remainders) is the only build with the wrong-sign offset; not re-run, discounted. Re-run only if P9-AI-1 is reopened.
- Sitting-2 2nd/3rd place between the lengthened build and P2 + bloom was never head-to-headed; irrelevant to the verdict.
- Control TDS now has exactly one clean read (S4, 0.99); S3's was struck. Acceptable for a doc-only trial record.

### Recap map for compile session

Integrate first: edit specs 1-3 (end-document taxonomy entry + workflow writeup + H-predict ledger) — the project closes on them. Then spec 4 (freezer-stock) and 6 (P9-AI-1 close-as-characterized). Fold session handles spec 5 with P9-AI-5. Defer 7-8 to Coordinator judgment at the project retro. Escalate to the operator at retro: (a) whether RP9-N11 / N14 (cut-depth gate, full cup in the menu) graduate to cluster primitives or stay in the writeup; (b) whether the project's end-document frames the workflow as "validated classifier, unvalidated improver" (Assistant's read) or something sharper; (c) P9-AI-7 — worth a deliberate co-ferment probe on coffee #4, or opportunistic only.

### Protocol-execution friction captured

1. Sealed predictions arrived in one reply → independence lost (N10).
2. Transcription-verify caught the kettle-on stance drift on a day-old converged card; the primitive earns its keep even on "recorded as-lived" rows.
3. Apax cup-dose can't be fractionated; sitting-1 fractions and sitting-2 builds ran undosed vs a dosed control (N12).
4. Fractions-before-recombination order swap: acceptable with a same-day control, costs the recombination's arithmetic cleanliness.
5. Fraction-brew total time non-comparable; not clocked (N15).
6. Small-cup assembly cooled the menu before the first sip (N16).
7. Operator sipped before rinsing at sitting 2; re-sip read sweeter.
8. Sitting-3 control vial drawn post-dose → read struck; the brief's TDS instruction said "draw vials, then dose" but the order wasn't enforced at the bench (N12).
9. Assistant's trace-translation recommendation deviated from the winning proportion and cost a sitting; corrected with an operator-authorized 2-vial extension (N13).
10. Sighted first pass at sitting 4 before the blind shuffle — operator self-corrected mid-sitting and re-set blind; the blind read inverted the sighted lean.

---

### Execution Session Termination

Per Lesson #40 role-discipline rule:
- ❌ NO substrate edits (registry / cluster docs / ADR / MCP)
- ❌ NO merge to main, NO substrate PR
- ❌ NO `npx tsc --noEmit` runs
- ✅ Protocol doc updated in-place as canonical archive (authorized per "doc IS the archive" framing)
- ✅ Archive doc committed + pushed to branch `claude/output-fractionalization-curation-8d67ff` @ `a460130e` (the authorized archive-persist exception — see [`role-discipline.md` § Archive persistence](docs/skills/research-coordinator/cluster/role-discipline.md))
- ✅ Handoff brief produced above; branch + SHA in the `Archive location:` header for the compile session
- 🛑 Session terminating after this brief lands. The compile session integrates substrate per the design pattern.

End of RP9 Track 3 close-out.
---

## Notes / friction / lessons / audit items (Assistant: append inline during execution)

1. **Friction — sealed-prediction ordering.** Both predictions landed in one operator reply, so the Assistant's was written with the operator's visible. Protocol fix for the primitive writeup: the Assistant pre-states its tax call in the read-back message (before Step 0 answers come back), then collects the operator's. Cheap, and it makes H-predict two independent data points instead of one.
2. **Transcription-verify caught an as-lived stance drift** (kettle on-base the whole brew vs the "off-base wait" on the card). Not a pour drift, but a temperature one; RP8-N17 earned its keep even on a day-old converged recipe.
3. **Friction — cup-dosed water can't be fractionated.** Apax JAMM+TONIK is dosed per finished cup, so a fraction brew that follows the control recipe drops the mineral dose the control had. Sitting 1 straight fractions ran undosed; every build from sitting 2 on gets the standard dose post-assembly. Workflow-writeup rule: **dose the assembled cup, never the fractions.**
4. **Order swap accepted (fractions before recombination).** Cost: the recombination was made from remainders, so its TDS lost its arithmetic cleanliness (+0.03 vs predicted, sign opposite the standing offset). When the control was brewed the same day, this is an acceptable trade; when it was not, keep the card order.
5. **Fraction-brew time is not comparable to the single brew** (valve-close + cup-swap + tare at each boundary adds untimed seconds). Log fraction-brew time as approximate only; the lived-pair brew at sitting 3 is where total time matters.
6. **Small-cup assembly time compresses the temperature ladder.** Three 40-70 g builds assembled serially had cooled before the first sip; reads were effectively warm-to-cool only (as T2 friction 4 predicted). Acceptable on a cool-weighted coffee; on a hot-weighted one, assemble the biggest build last.
7. **Palate reset.** Operator sipped the first cup before rinsing (had just arrived at the office); the re-sip after rinsing read sweeter. Rinse before the first cup of any blind read.
8. **"Tax" convicted on a straight fraction is not the same as "tax" at cup dilution.** The bloom read as sour/punchy at 1.8 TDS straight and as the complexity layer at ~2-3% of a 0.7-1.1 cup. The probe finds the most VOLATILE fraction; whether it is a tax or a signature depends on its share of the final cup. Workflow-writeup rule: convict the fraction, then test the CUT DEPTH (down-weight by a third before cutting to trace).
9. **Translate the winning build proportion-faithfully first.** Deviating toward the operator's stated intent at translation time (trace) skipped the build that actually won sitting 2. The lived pair should replicate the winner's proportions; sharpening the cut is a second iteration, not the translation.
10. **Control total time was not clocked** despite the request; the 0.70 read has no brew-time corroboration. Ask for the timer BEFORE the first sip next time, not after.
11. **Sighted-before-blind at sitting 4.** Operator tasted A/B sighted, then self-corrected to a blind shuffle; the blind read inverted the sighted lean. Set the blind pair up before the first sip, every time.
