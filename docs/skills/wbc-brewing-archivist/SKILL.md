# WBC Brewing Archivist

**Tier:** Knowledge / **Domain:** Brewing / **Wave:** 2 / **Status:** Wave 2 PR 1 shipped 2026-05-26
**ADR origin:** [ADR-0011](../../adr/0011-composable-sub-skills-architecture.md) + [ADR-0012](../../adr/0012-master-coordinator-pattern.md) + [ADR-0013](../../adr/0013-self-improvement-primitives.md)

## Job-to-be-done

Author and maintain the WBC (World Brewers Cup) competitor corpus on the brewing side (2022-2025); surface WBC strategy patterns to Brewing Assistant.

## Knowledge cluster contents (Wave 2 PR 1)

- [`cluster/wbc-reference.md`](cluster/wbc-reference.md) — migrated from `docs/brewing/wbc-reference.md` (5-axis foundational map + 8 strategy families). Old path resolves to a redirect stub for back-compat.
- [`cluster/wbc-recipes.md`](cluster/wbc-recipes.md) — migrated from `docs/brewing/wbc-recipes.md` (102-recipe corpus). Old path resolves to a redirect stub.
- [`cluster/per-strategy/<strategy>.md`](cluster/per-strategy/) — 6 per-strategy stub docs (Suppression / Clarity-First / Balanced Intensity / Full Expression / Extraction Push / Hybrid). Placeholders today; populate as patterns crystallize.
- [`cluster/canonical/wbc-tested-recipes.md`](cluster/canonical/wbc-tested-recipes.md) — canonical registry stub tracking which WBC recipes have been directly tested on a Latent brew. Empty today; grows via the Step 1d WBC corpus-check Named Consideration.

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

## Wave 2 PR 1 ship notes (2026-05-26)

- **Files migrated:** `docs/brewing/wbc-reference.md` + `docs/brewing/wbc-recipes.md` → `cluster/` via `git mv`; original paths now hold ~200-byte redirect stubs.
- **MCP Resources:** new cluster files registered in [lib/mcp/docs.ts](../../../lib/mcp/docs.ts) `DOC_FILES` + `DOC_DESCRIPTIONS` + `listDocs`. Old `docs://brewing/wbc-{reference,recipes}.md` URIs resolve to redirect stubs (URI back-compat preserved per Wave 1 pattern).
- **Cross-system propagation:** ARBITER.md routing updated to direct new `propose_doc_changes` proposals at WBC content into the cluster; CONTEXT.md / BREWING.md / SYNC_V2.md / CLAUDE.md path refs updated to cluster paths; relevant brewing prompts (`start-brew.md`, `bundled-brewing-completion.md`) reference WBC Brewing Archivist as the lookup home.
- **Subsequent waves:** Wave 4 may rewrite BREWING.md Section 4 as a redirect-stub pointer; this sub-skill becomes the authoritative home.
