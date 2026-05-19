# BR-5 — `brews.is_process_dominant` evaluation at N=82 corpus

**Source**: [grilling-2026-05-15-brewing-followups.md item #5](../../sprints/grilling-2026-05-15-brewing-followups.md)
**Sprint**: T5 (2026-05-18)
**Decision**: **Keep as-is**. Field still earning its keep.

## Question

Per round 11 of the 2026-05-15 brewing grilling, the flag was invented for small-corpus aggregation-skew protection (pre-Latent claude.ai-local-app era). The question: with 82 brews today, does a single Lord-Voldemort-tier brew still move cultivar / terroir / roaster aggregations enough to justify the flag? Decide: retain / retire / generalize.

## Pre-flight data

```sql
SELECT is_process_dominant, COUNT(*) AS n FROM brews GROUP BY is_process_dominant;
-- false=76, true=6 (7.3%)
```

```sql
SELECT roaster, coffee_name, extraction_strategy, process FROM brews WHERE is_process_dominant = true;
```

| Roaster | Coffee | Process | Why flagged |
| --- | --- | --- | --- |
| Moonwake | Project One Light Blue Iris | Anaerobic Yeast Inoculated Raised Bed Generic Honey | Heavy intervention; cup is process-shaped not cultivar-shaped |
| Latent | CGLE Mandela XO — Batch 139 Reference | Anaerobic Co-ferment Natural | XO signature; canonical Lord-Voldemort case |
| Picolot | Janson Green-Tip Gesha 1010 (Balanced Intensity copy) | Anaerobic Yeast Inoculated Slow Dry Natural | Comp-edition heavy process |
| Hydrangea | Gesha Luna Bermudez Finca El Paraiso | Double Anaerobic Thermal Shock Yeast Inoculated Washed | Diego Bermúdez's heaviest tier |
| Hydrangea | Basha Bekele Kokose | Anaerobic Natural | Lord-Voldemort co-ferment |
| Picolot | Janson Green-Tip Gesha 1010 (Hybrid copy) | Anaerobic Natural | Heavy-process Gesha read |

All 6 sit at the "this brew's learnings have constrained generalizability" boundary the original framing was designed to catch. None of the 6 are bare Anaerobic / Yeast Inoculated entries that the rest of the corpus shows up to 16 times — the flag is genuinely reserved for outliers, not over-applied.

## Aggregation impact check

`getCultivarEntry('Gesha')` corpus today is ~34 brews. Without `is_process_dominant`, two Janson Green-Tip 1010 + one El Paraiso Luna + one Janson Heaviest-tier would pull the Gesha capsule toward "heavy co-ferment / thermal shock" framing. With the flag, the Gesha synthesis adapter can either exclude or down-weight these brews from the capsule's modal description.

(Aside: the synthesis adapters today do NOT consume `is_process_dominant` — Sprint 4's per-entity directed synthesis took the field as "future filter" but did not implement filtering. Surfacing this as an open question below; not a T5 deliverable.)

## Decision

**Keep as-is.** The flag is rare-by-design (7.3% over a curated heavy-process subset), surfaces the exact cases the framing was invented for, and provides a future filter point for synthesis adapters. Retirement would lose a real signal.

**Not generalizing** to a more abstract "constrained generalizability" flag. The original framing intentionally encodes a specific cause (heavy process drowning the cultivar / terroir signal), not a generic "this is unusual" tag. A generic flag would invite drift into over-flagging.

## Recommended action

None this sprint. Two open items the decision surfaces (NOT action items for T5):

1. **Synthesis adapter wiring** — the field exists but no adapter reads it. The 4 per-entity adapters (terroir / cultivar / process / roaster) should at minimum carry an `excludeProcessDominant?: boolean` weighting tuple. Defer to a future synthesis-pipeline sprint (SYN-6 area, post-Sprint 13).
2. **Roasting-side analog (item #9 in the same grilling file)** — same flag on `green_beans` / `roast_learnings` for Lord-Voldemort green lots. Today's inventory (13 lots, 7 closed) has no candidate; defer per the followup's own trigger ("if Chris ever buys a Lord-Voldemort-tier green-bean lot").

## Pairs with

- BR-4 (extraction_confirmed retirement evaluation) — sister "is this field still earning its keep?" question. Both land as keep.
- The grilling followup item #9 (roasting-side `is_process_dominant` analog) — same question on the roasting side; same defer-until-trigger.

## Out of scope for T5

- Adapter wiring (no code edits).
- Roasting-side analog (no schema work).
