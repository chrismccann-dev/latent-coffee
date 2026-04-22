-- Migration 023: Terroir registry reconciliation (Region sprint 1d.1)
-- Aligns the 22 existing `terroirs` rows with the new canonical macro names
-- from Chris's 2026-04-22 research CSV. 11 renames / reclassifications total,
-- all FK-preserving (only the macro_terroir string changes per row; terroir_id
-- UUIDs stay stable, so every brews.terroir_id FK remains valid).
--
-- This is a STRUCTURAL migration only - no content backfill (the 14-attribute
-- per-macro content lands in sprint 1d.2). Mirrors the Variety sprint's split
-- of 021 (structural) vs 022 (content).
--
-- Meso/micro demotion: no schema change. The terroirs.meso_terroir column is
-- retained but demoted from canonical registry to free-text per sprint 1d.1.
-- No rows updated for meso — it was already free-text at the data layer.
--
-- Pre-migration state (2026-04-22 snapshot): 19 distinct macros across 22 rows.
-- Post-migration state: 19 distinct macros across 22 rows (some renames collapse
-- into existing canonicals but never the same country+admin so no unique-
-- constraint collisions; audited before authoring).

-- ---------------------------------------------------------------------------
-- Rename 1 of 11 — Guatemala Chimaltenango
-- "Acatenango Volcanic Highlands" -> "Central Volcanic Highlands"
-- CSV row 44: Guatemala Sacatepéquez/Chimaltenango -> Central Volcanic Highlands.
-- Acatenango appears as a meso example under Central Volcanic, not its own macro.
UPDATE terroirs
SET macro_terroir = 'Central Volcanic Highlands',
    updated_at = now()
WHERE id = 'f052b58f-fa57-4b7b-904f-6493eefada08';

-- ---------------------------------------------------------------------------
-- Rename 2 of 11 — Costa Rica Alajuela
-- "Costa Rican Central Volcanic Highlands" -> "Central Volcanic Highlands"
-- Drop the country prefix; country column already disambiguates from the
-- Guatemala Central Volcanic Highlands row.
UPDATE terroirs
SET macro_terroir = 'Central Volcanic Highlands',
    updated_at = now()
WHERE id = '56dedde9-b182-4820-9491-51b00cc922ca';

-- ---------------------------------------------------------------------------
-- Rename 3 of 11 — Guatemala Huehuetenango
-- "Huehuetenango Highlands" -> "Western Dry Highlands"
-- CSV row 45: Guatemala Huehuetenango/Quiché -> Western Dry Highlands.
UPDATE terroirs
SET macro_terroir = 'Western Dry Highlands',
    updated_at = now()
WHERE id = '4c529fd8-f4f4-4f15-bcb6-d61503b2806f';

-- ---------------------------------------------------------------------------
-- Rename 4 of 11 — Honduras La Paz
-- "Marcala Highlands" -> "Central Honduras Highlands"
-- CSV row 48: Honduras Comayagua/La Paz -> Central Honduras Highlands.
-- Marcala is a meso example within La Paz under Central Honduras.
UPDATE terroirs
SET macro_terroir = 'Central Honduras Highlands',
    updated_at = now()
WHERE id = '45ad39fb-f9af-435b-bf16-1a98b76be734';

-- ---------------------------------------------------------------------------
-- Rename 5 of 11 — Mexico Oaxaca
-- "Sierra Sur Highlands" -> "Oaxaca Southern Highlands"
-- CSV row 103: Mexico Oaxaca -> Oaxaca Southern Highlands (Sierra Sur and
-- Pluma Hidalgo appear as meso examples under this macro).
UPDATE terroirs
SET macro_terroir = 'Oaxaca Southern Highlands',
    updated_at = now()
WHERE id = '22922ed2-2f9b-445d-8175-34bc1a59381c';

-- ---------------------------------------------------------------------------
-- Rename 6 of 11 — Colombia Cauca (reclassification)
-- "Southern Andean Cordillera" -> "Western Andean Cordillera"
-- CSV row 28 explicitly lists Cauca (Inzá, Piendamó) as a Western Andean
-- admin region. "Southern Andean Cordillera" ceases to exist as a Colombia
-- macro post-migration; the Colombia Andean chain splits Central / Northern /
-- Western only per CSV.
UPDATE terroirs
SET macro_terroir = 'Western Andean Cordillera',
    updated_at = now()
WHERE id = '389f8840-5df4-4d1c-86cc-e7bb4b3d02e8';

-- ---------------------------------------------------------------------------
-- Rename 7 of 11 — Colombia Antioquia (reclassification)
-- "Western Andean Cordillera" -> "Central Andean Cordillera"
-- CSV row 31 groups Antioquia/Caldas/Quindío under Central Andean Cordillera
-- (row 28 lists Valle del Cauca/Risaralda/Cauca under Western). The DB row
-- was mis-tagged pre-1d.1. Note: Colombia Quindío already exists as a Central
-- Andean row (f9d0de9d); Antioquia gets added as a sibling row (different
-- admin_region, same macro) - unique constraint (user_id, country, admin, macro)
-- not violated since admin differs.
UPDATE terroirs
SET macro_terroir = 'Central Andean Cordillera',
    updated_at = now()
WHERE id = 'd606b3ad-46a0-4c0d-8a90-13fb70818011';

-- ---------------------------------------------------------------------------
-- Rename 8 of 11 — Peru Cajamarca
-- "Northern Andean Cordillera" -> "Northern Andean Highlands"
-- CSV name split: "Cordillera" is Colombia-only; Peru and Ecuador use
-- "Northern Andean Highlands". CSV row 61: Peru Cajamarca/Amazonas ->
-- Northern Andean Highlands.
UPDATE terroirs
SET macro_terroir = 'Northern Andean Highlands',
    updated_at = now()
WHERE id = '5f55755f-b119-4de0-ad51-29329dbbd248';

-- ---------------------------------------------------------------------------
-- Rename 9 of 11 — Ecuador Imbabura
-- "Northern Andean Cordillera" -> "Northern Andean Highlands"
-- Same split logic as rename 8. CSV row 95: Ecuador Pichincha/Imbabura/Carchi
-- -> Northern Andean Highlands.
UPDATE terroirs
SET macro_terroir = 'Northern Andean Highlands',
    updated_at = now()
WHERE id = '2b209822-21fe-4172-a0e6-23de890aa19a';

-- ---------------------------------------------------------------------------
-- Rename 10 of 11 — China Yunnan
-- "Yunnan Monsoonal Highlands" -> "Yunnan Central Highlands"
-- CSV splits Yunnan into 3 (Northern / Central / Southern). The existing DB
-- row's admin_region is the generic "Yunnan Province" (no finer admin). Chris
-- defaulted to Central Highlands during the 1d.1 vet pass (Baoshan / Dehong /
-- Lincang high-elevation range). Manual verification against the actual brew
-- origin is a 1d.2 audit item if the default proves wrong.
UPDATE terroirs
SET macro_terroir = 'Yunnan Central Highlands',
    updated_at = now()
WHERE id = 'ba1a3ea2-13c4-4d79-a11b-a472dead7f4b';

-- ---------------------------------------------------------------------------
-- Rename 11 of 11 — Burundi Kayanza (reclassification)
-- "Lake Kivu Highlands" -> "Mumirwa Escarpment"
-- CSV row 23 puts Burundi Kayanza/Muramvya/Mwaro under Mumirwa Escarpment.
-- Lake Kivu Highlands in the CSV is DR Congo + Rwanda only; Burundi's lake-
-- adjacent zone has its own canonical name. Cross-border macro pattern still
-- holds for Lake Kivu (2 countries, not 3).
UPDATE terroirs
SET macro_terroir = 'Mumirwa Escarpment',
    updated_at = now()
WHERE id = 'e582aadc-985d-4f27-9695-36e5d6c15b0e';

-- ---------------------------------------------------------------------------
-- Verification: every existing terroirs row now resolves to a canonical macro
-- in lib/terroir-registry.ts TERROIRS. Run post-apply:
--
-- SELECT country, admin_region, macro_terroir, meso_terroir, COUNT(*)
-- FROM terroirs GROUP BY 1, 2, 3, 4 ORDER BY 1, 2;
--
-- Expected: 22 rows with macros drawn from the 121-macro canonical list.
