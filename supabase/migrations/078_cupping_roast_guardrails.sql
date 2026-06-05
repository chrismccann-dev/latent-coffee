-- Cluster 2 — Cupping / Roast schema guardrails (feedback-pipeline, 2026-06-04)
--
-- Three small, additive guardrails surfaced by recurring roasting-workflow
-- feedback (backlog items #27 / #31 / #26). All independent of the bigger
-- lifecycle-state rework (deliberately out of scope — that belongs to the Lot
-- Coordinator + V-Set Assistant sprint).
--
--   1. cuppings.cooling_arc_pattern  — canonical 4-value enum (degrade / hold /
--      improve / flat) for the cooling-arc shape, independent of the
--      temperature_behavior prose. Differentiating on a 2nd lot now, so
--      cross-lot "which lots cooling-arc degrade vs hold" stops being
--      regex-on-prose. (master log #27, med)
--
--   2. The cupping_date >= roast_date + 1 + rest_days-consistency guard is
--      enforced in the MCP write path (lib/mcp/cupping-date-bounds.ts), NOT at
--      the DB layer — it needs the joined roasts.roast_date and produces a
--      readable per-field error, matching the end-condition-bounds pattern. No
--      schema change for #31; documented here for the audit trail. (master log #31, med)
--
--   3. roast_recipe_divergence VIEW — the derived execution_diverged_from_recipe
--      boolean. A roast whose recipe planned a machine end-condition target
--      (recipe.end_condition_target IS NOT NULL) but was executed manually
--      (roast.end_condition_type = 'manual') is an intentional, lore-dependent
--      divergence. The boolean lets analytics read it without knowing the lore.
--      Cross-table (roasts JOIN roast_recipes), so it can NOT be a STORED
--      generated column — a view is the correct derived surface. (master log #26, low)
--
-- Idempotent: re-applying is safe (ADD COLUMN IF NOT EXISTS / DROP CONSTRAINT
-- IF EXISTS / CREATE OR REPLACE VIEW). No backfill — historical cuppings stay
-- NULL on cooling_arc_pattern (operator patches via patch_cupping when re-reviewed).

-- ---------------------------------------------------------------------------
-- 1. cuppings.cooling_arc_pattern (#27)
-- ---------------------------------------------------------------------------

ALTER TABLE public.cuppings ADD COLUMN IF NOT EXISTS cooling_arc_pattern text;

ALTER TABLE public.cuppings DROP CONSTRAINT IF EXISTS cuppings_cooling_arc_pattern_check;

ALTER TABLE public.cuppings ADD CONSTRAINT cuppings_cooling_arc_pattern_check
  CHECK (cooling_arc_pattern IS NULL OR cooling_arc_pattern IN ('degrade', 'hold', 'improve', 'flat'));

COMMENT ON COLUMN public.cuppings.cooling_arc_pattern IS
  'Canonical 4-value enum for the cooling-arc shape of THIS cup (migration 078). degrade: the cup gets worse as it cools (loses balance / turns bitter / flattens out). hold: stable across the cooling arc, no meaningful change. improve: opens up / gains sweetness / integrates better as it cools. flat: little aromatic or structural movement either way (distinct from hold — flat = low-amplitude / muted, hold = good-and-steady). Independent of the temperature_behavior prose (which says direction + when + what changes); this enum exists so cross-lot "which lots cooling-arc degrade vs hold" is canonical-queryable instead of regex-on-prose. Historical cuppings left NULL — operator patches via patch_cupping when re-reviewed.';

-- ---------------------------------------------------------------------------
-- 3. roast_recipe_divergence view (#26)
-- ---------------------------------------------------------------------------

-- security_invoker so the view respects the querying role's RLS on the
-- underlying roasts / roast_recipes tables (the app reads as the authenticated
-- user; the MCP server reads as service-role and bypasses RLS as it does today).
CREATE OR REPLACE VIEW public.roast_recipe_divergence
  WITH (security_invoker = true) AS
SELECT
  r.id                       AS roast_id,
  r.user_id                  AS user_id,
  r.recipe_id                AS recipe_id,
  r.end_condition_type       AS roast_end_condition_type,
  rec.end_condition_type     AS recipe_end_condition_type,
  rec.end_condition_target   AS recipe_end_condition_target,
  -- The intentional divergence: recipe planned a machine target, roast was
  -- dropped manually (operator feel, no machine target).
  (rec.end_condition_target IS NOT NULL AND r.end_condition_type = 'manual')
                             AS execution_diverged_from_recipe
FROM public.roasts r
LEFT JOIN public.roast_recipes rec ON rec.id = r.recipe_id;

COMMENT ON VIEW public.roast_recipe_divergence IS
  'Derived per-roast view (migration 078) exposing execution_diverged_from_recipe: TRUE when the linked recipe planned a machine end-condition target (recipe.end_condition_target IS NOT NULL) but the roast was executed manually (roast.end_condition_type = ''manual''). An intentional, lore-dependent divergence — the boolean lets analytics read it without knowing the lore. Roasts with no recipe_id (LEFT JOIN -> recipe fields NULL) read FALSE. Cross-table derivation, so it is a view rather than a generated column.';

-- ---------------------------------------------------------------------------
-- Self-register (the >= 076 convention).
-- ---------------------------------------------------------------------------
INSERT INTO public.applied_migrations (filename) VALUES ('078_cupping_roast_guardrails.sql')
ON CONFLICT (filename) DO NOTHING;
