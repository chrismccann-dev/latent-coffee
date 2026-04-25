-- Sprint 1m: canonicalize brews.roast_level to the 8-bucket canonical registry
-- (see lib/roast-level-registry.ts). Post-sprint, code enforces strict canonical
-- on /add + /edit + PATCH routes; this migration backfills existing drift.
--
-- Audit at sprint time (2026-04-24) returned 7 distinct values across 57 brews:
--   Light               40  -- already canonical, no-op
--   Light roast          6  -- alias → Light
--   (null)               4  -- no-op
--   Medium               2  -- already canonical, no-op
--   Balanced Intensity   1  -- parser-misroute bug on Finca La Reserva Gesha
--                              (Colibri Coffee); → Light per Colibri's light-roast
--                              house style. Confirm / override via /edit if wrong.
--   light to medium      1  -- alias → Medium Light
--   Light-medium         1  -- alias → Medium Light

BEGIN;

UPDATE brews SET roast_level = 'Light'        WHERE roast_level = 'Light roast';
UPDATE brews SET roast_level = 'Medium Light' WHERE roast_level = 'light to medium';
UPDATE brews SET roast_level = 'Medium Light' WHERE roast_level = 'Light-medium';
UPDATE brews SET roast_level = 'Light'        WHERE roast_level = 'Balanced Intensity';

-- Post-check — expect zero rows. Any non-canonical value indicates new drift
-- landed between audit and migration run; resolve manually before proceeding.
DO $$
DECLARE
  drift_count integer;
BEGIN
  SELECT COUNT(*) INTO drift_count
  FROM brews
  WHERE roast_level IS NOT NULL
    AND roast_level NOT IN (
      'Extremely Light','Very Light','Light','Medium Light',
      'Medium','Moderately Dark','Dark','Very Dark'
    );
  IF drift_count > 0 THEN
    RAISE EXCEPTION 'roast_level drift remains after migration: % row(s)', drift_count;
  END IF;
END $$;

COMMIT;
