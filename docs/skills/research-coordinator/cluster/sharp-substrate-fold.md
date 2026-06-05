# Sharp substrate-fold — context firewall between research surface and operational substrate

**Status:** Load-bearing principle
**Origin:** Filter-arc retrospective (post-RP4 close-out, 2026-05-26)
**Locked in:** Research Assistant Step 2 scaffolding (Step 1 grilling, 2026-05-26)

---

## The principle

Research projects generate a lot of substrate. The filter arc produced:

- 4 closed protocol docs (~2100 lines total)
- ~49 substrate-extraction lessons (P1: 19, P2: +/-, P3: 20, RP4: 9 — numbering ratcheted across the arc)
- ~23 audit items (P2 AI-1 through RP4 AI-7)
- 2 ADRs (0015 + 0016)
- Roughly half a dozen registry-shape proposals queued for implementation

If all of that flowed outward into operational substrate (claude.ai-loaded clusters, registries, ADRs), the operational layer would collapse under its own weight. Chris's standing anti-context-bloat principle would be violated immediately. CLAUDE.md alone is already ~114 KB and under the 120 KB tripwire by ~6 KB.

The Research Coordinator acts as a **context firewall** between rich research surface and lean operational substrate. What folds outward must be **sharp, pointed, and data-backed**. What stays inward must stay inward.

---

## What folds outward (sharp substrate)

The filter arc concrete example:

| Item | Folds to | Why |
|---|---|---|
| `FilterEntry` schema change (new `flowRateContexts` + `paperFamily` + `productCode` + `paperShapeRetention` fields, extended `bedBehaviorUnderLoad` enum) | `lib/filter-registry.ts` + ADR-0015 / 0016 | Schema is queried by Brewing Assistant + Brew Recorder; lives where they consume it |
| `BoosterEntry` registry seed (3 owned Sibarist Boosters) | `lib/booster-registry.ts` (new file) | New canonical registry mirroring the brewer/filter/grinder/sworks pattern |
| Per-paper measured-drawdown reference (Project #1 / #2 / #3 / RP4 tables) | `docs/skills/brewing-equipment-expert/cluster/filters.md` | Brewing Assistant consults this surface during recipe construction |
| Family-conditional flow-rate classification framework | ADR-0016 | Architectural decision; informs query interpretation across the codebase |
| Inventory hygiene corrections (5 owned-flag drifts caught by Step 0) | `lib/filter-registry.ts` + cluster doc | Drift in canonical registry must converge to truth |

All of these are pointed: a named field, a named registry, a named cluster doc, a named ADR. The fold operates on the substrate at the level the substrate already operates at (one field, one row, one section), not as a paste of the full research record.

## What stays inward (rich research surface)

Filter arc concrete examples that DO NOT fold outward:

| Item | Stays at | Why |
|---|---|---|
| The full 19 lessons of Project #1 | `docs/research-projects/cone-filter-drawdown.md` | Lessons live with their data; only ones that fire in a second project graduate to a cluster primitive |
| The full 20 audit items spawned by Projects #2 + #3 | The respective protocol docs | Audit items are project-internal until they're either resolved or escalated to ADR |
| Mid-run hypothesis-test transcripts | The protocol doc's Notes section | Reasoning chain is archival, not operational |
| The Δ-in-deltas cross-project analysis methodology | This cluster doc + RP4 protocol doc | Analytical pattern, not substrate the brewing/roasting layer queries |
| Pre-stated predicted outcomes that turned out wrong | The protocol doc's hypothesis-test resolution column | Failed predictions are the load-bearing payload of the research — they belong with the data |
| Friction captures from protocol execution | The protocol doc's friction section | Process-side feedback for the retro; not consumed by anyone else |

All of these are rich, narrative, multi-paragraph. None of them belong in a place where Brewing Assistant or Roasting Assistant or any other operational sub-skill loads context from. They live in the research archive (`docs/research-projects/`) + this cluster, accessible by reference from the Coordinator when designing future tracks but never bulk-loaded outward.

---

## Why this matters

Three failure modes the firewall guards against:

1. **Single-project over-generalization.** Filter-arc Lesson #36 (paper "self-choke" is paper-brewer-INTERACTION not paper-fiber-intrinsic) was framed as "deepest insight of arc" at Project #3 close-out. RP4 partially contradicted it (CAFEC family retains paper-fiber signal even when paper-brewer-fit is eliminated). If Lesson #36 had folded outward at Project #3 close (into Brewing Equipment Expert cluster as a binary universal rule), RP4 would have had to issue a substrate retraction. Instead Lesson #36 stayed inside the research surface until RP4 refined it; only the family-conditional refined version folded outward (as ADR-0016). The fold gate caught the over-generalization.

2. **Context bloat at the consumption layer.** If every lesson + audit item + hypothesis-test friction-capture flowed into a cluster doc that claude.ai loads via MCP, the operational layer would grow ~5-10 KB per project. Within 5 projects, the operational layer would breach the 120 KB tripwire. The fold gate keeps research-surface size from propagating into operational-surface size.

3. **False precision on partially-baked findings.** Research projects regularly produce findings that have one of: shaky measurement precision, small sample size, geometry-confound, single-operator bias. Folding those into operational substrate before cross-project ratification (the "fires in a second project" gate at [`process-retro.md`](docs/skills/research-coordinator/cluster/process-retro.md)) makes the operational layer carry false-confidence claims. The firewall is the cross-project ratification gate's structural complement.

---

## The fold mechanism

For each track close-out, the Coordinator produces a **scoped execution plan** (one of the Coordinator's canonical outputs). The plan enumerates specifically which substrate edits the handoff brief specifies. Each edit:

- Names a file path (e.g. `lib/filter-registry.ts:LINE_X`, `docs/skills/brewing-equipment-expert/cluster/filters.md`)
- Names the exact change (add field, update measurement, add ADR pointer)
- Cites the data source (the handoff brief section, the specific lesson or audit item)
- Has a fresh-context-readable rationale (the execution session won't see the prior conversation)

The execution session reads the scoped plan and applies it. Nothing else gets edited. The plan is the contract.

If the Coordinator finds itself drafting an execution-plan item that doesn't have a clear name-the-field-name-the-value shape, that's a signal the item is NOT ready to fold outward — it stays as a research-cluster doc, a roadmap follow-up entry, or a deferred audit item.

---

## Coordinator-side discipline

The Coordinator's working context should NOT carry full handoff briefs past their integration moment. The brief's job is to ratify substrate edits + queue audit items + populate the project end-document. Once those are done, the brief's detail belongs in the protocol doc (already there per Project #2 Lesson #12) and not in the Coordinator session's active context.

In practice: when the operator pastes a handoff brief into the Coordinator session, the Coordinator extracts substrate edits → scopes the execution plan → updates the project end-document → updates the roadmap → and then drops the brief detail from active reasoning. The protocol doc remains canonical; the Coordinator references it by pointer, not by re-loading.

---

## Related primitives

- [`role-discipline.md`](docs/skills/research-coordinator/cluster/role-discipline.md) — three-role split that makes the firewall structurally enforced
- [`process-retro.md`](docs/skills/research-coordinator/cluster/process-retro.md) — cross-project ratification gate; primitives graduate from research surface to cluster doc only on second-project confirmation
- [`roadmap.md`](docs/skills/research-coordinator/cluster/roadmap.md) — where unfolded findings get queued (Side quests / Extensions of completed) if they aren't ready to fold outward yet
- [ADR-0017](docs/adr/0017-research-assistant-architecture.md) § Sharp substrate-fold discipline
