# Arturo Paz Dark Room Natural Geisha (HND-ARTUROPAZ-GESHA-DRD-NAT-2026)

*Coffee Research · Latent · Roasting Historian cluster · active-lots*

**Status:** Active - V1 cupped 2026-11-11, winner V1B (Batch 239, reference candidate); V2 designed, waiting for next roast
**Cultivar:** Geisha · **Terroir:** Honduras / Santa Bárbara-Yojoa Highlands / Finca El Itacayo, El Dorado, ~1,600-1,730m · **Process:** Natural, Dark Room Dried
**Green spec:** density 802 g/L (high), moisture 9.5% (low). 1000g from Kumquat ($143/kg). Producer notes: Mango, Nectarine, Blackberry, Lemongrass.
**Peer reference:** companion roasted bag (roasted 2026-07-24) MISPLACED as of 2026-11-03 - proceeding without a peer cup; producer notes + Deborah/Wush Wush fingerprints are the vocabulary priors. Cup it before the Day-7 gate if it turns up.

## Working hypothesis (V1)

Structural anchor is [BRA-FAZENDAUM-WUSHWUSH-NAT-2026](docs/skills/roasting-historian/cluster/learnings/bra-fazendaum-wushwush-nat-2026.md) (same process family + near-identical green spec: 809 g/L / 9.1%): fixed ~205°C FC expected, bean-temp drop ceiling as the only lever, development likely color-driven. Cup-side transfer is Medium confidence (cultivar differs); [PAN-DEBORAH-GEISHA-NAT](docs/skills/roasting-historian/cluster/learnings/pan-deborah-geisha-nat-2026.md) corroborates the natural-Gesha register but at 741 g/L. V1 is a narrow fixed-curve set per the fixed-FC confirmed pattern - no peak-inlet sweep.

- **Fixed curve (all slots):** 242°C peak (200 -> 232 @ 1:15 -> 240 @ 2:30 -> 242 @ 3:15), sustained tail 239/235/231/228 @ 4:00-7:00, SR-Natural fan 80/68/63/70/73, RPM 65, charge 117 / hopper 125 / preheat 210.
- **Ladder:** bean_temp 206 / 207 / 208 (1°C steps; post-FC climb ~1°C/30s). v1a = FC-onset benchmark, v1b = predicted leader, v1c = dev-floor + roast-register probe.
- **Family fork to resolve:** FC-onset-behaved (Wush Wush) vs development-behaved (Deborah/AN10) - v1c's cup decides the direction.
- **Gate discipline:** lemongrass producer note predicts xbloom under-extraction (judge cool); DRD naturals are in the gate-misranking family - SPG arbiter required before any reference call.

## V1 roast actuals (2026-11-04)

| Slot | Batch | FC | Drop | Dev | WB Agtron | WL% | End condition |
|---|---|---|---|---|---|---|---|
| v1a | 238 | 4:33 / 205.6°C | 4:38 / 206.0°C | 5s | 83.7 | 9.5 | bean_temp 206 (auto) |
| v1b | 239 | 4:25 / 204.3°C | 4:46 / 207.0°C | 21s | 83.6 | 9.8 | bean_temp 207 (auto) |
| v1c | 240 | 4:48 / 207.1°C | 5:19 / 209.3°C | 31s | 72.7 | 11.3 | manual (operator held past the 208 trigger for separation) |

Roast-layer facts (cupping-independent):

- **FC is NOT tightly fixed on this lot**: 204.3-207.1°C across an identical curve - looser than the Wush Wush fixed-FC anchor predicted. Treat the ~205 anchor as Low-Medium on this lot going forward.
- **WB color plateau in the 206-207 drop zone**: v1a and v1b are indistinguishable (83.7 / 83.6) despite +1°C and +16s dev; separation only appeared at the 209.3 manual hold (72.7). The knee is somewhere in 207-209.3 - V2's ladder, if the cup asks for it, works that gap.
- **The whole set ran fast** vs predictions (4:38 / 4:46 / 5:19 vs 4:52 / 5:20 / 5:50). Dense + dry does not slow this lot on this curve.
- v1c drop-timing override was Chris's on-the-spot call (drop-timing only, consistent with the standing intervention surface); design intent 208 preserved on the recipe row.
- FC audible on all three batches (operator-confirmed 2026-11-04) - no DRD-natural audibility suppression on this lot, unlike the heavy-ferment family.

## V1 cup verdict (Day 7, 2026-11-11)

**V1B (Batch 239) won at every temperature station** - sweet, bright, nectarine + blackberry over a tea base, herbal lemongrass integrated, improving with complexity as it cools. Chris: "probably closest to the Apex Cup I've ever gotten so far"; flagged `is_reference_candidate`. v1a (238): clean FC-onset floor - bright, tea-like, white nectarine/peach/grape, NO sour underdev marker, but hollow and missing kick. v1c (240): overdone - bitter/overcooked-fruit hot, improves a lot cold, and is the ONLY slot where the **mango** signature shows.

What V1 resolved (Medium confidence):

- **Development time is the active lever and WB is nearly blind to it in the playable zone**: 206→207 (5s→21s dev) moved the cup from hollow to closest-to-apex at identical WB (83.7/83.6); 209.3 (31s, WB 72.7) overshot into roast-forward.
- **Family fork resolved with a twist**: development-behaved, but at a far lighter/narrower window than the Deborah/AN10 solutions - and more development did not win outright (239 beat 240).
- **Producer-note map**: nectarine + blackberry live on the light side; mango lives on the developed side; lemongrass reads as integrated herbalness (the predicted under-extraction trap did not fire at the gate).
- **Measurement protocol change**: interim-cup ground Agtron RETIRED (15g of grounds is too little for a reliable reading) - whole-bean Agtron is the gate-cupping color signal on this and future lots.

## V2 design (2026-11-11, waiting for next roast)

Chris's call: push development slightly above 239, below 240. Single-variable control-style sweep - identical V1 curve, bean_temp ladder **207.5 / 208 / 208.5** (0.5°C steps, lower third of the 207-209.3 gap). Control baseline is V1B. Primary question: does a touch more dev integrate mango/deeper sweetness without the 240 roast edge - where is the knee? Win condition: beat a cup Chris already loves; drop rules say trust the auto-drop (no v1c-style hold - 240 already mapped the far side; slow-side manual caps 5:45 / 5:45 / 6:00).

Experiment `HND-ARTUROPAZ-GESHA-DRD-NAT-2026-V2` (`87397313-6759-4560-94ad-62144f54acfc`); recipes `876380a7` (v2a, 207.5) / `aff73a4a` (v2b, 208, predicted leader) / `7aea98ef` (v2c, 208.5, knee probe); Roest profiles 633491 / 633492 / 633493 ("Paz Gesha - v2a/b/c"); cuppings `55da1dbd` (238) / `be7f832d` (239) / `99324d19` (240).

## V1 substrate

Experiment `HND-ARTUROPAZ-GESHA-DRD-NAT-2026-V1` (`52000daa-18fe-425b-883c-82e63f51be1f`); recipes `cbf756f6` (v1a, 206°C) / `7b268fdb` (v1b, 207°C) / `1c9bbb30` (v1c, 208°C); Roest profiles 625669 / 625670 / 625671 ("Paz Gesha - v1a/b/c"). Roest inventory 12272. Green bean `6502d971-2c8d-43e7-a3d3-929a3f54489d`. Roasts: v1a batch 238 `16de2f68` (log 4241581) / v1b batch 239 `30cde522` (log 4241587) / v1c batch 240 `9f2331ca` (log 4241600).
