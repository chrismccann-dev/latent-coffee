# WBC Brewing Archivist

**Tier:** Knowledge / **Domain:** Brewing / **Wave:** 2 / **Status:** Wave 2 PR 1 shipped 2026-05-26
**ADR origin:** [ADR-0011](docs/adr/0011-composable-sub-skills-architecture.md) + [ADR-0012](docs/adr/0012-master-coordinator-pattern.md) + [ADR-0013](docs/adr/0013-self-improvement-primitives.md)

## Job-to-be-done

Author and maintain the WBC (World Brewers Cup) competitor corpus on the brewing side (2022-2026); surface WBC strategy patterns to Brewing Assistant.

## Knowledge cluster contents (Wave 2 PR 1)

- [`cluster/wbc-reference.md`](docs/skills/wbc-brewing-archivist/cluster/wbc-reference.md) — migrated from `docs/brewing/wbc-reference.md` (5-axis foundational map + 9 strategy families, incl. Water Chemistry Systems added in the 2026 drop). Old path resolves to a redirect stub for back-compat.
- [`cluster/wbc-recipes.md`](docs/skills/wbc-brewing-archivist/cluster/wbc-recipes.md) — recipe taxonomy: strategy distribution + strategically important findings + 65 subtype definitions across 10 families (2022-2026). Migrated from `docs/brewing/wbc-recipes.md`; old path resolves to a redirect stub.
- [`cluster/wbc-recipes-by-family.md`](docs/skills/wbc-brewing-archivist/cluster/wbc-recipes-by-family.md) — the 154 competitor-by-competitor recipe rows grouped by strategy family (the per-competitor lookup). Split out of wbc-recipes.md 2026-06-29 (Pattern J prune) when the combined doc crossed the 60 KB single-doc cap.
- [`cluster/per-strategy/<strategy>.md`](docs/skills/wbc-brewing-archivist/cluster/per-strategy/) — 6 per-strategy stub docs (Suppression / Clarity-First / Balanced Intensity / Full Expression / Extraction Push / Hybrid). Placeholders today; populate as patterns crystallize.
- [`cluster/canonical/wbc-tested-recipes.md`](docs/skills/wbc-brewing-archivist/cluster/canonical/wbc-tested-recipes.md) — canonical registry stub tracking which WBC recipes have been directly tested on a Latent brew. Empty today; grows via the Step 1d WBC corpus-check Named Consideration.

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

- **Patterns:** B (external-event refresh on new WBC year drop) — see [ADR-0013](docs/adr/0013-self-improvement-primitives.md)
- **Signal:** new WBC year → prompt refresh

## Wave 2 PR 1 ship notes (2026-05-26)

- **Files migrated:** `docs/brewing/wbc-reference.md` + `docs/brewing/wbc-recipes.md` → `cluster/` via `git mv`; original paths now hold ~200-byte redirect stubs.
- **MCP Resources:** new cluster files registered in [lib/mcp/docs.ts](lib/mcp/docs.ts) `DOC_FILES` + `DOC_DESCRIPTIONS` + `listDocs`. Old `docs://brewing/wbc-{reference,recipes}.md` URIs resolve to redirect stubs (URI back-compat preserved per Wave 1 pattern).
- **Cross-system propagation:** ARBITER.md routing updated to direct new `propose_doc_changes` proposals at WBC content into the cluster; CONTEXT-{roasting,brewing,shared}.md / BREWING.md / SYNC_V2.md / CLAUDE.md path refs updated to cluster paths; relevant brewing prompts (`start-brew.md`, `bundled-brewing-completion.md`) reference WBC Brewing Archivist as the lookup home.
- **Subsequent waves:** Wave 4 may rewrite BREWING.md Section 4 as a redirect-stub pointer; this sub-skill becomes the authoritative home.

## 2026 WBC drop (2026-06-29)

- **Inputs:** Chris's four CSVs (2026 routines + Core Strategy Families to add + Subtypes to add + Subtypes to review).
- **Added:** 52 routines (46 Round One + 6 Finals; corpus 102 → 154), the new **Water Chemistry Systems** family (9th family, 3 subtypes), and 11 new subtypes total (65 across 10 families). All 3 "to review" candidates with clear 2026 representatives (Pre-Brew Blend Synchronization, High-Concentration Push, Sandwich Layer Extraction) made the cut; the other 8 "to review" rows already existed verbatim.
- **Decisions (Chris, 2026-06-29):** Water Chemistry stays a doc-layer family mapped to § Water Strength, NOT a canonical modifier (revisit after the water experiment); both Round One and Finals rows kept for the 6 finalists.
- **2026 champion:** Nas Jaafar (Hybrid — resistance-managed percolation→immersion on UFO V3 + Switch).
- **Files touched:** `cluster/wbc-recipes.md`, `cluster/wbc-reference.md`, this SKILL.md, `lib/mcp/docs.ts` (Resource descriptions).
