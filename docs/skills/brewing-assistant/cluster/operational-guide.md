# Brewing Assistant — operational guide

*Coffee Research · Latent · Brewing Assistant cluster*

The executable how-to the brew session composes over via `read_doc_section` (Steps 1-4). Entry surfaces: the `/brew` skill (primary) and [`docs/prompts/start-brew.md`](docs/prompts/start-brew.md) (mobile fallback); Phase 2 iteration is in-thread with no per-iteration prompt; the Phase 1 / 2 / 3 framing lives in [SKILL.md](docs/skills/brewing-assistant/SKILL.md). **Every pourover starts from the [Latent house style](CONTEXT-brewing.md)** ([ADR-0026](docs/adr/0026-latent-house-style-chassis.md)): Step 1 names the delta or adjustment row, Step 2 emits the chassis with it applied, Step 3 iterates by row, Step 4 records the strategy + modifier labels. Nothing is designed from zero.

## Step 1 — Coffee Brief (Claude runs this automatically)

Four moves in order, then pause. The brief's output is one sentence: "house style + <row / delta / none>, labelled <strategy>, modifiers <list / none>", with the signal that named it.

**1a. Identity + roast level**

- **Purchased:** look the bag up in the freezer-stock table first. On the MCP path NEVER whole-doc `read_doc` it (the table is past the read cap and truncates): (1) `list_doc_sections(uri="docs://brewing/freezer-stock.md")` to enumerate the `##` bag headings, (2) match by roaster + coffee name, (3) `read_doc_section(uri="docs://brewing/freezer-stock.md", anchor="<matched heading>")` for the one record. Enumerate first - anchors are case-sensitive exact and heading formats vary. With repo access, grep `docs/brewing/freezer-stock.md` directly. On a hit, seed the brief from the record: **the whole-bean Agtron is the load-bearing pull - use it, do not ask Chris to re-measure** - plus spec URL / process / variety / elevation / rest window. On a miss (or a `Resting` row with Agtron `pending`), proceed on the roaster's stated roast level. Web-search the roaster's brew guide for this coffee; if found, it is a signal about the roaster's extraction intent, never a recipe to follow.
- **Self-roasted:** the roasted-bean state IS the coffee. `get_green_bean` + `get_bean_pipeline` scoped to the packet's `roast_id` (never unscoped - it overflows the tool-result cap). Producer tasting notes are the target, the cupping prose is what the roast delivered, the cupping row's `ground_agtron` is the roast-level prior. No roaster brew guide.
- **Roast level is the overriding signal** once the coffee is darker than the ultra-light / light default, or might be: it selects the adjustment row before variety / altitude / process get a vote. A **ground Agtron at dose-out** beats the whole-bean read (WB tracks surface development; ground tracks the composite the water meets; a WB-to-ground delta over 7 points makes the WB read lighter than the brewable truth - [counterflow-observations.md § WB-to-Ground Agtron Delta](docs/skills/roest-knowledge/cluster/machine/counterflow-observations.md)). Self-roasted lots have a ground read from cupping; purchased lots have WB only, by decision - do not push Chris to measure ground on purchased bags. When the bag reads "potentially darker" and no Agtron exists, be forceful, not blocking, in this order: ask for a CM200 read if at home and a ~30 g pull is feasible; otherwise ask for a visual read (light / light-medium / medium / darker); and treat roasty / bitter / smoke at low temperature in Brew 1 as the dark-roast tell that routes Brew 2 to the dark-roast row. On a medium or darker roast the over-extraction risk is roast character, not under-development: evaluate cooler, accept a chocolatier register, never push temperature or agitation ([by-roast-level/medium-developed.md](docs/skills/brewing-historian/cluster/patterns/by-roast-level/medium-developed.md)).

**1b. Archive lookup** (explicit paths, not author discretion)

- **This coffee / sibling lots (DB):** `query_brews(roaster: "<Canonical Roaster>")`, narrowing with `coffee_name`; rows carry FK-joined terroir / cultivar / green_bean, so reuse a sibling's canonicals from here. Do NOT wide-pull `list_recent_brews` and filter by hand.
- **Pattern docs:** `read_doc(uri="docs://skills/brewing-historian/cluster/patterns/by-cultivar/<cultivar-slug>.md")` (else the By Variety section of `cross-coffee-insights.md`); `.../by-coffee-family/<family-slug>.md`; `.../by-strategy/<strategy-slug>.md` for confirmations.
- **Process / variety flags:** the **Process / Variety Signal Table** in [cross-coffee-insights.md](docs/skills/brewing-historian/cluster/patterns/cross-coffee-insights.md). State whether any flag applies; a heavy co-ferment / aggressive-process flag names the Suppression delta at 1d.
- **Roaster card:** `read_doc_section(uri="docs://brewing/roasters.md", anchor="<Canonical Roaster Name>")`. A strong roaster signal names a delta (Sey → Extraction Push); a weak or absent one defers to the chassis. Net-new roasters have no card; say so.
- **Prior threads:** `conversation_search` on roaster + variety + process when no pattern doc exists.

**1c. Brief summary + apex gate**

Three to five sentences: what the coffee is, what terroir / cultivar / process / roaster each suggest, and which signal wins when they disagree (judgment-weighted, not strict precedence). If 1b surfaced nothing (no cultivar doc, no family entry, no prior brew, no roaster card), say "First <variety> in archive": the chassis still applies, and Brew 1 is wide-variance at Step 3. Then the **apex gate**: is this an apex coffee (self-roasted, or an apex-selected purchased lot)? If yes, the brew is the *clarify* stage of the express-then-clarify couple and any delta defaults clarify-side (Suppression / Clarity-First / the house style itself) - an apex default, not a global override ([CONTEXT-taste.md § Brewing philosophy](CONTEXT-taste.md)).

**1d. Name the delta or row, then the modifiers**

Default: **the Latent house style, labelled Hybrid (Sequential)**, unless 1a-1c named a delta from the table below or a row from the Step 2 table. Say which signal named it. A self-roasted brew that leaves the house style states why in one line of `strategy_notes`.

### Axis 1 — Extraction Strategy (single canonical choice per brew)

The six strategies stay the taxonomy of *intent* and the recorded label; on the chassis each is a parameter delta:

| Strategy (label) | Delta on the chassis | Signal that names it |
|---|---|---|
| **Hybrid (Sequential)** | None - this is the house style. The other sub-forms (Phase-Mapped / Selective Bloom / Intensity-Clarity Split / Temperature-Staged) enter only as Step 3 pivots | Default |
| **Suppression** | Dial 6 held; no closed front, no open finish; temperature is the primary lever (88-92°C) | Anaerobic natural / heavy co-ferment / process-loud flag; one register dominates and the cup wants holding back uniformly |
| **Clarity-First** | Dial 6 throughout; no closed phase; low agitation | A delicate washed cup (washed Gesha, Ethiopian washed landraces, Laurina) where the closed front would blunt the aromatics |
| **Extraction Push** | Grind 5.6, 96°C held, long restricted contact; Melodrip if agitation must stay low | Strong high-EY roaster signal (Sey; Wölfl / Tran targets); a clean washed lot leaving yield on the table. Confirmations: [by-strategy/extraction-push.md](docs/skills/brewing-historian/cluster/patterns/by-strategy/extraction-push.md) |
| **Balanced Intensity** | Not a chassis delta. Survives only on constant-valve or valveless brewers: a valve phase boundary IS the house style (v8.4 rule) | A rotation trigger moved the brew off the SWORKS |
| **Full Expression** | No observed delta yet - flagged, not invented | High-agitation / high-temperature intent on a non-valve brewer; record it, do not back-fill from a roaster's doctrine |

Suppression and Clarity-First look alike mechanically; state the intent (hold an over-expressive cup back vs protect a delicate one). Grind below 6.3 is a different philosophy, not a tweak ([grinder-eg1.md § Structural findings](docs/skills/brewing-equipment-expert/cluster/grinder-eg1.md): D50 plateau below 5.5). Per-strategy and per-sub-form corpus: [by-strategy/](docs/skills/brewing-historian/cluster/patterns/by-strategy/).

### Axis 2 — Modifier check (required at Step 1d, even if the answer is "none")

Two modifiers are adjustment rows and arrive via the Step 2 table: **Output Selection** (the roasty / bitter-tail row = late cut at 180-205 g; also an early cut for sharp / saline fronts, or `dilution` with `dilution_g` when the flavor target lands but the cup is syrupy) and **concentration** (the "wants more intensity" row = stop at 150 g, Concentrated Pour-Over). The other three are rare and need a stated reason: **Thermal Staging** (kettle stance or active ramp; the fallback when temperature primacy alone does not resolve the cup), **Aroma Capture** (mid-brew cooling via the Paragon ball, home only, highly aromatic lots), **Role-Based Pulse** (percolation-only brewers where each pour carries a named mechanical role + cup-side target from `aroma / attack / mid-palate / body / finish`; agitation taper is one shape of it). Default for all: none. If a modifier is proposed, give one or two sentences on what it solves and the failure mode if it is wrong.

### Named considerations (v8.4 — state explicitly even if the answer is the default)

- **Cooling-Curve Design** - does the peak window sit below 50°C (El Paraíso, Garrido Mokka / Mokkita, anaerobic and anoxic naturals, Picolot competition lots)? Then the brief says "design for and evaluate at 40-45°C" and `cooling_curve_target` is set. Default: normal cooling.
- **WBC corpus + cross-cutting control patterns check** - does a catalogued finalist shape, or a calibration axis (water strength / agitation taper / filter / pre-brew conditioning), fit this coffee better than a chassis delta? Pull [wbc-recipes-by-family.md](docs/skills/wbc-brewing-archivist/cluster/wbc-recipes-by-family.md) / [wbc-reference.md § Cross-Cutting Control Patterns](docs/skills/wbc-brewing-archivist/cluster/wbc-reference.md) only when reaching for a non-default move; persists in `strategy_notes`. Default: none.

**Pause.** State the brief sentence (house style + row / delta, label, modifiers) and wait for confirmation before Step 2.

## Step 2 — Recipe Output (after strategy is confirmed)

Emit the chassis with the confirmed row or delta applied. **The Latent house style** ([CONTEXT-brewing.md](CONTEXT-brewing.md) + [ADR-0026](docs/adr/0026-latent-house-style-chassis.md)): SWORKS Bottomless Dripper + xBloom Premium paper · ratio 1:16 invariant, dose 15 g (18 g only in the WAC lane) · EG-1 6.5 (6.3 common) · 94°C kettle on base throughout · bloom 45 g at Dial 0 for 45 s, then Dial 5 · Pour 1 immediately to 150 g at Dial 5 · Pour 2 at ~1:30 to 240 g at Dial 5, Dial 6 at the end of the pour · ~3:00, the valve dictates · water by location: home distilled + MgCl2 concentrate, office PA tap + 1 TONIK + 1 JAMM. Apply at most the row(s) the bag or the first cup calls for:

| Signal (bag or first sip) | Row |
|---|---|
| Dark / developed roast | Temperature first: 88-90°C, kettle off base. Still off → shorter bloom, Dial 6 for the mains, often a late cut |
| Very light / dense roast | Temperature first: 96-100°C. Still off → Dial 5 throughout, longer hold; grind 5.0-5.6 only as a last resort |
| Roasty or bitter tail | Late cut at 180-205 g in cup (Output Selection modifier) |
| Body climbing over the attack | Graduated Taper: Dial 6 at ~155 g mid-Pour 2, Dial 7 flush |
| Wants more intensity | Stop at 150 g = Concentrated Pour-Over (`concentration` modifier); per-coffee taste call, Pour 2 into a reserve cup for bypass |
| Stall | Open the valve earlier. Never coarsen |

**Brewer:** the SWORKS, unless one of the four rotation triggers fires ([Brewer rotation discipline](CONTEXT-brewing.md): a research question on geometry / filter · the chassis still fails after the rows are exhausted · a competition build with its own playbook · no SWORKS at the location). Only once off the default do the location table and the two-brewers-fit tiebreaker in [operational-reference.md](docs/skills/brewing-equipment-expert/cluster/operational-reference.md) apply; the Hario Switch runs the same shape as a hand-operated two-state valve.

**Water Recipe:** office records the source as-is (`Palo Alto office tap + 1 TONIK + 1 JAMM`). At home the chassis water (distilled + MgCl₂ concentrate; verified default straight MgCl₂ @ GH 44 / KH 0) is the default; when Chris wants to build deliberately, suggest from [water.md](docs/skills/brewing-equipment-expert/cluster/water.md) (anion→phase chart § 3, recipe library § 6: back-of-cup body → a splash-dose sulfate fraction; no supported mineral route to florality). An offer, not a mandate; a first cup on a new coffee is a re-taste, not a lock.

### Output Format

| **Field**             | **Value**                                                                                            |
|-----------------------|------------------------------------------------------------------------------------------------------|
| **Coffee**            |                                                                                                      |
| **Strategy**          | [Hybrid (default) / Suppression / Clarity-First / Extraction Push / Balanced Intensity / Full Expression]      |
| **Hybrid Sub-form**   | [only if Strategy = Hybrid: Sequential (house style) / Phase-Mapped / Selective Bloom / Intensity-Clarity Split / Temperature-Staged] |
| **Row / delta**       | [none (house style) / the Step 2 row(s) or Axis 1 delta applied, one line]                           |
| **Modifiers**         | [None / Output Selection (form, including dilution) / concentration / Thermal Staging / Aroma Capture / Role-Based Pulse / Equipment / multiple]            |
| **Cooling-Curve Target** | [only if peak evaluation window IS the strategy, e.g. "40-45°C peak"; omit otherwise]               |
| **Brewer**            | [SWORKS Bottomless Dripper unless a rotation trigger fired; name the trigger if so]                    |
| **Filter**            |                                                                                                      |
| **Dose**              |                                                                                                      |
| **Water**             | [total brew weight]                                                                                  |
| **Water Recipe**      | [free-text water formula / source; omit if unknown]              |
| **Cup Yield**         | [only if Output Selection used; specify what is kept and what is discarded]                          |
| **Grind**             |                                                                                                      |
| **Temp**              | [include staging if Thermal Staging modifier active — kettle stance or active ramp]                  |
| **Bloom**             | [weight], [pour pattern], wait [time]. For valve/switch brewers, add a trailing `Switch:`/`Sworks Valve:` clause stating dial/state during the bloom. |
| **Pour Structure**    | [one labeled line per pour using CUMULATIVE targets — "Pour N: at [m:ss], pour to [cumulative g] over [Ns] in a [pattern] pour", plus — for Bottomless Dripper — a trailing `Sworks Valve:` clause (dial/state + any mid-pour transition). If Aroma Capture / Equipment active, note where the gear (chilling ball / Melodrip) is applied and over which steps. If Strategy = Hybrid, note phase boundaries (lever/valve transitions) and what each phase is doing — e.g. "0:00-1:30 immersion, 1:30-3:00 percolation finish". End with a `Drawdown: [m:ss]` segment or rely on Target Total Time.] |
| **Target Total Time** |                                                                                                      |

After the recipe table, three short notes:

- **Why this row / delta** (or "house style, no row") in one or two sentences naming the Step 1 signal; if a rotation trigger moved the brewer, name the trigger.
- **What to watch for in the first brew** - the risk flags from 1a-1c, and which row the first sip would call for if they show.
- **House-style note** (valve brewers; replaces the former Hybrid Phase Note + Valve Strategy note): what each phase does (closed bloom saturates; Dial 5 holds the front and builds the two layers; Dial 6 at the end releases the back) and the first-sip correction - bitter → open earlier; thin or sour → stay restricted longer; body over the attack → Graduated Taper. On a non-valve brewer with Strategy = Hybrid, state the phase boundaries and each phase's job instead. If a modifier is active, add a **Modifier Note**: what it is meant to do, how to tell it worked, the failure mode (late cut: thin → cut too early; drying tail persists → cut earlier).

## Step 3 — Iteration Loop (Phase 2 — in-thread iteration)

After each brew, take tasting notes across the **whole temperature arc** (arc rationale: [CONTEXT-taste.md § Brewing philosophy](CONTEXT-taste.md)): **aroma → hot ~59-60°C → warm ~54-55°C → cool ≤50°C**, plus how the cup changes between stations. **Never iterate off a single temperature** - judge the *shape* of the evolution (does the cup open into new layers as it cools, or collapse to one-dimensional?); a cup great hot but flat cool has failed the arc. A Cooling-Curve Target is a named exception *within* the whole-arc default.

**Iterate by row.** The first sip names the next move from the Step 2 table before anything else: roasty / bitter tail → late cut, or open earlier; thin or sharp → stay restricted longer (close more), do not go finer; muddy or flat → open earlier, do not go coarser; body over the attack → Graduated Taper; stall → open earlier, never coarsen; wants more → stop at 150 g. **Valve before grind, always**; temperature moves first on a roast-level row; grind moves only once the valve structure is settled. Each iteration names the row (or the single variable) it applies, and the running ARC STATE `Next change` line carries it.

**Adjustment width is scale-dependent** (the brewing analog of the roasting Adjustment rule; Brew 1 = V1):

- **Brew 1 (often Brew 2):** wide-variance when the response surface is unknown (new producer / process signature / cultivar, or 1c flagged uncertainty) - two or more variables at once is allowed to find the right neighborhood, each move still motivated by a tasting signal. Flag any multi-variable move explicitly so the deviation from single-variable discipline is on the record.
- **Brew 2 to Brew 3:** narrow on the leading direction, one variable at a time, so cause attribution stays clean.
- **Brew 3+:** probe an axis held constant so far (filter, modifier, a named consideration) or replicate the leading recipe as a control. Brew 4+ usually means a pivot is overdue or an unconsidered axis (water strength, filter behavior, a WBC pattern) is doing the load-bearing work.
- **Override:** if the cup is so far off that the search neighborhood is not trusted, widen regardless of brew number - usually a strategy pivot, not a parameter widening. Ample bag + Chris-approved "bigger push" is a legitimate multi-variable trigger; routine iteration is not.

**Recipe-deviation reconciliation.** If Chris executed something other than the prescribed recipe (pulled the cut earlier, opened the valve sooner, swirled, dropped temperature on the fly), treat the deviation as the executed data point: acknowledge it in one sentence, then prescribe the next brew from what was actually brewed, not from what was prescribed.

At each iteration also assess: is the whole-arc shape **layered-evolving**; are we making incremental progress or is something structurally wrong (consistently sour / flat / hollow / one-dimensional despite tweaks); after 2-3 iterations still off, flag it and ask whether to pivot strategy rather than keep tweaking; if a modifier is active and its effect is absent, diagnose whether the modifier, its parameters, or the underlying strategy is wrong, and if a modifier is not active but the loop keeps pointing at one (persistent bitter tail → late cut), propose it.

**Pivot-destination heuristics - rows exhausted, picking the new zone.** Match the SHAPE of the residual problem to the strategy that targets it:

- **Single-axis loud / over-expressive** ("everything is too dark, too bitter, too astringent") → **Suppression**. Default first pivot; cleanest single-mode logic.
- **Heavy co-ferment / anaerobic-natural / process-loud** ("the fermentation is muddling the cup") → **Suppression** first ([cross-coffee-insights.md § Anaerobic-Natural Suppression + Temperature-Primacy pattern](docs/skills/brewing-historian/cluster/patterns/cross-coffee-insights.md), confirmed on 4 origins); step to Hybrid (Intensity-Clarity Split) only if Suppression goes thin / sweetness retreats.
- **Two opposing goals** ("more extraction to pull the sweetness out BUT hold everything else back") → **Hybrid (Intensity-Clarity Split)**: closed-immersion phase reaches the buried target, fast open-percolation phase drains the loud register; intensity first, clarity second. Confirmed on Wush Wush for a roast-character problem, so it works wherever one register is loud and another buried.
- **Quiet register buried under roast** ("the prune and citrus are there but I have to squint") → **Hybrid (Intensity-Clarity Split)** if the burying register is roast-derived, **Extraction Push** if process-derived.
- **Aromatic / structural decoupling** ("florals buried, body fine") → **Hybrid (Selective Bloom)**: bloom liquid separated and judged before recombining. Untested in archive; Ferket 2025 pattern.
- **Bittersweet cliff at temperature** ("clean at 95°C, bitter at 96°C") → **Hybrid (Temperature-Staged)**: the phase boundary coincides with the temperature change.

Lead with the lower-risk single-mode pivot (usually Suppression) when uncertain; thin-but-clean is the signal to escalate to Hybrid. Go straight to Hybrid when Chris has ample bag and wants the structural move. **The goal of iteration is finding the right neighborhood first, then dialing within it.**

**Optional fraction probe (post-dial-in).** If vials allow, brew the lived recipe with a cup swap at each pour boundary, taste the fractions straight, and judge whether curating a fraction beats the full cup - operator judgment, not a standard step; the taxed fraction has never been predictable in advance ([RP9 end document](docs/research-projects/output-fractionalization-project-end-document.md)).

## Step 4 — Resolved Brew Output Format

Once a recipe is confirmed as the reference brew for a coffee (iteration complete, extraction strategy validated, cup meets roaster tasting notes), output the resolved brew in the format below. **The Latent Coffee app's claude.ai-authored sync reads this block directly and validates each field against the canonical registries.** Every field below has a corresponding canonical axis — fetch via `read_canonical(axis: "<name>")` Tool before populating, per the Lookup discipline in [coordinator/operator-guide.md § Canonical taxonomy lookups](docs/skills/coordinator/operator-guide.md). Drift is caught at sync time, not after.

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
- **Cultivar** — canonical cultivar from `read_canonical("cultivars")` (e.g. `Mokka`, `Gesha`, `Pink Bourbon`, `Sidra`). The varieties registry handles common variants via its alias map (e.g. `Geisha` → `Gesha`; note `Mokka ≠ Mokkita`, distinguish precisely). If a blend, comma-separate. If the variety isn't in the registry (net-new Chinese-cultivated / experimental varieties surface regularly), write it verbatim and set `cultivar_override: true` (NET-NEW) — push_brew persists provisional genetics + queues it for arbiter promotion. Do NOT edit the cultivar registry + deploy mid-brew.

---

### Process

- **Base Process** — one of `Washed`, `Honey`, `Natural`, `Wet-hulled` (per `read_canonical("processes")`).
- **Subprocess** — Honey color tier only, from `read_canonical("processes")` § honey axis (canonical form includes the `Honey` suffix, e.g. `Red Honey`, `Black Honey`). Omit for non-Honey bases.
- **Fermentation Modifiers** — array, optional. Canonical values from `read_canonical("processes")` § fermentation axis (e.g. `Anaerobic`, `Double Anaerobic`, `Yeast Inoculated`, `Lactic`, `Thermal Shock`).
- **Drying Modifiers** — array, optional. From `read_canonical("processes")` § drying axis (e.g. `Anaerobic Slow Dry`, `Greenhouse Drying`, `Raised Bed`).
- **Intervention Modifiers** — array, optional. From `read_canonical("processes")` § intervention axis.
- **Experimental Modifiers** — array, optional. From `read_canonical("processes")` § experimental axis (e.g. `Koji`, `Barrel-Aged`). Guard: `Anaerobic` is on the *fermentation* axis, not experimental.
- **Decaf** — if applicable: `SWP`, `MWP`, `EA`, `CO2`. Omit otherwise.
- **Signature Method** — proper-name proprietary process if the producer has one (e.g. `Moonshadow`, `TIM`, `Wave Hybrid`). The canonical roster lives in [docs/taxonomies/processes.md § Signature methods](docs/taxonomies/processes.md) — fetch via `read_canonical("processes")` rather than relying on a memorized list (the roster grows). `Hybrid Washed` is deprecated (fails the "mechanically opaque" criterion; CGLE publicly decomposes it as Anaerobic + Aerobic Washed — record those as structured modifiers, not as a signature). Omit otherwise.
- **Fermentation Qualifiers** — array, optional. Orthogonal annotations on `Fermentation Modifiers`. Canonical today: `Anoxic` for sealed-container no-headspace execution. The qualifier is a record-when-known annotation; aggregation stays at the modifier level (both Anoxic Natural and plain Anaerobic Natural group under the Anaerobic modifier-index page).

---

### Recipe

- **Brewer** — canonical from `read_canonical("brewers")` (e.g. `Sworks Bottomless`, `Hario V60`, `Orea v4`, `Kalita Tsubame`, `April`, `UFO`, `Hario Switch`). The brewing doc body uses descriptive forms (`SWORKS Bottomless Dripper`, `April Brewer Glass`, `Hario V60 Glass`) for readability; resolve to canonical when populating Step 4. If valve / Dial structure is part of THIS brew's recipe (e.g. SWORKS), keep that detail in the Pour Structure field, not the Brewer field — the Brewer field is equipment-only.
- **Filter** — canonical from `read_canonical("filters")` (e.g. `xBloom Premium Paper Filters`, `CONE FAST`, `FLAT FAST`, `UFO FAST`, `WAVE B3`, `CAFEC Abaca+ Cup 4 Cone Paper Filter`). Sibarist canonicals do NOT include the `Sibarist` brand prefix (use `CONE FAST` not `Sibarist FAST CONE`); legacy names + short forms (`Espro Bloom Flat`, `Cafec T-92`, `… Cup 1 …` strings) resolve via the registry's alias map — the alias catalog is owned by [filters.md § Aliases](docs/skills/brewing-equipment-expert/cluster/filters.md).
- **Dose** — grams (e.g. `15g`, `18g`).
- **Water** — `<weight>g (<ratio>)` (e.g. `250g (1:16.7)`, `288g (1:16)`). The water formula / source now has its own field (Water Recipe) — don't jam `office tap` into this line.
- **Water Recipe** — free-text water formula / source (e.g. `Third Wave Water Light Roast ~1:3 concentrate:distilled`, `Palo Alto office tap`, `home remineralized`). Maps to `push_brew.water_recipe`. Omit if unknown.
- **Cup Yield** — only if Output Selection modifier is active; specify what was kept (e.g. `kept 155g of 200g brew weight; discarded first 8g + last 37g`).
- **Grinder** — canonical from `read_canonical("grinders")` (currently `EG-1`).
- **Grind Setting** — must match a valid setting for the grinder; for EG-1, decimal between 3.0 and 8.0 in 0.1 steps. Format: `6.3`, not "EG-1 6.3" — Grinder + Grind Setting are separate fields.
- **Extraction Strategy** — exactly one of `Suppression`, `Clarity-First`, `Balanced Intensity`, `Full Expression`, `Extraction Push`, `Hybrid` (v8.4). Strict canonical. Inspect via `read_canonical("extraction-strategies")`.
- **Hybrid Sub-form** — REQUIRED when Strategy = Hybrid; null otherwise. One of: `sequential`, `phase_mapped`, `selective_bloom`, `intensity_clarity_split`, `temperature_staged`. Inspect via `read_canonical("hybrid-subforms")`. Strict canonical (5-value enum, code-side enforced).
- **Modifiers** — JSON-style or labeled array of zero-or-more modifiers from this list: `Output Selection`, `Thermal Staging`, `Aroma Capture`, `Role-Based Pulse`, `Equipment`, `concentration` (Concentrated Pour-Over, `{value: 'concentrated'}`). Each modifier with its sub-fields (Output Selection: form + brew_weight + cup_yield + dilution_g; Thermal Staging: phases; Aroma Capture: application; Role-Based Pulse: roles; Equipment: name + scope). State `None` explicitly if no modifiers — empty is a positive signal that modifiers were considered. `Thermal Staging` covers both kettle thermal stance and active ramps; `Equipment` covers persistent/timed gear beyond brewer+filter (Melodrip / booster / Paragon ball) with free-text `scope`.
- **Cooling-Curve Target** (v8.4) — free-text, optional. Set when peak evaluation window IS the strategy (e.g. `40-45°C peak`, `evaluate below 50°C`). Default null = normal cooling progression. Most brews omit; populate on El Paraíso, Garrido Mokka/Mokkita, anaerobic naturals, anoxic naturals, Picolot competition lots, and any coffee where the cooling-window discipline is part of the brief.
- **Temp** — °C, with kettle management note (e.g. `94°C, kettle on base throughout`, `95°C, kettle off base (natural decline)`).
- **Bloom** — weight + technique + duration + (if SWORKS / Switch) valve/lever state.
- **Pour Structure** — one labeled line per pour with CUMULATIVE weight, start time, duration, technique (center / spiral / Melodrip), valve/lever state for SWORKS / Switch, gear position + step scope if Aroma Capture / Equipment active, phase boundaries if Strategy = Hybrid. End with a `Drawdown: [m:ss]` segment or rely on Total Time.
- **Total Time** — e.g. `2:50-3:15`.

---

### Roast level

- **Roast Level** — canonical from `read_canonical("roast-levels")` (8 Agtron-anchored buckets, `Extremely Light` through `Very Dark`). If you only have a marketing tag (e.g. `Nordic Light`, `Specialty Light`), resolve it to the canonical bucket via the registry's alias map.

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
- **Extraction Confirmed** — free-text, **only populate when the planned strategy diverged from what the brew actually validated**. If the planned strategy at Step 1d matched the tasted result, leave this empty. Examples of divergence: planned Balanced Intensity but the cup needed Full Expression; planned Suppression but the cup wanted Balanced + Thermal Staging. If non-divergent, the strategy column on the resolved brew already records what was confirmed; no extra prose is needed.
- **Modifiers Confirmed** — closing line stating which modifiers (if any) were validated, with a one-sentence note on whether each resolved what it was meant to resolve. State `None` explicitly if no modifiers were used (null modifier results are still signal).
- **Process-Dominant** — boolean. `true` if the cup is driven primarily by processing (e.g. yeast-anaerobic naturals, heavy co-ferments) rather than terroir or cultivar; `false` for clean transparency-driven lots. Affects how the brew aggregates on `/processes` vs `/cultivars` pages.
- **Classification** — one-line synthesis (≤200 chars) suitable for a card or list view (e.g. `Mokka Natural confirming Full Expression on Picolot roast — bright green grape and tea-like body, clarity-driven with herbal lift on cooling.`).

## End-of-coffee document review

After producing the resolved brew, assess whether the learnings should propagate back to the substrate via `propose_doc_changes`. Candidate locations to update:

- [docs/brewing/roasters.md](docs/brewing/roasters.md) (new roaster data or strategy tag refinement)
- [brewing-historian/cluster/patterns/by-strategy/<strategy>.md](docs/skills/brewing-historian/cluster/patterns/by-strategy/) — new strategy data points
- [brewing-historian/cluster/patterns/cross-coffee-insights.md](docs/skills/brewing-historian/cluster/patterns/cross-coffee-insights.md) — By Variety / By Process / Cooling Behavior / Office Brewing Notes / Modifier Patterns / Open Questions entries
- [brewing-historian/cluster/patterns/by-cultivar/<cultivar>.md](docs/skills/brewing-historian/cluster/patterns/by-cultivar/) — per-cluster deep dives
- [brewing-historian/cluster/patterns/by-coffee-family/<family>.md](docs/skills/brewing-historian/cluster/patterns/by-coffee-family/) — per-cluster deep dives

Propose specific edits via the `propose_doc_changes` MCP Tool with citations targeting the relevant `target_doc='skills/brewing-historian/cluster/patterns/<file>.md'` + section-anchor, not generic "should update" observations. Two house-style questions belong here, and no brewer-rotation question (a validated chassis is not a habit to correct): did the brew leave the house style, and why; and did a row get applied that is not in the Step 2 table - a recurring exception is the signal for a new adjustment row (route it to the grilling queue, not to the table directly).

## Cross-references

- [SKILL.md](docs/skills/brewing-assistant/SKILL.md) — Brewing Assistant role + Phase 1/2/3 framing summary
- [coordinator/catalog.md § brewing-domain-principles](docs/skills/coordinator/catalog.md) — championship-mode framing + Two-Axis principle
- [coordinator/operator-guide.md](docs/skills/coordinator/operator-guide.md) — canonical lookups + MCP server how-to
- [brewing-equipment-expert/cluster/operational-reference.md](docs/skills/brewing-equipment-expert/cluster/operational-reference.md) — location constraints + the post-rotation brewer tiebreaker + Filter Flow Gap (valve / filter / grinder detail lives in the sibling sworks.md / filters.md / grinder-eg1.md)
- [brewing-historian/cluster/patterns/cross-coffee-insights.md § Process / Variety Signal Table](docs/skills/brewing-historian/cluster/patterns/cross-coffee-insights.md) — Step 1b lookup
- [CONTEXT-brewing.md](CONTEXT-brewing.md) § Latent house style + § Brewer rotation discipline — the chassis + the four rotation triggers ([ADR-0026](docs/adr/0026-latent-house-style-chassis.md))
- [brewing-historian/cluster/patterns/by-strategy/](docs/skills/brewing-historian/cluster/patterns/by-strategy/) — per-strategy substrate
- [wbc-brewing-archivist/cluster/](docs/skills/wbc-brewing-archivist/cluster/) — Step 1d WBC corpus check substrate
- [docs/prompts/start-brew.md](docs/prompts/start-brew.md) — mobile fallback entry (thin pointer to this doc) for Phase 1; Phase 2 iteration is in-thread with no per-iteration prompt
- [docs/prompts/bundled-brewing-completion.md](docs/prompts/bundled-brewing-completion.md) — Phase 3 handoff to Brew Recorder
