---
name: route-feedback
description: >-
  Routes structured workflow feedback from a claude.ai session to its correct home instead of
  dumping everything into one log. Use this whenever Chris pastes "Feedback for Claude Code"
  prose, says "process pending workflow feedback", "route this feedback", "here's feedback from
  the brewing/roasting session", or hands over a batch of friction / wins / suggestions from a
  workflow session. The intake half of the feedback pipeline; the planning half is plan-feedback.
---

# Route Feedback

At the end of a claude.ai workflow session (brewing + roasting), it emits a "Feedback for Claude
Code" block — friction it hit, wins worth keeping, schema/prompt/Tool gaps it noticed. This skill
takes that prose apart and routes each item to the place that will act on it, so signal compounds
instead of dead-ending append-only in one log where a recurring friction reads the same as a one-off.

This skill is the **intake + routing** half of the feedback pipeline (see
[ADR-0020](docs/adr/0020-feedback-handoff-pipeline.md)). Its job is to take the
paste apart into discrete items and send each one to the place that will actually act on it,
so the signal compounds instead of accumulating. The **planning** half — turning the
accumulated backlog into a buildable sprint — is the separate `plan-feedback` skill.

This is the **practice-to-substrate** analog of [ARBITER.md](ARBITER.md) (which
routes substrate-to-substrate `propose_doc_changes`): same read → present → confirm → apply
discipline, different input (lived workflow friction rather than staged doc proposals).

## Two surfaces

- **Master feedback log** — `~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_mcp_continuous_log.md`.
  The raw intake + routing ledger + audit trail. Every item gets recorded here with the
  routing decision stamped on it. Wins and non-actionable items live here and nowhere else.
- **Feedback backlog** — [`docs/product/feedback-backlog.md`](docs/product/feedback-backlog.md).
  Only the **actionable** subset (work that needs a build). Shape-tagged + recurrence-counted
  so `plan-feedback` can cluster and prioritize. Repo-tracked so it survives into PRs.

## Procedure

### 1. Read both surfaces first

Before touching anything, read the master log's `## Outstanding follow-ups` + latest status
section and the full `feedback-backlog.md`. You need the current open-item set in your head
so you can **dedup** — the whole value of this skill is that a recurring item bumps a count
instead of becoming a fresh duplicate.

### 2. Split the paste into discrete items

One pasted "Feedback for Claude Code" block usually contains several distinct items (a prompt
gap, a schema idea, a win, a Tool bug). Separate them. Don't merge unrelated items just
because they arrived together; don't split one item into many just because it has sub-parts.

### 3. Classify + route each item

For each item, pick its home from the routing taxonomy. **Auto-route the safe classes**
(append-only, git-reversible, no judgment call). **Stop and confirm the risky ones** with
Chris before writing — anything that asserts a standing rule, edits the glossary, files a
product bug, or implies code. This mirrors the arbiter's human-in-the-loop posture: cheap,
reversible writes need no ceremony; substantive or hard-to-reverse ones get a yes first.

| Item shape | Home | Auto / confirm |
|---|---|---|
| Win / save-from-success | master log (record, close positive) | **auto** |
| Duplicate of an existing open item | bump recurrence count + add source on the existing entry | **auto** |
| Concept / terminology clarification | `docs/grilling-queue.md` (append candidate) | **auto** |
| Buildable: prompt / MCP / schema / UI fix or candidate | `docs/product/feedback-backlog.md` (new shape-tagged entry) | **auto-file** (the *build* is confirmed later, by plan-feedback) |
| Standing rule / methodology | `memory/feedback_*.md` (+ MEMORY.md index line) | **confirm** |
| Structural-but-unconfirmed (needs N) | CCIL `docs/skills/ccil/cluster/observing.md` | **confirm** |
| Glossary term ready to lock | `CONTEXT-{roasting,brewing,shared}.md` | **confirm** |
| Product bug / broken substrate | `docs/product/issues.md` | **confirm** |
| Non-obvious architecture decision | flag for an ADR (don't write it inline) | **confirm** |
| claude.ai-client issue (not Latent substrate) | master log, tagged "Bucket C: surface to Anthropic" | **auto** (it's an escalation note, not a build) |

When an item is genuinely ambiguous between two homes, that's a confirm — surface the two
candidates and let Chris pick. Don't silently guess on a fork.

### 4. Dedup is the point — recurrence over append

Before filing a new backlog entry, check whether the open backlog already holds the same
underlying friction. If it does, **do not file a duplicate** — increment that entry's
`Recurrence` count and add the new source round/lot. A friction that shows up in rounds 15,
16, and 17 should read `Recurrence: 3`, because that number is exactly what `plan-feedback`
uses to decide what to build first. "Same underlying friction" means the same root cause, not
the same words — e.g. the SPG lifecycle-state item and the one-shot defer-verdict item are the
same lifecycle-gate-not-modeled root, so the second reinforces the first rather than starting
its own entry.

When deduping a buildable item against something already routed to a non-build home (Bucket C,
a parked project), still note the recurrence on its one-liner in the backlog's "Routed
elsewhere" section — a client issue recurring across five sessions is signal even if Latent
won't build it.

### 5. Record in the master log

Append a dated round to the master log capturing the raw items as received + the routing
decision for each (one line each: `→ backlog (schema)`, `→ grilling-queue`, `→ Bucket C`,
`win, closed`). This stays the audit trail; future sessions reconstruct "where did this go"
from here.

### 6. Nudge when a cluster is ready to plan

After routing, scan the backlog for any theme where **3+ related actionable items** are now
open (or one item whose recurrence count has crossed ~3). If so, tell Chris:
"N related items on `<theme>` are now queued — consider running plan-feedback." Don't auto-fire
the plan stage; the operator decides when a sprint forms (per the design lock). The nudge is a
suggestion, not an action.

### 7. Commit

Backlog + grilling-queue + issues edits are repo files — commit them on a branch + PR per the
git-discipline rules. Master-log + memory edits are not in the repo; they're saved in place.
Group routing edits from one paste into one commit/PR.

## What this skill does NOT do

- It does not build anything. Buildable items land in the backlog and wait for `plan-feedback`
  to cluster + brief them, and for a separate go to implement.
- It does not change the claude.ai side. Input stays free-paste prose; there is no packet
  schema to maintain.
- It does not duplicate terminal-home items into the backlog. A standing rule that landed in
  memory is done; it does not also get a backlog entry.

## Example

**Input (pasted):** *"Feedback for Claude Code: (1) the cooling-arc behavior is now
differentiating on a 2nd lot — we should make it queryable, it's prose-only right now. (2) Big
win — pull_roest_log surfacing end_condition_target directly saved a manual check. (3) Again
hit the propose_doc_changes approval gate on a 2-citation bundle."*

**Routing:**
- (1) → backlog, new entry, Shape: schema, "cooling_arc_pattern enum"... unless an equivalent
  entry exists, in which case bump its recurrence. **auto-file.**
- (2) → master log, win, closed positive. **auto.**
- (3) → already a known claude.ai-client issue → bump the recurrence on the Bucket C one-liner
  in "Routed elsewhere"; note it in the master log as another occurrence. **auto.** (It's an
  Anthropic escalation, not a Latent build.)
- Nudge check: if cooling_arc joins 2+ other open schema items, suggest plan-feedback on the
  cupping-schema cluster.
