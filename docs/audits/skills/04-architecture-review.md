# improve-skill run 04 - architecture-review

**Target:** [.claude/skills/architecture-review/SKILL.md](.claude/skills/architecture-review/SKILL.md) · **Measured:** 189 lines · **Run date:** 2026-06-30 (heavy-skill run 1)
**Rubric:** [writing-great-skills](.claude/skills/writing-great-skills/SKILL.md)

## Do this now

Two things, and **neither is a line-count cut** - that is the headline. This is a mature, dense, deeply-earned skill; ~170 of its 189 lines are load-bearing reference (the R1-R13 rules, the smell taxonomy, the leading-word system) and belong in `Considered-and-kept`. The wins are:

1. **Trim the description (IR3).** It carries ~50 words of body-identity ("Like /simplify but repo-wide... finds duplication-at-distance, large mixed-concern files, weak type boundaries... emits a decisive lead recommendation + candidate cards + a considered-and-rejected list + a dependency sequence"). That enumeration is restated from the body and is the **only part of this skill loaded every turn** (it is model-invoked). Cut to triggers + a one-line what-it-is.
2. **Resolve the invocation question (IR9) - this is a real open decision, not a cut.** See below.

Honest budget delta: **189 -> ~183.** A skill that is mostly lived rules barely shrinks, and that is correct (IR8).

## The invocation question (IR9 - the rule this run teaches improve-skill)

The skill's body says "operator-invoked" ~6 times and "no cron, no feature-ship coupling." A naive rubric pass reads that and flags: "operator-invoked but no `disable-model-invocation: true` - it's paying per-turn context load for nothing, make it user-invoked." **That flag would be wrong**, and the reason is the rule:

- **"Operator-invoked" (Latent's vocabulary) = triggered by a human, not by a cron / feature-ship hook.** It is the *automated-vs-human* axis.
- **"User-invoked" (the rubric's vocabulary) = `disable-model-invocation: true`, description stripped from the agent.** It is the *who-can-fire-it* axis.

These are **orthogonal.** A skill can be operator-triggered *and* model-invoked - which is exactly what this skill is, and on purpose: the description's "Use when Chris says 'audit the architecture of X', 'where's the duplication in Y'" means the agent fires it from **natural language**, the same way `brew` fires on "brew a coffee." That natural-language convenience is the *benefit* the per-turn description load buys.

So the genuine question is not "operator-invoked, why model-invocable?" It is: **does Chris reach this skill by natural language ("audit the architecture of the green page"), or does he always type the exact `/architecture-review` command?**
- If natural language -> keep model-invoked; the description load is the price of triggering, trim it per IR3 but don't disable.
- If he always types the command -> `disable-model-invocation: true` strips a long description from every turn at zero cost to his workflow.

**Open question for Chris.** (My read: you do use natural-language framings in these sessions, so keep it model-invoked + trim the description. But it's your call.)

## Cuts

### Cut 1: description body-identity   [COLLAPSE]
- Where: frontmatter `description`
- Failure mode: no-op (identity in body) - per-turn load
- Why: keep the triggers ("architecture-review <surface>", "audit the architecture of X", "where's the duplication in Y", "scope a refactor"); cut the "Like /simplify but... finds A/B/C/D/E, then emits F/G/H/I" enumeration (it is the body's `<what-this-is>` restated).
- Saves: ~3-4 lines of the only always-loaded text

### Cut 2: worked-example-corpus compression   [COLLAPSE]
- Where: lines 169-180
- Failure mode: mild duplication (each bullet restates what its audit file already says)
- Why: the six bullets each carry a paragraph of detail that lives in the audit file itself. Compress to one tag-line each ("01 - duplication-at-distance + adoption gap; read when auditing a page family") and let the pointer do the work.
- Saves: ~5 lines · **lower-confidence** - the one-line smell-tag has real routing value; cut only if it stays a usable index.

## Considered-and-kept (this is ~90% of the value here)

- **The R1-R13 rule system + the smell taxonomy table (the bulk of the file).** A naive prune sees "189 lines, sprawl" and starts trimming. **Every R is a lived friction-correction with a citation that is its warrant.** The numbering is itself a leading-word system (each `R6` is a compact handle the skill and its runs think with). Cutting here destroys the calibration the skill exists to carry. **Keep wholesale.**
- **The inline session-citations - and the rule they teach (IR10).** This skill is full of "(02: 1,400->2,098)", "Session 03: docs.ts 1342 -> refactor; brew-import.ts 1459 -> keep", "PR #427". The provenance-delete policy (IR2) does **NOT** apply to these. They are not decorative dates - they are **the evidence that makes each rule credible, and the calibration examples are the lesson itself** (the docs.ts-vs-brew-import contrast IS how you learn logic_loc-not-raw-LOC). Decorative provenance gets deleted; evidence-citation and calibration examples are load-bearing reference. **Keep.** (This distinction is the rule run 04 hands to improve-skill - see [improvement-log IR10](docs/audits/skills/improvement-log.md).)
- **The leading-word vocabulary** (deletion test, extraction test, depth, seam, "risk gates not subtracts", duplication-at-distance). Recruits real priors; anchors behavior in few tokens. Keep.
- **The XML-tag structure.** `<what-this-is>` / `<the-process>` / `<doc-substrate-mode>` / `<stop-condition>` - legitimate co-location, each a coherent unit. Not sprawl. Keep.

## Open questions

- The IR9 invocation decision above (Chris's call).
- The cross-skill spine shared with `design-review` (and `improve-skill` itself) - see [06-review-family-cross-skill.md](docs/audits/skills/06-review-family-cross-skill.md). Do not resolve here in isolation.

## Applied 2026-06-30

architecture-review -> **user-invoked** (`disable-model-invocation: true`, description stripped to a one-liner) per Chris's IR9 call - it runs on a routine + by hand, not from natural language. The "two guardrails" preview block (which duplicated R8/R13 *and* the spine) was removed; R1-R13 untouched. The shared doctrine now lives in [review-skill-spine.md](.claude/skills/review-skill-spine.md) (IR11). IR9 + IR10 folded into `improve-skill`.
