# El Paraiso Red Plum Castillo (REDPLUM-CAS-2026) - closed-lot learnings

*Coffee Research · Latent · Roasting Historian cluster · learnings*

**Lot:** REDPLUM-CAS-2026 · **Status:** Resolved 2026-06-22 · **Reference roast:** Batch 212 (v4b)
**Cultivar:** Castillo · **Terroir:** Colombia / Cauca · **Process:** Washed + pulp fermentation
**Producer:** Diego Samuel Bermúdez / Finca El Paraiso · **Green spec:** density 802 g/L, moisture 11.2% (highest in measured set)
**Anchor:** SR Washed CF-Light #133 (transferred cleanly at V1; no anchor-level rethink needed)

Created 2026-07-08 (pruning case 011) from the active-lot working file, the CCIL close-out entries (PR #508 / commit a473523), and the lot's cupping record - the close-out itself routed findings only to the CCIL, so this capsule back-fills the graduation gap. 14 cuppings across four V-sets.

## The arc (V1 → V4)

The lot's persistent cup problem: a bright plum/cherry attack with a HOLLOW mid-palate. Three V-sets failed to fix it by the obvious levers; V4 fixed it with a new one - **flattening the post-FC inlet slope**.

- **V1 (peak inlet sweep 240/245/250°C, full curve scaled from #133):** v1b (#181, 245°C) won - plum/cherry/raspberry, 3 of 5 producer notes - but body trended hollow-on-cool. v1a (#180) took a stall-prevention drop whose LONGER total time amplified body weight (total time is a stronger body lever than peak inlet on this lot). v1c (#182, 250°C) was a ceiling-collision failure: bean hit the 207°C BEAN_TEMP target before FC ever occurred. Cup quality was not monotonic in peak - the real question was whether the geometry landed FC + ~35s dev inside the 207°C ceiling without intervention.
- **V2 (moisture-aware front-half shape, 243/245/247°C):** a regression - the shape change delayed FC and produced worse cups. Within V2 the WB→Ground delta polarity pattern crystallized: 197 (+0.8, tight) cupped most developed and won the V2 SPG; 196 (+4.2) read as stall (intact attack, no middle); 198 (−1.8, ground LIGHTER than WB) had the cleanest roast metrics on the lot and produced the worst cup under both gates - surface-blast structure that brewing does not rescue.
- **V3 (drop-temp ceiling sweep):** couldn't sweep - 207°C is at/above the practical FC ceiling on this lot. 203 (+2.6, both reads near-green) underdeveloped-grassy; 204 (+3.7) bright attack + hollow middle; 205 (−0.8) over-developed.
- **V4 (post-FC inlet slope sweep + first-batch reference-recipe control):** flattened the post-peak slope - lowered the 04:00 inlet point and raised the 06:00 floor (236/230/226 vs V1's 240/230/222) - holding peak, front-half shape, and BEAN_TEMP @ 207°C constant. 210 (control, −0.4) thin-bodied; 211 (v4a, +3.9, 64s dev) and 212 (v4b, +3.3, 35s dev) both integrated and full-bodied - both went to SPG and **212 became the reference**. 213 (v4c, flattest slope 234/230/228) overshot into spice-heavy over-development, bracketing the lever's usable far edge.

## Reference roast - Batch 212 (v4b)

- V1 winning peak + front-half shape held; flattened post-FC inlet slope; BEAN_TEMP end condition 207°C. FC 5:05, dev 35s. WB Agtron 75.3 / ground 72.0 / delta +3.3 (light).
- Why it won: the flattened slope extended mid-palate development time at a gentler slope and built the missing body WITHOUT darkening into over-development - the first batch on the lot to pair the plum/cherry attack with a full mid-palate.

## Optimized brew

- **brew_id:** 695e1e8b-0c16-4bc0-9b74-5f07725882aa (2026-06-25) · Temperature-Staged Hybrid on the April Hybrid (April Switch) flat-bottom valve brewer + April Paper, 15g / 225g (1:15), EG-1 6.0, two-kettle: Phase 1 96°C closed-valve immersion (50g bloom ≤25s → 150g → steep), Phase 2 ~88°C open ~1:08 to 225g, total ~3:00. Third Temperature-Staged confirmation project-wide; a water-chemistry move (2 drops Apax Lab Tonik + 2 drops Jamm) was the load-bearing final lever for mid-palate body.
- Full brewing detail is canonical in [brewing-historian by-strategy/hybrid.md](docs/skills/brewing-historian/cluster/patterns/by-strategy/hybrid.md) (THIRD Temperature-Staged confirmation entry, incl. the muddy-flat vs hollow-flat two-step diagnostic).

## Carry-forward (for the next hollow-middle-prone washed lot)

- **Primary lever:** post-FC inlet slope shape. Caution 1: the lever is not cleanly post-FC-only - lowering the 04:00 point also DELAYED FC (211 FC 4:33 / 212 5:05 / 213 4:57 vs control 4:12); to isolate slope cleanly, move a LATER inlet point (04:30/05:00) and hold 04:00 at control. Caution 2: robust across dev path - 211 (64s dev) and 212 (35s dev) hit the same cup, so the slope SHAPE does the work, not a precise dev-time target.
- **WB→Ground delta polarity is the diagnostic, not a design lever.** Sign is the robust signal (negative = surface-blast, unrescuable by brewing; near-zero-to-positive = integrated-or-buildable); positive magnitude needs dev-path context (+3 to +4 meant BUILT body on V4's extended-gentle batches, stall-hollowness on V2's 196). Record both WB and Ground Agtron at Day-7 cupping and track polarity routinely.
- **Don't trust clean roast metrics over the delta:** 198's cleanest-on-paper roast (earliest FC, 38s dev, clean auto-drop) was the lot's worst cup.
- **Session-position variance is large and bidirectional:** identical v1b recipe produced FC at 4:34 / 4:58 / 4:12 across three sessions (46s spread). The V4 first-batch reference-recipe control was load-bearing for trusting the comparison - make it standard for comparison V-sets on this machine.
- **Ceiling-collision failure mode:** at 250°C peak the bean reaches the 207°C target pre-FC. Total time outweighs peak inlet for body weight on this lot.

## Cross-lot framing

Both close-out findings live in the CCIL as single-lot working hypotheses with promotion criteria:

- [cross-coffee-insights.md § WB→Ground Agtron Delta Polarity as a Cup-Quality Diagnostic](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md#wbground-agtron-delta-polarity-as-a-cup-quality-diagnostic-single-lot-working-hypothesis-redplum-cas-2026-v1v2spg) - promote if polarity holds on another washed lot; elevate to protocol-level cupping requirement if it also holds on two non-washed lots.
- [cross-coffee-insights.md § Late-phase inlet slope as the body-balance lever for hollow-middle washed lots](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md#late-phase-inlet-slope-as-the-body-balance-lever-for-hollow-middle-washed-lots-redplum-cas-2026-resolved-2026-06-22) - promote if the flatter-slope design works from the outset on the next hollow-middle-prone washed lot (Castillo / El Paraiso / pulp-ferment Colombian).

## Related

- Active-lot doc (redirect stub): [active-lots/redplum-cas-2026.md](docs/skills/roasting-historian/cluster/active-lots/redplum-cas-2026.md)
- [by-process/washed.md](docs/skills/roasting-historian/cluster/patterns/by-process/washed.md) - the high-moisture pulp-fermentation washed variant in the family
- [learnings/cgle-srume-washed-2026.md](docs/skills/roasting-historian/cluster/learnings/cgle-srume-washed-2026.md) - #133 anchor this lot's V1 inherited
