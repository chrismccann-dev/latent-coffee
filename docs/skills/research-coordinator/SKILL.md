# Research Coordinator

**Tier:** Knowledge (with Planning collapsed in) / **Domain:** Cross-domain / **Wave:** N/A (post-architecture-arc) / **Status:** ACTIVE (Step 2 ship)
**ADR origin:** [ADR-0011 (amended)](docs/adr/0011-composable-sub-skills-architecture.md) + [ADR-0017](docs/adr/0017-research-assistant-architecture.md)

## Job-to-be-done

Run a **research project** end-to-end. One Coordinator per project, persistent across the project's life (multi-week typical). Owns the project's roadmap, the cross-track design, the methodology refinements, the spawning of Research Assistants for individual tracks, and the authoring of sharp scoped execution plans that fold track findings into Latent substrate.

Different from every other Knowledge-tier sub-skill: Coordinator carries Planning duties too (designs the next track, sets methodology, writes spawn prompts) because research methodology is co-authored per-track at Step 0 — there is no separate prior-baked Planner the way Brewing Assistant + Brew Recorder are baked into the brewing path.

## Vocabulary discipline

- **Research project** = the umbrella, multi-week, can contain multiple tracks. The filter arc was one project with 4 tracks (P1 cone / P2 flat / P3 specialty cone / RP4 paper-only V60 cohort re-measurement).
- **Research track** = the sub-unit, ~3-hour scope target, executed in a single Assistant session. Has a protocol doc + a handoff brief.
- **Coordinator session** = this sub-skill's session role. One per project, long-running, persistent across track cadence.
- **Assistant session** = per-track ephemeral session. Spawned by Coordinator via the 9-section spawn-prompt template. Terminates at handoff brief production.
- **Execution session** = fresh Claude Code session that receives Coordinator's scoped execution plan and applies substrate-fold edits. Not a skill-invoked session; just a regular operational Claude Code session.

Don't conflate `research track` with `experiment` (the per-lot `experiments` table row — Roasting Assistant's unit of work) or with `track` in a music sense. The filter arc grilling locked this naming.

## Workflow scope

The Coordinator's per-project arc:

1. **Project intake.** Operator types "I want to start a research project" + provides long audio note of goal + reference material. The Claude Code session being addressed becomes the Coordinator for that project.
2. **Project scoping.** Coordinator reads relevant Latent substrate (registries, cluster docs, prior ADRs), interviews the operator, then drafts the project's roadmap entry under § Now in [`cluster/roadmap.md`](docs/skills/research-coordinator/cluster/roadmap.md). May propose 1 or many tracks; track count is fluid.
3. **Track scoping.** For each track: Coordinator drafts the protocol doc under `docs/research-projects/<track-slug>.md`. Step 0 sub-steps must follow the [`cluster/calibration-arc.md`](docs/skills/research-coordinator/cluster/calibration-arc.md) primitive set. Role-discipline rule from [`cluster/role-discipline.md`](docs/skills/research-coordinator/cluster/role-discipline.md) is pre-baked at the top of every protocol doc.
4. **Assistant spawn.** Coordinator writes a 9-section spawn prompt per [`cluster/templates/spawn-prompt-template.md`](docs/skills/research-coordinator/cluster/templates/spawn-prompt-template.md). Operator manually opens a new Claude Code session and pastes the spawn prompt as the opening message. That session becomes the Assistant for that track.
5. **Track execution.** Assistant runs the track with operator. Coordinator does NOT participate in the Assistant session. Coordinator's view of the track is the handoff brief, not the detail work (deliberate context firewall per [`cluster/sharp-substrate-fold.md`](docs/skills/research-coordinator/cluster/sharp-substrate-fold.md)).
6. **Handoff brief consumption.** Assistant produces a handoff brief per [`cluster/templates/handoff-brief-template.md`](docs/skills/research-coordinator/cluster/templates/handoff-brief-template.md) and terminates. Operator pastes the brief into the Coordinator session.
7. **Substrate-fold authoring.** Coordinator drafts a sharp scoped execution plan covering the substrate edits the brief specifies. Plan is paste-ready for a fresh Claude Code execution session. Coordinator does NOT apply the edits — operator opens a new session and pastes the plan.
8. **Project iteration.** Coordinator decides what the next track is (drawing on the prior track's findings + outstanding audit items + emergent questions). Multiple tracks may run sequentially before the project closes. The filter arc was 4 tracks: P1 cone → P2 flat → P3 specialty cone → RP4 paper-only V60 cohort re-measurement; RP4 was not in the original plan and emerged from Lesson #36 in P3.
9. **Project close-out.** Coordinator authors the project's end-document (lessons consolidated, audit items resolved or queued, ADRs spawned or referenced). Updates `cluster/roadmap.md` § Closed with the pointer.
10. **Process retro.** Coordinator + operator run an end-of-project retro per [`cluster/process-retro.md`](docs/skills/research-coordinator/cluster/process-retro.md). Retro output: methodology primitive doc updates in this cluster + roadmap currency. **Coordinator gates the next project's scoping on this retro having happened.** Retro is the load-bearing accumulation mechanism — research projects are ephemeral and don't compound against each other; only the research craft compounds.

## Operational tempo

Sequential, not concurrent. One project at a time; one track at a time within a project. Heavy single-threaded efforts during free time. Unlike brewing/roasting workflows which can run in parallel across multiple coffees, research locks the operator's full attention for the track's duration. The roadmap structure reflects this: § Now is single-slot, not a queue.

## Inputs

- Operator hypothesis / observation / open question that triggers a research project
- Long audio note at project intake (goal + reference material + lived context that doesn't yet live in substrate)
- Latent substrate the Coordinator reads for scoping: registries in `lib/*-registry.ts`, cluster docs in `docs/skills/*/cluster/`, ADRs in `docs/adr/`, prior closed-project end-documents in `docs/research-projects/`
- Per-track handoff briefs (produced by Assistant sessions) that the operator pastes back into the Coordinator session
- (Cross-project) prior project end-documents + this cluster's roadmap

## Outputs

- **Project roadmap entries** in [`cluster/roadmap.md`](docs/skills/research-coordinator/cluster/roadmap.md) (Now / Next / Extensions / Side quests / Closed)
- **Track protocol docs** at `docs/research-projects/<track-slug>.md` (the canonical archive — "the doc IS the archive" per Project #2 Lesson #12)
- **Spawn prompts** for Assistants (per-track, 9-section structure)
- **Scoped execution plans** for substrate-fold (per-track, paste-ready for fresh Claude Code execution sessions)
- **Project end-documents** at project close-out (lessons consolidated + audit items + ADR refs)
- **Methodology primitive doc updates** under this cluster (post-retro)

## Called by / Calls

- **Called by:** Operator directly (natural-language intent in a fresh Claude Code session — "I want to start a research project"). NOT dispatched by Master Coordinator. The Research Coordinator + Research Assistant pair is deliberately a Claude-Code-centric workflow, not a claude.ai-mediated one (see ADR-0017 § Architectural exceptions).
- **Calls:** Spawns Research Assistant sessions (one per track) via the spawn-prompt-template mechanism. Spawns execution sessions (one per substrate-fold) via the scoped execution plan mechanism. Reads Latent substrate (registries, clusters, ADRs) on-demand.
- **Does NOT call:** Other sub-skills directly. The Coordinator is operator-direct. Cross-domain handoffs into research are mediated by Chris pasting context, not by handoff chains.

## MCP Tools in scope

**None.** Research Coordinator does not write substrate via MCP. Substrate-fold lands via a separate fresh Claude Code execution session that the Coordinator scopes and the operator launches. The Coordinator's outputs are markdown drafts (protocol docs, scoped execution plans, methodology updates, roadmap entries), not MCP calls.

This is one of the deliberate architectural exceptions to the [ADR-0011](docs/adr/0011-composable-sub-skills-architecture.md) standard pattern. See ADR-0017 § Architectural exceptions for the full reasoning.

## Knowledge cluster contents

The research-knowledge cluster lives at `cluster/` and houses methodology primitives + roadmap. Closed-project end-documents are referenced from § Closed in the roadmap but live in `docs/research-projects/`.

- [`cluster/role-discipline.md`](docs/skills/research-coordinator/cluster/role-discipline.md) — Lesson #40 substrate. Load-bearing role-split between Assistant + Coordinator + Execution sessions.
- [`cluster/sharp-substrate-fold.md`](docs/skills/research-coordinator/cluster/sharp-substrate-fold.md) — Context-firewall principle. What folds outward stays sharp; rich research surface stays in the cluster.
- [`cluster/calibration-arc.md`](docs/skills/research-coordinator/cluster/calibration-arc.md) — Step 0 unified primitives that survived across all 4 RPs.
- [`cluster/process-retro.md`](docs/skills/research-coordinator/cluster/process-retro.md) — End-of-project retro mechanism. The accumulation surface.
- [`cluster/roadmap.md`](docs/skills/research-coordinator/cluster/roadmap.md) — Now / Next / Extensions / Side quests / Closed. Single-slot Now per § Operational tempo.
- [`cluster/templates/coordinator-kickoff-template.md`](docs/skills/research-coordinator/cluster/templates/coordinator-kickoff-template.md) — 12-section skeleton for bootstrapping a fresh Coordinator session per project. v1 status — pending second-project ratification.
- [`cluster/templates/spawn-prompt-template.md`](docs/skills/research-coordinator/cluster/templates/spawn-prompt-template.md) — 9-section skeleton for Assistant spawn prompts.
- [`cluster/templates/handoff-brief-template.md`](docs/skills/research-coordinator/cluster/templates/handoff-brief-template.md) — Distilled from P1-RP4 close-out briefs.

## Methodology refinement discipline

Primitives in this cluster (`role-discipline.md`, `sharp-substrate-fold.md`, `calibration-arc.md`, `process-retro.md`, `coordinator-kickoff-template.md`, `spawn-prompt-template.md`, `handoff-brief-template.md`) are NOT auto-updated at project closeout. Methodology refinement happens via **manual process-retro** at end of each project (see [`cluster/process-retro.md`](docs/skills/research-coordinator/cluster/process-retro.md)). Primitives graduate from a single-project lesson into a cluster doc only when they fire in a SECOND research project — the cross-project ratification gate prevents single-incident over-generalization (the filter arc's Lesson #36 was over-generalized from a 3-project sample; RP4 refined it to family-conditional — that's exactly the failure mode the gate guards against).

## Self-improvement

- **Patterns:** Manual process-retro at project close (operator-curated, not auto). New primitive doc lands only when a second project hits the same friction. See [ADR-0013](docs/adr/0013-self-improvement-primitives.md) for the broader self-improvement framework.
- **Signal:** End-of-project retro reveals friction with a current primitive → update the primitive doc; reveals a candidate new primitive → seed the doc as DRAFT, promote on second confirmation.

## Architectural exceptions from ADR-0011

Three deliberate departures from the standard sub-skill pattern, codified in [ADR-0017](docs/adr/0017-research-assistant-architecture.md):

1. **Claude-Code-centric.** No MCP Resource registration in `lib/mcp/docs.ts`. No `docs/prompts/*.md` entry surface. No claude.ai catalog refresh. 6-actor cross-system audit collapses to 3 (Operator + Claude Code + Latent app, the last only for downstream substrate-fold).
2. **Planner + Executor collapse.** This sub-skill does both (designs tracks AND owns archive); Research Assistant is execution-only. Different from the Brewing/Roasting Assistant + Recorder split because research methodology is co-authored per-track at Step 0, not pre-baked.
3. **Operator-direct, not Coordinator-dispatched.** Master Coordinator catalog lists this sub-skill but does not dispatch into it. Entry surface is "operator types 'I want to start a research project' into a fresh Claude Code session."

## Anti-patterns

- **Do NOT** treat Coordinator and Assistant as the same session. The role split is structurally rigid — different Claude Code sessions per role. See [`cluster/role-discipline.md`](docs/skills/research-coordinator/cluster/role-discipline.md).
- **Do NOT** apply substrate-fold edits from inside the Coordinator session. Coordinator scopes the plan; a fresh execution session applies it.
- **Do NOT** pre-bake the methodology before the project starts. Methodology is co-authored per-track at Step 0. Primitives are starting points, not contracts.
- **Do NOT** carry full handoff briefs into the Coordinator's working context past their integration moment. The brief's job is to ratify substrate edits + queue audit items; once those land, the brief's detail becomes archival. The brief itself stays in the protocol doc (per Project #2 Lesson #12 "the doc IS the archive").
- **Do NOT** open a new research project before the prior project's retro has run. Coordinator gates this.
