# Fazenda Um Wush Wush Natural Dark Room Dried — active lot

*Coffee Research · Latent · Roasting Historian cluster · active-lots*

**Lot:** BRA-FAZENDAUM-WUSHWUSH-NAT-2026
**Status:** Active - V2 roasted 2026-06-05 (batches 206/207/208), Day 7 cupping pending. **All three V2 batches did NOT reach FC** (fc_audibility=ambiguous in DB pending migration 066 for did_not_fire enum value). V1 cupped 2026-05-15. Untold paired-roasted reference cupped 2026-05-25 - resolved the V1 cup-vs-structure question. Strategic role: Gesha-natural floral practice lot before committing V1 on Finca Deborah ($419/kg, deferred).
**Cultivar:** Wush Wush
**Terroir:** Brazil
**Producer:** Fazenda Um
**Process:** Natural (Dark Room Dried)
**Density / moisture:** 809 g/L (high), 9.10% (lowest in archive)
**Producer notes:** mandarin, prune, cacao
**Reference cup status:** Untold paired roasted reference CUPPED 2026-05-25 (Tier 2). KEY FINDING: Untold's lot is a MEDIUM roast and its cup shows the SAME dark-black-tea-wall as all three V1 batches - but on Untold's side the documented brewing fix was a structural Hario Switch Intensity-Clarity Split that DRAINS the over-developed register out. This confirms the V1 dark-tea body is roast-derived over-development, not brewing/fermentation artifact. Mandarin dies first under heat and returns only on cooling once the roast stops being amplified. Untold Stronghold profile (47.7% Maillard) - Tier 3, directional only.

Migrated from ROASTING.md § Active Lots in Wave 4 PR 4b (2026-05-21).

## V1 — peak inlet variation 245 / 248 / 251°C; all three breached structural failure boundaries

- **v1a (Batch 173, 245°C peak):** FC 4:51/205.1°C, drop 5:16/206.0°C, dev 25s, Maillard 53.2%, Agtron WB 73.3.
- **v1b (Batch 174, 248°C peak):** FC 4:27/205.6°C, drop 4:50/207.5°C, dev 23s, Maillard 50.3%, Agtron WB 75.6.
- **v1c (Batch 175, 251°C peak):** FC 4:02/204.7°C, drop 4:44/209.0°C, dev 42s, Maillard 43.7%, Agtron WB 76.6.

**V1 leading slot: v1a (Batch 173)** by Day 11 xbloom_gate pourover (15 days = day 11, xbloom Brian Quan recipe). Explicitly framed by operator as 'best of the worst bunch, not a reference example.' **NOT a reference roast candidate.**

## V1 cup hierarchy INVERTED structural hierarchy

- **Structurally-worst v1a** was preferred (darker black tea + caramel + spice hot; almond + sliced orange + complexity at cool full cup; sweetness hidden).
- **Structurally-cleanest v1c** was middle (deeper-orange sweet-tart hot; hollow at cool stage).
- **Structurally-anchor v1b** was worst (flat, smoky, missing complexity).

Ground Agtrons 71.8 / 76.4 / 75.1. WB→Ground deltas +1.5 / **-0.8** / +1.5 — sign-inverted delta on v1b (ground LIGHTER than WB) is an unusual signal worth tracking.

Producer notes (mandarin / prune / cacao) absent across all three cups. Cacao partial-read as caramel/almond on v1a only. Mandarin and prune absent entirely. **NO Gesha-adjacent floral character emerged in any cup** — the strategic premise for Finca Deborah transfer practice is NOT yet earned on this lot.

## Critical V1 architectural finding

FC arrives at 204-206°C across all three peak inlet levels. **Higher peak pulls FC TIME earlier but does NOT pull FC TEMP lower.** Same architectural failure pattern as Sudan Rume Natural V2 reproduced on a different cultivar / different lot / different terroir. **Propagated to [cross-coffee-insights.md § FC-Temp Architectural Constraint on Naturals](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md#fc-temp-architectural-constraint-on-naturals---working-hypothesis).**

## V2 design (experiment CGLE-WUSHWUSH-NAT-2026-V2, pushed to Roest 2026-05-25)

The Untold-reference calibration resolved the V1 cup-vs-structure question toward reading (a)-with-a-twist: the coffee wants LESS total development (mandarin survives only when the roast stops being amplified), NOT more. This **DISCONFIRMS V1's Path 1** (SR Natural V3/V4 low-energy-LONG-Maillard transfer) - that architecture runs Maillard to ~66% and total time to ~6:00, which builds MORE developed register, exactly the wrong direction. V2 is a NEW design (operator-approved): Option 2 (early-ramp lever to move FC temp cooler) + Option 3 (bean-temp floor-finder on the low batch).

**Primary variable:** early-ramp inlet aggressiveness (01:15 + 02:30 inlet values). Peak inlet held CONSTANT at 242°C across all three so the early ramp is the isolated probe. V1 proved peak inlet moves FC TIME but not FC TEMP; gentling the early ramp is the lever that can move FC temp itself cooler, creating dev headroom for a cool drop. NOTE: charge (117°C) + hopper-load (125°C) are operator-fixed constants (between-batch-protocol.md Item 25) - NOT varied; the inlet curve carries the entire thermal-approach change. Bean-temp end condition on all three (machine auto-drop) removes the manual-drop failure that breached the ceiling on V1 (209°C on v1c).

- **v2a FLOOR-FINDER** (recipe 39d63326, Roest 520910): early ramp 200→224→236, peak 242, bean-temp drop **200°C**. Gentlest ramp; deliberately biased underdeveloped per the handoff's 'bias light, walk up.' Job is to find the floor, not to win. Risk: if 200°C fires pre-FC (Red Plum v1c ceiling-collision pattern), the floor is above 200 - raise next set.
- **v2b TARGET** (recipe efcb1490, Roest 520911): early ramp 200→228→238, peak 242, bean-temp drop **202°C**. Most likely to land in the playable zone - mandarin survives, dark-tea body reduced. Success criterion below.
- **v2c UPPER BRACKET** (recipe d28dc3e5, Roest 520912): early ramp 200→232→240, peak 242, bean-temp drop **204°C** - still cooler than every V1 drop. Safe-development fallback if a/b land too light.

**Success criterion (from brew handoff):** a plain percolation Balanced Intensity brew (V60/Orea, ~1:16, ~93°C) yields mandarin + prune + cacao with a clean finish and no oversteeped wall - i.e. the roast widened brewing tolerance enough that the Hario Switch rescue is unnecessary. Falsifiable: if mandarin still requires the Switch, V2 didn't go light enough.

## V2 roast results - hypothesis FALSIFIED (2026-06-05)

All three V2 batches dropped at their bean-temp targets with FC having never fired:

- **v2a (Batch 206, 200°C drop):** No FC. Drop 4:14/200.1°C, Agtron WB **95.3** (extremely light), weight loss 7.5%. 0 cracks. Floor-finder confirmed floor is above 200°C.
- **v2b (Batch 207, 202°C drop):** No FC. Drop 4:24/202.0°C, Agtron WB **88.8** (very light), weight loss 8.3%. 0 cracks. ror_at_4:00 = 9.39°C/min (post-peak decel).
- **v2c (Batch 208, 204°C drop):** No FC. Drop 4:30/204.0°C, Agtron WB **86.9** (very light), weight loss 8.6%. 0 cracks. ror_at_4:00 = 9.62°C/min. Most-developed V2 batch and still no FC - confirms FC temp at 242°C peak sits above 204°C.

**V2 hypothesis falsified.** The hypothesis 'gentling the early inlet ramp moves FC TEMP cooler' is wrong, at least within the design envelope (peak 242°C, early-ramp variation 224→236 to 232→240). Combined with V1's finding 'peak inlet moves FC TIME but not FC TEMP,' V2 establishes the stronger claim: **FC TEMP on this Wush Wush is roughly fixed at ~205°C bean_temp across the inlet-curve design space tested.** This is a hard constraint, not a probe-and-tune variable. Confidence: Medium-High (3+3 batch evidence, monotonic Agtron progression across the recipe spread confirms the spread executed mechanically as designed).

**Reframing of V1 leading-slot inversion**: the cup-vs-structure inversion of V1 (favored slot was structurally-worst) was NOT evidence the coffee 'wants' the V1 profile - it was evidence that all of V1 was equally past FC, and the leading slot won by accident of cooling dynamics rather than by the V1 inlet variable. The brew-handoff insight ('target lighter than Untold's medium roast') is still operative, but the path to lighter is NOT via FC-temp manipulation.

## V3 design fork - awaiting V2 cup data

Two paths emerge, both accepting FC ~205°C as a fixed property of this coffee:

- **Path α - hold peak 242°C, raise drop target to 205-206°C bean_temp.** Restore V1-era FC energy budget but with the auto-drop discipline V1 lacked. Effectively: rerun v1a's energy with v2's drop discipline. Favored if V2 cups show pure underdev signature with no first-emergence floral/mandarin signal (the lighter direction failed at 242°C peak, return to V1-era energy with disciplined drop).
- **Path β - raise peak inlet to 244-246°C, hold drop target cool at 203-204°C bean_temp.** Use peak inlet as the lever V1 confirmed (moves FC TIME earlier) paired with cool auto-drop that V1 lacked, catching the bean immediately post-FC with very tight dev. Favored if V2 cups show ANY first emergence of mandarin/floral OR absence of V1's dark-tea body (the lighter direction works, just need FC to actually happen).

Decision deferred to post-V2-cupping conversation.

## Strategic

Wush Wush V1 cup outcome does NOT support carrying the framework forward to Finca Deborah V1 design yet. **Finca Deborah deferral status remains in effect.** Wush Wush V2 is the next gate for that question. The Untold-reference calibration adds a transferable lesson regardless of V2 outcome: on a low-elevation transparency-variety natural, ROAST LEVEL dominates the cup, and the failure mode to design against is over-development (dark-tea body, suppressed mandarin), not under-development - useful when Finca Deborah (high-elevation natural Gesha) eventually gets its V1, though the elevation difference means the FC-floor and density assumptions do NOT transfer uncritically.

## Open questions

1. Untold paired roasted reference cup vs the three V1 batches — direction calibration.
2. Cup-vs-structure inversion: real signal or preference-among-failures?
3. Sign-inverted WB→Ground delta on v1b — measurement artifact, session-position effect, or real surface-vs-core dynamic?
4. Does dark-room drying preserve aromatics differently than expected?
5. Wush Wush counterflow transferability to Finca Deborah — lower than the inventory doc assumed?

## Cross-references

- [by-process/natural.md](docs/skills/roasting-historian/cluster/patterns/by-process/natural.md) — per-process roll-up
- [cross-coffee-insights.md § FC-Temp Architectural Constraint on Naturals](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md#fc-temp-architectural-constraint-on-naturals---working-hypothesis) — pattern co-confirmed by this lot's V1 data
- [active-lots/cgle-srume-natural-2026.md](docs/skills/roasting-historian/cluster/active-lots/cgle-srume-natural-2026.md) — sibling natural; V3/V4 architecture cited as Path 1 transfer reference
