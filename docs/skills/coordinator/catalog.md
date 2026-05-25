# Master Coordinator Catalog

The 18-sub-skill registry. Each entry has I/O metadata so dispatch decisions can be made from the catalog alone without loading the full SKILL.md.

**Wave status:** Wave 1 shipped Brewing Equipment Expert + Master Coordinator (2026-05-26). Wave 2 shipped 4 consolidation plays — WBC Brewing/Roasting Archivists (PR 1), Brewing Historian (PR 2), Roasting Historian (PR 3). Wave 3 PR 1 shipped 2 operator-stub Knowledge sub-skills (Peer-Learning Roasting Archivist + Roest Knowledge) + Roasting Historian R-to-B Translation extension. Wave 3 PR 2 shipped 4 Workflow Planning sub-skills (Roasting Assistant + Brewing Assistant + Learning Assistant + Sourcing Workflow Planner) — reads-only composition over Wave 1+2 Knowledge clusters, no clusters of their own per scope decision 1. **Wave 3 PR 3 shipped 5 Workflow Executing sub-skills (Roast Recorder + Brew Recorder + Cupping Specialist + Roest API Worker + Close-Lot Specialist)** — substrate-writer executors wrapping `push_*` / `patch_*` Tools; POD-1 absorbed into Cupping Specialist at SKILL.md level + bookmarked at `cluster/pod-1-routing.md` pending lived-practice trigger conditions; only Cupping Specialist has a `cluster/`. **Wave 3 closed.** **Wave 4 PR 4a shipped CCIL skeleton + Sudan Rume seed pattern (2026-05-21)** — CCIL flipped PLACEHOLDER → ACTIVE; cluster/coffee/sudan-rume/across-roasting-and-brewing.md as the proof-of-pattern seed (N=3 across both domains); cluster/decomposition-log.md as Pattern F audit trail starter; Chain 6 in handoff-rules.md activated. **Wave 4 PR 4b shipped 2026-05-21 — architecture implementation arc closed.** BREWING.md + ROASTING.md rewritten as ~500-byte redirect stubs; ~196KB residual operational content migrated to brewing-assistant/cluster/operational-guide.md, brewing-equipment-expert/cluster/operational-reference.md, roasting-historian/cluster/by-process/{natural,honey}.md, roasting-historian/cluster/active-lots/ + one-shot-calibrations/, roest-knowledge/cluster/protocols/{between-batch-protocol,green-storage}.md, coordinator/operator-guide.md, and expanded brewing/roasting-domain-principles below; CLAUDE.md sub-skills section extracted to docs/architecture/sub-skills-status.md. **Remaining placeholders:** Learning Knowledge (deferred until ≥2 research tracks complete).

---

## Brewing domain principles

**Frame.** Chris brews for himself, championship-mode. The goal is to surface the experiment Chris wouldn't think of — the brewer he hasn't reached for in two months, the modifier he's never tried, the temperature staging he's been told works on a specific process. Defaults exist as a safety floor, not a comfort zone. Push extreme axes when the coffee profile warrants it. This is not cafe-repeatable; it is per-coffee optimization for a single drinker.

**Default-Clarity-First-is-conservative.** The default extraction strategy in the brewing literature is "Clarity-First on washed coffee." Chris is past that ceiling. Most coffees he brews are processed lots with intentional fermentation, dense varieties, or unusual cultivars that have a higher expressive ceiling than Clarity-First reaches. Default Clarity-First on these coffees is a conservative miss, not a safe baseline. Push the strategy toward what the coffee actually needs at the Step 1d strategy-confirmation gate, not toward the safest choice.

**Two-axis decomposition.** Every brew names a position on Axis 1 (extraction strategy) and may add one or more modifiers from Axis 2. Modifiers are optional and require explicit justification. They are not defaults.

- **Axis 1 (Extraction Strategy)** = the intent of the brew — how transparent vs. expressive the cup should be. 6 strategies: Suppression / Clarity-First / Balanced Intensity / Full Expression / Extraction Push / Hybrid. Five describe extraction intensity (single-mode logic running throughout the brew); the sixth (Hybrid) describes extraction structure (phase boundaries where the brewer changes mode mid-brew). Selection rule between intensity-vs-structure is mechanical: if the brewer changes mode (immersion ↔ percolation, or pours have explicitly different sensory jobs), it is Hybrid; otherwise pick from the five intensity strategies. Suppression/Clarity-First share mechanics but differ in intent; Full Expression/Extraction Push share mechanics but differ on the agitation lever. See [brewing-assistant/cluster/operational-guide.md § Axis 1](../brewing-assistant/cluster/operational-guide.md) for the full strategy framing + per-strategy mechanics.
- **Axis 2 (Extraction Modifiers)** = optional stackable techniques layered on top of the strategy. 4 canonical modifier types: `output_selection` (with form sub-fields including dilution), `inverted_temperature_staging`, `aroma_capture`, `role_based_pulse`. Most coffees warrant none. See [brewing-assistant/cluster/operational-guide.md § Axis 2](../brewing-assistant/cluster/operational-guide.md) for the per-modifier framing.

**Equipment-aware recipe construction.** Brewer + filter + grinder + grind setting are canonical-registry-anchored (single canonical EG-1 grinder owned today; SWORKS dripper as the valve-modulated example). Every recipe references real equipment from `lib/{brewer,filter,grinder,sworks}-registry.ts`. Brewer rotation discipline: Chris owns 11 brewers spanning 4 geometries (cone, flat, wave, immersion-hybrid); most days the same one or two get used. At recipe-output time the brewer choice should match strategy + coffee profile, even if it means reaching for one Chris hasn't used in a month. See [brewing-equipment-expert/cluster/operational-reference.md](../brewing-equipment-expert/cluster/operational-reference.md) for the Office/Home equipment envelope + brewer rotation framework.

**Cross-coffee patterns.** Per-strategy patterns + by-cultivar + by-coffee-family rollups live in [brewing-historian/cluster/patterns/](../brewing-historian/cluster/patterns/). WBC competitor recipes + 5-axis foundational map live in [wbc-brewing-archivist/cluster/](../wbc-brewing-archivist/cluster/). Cross-domain (roasting + brewing) patterns live in [ccil/cluster/coffee/](../ccil/cluster/coffee/) (Wave 4 PR 4a: Sudan Rume seed pattern).

## Roasting domain principles

**Roasting Philosophy.** A successful roast is not the loudest or sweetest cup at first sip. It is a roast that improves as it cools, responds positively to small brewing changes, and keeps the brewing layer's full leverage available. Because Chris controls both ends — roast and brew — he can express the coffee on whichever layer fits it. A loud roast (Mandela XO) can be controlled with a heavy-suppression brew. A restrained roast can be pushed with Full Expression. The goal is **optionality**: the roast preserves the coffee's expressive range so the brew has maximum leverage to land the cup Chris wants.

The roasting question is less "how should this taste?" and more "what range am I keeping available?" A narrow-range roast forces a narrow-range brew. A wide-range roast lets the brew system carry strategic weight.

Chris likes coffees roasted in the style of Moonwake, Substance, Sey, Picky Chemist, Big Sur — very expressive, very light. But he is not chasing one style of coffee. He likes the uniqueness and expressiveness of naturals, washed, honey, co-fermented, from many different origins and varieties. **It is an exploratory exercise, not a search for one ideal type.**

Chris roasts exclusively in counterflow mode on the Roest L200 Ultra. Counterflow changes heat transfer mechanics enough that conventional roast logic does not map directly. All active experiments and learnings are built around counterflow. See [roest-knowledge/cluster/machine/l200-ultra.md](../roest-knowledge/cluster/machine/l200-ultra.md) for hardware reference + [roest-knowledge/cluster/machine/counterflow-observations.md](../roest-knowledge/cluster/machine/counterflow-observations.md) for the counterflow-specific behavioral catalog.

**Catchphrase:** "roast for brewing tolerance, brew for intensity" (per [ADR-0007](../../adr/0007-elasticity-to-brewing-tolerance-rename.md)).

**V-set methodology.** Lots iterate in sets of 3 batches (V1a/V1b/V1c → V2a/V2b/V2c → ...), comparative cupped against a non-optimized xBloom Day-7 reference recipe per [roest-knowledge/cluster/protocols/evaluation.md](../roest-knowledge/cluster/protocols/evaluation.md). One-shot calibration lots (single-batch samples ~100-120g) use a separate 2-prompt pipeline; lever-attribution fields on `roast_learnings` are schema-rejected on one-shots per migration 054.

**Lifecycle.** 4 states derived per row (`in_inventory` / `waiting_for_next_roast` / `waiting_for_next_cupping` / `resolved`) — never stored, always computed via `lib/lifecycle-state.ts`. See [CONTEXT-roasting.md § Lifecycle state](../../../CONTEXT-roasting.md) for the precedence rules.

**Reference-cup vs. optimized-brew distinction.** The xBloom Day-7 cup is the V-set discriminator gate; the optimized brew is the consumption-condition endpoint (full brewing-project dial-in on the reference roast). The two roles are distinct and structurally enforced by the schema (`is_reference_candidate` on `roasts` for V-set candidacy; `is_reference` flips at close-out; `optimized brew` is the brew-side row joined via `green_bean_id` + preferring `roast_id = best_roast_id`).

**What good looks like for each coffee.** A coffee is considered **resolved** when all five conditions are met: (1) a reference roast is confirmed through Day 7 pourover evaluation AND an optimized brew session that demonstrates the roast's full expression; (2) the dev range floor and ceiling are defined (not just a best batch, but the boundaries on either side of it); (3) the primary lever that mattered most is identified; (4) key failure signals (underdevelopment and overdevelopment) are documented for that specific coffee; (5) a generalizable takeaway is captured in the carry-forward fields (cultivar_takeaway, general_takeaway, starting_hypothesis_for_similar_lots) on `roast_learnings`. Until all five are true, the coffee is still in active exploration.

**What Chris is NOT trying to do:**
- Produce approachable or forgiving roasts
- Optimize for one brew method only
- Find one perfect cup — the goal is roasts that contain many possible cups
- Rush to a "good enough" result — the process of learning each coffee is the point
- Chase loudness or aggression for its own sake — the target is the best expression of each specific coffee

**Cross-coffee patterns.** Per-process patterns + per-cultivar patterns + cross-coffee insights + open questions live in [roasting-historian/cluster/patterns/](../roasting-historian/cluster/patterns/). Active-lot working hypotheses live in [roasting-historian/cluster/active-lots/](../roasting-historian/cluster/active-lots/). Closed-lot deep-dives live in [roasting-historian/cluster/learnings/](../roasting-historian/cluster/learnings/). Roast-to-brew translation patterns live in [roasting-historian/cluster/patterns/roast-to-brew-translation.md](../roasting-historian/cluster/patterns/roast-to-brew-translation.md). Peer-roaster context (Dongzhe and others) lives in [peer-learning-roasting-archivist/cluster/](../peer-learning-roasting-archivist/cluster/). Cross-domain patterns live in [ccil/cluster/coffee/](../ccil/cluster/coffee/).

---

## Sub-skill catalog (18 sub-skills + 1 deferred)

### KNOWLEDGE TIER (7 active + 1 deferred)

| Sub-skill | Domain | Wave | Status | In | Out | Patterns |
|---|---|---|---|---|---|---|
| [Roasting Historian](../roasting-historian/SKILL.md) | roasting | 2 | placeholder | closed-lot events (push_roast_learnings) | per-lot + cross-lot pattern docs | A, D, F |
| [Brewing Historian](../brewing-historian/SKILL.md) | brewing | 2 | placeholder | every push_brew | per-strategy + per-coffee-family rollups | A, D, F |
| [WBC Roasting Archivist](../wbc-roasting-archivist/SKILL.md) | roasting (+ tentatively absorbs Sourcing Knowledge) | 2 | placeholder | annual WBC year drop · sourcing channel events | WBC lessons + competitor profiles + sourcing strategy | B |
| [WBC Brewing Archivist](../wbc-brewing-archivist/SKILL.md) | brewing | 2 | placeholder | annual WBC year drop | strategy reference + 102-recipe corpus index | B |
| [Brewing Equipment Expert](../brewing-equipment-expert/SKILL.md) | brewing | **1** | **full content** | new equipment · flow-rate measurements · observed quirks | equipment recommendations + constraint envelope | A, C |
| [Peer-Learning Roasting Archivist](../peer-learning-roasting-archivist/SKILL.md) | roasting | 3 | placeholder | operator-watch list (low-volume curation) | per-peer profiles + cross-peer synthesis | B, I |
| [Roest Knowledge](../roest-knowledge/SKILL.md) | roasting | 3 | placeholder | API drift events · firmware updates · observed quirks | machine-aware planning constraints + API quirk catalog | A, B, I |
| [Learning Knowledge](../learning-knowledge/SKILL.md) | cross-domain | **deferred** | placeholder | research-track completion events (from Learning Assistant) | research-track retros + cross-track meta-synthesis | A |

### WORKFLOW PLANNING TIER (4 sub-skills; constructs work, no substrate writes)

| Sub-skill | Domain | Wave | Status | In | Out | Patterns |
|---|---|---|---|---|---|---|
| [Roasting Assistant](../roasting-assistant/SKILL.md) | roasting | 3 | **ACTIVE (PR 2)** | lot specs + Roasting Historian + WBC Roasting + Roest Knowledge + Peer-Learning Roasting Archivist | roast recipe proposal (pre-push) | E |
| [Brewing Assistant](../brewing-assistant/SKILL.md) | brewing | 3 | **ACTIVE (PR 2)** | brew session intent + Brewing Historian + WBC Brewing + Brewing Equipment Expert | brew recipe proposal + in-thread iteration | E |
| [Learning Assistant](../learning-assistant/SKILL.md) | cross-domain | 3 | **ACTIVE (PR 2)** | hypothesis/open question + both Historians + inventory + CCIL (Wave 4 PR 4a) | research-track design + execution plan | E |
| [Sourcing Workflow Planner](../sourcing-workflow-planner/SKILL.md) | roasting | 3 | **ACTIVE (PR 2)** | lot opportunity + WBC Roasting Archivist § sourcing/ + inventory + Roasting Historian | sourcing recommendation + lane-fit assessment | E |

### WORKFLOW EXECUTING TIER (5 sub-skills; writes substrate)

| Sub-skill | Domain | Wave | Status | In | Out | MCP Tools | Patterns |
|---|---|---|---|---|---|---|---|
| [Roast Recorder](../roast-recorder/SKILL.md) | roasting | 3 | **ACTIVE (PR 3)** | Roest log + batch metrics + per-batch reflections | push_roast + push_roast_recipe into corpus | push_roast, push_roast_recipe, patch_roast, patch_roast_recipe | A |
| [Brew Recorder](../brew-recorder/SKILL.md) | brewing | 3 | **ACTIVE (PR 3)** | brew execution data + tasting observations | push_brew + bundled-brewing-completion downstream | push_brew, patch_brew, propose_doc_changes | A |
| [Cupping Specialist](../cupping-specialist/SKILL.md) | roasting | 3 | **ACTIVE (PR 3) — POD-1 absorbed (summary inline + cluster/pod-1-routing.md)** | Day-7 cupping data + roast + cup observations | push_cupping + V-set Path A/B/C routing (Path C rewrite gated on lived-practice trigger conditions) | push_cupping, patch_cupping, patch_experiment, patch_roast (co-owned), propose_doc_changes | A, E |
| [Roest API Worker](../roest-api-worker/SKILL.md) | roasting | 3 | **ACTIVE (PR 3)** | recipe from Roasting Assistant | push_roast_profile API call + linkage patch | push_roast_profile, patch_roast_recipe (co-owned) | B |
| [Close-Lot Specialist](../close-lot-specialist/SKILL.md) | roasting | 3 | **ACTIVE (PR 3)** | resolved-lot completion data (reference roast + ref cup + optimized brew) | push_roast_learnings + best_roast_id writes + cross-link verification | push_roast_learnings, patch_roast_learnings, patch_roast (co-owned), patch_inventory, propose_doc_changes | A |

### SPECIAL TIER (2 sub-skills)

| Sub-skill | Domain | Wave | Status | In | Out | Patterns |
|---|---|---|---|---|---|---|
| [Cross-Coffee Insight Layer (CCIL)](../ccil/SKILL.md) | cross-domain | 4 | **ACTIVE (PR 4a) — skeleton + Sudan Rume seed pattern** | Historian patterns + WBC archivist patterns + per-entity terminal synthesis caches | cross-domain pattern docs + planner recommendations | A, D, F (F primary) |
| Master Coordinator (this file's parent) | cross-domain | **1** | **full content** | user intent + system signals | dispatch event + handoff chain | G, H |

---

## Catalog change discipline

- Every sub-skill ship updates this catalog as part of the same PR (Pattern G).
- Catalog size discipline: if this file crosses 30KB → propose splitting into domain shards.
- Every entry must have: I/O metadata, wave assignment, pattern tags, status (placeholder / full content).
