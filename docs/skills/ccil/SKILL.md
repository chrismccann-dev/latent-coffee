# Cross-Coffee Insight Layer (CCIL)

**Tier:** Special / **Domain:** Cross-domain / **Wave:** 4 / **Status:** ACTIVE (skeleton + Sudan Rume seed pattern shipped Wave 4 PR 4a, 2026-05-21)
**ADR origin:** [ADR-0011](docs/adr/0011-composable-sub-skills-architecture.md) + [ADR-0012](docs/adr/0012-master-coordinator-pattern.md) + [ADR-0013](docs/adr/0013-self-improvement-primitives.md)

## Job-to-be-done

Synthesize across domain Historians + WBC archivists + Latent's per-entity terminal synthesis caches to produce **cross-domain knowledge** about specific coffees, cultivars, processes, terroirs, and methods. **THE main learning layer** per Chris's Round 1 framing. Distinguished from Brewing Historian / Roasting Historian by scope — those do internal-to-domain synthesis; CCIL does cross-domain.

## Knowledge cluster contents

**Today (post Wave 4 PR 4a, 2026-05-21):**

- [`cluster/coffee/sudan-rume/across-roasting-and-brewing.md`](docs/skills/ccil/cluster/coffee/sudan-rume/across-roasting-and-brewing.md) — seed pattern doc demonstrating cross-domain synthesis on Sudan Rume (N=3 across both domains: Latent-roasted CGLE SR Hybrid Washed + Latent-roasted CGLE SR Natural (resolved, ref #187) + externally-roasted CGLE Las Margaritas SR Natural brewing-only)
- [`cluster/decomposition-log.md`](docs/skills/ccil/cluster/decomposition-log.md) — Pattern F audit trail; logs every CCIL self-decomposition event (per [ADR-0013](docs/adr/0013-self-improvement-primitives.md) bloat tripwires)
- [`cluster/digests/brewing-corpus-digest-2026-07.md`](docs/skills/ccil/cluster/digests/brewing-corpus-digest-2026-07.md) — first full-corpus brewing digest (2026-07-08; 102 brews + 13 roast_learnings read in one pass): strategy-drift eras, per-roaster drift, reference-roast commonalities, cooling-arc distribution, 60-90-day window vs archive, water lens (feeds RP6), apex ranking. Point-in-time snapshot — refresh when the corpus ~doubles, don't maintain incrementally. `cluster/digests/` is the corpus-digest lane (distinct from `coffee/` per-coffee patterns).

**Target shape (accrues via Pattern A refresh events + future seed pattern ships):**

- `cluster/coffee/<cultivar>/<terroir>/<...>.md` — cross-domain pattern docs per coffee (Sudan Rume is the first; future seed candidates include Gesha and Mandela XO if their substrate evolves to support cross-domain reads)
- `cluster/methods/<method>.md` — cross-method patterns (e.g. "what I learned about Anaerobic Washed across roasting + brewing")
- `cluster/equipment/<equipment>.md` — cross-equipment patterns (rare; when cross-domain equipment patterns emerge)

## Inputs

- Roasting Historian's internal cross-lot pattern docs
- Brewing Historian's internal cross-coffee pattern docs (post-BREWING.md migration)
- WBC Roasting + WBC Brewing Archivists' cross-competitor patterns
- Latent's per-entity terminal synthesis caches (terroir / cultivar / process / roaster pages) — **read-only consumption, NOT writeback**
- Canonical registry events (new cultivar / new process modifier / new strategy promotion)

## Outputs

- Cross-domain pattern docs (the cluster contents above)
- Recommendations consumable by planners — e.g. "Roasting Assistant: when you see Sudan Rume + Hybrid Washed + Bermúdez, here's what I've learned across BOTH my roasting and my brewing of this combination"
- **No substrate writes** — CCIL writes its own cluster only; doesn't touch the corpus

## Called by / Calls

- **Called by:** Roasting Assistant, Brewing Assistant (cross-domain-aware planners). Research Coordinator may consult CCIL when scoping a research project per [ADR-0017](docs/adr/0017-research-assistant-architecture.md), but the call is operator-direct in Claude Code rather than a Master-Coordinator-dispatched chain.
- **Calls:** Roasting Historian · Brewing Historian · WBC Roasting Archivist · WBC Brewing Archivist (read-only synthesis input). Does NOT call workflow tier.

## MCP Tools in scope

None directly. CCIL is a synthesis layer; its output is cluster docs consumed by planners.

## Self-improvement

- **Patterns:** A (substrate-event refresh when Historians' patterns drift), D (tier-threshold refresh when underlying domain corpora cross tiers), **F (bloat-tripwire decomposition — PRIMARY pattern for this sub-skill; CCIL is the archetypal Pattern F user)** — see [ADR-0013](docs/adr/0013-self-improvement-primitives.md)
- **Signal:** bloat tripwire (>120KB total cluster OR >60KB single doc) → propose self-decomposition into sub-domain CCILs; prompt-revision when CCIL's recommendations judged generic for a domain N times

## Autonomy stage progression (custom thresholds per ADR-0013 outlier rules)

- **Stage 1 (Wave 4 default):** every `propose_doc_changes` proposal arbited by operator via existing ARBITER.md pipeline
- **Stage 1 → 2 advancement:** N=3 consecutive auto-approvals (FASTER than default N=5 because synthesis judgment is lower-stakes than substrate edits)
- **Stage 2 → 3 advancement:** override rate < 5% across 3 consecutive quarters (SLOWER than default 10% because cross-domain synthesis errors propagate further — wrong recommendation to Roasting Assistant could mis-shape downstream lots)
- **Auto-demote:** override rate ≥ 10% in any quarter → Stage 3 → 2; ≥ 25% → Stage 2 → 1 (same as default)

## Wave 4 implementation status

- **Wave 4 PR 4a shipped 2026-05-21.** Skeleton + Sudan Rume seed pattern. CCIL flipped PLACEHOLDER → ACTIVE. Chicken-and-egg Historians dependency resolved (Brewing Historian shipped Wave 2 PR 2, Roasting Historian shipped Wave 2 PR 3). Chain 6 in [coordinator/handoff-rules.md](docs/skills/coordinator/handoff-rules.md) activated pending lived-practice Wölfl cross-pollination execution.
- **Wave 4 PR 4b pending.** Master-doc residual migration (BREWING.md ~124KB → ~500-byte redirect stub; ROASTING.md ~72KB → ~500-byte redirect stub) + Naturals + Honey + 3 ambiguous ROASTING.md sections cleanup pass + CLAUDE.md sub-skills section compaction (extract to `docs/architecture/sub-skills-status.md`). PR 4b closes the architecture implementation arc.
- **Self-decomposition trigger remains the architectural backstop.** Per [ADR-0013](docs/adr/0013-self-improvement-primitives.md) Pattern F: when CCIL grows past 120KB total cluster OR any single doc past 60KB, decompose into sub-domain CCILs. First decomposition event documented in [decomposition-log.md](docs/skills/ccil/cluster/decomposition-log.md) when triggered.
