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

*(empty at scoping)*

---

## SESSION RECORD

*(Assistant appends per-cup records + handoff brief here at execution)*
