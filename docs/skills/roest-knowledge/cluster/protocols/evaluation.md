# Evaluation Protocol

> **Simplified from prior version:** Day 4 cupping was consistently misleading across multiple lots and multiple experiment sets. The pourover gate is the only signal that matters.

Migrated from ROASTING.md § Evaluation Protocol in Wave 3 PR 1 (2026-05-26).

---

## Current Protocol

**Day 7 pourover — this is the only evaluation gate.**

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

See [cluster/machine/counterflow-observations.md § WB-to-Ground Agtron Delta as Development Signal](../machine/counterflow-observations.md#wb-to-ground-agtron-delta-as-development-signal) for the per-lot-family directional interpretation (magnitude is the operational reading; sign flips between washed and heavy-ferment families).

**Optimized brew session — one additional session after a winner is identified:**

- Once the Day 7 evaluation identifies a winning batch, run one dedicated optimized brew session using UFO Ceramic + Sibarist Fast Cone
- This session establishes the reference brew recipe for the lot — it is for expression maximization, not evaluation
- The xbloom evaluation recipe and the optimized recipe are different tools for different purposes — do not conflate them

---

## Why Day 4 Cupping Was Removed

Across CGLE Sudan Rume Hybrid Washed (6 experiment sets, 20+ batches), Day 4 cupping results were wrong or misleading in both directions on multiple occasions:

- Batches that looked clean and expressive at Day 4 showed lactic/cheese defects at Day 7-10 pourover (#110)
- Batches that looked flat and underdeveloped at Day 4 revealed clean, complex character at Day 7-10 pourover (#111)
- The cupping table protocol systematically exaggerated acidity and suppressed delicate aromatic compounds

Day 4 should only be used as a catastrophic defect screen (lactic, phenolic, obvious underdevelopment). Never use Day 4 to rank batches or make advancement decisions.

**For naturals and heavily fermented coffees:** Day 7 is still the correct evaluation window. The operational simplicity of a universal Day 7 protocol for all coffees outweighs any marginal benefit from evaluating naturals a day earlier.
