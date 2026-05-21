# WBC Roasting Archivist

**Tier:** Knowledge / **Domain:** Roasting / **Wave:** 2 / **Status:** PLACEHOLDER
**ADR origin:** [ADR-0011](../../adr/0011-composable-sub-skills-architecture.md) + [ADR-0012](../../adr/0012-master-coordinator-pattern.md) + [ADR-0013](../../adr/0013-self-improvement-primitives.md)

## Job-to-be-done

Author and maintain the WBC competitor corpus on the roasting side (2022-2025); surface patterns from competition roasting to Roasting Assistant. **Tentatively absorbs Sourcing Knowledge** per Chris's Round 2 collapse — Sourcing Knowledge today is light surface area with all content sourced from the WBC corpus; split out when Chris does dedicated sourcing research (book read, etc.).

## Knowledge cluster contents (target Wave 2)

- `cluster/wbc-roasting.md` — migrated from existing `docs/roasting/wbc-roasting.md`
- `cluster/sourcing/strategy.md` — migrated from existing `docs/roasting/wbc-sourcing.md` (tentative merge; future split when sourcing research grows)
- `cluster/sourcing/portfolio-lanes.md` — 5-lane portfolio definitions + inventory mapping
- `cluster/sourcing/priority-targets.md` — Tier 1/2/3 priority targets
- `cluster/per-competitor/<year>-<competitor>.md` — per-competitor extracts and lessons
- `cluster/canonical/wbc-tested-cultivars.md` — underlying canonical registry of WBC-tested cultivars/processes/sourcing patterns (the "knowledge cluster sub-resources" Chris flagged in Round 2)

## Inputs

- Annual WBC year drop (new competition year content)
- Sourcing channel events (importer offerings, sample arrivals)
- Closed-lot lane-performance signals (feeds back into portfolio-lane retros)

## Outputs

- WBC-derived roasting lessons + competitor profiles + pattern synthesis
- Sourcing strategy + 5-lane portfolio + priority target list
- Lane miss/hit retros

## Called by / Calls

- **Called by:** Roasting Assistant (during recipe design — pulls WBC-tested patterns as anchors), Sourcing Workflow Planner (during lot opportunity evaluation), CCIL (during cross-domain synthesis)
- **Calls:** None

## MCP Tools in scope

None directly.

## Self-improvement

- **Patterns:** B (external-event refresh on new WBC year drop; sourcing channel events) — see [ADR-0013](../../adr/0013-self-improvement-primitives.md)
- **Signal:** new WBC year drops → prompt refresh; lane miss/hit drift threshold from closed lots

## Notes for Wave 2 implementation sprint

- **Migration sources:** `docs/roasting/wbc-roasting.md` (existing, ~moderate size) + `docs/roasting/wbc-sourcing.md` (existing). Migrate both into `cluster/`; original paths get redirect stubs.
- **Sourcing collapse rationale (per Chris's Round 2 confirmation):** Sourcing's content today all came from the WBC corpus. Net surface area is light. Tentative merge into one sub-skill; future split when Chris does dedicated sourcing research (sourcing book on his TODO).
- **Cross-system audit:** Actor 6 (file moves + redirect stubs), Actor 4 (MCP Resource registration; the existing `docs://roasting/wbc-roasting.md` + `docs://roasting/wbc-sourcing.md` Resources get added cluster paths), Actor 5 (CLAUDE.md docs index update), Actor 2 (start-lot.md STAGE 2 carry-forward search references this as a knowledge cluster), Actor 3 (catalog refresh), Actor 1 (sourcing decisions get richer context).
