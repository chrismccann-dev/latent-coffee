# improve-skill run 07 - route-feedback

**Target:** [.claude/skills/route-feedback/SKILL.md](.claude/skills/route-feedback/SKILL.md) · **Measured:** 142 lines · **Run date:** 2026-06-30 (feedback-pair run 1)
**Rubric:** [writing-great-skills](.claude/skills/writing-great-skills/SKILL.md)

## Do this now

Trim the description (IR3) and the historical-backstory intro (IR5). **142 -> ~134.** The notable result is what this run does NOT find: **model-invocation is correct here and stays** - the validation of IR9 in the *keep* direction. This skill's entire entry is natural language ("process pending workflow feedback", a pasted "Feedback for Claude Code" block); the agent must recognize those, so the description's trigger phrases are the firing mechanism and earn their per-turn load. Unlike the review family, you would never want to `disable-model-invocation` here.

## Cuts

### Cut 1: description body-identity   [COLLAPSE]
- Where: frontmatter `description`, lines 3-12
- Failure mode: no-op (identity in body) - per-turn load (model-invoked)
- Why: keep **every trigger phrase** (they are the firing mechanism on a genuinely model-invoked skill - IR3 trims identity, never triggers) + the "intake half; planning half is plan-feedback" reach clause. Cut the "It splits the paste... records... points... auto-filing safe classes, confirming risky ones" enumeration - that is the Procedure restated.
- Saves: ~3 lines of always-loaded text

### Cut 2: historical-backstory intro   [COLLAPSE]
- Where: lines 17-21
- Failure mode: sediment / maintainer-vs-agent (IR5)
- Why: "Historically that prose all dead-ended in one memory file as append-only 'Rounds,' so real signal rotted: a recurring friction looked the same as a one-off..." motivates the skill to a human reader. The runtime-load-bearing point (take the block apart, route each item so signal compounds via dedup) survives in one sentence + is already the leading principle of step 4.
- Move to: one sentence; drop the rotted-Rounds backstory
- Saves: ~3 lines

## Considered-and-kept

- **The routing taxonomy table (lines 65-76).** The core decision substrate - a flat reference set (every item-shape -> home -> auto/confirm on one rung). A naive prune sees a big table; it is exactly the load-bearing reference (IR4). Keep.
- **The worked Example (lines 127-142).** A calibration example of the auto-vs-confirm + dedup judgment (IR10) - routing is judgment-heavy, and the example is how the agent calibrates it. Inline-and-short is the right home (loaded on invocation, when it's needed). Keep.
- **The leading words:** "dedup is the point", "recurrence over append", "auto-route the safe classes / stop and confirm the risky ones", "practice-to-substrate". Strong. Keep.
- **"What this skill does NOT do" (118-125).** Genuine negative-scope steering (don't build, don't change the claude.ai side, don't duplicate terminal-home items) - the agent can over-act here without it. Keep.

## Cross-skill (with run 08) - see [09](docs/audits/skills/09-feedback-pair-cross-skill.md)

The IR6 check across the feedback pair resolves to **leave-alone** (N=2, small non-identical shared mass). Documented in run 09.

## Open questions

None. No interpretive fork (model-invocation stays; cuts are mechanical trims).
