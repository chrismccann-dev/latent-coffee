-- Track 2 Bucket A fixes — surfaced by docs/audits/track-2-2026-05-08.md.
--
-- Two kinds of inline-fixable drift:
--   1. brews.process legacy text out of sync with composeProcess(structured-cols)
--      across 9 rows. The structured columns are authoritative post-1e.2; this
--      pass recomposes the denormalized display column. (Sprint 1e.4 is
--      deferred and will eventually drop brews.process entirely.)
--   2. One orphan terroir row whose meso "Gicumbi / Bukure" duplicates the
--      canonical row (cee51c04) but mislabels admin_region as "Southern
--      Province" (Bukure is in Northern Province, Rwanda). 0 brews + 0
--      green_beans reference the orphan; safe to delete.
--
-- A third inline finding (green_beans/be477009 terroir_provenance flip)
-- was surfaced in the dry-run but reclassified to Bucket B during PR2 prep:
-- the FK target terroir row has NO canonical content populated, so the
-- 'auto_created' flag is correct. Real fix is either content backfill OR
-- re-FK to the existing Finca El Paraiso meso variant (84157635). Deferred
-- to its own mini-sprint.

-- ---------------------------------------------------------------------------
-- 1. brews.process recompose (9 rows). Each value matches
--    composeProcess(structured-cols) computed from the row's existing
--    base_process / subprocess / *_modifiers / decaf_modifier / signature_method.
-- ---------------------------------------------------------------------------

UPDATE brews SET process = 'Cascara Infusion Washed'
  WHERE id = '1e84af99-f059-46e1-af0e-34f1c3329755';

UPDATE brews SET process = 'Double Anaerobic Thermal Shock Yeast Inoculated Washed'
  WHERE id = '5b6530c0-4bc9-46b9-a00f-722412ac7aff';

UPDATE brews SET process = 'Anaerobic Yeast Inoculated Natural'
  WHERE id = '7aef16d6-2ea3-482f-ac52-d7b9e31e7162';

UPDATE brews SET process = 'Anaerobic Slow Dry Natural'
  WHERE id = '7b54b706-ddc5-4148-8777-237ad8ffd728';

UPDATE brews SET process = 'Cold Fermentation Washed'
  WHERE id = '950728e4-6448-413d-b5e0-d974685a451d';

UPDATE brews SET process = 'Double Anaerobic Thermal Shock Yeast Inoculated Washed'
  WHERE id = 'a881c09f-d496-4d2d-a796-4f79f16862ad';

UPDATE brews SET process = 'Dark Room Dried Natural'
  WHERE id = 'ba2caa10-cbc8-4b90-bb81-3782d8b8cabb';

UPDATE brews SET process = 'Floral Co-ferment Washed'
  WHERE id = 'd14fc3e9-f0a0-41b0-b4e3-32721b3c5040';

UPDATE brews SET process = 'Anaerobic Natural'
  WHERE id = 'fd346045-b3ac-4ee2-b9e8-8dbb682e448e';

-- ---------------------------------------------------------------------------
-- 2. Delete orphan terroir row (Rwanda · Central Plateau Highlands · meso
--    "Gicumbi / Bukure" mislabeled to Southern Province). The cee51c04
--    row carries the same meso under correct Northern Province + has 1
--    green_bean reference; this row has 0 references.
-- ---------------------------------------------------------------------------

DELETE FROM terroirs
  WHERE id = '25ff55cc-6d41-4680-a314-da1ff710bf8c'
    AND user_id = 'bb339172-8bb4-4483-a8ca-1078abbc2bfb'
    AND country = 'Rwanda'
    AND macro_terroir = 'Central Plateau Highlands'
    AND meso_terroir = 'Gicumbi / Bukure'
    AND admin_region = 'Southern Province'
    AND NOT EXISTS (SELECT 1 FROM brews b WHERE b.terroir_id = terroirs.id)
    AND NOT EXISTS (SELECT 1 FROM green_beans gb WHERE gb.terroir_id = terroirs.id);
