# WBC Reference (Latent Mapping)

Lean reference layer derived from Chris's "World Brewers Cup Champion - Recipes and Extraction Taxonomy" research. The five-axis foundational framework + nine strategy families below describe how competition brewers think about extraction. Latent's live taxonomy ([BREWING.md](BREWING.md) Section 1, Step 1d) intentionally folds these into a smaller, single-origin-friendly shape (**6 strategies + 4 modifiers** post-v8.5, plus a doc-layer of cross-cutting control patterns surfaced through this reference) — this doc is the lookup table for "what was the WBC competitor doing" → "where does that map in Latent's framework", and the playbook for calibration-axis moves that deliberately don't get promoted to canonical modifiers.

For the strategy taxonomy (distribution + findings + 65 subtype definitions, 2022-2026), see **[wbc-recipes.md](docs/skills/wbc-brewing-archivist/cluster/wbc-recipes.md)**; for the 154 competitor-by-competitor recipe rows grouped by strategy family, see **[wbc-recipes-by-family.md](docs/skills/wbc-brewing-archivist/cluster/wbc-recipes-by-family.md)** (split out of wbc-recipes.md 2026-06-29 at the 60 KB cap).

## History

- **2026-05-03 (Sprint 2.7):** Originally split out of BREWING.md SECTION 4 with a summary of 18 finalists/champions. Latent taxonomy at that point was 5 strategies + 4 modifiers (Immersion was a modifier).
- **2026-05-06 (v8.4):** Refreshed against the 102-recipe expansion. Latent taxonomy promoted Hybrid to a 6th first-class strategy (absorbing the Immersion modifier); the mapping table below reflects the v8.4 framework. Comprehensive 102-recipe data moved to [wbc-recipes.md](docs/skills/wbc-brewing-archivist/cluster/wbc-recipes.md); this doc stays lean.
- **2026-05-08 (v8.5):** Time Distribution / Role-Based Pulse half promoted from "consciously not pursuing" to a 4th canonical Axis 2 modifier (`role_based_pulse`) for percolation-only brews; the immersion case stays under Phase-Mapped Hybrid. Output Selection canonical enum gained a 4th form (`dilution`) for post-brew water addition. Section 4 of BREWING.md reframed from reference-only to actively-consulted in Step 1d. New cross-cutting control patterns doc layer added below (water strength / agitation taper / filter behavior / pre-brew conditioning / output selection extension), plus Practical Experiment Queue and Competition-to-Home Translation Rules — none of which promote to canonical modifiers, per Chris's "keep compact strategy set, add separate doc layer" framing. Latent taxonomy = 6 strategies + 4 modifiers.
- **2026-06-29 (2026 WBC drop):** Added the 52-routine 2026 set (46 Round One + 6 Finals; corpus 102 → 154), a new **Water Chemistry Systems** strategy family (9th family) with three subtypes (Ionic Pairing / Stage-Specific Mineral Profiling / Flavor-Highlight Water Design), and 11 new subtypes total (Water Chemistry's 3 + Pre-Brew Environmental Conditioning + Inert Bed Matrix Extraction + Pre-Brew Blend Synchronization + Sandwich Layer Extraction in Structural + Pour-Speed Profiling + Ratio-Staged Extraction in Time-Distributed + Vacuum-Assisted Bloom in Flow/Stability + High-Concentration Push in Extraction Push). Per Chris's decision, **Water Chemistry maps to the existing Water Strength cross-cutting playbook, NOT a new canonical modifier** — promotion deferred pending signal from the in-flight water experiment. Latent taxonomy unchanged at 6 strategies + 4 modifiers. 2026 winner: Nas Jaafar (Hybrid — resistance-managed percolation→immersion).

## Counting Note: family counts vs axis counts

Family counts describe the named primary strategy. Axis counts describe the underlying control logic. Time Distribution, Physical System, and (as of the 2026 drop) Water Chemistry are much larger as axes than as named strategy families because many Hybrid, Immersion, Structural, and Flow recipes rely on timing, physical setup, or mineral design as their *real* control mechanism while presenting under another family label. The Time-Distributed Systems count below (15) describes recipes where Time Distribution is the *named primary* axis; a larger share of the corpus uses Time Distribution as a *secondary* control logic supporting a Hybrid, Immersion, or Flow primary classification. The same split is now true for Water Chemistry: 2 recipes name it primary, but ~5 more 2026 routines use mineral design as a heavy secondary lever. Both figures are correct; the distinction matters when reasoning about which axes are truly under-served as foundational levers vs only under-served as named labels.

## Foundational Control Axes (5)

| **Axis**              | **Definition**                                | **Main Levers**                                          |
|-----------------------|-----------------------------------------------|----------------------------------------------------------|
| Extraction Intensity  | How much is extracted                         | grind, ratio, temp, water chemistry                      |
| Time Distribution     | When extraction happens                       | pours, pulse timing, immersion duration                  |
| Physical System       | Where/how extraction occurs in the bed        | geometry, layering, PSD, grind separation                |
| External Control      | Stabilizing or shaping the process externally | tools, flow devices, thermal handling                    |
| Output Selection      | Which parts of extraction are kept            | discarding early/late fractions, yield cutoff            |

Latent's live taxonomy maps onto axes 1 (intensity strategies), 4 (modifiers like Aroma Capture / Thermal Staging), and 5 (Output Selection modifier). Axis 2 (Time Distribution) is partially absorbed into Hybrid sub-forms; axis 3 (Physical System) is mostly blend-engineering and out of scope for single-origin home brewing.

## Core Strategy Families (9)

Distribution across the 154-recipe archive (2022-2026) — the relative weight has shifted since the original 18-recipe summary; the 2026 drop added the Water Chemistry Systems family:

| **Family**                            | **Count** | **Definition**                                                                                                  | **Latent Mapping (post-v8.4)**                                                                                          |
|---------------------------------------|-----------|------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| **Hybrid Systems**                    | 27 (largest single family) | Combine percolation and immersion in distinct phases to assign different extraction roles.            | **Strategy: Hybrid (v8.4)**. Sub-form picks one of: Sequential / Phase-Mapped / Selective Bloom / Intensity-Clarity Split / Temperature-Staged. 2026 winner (Nas Jaafar) is a Hybrid. |
| **Flow / Stability Systems**          | 20        | Stabilize flow and reduce variability to enable controlled extraction (Melodrip, needling, fast filters).        | Implicit: Melodrip is a primary tool inside Clarity-First and Extraction Push, not a separate slot. Filter-Mediated Flow noted as deliberate non-add (v8.4 changelog). 2026 added Vacuum-Assisted Bloom subtype. |
| **Thermal Systems**                   | 9         | Use temperature actively to shape extraction (staged, inverted, fluctuation, continuous blending, cooling-curve).| Modifier: Thermal Staging (renamed from "Inverted Temperature Staging" in Sub-sprint 4c, 2026-05-28; legacy name still accepted server-side; now covers both kettle thermal stance and active ramps). Modifier: Aroma Capture. v8.4 named consideration: Cooling-Curve Design. Hybrid (Temperature-Staged) sub-form when phase boundaries coincide with temp changes. |
| **Structural Systems** (sum of variants) | 54    | Engineer the inputs / physical bed / blend structure (layered bed, dual grind, blend ratio, roast-based, filter-mediated). | **Out of scope** for single-origin home brewing. Future-capture only. 2026 added 4 subtypes (Pre-Brew Environmental Conditioning / Inert Bed Matrix Extraction / Pre-Brew Blend Synchronization / Sandwich Layer Extraction). |
| **Suppression Systems**               | 6         | Intentionally limit extraction intensity to avoid harshness while maintaining structure.                         | Strategy: Suppression.                                                                                                   |
| **Time-Distributed Systems**          | 15 (Pulse / Role-Based / Parametric / Pour-Speed / Ratio-Staged / Double Bloom / Drain-Based) | Shape extraction by controlling when extraction happens (pulse, role-based, parametric, double bloom, drain-based, pour-speed, ratio-staged). | **Modifier: Role-Based Pulse (v8.5, percolation-only)**. Phase-Mapped Hybrid covers the immersion case. Drain-Based Pulse is implicit in SWORKS valve work. Other time-distribution patterns (fixed pulse / double bloom / short-long-short / 2026 pour-speed profiling / ratio-staged) live in the **Cross-Cutting Control Patterns § Time Distribution Practical Playbook** below — doc-layer reference, not canonical modifiers. Time Distribution as a foundational *axis* remains a deliberate non-add (v8.4 changelog, partially revisited v8.5). |
| **Immersion Systems** (standalone)    | 9         | Use full immersion or staged immersion alone (no percolation phase).                                             | **Strategy: Hybrid (Sequential)** when there's any drawdown phase. Pure full-immersion (Switch closed throughout) is a degenerate Sequential. |
| **Extraction Push (High-Yield Clarity)** | 9      | Maximize extraction yield while preserving clarity (Wölfl, Tran, Giachgia).                                       | Strategy: Extraction Push. 2026 added High-Concentration Push subtype (concentration as the target, not just yield). |
| **Output Selection Systems** (standalone) | 3     | Selective output extraction / bloom fraction separation / yield cutoff (when this IS the primary strategy).      | Modifier: Output Selection (one of three forms: early_cut / late_cut / both). Selective Bloom Hybrid when bloom-separation is the structural intent. |
| **Water Chemistry Systems** (NEW 2026) | 2 primary (~7 incl. secondary) | Use mineral composition as a primary brewing control system — not a background variable — to shape flavor direction, acidity, sweetness, aroma, texture, finish, and extraction behavior. Subtypes: Ionic Pairing / Stage-Specific Mineral Profiling / Flavor-Highlight Water Design. | **Doc-layer: maps to Cross-Cutting Control Patterns § Water Strength** (enriched below). **NOT promoted to a canonical modifier** (Chris, 2026-06-29) — track ppm/ion choices in `strategy_notes`; revisit promotion after the in-flight water experiment. Representatives: Esther Kim, Andrew Delgado (primary); Carlos Juarez, Simon Gautherin, Angie Molina, Rasmus Madsen, Martin Guayasamin (secondary). |

The expansion to 154 recipes shifted relative weights significantly from the 18-recipe set: Structural is the largest grouped cluster, Hybrid the largest single named family, and Time-Distributed Systems showed up as the primary or secondary axis on a large share of recipes — under-served as a strategic axis in Latent's framework. The 2026 drop established **Water Chemistry Systems** as its own family: like Time-Distributed, it is much larger as an underlying *control logic* (a secondary lever on ~5 more 2026 routines) than as a *named primary* family (2 routines). See v8.4 changelog in BREWING.md § SECTION 5 for the deliberate non-add reasoning on Time Distribution; the same "keep the compact strategy set, add a doc layer" reasoning governs the Water Chemistry non-promotion.

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

## Cross-Cutting Control Patterns (v8.5 doc layer)

These are control axes that show up repeatedly across the 154-recipe corpus *underneath* whatever family/strategy a recipe is officially classified under. Per Chris's review (2026-05-08), they deliberately stay in this doc as a **reference / playbook layer** rather than promoting to canonical Axis 2 modifiers in `lib/extraction-modifiers.ts`. Strategy / modifier set stays at **6 strategies + 4 modifiers**; cross-cutting moves persist via free-text `strategy_notes` on the brew row when relevant. Pull this section during Step 1d when reaching for a calibration-axis move.

### Time Distribution Practical Playbook (5 templates)

Time Distribution as an under-served foundational axis (v8.4 deliberate non-add, partially revisited v8.5 with Role-Based Pulse). The Role-Based Pulse modifier covers the percolation-only sub-case; the rest of these templates are recipe shapes worth considering during Step 2 / Step 3 even when the modifier isn't selected.

| **Template**           | **When to use**                                              | **Home experiment**                                                            |
|------------------------|--------------------------------------------------------------|--------------------------------------------------------------------------------|
| **Fixed pulse**        | Need repeatability and sweetness                             | 5 × 50g pulses every 30s vs a 3-pour recipe of equal total weight              |
| **Role-based pulse**   | Each pour has an explicit sensory job                        | Pour 1 = acidity / saturation, Pour 2 = sweetness / body, Pour 3 = clarity / finish (canonical: `role_based_pulse` modifier on percolation-only brewers; Phase-Mapped Hybrid sub-form on Switch / SWORKS) |
| **Drain-based pulse**  | Flow rate varies coffee to coffee                            | Start the next pour only after the bed is mostly exposed (already implicit in SWORKS valve work) |
| **Double bloom**       | Fast filter / brewer is under-saturating                     | 30g bloom, 30g second bloom, then main pour to target                          |
| **Short-long-short**   | Need early extraction + clean finish                         | 40g / 120g / 80g timing split with the long middle pour doing the extraction work |

### Water Strength / Water Chemistry (home of the 2026 Water Chemistry Systems family)

The recipe data suggests water mineral content is a meaningful control layer on its own — not just a consequence of the strategy choice. **Higher mineral water (110-160 ppm)** often supports Extraction Push, body-building, and sweetness lifts; **lower mineral water (20-70 ppm)** often appears in delicate / thermal / suppression / high-aromatic recipes. Some competitors use *staged* water (different ppm at different pours). This is not promoted to a canonical modifier — instead, treat it as a brew variable to track and surface in `strategy_notes` when the ppm/ion choice is doing strategic work.

Practical heuristic: if Clarity-First is reading thin, try +30-40 ppm before going finer or hotter. If Full Expression is reading harsh on a co-ferment, try -30 ppm before backing off temp or grind.

**2026 escalation — the WBC Water Chemistry Systems family lands here.** The 2026 field moved water from "total hardness / ppm" to *which ions, paired how, introduced when, aimed at what*. This is the doc-layer home for that family (Chris's 2026-06-29 decision: keep the compact strategy set, do NOT add a canonical modifier yet — revisit after the in-flight water experiment). The three subtypes, beyond simple ppm:

- **Ionic Pairing** — specific cation–anion pairings (not just ppm/hardness) shape a *specific flavor direction*. Carlos Juarez 2026: calcium carbonate / magnesium chloride / potassium citrate, with carbonate/chloride/citrate framed as keys to florality and sweetness. Use when normal Ca/Mg/K tuning changes intensity but not the direction you want. *Anions may matter as much as cations.*
- **Stage-Specific Mineral Profiling** — different mineral profiles across brew phases, assigning ions extraction roles (e.g. Mg early for acidity/aromatics, Ca late for sweetness/body). Esther Kim 2026: 91°C Mg-dominant bloom then 86°C Ca-dominant late pour. The lever is *when* each profile is introduced (vs Ionic Pairing's *which* pairing).
- **Flavor-Highlight Water Design** — a deliberate formula tuned to emphasize selected sensory targets (citrus / peach / florals / sweetness / round mouthfeel), water-as-seasoning. Andrew Delgado 2026: 50 CaCl / 10 MgCl / 10 MgSO4 / 10 silica on a deliberately simple immersion; Simon Gautherin 2026: MgSO4 (citrus) / KCl (peach) / silica (texture). Use when the coffee has the notes but they don't appear in the intended order/intensity.

Home heuristic for the water experiment: hold the recipe constant and ladder ONE lever at a time — first total ppm (~50 / ~90 / ~120), then Mg:Ca ratio (e.g. 1:1 vs 2.5:1 vs 3:2), then a single anion swap (sulfate vs chloride) — scoring acidity direction / sweetness / body / florality separately. Promotion to a canonical modifier is the decision to make *after* this ladder produces a repeatable, legible signal, not before.

### Agitation Taper

A lot of WBC recipes are not simply "low agitation" — they use **higher agitation early, lower agitation late** (saturation and sweetness development followed by finish-clarity protection). This maps cleanly onto Chris's clarity preference. Taper pattern:

- **Bloom** — normal saturation
- **Main pour 1** — moderate agitation, center-to-spiral
- **Main pour 2** — lower agitation, slower flow
- **Final pour** — Melodrip / center pour / low turbulence

Structurally this is one shape of **Role-Based Pulse** where the per-pour role differentiation lives on the agitation axis. When Agitation Taper is the recipe-defining move, populate the canonical `role_based_pulse` modifier with `roles` describing the taper rather than treating "agitation taper" as a separate concept. Documented separately here only because it's a distinct mental frame.

### Filter Behavior (not only flow speed)

Filter-Mediated Flow stays a deliberate non-add as a foundational *axis* (v8.4 reasoning preserved), but the underlying data suggests treating filter choice as more than a fast/slow lever. Distinguish:

- **Filter speed** — drawdown rate
- **Filter behavior** — sediment retention, oils / lipids retention, contact points, bypass behavior, permeability shift through the brew, saturation behavior

The WBC dataset includes silk filters, hydrophobic PE/PP nonwoven filters, fast Sibarist papers, hybrid filter shapes, and metal mesh support. Most aren't sourceable for home use; the actionable move is to test the papers Chris already owns as a *texture and extraction-shape variable*, not just a fast/slow choice. Suggested protocol: same coffee + brewer + grind across **Sibarist FAST / Cafec T-92 / Abaca+ / April or Kalita-style flat paper**, scoring **attack clarity / mid-palate sweetness / tactile body / finish dryness / cooling behavior** separately rather than collapsing into a single "good/bad" judgement.

### Pre-Brew Conditioning

Input preparation before brewing — humidity control before grinding or service, nitrogen-flushed storage, cold / cryogenic grinding, pre-ground rest, post-grind shaking / homogenization, roast/rest timing as extraction setup. Mostly competition stagecraft; future-capture for most cases. Two priority experiments worth running at home:

- **Post-grind homogenization** — shake EG-1 / Bird grounds in a sealed container before pouring; controls fines migration and coarse-cluster distribution. Worth testing when cup-to-cup variance on the same recipe is high.
- **Pre-ground rest 10-30 minutes** — for very aromatic, high-CO2 coffees where fresh grinding gives volatility but uneven extraction. Lets CO2 dissipate before water hits the bed; reduces channeling.

Other pre-brew patterns (humidity / nitrogen storage / cold grinding) are deferred — sourcing cost and repeatability friction outweigh expected signal.

### Output Selection (extended)

Latent's canonical `output_selection` modifier covers four forms post-v8.5: `early_cut` / `late_cut` / `both` / `dilution`. The WBC corpus uses a broader nomenclature; this table maps the corpus terminology onto the canonical forms.

| **Output move**       | **What it solves**                                  | **Simple test**                                  | **Latent canonical**                                                |
|-----------------------|------------------------------------------------------|--------------------------------------------------|---------------------------------------------------------------------|
| **Front cut**         | Salty / sour / under-developed early liquid          | Discard first 5g / 10g                           | `output_selection` form=`early_cut`                                  |
| **Back cut**          | Dry / bitter / papery tail                           | Stop at 220g instead of 240g                     | `output_selection` form=`late_cut`                                   |
| **Bloom separation**  | Bloom is useful or harmful as its own fraction       | Keep bloom separate; taste both, then recombine or discard | **Hybrid (Selective Bloom) sub-form** — structurally a strategy, not a modifier (Eline Ferket 2025 pattern) |
| **Post-brew dilution**| Extraction is good but concentration / body is too heavy | Add 5-15g water after brew                       | `output_selection` form=`dilution` (v8.5), `dilution_g` populated   |
| **Both cut**          | Middle extraction band is best                       | Discard first 5g + stop 10g early                | `output_selection` form=`both`                                       |

Front cut / back cut are *nomenclature aliases* of the existing canonical forms — not renamed, just documented. Bloom separation explicitly does NOT collapse into a form on `output_selection` because the architectural split between "I kept a fraction" (modifier) and "I assigned the bloom liquid a separate sensory role" (Hybrid sub-form) is real — bloom separation as strategy means the bloom fraction *participates differently* in the cup design, not just that it was discarded.

## Practical Experiment Queue (v8.5)

Per Chris's review, the WBC corpus suggests a tiered experiment queue. Tier 1 = test now; Tier 2 = future-capture; Tier 3 = consciously ignore (see Consciously not pursuing below for the long-form list).

### Tier 1 — test now (high signal, low effort)

| **Experiment**          | **Why it matters**                                                              | **Suggested setup**                                                                |
|-------------------------|---------------------------------------------------------------------------------|------------------------------------------------------------------------------------|
| Double bloom on fast papers | WBC uses it to restore saturation without long brew time                  | 15g coffee, 30g bloom, 30g second bloom, then pour to 240g                         |
| Output cut test         | Very high signal, low effort                                                    | Brew to 250g, collect last 20-30g separately, taste main vs tail                   |
| Post-brew dilution      | Useful for intense naturals / anaerobics — canonical via `output_selection` form=`dilution` | Brew at 1:14.5, then add 5g / 10g / 15g water; A/B against straight cup       |
| Agitation taper         | Likely aligns with high-clarity fruit-tea preference — canonical via `role_based_pulse` with roles describing the taper | Energetic early pour, Melodrip or gentle center final pour                  |
| Water strength ladder   | Dataset suggests ppm is strategic                                               | Same recipe at ~50, ~90, ~120 ppm                                                  |
| Filter behavior test    | Enough papers owned to make the test useful                                     | Same recipe across Sibarist FAST / Cafec T-92 / Abaca+ / April-Kalita paper        |
| Pre-ground rest         | Odd but worth testing                                                           | Fresh grind vs 10 min vs 30 min rest before brewing                                |

### Tier 2 — future-capture (interesting but lower priority)

- **Mid-pour temperature blending** — too much workflow complexity. Parked correctly per Consciously not pursuing.
- **Roast-based structuring** — only useful for the self-roast track, not normal purchased single-origin brewing.
- **Layered bed by component** — mostly blend stagecraft.
- **Dual chamber / wet-blended extraction** — overbuilt unless blend design becomes a focus.
- **Silk / hydrophobic filter materials** — interesting, but sourcing and repeatability friction is annoying.

### Tier 3 — consciously ignore

See **Consciously not pursuing** below for the long-form list with reasons.

## Competition-to-Home Translation Rules

When a WBC technique is interesting and the question is "should I import this?", three rules:

1. **If it's blend-specific, do not import directly.** Layered bed, dual-chamber, wet-blended extraction, solubility alignment via roast matching — all blend stagecraft with no single-origin transfer.
2. **If it changes timing, water, filter, agitation, or output fraction, test as a single-variable home experiment.** These are exactly the cross-cutting axes covered above. Pick one variable, hold the rest constant.
3. **If it requires new hardware, only add after repeated need appears.** Don't buy on a single intriguing recipe; wait until the same hardware shows up across 3+ experiments worth running.

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
- **Time Distribution as a foundational axis** (v8.4 deliberate non-add, partially revisited in v8.5). The Drain-Based Pulse half is still descriptive-only (already happening on SWORKS). The Role-Based Pulse half was promoted in v8.5 to a 4th canonical Axis 2 modifier (`role_based_pulse`) for percolation-only brewers; the immersion case remains covered by the Phase-Mapped Hybrid sub-form. Time Distribution as a foundational *axis* is still a deliberate non-add — the modifier captures the percolation-only sub-case discretely, and the Cross-Cutting Control Patterns playbook above covers the rest at the doc layer.
- **Filter-Mediated Flow as a foundational axis** (v8.4 deliberate non-add, sharpened in v8.5). Filter material as an active strategic variable beyond flow speed remains a non-add as a foundational axis. But the **Filter Behavior** entry in Cross-Cutting Control Patterns above sharpens the practical guidance: filter is a *texture and extraction-shape variable*, not only a fast/slow lever. Track during brews; surface in `strategy_notes` when filter choice is doing strategic work; only revisit promotion to canonical if an Extraction Push or similar experiment treats filter as the *primary* strategic variable.
