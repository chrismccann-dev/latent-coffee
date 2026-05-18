# Pour-over discriminator gate + optimized brew lifecycle states (near-term sprint)

Captured 2026-05-18 during Round 7 wrap-up. Chris surfaced this as a real product expansion he wants modeled in the system. **Priority framing (Chris-confirmed 2026-05-18)**: this is near-term, not longer-term — it maps onto what Chris actually does in his roasting workflow, and the system should reflect that to prevent Claude Code / claude.ai / Chris drifting away from his real practice.

**Sequencing**: out of scope for the current polish PR (Sprints 6-8 of `post-grilling-sequencing.md`). Triggers after Sprint R (PRODUCT.md/roadmap review) completes — first "new thing to take on" after the 14-sprint post-grilling sequence closes.

## The problem

The xBloom Day 7 cupping gate isolates cup signal from brewing variance (its mechanical consistency is the whole point). But the **delta between xBloom cup and the optimized pour-over brew** is materially larger than instinct suggests:

- Things that perform well at the xBloom gate sometimes **"fall apart"** when pushed to the optimized brew.
- Things with "more elasticity / structure as they cool" tend to perform better when pushed.
- xBloom misranking happens repeatedly on anaerobic naturals and high-process Colombia lots (Sudan Rume Natural V3, Bukure V1, Higuito V1/V2/V3, Wush Wush V1 all showed this pattern across the 2026-05-15 → 2026-05-18 dogfood).

Two distinct workflow steps emerge from this tension that aren't currently first-class in the system:

### Step 1: Interim pour-over discriminator (within a V-set)

Sometimes the operator wants to do an INTERIM "real but non-optimized" pour-over on 1-2 V_n candidates **before declaring a V_n winner** — to see how each candidate performs under real-brew conditions vs xBloom conditions. The recipe isn't iterated to optimization; it's a single shot at a reasonable Balanced Intensity recipe to expose whether the candidate holds up or falls apart.

Trigger: typically on later V-sets (V2 / V3+) when the operator is getting close to a reference roast candidate AND the xBloom gate alone produces an ambiguous or surprising ranking.

Currently claude.ai invents this routing (Round 3 Fazenda Um Path C-1 + Round 7 Higuito V3 Path C-2). The polish PR's A #3 makes Path C explicit but only as a halt — not as a first-class workflow step with its own state.

### Step 2: Reference roast declaration → optimized brew dial-in state

Once a reference roast is declared (from xBloom + interim pour-over data), the lot enters a **distinct phase**: dialing in the real optimized pour-over recipe via the brewing-side workflow. Treat the reference roast like a roasted bean Chris bought — full brewing iteration with all axes (temp, pour pattern, agitation, brewer, filter, dose, ratio, grind setting) actively dialed.

The optimized brew is the **actual deliverable** for the lot — it's the consumption-condition cup. The reference roast is the intermediate artifact; the optimized brew recipe is what closes out the lot's value.

Currently the system kind of conflates "reference roast declared" with "lot closed" (lifecycle state `resolved`). But there's a real sub-state where the reference is declared but the optimized brew hasn't been finalized yet — the lot is in active brewing-side iteration.

## Proposed lifecycle expansion

Today (after PR #157 + PR #158):
- In inventory
- Waiting for next roast
- Waiting for next cupping
- Resolved-pending (informal, prompt-level only)
- Resolved

Proposed:
- In inventory
- Waiting for next roast
- Waiting for next cupping (xBloom Day 7)
- **NEW: Waiting for pour-over discriminator** (when operator triggers — manual override on a V-set with ambiguous xBloom ranking; blocks STAGE 4 routing on `log-cupping.md` until 1-2 candidates have a real-pourover cupping)
- **NEW or expansion: Optimizing reference brew** (after reference roast declared, before lot is fully closed — brewing-side iteration on the reference roast as if it were a purchased roasted bean)
- Resolved (fully closed with optimized brew recipe pushed + roast_learnings written)

## What this means for the data model

Likely changes (subject to design conversation when this sprint is scheduled):

- **No new lifecycle state column** if we keep the implicit derivation pattern from `lib/lifecycle-state.ts` — the new states derive from existing data. "Waiting for pour-over discriminator" = experiment has xbloom_gate cuppings but operator has declared via some flag that pour-over discriminator is needed AND those cuppings aren't yet present. "Optimizing reference brew" = a roast has `is_reference: true` BUT no `brews` row exists for that roast yet.
- **OR explicit state column** if the helper logic becomes too complex. Probably a `green_beans.lifecycle_state_override` text column for operator-asserted state when derivation isn't sufficient.
- **`experiments.pour_over_discriminator_requested` boolean** OR a more flexible operator-flag system for the Step 1 trigger.
- **`brews.is_optimized_reference_brew` boolean** OR FK relationship distinguishing the optimized brew from interim brews for the Step 2 state. This brew is the lot's deliverable.

## What this means for the prompts

- **`log-cupping.md`**: STAGE 4 routing gets a new operator-input branch: "Is a pour-over discriminator needed on this V-set before next-step routing?" If yes → state transitions to Waiting for pour-over discriminator + a separate prompt (or extension) handles the pour-over cupping push when the discriminator data lands.
- **New prompt OR extension to log-cupping.md**: handles the pour-over discriminator cupping push. Reuses push_cupping with `recipe_variant` distinguishing the discriminator data from the xbloom_gate data (e.g. `recipe_variant: "interim_pourover"` or `"discriminator_pourover"`).
- **New prompt OR extension to close-lot.md / one-shot-closeout.md**: handles the optimized brew dial-in iteration. The brewing-side prompts (`start-brew.md` / `log-brew.md` / `bundled-brewing-completion.md`) already cover the iterative brewing work; the close-out prompt needs to know to **wait** for the optimized brew to be done before writing `roast_learnings` + archiving.

## What this means for the page

`/green/[id]` gets two new lifecycle-state renders:
- **Waiting for pour-over discriminator** page shape: surfaces the xBloom rankings + asks for the discriminator data + flags which candidates the operator selected for the pour-over comparison.
- **Optimizing reference brew** page shape: surfaces the declared reference roast + the brewing iteration history + the current best-known recipe.

Both probably reuse existing components (`<RoastLogTable>`, `<ReferenceRoastCard>`, `<BrewIterationCard>`) with new conditional rendering.

## Roast intelligence patterns this would capture better

The current system already records xBloom vs real-pourover cup deltas via `recipe_variant` on `cuppings`, but the **operator's decision-making** around when to trigger the discriminator gate isn't captured. The new state would:

- Record WHICH V-sets triggered the discriminator (vs which closed cleanly on xBloom alone)
- Record which discriminator outcomes inverted vs confirmed the xBloom ranking — feed back to a Cross-Coffee Insight Layer pattern: "anaerobic naturals from Y origin show xBloom inversion at rate Z%"
- Surface the discriminator decision in `roast_learnings` as a per-lot fingerprint: "this lot needed pour-over discriminator at V3" vs "this lot closed cleanly on xBloom alone"

## Why this isn't in the current cleanup sprint

The current polish PR (~25 items, Sprints 6-8 of `post-grilling-sequencing.md`) is focused on **fixing friction discovered during dogfood Rounds 1-7** — prompt edits + schema descriptions + page reorders. The pour-over discriminator + optimized brew dial-in is a **product expansion**, not a friction fix. It introduces new states, possibly new schema columns, new prompt files, and new page renders.

Sequencing per Chris (2026-05-18):

1. **Polish PR ships first** (= Sprints 6-8 in post-grilling-sequencing.md). Closes the dogfood Rounds 1-7 friction queue.
2. **Grill-with-docs followups ship next** (= the rest of post-grilling-sequencing.md — Sprints 0-5 pre, Sprints 9-14 post, Sprint F sync, Sprint R roadmap review). Multi-sprint sequence with detailed scope already drafted.
3. **This sprint** ships as the first item post-Sprint-R. Near-term priority, not deep longer-term — maps onto Chris's actual practice and should be in the system soon.

## Working name

**"Pour-over discriminator gate + optimized brew dial-in"** sprint. Or shorter: "Brew-side lifecycle expansion."

## Reference back

- Round 3 (Fazenda Um) and Round 7 (Higuito V3) both showed claude.ai inventing Path C-like routing for this exact scenario. The polish PR's A #3 makes Path C a first-class halt; this future sprint elevates it to a first-class workflow state.
- Higuito V3 (the conversation that surfaced this) is currently in `Resolved-pending` state blocked on real-pourover discriminator. When Chris runs that comparison + close-lot.md, that's the operational manifestation of what this sprint would model first-class.
- Discussion in feedback_mcp_continuous_log.md Round 7 captures the immediate dogfood signals; this doc captures the longer-term product framing.
