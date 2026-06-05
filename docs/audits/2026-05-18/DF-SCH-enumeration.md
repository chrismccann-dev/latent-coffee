# DF-SCH — Dogfood schema-migration candidates enumeration + sequencing

**Source**: [post-grilling-sequencing.md § B.4 line 498](docs/sprints/post-grilling-sequencing.md) — Sprint 5 kickoff deliverable
**Sprint**: T5 (2026-05-18)
**Decision**: **4 of 5 candidates already shipped earlier today via Schema sprints S1-S4. The 5th has a prompt-level alternative; default = defer schema promotion, ship the prompt-level fix in Sprint 6.**

## Question

Per the master plan, Sprint 5 kickoff was the enumeration point for the 5 DF-SCH candidates surfaced during the roasting-side dogfood. The deliverable shape (per the kickoff brief): a per-CAND table with ship/defer × target sprint × rationale.

The pre-flight check on the database surfaced that 4 of the 5 candidates already exist as live schema, post-migration 055/056/057. T5 inherits a substantially smaller decision surface than the master plan anticipated.

## Pre-flight findings

```sql
-- All 4 columns exist on production schema as of 2026-05-18.
SELECT column_name FROM information_schema.columns
WHERE (table_name='cuppings' AND column_name IN ('wb_agtron','wb_to_ground_delta','sweetness','temperature_behavior'))
   OR (table_name='roasts' AND column_name='is_reference_candidate')
   OR (table_name='roast_recipes' AND column_name IN ('was_backfilled','backfill_notes'));
```

```sql
-- experiments.taste_for_validation_* — NOT present.
SELECT column_name FROM information_schema.columns
WHERE table_name='experiments' AND column_name LIKE 'taste_for_validation%';
-- 0 rows.
```

| CAND | Title | Substrate | Status as of T5 kickoff |
| --- | --- | --- | --- |
| 1 | `cuppings.wb_to_ground_delta` + `wb_agtron` | SCH + UI | **SHIPPED** Schema sprint S1, migration 055 (2026-05-18). Generated column STORED. |
| 2 | `roasts.is_reference_candidate` | SCH + MCP + UI | **SHIPPED** Schema sprint S2, migration 056 (2026-05-18). `patch_roast(is_reference_candidate)` live. |
| 3 | `cuppings.sweetness` + `temperature_behavior` | SCH + MCP + UI | **SHIPPED** Column predates (migration 046 / 2026-05-07); MCP wiring + UI render shipped Schema sprint S3 (2026-05-18). |
| 4 | `roast_recipes.was_backfilled` + `backfill_notes` | SCH + UI | **SHIPPED** Schema sprint S4, migration 057 (2026-05-18). 112 legacy rows marked. |
| 5 | `experiments.taste_for_validation_a/b/c/d` | SCH + MCP + UI | **NOT SHIPPED**. Optional / alternative-only per cleanup queue handoff brief item S5. |

## Sequencing decision

| CAND | Decision | Target sprint | Rationale |
| --- | --- | --- | --- |
| 1 | ✅ Shipped | Done (S1) | No action needed. |
| 2 | ✅ Shipped | Done (S2) | No action needed. |
| 3 | ✅ Shipped | Done (S3) | No action needed. |
| 4 | ✅ Shipped | Done (S4) | No action needed. |
| 5 | ⏸ Defer schema; ship prompt-level alternative | Sprint 6 DF-A13 (prompt-level) | Master plan's "alternative to schema" path is default per cleanup queue brief. See § CAND-5 detail below. |

## CAND-5 detail — prompt-level vs schema

Per [cleanup-queue-handoff-brief-2026-05-17.md § S5](docs/sprints/cleanup-queue-handoff-brief-2026-05-17.md):

> S5 — (Optional, defer or alternative to A #13) `experiments.taste_for_validation_a/b/c/d` text columns: post-cup verification of whether the three taste_for reference points each materialized as predicted. Default: handle via A #13 prompt-level extension instead. Promote to schema if structural treatment preferred after the prompt-level approach is dogfooded.

The structural shape: each V-set slot has up to 3 `taste_for` reference points (producer notes / V_(n-1) memory / specific adjustment). At cup time, each can be verified as materialized-as-expected or diverged. The data shape is one prose paragraph per slot × 4 slots = 4 prose fields per V-set.

Two paths:

**A. Prompt-level (default, Sprint 6 DF-A13)**

`log-cupping.md` STAGE 3 description for `delta_from_cup_*` widened to ask Claude.ai to walk the three taste_for points and note divergence per slot. Output lands in the existing `delta_from_cup_a/b/c/d` text fields. No schema change.

**Pros**: zero schema cost. Reuses existing fields. Validation is prose-shaped, matches roasting-side practice. Honors the ADR-0004-style schema-vs-writing seam decision (some structure stays in prose).

**Cons**: less queryable for cross-V-set "which taste_for points consistently underperform" analysis. Aggregation requires LLM read of prose.

**B. Schema (alternative, post-dogfood promotion)**

Add `experiments.taste_for_validation_a/b/c/d text` columns. MCP wiring on `push_experiment` + `patch_experiment`. UI render on `/green/[id]` cupping view.

**Pros**: each taste_for point's outcome is structured. Cross-V-set aggregation queryable directly. Mirrors the existing `taste_for_a/b/c/d` shape.

**Cons**: 4 new columns × 4 slots = 16 cells per V-set asking to be filled. Increases per-cupping form drag. Many cells likely stay NULL by design (per the schema-vs-writing seam ADR).

## Recommendation

**Ship Path A (prompt-level) in Sprint 6 DF-A13.** Schema promotion is the alternative-only path; promote only if Sprint 6's prompt-level approach surfaces an unmet structural need during Sprints 7-9's dogfood-followup window.

Trigger to revisit:
- Sprint 6 DF-A13 prompt-level extension lands and gets dogfooded for 2-3 V-set close-outs.
- At least one cross-V-set query surfaces ("which taste_for reference points consistently underperform?") that prose-shaped data can't answer.
- Re-evaluate at Sprint 13 (post-roasting-schema-bundle) or earlier if dogfood signal warrants.

## Out of scope for T5

- The Sprint 6 DF-A13 prompt-level extension (lands in Sprint 6 itself, not T5).
- Any schema migration on `experiments` (only triggers if Path B is later chosen).
- Documentation of CAND-1..4 — they're already in CLAUDE.md as shipped substrate.

## Audit-completeness note

The 4 of 5 already-shipped CANDs surfaced because the Schema sprints S1-S4 landed earlier today (2026-05-18), in the same date window as T5 kickoff. The master plan's "Sprint 5 kickoff enumerates" framing assumed CAND-1..5 were all still pending; reality is that 4 shipped first. The audit-completeness verification grep rule (memory `feedback_audit_completeness_verification_grep.md`) caught this — a direct `information_schema.columns` query was the cheap-and-decisive check, vs trusting the master plan's "still pending" framing.

Update upstream: when the post-grilling-sequencing.md master plan is next refreshed (Sprint M sync or Sprint R roadmap review), the DF-SCH-CAND-1..5 entry on line 498 should be collapsed to "DF-SCH-CAND-5 only — CAND-1..4 shipped Schema sprints S1-S4."
