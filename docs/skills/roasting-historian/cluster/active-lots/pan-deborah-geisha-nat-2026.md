# Finca Deborah Geisha Natural 'Interstellar' — active lot

*Coffee Research · Latent · Roasting Historian cluster · active-lots*

**Lot:** PAN-DEBORAH-GEISHA-NAT-2026
**Status:** Active - V1 designed 2026-07-25, revised 2026-07-27 (experiment `PAN-DEBORAH-GEISHA-NAT-2026-V1`, recipes v1a/v1b/v1c in DB; v1c drop target 210→209°C per the peer-calibration handoff). NOT yet pushed to Roest - the density gate is the last open pre-V1 gate. Roast-queue #1, deferral lifted 2026-07-25 under the layered-evolving depth goal.
**Cultivar:** Gesha (Green Tip per Untold bag)
**Terroir:** Panama - Volcán Barú Highlands (Chiriquí)
**Producer:** Jamison Savage, Finca Deborah (tier-2 / master-producer tier)
**Process:** Natural - Multi-Variable Yeast Inoculated, 100+ hr (per Untold bag) - heavy-ferment family, NOT a simple fruit-dried natural
**Density / moisture:** TBM at intake (sealed bag) - backfill via `patch_green_bean`. Elevation 1,900 masl (DB) vs 1,950 (Untold bag) - reconcile at intake.
**Producer notes:** melon, coffee blossom, peach (Untold cup)
**Quantity / cost:** 1,000g = one full V-set at ~100g with margin. Highest-cost lot in inventory ($419/kg).
**Reference cup status:** Untold peer reference CUPPED 2026-07-27 (brew `c818dfcb`, linked as `peer_reference_brew_id`; WB Agtron 60.6, Hybrid/Intensity-Clarity Split rescue + built water + salt). KEY FINDINGS: (1) Vocabulary anchor for V1 cupping = **melon** (dominant, most reliable descriptor) + **kiwi** (hot attack, unlisted) + **rose** (cool - but NOT a quality discriminator: it survived ruined cups; inverts the standard Panama-Gesha-Natural rose-absence diagnostic). Peach / blossom / molasses / oolong did NOT survive - unconfirmed at any roast level; V1's lighter roasts are the test. (2) The advertised "dramatic hot→cool shift" read only WEAKLY at 60.6 - cannot separate roast-flattened from never-there. (3) 60.6 is the observed floor-marker: florals go under a toasted dark-brown-tea roast register that phase separation relocates but never eliminates (~14 Agtron points clearance to target). (4) Body read thin even at 60.6 on a heavy-ferment natural at low-clarity extraction - variety-intrinsic light body; **layered-evolving on this lot must be built from clarity + aromatic separation, not weight**. (5) Ferment-expression calibration NOT achieved (roast-masked) - V1's own cups are the first read on the 100+ hr inoculation signature. The peer brew's RECIPE does not transfer to Latent-roasted slots (it manages a roast register V1 won't create - do not cite `c818dfcb` as a recipe precedent).

## The depth arc

This lot carries the apex goal directly: no resolved roast has yet reached the layered-evolving bar (the honest baseline in CONTEXT-taste.md), and this is the highest apex-probability green in hand - natural Panama Gesha from the master-producer tier, the same family as the PicoLot favorites that define the bar. Goal: a resolved reference roast + optimized brew with distinct layers moving hot→warm→cool and attack→body→aftertaste, clarity as the carrier. This is a depth arc, not a range-finder - run the full V-set to a reference roast, don't stop at "interesting."

**Sibling:** Deborah 'Elipse' (nitrogen/washed-finish) in transit - different process, so nothing in this arc is duplicated by it; design notes here feed that comparison later.

## Working hypothesis (V1 design basis)

The development window sits on the **bean-temp drop-ceiling axis, not peak inlet**. Carry-forward:

- **FC temp is architectural at ~205°C on naturals** (SR Natural + Wush Wush + Gesha Clouds; peak-inlet sweeps move FC time, never FC temp).
- **Gesha Clouds** (same cultivar, heavy-ferment family, resolved 2026-06-14, High confidence): reach target core development via the bean-temp end-condition target on a fixed curve; it resolved at a 211°C drop after 209°C fired too early.
- **Wush Wush Natural** (the designated pre-Deborah natural practice arc, V1-V3): first producer-note emergence came from going lighter than Untold's roast, then walking development up the drop ladder; the ceiling lever is nonlinear near FC (206°C→4s dev, 208°C→61s, 210°C clock-capped on the 242°C curve).
- **Target register:** WB Agtron ~71-81, center ~75-78 (PicoLot empirical anchor). The original "layered-body side ~74-77" bias was SOFTENED 2026-07-27: the peer cup showed body is variety-intrinsic-light on this lot and will not come from development - the layers have to come from clarity + aromatic separation, so chasing body via development is the direct path to the overdev cup. **The overdev ceiling is apex-defined** - the cup going flat/loud/static across the temperature arc - not a color.

## V1 — bean-temp drop-ceiling ladder 206 / 208 / 209°C on a fixed 246°C-peak curve

**Fixed curve (all slots):** inlet 200 → 234@1:15 → 242@2:30 → **246°C peak@3:15** → 242@4:00 → 234@5:00 → 228@6:00 (Wush Wush v2c shape, +4°C toward Gesha Clouds' 250°C heavy-anaerobic-Gesha register). Fan SR-Natural lot-standard 80/68@1:45/63@2:30/70@4:15/73@5:30. RPM flat 65. Charge 117°C / hopper 125°C / preheat 210°C (operator-fixed). 100g. `bean_temp` end condition on every slot (auto-drop discipline non-negotiable; FC audibility uncertain on heavy ferment).

- **v1a — 206°C floor-finder:** deliberately below the ~48s Gesha dev floor; locates the transparent/underdeveloped edge of the band. Predicted: dev 10-25s, ~4:30 total, WB ~79.
- **v1b — 208°C predicted center:** dev ~45-60s, WB ~75-76. If layered-evolving shows anywhere in V1, it shows here. Judge on arc movement + aromatic separation, not weight.
- **v1c — 209°C ceiling probe (revised 2026-07-27, was 210°C):** the original "Untold's 60.6 roast still moves hot→cool, so the true ceiling is high" premise was contradicted by the peer calibration cup - the 60.6 arc was weak and needed phase separation + salt to be drinkable, evidence the ceiling sits LOWER than assumed. 209°C keeps a genuine probe beyond v1b (~+30-40s dev) at lower static-cup risk; its job is unchanged - map where the arc dies. Clock-cap at 6:00 still accepted as a finding.

**Narrow single-variable spread is deliberate** - a named deviation from the V1 wide-mapping default, per three precedence rules: high lot value + Medium anchor confidence → narrow spread + pre-V1 risk reduction; peak inlet proven a non-lever for FC temp on naturals; heavy-ferment family → bean_temp end condition.

## Pre-V1 gates

1. **Density gate (OPEN):** measure density + confirm bag specs at intake, backfill via `patch_green_bean`; also reconcile elevation (DB 1,900 vs bag 1,950). Density ≤760 g/L → drop the whole curve to 244°C peak; ≥800 → hold 246°C. Last gate before the Roest profile push.
2. **Peer calibration cup (CLOSED for vocabulary, 2026-07-27):** brew `c818dfcb` - findings folded into the Reference cup status above and the V1 design. The ferment-expression half of the calibration could not close from this bag (roast-masked at 60.6) and transfers to V1's own cupping.

## Per-lot protocol deviations

None from the naturals protocol. Standard Day 7 pourover gate, with the anaerobic-natural caveat: xbloom cannot rank close candidates alone - real pourover (SPG or optimized-brew dial-in) before any reference call.
