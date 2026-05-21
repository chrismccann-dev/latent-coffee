# Brewing Assistant

**Tier:** Workflow / **Sub-tier:** Planning / **Domain:** Brewing / **Wave:** 3 / **Status:** PLACEHOLDER
**ADR origin:** [ADR-0011](../../adr/0011-composable-sub-skills-architecture.md) + [ADR-0012](../../adr/0012-master-coordinator-pattern.md) + [ADR-0013](../../adr/0013-self-improvement-primitives.md)

## Job-to-be-done

Construct a starting brew recipe AND handle in-thread iteration on tasting notes. **Absorbs the Palate Evaluator role** per ADR-0011 § iteration depth asymmetry — brewing iterates IN-THREAD ONLY (only the final optimized brew lands in Latent); the iteration-helper sub-prompt lives inside Brewing Assistant rather than as a separate executor sub-skill.

## Workflow scope

**Phase 1 — Initial recipe construction:**
- Read brew session intent (coffee + location + dose)
- Pull cross-strategy + cross-coffee patterns from Brewing Historian
- Pull WBC-tested strategies from WBC Brewing Archivist
- Pull equipment-aware constraints from Brewing Equipment Expert (heavily — equipment selection is half of recipe construction)
- Construct: extraction strategy + modifiers + dose + water + grinder + grind setting + temp + pour structure

**Phase 2 — In-thread iteration (the iteration-helper sub-prompt):**
- Read operator's audio tasting notes
- Refine recipe for next iteration based on what was tasted
- Maintain context: "what arc of changes have we been working through this session?"
- Repeat until operator declares the optimized brew

**Phase 3 — Handoff to Brew Recorder:**
- Final optimized recipe passes to Brew Recorder for `push_brew`

## Inputs

- Brew session intent (`start-brew.md` prompt)
- Brewing Historian's cluster (per-strategy + per-cultivar patterns)
- WBC Brewing Archivist's cluster (WBC strategies + 102-recipe corpus)
- Brewing Equipment Expert's cluster (equipment registries + constraint envelope)
- Tasting notes (per-iteration audio transcripts)

## Outputs

- Brew recipe proposal (Phase 1)
- Refined recipe proposals (Phase 2, in-thread iteration)
- Final optimized recipe handed to Brew Recorder (Phase 3)

## Called by / Calls

- **Called by:** Master Coordinator (via `start-brew.md`), Cupping Specialist Path A (cross-domain handoff Chain 1 — optimized brew dial-in on reference roast)
- **Calls:** Brewing Historian · WBC Brewing Archivist · Brewing Equipment Expert

## MCP Tools in scope

None directly. Brew Recorder handles `push_brew`.

## Self-improvement

- **Patterns:** E (workflow-execution refresh — recipe proposals observed against operator's tasting outcomes) — see [ADR-0013](../../adr/0013-self-improvement-primitives.md)
- **Signal:** new strategy promoted (e.g. promotion of "consciously not pursuing" to active) → re-validate recipe library; equipment registry expansion → re-validate equipment recommendations

## Notes for Wave 3 implementation sprint

- **Migration source:** today's `docs/prompts/start-brew.md` STEPS 1-3 cover recipe construction; `docs/prompts/bundled-brewing-completion.md` covers Phase 3 handoff. The iteration-helper sub-prompt (Phase 2) is new substrate per Chris's Round 2 compromise (Option 3).
- **Iteration-helper sub-prompt scope (Phase 2):** small structured prompt the operator can pull in during a brew session to refine recipe based on tasting notes. NOT a separate sub-skill — lives inside Brewing Assistant's SKILL.md as a sub-section.
- **Dependency on Wave 1 + Wave 2 ships:** Brewing Equipment Expert (Wave 1) + Brewing Historian + WBC Brewing Archivist (Wave 2) must ship before Brewing Assistant has clusters to read.
- **Cross-system audit:** Actor 6 (no DB schema change), Actor 4 (MCP Resource registration), Actor 5 (CLAUDE.md notes the sub-skill), Actor 2 (start-brew.md + bundled-brewing-completion.md update to dispatch via Master Coordinator), Actor 3 (catalog refresh), Actor 1 (brew sessions get richer cross-coffee + equipment context).
