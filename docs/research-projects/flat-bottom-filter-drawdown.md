# Flat-Bottom Filter Drawdown Characterization (Research Project #2)

*Coffee Research · Latent · Research Project*

**Version:** 3.0 (close-out)
**Date drafted:** 2026-05-23
**Date executed:** 2026-05-24
**Status:** CLOSED
**Home EG-1**

---

## Project Context

This is **Research Project #2** in the 3-project arc opened by Project #1 (cone filter drawdown, closed 2026-05-23 in PR #226). Same protocol template, swapped brewer + baseline + paper-geometry scope. Closes ADR-0011's ≥2-tracks trigger for Research Assistant SKILL.md scaffolding (which the close-out notes recommend deferring one more project regardless — see Notes section).

| Project | Brewer (constant) | Baseline filter | Status |
| :---- | :---- | :---- | :---- |
| #1 - Cone Filter Drawdown | Hario V60 Glass (V60-01) | Sibarist CONE B3 | ✅ CLOSED 2026-05-23 |
| **#2 - Flat-bottom Filter Drawdown** (this doc) | Orea Type-A Glass (canonicalizes to Orea v4) + Negotiator | Sibarist **FLAT 2 B3** size S | ✅ CLOSED 2026-05-24 |
| #3 - Specialty / Paired Filter Drawdown | Per-paper native brewer | Per-paper absolute (framing needs cohort-size refinement per Lesson 12) | Queued |

---

## TL;DR (Headline Findings)

10 pulls executed (1 calibration + 7 official scoring + 2 exploratory Booster). Baseline range **6s** — tighter than Project #1's 8s noise floor. 4 non-baseline filters tested; **all 4 deltas REAL**.

**Headline finding — geometry/compression dominates fiber by far.** Two clean clusters with no overlap:
- **Negotiator-compressed cluster:** FLAT 2 B3 (127.5s), FLAT 2 FAST (117s), FLAT FAST hand-fold (117s) — 117-131s band
- **Free-seating cluster:** xBloom (50s), WAVE B3 (48.5s) — 48.5-50s band

70+ second gap between clusters. Seating-state is the dominant variable; fiber differences within the compressed cluster account for ≤14s.

**Two net-new entries surfaced at Step 0:** FLAT 2 B3 + FLAT 2 FAST (Sibarist's pre-folded v2 product line — Chris owns these instead of the FLAT v1 hand-fold variants the registry listed as owned).

**Sibarist Booster 45 effect is paper-specific (or paper-size-specific; confounded):** FLAT 2 B3 (S) + Booster = 52s (-75.5s); FLAT 2 FAST (M) + Booster = 105s (-12s). Cannot cleanly separate fiber vs size with current data.

See "Key Findings" section below for the full surface.

---

## Purpose

Build a calibrated flow map of home flat-bottom filters so filter choice becomes a quantified extraction lever, not a gut read. Mirrors Project #1's intent for flat-bottom geometry. Sibarist FLAT 2 B3 baseline (chosen for extremely stable flow consistency + Chris's active workhorse, not for highest registry seniority).

**Outputs (all delivered at close-out):**

1. ✅ Median drawdown values for 5 tested flat filters (baseline + 4 non-baseline). Recording Sheet below.
2. ✅ Grind compensation table (vs FLAT 2 B3 baseline).
3. ✅ `FilterEntry` type extended with 7th field (`measurementNote?: string`) — captures size variants, accessory context, hand-fold provenance, design-intent notes that pure data fields can't. 2 net-new entries authored (FLAT 2 B3 + FLAT 2 FAST). 5 existing entries updated.
4. ✅ Updates to [docs/skills/brewing-equipment-expert/cluster/filters.md](../skills/brewing-equipment-expert/cluster/filters.md) — new top-level Project #2 reference section + per-paper measurement bullets.
5. ✅ Alias map cleanup — 2 mis-collapsing aliases re-pointed, 6 new aliases added (now size-aware).

---

## Scope (executed)

Flat-bottom filters only. Cone papers in Project #1 (closed); specialty/paired papers in Project #3 (queued).

**Executed brewer:** Orea Type-A Glass (canonicalizes to Orea v4 via registry alias) + **Official Sibarist Negotiator tool** (per-paper per locked table).

**Executed baseline:** Sibarist **FLAT 2 B3** size S — chosen over the originally-recommended FLAT B3 after Step 0 surfaced Chris doesn't physically own FLAT B3 (he owns the FLAT 2 successor). FLAT 2 B3 carries the same "Extremely stable" flow consistency rationale.

**Geometry-check pair (deferred):** matched-size FLAT 2 B3 vs FLAT 2 FAST pair (both in same size) not in inventory. The 10.5s B3-vs-FAST delta in this project cannot be cleanly attributed to fiber alone (B3 in S, FAST in M — size confound). Queued as audit item #9.

---

## Step 0 - Inventory Cross-Check (LOAD-BEARING) — EXECUTED

**Outcome:** 5 papers in scope (down from protocol's recommended 4, expanded then contracted). **5 registry drifts caught.** Photo confirmation validated as load-bearing (caught more drifts than Project #1's 3).

### Final test scope (5 filters in scope; 1 deferred)

| # | Filter | SKU | Size | Step 0 outcome |
| :---- | :---- | :---- | :---- | :---- |
| 1 | Sibarist FLAT 2 B3 | FLAT2-B3 | S | ✅ Confirmed (3 replicates) — net-new registry entry |
| 2 | Sibarist FLAT 2 FAST | FLAT2-FAST | M | ✅ Confirmed — net-new registry entry |
| 3 | Sibarist FLAT FAST (hand-fold v1) | FLAT-FAST | Unknown | ✅ Confirmed |
| 4 | Sibarist WAVE B3 | WAVE-B3 | Standard | ✅ Confirmed |
| 5 | xBloom Premium Paper Filters | XBLOOM-STD | Standard | ✅ Confirmed |
| (deferred) | April Paper Filter | APRIL-STD | Standard | Deferred to Project #3 (cohort-of-one in Orea baseline; oversized requires forced compression) |

### Registry drifts caught (5)

1. **Sibarist FLAT B3 (FLAT-B3) flagged `owned: true` but not physically present.** Chris owns the FLAT 2 B3 successor (pre-folded v2), not this hand-fold v1 variant. Flipped to `owned: false`.
2. **Sibarist FLAT 2 B3 (FLAT2-B3) missing from registry entirely.** Physically present, Chris's active baseline. Authored as net-new entry.
3. **Sibarist FLAT 2 FAST (FLAT2-FAST) missing from registry entirely.** Physically present. Authored as net-new entry.
4. **Alias map collapse: FLAT 2 → FLAT FAST silently merged distinct products.** The aliases `"Sibarist FAST Flat 2 - Size S"` and `"Sibarist FAST - Flat 2, Size S"` pointed to FLAT FAST canonical; should have pointed to the (now-authored) FLAT 2 FAST. Re-pointed + 6 new size-aware aliases added.
5. **WAVE B3 `paperShape: "Wave"` flagged for audit.** Functionally a flat-bottom paper with cupcake-walled geometry (drains 48.5s free-seated in flat Orea; same cluster as xBloom). Queued as audit item #2 — possible split into `paperShape` (bed geometry) vs `wallStructure` (smooth/fluted/engineered).

### Naming-convention confusion surfaced (Project #1 lesson #2 extended)

Sibarist's vendor naming (FLAT / FLAT 2 / WAVE / FLAT FAST) doesn't map cleanly to functional bed geometry. The "WAVE" name describes paper wall structure (fluted) but the bottom is FLAT. A paper labeled "Wave" can be functionally equivalent to a paper labeled "Flat" in the same brewer. **New lesson #10:** vendor naming should be treated as a hint, not ground truth, for geometry classification.

### Registry edits applied (close-out PR)

In-scope for this project:

1. **Type extension:** added `measurementNote?: string` as a 7th optional field on `FilterEntry` (Project #1 shipped 6 fields; this adds the contextual note that pure data fields can't carry).
2. **Net-new entries:** FLAT 2 B3 + FLAT 2 FAST (authored from Sibarist product specs + measured drawdown).
3. **Ownership flip (true → false):** FLAT-B3 (Chris owns successor, not this).
4. **Measurement extensions (existing entries):** FLAT-FAST, WAVE-B3, XBLOOM-STD all populated with measurement fields + measurementNote context.
5. **Comment annotation (no data change):** APRIL-STD entry gets deferral comment in registry; cluster doc gets deferral italic note.
6. **Alias map cleanup:** removed 2 misdirecting aliases; added 6 new size-aware aliases.

Out-of-scope for this project (queued):

- 9 substrate-practice gap audit items (see "Substrate-Practice Gap Audit Items" section below)

---

## Equipment Required — Actual Locked Config

| Variable | Protocol spec (v1.0) | Actual locked (v3.0 close-out) |
| :---- | :---- | :---- |
| Brewer | Orea v4 recommended | **Orea Type-A Glass** (canonicalizes to Orea v4) |
| Negotiator | Not specified | **Official Orea Negotiator tool** (used per-paper per locked table) |
| Dispersion device | Specify model in Step 0 | **Custom glass Melodrip** (same as Project #1) |
| Grinder | EG-1 6.5 | ✅ Same, ULTRA SSP burrs |
| Dose | 15.0g ± 0.1g | ✅ Same |
| Water | Tap (Los Altos Hills) | ✅ Same |
| Temperature | 93°C | ✅ Same |
| Pour | 250g over 30s via count-out-loud | **250g over 30s via checkpoint pacing** (Project #1 lesson #4 refined — mental checkpoint tracking with selective verbal callouts; pure verbal narration was hard mid-pour) |
| Pre-rinse | ~200g near-boiling | ✅ Same |
| Test coffee | Single bag or pre-blended batch | **CGLE Sudan Rume Natural, Latent-roasted, batches 142 (Agtron 90.6) + 143 (92.5) + 144 (81.1) mixed; blend ~88 Agtron midpoint** |
| Endpoint criterion | Specular → diffuse reflection | ✅ Same |

### Pre-Pull-1 Calibration (Project #1 lesson — fired cleanly)

Unlike Project #1's 2-pull calibration arc, Project #2's pre-pull-1 shot was sufficient. Single untimed shot validated the locked config:

- **Calibration filter:** Sibarist FLAT 2 B3 (size S) + Negotiator
- **Pour cadence observed:** 250g @ 0:31 (natural pace, no count-out-loud) — 1s over 30s target, minor enough to lock by switching to checkpoint pacing for scoring pulls
- **Bed disturbance:** Late-forming crater that grew through drawdown; no tilt or channeling
- **Endpoint clarity:** Clear; same visual read as Project #1 V60 cones
- **Iterations needed:** None — config locked as spec'd; switched to checkpoint pacing for scoring pulls
- **Final locked config diverged from spec?:** No
- **Calibration drawdown:** 138s (used as B3 reference anchor for scoring pulls)

**Validation of Project #1 lesson #3** (pre-pull-1 calibration shot): saved scoring pulls. Without calibration, the +1s drift would have shown up mid-scoring run and required mid-protocol adjustment.

---

## Method — Per-Pull Procedure (as executed)

Same as Project #1 with one refinement: **count-out-loud → checkpoint pacing.** Mental checkpoint tracking with verbal callouts where capacity allows. Pours still landed at the time targets; verbal narration as one optional implementation, not a requirement.

1. Place Orea Type-A Glass on scale with empty server. Tare.
2. Insert filter (with Negotiator where the locked table specifies — see Recording Sheet).
3. Pre-rinse with ~200g near-boiling water. Discard rinse water. Dump server. Tare.
4. Add 15.0g pre-ground coffee. Level bed gently.
5. Attach custom glass Melodrip. Confirm kettle at 93°C.
6. Start timer. Begin pour with checkpoint pacing (mental tracking of 50/100/150/200/250 at 6s intervals; verbal callouts as capacity allows).
7. When scale reads 250g, lift Melodrip. Note pour-end time.
8. Observe bed. Drawdown complete = specular → diffuse reflection transition.
9. Stop timer. Record total time.
10. Record observations: bed mechanism (pour-impact-crater vs late-forming-crater vs mixed), channeling, fines migration.
11. Dump bed. Rinse brewer. Allow cool. Reset kettle. Next pull per randomized sequence.

---

## Recording Sheet — Final Data (10 official pulls)

### B3 Baseline (Sibarist FLAT 2 B3, size S, 3 replicates)

| Filter | Pull 1 (s) | Pull 2 (s) | Pull 3 (s) | Median (s) | Range (s) | Notes |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| Sibarist FLAT 2 B3 (size S) + Negotiator | 127.5 | 131 | 125 | **127.5** | **6s** | Late-forming crater consistent across reps; tight noise floor (tighter than Project #1's 8s). Bed swelled + settled pattern. |

### Other Flat Filters (1 replicate each; auto-retest rule did not fire)

| Pull # | Filter | SKU | Size | Negotiator | Booster | Pull (s) | Pour landing | Bed behavior | Auto-retest? | Notes |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| 2 | xBloom Premium | XBLOOM-STD | std | NO | NO | 50 | 0:30 | Crater scaled-down (less elapsed time) | No (Δ -77.5s far outside 9s threshold) | Cupcake walls free-seated cleanly; no bypass |
| 4 | Sibarist FLAT FAST (hand-fold) | FLAT-FAST | unknown | YES | NO | 117 | 0:31 | Quick midrange, slow tail | No (\|Δ\| 10.5s, 1.5s outside 9s threshold + cross-confirmed by Pull 6) | Hand-fold quality good; fold scoring aided execution; Chris's first hand-fold attempt |
| 5 | Sibarist WAVE B3 | WAVE-B3 | std | NO | NO | 48.5 | 0:30 (exact) | Same late-crater pattern | No (Δ -79s far outside threshold) | No bypass; fits Orea slightly cleaner than xBloom |
| 6 | Sibarist FLAT 2 FAST | FLAT2-FAST | M | YES | NO | 117 | 0:28 | Quick midrange, slow tail | No (\|Δ\| 10.5s, 1.5s outside 9s threshold + cross-confirmed by Pull 4) | Identical drawdown to Pull 4 hand-fold — see size-confound caveat in Findings |

### Exploratory Pulls (NOT part of formal analysis table; Booster mechanism test)

| Pull # | Filter | SKU | Size | Negotiator | Booster | Pull (s) | Δ vs no-Booster | Interpretation |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| 8 | FLAT 2 B3 + Booster 45 | FLAT2-B3 | S | YES | YES | 52 | **−75.5s** | Booster eliminates ~75s of friction artifact on B3 — transforms B3 to free-seating-cluster speed |
| 9 | FLAT 2 FAST + Booster 45 | FLAT2-FAST | M | YES | YES | 105 | **−12s** | Booster barely affects FAST — effect is paper-specific (or paper-size-specific; can't separate) |

### Test Coffee Composition

- **Coffee:** Latent-roasted CGLE Sudan Rume Natural — batches 142 (Agtron 90.6) + 143 (Agtron 92.5) + 144 (Agtron 81.1) mixed
- **Blend midpoint:** ~88 Agtron (mid-light roast)
- **Grind batch:** all 10 doses ground at EG-1 6.5 in one session at project start (2026-05-24); 2-3g purge between batches
- **Total coffee consumed:** 150g (10 pulls × 15g)

---

## Analysis (executed)

### Step 1 — Validate Baseline ✅ PASS

FLAT 2 B3 3-pull range: **6s**. PASS (well under protocol's ≤15s usable, ≤20s acceptable thresholds). Tighter than Project #1's 8s. No re-run triggered. Noise floor anchored at 6s; baseline median 127.5s.

### Step 2 — Compute Deltas Against FLAT 2 B3

`Δ seconds = filter X measurement - FLAT 2 B3 median (127.5s).` Real/indistinguishable rule: `|Δ| > 6s` = real; `|Δ| ≤ 6s` = indistinguishable.

| Filter | Drawdown | Δ | \|Δ\| > 6s range? |
| :---- | :---- | :---- | :---- |
| xBloom Premium | 50s | **−77.5s** | REAL |
| FLAT FAST hand-fold | 117s | **−10.5s** | REAL |
| WAVE B3 | 48.5s | **−79s** | REAL |
| FLAT 2 FAST | 117s | **−10.5s** | REAL |

All 4 deltas clear the noise floor.

### Step 3 — Translate Real Deltas to Grind Compensation

| Filter | Δ (s) | Comp Band | Grind Comp | Note |
| :---- | :---- | :---- | :---- | :---- |
| xBloom Premium | −77.5 | −30 or more | **0.5 finer** | Terminal bucket; magnitude exceeds table |
| Sibarist WAVE B3 | −79 | −30 or more | **0.5 finer** | Terminal bucket; magnitude exceeds table |
| Sibarist FLAT FAST hand-fold | −10.5 | −15 to +15 | **None** ⚠️ | **Band-vs-noise-floor mismatch** — Project #1 lesson #8 fires |
| Sibarist FLAT 2 FAST | −10.5 | −15 to +15 | **None** ⚠️ | **Band-vs-noise-floor mismatch** — Project #1 lesson #8 fires |

### Step 3b — Auto-Retest Rule Outcome

- Baseline range × 1.5 = **9s** threshold
- Pull 4 \|Δ\| = 10.5s (1.5s outside threshold → no retest required)
- Pull 6 \|Δ\| = 10.5s (1.5s outside threshold → no retest required)
- **Cross-confirmation insight (NEW lesson #5):** 2 independent FAST family papers both at exactly 117s strengthens the call beyond what a single retest would provide. When two independent measurements within a same-family cohort land within noise floor of each other, **cross-confirmation can substitute for retest.** Worth codifying in future protocols.
- **No formal retests executed.**

---

## Output Summary (populated)

| Filter | SKU | Paper Size (tested) | Negotiator | Measurement (s) | Δ vs FLAT 2 B3 | Real? | Flow Tier | Grind Comp |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| **Sibarist FLAT 2 B3** | FLAT2-B3 | S | YES | **127.5** (median) | 0 | — | Medium (anchor) | None (reference) |
| Sibarist FLAT 2 FAST | FLAT2-FAST | M | YES | 117 | −10.5 | REAL | Functionally equivalent* | None (band mismatch) |
| Sibarist FLAT FAST (hand-fold) | FLAT-FAST | Unknown | YES | 117 | −10.5 | REAL | Functionally equivalent* | None (band mismatch) |
| xBloom Premium | XBLOOM-STD | std | NO | 50 | −77.5 | REAL | Significantly faster | 0.5 finer |
| Sibarist WAVE B3 | WAVE-B3 | std | NO | 48.5 | −79 | REAL | Significantly faster | 0.5 finer |

*Band-vs-noise-floor mismatch — REAL by Step 2 but No-Comp by Step 3.

---

## Key Findings

### Finding 1 — Geometry/compression dominates by far

Two clean clusters with no overlap:

| Cluster | Pulls | Range |
| :---- | :---- | :---- |
| Negotiator-compressed (no Booster) | B3 ×3, FAST hand-fold, FLAT 2 FAST | 117-131s |
| Free-seating | xBloom, WAVE B3 | 48.5-50s |

70+ second gap between clusters. **Seating-state is the dominant variable; fiber differences within the compressed cluster account for ≤14s.**

### Finding 2 — Fiber-vs-size confound on the FLAT 2 papers

The 10.5s delta between FLAT 2 B3 (127.5s) and FLAT 2 FAST (117s) **cannot be cleanly attributed to fiber alone** — the two papers were tested in different sizes (B3 in size S, FAST in size M). Both factors plausibly contribute:

| Hypothesis | Mechanism |
| :---- | :---- |
| Pure fiber effect | B3 fiber inherently restricts slightly more than FAST fiber |
| Pure size effect | Larger paper (M) has more bed perimeter / flow path; drains marginally faster regardless of fiber |
| Compound (most likely) | Both contribute; cannot separate with Project #2 data |

**Same confound carries into Finding 3:** Booster asymmetry (B3-S: -75s, FAST-M: -12s) could be partially explained by size-Booster interaction rather than pure fiber-Booster interaction. Smaller paper (S) sits deeper, gets fully compressed → Booster has bigger friction surface to address. Larger paper (M) sits higher, partially un-compressed at edges → less friction-artifact, less for Booster to do.

**Resolution path:** acquire matched-size pair (B3 in M, or FAST in S) for a clean fiber-only comparison. Queued as Audit Item #9.

### Finding 3 — Booster effect is paper-specific (or paper-size-specific)

| Paper | No Booster | With Booster | Δ |
| :---- | :---- | :---- | :---- |
| FLAT 2 B3 (size S) | 127.5s | 52s | **−75.5s** (transforms to free-seating-cluster speed) |
| FLAT 2 FAST (size M) | 117s | 105s | **−12s** (barely changed) |

Pull 9 forced revision of the simple "Booster removes friction → reveals fiber" model. Two possible mechanisms (confounded with Finding 2's size question):

1. **Fiber-specific:** B3 fiber friction-artifact is large + Booster-addressable; FAST fiber has different friction profile the Booster doesn't fully unlock
2. **Size-specific:** Size S paper has more bottom-edge crease surface; Booster smooths more friction
3. Most likely: both

### Finding 4 — Registry's `flowRate` labels are misleading (contextualized by Sibarist's design intent)

Sibarist explicitly markets FLAT 2 as **"The Next Evolution in Zero-Bypass Brewing"** — paper is engineered for Negotiator-compressed configuration, prioritizing bypass elimination over flow speed. The micro-folds friction we measured (~70-80s vs free-seating) is a **known tradeoff of the design intent, not a defect.**

Implications for the registry:
- `FLAT FAST.flowRate: "Very fast"` and `FLAT B3.flowRate: "Medium"` aren't wrong per se — they reflect Sibarist's expected use-case (Negotiator-compressed, zero-bypass priority)
- But the labels are INCOMPLETE — they don't disclose that the same paper performs radically differently in Booster-enabled or free-seating configurations
- `WAVE B3.flowRate: "Medium"` understates massively for free-seating use in Orea (true drawdown 48.5s — same cluster as xBloom's "Fast")

**Substrate fix:** extend registry to capture configuration-dependent behavior (context-conditional `flowRate` field), reframed as "capture vendor's intended use case AND alternative configurations" rather than "registry is wrong." Queued as Audit Item #1.

### Finding 5 — Project #1 lesson #8 confirmed (and reproducible)

Tight noise floor (6s) combined with coarse comp band (15s) means filters can be REAL deltas but No-Comp recommendations. Fires on both FAST family papers in this run, mirroring Project #1's APC4 (+12s) edge case. **The 15s comp band is too coarse for tight baselines** — may justify a ±10s tier in a future table revision. Queued as Audit Item #8.

### Finding 6 — Free-seating works cleanly for cupcake-walled papers in Orea

Zero bypass observed on either xBloom or WAVE B3 during pre-rinse or pour. The flat-bottom seal at the brewer base is sufficient even without Negotiator compression. **Validates the "free-seating is operationally legitimate" call** for these two papers in Chris's workflow.

### Finding 7 — Hand-fold quality is a non-factor (with paper scoring + Negotiator)

FLAT FAST hand-fold and FLAT 2 FAST factory-fold landed at the exact same drawdown (117s). Hand-fold is a viable technique for Chris when the paper has fold scoring and the Negotiator provides compression. **Caveat:** Pull 4 paper size is unknown (see Open Data Items), so cross-confirmation could itself have a size component. If hand-fold was size M (matching Pull 6), confirmation is clean. If size S (matching baseline), the cross-confirmation is even more interesting (two papers, two sizes, same time).

---

## Close-Out (Exit Conditions)

All 10 exit conditions passed:

1. ✅ **Step 0 inventory cross-check resolved with photos.** 5 registry drifts caught + reconciled in registry.
2. ✅ **Brewer + baseline confirmed at Step 0.** Orea Type-A Glass + Negotiator locked; FLAT 2 B3 size S baseline locked (substituted for originally-recommended FLAT B3 after inventory revealed FLAT B3 is not owned).
3. ✅ **All in-scope filters have a measurement.** 5 of 5 measured; April Paper Filter explicitly deferred to Project #3.
4. ✅ **FLAT 2 B3 baseline has 3 valid replicates** with range 6s (well under 20s threshold).
5. ✅ **Auto-retest rule executed.** Did not fire (2 FAST-family pulls cleared threshold by 1.5s + cross-confirmed each other). New lesson: cross-confirmation can substitute for retest in same-family cohorts.
6. ✅ **Output summary table populated.**
7. ✅ **`FilterEntry` registry updated.** Type extended with 7th field (`measurementNote`). 2 net-new entries (FLAT 2 B3 + FLAT 2 FAST). 1 ownership flip (FLAT B3 → not owned). 4 existing entries gained measurement fields (FLAT FAST + WAVE B3 + xBloom + FLAT B3 entry kept for back-compat). 1 entry gained deferral comment (April). Alias map cleanup (-2 + 6).
8. ✅ **Cluster filters.md updated.** New Project #2 reference section + per-paper measurement bullets on tested entries.
9. ✅ **This protocol doc filed** as canonical record.
10. ✅ **Notes for Future Research-Project Pattern populated** — 9 Project #1 lessons validated/refined + 10 new lessons captured. Pattern lessons for Research Assistant SKILL.md scaffolding listed.

After close-out: Research Assistant SKILL.md ≥2-tracks trigger has fired (ADR-0011). Notes section recommends deferring scaffolding until Project #3 closes regardless — cone/flat/specialty trifecta will reveal pattern lessons that two domains can't.

---

## Known Confounders & Limitations

- **Tests flow through a loaded bed with active drawdown** — operationally-relevant signal (carryover from Project #1).
- **Paper lot variability is real**, especially Sibarist. Note lot/batch on packaging if indicated.
- **Bed geometry varies by dose.** 15g; results may not translate to 12.5g or 18g brews precisely.
- **Temperature drift introduces ~2-3s noise**; 3-replicate baseline absorbs it (6s range achieved).
- **Single-replicate non-baseline measurements** can't distinguish identical-to-baseline from within-noise-floor; cross-confirmation between same-family pulls substituted for formal retest in this project.
- **Fiber-vs-size confound on FLAT 2 B3 vs FAST** (Finding 2) — 10.5s delta cannot be cleanly attributed to fiber alone.
- **Booster asymmetry confound** (Finding 3) — paper-specific vs size-specific effect cannot be separated with current data.
- **Pull 4 paper size unknown** (open data item) — affects Finding 7's cross-confirmation interpretation.
- **April Paper Filter not measured this project** — cohort-of-one in Orea baseline; deferred to Project #3.
- **`flowRate` cells in registry remain context-incomplete** even after Project #2's updates — they describe one configuration (typically Negotiator-compressed for Sibarist FLAT family); free-seating alternatives unsurfaced for some entries. Schema reshape queued as Audit Item #1.

---

## Notes for Future Research-Project Pattern

*(Filled in at close-out. Validates / refines Project #1's 9 lessons + adds 10 new lessons. These combined are the substrate for Research Assistant SKILL.md scaffolding.)*

### Validating Project #1's 9 Lessons

1. **Photo confirmation in Step 0** — ✅ Validated. Caught 5 registry drifts on flat-paper side (more than Project #1's 3 cone-paper drifts). Higher drift density because Sibarist's "FLAT vs FLAT 2 vs WAVE" naming creates more SKU ambiguity than V60-side cone naming. **Recommend: photo confirmation should be permanent Step 0 requirement, not optional.**

2. **SKU naming convention notes** — ✅ Validated AND extended. Project #2 surfaced that Sibarist's vendor naming (FLAT / FLAT 2 / WAVE) doesn't map to functional bed geometry. The "WAVE" name describes paper wall structure (fluted) but the bottom is FLAT — a paper labeled "Wave" can be functionally equivalent to a paper labeled "Flat" in the same brewer. New lesson: **vendor naming should be treated as a hint, not ground truth, for geometry classification** (see Lesson #10 below).

3. **Pre-pull-1 calibration shot** — ✅ Validated. Saved scoring pulls. Chris's natural pace landed at 0:31 (1s over spec) on calibration; this informed the switch to checkpoint pacing for scoring. Without calibration, the +1s drift would have shown up mid-scoring run and required mid-protocol adjustment.

4. **Count-out-loud pour discipline** — ⚠️ **Partial transfer; lesson refined.** Chris found he could not verbalize every checkpoint while actively pouring ("a little hard to do while I'm doing it"). What ACTUALLY worked was **mental checkpoint tracking with verbal callouts where capacity allows**. Pours still landed accurately at the time targets. **Refining the lesson:** "checkpoint pacing" is the underlying technique; verbal narration is one optional implementation. Future protocol versions should rename or rescope this rule. **Forward pointer added to Project #1's protocol doc Notes section.**

5. **Auto-retest rule for noise-floor-edge filters** — ⚠️ Did not fire in this run. Pulls 4 and 6 landed at Δ = −10.5s with baseline range × 1.5 = 9s, so technically clear of threshold by 1.5s. The cross-confirmation between Pull 4 (FLAT FAST hand-fold) and Pull 6 (FLAT 2 FAST) — both at exactly 117s — provided strong evidence WITHOUT a retest. **New lesson: when two independent papers in the same fiber family land within the noise floor of each other, cross-confirmation can substitute for retest.** Worth codifying.

6. **Equipment cross-check granularity** — ✅ Validated AND extended. Surfaced three new substrate concerns:
   - **Brewer-variant ambiguity:** Chris owns both Orea Type-A Glass AND Orea Porcelain; both alias to "Orea v4" in registry but may not have identical internal geometry. Audit Item #5.
   - **Negotiator-base variant:** Project #1 didn't expose this. Project #2 forced a per-paper Negotiator-usage lock which became a load-bearing protocol variable.
   - **Paper size variant:** Project #2 surfaced that papers ship in multiple sizes (S, M) with operationally different bed-seat positions. Audit Item #9.

7. **Tool-call-per-pull pacing** — ✅ Validated. One pull, one report, one analysis turn was the right cadence. Batch-then-debrief would have lost the per-pull observation density that surfaced the geometry hypothesis mid-run.

8. **Grind comp band vs noise floor mismatch** — ✅ REPRODUCED. Project #1's APC4 edge case fires again on both FAST family papers (Δ = −10.5s, REAL but No-Comp). Tight noise floor (6s) + coarse comp band (15s) = 4 papers with consistent REAL deltas that translate to No-Comp recommendations. **The 15s band is too coarse for tight baselines.** Recommend exploring a ±10s tier in a future grind-comp table revision (deferred until Project #3 data adds another anchor point). Audit Item #8.

9. **`bedBehaviorUnderLoad` enum** — ✅ 4 values still sufficient. All 7 scoring pulls + 2 exploratory pulls landed within "late-forming-crater." No new enum value surfaced.

### New Lessons Specific to Flat-Bottom Characterization (NEW for #2)

10. **Vendor naming does not map to functional geometry.** Flat-bottom paper inventory has terminology drift that cone-paper inventory didn't surface. Sibarist's "WAVE" papers can be functionally flat-bottom; Orea-fitting papers may be designed for other brewers' geometry (April). **Step 0 must include a "functional geometry sanity check" beyond just reading SKU names.**

11. **Brewer-paper fit quality varies on the same brewer.** Project #1's cone scope had uniform paper-brewer fit (all cone papers seat in V60 the same way). Project #2 surfaces a **three-tier seating spectrum:**
    1. Native-fit (Sibarist FLAT family + Negotiator) → tight bed
    2. Free-seating (xBloom, WAVE B3) → cupcake shape, flat bottom only
    3. Oversized (April) → requires forced compression
    `FilterEntry.sealFitType` is paper-only; it needs a per-brewer-interaction dimension. Audit Item #3.

12. **Minimum cohort size for meaningful measurement.** April Paper Filter was deferred from Project #2 because it'd be a cohort-of-one in the Orea-baseline framing — single absolute drawdown number with no peer comparison. **Project #3's "per-paper absolute, no baseline" framing needs refinement:** absolute drawdown has value only if (a) there's longitudinal use (track paper-batch drift over time) OR (b) at least one peer paper shares the brewer. Capturing for Research Assistant SKILL.md scaffolding.

13. **`flowRate` is a triple, not a single paper attribute.** WAVE B3 + free-seating drains in 48.5s; FLAT B3 + Negotiator-compressed drains in 127.5s. Same fiber family (B3), 2.6× speed difference, single registry attribute claiming "Medium" for both. **The registry needs context-conditional flowRate** — either per-(paper, brewer, accessory) tuples, or separate inherent-vs-effective fields. Substrate change candidate. Audit Item #1.

14. **Booster (or any flow-modifying accessory) effect is paper-specific, not universal.** The Sibarist Booster 45 reduces B3 drawdown by 75s but FAST drawdown by only 12s. **Cannot assume an accessory has uniform effect across a paper line.** Future research-project designs on accessory testing need per-paper baseline measurement, not single-paper assumption.

15. **Hand-fold quality is a smaller variable than expected (with paper scoring).** FLAT FAST hand-fold and FLAT 2 FAST factory-fold landed at identical 117s. Paper scoring + Negotiator compression made hand-fold non-distinguishable from factory in this run. **Hand-fold is a viable technique, not a flow-handicap.** Worth registry-noting as a positive finding.

16. **Substantive theory generation happens mid-run, not pre-protocol.** Chris's micro-folds-friction hypothesis emerged from observing the seating-cluster gap during Pulls 5 and 6, not from pre-run thinking. The Booster test (Pull 8) became a hypothesis-validating experiment that turned into a hypothesis-revising experiment (Pull 9 forced revision). **Future protocols should leave space for mid-run hypothesis tests with explicit exploratory-pull budget** rather than locking sample-size + scope rigidly upfront.

17. **Pre-flight DB scan + alias-map audit should be Step 0 sub-step.** Project #2 surfaced that an alias-map collapse (FLAT 2 → FLAT FAST) had silently merged distinct products in brew history. Without this audit, the historical data interpretation is compromised. **Future projects: query alias map for the registry axis being tested as part of Step 0.**

18. **Vendor design intent is substrate context, not noise.** Discovering Sibarist's "Zero-Bypass" marketing for FLAT 2 reframed the friction-as-defect interpretation into friction-as-known-tradeoff. **Future research projects should capture vendor product framing as Step 0 substrate context** — it informs whether measurement findings represent "design working as intended" vs "design flaw."

19. **Paper size as a registry-relevant dimension.** Project #2 confounded a fiber comparison because two papers were tested in different sizes (B3 in S, FAST in M). Same paper line, two ship sizes, different brewer-seat behaviors. **Future protocols should record paper size in Step 0 alongside SKU, and matched-size pairings should be a controlled variable when fiber comparisons matter.**

### Pattern Lessons for Research Assistant SKILL.md (post-#2 combined with #1)

The substrate for the SKILL.md draft is now strong enough to scaffold. The Notes-section recommendation: defer scaffolding until Project #3 closes regardless — cone/flat/specialty trifecta will reveal pattern lessons that two domains can't. Suggested skill scope when scaffolding fires:

- **Step 0 framework**: load-bearing inventory cross-check with photo confirmation, SKU sanity check, alias-map audit, brewer-variant + accessory disambiguation, paper-size disambiguation, vendor-design-intent capture
- **Pre-pull-1 calibration as standard primitive**: 1 untimed shot before any scoring, with explicit iteration loop if config diverges from spec
- **Checkpoint pacing technique**: rename from "count-out-loud" to "checkpoint pacing" with optional verbal narration
- **Auto-retest rule with cross-confirmation alternative**: if two independent measurements within a same-family cohort land within noise floor of each other, cross-confirmation substitutes for retest
- **Band-vs-noise-floor mismatch detection**: explicit check at analysis-time for tight-baseline + coarse-band situations; flag for protocol-table revision rather than silently accepting No-Comp recommendations
- **Mid-run hypothesis test framework**: budget for ~2 exploratory pulls beyond formal protocol; structured as "predicted outcomes" table before execution
- **Substrate-change extraction at close-out**: every research project's close-out should produce a queued audit-item list, not just data results
- **Cohort-size epistemic check**: absolute single-paper measurements need either longitudinal use or peer cohort to be meaningful
- **Vendor-naming-vs-functional-geometry gap as a recurring audit pattern**: every taxonomy that touches vendor-named products needs a "functional geometry sanity check"
- **Confound detection in same-family comparisons**: when comparing two items within the same product family, explicitly check all variable dimensions (size, packaging, generation) before attributing observed deltas to the named variable (fiber, material, etc.)

---

## Substrate-Practice Gap Audit Items (queued, not blocking close-out)

1. **`FilterEntry.flowRate` schema reshape** — Current shape is a single qualitative string per paper. Real flow rate is a triple (paper × brewer × seating-state). Proposed shape change: introduce `flowRateContexts: { brewer: string, seatingState: 'compressed'|'free-seating', accessory?: string, measuredDrawdownSec: number }[]` array, with the existing `flowRate` string kept for back-compat as a default-context summary. Substantive enough to warrant an ADR. **Trigger condition for action:** when Project #3 generates the third independent confirmation of context-dependence, or when a brewing-side query needs context-conditional flowRate.

2. **`WAVE B3.paperShape` audit** — Currently `"Wave"`. Project #2 data shows it's functionally a flat-bottom paper (drains 48.5s free-seated in flat Orea; cupcake walls similar to xBloom). Possible fix: rename to `"Flat (free-seating)"` OR add a separate `wallStructure` field (smooth / fluted / engineered) so `paperShape` describes bed geometry only. **Trigger:** when Project #3 (or future) needs paperShape-based queries that would mis-route WAVE-named papers.

3. **`paperShape` vs `wallStructure` decomposition** — Related to #2 but broader. Current single field conflates bed geometry with wall structure. Cone vs Flat vs Wave-bed are bed-geometry distinctions; smooth-wall vs fluted-wall vs engineered-pleated are wall-structure distinctions. Worth a small ADR if the schema reshape lands. **Trigger:** when registry-level cross-paper queries need either dimension independently.

4. **Booster as registry concept** — `Booster 45` is currently invisible to the registry — it's an Orea accessory that modifies the brewer-paper interaction. Two options:
   - (a) Add `Accessory` as a new top-level concept with its own registry (BoosterEntry / NegotiatorBaseEntry / etc.), with measurement effects recorded per-paper-pair
   - (b) Roll into `BrewerEntry.accessories` field as a structured object instead of free-text
   **Trigger:** when Chris brews regularly with Booster, OR when a second flow-modifying accessory enters inventory.

5. **Orea Type-A Glass vs Type-B Porcelain canonicalization** — Both currently alias to "Orea v4." Project #2's exploratory work didn't validate whether they have identical internal geometry; Chris locked to Glass for this run. Worth a brief audit: open both physical brewers, measure bed dimensions side-by-side. If identical, alias is fine. If different (likely), split into two canonical entries with the existing "Orea v4" retained as an umbrella alias. **Trigger:** when a brew records cup behavior that doesn't match the expected profile, with cross-brewer variance as a candidate cause.

6. **April Paper Filter remeasurement trigger** — Currently deferred from Project #2 (cohort-of-one in Orea baseline). Re-eligible when EITHER (a) a second April-fit paper enters inventory OR (b) Project #3 native-brewer protocol covers it via the April brewer with peer papers.

7. **Brew history alias-collapse audit** — The pre-existing FLAT 2 → FLAT FAST alias-map collapse means any historical `brews` rows logged with "FLAT 2" SKUs were canonicalized to "FLAT FAST." Diagnostic SQL pass needed: `SELECT id, filter, created_at, notes FROM brews WHERE filter = 'FLAT FAST' AND created_at > <FLAT 2 product launch date>;` to identify which rows may actually be FLAT 2 FAST. **Trigger:** before doing any flow-related synthesis or cross-brew analytics that depend on filter identity.

8. **Grind-comp table band revision** — Project #1's APC4 + Project #2's both-FAST-papers all land "REAL by Step 2, No-Comp by Step 3." The 15s comp band is too coarse for tight baselines. Proposed: add a ±10s tier ("Marginally faster/slower, 0.1-0.2 notch") between the current None and 0.3-notch buckets. **Trigger:** when Project #3's data adds a third independent anchor that's clear of the 15s band but inside a hypothetical 10s tier.

9. **Size confound in Project #2's B3-vs-FAST comparison.** FLAT 2 B3 was tested in size S; FLAT 2 FAST in size M. The 10.5s delta and the Booster asymmetry cannot be cleanly attributed to fiber alone. **Trigger for resolution:** acquire matched-size pair (B3 in M or FAST in S) for a clean fiber-only comparison. Low-priority if the per-fiber operational distinction stays small in Chris's actual brewing.

---

## Open Data Items

1. **Pull 4 paper size (FLAT FAST hand-fold)** — Chris hand-folded one sheet of the original FLAT FAST product line. Paper size used in that pull is not recorded. Affects Finding 7's cross-confirmation interpretation: if size M (matching Pull 6), the 117s match is clean fiber-confirmation; if size S (matching baseline), cross-confirmation has size component and is even more interesting. Not blocking close-out — file under "answer when convenient."

---

## Project #3 Design Inputs

- **April Paper Filter** deferred from Project #2; eligible for #3 with native April brewer
- **"Per-paper absolute, no baseline"** framing of #3 needs cohort-size refinement (see Lesson 12 + Audit Item #6)
- **Brewer-paper-accessory-size quadruple** makes "single drawdown number" misleading; #3 should record full configuration tuple per measurement
- **WAVE family scope question:** WAVE B3 / WAVE FAST / Kalita Wave 155 / Hario Flow / Cafec Wave 250 may need scope decision — are they "Wave" (defer to #3) or "Flat" (already covered in #2)? Project #2 surfaced this is functionally a flat-bottom paper question for the cupcake-walled variants. **Recommend Chris make a per-paper call rather than blanket "all wave defers to #3."**
- **Suggested future exploratory pull** (Project #2b sub-task, if bandwidth): Original FLAT FAST (hand-fold) + Negotiator + Booster 45. Tests whether Sibarist's "zero-bypass design improvement" between FLAT and FLAT 2 affects Booster response. If old-FLAT-FAST + Booster lands much faster than FLAT 2 FAST + Booster (105s), the friction Booster addresses is a FLAT 2 design feature; if similar, Booster effect is fiber-driven.
