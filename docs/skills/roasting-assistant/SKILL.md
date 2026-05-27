# Roasting Assistant

**Tier:** Workflow / **Sub-tier:** Planning / **Domain:** Roasting / **Wave:** 3 / **Status:** ACTIVE (Wave 3 PR 2 shipped 2026-05-26)
**ADR origin:** [ADR-0011](../../adr/0011-composable-sub-skills-architecture.md) + [ADR-0012](../../adr/0012-master-coordinator-pattern.md) + [ADR-0013](../../adr/0013-self-improvement-primitives.md)

## Job-to-be-done

Construct a starting roast recipe before the physical roast happens. Output is a recipe proposal — pre-push, no substrate write. The Roast Recorder (executor) handles the actual `push_roast` + `push_roast_recipe` after the physical roast completes.

## Workflow scope

- Read lot specs (cultivar / process / density / moisture / producer / lot identifiers)
- Pull cross-lot patterns from Roasting Historian (`scope_tags`-driven query for similar lots once arrays populate; FK-seeded `by-cultivar/` + `by-process/` stubs as fallback today)
- Pull WBC-tested patterns from WBC Roasting Archivist (5-lane portfolio framing + per-strategy lessons)
- Pull machine constraints from Roest Knowledge (L200 Ultra thermal behavior + API quirks + protocol stack)
- Pull peer-roaster patterns from Peer-Learning Roasting Archivist (Dongzhe profile + cross-peer N<3 stub as it grows)
- Pull sourcing/lane context from WBC Roasting Archivist § sourcing/ (until Sourcing Knowledge splits out per ADR-0011)
- Construct: `charge_temp` / `hopper_load_temp` / bezier curves (temperature/fan/RPM/power) / drop rules / predicted FC / predicted cup / Hypothesis prose
- For V-set lots: generate 3 batches (V_n a/b/c) with deliberate variance against a documented `variable_being_tested` and `expected_outcome` per V-set methodology
- For one-shot lots: single batch design (`one-shot.md` STAGE 2 framing); same cluster reads, no a/b/c variance

## Inputs

- Lot specs (from `start-lot.md` prompt, or new-V-set design from `log-cupping.md` STAGE 3)
- [Roasting Historian](../roasting-historian/) cluster — closed-lot patterns + open questions + cross-coffee insights + roast-to-brew translation
- [WBC Roasting Archivist](../wbc-roasting-archivist/) cluster — WBC corpus + sourcing strategy
- [Roest Knowledge](../roest-knowledge/) cluster — machine docs + API quirks + protocols (evaluation / fan-strategy / fc-marking)
- [Peer-Learning Roasting Archivist](../peer-learning-roasting-archivist/) cluster — per-peer profiles (Dongzhe today)
- (Pre-2026-05-27 the Inputs list included "Learning Assistant track-aware metadata when the lot is part of a research track." That dependency is removed — Research Coordinator + Research Assistant per [ADR-0017](../../adr/0017-research-assistant-architecture.md) do NOT write track-aware metadata onto constituent roasts. If a roast is part of a research track, the cross-link is logged in the project protocol doc + handoff brief, not on the `roasts` row.)

## Outputs

- Roast recipe proposal — typed structure matching `roast_recipes` schema columns (charge_temp / hopper_load_temp / temperature_bezier / fan_bezier / rpm_bezier / power_bezier / drop_rule_if_fast / drop_rule_if_slow / predicted_fc_temp / predicted_cup / rationale), but NOT pushed yet
- Per-batch design specs for V-sets: 3 batches with deliberate variance + the variable being tested + the expected outcome per batch
- Recipe lineage links via `parent_recipe_id` self-FK when the proposal replicates a prior recipe (e.g. "v3a replicates v2b")

## Called by / Calls

- **Called by:** Master Coordinator (via `start-lot.md` or `one-shot.md` new-lot intent, or `log-cupping.md` STAGE 3 V_(n+1) design intent), Cupping Specialist Path B (when designing next V-set after current V-set's cupping)
- **Calls:** Roasting Historian · WBC Roasting Archivist · Roest Knowledge · Peer-Learning Roasting Archivist
- **Hands off to:** Roest API Worker (when the operator approves the proposal and wants it pushed as a Roest profile) → Roast Recorder (after physical roast completes)

## MCP Tools in scope

None directly. The recipe proposal stays in claude.ai context until Roest API Worker pushes it as a Roest profile and Roast Recorder writes it to the corpus via `push_roast` + `push_roast_recipe` post-roast.

## Self-improvement

- **Patterns:** E (workflow-execution refresh — sub-skill invoked → output observed → success/fail captured via downstream cup outcome) — see [ADR-0013](../../adr/0013-self-improvement-primitives.md)
- **Signal:** Historian pattern drift (new cross-lot lesson lands) → re-validate any pending recipe proposals; observed-vs-predicted-FC delta > threshold across consecutive lots → prompt refinement; Cupping Specialist Path C close-out flags the recipe as "didn't match prediction" → flag the proposal logic for retro

## Wave 3 PR 2 ship notes (2026-05-26)

- **No cluster authored.** Per scope decision 1, Workflow Planning sub-skills are reads-only composition over Wave 1+2 Knowledge clusters. SKILL.md captures the full composition logic; a `cluster/` materializes later under Pattern F if templates emerge after lived use.
- **Prompts unchanged.** Per scope decision 2, `start-lot.md` / `log-roast.md` / `one-shot.md` / `log-cupping.md` continue as the claude.ai entry surface. Roasting Assistant becomes the canonical fetch target the prompts compose over via MCP Resource read.
- **All 4 Knowledge tier dependencies ACTIVE** post Wave 3 PR 1: Roasting Historian (Wave 2 PR 3) + WBC Roasting Archivist (Wave 2 PR 1) + Roest Knowledge (Wave 3 PR 1) + Peer-Learning Roasting Archivist (Wave 3 PR 1). First Workflow Planning sub-skill with all its inputs in place.
- **Sourcing Knowledge resolution:** today lives inside WBC Roasting Archivist § sourcing/ per ADR-0011 tentative collapse. Roasting Assistant pulls from that location; when the sourcing book lands and Sourcing Knowledge splits out, this SKILL.md's Inputs list updates.
- **POD-1 dependency:** when Cupping Specialist (Wave 3 PR 3) routes V-set Path B, it dispatches Roasting Assistant for V_(n+1) design. Handoff chain pre-authored in [`coordinator/handoff-rules.md`](../coordinator/handoff-rules.md) Chain 3.
- **Migration source:** today's `docs/prompts/start-lot.md` STAGES 1-3 + `docs/prompts/one-shot.md` STAGE 2 cover roast recipe construction. Prompts continue to drive the operator surface; Roasting Assistant elevates the logic to a sub-skill spec that Master Coordinator dispatches to.
- **Cross-system audit:** Actor 6 (no DB schema change), Actor 4 (MCP Resource registration for this SKILL.md), Actor 5 (CLAUDE.md sub-skills section notes ACTIVE status), Actor 2 (prompts unchanged per scope decision 2), Actor 3 (next claude.ai session-start catalog refresh picks up the ACTIVE status), Actor 1 (operator's start-lot sessions get explicit dispatch surface via Master Coordinator).
