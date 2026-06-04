# log-cupping STAGE 0 — pre-rewrite state-shape migration (ARCHIVED procedure)

> **Break-glass reference.** This is the full backfill procedure that used to live inline as STAGE 0 of [`log-cupping.md`](log-cupping.md). It was archived out of the every-session prompt on 2026-06-04 (doc-pruning case 006) because **no live lot can trigger it** — every open V-set lot has migrated to post-rewrite shape, and the only NULL-shaped V-sets remaining are historical (already-cupped) early V-sets that do not re-enter `log-cupping`.
>
> `log-cupping.md` keeps a thin detection stub. If detection ever fires (a pre-rewrite lot is re-cupped), pull this doc into the session and run the procedure below. Not MCP-registered — operator-pulled when needed.

## When this runs

V-set lots authored before the 4-prompt rewrite (PR #157) lack the post-roast / pre-cupping prediction fields that the experiment close-out reconciles against. Without backfill, the `delta_from_cup_*` fields have nothing to compare to and the leading-slot prose becomes fuzzy. Detect once, backfill once, then proceed to STAGE 1.

**Writes:** `roast_recipes.predicted_cup`, `experiments.updated_cup_prediction_a/b/c/d`, `experiments.taste_for_a/b/c/d`, and (only for missing-recipe-row cases) `roasts.recipe_id`.

## Detection

Run a minimal `get_bean_pipeline` read. A V_n is **pre-rewrite** when ALL three hold:

- `experiments` row for V_n exists with `batch_ids` populated (V_n was roasted).
- `experiments.updated_cup_prediction_a` IS NULL (no post-roast prediction captured at log-roast time).
- One or more V_n `roast_recipes` rows have `predicted_cup IS NULL`, OR no recipe rows exist for the experiment at all.

If any of the three are false, detection does NOT fire — skip and start at STAGE 1.

## Inline backfill (when detection fires)

Three writes, in order. Each payload is reconstructed from session memory + existing DB state — no fabrication. If a piece is genuinely unknowable from what's in front of you, halt and report which slot's which field is missing; do NOT guess.

### (a) `roast_recipes.predicted_cup` backfill

One `patch_roast_recipe` call per recipe row missing the field. **Always include `was_backfilled: true` + `backfill_notes: "..."`** (Schema sprint S4, migration 057) — the recipe row's design intent is being recovered post-roast, not captured at design time. Standard `backfill_notes` phrasing: `"Recovered from <source> at V_<n> cup, YYYY-MM-DD"` where source is "session chat memory" / "expected_outcomes per-slot split" / "log-roast.md prose".

Reconstruct from `experiments.expected_outcomes` (the design-time per-slot cup hypothesis prose) when it's per-slot-shaped. Worked example:

> `expected_outcomes` reads: "v3a underdev hypothesis: clean attack, possibly hollow middle; v3b structural target — closest to design intent; v3c overrun hypothesis: heavier body, tannin emphasis."

Split into three `patch_roast_recipe(recipe_id, predicted_cup: "...", was_backfilled: true, backfill_notes: "...")` calls:
- v3a: `predicted_cup: "Clean attack, possibly hollow middle - underdev hypothesis."` + `was_backfilled: true` + `backfill_notes: "Recovered from expected_outcomes per-slot split at V3 cup, 2026-05-19"`.
- v3b: `predicted_cup: "Structural target - closest to design intent."` + `was_backfilled: true` + `backfill_notes: "..."`.
- v3c: `predicted_cup: "Heavier body, tannin emphasis - overrun hypothesis."` + `was_backfilled: true` + `backfill_notes: "..."`.

**If no recipe row exists at all for a slot** (`roasts.recipe_id` IS NULL — the V_n was pushed via `push_roast_profile` to Roest but `push_roast_recipe` was never called): use `push_roast_recipe` to CREATE the row instead of `patch_roast_recipe`, then link it via `patch_roast(roast_id, recipe_id)`. Sequence per slot:

1. `push_roast_recipe(green_bean_id, experiment_id, batch_slot, recipe_name, predicted_cup: "...", was_backfilled: true, backfill_notes: "Created during V_<n> cup backfill — original push_roast_recipe missed at design time, YYYY-MM-DD", + curves/end-condition/charge/hopper reconstructed from session memory or the Roest profile)` → returns `recipe_id`.
2. `patch_roast(roast_id: <V_n slot roast row>, recipe_id: <recipe_id from step 1>)` → links the execution row to its design-intent row.

This is the "half-migrated" case observed on CGLE Sudan Rume Natural V5 (2026-05-21, first lived test). If curve/end-condition/charge/hopper are unrecoverable, halt and ask Chris to ballpark before fabricating.

If `expected_outcomes` is generic ("we expect the lower-peak slot to read cleaner"), it can't be cleanly split — halt and ask Chris to ballpark each slot's `predicted_cup` before proceeding. Do NOT fabricate a per-slot prediction from a single-blob `expected_outcomes`.

### (b) `experiments.updated_cup_prediction_a/b/c/d` backfill

One `patch_experiment` call updating all populated slots in a single payload. Reconstruct from the V_n roast rows' `what_worked` / `what_didnt` / `what_to_change` prose plus session memory of what Chris said after the roasting session. Worked example:

> roast row for v3a: `what_worked = "structurally sound through Maillard"`, `what_didnt = "FC fired 45s late, dev phase compressed by ~30s"`, `what_to_change = "lower peak inlet 1-2°C next iteration"`.

Compose `updated_cup_prediction_a`:

> "v3a likely reads developed-but-compressed - attack clean from the Maillard-through-FC structure, but mid-palate may collapse from the FC-late dev squeeze. Watch for hollow middle; brightness OK."

Each `updated_cup_prediction_<slot>` is 1-2 sentences mapping the structural roast observation to a cup-side hypothesis. If the roast prose is sparse, keep the prediction equally sparse — don't pad.

### (c) `experiments.taste_for_a/b/c/d` backfill

Same `patch_experiment` call as (b), or a follow-up. Each `taste_for_<slot>` is 1-3 short sentences, action-verb-led ("Listen for X" / "Check whether Y" / "Taste only to calibrate Z"). See `log-roast.md` STAGE 5's `taste_for_a/b/c/d` rule (Sub-sprint 4a Bundle C) for the full tightening spec — same shape applies on backfill. Key rules:

- Frame each slot as questions to ask at the cup, not a recap of producer notes.
- Diagnostic framing on failure-mode batches: "Taste only to calibrate what underdevelopment tastes like on this lot — diagnostic data point, not a candidate."
- Forward-looking V_(n+1) branch logic when load-bearing.
- Brief comparators by slot identifier; don't re-explain the prior cup.
- Flat structure — drop the numbered "(1) producer notes / (2) V_(n-1) memory / (3) adjustment tested" form (it produced 80+ word slots).

Worked example for v3a (post-Bundle-C tight form):

> "Does the darker WB still let the producer's tasting notes through? Listen for whether the cleaner / longer dev added body at the cost of florality."

Skip slots that genuinely weren't roasted in V_n.

## Confirmation

After the three writes, print `STAGE 0: backfilled <N> recipe rows + <M> experiment-slot fields`, then proceed to STAGE 1.
