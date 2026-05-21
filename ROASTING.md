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

For brewing-side context (extraction strategies, modifier framework, brewer / filter canonicals), see [BREWING.md](BREWING.md). The Roast-to-Brew Translation content (cross-coffee patterns translating roast parameters into brew predictions) lives in the [Roasting Historian cluster](docs/skills/roasting-historian/cluster/patterns/roast-to-brew-translation.md) and cross-references BREWING.md's 6+3 framework (6 extraction strategies + 3 modifiers).

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

Migrated to the [Roest Knowledge cluster](docs/skills/roest-knowledge/cluster/machine/l200-ultra.md) in Wave 3 PR 1 (2026-05-26). This h1 + pointer block preserves anchor back-compat for `#equipment`. The cluster file carries the hardware + accessory stack (Roest L200 Ultra counterflow mode 100g batches / Lightcells CM-200 / xbloom Brian Quan evaluation recipe / EG-1 Weber Workshop grinder) verbatim, with cross-link to [docs/skills/brewing-equipment-expert/cluster/grinder-eg1.md](docs/skills/brewing-equipment-expert/cluster/grinder-eg1.md) for the EG-1 setting taxonomy.

---

# Evaluation Protocol

Migrated to the [Roest Knowledge cluster](docs/skills/roest-knowledge/cluster/protocols/evaluation.md) in Wave 3 PR 1 (2026-05-26). This h1 + pointer block preserves anchor back-compat for `#evaluation-protocol`. The cluster file carries the Current Protocol (Day 7 pourover gate, xbloom Brian Quan recipe, 15g dose, ≤3 batches per session, Ground Agtron measurement requirements with WB-Ground delta targets) + the Why Day 4 Cupping Was Removed rationale verbatim. Cross-link from the cluster to counterflow-observations.md for the WB→Gnd delta per-lot-family directional interpretation.

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

Migrated to the [Roest Knowledge cluster](docs/skills/roest-knowledge/cluster/protocols/fan-strategy.md#standard-inlet-curve-template) in Wave 3 PR 1 (2026-05-26). This h2 + pointer block preserves anchor back-compat for `#standard-inlet-curve-template`. The cluster bundles this template with § Fan Strategy under one protocols doc. The 7-timestamp template (00:00 / 01:15 / 02:30 / 03:15 / 04:00 / 05:00 / 06:00) and V1 design rules (hold timestamps constant; vary inlet temperature values; V1 is a wide mapping pass) live there verbatim.

---

# Key Counterflow Observations (Machine-Specific)

Migrated to the [Roest Knowledge cluster](docs/skills/roest-knowledge/cluster/machine/counterflow-observations.md) in Wave 3 PR 1 (2026-05-26). This h1 + pointer block preserves anchor back-compat for `#key-counterflow-observations-machine-specific`. The cluster file carries all subsections verbatim: Turning Point (TP) probe artifact, FC Temperature Targeting, Charge Temperature, Total Roast Time, Session Position Effect, Drop Temp as the Primary Drop Signal (including the 4 manual-override exception rules), and WB-to-Ground Agtron Delta as Development Signal.

---

# Fan Strategy (Counterflow - Shaped Curves Required)

Migrated to the [Roest Knowledge cluster](docs/skills/roest-knowledge/cluster/protocols/fan-strategy.md) in Wave 3 PR 1 (2026-05-26). This h1 + pointer block preserves anchor back-compat for `#fan-strategy-counterflow---shaped-curves-required`. The cluster file bundles § Fan Strategy with the Standard Inlet Curve Template (both are counterflow-specific shaped-curve discipline). General Fan Framework, Fan Curves by Coffee Type, and Current Reference Fan Curves table carried verbatim.

---

# Naturals - Roasting Framework

Use the washed profile as the starting point. Lower inlet temp for the early stages (gentler start). Taper heat away earlier. At 100g batch size, exothermic runaway is not a meaningful risk. Primary failure mode for naturals is **overdevelopment** (collapses fruit/ferment complexity), not underdevelopment.

**Key learning from Sudan Rume Natural V1:** This specific natural (791 g/L density, 10.3% moisture) required more early energy than a typical natural because the dried fruit layer provided significant thermal insulation not captured by the green specs. 242°C peak inlet was insufficient. 247°C brought FC timing into range. Do not assume "natural = less heat" applies universally - always start from the washed profile and let FC timing tell you whether to add or reduce energy.

> **Drop temp discipline is the most critical natural-specific constraint.** For naturals, drop on temp with a strict ceiling - do not wait for dev time. Overdevelopment suppresses fruit/ferment character and produces dark tea, flat cups with no attack.

---

# Honey Process - Roast Direction Fork

**Placeholder framework.** No resolved honey lots in the archive yet. Currently the only honey lot in inventory is the **Cruz Loma TM Honey one-shot** (Taza Dorada 2024 #15), queued behind the Rancho Tio Emilio Typica Mejorado Washed one-shot. This section is the starting framework for that roast.

Honey processing produces a wide expression range depending on mucilage retention, drying speed, and fermentation length. Unlike washed (where the cup target is mostly clarity) or natural (where the cup target is mostly fruit/sweetness), honey is a **fork**: the same green can legitimately be roasted toward either expression. From the [Yunnan livestream extraction (Dongzhe, 2026-05-17)](docs/skills/peer-learning-roasting-archivist/cluster/per-peer/dongzhe.md#delta-3--honey-process-is-a-fork-informational--placeholder-framework), the fork is explicit:

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

**Green-physics-first framing.** Read the lot's moisture + density (paired) as a first-order intake signal **alongside** process and terroir/cultivar - not subordinate to process. This is a structural refinement from the [Yunnan livestream extraction (Dongzhe, 2026-05-17)](docs/skills/peer-learning-roasting-archivist/cluster/per-peer/dongzhe.md#delta-1--green-physics-first-process-second-structural): moisture/density picks the energy envelope, then process decides stretch-vs-compress within that envelope. In practice that means the priority-order list below picks the anchor *coffee* via process + variety, but the starting *energy* on that anchor profile is set by moisture/density per the Green Spec table - so a 9.3% moisture honey and an 11% moisture honey anchor on the same profile but start with different early-energy adjustments. For lots where no process-family match exists (e.g. a Daterra Laurina with unfamiliar bean shape), moisture/density alone is a defensible starting point for energy even when the anchor process is uncertain.

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

Migrated to the [Peer-Learning Roasting Archivist cluster](docs/skills/peer-learning-roasting-archivist/cluster/per-peer/dongzhe.md#reference-roast-target--batch-249-it-simple-slow-100g) in Wave 3 PR 1 (2026-05-26). This h1 + pointer block preserves anchor back-compat for `#reference-roast-target-peers-batch-249---it-simple-slow-100g`. Full parameter table + machine-difference caveats + process caveat live in Dongzhe's per-peer profile.

---

# Peer Insights - Counterflow L200 Ultra (Same Machine, Same Mode)

Migrated to the [Peer-Learning Roasting Archivist cluster](docs/skills/peer-learning-roasting-archivist/cluster/per-peer/dongzhe.md) in Wave 3 PR 1 (2026-05-26). This h1 + pointer block preserves anchor back-compat for `#peer-insights---counterflow-l200-ultra-same-machine-same-mode`. The cluster file carries Dongzhe's full profile: Reference Roast Target #249, Core Principles (RoR shape over dev time / Maillard + dev flavor axis / Naturals starting framework), and the full Yunnan-Hatchi 2026-05-17 livestream extraction with five operational deltas + caveats. Provenance + freshness tracking lives at `cluster/source-index.md`.

---

# Green Bean Storage Protocol

Store roasted beans in 4oz kraft foil bags with resealable zipper and one-way degassing valve (100g batch fits comfortably). Leave zipper open for 24 hours post-roast to allow initial CO2 burst to escape. Seal zipper and rest until Day 7 evaluation.

Do not use plastic sandwich bags - they are permeable to oxygen and cannot protect aromatics across a 7-day rest window.

Measure ground Agtron (15g) at the Day 7 evaluation session before brewing - grind into the bag, measure, then proceed with pour.

---

# FC Marking Protocol

Migrated to the [Roest Knowledge cluster](docs/skills/roest-knowledge/cluster/protocols/fc-marking.md) in Wave 3 PR 1 (2026-05-26). This h1 + pointer block preserves anchor back-compat for `#fc-marking-protocol`. The cluster file carries the protocol verbatim (manual at first audible crack above 202°C; auto-mark accepted for high-volume crack; manual-no-audio for silent-crack coffees) plus cross-link to `roasts.fc_audibility` enum.

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

Migrated to the [Roasting Historian cluster](docs/skills/roasting-historian/cluster/patterns/roast-to-brew-translation.md) in Wave 3 PR 1 (2026-05-26). This h1 + pointer block preserves anchor back-compat for `#roast-to-brew-translation`. The cluster file carries the full content verbatim: Reading Roast Parameters to Predict Brew Behavior, Pushed vs. Standard Recipe Decision Logic, Processing Method Starting Hypotheses for Brew, The Brew-Reveals-Roast Principle (including the Low-confidence Rancho Tio extension), plus the two working hypotheses at the tail (WB-to-Ground Agtron Delta Hypothesis Violation on Drop-Ceiling-Breached Batch / Total Time Outweighs Peak Inlet for Body Weight on Pulp-Fermentation Washed at High Moisture). Kickoff brief proposed Roest Knowledge; Chris-locked 2026-05-26 to Roasting Historian because the content is cross-coffee pattern aggregation, not machine-specific knowledge.

---
