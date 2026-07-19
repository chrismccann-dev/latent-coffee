# Calibration arc — Step 0 unified primitive set

**Status:** Load-bearing
**Origin:** Filter-arc Projects #1 → #4 (the Step 0 framework that survived across all 4)
**Locked in:** Research Assistant Step 2 scaffolding (Step 1 grilling, 2026-05-26)

---

## What this is

Step 0 of every research track. Runs before any scoring pull / observation / measurement begins. Catches inventory drift, naming-convention confusion, ceiling violations, and calibration failures that would otherwise corrupt the track's data.

Step 0 is not optional. Filter-arc Project #1's Step 0 dropped the protocol from 11 protocol-listed papers to 8 actually-owned papers — without it, the track would have spent measurement budget on three papers that don't exist in inventory.

---

## The primitives

The unified set of Step 0 sub-steps that survived across all 4 filter-arc projects. Not every primitive fires for every track — calibration-arc.md is a menu the Coordinator selects from when authoring a protocol doc, not a strict checklist. But the ones that fire must fire to completion before scoring begins.

### 1. Physical-photo inventory cross-check (LOAD-BEARING — Project #1 Lesson #1, refined by RP4)

**What:** Operator physically photographs every owned-flag-true entry the protocol references. Photos surface drift between registry state + actual-drawer state.

**Why load-bearing:** Project #1's Step 0 surfaced 5 registry drifts via photo cross-check:
- 3 flips to `owned: false` (papers not physically present)
- 2 flips to `owned: true` (papers present from 4-pack assortments registry didn't capture)
- 1 schema decision (assortment-pack handling)

**Substrate-extraction lesson:** Step 0 templates should require physical-photo confirmation of every owned-flag-true entry, not transcript / verbal claim. The cone-filter project's protocol author was initially confused about the CAFEC `LC1/LC4 + MC1/MC4 + DC1/DC4 + APC1/APC4` SKU naming convention — without physical confirmation, the LC1 row would have been carried into the test even though no Cup-1 CAFEC paper was actually in the drawer.

### 2. SKU naming convention notes (Project #1 Lesson #2)

**What:** Step 0 captures any naming-convention encoding the registry surfaces (e.g. CAFEC `1` vs `4` encodes Cup-size, not roast spec). Surface these explicitly before scoring so misreads don't propagate into the data.

**When to fire:** Any registry where part of the SKU string encodes a structural attribute (size, geometry, family).

### 3. Brewer capacity sanity check (Project #3 Lesson #20)

**What:** Pre-pull-1 verification that the brewer can physically hold the dose + water volume the protocol calls for. Some specialty drippers (Funnex, Sibarist BS, deep-cone shapes) have non-obvious capacity ceilings.

**Why:** Project #3 surfaced this as a hard ceiling that wasn't caught in protocol design. Brewer capacity is hardware-truth, not registry-truth.

### 4. Alias-map audit (Project #1 Lesson #17)

**What:** Pre-flight scan of registry alias maps against the protocol's named entries. If protocol calls "Origami Glass" and alias map points "Origami Glass" → "Origami Air Glass", the protocol's recording sheet should use the canonical form to avoid post-hoc resolution noise.

**When to fire:** Any track that touches multiple canonical-registry-anchored entries (brewers, filters, grinders, producers, etc.).

### 5. Vendor design intent capture (Project #1 Lesson #18, refined by Project #3 Lesson #34)

**What:** Before scoring begins, Step 0 captures the vendor-stated design intent of each tested entry (manufacturer's framing of what the paper / brewer / grinder is engineered to do). This is substrate context, not prediction — used post-test as validation, not pre-test as expectation.

**Why:** Project #3's Sibarist BS measurements validated Sibarist's "paper as control variable, brewer as housing" design philosophy. Project #4's CAFEC results validated CAFEC's roast-color-paired engineering philosophy (LC4 light = slow, DC4 dark = fast in their framing). Vendor design intent doesn't predict outcomes but it does interpret them.

### 6. Pre-pull-1 calibration shot (Project #1 Lesson #3)

**What:** Run one full pull at the protocol's chosen recipe BEFORE scoring begins. Catches operator-side issues (water temperature off, grinder setting wrong, pour technique drift) that would corrupt the first scoring pull.

**Why:** First-pull drift is a well-known measurement artifact. Burning it on a calibration shot — explicitly NOT counted in the data — gives every scoring pull a stable operator + equipment baseline.

### 7. Instrument calibration at EVERY sitting start (RP6 Phase 2b Lesson P6T3-N5)

**What:** Any track using a measurement instrument (EC meter, scale, etc.) re-calibrates it against its reference standard at the start of EVERY sitting — not just the first.

**Why:** Instrument cal drifts silently between sessions. RP6 Phase 2b's EC60 drifted **-36% in 2 idle days**; without the sitting-2 re-cal the entire second sitting's water QC would have been silently corrupt. For multi-sitting tracks this is a hard Step-0 line, no exceptions — the calibration-shot logic (§ 6) applied to instruments.

### 8. Bimodality screen (Project #3 Lesson #29, refined by #31 + #36)

**What:** For paper-flow / pour-rate-sensitive measurements: run a no-bed paper-only test before scoring. If the paper produces bimodal drawdown regimes at no-bed (e.g. CONE28-FAST in Funnex showed 31.5s fast / 131s slow bimodal), the protocol must switch to a bimodal protocol or document the regime selection rule.

**Why:** Bimodal regimes are protocol-precision ceilings — single-mode protocols cannot generate reliable medians from bimodal data.

**When to fire:** Any flow-rate or pour-rate-sensitive measurement track. Skip when the dependent variable isn't flow-shaped (e.g. brewing-quality tracks measure taste, not drawdown).

---

## Pre-pull-1 calibration shot is the most-skipped primitive

Three of the four filter-arc projects had an internal debate about whether the calibration shot was "really necessary" before scoring. Three of the four agreed at protocol time, ran the calibration shot at Step 0, and ratified its value post-hoc.

The temptation to skip is structural: the calibration shot consumes ~5 minutes of operator time + ~15g coffee for no scoring data. From inside the moment, it feels like overhead. From outside the moment (after Step 0 catches a wrong grinder setting that would have corrupted pull #1), it's the cheapest data the track produces.

**Coordinator rule:** every protocol doc's Step 0 section enumerates the pre-pull-1 calibration shot as a required sub-step. The Assistant runs it. No exceptions.

---

## Auto-retest + confirmed-outlier + cross-confirmation primitives

Three quality-control primitives that fire DURING scoring (not at Step 0) but were forged in the same Step 0 grilling discipline:

### Auto-retest (Project #1 Lesson #5)

**Rule:** If a single scoring pull lands more than 1 noise-floor unit outside the rolling median of prior pulls on the same entry, immediately re-test before moving on. The retest either confirms the outlier (in which case the entry's true median shifts) or invalidates the outlier (in which case the discarded pull is logged but doesn't enter the median).

### Confirmed-outlier procedure (Project #3 Lesson #21)

**Rule:** If three consecutive retests on the same entry land at the outlier value (not the prior median), the prior median was wrong — promote the outlier value to the entry's new median and re-evaluate any cross-confirmations the prior median anchored.

**Distinction from auto-retest:** auto-retest handles single-pull anomalies; confirmed-outlier handles sustained-state shift. Both are needed; they cover different failure modes.

### Cross-confirmation alternative (Project #1 Lesson #5 extension)

**Rule:** When two independent entries within a paper family produce consistent measurements (e.g. CONE-B3 + METEOR-02 both within 4s of HALO-B3 baseline in BS), the cross-confirmation can substitute for an auto-retest budget. Useful when measurement budget is scarce (small coffee dose, single-session execution).

---

## Tool-call-per-pull pacing (Project #1 Lesson #7)

Procedural primitive that goes with calibration-arc execution: one Claude Code tool call per scoring pull. Don't batch multiple pulls into a single tool call; the per-pull observation + reasoning + audit-item capture is the load-bearing payload, and batching causes detail loss.

Refined from "count-out-loud" pacing in the first protocol drafts (Project #1 v1.0). Tool-call-per-pull is the cleaner formulation.

**Track-shape exception — pre-brew water comparisons use flights-of-3 (RP6 Phase 2b Lessons P6T3-N6/N7, sanctioned 2026-07-17):** for A/B water comparisons on a fixed brew recipe, the standard unit is a **flight of 3 brewed together (fresh in-flight distilled/anchor control + the two test waters), tasted round-robin with direct head-to-heads**, one tool call per FLIGHT. Same-flight temperature parity + direct triangulation beat remembered-control cup-at-a-time reads in practice (the operator deviation outperformed the protocol and was ratified). Corollaries: an in-flight control makes *relative* reads rest-robust even when *absolute* reads drift with bean rest (N7), and a single blind read's MAGNITUDE is an anecdote — reproduce across 2+ flights before recording a magnitude claim (P6T3-N1). Per-pull pacing remains the default for measurement-shaped tracks (drawdown, flow, grind). **Rubric-in-every-flight (RP6 retro friction fix, 2026-07-19):** the Assistant re-presents the per-axis scoring rubric inside EVERY flight's tool call — the operator should never need to scroll back to (or screenshot) the protocol's top to remember the axes. Matched serving temps per flight + explicit warm-phase/cooled annotations (P6T4-N6).

---

## Taste-track quality primitives (graduated at the RP6 retro, 2026-07-19, operator-ratified)

Three primitives from the RP6 candidate ledger that each fired in 2+ independent sittings/tracks within the project and were ratified at the retro. (The cross-project gate below normally requires a second PROJECT; the operator ratified these at the RP6 retro on multi-track evidence — a second taste project contradicting any of them reopens it.)

### Blind coding is load-bearing for ordering claims (P6T4-N3 + Phase 2b reveal bias)

Any ordering/preference claim between test conditions needs blind coding + forced PRE-reveal ranking to be substrate-grade. Evidence: Phase 2b's post-reveal "straight > blend" lean was reversed by the final screen's blind flight; the trained operator's descriptor→condition attribution went 1-for-3 in the same sitting. Semi-blind is fine for directional per-axis reads; ordering verdicts require full blind.

### Single-read wins are anecdotes — reproduce before recording (P6T3-N1 + P6T4-N5 + the MgSO₄ non-replication)

A same-day semi-blind win can fail blind re-test; an exploratory single-cup read can fail replication on the SAME coffee. Magnitude and preference claims need 2+ reproductions before they enter a substrate row; until then they carry an explicit **anecdote-until-reproduced** tag.

### When instruments disagree, the built artifact's arithmetic adjudicates (P6T3-N2 + P6T4-N1)

Two instruments disagreeing (scale vs pipette, titration vs conductivity) is resolved by computing what the built artifact SHOULD measure and letting that conviction pick the instrument — and the dosing endpoint should be the derived window itself (EC-endpoint titration), not either instrument's readout. Across RP6 this diagnosed 4/4 build errors to the gram with zero reaching a scored cup.

---

## When the calibration-arc primitive needs extending

Filter-arc Step 0 primitives covered: physical-photo / SKU / capacity / alias-map / vendor-intent / pre-pull-1 calibration / bimodality screen. That set held across 4 projects.

If a future research track surfaces a class of Step 0 failure that doesn't map to any current primitive, the Coordinator updates this doc — but only after the failure repeats in a second track (per the cross-project ratification gate at [`process-retro.md`](docs/skills/research-coordinator/cluster/process-retro.md)). Single-project pattern-spotting is not enough to graduate a primitive into this cluster.

---

## Related primitives

- [`role-discipline.md`](docs/skills/research-coordinator/cluster/role-discipline.md) — the Step 0 + scoring + handoff sequence runs entirely inside the Assistant session
- [`process-retro.md`](docs/skills/research-coordinator/cluster/process-retro.md) — Step 0 friction captured during a track is retro fodder; primitive updates land post-retro
- [`templates/spawn-prompt-template.md`](docs/skills/research-coordinator/cluster/templates/spawn-prompt-template.md) — the spawn prompt's "numbered job sequence" section enumerates the calibration-arc primitives that apply to the track
