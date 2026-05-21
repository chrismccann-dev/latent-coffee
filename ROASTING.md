# Coffee Roasting Master Reference Guide

*Latent Coffee*

*Last updated: 2026-05-13. Version history in `git log`.*

---

## Schema model — roasting redesign in progress

The roasting-side data model is mid-rebuild. See [docs/roasting/redesign.md](docs/roasting/redesign.md) for the series-level scope doc covering 4 lifecycle states (in-inventory / waiting-for-next-roast / waiting-for-next-cupping / resolved), the new `roast_recipes` first-class entity (first-class design intent separate from the as-recorded roast), 16 cross-batch fields on `experiments` covering 4 temporal write moments, MCP-only writes (deprecating the `/add` form path for roasting), and 3 new state-driven page shapes at `/green/[id]`. Sub Pages 6.1 shipped 2026-05-13: schema migration + MCP Tool surface (`push_roast_recipe` + `patch_roast_recipe` added, push/patch_experiment + push/patch_roast + push/patch_roast_learnings extended). Page rebuilds (6.2-6.5) and `/add` deprecation (6.6) follow. Read the redesign doc end-to-end before working on roasting pages or the MCP write surface.

---

## Canonical taxonomy lookups (live via MCP)

The Latent Coffee app validates green bean, roast, and cupping records against canonical registries. The Latent MCP server serves these registries live; **call `read_canonical(axis: "<name>")` to fetch any one** — the axis names below are the inputs:

| Field on green bean / roast / cupping | `read_canonical` axis | Notes |
|---|---|---|
| Variety / Cultivar | `cultivars` | Internal axis name; `docs://taxonomies/varieties.md` is the doc-path equivalent for prose. |
| Origin / Region (Country + Macro Terroir) | `terroirs` | Internal axis name; `docs://taxonomies/regions.md` is the doc-path equivalent. |
| Process (composable: base + fermentation modifier + drying modifier + experimental modifier where applicable) | `processes` | |
| Producer (canonical `Person, Farm` form) | `producers` | |
| Roaster | `roasters` | Latent self-roasted defaults to canonical `Latent`; only relevant when documenting comparison roasts from external roasters. |

**Tool, not URI.** `canonicals://{axis}` URIs ALSO exist as MCP Resources, but two gotchas: (1) many MCP clients (claude.ai mobile in particular) don't enumerate URI templates in the resource list, and (2) `read_doc(uri="canonicals://...")` returns "Unknown doc URI" because `read_doc` only handles `docs://` URIs. **Always use the `read_canonical(axis)` Tool**; it serves the same content and works on every client. The catalog of axes is at `list_canonicals()`.

**Lookup discipline.** When populating a field on a green bean intake or roast / cupping record:

1. Call `read_canonical(axis: "<name>")` for the axis. If the value matches a canonical name (or an alias that resolves to canonical), use the canonical form.
2. If it does not match canonically but a close match exists (e.g. `Geisha` → `Gesha`, `Anaerobic Dry Process` → `Natural` + fermentation modifier `Anaerobic` + qualifier `Anoxic`), use the canonical and note the alias resolution.
3. If nothing resolves, write the best guess and flag it as `(NET-NEW)`. The sync step surfaces this for a deliberate canonical-registry edit.

Drift is caught at sync time, not after.

## Working with the Latent MCP server

A few operational notes for fetching MCP Resources and calling Tools via this Claude project:

- **Tool search ranking is opaque.** If a Tool you expect (e.g. `push_roast`, `push_cupping`, `push_experiment`, `push_roast_learnings`, `pull_roest_log`, `push_roast_profile`, `push_inventory`, `propose_doc_changes`) does not surface on the first `tool_search`, retry with broader search terms before assuming the Tool isn't loaded. The MCP server has 32 Tools live; if `push_roast` returns nothing, try "roast", "push", or "latent" before concluding it's missing.
- **When pulling Roest logs, call `list_roest_logs` first.** Don't try to extrapolate a `log_id` from sequence patterns - the Roest API generates IDs that aren't predictable from batch numbers. `list_roest_logs` returns a fresh batch_url + log_id pair for each batch in the recent inventory; pass that into `pull_roest_log` directly.
- **For closed-bean full fills, call `get_green_bean` BEFORE `push_green_bean`.** A defensive lookup that avoids the UPSERT path entirely when the bean is already known. Faster, less surprising, no risk of clobbering an existing record by accident.
- **Re-fetch the schema before claiming a field is missing.** The deployed Tool manifest may be fresher than the model's session memory. If a field on `push_roast` or another Tool seems to have changed shape, call the Tool's introspection (or read the Tool's input_schema directly) before reporting it as missing.
- **After a code merge, wait for Vercel deploy and start a fresh conversation.** New MCP Tools and updated schemas propagate via Vercel's auto-deploy (~30-60 seconds typical). The claude.ai conversation's tool manifest is cached at conversation start; a fresh conversation picks up the new manifest. Reusing an old conversation after a server-side change can produce stale-tool errors that look like real bugs but are cache propagation issues.

For brewing-side context (extraction strategies, modifier framework, brewer / filter canonicals), see [BREWING.md](BREWING.md). The Roast-to-Brew Translation section below cross-references BREWING.md's 6+3 framework (6 extraction strategies + 3 modifiers).

For WBC-derived ideas / hypotheses on the roasting and sourcing sides, see [docs/skills/wbc-roasting-archivist/cluster/wbc-roasting.md](docs/skills/wbc-roasting-archivist/cluster/wbc-roasting.md) (lessons + Roest L200 hypotheses + blending experiment protocols + structured rest-curve protocol) and [docs/skills/wbc-roasting-archivist/cluster/sourcing/strategy.md](docs/skills/wbc-roasting-archivist/cluster/sourcing/strategy.md) (sourcing strategy + tier framing + current Latent inventory mapped to portfolio lanes). Both are open-ideas docs, not recipe lookups — consult at V1 design time and at green-shopping decision time respectively.

---

# How to Use This Document

I am roasting for myself only — I control the full chain from green bean sourcing through roasting to brewing and end cup. I am not roasting for customers, consistency, or broad appeal.

I am treating this like preparation for competition-level coffee (Brewers Cup / Roasting Championship standard). The goal is not to produce one universally "best" roast style — it is to build a repeatable, systematic methodology for understanding each coffee as a unique material, identifying the roast parameters that maximize its potential, and producing a reference roast that can be brewed with precision and confidence.

Different coffees have different ideal expressions. A washed Sudan Rume wants jasmine, bergamot, and stone fruit clarity. A natural from the same farm wants lemongrass and ginger integration. An XO-fermented lot wants caramelized pineapple, lemongrass tea, and integrated fermentation warmth. I am not chasing one ideal — I am building the skills and system to find the ideal for each individual coffee I source.

Every coffee is an opportunity to learn something generalizable, not just to make a good cup.

claude.ai is the primary write surface — Per-coffee threads in claude.ai run the iteration loop (intake → V1 design → roast → cupping → V2 design → ...) using the operational prompts in `docs/prompts/`. Each step syncs to the app via MCP Tools as the work happens. The Standard Workflow + the per-step protocols below are what claude.ai consults during each thread.

---

# Roasting Philosophy

A successful roast is not the loudest or sweetest cup at first sip. It is a roast that improves as it cools, responds positively to small brewing changes, and keeps the brewing layer's full leverage available.

Because I control both ends — roast and brew — I can express the coffee on whichever layer fits it. A loud roast (Mandela XO) can be controlled with a heavy-suppression brew. A restrained roast can be pushed with Full Expression. The goal is **optionality**: the roast preserves the coffee's expressive range so the brew has maximum leverage to land the cup I want.

The roasting question is less "how should this taste?" and more "what range am I keeping available?" A narrow-range roast forces a narrow-range brew. A wide-range roast lets the brew system carry strategic weight.

I like coffees roasted in the style of Moonwake, Substance, Sey, Picky Chemist, Big Sur — very expressive, very light. But I am not chasing one style of coffee. I like the uniqueness and expressiveness of naturals, washed, honey, co-fermented, from many different origins and varieties. It is an exploratory exercise, not a search for one ideal type.

I roast exclusively in counterflow mode on the Roest L200 Ultra. Counterflow changes heat transfer mechanics enough that conventional roast logic does not map directly. All active experiments and learnings are built around counterflow.

---

# Equipment

- **Roaster:** Roest L200 Ultra (counterflow mode, 100g batches)
- **Color measurement:** Lightcells CM-200 - whole bean Agtron post-roast, ground Agtron pre-brew at Day 7 evaluation
- **Primary evaluation brewer:** xbloom (Brian Quan recipe - consistent, repeatable pourover for all evaluation sessions)
- **Optimized brew setup:** Once a reference roast is identified, treat the roasted bean as you would a purchased bean — route through the full [BREWING.md](BREWING.md) framework (Two-Axis strategy selection, Step 1d Coffee Brief, Equipment Reference rotation). Don't hardcode a single brewer/filter combo. The xbloom evaluation recipe (Brian Quan, used during evaluation cupping) is a different tool from the optimized brew recipe.
- **Grinder:** EG-1 (Weber Workshop) — primary grinder for both evaluation and optimized brew. Full setting taxonomy in [docs/skills/brewing-equipment-expert/cluster/grinder-eg1.md](docs/skills/brewing-equipment-expert/cluster/grinder-eg1.md).

---

# Evaluation Protocol

> **Simplified from prior version:** Day 4 cupping was consistently misleading across multiple lots and multiple experiment sets. The pourover gate is the only signal that matters.

## Current Protocol

**Day 7 pourover - this is the only evaluation gate.**

- Brew method: xbloom (Brian Quan recipe) - consistent across all evaluation sessions
- Dose: 15g per batch
- Up to 3 batches per session (preferred maximum); 4 is possible but not ideal
- Evaluate as full cup sips - no spoon-only tasting. The full cup consistently reveals different character than the spoon and is closer to the real-world experience

**Ground Agtron measurement - required at every evaluation session:**

- Grind 15g from each batch before brewing
- Record WB Agtron (already measured post-roast) and Ground Agtron
- Calculate WB-to-Ground delta - this is a primary internal development signal
- Target delta ≤3 points for well-developed counterflow roasts
- Delta above 5 points: surface development is running ahead of core - profile needs more early energy
- Delta near zero or slightly negative: even development confirmed (this is the target)

**Optimized brew session - one additional session after a winner is identified:**

- Once the Day 7 evaluation identifies a winning batch, run one dedicated optimized brew session using UFO Ceramic + Sibarist Fast Cone
- This session establishes the reference brew recipe for the lot - it is for expression maximization, not evaluation
- The xbloom evaluation recipe and the optimized recipe are different tools for different purposes - do not conflate them

## Why Day 4 Cupping Was Removed

Across CGLE Sudan Rume Hybrid Washed (6 experiment sets, 20+ batches), Day 4 cupping results were wrong or misleading in both directions on multiple occasions:

- Batches that looked clean and expressive at Day 4 showed lactic/cheese defects at Day 7-10 pourover (#110)
- Batches that looked flat and underdeveloped at Day 4 revealed clean, complex character at Day 7-10 pourover (#111)
- The cupping table protocol systematically exaggerated acidity and suppressed delicate aromatic compounds

Day 4 should only be used as a catastrophic defect screen (lactic, phenolic, obvious underdevelopment). Never use Day 4 to rank batches or make advancement decisions.

**For naturals and heavily fermented coffees:** Day 7 is still the correct evaluation window. The operational simplicity of a universal Day 7 protocol for all coffees outweighs any marginal benefit from evaluating naturals a day earlier.

---

# Standard Workflow

> This workflow is fixed and should be followed identically for every roast session, regardless of coffee.

- Turn on Roest
- Pick the profile
- Let it heat up for 10 minutes
- Run a dry roast (no beans) until drum temp reaches 140°C - **this is the thermal reset that standardizes starting conditions for every batch**. Do not skip or shorten it.
- Run BBP (see BBP parameters below)
- Load green beans into hopper when drum reaches **~125°C** - hopper pre-load step
- Charge (drop beans) when drum reads **117°C** - drum coasts naturally from 120°C BBP endpoint to 117°C over ~60-90 seconds while beans are in hopper
- Preheat air temp: set to 210°C - effectively irrelevant given the dry roast thermal reset. Do not adjust as a roasting lever.

## Between Batch Protocol (BBP)

**Current BBP:**

- Fan: 100% at 0:00 → 60% at 0:30 → 40% at 1:00 → 25% at 1:45
- Air temp: 100°C (flat, no changes)
- End condition: drum temp 120°C
- Typical runtime: approximately 2:00-2:30 from 140°C endpoint to 120°C trigger

**Why this shape:** Fan at 100% early removes heat quickly from the 140°C dry roast endpoint. Tapering to 25% by 1:30 allows the drum to coast down gently rather than being blast-cooled through the charge point. Do not adjust air temp during BBP - the fan taper is the correct lever.

## Hopper Pre-Load Timing

> **Load beans at ~125°C.** This was a key discovery from V5 experiments on Sudan Rume Washed. Confirmed empirically: pre-load at 125°C vs. 120°C shifted FC timing by ~35 seconds and FC temp by ~7°C on the same profile.

Loading beans into the hopper at 125°C gives the beans approximately 60-90 seconds of pre-warming in ambient drum heat before charge. This raises the effective thermal mass at the charge event and produces earlier and cooler FC.

This is likely part of the reason a trusted peer (same machine, same mode) consistently achieves TP of 94°C vs. this machine's 78-81°C.

**Important caveat:** Loading too early produces underdevelopment. Batch #134 (hopper loaded at ~125°C on a non-standard session) produced FC at 197.6°C - below the FC floor for Sudan Rume Washed - resulting in a nutty, grassy, flat cup regardless of dev time. The 125°C hopper load with 117°C charge produces FC at approximately 201-205°C on the CF-Light profile. Do not push the hopper pre-load earlier.


## Standard Inlet Curve Template

All V1 roast profiles on this machine use the same seven inlet stage timestamps. Only the inlet temperature values change across experimental batches. Fixing the timestamps reduces design overhead and makes A/B/C batches within an experiment set strictly comparable.

| Timestamp | Phase Role | What This Point Controls |
|---|---|---|
| **00:00** | Charge / start inlet | Starting energy at bean contact. Default 200°C across all experiments unless there is a specific reason to vary. |
| **01:15** | Mid-drying ramp | Drying phase aggressiveness. Earlier and higher here = faster drying, shorter overall roast. |
| **02:30** | Late drying / early Maillard | Transition into Maillard. This is where drying phase ends and browning reactions begin. Typically 5-8°C below peak. |
| **03:15** | **Peak inlet (late Maillard)** | **The energy lever. This is typically the primary variable in V1 experiments. Peak occurs 45-60 seconds before expected FC so the curve can decline into crack.** |
| **04:00** | Into FC (post-peak decline) | RoR momentum into crack. Typically 4-6°C below peak. Steeper decline here compresses dev time; gentler decline extends it. |
| **05:00** | Development phase | Continued decline through dev. Usually 8-12°C below peak. Drop typically fires before this point if managing by temp. |
| **06:00** | Safety floor / overrun buffer | Terminal value if the roast overruns target drop time. Usually 12-16°C below peak. Drop should always fire before this. |

**Design rules for V1 experiments:**

- Hold all seven timestamps constant across A/B/C. Only inlet temperature values change.
- **V1 is a mapping pass** — go wider on the inlet variance across A/B/C than feels comfortable. The point is to bracket the strategy space, not to find the answer in V1. After cupping, V2 narrows toward where the signal is.
- When varying peak inlet, scale the full curve proportionally: the entire shape shifts up or down while preserving relative ratios between stages.
- Later experiment sets (V2, V3) may deliberately shift timestamps to test Maillard length or post-peak decline steepness as isolated variables. When that happens, note the deviation explicitly in the Experiment record.
- Reference for V1 batches A/B/C: 200 → [low/mid/high] → [low/mid/high] → peak → peak-4 → peak-14 → peak-20°C. The low/mid/high row is the only row that changes across batches.

---

# Key Counterflow Observations (Machine-Specific)

## Turning Point (TP)

TP probe reads consistently low (78-81°C) across all sessions regardless of charge temp, BBP fan speed, or charge timing. Peer's machine reads ~94°C under similar conditions. TP is almost certainly a measurement artifact or probe placement difference specific to this unit.

> **Do not use TP as a primary diagnostic signal - it is not actionable on this machine.** Use FC temp and FC timing as the primary drum-state proxies instead.

## FC Temperature Targeting

**Target FC at 202-205°C arriving at ~4:00-4:15.**

For CGLE Sudan Rume Hybrid Washed, the confirmed FC window is 200-205°C:

- Below 200°C (#134, FC 197.6°C): uniformly underdeveloped cup - nutty, grassy, flat - regardless of dev time
- 200-205°C: correct development range - aromatic character fully expresses
- Above 206°C: overdevelopment risk begins - dark tea, flat, loss of top-note lift

This FC floor/ceiling concept is coffee-specific and should be re-established for each new lot through experimentation. Do not assume this window transfers directly.

## Charge Temperature

Charge at 117°C. This is the resolved charge temp for this machine based on extensive empirical testing.

- Charging at 112-113°C: slow Maillard, late FC, potential stalling
- Charging at 117°C with 125°C hopper pre-load: FC timing and phase balance on target
- Charging at 119°C+: risk of over-energized drum, compressed dev time, early overdevelopment

The logged "charge drum temp" in Roest Connect will read 113-116°C due to probe measurement lag after beans begin absorbing heat. This is normal. Your actual charge moment is when the probe reads 117°C.

## Total Roast Time

**Acceptable range: 4:30 – 6:00.** Below 4:30 is almost always underdeveloped (tighter tolerance on the lower end). Between 5:00 and 6:00 can still produce strong cups depending on the coffee. Above 6:30 starts to enter overdevelopment / baked territory regardless of profile. The lower bound is firm; the upper bound has more give.

- Under 4:30: risk of insufficient internal development in counterflow mode regardless of surface Agtron reading
- 4:30 – 6:00: usable window; 4:30-5:00 is the typical target, 5:00-6:00 acceptable when the coffee benefits from longer Maillard
- Over 6:30: Maillard stall, roasty/baked notes, loss of top-note expressiveness

## Session Position Effect

Roast position within a session meaningfully affects FC timing. First roast in a session consistently runs 10-15 seconds slower through Maillard than second or third roast due to accumulated residual drum heat.

**Practical implication:** The first roast of a session is the hardest to replicate precisely. Default behavior: do not compensate - rely on the standard thermal reset protocol (dry roast to 140°C → BBP to 120°C → charge at 117°C) and use drop temp as the primary control across all three batches. The thermal reset protocol standardizes starting drum temp batch-to-batch, so the residual session-position effect is small enough to absorb into the experiment rather than correct for. Fallback: if session-position effects are later shown to materially confound a replication session, loading the first batch at ~128°C (vs. standard 125°C) is the compensation lever - but this introduces a second variable and should not be used during V1 directional probes.

## Drop Temp as the Primary Drop Signal

> **Drop on temp, not on clock.** Drop temp is the primary decision gate on every roast.

**Default mechanism (as of 2026-05-04): bean temp end condition on every profile.** The Roest end condition can be set to one of: total time, dev time, dev %, or **bean temp**. Setting bean temp end condition to your target drop temp (e.g. 208°C) is the cleanest mechanism: the machine auto-drops at the threshold, no manual reaction time, no "did I catch it at 207 or 208" variance.

**Why this is the default now (was previously dev time as safety net + manual drop):**

- Drop temp becomes a first-class controlled variable on the profile, not a manual-execution variable. Reproducibility batch-to-batch tightens.
- For silent-FC coffees (Mandela XO, anaerobic naturals, XO-process), bean temp is the only meaningful drop signal. Setting it on the profile honors that directly instead of relying on the roaster watching the probe.
- Confirmed reliable on the L200 Ultra: end-condition trigger fires effectively instantly at the threshold; bean temp probe reads in 0.1°C increments and clicks up to the target cleanly with no observable lag at the drop-zone range.

**Manual drop is now the fallback:** if you want to override (e.g. roast is running unusually fast and you want to drop earlier than the profile threshold), the Roest UI provides a manual-override button - confirmed working in practice. After overriding, the rest of the roast is on you.

**Drop temp as a per-experiment-batch design variable:** because drop is now profile-set, you can design experiments that deliberately vary drop temp across A/B/C batches (e.g. v3a 208°C / v3b 210°C / v3c 212°C drop sweep on a fixed peak inlet). This was clunky under the manual-drop regime; it's clean under bean temp end condition.

**Compatibility with FC marking:** if a coffee has audible FC, mark it manually for the data record - bean temp end condition still drives the drop. If silent, do not try to mark FC; let the profile end condition do the work and log as manual-no-audio at the drop temp.

**Manual-override exception rules (when to override the BEAN_TEMP end condition):**

The BEAN_TEMP end condition is the default mechanism, but operator override is appropriate in four specific cases. The override button is the right tool when one of these patterns is recognized in real time.

Long-end overrides (drop earlier than the auto-drop would fire):

- **RoR has stalled out and the curve is flattening before the bean temp target is reached.** If RoR drifts to ~0% with bean temp still below the auto-drop threshold and the curve isn't going to recover, holding for the auto-drop just bakes the coffee. Drop manually before the bake propagates. (Example: REDPLUM v1a / batch 180 - FC at 5:07 / 203.6°C, RoR drifted to ~0% by ~5:30, drop fired manually at 5:30 / 203.6°C rather than waiting for the 207°C BEAN_TEMP target.)
- **Past first crack but still well short of the bean temp target with no momentum.** Same shape as the stall case but framed by FC reference rather than RoR shape - if FC has happened, dev is accumulating, and bean temp isn't climbing toward the auto-drop, the dev window is going to overrun before the temp hits.
- **Total roast is approaching the 6:00-6:30 mark.** Hard time ceiling - once total roast is in the 6:00-6:30 window, operator judgment call regardless of where bean temp is. The character of the roast at that point is determined more by the long total time than by the drop temp the auto-drop would fire at.

Short-end overrides (hold past the auto-drop):

- **Bean temp blows past the end condition target but the roast is too short.** Most commonly because peak inlet was too aggressive and bean temp climbed faster than FC kinetics. If FC hasn't happened yet (or just barely happened with no dev accumulation), the auto-drop will fire pre-FC or near-pre-FC and the result is baked, not roasted. Hold past the auto-drop until FC occurs and at least minimal dev accumulates. (Example: REDPLUM v1c / batch 182 - reached 207°C bean temp at 4:15 with no FC heard; should have held past 207°C rather than letting auto-drop fire. Result was Agtron 90.8 / 10.3% weight loss - nearly green-bean territory.)
- **FC arrived hotter than expected and you want a longer development.** Less critical than the short-roast case; this is fine-tuning rather than failure-mode prevention. If FC hits the bean temp target with too little dev accumulation behind it, holding past the auto-drop for 5-10s of additional dev is a defensible operator decision.

The pattern across all five rules: **the BEAN_TEMP auto-drop optimizes for the typical case where FC arrives in window and dev accumulates normally; operator override is for the edge cases where the typical assumptions break down.** When override happens, document end_condition_type as `manual` on the roast row (not `bean_temp`) so the analysis layer can distinguish operator-initiated drops from machine-initiated drops.

## WB-to-Ground Agtron Delta as Development Signal

The delta between whole bean (WB) Agtron and ground Agtron is one of the most sensitive internal development signals available. **Operational vocabulary tracks magnitude, not sign** — the directional interpretation (surface ahead of core vs core ahead of surface) flips by lot family, so the scalar delta is read for magnitude and the surface-vs-interior pattern is named in prose when it matters. See [CONTEXT.md § WB→Gnd Agtron delta](CONTEXT.md) for the canonical definition.

| Magnitude | Reading | Action |
|---|---|---|
| ≤3 points | Even development - surface and core developing at similar rates | Target zone - no profile change needed |
| 4-6 points | Working delta - surface and core out of step | Profile adjustment indicated; direction depends on lot family (see below) |
| >7 points | Wide delta - significant surface-to-core imbalance | One layer's character dominates; the other is suppressed |

**Directional interpretation by lot family.** The sign of the delta carries different meanings depending on whether fermentation cellulose is modifying the bean's outer-layer thermal behavior:

- **Conventional case (washed / no fermentation insulation)** — Ground typically reads lighter than WB (positive delta in the WB-minus-Ground convention). Surface developed ahead of the less-developed interior; the larger the delta, the more the core stalled relative to the surface. Sudan Rume Hybrid Washed sits here — winning pourover batch (#119, delta 1.0) had the tightest delta in the experiment run.
- **Heavy-ferment / fruit-layer case (anaerobic naturals, XO ferments, fruit-layer naturals)** — WB often reads lighter than Ground (negative delta in the same convention). Fermentation cellulose insulates the surface, so the interior actually develops more uniformly than the surface implies. Mandela XO #139 (WB 76 / Ground 72.4) is the case study; CGLE Sudan Rume Natural V1's 7-11-point deltas reflect the fruit layer holding the surface back rather than the core stalling.

**Operational implication.** Read the magnitude against the lot's closest anchor profile (Sudan Rume Washed CF-Light #133 = 1.0 for the washed family; Mandela XO #139 = 3.6 for the heavy-ferment family) rather than against a universal threshold. A 5-point delta on a washed lot is a different signal than a 5-point delta on an anaerobic natural — the first is core lag, the second is fermentation-layer thermal insulation working as expected. The shrinking-delta convergence signal (delta tightening across successive V-sets) is reliable in both cases.

---

# Fan Strategy (Counterflow - Shaped Curves Required)

Flat fan is a blunt instrument in counterflow mode. Fan speed controls convective heat transfer alongside inlet temp. A shaped fan curve gives a second axis of control and meaningfully affects how the Maillard and development phases behave.

> **All profiles should use a shaped fan curve, not flat fan.**

## General Fan Framework

- **Drying phase** (charge through yellow): 78-82% - supports moisture removal without over-driving bean temp
- **Maillard phase** (yellow through FC): step down to 63-70% - slows convective heat transfer, extends the phase
- **Development phase** (FC through drop): gentle step back up to 70-75% - maintains momentum through crack without spiking RoR

## Fan Curves by Coffee Type

- Washed / higher density / higher moisture: Maillard floor 65-70%
- Natural / lower density / lower moisture: Maillard floor 63-67%
- Heavy fermentation / XO process: Maillard floor 63-65%

## Current Reference Fan Curves

| Profile | Fan Curve |
|---|---|
| **Sudan Rume Washed (CF-Light - confirmed)** | 80% at 0:00 → 70% at 1:45 → 65% at 2:30 → 72% at 4:15 → 75% at 5:30 |
| **Sudan Rume Natural (working hypothesis, V2 not confirmed)** | 80% at 0:00 → 68% at 1:45 → 63% at 2:30 → 70% at 4:15 → 73% at 5:30 |
| **Mandela XO (confirmed - Batch 139 reference roast)** | 80% at 0:00 → 68% at 1:45 → 63% at 2:30 → 70% at 4:15 → 73% at 5:30 |

Fan curve changes count as a changed variable and should be isolated in experiment design.

---

# Naturals - Roasting Framework

Use the washed profile as the starting point. Lower inlet temp for the early stages (gentler start). Taper heat away earlier. At 100g batch size, exothermic runaway is not a meaningful risk. Primary failure mode for naturals is **overdevelopment** (collapses fruit/ferment complexity), not underdevelopment.

**Key learning from Sudan Rume Natural V1:** This specific natural (791 g/L density, 10.3% moisture) required more early energy than a typical natural because the dried fruit layer provided significant thermal insulation not captured by the green specs. 242°C peak inlet was insufficient. 247°C brought FC timing into range. Do not assume "natural = less heat" applies universally - always start from the washed profile and let FC timing tell you whether to add or reduce energy.

> **Drop temp discipline is the most critical natural-specific constraint.** For naturals, drop on temp with a strict ceiling - do not wait for dev time. Overdevelopment suppresses fruit/ferment character and produces dark tea, flat cups with no attack.

---

# Honey Process - Roast Direction Fork

**Placeholder framework.** No resolved honey lots in the archive yet. Currently the only honey lot in inventory is the **Cruz Loma TM Honey one-shot** (Taza Dorada 2024 #15), queued behind the Rancho Tio Emilio Typica Mejorado Washed one-shot. This section is the starting framework for that roast.

Honey processing produces a wide expression range depending on mucilage retention, drying speed, and fermentation length. Unlike washed (where the cup target is mostly clarity) or natural (where the cup target is mostly fruit/sweetness), honey is a **fork**: the same green can legitimately be roasted toward either expression. From the [Yunnan livestream extraction (Dongzhe, 2026-05-17)](docs/roasting/dongzhe-livestream-2026-05.md), the fork is explicit:

- **Roast toward washed** if the cup target is clarity / florals / acidity. Faster profile. Compress Maillard. Avoid late development. Use the washed anchor energy envelope.
- **Roast toward natural** if the cup target is sweetness / body / fruit. Slower profile. Slightly more Maillard time. Drop discipline still strict but with a touch more dev tolerance than a fruit-forward natural. Use the natural anchor with a gentler taper than a true natural.
- **Want both characters?** Run two V1 batches, one compressed and one stretched. The fork decision precedes anchor selection.

**Roast-direction decision precedes anchor selection.** In Step 3 of the New Coffee Onboarding Protocol, the standard flow is process → variety match → energy adjustment. For honey, insert one extra question first: *which side of the honey character is the target?* The answer determines whether the anchor is the closest resolved washed lot or the closest resolved natural lot. Without that decision, the anchor logic is ambiguous.

**Operational steps for the first honey lot (Cruz Loma TM Honey):**

- Read producer notes verbatim before V1 design. If they emphasize florals / citrus / clean acidity → roast-toward-washed. If they emphasize stone fruit / honey / brown sugar / body → roast-toward-natural. If notes split → run both directions in V1.
- Cruz Loma TM is a Typica Mejorado at 1,800m. Same variety as the Rancho Tio washed one-shot (1,300m). Use the FULL #133 anchor energy without the low-altitude hedge per the Rancho Tio learning: 1,300m at 243°C peak underdeveloped; 1,800m honey should sit closer to anchor.
- Single-batch (one-shot lot, ~100-120g, no iteration possible). The roast-direction choice IS the experiment. Document the choice and reasoning before the roast - per `one-shot.md`, the carry-forward language must be prefixed "Low confidence - N=1."

Cup outcome from the first lot will replace this section's hypothesis prose with lot-specific knowledge.

---

# Data Capture Per Step

All roasting data flows into the app via MCP Tools - the previous Archive Spreadsheet workflow has been retired. The roasting workflow is driven by 4 lifecycle-mapped operational prompts in `docs/prompts/`, each mapped 1:1 to a lifecycle-state transition. Re-entry into the loop happens at `log-roast.md` ⇄ `log-cupping.md` until a reference roast is declared; `start-lot.md` runs once at intake; `close-lot.md` runs once at close-out.

| Lifecycle transition | Prompt | MCP Tools called |
|---|---|---|
| In inventory → Waiting for next roast (V1 design at intake, or any later V-set design via `log-cupping.md`) | `start-lot.md` | `push_green_bean` + `push_inventory` + `push_experiment` (V_n frame) + `push_roast_recipe` × N (design intent per slot) + `push_roast_profile` × N (Roest tablet) + `propose_doc_changes` (Active Lots) |
| Waiting for next roast → Waiting for next cupping (roasts pushed, prep cupping table) | `log-roast.md` | `pull_roest_log` × N + `push_roast` × N (each linked to its `recipe_id`) + `patch_roast_recipe` (Roest linkage) + `patch_experiment` (batch_ids + observed_outcome_* roast layer + delta_from_roast_* + updated_cup_prediction_* + taste_for_*) + optional `propose_doc_changes` (mid-iteration) |
| Waiting for next cupping → Waiting for next roast (loop continues, V_(n+1) designed) OR Resolved-pending | `log-cupping.md` | `push_cupping` × N + `patch_experiment` (delta_from_cup_* + observed_outcome_* cup layer + winner / leading slot + key_insight) + (Path B) `push_experiment` (V_(n+1) frame) + `push_roast_recipe` × N + `push_roast_profile` × N + optional `propose_doc_changes` |
| Resolved-pending → Resolved (lot close-out) | `close-lot.md` | `patch_roast` (`is_reference: true` on the reference roast) + `push_roast_learnings` + `push_brew` (SR reference brew) + `propose_doc_changes` (close-out narrative) + `patch_inventory` (Roest archive) |

**One-shot lots** (`green_beans.is_one_shot=true`, single-batch samples ~100-120g, no iteration possible) use a separate 2-prompt pipeline that bundles intake / design / roast / cupping into one prompt and close-out into a second:

| Lifecycle transition | Prompt | MCP Tools called |
|---|---|---|
| In inventory → Waiting for next roast → Waiting for next cupping → Resolved-pending (intake + tolerance-anchored design + roast + Day 7 cupping, single batch) | `one-shot.md` | `push_green_bean(is_one_shot:true)` + `push_inventory` + carry-forward search across similar prior lots + `push_experiment` (V1 frame, batch_ids cardinality 1) + `push_roast_recipe` × 1 + `push_roast_profile` × 1 + `push_roast` (linked to recipe_id) + `patch_experiment` (delta_from_roast_a + updated_cup_prediction_a + taste_for_a) + `push_cupping` + `patch_experiment` (delta_from_cup_a + winner + key_insight + Outcome A/B verdict) |
| Resolved-pending → Resolved (one-shot close-out) | `one-shot-closeout.md` | `patch_roast` (`is_reference: true` on Outcome A only) + `push_brew` (optimized brew with what_i_learned compensation reasoning) + `push_roast_learnings` (constrained per migration 054: lever-attribution fields rejected; carry-forward prefixed "Low confidence - N=1") + `propose_doc_changes` (one-shot close-out narrative) + `patch_inventory` (Roest archive) |

The one-shot pipeline's structural difference from V-set: lever-attribution fields on `roast_learnings` (`primary_lever` / `secondary_levers` / `roast_window_width` / `brewing_tolerance` / `what_didnt_move_needle` / `underdevelopment_signal` / `overdevelopment_signal`) MUST be NULL — these require cross-batch evidence which one-shot (N=1) cannot provide. Schema validation in `persistRoastLearnings` rejects populated values with a specific error per field. `terroir_takeaway` (added Sprint 10, migration 060) is NOT in this list — terroir attribution does not require cross-batch evidence and is populatable on one-shot lots. See CONTEXT.md "One-shot lot" + "Tolerance-anchored design" + "Closed without reference" entries.

**Per-table field reference:** the underlying app schema is broader than the original spreadsheet. See [README.md § Database Schema](README.md#database-schema) for current tables; each push Tool's input_schema is the source of truth for required + optional fields. Most fields from the prior Archive Spreadsheet are preserved; new structured columns added since (Roest API integration, V4-doc control signals, fan/inlet curves, OAuth, taxonomy provenance) are documented in migrations 039-046.

**Roest API write integration:** see [docs/features/roest-write-integration.md](docs/features/roest-write-integration.md) for the bidirectional Roest sync (`push_roast_profile` + `push_inventory` + `patch_inventory` push; `pull_roest_log` + `list_roest_inventory` + `list_roest_logs` pull).

**Full sync architecture:** see [SYNC_V2.md](SYNC_V2.md) for the MCP transport, auth, Resources, and Tool catalog.

## Per-Coffee Threads (claude.ai workflow)

One claude.ai thread per green lot, active while that coffee is in rotation. Each thread runs the iteration loop end-to-end (intake → V1 design → roast → cupping → V2 design → ... → reference roast → reference brew → lot close-out), syncing to the app via the MCP Tools above as each step lands. When a coffee is finished and the close-out has fired, the thread is archived in claude.ai and the per-bean knowledge lives in the DB + ROASTING.md cross-coffee insights.

---

# What Good Looks Like For Each Coffee

A coffee is considered **resolved** when all five conditions are met:

- A reference roast is confirmed through Day 7 pourover evaluation AND an optimized brew session that demonstrates the roast's full expression
- The dev range floor and ceiling are defined (not just a best batch, but the boundaries on either side of it)
- The primary lever that mattered most is identified
- Key failure signals (underdevelopment and overdevelopment) are documented for that specific coffee
- A generalizable takeaway is captured in the Overall Lessons sheet

Until all five are true, the coffee is still in active exploration.

---

# What I Am Not Trying To Do

- Produce approachable or forgiving roasts
- Optimize for one brew method only
- Find one perfect cup - the goal is roasts that contain many possible cups
- Rush to a "good enough" result - the process of learning each coffee is the point
- Chase loudness or aggression for its own sake - the target is the best expression of each specific coffee

---

# New Coffee Onboarding Protocol

This section defines the repeatable intake flow for introducing a new green lot, designed to support running multiple experiments in parallel across different coffees. The goal is to compress the time from "I just bought a new green" to "V1 profiles loaded on the machine" while keeping Claude's reasoning well-informed.

## Step 1 - Intake: What to Provide Claude

When onboarding a new coffee, paste the following into a new message:

- Full green bean spec row in the format used by the Roest inventory (Green Lot ID, Coffee Name, Variety, Producer, Region, Origin, Seller/Importer, Process, Moisture %, Density g/L, Purchase Date, and any additional fields like Altitude, Source Type, Price per kg when available). Field set mirrors the Roest new-inventory form rather than a fixed canonical list - do not block onboarding on missing optional fields.
- Producer's published tasting notes verbatim - **REQUIRED**. These are the comparison target for the Day 7 pourover gate and feed into the evaluation session's primary question: does the cup match what the producer described? Do not proceed with V1 design without these notes; if unavailable from the producer, use the seller's cupping notes (e.g. Sweet Maria's full cupping notes).
- Process description if available (fermentation length, drying method, time in drying, any anaerobic, thermal shock, or co-ferment details)
- Whether a reference roast of this same variety/process exists (peer, favorite roaster, competition lot) - if so, what it tasted like
- Learning intent: is this a "find out what this coffee wants" V1 or a "optimize toward a specific expression" V1?

Before scoping V1 batches, optionally cross-check the lot against [docs/skills/wbc-roasting-archivist/cluster/sourcing/strategy.md](docs/skills/wbc-roasting-archivist/cluster/sourcing/strategy.md) — which tier (T1/T2/T3) and portfolio lane the green falls in shapes how much experiment investment is justified, and whether the lot is a candidate for the same-green dev ladder in [docs/skills/wbc-roasting-archivist/cluster/wbc-roasting.md § Blending experiments](docs/skills/wbc-roasting-archivist/cluster/wbc-roasting.md).

## Step 2 - Claude Asks These Three Questions

Before drafting V1, Claude should ask exactly these three questions. These define the scope of V1 and eliminate ambiguity downstream:

- **Experiment structure** - always three batches (v1a/v1b/v1c). Default variable is peak inlet temperature. Skip this question when the user's learning intent is a directional probe (e.g. "broad sense of what direction this coffee wants to go") - peak inlet variation is assumed in that case and asking is redundant. Ask this question only when intent is ambiguous, when the anchor coffee is well-resolved enough that fan curve or Maillard length could legitimately be the primary variable, or when the user signals a specific hypothesis worth isolating.
- **Anchor profile** - which existing profile to start from. Default: closest process match from a resolved or active counterflow lot. See Anchor Profile Selection Logic below.
- **FC ambiguity risk** - how to handle silent-crack risk. Naturals, heavy-ferment processes, and some high-grown washed coffees often produce subtle or silent cracks. Decision: plan for manual mark at 208°C if silent, manage primarily by drop temp.

## Step 3 - Anchor Profile Selection Logic

**Green-physics-first framing.** Read the lot's moisture + density (paired) as a first-order intake signal **alongside** process and terroir/cultivar - not subordinate to process. This is a structural refinement from the [Yunnan livestream extraction (Dongzhe, 2026-05-17)](docs/roasting/dongzhe-livestream-2026-05.md): moisture/density picks the energy envelope, then process decides stretch-vs-compress within that envelope. In practice that means the priority-order list below picks the anchor *coffee* via process + variety, but the starting *energy* on that anchor profile is set by moisture/density per the Green Spec table - so a 9.3% moisture honey and an 11% moisture honey anchor on the same profile but start with different early-energy adjustments. For lots where no process-family match exists (e.g. a Daterra Laurina with unfamiliar bean shape), moisture/density alone is a defensible starting point for energy even when the anchor process is uncertain.

Select the anchor profile in priority order:

- Exact process + variety match from a resolved lot → use reference roast profile directly
- Same process, different variety from a resolved lot → use that lot's reference profile, expect process-driven behavior to transfer but variety character to differ
- Same process from an active (unresolved) lot → use that lot's current working hypothesis as anchor, noting it is not yet confirmed. If multiple active-but-unresolved lots share process characteristics, see tie-breaker logic below.
- Related process (e.g. natural coffee, anchor on closest resolved natural) → adjust starting energy per Green Spec → Starting Hypothesis table in Cross-Coffee Insight Layer
- No close match → anchor on CF-Light (Sudan Rume Washed confirmed) as baseline counterflow profile and scale energy based on density and moisture

**Tie-breaker when multiple active-but-unresolved lots share process characteristics:** Prefer the lot with the most recent empirical data (closest to current machine behavior and current protocol - e.g. a lot whose V2 used the current BBP and 125°C hopper pre-load is a stronger anchor than a lot whose V1 predates those changes). When confidence in the anchor is Low or Medium, the correct response is to widen the v1a/v1b/v1c peak inlet spread rather than to narrow around the anchor. An unresolved anchor with a wide spread is more likely to produce a usable data point than a resolved-looking anchor with a narrow spread that misses the coffee entirely.

**Cross-coffee transfer caveat:** Per the Cross-Coffee Insight Layer guidance, patterns should be treated as hypotheses until confirmed across three or more lots. When anchoring V1 on a related (but not identical) coffee, design V1 to *test* the transfer rather than assume it. The A/B/C spread should be wide enough that if the anchor is wrong, one of the three batches still lands in a usable zone.

## Step 4 - V1 Design Output

Claude produces the following for every new lot V1 design:

- Shared constants table (BBP, charge temp, standard 125°C hopper load for all three batches - no session-position compensation by default, fan curve, drop target, dev time safety net, FC marking protocol, preheat)
- Three inlet profiles (v1a/v1b/v1c), using the Standard Inlet Curve Template timestamps with only the seven inlet values differing across batches. Profile names in the Roest UI follow the format "[Lot short name] v1a", "[Lot short name] v1b", "[Lot short name] v1c" (e.g. "Higuito Anaerobic v1a") so experiment set identity is visible in the machine itself.
- Expected outcome table (FC time/temp, drop temp, dev time, Agtron WB, WB-to-ground delta prediction per batch)
- Failure boundary definitions (specific temperature and time breakpoints that invalidate a batch as a data point)
- Batch ordering recommendation (anchor/midpoint batch first for most consistent session position; outer batches second and third). No session-position compensation applied - thermal reset protocol handles starting drum temp equalization.
- Full pre-filled Experiments sheet record (all columns populated except Observed Outcomes and Winner, which come from the session debrief and Day 7 evaluation). Spreadsheet columns retain A/B/C labels (Observed Outcome A, B, C) for archive-import compatibility - the v1a/v1b/v1c naming lives in the Roest profile names and session notes, while the spreadsheet schema remains unchanged.
- Explicit list of what V1 does NOT answer (reserves V2/V3 scope)

## Naming Conventions

Experiment sets are numbered sequentially per lot (V1, V2, V3…) with three batches per set labeled a/b/c:

- First experiment set: v1a, v1b, v1c
- Second experiment set: v2a, v2b, v2c
- Third experiment set: v3a, v3b, v3c
- Subsequent sets follow the same pattern (v4a/b/c, v5a/b/c, etc.)

**Where each label lives:**

- **Roest profile names** - use the lot short name followed by the batch label (e.g. "Higuito Anaerobic v1a"). This keeps experiment set identity visible on the machine itself and prevents mixing profiles across batches during a session.
- **Session notes and conversation context** - use v1a/v1b/v1c labels throughout session debriefs, Claude conversations, and experiment hypotheses. This matches the Roest profile names and keeps reasoning unambiguous.
- **Spreadsheet columns** - retain A/B/C labels (Observed Outcome A, Observed Outcome B, Observed Outcome C). These column names are import-compatible with the archive app and must not change. The v1a/v1b/v1c labels appear in the Roest Batch #s and Context cells, not as column renames. Translation is implicit: v1a → A, v1b → B, v1c → C.

Claude uses v1a/v1b/v1c in all conversational output (V1 design, session debrief responses, next-experiment hypotheses). When writing to the Experiments sheet, Claude maps v1a → Observed Outcome A, v1b → B, v1c → C without requiring explicit instruction.

## Parallel Experiment Considerations

When running experiments across multiple lots in parallel:

- Session rule: do not mix lots within a single session. Each session targets exactly one lot and one experiment set (A/B/C). This keeps session-position effects and thermal drift isolated to a single coffee.
- Evaluation cadence: Day 7 pourover evaluations can be stacked across lots within a single sitting (up to 3 batches per session, 4 possible but not preferred). Across lots, the xbloom recipe stays identical - only the dose and grind setting need resetting.
- Context handoff: when bootstrapping a new Claude session focused on a specific active lot, paste the lot's Green Beans row, the most recent Experiments record for that lot, and a one-line status ("V2 complete, V3 not yet executed, working hypothesis: [X]"). This is sufficient context for V-next design without re-reading the full master doc.
- Bake-off planning: when two different lots approach reference-roast declaration near the same time, schedule a direct comparison brew session rather than relying on cross-session memory. Day 4 cupping staleness applies equally across lots.

---

# Lot Knowledge

> Lot knowledge is organized as a 5-tier structure — read top-down for what's currently being learned, drill into the archive for full per-lot history.
>
> 1. **Active Lots** — working hypotheses on lots currently in the V1/V2/V3 loop (this section, volatile).
> 2. **Reference Roasts + Brews** — confirmed reference roast + reference brew per closed lot (below, stable).
> 3. **Cross-Coffee Insight Layer** — patterns that have generalized across ≥2 lots ([Roasting Historian cluster](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md); back-compat anchor at `#cross-coffee-insight-layer` below).
> 4. **Open Questions** — research questions to test on future roasts ([Roasting Historian cluster](docs/skills/roasting-historian/cluster/patterns/open-questions.md); back-compat anchor at `#open-questions` below).
> 5. **Archive** — full per-lot prose, experiment history, generalized lessons ([docs/roasting/archive.md](docs/roasting/archive.md)).
>
> For sourcing-tier framing (T1 / T2 / T3 portfolio mapping of every lot below) and the broader "what role does this coffee play" lens, see [docs/skills/wbc-roasting-archivist/cluster/sourcing/strategy.md § Latent inventory mapped to tiers](docs/skills/wbc-roasting-archivist/cluster/sourcing/strategy.md). Refresh that snapshot section on inventory change.

## Active Lots

Per-lot state lives under the lot-id headers below — `propose_doc_changes`
citations should target one lot block (`### LOT-CODE - Description`), not the
whole `## Active Lots` section. One-shot calibration lots that don't fit
the V1/V2/V3 framing live in the sibling [One-Shot Calibrations in Process](#one-shot-calibrations-in-process)
section.

### CGLE-SRUME-NATURAL-2026 - Sudan Rume Natural

- Status: **V5 ROASTS COMPLETE - Day 7 pourover pending (2026-05-19). Close-out pending V5A confirmation.**
- **Reference roast: Batch 169 (V4C)** - confirmed at real pourover (2026-05-11). Pineapple, sweetness, lemongrass, ginger, light brown tea - complex, integrated, complete. WB-to-ground delta 3.1. Profile: 242°C peak, hard post-peak cliff (200→233→242→236→228→222→218°C), bean temp end condition 205°C, total time ~6:00, Agtron WB 76.1/ground 73.0. **is_reference=true patched 2026-05-14.**
- **Confirmed brew recipe (locked):** April Brewer Glass + April Paper, 15g/255g, EG-1 6.3, 92°C, bloom 45g/55s, pour to 155g at 0:55 centered, pour to 255g at 1:45 centered.
- V5 session (2026-05-12): 187 (V5A - exact 169 replica, end condition 205°C, dropped 204.2°C/6:00, FC 5:11/202.5°C, dev 49s, Agtron 78.7 - **primary repeatability test**); 188 (V5B - 207°C end condition, dropped 204.7°C/6:30 total-time ceiling, 207°C never reached, Agtron 70.5 - overdeveloped, 207°C end condition definitively not viable); 189 (V5C - 240°C peak, dropped 202.7°C/6:00 total-time ceiling, 205°C never reached, Agtron 77.8 - 240°C peak definitively confirmed insufficient on this cliff shape, third consecutive session showing same pattern).
- Key protocol confirmations from V5: (1) 242°C peak is the minimum viable peak on this cliff profile - 240°C cannot reach 205°C within 6:00; (2) 207°C end condition is not viable - bean cannot reach it within practical total time; (3) optimal total-time ceiling is 6:15 (not 6:00) to give bean_temp trigger room to fire before the safety net catches it; (4) 240°C peak hypothesis closed - would require a shallower post-peak taper to be viable, not tested.
- **Pending:** Day 7 pourover on 187/188/189 (~2026-05-19). If V5A replicates 169's cup: run closed-bean prompt. If V5A diverges: investigate whether 49s dev (vs 169's unlogged) indicates overdevelopment.

### CGLE-GESHA-CLOUDS-2026 - Gesha Clouds (Forest Coffee, Milton Monroy, Tolima)

- Status: Active - V1 + V2 complete with Day 7 evaluations done. V3 needed; lot not closeable at brewing iteration alone.
- V1 (April 19): batches 161/162/163, peak inlet variation (242/247/252°C). V1 winner: #162 confirmed via Day 7 pourover gate (cupping table picked #163; pourover reversed it). #162 had tightest WB-to-Ground delta (+2.5) despite worst-on-paper roast metrics.
- V2 (May 4): batches 170/171/172, post-peak decline variation (04:00 inlet 240/244/246°C). All three V2 cups read as underdeveloped at Day 7 xbloom_gate. V2 winner at the gate: **#172 (v2c)** - the worst roast metrics produced the most accessible cup (floral, herbal, more acidity, lightest body). v2b worst at the gate; v2a (matched control) did not reproduce #162.
- **Gentle-decline hypothesis REFUTED.** v2b (middle of the spread, the actual hypothesis under test) was the worst V2 cup. Extending post-peak inlet did not translate to cup development. Post-peak decline is the wrong V3 variable.
- **Aggressive-direction reframe (Medium confidence, 2 data points):** The V1 conclusion that v1c was a dead end now looks wrong. v1c won the cupping table; v2c won the xbloom_gate. Both batches had identical 'failures' (drop 209.9°C, silent FC, light Agtron) and both won their respective evaluation rounds. v1c's pushed-pourover failure may have been recipe-dependent (wrong brewing strategy for the batch) rather than roast-dependent. This coffee may want MORE energy, not less - exactly opposite the gentle-decline V2 hypothesis. Confirmation needed via balanced-intensity-pourover round on #172 before designing V3.
- **The 207°C drop ceiling rule may be wrong for this coffee.** Both v1c and v2c hit 209.9°C drops and both won their evaluation rounds. The 207°C ceiling is Sudan-Rume-Washed-derived; Gesha Clouds may want 208-209°C as its actual ceiling. V3 should test 209°C as a deliberate drop target rather than treating it as a breach.
- **Bean-temp end condition lesson holds.** V2 confirmed that dev-time end conditions on silent-FC coffees produce ceiling overshoot. V3 must use bean-temp end condition. Open question: is the bean-temp target 207°C or 209°C?
- V1 brewing diagnosis (still standing): Full Expression / Extraction Push, NOT Suppression. #162 pushed pourover at 5.8 grind / 93°C / 1:15 surfaced apricot/grapefruit/bergamot tea on cooling - closest the lot has come to producer notes (tangerine, rose, kiwi, raspberry, lemongrass).
- Open questions for V3: (1) Does a balanced-intensity-pourover round on #172 confirm the v2c gate win, or reveal it as recipe-dependent (the way v1c failed at pushed pourover)? (2) Is the 209°C drop appropriate for this coffee? (3) Does the V2 baseline drift vs V1 (Agtron range 84-91 → 94-95) reflect green aging, ambient drift, or session-level factors - and how do we control for it? (4) V3 design should include a same-day control batch matching v2c's profile to eliminate session-vs-session drift confound. V3 variable: peak inlet sweep 250-254°C with bean-temp end condition at 209°C, holding fan curve and pre-peak shape from #162.

### COS-HIG-BOR-2026 - Costa Rica Anaerobic Dry Process Higuito

- Status: Active - V1 complete, V2 dual-cupped 2026-05-11 (xbloom_gate + Balanced Intensity real pourover on v2b/v2c), V2 winner is v2b. V3 not yet designed.
- V1 winner: v1c (#159, 251°C peak, drop 208°C). Flavor target: honey mead, Port wine, tobacco, sweet-tart integration, peatiness/whiskey-textural finish.
- V2 WINNER: v2b (#165) - decisive on real pourover. Roast: clean audible FC 3:43/203.3°C, drop 4:17/210°C, dev 34s/13.2%, Maillard 39.3%, WB Agtron 85.5. Cup (Balanced Intensity, Orea Glass + Sibarist FAST Flat, 1:16, 92°C, EG-1 6.5): sweet-honey-mead-tobacco character expresses cleanly, very sweet, high complexity. Only operator complaint: body "feels a little thin" - possible April Brewer follow-up.
- V2 REVERSAL ON REAL POUROVER: xbloom_gate produced no clean winner (v2b strongest hot-warm, v2c strongest cooler-stage staying power). Real pourover REVERSED this - v2b is decisive winner; v2c's xbloom-staying-power reads as "heaviness with discordant tart note" on real pourover. Operator: "165 it is. That is my preferred expression here of the roast."
- V2 batch detail: v2a #164 - audible FC 4:18/209.4°C (first audible FC on this lot), drop 4:31/210.9°C, dev 13s/4.8%, Maillard 50.2%, WB 81.7. Cup: most aggressive, mead-alcoholic intensity. v2b #165 - V2 winner per above. v2c #166 - silent FC, drop 4:16/211.0°C, Maillard 52.7%, WB 83. xbloom_gate read as staying-power-strong but real pourover read as body-weight-too-heavy with discordant tart note.
- KEY V2 FINDING: xbloom_gate has now produced INVERSE-DIRECTION misranking on this lot twice. V1: v1b's lactic note suggested underdevelopment, real pourover proved otherwise. V2: v2c's staying-power suggested winner, real pourover proved otherwise. Pattern: on this lot xbloom (1:17.5/94°C) extracts in a way that misleads ranking between close candidates. Use Balanced Intensity real pourover on top 2 candidates before declaring outcome.
- KEY V2 FINDING: structural cleanliness correlates with cup quality when extraction is properly chosen. v2b's clean structural shape (audible FC at 203.3°C, dev 13.2%, Maillard 39.3%) DID predict the real-pourover winner. The xbloom-only "structural-vs-cup disconnect" was an extraction artifact, not a cup phenomenon.
- KEY V2 FINDING (refined): WB-to-ground delta SIGN matters at xbloom but doesn't predict the real-pourover winner. v2b delta -0.3 = real-pourover winner; v2c delta -1.1 = NOT the real-pourover winner; v2a delta +2.4 = aggressive cup (consistent across both evaluations). Demote sign-of-delta from "primary signal" to "secondary observation worth tracking."
- v1c "winner" profile was NOT cleanly reproducible at v2a (same inlet curve, different FC behavior + higher drop temp). Replication problem still unresolved; deprioritized now that v2b is the better candidate.
- Audible FC unlocked at 251-253°C peak inlet but suppressed at 255°C (v2c silent). Cup outcome confirms audible FC isn't a positive signal on its own - v2c (silent) wasn't the winner but v2b (audible) was. Audible FC tracks WITH the win because it tracks WITH the cleaner structural shape, not because audibility itself is the cause.
- 208°C drop ceiling from V1 confirmed too tight at this peak inlet range. v2b at 210°C drop is the new working drop temp for this coffee.
- V3 hypothesis: anchor on v2b. v3a replicates v2b at 253°C peak / 210°C drop (BEAN_TEMP end condition) to test reproducibility. v3b probes 254°C peak / 210°C drop for body-weight refinement (operator noted v2b body "feels thin"). v3c holds 253°C peak / 211°C drop for marginal dev phase extension. Goal: confirm v2b reference-quality + see if marginal body weight is achievable without losing v2b's cup character. Real pourover on top 2 V3 candidates before declaring reference.

### BRA-FAZENDAUM-WUSHWUSH-NAT-2026 - Fazenda Um Wush Wush Natural (Dark Room Dried)

- Status: Active - V1 cupped 2026-05-15 (Day 11 vs Day 7 target), V2 design BLOCKED on Untold paired roasted reference cup. Strategic role: Gesha-natural floral practice lot before committing V1 on Finca Deborah ($419/kg, deferred).
- Density 809 g/L (high), moisture 9.10% (lowest in archive). Producer notes: mandarin, prune, cacao. Untold paired roasted reference cup AVAILABLE (Tier 2) - NOT YET CUPPED. Untold Stronghold profile (47.7% Maillard) AVAILABLE - Tier 3, directional only.
- V1 batches 173 (245°C peak) / 174 (248°C peak) / 175 (251°C peak). All three breached structural failure boundaries (dev floor, Maillard ceiling, drop ceiling in varying combinations). Roast outcomes: #173 FC 4:51/205.1°C, drop 5:16/206.0°C, dev 25s, Maillard 53.2%, Agtron WB 73.3. #174 FC 4:27/205.6°C, drop 4:50/207.5°C, dev 23s, Maillard 50.3%, Agtron WB 75.6. #175 FC 4:02/204.7°C, drop 4:44/209.0°C, dev 42s, Maillard 43.7%, Agtron WB 76.6.
- V1 leading slot: **v1a (Batch 173)** by Day 11 xbloom_gate pourover (15 days = day 11, xbloom Brian Quan recipe). Explicitly framed by operator as 'best of the worst bunch, not a reference example.' NOT a reference roast candidate.
- V1 cup hierarchy INVERTED structural hierarchy: structurally-worst v1a was preferred (darker black tea + caramel + spice hot; almond + sliced orange + complexity at cool full cup; sweetness hidden), structurally-cleanest v1c was middle (deeper-orange sweet-tart hot; hollow at cool stage), structurally-anchor v1b was worst (flat, smoky, missing complexity). Ground Agtrons 71.8 / 76.4 / 75.1. WB->Ground deltas +1.5 / **-0.8** / +1.5 - sign-inverted delta on v1b (ground LIGHTER than WB) is an unusual signal worth tracking.
- Producer notes (mandarin / prune / cacao) absent across all three cups. Cacao partial-read as caramel/almond on v1a only. Mandarin and prune absent entirely. **NO Gesha-adjacent floral character emerged in any cup** - the strategic premise for Finca Deborah transfer practice is NOT yet earned on this lot.
- Critical V1 architectural finding (carried from log-roast): FC arrives at 204-206°C across all three peak inlet levels. Higher peak pulls FC TIME earlier but does NOT pull FC TEMP lower. Same architectural failure pattern as Sudan Rume Natural V2 reproduced on a different cultivar / different lot / different terroir.
- V2 design BLOCKED on cup-vs-reference calibration. The cup-vs-structure inversion + absent producer-note descriptors mean V1 data alone cannot distinguish: (a) coffee genuinely prefers low-energy long-Maillard (SR Natural V3/V4 architecture transfers despite cultivar difference), OR (b) all three batches reached the wrong region of the response surface and Chris ranked by least-objectionable. Cup the Untold paired roasted reference BEFORE V2 design to resolve which region this coffee actually wants.
- V2 hypothesis paths to evaluate after Untold-reference cupping: (Path 1, higher-information) Lower peak floor across spread (240/242/244°C), hard post-peak cliff, bean-temp end condition - direct SR Natural V3/V4 architectural transfer, accepts Maillard 50%+ and extended total time as deliberate. (Path 2, lower-risk) Hold peak at 245°C, restructure early ramp (00:00 to 01:15) to push FC arrival to 200-202°C - isolates the architectural FC-temp variable. (Path 3, control experiment) Replicate v1a's 245°C peak twice with marginal early-ramp variation to confirm the 'cup-vs-structure inversion' isn't single-batch noise. Path selection contingent on Untold-reference comparison.
- Strategic: Wush Wush V1 cup outcome does NOT support carrying the framework forward to Finca Deborah V1 design yet. Finca Deborah deferral status remains in effect. Wush Wush V2 is the next gate for that question.
- Open questions: (1) Untold paired roasted reference cup vs the three V1 batches - direction calibration. (2) Cup-vs-structure inversion: real signal or preference-among-failures? (3) Sign-inverted WB->Ground delta on v1b - measurement artifact, session-position effect, or real surface-vs-core dynamic? (4) Does dark-room drying preserve aromatics differently than expected? (5) Wush Wush counterflow transferability to Finca Deborah - lower than the inventory doc assumed?

### RWA-NOVA-NAT21-RB-2026 - Bukure Natural Lot 21 (Red Bourbon, Rwanda Northern Province)

- Status: Active - V1 complete (closed at Day 7 pourover 2026-05-11), V2 designed and pushed to Roest tablet, not yet roasted.
- V1 batches 176/177/178 - peak inlet variation 240 / 244 / 248°C, centered on Sudan Rume Natural V3 winner direction. Standard SR Natural fan curve held constant.
- **V1 leading slot: v1b (Batch 177, 244°C peak)** - confirmed at Day 7 xbloom-gate pourover (2026-05-11). Chris's verdict: "the most balanced integrated cup." Won on balance/integration alone among three over-dark candidates, NOT because 244°C is correct for this coffee. v1a (#176) cupped second - most aromatically complex (fruity + nutty + chocolatey) but darker body. v1c (#178) cupped last - flavors didn't integrate; ceiling-breach overdevelopment.
- V1 cup signal across all three slots: "darker than what it says" (Chris's exact phrase). Producer notes (cranberry, honeycomb, lingonberry) failed to surface substantially on any slot. Only black tea + a hint of caramel-style sweetness landed; the bright/berry side stayed buried. Suggests the lot wants STILL LOWER energy than the V1 spread covered.
- WB-to-Ground delta surprise: v1a +3.4 / v1b +6.6 / v1c +1.0 - the LEADING slot had the WIDEST delta, and the tightest-delta slot (v1c at +1.0, in V4 target zone) cupped as the LOSER. Working hypothesis: v1c's drop-ceiling breach mechanically drove the core to catch up to the surface via overdevelopment, producing a tight delta that masks an overdeveloped cup rather than signaling good roast structure. This violates the CCIL hypothesis "tight delta correlates with cup quality" - flag as Medium-confidence violation worth watching, not yet generalizable.
- V1 key insight (Medium confidence): the Sudan Rume Natural V3 lower-energy direction does NOT transfer cleanly to East African Red Bourbon natural at high altitude in the 240-248°C peak band. The lot wants still lower energy than the SR Natural anchor predicted (which was already 238-242°C centered).
- **V2 design** (pushed to Roest 2026-05-15, batches not yet roasted): shift the spread DOWN 6°C. Levels 234 / 238 / 242°C peak inlet. v2a probes the energy floor (6°C below v1a). v2b sits at 238°C (overlap with SR Natural V3 winner band lower edge). v2c at 242°C is the upper-bound continuity check vs v1b at 244°C. **Bean temp end condition set to 207°C on all three** - structural change from V1 to prevent session-position acceleration from breaching the drop ceiling (V1 v1c failure mode). Fan curve held constant.
- Brew direction not yet brew-confirmed - V1 was evaluated only at xbloom Brian Quan gate. Before locking V3 design after V2 cupping, worth running v1b (or whichever V2 slot leads) at Balanced Intensity recipe (flat-bottom brewer, 92-93°C, 1:16-1:17) to confirm whether "darker than what it says" is roast-side ceiling or xbloom-extraction-amplifying-darkness. Mirrors the Costa Rica Higuito V1 finding.
- Lot budget: 907g - 300g (V1) - 300g (V2) = 307g remaining. ~3 batches headroom for V3 plus optimized brew session if reference roast lands cleanly. No margin beyond that.
- Registry update: Rwanda Northern Province / Virunga foothills now canonical (terroir_provenance=canonical as of 2026-05-06). Producer Agnes Mukamushinja & Felix Hitayezu / Nova Washing Station still producer_override (tier-3, awaiting registry research).

### REDPLUM-CAS-2026 - El Paraiso Red Plum Castillo (Diego Samuel Bermúdez, Cauca, Colombia)

- Status: Active - V1 closed at Day 9 pourover 2026-05-17 (rest_days 9, two days past V4 Day 7 standard); V2 designed and pushed to Roest 2026-05-17 as `v2-moisture-aware-shape` experiment.
- Anchor: SR Washed CF-Light #133 reference profile. Density 802 g/L matches anchor range. Off-anchor variables: 11.2% moisture (highest in measured set), pulp-fermentation washed process variant, different farm/producer. Anchor transferred cleanly to this lot at V1 (Medium-High confidence post-cupping).
- V1 batches 180/181/182 - peak inlet spread 240 / 245 / 250°C, full curve scaled proportionally from #133 anchor. Standard fan curve held constant (80->68->63->70->73%). RPM flat 65. End condition BEAN_TEMP @ 207°C auto-drop.
- V1 roast outcomes: #180 (v1a, 240°C peak): FC 05:07 / 203.6°C, drop 05:30 / 203.6°C (operator stall-prevention), dev 39s, Agtron WB 77.4. #181 (v1b, 245°C peak): FC 04:34 / 205.4°C, drop 05:08 / 207.0°C, dev 34s, Agtron WB 80.9. #182 (v1c, 250°C peak): NO FC RECORDED, drop 04:15 / 207.0°C, dev N/A, Agtron WB 90.8 (ceiling-collision failure - bean temp reached 207°C before FC could occur).
- **V1 Day 9 pourover cuppings (xbloom_gate, 2026-05-17, all WB/Ground deltas tracked):** **#180** - aroma fruit + dark black tea; flavor sweet plum/cherry (2 of 5 producer notes); body very dark / tannic / black-tea (the cup's defining feature, also its weakness); WB->Ground delta 2.6 (V4 target met). **#181** - LEADING SLOT V1. Aroma strong intensity (blow-off-the-table); flavor plum/cherry/raspberry (3 of 5 producer notes); body lighter than #180 but trends hollow on cool stage; WB->Ground delta 5.0 (widest of the three, outside-vs-inside development differential). **#182** - confirms ceiling-collision failure mode; aromatic top notes present (fruit/sweet attack) but body is nutty/grassy/raw/underdeveloped; WB->Ground delta 1.9 (artifactually tight, bean barely developed); not preferred.
- V1 key insight (Medium-High confidence): peak inlet temperature is the primary lever for this lot, but the cup-quality function isn't monotonic in peak - it's "did the roast geometry land FC + ~35s dev inside the 207°C ceiling without operator intervention." v1b nailed it; v1a's stall-prevention drop produced LONGER total time which amplified body weight (total time is a stronger body lever than peak inlet on this lot); v1c never landed FC. The SR Washed CF-Light #133 anchor transfers cleanly with minor moisture-aware shape adjustment - no anchor-level rethink needed.
- V1 open questions feeding V2: (1) Can v1b's body weight be lightened (toward less dark) without trading off into hollow-on-cool? (2) Is the WB->Ground delta of 5.0 on v1b a real signal or measurement artifact of high FC temp? (3) Would v1c at the same 250°C peak with operator hold-past-auto-drop produce a usable cup, or is the kinetics-vs-thermal-mass mismatch fundamental? (Low priority - V2 avoids 250°C regardless.)
- **V2 design (experiment_pk ac6411d4-9d09-4003-bdc9-66a6d06dd345, batches not yet roasted):** Narrower peak spread shifted cooler - 243 / 245 / 247°C (±2°C from v1b leading slot). PRIMARY VARIABLE: moisture-aware inlet shape - 01:15 bumped from 237°C to 240°C across all three slots (front-load drying-phase energy to pull FC into 4:15-4:25 from v1b's 4:34); 02:30 dropped from 245°C (at peak in V1) to 240°C (canonical peak-minus-5°C per Standard Inlet Curve Template). v2a (243°C peak, parent_recipe v1a): cool-edge probe with shape change; expect lighter body than v1a, cleaner fruit. v2b (245°C peak, parent_recipe v1b, CENTERLINE): direct v1b comparison with shape change; expect v1b's fruit balance with cleaner body. v2c (247°C peak, parent_recipe v1c): warm-edge probe; CRITICAL drop rule: short-end manual hold if 207°C reached pre-FC (the v1c lesson). All three pushed to Roest (profile_ids 515749/515750/515751).
- Brew direction hypothesis at Day 7: Stone fruit + raspberry profile - Full Expression direction. Plan UFO + Sibarist, 91°C, 1:14, EG-1 6.0 for optimized brew session post-V2. Note: operator mentioned wanting to test a simulated pourover variant on the v1b sample (Batch 181) - run before V2 cup if green permits, log as a separate `real_pourover` recipe_variant against the same v1b roast_id.

## One-Shot Calibrations in Process

One-shot calibration lots have a different shape than the V1/V2/V3 iteration
arc - they don't carry a "next-session hypothesis" because the lot is being
roasted to answer a single point question (machine calibration, single-bean
sanity check, bean-system comparison test). When a one-shot is in process,
add a `### LOT-CODE - Description` block here with: status (in-process /
awaiting cupping), single-batch parameters, and the specific question
the calibration was built to answer. On close-out, move to [Reference
Roasts + Brews (Closed Lots)](#reference-roasts--brews-closed-lots) like any
other lot.

### ECU-TD24-RANCHOTIO-TM-WASHED - Rancho Tio Emilio Typica Mejorado Washed (Taza Dorada 2024 #6)

- Status: **CLOSED 2026-05-11.** Moved to [Reference Roasts + Brews (Closed Lots)](#reference-roasts--brews-closed-lots) per one-shot close-out protocol. See ECU-TD24-RANCHOTIO-TM-WASHED entry there for reference brew recipe (Clarity-First, NOT the V1 design's planned recipe) and lot lessons.

## Reference Roasts + Brews (Closed Lots)

Confirmed reference roast + reference brew per closed lot. Full per-lot prose (experiment history, generalized lessons, process learnings) lives in [docs/roasting/archive.md](docs/roasting/archive.md); the table below is the at-a-glance summary plus the canonical reference brew recipe for each lot where one was established.

### CGLE-MANDELA-XO-2026 - Mandela XO Extended Fermentation

- **Reference roast:** Batch #139
- **Reference brew:** April Brewer Glass + April Brewer Paper, EG-1 6.4, 15g/255g, 93°C, bloom 50g/40s, pour to 160g at 0:50 (15s pour, 25s wait), pour to 255g at 1:30 (15s pour). Target brew time 2:45-3:15. Best at warm-to-cool stage (50-45°C); rounds out as it cools. **Critical:** do NOT use UFO + fast cone for this coffee — flat-bottom geometry of April Brewer is essential to integrate the fermentation character.
- **Archive:** [archive.md § CGLE-MANDELA-XO-2026](docs/roasting/archive.md#cgle-mandela-xo-2026---mandela-variety-xo-extended-fermentation)

### CGLE-SRUME-WASHED-2026 - Sudan Rume Hybrid Washed

- **Reference roast:** Batch #133 (confirmed); Batch #148 (closest replication)
- **Reference brew:** UFO Ceramic + Sibarist Fast Cone, EG-1 6.0, 15g/210g (1:14 ratio), 91°C, Melodrip throughout, bloom 45g/45s, slow pour to 130g, slow pour to 210g. Target brew time 2:45-3:15. Best at warm-to-cool stage — opens significantly as it cools. Key signal: candied apricot + bergamot + jasmine + lemon + integrated stone fruit tartness emerges at cool stage. If muted at 91°C, go 1 click finer on grind (don't increase temp).
- **Archive:** [archive.md § CGLE-SRUME-WASHED-2026](docs/roasting/archive.md#cgle-srume-washed-2026---sudan-rume-hybrid-washed)

### ECU-TD24-RANCHOTIO-TM-WASHED - Rancho Tio Emilio Typica Mejorado Washed (Taza Dorada 2024 #6)

- **Reference roast:** Batch #179 (only batch - one-shot calibration lot). NOT worth repeating at identical parameters; if re-roasted: raise peak inlet to 245-247°C (drop the low-altitude hedge) and switch hopper pre-load to 125°C standard (not 120°C archive-match).
- **Reference brew:** UFO Ceramic + Sibarist UFO FAST Cone, EG-1 6.5, 15g/240g (1:16 ratio), 92°C, Melodrip throughout, bloom 45g over 15s with 60s total wait (longer bloom per Typica Mejorado archive recommendation), Pour 1 to 145g at 1:00, Pour 2 to 240g at 1:45. Target drawdown 3:00-3:15. Best at warm-to-cool stage 51-53°C (atypically warm peak window for Clarity-First - see Rest Behavior Patterns hypothesis below). Cup recovers 5 of 8 producer descriptors: mandarin, faint pineapple, Earl Grey, vanilla, nougat. Honey, passion fruit, white grape absent - roast's structural ceiling (Maillard 49.4%, weight loss 11.89%) sets the limit on which compounds were available to extract.
- **Key lesson:** The V1 design inherited the brew recipe lineage from the #133 Sudan Rume Washed anchor (1:14 / EG-1 6.0 / 91°C / Extraction Push direction). The lineage was wrong for THIS coffee - variety signal (Typica Mejorado -> Clarity-First per the brewing reference) dominated over anchor-roast lineage. The first brew at the planned recipe produced a discordant cup; the Clarity-First pivot (1:16 / 6.5 / 92°C) recovered cup integrity. **Roast anchor profile transferability does NOT imply brew anchor transferability** - re-evaluate brew strategy at variety level, not at anchor-roast level. Brew-Reveals-Roast Principle extension: applies in both directions, including when the roast is genuinely underdeveloped.
- **Closing observations:** First Ecuadorian coffee in counterflow archive; first Typica Mejorado / Mejorado variety; first 1,300m washed data point. Brewing strategy correctly applied recovered an acceptable cup despite roast structural underdevelopment.

### Legacy and incomplete lots

| Lot ID | Variety / Process | Reference Roast | Reference Brew | Archive |
|---|---|---|---|---|
| GUA-SOC-JAVA-2024 | Guatemala (legacy, pre-counterflow) | Batch 88 | UFO Ceramic + Sibarist UFO Fast Cone, EG-1 6.5, 15g/255g, 94°C, Melodrip | [archive.md](docs/roasting/archive.md#gua-soc-java-2024) |
| GUA-LIB-ADC-2024 | Guatemala (legacy, pre-counterflow) | Batch 94 | Recipe parameters not preserved | [archive.md](docs/roasting/archive.md#gua-lib-adc-2024) |
| GV-OMA-25-035 | Gesha Village Oma (counterflow incomplete — green exhausted before resolution) | Batch 52 (pre-counterflow) | Counterflow chapter unresolved | [archive.md](docs/roasting/archive.md#gv-oma-25-035---gesha-village-oma) |

> Cross-lot patterns that have generalized are surfaced in the [Roasting Historian cluster § Cross-Coffee Insight Layer](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md). Open research questions on these lots live in [Roasting Historian cluster § Open Questions](docs/skills/roasting-historian/cluster/patterns/open-questions.md).

---

# Reference Roast Target (Peer's Batch #249 - "IT simple slow 100g")

The primary external reference for style and structure throughout Sudan Rume Washed experiments.

| Parameter | Value |
|---|---|
| FC | 3:55 / 200.3°C |
| Drop | 205°C |
| Dev | 36s / 13.3% DTR |
| TP | 94.3°C |
| Charge | 112.2°C |
| Maillard | 39.1% |
| Drying | 47.6% |

**Machine differences confirmed:** Peer's TP is 94.3°C vs. this machine's 78-81°C. Peer's charge temp is 112.2°C vs. this machine's resolved 117°C. These differences are machine-specific and do not represent different roast philosophies - directional principles transfer, specific numbers do not.

**Process caveat:** Peer's #249 is a **washed** coffee. The profile shape is a great washed-counterflow benchmark to keep in mind, but naturals, anaerobics, processed lots, and high-moisture greens all behave differently. Don't transfer the inlet shape directly to non-washed lots — use it as a reference for what good development cadence looks like on washed coffee, then adapt the inlet curve per the coffee's process + green spec.

---

# Peer Insights - Counterflow L200 Ultra (Same Machine, Same Mode)

Source: A peer (Dongzhe) who roasts exclusively on the Roest L200 Ultra in counterflow mode. High weight on directional principles; specific numbers don't transfer due to confirmed machine-level thermal differences (his TP ~94°C vs. my ~78-81°C, his charge 112.2°C vs. my resolved 117°C).

**Long-form decision tree captured 2026-05-17 from a Yunnan-Hatchi livestream** - see [docs/roasting/dongzhe-livestream-2026-05.md](docs/roasting/dongzhe-livestream-2026-05.md) for the full extraction (three coffees roasted, his intake hierarchy, the five operational deltas folded back into this doc, and caveats about his single-batch methodology + darker cup target). Key structural framing from that capture: **green physics first, process second**. His intake order is moisture → density → bean size → process intensity → desired expression → prior reference curve. Process determines whether to stretch or compress; moisture/density set the starting energy envelope. This framing is folded into [§ Step 3 - Anchor Profile Selection Logic](#step-3---anchor-profile-selection-logic) above, and the moisture rows in the [Green Spec → Starting Hypothesis](#green-spec--starting-hypothesis) table now carry his confirmation. The Honey Process - Roast Direction Fork subsection below also sources from this livestream.

## Core Insight - RoR Shape Over Dev Time as the Primary Lever

Don't treat dev time as the independent variable. Instead, vary the RoR curve leading into FC (how much momentum you carry through Maillard and into crack) while holding drop temp fixed. Dev time becomes the measured output of that shape decision, not the thing you're directly setting.

**Important nuance from Sudan Rume Washed resolution:** This principle governs early-stage experimentation when profile architecture is still being resolved. Once profile shape is established, dev time can be legitimately tested as the primary variable to find the ceiling and floor within a confirmed shape.

## The Maillard + Dev Flavor Axis

Shorter Maillard + higher momentum at crack + shorter dev → more acidity and clarity. Longer Maillard + slower momentum at crack + longer dev → more sweetness and body. These are not independent dials - they move together as a function of how energy is applied through the curve.

## Naturals Starting Framework

Use the washed profile as the starting point. Lower inlet for early stages - gentler start. Taper heat away earlier. Primary failure mode for naturals is overdevelopment, not underdevelopment.

**Caveat from Sudan Rume Natural experience:** Sudan Rume Natural required nearly as much energy as the washed version due to the fruit layer insulating the core. Always start from the washed profile and let FC timing tell you whether to add or reduce energy.

---

# Green Bean Storage Protocol

Store roasted beans in 4oz kraft foil bags with resealable zipper and one-way degassing valve (100g batch fits comfortably). Leave zipper open for 24 hours post-roast to allow initial CO2 burst to escape. Seal zipper and rest until Day 7 evaluation.

Do not use plastic sandwich bags - they are permeable to oxygen and cannot protect aromatics across a 7-day rest window.

Measure ground Agtron (15g) at the Day 7 evaluation session before brewing - grind into the bag, measure, then proceed with pour.

---

# FC Marking Protocol

**FC marking is now decoupled from drop control.** As of 2026-05-04, drop is controlled by bean temp end condition on the profile (see Drop Temp as the Primary Drop Signal). FC marking is a data-recording event, not a drop-trigger event.

**Manual marking at first audible crack above 202°C** is the standard for the data record. This gives the earliest reliable signal and is more consistent than waiting for the Roest auto-mark (which fires after a second crack, lagging actual onset by 5-15 seconds).

**Cases:**

- **Audible FC above 202°C:** mark manually for the data record. Drop is controlled by the bean temp end condition on the profile, not by FC.
- **False positive below 202°C:** a single crack below 202°C is almost certainly a defect bean - do not mark. Wait for confirmation above 202°C.
- **High-volume crack:** if the Roest auto-marks due to a dense, vigorous crack event, accept the auto-mark.
- **Silent crack coffees (e.g. Mandela XO, anaerobic naturals, XO process):** do not attempt to mark. Log as manual-no-audio at the drop temp (which the profile end condition will fire at automatically). FC timestamp is null; drop temp is the only meaningful event. This was previously called out as an exception requiring bean temp end condition; with bean temp end condition now the default on every profile, silent-crack coffees are no longer an exception - they're just the case where the FC mark is null.

**Why dev time as end condition is retired:** dev time anchored to an inaudible or machine-estimated FC timestamp produces unpredictable Maillard overrun - confirmed across V4 of Mandela XO where Maillard reached 51-58% instead of the target 44%. Bean temp end condition removes this failure mode entirely. Dev time is now a measured output, not an end condition.

Record FC method in the Roast log (manual / auto / manual-no-audio) on every batch.

---

# Session Debrief Template

> **How to use this section:** After each roast session, paste this template into a new Claude message and fill in your answers. Claude will use your responses to update the experiment records, flag anything unexpected, and write the forward-looking hypothesis for the next session. Complete within 24 hours of roasting while the details are fresh.

## Prompt Claude With This After Each Session

Copy and paste the block below at the start of a new message, fill in your answers, and attach any Roest Connect screenshots.

```
SESSION DEBRIEF - [Coffee Name] [Experiment Set e.g. V3]

Date:
Batches roasted (Roest batch numbers):
Profile used:
Variable tested this session:

ROAST OUTCOMES (fill in from Roest Connect):
Batch A - FC time/temp, drop time/temp, dev time/%, Maillard %, Agtron WB, weight loss:
Batch B - FC time/temp, drop time/temp, dev time/%, Maillard %, Agtron WB, weight loss:
Batch C - FC time/temp, drop time/temp, dev time/%, Maillard %, Agtron WB, weight loss:

QUALITATIVE NOTES:
1. What surprised you during the session?
2. Did anything behave differently than expected vs. the hypothesis?
3. Which batch felt like it ran best during the roast (before tasting)?
4. Any FC marking exceptions this session (false positive, silent crack, auto-mark)?
5. Hopper load timing used (standard 125°C or different)?
6. Session position - was this a first roast of day or mid-session?

OPEN QUESTIONS:
What are you most uncertain about heading into the Day 7 pourover?

ANYTHING ELSE:
```

## What Claude Will Do With Your Debrief

- Update the Roasts sheet data for all batches in this session
- Update the Experiments sheet Observed Outcomes fields with roast-level data
- Flag any roasts that breach failure boundaries (Maillard too high, Agtron out of range, FC outside target window)
- Note any unplanned variables that may confound the experiment (session position, hopper timing anomalies, FC marking exceptions)
- Carry forward hypotheses and questions to inform the Day 7 pourover evaluation

## After Day 7 Pourover - What to Tell Claude

After brewing, provide a voice or text transcript of your tasting notes. Claude will extract and format these into Cuppings sheet format and update the experiment record with Observed Outcomes. Include:

- Ground Agtron readings for each batch (measured before brewing)
- Aroma and flavor notes for each batch, hot and as it cools
- Full cup sip notes (not just spoon)
- Temperature behavior - does it open up, close down, or stay neutral as it cools?
- Comparative statements - which is preferred and why
- Whether any batch felt under-extracted (likely a brew recipe issue, not a roast issue - try a pushed brew before concluding the roast is at fault)

## After Optimized Brew Session - What to Tell Claude

Once a winner is identified from Day 7 evaluation, run an optimized brew session and report:

- Brew recipe used (brewer, dose, water, grind, temp, pour structure)
- Tasting notes at hot, warm, and fully cool stages
- Whether the cup improves as it cools (brewing-tolerance signal)
- Whether it matches the producer's published tasting notes

**Reference [BREWING.md](BREWING.md) when designing the optimized brew session** — the reference roast becomes a roasted-bean input to the full Two-Axis Framework, including the Coffee Brief / Step 1d strategy confirmation / WBC corpus check (when the WBC integration sprint lands). Treat the SR reference brew the same way you'd treat a brew on a roasted bean from any other roaster.

Claude will then write the final brew recipe for the lot record and assess whether the lot is resolved. The SR reference brew gets pushed via `close-lot.md` STAGE 4 as part of the lot close-out (don't push separately).

---

# Cross-Coffee Insight Layer

Migrated to the [Roasting Historian cluster](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md) in Wave 2 PR 3 (2026-05-26). This h1 + pointer block preserves anchor back-compat for `#cross-coffee-insight-layer`. The cluster file carries the full CCIL content verbatim: Confirmed Patterns, FC Floor & Ceiling by Processing Method, WB-to-Ground Agtron Delta Norms, Session Position Effect, Green Spec → Starting Hypothesis (Additive + Precedence tables), Varietal Aromatic Fingerprints, Rest Behavior Patterns, FC-Temp Architectural Constraint on Naturals, xbloom Evaluation Gate Misranking on Anaerobic Naturals, and Working Hypotheses (Single-Lot, Low Confidence).

---

# Open Questions

Migrated to the [Roasting Historian cluster](docs/skills/roasting-historian/cluster/patterns/open-questions.md) in Wave 2 PR 3 (2026-05-26). This h1 + pointer block preserves anchor back-compat for `#open-questions`.

---

# Archive

Full per-lot prose, experiment history, generalized lessons, and process learnings: [docs/roasting/archive.md](docs/roasting/archive.md). Five lots indexed; new closed lots get added on close-out via `close-lot.md` STAGE 5 (`propose_doc_changes` proposes a new section, the arbiter applies citation-by-citation per [ARBITER.md](ARBITER.md)).

---

# Roast-to-Brew Translation

*This section translates roast parameter patterns into expected brew behavior and starting recipe adjustments. It bridges the gap between the roasting reference guide and the brewing reference guide. Updated as new lots are resolved.*

> The 5 brewing strategies + 4 modifiers referenced below (Suppression / Clarity-First / Balanced Intensity / Full Expression / Extraction Push + Output Selection / Inverted Temperature Staging / Aroma Capture / Immersion) are defined in [BREWING.md § The Two-Axis Framework](BREWING.md#the-two-axis-framework). The brew-side documentation contract (Step 4 Resolved Brew Output Format) lives in [BREWING.md § Step 4](BREWING.md#step-4---resolved-brew-output-format). When proposing a brew strategy from a roast outcome, name the canonical strategy explicitly so the iteration loop matches the framework.

> Core principle: The brew recipe does not fix a bad roast, but it can hide a good one. A roast that passes the Day 7 evaluation gate but feels muted is often an extraction problem, not a roast problem. Always try a pushed brew before concluding more development is needed.

## Reading Roast Parameters to Predict Brew Behavior

Several roast parameters directly predict how a coffee will behave at brew time, independent of cup flavor notes. These patterns have been confirmed across Sudan Rume Washed and should be applied as starting hypotheses for new lots.

| Roast Signal | Brew Prediction | Starting Adjustment |
|---|---|---|
| WB-to-ground delta ≤2 points | Even internal development - coffee will likely respond well to extraction pressure. Flavor hidden at standard params may emerge at finer grind or lower temp. | Try 1-2 clicks finer than evaluation grind; lower temp by 2-3°C |
| WB-to-ground delta +4 to +6 points | Surface developed faster than core - may taste bright/harsh with thin mid-palate | Lower temp to soften surface extraction; consider longer bloom |
| Agtron WB 74-78, delta tight | Light internal development, evenness confirmed - this is the target zone for delicate washed expression | Start with pushed recipe (see below). Standard recipe likely under-extracts. |
| Agtron WB above 79 | Very light - likely underdeveloped unless delta is tight. Nutty/grassy at standard params. | Increase extraction aggressively - finer grind, higher temp, higher concentration |
| Agtron WB below 70 | Risk of overdevelopment - tea-like, flat. Standard recipe may be appropriate. | Back off extraction. Coarser grind, lower temp, lower concentration. |
| Maillard above 47% | Bloated Maillard - roasty/baked character likely, reduced top-note lift | Standard or backed-off extraction. Do not push. |
| Maillard 40-44% | Balanced phase structure - full aromatic expression available | Pushed recipe appropriate. Lower temp, higher concentration. |
| FC temp 202-205°C, drop 206-207°C | Confirmed target zone for Sudan Rume-type coffees - full expression should be achievable at brew | Pushed recipe. See reference recipe below. |

> Per-lot reference brew recipes (CGLE Sudan Rume Washed #133, CGLE Mandela XO #139) live in [§ Reference Roasts + Brews (Closed Lots)](#reference-roasts--brews-closed-lots). The decision logic + processing-method hypotheses below apply when designing the optimized brew for a new lot reaching reference-roast declaration.

## Pushed vs. Standard Recipe Decision Logic

For delicate washed coffees with high aromatic compound concentration (Sudan Rume, Gesha, Ethiopian landraces), the standard xbloom evaluation recipe is calibrated for consistency, not expression. The following decision logic determines when to push:

| Observation at Standard Recipe | Diagnosis | Action |
|---|---|---|
| Muted, quiet, tea-like throughout | Under-extraction - delicate compounds not being released | Lower temp by 2-3°C AND increase concentration to 1:14. Try finer grind last. |
| Pleasant but thin, loses character as it cools | Extraction correct, but missing body compounds | Finer grind (1-2 clicks). Lower ratio to 1:14.5. |
| Bright, sharp attack but hollow finish | Surface extracting ahead of core | Lower temp. Longer bloom. Do not go finer. |
| Good character at hot stage, closes at cool | Correct extraction range - just needs more concentration | Lower ratio to 1:14 only. |
| Dark tea, flat throughout | Overdevelopment in the roast - brew recipe cannot fix this | Do not push. Standard or backed-off recipe. Flag roast as overdeveloped. |
| Nutty, grassy, flat | Underdevelopment in the roast - confirmed by Agtron above 79 | Do not push at brew - cannot compensate for roast underdevelopment. Flag for next roast session. |

## Processing Method Starting Hypotheses for Brew

These starting points are derived from the brewing reference guide's extraction strategy framework, adjusted for what has been confirmed on these specific counterflow roasts.

| Process Type | Evaluation Recipe Strategy | Optimized Recipe Direction | Temperature | Ratio |
|---|---|---|---|---|
| Washed, high-density Colombian | Standard xbloom - but expect muting. Evaluate at cool stage. | Lower temp, higher concentration, Melodrip | 91-92°C | 1:14-1:15 |
| Natural (CGLE Sudan Rume) | Standard xbloom - expect more expressiveness than washed version | Similar to washed but possibly slightly higher temp to handle body | 92-93°C | 1:14.5-1:15.5 |
| XO-fermented (Mandela) | Standard xbloom - fermentation character will emerge but may be front-loaded and pungent. Do not adjust based on xbloom alone - run real brew before concluding. | **Balanced Intensity, not Full Expression.** The fermentation provides all the intensity the cup needs. Use April Brewer or equivalent flat-bottom brewer, coarser grind, moderate temp. Do not use UFO/fast cone as the primary evaluation brewer - it amplifies the fermentation attack. | 93°C | 1:17 |
| Washed Gesha (counterflow) | Standard xbloom - but start evaluation at warm stage, not hot | Very low agitation, lower temp, Melodrip critical | 90-91°C | 1:15-1:16 |

## The Brew-Reveals-Roast Principle

One of the most important learnings from Sudan Rume Washed: **what appears in the optimized brew cup is what was already in the roast, waiting to be unlocked.** The evaluation recipe will often miss it.

Concretely: Batch #133 at the standard xbloom recipe tasted muted, tea-like, and under-extracted. At 91°C / 1:14 / EG-1 6.0, the same batch produced candied apricot, bergamot, jasmine, and lemon that matched the producer's own tasting notes exactly.

The implication for the development loop:

- If the evaluation recipe gives a muted or thin result but the WB-to-ground delta is tight and roast structure looks correct, the roast is likely fine - run an optimized brew before concluding that more development is needed
- If the optimized brew also gives a muted or thin result, the roast genuinely needs more development
- If the optimized brew gives a sharp, harsh, or disconnected result, the roast may be overdeveloped - back off extraction before concluding the roast failed

**Build the optimized brew session into every lot close-out.** Do not declare a reference roast without confirming it produces the target cup through the optimized brew, not just the evaluation recipe.

**Extension (Low confidence, 1 lot - ECU-TD24-RANCHOTIO-TM-WASHED):** The Brew-Reveals-Roast Principle has a third application beyond the original two (under-developed cup at standard recipe / over-extracted cup at pushed recipe). Third case: **on a structurally underdeveloped roast, the WRONG brew strategy produces a falsely-discordant cup that masquerades as a roast problem.** Batch 179 was genuinely underdeveloped (Maillard 49.4%, weight loss 11.89%) - but at the V1 design's originally-planned recipe (1:14 / EG-1 6.0 / 91°C, inherited from the #133 Sudan Rume Washed anchor lineage), the cup read "discordant", "not totally integrated", "dark Earl Grey body" - signals that look like roast underdevelopment failure but were 80% brew-strategy mismatch. Pivoting to Clarity-First (1:16 / 6.5 / 92°C, variety-appropriate strategy from brewing.md archive) recovered 5 of 8 producer descriptors and produced an integrated cup. The roast was still structurally limited (hollow back-half, narrow peak window) - but the discordance was overwhelmingly brew-driven.

Operational implication for one-shot calibrations and lot close-outs: when the cup at the planned recipe reads discordant, the diagnostic question is NOT "is the roast under-developed?" but rather "is the brew strategy mismatched to the variety?" - especially when the planned recipe was inherited from an anchor roast for a different variety. Variety signal at brew time dominates over anchor-roast lineage. Cross-reference brewing.md's Process / Variety Signal Table at the brew design step, not just the roast design step. Treat as Low-confidence hypothesis pending 1-2 more lots where roast-anchor-lineage and variety-recommended brew strategy diverge.

## WB-to-Ground Agtron Delta Hypothesis Violation on Drop-Ceiling-Breached Batch (working hypothesis - 1 lot, Medium confidence)

Observed on Bukure Natural Lot 21 V1 (cupped 2026-05-11): WB-to-Ground deltas across the three V1 slots ordered v1a +3.4 / v1b +6.6 / v1c +1.0. The leading slot at Day 7 pourover was v1b (widest delta), and the slot with the tightest delta in the V4 target zone (v1c at +1.0) was the disliked cup. v1c was the drop-ceiling-breach batch (drop fired at 209.0°C vs 207°C ceiling).

Working hypothesis: when a roast breaches the drop ceiling, the additional heat post-FC drives the core to catch up to the surface via overdevelopment rather than via even-rate energy penetration. The resulting WB-to-Ground delta tightens mechanically (core Agtron rises toward surface Agtron) without reflecting good roast structure. The delta-quality correlation in the existing CCIL is inverted in this regime.

Mechanism implication: WB-to-Ground delta is a reliable internal-development signal only WHEN the drop ceiling was respected. On ceiling-breach batches, delta is non-diagnostic or actively misleading.

Operational implication: when reading delta across a V1 spread, exclude ceiling-breach batches from the delta-quality inference. Validate at 2+ more lots before promoting from working hypothesis - the next ceiling breach with a Day 7 cupping is the test case.

Lot data:
- v1a (240°C peak, drop 204.5°C clean): WB 75 / Gnd 71.6 / delta +3.4 - cup ranking #2 (most aromatically complex but body-darker)
- v1b (244°C peak, drop 206.5°C clean - leading slot): WB 82.5 / Gnd 75.9 / delta +6.6 - cup ranking #1 (most balanced/integrated)
- v1c (248°C peak, drop 209°C BREACH): WB 81.4 / Gnd 80.4 / delta +1.0 - cup ranking #3 (disliked - discordant)

## Total Time Outweighs Peak Inlet for Body Weight on Pulp-Fermentation Washed at High Moisture (working hypothesis - 1 lot, Medium-High confidence)

Observed on REDPLUM-CAS-2026 V1: across a 5°C peak inlet spread (240/245/250°C), the cup ordering for body weight tracked total roast time more than peak inlet. v1a at 240°C peak produced HEAVIER body (very dark / tannic / blacker tea) than v1b at 245°C peak (lighter body, hollow on cool). The mechanism: v1a's operator stall-prevention drop fired at 5:30 (vs v1b's 5:08), giving 22s additional total roast time that amplified body weight more than the -5°C peak difference reduced it. v1c at 250°C peak with no FC and 4:15 total dropped pre-crack - body was raw/nutty/grassy from underdevelopment, but aromatic top notes from the short Maillard window survived.

Working hypothesis: on washed-process lots in counterflow, post-FC total time accumulates body-weight effect faster than peak inlet does within a typical ±5°C spread. Operational implication: when invoking the long-end manual stall-prevention drop rule, do so as EARLY as the curve permits (don't wait the full 6:00-6:30 judgment window if RoR has flattened) - extending total time produces heavier body, which may or may not be desirable depending on the lot's flavor profile target. Inverse: if a lot's cup signal is hollow-body, deliberately extending total time by 10-15s past auto-drop (via short-end manual hold or +1°C drop ceiling) may rescue body weight without changing peak inlet structure.

Watch for repeat pattern on next washed lot (REDPLUM V2 will partially test - moisture-aware shape change reduces total time across the spread, predicts cleaner body balance at the same peak; if V2 body is uniformly lighter than V1 the pattern confirms). Promote from working hypothesis to confirmed when seen on a second washed lot.

