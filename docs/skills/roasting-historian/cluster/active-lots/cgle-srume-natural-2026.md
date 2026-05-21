# CGLE Sudan Rume Natural V5 — active lot

*Coffee Research · Latent · Roasting Historian cluster · active-lots*

**Lot:** CGLE-SRUME-NATURAL-2026
**Status:** **V5 ROASTS COMPLETE — Day 7 pourover pending (2026-05-19). Close-out pending V5A confirmation.**
**Cultivar:** Sudan Rume
**Terroir:** Colombia / Western Andean Cordillera (CGLE farm)
**Process:** Natural
**Density / moisture:** 805 g/L / 10.3% (V1 anchor measurement)
**Reference roast candidate:** Batch 169 (V4C) — confirmed at real pourover (2026-05-11); `is_reference=true` patched 2026-05-14

Migrated from ROASTING.md § Active Lots in Wave 4 PR 4b (2026-05-21).

## Reference roast + confirmed brew (V4C, Batch 169)

- **Profile:** 242°C peak, hard post-peak cliff (200→233→242→236→228→222→218°C), bean temp end condition 205°C, total time ~6:00, Agtron WB 76.1 / ground 73.0, WB-to-ground delta 3.1.
- **Confirmed brew recipe (locked):** April Brewer Glass + April Paper, 15g/255g, EG-1 6.3, 92°C, bloom 45g/55s, pour to 155g at 0:55 centered, pour to 255g at 1:45 centered.
- **Cup descriptors:** Pineapple, sweetness, lemongrass, ginger, light brown tea — complex, integrated, complete.

## V5 session (2026-05-12)

- **187 (V5A — exact 169 replica):** end condition 205°C, dropped 204.2°C / 6:00, FC 5:11 / 202.5°C, dev 49s, Agtron 78.7. **Primary repeatability test.**
- **188 (V5B — 207°C end condition):** dropped 204.7°C / 6:30 total-time ceiling, 207°C never reached, Agtron 70.5 — overdeveloped, 207°C end condition definitively not viable.
- **189 (V5C — 240°C peak):** dropped 202.7°C / 6:00 total-time ceiling, 205°C never reached, Agtron 77.8 — 240°C peak definitively confirmed insufficient on this cliff shape, third consecutive session showing same pattern.

## Key protocol confirmations from V5

1. 242°C peak is the minimum viable peak on this cliff profile — 240°C cannot reach 205°C within 6:00.
2. 207°C end condition is not viable — bean cannot reach it within practical total time.
3. Optimal total-time ceiling is 6:15 (not 6:00) to give bean_temp trigger room to fire before the safety net catches it.
4. 240°C peak hypothesis closed — would require a shallower post-peak taper to be viable, not tested.

## Pending

Day 7 pourover on 187/188/189 (~2026-05-19). If V5A replicates 169's cup → close-out via `close-lot.md`. If V5A diverges → investigate whether 49s dev (vs 169's unlogged) indicates overdevelopment.

## Cross-references

- [by-process/natural.md](../patterns/by-process/natural.md) — per-process roll-up; this lot is the highest-N natural in the corpus
- [cross-coffee-insights.md § FC-Temp Architectural Constraint on Naturals](../patterns/cross-coffee-insights.md#fc-temp-architectural-constraint-on-naturals) — pattern surfaced here
- [ccil seed — Sudan Rume across roasting and brewing](../../../ccil/cluster/coffee/sudan-rume/across-roasting-and-brewing.md) — first cross-domain seed pattern; this lot is one of the N=3 substrate sources
- [learnings/cgle-sudan-rume-hybrid-washed.md](../learnings/cgle-sudan-rume-hybrid-washed.md) — sibling CGLE Sudan Rume Hybrid Washed (closed); cross-link for variety/farm pattern aggregation
