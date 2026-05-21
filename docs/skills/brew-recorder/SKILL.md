# Brew Recorder

**Tier:** Workflow / **Sub-tier:** Executing / **Domain:** Brewing / **Wave:** 3 / **Status:** PLACEHOLDER
**ADR origin:** [ADR-0011](../../adr/0011-composable-sub-skills-architecture.md) + [ADR-0012](../../adr/0012-master-coordinator-pattern.md) + [ADR-0013](../../adr/0013-self-improvement-primitives.md)

## Job-to-be-done

Push brew info to Latent after the physical brew session completes. Runs `bundled-brewing-completion` downstream (BREWING.md propose_doc_changes pipeline). Writes substrate.

## Workflow scope

- Read final optimized brew execution data (from Brewing Assistant Phase 3 handoff) + final tasting observations
- Pull Brewing Equipment Expert cluster for canonical validation (brewer / filter / grinder / grind setting must resolve canonical or be override-flagged)
- Pull Brewing Historian for retrospective comparison
- Validate + canonicalize payload (incl. fermentation_qualifiers / Anoxic cue from Sprint T3 / CR-5)
- Execute `push_brew`
- Trigger `bundled-brewing-completion` downstream (propose_doc_changes for BREWING.md updates — Pattern A)

## Inputs

- Brew execution data (from Brewing Assistant Phase 3 handoff)
- Tasting observations (audio capture → text → structured payload)
- Brewing Equipment Expert cluster (canonical validation)
- Brewing Historian cluster (retrospective)

## Outputs

- `push_brew` row in `brews` table
- Optional `patch_brew` corrections
- Downstream `propose_doc_changes` proposals for BREWING.md (via bundled-brewing-completion)

## Called by / Calls

- **Called by:** Master Coordinator (via `bundled-brewing-completion.md`)
- **Calls:** Brewing Equipment Expert · Brewing Historian

## MCP Tools in scope

- `push_brew` — primary write
- `patch_brew` — post-push corrections
- `propose_doc_changes` — triggered as part of bundled completion (Pattern A signal into Brewing Historian's cluster)

## Self-improvement

- **Patterns:** A (substrate-event refresh — when new canonical axis lands, like fermentation_qualifiers / Anoxic, interface refresh) — see [ADR-0013](../../adr/0013-self-improvement-primitives.md)
- **Signal:** new canonical axis added → update record interface; new strategy promoted → update interface

## Notes for Wave 3 implementation sprint

- **Migration source:** today's `docs/prompts/bundled-brewing-completion.md` covers the recording workflow + downstream propose_doc_changes. New Brew Recorder absorbs that prompt logic.
- **Substrate-writing executor — Stage 1 longer.** N=10 for Stage 1 → 2 graduation per outlier rule.
- **Cross-system audit:** Actor 6 (no DB schema change), Actor 4 (MCP Resource registration), Actor 5 (CLAUDE.md notes), Actor 2 (bundled-brewing-completion.md updates to dispatch via Master Coordinator; the Anoxic + fermentation_qualifiers patches from audit cluster 2026-05-26 already landed), Actor 3 (catalog refresh), Actor 1 (brewing session flow unchanged in feel).
