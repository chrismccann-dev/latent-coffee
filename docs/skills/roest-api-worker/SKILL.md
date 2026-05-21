# Roest API Worker

**Tier:** Workflow / **Sub-tier:** Executing / **Domain:** Roasting / **Wave:** 3 / **Status:** PLACEHOLDER
**ADR origin:** [ADR-0011](../../adr/0011-composable-sub-skills-architecture.md) + [ADR-0012](../../adr/0012-master-coordinator-pattern.md) + [ADR-0013](../../adr/0013-self-improvement-primitives.md)

## Job-to-be-done

Push roast profiles to the Roest L200 Ultra via the Roest API. Validate that the recipe landed cleanly on the machine. **Symmetry-split from Roest Knowledge** (knowledge tier) per ADR-0011 — Roest Knowledge holds the documentation about the machine and API; Roest API Worker is the workflow executor that uses the API.

## Workflow scope

- Read roast recipe from Roasting Assistant (or directly from operator paste if not coming through the planner)
- Pull Roest Knowledge cluster for API quirks (current firmware behavior, known retry patterns, etc.)
- Translate recipe into Roest API push_roast_profile payload
- Execute `push_roast_profile`
- Validate landing — query the Roest to confirm the recipe is actually on the machine (not just "API accepted the call")
- If validation fails: surface the failure mode + retry or escalate to operator

## Inputs

- Roast recipe (from Roasting Assistant or operator-provided)
- Roest Knowledge cluster (API quirks reference)

## Outputs

- `push_roast_profile` API call to Roest
- Validation result (landed cleanly / failed / retry needed)

## Called by / Calls

- **Called by:** Master Coordinator (via `start-lot.md` after Roasting Assistant) OR Roasting Assistant directly
- **Calls:** Roest Knowledge

## MCP Tools in scope

- `push_roast_profile` — primary API push
- (Future) potentially a `verify_roast_profile_landed` Tool if validation requires a separate API call

## Self-improvement

- **Patterns:** B (external-event refresh — Roest API drift triggers Roest Knowledge update which this sub-skill consumes) — see [ADR-0013](../../adr/0013-self-improvement-primitives.md)
- **Signal:** push_roast_profile failure rate spikes → API drift signal → Roest Knowledge refresh

## Notes for Wave 3 implementation sprint

- **Migration source:** Sprint Roest API write Phase 1+2 (2026-05-06) already shipped `push_roast_profile` Tool with server-side autofill (replaced the manual `current_weight` workaround). The Tool stays where it is in `lib/mcp/`; this sub-skill SKILL.md is the operator-facing knowledge of how/when to call it.
- **Validation gap today:** the current push_roast_profile Tool doesn't validate landing — it returns success on API acceptance, not on machine confirmation. This sub-skill's spec calls out the validation gap as forward investment; whether to add validation is a sprint-time decision.
- **Cross-system audit:** Actor 6 (no schema change Wave 3; potential validation Tool surface later), Actor 4 (MCP Resource registration; the existing push_roast_profile Tool description stays accurate), Actor 5 (CLAUDE.md notes), Actor 2 (start-lot.md updates to mention Roest API Worker as the executor), Actor 3 (catalog refresh), Actor 1 (workflow unchanged in feel; structured underneath).
