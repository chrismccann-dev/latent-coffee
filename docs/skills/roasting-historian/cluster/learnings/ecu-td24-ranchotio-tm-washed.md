# Rancho Tio Emilio Typica Mejorado Washed — lot learnings

*Coffee Research · Latent · Roasting Historian cluster · learnings*

**Lot:** ECU-TD24-RANCHOTIO-TM-WASHED
**Status:** Closed 2026-05-11 (one-shot calibration, Taza Dorada 2024 #6)
**Cultivar:** Mejorado (Typica Mejorado)
**Terroir:** Ecuador / Northern Andean Highlands
**Process:** Washed
**Density / moisture:** unmeasured / 10.10%
**Reference roast:** Batch #179 (only batch — one-shot calibration)
**Reference brew:** UFO Ceramic + Sibarist UFO FAST Cone, EG-1 6.5, 15g/240g (1:16), 92°C, Melodrip — Clarity-First (NOT the V1 design's planned Extraction Push recipe)

## Substrate (DB + master-doc pointers)

- **roast_learnings row:** primary_lever NULL (one-shot calibration; structurally underdeveloped Batch #179 didn't earn a primary lever attribution), cultivar takeaway + general takeaway + starting hypothesis populated. Read via MCP: `read_canonical("roast_learnings", "ECU-TD24-RANCHOTIO-TM-WASHED")`.
- **Green bean detail page:** `/green/[id]` resolved-view.
- **Reference roast + brew summary:** [ROASTING.md § Reference Roasts + Brews (Closed Lots) — ECU-TD24-RANCHOTIO-TM-WASHED](docs/roasting/archive.md).

## Cross-lot framing — what this lot taught the Historian

The first Ecuadorian + first Typica Mejorado + first 1,300m washed data point in the archive. Three lessons propagated to [cross-coffee-insights.md](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md):

1. **Roast anchor profile transferability does NOT imply brew anchor transferability.** V1 design inherited the #133 Sudan Rume Washed brew lineage (1:14 / EG-1 6.0 / 91°C / Extraction Push); the lineage was wrong for THIS variety. The first brew at the planned recipe produced a discordant cup; the Clarity-First pivot (1:16 / 6.5 / 92°C) recovered cup integrity. **Re-evaluate brew strategy at variety level, not at anchor-roast level.** Brew-Reveals-Roast Principle extension.

2. **Altitude is a WEAK proxy for density on one-shot calibrations.** Batch 179 (1,300m, density unmeasured) was anchored on #133 with a -2°C peak inlet hedge on the assumption low altitude → low density. Outcome: underdevelopment (FC 40-60s late, drop 3°C below target, weight loss 11.89%). The lot wanted MORE energy, not less. Now the canonical "one-shot calibrations: full anchor energy, no altitude-based downward hedge, 125°C hopper pre-load" default. See [cross-coffee-insights.md § Working Hypotheses (Single-Lot, Low Confidence) — Altitude as weak proxy for density on one-shot calibrations](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md#altitude-as-weak-proxy-for-density-on-one-shot-calibrations-ecu-td24-ranchotio-tm-washed-observed-2026-05).

3. **Underdeveloped roasts may have a warm-shifted peak evaluation window.** Batch #179 peaked at 51-53°C on the Day 7 pourover under Clarity-First (vs the typical Clarity-First 45-50°C peak window) and degraded past peak rather than continuing to integrate. Hypothesis: underdeveloped roasts lack the late-Maillard caramelization compounds that carry the cup through deep cooling. Operational implication: when a roast is structurally light, evaluate at 50-55°C, not 45°C. Low confidence pending 1-2 more underdeveloped-roast data points.

4. **Typica Mejorado / Mejorado varietal aromatic fingerprint** added to [cross-coffee-insights.md § Varietal Aromatic Fingerprints](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md#varietal-aromatic-fingerprints): mandarin / faint pineapple / Earl Grey body / vanilla / nougat — wants Clarity-First. Producer descriptors (honey / passion fruit / white grape) require fuller roast development to express; this lot's underdeveloped state set a structural ceiling on which compounds were available.

## Related

- [by-process/washed.md](docs/skills/roasting-historian/cluster/patterns/by-process/washed.md) — per-process roll-up; this lot is the brew-anchor-transferability exemplar
- [cross-coffee-insights.md § Varietal Aromatic Fingerprints](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md#varietal-aromatic-fingerprints) — Typica Mejorado row sourced here
- [cgle-srume-washed-2026.md](docs/skills/roasting-historian/cluster/learnings/cgle-srume-washed-2026.md) — the anchor profile this lot inherited (correctly at roast level, incorrectly at brew level)
