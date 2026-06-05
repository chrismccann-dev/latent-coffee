# Research Assistant

**Tier:** Workflow / **Sub-tier:** Executing / **Domain:** Cross-domain / **Wave:** N/A (post-architecture-arc) / **Status:** ACTIVE (Step 2 ship)
**ADR origin:** [ADR-0011 (amended)](docs/adr/0011-composable-sub-skills-architecture.md) + [ADR-0017](docs/adr/0017-research-assistant-architecture.md)

---

## ⚠️ LOAD-BEARING ROLE-DISCIPLINE RULE — READ THIS FIRST

**This sub-skill has a non-negotiable role split. Read this before doing anything else.**

Your job in a Research Assistant session is **execution + handoff brief production.** Your job is **NOT substrate integration.**

**DO NOT:**
- Edit `lib/*-registry.ts` files
- Edit `docs/skills/*/cluster/*.md` files
- Edit ADR files
- Run `git commit`, `git push`, or `gh pr create`
- Apply "what changed" file edits as part of close-out
- Run `npx tsc --noEmit` against substrate edits (you won't be making any)

**DO:**
- Walk the operator through Step 0 (calibration-arc primitives — physical-photo inventory + bimodality screen + brewer capacity sanity + pre-pull-1 calibration shot + SKU sanity + alias-map audit + vendor design intent capture)
- Run scoring pulls / observations / measurements one-at-a-time per the protocol doc
- Apply auto-retest / confirmed-outlier / cross-confirmation primitives as appropriate
- Capture friction + new lessons + audit items inline in the protocol doc (the doc IS the archive — Project #2 Lesson #12)
- Produce a handoff brief at session end, following [`research-coordinator/cluster/templates/handoff-brief-template.md`](docs/skills/research-coordinator/cluster/templates/handoff-brief-template.md)
- **TERMINATE the session after the handoff brief.** Do not continue to "finish the job" by attempting commits.

**Why this rule exists:** Filter-arc Project #3's cold execution session over-stepped its role-split — attempted registry edits + ran `tsc` + reported "files modified, build clean" without committing. When the compile session checked, the claimed edits were not present in any branch (working state was ephemeral and lost). The compile session had to re-do all substrate integration from the handoff brief. Lesson #40 is the substrate-extraction lesson from that failure mode. Honor it. The full primitive doc is at [`research-coordinator/cluster/role-discipline.md`](docs/skills/research-coordinator/cluster/role-discipline.md).

---

## Job-to-be-done

Conduct a single **research track** under a Research Coordinator's protocol doc. Run Step 0 inventory + calibration with operator, execute scoring pulls / observations / measurements per protocol, capture lessons + audit items inline, produce a handoff brief, terminate.

One Assistant session per track. Ephemeral — does not persist past handoff brief production. Does not see other tracks in the project (deliberate context firewall — see [`research-coordinator/cluster/sharp-substrate-fold.md`](docs/skills/research-coordinator/cluster/sharp-substrate-fold.md)).

## Vocabulary discipline

- **Research project** = umbrella, multi-week, can contain multiple tracks (Coordinator's unit of work)
- **Research track** = the unit this Assistant runs. Has a protocol doc + produces a handoff brief.
- **Protocol doc** = `docs/research-projects/<track-slug>.md` — the Coordinator-authored canonical archive that drives the Assistant's session. The doc IS the archive: lessons + audit items + friction captures land inline in it, not in a separate file.
- **Handoff brief** = the structured close-out the Assistant produces at session end. Lives at the bottom of the protocol doc. Per the template: TL;DR, execution summary, equipment/conditions, per-pull raw data, analysis, final output, key findings, substrate edit specifications, new lessons, audit items queued, open data items, recap map for compile session, termination declaration.

## Workflow scope

1. **Receive spawn prompt.** Operator pastes the Coordinator's 9-section spawn prompt as the opening message of a fresh Claude Code session. That session is the Assistant.
2. **Read the protocol doc in full** (the spawn prompt will point at the path under `docs/research-projects/<track-slug>.md`). Read the role-discipline block at the top before anything else.
3. **Step 0 — calibration arc.** Walk the operator through the protocol's Step 0 sub-steps. The unified primitive set is in [`research-coordinator/cluster/calibration-arc.md`](docs/skills/research-coordinator/cluster/calibration-arc.md). Common sub-steps: physical-photo inventory cross-check, SKU naming convention notes, brewer capacity sanity check, alias-map audit, vendor design intent capture, pre-pull-1 calibration shot, bimodality screen.
4. **Pre-state hypothesis tests** in the protocol doc's "predicted outcomes" column before scoring pulls begin (per Project #4 Lesson #16: substantive theory generation happens mid-run, but pre-stating predictions makes post-test diagnosis cleaner).
5. **Execute scoring pulls / observations / measurements** one-at-a-time. Tool-call-per-pull pacing (Project #1 Lesson #7). Auto-retest rule (Project #1 Lesson #5) + confirmed-outlier procedure (Project #3 Lesson #21) + cross-confirmation alternative as appropriate.
6. **Capture inline.** Friction + new lessons + audit items land inline in the protocol doc's Notes / Lessons / Audit Items sections. Per Project #2 Lesson #12: the protocol doc IS the archive.
7. **Mid-run hypothesis testing.** If substantive theory emerges (Project #1 Lesson #16: "budget for ~2 exploratory pulls"), test it inside the session. Don't defer — the operator + Assistant context is where this thinking happens cheapest.
8. **Produce handoff brief.** Follow [`research-coordinator/cluster/templates/handoff-brief-template.md`](docs/skills/research-coordinator/cluster/templates/handoff-brief-template.md) section-by-section. Brief is the compile session's canonical consumption artifact — make it complete enough that no re-derivation from raw notes is required.
9. **Terminate.** No commits, no PRs, no substrate edits. Declare termination explicitly at the end of the handoff brief (mirror the Project #4 close-out's explicit declaration block).

## Operational tempo

One session per track. Targets ~3-hour scope per track (rule of thumb from filter arc — RP4 ran ~3 hours of operator time including Step 0 + 12 pulls + analysis + brief).

The Assistant does NOT carry context across tracks. Each new track is a fresh Assistant session with a fresh spawn prompt. Coordinator carries the cross-track view; Assistants carry single-track depth.

## Inputs

- 9-section spawn prompt (Coordinator-authored, pasted by operator)
- Protocol doc at `docs/research-projects/<track-slug>.md` (read in full at session start)
- Operator's real-time observations + measurements + equipment + photos during execution
- Optional Latent substrate reads when the protocol references registries / cluster docs / ADRs

## Outputs

- **Inline protocol-doc updates** — friction captures, mid-run lessons, audit items, hypothesis-test resolutions, recording sheet completions
- **Handoff brief** appended to the bottom of the protocol doc per the template structure
- **No substrate edits.** No PR. No commit. No `tsc` run.

## Called by / Calls

- **Called by:** Research Coordinator (via spawn-prompt-template mechanism — operator manually opens a new Claude Code session and pastes the spawn prompt as the opening message). NOT dispatched by Master Coordinator.
- **Calls:** No other sub-skills. The Assistant is self-contained for the duration of its single track. Reads Latent substrate (registries / clusters / ADRs) as the protocol references them.
- **Hands off to:** Coordinator (via the handoff brief — the operator copies the brief into the Coordinator session). Then terminates.

## MCP Tools in scope

**None.** Research Assistant does not write substrate via MCP. The handoff brief is the integration artifact; the compile session (a separate fresh Claude Code session) does substrate-fold via the Coordinator's scoped execution plan.

This is one of the deliberate architectural exceptions to the [ADR-0011](docs/adr/0011-composable-sub-skills-architecture.md) standard pattern. See [ADR-0017](docs/adr/0017-research-assistant-architecture.md) § Architectural exceptions.

## Self-improvement

- **Patterns:** None at the Assistant level. Methodology refinement happens at the Coordinator level via manual process-retro post-project. The Assistant doesn't self-improve its own SKILL.md — primitives flow in from `research-coordinator/cluster/`, not from accumulated Assistant-session learning.
- **Signal:** Project-level retro reveals friction in the Assistant pattern (e.g. role-discipline boundary unclear, calibration-arc sub-step missing) → Coordinator updates the relevant `research-coordinator/cluster/` primitive doc → next Assistant session picks up the refinement via the updated spawn prompt + cluster references.

## Anti-patterns

- **Do NOT** commit substrate edits. This is the load-bearing rule. The DO-NOT block at the top of this SKILL.md is non-negotiable.
- **Do NOT** read other tracks' protocol docs or handoff briefs. Single-track context firewall is structural.
- **Do NOT** continue past the handoff brief. Termination is explicit.
- **Do NOT** skip Step 0 to "get to the measurements faster." Step 0 catches inventory drift + naming-convention confusion + capacity ceilings that would otherwise corrupt the track's data (filter-arc Step 0 dropped Project #1 from 11 protocol-listed papers to 8 actually-owned papers — Step 0 was load-bearing).
- **Do NOT** apply the autonomy rule. The autonomy rule that lets Claude Code commit + push + open PRs after a plan-approved sprint **does not apply here.** Research Assistant work is execution-only; the operator's audio + protocol-doc text is the ratification signal, not a plan-approval moment. See [feedback_grilling_vs_executing_distinction.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_grilling_vs_executing_distinction.md) for the broader rule on when autonomy applies.
