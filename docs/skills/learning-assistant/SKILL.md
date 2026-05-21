# Learning Assistant

**Tier:** Workflow / **Sub-tier:** Planning / **Domain:** Cross-domain / **Wave:** 3 / **Status:** ACTIVE (Wave 3 PR 2 shipped 2026-05-26)
**ADR origin:** [ADR-0011](../../adr/0011-composable-sub-skills-architecture.md) + [ADR-0012](../../adr/0012-master-coordinator-pattern.md) + [ADR-0013](../../adr/0013-self-improvement-primitives.md)

## Job-to-be-done

Construct and run **research tracks** — long-running cross-lot / cross-coffee studies. Examples (Chris's Round 2 naming): "test water side across next 5 lots", "blending experiments with greens I have more of", "longitudinal resting-curve study across cultivars." Distinct from per-lot `experiments` table rows (which scope to a single lot's V-set iteration). **The only cross-domain planner** in the architecture — research tracks naturally span both brewing and roasting.

## Vocabulary discipline

- **Research track** = the cross-lot / cross-coffee study (Learning Assistant's unit of work)
- **Experiment** = a per-lot V-set row in the `experiments` table (Roasting Assistant's unit of work)

Don't conflate. The naming was locked in the Round 2 brainstorm AskUserQuestion to disambiguate against the existing schema.

## Workflow scope

- Read operator hypothesis / observation / open question
- Pull cross-lot patterns from Roasting Historian + Brewing Historian
- Pull open-question docs ([`brewing-historian/cluster/patterns/open-questions.md`](../brewing-historian/cluster/patterns/open-questions.md), [`roasting-historian/cluster/patterns/open-questions.md`](../roasting-historian/cluster/patterns/open-questions.md)) — research tracks often pick up where open-questions left off
- Pull cross-domain insights from CCIL (Wave 4 dependency; degrade gracefully until CCIL ships)
- Pull inventory from WBC Roasting Archivist § sourcing/ + direct `green_beans` table read (what greens are available for the track)
- Construct: research-track design (multi-step protocol across lots / brews / cuppings) + execution plan + outcome-capture template
- During execution: dispatch per-constituent-roast / per-constituent-brew with track-aware metadata for cross-linking
- On track completion: prepare end-document for future Learning Knowledge worker archival

## Inputs

- Operator hypothesis / observation / open question (no dedicated prompt today — see Wave 3 PR 2 ship notes)
- [Roasting Historian](../roasting-historian/) cluster — closed-lot patterns + open questions
- [Brewing Historian](../brewing-historian/) cluster — per-strategy + by-cultivar + cross-coffee-insights + open questions
- [Brewing Equipment Expert](../brewing-equipment-expert/) cluster — when research-track design has an equipment dimension (e.g. "compare flow rate across filters")
- [WBC Roasting Archivist](../wbc-roasting-archivist/) cluster § sourcing/ — inventory + sourcing strategy
- [CCIL](../ccil/) cluster — **Wave 4 dependency; not yet authored.** Learning Assistant ships in PR 2 with degraded cross-domain context until CCIL lands.
- Direct `green_beans` table read — inventory state for track design

## Outputs

- Research-track design doc (operator-readable; persisted in claude.ai thread today, future Learning Knowledge cluster when promoted)
- Execution plan (which lots / brews / cuppings happen when; what data captures at each step)
- Outcome capture during execution (track-aware metadata on constituent push_roast / push_brew rows)
- End-document handoff to Learning Knowledge (when promoted from deferred; today the end-document lives in claude.ai thread context)

## Called by / Calls

- **Called by:** Master Coordinator (via research-track-design intent — no dedicated prompt today; operator-initiated via natural-language intent in any claude.ai session)
- **Calls:** Roasting Historian · Brewing Historian · WBC Roasting Archivist § sourcing/ · CCIL (when Wave 4 ships) · downstream Roasting Assistant / Brewing Assistant per constituent roast / brew
- **Hands off to:** Roast Recorder / Brew Recorder for constituent substrate writes (via the planner sub-skills); Learning Knowledge for archival (when promoted from deferred)

## MCP Tools in scope

None directly. Constituent roast / brew pushes flow through Roast Recorder / Brew Recorder with track-aware metadata on the row.

## Self-improvement

- **Patterns:** E (workflow-execution refresh — track design quality measured against outcome utility) — see [ADR-0013](../../adr/0013-self-improvement-primitives.md)
- **Signal:** track-completion / question-resolution event → retro the track's design against outcome value; ≥2 completed research tracks → promotion trigger for Learning Knowledge per ADR-0011 (see [`learning-knowledge/SKILL.md`](../learning-knowledge/SKILL.md))

## Wave 3 PR 2 ship notes (2026-05-26)

- **No cluster authored.** Per scope decision 1, Workflow Planning sub-skills are reads-only composition. Track artifacts live in claude.ai thread context today; persistence migrates to `learning-knowledge/cluster/tracks/` when Learning Knowledge promotes per ADR-0011 trigger (≥2 completed tracks).
- **Prompts unchanged.** Per scope decision 2, no dedicated prompt added today. Research-track-design intent is operator-initiated via natural-language message in any claude.ai session — Master Coordinator dispatch routes to Learning Assistant. A `docs/prompts/research-track-design.md` is forward investment for a future sprint when track cadence justifies the prompt surface.
- **The only cross-domain planner.** Cross-domain workflows are constrained to this one sub-skill + CCIL (the only cross-domain knowledge sub-skill once it ships in Wave 4). Other planners (Roasting Assistant / Brewing Assistant / Sourcing Workflow Planner) are single-domain.
- **No substrate writes by this sub-skill directly.** Track-aware metadata lands on constituent roasts / brews via Roast Recorder / Brew Recorder, NOT as separate `research_tracks` table rows. Deferring substrate-table addition until enough tracks land to validate the schema shape (Pattern A signal threshold for Learning Knowledge promotion).
- **CCIL gap.** Wave 3 ships Learning Assistant before CCIL (Wave 4). Cross-domain context degrades gracefully — Learning Assistant pulls from both Historians' clusters directly until CCIL adds the cross-domain synthesis layer.
- **Learning Knowledge stays deferred.** Promotion trigger per ADR-0011 is "Learning Assistant has run ≥2 research tracks." Today: zero tracks. Confirmed at PR 2 session start via prior-lock recommendation per [feedback_recommend_prior_lock_as_default.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_recommend_prior_lock_as_default.md).
- **Cross-system audit:** Actor 6 (no DB schema change Wave 3; revisit when Learning Knowledge ships and `research_tracks` table is scoped), Actor 4 (MCP Resource registration for this SKILL.md), Actor 5 (CLAUDE.md sub-skills section notes ACTIVE status), Actor 2 (no prompt updates per scope decision 2), Actor 3 (catalog refresh on next claude.ai session start), Actor 1 (operator gets first-class research-track surface via Master Coordinator dispatch).
