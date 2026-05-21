# Sourcing Workflow Planner

**Tier:** Workflow / **Sub-tier:** Planning / **Domain:** Roasting / **Wave:** 3 / **Status:** PLACEHOLDER
**ADR origin:** [ADR-0011](../../adr/0011-composable-sub-skills-architecture.md) + [ADR-0012](../../adr/0012-master-coordinator-pattern.md) + [ADR-0013](../../adr/0013-self-improvement-primitives.md)

## Job-to-be-done

Evaluate a new lot opportunity against sourcing strategy + current portfolio. Recommend buy / hold / pass + lane-fit assessment.

## Workflow scope

- Read lot opportunity (importer offering / sample arrival / WBC year reference / sourcing channel signal)
- Pull sourcing strategy from Sourcing Knowledge (currently merged into WBC Roasting Archivist's cluster per ADR-0011 tentative collapse)
- Pull current inventory state (`green_beans` rows where lifecycle_state ∈ {in_inventory, waiting_for_next_roast})
- Pull lane-performance signals from closed lots via Roasting Historian
- Construct: recommendation (buy / hold / pass) + lane-fit assessment + rationale

## Inputs

- Lot opportunity (operator-provided or sourced from importer feeds)
- Sourcing Knowledge cluster (5-lane portfolio definitions + tier-priority targets)
- Current inventory from `green_beans` table
- Roasting Historian's lane-performance retros

## Outputs

- Sourcing recommendation (buy / hold / pass)
- Lane-fit assessment ("fits Tier 2 / Lane B — Experimental Processing")
- Rationale prose

## Called by / Calls

- **Called by:** Master Coordinator (via new-sourcing-opportunity intent)
- **Calls:** Sourcing Knowledge (currently in WBC Roasting Archivist cluster) · Roasting Historian

## MCP Tools in scope

None directly. Sourcing decisions are physical-world events; no substrate write until the lot arrives and is added via `push_green_bean`.

## Self-improvement

- **Patterns:** E (workflow-execution refresh — recommendation quality measured against lot outcome after roasting + cupping) — see [ADR-0013](../../adr/0013-self-improvement-primitives.md)
- **Signal:** lane miss/hit rate drift from closed lots > threshold → re-validate sourcing strategy

## Notes for Wave 3 implementation sprint

- **No existing prompt absorbs into this sub-skill** — sourcing today is operator-decided, no formal workflow. This sub-skill is partially net-new.
- **Dependency:** WBC Roasting Archivist (Wave 2; holds the Sourcing Knowledge cluster) + Roasting Historian (Wave 2; provides closed-lot lane retros) must ship first.
- **Sourcing Knowledge split trigger:** if Chris does dedicated sourcing research (the sourcing book on his TODO), Sourcing Knowledge splits out from WBC Roasting Archivist into its own cluster. This sub-skill's `Calls` list updates accordingly.
- **Cross-system audit:** Actor 6 (no DB schema change), Actor 4 (MCP Resource registration), Actor 5 (CLAUDE.md notes), Actor 2 (new prompt `docs/prompts/evaluate-sourcing.md` or similar; TBD), Actor 3 (catalog refresh), Actor 1 (operator gets structured sourcing-decision surface).
