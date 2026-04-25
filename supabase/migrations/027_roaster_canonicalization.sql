-- Migration 027: Roaster canonicalization (Roaster sprint 1h.1)
-- Renames the 20 short-form `brews.roaster` values to the canonical full names
-- defined in lib/roaster-registry.ts (70-entry rich registry, authored by Chris
-- 2026-04-23 and supplemented 2026-04-24). 1 currently-brewed roaster
-- (The Picky Chemist) already matches its canonical, so no UPDATE is needed.
-- Latent (4 brews, self-roasted) also already matches.
--
-- This is a DATA migration only — no schema change. brews.roaster is a text
-- column with no FK to a roasters table; canonical enforcement is code-only
-- via ROASTER_LOOKUP in lib/roaster-registry.ts. Sprint 1h.2 will land the
-- /add and /brews/[id]/edit picker enforcement.
--
-- 4 of the 20 renames also constitute STRATEGY RECLASSIFICATIONS in the
-- registry (Rose / Noma / Picky Chemist → SYSTEM family; TM Coffee → Clarity-
-- First family). The DB only stores the roaster name string — the family
-- mapping lives in code, so the strategy reclassifications take effect
-- automatically once this migration lands.
--
-- Pre-migration state (2026-04-24 audit): 21 distinct roasters across 55
-- non-Latent brews (+ 4 Latent self-roasted). Post-migration: same row count,
-- 21 distinct canonical names matching ROASTER_NAMES.

-- ---------------------------------------------------------------------------
-- Rename 1 of 20 — Moonwake Coffee Roasters (10 brews)
UPDATE brews SET roaster = 'Moonwake Coffee Roasters', updated_at = now()
WHERE roaster = 'Moonwake';

-- Rename 2 of 20 — Hydrangea Coffee (7 brews)
UPDATE brews SET roaster = 'Hydrangea Coffee', updated_at = now()
WHERE roaster = 'Hydrangea';

-- Rename 3 of 20 — Strait Coffee (6 brews)
UPDATE brews SET roaster = 'Strait Coffee', updated_at = now()
WHERE roaster = 'Strait';

-- Rename 4 of 20 — Sey Coffee (3 brews)
UPDATE brews SET roaster = 'Sey Coffee', updated_at = now()
WHERE roaster = 'Sey';

-- Rename 5 of 20 — Shoebox Coffee (3 brews)
UPDATE brews SET roaster = 'Shoebox Coffee', updated_at = now()
WHERE roaster = 'Shoebox';

-- Rename 6 of 20 — Colibri Coffee Roasters (2 brews)
UPDATE brews SET roaster = 'Colibri Coffee Roasters', updated_at = now()
WHERE roaster = 'Colibri';

-- Rename 7 of 20 — Flower Child Coffee (2 brews)
UPDATE brews SET roaster = 'Flower Child Coffee', updated_at = now()
WHERE roaster = 'Flower Child';

-- Rename 8 of 20 — Heart Coffee Roasters (2 brews)
UPDATE brews SET roaster = 'Heart Coffee Roasters', updated_at = now()
WHERE roaster = 'Heart';

-- Rename 9 of 20 — Picolot (Brian Quan) (2 brews)
UPDATE brews SET roaster = 'Picolot (Brian Quan)', updated_at = now()
WHERE roaster = 'Picolot';

-- Rename 10 of 20 — Rose Coffee (2 brews)
-- Also a strategy reclassification: BALANCED → FULL → SYSTEM (Winton 5-pour
-- = control-loop identity per Chris's 2026-04-24 review).
UPDATE brews SET roaster = 'Rose Coffee', updated_at = now()
WHERE roaster = 'Rose';

-- Rename 11 of 20 — Substance Café (2 brews)
UPDATE brews SET roaster = 'Substance Café', updated_at = now()
WHERE roaster = 'Substance';

-- Rename 12 of 20 — TM Coffee (2 brews)
-- Also a strategy reclassification: BALANCED → CLARITY-FIRST (per CSV;
-- ultra-light Okinawan house style).
UPDATE brews SET roaster = 'TM Coffee', updated_at = now()
WHERE roaster = 'T&M';

-- Rename 13 of 20 — Bean & Bean Coffee Roasters (1 brew)
UPDATE brews SET roaster = 'Bean & Bean Coffee Roasters', updated_at = now()
WHERE roaster = 'Bean & Bean';

-- Rename 14 of 20 — Leaves Coffee (1 brew)
UPDATE brews SET roaster = 'Leaves Coffee', updated_at = now()
WHERE roaster = 'Leaves';

-- Rename 15 of 20 — Luminous Coffee (1 brew)
UPDATE brews SET roaster = 'Luminous Coffee', updated_at = now()
WHERE roaster = 'Luminous';

-- Rename 16 of 20 — Noma Coffee (1 brew)
-- Also a strategy reclassification: BALANCED → FULL → SYSTEM (per Chris's
-- 2026-04-24 review). And a name correction: "Noma Kaffe" → "Noma Coffee"
-- per CSV (the roaster trades as Noma Coffee in English).
UPDATE brews SET roaster = 'Noma Coffee', updated_at = now()
WHERE roaster = 'Noma Kaffe';

-- Rename 17 of 20 — Olympia Coffee (1 brew)
UPDATE brews SET roaster = 'Olympia Coffee', updated_at = now()
WHERE roaster = 'Olympia';

-- Rename 18 of 20 — Oma Coffee Roaster (1 brew)
UPDATE brews SET roaster = 'Oma Coffee Roaster', updated_at = now()
WHERE roaster = 'Oma';

-- Rename 19 of 20 — Scenery Coffee (1 brew)
UPDATE brews SET roaster = 'Scenery Coffee', updated_at = now()
WHERE roaster = 'Scenery';

-- Rename 20 of 20 — The Picky Chemist (1 brew)
-- The canonical name does NOT change ('The Picky Chemist' is canonical), but
-- the strategy reclassifies FULL EXPRESSION → SYSTEM per Chris's 2026-04-24
-- review. No DB UPDATE required for this row — registry change alone takes
-- effect immediately. Listed here for audit completeness.
-- (No-op statement intentionally omitted.)

-- ---------------------------------------------------------------------------
-- Sync `roaster_syntheses` cache table to canonical names too. The cache is
-- keyed by (user_id, roaster); renaming the brew rows would orphan synthesis
-- caches keyed by the old name. Apply the same rename so cached syntheses
-- continue resolving on the renamed roaster pages.
UPDATE roaster_syntheses SET roaster = 'Moonwake Coffee Roasters' WHERE roaster = 'Moonwake';
UPDATE roaster_syntheses SET roaster = 'Hydrangea Coffee' WHERE roaster = 'Hydrangea';
UPDATE roaster_syntheses SET roaster = 'Strait Coffee' WHERE roaster = 'Strait';
UPDATE roaster_syntheses SET roaster = 'Sey Coffee' WHERE roaster = 'Sey';
UPDATE roaster_syntheses SET roaster = 'Shoebox Coffee' WHERE roaster = 'Shoebox';
UPDATE roaster_syntheses SET roaster = 'Colibri Coffee Roasters' WHERE roaster = 'Colibri';
UPDATE roaster_syntheses SET roaster = 'Flower Child Coffee' WHERE roaster = 'Flower Child';
UPDATE roaster_syntheses SET roaster = 'Heart Coffee Roasters' WHERE roaster = 'Heart';
UPDATE roaster_syntheses SET roaster = 'Picolot (Brian Quan)' WHERE roaster = 'Picolot';
UPDATE roaster_syntheses SET roaster = 'Rose Coffee' WHERE roaster = 'Rose';
UPDATE roaster_syntheses SET roaster = 'Substance Café' WHERE roaster = 'Substance';
UPDATE roaster_syntheses SET roaster = 'TM Coffee' WHERE roaster = 'T&M';
UPDATE roaster_syntheses SET roaster = 'Bean & Bean Coffee Roasters' WHERE roaster = 'Bean & Bean';
UPDATE roaster_syntheses SET roaster = 'Leaves Coffee' WHERE roaster = 'Leaves';
UPDATE roaster_syntheses SET roaster = 'Luminous Coffee' WHERE roaster = 'Luminous';
UPDATE roaster_syntheses SET roaster = 'Noma Coffee' WHERE roaster = 'Noma Kaffe';
UPDATE roaster_syntheses SET roaster = 'Olympia Coffee' WHERE roaster = 'Olympia';
UPDATE roaster_syntheses SET roaster = 'Oma Coffee Roaster' WHERE roaster = 'Oma';
UPDATE roaster_syntheses SET roaster = 'Scenery Coffee' WHERE roaster = 'Scenery';
