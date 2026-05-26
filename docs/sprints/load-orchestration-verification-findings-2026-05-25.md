# Load orchestration verification — findings

**Sprint:** Load orchestration cleanup ([PR #250](https://github.com/chrismccann-dev/coffee-app/pull/250) audit / [PR #251](https://github.com/chrismccann-dev/coffee-app/pull/251) brewing / [PR #252](https://github.com/chrismccann-dev/coffee-app/pull/252) roasting)
**Date:** 2026-05-25
**Verification method:** chatbox edits applied in claude.ai UI on both projects + paper-walk sessions through brewing and roasting prompt flows.
**Output:** this findings doc + a follow-up cleanup PR (substrate drift fixes + `list_docs` prefix arg + grilling-queue banking entries) that this doc justifies.

## Chatbox edits

### Brewing project

- Applied: removed catalog fetch (old #1), removed context-brewing + context-shared fetches + "Do NOT fetch context.md" line (old #3) from Instructions; merged "Forget X. Remember Y." in memory chatbox to retarget the bullet in "Current state" that previously instructed catalog+operator-guide at session start.
- Trouble: none. The chatbox merged the memory edit cleanly; phrasing came back tighter than I drafted ("Never store brew-state" upgraded to "Never store transactional brew state").

### Roasting project

- Applied: same shape — removed catalog (old #1) + context-roasting/context-shared (old #3) from Instructions; merged the "Session start protocol" rework in memory chatbox to collapse the 4-step protocol to 3 (operator-guide → prompt → get_bean_pipeline) and added the explicit "catalog fetched only at proposal-routing time in STAGE 5" directive.
- Trouble: one residual descriptive sentence in memory's "Purpose & context" still names the catalog as "the central index" — flagged in pre-walkthrough review as a borderline drift risk. Calibration confirmed it produced a real urge to fetch; walkthrough confirmed the urge did NOT recur once the prompt's STAGE 4 explicit fence ("don't fetch the catalog for this") landed. The fence framing is doing the work; the descriptive sentence is inert in practice.

## Brewing session

- **Type:** paper-walk
- **Coffee:** Lazy Schnauzer "The Profound Adventure" — Bona Zuria Washed (Tamiru Tadesse / Alo Coffee), hypothetical for paper-walk, but claude.ai discovered it's an actual inventory row (Profound Adventure, WB Agtron 70.4) — fetched live rather than trusting the brief I handed it
- **Anchor resolution:**
  - Step 1 pull at brief: PASS (first call, em-dash anchor resolved verbatim, no fallback)
  - Step 2 pull at brief: PASS (same)
  - Step 3 pull at iteration: not reached (held at brief per stop instruction)
  - Step 4 pull in bundled-brewing-completion: not reached (would only fire at session end)
- **Catalog discipline:** zero catalog fetch. Zero context-brewing/shared fetches. Brief stage routes entirely through brewing-assistant operational-guide sections + brewing-historian signal table + conversation_search + live inventory file.
- **Vocabulary fumbles:** none from claude.ai. Two stale items in MY handoff that claude.ai corrected from substrate:
  - **Extraction strategy count: 6, not 5.** Hybrid was promoted to a full strategy in v8.4 (2026-05-06). My prompt said 5; substrate says 6. CLAUDE.md inline text is also stale on this.
  - **Modifier types: 4, not 5.** My handoff propagated a 5-element list (output_selection / inverted_temperature_staging / aroma_capture / immersion / role_based_pulse). Substrate says the canonical 4 are output_selection, inverted_temperature_staging, aroma_capture, role_based_pulse. **Immersion was retired** in v8.4 (became the Hybrid strategy with hybrid_subform set). CLAUDE.md inline text still lists immersion as a modifier — stale.
  - One soft find: "Strategy zone / Wrong-zone trap" — claude.ai recognized conceptually but flagged that the exact labels aren't headings in the sections fetched; the *concept* lives in the mechanics-vs-intent symmetry rule. Worth checking if it's anchored as a named term anywhere.
  - One honest gap: claude.ai said it doesn't have all 15 signature methods memorized as a list and would `read_canonical(axis: "processes")` to enumerate rather than guess. Correct behavior, not a fumble.
- **Other observations:**
  - Live-fetch discipline catch: bag says "very light roast"; live inventory says WB Agtron 70.4 / medium-light color. Strategy stayed Clarity-First but risk register shifted — exactly what "fetch live, don't trust stored/handed state" is designed to surface.
  - Brief drafted cleanly. Strategy + modifier reasoning sound. Recipe proposal coherent (Orea Glass + EG-1 6.6 + 1:16.5 / 93°C / gentle pours).
  - One honest over-fetch-urge note: at 1c there was a pull to fetch a `by-cultivar/ethiopian-landrace.md` cluster doc and the roaster card; held off because conversation_search confirmed net-new in archive. Catalog/context urge did NOT fire this turn.

## Roasting session

- **Type:** paper-walk
- **Lot:** Finca El Refugio — Pink Bourbon Washed, Colombia/Huila, 1850m, moisture 10.4%, density 798 g/L, V-set (hypothetical)
- **Residency assertion:** start-lot.md line ~9 reads cleanly. claude.ai's exact paraphrase: *"an orientation pointer to the canonical-definition home, not a residency claim — pull via `read_doc` if a specific term needs validation."* Did NOT act as if glossary was resident; on-demand path never triggered because all terms were live in working understanding from prompt + cluster docs.
- **Lot-slug lookup at start-lot.md:145:** PASS. Uses `list_docs(prefix="skills/roasting-historian/cluster/active-lots/")` AND explicitly fences off the catalog with rationale: *"This is a targeted lookup against the existing per-lot files — don't fetch the Master Coordinator catalog for this; the catalog is reserved for cross-domain proposal-routing at lifecycle close."* The fence is doing real work — it pre-empted the exact urge claude.ai flagged in the calibration turn.
- **Catalog discipline:** zero catalog fetch. Zero context-roasting/shared fetches. The prompt names the catalog twice (the STAGE 4 fence + cross-references) and the urge to fetch did NOT recur from the calibration turn. Fence framing is load-bearing.
- **Vocabulary fumbles:** none. All 12 terms articulated cleanly with substrate-grounded definitions. Three substantive substrate-current additions claude.ai surfaced that aren't in my handoff:
  - `terroir_takeaway` is exempt from the one-shot N=1 lever-attribution NULL rule (added Sprint 10) — doesn't need cross-batch evidence to populate.
  - Hopper-load 125°C is operator-fixed but the CCIL "altitude proxy" hypothesis documents a replication-vs-quality tension: the Ecuadorian one-shot's 120°C replication may have cost drying time.
  - **FC audibility enum count tiebreaker resolved: 4 values, not 5.** Memory was correct. My handoff's "5" was stale. Evidence: the precedence table in cross-coffee-insights.md keys end-condition rules on "silent/subtle/ambiguous predicted," enumerating exactly the 3 non-audible values against `audible`. Nothing in live substrate references a fifth.
    - **NOTE (Claude Code post-verification cross-check):** this conclusion is inverted. Substrate IS 5 values: `audible / subtle / silent / ambiguous / did_not_fire`. The 5th value `did_not_fire` was added Group 3 / Item 31 / migration 066 / 2026-05-24 for the underdeveloped-low-energy-probe case (bean tops out below FC window). Authoritative refs: [docs/prompts/log-roast.md:74](docs/prompts/log-roast.md), [docs/prompts/one-shot.md:186](docs/prompts/one-shot.md), [docs/skills/roest-knowledge/cluster/protocols/fc-marking.md:50](docs/skills/roest-knowledge/cluster/protocols/fc-marking.md). The stale docs that drove claude.ai's incorrect read are [docs/skills/roast-recorder/SKILL.md:15](docs/skills/roast-recorder/SKILL.md) (still says 4-value, "Three of four") and [docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md:100](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md) (precedence-table cell omits `did_not_fire` from the non-audible enumeration). Both surface in the cleanup PR alongside the CLAUDE.md drift fixes.
- **Other observations:**
  - **One real prompt-vs-tool-schema mismatch worth fixing:** the start-lot.md instruction `list_docs(prefix="skills/roasting-historian/cluster/active-lots/")` references a `prefix` argument that the loaded `list_docs` tool schema doesn't document. Either (a) the tool accepts an undocumented prefix arg, (b) the tool needs to grow a real `prefix` param, or (c) the prompt should drop the pseudo-arg and instruct client-side filtering after a full enumerate.
    - **Resolved in same cleanup PR:** option (b). [lib/mcp/doc-tools.ts](lib/mcp/doc-tools.ts) grown to accept an optional `prefix` parameter (Zod string, optional); accepts either bare path (`"skills/roasting-historian/cluster/active-lots/"`) or full `docs://`-prefixed URI; normalizes bare paths to `docs://{prefix}` for matching. The prompt's existing call now resolves correctly.
  - V1 design quality was high: walked the precedence table correctly, anchored on Sudan Rume Washed CF-Light #133 (washed family), correctly resolved 798 g/L as high-density (vs the ≤760 low-density taper), correctly treated 10.4% moisture as neutral, applied new-cultivar+new-terroir → wide-spread heuristic (±5°C peak inlet). bean_temp end condition with manual FC mark above 202°C. Three-batch design at 242/245/248°C with proportional full-curve shifts. Failure boundary articulated. Would be a perfectly viable real V1.
  - Substrate-ahead-of-memory (second confirmation, first surfaced in calibration): CCIL references CONTEXT-roasting.md as live glossary home; operator guide says CONTEXT-shared is now a thin index post-Pattern-J pruning. Memory descriptions in both projects still carry older context-* framing. Fetching live works fine; memory layer is lagging.

## Overall feel

Lighter — perceptibly. Calibration showed the strip saved roughly 12,000 tokens of session-start load (~14,750 → ~2,750), and the walkthrough confirmed nothing structurally relied on the stripped fetches. Both sides felt MORE focused, not less — the prompts dispatch exactly what they need at each stage, the operator-guide carries the operational anchors, and the absence of two heavy context-* docs at session start didn't surface a single missing-information moment. The drift signal I flagged in roasting memory's catalog description fired in calibration but went inert under the prompt's explicit STAGE 4 fence. The corrected protocol holds.

## Cleanup candidates

1. **CLAUDE.md drift on extraction strategy count** — the inline bullet under § Canonical registries says "5 canonical post sprint Extraction Strategy v2 (2026-04-27, migration 034)" but Hybrid was promoted to a full strategy in v8.4 (2026-05-06). Should read 6. The v8.4 sprint log entry is already present in CLAUDE.md but the inline taxonomy bullet didn't get updated. ~15-line edit. **Shipped in same-day cleanup PR.**

2. **CLAUDE.md drift on modifier types** — same § lists "4 canonical types" with one being `immersion`, but Immersion was retired in v8.4 (became Hybrid with hybrid_subform set) and `role_based_pulse` was added in v8.5. Current correct set is output_selection / inverted_temperature_staging / aroma_capture / role_based_pulse. Inline taxonomy bullet didn't catch the v8.4 + v8.5 deltas. ~15-line edit. **Shipped in same-day cleanup PR.**

3. **list_docs prefix-arg mismatch in start-lot.md** — at start-lot.md:145 (and likely other prompts) the instruction `list_docs(prefix="skills/roasting-historian/cluster/active-lots/")` references an undocumented `prefix` parameter. Either grow the tool to accept the arg (cleanest — substrate-true) or rewrite the prompt to instruct full-enumerate + client-side filter. Needs Bash check of the tool's actual implementation to know which path is right. **Resolved in same-day cleanup PR via option (a) — grew the tool.**

4. **FC audibility 4→5 drift on two roasting-side docs** (Claude Code post-verification cross-check finding; not in claude.ai's original list because claude.ai consulted the stale doc as authoritative). [docs/skills/roast-recorder/SKILL.md:15](docs/skills/roast-recorder/SKILL.md) still says 4-value enum + "Three of four"; [docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md:100](docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md) precedence-table cell enumerates "silent / subtle / ambiguous" non-audible values, omitting `did_not_fire`. **Shipped in same-day cleanup PR.**

5. **"Strategy zone / Wrong-zone trap" terminology check** — claude.ai recognized conceptually but flagged the exact labels aren't section anchors in operational-guide. Worth a grep across substrate to confirm whether these are named anchors anywhere or just operational shorthand. If they're not anchored, either anchor them in operational-guide or drop the labels from prompts that reference them as if they were canonical. **Banked to grilling-queue.**

6. **Memory currency follow-up (out of load-orchestration scope but second confirmation now)** — both project memories still describe the docs://context-roasting.md / context-shared.md split as if those are load-bearing fetches. Operator guide notes Pattern J pruning (2026-05-25) moved content from CONTEXT-shared.md into reference-tier docs. Memory's descriptions of where things live are out of date. Not a load issue (memory is just descriptive, no fetch instruction left to fire) but worth a future memory-chatbox pass to refresh the architectural-state framing. **Banked to grilling-queue.**

7. **Operator guide cross-reference density (architectural watch-item, not actionable now)** — both calibration responses noted the operator guide is "studded with cross-reference links" pulling toward link-following habit. The doc is correctly doing its job as a directory but the directory shape is itself a drift vector for over-fetching. Worth tracking if session-start loads creep upward over time. **Banked to grilling-queue.**
