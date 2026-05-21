# Brewing Historian

**Tier:** Knowledge / **Domain:** Brewing / **Wave:** 2 / **Status:** PLACEHOLDER
**ADR origin:** [ADR-0011](../../adr/0011-composable-sub-skills-architecture.md) + [ADR-0012](../../adr/0012-master-coordinator-pattern.md) + [ADR-0013](../../adr/0013-self-improvement-primitives.md)

## Job-to-be-done

Author and maintain lessons-learned from `brews` rows; surface cross-strategy + cross-coffee patterns to Brewing Assistant during recipe construction. Does *internal-to-domain* cross-brew synthesis (e.g. cross-strategy within brewing, cross-cultivar within brewing). CCIL above synthesizes cross-domain (roasting + brewing).

## Knowledge cluster contents (target Wave 2)

- `cluster/patterns/by-strategy/<strategy>.md` — per-extraction-strategy patterns (Suppression / Clarity-First / Balanced Intensity / Full Expression / Extraction Push / Hybrid)
- `cluster/patterns/by-cultivar/<cultivar>.md` — cross-brew patterns scoped by cultivar (e.g. "what I've learned across all my Sudan Rume brews")
- `cluster/patterns/by-coffee-family/<family>.md` — cross-brew patterns scoped by coffee family (e.g. all Anaerobic Washed brews)
- `cluster/patterns/cross-coffee-insights.md` — internal cross-coffee synthesis (**ABSORBS the existing BREWING.md "Cross-Coffee Insight Layer" section**)

## Inputs

- Every `push_brew` execution
- `brews` table rows (read-only)
- Corpus tier signals (early / emerging / established / mature per CONTEXT.md § Corpus tier)

## Outputs

- Per-strategy + per-coffee-family rollup docs (cluster contents above)
- Recommendations consumable by Brewing Assistant during recipe planning

## Called by / Calls

- **Called by:** Brewing Assistant (during recipe planning), CCIL (during cross-domain synthesis)
- **Calls:** None

## MCP Tools in scope

None directly. The existing `propose_doc_changes` pipeline applies cluster updates.

## Self-improvement

- **Patterns:** A (substrate-event refresh on push_brew), D (tier-threshold refresh when corpus crosses early→emerging→established→mature), F (bloat-tripwire decomposition) — see [ADR-0013](../../adr/0013-self-improvement-primitives.md)
- **Signal:** corpus tier crossing → pattern-doc refresh; new strategy promoted (e.g. from "consciously not pursuing" to active) → strategy-doc refresh

## Notes for Wave 2 implementation sprint

- **Migration source:** BREWING.md's "Cross-Coffee Insight Layer" section migrates verbatim into `cluster/patterns/cross-coffee-insights.md`. This is one of the larger Wave-2 migration tasks; BREWING.md is 213KB and a significant fraction is this section.
- **Brew count today:** 79+ brews. Established tier per the corpus classifier. Initial strategy + cultivar pattern docs work from this corpus.
- **Distinction from CCIL:** Brewing Historian's "cross-coffee" is *within brewing* (e.g. "what works across my Sudan Rume brews"). CCIL's "cross-coffee" is *across brewing + roasting* (e.g. "what I learned about Sudan Rume in BOTH domains"). The wording is overloaded; the architecture documents this distinction in ADR-0011.
- **Cross-system audit:** Actor 6 (file authoring + BREWING.md content extraction), Actor 4 (MCP Resource registration), Actor 5 (CLAUDE.md update — BREWING.md gets shorter), Actor 2 (`bundled-brewing-completion.md` references Brewing Historian as cross-coffee target), Actor 3 (catalog refresh), Actor 1 (operator's brewing sessions get richer cross-coffee context via Brewing Assistant).
