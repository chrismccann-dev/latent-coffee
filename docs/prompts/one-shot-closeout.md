**Workflow class**: one-shot lot close-out (STAGE 5 of the one-shot lifecycle).

**State transition**: Resolved-pending -> Resolved.

**Trigger**: A one-shot lot's STAGES 1-4 are done (intake + design + roast + Day 7 cupping captured via `one-shot.md`) AND the optimized brew has been dialed in via the brewing-side workflow (`bundled-brewing-completion.md` or sibling). I'll reference the lot by `lot_id` or `green_bean_id` + tell you whether the verdict from STAGE 4 was Outcome A (reference-quality) or Outcome B (Closed without reference). Your job: push the optimized brew, mark the reference roast (or not), write the constrained `roast_learnings` row, propose ROASTING.md close-out, archive Roest inventory.

**Workflow position**: Second of two prompts in the one-shot lifecycle (`one-shot.md` -> **`one-shot-closeout.md`**). Distinct from V-set lots' `close-lot.md`.

Vocabulary used in this prompt is defined in CONTEXT.md (one-shot lot, Closed without reference, carry-forward learnings, tolerance-anchored design). The structural difference from `close-lot.md`: lever-attribution fields (primary_lever / secondary_levers / roast_window_width / elasticity / what_didnt_move_needle / underdevelopment_signal / overdevelopment_signal) MUST NOT be populated - schema validation rejects them on lots where `is_one_shot = true` (migration 054).

## Tools for this session

`get_green_bean`, `get_bean_pipeline`, `patch_roast`, `push_roast_learnings`,
`patch_roast_learnings`, `push_brew`, `patch_brew`, `patch_inventory`,
`read_doc`, `read_doc_section`, `list_doc_sections`, `read_canonical`,
`propose_doc_changes`.

MCP namespace: tools surface under `Latent Coffee`.

## STAGE 1 - Resolve bean + verify Resolved-pending state

- `get_green_bean({lot_id})` -> returns `green_bean_id`. Verify `is_one_shot: true` in the response (if false, this lot is a V-set and should use `close-lot.md` instead).
- `get_bean_pipeline({green_bean_id})` -> full state. Verify:
  - V1 experiment row exists with `batch_ids` populated (one batch) + `winner` populated.
  - Single roast row exists with `recipe_id` linkage.
  - Day 7 cupping row exists with `overall` populated.
  - `roast_learnings` row does NOT yet exist (this prompt creates it; UPSERT-safe if it does exist from a prior incomplete close-out attempt).

I'll tell you which verdict came out of `one-shot.md` STAGE 4:

- **Outcome A** = reference-quality cup. Single batch is the lot's reference roast.
- **Outcome B** = "Closed without reference" (Rancho Tio shape). Cup is okay but not reference. Salvage is the optimized brew.

## STAGE 2 - Mark (or don't mark) the reference roast

(a) On **Outcome A**: `patch_roast(roast_id, is_reference: true, worth_repeating: "yes")`. The single batch IS the lot's reference roast. Optionally refine the prose fields (`what_worked` / `what_didnt` / `what_to_change`) if close-out reflection added clarity.

(b) On **Outcome B**: leave `is_reference: false` and `worth_repeating: "no"`. The roast wasn't reference quality. Optionally refine prose fields to capture what was learned.

`patch_roast` echoes `updated_fields: [...]`.

## STAGE 3 - Push the optimized brew

This brew was dialed in via the brewing-side workflow between `one-shot.md` STAGE 4 and now. Apply canonical-validation discipline from `log-brew.md` / `bundled-brewing-completion.md`:

- `extraction_strategy` z.enum (6 canonicals: Suppression / Clarity-First / Balanced Intensity / Full Expression / Extraction Push / Hybrid)
- `hybrid_subform` REQUIRED when strategy=Hybrid
- `structure_tags` z.enum on `"Axis:Descriptor"` keys
- `flavors`: structured chip array, NOT free-text
- Roaster / producer / brewer / filter / grinder canonicalize via their `*_LOOKUP`

`push_brew(payload)`:
- `source: "self-roasted"`
- `green_bean_id` from STAGE 1
- `roast_id` from STAGE 1 (links the brew to the single roast - on Outcome A this brew IS the reference cup target; on Outcome B this brew is the salvage)
- Recipe: brewer / filter / dose / water / grinder / grind_setting / temperature
- `extraction_strategy` + optional `hybrid_subform` + `strategy_notes` + optional `cooling_curve_target`
- `flavors` + `structure_tags`
- Prose: `pour_structure`, `bloom_*`, `peak_expression`, `aroma`, `attack`, `mid_palate`, `body`, `finish`, **`what_i_learned`** (CRITICAL on one-shots - this captures the compensation reasoning when Outcome B applied; e.g. "Roast came out a touch over-developed - dialed lower temp + lower agitation to soften the tannin overhang. Brewer A + filter B specifically because their flow pattern + paper retention reads cleanest on Maillard-heavy lots."), `terroir_connection`, `cultivar_connection`

For Outcome B in particular, `what_i_learned` is the carry-forward primitive that future similar one-shot lots will benefit from. Don't undersell the brew-side learning - what compensation you discovered transfers across lots even when the roast didn't.

## STAGE 4 - Write the constrained roast_learnings row

`push_roast_learnings(payload)` - UPSERTs on `(user_id, green_bean_id)`. One row per closed lot.

**Schema constraint (migration 054)**: when the parent green_beans has `is_one_shot: true`, the following fields MUST be NULL on this push. Schema validation rejects with a specific error message per field if populated. These fields require cross-batch evidence (variable->lever attribution) which one-shot lots cannot provide.

Forbidden on one-shots (must be NULL):

- `primary_lever`
- `secondary_levers`
- `roast_window_width`
- `elasticity`
- `what_didnt_move_needle`
- `underdevelopment_signal`
- `overdevelopment_signal`

Allowed and recommended:

- **`best_roast_id`** (typed FK) + **`best_batch_id`** (legacy text): set both. The single roast IS the lot's reference roast (on Outcome A) or the lot's only roast (on Outcome B). Get from STAGE 1's `roasts[]`.
- **`why_this_roast_won`**:
  - On **Outcome A**: verdict prose. "The single attempt landed in the carry-forward target zone for <reasoning>. Cup match producer notes ballpark on <descriptors>. Roast structure clean. <Lot> joins the carry-forward anchor set for similar future one-shots in this lane."
  - On **Outcome B**: explicitly NULL. The Sprint 3.2 #18 "Closed without reference" sub-card on ResolvedView renders based on this field being NULL. Don't fabricate a verdict.
- **`cultivar_takeaway`**: prefix with `"Low confidence - N=1, verify on next similar lot. "`. Then the takeaway prose. Example: "Low confidence - N=1, verify on next similar lot. <Cultivar> at <altitude band> may want <inlet range>; this single attempt landed at <X> and produced <Y>."
- **`general_takeaway`**: same `"Low confidence - N=1"` prefix. Cross-cultivar / cross-process patterns observed but anchored on a single observation.
- **`starting_hypothesis`**: most actionable field for the next similar one-shot. Same `"Low confidence"` prefix; encodes "next time I'd try <Z> based on this attempt." This is what future `one-shot.md` STAGE 1 carry-forward search will consume.
- **`reference_roasts`**: just the one batch (e.g. `"183"`).
- **`aromatic_behavior`** / **`structural_behavior`**: single-cup observations from the Day 7 cupping. Lower confidence than V-set close-outs (one observation, no cross-rest-day comparison). OK to populate; prefix with `"Single-cup observation - "` to flag the constraint.
- **`rest_behavior`**: typically NULL on one-shots (no cross-rest-day data). OK to leave NULL.

`push_roast_learnings` will reject the push if any of the 7 forbidden fields are populated. The error message will name the specific field. Move the prose to additional_notes on the experiment row, or to cultivar_takeaway / general_takeaway / starting_hypothesis as documented above.

## STAGE 5 - Propose ROASTING.md close-out narrative

BEFORE drafting citations, fetch live doc structure via `list_doc_sections(uri="docs://roasting.md")` if anchors don't resolve.

Routing decision tree (by SHAPE of the insight, not just topic):

- **Active Lots `### LOT-CODE - Description` sub-section**: REMOVE the closed lot's block (`replace` op with `proposed_text: ""` against the full sub-section body). Each lot has its own `### ` anchor under Active Lots; target the lot anchor, not the parent.
- **Recently Closed Lots**: APPEND close-out summary row. Tag explicitly as **one-shot**:
  - On Outcome A: "Reference roast set: Batch <N>. Single attempt, carry-forward anchored on <Lot Y>. One-shot lot."
  - On Outcome B: "Closed without reference. Single attempt, roast off-target. Salvaged via optimized brew (recipe ref in Reference Brew Recipes by Lot). One-shot lot."
- **Reference Brew Recipes by Lot**: APPEND the optimized brew recipe from STAGE 3. On Outcome B include the compensation reasoning verbatim from `push_brew.what_i_learned` - that prose is the carry-forward for future one-shot brew-side decisions.
- **Cross-Coffee Insight Layer**: ONLY append if a generalizable cross-coffee pattern emerged AND `key_insight_confidence` was Medium-High or High on the experiment. One-shots typically don't reach the threshold for CCIL contribution; defer to repeated observation on similar future lots. Single-lot patterns at Low confidence go to `additional_notes` on the experiment row, NOT to CCIL.
- **One-Shot Calibrations in Process** (if the section exists, otherwise propose creating it): append a brief one-shot summary so future carry-forward searches surface this lot quickly. ROASTING.md may not have this section yet - check via `list_doc_sections`.

AVOID promoting to protocol sections (FC Marking Protocol / Drop Temp as the Primary Drop Signal / Standard Inlet Curve Template) on one-shot data. Protocol changes require cross-lot evidence; N=1 isn't enough.

Submit as a single multi-citation `propose_doc_changes` call. Required: top-level `target_doc: "roasting.md"`, top-level `summary` (one-line), `citations: [{section_anchor, op, proposed_text, current_text}]`. For replace, copy existing text VERBATIM into `current_text`. Optional `source = {kind: "session", id: "<lot_id one-shot close-out>"}`.

## STAGE 6 - Archive the Roest inventory row

After the close-out proposal lands, mark the Roest inventory row archived.

- `patch_inventory({roest_inventory_id: <from STAGE 1's green_bean_inventory_id>, is_archived: true})`
- Skip if the lot was never on Roest (rare for one-shots since most flow through Roest).

## STAGE 7 - Confirmation output

Print:

- `green_bean_id` + verdict outcome (A / B)
- Reference roast (Outcome A only): `roast_id`, `batch_id`, brief `why_this_roast_won` excerpt
- `roast_learnings_id` + `created` (true on first push)
- `brew_id` + key recipe specs one-liner
- `proposal_id` from `propose_doc_changes`
- `is_archived: true` confirmation (or "skipped: <reason>")
- Lifecycle state confirmation: "Lot closed. State flipped to **Resolved**." On Outcome B add: "ResolvedView renders the 'Closed without reference' sub-card per Sprint 3.2 #18."
- Carry-forward summary: "This lot contributes <X> to the next similar one-shot's STAGE 1 search. Anchored on <lot Y> via <reasoning>. Next time a similar lot lands, carry-forward will surface this one's `starting_hypothesis` at Low confidence."

## What this prompt does NOT do

- Push new cuppings or roasts. Those happen in `one-shot.md` STAGES 3-4.
- Run the brew dial-in. That happens via the brewing-side workflow (`bundled-brewing-completion.md` etc.) between `one-shot.md` STAGE 4 and this prompt.
- Promote any insight to a protocol-level section of ROASTING.md. N=1 doesn't justify protocol changes.
- Populate the 7 forbidden roast_learnings fields. Schema validation rejects them.
