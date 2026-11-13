# HiU Los Lajones Geisha Natural Bambu 8B (Panama, Graciano Cruz / HiU) - closed-lot learnings

*Coffee Research · Latent · Roasting Historian cluster · learnings*

**Lot:** PAN-LOSLAJONES-BAMBU-GESHA-NAT-2026
**Status:** Closed (2026-11-13) - the apex benchmark natural Gesha of the Forward set (Forward 93), resolved in ONE V-set
**Cultivar:** Gesha
**Terroir:** Panama / Volcán Barú Highlands (Chiriquí) / Volcancito, Boquete; 2025 harvest
**Process:** Natural (traditional - no inoculation noted)
**Green:** density 800 g/L (HIGH), moisture 11.2% (HIGH - first >=11% lot in the counterflow archive at design time). 1kg @ $400/kg via Forward Coffee (lot P250217); calibration benchmark, not a workhorse.
**Reference roast:** Batch 245 (V1 v1b) · Maya-identical 246C-peak sustained-tail curve · bean_temp auto-drop 210.0C / 4:52 · FC audible 4:20 / 205.0 · dev 32s · WB Agtron 80.6 / WL 11.5% · Roest profile 628190 ("Los Lajones - v1b")
**Optimized brew:** brew_id `e80613a4` · Latent house style with ONE delta - 92C instead of 94 (slight roast character at top of band on the WB 80.6 roast) · SWORKS + xBloom Premium · 15g/240g 1:16 · EG-1 6.5 · Hybrid (Sequential) · jasmine/tea hot -> mandarin/peach/mango juicy warm -> bright citrus/tropical/floral cool · resolved in one brew

## Substrate pointers

- **roast_learnings row:** `ef25f71d-b61b-4fc9-812d-7a9ce6606d90` (green_bean_id `26eb61e7-54d9-4f6f-b4b9-e0ca1a86ed31`).
- **Experiment:** V1 `PAN-LOSLAJONES-BAMBU-GESHA-NAT-2026-V1`: `bb090f2b-8307-4d99-a388-3d9d6f5b4e14` (as-run ladder 208/210/212 after an operator +2C mid-session trigger bump; winner V1B Batch 245).
- **Roasts:** Batches 244 (`6caaba20`, light floor) / 245 (`58ce04cb`, **reference**, is_reference=true) / 246 (`894a5e63`, deep-edge marker).
- **Cuppings:** Day-7 xbloom gate 2026-11-12 (`9576aab9` 244 / `b4d321aa` 245 / `68f4b800` 246). Ground Agtron deliberately not measured (15g samples too small; WB-as-truth for this V-set). No SPG: the operator overruled the Path C deferral on a clear gate read ("this one seemed pretty clear to me") - both head-to-heads decisive for 245.
- **Brews:** optimized `e80613a4-9599-4656-83a9-a7f0cb7b435d` (2026-11-13). No peer-roasted variant of this lot exists.
- **Active-lot doc:** [active-lots/pan-loslajones-bambu-gesha-nat-2026.md](docs/skills/roasting-historian/cluster/active-lots/pan-loslajones-bambu-gesha-nat-2026.md) (closed stub).

## Why Batch 245 won as the lot reference

The full layered-evolving apex arc at the gate - jasmine/lavender hot, juicy stone fruit + strawberry warm, candy + tart cool - clarity-led, with no underdevelopment read at 32s dev. It beat 244 (208 rung) on candy and coherence, and 246 (212 rung) on clarity and absence of roast character on cooling. The optimized brew confirmed the pick on Brew 1: house style with a single 92C temperature trim carried the identical arc at pourover strength ("batch 245 brews as designed"). The one-V-set resolution is the lot's headline: a wide-bracketed first ladder on a family-anchor curve plus a live operator recalibration was enough on a lot whose green quality did the rest.

## Roast architecture that produced it

Curve held verbatim from the Maya sibling (PAN-LOSTORIGIN-MAYA-TRIUP-YEAST-NAT-2026) for strict cross-lot comparability: 200 -> 236 (1:15) -> 243 (2:30) -> 246 peak (3:15) -> sustained tail 243/239/235/232; SR-Natural fan 80/68/63/70/73; RPM 65; charge 117 / hopper 125 / preheat 210; BEAN_TEMP auto-drop everywhere, honest drops, no holds. Designed ladder 206/208/210; the lot ran fast at the machine, so the operator bumped all three triggers +2C mid-session - the as-run 208/210/212 ladder recovered the DESIGNED color range almost exactly (WB 86.3/80.6/74.9 vs predicted-at-design ~83/79/72). FC audible on all three (v1c most audible), 204-205C per the natural FC-temp constraint (v1c's 4:39/208.3 mark read ~15-20s late, the Maya batch-237 pattern).

## Cup-side diagnostic signals

- **Underdev (Batch 244, 208C/20s/WB 86.3):** off-balance cup reading under- AND over-developed at once, lactic note on the hot aroma; structure doesn't cohere until cool (cooling rescues it into bright/sweet/simple - an improve arc from a low base).
- **Overdev (Batch 246, 212C/WB 74.9):** seductive warm (sweetness/fruit/juiciness peak - "might be the one"), then roast character separates out on cooling (degrade arc); rounder but less clarity. Brew-side earliest hint: even the 210 reference shows a slight roast note at 94C water, gone at 92C.
- 246's WB 74.9 equals the Maya PEER roast's color - a standing cross-lot color calibration point.

## Cross-lot framing (the lot model finding)

Same-curve cross-lot transfer has a hard limit even between near-twin Panama natural Geshas: on the identical 246C curve, this 800 g/L / 11.2% lot climbed post-FC ~16s per C and read ~6-7 WB points LIGHTER at equal trigger than the 833 g/L Maya (86.3/80.6/74.9 at 208/210/212 vs Maya 78.6 at 208 / 69.2 at 210), with a shallower color slope (~2.9 pts/C vs Maya's 9.4 over the top 2C). Curve architecture transfers; trigger numbers and color models re-anchor per lot. The Gesha 48s dev floor did NOT bind at 32s dev (counter-evidence; 20s did read incomplete). Starting hypothesis for the next similar lot lives on the roast_learnings row: Maya/Los Lajones curve verbatim, ladder in 1-2C steps centered on 210, FC ~4:15-4:25/204-205 audible, target WB ~80, house style at 92C brew-side.

## Related

- Sibling lots on the same curve family: [learnings/pan-deborah-geisha-nat-2026.md](docs/skills/roasting-historian/cluster/learnings/pan-deborah-geisha-nat-2026.md) (architecture source) + the Maya active lot [active-lots/pan-lostorigin-maya-triup-yeast-nat-2026.md](docs/skills/roasting-historian/cluster/active-lots/pan-lostorigin-maya-triup-yeast-nat-2026.md) (identical-curve twin, mid-arc at close)
- Patterns: [cross-coffee-insights.md](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md) (FC-temp constraint on naturals - third audible-FC corroboration at 204-205C; Gesha dev-floor counter-evidence pending a second natural data point)
