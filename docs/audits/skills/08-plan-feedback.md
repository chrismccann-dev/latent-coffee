# improve-skill run 08 - plan-feedback

**Target:** [.claude/skills/plan-feedback/SKILL.md](.claude/skills/plan-feedback/SKILL.md) · **Measured:** 141 lines · **Run date:** 2026-06-30 (feedback-pair run 2)
**Rubric:** [writing-great-skills](.claude/skills/writing-great-skills/SKILL.md)

## Do this now

Trim the description (IR3); the body is otherwise almost all load-bearing. **141 -> ~137.** Same IR9 result as its pair: model-invocation is correct and stays (entry is "review the feedback backlog" / "what should we build from the feedback" - natural language). The body is a dense, well-earned planning procedure with a detailed brief spec; it is mostly considered-and-kept (IR8).

## Cuts

### Cut 1: description body-identity   [COLLAPSE]
- Where: frontmatter `description`, lines 3-11
- Failure mode: no-op (identity in body) - per-turn load (model-invoked)
- Why: keep all trigger phrases + the "planning half; intake/routing half is route-feedback" reach clause. Cut the "Reviews the accumulated backlog, clusters related items, prioritizes by recurrence + criticality, and produces a buildable sprint kickoff brief - then hands off to an implementer sub-agent" enumeration (it is the Procedure restated).
- Saves: ~3 lines of always-loaded text

## Considered-and-kept (most of the file)

- **The recurrence-ranking principle (lines 20-24).** "prioritize by what keeps coming up again and again ... recurrence means it's structural, not incidental." This is the skill's core steering principle and Chris's organizing rule, not sediment. The strongest leading idea in the file. Keep.
- **Step 5's kickoff-brief spec + the mandatory "Completion handoff" section (73-104).** Dense (~30 lines) but every line is load-bearing: the brief fields, the grilling-vs-executing distinction, and the loop-closing completion-report shape ("without this section the loop dangles"). A naive prune reads "long step, trim it" - it is the skill's primary output contract (IR4). Keep.
- **The grilling-vs-executing distinction (87-91).** Composes the standing rule correctly; prevents pre-picking implementation on interpretive clusters. Keep.
- **The "Dogfood reference" (135-141).** A calibration example (the Round-19 run, lifecycle-gate cluster ranking highest, claude.ai-client gating correctly ranked out) - IR10 load-bearing, not decorative provenance. Keep.
- **"What this skill does NOT do" (126-133).** Negative-scope steering (don't route raw feedback, don't build interpretive clusters autonomously, don't fabricate clusters). Keep.

## Cross-skill (with run 07) - see [09](docs/audits/skills/09-feedback-pair-cross-skill.md)

Leave-alone (no spine to extract at N=2).

## Open questions

None. No interpretive fork.
