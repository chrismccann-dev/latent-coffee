-- Migration 041: cuppings.recipe_variant
--
-- Surfaces from MCP feedback batch 8 (2026-05-02, Higuito Costa Rica
-- in-process dog-food). The current unique constraint
-- cuppings_user_roast_date_method_unique forces consolidation when there
-- are TWO conceptually different evaluations on the same day with the same
-- eval_method (e.g. xbloom-gate Pourover + Balanced-Intensity Pourover for
-- the same roast). Information loss: the "false-positive underdevelopment"
-- diagnostic literally requires comparing both rows.
--
-- Fix: add nullable recipe_variant text column + extend the unique
-- constraint to include it (PG 17 NULLS NOT DISTINCT keeps the existing
-- single-cupping idempotency case working).
--
-- Semantics:
--   - Existing rows: recipe_variant = NULL (the "single cupping per day per
--     method" case stays as-is; back-compat preserved).
--   - New rows without recipe_variant: also NULL. Two such rows on the same
--     (roast_id, date, method) are blocked by NULLS NOT DISTINCT (correct;
--     idempotent re-syncs still work).
--   - New rows with explicit different variants ("xbloom_gate",
--     "balanced_intensity_pourover", etc.): both insert. Composite uniqueness
--     enforced per-variant.
--
-- The recipe_variant field is free-text by design — labels evolve as Chris's
-- workflow expands. If patterns stabilize, can canonicalize later.

ALTER TABLE cuppings ADD COLUMN recipe_variant text;

ALTER TABLE cuppings DROP CONSTRAINT cuppings_user_roast_date_method_unique;

ALTER TABLE cuppings
  ADD CONSTRAINT cuppings_user_roast_date_method_variant_unique
  UNIQUE NULLS NOT DISTINCT (user_id, roast_id, cupping_date, eval_method, recipe_variant);
