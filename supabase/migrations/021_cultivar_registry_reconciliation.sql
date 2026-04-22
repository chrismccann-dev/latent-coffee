-- 021_cultivar_registry_reconciliation
--
-- Reconciles the cultivars table with the Variety sprint canonical registry
-- (lib/cultivar-registry.ts) after Chris's 2026-04-22 research pass.
--
-- Structural changes only. Content backfill (18 attribute fields from the
-- varieties.md CSV) lands in a follow-on migration after the taxonomy doc
-- is authored and reviewed.
--
-- Changes in this migration:
--   1. Rename `Bourbon Aruzi` → `Aruzi` (Aruzi = Bourbon Aruzi per decision
--      B5 — adopt the shorter canonical, matches Caturra / Laurina pattern).
--   2. Rename `Catimor Group` → `Catimor (group)` (group-label convention
--      per decision D5, aligns with new `Sarchimor (group)` canonical).
--   3. Rename `74110/74112` → `Ethiopian Landrace Blend (74110/74112)`
--      (the one existing brew, Heart's Ethiopia Tagel Alemayehu, is a
--      genuinely mixed JARC lot — promoted to a proper blend canonical per
--      decision B6 / Option A; 74110 and 74112 become separate canonicals
--      in the registry for future pure-lot cases but no DB rows yet).
--   4. Move `Laurina` lineage `Bourbon (classic)` → `Bourbon mutation lineage`
--      (Laurina is a natural Bourbon mutation — CSV research corrects the
--      prior classification).
--
-- No rows are deleted. No brews are unlinked. FK relationships preserved
-- (cultivars.id stable across all renames).

BEGIN;

-- 1. Bourbon Aruzi → Aruzi
UPDATE cultivars
SET cultivar_name = 'Aruzi',
    updated_at = NOW()
WHERE cultivar_name = 'Bourbon Aruzi';

-- 2. Catimor Group → Catimor (group)
UPDATE cultivars
SET cultivar_name = 'Catimor (group)',
    updated_at = NOW()
WHERE cultivar_name = 'Catimor Group';

-- 3. 74110/74112 → Ethiopian Landrace Blend (74110/74112)
UPDATE cultivars
SET cultivar_name = 'Ethiopian Landrace Blend (74110/74112)',
    updated_at = NOW()
WHERE cultivar_name = '74110/74112';

-- 4. Laurina lineage correction
UPDATE cultivars
SET lineage = 'Bourbon mutation lineage',
    updated_at = NOW()
WHERE cultivar_name = 'Laurina'
  AND lineage = 'Bourbon (classic)';

COMMIT;
