# WBC Reference

Reference layer derived from Chris's "World Brewers Cup Champion - Recipes and Extraction Taxonomy" research (18 finalists/champions across 2023-2025). The five-axis foundational framework + eight strategy families below describe how competition brewers think about extraction. Latent's live taxonomy ([BREWING.md](../../BREWING.md) Section 1, Step 1d) intentionally folds these into a smaller, single-origin-friendly shape (5 strategies + 4 modifiers) - this doc is the comprehensive reference for "what was the WBC competitor doing" lookups, not the live registry.

Split out of BREWING.md SECTION 4 on 2026-05-03 (Sprint 2.7) so the master brewing reference stays lean. This content is referenced during framework discussions and "is this WBC technique already covered as a modifier?" lookups, but not during a normal Coffee Brief Step 1-4 iteration. Pull via `read_doc(docs/brewing/wbc-reference.md)` when needed.

## Foundational Control Axes (5)

| **Axis**              | **Definition**                                | **Main Levers**                                          |
|-----------------------|-----------------------------------------------|----------------------------------------------------------|
| Extraction Intensity  | How much is extracted                         | grind, ratio, temp, water chemistry                      |
| Time Distribution     | When extraction happens                       | pours, pulse timing, immersion duration                  |
| Physical System       | Where/how extraction occurs in the bed        | geometry, layering, PSD, grind separation                |
| External Control      | Stabilizing or shaping the process externally | tools, flow devices, thermal handling                    |
| Output Selection      | Which parts of extraction are kept            | discarding early/late fractions, yield cutoff            |

Latent's live taxonomy maps onto axes 1 (Strategy) and partially onto axes 2 / 4 / 5 (Modifiers). Axis 3 (Physical System) is mostly blend-engineering and not in scope for single-origin home brewing.

## Core Strategy Families (8)

| **Family**                            | **Subtypes**                                                                                                  | **Definition**                                                                                                                              | **Representative**                                       | **Failure Mode**                              |
|---------------------------------------|---------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------|-----------------------------------------------|
| Extraction Push (High-Yield Clarity)  | -                                                                                                             | Maximize extraction yield while preserving clarity. Fine grind, fast filters, high or stable temp, moderate-high ppm.                       | Savina Giachgia, Jackie Tran, Martin Wölfl               | Astringency, drying finish, loss of structure |
| Suppression Systems                   | -                                                                                                             | Intentionally limit extraction to avoid harshness while maintaining structure. Lower temp, coarser grind, low agitation.                    | Carlos Medina                                            | Naturals / co-ferments + slightly developed roasts |
| Time-Distributed Systems              | Pulse-based (Carlos), Parametric (George, Bayu), Selective Output (Escobar)                                   | Shape extraction by controlling timing or selecting portions of the curve. Fixed intervals, repeated pulses, programmable final phase.      | Carlos Medina, George Peng, Bayu Prawiro, Carlos Escobar | Over-complexity, timing sensitivity           |
| Structural Systems                    | Dual grind (Luca), Layered bed (Wataru), Pre-brew alignment (Elysia), Ratio-engineered blends (Andrea), Roast-based structure (George 2025) | Engineer the inputs or physical structure before/during brewing. Multi-grind, layering, blend ratio, roast-level differentiation.           | Luca Croce, Wataru Iidaka, Elysia Tan, Andrea Batacchi   | Disjointed cup, poor integration              |
| Thermal Systems                       | Staged temp (Garam, Giacomo), Inverted temp (Ryan), Continuous blending (Tom)                                 | Use temperature actively to shape extraction. Multi-kettle workflows, temperature staging or inversion, cooling / aroma locking.            | Giacomo Vannelli, Tom Hutchins, Ryan Wibawa              | Over-engineering, instability                 |
| Flow / Stability Systems              | -                                                                                                             | Stabilize flow and reduce variability. Melodrip / drip assist, needling / bed prep, flat-bottom or controlled geometry.                     | Martin Wölfl, Jackie Tran (partial)                      | Over-smoothing, reduced character             |
| Immersion Systems                     | -                                                                                                             | Use immersion to equalize extraction across components. Switch-style, multi-stage immersion, low agitation.                                 | Ryan Wibawa, Charity Cheung                              | Flat or muted cup, loss of separation         |
| Hybrid Systems                        | Sequential (Garam), Immersion staging (Ryan), Parametric (Bayu), Phase-mapped (Justin)                        | Combine percolation and immersion in distinct phases to assign different extraction roles. Hybrid brewer, phase-mapped extraction.          | Garam Victor Um, Ryan Wibawa, Bayu Prawiro, Justin Bull  | Poor phase balance, transition instability    |

## How the families map onto Latent's live taxonomy

| **WBC family**           | **Latent slot**                                       |
|--------------------------|-------------------------------------------------------|
| Extraction Push          | Strategy: Extraction Push (clean coffees)             |
| Suppression Systems      | Strategy: Suppression                                 |
| Time-Distributed (Selective Output sub-type) | Modifier: Output Selection         |
| Time-Distributed (other sub-types - Pulse, Parametric)        | Implicit in pour structure; not a separate slot |
| Structural Systems       | Out of scope (single-origin context)                  |
| Thermal (Inverted)       | Modifier: Inverted Temperature Staging                |
| Thermal (Aroma capture sub-type) | Modifier: Aroma Capture                       |
| Flow / Stability         | Implicit (Melodrip is a primary tool, not a strategy) |
| Immersion                | Modifier: Immersion (SWORKS valve-modulated; Hario Switch when experimented) |
| Hybrid                   | Modifier: Immersion captures the SWORKS-as-percolation-immersion-hybrid case; true sequential hybrid out of scope |

## Consciously not pursuing

Techniques present in the WBC dataset that Chris has decided not to pursue, with the reason. This list exists so the decision is legible and the next "should we do this?" question has a recorded answer.

- **Mid-pour temperature blending** (Tom Hutchins 2024). Two kettles at different temps, mixed in real time during the pour. Over-engineered for home/office context; hardware overhead is significant for marginal gain.
- **Roast-based structuring on single origin** (George Peng 2025). One coffee roasted at three different end temps, blended in the brewer. Latent does roast (Sprint 1k+ self-roasted track) but the structural-blending application is parked - too many variables to dial in without competition pressure.
- **Mesh-then-paper transitions** (Garam Victor Um 2023). Switch filter type mid-brew. Requires brewer geometry not currently in the equipment set.
- **Solubility alignment via roast matching** (Elysia Tan 2024). Match roast development across multiple coffees in a blend so they extract together. Blend-specific; no single-origin transfer.
- **Layered bed by component** (Wataru Iidaka 2024). Spatially place different coffees within the bed. Blend-specific.
- **Triangle variable thinking** (Bayu Prawiro 2025). Treat agitation / flow / contact time as linked variables that move together. Useful as a mental model but already implicit in Chris's grind-vs-valve thinking on the SWORKS bottomless dripper. Not a new technique, just a name for what he already does.
