-- Add synthesis columns to cultivars table
ALTER TABLE cultivars ADD COLUMN IF NOT EXISTS synthesis text;
ALTER TABLE cultivars ADD COLUMN IF NOT EXISTS synthesis_brew_count integer DEFAULT 0;
