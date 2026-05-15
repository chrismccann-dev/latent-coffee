# Sprint: One-shot lot framework

Kickoff doc for the one-shot lot framework sprint. Authored 2026-05-15 after the multi-round dogfood pass that surfaced one-shot lots as a separate workflow class.

## Goal

Land the substrate for one-shot green-bean lots (single-batch samples, ~100-120g, no iteration possible) as a distinct workflow class with its own prompt + schema flag + carry-forward constraints. Distinct from V-set lots (which iterate through V1 / V2 / ... / V_N) and from the existing 4-prompt lifecycle (start-lot / log-roast / log-cupping / close-lot).

## Why now

- 4 pending auction-lot samples + a Rwanda sample batch incoming — all one-shot. Need the framework in place before they arrive.
- Rancho Tio Emilio (existing closed lot) is structurally a one-shot but was processed under pre-rewrite prompts; needs retroactive backfill.
- Round 4 dogfood (Bukure V2 design) confirmed the existing 4-prompt pipeline is solid for V-set lots, so the right next move is to widen the framework to one-shots rather than further-polish the V-set prompts.
- Auction-lot context: peer-roasted reference cup typically isn't available (lot isn't sold yet) — the calibration anchor for one-shots is carry-forward learnings from "close and close enough" lots, not same-bean reference. Schema + prompt need to acknowledge this.

## Scope — in

1. **Schema migration** (`supabase/migrations/054_one_shot_flag.sql`):
   - Add `green_beans.is_one_shot boolean NOT NULL DEFAULT false`
   - No data backfill needed for existing lots (default false correctly classifies all current V-set lots)
   - Rancho Tio gets manually flagged true in the operational backfill step (see § Operational backfill)

2. **Schema-level validation in `lib/roast-import.ts persistRoastLearnings`**:
   - On write, fetch the parent green_beans row
   - If `is_one_shot = true` AND any of `primary_lever` / `secondary_levers` / `roast_window_width` / `elasticity` / `what_didnt_move_needle` / `underdevelopment_signal` / `overdevelopment_signal` are non-null in the payload, return validation error
   - Error message: "Field <X> requires cross-batch evidence (variable→lever attribution). One-shot lots (N=1) cannot populate this field. Move the prose to additional_notes or cultivar_takeaway with Low-confidence framing."
   - Existing roast_learnings rows untouched (validation applies to new writes only)

3. **New 5th roasting prompt: `docs/prompts/one-shot.md`** bundling intake → design → roast → cup → close-out into a single prompt. STAGES:
   - **STAGE 1 — Intake + carry-forward search**: `push_green_bean` with `is_one_shot: true` + `push_inventory`. Read prior `roast_learnings` rows from similar cultivar/terroir/process lots via `get_bean_pipeline` calls on candidates. Synthesize a starting hypothesis with Other Lots, Not This Lot caveat. Producer tasting notes serve as cup-side ballpark.
   - **STAGE 2 — Design the single profile (tolerance-anchored)**: `push_experiment` with batch_ids cardinality 1 + `push_roast_recipe` (1 row, with rationale + design intent + drop rules) + `push_roast_profile` (1 row to Roest) + `patch_roast_recipe` to link Roest IDs. Design philosophy: anchor central in carry-forward window with deliberate margin on both sides. NOT super-fast / very-low-tolerance. NOT super-long / pull-at-last-second. Middle-of-the-road for operator grace.
   - **STAGE 3 — Record the roast** (after Chris executes at machine): `pull_roest_log` + operator-override check + `push_roast` linked to recipe_id + `patch_experiment` with observed_outcome_a + delta_from_roast_a + updated_cup_prediction_a + taste_for_a (single slot each, not a/b/c).
   - **STAGE 4 — Record Day 7 cupping**: `push_cupping` (typically xbloom_gate) + `patch_experiment` with delta_from_cup_a (against producer notes + carry-forward expectations, NOT against multi-slot variance which doesn't exist) + verdict decision: reference-quality OR "Closed without reference."
   - **STAGE 5 — Brew dial-in handoff (conditional)**: if roast wasn't reference quality, hand off to brewing-side workflow. After Chris dials in optimized brew, `push_brew` with `source: "self-roasted"` + `green_bean_id` + `roast_id` + `what_i_learned` capturing compensation reasoning. This stage may run days/weeks after STAGE 4.
   - **STAGE 6 — Close-out with constrained carry-forward**: `patch_roast` `is_reference: true` if reference-quality outcome else stay false. `push_roast_learnings` with CONSTRAINED fields (writes only: `best_roast_id`, `why_this_roast_won` or NULL for Closed-without-reference, `cultivar_takeaway` Low confidence, `general_takeaway` Low confidence, `starting_hypothesis` for next similar one-shot, `reference_roasts`, `aromatic_behavior`, `structural_behavior`; rejects: the 7 lever-attribution fields per schema validation). `propose_doc_changes` for ROASTING.md close-out narrative. `patch_inventory` archive.
   - **STAGE 7 — Confirmation output**: standard table + explicit Closed-without-reference framing if applicable.

4. **MCP registration in `lib/mcp/docs.ts`**:
   - Add `one-shot` to `PROMPT_FILES` (becomes the 9th operational prompt)
   - Add `docs://prompts/one-shot.md` entry to `DOC_DESCRIPTIONS` with description

5. **CONTEXT.md additions** (three pieces):
   - New entry: **"One-shot lot"** under § The unit (after "Lot") — defines the unit + distinguishing constraint
   - Extension: **"Tolerance-anchored design"** as third bullet in the "Adjustment" definition (alongside V1-exploratory and V_(n+1)-convergent)
   - New entry: **"Closed without reference"** under § Lot-close synthesis — defines the two paths (exhausted V-set, missed one-shot) + acknowledges Sprint 3.2 #18's existing ResolvedView sub-card render

6. **Cross-doc updates** (per the standing "Cross-system audit before PR" rule):
   - CLAUDE.md doc index: 8 operational prompts → 10; add one-shot.md + one-shot-closeout.md to the roasting-side list
   - README.md doc index: same update
   - PRODUCT.md prompt list: update count + add one-shot to the workflow framing
   - ROASTING.md Data Capture Per Step workflow table: add a row for one-shot lots OR restructure to two columns (V-set lifecycle / one-shot)
   - SYNC_V2.md Resources table: add one-shot to the prompts list
   - `docs/prompts/start-lot.md` top-matter: brief cross-reference noting one-shot lots route via one-shot.md instead

## Scope — out

- **Page UI changes for one-shot lots.** Sprint 3.2 #18's "Closed without reference" sub-card on ResolvedView already handles the page render for closed-without-reference cases. A future polish PR could add a "One-shot" badge to the lot header or simplify the resolved-view for single-experiment lots. Out of scope for this sprint.
- **Schema migration sprint candidates from Round 3/4** (`cuppings.wb_to_ground_delta` derived column, `is_reference_candidate` boolean, `cuppings.sweetness` column). Defer to a separate schema-migration sprint that bundles them.
- **Rounds 1-4 polish PR** (8 prompt edits to log-cupping.md + log-roast.md, 3 schema-description edits, 1 MCP fix, 3 page-render reorders). Defer to its own polish PR after Higuito V3 cupping on 2026-05-19.
- **CCIL consolidation arbiter task** (Round 4 #11). Long-term doc maintenance, separate sprint.

## Operational backfill — Rancho Tio (post-merge)

After the sprint lands and Vercel deploys, Chris runs the one-shot.md prompt retrospectively on Rancho Tio via a claude.ai session. Specific operations:
- `patch_green_bean(rancho_tio_id, is_one_shot: true)`
- `push_experiment` with `RANCHO-TIO-EMILIO-V1`, batch_ids="179", 1-batch V-set framing, primary_question + context + expected_outcomes from Chris's memory of the design intent
- `patch_roast_recipe` on the existing shell (recipe_id 5ee6f646... or whichever — query at backfill time) to set `experiment_id` linkage + `batch_slot: "v1a"` + `rationale` + design intent
- `patch_roast(179, is_reference: true)` to align with the existing roast_learnings row that names it best
- Decision: leave existing roast_learnings populated fields as-is (they predate the validation; clearing them is destructive) OR `patch_roast_learnings` to NULL out the lever-attribution fields for retroactive consistency with the new constraint. Chris's call at backfill time.

## Files likely to touch

| File | Change |
|---|---|
| `supabase/migrations/054_one_shot_flag.sql` | New migration |
| `lib/roast-import.ts` | `persistRoastLearnings` validation logic |
| `lib/mcp/push-roast-learnings.ts` | Schema validation reflection in tool description (note the constraint exists) |
| `lib/mcp/docs.ts` | `PROMPT_FILES` + `DOC_DESCRIPTIONS` |
| `lib/types.ts` (if it tracks GreenBean type) | Add `is_one_shot` field |
| `docs/prompts/one-shot.md` | NEW |
| `docs/prompts/start-lot.md` | Brief cross-reference at top |
| `CONTEXT.md` | 3 additions |
| `CLAUDE.md` | Doc index updates |
| `README.md` | Doc index updates |
| `PRODUCT.md` | Prompt list + flow framing |
| `ROASTING.md` | Data Capture Per Step workflow table |
| `SYNC_V2.md` | Resources table |

## Verification plan

- [ ] `npx tsc --noEmit` clean after Node-side validation lands
- [ ] Migration applies cleanly via Supabase apply_migration MCP. Verify `green_beans.is_one_shot` column exists + defaults to false on all 13 existing rows.
- [ ] Validation test cases via direct MCP calls:
  - `push_roast_learnings` with `green_bean_id` where `is_one_shot=true` + `primary_lever: "x"` → validation error
  - Same green_bean + `cultivar_takeaway: "x"` only → succeeds
  - Different green_bean where `is_one_shot=false` + `primary_lever: "x"` → succeeds
- [ ] Vercel preview after PR merge: claude.ai's `list_docs` returns 9 prompts including one-shot
- [ ] `read_doc(uri="docs://prompts/one-shot.md")` returns content
- [ ] Rancho Tio backfill executes cleanly via the new prompt (Chris does this manually post-merge)
- [ ] First real auction-lot sample arrives → Chris runs one-shot.md end-to-end → friction signals captured in feedback_mcp_continuous_log.md Round 5

## Implementation order

1. Migration (`054_one_shot_flag.sql`)
2. Apply migration via MCP `apply_migration`
3. Validation logic in `lib/roast-import.ts`
4. Update `lib/mcp/push-roast-learnings.ts` tool description (note constraint exists)
5. `lib/types.ts` GreenBean field
6. Draft `docs/prompts/one-shot.md`
7. Register in `lib/mcp/docs.ts`
8. CONTEXT.md additions (3 pieces)
9. Cross-doc updates (CLAUDE.md + README.md + PRODUCT.md + ROASTING.md + SYNC_V2.md + start-lot.md cross-reference)
10. `npx tsc --noEmit` final verify
11. Commit + push + open PR
12. Operational: Chris runs Rancho Tio backfill via the new prompt once Vercel deploys main

## Locked decisions (post Q&A with Chris)

1. **STAGE 5 split**: Option B - two prompts at natural session boundary. `one-shot.md` covers STAGES 1-4 (intake → design → roast → cup verdict). `one-shot-closeout.md` covers STAGE 5 (brew push + roast_learnings + ROASTING.md + archive). Matches the existing 4-prompt V-set pattern (start-lot / log-roast / log-cupping / close-lot). Total prompts becomes 10 (4 brewing-side + 4 V-set roasting + 2 one-shot).

2. **`patch_green_bean` accepts `is_one_shot`**: YES. Adds the field to the patch payload so Rancho Tio (and any future post-intake-flagged lot) can be marked retroactively without recreating the row.

3. **Page UI changes**: deferred to future polish PR per scope.

4. **Carry-forward confidence framing**: prose-prefix discipline. The `one-shot-closeout.md` prompt writes "Low confidence - N=1, verify on next similar lot" as a prefix on `cultivar_takeaway` / `general_takeaway` / `starting_hypothesis` prose. No separate schema column. Lighter touch + reader sees confidence inline.
