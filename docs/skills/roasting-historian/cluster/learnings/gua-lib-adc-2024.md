# Guatemala Libertad Aurelio del Cerro — lot learnings

*Coffee Research · Latent · Roasting Historian cluster · learnings*

**Lot:** GUA-LIB-ADC-2024
**Status:** Closed (pre-counterflow legacy)
**Cultivar:** Bourbon / Caturra blend
**Terroir:** Guatemala / Western Dry Highlands
**Process:** Washed
**Density / moisture:** 776 g/L / 10.20%
**Reference roast:** Batch 94
**Reference brew:** Recipe parameters not preserved

## Substrate (DB + master-doc pointers)

- **roast_learnings row:** primary lever (Maillard energy continuity — smooth, continuously declining RoR into FC without sag was the root cause of recurring oversteeped-tea dryness; fixing the inlet curve shape eliminated the defect entirely), narrow window (20-35s dev / FC ~206-208°C), cultivar + general takeaways present, no `why_this_roast_won` verdict. Read via MCP: `read_canonical("roast_learnings", "GUA-LIB-ADC-2024")`.
- **Green bean detail page:** `/green/[id]` resolved-view.
- **Archive prose:** [docs/roasting/archive.md § GUA-LIB-ADC-2024](docs/roasting/archive.md#gua-lib-adc-2024).
- **Legacy lots summary:** [ROASTING.md § Reference Roasts + Brews (Closed Lots) — Legacy and incomplete lots](docs/roasting/archive.md).

## Cross-lot framing — what this lot taught the Historian

The **Maillard energy continuity** finding is the canonical pre-counterflow lesson about inlet curve shape: recurring oversteeped-tea dryness across multiple early experiment sets was diagnosed and resolved as an inlet-shape defect (mid-roast energy sag), not a dev-time or airflow issue. Everything downstream became tractable only after the underlying RoR sag was eliminated.

This lesson generalized: a smooth, monotonically declining RoR into FC is now a foundational design criterion for any new V1 inlet curve. The counterflow Standard Inlet Curve Template in [Roest Knowledge cluster § Standard Inlet Curve Template](docs/skills/roest-knowledge/cluster/protocols/fan-strategy.md#standard-inlet-curve-template) (migrated from ROASTING.md in Wave 3 PR 1) encodes this principle structurally — every shape variation tested has held this property.

## Related

- [gua-soc-java-2024.md](docs/skills/roasting-historian/cluster/learnings/gua-soc-java-2024.md) — sibling Guatemala pre-counterflow lot
- [by-process/washed.md](docs/skills/roasting-historian/cluster/patterns/by-process/washed.md) — per-process roll-up
