# improve-skill run 09 - the feedback-pair cross-skill check (a deliberate leave-alone)

**Targets:** [route-feedback](.claude/skills/route-feedback/SKILL.md) (142) + [plan-feedback](.claude/skills/plan-feedback/SKILL.md) (141). **Run date:** 2026-06-30
The IR6 cross-skill pass across the feedback pipeline pair. **It resolves to leave-alone** - and that resolution is the value: it shows the rubric discriminates instead of extracting on reflex.

## What they share

- The pipeline-boundary framing (each names the other half: route says "planning half is plan-feedback", plan says "intake/routing half is route-feedback").
- The two surface paths (the master log + `docs/product/feedback-backlog.md`).
- The "operator-initiated, hands off, does not build autonomously" posture.
- A "What this skill does NOT do" section (same *shape*, different *content*).

## Why it stays inline (IR11 applied)

**IR11: the extraction decision is `shared-mass x N`, not N alone.** Both dials point away from extraction here:

1. **N = 2** (the smallest family), vs the review family's N = 3.
2. **The shared mass is small AND non-identical.** Most of what looks shared is each skill describing *its own half* of the boundary from its own side - that is each skill's reach clause, not duplicated doctrine. The "What this skill does NOT do" sections share a heading but not content (route guards against building / changing claude.ai; plan guards against routing / auto-building interpretive clusters). There is no 15-line block of identical doctrine the way the review skills had.

A shared "feedback-pipeline spine" would add a `read_doc` hop to resolve ~5 lines of mostly-not-actually-identical framing. The indirection costs more than the drift it would prevent (the run-03 verdict, here reinforced by the smaller N). **Leave inline.**

## Two confirmations this pair delivers (no new rule - the convergence signal)

- **IR9, keep-direction.** Both skills are model-invoked and that is *correct* - their entire entry is natural language ("process pending workflow feedback", "review the feedback backlog"). The review family taught "don't assume model-invocation is wrong"; this pair shows the other face - when natural-language triggering IS the entry, model-invocation is right and the trigger phrases earn their per-turn load. You would never `disable-model-invocation` here.
- **IR11, leave-direction.** The cross-skill check correctly declines to extract. A rubric that only ever extracted would be a hammer; this one weighs `shared-mass x N` and says no when the math says no.

**No new IR rule.** Runs 07-09 produced only confirmations of IR9 and IR11 - the rubric is converging. After 9 runs across three skill families (operator-direct, review, feedback-pipeline), IR1-IR11 cover what shows up. That convergence is the signal the skill is done hardening, not a gap.
