**State transition**: Waiting for next cupping → Waiting for next roast (loop continues, V_(n+1) designed) OR → Resolved-pending (lot ready for close-out, routes to `close-lot.md`).

**Trigger**: I just cupped V_n at Day 7 and have the cupping transcript. I'll paste the per-slot tasting notes below this message. Your job is two moves rolled into one session: (a) close out V_n - push the cuppings, compute cup deltas, name the leading slot, capture key insight; and (b) decide whether the lot is ready for close-out OR design the next adjustment as V_(n+1).

**Workflow position**: Third of four lifecycle prompts (`start-lot.md` → `log-roast.md` ⇄ **`log-cupping.md`** → `close-lot.md`). This one is the loop step - runs once per V-set's Day 7 cupping. Two outcomes:

- Most common: design V_(n+1) inline → state flips to **Waiting for next roast** → I roast V_(n+1) and we re-enter `log-roast.md`.
- Eventual: leading slot for V_n is also the lot-level reference roast candidate, and a control-experiment V-set isn't warranted → state flips to **Resolved-pending** and I run `close-lot.md` next.

Vocabulary used in this prompt is defined in CONTEXT.md (leading slot vs reference roast, adjustment, roast→cup trace, lever vs variable vs non-factor, control experiment).

## Tools for this session

`get_green_bean`, `get_bean_pipeline`, `push_cupping`, `patch_cupping`,
`push_experiment`, `patch_experiment`, `push_roast_recipe`, `patch_roast_recipe`,
`push_roast_profile`, `read_doc`, `read_doc_section`, `list_doc_sections`,
`read_canonical`, `propose_doc_changes`.

MCP namespace: tools surface under `Latent Coffee`.

## Routing

I'll reference the lot by `lot_id` or `green_bean_id` + tell you which V-set just got cupped (e.g. "Sudan Rume Natural V5 cupped, batches 187/188/189"). You decide downstream whether the lot is ready for close-out or whether V_(n+1) needs to be designed.

## STAGE 1 - Resolve bean + V_n state, baseline pipeline

- `get_green_bean({lot_id})` → returns `green_bean_id`.
- `get_bean_pipeline({green_bean_id})` → full state: `green_bean`, `roasts[]`, `cuppings[]`, `experiments[]`, `roast_recipes[]`, `brews[]`, `roast_learnings`.
- Identify V_n experiment row (most recent by `created_at` matching `<LOT-PREFIX>-V<n>`). Confirm `batch_ids` is populated (otherwise `log-roast.md` didn't run - halt and report).
- Build the slot → roast_id map from `roast_recipes.batch_slot` joined to `roasts.recipe_id`.
- Read each V_n recipe's `predicted_cup` (design-time prediction, frozen) and the V_n experiment's `updated_cup_prediction_a/b/c/d` (post-roast, pre-cupping prediction) + `taste_for_a/b/c/d` - these are the two predictions you'll compute deltas against in STAGE 3.

## STAGE 2 - Push the cuppings

For each slot Chris cupped (typically all V_n slots; sometimes one or two are skipped):

- `push_cupping(payload)`:
  - `roast_id` from STAGE 1's map (NOT batch_id).
  - `cupping_date`: YYYY-MM-DD of the cupping session.
  - `rest_days`: integer (V4 evaluation gate is Day 7; record actuals - Day 6 / Day 8 / Day 14 all valid).
  - `eval_method`: `"Pourover"` for Day 7 evaluation. `"Cupping"` (table bowl) is the legacy Day 4 defect-screen - deprecated as a primary evaluation per CONTEXT.md, but still accepted if you ran one.
  - **`recipe_variant`**: distinguishes multiple cuppings of the same `(roast_id, cupping_date, eval_method)` under different brewing recipes. Examples: `"xbloom_gate"` (mechanically-consistent gate cupping that defines the reference cup), `"real_pourover"` (optimized brew at Chris's daily-consumption recipe). When pushing both for the same slot on the same day, use distinct labels. When pushing only one and you know a second is unlikely, leave NULL - but if a second is *likely* later (the "first of likely two" case), explicitly label this one (e.g. `"xbloom_gate"`) to avoid retroactive patching when the second lands. The NULLS NOT DISTINCT composite key collapses two unlabeled cuppings into one row.
  - `ground_agtron`: paired with `roasts.agtron` for the WB→Ground delta - V4 primary internal-development signal (target ≤3 points).
  - The six prose fields: `aroma`, `flavor`, `acidity`, `body`, `finish`, `overall`. Source from Chris's transcript verbatim where possible, your synthesis only where the transcript is fragmentary.

`push_cupping` UPSERTs on `(user_id, roast_id, cupping_date, eval_method, recipe_variant)` with NULLS NOT DISTINCT. Re-pushing is safe - returns `created: false` and field values are NOT overwritten. Use `patch_cupping` for field-level corrections after the first push.

The response echoes `composite_key: {roast_id, cupping_date, eval_method, recipe_variant}` - sanity-check the row landed under the intended tuple.

Capture `cupping_id` per slot for cross-reference.

## STAGE 3 - Patch the V_n experiment row with cup deltas + leading slot

`patch_experiment(experiment_pk, ...)`:

- **`delta_from_cup_a/b/c/d`**: per-slot reconciliation of actual cup vs `updated_cup_prediction_*` (the post-roast prediction). E.g. "v3a updated prediction said 'pungent attack, fast fadeout'; actual cup *was* pungent on attack but held expressiveness through cool stage longer than predicted - the hard cliff produced an accidental slow-bake that integrated flavor compounds more thoroughly than expected." Both layers of the roast→cup trace become tasteable across slots: roast-delta (already captured in `log-roast.md`) + cup-delta (this field).
- `observed_outcome_a/b/c/d` (refine): if `log-roast.md` populated these with roast-side observations, **extend** them with the cupping observations rather than overwriting. The same observed_outcome field carries both layers' findings.
- **`winner`** (post-cupping resolution): the **leading slot** for V_n - which slot won this V-set's comparison (e.g. `"V5C (Batch 189)"`). This is the V-set-level winner, NOT the lot-level reference roast. Distinct terms:
  - **Leading slot** = winner of one V-set's comparison. Lives in `experiments.winner`. Changes V-set to V-set.
  - **Reference roast** = lot-level final designation. Lives in `roast_learnings.best_roast_id`. Set exactly once per lot at close-out.

  Phrase the winner as `"V<n><letter> (Batch <Roest#>)"` so the leading slot is unambiguous (and distinguishable from later lot-level reference-roast wording).
- **`key_insight`**: what V_n taught - Chris's post-hoc framing. 2-4 sentences. Variable → lever / non-factor promotions belong here. ("Peak inlet height is the lever for this lot; post-peak decline rate was tested but produced no clear cup difference - non-factor.")
- **`key_insight_confidence`**: enum `Low` / `Medium` / `Medium-High` / `High`. Mirrors the Cross-Coffee Insight Layer vocabulary. High = ready to promote to a protocol change; Low = early signal worth flagging but not relying on. Used by downstream queries + ROASTING.md routing decisions.
- **`what_changes_going_forward`**: lessons-applied-forward. What changes about V_(n+1) / next bean / general approach. Don't conflate with open questions.
- **`open_questions`**: what V_n did NOT answer. Separate field so the V_n → V_(n+1) transition is crisp - open questions inform V_(n+1)'s `primary_question`.
- **`additional_notes`**: free-text catch-all for cross-slot narrative tension that resists categorization - operator-framing prose, cup-vs-structure disconnects, reframe-the-direction observations.

`patch_experiment` echoes `updated_fields: [...]` + `canonical_values: { key_insight_confidence }` so you can confirm enum vocabulary landed cleanly.

## STAGE 4 - Decide: close out, or design V_(n+1)?

Routing decision:

**Path A - Lot ready for close-out** (route to `close-lot.md` next, do not pass STAGE 5):

The leading slot is the lot-level reference roast candidate AND no control experiment is warranted. Signals:

- Cup matches producer-notes ballpark check + Chris's expectations.
- Diminishing returns: the leading slot reads close to "as good as this coffee gets" and the open_questions don't suggest a different region of the response surface would be better.
- Brewing-side confirmation: the leading slot held up at real pourover (the `real_pourover` recipe_variant), not just at the xBloom gate.
- Often (but not required): a control experiment V-set (replicate of the leading slot with two slight adjustments) was already run and confirmed.

If routing to close-out, halt this prompt and tell Chris to run `close-lot.md` next. Report STAGE 5 as "skipped - routing to close-out".

**Path B - Design V_(n+1)** (continue to STAGE 5):

V_(n+1) is warranted when:

- Open questions remain that V_(n+1) can answer.
- A clear lever was identified but the optimum within it isn't yet pinned down.
- A new variable (held constant in V_1…V_n) is worth probing now that the primary lever is understood.
- Or: this is V_2 / V_3 and you're still in the search space - the adjustment is informed by V_n's cup observations.

## STAGE 5 - Design V_(n+1) (Path B only)

Read ROASTING.md sections via `read_doc_section(uri="docs://roasting.md", anchor=...)`:

- Standard Inlet Curve Template (7-timestamp fixed template)
- Active Lots `### LOT-CODE - Description` sub-section for the lot's current working hypothesis + per-lot protocol notes
- Cross-Coffee Insight Layer (relevant lessons from prior similar lots)

### Adjustment scale rule

The adjustment from V_n → V_(n+1) is scale-dependent. Calibrate the spread based on V_n's V number AND what V_n's cup signal taught:

- **V1 → V2**: typically still wide, often multi-variable. V1 was exploratory; V2 narrows on V1's signal but stays wide-ish when V1's leading slot wasn't unambiguous. Don't force narrow when the response surface still feels under-explored.
- **V2 → V3**: narrow on V2's leading slot, usually single-variable. 1-2°C peak spread is typical, or replicate V2's leading slot with two slight adjustments (a control experiment).
- **V3 → V4+**: probe a NEW variable held constant in V_1…V_3 (fan curve through development, drop temp ceiling at fixed peak inlet, charge temperature, hopper pre-load), or run a control experiment to lock in the reference roast.

Override: if V_n's `open_questions` explicitly demand re-bracketing ("we don't know if the window is in this range at all"), widen the spread regardless of V number.

### V_(n+1) experiment frame

Draft six fields:

- `context`: cites V_n's resolved finding + the chosen open_question that V_(n+1) addresses.
- `primary_question`: what V_(n+1) is asking. Usually frames the chosen open_question + the lever being probed.
- `control_baseline`: V_n's leading slot, cited with its peak inlet / drop temp / profile name so V_(n+1) has a comparison anchor.
- `shared_constants`: hopper pre-load 125°C, charge 117°C, preheat air 210°C, fan curve, RPM, drum direction - recover from V_n's recipes via `get_bean_pipeline`. Sanity-check that you're holding the lot's existing protocol constant.
- `levels_tested`: the values the variable takes across V_(n+1)a / b / c (or just a / b for a 2-slot control experiment).
- `expected_outcomes`: predicted roast-layer outcomes (FC / total / Agtron) AND predicted cup-layer outcomes per slot. Both layers required.

Plus `failure_boundary` (what "broken" looks like across the slots) and `variable_changed` (the primary axis being probed).

### Write V_(n+1) - three calls pair up, do all three

(a) `push_experiment(payload)`:
- `green_bean_id` from STAGE 1
- `experiment_id`: `<LOT-PREFIX>-V<n+1>` (same prefix as V_n, increment V number)
- `batch_ids`: NULL at design time - `log-roast.md` populates when V_(n+1) is roasted.
- Frame fields from above.

(b) `push_roast_recipe(payload)` × N:
- `green_bean_id`, `experiment_id` (UUID from `push_experiment`'s `experiment_pk` response), `batch_slot` (`v<n+1>a`, `v<n+1>b`, `v<n+1>c`), `recipe_name`, optional `parent_recipe_id` (when V_(n+1) slot "replicates V_n leading slot" - set parent to V_n's recipe_id, makes lineage queryable).
- `rationale`: per-batch Hypothesis prose.
- Curve definition: `temperature_bezier`, `fan_bezier`, `rpm_bezier` (jsonb). `power_bezier` MUST be null on INLET_TEMP profiles.
- `end_condition_type` + `end_condition_target`, `charge_temp`, `hopper_load_temp`, `preheat_temperature_c`.
- Design-time predictions: `predicted_fc_temp`, `predicted_fc_time`, `predicted_total_time`, `predicted_maillard_pct`, `predicted_agtron_wb`, `predicted_cup` (1-2 sentences). These are frozen at recipe-creation time.
- Drop rules: `drop_rule_if_fast`, `drop_rule_if_slow`.

(c) `push_roast_profile(payload)` × N - same beziers, writes to Roest tablet only. `enable_share: true`. Returns `profile_id` + `share_url`. After it returns, `patch_roast_recipe` to link `roest_profile_id` + `roest_share_url` + `roest_profile_name` + `pushed_to_roest_at` on the matching recipe row.

## STAGE 6 - Optional: propose ROASTING.md update

Post-cupping is the natural moment for ROASTING.md updates - cup signal is the strongest evidence. Route by SHAPE of the insight:

- **Lot-state change** (new working hypothesis going into V_(n+1), narrowing confidence band) → `### LOT-CODE - Description` sub-section under Active Lots (replace).
- **Protocol-level insight** confirmed by this V_n's cupping ("audibility count is diagnostic-primary on silent-FC lots", "anaerobic naturals tolerate drop ceiling 1°C above the Sudan-Rume-Washed-derived 207°C") → appropriate workflow / protocol section (FC Marking Protocol, Drop Temp as the Primary Drop Signal, Between Batch Protocol). REPLACE when contradictory; APPEND when additive.
- **Cross-coffee pattern** (NOT protocol-level - e.g. "naturals from this farm carry distinctive lemongrass", "84-hour anaerobic produces silent FC") → Cross-Coffee Insight Layer (append with confidence marker matching `key_insight_confidence`).
- **Per-lot FC ceiling calibration** confirmed by V_n → FC Floor & Ceiling section (append with confidence marker).

Fetch live anchor via `read_doc_section(uri="docs://roasting.md", anchor="<Section Name>")` BEFORE drafting. Submit as a single multi-citation `propose_doc_changes` call with top-level `target_doc: "roasting.md"`, top-level `summary`, `citations: [{section_anchor, op, proposed_text, current_text}]`.

AVOID editing mid-iteration: Recently Closed Lots, Reference Brew Recipes by Lot - close-out artifacts owned by `close-lot.md`.

## STAGE 7 - Confirmation output

Print:

- `green_bean_id`
- **V_n close-out summary**:
  - For each cupped slot: `cupping_id`, `composite_key`, ground_agtron + WB→Gnd delta, leading-slot determination one-liner
  - `experiment_pk` (V_n) + `updated_fields: [...]` from patch_experiment
  - `winner` (leading slot) - phrased `"V<n><letter> (Batch <Roest#>)"`
  - `key_insight` + `key_insight_confidence`
- **Routing decision**: Path A (close-out) or Path B (design V_(n+1)).
- **If Path B**:
  - `experiment_pk` (V_(n+1)) + `experiment_id`
  - For each V_(n+1) slot: `recipe_id`, `batch_slot`, `roest_profile_id`, `roest_share_url`, end condition, design-time prediction summary
  - Roest tablet name table:
    ```
    | Slot | Profile name | End condition | Roest URL |
    ```
- `proposal_id` from `propose_doc_changes` (if STAGE 6 ran)
- Lifecycle state confirmation:
  - Path A: "V_n closed. Lot state: **Resolved-pending**. Next step: `close-lot.md`."
  - Path B: "V_n closed, V_(n+1) designed. Lot state flipped to **Waiting for next roast**. Next step: roast V_(n+1) at the machine, then run `log-roast.md`."

## What this prompt does NOT do

- Push roast learnings (`push_roast_learnings`). That's `close-lot.md` - happens once at lot close-out after the lot-level reference roast is declared.
- Declare a lot-level reference roast (set `roast_learnings.best_roast_id`). That's `close-lot.md`. The V-set-level `experiments.winner` (leading slot) is what this prompt sets.
- Dial in the optimized brew. That's part of `close-lot.md`'s flow.
- Archive the Roest inventory row. `close-lot.md` does that at lot close-out.
