-- Sub Pages 6.1 — Roasting redesign schema (2026-05-13).
--
-- Phase 1 of the 3-phase migration plan in docs/roasting/redesign.md § 7.
-- Purely additive: no existing data is destroyed, no existing column is
-- renamed or dropped, no NOT NULL constraints added. Existing pages continue
-- rendering from the legacy columns through Sub Pages 6.5.
--
-- What this migration does:
--   1. CREATE TABLE roast_recipes — first-class entity for per-batch design
--      intent (curves, drop rules, design-time predictions). Mirrors how the
--      Roest tablet stores one profile per batch execution.
--   2. ALTER TABLE roasts ADD COLUMN recipe_id uuid FK — links each roast
--      execution to its design intent. Nullable through Phase 3.
--   3. ALTER TABLE experiments ADD 16 cross-batch fields — updated_cup_
--      prediction_a/b/c/d (written between roast and cupping), taste_for_a/
--      b/c/d (cupping-table questions), delta_from_roast_a/b/c/d (post-roast
--      reconciliation), delta_from_cup_a/b/c/d (post-cupping reconciliation).
--      Existing observed_outcome_a-d + expected_outcomes stay populated for
--      back-compat — semantic relabel happens in Phase 3.
--   4. ALTER TABLE roast_learnings ADD best_roast_id uuid FK — typed
--      reference to the winning execution. Existing text best_batch_id stays
--      for back-compat through Phase 3.
--   5. Backfill roast_recipes from existing roasts (one per roast, 129 rows).
--   6. Backfill roasts.recipe_id (one-to-one via copied created_at).
--   7. Backfill roast_learnings.best_roast_id (6 rows, all resolve via regex
--      strip + batch_id JOIN).
--   8. Drift fix: flip is_reference=true on the 2 closed lots where the
--      learnings.best_batch_id pointed at a roast but is_reference was false
--      (Mandela XO #139 + Surma #25 — Chris's Sub Pages 6 round-1 bundle
--      opt-in).
--
-- Source-of-truth for the schema decisions: docs/roasting/redesign.md §§ 4.3
-- (roast_recipes fields) + 4.2 (experiments new fields) + 4.4 (roasts FK) +
-- 4.6 (roast_learnings best_roast_id). Cross-sprint Q&A locked in CLAUDE.md
-- Sub Pages 6 thread (this thread): rationale field naming, best_roast_id
-- vs best_recipe_id, /add deprecation deferred to 6.6.

-- ---------------------------------------------------------------------------
-- 1. roast_recipes table
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS roast_recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  green_bean_id uuid NOT NULL REFERENCES green_beans(id) ON DELETE CASCADE,
  experiment_id uuid REFERENCES experiments(id) ON DELETE SET NULL,
  parent_recipe_id uuid REFERENCES roast_recipes(id) ON DELETE SET NULL,

  recipe_name text,
  batch_slot text,                  -- "v1a" / "v2b" / null for one-off
  rationale text,                   -- per-batch Hypothesis prose (mockup-row data)
  notes text,                       -- general catch-all

  -- Curve definition (mirror push_roast_profile bezier shapes)
  temperature_bezier jsonb,
  fan_bezier jsonb,
  rpm_bezier jsonb,
  power_bezier jsonb,
  end_condition_type text,          -- mirror roasts enum: bean_temp / dev_time / manual
  end_condition_target numeric,
  preheat_temperature_c numeric,

  -- Design specs
  charge_temp numeric,
  hopper_load_temp numeric,

  -- Design-time predictions
  predicted_fc_temp numeric,
  predicted_fc_time text,           -- mm:ss display preserved
  predicted_total_time text,        -- mm:ss
  predicted_maillard_pct numeric,
  predicted_agtron_wb numeric,
  predicted_cup text,               -- frozen design-time cup prediction

  -- Drop rules (mockup "Drop Rules" card)
  drop_rule_if_fast text,
  drop_rule_if_slow text,

  -- Roest linkage
  roest_profile_id integer,
  roest_share_url text,
  roest_profile_name text,

  -- Metadata
  pushed_to_roest_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE roast_recipes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users see only their recipes" ON roast_recipes;
CREATE POLICY "Users see only their recipes" ON roast_recipes
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_roast_recipes_user_bean
  ON roast_recipes (user_id, green_bean_id);
CREATE INDEX IF NOT EXISTS idx_roast_recipes_experiment
  ON roast_recipes (experiment_id) WHERE experiment_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_roast_recipes_parent
  ON roast_recipes (parent_recipe_id) WHERE parent_recipe_id IS NOT NULL;

-- ---------------------------------------------------------------------------
-- 2. roasts.recipe_id FK
-- ---------------------------------------------------------------------------

ALTER TABLE roasts
  ADD COLUMN IF NOT EXISTS recipe_id uuid REFERENCES roast_recipes(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_roasts_recipe ON roasts (recipe_id) WHERE recipe_id IS NOT NULL;

-- ---------------------------------------------------------------------------
-- 3. experiments — 16 new cross-batch fields
-- ---------------------------------------------------------------------------

ALTER TABLE experiments
  ADD COLUMN IF NOT EXISTS updated_cup_prediction_a text,
  ADD COLUMN IF NOT EXISTS updated_cup_prediction_b text,
  ADD COLUMN IF NOT EXISTS updated_cup_prediction_c text,
  ADD COLUMN IF NOT EXISTS updated_cup_prediction_d text,
  ADD COLUMN IF NOT EXISTS taste_for_a text,
  ADD COLUMN IF NOT EXISTS taste_for_b text,
  ADD COLUMN IF NOT EXISTS taste_for_c text,
  ADD COLUMN IF NOT EXISTS taste_for_d text,
  ADD COLUMN IF NOT EXISTS delta_from_roast_a text,
  ADD COLUMN IF NOT EXISTS delta_from_roast_b text,
  ADD COLUMN IF NOT EXISTS delta_from_roast_c text,
  ADD COLUMN IF NOT EXISTS delta_from_roast_d text,
  ADD COLUMN IF NOT EXISTS delta_from_cup_a text,
  ADD COLUMN IF NOT EXISTS delta_from_cup_b text,
  ADD COLUMN IF NOT EXISTS delta_from_cup_c text,
  ADD COLUMN IF NOT EXISTS delta_from_cup_d text;

-- ---------------------------------------------------------------------------
-- 4. roast_learnings.best_roast_id FK (best_batch_id text stays for back-compat)
-- ---------------------------------------------------------------------------

ALTER TABLE roast_learnings
  ADD COLUMN IF NOT EXISTS best_roast_id uuid REFERENCES roasts(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_roast_learnings_best_roast
  ON roast_learnings (best_roast_id) WHERE best_roast_id IS NOT NULL;

-- ---------------------------------------------------------------------------
-- 5. Backfill roast_recipes from existing roasts (one row per existing roast)
-- ---------------------------------------------------------------------------
--
-- Skip if already populated (idempotent — re-running this migration in a
-- branch DB shouldn't duplicate). Per docs/roasting/redesign.md § 7 the
-- backfill is "one recipe per existing roast, no replication relationships
-- expressed yet." Replication / parent_recipe_id lineage is Phase 3 manual
-- backfill.

INSERT INTO roast_recipes (
  user_id, green_bean_id, recipe_name,
  end_condition_type, end_condition_target,
  charge_temp, hopper_load_temp,
  roest_profile_id, notes,
  created_at, updated_at
)
SELECT
  r.user_id,
  r.green_bean_id,
  COALESCE(r.roast_profile_name, r.coffee_name, 'Batch ' || r.batch_id) AS recipe_name,
  r.end_condition_type,
  r.end_condition_target,
  r.charge_temp,
  r.hopper_load_temp,
  r.roest_log_id,
  r.roest_notes,
  r.created_at,
  now()
FROM roasts r
WHERE NOT EXISTS (
  -- Idempotency guard: skip if a recipe already exists with matching
  -- (user_id, green_bean_id, created_at) — backfill marker.
  SELECT 1 FROM roast_recipes rr
  WHERE rr.user_id = r.user_id
    AND rr.green_bean_id = r.green_bean_id
    AND rr.created_at = r.created_at
);

-- ---------------------------------------------------------------------------
-- 6. Link roasts.recipe_id to the backfilled recipes (1:1 via copied created_at)
-- ---------------------------------------------------------------------------

UPDATE roasts r
SET recipe_id = rr.id
FROM roast_recipes rr
WHERE rr.green_bean_id = r.green_bean_id
  AND rr.user_id = r.user_id
  AND rr.created_at = r.created_at
  AND r.recipe_id IS NULL;

-- ---------------------------------------------------------------------------
-- 7. Backfill roast_learnings.best_roast_id (6 rows, all resolve via regex strip)
-- ---------------------------------------------------------------------------
--
-- best_batch_id values today: "25", "94", "88", "52", "Batch 139", "133".
-- regexp_replace strips non-digits; the resulting numeric string matches the
-- corresponding roasts.batch_id. Verified by pre-flight query — all 6
-- resolve to unique rows.

UPDATE roast_learnings rl
SET best_roast_id = r.id
FROM roasts r
WHERE r.green_bean_id = rl.green_bean_id
  AND r.user_id = rl.user_id
  AND r.batch_id = regexp_replace(rl.best_batch_id, '[^0-9]', '', 'g')
  AND rl.best_roast_id IS NULL
  AND rl.best_batch_id IS NOT NULL;

-- ---------------------------------------------------------------------------
-- 8. Drift fix: is_reference=true on the 2 lots with best_batch_id set but
--    the resolved roast's is_reference was false (Mandela XO #139, Surma #25).
-- ---------------------------------------------------------------------------

UPDATE roasts SET is_reference = true
WHERE id IN (
  SELECT best_roast_id FROM roast_learnings WHERE best_roast_id IS NOT NULL
)
AND is_reference = false;

NOTIFY pgrst, 'reload schema';
