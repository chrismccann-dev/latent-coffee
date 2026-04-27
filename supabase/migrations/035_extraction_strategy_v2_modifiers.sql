-- Sprint Extraction Strategy v2: 5 strategies + 3 modifiers (jsonb array)
--
-- Axis 1 (Extraction Strategy) extends 3 -> 5:
--   Suppression (NEW)
--   Clarity-First
--   Balanced Intensity
--   Full Expression
--   Extraction Push (NEW)  -- "Extraction Push for Clarity"; canonical short form
--
-- Axis 2 (Modifiers) is a new jsonb array column; default empty.
-- Modifier shape: { type: 'output_selection' | 'inverted_temperature_staging' | 'aroma_capture', ...subfields }
--   output_selection sub-fields:        form ('early_cut' | 'late_cut' | 'both'), brew_weight (number), cup_yield (number), notes (string)
--   inverted_temperature_staging:       phases (string)
--   aroma_capture:                      application (string)
--
-- No CHECK constraints on extraction_strategy currently; canonical enforcement is code-side.
-- Code-side reclassification: Inmaculada moves from Balanced Intensity -> Suppression.
-- Basha Bekele Kokose (also named in the prior Claude thread) is not yet in the DB —
-- per upload-on-resolution rule it lands when the bean uploads.

ALTER TABLE brews
  ADD COLUMN IF NOT EXISTS modifiers jsonb NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN brews.modifiers IS
  'Axis 2 (Sprint Extraction Strategy v2). Array of {type, ...subfields}. Optional, stackable. See lib/extraction-modifiers.ts for canonical shape.';

UPDATE brews
SET extraction_strategy = 'Suppression'
WHERE id = 'e7a82e0a-7c9c-41cd-b5da-9d5b9589361e'
  AND extraction_strategy = 'Balanced Intensity';

-- Clear the verbatim echo on Inmaculada's extraction_confirmed. Pre-migration the
-- field stored "Balanced Intensity" as a confirmation echo (the field's observed
-- semantic — see audit findings in memory/project_extraction_strategy_v2.md).
-- After the strategy flip to Suppression, leaving the echo would falsely render
-- as "planned Suppression, tasted Balanced Intensity" (a phantom divergence that
-- never happened).
UPDATE brews
SET extraction_confirmed = NULL
WHERE id = 'e7a82e0a-7c9c-41cd-b5da-9d5b9589361e'
  AND extraction_confirmed = 'Balanced Intensity';
