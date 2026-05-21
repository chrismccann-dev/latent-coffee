# Cross-Coffee Insight Layer (CCIL)

**Tier:** Special / **Domain:** Cross-domain / **Wave:** 4 / **Status:** PLACEHOLDER
**ADR origin:** [ADR-0011](../../adr/0011-composable-sub-skills-architecture.md) + [ADR-0012](../../adr/0012-master-coordinator-pattern.md) + [ADR-0013](../../adr/0013-self-improvement-primitives.md)

## Job-to-be-done

Synthesize across domain Historians + WBC archivists + Latent's per-entity terminal synthesis caches to produce **cross-domain knowledge** about specific coffees, cultivars, processes, terroirs, and methods. **THE main learning layer** per Chris's Round 1 framing. Distinguished from Brewing Historian / Roasting Historian by scope — those do internal-to-domain synthesis; CCIL does cross-domain.

## Knowledge cluster contents (target Wave 4)

- `cluster/coffee/<cultivar>/<terroir>/<...>.md` — cross-domain pattern docs per coffee (e.g. `cluster/coffee/sudan-rume/across-roasting-and-brewing.md`)
- `cluster/methods/<method>.md` — cross-method patterns (e.g. "what I learned about Anaerobic Washed across roasting + brewing")
- `cluster/equipment/<equipment>.md` — cross-equipment patterns (rare; when cross-domain equipment patterns emerge)
- `cluster/decomposition-log.md` — tracks every CCIL self-decomposition event: when CCIL split into sub-areas, what triggered the split (Pattern F audit trail)

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

- **Called by:** Roasting Assistant, Brewing Assistant, Learning Assistant (the 3 cross-domain-aware planners)
- **Calls:** Roasting Historian · Brewing Historian · WBC Roasting Archivist · WBC Brewing Archivist (read-only synthesis input). Does NOT call workflow tier.

## MCP Tools in scope

None directly. CCIL is a synthesis layer; its output is cluster docs consumed by planners.

## Self-improvement

- **Patterns:** A (substrate-event refresh when Historians' patterns drift), D (tier-threshold refresh when underlying domain corpora cross tiers), **F (bloat-tripwire decomposition — PRIMARY pattern for this sub-skill; CCIL is the archetypal Pattern F user)** — see [ADR-0013](../../adr/0013-self-improvement-primitives.md)
- **Signal:** bloat tripwire (>120KB total cluster OR >60KB single doc) → propose self-decomposition into sub-domain CCILs; prompt-revision when CCIL's recommendations judged generic for a domain N times

## Autonomy stage progression (custom thresholds per ADR-0013 outlier rules)

- **Stage 1 (Wave 4 default):** every `propose_doc_changes` proposal arbited by operator via existing ARBITER.md pipeline
- **Stage 1 → 2 advancement:** N=3 consecutive auto-approvals (FASTER than default N=5 because synthesis judgment is lower-stakes than substrate edits)
- **Stage 2 → 3 advancement:** override rate < 5% across 3 consecutive quarters (SLOWER than default 10% because cross-domain synthesis errors propagate further — wrong recommendation to Roasting Assistant could mis-shape downstream lots)
- **Auto-demote:** override rate ≥ 10% in any quarter → Stage 3 → 2; ≥ 25% → Stage 2 → 1 (same as default)

## Notes for Wave 4 implementation sprint

- **Chicken-and-egg dependency:** CCIL needs Brewing Historian + Roasting Historian to have content before it has anything to synthesize across. Wave 2 ships Historians; Wave 4 ships CCIL.
- **Self-decomposition trigger is the architectural backstop** — when CCIL grows too large, it splits into sub-domain CCILs via Pattern F. This is the first time we'll exercise Pattern F end-to-end; treat as Wave-4 implementation risk.
- **Seed corpus for Wave 4:** start with 1-2 cross-domain pattern docs as proof-of-pattern (e.g. Sudan Rume across brewing + roasting since both CGLE Sudan Rume Hybrid Washed (roasting) + future Hydrangea Sudan Rume (brewing) lots exist).
- **Cross-system audit:** Actor 6 (new directory), Actor 4 (MCP Resource registration; CCIL Resources expose cross-domain recommendations to planners), Actor 5 (CLAUDE.md notes — CCIL becomes the explicit cross-domain layer), Actor 2 (Roasting Assistant + Brewing Assistant + Learning Assistant prompts reference CCIL for cross-domain context), Actor 3 (catalog refresh), Actor 1 (operator gets first-class cross-domain insight surface that was previously only implicit via per-entity terminal synthesis caches).
- **Cross-system sync sprint follows Wave 4 CCIL:** the architecture cross-system sync sprint closes Wave 4 by rewriting BREWING.md + ROASTING.md as ~500-byte redirect stubs, validating the full 18-sub-skill architecture end-to-end against the 6-actor matrix.
