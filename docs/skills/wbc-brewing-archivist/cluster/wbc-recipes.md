# WBC Recipes — 154-Recipe Archive (2022-2026)

Comprehensive reference archive of World Brewers Cup recipes. Sourced from Chris's "World Brewers Cup Champion - Recipes and Extraction Taxonomy" research, expanded from the original 18-recipe summary (2023-2025 finalists/champions only) to the full 154-recipe set covering 2022-2026. The 2026 drop added 52 routines (46 Round One + 6 Finals; Nas Jaafar 1st, Simon Gautherin 2nd, Bavis Kwong 3rd, Jackie Tran 4th, Ethan Park 5th, Angie Molina 6th appear in both rounds), a new **Water Chemistry Systems** strategy family, and 11 new subtypes.

For Latent's mapping of WBC families/subtypes onto its own 6-strategy / 3-modifier framework (post-v8.4), see **[wbc-reference.md](docs/skills/wbc-brewing-archivist/cluster/wbc-reference.md)**. This document is the deep archive — competitor-by-competitor recipes grouped by strategy family, plus the full subtype definitions table.

**This is reference material, not a canonical registry.** Latent does not validate recipes against this archive. Use it for "what was the WBC competitor doing?" lookups during a brief, when re-framing an existing reference recipe under a new strategy classification, or when scoping a deliberate new experiment ("which 2025 finalists used Selective Bloom Hybrid?").

**Both this doc and wbc-reference.md are surfaced via MCP `list_docs` / `read_doc`** — claude.ai brewing sessions can pull them on demand, the same way they pull `BREWING.md` or any taxonomy doc.

## Strategy distribution across the 154 recipes (2022-2026)

| Family | Count | Notes |
|--------|-------|-------|
| Structural Systems (sum of sub-variants) | 54 | Largest if grouped — almost entirely blends. Out of scope for Latent's single-origin context. 2026 added 21 (incl. 2 new subtypes Pre-Brew Environmental Conditioning + Inert Bed Matrix Extraction, plus 2 promoted from review: Pre-Brew Blend Synchronization + Sandwich Layer Extraction). |
| Hybrid Systems | 27 | Picked up dramatically from 2025 on — Hario Switch / valve brewers dominant. Nas Jaafar's 2026 winning routine is a Hybrid (percolation→immersion resistance control). |
| Flow / Stability Systems | 20 | Melodrip + flow-control tools. Wölfl 2024 1st place is the canonical Extraction-Push-via-Flow-Stability recipe. 2026 added Vacuum-Assisted Bloom (Lakis Psomas) as a new subtype. |
| Time-Distributed Systems | 15 | Pulse / Role-Based / Parametric / Double Bloom / Drain-Based. 2026 added Pour-Speed Profiling (3 routines) + Ratio-Staged Extraction as new subtypes. Under-served as a foundational axis in Latent's framework (deliberate non-add per v8.4 changelog). |
| Thermal Systems | 9 | Inverted, staged, continuous blending, cooling-curve. Herber Huamani 2026 (C-Bloom marble cooling) is the latest Cooling-Curve example. |
| Immersion Systems (standalone) | 9 | Pure full-immersion or staged-immersion-only. In Latent's framework these become Hybrid (Sequential) — pure full-immersion is a degenerate Sequential. |
| Extraction Push (High-Yield Clarity) | 9 | Wölfl, Tran, Giachgia, Sabino, Inocencio, Reyes. 2026 added High-Concentration Push (Paprik Liu, 1:10 / 1.9 TDS) as a new subtype. Latent's Extraction Push strategy is named after this family. |
| Suppression Systems | 6 | Carlos Medina 2023 1st place is the canonical Suppression recipe (CGLE Sidra, 91°C, 5x50g pulses). No 2026 additions. |
| Output Selection (standalone) | 3 | Carlos Escobar 2025 3rd place + Simon Gautherin 2026 (Round One + Finals 2nd: front-cut + exact-yield + water seasoning). |
| Water Chemistry Systems (NEW 2026) | 2 | Esther Kim + Andrew Delgado are the primary-tagged routines; water chemistry is a *secondary* lever on ~5 more 2026 routines (Carlos Juarez, Simon Gautherin, Angie Molina, Rasmus Madsen, Martin Guayasamin). New family from the 2026 drop. |

The expansion to 154 recipes shifted relative weights from the original 18-recipe set: Structural is the largest grouped cluster, Hybrid the largest single named family, and Time-Distributed Systems showed up as the primary or secondary axis on a large share of recipes. The 2026 drop established Water Chemistry as its own family (water designed as a primary recipe lever, not a background variable) and added Pour-Speed Profiling as a repeated time-distribution subtype.

## Strategically important findings (from the expansion)

1. **Hybrid is the dominant 2025 pattern.** 13 of 18 Hybrid recipes are from 2025; almost all on the Hario Switch or April Hybrid. Drove the v8.4 promotion of Hybrid to a 6th first-class strategy in BREWING.md. The Switch is having a moment in competition — that's not the same as it being right for every coffee, but it is enough signal that Hybrid deserves first-class status in Latent's framework.

2. **Phase-Mapped Hybrid is structurally different from pour-structure thinking.** Justin Bull 2025 (US Brewers Cup 1st) is the canonical Phase-Mapped recipe — percolation phase highlights acidity, immersion phase builds sweetness/body, with explicit per-phase sensory targets. This is closer to Role-Based Pulse than to Sequential Hybrid — see Time-Distributed family below.

3. **Drain-Based Pulse is what the SWORKS valve work already IS.** Daniel Horbat 2024 (CGLE 17 on OREA V4 open-base) — pours triggered by drawdown state, not fixed clock intervals. Chris's SWORKS valve transitions are Drain-Based Pulse pattern; the strategic decision is currently invisible because we describe it as "valve state per pour" rather than "drain-triggered pulse strategy." Naming it doesn't change behavior — it changes legibility for fresh readers (or future Claude sessions).

4. **Selective Bloom Hybrid** (Eline Ferket 2025) — bloom liquid separated from main brew, evaluated independently. Bridges Hybrid + Output Selection. Latent's `selective_bloom` sub-form is named after this pattern.

5. **Cooling-Curve Design** (Aga Rojewska 2024, Dongmin Kim 2024, Kittanai Kongtanarak 2025) — design the brew, service, and wait time around the temperature window where the cup peaks. Latent already does this implicitly across El Paraíso / Garrido / anaerobic naturals — v8.4 added it as a Step-1d named consideration on the brief side and a free-text `cooling_curve_target` column on the brew row.

6. **Time Distribution as an under-served axis.** A large share of recipes use Time Distribution as the primary axis, but Latent's framework currently absorbs the immersion-based ones into Hybrid sub-forms and treats the rest as implicit pour structure. Reconsider if a queued experiment treats time-distribution-without-immersion as the primary lever. See v8.4 changelog deliberate non-add reasoning.

### From the 2026 expansion (52 routines)

7. **Water Chemistry became a primary strategy, not a background variable.** Across 2026, mineral design was the *named primary* lever for Esther Kim (stage-specific Mg-early / Ca-late profiling) and Andrew Delgado (highly targeted CaCl/MgCl/MgSO4/silica formula on a deliberately simple immersion), and a heavy *secondary* lever for Carlos Juarez (ionic pairing — carbonate/chloride/citrate), Simon Gautherin (MgSO4/KCl/silica seasoning), Angie Molina, Rasmus Madsen, and Martin Guayasamin. Enough signal to promote **Water Chemistry Systems** to its own family with three subtypes (Ionic Pairing / Stage-Specific Mineral Profiling / Flavor-Highlight Water Design). Latent maps this to the existing **Water Strength** cross-cutting playbook rather than a new canonical modifier — see wbc-reference.md. Timely for Chris's big water experiment.

8. **Pour-Speed Profiling is now a repeated, trackable subtype.** Measured pour flow rate (g/s or seconds-per-pour) as the defining variable — slow-slow-fast or slow-then-fast — showed up as the primary axis for Bene Sanchez, Yuta Chu (9s/8s/6s), and Sofia Luttrell (slow high-temp then fast low-temp). Distinct from Role-Based Pulse: the lever is measured speed, not the sensory job of each pour. New Time-Distributed subtype.

9. **Sandwich Layer Extraction validated by a finalist.** Bavis Kwong reached the finals (3rd) with an intermediate filter paper separating a fines layer (bottom) from a coarse layer (top), giving each its own extraction mode in one brew. Distinct from Layered Bed Extraction because a physical separator changes flow/contact between layers. New Structural subtype.

10. **High-Concentration Push as its own target.** Paprik Liu built an entire recipe (1:10 ratio, 1.9 TDS, no-bypass brewer, 200 ppm hardness, two-way agitation) around concentration as the design target — not just yield. Distinct from Clean Coffee High-Yield Push. New Extraction Push subtype.

11. **Pre-brew conditioning split into three distinct moves.** 2026 separated the bed/grounds-prep family into: Pre-Brew Environmental Conditioning (Ong Shen Choy's water-jacket vapor chamber — conditioning the *brewer environment*), Pre-Brew Blend Synchronization (Wataru Iidaka's 24h sealed-can blend rest — harmonizing components *before grinding*), and Inert Bed Matrix Extraction (Ibrahim Al Mallouhi's glass-ball bed — decoupling grind fineness from hydraulic resistance). All three are blend/stagecraft-leaning and stay out of scope for single-origin home brewing, but they are now distinct subtypes in the archive.

12. **The 2026 field was overwhelmingly Gesha-and-blend.** Nearly every routine is a Gesha (washed, natural, anaerobic, yeast-inoculated, spring-water-submerged) or a multi-component blend; the few exceptions (Jake Mummery Sidra, Manuel Molina Pacamara, Rasmus Madsen's climate-research F1 hybrid) stand out. The competition-vs-home translation rules in wbc-reference.md apply harder than ever: most 2026 innovation is in blend stagecraft and bespoke hardware, not single-origin-transferable levers.

## Subtype Definitions (65 subtypes across 10 families)

Source: WBC Subtype Definitions sheet. Each subtype has a definition, an experiment-use heuristic ("when to test it"), and a boundary note ("how it differs from adjacent subtypes — when NOT to classify here"). The 2026 drop added 11 subtypes (Water Chemistry's 3 + Pre-Brew Environmental Conditioning + Inert Bed Matrix Extraction + Pre-Brew Blend Synchronization + Sandwich Layer Extraction in Structural + Pour-Speed Profiling + Ratio-Staged Extraction in Time-Distributed + Vacuum-Assisted Bloom in Flow/Stability + High-Concentration Push in Extraction Push) and the new Water Chemistry Systems family.


### Hybrid Systems

| Subtype | Definition | Experiment Use | Boundary Note |
|---------|-----------|---------------|---------------|
| **Sequential Hybrid** | Use percolation and immersion in a fixed sequence to assign different extraction roles. | Test when you want one phase to build clarity and another to build body or sweetness. | Generic parent subtype; use a more specific hybrid subtype when the role pattern is clear. |
| **Immersion Staging** | Use valve-controlled immersion phases inside a hybrid brew to build texture, sweetness, or integration. | Test when a Switch-style recipe needs more body than percolation but more clarity than full immersion. | Similar to Staged Immersion, but includes percolation or valve-release behavior. |
| **Parametric Hybrid** | Use variable timing, temperature, valve state, flow, or phase ratios as a coordinated control system. | Test when a coffee needs multiple controlled levers to balance acidity, sweetness, body, and finish. | Use only when the system is explicitly multi-variable; otherwise choose the dominant hybrid subtype. |
| **Phase-Mapped Hybrid** | Assign each extraction phase a specific sensory target, such as acidity, sweetness, body, or finish. | Test when you want to tune one sensory dimension without changing the whole recipe. | Closest to Role-Based Pulse, but uses both immersion and percolation modes. |
| **Selective Bloom Hybrid** | Extract an early bloom fraction separately, then continue brewing to build the remaining cup independently. | Test when early acidity or aroma is valuable but becomes diluted, muddied, or over-integrated in the full brew. | Bridge between Hybrid and Output Selection; bloom separation is the defining move. |
| **Intensity-Clarity Split** | Use immersion to build tactile intensity, then percolation to restore clarity and aromatic definition. | Test when a coffee tastes either rich but muddy or clear but thin, depending on the recipe. | Phase order matters: intensity first, clarity second. |
| **Alternating Phase Control** | Alternate immersion, low-agitation percolation, and balancing pours to manage extraction roles across the brew. | Test when a single transition is too simple and the coffee needs multiple corrections across the curve. | More complex than Sequential Hybrid; use when phases switch roles more than once. |
| **Temperature-Staged Hybrid** | Combine valve-controlled phase changes with different water temperatures to shape extraction and perception. | Test when phase control alone works, but one phase still feels too sharp, flat, heavy, or thin. | Parent label for hybrid recipes where temperature supports phase design; includes low-high, high-low, and low-high-low Switch patterns. |
| **Temperature-Sandwich Hybrid** | Use low-high-low temperature phases to separately shape sweetness, acidity, and texture. | Test when you need a gentle start, strong middle extraction, and soft finish in one brew. | A specific staged hybrid pattern; keep as a sub-subtype if you want fewer canonical labels. |

### Flow / Stability Systems

| Subtype | Definition | Experiment Use | Boundary Note |
|---------|-----------|---------------|---------------|
| **Geometry-Stabilized Flow** | Use brewer geometry to shape contact time, bed behavior, and drawdown consistency. | Test when a coffee needs more sweetness/contact or cleaner flow without changing grind dramatically. | Brewer shape is the main stabilizer; tools may support but do not define the method. |
| **Low-Temperature Flow Control** | Use fast-flow hardware, stable geometry, or low-bypass design to make low-temperature extraction complete enough without harshness. | Test on delicate naturals, CM coffees, or processed Geshas that get harsh at normal temperatures. | Classify here only when the hardware/flow system makes the low-temperature recipe work; otherwise use Low-Temperature Suppression. |
| **Low-Bypass / Low-Turbulence Extraction** | Reduce bypass and turbulence to create cleaner, sweeter extraction with less roughness. | Test when the cup has clarity potential but agitation or bypass creates unevenness, dryness, or muddiness. | Primary aim is clean controlled flow, not maximum yield. |
| **Tool-Stabilized Flow** | Use Melodrip, Drip Assist, shower screens, boosters, or other tools to standardize water delivery or flow behavior. | Test when hand-pouring variability or water impact creates inconsistent texture, finish, or aromatics. | Use Aroma / Volatile Capture when the tool’s main purpose is volatile preservation rather than water delivery or drawdown stability. |
| **Distribution-Controlled Flow** | Use needling, shaking, clump removal, fines management, or bed prep to control saturation and drawdown. | Test when channels, clumps, fines migration, or uneven saturation cause harshness or weak sweetness. | Pre-brew bed prep overlaps Structural, but classify here when the goal is flow stability. |
| **Fast-Filter Flow Control** | Use fast filters to allow finer grind, higher extraction, or shorter contact time while preserving clarity. | Test when a standard filter chokes, dulls acidity, or makes a pushed recipe too heavy. | Speed is the filter’s main role; if filter material behavior is active or selective, use Filter-Mediated Flow. |
| **Aroma / Volatile Capture** | Use chilling, lids, covered vessels, aroma-retention geometry, or humidified service to preserve and concentrate volatile aromatics. | Test when dry/wet aroma is excellent but the brewed cup loses florality, fruit top-notes, or aromatic lift. | Classify here when the main intervention preserves aroma after or during extraction; classify under Thermal Fluctuation when temperature shifts are the main extraction-control lever. |
| **Vacuum-Assisted Bloom** (2026) | Use negative pressure during bloom to improve saturation, accelerate CO2 release, and prepare the bed for more even extraction. | Test when fresh or dense coffees resist wetting, bloom unevenly, or require long blooms that dull aromatics. | Keep candidate unless repeated; if vacuum is mainly used for aroma preservation rather than bed prep, classify under Aroma / Volatile Capture. (Lakis Psomas 2026 — Acaia vacuum lid on a 55°C immersion bloom.) |

### Thermal Systems (Temperature as Primary Lever)

| Subtype | Definition | Experiment Use | Boundary Note |
|---------|-----------|---------------|---------------|
| **Staged Temperature** | Use different temperatures across brew stages to separately target aromatics, acidity, sweetness, body, or finish. | Test when one flat temperature gives good attack but poor body, or good sweetness but muted florals. | Temperature is the primary variable; if valve phases dominate, use Hybrid temperature subtypes. |
| **Inverted Temperature** | Start cooler or hotter than expected, then move in the opposite direction to reshape extraction sequence. | Test when normal hot-first brewing over-extracts early or cool-first brewing better protects aromatics/acidity. | A specific staged pattern; usually low-high or high-low with intentional sensory sequencing. |
| **Thermal Fluctuation** | Use sharp temperature shifts, sometimes with aroma-locking tools, to open flavor early while preventing late-stage harshness. | Test when a coffee needs high extraction for aromatics but develops bitterness, dryness, or fermentation heaviness late. | More abrupt and corrective than general staged temperature; includes Paragon-style aroma preservation when temperature is central. |
| **Continuous Temperature Blending** | Blend hot and cooler water during brewing to create a moving or moderated slurry temperature. | Test when discrete kettle changes are too blunt and you want smoother thermal transitions. | Temperature changes continuously, not in clean stage breaks. |
| **Cooling-Curve Design** | Design the brew, service, or wait time around the temperature window where the cup peaks. | Test when a coffee tastes best warm/cool and hot evaluation hides the target profile. | This governs perception and service timing, not only extraction temperature. |

### Suppression Systems (Controlled Extraction)

| Subtype | Definition | Experiment Use | Boundary Note |
|---------|-----------|---------------|---------------|
| **Low-Temperature Suppression** | Use lower brew temperature to reduce bitterness, booziness, harsh acidity, or fermentation heaviness while preserving sweetness. | Test on naturals, anaerobics, co-ferments, or darker-leaning roasts that get muddy or sharp at normal temps. | Temperature is the main restraint lever; if brewer geometry/tooling dominates, classify under Flow / Stability. |
| **Coarse-Grind Suppression** | Use a coarser grind to reduce extraction intensity and preserve clarity in coffees that become heavy or drying. | Test when a coffee has good aroma but tastes muddy, drying, or overly extracted at normal grind. | Best when temp is already reasonable; if the whole recipe is low-temp and low-agitation, use broader Suppression. |
| **Low-Agitation Suppression** | Use gentle pours, limited swirling, and minimal bed disturbance to avoid extracting harsh or muddy compounds. | Test when turbulence makes the finish rough, drying, or ferment-heavy. | Different from Flow / Stability: this is about restraint, not repeatability or enabling a push. |
| **Natural / Co-Ferment Suppression** | Use lower extraction intensity to clean up expressive naturals, co-ferments, and infused or fermentation-heavy coffees. | Test when the cup has strong fruit but risks boozy, perfumed, salty, bitter, or artificial edges. | Process-specific subtype; choose this when coffee type, not a single variable, drives the strategy. |

### Time-Distributed Systems

| Subtype | Definition | Experiment Use | Boundary Note |
|---------|-----------|---------------|---------------|
| **Pulse System** | Use repeated pours at fixed intervals to distribute extraction evenly and build sweetness, clarity, and structure. | Test when you want repeatability and a predictable extraction curve without complex phase changes. | Different from Role-Based Pulse: pours are mainly interval-driven, not assigned separate sensory jobs. |
| **Role-Based Pulse System** | Use pours with assigned sensory roles, such as saturation, acidity, sweetness, strength, or finish. | Test when one sensory dimension needs adjustment without redesigning the entire recipe. | Each pour has a job; closer to phase mapping, but still percolation-only unless immersion is used. |
| **Parametric Time System** | Use programmed timing, ratios, or variable stages to tune specific extraction outcomes across the brew. | Test when the coffee needs fine-grained control over balance, intensity, or cooling behavior. | More complex than pulse systems; best when timing logic is explicitly part of the concept. |
| **Double Bloom System** | Use two small blooms for full saturation, then one large final pour for complete extraction in fast-flow systems. | Test on fast brewers or high-intensity coffees where one bloom under-saturates the bed but many pulses overcomplicate the brew. | Distinct from normal pulse systems: saturation is separated from final extraction. |
| **Drain-Based Pulse System** | Use pours triggered by drawdown state rather than fixed clock intervals to control concentration and contact time. | Test when flow varies between coffees and fixed timing produces inconsistent extraction. | Different from fixed Pulse System: the bed/drain state determines timing. |
| **Pour-Speed Profiling** (2026) | Use deliberately different pour flow rates or pour durations across stages to control contact time, extraction focus, and sensory emphasis. | Test when changing pour timing or volume alone is too blunt and you want to tune sweetness, vibrancy, cleanliness, or texture through flow rate. | Different from Role-Based Pulse: the defining variable is measured pour speed, not only the sensory job of each pour. (Bene Sanchez / Yuta Chu 9s-8s-6s / Sofia Luttrell 2026.) |
| **Ratio-Staged Extraction** (2026) | Use different stage-level brew ratios or water levels across pours to control extraction intensity, bypass, clarity, complexity, and body. | Test when standard pulse timing gives the right total ratio but the cup needs different intensity in early vs late phases. | Keep as candidate unless more routines use brew-ratio or water-level staging as the primary control; otherwise classify under Parametric Time System. (Inthat "Taotao" Ueasakaree 2026.) |

### Output Selection Systems

| Subtype | Definition | Experiment Use | Boundary Note |
|---------|-----------|---------------|---------------|
| **Selective Output Extraction** | Keep only the extraction fraction that tastes best, removing undesirable early or late portions. | Test when full-output brewing includes salty, bitter, dry, or muddy fractions that hurt the final cup. | Primary family when kept/removed liquid defines cup quality. |
| **Bloom Fraction Separation** | Separate the bloom liquid from the main brew to preserve or isolate early acidity, aromatics, or harshness. | Test when the bloom tastes useful alone or harmful when integrated into the full beverage. | Can appear as Hybrid secondary if the main brew is phase-based. |
| **Bypass / Post-Brew Dilution** | Add water after extraction to adjust strength, clarity, intensity, or over-extraction perception. | Test when extraction tastes good but concentration, body, or finish is too heavy. | Dilution changes beverage balance; it does not remove extracted compounds. |
| **Yield Cutoff** | Stop drawdown or beverage collection at a target yield to avoid late-stage bitterness, dryness, or dilution. | Test when the last part of the brew tastes papery, bitter, thin, or drying. | Different from Bypass: you stop collecting liquid rather than adding water. |
| **Front-Cut / Back-Cut Extraction** | Remove early or late extraction fractions to avoid defects while keeping the clean middle portion. | Test when early liquid is salty/sour or late liquid is bitter/dry, but the middle tastes balanced. | More surgical than general Selective Output; specify front-cut, back-cut, or both when known. |

### Immersion Systems (Blend Stabilization)

| Subtype | Definition | Experiment Use | Boundary Note |
|---------|-----------|---------------|---------------|
| **Staged Immersion** | Use multiple immersion phases to extract different sensory attributes over time. | Test when one long steep tastes flat but percolation alone lacks body or sweetness. | Immersion is the main extraction mode; if alternating with percolation, classify under Hybrid. |
| **Low-Agitation Immersion** | Use still or minimally disturbed steeping to build sweetness, body, and integration without roughness. | Test when a coffee has strong fruit potential but agitation makes the finish muddy, dry, or boozy. | Different from Low-Agitation Suppression: immersion is building integration, not merely reducing extraction. |
| **Immersion Equalization** | Use immersion to reduce extraction differences across blend components, grind fractions, or process types. | Test when a blend tastes disjointed, with one component dominating in attack or finish. | Best when integration matters more than flavor separation. |
| **Immersion Finish** | Use a final immersion phase after earlier extraction to round texture, sweetness, or aftertaste. | Test when percolation gives good clarity but the body, finish, or sweetness feels incomplete. | If the brew clearly alternates percolation and immersion phases, tag Hybrid as primary. |

### Extraction Push (High-Yield Clarity)

| Subtype | Definition | Experiment Use | Boundary Note |
|---------|-----------|---------------|---------------|
| **Clean Coffee High-Yield Push** | Use fine grind, fast filtration, and high/stable temperature to maximize extraction in clean coffees without losing clarity. | Test on washed or clean honey coffees when sweetness, florals, or acidity feel underdeveloped. | Best for clean inputs; if the coffee is process-heavy, use Processed Natural Intensity Push or Suppression instead. |
| **Processed Natural Intensity Push** | Use high temperature, fine grind, stronger water, and fast flow to intensify fruit, sweetness, and body in processed naturals. | Test when a natural or experimental coffee tastes exciting but thin, muted, or underpowered. | Different from Suppression: this pushes process expression instead of restraining it. |
| **Flow-Stabilized Extraction Push** | Use flow tools or controlled geometry to make fine-grind/high-yield extraction cleaner and more repeatable. | Test when pushing grind/temp causes astringency, uneven drawdown, or muddiness. | Primary lever is still extraction intensity; flow tools are there to make the push behave. |
| **High-Concentration Push** (2026) | Use low brew ratio, high extraction efficiency, flow control, and roast/water support to create a very concentrated cup without losing clarity. | Test when a coffee has enough flavor density and sweetness to support high TDS without becoming heavy or muddy. | Different from Clean Coffee High-Yield Push: concentration and intensity are the primary target, not only extraction yield. (Paprik Liu 2026 — 1:10 ratio, 1.9 TDS, no-bypass, 200 ppm hardness.) |

### Structural Systems (Bed / Input Engineering)

| Subtype | Definition | Experiment Use | Boundary Note |
|---------|-----------|---------------|---------------|
| **Dual Grind Synchronization** | Use separate grind sizes to synchronize extraction across coffees or roast levels with different solubility. | Test on blends where one component tastes underdeveloped while another tastes over-extracted. | Best for multi-component blends; if using two grinds within the same coffee for flavor-zone targeting, use Compound-Targeted Dual Grind. |
| **Compound-Targeted Dual Grind** | Use multiple grind sizes within one coffee to emphasize different roast-derived flavor zones. | Test when one coffee has both bright/floral potential and deeper sweetness/body that do not show together at one grind. | Same coffee, different grind fractions; not component-specific blend synchronization. |
| **Layered Bed Extraction** | Stack coffees or grind fractions vertically to control which material extracts earlier, later, faster, or slower. | Test when a blend tastes disjointed in a mixed bed and needs more deliberate sequencing. | Different from Dual-Chamber extraction: layering is vertical in one bed, not side-by-side. |
| **Fractional Extraction** | Separate particle-size fractions and introduce them at different stages to control extraction timing inside one brew. | Test when fines or fine fractions give desirable aromatics but cause bitterness or muddiness if present from the start. | More staged than Dual Grind; particles are not merely mixed before brewing. |
| **Pre-Brew Alignment / Consistency Engineering** | Control freshness, oxidation, grind temperature, degassing, shaking, bed prep, and homogenization before brewing to improve extraction consistency. | Test when the same recipe swings cup to cup despite stable dose, grind, water, and pour technique. | This is pre-water control; if the main move happens during pouring or flow, classify elsewhere. |
| **Solubility-Matched Blend Engineering** | Assign each blend component its own roast, grind, storage, or prep strategy to align solubility before brewing together. | Test when blend components have different density, roast level, process, or cultivar behavior but need one unified brew. | Broader and more component-specific than Blend Ratio Engineering. |
| **Blend Ratio Engineering** | Use component percentages to design acidity, sweetness, body, aroma, or finish before changing the brew recipe. | Test when two or more coffees are good alone but the final sensory balance needs to be built at the input level. | Ratio is the main lever; if each component also gets different grind/roast/prep, use Solubility-Matched Blend Engineering. |
| **Roast-Based Structure** | Use multiple roast levels or roast profiles to create different sensory roles within one coffee or blend. | Test when one roast profile gives aromatics but lacks sweetness, or gives body but loses clarity. | Roast profile is the structural lever; not simply “roast details.” |
| **Filter-Mediated Flow** | Use filter material, permeability, or activation behavior as an active control layer in extraction. | Test when standard fast/slow filter labels fail to explain saturation, drawdown, clarity, or texture. | Different from Fast-Filter Flow Control: the filter’s behavior changes or selectively controls extraction, not just speed. |
| **Dual-Chamber Component Extraction** | Extract blend components side by side in physically separated chambers with component-specific variables. | Test when mixed-bed blends taste inconsistent but brewing two separate cups feels too inefficient or disconnected. | Components remain separate during brewing but combine in the final beverage path. |
| **Wet-Blended Component Extraction** | Extract components independently, then blend the finished liquids into the final beverage. | Test when each component needs a fully different recipe, temperature, grind, ratio, or contact style. | Integration happens after brewing; this is more beverage assembly than shared-bed extraction. |
| **Heritage Brewer Re-Engineering (provisional)** | Modify a traditional brewer to improve flow, saturation, aroma release, or clarity while preserving its brewing identity. | Test when a culturally meaningful brewer has a profile you value but lacks competition-level control or cleanliness. | Keep provisional until more examples appear; may later merge into Brewer Geometry Engineering. |
| **Pre-Brew Environmental Conditioning** (2026) | Control the temperature, humidity, vapor exposure, or surrounding chamber environment before brewing to condition grounds and stabilize extraction. | Test when fresh or dense coffees resist wetting, release too much CO2 during bloom, or behave inconsistently despite stable grind and pouring. | Different from general Pre-Brew Alignment: the brewer environment itself is conditioned before extraction, not just the coffee or bed. (Ong Shen Choy 2026 — water-jacket vapor chamber.) |
| **Inert Bed Matrix Extraction** (2026) | Add inert, non-dissolving material to the coffee bed to create flow pathways while allowing finer coffee particles to extract efficiently. | Test when finer grinding improves sweetness or intensity but causes choking, bitterness, or hydraulic resistance. | Different from boosters or filters: the inert material is mixed into the brew bed and directly changes bed structure. (Ibrahim Al Mallouhi 2026 — 1mm food-grade glass balls mixed into the bed.) |
| **Pre-Brew Blend Synchronization** (2026) | Rest blend components together before grinding to harmonize moisture, gas pressure, oxidation state, and aromatic integration. | Test when a blend tastes technically correct but aromatically disjointed or component-separated. | Use for pre-grind blend conditioning; if each component gets its own roast/grind/storage plan, use Solubility-Matched Blend Engineering. (Wataru Iidaka 2026 — 24h sealed aluminum can.) |
| **Sandwich Layer Extraction** (2026) | Separate particle-size layers with an intermediate filter or barrier so each layer experiences a different extraction mode or intensity. | Test when coarse particles need agitation/percolation for acidity while fines need gentler extraction for sweetness and roundness. | Related to Layered Bed Extraction, but distinct when a physical separator changes flow/contact between layers. (Bavis Kwong 2026 — finals 3rd; intermediate filter paper between fines and coarse layers.) |

## Water Chemistry Systems (NEW 2026)

| Subtype | Definition | Experiment Use | Boundary Note |
|---------|-----------|---------------|---------------|
| **Ionic Pairing** | Use specific cation-anion pairings to shape florality, sweetness, acidity, and texture beyond total hardness or ppm. | Test when normal Ca/Mg/K tuning changes intensity but not the specific flavor direction you want. | Primary lever is the paired mineral chemistry, not just ppm or hardness. (Carlos Juarez 2026 — calcium carbonate / magnesium chloride / potassium citrate.) |
| **Stage-Specific Mineral Profiling** | Use different mineral profiles across brew phases to assign extraction roles to specific ions, such as magnesium for acidity/aromatics and calcium for sweetness/body. | Test when one water profile gives good acidity but weak body, or good sweetness/body but muted florals. | Different from Ionic Pairing: the primary lever is when each mineral profile is introduced. (Esther Kim 2026 — Mg-dominant early, Ca-dominant late.) |
| **Flavor-Highlight Water Design** | Use a deliberate mineral formula to emphasize selected sensory targets, such as citrus, peach, florals, sweetness, or round mouthfeel. | Test when the coffee has the desired notes but they do not appear in the intended order or intensity. | Use when water is designed like seasoning for perception; if the formula depends on specific ion pairs, use Ionic Pairing. (Andrew Delgado 2026 — CaCl/MgCl/MgSO4/silica formula; Simon Gautherin 2026 — MgSO4/KCl/silica.) |

## Recipes by Family (154 recipes, 2022-2026)

Each recipe row shows year / competitor / placement / coffee + producer / brewer / sub-strategy + secondary tag + extraction intent (truncated).


## Structural Systems (sum of variants) (54 recipes)

| Year | Competitor | Place | Coffee | Brewer | Sub-strategy / Notes |
|------|------------|-------|--------|--------|----------------------|
| 2022 | Elika Liftee | Finalist | Blend (Eugenioides + Sudan Ru… / Inmaculada Coffee Farms, C… | MK Dripper | Structural (Layered Bed Extraction) · 2°: Output / Post-Brew Dilution · Use vertical layering, comp… |
| 2022 | Jhon Christhoper | Finalist | Blend (Geisha Lot 202 + Geish… / Finca Nuguo / Jose Gallard… | Tricolate | Structural (Dual Grind Synchronization) · 2°: Flow / Stability System · Use two Nuguo Geisha lots w… |
| 2022 | Shih Yuan Hsu “Sherry” | Finalist | Gesha / Finca Mikava, Colombia | Flat-bottom dripper | Structural (Compound-Targeted Dual Grind) · 2°: Thermal System · Use two particle-size bands within… |
| 2023 | Luca Croce | Finalist | Blend (Geisha 60% + Laurina 4… / Immaculada (Colombia) | Origami Air (Polycarbonate) | Structural (Dual Grind) · 2°: Time-Distributed (Drain-Based Pulses) · Synchronize extraction of dif… |
| 2024 | Wataru Iidaka | Finalist | Blend (3 coffees layered: Nat… / Multiple Panama producers … | UFO Dripper | Structural (Layered Bed) · 2°: Thermal (Staged + Cooling) · Control interaction of multiple coffees… |
| 2024 | Elysia Tan | Finalist | Blend (Geisha natural + Geish… / Multiple (Panama + Indones… | Flat-bottom dripper (Orea-sty… | Structural (Pre-Brew) · 2°: Extraction Push · Align solubility across blend first, then push extrac… |
| 2024 | Andreina Guerrero | Round One | Monte Claro / La Finca El Alisal / Victor Montil… | Origami Acrylic | Structural (Filter-Mediated Flow) · 2°: Extraction Push · Use a silk filter to retain sediment whil… |
| 2024 | Luthfan Satrio Pradipto | Round One | Blend (Eugenioides + Natural … / Immaculada Coffee Farms / … | MK Dripper | Structural (Layered Bed Extraction) · 2°: Time-Distributed (Drain-Based Pulse System) · Use compone… |
| 2024 | Yamil Quino | Round One | Blend (Washed Gesha + Natural… / Finca Sesi + Finca El Porv… | Modified funnel / “Rocking” m… | Structural (Layered Bed Extraction) · 2°: Flow / Stability System · Use layered bed, component-spec… |
| 2024 | Ale Lugo | Round One | Blend (Ombligon + Gesha) / El Diviso / Huila, Colombia + Fi… | Sweden Dripper | Structural (Solubility-Matched Blend Engineering) · 2°: Thermal System · Use separate roast-develop… |
| 2024 | Gabriele Pezzaioli | Round One | Blend (Geisha + Eugenioides) / Janson Coffee Farm / Chiriqu… | OREA V4 | Structural (Blend Ratio Engineering) · 2°: Thermal System · Use a species-based blend and separate … |
| 2024 | George Delichristos | Round One | Gesha / Baru Estates / Ninety Plus, Panama | Not explicitly stated | Structural (Roast-Based Structure) · 2°: Filter-Mediated Flow · Use screen-size separation, separat… |
| 2024 | Jaco Chu | Round One | Gesha / Mikava Estate / Paul Doyle, Risara… | Ceramic DS62 dripper | Structural (Solubility-Matched Blend Engineering) · 2°: Flow / Stability System · Use roast-color/A… |
| 2024 | Milo Gil | Round One | Blend (Gesha + Pacamara + Eug… / 90 Plus Estate Ethiopia + … | Origami Air + hybrid Sibarist… | Structural (Pre-Brew Alignment / Consistency Engineering) · 2°: Flow / Stability System · Use cryog… |
| 2024 | Rubens Vuolo | Round One | Blend (Laurina + Gesha) / Daterra / São Paulo, Brazil + Jan… | MK Dripper | Structural (Layered Bed Extraction) · 2°: Flow / Stability System · Use a small Laurina base layer … |
| 2024 | Raul Rodas | Round One | Blend (washed Guatemala Gesha… / Finca El Llano / Herbert P… | Origami Air | Structural (Dual Grind Synchronization) · 2°: Thermal System · Use equal-dose washed/natural Gesha … |
| 2025 | George Jinyang Peng | 1st | Gesha (single origin, triple … / Mount Totumas (Panama) | Solo Dripper | Structural (Roast-Based) · 2°: Thermal (Staged Temp) · Use roast differentiation + temperature stag… |
| 2025 | Andrea Batacchi | Finalist | Blend (Geisha natural + Geish… / Altieri + Volcán + Immacul… | Plastic conical dripper | Structural (Blend Ratio) · 2°: Time-Distributed (Even Pulses) · Design flavor profile at blend rati… |
| 2025 | Lakis Psomas | Finalist | Gesha / Finca Nuguo (Panama) | Timemore prototype conical dr… | Structural (Filter-Mediated Flow) · 2°: Flow / Stability System · Use a reactive hydrophobic filter… |
| 2025 | Milo Gil | Finalist | Chiroso / Finca Las Flores / Johan Vergara (… | Origami Air + Cone Booster | Structural (Pre-Brew Consistency Engineering) · 2°: Flow / Stability System · Increase extraction c… |
| 2025 | Daiki Hatakeyama | Finalist | Blend (Mikava Geisha CM Natur… / Mikava (Colombia) + Takesi… | Flannel / cloth filter brewer | Structural (Fractional Extraction) · 2°: Thermal System · Use blend architecture, dual roast levels… |
| 2025 | Thomas Philips | Finalist | Blend (Panama Gesha washed + … / Janson Estate + El Paraíso… | Origami | Structural (Solubility-Matched Blend Engineering) · 2°: Suppression System · Create harmony from th… |
| 2025 | Ale Lugo | Finalist | Blend (Ombligon natural therm… / El Diviso (Colombia) + Fin… | Sweden dripper | Structural (Solubility-Matched Blend Engineering) · 2°: Thermal System · Use separate roast-develop… |
| 2025 | Wei Lang | Finalist | Gesha / Mount Totumas / Geisha de la Rosa … | Flow Dripper | Structural (Compound-Targeted Dual Grind) · 2°: Thermal System · Use two grind sizes to separately … |
| 2025 | Laura Coe | Finalist | Blend (Maragagesa + Gesha) / Wilder Lazo / Huila Colombia +… | OREA V4 Narrow with open bott… | Structural (Dual-Chamber Component Extraction) · 2°: Hybrid / Flow-Stability · Extract two blend co… |
| 2025 | Mariam Erin | Finalist | Blend (Panama Gesha washed + … / Janson Los Alpes (Panama) … | Binocular dripper | Structural (Wet-Blended Component Extraction) · 2°: Output / Post-Brew Blending · Extract two coffe… |
| 2025 | Ti Phan | Finalist | Blend (Geisha + Sidra + Liber… / Janson F519 Geisha Natural… | Custom Vietnamese phin | Structural (Heritage Brewer Re-Engineering) · 2°: Flow / Stability System · Use a redesigned Vietna… |
| 2025 | Ignacio Daniel Velasco R… | Finalist | Blend (Bourbon + Laurina) / Canutani / Mauricio Díaz de Med… | NK flat-bottom dripper | Structural (Blend Ratio Engineering) · 2°: Extraction Push · Use a simple high-temperature, fast-fi… |
| 2025 | Manuel Pinnola | Finalist | Blend (Venezuelan Gesha washe… / Finca Rosario / Lusar Guer… | Custom stainless-steel / cera… | Structural (Blend Ratio Engineering) · 2°: Flow / Stability System · Use a carefully balanced two-G… |
| 2025 | Nasser Mohammed | Finalist | Blend (Panama Geisha + Colomb… / Hartmann Reserve (Panama) … | OREA V4 Wide with open base | Structural (Blend Ratio Engineering) · 2°: Flow / Stability System · Use an 80/20 blend and OREA wi… |
| 2025 | Martin Guayasamin | Finalist | Blend (Sidra + Typica Mejorad… / Hacienda Santa Gertrudis +… | Graycano Dripper | Structural (Blend Ratio Engineering) · 2°: Time-Distributed System · Use a 2:1 Sidra/Typica Mejorad… |
| 2025 | Jonatan Mendoza | Finalist | Blend (Gesha + Kenya SL28 + O… / Finca Ethiopia / Laranjo C… | UFO Dripper | Structural (Blend Ratio Engineering) · 2°: Flow / Stability System · Create a complete sensory prof… |
| 2025 | Michael Torres Suarez | Finalist | Blend (Mocha + Mandela) / Granja Paraíso / Wilton Benitez +… | NextLevel Duo / flat-bottom b… | Structural (Blend Ratio Engineering) · 2°: Time-Distributed System · Use a two-component Colombian … |
| 2026 | Carlos Juarez | Round One | Gesha / Julio Quiceno / La Riviera, Risaralda, Colombia | Origami | Structural (Grind Distribution Engineering) · 2°: Water Chemistry / Ionic Pairing · 58% boulder-skewed grind distribution + 8g/s turbulence + ion-paired water for floral washed Gesha. |
| 2026 | Weize Xu | Round One | Gesha / Los Manantiales / Bambito, Panama | Lily + high-bypass 2nd stage | Structural (Fractional Extraction) · 2°: Thermal System · Coarse/fine fractions extracted separately; cooled brewed liquid becomes the solvent over the fines. |
| 2026 | Valentina Cartechini | Round One | Blend (Natural + Washed Gesha) / Pocho + La Esmeralda, Pan… | Ario Alpha | Structural (Filter-Mediated Flow) · 2°: Structural (Blend Ratio) · Custom filter architecture + fast guided flow reduce bypass, integrate a nat/washed Gesha blend. |
| 2026 | Wataru Iidaka | Round One | Blend (Janson nat + La Esmeralda washed Gesha) / Panama | Ceramic UFO | Structural (Pre-Brew Blend Synchronization) · 2°: Thermal / Water Chemistry · 24h sealed-can blend sync harmonizes moisture/gas/aroma; staged low-temp/low-hardness finish. |
| 2026 | Martin Guayasamin | Round One | Blend (Sidra + Gesha) / Finca Aurum (Ecu) + Mikava (Col) | Immersion-compatible setup | Structural (Distribution-Controlled Flow) · 2°: Water Chemistry · Grinder consistency + IIS micro-vibration particle stratification + standardized JAMM water. |
| 2026 | Tom Tran (Tran Duc Thang) | Round One | Blend (Gesha + Catimor) / Finca Carmen (Pan) + Aratai (Viet) | GH2 dripper + Switch base | Structural (Solubility-Matched Blend Engineering) · 2°: Hybrid System · Separate grind + component-specific rest timing + no-bypass hybrid synchronize Gesha + Catimor. |
| 2026 | Ong Shen Choy | Round One | Gesha / Finca Maya / Lost Origin, Panama | Ceramic Flow + Switch + water jacket | Structural (Pre-Brew Environmental Conditioning) · 2°: Thermal System · Water-jacket chamber warms/humidifies grounds, releases CO2, enables a short clean extraction. |
| 2026 | Andrew Wong | Round One | Gesha / Karen / Mount Totumas, Panama | April Hybrid | Structural (Filter-Mediated Flow) · 2°: Hybrid System · Double stacked classic-wave filters increase filtration + air exchange, enabling finer grind. |
| 2026 | Victoria Zamora | Round One | Blend (Sudan Rume + CGLE) / Las Margaritas + Potosí, Col | Origami | Structural (Blend Ratio Engineering) · 2°: Time-Distributed (Pulse) · 35/65 Sudan Rume/CGLE + classic Origami pulse preserve clarity, build fruity sweetness. |
| 2026 | Ibrahim Al Mallouhi | Round One | Gesha / Sincanalia / Volcán, Panama | Origami | Structural (Inert Bed Matrix Extraction) · 2°: Extraction Push · 10g very fine coffee + 15g 1mm glass balls decouple grind fineness from hydraulic resistance (TDS 1.6). |
| 2026 | Erlend Wessel-Berg | Round One | Blend (Gesha + Typica) / La Esmeralda (Pan) + Las Flores (Col) | OREA V4 | Structural (Blend Ratio Engineering) · 2°: Suppression · Tiny 2g Typica accent + 13g Gesha base; warm expressiveness, then cooling-stage florals. |
| 2026 | Ethan Junseong Park | Round One | Gesha / Finca Los Cenizos, Panama | Hario Mugen/Nail + Switch | Structural (Roast-Based Structure) · 2°: Hybrid System · Two roast endpoints (196/199°C) of one washed Gesha blended 1:1, delivered via a 3-step hybrid. |
| 2026 | Lisa Zancanella | Round One | Blend (Gesha + Red Gesha) / La Esmeralda + Jardines del Edén | Origami-style selective filter | Structural (Filter-Mediated Flow) · 2°: Aroma / Volatile Capture · Selective low-bypass filter + inverse bloom improve saturation; wine aeration elevates aroma. |
| 2026 | Bavis Kwong | Round One | Green-tip Gesha / Janson Lot 251, Panama | Contour Drip (two-zone) | Structural (Sandwich Layer Extraction) · 2°: Layered Bed · Intermediate filter separates fines (bottom) from coarse (top) for two extraction modes in one brew. |
| 2026 | Sebastian Martinez | Round One | Gesha washed+honey / Edwin Noría / Campo Hermoso, Col | Ceramic Hario Switch | Structural (Dual Grind Synchronization) · 2°: Hybrid System · Two process expressions of one Gesha, separate roast + grind, connect washed florals + honey body. |
| 2026 | Urs Rotzinger | Round One | Blend (Parainema + Gesha + Liberica) / Nicaragua + Indonesia | Hario V60 Neo | Structural (Blend Ratio Engineering) · 2°: Thermal System · Tiny Liberica/Parainema accents + staged temperature push fruit while reducing bitterness. |
| 2026 | Matin Shaikh | Round One | Blend of three Geshas / Inmaculada (Col) + Los Alpes (Pan) + Riverdale (India) | Hario Neo Switch | Structural (Solubility-Matched Blend Engineering) · 2°: Hybrid System · Three Geshas as perfume top/middle/base notes; booster-supported hybrid integration. |
| 2026 | Alpay Başkan | Round One | Gesha / Panama | Binocular dripper | Structural (Dual-Chamber Component Extraction) · 2°: Thermal / Water Chemistry · One Gesha split into two parallel recipes (floral clarity vs fruity sweetness), recombined. |
| 2026 | Sierra Yeo | Round One | Gesha / Mount Totumas / De La Rosa & Lopez, Panama | Baby O flatbed + booster | Structural (Pre-Brew Alignment / Consistency Engineering) · 2°: Cooling-Curve / Aroma · "Goldilocks windows" across ferment/roast/rest/vacuum-degas/flow/aroma/drinking temp. |
| 2026 | Ethan Junseong Park | Finals / 5th | Gesha / Finca Los Cenizos, Panama | Hario Nail/Neo + Switch | Structural (Roast-Based Structure) · 2°: Hybrid System · Two roast endpoints split floral/fruity roles via high-temp diffusion + low-temp immersion finish. |
| 2026 | Bavis Kwong | Finals / 3rd | Green-tip Gesha / Janson Lot 251, Panama | Contour Drip (two-zone) | Structural (Sandwich Layer Extraction) · 2°: Layered Bed · Finals confirms the subtype: one extra filter paper creates separate fines/coarse extraction environments. |

## Hybrid Systems (27 recipes)

| Year | Competitor | Place | Coffee | Brewer | Sub-strategy / Notes |
|------|------------|-------|--------|--------|----------------------|
| 2023 | Garam Victor Um | 3rd | Blend (Geisha + Laurina) / CGLE (Colombia) + Janson (Panama) | Hario V60 (metal) + Hario W60… | Hybrid System (Sequential) · 2°: Structural (Dual Grind) · Layer body and sweetness first via immer… |
| 2024 | Liew Kar Weng | Round One | Gesha / Mikava / Colombia, Marsella / Risa… | Hario Switch | Hybrid System · 2°: Structural (Pre-Brew Alignment / Consistency Engineering) · Use staged immersio… |
| 2024 | Wasin Kusakabe | Round One | Gesha / Finca Deborah / Jamison Savage, Pa… | Hario Switch + custom booster… | Hybrid System · 2°: Flow / Stability System · Use a flat-filter Switch setup with booster-assisted … |
| 2024 | Kunie Inaba | Round One | Elongated Washed Gesha / “Ges… / Finca El Diviso, Colombia | Hario Switch base + Mugen pla… | Hybrid System · 2°: Thermal System · Use immersion-percolation-immersion staging with water-tempera… |
| 2024 | Frederick Bejo | Round One | Blend (Ethiopia 74158 + Colom… / Kenean Damo / Ethiopia + C… | Hario Switch base + Mugen bre… | Hybrid System · 2°: Structural (Blend Ratio Engineering) · Use low-bypass immersion brewing to redu… |
| 2024 | Weihong Zhang | Round One / source label says World Cup Tasters | Typica Mejorado / decaf / Lost Origin Farm / Oscar Hernande… | Hario Switch + V60 Mugen drip… | Hybrid System · 2°: Output / Post-Brew Dilution · Use low-temp open-valve bloom plus high-temp imme… |
| 2025 | Justin Bull | 1st (US Brewers Cup) | Gesha (carbonic maceration → … / Finca Deborah (Panama) | Hybrid brewer (April-style va… | Hybrid System · 2°: Structural (Phase Mapping) · Use percolation to highlight acidity and immersion… |
| 2025 | Raul Rodas | Finalist | Gesha / Finca El Injerto / Los Pinos A G1 … | Hario Switch | Hybrid System · 2°: Structural (Roast-Based Split) · Use immersion to build intensity and tactile w… |
| 2025 | Eline Ferket | Finalist | Gesha / Las Margaritas / Lost Origin (Pana… | Hario Switch | Hybrid System · 2°: Output Selection · Use staged immersion to build acidity, honey sweetness, silk… |
| 2025 | Luca Croce | Finalist | Green-tip Gesha / Janson Estate, Los Alpes / lot 465… | Custom carbon-fiber hybrid br… | Hybrid System · 2°: Flow / Stability System · Use a custom hybrid brewer to combine immersion satur… |
| 2025 | Eric So | Finalist | Blend (Nuguo Gesha + Finca So… / Finca Nuguo + Finca Sophia… | Chill / hybrid valve dripper | Hybrid System · 2°: Structural (Component-Specific Blend Engineering) · Use hybrid valve phases and… |
| 2025 | Suki Ma | Finalist | Gesha / Hacienda La Esmeralda / Esmeralda … | Hario Switch (black ceramic) | Hybrid System · 2°: Thermal System · Use low-temp immersion to gently extract tartaric acidity and … |
| 2025 | Barry McGeehin | Finalist | Gesha / Finca Deborah / Jamison Savage, El… | April Hybrid | Hybrid System · 2°: Structural (Pre-Brew Physical Conditioning) · Use hybrid percolation/immersion … |
| 2025 | Teodora Pitiş | Finalist | Java / Las Flores / Johan Vergara (Colomb… | Hario Switch | Hybrid System · 2°: Extraction Push · Use low-temp immersion to preserve complex aromatics, then hi… |
| 2025 | Barbora Mařáková | Finalist | Gesha / El Placer / Sebastian Ramirez (Col… | Hario Switch | Hybrid System · 2°: Thermal System · Use a two-stage Switch recipe to extract sweetness and acidity… |
| 2025 | Stefan Mihǎitǎ | Finalist | Gesha / Julio Madrid / Santa Rosa de Cabal… | April Hybrid | Hybrid System · 2°: Extraction Push · Use high-temperature hybrid brewing to combine full saturatio… |
| 2025 | Allen Chen | Finalist | Gesha / 90 Plus Gesha Estates / Volcán, Pa… | Groove dripper + Cone Booster… | Hybrid System · 2°: Flow / Stability System · Use Tetsu 4:6-inspired immersion phases plus flow too… |
| 2025 | Luiz Eduardo Lahutte Mot… | Finalist | Sidra Bourbon / Adan Lasso / Huila, Colombia | Iconic dripper | Hybrid System · 2°: Thermal System · Use low-temperature immersion blooms to preserve florals and a… |
| 2025 | Rebeca Mujica | Finalist | Gesha / Café Granja La Esperanza / Colombia | Hario Switch + Mugen dripper | Hybrid System · 2°: Flow / Stability System · Use open-valve low-agitation percolation to extract f… |
| 2026 | Nas Jaafar | Finals / 1st | Gesha / Finca Nuguo, Panama | UFO V3 + Hario Switch base | Hybrid System · 2°: Flow / Stability · **2026 CHAMPION.** Resistance as a recipe variable — clarity-first percolation (58s) then valve-closed sweetness-first immersion. |
| 2026 | Nas Jaafar | Round One | Gesha / Finca Nuguo, Panama | UFO V3 + Hario Switch base | Hybrid System · 2°: Flow / Stability · Manage resistance across grind/bed/geometry/filter/valve to move from clarity percolation to sweetness immersion. |
| 2026 | Ryan Wibawa | Round One | Blend (Gesha nat + Gesha white honey + Excelsa anaerobic) / Nuguo + Janson + Sumedang | City Flat / hybrid flat brewer | Hybrid System · 2°: Time-Distributed / Structural (Component Blend) · Immersion builds aroma/sweetness, percolation adds clarity/acidity; component-specific grind. |
| 2026 | Eline Ferket | Round One | Gesha / Maria Amoruso / La Esmeralda, Panama | Hario Switch | Hybrid System (Selective Bloom) · 2°: Output Selection · Separated bloom immersion preserves acidity/florals; later immersion builds natural-process sweetness. |
| 2026 | Ieva Suopyte | Round One | Blend of two Geshas / Cabana + Noria / La Esmeralda, Pan | Big Hario Switch | Hybrid System · 2°: Structural (Blend Ratio) · Immersion builds sweetness/texture from the natural, percolation adds clarity/florals from the washed. |
| 2026 | Ju Morgado | Round One | Blend (Catuaí + Gesha) / Mazoku + Lammonier, Brazil | April Hybrid | Hybrid System · 2°: Structural (Blend Ratio) · Tiny closed-valve pre-infusion degasses, then fast-flow percolation keeps an 80/20 blend bright/floral. |
| 2026 | Aga Rojewska | Round One | Gesha / Cauca, Colombia | CT62 Transit dripper | Hybrid System · 2°: Suppression · Approachable hybrid + coarse grind + low-alkalinity Mg-forward water express a fruity anaerobic Gesha clearly. |
| 2026 | Jaideep Sidhu | Round One | Blend of two Geshas / El Gran Manzana (Guat) + Los Alpes (Pan) | Hario V60 Neo + Switch | Hybrid System (Temperature-Sandwich) · 2°: Structural (Blend Ratio) · 89/96/89°C sandwich balances washed florals with a natural anaerobic accent. |

## Flow / Stability System (20 recipes)

| Year | Competitor | Place | Coffee | Brewer | Sub-strategy / Notes |
|------|------------|-------|--------|--------|----------------------|
| 2022 | Tomas Taussig | Finalist | Gesha / Los Lajones / Bajomono, Boquete, P… | Custom 3D-printed flatbed dri… | Thermal System · Use aggressive early extraction and a shower-screen low-agitation finish in a no-b… |
| 2024 | Martin Wölfl | 1st | Gesha / Don Benji (Panama) | OREA V4 (fast bottom) | Extraction Push · Maximize extraction with fine grind while externally controlling turbulence to pr… |
| 2024 | Daniel Horbat | Round One | CGLE 17 / Café Granja La Esperanza / Rigober… | OREA V4 open base | Time-Distributed (Drain-Based Pulse System) · Use OREA V4 open-base geometry, fast paper, finer gri… |
| 2024 | Li Jin Kun | Round One | Gesha / Custom batch from Panama / farm na… | GS2 filter system with modifi… | Thermal System · Use a modified rapid-flow filter system to make fine-grind, short-time extraction … |
| 2024 | Şevval Nida Fetullahoğlu | Round One | Gesha / Sebastian Gomez / Lisa Farm, Quind… | Mekin Design Two Cup Dripper | Extraction Push · Use double-wall ceramic heat stability, low-bypass flat geometry, and controlled … |
| 2024 | Suki, Hiu Yeung Ma | Round One | Sidra / Rigoberto / exact farm unclear, Co… | Conical brewer + mesh booster | Thermal System · Use booster-supported conical flow, staged temperature decline, and early aroma ca… |
| 2024 | Erik Liao | Round One | 74158 / Tamiru / Alo Village, Sidama, Ethi… | Custom flat-bed center-column… | Thermal System · Use custom center-column flat geometry, high early temperature, and low final temp… |
| 2024 | Patrik Rolf | Round One | Orange Bourbon / El Paraíso 92 / Wilton Benitez, Ca… | April Brewer | Suppression System · Use flat-bottom flow control, low-ppm water, moderate temperature, and two sim… |
| 2024 | Alex Niculae | Round One | CGLE 17 / Café Granja La Esperanza, Valle de… | Hybrid cone/flat/no-bypass dr… | Extraction Push · Use a hybrid-geometry low-bypass dripper to combine conical clarity, flat-bottom … |
| 2025 | Alireza | Finalist | Gesha / Mikava (Colombia), lot 2612 | OREA V4 fast bottom | Suppression System · Use low-temperature, fast-flow percolation with controlled agitation to preser… |
| 2025 | Sungduk Kim | Finalist | Gesha / Altieri Estate / Roaster-region co… | UFO Dripper | Structural (Geometry-Controlled Contact Time) · Use dripper geometry to extend contact time for swe… |
| 2025 | Lui Selorio | Finalist | Blend (Philippine Geisha + Pa… / Aku Coffee Farm (Davao, Ph… | UFO Dripper + Paragon + Melod… | Thermal System · Use UFO flow control, needle distribution, Paragon aroma capture, and Melodrip to … |
| 2025 | June Simon | Finalist | Gesha / Mikava / Santuario Farm, Colombia | Graycano + custom adapter + B… | Extraction Push · Use a fast, geometry-modified Graycano system plus Melodrip to push finer-grind e… |
| 2025 | Michael Boles | Finalist | Bourbon Rojo / Juan Rivera / Finca La Sia | Lili Dripper | Extraction Push · Use low-bypass, low-turbulence brewing to extract high sweetness, body, and red-f… |
| 2026 | Angie Molina | Round One | Green-tip Gesha / Mount Totumas / Los Pozos, Panama | Dragonfly Tri Spin | Flow / Stability (Filter-Mediated Flow) · 2°: Water Chemistry · High-flux filter + water composition + density-aware low-RPM grind = portable adaptable recipe. |
| 2026 | Angie Molina | Finals / 6th | Green-tip Gesha / Mount Totumas, Panama | Dragonfly Dry Spin | Flow / Stability (Filter-Mediated Flow) · 2°: Water Chemistry · Finals: filter material + water formula + bean density as the main adaptable control system. |
| 2026 | Lakis Psomas | Round One | Gesha / Pocho Gallardo / Finca Nuguo, Panama | April + valve + Acaia vacuum lid | Flow / Stability (Vacuum-Assisted Bloom) · 2°: Aroma / Volatile Capture · Vacuum during a cool 55°C bloom forces saturation + CO2 removal before high-temp extraction. |
| 2026 | Mihnea Nicolescu | Round One | CGLE Gesha×Caturra / Finca Potosí, Valle del Cauca, Col | Fast dripper | Flow / Stability (Distribution-Controlled Flow) · 2°: Water Chemistry · Two-stage WDT (parallel needles then fan) moves fines/dry-pockets/chaff/boulders into zones. |
| 2026 | Elina Serhenchuk | Round One | Gesha / Bella Alejandría / Wilder Lazo, Colombia | Kafka / Cyclon system | Flow / Stability (Aroma / Volatile Capture) · 2°: Flow / Stability · Brewer air gaps + Mg water + aerated service preserve and release floral volatiles. |
| 2026 | Manuel Molina | Round One | Pacamara / Las Dueñas / Chalatenango, El Salvador | Not stated | Flow / Stability (Distribution-Controlled Flow) · 2°: Output Selection · "Nest" particle placement against filter wall + sediment removal for cleaner terroir. |

## Time-Distributed Systems (15 recipes)

| Year | Competitor | Place | Coffee | Brewer | Sub-strategy / Notes |
|------|------------|-------|--------|--------|----------------------|
| 2023 | George Peng | Finalist | Gesha (Panama) / Panama (exact farm not clearly sta… | Flat-bottom dripper (custom/s… | Time-Distributed (Parametric) · 2°: Thermal (Staged Temp) · Standardize early extraction phases, th… |
| 2024 | Ana Franchesca Arce | Round One | Papayo / Finca Aroma Nativo / Luis Marcelin… | Origami Air | Time-Distributed (Pulse System) · 2°: Flow / Stability System · Use a simple repeatable four-pulse … |
| 2024 | Rasmus Madsen | Round One | Flora / experimental variety / Research station, Copenhagen… | Flat-bottom brewer | Time-Distributed (Pulse System) · 2°: Flow / Stability System · Use fixed 40s pulses with coarse gr… |
| 2024 | Luca Croce | Round One | Mandela / Café Granja La Esperanza / Valle d… | Origami Air Mini | Time-Distributed (Pulse System) · 2°: Flow / Stability System · Use four controlled pours with near… |
| 2025 | Bayu Prawiro | 2nd (Indonesia Brewers Cup) | Blend (Geisha washed + Geisha… / Multiple (Panama + Indones… | Hario Switch + Drip Assist | Time-Distributed (Parametric) · 2°: Structural (Multi-Grind) · Balance agitation, flow, and contact… |
| 2025 | George Papantoniou | Finalist | Gesha / El Paraíso / Diego Bermudez (Cauca… | OREA dripper | Time-Distributed (Pulse System) · 2°: Flow / Stability System · Use fixed 5-pulse timing with fast … |
| 2025 | Ply | Finalist | Gesha / Mount Totumas Cloud Forest / Kadim… | OREA O1 | Time-Distributed (Role-Based Pulse System) · 2°: Flow / Stability System · Assign each pour a senso… |
| 2025 | Tom Hutchins | Finalist | Sudan Rume / Finca Campo Hermoso / Edwin Noreña… | Hario Alpha Dripper + Hario D… | Time-Distributed (Double Bloom / Boom System) · 2°: Flow / Stability System · Solve fast-drain satu… |
| 2025 | Piotr Nowak | Finalist | Gesha / Mikava / Santuario Farm, Colombia | Hybrid flatbed dripper | Time-Distributed (Role-Based Pulse System) · 2°: Flow / Stability System · Use phase lengths as sen… |
| 2025 | Erick Muria Dimas | Finalist | Gesha / Cafe Estate / Renacimiento, Panama | Hario V60 Katsuya | Time-Distributed (Pulse System) · 2°: Suppression System · Use a Katsuya-style five-pour pulse stru… |
| 2026 | Bene Sanchez | Round One | Blend (Washed Gesha + Kalasan landrace + Natural Gesha) / Sophia + Kalasan + Lerida | Flat-bottom large-hole | Time-Distributed (Pour-Speed Profiling) · 2°: Aroma / Volatile Capture · Slow-slow-fast (g/s measured): slow early for aroma/sweetness, fast center for clean silky finish. |
| 2026 | Rasmus Madsen | Round One | Flora / F1 hybrid (Caturra×Gesha) / Denmark research greenhouse | Wide-base flat-bottom | Time-Distributed (Pulse System) · 2°: Water Chemistry · Fixed 40s pulses + coarse grind + high-retention paper + MgCl/MgSO4/CaCl salts → jasmine/cane sugar. |
| 2026 | Inthat "Taotao" Ueasakaree | Round One | Gesha / Mount Totumas / Lost Origin, Panama | White flat-bed + center column | Time-Distributed (Ratio-Staged Extraction) · 2°: Water Chemistry · Stage-level brew-ratio/water-level control: low-ratio early for clarity, high-ratio late for florals. |
| 2026 | Yuta Chu | Round One | Gesha / Lost Origin / Cristiano, Boquete, Panama | Flow dripper + Switch cutoff | Time-Distributed (Pour-Speed Profiling) · 2°: Thermal System · Measured pour speed (9s/8s/6s): slow early for acidity/sweetness, fast final for juicy mouthfeel. |
| 2026 | Sofia Luttrell | Round One | Gesha / Cañas Verdes / José Luttrell, Boquete, Panama | Hario Tritan Flow | Time-Distributed (Pour-Speed Profiling) · 2°: Water Chemistry · Slow high-temp pours extract fruit/florals; fast low-temp final pour reduces bitterness (KCl-forward water). |

## Thermal System (9 recipes)

| Year | Competitor | Place | Coffee | Brewer | Sub-strategy / Notes |
|------|------------|-------|--------|--------|----------------------|
| 2022 | Elysia Tan | Finalist | Gesha / Cerro Azul / Café Granja La Espera… | Origami Air | Structural (Pre-Brew Alignment / Consistency Engineering) · Use humidity control before and during … |
| 2023 | Giacomo Vannelli | Finalist | Blend (Gesha 60% + Eugenioide… / Janson (Panama) + Immacula… | D1 Brewer (custom hybrid) | Flow / Stability (Hybrid Geometry) · Enhance sweetness and aromatic volatility through early coolin… |
| 2024 | Tom Hutchins | Champion (Australia Brewers Cup) | Blend (Ombligon + Gesha) / El Diviso (Colombia) + Janson (P… | Hario Metal V60 | Flow / Stability (Drip Assist) · Dynamically control slurry temperature during pours to balance swe… |
| 2024 | Iryna Basko | Round One | Pink Bourbon / Granja Paraíso / Wilton Benitez (C… | Dotyk Dripper / Ukrainian cer… | Flow / Stability System · Use very high-temperature early extraction to open tropical flavor, Parag… |
| 2024 | Janer Perez | Round One | Blend (Gesha + Sidra) / Finca San Pedro / Milton Monroy, T… | Barista Net Wave Glass Dripper | Structural (Blend Ratio Engineering) · Use temperature as the organizing lever across processing, r… |
| 2024 | Aga Rojewska | Round One | Gesha / Hacienda La Esmeralda, Panama | Cone-shaped brewer | Suppression System · Use mostly high-temperature extraction to develop fruit and texture, then a lo… |
| 2024 | Dongmin Kim | Round One | Gesha / Misty Mountain / Longboard Coffee,… | Conical dripper | Suppression System · Use high-temperature early extraction to develop fruit/sweetness, then a 70°C … |
| 2025 | Kittanai “Bomboldman” Ko… | Finalist | Gesha / Panama Cherry (Panama) | Flat-bottom dripper | Time-Distributed System · Use high-temp/high-agitation early pours to build flavor intensity, then … |
| 2026 | Herber Huamani | Round One | Gesha / José Vargas / El Mirante, Cusco, Peru | Dragonfly Tri Spin Flat Switch | Thermal (Cooling-Curve Design) · 2°: Hybrid / Aroma Capture · C-Bloom marble-base active cooling (-5°C, ~2 min) preserves volatiles, defines warm/cold sensory phases. |

## Suppression System (6 recipes)

| Year | Competitor | Place | Coffee | Brewer | Sub-strategy / Notes |
|------|------------|-------|--------|--------|----------------------|
| 2023 | Carlos Medina | 1st | Sidra / CGLE | Origami Air | Time-Distributed (Pulse) · Build layered sweetness and structure through staged pulses while suppre… |
| 2024 | Andreas Harestad | Round One | Ethiopian heirloom / landrace… / El Placer / Sebastián Ramí… | Hario V60 | Time-Distributed System · Use moderate temperature, coarse grind, and simple V60 pours to preserve … |
| 2024 | Ytzvan Mastino Morales | Round One | Gesha / Hartmann / Mi Finquita, Los Pozos,… | Origami | Flow / Stability System · Preserve a classic washed Panama Gesha profile through moderate temp, sim… |
| 2024 | Monserrath Morazan | Round One | Gesha / Finca La Montaña / Osvaldo Morazan… | Hario V60 | Thermal System · Use medium-coarse grind and slightly declining brew temperature to preserve jasmin… |
| 2025 | Gökhan Selamet | Finalist | Gesha / Mikava (Colombia) | Not explicitly stated | Time-Distributed System · Use low-temperature, slightly coarse, simple staged percolation to preser… |
| 2025 | Andreas Harestad | Finalist | Gesha / Hacienda La Esmeralda / Hamario Fa… | Hario V60 | Time-Distributed System · Use moderate temperature, low-mineral water, medium-coarse grind, and sim… |

## Extraction Push (High-Yield Clarity) (9 recipes)

| Year | Competitor | Place | Coffee | Brewer | Sub-strategy / Notes |
|------|------------|-------|--------|--------|----------------------|
| 2023 | Savina Giachgia | 2nd | Blend (Ninety Plus Juliette +… / Ninety Plus (Panama) | Hario V60 02 (Ceramic) / Gray… | (Blend-Assisted) · 2°: Structural (Blend Engineering) · Maximize extraction yield while preserving … |
| 2024 | Jackie Tran | Finalist | Gesha / Hacienda La Esmeralda (Panama) | Flat-bottom dripper (polycarb… | Flow / Stability · Maximize sweetness and body through high extraction while preserving clarity via… |
| 2024 | Victor Cadenas Reyes | Round One | Gesha selection / Santa María de Dota / Bonilla Mart… | Graycano / aluminum dripper | Flow / Stability System · Use high-mineral water, fast filtration, and thermally stable conical bre… |
| 2025 | Thiago Sabino | Finalist | Yellow Catuaí / Casa Brás Farm / Pedro Brás (Brazi… | Conical aluminum dripper (Ger… | Flow / Stability System · Maximize intensity, winey fruit, sweetness, and body from a processed Yel… |
| 2025 | Taha Youssef | Finalist | Gesha / Colombia, exact farm unclear | Origami | Output / Bypass Control · Use fine grind, fast conical filtration, and 92°C extraction to drive cla… |
| 2025 | Eduard Inocencio | Finalist | Gesha / Mikava / Santuario Farm, Colombia | OREA dripper with fast bottom | Flow / Stability System · Use very hot water, fast-bottom flat geometry, fast filter, and short bre… |
| 2026 | Jake Mummery | Round One | Sidra / Mauricio Shattah / La Negrita, Tolima, Colombia | OREA 01 + Crisis booster | Extraction Push (Flow-Stabilized) · 2°: Thermal · Fast low-bypass flow + booster + fine grind build structure; staged 93→80°C preserves clarity. |
| 2026 | Paprik Liu | Round One | Red Gesha / Mauricio Shattah / La Negrita, Tolima, Colombia | NextLevel no-bypass + two-way diffuser | Extraction Push (High-Concentration Push) · 2°: Flow / Stability · 1:10 ratio, 1.9 TDS, 200 ppm hardness, two-way agitation — concentration as the design target with clarity. |
| 2026 | Leo | Round One | Gesha / Vista Hermosa / Freddy Orantes, Guatemala | Solo dripper | Extraction Push (Clean Coffee High-Yield Push) · 2°: Flow / Stability · Coarse grind + 96°C + fast filter + high-turbulence pours maximize extraction fast, preserving florals. |

## Immersion System (9 recipes)

| Year | Competitor | Place | Coffee | Brewer | Sub-strategy / Notes |
|------|------------|-------|--------|--------|----------------------|
| 2022 | Simen Andersen | Finalist | Ethiopian heirloom / landrace / Gatta Farm / Asafa and Lulu… | Hario Switch | Suppression System · Use full immersion to recover the cupping-like fruit-juice quality of a delica… |
| 2024 | Ryan Wibawa | Champion (Indonesia Brewers Cup 2025; WBrC competitor 2024) | Blend (Geisha + Ombligon + Ex… / Multiple (Panama, Colombia… | Hario Switch | Thermal (Staged Temp) · Extract sweetness and aroma first at low temperature, then build structure … |
| 2024 | Charity Cheung | Finalist | Blend (Geisha + Eugenioides +… / Multiple (Panama + Colombi… | Hario Switch + Mugen top | Extraction Push · Stabilize multi-coffee blend via immersion, then push extraction to maximize swee… |
| 2024 | Aistė Košienė | Round One | Blend (Gesha + Eugenioides) / Mikava / Risaralda, Colombia … | Gina Brewing Instrument | Structural (Blend Ratio Engineering) · Use staged immersion and a 10% sweetness component to make a… |
| 2024 | Alistair Seetho | Round One | CGLE 17 / Café Granja La Esperanza / Finca P… | Hario Switch | Staged Immersion · Use repeated short immersion stages with full drainage to control extraction rat… |
| 2026 | Jackie Tran | Finals / 4th | Mika / Ethiopian landrace / Mount Totumas, Panama | Solo Spin valve dripper | Immersion (Staged Immersion) · 2°: Pre-Brew Alignment · Moisture as a through-line (drying→roast→degas→brew); two-stage 94→80°C immersion is the simplifier. |
| 2026 | Jackie Tran | Round One | Mika / Mokka-like natural / Mount Totumas, Chiriquí, Panama | Solo Spin valve dripper | Immersion (Staged Immersion) · 2°: Thermal / Pre-Brew Alignment · Moisture-controlled roast + vacuum-degassed pre-ground + two-stage 94→80°C immersion. |
| 2026 | Filippos Nikomanis | Round One | Gesha / Altieri family / Boquete, Panama | Glass carafe / cupping vessel | Immersion (Full-Immersion / Cupping-Style) · 2°: Output Selection (Decant) · Cupping-inspired full immersion, no paper, timed decant for repeatable high-aroma service. |
| 2026 | Mikolaj Pociecha | Round One | Blend (Washed Gesha + grafted YB/Liberica hybrid) / Huila (Col) + Java (Indo) | NextLevel Pulsar | Immersion (Staged Immersion) · 2°: Structural (Blend Ratio) · Water-first immersion + staged needle agitation + zero-bypass release integrate a two-species blend. |

## Output Selection (3 recipes)

| Year | Competitor | Place | Coffee | Brewer | Sub-strategy / Notes |
|------|------------|-------|--------|--------|----------------------|
| 2025 | Carlos Escobar | 3rd | Maracaturra / Peñas Blancas (Colombia) | Hario Switch | Immersion (Hybrid Base) · Maximize sweetness and clarity by removing undesirable early extraction a… |
| 2026 | Simon Gautherin | Finals / 2nd | Blend of two Geshas / Las Blancas (Col) + Finca Gallis (Pan) | Pulsar dripper | Output Selection Systems · 2°: Water Chemistry · Finals 2nd: remove first 10g + stop at exact 140g yield; MgSO4/KCl/silica water highlights the selected fraction. |
| 2026 | Simon Gautherin | Round One | Blend of two Geshas / Las Blancas (Col) + Nuguo (Pan) | Pulsar dripper | Output Selection Systems · 2°: Water Chemistry · Front-cut + exact-yield selection minimizes cacao notes; water seasoning highlights citrus/peach/roundness. |

## Water Chemistry Systems (NEW 2026) (2 recipes)

Primary-tagged routines below. Water chemistry is a *secondary* lever on ~5 more 2026 recipes — see the family note in [wbc-reference.md](docs/skills/wbc-brewing-archivist/cluster/wbc-reference.md) (Carlos Juarez, Simon Gautherin, Angie Molina, Rasmus Madsen, Martin Guayasamin).

| Year | Competitor | Place | Coffee | Brewer | Sub-strategy / Notes |
|------|------------|-------|--------|--------|----------------------|
| 2026 | Esther Kim | Round One | Gesha / Dign Nunes / Volcán, Panama | Flat-bottom immersion brewer | Water Chemistry (Stage-Specific Mineral Profiling) · 2°: Immersion · Mg-dominant early water for florals/acidity, Ca-dominant late (91→86°C) for sweetness/round mouthfeel. |
| 2026 | Andrew Delgado | Round One | Gesha / Fabio Caballero Jr. / La Salvaje, Marcala, Honduras | Hario Switch + Neo | Water Chemistry (Flavor-Highlight Water Design) · 2°: Immersion · Simple full immersion + targeted formula (50 CaCl / 10 MgCl / 10 MgSO4 / 10 silica) → florals, peach, muscat, silky body. |

