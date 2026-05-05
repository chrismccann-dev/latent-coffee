-- Phase 2 — push_roast schema additions surfaced by Batch 18 dog-food.
--
-- Six column additions on `roasts` plus a worth_repeating type promotion
-- (boolean → tristate text), all driven by friction the model surfaced
-- when push_roast couldn't capture what the Roest UI was already showing
-- (Batches 14-18 in feedback_v2_mcp_feedback_log.md):
--
--   #R57 — roest_notes pass-through. pull_roest_log pulls the Roest
--     comment ("very light color - whole bean") but push_roast had nowhere
--     to put it. Round-trip dropped the prose silently.
--   #R58 — end_condition_type + end_condition_target. Roest UI lets the
--     operator set "End condition: Bean temp / Dev time / Manual" with a
--     numeric target, distinct from where the machine actually dropped.
--     Bean 2's V4A had the trigger set wrong with no structured way to
--     record the divergence.
--   #R61 — fc_total_cracks. Roest UI surfaces "Total cracks (7) / (3) /
--     (0)"; strong audibility / silent-FC signal previously stranded in
--     prose only.
--   #R62 — worth_repeating: boolean → text(yes|no|pending). Bean 6's V1B
--     was "yes pending Day 7 confirmation," which boolean can't represent.
--     Coerce existing rows: true → 'yes', false → 'no', NULL stays NULL.
--
-- Path (b) on #R66 (orphan reconciliation) is implementation-level in
-- push_roast — no schema change needed, just a warning when the green_bean's
-- roest_inventory_id is NULL while the new roast's roest_log_id is set.

ALTER TABLE roasts
  ADD COLUMN roest_notes text,
  ADD COLUMN end_condition_type text,
  ADD COLUMN end_condition_target numeric,
  ADD COLUMN fc_total_cracks integer;

COMMENT ON COLUMN roasts.roest_notes IS
  'Pass-through of Roest UI comment / first_comment.comment. Preserves the operator''s narrative as-is — distinct from what_worked / what_didnt / what_to_change which are Chris''s analytical prose. Phase 2 (#R57).';
COMMENT ON COLUMN roasts.end_condition_type IS
  'Drop trigger as set on the Roest profile: bean_temp | dev_time | manual. Distinct from drop_temp (where the machine actually dropped). Phase 2 (#R58).';
COMMENT ON COLUMN roasts.end_condition_target IS
  'Numeric target for the end condition (°C if bean_temp, seconds if dev_time, NULL if manual). Phase 2 (#R58).';
COMMENT ON COLUMN roasts.fc_total_cracks IS
  'Total audible cracks counted from the FC event through drop. 0 on silent-FC coffees. Phase 2 (#R61).';

ALTER TABLE roasts
  ADD CONSTRAINT roasts_end_condition_type_check
    CHECK (end_condition_type IS NULL OR end_condition_type IN ('bean_temp', 'dev_time', 'manual'));

-- worth_repeating: boolean → text tristate.
--
-- Add the new column, copy boolean values into it, drop the old boolean.
-- text + check constraint is the simpler representation than enum (avoids
-- pg_enum migration headaches if the value set evolves).
ALTER TABLE roasts ADD COLUMN worth_repeating_new text;
UPDATE roasts SET worth_repeating_new = CASE
  WHEN worth_repeating = true THEN 'yes'
  WHEN worth_repeating = false THEN 'no'
  ELSE NULL
END;
ALTER TABLE roasts DROP COLUMN worth_repeating;
ALTER TABLE roasts RENAME COLUMN worth_repeating_new TO worth_repeating;
ALTER TABLE roasts
  ADD CONSTRAINT roasts_worth_repeating_check
    CHECK (worth_repeating IS NULL OR worth_repeating IN ('yes', 'no', 'pending'));

COMMENT ON COLUMN roasts.worth_repeating IS
  'Tristate: yes | no | pending. ''pending'' covers cases like "yes at the structural-roast level but waiting on Day 7 cupping confirmation" where boolean true/false can''t represent the conditional. Phase 2 (#R62, was boolean pre-migration 044).';
