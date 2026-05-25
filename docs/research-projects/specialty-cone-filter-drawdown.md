# Specialty Cone Filter Drawdown Characterization (Research Project #3)

*Coffee Research · Latent · Research Project*

**Version:** 1.0
**Date drafted:** 2026-05-24
**Status:** Draft (awaiting execution)
**Closes:** 3-project trifecta arc (cone V60 → flat Orea → specialty cone Funnex + Sibarist BS)
**Home EG-1**

---

## Project Context

This is **Research Project #3** — the third and final project in the arc opened by Project #1 (cone, closed 2026-05-23 in PR #226) and continued by Project #2 (flat-bottom, closed 2026-05-24 in PR #238). Same protocol template with all #1 + #2 substrate-extraction lessons baked in. Closes the geometry-bucket trifecta and provides the third independent measurement context for Research Assistant SKILL.md scaffolding.

Structured as **TWO mini-projects in one execution session**, sharing the protocol template but with different brewers + baselines:

| Project | Brewer | Baseline | Scope | Status |
| :---- | :---- | :---- | :---- | :---- |
| #1 - Cone Filter Drawdown | Hario V60 Glass (V60-01) | Sibarist CONE B3 | 8 cone papers | ✅ CLOSED 2026-05-23 |
| #2 - Flat-bottom Filter Drawdown | Orea Type-A Glass + Negotiator | Sibarist FLAT 2 B3 size S | 5 flat papers | ✅ CLOSED 2026-05-24 |
| **#3a - Funnex (deep-cone)** | Funnex | **Sibarist CONE 28 FAST** candidate | 3 papers | Draft (awaiting execution) |
| **#3b - Sibarist HALO (system-integrated)** | Sibarist Brewing System | **Sibarist HALO CONE B3** | 2 papers | Draft (awaiting execution) |
| (skipped) | Per-paper native (UFO / Weber Bird / April) | None | Cohort-of-one papers — no peer baseline value | Per Project #2 Lesson #12 |

After #3 closes: combined substrate from #1 + #2 + #3 becomes the input for Research Assistant SKILL.md scaffolding (per ADR-0011's ≥2-tracks trigger, which technically fired post-#2 but Project #2's close-out notes recommended deferring to capture the cone/flat/specialty trifecta).

---

## Substrate-Extraction Lessons Inherited from #1 + #2 (19 total)

The framework has been proven over 2 prior projects. Lessons baked into this v1.0 protocol:

**From Project #1's 9 lessons:**
1. Photo confirmation in Step 0 is permanent requirement (caught 3 drifts in #1, 5 drifts in #2)
2. SKU naming convention notes in Step 0 (vendor naming may not map to functional geometry; #2 extended this)
3. Pre-pull-1 calibration shot saves scoring pulls
4. **Checkpoint pacing** (mental tracking + optional verbal callouts) — refined post-#2 from "count-out-loud"
5. Auto-retest rule for noise-floor-edge filters; **cross-confirmation can substitute** when two same-family papers land within noise floor of each other (new #2 finding)
6. Equipment cross-check granularity (#2 extended: brewer-variant, accessory, paper-size dimensions)
7. Tool-call-per-pull pacing
8. Grind comp band vs noise floor mismatch (reproduced in #2; ±15s band too coarse for tight baselines)
9. `bedBehaviorUnderLoad` enum (4 values: `stable` / `late-forming-crater` / `pour-impact-crater` / `mixed`)

**From Project #2's 10 new lessons:**
10. Vendor naming doesn't map to functional geometry (WAVE B3 functionally flat; April flat + fluted walls)
11. Brewer-paper fit quality varies (3-tier seating spectrum: native-fit / free-seating / oversized)
12. **Minimum cohort size:** absolute single-paper measurements need either longitudinal use OR peer cohort to be meaningful (justifies #3's "skip cohort-of-one" decision)
13. `flowRate` is a triple, not single attribute (locked as decision in ADR-0015; implementation deferred)
14. Accessory effects (Boosters) are paper-specific, not universal
15. Hand-fold quality is non-factor with paper scoring + Negotiator
16. **Substantive theory generation happens mid-run** — budget for ~2 exploratory pulls beyond formal protocol
17. Pre-flight DB scan + alias-map audit as Step 0 sub-step
18. Vendor design intent is substrate context (Sibarist FLAT 2 "Zero-Bypass" framing reframed friction-as-defect → friction-as-design-tradeoff)
19. Paper size as registry-relevant dimension (#2 surfaced fiber-vs-size confound on B3 vs FAST)

---

## Sample Size + Coffee Budget (combined)

Both mini-projects share the tiered design + checkpoint pacing + auto-retest rule from #1 + #2:

| Mini-project | Pulls | Coffee |
| :---- | :---- | :---- |
| #3a Funnex (3 papers + baseline 3-rep) | 5-7 (incl. 1-2 auto-retest buffer) | 75-105g |
| #3b Sibarist HALO (2 papers + baseline 3-rep) | 4-5 | 60-75g |
| Pre-pull-1 calibrations (1 per brewer, 2 total) | 2 | 30g |
| **Total** | **11-14** | **165-210g** |

Single bag of workhorse coffee covers it. Latent-roasted blend preferred (same convention as #1 + #2; Sudan Rume Natural blend used in #2).

---

## Mini-Project #3a — Funnex Family

### Scope

3 papers in **Funnex brewer** (deep-cone geometry, third geometry family in arc — different from V60-01's 60° apex AND from Orea's flat bottom). Key trifecta-closing data point.

### Step 0 — Inventory Cross-Check (LOAD-BEARING)

**Photo confirmation required.** Starting list (filters that fit Funnex per registry as of 2026-05-24):

| Name | SKU | Notes |
| :---- | :---- | :---- |
| **Sibarist CONE 28 FAST** | `CONE28-FAST` | Sibarist FAST in deep-cone format; **baseline candidate** — `flowConsistency: "Extremely stable"` (same rationale as CONE B3 + FLAT 2 B3 baseline picks in #1+#2) |
| CAFEC Abaca+ Deep 27 | `AFD27-100W` | Cafec's primary Funnex product; `flowConsistency: "Very stable"` |
| Chemex Bonded Filter (Half Moon White) | `CHEMEX-HM-W` | Funnex/Chemex; very thick paper, registry says "Slow"; `flowConsistency: "Very stable"` |

**Note on baseline choice:** CONE28-FAST recommended per the "tightest flow consistency" rule (Extremely Stable > Very Stable). Sibarist FAST fiber has been a load-bearing anchor across both prior projects. Trade-off: this baseline is a FAST paper (fast flow), so deltas will be primarily positive (slower) rather than negative — analytically the same math, just inverted sign convention. Alternative baselines if Chris prefers operational anchoring over consistency: AFD27-100W (Cafec's primary Funnex product) or CHEMEX-HM-W (thickest, most extreme on the slow end). Resolve at Step 0.

**Reconciliation rules** (same as #1 + #2):
- Anything present but not in registry → add as net-new entry
- Anything `owned: true` but not present → flip to `owned: false`
- Anything present but `owned: false` → flip to `owned: true`
- Photo every paper before measurements begin

**Equipment cross-check** (extended granularity per Project #2 Lesson #6):
- Brewer: Funnex (record exact model + material if multiple variants)
- Dispersion device: same custom glass Melodrip as #1 + #2 (or record if different)
- Negotiator equivalent: Funnex does NOT use the Orea Negotiator. Confirm whether Funnex has its own paper-seating accessory; record presence/absence as a controlled variable.
- Boosters: Sibarist's BOOSTER CONE fits V60 (60° apex); Funnex is low-angle deep cone, **likely NOT a Booster fit**. Confirm at Step 0. If a Booster fits, record per Project #2's exploratory-pull framework.

### Sample size — Tiered Design (carryover from #2)

- **Baseline (CONE28-FAST or chosen alternative): 3 replicates**
- **Other Funnex papers: 1 replicate each**
- **Auto-retest rule:** any single-rep |Δ| ≤ 1.5× baseline range triggers a 2nd pull before final classification
- **Cross-confirmation alternative (Project #2 Lesson #5):** if two same-family papers land within noise floor of each other, cross-confirmation substitutes for retest

### Recording Sheet

#### Baseline (3 replicates)

| Filter | Pull 1 (s) | Pull 2 (s) | Pull 3 (s) | Median (s) | Range (s) | Notes |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| [Baseline filter per Step 0] |  |  |  |  |  |  |

#### Other Funnex Papers (1 replicate each)

| Pull # | Filter | SKU | Negotiator/Booster | Pull (s) | Auto-retest? | Retest pull (s) | Notes |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
|  | [Filter 2 from Step 0] |  |  |  |  |  |  |
|  | [Filter 3 from Step 0] |  |  |  |  |  |  |

---

## Mini-Project #3b — Sibarist HALO Family

### Scope

2 papers in **Sibarist Brewing System** (system-integrated cone module). Smallest cohort in the arc (2 papers); validates whether the framework handles small-N cohorts gracefully without losing analytical rigor. Chris's note at Project #3 prep session: "I don't think this is high information density, but I've been meaning to use this brewer for a while now and I really haven't gotten a chance to get to it. And so this would be a good forcing function to do so."

### Step 0 — Inventory Cross-Check (LOAD-BEARING)

Photo confirmation required. Starting list:

| Name | SKU | Notes |
| :---- | :---- | :---- |
| **Sibarist HALO CONE B3** | `HALO-B3` | System-integrated B3; **baseline** — mirrors B3 anchor role from #1+#2; `flowConsistency: "Extremely stable"` |
| Sibarist HALO CONE FAST | `HALO-FAST` | System-integrated FAST; `flowConsistency: "Extremely stable"` |

Both papers per registry: `sealFitType: "Perfect seal (system-integrated)"` + `bypassInteraction: "None (system sealed)"`. Operationally distinct from V60 cones (no Negotiator needed; the Sibarist BS system handles seating + zero-bypass natively).

### Sample size — Tiered Design (small-N variant)

- **Baseline (HALO-B3): 3 replicates**
- **HALO-FAST: 1 replicate**
- **Auto-retest if |Δ| ≤ 1.5× baseline range**
- 2-paper cohort means no cross-confirmation alternative available (only 1 non-baseline paper to compare); auto-retest is the only edge-case handler

### Equipment Note

Sibarist Brewing System brewer is a different physical instrument than Orea v4 or Funnex. Pre-pull-1 calibration shot per #3b is critical to lock the new brewer's pour-impact + bed-behavior characteristics.

### Recording Sheet

#### Baseline (3 replicates)

| Filter | Pull 1 (s) | Pull 2 (s) | Pull 3 (s) | Median (s) | Range (s) | Notes |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| Sibarist HALO CONE B3 |  |  |  |  |  |  |

#### Other HALO Papers (1 replicate each)

| Pull # | Filter | SKU | Pull (s) | Auto-retest? | Retest pull (s) | Notes |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
|  | Sibarist HALO CONE FAST | HALO-FAST |  |  |  |  |

---

## Pre-Pull-1 Calibrations (one per brewer)

**Required separately for each mini-project's brewer.** Project #2 surfaced that pre-pull-1 calibration is load-bearing (saved scoring pulls in #2 vs Project #1's 2 scrap-pull calibration arc). Each brewer in #3 needs its own:

### #3a Funnex calibration

- Setup: baseline filter (per Step 0) + 15g dose + EG-1 6.5 + dispersion device + 93°C water
- Single untimed pour at natural pace
- Observe: pour rate, bed disturbance (pour-impact-crater vs late-forming-crater vs neither), endpoint clarity
- Iterate if needed; lock config before scoring pulls

### #3b Sibarist BS calibration

- Setup: HALO-B3 + 15g + EG-1 6.5 + dispersion device + 93°C
- Single untimed pour
- Observe same dimensions; particularly note any system-integrated seating quirks (zero-bypass behavior, paper-system interface)
- Iterate; lock

---

## Method — Per-Pull Procedure (shared across both mini-projects)

Same as Project #2 with checkpoint pacing:

1. Place brewer on scale with empty server. Tare.
2. Insert filter (with brewer's seating accessory if applicable — Funnex may or may not have one; Sibarist BS is system-sealed).
3. Pre-rinse ~200g near-boiling. Discard. Dump server. Tare.
4. Add 15.0g pre-ground coffee. Level bed.
5. Attach dispersion device. Confirm kettle 93°C.
6. Start timer. Pour with checkpoint pacing (mental tracking of 50/100/150/200/250 at 6s intervals; verbal callouts as capacity allows).
7. When scale reads 250g, lift dispersion device. Note pour-end time.
8. Observe bed. Drawdown complete = specular → diffuse reflection transition.
9. Stop timer. Record total time + observations (channeling, fines migration, bed mechanism).
10. Dump bed. Rinse brewer. Allow cool. Reset kettle. Next pull.

Between mini-projects (#3a → #3b transition): swap brewers; verify dispersion device + grind + dose continuity; run #3b's separate pre-pull-1 calibration.

---

## Analysis (steps inherited from #1 + #2)

Each mini-project gets its own analysis. Steps are identical to prior projects:

### Step 1 — Validate Baseline (per mini-project)

Check spread (max − min = range) of 3 baseline pulls. If range > 20s, re-run baseline before trusting analysis. Tight noise floor = good (#1 = 8s, #2 = 6s; #3 baselines likely similar given all "Extremely stable" candidates).

### Step 2 — Compute Deltas (per mini-project)

`Δ = filter X measurement − baseline median`. Real/indistinguishable rule: `|Δ| > baseline range` = real; `|Δ| ≤ baseline range` = indistinguishable.

### Step 3 — Translate Real Deltas to Grind Compensation

Standard table from #1 + #2:

| Δ vs. baseline | Interpretation | Grind Comp |
| :---- | :---- | :---- |
| −30 or more | Significantly faster | 0.5 finer |
| −15 to −30 | Moderately faster | 0.3 finer |
| −15 to +15 | Functionally equivalent | None |
| +15 to +30 | Moderately slower | 0.3 coarser |
| +30 or more | Significantly slower | 0.5 coarser |

**Watch for band-vs-noise-floor mismatch** (Project #1 lesson #8 reproduced in #2). If #3's baselines come in tight (6-8s range) and filters land in the ±10-15s "functionally equivalent" band, surface as edge cases — same pattern as #1's APC4 + #2's both FAST papers. Audit Item #8.

---

## Output Tables (filled in at close-out)

### #3a Funnex

| Filter | SKU | Measurement (s) | Δ vs baseline | Real? | Flow Tier | Grind Comp |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| [Baseline] |  | (median) | 0 | — | Anchor | None (reference) |
| [Filter 2] |  |  |  |  |  |  |
| [Filter 3] |  |  |  |  |  |  |

### #3b Sibarist HALO

| Filter | SKU | Measurement (s) | Δ vs HALO-B3 | Real? | Flow Tier | Grind Comp |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| Sibarist HALO CONE B3 | HALO-B3 | (median) | 0 | — | Anchor | None (reference) |
| Sibarist HALO CONE FAST | HALO-FAST |  |  |  |  |  |

---

## Close-Out (Combined Exit Conditions)

Project #3 closes when ALL of these pass:

1. ✅ **Step 0 inventory cross-check resolved with photos** (both mini-projects).
2. ✅ **Brewer + baseline confirmed at Step 0** (Funnex + Sibarist BS each with their own baseline locked).
3. ✅ **All in-scope filters have a measurement** (5 papers total: 3 Funnex + 2 HALO).
4. ✅ **Baselines have 3 valid replicates each** with range ≤20s.
5. ✅ **Auto-retest rule executed** if applicable.
6. ✅ **Output tables populated** for both mini-projects.
7. ✅ **`FilterEntry` measurement fields populated** for tested papers (use `measurementProject: "specialty-cone-filter-drawdown"`); any registry drifts from Step 0 reconciled.
8. ✅ **`docs/skills/brewing-equipment-expert/cluster/filters.md`** updated with per-paper measurement bullets for tested papers + new top-level Project #3 reference section.
9. ✅ **This protocol doc filed** as canonical record.
10. ✅ **Notes for Future Research-Project Pattern populated** — validate / refine Project #1 + #2's 19 lessons; capture new lessons specific to deep-cone (Funnex) + system-integrated (Sibarist BS) geometry families.

After close-out: substrate combined from all 3 projects (cone + flat + specialty) is the input for **Research Assistant SKILL.md scaffolding** (the arc's terminal milestone — separate sprint after #3 close-out).

---

## Substrate-Practice Gap Audit Items (inherited from #2; track new ones)

Project #2's 9 audit items remain queued. Project #3 may surface new ones during execution — capture in the Notes section below as they emerge.

Likely contexts to watch in #3:

- **Funnex brewer canonicalization** — does Chris own multiple Funnex variants? (Like Orea Type-A Glass vs Type-B Porcelain; audit item #5 pattern).
- **Sibarist Brewing System brewer registration** — confirm cluster doc captures the brewer correctly.
- **System-integrated seating** as a new `sealFitType` variant — currently captured in registry as "Perfect seal (system-integrated)" string; consider whether it warrants a separate field.
- **`bedBehaviorUnderLoad` enum extension** — system-sealed papers may exhibit different bed mechanisms (e.g. uniform compression with no crater); add new enum values if surfaced.

---

## Known Confounders & Limitations (inherited)

- Loaded-bed flow (not clean-water flow through paper alone) — operationally-relevant signal.
- Paper lot variability (Sibarist).
- Bed geometry varies by dose (15g; results may not translate precisely to 12.5g or 18g).
- Temperature drift (~2-3s noise; baseline range absorbs).
- Single-replicate non-baseline can't distinguish identical-to-baseline from within-noise-floor (auto-retest or cross-confirmation handles edges).
- Funnex + Sibarist BS are different brewer geometries from V60 + Orea — **drawdown magnitudes will likely differ in absolute terms** from prior projects. Cross-project comparisons should use ratios or relative-position-in-cluster, not absolute drawdowns.

---

## Notes for Future Research-Project Pattern

*(Fill in during/after the run. This is the substrate-extraction surface that, combined with Project #1 + #2's notes, becomes the input for Research Assistant SKILL.md scaffolding.)*

### Validating Project #1 + #2's 19 Lessons

For each lesson, mark: ✅ validated / ⚠️ partial transfer / ❌ failed / 🆕 extended

1. Photo confirmation in Step 0:
2. SKU naming convention notes:
3. Pre-pull-1 calibration shot:
4. Checkpoint pacing (refined from count-out-loud):
5. Auto-retest rule + cross-confirmation alternative:
6. Equipment cross-check granularity:
7. Tool-call-per-pull pacing:
8. Grind comp band vs noise floor mismatch:
9. `bedBehaviorUnderLoad` enum (4 values):
10. Vendor naming doesn't map to functional geometry:
11. Three-tier seating spectrum (native / free-seating / oversized):
12. Minimum cohort size for meaningful measurement (vindicates #3's cohort-of-one skip):
13. `flowRate` is a triple (ADR-0015 captures this):
14. Accessory effects paper-specific:
15. Hand-fold quality non-factor (with scoring + Negotiator):
16. Substantive theory generation mid-run:
17. Pre-flight DB scan + alias-map audit:
18. Vendor design intent as substrate context:
19. Paper size as registry-relevant dimension:

### New Lessons Specific to Specialty Cone Characterization (NEW for #3)

20. *(Capture during run)*

### Pattern Lessons for Research Assistant SKILL.md (post-#3 combined with #1 + #2)

After 3 closed projects, the substrate should be strong enough to confidently scaffold the Research Assistant SKILL.md. Suggested skill scope (refining the post-#2 list with #3 evidence):

- Step 0 framework (photo + SKU sanity + alias-map audit + brewer-variant + accessory + paper-size + vendor-design-intent)
- Pre-pull-1 calibration as standard primitive (one per brewer when multi-brewer projects)
- Checkpoint pacing technique
- Auto-retest + cross-confirmation rule
- Band-vs-noise-floor mismatch detection
- Mid-run hypothesis test framework
- Substrate-change extraction at close-out (audit-item queue)
- Cohort-size epistemic check (skip cohort-of-one absolute measurements)
- Vendor-naming-vs-functional-geometry gap
- Confound detection in same-family comparisons
- *(Add new patterns surfaced in #3)*

---

## Project #3 Handoff to Compile Session

At close-out, produce a handoff brief (same shape as Project #1 + #2's handoff briefs) for compilation back in the design session. Include:

- Execution summary (pulls executed, scope evolution, calibration arc if any)
- Equipment & conditions (final locked config — note any divergence from spec)
- Per-pull raw data table
- Analysis Steps 1-3 results
- Final output table (filled in)
- Key findings (substrate-impacting)
- Substrate changes — file-level edit specifications
- Notes for Future Research-Project Pattern (full population)
- Substrate-practice gap audit items (new ones queued; status of inherited ones)
- Open data items
- Pattern lessons for Research Assistant SKILL.md scaffolding (which fires after #3 closes)
