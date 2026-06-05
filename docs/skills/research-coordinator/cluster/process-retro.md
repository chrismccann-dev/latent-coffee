# Process retro — accumulation mechanism for research craft

**Status:** Load-bearing
**Origin:** Filter-arc retrospective (post-RP4 close-out, 2026-05-26)
**Locked in:** Research Assistant Step 2 scaffolding (Step 1 grilling, 2026-05-26)

---

## The principle

Research projects are ephemeral. Each project's findings, lessons, audit items, and ADRs are project-specific. They don't compound against each other directly — the next research project will be on a different topic with different methodology.

What DOES compound is **the research craft**: how Step 0 should be structured, how the spawn prompt should be shaped, how the handoff brief format should look, what role discipline should require, how the Coordinator should scope an execution plan. Those are cross-project primitives that get sharper every time a project ships.

The process retro is the structural mechanism that lets the craft compound. **Without it, primitives drift; with it, primitives ratchet forward.**

---

## When the retro fires

**At the end of every research project.** Not at the end of every track — the cross-track view is necessary to evaluate methodology coherence, and the within-project iteration loop produces its own micro-refinements that don't need a retro of their own.

The Coordinator initiates the retro after the project's end-document lands. The end-document IS in itself a kind of within-project synthesis; the retro is the cross-project synthesis layer above it.

---

## Who participates

Operator + Coordinator. No Assistant participation — Assistants are ephemeral and don't carry the cross-track context the retro needs. The Assistants' work product (per-track handoff briefs + inline protocol-doc updates) is the input to the retro, not a participant in it.

The Coordinator session that ran the project is the Coordinator that runs the retro. Continuity matters here — the retro relies on the Coordinator's accumulated context of how the project unfolded across its tracks.

---

## What the retro interrogates

The retro is structured as a long-form grilling conversation between operator + Coordinator. Areas of interrogation:

### Protocol-doc shape

- Did the protocol doc format hold across the project's tracks, or did it bend in places?
- Were the Step 0 sub-steps the right granularity?
- Did any sub-step turn out to be load-bearing in a way the template didn't surface?
- Did any sub-step turn out to be procedural overhead that could be cut?

### Spawn prompt

- Did the 9-section structure hold?
- Did the Assistant sessions read the protocol doc in full as the spawn directed?
- Were there any moments where the Assistant didn't have enough context from the spawn?
- Were there any moments where the spawn carried context that turned out to be misleading?

### Handoff brief format

- Did the handoff brief sections give the Coordinator everything the execution session needed?
- Did anything fall off the brief that should have been there?
- Did anything end up on the brief that turned out to be noise?
- Was the brief's "substrate edit specifications" section sharp enough that the execution session could apply without re-derivation?

### Step 0 sub-steps

- Did the calibration-arc primitives all fire when expected?
- Was anything skipped that turned out to matter?
- Was anything ratified that turned out to be redundant?
- New Step 0 sub-step candidates surfaced by the project's friction?

### Mid-run hypothesis testing

- Did substantive theory generation happen mid-run, or did it get deferred to close-out?
- Were the "budget ~2 exploratory pulls" actually used? Were they enough?
- Did any hypothesis test get pre-stated that turned out to be the wrong frame?

### Role discipline

- Did Coordinator + Assistant + Execution stay in their lanes?
- Any role-boundary violations during the project? If so — same as Project #3 Lesson #40, or new failure mode?
- Did the three-role split feel like real value or like overhead?

### Friction during the run

- Anything the operator hit that wasn't covered by an existing primitive?
- Anything the Coordinator anticipated that turned out to be a non-issue?
- Cross-track friction (drift between protocols, methodology evolution between tracks)?

---

## Retro output

Two structured outputs:

### 1. Methodology primitive doc updates

For each finding in the retro that warrants substrate-level refinement: update the relevant doc in this cluster.

| Retro finding type | Where it lands |
|---|---|
| Role-boundary failure mode | [`role-discipline.md`](docs/skills/research-coordinator/cluster/role-discipline.md) — extend the DO NOT / DO list or the "Why this rule exists" examples |
| Step 0 sub-step refinement | [`calibration-arc.md`](docs/skills/research-coordinator/cluster/calibration-arc.md) — update the primitive's description; possibly add a new primitive (gated on second-project confirmation) |
| Sharp-fold gap (something folded outward that shouldn't have, or something stayed inward that should have folded) | [`sharp-substrate-fold.md`](docs/skills/research-coordinator/cluster/sharp-substrate-fold.md) — update the examples or the gate description |
| Spawn prompt structural drift | [`templates/spawn-prompt-template.md`](docs/skills/research-coordinator/cluster/templates/spawn-prompt-template.md) — refine the 9-section skeleton |
| Handoff brief shape drift | [`templates/handoff-brief-template.md`](docs/skills/research-coordinator/cluster/templates/handoff-brief-template.md) — refine the section list |
| Cross-project pattern (something fired twice now) | The pattern graduates from research-surface lesson to cluster primitive |

### 2. Roadmap update

[`roadmap.md`](docs/skills/research-coordinator/cluster/roadmap.md) gets updated to:

- Move the just-closed project from § Now to § Closed (with pointer to its end-document)
- Move the next project (if scoped during the retro) from § Next to § Now
- Add any new Side quests or Extensions of completed projects surfaced during the retro
- Drop any § Next entries the retro reveals as no longer load-bearing

---

## The cross-project ratification gate

A finding from a single project does NOT graduate into a cluster primitive. It graduates into a project-specific lesson logged in the protocol doc.

Only when a SECOND project independently surfaces the same finding does the cluster primitive get updated to incorporate it.

**Why:** Single-project findings have notorious over-generalization risk. The filter arc's own Lesson #36 (paper "self-choke" is paper-brewer-INTERACTION not paper-fiber-intrinsic) was framed at Project #3 close-out as "deepest insight of arc" — and was partially contradicted by RP4 (CAFEC family retains paper-fiber signal). If Lesson #36 had graduated to a cluster primitive at Project #3 close-out, RP4 would have had to issue a substrate retraction.

The gate is structural protection against the same failure mode at the methodology layer that the gate already protects against at the schema layer (per [`sharp-substrate-fold.md`](docs/skills/research-coordinator/cluster/sharp-substrate-fold.md)).

**Practical mechanism:** The Coordinator tracks single-project methodology lessons in the protocol doc's Notes section. At the next project's retro, the operator + Coordinator scan prior projects' methodology lessons looking for repeat fires. Repeats graduate; non-repeats stay logged where they are.

---

## Why Coordinator gates the next project on the retro

If the retro doesn't run, the next project starts from drift-laden primitives. The drift won't be visible — the primitives will look unchanged in their cluster docs — but the implicit understanding of "what worked" will have shifted in the operator's head without being captured.

To prevent this, the Coordinator does NOT scope the next project until the prior project's retro has completed. Roadmap § Now sitting empty for a few days is the correct intermediate state.

This is a soft gate, enforced by Coordinator-side discipline rather than mechanism. The operator could override by typing "skip the retro, start the next project." That's their choice — but the rule is documented here so the override is conscious.

---

## Retro tempo

~30-60 minutes of operator + Coordinator dialogue. Not heavily structured — the long-form grilling is the format. The Coordinator produces the structured outputs (primitive doc updates + roadmap update) AFTER the dialogue, not during.

Operator should expect to do most of the talking. The Coordinator's job is to ask "what happened?" / "what surprised you?" / "what would you change?" — not to push hypotheses about what should change.

---

## Related primitives

- [`role-discipline.md`](docs/skills/research-coordinator/cluster/role-discipline.md) — the retro is the only session where the Coordinator carries cross-track + cross-project context simultaneously; the role split is relaxed at retro time
- [`sharp-substrate-fold.md`](docs/skills/research-coordinator/cluster/sharp-substrate-fold.md) — the retro's substrate-fold output (primitive doc updates) is itself an instance of substrate fold; sharp + pointed
- [`roadmap.md`](docs/skills/research-coordinator/cluster/roadmap.md) — the second canonical retro output
- [ADR-0017](docs/adr/0017-research-assistant-architecture.md) § Process retro as accumulation mechanism
