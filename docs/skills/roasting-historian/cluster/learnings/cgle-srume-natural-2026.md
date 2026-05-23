# CGLE Sudan Rume Natural — Closed-Lot Learnings

**Lot:** CGLE-SRUME-NATURAL-2026
**Closed:** 2026-05-23
**Reference roast:** Batch 187 (V5A)
**green_bean_id:** 1cf02eb8-accb-4e74-8ce5-52892b4ecfd7

## Reference Roast

- Profile: 242°C peak, hard post-peak cliff (200→233→242→236→228→222→218°C)
- End condition: BEAN_TEMP 205°C, total time ceiling 6:15
- Agtron WB 78.7 / ground 68.1 (delta 10.6)
- FC: 5:11 / 202.5°C (ambiguous — bean temp is the primary signal)
- Dev: 49s / 13.6%

## Reference Brew

- April Brewer Glass + April Paper
- 15g / 240g (1:16) / EG-1 6.4 / 89°C
- 3-pulse: bloom 45g/45s → to 115g by 0:45 → to 180g by 1:15 → to 240g by 1:50
- Total time: 3:00–3:15
- Peak expression: 44–50°C
- Cup: tropical pineapple, blueberry, caramelized brown sugar, ginger spice — sweet, rounded, well-blended

## Primary Lever

Bean temp end condition at 204–205°C. FC is ambiguous/inaudible — do not manage by FC timestamp. 242°C peak minimum viable on this cliff profile. Drop above 208°C = overdevelopment.

## Key Lessons

1. Low-energy extended-duration roast profile (hard post-peak cliff) produces better integration than high-energy sustained profiles for this cultivar/process combination.
2. Sichuan peppercorn drying finish = overdevelopment diagnostic; suppressed by lower energy input.
3. xbloom gate underrepresents this lot's expression — real pourover required for candidate ranking. Path C-2 fired at V5 cup; real-pourover discriminator between 187 (V5A) and 169 (V4C, prior reference) confirmed 187 as the preferred expression.
4. Ground Agtron (not WB) is the correct extraction prior: WB 78.7 misleads toward more extraction; ground 68.1 correctly flags over-extraction risk. **New rule extracted from this lot.**
5. Temperature is the primary brew lever on traditional (non-anaerobic) natural Sudan Rume: 91°C over-extracted aromatic fraction; 89°C resolved with single variable move. **Extends temperature-primacy pattern beyond anaerobic naturals to traditional-natural aromatic landraces.**
6. What didn't move the needle: post-peak cliff steepness (within viable range), early ramp steepness, peak inlet height above 242°C.

## Cross-References

- Washed expression from same farm: `CGLE-SRUME-WASHED-2026` (reference Batch #133, resolved at 6.5 / 91°C / April Glass). Same green-bean variety, different process — washed resolved finer + warmer than natural's 6.4 / 89°C.
- Special Guests Edition 0326-42: same green purchased independently, resolved at EG-1 6.5 / 91°C on darker-by-WB roast (71.7 vs Chris's 78.7). The lighter self-roast wanted one notch finer + 2°C cooler — driven by the ground-Agtron-not-WB reframe (Chris's WB 78.7 + ground 68.1 = medium-light; over-extraction risk live, not under).
- V-set arc: V1 (128/130/131) → V2 (142/143/144) → V3 (152/153/154/155) → V4 (167/168/169) → V5 (187/188/189). V4C (169) was the prior reference candidate; V5A (187) superseded via real-pourover discriminator at close-out (Path C-2 → Path A).

## Related

- [by-process/natural.md](../patterns/by-process/natural.md) — natural-process roll-up
- [cross-coffee-insights.md § Varietal Aromatic Fingerprints](../patterns/cross-coffee-insights.md) — Sudan Rume row gets updated with the natural-process expression (close-out proposal `ae16998a` pending arbitration)
- [brewing-historian by-cultivar/sudan-rume.md](../../../brewing-historian/cluster/patterns/by-cultivar/sudan-rume.md) — brewing-side Sudan Rume notes (Special Guests roast + Las Margaritas anchor); this lot's brew confirms April Glass vehicle rule + 91°C aromatic ceiling extends across roast levels
