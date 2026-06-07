# Delegated-Execution Pattern - design handoff (working name TBD)

*Authored 2026-06-06 by Claude Code, at Chris's request, anchored to the concrete*
*feedback-backlog #33 run that happened minutes before in the same session.*

## What this doc is (and is NOT)

This is a **design plan for a future reusable skill**, captured from a lived example so
the eventual skill is informed by real shape, not abstract speculation.

**It is NOT an instruction to build the skill now.** Deliberate: Chris wants to run a few
concrete prototypes of this loop on real upcoming work first, let the shape settle from
lived friction, and only then generalize it into a `SKILL.md` that other skills can call.
Designing it abstractly up front would over-fit to guesses.

**Lifecycle of this doc:**
1. This doc (the design + the prototype-#0 record).
2. Hand it to a future session whenever you have a decided, interpretation-free plan in
   hand and want to delegate the execution. That session runs the 5 phases below
   *manually but faithfully* (not yet a skill) and appends a **Prototype log** entry.
3. After 2-3 such lived prototypes, dogfood the shape: do the friction in the handoff
   converge? Does the rules pack stop changing? Does the gate hold?
4. When stable, write the `SKILL.md` and make it invokable from other skills (refactor
   `plan-feedback` steps 5-6 to call into it as the first proof of the subroutine
   interface).

## The pattern in one line

When a session already holds a fully-decided, interpretation-free plan, hand the execution
to a fresh sub-agent in one self-contained prompt, then pull the result back and reconcile
it - all **in the same thread, right as execution completes**.

## Why it exists

Today the human operator is the courier: you take a plan from the planning session, open a
new session, paste it, babysit execution, copy the result, and carry it back to the
original thread to reconcile. This skill replaces *that mechanical courier loop* with a
single invocation. It does not replace the thinking - only the back-and-forth.

## Prototype #0 - the lived reference example (feedback-backlog #33)

The exact run this doc is modeled on. Each phase below maps to a real step:

| Phase | What happened in the #33 run |
|---|---|
| **Plan decided** | `plan-feedback` clustered the backlog; Chris confirmed the "3+ obs or critical-surface" bar + chose #33 option (b) via AskUserQuestion. The settled plan = the kickoff brief [docs/sprints/per-lot-file-registration-kickoff.md](../sprints/per-lot-file-registration-kickoff.md). Zero open interpretive calls remained. |
| **Delegate** | Spawned ONE background `general-purpose` Agent with a self-contained prompt: the brief + a small rules pack (autonomy, build hygiene, six-actor audit, hyphens-not-em-dashes, git discipline) + the completion-report contract. |
| **Execute** | The sub-agent built it, ran the gates, opened PR #418, squash-merged. Merge SHA `b530827`. |
| **Report back** | The agent returned a **standalone status digest**: what shipped per scope item, PR URL + SHA, verification actuals (dry-run output, `check:mcp-bundle` exit 0, `tsc` clean), and the two decide-and-proceed defaults it took. |
| **Verify-back** | I did NOT just relay it. Independently re-ran `check:doc-links` and re-checked that `origin/main` actually carried the merge before trusting "done". |
| **Synthesize in-thread** | Closed the loop: added the `shipped.md` row, flipped backlog #33 `planned -> shipped`, committed the completion report (PR #419, SHA `c3e2373`), recapped plan-vs-actual, and scanned for new friction to route (none). |

That sequence IS the skill. Everything below is that sequence, decided and parameterized.

## Locked design decisions (from the 2026-06-06 conversation)

1. **Scope = the operationalize-tail only.** The skill assumes a decided plan already
   exists. It does NOT plan. Deciding the plan stays interpretive, conversational,
   audio-driven (you + me, or `brainstorm` / `grill-with-docs`). The skill is the
   "hand off -> execute -> bring back -> reconcile" tail, nothing before it.
2. **Gate = aggressively conservative.** The in-hand plan must contain **zero unresolved
   interpretive calls**. If the plan still has undecided X/Y/Z, the skill **refuses to
   spawn** and bounces back naming exactly what is undecided ("you haven't decided X, Y, Z
   - decide these, then re-hand me the plan"). A false "ask Chris" costs one cheap
   round-trip; a sub-agent silently making a call that was yours is the worst failure mode.
3. **Standalone report = always required.** The sub-agent must always return a report that
   stands alone, because that report is the thing pulled back. (Belt-and-suspenders even
   though, in this mode, I'm still alive to read it.)
4. **Mode = IN-LINE, same-thread only.** Plan -> execute -> bring back **in the same
   thread, right as execution completes**. We are deliberately NOT designing for the
   long-arc, cross-session, paste-back-much-later case. Do not over-design for both.
5. **Concurrency = strong single-agent default.** One sub-agent, almost always. Spawn more
   than one ONLY on a deterministic call when the execution surface is so large that a
   single sub-session's context window would be at risk. The plan should be specific
   enough that one agent suffices; default hard to one.
6. **Rules pack = small and explicit.** Even if it slightly over-states rules the
   sub-agent might auto-load, be clear: "here are the rules, here is the plan, here is the
   defined output, go do it, return the output." Short and explicit beats clever.
7. **Trust-but-verify on the way back.** The synthesis step independently re-checks the
   headline claims (gate exit codes, PR merged, files exist in the shape claimed). Never
   relay "the agent said it did X" without a cheap confirmation.
8. **Always capture plan + execution + delta + lessons.** The reconciliation must record:
   the plan, what actually happened, the **delta** between them, and what we **learned**
   from that delta. This is how the handoff process improves itself over time - we need
   the skew/shape of both sides to make the next handoff better.

## The canonical phases (what the skill runs)

1. **Precondition gate.** Inspect the in-hand plan for interpretive residue (markers like
   TODO / TBD / "decide later" / open questions / unresolved option-choices). If any
   exist, refuse and return the list of undecided items. Otherwise proceed.
2. **Compose the handoff prompt.** Assemble ONE self-contained prompt (see contract below).
3. **Delegate.** Spawn a single background sub-agent with that prompt. (>1 only per
   decision 5.)
4. **Verify-back.** On completion, independently re-check the report's headline claims.
5. **Synthesize in-thread.** Reconcile plan vs execution, surface the delta + lessons,
   perform the loop-close actions, and report to Chris.

## The handoff-prompt contract (the "one prompt you hand over")

The single prompt to the sub-agent must carry, because the sub-agent has zero memory of the
planning conversation:

- **The decided plan**, fully standalone (not "the thing we discussed").
- **The defined output shape** - what "done" concretely produces.
- **The rules pack** - the small explicit set of load-bearing rules.
- **Verification criteria** - how the agent must prove it worked (commands to run, gates).
- **The autonomy envelope** - may it commit/PR/merge, or stop at the diff?
- **The completion-report contract** (below).

## The completion-report contract (what the sub-agent returns)

A standalone report that: (1) restates the plan so it stands alone, (2) recaps what shipped
per item including divergences + why, (3) gives PR URL + merge SHA if applicable,
(4) reports **actual** verification results (ran-and-saw, not "should work"), (5) flags
anything deferred, surprising, or newly surfaced.

## The synthesis output (what the skill leaves in the thread)

- **Plan** - restated.
- **Execution** - what actually happened.
- **Delta** - plan vs actual, with the why of each divergence.
- **Lessons** - what would make the next plan -> execute handoff cleaner.
- **Loop-close actions** - substrate updates, status flips, friction routed.

## Explicitly OUT of scope

- Deciding the plan (interpretive; stays human).
- Long-arc, cross-session, paste-back-later mode (decision 4).
- Heavy parallel fan-out / `Workflow`-tool orchestration (single-agent default; revisit
  only if a prototype genuinely demands it per decision 5).

## Open questions to resolve DURING prototyping (NOT now)

- **Does an `Agent`-tool sub-agent auto-load CLAUDE.md + memory at its own session start?**
  If yes, the rules pack can shrink to a pointer + the few genuinely load-bearing rules.
  Verify empirically in prototype #1 rather than assuming.
- **Exact rules-pack contents** - derive from what actually mattered across prototypes.
- **Gate heuristics** - how reliably can "interpretive residue" be detected mechanically?
  Refine against real plans.
- **Report transport** - in-line mode returns in-thread; do we ALSO persist a file? Decide
  from prototype friction, not up front.
- **Subroutine interface** - how does another skill (e.g. `plan-feedback`) invoke this as a
  step? Define the input interface once the shape is stable.
- **Naming** - candidates: `delegate-and-execute`, `execute-handoff`, `spawn-executor`,
  `run-plan`. Pick after prototypes.

## Path to skill-ification (acceptance criteria to generalize)

1. Prototype #0 = the #33 run (recorded above).
2. Run >= 2 more concrete prototypes on real upcoming work, doing the 5 phases deliberately
   by hand (still not a skill), appending a Prototype log entry each time.
3. The shape is "ready to generalize" when: the rules pack converges, the gate heuristics
   hold across different plan shapes, and the report contract stops changing run to run.
4. Then write `SKILL.md` + wire invocation triggers.
5. Refactor `plan-feedback` steps 5-6 to call into it - the first proof of the subroutine
   interface and the regression test for the generalization.

## How to use this doc (for the future executing session)

When you have a decided, interpretation-free plan in hand and want to delegate it, tell a
fresh Claude Code session: *"Run the delegated-execution loop per
`docs/features/delegated-execution-pattern-2026-06-06.md` against this plan."* That session
runs the 5 phases faithfully and **appends a Prototype log entry below** capturing what
worked, what the brief missed, what the verify-back caught, and what it would change - so
the eventual skill is built from lived shape.

## Prototype log

### Prototype #0 - feedback-backlog #33 (2026-06-06)
- **Plan source:** `plan-feedback` -> kickoff brief (per-lot-file-registration).
- **Delegation:** 1 background `general-purpose` agent; brief + 5-rule pack + report contract.
- **Outcome:** clean. PR #418 (`b530827`) implementation; PR #419 (`c3e2373`) close-out.
- **Verify-back caught:** nothing wrong with the build, but the synthesis step's independent
  `check:doc-links` run caught one file-relative link *I* introduced during close-out
  (fixed root-relative per ADR-0021) - evidence the verify-back step earns its keep even
  when the sub-agent is flawless.
- **Delta plan-vs-actual:** sub-agent took both decide-and-proceed defaults as specified;
  no scope drift. One brief nuance: the "future Tool sprint tracker" it was told to drain
  was an inline prompt note, not a numbered grilling-queue item - it resolved both. Minor;
  shows the brief should not assume the exact form of a thing it references.
- **Lessons:** (1) the completion-report contract is the highest-leverage part - a vague
  "report back" would have lost the verification actuals. (2) Independent verify-back is
  worth it. (3) The standalone brief had to carry the rules explicitly; confirm whether
  auto-load makes that redundant. (4) Same-thread synthesis worked because the background
  agent finished while the planning session was still alive - the in-line constraint
  (decision 4) is what made this smooth.
