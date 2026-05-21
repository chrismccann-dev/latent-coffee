# Roast Recorder

**Tier:** Workflow / **Sub-tier:** Executing / **Domain:** Roasting / **Wave:** 3 / **Status:** PLACEHOLDER
**ADR origin:** [ADR-0011](../../adr/0011-composable-sub-skills-architecture.md) + [ADR-0012](../../adr/0012-master-coordinator-pattern.md) + [ADR-0013](../../adr/0013-self-improvement-primitives.md)

## Job-to-be-done

Push roast info to Latent after the physical roast completes. Records per-batch metrics + per-batch reflections + Roest log interpretation. Writes substrate.

## Workflow scope

- Read Roest log (via `pull_roest_log` MCP Tool or operator-provided screenshot)
- Read operator-provided batch metrics (start/end weight, color, bag label) and per-batch reflections
- Pull Roest Knowledge cluster for log interpretation
- Pull Roasting Historian for retrospective comparison ("how did this roast compare to similar prior lots?")
- Validate + canonicalize payload
- Execute `push_roast` + `push_roast_recipe` (when recipe wasn't pre-pushed by Roasting Assistant)
- Apply `patch_roast` for any post-push corrections

## Inputs

- Roest log + observed batch metrics + per-batch reflections
- Roest Knowledge cluster (for log interpretation)
- Roasting Historian cluster (for retrospective comparison)

## Outputs

- `push_roast` + `push_roast_recipe` row(s) in `roasts` + `roast_recipes` tables
- Optional `patch_roast` corrections

## Called by / Calls

- **Called by:** Master Coordinator (via `log-roast.md`)
- **Calls:** Roest Knowledge · Roasting Historian

## MCP Tools in scope

- `push_roast` — primary write
- `push_roast_recipe` — when recipe wasn't pre-pushed
- `patch_roast` — post-push corrections
- `pull_roest_log` — read Roest log for cross-validation

## Self-improvement

- **Patterns:** A (substrate-event refresh — when new substrate column lands, record interface refresh) — see [ADR-0013](../../adr/0013-self-improvement-primitives.md)
- **Signal:** new substrate column added (e.g. `fc_audibility` Sprint 11) → update record interface to surface it during recording

## Notes for Wave 3 implementation sprint

- **Migration source:** today's `docs/prompts/log-roast.md` STAGES 1-3 cover the recording workflow. New Roast Recorder absorbs that prompt logic.
- **Substrate-writing executor — Stage 1 longer than knowledge tier.** Recommend N=10 for Stage 1 → 2 graduation per [ADR-0013](../../adr/0013-self-improvement-primitives.md) outlier rules. Writes are irreversible.
- **Cross-system audit:** Actor 6 (no DB schema change; reads existing schema), Actor 4 (MCP Resource registration for SKILL.md), Actor 5 (CLAUDE.md notes), Actor 2 (log-roast.md updates), Actor 3 (catalog refresh), Actor 1 (logging flow unchanged in feel, structured underneath).
