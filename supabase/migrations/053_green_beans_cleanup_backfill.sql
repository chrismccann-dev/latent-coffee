-- Sprint 3.2 (Cleanup-A) — green_beans data backfill bundle.
--
-- Three independent backfills folded into one migration since the row sets
-- overlap and the transaction semantics are simpler. Touched rows get
-- updated_at bumped so the standard staleness checks still work.
--
-- Item #2: backfill green_beans.origin from terroirs.country.
--   Targets the 3 rows where origin IS NULL and terroir_id resolves to a
--   country. Deliberately excludes the 1 row (Gesha Village Surma) where
--   origin already carries a richer compound string ("Ethiopia - Bench Maji
--   - Surma") that the per-row update guard preserves.
--
-- Item #13: backfill green_beans.variety from cultivars.cultivar_name.
--   Targets the 4 rows where variety IS NULL AND cultivar_id IS NOT NULL.
--   Sibling fix to #2 — same shape, different column.
--
-- Item #15: rename Rancho Tio lot to drop "(Taza Dorada 2024 #6)" suffix.
--   Auction-metadata-in-name pattern bleeds into render width. Convention
--   documented in CLAUDE.md § Green § Lot-naming convention.

BEGIN;

-- Item #2 — origin backfill
UPDATE green_beans gb
SET origin = t.country,
    updated_at = NOW()
FROM terroirs t
WHERE gb.terroir_id = t.id
  AND gb.origin IS NULL;

-- Item #13 — variety backfill
UPDATE green_beans gb
SET variety = c.cultivar_name,
    updated_at = NOW()
FROM cultivars c
WHERE gb.cultivar_id = c.id
  AND gb.variety IS NULL;

-- Item #15 — Rancho Tio lot rename
UPDATE green_beans
SET name = 'Rancho Tio Emilio - Typica Mejorado Washed',
    updated_at = NOW()
WHERE id = 'b0c57fd5-2a43-46b4-9cf8-197ec97bd6ab'
  AND name LIKE 'Rancho Tio Emilio - Typica Mejorado Washed (Taza Dorada%';

COMMIT;
