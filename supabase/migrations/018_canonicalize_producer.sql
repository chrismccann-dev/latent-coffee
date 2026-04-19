-- Migration 018 — Canonicalize brews.producer
--
-- Scope (per sprint plan):
--   Part 1: collapse 2 duplicate clusters (Pepe Jijon ×3, Peterson Family ×2)
--   Part 2: verbose / parenthetical cleanup (5 rows)
--
-- Not in this migration (by design):
--   - Alo Coffee / Alo Village — migration 011 kept these split per each
--     roaster's own listing (Shoebox=Alo Coffee, Sey=Alo Village). Preserved.
--   - Rio Cristal - Kotowa / Direct with Kotowa — different lots, the
--     "Direct with" phrasing carries sourcing context. Preserved.
--   - Roaster column — all 21 distinct values are already canonical
--     (cleaned in migrations 011 and 014).
--
-- Post-apply distinct producer count: 52 → 49.

BEGIN;

-- =====================================================================
-- Part 1: Duplicate cluster collapse
-- =====================================================================

-- Pepe Jijon cluster → "Pepe Jijon, Finca Soledad" (matches dominant
-- "Person, Farm" pattern used across the rest of the corpus).
UPDATE brews SET producer = 'Pepe Jijon, Finca Soledad'
  WHERE producer IN ('Pepe Jijon', 'Pepe Jijon / Finca Soledad');

-- Peterson Family cluster → "The Peterson Family" (matches "The Holguin Family").
UPDATE brews SET producer = 'The Peterson Family'
  WHERE producer = 'Peterson family';

-- =====================================================================
-- Part 2: Verbose / parenthetical cleanup
-- =====================================================================

UPDATE brews SET producer = 'Abel Dominguez, Blooms Coffee'
  WHERE producer = 'Abel Dominguez; Partnered with Blooms Coffee (export / quality partner)';

UPDATE brews SET producer = 'Buncho, Daye Bensa'
  WHERE producer = 'Buncho (daye bensa coffee)';

UPDATE brews SET producer = 'Cafe Granja la Esperanza'
  WHERE producer = 'Cafe Granja la Esperanza (CGLE)';

UPDATE brews SET producer = 'Julio Madrid, La Riviera'
  WHERE producer = 'Julio Madrid (La Riviera farm)';

UPDATE brews SET producer = 'Miguel Estela, El Morito Producer''s Association'
  WHERE producer = 'Miguel Estela, organized with El Morito Producer''s Association';

COMMIT;
