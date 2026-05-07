-- v8.4 (2026-05-06): Hybrid promoted to 6th extraction_strategy + Cooling-Curve Design.
--
-- Schema changes (additive):
--   - hybrid_subform        text, conditional sub-form when extraction_strategy='Hybrid'
--                           Canonical: sequential | phase_mapped | selective_bloom |
--                           intensity_clarity_split | temperature_staged. NULL otherwise.
--                           Code-side enforcement (no CHECK constraint, mirrors existing
--                           extraction_strategy code-side canonical pattern).
--   - cooling_curve_target  text, free-text Step-1d named consideration.
--                           Default NULL (normal cooling progression). Populated when
--                           peak evaluation window IS the strategy (e.g. "40-45°C peak",
--                           "evaluate below 50°C"). Surfaces a previously-implicit
--                           decision at brief time.
--
-- Code-side changes:
--   - lib/brew-import.ts EXTRACTION_STRATEGIES extends 5 -> 6 with 'Hybrid'.
--   - lib/extraction-modifiers.ts MODIFIER_TYPES drops 'immersion' (4 -> 3); the
--     ImmersionModifier shape moves into Hybrid via hybrid_subform.
--   - New lib/hybrid-subform.ts canonical sub-form registry.
--
-- Per-row reclassification of the 4 brews currently using the immersion modifier:
--   1. Picolot "Emerald" PL#015 (ffc37dab) - STAYS Full Expression.
--      Drops the immersion modifier. The valve-modulated bloom-immersion is now
--      framed as recipe detail (already documented in pour_structure / what_i_learned),
--      not a separate axis. Per Chris's decision: BREWING.md archive entry remains
--      "Confirmed Full Expression on Picolot roast" - reclassifying to Hybrid would
--      contradict the established reference recipe.
--   2. Janson Green-Tip Gesha 1010 (766d839e)         -> Hybrid (sequential)
--   3. Sebastian Ramirez White Honey Gesha (2fdfbb95) -> Hybrid (sequential)
--   4. Finca La Reserva Gesha (0b708859)              -> Hybrid (sequential)
--      All three are SWORKS slow/slow/open recipes (Dial 0 closed bloom + restricted
--      main pours + Dial 7 open finish "to rinse rather than steep") - canonical
--      Sequential Hybrid: immersion-like phase then percolation phase, each doing
--      one job.
--
-- All 4 brews clear their `modifiers` array. The immersion modifier type is dropped
-- from MODIFIER_TYPES at the same deploy.
--
-- Rollback (if needed):
--   ALTER TABLE brews DROP COLUMN hybrid_subform;
--   ALTER TABLE brews DROP COLUMN cooling_curve_target;
--   UPDATE brews SET extraction_strategy='Balanced Intensity', hybrid_subform=NULL,
--     modifiers='[{"type":"immersion","application":"SWORKS valve-modulated immersion staging — restricted main pours, opened late to drain"}]'::jsonb
--     WHERE id IN ('766d839e-dbe0-4960-8977-a6cbfdd07235','2fdfbb95-3582-46e8-8262-9c2422809bb3','0b708859-a9af-4b57-a13a-5ea6c3afabf4');
--   UPDATE brews SET modifiers='[{"type":"immersion","application":"Bloom held closed (Dial 0, 0:00–0:40), pours 1-2 open (Dial 7), pour 3 restricted (Dial 5) to slow extraction at the tail. SWORKS valve-modulated immersion staging."}]'::jsonb
--     WHERE id='ffc37dab-dce5-4246-bd82-d8d517a1f31a';

ALTER TABLE brews ADD COLUMN hybrid_subform text;
ALTER TABLE brews ADD COLUMN cooling_curve_target text;

COMMENT ON COLUMN brews.hybrid_subform IS
  'Conditional sub-form, required when extraction_strategy = ''Hybrid''. Canonical: sequential | phase_mapped | selective_bloom | intensity_clarity_split | temperature_staged. NULL otherwise. Code-side enforcement.';
COMMENT ON COLUMN brews.cooling_curve_target IS
  'Free-text Step-1d named consideration (v8.4). Default NULL = normal cooling progression. Populated when peak evaluation window IS the strategy (e.g. "40-45°C peak", "evaluate below 50°C"). Surfaces a previously-implicit decision at brief time.';

-- Reclassify the 3 BI immersion brews to Hybrid (sequential); clear modifiers.
UPDATE brews
SET extraction_strategy = 'Hybrid',
    hybrid_subform = 'sequential',
    modifiers = '[]'::jsonb
WHERE id IN (
  '766d839e-dbe0-4960-8977-a6cbfdd07235',  -- Janson Green-Tip Gesha 1010
  '2fdfbb95-3582-46e8-8262-9c2422809bb3',  -- Sebastian Ramirez White Honey Gesha
  '0b708859-a9af-4b57-a13a-5ea6c3afabf4'   -- Finca La Reserva Gesha
);

-- Picolot Emerald keeps Full Expression; just drop the immersion modifier.
UPDATE brews
SET modifiers = '[]'::jsonb
WHERE id = 'ffc37dab-dce5-4246-bd82-d8d517a1f31a';
