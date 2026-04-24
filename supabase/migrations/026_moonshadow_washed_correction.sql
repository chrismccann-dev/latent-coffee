-- 026_moonshadow_washed_correction
--
-- Post-ship correction to migration 025 (Process sprint 1e.2). The single
-- brew row with process = 'Moonshadow Washed' was decomposed in 025 as plain
-- base:Washed with no signature, based on pre-sprint audit reading of the
-- coffee_name ("Alo Village - Tamiru Tadesse - Washed 74158" — no
-- Moonshadow in the name) + clean-washed flavor profile.
--
-- Chris confirmed post-ship that this is actually a legitimate rare Washed
-- variant of Moonshadow — the MSW1 Airworks x Shoebox x Alo special-release
-- collab lot (no public product page; Airworks IG post confirms). Same
-- Moonshadow signature drying protocol (Dark Room Dried + Slow Dry) applied
-- to a washed ferment.
--
-- Corrected decomposition: base:Washed + drying:[Dark Room Dried, Slow Dry]
-- + signature_method:Moonshadow.
--
-- lib/process-registry.ts LEGACY_DECOMPOSITIONS['Moonshadow Washed'] and
-- docs/taxonomies/processes.md are updated alongside this migration so the
-- TS source of truth + authored doc + DB all agree.

BEGIN;

UPDATE brews SET
  base_process = 'Washed',
  drying_modifiers = ARRAY['Dark Room Dried', 'Slow Dry']::text[],
  signature_method = 'Moonshadow',
  updated_at = NOW()
WHERE process = 'Moonshadow Washed';

COMMIT;
