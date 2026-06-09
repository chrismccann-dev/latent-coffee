# Lot close-out

The Coordinator's final arc, once reference roast + optimized brew both exist. **Canonical:** [ADR-0024 § 3](docs/adr/0024-lot-coordinator-claude-code-native.md). Supersedes the old `close-lot.md` STAGE flow once the grace-handoff retires it.

## Preconditions (read the pipeline first)

`get_bean_pipeline` + confirm: reference roast exists with a recipe link; experiments have winners; no existing `roast_learnings` row; the optimized `brew_id` is in the DB; the lot is in a resolvable state.

## Steps

1. **Mark reference.** `patch_roast`: `is_reference: true`, `worth_repeating: yes`, reference basis. (Distinct from the per-V-set *experiment winner* — don't over-patch historical experiment winner fields; the lot-level reference designation lives on the roast + in `roast_learnings`.)
2. **Write `roast_learnings`.** `push_roast_learnings` with `best_roast_id` + the 14 prose fields + the 4 `*_scope_tags` arrays. Capture the lived distinctions the lot taught — e.g. `evaluation_strategy` vs `optimized_drinking_strategy` when the V-set winner was confirmed under one brew strategy but the locked drinking recipe landed on another.
3. **Tie the optimized brew.** Link the optimized `brew_id` to the lot (the brew itself was pushed brewing-side via `push_brew`; the Coordinator records the linkage). Self-roasted optimized brews flow through close-out, not standalone purchased-brew completion.
4. **Scope the substrate-fold (do NOT apply).** Author a sharp, scoped substrate-fold plan: which cluster docs / CONTEXT entries / registry rows the `roast_learnings` imply (active-lot retirement, closed-lot learnings doc, cross-coffee insight, process-family pattern). Hand it to a **fresh execution session** that applies it via `propose_doc_changes`. This is the close-time doc-proposal job that the old `log-cupping.md` did inline — moved here, and to a separate role, per the one-skill-one-job decomposition. Apply the formalization tax + cross-project ratification gate: a single-lot finding does not graduate to a cluster primitive until a second lot confirms it.
5. **Archive Roest inventory.** `patch_inventory`: `is_archived: true`. Only on successful close — a failed SPG keeps the lot active and does NOT archive.
6. **Flip `lot_status → resolved`** (or `unresolved` if closing without a clean reference). Update the Brief's close-out block + the substrate-fold plan pointer.

## Confirmation output

green_bean_id · reference roast id + why it won · `roast_learnings` id · optimized `brew_id` · substrate-fold plan pointer · inventory archived · final `lot_status`. The `/green/<id>` resolved view then renders the reference roast recipe + reference cup + optimized brew + the roast-learnings block.

## Close-out retro (the self-improvement signal)

At close, the Coordinator + operator run a short retro: what surfaced in this lot that should refine a cluster primitive? Recurrence-gate it (N=3) before graduating; anti-lawyer-redline safeguard — only genuine friction-reducers, never busywork ([ADR-0023](docs/adr/0023-self-improving-skill-loop.md)). The first dogfood lot's retro is expected to revise these very cluster docs.
