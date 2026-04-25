-- Sprint 1k — Grinder + grind size taxonomy adoption.
-- Splits the free-text `brews.grind` column into structured `grinder` (canonical
-- registry) + `grind_setting` (free-text per-grinder scale). Legacy `brews.grind`
-- retained as denormalized display through the next sprint, mirror of the
-- Process 1e.2 -> 1e.4 cadence.
--
-- Pre-sprint audit (sprint 1k): 33 distinct values across 55 brews, all EG-1.
-- Setting range observed: 6.0-6.8. Zero null grind values (every brew Chris has
-- logged carries a grind annotation).
--
-- `grinder` is left nullable in this migration — future inserts may legitimately
-- omit it (e.g. an in-progress brew), and adding NOT NULL with no DEFAULT would
-- 500 on every existing insert path. Mirror of the "1e.2 NOT NULL bomb" lesson
-- from the Process 1e.3 retro.

BEGIN;

ALTER TABLE brews ADD COLUMN grinder       text;
ALTER TABLE brews ADD COLUMN grind_setting text;

-- Decomposition of all 33 distinct legacy strings. Every entry maps to
-- grinder='EG-1'; grind_setting preserves the numeric setting plus any
-- annotation suffix Chris recorded (e.g. "(~1130 µm reference)").

UPDATE brews SET grinder='EG-1', grind_setting='6.4' WHERE grind = 'EG-1 6.4';
UPDATE brews SET grinder='EG-1', grind_setting='6.3' WHERE grind = 'EG-1 6.3';
UPDATE brews SET grinder='EG-1', grind_setting='6.5' WHERE grind = '6.5 (Weber EG-1)';
UPDATE brews SET grinder='EG-1', grind_setting='6.5' WHERE grind = 'EG-1 6.5';
UPDATE brews SET grinder='EG-1', grind_setting='6.6' WHERE grind = 'EG-1 6.6';
UPDATE brews SET grinder='EG-1', grind_setting='6.7' WHERE grind = 'EG-1 6.7';
UPDATE brews SET grinder='EG-1', grind_setting='6.0' WHERE grind = 'EG-1 6.0';
UPDATE brews SET grinder='EG-1', grind_setting='6.5' WHERE grind = 'EG-1 at 6.5';
UPDATE brews SET grinder='EG-1', grind_setting='6.5' WHERE grind = 'Weber EG-1: 6.5';
UPDATE brews SET grinder='EG-1', grind_setting='6.5' WHERE grind = 'Weber Workshop EG-1 at 6.5';
UPDATE brews SET grinder='EG-1', grind_setting='6.4' WHERE grind = '6.4 (EG-1)';
UPDATE brews SET grinder='EG-1', grind_setting='6.6 (coarser than baseline)' WHERE grind = '6.6 (Weber EG-1, coarser than baseline)';
UPDATE brews SET grinder='EG-1', grind_setting='6.4' WHERE grind = 'EG-1 - 6.4';
UPDATE brews SET grinder='EG-1', grind_setting='6.7' WHERE grind = 'EG-1 - 6.7';
UPDATE brews SET grinder='EG-1', grind_setting='6.7' WHERE grind = 'EG-1 @ 6.7';
UPDATE brews SET grinder='EG-1', grind_setting='6.6 (~1130 µm reference slightly finer than Orea version)'
  WHERE grind = 'EG-1 6.6 (~1130 µm reference slightly finer than Orea version)';
UPDATE brews SET grinder='EG-1', grind_setting='6.8' WHERE grind = 'EG-1 6.8';
UPDATE brews SET grinder='EG-1', grind_setting='6.4' WHERE grind = 'EG-1 at 6.4';
UPDATE brews SET grinder='EG-1', grind_setting='6.7' WHERE grind = 'EG-1 at 6.7';
UPDATE brews SET grinder='EG-1', grind_setting='6.5' WHERE grind = 'EG-1: 6.5';
UPDATE brews SET grinder='EG-1', grind_setting='6.5' WHERE grind = 'Grind: EG-1 6.5';
UPDATE brews SET grinder='EG-1', grind_setting='6.4' WHERE grind = 'Weber EG-1 - 6.4';
UPDATE brews SET grinder='EG-1', grind_setting='6.5' WHERE grind = 'Weber EG-1 - 6.5';
UPDATE brews SET grinder='EG-1', grind_setting='6.6' WHERE grind = 'Weber EG-1 - 6.6';
UPDATE brews SET grinder='EG-1', grind_setting='6.6 (D50 reference approximately 1130 µm at 6.5, slightly coarser here)'
  WHERE grind = 'Weber EG-1 - 6.6 D50 reference approximately 1130 µm at 6.5, slightly coarser here';
UPDATE brews SET grinder='EG-1', grind_setting='6.7' WHERE grind = 'Weber EG-1 - 6.7';
UPDATE brews SET grinder='EG-1', grind_setting='6.7-6.8 (slightly coarser than light-roast settings)'
  WHERE grind = 'Weber EG-1 - 6.7-6.8 (slightly coarser than light-roast settings)';
UPDATE brews SET grinder='EG-1', grind_setting='6.5' WHERE grind = 'Weber EG-1 @ 6.5';
UPDATE brews SET grinder='EG-1', grind_setting='6.6' WHERE grind = 'Weber EG-1 @ 6.6';
UPDATE brews SET grinder='EG-1', grind_setting='6.4' WHERE grind = 'Weber EG-1 6.4';
UPDATE brews SET grinder='EG-1', grind_setting='6.4 (D50 ~1130 µm baseline slightly finer)'
  WHERE grind = 'Weber EG-1 6.4 (D50 ~1130 µm baseline slightly finer)';
UPDATE brews SET grinder='EG-1', grind_setting='6.5 (~1130 µm D50)' WHERE grind = 'Weber EG-1 6.5 ~1130 µm D50';
UPDATE brews SET grinder='EG-1', grind_setting='6.3' WHERE grind = 'Weber EG-1 at 6.3';

-- Index for /brews filter queries on grinder (sprint 1f follow-up may surface).
CREATE INDEX brews_grinder_idx ON brews(grinder);

COMMIT;
