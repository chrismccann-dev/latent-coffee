**Workflow class**: one-shot lot close-out (STAGE 5 of the one-shot lifecycle).

**State transition**: Resolved-pending -> Resolved.

**Trigger**: A one-shot lot's STAGES 1-4 are done (intake + design + roast + Day 7 cupping captured via `one-shot.md`) AND the optimized brew has been dialed in via the brewing-side workflow (`bundled-brewing-completion.md` or sibling). I'll reference the lot by `lot_id` or `green_bean_id` + tell you whether the verdict from STAGE 4 was Outcome A (reference-quality) or Outcome B (Closed without reference). Your job: push the optimized brew, mark the reference roast (always, regardless of outcome), write the constrained `roast_learnings` row, propose cluster-doc close-out, archive Roest inventory.

**Workflow position**: Second of two prompts in the one-shot lifecycle (`one-shot.md` -> **`one-shot-closeout.md`**). Distinct from V-set lots' `close-lot.md`.

Vocabulary used in this prompt is defined in CONTEXT-roasting.md (one-shot lot, Closed without reference, carry-forward learnings, tolerance-anchored design). The structural difference from `close-lot.md`: lever-attribution fields (primary_lever / secondary_levers / roast_window_width / brewing_tolerance / what_didnt_move_needle / underdevelopment_signal / overdevelopment_signal) MUST NOT be populated - schema validation rejects them on lots where `is_one_shot = true` (migration 054). `terroir_takeaway` (added Sprint 10, migration 060) is NOT in this list - terroir attribution does not require cross-batch evidence and is populatable on one-shot lots with the same `"Low confidence - N=1"` prefix as the other carry-forward fields.

## Tools for this session

`get_green_bean`, `get_bean_pipeline`, `patch_roast`, `push_roast_learnings`,
`patch_roast_learnings`, `push_brew`, `patch_brew`, `patch_inventory`,
`read_doc`, `read_doc_section`, `list_doc_sections`, `read_canonical`,
`propose_doc_changes`.

MCP namespace: tools surface under `Latent Coffee`.

## STAGE 1 - Resolve bean + verify Resolved-pending state

**This STAGE writes**: nothing (read-only).

- `get_green_bean({lot_id})` -> returns `green_bean_id`. Verify `is_one_shot: true` in the response (if false, this lot is a V-set and should use `close-lot.md` instead).
- `get_bean_pipeline({green_bean_id})` -> full state. Verify:
  - V1 experiment row exists with `batch_ids` populated (one batch) + `winner` populated.
  - Single roast row exists with `recipe_id` linkage.
  - Day 7 cupping row exists with `overall` populated.
  - `roast_learnings` row does NOT yet exist (this prompt creates it; UPSERT-safe if it does exist from a prior incomplete close-out attempt).

I'll tell you which verdict came out of `one-shot.md` STAGE 4:

- **Outcome A** = reference-quality cup. Single batch is the lot's reference roast AND the cup is what the lot's voice should sound like.
- **Outcome B** = "Closed without reference" (Rancho Tio shape). Single batch is still the lot's reference roast structurally (it's the only batch — by definition the resolved-view's reference roast), but the cup is okay rather than reference quality. Salvage is the optimized brew.

## STAGE 2 - Mark the reference roast (unconditionally for one-shots)

**One-shot exemption from Path A push-back duty** (Phase 1 / Item 34 follow-up / 2026-05-24): the [Cupping Specialist sub-skill's Pre-declaration discipline](../skills/cupping-specialist/SKILL.md) — which gates V-set lot Path A on Simulated Pourover Gate completion — does NOT apply to one-shots. Structural exemption: single roast (no V-set iteration), single Day 7 cup read (no V-set lineage means no secondary contender or V_(n-1) winner to compare against in an SPG cup-set). `is_reference: true` is set directly in this STAGE without the push-back gate. See [CONTEXT-roasting.md § Reference roast § Cross-domain workflow-transition gate](../../CONTEXT-roasting.md) for the cross-domain transition framing — declaring `is_reference = true` still triggers the brewing-side workflow transition on one-shots, just without the V-set-specific pre-declaration checklist.

**This STAGE writes**: `roasts` row patch.

`patch_roast(roast_id, ...)`:

- `is_reference: true`. **Set unconditionally for one-shots, regardless of Outcome A or B.** The structural fact is: there is one batch, the resolved-view's reference-roast slot has to render something, and that something is this batch. The A/B distinction lives on `worth_repeating` + `why_this_roast_won` (next field + STAGE 4 below), NOT on `is_reference`. The "Closed without reference" sub-card on ResolvedView (Sprint 3.2 #18) triggers on `roast_learnings.why_this_roast_won IS NULL`, not on `is_reference: false`.
- `worth_repeating`:
  - On **Outcome A**: `"yes"`. "I'd run this exact recipe again if I had more green."
  - On **Outcome B**: `"no"`. "I'd adjust the recipe next time, this attempt was off-target."
- Optionally refine prose fields (`what_worked` / `what_didnt` / `what_to_change`) if close-out reflection added clarity.

`patch_roast` echoes `updated_fields: [...]`.

## STAGE 3 - Push the optimized brew

**This STAGE writes**: `brews` row (the optimized brew, source=self-roasted).

This brew was dialed in via the brewing-side workflow between `one-shot.md` STAGE 4 and now. Apply canonical-validation discipline from `bundled-brewing-completion.md`:

- `extraction_strategy` z.enum (6 canonicals: Suppression / Clarity-First / Balanced Intensity / Full Expression / Extraction Push / Hybrid)
- `hybrid_subform` REQUIRED when strategy=Hybrid
- `structure_tags` z.enum on `"Axis:Descriptor"` keys
- `flavors`: structured chip array, NOT free-text
- Roaster / producer / brewer / filter / grinder canonicalize via their `*_LOOKUP`

`push_brew(payload)`:
- `source: "self-roasted"`
- `green_bean_id` from STAGE 1
- `roast_id` from STAGE 1 (the single roast — this brew either celebrates Outcome A or compensates for Outcome B)
- Recipe: brewer / filter / dose / water / grinder / grind_setting / temperature
- `extraction_strategy` + optional `hybrid_subform` + `strategy_notes` + optional `cooling_curve_target`
- `flavors` + `structure_tags`
- Prose: `pour_structure`, `bloom_*`, `peak_expression`, `aroma`, `attack`, `mid_palate`, `body`, `finish`, **`what_i_learned`** (CRITICAL on one-shots - this captures the compensation reasoning when Outcome B applied; e.g. "Roast came out a touch over-developed - dialed lower temp + lower agitation to soften the tannin overhang. Brewer A + filter B specifically because their flow pattern + paper retention reads cleanest on Maillard-heavy lots."), `terroir_connection`, `cultivar_connection`

For Outcome B in particular, `what_i_learned` is the carry-forward primitive that future similar one-shot lots will benefit from. Don't undersell the brew-side learning - what compensation you discovered transfers across lots even when the roast didn't.

## STAGE 4 - Write the constrained roast_learnings row

**This STAGE writes**: `roast_learnings` row (one per lot, UPSERTs on `(user_id, green_bean_id)`). Schema validation rejects 7 lever-attribution fields on lots where `is_one_shot = true`.

`push_roast_learnings(payload)`. **Schema constraint (migration 054)**: when the parent green_beans has `is_one_shot: true`, the following fields MUST be NULL on this push. Schema validation rejects with a specific error message per field if populated. These fields require cross-batch evidence (variable->lever attribution) which one-shot lots cannot provide.

Forbidden on one-shots (must be NULL):

- `primary_lever`
- `secondary_levers`
- `roast_window_width`
- `brewing_tolerance`
- `what_didnt_move_needle`
- `underdevelopment_signal`
- `overdevelopment_signal`

Allowed and recommended:

- **`best_roast_id`** (typed FK) + **`best_batch_id`** (legacy text): set both. The single roast IS the lot's reference roast (Outcome A) or the lot's only roast (Outcome B); either way it's the row the resolved view renders, and `is_reference: true` has already landed in STAGE 2 unconditionally. Get from STAGE 1's `roasts[]`.
- **`why_this_roast_won`**:
  - On **Outcome A**: verdict prose. "The single attempt landed in the carry-forward target zone for <reasoning>. Cup match producer notes ballpark on <descriptors>. Roast structure clean. <Lot> joins the carry-forward anchor set for similar future one-shots in this lane."
  - On **Outcome B**: explicitly NULL. The Sprint 3.2 #18 "Closed without reference" sub-card on ResolvedView renders based on this field being NULL (NOT on `is_reference: false` — that flag was set true in STAGE 2 regardless of outcome). Don't fabricate a verdict.
**Scope tags (Sprint 12 / migration 064 / ADR-0009, 2026-05-21)**: each of the 4 carry-forward fields below has a paired `*_scope_tags text[]` array. The `"Low confidence - N=1"` prefix is preserved verbatim in the prose; scope_tags is independent of the confidence prefix and captures the same sub-scoping convention as `close-lot.md` STAGE 3. Tag the one-shot's takeaways with loose-canonical prefixes when the lesson sub-scopes — this makes future similar-one-shot carry-forward search reliable. The prefix vocabulary is identical to close-lot.md (see that prompt's STAGE 3 for the full list): `process:washed` / `variety:typica-mejorado` / `country:colombia` / `altitude:high` / `evaluation_method:day-7-pourover` / `density:high` / etc., or bare `general` as catch-all. Critically: on one-shot lots, scope_tags **multiplies the value of `starting_hypothesis`** — tags like `['variety:typica-mejorado','process:honey','altitude:high']` make the lone N=1 hypothesis findable when the next queued one-shot fits the pattern. Use scope_tags more aggressively here than on V-set lots; the structured scope is what compensates for the single-observation confidence floor.

- **`cultivar_takeaway`**: prefix with `"Low confidence - N=1, verify on next similar lot. "`. Then the takeaway prose. Example: "Low confidence - N=1, verify on next similar lot. <Cultivar> at <altitude band> may want <inlet range>; this single attempt landed at <X> and produced <Y>." Pair with `cultivar_takeaway_scope_tags` for sub-scoping (e.g. `['process:honey']` if the takeaway is specifically about honey expressions of this cultivar).
- **`terroir_takeaway`**: same `"Low confidence - N=1"` prefix. Cross-lot scope on the terroir axis (country / admin region / macro terroir patterns). Populate when the lot teaches something terroir-specific worth carrying forward to future similar-terroir lots; leave NULL when the lot's lesson is cultivar- or process-driven rather than terroir-driven. Added Sprint 10 (migration 060, 2026-05-19). Pair with `terroir_takeaway_scope_tags` (e.g. `['altitude:high']`).
- **`general_takeaway`**: same `"Low confidence - N=1"` prefix. Cross-cultivar / cross-terroir / cross-process patterns observed but anchored on a single observation. Pair with `general_takeaway_scope_tags` — most important field to tag explicitly because "general" prose on one-shots often drifts across scopes; use tag `general` only when the principle is genuinely universal.
- **`starting_hypothesis`**: most actionable field for the next similar one-shot. Same `"Low confidence"` prefix; encodes "next time I'd try <Z> based on this attempt." This is what future `one-shot.md` STAGE 1 carry-forward search will consume. Pair with `starting_hypothesis_scope_tags` — the tags define which future similar-lot pattern surfaces this hypothesis on carry-forward search. **Tag aggressively here**: this is where the N=1 hypothesis earns its keep on the next one-shot.
- **`reference_roasts`**: just the one batch (e.g. `"183"`).
- ~~`aromatic_behavior` / `structural_behavior`~~ — **relocated to `cuppings` in Sprint 11 (migration 062, 2026-05-20) per ADR-0008.** They describe what a cup IS (per-tasting observation), not what a lot taught. On a one-shot lot, push them at the Day 7 cupping stage in `one-shot.md` STAGE 4 via `push_cupping(aromatic_behavior: "...", structural_behavior: "...")` — NOT here in close-out. If you missed populating them during the cupping stage, use `patch_cupping` to add them to the existing cupping row before running this prompt. Same single-cup-observation caveat applies (one observation, no cross-rest-day comparison) — flag confidence in the cupping prose if helpful.
- **`rest_behavior`**: typically NULL on one-shots (no cross-rest-day data). OK to leave NULL.

`push_roast_learnings` will reject the push if any of the 7 forbidden fields are populated. The error message will name the specific field. Move the prose to additional_notes on the experiment row, or to cultivar_takeaway / general_takeaway / starting_hypothesis as documented above.

## STAGE 5 - Propose close-out narrative to cluster docs

**This STAGE writes**: `doc_proposals` row (one multi-citation proposal).

BEFORE drafting citations, fetch live cluster docs via `read_doc(uri="docs://skills/<cluster-path>.md")` (or `list_doc_sections` against the same URI if anchors don't resolve). Reference the [Master Coordinator catalog](docs://skills/coordinator/catalog.md) to identify the right cluster home for each insight.

> **Catalog trigger discipline** (load-orchestration sprint, 2026-05-25 spec): same rule as `close-lot.md` STAGE 5 — the catalog fetch lives at this STAGE specifically because cross-domain proposal routing is the one moment in the one-shot lifecycle where intent is genuinely ambiguous. Do NOT promote this fetch to session start; do NOT duplicate it at other one-shot stages. One-shot routing explicitly AVOIDS protocol docs (per ADR-0009 + the constraint below), so the catalog cite here is primarily for active-lots / learnings / reference-brew / cross-coffee-insight surfaces, not protocol surfaces.

Routing decision tree (by SHAPE of the insight, not just topic). Per-citation `target_doc` is `"skills/<cluster-path>.md"` (`'roasting.md'` is deprecated post Wave 4 PR 4b per ARBITER.md § target_doc routing):

- **Active Lots `### LOT-CODE - Description` sub-section**: REMOVE the closed lot's block by issuing a `replace` op with `proposed_text: ""` against the per-lot file at `docs/skills/roasting-historian/cluster/active-lots/<lot-slug>.md`. One file per lot post Wave 2 PR 3; citation `target_doc: 'skills/roasting-historian/cluster/active-lots/<lot-slug>.md'`.
- **Closed-lot learnings**: APPEND or CREATE the close-out summary at `docs/skills/roasting-historian/cluster/learnings/<lot-slug>.md` (one file per closed lot). Tag explicitly as **one-shot**:
  - On Outcome A: "Reference roast set: Batch <N>. Single attempt, carry-forward anchored on <Lot Y>. One-shot lot."
  - On Outcome B: "Closed without reference. Single attempt, roast off-target. Salvaged via optimized brew (recipe ref in Reference Brew Recipes by Lot). One-shot lot."
- **Reference Brew Recipes by Lot**: APPEND the optimized brew recipe from STAGE 3 to the relevant Reference Brew section in the Roasting Historian cluster (route via the catalog if uncertain). On Outcome B include the compensation reasoning verbatim from `push_brew.what_i_learned` - that prose is the carry-forward for future one-shot brew-side decisions.
- **Cross-Coffee Insight Layer**: ONLY append to `docs://skills/roasting-historian/cluster/patterns/cross-coffee-insights.md` if a generalizable cross-coffee pattern emerged AND `key_insight_confidence` was Medium-High or High on the experiment. One-shots typically don't reach the threshold for CCIL contribution; defer to repeated observation on similar future lots. Single-lot patterns at Low confidence go to `additional_notes` on the experiment row, NOT to CCIL.
- **One-Shot Calibrations in Process**: append or create a brief one-shot summary at `docs/skills/roasting-historian/cluster/one-shot-calibrations/<lot-slug>.md` so future carry-forward searches surface this lot quickly. Citation `target_doc: 'skills/roasting-historian/cluster/one-shot-calibrations/<lot-slug>.md'`.

AVOID promoting to protocol cluster docs (FC Marking Protocol at `docs://skills/roest-knowledge/cluster/protocols/fc-marking.md` / Drop Temp as the Primary Drop Signal at `docs://skills/roest-knowledge/cluster/machine/counterflow-observations.md#drop-temp-as-the-primary-drop-signal` / Standard Inlet Curve Template at `docs://skills/roest-knowledge/cluster/protocols/fan-strategy.md#standard-inlet-curve-template`) on one-shot data. Protocol changes require cross-lot evidence; N=1 isn't enough.

Submit as `propose_doc_changes` call(s). Required per call: top-level `summary` (one-line), `citations: [{section_anchor, op, proposed_text, current_text, target_doc?}]` (per-citation `target_doc` is required when citations route to different cluster docs). For replace, copy existing text VERBATIM into `current_text`. Optional `source = {kind: "session", id: "<lot_id one-shot close-out>"}`.

**Auto-split when citations span multiple target_docs** (Round 15 diagnostic, 2026-05-26 / Sub-sprint 2 Item 15(b)). The one-shot routing tree commonly produces citations across 2-4 distinct cluster docs (active-lot empty-replace + learnings + reference-brew + one-shot-calibrations). When citations would target more than one distinct `target_doc`, issue ONE `propose_doc_changes` call per `(target_doc, section_anchor)` pair instead of a single multi-citation bundle. The aggregate payload (proposed_text + rationale sum) across multiple target_docs trips claude.ai's client-side approval-gating ceiling that doesn't fire on single-citation calls. Each split call carries exactly one citation, one target_doc, one section_anchor — keeps each payload small and the approval flow smooth. Reuse the same `source` shape across all split calls (`{kind: "session", id: "<lot_id one-shot close-out>"}`); use the same `summary` (or append a short `(1/N)` suffix per call). Auto-supersede operates per `(target_doc, section_anchor)`, so split calls remain idempotent on re-run. When all citations target the SAME target_doc, a single multi-citation call stays correct — the split rule only fires on cross-target_doc bundles.

## STAGE 6 - Archive the Roest inventory row

**This STAGE writes**: `roest_inventory` row patch (`is_archived: true`).

After the close-out proposal lands, mark the Roest inventory row archived.

- `patch_inventory({roest_inventory_id: <from STAGE 1's green_bean_inventory_id>, is_archived: true})`
- Skip if the lot was never on Roest (rare for one-shots since most flow through Roest).

## STAGE 7 - Confirmation output

**This STAGE writes**: nothing (output only).

Print:

- `green_bean_id` + verdict outcome (A / B)
- Reference roast designation: `roast_id`, `batch_id`, `is_reference: true` confirmed, `worth_repeating` value, brief `why_this_roast_won` excerpt (or `"why_this_roast_won: NULL — Closed without reference"` on Outcome B)
- `roast_learnings_id` + `created` (true on first push)
- `brew_id` + key recipe summary one-liner
- `proposal_id` from `propose_doc_changes`
- `is_archived: true` confirmation (or "skipped: <reason>")
- Lifecycle state confirmation: "Lot closed. State flipped to **Resolved**." On Outcome B add: "ResolvedView renders the 'Closed without reference' sub-card per Sprint 3.2 #18 (triggered by `why_this_roast_won = NULL`)."
- Carry-forward summary: "This lot contributes <X> to the next similar one-shot's STAGE 1 search. Anchored on <lot Y> via <reasoning>. Next time a similar lot lands, carry-forward will surface this one's `starting_hypothesis` at Low confidence."

## What this prompt does NOT do

- Push new cuppings or roasts. Those happen in `one-shot.md` STAGES 3-4.
- Run the brew dial-in. That happens via the brewing-side workflow (`bundled-brewing-completion.md` etc.) between `one-shot.md` STAGE 4 and this prompt.
- Promote any insight to a protocol cluster doc (`docs://skills/roest-knowledge/cluster/protocols/*` or `cluster/machine/*`). N=1 doesn't justify protocol changes.
- Populate the 7 forbidden roast_learnings fields. Schema validation rejects them.
