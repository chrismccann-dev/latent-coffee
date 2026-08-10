# Evaluation Protocol

> **Simplified from prior version:** Day 4 cupping was consistently misleading across multiple lots and multiple experiment sets. The pourover gate is the only signal that matters.

Migrated from ROASTING.md § Evaluation Protocol in Wave 3 PR 1 (2026-05-26).

---

## Current Protocol

**Day 7 pourover — this is the only evaluation window.** The xbloom recipe is the default gate; on anaerobic-natural / heavy-ferment lots (and, precautionarily, dark-tea-prone naturals) it serves as defect screen + coarse triage only — a real-pourover arbiter (SPG) is required before declaring an outcome between close candidates. See the SPG arbiter step below.

- Brew method: xbloom (Brian Quan recipe) — consistent across all evaluation sessions
- Dose: 15g per batch
- Up to 3 batches per session (preferred maximum); 4 is possible but not ideal
- Evaluate as full cup sips — no spoon-only tasting. The full cup consistently reveals different character than the spoon and is closer to the real-world experience

**Ground Agtron measurement — required at every evaluation session:**

- Grind 15g from each batch before brewing
- Record WB Agtron (already measured post-roast) and Ground Agtron
- Calculate WB-to-Ground delta — this is a primary internal development signal
- Target delta ≤3 points for well-developed counterflow roasts
- Delta above 5 points: surface development is running ahead of core — profile needs more early energy
- Delta near zero or slightly negative: even development confirmed (this is the target)

See [cluster/machine/counterflow-observations.md § WB-to-Ground Agtron Delta as Development Signal](docs/skills/roest-knowledge/cluster/machine/counterflow-observations.md#wb-to-ground-agtron-delta-as-development-signal) for the per-lot-family directional interpretation (magnitude is the operational reading; sign flips between washed and heavy-ferment families).

**Optimized brew session — one additional session after a winner is identified:**

- Once the Day 7 evaluation identifies a winning batch, run one dedicated optimized brew session using UFO Ceramic + Sibarist Fast Cone
- This session establishes the reference brew recipe for the lot — it is for expression maximization, not evaluation
- The xbloom evaluation recipe and the optimized recipe are different tools for different purposes — do not conflate them

**SPG real-pourover arbiter — required on trigger-family lots (Confirmed Pattern, promoted 2026-08-08; adopted into protocol 2026-08-08):**

- Trigger (mandatory): anaerobic-natural / heavy-ferment lots — the xbloom gate misranks close candidates on these lots (5 slot-level instances across COS-HIG-BOR-2026 + RWA-NOVA-AN10-RB-2026; High confidence). Precautionary triggers (Medium confidence, pending third lot): dark-tea-prone naturals (descriptor-axis extension) and Nova Washing Station Red Bourbon lots (producer-family brightness bias — the gate over-amplified the brighter/less-developed slot in both AN10 instances).
- On trigger-family lots, the xbloom session outputs FINALISTS only — do not record a provisional winner from the gate, and do not let gate rankings alone steer the next V-set's design direction.
- Finalist pair: gate favorite + structural favorite when they diverge — include the slot indicated by family-appropriate roast-side structural signals (WB→Gnd delta polarity per family norms, e.g. widest-delta-wins on Nova Red Bourbon), not automatically the gate's top 2. Motivating case: AN10 Batch 218 (structural favorite, confirmed reference-grade) vs 217 (gate co-favorite, collapsed at SPG).
- Cadence — the arbiter is required at forks, skippable otherwise:
  - Required: (a) before any reference-roast or lot-outcome declaration — always, no exceptions; (b) whenever the next V-set's design direction depends on which finalist actually won (bigger profile corrections).
  - Skippable: mid-lot sets where the gate is decisive by a wide margin, or where the next V-set brackets both candidates' directions regardless of the winner.
- Procedure: Balanced Intensity real pourover on the finalist pair before declaring any outcome — winner selection, reference call, or an underdevelopment/defect diagnosis (the gate has produced extraction-artifact false defects, e.g. the COS-HIG-BOR v1b lactic note; treat apparent gate defects between close candidates as unconfirmed until the SPG).
- Scope note: the xbloom gate remains the standard for non-trigger lots and remains the archive's comparison-consistency descriptor record on all lots; the SPG arbiter is a ranking step, not a replacement for the Day 7 xbloom session. Expected cost: one to two extra 2-cup manual sessions per lot.

Source: [cross-coffee-insights.md § xbloom Evaluation Gate Misranking on Anaerobic Naturals](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md#xbloom-evaluation-gate-misranking-on-anaerobic-naturals) + the dark-tea-ceiling descriptor-axis extension and Nova widest-delta-wins entries in the same doc.

---

## Why Day 4 Cupping Was Removed

Across CGLE Sudan Rume Hybrid Washed (6 experiment sets, 20+ batches), Day 4 cupping results were wrong or misleading in both directions on multiple occasions:

- Batches that looked clean and expressive at Day 4 showed lactic/cheese defects at Day 7-10 pourover (#110)
- Batches that looked flat and underdeveloped at Day 4 revealed clean, complex character at Day 7-10 pourover (#111)
- The cupping table protocol systematically exaggerated acidity and suppressed delicate aromatic compounds

Day 4 should only be used as a catastrophic defect screen (lactic, phenolic, obvious underdevelopment). Never use Day 4 to rank batches or make advancement decisions.

**For naturals and heavily fermented coffees:** Day 7 is still the correct evaluation window. The operational simplicity of a universal Day 7 protocol for all coffees outweighs any marginal benefit from evaluating naturals a day earlier.
