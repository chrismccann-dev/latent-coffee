# Roasting Archive - Closed Lots

Per-lot reference roast + best brew + generalized lessons for every closed lot. Split out of ROASTING.md on 2026-05-03 (Sprint 2.7) so the master roasting reference stays focused on in-flight protocol, current state, and cross-coffee insight - not per-lot history.

The cross-coffee patterns that have generalized across multiple lots stay in [ROASTING.md § Cross-Coffee Insight Layer](../../ROASTING.md#cross-coffee-insight-layer). Per-lot prose lives here.

When a new lot closes, add a section below following the template of the existing entries (lot ID + variety + process header, reference roast + best brew + roast parameters + generalized lessons subsection if the lot generated >2 generalizable patterns).

---

## CGLE-MANDELA-XO-2026 - Mandela Variety, XO Extended Fermentation

**Status:** CLOSED.

- **Reference roast:** Batch #139 (confirmed)
- **Best brew:** April Brewer Glass + April Brewer Paper, EG-1 6.4, 15g/255g, 93°C, bloom 50g/40s, pour to 160g then 255g, target 2:45-3:15
- **Roast parameters:** v3b inlet (195°C → 232°C → 240°C → 241°C → 236°C → 228°C), fan (80% → 68% → 63% → 70% → 73%), charge 117°C, hopper load 125°C, end condition bean temp ~203-204°C, Maillard 44.5%, Agtron WB 76 / ground 72.4
- **Key process learning:** FC is inaudible on XO-fermented coffees - use bean temp end condition, not dev time. Fan curve shape is the primary roast lever for fermentation character distribution.

### Generalized lessons (likely apply to XO-fermented, heavily anaerobic, and co-fermented coffees where fermentation intensity is very high)

These learnings emerged from 4 experiment sets across 13 batches.

**1. For heavily fermented coffees, the roast job is distribution of fermentation character, not amplification.** The XO fermentation places high-concentration aromatic compounds at very high intensity in the green bean. Short Maillard / high momentum into FC concentrates those compounds in the attack and produces an aggressive, pungent, front-loaded cup. Extended Maillard / lower momentum distributes the fermentation character through the body and finish. Fan curve shape was the most powerful lever for controlling this.

**2. Shaped fan curve is mandatory for XO-fermented coffees under the new charge protocol.** Flat 90% fan combined with the 125°C hopper pre-load produced darker development (Agtron 67-71 vs. target 74-76) and more aggressive cups, moving away from the target rather than toward it. This was the single most impactful variable change in the entire experiment series.

**3. FC is acoustically absent on XO-fermented coffees - never use dev time as the end condition.** Across all four experiment sets (13 batches), FC was inaudible or ambiguous on the majority of roasts. Dev time end condition fired at machine-estimated FC timestamps that were not reliable, producing Maillard overrun (51-58% vs. target 44%) in the final experiment set. Bean temp end condition at the confirmed drop target is the only reliable drop signal on these coffees.

**4. Brew strategy for XO-fermented coffees is Balanced Intensity, not Full Expression.** The fermentation already provides all the intensity the cup needs. Full Expression brewing (UFO fast cone, fine grind, high temp) amplifies the attack and produces a sharp, aggressive cup. Balanced Intensity (April Brewer, coarser grind, moderate temp) rounds the fermentation character into the body without muting it.

**5. Lemongrass is a CGLE terroir/varietal descriptor, not a defect signal.** It appeared consistently across Mandela XO from V3 onward and is shared with Sudan Rume Natural from the same farm. When integrated correctly, it reads as a complex herbal-floral note alongside pineapple and caramel. When the roast is underdeveloped or over-extracted, it reads as pungent and dominating. The correct goal is integration, not elimination.

---

## CGLE-SRUME-WASHED-2026 - Sudan Rume Hybrid Washed

**Status:** CLOSED.

- **Reference roast:** Batch #133 (confirmed), Batch #148 (closest replication)
- **Best brew:** UFO Ceramic + Sibarist Fast Cone, EG-1 6.0, 15g/210g, 91°C, Melodrip, bloom 45g/45s, pour to 130g then 210g, target 2:45-3:15
- **Roast parameters:** CF-Light inlet (200 → 237 → 245 → 245 → 240 → 230 → 222°C), fan (80 → 70 → 65 → 72 → 75%), charge 117°C, hopper load ~120°C (old standard - see [Hopper Pre-Load replication caveat](../../ROASTING.md#hopper-pre-load-timing)), drop at 206-207°C, dev time 0:45 end condition

### Generalized lessons (likely apply to high-density washed Colombians with unusual aromatic profiles)

These learnings emerged from 6 experiment sets across 20+ batches.

**1. FC floor and ceiling are real and coffee-specific.** The usable roast window was approximately 4°C wide at FC temp and 2°C wide at drop temp. Assume other coffees have similar windows - find them empirically.

**2. The Day 7 pourover evaluation gate is mandatory for delicate aromatic coffees.** Day 4 cupping was actively misleading across multiple sessions.

**3. Aromatics may be present in the roast but hidden at standard brew parameters.** When a roast passes the evaluation gate but feels muted, try a pushed brew before concluding the roast needs more development.

**4. WB-to-ground Agtron delta is a better development predictor than DTR alone.** Evenness of development, not total development time, was the decisive factor.

**5. Session position affects roast outcomes even with identical protocol.** First roast in a session runs ~10-15 seconds slower through Maillard than subsequent roasts.

**6. The lemongrass/herbal descriptor is varietal, not a defect signal.** Sudan Rume's characteristic aromatic compounds read as funky when underdeveloped and as lemongrass/bergamot/jasmine when developed correctly. Naming the descriptor correctly transformed the evaluation.

**7. Stone fruit tartness (malic acid) is a varietal characteristic, not an extraction artifact.** At the correct roast and brew, Sudan Rume Washed expresses a simultaneous sweet-and-tart quality consistent with candied dried apricot - this is malic acid, the primary acid in stone fruits. It sits underneath the sweetness rather than dominating, softens and integrates as the cup cools fully, and reads as complexity rather than sharpness. Do not attempt to brew it away - it is part of the correct expression. If it reads sharp or disconnected rather than integrated, the likely cause is brew temperature too high or extraction too aggressive, not a roast problem.

---

## GUA-SOC-JAVA-2024

**Status:** CLOSED. Pre-counterflow legacy lot.

- **Reference roast:** Batch 88
- **Best brew:** UFO Ceramic + Sibarist UFO Fast Cone, EG-1 6.5, 15g/255g, 94°C, Melodrip

---

## GUA-LIB-ADC-2024

**Status:** CLOSED. Pre-counterflow legacy lot.

- **Reference roast:** Batch 94
- **Best brew:** Brew recipe developed (parameters not preserved in master archive).

---

## GV-OMA-25-035 - Gesha Village Oma

**Status:** CLOSED. Counterflow chapter unresolved - green exhausted before reaching a confirmed counterflow reference roast.

- **Reference roast:** Batch 52 (pre-counterflow)
- **Counterflow signal:** Treat 40s as confirmed floor for future washed Gesha in counterflow - start at 48s minimum. See [ROASTING.md § Washed Gesha - Counterflow Signal (Incomplete)](../../ROASTING.md#washed-gesha---counterflow-signal-incomplete) for the full open-question entry.
