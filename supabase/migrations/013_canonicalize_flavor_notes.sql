-- Migration 013 — Canonicalize flavor_notes across all brews
--
-- Run manually via Supabase SQL Editor after review.
--
-- Why this matters: brews.flavor_notes is aggregated as a flat count on all 3
-- aggregation detail pages (terroir, cultivar, process). Drift — case variants,
-- prefix-style fragments ("hints of bergamot"), whole sentences — silently
-- double-counts a single coffee's flavor across two near-identical tags.
--
-- Scope (per sprint plan):
--   Part 1: collapse 13 pure case-variant pairs
--   Part 2: title-case lowercase singletons (hygiene)
--   Part 3: mechanical fragment fixes (prefix strip, trailing punctuation)
--   Part 4: per-row long-sentence splits (explicit IDs)
--
-- Not in this migration (by design):
--   - Composite collapse ("Floral sweetness" → "Floral") — handled at render
--     time via lib/flavor-registry.ts substring lookup. Data stays intact.
--   - Structure-descriptor deletion ("Bright", "complex", "Tea-like finish")
--     — kept; they fall into the "Other" family on render.

BEGIN;

-- =====================================================================
-- Part 1: Case-variant collapse (13 pairs with known duplicates)
-- =====================================================================

UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'lavender', 'Lavender')
  WHERE 'lavender' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'floral', 'Floral')
  WHERE 'floral' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'lychee', 'Lychee')
  WHERE 'lychee' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'rose', 'Rose')
  WHERE 'rose' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'stone fruit', 'Stone Fruit')
  WHERE 'stone fruit' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'Stone fruit', 'Stone Fruit')
  WHERE 'Stone fruit' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'white grape', 'White Grape')
  WHERE 'white grape' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'pear', 'Pear')
  WHERE 'pear' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'mango', 'Mango')
  WHERE 'mango' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'citrus', 'Citrus')
  WHERE 'citrus' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'hibiscus', 'Hibiscus')
  WHERE 'hibiscus' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'candied strawberry', 'Candied Strawberry')
  WHERE 'candied strawberry' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'passion fruit', 'Passion Fruit')
  WHERE 'passion fruit' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'soft florals', 'Soft Florals')
  WHERE 'soft florals' = ANY(flavor_notes);

-- Sentence-case ("First word capitalized") variants that differ from Title Case
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'Candied strawberry', 'Candied Strawberry')
  WHERE 'Candied strawberry' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'Passion fruit', 'Passion Fruit')
  WHERE 'Passion fruit' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'Red grape', 'Red Grape')
  WHERE 'Red grape' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'Soft florals', 'Soft Florals')
  WHERE 'Soft florals' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'White grape', 'White Grape')
  WHERE 'White grape' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'white nectarine', 'White Nectarine')
  WHERE 'white nectarine' = ANY(flavor_notes);

-- Lowercase-second-word sweep (also sentence-case)
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'Raw sugar', 'Raw Sugar') WHERE 'Raw sugar' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'Green apple', 'Green Apple') WHERE 'Green apple' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'Lemon zest', 'Lemon Zest') WHERE 'Lemon zest' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'Lime juice', 'Lime Juice') WHERE 'Lime juice' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'Grapefruit zest', 'Grapefruit Zest') WHERE 'Grapefruit zest' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'Meyer lemon', 'Meyer Lemon') WHERE 'Meyer lemon' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'Red apple', 'Red Apple') WHERE 'Red apple' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'Apple cider', 'Apple Cider') WHERE 'Apple cider' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'Vanilla bean', 'Vanilla Bean') WHERE 'Vanilla bean' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'Vanilla cream', 'Vanilla Cream') WHERE 'Vanilla cream' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'Earl Grey tea', 'Earl Grey Tea') WHERE 'Earl Grey tea' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'Black tea', 'Black Tea') WHERE 'Black tea' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'Green tea', 'Green Tea') WHERE 'Green tea' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'White tea', 'White Tea') WHERE 'White tea' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'Honeyed tea', 'Honeyed Tea') WHERE 'Honeyed tea' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'Spring honey', 'Spring Honey') WHERE 'Spring honey' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'Peach tea', 'Peach Tea') WHERE 'Peach tea' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'Watermelon candy', 'Watermelon Candy') WHERE 'Watermelon candy' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'Cherry blossom', 'Cherry Blossom') WHERE 'Cherry blossom' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'Tomato leaf', 'Tomato Leaf') WHERE 'Tomato leaf' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'Fresh grape', 'Fresh Grape') WHERE 'Fresh grape' = ANY(flavor_notes);

-- =====================================================================
-- Part 2: Title-case lowercase singletons (hygiene — no dup collisions)
-- =====================================================================

UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'apricot', 'Apricot')
  WHERE 'apricot' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'baklava', 'Baklava')
  WHERE 'baklava' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'blackberry', 'Blackberry')
  WHERE 'blackberry' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'Key lime', 'Key Lime')
  WHERE 'Key lime' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'cardamom', 'Cardamom')
  WHERE 'cardamom' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'chardonnay', 'Chardonnay')
  WHERE 'chardonnay' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'complex', 'Complex')
  WHERE 'complex' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'cup', 'Cup')
  WHERE 'cup' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'eucalyptus', 'Eucalyptus')
  WHERE 'eucalyptus' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'fruity tea', 'Fruity Tea')
  WHERE 'fruity tea' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'haw flake', 'Haw Flake')
  WHERE 'haw flake' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'jasmine milk tea', 'Jasmine Milk Tea')
  WHERE 'jasmine milk tea' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'juicy blackberry', 'Juicy Blackberry')
  WHERE 'juicy blackberry' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'layered', 'Layered')
  WHERE 'layered' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'maple syrup', 'Maple Syrup')
  WHERE 'maple syrup' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'milk candy', 'Milk Candy')
  WHERE 'milk candy' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'milk tea', 'Milk Tea')
  WHERE 'milk tea' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'orange', 'Orange')
  WHERE 'orange' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'peach candy', 'Peach Candy')
  WHERE 'peach candy' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'pomelo', 'Pomelo')
  WHERE 'pomelo' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'rose water', 'Rose Water')
  WHERE 'rose water' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'sparkling red grape', 'Sparkling Red Grape')
  WHERE 'sparkling red grape' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'spices', 'Spices')
  WHERE 'spices' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'sweet fruit', 'Sweet Fruit')
  WHERE 'sweet fruit' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'sweet pineapple', 'Sweet Pineapple')
  WHERE 'sweet pineapple' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'tangerine', 'Tangerine')
  WHERE 'tangerine' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'tea spice', 'Tea Spice')
  WHERE 'tea spice' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'violet', 'Violet')
  WHERE 'violet' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'yellow florals', 'Yellow Florals')
  WHERE 'yellow florals' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'apple jam', 'Apple Jam')
  WHERE 'apple jam' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'candied floral', 'Candied Floral')
  WHERE 'candied floral' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'candied sweetness', 'Candied Sweetness')
  WHERE 'candied sweetness' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'cinnamon french toast', 'Cinnamon French Toast')
  WHERE 'cinnamon french toast' = ANY(flavor_notes);

-- =====================================================================
-- Part 3: Mechanical fragment fixes (prefix strip + trailing punctuation)
-- =====================================================================

-- "hints of X" → X
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'hints of bergamot', 'Bergamot')
  WHERE 'hints of bergamot' = ANY(flavor_notes);

-- trailing period / conjunction-prefixed fragments from sentence splits
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'grape complexity.', 'Grape')
  WHERE 'grape complexity.' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'and watermelon.', 'Watermelon')
  WHERE 'and watermelon.' = ANY(flavor_notes);
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'and white grape', 'White Grape')
  WHERE 'and white grape' = ANY(flavor_notes);

-- Trailing ! stripped + title-cased (descriptor, kept per Chris's call)
UPDATE brews SET flavor_notes = array_replace(flavor_notes, 'syrupy coating!', 'Syrupy Coating')
  WHERE 'syrupy coating!' = ANY(flavor_notes);

-- =====================================================================
-- Part 4: Per-row long-sentence splits (reshape the array)
-- =====================================================================

-- Finca Soledad Mejorado — "Sugar Cane & Citrus." → ["Sugar Cane", "Citrus"]
UPDATE brews
  SET flavor_notes = array_cat(array_remove(flavor_notes, 'Sugar Cane & Citrus.'), ARRAY['Sugar Cane', 'Citrus'])
  WHERE id = '643c6b5d-609c-4a1b-944a-4264ecc0df02'
    AND 'Sugar Cane & Citrus.' = ANY(flavor_notes);

-- 2025 Crispilliano Contreras × Lost Origin Panama
-- "Clean citric acidity (lime / mandarin range)" → ["Lime", "Mandarin"]
UPDATE brews
  SET flavor_notes = array_cat(
    array_remove(flavor_notes, 'Clean citric acidity (lime / mandarin range)'),
    ARRAY['Lime', 'Mandarin']
  )
  WHERE id = '903a364a-2877-44dc-b60c-f1529d9ba6b4'
    AND 'Clean citric acidity (lime / mandarin range)' = ANY(flavor_notes);

-- Pacamara Natural - Kotowa - Strait Coffee
-- Entire array was two sentences — replace outright.
-- was: ["Sweetness of white nectarine and red grape",
--       "balanced by a refreshing lemongrass brightness."]
UPDATE brews
  SET flavor_notes = ARRAY['White Nectarine', 'Red Grape', 'Lemongrass']
  WHERE id = '52f8be46-94b7-4ec4-a08b-50afbd1032c3';

-- Rwanda - Gitesi #222 - Washed Red Bourbon
-- was: ["cup", "prune and lemon notes blend with a generous sweetness reminiscent of caramel"]
-- Keep "Cup" (descriptor, Part 2 will have already title-cased it to "Cup") and
-- expand the 76-char sentence into its three base flavors.
UPDATE brews
  SET flavor_notes = ARRAY['Cup', 'Prune', 'Lemon', 'Caramel']
  WHERE id = '94fb57ac-c04a-49ef-b281-97de4d0e9c46';

COMMIT;
