# Freezer Stock — Roasted Bean Inventory (brewing-agent lookup table)

> **AGENT LOOKUP TABLE — structured for the brewing process, not for human reading.** This is the
> precursor inventory for the brewing workflow: PURCHASED roasted coffees that have been degassed,
> whole-bean-Agtron-read, dosed into 15g vials, and frozen — but not yet brewed. The brewing entry
> surfaces (`.claude/skills/brew/SKILL.md`, `docs/prompts/start-brew.md`) consult this at brew time.
>
> **How to use at brew time (PURCHASED coffees only — self-roasted pulls the roasted-bean state
> from the DB via get_green_bean + get_bean_pipeline instead):**
> 1. Match by **roaster + coffee name** — the `##` heading (`<Roaster> — <Coffee>`) is the lookup
>    key. Match on substrings; tolerate word-order / punctuation drift.
> 2. On a **HIT**, seed the Coffee Brief from the record. The load-bearing pull is the **whole-bean
>    Agtron** — USE IT as the roasted-bean color; do NOT ask the operator to re-measure. Also pull
>    the spec URL, process, variety, elevation, rest window, and notes.
> 3. On a **MISS**, proceed normally (fetch the Coffee URL / ask the operator). This doc is a
>    brew-session convenience cache, NOT the source of truth — the brew row still carries the
>    authoritative data, and a miss is expected (see Maintenance).
>
> **Per-entry field shape** (consistent across every entry):
> `## <Roaster> — <Coffee>` · **Country** · **Region/Farm** · **Producer** · **Variety** ·
> **Process** · **Elevation** · **Agtron** · **Status** · **URL** · **Notes**.
>
> **Agtron field semantics** (the load-bearing field):
> - `NN.N (color descriptor)` — whole-bean Agtron taken at dose-out. Authoritative; use directly.
> - `pending` (paired with **Status:** `Resting`) — purchased + resting, not yet dosed; Agtron not
>   measured yet. Ask the operator if a color reading is needed.
> - `(reading lost — not saved)` / similar — measured but not captured; treat as unknown.
>
> **Status:** `Frozen` = dosed into 15g vials + frozen (Agtron taken) · `Resting` = purchased,
> resting out of the freezer, not yet dosed (Agtron pending).
>
> **Maintenance:** complete going forward (every newly-frozen coffee is added at pack-time, via
> the [`freezer-stock` skill](.claude/skills/freezer-stock/SKILL.md) - "add a roasted bag to my
> freezer") but intentionally NOT backfilled - older freezer coffees may be absent. A miss is
> normal.

**Total coffees:** 104

---

## Moonwake Coffee Roasters — Sebastian Ramirez El Placer — CM White Honey + Yeast Gesha (Brian Quan Collab)
**Country:** Colombia · **Region/Farm:** Quindío / El Placer · **Producer:** Sebastian Ramirez
**Variety:** Gesha · **Process:** CM White Honey + Yeast Inoculated · **Elevation:** 1800 m
**Agtron:** 85.1 (Very light color) · **Status:** Frozen (15g doses)
**URL:** https://moonwakecoffeeroasters.com/products/sebastian-ramirez-el-placer-cm-white-honey-yeast-gesha-colombia-brian-quan-collab
**Notes:** Collab with Picolot & Newbery St. Roast rest: 4–6 wks.

## Datura Coffee — HiU Los Lajones Bambu Geisha Natural
**Country:** Panama · **Region/Farm:** Boquete, Chiriqui / Los Lajones Estate · **Producer:** Graciano Cruz (HiU Coffee Farms)
**Variety:** Geisha · **Process:** Natural · **Elevation:** 1870–2100 m
**Agtron:** 76.4 (Light color) · **Status:** Frozen (15g doses)
**URL:** https://daturacoffee.com/products/hiu-los-lajones-bambu-geisha-natural
**Notes:** Bambu section of Los Lajones. Top BOP lots historically.

## Hydrangea Coffee Roasters — Sudan Rume — Natural — La Isabela
**Country:** Costa Rica · **Region/Farm:** West Valley / La Isabela · **Producer:** Max Salazar
**Variety:** Sudan Rume · **Process:** Natural · **Elevation:** 1550–1700 m
**Agtron:** 81.7 (Very light color) · **Status:** Frozen (15g doses)
**URL:** https://hydrangea.coffee/products/sudan-rume-natural-la-isabela
**Notes:** Tastes like strawberry, grape candy, baking spices. Sold out / archived.

## Purus Roastery — Viet Nam Zanya DW — Arabica Double Washed
**Country:** Vietnam · **Region/Farm:** Langbiang, Lac Duong, Lam Dong · **Producer:** Zanya Coffee / Smallholders
**Variety:** Mixed Arabica · **Process:** Double Washed · **Elevation:** 1500–1650 m
**Agtron:** 72.7 (Light color) · **Status:** Frozen (15g doses)
**URL:** https://www.instagram.com/p/DUWvcwBkbeO/
**Notes:** Extra light roast. Flavors peak 3–12 wks post-roast. Notes: lime, tamarind, pu-erh tea. Roast date on bag: 20/11/25.

## Substance Café — Panama Mi Finquita Geisha Washed
**Country:** Panama · **Region/Farm:** Los Pozos, Tierras Altas, Chiriqui / Mi Finquita · **Producer:** Ratibor & Tessie Hartmann
**Variety:** Geisha · **Process:** Washed · **Elevation:** 1650–2000 m
**Agtron:** 86.7 (Very light color) · **Status:** Frozen (15g doses)
**URL:** https://www.substancecafe.com/product/panama-mi-finquita-geisha-washed/
**Notes:** First crop from Hartmanns for Substance; direct import. Crop 2025.

## Substance Café — Ethiopia Burtukaana Goro Bedesa
**Country:** Ethiopia · **Region/Farm:** Hambela Wamena, Guji / Goro Bedessa Washing Station · **Producer:** Wete Ambela Coffee Export PLC
**Variety:** Heirloom landrace · **Process:** Natural · **Elevation:** 2370 m
**Agtron:** 90.4 (Very light color) · **Status:** Frozen (15g doses)
**URL:** https://www.substancecafe.com/product/ethiopia-burtukaana-goro-bedesa/
**Notes:** 400–600 smallholder farms. Imported via Nordic Approach. Crop 2025.

## Hydrangea Coffee Roasters — Sudan Rume — Natural — Henry Bonilla, Noscoffee
**Country:** Colombia · **Region/Farm:** El Pital, Huila / Finca La Florida · **Producer:** Henry Bonilla (via NOSCOFFEES)
**Variety:** Sudan Rume · **Process:** Natural (72hr oxidation + 24hr sealed fermentation) · **Elevation:** 1850 m
**Agtron:** 83.2 (Very light color) · **Status:** Frozen (15g doses)
**URL:** https://hydrangea.coffee/products/sudan-rume-natural-henry-bonilla
**Notes:** 72hr oxidation + 24hr sealed-can fermentation. 20-day dry.

## Hydrangea Coffee Roasters — Costa Rica Volcan Azul SL28
**Country:** Costa Rica · **Region/Farm:** West Valley / Volcan Azul · **Producer:** Alejo Castro
**Variety:** SL28 · **Process:** Anaerobic Natural · **Elevation:** 1500 m
**Agtron:** 85.7 (Very light color) · **Status:** Frozen (15g doses)
**URL:** https://hydrangea.coffee/products/costa-rica-volcan-azul-sl28
**Notes:** Mulled red wine, date, floral. 200+ yr family tradition. Award-winning. Sold out / archived.

## Picolot — Picolot #10: Aguacatillo 2100 — Elida Estate Washed DRD PA2404
**Country:** Panama · **Region/Farm:** Barú Volcano National Park / Elida Estate (Aguacatillo section) · **Producer:** Lamastus Family
**Variety:** Gesha · **Process:** Washed (DRD PA2404) · **Elevation:** 2100 m
**Agtron:** 87.7 (Very light) · **Status:** Frozen (15g doses)
**URL:** https://picolot.shop/products/picolot-10-aguacatillo-2100
**Notes:** One of highest growing areas on Elida. 8-hectare native forest plot.

## Substance Café — Panama Finca Deborah Illumination 2025
**Country:** Panama · **Region/Farm:** Chiriqui, Volcán / Finca Deborah · **Producer:** Jamison Savage
**Variety:** Geisha · **Process:** CM Washed (Carbonic Maceration + pulped honey drying) · **Elevation:** 2000 m
**Agtron:** 83.2 (Very light color) · **Status:** Frozen (15g doses)
**URL:** https://www.substancecafe.com/product/panama-finca-deborah-illumination-2025/
**Notes:** Extended CM in CO2-infused tanks. BRIX 21–24. Reposo rest. Crop 2025.

## Hydrangea Coffee Roasters — Gesha Natural — El Velo — Hacienda La Esmeralda
**Country:** Panama · **Region/Farm:** El Velo, Boquete, Chiriqui / Hacienda La Esmeralda · **Producer:** Peterson Family
**Variety:** Gesha · **Process:** Natural · **Elevation:** 1650–1900 m
**Agtron:** 79.9 (Light color) · **Status:** Frozen (15g doses)
**URL:** https://hydrangea.coffee/products/gesha-natural-el-velo-hacienda-la-esmeralda
**Notes:** 50-hectare El Velo farm. Planted 2012. Multiple exotic accessions.

## Flower Child Coffee — Ernedis Rodriguez — Sidra
**Country:** Colombia · **Region/Farm:** Gigante, Huila / El Paraiso · **Producer:** Ernedis Rodriguez
**Variety:** Sidra (Bourbon Sidra / Ethiopian Landrace) · **Process:** Washed (84hr dry ferment, greenhouse dried 18–25 days) · **Elevation:** 1840 m
**Agtron:** 68.1 (Medium light color) · **Status:** Frozen (15g doses)
**URL:** https://flowerchildcoffee.com/products/ernedis-rodriguez-1
**Notes:** Crop Aug 2025. Notes: plum, white nectarine, lychee, violet. Evaluate cool.

## Moonwake Coffee Roasters — Alo Hatessa Mini Station — Anaerobic Natural Landrace — Ethiopia
**Country:** Ethiopia · **Region/Farm:** Alo Village, Sidama Bensa / Hatessa Mini Station · **Producer:** Tamiru Tadesse (Alo Coffee)
**Variety:** 74158 landrace · **Process:** Anaerobic Natural · **Elevation:** 2350–2550 m
**Agtron:** 83.7 (Very light color) · **Status:** Frozen (15g doses)
**URL:** https://moonwakecoffeeroasters.com/products/alo-hatessa-mini-station-anaerobic-natural-landrace-ethiopia
**Notes:** Tamiru Tadesse — 2021 Ethiopia Cup of Excellence #1. Rest 3–4 wks.

## Shoebox Coffee — Kenya Ngomano Washed
**Country:** Kenya · **Region/Farm:** Machakos County / Ngomano Coffee Factory · **Producer:** Smallholder cooperative
**Variety:** SL28, SL34, Batian, Ruiru 11 · **Process:** Washed · **Elevation:** 1700–1800 m
**Agtron:** 78.4 (Light color) · **Status:** Frozen (15g doses)
**URL:** https://shoebox.coffee/products/kenya-ngomano-washed
**Notes:** Ngomano Farmers' Cooperative. 48hr fermentation, raised-bed dry.

## Shoebox Coffee — Burundi Ninga Hill
**Country:** Burundi · **Region/Farm:** Muramvya Province / Ninga Washing Station · **Producer:** Smallholders (Long Miles Coffee Project)
**Variety:** Red Bourbon / Mibirizi field blend · **Process:** Washed · **Elevation:** 1800–2000 m
**Agtron:** 73.5 (Light color) · **Status:** Frozen (15g doses)
**URL:** https://shoebox.coffee/products/burundi-ninga-hill
**Notes:** Long Miles Coffee Project. Remote hill, own borehole water. Single ferment.

## Shoebox Coffee — Burundi Mutana Hill Washed
**Country:** Burundi · **Region/Farm:** Kayanza / Heza Washing Station (Mutana Hill) · **Producer:** Smallholders (Long Miles Coffee Project)
**Variety:** Red Bourbon / Mibirizi field blend · **Process:** Washed · **Elevation:** 1800–2000 m
**Agtron:** 71.1 (Light color) · **Status:** Frozen (15g doses)
**URL:** https://shoebox.coffee/products/burundi-mutana-hill-washed
**Notes:** Long Miles Coffee Project. Double fermentation (12hr dry + 24hr wet).

## Shoebox Coffee — Burundi Munyinya Hill Washed
**Country:** Burundi · **Region/Farm:** Muramvya Province / Bukeye Washing Station (Munyinya Hill) · **Producer:** Smallholders (Long Miles Coffee Project)
**Variety:** Red Bourbon / Mibirizi field blend · **Process:** Washed · **Elevation:** 1760–1960 m
**Agtron:** 73.2 (Light color) · **Status:** Frozen (15g doses)
**URL:** https://shoebox.coffee/products/burundi-munyinya-hill-washed
**Notes:** Bukeye station. Coffee Scout agronomist programme. Strict ripeness.

## Substance Café — Panama Finca Sophia Lot 129 — Natural Geisha
**Country:** Panama · **Region/Farm:** Chiriqui, Volcán / Finca Sophia (Colibrí area) · **Producer:** Willem Boot / Kelly Hartmann
**Variety:** Geisha · **Process:** Natural · **Elevation:** 2026 m
**Agtron:** 82.7 (Very light color) · **Status:** Frozen (15g doses)
**URL:** https://www.substancecafe.com/product/panama-finca-sophia-lot-129/
**Notes:** Colibrí area mid-harvest. Crop 2025. One of highest farms in Panama.

## Archers Coffee — Ethiopia — Elto Elora Station River Flow Washed CF10
**Country:** Ethiopia · **Region/Farm:** Arbegona & Bona Village, Sidama Bensa / Elora Washing Station · **Producer:** Eliyas Dukamo & Atiklit Dejene (Elto Coffee)
**Variety:** 74158 landrace · **Process:** Washed (River Flow CF10) · **Elevation:** 2400 m
**Agtron:** 84.9 (Very light color) · **Status:** Frozen (15g doses)
**URL:** https://archerscoffee.com/products/ethiopia-elto-elora-station-river-flow-washed-cf10
**Notes:** CF10 = Cold Ferment 10°C. Notes: white peach, lychee, papaya, mandarine.

## Hydrangea Coffee Roasters — Gesha — Luna Bermudez — Finca El Paraiso
**Country:** Colombia · **Region/Farm:** Cauca / Finca El Paraíso · **Producer:** Samuel Diego Bermudez
**Variety:** Gesha · **Process:** Double Fermentation Thermal Shock (anaerobic cherry + pulped stage w/ Gesha yeast culture, thermal shock wash) · **Elevation:** 1930 m
**Agtron:** 80.0 (Light color) · **Status:** Frozen (15g doses)
**URL:** https://hydrangea.coffee/products/luna-bermudez
**Notes:** egg waffle, blueberry, high mountain oolong. Balanced Intensity expected (El Paraíso pattern).

## Shoebox Coffee — Colombia Marlon Bolaños Gesha Washed
**Country:** Colombia · **Region/Farm:** Huila / The Three Coffee Farmers (Bolaños family) · **Producer:** Marlon Bolaños (w/ brothers Pedro & Hemerson)
**Variety:** Gesha · **Process:** Washed (48hr submerged in-cherry + 48hr dry ferment, raised-bed dried 10–15 days) · **Elevation:** 1600–1800 m
**Agtron:** 84.6 (Very light color) · **Status:** Frozen (15g doses)
**URL:** https://shoebox.coffee/products/colombia-marlon-bolanos-gesha-washed
**Notes:** Advanced fermentation washed. Notes: yellow fig, pineapple, bergamot. No archive precedent — first brew open call.

## Shoebox Coffee — Colombia Durley Sánchez Pink Bourbon Washed
**Country:** Colombia · **Region/Farm:** Palestina, Huila / Durley Sánchez (via LaREB) · **Producer:** Durley Sánchez
**Variety:** Pink Bourbon · **Process:** Washed (overripe picking, 60–80hr closed dry mass fermentation, greenhouse dried 15 days) · **Elevation:** 1650 m
**Agtron:** 84.3 (Very light color) · **Status:** Frozen (15g doses)
**URL:** https://shoebox.coffee/products/colombia-durley-sanchez-pink-bourbon-washed
**Notes:** LaREB collective. Notes: limoncello, pine needle, jasmine pearl. Clarity-First likely starting point.

## Picolot — Picolot #13: Weird Classy — Taiwan Honey Gesha
**Country:** Taiwan · **Region/Farm:** Taiwan / Royal Bean Geisha Estate · **Producer:** Tseng Fu-Sen
**Variety:** Gesha · **Process:** Honey (dry ferment 5°C / 24hrs → slow dried → machine dry 35°C / 72hrs → sun dried → post-ripening rest) · **Elevation:** 1200 m
**Agtron:** 69.3 (Medium light color) · **Status:** Frozen (15g doses)
**URL:** https://picolot.shop/products/picolot-13-taiwan-honey-gesha
**Notes:** Rest 3+ wks. Notes: sage, lavender honey, black tea, bay leaves, super sweet. Picolot = Balanced→Full; Orea/Kalita 95°C declining, fast/fast/slow pour structure.

## Hydrangea Coffee Roasters — 74158 Anaerobic Natural — Basha Bekele, Kokose
**Country:** Ethiopia · **Region/Farm:** Sidama, Bensa, Bombe / Kokose collection site · **Producer:** Basha Bekele
**Variety:** 74158 (Walega) · **Process:** Anaerobic Natural (cherry flotation, slow raised-bed drying) · **Elevation:** 2250 m
**Agtron:** 87.8 (Very light color) · **Status:** Frozen (15g doses)
**URL:** https://hydrangea.coffee/products/74158-anaerobic-natural-basha-bekele-kokose
**Notes:** 12ha semi-forested farm + 3 collection sites. 126 smallholders. Notes: cantaloupe, passionfruit, blueberries.

## DAK Coffee Roasters — Neon Milk — Colombia
**Country:** Colombia · **Region/Farm:** Huila / Finca La Florida · **Producer:** Henry Bonilla
**Variety:** Pink Bourbon · **Process:** Hibiscus Cultured Washed (hibiscus co-ferment + selected yeasts, thermal rinse) · **Elevation:** 1750 m
**Agtron:** 84.8 (Very light color) · **Status:** Frozen (15g doses)
**URL:** https://www.kofio.co/coffee/colombia-neon-milk-200g-dak-coffee-roasters/20058
**Notes:** Dutch roaster (Amsterdam). Notes: strawberry milkshake, hibiscus, white sugar. Same producer as Hydrangea Sudan Rume Henry Bonilla.

## Terraform Coffee — Ecuador — Clara Luz — Sidra
**Country:** Ecuador · **Region/Farm:** Quilanga, Loja / Finca Clara Luz · **Producer:** Servio Lenin González Jiménez
**Variety:** Sidra (Ethiopian Landrace) · **Process:** — · **Elevation:** 1720 m
**Agtron:** 62.4 (Medium light color) · **Status:** Frozen (15g doses)
**Notes:** ⚠️ No link found / process unknown — fill in when available. Cup of Excellence top 5 (2021), Taza Dorada #1 (2022, 92.65). Sidra introduced 2014.

## Terraform Coffee — Kenya — Thunguri, SL28 & SL34
**Country:** Kenya · **Region/Farm:** Nyeri / Thunguri Washing Station · **Producer:** 1,000+ smallholder farmers (CMS programme)
**Variety:** SL28 & SL34 · **Process:** Natural · **Elevation:** 1900 m
**Agtron:** 77.0 (Light color) · **Status:** Frozen (15g doses)
**URL:** https://www.terraformcoffee.com/products/kenya-thunguri-sl28-sl34-1
**Notes:** Harvest Jan 2026. Notes: purple grapes, pineapple, mixed berries. Interesting: natural-processed SL28/SL34 from Nyeri.

## Hydrangea Coffee Roasters — SL34 — Natural — Hacienda La Esmeralda
**Country:** Panama · **Region/Farm:** Boquete, Chiriqui / Hacienda La Esmeralda · **Producer:** Peterson Family
**Variety:** SL34 · **Process:** Natural · **Elevation:** 1650–1900 m
**Agtron:** 79.4 (Light color) · **Status:** Frozen (15g doses)
**URL:** https://hydrangea.coffee/products/sl34-natural-hacienda-la-esmeralda
**Notes:** SL34 is unusual variety for La Esmeralda (primarily known for Gesha). Natural process. No archive precedent — first brew open call.

## Lazy Schnauzer Coffee — The Profound Adventure — Ethiopia Alo Coffee Bona Zuria (Very Light Roast)
**Country:** Ethiopia · **Region/Farm:** Bona Zuria, Sidama (Bensa zone) / Bona Zuria Washing Station · **Producer:** Tamiru Tadesse (Alo Coffee)
**Variety:** 74110, 74112, 74158 landraces · **Process:** Washed · **Elevation:** 2100–2300 m
**Agtron:** 70.4 (Medium light color) · **Status:** Frozen (15g doses)
**URL:** https://lazyschnauzer.coffee/products/the-profound-adventure-ethiopia-alo-coffee-bona-zuria-very-light-roast
**Notes:** Tamiru Tadesse — Alo Coffee (2020). 2021 Ethiopia CoE #1 winner. Station at 2280–2380m. Very light roast label explicit.

## Special Guests Coffee — CGLE Colombia — Sudan Rume — Natural
**Country:** Colombia · **Region/Farm:** Las Margaritas, Valle del Cauca / Finca Las Margaritas · **Producer:** Rigoberto & Luis Eduardo Herrera (Café Granja La Esperanza)
**Variety:** Sudan Rume · **Process:** Natural (48hr silo ferment, 28-day solar dry, 3-month stabilisation rest) · **Elevation:** 1570–1760 m
**Agtron:** 71.7 (Light color) · **Status:** Frozen (15g doses)
**Notes:** ⚠️ No store link — subscription release. CGLE Las Margaritas. Notes: blueberry, stem ginger, light brown sugar, lemongrass. Variety-driven Clarity-First likely.

## Ripsnorter (NL) — INTEGO — Rwanda Anaerobic Natural
**Country:** Rwanda · **Region/Farm:** Nyamasheke / Gasharu Coffee Farm · **Producer:** 1,650 local farmers (Gasharu Coffee Farm collective)
**Variety:** Red Bourbon · **Process:** Anaerobic Natural · **Elevation:** 1600–2100 m
**Agtron:** 80.4 (Light color) · **Status:** Frozen (15g doses)
**URL:** https://ripsnorter.nl/products/intego-rwanda-anaerobic-naturalintego-rwanda-anaerobic-natural
**Notes:** Dutch roaster. 1,650 farmer collective. Balanced Intensity expected (anaerobic natural Red Bourbon).

## Moonwake Coffee Roasters — Project One Light Blue Iris — Yeast Anaerobic Honey Catimor — China
**Country:** China · **Region/Farm:** Mangshi / DeHong, Yunnan / Project One Light farm · **Producer:** Olina Cai (Project One Light / 单向光计划)
**Variety:** Catimor · **Process:** Yeast Anaerobic Honey (controlled yeast ferment + honey process, sun-dried 2 wks) · **Elevation:** 1300–1500 m
**Agtron:** 77.6 (Light color) · **Status:** Frozen (15g doses)
**URL:** https://moonwakecoffeeroasters.com/products/project-one-light-blue-iris-yeast-anaerobic-honey-catimor-china
**Notes:** POL founded 2021. Rest 4–6 wks (Moonwake standard). Notes: stewed pear, sugarcane, lychee. No archive precedent — first brew open call.

## Moonwake Coffee Roasters — Light Roast — Finca La Piragua — Natural Red Stripe Bourbon — Colombia
**Country:** Colombia · **Region/Farm:** Acevedo / Palestina, Huila / Finca La Piragua · **Producer:** Alexander Vargas
**Variety:** Red Stripe Bourbon (natural mutation of Red Bourbon, discovered Huila 2015) · **Process:** Natural (barrel fermentation) · **Elevation:** 1600–1800 m
**Agtron:** 88.2 (Very light color) · **Status:** Frozen (15g doses)
**URL:** https://moonwakecoffeeroasters.com/products/light-roast-finca-la-piragua-natural-red-stripe-bourbon-colombia
**Notes:** Multiple CoE finalist. 10ha farm. Rest 4–6 wks (Moonwake standard). Notes TBD. Pair with dark roast version for comparison.

## Moonwake Coffee Roasters — DARK ROAST — Finca La Piragua — Natural Red Stripe Bourbon — Colombia
**Country:** Colombia · **Region/Farm:** Acevedo / Palestina, Huila / Finca La Piragua · **Producer:** Alexander Vargas
**Variety:** Red Stripe Bourbon (natural mutation of Red Bourbon, discovered Huila 2015) · **Process:** Natural (barrel fermentation) · **Elevation:** 1600–1800 m
**Agtron:** 60.1 (Medium color) · **Status:** Frozen (15g doses)
**Notes:** ⚠️ No URL found. Dark roast of same lot as light roast above. Notes: chocolate truffle, cherry, Grand Marnier. Darkest coffee in inventory (60.1). Strategy TBD at brew time.

## Robert Asami (individual roaster) — CGLE Colombia — Natural Gesha
**Country:** Colombia · **Region/Farm:** Las Margaritas, Valle del Cauca / Finca Las Margaritas · **Producer:** Rigoberto & Luis Eduardo Herrera (Café Granja La Esperanza)
**Variety:** Gesha · **Process:** Natural · **Elevation:** 1700–2000 m
**Agtron:** 62.0 (Medium light color) · **Status:** Frozen (15g doses)
**Notes:** ⚠️ No URL — individual roaster. Darkest Gesha in inventory at 62.0. Strategy open call at brew time.

## Substance Café — Gesha Village Lot 44 — Natural — Ethiopia
**Country:** Ethiopia · **Region/Farm:** Bench Maji Zone / Gesha Village Coffee Estate · **Producer:** Rachel Samuel & Adam Overton (Gesha Village)
**Variety:** Gori Gesha, Gesha 1931, Ilubabor · **Process:** Natural · **Elevation:** 1931–2040 m
**Agtron:** 88.5 (Very light color) · **Status:** Frozen (15g doses)
**URL:** https://www.substancecafe.com/product/ethiopia-gesha-village-lot-44/
**Notes:** Agroforestry shade, virgin forest loamy soil. Substance = Balanced→Full. Nordic Approach import.

## Substance Café — Ethiopia Kelloo Wete Konga Washed
**Country:** Ethiopia · **Region/Farm:** Konga Woreda, Yirgacheffe / Wete Kebele Washing Station · **Producer:** Smallholders via Wete Ambela Coffee Export PLC
**Variety:** Heirloom landrace · **Process:** Washed · **Elevation:** 2050 m
**Agtron:** 79.0 (Light color) · **Status:** Frozen (15g doses)
**URL:** https://www.substancecafe.com/product/ethiopia-kelloo-wete-konga/
**Notes:** Nordic Approach import. Harvest 2025. Notes: lemon, lavender, violette. Clarity-First likely.

## Robert Asami (individual roaster) — Colombia Wilder Lazo — 300hr Anaerobic Washed Gesha
**Country:** Colombia · **Region/Farm:** — · **Producer:** Wilder Lazo
**Variety:** Gesha · **Process:** Anaerobic Washed (300hr)
**Agtron:** 71.7 (Light color) · **Status:** Frozen (15g doses)
**Notes:** ⚠️ No URL — individual roaster. 300hr anaerobic washed is extremely extended. No archive precedent — full open call.

## BM Coffee — Cold Fermentation Washed — Flying Pumas — Los Pozos — Panama
**Country:** Panama · **Region/Farm:** Los Pozos / Silla de Pando, Volcán, Chiriquí / Flying Pumas · **Producer:** Jaime Pérez & Alvaro Sosa (Flying Pumas)
**Variety:** Gesha · **Process:** Cold Fermentation Washed · **Elevation:** 1650–2200 m
**Agtron:** 80.9 (Light color) · **Status:** Frozen (15g doses)
**URL:** https://bm-coffee.com/
**Notes:** ⚠️ No product URL found. 178ha farm, 60ha coffee + 118ha forest. Notes: lemongrass, jasmine, red grape, caramel toffee.

## DAK Coffee Roasters — Pink Floyd — Colombia
**Country:** Colombia · **Region/Farm:** Huila / Finca Las Flores · **Producer:** Jhoan Vergara (w/ brothers Carlos & Diego)
**Variety:** Red Bourbon · **Process:** Anaerobic Washed (sealed tank fermentation) · **Elevation:** 1750 m
**Agtron:** 77.3 (Light color) · **Status:** Frozen (15g doses)
**URL:** https://www.kofio.co/coffee/colombia-pink-floyd-dak-coffee-roasters/19884
**Notes:** 2019 Master of Coffee winner. Farm est. 1990. Notes: pink gummies, lollipop, vanilla ice cream. Same roaster as Neon Milk.

## Exposure Therapy Coffee — Bolivia Floripondio — Washed SL34
**Country:** Bolivia · **Region/Farm:** Samaipata, Santa Cruz / El Fuerte farm · **Producer:** Los Rodriguez Family
**Variety:** SL34 · **Process:** Washed (disinfected, pulped, washed, 'coco box' dryer 2 wks + guardiola finish to 11.5% RH, rested then milled at Agricafe La Luna) · **Elevation:** 1710 m
**Agtron:** 80.1 (Light color) · **Status:** Frozen (15g doses)
**URL:** https://www.exposuretherapycoffee.com/shop/p/bolivia-floripondio
**Notes:** cocoa husk tea, wild honey, lavender, tart blackberry as cools. Roast date: 4/14/26. Coco box = steel cocoa-pod dryers with warm air flow.

## Newbery Street Coffee Roasters — Jaroon Khunlao — Double Honey — Chiang Rai, Thailand
**Country:** Thailand · **Region/Farm:** Khun Lao Village, Mae Kha Jan District, Chiang Rai · **Producer:** Jaroon Jaipin
**Variety:** Chiang Mai variety (SL28 × Caturra × Híbrido de Timor) · **Process:** Double Honey · **Elevation:** 1200 m
**Agtron:** 80.5 (Light color) · **Status:** Frozen (15g doses)
**URL:** https://newberyst.com/products/jaroon-honey
**Notes:** Pack Katisomsakul (Boston). Notes: black tea, apricot, caramel, milk tea/oolong aftertaste. Pack develops these longer for sweetness.

## Moonwake Coffee Roasters — Pepe Jijón — Finca Soledad — Wave Natural CF Sidra — Ecuador
**Country:** Ecuador · **Region/Farm:** Imbabura (Intag Valley) / Finca Soledad · **Producer:** Pepe Jijón
**Variety:** Sidra (Ethiopian Landrace) · **Process:** Wave Natural CF (72hr submerged cherry GrainPro ferment, depulped, 28-day cold dehydration) · **Elevation:** 1515 m
**Agtron:** 77.2 (Light color) · **Status:** Frozen (15g doses)
**URL:** https://moonwakecoffeeroasters.com/products/pepe-jijon-finca-soledad-wave-natural-cf-sidra-ecuador
**Notes:** Rest 4–6 wks. Notes: peach soda, strawberry yogurt, pineapple, hibiscus. Same producer as Ordinary SyOxy Sidra.

## Moonwake Coffee Roasters — Tamiru Tadesse Alo Coffee — DRD Natural 74158 — Ethiopia
**Country:** Ethiopia · **Region/Farm:** Sidama, Bensa / Alo Washing Station · **Producer:** Tamiru Tadesse (Alo Coffee)
**Variety:** 74158 landrace · **Process:** DRD Natural (Depulped Raised-bed Dried natural) · **Elevation:** 2400–2550 m
**Agtron:** 73.4 (Light color) · **Status:** Frozen (15g doses)
**URL:** https://moonwakecoffeeroasters.com/products/tamiru-tadesse-alo-coffee-drd-natural-74158-ethiopia
**Notes:** Rest 4–6 wks. 2021 Ethiopia CoE #1. Same producer as Moonwake Alo Hatessa + Lazy Schnauzer Bona Zuria. Third Alo lot in inventory.

## Prodigal Coffee — Caminos del Inka — Anaerobic Washed Gesha — Peru
**Country:** Peru · **Region/Farm:** Cusco · **Producer:** Samuel Smith Perez
**Variety:** Gesha · **Process:** Anaerobic Washed (48hr open-tank, raised-bed dried 15–20 days)
**Agtron:** 70.6 (Medium light color) · **Status:** Frozen (15g doses)
**URL:** https://getprodigal.com/products/caminos-del-inka
**Notes:** peach, orange, creamy. Rest before dosing.

## Moonwake Coffee Roasters — Las Palmas Brayan Alvear — Guanabana Washed Caturra — Colombia
**Country:** Colombia · **Region/Farm:** Huila / Finca Las Palmas · **Producer:** Brayan Alvear
**Variety:** Caturra · **Process:** Guanabana Co-Ferment Washed (multi-stage: oxidation, mosto+panela+molasses, then guanabana cultures) · **Elevation:** 1600 m
**Agtron:** 83.8 (Very light color) · **Status:** Frozen (15g doses)
**URL:** https://moonwakecoffeeroasters.com/products/las-palmas-guanabana-coferment-caturra-colombia
**Notes:** Rest 2–3 wks. Notes: piña colada, pink laffy taffy, cherimoya. Fun co-ferment.

## Moonwake Coffee Roasters — Ilde Burbano El Pilon — Anaerobic Washed Pink Bourbon — Colombia
**Country:** Colombia · **Region/Farm:** Palestina, Huila / El Pilon · **Producer:** Ilde Burbano
**Variety:** Pink Bourbon · **Process:** Anaerobic Washed (depulped, 24hr anaerobic, double washed, 10–25 day dry) · **Elevation:** 1740 m
**Agtron:** pending · **Status:** Resting (agtron pending)
**URL:** https://moonwakecoffeeroasters.com/products/ilde-burbano-el-pilon-anaerobic-washed-pink-bourbon-colombia
**Notes:** Rest 4–6 wks. Notes: green grape, blackberry, bergamot.

## Moonwake Coffee Roasters — Jhonatan Gasca Zarza Bella Vista — Advanced Natural Gesha — Colombia
**Country:** Colombia · **Region/Farm:** Bruselas, Huila / Zarza Bella Vista · **Producer:** Jhonatan & Johan Gasca
**Variety:** Gesha · **Process:** Advanced Natural (24hr enzymatic basket + 48hr anaerobic + 60°C thermal shock + 10–15 day dry) · **Elevation:** 1800 m
**Agtron:** pending · **Status:** Resting (agtron pending)
**URL:** https://moonwakecoffeeroasters.com/products/jhonatan-gasca-zarza-bella-vista-advanced-natural-gesha-colombia
**Notes:** Rest 3–4 wks. Notes: concord grape, champagne, dole whip. Zarza thermal shock pattern.

## Picolot — Picolot #20: Comp Edition — Altieri Geisha CHOMBI Natural Dry Fermentation
**Country:** Panama · **Region/Farm:** Alto Quiel, Baru Volcano / MIMA Estate (CHOMBI plot) · **Producer:** Altieri
**Variety:** Geisha (Green Tip) · **Process:** Natural Dry Fermentation (4-day African bed → 3-day GrainPro dark ferment → 28-day greenhouse dry) · **Elevation:** 1800 m
**Agtron:** pending · **Status:** Resting (agtron pending)
**URL:** https://picolot.shop/products/picolot-comp-edition-altieri-gn-df-chombi
**Notes:** Rest 4+ wks. Notes: stonefruit, blood orange, sweet cherry, syrupy, elegant when cool. ~1.5ha volcanic plot.

## Picolot — Picolot #21: Simba's Competition Coffee — Garrido Mokkita Cold Room
**Country:** Panama · **Region/Farm:** Boquete / Garrido Specialty Coffee (Finca Cantera / Volcancito / Margarita / Los Rosales) · **Producer:** Garrido family (mother & daughters)
**Variety:** Mokkita · **Process:** DRD Natural (floated → 3-day African beds → dark drying room) · **Elevation:** 1400 m
**Agtron:** pending · **Status:** Resting (agtron pending)
**URL:** https://picolot.shop/products/simbas-competition-coffee-garrido-mokkita-bop
**Notes:** Rest 6+ wks (roasted 3/7, needs 6+ wks). 2026 US National Brewer's Cup coffee. Notes: hibiscus/raisin hot → nectarine/cardamom warm → fruit tart/hibiscus cold.

## Picolot — Picolot #27: Blue Butterfly — Kotowa Silvia Marina Geisha Natural 124 6-NT
**Country:** Panama · **Region/Farm:** El Salto / Kotowa (Silvia Marina farm) · **Producer:** Silvia Marina (Kotowa)
**Variety:** Geisha · **Process:** Natural (15-day thick-layer African bed → static dryer 45°C / 2 days) · **Elevation:** 1900 m
**Agtron:** pending · **Status:** Resting (agtron pending)
**URL:** https://picolot.shop/products/picolot-kotowa-silvia-marina-geisha-natural
**Notes:** Rest 4+ wks. Notes: blueberry, yellow fruits, tropical, pine/spearmint, emerald acidity. Kotowa provenance.

## Helm Coffee — Panama El Burro Lot 16 — Natural Gesha
**Country:** Panama · **Region/Farm:** Volcán Barú, Chiriquí / Lamastus El Burro Estate · **Producer:** Lamastus Family Estates
**Variety:** Gesha · **Process:** Natural · **Elevation:** 1700 m
**Agtron:** 83.3 (Very light color) · **Status:** Frozen (15g doses)
**URL:** https://helmcoffeeroasters.com/products/panama-el-burro-lot-16-natural-gesha
**Notes:** peach, lemon candy, CapriSun, lavender. Over half the estate inside Volcán Barú National Park. Cherries take 5+ yrs to fruit.

## Helm Coffee — Colombia Nogales Nativo — Colombia — Anaerobic Washed
**Country:** Colombia · **Region/Farm:** Pitalito, Huila / Los Nogales · **Producer:** Oscar Hernandez
**Variety:** Colombia · **Process:** Anaerobic Washed (depulped, hermetic tank + mosto culture, 18°C, raised-bed 15 days + 30-day GrainPro stabilisation) · **Elevation:** 1850 m
**Agtron:** 62.6 (Medium light) · **Status:** Frozen (15g doses)
**URL:** https://helmcoffeeroasters.com/collections/frontpage/products/colombia-los-nogales-colombia-caturra
**Notes:** strawberry, rose, white chocolate, kumquat. Variety per bag label = Colombia (Helm web listing says "Colombia & Caturra"; bag is canonical). Biotechnology-focused farm.

## Helm Coffee — Colombia Nogales Mystic — Yellow Bourbon — Anaerobic Washed
**Country:** Colombia · **Region/Farm:** Pitalito, Huila / Los Nogales · **Producer:** Oscar Hernandez
**Variety:** Yellow Bourbon · **Process:** Anaerobic Washed (depulped, hermetic tank + mosto culture, 18°C, raised-bed 15 days + 30-day GrainPro stabilisation) · **Elevation:** 1850 m
**Agtron:** 87.1 (Very light) · **Status:** Frozen (15g doses)
**URL:** https://helmcoffeeroasters.com/collections/frontpage/products/colombia-los-nogales-yellow-bourbon
**Notes:** lemon-lime, apples, pink florals, peach tea. Same farm/process as Nativo — good comparison pair.

## Glitch Coffee and Roasters — Ethiopia Sidama Tamiru Alo Berry "Under Screen" — Natural 74165
**Country:** Ethiopia · **Region/Farm:** Bensa, Sidama / Alo Station · **Producer:** Tamiru Tadesse (Alo Coffee)
**Variety:** 74165 (Alo Berry micro-bean) · **Process:** Natural (traditional under-screen/shade drying) · **Elevation:** 2380–2470 m
**Agtron:** 77.4 (Light) · **Status:** Frozen (15g doses)
**URL:** https://shop.glitchcoffee.com/products/ethiopia-sidama-tamiru-alo-berry-under-screen
**Notes:** 74165 = ultra-small bean, limited high-altitude area. Notes: grape, red wine, chocolate. 4th Tamiru/Alo lot in inventory.

## Hydrangea Coffee Roasters — Gesha Washed Franceschi Lot 232 — Panama
**Country:** Panama · **Region/Farm:** Volcán, Chiriquí / Franceschi Coffee · **Producer:** Carlos Franceschi & Jean Paul Langenstein
**Variety:** Geisha · **Process:** Washed · **Elevation:** 1600–1800 m
**Agtron:** 83.8 (Very light color) · **Status:** Frozen (15g doses)
**URL:** https://hydrangea.coffee/products/gesha-washed-franceschi-lot-232
**Notes:** navel orange, honeysuckle, white tea. Carlos Aguilera Franceschi = grandson of Carmen Estate founder. New smaller artisan project.

## Big Sur Coffee — Ethiopia Washed Sewda Premium — Guji
**Country:** Ethiopia · **Region/Farm:** Oddo Shakisso, Benti Korba, Guji / Sewda Washing Station · **Producer:** Testi Specialty Coffee (Faysel Abdosh)
**Variety:** Ethiopian Heirloom · **Process:** Washed · **Elevation:** 1900–2100 m
**Agtron:** 74.6 (Light) · **Status:** Frozen (15g doses)
**URL:** https://bigsurcafe.com/products/25-26-new-season-ethiopia-washed-sewda-premium
**Notes:** Harvest Dec 2025–Jan 2026. Notes: magnolia, honey peach, bergamot, lime, watermelon juice. 2026 origin trip selection.

## Big Sur Coffee — Ethiopia Triple Fermentation Washed Faysel Abdosh Premium — Guji Hambella
**Country:** Ethiopia · **Region/Farm:** Deri, Deri Kidame, Hambella Wamena, Guji / Faysel Abdosh Washing Station · **Producer:** Testi Specialty Coffee (Faysel Abdosh)
**Variety:** Ethiopian Heirloom · **Process:** Triple Fermented Washed (24hr whole-cherry anaerobic + 12hr dry ferment + 12hr cold-water wet ferment) · **Elevation:** 2350–2400 m
**Agtron:** 77.2 (Light) · **Status:** Frozen (15g doses)
**URL:** https://bigsurcafe.com/products/25-26-new-season-ethiopia-triple-fermentation-washed-faysel-abdosh-premium
**Notes:** Harvest Dec 2025–Jan 2026. Notes: floral, lychee, honey peach, white grape. Darkroom controlled drying.

## Big Sur Coffee — Ethiopia Sidama Bura Keramo Gara Agena G1 Premium Washed
**Country:** Ethiopia · **Region/Farm:** Hayissa Olocho, Bura Keramo, Sidama / Gara Agena Washing Station · **Producer:** Testi Specialty Coffee (Faysel Abdosh)
**Variety:** 74158 · **Process:** Washed (36hr wet fermentation + 21-day raised-bed dry) · **Elevation:** 2035–2250 m
**Agtron:** 77.7 (Light) · **Status:** Frozen (15g doses)
**URL:** https://bigsurcafe.com/products/25-26-new-season-ethiopia-sidama-bura-keramo-gara-agena-g1-premium-washed-150g
**Notes:** Harvest Dec 2025–Jan 2026. Notes: mangosteen, lime, apricot. Geta River-side station.

## Moonwake Coffee Roasters — Deiro Garcia Finca Lord Voldemort — Panela Yeast Washed Caturra Chiroso — Colombia
**Country:** Colombia · **Region/Farm:** Pitalito, Huila / Finca Lord Voldemort · **Producer:** Deiro García Botina
**Variety:** Caturra Chiroso · **Process:** Panela Yeast Washed (panela + yeast culture fermentation, washed) · **Elevation:** 1800 m
**Agtron:** 76.7 (Light color) · **Status:** Frozen (15g doses)
**URL:** https://moonwakecoffeeroasters.com/products/deiro-garcia-finca-lord-voldemort-panela-yeast-washed-caturra-chiroso-colombia
**Notes:** Rest 2–3 wks. Deiro = former microbiologist, creates own yeast/fruit cultures. Same farm as Ombligon + Gesha Lemongrass lots.

## BM Coffee — Hacienda El Obraje — Caturra Washed — Colombia
**Country:** Colombia · **Region/Farm:** Tangua, Nariño / Hacienda El Obraje · **Producer:** Pablo Andres Guerrero
**Variety:** Caturra · **Process:** Washed (20hr whole-cherry bag ferment → depulped → 24hr dry ferment → washed twice → 16-day raised-bed dry) · **Elevation:** 2200 m
**Agtron:** 76.6 (Light color) · **Status:** Frozen (15g doses)
**URL:** https://bm-coffee.com/
**Notes:** ⚠️ No product URL — BM Coffee homepage used. Pablo Guerrero, 2021 CoE #1 winner. Roasted 04/05/26. Notes: pomelo, white grape, almond, brown sugar.

## SEY Coffee — Candelaria Santos — Tres De Mayo — Caturra Washed — Peru
**Country:** Peru · **Region/Farm:** Northern Peru / Tres De Mayo · **Producer:** Candelaria Santos
**Variety:** Caturra · **Process:** Washed (floated, depulped day-of-harvest, 32hr dry ferment, washed, raised-bed dried)
**Agtron:** 77.9 (Light color) · **Status:** Frozen (15g doses)
**URL:** https://www.seycoffee.com/products/2026-candelaria-santos-tres-de-mayo-peru
**Notes:** Northern Peru, rare for SEY. Cup: cherry, panela, apple. Clarity-First starting point (Caturra washed, traditional method).

## Untold Coffee Lab — Brazil Fazenda Um — Wush Wush Natural (WWNAT)
**Country:** Brazil · **Region/Farm:** Sul de Minas / Fazenda Um · **Producer:** Stefano Um
**Variety:** Wush Wush · **Process:** Natural (Dark drying) · **Elevation:** 1000–1260 m
**Agtron:** 65.4 (Medium light color) · **Status:** Frozen (15g doses)
**URL:** https://www.untoldcoffeelab.com/products/brazil-fazenda-um-wush-wush-natural-wwnat
**Notes:** Wush Wush in Brazil is highly unusual — Ethiopian landrace grown in Sul de Minas. Lower elevation than typical Wush Wush. No archive precedent.

## DAK Coffee Roasters — Bellini — Colombia Geisha
**Country:** Colombia · **Region/Farm:** Huila / field blend smallholders · **Producer:** Multiple smallholders (Huila)
**Variety:** Geisha · **Process:** Washed
**Agtron:** 78.5 (Light color) · **Status:** Frozen (15g doses)
**URL:** https://www.kofio.co/coffee/colombia-bellini-geisha-125g-dak-coffee-roasters/20019
**Notes:** Field blend of Geisha from several high-altitude Huila smallholders. Rest 3–4+ wks. Notes: white grape, watermelon, fruit loops, honeysuckle. Same roaster as Neon Milk + Pink Floyd.

## Newbery Street Coffee Roasters — Billy Maemon — Natural — Chiang Rai, Thailand
**Country:** Thailand · **Region/Farm:** Maemon Mountain, Chiang Rai · **Producer:** Billy (2nd-gen Maemon Mountain farmer)
**Process:** Natural · **Elevation:** 1350 m
**Agtron:** 86.9 (Very light color) · **Status:** Frozen (15g doses)
**URL:** https://newberyst.com/products/pre-order-billy-maemon
**Notes:** Maemon Mountain = shaded, rich soil. Billy improving processing for specialty. Notes: honey, mixed berries, natural dried banana. Same roaster as Jaroon Khunlao.

## SEY Coffee — Ruarai AA Separation — SL28 & SL34 — Washed — Kenya
**Country:** Kenya · **Region/Farm:** Southwestern slopes of Mt. Kenya / Ruarai Washing Station · **Producer:** Ruarai WS smallholders
**Variety:** SL28 & SL34 · **Process:** Washed
**Agtron:** 76.5 (Light) · **Status:** Frozen (15g doses)
**URL:** https://www.seycoffee.com/products/2026-ruarai-aa-separation-kenya
**Notes:** SEY's 2nd year with Ruarai. AA separation. Dense, complex Mt. Kenya profile. Clarity-First likely (traditional Kenyan washed).

## Special Guests Coffee — Release 056 — El Placer — Wush Wush Black Honey — Colombia
**Country:** Colombia · **Region/Farm:** Calarcá, Quindío / Finca El Placer · **Producer:** Sebastian Ramirez
**Variety:** Wush Wush · **Process:** Black Honey (CM / anaerobic, max mucilage, 18°C CO2 ferment, slow dry) · **Elevation:** 1744 m
**Agtron:** 84.1 (Very light) · **Status:** Frozen (15g doses)
**URL:** https://every.coffee/roaster/special-guests/release-056-el-placer-wush-wush-black-honey
**Notes:** Same producer/farm as the Moonwake El Placer Gesha (Brian Quan collab). Sebastian = microbiology-lab processor. Watch for perfume ceiling on heavy Wush Wush processing.

## Special Guests Coffee — Release 052 — CGLE Mandela — Anaerobic Natural (XO) — Colombia
**Country:** Colombia · **Region/Farm:** Trujillo, Valle del Cauca / La Esperanza farm (Café Granja La Esperanza) · **Producer:** Café Granja La Esperanza (Herrera family)
**Variety:** Mandela · **Process:** XO (anaerobic natural) · **Elevation:** 1450–1627 m
**Agtron:** 63.9 (Medium light) · **Status:** Frozen (15g doses)
**URL:** https://specialguestscoffee.com/products/release-052-cgle-mandela-anaerobic-natural
**Notes:** Confirmed CGLE "Mandela XO" (CGLE only makes one Mandela). 88+ competition selection. SG notes: cherry praline, maltloaf, dark chocolate. CGLE cup: caramelized pineapple, ripe grape, tart acidity, liqueur warmth. Darker roast (63.9) — watch ferment-driven bitter tail (temperature-primary lever).

## Untold Coffee Lab — Panama Finca Deborah Geisha Interstellar — Natural
**Country:** Panama · **Region/Farm:** Volcán, Chiriquí / Finca Deborah · **Producer:** Jamison Savage
**Variety:** Geisha (Green Tip) · **Process:** Natural — Multi-Variable Yeast Inoculated (100+ hr) · **Elevation:** 1950 m
**Agtron:** 60.6 (Medium) · **Status:** Frozen (15g doses)
**URL:** https://www.untoldcoffeelab.com/products/panama-finca-deborah-geisha-natural-interstellar
**Notes:** Bought roasted from Untold. Jamison Savage flagship experimental. Notes: molasses, peach, melon, oolong aftertaste. Dramatic hot→cool shift. Darker roast (60.6) — Untold roasts these on the darker side; watch roast character.

## Untold Coffee Lab — Colombia La Palma y El Tucan Sidra — Natural (B-068)
**Country:** Colombia · **Region/Farm:** Zipacón, Cundinamarca / La Palma y El Tucán · **Producer:** Felipe & Elisa Sardi
**Variety:** Sidra (Typica × Red Bourbon) · **Process:** Natural (Bioinnovation-style) · **Elevation:** 1750 m
**Agtron:** 57.8 (Medium) · **Status:** Frozen (15g doses)
**URL:** https://www.untoldcoffeelab.com/products/colombia-la-palma-y-el-tucan-sidra-natural-b-068
**Notes:** Bought roasted from Untold. LP&ET = famed competition farm. Darkest coffee in inventory at 57.8 — Untold roasts dark; expect roast character, treat accordingly.

## Untold Coffee Lab — Brazil Daterra Yellow Aramosa — Natural Anaerobic (BV31)
**Country:** Brazil · **Region/Farm:** Cerrado Mineiro, Patrocínio / Fazenda Daterra · **Producer:** Daterra (Masterpieces selection)
**Variety:** Yellow Aramosa (Arabica × C. racemosa hybrid) · **Process:** Natural Anaerobic · **Elevation:** ~1200 m
**Agtron:** 62.1 (Medium light) · **Status:** Frozen (15g doses)
**URL:** https://www.untoldcoffeelab.com/products/brazil-daterra-yellow-aramosa-natural-anaerobic-bv31
**Notes:** Bought roasted from Untold. Aramosa = unusual low-caffeine interspecific hybrid. Notes: magnolia, green grape tartaric acidity, honey, tea-like body. No archive precedent.

## Monogram Coffee — Takesi Gesha — Washed — Bolivia
**Country:** Bolivia · **Region/Farm:** Yanacachi / Finca Takesi · **Producer:** Mariana Iturralde & Don Carlos Iturralde
**Variety:** Gesha · **Process:** Washed · **Elevation:** 1900–2500 m
**Agtron:** (reading lost — not saved) · **Status:** Frozen (15g doses)
**URL:** https://monogramcoffee.com/en-us/products/takesi-gesha
**Notes:** Agtron photo didn't save — leave blank. Roast date 23 Jan 2026. World's highest coffee farm. Notes: nectarine, floral, black tea. Clarity-First (high-altitude washed Gesha).

## Special Guests Coffee — House Filter Jhonatan Gasca — Colombia Bourbon Aji — Advanced Natural
**Country:** Colombia · **Region/Farm:** Bruselas, Huila / Zarza Bella Vista · **Producer:** Jhonatan Gasca
**Variety:** Bourbon Aji · **Process:** Advanced Natural (enzymatic activation → anaerobic → thermal shock 60°C → dry)
**Agtron:** 62.1 (Medium light) · **Status:** Frozen (15g doses)
**Notes:** ⚠️ No URL (subscription release; bag confirmed). Same producer as Moonwake Zarza Bella Vista Advanced Natural Gesha — Zarza thermal-shock pattern. Bourbon Aji = aji-pepper-shaped Bourbon mutation. SG notes: peach candy, marmalade, bergamot.

## Untold Coffee Lab — Brazil Carmo Pacamara — Anaerobic Natural — Santuário Sul (R-007284)
**Country:** Brazil · **Region/Farm:** Carmo de Minas, Minas Gerais / Santuário Sul · **Producer:** Luiz Paulo Pereira (Carmo Coffees)
**Variety:** Pacamara · **Process:** Anaerobic Natural
**Agtron:** 76.5 (Light) · **Status:** Frozen (15g doses)
**URL:** https://www.untoldcoffeelab.com/products/brazil-carmo-pacamara-anaerobic-natural-santu-rio-sul-r-007284
**Notes:** Bought roasted from Untold. Santuário Sul = Luiz Paulo's 30+ variety experimental farm. Notes: red apple, redcurrant, molasses, nutmeg. Untold roasts darker — watch roast character. (At 76.5 this one is lighter than Untold's others.)

## Moonwake Coffee Roasters — Fernando Bocanegra El Oasis — 60hr Washed Gesha — Colombia
**Country:** Colombia · **Region/Farm:** Ortega, Tolima / Finca El Oasis · **Producer:** Fernando Bocanegra & Pedro Lugo
**Variety:** Gesha · **Process:** 60hr Washed (submerged clean-water fermentation, raised-bed dried) · **Elevation:** 2150 m
**Agtron:** 76.5 (Light) · **Status:** Frozen (15g doses)
**URL:** https://moonwakecoffeeroasters.com/products/fernando-bocanegra-el-oasis-60hr-washed-gesha-colombia
**Notes:** Rest 4–6 wks. Ex-chef producer; Gesha-only farm, wide spacing. Notes: jasmine, white peach, honey, shine muscat. Clarity-First (clean washed Gesha). Tolima is reclaimed post-conflict terroir.

## SEY Coffee — Umoco Busambo Hill — Field Blend — Washed — Burundi
**Country:** Burundi · **Region/Farm:** Lake Kivu area, NW Burundi / Umoco Washing Station · **Producer:** Umoco WS smallholders
**Variety:** Field blend · **Process:** Washed (12hr dry ferment + 24hr submerged, density graded, 16–20 day raised-bed dry to 10.5%)
**Agtron:** 72.4 (Light) · **Status:** Frozen (15g doses)
**URL:** https://www.seycoffee.com/products/2026-umoco-busambo-hill-burundi
**Notes:** SEY's first year with Umoco. Notes: dark fruit leather, black tea, baking spice. Burundi double-ferment washed — clean profile. Clarity-First likely.

## Untold Coffee Lab — Brazil Carmo SL28 — Natural Anaerobic — Santuário Sul (R-007216)
**Country:** Brazil · **Region/Farm:** Carmo de Minas, Minas Gerais / Santuário Sul · **Producer:** Luiz Paulo Pereira (Carmo Coffees)
**Variety:** SL28 · **Process:** Natural Anaerobic
**Agtron:** 59.1 (Medium) · **Status:** Frozen (15g doses)
**URL:** https://www.untoldcoffeelab.com/products/brazil-carmo-sl28-natural-anaerobic-santu-rio-sul-r-007216
**Notes:** Bought roasted from Untold. SL28 in Brazil is unusual (Kenyan variety). Same Santuário Sul experimental farm. Darker roast (59.1) — Untold roasts dark; watch roast character / roast bleed.

## Untold Coffee Lab — Brazil Fazenda Um Pink Bourbon — Dark Room Natural (TUVADKNAT)
**Country:** Brazil · **Region/Farm:** Sul de Minas / Fazenda Um · **Producer:** Stefano Um
**Variety:** Pink Bourbon · **Process:** Dark Room Natural
**Agtron:** 70.1 (Medium light) · **Status:** Frozen (15g doses)
**URL:** https://www.untoldcoffeelab.com/products/brazil-fazenda-um-pink-bourbon-dark-room-natural-tuvadknat
**Notes:** Bought roasted from Untold. Same farm as the Wush Wush Natural (Stefano Um, Sul de Minas). Pink Bourbon in Brazil is unusual. Untold roasts darker — watch roast character.

## Untold Coffee Lab — Brazil Daterra Laurina — Natural (BV19)
**Country:** Brazil · **Region/Farm:** Cerrado Mineiro, Patrocínio / Fazenda Daterra · **Producer:** Daterra (Masterpieces selection)
**Variety:** Laurina (Bourbon Pointu — low caffeine) · **Process:** Natural · **Elevation:** ~1200 m
**Agtron:** 57.8 (Medium) · **Status:** Frozen (15g doses)
**URL:** https://www.untoldcoffeelab.com/products/brazil-daterra-laurina-natural-bv19
**Notes:** Bought roasted from Untold. Laurina = naturally low-caffeine, hard to roast (Untold's roaster notes difficulty). Notes: mandarin, peach, yogurt, dulce de leche. Tied with LP&ET Sidra as darkest in inventory (57.8) — watch roast bleed.

## SEY Coffee — Wilbert Almanza Bella Rosa — SL9* — Washed — Peru
**Country:** Peru · **Region/Farm:** San Fernando region / Bella Rosa · **Producer:** Wilbert Almanza
**Variety:** SL9* (Gesha-like; no Gesha genetics — provisional name) · **Process:** Washed (5-day controlled barrel dry ferment, extensive wash, raised-bed dried)
**Agtron:** 73.2 (Light) · **Status:** Frozen (15g doses)
**URL:** https://www.seycoffee.com/products/2026-wilbert-almanza-bella-rosa-peru
**Notes:** SL9* = "Gesha Improved" colloquial name, genetically distinct. Almanza heads QC/marketing for San Fernando. Extended 5-day barrel ferment for a washed. Clarity-First / Balanced.

## SEY Coffee — Armando Hurtado Los Pinos — SL9* — Washed — Peru
**Country:** Peru · **Region/Farm:** San Fernando region / Los Pinos · **Producer:** Armando Hurtado
**Variety:** SL9* (Gesha-like; no Gesha genetics — provisional name) · **Process:** Washed
**Agtron:** 81.7 (Very light) · **Status:** Frozen (15g doses)
**URL:** https://www.seycoffee.com/products/2026-armando-hurtado-los-pinos-peru
**Notes:** Same San Fernando SL9* program as Wilbert Almanza Bella Rosa — good comparison pair (81.7 vs 73.2, both SL9* washed). Clarity-First likely.

## H&S Coffee Roasters — Colombia Diofanor Ruiz Papayo — Washed
**Country:** Colombia · **Region/Farm:** Buenavista, Quindío / Finca La Divisa · **Producer:** Diofanor Ruiz (via Cofinet)
**Variety:** Papayo (rare orange-cherry mutation from Huila) · **Process:** Washed (30hr underwater ferment, temp-controlled slow dry) · **Elevation:** 1950 m
**Agtron:** 90.4 (Very light) · **Status:** Frozen (15g doses)
**URL:** https://hscoffeeroasters.com/products/colombia-diofanor-ruiz-papayo
**Notes:** H&S (Laramie WY) roasts light/very-light. Tied for lightest in inventory at 90.4. Papayo = Cofinet "silver bullet" variety. Notes: honeysuckle, red apple, panela, passionfruit. Clarity-First.

## Bean & Bean Coffee Roasters — Jamie's Competition Coffee: Panama Janson Gesha Washed 1010
**Country:** Panama · **Region/Farm:** Volcán, Chiriquí / Janson Family Farm (Hacienda los Alpes, est. 1941) · **Producer:** Janson Family
**Variety:** Green Tip Gesha · **Process:** Washed · **Elevation:** 1700 m
**Agtron:** 78.3 (Light) · **Status:** Frozen (15g doses)
**URL:** https://beannbeancoffee.com/products/panama-janson-gesha-washed-1010
**Notes:** Jamie's US Brewers Cup competition coffee. Farm between Tisingal & Barú volcanoes, solar-powered, no pesticides. Notes: strawberry, raspberry, plum, rose, orange blossom, honey, tea-like. Clarity-First (washed competition Gesha).

## Moonwake Coffee Roasters — Chevas Coffee Estate Jose Chevas RA/CR #3 — Natural Gesha — Panama
**Country:** Panama · **Region/Farm:** El Salto, Boquete / Chevas Coffee Estate · **Producer:** José Luis Chevas
**Variety:** Gesha · **Process:** Natural (RA/CR #3) · **Elevation:** 1750 m
**Agtron:** 84.9 (Very light color) · **Status:** Frozen (15g doses)
**URL:** https://www.instagram.com/p/DXLGvCYjdN-/
**Notes:** Chevas est. 2016 by José Luis (then 18); partner Adrian Villarreal = 2020 Panama Barista Champion. 9th Geisha Natural, 2024 Best of Panama. ⚠️ IG link — confirm exact lot/notes from bag.

## The Picky Chemist — Ecuador El Dorado — Washed Gesha — Lot 2
**Country:** Ecuador · **Region/Farm:** Loja / Finca El Dorado · **Producer:** Bernard Uhe
**Variety:** Gesha · **Process:** Washed (Double Fermentation)
**Agtron:** 79.2 (Light) · **Status:** Frozen (15g doses)
**URL:** https://en.thepickychemist.com/product-page/ecuador-finca-el-dorado-washed-gesha-lot-2-125g
**Notes:** TPC = Stéphane, Beaufays Belgium, ultralight Stronghold profile (passion-project roaster). Harvest July 2025. Notes: orange blossom, red fruit, umami, tea-like. Delicate/ultra-clean. Clarity-First.

## SHITE (Sniite) — Honduras Evin Joel Moreno Reyes — El Mango — SL28 Washed
**Country:** Honduras · **Region/Farm:** El Cedral, Las Vegas, Santa Bárbara / Finca El Mango · **Producer:** Evin Joel Moreno Reyes
**Variety:** SL28 · **Process:** Washed · **Elevation:** 1640 m
**Agtron:** 76.2 (Light color) · **Status:** Frozen (15g doses)
**URL:** https://sniite.shop/items/69ed7567d3c2c937af3d3019
**Notes:** Roaster SHITE/Sniite (Tokyo, Japan; sniite.shop). 2025 Cup of Excellence Exotic Variety category, 11th place — El Mango has placed SL-28 in COE 3 consecutive years. Filter roast, 100g. Notes: bing cherry, lemon, apple, honey, milk chocolate, juicy, complex acidity, long aftertaste. SL28 in Honduras is unusual.

## Thankfully Coffee — Ecuador Felipe Luzon — Mejorado — Washed
**Country:** Ecuador · **Region/Farm:** Palanda, Zamora-Chinchipe / Finca Los Eucaliptos · **Producer:** Felipe Luzon
**Variety:** Typica Mejorado · **Process:** Washed (60+ hr wet ferment, greenhouse dried 15–20 days) · **Elevation:** 1600 m
**Agtron:** 76.5 (Light color) · **Status:** Frozen (15g doses)
**URL:** https://every.coffee/roaster/thankfully-coffee/ecuador-felipe-luzon-mejorado
**Notes:** 2nd-gen grower, planted first trees at age 8. Southern Amazon Ecuador (Palanda = cocoa region). Notes: stone fruit, green grape, honey. Clarity-First likely.

## H&S Coffee Roasters — Kenya Gichathaini — SL28 Field Blend — Washed
**Country:** Kenya · **Region/Farm:** Mathira West, Nyeri County / Gichathaini Factory (Gikanda FCS) · **Producer:** Gikanda Farmers' Cooperative Society smallholders
**Variety:** SL28 field blend (SL28/SL34/Ruiru 11/Batian) · **Process:** Washed · **Elevation:** 1600–1900 m
**Agtron:** 77.8 (Light color) · **Status:** Frozen (15g doses)
**URL:** https://hscoffeeroasters.com/
**Notes:** ⚠️ No product URL — H&S homepage. Ultralight roast, roasted Apr 25 2026. Notes: green apple, pomegranate, starfruit. H&S (Laramie WY) roasts light/very-light.

## Walnuts Coffee — Kenya Kiamwangi AA — Fully Washed
**Country:** Kenya · **Region/Farm:** Nyeri / Kiamwangi Factory (Iria-ini FCS) · **Producer:** Iria-ini Farmers' Cooperative Society smallholders
**Variety:** SL28, SL34, Ruiru 11 · **Process:** Fully Washed · **Elevation:** 1800 m
**Agtron:** 85.5 (Very light) · **Status:** Frozen (15g doses)
**URL:** https://walnutscoffee.com/
**Notes:** ⚠️ No product URL — Walnuts homepage. Notes: orange marmalade, blackcurrant, tamarind. Classic Nyeri washed.

## XLIII Coffee — Malemolência #1 — Daterra Masterpieces Auction 2025 — Brazil
**Country:** Brazil · **Region/Farm:** Cerrado Mineiro, Patrocínio / Fazenda Daterra · **Producer:** Daterra (Masterpieces auction lot)
**Variety:** Guarani (Aramosa hybrid family) · **Process:** Natural Anaerobic (62hr, native Brazilian yeast) · **Elevation:** ~1200 m
**Agtron:** 72.5 (Light) · **Status:** Frozen (15g doses)
**URL:** https://xliiicoffee.com/en/product/malemolencia-1-masterpiece-auction-2025/
**Notes:** XLIII Coffee (Da Nang, Vietnam). Masterpieces Auction 2025 lot. Notes: pistachios, green grape, melon. Guarani = climate-resilient Aramosa lineage (low caffeine relatives). Giesen W6A, extremely light. Aroma shifts pistachio/green grape/melon (hot) → strawberry/raspberry/melon (warm) → plum/pistachio/dark chocolate (cold); long finish, brandy-soaked cherry. Flavor-locked pack — peak 8–16 wks post-roast while sealed.

## SEY Coffee — Frank Aroste La Esperanza — Gesha — Washed — Peru
**Country:** Peru · **Region/Farm:** Santa Ana, Cusco / La Esperanza · **Producer:** Frank Aroste
**Variety:** Gesha · **Process:** Washed · **Elevation:** 2100 m
**Agtron:** pending · **Status:** Resting (agtron pending)
**URL:** https://www.seycoffee.com/products/2026-frank-aroste-la-esperanza-peru
**Notes:** Bay Area Coffee Club exclusive. Young producer, Gesha at extreme elevation, only 7 yrs planting. Notes: pomelo, jasmine, bergamot, melon. Clarity-First (high-alt washed Gesha).

## Coffee with Dongze — Hachi x Yunnan x Terroir Maximus (Brian Quan) — Precursor Amplification Natural 繁花 FanHua — China
**Country:** China · **Region/Farm:** The Nest (云顶筑巢庄园), Yunnan · **Producer:** Hachi Project x Terroir Maximus
**Variety:** Syrina (赛琳娜) · **Process:** Precursor Amplification Natural (繁花 FanHua) · **Elevation:** 1450–1600 m
**Agtron:** pending · **Status:** Resting (agtron pending)
**URL:** https://coffee-with-dongze.myshopify.com/products/hachi-x-yunnan-x-terroir-maximus-x-brian-quan-%E7%B9%81%E8%8A%B1-x-%E6%B5%81%E5%85%89-x-%E6%98%A0%E9%9B%AA
**Notes:** Brian Quan collab. One of 3 process variants (50g each). Notes: floral, roses, vanilla, pineapple, dried mango, berries, cinnamon, raisin. Hachi = Diego Bermudez x Allan Hartmann project.

## Coffee with Dongze — Hachi x Yunnan x Terroir Maximus (Brian Quan) — Enzyflow Honey 映雪 YinXue — China
**Country:** China · **Region/Farm:** The Nest (云顶筑巢庄园), Yunnan · **Producer:** Hachi Project x Terroir Maximus
**Variety:** Syrina (赛琳娜) · **Process:** Enzyflow Honey (映雪 YinXue) · **Elevation:** 1450–1600 m
**Agtron:** pending · **Status:** Resting (agtron pending)
**URL:** https://coffee-with-dongze.myshopify.com/products/hachi-x-yunnan-x-terroir-maximus-x-brian-quan-%E7%B9%81%E8%8A%B1-x-%E6%B5%81%E5%85%89-x-%E6%98%A0%E9%9B%AA
**Notes:** Brian Quan collab. One of 3 process variants (50g each). Notes: white flowers, citric, aloe, rock sugar, elegant, very clean. Front-loaded controlled enzyme stage before natural-style drying.

## Coffee with Dongze — Hachi x Yunnan x Terroir Maximus (Brian Quan) — Cascade Fermentation 流光 LiuGuang — China
**Country:** China · **Region/Farm:** The Nest (云顶筑巢庄园), Yunnan · **Producer:** Hachi Project x Terroir Maximus
**Variety:** Syrina (赛琳娜) · **Process:** Cascade Fermentation (流光 LiuGuang, multi-stage) · **Elevation:** 1450–1600 m
**Agtron:** 86.9 (Very light color) · **Status:** Frozen (15g doses)
**URL:** https://coffee-with-dongze.myshopify.com/products/hachi-x-yunnan-x-terroir-maximus-x-brian-quan-%E7%B9%81%E8%8A%B1-x-%E6%B5%81%E5%85%89-x-%E6%98%A0%E9%9B%AA
**Notes:** Brian Quan collab. One of 3 process variants (50g each). Notes: tropical fruits, papaya, champagne, bergamot, floral, grape, banana, perfume. Watch perfume ceiling on this one. Multi-stage sequential ferment.

## XLIII Coffee — Ziriguidum #2 — Daterra Masterpieces Auction 2025 — Brazil
**Country:** Brazil · **Region/Farm:** Cerrado Mineiro, Patrocínio / Fazenda Daterra · **Producer:** Daterra (Masterpieces auction lot)
**Variety:** Laurina (Bourbon Pointu — low caffeine) · **Process:** Natural · **Elevation:** 900–1200 m
**Agtron:** pending · **Status:** Resting (agtron pending)
**URL:** https://xliiicoffee.com/en/product/ziriguidum-2-masterpieces-auction-2025/
**Notes:** XLIII Coffee (Da Nang, Vietnam). Masterpieces Auction 2025, crop 2025, 250g. Giesen W6A, extremely light. Notes: cherry candy, red berries, raspberry; aroma shifts cherry/cola/ripe grape (hot) → cherry candy/raspberry/strawberry (warm) → pineapple/cinnamon/cacao nibs (cold). Sparkling phosphoric/malic acidity. Same Daterra Masterpieces auction as the XLIII Malemolência #1 Guarani lot. Flavor-locked pack — peak 8–16 wks post-roast while sealed.

## Hydrangea Coffee Roasters — Pink Bourbon — Washed — Finca Inmaculada (Fellow Farms Project)
**Country:** Colombia · **Region/Farm:** Valle del Cauca / Finca Inmaculada · **Producer:** The Holguin Family
**Variety:** Pink Bourbon · **Process:** Washed · **Elevation:** 1500–1700 m
**Agtron:** 83.2 (Very light color) · **Status:** Frozen (15g doses)
**URL:** https://hydrangea.coffee/products/pink-bourbon-washed-finca-inmaculada-fellow-farms-project
**Notes:** Fellow Farms Project. Notes: hibiscus, plum, lime. Sold out / archived at roaster.

## Hydrangea Coffee Roasters — Sudan Rume — Natural — Finca Las Margaritas (CGLE)
**Country:** Colombia · **Region/Farm:** Valle del Cauca / Finca Las Margaritas (Café Granja La Esperanza) · **Producer:** Rigoberto & Luis Eduardo Herrera (CGLE)
**Variety:** Sudan Rume · **Process:** Natural · **Elevation:** 1570–1850 m
**Agtron:** 80.4 (Light color) · **Status:** Frozen (15g doses)
**URL:** https://hydrangea.coffee/products/sudan-rume-natural-cafe-granja-la-esperanza
**Notes:** Notes: cherry, bergamot flowers, papaya — bright/perfumed, layered fruit, clean finish. CGLE Las Margaritas (rare/high-end varieties). Region normalized to Valle del Cauca — Hydrangea's bag labels this lot "Cauca," but its CGLE siblings (Natural XO, Hybrid Washed) + the Special Guests CGLE entry confirm Valle del Cauca as canonical. Sold out / archived.

## Hydrangea Coffee Roasters — Gesha — Washed 507NWS — Finca Nuguo
**Country:** Panama · **Region/Farm:** Jurutungo, Chiriquí / Finca Nuguo · **Producer:** José "Pocho" Gallardo
**Variety:** Gesha · **Process:** Washed (507NWS) · **Elevation:** 1800–1950 m
**Agtron:** 72.9 (Light color) · **Status:** Frozen (15g doses)
**URL:** https://hydrangea.coffee/products/gesha-washed-finca-nuguo
**Notes:** 507NWS lot. Fermented pulped 48hr at Nuguo, then dried in a controlled room in David (from Feb 21, 22°C). Notes: bergamot, white peach, jasmine. Sold out / archived.

## Hydrangea Coffee Roasters — Sudan Rume — Natural XO — Finca Las Margaritas (CGLE)
**Country:** Colombia · **Region/Farm:** Valle del Cauca / Finca Las Margaritas (Café Granja La Esperanza) · **Producer:** Rigoberto & Luis Eduardo Herrera (CGLE)
**Variety:** Sudan Rume · **Process:** Natural "XO" (extended natural — flotation + Brix-gated, 70hr GrainPro ferment rotated every 5hr) · **Elevation:** 1570–1850 m
**Agtron:** 67.0 (Medium light color) · **Status:** Frozen (15g doses)
**URL:** https://hydrangea.coffee/products/sudan-rume-natural-xo-las-margaritas-cafe-granja-la-esperanza
**Notes:** First Sudan Rume offered in CGLE's XO style. Notes: violet, strawberry, sangria — wine-like structure. Same farm as the plain Natural and Hybrid Washed CGLE Sudan Rume lots. Sold out / archived.

## Hydrangea Coffee Roasters — Sudan Rume — Hybrid Washed — Finca Las Margaritas (CGLE)
**Country:** Colombia · **Region/Farm:** Valle del Cauca / Finca Las Margaritas (Café Granja La Esperanza) · **Producer:** Rigoberto & Luis Eduardo Herrera (CGLE)
**Variety:** Sudan Rume · **Process:** Hybrid Washed (14hr open-tank → 18hr oxygen-free → depulp → 24hr aerobic → washed; mechanical silo dry 3–5 days at 38°C) · **Elevation:** 1570–1850 m
**Agtron:** 80.9 (Light color) · **Status:** Frozen (15g doses)
**URL:** https://hydrangea.coffee/products/cgle-sudan-rume-hw
**Notes:** Staged-ferment washed — keeps washed cleanliness with added aromatic depth. Notes: bergamot, blue lilac, mango. Same farm as the plain Natural and Natural XO CGLE Sudan Rume lots. Sold out / archived.

## Airworks / September Coffee — Abel Salinas Ecuador Mejorado Washed
**Country:** Ecuador · **Region/Farm:** Saraguro, Loja / Finca Arashi · **Producer:** Abel Salinas
**Variety:** Typica Mejorado · **Process:** Washed (depulped at peak ripeness → 24hr dry ferment → washed → ~15-day dry) · **Elevation:** 1900 m
**Agtron:** 81.7 (Very light color) · **Status:** Frozen (15g doses)
**URL:** https://september.coffee/en-us/products/abel-salinas-ecuador-washed-mejorado-2026
**Notes:** 2026 release (harvest late 2025 — September's 3rd consecutive year with Abel). Roaster notes: peach, plum, oolong tea, fresh lemon — light body, clean finish. Abel Salinas = Cup of Excellence winner, first-gen grower; Finca Arashi (Saraguro), 7ha / ~22,000 trees, mostly Typica Mejorado (also Sidra + H1). Mejorado = Bourbon × Ethiopian Landrace cross. Importer: The Coffee Quest ($26.07/kg). Light roast. Clarity-First likely (clean washed Mejorado).

## Airworks / Still — Komothai Kanake (Red Earth)
**Country:** Kenya · **Region/Farm:** Kiambu County / Komothai (Kanake) · **Producer:** —
**Variety:** SL28, SL34, Ruiru 11, Batian · **Process:** Washed
**Agtron:** 71.6 (Light color) · **Status:** Frozen (15g doses)
**Notes:** ⚠️ No product URL / sparse spec (producer + elevation pending) — enrich when available. "Red Earth" lot, N.04, roasted by Still (bag: STILL & AIRWORKS; not on stillcoffeeroasters.com). Roasted 24/05/26. Roaster notes: blackcurrant, grape, berries, hibiscus, black tea, apricot. Clarity-First likely (traditional Kenyan washed SL blend).

## Big Sur Coffee — Ethiopia Washed Faysel Abdosh Single Farm Premium — Guji Shakisso
**Country:** Ethiopia · **Region/Farm:** Welabo, Oddo Shakisso, Guji / Faysel Abdosh Single Farm · **Producer:** Testi Specialty Coffee (Faysel Abdosh)
**Variety:** Ethiopian Heirloom · **Process:** Washed (flotation → depulp → 36hr wet ferment → 21-day slow shade-dry on raised beds under black nets) · **Elevation:** 2100 m
**Agtron:** 78.4 (Light color) · **Status:** Frozen (15g doses)
**URL:** https://bigsurcafe.com/products/25-26-new-season-ethiopia-washed-faysel-abdosh-single-farm-premium-150g
**Notes:** Harvest Dec 11 2025. Notes: white florals, citrus, bergamot, peach. Testi Single Farm Project (launched 2025) — centerpiece of the Private Collection Auction Series; clean/transparent/elegant. Same producer (Faysel Abdosh / Testi) as the Big Sur Triple Fermentation + Sewda + Gara Agena lots — comparison family. Clarity-First (washed heirloom).

## SEY Coffee × Bay Area Coffee Club — Frank Aroste — Washed Gesha — Peru
**Country:** Peru · **Region/Farm:** Santa Ana, Cusco · **Producer:** Frank Aroste
**Variety:** Gesha · **Process:** Washed · **Elevation:** 2100 m
**Agtron:** 77.5 (Light color) · **Status:** Frozen (15g doses)
**URL:** https://www.instagram.com/p/DYGUnk6CTqo/
**Notes:** ⚠️ No web-store page — Bay Area Coffee Club exclusive collab (Instagram only). Very young producer, small extreme-elevation Gesha garden. Harvest Nov 2025. Farm gate $25.26/kg green. Notes: pomelo, jasmine, bergamot, melon. Second Cusco Gesha in inventory (cf. Prodigal Caminos del Inka).
