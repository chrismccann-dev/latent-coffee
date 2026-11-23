# Arturo Paz Dark Room Natural Geisha (Honduras, Kumquat) - closed-lot learnings

*Coffee Research · Latent · Roasting Historian cluster · learnings*

**Lot:** HND-ARTUROPAZ-GESHA-DRD-NAT-2026
**Status:** Closed (2026-11-23) - two V-sets to reference; first lot closed under the real-pourover gate (xbloom gate retired mid-lot)
**Cultivar:** Geisha
**Terroir:** Honduras / Santa Bárbara-Yojoa Highlands / Finca El Itacayo, El Dorado, ~1,600-1,730m (first Honduras lot in the archive)
**Process:** Natural, Dark Room Dried
**Green:** density 802 g/L (high), moisture 9.5% (low). 1000g from Kumquat ($143/kg); ~400g remaining at close. Producer notes: Mango, Nectarine, Blackberry, Lemongrass - all four landed in the reference cup. Companion roasted peer bag was misplaced and never cupped.
**Reference roast:** Batch 248 (V2 v2b) · fixed 242°C-peak sustained-tail curve · bean_temp auto-drop 208.0°C / 5:01 · FC 4:03 / 200.4°C · 58s dev · WB Agtron 78.4 / WL 10.4% · Roest profile 633492 ("Paz Gesha - v2b")
**Optimized brew:** brew_id `7bc5f39b` · Latent house style (93°C / 30s-bloom deltas) · SWORKS, 15g / 240g (1:16), 45g bloom 30s / 150g @ 0:45 / 240g @ 1:30 · mango + blackberry + nectarine + peach-tea finish, peak warm, holds cool · optimized on the gate cup itself (diminishing-returns call)

## Substrate pointers

- **roast_learnings row:** `03a1fff7-2a8b-4037-a34a-374354ba6484` (green_bean_id `6502d971-2c8d-43e7-a3d3-929a3f54489d`). All structured fields populated.
- **Experiments:** V1 `52000daa` (drop ladder 206/207/208 on the fixed curve; winner V1B Batch 239 at the xbloom gate) · V2 `87397313` (ladder 207.5/208/208.5; winner V2B Batch 248 on the real-pourover gate).
- **Roasts:** V1 Batches 238/239/240 (`16de2f68` / `30cde522` / `9f2331ca` - 239 runner-up + V1 reference candidate, 240 anti-target); V2 Batches 247/248/250 (`f426db1c` / `ded5d291` **reference** / `6be85a2b`). FC audible on all six.
- **Cuppings:** V1 Day-7 xbloom gate 2026-11-11 (`55da1dbd` / `be7f832d` / `99324d19`); V2 Day-8 real-pourover gate 2026-11-23 (`9f77a031` / `66c08060` / `89404d29`).
- **Active-lot doc:** [active-lots/hnd-arturopaz-gesha-drd-nat-2026.md](docs/skills/roasting-historian/cluster/active-lots/hnd-arturopaz-gesha-drd-nat-2026.md) (closed stub; carried the V-set designs + roast actuals during the arc).

## Why Batch 248 won as the lot reference

The only roast where the full producer-note set assembled - mango, nectarine, blackberry, lemongrass-as-integrated-herbalness - in a cup that stayed sweet, juicy, and harmonious hot, warm (peak: "so sweet, so juicy, so fruity", very clean finish), and cool (everything blended, peach-tea finish). Won the V2 head-to-head "by far, no questions asked," and unlike V1's winner (Batch 239, judged only on the xbloom gate) its verdict was a consumption-condition verdict on the house-style chassis. Caveat recorded for replication: the 58s dev came partly from an early FC (200.4°C), so re-encoding the reference should use a dev-time end condition (~55-60s), not the 208 bean-temp trigger. 239 and 248 were never cupped head-to-head; 239 stands as the lighter bright-tea expression of the lot.

## Roast architecture that produced it

One fixed curve across all six batches (242°C peak: 200→232 @ 1:15→240 @ 2:30→242 @ 3:15, sustained tail 239/235/231/228, SR-Natural fan 80/68/63/70/73, RPM 65, charge 117 / preheat 210, 100g), bean-temp drop ladders as the only designed variable: V1 206/207/208 (v1c operator-held to 209.3), V2 207.5/208/208.5. Dense + dry did not slow the lot - every batch ran fast vs prediction (4:38-5:19 totals).

Two lot-defining physics findings:

- **FC is loose, not fixed**: 200.4-206.9°C / 4:03-4:48 across identical curves - a boundary case for the fixed-FC-on-naturals pattern. Consequence: bean-temp triggers decoupled from dev time (6/58/46s across V2's 207.5/208/208.5) and two slots (v1a, v2a) executed as accidental FC-onset roasts.
- **WB Agtron is nearly blind to dev time in the playable zone**: 83.7/83.6 at 5s vs 21s dev; the cup moved categorically while color stood still. Color only separated past ~208 drops.

## Cup-side diagnostic signals

- **Underdev:** muted/hollow tea-water - bright and clean with NO sour marker (the classic sour underdev signature never appeared on this lot); pale stone fruit (white nectarine/peach/grape), lemongrass sharpening into a biting finish, flat cooling arc. Correlate: dev < ~25s at any color (238 @ WB 83.7, 247 @ 81.9).
- **Overdev:** overcooked-fruit / oversteeped-tea aroma hot, bitterness forward, sweetness/acidity suppressed, improves a lot cooling but stays unbalanced; mango present but shadowed. Correlate: drop ≥ ~208.5 / WB ≤ ~77.5 / WL ≥ ~10.9 (240 terminal at 209.3/72.7/11.3; 250 mild).
- **The attribution finding (the lot's key insight):** V2's b/c pair decoupled color from dev time (248: more dev, lighter; 250: less dev, darker) - 250 showed the bitter edge, 248 none. **The roast-forward failure is color/drop-temp-driven; integration and sweetness are dev-time-driven.** Mango needs dev TIME, not darkness.

## Cross-lot framing

Resolved development-behaved, but at a far lighter window than the Deborah/AN10 family solutions (reference WB 78.4 vs Deborah's 84.9 at 210.5 drop) and with a hard color ceiling. The carry-forward for the next dense DRD/natural (Gesha or adjacent): same fixed curve, ladder dev TIME via dev-time end conditions (~40/55/70s bracket), expect the winner near 55-60s / drop 207.5-208.5 / WB 78-80, audible FC with ±3°C FC noise, bitter ceiling at ≥208.5. Judge on the real-pourover house-style gate across the full cooling arc - hot-only judging over-ranks underdev and under-ranks overdev on this family. Gate-history note: V1 was judged on the xbloom gate, V2 on the real pourover; the gate change is standing from this lot onward.

## Related

- Anchor lots that fed the design: [learnings/bra-fazendaum-wushwush-nat-2026.md](docs/skills/roasting-historian/cluster/learnings/bra-fazendaum-wushwush-nat-2026.md) (structural anchor - fixed-FC read did NOT transfer) + [learnings/pan-deborah-geisha-nat-2026.md](docs/skills/roasting-historian/cluster/learnings/pan-deborah-geisha-nat-2026.md) (natural-Gesha register - transferred at much lighter color)
- Patterns: [cross-coffee-insights.md](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md) (fixed-FC-on-naturals boundary case + the dev-time/color decoupling probe, candidates at next arbitration)
