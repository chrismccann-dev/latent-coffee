-- Track 2 PR4 — cupping data + is_reference reset + coffee_name consolidation.
-- Surfaced by docs/audits/track-2-2026-05-08.md dim 7 (roast → cupping pair
-- completeness) plus Chris's clarification that only the ULTIMATE reference
-- roast per green-bean lot should carry is_reference=true. Per-experiment-set
-- "winners" were being mis-flagged true and tripping the audit's
-- "is_reference=true → always Bucket B" rule.
--
-- Three coordinated changes:
--   1. Reset is_reference flags on the 12 roasts that were mis-flagged true
--      (per-experiment-set winners). Set is_reference=true on the 2 that
--      were the actual lot-level references but accidentally false (52, 88).
--      The 2 already-correct ones (94 + 133) are no-ops here.
--   2. Consolidate the 3 "Guatemala El Socorro - Java" coffee_name variants
--      across roasts + brews + green_beans into the canonical form
--      "Guatemala - El Socorro - Java variety".
--   3. Insert the missing cupping rows for the 3 outstanding ultimate-reference
--      roasts (52 / 88 / 94). Two per roast — the legacy two-step format
--      (immersion Cupping at day 3-4 + Pourover at day 7-9). Going forward
--      Chris only does the day-7 Pourover gate, so the canonical eval_method
--      values stay 'Cupping' + 'Pourover' (matching the dominant production
--      values 11 + 46). Brew-method specifics (Spoon cupping, XBLOOM pourover,
--      Comparative pourover) and ground_agtron readings (blank) don't map to
--      canonical columns and are dropped per Chris's "fit into current fields,
--      don't preserve legacy that doesn't fit" framing.

-- ---------------------------------------------------------------------------
-- 1. Reset is_reference flags
-- ---------------------------------------------------------------------------

-- Flip false: experiment-set winners that should never have been is_reference=true.
UPDATE roasts SET is_reference = false
  WHERE user_id = 'bb339172-8bb4-4483-a8ca-1078abbc2bfb'
    AND batch_id IN ('33', '34', '60', '68', '75', '31', '64', '78', '46', '53', '72')
    AND coffee_name IN (
      'Guatemala Libertad - Aurelio del Cerro',
      'Guatemala El Socorro - Java Variety',
      'Guatemala El Socorro - Java',
      'Guatemala - El Socorro - Java variety',
      'Gesha Village - Oma Lot 25/035'
    );

-- Flip true: the ultimate references that were accidentally false.
UPDATE roasts SET is_reference = true
  WHERE user_id = 'bb339172-8bb4-4483-a8ca-1078abbc2bfb'
    AND batch_id IN ('52', '88')
    AND coffee_name IN (
      'Gesha Village - Oma Lot 25/035',
      'Guatemala El Socorro - Java Variety'
    );

-- ---------------------------------------------------------------------------
-- 2. Consolidate El Socorro coffee_name variants
-- ---------------------------------------------------------------------------

UPDATE roasts SET coffee_name = 'Guatemala - El Socorro - Java variety'
  WHERE user_id = 'bb339172-8bb4-4483-a8ca-1078abbc2bfb'
    AND coffee_name IN (
      'Guatemala El Socorro - Java Variety',
      'Guatemala El Socorro - Java'
    );

UPDATE green_beans SET name = 'Guatemala - El Socorro - Java variety'
  WHERE user_id = 'bb339172-8bb4-4483-a8ca-1078abbc2bfb'
    AND name = 'Guatemala El Socorro - Java Variety';

UPDATE brews SET coffee_name = 'Guatemala - El Socorro - Java variety (Batch #88)'
  WHERE user_id = 'bb339172-8bb4-4483-a8ca-1078abbc2bfb'
    AND coffee_name = 'Guatemala El Socorro - Java Variety (Batch #88)';

-- ---------------------------------------------------------------------------
-- 3. Insert 6 cupping rows for the 3 ultimate-reference roasts.
-- ---------------------------------------------------------------------------
-- Hardcoded roast_ids resolved at audit time; each is the unique row for that
-- (user_id, batch_id, coffee_name) tuple. ON CONFLICT DO NOTHING guards
-- against re-application via the (user_id, roast_id, cupping_date,
-- eval_method, recipe_variant) NULLS NOT DISTINCT unique constraint added in
-- migration 041.

-- Batch 52 — Gesha Village - Oma Lot 25/035 (roast_id e5a635f0-9734-49e1-a393-85141475c6f7)
INSERT INTO cuppings
  (user_id, roast_id, cupping_date, rest_days, eval_method, aroma, flavor, acidity, sweetness, body, finish, overall)
VALUES
  ('bb339172-8bb4-4483-a8ca-1078abbc2bfb', 'e5a635f0-9734-49e1-a393-85141475c6f7', '2026-02-03', 4, 'Cupping',
   'Pleasant florals with nutty undertone',
   'Floral green apple, tea-like',
   'Green apple, moves forward as it cools',
   'Moderate',
   'Light, tea-like',
   'Clean, slightly flat',
   'Improves significantly as it cools; aromatic-leaning but slightly hollow'),
  ('bb339172-8bb4-4483-a8ca-1078abbc2bfb', 'e5a635f0-9734-49e1-a393-85141475c6f7', '2026-02-07', 8, 'Pourover',
   'Very floral and fruity; faint medicinal/cheese-like note',
   'Floral-forward with citrus hints; dark black tea core',
   'Floral-citrus, most present on attack',
   'Moderate',
   'Medium; dark black tea character',
   'Clean with slight sharpness mid-finish (oversteep tea note)',
   'Most expressive Gesha character; best hot and still coherent as it cools; clear reference candidate')
ON CONFLICT DO NOTHING;

-- Batch 88 — Guatemala - El Socorro - Java variety (roast_id 5bf98a95-977d-4600-9efd-34c8bccd429d)
INSERT INTO cuppings
  (user_id, roast_id, cupping_date, rest_days, eval_method, aroma, flavor, acidity, sweetness, body, finish, overall)
VALUES
  ('bb339172-8bb4-4483-a8ca-1078abbc2bfb', '5bf98a95-977d-4600-9efd-34c8bccd429d', '2026-03-11', 3, 'Cupping',
   'Light citrus and acidity',
   'Orange peel, slightly roasty, fuller than others',
   'Medium',
   'Light-medium',
   'Light-medium',
   'Slight dryness and mild bitterness',
   'Most expressive citrus when hot but develops some dry bitterness as it cools. Slightly heavier body than 86 but less clean. (Spoon cupping)'),
  ('bb339172-8bb4-4483-a8ca-1078abbc2bfb', '5bf98a95-977d-4600-9efd-34c8bccd429d', '2026-03-11', 3, 'Pourover',
   'Mild vegetal note but cleaner than 86',
   'Fuller cup with subtle orange/citrus undertone',
   'Medium',
   'Medium',
   'Light–medium',
   'Slight dryness but more integrated',
   'More complete cup than 86. Greater internal development and sweetness, though citrus expression becomes muted in pour-over relative to immersion cupping. Preferred for brewing. (XBLOOM pourover)')
ON CONFLICT DO NOTHING;

-- Batch 94 — Guatemala Libertad - Aurelio del Cerro (roast_id 062277ec-9a26-4469-b5eb-d542c23ef33e)
INSERT INTO cuppings
  (user_id, roast_id, cupping_date, rest_days, eval_method, aroma, flavor, acidity, sweetness, body, finish, overall)
VALUES
  ('bb339172-8bb4-4483-a8ca-1078abbc2bfb', '062277ec-9a26-4469-b5eb-d542c23ef33e', '2026-03-16', 3, 'Cupping',
   'Citrus and tea-like, similar to Batch 93',
   'Sweet citrus with softer orange character',
   'High but slightly softer than Batch 93',
   'Good sweetness with balanced profile',
   'Medium',
   'Clean and smooth',
   'Very similar to Batch 93 but slightly more balanced and less bright. The orange-like acidity is present but less vivid than 93. Still a strong roast, though slightly less expressive.'),
  ('bb339172-8bb4-4483-a8ca-1078abbc2bfb', '062277ec-9a26-4469-b5eb-d542c23ef33e', '2026-03-22', 9, 'Pourover',
   'More developed, less off-aroma',
   'Brighter, slightly sweet, mild fruit, somewhat generic',
   'Moderate; cleaner than 93 but not highly expressive',
   'Moderate',
   'Medium-heavy, slightly roast-leaning',
   'Slightly flat, mild roast tone',
   'Drinkable but not expressive; more stable but lacks clarity and lift. (Comparative pourover cupping)')
ON CONFLICT DO NOTHING;
