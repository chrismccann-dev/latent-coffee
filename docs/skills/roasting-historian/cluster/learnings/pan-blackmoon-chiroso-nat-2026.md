# Black Moon Chiroso Natural #75 (Panama, Hunter Tedman) - closed-lot learnings

*Coffee Research · Latent · Roasting Historian cluster · learnings*

**Lot:** PAN-BLACKMOON-CHIROSO-NAT-2026
**Status:** Closed (2026-11-11) - single-V-set close, first Chiroso in the archive
**Cultivar:** Chiroso (Ethiopian Landrace Families; first of variety - filled the named sourcing gap)
**Terroir:** Panama / Alto Quiel, Boquete, Chiriquí / Black Moon Farm (Hunter Tedman, Tier-1 anchor, dark-drying pioneer)
**Process:** Natural, 2025 harvest (Forward Coffee lot P250271, Forward 92, $250/kg)
**Green:** density 802 g/L (high), moisture 11.1% (high). ~700g remaining at close (Roest inventory 12338 archived at 700g) - production roasts of the reference recipe to follow.
**Reference roast:** Batch 242 · 245°C-peak standard template curve · manual hold to 207.0°C / 5:07 · FC audible 4:23 / 202.8°C · 44s dev · WB Agtron 85.5 / WL 11.7% · Roest profile "BM Chiroso - v1a" (628175)
**Optimized brew:** not yet dialed at close - link `green_beans.optimized_brew_id` after the first real brew session on 242.

## Substrate pointers

- **roast_learnings row:** `4fdc948f-c631-4a7e-ad7e-4ee6183de5f5` (green_bean_id `5e5d8b81-5ab2-4c8c-a763-f7aca1bb7c48`).
- **Experiment:** V1 `PAN-BLACKMOON-CHIROSO-NAT-2026-V1`: `c2b3dede-6a59-4246-b548-c91fd36f3890` (coupled gentle-to-pushed sweep; winner V1B Batch 242).
- **Roasts:** 241 (`8afd81a4`, underdev floor marker) / 242 (`111ce7b2`, **reference**, is_reference=true) / 243 (`24dde1a6`, overdev ceiling marker).
- **Cuppings:** Day-6 gate 2026-11-11: `9a11513e` (241) / `a64eb404` (242) / `4265d2c9` (243). Ground Agtron deliberately skipped lot-wide (15g samples too small for CM-200); WB is the color signal of record.

## Why Batch 242 won as the lot reference

The gentle 245°C curve held to 207.0°C / 44s dev reproduced the producer's card nearly note-for-note at the Day 6 gate - black cherry depth + violet + maple hot, floral mid, peach/tangerine fully cooled, clean finish, genuinely layered-evolving. Siblings marked both walls: 241 (205.5°C) hollow-thin "bypass-water" underdev; 243 (211.1°C) burnt aroma edge + persistent bitter-dry tail. Margin was wide and the operator had no improvement hypothesis either direction, so the lot closed on V1 by deliberate operator call - **SPG waived** (wide margin lowers the inversion risk the family discipline guards against; four lots in flight). Notably, 242 was an accident: the v1a profile re-run in place of the designed 248°C v1b, recovered with a manual hold - the mistake found the window. The unexecuted 248°C design (Roest profile 628176) was never roasted.

## Roast architecture that produced it

Standard 7-timestamp template at 245°C peak (200/226/239/245/241/231/225), SR-Natural-leaning fan 80/69/65/71/74, RPM 65, charge 117 / hopper 125 / preheat 210, 100g batches. The repeat recipe encodes the winner as a bean_temp auto-drop at 207°C (no manual hold needed). Window estimate ~206-209°C on this curve, only 207 confirmed - Narrow.

## Cup-side diagnostic signals

- **Underdev (241):** dilution, not defect - bright acid and intact blackberry/cherry aroma over a thin, stretched, body-less cup; flat cooling arc. Correlates: WB >= ~93, drop <= 205.5°C, no audible crack.
- **Overdev (243):** slight burnt aroma edge, roast over fruit, persistent bitter-dry tail that survives full cooling (the cup otherwise improves cooling, which masks it). Correlates: drop >= 211°C / WL >= 12.3% at a deceptively light WB ~83.

## Cross-lot framing

- **FC-temp anchor counterexample (Low-Medium, marking-lag caveat):** FC temp moved WITH peak energy (202.8°C at 245 peak vs 207.4°C at 251, identical 4:23 mark) - first natural where peak pulled FC temp, against the 3-for-3 Wush Wush constraint.
- **High-moisture prior failed:** 11.1% / 802 g/L ran 35-55s FAST on every slot; do not add energy for moisture on this profile family.
- **Family resolution:** drop-ceiling-disciplined (SR Natural family), NOT development-behaved (AN10/Deborah), despite the dark-fruit profile.
- **Boquete light-color pattern (2nd lot):** colors very light for drop temps at high density (211.1°C -> WB 83.4), corroborating Deborah beyond the low-density explanation. Trust drop temp + cup over WB on Panama Chiriquí naturals.
- **Audibility was dev-window-gated:** no crack at the 205.5°C drop, audible at 207+ - echoes the Deborah pattern.

## Related

- [active-lots/pan-blackmoon-chiroso-nat-2026.md](docs/skills/roasting-historian/cluster/active-lots/pan-blackmoon-chiroso-nat-2026.md) (closed stub; carried the V1 design + actuals during the arc)
- [patterns/by-process/natural.md](docs/skills/roasting-historian/cluster/patterns/by-process/natural.md) + [patterns/cross-coffee-insights.md § FC-Temp Architectural Constraint](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md#fc-temp-architectural-constraint-on-naturals---working-hypothesis)
- Nearest siblings: [learnings/pan-deborah-geisha-nat-2026.md](docs/skills/roasting-historian/cluster/learnings/pan-deborah-geisha-nat-2026.md) (Boquete-area natural, light-color + audibility patterns) + [learnings/cgle-srume-natural-2026.md](docs/skills/roasting-historian/cluster/learnings/cgle-srume-natural-2026.md) (drop-ceiling-disciplined family)
