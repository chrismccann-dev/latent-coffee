# Concentrated Pour-Over — Track 4: Chombi Post-Brew Mineral Drops at Concentration (Research Project #8, Office Lane)

*Coffee Research · Latent · Research Project*

**Version:** 1.0 (scoped)
**Date drafted:** 2026-08-18
**Status:** SCOPED — coffee locked by operator (Picolot Chombi); design consumes the Track-3 handoff brief + P8-AI-6
**Location:** Office (Downtown Palo Alto)
**Coordinator session:** RP8 Coordinator (persistent)
**Prior tracks:** [T1 El Oasis](docs/research-projects/concentrated-pourover-t1-full-ladder.md) · [T2 Motta](docs/research-projects/concentrated-pourover-t2-motta-abbreviated-ladder.md) · [T3 Loud Giants valve](docs/research-projects/concentrated-pourover-t3-loud-giants-valve.md) (all CLOSED)

---

## ⚠️ LOAD-BEARING ROLE-DISCIPLINE RULE — READ THIS FIRST

You (the session executing this protocol) are the **Research Assistant** for this track. Your job is **execution + handoff brief production.** Your job is **NOT substrate integration.**

**DO NOT:**
- Edit `lib/*-registry.ts` files
- Edit `docs/skills/*/cluster/*.md` files (incl. water.md / water-inventory.md — any drops findings are specified for the compile session, not applied)
- Edit ADR files
- `git commit` / `git push` SUBSTRATE edits, merge to main, or `gh pr create` (the archive-persist commit of THIS doc is the ONE authorized exception)
- Run `npx tsc --noEmit` against substrate edits (you won't be making any)
- Call `push_brew` — brew-row archival is explicitly DEFERRED for this project
- Continue past the handoff brief to "finish the job"

**DO:**
- Read this doc in full BEFORE Step 0
- Walk the operator through Step 0 sub-steps to completion before any scored brew
- Run scored cups one-at-a-time (tool-call-per-cup pacing; serial cadence)
- Re-present the scoring rubric inside EVERY scored cup's tool call
- Capture friction + new lessons + audit items inline in this doc
- Produce a handoff brief per `docs/skills/research-coordinator/cluster/templates/handoff-brief-template.md`
- Commit + push THIS doc to your session branch at termination; report branch + SHA in the brief's `Archive location:` header
- TERMINATE the session after the handoff brief

Full primitive doc: `docs/skills/research-coordinator/cluster/role-discipline.md`

---

## Project Context

Track 4 of **Research Project #8 — Concentrated Pour-Over / High-Strength Filter** (office lane; WBC routine-differentiation bet). State entering this track: 1:10 is the style's optimum on three coffees; the boundary sits at 1:9; reproduction met (T2); **valve-driven contact is the style's best current form** (T3 — zero grind spent, tannin tax confirmed grind-driven, P8-AI-4 closed); the low-pressure AeroPress branch is unlocked and now sequenced as **T5**.

**Why water-drops before AeroPress (operator call, 2026-08-18):** the AeroPress is a learning curve at the office (new hardware + new physics + new methodology at once); post-brew drops are one lever on top of a reproduced recipe. This track is **P8-AI-6** — water manipulation tolerance at concentration — scoped deliberately narrow.

**What this track is and is NOT.** It is **serving-side finished-cup mineral dosing** — the operator's existing locked office practice (1 TONIK + 1 JAMM per ~200 mL cup, dosed at the cool peak) applied to a 1:10 no-bypass concentrate, plus a texture-targeted candidate (Konflux). It is **NOT** a revival of pre-brew water composition research: RP6's parked space (multi-salt combination recipes) stays parked; brew water is plain PA tap whole-track; nothing goes in the kettle. Sulfate-bearing LYLAC is excluded — RP6's sulfate finding is not being re-opened here.

**The interesting prior:** in RP6 Track 1, **Konflux was the lone unwelcome inject on the Pink Bourbon** at normal strength (its CaCl₂ / KCl / NaCl / silica / bicarbonate texture-body payload read as an intrusion on a Clarity-First cup). Operator hypothesis: at ~1.5× concentration, with a dense syrupy body already present, the same payload lands as texture-completion instead. RP6's read is the prior; RP8's concentration is the changed condition.

**Why Chombi:** SWORKS Suppression control (Dial 0 bloom → Dial 6 mains) — the valve-driven concentrate transfers directly (Dial 6 → Dial 5 is the natural "one step more restricted" concentrate move, T3's winning shape). Its dial-in cup doubles as **P8-AI-5's second-coffee valve read**. Loud Giants (T3's reproduced recipe) is unavailable — no vials, not re-buyable.

Vocabulary stays grilling item 56's. **No push_brew.** RP6's ratified rule — *ordering claims need blind coding* (descriptor→salt attribution went 1-for-3 for the trained operator) — is honored via the split-cup design below.

## Inherited (operative)

| # | Source | What it changes here |
|---|---|---|
| RP6 ratified | Blind coding for ordering claims; single reads are anecdotes | **Split-cup blind pairs** — same brew, coded halves, forced pre-reveal pick. Cross-cup ordering (winner-carries-forward) is serial + anecdote-tagged. |
| RP6 modifier finding (P6T4-N4) | Modifier effects are coffee-specific, not salt-intrinsic | Every read is Chombi-specific until a second concentrate coffee confirms. |
| Office-water memory (locked 2026-07-16) | 1 TONIK + 1 JAMM per ~200 mL at the cool peak; sensitivity window 1.0–1.5 drops on delicate cups; sub-1 needs half-strength working dilutions | **Dose-scale caution (§ Design)**; TONIK+JAMM is the reference-dose arm; sub-1 path = dilution, not this ladder. |
| RP6 dosing key | APAX 1 drop ≈ 0.065 g ≈ 2 ppm/L (per 200 mL cup basis) | Per-half math in § Design. |
| T3 winner + RP8-N9 | Closed bloom → Dial 5 → late open; pin the free lever's TIME | Base-recipe schedule; late-open time is recorded as a number on the dial-in cup and held constant thereafter. |
| RP8-N10 | Re-baseline comparator from a fresh control | **Consciously waived** — the comparator here is the undosed half of the SAME cup, which is a stronger control than any re-brew. Rung-0 control re-brew skipped for budget (4 vials). |
| RP8-N1 / N3 / N7 / T2 friction 2 | Weigh vials · office capture trims pre-declared · tag missed reads · first sip first | Standing. |
| T2 friction 3 | Water temptation recurs | This track IS the sanctioned outlet; anything beyond the ladder (LYLAC, kettle-side, DAK) gets parked, not brewed. |

## Track-4 coffee (LOCKED 2026-08-18)

| Field | Value |
|---|---|
| Coffee | **Picolot #20 Comp Edition — Altieri Gesha CHOMBI Natural Dry Fermentation** (Alto Quiel, Panama; NASD) |
| Archived control brew ID | `4fc7e914-095d-4d1e-9af6-3a6c7c556c9b` |
| Control recipe | SWORKS Bottomless + xBloom paper · 15 g / 240 g (1:16) · **EG-1 6.5** · **92°C**, kettle on base · Suppression · Dial 0 bloom 45 g (8 s pour, 20 s hold) → crack to **Dial 6** · P1 0:50 → 140 g (15 s slow center spiral) · P2 1:35 → 240 g (18 s) · 3:00–3:30 |
| Control profile | Stonefruit / blood orange / cherry / black tea · silky, juicy · peak 45–50°C; body heavier + silkier on cooling (transformation mode) |
| Vials | **4 × 15 g** (weigh at Step 0) |
| Brew water | Plain PA tap, zero additions, kettle-side, whole track |
| Drops on-site | APAX TONIK · JAMM · KONFLUX (LYLAC excluded; DAK excluded — kettle-only product) |

**Coffee-specific cautions:** the archive says this lot's tart/sour dimension is *varietally-correct blood orange, not under-extraction* — do not read the front as a concentration failure without checking whether it's the coffee. Cooling mode is transformation (tea → cherry body), so the drop read at the cool peak matters more than warm.

## Hypotheses (pre-state before scoring)

- **H-K (Konflux at concentration):** on the 1:10 concentrate, 1 drop Konflux per half reads as texture/body/sweetness *completion*, not the inject it was on normal-strength PB (RP6). *Blind split-cup pick prefers dosed at ≥ rung 1.*
- **H-dose (window):** the preferred Konflux dose per half is 1 drop; 2 drops per half crosses into inject/salinity. *Boundary rung.*
- **H-ref (locked recipe survives):** the standing office dose (1 TONIK + 1 JAMM) on the concentrate reads as an improvement or neutral, not a degradation. *If it degrades, the office recipe is ratio-conditional — a real finding for the office-water memory.*
- **H-valve-2 (P8-AI-5):** the T3 valve schedule shape (closed bloom → Dial 5 → late open) yields a coherent 1:10 concentrate on a second coffee at the control's own grind + temp (6.5 / 92°C). *Answered by the dial-in cup.*
- **H5:** 92°C + grind 6.5 unchanged all cups.

## Step 0 (run to completion BEFORE any scored cup)

1. **Weigh all 4 vials** (RP8-N1). Stop + re-plan if any is partial.
2. **Pull control brew `4fc7e914`** via MCP; confirm the transcribed recipe above (row-pull mandatory).
3. **Equipment:** SWORKS + xBloom paper + EG-1 + Stagg EKG Pro on-site; **two identical small cups for the split** (same material/mass — cup difference is a confound); a way to code them (operator codes; Assistant records identities at reveal only — RP6 convention).
4. **Drops on-site + dropper check:** TONIK, JAMM, KONFLUX present; confirm stock droppers deliver a consistent drop (5-drop tare on the scale ≈ 0.3 g per RP6 key — record it).
5. **VST LAB III:** distilled blank, zero, **record the blank number**; single read per whole cup pre-split (TDS is a brew descriptor here, not a per-half read).
6. **Water:** plain PA tap at the kettle confirmed; drops go in the CUP only.
7. **Split protocol locked:** brew → swirl to homogenize → pour equal halves by weight into the two cups (record grams) → operator codes → dose the treatment half → let both reach the cool peak (~45–50°C, this coffee's window) → **first sip on both** → forced pre-reveal pick + per-axis prose → reveal.

## Design — 4 vials, dial-in + three-round tournament

**Base recipe (all cups):** 1:10 · 15 g / 150 g · EG-1 6.5 · 92°C · plain tap · SWORKS: Dial 0 bloom 45 g (hold ~20–40 s, operator's call, RECORD IT) → **Dial 5** mains (~100 g ~0:45; early final to 150 g ~1:10–1:15; restrained pours per the control's low-agitation ceiling) → late open Dial 7 at a **pinned time** chosen on the dial-in cup and held constant thereafter (RP8-N9).

| Cup | Vial | What | Split? | Purpose |
|---|---|---|---|---|
| D | 1 | **Dial-in:** base recipe, whole cup | No | Is the concentrate coherent at 6.5 / 92°C with valve-supplied contact? (H-valve-2 / P8-AI-5). Sets the pinned late-open time. TDS recorded. If it FAILS: cup 2 becomes the corrected base (schedule/pour only — no grind, no temp) and the tournament shrinks to two rounds. |
| R1 | 2 | Base recipe, split | **Control half vs 1 drop KONFLUX** | H-K |
| R2 | 3 | Base recipe, split | **R1 winner vs 2 drops KONFLUX** (if R1's winner was control, R2 = control vs 2 drops — the boundary still gets mapped) | H-dose |
| R3 | 4 | Base recipe, split | **R2 winner vs 1 TONIK + 1 JAMM** (the locked office recipe) | H-ref; also the head-to-head between texture-targeted and the standing dose |

**Operator-designed alternate for R3 (pre-authorized):** if after R2 the operator would rather test a Konflux + JAMM combo than the reference arm, that's allowed — log the rationale before dosing; H-ref then stays open.

**Dose-scale caution (READ before R1):** a 150 g brew yields ~125–130 mL → **~65 mL per half**. 1 drop into 65 mL ≈ **3× the per-mL intensity** of the locked office dose (1 drop / 200 mL); per gram of coffee solids it's ≈ 2× (the concentrate is ~1.5× stronger). "1 drop per half" is therefore the *aggressive* end of the RP6 sensitivity window, not the middle — it is rung 1 only because the stock dropper cannot go smaller. If rung 1 already over-reads, the sub-1 path is the operator's planned **half-strength working dilution** (office-water memory), not a finer ladder here — log it as the follow-up. 2 drops per half is a boundary probe.

**Cadence:** serial, ≤3 cups/office day, one tool call per cup; the split-cup pair is blind; cross-cup ordering is unblinded-serial and anecdote-tagged. Actual brew date recorded per cup. Winner-carries-forward means the finalist's standing is relative to progressively different comparators — record it that way, don't collapse it into a single ranking.

**No repeat vial.** Split-cup pairs are their own within-cup control; the track's claims are directional-per-condition, and the handoff brief tags every ordering as single-read.

## Scoring — per-cup record (rubric re-presented in EVERY cup's tool call)

1. **Build:** ratio / grind 6.5 confirm / 92°C confirm / valve schedule as executed (bloom hold s, late-open TIME) / pour count + rough timing / drawdown end / date.
2. **TDS** (whole cup, pre-split) + ×control (use the archived control's profile as the reference; note there is no fresh control TDS — the comparator is in-cup).
3. **Split:** grams per half · operator codes · which half dosed · dose (product + drops) · temperature at first sip (by feel, this coffee's cool window).
4. **Blind pair read (BEFORE reveal):** per half — aroma / attack / mid / body+texture / finish; **explicit texture, sweetness, salinity/savory-inject, and clarity lines**; forced pick + one-line reason. Then reveal; post-reveal notes flagged as post-reveal.
5. **Flags:** savory/salty inject · clarity loss · body/texture gain · sweetness lift · anything that reads as "the RP6 PB inject" reappearing.
6. Friction / lessons / audit items inline; tag missed reads (RP8-N7).

## Exit conditions (track close)

1. Cup D + three rounds executed (or the shrunk path documented).
2. H-K / H-dose / H-ref / H-valve-2 / H5 each resolved with the blind pick as evidence, anecdote-tagged where single-read.
3. **P8-AI-5 verdict** (valve-driven concentration on a second coffee): coherent / not, with the dial-in record.
4. **P8-AI-6 verdict** (drops at concentration): which condition won overall (relative, tournament-shaped), and whether the locked office dose is ratio-conditional.
5. Handoff brief per template, incl.: substrate specs for the compile session (candidate: office-water memory / water-inventory § notes get a "at 1:10 concentration" line — Coordinator decides fold vs defer), T5 (AeroPress) guidance, and any RP8-N candidates.
6. This doc committed + pushed; branch + SHA in the brief header.

## What this track does NOT do

No kettle-side water (plain tap locked) · no LYLAC (sulfate) · no DAK (kettle-only product) · no grind or temp moves · no push_brew · no vocabulary locking · no substrate edits · no AeroPress (T5).

## Known confounders & limitations

- Split halves are equal by weight but the second-poured half may carry more fines/sediment — swirl before splitting; note if visible.
- The dosed half is dosed at the cool peak while the control half sits — temperature parity at first sip is by feel; keep the gap short.
- Dose scale differs from the locked office practice (see caution) — H-ref's "survives" verdict is at ~3× per-mL of the practiced dose; a "degrades" verdict does NOT condemn the practiced dose at normal cup size.
- Single coffee; single reads per condition; tournament ordering is path-dependent.

## Notes / friction / lessons / audit items (Assistant fills inline)

**Pre-Step-0 clarifications (2026-08-18, operator):**
- **Dose timing:** treatment half is dosed at pour time (when the halves are poured into the cups), NOT at the cool peak - operator call for mixing + temperature parity. Deliberate deviation from the office-locked "dose at cool peak" practice; H-ref is therefore tested at hot-dose timing. First sip on both halves still at the cool peak (~45-50°C).
- **Late-open time (Cup D):** operator opens to Dial 7 as the brew is nearly complete; exact time recorded on the day and pinned thereafter (RP8-N9).
- **Cadence:** all 4 cups planned together starting 2026-08-19 (≤3/office day still applies - date recorded per cup).
- **Shrunk-path rule if Cup D fails:** keep R1 (H-K) + R3 (H-ref), drop R2 (H-dose).

---

## SESSION RECORD

*(Assistant appends per-cup records + handoff brief here at execution)*

### Step 0 record (2026-08-21, recalled)
- Vials: pre-dosed 15.0 g × 4 at freezing; NOT re-weighed on site (operator practice; RP8-N7 tag).
- Control brew `4fc7e914` pulled via get_brew; transcribed recipe confirmed exact.
- Equipment / two identical split cups / coding method / dropper 5-drop tare / VST blank number / tap confirm: PENDING at Cup D brew time - required before R1 (logged as friction: Cup D brewed ahead of Step 0 items 3-6).

### Cup D - dial-in (vial 1) - 2026-08-21 (operator-recalled date, not logged live - RP8-N7)
- Build: 15 g / 150 g (1:10) · EG-1 6.5 · 92°C · plain tap · Dial 0 bloom 45 g, **hold 40 s** → Dial 5 mains (P1/P2 times + grams NOT reported - RP8-N7 tag) → **late open Dial 7 at 1:40 (PINNED)** · drawdown end ~2:00.
- TDS: **1.49%** (whole cup). No fresh 1:16 control TDS (pre-declared).
- Aroma: fruit, sweet, slightly candied.
- Hot: "almost like fruit juice" - very bright up front, lighter on the end, a little tannin on the tail.
- Warm: fruit-bright, sweet, fruit-juice; operator feels 40 s bloom may be a touch long - very acidity-front-focused, "good but maybe a tad too much".
- Cool: tamped down a bit; cherry, blood orange, sweet; a little textural quality from the concentration; no bitterness/tannin. Still very front-forward / fruit-juice. Operator note: could have held Dial 5 throughout instead of opening to 7.
- Label notes matched: sweet cherry + orange clearly present.
- **Verdict: COHERENT concentrate → H-valve-2 / P8-AI-5 = valve-driven concentration holds on a second coffee at its own grind + temp. Full 3-round tournament proceeds.**
- Parked follow-ups (not brewed this track): shorter bloom hold (20-30 s) · Dial 5 throughout / no late open.

### Step 0 completion (2026-08-21, before R1)
- Dropper 5-drop tare: SKIPPED - office scale not accurate enough at small weights (RP8-N7 missed-read tag). RP6 key (~0.065 g/drop) assumed. Optional home tare = non-blocking follow-up.
- VST blank: 0.00 (recorded). Split cups: two identical, operator codes written on bottom. Kettle: plain PA tap confirmed.
- Bloom hold stays pinned at 40 s (operator declined a change).

### R1 (vial 2) - control vs 1 drop KONFLUX - 2026-08-21 (recalled)
- Build: pinned base (1:10 · 6.5 · 92°C · Dial 0 bloom 40 s → Dial 5 → open Dial 7 at 1:40). P1/P2 clock+grams again not reported (RP8-N7 tag).
- TDS: **1.60%** (whole cup, pre-split).
- Liquid yield: **105 g total** out of 150 g in → ~52 g per half. NOTE: 1 drop / ~52 mL ≈ **~4× office per-mL intensity** (caution estimated 65 mL / 3×).
- Split: equal halves post-swirl; operator codes A = control, B = 1 drop Konflux (dosed at pour time per pre-declared deviation). Assistant blind to mapping until reveal.
- Blind read (pre-reveal): LEFT - aroma fruit/pungent/sweet; silky character, added creaminess/texture, fruit-forward but balanced. RIGHT - much more acidic-forward, "fruit juice concentrate", no texture. Head-to-head: left has balance + creaminess + silk the right lacks; right "way too acidic juice forward."
- **Forced pick (pre-reveal): LEFT** - reason: texture + overall balance.
- Reveal: left = B (**1 drop Konflux**), right = A (control). **Dosed half WON.**
- Flags: body/texture gain YES · sweetness/balance lift YES · salinity/savory inject NONE · clarity loss NONE reported.
- **H-K: SUPPORTED (single blind read)** - Konflux reads as texture-completion at concentration, inverting the RP6 PB inject read.

### R2 (vial 3) - 1 drop vs 2 drops KONFLUX - 2026-08-21 (recalled)
- Build: pinned base (40 s bloom → Dial 5 → Dial 7 at 1:40). P1/P2 clock+grams not reported (RP8-N7 tag).
- TDS: **1.56%**. Liquid yield: **125 g** (~62 g/half). Per-half grams not individually recorded.
- Codes: A = 1 drop Konflux, B = 2 drops (both dosed at pour time). Assistant blind until reveal.
- Blind read (pre-reveal): LEFT - fruit, syrupy, "much more syrupy"; aroma a bit less fruity; hard to separate. RIGHT - aroma floral/sweet; "really nice orange/citrus note, almost like orange jam." Head-to-head: both pretty close; right has a bit more jamminess.
- **Forced pick (pre-reveal): RIGHT** - reason: jamminess. Explicitly a close call.
- Reveal: left = A (1 drop), right = B (**2 drops**). **2-drop half won, narrowly.**
- Flags: NO salinity/savory inject on 2 drops · NO clarity loss · sweetness/jam lift YES.
- **H-dose: REFUTED in direction (single blind read, close-call)** - 2 drops/half did not cross into inject; boundary sits ABOVE 2 drops on Chombi at concentration (~4-5× office per-mL intensity). Preferred dose unresolved between 1 and 2 (close), 2 carries forward.

### R3 (vial 4) - 2 drops KONFLUX vs 1 TONIK + 1 JAMM (locked office recipe) - 2026-08-24
- Reference arm run as planned (alternate not invoked).
- Build: pinned base (40 s bloom → Dial 5 → Dial 7 at 1:40). P1/P2 clock+grams not reported (RP8-N7).
- TDS: MISSED - meter not on site (RP8-N7 tag). Operator instruction: treat as similar to prior cups (~1.5-1.6%) since identical recipe; NOT imputed as a reading. Liquid yield not recorded.
- Codes: A = 2 drops Konflux, B = 1 TONIK + 1 JAMM (both at pour time). Assistant blind until reveal.
- Blind read (pre-reveal): LEFT - aroma less pleasant; flavor "a little off / off balance," "a little more flat." RIGHT - aroma sweeter; sweeter, jammier, better texture, "everything about the right cup feels better."
- **Forced pick (pre-reveal): RIGHT - "no question," greatly preferred.**
- Reveal: left = A (2 Konflux), right = B (**TONIK+JAMM**). **Reference arm WON decisively.** Operator: "the opposite of what I thought it would be."
- Flags: no salinity/savory inject on either; Konflux-2 read as flat/off-balance this cup (vs "orange jam" in R2 - cross-cup inconsistency of the same nominal condition; single-read noise, softens R2's boundary read).
- **H-ref: SUPPORTED (single blind read, decisive)** - locked office dose survives AND wins at ~4× per-mL practiced intensity; NOT ratio-conditional on Chombi.
- Tournament chain (each a single blind read): 1K > control → 2K > 1K (close) → **T+J > 2K (decisive)**.

---

## HANDOFF BRIEF FOR COMPILE SESSION (RP8 Track 4 Close-Out)

**Date:** 2026-08-24
**Session role:** execution + handoff brief production (no substrate edits)
**Archive location:** branch `claude/pour-over-track-4-research-a2c5bb` @ `bbdeba7201f35750e351f8a21f5201bef1858b8e (brief-append commit; SHA back-filled in follow-up commit)`, pushed to origin (archive doc only; substrate NOT edited; not merged to main). See role-discipline.md § Archive persistence.
**Methodology verdict:** ✅ VALIDATES — split-cup blind pairs delivered clean forced picks on all 3 rounds with zero extra brewing; two hypotheses landed as predicted, one refuted in direction, one produced the track's headline surprise.

This brief is self-contained: the Coordinator can update the RP8 end-doc + roadmap from it, and the compile session can apply § Substrate edit specifications without reading the session conversation. Raw per-cup records live in § SESSION RECORD above.

### TL;DR

- **P8-AI-5 CLOSED: valve-driven concentration generalizes to a second coffee.** T3's schedule shape (Dial 0 bloom → Dial 5 → late open) at Chombi's own grind/temp (6.5 / 92°C) produced a coherent 1:10 concentrate first try — full label profile, no tannin tax, TDS 1.49-1.60%.
- **P8-AI-6 headline: the locked office dose (1 TONIK + 1 JAMM) WON the tournament decisively** — at ~4× its practiced per-mL intensity. It is NOT ratio-conditional on this coffee; it beat the texture-targeted Konflux finalist "no question."
- **H-K confirmed (single blind read): Konflux inverts at concentration** — 1 drop beat the undosed control on texture/balance, the opposite of its RP6 Pink Bourbon inject read.
- **H-dose refuted in direction:** 2 drops Konflux did not cross into salinity/inject; it narrowly beat 1 drop (R2), though the same condition read "off/flat" in R3 — dose boundary unresolved, tolerance is high.
- All orderings are single blind reads, Chombi-specific (P6T4-N4), tournament-path-dependent; dose timing was pour-time (deliberate deviation from cool-peak practice).

### Execution summary

4 cups executed as designed (dial-in + 3 tournament rounds), no shrunk path. Cups D/R1/R2 on 2026-08-21 (operator-recalled date), R3 on 2026-08-24. Blind protocol held on all 3 rounds: operator coded halves, forced pre-reveal pick every round, Assistant recorded identities at reveal only. Deviations: dose timing moved to pour-time (pre-Step-0 operator call, logged); vials not re-weighed (pre-dosed 15.0 g at freezing); dropper tare skipped (office scale resolution); R3 TDS missed (meter off-site); P1/P2 clock+grams unreported all cups; Cup D brewed before Step 0 items 3-6 completed (back-filled before R1).

### Equipment / conditions

| Item | Value |
|---|---|
| Coffee | Picolot #20 Comp Edition — Altieri Gesha CHOMBI NASD (4 × 15 g vials, pre-dosed at freezing) |
| Base recipe (all cups) | 1:10 · 15 g / 150 g · EG-1 6.5 · 92°C · plain PA tap · SWORKS Bottomless + xBloom paper · Dial 0 bloom 45 g **hold 40 s** → Dial 5 mains → **open Dial 7 at 1:40 (pinned)** · kettle on base |
| Drops | APAX KONFLUX · TONIK · JAMM, dosed in-cup at pour time (deviation: practiced timing is cool peak) |
| VST | blank 0.00; single whole-cup read pre-split |
| Split | swirl → equal halves into two identical coded cups; first sip both at cool peak (~45-50°C) |

### Per-cup raw data

| Cup | Date | TDS | Yield | Pair | Blind pick | Reveal |
|---|---|---|---|---|---|---|
| D | 08-21 | 1.49% | n/r | — (whole cup) | — | Coherent: fruit-juice bright, cherry/blood orange/sweet, textural cool, no tannin. Front-forward (varietally-correct). Pinned 40 s / 1:40. |
| R1 | 08-21 | 1.60% | 105 g (~52/half) | control vs 1 Konflux | dosed half — texture, creaminess, balance | Dosed WON; control "way too acidic juice forward" |
| R2 | 08-21 | 1.56% | 125 g (~62/half) | 1K vs 2K | 2-drop half — jamminess ("orange jam"); CLOSE call | 2K won narrowly |
| R3 | 08-24 | missed | n/r | 2K vs 1 TONIK+1 JAMM | T+J half — "sweeter, jammier, texture better, everything better; no question" | T+J WON decisively; 2K read "off balance, flat" |

No salinity/savory inject or clarity loss flagged on any dosed half, any round.

### Analysis

Tournament chain (each link a single blind read, path-dependent, not a ranking): **1K > control → 2K > 1K (close) → T+J > 2K (decisive).** Effective per-half volume ~52-62 mL means every dose ran ~3-4× the office per-mL intensity; the reference arm's decisive win at that scale is the strongest tolerance evidence in the track. Konflux's R2-vs-R3 inconsistency (2 drops = "orange jam" then "off/flat" on nominally identical cups) is within single-read noise and softens R2's boundary claim — the safe statement is "no inject up to 2 drops/half," not "2 drops preferred." Cup D's TDS band (1.49-1.60%) matches T3's concentrate range; the dial-in required zero corrections.

### Final output

**On a 1:10 Chombi concentrate, finished-cup drops improve the cup, and the best-tested condition is the operator's standing office dose (1 TONIK + 1 JAMM per cup), which survives and wins at ~4× practiced per-mL intensity. Konflux is cup-completing (not an inject) at 1-2 drops/half on this coffee, but lost the head-to-head.**

### Key findings

1. **Valve-driven concentration is a 2-coffee pattern (P8-AI-5 closed).** Chombi dial-in coherent first try at own grind/temp with Dial 6→5 restriction + pinned late open. Substrate implication: the sworks valve-concentration pattern line can graduate from "one coffee" to "two coffees, cross-process (washed-adjacent T3 lot + NASD Gesha)".
2. **Locked office dose is not ratio-conditional (H-ref, decisive single read).** 1 TONIK + 1 JAMM improved the concentrate at ~4× per-mL practiced intensity. Implication: office-water memory gains an "extends to 1:10 concentrates" line; no dose reduction needed at concentration on this evidence.
3. **Konflux inverts from inject to completion at concentration (H-K).** Confirms the operator's changed-condition hypothesis vs RP6 PB. Chombi-specific until a second concentrate coffee confirms (P6T4-N4).
4. **Konflux dose tolerance is wide; boundary unfound (H-dose refuted in direction).** 2 drops/half (~4-5× office per-mL) produced no salinity/inject; 1-vs-2 preference unresolved (close R2 win, contradicted by R3's flat read).
5. **H5 held:** grind 6.5 / 92°C unchanged all 4 cups; zero grind or temp spend for the whole track.
6. **Hot-dose timing caveat:** all doses at pour time, not cool peak — H-ref's "survives" verdict is technically at hot-dose timing; no degradation observed, which incidentally suggests timing is not load-bearing, but that's an un-designed observation.

### Substrate edit specifications for compile session

DO NOT execute these edits in this session — the compile session integrates substrate.

1. **Office-water memory** (`~/.claude/projects/-Users-chrismccann-latent-coffee/memory/project_office_water_apax_dosing.md`): add a line — "Extends to 1:10 concentrates: 1 TONIK + 1 JAMM per cup won RP8-T4's blind tournament on the Chombi concentrate at ~4× practiced per-mL intensity (2026-08-24, single blind read, hot-dose timing). Not ratio-conditional on this evidence." Source: finding 2.
2. **Water-inventory / water cluster doc** (brewing-equipment-expert cluster, water.md or water-inventory.md § notes — Coordinator decides fold vs defer per protocol § exit condition 5): add an "at 1:10 concentration" note — Konflux reads as texture-completion (not inject) at 1-2 drops/half on Chombi NASD Gesha, inverting its RP6 normal-strength PB read; TONIK+JAMM remains the preferred finished-cup dose at concentration. Coffee-specific tag per P6T4-N4. Source: findings 2-4.
3. **sworks valve-concentration pattern line** (brewing-equipment-expert cluster, sworks doc — the line added at T3 fold, PR #626): upgrade to two-coffee evidence per finding 1; cite Chombi dial-in (Dial 6→Dial 5, late open 1:40, TDS 1.49%, coherent first try).
4. **RP8 roadmap/end-doc** (`docs/research-projects/` RP8 roadmap doc): mark T4 CLOSED; P8-AI-5 closed (valve concentration generalizes); P8-AI-6 closed (drops verdict per § Final output); T5 (AeroPress low-pressure) is next; carry open items below.
5. **Audit/grilling:** grilling item 56 (concentrate vocabulary) gains T4 usage examples but stays open — no vocabulary locking this track (by design).

### New lessons captured

| # | Lesson | Substrate implication |
|---|---|---|
| RP8-N11 (candidate) | The split-cup blind pair delivers RP6-grade blind ordering with zero extra brewing; forced pre-reveal pick worked cleanly 3/3 rounds. | Candidate cluster primitive for office-lane comparative tracks; ratify at process retro. |
| RP8-N12 (candidate) | Record liquid yield at split time — actual per-half volume (52-62 mL vs the 65 mL estimate) materially changes per-mL dose math. | Add "yield at split" to any future split-cup protocol's capture list. |
| RP8-N13 (candidate) | Same nominal condition can flip reads across cups (Konflux-2: "orange jam" R2, "off/flat" R3) — cross-cup consistency of a condition needs its own check before boundary claims. | Strengthens the anecdote-tag rule; boundary claims want a repeat read. |

### Audit items queued

1. **P8-AI-5 — CLOSED** (valve concentration on second coffee: coherent).
2. **P8-AI-6 — CLOSED** (drops at concentration: improve the cup; locked office dose wins; not ratio-conditional).
3. **P8-AI-7 (new, open):** Konflux dose boundary at concentration unfound (no inject through 2 drops/half); is there a ceiling, and does the R2/R3 flip resolve on a repeat read? Low priority; only if a Konflux-forward cup emerges.
4. **P8-AI-8 (new, open):** dose-timing (pour-time vs cool-peak) untested as a variable — this track's reads are all hot-dose; office practice is cool-peak. Only matters if a future read contradicts practice.

### Open data items

- R3 TDS missed (meter off-site); D/R1/R2 dates operator-recalled, not logged live.
- P1/P2 pour clock+grams unreported on all 4 cups (RP8-N7 tags throughout).
- Dropper tare skipped; RP6 key (~0.065 g/drop) assumed unverified on these bottles.
- Parked (not brewed, per T2 friction 3): shorter bloom hold (20-30 s) · Dial 5 throughout / no late open · sub-1-drop half-strength dilution follow-up.

### Recap map for compile session

Integrate first: edits 1-3 (office-water memory line, water cluster "at 1:10" note, sworks two-coffee upgrade) — they're small and evidence-backed. Then edit 4 (RP8 roadmap: T4 closed, T5 next). Escalate to operator: whether RP8-N11 (split-cup blind primitive) graduates at the process retro, and whether the parked schedule follow-ups (bloom hold / no-late-open) belong in T5's design or a Chombi-specific note. Defer: P8-AI-7/8 (both low-priority opens).

### Protocol-execution friction captured

1. Cup D was brewed before Step 0 items 3-6 were confirmed (operator momentum); items back-filled before R1. Protocol survived, but the walk-through should front-load the four quick confirms as one message next time.
2. Office scale can't resolve a 5-drop tare — the tare sub-step needs a home pre-check or removal for office tracks.
3. TDS meter is a carry item across multi-day tracks; R3 lost its read to an off-site meter.
4. Brew dates drift when cups span days — per-cup date should be captured at brew time, not reconstructed.
5. Pour-by-pour capture (P1/P2 clock+grams) was never reported despite per-round prompts — office capture trims may as well pre-declare it out, or the rubric should demand it before the TDS number.

---

### Execution Session Termination

Per Lesson #40 role-discipline rule:
- ❌ NO substrate edits (registry / cluster docs / ADR / MCP)
- ❌ NO merge to main, NO substrate PR
- ❌ NO `npx tsc --noEmit` runs
- ✅ Protocol doc updated in-place as canonical archive
- ✅ Archive doc committed + pushed to branch `claude/pour-over-track-4-research-a2c5bb` (SHA in Archive location header, recorded at commit)
- ✅ Handoff brief produced above
- 🛑 Session terminating after this brief lands. The compile session integrates substrate per the design pattern.

End of RP8 Track 4 close-out.
