# Learning Knowledge

**Tier:** Knowledge / **Domain:** Cross-domain / **Wave:** DEFERRED (no active wave assignment) / **Status:** PLACEHOLDER
**ADR origin:** [ADR-0011](../../adr/0011-composable-sub-skills-architecture.md) + [ADR-0012](../../adr/0012-master-coordinator-pattern.md) + [ADR-0013](../../adr/0013-self-improvement-primitives.md)

## Job-to-be-done

Author and maintain **research-track** docs — long-running cross-lot/cross-coffee studies that span multiple brews + roasts. Distinct vocabulary from per-lot `experiments` table rows. Examples (from Chris's Round 2 naming): "test water side across next 5 lots", "blending experiments across green beans I have more of", "longitudinal study of resting curve behavior across cultivars."

## Knowledge cluster contents (target — when not deferred)

- `cluster/tracks/<track-name>.md` — per-research-track design + execution + outcomes + meta-synthesis
- `cluster/cross-track/patterns.md` — cross-track meta-synthesis when multiple tracks converge on a learning
- `cluster/track-index.md` — registry of active + completed research tracks

## Inputs

- Research-track completion events (from workflow-side Learning Assistant)
- Per-constituent-roast and per-constituent-brew metadata (track-aware cross-linking)

## Outputs

- Research-track retros (per track)
- Cross-track meta-synthesis (when ≥3 tracks land on the same learning)

## Called by / Calls

- **Called by:** CCIL (during cross-domain synthesis), Learning Assistant (when proposing next research track — consults prior tracks for design context)
- **Calls:** None

## MCP Tools in scope

None directly.

## Self-improvement

- **Patterns:** A (substrate-event refresh on research-track completion) — see [ADR-0013](../../adr/0013-self-improvement-primitives.md)
- **Signal:** track-completion event from Learning Assistant

## Deferred status rationale

Per Chris's Round 2 lock: "Workflow-side Learning Assistant runs a few research tracks first; THEN spin up Learning Knowledge to archive their outcomes." Deferring this sub-skill until the workflow side has produced concrete research-track artifacts avoids speculative authoring. Promotion trigger: ≥2 research tracks completed by Learning Assistant → spawn Learning Knowledge as Wave 4+ ship.

## Notes for whenever-it-ships sprint

- **Vocabulary discipline:** use "research tracks" (locked per Round 2 AskUserQuestion) — NOT "experiments" — to disambiguate from per-lot `experiments` table rows.
- **Promotion mechanism:** when Learning Assistant logs a third research-track-completion event, the system should propose spawning Learning Knowledge as a sub-skill ship.
- **Cross-system audit at ship time:** standard 6-actor matrix; will reference completed research tracks already living in workflow-tier execution logs.
