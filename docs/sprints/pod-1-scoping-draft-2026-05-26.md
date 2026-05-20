# POD-1 — Pour-over discriminator gate + optimized brew lifecycle states (scoping DRAFT)

**Status:** DRAFT — preliminary scoping from one workflow walkthrough thread (2026-05-26 audit cluster). Needs more brainstorming + cross-thread observation before treating as definitive.

**Provenance:** Surfaced during the Surface-3 roasting workflow audit. Chris's G4 answer + steps 9-12 of the lived-workflow walkthrough revealed a substrate-practice gap that the existing log-cupping.md Path C-1/C-2 substrate doesn't model. POD-1 already exists on PRODUCT.md's roadmap as the parent item; this doc captures one thread's worth of findings to inform when POD-1 actually gets scoped.

**Not yet captured definitively:** the simulated-pourover concept's exact recipe shape, its lifecycle-state representation, the cross-project handoff modeling, and whether existing C-1/C-2 substrate should be deprecated wholesale or partially preserved. All open.

## What surfaced from the audit thread

### 1. Three distinct cup-reads on a lot, not two

Today's substrate treats the lifecycle as one cup-gate (xBloom Day 7 pourover, `log-cupping.md`) and one optimized brew (`close-lot.md` STAGE 4 push_brew). Chris's lived workflow has **three**:

| # | Cup-read | Today's substrate representation |
|---|---|---|
| 1 | **xBloom cupping** (Brian Quan recipe, Day 7, normalized across all slots) | `log-cupping.md` STAGE 2 push_cupping — the sole decision gate per substrate |
| 2 | **Simulated pourover** (non-optimized pourover-shape recipe in actual brewing setup; preview of what the roast might taste like as an optimized brew) | **Not modeled.** Chris does this as he nears reference (~V3+); not a `cuppings` row, not a `brews` row |
| 3 | **Optimized brew** (full brewing-project dial-in on the reference roast, several iterations) | `close-lot.md` STAGE 4 push_brew — the consumption-condition endpoint |

The middle read (simulated pourover) is the diagnostic Chris uses to validate that a candidate reference roast will actually work as an optimized brew before committing to it as THE reference. Today it lives entirely in claude.ai thread prose; nothing in the DB schema represents it.

### 2. Existing Path C-1/C-2 substrate is over-encoded relative to lived practice

`log-cupping.md` STAGE 4 currently encodes three discriminator paths:

- **Path A** — leading slot is reference-quality, route to close-out
- **Path B** — design V_(n+1), iterate
- **Path C-1** — pre-V_(n+1) calibration when peer-roasted reference cup is missing
- **Path C-2** — back-to-back dual cupping when V_n result is cup-side ambiguous

Chris's G4 answer: **"I only do one xBloom pourover cupping gate at day 7. I will do an additional 'simulated pourover' after this if I'm getting closer to a reference roast and I want to see what a roast might taste like at and end optimized brew."**

C-1 and C-2 substrate exists but doesn't match lived practice. The Sprint 6 / DF-A3 codification may have over-formalized a pattern that's blurrier or absent in Chris's real workflow.

Possible interpretations (DO NOT PICK ONE YET):

- **(a) Replace C-1/C-2 with a "simulated pourover gate" path** — closer to what Chris actually does, single concept rather than two variants
- **(b) Preserve C-1/C-2 as dormant substrate** — they might match a future workflow shape even if not used today, and the dogfood thread (Round 3 + Round 7) did surface them
- **(c) Hybrid: rename C-1 to the simulated-pourover gate; deprecate C-2** — single-cup-pre-reference is the real pattern; the dual-cupping disambiguation may be dead substrate

**Decision deferred.** More cross-thread observation needed (next 2-3 V-set lots progressing through Path A/B routing in lived practice) before locking the rewrite.

### 3. Cross-project handoff (roasting → brewing → roasting)

Chris's lived workflow steps 11-12: pick reference roast in roasting project → switch to brewing project for optimized brew dial-in via the standard brewing flow (`start-brew.md` / `bundled-brewing-completion.md`) → bring results (push_brew brew_id + optimized cup descriptors + reference cup descriptors) back to roasting project for `close-lot.md`.

Today's substrate handles this manually: `close-lot.md` STAGE 4 supports "either paste the optimized brew recipe inline or reference it by an existing brew_id." So the substrate routes the data correctly when Chris pastes/references; what's invisible is the **workflow phase itself**.

**This is the natural locus of POD-1's "optimized brew lifecycle states" half.** Possible states between Resolved-pending and Resolved:

- `optimized_brew_pending` — reference roast picked, but optimized brew not yet dialed
- `optimized_brew_in_progress` — brewing-project iteration active
- `optimized_brew_resolved` — push_brew complete, ready for close-lot

Whether these warrant first-class substrate (DB-stored vs derived) is open.

### 4. New roasting-side cuppings row shape candidate

If the simulated pourover earns a substrate representation, the natural home is the existing `cuppings` table with an `eval_method` distinguisher. Today's enum-via-substring values: `Pourover` (used for xBloom Day 7 gate) and ad-hoc others. A new canonical `eval_method: 'Simulated Pourover'` could land alongside, with all the standard cupping prose fields populated.

Open question: does the simulated pourover include a recipe (brewer/filter/dose/water/grinder/grind_setting/temperature)? If yes, it might need fields that today live on `brews` rather than `cuppings`. Possibly the cleanest model is a `brews` row with `source: 'self-roasted'` + a flag distinguishing it from the final optimized brew — but that has UI implications on `/green/[id]` ResolvedView and `/brews` index.

**Decision deferred until POD-1 scoping picks the schema shape.**

## When to actually scope POD-1

This DRAFT was written from one workflow walkthrough thread. Things to observe before treating any of the above as definitive:

1. **2-3 more V-set lots progressing through Path A** — verify Chris's "I do simulated pourovers as I near reference" pattern reliably across multiple lots, not just one
2. **At least one one-shot close-out** — clarify whether the simulated-pourover concept applies to one-shots at all (the Outcome A path), or only to V-set lots nearing reference
3. **The Stefano Um / Bukure / Higuito lots in flight** — capture how Chris actually decides to do or skip a simulated pourover. Is it always when nearing reference, or only on coffees that are cup-side ambiguous?
4. **C-2 disambiguation cases** — did claude.ai ever propose C-2 in a real session? If never, that's strong evidence to deprecate.

## Punted items

- Whether the simulated-pourover recipe has a canonical default (analogous to xBloom Brian Quan as the cupping gate's canonical recipe) or whether it's a free-design discriminator
- Whether the cross-project handoff should be modeled as an automatic state transition or stay manual
- Whether POD-1 fold into a broader rethink of `eval_method` taxonomy on `cuppings`
- Whether the "3 cup-reads" framing extends to one-shots (likely not — one-shot has 1 cup read, the Day 7 xBloom; no V-set iteration → no simulated-pourover need)

## Cross-references

- [PRODUCT.md § Roadmap](../../PRODUCT.md) — POD-1 parent item
- [docs/prompts/log-cupping.md STAGE 4](../prompts/log-cupping.md) — current C-1/C-2 substrate
- [docs/prompts/close-lot.md STAGE 4](../prompts/close-lot.md) — current optimized-brew push
- [docs/sprints/pourover-discriminator-and-optimized-brew-states-kickoff.md](pourover-discriminator-and-optimized-brew-states-kickoff.md) — prior POD scoping
- 2026-05-26 audit cluster retro (`memory/project_audit_cluster_2026-05-26.md`) — source of this draft
