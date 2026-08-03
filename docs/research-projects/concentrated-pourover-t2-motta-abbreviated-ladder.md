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
