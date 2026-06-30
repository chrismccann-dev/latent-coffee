# improve-skill run 03 - freezer-stock

**Target:** [.claude/skills/freezer-stock/SKILL.md](.claude/skills/freezer-stock/SKILL.md) · **Measured:** 95 lines · **Run date:** 2026-06-30 (bootstrap run 3)
**Rubric:** [writing-great-skills](.claude/skills/writing-great-skills/SKILL.md)

## Do this now

Collapse "The asymmetry" justification and the "Write path" rationale to comments; the structure otherwise stays. **95 -> ~80 lines.** But the *headline* of this run is a leave-alone, not a cut: the fixed **entry-shape template (lines 42-49) is legitimate reference and must not be pruned** - and recognizing that is the rule this run contributes (IR4). Run alongside 01 and 02, this skill also surfaces the family-level boilerplate finding (IR6).

## Cuts

### Cut 1: "The asymmetry (why this is a doc, not the DB)" rationale   [COLLAPSE]
- Where: lines 23-35
- Failure mode: no-op (IR5 maintainer-vs-agent)
- Why: the runtime-load-bearing instruction is "**purchased coffees only**; a self-roasted bean is NOT logged here - redirect." That stays. The surrounding "why brewing is resolution-only / upload-on-resolution / pre-brew convenience cache" is the *why* - maintainer rationale that does not change what the agent does with a bag in front of it.
- Move to: keep the purchased-only rule + redirect as 2 lines; the resolution-only explanation to a `<!-- -->` block
- Saves: ~7 lines

### Cut 2: "Write path" rationale   [COLLAPSE]
- Where: lines 74-81
- Failure mode: no-op (maintainer-vs-agent)
- Why: the runtime-load-bearing parts are "edit the markdown directly" and the **mobile fallback** ("`propose_doc_changes` or hand the block to Chris"). Keep both. "consistent with how living docs are maintained; the MCP-only-input rule governs entities not this lookup doc" justifies the design to a human - it is not an instruction.
- Move to: keep the two operational sentences; the justification to comment
- Saves: ~4 lines

### Cut 3: "Out of scope" self-roasted bullet   [COLLAPSE]
- Where: lines 83-88
- Failure mode: duplication
- Why: "self-roasted beans live in the DB, never logged here" is already the purchased-only gate in Operation A step 1 and in Cut 1's residual. Three statements of one rule. The "what to brew next is parked" + "backfill intentionally not done" bullets are sediment (parked futures / design notes, not runtime instructions).
- Move to: delete the duplicated self-roasted bullet; parked-future + backfill notes to comment
- Saves: ~4 lines

## Considered-and-kept

- **The entry-shape template (lines 42-49) + the Agtron/Status semantics (51-57).** A naive prune reads a fenced block of field labels as "verbose, summarize it." **It is a fixed output contract** - the `brew` skill matches on this exact shape (`## <Roaster> - <Coffee>`, middle dots, the load-bearing whole-bean Agtron). Summarizing it would silently break the consumer. This is legitimate flat reference; **keep byte-for-byte.** (This is the run's IR4 rule: a fixed template or flat rule-set is reference, not bloat.)
- **The two Operations (steps).** Tight, each ends on a "Confirm back to Chris" criterion. Keep.

## Cross-skill finding (IR6) - surfaced only by running 01 + 02 + 03 together

All three operator-direct skills carry the same boilerplate triad, near-verbatim:
1. an **Operator-direct** blockquote ("Not Master-Coordinator-dispatched, not MCP-registered. Chris triggers it directly.")
2. an **Out of scope** section
3. a **MCP-only / Write path** section

Within each file this is single-source; **across the family it is duplication** - the same paragraph maintained in three places, which will drift. Candidate: one shared snippet (a `docs://skills/operator-direct-preamble` or a short shared doc) that each skill points at, the same compose-don't-restate move the bodies already make over their cluster docs. **Do not build it in this report** - name the pattern, defer the build to a gated pass. This finding is the concrete payoff of Chris's "three lived examples" plan: it is invisible auditing any one skill alone.

## Open questions

- Is the shared-preamble snippet worth the indirection for ~3 short blockquotes, or is the cross-skill drift risk low enough to leave as-is? A judgment call for the gated cut pass.
