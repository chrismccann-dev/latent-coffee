# CR-13 + MCP-3 — Per-axis canonical-strictness 4-tier mapping

**Source**: [grilling-2026-05-16-canonical-registries-followups.md item #13](docs/sprints/grilling-2026-05-16-canonical-registries-followups.md) + [grilling-2026-05-15-mcp-followups.md item #3](docs/sprints/grilling-2026-05-15-mcp-followups.md)
**Sprint**: T5 (2026-05-18)
**Bundled per kickoff confirmation** — single doc with two sub-sections: registry-side view (CR-13) + MCP-Tool-side view (MCP-3).
**Decision**: **Map every canonical axis to one of 4 strictness tiers; document the per-tier behavior the system encodes. Two follow-up surface gaps surfaced for future sprints — neither blocks T5.**

## Question

Chris's 4-tier framing from round 8 of the 2026-05-15 MCP grilling:

| Tier | Description | Net-new rate |
| --- | --- | --- |
| **strict-static** | Closed, comprehensive registry. NET-NEW is rare and deliberate; arbiter promotion is the only path. | Very low |
| **self-owned** | Latent-owned identity. Adding entries reflects Chris buying new gear or adopting a new instance; deliberate. | Low |
| **closed-objective** | Set is bounded by an external objective standard. Adding entries requires the external standard to change. | Near zero |
| **open-loose** | Real-world long tail. New entries are expected; queue + arbiter handle promotion vs alias. | High |

Per the canonical-registries grilling, today's implementation maps unevenly: strict-static + override-eligible self-owned + override-eligible open-loose all live in `taxonomy_overrides_queue`; flavor + roast-level + process-modifier axes aren't in the queue at all. **Audit per-axis strictness against the 4-tier framing; flag the gaps.**

This doc bundles two angles per the T5 kickoff:

- **CR-13 (registry-side view)**: how each axis's registry encodes strictness — strict / allowOverride / tier-scoped / self-only.
- **MCP-3 (MCP-Tool-side view)**: how each MCP Tool's Zod schema + override-flag wiring exposes the strictness to the claude.ai caller.

## CR-13 — Registry-side per-axis strictness

| Axis | Tier | Registry shape | Override mechanism | Population |
| --- | --- | --- | --- | --- |
| **Terroir** (macro) | strict-static | `TERROIRS` rich; `TERROIR_MACRO_LOOKUP` strict | None — `auto_created` provenance on FK | 121 canonicals + 12 structural aliases |
| **Cultivar** | strict-static | `CULTIVARS` rich; `CULTIVAR_LOOKUP` strict | None — `auto_created` provenance on FK | 63 canonicals + 48 structural aliases |
| **Roast level** | closed-objective | `ROAST_LEVELS`; `ROAST_LEVEL_LOOKUP` strict | None | 8 Agtron-anchored buckets + 22 aliases |
| **Process: base_process** | strict-static | `BASE_PROCESSES` strict | None | 4 canonicals |
| **Process: subprocess** | strict-static | Strict (Honey color tiers) | None | 7 Honey colors |
| **Process: modifiers** | strict-static (4 axes) | Strict per-axis enum | None | ~35 across 4 axes |
| **Process: fermentation_qualifier** | strict-static | `FERMENTATION_QUALIFIERS` strict | None (canonicalize via alias map) | 1 canonical + 3 aliases (T3) |
| **Process: signature_method** | open-loose | `SIGNATURE_METHODS` rich; `SIGNATURE_METHOD_LOOKUP` | None today; queue extension planned (Sprint 12 MCP-1) | 15 canonicals (T1) |
| **Brewer** | self-owned | `BREWERS` rich; `BREWER_LOOKUP` | `brewer_override` flag | 46 canonicals + 24 aliases |
| **Filter** | self-owned | `FILTERS` rich; `FILTER_LOOKUP` | `filter_override` flag | 64 canonicals + 34 aliases |
| **Grinder** | self-only | `GRINDERS` rich; enumerated `validSettings` | `grinder_override` flag (rarely fires) | 1 canonical (EG-1, 51 settings) |
| **Producer** | open-loose | `PRODUCERS` rich; `PRODUCER_LOOKUP` | `producer_override` flag → queue | 120 canonicals + 65 aliases (1l + 2.1) |
| **Roaster** | open-loose | `ROASTERS` rich; `ROASTER_LOOKUP` | `roaster_override` flag → queue | 70 canonicals + 24 aliases (1h.1) |
| **Flavor: base** | open-loose (with arbiter caveat) | `BASE_FLAVORS`; `ALIAS_LOWER_MAP` (112 aliases) | None | 182 canonicals + 112 aliases |
| **Flavor: modifier** | open-loose | `FLAVOR_MODIFIERS`; module-level lookup | None | 43 canonicals |
| **Flavor: structure_tag** | strict-static | `STRUCTURE_TAGS` strict | None | 29 across 7 axes |

### Tier rollups

- **strict-static**: 8 axes (terroir / cultivar / base_process / subprocess / 4 modifier-axes / fermentation_qualifier / structure_tag)
- **closed-objective**: 1 axis (roast_level)
- **self-owned**: 2 axes (brewer / filter)
- **self-only**: 1 axis (grinder; future SWORKS via [CR-7](docs/audits/2026-05-18/CR-7-sworks-valve-flow-scoping.md); future water taxonomy)
- **open-loose**: 4 axes (producer / roaster / signature_method / flavor_base + flavor_modifier)

### Registry-side gaps

1. **`flavor_base` + `flavor_modifier` are open-loose but have no override-flag wiring.** Per Chris's CONTEXT.md flagged-ambiguity, these axes are "comprehensive with an arbiter caveat" — bases earn structural aliases instead of override flags. Promotion only happens when a base shows up repeatedly across many coffees AND can't be expressed via a modifier on an existing base. Defensible policy; the arbiter caveat IS the override path.
2. **`roast_level` has no queue support either.** Closed-objective by design — Agtron buckets are externally anchored. No override path is the correct design.
3. **`signature_method` has no queue support TODAY but should.** Confirmed open follow-up in Sprint 12 MCP-1 (joining `taxonomy_overrides_queue` as an override-eligible axis). T5 confirms the gap but doesn't ship the fix.
4. **`process_modifiers` (4 axes) have no override path.** Per the canonical-registries grilling's "qualifier vs modifier" framing: aggregation level lives at the modifier (Anaerobic), so each modifier-axis IS the canonical surface. Adding modifiers should be deliberate doc-edits, not write-time override paths. Defensible policy; the rare net-new modifier proposes through `doc_proposals` instead.

## MCP-3 — MCP-Tool-side per-axis strictness exposure

Per [SYNC_V2.md](../../../SYNC_V2.md), MCP Tools that write canonical-axis values either:

- **Strict validation** — Zod schema rejects non-canonical input; caller must canonicalize or fail
- **Allow-override** — Zod schema accepts `*_override: true` flag alongside; falls through to queue
- **Provenance-flagged** — FK lookup auto-creates with provenance flag if not in registry
- **Free-text** — no canonical enforcement (cooling_curve_target, strategy_notes, etc.)

### `push_brew` strictness exposure

| Field | Tier | Enforcement |
| --- | --- | --- |
| `extraction_strategy` | strict-static | Strict enum |
| `hybrid_subform` | strict-static | Strict enum (conditional on Hybrid) |
| `producer` | open-loose | Allow-override (`producer_override`) |
| `roaster` | open-loose | Allow-override (`roaster_override`) |
| `brewer` | self-owned | Allow-override (`brewer_override`) |
| `filter` | self-owned | Allow-override (`filter_override`) |
| `grinder` | self-only | Allow-override (`grinder_override`) |
| `grind_setting` | self-only | Strict (must match enumerated valid setting) |
| `roast_level` | closed-objective | Strict (canonical from registry only) |
| `base_process` | strict-static | Strict |
| `subprocess` | strict-static | Strict (when base=Honey) |
| `fermentation_modifiers[]` | strict-static | Strict array |
| `drying_modifiers[]` | strict-static | Strict array |
| `intervention_modifiers[]` | strict-static | Strict array |
| `experimental_modifiers[]` | strict-static | Strict array |
| `fermentation_qualifiers[]` | strict-static | Strict array (Anoxic only; aliases resolve) |
| `signature_method` | open-loose | Strict TODAY (queue extension planned Sprint 12) |
| `terroir_name` + `country` | strict-static | Find-or-create via lookup; `auto_created` provenance |
| `cultivar_name` | strict-static | Find-or-create via lookup; `auto_created` provenance |
| `flavors[].base` | open-loose-with-arbiter | Strict canonical-resolve via cleanFlavors (aliases resolve via ALIAS_LOWER_MAP) |
| `flavors[].modifiers[]` | open-loose | Strict canonical-resolve via cleanFlavors |
| `structure_tags[]` | strict-static | Strict canonical-resolve via cleanStructureTags |
| `extraction_strategy_modifiers[]` (jsonb) | strict-static | Strict via cleanModifiers (4 canonical types) |

### MCP-side gaps

1. **`signature_method` strictness mismatch with tier**: open-loose tier today but strict enforcement. Sprint 12 MCP-1 closes the gap by adding queue support.
2. **`extraction_confirmed` is free-text but post-[BR-4](docs/audits/2026-05-18/BR-4-extraction-confirmed-retirement.md) reframe should describe the narrower scope**. Tool description update lands in a future brewing-side sprint per BR-4 recommendation.
3. **`cooling_curve_target` is free-text** with no canonical home today. Per BR-3, future promotion to a `cooling_curve_design` modifier is a possibility but population is too low to justify today. Leave as free-text.

## Per-tier behavior locked

Each strictness tier encodes a specific operational policy. Document inline so future-Claude reads the per-axis behavior coherently:

### strict-static

- **Registry**: comprehensive, closed-ended; promotion via 2-step deliberate edit.
- **MCP Tool**: strict Zod enum or strict canonical-resolve; rejects non-canonical input.
- **Override path**: none (modifier / process axes) OR `auto_created` provenance on FK (terroir / cultivar).
- **Arbiter role**: doc proposals via `propose_canonical_addition`.
- **Net-new expectation**: rare; deliberate.

### closed-objective

- **Registry**: bounded by external standard (Agtron buckets, taxonomic hierarchy).
- **MCP Tool**: strict; canonicalize on write.
- **Override path**: none.
- **Arbiter role**: only triggered if the external standard changes (extremely rare).
- **Net-new expectation**: near zero.

### self-owned (comprehensive)

- **Registry**: comprehensive within Chris's owned gear / processes.
- **MCP Tool**: allow-override flag; queue catches NET-NEW.
- **Override path**: `*_override: true` flag → `taxonomy_overrides_queue`.
- **Arbiter role**: walks queue, decides promote / alias / reject.
- **Net-new expectation**: low — adding entries reflects Chris buying new gear or adopting a new pattern.

### self-only

- **Registry**: single-instance (EG-1 grinder, future SWORKS); enumerated settings live on the entry.
- **MCP Tool**: allow-override; setting-value strict against enumerated list.
- **Override path**: rare; usually rejected.
- **Arbiter role**: occasional rich-content backfill as Chris measures new settings.
- **Net-new expectation**: very low.

### open-loose (with arbiter)

- **Registry**: tier-scoped (producer/roaster/signature_method) or comprehensive-with-arbiter-caveat (flavor base + modifier).
- **MCP Tool**: allow-override flag; queue catches NET-NEW.
- **Override path**: `*_override: true` flag → `taxonomy_overrides_queue` (producer / roaster) OR via `propose_canonical_addition` (flavor).
- **Arbiter role**: walks queue + flavor-promotion proposals; decides per axis.
- **Net-new expectation**: high — real-world long tail.

## Recommended action

1. **Lock the 4-tier framework in CONTEXT.md.** Resolve the flagged-ambiguity at [CONTEXT.md line 1507](../../../CONTEXT.md) — the resolution is "per-axis strictness maps to one of 4 tiers; per-tier behavior is documented above. The implementation is non-uniformly coded today on purpose, not as drift — flavor + roast-level + process-modifier axes legitimately don't have queue support, for reasons matching their tier."
2. **Resolve the `signature_method` strictness gap** in Sprint 12 (MCP-1: signature method as override-eligible axis on `taxonomy_overrides_queue`).
3. **No registry edits, no MCP Tool surface edits in T5**.

## Pairs with

- [CR-6 strategy tag ↔ extraction strategy coherence](docs/audits/2026-05-18/CR-6-strategy-tag-extraction-strategy-coherence.md) — both vocabularies are strict-static; the coherence audit confirmed they describe distinct lifecycle stages.
- [CR-11 saturation audit](docs/audits/2026-05-18/CR-11-saturation-audit.md) — saturation rate per axis confirms each tier's policy actually holds in practice (95-96% target met everywhere except producer at 98.8%, single-row drift).
- The CONTEXT.md flagged-ambiguity close at line 1507 — closes inline at sprint close-out.

## Out of scope for T5

- The Sprint 12 MCP-1 signature_method queue extension.
- Any registry restructuring (per-axis policy is locked, no shape change).
- Any new override mechanism on flavor / roast_level / process_modifiers (their tiers don't require it).
