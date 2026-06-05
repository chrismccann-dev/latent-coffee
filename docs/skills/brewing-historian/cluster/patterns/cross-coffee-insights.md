# Cross-Coffee Insight Layer

*Coffee Research · Latent · Brewing Historian cluster*

## Purpose

This file is the **cross-anchor insight layer** for brewing. It is read after a coffee is finished and during future Coffee Briefs when the agent needs to ask: *did this coffee teach a pattern that travels across coffees?*

It is **not** a recipe log. The app owns individual brew records.

It is also **not** the canonical home for single-axis knowledge. If a learning belongs cleanly to one process family, cultivar, strategy, roast level, roaster, or equipment surface, put it there and leave only a pointer here when it affects cross-coffee routing.

Use this file for patterns that cross at least two anchors, such as:

- roast level overriding process or cultivar defaults
- process + cultivar combinations that change strategy selection
- roaster house style overriding process defaults
- equipment or water changing the behavior of a strategy
- cooling behavior that changes evaluation timing across multiple coffees
- modifier compatibility across strategies
- open questions that need future brew evidence before promotion

Sibling: [roasting-side Cross-Coffee Insight Layer](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md#cross-coffee-insight-layer). See [docs/reference/synthesis-pipeline.md § Cross-coffee insight layer](docs/reference/synthesis-pipeline.md) for the canonical noun and how this surface complements per-anchor knowledge capsules.

## Promotion Rule

The same evidence-threshold lifecycle governs every axis (cultivar, process family, strategy, roast level) and the open-question queue. An item lives in this file until it has enough evidence to graduate into its own single-axis capsule; once it graduates, the capsule stands alone and this file keeps only a router pointer (or drops it entirely if it is no longer cross-anchor).

- **n=1:** keep as a candidate, lot-specific note, or open question. One coffee is a data point, not a pattern.
- **n=2:** promote to a working cross-coffee pattern if the pattern crosses anchors.
- **n=3+:** move durable single-axis detail into the proper sibling capsule (`by-cultivar/`, `by-coffee-family/`, `by-strategy/`, future `by-roast-level/`) and keep only a router pointer here. (N≥3 is the threshold the by-cultivar / by-coffee-family capsules were seeded at.)

Resolved questions are **deleted** from `Open Questions`, not struck through. The resolution belongs in the relevant capsule plus commit history. Do not keep the past trail of how a settled insight got there - only the go-forward of what is known.

## Ownership Boundary

| Learning type | Canonical home | What stays here |
|---|---|---|
| Individual coffee recipe or best brew | Brew app / archive | Nothing unless it changes future routing |
| Process-family behavior | `by-coffee-family/<process>.md` | Cross-axis exceptions only |
| Cultivar behavior | `by-cultivar/<cultivar>.md` | Cultivar + process / roast / equipment interactions, and sub-threshold (n<3) cultivars not yet graduated |
| Extraction strategy evidence | `by-strategy/<strategy>.md` | Strategy-selection routers and compatibility across anchors |
| Roast-level behavior | **Proposed:** `by-roast-level/<level>.md` (graduate when the override pattern reaches n≥3 with a non-Untold confirmation) | Roast-level overrides that trump process/cultivar |
| Equipment, office setup, water, filters | Brewing Equipment Expert cluster / filter research / water reference | Only if equipment or water changes cross-coffee strategy routing |
| Roaster house style | `docs/brewing/roasters.md` | Roaster-style overrides that change strategy choice |
| Modifiers (Axis 2) | This file (no single-axis capsule; modifiers are inherently cross-strategy) | Full modifier layer |
| Open experiments | `Open Questions` below | Only unresolved cross-anchor experiments |

## Coffee Brief Read Order

When designing a recipe for a new coffee, use this order:

1. **Roast level override.** If the coffee is medium / developed / visibly oily, check roast-level logic before process or cultivar logic.
2. **Roaster house style.** If the roaster has a known extraction style, let it override weak process defaults.
3. **Process family.** Check the process-family capsule for the base risk and default strategy.
4. **Cultivar.** Check the cultivar capsule for density, transparency, and body expectations.
5. **Strategy file.** Check the chosen `by-strategy/` file for parameter logic and failure modes.
6. **Cross-axis exceptions here.** Use this file to catch interactions the single-axis files miss (the Cross-Axis Strategy Router below).
7. **Equipment / water.** Check equipment and water references when the planned brewer, filter, office setup, or water strength changes extraction behavior.

Do not copy past recipes from this file. Use it to flag whether the default plan is likely wrong.

## Index Pointers

### By Strategy

- [Clarity-First](docs/skills/brewing-historian/cluster/patterns/by-strategy/clarity-first.md) — washed Gesha, Ethiopian washed landraces, Sydra / Typica Mejorado, Laurina, Esmeralda NC naturals, Rwandan washed Bourbon.
- [Suppression](docs/skills/brewing-historian/cluster/patterns/by-strategy/suppression.md) — anaerobic naturals and cold-room dehydration naturals where bitter finish is temperature-driven.
- [Balanced Intensity](docs/skills/brewing-historian/cluster/patterns/by-strategy/balanced-intensity.md) — honey lots, dense varieties, yeast-inoculated lots, Pacamara, El Paraíso thermal shock, traditional naturals.
- [Full Expression](docs/skills/brewing-historian/cluster/patterns/by-strategy/full-expression.md) — heavy anaerobic washed, co-ferments, dense washed varieties, Full-Expression roaster lots.
- [Extraction Push](docs/skills/brewing-historian/cluster/patterns/by-strategy/extraction-push.md) — fine + high-temp + turbulence-controlled recipes for clean coffees that need higher yield without compression (Pepe Jijón Sidra Wave Hybrid first-confirmed).
- [Hybrid](docs/skills/brewing-historian/cluster/patterns/by-strategy/hybrid.md) — Switch / phase-mapped / valve-modulated brews where one mode cannot solve both intensity and clarity.

**Strategy unclear (needs more data):** Dark Room Dry Natural Gesha (Panama Elida, Garrido Mokkita) responded to Balanced Intensity but may want more - flag for re-evaluation. Brazil washed Geisha (Daterra Borem) - April Glass + xBloom Premium Paper was the right setup but Brazil terroir is unusual for the rotation; more data needed.

### By Cultivar

Use cultivar files for variety-intrinsic body, density, transparency, and aromatic behavior. The N≥3 cultivars have graduated to their own capsules:

- [74158](docs/skills/brewing-historian/cluster/patterns/by-cultivar/74158.md)
- [Ethiopian Landrace Population](docs/skills/brewing-historian/cluster/patterns/by-cultivar/ethiopian-landrace-population.md)
- [Gesha](docs/skills/brewing-historian/cluster/patterns/by-cultivar/gesha.md)
- [Mejorado](docs/skills/brewing-historian/cluster/patterns/by-cultivar/mejorado.md)
- [Pacamara](docs/skills/brewing-historian/cluster/patterns/by-cultivar/pacamara.md)
- [Sidra](docs/skills/brewing-historian/cluster/patterns/by-cultivar/sidra.md)
- [Sudan Rume](docs/skills/brewing-historian/cluster/patterns/by-cultivar/sudan-rume.md)

Sub-threshold cultivars (n<3, not yet graduated) live in [Sub-Threshold Cultivar Candidates](#sub-threshold-cultivar-candidates) below.

### By Process Family

Use the process-family files for normal process logic. Keep this file focused on exceptions that cross process with roast, cultivar, roaster, equipment, or water. Each graduated family capsule carries its own default-strategy detail (folded in from the former By-Process table in pruning case 007b). Families below the n≥3 threshold live in [Sub-Threshold Process-Family Candidates](#sub-threshold-process-family-candidates) below.

- [Anaerobic Natural](docs/skills/brewing-historian/cluster/patterns/by-coffee-family/anaerobic-natural.md)
- [Anaerobic Washed](docs/skills/brewing-historian/cluster/patterns/by-coffee-family/anaerobic-washed.md)
- [Double Anaerobic Washed](docs/skills/brewing-historian/cluster/patterns/by-coffee-family/double-anaerobic-washed.md) (also the heavy-co-ferment lane)
- [Thermal Shock Washed](docs/skills/brewing-historian/cluster/patterns/by-coffee-family/thermal-shock-washed.md)
- [Yeast-Inoculated Natural](docs/skills/brewing-historian/cluster/patterns/by-coffee-family/yeast-inoculated-natural.md)
- [Yeast-Inoculated Washed](docs/skills/brewing-historian/cluster/patterns/by-coffee-family/yeast-inoculated-washed.md)
- Sub-threshold (n<3): Washed, White/Light Honey, Honey (medium), Standard Natural, Controlled Natural, Anoxic Natural → [Sub-Threshold Process-Family Candidates](#sub-threshold-process-family-candidates)

### Proposed New Axis: By Roast Level

Roast level deserves its own axis because a materially darker roast can override process, cultivar, and roaster-intent signals. **Not yet stood up:** the override pattern (below) is at n=2 and both confirmations are Untold; the axis graduates to a sibling `by-roast-level/` folder (seeding `medium-developed.md`) once a non-Untold confirmation lands. Until then the pattern lives here as Active Cross-Coffee Pattern #1.

## Cross-Axis Strategy Router

Use this table as the tactical Coffee Brief lookup (the former Process / Variety Signal Table). Each row points to the deeper single-axis file rather than duplicating its full notes.

| Cross-axis signal | Default risk | Recommended start | Why this lives here | Canonical follow-up |
|---|---|---|---|---|
| Medium / developed specialty natural, especially if visibly oily or Agtron ~48 | Process and cultivar defaults over-extract roast solubles | Hybrid → Intensity-Clarity Split | Roast level overrides process and cultivar | Pattern #1 below + [Hybrid](docs/skills/brewing-historian/cluster/patterns/by-strategy/hybrid.md) |
| Anaerobic natural across origins | Clarity-First under-extracts; Balanced can expose bitter tail | Suppression | Same process behavior confirmed across Colombia, Ethiopia, Panama | Pattern #2 + [Suppression](docs/skills/brewing-historian/cluster/patterns/by-strategy/suppression.md) + [anaerobic-natural](docs/skills/brewing-historian/cluster/patterns/by-coffee-family/anaerobic-natural.md) |
| Cold-room dehydration natural | Suppression-like bitter-tail behavior but often wants slightly more heat than anaerobic natural | Suppression at higher temp band (push +1°C from 92°C to 93°C) | Drying modifier behaves like process modifier, not origin-specific terroir | Pattern #2 + [Suppression](docs/skills/brewing-historian/cluster/patterns/by-strategy/suppression.md) |
| Clean anaerobic washed + Full-Expression roaster | Balanced default may under-read roaster intent | Follow roaster: Full Expression | Roaster style overrides clean-process default | Pattern #3 + `docs/brewing/roasters.md` + [Full Expression](docs/skills/brewing-historian/cluster/patterns/by-strategy/full-expression.md) |
| Heavy anaerobic washed Colombian Huila / Cauca Gesha | Clarity-First or Balanced under-extracts heavy ferment structure | Full Expression | Process + region + variety combo | [Full Expression](docs/skills/brewing-historian/cluster/patterns/by-strategy/full-expression.md) + [Gesha](docs/skills/brewing-historian/cluster/patterns/by-cultivar/gesha.md) |
| Anoxic natural (sealed container fermentation) | Clarity-First under-extracts; variety ceiling logic misleads | Full Expression (n=1: Scenery Pikudo's Rosado) | Process overrides variety-default ceiling | [Full Expression](docs/skills/brewing-historian/cluster/patterns/by-strategy/full-expression.md) + [Sub-Threshold: Rosado](#sub-threshold-cultivar-candidates) |
| Heavy anaerobic / co-ferment | Under-extraction; drying/astringent tail in last fraction | Full Expression (+ late-cut Output Selection candidate) | Process + modifier interaction | [Full Expression](docs/skills/brewing-historian/cluster/patterns/by-strategy/full-expression.md) + [Modifier Layer](#modifier-layer) |
| Experimental fermentation (thermal shock, yeast-inoculated) | False assumption that experimental process means Full Expression | Balanced Intensity - confirm with roaster guide | Modifier behavior crosses natural / washed / honey / thermal shock | [Balanced Intensity](docs/skills/brewing-historian/cluster/patterns/by-strategy/balanced-intensity.md) + yeast-inoculated / thermal-shock family files |
| Aromatic-landrace / SL-lineage lots on fast cone vehicles | Phase separation: sharp top note + adjacent body | April Brewer Glass + April Paper or other integration vehicle | Cultivar + equipment interaction | Pattern #4 + [Sudan Rume](docs/skills/brewing-historian/cluster/patterns/by-cultivar/sudan-rume.md) |
| High-EY roaster (Sey, Flower Child, Picky Chemist, Dak) | EG-1 cannot reach their ~450 µm target D50 on its burr geometry | Full Expression + 5.5 grind + boiling water + T-92 filter + slow draw | Roaster target + grinder geometry interaction; compensate via temp / agitation / filter / brew time, not grind | `docs/brewing/roasters.md` + equipment cluster |
| Roast-forward lot + office tap water | Body reads one register heavier; roast wall can look like extraction error | Prefer home low-mineral water, or plan suppression / Hybrid | Water + roast-level interaction | Pattern #6 + equipment / water reference |
| Competition / showcase aromatic lot | Daily payoff may not justify overhead | Aroma Capture only when aromatics are the point | Modifier value depends on context and strategy | [Modifier Layer](#modifier-layer) |

## Active Cross-Coffee Patterns

### 1. Roast Level Can Override Process and Cultivar

**Status:** Working pattern. Two confirmations, both Untold. Needs one non-Untold confirmation before graduating to a `by-roast-level/medium-developed.md` capsule.

When a coffee is materially more developed than the light / ultra-light baseline, roast level becomes the first routing signal. Process and cultivar defaults can point in the wrong direction because they assume lighter-roast solubility.

Confirmed shape:

- Clean natural or controlled natural defaults would normally point to Balanced Intensity or Suppression.
- Medium / dark roast solubles dominate the body.
- The cup shows fruit on attack but roast / ash / oversteeped black tea through the body.
- Parameter tweaks inside Balanced or Clarity-First do not solve it.
- Hybrid Intensity-Clarity Split works better because it separates fruit extraction from roast-register control.

Confirmed data points:

- **Untold Brazil Fazenda Um Wush Wush Natural (WWNAT), brew 25b4465b (2026-05-22)** — a clean controlled natural (Raised Bed) the Controlled Natural row would default to Balanced Intensity. Roasted MEDIUM. On Balanced Intensity (April + April Paper, EG-1 6.4 / 93°C) the developed-roast solubles were amplified into a punishing oversteeped-black-tea wall with prune barely detectable. Resolution was a strategy re-zone to Hybrid (Intensity-Clarity Split) on the Switch (see [by-strategy/hybrid.md](docs/skills/brewing-historian/cluster/patterns/by-strategy/hybrid.md)), NOT a parameter tweak within Balanced.
- **Untold Panama Janson Pacamara Natural (Hacienda 491, Dark Room Dried natural, Pacamara), brew 24b39678 (2026-05-31)** — whole-bean Agtron 47.9, the darkest roast in the archive, visibly oily. Pacamara density → Balanced and the cold-room-dehydration flag → Suppression, but at Agtron 47.9 the roast governed above both. Brew 1 (Orea + FLAT 2 B3, 88°C / EG-1 6.7) gave guava/molasses attack but a bitter/smoky/ashy oversteeped-tea body; resolved by Hybrid (Switch, EG-1 6.8). See [by-cultivar/pacamara.md](docs/skills/brewing-historian/cluster/patterns/by-cultivar/pacamara.md).

Operational rule:

- If Agtron, visual roast, or first cup says "developed roast is the loudest signal," check roast-level logic before process family or cultivar. The override is catchable at the Agtron read, before brewing - 47.9 on a coffee sold as a fruit-forward natural was the lead diagnostic, and the visual (oily, deep brown) corroborated.
- If the tasting signal is **fruit on attack + ashy / smoky / black-tea body**, treat it as a Hybrid trigger.
- Do not chase roast ashiness with finer grind or more agitation.
- At brief time, roast level should LEAD strategy selection on developed-roast lots rather than sitting as a tasting-posture footnote.

One more medium/dark-roast specialty natural (ideally non-Untold, to rule out a roaster-specific artifact) would complete the pattern and trigger the `by-roast-level/` graduation. Tracked in Open Questions.

### 2. Temperature Primacy on Anaerobic Naturals and Cold-Room Dehydration Naturals

**Status:** Confirmed cross-origin pattern.

Anaerobic naturals and cold-room dehydration naturals often fail by bitter-tail temperature behavior, not grind size. Temperature primacy confirmed across Colombian (Finca Inmaculada, Valle del Cauca), Ethiopian (Basha Bekele Kokose, Sidama Bensa), Panama (Altieri NASD), and Ethiopian-green-Panama-processed (Picolot Simba Cold Room) lots - the pattern is process-driven, not terroir-driven, AND extends from fermentation-driven to drying-modifier-driven processes.

Rule:

- Drop temperature before coarsening when the cup shows bitter finish but fruit is present. Coarsening tends to strip fruit before it solves the finish.
- Evaluate below 50°C before deciding the finish is structural; cup integrates significantly below 50°C.
- Use Suppression as the default strategy for anaerobic naturals.
- For cold-room dehydration lots, use the Suppression logic but expect a slightly higher useful temperature band (push +1°C from 92°C to 93°C).
- If Suppression does not resolve the cup, **Balanced Intensity + Inverted Temperature Staging** (88°C → 94°C) is the experimental fallback.

This stays here because the pattern crosses origin, cultivar, and drying / fermentation modifier. Lot-specific notes + the office SWORKS valve template live in [by-strategy/suppression.md](docs/skills/brewing-historian/cluster/patterns/by-strategy/suppression.md) and [by-coffee-family/anaerobic-natural.md](docs/skills/brewing-historian/cluster/patterns/by-coffee-family/anaerobic-natural.md).

### 3. Roaster House Style Can Override Clean Process Defaults

**Status:** Working pattern.

For clean anaerobic washed coffees, Balanced Intensity is the process default. But roaster house style can override it when the roaster's normal cup target is higher extraction.

Confirmed shape:

- DAK Apricoast, Ethiopia Arbegona: clean anaerobic washed Ethiopian landrace still preserved transparency under Full Expression mechanics. (Detail in [by-cultivar/ethiopian-landrace-population.md](docs/skills/brewing-historian/cluster/patterns/by-cultivar/ethiopian-landrace-population.md).)
- The strategy was not "heavy ferment needs Full Expression." It was "clean anaerobic washed + Full-Expression roaster can follow the roaster."

Operational rule:

- For DAK, Sey, Flower Child, Picky Chemist, and similar high-EY roasters, check roaster guidance before applying a conservative process default.
- If the process is clean and the roaster is a Full Expression house, start closer to the roaster's recipe logic.
- If the roaster is not a Full-Expression house, use the process default.

Put roaster-specific evidence in `docs/brewing/roasters.md`. Keep only the override rule here.

### 4. Vehicle Integration Matters for Aromatic-Landrace / SL-Lineage Coffees

**Status:** Working pattern. Two confirmations across different lots; cultivar-specific confirmations still needed.

Some aromatic-landrace or SL-lineage coffees can phase-separate on fast cone vehicles. The problem is not extraction depth. It is integration.

Confirmed shape:

- Fast cone or high-flow vehicle produces a sharp aromatic top note sitting apart from the body.
- April Brewer Glass + April Paper integrates the same flavor set into a more coherent cup.
- Pushing extraction does not necessarily fix the separation.

Confirmed data points:

- Sudan Rume Natural (CGLE Las Margaritas) — Orea Glass + fast cone emphasized pungent lemongrass / ginger separation; April Glass + April Paper resolved it. (Detail in [by-cultivar/sudan-rume.md](docs/skills/brewing-historian/cluster/patterns/by-cultivar/sudan-rume.md).)
- Newbery Street Nawin Doi Chang Washed — Orea + fast paper phase-separated milk chocolate body, lemon top, and hollow tail; April Glass + April Paper integrated them. (Full lot note → [docs/brewing/roasters.md § Newbery Street](docs/brewing/roasters.md).)

Operational rule:

- If an aromatic-landrace / SL-lineage coffee has good flavor notes but reads as layers rather than a single cup, switch vehicle before changing grind.
- Treat April Glass + April Paper as the integration-corrective default until proven otherwise.

The original three Ethiopian-landrace candidates (74110/74112, SL-28, Wush Wush) remain individually untested for the washed/April pattern - confirm on a lot from each before treating it as fully generalized (tracked in Open Questions).

### 5. Cooling Arc Is a Diagnostic, Not a Recipe Lever

**Status:** Confirmed across many coffees, but per-coffee detail belongs in process / cultivar / roaster / roast-level files.

Cooling behavior should guide evaluation timing. It should not become a dumping ground for every coffee-specific tasting note.

Cross-coffee rules:

- Do not evaluate processed, honey, anaerobic, and many Ethiopian / landrace coffees above 50°C.
- **'Prefers hot over cool' = extraction overshoot.** If a coffee with known cool-peak precedent reads better hot than cool, suspect overshoot and drop temperature 1°C (holding grind) before changing other variables. Confirmed on Luna Bermúdez Brew 2 (El Paraíso thermal shock, 6.3 / 95°C) where the bitter tea tail was masked hot and emerged on cooling, with the cup explicitly preferred hot. Distinct from coffees that genuinely peak hot-warm (e.g. Panama Magma washed Gesha) - the diagnostic applies when a coffee with established cool-peak precedent reverses the pattern within an iteration.
- Cooling can reveal three different things:
  - **Integration:** same flavors become more cohesive (dense washed lots).
  - **Transformation:** new volatile notes emerge (naturals).
  - **Damage control:** roast or bitterness recedes enough to judge the cup (dark roasts).

Keep only diagnostic patterns here. Per-coffee cooling notes live in their respective cultivar, process-family, or roaster capsule (re-homed in pruning case 007b; e.g. Sidra → [by-cultivar/sidra.md](docs/skills/brewing-historian/cluster/patterns/by-cultivar/sidra.md), thermal shock → [by-coffee-family/thermal-shock-washed.md](docs/skills/brewing-historian/cluster/patterns/by-coffee-family/thermal-shock-washed.md), Picolot/DAK/Newbery → [docs/brewing/roasters.md](docs/brewing/roasters.md)).

### 6. Water Strength and Office Tap Can Change Roast-Forward Coffees

**Status:** Working pattern.

Office tap water can amplify roast-heavy body. This matters most on roast-forward lots: on a coffee already carrying developed-roast solubles, office tap minerals fill out an already-heavy body and push it from 'manageable brown tea' to 'punishing oversteeped black tea' (confirmed on the Newbery Street Khun Lao Double Honey arc, 2026-05-26 - moving home to a Third Wave Light Roast mix materially relocated the cup before any strategy change). This is a live confirmation of the v8.5 WBC Water Strength cross-cutting control pattern (lower-mineral water as a load-bearing suppression lever).

Rule:

- For roast-forward coffees, prefer home low-mineral remineralized water over office tap.
- If brewing office-only, expect the body to read one register heavier.
- Do not chase the extra body with grind. Treat it as a water-mineral interaction, not an extraction error.

This stays here only because it crosses roast level, water, and strategy routing. Detailed office equipment / water notes live in the Brewing Equipment Expert cluster ([sworks.md § Valve restriction timing principles](docs/skills/brewing-equipment-expert/cluster/sworks.md) + [operational-reference.md § Location Constraints](docs/skills/brewing-equipment-expert/cluster/operational-reference.md) for the office tap-water finding).

## Sub-Threshold Cultivar Candidates

These cultivars are below the n≥3 graduation threshold. They stay here as candidate entries and graduate to a `by-cultivar/` capsule when they reach n≥3.

- **Pink Bourbon** - transparency-driven, not weight-driven. Balanced is the ceiling. Does not benefit from Full Expression.
- **Rosado (Pink Bourbon family, Colombia)** - transparency-driven like Pink Bourbon; Balanced normally the ceiling. However, anoxic natural processing overrides the variety signal entirely (confirmed Full Expression on Scenery Pikudo's Rosado, n=1) - do not apply Rosado/Pink Bourbon ceiling logic to anoxic natural lots. Note: 'Anoxic' canonicalizes to `fermentation:[Anaerobic]` with qualifier `Anoxic`; the qualifier is a record-when-known annotation, NOT a strategy-decision layer - the single-data-point Full-Expression call belongs to this specific lot (Rosado on Anoxic execution), not to the qualifier categorically.
- **Mokka (Bourbon Family, classic Bourbon lineage)** - ancient Yemen-origin dwarf Bourbon-type. Small beans, low yield, high aromatic intensity. Genetically distinct from Mokkita despite name similarity - do NOT classify as the same variety. One data point: Picolot Garrido Panama Mokka Natural (Emerald PL#015) - Full Expression at EG-1 6.0 / 95°C kettle-off / SWORKS fast/fast/slow (Dial 7 → 7 → 5). Transparency-driven cup structure with "crisp body" intentional to the variety; tea-like body is not a recipe deficiency. Pair with roaster Full Expression guidance rather than variety ceiling logic. Distinct from Mokkita: cleaner, more structured acidity with herbal lift; wine character absent.
- **Mokkita (Modern Hybrids, multi-parent hybrid lineage)** - modern selection/hybrid line, often tied to specific farms (e.g. Garrido). Broader brew tolerance than Gesha; can handle Balanced and benefits from it. Distinct from Mokka: wine-structured naturals with dark plum / raisin fruit and structural weight. Confirmed in cup: Picolot Garrido Mokkita Cold Room (DRD Natural) cupped syrupy, wine-structured, mulled-wine-and-raisin (vs the Mokka Emerald's cleaner transparency-driven herbal lift) - do NOT transfer the Mokka 6.0 Full-Expression recipe to Mokkita. Process-tier distinction within Mokkita: Cold Room DRD ≠ standard DRD. The plain Mokkita Natural DRD held a medium body at 6.6; the heavier Cold Room dark-drying ferment supported one click finer at EG-1 6.2 / 94°C / valve 5→5→7 while holding the full layered profile - confirmed Balanced Intensity (deep end). Warm-cup bitter tail resolves with a kettle-off-base Pour-2 temperature taper, not grind coarsening. Evaluate below 50°C. See [by-strategy/balanced-intensity.md](docs/skills/brewing-historian/cluster/patterns/by-strategy/balanced-intensity.md). brew_id 7ad09c9b-35c3-4635-88eb-248bb38b42bc.
- **Catimor (group)** - Timor Hybrid-derived dwarf hybrid; not transparency-driven, not aromatic-landrace structure. Carries denser body weight than higher-elevation Bourbon/Typica varieties at equivalent recipe targets - reads as black/brown tea structure on the body even on a clean recipe; this is variety + low/mid elevation, not a recipe artifact, and does not respond to coarsening. Confirmed yeast-inoculated lots from Yunnan (Project One Light, Olina Cai) on Moonwake: Peach Oolong (anaerobic natural) at EG-1 6.3 / 96°C and Blue Iris (anaerobic honey) at EG-1 6.3 / 95°C, both Balanced Intensity, both 1300-1500 masl. Variety + yeast inoculation pair to Balanced Intensity at the finer end; honey vs anaerobic-natural finishing process shifts the temperature ceiling by 1°C (honey at 95°C, anaerobic natural at 96°C) without changing grind position. Two data points, same producer.
- **Catuai (washed, Honduras)** - dense variety that exceeded Clarity-First's extraction ceiling despite clean washed process. One data point; flag variety density and expression intent on future washed Catuai lots.
- **Red Bourbon (Bourbon family, classic Bourbon lineage; long-ferment washed)** - long-ferment Rwandan washed Red Bourbon (Moonwake Ngoma Station J.M.V. Usekanabagoyi, Nyamasheke / Lake Kivu Highlands) peaks ~45°C and below. ≥50°C: pear and grapefruit forward, mid-palate undifferentiated, faint drying tail. ~50°C: lemon verbena separates as a distinct herbal-tea note, body fills in. Below ~45°C: drying tail resolves entirely, attack gains brightness, profile integrates into pear + grapefruit + honeyed verbena tea. Cool-window discipline applies to long-ferment classic washed lots, not just processed/anaerobic ones - the 8-hour cherry + 12-hour wet ferment footprint produces a faint phenolic tail that is temperature-driven, not extraction-driven. One data point - flag for confirmation on the next Burundian or Rwandan washed Bourbon with comparable ferment length.

## Sub-Threshold Process-Family Candidates

These process families are below the n≥3 graduation threshold for their own `by-coffee-family/` capsule, or carry only a single-axis default-strategy note with no standing cross-anchor pattern. They stay here as thin notes + routers (the parallel of Sub-Threshold Cultivar Candidates above) and graduate to a capsule when they reach n≥3 of distinct family-level pattern. Most of the actual per-coffee evidence already lives in the cultivar / roaster / strategy homes named in each router. (The six already-graduated families - Anaerobic Natural, Anaerobic Washed, Double Anaerobic Washed, Thermal Shock Washed, Yeast-Inoculated Natural/Washed - have their own capsules; the heavy-co-ferment lane lives inside [by-coffee-family/double-anaerobic-washed.md](docs/skills/brewing-historian/cluster/patterns/by-coffee-family/double-anaerobic-washed.md).)

- **Washed** → Clarity-First. Turbulence flattens acidity; don't over-agitate. Exception: dense varieties with fruit-forward expression intent (Catuai, Honduras) may exceed the Clarity-First ceiling and need Full Expression - one data point. Router: clean washed evidence on [by-strategy/clarity-first.md](docs/skills/brewing-historian/cluster/patterns/by-strategy/clarity-first.md); cultivar-density exceptions in the relevant by-cultivar capsule (e.g. [Catuai candidate](#sub-threshold-cultivar-candidates) above).
- **White / Light Honey** → Clarity-First → Balanced. Some lots need 6.5 not 6.7. Key risk: thin sweetness at the coarse end.
- **Honey (medium)** → Balanced Intensity. Pink Bourbon prefers Balanced, not Full (see Pink Bourbon candidate above). Heavy honey can push toward sweetness overload. **General cooling default: evaluate honey-process lots below 50°C** - sweetness integration increases below 50°C (confirmed on anaerobic-honey Gesha, Finca La Reserva; per-lot detail in [by-cultivar/gesha.md](docs/skills/brewing-historian/cluster/patterns/by-cultivar/gesha.md) + the Colibri roaster card).
- **Standard Natural (non-anaerobic, raised bed / washed station)** → Balanced Intensity. Ethiopian landraces with brightness-forward targets (berry, citrus, white tea) confirm the Balanced lower edge (EG-1 6.4 / 94°C; Moonwake Alo Gemechu Station, Sidama - detail in [by-cultivar/ethiopian-landrace-population.md](docs/skills/brewing-historian/cluster/patterns/by-cultivar/ethiopian-landrace-population.md)). CGLE Sudan Rume Natural confirmed Balanced at the light end - variety transparency drives position within Balanced ([by-cultivar/sudan-rume.md](docs/skills/brewing-historian/cluster/patterns/by-cultivar/sudan-rume.md)). Key risk: a sharp finish above 50°C is heat masking, not an extraction defect - do not coarsen or drop temp; evaluate below 50°C. For aromatic-landrace varieties (Sudan Rume, SL-lineage), watch for vehicle-driven phase separation rather than extraction depth (Active Pattern #4).
- **Controlled Natural (DRD, raised bed)** → Balanced Intensity. Picolot Garrido naturals confirmed Full Expression on roaster house style - Mokka (PL#015) at EG-1 6.0 and Pacamara (PL#16) at EG-1 6.1, both fast/fast/slow Dial 7 → 7 → 5 (detail in [docs/brewing/roasters.md § Picolot](docs/brewing/roasters.md) + [by-cultivar/pacamara.md](docs/skills/brewing-historian/cluster/patterns/by-cultivar/pacamara.md); Mokka/Mokkita as cultivar candidates above). Straight natural alone does NOT invert SWORKS valve structure - slow/slow/open inversion is reserved for yeast-anaerobic and heavy co-ferment lots. Hacienda La Esmeralda "NC" climate-controlled naturals stay Clarity-First (two data points; detail in [by-cultivar/gesha.md](docs/skills/brewing-historian/cluster/patterns/by-cultivar/gesha.md)). Key risk: wine character needs support, not suppression; do not invert house valve structure for clean naturals; do not apply the Balanced default to Esmeralda NC lots.
- **Anoxic Natural (sealed container)** → Full Expression (Scenery Pikudo's Rosado, one data point). Process overrides the variety signal; a temperature taper resolves the bitter tail. Cooling: peaks below 50°C - the mild bitter tail at serving temperature resolves cleanly as the cup cools. Router: cross-axis exception in the Cross-Axis Strategy Router above; variety note as the [Rosado candidate](#sub-threshold-cultivar-candidates). ('Anoxic' canonicalizes to `fermentation:[Anaerobic]` with the `Anoxic` qualifier - a record-when-known annotation, not a strategy-decision layer.)
- **Heavy Anaerobic / Co-ferment** → Full Expression (heavy-ferment logic; confirm with roaster guide). Now homed in [by-coffee-family/double-anaerobic-washed.md § Heavy co-ferment](docs/skills/brewing-historian/cluster/patterns/by-coffee-family/double-anaerobic-washed.md) - late-cut Output Selection candidate + El Eden Tamarind cooling. Key risk: sour if under, boozy if over.

## Modifier Layer

Modifiers are Axis 2. They do not replace strategy selection - use them only after Axis 1 is clear. *Rule: same as strategy patterns - don't promote a modifier-coffee combination from "experimental" to "confirmed pattern" until two data points exist.* Modifiers have no single-axis capsule, so this file is their permanent home.

> **v8.4 (2026-05-06):** the v8.3 *Immersion* modifier was removed and absorbed into the **Hybrid** strategy (Axis 1) via `hybrid_subform`. Switch-style + SWORKS valve-modulated brewing is now a strategy-level decision, not a modifier. See [by-strategy/hybrid.md](docs/skills/brewing-historian/cluster/patterns/by-strategy/hybrid.md).

### Output Selection

**Confirmed / candidate use:** heavy ferment coffees where astringency or drying concentrates in a specific fraction.

- **Late cut** is the primary candidate for heavy co-ferment washed and heavy anaerobic washed lots. Tested informally pre-framework on Moonwake El Eden Tamarind Washed with positive results: stopping the brew before full target weight produced a cleaner finish without compromising body. One informal data point. Next heavy co-ferment washed lot should formalize it - specify the cut point in the recipe (e.g. "stop at 245g of 288g") and document whether the kept fraction matches or exceeds the full-yield reference brew.
- **Early cut** is a candidate only when the front of the cup reads sharp / saline / off rather than expressive.
- Candidate (untested): heavy anaerobic washed Colombian Geshas from Huila/Cauca (Jeferson Motta family) - same heavy-tail mechanics; late cut is a plausible refinement to the existing Full Expression reference.

### Inverted Temperature Staging

**Status:** Experimental fallback. No confirmed data points yet.

Designated experimental move for any anaerobic natural that does not resolve at Suppression - test 88°C → 94°C across two phases before exploring grind or other levers. Do not pair with pure Suppression intent unless the goal is explicitly phase separation (a high-temp finish defeats the suppression intent).

### Aroma Capture

**Status:** First confirmed application; modest daily value, high showcase value.

Validated reference - **Pepe Jijón Finca Soledad Sidra Wave Hybrid (Moonwake, Ecuador) on Extraction Push** (brew b27afe61-0ca0-4cbd-8e25-d460cbead9ac). Bloom + Pour 1 application (Vannelli-adjacent): Paragon chilling ball pre-chilled ≥2hr, placed in carafe before bloom, carafe covered through 45s bloom wait, ball remains through Pour 1 (110g cumulative), removed at start of Pour 2 (~1:40), Pours 2-4 land at normal temperature, carafe swirled before serving. Modifier delivered a real but modest amplitude lift: pomegranate climbed onto aroma (absent on aroma in the non-modifier reference), rose moved from finish-only to woven through body.

- **Cooling-arc artifact (first observed).** Aroma Capture shifts peak expression window warmer (~48-50°C) from the non-modifier reference's natural 45°C peak. Drink the modifier-active cup warm, not cool - waiting to the standard 45°C window produces slight drying re-emergence and less integrated mid-palate. Right window for competition (judges taste warm); awkward tradeoff for daily brewing.
- **Bloom-only application underperforms** (one data point, same coffee): less amplitude than bloom + Pour 1, same warmer-peak shift, slight drying still re-emerged on cool. Bloom-only is not the safer/conservative variant - it is the worse one. Reference window is bloom + Pour 1.
- **Effort-vs-payoff calibration.** Amplitude lift is real but modest. Treat Aroma Capture as a competition / showcase technique on aromatic transparency-driven coffees, not a default daily routine.
- Candidate untested: Esmeralda climate-controlled naturals, washed Geshas from high-elevation Panama, anaerobic naturals where the aromatic signature is the target.

### Modifier Compatibility Matrix

| Strategy | Output Selection | Inverted Temperature Staging | Aroma Capture |
|---|---|---|---|
| Suppression | Possible but rare | **Counterproductive** - high-temp finish defeats the suppression intent | Possible |
| Clarity-First | Possible but rare | **Counterproductive** - already-light coffees do not benefit | Likely useful for highly aromatic coffees |
| Balanced Intensity | Possible | **Compatible** - primary pairing for the modifier | Possible |
| Full Expression | **Compatible** - primary pairing for late cut on heavy ferments | Compatible | Possible (but high temp partially defeats it) |
| Extraction Push | Possible (untested) | Compatible (untested) | **Likely useful** - clean aromatic coffees are the prime aroma-capture candidate |
| Hybrid (v8.4) | **Compatible** - Selective Bloom Hybrid IS Hybrid + Output Selection; late cut natural on Intensity-Clarity Split | Compatible - Temperature-Staged Hybrid bakes inverted-temp logic into phase boundaries | Compatible - phase boundaries give natural application points |

## Open Questions

Things to test across future brews. **Maintenance rule:** when a question resolves, delete it (don't strikethrough); the resolution lives in the relevant capsule + commit history.

### Roast Level

- Does the medium / developed-roast specialty natural → Hybrid Intensity-Clarity Split pattern hold on a non-Untold roaster? One more confirmation graduates Pattern #1 to a `by-roast-level/medium-developed.md` capsule.
- What Agtron or visual threshold should trigger roast-level-first routing before process-family routing?

### Strategy Generalization

- Does finer grind (6.0 vs 6.1) consistently trade body clarity for attack intensity on anaerobic washed lots, or is this specific to Jeferson Motta?
- Does the anoxic natural Full Expression signal hold outside Huila and outside Rosado / Pink Bourbon-family varieties? Test on a non-Huila anoxic natural.
- Is temperature the primary finishing lever for bitter tail on non-Colombian anaerobic naturals?
- Has a Flower Child coffee been tested with T-92 filter + boiling water as their guide specifies?
- Does Extraction Push generalize from Ecuador Sidra to clean washed Panama Gesha?
- Mokkita Natural DRD: does it follow the Garrido bean-density grind ladder (Mokka 6.0 → Pacamara 6.1), or does fermentation density override bean density? Test Mokkita DRD specifically.

### Modifier Tests

- Formalize late-cut Output Selection on the next heavy co-ferment washed lot: full-yield reference vs ~85% target-weight cut. If the kept fraction exceeds the full-yield brew, late cut is promoted to a confirmed modifier on heavy co-ferment washed.
- Test Inverted Temperature Staging (88°C → 94°C) on the next anaerobic natural that Suppression cannot resolve. No suitable test coffee yet.
- Test Aroma Capture on Esmeralda climate-controlled natural or clean washed Panama Gesha to confirm whether the warmer-peak artifact generalizes beyond Sidra.
- Hybrid (Selective Bloom) first test (Eline Ferket 2025 pattern): bloom on the Switch with valve closed, drain bloom liquid separately, evaluate alone, recombine if complete / discard if harsh. Highest-leverage on an aromatic Clarity-First lot.

### Vehicle / Equipment / Water

- Does April Brewer Glass + April Paper integration-corrective behavior hold on 74110 / 74112, SL-28, or **washed** Wush Wush specifically? (The Untold WWNAT data point, brew 25b4465b, does NOT resolve this - it was a medium-roast natural on the Switch/Hybrid, not a light washed lot on April, so the three Ethiopian-landrace candidates remain effectively untested for the washed/April pattern.)
- Does the Dongze 12.5g small-pouch vehicle pattern (Hario V60 + CONE B3 + EG-1 6.5 + 93-94°C) generalize to non-Dongze 12.5g pouches? Strengthened to 5 data points across washed (93°C), NC climate-controlled natural (93.5°C), and standard raised-bed natural (94°C). Test next on a 12.5g pouch from another roaster.
- Does the +0.5°C step from NC climate-controlled drying (93.5°C) to standard raised-bed natural drying (94°C) at the Dongze 12.5g/200g vehicle hold outside Hacienda La Esmeralda?
- Does the April Brewer at home (remineralized water) drain materially slower than at the office (tap water)?
- Does the Sibarist B2 Cone fill the flow gap between B3 (~3:00 at 12.5g/200g) and FAST (~2:00) on the EG-1 home setup? Filter Drawdown Test Protocol drafted (V60 Glass, 15g/250g, EG-1 6.5, 93°C, single Melodrip pour, 3 replicates per filter, randomized order); pending execution. Source brew: e479e75b (Longboard Misty Mountain, Coffee with Dongze).

## End-of-Coffee Workflow

After each coffee is finished, run this checklist before starting the next coffee. This feeds the `propose_doc_changes` pipeline - the Brewing Historian reads the finished brew, decides what was surprising or new, and proposes the routed edits.

### 1. Ask What Kind of Learning This Was

- Did the planned strategy behave as expected?
- Did roast level override process or cultivar?
- Did roaster house style override the default?
- Did equipment, water, or filter choice materially change the result?
- Did cooling behavior change the verdict?
- Did a modifier help, fail, or become a candidate? (Null modifier results are still signal.)

### 2. Route the Update (narrowest correct home)

- Strategy evidence → `by-strategy/<strategy>.md`
- Process-family evidence → `by-coffee-family/<process>.md`
- Cultivar evidence → `by-cultivar/<cultivar>.md` (or a Sub-Threshold Candidate entry here if n<3)
- Roast-level evidence → proposed `by-roast-level/<level>.md` (Active Pattern #1 here until the axis is stood up)
- Roaster style → `docs/brewing/roasters.md`
- Equipment / water / filter behavior → Brewing Equipment Expert cluster
- Cross-anchor pattern → this file (Active Cross-Coffee Patterns)
- Modifier → Modifier Layer here
- Open question → `Open Questions` above

### 3. Decide Whether This File Changes

Update this file only if the coffee teaches one of: a cross-anchor strategy-selection rule; a confirmed or candidate modifier interaction; a cooling-arc diagnostic that applies beyond the single coffee; a water / equipment interaction that changes future strategy routing; or an open question that future brews should test. Do not add full recipes here - link to the app brew ID or the relevant sibling capsule.

### 4. Use `propose_doc_changes`

After the brew is archived, the Brewing Historian proposes doc changes rather than scattering edits directly. The proposal should include: source brew ID; one-sentence learning; target file(s); exact section anchor(s); whether the learning is n=1 candidate / n=2 working pattern / n=3+ durable rule; proposed edit text; and any deletions from this file caused by moving single-axis knowledge elsewhere.

### 5. Update the Brew App

Push the best brew via `push_brew` with a complete `What I Learned` entry: specific testable bullet points; `Modifiers Confirmed: None` explicitly if no modifier was used; `Extraction Confirmed` only for divergent strategy outcomes (leave empty if planned matched tasted). Office coffees do not go through the home inventory or Agtron workflow - two separate inventories are maintained (home: full Agtron/spreadsheet/cellar tracking; office: none). Only home coffees require the Agtron step at dose-out.

### 6. Check for Default-Brewer Drift

Before the next coffee, ask whether the same brewer is being reused by habit. The default-brewer trap and the default-strategy trap have the same shape.
