-- 072_bourbon_cultivar_content_backfill
--
-- Backfills the 18 attribute content columns on the `Bourbon` cultivar row
-- (id ddfce7fc-4595-41f9-9ee4-a788af8a792b) from the authored `### Bourbon`
-- block in docs/taxonomies/varieties.md (the canonical source).
--
-- Why this row was missed: migration 022_cultivar_content_backfill populated
-- the 26 cultivar rows that existed on 2026-04-22. The `Bourbon` (classic) row
-- was auto-created LATER by the Costa Rica Higuito lot upload, so it never
-- received content and renders as a skeleton on /cultivars/[id]. varieties.md
-- already carries the full authored entry; this migration materializes it,
-- mirroring 022's exact column set + style.
--
-- Data-audit session 2026-05-30 (redesign-polish punch-list, MB-5). Scope is
-- Bourbon only per Chris's call; the other post-022 skeleton rows (Mokka /
-- Wush Wush / SL28 / Khun Lao / Mandela) are deferred.
--
-- No schema change. No row inserts / deletes. Exact-match on cultivar_name =
-- 'Bourbon' (not LIKE) so Red / Pink / Bourbon-blend rows are untouched.

BEGIN;

UPDATE cultivars SET
  genetic_background = $c$Classic Arabica lineage historically disseminated from Yemen / East Africa routes into the Indian Ocean and the Americas.$c$,
  typical_origins = ARRAY['Latin America', 'Africa', 'Asia'],
  altitude_sensitivity = '1,000-2,000 masl; high',
  terroir_transparency = 'High',
  common_processing_methods = ARRAY['Washed', 'Honey', 'Natural'],
  typical_flavor_notes = ARRAY['Sweet round stonefruit', 'Caramel', 'Balanced citrus', 'Classic cup'],
  acidity_style = 'Medium to bright; usually rounded',
  body_style = 'Medium, silky',
  aromatics = 'Brown sugar, fruit, light florals depending on terroir',
  extraction_sensitivity = 'Medium',
  roast_tolerance = 'Light to medium',
  roast_behavior = 'Handles extended development better than Gesha; too dark becomes generic cocoa.',
  resting_behavior = 'Moderate rest beneficial.',
  brewing_tendencies = 'Versatile omni; solid espresso base for sweetness.',
  common_pitfalls = ARRAY['Flatness if roasted too dark', 'Confusion between "Bourbon" and Red / Yellow / Orange Bourbon mutations'],
  market_context = 'Specialty staple; quality-driven, also volume in some regions.',
  limiting_factors = ARRAY['Rust susceptibility', 'Yield lower than modern hybrids'],
  cultivar_notes = $c$Reliable "sweetness chassis" cultivar; when it tastes unusually perfumed or candy-like, that is usually terroir or fermentation-driven. Backfilled from docs/taxonomies/varieties.md (the canonical source); the Bourbon row was auto-created after migration 022 and never received content.$c$,
  updated_at = NOW()
WHERE cultivar_name = 'Bourbon';

COMMIT;
