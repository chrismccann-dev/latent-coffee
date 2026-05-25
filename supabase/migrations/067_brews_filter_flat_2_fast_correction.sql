-- Migration 067 — brews.filter FLAT FAST → FLAT 2 FAST correction
--
-- Context: Research Project #2 (flat-bottom-filter-drawdown, closed 2026-05-24
-- in PR #238) surfaced that the FLAT 2 alias-map collapse in lib/filter-registry.ts
-- (since fixed in PR #238) had silently canonicalized any historical brews.filter
-- value typed as a FLAT 2 variant to "FLAT FAST". This migration corrects the
-- historical brews.filter values.
--
-- Chris-confirmed at Project #3 prep session (2026-05-24): every historical
-- use of "FLAT FAST" in his brewing was functionally FLAT 2 FAST. He never
-- hand-folded the original FLAT FAST until 2026-05-24 (Pull 4 in Project #2's
-- measurement run, which is a research project pull not a brew). So ALL existing
-- brews.filter = 'FLAT FAST' rows should be 'FLAT 2 FAST'.
--
-- Forward-write paths are already fixed: the alias map in lib/filter-registry.ts
-- now correctly routes "Sibarist FAST Flat 2 - Size S" / "Sibarist FAST - Flat 2,
-- Size S" / etc. to canonical "FLAT 2 FAST" (and 6 new size-aware aliases added).
-- This migration corrects the legacy persistent values.
--
-- Per Project #2 Audit Item #7 (brew history alias-collapse audit).

UPDATE brews
SET filter = 'FLAT 2 FAST'
WHERE filter = 'FLAT FAST';

-- Diagnostic: report row count after update (for verification)
DO $$
DECLARE
  updated_count INT;
BEGIN
  SELECT COUNT(*) INTO updated_count FROM brews WHERE filter = 'FLAT 2 FAST';
  RAISE NOTICE 'brews with filter = FLAT 2 FAST after migration 067: %', updated_count;
END $$;
