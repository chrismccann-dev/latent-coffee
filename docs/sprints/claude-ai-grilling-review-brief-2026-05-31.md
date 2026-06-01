# claude.ai grilling review — brief (first run, post resync grill 2026-05-31)

Small parallel session that runs the **claude.ai grilling review** standing rule ([`feedback_claude_ai_grilling_review`](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_claude_ai_grilling_review.md)) for the first time, right after the resync grill. The claude.ai project layer (instruction set + memory set) is the one surface Claude Code can neither see nor edit directly; it drifts silently on substrate change. This brief is the firing of that rule for the resync grill's outputs.

## Working mode

Chris drives the claude.ai UI (pulls up the full instruction + memory sets; pastes Claude-Code-drafted edits into the memory chatbox, iterating ~2 passes since it lands imperfectly). Claude Code drafts the edits + asks the cross-party questions. **Merge-only** memory edits — "Remember Y" supersedes stale lines (`feedback_claude_ai_memory_merge_only`), don't try to surgically delete.

## The 3 components

### 1. Memory + instruction currency review (both project/brewing + project/roasting)

Known drift to fix this run (grilling-queue Item 37): both project memories still describe the `docs://context-roasting.md` / `context-shared.md` split as load-bearing fetches. Post-Pattern-J (PR #247, 2026-05-25), CONTEXT-shared.md is a ~49KB glossary *index* pointing at four `docs/reference/*.md` reference-tier docs. **Paste-ready "Remember" block** (drop into both projects' memory chatbox):

> *Remember: CONTEXT is split into three zone files — CONTEXT-brewing.md, CONTEXT-roasting.md, CONTEXT-shared.md. CONTEXT-shared.md is a thin glossary index; its operational detail now lives in four reference-tier docs (docs/reference/mcp-architecture.md, canonical-registries.md, wbc-materials.md, synthesis-pipeline.md). A session loads only its relevant zone(s) + shared, pulling the reference docs on demand — not as load-bearing session-start fetches.*

Also sweep for other drift since the memory was last touched: the `pours` data-model session (migration 074), the redesign arc (all detail surfaces now `Ssp*`), and today's resync-grill outputs (ADR-0018, the "Pour" term, the claude.ai-grilling-review rule itself).

### 2. Cross-party claude.ai grill

Put the resync grill's substantive calls to the claude.ai side to catch Claude-Code-vs-claude.ai inconsistencies — especially: does claude.ai's understanding of the Phase / Pour distinction match the new CONTEXT-brewing term? Does it still think XO needs promoting? Does it carry stale doc-size or doc-location beliefs?

### 3. Context-window usage check

Go back to a couple recent threads and ask "how much of the context surface did this session use?" **Brewing is low-risk; roasting needs the deeper testing** (a lot carries far more info over many more cumulative days). This is the instrument for grilling-queue Item 38 (operator-guide session-start load creep) + Item 5b (empirical context-window measurement → eventual ADR-0014 amendment with calibrated thresholds). Record numbers; if roasting sessions are running hot, that's the signal to scope the operator-guide split / ADR-0014 re-grill.

## End-of-session

Record outcomes (memory edits landed, cross-party inconsistencies found, context-usage numbers) in the resync-grill record or a short companion note. If component 3 surfaces load creep, file it back to grilling-queue Item 38/5b with the data.
