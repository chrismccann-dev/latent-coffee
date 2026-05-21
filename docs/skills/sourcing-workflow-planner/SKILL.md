# Sourcing Workflow Planner

**Tier:** Workflow / **Sub-tier:** Planning / **Domain:** Roasting / **Wave:** 3 / **Status:** ACTIVE (Wave 3 PR 2 shipped 2026-05-26)
**ADR origin:** [ADR-0011](../../adr/0011-composable-sub-skills-architecture.md) + [ADR-0012](../../adr/0012-master-coordinator-pattern.md) + [ADR-0013](../../adr/0013-self-improvement-primitives.md)

## Job-to-be-done

Evaluate a new lot opportunity against sourcing strategy + current portfolio. Recommend buy / hold / pass + lane-fit assessment ("fits Tier 2 / Lane B — Experimental Processing"). Sourcing decisions are physical-world events; no substrate write until the lot arrives and is added via `push_green_bean` (per `feedback_upload_on_resolution.md` — beans land in app only after lot is closed; sourcing eval is upstream of that).

## Workflow scope

- Read lot opportunity (importer offering / sample arrival / WBC year reference / sourcing channel signal)
- Pull sourcing strategy from WBC Roasting Archivist § sourcing/ (5-lane portfolio definitions + Tier 1/2/3 priority targets — currently merged per ADR-0011 tentative collapse; future Sourcing Knowledge sub-skill splits out when sourcing book lands)
- Pull current inventory state via direct `green_beans` table read (rows where lifecycle_state ∈ {in_inventory, waiting_for_next_roast, waiting_for_next_cupping})
- Pull lane-performance signals from closed lots via Roasting Historian (per-lot learnings + cross-cultivar / cross-process patterns)
- Construct: recommendation (buy / hold / pass) + lane-fit assessment + rationale prose

## Inputs

- Lot opportunity (operator-provided in claude.ai session: importer offering details, cupping notes, price, lot quantity, processing, producer, lane signal)
- [WBC Roasting Archivist](../wbc-roasting-archivist/) cluster § sourcing/strategy.md — 5-lane portfolio + Tier 1/2/3 priority targets + tested-cultivars canonical registry
- [Roasting Historian](../roasting-historian/) cluster — closed-lot lane-performance retros + per-cultivar + per-process patterns
- Direct `green_beans` table read — current inventory state for portfolio-fit assessment
- Optional: Learning Assistant track-aware context when the sourcing decision intersects an active research track

## Outputs

- Sourcing recommendation: **buy / hold / pass** with rationale
- Lane-fit assessment: which of the 5 lanes the lot fits (or "doesn't fit any lane — pass"); which Tier the lot would land in
- Rationale prose: what the WBC corpus says about this profile, what closed Latent lots say about similar cultivars/processes, where this lot would fill or duplicate in the current portfolio

## Called by / Calls

- **Called by:** Master Coordinator (via new-sourcing-opportunity intent — operator-initiated via natural-language message; no dedicated prompt today)
- **Calls:** WBC Roasting Archivist § sourcing/ · Roasting Historian
- **Hands off to:** Operator (buy decision is physical-world); when the lot arrives, the lot intake → `push_green_bean` flow runs through `start-lot.md` + Roasting Assistant

## MCP Tools in scope

None directly. Sourcing decisions are physical-world events; no substrate write until the lot is physically in the operator's possession and gets added via `push_green_bean` (which is Roast Recorder's domain via `start-lot.md`, not Sourcing Workflow Planner's).

## Self-improvement

- **Patterns:** E (workflow-execution refresh — recommendation quality measured against lot outcome after roasting + cupping) — see [ADR-0013](../../adr/0013-self-improvement-primitives.md)
- **Signal:** lane miss/hit rate drift from closed lots > threshold → re-validate sourcing strategy via `propose_doc_changes` targeting `skills/wbc-roasting-archivist/cluster/sourcing/strategy.md`; portfolio gaps surfaced repeatedly across multiple sourcing evals → flag for sourcing-strategy refresh

## Wave 3 PR 2 ship notes (2026-05-26)

- **No cluster authored.** Per scope decision 1, Workflow Planning sub-skills are reads-only composition. Recommendation logic lives in SKILL.md; per-lane evaluation templates accrue into a future `cluster/templates/` under Pattern F if templates emerge.
- **Prompts unchanged.** Per scope decision 2, no dedicated prompt added today. Sourcing-opportunity intent is operator-initiated via natural-language message in any claude.ai session — Master Coordinator dispatch routes to Sourcing Workflow Planner. A `docs/prompts/evaluate-sourcing.md` is forward investment for a future sprint when sourcing eval cadence justifies the prompt surface.
- **Both Knowledge tier dependencies ACTIVE:** WBC Roasting Archivist (Wave 2 PR 1 — holds Sourcing Knowledge cluster § sourcing/) + Roasting Historian (Wave 2 PR 3 — closed-lot lane retros + per-cultivar/process patterns).
- **No existing prompt absorbs into this sub-skill** — sourcing today is operator-decided ad-hoc with no formal workflow. This sub-skill is largely net-new framing; first operator-initiated dispatch establishes lived practice.
- **Sourcing Knowledge split trigger:** if Chris does dedicated sourcing research (the sourcing book on his TODO), Sourcing Knowledge splits out from WBC Roasting Archivist into its own cluster. This sub-skill's Inputs list updates accordingly. Today's tentative collapse is the right home per ADR-0011 + WBC Roasting Archivist Wave 2 PR 1 ship notes.
- **Cross-system audit:** Actor 6 (no DB schema change), Actor 4 (MCP Resource registration for this SKILL.md), Actor 5 (CLAUDE.md sub-skills section notes ACTIVE status), Actor 2 (no prompt updates per scope decision 2), Actor 3 (catalog refresh on next claude.ai session start), Actor 1 (operator gets structured sourcing-decision surface via Master Coordinator dispatch).
