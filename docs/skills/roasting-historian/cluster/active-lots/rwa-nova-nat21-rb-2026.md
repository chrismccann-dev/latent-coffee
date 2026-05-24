# Bukure Natural Lot 21 (Red Bourbon, Rwanda Northern Province) — active lot

*Coffee Research · Latent · Roasting Historian cluster · active-lots*

**Lot:** RWA-NOVA-NAT21-RB-2026
**Status:** Active - V1 complete (closed at Day 7 pourover 2026-05-11). V2 roasted 2026-05-23 (batches 193/194/195), Day 7 pourover pending (target 2026-05-30).
**Cultivar:** Red Bourbon
**Terroir:** Rwanda / Northern Province / Virunga foothills (terroir_provenance=canonical as of 2026-05-06)
**Producer:** Agnes Mukamushinja & Felix Hitayezu / Nova Washing Station (producer_override; tier-3, awaiting registry research)
**Process:** Natural

Migrated from ROASTING.md § Active Lots in Wave 4 PR 4b (2026-05-21).

## V1 — peak inlet variation 240 / 244 / 248°C centered on Sudan Rume Natural V3 winner direction

Standard SR Natural fan curve held constant.

**V1 leading slot: v1b (Batch 177, 244°C peak)** — confirmed at Day 7 xbloom-gate pourover (2026-05-11). Chris's verdict: "the most balanced integrated cup." Won on balance/integration alone among three over-dark candidates, NOT because 244°C is correct for this coffee.

- **v1a (#176):** cupped second — most aromatically complex (fruity + nutty + chocolatey) but darker body.
- **v1c (#178):** cupped last — flavors didn't integrate; ceiling-breach overdevelopment.

## V1 cup signal across all three slots: "darker than what it says" (Chris's exact phrase)

Producer notes (cranberry, honeycomb, lingonberry) failed to surface substantially on any slot. Only black tea + a hint of caramel-style sweetness landed; the bright/berry side stayed buried. **Suggests the lot wants STILL LOWER energy than the V1 spread covered.**

## WB-to-Ground delta surprise

v1a +3.4 / v1b +6.6 / v1c +1.0 — the LEADING slot had the WIDEST delta, and the tightest-delta slot (v1c at +1.0, in V4 target zone) cupped as the LOSER.

**Working hypothesis:** v1c's drop-ceiling breach mechanically drove the core to catch up to the surface via overdevelopment, producing a tight delta that masks an overdeveloped cup rather than signaling good roast structure. This violates the CCIL hypothesis "tight delta correlates with cup quality" — flag as **Medium-confidence violation worth watching**, not yet generalizable. **Propagated to [cross-coffee-insights.md § Working Hypotheses (Single-Lot, Low Confidence)](../patterns/cross-coffee-insights.md#working-hypotheses-single-lot-low-confidence).**

## V1 key insight (Medium confidence)

The Sudan Rume Natural V3 lower-energy direction does NOT transfer cleanly to East African Red Bourbon natural at high altitude in the 240-248°C peak band. The lot wants still lower energy than the SR Natural anchor predicted (which was already 238-242°C centered).

## V2 design (pushed to Roest 2026-05-15, batches not yet roasted)

Shift the spread DOWN 6°C. Levels 234 / 238 / 242°C peak inlet. Bean temp end condition set to 207°C on all three (structural change from V1 to prevent session-position acceleration from breaching the drop ceiling - V1 v1c failure mode). Fan curve held constant.

**Roasted 2026-05-23 (batches 193/194/195). Day 7 pourover pending - cup-side leading slot + V3 direction resolve at the log-cupping pass. Roast-layer actuals below.**

**KEY ROAST-LAYER FINDING - the energy FLOOR is bracketed between 234°C and 238°C peak inlet.** The 6°C downward shift from V1 didn't just lighten the cups - it pushed the lowest slot below the FC threshold entirely. This is the cupping-independent structural result of V2.

- **v2a (#193, 234°C peak): NEVER REACHED FC.** fc_temp/fc_start null, 0 cracks (fc_audibility ambiguous). Bean topped out at 199.9°C; the 207°C bean-temp trigger never fired; roast ran to the 6:00 profile terminus and dropped there. Dev N/A. Maillard 61.4% is a phase-calc artifact (no FC marker). Agtron WB 75.8. **Underdeveloped below FC - invalidated as a clean data point; establishes that 234°C peak is below the FC-threshold energy for this lot at this density/moisture.** Do not design a future Bukure batch below ~238°C peak.
- **v2b (#194, 238°C peak): marginal FC.** FC 05:27 / 203.1°C, 1 crack (fc_audibility subtle). Dev 18s (5.2%) - shortest in the project. Drop 203.1°C / 05:45, ~4°C below the 207°C profile trigger; recorded end_condition_type=manual (operator pull, PROVISIONAL - awaiting Chris confirmation; the ask_user_input picker didn't return a selection). Maillard 56.2% (compressed, FC very late). Agtron WB 79.6. 238°C is the FC-threshold floor: barely reaches FC but with structurally thin development.
- **v2c (#195, 242°C peak): the structurally sound batch.** FC 04:49 / 205.0°C, 4 cracks (fc_audibility audible - only clean FC of V2). Dev 41s (12.4%) - complete development phase. Drop 206.2°C / 05:30, 0.8°C under the 207°C trigger - bean-temp end condition honored cleanly, NO ceiling breach (vindicates the V2 protocol change after V1's v1c breach). Maillard 49.1%. Agtron WB 74 (darkest of V2 - the 41s dev compounded surface development, echoing V1's dev-time-outweighs-peak pattern).

**Implication for V3 (provisional, pending V2 cupping):** peak inlet below 238°C is off the table (sub-FC). If V2 cupping still reads "darker than what it says," the V3 lever is NOT lower peak inlet - it would be dev-time reduction (cut v2c's 41s toward 25-30s via steeper post-peak decline or a lower bean-temp end condition ~204-205°C, since 207°C was unreachable at v2a/v2b energy) or a fan-curve change. The 207°C bean-temp end condition should be lowered to ~205°C on this lot - it only fired cleanly on v2c, and was unreachable on the two lower-energy slots.

## Open brew question

Brew direction not yet brew-confirmed — V1 was evaluated only at xbloom Brian Quan gate. Before locking V3 design after V2 cupping, worth running v1b (or whichever V2 slot leads) at Balanced Intensity recipe (flat-bottom brewer, 92-93°C, 1:16-1:17) to confirm whether "darker than what it says" is roast-side ceiling or xbloom-extraction-amplifying-darkness. Mirrors the Costa Rica Higuito V1 finding.

## Lot budget

907g - 300g (V1) - 300g (V2) = 307g remaining. ~3 batches headroom for V3 plus optimized brew session if reference roast lands cleanly. No margin beyond that.

## Cross-references

- [by-process/natural.md](../patterns/by-process/natural.md) — per-process roll-up; first East African Red Bourbon natural in archive
- [cross-coffee-insights.md § Working Hypotheses (Single-Lot, Low Confidence)](../patterns/cross-coffee-insights.md#working-hypotheses-single-lot-low-confidence) — WB-to-Ground delta hypothesis violation flagged here
- [active-lots/cos-hig-bor-2026.md](./cos-hig-bor-2026.md) — sibling natural where xbloom-gate misranking was first surfaced
- [active-lots/cgle-srume-natural-2026.md](./cgle-srume-natural-2026.md) — SR Natural V3 anchor that this lot's V1 spread centered on
