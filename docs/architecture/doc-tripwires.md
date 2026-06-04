# Doc-size tripwire registry

**Canonical surface for every doc-size tripwire across all three load surfaces** (Claude Code, claude.ai/projects/brewing, claude.ai/projects/roasting). When a doc crosses its tripwire, fire a **post-tripwire pruning exercise** (the manual case-study process scoped in [docs/features/doc-pruning-mechanism-brainstorm-2026-06-03.md](../features/doc-pruning-mechanism-brainstorm-2026-06-03.md)) — not an autonomous prune. Pattern J ([ADR-0013](../adr/0013-self-improvement-primitives.md)) remains a placeholder until the case-study volume justifies systematization.

Created 2026-06-03 (Cluster B doc-pruning brainstorm). This table is the single canonical home for tripwire numbers; the prose tripwire in [CLAUDE.md § Standing tripwires](../../CLAUDE.md) and the cluster tiers in [ADR-0014](../adr/0014-pattern-f-threshold-tiers.md) point here rather than re-stating numbers.

## Why this exists

The ADD-shaped self-improvement patterns (A-E in ADR-0013) compound substrate monotonically. Size tripwires catch *gross* bloat, but they only catch one failure mode: a doc growing past a byte budget. They do **not** catch a doc that sits *under* its cap but is full of stale / over-detailed / superseded sections that surface at retrieval time without earning their keep. That second failure mode is what the manual pruning exercise judges; the tripwire is only the *trigger* that schedules the exercise.

## The binding constraint (per ADR-0014)

The limit on doc size is not disk, not read latency, not Claude Code working memory — it is **claude.ai's session-level context window during a live workflow**. claude.ai's MCP client reads docs in full via `read_doc` (no streaming); only `read_doc_section` against an anchor pulls a subset. **Loading profile therefore changes the real cost**, and the tiers below are loading-profile-aware:

- **full-read** docs cost their entire size every session that touches the surface → tighter caps.
- **section-read** docs cost only the pulled anchor → a larger total file is tolerable.

This is why the entry prompts (full-read, 40 KB cap) are capped tighter than the CONTEXT-* glossaries (section-read, 120 KB cap) even though the prompts are smaller files.

## Tripwire table

| Tier | Doc(s) | Cap | Approaching (watch) | Loading profile | Current size (2026-06-03) | Status |
|---|---|---|---|---|---|---|
| **Root living docs** | CLAUDE.md | 120 KB | 96 KB | full · every Claude Code session | 37.8 KB | ✅ |
| | PRODUCT.md | 120 KB | 96 KB | consulted, not auto-loaded | 126.1 KB | 🔴 over (Roadmap growth) |
| **CONTEXT-\* family** | CONTEXT-roasting.md | 120 KB | 96 KB | **section-read** · claude.ai roasting | 108.2 KB | ✅ (pruned, case 002) |
| | CONTEXT-brewing.md | 120 KB | 96 KB | section-read · claude.ai brewing | 60.1 KB | ✅ |
| | CONTEXT-shared.md | 120 KB | 96 KB | section-read · both | 52.3 KB | ✅ |
| **claude.ai entry prompts** | docs/prompts/*.md | **40 KB** | 32 KB | **full-read** · claude.ai session start | log-cupping **49.2 KB** | 🔴 over |
| | | | | | one-shot 33.8 KB | ⚠️ approaching |
| | | | | | close-lot 31.4 KB | ✅ |
| | | | | | log-roast 29.0 KB | ✅ |
| | | | | | (all others < 25 KB) | ✅ |
| **Sub-skill clusters** | docs/skills/*/ | per [ADR-0014](../adr/0014-pattern-f-threshold-tiers.md) pattern-aware tiers | within 20% | full via read_doc | see ADR-0014 § Current state | (governed there) |
| **Auto-memory** | MEMORY.md | 25 KB / 200 lines | — | auto-memory index | see consolidate-memory skill | (governed there) |
| **Claude-Code on-demand** | ARBITER.md, SYNC_V2.md, docs/reference/* | no hard cap | — | on-demand (not every-session) | ARBITER 62.3 KB | lower priority |

### Prompt cap rationale

The 40 KB prompt cap is deliberately tighter than the file sizes suggest. A 49 KB prompt loaded in full every cupping session costs more context per session than the 115 KB CONTEXT-roasting glossary, which is section-read. The cap may loosen after the manual pruning process gives us lived evidence of what prompt content is genuinely every-session vs. extractable — revisit after 2-3 prompt-side pruning cases.

## Tripwire behavior

- **Over cap** → schedule a post-tripwire pruning exercise (manual, operator + Claude Code, per the scoping doc). The doc keeps working in the meantime; the tripwire is a scheduler, not a hard stop.
- **Approaching (within 20% of cap)** → surface as a watch-item at the next grilling / arbitration session.
- The pruning exercise produces a **structured handoff doc** in [docs/sprints/pruning-cases/](../sprints/pruning-cases/) so lessons aggregate across sessions toward eventual systematization.

## Live queue (2026-06-03)

1. **docs/prompts/log-cupping.md (49.2 / 40 KB)** — 🔴 over the prompt cap. Live fire (next manual pruning exercise).
2. **PRODUCT.md (127.3 / 120 KB)** — 🔴 over (crossed via Roadmap growth; drifted 114.0→126.1→127.3 in 3 days). **Queued as pruning case 003**, framed to land the missing `archive` shape (closed/shipped roadmap sections → archival surface) + consolidate the living roadmap. Kickoff: [docs/sprints/product-md-prune-kickoff-2026-06-03.md](../sprints/product-md-prune-kickoff-2026-06-03.md).
3. **docs/prompts/one-shot.md (33.8 / 40 KB)** — ⚠️ approaching; watch.

Cleared:
- ~~CONTEXT-roasting.md~~ — **pruned 2026-06-03** (115.8 → 108.2 KB), [pruning case 002](../sprints/pruning-cases/002-context-roasting.md). Operator-led reorganization (cluster regrouping + agent navigation scaffolding) + Claude Code prune (`consolidate` + `delete` + one `extract` of FC operational detail to fc-marking.md). First worked examples of `consolidate` and `delete`.

## Maintenance

Refresh the **Current size** column + **Live queue** during the doc-size check that runs at each claude.ai grilling review (the recurring 3-part protocol) and at any sprint that materially edits a tracked doc. The table is the canonical trigger surface; keep it current or the tripwires go blind.
