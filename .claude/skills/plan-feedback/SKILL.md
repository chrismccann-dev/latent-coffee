---
name: plan-feedback
description: >-
  Reviews the accumulated workflow-feedback backlog, clusters related items, prioritizes by
  recurrence + criticality, and produces a buildable sprint kickoff brief — then hands off to
  an implementer sub-agent. Use this whenever Chris says "review the feedback backlog", "plan
  the feedback backlog", "plan the rest of the feedback", "what should we build from the
  feedback", "drain the feedback queue", or asks what the most common / most recurring
  workflow friction is and what to do about it. This is the planning half of the feedback
  pipeline; the intake/routing half is the route-feedback skill.
---

# Plan Feedback

The `route-feedback` skill files actionable workflow feedback into
[`docs/product/feedback-backlog.md`](../../../docs/product/feedback-backlog.md), shape-tagged
and recurrence-counted. Items accumulate there across many sessions. This skill is the moment
that turns that pile into a decision: **what do we actually build next, and what's the brief?**

The organizing principle is Chris's: **prioritize by what keeps coming up again and again.**
A friction that recurred across five sessions is a stronger build signal than a sharp one-off,
because recurrence means it's structural, not incidental — it will keep costing time every
workflow run until it's fixed. The backlog's `Recurrence` counts exist precisely so this skill
can rank by frequency, not just by whoever flagged something most vividly.

This is operator-initiated (per the design lock) — you run it when Chris asks, not on a timer.
It produces a plan and hands off; it does not silently start building.

## Procedure

### 1. Read the whole backlog (and sweep the master log for stragglers)

Read [`docs/product/feedback-backlog.md`](../../../docs/product/feedback-backlog.md) fully.
Then sweep the master log
(`~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_mcp_continuous_log.md`)
`## Outstanding follow-ups` + latest status section for any open actionable item that never
got migrated into the backlog — if you find one, that's a route-feedback miss; migrate it in
(shape tag + recurrence) before planning, so the plan covers the real open set, not a stale
snapshot. **Verify status before trusting it:** items flagged `open` may have shipped since
(check `docs/sprints/shipped.md` + recent commits) — a stale `open` would otherwise waste a
sprint re-doing finished work.

### 2. Cluster related items

Group items by shared root cause / theme, not by shape tag alone. A cluster is a set of items
one coherent sprint could close together. Watch for cross-item reinforcement: two items with
different titles that share a root (e.g. an SPG lifecycle-state schema item + a one-shot
defer-verdict prompt item are both "the lifecycle gate isn't modeled") form one high-value
cluster, and the reinforcement raises the cluster's effective recurrence.

### 3. Score each cluster

Rank clusters by a blend of:
- **Recurrence** — sum / max of the member items' recurrence counts. This is the dominant
  signal. Cross-session, cross-lot recurrence ranks highest.
- **Criticality** — does it block or degrade the workflow, or is it a nicety?
- **Buildability** — is it Latent substrate we can actually change? A high-recurrence item
  that's a claude.ai-client issue (Bucket C) is an *escalation*, not a sprint — rank it out of
  the build plan and route it to "surface to Anthropic" instead. Triggered items (waiting on a
  condition like "5+ values across 3+ beans") are not buildable yet — list them, don't plan
  them.
- **Coupling to in-flight work** — if a cluster is already tagged for a known upcoming sprint
  (check `docs/product/roadmap.md` + `issues.md`), say so; the right move may be to fold it
  into that sprint rather than spin a standalone one.

### 4. Present the ranked clusters to Chris

Show the ranked list with, per cluster: the member items, the recurrence/criticality rationale,
whether it's buildable-now vs escalation vs triggered-later, and any coupling to roadmap work.
Recommend the top buildable cluster but let Chris choose — prioritization across a real backlog
is interpretive, and Chris's read of which friction hurts most is the load-bearing signal.

### 5. Emit a kickoff brief for the chosen cluster(s)

Write a paste-ready kickoff brief in the project's standard sprint-cadence shape (see
[CLAUDE.md § Sprint cadence](../../../CLAUDE.md) item 7):
- **Goal** (1-2 sentences)
- **Scope** (in / out)
- **Files likely to touch**
- **Verification plan** (incl. the six-actor cross-system audit if it's a substrate change)
- **Open questions**

Honor the grilling-vs-executing distinction: if the cluster is interpretive (schema/lifecycle
design, new vocabulary), the brief is a **grilling** brief — header it "THIS IS A GRILLING
SESSION. DO NOT EXECUTE." and do NOT invoke the autonomy rule. If it's concrete mechanical
work (a known prompt fix, a clear validation guard), it's an execution brief. Most
high-recurrence architectural clusters are grilling work — don't pre-pick the implementation.

**Always end the brief with a "Completion handoff" section** — this is what closes the
pipeline loop. Instruct the implementer session that when the work is done and merged, it must
write a completion report to `docs/sprints/<cluster-slug>-completion.md` that (1) restates the
plan so the report stands alone, (2) recaps what shipped per item incl. divergences + why,
(3) gives the PR URL + merge SHA, (4) reports actual verification results (what was run/seen,
not "should work"), and (5) flags anything deferred, surprising, or newly surfaced. Then it
tells Chris the report is ready to bring back here. Chris pastes it into a Claude Code session
to close out: flip the cluster's backlog items `open → shipped`, confirm the `shipped.md` row,
and `route-feedback` any new friction the build surfaced. Without this section the loop dangles
— a build ships but the backlog never learns it shipped, and friction the build exposed is
lost. See [the first such brief](../../../docs/sprints/cupping-schema-guardrails-kickoff.md)
for the shape.

### 6. Mark planned items + hand off

Flip the chosen items' `Status: open → planned` in the backlog (so the next route-feedback /
plan-feedback run doesn't re-surface them). Then hand the brief to the implementer:
- For an **execution** brief, spawn an implementer sub-agent (Agent tool — `general-purpose`
  or `claude`) with the brief + the relevant CLAUDE.md rules, or proceed inline per the
  autonomy rule if Chris green-lights.
- For a **grilling** brief, hand it back to Chris to start as a fresh grilling session — do not
  auto-spawn an executor on interpretive work.

Building a dedicated implementer *skill* is deferred (per ADR-0020) until this handoff shows
friction; the spawned sub-agent is the implementer for now.

### 7. Currency

When a planned cluster eventually ships, that's a separate session's job — but the brief should
remind it to: move the items to `docs/sprints/shipped.md`, flip backlog `Status` to `shipped`
(then drop the line), and clear any roadmap entry. Keep the backlog honest: `planned` items
that never shipped should drop back to `open` if the sprint was abandoned.

## What this skill does NOT do

- It does not route raw feedback — that's `route-feedback`. If Chris pastes fresh prose, route
  it first, then plan.
- It does not build autonomously on interpretive clusters — grilling work goes back to Chris.
- It does not fabricate clusters to look productive. If the backlog has no coherent buildable
  cluster yet, say so and recommend waiting for more accumulation (the auto-suggest-at-N nudge
  from route-feedback is the signal that it's ripe).

## Dogfood reference

This skill was first proven by running it over the real accumulated backlog (the
`feedback_mcp_continuous_log.md` Round-19 open state). That run's prioritized output — the
lifecycle-gate-not-modeled cluster ranking highest by recurrence, the claude.ai-client gating
correctly ranked out as an Anthropic escalation rather than a Latent sprint — is the worked
example of steps 2-5. See [ADR-0020](../../../docs/adr/0020-feedback-handoff-pipeline.md).
