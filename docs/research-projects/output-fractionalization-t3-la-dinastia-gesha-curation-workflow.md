# Output Fractionalization — Track 3: La Dinastia Lemongrass Honey Gesha, the curation-workflow validation

*Research Project #9 (RP9) — Output Selection / Fractionalization · OFFICE LANE*
**Status:** DRAFT — pending operator audio sign-off at scoping
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

## Notes / friction / lessons / audit items (Assistant: append inline during execution)

*(empty at authoring)*
