-- 025_process_registry_decomposition
--
-- Process sprint 1e.2 of the Reference Taxonomies umbrella. Follow-through
-- to 1e.1 (lib/process-registry.ts composable taxonomy structural port,
-- shipped 2026-04-23, PR #44). Mirrors the Variety 1a.2 / Region 1d.2 shape:
-- a single migration that both ALTERs schema and batch-UPDATEs existing rows
-- with the canonical structured decomposition.
--
-- Adds 8 structured columns to brews (base_process + subprocess + 4 modifier
-- arrays + decaf_modifier + signature_method), populates them from
-- LEGACY_DECOMPOSITIONS in lib/process-registry.ts for all 55 existing brew
-- rows, then locks base_process with NOT NULL + CHECK + index.
--
-- The 4 TODO(1e.2) interpretive cells from 1e.1's registry are resolved here
-- per pre-sprint DB audit evidence:
--   * Anaerobic Honey (2 brews, Finca La Reserva Gesha) - subprocess =
--     Generic Honey. Color tier unspecified in brew rows; default per sprint
--     brief convention for untiered honey.
--   * Moonshadow Washed (1 brew, Alo Tamiru Tadesse) - full mis-label
--     correction. Coffee name is "Alo Village - Tamiru Tadesse - Washed
--     74158" (no Moonshadow in the name); flavor notes Meyer Lemon / Earl
--     Grey / Citrus read as clean washed. This is plain Washed mis-typed as
--     Moonshadow in the process field, not a Moonshadow lot at all. Resolves
--     as base:Washed, no signature, no drying modifiers.
--   * Double Anaerobic Thermal Shock (1 brew, El Paraiso Lychee) - El
--     Paraiso washed thermal-shock protocol with yeast inoculation.
--     key_takeaways: "double anaerobic thermal shock with yeast inoculation"
--     + "kept the cup clean". Resolves as base:Washed, fermentation:
--     [Double Anaerobic, Thermal Shock, Yeast Inoculated].
--   * Double Fermentation Thermal Shock (1 brew, Letty Bermudez) - same
--     El Paraiso house protocol as Double Anaerobic Thermal Shock. Chris's
--     key_takeaways: "thermal shock wash process (Finca El Paraiso house
--     method)" + "yeast-inoculated washed Gesha". Same structured
--     decomposition. Post-migration both decompose identically (correct -
--     they are the same operational process under two English labels;
--     1e.4 redesign merges into one faceted tile with 2 brews).
--
-- brews.process text column is NOT rewritten (zero UI change discipline).
-- /processes index + /brews filters render from the legacy string unchanged
-- through 1e.2 and 1e.3; /processes redesign in 1e.4 is when brews.process
-- gets dropped entirely.
--
-- Expected post-migration base_process distribution (55 brews total):
--   Washed: 31 | Natural: 19 | Honey: 5 | Wet-hulled: 0

BEGIN;

-- ---------------------------------------------------------------------------
-- Schema: 8 new columns on brews
-- ---------------------------------------------------------------------------

ALTER TABLE brews
  ADD COLUMN base_process text,
  ADD COLUMN subprocess text,
  ADD COLUMN fermentation_modifiers text[] NOT NULL DEFAULT '{}',
  ADD COLUMN drying_modifiers text[] NOT NULL DEFAULT '{}',
  ADD COLUMN intervention_modifiers text[] NOT NULL DEFAULT '{}',
  ADD COLUMN experimental_modifiers text[] NOT NULL DEFAULT '{}',
  ADD COLUMN decaf_modifier text,
  ADD COLUMN signature_method text;

-- ---------------------------------------------------------------------------
-- Data: 20 UPDATEs populating structured columns from LEGACY_DECOMPOSITIONS
-- Ordered by brew count descending (matches pre-sprint audit output).
-- Each UPDATE sets only the non-default columns for clarity - array columns
-- default to '{}', scalar columns default to NULL.
-- ---------------------------------------------------------------------------

-- 1 / 20 - Washed (20 brews)
UPDATE brews SET base_process = 'Washed', updated_at = NOW()
WHERE process = 'Washed';

-- 2 / 20 - Natural (12 brews)
UPDATE brews SET base_process = 'Natural', updated_at = NOW()
WHERE process = 'Natural';

-- 3 / 20 - Anaerobic Washed (3 brews)
UPDATE brews SET
  base_process = 'Washed',
  fermentation_modifiers = ARRAY['Anaerobic']::text[],
  updated_at = NOW()
WHERE process = 'Anaerobic Washed';

-- 4 / 20 - Anaerobic Honey (2 brews) - TODO(1e.2) resolved: Generic Honey
UPDATE brews SET
  base_process = 'Honey',
  subprocess = 'Generic Honey',
  fermentation_modifiers = ARRAY['Anaerobic']::text[],
  updated_at = NOW()
WHERE process = 'Anaerobic Honey';

-- 5 / 20 - Anaerobic Natural (2 brews)
UPDATE brews SET
  base_process = 'Natural',
  fermentation_modifiers = ARRAY['Anaerobic']::text[],
  updated_at = NOW()
WHERE process = 'Anaerobic Natural';

-- 6 / 20 - White Honey (2 brews)
UPDATE brews SET
  base_process = 'Honey',
  subprocess = 'White Honey',
  updated_at = NOW()
WHERE process = 'White Honey';

-- 7 / 20 - Anoxic Natural (1 brew)
UPDATE brews SET
  base_process = 'Natural',
  fermentation_modifiers = ARRAY['Anaerobic']::text[],
  updated_at = NOW()
WHERE process = 'Anoxic Natural';

-- 8 / 20 - ASD Natural (1 brew)
UPDATE brews SET
  base_process = 'Natural',
  fermentation_modifiers = ARRAY['Anaerobic']::text[],
  drying_modifiers = ARRAY['Slow Dry']::text[],
  updated_at = NOW()
WHERE process = 'ASD Natural';

-- 9 / 20 - Cold Fermented Washed (1 brew)
UPDATE brews SET
  base_process = 'Washed',
  fermentation_modifiers = ARRAY['Cold Fermentation']::text[],
  updated_at = NOW()
WHERE process = 'Cold Fermented Washed';

-- 10 / 20 - Dark Room Dry Natural (1 brew)
UPDATE brews SET
  base_process = 'Natural',
  drying_modifiers = ARRAY['Dark Room Dried']::text[],
  updated_at = NOW()
WHERE process = 'Dark Room Dry Natural';

-- 11 / 20 - Double Anaerobic Thermal Shock (1 brew) - TODO(1e.2) resolved:
-- El Paraiso Lychee washed thermal-shock protocol with yeast inoculation.
UPDATE brews SET
  base_process = 'Washed',
  fermentation_modifiers = ARRAY['Double Anaerobic', 'Thermal Shock', 'Yeast Inoculated']::text[],
  updated_at = NOW()
WHERE process = 'Double Anaerobic Thermal Shock';

-- 12 / 20 - Double Fermentation Thermal Shock (1 brew) - TODO(1e.2) resolved:
-- Same El Paraiso house protocol as row 11.
UPDATE brews SET
  base_process = 'Washed',
  fermentation_modifiers = ARRAY['Double Anaerobic', 'Thermal Shock', 'Yeast Inoculated']::text[],
  updated_at = NOW()
WHERE process = 'Double Fermentation Thermal Shock';

-- 13 / 20 - Honey (1 brew) - untiered honey, default to Generic
UPDATE brews SET
  base_process = 'Honey',
  subprocess = 'Generic Honey',
  updated_at = NOW()
WHERE process = 'Honey';

-- 14 / 20 - Moonshadow Washed (1 brew) - TODO(1e.2) resolved: plain Washed
-- mis-typed as Moonshadow in the process field (full mis-label correction).
UPDATE brews SET base_process = 'Washed', updated_at = NOW()
WHERE process = 'Moonshadow Washed';

-- 15 / 20 - Tamarind + Red Fruit Co-ferment Washed (1 brew)
UPDATE brews SET
  base_process = 'Washed',
  fermentation_modifiers = ARRAY['Yeast Inoculated']::text[],
  intervention_modifiers = ARRAY['Fruit Co-ferment']::text[],
  updated_at = NOW()
WHERE process = 'Tamarind + Red Fruit Co-ferment Washed';

-- 16 / 20 - TyOxidator (1 brew)
UPDATE brews SET
  base_process = 'Washed',
  fermentation_modifiers = ARRAY['Aerobic']::text[],
  signature_method = 'TyOxidator',
  updated_at = NOW()
WHERE process = 'TyOxidator';

-- 17 / 20 - Washed Cascara Infused (1 brew)
UPDATE brews SET
  base_process = 'Washed',
  intervention_modifiers = ARRAY['Cascara Infusion']::text[],
  updated_at = NOW()
WHERE process = 'Washed Cascara Infused';

-- 18 / 20 - Washed Sakura Co-ferment (1 brew)
UPDATE brews SET
  base_process = 'Washed',
  intervention_modifiers = ARRAY['Floral Co-ferment']::text[],
  updated_at = NOW()
WHERE process = 'Washed Sakura Co-ferment';

-- 19 / 20 - Yeast Anaerobic Natural (1 brew)
UPDATE brews SET
  base_process = 'Natural',
  fermentation_modifiers = ARRAY['Anaerobic', 'Yeast Inoculated']::text[],
  updated_at = NOW()
WHERE process = 'Yeast Anaerobic Natural';

-- 20 / 20 - Yeast Inoculated Natural (1 brew)
UPDATE brews SET
  base_process = 'Natural',
  fermentation_modifiers = ARRAY['Yeast Inoculated']::text[],
  updated_at = NOW()
WHERE process = 'Yeast Inoculated Natural';

-- ---------------------------------------------------------------------------
-- Constraints: base_process NOT NULL + CHECK + index
-- ---------------------------------------------------------------------------

ALTER TABLE brews ALTER COLUMN base_process SET NOT NULL;

ALTER TABLE brews
  ADD CONSTRAINT brews_base_process_valid
  CHECK (base_process IN ('Washed', 'Honey', 'Natural', 'Wet-hulled'));

CREATE INDEX brews_base_process_idx ON brews(base_process);

COMMIT;
