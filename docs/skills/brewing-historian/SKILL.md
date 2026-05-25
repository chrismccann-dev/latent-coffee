# Brewing Historian

**Tier:** Knowledge / **Domain:** Brewing / **Wave:** 2 / **Status:** Wave 2 PR 2 shipped 2026-05-26
**ADR origin:** [ADR-0011](../../adr/0011-composable-sub-skills-architecture.md) + [ADR-0012](../../adr/0012-master-coordinator-pattern.md) + [ADR-0013](../../adr/0013-self-improvement-primitives.md)

## Job-to-be-done

Author and maintain lessons-learned from `brews` rows; surface cross-strategy + cross-coffee patterns to Brewing Assistant during recipe construction. Does *internal-to-domain* cross-brew synthesis (e.g. cross-strategy within brewing, cross-cultivar within brewing). CCIL above synthesizes cross-domain (roasting + brewing).

## Knowledge cluster contents (Wave 2 PR 2)

- [`cluster/patterns/cross-coffee-insights.md`](cluster/patterns/cross-coffee-insights.md) — absorbs the BREWING.md "Cross-Coffee Insight Layer" intro + § How to Use This Section + § By Modifier (Axis 2) + § By Process + § By Variety + § Cooling Behavior Observations + § Office Brewing Notes (Palo Alto) + § Open Questions + § End-of-Coffee Workflow. BREWING.md retains a back-compat h1 + pointer block at `#cross-coffee-insight-layer`.
- [`cluster/patterns/by-strategy/<strategy>.md`](cluster/patterns/by-strategy/) — 6 per-extraction-strategy files (Suppression / Clarity-First / Balanced Intensity / Full Expression / Extraction Push / Hybrid). Each absorbs the BREWING.md "Coffees That Confirmed X" sub-section verbatim + cross-links to the BREWING.md § Axis 1 canonical strategy definition.
- [`cluster/patterns/by-cultivar/<cultivar>.md`](cluster/patterns/by-cultivar/) — 7 N≥3 cultivar stubs (Gesha N=34, 74158 N=5, Sidra N=5, Ethiopian landrace population N=4, Mejorado N=3, Pacamara N=3, Sudan Rume N=3). Each points back to the cross-coffee-insights.md § By Variety rollup + per-strategy entries; per-cultivar deep-dive patterns accrue as the corpus grows.
- [`cluster/patterns/by-coffee-family/<family>.md`](cluster/patterns/by-coffee-family/) — 6 N≥3 base+fermentation-modifier stubs (Anaerobic Natural N=10, Anaerobic Washed N=5, Yeast-Inoculated Washed N=4, Yeast-Inoculated Natural N=3, Double Anaerobic Washed N=3, Thermal Shock Washed N=3). Pointer structure same as by-cultivar; per-family deep-dive patterns accrue.

## Inputs

- Every `push_brew` execution
- `brews` table rows (read-only)
- Corpus tier signals (early / emerging / established / mature per CONTEXT-shared.md § Corpus tier)

## Outputs

- Per-strategy + per-coffee-family rollup docs (cluster contents above)
- Recommendations consumable by Brewing Assistant during recipe planning

## Called by / Calls

- **Called by:** Brewing Assistant (during recipe planning), CCIL (during cross-domain synthesis)
- **Calls:** None

## MCP Tools in scope

None directly. The existing `propose_doc_changes` pipeline applies cluster updates via `target_doc='skills/brewing-historian/cluster/patterns/<file>.md'` (ARBITER.md routing accepts the `skills/{path}.md` shape post-Wave 2 PR 1).

## Self-improvement

- **Patterns:** A (substrate-event refresh on push_brew), D (tier-threshold refresh when corpus crosses early→emerging→established→mature), F (bloat-tripwire decomposition) — see [ADR-0013](../../adr/0013-self-improvement-primitives.md)
- **Signal:** corpus tier crossing → pattern-doc refresh; new strategy promoted (e.g. from "consciously not pursuing" to active) → strategy-doc refresh; per-cultivar / per-coffee-family corpus crossing N=3 threshold → new stub seeded from the corresponding by-variety / by-process rollup

## Wave 2 PR 2 ship notes (2026-05-26)

- **Source migration:** BREWING.md § Cross-Coffee Insight Layer (lines 585-934 of the pre-PR file, ~90KB of content) extracted into 21 cluster files. BREWING.md shrunk from 213,831 bytes → 124,107 bytes (~88KB shrink, within the 60-80KB target band; slightly over). The h1 + pointer block at `#cross-coffee-insight-layer` stays in BREWING.md for anchor back-compat.
- **Per-strategy split decision:** the 6 "Coffees That Confirmed X" sub-sections moved to `by-strategy/<strategy>.md` (one file each); the BREWING.md § Axis 1 canonical strategy definitions stay in BREWING.md (residual through Wave 4, per scope-out: Two-Axis Framework intro stays). Each by-strategy file cross-links back to the Axis 1 definition.
- **Cluster seeding:** Stub-heavy approach for by-cultivar/ and by-coffee-family/ — N≥3 entries get pointer files referencing the cross-coffee-insights.md rollup; N<3 entries skipped this PR. Stubs grow as new patterns emerge.
- **MCP Resources:** 21 new cluster files registered in [lib/mcp/docs.ts](../../../lib/mcp/docs.ts) `DOC_FILES` + `DOC_DESCRIPTIONS` + `listDocs`. Existing `./docs/skills/**/*.md` glob in [next.config.js](../../../next.config.js) covers all new paths (Wave 1 work); no glob change needed. `npm run check:mcp-bundle` passes.
- **Cross-system propagation:** CLAUDE.md Documentation Index updated; PRODUCT.md § Active Sprints Wave 2 PR 2 marked shipped; `docs/sprints/shipped.md` row added; BREWING.md self-refs (Hybrid pointer at line ~115, End-of-Coffee workflow at line ~406) point at cluster files instead of in-doc anchors.
- **Subsequent waves:** Wave 2 PR 3 (Roasting Historian, parallel extraction of ROASTING.md § Cross-Coffee Insight Layer) is the next ship. Wave 4 may rewrite BREWING.md residual content as a redirect stub once CCIL cross-domain authoring stabilizes.
