-- Sprint 1k rework — strip annotation suffixes from brews.grind_setting and
-- resolve one ambiguous range value to a single canonical setting.
--
-- Sprint 1k V1 left annotation suffixes intact on grind_setting (e.g.
-- "6.6 (~1130 µm reference slightly finer than Orea version)") because the
-- setting axis was free-text. Chris's authored Taxonomy Reference CSV pivots
-- the axis to enumerated strict — the per-setting research that justified
-- the annotations now lives in the registry's GrinderSettingEntry content
-- (D50 / zone / extraction_behavior / use_case), so the brew rows can clean
-- to the bare canonical setting.
--
-- 6 rows touched. brews.grind is also recomposed via composeGrind on subsequent
-- saves; this migration leaves brews.grind alone — the next /edit save will
-- recompose it from the cleaned grind_setting.

BEGIN;

UPDATE brews SET grind_setting = '6.4'
  WHERE grind_setting = '6.4 (D50 ~1130 µm baseline slightly finer)';

UPDATE brews SET grind_setting = '6.5'
  WHERE grind_setting = '6.5 (~1130 µm D50)';

UPDATE brews SET grind_setting = '6.6'
  WHERE grind_setting = '6.6 (~1130 µm reference slightly finer than Orea version)';

UPDATE brews SET grind_setting = '6.6'
  WHERE grind_setting = '6.6 (coarser than baseline)';

UPDATE brews SET grind_setting = '6.6'
  WHERE grind_setting = '6.6 (D50 reference approximately 1130 µm at 6.5, slightly coarser here)';

-- 6.7-6.8 ambiguous case (El Diamante / Carlos Morera / Moonwake / Caturra
-- Anaerobic Washed). Chris confirmed 6.8 was the actual dial position.
UPDATE brews SET grind_setting = '6.8'
  WHERE grind_setting = '6.7-6.8 (slightly coarser than light-roast settings)';

-- Recompose denormalized brews.grind to match cleaned grind_setting.
UPDATE brews SET grind = grinder || ' ' || grind_setting
  WHERE grinder IS NOT NULL AND grind_setting IS NOT NULL;

COMMIT;
