# Evaluation Protocol

> **Rewritten 2026-11-13 ([ADR-0027](docs/adr/0027-house-style-gate.md)):** the Day 7 gate is now the Latent house style on the SWORKS, brewed on every slot of the V-set. The xBloom gate and the separate Simulated Pourover Gate step are both retired - one session picks the leading slot, confirms the reference call, and usually produces the optimized brew.

Migrated from ROASTING.md § Evaluation Protocol in Wave 3 PR 1 (2026-05-26).

---

## Current Protocol

**Day 7 house-style gate - this is the only evaluation window.**

- Brew method: the [Latent house style](CONTEXT-brewing.md), verbatim, on every slot of the V-set (recipe card: [`simulated-pourover.md`](docs/prompts/simulated-pourover.md)). SWORKS Bottomless Dripper + xBloom Premium paper · 15 g / 240 g (1:16) · EG-1 6.5 · **94°C for every slot** · Hybrid (Sequential), Dial 0 bloom -> Dial 5 -> Dial 6 at the end.
- One recipe, frozen across the slots, brewed back to back in one session. The only variable across the cups is the roast - hold grind, temperature, ratio, valve sequence and pour cadence identical. No roast-level row at the gate: a roast note at 94°C is itself a development signal (Los Lajones Batch 245), so do not tune it away before the read.
- Up to 3 slots per session (preferred maximum); 4 is possible but not ideal.
- Evaluate as full cup sips across the whole cooling arc (hot -> warm -> cool). Do not call the verdict from the hot window - the layered-evolving read lives in the arc.
- The gate runs in the roasting thread. There is no packet, no brewing-thread handoff and no lifecycle flip: the lot stays in Waiting for next cupping until the gate cups are logged.

**What the gate decides, in one session:**

1. **Leading slot** of the V-set.
2. **Reference call**, when the leading slot is bracketed - a lighter sibling reads underdeveloped and a deeper sibling reads overdeveloped. A bracketed winner on V1 is the expected outcome on a seen-before lot, not a suspect one (see [cross-coffee-insights.md § First-V-set default](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md#first-v-set-default-on-seen-before-lots---fixed-curve-drop-ladder)). A winner at the edge of the ladder is not bracketed: extend the ladder that direction in V_(n+1).
3. **Optimized brew**, when the winning cup needs nothing - the gate cup of the reference roast IS the optimized brew, recorded as-is. If it wants a trim, apply one house-style adjustment (typically 94 -> 92°C when a slight roast note shows at the top of the band) on the winner only and brew once more.

**Tie-break rebrew - only when the read is close:**

- If the top two slots cannot be separated in the gate session, rebrew those two alone, same recipe, and call it there. This replaces the standing SPG step; it is the exception, not a stage every lot passes through.
- If the rebrew cannot happen the same day and the leading slot is genuinely open, use the deferral encoding in [CONTEXT-roasting.md § House-style gate](CONTEXT-roasting.md) (`winner = 'deferred pending SPG'` + `lot_status = 'waiting_for_brewing'`).
- Structural favorite still gets a seat: when the gate favorite and the roast-side structural favorite diverge (WB->Gnd delta polarity per family norms, e.g. widest-delta-wins on Nova Red Bourbon), both go into the rebrew.

**Manual-brew consistency is the cost of this gate.** The xBloom was machine-repeatable; three hand brews are not. Freeze the recipe, brew in one sitting, keep pour cadence the same, and when a cup tastes like a brew fault (channelled, stalled drawdown) rebrew that slot rather than reading it.

**Ground Agtron measurement:**

- Grind and read a sample from each batch when the batch is large enough; record WB Agtron (already measured post-roast) and Ground Agtron and the WB-to-Ground delta - a primary internal development signal.
- Target delta <=3 points for well-developed counterflow roasts. Delta above 5 points: surface development is running ahead of core - profile needs more early energy. Delta near zero or slightly negative: even development confirmed (this is the target).
- **100 g-batch V-sets: skipped by design.** After three 15 g gate brews the remaining sample is too small for an accurate ground reading; WB is the color of record on those lots (Maya, Los Lajones, Black Moon Chiroso).

See [cluster/machine/counterflow-observations.md § WB-to-Ground Agtron Delta as Development Signal](docs/skills/roest-knowledge/cluster/machine/counterflow-observations.md#wb-to-ground-agtron-delta-as-development-signal) for the per-lot-family directional interpretation (magnitude is the operational reading; sign flips between washed and heavy-ferment families).

**Why the xBloom gate and the standing SPG were retired:** the xBloom recipe misranked close candidates against real pourover on engineered-process naturals (8 instances across 6 lots, including a flipped reference call on Deborah), which is why the SPG arbiter existed. Brewing the candidates in the recipe they will actually be drunk in removes the cause instead of arbitrating it afterwards. On the three lots closed 2026-11-11 to 2026-11-13 the SPG was waived, skipped and merely confirmatory, and all three optimized brews were the house style with at most a 2°C trim. History: [cross-coffee-insights.md § xbloom Evaluation Gate Misranking on Engineered-Process Naturals](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md#xbloom-evaluation-gate-misranking-on-engineered-process-naturals). Cuppings logged before 2026-11-13 with `recipe_variant: "xbloom_gate"` are xBloom reads and do not compare directly with house-style gate reads.

---

## Why Day 4 Cupping Was Removed

Across CGLE Sudan Rume Hybrid Washed (6 experiment sets, 20+ batches), Day 4 cupping results were wrong or misleading in both directions on multiple occasions:

- Batches that looked clean and expressive at Day 4 showed lactic/cheese defects at Day 7-10 pourover (#110)
- Batches that looked flat and underdeveloped at Day 4 revealed clean, complex character at Day 7-10 pourover (#111)
- The cupping table protocol systematically exaggerated acidity and suppressed delicate aromatic compounds

Day 4 should only be used as a catastrophic defect screen (lactic, phenolic, obvious underdevelopment). Never use Day 4 to rank batches or make advancement decisions.

**For naturals and heavily fermented coffees:** Day 7 is still the correct evaluation window. The operational simplicity of a universal Day 7 protocol for all coffees outweighs any marginal benefit from evaluating naturals a day earlier.
