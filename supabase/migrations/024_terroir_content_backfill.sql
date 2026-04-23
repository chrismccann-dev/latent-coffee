-- 024_terroir_content_backfill
--
-- Populates the 11 macro-level attribute content columns on the 22 existing
-- terroir rows with the canonical content authored in
-- docs/taxonomies/regions.md. Overwrite mode: regions.md is authoritative
-- and replaces the pre-1d.1 content seeded by migration 009 (which was a
-- stopgap from an older Terroirs spreadsheet; regions.md is now the single
-- source of truth for macro content).
--
-- Columns updated per row (12 column writes; 11 regions.md fields with
-- Elevation Band splitting into two int columns):
--   Text:    context, cup_profile, why_it_stands_out, acidity_character,
--            body_character, farming_model, soil, climate_stress
--   Int:     elevation_min, elevation_max
--   Array:   dominant_varieties, typical_processing
--
-- climate_stress is stored as free-text verbatim from regions.md "Climate
-- Regime" (no longer a one-word enum — decision ratified during 1d.2 plan
-- mode; column is already text, not a DB enum). typical_processing is
-- Title Case mapped to lib/process-families.ts canonical form so /processes
-- cross-linking stays coherent. dominant_varieties preserves regions.md
-- wording exactly (macro-level, not FK to cultivars).
--
-- meso_terroir is NOT touched — retained as row-level free-text per the
-- 1d.1 meso/micro demotion decision.
--
-- No schema change, no row inserts, no row deletes, no FK changes. Rows
-- retain id + country + admin_region + meso_terroir. 55 brew FKs intact.
--
-- Order follows migration 009 (country-alphabetical) for easy diff.
--
-- Sprint 1d.2 of the Reference Taxonomies umbrella Region adoption.

BEGIN;

-- =========================================================================
-- Brazil / Cerrado Mineiro
-- =========================================================================

UPDATE terroirs SET
  context = $c$Large, flat plateau system with mechanized farming and uniform ripening$c$,
  elevation_min = 900,
  elevation_max = 1250,
  climate_stress = $c$warm, distinct dry season, moderate rainfall$c$,
  soil = $c$deep well-drained oxisols (red latosols)$c$,
  farming_model = $c$large estate, mechanized harvest$c$,
  dominant_varieties = ARRAY['Mundo Novo', 'Catuai', 'Topazio'],
  typical_processing = ARRAY['Natural', 'Pulped Natural'],
  cup_profile = $c$common chocolate, nuts, mild fruit$c$,
  acidity_character = $c$low, rounded$c$,
  body_character = $c$mid-heavy, structured$c$,
  why_it_stands_out = $c$Uniform ripening + dry harvest conditions produce consistency and low-acid profiles unlike mountain systems$c$,
  updated_at = NOW()
WHERE id = 'a3c50c27-42d0-4e2b-8d6b-28071c74fa57';

-- =========================================================================
-- Burundi / Mumirwa Escarpment
-- =========================================================================

UPDATE terroirs SET
  context = $c$Western escarpment descending toward Lake Tanganyika with high elevation and dense production$c$,
  elevation_min = 1500,
  elevation_max = 2100,
  climate_stress = $c$cooler, humid, consistent rainfall$c$,
  soil = $c$volcanic and clay-rich soils$c$,
  farming_model = $c$smallholder, washing station-based$c$,
  dominant_varieties = ARRAY['Bourbon'],
  typical_processing = ARRAY['Washed'],
  cup_profile = $c$bright citrus, florals, refined sweetness$c$,
  acidity_character = $c$citric-linear$c$,
  body_character = $c$medium-light$c$,
  why_it_stands_out = $c$High elevation and strong washing station network produce some of the cleanest cups in Central Africa$c$,
  updated_at = NOW()
WHERE id = 'e582aadc-985d-4f27-9695-36e5d6c15b0e';

-- =========================================================================
-- China / Yunnan Central Highlands
-- =========================================================================

UPDATE terroirs SET
  context = $c$Transitional plateau between tropical south and cooler north$c$,
  elevation_min = 1400,
  elevation_max = 1800,
  climate_stress = $c$temperate-warm, seasonal rainfall, moderate humidity$c$,
  soil = $c$red loam with improved structure vs south$c$,
  farming_model = $c$smallholder + estate$c$,
  dominant_varieties = ARRAY['Catimor'],
  typical_processing = ARRAY['Washed'],
  cup_profile = $c$emerging fruit clarity, balanced sweetness$c$,
  acidity_character = $c$malic-rounded$c$,
  body_character = $c$medium silky$c$,
  why_it_stands_out = $c$Slower ripening improves structure and balance compared to southern Yunnan$c$,
  updated_at = NOW()
WHERE id = 'ba1a3ea2-13c4-4d79-a11b-a472dead7f4b';

-- =========================================================================
-- Colombia / Antioquia / Central Andean Cordillera
-- =========================================================================

UPDATE terroirs SET
  context = $c$Core Colombian mountain chain with stable climate and strong infrastructure$c$,
  elevation_min = 1400,
  elevation_max = 2000,
  climate_stress = $c$temperate, bimodal rainfall$c$,
  soil = $c$young volcanic ash soils$c$,
  farming_model = $c$smallholder dominant$c$,
  dominant_varieties = ARRAY['Caturra', 'Castillo', 'Colombia'],
  typical_processing = ARRAY['Washed'],
  cup_profile = $c$bright fruit, caramel sweetness, balanced florals$c$,
  acidity_character = $c$citric-malic$c$,
  body_character = $c$medium silky$c$,
  why_it_stands_out = $c$Consistent rainfall and elevation create one of the most balanced and repeatable coffee systems globally$c$,
  updated_at = NOW()
WHERE id = 'd606b3ad-46a0-4c0d-8a90-13fb70818011';

-- =========================================================================
-- Colombia / Quindío / Central Andean Cordillera
-- =========================================================================

UPDATE terroirs SET
  context = $c$Core Colombian mountain chain with stable climate and strong infrastructure$c$,
  elevation_min = 1400,
  elevation_max = 2000,
  climate_stress = $c$temperate, bimodal rainfall$c$,
  soil = $c$young volcanic ash soils$c$,
  farming_model = $c$smallholder dominant$c$,
  dominant_varieties = ARRAY['Caturra', 'Castillo', 'Colombia'],
  typical_processing = ARRAY['Washed'],
  cup_profile = $c$bright fruit, caramel sweetness, balanced florals$c$,
  acidity_character = $c$citric-malic$c$,
  body_character = $c$medium silky$c$,
  why_it_stands_out = $c$Consistent rainfall and elevation create one of the most balanced and repeatable coffee systems globally$c$,
  updated_at = NOW()
WHERE id = 'f9d0de9d-b3d7-44a4-b0e8-207b467d154e';

-- =========================================================================
-- Colombia / Huila / Huila Highlands
-- =========================================================================

UPDATE terroirs SET
  context = $c$High-elevation basin with strong diurnal shifts and consistent rainfall$c$,
  elevation_min = 1500,
  elevation_max = 2100,
  climate_stress = $c$cool nights, stable rainfall$c$,
  soil = $c$young volcanic soils$c$,
  farming_model = $c$smallholder$c$,
  dominant_varieties = ARRAY['Caturra', 'Castillo'],
  typical_processing = ARRAY['Washed'],
  cup_profile = $c$bright citrus, florals$c$,
  acidity_character = $c$citric-linear$c$,
  body_character = $c$medium-light$c$,
  why_it_stands_out = $c$High elevation + stable climate produces some of Colombia's highest clarity cups$c$,
  updated_at = NOW()
WHERE id = 'e297bbbb-0093-4afe-9c5f-86b94ba0ec96';

-- =========================================================================
-- Colombia / Valle del Cauca / Western Andean Cordillera
-- =========================================================================

UPDATE terroirs SET
  context = $c$Closer to Pacific moisture influence with higher humidity and cloud cover$c$,
  elevation_min = 1400,
  elevation_max = 2000,
  climate_stress = $c$cool, high humidity, heavy rainfall$c$,
  soil = $c$volcanic soils$c$,
  farming_model = $c$smallholder$c$,
  dominant_varieties = ARRAY['Caturra', 'Castillo'],
  typical_processing = ARRAY['Washed'],
  cup_profile = $c$softer fruit, more rounded cup$c$,
  acidity_character = $c$malic, softer$c$,
  body_character = $c$medium$c$,
  why_it_stands_out = $c$Increased cloud cover slows drying and softens acidity vs Central Cordillera$c$,
  updated_at = NOW()
WHERE id = '80c8ee17-6beb-4dad-b4bf-cc8863e19a5a';

-- =========================================================================
-- Colombia / Cauca / Western Andean Cordillera
-- =========================================================================

UPDATE terroirs SET
  context = $c$Closer to Pacific moisture influence with higher humidity and cloud cover$c$,
  elevation_min = 1400,
  elevation_max = 2000,
  climate_stress = $c$cool, high humidity, heavy rainfall$c$,
  soil = $c$volcanic soils$c$,
  farming_model = $c$smallholder$c$,
  dominant_varieties = ARRAY['Caturra', 'Castillo'],
  typical_processing = ARRAY['Washed'],
  cup_profile = $c$softer fruit, more rounded cup$c$,
  acidity_character = $c$malic, softer$c$,
  body_character = $c$medium$c$,
  why_it_stands_out = $c$Increased cloud cover slows drying and softens acidity vs Central Cordillera$c$,
  updated_at = NOW()
WHERE id = '389f8840-5df4-4d1c-86cc-e7bb4b3d02e8';

-- =========================================================================
-- Costa Rica / Alajuela / Central Volcanic Highlands
-- =========================================================================

UPDATE terroirs SET
  context = $c$Volcanic chain with structured elevations and strong infrastructure$c$,
  elevation_min = 1200,
  elevation_max = 1800,
  climate_stress = $c$temperate, distinct wet/dry seasons$c$,
  soil = $c$volcanic ash soils$c$,
  farming_model = $c$smallholder + estate$c$,
  dominant_varieties = ARRAY['Caturra', 'Catuai', 'SL hybrids'],
  typical_processing = ARRAY['Washed', 'Honey'],
  cup_profile = $c$common citrus, honey sweetness$c$,
  acidity_character = $c$citric-linear$c$,
  body_character = $c$medium silky$c$,
  why_it_stands_out = $c$Strong processing control and volcanic soils drive clarity and balance$c$,
  updated_at = NOW()
WHERE id = '56dedde9-b182-4820-9491-51b00cc922ca';

-- =========================================================================
-- Ecuador / Imbabura / Northern Andean Highlands
-- =========================================================================

UPDATE terroirs SET
  context = $c$Northern Andes system with higher humidity and stronger cloud forest influence$c$,
  elevation_min = 1200,
  elevation_max = 1800,
  climate_stress = $c$humid, cloud cover, frequent rainfall$c$,
  soil = $c$volcanic soils$c$,
  farming_model = $c$smallholder$c$,
  dominant_varieties = ARRAY['Caturra', 'Typica'],
  typical_processing = ARRAY['Washed', 'Natural'],
  cup_profile = $c$muted fruit, herbal, softer structure$c$,
  acidity_character = $c$malic-soft$c$,
  body_character = $c$medium$c$,
  why_it_stands_out = $c$Increased humidity and cloud cover reduce acidity definition compared to southern Ecuador$c$,
  updated_at = NOW()
WHERE id = '2b209822-21fe-4172-a0e6-23de890aa19a';

-- =========================================================================
-- Ethiopia / Bench Sheko / Bench Sheko Highlands
-- =========================================================================

UPDATE terroirs SET
  context = $c$Remote high-elevation forest system near origin of Gesha genetics with dense agroforestry and minimal historical domestication$c$,
  elevation_min = 1800,
  elevation_max = 2200,
  climate_stress = $c$cool, humid, high rainfall, stable cloud cover$c$,
  soil = $c$virgin forest, brown-red loamy soils$c$,
  farming_model = $c$estate + controlled agroforestry (semi-wild structure)$c$,
  dominant_varieties = ARRAY['Gesha (Gori Gesha)', 'Ethiopian landrace selections'],
  typical_processing = ARRAY['Washed', 'Natural'],
  cup_profile = $c$floral (jasmine), citrus, stone fruit, tea-like clarity$c$,
  acidity_character = $c$citric-linear to malic, high clarity$c$,
  body_character = $c$light silky$c$,
  why_it_stands_out = $c$Combination of origin genetics, high elevation, and forest ecology produces some of the highest clarity and most floral coffees globally$c$,
  updated_at = NOW()
WHERE id = '5791e4eb-0726-4953-8d84-36a50b1deefb';

-- =========================================================================
-- Ethiopia / Oromia / Guji Highlands
-- =========================================================================

UPDATE terroirs SET
  context = $c$Expanded southern system with more spacing and slightly warmer climate than Yirgacheffe$c$,
  elevation_min = 1600,
  elevation_max = 2200,
  climate_stress = $c$temperate, slightly warmer, consistent rainfall$c$,
  soil = $c$red loam$c$,
  farming_model = $c$smallholder$c$,
  dominant_varieties = ARRAY['Ethiopian landrace populations'],
  typical_processing = ARRAY['Washed', 'Natural'],
  cup_profile = $c$floral fruit, round sweetness, less angular than Yirgacheffe$c$,
  acidity_character = $c$malic-citric rounded$c$,
  body_character = $c$medium-light$c$,
  why_it_stands_out = $c$More forgiving and fruit-forward than Yirgacheffe with slightly softer acidity$c$,
  updated_at = NOW()
WHERE id = '573f3286-0767-49a4-8973-1c593aa710e6';

-- =========================================================================
-- Ethiopia / Sidama / Sidama Highlands
-- =========================================================================

UPDATE terroirs SET
  context = $c$High-elevation southern system with balanced rainfall and broad production base$c$,
  elevation_min = 1600,
  elevation_max = 2200,
  climate_stress = $c$temperate, reliable rainfall, moderate humidity$c$,
  soil = $c$red-brown clay loam$c$,
  farming_model = $c$smallholder, washing station-based$c$,
  dominant_varieties = ARRAY['Ethiopian landrace populations'],
  typical_processing = ARRAY['Washed', 'Natural'],
  cup_profile = $c$citrus, florals, balanced sweetness$c$,
  acidity_character = $c$citric-malic balanced$c$,
  body_character = $c$medium silky$c$,
  why_it_stands_out = $c$Acts as a "baseline Ethiopia" with strong balance between clarity and body$c$,
  updated_at = NOW()
WHERE id = '25baa521-02d2-4db5-bcbe-4c048bbc4586';

-- =========================================================================
-- Ethiopia / Oromia / West Arsi Highlands
-- =========================================================================

UPDATE terroirs SET
  context = $c$Higher elevation extension with cooler climate and structured ripening$c$,
  elevation_min = 1700,
  elevation_max = 2300,
  climate_stress = $c$cooler, stable rainfall, lower humidity than Yirgacheffe$c$,
  soil = $c$mixed volcanic-influenced soils$c$,
  farming_model = $c$smallholder$c$,
  dominant_varieties = ARRAY['Ethiopian landrace populations'],
  typical_processing = ARRAY['Washed'],
  cup_profile = $c$clean citrus, florals, structured sweetness$c$,
  acidity_character = $c$citric-linear$c$,
  body_character = $c$light to medium$c$,
  why_it_stands_out = $c$Combines Yirgacheffe clarity with slightly more structure and stability$c$,
  updated_at = NOW()
WHERE id = '0918d4d6-4896-4069-b8e9-ff66af86affa';

-- =========================================================================
-- Guatemala / Chimaltenango / Central Volcanic Highlands
-- =========================================================================

UPDATE terroirs SET
  context = $c$Core volcanic chain with strong elevation and consistent specialty infrastructure$c$,
  elevation_min = 1300,
  elevation_max = 1900,
  climate_stress = $c$temperate, distinct wet/dry seasons$c$,
  soil = $c$young volcanic ash soils$c$,
  farming_model = $c$smallholder + estate$c$,
  dominant_varieties = ARRAY['Bourbon', 'Caturra', 'Catuai'],
  typical_processing = ARRAY['Washed'],
  cup_profile = $c$citrus, floral, caramel sweetness$c$,
  acidity_character = $c$citric-linear$c$,
  body_character = $c$medium silky$c$,
  why_it_stands_out = $c$One of the most consistent high-clarity washed systems due to volcanic soils and stable climate$c$,
  updated_at = NOW()
WHERE id = 'f052b58f-fa57-4b7b-904f-6493eefada08';

-- =========================================================================
-- Guatemala / Huehuetenango / Western Dry Highlands
-- =========================================================================

UPDATE terroirs SET
  context = $c$High-altitude region with dry climate and strong diurnal shifts$c$,
  elevation_min = 1500,
  elevation_max = 2200,
  climate_stress = $c$drier, high sun exposure, cooler nights$c$,
  soil = $c$limestone + mixed soils$c$,
  farming_model = $c$smallholder$c$,
  dominant_varieties = ARRAY['Bourbon', 'Caturra'],
  typical_processing = ARRAY['Washed'],
  cup_profile = $c$bright citrus, stone fruit, high clarity$c$,
  acidity_character = $c$citric-bright$c$,
  body_character = $c$medium-light$c$,
  why_it_stands_out = $c$Dry climate allows precise drying and high acidity expression despite extreme elevation$c$,
  updated_at = NOW()
WHERE id = '4c529fd8-f4f4-4f15-bcb6-d61503b2806f';

-- =========================================================================
-- Honduras / La Paz / Central Honduras Highlands
-- =========================================================================

UPDATE terroirs SET
  context = $c$Central mountain system with moderate elevation and strong cooperative presence$c$,
  elevation_min = 1200,
  elevation_max = 1700,
  climate_stress = $c$temperate, seasonal rainfall$c$,
  soil = $c$mixed soils$c$,
  farming_model = $c$smallholder$c$,
  dominant_varieties = ARRAY['Catuai', 'Bourbon', 'Pacas'],
  typical_processing = ARRAY['Washed'],
  cup_profile = $c$citrus, soft fruit, balanced sweetness$c$,
  acidity_character = $c$malic-citric$c$,
  body_character = $c$medium$c$,
  why_it_stands_out = $c$Consistent processing and moderate elevation produce balanced, approachable profiles$c$,
  updated_at = NOW()
WHERE id = '45ad39fb-f9af-435b-bf16-1a98b76be734';

-- =========================================================================
-- Mexico / Chiapas / Chiapas Highlands
-- =========================================================================

UPDATE terroirs SET
  context = $c$Large southern mountain system influenced by Pacific moisture and high production volume$c$,
  elevation_min = 1000,
  elevation_max = 1700,
  climate_stress = $c$warm-temperate, humid, high rainfall$c$,
  soil = $c$mixed volcanic and loam soils$c$,
  farming_model = $c$smallholder$c$,
  dominant_varieties = ARRAY['Bourbon', 'Typica', 'Caturra'],
  typical_processing = ARRAY['Washed'],
  cup_profile = $c$chocolate, soft citrus, mild sweetness$c$,
  acidity_character = $c$malic-soft$c$,
  body_character = $c$medium$c$,
  why_it_stands_out = $c$High humidity and scale reduce clarity compared to Central American volcanic systems$c$,
  updated_at = NOW()
WHERE id = '197d444c-e386-46ca-9e1e-1b8e256c869c';

-- =========================================================================
-- Mexico / Oaxaca / Oaxaca Southern Highlands
-- =========================================================================

UPDATE terroirs SET
  context = $c$Southern highland system with moderate elevation and more isolated production$c$,
  elevation_min = 1200,
  elevation_max = 1800,
  climate_stress = $c$temperate, moderate rainfall$c$,
  soil = $c$mixed mountain soils$c$,
  farming_model = $c$smallholder$c$,
  dominant_varieties = ARRAY['Typica', 'Pluma Hidalgo'],
  typical_processing = ARRAY['Washed', 'Natural'],
  cup_profile = $c$floral, citrus, lighter structure$c$,
  acidity_character = $c$malic-citric$c$,
  body_character = $c$medium-light$c$,
  why_it_stands_out = $c$Better elevation and isolation allow more expressive cups than Chiapas$c$,
  updated_at = NOW()
WHERE id = '22922ed2-2f9b-445d-8175-34bc1a59381c';

-- =========================================================================
-- Panama / Chiriquí / Volcán Barú Highlands
-- =========================================================================

UPDATE terroirs SET
  context = $c$High-elevation volcanic system centered around Volcán Barú with strong microclimate variation$c$,
  elevation_min = 1500,
  elevation_max = 2200,
  climate_stress = $c$cool, frequent cloud cover, strong diurnal shifts$c$,
  soil = $c$volcanic ash soils$c$,
  farming_model = $c$estate$c$,
  dominant_varieties = ARRAY['Gesha', 'Caturra', 'Catuai'],
  typical_processing = ARRAY['Washed', 'Natural'],
  cup_profile = $c$intense florals, citrus, high clarity$c$,
  acidity_character = $c$citric-linear to complex$c$,
  body_character = $c$light silky$c$,
  why_it_stands_out = $c$One of the highest clarity systems globally due to elevation, microclimate, and cultivar selection$c$,
  updated_at = NOW()
WHERE id = '1771a1e5-0d5d-4d0c-a7b8-8baa64780299';

-- =========================================================================
-- Peru / Cajamarca / Northern Andean Highlands
-- =========================================================================

UPDATE terroirs SET
  context = $c$Large northern mountain system with diverse microclimates and expanding specialty production$c$,
  elevation_min = 1200,
  elevation_max = 1900,
  climate_stress = $c$temperate, moderate rainfall$c$,
  soil = $c$mixed volcanic and loam soils$c$,
  farming_model = $c$smallholder$c$,
  dominant_varieties = ARRAY['Caturra', 'Bourbon', 'Typica'],
  typical_processing = ARRAY['Washed'],
  cup_profile = $c$citrus, cocoa, mild florals$c$,
  acidity_character = $c$malic-citric$c$,
  body_character = $c$medium$c$,
  why_it_stands_out = $c$Strong elevation but variable processing leads to moderate clarity ceiling$c$,
  updated_at = NOW()
WHERE id = '5f55755f-b119-4de0-ad51-29329dbbd248';

-- =========================================================================
-- Rwanda / Western Province / Lake Kivu Highlands
-- =========================================================================

UPDATE terroirs SET
  context = $c$High-elevation volcanic system along Lake Kivu with strong washing station infrastructure$c$,
  elevation_min = 1500,
  elevation_max = 2000,
  climate_stress = $c$cool-temperate, high humidity, consistent rainfall$c$,
  soil = $c$volcanic soils$c$,
  farming_model = $c$smallholder, washing station-based$c$,
  dominant_varieties = ARRAY['Bourbon'],
  typical_processing = ARRAY['Washed'],
  cup_profile = $c$citrus, red fruit, refined sweetness$c$,
  acidity_character = $c$citric-malic, rounded$c$,
  body_character = $c$medium-light$c$,
  why_it_stands_out = $c$Lake influence softens acidity slightly while maintaining clarity and balance$c$,
  updated_at = NOW()
WHERE id = 'b5f6a63d-1609-4f95-a6cf-0013b90d3aae';

COMMIT;
