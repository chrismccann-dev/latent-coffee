# improve-skill run 10 - `brew` (second run, pre house-style simplification)

**Target:** [.claude/skills/brew/SKILL.md](.claude/skills/brew/SKILL.md) · 224 lines (re-measured; run 01's post-cut floor was 199, the skill grew +25 since via the 2026-07-22 connector-recovery recipe, the freezer-lookup MCP procedure, and the 2026-10-06 house-style bullet). Run as the read-only audit the `/brew` process-simplification brief ([grilling-2026-10-06-house-style.md § Kickoff brief](docs/sprints/grilling-2026-10-06-house-style.md)) requires before execution.

**Do this now:** collapse the arc section onto the house-style flow and single-source the freezer-lookup procedure in the operational guide's Step 1 (the skill and `start-brew.md` carry it verbatim today). **224 -> ~190 lines** (sum of cuts below; the gate, state block, close retro, and build-hygiene guardrail are kept).

## Four-axis pass

**Trigger.** Model-invoked is correct (IR9 keep-direction: "brew a coffee" is the natural-language entry, and no one types `/brew` on mobile). Description is tight: one trigger per branch (verbal / URL / packet) + the write-scope clause. No change.

**Structure.** Steps are: self-roasted gate -> Step 1 -> Step 2 -> Step 3 -> completion -> close retro. Composition via `read_doc_section` is done right. The failure is in *what* Step 1 and Step 2 steer toward: the arc still names "Run 1a-1d", "pause at 1d for strategy + modifier confirmation", "after strategy is confirmed", i.e. the six-strategy design-from-scratch flow, while the apex-inheritance section above it already says "do not design from zero". Two sections contradict each other on the same page.

**Steering.** Leading words that earn their keep: `apex`, `whole-arc`, `layered-evolving`, `reveal the latent`. Weak: "Honor the whole-arc station discipline" (Step 3) duplicates the apex-inheritance bullet two screens up. Completion criteria are checkable at every step except Step 1, whose criterion is "pause at 1d", which the house-style flow replaces with "name the delta or row, pause".

**Pruning.** Findings below.

### Cut 1: freezer-lookup MCP procedure (Step 1 paragraph)   [RELOCATE]
- Where: lines 102-115 ("Purchased-coffee freezer lookup ... instead.")
- Failure mode: duplication (family-level, IR6: identical 12-line block in `start-brew.md` lines 54-67)
- Why: the lookup is a Step 1 action; its home is the operational guide's Step 1, which both surfaces fetch anyway. Two verbatim copies drift (the skill says "desktop with repo access, grep the file"; start-brew does not).
- Move to: operational-guide.md § Step 1, new 1a; the skill and start-brew keep one pointer line.
- Saves: ~11 lines here, ~12 in start-brew.

### Cut 2: "Run 1a-1d ... Pause at Step 1d for strategy + modifier confirmation"   [COLLAPSE]
- Where: lines 100-119 (Step 1) + 121-128 (Step 2) + 130-134 (Step 3)
- Failure mode: sediment (the six-strategy flow the 2026-10-06 grill retired)
- Why: the apex-inheritance house-style bullet (lines 41-46) says "Step 1 names the delta or the adjustment row, Step 2 emits the chassis with the row applied"; the arc below still says "after strategy is confirmed ... author Bloom + Pour Structure". Fold the house-style bullet INTO the arc (one place), delete it from the inheritance section, and rewrite the three step paragraphs as: open (identity + roast level + archive + apex gate) -> name delta/row, pause -> emit chassis with row -> iterate by row.
- Saves: ~8 lines net (house-style bullet moves, three step paragraphs shrink).

### Cut 3: knowledge-cluster dispatch sentence in Step 1   [CUT]
- Where: lines 115-118 ("For equipment knowledge dispatch ... read_canonical")
- Failure mode: duplication
- Why: the operational guide's Step 1 archive-lookup list and start-brew's dispatch paragraph both carry it; the skill fetches that section before acting. Deletion test: behaviour unchanged.
- Saves: 4 lines.

### Cut 4: Step 2 modifier-placement sentence   [CUT]
- Where: lines 123-128 ("water formula goes in the Water Recipe field ... free-text scope")
- Failure mode: duplication
- Why: verbatim in start-brew.md lines 75-80 AND in the guide's Output Format table rows (Water Recipe / Temp / Pour Structure) that the skill fetches at Step 2.
- Saves: 5 lines.

### Cut 5: "the migration of the claude.ai brewing project ... roadmap #4 / ADR-0024"   [CUT]
- Where: lines 12-17, 23-27
- Failure mode: sediment + decorative provenance (IR2)
- Why: maintainer history. The agent acts on "compose the guide via read_doc_section", which line 96-98 already states. Keep the three-cluster list (line 19-21) as the reach map.
- Saves: ~6 lines.

### Strengthen 1: Step 3 completion criterion
- Where: line 130-134
- Failure mode: premature-completion risk
- Why: "iterate by row" needs the row named per iteration: "Each iteration names the adjustment row (or the single variable) it applies, and the ARC STATE `Next change` line carries it." Checkable.

## Considered-and-kept (IR4)

- **Self-roasted gate (lines 58-92).** Four-branch gate with the one surviving question; the carve-out paragraph is the only place the push-once/link-once invariant is stated from the brew side. Load-bearing.
- **Running ARC STATE block (150-174).** Fixed template; compaction defence. Keep verbatim (its `Recipe now:` line already fits the chassis + row shape).
- **Connector-unreachable recipe (142-148).** Evidence-backed (N=3), acted on at the critical write. Keep; the "graduated 2026-07-22" stamp is one decorative token, not worth a cut.
- **Close retro + Never-code-deploy guardrail (176-215).** Rules the agent obeys at the moment it is tempted not to. Keep.
- **Apex clarify-side + whole-arc bullets (47-54).** Strong leading words; they are the *inheritance* and stay. Only the house-style bullet moves into the arc.
- **Cross-references (217-224).** Flat reference, 8 lines, fine.

## Cross-skill (IR6 / IR11)

`brew` x `start-brew.md` share ~30 lines (freezer lookup, modifier placement, dispatch). start-brew is the mobile fallback of the same entry, so the fix is single-sourcing in the guide (Cut 1 + 4), not a shared snippet file. `bundled-brewing-completion.md` echoes only the Step 4 anchor and a "Step 1-4" doc description; it does not restate Step 1 structure, so it needs at most a one-line description touch.

## Open questions

None blocking; the brief's two presentation calls (Axis 1 table shape; Hybrid Phase Note + Valve Strategy Note collapse) are decided in the execution PR and recorded there. Anchor policy: keep the five h2 headings byte-identical (pinned by `/brew`, start-brew, bundled-brewing-completion, simulated-pourover, `lib/mcp/docs.ts`).
