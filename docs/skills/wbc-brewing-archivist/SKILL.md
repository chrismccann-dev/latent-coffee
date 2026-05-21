# WBC Brewing Archivist

**Tier:** Knowledge / **Domain:** Brewing / **Wave:** 2 / **Status:** PLACEHOLDER
**ADR origin:** [ADR-0011](../../adr/0011-composable-sub-skills-architecture.md) + [ADR-0012](../../adr/0012-master-coordinator-pattern.md) + [ADR-0013](../../adr/0013-self-improvement-primitives.md)

## Job-to-be-done

Author and maintain the WBC (World Brewers Cup) competitor corpus on the brewing side (2022-2025); surface WBC strategy patterns to Brewing Assistant.

## Knowledge cluster contents (target Wave 2)

- `cluster/wbc-reference.md` — migrated from existing `docs/brewing/wbc-reference.md` (5-axis foundational map + 8 strategy families)
- `cluster/wbc-recipes.md` — migrated from existing `docs/brewing/wbc-recipes.md` (102-recipe corpus)
- `cluster/per-strategy/<strategy>.md` — per-strategy synthesis (Suppression / Clarity-First / Balanced / etc.)
- `cluster/canonical/wbc-tested-recipes.md` — underlying canonical registry of WBC-tested recipes (the "knowledge cluster sub-resources" pattern)

## Inputs

- Annual WBC year drop (new competition year content)

## Outputs

- WBC strategy reference + recipe corpus index + per-strategy pattern synthesis

## Called by / Calls

- **Called by:** Brewing Assistant (during recipe construction — pulls WBC strategies as anchors), CCIL (during cross-domain synthesis)
- **Calls:** None

## MCP Tools in scope

None directly.

## Self-improvement

- **Patterns:** B (external-event refresh on new WBC year drop) — see [ADR-0013](../../adr/0013-self-improvement-primitives.md)
- **Signal:** new WBC year → prompt refresh

## Notes for Wave 2 implementation sprint

- **Migration sources:** `docs/brewing/wbc-reference.md` + `docs/brewing/wbc-recipes.md` (102-recipe corpus). Move into `cluster/`; original paths get redirect stubs.
- **Cross-system audit:** Actor 6 (file moves + redirect stubs), Actor 4 (MCP Resource paths update — `docs://brewing/wbc-reference.md` etc.), Actor 5 (CLAUDE.md docs index), Actor 2 (`start-brew.md` STEP 1 strategy framing references this), Actor 3 (catalog refresh), Actor 1 (brewing sessions pull WBC anchors more cleanly).
