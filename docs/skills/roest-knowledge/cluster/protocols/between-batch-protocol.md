# Between Batch Protocol (BBP) + Hopper Pre-Load Timing

*Coffee Research · Latent · Roest Knowledge cluster · protocols*

Migrated from ROASTING.md § Standard Workflow > Between Batch Protocol + Hopper Pre-Load Timing in Wave 4 PR 4b (2026-05-21).

> **Operator-fixed constants** (Item 25 / Group 5 grill, 2026-05-24, audio-ratified): the four constants below (10-minute warm-up dry run / BBP parameters / 125°C hopper-load alert / 117°C charge temp) are **operator-discipline constants — never varied across V-sets, beans, or roast types**. Substrate must DESIGN AROUND these, not propose varying them. Chris's muscle memory governs — he does NOT look at recipe fields for drop temp because he always charges at 117°C. If thermal-energy or input-energy change is the goal, vary recipe-level levers (peak inlet temp / temperature curve / fan / drum speed) — NOT the operator-fixed routine. See [CONTEXT.md § Operator-fixed roast constants](../../../../../CONTEXT.md) for the full glossary entry + the recipe-schema-vs-lived-practice asymmetry note.

## Standard Workflow

This workflow is fixed and should be followed identically for every roast session, regardless of coffee.

- Turn on Roest
- Pick the profile
- Let it heat up for 10 minutes
- Run a dry roast (no beans) until drum temp reaches 140°C — **this is the thermal reset that standardizes starting conditions for every batch**. Do not skip or shorten it.
- Run BBP (see BBP parameters below)
- Load green beans into hopper when drum reaches **~125°C** — hopper pre-load step
- Charge (drop beans) when drum reads **117°C** — drum coasts naturally from 120°C BBP endpoint to 117°C over ~60-90 seconds while beans are in hopper
- Preheat air temp: set to 210°C — effectively irrelevant given the dry roast thermal reset. Do not adjust as a roasting lever.

## Between Batch Protocol (BBP) parameters

**Current BBP:**

- Fan: 100% at 0:00 → 60% at 0:30 → 40% at 1:00 → 25% at 1:45
- Air temp: 100°C (flat, no changes)
- End condition: drum temp 120°C
- Typical runtime: approximately 2:00-2:30 from 140°C endpoint to 120°C trigger

**Why this shape:** Fan at 100% early removes heat quickly from the 140°C dry roast endpoint. Tapering to 25% by 1:30 allows the drum to coast down gently rather than being blast-cooled through the charge point. Do not adjust air temp during BBP — the fan taper is the correct lever.

## Hopper Pre-Load Timing

> **Load beans at ~125°C.** This was a key discovery from V5 experiments on Sudan Rume Washed. Confirmed empirically: pre-load at 125°C vs. 120°C shifted FC timing by ~35 seconds and FC temp by ~7°C on the same profile.

Loading beans into the hopper at 125°C gives the beans approximately 60-90 seconds of pre-warming in ambient drum heat before charge. This raises the effective thermal mass at the charge event and produces earlier and cooler FC.

This is likely part of the reason a trusted peer (same machine, same mode) consistently achieves TP of 94°C vs. this machine's 78-81°C. See [peer-learning-roasting-archivist § Dongzhe](../../../peer-learning-roasting-archivist/cluster/per-peer/dongzhe.md) for the peer's parameter set.

**Important caveat:** Loading too early produces underdevelopment. Batch #134 (hopper loaded at ~125°C on a non-standard session) produced FC at 197.6°C — below the FC floor for Sudan Rume Washed — resulting in a nutty, grassy, flat cup regardless of dev time. The 125°C hopper load with 117°C charge produces FC at approximately 201-205°C on the CF-Light profile. Do not push the hopper pre-load earlier.

## Cross-references

- [machine/l200-ultra.md](../machine/l200-ultra.md) — hardware reference for the Roest L200 Ultra
- [protocols/fan-strategy.md](./fan-strategy.md) — fan curve shape during the active roast
- [protocols/evaluation.md](./evaluation.md) — Day 7 pourover evaluation cadence and protocol
- [protocols/fc-marking.md](./fc-marking.md) — FC marking discipline
- [roasting-historian § cross-coffee-insights — Session Position Effect](../../../roasting-historian/cluster/patterns/cross-coffee-insights.md) — confirmed thermal-mass effect across the corpus
