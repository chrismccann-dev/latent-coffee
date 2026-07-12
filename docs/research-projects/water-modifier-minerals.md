# Modifier Minerals Screen — KCl / Silica / NaCl on the Pink Bourbon (Research Project #6, side-track)

*Coffee Research · Latent · Research Project*

**Version:** 0.1 (DRAFT — Coordinator-authored, pre-execution)
**Date drafted:** 2026-07-08
**Date executed:** 2026-07-12 (Assistant session, single sitting, 8 scored cups)
**Status:** 🟢 **EXECUTED — handoff brief produced; awaiting Coordinator fold.** KCl arm DEFERRED (wrong mineral shipped). Runs during the Phase-2b (Gesha) rest interval; separate coffee + session, no interaction with 2b.
**Platform:** xBloom (controlled-pour) driving a Hario V60, fixed no-modulation recipe
**Coffee:** Hydrangea Pink Bourbon Washed (the known-baseline coffee — Chris has extra)
**Materials:** the six § 3 liquid stocks + the three unused modifiers (KCl, Eidon silica, Morton NaCl) — see [water-inventory.md](docs/skills/brewing-equipment-expert/cluster/water-inventory.md)

---

## ⚠️ LOAD-BEARING ROLE-DISCIPLINE RULE (Lesson #40)

**You are the Research Assistant. Job = execution + handoff brief. NOT substrate integration.**

**DO NOT:** edit `lib/*-registry.ts` · edit `docs/skills/*/cluster/*.md` (incl. `water.md` / `water-inventory.md`) · edit ADRs · `git commit`/`push` SUBSTRATE, merge to main, `gh pr create` — EXCEPT the one archive-persist commit of THIS doc · run `npx tsc --noEmit` on substrate · continue past the handoff brief.
**DO:** read this doc in full BEFORE Step 0 · Step 0 with Chris · cups one-at-a-time · capture inline (doc IS the archive) · handoff brief per [`handoff-brief-template.md`](docs/skills/research-coordinator/cluster/templates/handoff-brief-template.md) · commit + push the archive to your branch (branch + SHA in the brief) · TERMINATE. Full primitive: [`role-discipline.md`](docs/skills/research-coordinator/cluster/role-discipline.md).

---

## Context — what this side-track is FOR

RP6's core is done (anion→phase map codified in [water.md](docs/skills/brewing-equipment-expert/cluster/water.md); Gesha verification is Phase 2b, mid-rest). This is the **three WBC-seeded modifier tracks, combined into one session** while the Gesha rests — on the **Pink Bourbon**, the coffee we know best (peak = straight MgCl₂ @ GH 44). It closes out the last three unused minerals.

These are **additive modifiers, not GH sources** (none contributes hardness) — so the design is "add a low dose to a known base and score the axis it's supposed to move," not the anion→phase 2×2.

- **KCl (potassium-as-finish).** The 2026 WBC field uses K (KCl / K-citrate) for **finish / length / peach**. Important: Track 2 disliked potassium — but that was **KHCO₃ (the bicarbonate buffer)**, which flattened acidity. **KCl is a different role** (K + chloride, no buffering). This disambiguates "we disliked potassium" from "we disliked the buffer."
- **Silica (silica-as-texture).** The field loves it for **smooth / creamy / round texture**. Eidon liquid, dose very low.
- **NaCl (salinity / seasoning).** Small chloride/salinity → perceived **sweetness / roundness / finish**, late + low. Punishes overdose fastest.

Single-coffee / provisional (like all RP6 values) — extends the map with three new modifier axes on the known coffee; other coffees verify later. **Substrate-fold DEFERRED** — if a modifier earns a `water.md` chart-row or recipe-modifier note, that's a post-track Coordinator/execution job, not this session.

---

## Hypotheses (pre-state before scoring, per Lesson #16)

- **HM1 — KCl → finish?** Does KCl add finish/length/peach on the Pink Bourbon? And is it *pleasant* (unlike the KHCO₃ buffer)? Disambiguates the Track-2 potassium result.
- **HM2 — Silica → texture?** Does silica change mouthfeel (smoother/creamier/rounder) without moving flavor? At what dose does it start to dull?
- **HM3 — NaCl → salinity/sweetness/roundness?** Does a tiny NaCl addition read as perceived sweetness/roundness, and where does it tip into "salty/dominant"?

---

## Step 0 — calibration

1. **Pink Bourbon baseline recipe** — use the established Track-1/2 baseline (record it here); run one confirming brew.
2. **Make the two missing stocks** (for precise low dosing): **KCl 10,000 ppm** (1 g/100 g distilled) + **NaCl 10,000 ppm** (1 g/100 g). Silica is already liquid (Eidon; ~12.5 mg/drop). EC60-fingerprint the two new stocks. *(These become new § 3 inventory rows — the Coordinator folds them post-track.)*
3. **The peak base:** build the Pink Bourbon peak = **straight MgCl₂ @ GH 44** from the § 3 MgCl₂ stock (~9 g/L); verify on the LaMotte. This is the primary base.
4. **Rig check:** EC60 cal vs the 84 µS standard.
5. **Coffee budget:** ~11 scored cups planned; confirm enough Pink Bourbon.
6. **Semi-blind:** code + shuffle.

---

## Experiment design — modifier additions (pre-brew; A/B vs the matching base; per-axis scoring)

**Two baselines:** (a) plain **peak** (MgCl₂ @ GH 44), (b) plain **distilled**.

**Lane 1 — on the peak base** (the realistic use — seasoning a good water). Each modifier at a **2-step low ladder**, A/B vs the plain peak:
| Modifier | Low | Higher | Watch axis |
|---|---|---|---|
| **KCl** | ~10 ppm (1 g stock/L) | ~25 ppm (2.5 g/L) | finish / length; is it pleasant? |
| **Silica** | ~1 drop/L (~12 ppm) | ~2 drops/L (~25 ppm) | texture / mouthfeel; dulling? |
| **NaCl** | ~5 ppm (0.5 g stock/L) | ~15 ppm (1.5 g/L) | salinity → sweetness/roundness; tip point |

**Lane 2 — distilled isolation** (pure modifier signal). Each modifier at its **low** dose in plain distilled (1 cup each), A/B vs plain distilled. Isolates the modifier with no MgCl₂ confound.

Total ≈ 2 baselines + 6 (Lane 1) + 3 (Lane 2) = **~11 cups** → one sitting.

**Scoring — PER-AXIS directional reads** (finish · texture/mouthfeel · sweetness · salinity · acidity · body · florality), each scored separately vs the matching base; + reveal/inject flag. Never a single overall verdict. Tool-call-per-cup; auto-retest ambiguous reads; keep doses LOW (NaCl/KCl punish overdose fast). Note: neither base carries calcium, so the silica-calcium interaction is not in play here.

---

## Recording Sheet

### Step 0
- **Pink Bourbon baseline recipe (LOCKED — same recipe as all prior RP5/RP6 tracks, no changes; operator confirmed 2026-07-12):** xBloom "Other"/freesolo driving V60 chamber, grinder OFF / external EG-1 · Sibarist B3 · 15 g dose · 247 g water (1:16.5) · EG-1 @ 6.4 · Bloom 45 g @ 94 °C spiral, 45 s wait · P2 at ~0:58 to 150 g @ 94 °C spiral, 30 s pause · P3 at ~1:58 to 247 g @ 93 °C spiral, 0 s pause · flow 3.5 mL/s all pours · target ~3:00–3:15. Reference cup: sweet/bright, lime + tomato/herbal + light brown tea, integrated, mild flatten on cool.
- Confirming brew: **✅ done on distilled, open-label, locked recipe — lime, citrus, a bit tomatoey on the body, a little flat brown tea; "reminds me just like all of the other control baselines." Dial-in holds; proceed.** · KCl stock EC **N/A — wrong mineral shipped (K₂CO₃), KCl arm dropped, see friction log** · NaCl stock EC **15.65 mS** (1.002 g NaCl + 100.0 g distilled, made 2026-07-12) · fresh MgCl₂ stock EC **9.32 mS** (1.000 g + 100.0 g, made 2026-07-12; vs old bottle **9.31 mS** — batch-consistency PASS, no deliquescence drift; old bottle label read 6/28 vs inventory's 7/01 made-date, immaterial given EC identity) · peak base built as **2× 1,000 g batches @ 9.0 g fresh MgCl₂ stock each** (vs 9.03 g/L key — 0.3% low, noise); EC bottle 1 **155.3 µS** / bottle 2 **154.8 µS** — two-batch identity PASS · peak LaMotte: total hardness **purple-at-5 / clean-blue-at-6 drops (upper line, ×10) = the Track-2 Mg-water true-GH-44 band (L-c #9: Mg endpoint drags; clean-on-6 = on target) — GH PASS**; operator notes fill was a hair above the upper line (overfill → drops read slightly HIGH → true GH a touch under the nominal read, i.e. toward 44 — harmless direction); Ca-hardness skipped (0 by construction + L-c #1 muddy-purple on Mg waters); alkalinity skipped (KH 0 by construction — no carbonate source in MgCl₂ + distilled; operator call, Assistant-accepted) · EC60 cal (84 µS std) **85.5 µS post-cal, accepted** (~+1.8% vs standard — fine for fingerprinting; all Step-0 fingerprints share this cal so they're internally comparable) · coffee on hand ✅ (operator confirmed, ~11+ cups) · distilled supply ✅ (operator confirmed)

### Predictions (pre-state HM1-HM3) — locked 2026-07-12 before any scored cup
**Operator-neutral** (Chris: first-ever use of silica + NaCl, "pretty blank slate — no strong prior, take the defaults"); predictions below are field/literature defaults, NOT operator priors (same posture as Track 2).
| Modifier | Predicted effect | Predicted tip/dulling point |
|---|---|---|
| KCl | (DEFERRED — wrong mineral shipped, see friction log) | — |
| Silica | Smoother/creamier/rounder texture, flavor untouched at ~12 ppm | ~25 ppm (2 drops/L) at risk of dulling the lime |
| NaCl | Late roundness / perceived sweetness at ~5 ppm, no overt salinity | ~15 ppm at risk of tipping salty/dominant on this clarity coffee |

**Session structure (locked at Step 0 close):** 3 rounds of Chris's 3-cup habit — R1 = plain peak (scored control) + silica low/high on peak · R2 = NaCl low/high on peak vs retained R1 control (fresh control if stale) · R3 = plain distilled (scored control) + silica-low + NaCl-low in distilled. **All modifiers PRE-BREW (in the brew water)** — no post-brew cup-splitting (HT3: post-brew inverts mechanism). Silica dosed by drop-then-halve (1 drop/520 g ≈ 24 ppm high; 1:1 with plain base ≈ 12 ppm low — avoids fractional drops); NaCl by micropipette from stock (150 µL/300 g ≈ 5 ppm; 450 µL ≈ 15 ppm; F9 pipette rule). Cups coded + position-shuffled per round, read fully cooled at matched temp (Track 2 discipline).

### Per-cup scoring (per-axis; one row per cup)
| Code | Base | Modifier + dose | Finish | Texture | Sweetness | Salinity | Acidity | Body | Floral | Reveal/Inject | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| R1-A | peak (control) | none — plain MgCl₂ @ GH 44 | smooth, pretty nice | light (coffee's norm) | nice | low | nice lime | light, brown-tea zone | tiny bit | — (reference) | Aroma lime + sweet, "reminds me of the best version of the last one"; more character than the distilled control (which read a little flat). The optimized reference. |
| R1-B | peak | **silica HIGH ~24 ppm** (1 drop/520 g) | **harsher** | ~same | slight ↑ at first, then **net ↓** (saltiness robs it) | **↑ too much — reads almost salty** | ↓ | ~same | ~none (base has little) | **INJECT-leaning** | Less sweet on aroma. "Feels a little bit too much"; harsh vs A and vs C. Clearly past the ceiling. |
| R1-C | peak | **silica LOW ~12 ppm** (halved) | lingers a tad ↑ | tad ↑ | tad ↑ | tiny ↑, not overpowering | tad ↑ | ~same | ~same | **REVEAL-leaning** ("amplification, not addition") | Aroma ≈ A. "Very slight lift in everything… more of an addition onto something, not something in and of itself." **Preferred over A** — elegant, smooth, integrated. |

**R1 head-to-heads:** A > B (B harsher) · **C > A** (slight amplification across axes) · C ≫ B (C elegant/integrated, B much too harsh). Semi-blind held — codes revealed only after all reads.
| R2-A | peak (vs retained R1-A control) | **NaCl LOW ~5 ppm** (150 µL stock/300 g) | — | ~same | slight ↓ | not salty per se — a **savoriness** | slight ↓ | slight ↑ (a little more heaviness) | — | **INJECT** ("feels like it's injecting something that is not there") | Savory tinge in aroma + cup; crowds out the other flavors a bit; possibly interacting with the coffee's tomato note (accentuating what the recipe tries to hide). |
| R2-B | peak (vs retained R1-A control) | **NaCl HIGH ~15 ppm** (450 µL stock/300 g) | — | — | ↓ | **much more extensive savoriness/muddiness** | ↓ | savory-dominated | — | **INJECT, stronger** | Amplifies the tomato-ness; "not necessarily pleasant with this coffee." |

**R2 head-to-heads:** control > A > B. Control-vs-A direct: control much more acidity + sweetness, light + bright; A's savory note mutes the rest. Operator nuance: "not opposed to this per se — it just doesn't fit THIS coffee" (salinity read as coffee-dependent, not globally bad). Retained R1-A control was visually identifiable (much cooler) — this pair was effectively open-label vs control, coded only within the A/B pair.
| R3-ctrl | distilled (control) | none | — | — | — | — | — | — | — | — (reference) | "Lime, tomatoey, brown tea, kinda flat — just like the control how it always was." |
| R3-A | distilled | **NaCl LOW ~5 ppm** (150 µL/300 g) | — | ~same | ↓ | **savory element, overpowering** | ↓ | — | — | **INJECT** | Savory quality even in aroma. Ranked BELOW plain distilled. **Isolation verdict: the savoriness is NaCl itself, not chloride-stacking with MgCl₂** — same inject with no MgCl₂ present. |
| R3-B | distilled | **silica LOW ~12 ppm** (drop-halved) | flavors linger a tad ↑ (possibly the mechanism) | ~same — **no texture delta even when hunting for it post-reveal** | tad ↑ | — | tad ↑ (brighter) | a little lighter | — | **REVEAL** | "A little bit of everything more"; lingering finish gains sweet/bright/lime. **B > control > A.** |

**R3 head-to-heads + post-reveal check:** silica > distilled control > NaCl. Post-reveal, operator went back and forth control-vs-silica deliberately hunting the predicted TEXTURE delta: **none found even when staring at it.** Operator's mechanism read: silica acts like **salting food — accentuates what's there rather than introducing anything** ("amplification, not addition," replicating R1-C's read in a different base); best guess is the slight lingering is what reads as more-of-everything. Same-day palate caveat: R3 ran at the operator's stated fatigue limit ("getting kinda close to the limit").

### Modifier summary (fill after scoring)
| Modifier | Effect confirmed? | Sweet-spot dose | Pleasant / worth keeping? | Peak-base vs distilled-isolation |
|---|---|---|---|---|
| KCl | **NOT TESTED** — wrong mineral shipped (K₂CO₃); arm deferred | — | — | — |
| Silica | **Effect real but NOT the predicted one:** no detectable texture change even when hunted post-reveal; instead a slight across-the-board amplification (sweet/bright/lime, lingering finish) — "salting food" mechanism | **~12 ppm (1 drop/L)**; ~24 ppm flips to harsh/almost-salty inject — ceiling between 12 and 24 | **YES — won both lanes** (beat plain peak in R1, beat plain distilled in R3); the session's clear keeper | **Consistent in both bases** — same amplification read on peak and on distilled |
| NaCl | **Salinity → savoriness confirmed as a real, dose-responsive effect — but the predicted sweetness/roundness never appeared** at either dose | **None on this coffee** — 5 ppm already injects; 15 ppm worse | **NO for the Pink Bourbon** (couples to + amplifies the tomato note the recipe suppresses); operator explicitly NOT opposed globally — coffee-dependent, retest on a savory-compatible coffee | **Consistent in both bases** — savoriness present with and without MgCl₂, so it's NaCl itself, not chloride stacking |

---

## Notes / friction · New lessons · Audit items

_(Assistant: capture inline. Candidate primitives stay logged for the PROJECT retro.)_

- **[Step 0 · operator call] Reagent-grade MgCl₂ accepted for this session.** The food-grade Alliance Chemical replacement (ordered 2026-07-08) has NOT arrived; Assistant flagged the inventory doc's not-for-drinking marking on the reagent-grade flakes; Chris accepted proceeding on the existing reagent-grade stock ("fine for now"). On food-grade arrival the standing inventory-doc plan applies (fresh stock, EC identity check, retire reagent bottles). Logged as an accepted deviation, not re-litigated.
- **[Step 0 · SCOPE CHANGE — KCl DROPPED] Wrong mineral shipped.** At stock-making, Chris found the seller sent **potassium carbonate (K₂CO₃)** instead of potassium chloride (KCl). Return requested. K₂CO₃ was NOT substituted (it's a carbonate alkalinity buffer — stronger than the Track-2 KHCO₃; brewing it would re-test "buffer flattens acidity," not HM1's K-as-finish). **HM1 is DEFERRED, not answered** — session runs silica + NaCl only: 2 baselines + 4 Lane 1 (silica ×2, NaCl ×2) + 2 Lane 2 = **~8 scored cups**. Handoff brief must carry the KCl remnant forward (re-run the KCl arm when the replacement arrives; the potassium-vs-buffer disambiguation stays open). Audit item: inventory § 2 KCl row (8 oz "KCl" Jun 29) is actually K₂CO₃ — Coordinator should correct the row on fold.
- **[R1 observation — silica dose ceiling is BETWEEN 12 and 24 ppm, and the failure mode is HARSH/SALTY, not the predicted dulling.** The field default predicted 2 drops/L risks *muting* the lime; instead the high cup read harsh + almost-salty and robbed sweetness. And the low-dose win wasn't purely textural — it read as a slight *across-the-board amplification* (sweetness/acidity/texture/finish all a tad up), i.e. broader than HM2's texture-only prediction. Worth a Lane-2 check on whether the salty edge is the Eidon carrier rather than silica itself.]
- **[R2 observation — HM3's "salinity → sweetness" did NOT show even at 5 ppm; the low dose already injects.** Prediction said ~5 ppm reads as late roundness/perceived sweetness with the tip point near 15 ppm. Instead 5 ppm already read as a savory inject that *lowered* perceived sweetness + acidity, and 15 ppm just amplified it. No sweet-spot dose exists on this coffee. Key nuance for the map: the failure reads **coffee-dependent** — NaCl's savoriness couples to the Pink Bourbon's tomato note (amplifying the note the baseline recipe tries to suppress); a coffee without a savory latent note might tolerate it differently. Also methodological: R2 ran effectively open-label vs the visibly-cooler retained control.]
- **[Step 0] MgCl₂ stock supply:** existing 2026-07-01 bottle is low — Chris making a fresh 100 g batch this session (same reagent-grade salt); EC-fingerprint vs the old bottle as a batch-consistency check before building the peak base.

## HANDOFF BRIEF FOR COMPILE SESSION (Modifier Minerals Screen Close-Out)

**Date:** 2026-07-12
**Session role:** execution + handoff brief production (no substrate edits)
**Archive location:** branch `claude/modifier-minerals-screen-50873b` @ `1479f17d6d749ca218043236bed77ecb62138607` (archive commit; one follow-up commit records this SHA), pushed to origin (the compile session fetches/branches from here — the archive doc is committed; substrate is NOT; not merged to main). See [`role-discipline.md` § Archive persistence](docs/skills/research-coordinator/cluster/role-discipline.md).
**Methodology verdict:** **MIXED — both tested hypotheses resolved decisively, but neither in the predicted shape; HM1 not tested (wrong mineral shipped).**

This brief is the canonical consumption artifact for the Coordinator (end-doc + roadmap + fold plan) and the Execution session (substrate-edit specs). It stands alone; raw data is in § Per-cup scoring above.

### TL;DR

- **Silica is the session's keeper — but as a low-dose AMPLIFIER, not a texture modifier.** ~12 ppm won both lanes (beat plain peak AND plain distilled); zero detectable texture change even when hunted post-reveal. Operator mechanism read: "like salting food — accentuates what's there" (slight lift in sweetness/acidity/lime + lingering finish).
- **Silica's ceiling is between 12 and 24 ppm**, and the overdose failure mode is harsh/almost-salty inject — NOT the predicted dulling.
- **NaCl has no sweet-spot dose on the Pink Bourbon:** 5 ppm already injects a savoriness that couples to (and amplifies) the coffee's tomato note; 15 ppm is worse. The predicted salinity→sweetness/roundness never appeared. Read as coffee-dependent, not globally bad.
- **NaCl's savoriness is the salt itself, not chloride stacking** — identical inject in distilled (no MgCl₂ present).
- **HM1 (KCl → finish) is UNTESTED:** seller shipped K₂CO₃ instead of KCl (return requested). The potassium-vs-buffer disambiguation stays open; re-run as a small remnant arm (2-3 cups) when real KCl arrives.
- Rig was clean: fresh MgCl₂ stock EC-matched the old batch (9.32 vs 9.31 mS); peak base LaMotte'd into the Track-2 true-GH-44 band (purple-5/blue-6, upper line).

### Execution summary

8 scored cups (protocol planned ~11; the 3 KCl cups dropped at Step 0 when the wrong mineral was discovered) in 3 rounds of the operator's 3-cup habit, one sitting, 2026-07-12. Semi-blind held in R1 and R3 (coded + shuffled, reveal after all reads); R2 ran effectively open-label vs the visibly-cooler retained R1 control (coded within its pair). All modifiers dosed PRE-BREW per protocol; no post-brew splitting. Per-axis scoring held throughout; no holistic verdicts. One deliberate post-reveal re-check (control vs silica-low, hunting texture) substituted for the auto-retest budget. R3 ran at the operator's stated palate limit — same-day fatigue caveat on R3 magnitudes, not directions (R3 silica replicated R1-C's direction exactly).

### Equipment / conditions

| Item | Value |
|---|---|
| Coffee | Hydrangea Pink Bourbon Washed (known-baseline; plenty on hand) |
| Recipe | Locked baseline: xBloom freesolo → V60, Sibarist B3, 15 g / 247 g (1:16.5), EG-1 @ 6.4, 94/94/93 °C, 45 g bloom 45 s / 150 g @0:58 +30 s / 247 g @1:58, 3.5 mL/s, ~3:00-3:15 |
| Peak base | Straight MgCl₂ @ GH 44: 9.0 g fresh stock / 1,000 g distilled × 2 bottles; EC 155.3 / 154.8 µS; LaMotte purple-5/blue-6 upper line = Track-2 Mg GH-44 band ✅ |
| Stocks | NaCl 10,000 ppm made this session (1.002 g/100 g, EC 15.65 mS); MgCl₂ 10,000 ppm fresh batch (1.000 g/100 g, EC 9.32 mS vs old 9.31 — identity PASS). **Reagent-grade MgCl₂ accepted by operator (food-grade in transit).** KCl stock NOT made (wrong mineral shipped). |
| Silica dosing | Eidon liquid, drop-then-halve: 1 drop/520 g ≈ 24 ppm (high); 1:1 with plain base ≈ 12 ppm (low). No EC fingerprint (non-ionic). |
| NaCl dosing | Micropipette from stock: 150 µL/300 g ≈ 5 ppm; 450 µL ≈ 15 ppm (F9 pipette rule) |
| EC60 | Calibrated vs 84 µS standard; read 85.5 post-cal (accepted; all fingerprints share the cal) |

### Per-cup raw data

Canonical recording sheet: **§ Per-cup scoring** table above (8 rows R1-A..R3-B + head-to-head blocks + the R3 post-reveal texture re-check). Predictions were locked operator-neutral (field defaults; operator's first-ever use of both minerals) before any scored cup.

### Analysis

- **HM2 (silica → texture): effect REAL, mechanism CONTRADICTED.** Cross-lane replication is the strong evidence: the low-dose read ("slight lift in everything, lingering finish, amplification-not-addition") appeared independently in both bases, semi-blind both times, and the operator ranked silica-low #1 in both lanes. The predicted texture delta specifically did NOT appear — confirmed by a deliberate post-reveal hunt. Reveal-not-inject: REVEAL at ~12 ppm; INJECT at ~24 ppm.
- **HM3 (NaCl → sweetness/roundness): CONTRADICTED.** Both doses lowered perceived sweetness + acidity and added savoriness; dose-responsive (15 ppm ≫ 5 ppm savoriness); replicated across bases. The distilled lane cleanly attributes the effect to NaCl itself (not Cl⁻ stacking, since the peak base already carries ~31 ppm chloride and the effect was identical without it). Coffee-coupling nuance: the savoriness amplifies the Pink Bourbon's latent tomato note — the axis the locked recipe deliberately suppresses — so the "doesn't fit" verdict is per-coffee, not universal.
- **HM1 (KCl → finish): NOT TESTED.** No data. The Track-2 "we disliked potassium = we disliked the KHCO₃ buffer" disambiguation remains open.

### Final output

| Modifier | Verdict | Dose guidance (Pink Bourbon, provisional single-coffee) |
|---|---|---|
| **Silica** | KEEP — low-dose amplifier ("salting food"), not a texture mod | **~12 ppm (1 drop/L)**; ceiling < 24 ppm; works on peak AND distilled |
| **NaCl** | REJECT on this coffee — savory inject, no sweetness benefit | No workable dose (≤5 ppm already injects); candidate retest on a savory-compatible coffee only |
| **KCl** | DEFERRED — untested | Re-run 2-3-cup remnant arm when real KCl arrives |

### Key findings

1. **Silica-low (~12 ppm) beat its base in BOTH lanes, semi-blind.** Data: R1 C>A, R3 B>control, replicated reads. Substrate implication: silica earns a `water.md` chart-row as a *general low-dose amplifier* — with the texture role-label explicitly corrected.
2. **Silica's WBC "texture" role-label did not reproduce** (like Track 1's MgSO₄=florality miss): zero texture delta even when hunted post-reveal. Implication: reinforces the standing "role-labels are coffee-dependent / field labels don't port" doctrine in `water.md`.
3. **Silica overdose fails harsh/salty, not dull; ceiling ∈ (12, 24) ppm.** Data: R1-B inject read. Implication: chart-row dose column carries the ceiling; open question whether the salty edge is the Eidon carrier (unresolvable this session — single-brand confound, logged as audit item).
4. **NaCl injects savoriness at 5 ppm on this coffee; effect is dose-responsive and base-independent.** Data: R2 A/B + R3-A isolation. Implication: `water.md` chart-row records NaCl as coffee-dependent seasoning with the tomato-coupling mechanism named; NOT a general recommendation.
5. **The predicted NaCl sweetness/roundness never appeared at any dose.** Implication: another field-label non-reproduction; same doctrine row.
6. **HM1 untested — wrong mineral shipped (K₂CO₃ ≠ KCl).** Implication: inventory correction + remnant-arm re-run; potassium-vs-buffer question stays open.
7. **Rig validation chain held end-to-end** (stock EC identity 9.31/9.32 mS; two-batch peak EC 155.3/154.8 µS; LaMotte in the Track-2 Mg band). Implication: none — confirms the Track-2 operational locks are reusable as-is.

### Substrate edit specifications for compile session

DO NOT execute these edits in this session — the compile session integrates substrate.

**Cluster doc edits ([docs/skills/brewing-equipment-expert/cluster/water.md](docs/skills/brewing-equipment-expert/cluster/water.md)):**
1. **Add silica chart-row** to the modifier/mineral chart: role = *low-dose amplifier* ("salting food" — slight across-the-board lift + lingering finish; NOT texture — WBC texture label did not reproduce, no texture delta found on deliberate post-reveal hunt); dose ~12 ppm (1 Eidon drop/L), ceiling < 24 ppm (overdose = harsh/almost-salty inject); works on peak and distilled bases; PROVISIONAL single-coffee (Pink Bourbon, this track). Source: Key findings 1-3.
2. **Add NaCl chart-row**: role = coffee-dependent savory seasoning; on the Pink Bourbon it injects at ≥5 ppm (couples to/amplifies the latent tomato note; lowers perceived sweetness + acidity; predicted sweetness/roundness absent at 5 and 15 ppm; base-independent — not chloride stacking); no workable dose on this coffee; retest candidate only on a savory-compatible coffee. PROVISIONAL single-coffee. Source: Key findings 4-5.
3. **KCl chart-row: do NOT add** — untested. If `water.md` carries a modifier-tracks status note, mark KCl "deferred — wrong mineral shipped 2026-07-12, remnant arm pending."

**Inventory edits ([docs/skills/brewing-equipment-expert/cluster/water-inventory.md](docs/skills/brewing-equipment-expert/cluster/water-inventory.md)):**
4. **§ 3: add NaCl stock row** — NaCl 10,000 ppm, 1.002 g/100 g distilled, made 2026-07-12, EC 15.65 mS; per 1 g stock in 1 L: ~3.9 mg/L Na + 6.1 mg/L Cl, no GH/KH; role = salinity/seasoning (see water.md NaCl row: coffee-dependent). Source: Step 0 record.
5. **§ 3: add MgCl₂ fresh-batch note or row** — second 10,000 ppm batch made 2026-07-12 (1.000 g/100 g, EC 9.32 mS; old-batch identity confirmed vs 9.31 mS). Still reagent-grade sourced — the food-grade replacement plan (2026-07-08 update-log entry) unchanged. Source: Step 0 record.
6. **§ 2: correct the KCl row** — the 8 oz "KCl (fine powder, 99% food, Jun 29)" is actually **K₂CO₃ (potassium carbonate), wrong item shipped; return requested 2026-07-12**. Do not use as KCl (it's a carbonate buffer). Update § 3's "not yet stocked" line accordingly (KCl still not stocked; NaCl now stocked). Source: Key finding 6 / friction log.
7. **§ 3 "not yet stocked" line**: remove NaCl (now stocked, edit 4); KCl stays with the wrong-shipment note.

**Audit item resolutions:** none inherited; new items below.

### New lessons captured

| # | Lesson | Substrate implication |
|---|---|---|
| RP6-side-N1 | **Verify the label on arrival, not at first use.** The KCl/K₂CO₃ wrong-shipment sat undetected from Jun 29 to Step 0 — checking the label when the track needs the reagent puts discovery at the worst time (mid-session, arm dropped). Cheap fix: read the actual chemical name at delivery + at inventory entry. | Candidate acquisition-time check for water-inventory.md's sync discipline (Coordinator judgment) |
| RP6-side-N2 | **Drop-quantized reagents dose via drop-then-halve serial dilution**, not fractional drops and not per-cup working solutions: 1 drop into 2× the target volume, then 1:1 with plain base = the low step. Zero waste, two ladder steps from one drop. | Reusable dosing primitive for any drops-based liquid (Eidon silica, future tinctures) |
| RP6-side-N3 | **A modifier can pass "effect real" while failing its role-label** — score the axis it actually moves, not the axis it's marketed for. Silica passed as an amplifier while failing as a texture mod; per-axis scoring is what caught it (a holistic score would have recorded "silica good" and ported the wrong label into substrate). | Reinforces per-axis discipline; feeds the water.md role-labels-don't-port doctrine |

### Audit items queued

| # | Item | Status | Implication |
|---|---|---|---|
| P6S-AI-1 | Inventory § 2 KCl row is actually K₂CO₃ (wrong shipment, return requested) | **queued for compile session** (edit spec 6) | Blocks the KCl remnant arm until a real KCl purchase lands |
| P6S-AI-2 | Is silica-high's harsh/salty edge the silica or the Eidon carrier? Single-brand confound; unresolvable with current materials | open | If silica graduates beyond provisional, test a second silica source |
| P6S-AI-3 | NaCl savory-coupling is hypothesized to ride the coffee's latent tomato note — retest NaCl on a savory-compatible coffee to separate "NaCl is savory everywhere" from "NaCl amplifies latent savory notes" | open | Shapes the NaCl chart-row's coffee-dependence wording; cheap 2-cup add-on to a future track |

### Open data items

- **HM1 entirely open** — KCl remnant arm (2-3 cups: low ladder on peak + optional distilled isolation) when real KCl arrives. The Track-2 potassium-vs-buffer disambiguation depends on it.
- R3 ran at palate limit — directions replicated R1 so they stand, but R3 *magnitudes* shouldn't be quoted as calibrated.
- Silica ceiling only bracketed (12 < ceiling < 24 ppm); a 3-step ladder would localize it if the value ever matters.

### Recap map for compile session

Integrate first: the two `water.md` chart-rows (specs 1-2) + the inventory corrections (specs 4-7) — they're self-contained and the KCl inventory correction is safety-adjacent (prevents someone dosing K₂CO₃ as KCl). Defer: nothing else pending. Escalate to operator: whether the silica amplifier finding changes the Pink Bourbon recipe-library row in `water.md § 6` (peak = straight MgCl₂ @ GH 44 — does it become "MgCl₂ @ GH 44 + 1 drop/L silica"? Operator preferred the silica cup in both lanes, but promoting a session-of-one read into the locked per-coffee recipe is an operator call, and single-sitting).

### Protocol-execution friction captured

1. **Wrong-mineral discovery mid-Step-0** (KCl→K₂CO₃) forced a live scope cut. Handled cleanly (arm deferred, doc updated) but see RP6-side-N1 for the prevention.
2. **Retained-control temperature identifiability:** R2's A/B vs the retained R1 control was effectively open-label because the retained cup was visibly cooler. If a future protocol reuses a retained control, either re-warm-match or brew a fresh control for blinding.
3. **The protocol's per-L dose keys didn't translate to per-cup builds for drop-quantized reagents** — resolved live with drop-then-halve (RP6-side-N2). Future protocols with drops-based reagents should specify the build geometry up front.
4. **LaMotte procedure recall:** operator needed the hardness-test procedure re-explained and the Assistant initially described the wrong mechanism (syringe titrator vs drop-count) until the booklet photo settled it; the Track-2 archive § kit-reference had the correct procedure all along. Lesson for Assistants: grep the prior track's kit-reference section BEFORE improvising instrument instructions.

---

### Execution Session Termination

Per Lesson #40 role-discipline rule:
- ❌ NO substrate edits (registry / cluster docs incl. water.md/water-inventory.md / ADR / MCP)
- ❌ NO merge to main, NO substrate PR
- ❌ NO `npx tsc --noEmit` runs
- ✅ Protocol doc updated in-place as canonical archive (authorized per "doc IS the archive" framing)
- ✅ Archive doc committed + pushed to branch `claude/modifier-minerals-screen-50873b` @ `1479f17d6d749ca218043236bed77ecb62138607` (archive commit; one follow-up commit records this SHA) (the authorized archive-persist exception)
- ✅ Handoff brief produced above; branch + SHA in the `Archive location:` header for the compile session
- 🛑 Session terminating after this brief lands. The compile session integrates substrate per the design pattern.

End of Modifier Minerals Screen close-out.
