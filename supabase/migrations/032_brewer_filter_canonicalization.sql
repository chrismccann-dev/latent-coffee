-- Sprint 1f: Brewer + filter canonicalization
--
-- Resolves DB drift on brews.brewer + brews.filter to the canonical names
-- in lib/brewer-registry.ts + lib/filter-registry.ts. Two-pass migration:
--
--   Pass 1: brewer canonicalize (material qualifiers strip, Orea v3/v4
--           defaults to v4, prefix junk strips, case normalizes).
--   Pass 2: filter canonicalize, using post-pass-1 canonical brewer values
--           for the brewer-aware Sibarist FAST family (same DB string maps
--           to FLAT FAST / CONE FAST / UFO FAST depending on brewer).
--
-- Material axis (Glass / Porcelain / Ceramic) is intentionally dropped —
-- not in the new taxonomy. Sibarist size variants (S/M) also strip.
-- "Espro Bloom" in legacy DB strings was a misnaming of xBloom Premium
-- Paper Filters per Chris's plan-mode confirm; aliased on canonicalize.
--
-- CAFEC Abaca Plus → CAFEC Abaca Cup 1 Cone Paper Filter (only other
-- Abaca+ paper Chris owns; Cup 1 is conical and Orea is flat so this was
-- a geometry misfit at the time of brew — Chris-acknowledged).
--
-- Hario V60 paper drift defaults to "Hario V60 Paper Filter 01 (Tabbed)"
-- per Chris's plan-mode confirm.

BEGIN;

-- ---------------------------------------------------------------------------
-- Pass 1: brewer canonicalize
-- ---------------------------------------------------------------------------

-- Orea v3/v4 ambiguity: 14 brews → "Orea v4" (Chris default; v4 is newer).
UPDATE brews SET brewer = 'Orea v4' WHERE brewer = 'Orea Glass';
UPDATE brews SET brewer = 'Orea v4' WHERE brewer = 'OREA Glass';
UPDATE brews SET brewer = 'Orea v4' WHERE brewer = 'Orea Glass (open bottom, no negotiator)';
UPDATE brews SET brewer = 'Orea v4' WHERE brewer = 'Orea (glass or porcelain)';
UPDATE brews SET brewer = 'Orea v4' WHERE brewer = 'Orea (porcelain or glass)';
UPDATE brews SET brewer = 'Orea v4' WHERE brewer = 'Orea Porcelain';
UPDATE brews SET brewer = 'Orea v4' WHERE brewer = 'Orea porcelain';

-- April family — material drops, single canonical.
UPDATE brews SET brewer = 'April' WHERE brewer = 'April Glass';
UPDATE brews SET brewer = 'April' WHERE brewer = 'April glass';
UPDATE brews SET brewer = 'April' WHERE brewer = 'April Brewer (glass)';
UPDATE brews SET brewer = 'April' WHERE brewer = 'April Glass Brewer';
UPDATE brews SET brewer = 'April' WHERE brewer = 'April Brewer';
UPDATE brews SET brewer = 'April' WHERE brewer = 'April Brewer Glass';

-- Hario V60 — material drops.
UPDATE brews SET brewer = 'Hario V60' WHERE brewer = 'Hario V60 (glass)';
UPDATE brews SET brewer = 'Hario V60' WHERE brewer = 'Hario V60 Glass';
UPDATE brews SET brewer = 'Hario V60' WHERE brewer = 'Hario V60 glass';

-- Hario Switch — material drops.
UPDATE brews SET brewer = 'Hario Switch' WHERE brewer = 'Hario Switch (glass)';

-- UFO — material drops, prefix junk strips.
UPDATE brews SET brewer = 'UFO' WHERE brewer = 'UFO Ceramic';
UPDATE brews SET brewer = 'UFO' WHERE brewer = 'UFO Ceramic Dripper';
UPDATE brews SET brewer = 'UFO' WHERE brewer = 'Brewer: UFO Ceramic';

-- Kalita Wave Tsubame 155 → Kalita Tsubame.
UPDATE brews SET brewer = 'Kalita Tsubame' WHERE brewer = 'Kalita Wave Tsubame 155';

-- SWORKS case + canonical.
UPDATE brews SET brewer = 'Sworks Bottomless' WHERE brewer = 'SWORKS Bottomless Dripper';
UPDATE brews SET brewer = 'Sworks Bottomless' WHERE brewer = 'Sworks Bottomless Dripper';

-- xBloom — descriptor strips.
UPDATE brews SET brewer = 'xBloom' WHERE brewer = 'xBloom (flat-bottom percolation)';


-- ---------------------------------------------------------------------------
-- Pass 2: filter canonicalize (using post-Pass-1 canonical brewer)
-- ---------------------------------------------------------------------------

-- "Espro Bloom" misnaming → xBloom Premium Paper Filters (16 brews).
UPDATE brews SET filter = 'xBloom Premium Paper Filters' WHERE filter = 'Espro Bloom';
UPDATE brews SET filter = 'xBloom Premium Paper Filters' WHERE filter = 'Espro Bloom (flat bottom)';
UPDATE brews SET filter = 'xBloom Premium Paper Filters' WHERE filter = 'Espro Bloom Flat';
UPDATE brews SET filter = 'xBloom Premium Paper Filters' WHERE filter = 'Espro Bloom - flat bottom';
UPDATE brews SET filter = 'xBloom Premium Paper Filters' WHERE filter = 'Espro Bloom flat-bottom filter';
UPDATE brews SET filter = 'xBloom Premium Paper Filters' WHERE filter = 'Espro Bloom (rinsed)';

-- "Standard flat filter (no puck screen)" on xBloom brewer.
UPDATE brews SET filter = 'xBloom Premium Paper Filters' WHERE filter = 'Standard flat filter (no puck screen)';

-- UFO FAST drift.
UPDATE brews SET filter = 'UFO FAST' WHERE filter = 'Sibarist UFO Fast Cone';
UPDATE brews SET filter = 'UFO FAST' WHERE filter = 'Filter: Sibarist UFO Fast Cone';

-- Sibarist FAST Cone — brewer-aware. UFO row → UFO FAST; Hario V60 row →
-- CONE FAST. Order matters: UFO branch first, fall-through catches Hario V60.
UPDATE brews SET filter = 'UFO FAST' WHERE filter = 'Sibarist FAST Cone' AND brewer = 'UFO';
UPDATE brews SET filter = 'CONE FAST' WHERE filter = 'Sibarist FAST Cone' AND brewer = 'Hario V60';

-- Sibarist B3 unambiguous.
UPDATE brews SET filter = 'CONE B3' WHERE filter = 'Sibarist B3 cone';
UPDATE brews SET filter = 'FLAT B3' WHERE filter = 'Sibarist B3 flat, Size S';
UPDATE brews SET filter = 'WAVE B3' WHERE filter = 'Sibarist B3 Wave (size S)';

-- Sibarist FAST flat variants → FLAT FAST (unambiguous "flat" descriptor).
UPDATE brews SET filter = 'FLAT FAST' WHERE filter = 'Sibarist FAST Flat';
UPDATE brews SET filter = 'FLAT FAST' WHERE filter = 'Sibarist FAST flat';
UPDATE brews SET filter = 'FLAT FAST' WHERE filter = 'Sibarist FAST - flat bottom';
UPDATE brews SET filter = 'FLAT FAST' WHERE filter = 'Sibarist FAST - flat, size S';
UPDATE brews SET filter = 'FLAT FAST' WHERE filter = 'Sibarist FAST Flat - Size S';
UPDATE brews SET filter = 'FLAT FAST' WHERE filter = 'Sibarist FAST - Flat (Size S)';
UPDATE brews SET filter = 'FLAT FAST' WHERE filter = 'Sibarist FAST - Flat S';
UPDATE brews SET filter = 'FLAT FAST' WHERE filter = 'Sibarist FAST Flat 2 - Size S';
UPDATE brews SET filter = 'FLAT FAST' WHERE filter = 'Sibarist FAST - Flat 2, Size S';
UPDATE brews SET filter = 'FLAT FAST' WHERE filter = 'Sibarist FAST - Flat, Size M';
UPDATE brews SET filter = 'FLAT FAST' WHERE filter = 'Sibarist FAST (flat bottom, imperfect fit)';
UPDATE brews SET filter = 'FLAT FAST' WHERE filter = 'Sibarist FAST (flat bottom)';

-- Sibarist FAST bare — both DB rows pair with Orea (flat geometry) → FLAT FAST.
UPDATE brews SET filter = 'FLAT FAST' WHERE filter = 'Sibarist FAST';

-- April Paper Filter drift.
UPDATE brews SET filter = 'April Paper Filter' WHERE filter = 'April brewer filter paper';
UPDATE brews SET filter = 'April Paper Filter' WHERE filter = 'April Brewer Paper';
UPDATE brews SET filter = 'April Paper Filter' WHERE filter = 'April Flat Bottom Paper';
UPDATE brews SET filter = 'April Paper Filter' WHERE filter = 'April paper filter';

-- Hario V60 paper drift → 01 Tabbed default.
UPDATE brews SET filter = 'Hario V60 Paper Filter 01 (Tabbed)' WHERE filter = 'Hario V60 paper';
UPDATE brews SET filter = 'Hario V60 Paper Filter 01 (Tabbed)' WHERE filter = 'Hario V60 Paper';
UPDATE brews SET filter = 'Hario V60 Paper Filter 01 (Tabbed)' WHERE filter = 'Hario V60 white paper';

-- CAFEC Abaca Plus → Cup 1 (geometry misfit on Orea, Chris-acknowledged).
UPDATE brews SET filter = 'CAFEC Abaca Cup 1 Cone Paper Filter' WHERE filter = 'CAFEC Abaca Plus';

COMMIT;
