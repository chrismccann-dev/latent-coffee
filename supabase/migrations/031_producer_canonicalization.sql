-- Migration 031: Producer canonicalization (Producer sprint 1l)
-- Renames `brews.producer` values to the canonical full names defined in
-- lib/producer-registry.ts (120-entry rich registry, authored by Chris
-- 2026-04-25 from his tier-based research CSVs and supplemented during
-- sprint 1l plan mode).
--
-- This is a DATA migration only — no schema change. brews.producer is a text
-- column with no FK to a producers table; canonical enforcement is code-only
-- via PRODUCER_LOOKUP in lib/producer-registry.ts. Sprint 1l also lands the
-- /add purchased step + /brews/[id]/edit picker enforcement (with allowOverride
-- escape hatch since net-new producers appear in the wild more often than
-- net-new cultivars).
--
-- Pre-migration state (2026-04-26 audit): 49 distinct producers across 55
-- brews, 0 nulls. Post-migration: ~30 distinct canonical names (collapses
-- fold multiple DB strings into single canonicals — Yusuf+Alo Village+Alo
-- Coffee → Tamiru Tadesse; Letty+Finca El Paraiso → Diego Bermúdez; etc.).
--
-- Three categories of UPDATE:
--   A. Drift renames (accent / case / spelling drift; canonical = same person)
--   B. DB-store-different-axis renames (DB has farm-only or lot-name; canonical
--      is producer name)
--   C. Collapses (DB string is a lot / outgrower group / sourcing-context;
--      canonical is the actual producer behind the lot)
--
-- 4 DB rows already have canonical names and need no UPDATE: Crispilliano
-- Contreras, Emilio Entzín, Ernedis Rodriguez, Hunter Tedman.
--
-- No producer_syntheses cache table exists (verified 2026-04-26) — no cache
-- rename needed.

-- ---------------------------------------------------------------------------
-- A. Drift renames (accent / case / spelling)
-- ---------------------------------------------------------------------------

-- Pepe Jijón / Finca Soledad (Ecuador, Imbabura) — 3 brews
UPDATE brews SET producer = 'Pepe Jijón', updated_at = now()
WHERE producer = 'Pepe Jijon, Finca Soledad';

-- Peterson Family / Hacienda La Esmeralda (Panama, Chiriquí) — 2 brews
UPDATE brews SET producer = 'Peterson Family', updated_at = now()
WHERE producer = 'The Peterson Family';

-- Abel Domínguez / Finca Liquidámbar (Honduras, La Paz) — 1 brew
-- NB: DB stored 'Blooms Coffee' as the farm field; CSV says farm = Finca
-- Liquidámbar (Blooms Coffee Honduras is the exporter).
UPDATE brews SET producer = 'Abel Domínguez', updated_at = now()
WHERE producer = 'Abel Dominguez, Blooms Coffee';

-- Jeferson Adrián Motta / Motta Farm (Colombia, Huila) — 1 brew
UPDATE brews SET producer = 'Jeferson Adrián Motta', updated_at = now()
WHERE producer = 'Jeferson Motta, Motta Farm';

-- Lamastus Family / Lamastus Family Estates (Panama, Chiriquí) — 1 brew
-- DB string carries sub-estate suffix "El Burro"; canonical drops it.
UPDATE brews SET producer = 'Lamastus Family', updated_at = now()
WHERE producer = 'Lamastus Family, El Burro';

-- Lamastus Family — Elida is another Lamastus sub-estate, also collapses.
UPDATE brews SET producer = 'Lamastus Family', updated_at = now()
WHERE producer = 'Elida Estate';

-- Nguisse Nare / Setame (Ethiopia, Sidama) — 1 brew. DB string carries
-- outgrower-group context ("and Murago Outgrowers"); per Chris's plan-mode
-- confirmation, canonical drops the suffix.
UPDATE brews SET producer = 'Nguisse Nare', updated_at = now()
WHERE producer = 'Nguisse Nare and Murago Outgrowers';

-- Rodrigo Sánchez Valencia / Finca El Edén (Colombia, Huila) — 1 brew
UPDATE brews SET producer = 'Rodrigo Sánchez Valencia', updated_at = now()
WHERE producer = 'Rodrigo Sanchez, El Eden';

-- Sebastián Ramírez / El Placer Farms (Colombia, Quindío) — 1 brew
UPDATE brews SET producer = 'Sebastián Ramírez', updated_at = now()
WHERE producer = 'Sebastian Ramirez';

-- Yessica & Diego Parra / Finca El Mirador (Colombia, Huila) — 1 brew
UPDATE brews SET producer = 'Yessica & Diego Parra', updated_at = now()
WHERE producer = 'Yessica and Diego Parra, El Mirador';

-- Tagel Alemayehu / Olkai Coffee (Ethiopia, Guji) — 1 brew. Drop farm suffix
-- (DB stored "Person, Farm"; canonical is person-only since Olkai Coffee is
-- already encoded as ProducerEntry.farmName in the registry).
UPDATE brews SET producer = 'Tagel Alemayehu', updated_at = now()
WHERE producer = 'Tagel Alemayehu, Olkai Coffee';

-- ---------------------------------------------------------------------------
-- B. DB-stored-different-axis renames (farm-only / lot-only → producer)
-- ---------------------------------------------------------------------------

-- Tamiru Tadesse / Alo Coffee (Ethiopia, Sidama) — DB had farm-only string.
UPDATE brews SET producer = 'Tamiru Tadesse', updated_at = now()
WHERE producer = 'Alo Coffee';

-- Mario Samuel Mejía Rodríguez / Finca El Jardín (Honduras, La Paz) — DB had
-- farm-only.
UPDATE brews SET producer = 'Mario Samuel Mejía Rodríguez', updated_at = now()
WHERE producer = 'Finca El Jardín';

-- Olina Cai / Project One Light (China, Yunnan) — DB had project-name only.
-- Per Chris's plan-mode confirmation: Project One = Olina Cai / Project One Light.
UPDATE brews SET producer = 'Olina Cai', updated_at = now()
WHERE producer = 'Project One';

-- Rigoberto & Luis Eduardo Herrera / Café Granja La Esperanza (Colombia,
-- Valle del Cauca / Cundinamarca) — DB had farm-only.
UPDATE brews SET producer = 'Rigoberto & Luis Eduardo Herrera', updated_at = now()
WHERE producer = 'Cafe Granja la Esperanza';

-- Aurelio Villatoro / Finca Villaure (Guatemala, Huehuetenango) — DB had a
-- "del Cerro" partial that mapped to "Punta del Cerro" (a Villatoro farm).
UPDATE brews SET producer = 'Aurelio Villatoro', updated_at = now()
WHERE producer = 'Aurelio del Cerro';

-- Asefa & Mulugeta Dukamo / Buncho (Station 1029) (Ethiopia, Sidama Bensa) —
-- DB had farm-with-context string.
UPDATE brews SET producer = 'Asefa & Mulugeta Dukamo', updated_at = now()
WHERE producer = 'Buncho, Daye Bensa';

-- Carlos Fernández Morera / Finca El Cerro (El Diamante) (Costa Rica, West
-- Valley) — DB had short-name + farm-suffix.
UPDATE brews SET producer = 'Carlos Fernández Morera', updated_at = now()
WHERE producer = 'Carlos Morera, El Diamante';

-- Carlos Franceschi / Carmen Estate (Panama, Chiriquí) — DB had farm-only.
UPDATE brews SET producer = 'Carlos Franceschi', updated_at = now()
WHERE producer = 'Carmen Estate';

-- Daterra (Luis Pascoal) / Daterra (Brazil, Cerrado Mineiro) — DB had short-name.
UPDATE brews SET producer = 'Daterra (Luis Pascoal)', updated_at = now()
WHERE producer = 'Daterra Farm';

-- Dinesh Kumar / Magma Coffee (Panama, Chiriquí Cordillera) — DB had a verbose
-- importer-context string ("Importer: Marcus Duran (Adaura Coffee)"); canonical
-- is just person.
UPDATE brews SET producer = 'Dinesh Kumar', updated_at = now()
WHERE producer = 'Dinesh Kumar, Importer: Marcus Duran (Adaura Coffee)';

-- Ricardo & Victoria Koyner / Kotowa (Panama, Chiriquí Boquete) — DB had
-- two sourcing-context variants for the same Kotowa producer.
UPDATE brews SET producer = 'Ricardo & Victoria Koyner', updated_at = now()
WHERE producer IN ('Direct with Kotowa', 'Rio Cristal - Kotowa');

-- Eduardo "Lalo" González / Finca Don Eduardo (Panama, Chiriquí Boquete) —
-- DB had farm-only.
UPDATE brews SET producer = 'Eduardo "Lalo" González', updated_at = now()
WHERE producer = 'Don Eduardo';

-- Juan Diego de la Cerda / Finca El Socorro (Guatemala, Palencia) — DB had
-- farm-only.
UPDATE brews SET producer = 'Juan Diego de la Cerda', updated_at = now()
WHERE producer = 'El Socorro';

-- Juan Felipe Ocampo / Finca La Reserva (Colombia, Antioquia) — DB had farm-only.
UPDATE brews SET producer = 'Juan Felipe Ocampo', updated_at = now()
WHERE producer = 'Finca La Reserva';

-- Aliyah Shah / Finca Faith (Colombia, Quindío) — DB had farm-only.
UPDATE brews SET producer = 'Aliyah Shah', updated_at = now()
WHERE producer = 'Finca Faith';

-- Jairo Arcila / Finca Santa Monica (Colombia, Quindío) — DB had farm-only.
UPDATE brews SET producer = 'Jairo Arcila', updated_at = now()
WHERE producer = 'Finca Santa Monica';

-- Rachel Samuel and Adam Overton / Gesha Village (Ethiopia, Bench Maji) —
-- DB had farm-with-suffix.
UPDATE brews SET producer = 'Rachel Samuel and Adam Overton', updated_at = now()
WHERE producer = 'Gesha Village Coffee Estate';

-- Henry Bonilla Murcia / El Arrayan, La Florida (Colombia, Huila El Pital) —
-- DB had short-name.
UPDATE brews SET producer = 'Henry Bonilla Murcia', updated_at = now()
WHERE producer = 'Henry Bonilla';

-- Jamison Savage / Finca Deborah, Iris, Morgan (Panama, Volcán) — DB had
-- short-name + sourcing-context suffix.
UPDATE brews SET producer = 'Jamison Savage', updated_at = now()
WHERE producer = 'Jamison Savage, Direct with Savage Coffees';

-- Jorge "Pikudo" Andrade — DB used single-quotes around "Pikudo"; canonical
-- uses double-quotes.
UPDATE brews SET producer = 'Jorge "Pikudo" Andrade', updated_at = now()
WHERE producer = E'Jorge \'Pikudo\' Andrade';

-- Julio César Madrid Tisnés / Finca La Riviera (Colombia, Risaralda) — DB
-- had short-name + farm.
UPDATE brews SET producer = 'Julio César Madrid Tisnés', updated_at = now()
WHERE producer = 'Julio Madrid, La Riviera';

-- Assefa Dukamo / Kokose (Koko) (Ethiopia, Sidama Bensa) — DB had short-form
-- of farm name only.
UPDATE brews SET producer = 'Assefa Dukamo', updated_at = now()
WHERE producer = 'Koko';

-- Mama Cata Estate (Garrido Family) / Mama Cata Estate (Panama, Chiriquí) —
-- DB had farm-with-exporter slash; canonical encodes both family and farm.
UPDATE brews SET producer = 'Mama Cata Estate (Garrido Family)', updated_at = now()
WHERE producer = 'Mama Cata Estate / Garrido Specialty Coffee';

-- Miguel Estela / El Morito Producer's Association (Peru, Cajamarca) — DB
-- had person + farm; canonical drops the farm suffix (encoded in registry
-- as ProducerEntry.farmName). Skeleton entry pending rich research.
UPDATE brews SET producer = 'Miguel Estela', updated_at = now()
WHERE producer = E'Miguel Estela, El Morito Producer\'s Association';

-- Aimé Dusabe Gahizi / Gitesi (Rwanda, Karongi) — DB had short-name + farm
-- + station context.
UPDATE brews SET producer = 'Aimé Dusabe Gahizi', updated_at = now()
WHERE producer = 'Aime Gahizi, Gitesi Washing Station';

-- Roque Sánchez Cruz / Rancho Momokiemo (Mexico, Chiapas Coapilla) — DB had
-- farm-with-plural suffix.
UPDATE brews SET producer = 'Roque Sánchez Cruz', updated_at = now()
WHERE producer = 'Momokiemo Producers';

-- Julian Holguín Ramos / Inmaculada Coffee Farms (Colombia, Valle del Cauca)
-- — DB had family-name only; canonical is full name.
UPDATE brews SET producer = 'Julian Holguín Ramos', updated_at = now()
WHERE producer = 'The Holguin Family';

-- ---------------------------------------------------------------------------
-- C. Collapses (lot / village / outgrower / sourcing-context → real producer)
-- ---------------------------------------------------------------------------

-- Yusuf Natural is an Alo Coffee lot — Tamiru Tadesse is the producer.
UPDATE brews SET producer = 'Tamiru Tadesse', updated_at = now()
WHERE producer = 'Yusuf';

-- Alo Village = Alo Coffee = Tamiru Tadesse (per Chris's plan-mode note).
UPDATE brews SET producer = 'Tamiru Tadesse', updated_at = now()
WHERE producer = 'Alo Village';

-- Ninga Washing Station is the third Burundi station of the Long Miles
-- Coffee Project (per Chris's plan-mode note).
UPDATE brews SET producer = 'Long Miles Coffee Project', updated_at = now()
WHERE producer = 'Local producers surrounding Ninga washing station';

-- Letty is a lot name; producer is Diego Samuel Bermúdez Tapia / Finca El
-- Paraíso (Cauca / Piendamó).
UPDATE brews SET producer = 'Diego Samuel Bermúdez Tapia', updated_at = now()
WHERE producer = 'Letty Bermudez';

-- Nordic Approach is the Norwegian green-coffee importer; per Chris's plan-
-- mode research the actual producer for this brew is Mekuria Mergia & Elias
-- Rooba (Ethiopia, Goro Bedessa).
UPDATE brews SET producer = 'Mekuria Mergia & Elias Rooba', updated_at = now()
WHERE producer = 'Nordic Approach';

-- Finca El Paraiso DB row (1 brew: "El Paraiso Lychee" from Hydrangea
-- Coffee, Cauca, Castillo, Double Anaerobic Thermal Shock) — disambiguated
-- to Diego Samuel Bermúdez Tapia (Cauca / Piendamó / lychee benchmark).
-- Note: there's also an Ernedis Rodriguez who farms a different "Finca
-- El Paraíso" in Huila / Gigante; that brew is stored under the Ernedis
-- Rodriguez producer string today and is not affected.
UPDATE brews SET producer = 'Diego Samuel Bermúdez Tapia', updated_at = now()
WHERE producer = 'Finca El Paraiso';
