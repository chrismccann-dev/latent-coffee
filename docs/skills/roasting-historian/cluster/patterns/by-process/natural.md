# Natural — per-process roasting patterns

*Coffee Research · Latent · Roasting Historian cluster · by-process*

Migrated from ROASTING.md § Naturals - Roasting Framework in Wave 4 PR 4b (2026-05-21). Wave 3 PR 1 Chris-locked this section to ROASTING.md pending Wave 4 cleanup; this is the resolution destination.

**Corpus (active + closed lots):** N≥3 — CGLE Sudan Rume Natural (closed 2026-05-23), Bukure Natural Lot 21 Red Bourbon (closed 2026-06-06), Fazenda Um Wush Wush Natural Dark Room Dried (active), prior CGLE Sudan Rume Natural closed lots referenced through cross-coffee-insights.

## Starting framework

Use the washed profile as the starting point. Lower inlet temp for the early stages (gentler start). Taper heat away earlier. At 100g batch size, exothermic runaway is not a meaningful risk. Primary failure mode for naturals is **overdevelopment** (collapses fruit/ferment complexity), not underdevelopment.

**Key learning from Sudan Rume Natural V1:** This specific natural (791 g/L density, 10.3% moisture) required more early energy than a typical natural because the dried fruit layer provided significant thermal insulation not captured by the green specs. 242°C peak inlet was insufficient. 247°C brought FC timing into range. **Do not assume "natural = less heat" applies universally** — always start from the washed profile and let FC timing tell you whether to add or reduce energy.

> **Drop temp discipline is the most critical natural-specific constraint.** For naturals, drop on temp with a strict ceiling — do not wait for dev time. Overdevelopment suppresses fruit/ferment character and produces dark tea, flat cups with no attack.

## Architectural constraint (cross-natural)

The **FC-Temp Architectural Constraint on Naturals** — a structural pattern surfaced from Sudan Rume Natural V2 + Fazenda Um Wush Wush V1 — lives in [cross-coffee-insights.md § FC-Temp Architectural Constraint on Naturals](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md#fc-temp-architectural-constraint-on-naturals---working-hypothesis). Summary: on naturals across multiple cultivars / terroirs, higher peak inlet pulls FC TIME earlier but does NOT pull FC TEMP lower. FC arrives in a narrow 204-206°C window regardless of peak energy. Implication: peak inlet is not the right primary lever for FC-temp targeting on naturals — early-ramp shape is.

## xbloom evaluation gate misranking

The **xbloom Brian Quan evaluation gate produces inverse-direction misranking** on close anaerobic-natural candidates with extracted-but-discordant character — confirmed twice on Costa Rica Anaerobic Dry Process Higuito (v1b lactic note + v2c staying-power). See [cross-coffee-insights.md § xbloom Evaluation Gate Misranking on Anaerobic Naturals](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md#xbloom-evaluation-gate-misranking-on-anaerobic-naturals---working-hypothesis). On naturals with heavy fermentation, run Balanced Intensity real pourover on the top 2 candidates before declaring outcome.

## Per-lot deep dives

- [CGLE Sudan Rume Natural (closed 2026-05-23)](docs/skills/roasting-historian/cluster/learnings/cgle-srume-natural-2026.md) — reference roast Batch 187 (V5A); closed-lot learnings deep dive
- [Bukure Natural Lot 21 Red Bourbon (closed 2026-06-06)](docs/skills/roasting-historian/cluster/learnings/rwa-nova-nat21-rb-2026.md) — reference roast Batch 194 (v2b); first East African Red Bourbon natural in archive; closed-lot learnings deep dive
- [Fazenda Um Wush Wush Natural Dark Room Dried (active V1 → V2 blocked)](docs/skills/roasting-historian/cluster/active-lots/bra-fazendaum-wushwush-nat-2026.md) — V1 cupped 2026-05-15 with cup-vs-structure inversion; V2 design blocked on Untold paired roasted reference cup

## Cross-references

- [cross-coffee-insights.md § FC Floor & Ceiling by Processing Method](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md#fc-floor--ceiling-by-processing-method) — Natural high-density Colombian: FC floor ~202°C, drop ceiling ~205-206°C
- [cross-coffee-insights.md § WB-to-Ground Agtron Delta Norms](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md#wb-to-ground-agtron-delta-norms-by-processing-method) — Natural high-density Colombian: target ≤2 points; V1 typical 2-4
- [cross-coffee-insights.md § Green Spec → Starting Hypothesis](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md#green-spec--starting-hypothesis) — Density ≥800 g/L + Natural row; Density ≥800 + Natural + dried-fruit-layer row
- [cross-coffee-insights.md § Rest Behavior Patterns](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md#rest-behavior-patterns) — Natural, high-density Colombian: Day 7 pourover correct gate
- [washed.md](docs/skills/roasting-historian/cluster/patterns/by-process/washed.md) — sibling per-process roll-up; naturals anchor on washed profile + adjust
- [by-process/honey.md](docs/skills/roasting-historian/cluster/patterns/by-process/honey.md) — sibling per-process; the roast-direction fork shares some architecture with natural
