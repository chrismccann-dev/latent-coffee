# Brewing Assistant

**Tier:** Workflow / **Sub-tier:** Planning / **Domain:** Brewing / **Wave:** 3 / **Status:** ACTIVE (Wave 3 PR 2 shipped 2026-05-26)
**ADR origin:** [ADR-0011](docs/adr/0011-composable-sub-skills-architecture.md) + [ADR-0012](docs/adr/0012-master-coordinator-pattern.md) + [ADR-0013](docs/adr/0013-self-improvement-primitives.md)

## Job-to-be-done

Construct a starting brew recipe AND handle in-thread iteration on tasting notes. **Absorbs the Palate Evaluator role** per ADR-0011 § iteration depth asymmetry — brewing iterates IN-THREAD ONLY (only the final optimized brew lands in Latent; intermediate iterations stay in claude.ai thread context). The iteration-helper sub-prompt lives inside Brewing Assistant rather than as a separate executor sub-skill.

## Workflow scope

**Phase 1 — Initial recipe construction:**

- Read brew session intent (coffee + location + dose / brewer-filter pairing / extraction goal)
- Pull cross-strategy + cross-coffee patterns from Brewing Historian (per-strategy + by-cultivar + by-coffee-family + cross-coffee-insights)
- Pull WBC-tested strategies from WBC Brewing Archivist (5-axis foundational map + 102-recipe corpus + per-strategy)
- Pull equipment-aware constraints from Brewing Equipment Expert (heavily — equipment selection is half of recipe construction; brewers + filters + grinder-eg1 + sworks clusters)
- Construct: extraction strategy + modifiers + dose + water + grinder + grind setting + temp + pour structure

**Phase 2 — In-thread iteration (the iteration-helper sub-prompt):**

- Read operator's audio tasting notes (per `feedback_audio_dictation.md` — long multi-fact turns, extract every implicit term)
- Refine recipe for next iteration based on what was tasted
- Maintain context: "what arc of changes have we been working through this session?"
- Repeat until operator declares the optimized brew

**Phase 3 — Handoff to Brew Recorder:**

- Final optimized recipe + tasting outcome passes to Brew Recorder for `push_brew` (the per-coffee terminal write — intermediate iterations are not persisted)

## Inputs

- Brew session intent (`start-brew.md` prompt; Phase 2 iteration continues in-thread inside the same session — `log-brew.md` deprecated to a redirect stub in Writing-path Sub-sprint 3 / 2026-05-26)
- [Brewing Historian](docs/skills/brewing-historian/) cluster — per-strategy + by-cultivar + by-coffee-family + cross-coffee-insights + open questions
- [WBC Brewing Archivist](docs/skills/wbc-brewing-archivist/) cluster — 5-axis foundational map + 8 strategy families + 102-recipe corpus + per-strategy + canonical/wbc-tested-recipes
- [Brewing Equipment Expert](docs/skills/brewing-equipment-expert/) cluster — brewers / filters / grinder-eg1 / sworks registries + observed quirks
- Tasting notes (per-iteration audio transcripts; Phase 2 only)
- (Pre-2026-05-27 the Inputs list included "Learning Assistant track-aware metadata when the brew is part of a research track." That dependency is removed — Research Coordinator + Research Assistant per [ADR-0017](docs/adr/0017-research-assistant-architecture.md) do NOT write track-aware metadata onto constituent brews. If a brew is part of a research track, the cross-link is logged in the project protocol doc + handoff brief, not on the `brews` row.)

## Outputs

- Brew recipe proposal (Phase 1)
- Refined recipe proposals (Phase 2, in-thread iteration; not persisted)
- Final optimized recipe handed to Brew Recorder (Phase 3) — typed shape matching `brews` schema (extraction_strategy / modifiers jsonb / brewer / filter / dose_g / water_g / grinder / grind_setting / temp_c / pour_structure / etc.)

## Called by / Calls

- **Called by:** Master Coordinator (via `start-brew.md` brew-session intent), Cupping Specialist Path A (cross-domain handoff Chain 1 — optimized brew dial-in on the reference roast at lot resolution)
- **Calls:** Brewing Historian · WBC Brewing Archivist · Brewing Equipment Expert
- **Hands off to:** Brew Recorder (Phase 3 final optimized recipe → `push_brew`)

## MCP Tools in scope

None directly. Brew Recorder handles `push_brew` / `patch_brew`.

## Self-improvement

- **Patterns:** E (workflow-execution refresh — recipe proposals observed against operator's tasting outcomes in Phase 2) — see [ADR-0013](docs/adr/0013-self-improvement-primitives.md)
- **Signal:** new strategy promoted (e.g. promotion of "consciously not pursuing" to active) → re-validate recipe library; equipment registry expansion (Brewing Equipment Expert Pattern C event) → re-validate equipment recommendations; Phase 2 iteration count consistently > N across N brews → flag Phase 1 starting-recipe quality

## Wave 3 PR 2 ship notes (2026-05-26)

- **No cluster authored.** Per scope decision 1, Workflow Planning sub-skills are reads-only composition over Wave 1+2 Knowledge clusters. The Phase 1 / Phase 2 / Phase 3 framing lives in SKILL.md; per-strategy or per-coffee-family templates accrue into a future `cluster/templates/` under Pattern F if templates emerge after lived use.
- **Iteration-helper sub-prompt (Phase 2) lives inside this SKILL.md** as a sub-section under Workflow scope — NOT a separate sub-skill, per ADR-0011 § iteration-depth asymmetry. Brewing iterates in-thread; only the optimized brew persists.
- **Prompts unchanged at PR 2 ship.** Per scope decision 2, `start-brew.md` / `bundled-brewing-completion.md` continue as the claude.ai entry surface. Brewing Assistant becomes the canonical fetch target the prompts compose over. (`log-brew.md` deprecated to a redirect stub in Writing-path Sub-sprint 3 / 2026-05-26 — Phase 2 iteration happens in-thread inside the active brew session per ADR-0011 § iteration-depth asymmetry, with no per-iteration prompt.)
- **All 3 Knowledge tier dependencies ACTIVE:** Brewing Historian (Wave 2 PR 2) + WBC Brewing Archivist (Wave 2 PR 1) + Brewing Equipment Expert (Wave 1). First Workflow Planning sub-skill on the brewing side with all its inputs in place.
- **Chain 1 readiness:** Cupping Specialist Path A → Brewing Assistant → Close-Lot Specialist chain ([`coordinator/handoff-rules.md`](docs/skills/coordinator/handoff-rules.md) Chain 1) becomes substantive at PR 3 when Cupping Specialist + Close-Lot Specialist flip ACTIVE. Brewing Assistant is the middle hop and ships ready in PR 2.
- **Migration source:** today's `docs/prompts/start-brew.md` STEPS 1-3 cover Phase 1 (recipe construction); Phase 2 (in-thread iteration) happens inside the active brew session with no per-iteration prompt (Phase 2 ran through `log-brew.md` until Writing-path Sub-sprint 3 / 2026-05-26 retired it to a redirect stub); `docs/prompts/bundled-brewing-completion.md` covers Phase 3 handoff. Prompts continue to drive the operator surface; Brewing Assistant elevates the logic to a sub-skill spec.
- **Cross-system audit:** Actor 6 (no DB schema change), Actor 4 (MCP Resource registration for this SKILL.md), Actor 5 (CLAUDE.md sub-skills section notes ACTIVE status), Actor 2 (prompts unchanged per scope decision 2), Actor 3 (next claude.ai session-start catalog refresh picks up ACTIVE status), Actor 1 (brew sessions get richer cross-coffee + equipment context via Master Coordinator dispatch).
