# WBC Roasting Archivist

**Tier:** Knowledge / **Domain:** Roasting / **Wave:** 2 / **Status:** Wave 2 PR 1 shipped 2026-05-26
**ADR origin:** [ADR-0011](docs/adr/0011-composable-sub-skills-architecture.md) + [ADR-0012](docs/adr/0012-master-coordinator-pattern.md) + [ADR-0013](docs/adr/0013-self-improvement-primitives.md)

## Job-to-be-done

Author and maintain the WBC competitor corpus on the roasting side (2022-2025); surface patterns from competition roasting to Roasting Assistant. **Tentatively absorbs Sourcing Knowledge** per Chris's Round 2 collapse — Sourcing Knowledge today is light surface area with all content sourced from the WBC corpus; split out when Chris does dedicated sourcing research (book read, etc.).

## Knowledge cluster contents (Wave 2 PR 1)

- [`cluster/wbc-roasting.md`](docs/skills/wbc-roasting-archivist/cluster/wbc-roasting.md) — migrated from `docs/roasting/wbc-roasting.md`. Old path resolves to a redirect stub for back-compat.
- [`cluster/sourcing/strategy.md`](docs/skills/wbc-roasting-archivist/cluster/sourcing/strategy.md) — migrated from `docs/roasting/wbc-sourcing.md` (tentative merge; future split when sourcing research grows). Old path resolves to a redirect stub.
- [`cluster/sourcing/portfolio-lanes.md`](docs/skills/wbc-roasting-archivist/cluster/sourcing/portfolio-lanes.md) — navigational sub-resource for the 5-lane portfolio frame (substantive content lives in `strategy.md § 10`).
- [`cluster/sourcing/priority-targets.md`](docs/skills/wbc-roasting-archivist/cluster/sourcing/priority-targets.md) — navigational sub-resource for Tier 1/2/3 priority targets (substantive content lives in `strategy.md § 7-9`).
- [`cluster/per-competitor/`](docs/skills/wbc-roasting-archivist/cluster/per-competitor/) — placeholder directory for per-competitor deep dives. Empty today; populate as research deepens beyond strategy-level summaries.
- [`cluster/canonical/wbc-tested-cultivars.md`](docs/skills/wbc-roasting-archivist/cluster/canonical/wbc-tested-cultivars.md) — canonical registry stub tracking which WBC-validated cultivar / process / sourcing patterns have been tested in Latent's lineup. Empty today; grows via Latent buying cycles.

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

- **Patterns:** B (external-event refresh on new WBC year drop; sourcing channel events) — see [ADR-0013](docs/adr/0013-self-improvement-primitives.md)
- **Signal:** new WBC year drops → prompt refresh; lane miss/hit drift threshold from closed lots

## Wave 2 PR 1 ship notes (2026-05-26)

- **Files migrated:** `docs/roasting/wbc-roasting.md` + `docs/roasting/wbc-sourcing.md` → `cluster/` via `git mv`; original paths now hold ~200-byte redirect stubs. `wbc-sourcing.md` lands at `cluster/sourcing/strategy.md` (sub-dir reserved for future split if Sourcing Knowledge earns its own sub-skill).
- **Sourcing collapse rationale (Chris's Round 2 confirmation):** Sourcing's content today all came from the WBC corpus. Net surface area is light. Tentative merge into one sub-skill; future split trigger = `cluster/sourcing/` grows beyond ~3-5 docs OR dedicated sourcing research (sourcing book) produces content that doesn't fit alongside WBC strategy patterns.
- **MCP Resources:** new cluster files registered in [lib/mcp/docs.ts](../../../lib/mcp/docs.ts) `DOC_FILES` + `DOC_DESCRIPTIONS` + `listDocs`. Old `docs://roasting/wbc-{roasting,sourcing}.md` URIs resolve to redirect stubs.
- **Cross-system propagation:** ARBITER.md routing updated to direct new `propose_doc_changes` proposals at WBC roasting / sourcing content into the cluster; CONTEXT-{roasting,brewing,shared}.md / ROASTING.md / start-lot.md path refs updated.
- **Subsequent waves:** Wave 3 Roest Knowledge + Wave 4 redirect-stubs on ROASTING.md may interact with this cluster's scope — counterflow methodology stays in ROASTING.md through Wave 3.
