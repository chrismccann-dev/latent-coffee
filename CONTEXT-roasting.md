# Latent Coffee Research — Glossary (Roasting Zone)

## Purpose

This document defines the canonical roasting-side vocabulary for Latent Coffee Research.

Its job is to give coding agents, prompt agents, and future contributors a shared conceptual model for how Chris thinks about green lots, V-set design, Roest recipe generation, roast execution, cupping interpretation, reference-roast designation, and lot-close synthesis.

This file is primarily a concept glossary, not an implementation manual. It should define terms, relationships, scope boundaries, and avoid-list vocabulary. It should not be the main home for schema migrations, prompt-stage procedures, UI rendering details, or historical implementation notes. Those belong in the relevant workflow, schema, prompt, or architecture documents.

Use this file when deciding what a term means, how it relates to nearby terms, and which noun should be used in code, prompts, prose, or UI. Use the linked sub-documents when the task requires execution detail.

Brewing terms live in [CONTEXT-brewing.md](CONTEXT-brewing.md), Cross-cutting infrastructure (MCP / Sync Architecture / Canonical Registries / WBC Reference Materials / Synthesis Pipeline / Relationships / Flagged ambiguities) lives in [CONTEXT-shared.md](CONTEXT-shared.md). Strict glossary per grill-with-docs format — no implementation details, only term definitions + cardinality relationships. Grown via /grill-with-docs sessions, never bulk-authored. Implementation details live in CLAUDE.md, not here.


## Reading order for agents

Use this document as a lookup graph, not as a front-to-back read.

### Task-based path

- Designing V1 for a new lot: read **Core ontology** -> **V-set design and forward planning** -> **Roast-session operating protocol**.
- Designing V_n+1 after cupping: read **V-set close synthesis** -> **V-set design and forward planning** -> **Roast diagnostics and failure signals**.
- Logging a roast: read **Core ontology** -> **Roast-session operating protocol** -> **Roast diagnostics and failure signals**.
- Logging a cupping: read **Cupping and cup-character interpretation** -> **V-set close synthesis** -> **Reference designation terms**.
- Deciding whether to close a lot: read **Reference designation terms** -> **Simulated Pourover Gate system** -> **Lot-close synthesis**.
- Closing a lot: read **Lot-close synthesis** -> **Cross-domain roasting ↔ brewing handoffs** -> **Schema notes** only when implementation detail is needed.
- Working on one-shot lots: read **One-Shot Lot** -> **Tolerance-anchored design** -> **One-shot emission + link** -> **Closed without reference**.
- Touching schema, prompt stages, migrations, or UI: read **Schema notes** and the relevant workflow file before editing glossary prose.

### High-risk term pairs

Most mistakes come from confusing these pairs:

- **Recipe** vs **Roest profile**: design-intent aggregate vs machine-side JSON artifact.
- **Anchor profile** vs **Reference roast**: upstream V1 starting framework vs lot-close winner.
- **Leading slot** vs **Reference candidate** vs **Reference roast**: V-set winner vs plausible mid-flight quality flag vs final lot-level designation.
- **Reference cup** vs **Optimized brew**: standardized xBloom gate cup vs daily-consumption brew endpoint.
- **Variable** vs **Lever** vs **Non-factor**: design-time moved parameter vs lot-close promoted effect vs tested no-effect.
- **Thermal reset** vs **BBP**: session-start warm-up to 140°C vs between-roast cooldown to 120°C.
- **Hopper-load** vs **Charge**: load at 125°C into hopper vs charge at 117°C into drum.
- **FC floor** vs **Drop ceiling** vs **Dev headroom**: lower FC bound vs upper drop bound vs usable FC-to-drop temperature room.
- **Rest behavior** vs **Rest-days drift**: lot-level evolution pattern vs comparison confound between cups of different ages.
- **Simulated Pourover Packet** vs **Simulated Pourover Gate** vs **SPG standing recipe**: trigger vs decision event vs frozen bean-specific recipe.

### Search strategy for agents

When resolving a term, search the exact term first. Then search its neighbors from the relevant high-risk pair or section. Do not promote a term to a broader meaning unless this glossary explicitly allows that scope.



## Agent term index

This index exists for searchability. Each row points agents to the right local cluster.

| Search term | Local cluster | Related terms |
|---|---|---|
| lot | Core ontology | one-shot lot, green_lot_id |
| V-set | Core ontology | experiment, batch slot, experiment frame |
| recipe | Core ontology | Roest profile, batch slot |
| Roest profile | Core ontology | recipe, machine artifact |
| anchor profile | Core ontology / V-set design | anchor confidence, carry-forward learnings |
| leading slot | Reference designation terms | reference candidate, reference roast |
| reference candidate | Reference designation terms | leading slot, is_reference_candidate |
| reference roast | Reference designation terms | reference cup, optimized brew |
| BBP | Roast-session operating protocol | thermal reset, hopper pre-load, charge |
| hopper pre-load | Roast-session operating protocol | load at 125°C, charge at 117°C |
| session position | Roast-session operating protocol | first roast slow, third roast fast |
| variable | V-set design | lever, non-factor |
| signal precedence | V-set design | multi-factor weighting |
| FC audibility | Roast diagnostics | silent, subtle, ambiguous, did_not_fire |
| Maillard % | Roast diagnostics | FC audibility, did_not_fire |
| WB→Gnd delta | Roast diagnostics | development, Agtron |
| rest-days drift | Cupping interpretation | rest behavior, SPG |
| Simulated Pourover | Simulated Pourover Gate system | packet, gate, standing recipe, eval_method |
| peer-roasted reference | Cross-domain handoffs | peer roaster, information value |
| backfilled recipe | Schema notes | was_backfilled, backfill_notes |

## Core ontology

### Lot

Lot: A specific green-bean purchase from one producer/farm at one point in time — uniquely identified by its green_lot_id (the seller's lot reference). One purchase = one lot, even when the same farm + same cultivar is bought twice in different seasons or from slightly different sub-locations on the farm: agricultural variability (moisture, density, soil, sun, processing) means the two will behave and taste differently. The unit of all roasting research in Latent. *Avoid*: "bean", "coffee", "batch" (batch is a slot inside a V-set), "SKU", "purchase", "variety" (variety is the cultivar, not the lot)

### One-shot lot

One-shot lot: A green-bean lot purchased in a single small sample (typically 100-120g) sufficient for only one roast. Origin: auction-lot sample sets where the full lot isn't yet sold, farm-direct sample sets sent during sourcing negotiations, rare allocations from limited drops. The constraint is structural, not stylistic: no iteration possible, no V2 recovery, no cross-batch variance attribution, no margin for error. Distinct from V-set lots (5-10+ batches of 100g, supporting V1 / V2 / ... / V_N iteration through the comparative pipeline). Flagged via green_beans.is_one_shot: true at intake (migration 054). Routes through `docs/prompts/one-shot.md` + `docs/prompts/one-shot-closeout.md` instead of the 4-prompt V-set lifecycle. *Avoid*: "sample" (every green-bean purchase is a sample at some scale; the distinguishing feature is single-roast-capacity), "single-batch lot" (every batch slot is single-batch by definition; one-shot is single-batch-AT-LOT-LEVEL)

### Experiment

Experiment (umbrella noun): The umbrella noun in working roasting prose for any structured investigation with a hypothesis, controls, and outcomes — *not* a synonym for V-set, even though the experiments DB table specifically holds V-set rows. V-set is one specific shape of experiment; several other shapes coexist in lived practice, each with its own canonical sub-name:

* V-set (the dominant sub-shape): 3-batch iteration on a green lot, evaluated for a leading-slot designation. The schema's experiments table is named for this case.
* Same-green blending experiment: 3-batch ladder + blend matrix on one green lot, evaluating 6 cups for a best-blend designation rather than a best-slot designation. Same design machinery; different evaluation step.
* Rest curve protocol: 4 cupping events sequenced across post-roast time on one reference roast. Single roast, multiple cuppings — no V-set framing.
* Hardware tests: bounded investigations on machine behavior (80g vs 100g batch size, thermal-reset variations, fan curve experiments outside any V-set). Produce no reference roast.
* Brewing experiments: bounded recipe variations on a confirmed roast (grind delta on optimized brew, e.g.). Live at the brewing-side, not roasting-side.
* Cross-lot calibration experiments: multi-lot side-by-side cuppings for descriptor-vocabulary calibration.
* Long-run experiment (separate glossary entry): multi-V-set or cross-lot structured investigations into a structural pattern.

Schema-vs-vocabulary asymmetry: in app-context "experiments" specifically means V-set rows (the `experiments` table name disambiguates by scope); in workflow-context "experiments" is the broader umbrella above. Both are correct in their respective contexts. *Avoid*: collapsing "experiment" with "V-set" (V-set is one shape, not THE shape); "experiment set" (deprecated transition-period term for V-set specifically).

### V-set

V-set: One round of roasting experimentation on a green-bean lot, labeled V1 / V2 / ... and typically containing 3 recipe variants (with 1–4 as the legitimate range). Each V-set carries one primary question + an optional control baseline + 1–2 variables being moved across slots (lever is a post-hoc promotion declared at lot-close, NOT at V-set design — see Variable / Lever / Non-factor). One specific shape of Experiment (umbrella noun); other shapes (same-green blending experiment, rest curve protocol, hardware tests, etc.) coexist. *Avoid*: "experiment set", "iteration", "round", "batch series"; using "experiment" interchangeably with V-set when context could mean the umbrella.

### Batch slot

Batch slot: One recipe variant within a V-set, labeled a / b / c (or sometimes d). The full identifier {V-set}-{slot} (e.g. V1a) is the same string carried through spreadsheet, Roest machine profile name, app records, and cupping notes — one label end-to-end. *Avoid*: "variant", "batch", "recipe variant"

### Recipe

Recipe (aggregate noun for design intent): The Latent design-intent aggregate for one batch slot — the bundle of inlet curve + fan curve + RPM curve + charge temp + hopper pre-load + end-condition mechanism + drop rules + per-batch rationale + Hypothesis prose + design-time predictions. Lives in the roast_recipes schema entity (one row per batch slot per V-set; UPSERTed on (user_id, experiment_id, batch_slot) when both supplied, otherwise on (user_id, green_bean_id, recipe_name)). The canonical noun for "the complete roast specification before machine execution" — chosen to resolve the prior recipe / profile / spec drift. The schema entity name is load-bearing; "recipe iteration" matches the V1/V2/V3 design cadence verb; the machine artifact has its own noun (see Roest profile, below). *Avoid*: "profile" (reserved for Roest machine artifact); "spec" (ambiguous against the Green Spec → Starting Hypothesis table which uses "spec" for physical bean specification — density / moisture / altitude); "specification" (overformal); bare "design" (loses the aggregate-row framing).

### Roest profile

Roest profile (machine artifact): The JSON specification pushed to the Roest L200 Ultra tablet via push_roast_profile, parameterizing one upcoming roast at the machine. Carries profile_id + share_url + roest_profile_name + the bezier-encoded inlet / fan / RPM curves + end condition + charge / hopper temps. One recipe row produces one or more Roest profile pushes — the noun asymmetry is deliberate: Roest profile names the machine-side execution artifact (what the tablet uses to drive the roaster); recipe names the Latent-side design-intent aggregate (what the design conversation produced). When a profile gets re-pushed to retry or modify a slot at the machine, the recipe row stays one; the Roest profile count goes up. Linkage on the recipe row: roast_recipes.roest_profile_id + roest_share_url + roest_profile_name + pushed_to_roest_at. *Avoid*: collapsing "Roest profile" with "recipe" (different nouns for different lifecycle stages — design intent vs machine execution); "profile" without the "Roest" qualifier when the machine artifact is meant (in mixed contexts the qualifier prevents the recipe-conflation drift).

### Anchor Profile, Reference Roast Profile

Anchor profile / reference roast profile / curve-shape names (preserved canonical concepts): Pre-existing roasting terminology for a curve-shape reference used at V1 design time — distinct from both the recipe aggregate noun and the Roest profile machine artifact. The anchor profile is the existing profile chosen as the V1 starting point (see ROASTING.md § Step 3 - Anchor Profile Selection Logic); the reference roast profile is the curve from a closed lot's reference roast used directly as the next lot's anchor; named curve-shape references like CF-Light profile / washed profile / natural profile / working profile denote stable curve templates. These usages are NOT drift — they describe the *shape* of the curve as a transferable starting framework, not a row in roast_recipes and not a JSON push to the Roest tablet. Preserved verbatim in ROASTING.md + docs/roasting/\* and Latent prose. *Avoid*: rewriting "anchor profile" to "anchor recipe" (loses the curve-shape framing); collapsing curve-shape names with the recipe aggregate (curve-shape is a starting framework, recipe is the per-batch design intent that wraps the chosen curve).

Distinct from carry-forward learning: anchor profile is parametric reference (specific numbers from a real prior roast); carry-forward learning is propositional knowledge (sentence-shaped guidance derived from anchor profiles). One anchor profile generates multiple carry-forward learnings; one carry-forward learning may consolidate signal from multiple anchors. Design opens with the anchor; interpretation closes with the carry-forward. *Avoid*: "reference profile" (confuses with reference roast at lot-close); "anchor roast" outside the inventory-column context (use "anchor profile" or bare "anchor" in prose); collapsing anchor profile and carry-forward learning into the same concept.

### Reference designation terms

Use this cluster when deciding whether a roast is merely best inside one V-set or has earned a lot-level designation. The sequence is: **leading slot** -> **reference candidate** -> **reference roast** -> possible **closed without reference** at lot close. Keep scope explicit.

### Reference Roast

Reference roast: The single batch slot (one roast execution in one V-set) designated at lot-close as the winning expression - the roast Chris would repeat if he had more green. Chosen by judgment call when the cup matches producer-notes ballpark + Chris's expectations + diminishing returns set in; typically locked in by running one final control experiment (a replicate V-set with two slight adjustments) before declaring the winner. Deliberately called "reference" not "best" - tasting is subjective and there is no objective best. Distinct from leading slot: the leading slot is V-set-scoped (winner of one V-set's batch-slot comparison); the reference roast is lot-scoped (one per lot, declared at close-out). The reference roast is typically the leading slot of the final V-set, but the concepts are not interchangeable - a control experiment V-set can confirm a leading slot from a prior V-set as the reference roast, in which case the leading slot of the control V-set may or may not be the same.

### Leading Slot

Leading slot: The winner of one V-set's batch-slot comparison - the single batch slot within V_n that came out on top at Day 7 cupping. Lives in experiments.winner (one per V-set). Phrased as V<n><letter> (Batch <Roest#>) so it's unambiguous and distinguishable from the lot-level reference roast. Changes V-set to V-set as the iteration progresses; the leading slot of V1 may or may not also be the leading slot of V2.

Distinct from reference roast: the leading slot is V-set-scoped. The reference roast is lot-scoped - designated exactly once at lot close-out, can be (and often is) the leading slot of the final V-set, but the two concepts must not be conflated. The lifecycle has *N* leading slots (one per V-set) and exactly 1 reference roast. *Avoid*: "winner" (ambiguous against reference roast), "best batch", "V-set winner" (the schema column name; vocabulary preference is "leading slot")

### Reference candidate

Reference candidate: The forward-looking quality flag set on a V-set leading slot when it reads as plausibly the lot reference at close-out (migration 056). Lives in roasts.is_reference_candidate boolean. Mid-flight, not final: distinct from is_reference (lot-level final, set at close-out) AND from experiments.winner (which is always the V-set leading slot regardless of quality). The Fazenda Um V1B case ("leading slot, best of the worst, NOT a reference example") is the canonical negative case — winner = "V1B (Batch 174)" but is_reference_candidate = false. Multiple V-sets on one lot can each have a candidate; only one batch ultimately gets is_reference = true at close-out. The flag does NOT auto-flip to is_reference at close-out — close-lot.md STAGE 2 / one-shot-closeout.md STAGE 2 makes the promotion explicit.

Timing convention: the flag is set exclusively in log-cupping.md STAGE 3 after the V_n leading slot is identified on cup grounds — NOT at roast-time in log-roast.md STAGE 3 on roast-structure grounds. The flag is by definition a cup-quality judgment ("reads as plausibly the lot reference"), and roast structure alone can mislead — late-blooming aromatic lots can roast cleanly without being cup-reference quality, and roughly-roasted slots can land surprisingly clean on the cup. Wait for cupping data. In log-roast.md STAGE 3, leave is_reference_candidate unset (NULL) on the push_roast payload. The flag's owner in the prompt chain is unambiguously log-cupping.md STAGE 3 § Mark the leading slot as a reference candidate. *Avoid*: "reference-quality slot" (ambiguous against reference roast); "winner" (V-set-scoped, see Leading slot); collapsing candidate and reference (the entire point of the flag is to keep the mid-flight assessment queryable distinct from the final designation).

### Reference Cup

Reference cup: The xBloom pour-over cupping of the reference roast at day-7 of rest — one standardized, mechanically-repeatable evaluation that defines what this coffee tastes like at peak roasted-bean state. Replaces an earlier 2-stage protocol (cupping-bowl day-4 + xBloom day-7); the bowl methodology was deprecated because too many coffees that tasted great on the bowl table "fell apart" at the xBloom step and couldn't hold up during the optimized brew — i.e. the bowl signal had too much brewing-tolerance noise mixed in. xBloom's mechanically-consistent recipe specifically isolates cup-side signals from brewing variance, which is what makes the underdev/overdev signal attribution possible. *Avoid*: "cupping bowl cupping" (deprecated), "tasting", "best cup", "final cup"

### Optimized Brew

Optimized brew: The pour-over recipe Chris dials in for daily consumption of the reference roast — real dripper, real filter, real water, finalized brewing variables. Produced by handing the reference roast into the brewing-side workflow (same flow used for purchased roasted beans — same iteration loop, same Coffee Brief, same Step 4 resolved-brew artifact). The consumption-condition endpoint of the full self-roasted pipeline; all post-hoc attribution traces backward from here, since this — not the reference cup — is what the lot actually tastes like when drunk normally. The self-roasted variant of reference brew — same workflow shape, distinct name because the word "optimized" emphasizes that this recipe pushes the bean past the constrained xBloom reference cup that was used to designate the reference roast in the first place. *Avoid*: "optimized recipe" (recipe is one component, not the whole), "final brew", "best brew", bare "reference brew" when context is specifically self-roasted (use "optimized brew" to keep the calibration-vs-consumption distinction crisp).

Link: the lot's optimized brew is attached via the explicit FK green_beans.optimized_brew_id → brews(id) (mirrors migration 069's peer FK), set at close-lot.md (V-set) / one-shot-closeout.md STAGE 3 (one-shot) from the brew_id carried in the optimized-brew handoff brief (ask-if-missing). This replaces the legacy pickOptimizedBrew roast_id = best_roast_id heuristic, which survives only as a fallback for lots closed before the column existed. Named optimized_brew_id not reference_brew_id to avoid colliding with reference roast / reference cup / reference brew. See `ADR-0019`.

## Roast-session operating protocol

The roast-session operating protocol defines the fixed physical routine Chris follows when roasting on the Roest. These rules govern session setup, between-batch reset, hopper pre-load, charge timing, and interpretation of within-session thermal effects.

This section is about **operator discipline**, not recipe design. Agents should design around these constants. When the goal is to change roast energy, use recipe-level levers such as peak inlet, inlet curve shape, fan curve, drum speed, end condition, or drop target. Do not treat the operator routine itself as the adjustment surface.

### Operator-fixed constants

Four constants apply in every roast session, across every V-set, green lot, and roast type:

1. **10-minute warm-up dry run**: turn on the Roest, heat for 10 minutes, then run one dry roast with no beans until drum temperature reaches 140°C.
2. **Between-Batch Protocol (BBP)**: run the fixed cooldown routine from the prior roast's ~140°C drum end-state down to the 120°C BBP endpoint.
3. **Hopper-load temp: 125°C**: when the drum cools to 125°C during BBP, the alert fires and Chris loads the green beans into the shoot / hopper. Beans do not enter the drum yet.
4. **Charge temp: 117°C**: when the drum reads 117°C, Chris pulls the lever. Beans drop from the hopper into the drum and the roast officially starts.

Canonical distinction: **load at 125°C, charge at 117°C**.

Recipe-schema-vs-lived-practice asymmetry: roast_recipes.charge_temp + roast_recipes.hopper_load_temp schema fields exist as if they were recipe-variable, but lived values are operator-fixed at 117°C / 125°C. Substrate proposals should write these defaults to recipe rows but not propose varying them across V-set slots. If a V-set's structural question genuinely REQUIRES varying the constants, the variation must be front-and-center in the primary_question + variables + rationale prose (not buried in a recipe row), AND the expert must explicitly flag to Chris that the constants are being varied — muscle memory will otherwise override the recipe.

### Session sequence

Standard session sequence:

1. Turn on Roest.
2. Warm up for 10 minutes.
3. Run a dry roast with no beans to 140°C.
4. Run BBP down to the 120°C endpoint.
5. At 125°C, load beans into the hopper.
6. At 117°C, pull the lever and charge beans into the drum.
7. Roast.
8. Roast ends around 140°C drum temperature.
9. Run BBP.
10. Repeat hopper-load / charge / roast for the next batch.

For a three-slot V-set:

```text
thermal reset -> BBP -> load at 125°C -> charge at 117°C -> V1a
V1a ends -> BBP -> load at 125°C -> charge at 117°C -> V1b
V1b ends -> BBP -> load at 125°C -> charge at 117°C -> V1c
```

Thermal reset happens once at session start. BBP happens after every real roast.

### Between-Batch Protocol (BBP)

**BBP** is the frozen between-batch routine that cools the Roest from the prior roast's end-state to the next roast's charge state.

Canonical BBP shape:

- Start from the prior roast's end-state, typically around 140°C drum temperature.
- Fan taper: 100% -> 60% at 0:30 -> 40% at 1:00 -> 25% at 1:45.
- End BBP at 120°C drum temperature.
- Hopper-load alert fires at 125°C during the cooldown path.
- Charge happens at 117°C.
- Typical duration is roughly 7 minutes.

BBP is distinct from thermal reset:

- **Thermal reset** drives the drum up.
- **BBP** cools the drum down.
- **Thermal reset** happens once at session start.
- **BBP** happens between every real roast.

Avoid: "between-roast cooldown" when the full BBP is meant, "thermal reset" as a synonym for BBP, "drum recovery."

### Hopper pre-load

**Hopper pre-load** is loading green beans into the Roest hopper at the 125°C alert, before official charge at 117°C.

The 125°C pre-load gives beans roughly 60-90 seconds of acclimation in the hopper before they drop into the drum. Drifting this timing can change cup quality. Prior observed drift between 125°C and 120°C pre-load created enough cup difference to make the 125°C lock load-bearing.

Avoid: "preheat" for hopper pre-load, "pre-charge," or "hopper load" without the temperature regime.

### Thermal reset protocol

**Thermal reset** is the dry-roast warm-up routine that equalizes the drum before the first experimental batch.

It runs the Roest through a controlled dry roast with no beans until the drum reaches 140°C. This solves the first-batch-of-session problem: a cold or under-saturated drum absorbs heat into its own mass rather than transferring energy consistently into the beans.

Use thermal reset when starting a roast session. Use BBP between real roasts.

Avoid: "deep reset," "drum reset," treating thermal reset as part of BBP.

### Session position effect

**Session position effect** is the thermal asymmetry across consecutive roasts inside one session.

Typical pattern:

- First roast runs slow because the drum is still absorbing heat into mass.
- Middle roast is the most thermally stable reference position.
- Third roast runs fast because the drum is more saturated and acceleration is in place.

Session position matters in two places:

1. **Pre-emptive V-set design**: put the most important batch in the middle position when possible. This is usually the slot closest to the anchor or the batch carrying the V-set's primary hypothesis.
2. **Post-hoc V-set interpretation**: separate variable-induced movement from session-position movement. If V1c fires FC earlier than V1b, some of that may come from the higher peak inlet, and some may come from third-slot acceleration.

Session position is independent from anchor confidence. Anchor confidence describes how well the prior profile fits the new lot. Session position describes the Roest's within-session thermal state.

Avoid: "first-batch effect," "session drift."

### Agent rules

- Treat 125°C hopper-load and 117°C charge as fixed.
- Treat BBP as fixed and not recipe-tunable.
- Treat thermal reset and BBP as separate routines.
- Use recipe-level levers when changing roast energy.
- Place the most important V-set slot in the middle session position when possible.
- Account for session-position effect when interpreting FC timing, drop timing, and roast-speed differences across slots.
- Use "load" for the 125°C hopper event.
- Use "charge" for the 117°C bean-drop event.


## V-set design and forward planning

### Experiment frame

Experiment frame: The design-time framing of a V-set: six fields set before any roasting happens — the primary question (what's being tested), an optional control baseline (if comparing to a prior roast), the shared constants held steady, the levels being varied, the expected outcomes at both the roast layer and the cup layer, and the failure boundary if a variable is pushed too far. Required fields are primary question, levels, and expected outcomes (both layers); shared constants and control baseline are usually given by the question; failure boundary is nice-to-have. *Avoid*: "experimental design", "experiment setup", "V-set design", bare "frame"

### Variable

Variable: A roast parameter being deliberately moved across batch slots within a V-set's levels-tested (peak inlet, dev time, drop temp, charge temp, ROR shape, fan curve, etc.). Design-time term — pre-judgment, before outcomes are in. A V-set tests 1–2 variables; everything else is held still as shared constants. *Avoid*: "knob", "dimension", "parameter" (when referring to the thing being moved), "lever" (lever is post-hoc — see below)

### Lever

Lever: A variable that, after roasting and cupping, turned out to produce an observable difference in the end cup — a post-hoc promotion from variable status. Subdivided into primary lever (the biggest difference-maker for this lot) and secondary lever (meaningful but smaller). A variable only earns lever status when cross-batch-slot or cross-V-set evidence supports the promotion. Promotion happens at lot-close synthesis, not at V-set close-out — per-V-set writes are slot-vs-slot comparative narrative (see V-set close-out narrative); the explicit lever sentence ("peak inlet is the primary lever for this lot") is a lot-close artifact, crystallized into roast_learnings.primary_lever / secondary_levers. *Avoid*: "key variable", "winning variable", "critical parameter"; declaring lever status mid-iteration (a variable that looks like a lever after V2 may still not be one after V3-V4).

### Non-factor

Non-factor: A variable that was tested across batch slots but produced no clear effect in the end cup. Doesn't get promoted to lever status, but the absence of effect is itself a useful lesson — recorded as a carry-forward learning. Like lever, the explicit declaration is a lot-close artifact, not a V-set close-out artifact — the term itself rarely appears in V-set close-out prose; the *concept* surfaces implicitly in slot comparisons ("peak inlet variation didn't move FC temp meaningfully across V2"). The crystallized non-factor sentence lives in roast_learnings.what_didnt_move_needle at lot-close. *Avoid*: "null variable", "inert variable", "dud", "what didn't matter" (use the noun form).

### Peak inlet

Peak inlet: The maximum inlet-air temperature on the temperature_bezier curve — the highest point the Roest's incoming-air heating reaches across a single roast. The canonical V1 primary variable on every active lot: V-set design typically uses peak inlet variation across slots as the primary spread (242 / 245 / 248°C across v1a / v1b / v1c is a standard pattern). Adjusted off the anchor profile's resolved value by stacking density / moisture / altitude contributions (see Multi-factor weighting). Lot-specific working ranges: high-density washed Colombian sits at 245-248°C; anaerobic naturals push up to 247°C; low-density Pacamara coffees may need 240°C or below to avoid breaching drop ceiling. Spread width (the °C range across V_n's slots) is set by Anchor confidence — narrow ±1°C at High confidence, wide ±5°C+ at Low / Very Low. *Avoid*: "peak temperature" (ambiguous — could mean bean temp or drum temp); "max inlet" (loses the curve-shape framing); "peak energy" (figurative — peak inlet is a specific scalar).

### Green spec

Green spec: The umbrella term for the green-bean physical and provenance bundle that drives V1 starting-hypothesis design: density (g/L), moisture (%), altitude (m), variety, process family. The complete green-spec is the design input to anchor profile selection + Signal precedence + Multi-factor weighting. Lot-specific deviations from the anchor's green spec trigger continuous adjustments: low density → -2 to -3°C peak inlet; high moisture → +1 to +2°C; extreme altitude → ±0-2°C. Gating function: when green spec is unmeasured (sealed-bag lots from some sellers — Untold, certain auction lots), variety-density-critical lots gate V1 until measured; less-sensitive lots proceed cautiously with a wider V1 spread. The ROASTING.md Green-Spec → Starting-Hypothesis table operates on this concept. *Avoid*: "green data" (under-specified — could include sourcing metadata); "bean spec" (overlaps with cultivar identity); "intake measurements" (only covers density + moisture, omits altitude/variety/process).

### Anchor confidence

Anchor confidence: Six-level ladder grading how strongly an anchor profile applies to the fresh lot being designed: High / Medium-High / Medium / Medium-Low / Low / Very Low. The terms appear verbatim in the inventory document's "Anchor Confidence" row. Determined by (in descending weight): (i) process-family match — washed-on-washed = high contribution; washed-on-honey = medium; washed-on-anaerobic = low. Process-family mismatch alone can drop confidence one tier even when everything else matches. (ii) Cultivar match — same cultivar > same genetic family > novel cultivar. (iii) Anchor's own resolution status — anchoring on an unresolved working profile (not a closed-lot reference roast) caps confidence at Medium regardless of other matches. (iv) Density / moisture proximity as tiebreaker — affects adjustment *direction* more than confidence level. (v) Number of prior similar lots carries less weight than expected: one well-resolved closed lot beats three half-resolved ones.

Inversely sets V1 spread width (the unstated half of the V1 width rule in Adjustment): High → narrow ±1°C peak inlet (refining around the anchor); Medium → standard ±2-3°C; Low / Very Low → wide ±5°C+, often asymmetric, exploratory (finding the response surface rather than refining on it). Low confidence is the case the V1 width rule's "wide-variance multi-variable exploratory" framing was built for.

On expensive lots the relationship is REDIRECTED, not overridden: the widening pressure from low anchor confidence still exists but gets channeled into a *different parameter* — pre-V1 risk reduction (see entry) — rather than spread width itself, which narrows per the lot-value precedence rule. Janson Pacamara at $300/kg + Medium confidence: density gating required, paired Untold-roasted cupping required, V1 spread narrowed to ±2°C (Mandela XO V2 shape) rather than ±5°C (V1 width). Finca Deborah at $419/kg: full deferral until natural-Gesha framework resolves on Gesha Clouds AND Wush Wush. Anchor confidence and lot value adjust DIFFERENT parameters; the apparent tension dissolves into a layered structure.

Deferred is a distinct field state, not a 7th confidence level — meaning "no anchor available in the archive yet; V1 design halted pending archive growth." Appears in the inventory document's Anchor Roast field as "TBD — pending [Lot X] resolution" (Aurum Geisha pending Gesha Clouds resolution; Finca Deborah pending the Gesha-family lots resolving). A precondition state: a Deferred lot cannot be V1'd at all, distinct from a Very Low lot which can be V1'd with a wide exploratory spread.

The phrase "more a starting point than a recommendation" (from Daterra Laurina's inventory entry, anchored on Sudan Rume Natural at Very Low confidence with novel-cultivar caveat) is doing vocabulary work at the seam where Very Low confidence shades toward Deferred — the anchor exists structurally but isn't really anchoring much. Operationally this is still Very Low (proceed wide), not Deferred (don't proceed). *Avoid*: collapsing the 6 levels to fewer values when filling the inventory field; reading "Very Low" as equivalent to "Deferred" (the former: "anchor exists but doesn't fit"; the latter: "no anchor exists yet").

### Signal precedence

Signal precedence: The structural model for categorical / discrete design decisions in roast design — one signal wins outright, others are overridden. Applies when the output is a categorical choice drawn from a discrete set: which anchor profile to select, which end condition mechanism (dev_time vs bean_temp), which drop ceiling regime, whether to gate V1 design (Deferred). Each precedence rule is shaped "Signal A overrides Signal B when triggering condition C is present" and is lot-conditional, not global — there's no fixed priority order across all lots; specific conditions trigger specific overrides.

Operating precedence rules (working memory, not yet doc-formalized):

1. Process family overrides density adjustment when fermentation-cellulose modification is present (heavy ferment / anaerobic / XO). The fermentation layer's thermal behavior matters more than density variation.
2. Fruit-layer thermal insulation overrides density-driven energy hedging on naturals. Fruit layer needs MORE energy to drive FC timing into range, not less — density adjustment direction inverts. (FC-timing override; flavor lesson can run opposite direction once timing is in range.)
3. Variety-difficulty overrides anchor confidence calibration. When the variety has documented atypical thermal/structural behavior (Daterra Laurina's pointy small beans), anchor confidence drops independently of anchor-match quality.
4. Drop ceiling discipline overrides FC-timing chase. When dev compression would force a drop ceiling breach, hold the ceiling and accept compressed dev — the FC-temp-architectural-constraint pattern.
5. Silent-FC expectation overrides dev-time-end-condition standard. Default end condition is dev_time; on silent-FC family lots it becomes bean_temp at target drop temp.
6. High lot value narrows V1 spread; anchor-confidence-widening pressure redirects to pre-V1 risk reduction. These are a layering, not a head-on precedence: lot value narrows V1 spread (cost of wide miss is high), while anchor confidence's widening pressure gets channeled into Pre-V1 risk reduction (density gating, paired roasted-reference cupping, producer outreach, deferral). The two rules adjust DIFFERENT parameters; not competing precedence.
7. Active unresolved-anchor process family overrides one-shot timing. When the only available anchor is itself unresolved, defer the one-shot rather than proceed against unresolved-anchor risk.

The closest thing to a global precedence rule: closed-lot anchor evidence always outweighs general process-family guidance from ROASTING.md tables — but this is barely a precedence rule, more a re-statement of "anchor profile is more load-bearing than generalized table guidance" (see Anchor profile).

Explicit vs implicit in prose: precedence reasoning is explicit when the override is unusual or counterintuitive ("HARD OUTLIER," "if process turns out to be heavy ferment"); implicit when it's encoded in the family-anchor selection itself (selecting the heavy-ferment anchor IS the precedence decision, no restatement needed). The override is named by reference to the specific trigger in prose, not by reference to a precedence-rule registry.

Distinct from multi-factor weighting: precedence governs categorical decisions; weighting governs continuous numerical adjustments. Both happen in the same V1 design pass — categorical precedence picks the anchor + end-condition regime, then weighting adjusts continuous parameters within that regime.

Storage open question: precedence rules may not need a separate registry — they're effectively carry-forward learnings that operate at the design-decision layer rather than the parameter-adjustment layer. Whether to tag them as "design-precedence" carry-forwards or canonicalize them in their own list is undecided.

Avoid: "signal override" (brewing-side term — overlaps semantically but brewing's framework is pure precedence; roasting's has the precedence/weighting split, so naming-as-brewing-side conflates them); "priority order" (suggests global ranking; rules are lot-conditional); "design rule" (too generic).


### Multi-factor weighting

Multi-factor weighting is the structural model for continuous numerical adjustments in roast design. Multiple signals contribute hedged adjustments that sum, cancel, or conditionally dominate without categorically overriding the others.

Use multi-factor weighting when the output is continuous:

- peak inlet adjustment off anchor
- fan-curve modification
- V1 spread width
- Maillard % tolerance window
- drop temp target within the drop-ceiling regime

Operating shape: peak inlet adjustment off anchor stacks density contribution (-2 to -3°C if low density) + moisture contribution (+1 to +2°C if high moisture) + altitude contribution (±0-2°C if extreme). The result is a hedged operator-judgment composite.

Distinct from **Signal precedence**: precedence governs categorical decisions such as which anchor, which end condition, or whether to defer. Weighting governs numerical adjustments after the categorical path is selected.

Avoid: "additive model" as the whole roasting model, "signal sum" when conditional sign-flips or judgment-weighting are involved.

### Pre-V1 risk reduction

Pre-V1 risk reduction: The bundle of practices Chris runs *before* committing to a V1 design when anchor confidence is low or lot value is high — distinct from the V1 design itself. Includes: density / moisture measurement gating (V1 cannot proceed until intake measurements are taken on variety-density-critical lots); paired roasted-reference cupping (cup the seller's roasted version of the same green before V1 design, to establish a target reference cup); producer outreach (when a relationship exists, ask the producer or exporter for processing detail / recommended roast direction); full deferral (no V1 until adjacent lots in the same process family resolve in archive — Finca Deborah pending Gesha Clouds + Wush Wush).

The redirect target for anchor-confidence-widening pressure on expensive lots (see Anchor confidence). Low confidence + high lot value doesn't widen V1 spread — instead the widening pressure shows up here, in pre-V1 work that reduces uncertainty before the design commits. The cleanest operational signature: a Janson Pacamara V1 spec that reads "density measurement required → Untold-roasted paired cup required → V1 spread ±2°C" rather than the unrestricted-confidence form "anchor on Mandela XO + V1 spread ±5°C." *Avoid*: "pre-V1 work" (under-specified — could mean basic intake); "V0" (Chris doesn't use V-zero notation; the practices are pre-experiment, not a virtual V-set); "intake gating" (covers only the measurement subset).

### Anchor profile (or anchor in conversational form)

Anchor profile (or anchor in conversational form): The parametric reference for designing V1 on a fresh green-bean lot — a specific resolved roast whose curve shape, fan curve, drop temp, and hopper pre-load are taken as the starting point for the new lot's design. The upstream input to V1 design: adjustments stack on top of the anchor's resolved parameters; V1 spread width is set inversely to anchor confidence; and the new lot's first three batches inherit the anchor's shared constants. Primary referent class is a closed-lot reference roast batch # (Sudan Rume Washed CF-Light #133 for the washed family, Mandela XO #139 for the heavy-ferment family — the canonical examples). Three secondary referent classes appear in real prose, in descending operational weight: (i) closed-lot reference roast by lot name without a specific batch #; (ii) an unresolved lot's V-set working profile (provisional — caps confidence at Medium); (iii) a generalized process-family hypothesis when no specific batch fits ("the heavy-ferment family profile"). The conversational shorthand anchor is canonical inside roasting context ("anchor on #133," "anchor on Mandela XO"); the formal noun anchor profile appears as the field label in the inventory document and as the opener in V1-design sentences ("anchor on Sudan Rume Washed CF-Light reference profile (#133)"). The inventory column header "Anchor Roast" is the same concept under a schema-influenced label.

### Adjustment

Adjustment: The deliberate design move from V_n to V_{n+1} that changes one or more variable levels with the intent of moving the cup in a specific direction. Informed by V_n's cupping deltas + carry-forward learnings of prior lots + the producer-notes ballpark check. Scale-dependent - concretely mapped to V-number bands:

* V1 (and often V2): wide-variance, multi-variable exploratory. Spread can be wide on multiple axes simultaneously (lower / medium / higher peak AND faster / slower decline across the same three slots). The point is to *find the response surface*, not to narrow on it. ~5°C+ peak inlet spread is fine and often correct.
* V2 → V3: narrow on V2's leading slot, usually single-variable. 1-2°C peak spread is typical, or replicate V2's leading slot with two slight adjustments (a control experiment). V2 stays wide-ish when V1's signal was ambiguous (still in search space).
* V3+: probe a NEW variable held constant in V_1…V_3 (fan curve through development, drop temp ceiling at fixed peak inlet, charge temperature, hopper pre-load), or run a control experiment to lock in the reference roast.

Override: if V_n's open_questions explicitly demand re-bracketing ("we don't know if the window is in this range at all"), widen the spread regardless of V number. The unit of forward design between V-sets - authored by claude.ai as part of the post-cupping update. *Avoid*: "tweak" (too casual, implies small), "iteration" (V-set is the iteration), "variation"

### Tolerance-anchored design

Tolerance-anchored design: The roast-design philosophy for one-shot lots (single batch, no iteration possible). Distinct from V1's wide-variance exploratory framing AND from V_{n+1}'s narrow-convergent framing. The anchor is the anchor profile from a similar prior closed lot (graded by its anchor confidence level); the design rule is to land central within the anchor's resolved parameters with deliberate margin on both sides. Concretely: NOT a super-fast / very-low-tolerance roast (no room if FC arrives late), NOT a super-long / pull-at-the-last-second roast (no room if FC arrives early), middle-of-the-road for operator grace. The goal isn't to find a response surface or to converge on a reference - it's to produce something workable on the single attempt, accepting "workable" may be less than reference quality. Pairs with the schema constraint on roast_learnings (migration 054) that one-shot lots cannot populate lever-attribution fields - the design philosophy and the data model both acknowledge that N=1 doesn't support variance attribution. *Avoid*: "safe roast" (not specific enough about the carry-forward anchor), "middle path" (loses the anchor framing), "exploratory single-shot" (contradictory - one-shots aren't exploratory)

### Control experiment

Control experiment: A V-set whose purpose is to *lock in* a candidate reference roast rather than explore new variables — replicates the leading batch slot with two slight adjustments to confirm the winner before lot-close. Distinct from an exploratory V-set (which tests variables to discover levers). *Avoid*: "confirmation V-set", "final V-set", "verification roast"

### Acceptable roast window

Acceptable roast window: The range of values for the primary lever within which the cup stays in the desired zone for this lot — e.g. "dev time 25–35s, with 30s as the best point; below 25s tastes grassy, above 35s tastes roasty". The playable zone for repeating the reference roast. Narrow window = unforgiving lot; wide window = lot tolerates roast deviation. *Avoid*: "roast window" (under-specified — the qualifier is load-bearing), "tolerance band", "playable zone", "latitude"

## Roast diagnostics and failure signals

### Development (roasting sense)

Development (roasting sense): The whole-curve completeness of a roast — *not* the classical post-first-crack-only definition, but the full curve shape from charge → Maillard → FC → drop, *plus* the internal-vs-external uniformity measured by the Agtron delta between whole bean (WB) and ground bean (Gnd). A large WB→Gnd delta means the bean looked roasted on the outside but stalled inside; a small delta means even development. *Avoid*: "dev time" (too narrow — that's only the post-FC slice), "roast completeness" (close, but doesn't capture WB/Gnd uniformity), "roast level" (refers to color, not completeness)

### Underdev signal

Underdev signal: The cup-side sensory marker that appears in batches of this lot when development is too low — too-short whole-curve completeness OR uneven development (high WB→Gnd Agtron delta). Lot-specific fingerprint (grassy / hay / sour / underextracted-acidity vary by cultivar/terroir). Distinct from roast-side observations like "the roast looked stalled" (different concept). *Avoid*: "under-roast", "stalled roast" (roast-side, not cup-side), "underextraction" (brewing concept)

### Overdev signal

Overdev signal: The cup-side mirror — sensory marker that appears in batches of this lot when development runs too long or too hot. Lot-specific (roasty / nutty / ashy / muted / dark-chocolate-heavy vary by cultivar/terroir). Same cup-side framing as underdev signal. *Avoid*: "over-roast", "burnt", "carbonized" (roast-side or pejorative-aesthetic)

### Maillard %

Maillard %: The percentage of total roast time spent in the Maillard reaction phase — drying-phase end (yellow point) through FC start. A primary completeness diagnostic alongside WB→Gnd Agtron delta. Target window: 40-44% for landing the cup in the design zone on audible-FC lots. Failure boundary: >50% indicates the bean ran too long in Maillard relative to FC and drop, producing baked / muted character. Tolerance widens to ~48% on silent-FC lots because the Maillard % calculation depends on an upstream FC mark that's unreliable when FC is silent — the value carries more error and the operating window absorbs that. Computed from the curve as roughly (fc_start - yellow_time) / drop_time × 100 (or (drop_time - yellow_time) / drop_time × 100 for the looser "yellow-through-end" framing — both forms appear). Not a per-recipe field (lives implicitly in the curve shape); referenced in V-set close-out narrative when relevant.

Computation rule on did_not_fire batches: when fc_audibility = did_not_fire (or fc_start is NULL for any reason), do NOT compute Maillard % — there is no FC mark to anchor the phase split, so the calculator returns a structural artifact. Record "Maillard % N/A (FC did not fire)" instead. The same N/A convention applies to dev time; the dev_time_s / fc_start / fc_temp null co-rule is DB-enforced (migration 068 CHECK constraint roasts_did_not_fire_nulls_check). See [docs/skills/roest-knowledge/cluster/protocols/fc-marking.md](docs/skills/roest-knowledge/cluster/protocols/fc-marking.md) for the protocol stack + Roest UI behavior. *Avoid*: "browning %" (overlaps with Agtron color reading, different concept); treating the 40-44% target as absolute on silent-FC lots (tolerance widens — see FC audibility state); reporting a computed Maillard % on did_not_fire batches (record N/A instead).

### WB→Gnd Agtron delta (or delta in unambiguous roasting context)

WB→Gnd Agtron delta (or delta in unambiguous roasting context): The magnitude (absolute value) of the difference between Agtron readings on whole-bean (WB) and ground (Gnd) samples of the same roast, in Agtron points. The quantitative diagnostic-primary for the Development uniformity that underdev / overdev signals capture qualitatively on the cup side — small delta means surface and interior reached comparable browning; large delta means one outran the other. Two polarity patterns appear by lot family, which is why the sign is fuzzy in lived prose: (1) conventional case — Gnd reads lighter (higher Agtron) than WB, since grinding exposes the less-developed interior; common in washed coffees with no fermentation insulation. (2) Heavy-ferment / fruit-layer case — WB reads lighter than Gnd, since fermentation cellulose insulates the surface and the interior develops more uniformly than the surface implies; Mandela XO #139 (WB 76 / Gnd 72.4, delta 3.6) is the case study. Operational vocabulary tracks magnitude, not sign; name the surface-vs-interior pattern in prose when it matters, do not encode it in the delta scalar. Note: ROASTING.md's "large delta = stalled inside" framing in the Development entry maps to the conventional case only and should be read as pattern (1)-specific, not universal.

Threshold vocabulary (anchor-relative, not table-driven): tight (≤~2 points, best cup quality correlation), working / V2-typical (3-5), wide (>5), stalled (>10 in extreme cases). The directional verb shrinking describes a delta tightening over successive V-sets — a reliable convergence signal that the profile is on the right track.

Anchor-relative, not table-driven: in active-lot writing, "what counts as tight here" comes from the closest anchor profile's resolved delta (Sudan Rume Washed CF-Light #133 = 1.0 for the washed family; Mandela XO #139 = 3.6 for the heavy-ferment family), not from ROASTING.md's "WB-to-Ground Agtron Delta Norms by Processing Method" table. The table is the downstream crystallization of the anchor-profile pattern; the anchors are the canonical reference in operational prose. (The pair of WB and Gnd readings together has no canonical pair-noun in lived prose — "WB / ground" or "WB 76 / ground 72.4" is the everyday form. Intentional non-lemma.) *Avoid*: "Agtron difference," "Agtron gap," signed-delta conventions baked into the scalar (use the magnitude + a prose pattern label instead), bare "delta" in cross-domain contexts where brewing-side delta could be confused.

### FC floor

FC floor: The lot-family-specific bean temperature below which FC produces an underdeveloped cup regardless of downstream dev time — a soft, statistical lower bound on where FC needs to arrive for the cup to land. Below the floor, the cup reads grassy / hay / underextracted-acidity (the underdev signals) and the underdevelopment doesn't resolve via dev time extension. Above the floor, the cup is rescuable through dev time and drop temp management. The "where FC needs to arrive" bound, NOT a "the bean is broken" bound — coffees can fire FC below the floor without being defective; the cup just won't land in the desired zone. Lot-family-specific: high-density washed Colombian sits at ~200°C; anaerobic naturals push the floor up to ~204-206°C because fermentation cellulose insulation requires more thermal energy to initiate pyrolysis. Asymmetric in hardness with drop ceiling — the floor is soft (statistical-observation flavored), the ceiling is hard (cup-quality-damage flavored). *Avoid*: "FC target temperature" (overloaded with the planned-vs-actual FC temp); "FC minimum" (loses the cup-side framing); treating the floor as a hard "the bean is broken" bound.

### Drop ceiling

Drop ceiling: The lot-family-specific bean temperature above which the cup goes overdeveloped — aromatics suppress, body gets heavy, the lot's signature character disappears (lemongrass / jasmine / bergamot on Sudan Rume Washed, e.g.). A hard cup-quality bound in a way the FC floor is not, because overdevelopment damage is harder to recover from than underdevelopment misreads. Lot-family-specific: high-density washed sits at 207-208°C; silent-FC heavy-ferment lots tighten to 203-205°C because the silent-FC variable adds uncertainty and drop ceiling becomes the primary mechanism preventing overdevelopment. Asymmetric in hardness with FC floor — drop ceiling is the harder of the pair; breaching it produces irreversible cup damage. Distinct from roasts.drop_temp (the per-roast actual where drop fired) and roast_recipes.end_condition_target (the per-recipe planned drop trigger) — drop ceiling is a per-lot-family parameter that informs the recipe's planned trigger. *Avoid*: "drop temp target" (overloaded with the planned drop temp itself, which sits below the ceiling); "max drop temp" (loses the cup-side framing); "upper bound" (under-specified about which kind of bound).

### Dev headroom

Dev headroom: The bean-temperature window between FC firing and drop ceiling — the space inside which dev time has room to run. When FC fires too early (below FC floor), dev runs long but underdevelopment doesn't resolve — not a headroom issue but a floor issue. When FC fires too late (close to drop ceiling), dev headroom collapses → forced choice between early drop (dev compressed, underdeveloped) or breached ceiling (overdeveloped). The "FC-temp-architectural-constraint" pattern on heavy-ferment lots: FC anchors at 204-206°C across peak inlet variation, drop ceiling is 207-208°C, so dev headroom is only 1-4°C — too narrow to land development reliably. The pinch is structural to the lot family, not a roast-design failure — anchor selection can't fix it, only protocol adjustments (bean-temp end condition, tightened drop ceiling, peak inlet hedging) can navigate around it. *Avoid*: "dev time window" (different — dev time is the seconds, dev headroom is the temperature room); "FC-to-drop window" (close, but misses the cup-side ceiling-vs-target distinction).

### FC audibility state (or audibility)

FC audibility state (or audibility): The five-value enum (roasts.fc_audibility, migration 061; 5th value did_not_fire added migration 066) describing the audible expression — or non-occurrence — of the first-crack event for a single roast batch. Four of the five values (subtle / silent / ambiguous / did_not_fire) trigger the same downstream protocol response, but the distinction matters for cause attribution and for predicting audibility on future similar lots. The five values split along a **bean-property vs operator-property axis**:

1. Audible: clear cracking, multiple snaps in succession, the canonical FC sound; FC is easy to mark and dev time measurable from the mark. *Bean-property*: cell-wall structure intact, steam-pressure release produces snap.
2. Subtle: partial audibility, some snaps but not the canonical multi-snap signature. *Bean-property*: cell-wall structure modified enough to reduce expression but not eliminate it. Treated operationally as not-audible, BUT the FC timestamp is real and trustable when a specific fc_start fires — record fc_start / fc_temp / dev_time_s from the timestamp as captured. Structurally distinct from did_not_fire (event happened, weakly) — do not coerce subtle into the no-event case.
3. Silent: no audibility detected. *Bean-property*: cell-wall structure modified enough (fermentation cellulose degradation, heavy anaerobic processing) that no snap fires; FC structurally happened (detectable via RoR flattening + bean temp climbing through the FC range) but produced no sound. "Inaudible" is a near-synonym with operator-property shading.
4. Ambiguous: *operator-property* uncertainty — the operator couldn't tell whether FC happened, missed it, or it's still upcoming. Distinguished from Silent by hedging tone: silent = bean produced no sound; ambiguous = operator can't be sure.
5. did_not_fire: the FC event was not detected by either the Roest auto-mark or the operator manual mark, AND the bean-temp endpoint supports the read that FC structurally did not happen (bean topped out below the FC window). When set, fc_start / fc_temp / dev_time_s MUST be null. Distinct from silent: silent = event happened without sound; did_not_fire = event didn't happen.

**Disambiguation rule** (did_not_fire vs silent vs ambiguous, when no detection fired): bean below the ~200-205°C FC window → did_not_fire; bean reached/exceeded the window + no detection + no audible crack → silent; bean reached the window + no detection + operator hedging on a faint sound → ambiguous. The bean-temp endpoint (objective) + the operator's hedging tone (subjective) jointly resolve which "no detection" state applies.

The four not-audible values share one operational protocol response (bean-temp end condition, drop-ceiling-primary, Agtron-delta proxies). That protocol stack, the Roest auto-detect mechanics, the manual-mark dual-threshold discipline, the lot-family coverage map, the audibility-window hypothesis, and the schema-render details all live in [docs/skills/roest-knowledge/cluster/protocols/fc-marking.md](docs/skills/roest-knowledge/cluster/protocols/fc-marking.md).

*Avoid*: "inaudible" as a distinct fifth state (synonym of Silent with operator-property shading); "no FC" as a state label distinct from did_not_fire (use did_not_fire); collapsing did_not_fire and silent (silent = event happened without sound; did_not_fire = event didn't happen); "missed FC" (operator-failure framing); coercing did_not_fire into ambiguous (ambiguous is operator-property uncertainty, did_not_fire is the bean structurally not getting there).

### Fan curve

Fan curve (with shaped fan curve and heavy-ferment fan curve as variants): The bezier curve specifying fan percentage across timestamps during a roast. Bare noun "fan curve" is the umbrella; canonical variants differentiate by shape:

* Shaped fan curve: multi-segment fan curve with deliberate dips and rises across timestamps (e.g. 80→68→63→70→73% across the Roest's 7 timestamps). The adjective "shaped" is load-bearing — it differentiates from monotone fan curves (simple linear taper, flat hold at 80%, linear ramp). #133 Sudan Rume Washed CF-Light's shaped fan curve is the canonical washed reference.
* Heavy-ferment fan curve: specific shaped-fan-curve variant with floor values 2-3 points LOWER in the Maillard window (63-65% vs 65-68% for the washed shape) — heavy-ferment lots benefit from lower fan during Maillard development. #139 Mandela XO's fan curve is the canonical XO reference.

Variants aren't formally enumerated anywhere — they crystallize through anchor lots, not through a published taxonomy. Adding a new variant is a deliberate anchor-derived observation, not a registry edit.

Relationship to inlet curve: paired but independent. Specified separately, adjusted separately, reasoned about separately. Inlet curve sets the energy *delivery profile*; fan curve modulates how that energy *interacts with the bean*. Adjustments to one don't automatically imply adjustments to the other. Weakly hierarchical at V1 design — inlet curve is usually held closer to anchor than fan curve (peak inlet is the canonical V1 variable; fan curve is more often a shared constant) — but that's a workflow preference, not a structural hierarchy. *Avoid*: "fan profile" (overlaps with the Roest machine's "profile" terminology, different scope); "fan ramp" / "fan taper" (describe MONOTONE fan curves specifically, not shaped variants).

### Roasted bean characteristic

Roasted bean characteristic: The attributes of the reference roast that carry through to the brewing step — its expressiveness (loud / muted), its preferred brewing direction (suits Full Expression vs Suppression vs Clarity-First, etc.), and its brewing tolerance. Determined by the roast end-state; consumed by the brewing-side workflow when dialing in the optimized brew. *Avoid*: "roast profile" (overloaded — already means the Roest machine recipe), "bean character", "roast result", "post-roast profile"

### Brewing tolerance

Brewing tolerance: How well the reference roast holds up when brewing variables are pushed toward extremes (Full Expression / Suppression / Extraction Push / etc.). High brewing tolerance = the cup stays coherent across a wide brew range; low brewing tolerance = the cup "falls in on itself" when pushed.

Distinct from acceptable roast window: this is brew deviation latitude, not roast deviation latitude. A 3-axis "Roast Character" attribute alongside primary lever and acceptable roast window.

Avoid: "elasticity" (deprecated except in motto context), "brew robustness", "flex", "roast resilience"


## Cupping and cup-character interpretation

### Roast -> Cup Trace

Roast→cup trace: The causal-attribution chain across two layers — roast (design intent → actuals → delta) and cup (V-set hypothesis → actuals → delta) — that lets observed surprises be localized to either the roast deviating from plan or the prediction itself being wrong. The whole point of comparative 3-batch V-sets is that the trace becomes tasteable across slots — and the trace surfaces operationally as comparative narrative across slots, NOT as 18 per-slot cells. Two asymmetries are load-bearing in lived practice (the earlier symmetric framing didn't capture them):

(1) Roast-layer delta is exception-write, cup-layer delta is always-write. When the roast hits its design intent, lived prose just notes the metrics and moves on — the predicted-vs-actual comparison stays implicit (expectations were encoded in the V_n recipe). Only when the roast surprised (FC fired early, drop ceiling breached, Maillard ran long) does explicit roast-delta prose appear. Cup-layer delta, by contrast, is the spine of the verdict — written every V-set close-out, against the V-set hypothesis (not against a post-roast updated cup prediction, which itself is rarely written explicitly).

(2) Cup-side decomposition is V-set-wide, not per-slot. Roast-side observations live per-slot (numeric metrics row + one-line roast observation per slot). Cup-side observations live as one V-set-wide narrative paragraph comparing the slots against each other on aromatic presentation / hot-vs-cool behavior / cup-character ranking / producer-notes ballpark — plus a verdict sentence + V_(n+1) implication sentence. The schema's per-slot cup fields (observed_outcome_a/b/c/d, updated_cup_prediction_a/b/c/d, taste_for_a/b/c/d, delta_from_cup_a/b/c/d) capture the conceptual structure but populate either from the V-set-wide narrative or stay null. Schema-as-designed and writing-as-practiced are deliberately mismatched at this seam — see flagged ambiguity.

The operational unit that produces the trace is the V-set close-out narrative (separate entry); this trace entry names the conceptual chain, the narrative entry names the writing shape. *Avoid*: "prediction trace", "delta chain", "expectation pipeline", "predict-observe loop"; "per-slot trace" or "18-cell trace" (mis-frames the V-set-wide cup-side structure as per-slot).

### Taste-for

Taste-for: The schema concept (experiments.taste_for_a/b/c/d) names a focal-attention hint set per batch slot, intended to be populated between log-roast and log-cupping — three reference points per slot: producer tasting notes (external ballpark check), prior-V-set tasting memory (where am I vs the last try on this lot), and the specific adjustment being tested this round (where the lever is supposed to move the cup). *Not* a prediction of what the cup will taste like (that's updated_cup_prediction), but a directional list of what to *listen for* on the cupping table.

Lived practice deliberately does not pre-articulate this per-slot. Pre-writing a taste-for list before cupping risks biasing the palate — the taster ends up looking for the descriptors they wrote down instead of letting the cup speak (single-palate honesty being non-negotiable in Chris's workflow). The three reference points still operate in cupping prose, but implicitly — during real-time tasting at the table, the hypothesis frame + producer notes + V_(n-1) memory inform descriptor selection without being pre-listed. The post-hoc V-set close-out narrative does the comparison work the pre-written taste-for would have done; the schema fields are therefore commonly null. This is a principled workflow disagreement with the schema-encoded pre-articulation pattern, not a discipline gap. The schema retains the fields for future use (or for partial population when claude.ai writes without Chris at the cupping table); the writing practice routes around them. *Avoid*: "cup prediction" (different field — that's updated_cup_prediction); "tasting plan" (overformal); reading the schema's per-slot fields as evidence that pre-articulation is the working discipline.

### Producer tasting notes

Producer tasting notes: The flavor notes the producer / farm / exporter prints on the bag or website, recorded against the green-bean inventory row. Used as an external *ballpark check* during cupping ("am I in the right zone?"), never as a target — tasting is single-palate (Chris is the only taster) and the goal is calibrated self-experience, not producer-match. *Avoid*: "producer notes" (ambiguous — could mean roast notes), "vendor description"

### Cup character

These describe what a cup IS when roasted correctly, distinct from diagnostic signals (which describe failure modes).

### Aromatic behavior

Aromatic behavior: How a cup's aromatics present in time and intensity — immediate vs late-blooming, expressive vs muted, lifted vs grounded, sustained vs transient. Per-tasting observation tied to a specific cupping event. Stored on cuppings.aromatic_behavior (migration 062, ADR-0008) — relocated from roast_learnings because the field describes what a cup IS, not what a lot TAUGHT. Lot-aggregate carry-forward lives on roast_learnings.cultivar_takeaway / general_takeaway / etc. *Avoid*: "aroma profile", "aromatic signature"

### Structural behavior

Structural behavior: How a cup presents structurally — the shape and balance of acidity, body, and finish, separate from flavor. Per-tasting observation. Stored on cuppings.structural_behavior (migration 062, ADR-0008) — same relocation rationale as Aromatic behavior. *Avoid*: "mouthfeel" (too narrow — that's just body), "cup structure"

### Cooling arc pattern

Cooling arc pattern: A canonical 4-value enum for the SHAPE of how a cup changes across its cooling arc — `degrade` (cools worse: loses balance / turns bitter / flattens), `hold` (good and steady, no meaningful change), `improve` (opens up / gains sweetness / integrates better as it cools), `flat` (low-amplitude / muted, little movement either way — distinct from `hold`: flat is the absence of amplitude, hold is good-and-steady). Stored on cuppings.cooling_arc_pattern (migration 078). The queryable mirror of the Temperature behavior PROSE (which carries direction + when + what changes) — the enum exists so cross-lot "which lots cooling-arc degrade vs hold" is canonical-queryable instead of regex-on-prose. Per-cupping observation; one value per cupping row; set alongside temperature_behavior, not instead of it. *Avoid*: folding it into temperature_behavior (the prose stays — the enum is additive); "cooling curve" (collides with Cooling-Curve Target on the brewing side — different concept); using `flat` and `hold` interchangeably.

### Rest behavior

Rest behavior: How a roasted lot evolves across post-roast rest days (Day 4 / 7 / 10+) AND across cross-cup vehicle comparisons (April brewer vs xBloom) AND storage observations (foil-bag temperature, ambient). Three-thread content scope. Lot-level pattern, not per-cup observation — correctly placed on roast_learnings.rest_behavior (not relocated to cuppings; that relocation was specific to aromatic + structural behavior per ADR-0008). Use when the lot teaches something about rest evolution worth carrying forward. *Avoid*: "rest curve" (already used elsewhere as RoasterEntry.restCurve — different concept), "aging behavior"

### Rest-days drift

Rest-days drift: A discrepancy in cuppings.rest_days between cuppings being compared, captured as a prose-only convention via the REST_DAYS_DRIFT: prefix in cuppings.additional_notes. Distinct from Rest behavior (which is the lot-aggregate evolution pattern across rest days) — drift is the *cross-cupping comparison* problem ("V5A at Day 9 was compared against 169 at Day 17 — +10 days drift"), not the per-lot rest-evolution pattern. Two structural sources:

1. Within-V-set scheduling drift (~1-2 days, managed): Chris can't do 3-5 cuppings in a single day (each takes ~30+ min, done before work), so the assistant spaces them out — e.g. 3 same-day roasts get cupped at Day 6 / Day 7 / Day 8 to fit the calendar while staying inside the Day 6-10 acceptance window. This drift is managed scheduling, treated as noise when material. The existing log-cupping.md STAGE 3 convention flags this case ("cupped Day <N>, off the Day 7 gate by <delta>").
2. Cross-V-set comparison drift (7+ days, structural): in a Simulated Pourover Gate / candidate-runoff cup-set, V_n's candidate is brewed alongside V_(n-1)'s candidate. The V_(n-1) candidate has typically been resting 7+ extra days (the roasting cycle is long). Chris's mitigation: pick the closest-to-the-date candidate from V_(n-1) when possible; accept the comparison unfairness when not, and denote it explicitly. *No structured experiments yet exist on rest-days effects across this magnitude*, so the comparison interpretation must hold the drift as a confounding variable. The Sudan Rume V5A (Day 9) vs 169 (Day 17) case is the canonical lived instance.

Schema scoping decision: prose-only is the right shape. cuppings.rest_days already captures the absolute age per cupping; drift is a relational concept (delta between two cuppings) derivable at query time, not a per-row property. A per-row rest_drift_flag or rest_drift_days field would duplicate derivable data with implicit comparison reference; the prose prefix in additional_notes catches the at-comparison-moment hedge where it matters operationally. If cross-lot drift analysis becomes a real workflow, build a query-time SQL view, not a per-row field.

Avoid: "rest discrepancy" (less specific — "drift" implies the relational comparison shape); treating drift as a per-row schema concept (it's relational and prose-tracked); collapsing the two sources into one (the within-V-set scheduling case is noise; the cross-V-set comparison case is structural).

## Roasting lifecycle states

### In inventory

In inventory: A green-bean lot that has been purchased and is physically at home but has not yet been onboarded into the V-set workflow — no experiment frame, no roast profile, no Latent app row. Tracked in the claude.ai project's inventory sheet, not in the Latent app today (deliberate scope choice — may surface later). *Avoid*: "uncommitted", "pre-experiment", "not started", "queued", "fresh"

### Waiting for next roast

Waiting for next roast: A green-bean lot whose latest V-set has been designed and the recipes pushed to the Roest machine, but the physical roasting hasn't happened yet. Covers both the first V-set (just-onboarded lot, V1) and mid-cycle V-sets (V_{n+1} designed by claude.ai right after V_n's cupping update). The next move is physical: Chris roasts at the machine. *Avoid*: "ready to roast", "roast pending", "in queue"

### Waiting for next cupping

Waiting for next cupping: A green-bean lot whose latest V-set has been fully roasted but not yet xBloom-cupped at day-7 of rest. Roast data is back in the app; the next move is physical: Chris does the day-7 cupping (which then triggers claude.ai to design V_{n+1} and the lot bounces back to "Waiting for next roast"). Day-7 is the target; actual days-post-roast varies with calendar affordances and gets recorded per cupping. *Avoid*: "ready to cup", "cupping pending"

### Resolved

Resolved: A green-bean lot whose lifecycle is closed: a reference roast has been declared after a winning xBloom cupping, the reference roast has been handed off to the brewing-side workflow and an optimized brew has been dialed in, and all learnings have been rolled up. No further V-sets planned. Replaces the active sage-tile rendering with the green-tile + "Resolved" badge.

### Unresolved

Unresolved: The fifth lifecycle state — a closed lot that produced a roast_learnings row but did NOT crystallize a confirmed reference roast. The discriminator against Resolved is roast_learnings.why_this_roast_won: populated = resolved, NULL = unresolved (the close-out branch in lib/lifecycle-state.ts). Same surface meaning as the lot-close concept "Closed without reference" (see § Closed without reference) — a V-set lot that exhausted its green without a roast Chris would repeat, or a one-shot whose single attempt didn't nail it. Renders on its own UnresolvedView rather than ResolvedView. The lot is still closed (no further V-sets); "unresolved" describes the verdict outcome, not an open lifecycle. *Avoid*: "failed", "abandoned", "incomplete", "open" (the lifecycle IS closed); conflating with "Waiting for next cupping" (that is an active mid-cycle state).

## V-set close synthesis

### V-set close-out narrative

V-set close-out narrative: The structured prose unit produced at V_n's Day 7 cupping close-out, before designing V_(n+1) (or before routing to lot-close if Path A applies). The operational equivalent of the conceptual roast→cup trace — the trace's content surfaces here, in this writing shape, NOT as 18 per-slot cells. Five components in canonical order:

1. Hypothesis restatement — V_n's primary question + variable framing restated in one sentence, so the close-out is grounded.
2. Per-slot roast metrics row — numeric, field-structured: batch # + peak inlet + FC time + FC temp + drop temp + dev time + Maillard % + Agtron WB + Agtron Gnd + WB→Gnd delta. The only V-set close-out element that decomposes cleanly into per-slot cells.
3. Per-slot roast observation — one or two sentences per slot, noting whether the roast hit its design intent. Brief; exception-flagged where the roast surprised.
4. V-set-wide cup narrative — one paragraph comparing the slots against each other on aromatic presentation / hot-vs-cool behavior / cup-character ranking / relationship to producer-notes ballpark. Cup-side observations collapse across slots here rather than living per-slot; the comparison IS the structure.
5. Verdict + V_(n+1) implication — one sentence declaring the leading slot (V<n><letter> (Batch <#>)) + one sentence telling the next-V-set design what to do with the finding ("V3 will narrow on v2C's post-peak shape and pull peak inlet down to 242°C").

Distinct from lot-specific learnings: V-set close-out narrative is V-set-scoped (one per V-set); lot-specific learnings is lot-scoped (one per closed lot, crystallizing patterns across all V-sets). Variable → lever and variable → non-factor promotions happen at lot-close in roast_learnings, NOT at V-set close-out in this narrative — per-V-set the promotion stays implicit in slot comparisons.

Schema seam: the experiments table has per-slot structured fields (observed_outcome_a/b/c/d, updated_cup_prediction_a/b/c/d, taste_for_a/b/c/d, delta_from_cup_a/b/c/d) that conceptually decompose this V-set-wide narrative. Lived practice populates them either from the narrative or leaves them null — the writing produces the narrative, the schema captures what the narrative encodes. See Taste-for for the principled non-articulation case; see flagged ambiguity for the broader schema-vs-writing seam. *Avoid*: "V-set summary" (too loose); "V-set retro" (wrong scope — retro implies looking back across multiple V-sets); "experiment write-up" (overloaded "experiment" — see V-set entry).

### Key-insight confidence ladder

Key-insight confidence ladder: The 4-level enum graded on experiments.key_insight_confidence at V-set close-out via log-cupping.md STAGE 3 (also one-shot.md STAGE 4 for one-shots, where the upper levels cap at Medium per N=1 constraint). Apply consistently across sessions; downstream queries + ROASTING.md routing decisions filter on this level. Operational ladder:

* Low — interesting hypothesis. Single-V-set observation, not yet replicated. Flag in the log but don't act on it yet. Stays in additional_notes or key_insight prose; does NOT route to the Cross-Coffee Insight Layer in ROASTING.md.
* Medium — consistent with 1-2 prior data points (this lot's earlier V-sets, or a closely-similar prior lot's carry-forward). Worth weighting in V_(n+1) design but not promotion-ready. Acceptable as a CCIL append at Medium-marker level.
* Medium-High — strong evidence within this lot, ready to be a working assumption for the rest of the lot's V-sets and for similar-cultivar carry-forward. Survives "what would change my mind?" prompting.
* High — ready to promote to a protocol change in ROASTING.md (typically routes through log-cupping.md STAGE 6 or close-lot.md STAGE 5 as an APPEND or REPLACE on a protocol section). Requires either multi-V-set repetition within this lot OR strong cross-lot corroboration.

Tie-breaking rule: if unsure between two levels, pick the lower and explain why in additional_notes. The cost of under-claiming is delayed-promotion (low); the cost of over-claiming is bad protocol changes (high).

Mirrors the CCIL marker vocabulary in ROASTING.md so the append-confidence marker on a CCIL entry matches the source experiment's level. The schema enum + this entry are the single source of truth for the four levels. *Avoid*: bare "confidence" without the level qualifier; "strong" / "weak" (loses the threshold-shape semantics); collapsing Medium and Medium-High (the distinction is whether the insight has survived adversarial framing).

## Lot-close synthesis

### Lot-specific learnings

Lot-specific learnings: The full reflective synthesis of one closed lot — its character (primary lever, acceptable roast window, brewing tolerance), its variable promotions (secondary levers + non-factors), and its diagnostic + behavioral fingerprint (underdev signal, overdev signal, aromatic / structural / rest behavior). Backward-looking audit-trail, scoped to this lot. Written by claude.ai at lot-close based on the full roast→cup trace; Chris does not hand-author. *Avoid*: "lot learnings", "audit trail", "retrospective", "lot summary"

### Carry-forward learnings

Carry-forward learnings: The compressed subset of lessons that generalize beyond this lot to future ones — what to try first when next roasting a similar cultivar, terroir, process, or general roast-style. Forward-looking, designed to shorten time-to-reference-roast on the next lot. The compounding-knowledge primitive of Latent: claude.ai consumes prior lots' carry-forward when designing V1 on a new lot with overlapping attributes. Four conceptual axes in Chris's mental model, now all four represented in schema: cultivar_takeaway, terroir_takeaway (added migration 060), general_takeaway, starting_hypothesis. Each carry-forward field carries a paired scope_tags text[] array (migration 064 / ADR-0009) for sub-scoping queryability — see Scope tags entry. Downstream of anchor profile in the operational sequence: design opens with the anchor (parametric reference); interpretation closes with the carry-forward (propositional guidance). One anchor profile generates multiple carry-forward learnings; one carry-forward learning may consolidate signal from multiple anchors. *Avoid*: "lessons learned" (too generic), "general learnings", "forward recipe", "roadmap"

### Scope tags

Scope tags: The loose-canonical namespaced-prefix text[] array paired to each carry-forward field on roast_learnings (migration 064 / ADR-0009). Four columns: cultivar_takeaway_scope_tags, terroir_takeaway_scope_tags, general_takeaway_scope_tags, starting_hypothesis_scope_tags. Each holds zero or more tags conforming to the prefix convention (see Scope-tag prefix convention). Purpose: make cross-lot queries reliable. The carry-forward field's name already implies the PRIMARY scope axis (cultivar / terroir / general / starting_hypothesis); scope_tags carries sub-scoping within or across axes. Example: a cultivar_takeaway for Sudan Rume with scope_tags=['process:washed'] says "this Sudan Rume lesson applies only to washed lots, not natural." Cross-lot SQL: WHERE 'process:washed' = ANY(general_takeaway_scope_tags) surfaces all takeaways scoped to washed coffees in one query rather than grepping prose. Closes the Sudan Rume Washed→Natural transition gap (FC-temp-architectural-constraint hypothesis emerged because washed-anchor carry-forwards didn't transfer cleanly; prose-only scoping made that gap discoverable only by reading). Loose-canonical: prompts (close-lot.md STAGE 3 + one-shot-closeout.md STAGE 4) describe the convention; write paths do NOT enforce — the 7-closed-lot corpus is too small to justify strict validation. Going-forward only: 7 closed lots backfilled to empty arrays at migration time. *Avoid*: "scope flag" (under-specified — could mean a boolean), "scope qualifier" (close but qualifier is already taken by fermentation_qualifiers), "tag" (under-specified), "filter" (overloaded against brews.filter).

### Scope-tag prefix convention

Scope-tag prefix convention: The namespaced vocabulary the loose-canonical scope-tag arrays follow (ADR-0009). Prefix-namespaced strings of shape <axis>:<value> (or bare general as the catch-all for unscoped universal principles), where axis is process / variety / country / terroir:macro / altitude / density / evaluation_method, etc. — e.g. process:washed, variety:sudan-rume, country:colombia, terroir:macro:huila, altitude:high. Illustrative, not exhaustive: the prefix namespaces document themselves and new prefixes join as patterns emerge (e.g. bean_size: / moisture:). Loose-canonical by design — not enum-rigid; the working vocabulary lives in the close-lot.md / one-shot-closeout.md write paths, not in a strict registry. *Avoid*: "tag namespace" (close but under-specified — the convention is more than namespace), "scope vocabulary" (close), "scope enum" (rejected — explicitly NOT enum-rigid).

### Closed without reference

Closed without reference: A close-out state where the lot did not produce a reference-quality roast. Two paths arrive here: (1) a V-set lot exhausted its green across multiple V-sets without arriving at a roast Chris would repeat - the cup never crystallized into "yes this is the lot's voice"; (2) a one-shot lot's single attempt didn't nail it - typical when the carry-forward anchor was off-target or the design hit a tolerance edge. The lifecycle state is unresolved (see § Unresolved): `lib/lifecycle-state.ts` reads a roast_learnings row with why_this_roast_won = NULL as unresolved, and the lot renders on UnresolvedView rather than ResolvedView. The salvageable artifact for these lots is often the optimized brew - dialed in to compensate for the non-ideal roast via the brewing-side workflow. The brew row's what_i_learned captures the compensation reasoning; that prose becomes carry-forward for future similar lots even when the roast itself wasn't reference quality.

is_reference: true can coexist with why_this_roast_won = NULL on one-shot Outcome B lots. The two columns sit on different axes — roasts.is_reference is the structural axis ("this row is what the green-lot detail page renders as the reference roast"); roast_learnings.why_this_roast_won is the verdict-prose axis ("this roast is the lot's voice"). On V-set lots the two correlate (close-lot.md sets both together). On one-shot lots they decouple: one-shot-closeout.md STAGE 2 sets is_reference: true unconditionally regardless of Outcome A/B because the single batch IS structurally the reference, while why_this_roast_won is populated only on Outcome A and stays NULL on Outcome B. The "Closed without reference" sub-card triggers on why_this_roast_won = NULL, NOT on is_reference = false — that decoupling is what makes the sub-card render correctly on one-shot Outcome B lots.

*Avoid*: "failed lot" (pejorative; the lot still produced learning), "abandoned", "incomplete". (Note: "Closed without reference" IS the lot-close description of the unresolved lifecycle state — see § Unresolved — so the two are coextensive, not in tension.)

### Resolved-pending transition

The Resolved-pending → Resolved transition compresses three discrete sub-events: (1) reference roast designation (closes the V-set iteration; lives in roast_learnings.best_roast_id); (2) the brewing iteration loop entered with the reference roast as starting bean (canonical noun is the brewing-side iteration loop — same loop used for purchased roasted beans; the starting bean's provenance doesn't change the loop's shape); (3) optimized-brew commit at iteration-loop diminishing returns (lives in the brews row with source: "self-roasted" + roast_id linkage). There's no separate canonical noun for "the handoff" as a discrete event because the handoff IS the entry into the brewing iteration loop — leveraging the existing canonical avoids inventing a new term. The middle event takes the most calendar time (multi-session iteration; 2-4 brews average); the outer two are discrete moments. *Avoid*: "closed", "complete", "done", "archived", "final"; "brew handoff" as a standalone canonical noun (use "entering the brewing iteration loop" or just reference the brewing iteration loop entry).


## Cross-domain roasting ↔ brewing handoffs

### Cross-domain workflow-transition gate

Cross-domain workflow-transition gate: declaring roasts.is_reference = true is the load-bearing gate that transitions a lot from the roasting-side workflow to the brewing-side workflow — the operator hands the reference roast into the brewing-side iteration loop to dial in the optimized brew (see entry Optimized brew below). The declaration is intentionally definite, not ambiguous: an is_reference_candidate = true flag set during V-set iteration is a hedged mid-flight judgment ("could be one / good candidate"); is_reference = true is the commit ("yes, this is the lot reference, moving on"). The asymmetric downstream consequence — cross-domain transition begins as soon as the flag flips — makes the call-it-correctly discipline load-bearing. The Cupping Specialist sub-skill owns the pre-declaration push-back duty (see docs/skills/cupping-specialist/SKILL.md § Pre-declaration discipline (Path A push-back duty)) — when the operator signals Path A on a V-set lot that hasn't yet run a Simulated Pourover Gate comparison, the Cupping Specialist's job is to push back with the standard language and only confirm Path A after the operator has completed the comparison and still wants the designation. One-shot lots are exempt from the SPG condition (single roast by structural design, one cup read, no V-set lineage) — for one-shots, one-shot-closeout.md STAGE 2 sets is_reference = true directly without the push-back gate. *Avoid*: "best roast", "winning batch", "final roast", "optimal roast", "leading slot" (V-set-scoped, see separate entry)

### One-shot emission + link

One-shot emission + link: a one-shot ALWAYS goes to brewing (one roast, one cup, no choice), so one-shot.md STAGE 4 emits an Optimized Brew Packet unconditionally - on both Outcome A and Outcome B - to kick off the dial-in (see CONTEXT-shared § Cross-domain Workflow for the Packet's place in the handoff-brief family). one-shot-closeout.md STAGE 3 then LINKS the handed-back brew_id (it was flipped from inline-push to LINK-not-push to match the V-set pushed-once-linked-once invariant; inline push survives as fallback only). The one-shot link is roast-quality-independent: the brew links to the single roast regardless of whether it's reference-quality, because Outcome B (off-target roast, decent salvage brew) is the *common* one-shot path. is_reference: true is already set structurally at one-shot-closeout.md STAGE 2 (single batch IS the reference slot), so the link stands identically on A and B.

### xBloom

xBloom: A physical automated pour-over machine that runs one mechanically-consistent recipe every time (same temperature, pour pattern, agitation, ratio). Used as the gate for reference-cup evaluation — every reference roast gets exactly one xBloom pour-over at day-7 of rest, and that result *is* the reference cup. Not the consumption-condition cup (that's the optimized brew), but a standardized cross-lot anchor that's repeatable. *Avoid*: "automated pour over" (xBloom is a specific machine), "pour over machine"

### Peer Roaster

Peer roaster (or peer machine, peer's framework by framing): An external roaster operating on identical hardware (Roest L200 Ultra in counterflow) whose cup judgments + design frameworks contribute to V1 design as high-weight directional input, even though specific roast parameters don't transfer due to confirmed machine-level thermal differences. The three framings differentiate by what's being cited:

* Peer roaster when citing the person making a judgment ("per the peer roaster's framework on acidity-vs-sweetness axis trade-off")
* Peer machine when flagging the thermal asymmetry that prevents parameter transfer ("peer machine runs ~3°C cooler at the same setpoint — his TP ~94°C vs my 78-81°C, his charge 112.2°C vs my 117°C")
* Peer's framework when citing the conceptual contribution ("peer's framework: shorter Maillard / higher momentum at FC produces acidity and clarity")

Canonical vocabulary moves in real prose:

* "Directionally carries" — the principle transfers even when the specific numbers don't. The phrase that does most of the work when citing peer input.
* "Specific numbers don't transfer" — explicit-disclaimer phrase that fires every time peer parameters get cited.
* "Confirmed machine-level thermal differences" — the structural reason for number non-transferability.

No canonical structured storage. Peer's resolved roasts aren't in Chris's Roest log and don't get batch numbers like #133 or #139; the peer's framework lives in Chris's head and in scattered intake notes. Peer observations contribute to anchor confidence + starting hypothesis at V1 design time but have no canonical home — flagged ambiguity. Also missing: a canonical phrase for "peer observation conflicts with my own anchor-derived data and the conflict is operationally important" — today resolved by operator judgment with no documented precedence rule. *Avoid*: "external reference roaster" (overformal, doesn't capture the operating relationship); collapsing peer roaster + peer machine + peer's framework into one term (the three framings do different work in prose); citing peer numbers without the "specific numbers don't transfer" disclaimer.


### Peer-roasted reference brew

Peer-roasted reference brew: A brew row in brews representing the roasted variant of a Latent green-bean lot, purchased from the same source (the producer, an importer offering a roasted line, or a peer roaster who sourced the same lot). Acts as a calibration anchor for the roasting side — Chris cups the peer brew to know what the bean "should taste like" before committing his own V-set design, and the peer cup informs leading-slot assessment during log-cupping.md Path C-1 calibration. Roughly 25-30%+ of green-bean lots have a peer-roasted reference; Chris buys the roasted variant when available. Lived instances at migration time (migration 069): CGLE Sudan Rume Natural (special-guest roasted version, same farm + same lot + same time); Wush Wush (peer-roasted version); every bean from Untold Coffee Lab (paired roasted variant for each lot); future lots when the peer-roasted version is findable. The limiting factor on coverage is sourcing — sometimes the roasted version isn't available for sale. Conceptually the peer variant is a third triangulation point on the bean — independent of the producer's notes and Chris's own roast + taste — which is why it calibrates V-set direction rather than dictating it (see § Information value).

Schema (migration 069): nullable FK green_beans.peer_reference_brew_id pointing at brews(id). 1:1 in current practice — one green-bean lot has at most one peer reference. Many-to-many (one green-bean lot with peer-roasted versions from multiple peer roasters) is not a current pattern; if it emerges, migrate to a join table later. ON DELETE SET NULL on the FK constraint (peer brew delete clears the link, doesn't cascade). Typically backfilled via patch_green_bean(peer_reference_brew_id) AFTER the peer brew row lands in the DB (the brewing-side write path is independent), not at green-bean push time.

Relationship to other concepts: distinct from Reference roast (Chris's own designated winning roast on his lot — see § Reference roast) and from Reference cup (the xBloom Day-7 gate cup of Chris's reference roast — see § Reference cup). The peer-roasted reference is external calibration anchor, not internal lot output. Distinct from a Control experiment V-set (which IS Chris's own roast, replicating the leading slot to confirm). The peer brew is one direction of cross-domain workflow flow: brewing-side input (the peer roast was a purchased brew) feeds back as roasting-side calibration. No app UI surface — the peer-roasted lessons live in the Peer-Learning Roasting Archivist skill, not the app; the schema FK is preserved purely as the find-fast pointer.

*Avoid*: "peer brew" (too generic — Chris drinks many peer brews that aren't calibration anchors for his own lots); "external reference roast" ("reference roast" is a Latent-specific term for Chris's designated lot winner — see § Reference roast); collapsing peer-roasted reference + control experiment (control experiment is Chris's own roast).

### Information value

Information value: A High / Medium / Low rating of how transferable a peer-roasted variant's cup is to Chris's own roast design, gated by roast-level distance from Chris's philosophy, NOT by sourcing proximity (the "dark roast overtakes everything" rule — past ~second crack the roast character swamps variety / origin / process, so almost nothing transfers; Janson *and* Wush Wush are both from the same retailer, Untold, yet both rate Low — same source does not imply high transfer). The dial measures cup/flavor transfer; a separate, orthogonal hypothesis / roast-behavior channel (handoff field 4) can fire even at Low and lift a variant's real value above its flavor grade.

Exemplar ladder (three rungs; the Low rung spans two named states):

* High — same lot, roast inside Chris's light/ultra-light window: most of the cup is bean. No clean lived instance yet — awaiting a peer variant roasted in-window. Even at High the cup is a high-*correlation* reference, not a 1:1 target (taste is single-palate / subjective).
* Medium — real but partial; discount the roast-developed register. Canonical: CGLE Sudan Rume Natural (Special Guests, 71.7 Agtron WB, ~4-6 points darker than Chris's anchor band — the closest-to-High case so far, but recorded Medium because it was roasted a touch darker than Chris would).
* Low, upper edge — roast is the loudest thing in the cup, but faint bean signal survives *and/or* the hypothesis channel fires. Canonical: Wush Wush (Untold, 65.4 Agtron, ~25 points off) — aromatic reserve (prune / mandarin) confirms bean traits *and* it confirmed the "roasts fast/dark → bias lighter" roast-behavior hypothesis, high-value even at Low.
* Low, floor (roast-erased) — the roast fully swamps the bean; variety / origin / process stop mattering; the handoff is a pure discount list, no bean-attributable bucket, no manufactured takeaways. Canonical: Panama Janson Pacamara (Untold, 47.9 Agtron, oily, past second crack).

The mechanism producing the rating is the three-bucket cup split — bean-attributable / roast-attributable / open questions (notes where bean and roast are *entangled* and can't be split from one cup, held to watch rather than transferred; see § Peer-variant handoff field 3). A peer-roasted variant is also a third triangulation point on the bean: alongside the producer's notes and Chris's own roast + taste, it adds an independent third read on what the green is capable of.

### Peer-variant handoff

Peer-variant handoff: The brewing-side completion of a peer variant emits a 5-field brewing-to-roasting handoff brief (see CONTEXT-shared § Cross-domain Workflow): (1) pairing + provenance incl. their roast level (Agtron WB + oily/color) and the same-lot confidence grade (below); (2) information-value rating + reason; (3) cup read in three buckets — bean-attributable / roast-attributable / open questions (the third holds notes where bean and roast are entangled and can't be split from one cup — named, flagged, and *not* transferred, held as open questions to disambiguate later); (4) roast-design takeaway for Chris's roast (hypothesis-flagged at Med/Low); (5) discount list (roast-contaminated notes that must NOT drive roast design). Produced by a dedicated brewing prompt (peer-variant-completion.md); the Peer-Learning Roasting Archivist skill owns consumption (weight by info-value, consult per lifecycle stage) and is the durable home for the brief.

### Same-lot confidence grade (field 1)

Same-lot confidence grade (field 1): "lot" stays strict (same crop lot — same farm, same season; per § Relationships, same producer + cultivar across two purchases = two distinct lots). The grade rates how confidently the peer IS that same strict lot: exact crop lot confirmed (matching lot/edition number, or roaster confirms) → bean substrate identical; source-confirmed, crop-lot unverified (producer/farm/variety/process match, exact crop lot pending) → *probably* same lot, so discount the bean-attributable bucket slightly (a sibling crop lot could differ). The lower grade can be reached by operator ratification — direct roaster conversation, sole-lot inference — when written/third-party provenance is impossible; a rare exception, not a routine loosening of "lot." Canonical: CGLE Sudan Rume Natural, Edition 0326-42 — bag photo + head-roaster verbally confirmed same variety/process/same-time purchase + CGLE sells only this one Sudan Rume Natural (competition variety; Special Guests roasts competition varieties) + no persistable roaster URL; operator-ratified same-lot, no external validation possible.

### Link timing + filed vs courier-carried

Link timing + filed vs courier-carried: set green_beans.peer_reference_brew_id at the earliest moment both rows exist. Green row exists (mid-V-set / post-cycle) → completion prompt links immediately and the handoff is filed in the Peer-Learning Archivist's peer-variant-handoffs.md (Wush Wush, Sudan Rume). Green row doesn't exist (pre-V1 inventory pairing) → the handoff is courier-carried: the operator carries it and pastes it into start-lot.md, which sets the FK (and pulls the handoff as a V1 prior) when it creates the green row (Janson). No skeleton green-bean row. ("Courier-carried" is the consumption-side mirror of the link-timing rule; the operator is the human courier of every handoff brief — see CONTEXT-shared § Cross-domain Workflow.)

### Pre-V_n calibration gate

Pre-V_n calibration gate: A gate that halts V_(n+1) design (or V1 design pre-V1) until missing calibration data is acquired. Distinct from Pre-V1 risk reduction (a bundle of practices run before committing to V1 on expensive / low-confidence lots) — the calibration gate is the lifecycle hold-point those practices flow through, and it ALSO fires post-V1 in the V_(n+1)-design moment. Two variants in lived practice (log-cupping.md STAGE 4):

- **C-1 — missing peer-roasted reference cup**. V_n landed in a plausible zone but the lot lacks an external reference cup to calibrate V_(n+1)'s adjustment direction. The calibration step is "buy the peer-roasted version, cup it Day 7 at the xBloom gate, paste the transcript back into a new log-cupping.md session" — the peer cup tells you which direction V_(n+1) needs to move. Canonical case: Fazenda Um. See § Peer-roasted reference brew.
- **Simulated Pourover Gate** — the end-of-V-set decision-support gate run as Chris nears the reference-roast call. The full system is its own section below.

Lifecycle state stays Waiting for next cupping through both variants. Distinct from a control experiment (a new V-set replicating the leading slot — routes through Path B, not Path C). *Avoid*: "calibration step" (too generic — pre-V1 risk reduction also runs calibration steps); "blocker" (calibration gates are deliberate design hold-points, not external blockers).

## Simulated Pourover Gate system

The Simulated Pourover Gate system is the late-stage decision-support workflow used when the roast-side search is close to a reference-roast decision, but the xBloom gate alone is not trusted enough to commit.
It sits between the standardized xBloom evaluation and the full optimized-brew workflow:
cupping bowl → xBloom generic-frozen → Simulated Pourover Gate bean-frozen → optimized brew
The system exists because the xBloom Day 7 gate is consistent and useful for cross-slot comparison, but the xBloom-to-end-optimized-pourover delta can be large. The Simulated Pourover Gate gives finalists a closer approximation of the eventual consumption-condition cup without paying the time cost of fully optimizing every finalist.
The system has four distinct parts:

1. Simulated Pourover Packet - the outbound trigger from roasting to brewing.
2. Simulated Pourover Gate - the decision event across finalists.
3. SPG standing recipe - the frozen, bean-specific recipe used across the finalists.
4. eval_method: 'Simulated Pourover' - the canonical cupping-row storage value.

These share the same name stem but are not interchangeable.

### Simulated Pourover Packet

The Simulated Pourover Packet is the thin outbound trigger emitted by the roasting thread when a Simulated Pourover Gate is needed.
It crosses from roasting to brewing and contains only the minimum handoff context needed to run the gate:

* green_bean_id
* finalist roast batches
* one-line intent for the comparison

The packet does not define the recipe. It tells the brewing-side workflow which candidates need to be compared and why.
The dedicated brewing thread then produces the SPG standing recipe and runs the gate cup-set.
Avoid: treating the packet as the gate itself, putting full recipe design inside the roasting thread, or storing the packet as if it were the final brew artifact.

### Simulated Pourover Gate

The Simulated Pourover Gate is the decision event: Chris runs the same simulated-pourover recipe across 2-3 roast finalists to choose the reference roast.
Typical finalist set:

* V_n leading slot
* V_n secondary contender
* V_(n-1) leading slot as a control baseline

The goal is not to optimize brewing. The goal is to isolate roast quality under a more realistic pourover condition than xBloom while keeping brew technique constant across candidates.
The gate is most useful when:

* roasting-side optimization is reaching diminishing returns
* xBloom has identified a plausible leading slot, but not a definitive reference
* prior V-sets showed xBloom gate vs real-pourover inversions
* the current leading-slot identity is provisional
* a roast-quality concern needs a closer-to-consumption read before committing

Outcome: pick the reference roast, then move only the chosen roast into the full optimized-brew workflow.
This is distinct from a control experiment. A control experiment is a new V-set that replicates a leading slot with slight roast adjustments. The Simulated Pourover Gate is a cupping / brewing comparison across already-roasted finalists.
Aliases that refer to the same event but should not become separate concepts:

* “candidate run-off pourover”
* “runoff competition”

Avoid: “calibration step” when the specific SPG event is meant, “halt-and-report,” “blocker,” or creating a separate candidate-runoff workflow concept.

### SPG standing recipe

The SPG standing recipe is the one bean-specific pourover recipe produced by the brewing thread for the Simulated Pourover Gate.
It is:

* Bean-lot-specific - each lot gets its own SPG recipe.
* Frozen across candidates - the same recipe is used for every finalist in the runoff.
* Non-optimized - it is closer to the final consumption condition than xBloom, but it is not the final optimized brew.
* Ephemeral - it is not recorded as the final recipe artifact.

The freeze scope is the runoff itself. The recipe is frozen across the candidates in one gate so roast differences are not confounded by brew differences. It is not intended to be persisted across V-sets or treated as a stable cross-lot reference.
This accepted limitation matters: the SPG standing recipe does not create a strict cross-V-set attribution trace. Its content is not the load-bearing artifact. The decision comparison is the load-bearing artifact.
Only the eventual optimized brew persists as the final brewing endpoint.
Avoid: treating the SPG standing recipe as the optimized brew, persisting it as the final recipe, iterating it candidate-by-candidate, or reusing it as a universal SPG recipe across lots.

### `eval_method: 'Simulated Pourover'`

SPG cups are recorded as normal cupping rows with:
eval_method: 'Simulated Pourover'
This string is canonical. The value stores today because cuppings.eval_method accepts free text. Future schema work may formalize or validate the value, but it should not rename it.
This value disambiguates SPG cups from optimized-brew cups:
SPG cup:
eval_method: 'Simulated Pourover'

Optimized-brew cup:
eval_method: 'Pourover'
recipe_variant: 'real_pourover'
The cuppings-row shape is resolved: SPG cups live in the cuppings structure. They do not need a separate wrapper table or separate candidate-runoff object.

### Lifecycle behavior

The lot remains in **Waiting for next cupping** while the Simulated Pourover Gate is pending.

There is no separate lifecycle state today for “waiting for calibration cup” or “waiting for simulated pourover.” The prompt-level gate does the routing while the lifecycle state remains reused.

There is no dedicated lifecycle state for a pending SPG; agents should not invent one.


## Schema notes

### Backfilled recipe

Backfilled recipe: A roast_recipes row whose design intent was recovered AFTER the roast fired rather than captured at design time (migration 057). Lives in roast_recipes.was_backfilled boolean + paired backfill_notes text for provenance prose ("Recovered from session chat memory at V3 cup, 2026-05-19"). The boolean is a queryable axis distinguishing lots with end-to-end design-intent provenance from lots whose intent was recovered partially or fully after the fact — relevant for anchor profile confidence weighting and for spotting carry-forward decisions made on incomplete substrate. Three operational sources:

1. Migration 052 legacy shells — the backfill created one recipe row per existing roast with NULL beziers + NULL experiment_id + NULL batch_slot. Surviving shells flagged was_backfilled = true (migration 057).
2. log-cupping.md STAGE 0 inline-backfill — when a pre-rewrite V-set arrives at Day 7 cupping without populated predicted_cup / updated_cup_prediction_\* / taste_for_\* fields, the prompt reconstructs them from session memory + expected_outcomes per-slot split. Each patch_roast_recipe call sets was_backfilled: true + a backfill_notes string.
3. log-roast.md STAGE 1(b) missing-recipe-row halt relaxation — when V_n design pre-dates the rewrite and the slot→recipe_id map is empty BUT design intent is reconstructable from session memory, push_roast_recipe × N fires with was_backfilled: true.

*Avoid*: "legacy recipe" (overlapping with the larger pre-rewrite legacy concept); "auto-created recipe" (collides with the terroir_provenance: 'auto_created' flag); collapsing was_backfilled into the notes prose (the boolean axis is the load-bearing query primitive).
