# improve-skill run 06 - the review-family cross-skill finding (IR11)

**Targets:** [architecture-review](.claude/skills/architecture-review/SKILL.md) (189) · [design-review](.claude/skills/design-review/SKILL.md) (134) · and, implicated, [improve-skill](.claude/skills/improve-skill/SKILL.md) itself. **Run date:** 2026-06-30
**Surfaced only by running 04 + 05 together** (the cross-skill pass, IR6) - invisible auditing either alone. This is the heavy-skill analog of the operator-direct boilerplate triad (run 03), but a **closer call**, and that closeness is the lesson.

## The finding

`architecture-review` and `design-review` are structurally near-isomorphic. They share a **review-skill spine** - not a 2-line blockquote (run 03's case) but ~15-20 lines of substantial parallel invariants, each restated in both:

| Shared invariant | arch-review | design-review |
|---|---|---|
| "two guardrails that define the skill's character" | R8 / R13 | D6 / D8 (explicitly "same shape as arch-review's R8/R13") |
| "Hard rules, non-negotiable: 1. READ-ONLY. Stop at the report. Never edit." | ✓ | ✓ (near-verbatim) |
| "Re-measure the seed (the brief is a hypothesis, not a finding)" | R1 / Step 0 | D1 / Step 0 |
| Mandatory considered-and-rejected / considered-and-left-alone | R8 / Step 6 | D6 / Step 6 |
| Decisive lead recommendation, "the push is in the recommendation, not the keyboard" | R13 / Step 8 | D8 |
| `<stop-condition>` "stops at the report. Do not edit code." | ✓ | ✓ |
| `<verification-and-safety-net>` "Latent has no test suite - the net is..." | ✓ | ✓ |
| `<relationship-to-the-rest>` "Sibling of...; Compose, don't duplicate" | ✓ | ✓ |

And **`improve-skill` is the third instance** - it too restates "stops at the report, never edits the target skill," "mandatory considered-and-kept," "decisive lead recommendation," the two-guardrails framing. The family is three skills deep, all repeating the same review-skill doctrine.

## Why this is a closer call than run 03's blockquote (the IR11 rule)

Run 03 resolved *against* extraction: a shared snippet for a 2-line blockquote cost more in indirection than the drift saved. **Here two dials point the other way:**
1. **Shared mass is large** (~15-20 lines, not 2). The indirection cost is amortized over much more content.
2. **N = 3, not 2** (arch-review, design-review, improve-skill). The architecture-review "extract on the third copy" dial has fired.

So the IR6 mechanic doesn't auto-resolve by the run-03 precedent. **IR11: the extraction decision is `shared-mass x N`, not N alone.** A large spine repeated 3x can earn a shared home where a tiny one repeated 3x does not.

## The candidate (named, NOT built - report stops here)

A `review-skill-spine` reference (a short doc, or a section of `writing-great-skills`) holding the family invariants once:
- READ-ONLY, stop at the report, never edit (the push is in the recommendation).
- Re-measure the seed first; the brief is a hypothesis.
- A considered-and-kept/rejected/left-alone section is mandatory.
- A decisive lead recommendation; take a side on what survives the gates.
- Compose sibling skills, don't restate them.

Each review skill points at it and adds only its *domain-specific* rules (arch-review's R-rules, design-review's D-rules, improve-skill's IR-rules). The spine is the genus; each skill is the species.

## Counter-argument (the considered-and-kept on the finding itself)

- **The restatements are short relative to each skill's total** (the spine is ~10% of arch-review). Each skill is independently legible today; a reader never needs to chase a pointer to understand it. Extraction trades that self-containment for single-source-of-truth.
- **The domain rules vastly outweigh the spine.** R1-R13 / D1-D8 / IR1-IR11 are where the real content lives, and those are *not* shared. We would be DRY-ing the cheap 10%, not the expensive 90%.
- **Indirection on the hot path.** All three are loaded when invoked; a pointer adds a `read_doc` to resolve the spine mid-run.

## Recommendation

**Lean toward extracting the spine, but it is genuinely Chris's call** - this is the one finding across runs 01-06 where I would not just ship it under the autonomy rule. It changes three skills at once and trades self-containment for DRY. My read: at N=3 with a 15-line shared mass and an active "improve-skill will keep auditing these" loop, the drift risk (improve the stop-at-report doctrine in one, the other two rot) is now the dominant cost - so extract. But if you value each skill reading standalone, leave it and accept the triplication. **Decide before the run-04/05 cuts land**, since "trim the description" is independent but "extract the spine" reshapes all three.

## Rules this run hands to improve-skill (to fold in after Chris's review)

- **IR9** - "operator-invoked" (human-vs-cron) is orthogonal to "user-invoked" (`disable-model-invocation`). Don't flag model-invocation as wrong on a skill whose body says operator-invoked; ask instead whether natural-language triggering earns the description's per-turn load.
- **IR10** - IR2 (provenance-delete) is for *decorative* provenance only. An evidence-citation that warrants a rule, or a calibration example that *is* the lesson (Session 03's docs.ts-vs-brew-import), is load-bearing reference - keep it.
- **IR11** - the cross-skill extraction decision is `shared-mass x N`, not N alone. A large spine repeated 3x can earn a shared home that a 2-line preamble repeated 3x cannot.

## Applied 2026-06-30

Chris chose **extract**. [review-skill-spine.md](.claude/skills/review-skill-spine.md) created (the five invariants + the genus/species framing); arch-review, design-review, and improve-skill each point at it and keep only their domain rules. The duplicated "two guardrails" preview blocks were removed from all three. IR9-IR11 folded into improve-skill. Each skill still reads standalone (the considered-and-kept caution honored - only the doctrine *restatement* moved, never the domain rules).
