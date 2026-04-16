-- Backfill terroir character fields from brewing spreadsheet Terroirs tab
-- Fields: acidity_character, body_character, farming_model, dominant_varieties, typical_processing

-- Brazil / Cerrado Mineiro
UPDATE terroirs SET
  acidity_character = 'Low-medium rounded',
  body_character = 'Medium smooth to dense',
  farming_model = 'Large estate, mechanized harvesting',
  dominant_varieties = ARRAY['Geisha', 'Catuai'],
  typical_processing = ARRAY['Natural', 'Pulped-natural', 'Washed', 'Anaerobic']
WHERE id = 'a3c50c27-42d0-4e2b-8d6b-28071c74fa57';

-- Burundi / Lake Kivu Highlands
UPDATE terroirs SET
  acidity_character = 'Phosphoric sparkling',
  body_character = 'Tea-like',
  farming_model = 'Smallholder; hand-picked',
  dominant_varieties = ARRAY['Red Bourbon'],
  typical_processing = ARRAY['Washed']
WHERE id = 'e582aadc-985d-4f27-9695-36e5d6c15b0e';

-- China / Yunnan Monsoonal Highlands
UPDATE terroirs SET
  acidity_character = 'Low muted',
  body_character = 'Medium silky',
  farming_model = 'Mixed; hand-picked',
  dominant_varieties = ARRAY['Catimor', 'Yunnan large-leaf tea cultivars'],
  typical_processing = ARRAY['Oolong', 'Yeast anaerobic natural']
WHERE id = 'ba1a3ea2-13c4-4d79-a11b-a472dead7f4b';

-- Colombia / Central Andean Cordillera
UPDATE terroirs SET
  acidity_character = 'Bright malic-citric',
  body_character = 'Silky to medium',
  farming_model = 'Smallholders, micro-mills; estate-led specialty production',
  dominant_varieties = ARRAY['Castillo', 'Caturra', 'Pink Bourbon', 'Gesha', 'Sidra'],
  typical_processing = ARRAY['Washed', 'Experimental']
WHERE id = 'f9d0de9d-b3d7-44a4-b0e8-207b467d154e';

-- Colombia / Huila Highlands
UPDATE terroirs SET
  acidity_character = 'Citric-linear with malic lift',
  body_character = 'Light to medium silky',
  farming_model = 'Family estate; hand-picked; selective passes',
  dominant_varieties = ARRAY['Caturra', 'Castillo', 'Colombia', 'Gesha', 'Sidra', 'Chiroso', 'Java'],
  typical_processing = ARRAY['Washed', 'Honey', 'Natural']
WHERE id = 'e297bbbb-0093-4afe-9c5f-86b94ba0ec96';

-- Colombia / Southern Andean Cordillera
UPDATE terroirs SET
  acidity_character = 'Pronounced, structured, high-toned',
  body_character = 'Medium-light to medium',
  farming_model = 'Mostly smallholder',
  dominant_varieties = ARRAY['Castillo', 'Caturra', 'Colombia', 'Typica'],
  typical_processing = ARRAY['Washed']
WHERE id = '389f8840-5df4-4d1c-86cc-e7bb4b3d02e8';

-- Colombia / Western Andean Cordillera (Antioquia)
UPDATE terroirs SET
  acidity_character = 'Citric-linear to malic-rounded',
  body_character = 'Medium silky to light',
  farming_model = 'Estate-led; hand-picked; conservation-integrated production',
  dominant_varieties = ARRAY['Castillo', 'Caturra', 'Colombia'],
  typical_processing = ARRAY['Washed', 'Experimental']
WHERE id = 'd606b3ad-46a0-4c0d-8a90-13fb70818011';

-- Colombia / Western Andean Cordillera (Valle del Cauca)
UPDATE terroirs SET
  acidity_character = 'Citric-linear to malic-rounded',
  body_character = 'Medium to tea-like',
  farming_model = 'Smallholder to estate; hand-picked',
  dominant_varieties = ARRAY['Castillo', 'Caturra', 'Gesha'],
  typical_processing = ARRAY['Washed', 'Natural', 'Experimental']
WHERE id = '80c8ee17-6beb-4dad-b4bf-cc8863e19a5a';

-- Costa Rica / Costa Rican Central Volcanic Highlands
UPDATE terroirs SET
  acidity_character = 'Malic-rounded to citric-linear',
  body_character = 'Medium silky',
  farming_model = 'Mixed smallholder / micro-mill estates',
  dominant_varieties = ARRAY['Caturra', 'Catuai'],
  typical_processing = ARRAY['Washed', 'Honey']
WHERE id = '56dedde9-b182-4820-9491-51b00cc922ca';

-- Ecuador / Northern Andean Cordillera
UPDATE terroirs SET
  acidity_character = 'Citric linear',
  body_character = 'Tea-like to light-medium',
  farming_model = 'Small family estate; hand-picked',
  dominant_varieties = ARRAY['Typica Mejorado', 'Sidra', 'Gesha'],
  typical_processing = ARRAY['Washed', 'Oxidative']
WHERE id = '2b209822-21fe-4172-a0e6-23de890aa19a';

-- Ethiopia / Bench Sheko Highlands
UPDATE terroirs SET
  acidity_character = 'Floral-citric to malic-rounded',
  body_character = 'Tea-like to silky',
  farming_model = 'Estate-grown; shade-grown forest system; hand-picked; block-separated',
  dominant_varieties = ARRAY['Gesha 1931'],
  typical_processing = ARRAY['Washed']
WHERE id = '5791e4eb-0726-4953-8d84-36a50b1deefb';

-- Ethiopia / Guji Highlands
UPDATE terroirs SET
  acidity_character = 'Bright rounded to citric linear',
  body_character = 'Light-medium to tea-like',
  farming_model = 'Smallholders; hand-picked',
  dominant_varieties = ARRAY['Ethiopian landrace selections'],
  typical_processing = ARRAY['Washed', 'Natural']
WHERE id = '573f3286-0767-49a4-8973-1c593aa710e6';

-- Ethiopia / Sidama Highlands
UPDATE terroirs SET
  acidity_character = 'Sparkling to linear high-toned',
  body_character = 'Tea-like to medium-silky',
  farming_model = 'Smallholder, garden/forest-style under partial shade; hand-picked',
  dominant_varieties = ARRAY['JARC selections', '74110', '74112', '74158'],
  typical_processing = ARRAY['Washed', 'Natural', 'Honey']
WHERE id = '25baa521-02d2-4db5-bcbe-4c048bbc4586';

-- Ethiopia / West Arsi Highlands
UPDATE terroirs SET
  acidity_character = 'Phosphoric-sparkling to malic-rounded',
  body_character = 'Medium-silky',
  farming_model = 'Smallholder',
  dominant_varieties = ARRAY['Ethiopian landrace selections (Wolisho, Kurume types)'],
  typical_processing = ARRAY['Natural', 'Washed']
WHERE id = '0918d4d6-4896-4069-b8e9-ff66af86affa';

-- Guatemala / Chiapas Highlands
UPDATE terroirs SET
  acidity_character = 'Malic-rounded to citric-linear',
  body_character = 'Medium silky',
  farming_model = 'Smallholder + centralized wet mill; hand-picked',
  dominant_varieties = ARRAY['Bourbon', 'Caturra', 'Catuai'],
  typical_processing = ARRAY['Washed']
WHERE id = '4c529fd8-f4f4-4f15-bcb6-d61503b2806f';

-- Guatemala / Costa Rican Central Volcanic Highlands
UPDATE terroirs SET
  acidity_character = 'Citric-linear to malic-rounded',
  body_character = 'Tea-like to medium silky',
  farming_model = 'Estate-grown; hand-picked; lot-separated',
  dominant_varieties = ARRAY['Bourbon', 'Caturra', 'Java'],
  typical_processing = ARRAY['Washed']
WHERE id = 'f052b58f-fa57-4b7b-904f-6493eefada08';

-- Honduras / Marcala Highlands
UPDATE terroirs SET
  acidity_character = 'Malic rounded with light citric lift',
  body_character = 'Medium silky',
  farming_model = 'Smallholder / family estate; hand-picked; micro-mill common',
  dominant_varieties = ARRAY['Catuai', 'Bourbon', 'Pacas'],
  typical_processing = ARRAY['Washed', 'Honey']
WHERE id = '45ad39fb-f9af-435b-bf16-1a98b76be734';

-- Mexico / Chiapas Highlands
UPDATE terroirs SET
  acidity_character = 'Low-medium soft citric',
  body_character = 'Light-medium',
  farming_model = 'Smallholder estate',
  dominant_varieties = ARRAY['Garnica'],
  typical_processing = ARRAY['Natural']
WHERE id = '197d444c-e386-46ca-9e1e-1b8e256c869c';

-- Mexico / Sierra Sur Highlands
UPDATE terroirs SET
  acidity_character = 'Malic-rounded with light citric lift',
  body_character = 'Medium silky',
  farming_model = 'Smallholder / community farms; hand-picked; shade-grown forest plots',
  dominant_varieties = ARRAY['Typica', 'Bourbon', 'Mundo Novo', 'Caturra'],
  typical_processing = ARRAY['Washed', 'Natural']
WHERE id = '22922ed2-2f9b-445d-8175-34bc1a59381c';

-- Panama / Volcán Barú Highlands
UPDATE terroirs SET
  acidity_character = 'Phosphoric-sparkling to citric-linear',
  body_character = 'Tea-like to medium silky',
  farming_model = 'Estate-grown; selectively hand-picked',
  dominant_varieties = ARRAY['Gesha', 'Caturra', 'Catuai', 'Typica', 'Pacamara', 'Mokkita'],
  typical_processing = ARRAY['Washed', 'Natural', 'Honey', 'Anaerobic', 'Dark Room Dry Natural']
WHERE id = '1771a1e5-0d5d-4d0c-a7b8-8baa64780299';

-- Peru / Northern Andean Cordillera
UPDATE terroirs SET
  acidity_character = 'Malic rounded',
  body_character = 'Medium silky',
  farming_model = 'Smallholder; hand-picked',
  dominant_varieties = ARRAY['Caturra', 'Typica', 'Bourbon', 'Catimor'],
  typical_processing = ARRAY['Washed']
WHERE id = '5f55755f-b119-4de0-ad51-29329dbbd248';

-- Rwanda / Lake Kivu Highlands
UPDATE terroirs SET
  acidity_character = 'Malic-rounded to citric-clean',
  body_character = 'Tea-like to silky-medium',
  farming_model = 'Smallholder supply network coordinated through centralized washing stations',
  dominant_varieties = ARRAY['Red Bourbon'],
  typical_processing = ARRAY['Washed']
WHERE id = 'b5f6a63d-1609-4f95-a6cf-0013b90d3aae';
