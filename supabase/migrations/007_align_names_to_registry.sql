-- Migration 007: Align terroir and cultivar names to canonical registries
-- Reverts migration 006 renames that diverged from registry, fixes cultivar names.

-- ============================================
-- TERROIR: Revert to canonical registry names
-- ============================================

-- "Central Cordillera" → "Central Andean Cordillera" (registry name)
UPDATE terroirs SET macro_terroir = 'Central Andean Cordillera'
WHERE macro_terroir = 'Central Cordillera';

-- "Western Cordillera" → "Western Andean Cordillera" (registry name)
UPDATE terroirs SET macro_terroir = 'Western Andean Cordillera'
WHERE macro_terroir = 'Western Cordillera';

-- "Guatemala Central Volcanic Highlands" → "Costa Rican Central Volcanic Highlands"
-- (registry name — ecological system spans both countries)
UPDATE terroirs SET macro_terroir = 'Costa Rican Central Volcanic Highlands'
WHERE id = 'f052b58f-fa57-4b7b-904f-6493eefada08';

-- "Cuchumatanes Highlands" → "Chiapas Highlands"
-- (registry name — same geological system as Mexican Chiapas)
UPDATE terroirs SET macro_terroir = 'Chiapas Highlands'
WHERE id = '4c529fd8-f4f4-4f15-bcb6-d61503b2806f';

-- "Gesha-Bench Sheko Highlands" → "Bench Sheko Highlands" (registry name)
UPDATE terroirs SET macro_terroir = 'Bench Sheko Highlands'
WHERE id = '5791e4eb-0726-4953-8d84-36a50b1deefb';

-- "Northern Ecuador Andean Highlands" → "Northern Andean Cordillera" (registry name)
UPDATE terroirs SET macro_terroir = 'Northern Andean Cordillera'
WHERE id = '2b209822-21fe-4172-a0e6-23de890aa19a';


-- ============================================
-- CULTIVAR: Align to canonical registry names
-- ============================================

-- "Colombian Gesha selection" → "Gesha (Colombian selection)" (registry name)
UPDATE cultivars SET cultivar_name = 'Gesha (Colombian selection)'
WHERE id = '1926024c-9bc6-4cf7-bfb7-017fc955e799';

-- "Panamanian Gesha selection" → "Gesha (Panamanian selection)" (registry name)
UPDATE cultivars SET cultivar_name = 'Gesha (Panamanian selection)'
WHERE id = 'cb1e1af2-49d4-4f6a-913d-7590bba5068d';

-- "Gesha (Brazilian Selection)" → "Gesha (Brazilian selection)" (consistent casing)
UPDATE cultivars SET cultivar_name = 'Gesha (Brazilian selection)'
WHERE id = '9db53534-eab7-474a-b92f-74872f32c332';

-- "Typica Mejorado" → "Mejorado" and fix family/lineage to match registry
UPDATE cultivars SET
  cultivar_name = 'Mejorado',
  genetic_family = 'Typica × Bourbon Crosses',
  lineage = 'Typica × Bourbon cross lineage'
WHERE id = 'e5752a92-78ee-4578-af44-176171295ce1';

-- Fix Mokkita: "Bourbon Family / SL Bourbon lineage" → "Modern Hybrids / Multi-parent hybrid lineage"
UPDATE cultivars SET
  genetic_family = 'Modern Hybrids',
  lineage = 'Multi-parent hybrid lineage'
WHERE id = '2109b2fc-3724-4ce2-b0cd-efb62a8a502b';
