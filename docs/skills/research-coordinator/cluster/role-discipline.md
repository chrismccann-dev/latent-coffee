# Role discipline — Lesson #40 substrate

**Status:** Load-bearing, non-negotiable
**Origin:** Filter-arc Project #3 close-out (2026-05-25); refined in Project #4 (2026-05-26)
**Locked in:** Research Assistant Step 2 scaffolding (Step 1 grilling, 2026-05-26)

---

## ⚠️ THE RULE

A research project runs across three structurally distinct Claude Code sessions. Each session has a single role. The roles do not overlap.

| Session role | Owns | Does NOT do |
|---|---|---|
| **Coordinator session** | Project roadmap, track design, methodology refinement, spawn-prompt authoring, scoped execution plan authoring | Run scoring pulls; commit substrate; participate in Assistant or Execution sessions |
| **Assistant session** | Step 0 calibration, scoring pulls/observations/measurements, inline protocol-doc updates, handoff brief production | Apply substrate edits; run `git commit` / `git push` / `gh pr create`; run `npx tsc --noEmit`; continue past handoff brief |
| **Execution session** | Apply the scoped execution plan's substrate edits (registry / cluster doc / ADR), run typecheck, commit, push, open PR | Re-interpret the plan; design follow-up tracks; participate in Coordinator's planning |

---

## DO NOT (in the Assistant session)

- Edit `lib/*-registry.ts`
- Edit `docs/skills/*/cluster/*.md`
- Edit ADR files
- Edit `lib/mcp/docs.ts` or any other MCP config
- Run `git commit`, `git push`, or `gh pr create`
- Run `npx tsc --noEmit` against substrate edits (you won't be making any)
- Apply "what changed" file edits as part of close-out
- Continue past the handoff brief to "finish the job"
- Carry context from a prior research track into a current Assistant session (single-track context firewall)

## DO (in the Assistant session)

- Read the protocol doc in full BEFORE Step 0
- Walk the operator through Step 0 calibration-arc primitives ([`calibration-arc.md`](docs/skills/research-coordinator/cluster/calibration-arc.md))
- Run scoring pulls / observations / measurements one-at-a-time (Project #1 Lesson #7 — tool-call-per-pull pacing)
- Apply auto-retest (Project #1 Lesson #5), confirmed-outlier procedure (Project #3 Lesson #21), and cross-confirmation alternatives as appropriate
- Pre-state hypothesis tests in the protocol doc's "predicted outcomes" column before scoring begins (Project #4 Lesson #16 active-mode framing)
- Capture friction + new lessons + audit items inline in the protocol doc (Project #2 Lesson #12 — the doc IS the archive)
- Test substantive mid-run theory inside the session (Project #1 Lesson #16 — budget ~2 exploratory pulls)
- Produce a handoff brief at session end per [`templates/handoff-brief-template.md`](docs/skills/research-coordinator/cluster/templates/handoff-brief-template.md)
- Declare termination explicitly at the end of the handoff brief

---

## Why this rule exists

Filter-arc Project #3's cold execution session over-stepped its role-split. Per the design pattern established for Projects #1 + #2, the cold session was supposed to:

(a) execute measurements
(b) produce a handoff brief for the compile session to compile from

The cold session instead also:

(c) attempted to apply substrate edits directly
(d) ran `tsc`
(e) reported "files modified, build clean."

When the compile session checked, **the claimed edits were not present in any branch**. The cold session's working state was ephemeral and never committed. The compile session had to re-do all substrate integration from the handoff brief.

The cold session got 13 of 20 lessons from Project #3a by following the protocol perfectly. Lesson #40 is the 21st lesson — process-side rather than substrate-side, but equally load-bearing.

The failure mode is specifically that the role boundary is **invisible to the Assistant session itself** — from inside, applying edits feels like "completing the work." Only by stepping out and verifying does the lost-state problem become visible. The rule has to be pre-baked at the top of every protocol doc + at the top of every Assistant SKILL.md + at the top of every spawn prompt so the boundary is impossible to miss.

---

## Why three sessions, not two

The brief grilling locked three sessions, not two (Coordinator + Assistant + Execution), for a specific reason: **Coordinator should NOT apply substrate edits either.**

Coordinator carries the long-running context — roadmap, cross-track view, methodology primitives, prior project end-documents. That context is exactly what should NOT be polluted by line-by-line registry edits. The Coordinator's role is to scope the execution plan sharply enough that a fresh session with no prior context can apply it cleanly. That scoping IS the value the Coordinator adds; doing the edits in-session would conflate scoping with applying, and re-introduce the same Project-#3-style ephemeral-state risk for Coordinator-side context.

Three sessions, three roles. Structurally rigid. Scopewise fluid (per the [ADR-0017](docs/adr/0017-research-assistant-architecture.md) 3-actor pattern framing).

---

## Pre-bake locations

This rule must be pre-baked at:

1. **Top of [Research Assistant SKILL.md](docs/skills/research-assistant/SKILL.md)** — caps + DO NOT/DO lists + this "Why this rule exists" reference
2. **Top of every spawn prompt** generated from [`templates/spawn-prompt-template.md`](docs/skills/research-coordinator/cluster/templates/spawn-prompt-template.md) — caps block at the top of the protocol-doc-internal "Read this before Step 0" section
3. **Top of every protocol doc** Coordinator authors at `docs/research-projects/<track-slug>.md` — same caps block

Three pre-bake locations because the Project #3 failure mode showed the boundary is genuinely invisible to the Assistant from inside. Repeating the rule in caps at three load-bearing entry points is the recovery mechanism.

---

## Termination declaration template

Every Assistant session ends with a termination declaration block at the bottom of the handoff brief. Template (mirror Project #4 close-out):

```
### Execution Session Termination

Per Lesson #40 role-discipline rule:
- ❌ NO registry edits made
- ❌ NO commits, no pushes, no PRs opened
- ❌ NO `npx tsc --noEmit` runs
- ✅ Protocol doc updated in-place as canonical archive (authorized per "doc IS the archive" framing)
- ✅ Handoff brief produced above for compile session consumption
- 🛑 Session terminating after this brief lands. The compile session integrates substrate per the design pattern.

End of <track-name> close-out.
```

The explicit declaration is structurally important — it makes the "did the Assistant actually stop?" question answerable from the protocol doc alone.

---

## Related primitives

- [`sharp-substrate-fold.md`](docs/skills/research-coordinator/cluster/sharp-substrate-fold.md) — context-firewall principle that motivates the three-role split
- [`templates/handoff-brief-template.md`](docs/skills/research-coordinator/cluster/templates/handoff-brief-template.md) — the bridge artifact between Assistant and Execution sessions
- [`templates/spawn-prompt-template.md`](docs/skills/research-coordinator/cluster/templates/spawn-prompt-template.md) — pre-bake site #2 for this rule
- [ADR-0017](docs/adr/0017-research-assistant-architecture.md) § The role-discipline rule
