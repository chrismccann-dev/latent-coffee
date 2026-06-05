# Handoff brief template — Assistant → Coordinator close-out

**Owner:** Research Assistant produces; Research Coordinator consumes; Execution session also consumes
**Origin:** Distilled from filter-arc Projects #1-RP4 close-out briefs
**Locked in:** Research Assistant Step 2 scaffolding (Step 1 grilling, 2026-05-26)

---

## How to use this template

At the end of every Research Assistant session, the Assistant appends a handoff brief to the bottom of the protocol doc (`docs/research-projects/<track-slug>.md`) following the section-by-section structure below. The brief is the canonical consumption artifact for two consumers:

1. **Research Coordinator** — pastes the brief into their session (Coordinator runs in a separate session). Coordinator uses it to update the project end-document + roadmap + draft the substrate-fold execution plan.
2. **Execution session** — receives the substrate-edit specifications section (extracted into a paste-ready scoped execution plan by the Coordinator). Applies edits without re-derivation.

Both consumers must be able to act on the brief without seeing the prior Assistant-session conversation. The brief is self-contained.

After the brief is written, the Assistant declares termination and stops. No commits, no PRs, no further edits. See [`role-discipline.md`](docs/skills/research-coordinator/cluster/role-discipline.md).

---

## The section list

```
## HANDOFF BRIEF FOR COMPILE SESSION (<track-name> Close-Out)

**Date:** <YYYY-MM-DD>
**Session role:** execution + handoff brief production (no substrate edits)
**Methodology verdict:** <e.g. "✅ VALIDATES" / "❌ PARTIALLY CONTRADICTS" / "MIXED — see findings">

<one-paragraph summary of what this brief is and how the compile session should consume it>

### TL;DR

<3-7 bullet points. Headline findings only. Numbers + claims that survive the rest of the brief.>

### Execution summary

<short paragraph: how many pulls/observations/measurements executed, how the methodology held during execution, anything that diverged from the protocol>

### Equipment / conditions

<table of the equipment used + measurement conditions. Brewer, grinder, water temp, coffee dose, etc. Whatever's load-bearing for the track.>

### Per-pull / per-measurement raw data

<the canonical recording sheet, complete. One row per scoring pull (or per measurement, or per observation depending on track shape). Include outliers, retests, calibration shots — everything that fired during the session. Annotate any retest / confirmed-outlier / cross-confirmation events.>

### Analysis

<the per-pull data resolved into the track's analytical outputs. Median values, classifications, deltas, cross-confirmations. This is the section that turns raw measurements into substrate-relevant findings.>

### Final output

<the specific deliverable the track was designed to produce. E.g. for filter-arc tracks: per-paper drawdown median + classification (Real fast / Indistinguishable / Real slow). For brewing-quality tracks: per-recipe quality assessment. Etc.>

### Key findings

<numbered list. Each finding is a stand-alone claim with: what was found, what's the data backing it, what's the substrate implication. 3-10 findings typical.>

### Substrate edit specifications for compile session

DO NOT execute these edits in this session — the compile session integrates substrate.

<numbered list of specific substrate edits. Each edit:
- names a file path (e.g. lib/filter-registry.ts entry X)
- names the exact change (add field, update measurement, add ADR pointer)
- cites the data source (which finding above, which audit item, which lesson)
- has a fresh-context-readable rationale (the execution session won't see this conversation)>

Sub-categories typical:
- Registry edits
- Cluster doc edits
- ADR work (new ADR, ADR amendment, ADR audit item resolution)
- Audit item resolutions (P# AI-# closed, refined, escalated)

### New lessons captured

<numbered (or per-project-letter-coded) lessons table. Each lesson:
- # (or RP#-N# code)
- Lesson statement
- Substrate implication>

Lessons that fire in this single track stay logged here. Lessons that graduate to cluster primitives go through the process-retro cross-project ratification gate per `docs/skills/research-coordinator/cluster/process-retro.md`.

### Audit items queued

<numbered list. Each item:
- # (P#-AI-# code)
- Audit item statement
- Status (open / refined / resolved / queued for compile session)
- Substrate implication if any>

### Open data items

<anything in the data that's unresolved — measurements that need re-running, drift gaps that weren't reconciled, hypothesis tests that didn't fully resolve. Operator + Coordinator triage these at retro.>

### Recap map for compile session

<paragraph (or short bullet list) telling the compile session what specifically to integrate first, what to defer, and what to escalate to the operator for adjudication.>

### Protocol-execution friction captured

<numbered list of friction the Assistant + operator hit during the session that's worth surfacing for protocol-doc refinement. These flow into the process retro per `docs/skills/research-coordinator/cluster/process-retro.md`.>

---

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

---

## Section-by-section authoring guidance

**Date / Session role / Methodology verdict.** Three-line header. The verdict line is opinionated — say what the track actually concluded about its hypothesis tests, not a hedged neutral statement. Mixed verdicts are fine; vague verdicts erode the brief's signal value.

**TL;DR.** Bullet points only. 3-7 bullets. Each bullet is a one-sentence headline finding. Numbers + claims that survive scrutiny in the rest of the brief. If a TL;DR bullet doesn't have a § Key findings entry backing it, drop the bullet (or upgrade it to a § Key findings entry).

**Execution summary.** Short paragraph. How many pulls actually fired, did the methodology hold, did anything diverge. Don't editorialize; state what happened.

**Equipment / conditions.** Table. Brewer / grinder / water / dose / equipment quirks. If the protocol called for X and the track ran with Y, surface the swap here.

**Per-pull / per-measurement raw data.** Canonical recording sheet. Complete. Include retests, outliers, calibration shots. The Coordinator + Execution session both need to be able to re-derive findings from the raw data if a § Analysis claim is questioned.

**Analysis.** Where raw → findings. Show the medians, the deltas, the classifications, the cross-confirmations. This section turns measurements into substrate-relevant claims. If the analysis methodology is novel (e.g. RP4's Δ-in-deltas), name it here and explain it briefly.

**Final output.** The specific deliverable. One table or one paragraph. The brief's main payload.

**Key findings.** Numbered. Each finding is data-backed + substrate-implication-tagged. 3-10 typical. The brief's analytical core.

**Substrate edit specifications.** **The most load-bearing section for the Execution session.** Each edit is paste-ready: file path + exact change + data source + fresh-context-readable rationale. The Execution session won't see the prior conversation; the spec must stand alone. Sub-categorize by edit type (registry / cluster doc / ADR / audit item) for the Execution session's reading order. **Do NOT execute the edits in this session** — the DO NOT block at the top of the section is the load-bearing reminder.

**New lessons captured.** Numbered (continue the project's running numbering — Project #4's lessons start at RP4-N1 because lessons #1-40 inherited from #1-#3). Lessons that graduate to cluster primitives go through the cross-project ratification gate at [`process-retro.md`](docs/skills/research-coordinator/cluster/process-retro.md). Single-project lessons stay logged here.

**Audit items queued.** Numbered. Each item has a status. Audit items are where unresolved substrate-shape questions accumulate; the project's end-document consolidates them at close.

**Open data items.** Where unresolved data lives. Re-runs needed, drift gaps, partially-resolved hypothesis tests. Triaged at retro.

**Recap map.** Short. Tells the compile session what to integrate first / defer / escalate. Helps the Coordinator sequence the substrate-fold execution plan.

**Protocol-execution friction.** Numbered. Flows into the process retro. Distinct from § Audit items (which are substrate-shape questions); friction is process-side.

**Termination declaration.** Verbatim from the template. The explicit-stop block is structurally important — makes "did the Assistant actually stop?" answerable from the protocol doc alone.

---

## Brief size

The filter arc's close-out briefs landed at ~5-15 KB each (RP4 was 13 KB). That's the expected scale. Longer than that probably means the brief is trying to be a re-derivation of the protocol doc rather than a structured consumption artifact; refactor toward sharper TL;DR + tighter findings + leave detail in the protocol doc body.

---

## Anti-patterns

- **Do NOT** apply the substrate edits in the Assistant session even if they look trivial. The spec is the contract; the Execution session applies it.
- **Do NOT** drop the termination declaration block. It's the structural mechanism that makes the session's end auditable from the protocol doc.
- **Do NOT** consolidate § Audit items + § New lessons + § Protocol-execution friction into a single "miscellany" section. They have different downstream consumers — audit items go to the next track's protocol, lessons go to the cross-project ratification gate, friction goes to the retro. Conflating them muddies the downstream handoff.
- **Do NOT** include the Assistant-session conversation transcript in the brief. The brief is structured + standalone; the conversation is ephemeral.
- **Do NOT** omit the § Per-pull raw data section because "the analysis section has the medians anyway." The raw data is what lets the compile session verify analysis claims; without it, the brief is unverifiable.

---

## Related primitives

- [`role-discipline.md`](docs/skills/research-coordinator/cluster/role-discipline.md) — the termination declaration block is non-negotiable
- [`sharp-substrate-fold.md`](docs/skills/research-coordinator/cluster/sharp-substrate-fold.md) — § Substrate edit specifications is the fold mechanism
- [`process-retro.md`](docs/skills/research-coordinator/cluster/process-retro.md) — § New lessons + § Protocol-execution friction feed the retro
- [`templates/spawn-prompt-template.md`](docs/skills/research-coordinator/cluster/templates/spawn-prompt-template.md) — section 7 step 8 references this template
- [ADR-0017](docs/adr/0017-research-assistant-architecture.md) § Handoff brief as integration artifact
