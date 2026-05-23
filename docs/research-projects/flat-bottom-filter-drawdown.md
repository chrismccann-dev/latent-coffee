# Flat-Bottom Filter Drawdown Characterization (Research Project #2)

*Coffee Research · Latent · Research Project*

**Version:** 1.0
**Date drafted:** 2026-05-23
**Status:** Draft (awaiting execution)
**Home EG-1**

---

## Project Context

This is **Research Project #2** in the 3-project arc opened by Project #1 (cone filter drawdown, closed 2026-05-23 in [PR #226](https://github.com/chrismccann-dev/latent-coffee/pull/226)). Same protocol template, swapped brewer + baseline + paper-geometry scope.

| Project | Brewer (constant) | Baseline filter | Status |
| :---- | :---- | :---- | :---- |
| #1 - Cone Filter Drawdown | Hario V60 Glass (V60-01) | Sibarist CONE B3 | ✅ CLOSED 2026-05-23 |
| **#2 - Flat-bottom Filter Drawdown** (this doc) | **[Orea v4 candidate — resolve at Step 0]** | **[Sibarist FLAT B3 candidate — resolve at Step 0]** | Draft (awaiting execution) |
| #3 - Specialty / Paired Filter Drawdown | Per-paper native brewer (UFO, Chemex, Deep27, HALO, Weber Bird, xBloom) | None (per-paper absolute) | Queued |

The bucketing is geometry-driven: cone, flat, and specialty papers can't be characterized in the same brewer without bed-geometry confounds.

---

## Substrate-Extraction Lessons from Project #1 (baked into this protocol)

Project #1 surfaced pattern lessons this protocol incorporates from v1 — testing whether they transfer cleanly to a different geometry family:

1. **Photo confirmation in Step 0** — Project #1's verbal-claim ownership check missed 3 drifts; physical photo confirmation caught them all. **Required in Step 0 below.**
2. **SKU naming convention notes in Step 0** — Project #1 surfaced CAFEC's `LC1/LC4 + MC1/MC4 + DC1/DC4 + APC1/APC4` SKU encoding where the 1/4 digit encodes paper SIZE not roast spec. For flat papers, watch for: April vs April-FAST vs APRIL-FAST (different manufacturers' "April"-prefixed papers); FLAT-FAST vs FLAT-B3 (Sibarist's FAST vs B3 material families on the same flat shape).
3. **Pre-pull-1 calibration shot** — Project #1 needed 2 scrap pulls before locking the controlled config (custom glass Melodrip + pour-pace deviation surfaced only AFTER the first official pull). **This project builds an EXPLICIT pre-pull-1 calibration shot into Setup.**
4. **Count-out-loud pour discipline as operational technique** — Project #1 found pour rate was the dominant variable (not dispersion device); count-out-loud at 6-second intervals (50/100/150/200/250) stabilized the bed. **Made explicit in Per-Pull Procedure.**
5. **Auto-retest rule for noise-floor-edge filters** — Project #1's DC4 single-rep landed at +10s but retest gave +7-8s (reclassified REAL → indistinguishable). **Auto-retest rule built in: any single-rep delta within 1.5× the baseline range gets a 2nd pull before final classification.**
6. **Equipment cross-check granularity** — Project #1's "owns Melodrip Y/N" wasn't granular enough; specific model + hole-size + dispersion characteristics matter. **Step 0 records dispersion-device specifics.**
7. **Tool-call-per-pull pacing preferred** — Project #1's execution ran best with one tool call per pull (not batch-then-debrief). Execution session should default to this pacing.
8. **Grind comp band vs noise floor mismatch** — Project #1's 8s noise floor was tighter than the grind comp table's ±15s "functionally equivalent" band; APC4's +12s landed REAL by Step 2 but No-Comp by Step 3. **Project #2 watches for the same gap.**
9. **bedBehaviorUnderLoad enum may need extension** — Project #1 shipped 4 values (`stable` / `late-forming-crater` / `pour-impact-crater` / `mixed`). Flat-bottom brewing may surface new bed mechanisms; if so, extend the enum.

---

## Purpose

Build a calibrated flow map of home flat-bottom filters so filter choice becomes a quantified extraction lever, not a gut read. Mirrors Project #1's intent for flat-bottom geometry. Sibarist FLAT B3 candidate baseline (mirror of CONE B3's anchor role — chosen for extremely stable flow consistency, not most-used).

**Outputs (delivered at close-out):**

1. Median drawdown value (seconds) for each tested flat filter.
2. Grind compensation table (vs FLAT B3 baseline).
3. `FilterEntry` registry already extended in Project #1 PR #226 — same 6 fields (`measuredDrawdownSec` / `measurementDose` / `measurementBaseline` / `measurementDate` / `measurementProject: "flat-bottom-filter-drawdown"` / `bedBehaviorUnderLoad`) populated for the tested flat papers.
4. Updates to [docs/skills/brewing-equipment-expert/cluster/filters.md](../skills/brewing-equipment-expert/cluster/filters.md) — per-paper measurement bullets for tested flat papers; new top-level reference section for Project #2 measurement.

---

## When to Run

Run once as calibration. Re-run if (a) new flat filter added, (b) filter lot/batch changes, (c) brew reads surprisingly off on a known flat filter.

---

## Scope

Flat-bottom filters only (`paperShape: "Flat"` in the registry). Cone papers in Project #1 (closed); Wave / specialty / paired papers in Project #3 (queued). Wave papers (Kalita Wave 155, WAVE B3, WAVE FAST, Hario Flow, Cafec Wave 250) are technically a different shape; recommend deferring to Project #3 OR running a Project #2b sub-project against a Kalita Wave brewer baseline.

**Brewer choice (resolve at Step 0):** Recommend **Orea v4** — fits the largest set of owned flat papers (April Paper Filter, xBloom Premium, FLAT FAST, FLAT B3 all explicitly list Orea in `fitsBrewers`). Alternatives:
- April brewer (more native to April Paper Filter; tighter seal, but fewer cross-fits)
- xBloom (most automated, but other papers won't fit as cleanly)
- Kalita Wave 155 (wave-shape specific, would shift scope toward wave papers)

The choice is operationally Chris's most-used flat brewer; default to Orea v4 absent another preference.

**Baseline choice (resolve at Step 0):** Recommend **Sibarist FLAT B3** — mirrors Project #1's CONE B3 role. Registry shows `flowConsistency: "Extremely stable"` + `material: "Specialty fiber (B3)"` (same family as CONE B3). Best anchor for tight noise floor.

---

## Step 0 — Inventory Cross-Check (LOAD-BEARING)

**Do not proceed to measurements until this step passes.** Photo confirmation required (Project #1 lesson).

1. Pull every flat-bottom filter currently in your home drawer; lay them out physically + photograph.
2. Query the registry: open [lib/filter-registry.ts](../../lib/filter-registry.ts) and identify entries where `paperShape: "Flat"` AND `owned: true`. Starting list (from registry as of 2026-05-23, post Project #1 close-out):

   | Name | SKU | Fits brewers | Notes |
   | :---- | :---- | :---- | :---- |
   | **Sibarist FLAT B3** | FLAT-B3 | Orea / Kalita / April | Sibarist specialty fiber B3; **baseline** — 3 replicates |
   | Sibarist FLAT FAST | FLAT-FAST | Orea / Kalita / April | Sibarist specialty fiber FAST; expected fastest |
   | April Paper Filter | APRIL-STD | April / Orea / Kalita | Wood pulp; medium flow per registry |
   | xBloom Premium Paper Filters | XBLOOM-STD | xBloom / Kalita / Orea | Refined pulp; "fast" per registry |

3. Reconcile against physical drawer (same rules as Project #1):
   - Anything present but not in registry → add as net-new entry (note for follow-up).
   - Anything `owned: true` but not present → flip to `owned: false`.
   - Anything present but `owned: false` → flip to `owned: true`.
4. **Brewer confirmation:** verify Orea v4 (or alternative) physically present. Record actual model + size in Equipment Required section. If using a different brewer, ALL papers must fit it; double-check `fitsBrewers` arrays.
5. **Baseline confirmation:** verify FLAT B3 (or alternative) physically present + sufficient stock for 3 replicates plus 1-2 retests.
6. **Equipment cross-check (Project #1 granularity lesson):**
   - Dispersion device: model + hole-size + style (custom glass Melodrip / OXO rapid brewer screen / Hario Flow drip assist / other)
   - Kettle: temp hold mechanism
   - Scale: resolution + responsiveness
   - Grinder: confirm EG-1 + 6.5 setting + ULTRA SSP burrs
7. **SKU naming sanity check:** the FLAT vs WAVE Sibarist papers + APRIL-STD vs APRIL-FAST (Sibarist's April-shape paper) are easy to mix up. Confirm SKU on each physical paper matches what's in the lay-out photos.

Drift caught at Step 0 propagates everywhere downstream — better to catch it now than after the doc graduates to the registry.

---

## Equipment Required

- Flat-bottom brewer: **Orea v4 recommended** — resolve at Step 0
- EG-1 grinder with ULTRA SSP burrs
- Scale with 0.1g resolution
- Kettle with stable temp hold at 93°C
- Dispersion device (specify model in Step 0 — custom glass Melodrip from Project #1)
- Timer (phone stopwatch OK)
- **Test coffee:** ~120g of a workhorse coffee (covers 6 official + 2 retest pulls). Single bag preferred; blend allowed if mixed in one go at project start.
- Camera (Step 0 photo confirmation)
- Notebook or this doc's Recording Sheet section
- **Filters to test:** populated from Step 0 output

---

## Controlled Variables

| Variable | Setting |
| :---- | :---- |
| **Brewer** | [Orea v4 recommended — confirm at Step 0] |
| **Dose** | 15.0g ± 0.1g |
| **Grind** | EG-1 6.5 (center of Clarity-First range; purge 2-3g between batches) |
| **Water** | Tap water (Los Altos Hills) |
| **Temperature** | 93°C, kettle on base throughout |
| **Filter pre-rinse** | Full rinse (~200g near-boiling, discard, dump server) |
| **Pour structure** | Single continuous pour, **250g over 30s via count-out-loud (50/100/150/200/250 at 6s intervals)** |
| **Agitation** | None |
| **Coffee** | Single bag (or pre-blended batch) throughout; grind all doses at project start |
| **Endpoint criterion** | Specular → diffuse reflection transition (bed surface scatters light, no standing water dome) |

---

## Sample Size — Tiered Design (Project #1 carry-over + auto-retest)

- **Baseline (Sibarist FLAT B3): 3 replicates.**
- **All other flat filters: 1 replicate each.**
- **Auto-retest rule (NEW for #2):** any single-rep delta within 1.5× the baseline range gets a 2nd pull before final classification. Project #1's DC4 first-pull at +10s would have triggered this rule (1.5 × 8s = 12s band → +10s is inside the band → auto-retest); reclassified to indistinguishable on retest. Budget +1-2 extra pulls upfront.

**Coffee budget** (for the recommended 4-paper scope):
- 3 baseline pulls + 3 other-filter pulls + 1-2 retest pulls = **6-8 pulls × 15g = 90-120g**.
- Single bag (~250g typical) covers it with buffer.

**Pull ordering:** randomize. Do NOT run baseline 3 replicates back-to-back; mix through the sequence. Example for 4-filter scope:

`FLAT B3 → xBloom → April → FLAT B3 → FLAT FAST → FLAT B3`

(then any retests appended as 7-8)

---

## Method

### Pre-Pull-1 Calibration Shot (Project #1 lesson — NEW for #2)

**Required before any scoring pulls.** Project #1's calibration arc spent 2 scrap pulls before locking the controlled config. Project #2 builds in an explicit calibration shot at the start:

1. Set up with baseline filter (FLAT B3 candidate), 15g dose, 93°C, EG-1 6.5, dispersion device.
2. Run ONE untimed pour at Chris's natural pour cadence (no count-out-loud yet).
3. Observe:
   - **Pour rate** — does the dispersion device actually rate-limit, or does pour-pace discipline do the work? (Project #1 finding: dispersion device was permissive; discipline mattered.)
   - **Bed disturbance** — pour-impact crater? Even bed? Tilt?
   - **Endpoint clarity** — specular → diffuse transition obvious or ambiguous?
4. If pour rate is faster than 0:30 for 250g, lock count-out-loud discipline before scoring pulls.
5. If bed disturbance is severe, iterate the dispersion device or pour height before scoring pulls.
6. Document the calibration outcome in the Recording Sheet's "Pre-Pull-1 Calibration" section.

### Setup (do once at project start)

1. Grind all required doses of 15.0g at EG-1 6.5 into labeled containers. Purge 2-3g between batches.
2. Pre-weigh water pours to 250g ± 1g in spare server carafes if available.
3. Heat kettle to 93°C, confirm with thermometer.
4. Randomize filter test order per Sample Size; write at top of Recording Sheet.
5. **Run pre-pull-1 calibration shot per above.**

### Per-Pull Procedure

1. Place brewer on scale with empty server. Tare.
2. Insert filter. Pre-rinse with ~200g near-boiling water. Discard rinse water. Dump server. Tare again.
3. Add 15.0g pre-ground coffee. Level bed gently (no stir, no shake).
4. Attach dispersion device. Confirm kettle at 93°C.
5. Start timer. Begin pour with **COUNT-OUT-LOUD cadence: 50g at 0:06, 100g at 0:12, 150g at 0:18, 200g at 0:24, 250g at 0:30.**
6. When scale reads 250g, lift dispersion device. Note pour-end time (should be ~0:30).
7. Observe bed. Drawdown complete = specular → diffuse reflection transition.
8. Stop timer at drawdown complete. Record total time.
9. Record observations: channeling, bed tilt, drainage patterns, fines migration, paper deformation, **crater mechanism (pour-impact vs late-forming) for the bedBehaviorUnderLoad axis.** Note any NEW bed mechanism not in the Project #1 enum.
10. Dump bed. Rinse brewer. Allow brewer to cool slightly. Reset kettle to 93°C if drifted. Next pull per randomized sequence.

### Between-Filter Transitions

- Allow brewer to cool slightly between pulls.
- Reset kettle to 93°C if drifted.
- Do not change pour height or dispersion device angle mid-test.

---

## Recording Sheet

### Pre-Pull-1 Calibration

- Calibration filter:
- Pour cadence observed:
- Bed disturbance:
- Endpoint clarity:
- Iterations needed:
- Final locked config diverged from spec?:

### Baseline (Sibarist FLAT B3, 3 replicates)

| Filter | Pull 1 (s) | Pull 2 (s) | Pull 3 (s) | Median (s) | Range (s) | Notes |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| Sibarist FLAT B3 |  |  |  |  |  |  |

### Other Flat Filters (1 replicate each; auto-retest if |Δ| ≤ 1.5× baseline range)

| Pull # | Filter | SKU | Pull (s) | Auto-retest? | Retest pull (s) | Final Notes |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
|  | Sibarist FLAT FAST | FLAT-FAST |  |  |  |  |
|  | April Paper Filter | APRIL-STD |  |  |  |  |
|  | xBloom Premium Paper Filters | XBLOOM-STD |  |  |  |  |
| *(add rows for any filters surfaced in Step 0)* |  |  |  |  |  |  |

### Test Coffee Composition

- **If single bag:** producer / lot / roast date / roast level:
- **If blend:** component composition:
- **Grind batch date/time:**

---

## Analysis (steps inherited from Project #1)

### Step 1 — Validate Baseline

For FLAT B3's 3 pulls, check spread (max - min = range). If pulls cluster within ~15s, usable noise floor. If spread > 20s, re-run baseline before trusting analysis.

### Step 2 — Compute Deltas Against FLAT B3

`Δ seconds = filter X measurement - FLAT B3 median.` Real/indistinguishable rule: `|Δ| > baseline range` = real; `|Δ| ≤ baseline range` = indistinguishable.

### Step 3 — Translate Real Deltas to Grind Compensation

| Δ seconds vs. FLAT B3 | Interpretation | Grind Compensation |
| :---- | :---- | :---- |
| -30 or more | Significantly faster | 0.5 notch finer on EG-1 |
| -15 to -30 | Moderately faster | 0.3 notch finer |
| -15 to +15 | Functionally equivalent | None |
| +15 to +30 | Moderately slower | 0.3 notch coarser |
| +30 or more | Significantly slower | 0.5 notch coarser |

**Watch for band-vs-noise-floor mismatch** (Project #1 lesson): if baseline range comes in tighter than 15s, some "REAL by Step 2" filters will land "No-Comp by Step 3" — same edge case as Project #1's APC4. Document the gap in Notes.

---

## Output (filled in at close-out)

| Filter | SKU | Measurement (s) | Δ vs FLAT B3 | Real? | Flow Tier | Grind Compensation |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| Sibarist FLAT B3 | FLAT-B3 | (median) | 0 (baseline) | - | Medium (anchor) | None (reference) |
| Sibarist FLAT FAST | FLAT-FAST |  |  |  |  |  |
| April Paper Filter | APRIL-STD |  |  |  |  |  |
| xBloom Premium Paper Filters | XBLOOM-STD |  |  |  |  |  |

Once populated, this table answers: *"I have a recipe written for FLAT B3 but I want to use APRIL-STD tonight — what do I adjust?"* Answer comes straight from the row.

---

## Close-Out (Exit Conditions)

Project #2 closes when ALL pass:

1. **Step 0 inventory cross-check resolved with photos.** Registry matches physical drawer for owned flat filters; any drift items reconciled or noted as follow-up.
2. **Brewer + baseline confirmed at Step 0** (resolved from "Orea v4 / FLAT B3 candidate" placeholders to actual locked values).
3. **All in-scope filters have a measurement** OR explicit "couldn't test" note.
4. **FLAT B3 baseline has 3 valid replicates** with range ≤20s.
5. **Auto-retest rule executed** for any filter whose single-rep landed within 1.5× baseline range.
6. **Output summary table populated.**
7. **`FilterEntry` registry updated** — `measurementProject: "flat-bottom-filter-drawdown"` populated for tested filters; new bed-behavior enum values added if surfaced.
8. **`docs/skills/brewing-equipment-expert/cluster/filters.md` updated** — per-paper measurement bullets for tested flat papers; top-level Project #2 reference section added.
9. **This protocol doc filed** with measurements, analysis, output, notes populated.
10. **Notes for Future Research-Project Pattern** populated — validate or refine the 9 lessons from Project #1; capture new lessons specific to flat-bottom characterization.

After close-out: protocol section is reusable for Project #3 (specialty/paired). The substrate-extraction notes from #1 + #2 combined are the input for scaffolding Research Assistant SKILL.md (per ADR-0011's ≥2-tracks trigger).

---

## Known Confounders & Limitations

(Carried over from Project #1; flat-specific notes added during run.)

- This tests flow through a loaded bed with active drawdown — operationally-relevant signal.
- Paper lot variability is real, especially Sibarist. Note lot/batch on packaging if indicated.
- Bed geometry varies by dose. 15g; results may not translate to 12.5g or 18g brews precisely.
- Temperature drift introduces ~2-3s noise; 3-replicate baseline absorbs it.
- Fines loading changes across filters; captured via `bedBehaviorUnderLoad` axis.
- Single-replicate non-baseline measurements can't distinguish identical-to-baseline from within-noise-floor (auto-retest rule covers edge cases).
- **Flat-specific note (anticipated):** flat brewers have a deeper bed at 15g dose than V60 (less cone-shape compression at the bottom). Drawdown magnitudes may differ from Project #1's cone numbers. Relative ordering should still be informative.
- **xBloom semi-automation:** xBloom's brewer has its own pour controls that may interfere with the count-out-loud cadence. If xBloom paper is tested in an xBloom brewer, document the automation impact. If tested in Orea v4 (per recommended scope), no concern.

---

## Notes for Future Research-Project Pattern

*(Fill in during/after the run. This is the substrate-extraction surface for Research Assistant SKILL.md scaffolding — Project #2's lessons combined with #1's are the input for that work per ADR-0011's ≥2-tracks trigger.)*

**Validating Project #1's lessons:**

- Did photo confirmation in Step 0 catch flat-bottom registry drift? (Project #1: yes, 3 drifts)
- Did pre-pull-1 calibration shot save scoring pulls? (Project #1: 2 scrap pulls before locking)
- Did count-out-loud pour discipline transfer to flat-bottom brewing?
- Did auto-retest rule fire correctly for noise-floor-edge filters?
- Did equipment cross-check granularity surface anything new?
- Did tool-call-per-pull pacing still feel right?
- Did grind comp band vs noise floor mismatch repeat? (Project #1: APC4 +12s edge case)
- Did `bedBehaviorUnderLoad` enum (4 values) cover all observed mechanisms?

**New lessons specific to flat-bottom characterization:**
- Brewer choice trade-offs (Orea v4 vs alternatives):
- Bed-depth effects at 15g in flat vs cone:
- xBloom automation interference (if tested):
- Cross-brewer paper compatibility surprises:

**Anything that transferred poorly from cone → flat protocol:**

**Reusable substrate (validate or refine):**
- Tiered sampling (baseline 3-rep + others 1-rep + auto-retest):
- Step 0 load-bearing framing:
- Coffee composition fields:
- FilterEntry registry extension (same 6 fields):

**Domain-specific bits that diverged:**
- Brewer geometry:
- Baseline filter choice rationale:
- Bed-behavior axis (new enum values if any):
- Grind comp magnitudes:

**Pattern lessons for Research Assistant SKILL.md (post-#2 combined with #1):**
- (Fill in at close-out — these become the substrate for the SKILL.md draft)
