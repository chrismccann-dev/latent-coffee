# Brewing Assistant — operational guide

*Coffee Research · Latent · Brewing Assistant cluster*

The full BREW PROMPT operational content (Steps 1-4 + Recipe Output + Iteration Loop + Resolved Brew Output Format). Migrated from BREWING.md § Section 1 BREW PROMPT in Wave 4 PR 4b (2026-05-21).

Operational entry surface = [`docs/prompts/start-brew.md`](../../../prompts/start-brew.md) (Phase 1 — recipe construction) and [`docs/prompts/log-brew.md`](../../../prompts/log-brew.md) (Phase 2 — in-thread iteration). Both prompts are thin entry-surface invocations; this doc holds the substantive operational guidance the prompts compose over via `read_doc`. The Phase 1 / Phase 2 / Phase 3 framing in [SKILL.md](../SKILL.md) summarizes the role; this doc is the executable how-to.

## Step 1 — Coffee Brief (Claude runs this automatically)

Before selecting any equipment or parameters, Claude must complete a Coffee Brief by reasoning through the following in order:

**1a. Web search for roaster brew guide**

Search for a brew guide from this roaster for this coffee. If found, note the key parameters (ratio, grind direction, temperature, agitation level). Do not follow it blindly — use it as a signal about the roaster's extraction intent for this coffee. If not found, note that and proceed.

**1b. Process and variety risk flags**

Evaluate the coffee's process and variety against the **Process / Variety Signal Table** in [brewing-historian/cluster/patterns/cross-coffee-insights.md § Process / Variety Signal Table](../../brewing-historian/cluster/patterns/cross-coffee-insights.md). Explicitly state whether any flags apply. This determines whether the default Clarity-First strategy is appropriate or whether a different extraction strategy should be considered from the start.

**1c. Brief summary**

In 3-5 sentences: what is this coffee, what does the terroir and cultivar suggest about likely expression, what does the process tell you about extraction behavior, and what does the roaster's positioning (if known) suggest about intent?

**Archive lookup paths for 1c** (explicit, not author-discretion):

- **Per-cultivar prior brews** — `read_doc(uri="docs://skills/brewing-historian/cluster/patterns/by-cultivar/<cultivar-slug>.md")` if the cultivar has a cluster doc; otherwise check the By Variety section of `cross-coffee-insights.md`.
- **Per-coffee-family prior brews** — `read_doc(uri="docs://skills/brewing-historian/cluster/patterns/by-coffee-family/<family-slug>.md")` for anaerobic-natural / co-fermented / heavy-ferment / etc. families.
- **Per-strategy prior brews** — `read_doc(uri="docs://skills/brewing-historian/cluster/patterns/by-strategy/<strategy-slug>.md")` for "Coffees That Confirmed X" data points.
- **Prior brew conversations** — `conversation_search` for prior threads referencing this roaster + variety + process. Useful when no cluster pattern yet exists for the specific combination.
- **Roaster card** — `read_doc_section(uri="docs://brewing/roasters.md", anchor="<Canonical Roaster Name>")` if the roaster has a card. Net-new roasters have no card yet (flag for net-new framing per 1d below).

**Net-new variety / net-new roaster framing** (apply when 1c surfaces no archive data):

When the variety has no `by-cultivar/<cultivar>.md`, no by-coffee-family entry, and no prior brew conversation, the brief is in **wide-variance regime** by default — Brew 1 is exploratory, not narrowing. Explicitly state this in the brief: "First [variety] in archive — Brew 1 is wide-variance exploratory; if it's off, multi-variable jumps explicitly approved to map where the cup wants to live before isolating." Same framing applies for net-new roasters (no roaster card, no house-style data point). The single-variable-isolation discipline kicks in at Brew 2; Brew 1 is allowed to span more space.

**Roaster roast-level hook** (apply when known):

The brief framework defaults to ultra-light / light roasters (Sey / Substance / Moonwake / Picky Chemist / Big Sur archetypes). When the roaster roasts the coffee at **medium** or above (verify via roaster product page; some specialty naturals are roasted medium even by clarity-oriented roasters), flag the adjusted over-extraction risk profile in 1c: roast character is the over-extraction risk on a medium roast, not under-development. Pushing harder surfaces roast-derived chocolate/nut/bittering forward of the green's fruit signature; the lever is evaluate cooler + accept a chocolatier register, NOT temperature/agitation push. Pattern is currently observation-only (1 lot in archive when this hook lands); promote to a CCIL entry once 2-3 medium-roast specialty naturals confirm.

**1d. Proposed extraction strategy and modifiers**

Based on the above, propose one of the six extraction strategies below and explain why. Then, separately, assess whether any modifiers (Output Selection, Inverted Temperature Staging, Aroma Capture, Role-Based Pulse) are warranted for this specific coffee. Most coffees will not warrant any. If a modifier is proposed, justify it explicitly. Then pause and ask for confirmation before proceeding to the recipe.

### Axis 1 — Extraction Strategy (single canonical choice per brew)

| **Strategy**                | **Grind Range**    | **Temperature**         | **Typical Agitation**                                                | **Ratio Tendency** | **Best For**                                                                                                                                                                                                                                                                             |
|-----------------------------|--------------------|-------------------------|----------------------------------------------------------------------|--------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Suppression**             | 6.7-6.5            | 88-92°C (primary lever) | Low — pulse pours, no agitation                                      | 1:15-1:16          | Anaerobic naturals where temperature primacy resolves bitter tail; coffees where full extraction would surface fermentation harshness                                                                                                                                                    |
| **Clarity-First (default)** | 6.8-6.5            | 91-94°C                 | Low — Melodrip, gentle spiral                                        | 1:16-1:17          | Washed Gesha, Ethiopian washed landraces, Sydra/Typica Mejorado, Laurina, Esmeralda "NC" climate-controlled naturals                                                                                                                                                                     |
| **Balanced Intensity**      | 6.5-6.3            | 93-95°C                 | Moderate — controlled spiral, some bed exposure                      | 1:15-1:16          | Honey lots, dense varieties (Pacamara, Mokkita), most yeast-inoculated experimental lots, Gesha anaerobic honey                                                                                                                                                                          |
| **Full Expression**         | 6.3-5.5 (or finer) | 95-99°C                 | **High — active spiral, multiple pours, push the bed**               | 1:13-1:17          | Heavy anaerobic, anaerobic washed Colombian Geshas, anoxic naturals, dense washed varieties with fruit-forward intent, high-EY roasters (Sey, Flower Child, Picky Chemist, Dak). Note: on the EG-1, grind below 5.5 changes distribution shape but not D50 — temp / agitation / filter / time are the primary levers. |
| **Extraction Push**         | 6.3-5.5 (or finer) | 93-98°C                 | **Low — Melodrip, clarity-preserving**                               | 1:15-1:17          | Clean coffees where Clarity-First leaves yield on the table but Full Expression's high agitation would compress aromatic clarity: clean washed Geshas, Esmeralda climate-controlled naturals, washed processed lots with Wölfl/Tran/Giachgia targets. Empty in this archive (promoted strategy v8.2, awaiting first confirmed brew). |
| **Hybrid** (v8.4)           | Varies by sub-form | Varies by sub-form (often staged) | Phase-dependent — different per phase by design                  | 1:14-1:17          | Switch-style brews and SWORKS valve-driven brews where each phase has a different job. Sub-form selected at brief: Sequential / Phase-Mapped / Selective Bloom / Intensity-Clarity Split / Temperature-Staged. Currently 3 Sequential confirmed brews; 4 sub-forms empty. |

**Mechanics-vs-intent symmetry.** Suppression and Clarity-First share grind range and look mechanically similar, but the *intent* differs (Suppression holds an over-expressive co-ferment back; Clarity-First protects a delicate cup). Always state the intent explicitly. Full Expression and Extraction Push share fine grind + high temp but differ on the agitation lever — high agitation pushes the bed (Full Expression); Melodrip controls turbulence to preserve clarity (Extraction Push). The agitation lever choice IS the strategy choice for these two.

**Going below grind 6.3 is a different philosophy, not a tweak.** For the highest-EY roasters, going below 5.5 may be required — but see [brewing-equipment-expert/cluster/operational-reference.md § Grinder Weber EG-1](../../brewing-equipment-expert/cluster/operational-reference.md) for the D50 plateau caveat (compression below 5.5 + floor at ~820-880 µm below 5.0).

**Hybrid sub-form classification rule.** If the brewer changes mode mid-brew (immersion ↔ percolation, or pours have explicitly different sensory jobs), it is Hybrid; otherwise pick from the five intensity strategies. Per-strategy detail + per-sub-form examples live in [brewing-historian/cluster/patterns/by-strategy/](../../brewing-historian/cluster/patterns/by-strategy/). The 5 Hybrid sub-forms (Sequential / Phase-Mapped / Selective Bloom / Intensity-Clarity Split / Temperature-Staged) are documented in [brewing-historian/cluster/patterns/by-strategy/hybrid.md](../../brewing-historian/cluster/patterns/by-strategy/hybrid.md).

### Axis 2 — Modifier check (required at Step 1d, even if the answer is "none")

- **Output Selection** — Is there a structural reason to discard part of the extraction OR to dilute the cup post-brew? Heavy co-ferments often benefit from a late cut. Lots with sharp/saline fronts may benefit from an early cut. Anaerobic naturals where 1:14.5 lands the flavor target but the cup feels syrupy may benefit from `dilution` (form=`dilution`, `dilution_g` populated). Default: none.
- **Inverted Temperature Staging** — Has this coffee or process type historically been resistant to both Clarity-First and Balanced lever moves? Inverted staging is the experimental fallback when the standard temperature primacy rule does not resolve the cup. Default: none.
- **Aroma Capture** — Is this a highly aromatic coffee (Esmeralda Gesha, washed Gesha, anaerobic natural with floral target) where mid-brew cooling could preserve volatiles? Hardware available at home only (Paragon chilling ball). Default: none.
- **Role-Based Pulse (v8.5)** — On a percolation-only brewer (V60 / Orea / Kalita / April / Chemex), is each pour going to carry a named **mechanical role + cup-side target** pair (per the formal split — see Phase-Mapped Hybrid definition above)? Cup-side targets draw from the canonical 5-attribute set `aroma / attack / mid-palate / body / finish`; mechanical roles are open-ended (gentle saturation pour, body-building slow spiral, Melodrip clarity-restoration pour, etc.). Default: no. Flag when the recipe is structured around per-pour role + target pairs rather than around pour-rhythm. Reference: Justin Bull 2025 percolation-phase logic without the Hybrid immersion phase. *Agitation taper* (high-energy early, low-energy late) is one shape of this modifier — same RBP logic on the agitation axis.

> **v8.4 note (2026-05-06):** *Immersion* removed from the modifier list — what was the Immersion modifier is now the **Hybrid** strategy (Axis 1) with `hybrid_subform` set. Strategy-level decision, not a modifier. Picking Hybrid forces a sub-form choice; you cannot stack "Hybrid + Immersion modifier."

### Named considerations (v8.4 — state explicitly even if the answer is the default)

- **Cooling-Curve Design** — Is this a coffee where peak evaluation window IS the strategy? Default: no, evaluate normally as cup cools. Flag explicitly when peak evaluation is below 50°C (most El Paraíso, Garrido Mokka/Mokkita, anaerobic naturals, anoxic naturals, Picolot competition lots) so the strategy declaration includes "design for and evaluate at 40-45°C" rather than discovering it three iterations in. Persists in `cooling_curve_target` as free-text on the brew row. Most brews answer null/normal and move on; the discipline is in being asked.

- **WBC corpus + cross-cutting control patterns check (v8.5)** — Does this coffee profile match a catalogued WBC recipe shape we haven't tried, or a cross-cutting calibration move worth flagging? Pull [wbc-brewing-archivist/cluster/wbc-recipes.md](../../wbc-brewing-archivist/cluster/wbc-recipes.md) when reaching for a non-default move (the 102-recipe corpus is the substrate for "experiment Chris wouldn't think of"); pull [wbc-brewing-archivist/cluster/wbc-reference.md § Cross-Cutting Control Patterns](../../wbc-brewing-archivist/cluster/wbc-reference.md) when a calibration axis (water strength / agitation taper / filter behavior / pre-brew conditioning) might be the real lever. Default: none. Flag explicitly when a 2024-2025 finalist's recipe pattern is structurally close to what this coffee is asking for (e.g. anaerobic natural with floral target → Vannelli Aroma Capture pattern; clean washed Gesha pushing yield → Wölfl Extraction Push canonical; bloom-as-strategy → Ferket Selective Bloom Hybrid), or when a calibration axis other than the strategy/modifier set is doing the load-bearing work (e.g. "this is Clarity-First mechanically but the real move is dropping water from 90ppm to 50ppm"). Persists as free-text in `strategy_notes` when relevant. Most brews answer null/normal and move on.

**If any modifier is proposed,** output a 1-2 sentence rationale explaining what the modifier is meant to solve for this specific coffee and what the risk is if the modifier is wrong (e.g. early cut too aggressive → weak cup; inverted staging → under-extracted finish). Wait for confirmation on both strategy and modifier(s) before proceeding to Step 2.

## Step 2 — Recipe Output (after strategy is confirmed)

Once the extraction strategy and any modifiers are confirmed, select the brewer and filter based on the brewing location (see [brewing-equipment-expert/cluster/operational-reference.md § Location Constraints](../../brewing-equipment-expert/cluster/operational-reference.md)), then output a full recipe using the format below.

### Output Format

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
| **Pour Structure**    | [list each pour with weight, duration, wait, and — for Bottomless Dripper — valve state per phase. If Aroma Capture modifier active, note where chilling ball is applied. If Strategy = Hybrid, note phase boundaries (lever/valve transitions) and what each phase is doing — e.g. "0:00-1:30 immersion, 1:30-3:00 percolation finish".] |
| **Target Total Time** |                                                                                                      |

After the recipe table, provide three short sections:

- Why this brewer and filter combination was selected (2-3 sentences referencing the confirmed extraction strategy and brewing location constraints).
- What to watch for in the first brew — specific risk flags given this coffee's profile.
- If any modifier is active: a **Modifier Note** explaining what the modifier is meant to do, how to evaluate whether it worked, and the failure mode (e.g. for Output Selection late cut: "if cup reads thin or under-developed, the cut was too early; if drying tail persists, cut earlier").
- If Strategy = Hybrid: include a **Hybrid Phase Note** explaining what each phase is meant to do, how to evaluate whether the phase boundary timing worked (Sequential = does each phase deliver its target?; Phase-Mapped = does each pour-role land?; Intensity-Clarity Split = does the percolation finish recover the clarity that the immersion phase added body to?), and the failure mode if phase timing was wrong (early valve open → thin body / muddled phase roles; late valve open → over-extracted finish / muddiness).
- If Bottomless Dripper is selected: include a **Valve Strategy note** explaining the rationale for valve state at each pour phase, and what to adjust if the cup reads bitter (open earlier) or flat/sour (stay restricted longer).

## Step 3 — Iteration Loop (Phase 2 — in-thread iteration)

After each brew, provide tasting notes covering aroma, attack, mid-palate, body, and finish. Note how it changes as it cools.

Claude will respond with adjusted parameters. **Adjustment width is scale-dependent — concretely mapped to the iteration's position in the search**, mirroring the roasting-side Adjustment rule (CONTEXT.md § Adjustment; Brew 1 is the brewing analog of V1):

- **Brew 1 (and often Brew 2)**: wide-variance, multi-variable exploratory. When the response surface is unknown for this coffee (new producer, new process signature, unfamiliar cultivar at this elevation, or the Coffee Brief's Step 1d confirmation flagged anything as uncertain), it's appropriate to move two or more variables at once — e.g. dropping temperature 2°C while coarsening one grind notch — to map roughly where the cup wants to live before refining. The geography analogy applies: you have the world map, you have to pick the continent and then the country before the state and the city; in the beginning when you don't yet know what country you're in, it's fine adjusting more things. Wide-variance multi-variable does **not** mean "change everything at random" — each move is still motivated by a specific tasting signal.

- **Brew 2 to Brew 3**: narrow on Brew 2's leading direction, usually single-variable. Once a directional signal lands ("warmer + finer pulled fruit forward, but the finish dried"), the next move isolates one knob at a time so the cause attribution stays clean. This is the classical "pick one variable, hold the rest constant" rule — it's the right rule in the convergent regime, not in the search regime.

- **Brew 3+**: probe a variable held constant across Brews 1-3 (filter swap, brewer swap, modifier addition, or a Named Consideration like Cooling-Curve Target evaluation) or replicate the leading recipe as a control. Most brews resolve in 2-3 iterations; Brew 4+ is unusual and usually signals either a strategy pivot is overdue or a previously-unconsidered axis (cross-cutting WBC pattern, water strength, filter behavior) is doing the load-bearing work.

**Override**: if a brew explicitly demands re-bracketing ("the cup is so far from the target I don't trust the search neighborhood at all"), widen the spread regardless of brew number — usually this means a strategy pivot, not a parameter widening. The Motta-prevention value of the single-variable rule is preserved by keeping it the default once a directional signal is in hand; the softening is for early-iteration multi-variable exploration before that signal exists.

**Multi-variable approval is direction-confirmation-regime-only.** When you DO move multiple variables in one brew (Brew 1 wide-variance OR a deliberate strategy pivot OR a "bigger push" Chris approves on a coffee with ample bag), flag it explicitly in the recipe writeup so the deviation from single-variable discipline is on the record rather than sloppy. The criterion is: the regime is *direction confirmation*, not *fine-tuning*. Once a directional signal is in hand, revert to single-variable. Ample bean supply + Chris-approved bigger push is a legitimate multi-variable trigger; routine iteration is not.

**Recipe-deviation reconciliation rule.** If Chris reports tasting notes against a recipe he executed but where he deviated from the prescribed parameters mid-brew (most common: pulled the cut earlier, opened the valve sooner, swirled when "no swirl" was prescribed, dropped temperature on the fly), treat the deviation as an *executed data point* and reconcile from what was *actually* brewed, not from what was prescribed. Acknowledge the deviation in your response (one sentence: "you opened at 1:45 instead of the prescribed 2:00 — useful data point: shorter immersion helped"), then prescribe the next brew from the deviated execution as the new baseline. Otherwise comparison drifts: subsequent brews get compared against the wrong reference recipe.

At each iteration, Claude must also assess:

- Are we making incremental progress, or does something feel structurally wrong (consistently sour, flat, hollow, or one-dimensional despite multiple tweaks)?
- If 2-3 iterations in and the cup still feels off structurally, Claude should flag this explicitly and ask whether to pivot extraction strategy rather than continue tweaking parameters within the current one.
- If the confirmed extraction strategy seems mismatched to what you are tasting, Claude should recommend a strategy pivot and explain what that would change about the approach.

**Pivot-destination heuristics — wrong-zone confirmed, picking the new zone.** When a strategy pivot is warranted, the new destination is not free-form. Match the SHAPE of the residual problem to the strategy that targets it:

- **Single-axis loud / over-expressive problem** ("everything is too dark, too bitter, too astringent — pull back on all of it") → **Suppression**. Default first pivot when one register dominates and the cup wants to be held back uniformly. Cleanest, lowest-risk, single-mode logic.
- **Two-opposing-goals problem** ("more extraction to pull the sweetness out BUT suppression on everything else") → **Hybrid (Intensity-Clarity Split)**. The closed-immersion phase reaches the buried target; the fast open-percolation phase drains the over-expressive register. Phase order matters (intensity first, clarity second). Canonical hardware: Hario Switch at home, SWORKS at office. **First confirmed on Wush Wush 2026-05-22 for a roast-character problem** — the sub-form was originally framed for co-ferment muddiness but the structure works wherever one register is loud and another is buried beneath it.
- **Aromatic-vs-structural-decoupling problem** ("the florals are getting buried but the body is OK") → **Hybrid (Selective Bloom)**. Bloom liquid separated and evaluated independently before recombining or discarding. Untested in archive; Eline Ferket 2025 pattern.
- **Bittersweet-cliff-at-temperature problem** ("clean at 95°C, bitter at 96°C") → **Hybrid (Temperature-Staged)**. Phase boundary coincides with temperature change. Distinct from a standalone Inverted Temperature Staging modifier because the temperature change is bound to a phase boundary.
- **Heavy co-ferment / anaerobic-natural / process-loud problem** ("the fermentation is muddling the cup") → **Suppression** (single-mode hold-back) is the canonical first call per [cross-coffee-insights.md § Anaerobic-Natural Suppression + Temperature-Primacy pattern](../../brewing-historian/cluster/patterns/cross-coffee-insights.md). Confirmed 4 origins (Colombia / Ethiopia / Panama / Costa Rica). Step beyond Suppression to Hybrid (Intensity-Clarity Split) only if Suppression goes thin / sweetness retreats.
- **Single-axis-quiet-buried-under-roast problem** ("the prune and citrus are there but I have to squint for them") → **Hybrid (Intensity-Clarity Split)** OR **Extraction Push** depending on whether the burying register is roast-derived (use Hybrid to drain it) or process-derived (Extraction Push to push past it). The medium-roast specialty natural pattern (operational-guide Step 1 hook) falls under Hybrid; the high-EY clean-washed-Gesha pattern falls under Extraction Push.

Lead with the lower-risk single-mode pivot (usually Suppression) when uncertain — it's the cleaner diagnostic probe. If it comes back thin-but-clean (sweetness still buried), THAT result is the clean signal to escalate to Hybrid. Use direct Hybrid when Chris has ample bag + explicitly wants the structural move (as he did on Wush Wush, 2026-05-22).
- If a modifier is active and the expected effect is not present (e.g. Output Selection late cut applied but drying tail still present in the kept fraction), Claude should diagnose whether the modifier was wrong, the modifier parameters were wrong (cut at the wrong point), or the underlying strategy is mismatched and the modifier is masking the issue. If a modifier is *not* active and the iteration loop suggests one would help (e.g. persistent bitter tail at correct strategy → late cut is a candidate), Claude should propose adding it and explain the rationale.
- For Bottomless Dripper brews: valve position is always adjusted before grind. Thin or sharp → close valve more (more restriction), do not go finer. Muddy or flat → open valve earlier (less restriction), do not go coarser; also check if closed bloom exceeded ~25s. Bitter → shorten contact time by opening sooner in the final pour. Only adjust grind after valve position has been optimized.

**The goal of iteration is not parameter optimization within a fixed approach. It is finding the right neighborhood first, then dialing within it.**

## Step 4 — Resolved Brew Output Format

Once a recipe is confirmed as the reference brew for a coffee (iteration complete, extraction strategy validated, cup meets roaster tasting notes), output the resolved brew in the format below. **The Latent Coffee app's claude.ai-authored sync reads this block directly and validates each field against the canonical registries.** Every field below has a corresponding canonical axis — fetch via `read_canonical(axis: "<name>")` Tool before populating, per the Lookup discipline in [coordinator/operator-guide.md § Canonical taxonomy lookups](../../coordinator/operator-guide.md). Drift is caught at sync time, not after.

**Output convention.** Format each section as a key/value list (one field per line, `Field: value`). Do not collapse multiple fields into one cell. Plain hyphens, no em-dashes, except where they appear inside a free-text value Chris already wrote. When pasting from claude.ai chat into a plain-text app context, structural separators (tabs, table cells) can get stripped — keep each `Field: value` on its own line so a label-boundary parse can recover the structure if needed.

---

### Coffee identity

- **Roaster** — canonical roaster name from `read_canonical("roasters")` (e.g. `Picolot (Brian Quan)`, `Hydrangea Coffee`, `Moonwake Coffee Roasters`). If you find a short alias in your prompt context, resolve it to canonical (e.g. `Picolot` → `Picolot (Brian Quan)`). If the roaster isn't in the registry, write it verbatim and flag `(NET-NEW)`.
- **Coffee Name** — the roaster's name for the coffee (e.g. `Emerald`, `El Velo Natural`, `Comp Edition — Janson Green-Tip Gesha Natural Anaerobic 1010`). Do not embed producer or variety unless the roaster's product page does.
- **Lot Code** — if the roaster published one (e.g. `PL#015`, `74158`, `CF10`, `1010`). Omit if absent.
- **Producer** — canonical producer name from `read_canonical("producers")`. The registry uses the form `Person, Farm`, `Person (Farm)`, or `Family (Farm)` depending on how the producer is most commonly referenced (e.g. `Mama Cata Estate (Garrido Family)`, `Diego Samuel Bermúdez Tapia`, `Jannette & Kai Janson (Janson Farms)`). Look up the canonical form first; if the producer isn't there, write your best `Person, Farm` form and flag `(NET-NEW)`.
- **Roast Date** — `YYYY-MM-DD`.
- **Roast Machine** — if disclosed (e.g. `S7X`, `Loring S15`, `Probat P12`). Omit if unknown.
- **Roaster Tasting Notes** — the descriptors the roaster published for this lot (e.g. `Hot: raspberry, orange blossom, plum / Cold: rose. Yuzu-like acidity, honey-lime sweetness.`). This is the roaster's *intent* — Chris's observed tasting notes go in the Tasting + Flavor Notes sections below.

---

### Origin

- **Country** — canonical country from `read_canonical("terroirs")` (e.g. `Panama`, `Colombia`, `Ethiopia`).
- **Macro Terroir** — canonical macro from `read_canonical("terroirs")` for that country (e.g. `Volcán Barú Highlands`, `Central Andean Cordillera`, `Sidama Highlands`). If the natural-language name doesn't match canonical, look up the macro that contains the named area (e.g. "Boquete" → `Volcán Barú Highlands`; "Boquete" is a meso, not a macro).
- **Meso Terroir** — free-text (not validated). Optional. Use the meso names listed under the chosen macro as guidance.
- **Cultivar** — canonical cultivar from `read_canonical("cultivars")` (e.g. `Mokka`, `Gesha`, `Pink Bourbon`, `Sidra`). The varieties registry handles common variants via aliases (e.g. `Geisha` → `Gesha`, `Green-Tip Gesha` → `Gesha` — green-tip is a leaf phenotype, not separate genetics; `Mokka ≠ Mokkita`, distinguish precisely). If a blend, comma-separate.

---

### Process

- **Base Process** — one of `Washed`, `Honey`, `Natural`, `Wet-hulled` (per `read_canonical("processes")`).
- **Subprocess** — Honey color tier only: `White Honey`, `Yellow Honey`, `Red Honey`, `Black Honey`, `Purple Honey`, `Generic Honey`, `Hydro Honey` (canonical form includes the `Honey` suffix). Omit for non-Honey bases.
- **Fermentation Modifiers** — array, optional. Canonical values from `read_canonical("processes")` § fermentation axis (e.g. `Anaerobic`, `Double Anaerobic`, `Yeast Inoculated`, `Lactic`, `Thermal Shock`).
- **Drying Modifiers** — array, optional. From `read_canonical("processes")` § drying axis (e.g. `Anaerobic Slow Dry`, `Greenhouse Drying`, `Raised Bed`).
- **Intervention Modifiers** — array, optional. From `read_canonical("processes")` § intervention axis.
- **Experimental Modifiers** — array, optional. From `read_canonical("processes")` § experimental axis (`Koji`, `SCOBY`, `Enzyme-Assisted`, `Barrel-Aged` only — `Anaerobic` is on the *fermentation* axis, not experimental).
- **Decaf** — if applicable: `SWP`, `MWP`, `EA`, `CO2`. Omit otherwise.
- **Signature Method** — proper-name proprietary process if the producer has one. 15 canonicals post Sprint T1 / BR-1 (2026-05-18): `Moonshadow`, `TyOxidator`, `Alchemy`, `TIM`, `XO`, `Enzyflow`, `Bio-innovation`, `Sous-vide`, `Amazake`, `Anti-maceration`, `Dynamic cherry`, `Dry fermentation`, `Splash`, `Symbiotic`, `Wave Hybrid`. Hybrid Washed deprecated in BR-1 (it fails the "mechanically opaque" criterion; CGLE publicly decomposes it as Anaerobic + Aerobic Washed — record those as structured modifiers, not as a signature). Omit otherwise.
- **Fermentation Qualifiers** — array, optional (Sprint T3 / CR-5, 2026-05-18). Orthogonal annotations on `Fermentation Modifiers`. Canonical today: `Anoxic` for sealed-container no-headspace execution. The qualifier is a record-when-known annotation; aggregation stays at the modifier level (both Anoxic Natural and plain Anaerobic Natural group under the Anaerobic modifier-index page).

---

### Recipe

- **Brewer** — canonical from `read_canonical("brewers")` (e.g. `Sworks Bottomless`, `Hario V60`, `Orea v4`, `Kalita Tsubame`, `April`, `UFO`, `Hario Switch`). The brewing doc body uses descriptive forms (`SWORKS Bottomless Dripper`, `April Brewer Glass`, `Hario V60 Glass`) for readability; resolve to canonical when populating Step 4. If valve / Dial structure is part of THIS brew's recipe (e.g. SWORKS), keep that detail in the Pour Structure field, not the Brewer field — the Brewer field is equipment-only.
- **Filter** — canonical from `read_canonical("filters")` (e.g. `xBloom Premium Paper Filters`, `CONE FAST`, `FLAT FAST`, `UFO FAST`, `WAVE B3`, `CAFEC Abaca+ Cup 1 Cone Paper Filter`). Note: legacy `Espro Bloom Flat` resolves via alias to `xBloom Premium Paper Filters`. Sibarist canonicals do NOT include the `Sibarist` brand prefix (that's manufacturer metadata, not part of the canonical name); use `CONE FAST` not `Sibarist FAST CONE`. Cafec papers: short forms (`Cafec T-92`) resolve via alias to canonical (`CAFEC T-92 - Cup 1 Light Roast Paper Filter`); use either form.
- **Dose** — grams (e.g. `15g`, `18g`).
- **Water** — `<weight>g (<ratio>), <type>` (e.g. `250g (1:16.7), office tap`, `288g (1:16), home remineralized`).
- **Cup Yield** — only if Output Selection modifier is active; specify what was kept (e.g. `kept 155g of 200g brew weight; discarded first 8g + last 37g`).
- **Grinder** — canonical from `read_canonical("grinders")` (currently `EG-1`).
- **Grind Setting** — must match a valid setting for the grinder; for EG-1, decimal between 3.0 and 8.0 in 0.1 steps. Format: `6.3`, not "EG-1 6.3" — Grinder + Grind Setting are separate fields.
- **Extraction Strategy** — exactly one of `Suppression`, `Clarity-First`, `Balanced Intensity`, `Full Expression`, `Extraction Push`, `Hybrid` (v8.4). Strict canonical. Inspect via `read_canonical("extraction-strategies")`.
- **Hybrid Sub-form** — REQUIRED when Strategy = Hybrid; null otherwise. One of: `sequential`, `phase_mapped`, `selective_bloom`, `intensity_clarity_split`, `temperature_staged`. Inspect via `read_canonical("hybrid-subforms")`. Strict canonical (5-value enum, code-side enforced).
- **Modifiers** — JSON-style or labeled array of zero-or-more modifiers from this list: `Output Selection`, `Inverted Temperature Staging`, `Aroma Capture`, `Role-Based Pulse`. Each modifier with its sub-fields (Output Selection: form + brew_weight + cup_yield; Inverted Temp: phases; Aroma Capture: application). State `None` explicitly if no modifiers — empty is a positive signal that modifiers were considered. **v8.4 (2026-05-06):** Immersion was removed from the modifier list and absorbed into the Hybrid strategy via hybrid_subform.
- **Cooling-Curve Target** (v8.4) — free-text, optional. Set when peak evaluation window IS the strategy (e.g. `40-45°C peak`, `evaluate below 50°C`). Default null = normal cooling progression. Most brews omit; populate on El Paraíso, Garrido Mokka/Mokkita, anaerobic naturals, anoxic naturals, Picolot competition lots, and any coffee where the cooling-window discipline is part of the brief.
- **Temp** — °C, with kettle management note (e.g. `94°C, kettle on base throughout`, `95°C, kettle off base (natural decline)`).
- **Bloom** — weight + technique + duration + (if SWORKS) valve state.
- **Pour Structure** — each pour with cumulative weight, duration, technique (center / spiral / Melodrip), valve state for SWORKS, chilling-ball position if Aroma Capture active, phase boundaries if Immersion active.
- **Total Time** — e.g. `2:50-3:15`.

---

### Roast level

- **Roast Level** — canonical from `read_canonical("roast-levels")` (8 Agtron-anchored buckets: `Extremely Light`, `Very Light`, `Light`, `Light-Medium`, `Medium`, `Medium-Dark`, `Dark`, `Very Dark`). If you only have a marketing tag (e.g. `Nordic Light`, `Specialty Light`), resolve it to the canonical bucket via the registry's alias map.

---

### Tasting (Chris's observed)

- **Aroma**
- **Attack**
- **Mid-Palate**
- **Body**
- **Finish**
- **Temperature Evolution** — how the cup changes as it cools.
- **Peak Expression** — hot / warm / cool / specific temperature (e.g. `cool, ~45°C and below`).

---

### Flavor Notes (canonical)

- **Flavor Notes** — comma-separated array of canonical bases or `Base (Modifier)` chips from `read_canonical("flavors")` (e.g. `Raspberry, Orange, Yuzu, Rose, Honey` or `Blueberry (Baked), Apricot, Black Tea`). The 17 numbered composition rules in the flavors registry apply — particularly Rule 11 (Tea bases reverse: `Peach Tea` → `Tea + Peach modifier`). Aim for 2-4 chips. Distinct from Roaster Tasting Notes above.
- **Structure Tags** — comma-separated array of `Axis:Descriptor` from `read_canonical("flavors")` § structure tags (e.g. `Acidity:Bright, Body:Silky, Overall:Tea-like`). 7 axes, 29 canonical descriptors. Aim for 2-3 tags.

---

### Learnings

- **What I Learned from This Coffee** — specific, testable bullet points covering: levers tested and which mattered, extraction ceiling or floor observed, cooling behavior, reference-point determination (is this the reference recipe for the coffee type?), strategy drift from the initial hypothesis, modifier effectiveness if used. Null results are signal — if modifiers were tested and didn't help, say so.
- **Extraction Confirmed** — free-text, **only populate when the planned strategy diverged from what the brew actually validated**. If the planned strategy at Step 1d matched the tasted result, leave this empty. Examples of divergence: planned Balanced Intensity but the cup needed Full Expression; planned Suppression but the cup wanted Balanced + Inverted Temperature. If non-divergent, the strategy column on the resolved brew already records what was confirmed; no extra prose is needed.
- **Modifiers Confirmed** — closing line stating which modifiers (if any) were validated, with a one-sentence note on whether each resolved what it was meant to resolve. State `None` explicitly if no modifiers were used (null modifier results are still signal).
- **Process-Dominant** — boolean. `true` if the cup is driven primarily by processing (e.g. yeast-anaerobic naturals, heavy co-ferments) rather than terroir or cultivar; `false` for clean transparency-driven lots. Affects how the brew aggregates on `/processes` vs `/cultivars` pages.
- **Classification** — one-line synthesis (≤200 chars) suitable for a card or list view (e.g. `Mokka Natural confirming Full Expression on Picolot roast — bright green grape and tea-like body, clarity-driven with herbal lift on cooling.`).

## End-of-coffee document review

After producing the resolved brew, assess whether the learnings should propagate back to the substrate via `propose_doc_changes`. Candidate locations to update:

- [docs/brewing/roasters.md](../../../brewing/roasters.md) (new roaster data or strategy tag refinement)
- [brewing-historian/cluster/patterns/by-strategy/<strategy>.md](../../brewing-historian/cluster/patterns/by-strategy/) — new strategy data points
- [brewing-historian/cluster/patterns/cross-coffee-insights.md](../../brewing-historian/cluster/patterns/cross-coffee-insights.md) — By Variety / By Process / Cooling Behavior / Office Brewing Notes / Modifier Patterns / Open Questions entries
- [brewing-historian/cluster/patterns/by-cultivar/<cultivar>.md](../../brewing-historian/cluster/patterns/by-cultivar/) — per-cluster deep dives
- [brewing-historian/cluster/patterns/by-coffee-family/<family>.md](../../brewing-historian/cluster/patterns/by-coffee-family/) — per-cluster deep dives

Propose specific edits via the `propose_doc_changes` MCP Tool with citations targeting the relevant `target_doc='skills/brewing-historian/cluster/patterns/<file>.md'` + section-anchor, not generic "should update" observations.

## Cross-references

- [SKILL.md](../SKILL.md) — Brewing Assistant role + Phase 1/2/3 framing summary
- [coordinator/catalog.md § brewing-domain-principles](../../coordinator/catalog.md) — championship-mode framing + Two-Axis principle
- [coordinator/operator-guide.md](../../coordinator/operator-guide.md) — canonical lookups + MCP server how-to
- [brewing-equipment-expert/cluster/operational-reference.md](../../brewing-equipment-expert/cluster/operational-reference.md) — location constraints + brewer rotation + Valve Position Reference + Filter Flow Gap
- [brewing-historian/cluster/patterns/cross-coffee-insights.md § Process / Variety Signal Table](../../brewing-historian/cluster/patterns/cross-coffee-insights.md) — Step 1b lookup
- [brewing-historian/cluster/patterns/by-strategy/](../../brewing-historian/cluster/patterns/by-strategy/) — per-strategy substrate
- [wbc-brewing-archivist/cluster/](../../wbc-brewing-archivist/cluster/) — Step 1d WBC corpus check substrate
- [docs/prompts/start-brew.md](../../../prompts/start-brew.md) + [docs/prompts/log-brew.md](../../../prompts/log-brew.md) — operational entry surface prompts (thin pointers to this doc)
- [docs/prompts/bundled-brewing-completion.md](../../../prompts/bundled-brewing-completion.md) — Phase 3 handoff to Brew Recorder
