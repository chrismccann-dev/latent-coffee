# BR-4 — `brews.extraction_confirmed` retirement evaluation

**Source**: [grilling-2026-05-15-brewing-followups.md item #4](../../sprints/grilling-2026-05-15-brewing-followups.md)
**Sprint**: T5 (2026-05-18)
**Decision**: **Keep + reframe**. Do not retire.

## Question

Per round 8 of the 2026-05-15 brewing grilling, Chris flagged `extraction_confirmed` as "probably a little dated at this point" because the Coffee Brief's upstream wrong-zone prevention has subsumed its original gut-check role. The brief framed it as "fires rarely." Decide: retire / deprecate / reframe / keep as-is.

## Pre-flight data

```sql
SELECT COUNT(*) AS total_brews,
       COUNT(extraction_confirmed) AS populated,
       COUNT(*) - COUNT(extraction_confirmed) AS null_rows
FROM brews;
-- total=82, populated=30 (37%), null=52 (63%)
```

37 percent is not "fires rarely." Closer inspection of the populated rows shows three distinct content shapes co-living in the field:

| Shape | Approximate count | Example | Signal type |
| --- | --- | --- | --- |
| Bare strategy re-statement | ~14 | `"Balanced Intensity"` / `"Clarity-First"` | Affirmation only |
| Affirmative prose | ~9 | `"Yes — Brew 3 at 93°C / Dial 6/6/6 / EG-1 6.5 locked in"` | Affirmation + decision context |
| Divergence callout | ~7 | `"No — strategy was Clarity-First but filter substitution (B3 for FAST) delivered Balanced-adjacent execution. File as reference, not as confirmed recipe."` / 3 cases of `Hybrid → "Balanced Intensity"` confirmed at brew time | Strategy-divergence signal (the load-bearing case) |

The premise that the field "fires rarely" is wrong. The premise that Coffee Brief upstream prevents the gut-check from firing is also partially wrong — 7 of 30 populated rows are real strategy-divergence captures the upstream pipeline did not catch.

## Decision

**Keep the column. Reframe its semantics.**

The original framing ("gut-check that the strategy I planned matches what I tasted") still applies. The reframe is narrower scope:

1. **Bare strategy re-statements add no signal** — when the field just repeats `extraction_strategy`, it is redundant. Future writes should leave it null in this case.
2. **Affirmation prose with decision context IS load-bearing** — the "Brew 3 at 93°C / Dial 6/6/6" type entries record the specific recipe variant that locked the strategy in. This is the right content shape.
3. **Divergence callouts are the most load-bearing case** — Hybrid → Balanced Intensity, Clarity-First but B3-filter-delivered-Balanced, signature method override that downshifted strategy. These are signal the upstream Coffee Brief did not catch; the column is the only place that records them.

## Recommended action

Update the BREWING.md Step 4 description + `push_brew` Tool description to encode the narrower scope:

> `extraction_confirmed` — populate ONLY when (a) the brew confirmed the strategy with a specific recipe-decision noteworthy enough to record, OR (b) the brew tasted as a different strategy than planned. Leave null when bare re-statement is the only thing to say.

No schema change. No migration. No retirement.

## Pairs with

- BR-5 (`is_process_dominant` evaluation) — sister "is this field still earning its keep?" question. Both land as keep + reframe.
- The Coffee Brief Step 4 description in BREWING.md — the prompt-side reframe should land in the doc-edit pass for whichever sprint touches Step 4 next (NOT this sprint — T5 is no-substrate-changes).

## Out of scope for T5

- BREWING.md Step 4 doc edit.
- `push_brew` Tool description update.
- Any migration.

Decision-doc only. Reframe lands as a substrate change in a future brewing-side sprint (Sprint 6+ post-dogfood, riding along with another prompt or Tool-description change).

## Open: a tertiary reframe candidate

The "Yes — confirmed [strategy]" prose pattern bleeds into `what_i_learned` content. If post-dogfood brewing pipeline drift shows the two fields are de facto serving the same role, consider folding `extraction_confirmed` into `what_i_learned` as the structured prefix of a more general "lessons from this brew" field. Not actionable today — would need 1-2 more sprints of populated-rate evidence and lived-practice signal before drawing the line.
