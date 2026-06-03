# 0014 — Pattern F threshold tiers (pattern-aware decomposition tripwires)

Amends [ADR-0013](0013-self-improvement-primitives.md) § Pattern F + § Architecture-level bloat tripwires.

## Context

Pattern F's original uniform threshold (cluster > 120KB OR single doc > 60KB) was a working hypothesis at the time ADR-0013 landed (2026-05-26). The post-Wave-4-PR-4b lived audit at Item 5 of Sprint R Phase 4 Step 4 grill (2026-05-23) found 3 sub-skill clusters EXCEEDING the 120KB uniform threshold — all by design:

- `roasting-historian` — 192 KB (per-lot / per-cultivar / per-process roll-ups, compounded by design)
- `brewing-historian` — 188 KB (per-strategy / per-cultivar / per-coffee-family roll-ups, same)
- `brewing-equipment-expert` — 144 KB (4 equipment registries: brewers + filters + grinders + sworks)

A single uniform threshold doesn't distinguish good compounding from bad bloat. Historian-tier sub-skills are EXPECTED to compound; Equipment Experts are EXPECTED to grow with the equipment registry. The uniform rule misfires on both.

ADR-0013 also has an INTERNAL ambiguity worth resolving here: Pattern F description states "cluster > 120KB OR single doc > 60KB" while the architecture-level tripwires section says "individual sub-skill clusters > 60KB → propose self-decomposition." Two different cluster thresholds in the same ADR.

## The real constraint

Chris-locked at Item 5 grill (2026-05-23): the binding limit on cluster size is NOT disk size, NOT read latency, NOT Claude Code's working-memory — it's **claude.ai's session-level context window during a live workflow**.

A brewing session pulls 6-10 cluster docs (Coordinator + Brewing Assistant + Brewing Equipment Expert + Brewing Historian + WBC Brewing Archivist + relevant CCIL coffee/* + CONTEXT.md section-reads), iterates 20-30 turns across recipe + observation + adjustment cycles, and archives at the end. The sum of substrate pulls + session conversation + intermediate Tool calls must stay under claude.ai's degradation curve. Chris's operational rule: total substrate pulls should consume **no more than ~50% of claude.ai's context window** for the duration of the session.

With Claude Sonnet/Opus 4.6+ 1M-token context, that's ~500KB-2MB total substrate budget per session (1KB English text ≈ 250 tokens; 50% of 1M tokens ≈ 2MB; conversation + Tool calls eat into the budget so the realistic substrate budget is lower).

Claude.ai's MCP client reads docs in full via `read_doc` (no streaming / chunking); only `read_doc_section` against a specific anchor pulls a subset. So a 250KB doc IS 250KB of context.

## Decision: pattern-aware tiered thresholds

| Sub-skill class | Cluster cap | Single-doc cap | Rationale |
|---|---|---|---|
| **Historian** (Knowledge tier; Roasting Historian + Brewing Historian) | 250 KB | 80 KB | Compounding IS the desired growth pattern (per-lot / per-cultivar / per-process accumulation); ~2x workflow tier |
| **Archivist** (Knowledge tier; WBC Roasting + Brewing, Peer-Learning Roasting) | 200 KB | 60 KB | External-source growth bounded by event cadence (WBC year drops, peer livestream additions); tighter than Historian |
| **Knowledge — Equipment / Reference** (Brewing Equipment Expert, Roest Knowledge, Research Coordinator post 2026-05-27) | 150 KB | 60 KB | Registry-driven; bounded by Chris's gear + Roest API surface + research-knowledge cluster (Research Coordinator replaces the prior Learning Knowledge slot per [ADR-0017](0017-research-assistant-architecture.md)) |
| **Workflow** (Assistants, Recorders, Specialists, Roest API Worker) | 100 KB | 60 KB | Operational guides should stay tight; growth here is a smell (workflows shouldn't accumulate state) |
| **Coordinator** | 80 KB | 40 KB | Cross-zone meta; thinnest by design; this is the dispatch surface, not substrate |
| **CCIL** | 150 KB | 60 KB | Moderate growth; cross-domain N=3+ patterns per coffee / process before self-decomposition fires |
| **Root-level living docs** (CLAUDE.md, PRODUCT.md) | 120 KB | N/A | Whole doc IS the cluster; preserved as the Claude-Code-side standing tripwire (CLAUDE.md § Sprint cadence) |

**Live tripwire table relocated (2026-06-03):** the canonical, loading-profile-aware tripwire table for **all** constantly-loaded docs — root living docs, the CONTEXT-* family, the claude.ai entry prompts (new 40 KB cap), and these sub-skill cluster tiers — now lives in **[docs/architecture/doc-tripwires.md](../architecture/doc-tripwires.md)**. This ADR records the *rationale* for the cluster tiers; the registry holds the live numbers + current sizes. A firing tripwire schedules a **manual post-tripwire pruning exercise** ([protocol](../features/doc-pruning-mechanism-brainstorm-2026-06-03.md)), not an autonomous prune.

**Tripwire behavior:** when a threshold is exceeded, fire a decomposition proposal via `propose_doc_changes` or a kickoff brief. Thresholds are *tripwires*, not hard caps — content can continue accumulating during the proposal cycle. When a cluster is **within 20% of its threshold** ("approaching"), surface as a watch-item at the next arbitration session's Pattern F sweep.

## Resolves ADR-0013 ambiguity

ADR-0013 had two different statements of the cluster threshold in different sections (Pattern F description "cluster > 120KB" vs architecture-level tripwires "clusters > 60KB"). This ADR resolves the ambiguity: there is no uniform threshold across sub-skill classes; pattern-aware tiers replace both statements. The "single doc > 60KB" tripwire stands for non-Historian sub-skills; raises to 80KB for Historians.

## Current state (2026-05-23 audit)

**Compliant under pattern-aware tiers (13 of 17 sub-skills — 2026-05-27 update):** ccil (36KB), brewing-assistant (52KB), brewing-historian (188KB, under Historian 250KB), brew-recorder (8KB), close-lot-specialist (16KB), cupping-specialist (28KB), peer-learning-roasting-archivist (28KB), research-coordinator (~26KB at Step 2 ship, under Equipment/Reference 150KB), research-assistant (~6KB at Step 2 ship, under Workflow 100KB), roast-recorder (12KB), roasting-assistant (24KB), roasting-historian (192KB, under Historian 250KB), roest-api-worker (8KB), sourcing-workflow-planner (8KB), wbc-roasting-archivist (92KB). (Pre-2026-05-27 list included learning-assistant 8KB + learning-knowledge 4KB; both retired per [ADR-0017](0017-research-assistant-architecture.md).)

**Approaching (within 20% of cap, watch-item):**
- `brewing-equipment-expert` cluster (144KB / 150KB Equipment cap — 96%)
- `brewing-historian/cluster/patterns/cross-coffee-insights.md` single doc (76KB / 80KB Historian single-doc cap — 95%)
- `coordinator` cluster (64KB / 80KB Coordinator cap — 80%)
- `CLAUDE.md` root-level (114KB / 120KB cap — 95%)
- `wbc-brewing-archivist` cluster (112KB / 200KB Archivist cap — 56%, below 80% warning threshold but worth tracking)

**Exceeded (decomposition / compaction sprint needed):**
- `PRODUCT.md` (140KB / 120KB root threshold) — flagged for parallel compaction session at Item 5 grill per Chris's standing "spin up a parallel session" offer

## Open follow-up

**Empirical claude.ai context-window measurement** — Chris-offered cross-party session at Item 5 grill (2026-05-23): "if we need to do another claude.ai grilling session between you, Claude, and claude.ai, to figure out how much it could accurately retain and what the context scope creep is on it, I'm okay to do that." Lived measurement (instrument a typical brewing + roasting session, capture substrate-pull totals, observe degradation patterns) would replace the 50% best-guess heuristic with calibrated thresholds. Tracked as outstanding grilling-queue item.

## Sources

- Item 5, Sprint R Phase 4 Step 4 grill (2026-05-23) — Chris-locked pattern-aware framing + claude.ai-as-binding-constraint reasoning + PRODUCT.md decomposition trigger
- Lived audit 2026-05-23: 3 over-threshold clusters under prior uniform threshold; all compliant under new pattern-aware tiers
- Prior ADR-0013 § Pattern F + § Architecture-level bloat tripwires
