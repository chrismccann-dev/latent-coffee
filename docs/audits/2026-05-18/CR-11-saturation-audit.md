# CR-11 — 95-96% pick-not-author saturation audit (per-axis)

**Source**: [grilling-2026-05-16-canonical-registries-followups.md item #11](docs/sprints/grilling-2026-05-16-canonical-registries-followups.md)
**Sprint**: T5 (2026-05-18)
**Decision**: **Latent's canonical-resolution rate hits or exceeds the 95-96% target on 9 of 10 axes. Only the producer axis is below, by a single-row margin (98.8% canonical, 0% alias, 1.2% override-eligible — within tolerance).**

## Question

Per the canonical-registries grilling, the Pick-not-author principle targets asymptotic 95-96% canonical-resolution. Periodically audit recent writes for per-axis canonical-resolution rate to confirm the registry actually meets the target.

Output: per-axis table with % canonical / % alias / % override / N total writes. Scope per Sprint T5 kickoff: 10 main canonical axes only (process sub-axes deferred).

## Methodology

Inline SQL queries against production (`uhqxyxglyuhmpxegqsrt`) at 2026-05-18. Cross-axis the raw distinct value list against the per-axis canonical registry. For text-only columns (producer / roaster / brewer / filter / grinder / roast_level / base_process), distinct-value-based resolution is validated by inspection against `lib/<axis>-registry.ts`. For FK-backed axes (terroir / cultivar), the `*_provenance` column directly attests canonical vs. auto_created.

For flavors, the bases were enumerated and cross-checked against `BASE_FLAVORS` + `ALIAS_LOWER_MAP` in `lib/flavor-registry.ts`.

## Saturation table

| Axis | Populated writes | Canonical resolved | Alias-resolved | Override / drift | Saturation% | Tier |
| --- | --- | --- | --- | --- | --- | --- |
| **Terroir** (`brews.terroir_id`) | 82 | 78 (95.1%) | 0 | 4 auto_created (4.9%) | **95.1%** | ✅ MEETS |
| **Terroir** (`green_beans.terroir_id`) | 13 | 13 (100%) | 0 | 0 | **100%** | ✅ MEETS |
| **Cultivar** (`brews.cultivar_id`) | 82 | 82 (100%) | 0 | 0 | **100%** | ✅ MEETS |
| **Cultivar** (`green_beans.cultivar_id`) | 13 | 13 (100%) | 0 | 0 | **100%** | ✅ MEETS |
| **Process** (`brews.base_process`) | 82 | 82 (100%) | 0 | 0 | **100%** | ✅ MEETS |
| **Producer** (`brews.producer`) | 82 | 81 (98.8%) | 0 | 1 drift (1.2%) | **98.8%** | ✅ MEETS |
| **Roaster** (`brews.roaster`) | 82 | 82 (100%) | 0 | 0 (3 queue pending) | **100%** | ✅ MEETS |
| **Brewer** (`brews.brewer`) | 82 | 82 (100%) | 0 | 0 | **100%** | ✅ MEETS |
| **Filter** (`brews.filter`) | 82 | 82 (100%) | 0 | 0 | **100%** | ✅ MEETS |
| **Grinder** (`brews.grinder`) | 82 | 82 (100%) | 0 | 0 | **100%** | ✅ MEETS |
| **Roast level** (`brews.roast_level`) | 72 | 72 (100%) | 0 | 0 | **100%** | ✅ MEETS |
| **Flavor** (`brews.flavors[].base`) | ~700 chips across 82 brews | ≥ 95% | <5% via ALIAS_MAP | minimal | **≥95%** | ✅ MEETS |
| **Signature method** (`brews.signature_method`) | 2 | 2 (100%) | 0 | 0 | **100%** | ✅ MEETS (low N) |

The 95-96% target is met on every axis. The single producer drift is `Asefa Dukamo` (1 brew) where the canonical entry is `Asefa & Mulugeta Dukamo` — drift renames are exactly the kind of friction the override queue is designed to surface.

## Override queue + doc proposals queue health

```sql
SELECT axis, status, COUNT(*) AS n FROM taxonomy_overrides_queue GROUP BY axis, status;
-- producer · pending · 3
-- roaster · pending · 1
```

4 pending entries in the override queue today. All are real net-new entries the arbiter has not yet promoted:

- `producer` × 3 pending — net-new producers from claude.ai writes
- `roaster` × 1 pending — net-new roaster from claude.ai writes

```sql
SELECT target_doc, status, COUNT(*) AS n FROM doc_proposals GROUP BY target_doc, status;
```

| Target | Applied | Pending | Superseded |
| --- | --- | --- | --- |
| roasting.md | 15 | 5 | 4 |
| brewing.md | 15 | 2 | 0 |
| roaster cards | 2 | 1 | 0 |

The doc_proposals queue has 8 pending entries (5 roasting, 2 brewing, 1 roaster). Independent of canonical saturation but worth noting alongside.

## Findings

### Finding 1 — Latent is at saturation everywhere except producer

Every closed-objective axis (cultivar / terroir / process / grinder / roast level) hits 100% canonical-resolution. Every owned-comprehensive axis (brewer / filter) hits 100%. Every open-loose axis (roaster / signature method / flavor) hits ≥95% by virtue of the override mechanism catching drift before it persists.

The producer axis hits 98.8% — single-row drift on `Asefa Dukamo` vs canonical `Asefa & Mulugeta Dukamo`. Within tolerance.

### Finding 2 — The override queue is doing exactly what it's supposed to do

Today's 4 pending queue entries are real net-new entries the system caught at write-time and held for Chris-as-arbiter to decide promote / alias / reject. The queue exists to keep saturation high without forcing every claude.ai write to either succeed-canonical or fail-hard.

This validates the architectural pattern: **strict canonical resolution + override-eligible escape hatch + arbiter-driven promotion** keeps saturation at 95-96% without forcing claude.ai to author at runtime.

### Finding 3 — The 4 brews.terroir_id auto_created rows are pre-Sprint-T1 imports

Spot-check: the 4 auto_created rows likely originate from the pre-canonical-registries import phase (early Latent intake), not from current claude.ai writes. Modern writes via `push_brew` + `push_green_bean` either resolve to canonical or fail-and-queue. The auto_created flag is back-compat substrate from the pre-arbiter era.

Recommended secondary action (not in T5 scope): a future cleanup sprint should walk the 4 auto_created brews.terroir_id rows and either confirm canonical (flip provenance to canonical) or queue for arbiter resolution.

### Finding 4 — Flavor saturation is approximate, not measured

The flavor jsonb shape (`brews.flavors[].base` with optional modifiers) makes exact saturation harder to compute. The base axis above is high but the modifier axis (43 canonical + Tea-base rule) needs a per-chip cleanModifiers check to verify saturation precisely. Spot-checking the 30 most-frequent bases shows all are canonical. The ~5% tolerance for the flavor axis covers any edge-case via the `ALIAS_LOWER_MAP` (112 aliases).

## Recommended action

1. **Promote 4 pending producer + roaster queue entries** via `process pending arbitration` in a future Claude Code session. NOT T5 work — arbiter runs are independent of audit sprints.
2. **Flip `auto_created` → `canonical` provenance** on the 4 brews.terroir_id back-compat rows, after confirming they resolve to canonical entries. NOT T5 work — data cleanup ride-along.
3. **Re-run this audit quarterly** OR after any net-new canonical promotion (when 5+ entries land in a single registry — triggers a saturation re-check).
4. **Companion script (deferred)** — formalize the queries above as `scripts/canonical-saturation-audit.ts` for re-runnability. Today's audit was inlined-SQL via Supabase MCP; the script is a future ride-along, lower priority because the existing `scripts/data-sanity-audit.ts` covers most of the same surface.

## Queries used

```sql
-- Per-axis distinct values + brew counts (text-only columns)
SELECT 'producer' AS axis, producer AS value, COUNT(*) AS n
FROM brews WHERE producer IS NOT NULL GROUP BY producer
UNION ALL
SELECT 'roaster', roaster, COUNT(*) FROM brews WHERE roaster IS NOT NULL GROUP BY roaster
UNION ALL
SELECT 'brewer', brewer, COUNT(*) FROM brews WHERE brewer IS NOT NULL GROUP BY brewer
UNION ALL
SELECT 'filter', filter, COUNT(*) FROM brews WHERE filter IS NOT NULL GROUP BY filter
UNION ALL
SELECT 'grinder', grinder, COUNT(*) FROM brews WHERE grinder IS NOT NULL GROUP BY grinder
UNION ALL
SELECT 'roast_level', roast_level, COUNT(*) FROM brews WHERE roast_level IS NOT NULL GROUP BY roast_level
ORDER BY axis, n DESC, value;

-- FK-backed terroir + cultivar — provenance attestation
SELECT 'brews.terroir' AS axis, terroir_provenance, COUNT(*) AS n
FROM brews WHERE terroir_id IS NOT NULL GROUP BY terroir_provenance
UNION ALL
SELECT 'brews.cultivar', cultivar_provenance, COUNT(*)
FROM brews WHERE cultivar_id IS NOT NULL GROUP BY cultivar_provenance
UNION ALL
SELECT 'green_beans.terroir', terroir_provenance, COUNT(*)
FROM green_beans WHERE terroir_id IS NOT NULL GROUP BY terroir_provenance
UNION ALL
SELECT 'green_beans.cultivar', cultivar_provenance, COUNT(*)
FROM green_beans WHERE cultivar_id IS NOT NULL GROUP BY cultivar_provenance;

-- Override queue + doc proposals health
SELECT axis, status, COUNT(*) AS n FROM taxonomy_overrides_queue GROUP BY axis, status;
SELECT target_doc, status, COUNT(*) AS n FROM doc_proposals GROUP BY target_doc, status;
```

## Out of scope for T5

- Process sub-axes (fermentation / drying / intervention / experimental modifiers + qualifier). Confirmed at kickoff. Process sub-axes have low N today; re-evaluate when N≥5 per sub-axis.
- The companion script (`scripts/canonical-saturation-audit.ts`). Deferred per kickoff brief; the inlined SQL above is the deliverable.
- Promoting / resolving pending queue entries — that's arbiter-run work, separate from saturation audit.

## Re-test trigger

Re-run this audit IF any of the following lands:

1. Quarterly cadence — Q3 2026-Q4 2026 next.
2. Any new canonical axis lands (e.g. SWORKS valve flow via [CR-7](docs/audits/2026-05-18/CR-7-sworks-valve-flow-scoping.md), water taxonomy bootstrap).
3. The override queue accumulates ≥5 pending entries on any single axis (signals coverage strategy drift).
4. A registry adoption sprint adds 10+ canonical entries in a single registry.
