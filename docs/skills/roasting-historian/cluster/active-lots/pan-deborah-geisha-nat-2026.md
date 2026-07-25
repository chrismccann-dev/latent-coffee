# Finca Deborah Geisha Natural 'Interstellar' — active lot

*Coffee Research · Latent · Roasting Historian cluster · active-lots*

**Lot:** PAN-DEBORAH-GEISHA-NAT-2026
**Status:** Active - V1 designed 2026-07-25 (experiment `PAN-DEBORAH-GEISHA-NAT-2026-V1`, recipes v1a/v1b/v1c in DB). NOT yet pushed to Roest - two pre-V1 gates open (density measurement + Untold peer-reference calibration cup). Roast-queue #1, deferral lifted 2026-07-25 under the layered-evolving depth goal.
**Cultivar:** Gesha (Green Tip per Untold bag)
**Terroir:** Panama - Volcán Barú Highlands (Chiriquí)
**Producer:** Jamison Savage, Finca Deborah (tier-2 / master-producer tier)
**Process:** Natural - Multi-Variable Yeast Inoculated, 100+ hr (per Untold bag) - heavy-ferment family, NOT a simple fruit-dried natural
**Density / moisture:** TBM at intake (sealed bag) - backfill via `patch_green_bean`. Elevation 1,900 masl (DB) vs 1,950 (Untold bag) - reconcile at intake.
**Producer notes:** melon, coffee blossom, peach (Untold cup)
**Quantity / cost:** 1,000g = one full V-set at ~100g with margin. Highest-cost lot in inventory ($419/kg).
**Reference cup status:** Untold paired roasted version IN FREEZER STOCK (WB Agtron 60.6, frozen 15g doses) - NOT yet cupped. Untold notes: molasses, peach, melon, oolong aftertaste, "dramatic hot→cool shift." Untold roasts darker than the target register - flavor-vocabulary + arc calibration, not a roast target. Set `peer_reference_brew_id` when brewed via peer-variant-completion.

## The depth arc

This lot carries the apex goal directly: no resolved roast has yet reached the layered-evolving bar (the honest baseline in CONTEXT-taste.md), and this is the highest apex-probability green in hand - natural Panama Gesha from the master-producer tier, the same family as the PicoLot favorites that define the bar. Goal: a resolved reference roast + optimized brew with distinct layers moving hot→warm→cool and attack→body→aftertaste, clarity as the carrier. This is a depth arc, not a range-finder - run the full V-set to a reference roast, don't stop at "interesting."

**Sibling:** Deborah 'Elipse' (nitrogen/washed-finish) in transit - different process, so nothing in this arc is duplicated by it; design notes here feed that comparison later.

## Working hypothesis (V1 design basis)

The development window sits on the **bean-temp drop-ceiling axis, not peak inlet**. Carry-forward:

- **FC temp is architectural at ~205°C on naturals** (SR Natural + Wush Wush + Gesha Clouds; peak-inlet sweeps move FC time, never FC temp).
- **Gesha Clouds** (same cultivar, heavy-ferment family, resolved 2026-06-14, High confidence): reach target core development via the bean-temp end-condition target on a fixed curve; it resolved at a 211°C drop after 209°C fired too early.
- **Wush Wush Natural** (the designated pre-Deborah natural practice arc, V1-V3): first producer-note emergence came from going lighter than Untold's roast, then walking development up the drop ladder; the ceiling lever is nonlinear near FC (206°C→4s dev, 208°C→61s, 210°C clock-capped on the 242°C curve).
- **Target register:** WB Agtron ~71-81 centered ~76-77 (PicoLot empirical anchor), biased to the layered-body side (~74-77) for this fruit-tea natural. **The overdev ceiling is apex-defined** - the cup going flat/loud/static across the temperature arc - not a color.

## V1 — bean-temp drop-ceiling ladder 206 / 208 / 210°C on a fixed 246°C-peak curve

**Fixed curve (all slots):** inlet 200 → 234@1:15 → 242@2:30 → **246°C peak@3:15** → 242@4:00 → 234@5:00 → 228@6:00 (Wush Wush v2c shape, +4°C toward Gesha Clouds' 250°C heavy-anaerobic-Gesha register). Fan SR-Natural lot-standard 80/68@1:45/63@2:30/70@4:15/73@5:30. RPM flat 65. Charge 117°C / hopper 125°C / preheat 210°C (operator-fixed). 100g. `bean_temp` end condition on every slot (auto-drop discipline non-negotiable; FC audibility uncertain on heavy ferment).

- **v1a — 206°C floor-finder:** deliberately below the ~48s Gesha dev floor; locates the transparent/underdeveloped edge of the band. Predicted: dev 10-25s, ~4:30 total, WB ~79.
- **v1b — 208°C predicted center:** dev ~45-60s, WB ~75-76, the layered-body side of the register. If layered-evolving shows anywhere in V1, it shows here.
- **v1c — 210°C ceiling probe:** operator dark-tea/static tolerance bound; accept a 6:00 clock-cap as a finding (Wush Wush v3c precedent). Tests whether the arc survives deep development (the Untold WB-60.6 roast still moving hot→cool suggests a high true ceiling) or goes static.

**Narrow single-variable spread is deliberate** - a named deviation from the V1 wide-mapping default, per three precedence rules: high lot value + Medium anchor confidence → narrow spread + pre-V1 risk reduction; peak inlet proven a non-lever for FC temp on naturals; heavy-ferment family → bean_temp end condition.

## Pre-V1 gates (open)

1. **Density gate:** measure density + confirm bag specs at intake, backfill via `patch_green_bean`. Density ≤760 g/L → drop the whole curve to 244°C peak; ≥800 → hold 246°C.
2. **Peer calibration cup:** the Untold Interstellar reference (freezer stock) before or alongside V1 cupping - establishes the flavor vocabulary (does "melon/blossom/peach" survive Untold's darker roast? what does the hot→cool shift actually taste like?) so V1 cups are read against a live anchor, not label prose.

## Per-lot protocol deviations

None from the naturals protocol. Standard Day 7 pourover gate, with the anaerobic-natural caveat: xbloom cannot rank close candidates alone - real pourover (SPG or optimized-brew dial-in) before any reference call.
