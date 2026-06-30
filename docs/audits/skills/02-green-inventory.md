# improve-skill run 02 - green-inventory

**Target:** [.claude/skills/green-inventory/SKILL.md](.claude/skills/green-inventory/SKILL.md) · **Measured:** 81 lines · **Run date:** 2026-06-30 (bootstrap run 2)
**Rubric:** [writing-great-skills](.claude/skills/writing-great-skills/SKILL.md)

## Do this now

Collapse the "Write path (MCP-only, like everything else)" section into a comment and trim "Out of scope" to its one disambiguating line. **81 -> ~68 lines.** This is a *cleaner* skill than `brew` - the two numbered Operations are tight, well-scoped steps - so the delta is smaller and the headline finding is a method one: most of what is prunable here is **maintainer rationale wearing runtime-instruction clothing (IR5)**, which only became legible by asking the maintainer-vs-agent question section by section.

## Cuts

### Cut 1: "Write path (MCP-only, like everything else)"   [COLLAPSE]
- Where: lines 62-68
- Failure mode: no-op (IR5 maintainer-vs-agent) + duplication
- Why: both Operations already *call* `push_green_bean` / `patch_green_bean` (steps 5, 2-3). The section restates "MCP-only, no manual DB inserts, no in-app forms" - which the agent obeys by default once the steps name the tools. The single non-obvious fact is load-bearing: **`roast_priority` is only ever written here, never at `push_green_bean` time.** Keep that one sentence (it is genuine runtime steering); the rest is maintainer rationale.
- Move to: fold the `roast_priority`-write-discipline sentence into Operation A step 5; the MCP-only restatement to a `<!-- -->` block
- Saves: ~6 lines

### Cut 2: "Out of scope (don't grow into the roast arc)"   [COLLAPSE]
- Where: lines 70-74
- Failure mode: no-op (maintainer-vs-agent) + sediment
- Why: the first bullet (roasting a lot is the Coordinator) is real disambiguation the agent can act on - **keep one line.** The roasted-bean bullet duplicates the freezer-stock boundary already drawn elsewhere; the "what to brew next is parked" clause is sediment (a parked future, not a runtime instruction).
- Move to: keep one line ("stops at: lot is in inventory and ranked - roasting it is the Coordinator's `start a new lot`"); the rest to comment
- Saves: ~4 lines

### Cut 3: description composition clause   [COLLAPSE]
- Where: `description`, lines 8-11 ("Composes the roasting-coordinator inventory-rerank doctrine (ranked-top + banded-tail roast_priority) over list_green_inventory + push_green_bean + patch_green_bean")
- Failure mode: no-op (identity in body)
- Why: the trigger list + the "NOT the full per-lot roast arc" disambiguator do the invocation work. The "Composes ... over <tool list>" clause is body identity. **Keep the "NOT" clause** - it is a genuine negative trigger that stops this skill firing on "start a new lot."
- Move to: delete the composition clause; keep triggers + the NOT clause
- Saves: ~2 description lines of per-turn load

## Considered-and-kept

- **"The ranking model (one-paragraph recap)" (lines 29-37).** Reads like a candidate for "it's in the doctrine, cut it" - but it is the one piece of reference the agent needs *inline* to reason the stack-rank without a second fetch on the hot path. Legitimate in-skill reference (the ranked-top + banded-tail leading model). **Keep.**
- **The two numbered Operations (steps).** Tight, checkable, each ends on a "Confirm back to Chris" completion criterion. No premature-completion risk. Keep.
- **Composition of `inventory-rerank.md`** via "read that doc in full at the start." Compose-don't-restate, correct. Keep.

## Open questions

- The "Operator-direct, like the roasting coordinator + brew" blockquote (line 21) recurs across all three operator-direct skills. Flagged for the cross-skill pass (IR6) - do not cut it here in isolation.

## Applied 2026-06-30

81 -> **72**. IR6 resolved: no shared snippet (indirection cost > drift risk on a 2-line blockquote); the blockquote stays inline, identically worded. The "Write path" section was deleted outright (the `roast_priority`-write discipline already lives in Operation B step 2 - it was pure duplication). See [improvement-log § Decisions](docs/audits/skills/improvement-log.md).
