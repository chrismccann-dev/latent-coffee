# Bukure Natural Lot 21 (Red Bourbon, Rwanda Northern Province) — active lot

*Coffee Research · Latent · Roasting Historian cluster · active-lots*

**Lot:** RWA-NOVA-NAT21-RB-2026
**Status:** Closed (2026-06-06). V1 + V2 closed via Path A; V2 SPG (2026-06-04) resolved 194 (v2b) as the reference roast; optimized brew dialed in to Hybrid (Intensity-Clarity Split) on April Switch at brewing-side start-brew session (2026-06-06). Lot reached Resolved state via close-lot.md on this date.

**See closed-lot learnings:** [learnings/rwa-nova-nat21-rb-2026.md](docs/skills/roasting-historian/cluster/learnings/rwa-nova-nat21-rb-2026.md) (registered + seeded 2026-06-06).
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

**Working hypothesis:** v1c's drop-ceiling breach mechanically drove the core to catch up to the surface via overdevelopment, producing a tight delta that masks an overdeveloped cup rather than signaling good roast structure. This violates the CCIL hypothesis "tight delta correlates with cup quality" — flag as **Medium-confidence violation worth watching**, not yet generalizable. **Propagated to [cross-coffee-insights.md § Working Hypotheses (Single-Lot, Low Confidence)](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md#working-hypotheses-single-lot-low-confidence).**

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


## V2 closure (xbloom Day 7 + SPG Day 12, 2026-06-04)

All three V2 batches cupped at xbloom Day 7 (2026-05-30): v2a surprisingly drinkable despite no-FC (FC threshold ≠ drinkability threshold finding); v2b warm-favorite with cranberry surfacing (first explicit producer-note across V1+V2) but degraded cool; v2c cool-holder with cranberry sustained, structurally most complete. Chris invoked SPG between 194 and 195 finalists - diagnosed the xbloom gate as amplifying dark-tea ceiling and masking deeper producer notes.

### SPG resolution (Day 12, 2026-06-04)

**Batch 194 (v2b) declared REFERENCE ROAST.** Both finalists brewed identically at Balanced Intensity (15g · 1:16 · 240g TWW Light · April flat-bottom + April paper · EG-1 6.5 · 91°C steady · low agitation · bloom 45g→140g→240g). Only variable across the two cups was the roast.

- **194 cup:** black tea + honey + caramel + prominent sweetness, balanced not body-heavy, only flaw a slight roast-heads tail (brew-side fixable via output selection). Chris: "Honestly pretty close"; with a small late cut "this would honestly be pretty close." **Held pleasant through the tasting - no cool-collapse.**
- **195 cup:** smokier nose, much smokier + much more bitter + body-centric flavor, sweetness gone, bitter finish. Chris: "I greatly prefer the other one."

### Key SPG findings

1. **The xbloom-gate cool-collapse on 194 disappeared under SPG** - extraction-amplification hypothesis cashed out. The cool-collapse signal at xbloom was extraction-amplified, NOT a roast structural defect of the 18s dev. Major reframe of the cooling-arc divergence reading from xbloom.
2. **The 18s dev IS the cup-winning lever for this lot** - exactly what xbloom's gate suggested was a flaw turns out to be the optimal development for THIS lot under clean extraction. v2b's roast-side `what_to_change` prose said lengthen dev → SPG says the opposite. The 41s dev (195) surfaces as smoke + bitterness once the brew stops amplifying dark-tea. Useful counter to relying on roast-structure-only inferences for forward direction.
3. **Widest WB→Gnd delta AND least development wins** - 3 cleanly-developed data points within this lot all point the same way: v1b +6.6 (V1 winner), v2b +6.1 (V2 SPG winner), v2c +3.1 (cool-holder but SPG declined). CCIL "tight delta = good" pattern is failing consistently on this East African Red Bourbon natural at high altitude. Strong within-lot evidence (N=3 cleanly-developed); single-lot - holds for similar-cultivar cross-lot validation before CCIL promotion. Chris's call to push via close-lot's `roast_learnings.general_takeaway` with scope tags.
4. **Caramel surfaces at SPG** - first time caramel (producer note) emerged across V1+V2+SPG. Black tea + honey + caramel all landed under non-dark extraction. Honeycomb + lingonberry still absent - either masked deeper than xbloom amplification (different brew angle) or genuinely not in this lot's flavor profile. Resolves brewing-side via the optimized-brew dial-in on 194.
5. **xbloom-misranks-dark-tea-prone-naturals confirmed at 2 lots project-wide** - Higuito V1 SPG + Bukure V2 SPG both surfaced the same dynamic. Promoted to Medium-confidence working hypothesis in [cross-coffee-insights.md § xbloom dark-tea ceiling on dark-tea-prone naturals](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md#xbloom-dark-tea-ceiling-on-dark-tea-prone-naturals---descriptor-family-axis-cos-hig-bor-2026-v1--rwa-nova-nat21-rb-2026-v2-observed-2026-0506).

### Routing - Path A close-out at V2

No V3. 307g remaining supports close-out without another V-set. Reference roast clearly = 194 (Batch f8718428-af3a-4acf-b845-91e50872cef6, recipe c739254a-5ea0-4901-9768-34f737a00d41). Reference roast specs: 238°C peak inlet · FC 05:27 / 203.1°C (1 crack, subtle) · dev 18s / 5.2% (shortest in project) · drop 203.1°C / 05:45 · WB 79.6 / ground 73.5 / delta +6.1.

### Replication caveats BLOCKING close-lot

1. **194's drop attribution provisional** - end_condition_type recorded "manual" with target nulled, but actual drop fired 4°C under the 207°C bean_temp trigger. Was it operator early-pull or auto machine-drop? Determines replication strategy: lower bean_temp end-condition (~203-204°C) vs timed pull at 05:45. Needs Chris confirmation before close-lot.
2. **Reference sits at energy floor with marginal dev - narrow roast window.** 234°C v2a never reached FC; 238°C v2b just barely does. Winner is at FC floor with project's shortest dev (18s). Low replication tolerance. Cup wants minimal dev (SPG explicit: don't add dev), but 18s is on the edge. Decide whether to lock 194-as-is or treat "238°C / minimal dev / ~203°C drop" as the reference direction and dial a more replicable execution without adding dev.

### Next operational steps

1. **Brewing-side start-brew session on 194** to dial in the optimized brew. The SPG used a non-iterated best-stab Balanced Intensity recipe - that's the *starting point* for optimized-brew dial-in, not the final optimized recipe. Adjust output selection to address the slight roast-heads tail ("with a small late cut this would honestly be pretty close").
2. **After optimized-brew dial-in:** Run close-lot.md to push roast_learnings, mark `roasts.is_reference=true` on 194, archive Roest inventory, link `green_beans.optimized_brew_id` (the brew_id from step 1).

## Open brew question

**RESOLVED at V2 SPG (2026-06-04).** The "darker than what it says" V1 + V2 cup signal was BREW-amplified (xbloom-extraction-amplifying-darkness hypothesis confirmed), NOT a roast-side ceiling. SPG brewed 194 + 195 at Balanced Intensity (15g · 1:16 · 240g TWW Light · April flat-bottom + April paper · EG-1 6.5 · 91°C steady · low agitation · bloom 45g→140g→240g) cleanly resolved the brew direction - 194 cup landed at black tea + honey + caramel + prominent sweetness, balanced and held through the tasting (no cool-collapse). 195 declined: smoky/bitter/body-centric/no-sweetness. Mirrors Costa Rica Higuito V1's same finding - both lots now form the 2-lot xbloom-misranks-dark-tea-prone-naturals working hypothesis in CCIL (Medium confidence as of SPG resolution).

**Optimized brew direction confirmed for the brewing-side start-brew session on 194:** Balanced Intensity / non-dark / clarity-preserving extraction. The SPG recipe is the starting point for dial-in, not the final optimized recipe - adjust output selection to address the slight roast-heads tail Chris flagged ("with a small late cut this would honestly be pretty close").

## Lot budget

907g - 300g (V1) - 300g (V2) = 307g remaining. **Path A close-out at V2 - no V3.** 307g supports an optimized-brew dial-in session on 194 (brewing-side start-brew) without further roasting. Reference roast confirmed via SPG (2026-06-04); no remaining open question requires another V-set to resolve.

## Cross-references

- [by-process/natural.md](docs/skills/roasting-historian/cluster/patterns/by-process/natural.md) — per-process roll-up; first East African Red Bourbon natural in archive
- [cross-coffee-insights.md § Working Hypotheses (Single-Lot, Low Confidence)](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md#working-hypotheses-single-lot-low-confidence) — WB-to-Ground delta hypothesis violation flagged here
- [active-lots/cos-hig-bor-2026.md](docs/skills/roasting-historian/cluster/active-lots/cos-hig-bor-2026.md) — sibling natural where xbloom-gate misranking was first surfaced
- [active-lots/cgle-srume-natural-2026.md](docs/skills/roasting-historian/cluster/active-lots/cgle-srume-natural-2026.md) — SR Natural V3 anchor that this lot's V1 spread centered on
