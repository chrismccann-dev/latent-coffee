-- Migration 015 - Reclassify 2 misclassified Guatemala terroirs
--
-- Problem: Both Guatemala terroir rows were placed under foreign-country
-- macros during the early terroir backfill (migrations 005-006):
--   - Huehuetenango was labeled 'Chiapas Highlands' (Mexican macro)
--   - Chimaltenango/Acatenango was labeled 'Costa Rican Central Volcanic
--     Highlands' (Costa Rican macro)
-- Both rows also had NULL why_it_stands_out as a symptom.
--
-- Fix: create two new Guatemalan macros - Huehuetenango Highlands and
-- Acatenango Volcanic Highlands - and fill why_it_stands_out with the
-- structural-difference content the reference doc asks for.
--
-- These become the 22nd and 23rd canonical macros in the registry.

BEGIN;

-- ------------------------------------------------------------------
-- Huehuetenango Highlands (Huehuetenango, Guatemala)
-- ------------------------------------------------------------------
UPDATE terroirs
SET
  macro_terroir = 'Huehuetenango Highlands',
  why_it_stands_out = 'Limestone-based non-volcanic range on the Mexican border. High diurnal swing slows maturation relative to the Central American volcanic arc, and the limestone substrate produces a cleaner, more linear acidity than the mineral-heavy volcanic soils of Antigua or Acatenango. Drier rainfall regime than the Atlantic-facing Guatemalan highlands, which pushes a tighter, more crystalline structure rather than the rounded body typical of ash-based volcanic macros.'
WHERE id = '4c529fd8-f4f4-4f15-bcb6-d61503b2806f';

-- ------------------------------------------------------------------
-- Acatenango Volcanic Highlands (Chimaltenango, Guatemala)
-- ------------------------------------------------------------------
UPDATE terroirs
SET
  macro_terroir = 'Acatenango Volcanic Highlands',
  why_it_stands_out = 'Active-volcano macro on the Pacific slopes of the Central American volcanic arc, receiving regular ash deposition from Volcán de Fuego. Volcanic loam soils retain moisture and fertility, producing denser body and rounder sweetness than the limestone-driven Huehuetenango Highlands to the north. Mid-elevation (1500-1900m) with a warmer temperate regime and heavier rainfall than Huehuetenango, which shortens maturation and pushes the cup toward fruit-forward expression rather than the crystalline clarity of limestone terroirs.'
WHERE id = 'f052b58f-fa57-4b7b-904f-6493eefada08';

COMMIT;
