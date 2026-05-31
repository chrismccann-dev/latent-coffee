-- 073_blend_cultivar_rename.sql
-- NAMING session (2026-05-30). Field-blend cultivar canonicals renamed to the
-- locked `V1, V2 (Blend)` convention. Display-column rename only — cultivar_id
-- FKs (and all per-row content / synthesis) are unaffected. Back-compat aliases
-- in lib/cultivar-registry.ts keep the old slash forms resolving on write.
--
-- Idempotent: WHERE-guards on the old name mean a re-run is a no-op once renamed.

UPDATE cultivars
SET cultivar_name = 'Bourbon, Caturra (Blend)'
WHERE cultivar_name = 'Bourbon / Caturra blend';

UPDATE cultivars
SET cultivar_name = 'Red Bourbon, Mibirizi (Blend)'
WHERE cultivar_name = 'Red Bourbon / Mibirizi blend';
