**State transition**: Waiting for next roast → Waiting for next cupping.

**Trigger**: I just roasted V_n at the machine and have the Roest logs in hand. I'll paste the per-slot data + photos of the roast curves below this message. Your job: record what actually happened, compute the roast-side deltas, update the cup prediction now that we've seen the actuals, and prep the taste-for hints for the Day 7 cupping table.

**Workflow position**: Second of four lifecycle prompts (`start-lot.md` → **`log-roast.md`** ⇄ `log-cupping.md` → `close-lot.md`). This one runs once per V-set, immediately after the roasting session.

Vocabulary used in this prompt is defined in CONTEXT.md (V-set, batch slot, taste-for, roast→cup trace, variable / lever / non-factor). The taste-for field is *not* a cup prediction - it's a directional listening hint with three reference points (producer notes / prior V-set memory / specific adjustment being tested).

## Tools for this session

`get_green_bean`, `get_bean_pipeline`, `list_roest_logs`, `pull_roest_log`,
`push_roast`, `patch_roast`, `push_roast_recipe`, `patch_roast_recipe`,
`push_experiment`, `patch_experiment`, `read_doc`, `read_doc_section`,
`list_doc_sections`, `read_canonical`, `propose_doc_changes`.

MCP namespace: tools surface under `Latent Coffee`.

## Routing

I'll reference the lot by `lot_id` or `green_bean_id` + tell you which V-set just finished (e.g. "V3 on Higuito done, batches 152/153/154"). Pull the V_n design intent from `get_bean_pipeline` and use the slot ↔ batch_id linkage from the matching `roast_recipes` rows.

## STAGE 1 - Resolve bean + V_n state, baseline pipeline

**This STAGE writes**: nothing (read-only), unless the missing-recipe-row backfill in (b) fires.

- `get_green_bean({lot_id})` → returns `green_bean_id`.
- `get_bean_pipeline({green_bean_id})` → returns `green_bean`, `roasts[]`, `cuppings[]`, `experiments[]`, `roast_learnings`, `brews[]`, `roast_recipes[]`.
- Identify the V_n `experiment` row (most recent by `created_at` matching `<LOT-PREFIX>-V<n>`). Its `roast_recipes[]` (filtered by `experiment_id` matching the experiment_pk) are the design-intent rows authored by `start-lot.md` or `log-cupping.md` (forward-design step from V_(n-1) → V_n).
- Build the slot → recipe_id map: `v<n>a` → recipe_id, `v<n>b` → recipe_id, etc., keyed on `roast_recipes.batch_slot`.
- Compare project-doc / paste-in claims against existing DB state (intake-drift detection). Flag any divergence.

### (a) Pre-rewrite-lot `batch_slot` fallback

Pre-rewrite lots (V-sets authored before PR #157) have `roast_recipes` rows with `batch_slot IS NULL` and `experiment_id IS NULL`. The slot → recipe_id map can't be built directly.

Fallback: infer the slot from `roast_recipes.roest_profile_name` (or `roast_recipes.recipe_name`) matching the V-set / slot pattern. The Roest profile name carries the slot tag explicitly. Patterns the regex should accept:

- `<LOT-PREFIX> - v<n><letter>` (canonical post-rewrite format: `"Higuito - v3a"`)
- `<LOT-PREFIX> v<n><letter>` (pre-rewrite, no hyphen: `"Higuito v3a"`)
- `... v<n><letter> ...` (slot tag anywhere in the name: `"Higuito Test v3a 2026-05-09"`)

Where `<letter>` ∈ `{a, b, c, d}`. Case-insensitive on `v` and the letter.

When the fallback fires, **also** `patch_roast_recipe(recipe_id, batch_slot: "v<n><letter>", experiment_id: <V_n experiment_pk>)` so future passes can use the direct map without re-running the fallback. One patch per recipe row. The fallback is opportunistic, not blocking — proceed to STAGE 2 once the map is built.

### (b) Missing-recipe-row halt relaxation

If the slot → recipe_id map is empty (no `roast_recipes` rows exist for the V_n experiment at all) **and** the design intent is reconstructable from session memory (the conversation in front of you contains the design-time hypothesis Chris and I framed before the roast), inline-backfill the recipe rows before proceeding. Specifically:

- `push_roast_recipe(payload)` × N for each V_n slot. Fill the curve fields (`temperature_bezier` / `fan_bezier` / `rpm_bezier`) from the design-time discussion + any Roest tablet artifacts Chris pasted. Design-time predictions (`predicted_fc_temp` / `predicted_fc_time` / `predicted_total_time` / `predicted_maillard_pct` / `predicted_agtron_wb` / `predicted_cup`) get reconstructed from session memory; if a field is genuinely unknown (e.g. Chris doesn't recall what we predicted Agtron WB would be), leave NULL — do NOT fabricate.
- Set `batch_slot`, `experiment_id`, `recipe_name`, `rationale`, `end_condition_type`, `end_condition_target`, `charge_temp`, `hopper_load_temp`, `preheat_temperature_c` on each.
- Drop rules (`drop_rule_if_fast` / `drop_rule_if_slow`) when documented.
- **Always set `was_backfilled: true` + `backfill_notes: "Recovered from session chat memory at log-roast.md STAGE 1(b), YYYY-MM-DD"`** (Schema sprint S4, migration 057, 2026-05-18) — these recipe rows are being reconstructed post-roast, not authored at design time. Distinguishes them from forward-design pushes via `push_roast_recipe` at V_n design time (which leave `was_backfilled` default false).

If the design intent is NOT reconstructable from session memory (the lot was V'd in a project-doc thread that's since rolled off, no Roest tablet artifact pasted in, Chris doesn't remember the per-slot rationale), THEN halt and report — pushing roasts without design-intent linkage breaks the resolved-view's "intended vs achieved" render.

Whichever way recipe rows landed (already present / fallback fired / inline backfill), the slot → recipe_id map must be complete before STAGE 2.

## STAGE 2 - Pull the Roest logs for the slots Chris just roasted

**This STAGE writes**: nothing (read-only).

For each slot in V_n:

- `list_roest_logs({inventory_id})` to find the just-recorded batch numbers. Compare against `existing_batch_ids` from STAGE 1 - the new ones are the V_n roasts.
- `pull_roest_log(log_id)` returns a normalized `push_roast`-shaped payload. Capture fc_start / fc_temp / drop_time / drop_temp / dev_time_s / agtron / end_condition_type / end_condition_target / roast_profile_name.
- Notes:
  - `hopper_load_temp` comes back as null from Roest - the API doesn't expose the bean-probe hopper-load reading. Set manually from session memory (V4 standard: 125°C).
  - `end_condition_type` + `end_condition_target` now come back populated directly from the Roest API (Round-7 capability confirmed 2026-05-14). Use these as ground truth.
  - **Operator-override check**: if `end_condition_target` (profile-set drop trigger) and `drop_temp` (where the machine actually dropped) diverge by more than ~0.5°C / a couple seconds AND the divergence isn't explained by Roest behavior (ceiling breach from session-position acceleration, dev-time timer firing slightly early/late), ASK whether the operator manually pulled the drop. If yes, override `end_condition_type: "manual"` on the push_roast payload regardless of what the profile encoded.
  - On silent-FC coffees (anaerobic naturals, heavy co-ferments - Sudan Rume Natural is the case study), `fc_start` / `fc_temp` may be null. Don't fabricate values. Record `fc_total_cracks` (count of audible cracks from FC through drop, 0 on silent-FC) as the audibility signal.

## STAGE 3 - Push the V_n roasts

**This STAGE writes**: `roasts` rows (one per slot, via UPSERT on `(user_id, green_bean_id, batch_id)`).

For each slot:

- `push_roast(payload)`:
  - `green_bean_id` from STAGE 1
  - `batch_id` from Roest (the integer batch number as string - e.g. `"187"`)
  - **`recipe_id`**: FK to the matching `roast_recipes` row from the slot → recipe_id map. This is the design-intent linkage - without it the page can't render "intended vs achieved" on the resolved view. STAGE 1's fallback + inline-backfill paths produce this; if both failed in STAGE 1 we already halted there.
  - All numeric fields from Roest: fc_start, fc_temp, drop_time, drop_temp, dev_time_s, agtron, charge_temp, hopper_load_temp, end_condition_type, end_condition_target, fc_total_cracks, weight_loss_pct.
  - `roest_log_id` (cross-ref) + `roest_notes` (pass-through of the Roest UI Notes / first_comment.comment - preserve verbatim, don't fold into the prose fields).
  - `roast_profile_name` from Roest.
  - **Prose** (your synthesis, NOT operator-supplied):
    - `what_worked`: structural observations on this slot's curve - what hit predictions cleanly
    - `what_didnt`: where the curve diverged from intent
    - `what_to_change`: what I'd adjust if re-roasting this exact recipe
  - `worth_repeating`: `"yes"` / `"no"` / `"pending"` (use `"pending"` for "yes at the structural-roast level but waiting on Day 7 cupping confirmation" - boolean true/false can't represent the conditional case).
  - `is_reference: false`. The reference-roast designation only lands at `close-lot.md` after a Day 7 cupping confirms the lot-level winner.

`push_roast` UPSERTs on `(user_id, green_bean_id, batch_id)`. Re-pushing the same `batch_id` returns `created: false` and field values are NOT overwritten - use `patch_roast` for field-level corrections.

Capture `roast_id` per slot for STAGE 5's experiment-row patch and `log-cupping.md`'s cupping pushes later.

## STAGE 4 - Patch the recipe rows with Roest linkage

**This STAGE writes**: `roast_recipes` patches (Roest profile linkage fields).

For each V_n recipe row authored at design time, link back to its Roest profile if not already done:

- `patch_roast_recipe(recipe_id, roest_profile_id, roest_share_url, roest_profile_name, pushed_to_roest_at)`.

Skip slots where these fields already populated.

## STAGE 5 - Patch the V_n experiment row

**This STAGE writes**: `experiments.batch_ids`, `experiments.observed_outcome_a/b/c/d`, `experiments.delta_from_roast_a/b/c/d`, `experiments.updated_cup_prediction_a/b/c/d`, `experiments.taste_for_a/b/c/d`. Optional: `key_insight` / `key_insight_confidence` / `what_changes_going_forward` / `open_questions` / `additional_notes`.

`patch_experiment(experiment_pk, ...)`:

- `batch_ids`: comma-separated string of the Roest batch numbers (e.g. `"187, 188, 189"`).
- `observed_outcome_a/b/c/d`: structural roast observations per slot. Source from Roest + your push_roast prose. 1-2 sentences each covering: FC time/temp, drop time/temp, dev time, Agtron WB + (if available from a quick cupping) ground Agtron + WB→Gnd delta, Maillard %, plus one-line cup-side hypothesis (which is *not* the taste_for - see below).
- `delta_from_roast_a/b/c/d`: reconciliation vs recipe predictions per slot. "Predicted FC 4:25 / 203°C, actual 5:11 / 202.5°C → late by ~45s, temp on target. Drop hit end_condition cleanly at 205°C / 6:00." Compare against `roast_recipes.predicted_fc_temp / predicted_fc_time / predicted_total_time / predicted_agtron_wb`.
- `updated_cup_prediction_a/b/c/d`: **post-roast cup prediction per slot, given how each actually roasted**. Distinct from `roast_recipes.predicted_cup` (frozen at design time, stays put). Now that we've seen the curves, refine the cup prediction. E.g. design-time predicted "sweet, balanced, lemongrass-forward"; post-roast updated prediction "v3a underdeveloped - pungent attack, fast fadeout, less integration than predicted; v3b structurally sound - closest to design intent; v3c overran - body and tannin emphasized."
- `taste_for_a/b/c/d`: **cupping-table prep, NOT a prediction**. Directional listening hints with three reference points each:
  1. Producer tasting notes (external ballpark check - "lemongrass, ginger, brown sugar, bergamot, blueberry" for Sudan Rume Natural)
  2. Prior V_(n-1) slot memory (where am I vs the last try on this lot - "v2c was structurally similar; tasted creamy on attack but tannin-heavy at finish")
  3. The specific adjustment being tested this round (where the lever is supposed to move the cup - "v3a tests lower peak; expect cleaner attack but possibly hollow middle")

  Format each `taste_for_X` as 1-3 sentences combining the three reference points. The page UI surfaces these front-and-center when the lot enters Waiting for next cupping state - front-and-center is what I see Day 7 when I sit down to cup.

Optional: also update `key_insight` / `key_insight_confidence` / `what_changes_going_forward` / `open_questions` / `additional_notes` if the roast-side actuals alone already reveal something insightful (rare at the post-roast stage; usually wait for cupping data). When set, use the `key_insight_confidence` ladder documented in `log-cupping.md` STAGE 3.

The `winner` field stays NULL until Day 7 cupping resolves it. `log-cupping.md` declares the leading slot for V_n.

`patch_experiment` echoes `updated_fields: [...]` so you can sanity-check which columns landed.

## STAGE 6 - Optional: propose ROASTING.md mid-iteration update

**This STAGE writes**: `doc_proposals` row (one multi-citation proposal), OR nothing if skipped.

Only if V_n's roast-side observations reveal a lot-state change worth recording NOW (rather than waiting for cupping). Examples:

- Calibration shift confirmed on this lot ("Higuito drop ceiling 209°C, not the protocol-default 207°C - Medium confidence pending V_(n+1)")
- Protocol-level insight applicable beyond this lot ("audibility count is the diagnostic primary on silent-FC lots - FC timestamp unreliable")
- Drift detection: live ROASTING.md disagrees with what you observed in Roest data this V_n

Route by SHAPE of the insight:

- Lot-state changes → `### LOT-CODE - Description` sub-section under Active Lots (replace)
- Protocol-level insights → workflow / protocol section (FC Marking Protocol, Drop Temp as the Primary Drop Signal, Between Batch Protocol, etc.)
- Mid-iteration cross-coffee patterns → Cross-Coffee Insight Layer (append with confidence marker)

Fetch live anchor via `read_doc_section(uri="docs://roasting.md", anchor="<Section Name>")` BEFORE drafting. Submit as a single multi-citation `propose_doc_changes` call with top-level `target_doc: "roasting.md"`, top-level `summary`, `citations: [{section_anchor, op, proposed_text, current_text}]`.

**When to skip and report why**: Day 7 cupping is imminent and will either confirm or invalidate the proposed insight. Skip and tell Chris the proposal queues for the `log-cupping.md` STAGE 6 pass. Print `STAGE 6: skipped - cupping imminent, defer`.

AVOID editing mid-iteration: Recently Closed Lots, Reference Brew Recipes by Lot - those are close-out artifacts owned by `close-lot.md`.

## STAGE 7 - Confirmation output

**This STAGE writes**: nothing (output only).

Print:

- `green_bean_id`
- For each slot (v_n a / b / c / d):
  - `batch_id` (Roest #) + `roast_id` (UUID)
  - `recipe_id` linkage confirmed
  - End condition (actual: bean_temp 204.2°C @ 6:00, vs target 205°C - `delta_from_roast` summary)
  - `updated_cup_prediction` (1-line)
  - `taste_for` (1-line)
- `experiment_pk` + `updated_fields: [...]` from patch_experiment
- `proposal_id` from propose_doc_changes (if STAGE 6 ran), or `STAGE 6: skipped - <reason>`
- Lifecycle state confirmation: "V_n complete, lot state flipped to **Waiting for next cupping**. Day 7 cupping target: <YYYY-MM-DD>."

## What this prompt does NOT do

- Push cuppings (`push_cupping`). Cupping happens Day 7, that's `log-cupping.md`.
- Declare a leading slot or update `experiments.winner`. The leading slot is declared post-cupping in `log-cupping.md`.
- Design V_(n+1). That's `log-cupping.md` - the adjustment is informed by what the cup taught, not what the roast taught.
- Declare a lot-level reference roast. Reference roast lives at `close-lot.md` after iterating through enough V-sets.
- Push roast learnings. That's `close-lot.md`.
