-- Add extended cultivar fields from JSON export
ALTER TABLE cultivars ADD COLUMN IF NOT EXISTS cultivar_notes text;
ALTER TABLE cultivars ADD COLUMN IF NOT EXISTS cultivar_confidence text;
ALTER TABLE cultivars ADD COLUMN IF NOT EXISTS cultivar_source text;
ALTER TABLE cultivars ADD COLUMN IF NOT EXISTS typical_origins text[];
ALTER TABLE cultivars ADD COLUMN IF NOT EXISTS limiting_factors text[];
ALTER TABLE cultivars ADD COLUMN IF NOT EXISTS altitude_sensitivity text;
ALTER TABLE cultivars ADD COLUMN IF NOT EXISTS terroir_transparency text;
ALTER TABLE cultivars ADD COLUMN IF NOT EXISTS common_processing_methods text[];
ALTER TABLE cultivars ADD COLUMN IF NOT EXISTS typical_flavor_notes text[];
ALTER TABLE cultivars ADD COLUMN IF NOT EXISTS common_pitfalls text[];
