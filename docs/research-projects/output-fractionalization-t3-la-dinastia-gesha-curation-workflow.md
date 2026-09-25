# Output Fractionalization — Track 3: La Dinastia Lemongrass Honey Gesha, the curation-workflow validation

*Research Project #9 (RP9) — Output Selection / Fractionalization · OFFICE LANE*
**Status:** ACTIVE — operator sign-off 2026-09-24 at spawn (session branch `claude/output-fractionalization-curation-8d67ff`)
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

---

## Notes / friction / lessons / audit items (Assistant: append inline during execution)

1. **Friction — sealed-prediction ordering.** Both predictions landed in one operator reply, so the Assistant's was written with the operator's visible. Protocol fix for the primitive writeup: the Assistant pre-states its tax call in the read-back message (before Step 0 answers come back), then collects the operator's. Cheap, and it makes H-predict two independent data points instead of one.
2. **Transcription-verify caught an as-lived stance drift** (kettle on-base the whole brew vs the "off-base wait" on the card). Not a pour drift, but a temperature one; RP8-N17 earned its keep even on a day-old converged recipe.
3. **Friction — cup-dosed water can't be fractionated.** Apax JAMM+TONIK is dosed per finished cup, so a fraction brew that follows the control recipe drops the mineral dose the control had. Sitting 1 straight fractions ran undosed; every build from sitting 2 on gets the standard dose post-assembly. Workflow-writeup rule: **dose the assembled cup, never the fractions.**
4. **Order swap accepted (fractions before recombination).** Cost: the recombination was made from remainders, so its TDS lost its arithmetic cleanliness (+0.03 vs predicted, sign opposite the standing offset). When the control was brewed the same day, this is an acceptable trade; when it was not, keep the card order.
5. **Fraction-brew time is not comparable to the single brew** (valve-close + cup-swap + tare at each boundary adds untimed seconds). Log fraction-brew time as approximate only; the lived-pair brew at sitting 3 is where total time matters.
6. **Small-cup assembly time compresses the temperature ladder.** Three 40-70 g builds assembled serially had cooled before the first sip; reads were effectively warm-to-cool only (as T2 friction 4 predicted). Acceptable on a cool-weighted coffee; on a hot-weighted one, assemble the biggest build last.
7. **Palate reset.** Operator sipped the first cup before rinsing (had just arrived at the office); the re-sip after rinsing read sweeter. Rinse before the first cup of any blind read.
