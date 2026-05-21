# Learning Assistant

**Tier:** Workflow / **Sub-tier:** Planning / **Domain:** Cross-domain / **Wave:** 3 / **Status:** PLACEHOLDER
**ADR origin:** [ADR-0011](../../adr/0011-composable-sub-skills-architecture.md) + [ADR-0012](../../adr/0012-master-coordinator-pattern.md) + [ADR-0013](../../adr/0013-self-improvement-primitives.md)

## Job-to-be-done

Construct and run **research tracks** — long-running cross-lot/cross-coffee studies. Examples (Chris's Round 2 naming): "test water side across next 5 lots", "blending experiments with greens I have more of", "longitudinal resting-curve study across cultivars." Distinct from per-lot `experiments` table rows. **The only cross-domain planner** — research tracks naturally span both brewing and roasting.

## Workflow scope

- Read operator hypothesis / observation / open question
- Pull cross-lot patterns from Roasting Historian + Brewing Historian
- Pull cross-domain insights from CCIL
- Pull inventory from Sourcing Knowledge (what greens are available for the track)
- Construct: research-track design (multi-step protocol across lots) + execution plan + outcome-capture template
- During execution: dispatch per-constituent-roast / per-constituent-brew with track-aware metadata for cross-linking
- On track completion: prepare end document for future Learning Knowledge worker archival

## Inputs

- Operator hypothesis / observation / open question
- Roasting Historian + Brewing Historian patterns
- CCIL cross-domain insights
- Inventory state (from Sourcing Knowledge or direct `green_beans` read)

## Outputs

- Research-track design doc
- Execution plan (which lots/brews/cuppings happen when)
- Outcome capture during execution
- End-document handoff to Learning Knowledge (when promoted from deferred)

## Called by / Calls

- **Called by:** Master Coordinator (via research-track-design intent)
- **Calls:** Roasting Historian · Brewing Historian · CCIL · Sourcing Knowledge · downstream Roasting Assistant / Brewing Assistant per constituent roast/brew

## MCP Tools in scope

None directly. Constituent roast/brew pushes flow through Roast Recorder / Brew Recorder.

## Self-improvement

- **Patterns:** E (workflow-execution refresh — track design quality measured against outcome utility) — see [ADR-0013](../../adr/0013-self-improvement-primitives.md)
- **Signal:** track-completion / question-resolution event → retro the track's design against outcome value

## Notes for Wave 3 implementation sprint

- **Vocabulary discipline:** "research tracks" — NOT "experiments" — to disambiguate from per-lot `experiments` table rows.
- **No substrate writes by this sub-skill directly** — track-aware metadata lands on constituent roasts/brews via Roast Recorder / Brew Recorder, NOT as separate `research_tracks` table rows. Deferring substrate-table addition until enough tracks land to validate the schema shape (Pattern A signal threshold for Learning Knowledge promotion).
- **The only cross-domain planner.** Cross-domain workflows are constrained to this one sub-skill + CCIL (the only cross-domain knowledge sub-skill once it ships in Wave 4).
- **Dependency on Wave 2 ships:** Roasting Historian + Brewing Historian; CCIL is Wave 4 so Learning Assistant ships before CCIL with degraded cross-domain context until CCIL lands.
- **Cross-system audit:** Actor 6 (no DB schema change Wave 3; revisit when Learning Knowledge ships), Actor 4 (MCP Resource registration), Actor 5 (CLAUDE.md notes), Actor 2 (new prompt for research-track intake — `docs/prompts/research-track-design.md` or similar; TBD), Actor 3 (catalog refresh), Actor 1 (operator gets first-class research-track surface).
