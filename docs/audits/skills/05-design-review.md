# improve-skill run 05 - design-review

**Target:** [.claude/skills/design-review/SKILL.md](.claude/skills/design-review/SKILL.md) · **Measured:** 134 lines · **Run date:** 2026-06-30 (heavy-skill run 2)
**Rubric:** [writing-great-skills](.claude/skills/writing-great-skills/SKILL.md)

## Do this now

Same shape as run 04 (its sibling): the line-count win is small because the body is almost all load-bearing reference (D1-D8 + the lived run-01 evidence). **134 -> ~129.** The real moves are the description trim (IR3) and the same invocation decision (IR9). The genuinely new contribution of this run is the **cross-skill finding** it co-produces with 04 - the review-family spine (see below + [06](docs/audits/skills/06-review-family-cross-skill.md)).

## Cuts

### Cut 1: description body-identity   [COLLAPSE]
- Where: frontmatter `description`
- Failure mode: no-op (identity in body) - per-turn load (model-invoked)
- Why: keep triggers ("design-review", "visual pass", "audit the UI/design of my surfaces", "where's the visual inconsistency"); cut the "Screenshots each surface at 390+1024, critiques against the project's OWN design system... writes a durable findings report - cross-surface consistency + per-surface walk + considered-and-left-alone + a decisive lead recommendation - then STOPS" enumeration (it is `<what-this-is>` + Step 7 restated).
- Saves: ~3 lines of the only always-loaded text

### Cut 2: `<the-downstream-flow>` triage/execution/walkthrough detail   [RELOCATE - low confidence]
- Where: lines 97-107
- Failure mode: mild sprawl (it is consulted *after* the report, not during the audit the skill runs)
- Why: the 3-phase flow is operator-reference for what happens post-report. It loads on every invocation but is only needed once the report is done. Candidate to push behind a pointer to the worked-example execution log.
- Move to: a one-line pointer to [01-execution-log.md](docs/audits/design/01-execution-log.md) + keep the D1-at-execution sentence inline (it is the load-bearing discipline).
- **Low confidence** - it is short and genuinely useful as the skill's "what comes next" map. Flag, don't force.

## IR9 invocation question (same as run 04)

`design-review` is model-invoked, body says "operator-invoked, no cron." Same orthogonality: operator-invoked (human-not-cron) is compatible with model-invoked (fires on "do a visual pass"). Same decision for Chris: natural-language trigger -> keep + trim; always-types-the-command -> `disable-model-invocation: true`. Decide the pair together (04 + 05 should match - they are the same family with the same usage pattern).

## Considered-and-kept

- **D1-D8 + the run-01 evidence.** Same as run 04's R-rules: the "(run 01: scrollWidth 543 and 471, not eyeballed)", "the phantom mobile active-state... contradicted by the audit's own screenshot" are **calibration examples, not decorative provenance** (IR10) - the phantom-finding story IS the D1 lesson. Keep.
- **The cross-surface-consistency emphasis as a first-class concept.** A naive structural prune might fold it into "Step 3". It is deliberately elevated (it is where 5 of 8 run-01 findings lived). The repetition is intentional steering, not duplication. Keep.
- **Leading words:** "cross-surface consistency", "considered-and-left-alone", "a decision, not a fix", "the preview pass IS the mechanical instrument", "the 390 forcing function". Strong. Keep.

## Open questions

- IR9 invocation decision (decide with run 04 as a pair).
- The review-family spine ([06](docs/audits/skills/06-review-family-cross-skill.md)).

## Applied 2026-06-30

design-review -> **user-invoked** (description stripped) per Chris's IR9 call. The "two guardrails" preview block removed; D1-D8 untouched. Doctrine -> [review-skill-spine.md](.claude/skills/review-skill-spine.md).
