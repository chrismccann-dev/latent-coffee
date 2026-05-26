# Paper-Only V60 Cohort Drawdown Re-Measurement in Sibarist BS (Research Project #4)

*Coffee Research · Latent · Research Project*

**Version:** 1.0
**Date drafted:** 2026-05-25
**Status:** Draft (awaiting execution)
**Methodology validation project** — empirically tests Lesson #36 (paper "self-choke" is paper-brewer-interaction artifact, not paper-fiber-intrinsic)
**Home EG-1**

---

## ⚠️ LOAD-BEARING ROLE-DISCIPLINE RULE (Lesson #40, Project #3 substrate)

**This protocol has a non-negotiable role split. Read this BEFORE Step 0.**

Your job (execution session) is **execution + handoff brief production.** Your job is **NOT substrate integration.**

**DO NOT:**
- Edit `lib/filter-registry.ts`
- Edit `docs/skills/brewing-equipment-expert/cluster/filters.md`
- Edit ADR files
- Run `git commit`, `git push`, or `gh pr create`
- Apply "what changed" file edits as part of close-out
- Run `npx tsc --noEmit` against substrate edits (you won't be making any)

**DO:**
- Walk Chris through Step 0 (physical-photo inventory + BS-fit verification + bimodality screen)
- Run pre-pull-1 calibration shot + iterate config if needed
- Generate randomized pull sequence; guide Chris through scoring pulls one-at-a-time (Lesson #7 tool-call-per-pull pacing)
- Apply auto-retest rule (Lesson #5), confirmed-outlier procedure (Lesson #21), or cross-confirmation alternative as appropriate
- Capture friction + new lessons + audit items in this protocol doc's Notes section (the doc IS the archive — Lesson #12 from Project #2's pattern: protocol-doc-as-canonical-record)
- Produce a handoff brief at the end (same shape as Project #1 / #2 / #3 close-out briefs) for the compile session to integrate into substrate
- **TERMINATE the session after the handoff brief.** Do not continue to "finish the job" by attempting commits.

**Why this rule exists:** Project #3's cold execution session over-stepped its role-split — attempted registry edits + ran tsc + reported "files modified, build clean" without committing. When the compile session checked, the claimed edits were not present in any branch (working state was ephemeral and lost). The compile session had to re-do all substrate integration from the handoff brief. Lesson #40 is the substrate-extraction lesson from that failure mode.

**The compile session is responsible for substrate integration.** That's the design pattern; honor it.

---

## Project Context

This is **Research Project #4** — methodology-validation project that runs after the 3-project trifecta arc (cone Project #1 / flat Project #2 / specialty cone Project #3) closed 2026-05-25. RP4 is **NOT a fourth characterization project** in the trifecta sense; it's a **methodological pivot** that tests whether the Sibarist Brewing System architecture truly eliminates paper-brewer-fit variability (per Lesson #36).

| Project | Methodology | Brewer | Status |
| :---- | :---- | :---- | :---- |
| #1 - Cone Filter Drawdown | Paper-brewer-combo | Hario V60 Glass (V60-01) | ✅ CLOSED 2026-05-23 |
| #2 - Flat-bottom Filter Drawdown | Paper-brewer-combo | Orea Type-A + Negotiator | ✅ CLOSED 2026-05-24 |
| #3 - Specialty Cone Filter Drawdown | Paper-brewer-combo (2 sub-projects) | Funnex + Sibarist BS | ✅ CLOSED 2026-05-25 |
| **#4 - Paper-Only V60 Cohort Re-Measurement (this doc)** | **Paper-ONLY** | **Sibarist Brewing System** (only brewer) | Draft (awaiting execution) |

**Why this matters:** Projects #1-3 measured paper-BREWER COMBOS. Lesson #36 (deepest insight of the arc) suggests that paper-brewer-fit dominates many of the apparent paper-fiber differences. If true, the Sibarist BS — which architecturally eliminates paper-brewer-fit variability — should make papers measured in it converge toward paper-fiber-only signal. RP4 tests this empirically by re-measuring Project #1's V60 cohort in the BS instead of in their native V60 brewer.

**Closes the substrate input for Research Assistant SKILL.md scaffolding** (which technically unlocked post-Project #3; RP4 sharpens with paper-only methodology evidence before scaffolding).

---

## Substrate-Extraction Lessons Inherited from #1 + #2 + #3 (40 total)

All baked into this v1.0 protocol. For each, anticipate transferability:

### Projects #1 + #2 lessons (1-19) — all validated through #3
1. Photo confirmation in Step 0 — load-bearing, required
2. SKU naming convention notes in Step 0 — applies to V60 cohort (CAFEC LC1/LC4 still a watch-pattern)
3. Pre-pull-1 calibration shot — required (per Project #3 Lesson #20 also: brewer capacity sanity check)
4. Checkpoint pacing (refined from count-out-loud) — required
5. Auto-retest rule + cross-confirmation alternative — required
6. Equipment cross-check granularity — required
7. Tool-call-per-pull pacing — required
8. Grind comp band vs noise floor mismatch — watch (RP4 likely tightens noise floor further given BS architecture)
9. `bedBehaviorUnderLoad` enum — should see 'stable' values mostly (BS architecture per #3 HALO measurements)
10. Vendor naming doesn't map to functional geometry — watch
11. Three-tier seating spectrum (extended to 5-tier by #3 — adds operator-mediated + system-integrated) — BS is system-integrated mode
12. Minimum cohort size — 8-paper cohort is the largest of any project; well above minimum
13. flowRate is a triple (mechanism refined to paper-brewer-INTERACTION via Lesson #36) — RP4 directly tests this mechanism
14. Accessory effects paper-specific — N/A for RP4 (no Boosters fit BS per AI-6)
15. Hand-fold quality non-factor with scoring + Negotiator — N/A for RP4 (BS is system-integrated, no manual creasing needed)
16. Substantive theory generation mid-run — required; budget for ~2 exploratory pulls
17. Pre-flight DB scan + alias-map audit — required
18. Vendor design intent as substrate context — Sibarist BS philosophy applies; per #3 Lesson #34 also use post-test as validation
19. Paper size as registry-relevant dimension — N/A for RP4 (V60-01 papers tested; Project #1 already covered V60-02)

### Project #3 lessons (20-39) — directly applicable to RP4
20. Brewer capacity as hard ceiling — pre-pull-1 calibration sanity check (BS-specific capacity to verify)
21. Confirmed-outlier procedure (distinct from auto-retest) — required as third primitive
22. Manual crease as Negotiator-equivalent — N/A for RP4 (BS is system-integrated)
23. Cross-geometry mismatch as reproducible gap — Step 0 watch (V60-shape papers may have fit issues in BS — first-time-in-BS use)
24. Flow classification is brewer-specific — directly tested by RP4
25. Paper-above-brewer-rim physical constraint — Step 0 verification needed for V60 papers in BS
26. Bed-shape from fold geometry as throughput determinant — observe per paper
27. Paper self-choke as load-dependent function (REFINED by #36) — directly tested by RP4
28. No-bed paper-only test as research primitive — required at calibration (run on baseline candidate)
29. Bimodal drawdown regimes (REFINED by #31, #36) — bimodality screen at calibration
30. No-bed test as regime-discriminator (REFINED by #36) — required
31. Pour rate × bed throughput triggers regime selection — watch
32. Dispersion devices mask pour-rate as controlled variable — BS hand-pour may surface this
33. Protocol-precision ceiling on bimodal systems — switch to bimodal protocol if detected at calibration
34. Vendor design intent as substrate validation — apply post-test (Sibarist's "paper as control variable" philosophy)
35. Brewer-as-paper-housing architectural class — BS is THIS class; substrate context
36. **PAPER "SELF-CHOKE" IS PAPER-BREWER-INTERACTION ARTIFACT (DEEPEST INSIGHT OF ARC)** — RP4 directly tests via cohort
37. Distinguish paper-choke from bed-compaction — required disambiguation primitive
38. Brewer-first-use as design-quality indicator — BS first-use was clean in #3b; RP4 is second use, should remain clean
39. Sibarist BS as paper-only measurement platform — RP4 IS the validation of this lesson
40. Role discipline for executor vs compiler sessions — see top of this doc; non-negotiable

---

## Hypothesis Tests (explicit per Lesson #16 active-mode framing)

RP4 has three pre-stated hypothesis tests. Make these explicit in the recording sheet's "predicted outcomes" column BEFORE running scoring pulls — per Lesson #16 (substantive theory generation happens mid-run, not pre-protocol), pre-stating predictions makes the post-test diagnosis cleaner.

### Hypothesis Test 1 — Lesson #36 validation

**Question:** Do V60-cohort papers in Sibarist BS converge to HALO-B3-like flow rate, or do they retain residual paper-only signal?

**Predicted outcomes:**
- **If YES (convergence):** Lesson #36 strongly validated. Paper-brewer-fit was dominant variable; eliminating it (via BS architecture) collapses paper differences. V60 papers all measure within HALO-B3's 4s noise floor in BS, despite measuring at 60s-80s in their native V60 with 8s noise floor.
- **If NO (residual signal):** Papers have intrinsic flow differences that survive even paper-brewer-fit elimination. Lesson #36 partially refined — paper-brewer-INTERACTION is dominant but not exclusive variable.
- **If MIXED (some converge, some don't):** Most interesting outcome. Identify which papers converge vs which retain signal; that's a sub-finding about which papers were "paper-brewer-interaction artifact" vs "real paper-fiber signal" in their Project #1 measurements.

### Hypothesis Test 2 — Project #1 LC4/DC4 inversion resolution

**Question:** Does CAFEC's "label-describes-extraction-outcome-not-flow-physics" finding (Project #1 Headline Finding #1) hold up in BS?

Project #1 measured:
- LC4 (light roast, registry "Fast"): **+20s SLOWER** than CONE B3 (REAL) — inverted from registry direction
- DC4 (dark roast, registry "Slow"): **+7-8s** (indistinguishable from baseline) — also inverted

**Predicted outcomes in BS:**
- **If LC4 still measures slower in BS:** the paper-fiber property is real (registry IS wrong on flow rate for this paper family; Cafec's label describes extraction outcome not flow physics — Project #1's conclusion holds).
- **If LC4 converges to baseline in BS:** the previously-observed slowness was V60-coupling artifact (paper-brewer-interaction per Lesson #36); registry's "Fast" label may actually be paper-fiber-accurate.
- **DC4 outcome should mirror LC4 directionally** if Cafec's design philosophy is consistent across the family.

### Hypothesis Test 3 — APC4 noise-floor-edge stabilization

**Question:** Project #1's APC4 landed at +12s, edge of 8s noise floor. With BS's tighter 4s noise floor, does APC4 cross threshold to REAL or settle at FE?

**Predicted outcomes:**
- **If APC4 measures REAL in BS:** the noise-floor-edge classification in Project #1 was on the cusp; tighter noise floor disambiguates.
- **If APC4 measures FE in BS:** the previously-observed +12s was paper-brewer-interaction noise; paper-fiber-only signal is closer to baseline than Project #1 suggested.

---

## Scope

**Single brewer:** Sibarist Brewing System (cone module, system-integrated; the brewer Project #3b validated as paper-only measurement platform per Lesson #39).

**Single calibration arc:** unlike Project #3 which needed two (one per brewer), RP4 uses one brewer so one pre-pull-1 calibration shot suffices (plus mid-run no-bed test per Lesson #28).

**Coffee continuity:** Sudan Rume Natural blend (Latent batches 152 + 153 + 154 + 155) preserved from Project #3b. ~180-195g needed (12-13 pulls × 15g). Confirm sufficient stock at Step 0.

**Cohort:** 8-paper V60 cohort from Project #1, IF all 8 fit the Sibarist BS at Step 0. Likely some won't fit cleanly; expect cohort to shrink at Step 0 verification.

**Baseline decision (resolve at Step 0):** Two viable options, each with merit. Resolve based on Chris's preference at execution time:
- **Option A: Sibarist HALO CONE B3** (`HALO-B3`) — keeps continuity with #3b's measurement context (134s baseline, 4s range, tightest in arc). Native BS paper; ideal "designed-for-this-brewer" anchor. **My recommendation** for continuity with #3b's tight noise floor.
- **Option B: Sibarist CONE B3** (`CONE-B3`) — keeps continuity with Project #1's measurement context (60s baseline in V60). V60-shape paper; if it fits BS at Step 0, baseline-similar comparison directly answers Hypothesis Test 1.

Trade-off: Option A gives a cleaner native-BS anchor but cross-baseline comparison to Project #1's V60 measurements requires translation. Option B gives direct V60-to-V60 cross-baseline comparison but assumes CONE-B3 fits BS cleanly (not yet verified).

---

## Step 0 — Inventory Cross-Check (LOAD-BEARING)

**Photo confirmation required per Lesson #1.** Multiple new sub-steps for RP4:

### Sub-step 1: Verify BS fit per V60 cohort paper

Sibarist BS accepts V60-shape papers. Per Lesson #25, also verify paper sits within (not above) BS rim. Starting list from Project #1 cohort:

| # | Paper | SKU | Project #1 V60-01 drawdown | BS-fit prediction |
| :---- | :---- | :---- | :---- | :---- |
| 1 | Sibarist CONE B3 | `CONE-B3` | 60s (Project #1 baseline) | Probably fits (Sibarist sibling paper to HALO-B3); test for baseline-similarity |
| 2 | Sibarist CONE FAST | `CONE-FAST` | 45s (REAL faster) | Probably fits (same Sibarist family); paper-fiber-only signal test |
| 3 | CAFEC T-92 LC4 | `LC4-100W` | 80s (REAL slower, +20s) | Verify BS fit; **Hypothesis Test 2 paper** |
| 4 | CAFEC Abaca APC4 | `APC4-40W` | 72s (REAL slower, +12s noise-floor-edge) | Verify BS fit; **Hypothesis Test 3 paper** |
| 5 | Hario V60 Meteor 02 | `METEOR-02` | 65s (indistinguishable) | Cross-manufacturer paper-only comparison |
| 6 | Hario VCF-01 Tabbed | `VCF-01-100W` | 65s (indistinguishable) | Hario's commodity paper as low-engineering reference |
| 7 | CAFEC Cup 4 Medium Roast | `MC4-100W` | 60s (indistinguishable, assortment-owned) | Cohort completion |
| 8 | CAFEC Cup 4 Dark Roast | `DC4-100W` | 68s (indistinguishable, assortment-owned) | **Hypothesis Test 2 partner paper** (DC4 vs LC4 inversion) |

**Cohort may shrink at Step 0.** Document which papers don't fit BS in the Step 0 outcome. Per Project #1 Lesson #25 + #3's paper-above-rim findings, BS may not accept all 8. Per Chris's first-use observation at #3, "some Chemex papers might fit (uncertain)" — same uncertainty applies to V60 cohort. Expect maybe 4-6 papers in scope after Step 0.

### Sub-step 2: Baseline confirmation (per § Scope decision above)

Recommended: HALO-B3 (Option A) for continuity with #3b. Resolve with Chris at Step 0.

### Sub-step 3: Brewer capacity sanity check (per Lesson #20)

Run a quick 250g water pour through the BS with the baseline paper (no bed) — confirm BS can handle the 15g/250g protocol without capacity ceiling. Funnex hit a ceiling at the same dose in Project #3a; BS architecture is different (paper IS the dripper) but verify empirically.

### Sub-step 4: Bimodality screen via no-bed test (per Lessons #28, #33)

**REQUIRED Step 0 sub-step.** Run a no-bed paper-only test on the chosen baseline paper:
- Insert paper in BS, no coffee, no bed
- Pour water at protocol pace (250g over 30s via checkpoint pacing)
- Observe: does paper show self-choke pattern (fast-initial → choke threshold → slow-late)?

**Outcomes:**
- **No choke observed:** confirms BS architecture eliminates paper-brewer-fit artifacts (Lesson #36 + #39 validation). Proceed with standard unimodal protocol.
- **Choke observed:** flag for bimodal protocol or deliberate-regime-selection. UNEXPECTED outcome given #3b's HALO-B3 showed no choke; if it appears here, it's a sub-finding worth its own lesson.

This sub-step is the methodological validation of RP4's premise. If bimodality screen fails (choke appears), Lesson #36 is partially refined and RP4's findings need to be interpreted with that caveat.

### Sub-step 5: Equipment cross-check (granularity per Lesson #6)

- Brewer: Sibarist Brewing System (cone module) — confirm exact model
- Grinder: EG-1 setting 6.5, ULTRA SSP burrs (same as #1-3)
- Scale: 0.1g resolution
- Kettle: stable temp hold at 93°C
- Dispersion: per BS architecture, hand-pour likely sufficient — no Melodrip needed (system handles seating). Note any deviation.

### Sub-step 6: SKU drift sanity (per Lesson #2)

Cross-check that V60 cohort papers in the drawer match what's in the registry post-Project #3 close-out. Specifically:
- LC4-100W (CAFEC T-92 Cup 4 Light Roast V60-02 — Project #1 measured)
- DC4-100W (CAFEC Cup 4 Dark Roast V60-02 — Project #1 measured, owned via assortment)
- MC4-100W (CAFEC Cup 4 Medium Roast V60-02 — Project #1 measured, owned via assortment)
- APC4-40W (CAFEC Abaca+ Cup 4 V60-02 — Project #1 measured, both 40-pack assortment + 100-pack standalone owned)

Confirm no MC1/DC1/LC1/APC1 confusion (Cup 1 V60-01 variants which were Project #1 + #3 prep PR drift findings — Chris does not own).

---

## Equipment Required

- Sibarist Brewing System (cone module)
- EG-1 grinder, setting 6.5, ULTRA SSP burrs
- Scale (0.1g resolution)
- Kettle stable at 93°C
- Hand-pour technique (no Melodrip needed per BS system-integrated architecture; note if needed empirically)
- Timer
- Test coffee: ~200g Sudan Rume Natural blend (Latent batches 152+153+154+155) preserved from #3b
- Filters to test: output of Step 0 sub-step 1 verification (anticipate 4-6 from 8-paper cohort)
- Camera (Step 0 photo confirmation)

---

## Controlled Variables

| Variable | Setting |
| :---- | :---- |
| **Brewer** | Sibarist Brewing System (cone module) — single brewer throughout |
| **Dose** | 15.0g ± 0.1g (assumes BS capacity sanity check at Step 0 sub-step 3 passes) |
| **Grind** | EG-1 6.5 (center of Clarity-First range; purge 2-3g between batches) |
| **Water** | Tap water (Los Altos Hills) |
| **Temperature** | 93°C, kettle on base throughout |
| **Filter pre-rinse** | ~200g near-boiling, discard rinse water, dump server |
| **Pour structure** | Single continuous pour, 250g over 30s via checkpoint pacing (mental tracking + selective verbal callouts per Lesson #4 refined) |
| **Agitation** | None |
| **Seating mechanism** | NONE (BS system-integrated, paper IS the dripper per Lesson #35; no Negotiator, no Booster, no manual crease) |
| **Coffee** | Sudan Rume Natural blend continuity from #3b throughout |
| **Endpoint criterion** | Specular → diffuse reflection transition |

---

## Sample Size — Tiered Design (carryover from #1-3)

- **Baseline: 3 replicates** of chosen baseline (HALO-B3 recommended)
- **Each V60 cohort paper: 1 replicate**
- **Auto-retest rule (Lesson #5):** any single-rep |Δ| ≤ 1.5× baseline range triggers 2nd pull
- **Cross-confirmation alternative:** if two same-fiber-family papers (e.g. CONE-B3 + CONE-FAST both Sibarist FAST) land within noise floor of each other, cross-confirmation substitutes for retest
- **Confirmed-outlier procedure (Lesson #21):** if a pull lands far outside noise floor with diagnosable cause (visible apex gap, fold mismatch, etc.), diagnose visually first then re-run with cause addressed

**Coffee budget (for 8-paper cohort scenario):**
- 3 baseline pulls + 8 non-baseline pulls + 1-2 auto-retest buffer = 12-13 pulls × 15g = **180-195g**
- Single bag covers it with buffer

**For shrunk-cohort scenarios** (likely 4-6 papers after Step 0): 7-9 pulls × 15g = ~105-135g.

**Pull ordering:** randomize; do NOT run baseline 3 replicates back-to-back. Mix through sequence so technique drift averages across baseline. Example for 8-paper scenario:

`HALO-B3 → CONE-B3 → LC4 → HALO-B3 → APC4 → CONE-FAST → DC4 → HALO-B3 → METEOR-02 → VCF-01 → MC4`

---

## Method

### Pre-Pull-1 Calibration

Run separately at Step 0 sub-step 4 (bimodality screen via no-bed test). If that screen passes (no choke observed), the calibration is essentially complete — BS architecture is unimodal per #3b precedent. Confirm pour pace lands ~30s at 250g; iterate config if not.

If bimodality screen FAILS (choke observed unexpectedly), STOP — do not proceed to scoring pulls. Flag as a UNEXPECTED outcome and discuss with Chris before continuing. This would refine Lesson #36 — proceed only after Chris confirms protocol adjustments.

### Per-Pull Procedure (same as Projects #2 + #3)

1. Place BS on scale with empty server. Tare.
2. Insert filter (no Negotiator/Booster — BS is system-integrated).
3. Pre-rinse ~200g near-boiling. Discard. Dump server. Tare.
4. Add 15.0g pre-ground coffee. Level bed gently.
5. Confirm kettle 93°C.
6. Start timer. Hand-pour with checkpoint pacing (50/100/150/200/250g at 6s intervals; mental tracking + selective verbal callouts).
7. When scale reads 250g, stop pouring. Note pour-end time.
8. Observe bed. Drawdown complete = specular → diffuse reflection transition.
9. Stop timer. Record total time + observations (channeling, fines migration, bed mechanism).
10. Dump bed. Rinse BS. Next pull per randomized sequence.

### Hypothesis Test Observations (per Lesson #16 active mode)

Before each non-baseline pull, log the pre-stated prediction from the relevant Hypothesis Test (1, 2, or 3 — see § Hypothesis Tests above). After the pull, log the actual result + the diagnosis (matches prediction / diverges from prediction / generates new sub-finding).

If a pull surfaces a new hypothesis that wasn't pre-stated (per Lesson #16 mid-run hypothesis test framework), run an explicit mid-run test before continuing the formal sequence. Budget ~2 exploratory pulls beyond formal protocol.

---

## Recording Sheet

### Step 0 Calibration

- BS fit per paper (sub-step 1):
  - CONE-B3:
  - CONE-FAST:
  - LC4-100W:
  - APC4-40W:
  - METEOR-02:
  - VCF-01-100W:
  - MC4-100W:
  - DC4-100W:
- Baseline confirmed (sub-step 2):
- Brewer capacity sanity check (sub-step 3):
- Bimodality screen — no-bed test outcome (sub-step 4):
- Equipment cross-check (sub-step 5):
- SKU drift sanity (sub-step 6):

### Baseline (3 replicates of [HALO-B3 or chosen baseline])

| Filter | Pull 1 (s) | Pull 2 (s) | Pull 3 (s) | Median (s) | Range (s) | Notes |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| [Baseline] |  |  |  |  |  |  |

### V60 Cohort (1 replicate each; auto-retest if needed)

For each paper, log: pull # / pre-stated hypothesis-test prediction / actual drawdown / Δ vs baseline / diagnosis (matches / diverges / new sub-finding).

| Pull # | Filter | SKU | Hypothesis Test pre-stated prediction | Pull (s) | Δ vs baseline | Auto-retest? | Retest pull (s) | Diagnosis |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
|  | CONE-B3 |  | (Test 1: convergence expected per Lesson #36) |  |  |  |  |  |
|  | CONE-FAST |  | (Test 1: convergence expected per Lesson #36) |  |  |  |  |  |
|  | LC4-100W |  | (Test 2: tests whether +20s P1 slowness is paper or paper-brewer-coupling) |  |  |  |  |  |
|  | APC4-40W |  | (Test 3: tests whether +12s P1 edge crosses 4s BS noise floor) |  |  |  |  |  |
|  | METEOR-02 |  | (Test 1: convergence expected) |  |  |  |  |  |
|  | VCF-01-100W |  | (Test 1: convergence expected; low-engineering reference) |  |  |  |  |  |
|  | MC4-100W |  | (Test 1: cohort completion) |  |  |  |  |  |
|  | DC4-100W |  | (Test 2 partner: tests whether DC4 inversion in P1 holds in BS) |  |  |  |  |  |

### Test Coffee Composition

- Sudan Rume Natural, Latent batches 152 + 153 + 154 + 155 (preserved from Project #3b)
- Blend midpoint Agtron:
- Grind batch date/time:

### Mid-Run Hypothesis Tests (if any fire)

| # | Pre-stated hypothesis | Test setup | Observation | Conclusion / new lesson |
| :---- | :---- | :---- | :---- | :---- |
|  |  |  |  |  |

---

## Analysis (steps inherited from #1-3)

### Step 1 — Validate Baseline

Check spread (max − min = range) of 3 baseline pulls. If range > 20s, re-run baseline. Tight noise floor expected per #3b precedent (4s for HALO-B3 in BS).

### Step 2 — Compute Deltas

`Δ = filter X measurement − baseline median`. Real/indistinguishable rule: `|Δ| > baseline range` = real; `|Δ| ≤ baseline range` = indistinguishable.

### Step 3 — Cross-Project Comparison Caveat (per Lesson #11)

**RP4 is a paper-only methodology project; cross-project comparison to Project #1's V60 measurements is the WHOLE POINT but must be done with explicit caveats:**

- Different brewer (BS vs V60 Glass) — Lesson #36 framing says this is the key variable being tested
- Different baseline (HALO-B3 vs CONE-B3) — translation required if Option A baseline chosen
- Same coffee continuity not guaranteed (Sudan Rume Natural batches 152-155 in RP4 vs Project #1's blend) — different lot, different roast batches
- Different paper-bed interactions (BS architecture vs V60 Glass) — that's exactly what's being measured

**Cross-project comparison method:** for each paper, compare RP4 Δ vs baseline (BS) against Project #1 Δ vs baseline (V60). The DIFFERENCE in deltas (not the absolute drawdowns) is the paper-only signal vs paper-brewer-fit signal.

Example: If CONE-B3 measures at baseline in both projects (Δ = 0 in V60 + Δ = 0 in BS), nothing learned (it's the baseline). If LC4 measures +20s in V60 (Project #1) but +0s in BS (RP4), then the +20s in V60 was paper-brewer-interaction artifact — Lesson #36 strongly validated for LC4 specifically.

### Step 4 — Hypothesis Test Resolution

For each of the 3 pre-stated hypothesis tests (§ Hypothesis Tests), record the resolution:
- Lesson #36 test outcome: convergence / residual signal / mixed (see Test 1 predictions)
- LC4/DC4 inversion test outcome: holds / doesn't hold / mixed (see Test 2 predictions)
- APC4 stabilization test outcome: REAL / FE / inconclusive (see Test 3 predictions)

---

## Output (filled in at close-out)

### Per-Paper Drawdown Table

| Filter | SKU | RP4 Drawdown in BS | Δ vs RP4 baseline | Project #1 Drawdown in V60 | Project #1 Δ vs V60 baseline | Δ-in-deltas (paper-only signal) | Hypothesis Test resolution |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| [Baseline] |  | (baseline) | 0 | (P1 baseline) | 0 | — | — |
| CONE-B3 |  |  |  | 60s | 0 |  |  |
| CONE-FAST |  |  |  | 45s | -15 to -16 |  |  |
| LC4-100W |  |  |  | 80s | +20 |  |  |
| APC4-40W |  |  |  | 72s | +12 |  |  |
| METEOR-02 |  |  |  | 65s | +5 |  |  |
| VCF-01-100W |  |  |  | 65s | +5 |  |  |
| MC4-100W |  |  |  | 60s | 0 |  |  |
| DC4-100W |  |  |  | 68s | +7-8 |  |  |

### Hypothesis Test Resolution Summary

| Test | Outcome | Lesson #36 implication |
| :---- | :---- | :---- |
| 1 — Lesson #36 convergence test |  |  |
| 2 — LC4/DC4 inversion resolution |  |  |
| 3 — APC4 stabilization |  |  |

### Methodology Validation Verdict

**Did paper-only measurement methodology validate as a research mode?**
- (To be filled at close-out)
- Implications for Research Assistant SKILL.md scaffolding:
- Implications for `flowRateContexts` schema implementation (per ADR-0015 + Project #3 AI-7):

---

## Close-Out (Exit Conditions)

Project #4 closes when ALL of these pass:

1. ✅ **Step 0 inventory cross-check resolved with photos** — BS fit verified per paper; cohort scope locked
2. ✅ **Baseline confirmed at Step 0** (HALO-B3 or chosen alternative)
3. ✅ **Brewer capacity sanity check passed** (or dose/water revised per Lesson #20)
4. ✅ **Bimodality screen passed** (no choke observed; if choke surfaces, escalate to Chris)
5. ✅ **All in-scope V60 papers measured** OR explicit "couldn't test / didn't fit BS" note
6. ✅ **Baseline 3 replicates with range ≤20s**
7. ✅ **Auto-retest rule executed** as applicable; confirmed-outlier procedure as applicable
8. ✅ **Output summary table populated** with cross-project Δ-in-deltas analysis
9. ✅ **3 hypothesis tests resolved** with outcomes + Lesson #36 implications
10. ✅ **Methodology validation verdict recorded** — paper-only methodology validates / partially validates / fails
11. ✅ **This protocol doc filed** with full data populated
12. ✅ **Handoff brief produced** for compile session — same shape as Project #1 / #2 / #3 close-out briefs

**After all 12 pass: TERMINATE the execution session.** Do not commit substrate. Do not edit registry. Do not open PRs. The compile session handles substrate integration. (Lesson #40, restated.)

---

## Known Confounders & Limitations (inherited + RP4-specific)

- **Inherited from #1-3:** loaded-bed flow (not clean-water), paper lot variability, bed geometry by dose, temperature drift, single-replicate non-baseline edge handling, vendor naming vs functional geometry
- **RP4-specific:** cross-project comparison to Project #1 is the whole point but must be done with caveats — different brewer, possibly different baseline, possibly different coffee lot. The Δ-in-deltas analysis isolates paper-only signal from paper-brewer-fit signal under Lesson #36 framing
- **Cohort may shrink at Step 0** — V60-shape papers may not all fit BS; document as Step 0 finding
- **Bimodality screen at Step 0 is the methodological validation gate** — if it fails (choke appears on baseline paper in BS), RP4's premise is partially refined and findings need careful interpretation
- **Sudan Rume Natural blend continuity** — same coffee as #3b but a different lot from Project #1's blend; within-project consistency held, cross-project absolute comparison off-limits

---

## Notes for Future Research-Project Pattern (fill in at close-out)

### Validating the 40 inherited lessons

For each, mark: ✅ validated / ⚠️ partial / ❌ failed / 🆕 extended / 〰️ N/A for RP4

(Fill in during/after run.)

### NEW lessons specific to paper-only methodology (if any)

(Capture during run — possible candidates: paper-only methodology as substrate, BS-fit verification as Step 0 sub-step, hypothesis-test pre-stating as analysis discipline, Δ-in-deltas analysis as cross-project method...)

### Pattern Lessons for Research Assistant SKILL.md (post-RP4 combined with #1-3)

(Fill in at close-out — these will be the FINAL substrate refinement for the SKILL.md scaffolding sprint.)

### Methodology validation verdict for paper-only research mode

(See § Output § Methodology Validation Verdict.)

---

## Substrate-Practice Gap Audit Items (queued; track new ones during run)

Inherited from Projects #1 + #2 + #3: 16 audit items (none blocking). RP4 may surface new ones during execution — capture in this Notes section + flag in handoff brief.

Potentially RP4-resolved audit items:
- **P2 AI-1** (FilterEntry.flowRate schema reshape) — RP4 generates the third independent context-dependence confirmation per the trigger condition; ADR-0015 implementation can fire after RP4 closes
- **P2 AI-8** (Grind-comp table band revision) — RP4 may add third anchor inside hypothetical ±10s tier
- **P3 AI-4** (`bedBehaviorUnderLoad` enum extension) — RP4 may surface new bed mechanisms specific to BS architecture; tighter noise floor may surface subtle 'stable' variants
- **P3 AI-7** (flowRate-triple mechanism refined via #36) — RP4 IS the empirical test of this refinement

---

## After RP4 Closes — Recap Map

**Per Chris (Project #3 close-out conversation):**
> "after that we will call it done. then we can do a total recap after this and see what else if anything i need to do with either the filter specific stuff or research assistant arc."

The compile session (after RP4 close-out) should produce a **filter-arc total recap** covering:
- Trifecta + RP4 substrate state (lessons, audit items, papers measured, cohort coverage)
- Outstanding filter-specific work (audit items remaining; April Paper Filter remeasurement scoping; matched-size FLAT 2 pair; etc.)
- Research Assistant SKILL.md scaffolding sprint readiness (combined substrate from 4 projects; trigger conditions; suggested scaffolding scope)
- Anything else worth surfacing before "calling it done"

This recap is the compile session's final RP4 output — not the execution session's. Execution session terminates after handoff brief per Lesson #40.

---

End of Research Project #4 v1.0 draft. Methodology-validation project; awaiting cold-session execution with strict role-discipline enforcement per Lesson #40.
