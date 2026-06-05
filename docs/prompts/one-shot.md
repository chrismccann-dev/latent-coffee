**Workflow class**: one-shot lot (single-batch sample, no iteration possible).

**State transitions covered**: In inventory -> Waiting for next roast -> Waiting for next cupping -> Resolved-pending. STAGES 1-4 of the one-shot workflow. STAGE 5 (close-out: brew dial-in + roast_learnings + cluster-doc proposals + archive) lives in `one-shot-closeout.md` (separate session, runs after the optimized brew is dialed in via the brewing-side workflow).

**Trigger**: I have a new green-bean lot that's a one-shot - sample from an auction lot pre-sale, sample set from a farm-direct sourcing conversation, rare allocation. Typically 100-120g, enough for exactly one roast. No V1/V2/V3 iteration possible - one shot, one cup, one verdict.

**Workflow position**: First of two prompts in the one-shot lifecycle (`one-shot.md` -> `one-shot-closeout.md`). Distinct from the 4-prompt V-set lifecycle (`start-lot.md` -> `log-roast.md` ⇄ `log-cupping.md` -> `close-lot.md`).

Vocabulary used in this prompt is defined in CONTEXT-roasting.md (one-shot lot, tolerance-anchored design, pre-V_n calibration gate, carry-forward learnings, roast→cup trace). The structural difference from V-set lots: no cross-batch variance attribution, no V2 recovery, lever-attribution fields are unwritable per schema constraint (migration 054).

## Tools for this session

`read_doc`, `read_doc_section`, `list_doc_sections`, `read_canonical`,
`list_roest_inventory`, `push_green_bean`, `patch_green_bean`, `get_green_bean`,
`get_bean_pipeline`, `push_inventory`, `list_roest_logs`, `pull_roest_log`,
`push_experiment`, `patch_experiment`, `push_roast_recipe`, `patch_roast_recipe`,
`push_roast_profile`, `push_roast`, `patch_roast`, `push_cupping`,
`patch_cupping`, `propose_doc_changes`.

MCP namespace: tools surface under `Latent Coffee`.

## Routing

Three resume points depending on what's already written. STAGE 0 below runs the pipeline check so you know which one you're on.

- **Fresh intake (lot not in DB)**: paste a LOT SPEC block below this message with green-bean data. Run STAGES 1-4 end to end.
- **Lot pushed but no V1 yet** (e.g. retroactive flagging of an existing lot as one-shot, or a prior session stopped after STAGE 1): reference the `lot_id` or `green_bean_id`. STAGE 1 calls `patch_green_bean(is_one_shot: true)` instead of `push_green_bean` (if not already flagged); skip the push paths but DO re-run the carry-forward search. Resume at STAGE 2.
- **Lot pushed + V1 experiment frame exists + recipe row may exist (partial STAGE 2)**: a prior session got partway through STAGE 2. STAGE 0 detects this; resume by pushing only what's missing (recipe row OR Roest profile OR profile→recipe linkage). Do NOT re-push the green bean or inventory row — `push_inventory` is NOT idempotent and yields duplicate Roest rows on re-push (verified during Round 12 dog-food, 2026-05-23).

## STAGE 0 - Pre-flight reconciliation (always run)

**This STAGE writes**: nothing (read-only check).

Before any push, call `get_bean_pipeline({lot_id: <code>})` (or `get_green_bean` if `lot_id` is unknown) to discover what's already written for this lot. Branch the rest of the session on the result:

- **`green_bean` row not found**: fresh intake. Proceed to STAGE 1 normally.
- **`green_bean` exists, `is_one_shot: false`**: lot was originally V-set framed. `patch_green_bean(is_one_shot: true)` at STAGE 1; skip the rest of STAGE 1 push paths; proceed to carry-forward search.
- **`green_bean` exists, `is_one_shot: true`, no experiments**: STAGE 1 push paths already done. Skip the green-bean + inventory pushes. Re-run the carry-forward search (it's load-bearing for STAGE 2 design — don't trust prior session's analysis blindly). Proceed to STAGE 2.
- **`green_bean` exists, V1 experiment exists, `roast_recipes: []`**: STAGE 1 + STAGE 2(a) done; STAGE 2(b)+(c) missing. Skip the experiment push; resume at STAGE 2(b) push_roast_recipe.
- **`green_bean` exists, V1 experiment exists, recipe row exists, no `roest_profile_id`**: STAGE 2(b) done but profile push missing. Skip the recipe push; resume at STAGE 2(c) push_roast_profile + recipe linkage.
- **`green_bean` exists, V1 experiment exists, recipe row exists, `roest_profile_id` set, no roasts**: STAGE 2 fully done. Lifecycle state = "Waiting for next roast". Resume at STAGE 3 when Roest log data lands (post-roast session).

**Important UPSERT vs pipeline-read subtlety**: `push_roast_recipe` UPSERTs on `(user_id, experiment_id, batch_slot)` and returns `created: false` if a recipe shell exists at that key. But `get_bean_pipeline` may return `roast_recipes: []` if the shell row has no curve / end-condition / Hypothesis data populated (read-time filter on populated rows). Trust the UPSERT response over the pipeline-read on the "does a row exist" question; the pipeline-read tells you the row is *populated*, not that it doesn't exist.

If detection signals contradict, halt and ask Chris which path to resume on — do NOT double-push inventory.

Intake fields (paste in the LOT SPEC block when fresh):

```
Green Lot ID:
Coffee Name:
Variety:
Producer:
Region / Origin:
Seller / Importer:
Process:
Moisture %:
Density g/L:
Purchase Date:
Quantity g (typically 100-120 for one-shots):
Altitude (optional):
Source type (auction-sample / farm-direct-sample / allocation / other):
Producer's tasting notes (REQUIRED, paste verbatim):
Process detail (fermentation length, drying method, anaerobic / thermal
  shock / co-ferment specifics):
Closest peer lots / references I'm aware of (for the carry-forward search):
Learning intent: [find out what this coffee wants | optimize toward specific
  expression | calibrate against a similar lot]
```

## STAGE 1 - Push the bean as one-shot + carry-forward search

**This STAGE writes**: `green_beans` row (`push_green_bean` with `is_one_shot: true`, OR `patch_green_bean` on a retroactive flag), `roest_inventory` row (`push_inventory`).

Canonical-field decision flowchart BEFORE the push (same as start-lot.md):

- **Producer** in `PRODUCER_LOOKUP`? Verify via `read_canonical(axis: "producers")`. If NO -> set `producer_override: true`.
- **Region / department** in canonical macro_terroir? Verify via `read_canonical(axis: "terroirs")`. Locality goes in `meso_terroir`, NOT `macro_terroir`. If no canonical macro covers the region: HALT, report the gap, ask whether to add the macro OR confirm a fallback. If fallback: `TERROIR_DRIFT: <details>` in `additional_notes`.
- **Cultivar** in canonical? Verify via `read_canonical(axis: "cultivars")`. Aliases (Sudán Rumé -> Sudan Rume) resolve at canonicalize time.
- **Multi-cultivar blend with net-new members** (East African SL-blends are the canonical case — e.g. Mount Elgon Ladies' Lot is SL28 + SL14 + Nyasaland, with SL14 + Nyasaland net-new to the registry): `green_beans.cultivar` is single-value strict-canonical (no `cultivar_override` path); net-new individual cultivars require `propose_canonical_addition(axis: "cultivar")` + a deliberate registry edit before they resolve. The sanctioned blend-handling pattern (used in Round 12 dog-food, 2026-05-23):
  1. Pick the **representative canonical member** (the one that's both in the registry AND most load-bearing for design — typically the most expressive variety in the blend) and set `green_beans.cultivar.cultivar_name = "<that canonical>"`.
  2. Preserve the **full verbatim blend string** in the legacy `green_beans.variety` free-text field (e.g. `"SL28, SL14, Nyasaland"`) AND in `additional_notes` so the multi-cultivar reality is queryable + visible on the resolved page.
  3. Push the **comma-separated string** to `roest_inventory.cultivar` (which accepts comma-separated multi-cultivar strings by design).
  4. File `propose_canonical_addition(axis: "cultivar", name: "<member>")` for each net-new blend member so the registry catches up; future blends with the same members will resolve cleanly.
  This pattern works for both V-set and one-shot lots; the same blend-handling applies in `start-lot.md` STAGE 1.

Then:

- `list_roest_inventory({search: "<bean term>"})` first if seeded from Roest - inventory often richer than the project doc.
- `push_green_bean(payload)` with **`is_one_shot: true`** (or `patch_green_bean(is_one_shot: true)` on a retroactively-flagged existing lot). Store `moisture` and `density` as bare numeric strings.
- `push_inventory(payload)` with `green_bean_id` for FK linkage.

Capture `green_bean_id` for STAGES 2-4.

### Carry-forward search (load-bearing for one-shots)

For V-set lots, the design anchor is multi-slot variance (V1 is exploratory; the data inside the V-set is the anchor). For one-shot lots there is no inside-the-data anchor - carry-forward learnings from "close and close enough" lots become THE primary design input.

Run a thorough search across the existing closed-lot archive:

1. `read_doc(uri="docs://skills/roasting-historian/cluster/patterns/cross-coffee-insights.md")` for cross-cultivar / cross-process / cross-terroir patterns potentially applicable (migrated from ROASTING.md in Wave 2 PR 3 / 2026-05-26).
2. `read_doc(uri="docs://skills/roasting-historian/cluster/active-lots/<lot-slug>.md")` for any prior in-flight lots with overlapping attributes (cultivar / terroir / process / processing-style). `list_docs(prefix="skills/roasting-historian/cluster/active-lots/")` to enumerate candidate slugs; also check `cluster/learnings/<lot-slug>.md` for closed-lot carry-forward.
3. For each candidate prior lot, call `get_green_bean({lot_id: <code>})` -> `get_bean_pipeline({green_bean_id})` and read the `roast_learnings` row for `cultivar_takeaway` / `general_takeaway` / `starting_hypothesis` / `reference_roasts` / `aromatic_behavior` / `structural_behavior`.
4. If similar lots exist, synthesize a starting hypothesis: "Closest prior anchors are <Lot X> (cultivar match) and <Lot Y> (process match). Their carry-forward suggests <Z>. For this one-shot the design starting point is <peak inlet> / <total time> / <drop temp> based on those anchors, adjusted by <reasoning>."
5. If NO similar lots exist, the starting hypothesis anchors on the producer's tasting notes ballpark + the Roest Knowledge cluster's [Standard Inlet Curve Template](docs/skills/roest-knowledge/cluster/protocols/fan-strategy.md#standard-inlet-curve-template) (migrated from ROASTING.md in Wave 3 PR 1) + general counterflow practice. Explicitly flag the anchor weakness.

Note: peer-roasted reference cup of THIS bean typically isn't available for auction-sample / farm-sample one-shots (the lot may not even be sold yet, cycle time to wait for a peer roast is too long). The "Pre-V_n calibration gate" concept from log-cupping.md (Untold reference cup case) does NOT apply here - the calibration anchor is carry-forward from other lots, not same-bean reference.

## STAGE 2 - Design the single recipe (tolerance-anchored)

**This STAGE writes**: `experiments` row (V1, batch_ids NULL at design time), `roast_recipes` row × 1, Roest tablet profile × 1 (via `push_roast_profile`), `roast_recipes` patch linking Roest profile ID back.

Vocabulary: **recipe** is the Latent design-intent aggregate (the `roast_recipes` row carrying curves + drop + hopper + end condition + charge + drop rules + rationale + Hypothesis prose). **Roest profile** is the machine artifact (the JSON pushed to the tablet via `push_roast_profile`). One recipe row produces one or more Roest profile pushes; the two nouns are not synonyms. See CONTEXT-roasting.md § Recipe (aggregate noun for design intent) for the three-way asymmetry (recipe / Roest profile / curve-shape names).

**CCIL wins on numeric conflict (one-shot-specific rule)**: when the inventory doc / project-doc roast-strategy guidance for this lot disagrees with a numeric parameter from the carry-forward CCIL or per-lot learnings (e.g. inventory says "120°C hopper" but CCIL via the most-similar prior one-shot says "125°C hopper, no altitude downhedge"), **CCIL is canonical, the inventory-doc bullets are advisory**. A one-shot has no recovery — N=1 means following stale doc guidance costs the only shot. Discovered Round 12 dog-food (2026-05-23): the Mountain Harvest Elgon Ladies' Lot inventory doc prescribed "120°C hopper, trim peak 2°C if lower-density" which directly contradicted the Rancho Tio Emilio one-shot learning (the canonical first-instance carry-forward correction: full anchor energy, no altitude downhedge, 125°C hopper). Inventory doc cleanup is a separate sprint; this rule is the runtime safeguard. Cite the specific carry-forward source in the design rationale ("anchored on #133 full energy per Rancho Tio learning, NOT the doc's −2°C hedge") so Chris can see the resolution.

Read cluster-migrated sections via `read_doc(uri=...)`:

- `docs://skills/roest-knowledge/cluster/protocols/fan-strategy.md` — Standard Inlet Curve Template (7-timestamp fixed template) + Fan Strategy (migrated from ROASTING.md in Wave 3 PR 1).
- `docs://skills/roest-knowledge/cluster/protocols/fc-marking.md` — FC Marking Protocol (especially for silent-FC coffees if cultivar/process flags risk).
- `docs://skills/roest-knowledge/cluster/machine/counterflow-observations.md` — Drop Temp as the Primary Drop Signal subsection.

Read protocol cluster docs via `read_doc`:

- `docs://skills/roest-knowledge/cluster/protocols/between-batch-protocol.md` — Between Batch Protocol + Hopper Pre-Load Timing (migrated from ROASTING.md § Standard Workflow in Wave 4 PR 4b / 2026-05-21).

### Tolerance-anchored design rule (one-shot only)

The V-set V1 width rule does NOT apply. The V_(n+1) narrowing rule does NOT apply. For one-shot lots the design philosophy is **tolerance-anchored**: anchor central in the carry-forward window with deliberate margin on both sides.

Concretely:

- **NOT a super-fast / very-low-tolerance roast** (no margin if dev phase comes in late).
- **NOT a super-long / pull-at-the-last-second roast** (no margin if FC arrives early or audibility goes silent).
- **Middle-of-the-road**: anchor peak inlet, drop temp, and total time central in the carry-forward window. Give operator grace for unexpected behavior. The goal is producing something workable on the single attempt, NOT optimizing for a known target.

If carry-forward learnings suggest "lot X with similar cultivar wanted 244°C peak / 4:30 total / 207°C drop", design the one-shot at ~242°C peak (1-2°C below carry-forward optimum) / ~4:30 total / 207°C drop with **explicit BEAN_TEMP end condition** (drop fires automatically when bean hits target - operator doesn't need to time it manually).

Drop rule discipline matters more here than on V-sets: write `drop_rule_if_fast` ("if BEAN_TEMP fires before 4:10, override and let run to 4:10 minimum") + `drop_rule_if_slow` ("if 4:30 elapses without BEAN_TEMP firing, manual drop at 4:30 regardless of bean temp"). Single-batch execution at the machine needs operator-facing guidance baked in.

### Write the V1 experiment row + the single recipe row + the Roest profile

Three writes pair up here (same discipline as start-lot.md / log-cupping.md - "do all three or the page surface breaks"), but each with cardinality 1 instead of N=3:

(a) `push_experiment(payload)`:
- `green_bean_id` from STAGE 1
- `experiment_id`: `<LOT-PREFIX>-V1` (one-shot lots still use the V1 framing per CONTEXT-roasting.md "lots with batch_ids of cardinality 1 flow through the same experiment -> roast -> cupping -> learnings pipeline as V-set V1")
- `batch_ids`: omit entirely at design time (leave NULL). STAGE 3 fills it. Do NOT pass the string `"null"`.
- `context`: "One-shot lot, single batch. Carry-forward anchor: <prior lot Y's takeaway>. Tolerance-anchored design - middle-of-the-road, no margin for error."
- `primary_question`: what the one-shot is asking. "Does the carry-forward anchor from <prior lot Y> transfer to this <cultivar/process/terroir> at <Z recipe>?"
- `control_baseline`: any peer reference if available (rare); usually the prior lot whose carry-forward is anchoring the design.
- `shared_constants`: charge 117°C, hopper 125°C, preheat 210°C, fan curve (from carry-forward), RPM, drum direction. Same as V-set lots.
- `variable_changed`: NULL or "n/a - single batch, no variable to vary". One-shot lots don't have a single-variable framing.
- `levels_tested`: NULL or "<peak inlet>°C / <total time> / <drop temp> - single point, tolerance-anchored".
- `expected_outcomes`: predicted roast-layer (FC time/temp, total, Agtron) AND predicted cup-layer prose for the single batch. Both layers required.
- `failure_boundary` (optional): "what 'broken' looks like on this single attempt" - the cup descriptors that mean the one-shot failed to land. E.g. "grassy/hay = underdev, smoke/ashy = overdev, neither matches producer notes = wrong anchor entirely."

(b) `push_roast_recipe(payload)` × 1:
- `green_bean_id` from STAGE 1
- `experiment_id` UUID from STAGE 2(a)'s response
- `batch_slot`: `"v1a"` (cardinality 1 V-set means the single recipe is slot a)
- `recipe_name`: `"<Lot prefix> - v1a"` or similar - surfaces in UI
- `parent_recipe_id`: the recipe_id of the carry-forward anchor lot's leading slot, if applicable. Makes the cross-lot anchor queryable.
- **`rationale`**: per-batch Hypothesis prose. CRITICAL for one-shots since there's no V2 to encode the reasoning into. Capture: "Anchor: <lot Y> winning slot was <Z recipe>. Adjustments for this lot: <reasoning>. Tolerance margin: <margin>°C on peak, <margin>s on total time."
- Curve definition: `temperature_bezier` + `fan_bezier` + `rpm_bezier` (jsonb). `power_bezier` MUST be null on INLET_TEMP profiles.
- `end_condition_type`: `"bean_temp"` (operator-grace default for one-shots).
- `end_condition_target`: °C target.
- `charge_temp`, `hopper_load_temp`, `preheat_temperature_c`.
- Design-time predictions: `predicted_fc_temp`, `predicted_fc_time`, `predicted_total_time`, `predicted_maillard_pct`, `predicted_agtron_wb`, `predicted_cup`.
- **`drop_rule_if_fast`** and **`drop_rule_if_slow`** - operator-facing guidance for single-batch execution.

(c) `push_roast_profile(payload)` × 1 - same beziers, writes to Roest tablet only. `enable_share: true`. Returns `profile_id` + `share_url`. After it returns, `patch_roast_recipe` to link `roest_profile_id` + `roest_share_url` + `roest_profile_name` + `pushed_to_roest_at` on the recipe row.

## STAGE 3 - Record the roast (after I execute at the machine)

**This STAGE writes**: `roasts` row × 1 (the single batch, via UPSERT), `experiments` row patch (batch_ids + observed_outcome_a + delta_from_roast_a + updated_cup_prediction_a + taste_for_a).

(Run this stage when I come back with Roest log data + photos.)

- `list_roest_logs({inventory_id})` to find the just-recorded batch number.
- `pull_roest_log(log_id)` returns normalized push_roast-shaped payload. Capture fc_start / fc_temp / drop_time / drop_temp / dev_time_s / agtron / end_condition_type / end_condition_target / roast_profile_name. Notes:
  - `hopper_load_temp` comes back null - set manually (V4 standard: 125°C).
  - `end_condition_type` + `end_condition_target` populated directly from Roest API (Round-7 capability).
  - **Operator-override check**: if `end_condition_target` and `drop_temp` diverge by more than ~0.5°C / a couple seconds AND the divergence isn't Roest behavior, ASK whether the operator manually pulled the drop. Override `end_condition_type: "manual"` if yes.
  - **Drop-rule deterministic case (Round 14, 2026-05-23) — skip the ask when the drop matches a written rule**: if the divergence (drop_temp + drop_time) matches the recipe's `drop_rule_if_fast` or `drop_rule_if_slow` text exactly (e.g. rule says "if 4:45 elapses without BEAN_TEMP 206°C, manual-drop at 4:45" and the roast dropped at 4:45 / 204.2°C), record `end_condition_type: "manual"` directly without blocking on Chris's confirmation — the deterministic match IS the confirmation. Note in `what_didnt` prose that the drop rule fired. This is especially valuable on one-shots where the drop rules are doing real operator decision-support work.
  - On silent-FC coffees, `fc_start` / `fc_temp` may be null. Don't fabricate. Record `fc_total_cracks` (audibility count) AND `fc_audibility` (Sprint 11 RO-CP-3 / migration 061 / 2026-05-20 + Group 3 / Item 31 / migration 066 / 2026-05-24 — 5-value enum: audible / subtle / silent / ambiguous / did_not_fire). Subtle FC with a real `fc_start` timestamp: trust the timestamp + record `dev_time_s` from it (Round 14 Bukure v2b clarification — a snap fired even though the canonical signature didn't). `did_not_fire` case (bean topped out below FC range — Round 14 Bukure v2a / Mt Elgon batch 199 case study): `fc_start` / `fc_temp` / `dev_time_s` MUST all be null, AND do NOT compute Maillard % in `observed_outcome_*` prose (the phase calculator produces an artifact — Bukure v2a's "61.4% Maillard despite no FC"; record "Maillard % N/A (FC did not fire)" instead). See CONTEXT-roasting.md § FC audibility state + § Maillard %.
  - **`end_condition_type: "manual"` + `end_condition_target: null` validation rule (Round 14)** — when end_condition is manual, target must be null/0. The design intent stays on the recipe row (e.g. `roast_recipes.end_condition_target: 206, end_condition_type: "bean_temp"`); the roast row records execution reality (manual + null). Recipe-vs-roast divergence is intentional, not contradictory. See log-roast.md STAGE 3 for the full convention.

`push_roast(payload)`:
- `green_bean_id` from STAGE 1
- `batch_id` from Roest (integer as string)
- **`recipe_id`**: FK to the matching `roast_recipes` row from STAGE 2(b). NON-NEGOTIABLE - one-shot lots have a single recipe and a single roast, the linkage must be set.
- Roest numeric fields (including Sprint 3.5 /datapoints/ unlock: `tp_time` + `tp_temp` + `yellowing_temp` + `inlet_curve_recorded` + `ror_at_2_30` + `ror_at_4_00` + `ror_at_fc_minus_30s` — pass through from pull payload), prose synthesis (`what_worked` / `what_didnt` / `what_to_change`), `roest_log_id`, **`color_description`** (Sprint 3.5 R57: Roest UI Notes lands here for post-CM200 color descriptors; the legacy `roest_notes` field is deprecated for new flows), `roast_profile_name`, `fc_total_cracks`, **`fc_audibility`** (Sprint 11 RO-CP-3 + Group 3 / Item 31 / migration 066 — 5-value enum), `worth_repeating` (tristate: typically `"pending"` until Day 7 cupping). **`is_reference_candidate`: leave unset (NULL)** — the candidate flag is cup-grounds-only and set in `one-shot-closeout.md` STAGE 2 alongside `is_reference: true` (one-shot lots collapse the V-set lineage so the candidate flag is rarely meaningful pre-closeout, but the convention from V-set lots applies: never set at roast-time, see CONTEXT-roasting.md § Reference candidate § Timing convention).
- `is_reference: false`. The lot-level reference roast designation lands at one-shot-closeout.md STAGE 2 — for one-shots, `is_reference: true` is set unconditionally at close-out regardless of outcome (single batch IS structurally the reference). Outcome A/B distinction lives on `worth_repeating` + `why_this_roast_won`, not `is_reference`.

Capture `roast_id` for STAGE 4's experiment patch and STAGE 4's cupping push later.

`patch_experiment(experiment_pk, ...)`:
- `batch_ids`: the Roest batch number (e.g. `"183"`).
- `observed_outcome_a`: structural roast observations. 2-3 sentences covering FC time/temp + drop time/temp + dev time + Agtron WB + Maillard% + structural verdict.
- `delta_from_roast_a`: reconciliation vs recipe predictions. "Predicted FC <X>, actual <Y> -> <delta>. Drop hit/missed end_condition cleanly."
- `updated_cup_prediction_a`: post-roast cup prediction given the actual curve. Distinct from recipe.predicted_cup (frozen at design time).
- `taste_for_a`: cupping-table prep, three reference points (producer notes / carry-forward anchor expectation / specific tolerance-margin behavior to evaluate).

## STAGE 4 - Record Day 7 cupping + verdict decision

**This STAGE writes**: `cuppings` row × 1, `experiments` row patch (delta_from_cup_a + winner + key_insight + key_insight_confidence + what_changes_going_forward + open_questions + additional_notes), `roasts` row patch (`worth_repeating` per the verdict; `is_reference` stays false until close-out).

(Run this stage when I come back with cupping transcript.)

`push_cupping(payload)`:
- `roast_id` from STAGE 3
- `cupping_date`: YYYY-MM-DD
- `rest_days`: integer. Day 6-10 is the acceptance window (Day 7 target). If outside [6,10] OR `cupping_date - roast_date` doesn't match `rest_days`, prefix `overall` with `"REST_DAYS_DRIFT: cupped Day <N>, off the Day 7 gate by <delta>"`.
- `eval_method`: `"Pourover"` for Day 7 xbloom gate
- `recipe_variant`: `"xbloom_gate"` if you expect a real-pourover follow-up under a different recipe; NULL if confident this is the only cupping
- `ground_agtron`: paired with `roasts.agtron` for WB-to-Ground delta. `wb_agtron` is auto-snapshot from the joined roast; `wb_to_ground_delta` is a generated column (Schema sprint S1, migration 055, 2026-05-18).
- Ten prose fields (`aroma` / `flavor` / `acidity` / **`sweetness`** / `body` / `finish` / `overall` / **`temperature_behavior`** / **`aromatic_behavior`** / **`structural_behavior`**) sourced from Chris's transcript. **Sweetness is a distinct axis** from acidity / body — don't fold it in. **Temperature_behavior** captures direction + when + what changes across the cooling arc. **Aromatic_behavior** + **structural_behavior** (Sprint 11 RO-6 / migration 062 / 2026-05-20 — relocated from roast_learnings per ADR-0008): per-tasting observations of how aromatics present in time/intensity and how acidity/body/finish shape and balance, separate from flavor. On one-shot lots flag the single-cup-observation constraint in the prose if helpful ("single-cup observation; verify on next similar lot"). All ten fields are NULL-safe if the transcript doesn't address them.

`patch_experiment(experiment_pk, ...)`:
- `delta_from_cup_a`: per-slot reconciliation of actual cup vs `updated_cup_prediction_a` (or vs `expected_outcomes` design-time prediction if `updated_cup_prediction_a` is NULL). Walk the three `taste_for_a` reference points and note which materialized as expected vs not (producer-notes ballpark / carry-forward-anchor expectation / tolerance-margin behavior).
- `winner` = `"V1A (Batch <Roest#>)"` - trivially the only slot. The "leading slot" concept is degenerate for one-shots; the single batch is the leading slot. Format strictly — everything past `"V1A (Batch <N>)"` goes in `additional_notes`.
- `key_insight`: 2-4 sentences. What did this one-shot teach? Frame explicitly as N=1 observation. Variable→lever attribution does NOT apply.
- `key_insight_confidence`: typically `Low` or `Medium` for one-shots (single observation, no cross-batch evidence). Apply the ladder from log-cupping.md STAGE 3 — Low = "interesting hypothesis"; Medium = "consistent with 1-2 prior data points (carry-forward anchor)"; rarely Medium-High on one-shots; never High (N=1 isn't enough for protocol promotion).
- `what_changes_going_forward`: lessons-applied-forward for the NEXT one-shot in this lane (similar cultivar / process / terroir). Forward-actionable phrasing.
- `open_questions`: what this one-shot did NOT answer. Substantial on one-shots since iteration wasn't possible. Phrase as questions.
- `additional_notes`: free-text catch-all (operator-framing prose, leading-slot verdict prose, cup-vs-structure disconnects). Descriptive, not directive.

### Verdict decision (load-bearing for STAGE 5 routing)

Two outcomes. The distinction lives on `worth_repeating` + `why_this_roast_won` (the latter recorded in `one-shot-closeout.md` STAGE 4), NOT on `is_reference` — `is_reference: true` is set unconditionally at close-out for one-shots (single batch IS structurally the reference roast for the lot).

**Outcome A - Reference-quality**: The single batch cup is satisfying. Chris would repeat this roast if more green existed. Mark `worth_repeating: "yes"` on the roast row via `patch_roast`. `why_this_roast_won` will be populated at close-out. Brew dial-in via the brewing-side workflow proceeds normally. State -> Resolved-pending. Run `one-shot-closeout.md` next.

**Outcome B - Closed without reference (the Rancho Tio shape)**: The cup is okay but not reference quality. Roast may have been off-target (too dark, too underdeveloped, etc.). Mark `worth_repeating: "no"` on the roast row via `patch_roast`. `why_this_roast_won` will be NULL at close-out (Sprint 3.2 #18's "Closed without reference" sub-card on ResolvedView triggers on NULL `why_this_roast_won`, not on `is_reference: false`). Salvageable artifact becomes the optimized brew (dialed in to compensate for the non-ideal roast). State -> Resolved-pending. Run `one-shot-closeout.md` next.

**Deferring the call (real-pourover pending) — the one-shot analog of the V-set Simulated Pourover Gate.** A decisive Day 7 transcript locks Outcome A/B here (Chris's explicit "not going to call this a resolved lot" IS a lock — Outcome B). But when Chris signals he wants a real pourover before committing ("let me wait until I do an actual real pourover to really call that one"), the verdict MAY be deferred: the optimized-brew session runs after this STAGE and before `one-shot-closeout.md` per the project handoff rules. When deferring — record a PROVISIONAL verdict here (set `worth_repeating` on the best current read, prefix `additional_notes` with `PROVISIONAL VERDICT: real-pourover pending`), and LOCK the final Outcome A/B at `one-shot-closeout.md` STAGE 1 once the brew-side read returns. Only defer on an explicit pending-pourover signal; a clear transcript locks immediately.

State after STAGE 4: **Resolved-pending** in both outcomes. Brew dial-in happens via the brewing-side workflow next (`bundled-brewing-completion.md` typically), then `one-shot-closeout.md` records the final brew + writes the constrained `roast_learnings` row.

### Emit the Optimized Brew Packet (always - both outcomes)

**This STAGE writes**: nothing (output only - the packet is text for Chris to paste into a fresh brewing thread).

A one-shot has no choice: one roast, one cup, and it ALWAYS goes to brewing - on **both** Outcome A and Outcome B. Outcome B is in fact the *common* path (the single roast is usually a little off, and the optimized brew is the salvage - dialed in to get the best daily cup the available material can give, regardless of whether the roast was reference-quality). So after the cupping is captured, emit a thin **Optimized Brew Packet** unconditionally - same logic as `is_reference` being set unconditionally for one-shots at close-out. This is the OUTBOUND kickoff that the brewing thread completes; it carries the optimized-brew dial-in across the project boundary (see CONTEXT-shared.md § Cross-domain Workflow - Optimized Brew Packet).

Emit exactly these lines - no recipe design here (context-protection, mirroring the Simulated Pourover Packet in `log-cupping.md`; the brewing side owns the recipe). The brewing side reads the roast numbers, cup prose, ground Agtron, and producer notes itself from the shared DB via `green_bean_id` + `roast_id`, so only the interpretive handoff crosses the boundary. **The packet is self-contained** - its first line is the self-declaring "optimized brew for <lot>" statement that fires the `bundled-brewing-completion.md` carve-out, so Chris can paste the packet alone with no extra declaration line:

```
OPTIMIZED BREW PACKET
This is the optimized brew for <lot_id> (self-roasted, one-shot).
- green_bean_id: <the lot's green_bean_id>
- lot: <name (lot_id)>
- roast: batch <Roest#> / roast_id <uuid>  (link the optimized brew to THIS roast regardless of reference quality - one-shots link the brew to the single roast even on Outcome B / not-reference-quality)
- outcome: <A reference-quality | B closed-without-reference likely; roast off-target, salvage job>
- starting brewing direction: <one line - the operator's brewing read lifted from the cupping transcript, e.g. "intensity-clarity split (Hybrid), push hard upfront to pull what it has, compensate for the hollow/flat back-half". If Chris didn't state a direction at the table, fall back to the recipe's design-time brew hypothesis (`roast_recipes.predicted_cup` / `experiments.expected_outcomes` brew-side pivot note) and SAY you're falling back.>
- intent: <one line - what the optimized brew should achieve, toward the producer tasting-notes target>
```

**The `starting brewing direction` is the load-bearing field** - it's the one thing NOT reliably in the DB. The recipe's design-time brew hypothesis (frozen at STAGE 2) can diverge from what the cup actually asks for at the table; the fresh read wins. (Live Mt Elgon dogfood, 2026-06-02: the recipe predicted a "gentler pivot," the cupping read said "push hard upfront / intensity-clarity split" - opposite directions, fresh read governs.) Lift it from Chris's cupping transcript; do NOT recycle the stale design-time hypothesis without flagging it.

Then tell Chris: paste this into a fresh brewing thread (the normal archive-driven brewing flow) under a `start-brew.md` fetch line + Dose + Brewing location - nothing else needed, the packet's first line self-declares the optimized-brew carve-out. It runs the full optimization and completes via `bundled-brewing-completion.md`'s optimized/reference-brew carve-out, which pushes the brew row exactly once and hands back a `brew_id`. That `brew_id` is what `one-shot-closeout.md` STAGE 3 LINKS via `green_beans.optimized_brew_id` (it does NOT re-push). State stays **Resolved-pending** until close-out.

## Confirmation output

**This STAGE writes**: nothing (output only).

Print everything needed to verify the state-flip cleanly:

- `green_bean_id` + `is_one_shot: true` confirmed
- STAGE 1 carry-forward search results: "Anchored on <Lot Y> (cultivar) + <Lot Z> (process). Carry-forward suggests <reasoning>."
- STAGE 2 design summary:
  - `experiment_pk` + `experiment_id` (e.g. `<LOT-PREFIX>-V1`)
  - `recipe_id` + `batch_slot: v1a`
  - `roest_profile_id` + `roest_share_url`
  - End condition + target
  - Design-time prediction summary
  - Drop rules
- (STAGES 3-4, printed when those stages run): `batch_id` + `roast_id` + `cupping_id` + WB→Gnd delta + verdict (Outcome A or B)
- (STAGE 4, both outcomes): the emitted **Optimized Brew Packet** block (green_bean_id / lot / roast / outcome / starting brewing direction / intent), with the instruction to paste it into a fresh brewing thread.
- Lifecycle state: "Lot waiting for next roast" -> "Lot waiting for next cupping" -> "Resolved-pending (route to one-shot-closeout.md, after the optimized brew is dialed in)"

## What this prompt does NOT do

- Push roast_learnings (the constrained close-out). That's `one-shot-closeout.md`.
- Set `is_reference: true` on the roast row. Only `one-shot-closeout.md` does that, and it sets the flag unconditionally regardless of Outcome A/B.
- Design or push the optimized brew. STAGE 4 emits the kickoff **Optimized Brew Packet** (thin handoff, no recipe); the brewing-side workflow designs + pushes the brew between STAGE 4 and `one-shot-closeout.md`, then `one-shot-closeout.md` STAGE 3 LINKS it.
- Archive the Roest inventory row. `one-shot-closeout.md` STAGE 5 does that.
- Propose cluster-doc updates. Defer to `one-shot-closeout.md` STAGE 5 - one bundled doc proposal at close-out is cleaner than mid-iteration appends on a one-shot.
