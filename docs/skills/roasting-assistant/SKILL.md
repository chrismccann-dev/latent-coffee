# Roasting Assistant

**Tier:** Workflow / **Sub-tier:** Planning / **Domain:** Roasting / **Wave:** 3 / **Status:** PLACEHOLDER
**ADR origin:** [ADR-0011](../../adr/0011-composable-sub-skills-architecture.md) + [ADR-0012](../../adr/0012-master-coordinator-pattern.md) + [ADR-0013](../../adr/0013-self-improvement-primitives.md)

## Job-to-be-done

Construct a starting roast recipe before the physical roast happens. Output is a recipe proposal — pre-push, no substrate write. The Roast Recorder (executor) handles the actual `push_roast` + `push_roast_recipe` after the physical roast completes.

## Workflow scope

- Read lot specs (cultivar / process / density / moisture / producer / lot identifiers)
- Pull cross-lot patterns from Roasting Historian (scope_tags-driven query for similar lots)
- Pull WBC-tested patterns from WBC Roasting Archivist
- Pull machine constraints from Roest Knowledge
- Pull sourcing/lane context from Sourcing Knowledge (when relevant)
- Construct: charge_temp / hopper_load / bezier curves (temperature/fan/RPM/power) / drop rules / predicted FC / predicted cup
- For V-set lots: generate 3 batches with deliberate variance (V1a/V1b/V1c) per the V-set methodology

## Inputs

- Lot specs (from `start-lot.md` prompt)
- Roasting Historian's cluster (per-cultivar / per-process / per-density-moisture patterns)
- WBC Roasting Archivist's cluster (canonical WBC-tested patterns)
- Roest Knowledge's cluster (machine-aware constraints)
- Optional: Sourcing Knowledge for lot context (lane assignment, sourcing channel)

## Outputs

- Roast recipe proposal — typed structure matching `roast_recipes` schema, but NOT pushed yet
- Per-batch design specs for V-sets (3 batches with deliberate variance + variable being tested + expected outcome)

## Called by / Calls

- **Called by:** Master Coordinator (via `start-lot.md` or new-lot intent), Cupping Specialist Path B (when designing V_(n+1) after current V-set's cupping)
- **Calls:** Roasting Historian · WBC Roasting Archivist · Roest Knowledge · Sourcing Knowledge

## MCP Tools in scope

None directly. The recipe proposal stays in claude.ai context until Roast Recorder pushes it.

## Self-improvement

- **Patterns:** E (workflow-execution refresh — sub-skill invoked → output observed → success/fail captured via downstream roast outcome) — see [ADR-0013](../../adr/0013-self-improvement-primitives.md)
- **Signal:** Historian pattern drift (new cross-lot lesson lands) → re-validate any pending recipe proposals; observed-vs-predicted-FC delta > threshold → prompt refinement

## Notes for Wave 3 implementation sprint

- **Migration source:** today's `docs/prompts/start-lot.md` STAGES 1-3 cover roast recipe construction. The new Roasting Assistant absorbs that prompt logic and elevates it to a sub-skill spec.
- **POD-1 dependency:** when Cupping Specialist routes V-set Path B, it dispatches Roasting Assistant for V_(n+1) design. This is one of the cross-domain-but-actually-roasting-side handoffs.
- **Dependency on Wave 2 ships:** Roasting Historian + WBC Roasting Archivist + Roest Knowledge must ship before Roasting Assistant has clusters to read. Wave 3 sequencing.
- **Cross-system audit:** Actor 6 (no DB schema change), Actor 4 (MCP Resource registration), Actor 5 (CLAUDE.md notes the sub-skill), Actor 2 (start-lot.md updated to dispatch via Master Coordinator), Actor 3 (catalog refresh), Actor 1 (operator's start-lot sessions get richer cross-lot context).
