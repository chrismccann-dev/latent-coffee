-- 071_brew_water_recipe.sql
-- Sub-sprint 4c (Brews polish) Bundle A, 2026-05-28.
--
-- Adds a free-text `water_recipe` column to brews. Chris already records water
-- formula in recipe prose today ("Third Wave Water Light Roast ~1:3
-- concentrate:distilled", "Palo Alto office tap") with no structured home; a
-- near-future research project is explicit water-formula testing. Free-text by
-- design — own-mixtures + third-party formulas would explode any enum; promote
-- to a canonical registry later if water becomes a true research axis (same
-- lazy-promotion pattern as every other axis), with zero structured commitment
-- to undo.
--
-- Net-new forward; existing rows stay NULL. Written via push_brew / patch_brew;
-- rendered as a labeled line under the 6-var RecipeTable on /brews/[id].

ALTER TABLE brews ADD COLUMN IF NOT EXISTS water_recipe text;

COMMENT ON COLUMN brews.water_recipe IS
  'Free-text water formula / source for the brew (e.g. "Third Wave Water Light Roast ~1:3 concentrate:distilled", "Palo Alto office tap"). Sub-sprint 4c Bundle A. No canonical registry today.';
