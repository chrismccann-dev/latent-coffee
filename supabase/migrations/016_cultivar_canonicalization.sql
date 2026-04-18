-- Migration 016 - Cultivar taxonomy canonicalization
--
-- Four logical operations in one transaction:
--
--   1. Gesha collapse: all 5 Gesha rows (bare Gesha, Panamanian, Colombian,
--      Brazilian, 1931) merge into one canonical row named 'Gesha'.
--      Survivor: Panamanian selection (9 brews, richest scalar coverage).
--      Field values merged via COALESCE priority: survivor -> Colombian
--      (most array content) -> 1931 (best altitude detail) -> Brazilian
--      -> bare. Brews from the 4 deleted rows are re-pointed to the
--      survivor id.
--
--   2. JARC blend rename: 'Sidama-type landrace populations (JARC
--      selections)' -> 'JARC blend lineage'. Mirrors the pure-selection
--      name and makes the blend-vs-pure distinction explicit (blends
--      do not transfer learnings to their component cultivars).
--
--   3. Garnica genetic correction: move from 'Timor-derived crosses'
--      (Typica x Bourbon Crosses) to 'Timor Hybrid-derived lineage'
--      (Modern Hybrids). Garnica is Catimor-derived; this puts it
--      alongside Catimor Group and Marsellesa where it belongs.
--      Drops 'Timor-derived crosses' as a lineage.
--
--   4. Pacamara suffix fix: 'Pacas × Maragogype' -> 'Pacas × Maragogype
--      lineage' to match registry naming. The × (multiplication sign)
--      is the established DB convention for genetic-cross lineages
--      (also used in Caturra × Timor Hybrid, Mundo Novo × Caturra, etc.)

BEGIN;

-- ==================================================================
-- Part 1: Gesha collapse
-- ==================================================================
-- Survivor (Panamanian selection, 9 brews):
--   cb1e1af2-49d4-4f6a-913d-7590bba5068d
-- To merge then delete:
--   7a8a173a-b81e-45d0-809c-de4c408ce61c  (bare 'Gesha', 1 brew)
--   9db53534-eab7-474a-b92f-74872f32c332  (Brazilian selection, 1 brew)
--   1926024c-9bc6-4cf7-bfb7-017fc955e799  (Colombian selection, 9 brews)
--   1934018e-81b6-4c95-8f84-ec181862bc58  (Gesha 1931, 2 brews)

-- Step 1a: Re-point all brews + green_beans from the 4 soon-to-be-deleted
-- rows to survivor. Both tables have FK constraints on cultivars.id.
UPDATE brews
SET cultivar_id = 'cb1e1af2-49d4-4f6a-913d-7590bba5068d'
WHERE cultivar_id IN (
  '7a8a173a-b81e-45d0-809c-de4c408ce61c',
  '9db53534-eab7-474a-b92f-74872f32c332',
  '1926024c-9bc6-4cf7-bfb7-017fc955e799',
  '1934018e-81b6-4c95-8f84-ec181862bc58'
);

UPDATE green_beans
SET cultivar_id = 'cb1e1af2-49d4-4f6a-913d-7590bba5068d'
WHERE cultivar_id IN (
  '7a8a173a-b81e-45d0-809c-de4c408ce61c',
  '9db53534-eab7-474a-b92f-74872f32c332',
  '1926024c-9bc6-4cf7-bfb7-017fc955e799',
  '1934018e-81b6-4c95-8f84-ec181862bc58'
);

-- Step 1b: Merge scalar fields into survivor where survivor is NULL.
-- Priority: survivor -> Colombian -> 1931 -> Brazilian -> bare.
-- Only fields where survivor is currently NULL need COALESCE; the
-- survivor already has genetic_background, acidity_style, body_style,
-- aromatics, extraction_sensitivity, roast_tolerance, brewing_tendencies,
-- roast_behavior, resting_behavior, market_context, cultivar_notes populated.
UPDATE cultivars
SET
  altitude_sensitivity = COALESCE(
    altitude_sensitivity,
    (SELECT altitude_sensitivity FROM cultivars WHERE id = '1934018e-81b6-4c95-8f84-ec181862bc58'),  -- 1931: most detailed
    (SELECT altitude_sensitivity FROM cultivars WHERE id = '1926024c-9bc6-4cf7-bfb7-017fc955e799'),  -- Colombian
    (SELECT altitude_sensitivity FROM cultivars WHERE id = '9db53534-eab7-474a-b92f-74872f32c332')   -- Brazilian (region-specific, last)
  ),
  terroir_transparency = COALESCE(
    terroir_transparency,
    (SELECT terroir_transparency FROM cultivars WHERE id = '1926024c-9bc6-4cf7-bfb7-017fc955e799'),  -- Colombian: "Extremely high"
    (SELECT terroir_transparency FROM cultivars WHERE id = '1934018e-81b6-4c95-8f84-ec181862bc58'),  -- 1931
    (SELECT terroir_transparency FROM cultivars WHERE id = '9db53534-eab7-474a-b92f-74872f32c332')   -- Brazilian
  ),
  typical_origins = COALESCE(
    typical_origins,
    (SELECT typical_origins FROM cultivars WHERE id = '1926024c-9bc6-4cf7-bfb7-017fc955e799')
  ),
  limiting_factors = COALESCE(
    limiting_factors,
    (SELECT limiting_factors FROM cultivars WHERE id = '1926024c-9bc6-4cf7-bfb7-017fc955e799')
  ),
  common_processing_methods = COALESCE(
    common_processing_methods,
    (SELECT common_processing_methods FROM cultivars WHERE id = '1926024c-9bc6-4cf7-bfb7-017fc955e799')
  ),
  typical_flavor_notes = COALESCE(
    typical_flavor_notes,
    (SELECT typical_flavor_notes FROM cultivars WHERE id = '1926024c-9bc6-4cf7-bfb7-017fc955e799')
  ),
  common_pitfalls = COALESCE(
    common_pitfalls,
    (SELECT common_pitfalls FROM cultivars WHERE id = '1926024c-9bc6-4cf7-bfb7-017fc955e799')
  )
WHERE id = 'cb1e1af2-49d4-4f6a-913d-7590bba5068d';

-- Step 1c: Delete the 4 merged-from rows.
DELETE FROM cultivars
WHERE id IN (
  '7a8a173a-b81e-45d0-809c-de4c408ce61c',
  '9db53534-eab7-474a-b92f-74872f32c332',
  '1926024c-9bc6-4cf7-bfb7-017fc955e799',
  '1934018e-81b6-4c95-8f84-ec181862bc58'
);

-- Step 1d: Rename survivor to canonical 'Gesha'.
UPDATE cultivars
SET
  cultivar_name = 'Gesha',
  cultivar_raw = NULL
WHERE id = 'cb1e1af2-49d4-4f6a-913d-7590bba5068d';

-- ==================================================================
-- Part 2: JARC blend lineage rename
-- ==================================================================
UPDATE cultivars
SET lineage = 'JARC blend lineage'
WHERE lineage = 'Sidama-type landrace populations (JARC selections)';

-- ==================================================================
-- Part 3: Garnica - move from Typica x Bourbon Crosses to Modern Hybrids
-- ==================================================================
UPDATE cultivars
SET
  genetic_family = 'Modern Hybrids',
  lineage = 'Timor Hybrid-derived lineage'
WHERE lineage = 'Timor-derived crosses';

-- ==================================================================
-- Part 4: Pacamara lineage suffix fix
-- ==================================================================
UPDATE cultivars
SET lineage = 'Pacas × Maragogype lineage'
WHERE lineage = 'Pacas × Maragogype';

COMMIT;
