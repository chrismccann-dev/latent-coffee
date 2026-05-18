**State transition**: Resolved-pending → Resolved.

**Trigger**: I've declared a lot-level reference roast (the single batch slot, from one specific V-set, that I'd repeat if I had more green) AND I've dialed in the optimized brew for it via the brewing-side workflow. I'll paste the reference-roast designation + optimized-brew recipe + cupping notes + lessons-learned synthesis below this message. Your job: write the per-lot roast learnings row, mark the reference roast in the roasts table, push the optimized brew, propose the ROASTING.md close-out narrative, and archive the Roest inventory row.

**Workflow position**: Fourth and final lifecycle prompt (`start-lot.md` → `log-roast.md` ⇄ `log-cupping.md` → **`close-lot.md`**). This one runs exactly once per lot, after `log-cupping.md` has flagged Path A (lot ready for close-out).

Vocabulary used in this prompt is defined in CONTEXT.md (reference roast vs leading slot, reference cup, optimized brew, lot-specific learnings, carry-forward learnings, roasted bean characteristic, underdev signal / overdev signal, aromatic / structural / rest behavior). The lot-level reference roast designation is what distinguishes this prompt from `log-cupping.md`'s V-set-level leading-slot designation.

## Tools for this session

`get_green_bean`, `get_bean_pipeline`, `patch_roast`, `push_roast_learnings`,
`patch_roast_learnings`, `push_brew`, `patch_brew`, `patch_inventory`,
`read_doc`, `read_doc_section`, `list_doc_sections`, `read_canonical`,
`propose_doc_changes`.

MCP namespace: tools surface under `Latent Coffee`.

## Routing

I'll reference the lot by `lot_id` or `green_bean_id` + name the reference roast (e.g. "Sudan Rume Natural reference roast = V4C / Batch 169"). I'll either paste the optimized brew recipe inline or reference it by an existing `brew_id` if it's already in the DB.

## STAGE 1 - Resolve bean + verify Resolved-pending state

**This STAGE writes**: nothing (read-only).

- `get_green_bean({lot_id})` → returns `green_bean_id`.
- `get_bean_pipeline({green_bean_id})` → full state. Verify:
  - At least one experiment row has a non-null `winner` (the V-set leading-slot designations).
  - The roast I'm naming as the lot reference is in `roasts[]` with a `recipe_id` linkage to a `roast_recipes` row.
  - `roast_learnings` row does NOT yet exist (or exists but is incomplete - both cases route to this prompt; the row UPSERTs on `(user_id, green_bean_id)`).
- Compare project-doc claims against existing DB state. Flag any divergence.

## STAGE 2 - Mark the reference roast on the roasts table

**This STAGE writes**: `roasts` row patch (the reference roast).

The lot-level reference roast designation is distinct from any V-set's leading slot. The reference roast is the *one batch I'd replicate if I had more green*.

`patch_roast(roast_id, ...)`:

- `is_reference: true`. **Axis-1 of the close-out**: this is the row the resolved-view page renders as the reference roast. Set unconditionally on the named reference roast.
- `worth_repeating: "yes"` if not already set. **Axis-2, decoupled from `is_reference`**: this is the "I'd run this exact recipe again if I had more green" axis. Usually correlates with `is_reference` on V-set lots (you wouldn't name a roast the reference if you wouldn't repeat it), but they're structurally independent fields. On V-set lots both default to true together; the decoupling matters more for one-shot lots (`one-shot-closeout.md` STAGE 2) where `is_reference` is structural (single batch IS the reference) but `worth_repeating` can vary by outcome.
- Optionally refine `what_worked` / `what_didnt` / `what_to_change` if the close-out reflection added clarity over the in-iteration prose.

`patch_roast` echoes `updated_fields: [...]` + `canonical_values` for enum fields.

## STAGE 3 - Write the per-lot roast learnings row

**This STAGE writes**: `roast_learnings` row (one per lot, UPSERTs on `(user_id, green_bean_id)`).

`push_roast_learnings(payload)`. This is the structured carry-forward learning - the **compounding-knowledge primitive** that future `start-lot.md` runs consume when designing V1 on a lot with overlapping cultivar / terroir / process. Author every field that has signal; leave NULL only when there's genuinely nothing to say.

### Required FK

- `green_bean_id` from STAGE 1
- **`best_roast_id`**: typed FK to `roasts.id` - the reference roast. Sub Pages 6.1 (2026-05-13) addition; preferred over the legacy text field. Get from STAGE 1's `roasts[]` filtered by `is_reference: true` (after STAGE 2's patch lands).
- `best_batch_id`: legacy free-text reference roast batch number (e.g. `"169"`). Populate both for back-compat through Phase 3.

### Reference-roast explainer

- **`why_this_roast_won`**: what about this specific batch made it the lot-level reference. 3-6 sentences. The most load-bearing field - it's the verdict prose surfaced front-and-center on the resolved-view page. Cite specific roast measurements (FC time/temp, drop temp, Agtron, WB→Gnd delta) AND specific cup descriptors. Distinguish "this roast won the V-set comparison" from "this roast is the lot-level reference" - the latter is what this prompt records. Always populated on V-set close-outs (NULL is reserved for "Closed without reference" lots — see one-shot-closeout.md).

### Roasted bean characteristic (3 attributes per CONTEXT.md)

These are what the resolved-view page's Roast Character mini-card surfaces side-by-side:

- **`primary_lever`**: the single variable that mattered most for this lot - the lever to move first when re-roasting. 1-2 sentences.
- **`secondary_levers`**: smaller-impact levers that still moved the cup. Optional.
- **`roast_window_width`**: `"Narrow"` / `"Moderate"` / `"Wide"`. The acceptable-roast-window for the primary lever - the range within which the cup stays in the desired zone. CONTEXT.md flags this column for a UI relabel to `acceptable_roast_window` - the schema field name stays as-is until the rename sprint lands.
- **`elasticity`**: how well the roast responds to brewing variation (brewing tolerance). CONTEXT.md flags this column for rename to `brewing_tolerance` - the schema field name stays as-is until the rename sprint lands. High = cup holds up when brewing is pushed toward extremes (Full Expression / Suppression / Extraction Push); Low = cup falls in on itself when pushed. Note: Chris deprioritizes brewing tolerance in favor of expressiveness, so low-tolerance lots are acceptable provided they don't fully collapse - phrase the assessment accordingly.

### Variable post-hoc promotions

- **`what_didnt_move_needle`**: variables tested across V-sets that produced no clear cup effect - non-factors. Recording these is useful: the absence of effect is itself a carry-forward lesson.

### Cup-side diagnostic signals (NOT roast-side observations)

CONTEXT.md is strict on this distinction. Underdev / overdev signals describe what the CUP TASTES LIKE when development is off-target, NOT roast-side observations like "the roast stalled at the end" (those go in the per-roast prose or `additional_notes`).

- **`underdevelopment_signal`**: what underdev tasted like for THIS lot's cup - diagnostic marker for future lots of similar cultivar / process. Lot-specific (grassy / hay / sour / underextracted-acidity vary by cultivar). Cite the specific batch slot(s) that exhibited this so the signal is anchored to evidence.
- **`overdevelopment_signal`**: cup-side mirror. Lot-specific (roasty / nutty / ashy / muted / dark-chocolate-heavy / pronounced drying tannin / Sichuan peppercorn vary by cultivar).

CONTEXT.md flags an open audit: existing roast_learnings rows may have roast-side observations intermixed in these fields. For this lot, write strictly cup-side and put any roast-side observations elsewhere (per-roast `what_didnt` or `additional_notes` on the experiment row).

### Cup character (currently misplaced in schema, per CONTEXT.md)

These describe what the cup IS when roasted correctly - distinct from diagnostic signals (which describe failure modes). CONTEXT.md flags relocation to `cuppings` or a synthesized field on the reference-cup view as a follow-up; for now they live on `roast_learnings`:

- **`aromatic_behavior`**: how aromatics present in time and intensity - immediate vs late-blooming, expressive vs muted, lifted vs grounded, sustained vs transient.
- **`structural_behavior`**: shape and balance of acidity, body, and finish, separate from flavor.
- **`rest_behavior`**: how the roast evolves across rest days (Day 4 / 7 / 10+). Frequently NULL - Chris targets Day 7 xBloom and moves on; rest-time-as-variable isn't actively measured.

### Carry-forward learnings (the compounding-knowledge primitive)

These are the fields `start-lot.md` reads when designing V1 on a new lot with overlapping attributes. Designed to shorten time-to-reference-roast on the next similar lot.

- **`cultivar_takeaway`**: what this lot taught about the cultivar generally. Cross-lot scope.
- **`general_takeaway`**: what this lot taught about roasting generally / cross-coffee patterns. Cross-cultivar scope.
- **`starting_hypothesis`**: hypothesis for the next similar coffee - what to start from. The most actionable field for future `start-lot.md` runs.
- **`reference_roasts`**: which batches to keep in mind for replication / comparison (a string list - typically just the reference roast plus 1-2 other strong slots from the lot for benchmarking).

CONTEXT.md flags a missing axis: **terroir takeaway** is in Chris's mental model but the schema is missing the column. Open follow-up: add `roast_learnings.terroir_takeaway`. For this lot, fold the terroir lesson into `general_takeaway` until the column lands.

## STAGE 4 - Push the optimized brew

**This STAGE writes**: `brews` row (the optimized brew, source=self-roasted).

The optimized brew is the daily-consumption recipe Chris dialed in for the reference roast via the brewing-side workflow. It's the **consumption-condition endpoint** of the full pipeline - post-hoc attribution traces backward from here.

Apply canonical-validation discipline from `log-brew.md` / `bundled-brewing-completion.md`. Key schema-strict gates:

- `extraction_strategy` z.enum, 6 strict canonicals (v8.4: Suppression / Clarity-First / Balanced Intensity / Full Expression / Extraction Push / Hybrid).
- When `extraction_strategy = "Hybrid"`, `hybrid_subform` is REQUIRED - pick one of: sequential / phase_mapped / selective_bloom / intensity_clarity_split / temperature_staged.
- Within-strategy gradient ("lower edge of Balanced Intensity") goes in `strategy_notes`, NOT `extraction_strategy`.
- Cooling-window-as-strategy goes in `cooling_curve_target` (free-text), populated only when peak evaluation window IS the strategy (e.g. `"40-45°C peak"`).
- `structure_tags` z.enum on canonical `"Axis:Descriptor"` keys.
- `flavors`: structured chip array of `{base, modifiers[]}`, NOT free-text.
- Roaster / producer / brewer / filter / grinder canonicalize via their `*_LOOKUP`; `*_override: true` ONLY if legitimately new (rare for roaster = `"Latent"` on a self-roasted brew).

`push_brew(payload)`:

- `source: "self-roasted"`
- `green_bean_id` from STAGE 1
- `roast_id` from STAGE 2 (the reference roast - links the brew to the specific batch it was dialed for)
- Recipe: brewer / filter / dose / water / grinder / grind_setting / temperature
- `extraction_strategy` (+ `hybrid_subform` if Hybrid) + `strategy_notes` + optional `cooling_curve_target`
- `flavors` (structured chips) + `structure_tags`
- Prose: `pour_structure`, `bloom_*`, `peak_expression`, `aroma`, `attack`, `mid_palate`, `body`, `finish`, `what_i_learned`, `terroir_connection`, `cultivar_connection`

For field-level edits to a brew already pushed, prefer `patch_brew`.

The optimized brew lights up the resolved-view's "Reference Cup" + "Optimized Brew" sub-cards. The reference cup (xBloom gate at day-7) is sourced from the matching `cuppings` row on the reference roast (pushed previously via `log-cupping.md` with `recipe_variant: "xbloom_gate"`); the optimized brew is THIS push.

## STAGE 5 - Propose ROASTING.md close-out narrative

**This STAGE writes**: `doc_proposals` row (one multi-citation proposal).

BEFORE drafting any citation, fetch the live doc structure via `list_doc_sections(uri="docs://roasting.md")` if anchors don't immediately resolve.

Routing decision tree - pick the section that matches the SHAPE of the insight, not just the topic:

- **Active Lots `### LOT-CODE - Description` sub-section**: REMOVE the closed lot's block (use a `replace` op with `proposed_text: ""` against the full sub-section body). Each lot has its own `### ` anchor under Active Lots - target the lot anchor, not the parent `Active Lots` section.
- **Recently Closed Lots**: APPEND close-out summary row to the table + link to the new archive subdoc section (if archive.md is also being updated; a separate sub-proposal in the same multi-citation call works).
- **Protocol-level insights** confirmed by close-out - e.g. "use bean-temp end conditions on silent-FC coffees", "anaerobic naturals tolerate drop ceiling 1°C above the Sudan-Rume-Washed-derived 207°C", "audibility count is diagnostic-primary on silent-FC lots" - route to the appropriate workflow / protocol section (FC Marking Protocol, Drop Temp as the Primary Drop Signal, Between Batch Protocol). REPLACE the relevant paragraph when contradictory; APPEND when additive.
- **Varietal Aromatic Fingerprints**: APPEND or REPLACE if the variety already had a placeholder. Cite the cup descriptors confirmed across multiple roasts on this lot.
- **Reference Brew Recipes by Lot**: APPEND the optimized brew recipe from STAGE 4. Format matches the section's existing convention.
- **FC Floor & Ceiling**: APPEND if a new floor / ceiling for this cultivar / process was confirmed by close-out (promote from working-hypothesis to confirmed once the lot closes).
- **Cross-Coffee Insight Layer**: APPEND if a new generalizable cross-COFFEE pattern emerged (NOT protocol-level - those route to protocol sections). Use the `key_insight_confidence` enum vocabulary in the marker.
- **Rest Behavior Patterns**: APPEND if a new rest-curve insight was characterized (rare - usually NULL on `roast_learnings.rest_behavior`).
- **Green Spec to Starting Hypothesis**: APPEND if a new green-spec rule emerged (moisture / density / cultivar / process combination → starting hypothesis).

Submit as a single multi-citation `propose_doc_changes` call. Required fields: top-level `target_doc` (default `"roasting.md"`; per-citation `target_doc` can switch to `"docs/roasting/archive.md"` or other docs for sub-citations), top-level `summary` (one-line, the arbiter sees this when triaging), `citations: [{section_anchor, op, proposed_text, current_text}]`. For replace, copy the existing text VERBATIM into `current_text`. Optional `source = {kind: "session", id: "<lot_id close-out>"}`.

DRIFT DETECTION: if the live doc disagrees with what you observed in DB / Roest data (e.g. a reference brew recipe specifies a fan curve that doesn't match the actual Roest profile), include a `replace` citation that updates the doc to match observed reality.

## STAGE 6 - Archive the Roest inventory row

**This STAGE writes**: `roest_inventory` row patch (`is_archived: true`).

After the close-out proposal lands, mark the Roest inventory row archived so the tablet picker hides the lot from the active inventory list.

- `patch_inventory({roest_inventory_id: <from STAGE 1's green_bean_inventory_id>, is_archived: true})`.
- Skip if the lot was never pushed to Roest (rare).
- `patch_inventory` echoes `canonical_values: { is_archived }` for sanity-check.

## STAGE 7 - Confirmation output

**This STAGE writes**: nothing (output only).

Print:

- `green_bean_id`
- Reference roast designation: `roast_id`, `batch_id`, V-set + slot, brief `why_this_roast_won` excerpt
- `roast_learnings_id` + `created` (true on first push)
- `brew_id` for the optimized brew + key recipe specs one-liner
- `proposal_id` from `propose_doc_changes`
- `is_archived: true` confirmation (or "skipped: <reason>" if not on Roest)
- Lifecycle state confirmation: "Lot closed. State flipped to **Resolved**. The lot will now surface on `/green` under Resolved with the green tile, and `/green/[id]` renders the resolved-view page shape."

## What this prompt does NOT do

- Push new cuppings or roasts. Those happen mid-iteration via `log-roast.md` / `log-cupping.md`.
- Design new V-sets. Lot is closed.
- Dial in the optimized brew - that's the brewing-side workflow's job. By the time this prompt runs, the brew has been iterated to a final recipe; this prompt just records it.
