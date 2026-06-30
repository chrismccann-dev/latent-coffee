# improve-skill run 01 - brew

**Target:** [.claude/skills/brew/SKILL.md](.claude/skills/brew/SKILL.md) · **Measured:** 210 lines · **Run date:** 2026-06-30 (bootstrap run 1)
**Rubric:** [writing-great-skills](.claude/skills/writing-great-skills/SKILL.md)

## Do this now

Relocate the inline provenance to an HTML comment block and collapse the description to triggers. These two moves alone take the skill **210 -> ~150 lines** with **zero behavior lost** - and every line removed is context load the agent stops paying on every brew turn. `brew` is the daily-driver, so the per-turn saving compounds harder here than anywhere.

The skill is otherwise a model citizen on steering and composition (see Considered-and-kept). The problem is not the design; it is sediment the design accreted.

## Cuts

### Cut 1: description architecture clauses   [COLLAPSE]
- Where: frontmatter `description`, lines 3-11
- Failure mode: no-op (identity already in the body)
- Why: only the trigger list ("brew a coffee", "start a brew", paste a URL / packet) does invocation work. "the migration of claude.ai's start-brew...", "Composes the brewing-assistant operational guide...", "NOT a coordinator/assistant restructure" are identity restated from the body, paid for every turn the description is in context.
- Move to: keep triggers + the one disambiguating reach clause; delete the rest
- Saves: ~5 description lines of permanent context load

### Cut 2: inline provenance   [RELOCATE]
- Where: `PR #450` (41), `the mobile-probe finding (2026-06-09/10)` (133), `added 2026-06-26 after the FanHua / Syrina friction` (181-183), scattered `ADR-0024 §` / `roadmap.md #4` provenance
- Failure mode: sediment
- Why: dates, PR numbers, and incident attributions never change the agent's behavior at runtime; they are maintainer rationale sitting in agent attention every turn.
- Move to: a single `<!-- -->` block at the top (the pattern `writing-great-skills` itself models, and this skill dogfoods - IR2)
- Saves: ~6-8 lines of per-turn load; maintainer keeps every fact

### Cut 3: "MCP-only write path holds"   [COLLAPSE]
- Where: lines 196-201
- Failure mode: duplication (with "Never code-deploy mid-brew", 177-194, which already establishes the write path is `push_brew` + the override/queue path)
- Why: the guardrail section above it already implies MCP-only; restating "no manual DB inserts, no in-app forms" is largely default-obeyed.
- Move to: one clause folded into the guardrail section; the rest to comment
- Saves: ~4 lines

### Cut 4: "Out of scope (do not over-build into roasting's shape)"   [COLLAPSE]
- Where: lines 169-175
- Failure mode: no-op (maintainer-vs-agent, IR5) - at runtime the agent is recording one brew, not deciding whether to build a Coordinator split
- Why: this steers the *maintainer* away from over-building, not the agent mid-brew. The one runtime-load-bearing phrase is "one short session" (anchors the no-durable-Brief discipline).
- Move to: keep "one short session, running-state block, friction log" as a single line; the rest to the comment block
- Saves: ~5 lines

## Considered-and-kept (the leave-alone is half the value)

- **`read_doc_section` composition (lines 91-127).** A naive prune sees "this skill just points at another doc" and inlines it. That would re-create the operational guide and double the maintenance surface. This is progressive disclosure done right - **keep verbatim.**
- **Single-source deferral to `bundled-brewing-completion.md`** for self-roasted detection (lines 60-61, "read its self-roasted detection block for the full signal list"). This is the *opposite* of duplication - it refuses to restate. Keep.
- **Leading-word vocabulary** - `apex`, `layered-evolving`, `reveal the latent / don't inject the absent`, `whole-arc station discipline`, `clarify-side default`, `express-then-clarify`. These recruit real priors from the Latent substrate and anchor behavior in few tokens. Do not "simplify" them into plain prose; that is the no-op-in-reverse.
- **The self-roasted gate (lines 56-87).** A four-way runtime branch with a hard STOP criterion. Load-bearing; the line count is earned. Keep.
- **The running tasting-arc state block (lines 129-154).** Genuine compaction mitigation - it steers the agent at runtime across an idle gap. Steps, not sediment. Keep.

## Open questions

- Cut 4's "Out of scope" doubles as the anchor for [ADR-0024 § Context](docs/adr/0024-lot-coordinator-claude-code-native.md)'s no-bloat decision. Confirm the one-line residual + comment preserves enough that a future session does not re-grow it.
