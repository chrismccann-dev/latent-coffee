# Paper-Only V60 Cohort Drawdown Re-Measurement in Sibarist BS (Research Project #4)

*Coffee Research · Latent · Research Project*

**Version:** 1.0
**Date drafted:** 2026-05-25
**Date executed:** 2026-05-26
**Status:** ✅ EXECUTED — handoff brief at end of doc; compile session integrates substrate
**Methodology validation project** — empirically tests Lesson #36 (paper "self-choke" is paper-brewer-interaction artifact, not paper-fiber-intrinsic)
**Methodology verdict:** ✅ VALIDATES — paper-only measurement is a real research mode; Lesson #36 PARTIALLY refined to family-conditional
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

### Step 0 Calibration (executed 2026-05-26)

- BS fit per paper (sub-step 1):
  - CONE-B3: ✅ Fits cleanly
  - CONE-FAST: ❌ Does not fit — small size variant owned; BS needs larger. **Cohort dropped 8 → 7.**
  - LC4-100W: ✅ Fits cleanly (loaded behavior: buckles without V60 support — see RP4-N1)
  - APC4-40W: ✅ Fits cleanly (loaded behavior: buckles same as LC4)
  - METEOR-02: ⚠️ Fits with caveat — sits well above BS rim; paper edge close to middle cylinder of BS but NOT contacting
  - VCF-01-100W: ✅ Fits cleanly (loaded behavior: buckles + bed asymmetric/egg-shape — see RP4-N1 + RP4-N6)
  - MC4-100W: ✅ Fits cleanly (loaded behavior: less buckling than other CAFEC)
  - DC4-100W: ✅ Fits cleanly (loaded behavior: buckles same as other CAFEC)
- Baseline confirmed (sub-step 2): **HALO-B3** (Option A, recommended per #3b continuity)
- Brewer capacity sanity check (sub-step 3): ✅ PASSED — no rim backup at 250g/30s pour during pull #1 (loaded) or no-bed test
- Bimodality screen — no-bed test outcome (sub-step 4): ✅ PASSED — no choke, continuous drainage, ~40s total drain time; **methodological gate cleared**
- Equipment cross-check (sub-step 5): ✅ EG-1 6.5 ULTRA SSP confirmed; BS cone module; scale 0.1g; kettle 93°C
- SKU drift sanity (sub-step 6): ✅ Cup 4 V60-02 variants confirmed via fit-state inference ("bigger size variants" since smaller is Cup 1 V60-01). **Friction note:** answered via inference rather than explicit packaging-label check; acceptable given prior drift resolution but worth tightening protocol wording in future RPs.

### Baseline (3 replicates of HALO-B3)

| Filter | Pull 1 (s) | Pull 2 (s) | Pull 3 (s) | Median (s) | Range (s) | Notes |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| HALO-B3 | 90 | 91 | 94 | **91** | **4** | Range matches #3b's 4s noise floor precedent exactly. **Absolute baseline (91s) differs from protocol's #3b reference of 134s by 43s — flagged for compile-session audit.** Bed pattern uniform across all 3: V60-shape crater, stable, no channeling. |

### V60 Cohort (1 replicate each; auto-retest if needed)

For each paper, log: pull # / pre-stated hypothesis-test prediction / actual drawdown / Δ vs baseline / diagnosis (matches / diverges / new sub-finding).

| Pull # | Filter | SKU | Hypothesis Test pre-stated prediction | Pull (s) | Δ vs baseline | Auto-retest? | Retest pull (s) | Diagnosis |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| 4 | CONE-B3 | CONE-B3 | Test 1 convergence (87-95s) | 92 | +1 | Cross-confirm via HALO-B3 baseline (Sibarist family) | — | ✅ Prediction holds; cleanest Test 1 anchor (Δ-in-deltas +1, well within both contexts' noise floors) |
| 5 | LC4 (T-92) | LC4-100W | Test 2 (paper-fiber vs V60-coupling); P1 +20 | 107 | **+16 REAL slow** | NO (\|Δ\| > 1.5× noise floor) | — | ✅ Paper-fiber-real dominant; Δ-in-deltas -4 (small V60-coupling component, ~80% of P1 slowness persists). P1 Headline #1 HOLDS. **Paper buckled under load without V60 dripper support** (RP4-N1). |
| 6 | METEOR-02 | METEOR-02 | Test 1 convergence (87-95s); above-rim caveat | 93 | +2 | Deferred → resolved by VCF-01 cross-confirm | — | ✅ Prediction holds; above-rim seating non-impacting on drawdown (Lesson #36 + #39 strengthened) |
| 7 | APC4 | APC4-40W | Test 3 stabilization; P1 +12 noise-floor edge | 108 | **+17 STRONGLY REAL** | NO | — | ✅ APC4 stabilizes REAL; tighter noise floor disambiguates. Δ-in-deltas +5 (paper-fiber slowness was MASKED in V60). Same buckling pattern as LC4. |
| 8 | DC4 (T-83) | DC4-100W | Test 2 partner; P1 +7-8 indistinguishable | 110 | **+19 REAL slow** | NO | — | ✅ **Major reveal:** DC4's hidden slowness exposed (Δ-in-deltas +11). Test 2 reinforced — CAFEC family is uniformly paper-fiber-slow. Same buckling pattern. |
| 9 | VCF-01 | VCF-01-100W | Test 1 convergence; cross-confirm partner for METEOR-02 | 95 | +4 (edge) | Cross-confirm via METEOR-02 (both Hario family, within noise floor of each other) | — | ✅ Prediction holds at edge; resolves METEOR-02 retest deferral. **Egg-shape bed asymmetry observed but no flow-rate impact (RP4-N6).** Buckled like CAFEC papers but still baseline. |
| 10 | MC4 (T-90) | MC4-100W | Test 1 / cohort completion; P1 0 (P1 baseline-equivalent) | 98 | **+7 REAL slow (modest)** | NO (\|Δ\| > 1.5× noise floor); coffee exhausted regardless | — | ✅ Third CAFEC noise-floor reveal (Δ-in-deltas +7); CAFEC family slow pattern confirmed at 3-of-4 sample. Slightly less buckling than other CAFEC. |

**CONE-FAST dropped at Step 0 — small size variant owned, BS needs larger.** Cohort 8 → 7 papers.

### Test Coffee Composition

- Sudan Rume Natural, Latent batches 152 + 153 + 154 + 155 (preserved from Project #3b)
- Blend midpoint Agtron: not recorded
- Grind batch date/time: 2026-05-26 execution day
- **Final coffee used:** ~150g across 10 pulls (3 baseline + 7 cohort × 15g). MC4 (pull #10) used the last available coffee — no auto-retest budget remaining post-pull-10.

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
| HALO-B3 (baseline) | HALO-B3 | **91s** (90/91/94, range 4) | 0 | (not measured in P1) | — | — | — |
| CONE-B3 | CONE-B3 | 92s | +1 indistinguishable | 60s | 0 (P1 baseline) | +1 | ✅ Test 1 cleanest anchor — tracks baseline both contexts |
| CONE-FAST | CONE-FAST | NOT TESTED — small size variant doesn't fit BS | — | 45s | -15 to -16 | — | (excluded from RP4) |
| LC4-100W (T-92) | LC4-100W | 107s | **+16 REAL slow** | 80s | +20 (REAL) | -4 | ✅ Test 2 — paper-fiber-real dominant; P1 conclusion HOLDS |
| APC4-40W | APC4-40W | 108s | **+17 STRONGLY REAL** | 72s | +12 (REAL edge) | +5 | ✅ Test 3 — stabilizes REAL; tighter floor reveals masked slowness |
| METEOR-02 | METEOR-02 | 93s | +2 indistinguishable | 65s | +5 (indistinguishable) | -3 | ✅ Test 1 — tracks baseline; above-rim seating non-impacting |
| VCF-01-100W | VCF-01-100W | 95s | +4 indistinguishable (edge) | 65s | +5 (indistinguishable) | -1 | ✅ Test 1 — tracks baseline; cross-confirm METEOR-02 |
| MC4-100W (T-90) | MC4-100W | 98s | **+7 REAL slow (modest)** | 60s | 0 (P1 baseline-equiv) | +7 | ✅ Test 1 reveal — CAFEC family slow pattern at 3-of-4 sample |
| DC4-100W (T-83) | DC4-100W | 110s | **+19 REAL slow** | 68s | +7-8 (indistinguishable) | +11 | ✅ Test 2 partner — major reveal; CAFEC family uniformly slow |

**Pattern:** Non-CAFEC papers (3): all indistinguishable in BOTH contexts, Δ-in-deltas cluster -3 to +1 (mean -1). CAFEC papers (4): all REAL slow in RP4 BS, Δ-in-deltas -4 to +11. **Family-conditional Lesson #36 finding.**

### Hypothesis Test Resolution Summary

| Test | Outcome | Lesson #36 implication |
| :---- | :---- | :---- |
| 1 — Lesson #36 convergence test | **MIXED** (most informative outcome per protocol). 3 non-CAFEC papers converged; 4 CAFEC papers retained REAL slow signal. | **Lesson #36 PARTIALLY VALIDATED + REFINED** — paper-brewer-interaction is dominant for paper families with weak fiber signal (Hario/Sibarist), but paper-fiber signal dominates for paper families engineered with strong fiber-treatment differentiation (CAFEC). **Family-conditional, not universal.** |
| 2 — LC4/DC4 inversion resolution | **HOLDS AND REINFORCED.** Both LC4 (+16) and DC4 (+19) REAL slow in BS. DC4's P1 indistinguishable reading was noise-floor-hidden true slowness. | CAFEC Cup 4 family is uniformly paper-fiber-slow. **Project #1 Headline #1 conclusion HOLDS and extends to T-83/T-90/T-92 + Abaca APC4.** Registry labels = extraction-engineering semantics, NOT flow-rate semantics. |
| 3 — APC4 stabilization | **STRONGLY REAL.** Δ +17 in BS vs P1 +12 edge. Tighter noise floor disambiguates fully. | APC4 has genuine paper-fiber slowness, not noise. V60 measurement MASKED part of the true signal (RP4-N3 pattern). |

### Methodology Validation Verdict

**Did paper-only measurement methodology validate as a research mode?**

✅ **VALIDATES**. Paper-only measurement in Sibarist BS is a sound research mode.

Evidence:
1. Noise floor reproduced #3b precedent (4s baseline range exactly)
2. Methodological gate passed cleanly (no choke at no-bed test OR loaded-bed pull #1)
3. Cross-project Δ-in-deltas analysis produced substantive findings invisible to single-project measurement:
   - 3 non-CAFEC papers cleanly classified as baseline-equivalent at fiber level
   - 3 of 4 CAFEC papers' true paper-fiber slowness REVEALED that P1 had missed (DC4 / MC4 / APC4)
   - LC4 confirmed as paper-fiber-real (P1's +20 only modestly trimmed to RP4 +16, paper-fiber dominant)
4. Hypothesis test framework discipline (Lesson #16 active mode) produced cleaner diagnoses — pre-stated predictions made the Test 2 inversion reinforcement and Test 3 stabilization readings unambiguous

**Implications for Research Assistant SKILL.md scaffolding:**
- Paper-fiber vs paper-brewer-interaction is a **family-conditional distinction**, not binary. SKILL.md needs to support multi-paper analysis with manufacturer/fiber-family axis as a discriminator.
- The "context-dependent flow rate" framing must accommodate family-conditional signal direction.
- Cross-project Δ-in-deltas is a validated substrate-extraction primitive — worth codifying as a Research Assistant analytical pattern.

**Implications for `flowRateContexts` schema implementation (per ADR-0015 + Project #3 AI-7):**
- RP4 generates the THIRD independent context-dependence confirmation (P1 + P3 + RP4). The trigger condition is met.
- ADR-0015 implementation can fire after RP4 closes.
- Schema design should support multi-context paper records with the BS context as the **methodologically-clean reference** (tightest noise floor, paper-brewer-fit eliminated).
- Family/manufacturer attribute on FilterEntry recommended to enable the family-conditional analysis pattern.

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

| # | Lesson | Status | RP4 evidence |
|---|---|---|---|
| 1 | Photo confirmation | ✅ | Overview photo of cohort + BS |
| 2 | SKU naming convention | ✅ + 🆕 | Plus RP4-N8: T-code as registry identifier |
| 3 | Pre-pull-1 calibration | ✅ | Merged with sub-step 4 no-bed test; passed cleanly |
| 4 | Checkpoint pacing | ✅ | Mental tracking + selective callouts worked all 10 pulls |
| 5 | Auto-retest rule | ✅ | Cross-confirmation alternative used twice (CONE-B3 + Hario pair) |
| 6 | Equipment cross-check | ✅ | EG-1 6.5 ULTRA SSP / BS cone / scale 0.1g / kettle 93°C |
| 7 | Tool-call-per-pull pacing | ✅ | One tool call per pull throughout |
| 8 | Grind comp band vs noise floor | 〰️ | N/A in RP4 (no grind comp work) |
| 9 | `bedBehaviorUnderLoad` enum | ✅ + 🆕 | All papers showed 'stable' bed; RP4-N6 surfaces 'asymmetric-stable' variant |
| 10 | Vendor naming ≠ functional geometry | ✅ | CONE-B3 (V60-shape) and HALO-B3 (native-BS) measure functionally identical in BS — generates RP4-N9 |
| 11 | 5-tier seating spectrum | ✅ | BS = system-integrated mode confirmed throughout |
| 12 | Minimum cohort size | ✅ | 7-paper cohort well above min |
| 13 | flowRate as triple | 🆕 | RP4 refines to family-conditional + measurement-context-dependent (see RP4-N4) |
| 14 | Accessory effects paper-specific | 〰️ | N/A |
| 15 | Hand-fold quality non-factor | 〰️ | N/A (BS system-integrated, no manual crease) |
| 16 | Substantive theory generation mid-run | ✅ | RP4-N1 / N2 / N3 / N4 / N6 / N7 / N9 all surfaced mid-run |
| 17 | Pre-flight DB scan + alias-map audit | ✅ | Done at protocol design time |
| 18 | Vendor design intent as substrate context | ✅ | HALO-B3 vs CONE-B3 functional equivalence raises substantive design-intent question (RP4-N9) |
| 19 | Paper size as registry-relevant dimension | 🆕 | RP4 makes this LOAD-BEARING — CONE-FAST excluded because small-size variant doesn't fit BS. Size axis is a real registry attribute for the Sibarist FAST family. |
| 20 | Brewer capacity as hard ceiling | ✅ | BS handles 250g cleanly with no rim backup |
| 21 | Confirmed-outlier procedure | 〰️ | Not triggered (no outliers requiring disambiguation) |
| 22 | Manual crease as Negotiator-equivalent | 〰️ | N/A |
| 23 | Cross-geometry mismatch as reproducible gap | ⚠️ | LC4 / DC4 / MC4 / APC4 fit BS rim but buckle under load — partial cross-geometry gap visible only at load state |
| 24 | Flow classification is brewer-specific | ✅ | Directly demonstrated — CAFEC papers reclassified from indistinguishable→REAL slow between V60 (P1) and BS (RP4) |
| 25 | Paper-above-rim physical constraint | 🆕 | RP4-N7 refines: METEOR-02 sat well above BS rim but drawdown converged to baseline. Above-rim ≠ flow artifact in BS. |
| 26 | Bed-shape from fold geometry | ✅ | V60-shape crater pattern consistent across 7 papers in BS housing |
| 27 | Paper self-choke as load-dependent function | ✅ + 🆕 | No choke observed (loaded OR no-bed); refined by RP4-N4 (family-conditional Lesson #36) |
| 28 | No-bed paper-only test as research primitive | ✅ | Used as Step 0 sub-step 4 methodological gate |
| 29 | Bimodal drawdown regimes | 〰️ | Not observed in RP4 (unimodal throughout) |
| 30 | No-bed test as regime-discriminator | ✅ | Passed (no regime-bimodality) |
| 31 | Pour rate × bed throughput regime selection | 〰️ | N/A |
| 32 | Dispersion devices mask pour-rate | 〰️ | N/A (hand-pour, no Melodrip) |
| 33 | Protocol-precision ceiling on bimodal systems | 〰️ | N/A |
| 34 | Vendor design intent as substrate validation | ⚠️ | HALO-B3 vs CONE-B3 functional equivalence in BS raises but doesn't resolve design-intent question — generates RP4-N9 follow-up |
| 35 | Brewer-as-paper-housing architectural class | ✅ | BS confirmed paper-housing class throughout |
| 36 | **Paper self-choke = paper-brewer-interaction artifact (deepest insight)** | ⚠️ + 🆕 | **PARTIALLY VALIDATED + REFINED.** Family-conditional, not universal. RP4-N4 captures the refinement: Hario/Sibarist families validate Lesson #36; CAFEC family contradicts it (paper-fiber signal dominates). |
| 37 | Distinguish paper-choke from bed-compaction | 〰️ | N/A (no choke observed) |
| 38 | Brewer-first-use as design-quality indicator | ✅ | BS second-use clean; expected unimodal behavior confirmed |
| 39 | Sibarist BS as paper-only measurement platform | ✅ | **STRONGLY VALIDATED** — RP4 directly demonstrates this. BS is the paper-only measurement platform. |
| 40 | Role discipline for executor vs compiler | ✅ | Followed throughout — no registry edits, no commits, no PRs, will terminate after handoff brief |

### NEW lessons specific to paper-only methodology

**RP4-N1: Sub-step 1 unloaded BS-fit check misses paper-shape-under-LOAD behavior.**
LC4 / DC4 / MC4 / APC4 (CAFEC family) and VCF-01 (Hario tabbed) all passed sub-step 1's coarse "fits cleanly" check but buckled/crinkled under load without V60 dripper support. **Substrate implication:** consider extending BS-fit verification to include a loaded check, OR add `paperShapeRetention: 'self-supporting' | 'needs-brewer-support'` sub-attribute to FilterEntry. Connects to Lesson #25 + #26.

**RP4-N2: Paper-brewer-interaction direction is paper-individual, not just fiber-class.**
LC4 (T-92) and DC4 (T-83) are BOTH CAFEC Trad fiber papers (same fiber base, different roast-color treatments). But their Δ-in-deltas have OPPOSITE directions: LC4 -4 (less slow in BS), DC4 +11 (more slow in BS). Paper-brewer-fit signal is paper-individual, not fiber-class-uniform.

**RP4-N3: P1's wider noise floor (8s) SYSTEMATICALLY UNDERESTIMATED CAFEC family paper-fiber slowness.**
Three CAFEC papers showed hidden slowness revealed by BS's tighter 4s measurement:
- DC4 (T-83): P1 +7-8 (indistinguishable) → RP4 +19 (REAL slow); revealed ~+11s of hidden slowness
- MC4 (T-90): P1 0 (P1 baseline) → RP4 +7 (REAL slow modest); revealed ~+7s of hidden slowness
- APC4: P1 +12 (REAL edge) → RP4 +17 (strongly REAL); revealed ~+5s
- LC4 (T-92, far from P1 noise floor): P1 +20 → RP4 +16; minimal underestimate (-4)

**Pattern:** the more noise-floor-adjacent a paper measured in P1, the more it was underestimated. This pattern is CAFEC-family-specific (Hario VCF-01 and METEOR-02 stayed indistinguishable in both contexts). **Substrate implication:** noise-floor-driven classification is biased toward indistinguishable for measurement-context-edge papers; tighter measurement disambiguates.

**RP4-N4: Lesson #36 is family-conditional, NOT universal.**
Refines the "deepest insight of arc" framing. Paper-brewer-interaction dominates for paper families with weak fiber signal (Hario commodity, Sibarist baseline). Paper-fiber signal dominates for paper families with strong fiber-treatment differentiation (CAFEC roast-color line). **The relative dominance is family-conditional.** Lesson #36 as originally stated was an over-generalization from the cohort sample of #1-3.

**RP4-N5: Cross-project Δ-in-deltas as substrate-extraction primitive.**
Methodologically validates as analytical pattern for inter-context paper-flow comparison. The DIFFERENCE in deltas (RP4 BS Δ minus P1 V60 Δ) isolates paper-only signal from paper-brewer-fit signal. **Substrate implication:** worth codifying as a Research Assistant analytical pattern in the SKILL.md scaffolding.

**RP4-N6: Bed-shape asymmetry doesn't auto-cause flow artifacts.**
VCF-01's bed was egg-shaped / paper-shifted-to-one-side, yet macro drawdown matched baseline (95s, within noise floor). Bed-pattern symmetry is a separable signal from drawdown rate. **Substrate implication:** `bedBehaviorUnderLoad` enum may want an 'asymmetric-stable' value distinct from 'stable' — the asymmetry is a visual observation but not a flow-rate signal.

**RP4-N7: Above-rim paper seating in BS is functionally non-impacting on drawdown when bed seats cleanly.**
METEOR-02 sat "well above" BS rim with paper edge near middle cylinder, yet drawdown converged to baseline (+2s). **Substrate implication:** strengthens Lesson #36 + #39 for BS — paper-brewer-fit tolerance is wider than sub-step 1 caveat-flagging would suggest. BS architecture is robust to paper-fit variability including above-rim seating, as long as the bed seats and the paper doesn't create flow gaps.

**RP4-N8: CAFEC T-code naming convention is a registry-relevant identifier.**
CAFEC's product line uses T-codes (T-83 / T-90 / T-92) as the canonical paper designation, separate from the Cup-size encoding (LC4/DC4/MC4 cup-tier suffix). Numbering doesn't map linearly to roast color (T-83 < T-90 < T-92 ≠ Light→Dark ordering — likely encodes paper density / fiber-treatment dimension). Chris's preferred reference is by T-code. **Substrate implication:** add `productCode` field to FilterEntry for CAFEC line; reference papers by T-code in synthesis prompts and registry docs.

**RP4-N9: Native-BS paper vs V60-shape paper functional equivalence in BS raises a substantive design-intent question.**
HALO-B3 (Sibarist "native BS paper") and CONE-B3 (Sibarist V60-shape paper used in BS) measure functionally identical on drawdown in BS (HALO-B3 baseline 91s; CONE-B3 92s, within 4s noise floor). **What's the design rationale for HALO-B3 being a separate SKU if drawdown is identical?** Flow-only measurement doesn't capture clarity / extraction / mouthfeel differences. **Substrate implication:** worth a follow-up brewing-quality (not flow-only) test to investigate. Could be a Research Assistant SKILL.md research direction.

### Pattern Lessons for Research Assistant SKILL.md (post-RP4 combined with #1-3)

1. **Cross-project Δ-in-deltas as canonical analytical pattern** (RP4-N5). Codify in SKILL.md as a reusable method for paper-only signal extraction across measurement contexts.
2. **Family-conditional flow-rate classification framework** (RP4-N4). Replace the universal "paper-fiber vs paper-brewer-interaction" binary with family-conditional rules. CAFEC family has fiber-dominant signal; Hario/Sibarist families have brewer-interaction-dominant signal.
3. **Pre-stated hypothesis test framework** (Lesson #16 active mode, validated in RP4 across 3 tests). Document as repeatable substrate-validation discipline. Pre-stating predictions before scoring runs produces cleaner post-hoc diagnoses.
4. **Multi-context paper records as research primitive.** FilterEntry needs to support multi-context flow rate measurements with the BS context as methodologically-clean reference and per-brewer measured values surrounding it.
5. **Manufacturer/fiber-family as registry axis** (RP4-N4 + RP4-N8). Family discriminator enables the family-conditional analysis pattern. Required attribute on FilterEntry.
6. **Loaded vs unloaded fit verification** (RP4-N1). Sub-step 1 inheritance protocol should distinguish unloaded fit from loaded-state behavior.
7. **Noise-floor-driven classification is biased toward indistinguishable** (RP4-N3). For research-quality measurements, prefer tightest available noise floor (BS over V60).

### Methodology validation verdict for paper-only research mode

See § Output § Methodology Validation Verdict above. **Verdict: ✅ VALIDATES.** Paper-only measurement in Sibarist BS is a sound research mode, and the methodological framework (cross-project Δ-in-deltas + pre-stated hypothesis tests + tight noise floor) produces substantive substrate-extraction findings that single-project measurement cannot.

---

## Substrate-Practice Gap Audit Items (post-RP4 status)

### RP4-resolved audit items:
- **P2 AI-1** (FilterEntry.flowRate schema reshape) — ✅ **TRIGGER CONDITION MET.** RP4 is the third independent context-dependence confirmation. ADR-0015 implementation can fire post-RP4.
- **P2 AI-8** (Grind-comp table band revision) — 〰️ N/A. RP4 didn't add grind-comp data points.
- **P3 AI-4** (`bedBehaviorUnderLoad` enum extension) — 🆕 **EXTENDED.** RP4-N6 surfaces 'asymmetric-stable' variant (VCF-01 egg-shape bed); RP4-N1 surfaces 'buckles-without-brewer-support' variant. Both worth adding.
- **P3 AI-7** (flowRate-triple mechanism refined via #36) — ✅ **TESTED AND REFINED.** RP4 directly tests Lesson #36; refines to family-conditional per RP4-N4.

### NEW audit items surfaced by RP4:

- **RP4 AI-1: Baseline absolute drift between #3b and RP4 (134s vs 91s).** Protocol references #3b HALO-B3 baseline as 134s; RP4 measured 91s with same brewer/paper/coffee/setup. 43s gap despite identical noise floor (4s). **Compile session should investigate the #3b 134s reference against #3b's actual close-out data + consider candidate causes (paper lot drift, coffee batch mixing proportion, ambient humidity, operator technique drift between sessions).** Worth a registry note on HALO-B3 baseline variability if real, or a protocol-doc correction if the 134s reference was wrong.

- **RP4 AI-2: Sub-step 1 fit-verification protocol gap.** Current sub-step 1 checks unloaded fit. RP4-N1 demonstrates that papers can pass unloaded check and fail loaded check (buckling, asymmetric seating). **Recommended: extend sub-step 1 to include a loaded-fit check, OR add an explicit "loaded behavior" capture sub-step before scoring pulls.**

- **RP4 AI-3: CAFEC T-code as registry attribute.** Add `productCode: string` field to FilterEntry. CAFEC papers have a canonical T-code identifier (T-83 / T-90 / T-92) separate from the Cup-size encoding. Chris's preferred reference is by T-code. Registry should support this.

- **RP4 AI-4: HALO-B3 design rationale investigation.** RP4-N9 raises the question: if HALO-B3 (native-BS paper) measures functionally identical to CONE-B3 (V60-shape in BS) on drawdown, what's the design rationale for HALO-B3? **Recommended follow-up: a brewing-quality test (clarity / extraction / mouthfeel) to investigate whether HALO-B3 differentiates on non-flow dimensions.**

- **RP4 AI-5: Family-conditional flow-rate classification framework.** RP4-N4 demonstrates that paper-brewer-interaction signal direction is family-conditional. **FilterEntry should support manufacturer/fiber-family axis as a discriminator.** Registry recommendation: add `paperFamily: 'Hario' | 'Sibarist' | 'CAFEC-Trad' | 'CAFEC-Abaca' | ...` or equivalent.

- **RP4 AI-6: Sibarist FAST size variants as registry SKUs.** RP4 surfaced that CONE-FAST has size variants (small vs large) where the small variant doesn't fit BS. Registry currently treats "Sibarist FAST" as a single SKU but variant differentiation matters. **Recommended: add size-variant SKU records OR `sizeVariant` field to existing FAST SKU.**

- **RP4 AI-7: Endpoint-precision discipline in protocol.** Pull #1 measurement was "about 1:30 estimate"; pulls #2 + #3 + #9 had range-style readings ("1:29-1:31"). **Protocol could prescribe explicit endpoint reading discipline (e.g., "call the moment of specular→diffuse transition; if you miss it, give 1-2s range with upper bound chosen").**

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

End of Research Project #4 v1.0 protocol.

---

## HANDOFF BRIEF FOR COMPILE SESSION (RP4 Close-Out)

**Date:** 2026-05-26
**Session role:** execution + handoff brief production (no substrate edits)
**Methodology verdict:** ✅ VALIDATES — paper-only measurement is a sound research mode in Sibarist BS

This handoff brief is the compile session's canonical consumption artifact. The protocol doc above contains the full data trail. This section is the structured summary + action list.

### Headline findings

1. **Methodology validates.** Paper-only measurement in Sibarist BS produces 4s noise floor (matching #3b precedent), no choke at no-bed or loaded-bed bimodality screens, and cross-project Δ-in-deltas analysis produces substantive substrate-extraction findings.

2. **Lesson #36 PARTIALLY VALIDATED + REFINED.** Paper-brewer-interaction is dominant for Hario + Sibarist families (3/3 papers converged to baseline in BS). Paper-fiber signal is dominant for CAFEC family (4/4 papers REAL slow in BS regardless of P1 classification). **Lesson #36 is family-conditional, not universal.** The "deepest insight of arc" framing was an over-generalization.

3. **Project #1 Headline Finding #1 conclusion HOLDS AND EXTENDS.** CAFEC's registry labels (LC4 "Fast", DC4 "Slow") describe extraction outcome not flow physics. Now extended to the full T-series (T-83 / T-90 / T-92) plus Abaca APC4 — entire CAFEC Cup 4 family is paper-fiber-slow.

4. **P1's wider noise floor systematically underestimated CAFEC family slowness.** Three CAFEC papers (DC4, MC4, APC4) showed hidden slowness revealed by BS's tighter 4s noise floor. Noise-floor-driven classification has measurement-precision bias.

### Per-paper drawdown table (canonical record)

| Paper | SKU / Code | RP4 BS (s) | Δ vs 91s | RP4 class | P1 V60 (s) | P1 Δ vs 60s | P1 class | Δ-in-deltas |
|---|---|---|---|---|---|---|---|---|
| HALO-B3 (baseline) | HALO-B3 | 91 (median; 90/91/94, range 4) | 0 | — | — | — | — | — |
| Sibarist CONE B3 | CONE-B3 | 92 | +1 | Indistinguishable | 60 (P1 baseline) | 0 | — | +1 |
| Sibarist CONE FAST | CONE-FAST (small variant) | NOT TESTED | — | — | 45 | -15 to -16 | REAL fast | (excluded — size variant doesn't fit BS) |
| CAFEC LC4 (T-92) | LC4-100W | 107 | +16 | **REAL slow** | 80 | +20 | REAL slow | -4 |
| Hario Meteor 02 | METEOR-02 | 93 | +2 | Indistinguishable | 65 | +5 | Indistinguishable | -3 |
| CAFEC Abaca APC4 | APC4-40W | 108 | +17 | **REAL slow** | 72 | +12 | REAL edge | +5 |
| CAFEC DC4 (T-83) | DC4-100W | 110 | +19 | **REAL slow** | 68 | +7-8 | Indistinguishable | +11 |
| Hario VCF-01 | VCF-01-100W | 95 | +4 | Indistinguishable (edge) | 65 | +5 | Indistinguishable | -1 |
| CAFEC MC4 (T-90) | MC4-100W | 98 | +7 | **REAL slow (modest)** | 60 | 0 | P1 baseline-equiv | +7 |

### Hypothesis test resolutions

- **Test 1 (Lesson #36 convergence):** MIXED. Non-CAFEC converged (3/3); CAFEC did not (4/4). Family-conditional refinement.
- **Test 2 (LC4/DC4 inversion):** HOLDS AND REINFORCED. CAFEC family uniformly paper-fiber-slow.
- **Test 3 (APC4 stabilization):** STRONGLY REAL. Tighter noise floor disambiguates definitively.

### NEW lessons captured (RP4-N1 through RP4-N9)

| # | Lesson | Substrate implication |
|---|---|---|
| RP4-N1 | Sub-step 1 unloaded fit check misses load-state buckling | Extend protocol sub-step 1 OR add `paperShapeRetention` attribute |
| RP4-N2 | Paper-brewer-interaction direction is paper-individual, not fiber-class | Caution against fiber-class-uniform classification |
| RP4-N3 | P1's wider noise floor systematically underestimated CAFEC family slowness | Tighter measurement disambiguates noise-floor-edge classifications; prefer BS for research-quality measurements |
| RP4-N4 | Lesson #36 is family-conditional, not universal | Replace universal Lesson #36 framing with family-conditional rule |
| RP4-N5 | Cross-project Δ-in-deltas as substrate-extraction primitive | Codify as Research Assistant analytical pattern |
| RP4-N6 | Bed-shape asymmetry doesn't auto-cause flow artifacts | Add 'asymmetric-stable' to `bedBehaviorUnderLoad` enum |
| RP4-N7 | Above-rim seating non-impacting on drawdown in BS | Strengthens Lesson #36 + #39 for BS architecture |
| RP4-N8 | CAFEC T-code as registry-relevant identifier | Add `productCode` field to FilterEntry |
| RP4-N9 | HALO-B3 vs CONE-B3 functional equivalence on drawdown in BS | Follow-up brewing-quality test recommended |

### Substrate edit specifications for compile session

**DO NOT execute these edits in this session — the compile session integrates substrate.**

#### Registry edits (`lib/filter-registry.ts` + `docs/skills/brewing-equipment-expert/cluster/filters.md`)

1. **Drop CONE-FAST size confusion or add size-variant SKUs.** RP4 AI-6: CONE-FAST has size variants; current registry treats it as single SKU. Either add `sizeVariant` field or split into separate SKUs (CONE-FAST-small / CONE-FAST-large).

2. **Add `productCode` field to FilterEntry.** RP4 AI-3 + RP4-N8: CAFEC papers have T-codes (T-83 / T-90 / T-92) as canonical identifiers. Populate for all CAFEC entries.

3. **Add `paperFamily` (or `manufacturerFamily`) discriminator to FilterEntry.** RP4 AI-5 + RP4-N4: family-conditional classification requires this axis. Values: Hario / Sibarist / CAFEC-Trad / CAFEC-Abaca / etc.

4. **Add `paperShapeRetention` sub-attribute to FilterEntry.** RP4 AI-2 + RP4-N1: distinguishes self-supporting papers from those that buckle without brewer support. Values: 'self-supporting' | 'needs-brewer-support' | 'unknown'.

5. **Extend `bedBehaviorUnderLoad` enum.** RP4-N6: add 'asymmetric-stable' (VCF-01 pattern). Possibly also 'buckles-without-brewer-support' as a separate category (RP4-N1).

6. **Update RP4 BS measurements on the 7 measured papers.** Each gets a new `flowRateContext` entry (per ADR-0015 if it lands) with:
   - context: 'Sibarist BS'
   - baseline reference: HALO-B3 91s
   - measured: per the canonical table above
   - classification: per RP4 class column
   - methodology source: RP4 protocol doc

#### ADR work

7. **ADR-0015 (`flowRateContexts` schema reshape) — TRIGGER CONDITION MET.** P2 AI-1 was queued pending the third independent context-dependence confirmation. RP4 is that third confirmation (P1 + P3 + RP4). ADR-0015 can fire.

8. **NEW ADR candidate: Family-conditional flow-rate classification framework.** Document RP4-N4 as an architectural decision. The universal "paper-fiber vs paper-brewer-interaction" binary is too coarse; family-conditional rules are more accurate.

9. **NEW ADR candidate: Cross-project Δ-in-deltas as substrate-extraction primitive.** Document RP4-N5 as a research methodology decision.

#### Audit item resolutions

10. **P2 AI-1 — RESOLVED (trigger condition met).** Note in PRODUCT.md / audit ledger.

11. **P3 AI-4 — EXTENDED.** Add `bedBehaviorUnderLoad` enum values per RP4-N6.

12. **P3 AI-7 — TESTED AND REFINED.** Document Lesson #36 family-conditional refinement.

13. **NEW: RP4 AI-1 through RP4 AI-7** — see Substrate-Practice Gap Audit Items section above. Queue these for compile session evaluation; some are sprint-shaped (AI-4 brewing-quality test), some are protocol/doc refinements (AI-2, AI-7).

#### Substrate-practice gap audit specifically worth checking

14. **RP4 AI-1: 134s vs 91s baseline drift.** Compile session should pull #3b's close-out data and verify the 134s reference in this protocol doc. Either (a) the 134s figure is from a different context within #3b, (b) RP4 had genuine drift, or (c) the protocol doc reference was wrong. Worth resolving before publishing RP4 findings.

### Protocol-execution friction captured (for protocol-doc refinement)

1. **Order swap:** No-bed test moved from pre-pull-1 to post-pull-1 due to operator pre-setup of loaded HALO-B3. Acceptable given #3b precedent but worth a protocol-doc clarification on order strictness.
2. **Sub-step 6 SKU drift check:** Answered via fit-state inference rather than explicit packaging-label check. Acceptable given prior drift resolution but worth tightening wording.
3. **Baseline back-to-back:** All 3 baselines run sequentially (with no-bed test interlude between #1 and #2 only). Mid-cohort drift check dropped by operator. Mitigation: cross-confirmation primitives used effectively (Hario family pair, Sibarist family pair).
4. **Coffee exhaustion at pull #10:** No auto-retest budget after final cohort pull. Future protocols should budget explicit retest buffer.
5. **Endpoint-precision drift across pulls:** Pull #1 estimated, pulls #2/#3/#9 range-style. Captured as RP4 AI-7 — protocol could prescribe explicit endpoint reading discipline.

### Recap map for after compile session integrates RP4 substrate

Per protocol § After RP4 Closes — Recap Map, the compile session should produce a **filter-arc total recap** covering:
- Trifecta + RP4 substrate state (lessons, audit items, papers measured, cohort coverage)
- Outstanding filter-specific work (audit items remaining; April Paper Filter remeasurement scoping; matched-size FLAT 2 pair; HALO-B3 design-rationale test per RP4 AI-4)
- Research Assistant SKILL.md scaffolding sprint readiness (combined substrate from 4 projects; trigger conditions; suggested scaffolding scope; family-conditional framework per RP4-N4 + RP4-N5)
- Resolution of the 134s vs 91s baseline drift (RP4 AI-1)
- Anything else worth surfacing before "calling it done"

This recap is the compile session's final RP4 output — not this execution session's. **This execution session terminates after this handoff brief per Lesson #40.**

---

### Execution Session Termination

Per Lesson #40 role-discipline rule:
- ❌ NO registry edits made
- ❌ NO commits, no pushes, no PRs opened
- ❌ NO `npx tsc --noEmit` runs
- ✅ Protocol doc updated in-place as canonical archive (authorized per "doc IS the archive" framing)
- ✅ Handoff brief produced above for compile session consumption
- 🛑 **Session terminating after this brief lands. The compile session integrates substrate per the design pattern.**

End of Research Project #4 close-out.
