-- Backfill terroir_id on brews by matching coffee_name to terroir records
-- Generated from coffee_export_data_-_april_14.json
-- Uses COALESCE to try meso-specific match first, then fall back to macro-level match

UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Colombia' AND macro_terroir = 'Central Cordillera' AND meso_terroir ILIKE '%Filandia%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Colombia' AND macro_terroir = 'Central Cordillera' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Finca Faith - Washed Geisha' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Ethiopia' AND macro_terroir = 'Sidama Highlands' AND meso_terroir ILIKE '%Bensa%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Ethiopia' AND macro_terroir = 'Sidama Highlands' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Buncho Honey' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Ethiopia' AND macro_terroir = 'Guji Highlands' AND meso_terroir ILIKE '%Hambela%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Ethiopia' AND macro_terroir = 'Guji Highlands' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Ethiopia Tagel Alemayehu' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Ecuador' AND macro_terroir = 'Northern Ecuador Andean Highlands' AND meso_terroir ILIKE '%Intag Valley%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Ecuador' AND macro_terroir = 'Northern Ecuador Andean Highlands' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Finca Soledad - TyOxidator Typica Mejorado' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Colombia' AND macro_terroir = 'Central Cordillera' AND meso_terroir ILIKE '%Santa Monica%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Colombia' AND macro_terroir = 'Central Cordillera' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Colombia Jairo Arcila - Santa Monica - Washed Bourbon Aruzi' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Panama' AND macro_terroir = 'Volcán Barú Highlands' AND meso_terroir ILIKE '%Boquete Valley%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Panama' AND macro_terroir = 'Volcán Barú Highlands' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Rio Cristal - Natural Pacamara' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Colombia' AND macro_terroir = 'Western Cordillera' AND meso_terroir ILIKE '%Trujillo%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Colombia' AND macro_terroir = 'Western Cordillera' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'La Esperanza - Natural Laurina' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Panama' AND macro_terroir = 'Volcán Barú Highlands' AND meso_terroir ILIKE '%Tierras Altas Plateau%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Panama' AND macro_terroir = 'Volcán Barú Highlands' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Magma Coffee - Washed Gesha' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Panama' AND macro_terroir = 'Volcán Barú Highlands' AND meso_terroir ILIKE '%Boquete Valley%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Panama' AND macro_terroir = 'Volcán Barú Highlands' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Gesha - Palomar Washed - Carmen Estate' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Panama' AND macro_terroir = 'Volcán Barú Highlands' AND meso_terroir ILIKE '%Boquete Valley%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Panama' AND macro_terroir = 'Volcán Barú Highlands' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Garrido - Mokkita - Natural (DRD)' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Ethiopia' AND macro_terroir = 'Sidama Highlands' AND meso_terroir ILIKE '%Bensa%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Ethiopia' AND macro_terroir = 'Sidama Highlands' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Tamiru Tadesse Tesema - Alo Village - White Honey' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Colombia' AND macro_terroir = 'Western Cordillera' AND meso_terroir ILIKE '%Bolívar%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Colombia' AND macro_terroir = 'Western Cordillera' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Finca La Reserva - Honey Anaerobic Gesha (Cattleya)' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Ethiopia' AND macro_terroir = 'Gesha-Bench Sheko Highlands' AND meso_terroir ILIKE '%Gesha Village%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Ethiopia' AND macro_terroir = 'Gesha-Bench Sheko Highlands' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Gesha Village - Surma - Lot 25/039 (Batch #25)' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Brazil' AND macro_terroir = 'Cerrado Mineiro' AND meso_terroir ILIKE '%Patrocínio%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Brazil' AND macro_terroir = 'Cerrado Mineiro' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Brazil Daterra Masterpieces - Borem Geisha - Anaerobic Natural' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Colombia' AND macro_terroir = 'Central Cordillera' AND meso_terroir ILIKE '%Southern Huila highlands (San Agustín / Pitalito belt)%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Colombia' AND macro_terroir = 'Central Cordillera' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'El Mirador - Yessica and Diego Parra - Natural Gesha' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Ethiopia' AND macro_terroir = 'Guji Highlands' AND meso_terroir ILIKE '%Guji%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Ethiopia' AND macro_terroir = 'Guji Highlands' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Setame - Nguisse Nare and Murago Outgrowers - Natural 74158 Landrace' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Panama' AND macro_terroir = 'Volcán Barú Highlands' AND meso_terroir ILIKE '%Boquete Valley%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Panama' AND macro_terroir = 'Volcán Barú Highlands' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Panama Elida - Dark Room Dry Natural Gesha' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Mexico' AND macro_terroir = 'Chiapas Highlands' AND meso_terroir ILIKE '%Tenejapa%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Mexico' AND macro_terroir = 'Chiapas Highlands' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Emilio Entzín - Garnica - Natural' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Panama' AND macro_terroir = 'Volcán Barú Highlands' AND meso_terroir ILIKE '%Tierras Altas plateau%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Panama' AND macro_terroir = 'Volcán Barú Highlands' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = '2025 Crispilliano Contreras × Lost Origin Panama' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Colombia' AND macro_terroir = 'Southern Andean Cordillera' AND meso_terroir ILIKE '%Pitalito belt%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Colombia' AND macro_terroir = 'Southern Andean Cordillera' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'El Jardín - Pink Bourbon - Anaerobic Washed' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Honduras' AND macro_terroir = 'Marcala Highlands' AND meso_terroir ILIKE '%Liquidambar zone%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Honduras' AND macro_terroir = 'Marcala Highlands' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Abel Dominguez - Blooms Coffee - Washed Catuai' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Ethiopia' AND macro_terroir = 'Sidama Highlands' AND meso_terroir ILIKE '%Bensa%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Ethiopia' AND macro_terroir = 'Sidama Highlands' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'MSW1 Moon Shadow Washed 74158 - Ethiopia' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Colombia' AND macro_terroir = 'Macizo Colombiano' AND meso_terroir ILIKE '%Pitalito, Laboyos Valley%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Colombia' AND macro_terroir = 'Macizo Colombiano' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Colombia Sidra Bourbon - Washed Sakura Co-Ferment' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Panama' AND macro_terroir = 'Volcán Barú Highlands' AND meso_terroir ILIKE '%Alto Quiel ridge%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Panama' AND macro_terroir = 'Volcán Barú Highlands' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Washed Gesha - Black Moon - Picolot' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Brazil' AND macro_terroir = 'Cerrado Mineiro' AND meso_terroir ILIKE '%Patrocínio Plateau%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Brazil' AND macro_terroir = 'Cerrado Mineiro' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Brazil Anaerobic Natural Gesha' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Ethiopia' AND macro_terroir = 'Sidama Highlands' AND meso_terroir ILIKE '%Bona (Bona Zuria)%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Ethiopia' AND macro_terroir = 'Sidama Highlands' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Ethiopian Landrace Washed - Koko - Sey' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Panama' AND macro_terroir = 'Volcán Barú Highlands' AND meso_terroir ILIKE '%Boquete Valley%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Panama' AND macro_terroir = 'Volcán Barú Highlands' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Pacamara Natural - Kotowa - Strait Coffee' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Colombia' AND macro_terroir = 'Huila Highlands' AND meso_terroir ILIKE '%Laboyos Valley%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Colombia' AND macro_terroir = 'Huila Highlands' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'El Eden Tamarind - Moonwake - Co-ferment' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Panama' AND macro_terroir = 'Volcán Barú Highlands' AND meso_terroir ILIKE '%Volcán / Tierras Altas slope%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Panama' AND macro_terroir = 'Volcán Barú Highlands' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Panama - Finca Deborah "Echo" Gesha (Washed + Cascara Infused)' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Mexico' AND macro_terroir = 'Sierra Sur Highlands' AND meso_terroir ILIKE '%San Agustín Loxicha%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Mexico' AND macro_terroir = 'Sierra Sur Highlands' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Mexico Cup of Excellence #2 - Momokiemo - Marsellesa - Washed' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Costa Rica' AND macro_terroir = 'Costa Rican Central Volcanic Highlands' AND meso_terroir ILIKE '%Alajuela Highlands%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Costa Rica' AND macro_terroir = 'Costa Rican Central Volcanic Highlands' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'El Diamante - Carlos Morera - Costa Rica - Caturra - Anaerobic Washed' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Rwanda' AND macro_terroir = 'Lake Kivu Highlands' AND meso_terroir ILIKE '%Gitesi Sector%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Rwanda' AND macro_terroir = 'Lake Kivu Highlands' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Rwanda - Gitesi #222 - Washed Red Bourbon' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Ethiopia' AND macro_terroir = 'West Arsi Highlands' AND meso_terroir ILIKE '%Nensebo%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Ethiopia' AND macro_terroir = 'West Arsi Highlands' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Yusuf Natural' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Colombia' AND macro_terroir = 'Huila Highlands' AND meso_terroir ILIKE '%Gigante ridge%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Colombia' AND macro_terroir = 'Huila Highlands' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Ernedis Rodriguez - Sidra - El Paraiso' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Panama' AND macro_terroir = 'Volcán Barú Highlands' AND meso_terroir ILIKE '%Boquete Valley%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Panama' AND macro_terroir = 'Volcán Barú Highlands' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Lamastus Family El Burro Lot #16- ASD Natural Gesha - Panama' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Panama' AND macro_terroir = 'Volcán Barú Highlands' AND meso_terroir ILIKE '%Jaramillo, Boquete%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Panama' AND macro_terroir = 'Volcán Barú Highlands' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Panama Hacienda La Esmeralda Buenos Aires 8 FB' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Ecuador' AND macro_terroir = 'Northern Andean Cordillera' AND meso_terroir ILIKE '%Intag Valley%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Ecuador' AND macro_terroir = 'Northern Andean Cordillera' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Finca Soledad Mejorado' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Colombia' AND macro_terroir = 'Huila Highlands' AND meso_terroir ILIKE '%El Pital%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Colombia' AND macro_terroir = 'Huila Highlands' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Sudan Rume, Henry Bonilla, Noscoffee' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Peru' AND macro_terroir = 'Northern Andean Cordillera' AND meso_terroir ILIKE '%Cajamarca%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Peru' AND macro_terroir = 'Northern Andean Cordillera' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Peru Miguel Estela Marshell Washed' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Panama' AND macro_terroir = 'Volcán Barú Highlands' AND meso_terroir ILIKE '%Boquete Valley%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Panama' AND macro_terroir = 'Volcán Barú Highlands' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Gesha, Natural El Velo, Hacienda La Esmeralda' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Burundi' AND macro_terroir = 'Lake Kivu Highlands' AND meso_terroir ILIKE '%Ninga Hills%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Burundi' AND macro_terroir = 'Lake Kivu Highlands' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Burundi Ninga Hill Washed' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Ethiopia' AND macro_terroir = 'Guji Highlands' AND meso_terroir ILIKE '%Hambela%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Ethiopia' AND macro_terroir = 'Guji Highlands' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Ethiopia Burtukaana Goro Bedesa' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Colombia' AND macro_terroir = 'Huila Highlands' AND meso_terroir ILIKE '%Huila%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Colombia' AND macro_terroir = 'Huila Highlands' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Jeferson Motta Motta Farm - Anaerobic Washed Gesha - Colombia' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Guatemala' AND macro_terroir = 'Chiapas Highlands' AND meso_terroir ILIKE '%La Libertad Highlands%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Guatemala' AND macro_terroir = 'Chiapas Highlands' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Guatemala Libertad - Aurelio del Cerro (Batch #94)' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Guatemala' AND macro_terroir = 'Costa Rican Central Volcanic Highlands' AND meso_terroir ILIKE '%Acatenango Highlands%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Guatemala' AND macro_terroir = 'Costa Rican Central Volcanic Highlands' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Guatemala El Socorro - Java Variety (Batch #88)' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Ethiopia' AND macro_terroir = 'Bench Sheko Highlands' AND meso_terroir ILIKE '%Gesha Village Estate%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Ethiopia' AND macro_terroir = 'Bench Sheko Highlands' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Gesha Village - Oma - Lot 25/035' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Ecuador' AND macro_terroir = 'Northern Andean Cordillera' AND meso_terroir ILIKE '%Intag Valley%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Ecuador' AND macro_terroir = 'Northern Andean Cordillera' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Sidra Cold Fermented Washed - Finca Soledad Sidra - Pepe Jijon' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = (SELECT id FROM terroirs WHERE country = 'China' AND user_id = brews.user_id LIMIT 1) WHERE coffee_name = 'Catimor Yeast Anerobic Natural - Project One - Moonwake' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Colombia' AND macro_terroir = 'Western Andean Cordillera' AND meso_terroir ILIKE '%Trujillo highlands%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Colombia' AND macro_terroir = 'Western Andean Cordillera' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Gesha Natural - Finca Inmaculada - Hydrangea' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Colombia' AND macro_terroir = 'Huila Highlands' AND meso_terroir ILIKE '%Palestina%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Colombia' AND macro_terroir = 'Huila Highlands' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Anoxic Natural, Rosado' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Colombia' AND macro_terroir = 'Southern Andean Cordillera' AND meso_terroir ILIKE '%Popayán plateau%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Colombia' AND macro_terroir = 'Southern Andean Cordillera' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'El Paraiso Lychee' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Colombia' AND macro_terroir = 'Southern Andean Cordillera' AND meso_terroir ILIKE '%Popayán plateau%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Colombia' AND macro_terroir = 'Southern Andean Cordillera' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Letty Bermudez' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Panama' AND macro_terroir = 'Volcán Barú Highlands' AND meso_terroir ILIKE '%Boquete Valley%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Panama' AND macro_terroir = 'Volcán Barú Highlands' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Gesha Horizon Don Eduardo' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Colombia' AND macro_terroir = 'Central Andean Cordillera' AND meso_terroir ILIKE '%Calarcá%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Colombia' AND macro_terroir = 'Central Andean Cordillera' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Gesha, White Honey - Sebastian Ramirez - Moonwake' AND terroir_id IS NULL;
UPDATE brews SET terroir_id = COALESCE(
  (SELECT id FROM terroirs WHERE country = 'Colombia' AND macro_terroir = 'Western Andean Cordillera' AND meso_terroir ILIKE '%Ciudad Bolívar highlands%' AND user_id = brews.user_id LIMIT 1),
  (SELECT id FROM terroirs WHERE country = 'Colombia' AND macro_terroir = 'Western Andean Cordillera' AND user_id = brews.user_id LIMIT 1)
) WHERE coffee_name = 'Finca La Reserva Gesha' AND terroir_id IS NULL;
