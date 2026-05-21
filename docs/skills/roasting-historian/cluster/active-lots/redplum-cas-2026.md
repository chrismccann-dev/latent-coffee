# El Paraiso Red Plum Castillo (Diego Samuel Bermúdez, Cauca, Colombia) — active lot

*Coffee Research · Latent · Roasting Historian cluster · active-lots*

**Lot:** REDPLUM-CAS-2026
**Status:** Active — V1 closed at Day 9 pourover 2026-05-17 (rest_days 9, two days past V4 Day 7 standard); V2 designed and pushed to Roest 2026-05-17 as `v2-moisture-aware-shape` experiment.
**Cultivar:** Castillo
**Terroir:** Colombia / Cauca
**Producer:** Diego Samuel Bermúdez / El Paraiso
**Process:** Pulp-fermentation washed variant
**Density / moisture:** 802 g/L / 11.2% (highest in measured set)
**Anchor:** SR Washed CF-Light #133 reference profile. Density 802 g/L matches anchor range. Off-anchor variables: 11.2% moisture (highest in measured set), pulp-fermentation washed process variant, different farm/producer. Anchor transferred cleanly to this lot at V1 (Medium-High confidence post-cupping).

Migrated from ROASTING.md § Active Lots in Wave 4 PR 4b (2026-05-21).

## V1 — peak inlet spread 240 / 245 / 250°C, full curve scaled proportionally from #133 anchor

Standard fan curve held constant (80→68→63→70→73%). RPM flat 65. End condition BEAN_TEMP @ 207°C auto-drop.

**V1 roast outcomes:**

- **#180 (v1a, 240°C peak):** FC 05:07 / 203.6°C, drop 05:30 / 203.6°C (operator stall-prevention), dev 39s, Agtron WB 77.4.
- **#181 (v1b, 245°C peak):** FC 04:34 / 205.4°C, drop 05:08 / 207.0°C, dev 34s, Agtron WB 80.9.
- **#182 (v1c, 250°C peak):** NO FC RECORDED, drop 04:15 / 207.0°C, dev N/A, Agtron WB 90.8 (ceiling-collision failure — bean temp reached 207°C before FC could occur).

## V1 Day 9 pourover cuppings (xbloom_gate, 2026-05-17, all WB/Ground deltas tracked)

- **#180:** aroma fruit + dark black tea; flavor sweet plum/cherry (2 of 5 producer notes); body very dark / tannic / black-tea (the cup's defining feature, also its weakness); WB→Ground delta 2.6 (V4 target met).
- **#181 — LEADING SLOT V1.** Aroma strong intensity (blow-off-the-table); flavor plum/cherry/raspberry (3 of 5 producer notes); body lighter than #180 but trends hollow on cool stage; WB→Ground delta 5.0 (widest of the three, outside-vs-inside development differential).
- **#182:** confirms ceiling-collision failure mode; aromatic top notes present (fruit/sweet attack) but body is nutty/grassy/raw/underdeveloped; WB→Ground delta 1.9 (artifactually tight, bean barely developed); not preferred.

## V1 key insight (Medium-High confidence)

Peak inlet temperature is the primary lever for this lot, **but the cup-quality function isn't monotonic in peak** — it's "did the roast geometry land FC + ~35s dev inside the 207°C ceiling without operator intervention." v1b nailed it; v1a's stall-prevention drop produced LONGER total time which amplified body weight (total time is a stronger body lever than peak inlet on this lot); v1c never landed FC. The SR Washed CF-Light #133 anchor transfers cleanly with minor moisture-aware shape adjustment — no anchor-level rethink needed.

## V1 open questions feeding V2

1. Can v1b's body weight be lightened (toward less dark) without trading off into hollow-on-cool?
2. Is the WB→Ground delta of 5.0 on v1b a real signal or measurement artifact of high FC temp?
3. Would v1c at the same 250°C peak with operator hold-past-auto-drop produce a usable cup, or is the kinetics-vs-thermal-mass mismatch fundamental? (Low priority — V2 avoids 250°C regardless.)

## V2 design (experiment_pk ac6411d4-9d09-4003-bdc9-66a6d06dd345, batches not yet roasted)

**Narrower peak spread shifted cooler** — 243 / 245 / 247°C (±2°C from v1b leading slot).

**PRIMARY VARIABLE: moisture-aware inlet shape** — 01:15 bumped from 237°C to 240°C across all three slots (front-load drying-phase energy to pull FC into 4:15-4:25 from v1b's 4:34); 02:30 dropped from 245°C (at peak in V1) to 240°C (canonical peak-minus-5°C per Standard Inlet Curve Template).

- **v2a (243°C peak, parent_recipe v1a):** cool-edge probe with shape change; expect lighter body than v1a, cleaner fruit.
- **v2b (245°C peak, parent_recipe v1b, CENTERLINE):** direct v1b comparison with shape change; expect v1b's fruit balance with cleaner body.
- **v2c (247°C peak, parent_recipe v1c):** warm-edge probe; **CRITICAL drop rule:** short-end manual hold if 207°C reached pre-FC (the v1c lesson).

All three pushed to Roest (profile_ids 515749/515750/515751).

## Brew direction hypothesis at Day 7

Stone fruit + raspberry profile — Full Expression direction. Plan UFO + Sibarist, 91°C, 1:14, EG-1 6.0 for optimized brew session post-V2.

Note: operator mentioned wanting to test a simulated pourover variant on the v1b sample (Batch 181) — run before V2 cup if green permits, log as a separate `real_pourover` recipe_variant against the same v1b roast_id.

## Cross-references

- [by-process/washed.md](../patterns/by-process/washed.md) — per-process roll-up; this lot is the high-moisture pulp-fermentation washed variant
- [cross-coffee-insights.md § Working Hypotheses (Single-Lot, Low Confidence)](../patterns/cross-coffee-insights.md#working-hypotheses-single-lot-low-confidence) — Total Time Outweighs Peak Inlet for Body Weight on Pulp-Fermentation Washed at High Moisture hypothesis seeded here
- [learnings/cgle-sudan-rume-hybrid-washed.md](../learnings/cgle-sudan-rume-hybrid-washed.md) — #133 anchor that this lot's V1 inherited
