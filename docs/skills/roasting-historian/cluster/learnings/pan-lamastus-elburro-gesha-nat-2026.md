# Lamastus El Burro Geisha Natural Lot #16 (Panama, Lamastus Family) - closed-lot learnings

*Coffee Research · Latent · Roasting Historian cluster · learnings*

**Lot:** PAN-LAMASTUS-ELBURRO-GESHA-NAT-2026
**Status:** Closed (2026-11-23) - resolved in ONE V-set, on the lightest rung of the ladder
**Cultivar:** Gesha
**Terroir:** Panama / Volcán Barú Highlands (Chiriquí) / El Burro, Potrerillos; 2025 harvest. Elevation ~1,550-1,800 m per roaster listings (not on the bag, not producer-verified).
**Process:** Natural (traditional - no inoculation noted)
**Green:** density 726 g/L (LOWEST in the archive), moisture 11.6% (ties the archive high). 1 kg @ $160/kg via Forward Coffee (lot P250044). ~700 g remaining at close.
**Reference roast:** Batch 251 (V1 v1a) · Deborah reference curve verbatim (244C peak, sustained tail) · bean_temp auto-drop 208.0C / 4:57 · FC audible 4:56 / 207.9C · dev ~1s · WB Agtron 91.9 / WL 11.5% · Roest profile 635795 ("El Burro - v1a")
**Optimized brew:** brew_id `874696c5` · Latent house style with ONE delta - 93C instead of 94 · SWORKS + xBloom Premium · 15g/240g 1:16 · EG-1 6.5 · Hybrid (Sequential) · fruit candy + milk tea hot -> honey / orange blossom / berry cool · the winning Day-8 gate cup as-is, no iteration

## Substrate pointers

- **roast_learnings row:** `79980626-70b1-46fc-b4cd-9fef22f270a0` (green_bean_id `0d1440c2-33e5-4d7f-bb7f-198d6bae538f`).
- **Experiment:** V1 `PAN-LAMASTUS-ELBURRO-GESHA-NAT-2026-V1`: `6788b723-d054-4315-a798-1d8346d80e94` (designed ladder 208/210/212; as-run 208.0 / 210.1 / 211.5; winner V1A Batch 251).
- **Roasts:** Batches 251 (`c29a7485`, **reference**, is_reference=true) / 252 (`59ffe139`, runner-up) / 253 (`d9550674`, manual drop at 211.5C - operator read it drifting too dark).
- **Cuppings:** Day-8 house-style gate 2026-11-23 (`93277cf4` 251 / `5bb3e1e8` 252 / `65efb3d3` 253). No xBloom read (operator went straight to the house-style pourover). No ground Agtron.
- **Brews:** optimized `874696c5-6c79-4ce3-816b-0cbfb72da2fc` (2026-11-23). No peer-roasted variant.
- **Roasting Brief:** [docs/lots/pan-lamastus-elburro-gesha-nat-2026.md](docs/lots/pan-lamastus-elburro-gesha-nat-2026.md). Roest inventory 12500 archived at close.

## Why Batch 251 won as the lot reference

It was the most elegant and integrated cup of the three on the identical house-style recipe: fruit candy and a milk-tea frame hot, honey, orange blossom and berry cool, high acidity and high sweetness in balance, very low bitterness. 253 was eliminated on the first pass (chocolate-forward hot, highest bitterness). 252 earned a back-to-back and lost it clearly - more fruit sweetness and punch, but sharper and less integrated ("251 is just a much more elegant cup ... no question"). The winning gate cup is the optimized brew.

## Roast architecture that produced it

Deborah v2a curve verbatim: 200 -> 232 (1:15) -> 240 (2:30) -> 244 peak (3:15) -> sustained tail 241/237/233/230; SR-Natural fan 80/68/63/70/73; RPM 65; charge 117 / hopper 125 / preheat 210; bean_temp auto-drop. The drop was the only lever. The reference is a first-crack-onset drop: FC marked one second before the trigger fired.

## Cup-side diagnostic signals

- **Underdev:** not observed. The FC-onset drop carried only a slight lactic note hot, and it read pleasant. The lot's underdeveloped cup is unknown.
- **Overdev:** milk chocolate moving to the front of the hot cup, a muddled / sharper structure, rising bitterness. Visible at 22s dev (252, WB 85.2), clear at ~40s (253, WB 78.9). The deeper cups improve on cooling but never regain 251's elegance.
- **Producer notes:** honey, orange blossom, jasmine / tea, citrus, cherry / berry and the milk chocolate all showed. Watermelon and papaya did not, in any slot.

## What the lot taught

- **The reference is not bracketed on the light side.** The winner was the rung designed as a throwaway light wall, so nothing lighter was roasted. Preference fell monotonically with development (208.0 > 210.1 > 211.5C). The operator closed on V1 by choice; ~700 g remain if a lighter rung is ever wanted.
- **The low-density timing model did not transfer.** Deborah (741 g/L) raced the probe; this lot at 726 g/L ran about 16s slower than the Deborah-derived prediction, with FC audible near 4:55 / 207.7C even on the light rung. Whole-bean colour per degree did transfer (all three within 2 points of prediction).
- **The 208C-is-hollow expectation did not transfer** from Deborah or Los Lajones.
- **253's FC mark (4:33 / 204.7C) is ~20s early** against its two siblings on the identical curve; its logged 62s dev is overstated (~40s sibling-consistent).
- The seen-before test called this lot novel by the letter (density below every closed lot); the operator ran the narrow fixed-curve ladder anyway and it resolved in one V-set, at the edge.

## Starting hypothesis for the next similar lot

On the roast_learnings row: next low-density natural Gesha, Deborah curve verbatim, expect FC audible near 4:55 / 207-208C, and centre the ladder ON first crack (e.g. 206 / 208 / 210C) so the FC-onset drop is bracketed on both sides. House style at 93C brew-side.

## Related

- Curve donor: [learnings/pan-deborah-geisha-nat-2026.md](docs/skills/roasting-historian/cluster/learnings/pan-deborah-geisha-nat-2026.md)
- Same-family plain natural Gesha from the Forward set: [learnings/pan-loslajones-bambu-gesha-nat-2026.md](docs/skills/roasting-historian/cluster/learnings/pan-loslajones-bambu-gesha-nat-2026.md)
- Pattern: [cross-coffee-insights.md § First-V-set default](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md#first-v-set-default-on-seen-before-lots---fixed-curve-drop-ladder)
