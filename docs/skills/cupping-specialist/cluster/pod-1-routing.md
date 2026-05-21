# POD-1 routing — simulated pourover gate + Path C rewrite scoping

**Status:** SCOPING DRAFT (carried forward from `docs/sprints/pod-1-scoping-draft-2026-05-26.md`). The full Path C-1/C-2 rewrite + simulated-pourover schema decisions are GATED on the lived-practice trigger conditions below.

**Why this lives here:** Per Wave 3 PR 3 scope decision (2026-05-26), POD-1's scope is *absorbed* into Cupping Specialist at the SKILL.md level but the *implementation* (Path C rewrite + schema decisions) waits for cross-thread observation. This cluster doc holds the scoping context + trigger conditions so a future sprint can lift it without re-grokking the original draft.

## Today's Path C-1/C-2 substrate (kept intact)

`log-cupping.md` STAGE 4 currently encodes:

- **Path A** — leading slot is reference-quality, route to close-out (Chain 1)
- **Path B** — design V_(n+1), iterate (Roasting Assistant for next V-set)
- **Path C-1** — pre-V_(n+1) calibration when peer-roasted reference cup is missing
- **Path C-2** — back-to-back dual cupping when V_n result is cup-side ambiguous

Cupping Specialist's SKILL.md § Path routing documents all four paths as ACTIVE. No rewrite this PR.

## The POD-1 framing (kept dormant)

Chris's lived workflow has **three cup-reads** on a V-set lot, not the two today's substrate models:

| # | Cup-read | Today's substrate representation |
|---|---|---|
| 1 | **xBloom cupping** (Brian Quan recipe, Day 7, normalized across all slots) | `push_cupping` with `recipe_variant: "xbloom_gate"` — the sole decision gate per substrate |
| 2 | **Simulated pourover** (non-optimized pourover-shape recipe in actual brewing setup; preview of what the roast might taste like as an optimized brew) | **Not modeled.** Chris does this as he nears reference (~V3+); not a `cuppings` row, not a `brews` row |
| 3 | **Optimized brew** (full brewing-project dial-in on the reference roast, several iterations) | `push_brew` with `source: "self-roasted"` + `roast_id` FK at lot close-out |

The middle read (simulated pourover) is the diagnostic Chris uses to validate that a candidate reference roast will work as an optimized brew BEFORE committing it as THE reference. Lives entirely in claude.ai thread prose today.

## Trigger conditions for the Path C rewrite

The scoping draft explicitly lists four observation gates. **All four should be met before the rewrite ships.**

1. **2-3 more V-set lots progressing through Path A** — verify Chris's "I do simulated pourovers as I near reference" pattern reliably across multiple lots, not just one
2. **At least one one-shot close-out** — clarify whether the simulated-pourover concept applies to one-shots (likely not — one-shot has 1 cup read, no V-set iteration → no simulated-pourover need; but confirm with lived evidence)
3. **The Stefano Um / Bukure / Higuito lots in flight** — capture how Chris actually decides to do or skip a simulated pourover; is it always when nearing reference, or only on coffees that are cup-side ambiguous?
4. **C-2 disambiguation cases** — did claude.ai ever propose Path C-2 in a real session? If never observed in lived practice, that's strong evidence to deprecate Path C-2

When the gates are met, surface a POD-1 follow-up sprint with the three rewrite-direction options below.

## Rewrite direction options (DEFERRED — pick during follow-up sprint, not now)

- **(a) Replace C-1/C-2 with a "simulated pourover gate" path** — closer to what Chris actually does, single concept rather than two variants
- **(b) Preserve C-1/C-2 as dormant substrate** — they might match a future workflow shape even if not used today
- **(c) Hybrid: rename C-1 to the simulated-pourover gate; deprecate C-2** — single-cup-pre-reference is the real pattern; the dual-cupping disambiguation may be dead substrate

## Schema scoping (DEFERRED — pick during follow-up sprint, not now)

If the simulated pourover earns substrate representation, three candidate shapes:

- **`cuppings.eval_method = 'Simulated Pourover'`** — natural home alongside the existing `Pourover` (xBloom Day-7 gate) + ad-hoc others. New canonical added to the enum-via-substring; all standard cupping prose fields populate.
- **`brews.is_simulated_pourover: boolean`** with `source: "self-roasted"`. Carries the recipe (brewer/filter/dose/water/grinder/grind_setting/temperature). UI implications on `/green/[id]` ResolvedView + `/brews` index — flag determines whether the row shows as the optimized brew or a simulated preview.
- **Hybrid:** `cuppings` row for the cup-side observation + `brews` row for the recipe, linked by FK. Higher fidelity but more moving parts.

Open question: does the simulated pourover include a recipe? If yes, `brews` (option 2 or 3); if no, `cuppings` (option 1) suffices.

## Cross-project handoff lifecycle states (DEFERRED scoping)

Chris's lived workflow steps 11-12: pick reference roast in roasting project → switch to brewing project for optimized brew dial-in via standard brewing flow → bring results back to roasting project for close-lot.

Today's substrate handles the data routing manually (`close-lot.md` STAGE 4 accepts paste-by-recipe or reference-by-brew_id). What's invisible is the **workflow phase itself**.

Candidate optimized-brew lifecycle states between `resolved_pending` and `resolved`:

- `optimized_brew_pending` — reference roast picked, but optimized brew not yet dialed
- `optimized_brew_in_progress` — brewing-project iteration active
- `optimized_brew_resolved` — push_brew complete, ready for close-lot

Whether these warrant first-class substrate (DB-stored vs derived) is open. Lifecycle helper at `lib/lifecycle-state.ts` would need extension.

## Punted items

- Whether the simulated-pourover recipe has a canonical default (analogous to xBloom Brian Quan as the cupping gate's canonical recipe) or whether it's a free-design discriminator
- Whether the cross-project handoff should be modeled as an automatic state transition or stay manual
- Whether POD-1 folds into a broader rethink of `eval_method` taxonomy on `cuppings`
- Whether the "3 cup-reads" framing extends to one-shots (likely not — one-shot has 1 cup read, the Day 7 xBloom; no V-set iteration → no simulated-pourover need)

## Cross-references

- [`docs/sprints/pod-1-scoping-draft-2026-05-26.md`](../../../sprints/pod-1-scoping-draft-2026-05-26.md) — the source DRAFT that this cluster doc carries forward
- [`docs/prompts/log-cupping.md`](../../../prompts/log-cupping.md) STAGE 4 — current Path C-1/C-2 substrate
- [`docs/prompts/close-lot.md`](../../../prompts/close-lot.md) STAGE 4 — current optimized-brew push
- [`docs/skills/cupping-specialist/SKILL.md`](../SKILL.md) — Cupping Specialist canonical spec; § Path routing for the four ACTIVE paths
- [Architecture Wave 3 PR 3 retro](../../../../../-Users-chrismccann-latent-coffee/memory/) — will land at PR 3 close-out
- 2026-05-26 audit cluster retro (`memory/project_audit_cluster_2026-05-26.md`) — source of the original draft
