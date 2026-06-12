# ADR-0023: The self-improving skill loop

**Date:** 2026-06-05 · **Status:** Accepted (pattern named) — universal implementation **deferred** (bottom-up graduation)

This is the concrete answer to a question Latent was founded on but never made precise: *what does "a compounding system that self-learns over time" actually mean?* Named in the post-Cluster-B roadmap brainstorm (2026-06-05) once the same shape had been built five times under five names. It is the **process-level** loop (how the *skills / prompts / surfaces* that operate on the substrate get better); distinct from the substrate-level **System self-improvement loop** (how Latent's *data* compounds — brews/roasts sharpening the next one).

## Decision

Name the pattern now; **do not build a universal "self-improvement skill" yet.** Every agentic skill/surface we build should be *consciously built to* this shape, but the universal meta-skill (every skill invokes it) **graduates only after the full loop has run end-to-end ≥3 times across different surfaces** — per the [graduation threshold](0022-formalization-tax-and-self-improvement-counterbalance.md). This decision *is* the graduation threshold applied to itself: we've seen the pattern in *parts* many times, but not yet as a *whole loop* three times (architecture-review is instance 1 and has not yet run a single improvement cycle). Naming is cheap and earned; building the universal skill is expensive and not yet earned.

## The shape

A **spine** with **two gated loops** wrapped around it.

**The spine** (the coordinator/assistant execution structure — generalizes [ADR-0017](0017-research-assistant-architecture.md)):
```
invoke skill → PLAN session generates a plan
  → handoff packet → EXECUTE session (separate thread) runs the plan
  → handoff packet → back to the PLAN session
  → PLAN session records a summary (plan + execution + how it went)
```

**Loop 1 — improvement (ADD).** Each run emits improvement-suggestions + open questions; when the same improvement recurs **≥3 times** ([graduation threshold](0022-formalization-tax-and-self-improvement-counterbalance.md)) it graduates into the skill. The skill compounds.
- **Anti-lawyer-redline safeguard (load-bearing).** An improvement counts *only* if it genuinely reduces friction toward the skill's **one goal** and is recurrence-gated — never a nice-to-have, never work-to-look-busy. The failure mode being guarded against: a self-improvement loop, like a lawyer paid by the redline, will manufacture suggestions to justify itself ("no lawyer ever says 'it's all good, thumbs up'"). The point is to make the skill **better, not bigger.** This is the formalization tax applied to the improvement-suggestions themselves — a suggestion is a proto-formalization, so it must earn its place. Generalizes the `propose_doc_changes` "only genuine, cited improvements" discipline.

**Loop 2 — compaction (clawback).** When the skill (+ its associated resources) hits a **trigger** (e.g. `check:doc-sizes`), fire a **multi-perspective arbitration** ([arbiter-shaped](0022-formalization-tax-and-self-improvement-counterbalance.md)) → a compaction_plan (any of the six pruning shapes — archive / extract / split / consolidate / delete / re-home — or **re-architect into sub-skills**) → execute (separate thread) → record. Keeps the skill lean against the formalization tax that Loop 1 accrues. **Loop 2 is itself improvable** (its own plan→execute→record→improve applies recursively).

- **One skill, one job.** A skill found to be doing *more than one job* is a **decompose / re-architect** candidate (split into sub-skills, each doing one job, invoking the next). Surface it at a trigger or a whole-flow rethink — **not proactively.** Live example: `log-cupping.md` does more than insert cupping rows (it also designs V_(n+1) inline), flagged for the Lot Coordinator brainstorm.

**Outside both loops:** a genuine **bug** or a **structural fix whose cost grows if you wait** (missing headings, not section-readable) is handled directly at N=1 — the act-now tier of the graduation threshold — not deferred into the loop.

## Open question (do not decide yet — needs lived examples)

**Is the loop *both layers always*, or *spine-required + self-improvement-meta-layer opt-in*?** A thin procedural skill that always does its one job correctly with no friction (the cupping-insertion case, *if* it never accrues corner cases) may never fire Loop 1 or Loop 2 — so forcing the meta-layer onto it could be untaxed formalization. Chris's inclination (2026-06-05): **both layers**, but explicitly **deferred** until lived examples show whether thin procedural skills genuinely benefit from the meta-layer or just carry its weight. Resolve at the graduation point (after ≥3 full-loop instances).

## Instances (the accumulating evidence)

The pattern is already built, in parts, five times — which is *why* it earned naming but *not yet* universal implementation (the parts ≠ the whole-loop ≥3×):
- **Feedback pipeline** ([ADR-0020](0020-feedback-handoff-pipeline.md)) — route→plan→execute→completion-report-back: the spine + Loop 1.
- **Doc-pruning** ([ADR-0013](0013-self-improvement-primitives.md) Pattern J / [ADR-0022](0022-formalization-tax-and-self-improvement-counterbalance.md)) — Loop 2 (the clawback), run 7×.
- **Architecture-review** — spine + Loop 1; **instance 1 of the full loop. First improvement cycle run 2026-06-12** ([cycle record](../audits/architecture/improvement-log.md)) — evidence: 6 audits, 27 candidates, 13 shipped across 5 remediation PRs, zero recorded misses; 6 evidence-cited amendments, 4 suggestions deferred to the recurrence ledger; Loop 2 checked, not triggered.
- **Research Coordinator + Research Assistant** ([ADR-0017](0017-research-assistant-architecture.md)) — the spine.
- **Lot Coordinator + V-Set Assistant** ([brainstorm](../features/lot-coordinator-brainstorm-2026-06-02.md)) — the spine; **the next deliberate instance (instance 2), built as a conscious worked example of this pattern, not a bespoke roasting thing.**

## Sequencing

1. **Now:** pattern named (this ADR). Build guidance: when building a new agentic surface, give it the spine + a self-improving *component* — **without all the bells and whistles** — and let it grow.
2. **Accumulate:** let architecture-review run its first real Loop-1 + Loop-2 cycle (instance 1 maturing); build Lot Coordinator as instance 2; get a third (feedback pipeline maturing, or a third skill).
3. **Graduate:** once the full loop has run end-to-end ≥3 times across surfaces, graduate the universal "self-improvement skill every skill invokes" — shaped by the lived edge cases, including the resolution of the open question above.

End state Chris named: this loop applied to **every** surface — claude.ai, roasting, brewing, design, product, documentation, the product-build process, Claude-Code-as-a-system, the Latent system — so every surface gets better over time, while the clawback half keeps the formalization tax in check.

## Amendment 2026-06-12 — loop-record convention (minted at instance 1, cycle 1)

Each improvement cycle records as a dated entry in an **`improvement-log.md`** sibling to the skill's worked-example corpus (architecture-review: [docs/audits/architecture/improvement-log.md](../audits/architecture/improvement-log.md)). The entry carries: the evidence base, a scorecard of the skill's lived record, the amendments made (each citing the finding or miss that motivated it), a **considered-and-rejected suggestion ledger with recurrence counts** (the anti-lawyer-redline safeguard made auditable — deferred suggestions accumulate there toward the N=3 graduation instead of vanishing between cycles), a Loop-2 trigger check (checked, not skipped), and the next-cycle trigger. Minted at N=1 deliberately under the act-now tier: an unrecorded cycle's evidence decays immediately (structural-fix class), and the convention is itself provisional — instances 2-3 may reshape it when their cycles run.

## Relationship to the other ADRs

[ADR-0022](0022-formalization-tax-and-self-improvement-counterbalance.md) is the *why* (the formalization tax + its two mechanisms); [ADR-0013](0013-self-improvement-primitives.md) is the *what* (the self-improvement patterns A-J); [ADR-0017](0017-research-assistant-architecture.md) is the *spine* (coordinator/assistant). **This ADR is the *whole machine*** — the spine + both gated mechanisms assembled into one repeatable loop, plus the safeguards (anti-lawyer-redline; one-skill-one-job) that keep it honest.
