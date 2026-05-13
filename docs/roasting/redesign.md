# Roasting Side Redesign — Implementation Handoff

This document captures the full design conversation that led to the current set of roasting-side decisions. It is intended for Claude Code as the implementing partner. Read it end-to-end before writing migrations or shipping page changes — the decisions are interdependent and several of them only make sense after seeing the full chain of reasoning.

The brewing side of the app is out of scope. Everything in this document is about the **roasting workflow**: green beans in storage, designing experiments, executing roasts, evaluating cuppings, and resolving lots into reference roasts.

---

## 1. Context — What We Were Solving

The user (Chris) is a competition-level home roaster operating under the name Latent Coffee. He roasts on a Roest L200 Ultra in counterflow mode, 100g batches, targeting Brewers Cup standard light roasts. The roasting practice is structured as a series of **experiment sets per green bean lot** — typically three batches per set (v1a/v1b/v1c, then v2a/v2b/v2c, etc.) varying one parameter at a time, with Day 7 pourover as the canonical evaluation gate.

Each lot's data trail looks like: green bean intake → V1 experiment design → three roasts → Day 7 cupping → synthesis → V2 design → three more roasts → ... until a reference roast is confirmed OR the green bean inventory is exhausted. At that point the lot is "resolved" and its lessons feed back into the broader practice.

### The original problem

The roasting-side pages on the app were generic detail views — they didn't reflect the **lifecycle states** that a green bean lot moves through. Specifically:

- The index page was a flat list of green beans with no indication of where each one was in its experimental lifecycle.
- The experiment table was an undifferentiated blob — fields like `expected_outcomes` and `observed_outcome_a/b/c` mixed roast-side data (FC temps, drop temps) with cupping-side data (cup descriptors) in the same cells. This made the schema confusing to write to and confusing to read from.
- Recipes (the actual roast profile design — peak inlet, fan curve, drop rules, predictions) lived implicitly inside the Roest's profile library and partially on the `roasts` table as serialized strings. They weren't first-class objects in the data model.
- There was no clear place to capture the predictions-vs-actuals deltas that are the core learning signal of the practice.

### The goal

Rebuild the roasting-side IA around the **lifecycle states** the user actually thinks in, with a data model that cleanly separates each temporal moment (design, roast, cupping prep, cupping, synthesis) into its own typed location.

---

## 2. The Critical Operating Model Change

**Going forward, Claude (via the Latent Coffee MCP) is the sole writer to the roasting database.** The user does not enter data into forms, does not edit fields in the UI, does not toggle states. He talks to Claude, Claude executes MCP calls, the data updates, the pages re-render to reflect the new state.

This has cascading implications that Claude Code needs to internalize before implementing:

- **No editing surfaces on any page.** No inline textareas, no "edit" buttons, no save-draft affordances, no machine-companion modes, no form pages. The entire roasting-side UI is read-only display.
- **The whole "add/form" pathway on the existing app should be deprecated for roasting.** Brewing-side may keep its form pathway — that's not in scope here. But for green beans, experiments, recipes, roasts, and cuppings: remove the form-driven entry surfaces.
- **No multi-stage UI affordances.** If the user wants to mark a cupping as the final cupping that triggers synthesis, he tells Claude in chat. No UI toggle for it. No "trigger synthesis" button.
- **No optimistic UI / no edit history visible to user.** Claude makes the MCP call, the canonical state updates, the page reflects it. There's no client-side editing state to manage.
- **Pages can use color and visual treatments that previously implied "this is the active editing surface."** Those colors now signal **temporal salience** — "this is the cognitive layer currently active in the lifecycle" — rather than edit affordance. Same visual, different semantic meaning. Worth keeping for navigability.

Optimize the data model and the page templates for **easy MCP writes and clean reads**, not for human form ergonomics.

---

## 3. Where We Ended Up — The Lifecycle States

A green bean lot moves through these states. The state determines which page renders for that lot:

1. **In inventory** — green bean exists in storage, no experiments started yet. (Page intentionally punted for now.)
2. **In process · waiting for next roast** — the next experiment set has been designed, recipes are ready (or pushed to Roest), but the roasts haven't happened yet. The active artifact is the **experiment design + recipes**.
3. **In process · waiting for next cupping** — the latest experiment set has been roasted but not yet cupped. The active artifact is the **post-roast cupping prep** (updated predictions, what to taste for).
4. **Resolved** — a reference roast has been confirmed, or the green bean was exhausted. The active artifact is the **lot's distilled lessons** and the reference roast itself.

The user moves from waiting-for-next-roast → waiting-for-next-cupping → (back to waiting-for-next-roast for V_(n+1)) repeatedly, until the lot resolves. There is no separate "synthesis transition" page — synthesis happens via Claude updating the experiment record in place, after which the page transitions to the next state on its own.

---

## 4. The Data Model — Final Locked Schema

Six entities. Each has a clear lifecycle ownership. Predictions, deltas, and synthesis all live on `experiments` (the entity that represents cross-batch reasoning). Per-batch facts live on the entities that own those facts (`roasts`, `cuppings`). Recipe design intent lives on its own first-class entity (`roast_recipes`).

### 4.1 `green_beans`

Unchanged. Holds lot identity, supplier, terroir, cultivar, producer notes, density, moisture, anchor recommendation, etc. This is the entity that all other roasting data hangs off of.

### 4.2 `experiments`

Set-level reasoning. One row per experiment set (V1, V2, V3, etc.) per lot. Contains:

**Frame fields (written at design time)**
- `primary_question` — what we're trying to answer in this experiment set
- `variable_changed` — what's varying across the batches
- `levels_tested` — the specific values being tested (e.g. "v1a 242°C / v1b 247°C / v1c 252°C")
- `shared_constants` — what's held the same across all batches in the set
- `control_baseline` — the reference batch this experiment iterates from
- `failure_boundary` — what would invalidate a batch as a data point
- `context` — any additional set-level context
- `batch_ids` — pointers to the recipes (and downstream roasts) that make up this set

**State-3 active fields (written between roast and cupping)**
- `updated_cup_prediction_a/b/c/d` — cup prediction per batch, updated after seeing roast actuals
- `taste_for_a/b/c/d` — the cupping-table question per batch ("what to actively listen for in this cup")

**Delta fields (written after roast and after cupping)**
- `delta_from_roast_a/b/c/d` — what worked vs didn't on the roast, relative to recipe predictions
- `delta_from_cup_a/b/c/d` — what the cup actually was vs what was predicted

**Synthesis fields (written after final cupping)**
- `winner` — which batch (or none) was best
- `key_insight`
- `key_insight_confidence`
- `what_changes_going_forward`
- `open_questions`
- `additional_notes`
- `observed_outcome_a/b/c/d` — RELABEL FROM EXISTING SCHEMA. Previously this field mixed roast facts and cup descriptors. Now it's narrowly "cross-batch notes prose" — the connective synthesis between batches that doesn't fit cleanly into other fields. Roast facts live on `roasts`, cup descriptors live on `cuppings`.

### 4.3 `roast_recipes` (NEW)

First-class entity for design intent per batch. One row per batch-execution intent. This is the entity that holds the recipe as designed, separate from the roast that executes it.

Fields:

**Identity**
- `recipe_id` (PK)
- `recipe_name` (e.g. "Higuito - v3a")
- `experiment_id` (FK to `experiments`)
- `green_bean_id` (FK to `green_beans`)
- `batch_slot` ("v3a", "v3b", "v3c", "v3d") — within its experiment
- `parent_recipe_id` (FK to `roast_recipes`, nullable) — for lineage. When v3a "is the same recipe as v2b" or "marginal modification of v2b," this expresses it. Populate going forward; old recipes can backfill manually.

**Curve definition**
- `temperature_bezier` (the inlet curve as structured data)
- `fan_bezier`
- `rpm_bezier`
- `end_condition_type` (BEAN_TEMP / DEV_TIME / etc.)
- `end_condition_target`
- `preheat_temperature_c`

**Design specs**
- `charge_temp`
- `hopper_load_temp`

**Design-time predictions**
- `predicted_fc_temp`
- `predicted_fc_time`
- `predicted_total_time`
- `predicted_maillard_pct`
- `predicted_agtron_wb`
- `predicted_cup` — the original cup prediction from design time

**Drop rules**
- `drop_rule_if_fast` — what to do if the roast hits end condition before expected total time
- `drop_rule_if_slow` — what to do if the roast overruns expected total without hitting end condition

**Roest linkage**
- `roest_profile_id`
- `roest_share_url`
- `roest_profile_name` — the exact name on the Roest tablet

**Metadata**
- `created_at`
- `pushed_to_roest_at`
- `notes`

**Important detail on recipe granularity**: each batch execution = one recipe. If v3a and v3c have identical inlet curves but different `end_condition_value`, they are two separate recipes. Matches how the Roest tablet stores them as separate profiles. Drives clean replication semantics later.

### 4.4 `roasts`

Slightly modified — now purely as-recorded facts. The recipe is referenced, not duplicated.

**Added**
- `recipe_id` (FK to `roast_recipes`)

**Kept**
- `fc_temp`, `fc_start`, `drop_temp`, `drop_time`, `dev_time_s`, `agtron`, `weight_loss_pct`, `maillard_pct`, `tp_time`, `tp_temp`, `yellowing_*`, all the existing observed-fact fields

**Kept for backward compat**
- `inlet_curve` / `fan_curve` as display strings — derivable from the recipe now, but keep until migration is complete. Can be deprecated in a phase 4 cleanup later.

**Kept as roast-specific prose**
- `what_worked`, `what_didnt`, `what_to_change`, `worth_repeating`, `roest_notes` — these stay where they are. They're roast-specific narrative that doesn't generalize to cross-batch reasoning.

The roast table holds **no predictions and no deltas**. Those moved to `experiments`.

### 4.5 `cuppings`

Unchanged structurally. Multiple cupping rows per roast are allowed (xbloom + simulated pourover for the same batch are two valid rows). No `is_final_evaluation` flag — the user triggers synthesis manually via Claude in chat.

Fields stay as-is: `aroma`, `flavor`, `acidity`, `body`, `finish`, `overall`, `ground_agtron`, `rest_days`, `eval_method`, `recipe_variant`, `roast_id` FK.

### 4.6 `roast_learnings`

Unchanged structurally. Per-lot synthesis at lot close-out, 1:1 with green_bean. Fields stay as-is: `best_batch_id`, `why_this_roast_won`, `primary_lever`, `secondary_levers`, `what_didnt_move_needle`, `roast_window_width`, `underdevelopment_signal`, `overdevelopment_signal`, `aromatic_behavior`, `structural_behavior`, `elasticity`, `rest_behavior`, `cultivar_takeaway`, `general_takeaway`, `starting_hypothesis`, `reference_roasts`, etc.

---

## 5. Page Structures — What to Build

### 5.1 Index page (lot list)

Three sections, top to bottom:

1. **Waiting for next roast** — lots whose next experiment is designed but not yet roasted
2. **Waiting for next cupping** — lots whose latest experiment is roasted but not yet cupped
3. **Resolved** — lots with confirmed reference roasts (or exhausted)

Each section header. Each row: lot color tile + lot name + lot metadata line (origin · cultivar · process) + right-aligned status indicator (the stage column for in-process; the reference batch number for resolved).

In-inventory lots (green bean exists, no experiments yet) — not on the index for now per user's punt. When inventory page is built later, those lots will live there or get a fourth section.

Use sentence case on the section headers consistent with the rest of the site ("Waiting for next roast", "Waiting for next cupping", "Resolved" — NOT "Waiting For Next Roast").

Right column stage labels can be kept even though they're redundant with the section header — they confirm the grouping at a glance without scrolling back up.

### 5.2 In-process · waiting for next roast

The page Claude has just designed the V_n recipes for. Top to bottom:

**Lot header** — color tile, lot name, lot ID, process tags.

**Roasts · V_n card**

Sub-card: **Primary Question** — the experiment frame's primary_question, in prose. One paragraph.

Sub-card: **Roast Hypothesis** — the heart of the page. A second line under the section header showing the anchor reference, drop ceiling, and FC window (e.g. "Anchor: Mandela XO #139 · Drop ceiling 212°C · FC window 200–208°C").

Then a **transposed table**: attributes as rows, batches as columns (v3a / v3b / v3c). Rows include:

- Drop temp — highlighted amber on the cell(s) where it varies across batches
- Peak inlet — highlighted amber on the cell(s) where it varies across batches
- Expected FC — formatted as "time / temp"
- Expected Total — render in bold, larger weight (this is load-bearing data at the machine)
- End Condition — formatted as monospace ("BEAN_TEMP 210°C")
- Predicted Agtron WB
- Hypothesis — per-batch prose rationale (the "why this specific recipe" reasoning, lives on `roast_recipes.notes` or a dedicated rationale field)

Below the main table, **Drop Rules card**: amber-tinted surface, two rows (If running fast / If running slow), three columns (v3a / v3b / v3c), each cell containing the specific rule.

**Green Bean Info card** — producer, price, moisture, quantity, density, plus producer's tasting notes prose. Standalone card below the experiment section.

**Roast Log card** — full table of every roast for this lot. Monospace data, Batch / Date / FC / FC Temp / Drop / Drop Temp / Dev / Agtron / WB-Gnd Δ. Highlight rows that belong to the current experiment set (subtle left-border accent or background tint).

**Additional Information** — collapsed block at the bottom for everything else.

### 5.3 In-process · waiting for next cupping

The page when the latest set has been roasted but not yet cupped. Top to bottom:

**Lot header** — same as roast view.

**Cupping Hypothesis · V_n card**

- Section title: "Cupping Hypothesis · V_n" (not "Cuppings" — the cuppings haven't happened yet)
- Sub-section: **Summary** — a transposed table:
  - Header row: V3a / V3b / V3c
  - Row: **Original prediction** (from `roast_recipes.predicted_cup`) — frozen, muted gray, prose per batch
  - Row: **Updated prediction** (from `experiments.updated_cup_prediction_*`) — purple-tinted active surface, prose per batch
  - Row: **Taste for** (from `experiments.taste_for_*`) — purple-tinted, prose per batch — the cupping-table question
- Below the summary table: **Reference signals for the cupping table** — a small purple-tinted card with three rows:
  - Producer notes
  - V_(n-1) winner cup (the prior experiment's reference)
  - Anchor cup (e.g. Mandela XO #139)

**Roast Actuals · V_n card** — six rows of recorded facts (FC, Drop, vs expected total, Dev time, Maillard, Agtron WB) per batch. Each batch column header includes the roast batch ID (e.g. "V3a · #167"). The "vs expected total" row shows deltas in amber text ("+5s overran" type formatting).

**Green Bean Info card** — same as roast view.

**Roast Log card** — same as roast view, with the current-experiment rows highlighted.

**Additional Information** — collapsed block at the bottom.

### 5.4 Resolved view

The lot is closed. The page is now a reference artifact. Top to bottom:

**Lot header** — same color tile + lot name, plus a "Resolved" status badge.

**Reference Roast card** — the single most-important block on the page.
- Section title: "Reference Roast" + the reference batch number in a pill (e.g. "Batch #133")
- "Why this roast won" — prose, in a soft green-tinted surface to mark it as the verdict
- "Reference Roast Recipe" — two-column layout:
  - Left column: recipe design specs (Peak inlet, Drop temp, End condition, Charge / hopper, Fan curve)
  - Right column: achieved values (FC time, FC temp, Drop time, Drop temp, Agtron WB / Gnd Δ)
- NO buttons (no "Push to Roest" — Claude does that via MCP)

**Reference Cup card**
- "Best cup synthesis" — prose paragraph synthesizing the cup across all evaluations
- Two side-by-side sub-cards:
  - Left: "Cupping · #{batch}" — Day 7 pourover descriptors
  - Right: "Optimized Brew · #{batch} retasted" — brew recipe + integration descriptors
- Bottom line: italicized producer notes for comparison

**Roasting Learnings: {lot name} card** — the lot-specific roasting character.
- Three character cards in a row at the top:
  - Primary Lever
  - Roast Window
  - Elasticity
- Detail rows underneath:
  - Secondary levers
  - Underdev signal — with inline batch reference (e.g. "e.g. #134")
  - Overdev signal — with inline batch reference (e.g. "e.g. #108")
  - What didn't matter
  - (Aromatic behavior, structural behavior, rest behavior as desired — kept dense per user's preference for completeness over sparseness)

**Roasting Learnings: To Carry Forward card** — what generalizes.
- Cultivar takeaway
- General takeaway
- Starting hypothesis for similar lots

(No "Contributed to practice" row — punted along with the cross-cutting knowledge layer.)

**Green Bean Info card** — same shape as in-process views.

**Roast log · {N} batches** — collapsed by default, expand on click. Reference batch row highlighted when expanded.

**All cuppings · {N} evaluations** — collapsed by default, expand on click.

**Experiment journey · V1 through V_n** — collapsed by default, expand on click. Per user's call: this is curated narrative content, not chronology, so when expanded it's the per-set summary cards (primary question, winner, key insight) rather than full transposed tables.

**Additional Information** — collapsed block at the bottom.

### 5.5 Visual treatment summary

Across all pages, the color usage is intentional:

- **Green** — the answer / resolution. Used for the lot color tile, the resolved badge, and the "Why this roast won" surface.
- **Purple** — cupping-related material. Updated predictions, taste-for fields, reference signals card.
- **Amber** — roast actuals / drop rules / "things to pay attention to during the roast." Used for highlighted varying rows in the design table, the "+5s overran" delta callouts, and the drop rules card surface.
- **Neutral surfaces** — everything else.

Colors signal **temporal salience** (which cognitive layer is active at this lifecycle stage) rather than edit affordance. There are no edit affordances.

---

## 6. What We Punted On

Two surfaces explicitly punted. Don't implement these now, but the data model should leave room for them.

### Inventory page

A page for in-inventory green bean lots (lots with green bean rows but no experiments started yet). Will eventually surface V1 vs. one-shot calibration lot distinction, gating flags (density measurement required), anchor profile distribution, suggested roasting order, deferred lots.

The information lives in a Word doc today (Green Coffee Inventory V3). When this page is eventually built, it will surface that content as structured data. No schema changes needed now — the green_beans table already supports it.

### Cross-cutting knowledge layer

A first-class section of the app aggregating principles, patterns, and anchor profiles across lots. The "Roasting Learnings: To Carry Forward" section on resolved lot pages would eventually have its individual takeaways link out to principle pages here.

The information lives in a master reference guide (Word doc) today. No schema changes needed now — when this section is built, it'll get its own entity (likely `principles` or `patterns` plus join tables to the lots that contributed evidence).

When working on resolved lots in the meantime, the "Contributed to practice" forward-pointer row has been removed. It'll come back when the knowledge layer is built.

---

## 7. Migration Strategy

Three-phase rollout. The phases are designed to be additive — phase 1 doesn't break anything that exists, phase 2 starts using the new structure for new data, phase 3 backfills relationships when convenient.

### Phase 1 — Schema additions, no breaking changes

1. **Create `roast_recipes` table** with all the fields defined above. Set up FKs to `experiments` and `green_beans`. Add nullable `parent_recipe_id` FK.

2. **Add `recipe_id` FK to `roasts`** (nullable initially).

3. **Add new fields to `experiments`**:
   - `updated_cup_prediction_a/b/c/d`
   - `taste_for_a/b/c/d`
   - `delta_from_roast_a/b/c/d`
   - `delta_from_cup_a/b/c/d`

4. **Backfill `roast_recipes` from existing `roasts`**: for each existing roast, create one `roast_recipes` row containing the as-designed fields (inlet_curve, fan_curve, end_condition_type, end_condition_target, etc., parsed from the existing roast's display strings). Set `roasts.recipe_id` FK to the newly-created recipe. One recipe per existing roast, no replication relationships expressed yet.

5. **Existing `expected_outcomes` and `observed_outcome_*` fields on `experiments` stay in place for backward compat.** Don't drop them. Existing experiment records keep their old prose. Going forward, the user is going to call out specifically that we should write to the new structured fields.

### Phase 2 — New workflow uses new structure

Going forward, when Claude is asked to design V_n for a lot:

1. Create the `experiments` row with frame fields.
2. Create the 3 (or N) `roast_recipes` rows. Populate design specs, predictions, drop rules, recipe lineage.
3. Push profiles to the Roest, store the returned `roest_profile_id` and `roest_share_url` on the recipes.

When Claude is asked to log roasts:

1. Pull the Roest log, create the `roasts` row with as-recorded facts.
2. Set `recipe_id` FK to the matching `roast_recipes` row (use `batch_slot` + `experiment_id` to disambiguate).
3. Populate `delta_from_roast_*` on the experiment row.
4. Populate `updated_cup_prediction_*` and `taste_for_*` on the experiment row.

When Claude is asked to log cuppings:

1. Create the `cuppings` row(s) linked to the roast.
2. After the user confirms cupping is complete (manual trigger via chat), populate `delta_from_cup_*` and the synthesis fields (winner, key_insight, etc.) on the experiment row.

When Claude is asked to resolve a lot:

1. Populate `roast_learnings` with the lot's lessons.
2. Mark the lot as resolved (likely a `status` field on green_beans, or a derived state).

### Phase 3 — Optional backfill

When the user feels like it, walk back through old experiments and:

- Populate `parent_recipe_id` on `roast_recipes` to express replication relationships ("v3a replicates v2b").
- Parse old `expected_outcomes` and `observed_outcome_*` prose into the new structured fields where it's worth doing.
- Optionally drop the old fields once everything is cleanly migrated.

This phase is value-additive but not blocking. The new pages will work fine with phase 1 + 2 alone.

### What NOT to migrate aggressively

Don't try to retroactively dedupe recipes by matching curve signatures. The brittle heuristic is more risky than the dupes are problematic. One recipe per existing roast is fine; the cleanliness benefits accrue going forward.

Don't drop the old `expected_outcomes` / `observed_outcome_*` fields on `experiments` until phase 3 backfill is done. Some old experiment rows have rich prose in those fields that doesn't have an obvious destination in the new schema.

---

## 8. Operational Notes for Claude as Sole Writer

A few specific things Claude Code should ensure when implementing the MCP write paths Claude (the conversational instance) will use:

### MCP tool surface

The existing tools (`push_experiment`, `push_roast`, `push_cupping`, `push_green_bean`, `propose_doc_changes`, etc.) need additions or updates:

- **Add `push_roast_recipe`** — create or update a recipe row. Should accept the full field set including curves and drop rules.
- **Update `push_experiment`** — accept the new fields (`updated_cup_prediction_*`, `taste_for_*`, `delta_from_*`).
- **Update `push_roast`** — accept the new `recipe_id` FK.
- **Existing `push_roast_profile`** — this pushes a profile to the Roest. Internally it should now create/update the corresponding `roast_recipes` row and store the returned Roest IDs back on the recipe.

Use `patch_*` variants for partial updates (the user might add a key insight in chat without touching anything else — Claude should be able to update one field cleanly without re-sending the whole row).

### Field name conventions

Match the existing schema conventions (snake_case, `_a/b/c/d` suffixes for per-batch arrays). Don't introduce new naming patterns.

### Synthesis trigger semantics

There is no "trigger synthesis" tool. Synthesis happens in chat: the user tells Claude "we're done cupping V3, run synthesis," Claude reads the cuppings + roasts + recipes + experiment frame, drafts the synthesis fields, asks the user to confirm or revise, then writes via `patch_experiment`.

This means the `experiments` row doesn't need a state field. The lifecycle state of a lot is derivable from the state of its records:

- Has green_bean but no experiments → in inventory
- Has experiments where the latest one has no roasts yet → waiting for next roast
- Has experiments where the latest one has roasts but no cuppings (or no synthesis) → waiting for next cupping
- Has roast_learnings → resolved

The index page query computes this state per-lot on read.

### Edit history

Not needed in the UI. If the user ever wants to know "what was the cup prediction before we updated it," that's a question for Claude in chat — Claude can answer from the `roast_recipes.predicted_cup` (original, frozen) vs. `experiments.updated_cup_prediction_*` (post-roast, current). Two fields, two moments, both queryable. No version history table needed.

### Recipe lineage

`parent_recipe_id` on `roast_recipes` is the primary way replication is expressed. When Claude designs a new experiment set, if v_n.a is "replicate v_(n-1).b's recipe," Claude should set `parent_recipe_id = v_(n-1).b's recipe_id` on the new row. This makes lineage queryable later ("show me every recipe descended from #139").

Don't try to enforce lineage in the schema (no NOT NULL constraint). Some recipes are genuinely novel; some are mild variations; some are pure replication. The field expresses intent, not a structural requirement.

### Recipe deduplication

Per the user's call, when v_n.a and v_n.c have identical inlet curves but different `end_condition_value`, those are two recipes. Don't dedupe by curve hash. Matches how the Roest tablet treats them, and preserves clean "replicate this recipe" semantics.

### Recipe drift from Roest

If Claude pushes a recipe to Roest and then the user edits it directly on the tablet before roasting, the `roast_recipes` row will represent the as-pushed design, not the as-edited. This is an accepted limitation. If important, the user can tell Claude what was edited and Claude can patch the recipe.

---

## 9. Outstanding Questions and Technical Considerations

A few things that didn't get fully resolved in the design conversation. Flag these to the user before implementing.

### Page route structure

The conversation didn't lock down URL paths. Suggested:

- `/green` — index page
- `/green/{lot_slug}` — lot detail page (renders one of three layouts based on lifecycle state)
- Probably no separate routes for "waiting for next roast" vs "waiting for next cupping" vs "resolved" — they're states of the same page, not separate pages.

### How does the index page know the state?

Either compute on read (a view, or per-row in the query) or denormalize a `lifecycle_state` field somewhere. Compute-on-read is cleaner but slower if the lot list grows. With current volume (~20 lots) compute-on-read is fine. Revisit later.

### Reference batch identification

`roast_learnings.best_batch_id` — is this the roast ID or the recipe ID? Probably roast ID (since the reference points at a specific execution, not just an intent). Confirm with the user during implementation.

### Multiple cuppings per roast

The data model allows it (multiple `cuppings` rows per `roast_id`). The pages don't yet account for it visually — the resolved view shows two cards (Cupping + Optimized Brew). If a roast accumulates 3+ cuppings, the resolved view's two-card layout breaks. Probably fine for now, but worth knowing.

### Cross-batch field for d-slot

The schema mentions `_a/b/c/d` suffixes. Most experiments are 3 batches (a/b/c) but the schema supports 4 (d). If experiments ever exceed 4 batches, the schema needs to be reconsidered. Probably stays at 4 indefinitely.

### Data migration order

Run phase 1 in this order to avoid FK violations:
1. Create `roast_recipes` table.
2. Add `recipe_id` column to `roasts` (nullable).
3. Add new fields to `experiments`.
4. Backfill `roast_recipes` from `roasts`.
5. Update `roasts.recipe_id` for backfilled rows.
6. (Eventually) make `roasts.recipe_id` NOT NULL after backfill is complete.

### Visual treatment for highlighted rows in roast log

The mockups call for highlighting rows in the roast log that belong to the current experiment set. The query needs to know which batch IDs belong to "the current experiment set" — pull from the latest `experiments` row's `batch_ids` field for that lot. If the lot is resolved, "the current experiment set" is the one containing `best_batch_id`.

### Tabler icons vs. emoji

Both mockups in the conversation used a small green seedling icon next to the lot name. The site uses Tabler outline icons elsewhere. Use `ti-leaf` or similar. No emoji.

### Performance

The lot detail page joins across green_beans → experiments → roasts → cuppings → roast_recipes. At current volumes this is fine. Don't pre-optimize.

---

## 10. Suggested Implementation Order

A pragmatic build order. Each step delivers a working, testable surface.

1. **Schema migration phase 1** — add `roast_recipes`, the new `experiments` fields, the `recipe_id` FK on `roasts`. Backfill recipes from existing roasts. Test by reading existing data back through the new structure.

2. **MCP tool updates** — `push_roast_recipe`, updated `push_experiment`, updated `push_roast`. Test by Claude (the conversational instance) running through a hypothetical V3 design end-to-end via chat.

3. **Index page** — three sections, lifecycle-state grouping. Computed state on read.

4. **In-process waiting-for-next-roast page** — transposed table, drop rules card, expected-total emphasis, current-experiment row highlighting in the roast log.

5. **In-process waiting-for-next-cupping page** — cupping hypothesis card, reference signals card, roast actuals card.

6. **Resolved view** — reference roast block, reference cup with two sub-cards, two roasting learnings cards, collapsed archives.

7. **Remove form/edit affordances** from existing roasting-side pages. Brewing pages keep their forms.

After each step, confirm the page renders cleanly with real data from an active lot before moving to the next.

---

## 11. Closing Notes

The design conversation involved a lot of pressure-testing the data model against actual workflows. The mockups in the conversation history (in-process roast, in-process cupping, resolved view, index) are the source of truth for visual structure. The schema described in section 4 is the source of truth for the data model. If anything in the implementation conflicts with either, flag to the user.

The user's preference throughout was **stripping toward essence over comprehensive completeness**. He repeatedly removed fields, sections, and visual chrome that I had over-engineered. Lean in that direction when in doubt: less is more, and the pages should serve glance-ability over completeness. Archive sections at the bottom of pages, collapsed by default, handle the completeness need without sacrificing the cleanliness of the foreground.

Brewing side stays untouched. This document is roasting-only.
