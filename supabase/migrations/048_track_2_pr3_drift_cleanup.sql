-- Track 2 PR3 — Bucket B drift cleanup. Surfaced by docs/audits/track-2-2026-05-08.md.
--
-- Five kinds of fixes, applied in dependency order (rename + re-FK before
-- the orphan deletes that depend on those re-FKs landing first):
--   1. Producer canonical renames on brews.producer (2 rows). The 2 names
--      had no canonical entry in the .ts registry; PR3 adds the canonical
--      "Justin Boudeman" + uses the existing "Jannette & Kai Janson (Janson
--      Farms)" .md entry as the canonical .ts entry. Brews are renamed to
--      the canonical full form. Pocho Gallardo + Rumu Damo Washing Station
--      already match their canonical name (just needed the registry add).
--   2. Re-FK El Paraiso Red Plum Castillo bean (be477009). Currently FK'd
--      to a NULL-meso Western Andean Cordillera placeholder row with no
--      canonical content. The Finca El Paraiso meso variant (84157635)
--      is the right canonical target — already has 1 brew_ref. After
--      re-FK, flip terroir_provenance to 'canonical' + bump
--      canonicals_updated_at.
--   3. Delete the now-orphan Western Andean Cordillera NULL-meso row
--      (bbaefa60). After the re-FK in step 2, it has 0 references.
--   4. Delete the orphan Lake Kivu Highlands "Nova Washing Station catchment"
--      row (389e497b). Never had references; created 2026-05-05 as a ghost.
--   5. Clear stale Bourbon cultivar synthesis cache (ddfce7fc). cached=4
--      brews but actual=0 — the 4 brews previously linked were re-FK'd to
--      sibling Bourbon variants during sprint 1a Variety adoption. The
--      synthesis text is stale; clear synthesis + zero the count.

-- ---------------------------------------------------------------------------
-- 1. Producer canonical renames
-- ---------------------------------------------------------------------------

UPDATE brews SET producer = 'Jannette & Kai Janson (Janson Farms)'
  WHERE id = '64606db8-837e-4631-b58a-01d8a77677b8'
    AND producer = 'Jannette & Kai Janson';

UPDATE brews SET producer = 'Justin Boudeman'
  WHERE id = 'e479e75b-2a5c-4c40-a3d5-098be6b948b7'
    AND producer = 'Justin Boudeman / Longboard Coffee';

-- ---------------------------------------------------------------------------
-- 2. Re-FK El Paraiso bean to the Finca El Paraiso meso variant + flip
--    provenance to canonical.
-- ---------------------------------------------------------------------------

UPDATE green_beans
  SET terroir_id = '84157635-7894-41e0-9bd6-e80cf1357ec4',
      terroir_provenance = 'canonical',
      canonicals_updated_at = NOW()
  WHERE id = 'be477009-20ca-4b7f-acbc-71c089e16117'
    AND user_id = 'bb339172-8bb4-4483-a8ca-1078abbc2bfb'
    AND terroir_id = 'bbaefa60-6d74-4199-9dd6-a2b5db4b4585';

-- ---------------------------------------------------------------------------
-- 3. Delete now-orphan Western Andean Cordillera NULL-meso terroir row
-- ---------------------------------------------------------------------------

DELETE FROM terroirs
  WHERE id = 'bbaefa60-6d74-4199-9dd6-a2b5db4b4585'
    AND user_id = 'bb339172-8bb4-4483-a8ca-1078abbc2bfb'
    AND country = 'Colombia'
    AND macro_terroir = 'Western Andean Cordillera'
    AND meso_terroir IS NULL
    AND NOT EXISTS (SELECT 1 FROM brews b WHERE b.terroir_id = terroirs.id)
    AND NOT EXISTS (SELECT 1 FROM green_beans gb WHERE gb.terroir_id = terroirs.id);

-- ---------------------------------------------------------------------------
-- 4. Delete orphan Lake Kivu Highlands "Nova Washing Station catchment" row
-- ---------------------------------------------------------------------------

DELETE FROM terroirs
  WHERE id = '389e497b-0c1f-4165-9216-be3f463fcf74'
    AND user_id = 'bb339172-8bb4-4483-a8ca-1078abbc2bfb'
    AND country = 'Rwanda'
    AND macro_terroir = 'Lake Kivu Highlands'
    AND meso_terroir = 'Nova Washing Station catchment'
    AND NOT EXISTS (SELECT 1 FROM brews b WHERE b.terroir_id = terroirs.id)
    AND NOT EXISTS (SELECT 1 FROM green_beans gb WHERE gb.terroir_id = terroirs.id);

-- ---------------------------------------------------------------------------
-- 5. Clear stale Bourbon cultivar synthesis cache
-- ---------------------------------------------------------------------------

UPDATE cultivars
  SET synthesis = NULL,
      synthesis_brew_count = 0
  WHERE id = 'ddfce7fc-4595-41f9-9ee4-a788af8a792b'
    AND user_id = 'bb339172-8bb4-4483-a8ca-1078abbc2bfb'
    AND cultivar_name = 'Bourbon';
