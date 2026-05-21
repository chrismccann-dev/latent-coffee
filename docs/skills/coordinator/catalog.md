# Master Coordinator Catalog

The 18-sub-skill registry. Each entry has I/O metadata so dispatch decisions can be made from the catalog alone without loading the full SKILL.md.

**Wave status:** Wave 1 shipped Brewing Equipment Expert + Master Coordinator (2026-05-26). Wave 2 shipped 4 consolidation plays — WBC Brewing/Roasting Archivists (PR 1), Brewing Historian (PR 2), Roasting Historian (PR 3). Wave 3 PR 1 shipped 2 operator-stub Knowledge sub-skills (Peer-Learning Roasting Archivist + Roest Knowledge) + Roasting Historian R-to-B Translation extension. Wave 3 PR 2 shipped 4 Workflow Planning sub-skills (Roasting Assistant + Brewing Assistant + Learning Assistant + Sourcing Workflow Planner) — reads-only composition over Wave 1+2 Knowledge clusters, no clusters of their own per scope decision 1. **Wave 3 PR 3 shipped 5 Workflow Executing sub-skills (Roast Recorder + Brew Recorder + Cupping Specialist + Roest API Worker + Close-Lot Specialist)** — substrate-writer executors wrapping `push_*` / `patch_*` Tools; POD-1 absorbed into Cupping Specialist at SKILL.md level + bookmarked at `cluster/pod-1-routing.md` pending lived-practice trigger conditions; only Cupping Specialist has a `cluster/`. **Wave 3 closed.** **Wave 4 PR 4a shipped CCIL skeleton + Sudan Rume seed pattern (2026-05-21)** — CCIL flipped PLACEHOLDER → ACTIVE; cluster/coffee/sudan-rume/across-roasting-and-brewing.md as the proof-of-pattern seed (N=3 across both domains); cluster/decomposition-log.md as Pattern F audit trail starter; Chain 6 in handoff-rules.md activated. **Wave 4 PR 4b pending:** master-doc residual migration (BREWING.md → ~500-byte redirect stub; ROASTING.md → ~500-byte redirect stub) + Naturals + Honey + 3 ambiguous ROASTING.md sections cleanup pass + CLAUDE.md sub-skills section compaction (extract to docs/architecture/sub-skills-status.md); PR 4b closes the architecture implementation arc. **Remaining placeholders:** Learning Knowledge (deferred until ≥2 research tracks complete).

---

## Brewing domain principles (~1-2KB; absorbed from BREWING.md top sections)

Latent's brewing reference architecture is a **two-axis decomposition** where:
- **Axis 1 (Extraction Strategy)** = the intent of the brew — how transparent vs. expressive the cup should be. 6 strategies: Suppression / Clarity-First / Balanced Intensity / Full Expression / Extraction Push / Hybrid.
- **Axis 2 (Extraction Modifiers)** = optional stackable techniques layered on top of the strategy. 4 canonical modifier types: `output_selection`, `inverted_temperature_staging`, `aroma_capture`, `immersion`.

**Equipment-aware recipe construction:** brewer + filter + grinder + grind setting are canonical-registry-anchored (single canonical EG-1 grinder owned today; SWORKS dripper as the valve-modulated example). Every recipe references real equipment from `lib/{brewer,filter,grinder,sworks}-registry.ts`.

For the full brewing reference (until Wave 4 redirect-stub transition completes), see [BREWING.md](../../../BREWING.md).

## Roasting domain principles (~1-2KB; absorbed from ROASTING.md top sections)

Latent's roasting reference architecture is **counterflow-methodology-driven** on Roest L200 Ultra (single-machine domain):
- **Catchphrase:** "roast for brewing tolerance, brew for intensity" (per [ADR-0007](../../adr/0007-elasticity-to-brewing-tolerance-rename.md))
- **V-set methodology:** lots iterate in sets of 3 batches (V1a/V1b/V1c → V2a/V2b/V2c → ...), comparative cupped against a non-optimized xBloom Day-7 reference recipe
- **Lifecycle:** 4 states derived per row (`in_inventory` / `waiting_for_next_roast` / `waiting_for_next_cupping` / `resolved`) — never stored, always computed via `lib/lifecycle-state.ts`
- **Reference-cup vs. optimized-brew distinction:** the xBloom Day-7 cup is the V-set discriminator gate; the optimized brew is the consumption-condition endpoint (full brewing-project dial-in on the reference roast)

For the full roasting reference (until Wave 4 redirect-stub transition completes), see [ROASTING.md](../../../ROASTING.md).

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
