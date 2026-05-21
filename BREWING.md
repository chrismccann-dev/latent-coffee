**COFFEE BREWING MASTER REFERENCE**

*Coffee Research · Latent*

Brew Prompt · Roaster Reference · Cross-Coffee Insight Layer · Grind Reference

*Last updated: 2026-05-07. Version history in `git log`.*

# SECTION 1 - BREW PROMPT

*Coffee Research · Latent*

## How to Use This Document

This is the master brewing reference for Chris's personal coffee research. The frame matters: Chris is brewing for himself, championship-mode. The goal is to surface the experiment Chris wouldn't think of - the brewer he hasn't reached for in two months, the modifier he's never tried, the temperature staging he's been told works on a specific process. Defaults exist as a safety floor, not a comfort zone. Push extreme axes when the coffee profile warrants it. This is not cafe-repeatable; it is per-coffee optimization for a single drinker.

To start a new coffee, post the following at the top of a new conversation:

- The coffee product URL
- Dose: 15g or 18g (Chris's two formats)
- Brewing location: Home or Office (constraints differ - see Location Constraints below)
- Reference experience (optional): tasting notes from a café or elsewhere for this specific coffee
- Roaster brew guide URL (optional): paste if you have it

Claude works through the Coffee Brief, confirms the extraction strategy with Chris, and outputs a full recipe. Do not skip the strategy confirmation step - it is intentional. The strategy is the primary act of recipe design; equipment and parameters fall out of it.

### Canonical taxonomy lookups (live via MCP)

The Latent Coffee app validates every field on the resolved brew (Step 4) against canonical registries. The Latent MCP server serves these registries live; **call `read_canonical(axis: "<name>")` to fetch any one** — the axis names below are the inputs. Live fetch is preferred over any uploaded copy in the project Files; the registries change as Chris adds new producers, cultivars, brewers, etc., and stale uploads cause spurious "did you mean X?" warnings at sync time.

| Field on the resolved brew | `read_canonical` axis | Notes |
|---|---|---|
| Country + Macro Terroir | `terroirs` | `regions` is also accepted as an alias (resolves to `terroirs`); `docs://taxonomies/regions.md` is the doc-path equivalent for prose. |
| Cultivar | `cultivars` | `varieties` is also accepted as an alias (resolves to `cultivars`); `docs://taxonomies/varieties.md` is the doc-path equivalent. |
| Base Process + fermentation / drying / intervention / experimental modifiers + decaf + signature | `processes` | |
| Roaster | `roasters` | |
| Producer | `producers` | |
| Brewer | `brewers` | |
| Filter | `filters` | |
| Flavor Notes + Structure Tags | `flavors` | |
| Grinder + Grind Setting | `grinders` | |
| Roast Level | `roast-levels` | |
| Extraction Strategy | `extraction-strategies` | Strict 6-value enum (v8.4 — Hybrid promoted 2026-05-06); rarely needs lookup at Step 4. |
| Hybrid Sub-form | `hybrid-subforms` | Strict 5-value enum, required when extraction_strategy=Hybrid. |
| Extraction Modifiers | `modifiers` | Optional Axis 2 on the resolved brew. |

**Tool, not URI.** `canonicals://{axis}` URIs ALSO exist as MCP Resources (same JSON payload), but two gotchas: (1) many MCP clients (claude.ai mobile in particular) don't enumerate URI templates in the resource list, and (2) `read_doc(uri="canonicals://...")` returns "Unknown doc URI" because `read_doc` only handles `docs://` URIs. **Always use the `read_canonical(axis)` Tool**; it serves the same content and works on every client. The catalog of available axes is at `list_canonicals()`.

**Lookup discipline.** For every Step 4 field that has a corresponding taxonomy:

1. Call `read_canonical(axis: "<name>")` for the axis. If the value matches a canonical name (or an alias that resolves to canonical), use the canonical form.
2. If it does not match canonically but a close match exists (e.g. "Geisha" -> "Gesha", "Espro Bloom Flat" -> "xBloom Premium Paper Filters"), use the canonical and add a one-line note that the original term was an alias.
3. If nothing resolves, write the best guess and flag it as `(NET-NEW)`. The sync step surfaces this for a deliberate canonical-registry edit.

Drift is caught at sync time, not after. Be precise.

### Working with the Latent MCP server

A few operational notes for fetching MCP Resources and calling Tools via this Claude project:

- **Tool search ranking is opaque.** If a Tool you expect (e.g. `push_brew`, `propose_doc_changes`) does not surface on the first `tool_search`, retry with broader search terms before assuming the Tool isn't loaded. The MCP server has 32 Tools live; if `push_brew` returns nothing, try "brew", "push", or "latent" before concluding it's missing.
- **Re-fetch the schema before claiming a field is missing.** The deployed Tool manifest may be fresher than the model's session memory. If a field on `push_brew` or another Tool seems to have changed shape, call the Tool's introspection (or read the Tool's input_schema directly) before reporting it as missing.
- **After a code merge, wait for Vercel deploy and start a fresh conversation.** New MCP Tools and updated schemas propagate via Vercel's auto-deploy (~30-60 seconds typical). The claude.ai conversation's tool manifest is cached at conversation start; a fresh conversation picks up the new manifest. Reusing an old conversation after a server-side change can produce stale-tool errors that look like real bugs but are cache propagation issues.

## Location Constraints

## Office (Downtown Palo Alto)

| **Field**                     | **Details**                                                                                                                                                                                                                                                                                                                                                                               |
|-------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Brewers**                   | April Brewer Glass, Kalita Wave Tsubame 155, SWORKS Bottomless Dripper. (XBLOOM available but manual preferred.)                                                                                                                                                                                                                                                                          |
| **Filters**                   | xBloom Premium Paper only (compatible with both Kalita Wave 155 and Bottomless Dripper).                                                                                                                                                                                                                                                                                                      |
| **Water**                     | Tap water - Downtown Palo Alto municipal supply. Do not assume soft or mineralized water. No water adjustments available.                                                                                                                                                                                                                                                                 |
| **April Brewer**              | OFFICE: drains ~2:30 with xBloom Premium Paper regardless of grind. Strong fit for integration / Suppression / mid-palate work — works well on heavy-roast / loud beans where the brew layer needs to control rather than push (e.g. Mandela XO heavy-suppression brewing). Not suitable for Full Expression at the office (use Kalita 155 or SWORKS Bottomless when high agitation is needed).                                                                                                                                                                                                                                       |
| **Kalita Wave 155**           | Reliable 3:00–3:30 drawdown with xBloom Premium Paper. Pour structure and rest timing are the primary extraction levers. NOTE: runs faster than expected even at finer grind - use Bottomless Dripper when precise flow control is needed.                                                                                                                                                         |
| **SWORKS Bottomless Dripper** | Variable-flow valve dripper. Cone geometry, uses 155 flat or wave filters (xBloom Premium Paper at office). Valve dial restricts or opens flow mid-brew - each pour phase can have an independent valve state (Restricted / Half-Open / Open). Primary office brewer for Balanced Intensity and Full Expression when contact time management is critical. See Valve Position Reference below. |

## Home

| **Field**     | **Details**                                                                                                                                                     |
|---------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Equipment** | Full equipment inventory as listed in the Equipment Reference below.                                                                                            |
| **Water**     | Distilled + remineralized with Third Wave Water packs (Light Roast packet diluted ~1:3 concentrate-to-distilled, topped up with pure distilled to brew volume). |

## The Two-Axis Framework

This system uses two orthogonal axes to describe a brew. Every brew names a position on Axis 1 (extraction strategy) and may add one or more modifiers from Axis 2. Modifiers are optional and require explicit justification. They are not defaults.

The default extraction strategy in the brewing literature is "Clarity-First on washed coffee." Chris is past that ceiling. Most coffees he brews are processed lots with intentional fermentation, dense varieties, or unusual cultivars that have a higher expressive ceiling than Clarity-First reaches. Default Clarity-First on these coffees is a conservative miss, not a safe baseline. Push the strategy toward what the coffee actually needs at Step 1d, not toward the safest choice.

### Axis 1 - Extraction Strategy

One of six named strategies. Strategy selection is the primary act of recipe design and is confirmed at Step 1d before any equipment, parameters, or modifiers are decided. **Five describe extraction intensity** (single-mode logic running throughout the brew): Suppression / Clarity-First / Balanced Intensity / Full Expression / Extraction Push. **The sixth describes extraction structure** (phase boundaries where the brewer changes mode mid-brew): Hybrid. The selection rule between intensity-vs-structure is mechanical: if the brewer changes mode (immersion <-> percolation, or pours have explicitly different sensory jobs), it is Hybrid; otherwise pick from the five intensity strategies.

Within the five intensity strategies, two pairs share mechanics but differ in intent: **Suppression / Clarity-First** share coarse grind + low temp + low agitation but differ in whether you are holding an over-expressive coffee back vs protecting a delicate one from being overworked. **Full Expression / Extraction Push** share fine grind + high temp but differ on the agitation lever (push the bed vs control turbulence with Melodrip) and on the coffee class (heavy ferment vs clean transparent). The agitation lever is the strategy choice for these two.

**Suppression.** Used when the coffee has *more* expressive material than is desirable to fully extract. Heavy fermentation or processed lots where wine/booze/phenolic notes dominate if extraction is allowed to run normally. Intent: deliberately limit extraction to keep harshness from coming through while still developing sweetness. Mechanics: lower temperature (88-92°C, often the primary lever), coarser grind (6.7-6.5), low agitation, low-moderate ppm water, often pulse-pour structure with kettle held off-base or actively cooled. Looks mechanically similar to Clarity-First but opposite in logic. Confirmed pattern: anaerobic naturals where temperature primacy resolves the cup (Hydrangea Finca Inmaculada, Basha Bekele Kokose). Reference recipe outside this archive: Carlos Medina, 2023 WBrC champion (CGLE Sidra, 91°C, 5x50g pulses every 30s).

**Clarity-First (default for transparent / variety-driven coffees).** Used when the coffee's expressive ceiling is already moderate and the goal is preserving aromatic and structural transparency. The cup has enough; extract gently and let it speak. Mechanics: 6.8-6.5, low agitation (Melodrip), fast-flow filters, 1:16-1:17, moderate temp (91-94°C). Best for washed Gesha, Ethiopian washed landraces, Sydra/Typica Mejorado, Laurina, climate-controlled Esmeralda "NC" naturals. Risk: turbulence flattening acidity; over-extraction producing tannin in coffees with intrinsically light body.

**Balanced Intensity.** Used when the coffee has more density or complexity than Clarity-First can express but has not crossed into needing aggressive extraction. Honey lots, dense varieties (Pacamara, Mokkita), most yeast-inoculated experimental lots, Gesha anaerobic honey lots. Mechanics: 6.5-6.3, moderate agitation, 1:15-1:16, 93-95°C, often with controlled flow (xBloom Premium Paper, SWORKS Restricted valve through main pours). Sits between Clarity-First's gentleness and Full Expression's force.

**Full Expression.** Used when the coffee will under-deliver at any lower extraction. Heavy co-ferments, anaerobic washed Colombian Geshas (Huila/Cauca), anoxic naturals, heavy thermal-shock washed lots, dense washed varieties with fruit-forward roaster intent. The coffee will not open up without force. Mechanics: 6.3-5.5 (or finer), **high agitation - active spiral, multiple pours, push the bed**, near-boiling water, longer brew time, 1:13-1:17. Melodrip is *not* part of Full Expression. Agitation is the defining mechanic; if you are using Melodrip on a fine-grind / high-temp recipe, you are doing Extraction Push, not Full Expression. Risk: astringency, drying finish, structural collapse if the coffee can't actually take it.

**Extraction Push (for Clarity).** Used when a *clean* coffee (washed processed lots, washed Geshas, Esmeralda climate-controlled naturals) will benefit from higher yield than Clarity-First produces, but where Full Expression's high agitation would compress the aromatic clarity that makes the coffee worth drinking. Intent: push extraction yield while preserving transparency. Same fine-grind + near-boiling-temp mechanics as Full Expression, but **the agitation lever is inverted**. Melodrip controls turbulence so structure and aromatic separation survive the push. Mechanics: 6.3-5.5 (or finer), **low agitation (Melodrip)**, fast-flow filters (Sibarist FAST flat or cone), near-boiling water (93-98°C), 1:15-1:17, often longer total brew time than Clarity-First but cleaner cup than Full Expression. Reference recipes outside this archive: Martin Wölfl 2024 WBrC champion (Don Benji Gesha natural anaerobic, OREA V4 + Sibarist FAST + 490 µm + Melodrip, 93°C); Jackie Tran (HLE Gesha anaerobic natural, flat-bottom + 600 µm + 94°C with full-drawdown pours); Savina Giachgia (similar Melodrip-based clarity-push approach). Currently empty in this archive. Empty-slot status is acceptable; Suppression was also empty when promoted to a named strategy in v8.0.

**Hybrid (v8.4).** Used when the brew is structured around phase boundaries with different jobs assigned to each phase, rather than a single extraction logic running throughout. The brewer changes mode mid-brew - typically immersion → percolation via valve open. Intent: assign distinct sensory targets to distinct phases rather than balancing all of them in one extraction logic. Mechanics: hardware is the **Hario Switch at home** (canonical) or the **SWORKS Bottomless Dripper at the office** when valve transitions are doing strategic work (Dial 0-5 = immersion-like, Dial 6-7 = percolation finish). Recipes specify phase boundaries explicitly (e.g. `0:00-1:30 closed immersion, 1:30-3:00 opened percolation finish`). Intensity range becomes a recipe parameter; the strategy declaration is about structure. Sub-form is required at strategy time:

- **Sequential.** Immersion phase then percolation phase (or reverse), each doing one job. Closest to the canonical Switch recipe and the SWORKS slow/slow/open pattern (closed bloom + restricted main + open finish "to rinse rather than steep"). Currently confirmed across three Geshas: Janson Green-Tip 1010, Sebastian Ramirez White Honey, Finca La Reserva.
- **Phase-Mapped.** Each phase carries two parallel labels (formal split, locked 2026-05-15 - see CONTEXT.md § Phase / Mechanical role / Cup-side target): a **mechanical role** (what the brewer is doing on that phase - restricted-flow immersion, drain-mode percolation, Melodrip-tapered pour, valve-cracked transition, kettle-off-base decline, etc.; vocabulary is open-ended and ties to whichever WBC foundational axis is being engaged) plus a **cup-side target** drawn from the canonical 5-attribute set `aroma / attack / mid-palate / body / finish`. The two labels are orthogonal - recipe-design picks both at brief time. More deliberate than Sequential: the per-phase role + target are named at brief time, and iteration targets the failing-target pour rather than the whole recipe (e.g. "the mid-palate-targeted Pour 2 came in thin, adjust Pour 2's mechanical role, not Pour 1's"). Phase-to-target mapping is soft - typical defaults exist (bloom -> aroma, last pour -> finish) but recipes vary in pour count and a phase often touches multiple attributes; design-time pairings are aspirations, not guarantees. Closest to the existing SWORKS valve-driven recipes (Tamarind, El Placer) when re-framed by intent rather than by valve mechanics.
- **Selective Bloom.** Bloom liquid is separated from main brew, evaluated independently, and either added back or discarded. Bridges Hybrid and Output Selection - classify under Hybrid when bloom-separation IS the strategy. Eline Ferket 2025 pattern.
- **Intensity-Clarity Split.** Immersion phase builds tactile body and integration; percolation phase recovers clarity and aromatic definition. Phase order matters (intensity first, clarity second). Most likely fit for heavy co-ferment lots on the SWORKS where the goal is structured extraction without muddiness.
- **Temperature-Staged.** Phase boundaries coincide with temperature changes (e.g. low-temp closed immersion for aroma preservation, then high-temp opened percolation for structure). Distinct from a standalone Inverted Temperature Staging modifier because the temperature change is bound to the phase boundary rather than running independently.

Reference recipes outside this archive: Garam Victor Um (sequential immersion-to-percolation hybrid, 2023 mesh-then-paper Switch variant - mesh swap not in our equipment set); Ryan Wibawa (Switch immersion staging); Eline Ferket (Selective Bloom Hybrid); Justin Bull (Phase-Mapped Hybrid). Currently archive has 3 Sequential confirmed brews and 0 in the other 4 sub-forms - empty-slot status acceptable, sub-forms get populated as deliberate experiments hit. See [docs/skills/brewing-historian/cluster/patterns/by-strategy/hybrid.md](docs/skills/brewing-historian/cluster/patterns/by-strategy/hybrid.md) for the SWORKS slow/slow/open template (migrated from BREWING.md § Cross-Coffee Insight Layer > Coffees That Confirmed Hybrid in Wave 2 PR 2, 2026-05-26).

### Axis 2 - Modifiers (orthogonal techniques)

Modifiers are optional layered techniques that operate on different mechanical axes than extraction intensity. A brew may have zero, one, or multiple modifiers. When a modifier is used, it is named explicitly in the recipe and the resolved brew. Modifiers require justification at Step 1d. They are not a default. But Chris is past the "modifiers are exotic" phase. If a modifier is plausible for the coffee at hand, propose it - don't reserve modifiers for the third or fourth iteration.

**Output Selection.** Reshaping the cup by discarding portions of the extraction curve, OR by adding water post-brew. Four forms: *early cut* (remove first 5-10g of brewed liquid - typically saline / under-developed / sharp), *late cut* (stop short of target yield to avoid drying / astringent late fraction), *both* (keep only the middle band), or *dilution* (post-brew water added to a fully-brewed cup; persists structurally as `dilution_g` on the modifier). Most useful on coffees with extreme fronts or backs (cuts) or coffees where extraction is good but body / concentration is too heavy for the target serving size (dilution). Heavy co-ferments where the bitter tail is geographically concentrated in the late fraction, processed lots where the early fraction reads as off rather than expressive, or anaerobics where 1:14.5 lands the flavor target but the cup feels syrupy until +10-15g water dial it back. Compatible with any strategy. Cup volume implication: brew target weight is no longer cup weight; recipe must specify both. *Front cut* / *back cut* are nomenclature aliases of *early cut* / *late cut* per the WBC corpus (see [docs/skills/wbc-brewing-archivist/cluster/wbc-reference.md](docs/skills/wbc-brewing-archivist/cluster/wbc-reference.md) § Output Selection extension). *Bloom separation* is structurally a Hybrid (Selective Bloom) sub-form, not an Output Selection form. Reference recipes outside this archive: Carlos Escobar 2025 WBrC 3rd place (Maracaturra mossto natural, Hario Switch, remove first 8-10g, cut at 155g of intended target, hybrid immersion -> percolation).

**Inverted Temperature Staging.** Starting low and ending high, opposite of natural decline or stable-on-base. Premise: low-temp opening extracts sweetness and volatile aromatics without pulling phenolic / bitter compounds; raising temperature on a partially-extracted bed builds structure on what's already in solution. Reference recipe outside this archive: Ryan Wibawa 2024 (Hario Switch, blend across natural / thermaloak / mossto anaerobic, 86°C -> 92°C across two immersion phases). Compatible with Balanced Intensity or Full Expression strategies. Generally not Clarity-First (counterproductive on already-light coffees) or Suppression (high-temp finish defeats the suppression intent). Most worth testing on coffees that go thin/sour at full Clarity-First but bitter at standard Balanced - the "neither lever resolves it" cases.

**Aroma Capture.** Mid-brew cooling of the early extract fraction to preserve volatile aromatics that would otherwise dissipate as the cup is brewed and served hot. Hardware available at home: Paragon chilling ball applied to the carafe during/immediately after the early pours, or covered server to trap aromatics. Reference recipes outside this archive: Giacomo Vannelli (frozen ball on first 50g of extract), Wataru Iidaka (dry ice on first phase + covered server). Most useful on highly aromatic coffees (washed Geshas, Esmeralda climate-controlled naturals, anaerobic naturals where florals are the target). Compatible with any strategy. Home only - Paragon chilling ball is not part of the office equipment set.

**Role-Based Pulse (v8.5).** Applies the same formal split as Phase-Mapped Hybrid above (mechanical role + cup-side target per pour, with cup-side targets drawn from the canonical 5-attribute set `aroma / attack / mid-palate / body / finish`) on a percolation-only brewer where the recipe doesn't involve a valve transition or immersion phase. The v8.4 reasoning ("Phase-Mapped Hybrid covers Role-Based-Pulse-with-immersion") is preserved - RBP-as-modifier applies *only* when there's no immersion phase. Hardware: Hario V60 / Orea v4 / Kalita Wave / April Brewer / Chemex. Mechanics: each pour weight + technique is selected for the role it plays in the cup. Typical pour count is 3-4; the per-pour role + target are picked at brief time. Pour 1 might pair a gentle low-agitation mechanical role with an aroma cup-side target; Pour 2 a heavier slower-spiral role with a body or mid-palate target; Pour 3 a Melodrip role with a finish target. *Agitation taper* is one shape of this modifier - same RBP logic, where the per-pour role differentiation lives on the agitation axis (high energy early, low energy late). Reference recipes outside this archive: Justin Bull 2025 (US Brewers Cup 1st, percolation phase highlights acidity, immersion phase builds sweetness/body - the *percolation-phase* logic is the RBP analog applicable on a non-Switch brewer). Compatible with Clarity-First, Balanced Intensity, Full Expression, and Extraction Push. Not compatible with Hybrid (the RBP-with-immersion case is the Phase-Mapped sub-form - pick the strategy, not the modifier) or Suppression (the suppression intent doesn't differentiate per-pour roles). Currently empty in this archive - empty-slot status is acceptable, same as Suppression pre-Inmaculada and Extraction Push pre-archive.

> **v8.4 note (2026-05-06):** the v8.3 *Immersion* modifier was removed and absorbed into the **Hybrid** strategy via `hybrid_subform`. What was previously documented as "Balanced Intensity + Immersion (Switch staging)" is now "Hybrid (Sequential)" with intensity range as a recipe parameter. Brewer hardware (Hario Switch + SWORKS Bottomless Dripper) and contact-time framing carry over to the Hybrid section above; the modifier slot is gone.

> **v8.5 note (2026-05-08):** *Role-Based Pulse* promoted from the wbc-reference.md "consciously not pursuing" list to a 4th canonical modifier (percolation-only sub-case of Time Distribution). Time Distribution as a foundational axis remains a deliberate non-add — RBP captures the percolation-only sub-case discretely. *Output Selection* gained a 4th form (`dilution`) with optional `dilution_g`. The other cross-cutting WBC control patterns (water strength / agitation taper / filter behavior / pre-brew conditioning) deliberately stay in the [docs/skills/wbc-brewing-archivist/cluster/wbc-reference.md](docs/skills/wbc-brewing-archivist/cluster/wbc-reference.md) doc layer rather than promoting to canonical modifiers — Chris's "keep compact strategy set, add separate doc layer" framing.

### Strategy + Modifier Notation

Examples of how a brew is described under this framework:

- *Hydrangea Finca Inmaculada Gesha Natural*: **Suppression** - temperature primacy, 6.4 / 93°C / Kalita + xBloom Premium Paper.
- *Moonwake Jeferson Motta*: **Full Expression** (no modifiers) - 6.0 / 98°C / 1:15, active spiral.
- *Moonwake El Eden Tamarind Washed*: **Full Expression + Output Selection (late cut)** - flagged for re-evaluation; informal pre-framework testing showed late-cut benefit.
- A future Esmeralda Gesha brew testing aroma preservation: **Clarity-First + Aroma Capture** - Paragon chilling ball on bloom + Pour 1.
- A future test on an anaerobic natural that doesn't resolve at Suppression: **Balanced Intensity + Inverted Temperature Staging** - 88°C -> 94°C across two phases.
- A future test on a clean washed Gesha pushing yield while preserving clarity: **Extraction Push** - 5.8 / 95°C / Sibarist FAST + Melodrip / 1:16, Wölfl-style.
- *Comp Edition Janson Green-Tip Gesha Anaerobic 1010* (Picolot): **Hybrid (Sequential)** - SWORKS slow/slow/open: Dial 0 closed bloom (20s) + Dial 5 restricted main pours + Dial 7 open finish to "rinse rather than steep" on yeast-anaerobic naturals.
- A future test re-framing the Tamarind reference recipe: **Hybrid (Phase-Mapped)** - same execution as the existing Full Expression recipe (Dial 5 mid-pours, Dial 6 transition late Pour 3) but framed as: Pour 1 = saturation, Pour 2 = body building (near-immersion), Pour 3 transition = clarity finish.
- A future test of bloom-as-strategy on an aromatic Clarity-First lot: **Hybrid (Selective Bloom)** - separate bloom liquid from main brew, evaluate independently, recombine if bloom tastes complete or discard if it tastes harsh.
- A future test on a clean washed Gesha on Orea v4 with explicit per-pour roles (no immersion): **Clarity-First + Role-Based Pulse** - Pour 1 (50g) = saturation gentle, Pour 2 (90g) = body building (slower spiral), Pour 3 (90g) = clarity restoration (Melodrip).
- A future test on the same coffee where the RBP differentiation lives on the agitation axis: **Clarity-First + Role-Based Pulse** (agitation taper) - Pour 1 = moderate spiral for saturation/sweetness development, Pour 2 = lower agitation for body, Pour 3 = Melodrip / center-pour for finish clarity.
- A future test on a heavy anaerobic where extraction is good but body too syrupy at 1:14.5: **Full Expression + Output Selection (dilution)** - brew to target, then add 12g water post-brew to dial back concentration without re-running the recipe.

### Brewer rotation discipline

Chris owns 11 brewers spanning 4 geometries (cone, flat, wave, immersion-hybrid). Most days the same one or two get used. At Step 2 (Recipe Output), Claude should propose the brewer that best fits the strategy and coffee profile, even if it means reaching for one Chris hasn't used in a month - Orea v4 for a flat-bottom Clarity-First test, Hario Switch for a Hybrid (Sequential) or Hybrid (Selective Bloom) test (v8.4), Chemex Funnex for a small-dose Clarity-First brew, Sibarist Brewing System when the dripper/paper interface needs to be eliminated as a variable. The "default brewer" trap is the same shape as the "default strategy" trap. See Equipment Reference for the rotation framework.

The WBC corpus is the substrate for "what brewer fits which canonical recipe pattern": Hario Switch is the canonical Eline Ferket 2025 Selective Bloom Hybrid vehicle; Orea v4 + Sibarist FAST + Melodrip is the canonical Wölfl 2024 Extraction Push setup; SWORKS Bottomless Dripper is the closest Carlos Medina 2023 Suppression analog (different brewer, same pulse-pour discipline with valve-restricted flow standing in for the explicit kettle-pulse pattern). Pull [docs/skills/wbc-brewing-archivist/cluster/wbc-reference.md](docs/skills/wbc-brewing-archivist/cluster/wbc-reference.md) for the lookup, [docs/skills/wbc-brewing-archivist/cluster/wbc-recipes.md](docs/skills/wbc-brewing-archivist/cluster/wbc-recipes.md) when you need a specific competitor's recipe.

## Step 1 - Coffee Brief (Claude runs this automatically)

Before selecting any equipment or parameters, Claude must complete a Coffee Brief by reasoning through the following in order:

**1a. Web search for roaster brew guide**

Search for a brew guide from this roaster for this coffee. If found, note the key parameters (ratio, grind direction, temperature, agitation level). Do not follow it blindly - use it as a signal about the roaster's extraction intent for this coffee. If not found, note that and proceed.

**1b. Process and variety risk flags**

Evaluate the coffee's process and variety against the Process / Variety Signal table in this document. Explicitly state whether any flags apply. This determines whether the default Clarity-First strategy is appropriate or whether a different extraction strategy should be considered from the start.

**1c. Brief summary**

In 3–5 sentences: what is this coffee, what does the terroir and cultivar suggest about likely expression, what does the process tell you about extraction behavior, and what does the roaster's positioning (if known) suggest about intent?

**1d. Proposed extraction strategy and modifiers**

Based on the above, propose one of the six extraction strategies below and explain why. Then, separately, assess whether any modifiers (Output Selection, Inverted Temperature Staging, Aroma Capture) are warranted for this specific coffee. Most coffees will not warrant any. If a modifier is proposed, justify it explicitly. Then pause and ask for confirmation before proceeding to the recipe.

| **Strategy**                | **Grind Range**    | **Temperature**         | **Typical Agitation**                                                | **Ratio Tendency** | **Best For**                                                                                                                                                                                                                                                                             |
|-----------------------------|--------------------|-------------------------|----------------------------------------------------------------------|--------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Suppression**             | 6.7-6.5            | 88-92°C (primary lever) | Low - pulse pours, no agitation                                      | 1:15-1:16          | Anaerobic naturals where temperature primacy resolves bitter tail; coffees where full extraction would surface fermentation harshness                                                                                                                                                    |
| **Clarity-First (default)** | 6.8-6.5            | 91-94°C                 | Low - Melodrip, gentle spiral                                        | 1:16-1:17          | Washed Gesha, Ethiopian washed landraces, Sydra/Typica Mejorado, Laurina, Esmeralda "NC" climate-controlled naturals                                                                                                                                                                     |
| **Balanced Intensity**      | 6.5-6.3            | 93-95°C                 | Moderate - controlled spiral, some bed exposure                      | 1:15-1:16          | Honey lots, dense varieties (Pacamara, Mokkita), most yeast-inoculated experimental lots, Gesha anaerobic honey                                                                                                                                                                          |
| **Full Expression**         | 6.3-5.5 (or finer) | 95-99°C                 | **High - active spiral, multiple pours, push the bed**               | 1:13-1:17          | Heavy anaerobic, anaerobic washed Colombian Geshas, anoxic naturals, dense washed varieties with fruit-forward intent, high-EY roasters (Sey, Flower Child, Picky Chemist, Dak). Note: on the EG-1, grind below 5.5 changes distribution shape but not D50 - temp / agitation / filter / time are the primary levers. |
| **Extraction Push**         | 6.3-5.5 (or finer) | 93-98°C                 | **Low - Melodrip, clarity-preserving**                               | 1:15-1:17          | Clean coffees where Clarity-First leaves yield on the table but Full Expression's high agitation would compress aromatic clarity: clean washed Geshas, Esmeralda climate-controlled naturals, washed processed lots with Wölfl/Tran/Giachgia targets. Empty in this archive (promoted strategy v8.2, awaiting first confirmed brew). |
| **Hybrid** (v8.4)           | Varies by sub-form | Varies by sub-form (often staged) | Phase-dependent — different per phase by design                  | 1:14-1:17          | Switch-style brews and SWORKS valve-driven brews where each phase has a different job. Sub-form selected at brief: Sequential / Phase-Mapped / Selective Bloom / Intensity-Clarity Split / Temperature-Staged. Currently 3 Sequential confirmed brews; 4 sub-forms empty. |

Suppression and Clarity-First share grind range and look mechanically similar, but the *intent* differs. Always state the intent explicitly. Full Expression and Extraction Push share fine grind + high temp but differ on the agitation lever - high agitation pushes the bed (Full Expression); Melodrip controls turbulence to preserve clarity (Extraction Push). The agitation lever choice IS the strategy choice for these two. Going below grind 6.3 is a different philosophy, not a tweak. For the highest-EY roasters, going below 5.5 may be required - but see Grinder Notes.

**Modifier check (required at Step 1d, even if the answer is "none"):**

- **Output Selection** - Is there a structural reason to discard part of the extraction OR to dilute the cup post-brew? Heavy co-ferments often benefit from a late cut. Lots with sharp/saline fronts may benefit from an early cut. Anaerobic naturals where 1:14.5 lands the flavor target but the cup feels syrupy may benefit from `dilution` (form=`dilution`, `dilution_g` populated). Default: none.
- **Inverted Temperature Staging** - Has this coffee or process type historically been resistant to both Clarity-First and Balanced lever moves? Inverted staging is the experimental fallback when the standard temperature primacy rule does not resolve the cup. Default: none.
- **Aroma Capture** - Is this a highly aromatic coffee (Esmeralda Gesha, washed Gesha, anaerobic natural with floral target) where mid-brew cooling could preserve volatiles? Hardware available at home only (Paragon chilling ball). Default: none.
- **Role-Based Pulse (v8.5)** - On a percolation-only brewer (V60 / Orea / Kalita / April / Chemex), is each pour going to carry a named **mechanical role + cup-side target** pair (per the formal split - see Phase-Mapped Hybrid definition above)? Cup-side targets draw from the canonical 5-attribute set `aroma / attack / mid-palate / body / finish`; mechanical roles are open-ended (gentle saturation pour, body-building slow spiral, Melodrip clarity-restoration pour, etc.). Default: no. Flag when the recipe is structured around per-pour role + target pairs rather than around pour-rhythm. Reference: Justin Bull 2025 percolation-phase logic without the Hybrid immersion phase. *Agitation taper* (high-energy early, low-energy late) is one shape of this modifier - same RBP logic on the agitation axis.

> **v8.4 note (2026-05-06):** *Immersion* removed from this list - what was the Immersion modifier is now the **Hybrid** strategy (Axis 1) with `hybrid_subform` set. Strategy-level decision, not a modifier. Picking Hybrid forces a sub-form choice; you cannot stack "Hybrid + Immersion modifier."

**Named considerations (v8.4 - state explicitly even if the answer is the default):**

- **Cooling-Curve Design** - Is this a coffee where peak evaluation window IS the strategy? Default: no, evaluate normally as cup cools. Flag explicitly when peak evaluation is below 50°C (most El Paraíso, Garrido Mokka/Mokkita, anaerobic naturals, anoxic naturals, Picolot competition lots) so the strategy declaration includes "design for and evaluate at 40-45°C" rather than discovering it three iterations in. Persists in `cooling_curve_target` as free-text on the brew row. Most brews answer null/normal and move on; the discipline is in being asked.

- **WBC corpus + cross-cutting control patterns check (v8.5)** - Does this coffee profile match a catalogued WBC recipe shape we haven't tried, or a cross-cutting calibration move worth flagging? Pull [docs/skills/wbc-brewing-archivist/cluster/wbc-recipes.md](docs/skills/wbc-brewing-archivist/cluster/wbc-recipes.md) when reaching for a non-default move (the 102-recipe corpus is the substrate for "experiment Chris wouldn't think of"); pull [docs/skills/wbc-brewing-archivist/cluster/wbc-reference.md § Cross-Cutting Control Patterns](docs/skills/wbc-brewing-archivist/cluster/wbc-reference.md) when a calibration axis (water strength / agitation taper / filter behavior / pre-brew conditioning) might be the real lever. Default: none. Flag explicitly when a 2024-2025 finalist's recipe pattern is structurally close to what this coffee is asking for (e.g. anaerobic natural with floral target → Vannelli Aroma Capture pattern; clean washed Gesha pushing yield → Wölfl Extraction Push canonical; bloom-as-strategy → Ferket Selective Bloom Hybrid), or when a calibration axis other than the strategy/modifier set is doing the load-bearing work (e.g. "this is Clarity-First mechanically but the real move is dropping water from 90ppm to 50ppm"). Persists as free-text in `strategy_notes` when relevant. Most brews answer null/normal and move on.

If any modifier is proposed, output a 1-2 sentence rationale explaining what the modifier is meant to solve for this specific coffee and what the risk is if the modifier is wrong (e.g. early cut too aggressive → weak cup; inverted staging → under-extracted finish). Wait for confirmation on both strategy and modifier(s) before proceeding to Step 2.

## Step 2 - Recipe Output (after strategy is confirmed)

Once the extraction strategy and any modifiers are confirmed, select the brewer and filter based on the brewing location, then output a full recipe using the format below.

## Output Format

| **Field**             | **Value**                                                                                            |
|-----------------------|------------------------------------------------------------------------------------------------------|
| **Coffee**            |                                                                                                      |
| **Strategy**          | [Suppression / Clarity-First / Balanced Intensity / Full Expression / Extraction Push / Hybrid]      |
| **Hybrid Sub-form**   | [only if Strategy = Hybrid: Sequential / Phase-Mapped / Selective Bloom / Intensity-Clarity Split / Temperature-Staged] |
| **Modifiers**         | [None / Output Selection (form, including dilution) / Inverted Temperature Staging / Aroma Capture / Role-Based Pulse / multiple]            |
| **Cooling-Curve Target** | [only if peak evaluation window IS the strategy, e.g. "40-45°C peak"; omit otherwise]               |
| **Brewer**            | [brewer + valve position note if Bottomless Dripper]                                                 |
| **Filter**            |                                                                                                      |
| **Dose**              |                                                                                                      |
| **Water**             | [total brew weight]                                                                                  |
| **Cup Yield**         | [only if Output Selection used; specify what is kept and what is discarded]                          |
| **Grind**             |                                                                                                      |
| **Temp**              | [include staging if Inverted Temperature Staging modifier active]                                    |
| **Bloom**             | [weight], [pour time], wait [time]                                                                   |
| **Pour Structure**    | [list each pour with weight, duration, wait, and - for Bottomless Dripper - valve state per phase. If Aroma Capture modifier active, note where chilling ball is applied. If Strategy = Hybrid, note phase boundaries (lever/valve transitions) and what each phase is doing - e.g. "0:00-1:30 immersion, 1:30-3:00 percolation finish".] |
| **Target Total Time** |                                                                                                      |

After the recipe table, provide three short sections:

- Why this brewer and filter combination was selected (2-3 sentences referencing the confirmed extraction strategy and brewing location constraints).

- What to watch for in the first brew - specific risk flags given this coffee's profile.

- If any modifier is active: a Modifier Note explaining what the modifier is meant to do, how to evaluate whether it worked, and the failure mode (e.g. for Output Selection late cut: "if cup reads thin or under-developed, the cut was too early; if drying tail persists, cut earlier").

- If Strategy = Hybrid: include a Hybrid Phase Note explaining what each phase is meant to do, how to evaluate whether the phase boundary timing worked (Sequential = does each phase deliver its target?; Phase-Mapped = does each pour-role land?; Intensity-Clarity Split = does the percolation finish recover the clarity that the immersion phase added body to?), and the failure mode if phase timing was wrong (early valve open → thin body / muddled phase roles; late valve open → over-extracted finish / muddiness).

- If Bottomless Dripper is selected: include a Valve Strategy note explaining the rationale for valve state at each pour phase, and what to adjust if the cup reads bitter (open earlier) or flat/sour (stay restricted longer).

## Step 3 - Iteration Loop

After each brew, provide tasting notes covering aroma, attack, mid-palate, body, and finish. Note how it changes as it cools.

Claude will respond with adjusted parameters. **Adjustment width is scale-dependent - concretely mapped to the iteration's position in the search**, mirroring the roasting-side Adjustment rule (CONTEXT.md § Adjustment; Brew 1 is the brewing analog of V1):

- **Brew 1 (and often Brew 2)**: wide-variance, multi-variable exploratory. When the response surface is unknown for this coffee (new producer, new process signature, unfamiliar cultivar at this elevation, or the Coffee Brief's Step 1d confirmation flagged anything as uncertain), it's appropriate to move two or more variables at once - e.g. dropping temperature 2°C while coarsening one grind notch - to map roughly where the cup wants to live before refining. The geography analogy applies: you have the world map, you have to pick the continent and then the country before the state and the city; in the beginning when you don't yet know what country you're in, it's fine adjusting more things. Wide-variance multi-variable does **not** mean "change everything at random" - each move is still motivated by a specific tasting signal.

- **Brew 2 to Brew 3**: narrow on Brew 2's leading direction, usually single-variable. Once a directional signal lands ("warmer + finer pulled fruit forward, but the finish dried"), the next move isolates one knob at a time so the cause attribution stays clean. This is the classical "pick one variable, hold the rest constant" rule - it's the right rule in the convergent regime, not in the search regime.

- **Brew 3+**: probe a variable held constant across Brews 1-3 (filter swap, brewer swap, modifier addition, or a Named Consideration like Cooling-Curve Target evaluation) or replicate the leading recipe as a control. Most brews resolve in 2-3 iterations; Brew 4+ is unusual and usually signals either a strategy pivot is overdue or a previously-unconsidered axis (cross-cutting WBC pattern, water strength, filter behavior) is doing the load-bearing work.

**Override**: if a brew explicitly demands re-bracketing ("the cup is so far from the target I don't trust the search neighborhood at all"), widen the spread regardless of brew number - usually this means a strategy pivot, not a parameter widening. The Motta-prevention value of the single-variable rule is preserved by keeping it the default once a directional signal is in hand; the softening is for early-iteration multi-variable exploration before that signal exists.

At each iteration, Claude must also assess:

- Are we making incremental progress, or does something feel structurally wrong (consistently sour, flat, hollow, or one-dimensional despite multiple tweaks)?

- If 2–3 iterations in and the cup still feels off structurally, Claude should flag this explicitly and ask whether to pivot extraction strategy rather than continue tweaking parameters within the current one.

- If the confirmed extraction strategy seems mismatched to what you are tasting, Claude should recommend a strategy pivot and explain what that would change about the approach.

- If a modifier is active and the expected effect is not present (e.g. Output Selection late cut applied but drying tail still present in the kept fraction), Claude should diagnose whether the modifier was wrong, the modifier parameters were wrong (cut at the wrong point), or the underlying strategy is mismatched and the modifier is masking the issue. If a modifier is *not* active and the iteration loop suggests one would help (e.g. persistent bitter tail at correct strategy → late cut is a candidate), Claude should propose adding it and explain the rationale.

- For Bottomless Dripper brews: valve position is always adjusted before grind. Thin or sharp → close valve more (more restriction), do not go finer. Muddy or flat → open valve earlier (less restriction), do not go coarser; also check if closed bloom exceeded ~25s. Bitter → shorten contact time by opening sooner in the final pour. Only adjust grind after valve position has been optimized.

The goal of iteration is not parameter optimization within a fixed approach. It is finding the right neighborhood first, then dialing within it.

## Step 4 - Resolved Brew Output Format

Once a recipe is confirmed as the reference brew for a coffee (iteration complete, extraction strategy validated, cup meets roaster tasting notes), output the resolved brew in the format below. **The Latent Coffee app's Claude-authored sync reads this block directly and validates each field against the canonical registries.** Every field below has a corresponding `canonicals://` MCP Resource - fetch them before populating, per the Lookup discipline in "How to Use This Document". Drift is caught at sync time, not after.

**Output convention.** Format each section as a key/value list (one field per line, `Field: value`). Do not collapse multiple fields into one cell. Plain hyphens, no em-dashes, except where they appear inside a free-text value Chris already wrote. When pasting from Claude.ai chat into a plain-text app context, structural separators (tabs, table cells) can get stripped - keep each `Field: value` on its own line so a label-boundary parse can recover the structure if needed.

---

### Coffee identity

- **Roaster** - canonical roaster name from `canonicals://roasters` (e.g. `Picolot (Brian Quan)`, `Hydrangea Coffee`, `Moonwake Coffee Roasters`). If you find a short alias in your prompt context, resolve it to canonical (e.g. `Picolot` → `Picolot (Brian Quan)`). If the roaster isn't in the registry, write it verbatim and flag `(NET-NEW)`.

- **Coffee Name** - the roaster's name for the coffee (e.g. `Emerald`, `El Velo Natural`, `Comp Edition - Janson Green-Tip Gesha Natural Anaerobic 1010`). Do not embed producer or variety unless the roaster's product page does.

- **Lot Code** - if the roaster published one (e.g. `PL#015`, `74158`, `CF10`, `1010`). Omit if absent.

- **Producer** - canonical producer name from `canonicals://producers`. The registry uses the form `Person, Farm`, `Person (Farm)`, or `Family (Farm)` depending on how the producer is most commonly referenced (e.g. `Mama Cata Estate (Garrido Family)`, `Diego Samuel Bermúdez Tapia`, `Jannette & Kai Janson (Janson Farms)`). Look up the canonical form first; if the producer isn't there, write your best `Person, Farm` form and flag `(NET-NEW)`.

- **Roast Date** - `YYYY-MM-DD`.

- **Roast Machine** - if disclosed (e.g. `S7X`, `Loring S15`, `Probat P12`). Omit if unknown.

- **Roaster Tasting Notes** - the descriptors the roaster published for this lot (e.g. `Hot: raspberry, orange blossom, plum / Cold: rose. Yuzu-like acidity, honey-lime sweetness.`). This is the roaster's *intent* - Chris's observed tasting notes go in the Tasting + Flavor Notes sections below.

---

### Origin

- **Country** - canonical country from `canonicals://regions` (e.g. `Panama`, `Colombia`, `Ethiopia`).

- **Macro Terroir** - canonical macro from `canonicals://regions` for that country (e.g. `Volcán Barú Highlands`, `Central Andean Cordillera`, `Sidama Highlands`). If the natural-language name doesn't match canonical, look up the macro that contains the named area (e.g. "Boquete" → `Volcán Barú Highlands`; "Boquete" is a meso, not a macro).

- **Meso Terroir** - free-text (not validated). Optional. Use the meso names listed under the chosen macro as guidance.

- **Cultivar** - canonical cultivar from `canonicals://varieties` (e.g. `Mokka`, `Gesha`, `Pink Bourbon`, `Sidra`). The varieties registry handles common variants via aliases (e.g. `Geisha` → `Gesha`, `Green-Tip Gesha` → `Gesha` - green-tip is a leaf phenotype, not separate genetics; `Mokka ≠ Mokkita`, distinguish precisely). If a blend, comma-separate.

---

### Process

- **Base Process** - one of `Washed`, `Honey`, `Natural`, `Wet-hulled` (per `canonicals://processes`).

- **Subprocess** - Honey color tier only: `White Honey`, `Yellow Honey`, `Red Honey`, `Black Honey`, `Purple Honey`, `Generic Honey`, `Hydro Honey` (canonical form includes the `Honey` suffix). Omit for non-Honey bases.

- **Fermentation Modifiers** - array, optional. Canonical values from `canonicals://processes` § fermentation axis (e.g. `Anaerobic`, `Double Anaerobic`, `Yeast Inoculated`, `Lactic`, `Thermal Shock`).

- **Drying Modifiers** - array, optional. From `canonicals://processes` § drying axis (e.g. `Anaerobic Slow Dry`, `Greenhouse Drying`, `Raised Bed`).

- **Intervention Modifiers** - array, optional. From `canonicals://processes` § intervention axis.

- **Experimental Modifiers** - array, optional. From `canonicals://processes` § experimental axis (`Koji`, `SCOBY`, `Enzyme-Assisted`, `Barrel-Aged` only - `Anaerobic` is on the *fermentation* axis, not experimental).

- **Decaf** - if applicable: `SWP`, `MWP`, `EA`, `CO2`. Omit otherwise.

- **Signature Method** - proper-name proprietary process if the producer has one. 15 canonicals post Sprint T1 / BR-1 (2026-05-18): `Moonshadow`, `TyOxidator`, `Alchemy`, `TIM`, `XO`, `Enzyflow`, `Bio-innovation`, `Sous-vide`, `Amazake`, `Anti-maceration`, `Dynamic cherry`, `Dry fermentation`, `Splash`, `Symbiotic`, `Wave Hybrid`. Hybrid Washed deprecated in BR-1 (it fails the "mechanically opaque" criterion; CGLE publicly decomposes it as Anaerobic + Aerobic Washed — record those as structured modifiers, not as a signature). Omit otherwise.

---

### Recipe

- **Brewer** - canonical from `canonicals://brewers` (e.g. `Sworks Bottomless`, `Hario V60`, `Orea v4`, `Kalita Tsubame`, `April`, `UFO`, `Hario Switch`). The brewing doc body uses descriptive forms (`SWORKS Bottomless Dripper`, `April Brewer Glass`, `Hario V60 Glass`) for readability; resolve to canonical when populating Step 4. If valve / Dial structure is part of THIS brew's recipe (e.g. SWORKS), keep that detail in the Pour Structure field, not the Brewer field - the Brewer field is equipment-only.

- **Filter** - canonical from `canonicals://filters` (e.g. `xBloom Premium Paper Filters`, `CONE FAST`, `FLAT FAST`, `UFO FAST`, `WAVE B3`, `CAFEC Abaca+ Cup 1 Cone Paper Filter`). Note: legacy `Espro Bloom Flat` resolves via alias to `xBloom Premium Paper Filters`. Sibarist canonicals do NOT include the `Sibarist` brand prefix (that's manufacturer metadata, not part of the canonical name); use `CONE FAST` not `Sibarist FAST CONE`. Cafec papers: short forms (`Cafec T-92`) resolve via alias to canonical (`CAFEC T-92 - Cup 1 Light Roast Paper Filter`); use either form.

- **Dose** - grams (e.g. `15g`, `18g`).

- **Water** - `<weight>g (<ratio>), <type>` (e.g. `250g (1:16.7), office tap`, `288g (1:16), home remineralized`).

- **Cup Yield** - only if Output Selection modifier is active; specify what was kept (e.g. `kept 155g of 200g brew weight; discarded first 8g + last 37g`).

- **Grinder** - canonical from `canonicals://grinders` (currently `EG-1`).

- **Grind Setting** - must match a valid setting for the grinder; for EG-1, decimal between 3.0 and 8.0 in 0.1 steps. Format: `6.3`, not "EG-1 6.3" - Grinder + Grind Setting are separate fields.

- **Extraction Strategy** - exactly one of `Suppression`, `Clarity-First`, `Balanced Intensity`, `Full Expression`, `Extraction Push`, `Hybrid` (v8.4). Strict canonical. Defined in this document (the Two-Axis Framework); not in `canonicals://processes`. Inspect via `canonicals://extraction-strategies`.

- **Hybrid Sub-form** - REQUIRED when Strategy = Hybrid; null otherwise. One of: `sequential`, `phase_mapped`, `selective_bloom`, `intensity_clarity_split`, `temperature_staged`. Inspect via `canonicals://hybrid-subforms`. Strict canonical (5-value enum, code-side enforced).

- **Modifiers** - JSON-style or labeled array of zero-or-more modifiers from this list: `Output Selection`, `Inverted Temperature Staging`, `Aroma Capture`. Each modifier with its sub-fields (Output Selection: form + brew_weight + cup_yield; Inverted Temp: phases; Aroma Capture: application). State `None` explicitly if no modifiers - empty is a positive signal that modifiers were considered. **v8.4 (2026-05-06):** Immersion was removed from the modifier list and absorbed into the Hybrid strategy via hybrid_subform.

- **Cooling-Curve Target** (v8.4) - free-text, optional. Set when peak evaluation window IS the strategy (e.g. `40-45°C peak`, `evaluate below 50°C`). Default null = normal cooling progression. Most brews omit; populate on El Paraíso, Garrido Mokka/Mokkita, anaerobic naturals, anoxic naturals, Picolot competition lots, and any coffee where the cooling-window discipline is part of the brief.

- **Temp** - °C, with kettle management note (e.g. `94°C, kettle on base throughout`, `95°C, kettle off base (natural decline)`).

- **Bloom** - weight + technique + duration + (if SWORKS) valve state.

- **Pour Structure** - each pour with cumulative weight, duration, technique (center / spiral / Melodrip), valve state for SWORKS, chilling-ball position if Aroma Capture active, phase boundaries if Immersion active.

- **Total Time** - e.g. `2:50-3:15`.

---

### Roast level

- **Roast Level** - canonical from `canonicals://roast-levels` (8 Agtron-anchored buckets: `Extremely Light`, `Very Light`, `Light`, `Light-Medium`, `Medium`, `Medium-Dark`, `Dark`, `Very Dark`). If you only have a marketing tag (e.g. `Nordic Light`, `Specialty Light`), resolve it to the canonical bucket via the registry's alias map.

---

### Tasting (Chris's observed)

- **Aroma**

- **Attack**

- **Mid-Palate**

- **Body**

- **Finish**

- **Temperature Evolution** - how the cup changes as it cools.

- **Peak Expression** - hot / warm / cool / specific temperature (e.g. `cool, ~45°C and below`).

---

### Flavor Notes (canonical)

- **Flavor Notes** - comma-separated array of canonical bases or `Base (Modifier)` chips from `canonicals://flavors` (e.g. `Raspberry, Orange, Yuzu, Rose, Honey` or `Blueberry (Baked), Apricot, Black Tea`). The 17 numbered composition rules in the flavors registry apply - particularly Rule 11 (Tea bases reverse: `Peach Tea` → `Tea + Peach modifier`). Aim for 2-4 chips. Distinct from Roaster Tasting Notes above.

- **Structure Tags** - comma-separated array of `Axis:Descriptor` from `canonicals://flavors` § structure tags (e.g. `Acidity:Bright, Body:Silky, Overall:Tea-like`). 7 axes, 29 canonical descriptors. Aim for 2-3 tags.

---

### Learnings

- **What I Learned from This Coffee** - specific, testable bullet points covering: levers tested and which mattered, extraction ceiling or floor observed, cooling behavior, reference-point determination (is this the reference recipe for the coffee type?), strategy drift from the initial hypothesis, modifier effectiveness if used. Null results are signal - if modifiers were tested and didn't help, say so.

- **Extraction Confirmed** - free-text, **only populate when the planned strategy diverged from what the brew actually validated**. If the planned strategy at Step 1d matched the tasted result, leave this empty. Examples of divergence: planned Balanced Intensity but the cup needed Full Expression; planned Suppression but the cup wanted Balanced + Inverted Temperature. If non-divergent, the strategy column on the resolved brew already records what was confirmed; no extra prose is needed.

- **Modifiers Confirmed** - closing line stating which modifiers (if any) were validated, with a one-sentence note on whether each resolved what it was meant to resolve. State `None` explicitly if no modifiers were used (null modifier results are still signal).

- **Process-Dominant** - boolean. `true` if the cup is driven primarily by processing (e.g. yeast-anaerobic naturals, heavy co-ferments) rather than terroir or cultivar; `false` for clean transparency-driven lots. Affects how the brew aggregates on `/processes` vs `/cultivars` pages.

- **Classification** - one-line synthesis (≤200 chars) suitable for a card or list view (e.g. `Mokka Natural confirming Full Expression on Picolot roast - bright green grape and tea-like body, clarity-driven with herbal lift on cooling.`).

## End-of-coffee document review

After producing the resolved brew, assess whether the learnings should propagate back to the master reference. Candidate locations to update: [Roaster Reference](docs/brewing/roasters.md) (new roaster data or strategy tag refinement), the Brewing Historian cluster at [docs/skills/brewing-historian/cluster/patterns/](docs/skills/brewing-historian/cluster/patterns/) — `by-strategy/<strategy>.md` for new strategy data points (Suppression / Balanced / Full / Unclear), `cross-coffee-insights.md` for By Variety / By Process / Cooling Behavior / Office Brewing Notes / Modifier Patterns / Open Questions entries, and `by-cultivar/<cultivar>.md` or `by-coffee-family/<family>.md` for per-cluster deep dives. Propose specific edits via the `propose_doc_changes` MCP Tool with citations targeting the relevant `target_doc='skills/brewing-historian/cluster/patterns/<file>.md'` + section-anchor, not generic "should update" observations.

## Process / Variety Signal Table

*Used in Step 1b. Flags that should trigger a non-default extraction strategy.*

| **Process / Variety Signal**                                | **Default Risk**                                        | **Recommended Start**                                                 | **Watch For**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|-------------------------------------------------------------|---------------------------------------------------------|-----------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Washed Gesha / Ethiopian landrace                           | Fine - Clarity-First is correct                         | Clarity-First                                                         | Turbulence flattening acidity; don't over-agitate                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Honey (light / white)                                       | Fine - slight extraction bump helpful                   | Clarity-First → Balanced                                              | Sweetness can read thin at coarser grind                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Natural (controlled / DRD)                                  | Mild risk                                               | Balanced Intensity                                                    | Vinous/wine character needs support, not suppression. Exception: Hacienda La Esmeralda “NC” climate-controlled naturals are clean enough to stay Clarity-First - do not apply Balanced default.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Anaerobic natural OR cold-room dehydration natural          | Moderate risk - Clarity-First will under-extract; Balanced Intensity over-extracts | Suppression                                                          | Bitter finish is temperature-driven, not grind-driven - drop temp before coarsening (anaerobic) or push +1°C from 92°C to 93°C (cold-room dehydration). Evaluate cool; cup integrates significantly below 50°C. Temperature primacy confirmed across Colombian (Finca Inmaculada, Valle del Cauca), Ethiopian (Basha Bekele Kokose, Sidama Bensa), Panama (Altieri NASD), and Ethiopian-green-Panama-processed (Picolot Simba Cold Room) lots - pattern is process-driven, not terroir-driven, AND extends from fermentation-driven to drying-modifier-driven processes. Reclassified from Balanced Intensity to Suppression in v8.0. **Office SWORKS valve sub-rule:** anaerobic naturals tolerate Dial 6 cleanly at 92°C kettle-on; cold-room dehydration lots want Dial 6 maximum at 93°C kettle-on (do not push past Dial 6 - selectivity ceiling, pulls bitter ahead of clarity). If Suppression does not resolve the cup, **Balanced Intensity + Inverted Temperature Staging** (88°C → 94°C) is the experimental fallback. |
| Anaerobic washed (clean / lighter fermentation)             | Moderate risk                                           | Balanced Intensity (default); roaster signal can override            | Phenolic sharpness if pushed too hard; sour if too coarse. **Roaster override confirmed (DAK Apricoast, Ethiopia Arbegona):** when the roaster's house style is Full Expression (DAK, Sey, Flower Child), follow the roaster - clean anaerobic washed lots from these roasters extract reliably at Full Expression mechanics with variety transparency preserved. Balanced Intensity default applies for roasters at Balanced or Clarity-First.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Anaerobic washed (heavy / Colombian Huila / Cauca)          | High risk - Clarity-First will under-extract            | Full Expression                                                       | Confirmed pattern: Colombian anaerobic washed Geshas from Huila/Cauca reliably need Full Expression.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Anoxic natural (sealed container fermentation)              | High risk - Clarity-First will under-extract            | Full Expression (n=1: Scenery Pikudo's Rosado)                        | Process + variety override variety-default ceiling — do not apply Pink Bourbon/Rosado variety ceiling logic to anoxic natural lots. Temperature taper resolves bitter tail. Note: 'Anoxic' canonicalizes to `fermentation:[Anaerobic]` with qualifier `Anoxic` per `canonicals://processes` + `brews.fermentation_qualifiers text[]` (Sprint T3 / CR-5, migration 059, 2026-05-18). **The qualifier is a record-when-known annotation, NOT a strategy-decision layer** (Sprint T3 / CR-1 corrective): aggregation level stays at the `[Anaerobic]` modifier; both Anoxic Natural and plain Anaerobic Natural group under the Anaerobic modifier-index page. The single-data-point Full-Expression call above belongs to *this specific lot* (Rosado on Anoxic execution), not to the qualifier categorically. |
| Heavy anaerobic / co-ferment                                | High risk                                               | Full Expression                                                       | Confirm roaster brew guide; these coffees want heat + agitation. **Output Selection (late cut) is a candidate modifier** - heavy co-ferments often have a drying / astringent tail concentrated in the last fraction; cutting yield short can resolve it without compromising the developed mid-band. Confirmed informally on Moonwake El Eden Tamarind Washed pre-framework; warrants formalization on next heavy co-ferment. |
| Experimental fermentation (thermal shock, yeast-inoculated) | High risk                                               | Balanced Intensity - confirm with roaster guide before escalating     | Yeast-inoculated lots confirmed Balanced Intensity across four subtypes: anaerobic natural (Moonwake Peach Oolong), thermal shock washed (Hydrangea El Paraíso), white honey (Moonwake Sebastian Ramirez El Placer Gesha, Quindío), and yeast-inoculated natural with washed finish (Hydrangea Gesha Horizon Don Eduardo, Panama). Do not assume Full Expression. Let flavor targets and roaster guide drive. When variety is transparency-driven (Sydra, Typica Mejorado, Gesha) and flavor targets are bright/citric/floral, variety signal reinforces Balanced Intensity - it does not push toward Full Expression. Temperature is the primary extraction lever for yeast-inoculated lots; grind is secondary. Note: for yeast-inoculated naturals with washed finish, start at the finer end of the Balanced Intensity grind range (6.4, not 6.5) - the washed finish moderates fermentation density and requires additional grind support to express fruit fully. |
| Dense high-elevation cultivar (Pacamara, Mokka, Mokkita)    | Mild risk                                               | Balanced Intensity                                                    | Large bean needs slightly more energy to extract evenly                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| High-EY roaster (Sey, Flower Child, Picky Chemist, Dak)     | High risk - EG-1 cannot reach their target D50          | Full Expression + 5.5 grind + boiling water + T-92 filter + slow draw | These roasters target ~450 µm D50 on different burr geometry. On EG-1, compensate via temp, agitation, filter, and brew time rather than grind. Start at 5.5.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |

## Equipment Reference

**Brewer System**

| **Brewer**                    | **Geometry**           | **Flow**                    | **Cup Tendency**                          | **Notes**                                                                                                                                                                                                                |
|-------------------------------|------------------------|-----------------------------|-------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **UFO Ceramic**               | Cone                   | Very Fast                   | Extreme clarity, high aromatic separation | Delicate high-aroma coffees. Home only. ★ Rotate more deliberately - has been over-relied on.                                                                                                                            |
| **Orea Glass**                | Flat                   | Fast                        | Bright fruit clarity, clean finish        | Washed African coffees, expressive light roasts. Home only.                                                                                                                                                              |
| **Orea Porcelain**            | Flat                   | Fast-Medium                 | Slightly sweeter and rounder than glass   | Fruit-forward coffees needing balance. Home only.                                                                                                                                                                        |
| **Orea v4**                   | Flat (modular)         | Variable - base-controlled  | Clarity-balanced flat with base-driven flow control | Home only. Modular base system - flow is controlled by interchangeable base rather than fixed geometry. Distinct from v1-3 (Glass/Porcelain) in that flow can be tuned independently of paper choice. Pair with Negotiator base or Sibarist FLAT papers. |
| **Hario V60 Glass**           | Cone                   | Medium-Fast                 | Classic clarity, balanced extraction      | Baseline dialing brewer. Home only.                                                                                                                                                                                      |
| **April Brewer**              | Flat (wave / shallow)  | Medium                      | High sweetness, rounded acidity, mid-palate integration           | Home + Office. Primary use case: integration vehicle for round sweetness + controlled clarity. OFFICE: drains ~2:30 with xBloom Premium Paper — use for Suppression / integration work; not for Full Expression (route Full Expression to Kalita 155 or SWORKS Bottomless).                                                                                |
| **Kalita Wave 155**           | Wave Flat              | Medium-Slow                 | Fuller body, strong sweetness             | Home + Office. OFFICE DEFAULT for Full Expression/Balanced Intensity: 3:00–3:30 with xBloom Premium Paper. NOTE: runs faster than expected even at finer grinds.                                                                  |
| **SWORKS Bottomless Dripper** | Cone (variable)        | Variable - valve-controlled | Flexible depending on valve state         | Office only. Primary variable-flow brewer. Valve dial adjusts flow restriction per pour phase. Key advantage: solves fast-drain problem by restricting flow independently of grind size. Functionally an **immersion-to-percolation continuum** with finer-grained control than the Switch lever - Dial 0 = immersion, Dial 5 = near-immersion modulation, Dial 6-7 = percolation finish. **Canonical Hybrid-strategy brewer at the office (v8.4)** when valve transitions are doing strategic work (slow/slow/open Sequential, fast/fast/slow Phase-Mapped, or Intensity-Clarity Split on heavy co-ferments). Also used inside the 5 intensity strategies for bloom-phase flow control without invoking Hybrid framing. See Valve Position Reference. |
| **Hario Switch Glass**        | Cone Hybrid            | Variable                    | Round sweetness, controlled extraction    | Difficult coffees, extraction experiments. Home only. **Canonical Hybrid-strategy brewer at home (v8.4)** - lever closed = immersion phase, opened = percolation drawdown. Use for Switch-style Sequential staging (Wibawa), Selective Bloom Hybrid (Ferket 2025 — separate bloom liquid from main brew), and immersion-to-percolation Phase-Mapped recipes (Garam Victor Um 2023, modulo no mesh-then-paper swap available).                                                                                                                                                                    |
| **Weber Bird**                | Immersion              | Restricted                  | Dense sweetness, uniform extraction       | Controlled extraction studies. Home only.                                                                                                                                                                                |
| **XBLOOM**                    | Automated Flat         | Programmable                | Highly repeatable                         | Testing repeatable recipes. Home + Office (manual preferred at office).                                                                                                                                                  |
| **Chemex Funnex**             | Cone (deep)            | Variable by paper           | Depends on paper - heavy/sweet with Chemex Half Moon, fast clarity with Cafec Abaca+ Deep27 or Sibarist CONE 28 FAST | Home only. Small-dose specialist (5-15g per paper spec). Currently calibrated against Cafec Abaca+ Deep27 (FP-2 half-moon equivalent). With Sibarist CONE 28 FAST the dynamics shift significantly: pour speed becomes a contact-time lever rather than relying on filter resistance. Used primarily for sub-15g doses where bed depth in cone brewers becomes a problem. |
| **Sibarist Brewing System**   | Cone (system-integrated) | Very Fast (HALO FAST) or Medium (HALO B3) | System-level peak clarity - eliminates fit and bypass variability | Home only. HALO holder + borosilicate brewing chamber + temperature exchanger. Pairs only with Sibarist HALO CONE FAST or HALO CONE B3 papers (perfect-seal system-specific). Use case: isolating extraction variables when the dripper/paper interface needs to be eliminated as a source of variance. Reserve for diagnostic / reference brews, not daily rotation. |
| **Oxo Rapid Brewer**          | Pressure + Percolation | Fast                        | Very concentrated                         | Travel, co-ferments, experimental coffees. Home only.                                                                                                                                                                    |

## Valve Position Reference - SWORKS Bottomless Dripper

| **Valve State**            | **Flow Behavior**                      | **Use When**                                   | **Notes**                                                                                                                                                                                                                                                                                      |
|----------------------------|----------------------------------------|------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Fully Closed (Dial: 0)** | Zero flow - true immersion             | Bloom phase only (~20 seconds)                 | Pour to target weight, close fully, saturate 20s, then crack to Restricted. Do NOT hold beyond ~25s - cup starts reading muddy. Dial positions 0–1 both behave as fully closed with real coffee bed.                                                                                           |
| **Restricted (Dial: 5)**   | Very slow controlled drip              | Early main pours (Pour 1 and sometimes Pour 2) | Core extraction lever - most of your brew time happens here. Artificially slows drawdown without finer grind. CALIBRATED: Dial 5 = ~60 sec/100g with xBloom Premium Paper + real coffee bed at EG-1 6.0. Dial positions 1–4 are dead zones with real coffee bed resistance - do not use for extraction. |
| **Half-Open (Dial: 6)**    | Moderate - controlled percolation      | Later pours, transitioning to faster drain     | Starting position for Clarity-First where full restriction would over-extract. CALIBRATED: Dial 6 = ~45 sec/100g with xBloom Premium Paper + real coffee bed at EG-1 6.0.                                                                                                                               |
| **Open (Dial: 7)**         | Fast - bottomless baseline (very fast) | Final flush or end extraction cleanly          | Open is faster than most open brewers. Open is NOT a ‘normal’ setting - it is a fast setting. CALIBRATED: Dial 7 = ~30 sec/100g with xBloom Premium Paper + real coffee bed at EG-1 6.0. Full turn past 7 (back to 0) = ~20 sec/100g maximum flow.                                                      |

Adjustment logic (valve-first): Thin or sharp → close valve more. Muddy or flat → open valve earlier (also check if closed bloom ran \>25s). Bitter → shorten contact time by opening sooner in the final pour. Adjust grind only after valve position is optimized.

## Filter System

Canonical filter SKUs are in `canonicals://filters` (64 canonicals + 34 aliases). Below is the rotation-relevant subset.

| **Filter**                       | **Type**    | **Flow**    | **Behavior**                                   | **Cup Impact / Notes**                                                                                                                                                                                                                                                                                                                                                                                                                          |
|----------------------------------|-------------|-------------|------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Sibarist UFO FAST                | Cone (80°)  | Very Fast   | Extreme fines reduction, custom UFO fit        | Extremely clean cups. Pairs only with UFO Ceramic. Home only.                                                                                                                                                                                                                                                                                                                                                                                   |
| Sibarist CONE FAST               | Cone        | Very Fast   | Very low fines retention                       | High clarity, bright acidity. V60-02 / Origami / Orea Apex. Home only.                                                                                                                                                                                                                                                                                                                                                                          |
| Sibarist CONE B3                 | Cone        | Medium      | Balanced extraction, structured                | Clarity with slightly more body. V60-02 / Origami / Orea Apex. Home only.                                                                                                                                                                                                                                                                                                                                                                       |
| Sibarist CONE 28 FAST            | Cone (low-angle / deep) | Very Fast   | Engineered for deep cone brewers             | Funnex baseline FAST paper - significantly changes Funnex dynamics vs the Cafec Abaca+ Deep27 / Chemex Half Moon defaults. Pour speed becomes a contact-time lever rather than relying on filter resistance. Home only.                                                                                                                                                                                                                          |
| Sibarist FLAT FAST               | Flat        | Very Fast   | Extremely permeable, low-bypass tight fit      | Very high clarity. Kalita 155/185 / Orea / April. Home only.                                                                                                                                                                                                                                                                                                                                                                                    |
| Sibarist FLAT B3                 | Flat        | Medium      | Structured flat extraction, balanced clarity + body | Kalita 155/185 / Orea / April. Home only.                                                                                                                                                                                                                                                                                                                                                                                                       |
| Sibarist WAVE B3                 | Wave        | Medium      | Stable bed geometry, low-bypass structured fit | Kalita 155/185. Home only.                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Sibarist HALO CONE FAST          | Cone (system-specific) | Very Fast   | Perfect-seal system-integrated, peak clarity ceiling | Pairs only with Sibarist Brewing System. System-level diagnostic / reference paper. Home only.                                                                                                                                                                                                                                                                                                                                                   |
| Sibarist HALO CONE B3            | Cone (system-specific) | Medium      | Perfect-seal system-integrated, structured clarity | Pairs only with Sibarist Brewing System. Home only.                                                                                                                                                                                                                                                                                                                                                                                              |
| Cafec Abaca+ Cup 1 (V60-01)      | Cone        | Fast        | Abaca + pulp, low fines, fast clarity baseline | Common rotation paper. V60 / Origami / Cafec. Home only.                                                                                                                                                                                                                                                                                                                                                                                        |
| Cafec Abaca+ Cup 4 (V60-02)      | Cone        | Fast        | Same dynamics as Cup 1 - larger size for V60-02 brewers | Home only.                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Cafec Abaca+ Deep 27             | Cone (deep) | Fast        | Refined Abaca+ blend, deep-fit                  | Funnex / Cafec Deep27 specific. Increases contact time via bed depth, not paper resistance. Currently the Funnex baseline before Sibarist CONE 28 FAST takes over for FAST work. Home only.                                                                                                                                                                                                                                                     |
| Cafec T-90 (Cup 1 Medium Roast)  | Cone        | Medium-Slow | Wood pulp, medium thickness, balanced cone     | Softens acidity, rounds profile. Home only.                                                                                                                                                                                                                                                                                                                                                                                                     |
| Cafec T-92 (Cup 1/4 Light Roast) | Cone        | Slow        | Wood pulp, thin, high fines retention           | Promotes extraction. Pair with boiling water for Full Expression on high-EY roasters. Owned in both Cup 1 (LC1, slow flow) and Cup 4 (LC4, faster flow) sizes - same paper technology, paper-size only, dynamics consistent. Home only.                                                                                                                                                                                                          |
| Cafec T-83 (Cup 1 Dark Roast)    | Cone        | Very Slow   | Wood pulp, thick, maximum extraction resistance | Highest tannin risk. Use sparingly. Home only.                                                                                                                                                                                                                                                                                                                                                                                                  |
| Chemex Bonded (Half Moon White)  | Cone (folded) | Slow        | Very thick bonded pulp, strongly reduces bypass | Funnex / Chemex. Heavy body, very high sweetness, suppresses brightness. Acts almost immersion-like in the Funnex. Home only.                                                                                                                                                                                                                                                                                                                   |
| Hario V60 01 (Tabbed)            | Cone        | Medium      | Wood pulp, loose fit - introduces variability  | Classic V60 baseline reference. Home only.                                                                                                                                                                                                                                                                                                                                                                                                      |
| Hario V60 01 (Untabbed)          | Cone        | Medium      | Wood pulp, loose fit - slightly cleaner than tabbed | Cleaner baseline cone vs tabbed (less variability). Home only.                                                                                                                                                                                                                                                                                                                                                                                  |
| Hario V60 Meteor 02              | Cone        | Fast        | Refined pulp, improved seal, more stable than standard Hario | Improved clarity baseline. Home only.                                                                                                                                                                                                                                                                                                                                                                                                           |
| April Paper Filter               | Flat (Kalita 155) | Medium      | Wood pulp, neutral profile, rounded            | Compatible with April / Orea / Kalita. Home only.                                                                                                                                                                                                                                                                                                                                                                                               |
| **xBloom Premium Paper**         | Flat (Kalita 155/185) | Fast        | Thin refined pulp, very stable, neutral, low body | ★ Home + Office. The only paper option at the office (compatible with Kalita Wave 155 and SWORKS Bottomless via Kalita 155 sizing). NOTE: runs faster than its thin-pulp spec might suggest in cup terms - on Bottomless Dripper, use valve restriction to compensate when contact time is critical. xBloom / Kalita / Orea compatible. Historically referred to in this document as "Espro Bloom" - that was a misnaming; canonical name is xBloom Premium Paper Filter. |
| Weber Bird Paper Filter          | Round (system-specific) | Medium-Fast | Refined pulp, perfect zero-bypass seal          | Pairs only with Weber Bird. Pressure-driven saturation extraction, no bypass. Home only.                                                                                                                                                                                                                                                                                                                                                        |

**Additional Tools**

| **Tool**              | **Purpose**                    | **Effect**                                                                           |
|-----------------------|--------------------------------|--------------------------------------------------------------------------------------|
| Melodrip              | Reduces agitation during pours | Cleaner extraction, less fines movement - use for Clarity-First strategy. Home only. |
| Paragon chilling ball | Rapid cooling of extraction    | Preserves aromatics, boosts perceived sweetness - use at end of brew. Home only.     |

**Practical Brewer Rotation Framework**

*Rotate by cup structure goal. Do not default to the same brewer repeatedly. Note: office brewers are limited to April, Kalita Wave 155, and SWORKS Bottomless Dripper.*

| **Desired Cup**                | **Home Brewers**            | **Office Brewers**                                    | **Notes**                                                   |
|--------------------------------|-----------------------------|-------------------------------------------------------|-------------------------------------------------------------|
| Maximum clarity                | UFO, Orea Glass             | - not available                                       | Home only for this profile                                  |
| Balanced fruit sweetness       | April, Kalita               | Kalita 155, Bottomless Dripper (Half-Open)            | Bottomless Dripper gives more control at office.            |
| Full Expression / contact time | Switch (hybrid), Weber Bird | Bottomless Dripper (Restricted→Half-Open), Kalita 155 | Bottomless Dripper preferred office Full Expression brewer. |
| Maximum intensity              | Oxo Soup Shot               | - not available                                       | Home only                                                   |

**Grinder: Weber EG-1**

Large flat burr, tight particle distribution, low fines. One EG-1 at home (distilled + remineralized water), one at office (tap water, Downtown Palo Alto). Both calibrated to the same grind settings. Key structural finding: settings 6.0–6.3 all produce D50 values in the ~1000–1060 µm range due to burr geometry compression. Below 6.0, D50 continues to drop but at a diminishing rate - the steepest meaningful drop is 6.0→5.5 (~95 µm). Below 5.0, the EG-1 hits a D50 floor at ~820–880 µm regardless of dial setting.

Critical implication for high-EY roasters: Picky Chemist, Sey, and Flower Child target ~450 µm D50 on their equipment (98mm SSP or similar). This is physically unachievable on the EG-1 at any dial setting. For these roasters, the primary levers are temperature (boiling water), agitation, filter choice (T-92), and brew time (4–5 minutes).

| **Setting** | **S1** | **S2** | **S3** | **D50 Avg** | **Status**                           | **Brew Context**                                | **Distribution**                                                                | **Use When / Notes**                                                                                        |
|-------------|--------|--------|--------|-------------|--------------------------------------|-------------------------------------------------|---------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| **7**       | 1114   | 1118   | 916    | ~1116       | measured - reliable center confirmed | very coarse - anomalous vs 6.9                  | 916 persistent outlier - burr artifact. True D50 ~1116.                         | Anomalous: 7.0 reads FINER than 6.9. Not simply coarser. Remeasured March 2026. Bailout setting.            |
| **6.9**     | 1209   | 1263   | 1176   | 1216        | measured                             | coarse - upper clarity range                    | Clean stable cluster, 87 µm spread. Best-measured setting.                      | Maximize aromatic separation. Delicate washed coffees. Highest-clarity starting point.                      |
| **6.8**     | 1159   | 1135   | 1106   | 1133        | measured                             | balanced-coarse - default washed entry          | 53 µm spread. Original session contaminated; remeasurement confirmed.           | Good entry point for high-end washed Geshas and Ethiopians.                                                 |
| **6.7**     | 1119   | 1147   | 1044   | 1103        | measured                             | standard - stable reference zone                | 103 µm spread. Reliable.                                                        | Balanced clarity and sweetness. Reliable starting point for washed coffees.                                 |
| **6.6**     | 925    | 1052   | 1170   | ~1100–1150  | ⚠️ NEEDS FRESH MEASUREMENT           | increased sweetness and extraction              | All 3 original samples trending upward - clear purge contamination.             | Slightly finer than 6.7. True D50 unconfirmed - original session contaminated.                              |
| **6.5**     | 1056   | 1092   | 1083   | ~1083       | measured                             | balanced extraction - previous default          | Two clean sessions: avg ~1083 µm across six readings.                           | Starting point for washed Gesha and clean Ethiopians. Many processed coffees will taste thin here.          |
| **6.4**     | 957    | 997    | 1149   | ~977        | measured                             | high extraction - Balanced Intensity begins     | Two tight readings (957/997) with one high outlier (1149).                      | Honey lots, controlled naturals, Pacamara, Mokka, Mokkita. Often correct starting point for processed lots. |
| **6.3**     | 1062   | 1068   | 1048   | ~1050       | measured                             | strong extraction - compression begins          | Two sessions confirm ~1050 µm. Original 944 µm was wrong.                       | Natural-process, anaerobic washed. Note: nearly same D50 as 6.2 and 6.1.                                    |
| **6.2**     | 1057   | 999    | 1014   | ~1023       | measured                             | overlapping band                                | Overlaps with 6.3 and 6.1 - all within ~60 µm band.                             | Functionally equivalent to 6.3 on EG-1.                                                                     |
| **6.1**     | 1016   | 1049   | 1014   | ~1001       | measured                             | overlapping band                                | Session 1: tightest in dataset (35 µm spread). True D50 ~1001 µm.               | Dense high-elevation coffees, heavy anaerobic.                                                              |
| **6**       | 1043   | 1078   | 1061   | ~1061       | measured                             | Full Expression entry - distribution tightening | Low outlier (891) is purge artifact. Reliable cluster ~1061 µm.                 | Full Expression strategy. Sey/Flower Child/Dak territory.                                                   |
| **5.5**     | 930    | 835    | 849    | ~842        | measured                             | sub-6.0 - steepest step in survey               | Most significant single D50 drop: ~95 µm from 6.0. True center ~842.            | Key transition zone. 6.0→5.5 is where the most meaningful D50 change occurs.                                |
| **5**       | 893    | 871    | 962    | ~882        | measured                             | sub-6.0 - compression resuming                  | Reliable 893/871 cluster. Only ~60 µm below 5.5.                                | Full Expression. Fines fraction increasing.                                                                 |
| **4.5**     | 877    | 850    | 873    | ~867        | measured                             | sub-6.0 - plateau zone                          | 27 µm spread - cleanest sub-6.0 measurement. Curve nearly flat.                 | D50 changes minimal from here down.                                                                         |
| **4**       | 876    | 784    | 871    | ~874        | measured                             | sub-6.0 - plateau confirmed                     | Virtually identical to 4.5. Curve completely flat.                              | D50 floor confirmed at ~850–880 µm.                                                                         |
| **3.5**     | 764    | 873    | 996    | ~819        | measured                             | floor zone                                      | Wide spread after long fine-grinding session; 764 likely truest.                | D50 floor ~820–880 µm.                                                                                      |
| **3**       | 813    | 853    | 819    | ~816        | measured                             | floor confirmed                                 | 813/819 cluster tightly. Two full dial rotations (5.0→3.0) = ~66 µm D50 change. | EG-1 D50 floor definitively confirmed. Cannot reach sub-700 µm in filter mode.                              |

**Filter Flow Gap - B3 to FAST (Cone, Home)**

The Sibarist B3 Cone (medium-fast) and Sibarist FAST Cone (very fast) sit at noticeably different points on the cone-flow spectrum, with no intermediate cone filter in current home inventory. On a single-pouch washed Panama Gesha at 12.5g (Longboard Misty Mountain, brew e479e75b), substituting B3 for FAST on a recipe designed around FAST added an estimated ~30 seconds of contact time, producing a Balanced-adjacent cup (heavier body, more bergamot/tannin tea, less aromatic separation) despite Clarity-First strategy and grind. Practical rules going forward:

- For pure Clarity-First on delicate washed Gesha at small-pouch (12.5g) doses: Sibarist FAST Cone, not B3.
- If only B3 is available and a FAST-style result is wanted: pull a half-notch finer (e.g. 6.5 instead of 6.6) to compensate, then verify drawdown.
- The Sibarist B2 Cone (not currently in inventory) would fill this gap at a flow rate intermediate between B3 and FAST. Worth considering for purchase if delicate washed Gesha brewing becomes more frequent.
- A Filter Drawdown Test Protocol has been drafted to convert filter choice from a gut-read into a measured lever - see the Open Questions entry below.

## Example Outputs

## Standard Recipe (Home)

| **Field**       | **Value**                               |
|-----------------|-----------------------------------------|
| **Coffee**      | Pepe Jijón Sidra - Flower Child         |
| **Brewer**      | UFO Ceramic Dripper                     |
| **Filter**      | Sibarist UFO Fast Cone                  |
| **Dose**        | 15g                                     |
| **Water**       | 255g                                    |
| **Grind**       | EG-1 6.6                                |
| **Temp**        | 92°C                                    |
| **Bloom**       | 50g pour for 8s, wait 40s               |
| **Pour 1**      | 0:40 → pour to 150g, 15s pour, wait 20s |
| **Pour 2**      | 1:15 → pour to 255g, 12s pour           |
| **Target Time** | 2:00–2:15                               |

## Bottomless Dripper Recipe (Office, Full Expression)

| **Field**       | **Value**                                                                                                                                                                                                                                                                           |
|-----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Coffee**      | \[Example: Colombian Anaerobic Washed - Full Expression\]                                                                                                                                                                                                                           |
| **Brewer**      | SWORKS Bottomless Dripper                                                                                                                                                                                                                                                           |
| **Filter**      | xBloom Premium Paper (155)                                                                                                                                                                                                                                                              |
| **Dose**        | 15g                                                                                                                                                                                                                                                                                 |
| **Water**       | 225g                                                                                                                                                                                                                                                                                |
| **Grind**       | EG-1 6.3                                                                                                                                                                                                                                                                            |
| **Temp**        | 97°C                                                                                                                                                                                                                                                                                |
| **Bloom**       | 45g pour, 10s - Valve: Fully Closed (Dial 0). Hold 20s, then crack to Restricted (Dial 5).                                                                                                                                                                                          |
| **Pour 1**      | 0:50 → pour to 140g, 15s - Valve: Restricted (Dial 5)                                                                                                                                                                                                                               |
| **Pour 2**      | 1:40 → pour to 225g, 15s - Valve: Restricted (Dial 5) → Half-Open (Dial 6) as bed drops                                                                                                                                                                                             |
| **Target Time** | ~3:00. If over 3:30, open valve earlier on Pour 2. If under 2:30, hold Restricted longer.                                                                                                                                                                                           |
| **Valve Note**  | Bitter finish → open to Half-Open (Dial 6) earlier in Pour 2, not grind coarser. Thin/flat → extend Restricted (Dial 5) phase. Muddy → shorten closed bloom to 15s. NOTE: Dial positions 1–4 are dead zones with real coffee bed - usable range is 5 (Restricted) through 7 (Open). |

# SECTION 2 - ROASTER REFERENCE

*Coffee Research · Latent*

Per-roaster brewing lessons + house-style cards (and the strategy-tag legend) moved to [docs/brewing/roasters.md](docs/brewing/roasters.md) on 2026-04-29 (Sprint 2.4) so each roaster card section-anchors cleanly under MCP for `propose_doc_changes` Tool support. That file is the canonical source for roaster lessons going forward; per-roaster proposals via Claude.ai target `roaster/{name}` and resolve to a `## {Canonical Name}` section there.

Continue to the Cross-Coffee Insight Layer below.

<!-- Original SECTION 2 cards (Moonwake / Dak / Sey / ... / Colibri) are preserved verbatim in docs/brewing/roasters.md; this stub keeps the SECTION 2 header anchor for back-references. -->

# Cross-Coffee Insight Layer

The brewing-side Cross-Coffee Insight Layer migrated to the **Brewing Historian** sub-skill cluster in Wave 2 PR 2 (2026-05-26) per [ADR-0011](docs/adr/0011-composable-sub-skills-architecture.md). See [docs/skills/brewing-historian/SKILL.md](docs/skills/brewing-historian/SKILL.md) for cluster scope.

**Where each former sub-section now lives:**

- How to Use This Section → [docs/skills/brewing-historian/cluster/patterns/cross-coffee-insights.md § How to Use This Section](docs/skills/brewing-historian/cluster/patterns/cross-coffee-insights.md#how-to-use-this-section)
- By Extraction Strategy (6 per-strategy "Coffees That Confirmed X" sub-sections) → [docs/skills/brewing-historian/cluster/patterns/by-strategy/](docs/skills/brewing-historian/cluster/patterns/by-strategy/) — one file per strategy ([clarity-first](docs/skills/brewing-historian/cluster/patterns/by-strategy/clarity-first.md) / [suppression](docs/skills/brewing-historian/cluster/patterns/by-strategy/suppression.md) / [balanced-intensity](docs/skills/brewing-historian/cluster/patterns/by-strategy/balanced-intensity.md) / [full-expression](docs/skills/brewing-historian/cluster/patterns/by-strategy/full-expression.md) / [extraction-push](docs/skills/brewing-historian/cluster/patterns/by-strategy/extraction-push.md) / [hybrid](docs/skills/brewing-historian/cluster/patterns/by-strategy/hybrid.md))
- By Modifier (Axis 2) → [docs/skills/brewing-historian/cluster/patterns/cross-coffee-insights.md § By Modifier (Axis 2)](docs/skills/brewing-historian/cluster/patterns/cross-coffee-insights.md#by-modifier-axis-2)
- By Process → [docs/skills/brewing-historian/cluster/patterns/cross-coffee-insights.md § By Process](docs/skills/brewing-historian/cluster/patterns/cross-coffee-insights.md#by-process)
- By Variety → [docs/skills/brewing-historian/cluster/patterns/cross-coffee-insights.md § By Variety](docs/skills/brewing-historian/cluster/patterns/cross-coffee-insights.md#by-variety) (with per-cultivar deep-dive stubs at [docs/skills/brewing-historian/cluster/patterns/by-cultivar/](docs/skills/brewing-historian/cluster/patterns/by-cultivar/) for N≥3 cultivars: Gesha / 74158 / Sidra / Ethiopian landrace population / Mejorado / Pacamara / Sudan Rume)
- Cooling Behavior Observations → [docs/skills/brewing-historian/cluster/patterns/cross-coffee-insights.md § Cooling Behavior Observations](docs/skills/brewing-historian/cluster/patterns/cross-coffee-insights.md#cooling-behavior-observations)
- Office Brewing Notes (Palo Alto) → [docs/skills/brewing-historian/cluster/patterns/cross-coffee-insights.md § Office Brewing Notes (Palo Alto)](docs/skills/brewing-historian/cluster/patterns/cross-coffee-insights.md#office-brewing-notes-palo-alto)
- Open Questions → [docs/skills/brewing-historian/cluster/patterns/cross-coffee-insights.md § Open Questions](docs/skills/brewing-historian/cluster/patterns/cross-coffee-insights.md#open-questions)
- End-of-Coffee Workflow → [docs/skills/brewing-historian/cluster/patterns/cross-coffee-insights.md § End-of-Coffee Workflow](docs/skills/brewing-historian/cluster/patterns/cross-coffee-insights.md#end-of-coffee-workflow)

Per-coffee-family deep-dive stubs also live at [docs/skills/brewing-historian/cluster/patterns/by-coffee-family/](docs/skills/brewing-historian/cluster/patterns/by-coffee-family/) for N≥3 process clusters: anaerobic-natural / anaerobic-washed / yeast-inoculated-washed / yeast-inoculated-natural / double-anaerobic-washed / thermal-shock-washed.

The Brewing Historian cluster is the authoritative home for cross-coffee learnings going forward. New patterns get proposed via `propose_doc_changes` Tool with `target_doc='skills/brewing-historian/cluster/patterns/<file>.md'` (ARBITER.md routing accepts this `skills/{path}.md` shape post-Wave 2 PR 1).


# SECTION 4 - WBC REFERENCE

The WBC competition taxonomy reference is split across two docs (both surfaced via MCP `list_docs` / `read_doc`):

- **[docs/skills/wbc-brewing-archivist/cluster/wbc-reference.md](docs/skills/wbc-brewing-archivist/cluster/wbc-reference.md)** - lean Latent mapping (5 control axes + 8 strategy families collapsed onto Latent's **6 strategies + 4 modifiers** post-v8.5 + Cross-Cutting Control Patterns layer + Practical Experiment Queue + "consciously not pursuing" appendix). Pull when you need the "is this WBC technique already covered as a Latent strategy or modifier?" lookup, or when reaching for a calibration-axis move (water strength / agitation taper / filter behavior / pre-brew conditioning).
- **[docs/skills/wbc-brewing-archivist/cluster/wbc-recipes.md](docs/skills/wbc-brewing-archivist/cluster/wbc-recipes.md)** (v8.4 NEW) - comprehensive 102-recipe archive (2022-2025) with 38 subtype definitions and the strategy-family / sub-form context for each recipe. Pull when you need to look up a specific competitor's recipe, or when the brief calls for "which 2024 finalists used Selective Bloom Hybrid?" / "what brewer is canonical for Phase-Mapped Hybrid in competition?" Use as reference material, not as a canonical registry.

**Pull during Step 1d when looking for a non-default move (v8.5 reframe).** The 102-recipe corpus is the substrate for the "experiment Chris wouldn't think of" goal — when the coffee profile is unusual, when the default strategy isn't landing, or when a brief is reaching for something specific (e.g. "which 2025 finalists used Selective Bloom Hybrid?"). Lookup discipline:

- `wbc-reference.md` — fastest path. Pull when you need to map a WBC family / subtype onto Latent's 6+4 framework, when checking the Cross-Cutting Control Patterns playbook (Time Distribution / Water Strength / Agitation Taper / Filter Behavior / Pre-Brew Conditioning / Output Selection extension), or when checking the "consciously not pursuing" appendix.
- `wbc-recipes.md` — deep archive. Pull when you need a specific competitor's recipe, or when scoping a deliberate experiment ("show me 2024 finalists who used Cooling-Curve Design").

Original 18-recipe wbc-reference.md split out of this master doc on 2026-05-03 (Sprint 2.7); expanded to the 102-recipe pair on 2026-05-06 (v8.4) when Hybrid was promoted to a 6th first-class strategy in this document; reframed from reference-only to actively-consulted on 2026-05-08 (v8.5) when Role-Based Pulse was promoted to a 4th canonical Axis 2 modifier and the Cross-Cutting Control Patterns doc layer was added.

# SECTION 5 - CHANGELOG

*Last updated: 2026-05-08. Full version history (v8.5 WBC corpus active consultation + Role-Based Pulse + dilution form, v8.4 Hybrid promotion + Cooling-Curve Design, v8.3 immersion modifier, prior v8.x evolution) lives in `git log` — `git log --oneline BREWING.md` for the audit trail.*

**v8.5 (2026-05-08):** WBC corpus reframed from reference-only to actively-consulted in Step 1d (new "WBC corpus + cross-cutting control patterns check" Named Consideration sitting next to Cooling-Curve Design). Role-Based Pulse promoted from the wbc-reference.md "consciously not pursuing" list to a 4th canonical Axis 2 modifier (`role_based_pulse`) for percolation-only per-pour role discipline. Output Selection canonical enum gained a 4th form (`dilution`) with optional `dilution_g` for post-brew water addition. Brewer rotation discipline gained 3 WBC anchor cross-refs (Switch ↔ Ferket Selective Bloom; Orea v4 + Sibarist FAST + Melodrip ↔ Wölfl Extraction Push; SWORKS ↔ Carlos Medina Suppression analog). Cross-cutting calibration axes (water strength / agitation taper / filter behavior / pre-brew conditioning) deliberately stay in the [docs/skills/wbc-brewing-archivist/cluster/wbc-reference.md](docs/skills/wbc-brewing-archivist/cluster/wbc-reference.md) Cross-Cutting Control Patterns doc layer rather than promoting to canonical modifiers — "keep compact strategy set, add separate doc layer" framing. MODIFIER_TYPES = 4 (output_selection / inverted_temperature_staging / aroma_capture / role_based_pulse). OUTPUT_SELECTION_FORMS = 4 (early_cut / late_cut / both / dilution).
