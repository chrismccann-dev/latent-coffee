-- 074_brews_pours_jsonb.sql
-- data-model session (2026-05-30 / BS-1): structured pour structure.
--
-- Adds brews.pours jsonb — the canonical forward shape for pour structure.
-- claude.ai writes it via push_brew; /brews/[id] renders it when present.
-- Legacy free-text brews.bloom + brews.pour_structure stay UNTOUCHED as the
-- read-fallback for rows that haven't been re-pushed structured yet (Hybrid
-- migration: no lossy mass-parse; the 6 BS-1 brews + lock-reference recipes are
-- hand-backfilled post-deploy via patch_brew, the rest convert organically).
--
-- Step shape (lean, flat — six keys, no nesting; lib/pour-structure.ts PourStep):
--   { type: "bloom"|"pour",  -- bloom always index 0 (kills the double-bloom class)
--     at:   "m:ss",          -- start time, required (kills the "·" missing-time class)
--     to_g: number|null,     -- cumulative grams
--     pour_s: number|null,   -- pour duration (query-only mirror; not rendered)
--     hold_s: number|null,   -- closed-immersion hold (query-only mirror; not rendered)
--     valve:  string|null,   -- valve state e.g. "closed"/"Dial 5" (query-only; transitions live in detail)
--     detail: string|null }  -- the readable technique line (pattern/agitation/kettle/drain prose)
--
-- NULL (not []) is the "not migrated, use legacy fallback" sentinel — the render
-- checks `pours?.length`. An explicit [] would mean "structured, zero steps".
--
-- Idempotent. Apply via the Supabase SQL Editor (072/073 precedent).

ALTER TABLE brews ADD COLUMN IF NOT EXISTS pours jsonb;

COMMENT ON COLUMN brews.pours IS
  'Structured pour steps (data-model session 2026-05-30). Array of flat step objects {type:"bloom"|"pour", at, to_g?, pour_s?, hold_s?, valve?, detail?}; bloom is index 0. Canonical forward shape — written by push_brew, rendered by /brews/[id]. NULL = legacy row (falls back to free-text bloom + pour_structure parse). Validated by cleanPours() in lib/pour-structure.ts.';
