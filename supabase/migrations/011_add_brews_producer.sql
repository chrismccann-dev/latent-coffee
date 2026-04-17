-- Migration 011: Add brews.producer column, separate it from roaster in the UI.
-- Backfill purchased-brew producer from the brewing spreadsheet Beans tab and
-- self-roasted producer from the linked green_bean record.

-- ============================================
-- SCHEMA
-- ============================================
ALTER TABLE brews ADD COLUMN IF NOT EXISTS producer text;

-- ============================================
-- SELF-ROASTED: pull producer from green_beans (4 rows)
-- ============================================
UPDATE brews
SET producer = gb.producer
FROM green_beans gb
WHERE brews.green_bean_id = gb.id
  AND gb.producer IS NOT NULL
  AND brews.producer IS NULL;

-- ============================================
-- PURCHASED: 43 rows matched to Beans tab "Producer" column
-- ============================================
UPDATE brews SET producer = 'Crispilliano Contreras' WHERE coffee_name = '2025 Crispilliano Contreras × Lost Origin Panama' AND producer IS NULL;
UPDATE brews SET producer = 'Abel Dominguez; Partnered with Blooms Coffee (export / quality partner)' WHERE coffee_name = 'Abel Dominguez - Blooms Coffee - Washed Catuai' AND producer IS NULL;
UPDATE brews SET producer = 'Tamiru Tadesse Tesema (Alo Coffee)' WHERE coffee_name = 'Alo Village - Tamiru Tadesse - Washed 74158' AND producer IS NULL;
UPDATE brews SET producer = 'Daterra Farm' WHERE coffee_name = 'Brazil Anaerobic Natural Gesha' AND producer IS NULL;
UPDATE brews SET producer = 'Buncho (daye bensa coffee)' WHERE coffee_name = 'Buncho Honey' AND producer IS NULL;
UPDATE brews SET producer = 'Local producers surrounding Ninga washing station' WHERE coffee_name = 'Burundi Ninga Hill Washed' AND producer IS NULL;
UPDATE brews SET producer = 'Project One' WHERE coffee_name = 'Catimor Yeast Anerobic Natural - Project One - Moonwake' AND producer IS NULL;
UPDATE brews SET producer = 'Julio Madrid (La Riviera farm)' WHERE coffee_name = 'Colombia Sidra Bourbon - Washed Sakura Co-Ferment' AND producer IS NULL;
UPDATE brews SET producer = 'Carlos Morera, El Diamante' WHERE coffee_name = 'El Diamante - Carlos Morera - Costa Rica - Caturra - Anaerobic Washed' AND producer IS NULL;
UPDATE brews SET producer = 'Rodrigo Sanchez, El Eden' WHERE coffee_name = 'El Eden Tamarind - Moonwake - Co-ferment' AND producer IS NULL;
UPDATE brews SET producer = 'Finca El Jardín' WHERE coffee_name = 'El Jardín - Pink Bourbon - Anaerobic Washed' AND producer IS NULL;
UPDATE brews SET producer = 'Finca El Paraiso' WHERE coffee_name = 'El Paraiso Lychee' AND producer IS NULL;
UPDATE brews SET producer = 'Ernedis Rodriguez' WHERE coffee_name = 'Ernedis Rodriguez - Sidra - El Paraiso' AND producer IS NULL;
UPDATE brews SET producer = 'Nordic Approach' WHERE coffee_name = 'Ethiopia Burtukaana Goro Bedesa' AND producer IS NULL;
UPDATE brews SET producer = 'Tagel Alemayehu, Olkai Coffee' WHERE coffee_name = 'Ethiopia Tagel Alemayehu' AND producer IS NULL;
UPDATE brews SET producer = 'Koko' WHERE coffee_name = 'Ethiopian Landrace Washed - Koko - Sey' AND producer IS NULL;
UPDATE brews SET producer = 'Finca Faith' WHERE coffee_name = 'Finca Faith - Washed Geisha' AND producer IS NULL;
UPDATE brews SET producer = 'Pepe Jijon, Finca Soledad' WHERE coffee_name = 'Finca Soledad - TyOxidator Typica Mejorado' AND producer IS NULL;
UPDATE brews SET producer = 'Pepe Jijon' WHERE coffee_name = 'Finca Soledad Mejorado' AND producer IS NULL;
UPDATE brews SET producer = 'Mama Cata Estate / Garrido Specialty Coffee' WHERE coffee_name = 'Garrido - Mokkita - Natural (DRD)' AND producer IS NULL;
UPDATE brews SET producer = 'Carmen Estate' WHERE coffee_name = 'Gesha - Palomar Washed - Carmen Estate' AND producer IS NULL;
UPDATE brews SET producer = 'Don Eduardo' WHERE coffee_name = 'Gesha Horizon Don Eduardo' AND producer IS NULL;
UPDATE brews SET producer = 'The Holguin Family' WHERE coffee_name = 'Gesha Natural - Finca Inmaculada - Hydrangea' AND producer IS NULL;
UPDATE brews SET producer = 'The Peterson Family' WHERE coffee_name = 'Gesha, Natural El Velo, Hacienda La Esmeralda' AND producer IS NULL;
UPDATE brews SET producer = 'Sebastian Ramirez' WHERE coffee_name = 'Gesha, White Honey - Sebastian Ramirez - Moonwake' AND producer IS NULL;
UPDATE brews SET producer = 'Jeferson Motta, Motta Farm' WHERE coffee_name = 'Jeferson Motta Motta Farm - Anaerobic Washed Gesha - Colombia' AND producer IS NULL;
UPDATE brews SET producer = 'Cafe Granja la Esperanza (CGLE)' WHERE coffee_name = 'La Esperanza - Natural Laurina' AND producer IS NULL;
UPDATE brews SET producer = 'Lamastus Family, El Burro' WHERE coffee_name = 'Lamastus Family El Burro Lot #16- ASD Natural Gesha - Panama' AND producer IS NULL;
UPDATE brews SET producer = 'Letty Bermudez' WHERE coffee_name = 'Letty Bermudez' AND producer IS NULL;
UPDATE brews SET producer = 'Dinesh Kumar, Importer: Marcus Duran (Adaura Coffee)' WHERE coffee_name = 'Magma Coffee - Washed Gesha' AND producer IS NULL;
UPDATE brews SET producer = 'Momokiemo Producers' WHERE coffee_name = 'Mexico Cup of Excellence #2 - Momokiemo - Marsellesa - Washed' AND producer IS NULL;
UPDATE brews SET producer = 'Tamiru Tadesse Tesema (Alo Coffee)' WHERE coffee_name = 'MSW1 Moon Shadow Washed 74158 - Ethiopia' AND producer IS NULL;
UPDATE brews SET producer = 'Rio Cristal - Kotowa' WHERE coffee_name = 'Pacamara Natural - Kotowa - Strait Coffee' AND producer IS NULL;
UPDATE brews SET producer = 'Jamison Savage, Direct with Savage Coffees' WHERE coffee_name = 'Panama - Finca Deborah "Echo" Gesha (Washed + Cascara Infused)' AND producer IS NULL;
UPDATE brews SET producer = 'Peterson family' WHERE coffee_name = 'Panama Hacienda La Esmeralda Buenos Aires 8 FB' AND producer IS NULL;
UPDATE brews SET producer = 'Miguel Estela, organized with El Morito Producer''s Association' WHERE coffee_name = 'Peru Miguel Estela Marshell Washed' AND producer IS NULL;
UPDATE brews SET producer = 'Direct with Kotowa' WHERE coffee_name = 'Rio Cristal - Natural Pacamara' AND producer IS NULL;
UPDATE brews SET producer = 'Aime Gahizi, Gitesi Washing Station' WHERE coffee_name = 'Rwanda - Gitesi #222 - Washed Red Bourbon' AND producer IS NULL;
UPDATE brews SET producer = 'Pepe Jijon / Finca Soledad' WHERE coffee_name = 'Sidra Cold Fermented Washed - Finca Soledad Sidra - Pepe Jijon' AND producer IS NULL;
UPDATE brews SET producer = 'Henry Bonilla' WHERE coffee_name = 'Sudan Rume, Henry Bonilla, Noscoffee' AND producer IS NULL;
UPDATE brews SET producer = 'Tamiru Tadesse Tesema (Alo Coffee)' WHERE coffee_name = 'Tamiru Tadesse Tesema - Alo Village - White Honey' AND producer IS NULL;
UPDATE brews SET producer = 'Hunter Tedman' WHERE coffee_name = 'Washed Gesha - Black Moon - Picolot' AND producer IS NULL;
UPDATE brews SET producer = 'Yusuf' WHERE coffee_name = 'Yusuf Natural' AND producer IS NULL;

-- Remaining 9 purchased brews: producer values sourced directly from Chris
-- (these coffees had no producer recorded in the Beans tab).
UPDATE brews SET producer = 'Jorge ''Pikudo'' Andrade' WHERE coffee_name = 'Anoxic Natural, Rosado' AND producer IS NULL;
UPDATE brews SET producer = 'Daterra Farm' WHERE coffee_name = 'Brazil Daterra Masterpieces - Borem Geisha - Anaerobic Natural' AND producer IS NULL;
UPDATE brews SET producer = 'Finca Santa Monica' WHERE coffee_name = 'Colombia Jairo Arcila - Santa Monica - Washed Bourbon Aruzi' AND producer IS NULL;
UPDATE brews SET producer = 'Yessica and Diego Parra, El Mirador' WHERE coffee_name = 'El Mirador - Yessica and Diego Parra - Natural Gesha' AND producer IS NULL;
UPDATE brews SET producer = 'Emilio Entzín' WHERE coffee_name = 'Emilio Entzín - Garnica - Natural' AND producer IS NULL;
UPDATE brews SET producer = 'Finca La Reserva' WHERE coffee_name = 'Finca La Reserva - Honey Anaerobic Gesha (Cattleya)' AND producer IS NULL;
UPDATE brews SET producer = 'Finca La Reserva' WHERE coffee_name = 'Finca La Reserva Gesha' AND producer IS NULL;
UPDATE brews SET producer = 'Elida Estate' WHERE coffee_name = 'Panama Elida - Dark Room Dry Natural Gesha' AND producer IS NULL;
UPDATE brews SET producer = 'Nguisse Nare and Murago Outgrowers' WHERE coffee_name = 'Setame - Nguisse Nare and Murago Outgrowers - Natural 74158 Landrace' AND producer IS NULL;

-- Expected after apply: 56/56 brews have producer set.

-- ============================================
-- ROASTER NAME NORMALIZATION
-- Drop "Coffee" / "Coffee Roasters" / "Cafe" suffixes on roasters Chris flagged
-- so the roaster line on the card renders consistently (e.g. "Moonwake Coffee
-- Roasters" and "Moonwake" both become "Moonwake").
-- ============================================
UPDATE brews SET roaster = 'Moonwake' WHERE roaster = 'Moonwake Coffee Roasters';
UPDATE brews SET roaster = 'Hydrangea' WHERE roaster = 'Hydrangea Coffee Roasters';
UPDATE brews SET roaster = 'Substance' WHERE roaster = 'Substance Cafe';
UPDATE brews SET roaster = 'Shoebox' WHERE roaster = 'Shoebox Coffee Roasters';
UPDATE brews SET roaster = 'Flower Child' WHERE roaster = 'Flower Child Coffee';
UPDATE brews SET roaster = 'Rose' WHERE roaster IN ('Rose Coffee', 'Rose Coffee Roasters');
UPDATE brews SET roaster = 'Bean & Bean' WHERE roaster = 'Bean & Bean Coffee Roasters';
UPDATE brews SET roaster = 'Strait' WHERE roaster IN ('Strait Coffee', 'Strait Coffee Roasters');
UPDATE brews SET roaster = 'Sey' WHERE roaster = 'Sey Coffee';
UPDATE brews SET roaster = 'Heart' WHERE roaster = 'Heart Coffee Roasters';
UPDATE brews SET roaster = 'Olympia' WHERE roaster = 'Olympia Coffee Roasters';
UPDATE brews SET roaster = 'Colibri' WHERE roaster = 'Colibri Coffee Roasters';
UPDATE brews SET roaster = 'Leaves' WHERE roaster = 'Leaves Coffee Roasters';
UPDATE brews SET roaster = 'T&M' WHERE roaster IN ('T&M Coffee', 'TM Coffee');

-- Self-roasted brews are by Chris — label them "Latent".
UPDATE brews SET roaster = 'Latent' WHERE source = 'self-roasted' AND roaster IS NULL;

-- ============================================
-- ALO COFFEE / TAMIRU TADESSE CLEANUP
-- "Alo Village - Tamiru Tadesse - Washed 74158" was missing roaster and had
-- the producer formatted as the person's full name. Producer is the farm
-- (Alo Coffee); Tamiru Tadesse is the owner's name. Process is Moonshadow
-- Washed (Shoebox's proprietary name), roaster is Shoebox.
-- The White Honey variant (by Sey) has producer "Alo Village" per Sey's listing.
-- ============================================
UPDATE brews SET roaster = 'Shoebox', producer = 'Alo Coffee', process = 'Moonshadow Washed'
  WHERE coffee_name = 'Alo Village - Tamiru Tadesse - Washed 74158';
UPDATE brews SET producer = 'Alo Village'
  WHERE coffee_name = 'Tamiru Tadesse Tesema - Alo Village - White Honey';

-- "MSW1 Moon Shadow Washed 74158 - Ethiopia" was a duplicate archive of the
-- same underlying coffee as "Alo Village - Tamiru Tadesse - Washed 74158".
-- The Alo Village row (Clarity-First) is kept; the MSW1 row is removed.
DELETE FROM brews WHERE coffee_name = 'MSW1 Moon Shadow Washed 74158 - Ethiopia';
