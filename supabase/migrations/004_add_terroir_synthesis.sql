-- Add synthesis columns to terroirs table (mirrors cultivar synthesis pattern)
ALTER TABLE terroirs ADD COLUMN synthesis TEXT;
ALTER TABLE terroirs ADD COLUMN synthesis_brew_count INTEGER DEFAULT 0;

-- Fix China/Yunnan terroir: add macro_terroir name
UPDATE terroirs
SET macro_terroir = 'Yunnan Monsoonal Highlands'
WHERE country = 'China'
  AND admin_region = 'Yunnan'
  AND (macro_terroir IS NULL OR macro_terroir = '' OR macro_terroir = '-');
