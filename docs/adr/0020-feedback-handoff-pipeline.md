# Workflow-feedback handoff: a route → plan → implement pipeline, not one log

Structured feedback from claude.ai workflow sessions (brewing + roasting) is the
**practice-to-substrate** signal channel: lived friction, wins, and gap-spotting that should
compound into substrate improvements. Historically it all landed append-only in one memory
file (`feedback_mcp_continuous_log.md`) under the trigger "process pending workflow feedback,"
and items rotted — a friction that recurred across five sessions looked identical to a one-off,
and buildable work sat un-clustered next to closed wins. We formalize the handoff as a
**pipeline with two skills and two surfaces**, mirroring how `ARBITER.md` formalizes the
substrate-to-substrate direction.

```
ROUTE → (master log + categorize/point) → BACKLOG → REVIEW+PLAN → [implement: deferred]
```

**Two surfaces.** The master feedback log (`feedback_mcp_continuous_log.md`, memory) is
reframed as raw intake + routing ledger + audit trail — every item recorded with its routing
decision; wins and non-buildable items live there and nowhere else. A new dedicated
[`docs/product/feedback-backlog.md`](../product/feedback-backlog.md) holds only the
**actionable** subset, shape-tagged and recurrence-counted. The split exists because the two
have different consumers: the log is a human/audit surface, the backlog is machine-scanned by
the plan skill and must survive into PRs (so it's repo-tracked, not a memory file).

**Recurrence is the priority signal.** The backlog dedups rather than appends — a recurring
friction bumps a count instead of spawning a duplicate. That count is the dominant input to
prioritization, encoding Chris's principle: build "the things that keep coming up again and
again" first, because recurrence means structural cost, not incident.

**Two skills.** [`route-feedback`](../../.claude/skills/route-feedback/SKILL.md) (intake;
keeps the "process pending workflow feedback" trigger) splits a paste, routes each item to its
home, auto-files safe classes and confirms risky ones, and nudges when a cluster is ripe.
[`plan-feedback`](../../.claude/skills/plan-feedback/SKILL.md) (operator-initiated) clusters
the backlog by root cause, scores by recurrence + criticality + buildability, emits a sprint
kickoff brief, and hands off to an implementer sub-agent.

**Implementer deferred.** A dedicated implementer *skill* is not built; the spawned sub-agent
(Agent tool) is the implementer for now. This follows the sister Cluster B precedent
(doc-pruning, 2026-06-03): light formalization — automate the scaffolding, keep interpretive
judgment operator-led, dogfood on real material, defer the heaviest leg until friction proves
it's needed. The pipeline was proven by running `plan-feedback` over the real Round-19 backlog;
that run is the worked example.

Rejected alternatives:
- **Keep everything in the continuous log, just be more disciplined.** The log is a memory file
  (awkward for a plan skill to consume and for PRs to carry) and append-only by habit; the
  recurrence signal that makes prioritization possible can't be read off a flat round-by-round
  dump. The two-surface split is what lets recurrence accumulate against a stable entry.
- **Reuse `issues.md` + `roadmap.md` as the backlog.** Those aren't shaped for feedback-batch
  clustering and mix with non-feedback items; the plan skill needs shape tags + recurrence
  counts it can scan. The backlog routes *into* issues.md (confirmed product bugs) and roadmap
  (future directions) as homes — it doesn't replace them.
- **Build the full route → plan → implement pipeline now, including an implementer skill.**
  Over-fits the implementer to today's guesses before the plan→build leg has shown its real
  friction; the doc-pruning precedent showed the heavy skill is the right thing to defer.
- **Auto-fire the plan stage at a threshold.** Forming a sprint is an operator decision; the
  router only *nudges* at N. Auto-planning would spin sprints Chris didn't want yet.
- **A structured packet emitted by claude.ai instead of free-paste prose.** Would require
  claude.ai-side project-instruction + prompt changes for marginal parsing gain; free-paste is
  zero-cost on the claude.ai side and the router normalizes it fine.

See: [route-feedback](../../.claude/skills/route-feedback/SKILL.md) ·
[plan-feedback](../../.claude/skills/plan-feedback/SKILL.md) ·
[feedback-backlog.md](../product/feedback-backlog.md) · [ARBITER.md](../../ARBITER.md)
(substrate-to-substrate analog) ·
[doc-pruning brainstorm](../features/doc-pruning-mechanism-brainstorm-2026-06-03.md)
(Cluster B light-formalization precedent).
