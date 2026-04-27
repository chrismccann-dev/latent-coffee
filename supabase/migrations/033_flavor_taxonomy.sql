-- Sprint 1g: Flavor taxonomy adoption — Migration 033
-- 3-axis composable taxonomy (base + modifiers + structure)
-- Adds flavors jsonb + structure_tags text[] columns + Bucket A/B/C backfill
--
-- Source: docs/taxonomies/flavors.md + lib/flavor-registry.ts
-- Per-brew decompositions from /tmp/sprint-1g/bucket_c_decomposition.csv (Chris-reviewed)
-- Bucket A (alias-clean), Bucket B (structure migration), legacy base-only auto-resolved.

BEGIN;

-- ============================================================
-- Schema
-- ============================================================
ALTER TABLE brews ADD COLUMN IF NOT EXISTS flavors jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE brews ADD COLUMN IF NOT EXISTS structure_tags text[] NOT NULL DEFAULT '{}'::text[];

COMMENT ON COLUMN brews.flavors IS 'Array of {base, modifiers[]} per Sprint 1g flavor taxonomy. Display string composed for back-compat in flavor_notes.';
COMMENT ON COLUMN brews.structure_tags IS 'Per-coffee structure descriptors (Acidity:Bright, Body:Silky, etc.) per Sprint 1g.';

-- ============================================================
-- Per-brew backfill (Bucket A + B + C + legacy)
-- ============================================================

-- Brew 05e3c387-cc23-4952-a1ad-ccd8cdde6687
--   Raw: ['Spices', 'blue and black fruits']
--   Drops: ['blue and black fruits']
UPDATE brews SET
  flavors = '[{"base": "Spices", "modifiers": []}]'::jsonb,
  structure_tags = ARRAY[]::text[],
  flavor_notes = ARRAY['Spices']::text[]
WHERE id = '05e3c387-cc23-4952-a1ad-ccd8cdde6687';

-- Brew 08cdfd6e-4113-4e8b-8835-f788ba7f124a
--   Raw: ['Lime Juice', 'White Tea', 'Jasmine Pearls']
UPDATE brews SET
  flavors = '[{"base": "Lime", "modifiers": ["Juice"]}, {"base": "White Tea", "modifiers": []}, {"base": "Jasmine", "modifiers": []}]'::jsonb,
  structure_tags = ARRAY[]::text[],
  flavor_notes = ARRAY['Lime (Juice)', 'White Tea', 'Jasmine']::text[]
WHERE id = '08cdfd6e-4113-4e8b-8835-f788ba7f124a';

-- Brew 0a6690c0-608d-4410-9c57-ab8fcc601ccb
--   Raw: ['Pomegranate', 'Chamomile', 'Raspberry Compote']
UPDATE brews SET
  flavors = '[{"base": "Pomegranate", "modifiers": []}, {"base": "Chamomile", "modifiers": []}, {"base": "Raspberry", "modifiers": ["Jam / Compote"]}]'::jsonb,
  structure_tags = ARRAY[]::text[],
  flavor_notes = ARRAY['Pomegranate', 'Chamomile', 'Raspberry (Jam / Compote)']::text[]
WHERE id = '0a6690c0-608d-4410-9c57-ab8fcc601ccb';

-- Brew 0b708859-a9af-4b57-a13a-5ea6c3afabf4
--   Raw: ['White Grape', 'Green Apple', 'Honey']
UPDATE brews SET
  flavors = '[{"base": "Grape", "modifiers": []}, {"base": "Apple", "modifiers": ["Fresh"]}, {"base": "Honey", "modifiers": []}]'::jsonb,
  structure_tags = ARRAY[]::text[],
  flavor_notes = ARRAY['Grape', 'Apple (Fresh)', 'Honey']::text[]
WHERE id = '0b708859-a9af-4b57-a13a-5ea6c3afabf4';

-- Brew 1e0b7b28-752f-4f3c-aced-a56cff802f0f
--   Raw: ['Grapefruit Zest', 'Raw Sugar', 'Jasmine']
UPDATE brews SET
  flavors = '[{"base": "Grapefruit", "modifiers": ["Zest"]}, {"base": "Raw Sugar", "modifiers": []}, {"base": "Jasmine", "modifiers": []}]'::jsonb,
  structure_tags = ARRAY[]::text[],
  flavor_notes = ARRAY['Grapefruit (Zest)', 'Raw Sugar', 'Jasmine']::text[]
WHERE id = '1e0b7b28-752f-4f3c-aced-a56cff802f0f';

-- Brew 1e84af99-f059-46e1-af0e-34f1c3329755
--   Raw: ['Lavender', 'Soft Florals', 'White Grape']
UPDATE brews SET
  flavors = '[{"base": "Lavender", "modifiers": []}, {"base": "Jasmine", "modifiers": ["Light"]}, {"base": "Grape", "modifiers": []}]'::jsonb,
  structure_tags = ARRAY['Clarity:Subtle']::text[],
  flavor_notes = ARRAY['Lavender', 'Jasmine (Light)', 'Grape']::text[]
WHERE id = '1e84af99-f059-46e1-af0e-34f1c3329755';

-- Brew 21c7ce72-0cbf-4729-8858-f1cee83d3471
--   Raw: ['Candied Strawberry', 'Haw Flake', 'Orange', 'Hibiscus']
UPDATE brews SET
  flavors = '[{"base": "Strawberry", "modifiers": ["Candied"]}, {"base": "Haw Flake", "modifiers": []}, {"base": "Orange", "modifiers": []}, {"base": "Hibiscus", "modifiers": []}]'::jsonb,
  structure_tags = ARRAY[]::text[],
  flavor_notes = ARRAY['Strawberry (Candied)', 'Haw Flake', 'Orange', 'Hibiscus']::text[]
WHERE id = '21c7ce72-0cbf-4729-8858-f1cee83d3471';

-- Brew 23428ff3-fa18-4618-93af-13f47719c329
--   Raw: ['Bergamot', 'Lemon', 'Marmalade']
UPDATE brews SET
  flavors = '[{"base": "Bergamot", "modifiers": []}, {"base": "Lemon", "modifiers": []}, {"base": "Orange", "modifiers": ["Marmalade"]}]'::jsonb,
  structure_tags = ARRAY[]::text[],
  flavor_notes = ARRAY['Bergamot', 'Lemon', 'Orange (Marmalade)']::text[]
WHERE id = '23428ff3-fa18-4618-93af-13f47719c329';

-- Brew 29bf7bb3-0ce6-4616-a028-1fa17aa47664
--   Raw: ['Baklava', 'Lychee', 'Rose Water']
UPDATE brews SET
  flavors = '[{"base": "Baklava", "modifiers": []}, {"base": "Lychee", "modifiers": []}, {"base": "Rose", "modifiers": []}]'::jsonb,
  structure_tags = ARRAY[]::text[],
  flavor_notes = ARRAY['Baklava', 'Lychee', 'Rose']::text[]
WHERE id = '29bf7bb3-0ce6-4616-a028-1fa17aa47664';

-- Brew 2b251847-24cb-4095-abe7-ccc6880be848
--   Raw: ['Pineapple', 'Mango', 'Maple Syrup']
UPDATE brews SET
  flavors = '[{"base": "Pineapple", "modifiers": []}, {"base": "Mango", "modifiers": []}, {"base": "Maple Syrup", "modifiers": []}]'::jsonb,
  structure_tags = ARRAY[]::text[],
  flavor_notes = ARRAY['Pineapple', 'Mango', 'Maple Syrup']::text[]
WHERE id = '2b251847-24cb-4095-abe7-ccc6880be848';

-- Brew 2fdfbb95-3582-46e8-8262-9c2422809bb3
--   Raw: ['Fruit', 'Lavender', 'Cardamom', 'Tea Spice']
UPDATE brews SET
  flavors = '[{"base": "Peach", "modifiers": []}, {"base": "Lavender", "modifiers": []}, {"base": "Cardamom", "modifiers": []}, {"base": "Spices", "modifiers": []}]'::jsonb,
  structure_tags = ARRAY['Clarity:Layered', 'Sweetness:High']::text[],
  flavor_notes = ARRAY['Peach', 'Lavender', 'Cardamom', 'Spices']::text[]
WHERE id = '2fdfbb95-3582-46e8-8262-9c2422809bb3';

-- Brew 314c342f-d63e-4e3c-891e-b1a8de7cdc2b
--   Raw: ['Rose', 'Passionfruit', 'Muscat Rouge']
UPDATE brews SET
  flavors = '[{"base": "Rose", "modifiers": []}, {"base": "Passion Fruit", "modifiers": []}, {"base": "Muscat", "modifiers": []}]'::jsonb,
  structure_tags = ARRAY[]::text[],
  flavor_notes = ARRAY['Rose', 'Passion Fruit', 'Muscat']::text[]
WHERE id = '314c342f-d63e-4e3c-891e-b1a8de7cdc2b';

-- Brew 3aef599b-8339-45eb-ae9b-5e91d6eda123
--   Raw: ['Kiwi', 'Eucalyptus', 'Stone Fruit', 'Complex', 'Layered', 'Syrupy Coating']
--   Drops: ['Complex', 'Layered', 'Syrupy Coating']
UPDATE brews SET
  flavors = '[{"base": "Kiwi", "modifiers": []}, {"base": "Eucalyptus", "modifiers": []}, {"base": "Peach", "modifiers": []}]'::jsonb,
  structure_tags = ARRAY['Overall:Tea-like', 'Clarity:Complex', 'Clarity:Layered', 'Body:Syrupy', 'Finish:Coating']::text[],
  flavor_notes = ARRAY['Kiwi', 'Eucalyptus', 'Peach']::text[]
WHERE id = '3aef599b-8339-45eb-ae9b-5e91d6eda123';

-- Brew 3e781561-7bf7-405e-ba57-b712f2756932
--   Raw: ['Juicy Blackberry', 'Sweet Pineapple', 'Citrus']
UPDATE brews SET
  flavors = '[{"base": "Blackberry", "modifiers": []}, {"base": "Pineapple", "modifiers": ["Sugary"]}, {"base": "Pineapple", "modifiers": []}]'::jsonb,
  structure_tags = ARRAY['Acidity:Juicy']::text[],
  flavor_notes = ARRAY['Blackberry', 'Pineapple (Sugary)', 'Pineapple']::text[]
WHERE id = '3e781561-7bf7-405e-ba57-b712f2756932';

-- Brew 4884a010-a981-49ae-ab0f-34d8b650dc17
--   Raw: ['Stone Fruit', 'Key Lime', 'Watermelon']
UPDATE brews SET
  flavors = '[{"base": "Watermelon", "modifiers": []}, {"base": "Lime", "modifiers": []}, {"base": "Watermelon", "modifiers": []}]'::jsonb,
  structure_tags = ARRAY['Acidity:Juicy']::text[],
  flavor_notes = ARRAY['Watermelon', 'Lime', 'Watermelon']::text[]
WHERE id = '4884a010-a981-49ae-ab0f-34d8b650dc17';

-- Brew 49bc0e95-6f8e-4c1d-8ebe-fce33b9c8a53
--   Raw: ['Jasmine', 'Lemon Zest', 'Mint']
UPDATE brews SET
  flavors = '[{"base": "Jasmine", "modifiers": []}, {"base": "Lemon", "modifiers": ["Zest"]}, {"base": "Mint", "modifiers": []}]'::jsonb,
  structure_tags = ARRAY[]::text[],
  flavor_notes = ARRAY['Jasmine', 'Lemon (Zest)', 'Mint']::text[]
WHERE id = '49bc0e95-6f8e-4c1d-8ebe-fce33b9c8a53';

-- Brew 52f8be46-94b7-4ec4-a08b-50afbd1032c3
--   Raw: ['White Nectarine', 'Red Grape', 'Lemongrass']
UPDATE brews SET
  flavors = '[{"base": "Nectarine", "modifiers": []}, {"base": "Grape", "modifiers": []}, {"base": "Lemongrass", "modifiers": []}]'::jsonb,
  structure_tags = ARRAY[]::text[],
  flavor_notes = ARRAY['Nectarine', 'Grape', 'Lemongrass']::text[]
WHERE id = '52f8be46-94b7-4ec4-a08b-50afbd1032c3';

-- Brew 5b6530c0-4bc9-46b9-a00f-722412ac7aff
--   Raw: ['Jasmine', 'Milk Tea', 'Rose', 'Floral']
UPDATE brews SET
  flavors = '[{"base": "Jasmine", "modifiers": []}, {"base": "Tea", "modifiers": ["Milky"]}, {"base": "Rose", "modifiers": []}, {"base": "Jasmine", "modifiers": []}]'::jsonb,
  structure_tags = ARRAY[]::text[],
  flavor_notes = ARRAY['Jasmine', 'Tea (Milky)', 'Rose', 'Jasmine']::text[]
WHERE id = '5b6530c0-4bc9-46b9-a00f-722412ac7aff';

-- Brew 643c6b5d-609c-4a1b-944a-4264ecc0df02
--   Raw: ['Mango', 'Sugar Cane', 'Citrus']
UPDATE brews SET
  flavors = '[{"base": "Mango", "modifiers": []}, {"base": "Sugar Cane", "modifiers": []}, {"base": "Lemon", "modifiers": []}]'::jsonb,
  structure_tags = ARRAY['Finish:Clean']::text[],
  flavor_notes = ARRAY['Mango', 'Sugar Cane', 'Lemon']::text[]
WHERE id = '643c6b5d-609c-4a1b-944a-4264ecc0df02';

-- Brew 7aef16d6-2ea3-482f-ac52-d7b9e31e7162
--   Raw: ["pu'er", 'Peach Candy', 'Jasmine Milk Tea']
UPDATE brews SET
  flavors = '[{"base": "Pu''Er", "modifiers": []}, {"base": "Peach", "modifiers": ["Candy"]}, {"base": "Tea", "modifiers": ["Milky", "Jasmine"]}]'::jsonb,
  structure_tags = ARRAY['Body:Creamy']::text[],
  flavor_notes = ARRAY['Pu''Er', 'Peach (Candy)', 'Tea (Milky, Jasmine)']::text[]
WHERE id = '7aef16d6-2ea3-482f-ac52-d7b9e31e7162';

-- Brew 7b54b706-ddc5-4148-8777-237ad8ffd728
--   Raw: ['Chardonnay', 'Sparkling Red Grape', 'Blackberry']
UPDATE brews SET
  flavors = '[{"base": "Chardonnay", "modifiers": []}, {"base": "Grape", "modifiers": ["Carbonated"]}, {"base": "Blackberry", "modifiers": []}]'::jsonb,
  structure_tags = ARRAY['Acidity:Sparkling']::text[],
  flavor_notes = ARRAY['Chardonnay', 'Grape (Carbonated)', 'Blackberry']::text[]
WHERE id = '7b54b706-ddc5-4148-8777-237ad8ffd728';

-- Brew 7bbf561e-cc48-4c9d-bb3d-12e3a52836a9
--   Raw: ['Spring Honey', 'Honeyed Tea', 'Faint soft fruit', 'Floral']
UPDATE brews SET
  flavors = '[{"base": "Honey", "modifiers": ["Fresh"]}, {"base": "Tea", "modifiers": ["Sugary"]}, {"base": "Peach", "modifiers": ["Light"]}, {"base": "Honey", "modifiers": []}]'::jsonb,
  structure_tags = ARRAY['Overall:Tea-like']::text[],
  flavor_notes = ARRAY['Honey (Fresh)', 'Tea (Sugary)', 'Peach (Light)', 'Honey']::text[]
WHERE id = '7bbf561e-cc48-4c9d-bb3d-12e3a52836a9';

-- Brew 7e34244b-73ab-4076-88de-6ca33a507502
--   Raw: ['Nectarine', 'Grape', 'Lemongrass']
UPDATE brews SET
  flavors = '[{"base": "Nectarine", "modifiers": []}, {"base": "Grape", "modifiers": []}, {"base": "Lemongrass", "modifiers": []}]'::jsonb,
  structure_tags = ARRAY[]::text[],
  flavor_notes = ARRAY['Nectarine', 'Grape', 'Lemongrass']::text[]
WHERE id = '7e34244b-73ab-4076-88de-6ca33a507502';

-- Brew 874b021f-0a5a-48c1-b6ec-fc0416e6f607
--   Raw: ['Red Grape', 'Wine-like fruit', 'Floral tea', 'Herbal sweetness']
UPDATE brews SET
  flavors = '[{"base": "Grape", "modifiers": []}, {"base": "Grape", "modifiers": ["Fermented"]}, {"base": "Tea", "modifiers": ["Jasmine"]}, {"base": "Mint", "modifiers": []}]'::jsonb,
  structure_tags = ARRAY['Sweetness:High']::text[],
  flavor_notes = ARRAY['Grape', 'Grape (Fermented)', 'Tea (Jasmine)', 'Mint']::text[]
WHERE id = '874b021f-0a5a-48c1-b6ec-fc0416e6f607';

-- Brew 8b62b355-cbf7-4de2-9a2f-27b27337547f
--   Raw: ['Plum', 'White Nectarine', 'Lychee', 'Violet', 'Grape']
UPDATE brews SET
  flavors = '[{"base": "Plum", "modifiers": []}, {"base": "Nectarine", "modifiers": []}, {"base": "Lychee", "modifiers": []}, {"base": "Violet", "modifiers": []}, {"base": "Grape", "modifiers": []}]'::jsonb,
  structure_tags = ARRAY[]::text[],
  flavor_notes = ARRAY['Plum', 'Nectarine', 'Lychee', 'Violet', 'Grape']::text[]
WHERE id = '8b62b355-cbf7-4de2-9a2f-27b27337547f';

-- Brew 903a364a-2877-44dc-b60c-f1529d9ba6b4
--   Raw: ['Floral aromatics', 'Citrus clarity', 'Stone fruit sweetness', 'Refined tea-like structure', 'High-definition florality', 'Light, tea-like body', 'Long, composed finish', 'Lime', 'Mandarin']
--   Drops: ['Refined tea-like structure', 'Light, tea-like body', 'Long, composed finish']
UPDATE brews SET
  flavors = '[{"base": "Jasmine", "modifiers": ["Mixed Floral"]}, {"base": "Lemon", "modifiers": []}, {"base": "Peach", "modifiers": []}, {"base": "Jasmine", "modifiers": ["Mixed Floral"]}, {"base": "Lime", "modifiers": []}, {"base": "Mandarin", "modifiers": []}]'::jsonb,
  structure_tags = ARRAY['Clarity:Clean', 'Sweetness:High', 'Clarity:Refined', 'Overall:Tea-like', 'Clarity:Expressive', 'Body:Light', 'Finish:Lingering']::text[],
  flavor_notes = ARRAY['Jasmine (Mixed Floral)', 'Lemon', 'Peach', 'Jasmine (Mixed Floral)', 'Lime', 'Mandarin']::text[]
WHERE id = '903a364a-2877-44dc-b60c-f1529d9ba6b4';

-- Brew 94fb57ac-c04a-49ef-b281-97de4d0e9c46
--   Raw: ['Cup', 'Prune', 'Lemon', 'Caramel']
--   Drops: ['Cup']
UPDATE brews SET
  flavors = '[{"base": "Prune", "modifiers": []}, {"base": "Lemon", "modifiers": []}, {"base": "Caramel", "modifiers": []}]'::jsonb,
  structure_tags = ARRAY[]::text[],
  flavor_notes = ARRAY['Prune', 'Lemon', 'Caramel']::text[]
WHERE id = '94fb57ac-c04a-49ef-b281-97de4d0e9c46';

-- Brew 950728e4-6448-413d-b5e0-d974685a451d
--   Raw: ['Fresh Grape', 'Tangerine', 'White Grape', 'Pear', 'Fruity Tea']
UPDATE brews SET
  flavors = '[{"base": "Grape", "modifiers": ["Fresh"]}, {"base": "Tangerine", "modifiers": []}, {"base": "Grape", "modifiers": []}, {"base": "Pear", "modifiers": []}, {"base": "Tea", "modifiers": ["Mixed Fruit"]}]'::jsonb,
  structure_tags = ARRAY['Overall:Tea-like']::text[],
  flavor_notes = ARRAY['Grape (Fresh)', 'Tangerine', 'Grape', 'Pear', 'Tea (Mixed Fruit)']::text[]
WHERE id = '950728e4-6448-413d-b5e0-d974685a451d';

-- Brew a881c09f-d496-4d2d-a796-4f79f16862ad
--   Raw: ['Lychee', 'Floral', 'Milk Candy', 'Candied Floral']
UPDATE brews SET
  flavors = '[{"base": "Lychee", "modifiers": []}, {"base": "Jasmine", "modifiers": []}, {"base": "Milk Candy", "modifiers": []}, {"base": "Jasmine", "modifiers": ["Candied"]}]'::jsonb,
  structure_tags = ARRAY['Sweetness:High']::text[],
  flavor_notes = ARRAY['Lychee', 'Jasmine', 'Milk Candy', 'Jasmine (Candied)']::text[]
WHERE id = 'a881c09f-d496-4d2d-a796-4f79f16862ad';

-- Brew aac96c4d-7f8b-4455-84dd-9910fc247e41
--   Raw: ['Lavender', 'Plum', 'Vanilla']
UPDATE brews SET
  flavors = '[{"base": "Lavender", "modifiers": []}, {"base": "Plum", "modifiers": []}, {"base": "Vanilla", "modifiers": []}]'::jsonb,
  structure_tags = ARRAY[]::text[],
  flavor_notes = ARRAY['Lavender', 'Plum', 'Vanilla']::text[]
WHERE id = 'aac96c4d-7f8b-4455-84dd-9910fc247e41';

-- Brew b6975998-3ff2-4d3f-b1b5-137eb237f24d
--   Raw: ['Tropical Fruits', 'Grape', 'Sweet', 'Round']
--   Drops: ['Sweet', 'Round']
UPDATE brews SET
  flavors = '[{"base": "Mango", "modifiers": ["Mixed Fruit"]}, {"base": "Grape", "modifiers": []}]'::jsonb,
  structure_tags = ARRAY['Body:Silky', 'Sweetness:High', 'Sweetness:Moderate', 'Body:Round']::text[],
  flavor_notes = ARRAY['Mango (Mixed Fruit)', 'Grape']::text[]
WHERE id = 'b6975998-3ff2-4d3f-b1b5-137eb237f24d';

-- Brew ba1740c3-b57b-42e5-92f6-b6a804d2f96d
--   Raw: ['Watermelon Candy', 'Honeysuckle', 'Peach']
UPDATE brews SET
  flavors = '[{"base": "Watermelon", "modifiers": ["Candy"]}, {"base": "Honeysuckle", "modifiers": []}, {"base": "Peach", "modifiers": []}]'::jsonb,
  structure_tags = ARRAY['Sweetness:High']::text[],
  flavor_notes = ARRAY['Watermelon (Candy)', 'Honeysuckle', 'Peach']::text[]
WHERE id = 'ba1740c3-b57b-42e5-92f6-b6a804d2f96d';

-- Brew ba2caa10-cbc8-4b90-bb81-3782d8b8cabb
--   Raw: ['Hibiscus', 'Cherry', 'Grape', 'Cacao']
UPDATE brews SET
  flavors = '[{"base": "Hibiscus", "modifiers": []}, {"base": "Cherry", "modifiers": []}, {"base": "Grape", "modifiers": []}, {"base": "Cacao", "modifiers": []}]'::jsonb,
  structure_tags = ARRAY[]::text[],
  flavor_notes = ARRAY['Hibiscus', 'Cherry', 'Grape', 'Cacao']::text[]
WHERE id = 'ba2caa10-cbc8-4b90-bb81-3782d8b8cabb';

-- Brew c5632cef-fe0b-4526-b1a5-5ea29da24c5f
--   Raw: ['Plum', 'Peach', 'Soft Florals']
UPDATE brews SET
  flavors = '[{"base": "Plum", "modifiers": []}, {"base": "Peach", "modifiers": []}, {"base": "Jasmine", "modifiers": ["Light"]}]'::jsonb,
  structure_tags = ARRAY[]::text[],
  flavor_notes = ARRAY['Plum', 'Peach', 'Jasmine (Light)']::text[]
WHERE id = 'c5632cef-fe0b-4526-b1a5-5ea29da24c5f';

-- Brew c6069e30-3026-4040-bb9c-aed6ed0a7125
--   Raw: ['Cinnamon French Toast', 'Maple Syrup', 'Apple Jam']
UPDATE brews SET
  flavors = '[{"base": "Cinnamon", "modifiers": ["Cooked / Baked"]}, {"base": "Maple Syrup", "modifiers": []}, {"base": "Apple", "modifiers": ["Jam / Compote"]}]'::jsonb,
  structure_tags = ARRAY[]::text[],
  flavor_notes = ARRAY['Cinnamon (Cooked / Baked)', 'Maple Syrup', 'Apple (Jam / Compote)']::text[]
WHERE id = 'c6069e30-3026-4040-bb9c-aed6ed0a7125';

-- Brew c61e2b66-5e82-457a-b85d-b7d7d58d15b6
--   Raw: ['Jasmine', 'Bergamot']
UPDATE brews SET
  flavors = '[{"base": "Jasmine", "modifiers": []}, {"base": "Bergamot", "modifiers": []}]'::jsonb,
  structure_tags = ARRAY[]::text[],
  flavor_notes = ARRAY['Jasmine', 'Bergamot']::text[]
WHERE id = 'c61e2b66-5e82-457a-b85d-b7d7d58d15b6';

-- Brew c66302a0-979e-4a41-9536-6df89c2fa4d2
--   Raw: ['Floral', 'Bright', 'Silky', 'Lavender', 'Lemon Zest', 'Subtle sweetness']
--   Drops: ['Bright', 'Silky', 'Subtle sweetness']
UPDATE brews SET
  flavors = '[{"base": "Lavender", "modifiers": []}, {"base": "Lavender", "modifiers": []}, {"base": "Lemon", "modifiers": ["Zest"]}]'::jsonb,
  structure_tags = ARRAY['Clarity:Subtle', 'Acidity:Bright', 'Body:Silky']::text[],
  flavor_notes = ARRAY['Lavender', 'Lavender', 'Lemon (Zest)']::text[]
WHERE id = 'c66302a0-979e-4a41-9536-6df89c2fa4d2';

-- Brew c6819156-570e-4e6f-9a1e-d7c643a02a87
--   Raw: ['Meyer Lemon', 'Earl Grey Tea', 'Citrus']
UPDATE brews SET
  flavors = '[{"base": "Lemon", "modifiers": []}, {"base": "Earl Grey", "modifiers": []}, {"base": "Lemon", "modifiers": []}]'::jsonb,
  structure_tags = ARRAY['Acidity:Bright']::text[],
  flavor_notes = ARRAY['Lemon', 'Earl Grey', 'Lemon']::text[]
WHERE id = 'c6819156-570e-4e6f-9a1e-d7c643a02a87';

-- Brew c68841ad-b9da-4e9e-8954-6959ae460f01
--   Raw: ['Jasmine', 'Lavender', 'White Grape', 'Green Tea']
UPDATE brews SET
  flavors = '[{"base": "Jasmine", "modifiers": []}, {"base": "Lavender", "modifiers": []}, {"base": "Grape", "modifiers": []}, {"base": "Green Tea", "modifiers": []}]'::jsonb,
  structure_tags = ARRAY[]::text[],
  flavor_notes = ARRAY['Jasmine', 'Lavender', 'Grape', 'Green Tea']::text[]
WHERE id = 'c68841ad-b9da-4e9e-8954-6959ae460f01';

-- Brew c8a5ce46-3fa2-46fa-8ead-1e2f8a3d68ad
--   Raw: ['Cherry', 'Grape', 'Floral sweetness', 'Tea-like finish']
--   Drops: ['Tea-like finish']
UPDATE brews SET
  flavors = '[{"base": "Cherry", "modifiers": []}, {"base": "Grape", "modifiers": []}, {"base": "Jasmine", "modifiers": ["Mixed Floral"]}]'::jsonb,
  structure_tags = ARRAY['Sweetness:High', 'Overall:Tea-like']::text[],
  flavor_notes = ARRAY['Cherry', 'Grape', 'Jasmine (Mixed Floral)']::text[]
WHERE id = 'c8a5ce46-3fa2-46fa-8ead-1e2f8a3d68ad';

-- Brew cb4c9bbc-018c-437f-8648-f74b05098b04
--   Raw: ['Peach Tea', 'Passion Fruit', 'Hard candy sweetness']
UPDATE brews SET
  flavors = '[{"base": "Tea", "modifiers": ["Peach"]}, {"base": "Passion Fruit", "modifiers": []}, {"base": "Sugar", "modifiers": ["Candy"]}]'::jsonb,
  structure_tags = ARRAY['Overall:Tea-like', 'Sweetness:High']::text[],
  flavor_notes = ARRAY['Tea (Peach)', 'Passion Fruit', 'Sugar (Candy)']::text[]
WHERE id = 'cb4c9bbc-018c-437f-8648-f74b05098b04';

-- Brew d14fc3e9-f0a0-41b0-b4e3-32721b3c5040
--   Raw: ['Cherry Blossom', 'Lychee', 'Blackberry', 'Milk Candy']
UPDATE brews SET
  flavors = '[{"base": "Cherry Blossom", "modifiers": []}, {"base": "Lychee", "modifiers": []}, {"base": "Blackberry", "modifiers": []}, {"base": "Milk Candy", "modifiers": []}]'::jsonb,
  structure_tags = ARRAY[]::text[],
  flavor_notes = ARRAY['Cherry Blossom', 'Lychee', 'Blackberry', 'Milk Candy']::text[]
WHERE id = 'd14fc3e9-f0a0-41b0-b4e3-32721b3c5040';

-- Brew d6c43257-e09f-44c5-aa88-ebbc262037c3
--   Raw: ['Savory-sweet tomato', 'Tomato Leaf', 'Black Tea', 'Red Apple', 'Herbal florality']
UPDATE brews SET
  flavors = '[{"base": "Tomato", "modifiers": ["Ripe"]}, {"base": "Tomato", "modifiers": ["Botanical"]}, {"base": "Black Tea", "modifiers": []}, {"base": "Apple", "modifiers": []}, {"base": "Jasmine", "modifiers": ["Herbal"]}]'::jsonb,
  structure_tags = ARRAY[]::text[],
  flavor_notes = ARRAY['Tomato (Ripe)', 'Tomato (Botanical)', 'Black Tea', 'Apple', 'Jasmine (Herbal)']::text[]
WHERE id = 'd6c43257-e09f-44c5-aa88-ebbc262037c3';

-- Brew dcad1ffa-f2bc-443c-9cd1-f18e27fe1b1f
--   Raw: ['Plum', 'Passion Fruit', 'Floral', 'Candied Sweetness']
UPDATE brews SET
  flavors = '[{"base": "Plum", "modifiers": []}, {"base": "Passion Fruit", "modifiers": []}, {"base": "Jasmine", "modifiers": []}, {"base": "Plum", "modifiers": ["Candied"]}]'::jsonb,
  structure_tags = ARRAY['Sweetness:High']::text[],
  flavor_notes = ARRAY['Plum', 'Passion Fruit', 'Jasmine', 'Plum (Candied)']::text[]
WHERE id = 'dcad1ffa-f2bc-443c-9cd1-f18e27fe1b1f';

-- Brew df2dbc7c-d3f9-4aa3-b4df-e210b0f31b02
--   Raw: ['Apple Cider', 'Pear', 'Vanilla Bean']
UPDATE brews SET
  flavors = '[{"base": "Apple", "modifiers": ["Fermented"]}, {"base": "Pear", "modifiers": []}, {"base": "Vanilla", "modifiers": []}]'::jsonb,
  structure_tags = ARRAY[]::text[],
  flavor_notes = ARRAY['Apple (Fermented)', 'Pear', 'Vanilla']::text[]
WHERE id = 'df2dbc7c-d3f9-4aa3-b4df-e210b0f31b02';

-- Brew e7a82e0a-7c9c-41cd-b5da-9d5b9589361e
--   Raw: ['Raspberry', 'Ginger Flower', 'Tropical']
UPDATE brews SET
  flavors = '[{"base": "Raspberry", "modifiers": []}, {"base": "Ginger Flower", "modifiers": []}, {"base": "Mango", "modifiers": ["Candied"]}]'::jsonb,
  structure_tags = ARRAY['Acidity:Juicy']::text[],
  flavor_notes = ARRAY['Raspberry', 'Ginger Flower', 'Mango (Candied)']::text[]
WHERE id = 'e7a82e0a-7c9c-41cd-b5da-9d5b9589361e';

-- Brew ecad5cba-4491-4868-bcb3-463d39642636
--   Raw: ['Red Grape', 'Stone Fruit', 'Floral sweetness', 'Tea-like undertone']
--   Drops: ['Tea-like undertone']
UPDATE brews SET
  flavors = '[{"base": "Grape", "modifiers": []}, {"base": "Pineapple", "modifiers": ["Fresh"]}, {"base": "Jasmine", "modifiers": ["Mixed Floral"]}]'::jsonb,
  structure_tags = ARRAY['Finish:Clean', 'Sweetness:High', 'Overall:Tea-like']::text[],
  flavor_notes = ARRAY['Grape', 'Pineapple (Fresh)', 'Jasmine (Mixed Floral)']::text[]
WHERE id = 'ecad5cba-4491-4868-bcb3-463d39642636';

-- Brew fd2f0a72-83e9-4d6f-ad9c-4aca75287a98
--   Raw: ['Pomelo', 'Apricot', 'Pear', 'Yellow Florals']
UPDATE brews SET
  flavors = '[{"base": "Pomelo", "modifiers": []}, {"base": "Apricot", "modifiers": []}, {"base": "Pear", "modifiers": []}, {"base": "Jasmine", "modifiers": ["Mixed Floral"]}]'::jsonb,
  structure_tags = ARRAY[]::text[],
  flavor_notes = ARRAY['Pomelo', 'Apricot', 'Pear', 'Jasmine (Mixed Floral)']::text[]
WHERE id = 'fd2f0a72-83e9-4d6f-ad9c-4aca75287a98';

-- Brew fd346045-b3ac-4ee2-b9e8-8dbb682e448e
--   Raw: ['Candied Strawberry', 'Sweet Fruit', 'Earl Grey']
UPDATE brews SET
  flavors = '[{"base": "Strawberry", "modifiers": ["Candied"]}, {"base": "Strawberry", "modifiers": ["Candied"]}, {"base": "Earl Grey", "modifiers": []}]'::jsonb,
  structure_tags = ARRAY['Sweetness:High']::text[],
  flavor_notes = ARRAY['Strawberry (Candied)', 'Strawberry (Candied)', 'Earl Grey']::text[]
WHERE id = 'fd346045-b3ac-4ee2-b9e8-8dbb682e448e';

-- Brew fd7c6ec1-bb13-4ec3-b167-c665547a57f6
--   Raw: ['Floral aromatics', 'Tropical fruit sweetness', 'Fermentation-driven complexity', 'Clean but expressive finish']
--   Drops: ['Fermentation-driven complexity', 'Clean but expressive finish']
UPDATE brews SET
  flavors = '[{"base": "Jasmine", "modifiers": ["Mixed Floral"]}, {"base": "Mango", "modifiers": ["Mixed Fruit"]}]'::jsonb,
  structure_tags = ARRAY['Sweetness:High', 'Clarity:Complex', 'Finish:Clean', 'Clarity:Expressive']::text[],
  flavor_notes = ARRAY['Jasmine (Mixed Floral)', 'Mango (Mixed Fruit)']::text[]
WHERE id = 'fd7c6ec1-bb13-4ec3-b167-c665547a57f6';

-- Brew ffc53a3b-0931-43af-a2c9-1ed4dfd5545f
--   Raw: ['Red Apple', 'Vanilla Cream', 'Rose']
UPDATE brews SET
  flavors = '[{"base": "Apple", "modifiers": []}, {"base": "Vanilla", "modifiers": ["Creamy"]}, {"base": "Rose", "modifiers": []}]'::jsonb,
  structure_tags = ARRAY[]::text[],
  flavor_notes = ARRAY['Apple', 'Vanilla (Creamy)', 'Rose']::text[]
WHERE id = 'ffc53a3b-0931-43af-a2c9-1ed4dfd5545f';

COMMIT;