# CCIL decomposition log

*Cross-Coffee Insight Layer · Pattern F audit trail · started Wave 4 PR 4a, 2026-05-21*

This doc tracks every CCIL self-decomposition event. Per [ADR-0013](docs/adr/0013-self-improvement-primitives.md) § Pattern F, when CCIL grows too large it splits into sub-domain CCILs. Decomposition events are append-only — historical entries are NOT edited or removed.

## Trigger conditions

A decomposition event fires when ANY of the following are observed:

- **Bloat tripwire: >120KB total cluster size** (`wc -c docs/skills/ccil/cluster/**/*.md` sums above 120,000 bytes). Mirrors the CLAUDE.md / BREWING.md / ROASTING.md tripwire from CLAUDE.md § Sprint cadence § Standing tripwires.
- **Bloat tripwire: >60KB single doc** (any individual cluster file exceeds 60,000 bytes). Pattern from ADR-0011 § Tripwires.
- **Dispatch-accuracy degradation** — recommendations consumed by planners (Roasting Assistant / Brewing Assistant) drift below the per-sub-skill autonomy graduation threshold from [ADR-0013](docs/adr/0013-self-improvement-primitives.md), measured as override rate across the last 12 dispatched recommendations.
- **Cross-domain pattern density exceeds intra-pattern coherence** — when a single cluster file's patterns no longer cohere under a common throughline (e.g. `cluster/coffee/sudan-rume/across-roasting-and-brewing.md` accumulates so many sub-patterns that some belong in a separate file).

## How to record a decomposition

When a trigger fires:

1. Append a new entry below with date + trigger source + before/after cluster shape + rationale.
2. Move the affected pattern docs into the new sub-structure; preserve back-compat redirect stubs at the original paths (mirror the BREWING.md / ROASTING.md Wave 2/3 pattern).
3. Update `docs/skills/ccil/SKILL.md` § Knowledge cluster contents to reflect the new sub-structure.
4. Register new paths in `lib/mcp/docs.ts` (one DOC_CATALOG entry per path — uri + title + description; audit-06 C3 collapse).
5. Cross-system audit per CLAUDE.md § Sprint cadence checkpoint 4.

## Entries

### 2026-05-21 — Wave 4 PR 4a ship: CCIL skeleton + Sudan Rume seed pattern

**Trigger:** Planned architectural ship, not a tripwire fire. CCIL flipped PLACEHOLDER → ACTIVE.

**Before:**
- `docs/skills/ccil/` contained only `SKILL.md` (PLACEHOLDER, 58 lines, ~3.6KB).
- No `cluster/` directory.

**After:**
- `docs/skills/ccil/cluster/coffee/sudan-rume/across-roasting-and-brewing.md` — seed pattern doc demonstrating cross-domain synthesis (~10KB).
- `docs/skills/ccil/cluster/decomposition-log.md` — this file.
- `docs/skills/ccil/SKILL.md` flipped ACTIVE; Notes for Wave 4 implementation sprint updated.

**Rationale:** The CCIL placeholder's "Notes for Wave 4 implementation sprint" line 56 specified Sudan Rume as the proof-of-pattern seed candidate (since both Latent-roasted Sudan Rume lots AND an externally-roasted brewing-only Sudan Rume lot exist). One seed pattern ships; future cross-domain patterns accrue via Pattern A refresh events (Historians' patterns drift) or new Workflow Executor write events surfacing matched coffee-family entries.

**Cluster size delta:** 0KB → ~13KB (well under the 120KB bloat tripwire).

**Next expected event:** No tripwire-driven decomposition expected before ≥3 additional seed patterns accrue. Pattern A refresh events expected as the Sudan Rume Natural V5 lot closes and adds confirmed roasting + brewing observations to the existing seed.
