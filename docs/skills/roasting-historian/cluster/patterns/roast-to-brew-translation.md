# Roast-to-Brew Translation

*This section translates roast parameter patterns into expected brew behavior and starting recipe adjustments. It bridges the gap between the roasting reference guide and the brewing reference guide. Updated as new lots are resolved.*

Migrated from ROASTING.md § Roast-to-Brew Translation in Wave 3 PR 1 (2026-05-26). The kickoff brief proposed routing to Roest Knowledge, but the content shape (cross-coffee pattern aggregation including 2 working hypothesis stubs at the tail) is structurally identical to the rest of the Roasting Historian cluster — see [cross-coffee-insights.md](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md). Per Chris-locked decision 2026-05-26, lives here.

---

> The 6 brewing strategies + 5 modifiers referenced below (Suppression / Clarity-First / Balanced Intensity / Full Expression / Extraction Push / Hybrid + Output Selection / Thermal Staging / Aroma Capture / Role-Based Pulse / Equipment) are defined in [BREWING.md § The Two-Axis Framework](docs/skills/coordinator/catalog.md#brewing-domain-principles). The brew-side documentation contract (Step 4 Resolved Brew Output Format) lives in [BREWING.md § Step 4](docs/skills/brewing-assistant/cluster/operational-guide.md#step-4--resolved-brew-output-format). When proposing a brew strategy from a roast outcome, name the canonical strategy explicitly so the iteration loop matches the framework.

> Core principle: The brew recipe does not fix a bad roast, but it can hide a good one. A roast that passes the Day 7 evaluation gate but feels muted is often an extraction problem, not a roast problem. Always try a pushed brew before concluding more development is needed.

---

## Reading Roast Parameters to Predict Brew Behavior

Several roast parameters directly predict how a coffee will behave at brew time, independent of cup flavor notes. These patterns have been confirmed across Sudan Rume Washed and should be applied as starting hypotheses for new lots.

| Roast Signal | Brew Prediction | Starting Adjustment |
|---|---|---|
| WB-to-ground delta ≤2 points | Even internal development — coffee will likely respond well to extraction pressure. Flavor hidden at standard params may emerge at finer grind or lower temp. | Try 1-2 clicks finer than evaluation grind; lower temp by 2-3°C |
| WB-to-ground delta +4 to +6 points | Surface developed faster than core — may taste bright/harsh with thin mid-palate | Lower temp to soften surface extraction; consider longer bloom |
| Agtron WB 74-78, delta tight | Light internal development, evenness confirmed — this is the target zone for delicate washed expression | Start with pushed recipe (see below). Standard recipe likely under-extracts. |
| Agtron WB above 79 | Very light — likely underdeveloped unless delta is tight. Nutty/grassy at standard params. | Increase extraction aggressively — finer grind, higher temp, higher concentration |
| Agtron WB below 70 | Risk of overdevelopment — tea-like, flat. Standard recipe may be appropriate. | Back off extraction. Coarser grind, lower temp, lower concentration. |
| Maillard above 47% | Bloated Maillard — roasty/baked character likely, reduced top-note lift | Standard or backed-off extraction. Do not push. |
| Maillard 40-44% | Balanced phase structure — full aromatic expression available | Pushed recipe appropriate. Lower temp, higher concentration. |
| FC temp 202-205°C, drop 206-207°C | Confirmed target zone for Sudan Rume-type coffees — full expression should be achievable at brew | Pushed recipe. See reference recipe below. |

> Per-lot reference brew recipes (CGLE Sudan Rume Washed #133, CGLE Mandela XO #139) live in [ROASTING.md § Reference Roasts + Brews (Closed Lots)](ROASTING.md). The decision logic + processing-method hypotheses below apply when designing the optimized brew for a new lot reaching reference-roast declaration.

---

## Pushed vs. Standard Recipe Decision Logic

For delicate washed coffees with high aromatic compound concentration (Sudan Rume, Gesha, Ethiopian landraces), the standard xbloom evaluation recipe is calibrated for consistency, not expression. The following decision logic determines when to push:

| Observation at Standard Recipe | Diagnosis | Action |
|---|---|---|
| Muted, quiet, tea-like throughout | Under-extraction — delicate compounds not being released | Lower temp by 2-3°C AND increase concentration to 1:14. Try finer grind last. |
| Pleasant but thin, loses character as it cools | Extraction correct, but missing body compounds | Finer grind (1-2 clicks). Lower ratio to 1:14.5. |
| Bright, sharp attack but hollow finish | Surface extracting ahead of core | Lower temp. Longer bloom. Do not go finer. |
| Good character at hot stage, closes at cool | Correct extraction range — just needs more concentration | Lower ratio to 1:14 only. |
| Dark tea, flat throughout | Overdevelopment in the roast — brew recipe cannot fix this | Do not push. Standard or backed-off recipe. Flag roast as overdeveloped. |
| Nutty, grassy, flat | Underdevelopment in the roast — confirmed by Agtron above 79 | Do not push at brew — cannot compensate for roast underdevelopment. Flag for next roast session. |

---

## Processing Method Starting Hypotheses for Brew

These starting points are derived from the brewing reference guide's extraction strategy framework, adjusted for what has been confirmed on these specific counterflow roasts.

| Process Type | Evaluation Recipe Strategy | Optimized Recipe Direction | Temperature | Ratio |
|---|---|---|---|---|
| Washed, high-density Colombian | Standard xbloom — but expect muting. Evaluate at cool stage. | Lower temp, higher concentration, Melodrip | 91-92°C | 1:14-1:15 |
| Natural (CGLE Sudan Rume) | Standard xbloom — expect more expressiveness than washed version | Similar to washed but possibly slightly higher temp to handle body | 92-93°C | 1:14.5-1:15.5 |
| XO-fermented (Mandela) | Standard xbloom — fermentation character will emerge but may be front-loaded and pungent. Do not adjust based on xbloom alone — run real brew before concluding. | **Balanced Intensity, not Full Expression.** The fermentation provides all the intensity the cup needs. Use April Brewer or equivalent flat-bottom brewer, coarser grind, moderate temp. Do not use UFO/fast cone as the primary evaluation brewer — it amplifies the fermentation attack. | 93°C | 1:17 |
| Washed Gesha (counterflow) | Standard xbloom — but start evaluation at warm stage, not hot | Very low agitation, lower temp, Melodrip critical | 90-91°C | 1:15-1:16 |

---

## The Brew-Reveals-Roast Principle

One of the most important learnings from Sudan Rume Washed: **what appears in the optimized brew cup is what was already in the roast, waiting to be unlocked.** The evaluation recipe will often miss it.

Concretely: Batch #133 at the standard xbloom recipe tasted muted, tea-like, and under-extracted. At 91°C / 1:14 / EG-1 6.0, the same batch produced candied apricot, bergamot, jasmine, and lemon that matched the producer's own tasting notes exactly.

The implication for the development loop:

- If the evaluation recipe gives a muted or thin result but the WB-to-ground delta is tight and roast structure looks correct, the roast is likely fine — run an optimized brew before concluding that more development is needed
- If the optimized brew also gives a muted or thin result, the roast genuinely needs more development
- If the optimized brew gives a sharp, harsh, or disconnected result, the roast may be overdeveloped — back off extraction before concluding the roast failed

**Build the optimized brew session into every lot close-out.** Do not declare a reference roast without confirming it produces the target cup through the optimized brew, not just the evaluation recipe.

**Extension (Low confidence, 1 lot — ECU-TD24-RANCHOTIO-TM-WASHED):** The Brew-Reveals-Roast Principle has a third application beyond the original two (under-developed cup at standard recipe / over-extracted cup at pushed recipe). Third case: **on a structurally underdeveloped roast, the WRONG brew strategy produces a falsely-discordant cup that masquerades as a roast problem.** Batch 179 was genuinely underdeveloped (Maillard 49.4%, weight loss 11.89%) — but at the V1 design's originally-planned recipe (1:14 / EG-1 6.0 / 91°C, inherited from the #133 Sudan Rume Washed anchor lineage), the cup read "discordant", "not totally integrated", "dark Earl Grey body" — signals that look like roast underdevelopment failure but were 80% brew-strategy mismatch. Pivoting to Clarity-First (1:16 / 6.5 / 92°C, variety-appropriate strategy from brewing.md archive) recovered 5 of 8 producer descriptors and produced an integrated cup. The roast was still structurally limited (hollow back-half, narrow peak window) — but the discordance was overwhelmingly brew-driven.

Operational implication for one-shot calibrations and lot close-outs: when the cup at the planned recipe reads discordant, the diagnostic question is NOT "is the roast under-developed?" but rather "is the brew strategy mismatched to the variety?" — especially when the planned recipe was inherited from an anchor roast for a different variety. Variety signal at brew time dominates over anchor-roast lineage. Cross-reference brewing.md's Process / Variety Signal Table at the brew design step, not just the roast design step. Treat as Low-confidence hypothesis pending 1-2 more lots where roast-anchor-lineage and variety-recommended brew strategy diverge.

---

## WB-to-Ground Agtron Delta Hypothesis Violation on Drop-Ceiling-Breached Batch (working hypothesis — 1 lot, Medium confidence)

Observed on Bukure Natural Lot 21 V1 (cupped 2026-05-11): WB-to-Ground deltas across the three V1 slots ordered v1a +3.4 / v1b +6.6 / v1c +1.0. The leading slot at Day 7 pourover was v1b (widest delta), and the slot with the tightest delta in the V4 target zone (v1c at +1.0) was the disliked cup. v1c was the drop-ceiling-breach batch (drop fired at 209.0°C vs 207°C ceiling).

Working hypothesis: when a roast breaches the drop ceiling, the additional heat post-FC drives the core to catch up to the surface via overdevelopment rather than via even-rate energy penetration. The resulting WB-to-Ground delta tightens mechanically (core Agtron rises toward surface Agtron) without reflecting good roast structure. The delta-quality correlation in the existing CCIL is inverted in this regime.

Mechanism implication: WB-to-Ground delta is a reliable internal-development signal only WHEN the drop ceiling was respected. On ceiling-breach batches, delta is non-diagnostic or actively misleading.

Operational implication: when reading delta across a V1 spread, exclude ceiling-breach batches from the delta-quality inference. Validate at 2+ more lots before promoting from working hypothesis — the next ceiling breach with a Day 7 cupping is the test case.

Lot data:
- v1a (240°C peak, drop 204.5°C clean): WB 75 / Gnd 71.6 / delta +3.4 — cup ranking #2 (most aromatically complex but body-darker)
- v1b (244°C peak, drop 206.5°C clean — leading slot): WB 82.5 / Gnd 75.9 / delta +6.6 — cup ranking #1 (most balanced/integrated)
- v1c (248°C peak, drop 209°C BREACH): WB 81.4 / Gnd 80.4 / delta +1.0 — cup ranking #3 (disliked — discordant)

---

## Total Time Outweighs Peak Inlet for Body Weight on Pulp-Fermentation Washed at High Moisture (working hypothesis — 1 lot, Medium-High confidence)

Observed on REDPLUM-CAS-2026 V1: across a 5°C peak inlet spread (240/245/250°C), the cup ordering for body weight tracked total roast time more than peak inlet. v1a at 240°C peak produced HEAVIER body (very dark / tannic / blacker tea) than v1b at 245°C peak (lighter body, hollow on cool). The mechanism: v1a's operator stall-prevention drop fired at 5:30 (vs v1b's 5:08), giving 22s additional total roast time that amplified body weight more than the -5°C peak difference reduced it. v1c at 250°C peak with no FC and 4:15 total dropped pre-crack — body was raw/nutty/grassy from underdevelopment, but aromatic top notes from the short Maillard window survived.

Working hypothesis: on washed-process lots in counterflow, post-FC total time accumulates body-weight effect faster than peak inlet does within a typical ±5°C spread. Operational implication: when invoking the long-end manual stall-prevention drop rule, do so as EARLY as the curve permits (don't wait the full 6:00-6:30 judgment window if RoR has flattened) — extending total time produces heavier body, which may or may not be desirable depending on the lot's flavor profile target. Inverse: if a lot's cup signal is hollow-body, deliberately extending total time by 10-15s past auto-drop (via short-end manual hold or +1°C drop ceiling) may rescue body weight without changing peak inlet structure.

Watch for repeat pattern on next washed lot (REDPLUM V2 will partially test — moisture-aware shape change reduces total time across the spread, predicts cleaner body balance at the same peak; if V2 body is uniformly lighter than V1 the pattern confirms). Promote from working hypothesis to confirmed when seen on a second washed lot.
