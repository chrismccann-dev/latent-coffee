# Cone Filter Drawdown Characterization (Research Project #1)

*Coffee Research · Latent · Research Project*

**Version:** 2.1
**Date drafted:** 2026-05-21
**Home EG-1**

---

## Project Context

This is **Research Project #1** - the first project run under the (still-deferred) Research Assistant skill. Acts as a dry-run for what long-running research projects look like in this codebase: a finite-scope characterization campaign that produces a markdown reference doc + a registry extension when closed.

Sits at the head of a 3-project arc (sharing protocol template, differing in baseline + controlled brewer):

| Project | Brewer (constant) | Baseline filter | Status |
| :---- | :---- | :---- | :---- |
| **#1 - Cone Filter Drawdown** (this doc) | Hario V60 Glass (V60-01) | Sibarist CONE B3 | Active |
| #2 - Flat-bottom Filter Drawdown | Orea v4 (or whichever flat is most-used) | TBD (Orea B3 candidate) | Queued |
| #3 - Specialty / Paired Filter Drawdown | Per-paper native brewer (UFO, Chemex, Deep27, HALO) | None (per-paper absolute) | Queued |

The bucketing is geometry-driven: cone, flat, and specialty papers can't be characterized in the same brewer without bed-geometry confounds, so each project owns its own controlled brewer + baseline.

---

## Purpose

Build a calibrated flow map of home cone filters so filter choice becomes a quantified extraction lever, not a gut read. The test isolates filter resistance by controlling every other variable (dose, grind, temperature, pour, water) and uses Sibarist CONE B3 as the measurement anchor (chosen for its extremely stable flow consistency, not for highest usage frequency).

**Outputs:**

1. A median drawdown value (seconds) for each tested cone filter, recorded in the Recording Sheet below.
2. A grind compensation table (half-notches finer/coarser vs B3) for swapping filters within a recipe.
3. A registry extension: new `measuredFlowSecPer100g` field (or similar shape, locked during close-out) added to `FilterEntry`, populated for the tested filters.
4. Updates to [docs/skills/brewing-equipment-expert/cluster/filters.md](../skills/brewing-equipment-expert/cluster/filters.md) - measured flow column added to the reference table for tested papers.

---

## When to Run

Run once as a calibration exercise. Re-run only if:

- (a) A new cone filter is added to inventory.
- (b) A filter lot/batch changes (Sibarist occasionally adjusts paper specs).
- (c) A brew reads surprisingly fast or slow on a known filter, suggesting a lot change.

---

## Scope

Cone-shape filters only. Hario V60 Glass (V60-01 size) as the controlled brewer throughout - do not swap brewers mid-test. All owned V60-compatible cone papers are in scope regardless of paper-size standard (V60-01 or V60-02), because V60-01 and V60-02 share the same cone geometry (60° apex angle); only paper area differs. A V60-02 paper folds slightly up the brewer wall above the bed line, but the bed sits at the bottom of the cone where geometry is identical.

Flat-bottom + UFO-class + Chemex / HALO / Deep27 papers are deferred to projects #2 and #3 (different brewer geometries, different baselines).

**Built-in geometry check:** The Cafec T-92 series is owned in both sizes (LC4 = V60-02, LC1 = V60-01). Same paper formulation, different size. If the same-geometry assumption holds, these two papers should drawdown within the noise floor of each other. This pair is the natural validation of the scope decision; flag a real delta as evidence the excess-paper-up-the-wall behavior has a wrinkle worth investigating.

---

## Step 0 - Inventory Cross-Check (LOAD-BEARING)

**Do not proceed to measurements until this step passes.** Two purposes: scope the project, audit the registry.

1. Pull every cone-shape filter currently in your home drawer; lay them out physically.
2. Query the registry: open [lib/filter-registry.ts](../../lib/filter-registry.ts) and identify entries where `paperShape: "Conical"` AND `owned: true` AND `fitsBrewers` includes `"V60"`. Starting list (from registry as of 2026-05-21):

   | Name | SKU | Size | Notes |
   | :---- | :---- | :---- | :---- |
   | CONE B3 | CONE-B3 | V60-02 | **Baseline** - 3 replicates |
   | CONE FAST | CONE-FAST | V60-02 | Sibarist FAST, ultra-thin |
   | CAFEC T-92 - Cup 4 Light Roast Paper Filter | LC4-100W | V60-02 | Cafec light-roast specific; **geometry-check pair w/ LC1** |
   | CAFEC Abaca Cup 4 Cone Paper Filter (40 pack) | APC4-40W | V60-02 | Cafec Abaca+, fast clarity |
   | Hario V60 Meteor Filter 02 | METEOR-02 | V60-02 | Hario improved standard |
   | CAFEC T-92 - Cup 1 Light Roast Paper Filter | LC1-100W | V60-01 | Cafec light-roast specific; **geometry-check pair w/ LC4** |
   | CAFEC T-90 - Cup 1 Medium Roast Paper Filter | MC1-100W | V60-01 | Cafec medium-roast specific |
   | CAFEC T-83 - Cup 1 Dark Roast Paper Filter | DC1-40W | V60-01 | Cafec dark-roast specific |
   | CAFEC Abaca+ Cup 1 Cone Paper Filter | APC1-100W | V60-01 | Cafec Abaca+, fast clarity |
   | Hario V60 Paper Filter 01 (Tabbed) | VCF-01-100W | V60-01 | Hario standard, tabbed |
   | Hario V60 Paper Filter 01 (Untabbed) | VCF-01-100M | V60-01 | Hario standard, untabbed |

3. Reconcile:
   - Anything physically present but not in registry → add to registry as net-new entry (note for follow-up sprint).
   - Anything in registry as `owned: true` but not physically present → flip to `owned: false` (note for follow-up).
   - Anything physically present that's in the registry but `owned: false` → flip to `owned: true`.
4. The intersection (physically present + registry confirms cone + V60-compatible) is your final project scope list. Bring it into the Equipment Required section as "Filters to Test."

Drift caught here propagates everywhere downstream - better to catch it now than after the doc graduates into the taxonomy.

---

## Equipment Required

- Hario V60 Glass (V60-01 size) - controlled brewer, do not swap
- EG-1 grinder (home unit)
- Scale with 0.1g resolution
- Kettle with stable temp hold at 93°C
- Melodrip (required - eliminates pour technique variance)
- Timer (phone stopwatch is fine)
- **Test coffee:** ~200g of a workhorse coffee (covers 13 pulls + buffer). Single bag preferred. If single bag unavailable, blend allowed (mix at project start in one go; record components in the Notes column of the Recording Sheet). Do not introduce a different coffee mid-test.
- Notebook or this doc's Recording Sheet section
- **Filters to Test:** populated from Step 0 output

---

## Controlled Variables

| Variable | Setting |
| :---- | :---- |
| **Brewer** | Hario V60 Glass (V60-01) - constant throughout |
| **Dose** | 15.0g ± 0.1g |
| **Grind** | EG-1 6.5 (center of Clarity-First range; purge 2-3g between batches when grinding) |
| **Water** | Tap water (Los Altos Hills) |
| **Temperature** | 93°C, kettle on base throughout |
| **Filter pre-rinse** | Full rinse (~200g near-boiling, discard rinse water, dump server) |
| **Pour structure** | Single continuous pour via Melodrip, target 250g over 30s |
| **Agitation** | None - no swirl, no stir, no spin |
| **Coffee** | Single bag (or single pre-blended batch) throughout; grind all doses at project start |

---

## Sample Size - Tiered Design

The doc's v1 asked for 3 replicates × every filter. That's operationally too heavy and consumes more coffee than necessary. v2 uses a tiered design that gets you statistical confidence on the baseline + single-shot measurements elsewhere:

- **Baseline (Sibarist CONE B3): 3 replicates.** Three separate pulls, fresh filter each time. The 3-pull range becomes your noise floor.
- **All other cone filters: 1 replicate each.** Single pull.

**Analysis rule:** any filter whose single measurement falls within ±range of B3's median is **indistinguishable from baseline** at this measurement resolution. Anything clearly outside that band is a real difference.

**Trade-off being made:** with single-shot measurements on non-baseline filters, you can't distinguish "truly identical to B3" from "different but within the noise floor." That's the cost of operational tractability. Acceptable for this project; if a future filter sits right on the noise floor and you need to know, re-test that one filter with 3 replicates.

**Coffee budget:**
- 3 baseline pulls + 10 non-baseline pulls (per the 11-filter scope from Step 0 starting list) = 13 pulls × 15g = **195g**.
- Single bag (~250g typical) covers it with buffer.

**Pull ordering:** randomize, and do not run B3's 3 replicates back-to-back. Mix them through the sequence so technique drift averages out across the baseline. Example randomized sequence for the 11-filter scope:

`B3 → Abaca APC4 → T-90 MC1 → B3 → CONE FAST → Hario VCF-01 Tabbed → T-92 LC4 → B3 → Abaca+ APC1 → Hario Meteor 02 → T-92 LC1 → Hario VCF-01 Untabbed → T-83 DC1`

---

## Method

### Setup (do once at project start)

1. Grind all required doses of 15.0g at EG-1 6.5 into labeled containers. Purge 2-3g between batches to isolate cross-batch contamination.
2. Pre-weigh water pours to 250g ± 1g in spare server carafes if available; otherwise prepare to measure per pull.
3. Heat kettle to 93°C and confirm with a thermometer.
4. Randomize filter test order per the Sample Size section. Write the sequence at the top of the Recording Sheet so you don't drift mid-test.

### Per-Pull Procedure

1. Place V60 Glass on scale with empty server. Tare.
2. Insert filter. Pre-rinse with ~200g near-boiling water. Discard rinse water. Dump server. Tare again.
3. Add 15.0g pre-ground coffee. Level bed gently by tapping V60 side (do not stir or shake).
4. Attach Melodrip. Confirm kettle is at 93°C.
5. Start timer. Begin Melodrip pour, targeting 250g total at 0:30.
6. When scale reads 250g, lift Melodrip. Note pour-end time (should be ~0:30).
7. Observe bed. **Drawdown complete = no visible standing water above the coffee bed; bed surface becomes matte rather than shiny.**
8. Stop timer at drawdown complete. Record total time (pour start → drawdown complete) in the Recording Sheet.
9. Record observations in the Notes column: any channeling, bed tilt, unusual drainage patterns, visible fines migration, paper deformation.
10. Dump bed. Rinse V60 Glass. Next pull per the randomized sequence.

### Between-Filter Transitions

- Allow brewer to cool slightly between pulls (hot glass can subtly affect initial drawdown).
- Reset kettle to 93°C if it has drifted.
- Do not change pour height or Melodrip angle mid-test.

---

## Recording Sheet

Fill in as measurements happen. Median + Range columns only meaningful for B3 (the 3-replicate row).

### B3 Baseline (3 replicates)

| Filter | Pull 1 (s) | Pull 2 (s) | Pull 3 (s) | Median (s) | Range (s) | Notes |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| Sibarist CONE B3 |  |  |  |  |  |  |

### Other Cone Filters (1 replicate each)

| Filter | SKU | Size | Pull (s) | Notes |
| :---- | :---- | :---- | :---- | :---- |
| Sibarist CONE FAST | CONE-FAST | V60-02 |  |  |
| CAFEC T-92 LC4 (Cup 4 Light Roast) | LC4-100W | V60-02 |  | **Geometry-check pair w/ LC1** |
| CAFEC Abaca APC4 (Cup 4 Abaca+) | APC4-40W | V60-02 |  |  |
| Hario V60 Meteor Filter 02 | METEOR-02 | V60-02 |  |  |
| CAFEC T-92 LC1 (Cup 1 Light Roast) | LC1-100W | V60-01 |  | **Geometry-check pair w/ LC4** |
| CAFEC T-90 MC1 (Cup 1 Medium Roast) | MC1-100W | V60-01 |  |  |
| CAFEC T-83 DC1 (Cup 1 Dark Roast) | DC1-40W | V60-01 |  |  |
| CAFEC Abaca+ APC1 (Cup 1 Abaca+) | APC1-100W | V60-01 |  |  |
| Hario V60 Paper Filter 01 (Tabbed) | VCF-01-100W | V60-01 |  |  |
| Hario V60 Paper Filter 01 (Untabbed) | VCF-01-100M | V60-01 |  |  |
| *(add rows for any filters surfaced in Step 0)* |  |  |  |  |

### Test Coffee Composition

- **If single bag:** record producer / lot / roast date / roast level.
- **If blend:** list each component coffee + approximate proportion.
- **Grind batch date/time:**

---

## Analysis

### Step 1 - Validate Baseline

For B3's 3 pulls, check the spread (max - min = range). If the 3 pulls cluster within ~15s of each other, you have a usable noise floor - record the range value. If spread exceeds 20s, either paper batch inconsistency or technique drift was at play; re-run B3's 3 pulls before trusting any analysis. Note the cause in Notes if you can identify it.

### Step 2 - Compute Deltas Against B3

For each non-baseline filter, compute:

**Δ seconds = filter X measurement - B3 median**

Apply the noise floor:
- If `|Δ| ≤ B3 range` → filter X is **indistinguishable from baseline** at this resolution.
- If `|Δ| > B3 range` → the difference is **real**.

Negative Δ = filter X is faster than B3. Positive = slower.

### Step 3 - Translate Real Deltas to Grind Compensation

Apply this table only to filters where the delta is real (per Step 2). For indistinguishable filters, the answer is "no grind compensation needed."

| Δ seconds vs. B3 | Interpretation | Grind Compensation |
| :---- | :---- | :---- |
| -30 or more | Significantly faster (e.g. FAST vs. B3) | 0.5 notch finer on EG-1 |
| -15 to -30 | Moderately faster | 0.3 notch finer |
| -15 to +15 | Functionally equivalent | None |
| +15 to +30 | Moderately slower | 0.3 notch coarser |
| +30 or more | Significantly slower | 0.5 notch coarser |

*These conversions are starting-point approximations grounded in archive data. Refine over time as actual brewed cups validate or contradict. Grind compensation is a starting point, not a locked formula.*

---

## Output (filled in at close-out)

| Filter | Size | Measurement (s) | Δ vs. B3 | Real? | Flow Tier | Grind Compensation |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| Sibarist CONE B3 | V60-02 | (median) | 0 (baseline) | - | Medium | None (reference) |
| Sibarist CONE FAST | V60-02 |  |  |  |  |  |
| CAFEC T-92 LC4 | V60-02 |  |  |  |  |  |
| CAFEC Abaca APC4 | V60-02 |  |  |  |  |  |
| Hario V60 Meteor 02 | V60-02 |  |  |  |  |  |
| CAFEC T-92 LC1 | V60-01 |  |  |  |  |  |
| CAFEC T-90 MC1 | V60-01 |  |  |  |  |  |
| CAFEC T-83 DC1 | V60-01 |  |  |  |  |  |
| CAFEC Abaca+ APC1 | V60-01 |  |  |  |  |  |
| Hario VCF-01 Tabbed | V60-01 |  |  |  |  |  |
| Hario VCF-01 Untabbed | V60-01 |  |  |  |  |  |

Once populated, this table answers: *"I have a Clarity-First recipe written for B3 but I want to use Abaca APC4 tonight - what do I adjust?"* Answer comes straight from the row.

---

## Close-Out (Exit Conditions)

Project #1 closes only when ALL of these pass:

1. **Step 0 inventory cross-check resolved.** Registry matches physical drawer for V60-compatible cone filters; net-new / drift items either reconciled in registry or noted as follow-up.
2. **All in-scope filters have a measurement** OR an explicit "couldn't test" note (with reason - out of paper, suspected damaged sleeve, etc.).
3. **B3 baseline has 3 valid replicates** with range ≤20s. If range exceeded 20s, re-run was triggered and now passes.
4. **Output summary table fully populated.**
5. **`FilterEntry` extension drafted.** New field(s) added to the type (proposed shape: `measuredFlowSecPer100g?: number` + `measurementBaseline?: string` + `measurementDate?: string`). Measured values populated for tested filters; remaining filters left `undefined`.
6. **`docs/skills/brewing-equipment-expert/cluster/filters.md` updated** with measured flow column added to the reference table for tested papers.
7. **This protocol doc filed** as the project's canonical record (this file plus the populated tables IS the archive).
8. **Geometry-check pair (T-92 LC4 vs LC1) result documented.** If the two papers drawdown within B3 noise floor of each other, the V60-01/V60-02 same-geometry assumption is validated. If they differ meaningfully, note as follow-up - may indicate different paper formulation despite same series name, or excess-paper-in-brewer behavior worth investigating.

After close-out: protocol section is reused (with baseline + brewer swap) as the template for project #2 (flat-bottom) and project #3 (specialty/paired).

---

## Known Confounders & Limitations

- **This tests flow through a loaded bed with active drawdown** - not clean-water flow through a filter alone. Deliberate; we want the operationally-relevant signal.
- **Paper lot variability is real**, especially with Sibarist. Note the lot/batch on packaging if indicated. If the same filter retests dramatically differently months later, suspect lot change first.
- **Bed geometry varies by dose.** This project uses 15g; results may not translate precisely to 12.5g (small-dose) or 18g brews. Expect faster drawdowns at smaller doses across all filters, but relative ordering should hold.
- **Temperature drift during the test** (kettle cooling, V60 warming) introduces ~2-3s noise. The 3-replicate B3 range absorbs most of this and sets the band.
- **Fines loading changes across filters.** A FAST passes more fines through; a structured paper (B3, T-92) holds them back and compresses the bed more over time. This is part of what the test captures, not a flaw.
- **Single-replicate measurements on non-baseline filters cannot distinguish** "truly identical to baseline" from "slightly different but within the noise floor." This is the trade-off for operational tractability. If a filter sits right on the band edge and the difference matters operationally, re-test that one filter with 3 replicates.
- **V60-02 papers used in V60-01 brewer.** Per Scope section, same cone geometry; excess paper area folds up the brewer wall above the bed line. If the T-92 LC4 (V60-02) vs LC1 (V60-01) geometry-check pair shows a real delta, this assumption has a wrinkle - flag in Notes.

---

## Notes for Future Research-Project Pattern

*(This section accumulates what running the project teaches us about Research Assistant's eventual SKILL.md. Fill in during/after the run.)*

- **Protocol-doc shape that worked / didn't:**
- **Step 0 inventory cross-check value:**
- **Tiered sampling worked? Need adjustment?:**
- **What was harder than expected:**
- **What was easier than expected:**
- **What the close-out criteria missed:**
- **What graduates to the registry vs. what stays in the doc:**
