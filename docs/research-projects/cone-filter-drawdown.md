# Cone Filter Drawdown Characterization (Research Project #1)

*Coffee Research · Latent · Research Project*

**Version:** 3.0 (close-out)
**Date drafted:** 2026-05-21
**Date executed:** 2026-05-23
**Status:** CLOSED
**Home EG-1**

---

## Project Context

This is **Research Project #1** - the first project run under the (still-deferred) Research Assistant skill. Dry-run for what long-running research projects look like in this codebase: a finite-scope characterization campaign that produces a markdown reference doc + a registry extension when closed.

Sits at the head of a 3-project arc (sharing protocol template, differing in baseline + controlled brewer):

| Project | Brewer (constant) | Baseline filter | Status |
| :---- | :---- | :---- | :---- |
| **#1 - Cone Filter Drawdown** (this doc) | Hario V60 Glass (V60-01) | Sibarist CONE B3 | ✅ CLOSED 2026-05-23 |
| #2 - Flat-bottom Filter Drawdown | Orea v4 (or whichever flat is most-used) | TBD (Orea B3 candidate) | Queued |
| #3 - Specialty / Paired Filter Drawdown | Per-paper native brewer (UFO, Chemex, Deep27, HALO) | None (per-paper absolute) | Queued |

The bucketing is geometry-driven: cone, flat, and specialty papers can't be characterized in the same brewer without bed-geometry confounds, so each project owns its own controlled brewer + baseline.

---

## TL;DR (Headline Findings)

12 pulls executed (3 calibration scrap + 7 official non-baseline + 3 B3 baseline + 2 re-tests). Noise floor locked at 8s with B3 median ~60s. **3 real deltas, 4 indistinguishable** out of 7 non-baseline filters.

**Headline finding:** The Cafec roast-specific paper pair (LC4 light, DC4 dark) shows registry-contradicting flow ordering that aligns with community-stated design philosophy — light paper is engineered slow (LC4 measured +20s slower than B3), dark paper is engineered fast (DC4 measured indistinguishable from B3, +7-8s). Registry's qualitative `flowRate` cells are unreliable for brewing decisions on this paper family; `measuredDrawdownSec` is the load-bearing replacement.

See "Headline Findings" section below for the full surface.

---

## Purpose

Build a calibrated flow map of home cone filters so filter choice becomes a quantified extraction lever, not a gut read. The test isolates filter resistance by controlling every other variable (dose, grind, temperature, pour, water) and uses Sibarist CONE B3 as the measurement anchor (chosen for its extremely stable flow consistency, not for highest usage frequency).

**Outputs (all delivered at close-out):**

1. ✅ Median drawdown value (seconds) for each tested cone filter, recorded in the Recording Sheet below.
2. ✅ Grind compensation table (half-notches finer/coarser vs B3) for swapping filters within a recipe.
3. ✅ `FilterEntry` type extension in [lib/filter-registry.ts](../../lib/filter-registry.ts): new fields `measuredDrawdownSec` / `measurementDose` / `measurementBaseline` / `measurementDate` / `measurementProject` / `bedBehaviorUnderLoad` (4-value enum). Populated for the 8 tested filters; remaining filters left `undefined`.
4. ✅ Updates to [docs/skills/brewing-equipment-expert/cluster/filters.md](../skills/brewing-equipment-expert/cluster/filters.md) — measured-drawdown surfaced + Cafec contradiction call-out.

---

## When to Run

Run once as a calibration exercise. Re-run only if:

- (a) A new cone filter is added to inventory.
- (b) A filter lot/batch changes (Sibarist occasionally adjusts paper specs).
- (c) A brew reads surprisingly fast or slow on a known filter, suggesting a lot change.

---

## Scope

Cone-shape filters only. Hario V60 Glass (V60-01 size) as the controlled brewer throughout. All owned V60-compatible cone papers in scope regardless of paper-size standard (V60-01 or V60-02), because V60-01 and V60-02 share the same cone geometry (60° apex angle); only paper area differs.

Flat-bottom + UFO-class + Chemex / HALO / Deep27 papers deferred to projects #2 and #3.

**Geometry check (deferred):** The protocol staged a built-in geometry check via the Cafec T-92 series in both sizes (LC4 = V60-02, LC1 = V60-01). Step 0 inventory cross-check revealed LC1 is NOT in Chris's inventory — Chris owns Cup 4 only across the entire CAFEC roast-specific family. The V60-01/V60-02 same-geometry scope assumption was asserted but empirically unvalidated within this project. Documented as deferred follow-up; re-run when any Cup-1 CAFEC paper enters inventory.

---

## Step 0 - Inventory Cross-Check (LOAD-BEARING) — EXECUTED

**Outcome:** 8 filters in scope (down from protocol's starting 11). 6 registry drifts caught — 3 to flip owned: false, 2 to flip owned: true (via 4-pack assortment), 1 schema decision (assortment-pack handling).

### Final test scope (8 filters)

| # | Filter | SKU | Size | Step 0 outcome |
| :---- | :---- | :---- | :---- | :---- |
| 1 | Sibarist CONE B3 | CONE-B3 | V60-02 | ✅ Confirmed (3 replicates) |
| 2 | Sibarist CONE FAST | CONE-FAST | V60-02 | ✅ Confirmed |
| 3 | CAFEC T-92 LC4 | LC4-100W | V60-02 | ✅ Confirmed (3× 100-packs standalone + 1× 40-pack from assortment) |
| 4 | CAFEC T-90 MC4 | MC4-40W (from assortment) | V60-02 | ✅ Confirmed (1× 40-pack from assortment only) |
| 5 | CAFEC T-83 DC4 | DC4-40W (from assortment) | V60-02 | ✅ Confirmed (1× 40-pack from assortment only) |
| 6 | CAFEC Abaca+ APC4 | APC4-100W standalone + APC4-40W from assortment | V60-02 | ✅ Confirmed (2× 100-packs standalone + 1× 40-pack from assortment) |
| 7 | Hario V60 Meteor 02 | METEOR-02 | V60-02 | ✅ Confirmed |
| 8 | Hario V60 Paper Filter 01 (Tabbed) | VCF-01-100W | V60-01 | ✅ Confirmed |

### Cut from protocol's starting list (3 items)

- **Hario VCF-01 Untabbed** (VCF-01-100M) — not physically present; never owned. Registry drift.
- **CAFEC Abaca+ Cup 1** (APC1-100W) — not physically present; registry was wrong. Chris owns the Cup 4 Abaca+ (APC4-100W), not the Cup 1.
- **CAFEC T-92 LC1 "slow"** (LC1-100W) — not physically present. Chris owns no Cup-1 (V60-01) CAFEC papers at all. This kills the geometry-check pair (LC4 vs LC1) — see Scope section.

### Naming-convention confusion surfaced

The Step 0 cross-check surfaced that Chris was initially confused about the CAFEC `LC1/LC4 + MC1/MC4 + DC1/DC4 + APC1/APC4` SKU naming convention — the 1 vs 4 encodes paper **size** (Cup 1 = V60-01; Cup 4 = V60-02), not roast spec. Without physical confirmation, the LC1 row would have been carried into the test even though no Cup-1 CAFEC paper is in the drawer. The protocol's starting-list table named SKUs but didn't explain the encoding. **Substrate-extraction lesson:** Step 0 templates should require physical-photo confirmation of every owned-flag-true entry, not transcript / verbal claim.

### Registry edits applied (close-out PR)

In-scope for this project (V60-compatible cone filter registry hygiene):

1. **Flipped `owned: false`:**
   - `VCF-01-100M` (Hario Untabbed) — never owned
   - `APC1-100W` (Abaca+ Cup 1) — not owned (owned the Cup 4 100-pack instead)
   - `LC1-100W` (T-92 Cup 1) — not owned
2. **Flipped `owned: true`** (assortment-pack provenance noted in primaryUseCase):
   - `MC4-100W` (Cup 4 Medium Roast) — owned via 4-pack assortment (40-pack variant)
   - `DC4-100W` (Cup 4 Dark Roast) — owned via 4-pack assortment (40-pack variant)
3. **Assortment-pack handling decision:** one registry row per paper formulation; pack-size is metadata in `primaryUseCase` note. Did NOT create separate `*-40W` rows for the assortment-pack constituents. APC4-40W's `primaryUseCase` updated to flag "Owned in both 40-pack assortment and 100-pack standalone."

Out-of-scope for this project (queued for separate follow-up PR):

4. Add `FS-100` (Chemex Bonded Pre-folded Squares) — surfaced by Chris's inventory cleanup
5. Rename `CONE28-FAST` → `CONE-28-30-FAST` ("CONE 28-30º FAST") — Sibarist's official product name
6. Verify Chemex `CHEMEX-HM-W` → FP-2 SKU per Chemex's product page

---

## Equipment Required — Actual Locked Config

| Variable | Protocol spec (v2.1) | Actual locked (v3.0 close-out) |
| :---- | :---- | :---- |
| Brewer | Hario V60 Glass (V60-01) | ✅ Same |
| Dose | 15.0g ± 0.1g | ✅ Same |
| Grind | EG-1 6.5 | ✅ Same |
| Water | Tap (Los Altos Hills) | ✅ Same |
| Temperature | 93°C | ✅ Same |
| Filter pre-rinse | Full rinse ~200g near-boiling | ✅ Same |
| Dispersion | "Melodrip" (unspecified model) | **Custom glass Melodrip (bigger holes than standard plastic Melodrip)** |
| Pour pace | 250g over 30s | **250g over 30s via count-out-loud discipline (50/100/150/200/250 at 6s intervals)** |
| Agitation | None | ✅ Same |
| Coffee | Single bag or single pre-blended batch | **Blend of 3 non-reference Sudan Rume Hybrid Washed batches (different roast profiles, same green lot), mixed at project start** |
| Endpoint criterion | "no visible standing water; bed matte" | **Sharpened to: specular → diffuse reflection transition (standing water dome gone, bed surface scatters light not reflects)** |

### Calibration Arc (3 scrap pulls before official sequence)

The protocol assumed standard plastic Melodrip. Chris's actual instrument is custom glass with bigger holes. This caused a 2-pull calibration arc before the official sequence:

| Pull | Setup | Result | Status |
| :---- | :---- | :---- | :---- |
| 1 | Glass Melodrip + ~0:20 pour (natural Chris cadence with bigger-hole device) | CONE B3 drawdown ~60s, large pour-impact crater, ambiguous endpoint | SCRAP — controlled vars not yet locked |
| C | OXO rapid brewer dispersion screen + ~0:15 pour | CONE B3 drawdown ~50s, EVEN BIGGER crater than Pull 1 | SCRAP — dispersion device swap made bed worse, not better |
| C2 | Glass Melodrip + DELIBERATE 0:30 pour via count-out-loud | CONE B3 drawdown ~54-55s, uniform bed, clean endpoint | LOCKED as official B3 rep 1 |

**Key insight from calibration arc:** Pour rate was the dominant variable, not dispersion device. Both Chris's dispersion-class devices (glass Melodrip + OXO screen) were pour-rate-permissive at his natural cadence. Forcing 0:30 via count-out-loud discipline stabilized the bed. **Substrate-extraction lesson:** equipment cross-check must include "does the device actually rate-limit the pour, or is operator discipline doing the work?"

---

## Method — Per-Pull Procedure (as executed)

1. Place V60 Glass on scale with empty server. Tare.
2. Insert filter. Pre-rinse with ~200g near-boiling water. Discard rinse water. Dump server. Tare again.
3. Add 15.0g pre-ground coffee. Level bed gently by tapping V60 side (no stir, no shake).
4. Attach Melodrip. Confirm kettle at 93°C.
5. Start timer. Begin Melodrip pour via count-out-loud cadence: 50g at 0:06, 100g at 0:12, 150g at 0:18, 200g at 0:24, 250g at 0:30.
6. When scale reads 250g, lift Melodrip. Note pour-end time (should be ~0:30).
7. Observe bed. **Drawdown complete = specular → diffuse reflection transition (standing water dome gone, bed surface scatters light not reflects).**
8. Stop timer at drawdown complete. Record total time (pour start → drawdown complete).
9. Record observations: any channeling, bed tilt, drainage patterns, fines migration, paper deformation, crater mechanism (pour-impact vs late-forming).
10. Dump bed. Rinse V60 Glass. Allow brewer to cool slightly. Reset kettle to 93°C if drifted. Next pull per randomized sequence.

---

## Recording Sheet — Final Data (12 official pulls + 3 scrap)

### B3 Baseline (3 replicates)

| Filter | Pull 1 (s) | Pull 2 (s) | Pull 3 (s) | Median (s) | Range (s) | Notes |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| Sibarist CONE B3 | 54-55 (C2) | 60-62 (Pull 4) | 59-60 (Pull 8) | ~60 | 8s | Bed behavior varied across reps (uniform → mini-crater → late-forming crater) at locked controlled vars; possible per-pull thermal / paper-batch / bed-laying noise that the 8s drawdown range absorbs. |

### Other Cone Filters

| Pull(s) | Filter | SKU | Size | Median (s) | Notes |
| :---- | :---- | :---- | :---- | :---- | :---- |
| 2 | Hario V60 Paper Filter 01 (Tabbed) | VCF-01-100W | V60-01 | 64-65 | Mini-crater. Registry's seal "Loose" may explain bed variability. |
| 3 | CAFEC T-90 MC4 (Cup 4 Medium Roast) | MC4-40W | V60-02 | ~60 | Mini-crater. Pour-end 0:28 (within tolerance). |
| 5 | Sibarist CONE FAST | CONE-FAST | V60-02 | 44-45 | Mini-crater. Pour-end 0:28. |
| 6 | CAFEC Abaca+ APC4 (Cup 4) | APC4-100W | V60-02 | ~72 | Late-forming crater during drawdown — distinct mechanism from pour-impact crater. |
| 7 | Hario V60 Meteor Filter 02 | METEOR-02 | V60-02 | 64-65 | Late-forming crater, less pronounced than APC4. |
| 9 + 9R | CAFEC T-92 LC4 (Cup 4 Light Roast) | LC4-100W | V60-02 | ~80 (2-rep median: 85 + 75) | Re-test ran due to surprising magnitude on first pull. Paper felt noticeably thinner in hand than other Cafec papers. |
| 10 + 10R | CAFEC T-83 DC4 (Cup 4 Dark Roast) | DC4-40W (from assortment) | V60-02 | ~67-68 (2-rep median: 70-71 + 64-65) | Paper did NOT feel thicker than LC4 in hand — contradicts registry's `thickness: "Thick"` cell on DC1/DC4. |

### Test Coffee Composition

- Blend of 3 non-reference Sudan Rume Hybrid Washed batches (different roast profiles, all from the same green lot), mixed at project start.
- Single-blend coffee held across all 12 pulls.
- Grind batch: all 12 doses (~180g into labeled containers) ground at EG-1 6.5 in one session at project start. 2-3g purge between batches.

---

## Analysis (executed)

### Step 1 — Validate Baseline ✅ PASS

B3 3-pull range: **8s**. PASS (protocol threshold: ≤15s usable, ≤20s acceptable). No re-run triggered. Noise floor anchored at 8s; B3 median ~60s.

### Step 2 — Compute Deltas Against B3

`Δ seconds = filter X measurement - B3 median (60s).` Real/indistinguishable rule: `|Δ| > 8s` = real; `|Δ| ≤ 8s` = indistinguishable.

### Step 3 — Translate Real Deltas to Grind Compensation

| Filter | Δ (s) | Real? | Comp table band | Grind Compensation |
| :---- | :---- | :---- | :---- | :---- |
| Hario VCF-01 Tabbed | +4 to +5 | No | (n/a) | None |
| CAFEC T-90 MC4 | 0 | No | (n/a) | None |
| Sibarist CONE FAST | -15 to -16 | Yes | -15 to -30 (moderately faster) | 0.3 notch finer (EG-1 6.5 → ~6.2) |
| CAFEC Abaca+ APC4 | +12 | Yes | -15 to +15 (functionally equivalent on comp table) | None ⚠️ (flagged for empirical re-test — see below) |
| Hario Meteor 02 | +4 to +5 | No | (n/a) | None |
| CAFEC T-92 LC4 | +20 | Yes | +15 to +30 (moderately slower) | 0.3 notch coarser (EG-1 6.5 → ~6.8) |
| CAFEC T-83 DC4 | +7 to +8 | No (reclassified after re-test from REAL → indistinguishable) | (n/a) | None |

⚠️ **APC4 note:** Step 2 classifies APC4 as REAL slower (outside the 8s noise floor). Step 3's grind comp table classifies +12s as "functionally equivalent" (within ±15s band). The two analysis layers diverge here. Resolution: ship "None (flagged for empirical re-test)" and document the band-vs-noise-floor mismatch in the Notes section — the grind comp table's 15s granularity is coarser than this project's 8s noise floor.

---

## Output Summary (populated)

| Filter | Size | Measurement (s) | Δ vs B3 | Real? | Flow Tier | Grind Compensation |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| Sibarist CONE B3 | V60-02 | ~60 (median) | 0 (baseline) | - | Medium (anchor) | None (reference) |
| Sibarist CONE FAST | V60-02 | 44-45 | -15 to -16 | Yes | Faster | 0.3 notch finer |
| CAFEC T-92 LC4 | V60-02 | ~80 | +20 | Yes | Slower | 0.3 notch coarser |
| CAFEC Abaca+ APC4 | V60-02 | ~72 | +12 | Yes | Slower (within comp-table band) | None (flag for future re-test) |
| Hario V60 Meteor 02 | V60-02 | 64-65 | +4 to +5 | No | Medium (= B3) | None |
| Hario VCF-01 Tabbed | V60-01 | 64-65 | +4 to +5 | No | Medium (= B3) | None |
| CAFEC T-90 MC4 | V60-02 | ~60 | 0 | No | Medium (= B3) | None |
| CAFEC T-83 DC4 | V60-02 | ~67-68 | +7 to +8 | No | Medium (= B3) | None |

This table answers: *"I have a Clarity-First recipe written for B3 but I want to use Abaca APC4 tonight — what do I adjust?"* Answer comes straight from the row. For filters classified Real, apply the grind compensation; for indistinguishable, no recipe adjustment needed.

---

## Headline Findings

### 1. The Cafec roast-specific paper pair inverts the registry's flow ordering

| Paper | Registry direction | Measured | Community-stated design intent |
| :---- | :---- | :---- | :---- |
| T-92 LC4 (light) | flowRate: "Fast", thickness: "Thin" | +20s slower than B3 | Light paper engineered SLOW → extend extraction on hard-to-extract light roasts |
| T-83 DC4 (dark) | flowRate: "Slow", thickness: "Thick" | Indistinguishable from B3 (+7-8s) | Dark paper engineered FAST → shorten extraction on easy-to-extract dark roasts |

Measurement validates the community-stated design philosophy and refutes the registry's qualitative cells. Cafec's product labels describe extraction **outcome** ("Fast extraction for light roast") rather than flow physics; the registry transcribed those as `flowRate: "Fast"` which inverts the actual loaded-bed flow direction. This is the strongest empirical justification for `measuredDrawdownSec` as a load-bearing `FilterEntry` field — the existing qualitative cells are unreliable for brewing decisions on this paper family.

### 2. Discord "poor man's Sibarist" framing — direction validates, magnitudes don't

Community quote: *"Cafec dark = poor man's Sibarist FAST; Cafec light = poor man's Sibarist B3."* Measured:

- Cafec DC4 (67-68s) vs Sibarist FAST (44-45s) — **23s gap; DC4 not equivalent to FAST in speed**
- Cafec LC4 (80s) vs Sibarist B3 (60s) — **20s gap; LC4 slower than B3, not equivalent**

Refined finding: Cafec's roast-specific papers express the same engineered-flow-rate design philosophy as Sibarist's FAST/B3 pair, but operate shifted slower across the board. Cafec dark ≈ B3 speed; Cafec light ≈ slower than B3. The "poor man's Sibarist" mental model is useful for direction but doesn't substitute for measurement on magnitude.

### 3. Registry's qualitative flowRate cells are unreliable

Of 7 non-baseline filters tested, only Sibarist CONE FAST aligned with its registry `flowRate: "Very fast"` cell. Every other "Fast"-labeled paper measured indistinguishable from B3 or slower:

| Filter | Registry flowRate | Measured vs B3 |
| :---- | :---- | :---- |
| CONE FAST | "Very fast" | -15 to -16 (REAL faster) ✅ |
| T-92 LC4 | "Fast" | +20 (REAL slower) ❌ |
| Abaca+ APC4 | "Fast" | +12 (REAL slower) ❌ |
| Meteor 02 | "Fast" | +4-5 (indistinguishable) ❌ |
| T-90 MC4 | "Medium-fast" | 0 (indistinguishable) ⚠️ |
| Hario Tabbed | "Medium" | +4-5 (indistinguishable) ✅ |
| T-83 DC4 (registry: DC1 "Slow") | "Slow" | +7-8 (indistinguishable) ❌ |

**Conclusion:** The registry's qualitative `flowRate` cells appear to be sourced from manufacturer marketing claims (which describe paper properties, clean-water flow, or extraction outcome — not loaded-bed flow). The `measuredDrawdownSec` field is the load-bearing replacement going forward.

### 4. Bed-behavior-under-load is a distinct property axis worth registering

A second crater mechanism surfaced during the test: **late-forming bed compaction during drawdown** (vs. pour-impact crater at pour-start). First clearly observed on Abaca+ APC4 (Pull 6), then in milder form on Meteor 02 (Pull 7), B3 rep 3 (Pull 8), LC4 (Pull 9 + 9R), DC4 (Pull 10 + 10R). Spectrum, not binary — not unique to abaca fiber. Captured as new `bedBehaviorUnderLoad` enum cell on `FilterEntry`, parallel to `flowRate`. Predicts which filters benefit from coarser grind regardless of nominal flowRate.

### 5. The owned filter inventory clusters narrowly in the "Clarity cone" archetype

Sibarist B3 + FAST sit alone at the fast end. 4 of 7 non-baseline filters cluster in the 60-72s band — 12-second window. The within-archetype variance is narrow at the locked dose/grind. Most filter-swap decisions in Chris's inventory are operationally tiny grind tweaks, not recipe rewrites. The "Clarity cone" archetype dominates because Chris's inventory dominates in it. Projects #2 (flat) and #3 (specialty/paired) will likely show wider intra-archetype spreads.

---

## Close-Out (Exit Conditions)

Project #1 closed when ALL of these passed:

1. ✅ **Step 0 inventory cross-check resolved.** Registry matches physical drawer for V60-compatible cone filters; 6 drift items reconciled in registry (3 to false, 2 to true with assortment-pack notes, 1 schema decision locked).
2. ✅ **All in-scope filters have a measurement** OR an explicit "couldn't test" note. 8 of 8 in-scope filters measured.
3. ✅ **B3 baseline has 3 valid replicates** with range ≤20s. Range came in at 8s, well under threshold. No re-run triggered.
4. ✅ **Output summary table fully populated.**
5. ✅ **`FilterEntry` extension shipped.** 6 new fields on the type (`measuredDrawdownSec` + `measurementDose` + `measurementBaseline` + `measurementDate` + `measurementProject` + `bedBehaviorUnderLoad` 4-value enum). Measured values populated for the 8 tested filters; remaining filters left `undefined`.
6. ✅ **`docs/skills/brewing-equipment-expert/cluster/filters.md` updated** with measured-drawdown surface + Cafec contradiction call-out.
7. ✅ **This protocol doc filed** as the project's canonical record (this file + populated tables IS the archive).
8. ⚠️ **Geometry-check pair (T-92 LC4 vs LC1) DEFERRED.** LC1 not in inventory; Chris owns Cup 4 only across the entire CAFEC roast-specific family. The V60-01/V60-02 same-geometry scope assumption was asserted but empirically unvalidated within this project. Re-run when any Cup-1 CAFEC paper enters inventory.

After close-out: protocol section is reusable (with baseline + brewer swap) as the template for project #2 (flat-bottom) and project #3 (specialty/paired). The calibration-arc lessons + naming-convention notes + photo-confirmation requirement should bake into project #2's Step 0.

---

## Known Confounders & Limitations

- **This tests flow through a loaded bed with active drawdown** — not clean-water flow through a filter alone. Deliberate; the operationally-relevant signal.
- **Paper lot variability is real**, especially with Sibarist. If the same filter retests dramatically differently months later, suspect lot change first.
- **Bed geometry varies by dose.** This project uses 15g; results may not translate precisely to 12.5g (small-dose) or 18g brews. Expect faster drawdowns at smaller doses across all filters, but relative ordering should hold.
- **Temperature drift during the test** (kettle cooling, V60 warming) introduces ~2-3s noise. The 3-replicate B3 range absorbs most of this and sets the band.
- **Fines loading changes across filters.** A FAST passes more fines through; a structured paper (B3, T-92) holds them back and compresses the bed more over time. Captured via the new `bedBehaviorUnderLoad` axis.
- **Single-replicate measurements on non-baseline filters cannot distinguish** "truly identical to baseline" from "slightly different but within the noise floor." Trade-off for operational tractability. DC4's first-pull single rep ended up edge-of-noise-floor and was re-tested; final classification: indistinguishable.
- **V60-02 papers used in V60-01 brewer** — same cone geometry per Scope assumption; excess paper area folds up the brewer wall above the bed line. Empirically unvalidated this project (geometry-check pair deferred); re-test when a Cup-1 CAFEC paper enters inventory.
- **Cafec roast-specific paper labels invert loaded-bed flow direction** (see Headline Finding #1). The registry's qualitative `flowRate` cells should not be trusted for this paper family; use `measuredDrawdownSec` instead.

---

## Notes for Future Research-Project Pattern

*(Filled in at close-out. These accumulated through the execution session and inform Research Assistant's eventual SKILL.md.)*

**Protocol-doc shape that worked / didn't:**
- Starting-list table that names every SKU was useful but should include an inline note on naming conventions when SKU encoding carries non-obvious semantics (size codes, roast codes, etc.). Future research-project templates should add a "SKU naming notes" sub-section to Step 0.
- Operator confused `LC1/LC4 + APC1/APC4 + MC1/MC4 + DC1/DC4` as roast-spec-only encoding without realizing the 1/4 digit encodes paper SIZE (Cup 1 = V60-01; Cup 4 = V60-02). Step 0's physical-photo-confirmation step caught the misclassification.

**Step 0 inventory cross-check value:**
- Caught 6 registry drifts on the first run + surfaced a naming-convention misunderstanding. Without photo confirmation, the LC1 row would have been carried into the test scope even though Chris owns no Cup-1 CAFEC papers. The geometry-check pair concept would have been planned around a paper that doesn't exist.
- **Load-bearing framing validated** — would not have surfaced without the lay-them-out-physically step.

**Tiered sampling worked? Need adjustment?:**
- 3-replicate B3 baseline + 1-replicate non-baseline tiered design worked as designed for filters with clear deltas (CONE FAST, LC4).
- For noise-floor-edge filters (DC4 at +10 single-rep collapsed to +7-8 with re-test → reclassified REAL → indistinguishable), the single-rep design missed the reclassification on first pass.
- **Recommended adjustment:** at close-out, identify filters whose single-rep delta is within 1.5× the B3 range and re-test those automatically. Budget +1-2 extra pulls upfront for edge cases.

**What was harder than expected:**
- Pour pace deviation surfaced on Pull 1 — protocol spec 0:30 to 250g, actual ~0:20 with operator's custom glass Melodrip (bigger holes than standard plastic). Forced an explicit calibration arc (Pulls 1 + C + C2). Future templates should include a "pre-pull-1 calibration shot" line in Setup — one untimed Melodrip pour at protocol pace to surface deviations before they become a 10-pull problem.
- Slow pour produced shorter drawdown than fast pour, opposite of intuition. Mechanism: fast pour creates crater → water pool above bed → pool drains last → matte transition delayed. **Conclusion: bed disturbance inflates drawdown time, not reduces it.** Filter rankings under noisy pour would skew toward slower.
- Pour rate emerged as the dominant variable, not dispersion device. Operator's two dispersion-class devices (glass Melodrip + OXO screen) were both pour-rate-permissive. Discipline (count-out-loud) did more work than instrument choice.

**What was easier than expected:**
- Count-out-loud pour discipline ("50/100/150/200/250" at 6-second intervals) gave real-time feedback and corrected mid-pour without losing rhythm. Future research-project templates should make count-out-loud an explicit operational technique line in Per-Pull Procedure, not implicit. **Refined post-Project #2 (2026-05-24):** the underlying technique is "checkpoint pacing" — verbal narration is one optional implementation, but mental checkpoint tracking with selective verbal callouts where capacity allows also works (Chris found pure verbalization hard mid-pour). See [flat-bottom-filter-drawdown.md](flat-bottom-filter-drawdown.md) Notes section Lesson #4.
- Operator preferred running pulls one-at-a-time in the thread rather than batch-and-summarize-later — *"so I don't have to remember everything on my side."* The thread acted as live recording-sheet + observation-capture + decision-log simultaneously. **Future Research Assistant skill should default to tool-call-per-pull pacing, not "run all 10 then debrief."**
- B3 noise floor came in at 8s — tighter than the protocol's expected ≤15s threshold and tighter than forecast. Sibarist's "Extremely stable" `flowConsistency` registry cell measured up.
- Operator self-surfaced an instrument deviation between Pull 1 and Pull 2 (*"I should mention I have a custom glass Melodrip"*) and proposed a corrective calibration. Step 0's "lay them out physically" framing primes self-audit; future templates should encourage operators to verbalize equipment provenance unprompted.
- Operator brought community knowledge (Discord forums on Cafec design philosophy; "poor man's Sibarist" mental model) that contextualized the headline finding. **Research Assistant skill should explicitly invite operator-side community knowledge as a pre-test framing input.**

**What the close-out criteria missed:**
- Equipment cross-check needs more granularity than "owns Melodrip Y/N." Specific model + hole-size + dispersion characteristics matter. Future templates should require a pre-pull-1 equipment calibration step that runs ONE untimed pull and inspects bed disturbance + endpoint clarity before any scoring pulls happen.
- Geometry-check pair (LC4 vs LC1) was tied to a specific paper Chris doesn't own. Future templates should treat geometry-check pairs as conditional on Step 0 verification, with a documented "skip + deferred follow-up" path when the pair half is missing.
- **The grind comp table's ±15s "functionally equivalent" middle band is coarser than this project's 8s noise floor.** APC4's +12s landed REAL per Step 2 but "no comp" per Step 3. Future templates should reconcile these two analysis layers — either tighten the grind comp bands when the noise floor is tighter than 15s, or document the gap explicitly. This project documents the gap (see Step 3 note).

**What graduates to the registry vs. what stays in the doc:**
- **Graduates to FilterEntry registry:** filter property values (measured drawdown, bed behavior axis).
- **Stays in protocol-doc metadata:** conditions of measurement (specific dose, grind, brewer, dispersion device, water, kettle behavior, operator pour pace). The registry value is a paper property; conditions of measurement are protocol-doc metadata.
- **Stays in protocol-doc:** equipment specifics like "Melodrip with hole-size > standard plastic" or "EG-1 with ULTRA SSP burrs" — these belong in the record-of-measurement, NOT in the FilterEntry registry. The `measurementBaseline` string carries enough context for downstream queries to assess transferability.

**Pattern lessons (for Research Assistant SKILL.md scaffolding):**
- **One-at-a-time tool-call pacing** is the operator's preferred mode. Default to per-pull tool calls + observation capture, not batch-then-debrief.
- **Operator verbalization of equipment deviation** is a self-audit mechanism that Step 0's framing primes. Encourage it explicitly.
- **Calibration arc before scoring pulls** is load-bearing. Future templates should make it explicit, not optional.
- **Community knowledge as pre-test framing** is a valuable input. Invite it.
- **Photo confirmation in Step 0** beats verbal confirmation for catching registry drift.
- **Noise floor calibration is the project's most expensive single setup.** A tight noise floor (8s for B3) compresses the operationally-relevant band — worth investing in 3 replicates on the baseline even when the rest is single-shot.
