# 0017 — Research Coordinator + Research Assistant architecture

## Context

The filter arc (4 closed research projects, 2026-05-21 → 2026-05-26) generated the substrate that finally unblocked Research Assistant SKILL.md scaffolding. The Step 1 grilling (2026-05-26) that closed the substrate-input loop locked the architecture before the Step 2 scaffolding sprint executed.

Three properties of research work emerged from the filter arc that the standard [ADR-0011](docs/adr/0011-composable-sub-skills-architecture.md) sub-skill pattern doesn't accommodate cleanly:

1. **Methodology is co-authored per-track at Step 0, not pre-baked.** Brewing-side and roasting-side workflows have stable methodology (Brewing Assistant proposes a recipe from a fixed framework; Brew Recorder writes it via fixed Tools). Research projects iterate on the methodology *as part of the project itself* — every track refines the Step 0 sub-steps, the bimodality screen criteria, the hypothesis-test framing.

2. **Substrate fold must be sharp.** A research project generates 5-20 KB of lessons + audit items + friction captures per track. If all of it flowed outward into operational substrate (claude.ai-loaded clusters, registries, ADRs), the operational layer would collapse in 5-10 projects. The filter arc deliberately kept ~49 lessons + ~23 audit items in the research-archive layer and only folded ~6 substrate edits + 2 ADRs outward.

3. **Role discipline failure mode is specifically substrate-write-creep.** Filter-arc Project #3's Lesson #40 captured a structural failure: the cold execution session attempted substrate edits + ran `tsc` + reported "files modified, build clean" without committing. Working state was ephemeral, lost on session end. Compile session had to re-do all integration from the handoff brief.

The standard ADR-0011 sub-skill pattern (knowledge tier writes via `propose_doc_changes`; workflow executing tier writes via `push_*` MCP Tools) doesn't address any of these three. Research work needs a different shape.

## Decision

**Ship Research Coordinator + Research Assistant as a two-sub-skill pair with three deliberate architectural exceptions from ADR-0011.** Deprecate Learning Assistant (Workflow Planning, never lived through a track) + Learning Knowledge (Knowledge tier, never activated past placeholder) as superseded.

### The architecture

| Sub-skill | Tier | Domain | Session pattern | Role |
|---|---|---|---|---|
| **Research Coordinator** | Knowledge (with Planning collapsed in) | Cross-domain | One per project, persistent | Roadmap, track design, methodology refinement, spawn-prompt authoring, scoped execution plan authoring |
| **Research Assistant** | Workflow / Executing | Cross-domain | Per-track ephemeral | Step 0 calibration, scoring pulls/observations/measurements, inline protocol-doc updates, handoff brief production |

A third session role — the **Execution session** — runs the substrate-fold edits. It is NOT a sub-skill. It is a regular Claude Code session that receives the Coordinator's scoped execution plan as its opening message and applies the edits per the plan. No skill invocation, no MCP registration, no catalog entry. Just normal operational Claude Code work scoped by a Coordinator-authored plan.

### The role-discipline rule

Three sessions, three roles, no overlap:

| Session role | Owns | Does NOT do |
|---|---|---|
| Coordinator | Project roadmap, track design, methodology refinement, spawn prompts, scoped execution plans | Run scoring pulls; commit substrate; participate in Assistant or Execution sessions |
| Assistant | Step 0 calibration, scoring pulls, inline protocol-doc updates, handoff brief production | Apply substrate edits; commit / push / open PRs; run typecheck against substrate edits; continue past handoff brief |
| Execution | Apply scoped execution plan's substrate edits, run typecheck, commit, push, open PR | Re-interpret the plan; design follow-up tracks; participate in Coordinator's planning |

The rule is pre-baked at three locations to make the boundary impossible to miss:
1. Top of [Research Assistant SKILL.md](docs/skills/research-assistant/SKILL.md) (caps block)
2. Top of every spawn prompt (caps block — see [`templates/spawn-prompt-template.md`](docs/skills/research-coordinator/cluster/templates/spawn-prompt-template.md))
3. Top of every protocol doc Coordinator authors at `docs/research-projects/<track-slug>.md`

Full primitive doc: [`docs/skills/research-coordinator/cluster/role-discipline.md`](docs/skills/research-coordinator/cluster/role-discipline.md).

### Sharp substrate-fold discipline

The Coordinator acts as a context firewall between research-archive surface (rich, narrative, multi-paragraph) and operational substrate (sharp, pointed, data-backed). What folds outward:

- Schema changes to registries (e.g. `FilterEntry.flowRateContexts` field)
- Cluster-doc additions (e.g. measured-drawdown reference sections in `brewing-equipment-expert/cluster/filters.md`)
- ADRs (architectural decisions worth documenting independently)

What stays inward:

- Per-track lesson catalogs (49 lessons in the filter arc; only 2-3 graduate per project to cluster primitives)
- Audit items (project-internal until resolved or escalated to ADR)
- Mid-run hypothesis-test transcripts
- Friction captures

The fold gate has structural protection via a cross-project ratification rule: a single-project finding does NOT graduate into a cluster primitive. Only when a SECOND project independently confirms the finding does the primitive update. This is the same gate that protects schema-level over-generalization (filter-arc Lesson #36 would have been mis-graduated at Project #3 close without this gate; RP4 partially contradicted it).

Full primitive doc: [`docs/skills/research-coordinator/cluster/sharp-substrate-fold.md`](docs/skills/research-coordinator/cluster/sharp-substrate-fold.md).

### Process retro as accumulation mechanism

Research projects are ephemeral — each project's findings don't compound against the next project's findings. What DOES compound is the **research craft**: how Step 0 should be structured, how spawn prompts should be shaped, how handoff briefs should look, what role discipline should require. The process retro is the cross-project mechanism that lets the craft compound.

Retro fires at end of every project (not every track). Coordinator + operator participate (no Assistant — Assistants are ephemeral). Output: methodology primitive doc updates in the research-coordinator cluster + roadmap update. **Coordinator gates next project's scoping on the retro having happened** — without the retro, the next project starts from drift-laden primitives that look unchanged but have shifted in the operator's head.

Full primitive doc: [`docs/skills/research-coordinator/cluster/process-retro.md`](docs/skills/research-coordinator/cluster/process-retro.md).

### Architectural exceptions (from ADR-0011)

Three deliberate departures from the standard sub-skill pattern, documented here for future audit:

#### Exception 1 — Claude-Code-centric, not claude.ai-mediated

The Research Coordinator + Research Assistant pair runs entirely in Claude Code sessions. No MCP Resource registration in `lib/mcp/docs.ts`. No `docs/prompts/*.md` entry surface. No claude.ai catalog refresh required.

**Why:** Research work is operator-direct + heavily session-scoped. The operator types "I want to start a research project" into a fresh Claude Code session, and that session becomes the Coordinator. Spawn prompts and execution plans pass between sessions via manual paste, not via MCP. The 6-actor cross-system audit collapses to 3 (Operator + Claude Code + Latent app, the last only for downstream substrate-fold).

**Consequence for ADR-0011 enumeration:** the 6-actor cross-system audit gate in CLAUDE.md § Sprint cadence still applies to substrate-fold sprints; but the Research Coordinator + Assistant sub-skills themselves are exempt from MCP Resource registration + claude.ai catalog refresh.

#### Exception 2 — Planner + Executor collapse

ADR-0011's standard pattern splits brewing-side and roasting-side workflows into Planner sub-skills (Brewing Assistant, Roasting Assistant — propose, no write) + Recorder sub-skills (Brew Recorder, Roast Recorder — write via MCP Tools). The Research pair does NOT split this way:

- **Research Coordinator** = Planner-like (designs tracks, methodology, execution plans) + Knowledge-like (owns the research-knowledge cluster + roadmap)
- **Research Assistant** = Executor-like (runs tracks, captures data, produces handoff brief) — but does NOT write substrate

**Why:** Research methodology is co-authored per-track at Step 0. There's no fixed methodology to pre-bake into a separate Planner sub-skill the way Brewing Assistant pre-bakes the 6-strategy + 4-modifier framework. The Coordinator's planning work is project-specific + emerges from prior-track findings. Collapsing planning into the Knowledge-tier Coordinator captures this naturally.

**Consequence for ADR-0011 enumeration:** the Workflow tier's planner-vs-executor split is a brewing/roasting-domain pattern, not a universal pattern. Cross-domain workflows (research, future others) may collapse the split when methodology is inherently project-specific.

#### Exception 3 — Learning Assistant + Learning Knowledge deprecated

ADR-0011 (original) enumerated Learning Assistant (Workflow Planning, ACTIVE Wave 3 PR 2) + Learning Knowledge (Knowledge tier, DEFERRED). Both are deprecated by this ADR.

**Why:** Research Coordinator + Research Assistant subsume both roles cleanly. Learning Assistant's "research-track design + execution plan" output is Coordinator territory. Learning Knowledge's "research-track docs + cross-track meta-synthesis" is Coordinator-cluster territory. Maintaining both pairs of sub-skills would split the same problem across 4 active sub-skill specs instead of 2 — directly against the anti-bloat principle.

Hard-removed in the Step 2 scaffolding ship: `docs/skills/learning-assistant/` + `docs/skills/learning-knowledge/` directories deleted; catalog + dispatch-rules + handoff-rules + sub-skills-status + 4 SKILL.md cross-references updated.

**Consequence for ADR-0011 enumeration:** the "18 active + 1 deferred" enumeration becomes "17 active + 0 deferred" (16 prior active that survive + 1 new Research Coordinator + 1 new Research Assistant − 2 removed learning-* = 17). The 17 is the post-Step-2 count.

## Substrate locations

| Artifact | Location |
|---|---|
| Research Coordinator SKILL.md | [docs/skills/research-coordinator/SKILL.md](docs/skills/research-coordinator/SKILL.md) |
| Research Coordinator cluster | [docs/skills/research-coordinator/cluster/](docs/skills/research-coordinator/cluster/) |
| Research Assistant SKILL.md | [docs/skills/research-assistant/SKILL.md](docs/skills/research-assistant/SKILL.md) |
| Per-project protocol docs (canonical archive) | `docs/research-projects/<track-slug>.md` (per-track, Coordinator-authored) |
| Roadmap | [docs/skills/research-coordinator/cluster/roadmap.md](docs/skills/research-coordinator/cluster/roadmap.md) |

## Sources

- Filter-arc Projects #1-RP4 close-outs (2026-05-21 → 2026-05-26) — operational substrate for the architecture
- Filter-arc Project #3 Lesson #40 + Project #4 LOAD-BEARING ROLE-DISCIPLINE block — origin of the three-role split
- Step 1 grilling session (2026-05-26) — locked all 13 scope questions before Step 2 execution
- Chris-locked at Step 1 close-out: three architectural exceptions are deliberate, not drift
- Pattern reference: ADR-0011 (the architecture this ADR amends), ADR-0013 (self-improvement primitives the methodology refinement layer extends), ADR-0014 (Pattern F threshold tiers — analogous cross-project ratification gate)

## Implementation trigger

**Already implemented.** Step 2 scaffolding ship 2026-05-27 lands this ADR + Research Coordinator SKILL.md + 6 cluster docs + Research Assistant SKILL.md + ADR-0011 amendment + Learning Assistant/Knowledge removal + cross-system orphan sweep in a single PR.

## Notes for future audit

- The 17-sub-skill enumeration should be re-verified at every sub-skill ship going forward. The bookkeeping has drifted before (Wave 4 PR 4a's CCIL count). [sub-skills-status.md](docs/architecture/sub-skills-status.md) is the operational ground truth.
- If a future research workflow needs MCP Tool surface (e.g. a hypothetical `push_research_track` Tool), this ADR should be re-opened. Today's substrate-via-execution-session mechanism deliberately avoids the MCP layer; if that constraint ever bends, the exception 1 framing here needs to be amended.
- If a future cross-domain workflow needs the Planner + Executor split that Research collapses (e.g. a longitudinal-study workflow with stable methodology), the exception 2 framing here needs to be amended.
