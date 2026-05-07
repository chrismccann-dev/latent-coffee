# WBC Reference (Latent Mapping)

Lean reference layer derived from Chris's "World Brewers Cup Champion - Recipes and Extraction Taxonomy" research. The five-axis foundational framework + eight strategy families below describe how competition brewers think about extraction. Latent's live taxonomy ([BREWING.md](../../BREWING.md) Section 1, Step 1d) intentionally folds these into a smaller, single-origin-friendly shape (**6 strategies + 3 modifiers** post-v8.4) — this doc is the lookup table for "what was the WBC competitor doing" → "where does that map in Latent's framework".

For the comprehensive 102-recipe archive (subtype definitions, per-recipe detail, year-by-year coverage 2022-2025), see **[wbc-recipes.md](wbc-recipes.md)**.

## History

- **2026-05-03 (Sprint 2.7):** Originally split out of BREWING.md SECTION 4 with a summary of 18 finalists/champions. Latent taxonomy at that point was 5 strategies + 4 modifiers (Immersion was a modifier).
- **2026-05-06 (v8.4):** Refreshed against the 102-recipe expansion. Latent taxonomy promoted Hybrid to a 6th first-class strategy (absorbing the Immersion modifier); the mapping table below reflects the v8.4 framework. Comprehensive 102-recipe data moved to [wbc-recipes.md](wbc-recipes.md); this doc stays lean.

## Foundational Control Axes (5)

| **Axis**              | **Definition**                                | **Main Levers**                                          |
|-----------------------|-----------------------------------------------|----------------------------------------------------------|
| Extraction Intensity  | How much is extracted                         | grind, ratio, temp, water chemistry                      |
| Time Distribution     | When extraction happens                       | pours, pulse timing, immersion duration                  |
| Physical System       | Where/how extraction occurs in the bed        | geometry, layering, PSD, grind separation                |
| External Control      | Stabilizing or shaping the process externally | tools, flow devices, thermal handling                    |
| Output Selection      | Which parts of extraction are kept            | discarding early/late fractions, yield cutoff            |

Latent's live taxonomy maps onto axes 1 (intensity strategies), 4 (modifiers like Aroma Capture / Inverted Temperature Staging), and 5 (Output Selection modifier). Axis 2 (Time Distribution) is partially absorbed into Hybrid sub-forms; axis 3 (Physical System) is mostly blend-engineering and out of scope for single-origin home brewing.

## Core Strategy Families (8)

Distribution across the 102-recipe archive (2022-2025) — the relative weight has shifted since the original 18-recipe summary:

| **Family**                            | **Count** | **Definition**                                                                                                  | **Latent Mapping (post-v8.4)**                                                                                          |
|---------------------------------------|-----------|------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| **Hybrid Systems**                    | 18 (largest cluster) | Combine percolation and immersion in distinct phases to assign different extraction roles.            | **Strategy: Hybrid (v8.4)**. Sub-form picks one of: Sequential / Phase-Mapped / Selective Bloom / Intensity-Clarity Split / Temperature-Staged. |
| **Flow / Stability Systems**          | 14        | Stabilize flow and reduce variability to enable controlled extraction (Melodrip, needling, fast filters).        | Implicit: Melodrip is a primary tool inside Clarity-First and Extraction Push, not a separate slot. Filter-Mediated Flow noted as deliberate non-add (v8.4 changelog). |
| **Thermal Systems**                   | 8         | Use temperature actively to shape extraction (staged, inverted, fluctuation, continuous blending, cooling-curve).| Modifier: Inverted Temperature Staging. Modifier: Aroma Capture. v8.4 named consideration: Cooling-Curve Design. Hybrid (Temperature-Staged) sub-form when phase boundaries coincide with temp changes. |
| **Structural Systems** (sum of variants) | 24    | Engineer the inputs / physical bed / blend structure (layered bed, dual grind, blend ratio, roast-based, filter-mediated). | **Out of scope** for single-origin home brewing. Future-capture only.                                                    |
| **Suppression Systems**               | 6         | Intentionally limit extraction intensity to avoid harshness while maintaining structure.                         | Strategy: Suppression.                                                                                                   |
| **Time-Distributed Systems**          | 9 (Pulse 5 + Role-Based 2 + Parametric 2 + others) | Shape extraction by controlling when extraction happens (pulse, role-based, parametric, double bloom, drain-based). | Implicit in pour structure; Phase-Mapped Hybrid covers Role-Based-Pulse-with-immersion. Time Distribution noted as deliberate non-add for now (v8.4 changelog). |
| **Immersion Systems** (standalone)    | 5         | Use full immersion or staged immersion alone (no percolation phase).                                             | **Strategy: Hybrid (Sequential)** when there's any drawdown phase. Pure full-immersion (Switch closed throughout) is a degenerate Sequential. |
| **Extraction Push (High-Yield Clarity)** | 5      | Maximize extraction yield while preserving clarity (Wölfl, Tran, Giachgia).                                       | Strategy: Extraction Push.                                                                                               |
| **Output Selection Systems** (standalone) | 1     | Selective output extraction / bloom fraction separation / yield cutoff (when this IS the primary strategy).      | Modifier: Output Selection (one of three forms: early_cut / late_cut / both). Selective Bloom Hybrid when bloom-separation is the structural intent. |

The 102-recipe expansion shifted relative weights significantly from the 18-recipe set: Hybrid emerged as the largest single cluster (was tied with several others), and Time-Distributed Systems showed up as the primary axis on 34 of 102 recipes — under-served as a strategic axis in Latent's framework. See v8.4 changelog in BREWING.md § SECTION 5 for the deliberate non-add reasoning on Time Distribution.

## Sub-form mapping cheat sheet

When a WBC recipe is described as a Hybrid sub-form, here's where it lands in Latent's `hybrid_subform` enum:

| **WBC subtype**                    | **Latent `hybrid_subform`**         | **Notes**                                                                                                           |
|------------------------------------|-------------------------------------|----------------------------------------------------------------------------------------------------------------------|
| Sequential Hybrid                  | `sequential`                        | Canonical Switch recipe. SWORKS slow/slow/open also fits.                                                            |
| Immersion Staging                  | `sequential`                        | Hybrid sub-types collapse — immersion staging within a hybrid brew is a Sequential pattern.                          |
| Phase-Mapped Hybrid                | `phase_mapped`                      | Each pour has explicit sensory target (saturation / body / clarity / finish).                                        |
| Selective Bloom Hybrid             | `selective_bloom`                   | Bloom liquid separated from main brew. Bridges Output Selection; classify under Hybrid when bloom-separation IS the strategy. |
| Intensity-Clarity Split            | `intensity_clarity_split`           | Immersion → percolation, body-then-clarity. Phase order matters.                                                     |
| Alternating Phase Control          | `phase_mapped` (collapse)           | More elaborate Phase-Mapped pattern; not a separate sub-form in Latent.                                              |
| Temperature-Staged Hybrid          | `temperature_staged`                | Phase boundaries coincide with temperature changes.                                                                  |
| Temperature-Sandwich Hybrid        | `temperature_staged` (collapse)     | Specific low-high-low Temperature-Staged pattern; not a separate sub-form in Latent.                                 |
| Parametric Hybrid                  | (deferred - blend territory)        | Multi-variable coordinated control; competition stagecraft. Add if the Latent context ever warrants it.              |

## Consciously not pursuing

Techniques present in the WBC dataset that Chris has decided not to pursue, with the reason. This list exists so the decision is legible and the next "should we do this?" question has a recorded answer.

- **Mid-pour temperature blending** (Tom Hutchins 2024). Two kettles at different temps, mixed in real time during the pour. Over-engineered for home/office context; hardware overhead is significant for marginal gain.
- **Roast-based structuring on single origin** (George Peng 2025, Raul Rodas 2025). One coffee roasted at multiple end temps, blended in the brewer. Latent does roast (Sprint 1k+ self-roasted track) but the structural-blending application is parked - too many variables to dial in without competition pressure.
- **Mesh-then-paper transitions** (Garam Victor Um 2023). Switch filter type mid-brew. Requires brewer geometry not currently in the equipment set.
- **Solubility alignment via roast matching** (Elysia Tan 2024). Match roast development across multiple coffees in a blend so they extract together. Blend-specific; no single-origin transfer.
- **Layered bed by component** (Wataru Iidaka 2024). Spatially place different coffees within the bed. Blend-specific.
- **Dual-Chamber / Wet-Blended Component Extraction.** Components extracted in physically separate chambers or blended after brewing. Pure blend stagecraft.
- **Heritage Brewer Re-Engineering** (provisional). Cultural-specific brewer modifications. Not Chris's context.
- **Triangle variable thinking** (Bayu Prawiro 2025). Treat agitation / flow / contact time as linked variables that move together. Useful as a mental model but already implicit in Chris's grind-vs-valve thinking on the SWORKS bottomless dripper. Not a new technique, just a name for what he already does.
- **Time Distribution as a foundational axis** (v8.4 deliberate non-add). The Drain-Based Pulse half is descriptive-only (already happening on SWORKS). The Role-Based Pulse half is real new discipline but covered by the Phase-Mapped Hybrid sub-form when immersion is involved. Reconsider if a queued experiment actually treats time-distribution-without-immersion as the primary lever.
- **Filter-Mediated Flow as a foundational axis** (v8.4 deliberate non-add). Filter material as an active variable beyond flow speed. Pure future-capture; add when an Extraction Push or similar experiment treats filter as an explicit strategic variable.
