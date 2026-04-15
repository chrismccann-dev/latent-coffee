-- Migration 006: Data Integrity Cleanup
-- Fixes terroir duplicates/naming, cultivar duplicates, and backfills all missing FKs.
-- Run via Supabase SQL Editor.

-- ============================================
-- PHASE 1: CULTIVAR CLEANUP
-- ============================================

-- 1a. Merge duplicate Gesha cultivars
-- "Gesha (Colombian selection)" → merge into "Colombian Gesha selection"
-- "Gesha (Panamanian selection)" → merge into "Panamanian Gesha selection"
-- No brew FKs point to these yet, so safe to delete.
DELETE FROM cultivars WHERE id = '0fabd30d-fd12-417a-af24-365f588d2217'; -- Gesha (Colombian selection)
DELETE FROM cultivars WHERE id = 'd97adf07-8641-4e02-91bd-c16a3c1b1eee'; -- Gesha (Panamanian selection)

-- 1b. Merge "Sidra Bourbon" into "Sidra"
DELETE FROM cultivars WHERE id = '4e7182e4-1153-4690-b951-b22ca8b63871'; -- Sidra Bourbon

-- 1c. Merge "Mejorado" into "Typica Mejorado"
DELETE FROM cultivars WHERE id = '465146be-574f-4a57-ab33-f86deca0ac0e'; -- Mejorado

-- 1d. Normalize genetic_family naming: "x" → "×" (proper multiplication sign)
UPDATE cultivars SET genetic_family = 'Typica × Bourbon Crosses'
WHERE genetic_family IN ('Typica x Bourbon Crosses', 'Typica × Bourbon Crosses');

-- 1e. Fix Sidra lineage to use consistent naming
UPDATE cultivars SET lineage = 'Typica × Bourbon cross lineage'
WHERE id = 'a4ce33c3-6f4a-4b9e-b5ba-ecbc1be71531'; -- Sidra


-- ============================================
-- PHASE 2: TERROIR CLEANUP
-- ============================================

-- 2a. Delete empty Panama duplicate ("Chiriquí Province" has 0 brews; "Chiriquí" has 13)
DELETE FROM terroirs WHERE id = 'd7fe6a44-f27b-4ef8-97cc-e12a32cdddca';

-- 2b. Colombia Quindío: merge "Central Andean Cordillera"/Calarcá into "Central Cordillera"/Filandia
-- Move brew(s) to the surviving record
UPDATE brews SET terroir_id = 'f9d0de9d-b3d7-44a4-b0e8-207b467d154e'
WHERE terroir_id = '412d003a-03c1-4a0f-8bd2-dbbb4f5d1f2b';
-- Update meso_terroir to include both
UPDATE terroirs SET meso_terroir = 'Filandia, Calarcá'
WHERE id = 'f9d0de9d-b3d7-44a4-b0e8-207b467d154e';
-- Delete the duplicate
DELETE FROM terroirs WHERE id = '412d003a-03c1-4a0f-8bd2-dbbb4f5d1f2b';

-- 2c. Colombia Antioquia: merge "Western Cordillera"/Bolívar into "Western Andean Cordillera"/Ciudad Bolívar
-- (Ciudad Bolívar highlands has more context data; renaming macro to "Western Cordillera")
-- Must delete duplicate BEFORE renaming survivor to avoid unique constraint violation.
UPDATE brews SET terroir_id = 'd606b3ad-46a0-4c0d-8a90-13fb70818011'
WHERE terroir_id = '7b9a3391-f997-48b7-bb5f-3187429f6dfa';
DELETE FROM terroirs WHERE id = '7b9a3391-f997-48b7-bb5f-3187429f6dfa';
UPDATE terroirs SET
  macro_terroir = 'Western Cordillera',
  meso_terroir = 'Ciudad Bolívar highlands'
WHERE id = 'd606b3ad-46a0-4c0d-8a90-13fb70818011';

-- 2d. Colombia Valle del Cauca: merge "Western Cordillera"/Trujillo into "Western Andean Cordillera"/Trujillo highlands
-- (Trujillo highlands record has more context data; renaming macro to "Western Cordillera")
UPDATE brews SET terroir_id = '80c8ee17-6beb-4dad-b4bf-cc8863e19a5a'
WHERE terroir_id = '0a495b8b-c25b-461a-b0d6-636a4bbb45a7';
DELETE FROM terroirs WHERE id = '0a495b8b-c25b-461a-b0d6-636a4bbb45a7';
UPDATE terroirs SET macro_terroir = 'Western Cordillera'
WHERE id = '80c8ee17-6beb-4dad-b4bf-cc8863e19a5a';

-- 2e. Ethiopia: merge "Bench Sheko Highlands" into "Gesha-Bench Sheko Highlands"
-- (Gesha-Bench Sheko has why_it_stands_out; update admin_region to modern "Bench Sheko")
UPDATE brews SET terroir_id = '5791e4eb-0726-4953-8d84-36a50b1deefb'
WHERE terroir_id = '94a003d9-a490-4a11-887f-015de4b655fa';
DELETE FROM terroirs WHERE id = '94a003d9-a490-4a11-887f-015de4b655fa';
UPDATE terroirs SET
  admin_region = 'Bench Sheko',
  meso_terroir = 'Gesha Village Estate'
WHERE id = '5791e4eb-0726-4953-8d84-36a50b1deefb';

-- 2f. Guatemala: fix wrong macro_terroir names
-- "Costa Rican Central Volcanic Highlands" → "Guatemala Central Volcanic Highlands"
UPDATE terroirs SET macro_terroir = 'Guatemala Central Volcanic Highlands'
WHERE id = 'f052b58f-fa57-4b7b-904f-6493eefada08';

-- "Chiapas Highlands" (Huehuetenango) → "Cuchumatanes Highlands"
UPDATE terroirs SET macro_terroir = 'Cuchumatanes Highlands'
WHERE id = '4c529fd8-f4f4-4f15-bcb6-d61503b2806f';


-- ============================================
-- PHASE 3: FIX MISSING TERROIR LINKS
-- ============================================

-- 3a. Link 2 Ecuador brews to existing Northern Ecuador Andean Highlands / Intag Valley terroir
UPDATE brews SET terroir_id = '2b209822-21fe-4172-a0e6-23de890aa19a'
WHERE id = '643c6b5d-609c-4a1b-944a-4264ecc0df02' AND terroir_id IS NULL; -- Finca Soledad Mejorado

UPDATE brews SET terroir_id = '2b209822-21fe-4172-a0e6-23de890aa19a'
WHERE id = '950728e4-6448-413d-b5e0-d974685a451d' AND terroir_id IS NULL; -- Sidra Cold Fermented Washed


-- ============================================
-- PHASE 4: BACKFILL BREW → GREEN BEAN LINKS
-- ============================================

-- 4 self-roasted brews should link to their green_bean records
UPDATE brews SET green_bean_id = '6756d000-9581-4f1a-8b04-269d11a9888e'
WHERE id = '23428ff3-fa18-4618-93af-13f47719c329'; -- Gesha Village Oma

UPDATE brews SET green_bean_id = 'a2010599-7837-427f-85d9-6b414505727b'
WHERE id = 'f7794795-f63b-4117-9d3a-325757d2f383'; -- Gesha Village Surma

UPDATE brews SET green_bean_id = '25bc4034-63b7-43c5-831d-0335c0f75f89'
WHERE id = '21aa1171-52ca-4ff5-bfee-ea9467e01f97'; -- Guatemala El Socorro Java

UPDATE brews SET green_bean_id = 'b952f657-242b-4213-979e-40425683b3d9'
WHERE id = '6ccd48d8-7987-413d-84da-0c6ef0dcefa9'; -- Guatemala Libertad


-- ============================================
-- PHASE 5: BACKFILL GREEN BEAN → TERROIR/CULTIVAR
-- ============================================

-- Gesha Village Oma → Ethiopia / Gesha-Bench Sheko Highlands + Gesha 1931
UPDATE green_beans SET
  terroir_id = '5791e4eb-0726-4953-8d84-36a50b1deefb',
  cultivar_id = '1934018e-81b6-4c95-8f84-ec181862bc58'
WHERE id = '6756d000-9581-4f1a-8b04-269d11a9888e';

-- Gesha Village Surma → Ethiopia / Gesha-Bench Sheko Highlands + Gesha 1931
UPDATE green_beans SET
  terroir_id = '5791e4eb-0726-4953-8d84-36a50b1deefb',
  cultivar_id = '1934018e-81b6-4c95-8f84-ec181862bc58'
WHERE id = 'a2010599-7837-427f-85d9-6b414505727b';

-- Guatemala El Socorro → Guatemala Central Volcanic Highlands + Java
UPDATE green_beans SET
  terroir_id = 'f052b58f-fa57-4b7b-904f-6493eefada08',
  cultivar_id = '4026df68-4a4f-46d5-9aee-ab2f012e99ac'
WHERE id = '25bc4034-63b7-43c5-831d-0335c0f75f89';

-- Guatemala Libertad → Cuchumatanes Highlands + Bourbon/Caturra blend
UPDATE green_beans SET
  terroir_id = '4c529fd8-f4f4-4f15-bcb6-d61503b2806f',
  cultivar_id = '184d38ca-7af2-4402-97e2-f7f5ead828e9'
WHERE id = 'b952f657-242b-4213-979e-40425683b3d9';


-- ============================================
-- PHASE 6: BACKFILL BREW → CULTIVAR
-- ============================================

-- Map every brew to its canonical cultivar using the import JSON data.
-- Post-merge cultivar names are used (duplicates already deleted above).

-- Colombian Gesha selection (1926024c)
UPDATE brews SET cultivar_id = '1926024c-9bc6-4cf7-bfb7-017fc955e799'
WHERE id IN (
  '1e0b7b28-752f-4f3c-aced-a56cff802f0f', -- Finca Faith Washed Geisha
  'c68841ad-b9da-4e9e-8954-6959ae460f01', -- Finca La Reserva Cattleya
  'c8a5ce46-3fa2-46fa-8ead-1e2f8a3d68ad', -- El Mirador Natural Gesha
  '3aef599b-8339-45eb-ae9b-5e91d6eda123', -- Washed Gesha Black Moon Picolot
  '21c7ce72-0cbf-4729-8858-f1cee83d3471', -- Jeferson Motta Anaerobic Washed Gesha
  'e7a82e0a-7c9c-41cd-b5da-9d5b9589361e', -- Gesha Natural Inmaculada Hydrangea
  '5b6530c0-4bc9-46b9-a00f-722412ac7aff', -- Letty Bermudez
  '2fdfbb95-3582-46e8-8262-9c2422809bb3', -- Gesha White Honey Sebastian Ramirez
  '0b708859-a9af-4b57-a13a-5ea6c3afabf4'  -- Finca La Reserva Gesha
);

-- Panamanian Gesha selection (cb1e1af2)
UPDATE brews SET cultivar_id = 'cb1e1af2-49d4-4f6a-913d-7590bba5068d'
WHERE id IN (
  '49bc0e95-6f8e-4c1d-8ebe-fce33b9c8a53', -- Magma Coffee Washed Gesha
  'c5632cef-fe0b-4526-b1a5-5ea29da24c5f', -- Gesha Palomar Carmen Estate
  'ba2caa10-cbc8-4b90-bb81-3782d8b8cabb', -- Panama Elida Dark Room
  '903a364a-2877-44dc-b60c-f1529d9ba6b4', -- Crispilliano Contreras
  '1e84af99-f059-46e1-af0e-34f1c3329755', -- Panama Deborah Echo
  '7b54b706-ddc5-4148-8777-237ad8ffd728', -- Lamastus El Burro
  'c61e2b66-5e82-457a-b85d-b7d7d58d15b6', -- Esmeralda Buenos Aires
  '314c342f-d63e-4e3c-891e-b1a8de7cdc2b', -- Gesha Natural El Velo Esmeralda
  'dcad1ffa-f2bc-443c-9cd1-f18e27fe1b1f'  -- Gesha Horizon Don Eduardo
);

-- Gesha 1931 (1934018e)
UPDATE brews SET cultivar_id = '1934018e-81b6-4c95-8f84-ec181862bc58'
WHERE id IN (
  'f7794795-f63b-4117-9d3a-325757d2f383', -- Gesha Village Surma
  '23428ff3-fa18-4618-93af-13f47719c329'  -- Gesha Village Oma
);

-- Gesha generic (7a8a173a) — for Gesha brews without known specific selection
UPDATE brews SET cultivar_id = '7a8a173a-b81e-45d0-809c-de4c408ce61c'
WHERE id = 'fd7c6ec1-bb13-4ec3-b167-c665547a57f6'; -- Brazil Daterra Geisha

-- Gesha (Brazilian Selection) (9db53534)
UPDATE brews SET cultivar_id = '9db53534-eab7-474a-b92f-74872f32c332'
WHERE id = '9abeb327-6eef-42bf-980d-8a243e9ceb26'; -- Brazil Anaerobic Natural Gesha

-- 74158/74110/74112 blend (db4fad06)
UPDATE brews SET cultivar_id = 'db4fad06-8f72-4aac-bbc5-cbbef4866bf3'
WHERE id = 'cb4c9bbc-018c-437f-8648-f74b05098b04'; -- Buncho Honey

-- 74110/74112 (fb96e464)
UPDATE brews SET cultivar_id = 'fb96e464-397b-447e-b6ae-b2fab4845f52'
WHERE id = 'ba1740c3-b57b-42e5-92f6-b6a804d2f96d'; -- Ethiopia Tagel Alemayehu

-- 74158 (08a53114)
UPDATE brews SET cultivar_id = '08a53114-31b2-4938-94d8-98fe745d15d2'
WHERE id IN (
  '7bbf561e-cc48-4c9d-bb3d-12e3a52836a9', -- Tamiru Tadesse White Honey
  'ecad5cba-4491-4868-bcb3-463d39642636', -- Setame Natural 74158
  'd3bf9ff6-5608-41bf-b0e0-d795fcc4a161', -- MSW1 Moon Shadow Washed 74158
  'b6975998-3ff2-4d3f-b1b5-137eb237f24d'  -- Yusuf Natural
);

-- Typica Mejorado (e5752a92)
UPDATE brews SET cultivar_id = 'e5752a92-78ee-4578-af44-176171295ce1'
WHERE id IN (
  'd6c43257-e09f-44c5-aa88-ebbc262037c3', -- Finca Soledad TyOxidator
  '643c6b5d-609c-4a1b-944a-4264ecc0df02'  -- Finca Soledad Mejorado
);

-- Bourbon Aruzi (001c404e)
UPDATE brews SET cultivar_id = '001c404e-4c35-48f2-a477-24aee3844ab3'
WHERE id = 'ffc53a3b-0931-43af-a2c9-1ed4dfd5545f'; -- Jairo Arcila Bourbon Aruzi

-- Pacamara (8cf189aa)
UPDATE brews SET cultivar_id = '8cf189aa-2b25-4abf-8f22-5bc065a49f5c'
WHERE id IN (
  '7e34244b-73ab-4076-88de-6ca33a507502', -- Rio Cristal Natural Pacamara
  '52f8be46-94b7-4ec4-a08b-50afbd1032c3'  -- Pacamara Natural Kotowa
);

-- Laurina (71ccda24)
UPDATE brews SET cultivar_id = '71ccda24-813e-498e-b345-c65ab7de924c'
WHERE id = 'aac96c4d-7f8b-4455-84dd-9910fc247e41'; -- La Esperanza Natural Laurina

-- Mokkita (2109b2fc)
UPDATE brews SET cultivar_id = '2109b2fc-3724-4ce2-b0cd-efb62a8a502b'
WHERE id = '874b021f-0a5a-48c1-b6ec-fc0416e6f607'; -- Garrido Mokkita

-- Garnica (e1e3b317)
UPDATE brews SET cultivar_id = 'e1e3b317-f6e5-4ab7-aff7-a433d11702c9'
WHERE id = 'c66302a0-979e-4a41-9536-6df89c2fa4d2'; -- Emilio Entzín Garnica

-- Pink Bourbon (23ca9d8b)
UPDATE brews SET cultivar_id = '23ca9d8b-d75b-46ec-9d23-1f504546df40'
WHERE id = '3e781561-7bf7-405e-ba57-b712f2756932'; -- El Jardín Pink Bourbon

-- Catuaí (73c4bd41)
UPDATE brews SET cultivar_id = '73c4bd41-047e-4ee3-b920-9da9f0a81e02'
WHERE id = 'fd2f0a72-83e9-4d6f-ad9c-4aca75287a98'; -- Abel Dominguez Catuai

-- Sidra (a4ce33c3) — post-merge, includes former "Sidra Bourbon"
UPDATE brews SET cultivar_id = 'a4ce33c3-6f4a-4b9e-b5ba-ecbc1be71531'
WHERE id IN (
  'd14fc3e9-f0a0-41b0-b4e3-32721b3c5040', -- Colombia Sidra Bourbon Sakura
  '8b62b355-cbf7-4de2-9a2f-27b27337547f', -- Ernedis Rodriguez Sidra
  '950728e4-6448-413d-b5e0-d974685a451d'  -- Sidra Cold Fermented Washed
);

-- Ethiopian landrace population (dc73c6cd)
UPDATE brews SET cultivar_id = 'dc73c6cd-b218-4ff6-8bee-ce995fcad105'
WHERE id IN (
  '4884a010-a981-49ae-ab0f-34d8b650dc17', -- Ethiopian Landrace Washed Koko
  '05e3c387-cc23-4952-a1ad-ccd8cdde6687'  -- Ethiopia Burtukaana Goro Bedesa
);

-- Purple Caturra (ac55be18)
UPDATE brews SET cultivar_id = 'ac55be18-24f0-4504-a8a6-ab3f46ea81bc'
WHERE id = '29bf7bb3-0ce6-4616-a028-1fa17aa47664'; -- El Eden Tamarind

-- Marsellesa (09e42b01)
UPDATE brews SET cultivar_id = '09e42b01-dff1-48dd-bd1c-731068b96430'
WHERE id = '2b251847-24cb-4095-abe7-ccc6880be848'; -- Mexico CoE Momokiemo

-- Caturra (a9068464)
UPDATE brews SET cultivar_id = 'a9068464-ce15-4aaa-ba56-e5c76ff17de4'
WHERE id = 'c6069e30-3026-4040-bb9c-aed6ed0a7125'; -- El Diamante Caturra

-- Red Bourbon (cda05d83)
UPDATE brews SET cultivar_id = 'cda05d83-29b1-4c0a-a12c-c7568ee41e9b'
WHERE id = '94fb57ac-c04a-49ef-b281-97de4d0e9c46'; -- Rwanda Gitesi Red Bourbon

-- Red Bourbon / Mibirizi blend (ab5e492d)
UPDATE brews SET cultivar_id = 'ab5e492d-464e-42eb-a363-2ae4e9c507c0'
WHERE id = '08cdfd6e-4113-4e8b-8835-f788ba7f124a'; -- Burundi Ninga Hill

-- Sudan Rume (87d2f24a)
UPDATE brews SET cultivar_id = '87d2f24a-9720-4a3a-ad70-ef0163a3ee1b'
WHERE id = '0a6690c0-608d-4410-9c57-ab8fcc601ccb'; -- Sudan Rume Henry Bonilla

-- Maracaturra (bfd3f87f)
UPDATE brews SET cultivar_id = 'bfd3f87f-be8a-4a66-807d-3136376aec1f'
WHERE id = 'df2dbc7c-d3f9-4aa3-b4df-e210b0f31b02'; -- Peru Miguel Estela

-- Bourbon / Caturra blend (184d38ca)
UPDATE brews SET cultivar_id = '184d38ca-7af2-4402-97e2-f7f5ead828e9'
WHERE id = '6ccd48d8-7987-413d-84da-0c6ef0dcefa9'; -- Guatemala Libertad

-- Java (4026df68)
UPDATE brews SET cultivar_id = '4026df68-4a4f-46d5-9aee-ab2f012e99ac'
WHERE id = '21aa1171-52ca-4ff5-bfee-ea9467e01f97'; -- Guatemala El Socorro Java

-- Catimor Group (29817e43)
UPDATE brews SET cultivar_id = '29817e43-bd4a-4517-92c8-11f3b4c3ffdb'
WHERE id = '7aef16d6-2ea3-482f-ac52-d7b9e31e7162'; -- Catimor Project One Moonwake

-- Rosado (1557b09e)
UPDATE brews SET cultivar_id = '1557b09e-d20f-482d-acc5-7252b3620bed'
WHERE id = 'fd346045-b3ac-4ee2-b9e8-8dbb682e448e'; -- Anoxic Natural Rosado

-- Castillo (677530f4)
UPDATE brews SET cultivar_id = '677530f4-916f-4115-9e72-1ce21b81806b'
WHERE id = 'a881c09f-d496-4d2d-a796-4f79f16862ad'; -- El Paraiso Lychee
