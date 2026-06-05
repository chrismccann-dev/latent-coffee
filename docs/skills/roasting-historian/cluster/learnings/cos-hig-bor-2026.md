# Costa Rica Anaerobic Dry Process Higuito — lot learnings

*Coffee Research · Latent · Roasting Historian cluster · learnings*

**Lot:** COS-HIG-BOR-2026
**Status:** Closed (2026-05-19)
**Cultivar:** Bourbon
**Terroir:** Costa Rica / Southern Highlands (Los Santos, San José — Higuito farm, Nelsyn Hernández, Fátima micromill)
**Process:** Anaerobic Dry Process (heavy ferment, 2-3 day sealed; natural-style fruit layer)
**Density / moisture:** 804 g/L / 10.20%
**Reference roast:** Batch #185 (v3b) — 254°C peak, drop 213.3°C, audible FC 207.6°C, dev 41s/14.6%, WB Agtron 77.3 / ground 74.5, delta 2.8
**Reference brew:** Kalita Wave 155 + xBloom Premium Paper, EG-1 6.5, 15g/240g, 91°C, Suppression + late cut (pull at ~180g server yield) — wave geometry adds body the Orea-Glass evaluation brews lacked

## Substrate (DB + page pointers)

Verdict-rich detail lives in substrate, not duplicated here:

- **roast_learnings row** (`green_bean_id` 79d0f814-8682-43ff-b6e0-6906aa8dd1a0): primary lever (peak inlet), roast window width (Narrow — 2°C peak shift = "opposite ends of the spectrum"), brewing tolerance (Moderate-to-high), full cultivar + terroir + general takeaways + starting hypothesis. Scope-tagged per Sprint 12 / ADR-0009.
- **Green bean detail page:** `/green/[id]` resolved-view renders the reference roast recipe + reference cup (xbloom_gate Day 7 on #185) + optimized brew.
- **Reference cup:** cuppings row on #185, `recipe_variant: xbloom_gate`, 2026-05-18 — smoked-honeyed-tobacco-mead, holds through cooling.
- **Optimized brew:** brews row on #185 — Suppression + Output Selection (late cut), `brew_id` 7cc4e795-2475-4d0b-9f93-8da0a82d728f.

## Cross-lot framing — what this lot taught the Historian

Higuito is the **first self-roasted lot to confirm the anaerobic-natural Suppression + temperature-primacy pattern** on the brewing side (4th confirmed origin alongside Colombia / Ethiopia / Panama; brewing-side detail in [brewing-historian by-coffee-family/anaerobic-natural.md](docs/skills/brewing-historian/cluster/patterns/by-coffee-family/anaerobic-natural.md)). Four patterns landed at close that propagated into [cross-coffee-insights.md](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md):

1. **xbloom evaluation-gate misranking on anaerobic naturals — now THREE instances on one lot.** V1 (v1b lactic false-positive) and V2 (v2c staying-power false-positive) were inverse-direction failures that real pourover reversed. V3 was the informative third instance: xbloom favored the structurally-aggressive v3b, and real pourover CONFIRMED rather than reversed it. The refined lesson: xbloom misranks between *close* candidates and cannot be trusted alone, but it is not simply biased toward one direction — real pourover is the required arbiter either way.
2. **Replication-by-profile is unreliable on this coffee — confirmed twice.** v1c→v2a and v2b→v3a were both verbatim-profile replications that diverged structurally (FC audibility flipped each time; v2b→v3a also swung WB-to-ground delta from -0.3 to +4.4 and produced a cup that flattened cooler). The reference roast must be defined as profile PLUS cup-acceptance-criteria, not profile alone.
3. **Peak inlet and dev-phase length interact non-additively.** v3c (53s dev at 253°C peak) went smoke-tobacco-discordant; v3b (41s dev at 254°C peak) integrated cleanly. Adding body via development requires the matching peak energy — dev time alone at a fixed peak over-emphasizes smoke-tobacco.
4. **Overdevelopment on this coffee is a peak-inlet/dev-time INTERACTION, not an Agtron threshold.** The reference roast (#185, WB 77.3) is DARKER than the overdev-flagged v3c (#186, WB 79.3) yet is not overdeveloped — because its higher peak inlet + shorter dev integrated the development.

The varietal/process aromatic signature (honey mead / Port-like dessert wine / boozy fruit / tobacco / rustic-cocoa bittering, with intrinsic smoke-mezcal that is process character not defect) and the cup-side underdev (aggressive-alcoholic-pungent-separated) / overdev (smoke-tobacco-discordant) signals live in the roast_learnings row and the [Varietal Aromatic Fingerprints](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md#varietal-aromatic-fingerprints) table.

## Related

- [by-process/natural.md](docs/skills/roasting-historian/cluster/patterns/by-process/natural.md) — anaerobic-natural subgroup; this lot is the first self-roasted close-out in the family
- [cross-coffee-insights.md § xbloom Evaluation Gate Misranking on Anaerobic Naturals](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md#xbloom-evaluation-gate-misranking-on-anaerobic-naturals---working-hypothesis) — pattern co-confirmed (now 3 instances) by this lot
- [brewing-historian by-coffee-family/anaerobic-natural.md](docs/skills/brewing-historian/cluster/patterns/by-coffee-family/anaerobic-natural.md) — brewing-side Suppression family this lot's optimized brew joined as the 4th origin
