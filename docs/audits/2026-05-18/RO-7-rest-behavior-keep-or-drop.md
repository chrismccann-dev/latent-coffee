# RO-7 — `roast_learnings.rest_behavior` keep-or-drop decision

**Source**: [grilling-2026-05-14-followups.md item #7](docs/sprints/grilling-2026-05-14-followups.md)
**Sprint**: T5 (2026-05-18)
**Decision**: **Keep as-is. Reframe the description; do not relocate.**

## Question

Per the 2026-05-14 roasting grilling, the field was framed as "currently unused (Chris targets day-7 xBloom universally); will become useful if/when rest-time-as-variable enters scope (WBC-style work)." Decision needed: keep as forward-investment, rename, relocate, or drop.

## Pre-flight data

```sql
SELECT COUNT(*) AS total_lots,
       COUNT(rest_behavior) AS rest_behavior_pop,
       COUNT(why_this_roast_won) AS why_pop,
       COUNT(aromatic_behavior) AS aromatic_behavior_pop,
       COUNT(structural_behavior) AS structural_behavior_pop
FROM roast_learnings;
-- total_lots=7, rest_behavior_pop=3 (43%), why_pop=3, aromatic_behavior_pop=7, structural_behavior_pop=7
```

The "currently unused" framing is wrong. 3 of 7 closed lots have populated rest_behavior content, matching the 3 lots with populated `why_this_roast_won` — i.e. the lots that received full close-out fills also got rest-behavior fills. Lots with partial close-out (Oma / Surma / Libertad / El Socorro) have NULL on both fields.

Content shape (verbatim excerpts):

> "Day 7 pourover is the correct evaluation gate. Day 0 cuppings were directionally useful but reversed the winner (Day 0 favored Batch 102; Day 7/10 favored Batch 103 in V1). Day 6 evaluations were close to correct but slightly earlier than optimal — the coffee continues to open and integrate between Day 6 and Day 8. Real brew session (April Brewer rather than xbloom) is a required step before declaring a reference roast — the xbloom evaluation recipe consistently under-expressed the caramel and body character that the optimized brew revealed. Cup improves and sweetens as it cools — always evaluate at warm to cool (50–45°C), not hot. Acidity sharpens at cool if not fully integrated at the roast level; this is both a tasting signal and a brew adjustment signal."

> "Day 7 pourover is the correct evaluation gate. Day 4 cupping was actively misleading across multiple sessions — batches reversed ranking completely between Day 4 and Day 7 (most dramatically: #111 reversed from flat to vanilla-fruit-raspberry between Day 4 and Day 10). Day 5 pourover is slightly too early — #133 tasted at Day 5 read muted; same batch at Day 6–7 with optimized recipe produced full reference cup. Day 6 confirmed as directionally reliable for winner selection (V6 evaluation, #148 correctly identified). Rest in foil bags with degassing valve — sandwich bags insufficient for 7-day rest on this style of roast."

> "Day 7 pourover only — Day 4 not evaluated per V4 protocol. Cup at Day 7 was integrated at warm-to-cool stage (51-53C peak) with degradation below ~50C atypical of Clarity-First confirmations elsewhere in archive."

This is rich operational signal: Day-N evaluation drift, Day-7 gate confirmation, April-brewer-vs-xBloom comparison, foil-bag-vs-sandwich-bag storage observation, temperature-window behavior. None of this is "rest-time-as-variable" theory work — it's lived practice documenting how rest interacts with the evaluation pipeline.

## Decision

**Keep as-is. Reframe the description.** The current description in `push_roast_learnings` Tool ("rest behavior — how the cup evolves with rest time, e.g. peaks at day 7, plateau through day 14") is too narrow and reads as forward-investment-only. The lived practice has populated it with three distinct content threads:

1. **Day-N evaluation drift** — which days mislead, which day is the gate
2. **Cross-cup vehicle comparison** — xBloom evaluation cup vs April-brewer optimized brew on the same lot
3. **Storage + temperature observations** — bag type, evaluation-temperature window

A reframed description should encode these three threads as the field's scope, not "rest behavior" abstractly.

**Not relocating.** The grilling considered moving `aromatic_behavior` + `structural_behavior` from `roast_learnings` to `cuppings` (Sprint 11 RO-6) because those describe a cup, not a lot lesson. `rest_behavior` is structurally different — it describes the rest-curve pattern across multiple cuppings on the lot. Cup-level relocation would lose the cross-cupping aggregation. Lot-level placement is correct.

**Not renaming.** "Rest behavior" is the accurate noun for the cross-cupping rest-curve pattern. Alternatives considered:

- `evaluation_protocol` — too narrow (omits the storage and temperature threads)
- `rest_and_evaluation_notes` — accurate but verbose
- `rest_curve` — too narrow (omits non-curve threads like bag type)

The two-word `rest_behavior` is the cleanest name; rename adds churn for no real gain.

## Recommended action

1. Update `lib/mcp/push-roast-learnings.ts` + `patch-roast-learnings.ts` Zod description for `rest_behavior` to encode the three-thread reframe.
2. Update `docs/prompts/close-lot.md` + `one-shot-closeout.md` STAGE 4 fill prompts to surface the same three threads as the question shape.
3. Cross-check the existing 3 populated rows against the reframed description — they all already fit. No data migration needed.

NONE of the three actions ship in T5 — this is a decision-doc-only sprint. The reframe rides along with whichever future post-dogfood roasting-side sprint touches `push_roast_learnings` Tool descriptions (likely Sprint 10 — the bundle that ships RO-1 `elasticity → brewing_tolerance` rename + RO-3 `terroir_takeaway` column).

## Pairs with

- Sprint 10 bundle (RO-1 + RO-2 + RO-3 + RO-4) — natural ride-along for the description reframe; same Tool + same prompt files.
- The "rest-time-as-variable" future work the original grilling flagged — if/when WBC-style rest-curve experiments enter scope, the `rest_behavior` content scope will widen to encompass structured per-day measurements. The existing field accommodates that growth without schema change.

## Out of scope for T5

- Tool description rewrite.
- Prompt rewrites.
- Any migration or rename.
