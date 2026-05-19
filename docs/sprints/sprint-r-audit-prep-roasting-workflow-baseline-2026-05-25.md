# Sprint R — Audit prep: roasting workflow baseline (as of 2026-05-25)

**Purpose:** Hand-off artifact for the upcoming audit-execution sprint. Chris reads this and immediately sees either "yes that's what I do" or "wait, I haven't been doing X." The point is to surface where lived practice has drifted from the substrate, so the architecture brainstorm cluster (#5+#6+#7) starts from a clean baseline.

**Source:** Pulled literally from ROASTING.md + the 6 roasting-side prompts (start-lot.md / log-roast.md / log-cupping.md / close-lot.md / one-shot.md / one-shot-closeout.md) + CLAUDE.md § Green + CONTEXT.md vocabulary. No editorializing about what the workflow SHOULD be; just what the docs currently say it IS.

---

## Phase 1: Intake (green bean enters inventory)

**Trigger:** New green-bean lot acquired. Routing decision: V-set lot (5-10+ batches, iteration) or one-shot (single batch ~100-120g, no iteration; `is_one_shot=true`).

**Inputs Chris provides (LOT SPEC block in claude.ai session):**
- Green Lot ID, Coffee Name, Variety, Producer, Region/Origin, Seller/Importer, Process
- Moisture %, Density g/L, Purchase Date, Altitude (optional)
- Producer's tasting notes (verbatim, required), Process detail, Reference roast comparison, Learning intent

**claude.ai work (`start-lot.md` STAGE 1):**
- `list_roest_inventory({search: "<bean>"})` — fetch richer producer/region/moisture/density/notes from Roest source of truth
- Verify Producer in `read_canonical(axis: "producers")` — if not found, set `producer_override: true`
- Verify Region/macro_terroir in `read_canonical(axis: "terroirs")` — halt if no canonical macro covers the region; otherwise use meso_terroir for locality
- Verify Cultivar in `read_canonical(axis: "cultivars")` — Spanish variants (Sudán Rumé) alias to canonical (Sudan Rume)

**MCP writes:**
- `push_green_bean(lot_id, name, cultivar, terroir, producer, moisture, density, ...)` → returns `green_bean_id`
- `push_inventory(green_bean_id, roest_inventory_id, ...)` → links DB to Roest

**App state after:** In inventory → Waiting for next roast (lot appears on `/green` under Waiting for next roast section)

**Key vocabulary:** `green_bean_id` (DB entity PK) · `terroir`/`cultivar` (strict canonical w/ find-or-create) · `producer_override` flag · `meso_terroir` (locality, free-text) · `macro_terroir` (broader region, canonical-strict) · `roest_inventory_id` (FK linkage)

---

## Phase 2: V1 design (experiment frame before roasting)

**Trigger:** Ready to design first V-set. (For one-shot lots, skip to Phase 2b.)

**Inputs Chris provides:** Experimentation intent (what response surface to explore, what prior carry-forward applies)

**claude.ai work (`start-lot.md` STAGE 2):**
- `read_doc_section(uri="docs://roasting.md", anchor="Standard Inlet Curve Template")` — 7-timestamp fixed template
- `read_doc_section(..., anchor="Cross-Coffee Insight Layer")` — starting hypothesis from similar lots
- `get_bean_pipeline({green_bean_id})` on prior similar lots — pull `roast_learnings` carry-forward (cultivar/terroir/process overlaps)
- Draft V1 experiment frame (6 fields per Sprint 12 / ADR-0009 + Sub Pages 6.7):
  - `context` (why V1 exists)
  - `primary_question` (broad on V1: "Where does this coffee's window sit?")
  - `control_baseline` (peer reference, optional)
  - `shared_constants` (Charge 117°C, Hopper 125°C, Preheat 210°C, fan/RPM/drum defaults)
  - `levels_tested` (values across v1a/v1b/v1c)
  - `expected_outcomes` (predicted FC time/temp/total/Agtron AND cup layer for each slot)
  - Optional: `failure_boundary` (cup descriptors that mean V1 failed)

**V1 width rule:** Wide-variance multi-variable exploratory. ~5°C+ peak inlet spread fine. Not narrow 1-variable. Point is to *find response surface*, not narrow on it.

**MCP writes (STAGE 3):**
- `push_experiment(green_bean_id, experiment_id="<LOT-PREFIX>-V1", context, primary_question, shared_constants, levels_tested, expected_outcomes, control_baseline?, failure_boundary?, variable_changed)` → returns `experiment_pk` (UUID)
- `push_roast_recipe(green_bean_id, experiment_id=experiment_pk, batch_slot="v1a"|"v1b"|"v1c", recipe_name, rationale, temperature_bezier, fan_bezier, rpm_bezier, end_condition_type="bean_temp", end_condition_target=°C, predicted_fc_temp, predicted_fc_time, predicted_total_time, predicted_agtron_wb, predicted_cup)` × 3 → returns `recipe_id` per slot
- `push_roast_profile(name, preheat_temperature_c, temperature_bezier, fan_bezier, rpm_bezier, end_condition, end_condition_value, enable_share=true)` × 3 → returns `profile_id`, `share_url`
- `patch_roast_recipe(recipe_id, roest_profile_id, roest_share_url, roest_profile_name, pushed_to_roest_at)` — wire recipe to profile

**App state after:** Waiting for next roast (Sub Pages 6.3 page shape renders Roast Hypothesis transposed table)

**Key vocabulary:** `experiment_id` (human label, e.g. "BUKURE-V1") · `experiment_pk` (UUID) · `batch_slot` (v1a/v1b/v1c) · `recipe_id` (PK) · `roest_profile_id` (Roest system) · `variable_changed` (single axis being probed) · `rationale` (per-batch hypothesis, distinct from `notes`) · `predicted_*` (frozen at design time)

---

## Phase 2b: One-shot design (tolerance-anchored single-batch)

**Trigger:** One-shot lot detected (`is_one_shot: true` set at STAGE 1 intake).

**Inputs Chris provides:** Carry-forward learnings, tolerance target (how much brewing latitude this coffee needs).

**claude.ai work (`one-shot.md` STAGE 1-2):**
- `read_doc_section(uri="docs://roasting.md", anchor="Tolerance-Anchored Design")` — NOT super-fast/very-low, NOT super-long, middle-of-road with grace
- `get_bean_pipeline({green_bean_id})` on prior lots with matching cultivar/terroir/process — pull carry-forward
- Design single recipe v1a anchored on tolerance band, not wide-variance exploration

**MCP writes:**
- `push_experiment(green_bean_id, experiment_id="<LOT-PREFIX>-V1", ..., batch_ids=null at design time)` — single-experiment frame
- `push_roast_recipe(green_bean_id, experiment_id=experiment_pk, batch_slot="v1a", ...)` — one recipe
- `push_roast_profile(..., enable_share=true)` — one profile

**App state after:** Waiting for next roast

**Key vocabulary:** `is_one_shot` (true flag) · "tolerance-anchored" (vs wide-variance) · N=1 constraint (no cross-batch leverage attribution at close-out per Phase 5b)

---

## Phase 3: Roast execution (V_n batch runs on Roest L200 Ultra)

**Trigger:** V_n recipes designed. Ready to roast.

**Inputs Chris provides:** Actual roast logs from Roest tablet (fc_temp, drop_temp, fc_start, dev_time_s, agtron, fan_curve, inlet_curve, roest_notes), prose fields (`what_worked`, `what_didnt`, `what_to_change`), augments (yellowing_temp, tp_temp, fc_total_cracks, **`fc_audibility` 4-value enum** post Sprint 11).

**claude.ai work (`log-roast.md` STAGE 1-7):**
- `get_green_bean({lot_id or green_bean_id})` — resolve bean state
- `get_bean_pipeline({green_bean_id})` — resolve V_n state (detect V1/V2/etc.)
- `list_roest_logs({inventory_id})` — discover log_ids for this lot's Roest inventory
- `pull_roest_log({log_id})` — normalize Roest payload (batch_id, fc_temp, drop_temp, fc_start, drop_time, dev_time_s, fan_curve, inlet_curve, agtron, weight_loss_pct, hopper_load_temp, end_condition_type/target, roest_notes, roast_date local TZ)
- Augment with `fc_audibility` (post Sprint 11 / migration 061 — values: `audible` / `subtle` / `silent` / `ambiguous`), `fc_total_cracks` (audible count if applicable), `what_worked`, `what_didnt`, `what_to_change`

**MCP writes:**
- `push_roast(green_bean_id, batch_id, fc_temp, drop_temp, agtron, fc_audibility, fc_total_cracks?, roest_log_id, ..., what_worked, what_didnt, what_to_change)` → returns `roast_id`
- `patch_roast_recipe(recipe_id, ...)` — backfill any design-time nulls if needed (`was_backfilled` flag set per Schema S4 / migration 057)
- `patch_experiment(experiment_pk, taste_for_a/b/c, updated_cup_prediction_a/b/c, delta_from_roast_a/b/c)` — post-roast reconciliation vs recipe predictions (16 cross-batch fields per Sub Pages 6.1)

**App state after:** Waiting for next roast (multiple roasts per V_n) → Waiting for next cupping (once all V_n roasts logged AND cupping data missing OR winner null)

**Key vocabulary:** `batch_id` (Roest tablet label) · `fc_audibility` (4-value enum; subtle/silent/ambiguous trigger same downstream protocol — bean-temp end condition + drop-ceiling-primary + Agtron as proxies) · `end_condition_type` (bean_temp / dev_time / manual) · `roest_log_id` (Roest FK) · `updated_cup_prediction` (post-roast re-prediction, distinct from recipe's `predicted_cup`)

---

## Phase 4: Cupping evaluation (Day 7 pourover per V_n batch)

**Trigger:** Roast batches rested 7 days. Ready to cup V_n set.

**Inputs Chris provides:** Day 7 pourover cupping per slot (`eval_method="Pourover"`, `rest_days=7`, `ground_agtron` cm-200 pre-brew, prose: aroma, flavor, acidity, sweetness, body, finish, overall, `temperature_behavior`, **`aromatic_behavior`** + **`structural_behavior`** per Sprint 11 / ADR-0008 / migration 062 — relocated FROM roast_learnings TO cuppings).

**claude.ai work (`log-cupping.md` STAGE 1-7):**
- `get_bean_pipeline({green_bean_id})` — resolve V_n roasts and experiment state
- **Pre-rewrite check:** if V_n roasts exist but no experiment_pk, halt (STAGE 0)
- `push_cupping(roast_id, cupping_date, eval_method="Pourover", rest_days=7, ground_agtron, aroma, flavor, acidity, sweetness, body, finish, overall, temperature_behavior, aromatic_behavior, structural_behavior)` per slot → returns `cupping_id` per roast
- Decide routing (Path A / B / C):
  - **Path A:** Leading slot is reference-quality. Close-out ready.
  - **Path B:** Need V_(n+1). Design next experiment frame, push recipe rows.
  - **Path C:** Pre-V_(n+1) calibration gate. Two variants: **C-1 calibration** (recipe tweak before next V-set) / **C-2 discriminator** (back-to-back dual cupping to disambiguate ambiguous V_n result). C-1/C-2 was the Round 3 + Round 7 dogfood pattern that claude.ai had been inventing inline; codified in Sprint 6 / DF-A3.
- `patch_experiment(experiment_pk, taste_for_a/b/c, delta_from_cup_a/b/c, key_insight, key_insight_confidence, winner="V<n><letter> (Batch <Roest#>)")` — wire cupping outcomes back to experiment

**Optional mid-flight quality flag:** `patch_roast(roast_id, is_reference_candidate=true)` on the leading slot per Schema S2 / migration 056 — distinct from final `is_reference` and recipe-replay `worth_repeating`.

**MCP writes:**
- `push_cupping(...)` per slot
- `push_roast_recipe(...)` if Path B (design V_(n+1))
- `push_roast_profile(...)` if Path B
- `patch_roast_recipe(recipe_id, roest_profile_id, roest_share_url)` if Path B
- `patch_experiment(..., winner, key_insight, key_insight_confidence, delta_from_cup_a/b/c)`

**App state after:**
- Path A → Resolved-pending (ready for close-lot.md)
- Path B → Waiting for next roast (V_(n+1) frame designed, loop to Phase 3)
- Path C → Waiting for next roast (calibration recipe pushed, loop to Phase 3)

**Key vocabulary:** `cupping_id` (UPSERT on roast_id + cupping_date + eval_method + recipe_variant) · `ground_agtron` (post-grinding pre-brew Agtron, distinct from `wb_agtron` snapshot per Schema S1 / migration 055 — generates `wb_to_ground_delta`) · `sweetness` / `temperature_behavior` / `aromatic_behavior` / `structural_behavior` (4 distinct prose axes on cuppings) · `key_insight_confidence` (Low / Medium / Medium-High / High ladder) · `winner` (slot designation "V<n><letter> (Batch <Roest#>)") · `leading_slot` (V-set level) · `Path A/B/C` (routing decision; C is the operator-decided interim discriminator with C-1 / C-2 sub-variants)

---

## Phase 5: Close-out (reference roast locked, lot lessons captured)

**Trigger:** Path A routed from cupping. Ready to finalize lot and write carry-forward learnings.

**Inputs Chris provides:** Reference roast `batch_id`, per-lot lessons (14 prose fields), optimized brew target for this lot.

**claude.ai work (`close-lot.md` STAGE 1-7):**
- `get_bean_pipeline({green_bean_id})` — verify Resolved-pending state
- `patch_roast(roast_id, is_reference=true, worth_repeating="yes"|"no"|"pending")` — mark reference batch structurally
- Write roast_learnings row: `push_roast_learnings(green_bean_id, best_roast_id, why_this_roast_won, primary_lever, secondary_levers, roast_window_width, brewing_tolerance, what_didnt_move_needle, underdevelopment_signal, overdevelopment_signal, rest_behavior, cultivar_takeaway, cultivar_takeaway_scope_tags, terroir_takeaway, terroir_takeaway_scope_tags, general_takeaway, general_takeaway_scope_tags, starting_hypothesis, starting_hypothesis_scope_tags)` → returns `roast_learnings_id`
- `push_brew(coffee_name, roaster="Latent", terroir, cultivar, green_bean_id, roast_id, extraction_strategy, ..., what_i_learned)` — handoff to brewing workflow

**MCP writes:**
- `patch_roast(roast_id, is_reference=true)`
- `push_roast_learnings(...)` — per-lot lessons for carry-forward
- `push_brew(...)` — optimized brewing reference for this lot
- `patch_inventory(roest_inventory_id, is_archived=true)` — mark Roest lot closed

**App state after:** Resolved-pending → Resolved. Lot surfaces on `/green` under "Resolved" with ResolvedView page shape (Sub Pages 6.5).

**Key vocabulary:**
- `roast_learnings_id` (PK)
- `is_reference` (structural: which row the page renders as winner)
- `is_reference_candidate` (mid-flight; does NOT auto-promote to is_reference)
- `worth_repeating` (recipe-replay judgment, distinct axis)
- `why_this_roast_won` (prose verdict)
- `primary_lever` (single variable that mattered most)
- **`brewing_tolerance`** (renamed from `elasticity` Sprint 10 / ADR-0007 / migration 060 — how cup holds up under brewing push)
- **`terroir_takeaway`** (added Sprint 10 alongside cultivar_takeaway + general_takeaway)
- **`*_scope_tags text[]`** (Sprint 12 / ADR-0009 / migration 064 — prefix-namespaced strings like `process:washed` / `variety:sudan-rume` / `general` for cross-lot SQL queries; UI surfacing deferred)

---

## Phase 5b: One-shot close-out (constrained lessons, N=1)

**Trigger:** One-shot lot cupping complete. Verdict decision: Outcome A (reference-quality) or Outcome B (closed without reference).

**Inputs Chris provides:** Verdict, constrained `roast_learnings` (terroir_takeaway allowed, lever-attribution fields MUST be NULL), optimized brew if Outcome A.

**claude.ai work (`one-shot-closeout.md` STAGE 1-7):**
- `patch_roast(roast_id, is_reference=true unconditionally, worth_repeating=...)` — one-shot always has structural reference (single batch)
- Write constrained roast_learnings: lever fields (`primary_lever`, `secondary_levers`, `roast_window_width`, `brewing_tolerance`, `what_didnt_move_needle`, `underdevelopment_signal`, `overdevelopment_signal`) MUST be NULL. Carry-forward fields (`terroir_takeaway`, `cultivar_takeaway`, `general_takeaway`) prefixed with "Low confidence - N=1, verify on next similar lot"

**MCP writes:**
- `patch_roast(roast_id, is_reference=true)` — unconditional
- `push_roast_learnings(green_bean_id, ..., primary_lever=NULL, ..., terroir_takeaway="Low confidence - N=1, ...", ...)`
- `push_brew(...)` — handoff if Outcome A

**App state after:** Resolved-pending → Resolved

**Key vocabulary:** `is_one_shot` (true flag) · Outcome A/B (reference-quality vs closed without reference) · `why_this_roast_won` (NULL on Outcome B; triggers "Closed without reference" UI card on ResolvedView) · lever-attribution NULL constraint (N=1 cannot support cross-batch evidence)

---

## Substrate dependencies (full read/write surface)

**ROASTING.md sections referenced:** Standard Inlet Curve Template (7 timestamps) · Cross-Coffee Insight Layer (carry-forward search) · Active Lots sections (v-set design narrative) · Closed Lots archive (lot close-out narratives) · Tolerance-Anchored Design (one-shot) · FC Marking Protocol · Counterflow methodology

**CONTEXT.md vocabulary referenced:** V-set · batch slot · experiment frame · variable · lever · taste-for · leading slot · reference roast · adjustment · brewing tolerance · acceptable roast window · scope tags · scope-tag prefix convention · recipe · Roest profile · curve-shape names · FC audibility state · aromatic behavior · structural behavior · rest behavior · reference candidate · key insight confidence · Path A/B/C

**Roest L200 Ultra:** Profile delivery + Roest API logs (batch data source)

**MCP Tools used in roasting flow (subset of 35):** 15 read · 9 write (push_*) · 9 patch (patch_*) · plus arbiter tools

---

## Hand-off points (where the workflow yields back to a human)

- **Intake → V1 design:** Chris's strategic call (what to learn from this lot)
- **V1 design → Roast execution:** physical roast on Roest L200 Ultra (Chris executes)
- **Roast execution → Cupping:** rest period (Day 7 wait)
- **Cupping → Routing (Path A/B/C):** Chris's judgment call (reference-quality, need next V, calibration gate)
- **Path C → Path B:** discriminator-gate decision after calibration cupping
- **Close-out → Brewing handoff:** Chris's brew dial-in (optimized brew reference)
- **Lot Resolved → Future:** lot surfaces on `/green` for cross-lot pattern matching on future similar lots

---

## Notable substrate gaps Chris may notice

These are points where the substrate ASSUMES Chris does something but the workflow may have drifted:

1. **`fc_audibility` capture (Sprint 11):** historical 135 roasts left NULL; Chris is supposed to populate forward. Is he?
2. **`*_scope_tags` arrays (Sprint 12):** present on `push_roast_learnings`, unrendered in UI. Is Chris setting them at close-out? Do they feel useful or are they overhead?
3. **`is_reference_candidate` (Schema S2):** mid-flight flag set at cupping STAGE 3 on leading slot. Is Chris using this, or is he just waiting until close-out to set `is_reference`?
4. **Path C operator-decided discriminator (C-1 / C-2):** Sprint 6 / DF-A3 codified this pattern. Does it match what Chris actually does mid-V-set, or did claude.ai's encoding diverge?
5. **One-shot constraint discipline (Phase 5b):** lever fields MUST be NULL on Outcome A/B. Is Chris (or claude.ai) ever filling them in anyway?
6. **`is_one_shot=true` at STAGE 1 intake:** is this routing reliably?

These six are the most likely substrate-practice gap candidates for the audit-execution sprint to surface.

---

## Output format for the audit-execution sprint

For each phase, flag:
- ✅ matches lived practice
- ⚠️ partially matches (specify what diverges)
- ❌ doesn't match (specify what lived practice is)

Bundle findings into `memory/project_audit_cluster_2026-05-XX.md` along with the brewing baseline findings. Substrate updates flowing out of this go into either (a) CONTEXT.md glossary entries with new ADRs if architectural, or (b) `feedback_*.md` memory entries if standing-rule.
