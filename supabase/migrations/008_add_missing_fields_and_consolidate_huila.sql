-- Migration 008: Add missing schema fields + consolidate Huila terroirs

-- ============================================
-- BREWS: Add what_i_learned
-- ============================================
ALTER TABLE brews ADD COLUMN IF NOT EXISTS what_i_learned text;

-- ============================================
-- TERROIRS: Add missing fields from data schema
-- ============================================
ALTER TABLE terroirs ADD COLUMN IF NOT EXISTS acidity_character text;
ALTER TABLE terroirs ADD COLUMN IF NOT EXISTS body_character text;
ALTER TABLE terroirs ADD COLUMN IF NOT EXISTS farming_model text;
ALTER TABLE terroirs ADD COLUMN IF NOT EXISTS dominant_varieties text[];
ALTER TABLE terroirs ADD COLUMN IF NOT EXISTS typical_processing text[];

-- ============================================
-- CULTIVARS: Add missing fields from data schema
-- ============================================
ALTER TABLE cultivars ADD COLUMN IF NOT EXISTS roast_behavior text;
ALTER TABLE cultivars ADD COLUMN IF NOT EXISTS resting_behavior text;
ALTER TABLE cultivars ADD COLUMN IF NOT EXISTS market_context text;

-- ============================================
-- HUILA CONSOLIDATION: Merge all into "Huila Highlands"
-- ============================================

-- Move brews from 3 other Huila macros into Huila Highlands
UPDATE brews SET terroir_id = 'e297bbbb-0093-4afe-9c5f-86b94ba0ec96'
WHERE terroir_id IN (
  'de3bacd1-cbf3-4327-8d1f-86b395ea7dff',  -- Central Andean Cordillera / Huila
  '45983f99-c3b8-4c8e-b813-1643cebcff2b',  -- Macizo Colombiano / Huila
  '11576524-a02c-46b8-a48e-7566574c5b72'   -- Southern Andean Cordillera / Huila
);

-- Update meso_terroir to include all sub-areas
UPDATE terroirs SET meso_terroir = 'Laboyos Valley, San Agustín, Pitalito'
WHERE id = 'e297bbbb-0093-4afe-9c5f-86b94ba0ec96';

-- Delete merged terroir records
DELETE FROM terroirs WHERE id IN (
  'de3bacd1-cbf3-4327-8d1f-86b395ea7dff',
  '45983f99-c3b8-4c8e-b813-1643cebcff2b',
  '11576524-a02c-46b8-a48e-7566574c5b72'
);
