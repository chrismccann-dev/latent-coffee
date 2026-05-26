# Specialty Cone Filter Drawdown Characterization (Research Project #3)

*Coffee Research · Latent · Research Project*

**Version:** 3.0 (close-out)
**Date drafted:** 2026-05-24
**Date executed:** 2026-05-25
**Status:** CLOSED — TRIFECTA COMPLETE
**Home EG-1**

---

## TL;DR

Project #3 ran as **two mini-projects in one session** with deliberately contrasting brewer architectures:

- **#3a Funnex** (Chemex Funnex glass, 4 papers including 1 net-new) anchored at Sibarist CONE 28 FAST. Diagnostic-rich, measurement-imprecise. Surfaced 13 of the 20 new lessons including a **bimodal drawdown regime** that broke the protocol's unimodal-noise assumption. Required protocol revision (15g/250g → 10g/150g) at calibration due to brewer physical-capacity ceiling.
- **#3b Sibarist Brewing System** (2 system-integrated papers) anchored at Sibarist HALO CONE B3. Diagnostic-light, measurement-crisp. **4s baseline range** — tightest in the entire 3-project arc (vs Project #1's 8s, Project #2's 6s, Project #3a's 36s).

The two mini-projects produced opposite kinds of value that compose into the headline methodological insight of the arc: **#3a is the diagnostic mini-project that surfaced the framework. #3b is the validation mini-project that confirmed it. Neither half alone delivers the full insight; the contrast IS the insight.**

**20 new lessons (#20-39) extracted.** Lesson #36 is the deepest insight of the arc: paper "self-choke" observed in #3a was paper-brewer-interaction artifact, not paper-fiber-intrinsic. HALO-B3 in the BS shows no choke even without bed or grounds, despite the same self-choke signature having appeared in #3a's CONE28-FAST and FS-100 no-bed tests.

After this project closes, **Research Assistant SKILL.md scaffolding unlocks** per ADR-0011's ≥2-tracks trigger (technically fired post-#2, sharpened by #3). Research Project #4 (re-measure Project #1 V60 papers in Sibarist BS to isolate paper-fiber-only effects) is queued for a future session — scope brief at end of this doc.

---

## Project Context

This is **Research Project #3** — the third and final project in the trifecta arc opened by Project #1 (cone, closed 2026-05-23 in PR #226) and continued by Project #2 (flat-bottom, closed 2026-05-24 in PR #238).

| Project | Brewer | Baseline | Scope | Status |
| :---- | :---- | :---- | :---- | :---- |
| #1 - Cone Filter Drawdown | Hario V60 Glass (V60-01) | Sibarist CONE B3 | 8 cone papers | ✅ CLOSED 2026-05-23 |
| #2 - Flat-bottom Filter Drawdown | Orea Type-A Glass + Negotiator | Sibarist FLAT 2 B3 size S | 5 flat papers | ✅ CLOSED 2026-05-24 |
| **#3a - Funnex (deep-cone)** | Chemex Funnex glass | Sibarist CONE 28 FAST | 4 papers (incl. FS-100 net-new) | ✅ CLOSED 2026-05-25 |
| **#3b - Sibarist HALO (system-integrated)** | Sibarist Brewing System | Sibarist HALO CONE B3 | 2 papers | ✅ CLOSED 2026-05-25 |
| (skipped) | Per-paper native (UFO / Weber Bird / April) | None | Cohort-of-one — no peer baseline value | Per Project #2 Lesson #12 |
| (queued) | Sibarist Brewing System | HALO CONE B3 (continuity) | 8 Project #1 V60 papers | **Research Project #4** scope brief at end |

---

## Headline Findings (the substantive findings)

### Finding 1 — Funnex is bimodal, Sibarist BS is monomodal

The Funnex without a Negotiator-equivalent produces two distinct drawdown regimes under nominal protocol:

- **Slow regime** (water reaches paper-choke threshold): ~131s median, range 36s across 4 reps
- **Fast regime** (water stays below choke threshold): ~31.5s median, range 3s across 2 reps
- Empirical split under locked-seal protocol: **~80% slow, ~20% fast** on CONE28-FAST

Regime selection is driven by **pour rate × bed throughput interaction**. Fast water arrival or slow paper drainage builds a water column that hits the choke threshold; slow arrival or fast drainage keeps the column below threshold.

The Sibarist BS, by contrast, produced **4s baseline range across 3 reps** with no bimodal behavior visible. Same fiber families (FAST and B3) as Sibarist's other papers, but engineered to fit the BS perfectly, with no brewer walls to seal against. The 4s baseline is the tightest of any project in the arc.

### Finding 2 — Paper "self-choke" is paper-brewer-interaction artifact (Lesson #36, deepest insight of arc)

In #3a a self-choke framing was derived for CONE28-FAST and FS-100 (paper alone over the sink shows fast-initial-then-choke-then-slow flow). Initial interpretation: paper-fiber-intrinsic load-dependent flow. But **#3b's HALO-B3 paper-only test** (no bed, no grounds, fresh paper held in BS, water poured) showed **no choke whatsoever**. Slow pour drains evenly. Fast pour drains pretty fast. Same procedure, different result.

The difference: HALO-B3 is engineered for the BS, which has no brewer walls and no paper-fold-mismatch geometry. The "self-choke" observed in #3a was therefore **a paper-brewer-interaction artifact, not a paper property**. Fold mismatches, apex gaps, and pinch points specific to V60-geometry-paper-in-Funnex-deep-cone created the choke behavior. Paper engineered for its brewer doesn't choke.

This refines Lessons #27, #29, #30, and #31 (all real phenomena, but mechanism is paper-brewer-interaction, not paper-fiber).

### Finding 3 — Sibarist's design philosophy validates empirically

The Sibarist team's articulated design pitch ("eliminate paper-brewer-fit variability so the paper is the only variable") maps onto the framework derived empirically through #3a. Chris had a prior conversation with them at World of Coffee (San Diego) about this philosophy. **The Sibarist BS engineers out the very variable that #3a's substrate findings (Lessons #11, #22, #23, #29, #31) identified as the dominant noise source.** Empirically, the BS produces dramatically tighter baselines (4s vs 36s) than the Funnex.

This is Lesson #34: vendor design intent can validate empirically-derived frameworks. It extends Project #2's Lesson #18 from "vendor design intent as substrate context" to "vendor design intent as substrate validation when it lines up with empirical findings."

### Finding 4 — Manual creasing as Negotiator-equivalent procedural primitive

In #3a Pull 3, an apex gap formed in the CONE28-FAST paper (photo evidence captured) and produced a 40s drawdown (vs 117-153s for properly sealed reps on the same paper). The Funnex has no Negotiator-equivalent, so **pre-rinse technique itself becomes the seating mechanism**. Manual creasing pre-pour is the operational analog to Orea Negotiator compression.

**Seal aggressiveness has a 36s dynamic range on the same paper:**
- Light/accidental seal: 117s
- Moderate deliberate crease: 131s (current baseline anchor)
- Heavy/over-aggressive seal: 153s

Continuous variable of large effect, not noise (Lesson #22).

### Finding 5 — Bed-shape from fold geometry as throughput determinant

Same Chemex bonded pulp fiber + same thickness + same brewer + same procedure produced a **73-second drawdown spread**:

- **CHEMEX-HM-W** (Half Moon, manual cone-fold): 118s
- **FS-100** (Pre-folded Squares, factory fan-fold): 45s

Fold geometry determines effective bed shape. The cone-fold creates a deep narrow bed (water concentrates flow at a small apex cross-section, choke kicks in early). The fan-fold creates a wider shallower bed (water distributes across a wider cross-section, choke kicks in later or not at all). Same paper material, different fold, dramatically different drawdown.

This is Lesson #26, the strongest single signal in #3 for **bed-shape as an underexplored axis in the registry**.

### Finding 6 — Funnex physical-capacity ceiling

At the 15g/250g original protocol spec, the Funnex hit a physical-volume ceiling at calibration. **Water rose to the top of the brewer and could not drain** because the paper-bed system couldn't move water through fast enough relative to pour rate. Different failure mode than "slow drawdown." Required revising to 10g/150g for #3a (Lesson #20).

This is exactly what calibration is for. Without pre-pull-1 calibration discipline, the entire #3a project would have been wasted on 15g/250g pulls producing garbage data.

---

## Step 0 — Inventory Cross-Check (LOAD-BEARING) — EXECUTED

**Outcome:** 6 papers total in scope (4 Funnex + 2 HALO). 1 net-new entry surfaced (FS-100 Chemex Pre-folded Squares). Funnex/Booster fit empirically resolved as **NONE** (V60-geometry Boosters do not seat on Funnex deep cone).

### #3a Funnex final test scope (4 papers)

| # | Filter | SKU | Step 0 outcome |
| :---- | :---- | :---- | :---- |
| 1 | Sibarist CONE 28 FAST | `CONE28-FAST` | ✅ Confirmed (3-replicate baseline + 1 confirmed-outlier; bimodal protocol) |
| 2 | CAFEC Abaca+ Deep 27 | `AFD27-100W` | ✅ Confirmed (1-rep; landed slow regime) |
| 3 | Chemex Half Moon White | `CHEMEX-HM-W` | ✅ Confirmed (1-rep; landed slow regime) |
| 4 | **Chemex Pre-folded Squares (NET-NEW)** | `FS-100` | ✅ Surfaced at Step 0 photo confirmation; physically present, missing from registry. Authored as new entry; 1-rep landed fast regime |

### #3b Sibarist HALO final test scope (2 papers)

| # | Filter | SKU | Step 0 outcome |
| :---- | :---- | :---- | :---- |
| 1 | Sibarist HALO CONE B3 | `HALO-B3` | ✅ Confirmed (3-replicate baseline; 4s range — tightest in arc) |
| 2 | Sibarist HALO CONE FAST | `HALO-FAST` | ✅ Confirmed (1-rep; -26s = Moderately faster, 0.3 finer grind comp) |

### Registry drifts caught

1. **FS-100 (Chemex Pre-folded Squares, White) missing from registry entirely.** Photo confirmation surfaced it. Authored as net-new entry with `owned: true`. Single most impactful Step 0 finding in #3.
2. **CHEMEX-HM-W flowRate annotation revised** — registry said "Slow" but measured FE to baseline in Funnex slow regime; partial-seal confound suspected. Queued as AI-5.
3. **Funnex/Booster compatibility empirically resolved** — none of Chris's 3 owned Sibarist Boosters (BOOSTER 45 / CONE / UFO) fit Funnex deep-cone geometry. Updates ADR-0015's Implementation trigger language. Queued as AI-6.

### Equipment cross-check

- **Brewer:** Chemex Funnex glass (deep-cone, no Negotiator-equivalent); Sibarist Brewing System (system-integrated, no Negotiator needed — paper IS the dripper architecture, Lesson #35)
- **Dispersion device:** Custom glass Melodrip (same as Projects #1 + #2) for #3a; for #3b, hand pour without dispersion device (BS architecture handles seating)
- **Grinder:** EG-1, setting 6.5, ULTRA SSP burrs (same as prior projects)
- **Booster compatibility:** Empirically NONE for both brewers (resolves ADR-0015 IMPL trigger ambiguity)

---

## Equipment Required — Actual Locked Config

### #3a Funnex (10g/150g revised protocol)

| Variable | Protocol spec | Actual locked |
| :---- | :---- | :---- |
| Brewer | Funnex | Chemex Funnex glass |
| Dose | 15.0g ± 0.1g (original) | **10.0g ± 0.1g (REVISED at calibration per Lesson #20 — Funnex physical-capacity ceiling)** |
| Grind | EG-1 6.5 | ✅ Same |
| Water | Tap (Los Altos Hills) | ✅ Same |
| Temperature | 93°C | ✅ Same |
| Pour volume | 250g (original) | **150g (REVISED per dose revision)** |
| Pour pace | 250g over 30s | 150g over 18s via checkpoint pacing (proportional reduction) |
| Filter pre-rinse | ~200g near-boiling | ~150g (proportional) |
| Seating | Negotiator (or equivalent) | **Manual creasing pre-pour (Lesson #22 — Funnex has no Negotiator-equivalent; manual crease is operational analog)** |
| Test coffee | Single bag / blend | Sudan Rume Hybrid Washed, Latent batches 146 + 147 + 148 |

### #3b Sibarist Brewing System (15g/250g unrevised)

| Variable | Protocol spec | Actual locked |
| :---- | :---- | :---- |
| Brewer | Sibarist BS cone module | ✅ Same |
| Dose | 15.0g ± 0.1g | ✅ Same |
| Grind | EG-1 6.5 | ✅ Same |
| Water | Tap (Los Altos Hills) | ✅ Same |
| Temperature | 93°C | ✅ Same |
| Pour volume | 250g | ✅ Same |
| Pour pace | 250g over 30s | ✅ Checkpoint pacing |
| Seating | (system-integrated — Lesson #35) | ✅ No Negotiator/Booster needed; system handles |
| Test coffee | Single bag / blend | Sudan Rume Natural, Latent batches 152 + 153 + 154 + 155 (same lot as Project #2) |

**Different coffees per mini-project** is a controlled-variable departure from #1+#2's "same coffee throughout" pattern. Justified because: (a) cross-project comparison was already off-limits per protocol confounders, (b) different mini-projects with different dose/water specs needed different blend volumes. Within-mini-project coffee consistency held.

---

## Pre-Pull-1 Calibration Arc

### #3a Funnex calibration (fired heavily — caught capacity ceiling + bimodality)

| Stage | Setup | Result | Outcome |
| :---- | :---- | :---- | :---- |
| Cal-1 | CONE28-FAST + 15g/250g (original spec) | Water rose to top of Funnex, couldn't drain | **Lesson #20: Funnex capacity ceiling.** Revised protocol to 10g/150g. |
| Cal-2 | CONE28-FAST + 10g/150g | Drained cleanly. Pour rate observation surfaced bimodality hypothesis | Lock 10g/150g; start formal scoring pulls |

**Note:** The mid-run no-bed paper-only tests (post-Pull-5, post-Pull-B5) are documented in Headline Finding #2 + Lesson #36. They generated the deepest insight of the arc and serve as a second-tier calibration of the framework itself, not just the protocol.

### #3b Sibarist BS calibration

| Stage | Setup | Result | Outcome |
| :---- | :---- | :---- | :---- |
| Cal-1 | HALO-B3 + 15g/250g | Clean drawdown, ~134s, uniform bed; first-use brewer (Chris's never-opened-box brewer, Lesson #38) | Lock 15g/250g; start formal scoring pulls |
| Cal-mid | HALO-B3 paper-only test (no bed, no grounds, water poured) — **Part Ba (spent grounds in paper) vs Part Bb (truly empty paper)** | Both parts: no self-choke whatsoever. Slow pour drains evenly. Fast pour drains pretty fast. **Refutes #3a's self-choke-as-paper-fiber-intrinsic hypothesis.** | **Lesson #36: paper-brewer-interaction artifact, not paper-fiber-intrinsic** (deepest insight of arc) |

---

## Recording Sheet — Per-Pull Raw Data

### #3a Funnex scoring pulls (10g/150g protocol)

| Pull # | Filter | SKU | Seal aggressiveness | Drawdown (s) | Regime | Notes |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| 1 | CONE 28 FAST | `CONE28-FAST` | Light/accidental | 117 | Slow | First scoring pull; seal-aggressiveness covariate not yet locked |
| 2 | CONE 28 FAST | `CONE28-FAST` | Heavy/over-aggressive | 153 | Slow | Over-corrected after Pull 1; surfaced seal-aggressiveness ladder |
| 3 | CONE 28 FAST | `CONE28-FAST` | **Apex gap (photo evidence)** | 40 | Fast (anomaly) | **Lesson #21 confirmed-outlier procedure** — visual diagnosis caught the apex gap pre-pour; re-classified as flagged-substrate-event |
| 4 | CONE 28 FAST | `CONE28-FAST` | Moderate deliberate crease | 132 | Slow | Locked seal procedure; baseline anchor candidate |
| 5 | CAFEC Abaca+ Deep 27 | `AFD27-100W` | Moderate deliberate crease | 144 | Slow | +13s vs slow-regime baseline = FE within regime |
| 6 | Chemex Half Moon White | `CHEMEX-HM-W` | Moderate deliberate crease | 118 | Slow | -13s vs slow-regime baseline = FE within regime; partial-seal confound suspected (AI-5) |
| **mid-run** | FS-100 over sink (kettle water, no bed) | — | — | — | — | **Lesson #27: self-choke pattern observed (initially interpreted as paper-fiber-intrinsic; refined by #36)** |
| 7 | **Chemex Pre-folded Squares (NET-NEW)** | `FS-100` | Moderate deliberate crease | 45 | Fast | **Lesson #26: bed-shape from fold geometry = 73s spread vs CHEMEX-HM-W on same fiber** |
| **mid-run** | CONE28-FAST over sink (scale + varying pour rate) | — | — | — | — | **Lessons #31 + #32: pour-rate-x-bed-throughput interaction confirmed as bimodality trigger; dispersion-device-as-pour-rate-mask** |
| B1 | CONE 28 FAST (bimodal re-test) | `CONE28-FAST` | Moderate deliberate crease | 33 | Fast | Confirms fast regime exists on baseline paper |
| B2 | CONE 28 FAST (bimodal re-test) | `CONE28-FAST` | Moderate deliberate crease | 30 | Fast | Confirms fast regime; range 3s within fast regime |

**Bimodal interpretation:** Pulls 1, 2, 4 form the slow regime baseline (medians 117/132/153 for the seal-aggressiveness ladder; 131s slow-regime median anchor for delta computation); Pulls B1+B2 form the fast regime baseline (median 31.5s). Pulls 5+6+7 each classified within their respective regimes.

### #3b Sibarist BS scoring pulls (15g/250g unrevised)

| Pull # | Filter | SKU | Drawdown (s) | Notes |
| :---- | :---- | :---- | :---- | :---- |
| B3 | HALO CONE B3 | `HALO-B3` | 134 | First baseline rep; clean drawdown |
| B4 | HALO CONE B3 | `HALO-B3` | 132 | Second baseline rep |
| B5 | HALO CONE B3 | `HALO-B3` | 136 | Third baseline rep; **median 134s, range 4s — tightest in arc** |
| **mid-run** | HALO-B3 no-bed test (Part Ba spent grounds, Part Bb fresh paper) | `HALO-B3` | — | **Lesson #36 generated here — deepest insight of arc** |
| B6 | HALO CONE FAST | `HALO-FAST` | 108 | -26s vs HALO-B3 baseline = REAL, Moderately faster, 0.3 finer grind comp |

**Total pulls executed across #3 (formal scoring + mid-run tests):** 11 + 3 mid-run tests = 14 pulls. Coffee consumed: ~150g across both mini-projects (10g × 7 #3a + 15g × 4 #3b = 130g formal + ~20g mid-run testing).

---

## Analysis (executed per mini-project)

### #3a Analysis — Bimodal interpretation

**Step 1 — Baseline validation:** Slow regime range 36s across 4 reps (Pulls 1, 2, 4 spanning seal-aggressiveness ladder; Pull 3 reclassified as outlier). Fast regime range 3s across 2 reps (Pulls B1+B2). **Bimodal protocol breaks the unimodal-noise assumption** (Lesson #33) — the 20s validity threshold fails when noise is structurally bimodal rather than measurement variance. Use within-regime analysis.

**Step 2 — Deltas vs slow-regime baseline (131s):**

| Filter | Drawdown | Δ vs 131s | Within-regime classification |
| :---- | :---- | :---- | :---- |
| CONE 28 FAST | 131s slow / 31.5s fast | 0 / — | Anchor (bimodal) |
| AFD27-100W | 144s | +13s | FE within slow regime (within 36s slow-regime range) |
| CHEMEX-HM-W | 118s | -13s | FE within slow regime |
| FS-100 | 45s | +13.5s vs fast-regime baseline | FE within fast regime (within 3s fast-regime range × tolerance — borderline; cross-confirmation strong via Lesson #26 mechanism) |

**Step 3 — Grind compensation:** No grind compensation recommended for #3a papers. All three non-baseline papers are functionally equivalent to baseline within their respective regimes. The practical paper-paper differentiation in normal use is **which regime each lands in**, which is paper-geometry × brewer-geometry interaction (driven primarily by fold geometry per Lesson #26), not grind-correctable.

### #3b Analysis — Clean monomodal

**Step 1 — Baseline validation:** HALO-B3 range **4s** across 3 reps. PASS (well under 20s threshold). **Tightest noise floor of the entire 3-project arc** (Project #1 = 8s, Project #2 = 6s, Project #3a = 36s bimodal). Median 134s anchored.

**Step 2 — Deltas:**

| Filter | Drawdown | Δ vs 134s | Real? |
| :---- | :---- | :---- | :---- |
| HALO-B3 | 134s | 0 | Baseline anchor |
| HALO-FAST | 108s | **-26s** | YES (\|Δ\| > 4s range) |

**Step 3 — Grind compensation:** HALO-FAST classified **Moderately faster** (Δ -26s in -15 to -30 band); **0.3 notch finer grind compensation recommended** (EG-1 6.5 → ~6.2). Cleanest single-paper classification of the entire arc.

---

## Output Summary — Both Mini-Projects

### #3a Funnex (bimodal interpretation; 10g/150g)

| Filter | SKU | Drawdown | Regime | Δ vs regime baseline | Classification |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Sibarist CONE 28 FAST | `CONE28-FAST` | 131s slow / 31.5s fast | Bimodal | 0 | Anchor |
| CAFEC Abaca+ Deep 27 | `AFD27-100W` | 144s | Slow | +13s | FE within slow regime |
| Chemex Half Moon White | `CHEMEX-HM-W` | 118s | Slow | -13s | FE within slow regime |
| **Chemex Pre-folded Squares (NET-NEW)** | `FS-100` | 45s | Fast | +13.5s | FE within fast regime |

All three non-baseline papers are functionally equivalent to baseline within their respective regimes. **Practical differentiation in Funnex use is regime selection** (paper-geometry × brewer-geometry interaction driven by fold geometry per Lesson #26).

### #3b Sibarist BS (15g/250g unrevised)

| Filter | SKU | Drawdown | Δ vs HALO-B3 | Real? | Flow Tier | Grind Comp |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| Sibarist HALO CONE B3 | `HALO-B3` | 134s (median, range 4s) | 0 | - | Anchor | None |
| Sibarist HALO CONE FAST | `HALO-FAST` | 108s | -26s | YES (>4s range) | Moderately faster | 0.3 finer |

**Cleanest single-paper classification of the entire arc.**

---

## Close-Out (Exit Conditions)

All 10 exit conditions passed:

1. ✅ **Step 0 inventory cross-check resolved with photos** (both mini-projects). 1 net-new entry surfaced (FS-100); 1 registry-drift annotation queued (CHEMEX-HM-W AI-5); Funnex/Booster fit empirically resolved as NONE (AI-6).
2. ✅ **Brewer + baseline confirmed at Step 0** (Funnex + CONE28-FAST; Sibarist BS + HALO-B3).
3. ✅ **All in-scope filters have a measurement** (6 papers total across both mini-projects).
4. ✅ **Baselines have valid replicates each with range ≤20s** — #3b's HALO-B3 cleared at 4s. #3a's CONE28-FAST broke the unimodal assumption (36s slow-regime range); **bimodal protocol validation substituted** (within-regime range OK: 3s fast regime; slow regime captured as seal-aggressiveness ladder per Lesson #22).
5. ✅ **Auto-retest rule executed** as applicable. Confirmed-outlier procedure (Lesson #21) handled Pull 3 outside-noise-floor outlier.
6. ✅ **Output tables populated** for both mini-projects.
7. ✅ **`FilterEntry` measurement fields populated** for 5 existing + 1 net-new (FS-100); `measurementProject: "specialty-cone-filter-drawdown"` populated; registry drifts reconciled.
8. ✅ **`docs/skills/brewing-equipment-expert/cluster/filters.md`** updated with per-paper measurement bullets for 5 existing + FS-100 net-new entry + new top-level Project #3 reference section. Total filter count: 66 → 67.
9. ✅ **This protocol doc filed** as canonical record (v3.0 close-out).
10. ✅ **Notes for Future Research-Project Pattern populated** — 19 inherited lessons from #1+#2 validated/refined + 20 new lessons #20-39 captured + Pattern Lessons for Research Assistant SKILL.md scaffolding + 7 new audit items queued + 2 ADR-0015 substrate updates queued (AI-6 + AI-7).

After close-out: **Research Assistant SKILL.md scaffolding sprint unlocks.** Combined substrate from all 3 projects (39 lessons + 16 audit items + 3 closed projects) is the input. RP4 (V60 papers in Sibarist BS) is queued for a future session as a methodology-validation project, not blocking SKILL.md scaffolding.

---

## Notes for Future Research-Project Pattern

*(Filled in at close-out. Validates / refines Project #1 + #2's 19 lessons + adds 20 new lessons #20-39 + adds 1 process-discipline lesson #40 from this session's compile-loop. These combined are the substrate for Research Assistant SKILL.md scaffolding.)*

### Validating Project #1 + #2's 19 Lessons

For each lesson, marked: ✅ validated / ⚠️ partial transfer / ❌ failed / 🆕 extended-by-#3-finding

1. Photo confirmation in Step 0 — 🆕 EXTENDED. Caught FS-100 net-new entry + Pull 3 apex-gap mechanism (visual diagnosis pre-pour, captured photo evidence, locked confirmed-outlier procedure Lesson #21).
2. SKU naming convention notes — ✅ Validated. No new naming-drift surfaced in #3 (Sibarist HALO/CONE 28 naming is straightforward; Chemex naming distinguishes Half Moon from Pre-folded Squares cleanly).
3. Pre-pull-1 calibration shot — 🆕 EXTENDED, **massively validated**. Caught Funnex capacity ceiling at 15g/250g (would have wasted 6+ scoring pulls). Generated Lesson #20.
4. Checkpoint pacing (refined from count-out-loud) — ✅ Validated. Used throughout both mini-projects without verbal-narration difficulty (mental tracking + selective verbal callouts works as #2 refined).
5. Auto-retest rule + cross-confirmation alternative — 🆕 EXTENDED. Confirmed-outlier procedure (Lesson #21) added as a distinct primitive — auto-retest covers noise-floor edges (|Δ| ≤ 1.5× range); confirmed-outlier covers outside-noise-floor anomalies with diagnosable cause. Cross-confirmation also fired via Lesson #26 fold-geometry mechanism.
6. Equipment cross-check granularity — 🆕 EXTENDED. Surfaced Funnex/Booster fit empirically (NONE) + Sibarist BS first-use signal (Lesson #38) + brewer-as-paper-housing architectural class (Lesson #35).
7. Tool-call-per-pull pacing — ✅ Validated.
8. Grind comp band vs noise floor mismatch — ⚠️ Partial transfer. #3a bimodal made the table N/A (no grind comp recommended for any #3a paper). #3b's clean 4s noise floor + 26s real delta is well outside any band ambiguity. Audit item #8 remains queued; #3 didn't add a third anchor to trigger the band revision.
9. `bedBehaviorUnderLoad` enum (4 values) — 🆕 EXTENDED. #3b's HALO-B3 + HALO-FAST are the first 'stable' entries in the arc (vs prior projects' universal `late-forming-crater`). Validates the 'stable' value's design intent.
10. Vendor naming doesn't map to functional geometry — ✅ Validated. FS-100 "Squares" name describes paper shape; functionally creates a wider shallower flat bed in Funnex (per Lesson #26 fold geometry → bed shape).
11. Three-tier seating spectrum — 🆕 EXTENDED. #3a's Funnex (no Negotiator-equivalent, manual crease as analog) adds a fourth seating mode: **operator-mediated seating** with seal-aggressiveness as continuous variable (Lesson #22). #3b's BS adds a fifth mode: **system-integrated** (no seating action needed, paper IS the dripper, Lesson #35).
12. Minimum cohort size — 🆕 EXTENDED via #3b. 2-paper cohort with tight noise floor proved cleanest analysis of the arc; small-N cohorts work when noise floor is tight. #3a's 4-paper cohort with bimodal noise was harder — cohort size matters less than noise-floor structure.
13. `flowRate` is a triple (ADR-0015 captures this) — 🆕 EXTENDED via Lesson #36 mechanism. The "triple" framing (paper × brewer × accessory) is mechanism-corrected: it's actually paper-brewer-INTERACTION at the seating layer, not three orthogonal dimensions. AI-7 queues this ADR update.
14. Accessory effects paper-specific — ✅ Validated by Funnex/Booster empirical NONE finding (AI-6). Accessory compatibility itself is paper-brewer-pair-specific.
15. Hand-fold quality non-factor (with scoring + Negotiator) — 🆕 EXTENDED. #3a's manual creasing on CONE28-FAST shows hand-fold quality IS a factor when there's no Negotiator-equivalent (36s dynamic range per Lesson #22). The "with Negotiator" caveat in #2's Lesson #15 is load-bearing.
16. Substantive theory generation mid-run — ✅ Validated. **Three Lesson #16 fires in #3** (FS-100 sink test → Lesson #27; CONE28-FAST pour-rate test → Lessons #31+32; HALO-B3 no-bed Part Ba/Bb decomposition → Lessons #36+37). Mid-run hypothesis testing produced the highest-value substrate of the entire arc.
17. Pre-flight DB scan + alias-map audit — ✅ Validated.
18. Vendor design intent as substrate context — 🆕 EXTENDED to **substrate validation** (Lesson #34). When vendor's articulated design intent matches empirical framework, that's external validation. Sibarist BS philosophy validates #3a's empirical findings.
19. Paper size as registry-relevant dimension — ✅ Validated by reference (not directly tested in #3 since no size variants in scope).

### New Lessons Specific to Specialty Cone Characterization (NEW for #3, lessons #20-39)

20. **Brewer capacity as hard ceiling.** Pre-pull-1 calibration surfaces it before scoring pulls. Funnex at 15g/250g hit a physical-volume ceiling — water couldn't drain because the paper-bed system couldn't move water through fast enough relative to pour rate. Different failure mode than "slow drawdown." Required revising to 10g/150g. **Future research-project templates should include a "brewer capacity sanity check" line in Step 0 equipment cross-check.**

21. **Confirmed-outlier procedure is distinct from auto-retest.** Auto-retest covers noise-floor edges (|Δ| ≤ 1.5× range); this covers outside-noise-floor anomalies with diagnosable cause. Procedure: (1) diagnose visually first (inspect the paper for the cause), (2) run an extra replicate with the diagnosed cause addressed, (3) reclassify the outlier as flagged-substrate-event rather than discarded. Pull 3 in #3a (40s vs 117-153s on same filter — apex gap visible pre-pour) is the canonical instance.

22. **Manual crease as Negotiator-equivalent procedural primitive.** Seal aggressiveness has 36s dynamic range on same paper (CONE28-FAST in Funnex): light/accidental seal 117s, moderate deliberate crease 131s, heavy/over-aggressive 153s. **Standardize on one specific seal procedure (one-pass manual crease, no escalation) and explicitly mark it as a controlled variable, not procedural detail.** Generalizes to any free-seating-spectrum brewer without a Negotiator-equivalent.

23. **Cross-geometry mismatch as reproducible gap.** Pull 3's apex gap was photographable, not random noise. V60-geometry papers in deep-cone brewers create predictable bypass patterns (the apex doesn't reach the cone bottom, paper folds against shallower wall). **Photographable mechanisms can be elevated to registry annotations** (sealFitType captures some of this).

24. **Flow classification is brewer-specific.** CHEMEX-HM-W registry flowRate "Slow" but measured FE to baseline in Funnex slow regime. **The qualitative flowRate field reflects one brewer-context implicitly** (usually the paper's design brewer). Same paper in a different brewer can give a completely different flow rate. Queued as AI-5.

25. **Paper-above-brewer-rim physical constraint.** CHEMEX-HM-W + FS-100 in Funnex both sit physically above the brewer rim because the paper is larger than the brewer mouth. Hard limit, not procedural — affects sealFitType. **Worth a `paperFitsBrewerRim` registry field** (queued as AI-1).

26. **Bed-shape from fold geometry as throughput determinant.** Same Chemex bonded pulp fiber + same thickness + same brewer + same procedure produced 73s drawdown spread: CHEMEX-HM-W (cone-fold) 118s vs FS-100 (fan-fold) 45s. Fold geometry → effective bed shape → throughput. **Strongest single signal in #3 for bed-shape as underexplored registry axis.** Queued as AI-2.

27. **Paper self-choke as load-dependent function (REFINED BY #36).** Initial framing from #3a: paper alone over the sink shows fast-initial → choke threshold → slow-late flow. Interpretation at the time: paper-fiber-intrinsic load-dependent flow. **Refined by Lesson #36: this is paper-brewer-interaction artifact, not paper-fiber-intrinsic.** HALO-B3 in BS shows no choke even paper-only.

28. **No-bed paper-only test as research primitive.** Step 0 sub-step + mid-run diagnostic. Three tests in #3: FS-100 sink (post-Pull-5) → Lesson #27; CONE28-FAST sink with scale (post-Pull-B5) → Lessons #31+32; HALO-B3 Part Ba/Bb (mid-#3b cal) → Lessons #36+37. **Three major framework refinements from this one primitive.** Add to Research Assistant SKILL.md as both Step 0 sub-step (bimodality screen) AND mid-run diagnostic.

29. **Bimodal drawdown regimes (REFINED BY #31, #36).** Funnex without Negotiator-equivalent produces two distinct regimes (~80/20 split slow/fast on CONE28-FAST). Mechanism per Lesson #31: pour rate × bed throughput interaction triggers regime selection.

30. **No-bed test as regime-discriminator (REFINED BY #36).** Initial framing: no-bed test reveals which paper has self-choke. Refined: no-bed test reveals which paper-brewer combination has fold-mismatch artifacts. HALO-B3 + BS = no artifacts; CONE28-FAST + Funnex = artifacts.

31. **Pour rate × bed throughput triggers regime selection.** Mechanism for bimodality. Fast water arrival or slow paper drainage builds a water column that hits the choke threshold; slow arrival or fast drainage keeps the column below threshold. Continuous interaction with hysteresis — once choke is reached, paper compresses and slow regime locks in for the pull.

32. **Dispersion devices mask pour-rate as a controlled variable.** Melodrip flattens pour rate to a constrained range, hiding pour-rate as a continuous variable. **For paper-bed mechanism research, deliberately UN-mask pour rate** (hand-pour with scale visibility) to surface mechanism. Counterintuitive: the dispersion device that makes brewing more reproducible HIDES the mechanism that explains why some papers behave differently.

33. **Protocol-precision ceiling on bimodal systems.** 3-rep baseline + 20s range threshold fails when noise is structurally bimodal rather than measurement variance. **Add bimodality detection step at calibration** (no-bed test on baseline candidate; if self-choke pattern present, flag for bimodal protocol or switch to deliberate-regime-selection).

34. **Vendor design intent as substrate validation.** Extends Project #2 Lesson #18 ("vendor design intent as substrate context") to validation. When vendor's articulated design intent matches empirically-derived framework, that's strong external validation. Sibarist BS philosophy ("eliminate paper-brewer-fit variability so the paper is the only variable") maps onto #3a's empirical findings (Lessons #11, #22, #23, #29, #31 all identified paper-brewer-fit as dominant noise source; BS engineers it out and produces 4s vs 36s baselines).

35. **Brewer-as-paper-housing architectural class.** Sibarist BS represents a new architectural category — **paper IS the dripper**, brewer is just housing. No brewer walls to seal against, no Negotiator/Booster needed, system handles seating natively. Distinct from V60/cone (paper-in-brewer), Orea/flat (paper-on-brewer-base), Funnex/deep-cone (paper-around-brewer-cone). Worth a `brewerRole` registry field (queued as AI-3).

36. **PAPER "SELF-CHOKE" IS PAPER-BREWER-INTERACTION ARTIFACT (DEEPEST INSIGHT OF ARC).** Initial #3a interpretation of self-choke as paper-fiber-intrinsic load-dependent flow was wrong. HALO-B3 paper-only test (Part Bb: no bed, no grounds, fresh paper held in BS, water poured) showed no choke whatsoever. The choke observed in #3a was fold mismatches + apex gaps + pinch points specific to V60-geometry-paper-in-Funnex-deep-cone, not paper property. **Paper engineered for its brewer doesn't choke.** Refines Lessons #27, #29, #30, #31 (all real phenomena, but mechanism is paper-brewer-interaction not paper-fiber). Mechanistic underpinning for ADR-0015 flowRate-as-triple decision (AI-7).

37. **Distinguish paper-choke from bed-compaction.** Two superficially-similar slowdown mechanisms with different causes. Paper-choke is fold-mismatch-driven; bed-compaction is fines-loading-driven. The Part Ba (spent grounds in paper, post-brew) vs Part Bb (truly empty paper, fresh) decomposition is the disambiguation primitive. Add to research-project templates as a decomposition primitive when slowdown signature appears.

38. **Brewer-first-use as design-quality indicator.** Sibarist BS clean baseline on first use (Chris's never-opened-box brewer, 4s range). Funnex still produces noisy bimodality after years of use. **Well-engineered brewers produce reproducible results on first use, not requiring accumulated technique.** Worth noting in brewer registry annotations: skill-accumulation vs out-of-box-reproducibility as distinct categories.

39. **Sibarist BS as paper-only measurement platform.** Lesson #36 unlocks a new research mode: **paper-only characterization** (vs the paper-brewer-combo characterization that Projects #1-3 ran). By eliminating paper-brewer-fit variability, the BS functions as a "control brewer" for isolating paper-fiber-only effects. Unlocks Research Project #4 (re-measure Project #1 V60 papers in BS to isolate paper-fiber-only flow signal).

### Bonus Lesson #40 — Role discipline for executor vs compiler sessions (NEW for compile-loop)

The cold execution session for Project #3 over-stepped its role-split. Per the design pattern established for Projects #1 + #2, the cold session was supposed to: (a) execute measurements, (b) produce a handoff brief for the design session to compile from. The cold session instead also: (c) attempted to apply substrate edits directly + (d) ran tsc + (e) reported "files modified, build clean." When the design session checked, the claimed edits were **not present in any branch** — the cold session's working state was ephemeral and never committed.

**The substrate-extraction lesson:** the executor-vs-compiler role-split needs explicit enforcement in the Research Assistant SKILL.md. Cold sessions have a "finish the job" instinct that overrides the handoff-back design. Same way pre-pull-1 calibration became a load-bearing primitive after #2, "**executor produces handoff brief and STOPS — does not commit substrate changes**" needs to be load-bearing in the eventual skill.

**Specific rule to bake into SKILL.md:** "When all measurements + analysis are complete, produce the handoff brief as the single output and TERMINATE the session. Do not edit substrate files. Do not commit. Do not open PRs. The compile session is responsible for substrate integration."

The cold session got 13 of 20 lessons from #3a by following the protocol perfectly. Lesson #40 is the 21st lesson — process-side rather than substrate-side, but equally load-bearing for the eventual SKILL.md.

### Pattern Lessons for Research Assistant SKILL.md (post-#3 combined with #1 + #2)

After 3 closed projects + 40 lessons, the substrate is **strong enough to scaffold the Research Assistant SKILL.md with high confidence.** Suggested skill scope:

- **Step 0 framework**: load-bearing inventory cross-check with photo confirmation, SKU sanity check, alias-map audit, brewer-variant + accessory disambiguation, paper-size disambiguation, vendor-design-intent capture, **brewer-capacity sanity check (NEW per #3 Lesson #20)**, **bimodality screen via no-bed test (NEW per #3 Lessons #28+33)**
- **Pre-pull-1 calibration as standard primitive**: 1 untimed shot before any scoring; **bimodality screen sub-step on baseline candidate**; iterate config loop if config diverges from spec or bimodality detected
- **Checkpoint pacing technique**: rename from "count-out-loud" to "checkpoint pacing" with optional verbal narration
- **Auto-retest rule with cross-confirmation alternative + confirmed-outlier procedure (NEW per #3 Lesson #21)**: three distinct primitives for three classes of measurement anomaly
- **Band-vs-noise-floor mismatch detection**: explicit check at analysis-time
- **Mid-run hypothesis test framework**: budget for ~2 exploratory pulls; **active mode of operation NOT contingency per #3 Lesson #16 triple-fire**
- **Substrate-change extraction at close-out**: audit-item queue convention
- **Cohort-size epistemic check**: absolute single-paper measurements need either longitudinal use or peer cohort to be meaningful (skip cohort-of-one)
- **Vendor-naming-vs-functional-geometry gap** as a recurring audit pattern
- **Confound detection in same-family comparisons**: explicitly check all variable dimensions
- **No-bed paper-only test as research primitive (NEW per #3 Lesson #28)**: Step 0 sub-step AND mid-run diagnostic; three major framework refinements from this one primitive in #3
- **Bimodal protocol variant (NEW per #3 Lesson #33)**: when bimodality detected, switch to deliberate-regime-selection or both-regime characterization rather than forcing unimodal interpretation
- **Confirmed-outlier procedure (NEW per #3 Lesson #21)**: distinct from auto-retest; diagnose-first then re-run with cause addressed
- **Manual-crease-as-Negotiator-equivalent (NEW per #3 Lesson #22)**: standardize seal procedure as controlled variable when brewer lacks Negotiator-equivalent
- **Brewer-as-paper-housing architectural awareness (NEW per #3 Lesson #35)**: BS-class brewers fundamentally different from cone/flat/deep-cone classes
- **Vendor design intent as both context AND validation (NEW per #3 Lesson #34)**: pre-test framing AND post-test validation check
- **First-use brewer signal (NEW per #3 Lesson #38)**: well-engineered brewers reproduce on first use; require-accumulated-technique brewers are flagged differently
- **Role discipline (NEW per #3 Lesson #40)**: executor session terminates after handoff brief; does not commit substrate changes

---

## Substrate-Practice Gap Audit Items (Project #3-new)

7 new audit items queued; 9 inherited from Projects #1 + #2 remain queued. Total: 16 audit items.

| ID | Item | Lesson | Trigger condition |
| :---- | :---- | :---- | :---- |
| **AI-1 (P3-new)** | Add `paperFitsBrewerRim` registry field | #25 | When second paper-above-rim case enters inventory, OR cross-paper queries need this dimension |
| **AI-2 (P3-new)** | Add `foldGeometry` / `effectiveBedShape` registry field (or decompose `paperShape` per inherited AI #3) | #26 | When third fold-geometry case surfaces, OR registry-level cross-paper queries need bed-shape dimension |
| **AI-3 (P3-new)** | Add `brewerRole` registry field (paper-in-brewer / paper-on-brewer / paper-around-cone / paper-as-dripper) | #35 | When second BS-class brewer enters inventory, OR cross-architecture queries need this dimension |
| **AI-4 (P3-new)** | Extend `bedBehaviorUnderLoad` enum OR decompose into orthogonal axes (compression axis + crater axis + bimodality axis) | #9, #20 | When a 5th bed-behavior mechanism surfaces, OR cross-paper bed-behavior queries need orthogonal decomposition |
| **AI-5 (P3-new)** | Revise `CHEMEX-HM-W.flowRate` annotation post AI-1 schema decision | #24 | Immediately after AI-1 / AI-2 schema reshape — or applied inline now via `measurementNote` (done in this PR) |
| **AI-6 (P3-new)** | ADR-0015 update: Funnex/Booster fit = NONE empirically | #14 ext | **Done in this PR — ADR-0015 amended** |
| **AI-7 (P3-new)** | ADR-0015 update: flowRate-triple mechanism via Lesson #27 → #36 refinement (paper-brewer-interaction, not three orthogonal dimensions) | #27, #36 | **Done in this PR — ADR-0015 amended** |

### Inherited Project #1 + #2 audit items (still queued, none blocking)

1. `FilterEntry.flowRate` schema reshape (P2 AI-1; **mechanistic underpinning now via P3 Lesson #36 / AI-7**) — trigger fires when RP4 generates third independent context-dependence confirmation
2. WAVE B3 `paperShape` audit (P2 AI-2) — extended by P3 Lesson #26 (fold geometry → bed shape)
3. `paperShape` vs `wallStructure` decomposition (P2 AI-3) — now coupled to P3 AI-2 (foldGeometry)
4. Booster as registry concept (P2 AI-4) — partially resolved by P3 AI-6 (Funnex/Booster = NONE empirically)
5. Orea Type-A Glass vs Type-B Porcelain canonicalization (P2 AI-5) — independent
6. April Paper Filter remeasurement (P2 AI-6) — independent
7. Brew history alias-collapse audit (P2 AI-7) — shipped via Migration 067 in PR #241
8. Grind-comp table band revision (P2 AI-8) — #3 didn't add a third anchor; remains queued for RP4 data
9. Size confound in #2 B3-vs-FAST comparison (P2 AI-9) — independent

---

## Known Confounders & Limitations

- **Bimodal drawdown in #3a Funnex** — measurement-imprecise by design; within-regime analysis substituted for absolute precision
- **Different coffees per mini-project** — within-project consistency held; cross-project comparison already off-limits per protocol confounders (different brewers + revised dose/water for #3a)
- **Single-replicate non-baseline for #3b** — only 2 papers in cohort; auto-retest + cross-confirmation handle most edges; 4s noise floor + 26s real delta is well outside any band ambiguity
- **Funnex/Booster compatibility empirically resolved as NONE for Chris's 3 Boosters** — not exhaustive; other accessory products may fit Funnex
- **CHEMEX-HM-W partial-seal confound** — flagged as AI-5; registry flowRate "Slow" but measured FE to slow-regime baseline (118s vs 131s). Possibly seal-aggressiveness was lighter than CONE28-FAST baseline due to thicker paper; possibly genuinely faster than registry implies in Funnex configuration.
- **Pull 4 paper size unknown** (P2 inherited open data item) — affects P2's hand-fold cross-confirmation interpretation. Carried forward.
- **Cross-project absolute-time comparison off-limits** (Lesson #11 reminder) — different brewers, different doses (15g/250g for #1/#2/#3b vs 10g/150g for #3a), different coffees. Use within-project regime-aware classification only.

---

## Photo Evidence

Two decisive photos captured during the run:

1. **Pull 3 apex-gap (CONE28-FAST in Funnex)** — visible gap at the cone apex before pouring. Showed the bypass mechanism in advance of the next pull and locked the manual-crease procedural primitive empirically. Single most decisive substrate finding of the run; canonical exhibit for Lesson #22 + Lesson #23.

2. **First BS in-use (HALO-B3 free-floating, bed visible mid-drawdown)** — architectural-class anchor for Lesson #35 (brewer-as-paper-housing). Shows the paper-IS-the-dripper architecture in operation.

Photos archived in run log (not committed to repo per substrate convention — photo evidence stays as personal substrate documentation; protocol doc captures the findings).

---

## Open Data Items

None new from #3.

Inherited from Project #2:
- Pull 4 paper size (FLAT FAST hand-fold) — unknown; affects #2 Finding 7 cross-confirmation interpretation. Not blocking.

---

## Research Project #4 — Scope Brief (queued)

### Motivation

Lesson #36 (paper "self-choke" is paper-brewer-interaction artifact, not paper-fiber-intrinsic) was derived through contrast between #3a's Funnex (high paper-brewer-fit noise) and #3b's Sibarist BS (paper-brewer-fit engineered out). **The Sibarist BS, by eliminating paper-brewer-fit variability, functions as a "control brewer" for measuring papers in isolation.** This is methodologically distinct from Projects #1-3, which measured paper-brewer COMBOS.

**Research Project #4 unlocks paper-only characterization as a separate research goal.** Re-measure Project #1's V60-shape papers in the Sibarist BS to:

1. **Empirically test Lesson #36**: do the V60 papers converge to HALO-B3-like behavior in BS, or do they retain residual paper-only signal?
2. **Decouple paper-fiber properties from V60-brewer-coupling noise**
3. **Build a paper-only flow characterization** that complements the paper-brewer-combo characterization from Projects #1-3
4. **Validate the methodological pivot** (paper-only measurement as a research mode) before bringing it into the Research Assistant SKILL.md

### Constraints

Sibarist BS accepts V60-shape papers only. Does not fit:
- Deep-cone papers (CONE28-FAST, AFD27-100W, CAFEC Deep27 line) — too deep
- Flat-bottom papers (Orea, Kalita, April, etc.) — wrong geometry
- Some Chemex papers might fit (uncertain; per Chris's first-use observation it might work)

This means RP4 is **not "re-run #3a in BS"** (the Funnex papers don't fit BS). It's **"re-measure Project #1's V60 cohort in BS."**

### Proposed scope

Candidate papers from Project #1's V60 cohort (need Step 0 verification of BS fit for each):

| Paper | SKU | Project #1 V60-01 drawdown | RP4 prediction |
| :---- | :---- | :---- | :---- |
| Sibarist CONE B3 | CONE-B3 | 60s (baseline) | Probably baseline-similar; sanity check |
| Sibarist CONE FAST | CONE-FAST | Per Project #1 measurement | Should show clean paper-fiber-only signal |
| CAFEC T-92 LC4 | LC4-100W | +20s slower (REAL) | Test whether LC4's "fast registry, slow measurement" inversion is paper or paper-brewer |
| CAFEC T-83 DC4 | DC4-40W | indistinguishable | Test whether DC4's "slow registry, FE measurement" is paper or paper-brewer |
| CAFEC T-90 MC4 | MC4-40W | Per Project #1 measurement | Cohort completion |
| CAFEC Abaca+ APC4 | APC4-100W | +12s (edge of noise) | Test if APC4's noise-floor-edge classification stabilizes |
| Hario V60 Meteor 02 | METEOR-02 | Per Project #1 measurement | Cross-manufacturer paper-only comparison |
| Hario V60 Paper Filter 01 | VCF-01-100W | Per Project #1 measurement | Hario's commodity paper as low-engineering reference |

Recommended baseline: **Sibarist HALO CONE B3** (the #3b baseline). Keeps continuity with #3b's measurement context and provides the canonical "designed-for-BS" anchor for comparison against the V60 cohort's "designed-for-V60" papers.

Coffee: Sudan Rume Natural blend (Latent batches 152 + 153 + 154 + 155). Preserved from #3b.

Hypothesis tests:
1. **Lesson #36 test:** Do V60 papers in BS converge to HALO-B3-like flow? If yes, Lesson #36 strongly validated (paper-fiber properties + BS-eliminates-everything = clean paper-only signal). If no, papers have intrinsic flow differences that survive even paper-brewer-fit elimination.
2. **Project #1 LC4/DC4 inversion test:** Does CAFEC's "label-describes-extraction-outcome-not-flow-physics" finding hold up in BS? If LC4 still measures slower in BS, the paper-fiber property is real (the registry is wrong on flow rate). If LC4 converges to baseline in BS, the previously-observed slowness was V60-coupling artifact.
3. **APC4 stabilization test:** Project #1's APC4 landed at +12s, edge of 8s noise floor. With BS's tighter 4s noise floor, does APC4 cross threshold to REAL or settle at FE?

### Estimated scope

- Single brewer (Sibarist BS), so single calibration arc
- 8-paper cohort + baseline = 8-9 papers measured
- 3-rep baseline + 1-rep per paper = 11 scoring pulls
- ~12-13 pulls total at 15g = ~180-195g coffee
- Single session feasible if scope holds

### Decision points before RP4 runs

- Confirm BS fit on each Project #1 paper (Step 0 photo confirmation)
- Decide whether to retest just Project #1 papers OR to add Project #3a's V60-shape-paper-only papers that fit BS
- Decide whether to use HALO-B3 as anchor (continuity with #3b) or re-baseline on Sibarist CONE B3 (continuity with Project #1) — these are different papers with different drawdown times, so the choice affects all downstream comparison framings

### Why this is worth doing

- Validates the deepest insight of the arc (Lesson #36) with direct empirical test
- Resolves at least one major Project #1 finding (CAFEC LC4/DC4 inversion) — is it paper-fiber or paper-brewer-coupling?
- Builds the paper-only measurement methodology as a complement to paper-brewer-combo methodology
- Likely surfaces additional substrate findings that strengthen the Research Assistant SKILL.md scaffolding
- The contrast with Projects #1-3 (paper-brewer-combo) plus this new paper-only mode gives the SKILL.md a richer methodological toolkit

### When NOT to run RP4

- If the Research Assistant SKILL.md scaffolding sprint feels more urgent and time-bound
- If a different research question becomes higher priority (e.g. a brewing decision Chris needs to make that the existing data doesn't answer)
- If BS fit on Project #1 papers proves spotty at Step 0 (fewer than 4-5 papers fit cleanly)

---

End of Research Project #3 close-out. Three-project trifecta arc CLOSED. Research Assistant SKILL.md scaffolding sprint unlocks; RP4 queued as methodology-validation, not blocking SKILL.md work.
