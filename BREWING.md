**COFFEE BREWING MASTER REFERENCE**

*Coffee Research · Latent*

Brew Prompt · Roaster Reference · Archive Patterns · Grind Reference

*Last updated: 2026-05-03. Version history in `git log`.*

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
| Country + Macro Terroir | `terroirs` | Internal axis name; `docs://taxonomies/regions.md` is the doc-path equivalent for prose. |
| Cultivar | `cultivars` | Internal axis name; `docs://taxonomies/varieties.md` is the doc-path equivalent. |
| Base Process + fermentation / drying / intervention / experimental modifiers + decaf + signature | `processes` | |
| Roaster | `roasters` | |
| Producer | `producers` | |
| Brewer | `brewers` | |
| Filter | `filters` | |
| Flavor Notes + Structure Tags | `flavors` | |
| Grinder + Grind Setting | `grinders` | |
| Roast Level | `roast-levels` | |
| Extraction Strategy | `extraction-strategies` | Strict 5-value enum; rarely needs lookup at Step 4. |
| Extraction Modifiers | `modifiers` | Optional Axis 2 on the resolved brew. |

**Tool, not URI.** `canonicals://{axis}` URIs ALSO exist as MCP Resources (same JSON payload), but two gotchas: (1) many MCP clients (claude.ai mobile in particular) don't enumerate URI templates in the resource list, and (2) `read_doc(uri="canonicals://...")` returns "Unknown doc URI" because `read_doc` only handles `docs://` URIs. **Always use the `read_canonical(axis)` Tool**; it serves the same content and works on every client. The catalog of available axes is at `list_canonicals()`.

**Lookup discipline.** For every Step 4 field that has a corresponding taxonomy:

1. Call `read_canonical(axis: "<name>")` for the axis. If the value matches a canonical name (or an alias that resolves to canonical), use the canonical form.
2. If it does not match canonically but a close match exists (e.g. "Geisha" -> "Gesha", "Espro Bloom Flat" -> "xBloom Premium Paper Filters"), use the canonical and add a one-line note that the original term was an alias.
3. If nothing resolves, write the best guess and flag it as `(NET-NEW)`. The sync step surfaces this for a deliberate canonical-registry edit.

Drift is caught at sync time, not after. Be precise.

### Working with the Latent MCP server

A few operational notes for fetching MCP Resources and calling Tools via this Claude project:

- **Tool search ranking is opaque.** If a Tool you expect (e.g. `push_brew`, `propose_doc_changes`) does not surface on the first `tool_search`, retry with broader search terms before assuming the Tool isn't loaded. The MCP server has 24+ Tools live; if `push_brew` returns nothing, try "brew", "push", or "latent" before concluding it's missing.
- **Re-fetch the schema before claiming a field is missing.** The deployed Tool manifest may be fresher than the model's session memory. If a field on `push_brew` or another Tool seems to have changed shape, call the Tool's introspection (or read the Tool's input_schema directly) before reporting it as missing.
- **After a code merge, wait for Vercel deploy and start a fresh conversation.** New MCP Tools and updated schemas propagate via Vercel's auto-deploy (~30-60 seconds typical). The claude.ai conversation's tool manifest is cached at conversation start; a fresh conversation picks up the new manifest. Reusing an old conversation after a server-side change can produce stale-tool errors that look like real bugs but are cache propagation issues.

## Location Constraints

## Office (Downtown Palo Alto)

| **Field**                     | **Details**                                                                                                                                                                                                                                                                                                                                                                               |
|-------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Brewers**                   | April Brewer Glass, Kalita Wave Tsubame 155, SWORKS Bottomless Dripper. (XBLOOM available but manual preferred.)                                                                                                                                                                                                                                                                          |
| **Filters**                   | xBloom Premium Paper only (compatible with both Kalita Wave 155 and Bottomless Dripper).                                                                                                                                                                                                                                                                                                      |
| **Water**                     | Tap water - Downtown Palo Alto municipal supply. Do not assume soft or mineralized water. No water adjustments available.                                                                                                                                                                                                                                                                 |
| **April Brewer**              | Drains consistently fast (~2:30) regardless of grind or agitation - not suitable for Full Expression. Reserve for Clarity-First office brews only.                                                                                                                                                                                                                                        |
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

One of five named strategies. Strategy selection is the primary act of recipe design and is confirmed at Step 1d before any equipment, parameters, or modifiers are decided. Two pairs share mechanics but differ in intent: **Suppression / Clarity-First** share coarse grind + low temp + low agitation but differ in whether you are holding an over-expressive coffee back vs protecting a delicate one from being overworked. **Full Expression / Extraction Push** share fine grind + high temp but differ on the agitation lever (push the bed vs control turbulence with Melodrip) and on the coffee class (heavy ferment vs clean transparent). The agitation lever is the strategy choice for these two.

**Suppression.** Used when the coffee has *more* expressive material than is desirable to fully extract. Heavy fermentation or processed lots where wine/booze/phenolic notes dominate if extraction is allowed to run normally. Intent: deliberately limit extraction to keep harshness from coming through while still developing sweetness. Mechanics: lower temperature (88-92°C, often the primary lever), coarser grind (6.7-6.5), low agitation, low-moderate ppm water, often pulse-pour structure with kettle held off-base or actively cooled. Looks mechanically similar to Clarity-First but opposite in logic. Confirmed pattern: anaerobic naturals where temperature primacy resolves the cup (Hydrangea Finca Inmaculada, Basha Bekele Kokose). Reference recipe outside this archive: Carlos Medina, 2023 WBrC champion (CGLE Sidra, 91°C, 5x50g pulses every 30s).

**Clarity-First (default for transparent / variety-driven coffees).** Used when the coffee's expressive ceiling is already moderate and the goal is preserving aromatic and structural transparency. The cup has enough; extract gently and let it speak. Mechanics: 6.8-6.5, low agitation (Melodrip), fast-flow filters, 1:16-1:17, moderate temp (91-94°C). Best for washed Gesha, Ethiopian washed landraces, Sydra/Typica Mejorado, Laurina, climate-controlled Esmeralda "NC" naturals. Risk: turbulence flattening acidity; over-extraction producing tannin in coffees with intrinsically light body.

**Balanced Intensity.** Used when the coffee has more density or complexity than Clarity-First can express but has not crossed into needing aggressive extraction. Honey lots, dense varieties (Pacamara, Mokkita), most yeast-inoculated experimental lots, Gesha anaerobic honey lots. Mechanics: 6.5-6.3, moderate agitation, 1:15-1:16, 93-95°C, often with controlled flow (xBloom Premium Paper, SWORKS Restricted valve through main pours). Sits between Clarity-First's gentleness and Full Expression's force.

**Full Expression.** Used when the coffee will under-deliver at any lower extraction. Heavy co-ferments, anaerobic washed Colombian Geshas (Huila/Cauca), anoxic naturals, heavy thermal-shock washed lots, dense washed varieties with fruit-forward roaster intent. The coffee will not open up without force. Mechanics: 6.3-5.5 (or finer), **high agitation - active spiral, multiple pours, push the bed**, near-boiling water, longer brew time, 1:13-1:17. Melodrip is *not* part of Full Expression. Agitation is the defining mechanic; if you are using Melodrip on a fine-grind / high-temp recipe, you are doing Extraction Push, not Full Expression. Risk: astringency, drying finish, structural collapse if the coffee can't actually take it.

**Extraction Push (for Clarity).** Used when a *clean* coffee (washed processed lots, washed Geshas, Esmeralda climate-controlled naturals) will benefit from higher yield than Clarity-First produces, but where Full Expression's high agitation would compress the aromatic clarity that makes the coffee worth drinking. Intent: push extraction yield while preserving transparency. Same fine-grind + near-boiling-temp mechanics as Full Expression, but **the agitation lever is inverted**. Melodrip controls turbulence so structure and aromatic separation survive the push. Mechanics: 6.3-5.5 (or finer), **low agitation (Melodrip)**, fast-flow filters (Sibarist FAST flat or cone), near-boiling water (93-98°C), 1:15-1:17, often longer total brew time than Clarity-First but cleaner cup than Full Expression. Reference recipes outside this archive: Martin Wölfl 2024 WBrC champion (Don Benji Gesha natural anaerobic, OREA V4 + Sibarist FAST + 490 µm + Melodrip, 93°C); Jackie Tran (HLE Gesha anaerobic natural, flat-bottom + 600 µm + 94°C with full-drawdown pours); Savina Giachgia (similar Melodrip-based clarity-push approach). Currently empty in this archive. Empty-slot status is acceptable; Suppression was also empty when promoted to a named strategy in v8.0.

### Axis 2 - Modifiers (orthogonal techniques)

Modifiers are optional layered techniques that operate on different mechanical axes than extraction intensity. A brew may have zero, one, or multiple modifiers. When a modifier is used, it is named explicitly in the recipe and the resolved brew. Modifiers require justification at Step 1d. They are not a default. But Chris is past the "modifiers are exotic" phase. If a modifier is plausible for the coffee at hand, propose it - don't reserve modifiers for the third or fourth iteration.

**Output Selection.** Discarding portions of the extraction curve to reshape the cup. Three forms: *early cut* (remove first 5-10g of brewed liquid - typically saline / under-developed / sharp), *late cut* (stop short of target yield to avoid drying / astringent late fraction), or *both* (keep only the middle band). Most useful on coffees with extreme fronts or backs. Heavy co-ferments where the bitter tail is geographically concentrated in the late fraction, or processed lots where the early fraction reads as off rather than expressive. Compatible with any strategy. Cup volume implication: brew target weight is no longer cup weight; recipe must specify both. Reference recipe outside this archive: Carlos Escobar 2025 WBrC 3rd place (Maracaturra mossto natural, Hario Switch, remove first 8-10g, cut at 155g of intended target, hybrid immersion -> percolation).

**Inverted Temperature Staging.** Starting low and ending high, opposite of natural decline or stable-on-base. Premise: low-temp opening extracts sweetness and volatile aromatics without pulling phenolic / bitter compounds; raising temperature on a partially-extracted bed builds structure on what's already in solution. Reference recipe outside this archive: Ryan Wibawa 2024 (Hario Switch, blend across natural / thermaloak / mossto anaerobic, 86°C -> 92°C across two immersion phases). Compatible with Balanced Intensity or Full Expression strategies. Generally not Clarity-First (counterproductive on already-light coffees) or Suppression (high-temp finish defeats the suppression intent). Most worth testing on coffees that go thin/sour at full Clarity-First but bitter at standard Balanced - the "neither lever resolves it" cases.

**Aroma Capture.** Mid-brew cooling of the early extract fraction to preserve volatile aromatics that would otherwise dissipate as the cup is brewed and served hot. Hardware available at home: Paragon chilling ball applied to the carafe during/immediately after the early pours, or covered server to trap aromatics. Reference recipes outside this archive: Giacomo Vannelli (frozen ball on first 50g of extract), Wataru Iidaka (dry ice on first phase + covered server). Most useful on highly aromatic coffees (washed Geshas, Esmeralda climate-controlled naturals, anaerobic naturals where florals are the target). Compatible with any strategy. Home only - Paragon chilling ball is not part of the office equipment set.

**Immersion.** Switch-style or multi-stage immersion brewing. Full immersion, staged immersion, or hybrid immersion-to-percolation phase transitions where distinct phases of the brew are assigned different extraction roles. Used to equalize extraction across the bed (immersion phase) and then finish with a controlled drawdown (percolation phase), or to separate fermentation-derived volatiles from later structure development by holding bed contact at low flow before opening up. Hardware: **Hario Switch** at home is the canonical immersion + hybrid brewer (lever closed = immersion, opened = percolation drawdown). The **SWORKS Bottomless Dripper** at the office produces a similar effect via valve state. Dial 0 (Fully Closed) bloom is functionally an immersion phase, Dial 5 (Restricted) is near-immersion modulation, and the transition to Dial 6-7 is the percolation finish; the SWORKS valve calibration is essentially an immersion-to-percolation continuum with finer-grained control than the Switch lever. Currently unexperimented as a deliberate strategy. Recipes have used the SWORKS bloom-immersion phase as a contact-time tool but have not framed the brew as immersion-modifier-active. Reference recipes outside this archive: Ryan Wibawa (immersion staging on Switch), Charity Cheung (multi-stage immersion), Garam Victor Um (sequential immersion-to-percolation hybrid). Compatible with any strategy, though most likely to pair with Balanced Intensity or Full Expression where contact-time control is the primary lever. Not covered by this modifier: literal mesh-then-paper filter swaps mid-brew (Garam 2023). That requires a metal mesh filter not in the inventory.

### Strategy + Modifier Notation

Examples of how a brew is described under this framework:

- *Hydrangea Finca Inmaculada Gesha Natural*: **Suppression** - temperature primacy, 6.4 / 93°C / Kalita + xBloom Premium Paper.
- *Moonwake Jeferson Motta*: **Full Expression** (no modifiers) - 6.0 / 98°C / 1:15, active spiral.
- *Moonwake El Eden Tamarind Washed*: **Full Expression + Output Selection (late cut)** - flagged for re-evaluation; informal pre-framework testing showed late-cut benefit.
- A future Esmeralda Gesha brew testing aroma preservation: **Clarity-First + Aroma Capture** - Paragon chilling ball on bloom + Pour 1.
- A future test on an anaerobic natural that doesn't resolve at Suppression: **Balanced Intensity + Inverted Temperature Staging** - 88°C -> 94°C across two phases.
- A future test on a clean washed Gesha pushing yield while preserving clarity: **Extraction Push** - 5.8 / 95°C / Sibarist FAST + Melodrip / 1:16, Wölfl-style.
- A future test on a Switch immersion approach for contact-time control: **Balanced Intensity + Immersion** - Hario Switch closed 0:00-1:30, opened 1:30-3:00 for percolation finish, Wibawa-style staging.

### Brewer rotation discipline

Chris owns 11 brewers spanning 4 geometries (cone, flat, wave, immersion-hybrid). Most days the same one or two get used. At Step 2 (Recipe Output), Claude should propose the brewer that best fits the strategy and coffee profile, even if it means reaching for one Chris hasn't used in a month - Orea v4 for a flat-bottom Clarity-First test, Hario Switch for an Immersion modifier test, Chemex Funnex for a small-dose Clarity-First brew, Sibarist Brewing System when the dripper/paper interface needs to be eliminated as a variable. The "default brewer" trap is the same shape as the "default strategy" trap. See Equipment Reference for the rotation framework.

## Step 1 - Coffee Brief (Claude runs this automatically)

Before selecting any equipment or parameters, Claude must complete a Coffee Brief by reasoning through the following in order:

**1a. Web search for roaster brew guide**

Search for a brew guide from this roaster for this coffee. If found, note the key parameters (ratio, grind direction, temperature, agitation level). Do not follow it blindly - use it as a signal about the roaster's extraction intent for this coffee. If not found, note that and proceed.

**1b. Process and variety risk flags**

Evaluate the coffee's process and variety against the Process / Variety Signal table in this document. Explicitly state whether any flags apply. This determines whether the default Clarity-First strategy is appropriate or whether a different extraction strategy should be considered from the start.

**1c. Brief summary**

In 3–5 sentences: what is this coffee, what does the terroir and cultivar suggest about likely expression, what does the process tell you about extraction behavior, and what does the roaster's positioning (if known) suggest about intent?

**1d. Proposed extraction strategy and modifiers**

Based on the above, propose one of the five extraction strategies below and explain why. Then, separately, assess whether any modifiers (Output Selection, Inverted Temperature Staging, Aroma Capture, Immersion) are warranted for this specific coffee. Most coffees will not warrant any. If a modifier is proposed, justify it explicitly. Then pause and ask for confirmation before proceeding to the recipe.

| **Strategy**                | **Grind Range**    | **Temperature**         | **Typical Agitation**                                                | **Ratio Tendency** | **Best For**                                                                                                                                                                                                                                                                             |
|-----------------------------|--------------------|-------------------------|----------------------------------------------------------------------|--------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Suppression**             | 6.7-6.5            | 88-92°C (primary lever) | Low - pulse pours, no agitation                                      | 1:15-1:16          | Anaerobic naturals where temperature primacy resolves bitter tail; coffees where full extraction would surface fermentation harshness                                                                                                                                                    |
| **Clarity-First (default)** | 6.8-6.5            | 91-94°C                 | Low - Melodrip, gentle spiral                                        | 1:16-1:17          | Washed Gesha, Ethiopian washed landraces, Sydra/Typica Mejorado, Laurina, Esmeralda "NC" climate-controlled naturals                                                                                                                                                                     |
| **Balanced Intensity**      | 6.5-6.3            | 93-95°C                 | Moderate - controlled spiral, some bed exposure                      | 1:15-1:16          | Honey lots, dense varieties (Pacamara, Mokkita), most yeast-inoculated experimental lots, Gesha anaerobic honey                                                                                                                                                                          |
| **Full Expression**         | 6.3-5.5 (or finer) | 95-99°C                 | **High - active spiral, multiple pours, push the bed**               | 1:13-1:17          | Heavy anaerobic, anaerobic washed Colombian Geshas, anoxic naturals, dense washed varieties with fruit-forward intent, high-EY roasters (Sey, Flower Child, Picky Chemist, Dak). Note: on the EG-1, grind below 5.5 changes distribution shape but not D50 - temp / agitation / filter / time are the primary levers. |
| **Extraction Push**         | 6.3-5.5 (or finer) | 93-98°C                 | **Low - Melodrip, clarity-preserving**                               | 1:15-1:17          | Clean coffees where Clarity-First leaves yield on the table but Full Expression's high agitation would compress aromatic clarity: clean washed Geshas, Esmeralda climate-controlled naturals, washed processed lots with Wölfl/Tran/Giachgia targets. Empty in this archive (promoted strategy v8.2, awaiting first confirmed brew). |

Suppression and Clarity-First share grind range and look mechanically similar, but the *intent* differs. Always state the intent explicitly. Full Expression and Extraction Push share fine grind + high temp but differ on the agitation lever - high agitation pushes the bed (Full Expression); Melodrip controls turbulence to preserve clarity (Extraction Push). The agitation lever choice IS the strategy choice for these two. Going below grind 6.3 is a different philosophy, not a tweak. For the highest-EY roasters, going below 5.5 may be required - but see Grinder Notes.

**Modifier check (required at Step 1d, even if the answer is "none"):**

- **Output Selection** - Is there a structural reason to discard part of the extraction? Heavy co-ferments often benefit from a late cut. Lots with sharp/saline fronts may benefit from an early cut. Default: none.
- **Inverted Temperature Staging** - Has this coffee or process type historically been resistant to both Clarity-First and Balanced lever moves? Inverted staging is the experimental fallback when the standard temperature primacy rule does not resolve the cup. Default: none.
- **Aroma Capture** - Is this a highly aromatic coffee (Esmeralda Gesha, washed Gesha, anaerobic natural with floral target) where mid-brew cooling could preserve volatiles? Hardware available at home only (Paragon chilling ball). Default: none.
- **Immersion** - Is this a coffee where contact-time control via deliberate immersion or immersion-to-percolation phase mapping is structurally appropriate? Switch-style staging at home, or framing extended SWORKS Dial 0-5 phases as immersion contact-time control at the office. Most relevant when the strategy is Balanced Intensity or Full Expression and the iteration loop suggests contact time is the primary unresolved lever. Default: none.

If any modifier is proposed, output a 1-2 sentence rationale explaining what the modifier is meant to solve for this specific coffee and what the risk is if the modifier is wrong (e.g. early cut too aggressive → weak cup; inverted staging → under-extracted finish). Wait for confirmation on both strategy and modifier(s) before proceeding to Step 2.

## Step 2 - Recipe Output (after strategy is confirmed)

Once the extraction strategy and any modifiers are confirmed, select the brewer and filter based on the brewing location, then output a full recipe using the format below.

## Output Format

| **Field**             | **Value**                                                                                            |
|-----------------------|------------------------------------------------------------------------------------------------------|
| **Coffee**            |                                                                                                      |
| **Strategy**          | [Suppression / Clarity-First / Balanced Intensity / Full Expression / Extraction Push]               |
| **Modifiers**         | [None / Output Selection (form) / Inverted Temperature Staging / Aroma Capture / Immersion / multiple] |
| **Brewer**            | [brewer + valve position note if Bottomless Dripper]                                                 |
| **Filter**            |                                                                                                      |
| **Dose**              |                                                                                                      |
| **Water**             | [total brew weight]                                                                                  |
| **Cup Yield**         | [only if Output Selection used; specify what is kept and what is discarded]                          |
| **Grind**             |                                                                                                      |
| **Temp**              | [include staging if Inverted Temperature Staging modifier active]                                    |
| **Bloom**             | [weight], [pour time], wait [time]                                                                   |
| **Pour Structure**    | [list each pour with weight, duration, wait, and - for Bottomless Dripper - valve state per phase. If Aroma Capture modifier active, note where chilling ball is applied. If Immersion modifier active, note phase boundaries (lever/valve transitions) and what each phase is doing - e.g. "0:00-1:30 immersion, 1:30-3:00 percolation finish".] |
| **Target Total Time** |                                                                                                      |

After the recipe table, provide three short sections:

- Why this brewer and filter combination was selected (2-3 sentences referencing the confirmed extraction strategy and brewing location constraints).

- What to watch for in the first brew - specific risk flags given this coffee's profile.

- If any modifier is active: a Modifier Note explaining what the modifier is meant to do, how to evaluate whether it worked, and the failure mode (e.g. for Output Selection late cut: "if cup reads thin or under-developed, the cut was too early; if drying tail persists, cut earlier").

- If Bottomless Dripper is selected: include a Valve Strategy note explaining the rationale for valve state at each pour phase, and what to adjust if the cup reads bitter (open earlier) or flat/sour (stay restricted longer).

## Step 3 - Iteration Loop

After each brew, provide tasting notes covering aroma, attack, mid-palate, body, and finish. Note how it changes as it cools.

Claude will respond with adjusted parameters. At each iteration, Claude must also assess:

- Are we making incremental progress, or does something feel structurally wrong (consistently sour, flat, hollow, or one-dimensional despite multiple tweaks)?

- If 2–3 iterations in and the cup still feels off structurally, Claude should flag this explicitly and ask whether to pivot extraction strategy rather than continue tweaking parameters within the current one.

- If the confirmed extraction strategy seems mismatched to what you are tasting, Claude should recommend a strategy shift and explain what that would change about the approach.

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

- **Subprocess** - Honey color tier only: `White`, `Yellow`, `Red`, `Black`, `Purple`, `Generic`, `Hydro`. Omit for non-Honey bases.

- **Fermentation Modifiers** - array, optional. Canonical values from `canonicals://processes` § fermentation axis (e.g. `Anaerobic`, `Double Anaerobic`, `Yeast Inoculated`, `Lactic`, `Thermal Shock`).

- **Drying Modifiers** - array, optional. From `canonicals://processes` § drying axis (e.g. `Anaerobic Slow Dry`, `Greenhouse Drying`, `Raised Bed`).

- **Intervention Modifiers** - array, optional. From `canonicals://processes` § intervention axis.

- **Experimental Modifiers** - array, optional. From `canonicals://processes` § experimental axis (`Koji`, `SCOBY`, `Enzyme-Assisted`, `Barrel-Aged` only - `Anaerobic` is on the *fermentation* axis, not experimental).

- **Decaf** - if applicable: `SWP`, `MWP`, `EA`, `CO2`. Omit otherwise.

- **Signature Method** - proper-name proprietary process if the producer has one (`Moonshadow`, `TyOxidator`, `Hybrid Washed`). Omit otherwise.

---

### Recipe

- **Brewer** - canonical from `canonicals://brewers` (e.g. `Sworks Bottomless`, `Hario V60`, `Orea v4`, `Kalita Tsubame`, `April`, `UFO`, `Hario Switch`). The brewing doc body uses descriptive forms (`SWORKS Bottomless Dripper`, `April Brewer Glass`, `Hario V60 Glass`) for readability; resolve to canonical when populating Step 4. If valve / Dial structure is part of THIS brew's recipe (e.g. SWORKS), keep that detail in the Pour Structure field, not the Brewer field - the Brewer field is equipment-only.

- **Filter** - canonical from `canonicals://filters` (e.g. `xBloom Premium Paper Filters`, `CONE FAST`, `FLAT FAST`, `UFO FAST`, `WAVE B3`, `CAFEC Abaca+ Cup 1 Cone Paper Filter`). Note: legacy `Espro Bloom Flat` resolves via alias to `xBloom Premium Paper Filters`. Sibarist canonicals do NOT include the `Sibarist` brand prefix (that's manufacturer metadata, not part of the canonical name); use `CONE FAST` not `Sibarist FAST CONE`. Cafec papers: short forms (`Cafec T-92`) resolve via alias to canonical (`CAFEC T-92 - Cup 1 Light Roast Paper Filter`); use either form.

- **Dose** - grams (e.g. `15g`, `18g`).

- **Water** - `<weight>g (<ratio>), <type>` (e.g. `250g (1:16.7), office tap`, `288g (1:16), home remineralized`).

- **Cup Yield** - only if Output Selection modifier is active; specify what was kept (e.g. `kept 155g of 200g brew weight; discarded first 8g + last 37g`).

- **Grinder** - canonical from `canonicals://grinders` (currently `EG-1`).

- **Grind Setting** - must match a valid setting for the grinder; for EG-1, decimal between 3.0 and 8.0 in 0.1 steps. Format: `6.3`, not "EG-1 6.3" - Grinder + Grind Setting are separate fields.

- **Extraction Strategy** - exactly one of `Suppression`, `Clarity-First`, `Balanced Intensity`, `Full Expression`, `Extraction Push`. Strict canonical. Defined in this document (the Two-Axis Framework); not in `canonicals://processes`.

- **Modifiers** - JSON-style or labeled array of zero-or-more modifiers from this list: `Output Selection`, `Inverted Temperature Staging`, `Aroma Capture`, `Immersion`. Each modifier with its sub-fields (Output Selection: form + brew_weight + cup_yield; Inverted Temp: phases; Aroma Capture: application; Immersion: application). State `None` explicitly if no modifiers - empty is a positive signal that modifiers were considered.

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

After producing the resolved brew, assess whether the learnings should propagate back to the master reference. Candidate sections to update: [Roaster Reference](docs/brewing/roasters.md) (new roaster data or strategy tag refinement), Archive Patterns (add coffee to appropriate Suppression / Balanced / Full / Unclear section), By Variety (new variety data point), By Process (process row exception or confirmation), Office Brewing Notes (equipment-specific principle), Modifier Patterns (if a modifier was used - add or refine), Open Questions (resolve or add question). Propose specific edits via the `propose_doc_changes` MCP Tool with citations targeting the relevant `BREWING.md#section-anchor` location, not generic "should update" observations.

## Process / Variety Signal Table

*Used in Step 1b. Flags that should trigger a non-default extraction strategy.*

| **Process / Variety Signal**                                | **Default Risk**                                        | **Recommended Start**                                                 | **Watch For**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
|-------------------------------------------------------------|---------------------------------------------------------|-----------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Washed Gesha / Ethiopian landrace                           | Fine - Clarity-First is correct                         | Clarity-First                                                         | Turbulence flattening acidity; don't over-agitate                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Honey (light / white)                                       | Fine - slight extraction bump helpful                   | Clarity-First → Balanced                                              | Sweetness can read thin at coarser grind                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Natural (controlled / DRD)                                  | Mild risk                                               | Balanced Intensity                                                    | Vinous/wine character needs support, not suppression. Exception: Hacienda La Esmeralda “NC” climate-controlled naturals are clean enough to stay Clarity-First - do not apply Balanced default.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Anaerobic natural                                           | Moderate risk - Clarity-First will under-extract; Balanced Intensity over-extracts | Suppression                                                          | Bitter finish is temperature-driven, not grind-driven - drop temp before coarsening. Evaluate cool; cup integrates significantly below 50°C. Temperature primacy confirmed across Colombian (Finca Inmaculada, Valle del Cauca) and Ethiopian (Basha Bekele Kokose, Sidama Bensa) lots - pattern is process-driven, not terroir-driven. Reclassified from Balanced Intensity to Suppression in v8.0 - same mechanics (low temp, moderate-to-coarse grind) but the intent is now named: holding extraction back to keep fermentation harshness from surfacing, not pushing extraction up from Clarity-First. If Suppression does not resolve the cup, **Balanced Intensity + Inverted Temperature Staging** (88°C → 94°C) is the experimental fallback. |
| Anaerobic washed (clean / lighter fermentation)             | Moderate risk                                           | Balanced Intensity                                                    | Phenolic sharpness if pushed too hard; sour if too coarse                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Anaerobic washed (heavy / Colombian Huila / Cauca)          | High risk - Clarity-First will under-extract            | Full Expression                                                       | Confirmed pattern: Colombian anaerobic washed Geshas from Huila/Cauca reliably need Full Expression.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Anoxic natural (sealed container fermentation)              | High risk - Clarity-First will under-extract            | Full Expression                                                       | Process overrides variety signal - do not apply Pink Bourbon/Rosado variety ceiling logic to anoxic natural lots. Temperature taper resolves bitter tail. Note: 'Anoxic' canonicalizes to `fermentation:[Anaerobic]` with qualifier `Anoxic` per `canonicals://processes`. The qualifier is queryable and preserves the strategy distinction (Anoxic natural → Full Expression; Anaerobic natural → Suppression). |
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
| **April Brewer Glass**        | Flat                   | Medium                      | High sweetness, rounded acidity           | Home + Office. OFFICE: drains ~2:30 regardless of grind - not suitable for Full Expression. Use Kalita 155 or Bottomless Dripper instead.                                                                                |
| **Kalita Wave 155**           | Wave Flat              | Medium-Slow                 | Fuller body, strong sweetness             | Home + Office. OFFICE DEFAULT for Full Expression/Balanced Intensity: 3:00–3:30 with xBloom Premium Paper. NOTE: runs faster than expected even at finer grinds.                                                                  |
| **SWORKS Bottomless Dripper** | Cone (variable)        | Variable - valve-controlled | Flexible depending on valve state         | Office only. Primary variable-flow brewer. Valve dial adjusts flow restriction per pour phase. Key advantage: solves fast-drain problem by restricting flow independently of grind size. Functionally an **immersion-to-percolation continuum** with finer-grained control than the Switch lever - Dial 0 = immersion, Dial 5 = near-immersion modulation, Dial 6-7 = percolation finish. Can be used as the office Immersion-modifier brewer when the strategy calls for deliberate immersion contact-time framing rather than just bloom-phase flow control. See Valve Position Reference. |
| **Hario Switch Glass**        | Cone Hybrid            | Variable                    | Round sweetness, controlled extraction    | Difficult coffees, extraction experiments. Home only. **Canonical Immersion modifier brewer at home** - lever closed = immersion phase, opened = percolation drawdown. Use for Switch-style staging (Wibawa) and immersion-to-percolation hybrid recipes (Garam, modulo no mesh-then-paper swap available).                                                                                                                                                                    |
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

Continue to SECTION 3 - ARCHIVE PATTERNS below.

<!-- Original SECTION 2 cards (Moonwake / Dak / Sey / ... / Colibri) are preserved verbatim in docs/brewing/roasters.md; this stub keeps the SECTION 2 header anchor for back-references. -->

# SECTION 3 - ARCHIVE PATTERNS

*Coffee Research · Latent*

This section captures strategy-level learnings from the brew archive. It is NOT a recipe log - the app handles that. This is about extraction strategy patterns: what approaches work for which types of coffees, and what corrections have been needed.

*Rule: Don't add a pattern until you have seen it in at least 2 coffees. One coffee is a data point. Two is the beginning of a pattern.*

## How to Use This Section

Reference this during the Coffee Brief (Step 1) when designing a recipe for a new coffee. Scan relevant entries based on the coffee's process, variety, and origin - not to copy past recipes, but to flag whether a non-default strategy has historically been needed for similar coffees.

Update this section after archiving a new best brew. Ask: did this coffee teach something about extraction strategy that applies to future coffees of this type? If yes, add it here.

## By Extraction Strategy

## Coffees That Confirmed Clarity-First

These coffee types have consistently worked well at the default approach (EG-1 6.8–6.5, low agitation, fast-flow filters):

- Washed Gesha from Panama / Colombia highlands - consistent peak at Clarity-First. UFO or Orea Glass with Sibarist FAST is the reliable setup.

- Ethiopian washed landraces (74110, 74112, 74158) from Sidama/Bensa - Clarity-First works well but cups consistently improve cooling. Don't judge the brew until it's below 50°C.

- Typica Mejorado / Sydra from Ecuador (e.g. Finca Soledad TyOxidator, Finca Soledad Sydra Cold Fermented Washed DRD) - Clarity-First with longer bloom and uninterrupted pour. Savory if over-bloomed or agitation too high. Key finding (Sydra): variety signal dominates over experimental process flag when flavor targets are bright and citric. UFO + Sibarist Fast Cone + Melodrip at EG-1 6.5 / 92°C confirmed first-pass. Fast drawdown (~1:35) did not require compensation.

- Washed Laurina - intrinsically light body; forcing extraction does not add weight, it adds tannin. Stay Clarity-First.

- Panama Gesha Natural from Hacienda La Esmeralda El Velo - climate-controlled drying (“NC” designation, Peterson family’s indoor drying room) produces a cleaner, more restrained natural than traditional raised-bed sun-dried lots. Confirmed Clarity-First across two data points: Hydrangea El Velo Natural (15g, UFO Ceramic + Sibarist UFO Fast, EG-1 6.7 / 91°C) and Coffee with Dongze HLE Valle 3NC (12.5g, V60 Glass + Sibarist B3 Cone, EG-1 6.5 / 93.5°C). Dose determines grind: 6.7 works at 15g but produces hollow body at 12.5g; 6.5 is the correct setting for small-pouch 12.5g format. Climate-controlled drying preserves variety transparency - do not push toward Balanced Intensity despite the natural process. Cup peaks cool (45–50°C); expect rose, bergamot, stone fruit, wildflower honey, tea-like silky body.

- Finca Sophia Grand Reserve Natural (Gesha) from Coffee with Dongze - Finca Sophia Gesha lot at Volcán altitude, standard raised-bed natural drying. Confirmed Clarity-First at 12.5g / 200g / Hario V60 + CONE B3 / EG-1 6.5 / 94°C. Cup: honey, bergamot, light black tea structure, stone fruit, with rose emerging on the back half cooling and deepening below 45°C into honeyed-tea-with-rose. Peak 45-50°C. Sits +0.5°C above the HLE Valle 3NC (NC climate-controlled) reference at the same dose - confirms the working rule that standard raised-bed naturals want slightly more extraction than NC drying. One data point - flag for confirmation on other standard-natural Panama Gesha lots from Finca Sophia or equivalent altitude.

- Panama Gesha washed DRD from Lamastus Elida at 1950m+ - confirmed Clarity-First. One data point: Picolot Lovely Vuelta (Simba's Comp Edition), 15g / 250g / SWORKS Bottomless (Dial 0 bloom -> Dial 5 Pours 1-2 -> Dial 7 tail cut) / xBloom Premium Paper Filters / EG-1 6.6 / 92°C / office tap. Cup: hibiscus, grapefruit, candied plum, silky tea-like body with tart-sweet balance, clean sweet finish. Peaks cool (45-55°C). The DRD designation here is controlled drying only (dark room, 14-day raised bed), not a fermentation intervention - classic washed process with aromatic-protective drying environment. Variety + process signal dominates over Picolot's usual BALANCED -> FULL roaster tag on clean washed lots; the Vuelta plot at 1950m+ also strengthens the high-elevation Panama Gesha pattern (variety-intrinsic light body confirmed across HLE El Velo, Dongze HLE Valle 3NC, and Lovely Vuelta).

## Coffees That Confirmed Suppression

These coffee types consistently required *holding extraction back* - temperature primacy as the resolving lever, with the underlying logic being "this coffee has more than is desirable to fully extract." Mechanically resemble Clarity-First but with the explicit intent of suppressing fermentation harshness rather than preserving delicate transparency.

- Colombian natural Gesha with anaerobic fermentation (e.g. Hydrangea Finca Inmaculada Gesha Natural, Valle del Cauca) - confirmed Suppression. EG-1 6.4, 93°C, Kalita Wave 155 + xBloom Premium Paper. Bitter finish is temperature-driven, not grind-driven - dropping temp from 95°C to 93°C resolved it. Coarsening grind was the wrong lever. Cup peaks cool; evaluate below 50°C. Reclassified from "Balanced Intensity" in v8.0 - the original entry had the right mechanics but the wrong named intent. The brew is not pushing extraction up from Clarity-First; it is holding extraction back from where Balanced would otherwise place it.

- Ethiopian landrace anaerobic natural (e.g. Hydrangea Basha Bekele Kokose, 74158, Sidama Bensa, 2,250 masl) - confirmed Suppression at light end. EG-1 6.5 / 92°C, Orea Glass + Sibarist Fast Flat S, 15g / 240g (1:16). Same temperature-primacy pattern as Finca Inmaculada - extends the rule across origins (Colombia → Ethiopia), confirming the pattern is process-driven rather than terroir-driven. At 93°C, bitter/drying tail disconnected attack from body; dropping to 92°C resolved it cleanly while preserving fruit. Grind ceiling at 92°C is 6.5; 6.4 over-extracted preferentially (roast character, oversteeped tea, loss of fruit clarity) without adding body. Body is variety-intrinsic tea-like; do not chase weight via grind. Evaluation window wider than Finca Inmaculada - integration present from serving temp, not just post-50°C. Reclassified from "Balanced Intensity at light end" in v8.0.

**Suppression default rule.** Anaerobic naturals where bitter/drying tail does not resolve at Clarity-First temperatures and resolves with a temperature drop - that is Suppression, not Balanced Intensity. Two data points across two origins. If a third anaerobic natural arrives that does not resolve at Suppression, the experimental fallback is **Balanced Intensity + Inverted Temperature Staging** (88°C → 94°C across two phases) - not Balanced at higher temp, which has historically over-extracted on this process.

## Coffees That Needed Balanced Intensity

These types consistently under-performed at Clarity-First and improved with moderate extraction increase:

- Honey-process lots (confirmed: Buncho Honey, Finca La Reserva Honey Anaerobic Gesha - Colibri) - benefit from bed exposure between pours and slightly finer grind (6.5-6.4). Sweetness reads thin at coarser settings. Anaerobic honey process amplifies florals without adding heavy fermentation weight; Gesha variety and honey process together signal Balanced Intensity, not Full Expression. **Grind hard floor confirmed at 6.4** - across two brew sessions and two brewers (April Glass and SWORKS), 6.5 produced sour under-extracted acidity throughout the cup; 6.4 integrated cleanly. Low tolerance for coarser grinding; do not test 6.5 on future lots of this type expecting equivalent results. Temperature sensitivity is high within a 1°C range - 91°C vs 90°C produced measurable citric sharpness difference in the dialing session; 93°C with natural off-base taper (SWORKS session) produced softer, more integrated cup, suggesting a gentle temperature decline is preferable to a fixed high temperature on this coffee. SWORKS Restricted->Half-Open valve transition achieves at 1:16 what earlier sessions required tail-cutting and 1:14 ratio to accomplish - valve-controlled contact time is the structurally cleaner tool for this process/variety at the office. Two data points.

- Natural Pacamara (Rio Cristal) - larger bean needs slightly more extraction energy. 6.4 and continuous gentle spiral.

- Mokkita Natural (Garrido) - wine fruit character needs extraction support. 6.6 was appropriate but body stayed medium. Could push to 6.4 to test.

- Colombian washed Pink Bourbon (e.g. Tolima Anaerobic Washed) - NOTE: this lot preferred moderate extraction, NOT high. 6.3 pushed into phenolic sharpness. Pink Bourbon is transparency-driven, not weight-driven. Balanced is the ceiling, not the floor.

- Yeast-inoculated anaerobic natural (e.g. Moonwake Project One Light Peach Oolong, Catimor, Yunnan) - confirmed Balanced Intensity. Counter-example to the Full Expression default for experimental fermentation. The yeast engineering carries the expressive weight; extraction strategy here is about not getting in the way. EG-1 6.3, 96°C, Kalita Wave 155 + xBloom Premium Paper (office). Cup resolves best cold - do not evaluate before 45°C.

- Yeast-inoculated thermal shock washed lots from Finca El Paraíso (Diego Bermúdez, Cauca, Colombia) - confirmed Balanced Intensity across three lots. (1) Hydrangea Letty Bermúdez Gesha, 1930 masl: EG-1 6.3 / 95°C, UFO Ceramic + Sibarist UFO Fast Cone. (2) Hydrangea El Paraíso 'Lychee' Castillo, 1960 masl: EG-1 6.4 / 94°C - confirmed first pass. (3) Hydrangea Luna Bermúdez Gesha, 1930 masl: EG-1 6.3 / 94°C, UFO Ceramic + Sibarist UFO Fast Cone - sits between Letty and Lychee on the recipe spectrum. The three lots now form a clear gradient: rose-forward Geshas (Letty) live at 6.3/95°C; aromatic-floral lots without rose (Luna's egg waffle/blueberry/oolong) sit at 6.3/94°C; lighter floral lots (Lychee Castillo) sit at 6.4/94°C. Recipe position tracks flavor register, not just variety. Bitter tea tail at 6.3/95°C on Luna resolved cleanly with 1°C temperature pullback - confirms the Inmaculada pattern (temperature, not grind, is the surgical lever for bitter tail on Colombian anaerobic Geshas). Cooling behavior is flavor-target-driven, not lot-driven: rose-forward lots (Letty) require near-40°C evaluation; aromatic-floral lots without rose (Luna, Lychee) peak ~45-50°C. Start at 6.4 / 94°C and push to 6.3 (hold temp at 94°C) only if thin.

Yeast-inoculated white honey Gesha from Colombia (Sebastian Ramirez El Placer, Quindío, 1800m) - confirmed Balanced Intensity. Third confirmed subtype for yeast-inoculated Balanced Intensity, alongside anaerobic natural (Peach Oolong) and thermal shock washed (El Paraíso). Key finding: the Gesha variety and white honey process individually signal Clarity-First, but yeast inoculation adds enough complexity to require Balanced Intensity extraction support. Temperature is the primary lever - moving from 93°C to 95°C unlocked fruit where there had been none; grind (6.4→6.3) was secondary. SWORKS Bottomless Dripper (Restricted valve through Pours 1–2) solved the fast-drain problem the Kalita Wave 155 could not at the office. Natural kettle-off-base taper delivers ~2°C drop across the brew (95°C bloom → ~93°C by final pour) - effective at softening bitter tail without compromising mid-brew extraction. Cup peaks cool (~45–50°C); what reads as bitter finish when hot is the cardamom/spice note resolving. Do not iterate on the finish above 50°C. Yeast-inoculated natural with washed finish (Hydrangea Gesha Horizon Don Eduardo, Boquete, Panama, 1800 masl) - confirmed Balanced Intensity. Fourth confirmed subtype. Key finding: the washed finish moderates fermentation density compared to a straight inoculated natural - grind support at the finer end of Balanced Intensity range (6.4, not 6.5) is required to express fruit fully. At 6.5, attack ended abruptly and fruit was thin and disconnected; 6.4 resolved both. The washed finish also produces a structurally clean, non-lingering finish - do not attempt to extend aftertaste by pushing extraction further; it is a process characteristic. Temperature: 94°C kettle-on-base throughout was correct; no taper needed. Cooling behavior: significant improvement below ~50°C (passion fruit / white plum integrates), but not extreme - 45–50°C is the accurate evaluation window, not near room temperature. Passion fruit and white plum are more accurate descriptors than strawberry/plum for this lot in this recipe; the washed finish shifts red fruit toward brighter tropical character.

- Ethiopian standard natural (non-anaerobic) with brightness-forward flavor targets - confirmed Balanced Intensity lower edge. Moonwake Alo Gemechu Station (Landrace, Tamiru Tadesse, Sidama, Ethiopia): EG-1 6.4 / 94°C kettle-off-base / SWORKS Dial 5 through main pours, crack to Dial 6 late in final pour / 15g / 240g (1:16). Berry attack present at first pour; integrates into lighter tea body; sweet fruit-berry finish emerges below 50°C. First-pass result - no grind adjustment needed. The brightness targets (tangerine, white tea) confirm we did not need Full Expression and should not have pushed there. Frozen at peak rest; treated as fresh with no signs of age-related flatness. One data point - treat as reference for future Ethiopian standard natural landrace lots with brightness-forward expression intent.

CGLE Las Margaritas Sudan Rume Natural (Special Guests, Edition 0326-42 - Valle del Cauca, Colombia, Café Granja La Esperanza, 1570-1760m, 48hr silo ferment + 28-day solar dry + 3-month rest) - confirmed Balanced Intensity (light end). EG-1 6.5 / 91°C / April Brewer Glass + April Paper / 15g / 240g (1:16) / three-pour structure (115g at 0:45, 180g at 1:15, 240g at 1:50). Total 3:00-3:15. First confirmed traditional natural (non-anaerobic, non-experimental) in the Balanced Intensity archive - broadens the pattern beyond anaerobic-natural Hydrangea entries. Key finding: vehicle determined integration, not extraction depth. Initial Orea Glass + Sibarist B3 Cone at 92°C produced phase-separated cup - pungent lemongrass taking over late attack, dominant ginger finish, sweetness sitting adjacent rather than woven through. Switching to April Brewer Glass + April Paper at 91°C with three-pour structure resolved it: aromatics integrated through body, blueberry-round sweetness present, ginger reduced to spice accent rather than dominant statement. Grind held at 6.5 across both iterations - coarsening would have worsened separation, finer would have over-extracted the spicy/herbal fraction. Temperature 91°C is the ceiling - lemongrass sharpening on cooling at 92°C was a mild over-extraction signal on the aromatic fraction. Body is variety-intrinsic light brown-tea structure (Sudan Rume is transparency-driven, parent of SL-28); full aromatic expression and cooling integration confirm full extraction. Variety + non-experimental natural process pair to Balanced Intensity at the light end.

## Coffees That Needed Full Expression

These coffees under-extracted or tasted one-dimensional until pushed significantly beyond the default:

- Moonwake Jeferson Motta (Anaerobic Washed Gesha, Huila, Colombia) - confirmed Full Expression. Clarity-First produced sour, flat cup. Kalita Wave 155 + xBloom Premium Paper (office) resolved structural flatness that April Brewer could not. EG-1 6.0, 98°C, 1:15. Cup must be evaluated below 50°C - roast note at high temp fully resolves cool. Candied strawberry, orange, hibiscus at peak. Pattern confirmed: anaerobic washed Colombian Geshas from Huila/Cauca are a reliable Full Expression signal regardless of cultivar.

- Scenery Pikudo's Rosado (Anoxic Natural, Rosado variety, Palestina, Huila, Colombia) - confirmed Full Expression. Balanced Intensity at EG-1 6.4 / 92°C produced underdeveloped cup. Pivoting to EG-1 6.0 / 95°C unlocked candied strawberry, Earl Grey body. Notable: Rosado (Pink Bourbon family) is transparency-driven - Balanced would normally be the ceiling - but the anoxic fermentation process overrode the variety signal entirely. Do not apply Pink Bourbon/Rosado variety logic to anoxic natural lots. Temperature taper (95°C → natural ~94°C on final pour) resolved bitter tail.

- Moonwake Blooms Coffee (Washed Catuai, Abel Dominguez, Honduras) - confirmed Full Expression despite clean washed process. Dense variety with fruit-forward roaster intent (pomelo, apricot, pear) required EG-1 6.0 / 95°C / 1:15. Kettle-on-base temperature management is a hard requirement. One data point - flag for confirmation on next dense washed variety with fruit-forward expression intent.

- Moonwake El Eden Tamarind Washed (Tamarind + Red Fruit Co-Ferment Washed, Purple Caturra + Bourbon, Finca El Edén, Huila Colombia, 1500m) - confirmed Full Expression. Heavy co-ferment washed (150-hour sealed fermentation, lactobacillus + saccharomyces cerevisiae + tamarind/red fruit culture) reliably follows same pattern as Jeferson Motta anaerobic washed. EG-1 6.0, 96°C kettle-on-base, SWORKS Bottomless Dripper Dial 5 (Restricted) through all main pours, crack to Dial 6 (Half-Open) midway through final pour. 18g / 288g (1:16). Contact time is the primary finishing lever - valve transition timing, not grind or temperature, was the only dial across three brews. Brew 1 (too fast): thin body, perfumy unresolved note. Brew 2 (Dial 5 through full Pour 3): body filled, rose dominant, lychee receded. Brew 3 (crack to Dial 6 midway Pour 3): all three targets balanced - lychee, baklava, rose. Ginger-spice finish is a tamarind process characteristic, not an extraction artifact - do not attempt to dial out. Evaluate below 50°C; lychee and baklava integration both happen late. This coffee is the reference recipe for heavy co-ferment washed lots on the SWORKS at the office. Extraction Strategy Confirmed: Full Expression.

- Picolot Emerald PL#015 (Garrido Panama Mokka Natural, Boquete, Gissell & Lily Garrido) - confirmed Full Expression on Picolot roast. Balanced Intensity at EG-1 6.2 with Dial 5 through Pours 1–2 produced tea-like cup with no fruit development. Shifting to EG-1 6.0 / 95°C kettle-off with Picolot fast/fast/slow valve structure (Dial 7 Open → Dial 7 Open → Dial 5 Restricted on final pour) unlocked green grape attack, candied honeydew sweetness, and rosemary on cooling. 15g / 250g (1:16.7 - Picolot ratio). Two key findings: (1) Grind was the correct lever for fruit development, NOT longer mid-pour contact time. Restricting valve during Pours 1–2 starved the bed of fresh water and reduced extraction. Only restrict on the final integration pour. (2) Mokka expresses distinctly from Mokkita (same Garrido producer, related variety name): cleaner, transparency-driven, structured acidity with herbal lift; wine character absent. “Crisp body” on the Picolot label is a real descriptor - tea-like body is intentional to the variety, not a recipe deficiency. Cup peaks warm to cool (~55°C and below); rosemary and candied sweetness integrate on cooling. Reference recipe for Picolot Mokka Natural lots on the SWORKS at the office. Extraction Strategy Confirmed: Full Expression.

## Coffees That Confirmed Extraction Push

*Empty section - Extraction Push was promoted from "sub-pattern within Full Expression" to a fifth first-class strategy in v8.2 and currently has zero confirmed brews in this archive. Empty-slot status is acceptable; Suppression was also empty when promoted. The slot incentivizes the experiment and makes the strategy legible at brief time rather than retroactively.*

Candidate coffees (highest leverage, untested):

- Clean washed Geshas at high elevation (Panama, high-elevation Colombia washed) where Clarity-First peaks at ~21% EY and the coffee can plausibly support more without losing transparency. Wölfl 2024 reference: Don Benji Gesha natural anaerobic, OREA V4 + Sibarist FAST + 490 µm + Melodrip + 93°C.

- Hacienda La Esmeralda climate-controlled ("NC") naturals - clean enough that the Clarity-First strategy reliably works, but the aromatic ceiling may go higher with Extraction Push mechanics. Pair with the Aroma Capture modifier (Paragon chilling ball on bloom + Pour 1) for full Wölfl/Vannelli-style approach.

- Finca Sophia Heritage Collection or equivalent high-elevation Panama washed lots that polished as Clarity-First but where the aromatic profile suggests there's more to extract.

First confirmed brew will become the reference recipe for the strategy. See Open Questions for the formal sprint specification.

**Coffees Where Strategy Was Unclear (needs more data)**

- Dark Room Dry Natural Gesha (Panama Elida, Garrido Mokkita) - natural with controlled drying. Responded to Balanced Intensity but may want more. Flag for re-evaluation.

- Brazil washed Geisha (Daterra Borem) - April Glass + xBloom Premium Paper was the right setup but Brazil terroir is unusual for the rotation. More data needed.

## By Modifier (Axis 2)

This section tracks modifier-specific learnings. *Rule: same as strategy patterns - don't promote a modifier-coffee combination from "experimental" to "confirmed pattern" until two data points exist.* Modifiers are new to the framework as of v8.0; most entries here will start as single data points or open questions until confirmation accrues.

**Output Selection - confirmed and candidate patterns**

- Heavy co-ferment washed lots (Moonwake El Eden Tamarind Washed) - **late cut** tested informally pre-framework with positive results: stopping the brew before reaching full target weight produced a cleaner finish without compromising body. One informal data point. Next brew of any heavy co-ferment washed lot should formalize this - specify the cut point in the recipe (e.g. "stop at 245g of 288g") and document whether the kept fraction matches or exceeds the full-yield reference brew.

- Candidate (untested): heavy anaerobic washed Colombian Geshas from Huila/Cauca (Jeferson Motta family) - same heavy-tail mechanics as co-ferment; late cut is a plausible refinement to the existing Full Expression reference.

- Candidate (untested): processed lots with sharp/saline early fraction - early cut is a candidate for any future coffee where the front of the cup reads off rather than expressive.

**Inverted Temperature Staging - experimental**

- No confirmed data points yet. Designated experimental fallback for anaerobic naturals that do not resolve at Suppression - if a future brew needs the cup that Suppression cannot deliver, test 88°C → 94°C across two phases before exploring grind or other levers.

**Aroma Capture - experimental**

- No confirmed data points yet. Highest-leverage candidates for first test: highly aromatic coffees where florals are central to the cup - Esmeralda climate-controlled naturals, washed Geshas from high-elevation Panama, anaerobic naturals where the aromatic signature is the target. Hardware (Paragon chilling ball + carafe) is home only - modifier not available at office. First test should be a side-by-side: same coffee, same recipe, with vs without mid-brew chilling ball application on bloom + Pour 1.

**Immersion - experimental**

- No confirmed data points yet. Hardware fully available at home (Hario Switch) and office (SWORKS Bottomless Dripper, used as immersion-to-percolation continuum). Highest-leverage candidates for first test: (1) coffees that have stalled at Balanced Intensity where contact time is the suspected unresolved lever - extended immersion phase before percolation finish should equalize extraction across the bed in a way that pour structure cannot. (2) Heavy co-ferment washed lots already brewed on the SWORKS where extended Dial 5 phases functionally approximate immersion - formalize the framing and document phase boundaries as immersion-modifier-active. (3) Yeast-inoculated lots where current Balanced Intensity pour structure leaves attack-to-mid-palate disconnect: Switch immersion phase 0:00-1:30 to equalize, percolation finish 1:30-3:00 for clarity. First clean test should be a Switch brew on a Balanced Intensity lot with documented before/after on contact-time-related sensory issues. Second confirmation arm should validate the SWORKS-as-immersion-brewer framing - same coffee, same Dial sequence, but explicitly framed and documented as immersion modifier active rather than implicit contact-time control.

**Modifier compatibility matrix**

| Strategy            | Output Selection            | Inverted Temp Staging                                              | Aroma Capture                            | Immersion                                                                                       |
|---------------------|-----------------------------|--------------------------------------------------------------------|------------------------------------------|-------------------------------------------------------------------------------------------------|
| Suppression         | Possible (rare)             | **Counterproductive** - high-temp finish defeats the suppression intent | Possible                                 | Possible - extended low-flow contact phase aligns with the suppression intent (hold extraction back) |
| Clarity-First       | Possible (rare)             | **Counterproductive** - already-light coffees do not benefit       | Likely useful for highly aromatic coffees | Possible (rare) - generally counter to "extract gently and let it speak"; long contact time risks tannin on intrinsically light bodies |
| Balanced Intensity  | Possible                    | **Compatible** - primary pairing for the modifier                  | Possible                                 | **Compatible** - strong candidate pairing; immersion contact-time control is a natural Balanced lever |
| Full Expression     | **Compatible** - primary pairing for late cut on heavy ferments | Compatible                                                         | Possible (but high temp partially defeats it) | **Compatible** - staged immersion can deepen extraction on heavy ferments; SWORKS extended Dial 5 already approximates this on Tamarind Washed |
| Extraction Push     | Possible (untested)         | Compatible (untested) - could pair with Wölfl-style staging        | **Likely useful** - clean aromatic coffees are the prime aroma-capture candidate, and Melodrip-controlled turbulence preserves volatiles the chilling ball is meant to lock in | Possible (untested) - Switch-style immersion + Melodrip percolation finish is theoretically compatible but unexplored |

## By Process

| **Process**                                        | **Default Strategy**     | **Observed Exceptions**                                                                                                                                                                 | **Key Risk**                                                                                       |
|----------------------------------------------------|--------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| Washed                                             | Clarity-First            | Dense varieties with fruit-forward expression intent (Catuai, Honduras) may need Full Expression. One data point.                                                                       | Turbulence flattens acidity; don't over-agitate                                                    |
| White / Light Honey                                | Clarity-First → Balanced | Some need 6.5 not 6.7                                                                                                                                                                   | Thin sweetness at coarse end                                                                       |
| Honey (medium)                                     | Balanced Intensity       | Pink Bourbon prefers Balanced, not Full                                                                                                                                                 | Heavy honey can push toward sweetness overload                                                     |
| Standard Natural (non-anaerobic, raised bed / washed station) | Balanced Intensity | Ethiopian landraces with brightness-forward flavor targets (berry, citrus, white tea) confirmed Balanced Intensity lower edge (EG-1 6.4 / 94°C). One data point: Moonwake Alo Gemechu Station, Sidama, SWORKS Dial 5 / late Dial 6 crack. CGLE Sudan Rume Natural (28-day patio dry, aromatic landrace variety) confirmed Balanced Intensity at light end - variety transparency drives the position within Balanced. | Sharp finish above 50°C is heat masking, not extraction defect - do not coarsen or drop temp; evaluate below 50°C. For aromatic-landrace varieties (Sudan Rume, SL-lineage), watch for vehicle-driven phase separation rather than extraction depth - Orea Glass + fast cone produced pungent lemongrass / dominant ginger; April Glass + April Paper resolved it. |
| Controlled Natural (DRD, raised bed)               | Balanced Intensity       | Picolot Garrido naturals confirmed Full Expression on roaster house style - Mokka (PL#015) at EG-1 6.0 and Pacamara (PL#16) at EG-1 6.1, both fast/fast/slow Dial 7 -> 7 -> 5. Mokkita still under-tested. Straight natural alone does NOT invert SWORKS valve structure - slow/slow/open inversion is reserved for yeast-anaerobic and heavy co-ferment lots. Hacienda La Esmeralda "NC" climate-controlled naturals stay Clarity-First - confirmed across two data points (Hydrangea El Velo Natural, Coffee with Dongze HLE Valle 3NC). | Wine character needs support, not suppression. Do not invert house valve structure for clean naturals. Climate-controlled drying preserves variety transparency - do not apply Balanced default to Esmeralda NC lots. |
| Anaerobic Natural                                  | Suppression              | Confirmed Hydrangea Finca Inmaculada (Valle del Cauca, Colombia) and Hydrangea Basha Bekele Kokose (Sidama Bensa, Ethiopia). Two data points across two origins. Both reclassified from Balanced Intensity to Suppression in v8.0.                      | Bitter finish is temperature-driven, not grind-driven. Coarsening strips fruit; drop temp instead. If Suppression does not resolve, fallback is Balanced + Inverted Temperature Staging. |
| Anoxic Natural (sealed container)                  | Full Expression          | Confirmed Scenery Pikudo's Rosado. One data point.                                                                                                                                      | Process overrides variety signal. Temperature taper resolves bitter tail.                          |
| Anaerobic Washed (clean / lighter)                 | Balanced Intensity       | Heavy anaerobic / Colombian Huila/Cauca needs Full Expression                                                                                                                           | Phenolic sharpness if over-extracted; sour if too coarse                                           |
| Anaerobic Washed (heavy / Colombian Huila / Cauca) | Full Expression          | Confirmed - see Jeferson Motta entry                                                                                                                                                    | Sour if under; roast/bitter at high temp resolves cooling                                          |
| Heavy Anaerobic / Co-ferment                       | Full Expression          | None - confirm with roaster guide                                                                                                                                                       | Sour if under; boozy if over                                                                       |
| Experimental (thermal shock, yeast-inoculated)     | Balanced Intensity       | Confirmed Balanced Intensity across four subtypes: anaerobic natural, thermal shock washed, white honey, and yeast-inoculated natural with washed finish. Don’t assume Full Expression. | Let flavor intent and roaster guide drive strategy.                                                |

## By Variety

- Gesha (Panamanian) - reliable at Clarity-First for washed and clean natural lots. Loses florals with turbulence. Don’t over-extract. Climate-controlled naturals from Hacienda La Esmeralda (“NC” designation) stay Clarity-First - do not assume Balanced Intensity despite the natural process. Confirmed: Hydrangea El Velo Natural (15g / 6.7 / 91°C) and Dongze HLE Valle 3NC (12.5g / 6.5 / 93.5°C). Grind setting is dose-dependent, not variety-dependent: 6.7 works at 15g but produces hollow body at 12.5g. Exception: yeast-inoculated natural with washed finish (confirmed: Hydrangea Don Eduardo) requires Balanced Intensity at EG-1 6.4 - the inoculation overrides the Clarity-First default even for Panama Gesha. Start at the finer end of Balanced Intensity; the washed finish moderates fermentation density but does not eliminate the extraction need.

- Gesha (Colombian, washed) - slightly more body than Panama types. Still Clarity-First for clean washed lots.

- Gesha (Colombian, anaerobic honey) - confirmed Balanced Intensity. Finca La Reserva (Antioquia, Colibri): EG-1 6.4 / 93°C kettle off-base / SWORKS Bottomless Dripper Restricted (Dial 5) through Pour 1, crack to Half-Open (Dial 6) once bed drops in Pour 2. 18g / 288g (1:16). Anaerobic honey process amplifies florals (jasmine, lavender) without adding heavy fermentation weight - does not push toward Full Expression. Grind floor is 6.4 - confirmed hard across two sessions: 6.5 produced sour under-extracted acidity. Temperature sensitivity confirmed within 1°C; prefer natural off-base taper over fixed high temperature. Cup peaks cool at 45-50°C: green apple, fresh grape, honeyed white tea. Cooling window is specific - below 40°C slight sourness can return. Optimal drinking window is 40-50°C. Tart edge softens fully within this window; do not evaluate or iterate above 50°C. Treat EG-1 6.4 / 93°C off-base / SWORKS Restricted->Half-Open as the reference starting recipe for future anaerobic honey Geshas from Colombian highland terroir. One data point.

- Gesha (Colombian, anaerobic washed) - process overrides variety entirely. Full Expression confirmed for Huila/Cauca anaerobic washed lots. Note: Colombian anaerobic NATURAL Gesha (e.g. Hydrangea Finca Inmaculada, Valle del Cauca) is a different profile - Balanced Intensity, not Full Expression.

- Finca El Paraíso thermal shock lots (Colombian, yeast-inoculated) - Balanced Intensity confirmed across three lots (Letty Bermúdez Gesha, Luna Bermúdez Gesha, Lychee Castillo). Flavor targets are aromatic and transparency-driven. Do not apply the Huila/Cauca Full Expression pattern to these lots. Recipe position within the Balanced Intensity range tracks flavor register, not variety: rose-forward lots -> 6.3 / 95°C (Letty); aromatic-floral lots without rose -> 6.3 / 94°C (Luna); lighter floral lots -> 6.4 / 94°C (Lychee). Start 6.4 / 94°C; if thin, push grind to 6.3 first (hold temp at 94°C). Push temperature to 95°C only for rose-forward targets - overshooting temperature on non-rose lots produces over-steeped tea phenolics.

- Ethiopian Landraces (74110/74112/74158) - Clarity-First works but cups consistently improve cooling. Don't evaluate before 45–50°C.

- Pink Bourbon - transparency-driven, not weight-driven. Balanced is the ceiling. Does not benefit from Full Expression.

- Rosado (Pink Bourbon family, Colombia) - transparency-driven like Pink Bourbon. Balanced normally the ceiling. However, anoxic natural processing overrides the variety signal entirely - do not apply Rosado/Pink Bourbon ceiling logic to anoxic natural lots.

- Pacamara - slightly larger extraction energy needed due to bean density. Balanced Intensity default. Exception confirmed: Picolot Garrido Pacamara Natural (Loud Giants PL#16) - Full Expression at EG-1 6.1 / 95°C kettle-off / SWORKS fast/fast/slow (Dial 7 -> 7 -> 5). Variety-density adjustment is one click coarser than Mokka Natural on the same producer/roaster (Mokka 6.0 -> Pacamara 6.1). Variety-intrinsic darker brown-tea body - heavier weight is the cultivar, not the recipe. Pair with roaster Full Expression guidance rather than variety ceiling logic when the lot is on a Full Expression roaster house style.

- Mokka (Bourbon Family, classic Bourbon lineage) - ancient Yemen-origin dwarf Bourbon-type. Small beans, low yield, high aromatic intensity. Genetically distinct from Mokkita despite name similarity - do NOT classify as the same variety. One data point confirmed: Picolot Garrido Panama Mokka Natural (Emerald PL#015) - Full Expression at EG-1 6.0 / 95°C kettle-off / SWORKS fast/fast/slow (Dial 7 → 7 → 5). Transparency-driven cup structure with “crisp body” intentional to the variety; tea-like body is not a recipe deficiency. Pair with roaster Full Expression guidance rather than variety ceiling logic. Distinct from Mokkita: cleaner, more structured acidity with herbal lift; wine character absent.

- Mokkita (Modern Hybrids, multi-parent hybrid lineage) - modern selection/hybrid line, often tied to specific farms (e.g. Garrido). Pedigree not fully disclosed; classify conservatively. Broader brew tolerance than Gesha. Can handle Balanced and may benefit from it. Distinct from Mokka: wine-structured naturals with dark plum fruit and structural weight; responds to extraction support but less extraction-forward than Mokka on the same roaster house style (based on Mokkita DRD archive). Do NOT treat Mokka and Mokkita as interchangeable.

- Sudan Rume (ancient Ethiopian landrace, Boma Plateau origin; parent of SL-28) - transparency-driven aromatic landrace. Body is variety-intrinsic light brown-tea structure; do not chase weight via grind when aromatic integration and cooling behavior confirm full expression (same principle as >=1,900 masl Panama Gesha). Flavor register is herbal-spicy with delicate fruit (lemongrass, ginger, cardamom, blueberry) - these aromatics extract readily and turn pungent if pushed. Confirmed: CGLE Las Margaritas Sudan Rume Natural (Special Guests, Edition 0326-42) at EG-1 6.5 / 91°C / April Brewer Glass + April Paper / 15g / 240g (1:16) / three-pour structure. Vehicle determines integration: Orea Glass + fast cone papers (B3 Cone, UFO Fast) produce phase separation - pungent lemongrass taking over late attack with sweetness sitting adjacent rather than woven through. April Brewer Glass + April Paper (flat bed, medium-slow drain) is the corrective vehicle. Temperature ceiling 91°C - at 92°C, lemongrass sharpens on cooling. One data point.

- Typica Mejorado / Sydra - moderate extraction, long bloom, uninterrupted pour. Savory if bloom is too long or agitation too high. Variety signal overrides experimental process flag when flavor targets are bright and citric.

- Catuai (washed, Honduras) - dense variety that exceeded Clarity-First's extraction ceiling despite clean washed process. One data point; flag variety density and expression intent on future washed Catuai lots.

**Cooling Behavior Observations**

Several cultivars and processes show dramatically different cup quality at different temperatures. Track this - it affects how you evaluate brews.

- Ethiopian washed landraces - consistently peak at warm-to-cool (45-50°C). Don't judge until cooled.

- Ethiopian standard natural landraces - same cooling pattern as washed: sharp or sequential flavors when hot integrate into a sweet, unified fruit-tea expression below 50°C. Sharp finish above 50°C is heat masking, not an extraction defect - do not iterate on the finish before the cup cools. Confirmed: Moonwake Alo Gemechu Station (Landrace, Sidama). One data point.

- Honey lots - frequently improve cooling. Sweetness integration increases below 50°C. Confirmed: Finca La Reserva Gesha Anaerobic Honey (Colibri, Antioquia) - tart edge reads brighter hot; cup integrates as green apple / fresh grape / honeyed white tea at 45-50°C. Optimal drinking window is **40-50°C** - below 40°C slight sourness returns, narrowing the window from both ends. Do not evaluate above 50°C; do not wait below 40°C. Evaluate below 50°C on all honey-process lots as a general default.

- Washed Gesha - peaks hot-to-warm. Expression fades gracefully; doesn't dramatically improve cool.

- Sydra / cold fermented washed (Finca Soledad) - improves progressively cooling. White grape and pear clarity increase below ~55°C.

- Anaerobic Washed Gesha (Jeferson Motta, Moonwake) - do not evaluate before 50°C. Roast note and muted attack present at high temp are heat masking, not extraction defects. Cup transforms dramatically below 50°C.

- Colombian natural Gesha with anaerobic fermentation (Hydrangea Finca Inmaculada) - peaks cool. Fruit integrates significantly below 50°C.

- Anoxic natural (Scenery Pikudo's Rosado, Palestina, Huila) - peaks below 50°C. Mild bitter tail present at serving temperature resolves cleanly as cup cools.

- Finca El Paraíso thermal shock lots (Hydrangea, Cauca) - extreme cooling behavior. Letty Bermúdez (Gesha): rose character absent above 50°C, only emerges near 40°C. Lychee Castillo: peaks below 50°C. Evaluate well below 50°C - possibly closer to 40°C for rose/floral targets.

- Yeast-inoculated anaerobic natural (Moonwake Peach Oolong) - resolves best cold. Do not evaluate before 45°C.

Yeast-inoculated white honey Gesha (Moonwake Sebastian Ramirez El Placer, Quindío) - peaks cool (~45–50°C). What reads as bitter finish when hot is the cardamom/spice note resolving. Cup integrates and sweetness increases significantly below 50°C. Do not evaluate or iterate on the finish above 50°C. Yeast-inoculated natural with washed finish (Hydrangea Don Eduardo Gesha, Panama) - improves meaningfully below ~50°C as fruit integrates and spikiness resolves. Not extreme cooling behavior - 45–50°C is the accurate evaluation window. Does not require near-room-temperature evaluation. Heavy co-ferment washed (Moonwake El Eden Tamarind Washed, Purple Caturra + Bourbon, Huila Colombia) - follows same cooling pattern as Jeferson Motta anaerobic washed. All three flavor targets (lychee, baklava, rose water) read muted or unresolved above 50°C. Lychee integration in particular happens late. Do not evaluate before 50°C. Ginger-spice finish present across all brews is a tamarind process characteristic - it softens and integrates at cool but does not disappear entirely; treat as intended complexity, not an extraction defect.

**Body intuition is not always a grind signal.** Light, tea-like body on high-elevation Panama Gesha (≥1,900 masl) is variety-intrinsic, not an extraction deficit. Confirmed across Hydrangea El Velo Natural and Dongze HLE Valle 3NC: cups showing full aromatic expression (florals, citrus, stone fruit), integrated tart-sweet structure, and cool-peak behavior are fully extracted even when body reads silky/light. Before adjusting grind on the basis of body alone, check: (1) aromatic integration - are the roaster’s target notes present and layered? (2) cooling behavior - does the cup peak cool rather than collapse? (3) finish - is there drying tannin, or a clean close? If all three pass, the body is the variety, not the recipe. Pushing finer will compress florals before it adds weight.

## Cooling Behavior Observations

Per-cup cooling-arc patterns surfaced from the brew archive. Use as diagnostic signals when evaluating finish below 50°C, not as recipe levers.

- Standard raised-bed Panama Gesha Natural (Finca Sophia Grand Reserve, Coffee with Dongze) - peaks 45-50°C. Rose volatile sits on the cooling arc, not on the attack - emerges around 50°C and deepens below. Hot signature is honey/bergamot/light tea forward; cool signature is honeyed-tea-with-rose. Distinct from Esmeralda El Velo NC drying (similar peak window, but rose more present from serving temp on the NC profile). Diagnostic: if rose is absent at 45°C on a properly extracted Panama Gesha Natural, the brew likely under-extracted; if it dominates the attack, over-extracted.

- NC climate-controlled Panama Gesha Natural (Hacienda La Esmeralda Valle 3NC, Coffee with Dongze) - peaks 45-50°C. Rose and bergamot present from serving temperature, integrated into the attack rather than emerging on cooling. Hot and cool signatures both expressive: stone fruit + honeyed fruit + bergamot + rose, layered without separation across the cooling arc. Body reads silky/light-medium, tea-like throughout - variety-intrinsic at this elevation, not extraction-driven. Distinct from standard raised-bed natural (Finca Sophia Grand Reserve) where rose emerges only on cooling. Diagnostic: on NC drying, rose presence at attack is normal; absence at attack would be the under-extraction signal.

**'Prefers hot over cool' as a diagnostic signal.** When a Colombian anaerobic Gesha cup reverses the standard cool-window peak - i.e., reads better hot than cool - that is a reliable signal of extraction overshoot, NOT a coffee-level cooling preference. Confirmed on Luna Bermúdez Brew 2 (6.3 / 95°C) where the bitter tea tail was masked at higher temperature and emerged more clearly as the cup cooled, with the user explicitly noting preference for the hot cup. Diagnostic application: if a brew on this archive reverses cool-peak behavior, drop temperature 1°C while holding grind before considering any other adjustment. The reversed cooling pattern is the signal that the recipe is past its tea-phenolic ceiling, not under it. Distinct from coffees that genuinely peak hot-warm (e.g., Panama Magma washed Gesha) - the diagnostic applies specifically when a coffee with established cool-peak archive precedent reverses the pattern within a brewing iteration.

- Picolot roast signature: comp-edition lots brewed to date show meaningful complexity increase on cooling, independent of variety and process. Confirmed across Garrido Panama Mokka Natural (Full Expression, EG-1 6.0) and Lovely Vuelta Panama Gesha washed DRD (Clarity-First, EG-1 6.6) - both peak in the 55°C -> 45°C window with significant flavor integration as cup cools. This is a roaster characteristic (Stronghold S7X competition-style roasting), not a per-coffee cooling pattern. Evaluate Picolot lots through the 55°C -> 45°C window before locking a verdict; an apparently subdued or under-developed Picolot cup at serving temperature may resolve fully as it cools.

- Picolot Garrido naturals - peak cool (<45°C). Confirmed across two data points: Mokka Natural (Emerald PL#015) and Pacamara Natural (Loud Giants PL#16). Warm window is muted - aroma reads restrained despite the 'Loud Giants' lot framing, full label profile (cherry, blackberry, sour candy on PL#16; green grape, candied honeydew, rosemary on PL#015) only emerges below 50°C. Bitter drying tail at warm-window temps is acceptable on this template if it resolves cleanly by mid-cool - kettle-off natural decline manages it without intervention. Do not evaluate Garrido naturals on Picolot before mid-cool window.

## Office Brewing Notes (Palo Alto)

- Kalita Wave 155 + xBloom Premium Paper drains consistently at 3:00–3:30 at the office. Pour structure and rest timing between pours are the primary extraction levers, not grind size. NOTE: on some coffees (confirmed: Sebastian Ramirez White Honey Gesha) the Kalita still drains too fast for Balanced Intensity - switch to SWORKS Bottomless Dripper with Restricted valve when contact time is critical.

- xBloom Premium Paper runs faster than its paper weight suggests even at home - do not assume slower drawdown based on filter spec alone.

- SWORKS Bottomless Dripper valve calibration confirmed (xBloom Premium Paper + EG-1 6.0, real coffee bed): Dial 0–1 = Fully Closed (no flow). Dial 1–4 = dead zones (near-zero flow with real coffee bed - do not use for extraction). Dial 5 = Restricted (~60 sec/100g). Dial 6 = Half-Open (~45 sec/100g). Dial 7 = Open (~30 sec/100g). Full turn past 7 back to 0 = maximum flow (~20 sec/100g). Calibration may shift slightly at coarser grind settings - recheck if using above EG-1 6.5.

- SWORKS valve restriction timing principle (confirmed: Picolot Emerald Garrido Mokka Natural). Restricting the valve to Dial 5 during mid-extraction pours (Pours 1–2) can REDUCE fruit and sugar development by starving the bed of fresh water. Extraction depends on the concentration gradient of fresh water meeting saturated grounds, not just contact time - holding a restricted valve through the extraction-critical window slows flow when you want water renewal. Reserve Dial 5 restriction for the final integration pour (the slow phase). For fast/fast/slow roaster structures (e.g. Picolot): Dial 7 Open → Dial 7 Open → Dial 5 Restricted, not Dial 5 throughout. Exception: heavy co-ferment washed lots (e.g. Moonwake El Eden Tamarind) need Dial 5 through all main pours because the extraction ceiling is much higher - valve timing for those is about WHEN to crack open, not WHEN to restrict. Diagnostic: tea-like body with subtle attack + no sweetness = under-extraction from over-restriction of mid-pours. Fix by opening Pours 1–2 and going finer on grind, not by restricting more.

- Tap water only at the office (Downtown Palo Alto municipal supply). Recipe parameters may differ slightly from home results on the same coffee.

- SWORKS valve restriction on small-dose Clarity-First office brews behaves opposite to the Mokka principle. Garrido Mokka (18g, Full Expression, Picolot fast/fast/slow structure) needed Dial 5 only on the final integration pour because Dial 5 through mid-pours starved the bed. Lovely Vuelta (15g, Clarity-First, Panama Gesha washed DRD) needed Dial 5 through both Pours 1 & 2 - shallower bed + lighter extraction-capable roast + tap water together require more contact time across the extraction window, not less. Rule: on 15g office Clarity-First brews with tap water, start Dial 5 through the extraction-critical pours and open to Dial 7 on the tail to cut tannins. The Mokka 'restrict only on the slow finish' principle applies to 18g Full Expression brews, not generalized SWORKS use. Final-pour tail management is a distinct lever from mid-pour contact time: closing further (Dial 6 -> Dial 5) at integration extends the drying tail rather than resolving it; opening to Dial 7 at completion of Pour 2 cuts tannic finish cleanly without compromising extraction.

## Open Questions

Things to test across future brews:

- Does finer grind (6.0 vs 6.1) consistently trade body clarity for attack intensity on anaerobic washed lots, or is this specific to Jeferson Motta?

- Mokkita Natural DRD: would pushing to 6.4 and higher agitation improve or muddle the wine character? Note: Garrido natural template now confirmed on Picolot across two cultivars - Mokka at EG-1 6.0 and Pacamara at EG-1 6.1 - establishing a bean-density-driven grind ladder for clean Garrido naturals. Mokkita is wine-structured rather than transparency-driven, so the natural template may not transfer. Test Mokkita DRD specifically - does it follow the bean-density ladder (suggesting 6.0 or coarser depending on bean size) or break from it (suggesting fermentation density overrides bean density)?

- Does the anoxic natural Full Expression signal hold regardless of variety, or was Pikudo's Rosado result driven by Huila terroir specifically? Test on a non-Huila anoxic natural.

- Is temperature the primary finishing lever for bitter tail on Colombian naturals generally? Partially confirmed across two lots. Test on a non-Colombian anaerobic natural.

- ~~Is the extreme (~40°C) evaluation threshold on El Paraíso thermal shock lots specific to rose/floral-target varieties (Gesha), or does it apply to all Diego Bermúdez lots?~~ **Resolved (Luna Bermúdez):** Flavor-target-driven, not variety- or lot-driven. Luna is the same variety (Gesha) and producer/farm as Letty but with an aromatic-floral flavor target without rose (egg waffle / blueberry / oolong) - peaks ~45-50°C, matching Lychee Castillo rather than Letty's near-40°C peak. The ~40°C evaluation threshold is specific to rose-forward El Paraíso lots; non-rose aromatic lots peak in the standard 45-50°C window.

- Does the April Brewer at home (remineralized water) drain significantly slower than at the office (tap water)?

- Has a Flower Child coffee been tried with T-92 filter + boiling water? Their guide specifies this - worth a direct test.

- Does the Dongze 12.5g small-pouch pattern (Hario V60 + CONE B3 + EG-1 6.5 + 93-94°C) hold as a reliable Clarity-First vehicle for non-Dongze 12.5g single-pouch coffees? **Strengthened (5 data points):** the vehicle is now confirmed across washed (93°C), NC climate-controlled natural (93.5°C), and standard raised-bed natural (94°C) processes - three distinct process classes on identical equipment with a coherent temp ladder. This is a strong generalization signal. Test next on a 12.5g pouch from another roaster (e.g. normlppl/minmax at 12.5g format) to confirm the pattern is dose-and-vehicle driven rather than roaster-specific.

- Does the +0.5°C step from NC climate-controlled drying (93.5°C) to standard raised-bed natural drying (94°C) at the Dongze 12.5g/200g vehicle hold across other origins, or is it specific to Hacienda La Esmeralda? One A/B data point so far: Valle 3NC (NC) at 93.5°C and Finca Sophia Grand Reserve (raised bed) at 94°C, both Panama Gesha at similar elevation, both confirmed Clarity-First. Test next on a non-Esmeralda NC-style climate-controlled natural (Lamastus, other Panama precision estates) to see if NC drying generally suppresses the +0.5°C extraction need or if it's a Peterson-house-style artifact.

- Filter drawdown calibration on EG-1 home setup - does the Sibarist B2 Cone fill the flow gap between B3 (medium-fast, ~3:00 drawdown observed at 12.5g/200g) and FAST (very fast, ~2:00 estimated at the same recipe)? Filter Drawdown Test Protocol drafted with controlled-variable methodology (V60 Glass, 15g/250g, EG-1 6.5, 93°C, single Melodrip pour, 3 replicates per filter, randomized order). Output: per-filter median drawdown + EG-1 grind-compensation ladder in half-notches. Pending execution. Adjacent question: do Hario V60 paper and Cafec Abaca+ actually sit between B3 and FAST as suspected, or do they fall outside this band? The protocol will resolve this. Source brew: e479e75b (Longboard Misty Mountain, Coffee with Dongze).

- Does the April Brewer Glass + April Paper integration-corrective pattern for aromatic-landrace varieties hold across other Ethiopian-landrace lineage varieties (74110/74112, SL-28, Wush Wush) when the same fast-cone vehicle separation appears? Confirmed once on Sudan Rume Natural (CGLE Las Margaritas, Special Guests) - Orea Glass + Sibarist B3 Cone at 92°C produced pungent lemongrass / dominant ginger phase separation; April Glass + April Paper at 91°C with three-pour structure resolved it. Test the same vehicle swap on the next aromatic-landrace lot showing similar separation symptoms before treating this as a generalizable pattern.

**Two-axis framework experiments (v8.0-v8.3):**

- **Output Selection (late cut) on heavy co-ferment washed.** Formalize the informal Tamarind result on the next heavy co-ferment washed lot. Specific test: brew the reference Full Expression recipe to full target weight, taste, then re-brew cutting at ~85% of target weight. Document whether kept fraction matches or exceeds full-yield brew. If it exceeds, late cut is promoted to a confirmed modifier on heavy co-ferment washed.

- **Extraction Push validation (5th strategy, promoted v8.2).** Strategy is currently empty in archive - first confirmed brew validates the slot and creates the reference recipe. Test the Wölfl/Tran approach on a clean coffee: fine grind (5.8-6.0) + fast filter (Sibarist FAST flat or cone) + Melodrip + 93-94°C + 1:16. Recommended candidates in priority order: (1) clean washed Gesha from Panama high elevation, (2) Hacienda La Esmeralda climate-controlled natural, (3) Finca Sophia Heritage Collection or similar high-elevation Panama washed. Hypothesis: pushes yield meaningfully above Clarity-First while preserving transparency that Full Expression's high agitation would compress. Sprint will be set up as a separate document with the full context for clean handoff to a new Claude session. Comparison frame: same coffee, side-by-side Clarity-First reference vs Extraction Push test arm. Document EY, sensory delta, and whether the cup actually reads as cleaner-than-Full-Expression rather than just "Full Expression on a clean coffee." If indistinguishable from Full Expression, the symmetry argument fails and the strategy collapses back to a sub-pattern.

- **Inverted Temperature Staging fallback test.** Reserved as the experimental move for any future anaerobic natural that does not resolve at Suppression. Specifics: 88°C → 94°C across two pours / phases. No suitable test coffee yet - flag when one arrives.

- **Aroma Capture first test.** Side-by-side same-coffee comparison on a highly aromatic Clarity-First lot (Esmeralda climate-controlled natural is highest-leverage candidate). Recipe identical except for Paragon chilling ball application on bloom + Pour 1 in the test arm. Evaluate aromatic clarity / persistence in cup at warm and cool serving temps.

- **Immersion first test (Hario Switch, home).** Promote the Switch from "extraction experiments brewer, mostly unused" to a deliberate Immersion-modifier vehicle. Test approach: Balanced Intensity lot (honey or anaerobic honey is a good candidate) brewed twice - first as the existing reference Balanced Intensity recipe on the standard percolation brewer, then re-brewed on the Switch with explicit phase staging (closed 0:00-1:30 immersion, opened 1:30-3:00 percolation finish, Wibawa-style). Hypothesis: contact-time equalization in the immersion phase resolves attack-to-mid-palate disconnect that pour structure on percolation brewers cannot fully address. Failure mode to document: if the Switch brew reads as muddy or flat compared to the percolation reference, immersion is not the right modifier for that strategy/coffee combination - or the phase boundaries are wrong.

- **Immersion second test - SWORKS reframing (office).** Take the existing Tamarind Washed reference recipe (Dial 5 through main pours) and re-document it explicitly as **Full Expression + Immersion** - phase boundaries, immersion contact-time intent, percolation finish framing. The recipe execution doesn't change; the framing does. Compare iteration efficiency on the next heavy co-ferment lot when the SWORKS is approached explicitly as an immersion modulator vs. when valve state is treated as a flow-control variable in isolation. Hypothesis: explicit immersion framing surfaces failure modes (over-extraction from too-long immersion, structural collapse from premature percolation transition) earlier than implicit contact-time framing did.

- **Suppression vs Balanced Intensity reclassification check.** Now that Inmaculada and Basha Bekele Kokose have moved to Suppression, watch on the next anaerobic natural brew: if the strategy is named correctly at Step 1d, does the iteration loop converge faster than it did historically (when these were misclassified as Balanced Intensity)? Pattern is hypothesized but not yet observed under the new framework.

## End-of-Coffee Workflow

After each coffee is finished, run through this checklist before starting the next:

- Review this document - did the extraction strategy behave as expected? Did anything new emerge? If a modifier was used, did it do what it was meant to? If a modifier was *not* used but the iteration loop suggested one might have helped, note this as a flag for next time.

- Update Archive Patterns if the coffee confirmed an existing pattern (add a data point) or revealed a new one. New strategy data points go to By Extraction Strategy. New modifier data points go to By Modifier (Axis 2).

- Update Roaster Reference (`docs/brewing/roasters.md`) if you learned something about this roaster's style that wasn't captured before. Use `propose_doc_changes` MCP Tool with a citation targeting the relevant `## {Roaster Name}` anchor.

- File the best brew in the app via the `push_brew` MCP Tool with a complete 'What I Learned' entry - specific, testable bullet points, plus a closing 'Modifiers Confirmed' line (state "None" explicitly if no modifiers were used; null modifier results are still signal). 'Extraction Confirmed' is for divergent strategies only - leave empty if planned matched tasted. Note: office coffees do not go through the home inventory or Agtron workflow. Two separate inventories are maintained - home (full tracking: Agtron color, spreadsheet entry, bean cellar doses) and office (no color reading, no spreadsheet tracking). Only home coffees require the Agtron step at dose-out.

- Note brewer rotation - were you relying on the same brewer repeatedly? If so, plan to rotate next coffee. The default-brewer trap and the default-strategy trap have the same shape.

# SECTION 4 - WBC REFERENCE

The WBC competition taxonomy reference (5 control axes + 8 strategy families + Latent mapping table + "consciously not pursuing" appendix) lives in [docs/brewing/wbc-reference.md](docs/brewing/wbc-reference.md). It's reference-only - used for "what was the WBC competitor doing" lookups, not consulted during a normal Coffee Brief. Pull it via `read_doc(docs/brewing/wbc-reference.md)` when you need the comparison. Split out of this master doc on 2026-05-03 (Sprint 2.7) so the Brewing reference stays lean.

