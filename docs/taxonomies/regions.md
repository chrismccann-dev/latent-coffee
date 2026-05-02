# Regions

**Enforcement bar:** Strict (macro terroir)
**Canonical registry:** [lib/terroir-registry.ts](../../lib/terroir-registry.ts) (authoritative for validation)
**Last adopted:** 2026-04-22
**Adoption path:** Authored new (Chris, 2026-04-22 research pass drawing on the ChatGPT context doc terroir ruleset, Sweet Maria's origin documentation, SCA / specialty-coffee origin references, producer-published farm locations, and Chris's 55-brew corpus for Observed sections)

Canonical terroir reference for the latent-coffee app. 120 canonical macro terroirs across 38 countries (126 country-scoped entries - some macros like Lake Kivu Highlands span multiple countries). Part of the [Reference Taxonomies umbrella](../features/reference-taxonomies-attribution.md), sprint-1 Phylum A1 port (second after Varieties).

**Hierarchy:** Country -> Admin Region -> Macro Terroir. Meso and Micro are intentionally **not** canonical - they are optional free-text annotations on individual terroir rows, not enforced, not autocompleted, not aggregated. Chris's research (April 2026) confirmed that every behavioral attribute (climate, soil, elevation, farming, processing, cup profile, acidity, body, why-it-stands-out) is macro-scoped; meso and micro carry no distinct signal worth canonicalizing. Producer-level locality is the right home for farm / sub-region detail, via the planned `producer_name` + `farm_name` split.

Additions require a 3-step edit: this doc, `lib/terroir-registry.ts`, and a DB migration if an existing row needs renaming. A new macro must pass the 4-question Macro Validation Check (extraction behavior / acidity shape / roast approach / consistent environmental pattern) before landing - see [reference-taxonomies-region.md](../features/reference-taxonomies-region.md#enforcement-specifics).

External claims in this doc are cited at authoring time and rolled up in the `## Sources` block at the bottom. Chris's own tested observations live in per-macro `#### Observed Across My Corpus` subsections (added in sprint 1d.2+ as coverage grows); external claims in tentative voice.

---

## Canonical list

Matches the `TERROIRS` array in [lib/terroir-registry.ts](../../lib/terroir-registry.ts) exactly. 120 distinct macros across 38 countries (126 country-scoped entries).

**Bolivia**
- Bolivian Yungas Cloud Forest Slopes
- Santa Cruz Andean Foothills

**Brazil**
- Bahia Highlands
- Brazilian Lowland Robusta Systems
- Cerrado Mineiro
- Espírito Santo Highlands
- Mantiqueira Highlands
- Mogiana Highlands

**Burundi**
- Mumirwa Escarpment
- Northern Interior Highlands

**China**
- Fujian Coastal Highlands
- Guangxi Southern Frontier Highlands
- Hainan Tropical Low-Mountain Belt
- Yunnan Central Highlands
- Yunnan Northern Highlands
- Yunnan Southern Highlands

**Colombia**
- Central Andean Cordillera
- Huila Highlands
- Northern Andean Cordillera
- Western Andean Cordillera

**Costa Rica**
- Caribbean Slope Highlands
- Central Volcanic Highlands
- Pacific Slope Highlands
- Southern Highlands

**Cuba**
- Escambray Massif
- Pinar del Río Western Highlands
- Sierra Maestra Mountains

**DR Congo**
- Ituri Albertine Highlands
- Lake Kivu Highlands
- Rwenzori Grand Nord Highlands

**Dominican Republic**
- Cordillera Central Highlands
- Cordillera Septentrional Highlands
- Sierra de Bahoruco Highlands

**Ecuador**
- Northern Andean Highlands
- Southern Andean Highlands

**El Salvador**
- Alotepec-Metapán Highlands
- Apaneca-Ilamatepec Highlands
- Bálsamo Volcanic Belt
- Cacahuatique Eastern Highlands
- Chinchontepec Volcanic Slopes
- Tecapa-Chinameca Highlands

**Ethiopia**
- Bench Sheko Highlands
- Guji Highlands
- Harar Eastern Highlands
- Sidama Highlands
- West Arsi Highlands
- Western Ethiopian Forest Highlands
- Yirgacheffe Highlands

**Guatemala**
- Caribbean Slope Highlands
- Central Volcanic Highlands
- Eastern Highlands
- Western Dry Highlands

**Haiti**
- Cahos Matheux Range
- Massif de la Hotte
- Massif de la Selle
- Massif du Nord Highlands

**Honduras**
- Central Honduras Highlands
- Eastern Honduras Highlands
- Western Honduras Highlands

**India**
- Araku Eastern Ghats Highlands
- Karnataka Western Ghats
- Kerala Western Ghats
- Tamil Nadu High Ranges

**Indonesia**
- Bali Volcanic Highlands
- Flores Volcanic Highlands
- Java Volcanic Highlands
- Papua Highlands
- Sulawesi Highlands
- Sumatra Highlands
- Timor Highlands

**Kenya**
- Central Kenyan Volcanic Highlands
- Western Rift Valley Highlands

**Laos**
- Bolaven Plateau Volcanic Highlands
- Northern Laos Highlands

**Malawi**
- Northern Malawi Highlands
- Southern Malawi Highlands

**Mexico**
- Chiapas Highlands
- Gulf Highlands
- Oaxaca Southern Highlands
- Western Sierra Madre

**Myanmar**
- Chin Highlands
- Pyin Oo Lwin Plateau
- Southern Shan Highlands

**Nepal**
- Central Eastern Mid-Hills
- Western Mid-Hills

**Nicaragua**
- Northern Highlands

**Panama**
- Santa Clara Highlands
- Volcán Barú Highlands

**Papua New Guinea**
- PNG Central Highlands
- PNG Fringe Highlands

**Peru**
- Amazonian Fringe
- Central Andean Highlands
- Northern Andean Highlands
- Southern Andean Highlands

**Philippines**
- Cordillera Highlands
- Mindanao Highlands
- Southern Luzon Belt

**Rwanda**
- Central Plateau Highlands
- Eastern Low Highlands
- Lake Kivu Highlands

**Taiwan**
- Alishan Belt
- Central Foothills
- Southern Eastern Belt
- Yunlin Uplands

**Tanzania**
- Kilimanjaro Highlands
- Lake Victoria Highlands
- Northern Rift Highlands
- Southern Highlands

**Thailand**
- Northern Thai Highlands
- Southern Peninsula Robusta

**Timor-Leste**
- South Central Highlands
- Western Central Highlands

**Uganda**
- Mount Elgon Highlands
- Rwenzori Highlands
- Southwestern Highlands
- West Nile Highlands

**United States**
- Hawaiian Volcanic Highlands
- Southern California Highlands

**Vietnam**
- Central Highlands Plateau
- North Central Highlands
- Northwest Highlands

**Yemen**
- Central Highlands
- Haraz Highlands
- Sana’a Western Highlands
- Yafa Highlands

**Zambia**
- Zambian Northern Highlands


---

## Reference content

### Bolivian Yungas Cloud Forest Slopes

**Country:** Bolivia  **Admin Regions it overlaps:** La Paz / Cochabamba
**Typical Meso Terroirs (reference only; not canonical):** Caranavi, Coroico, Yanacachi

#### Context
Steep jungle mountain system with heavy cloud cover and slow drying

#### Environmental System
- **Elevation Band:** 1200-1800 m
- **Climate Regime:** humid, cloud forest, frequent rain
- **Soil Base:** loamy forest soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Caturra, Typica, Catuai
- **Typical Processing:** washed
- **Cup Profile (structural):** delicate fruit, floral, tea-like
- **Acidity Character:** malic-citric
- **Body Character:** light silky

#### Why This Macro Stands Out
Cloud cover slows maturation and reduces density, producing lighter structured cups

---

### Santa Cruz Andean Foothills

**Country:** Bolivia  **Admin Regions it overlaps:** Santa Cruz
**Typical Meso Terroirs (reference only; not canonical):** Samaipata, Vallegrande

#### Context
Drier foothill transition out of Yungas forest system

#### Environmental System
- **Elevation Band:** 900-1400 m
- **Climate Regime:** warm, lower humidity
- **Soil Base:** mixed soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Catuai, Typica
- **Typical Processing:** washed, natural
- **Cup Profile (structural):** muted fruit, heavier baseline
- **Acidity Character:** malic-low
- **Body Character:** medium

#### Why This Macro Stands Out
Lower elevation and drier climate reduce clarity vs Yungas system

---

### Bahia Highlands

**Country:** Brazil  **Admin Regions it overlaps:** Bahia
**Typical Meso Terroirs (reference only; not canonical):** Piatã, Mucugê, Ibicoara

#### Context
Isolated high-elevation plateau within a warmer northeastern climate

#### Environmental System
- **Elevation Band:** 1100-1400 m
- **Climate Regime:** warm days, cooler nights, controlled irrigation common
- **Soil Base:** sandy loam with good drainage
- **Farming Model:** estate-driven, high control

#### What Comes Out of This System
- **Dominant Varieties:** Catuai, Catucaí, Topazio
- **Typical Processing:** natural, pulped natural, washed
- **Cup Profile (structural):** clean, structured sweetness, light florals
- **Acidity Character:** malic-citric
- **Body Character:** medium-light

#### Why This Macro Stands Out
Combination of elevation and controlled farming produces unusually clean profiles for a warm region

---

### Brazilian Lowland Robusta Systems

**Country:** Brazil  **Admin Regions it overlaps:** Espírito Santo / Rondônia / Bahia
**Typical Meso Terroirs (reference only; not canonical):** Linhares, Cacoal, Porto Velho

#### Context
Tropical lowland systems focused on high-yield robusta production

#### Environmental System
- **Elevation Band:** 200-800 m
- **Climate Regime:** hot, humid, heavy rainfall
- **Soil Base:** lateritic tropical soils
- **Farming Model:** large estate + cooperative

#### What Comes Out of This System
- **Dominant Varieties:** Robusta
- **Typical Processing:** natural, washed
- **Cup Profile (structural):** dense, earthy, chocolate-heavy
- **Acidity Character:** muted, low
- **Body Character:** dense, heavy

#### Why This Macro Stands Out
Rapid maturation and robusta genetics produce high body and low acidity unlike arabica systems

---

### Cerrado Mineiro

**Country:** Brazil  **Admin Regions it overlaps:** Minas Gerais
**Typical Meso Terroirs (reference only; not canonical):** Patrocínio, Patos de Minas, Araxá, Carmo do Paranaíba

#### Context
Large, flat plateau system with mechanized farming and uniform ripening

#### Environmental System
- **Elevation Band:** 900-1250 m
- **Climate Regime:** warm, distinct dry season, moderate rainfall
- **Soil Base:** deep well-drained oxisols (red latosols)
- **Farming Model:** large estate, mechanized harvest

#### What Comes Out of This System
- **Dominant Varieties:** Mundo Novo, Catuai, Topazio
- **Typical Processing:** natural, pulped natural
- **Cup Profile (structural):** common chocolate, nuts, mild fruit
- **Acidity Character:** low, rounded
- **Body Character:** mid-heavy, structured

#### Why This Macro Stands Out
Uniform ripening + dry harvest conditions produce consistency and low-acid profiles unlike mountain systems

---

### Espírito Santo Highlands

**Country:** Brazil  **Admin Regions it overlaps:** Espírito Santo
**Typical Meso Terroirs (reference only; not canonical):** Venda Nova do Imigrante, Afonso Cláudio, Domingos Martins

#### Context
Mountainous Atlantic forest extension with mixed arabica and robusta influence

#### Environmental System
- **Elevation Band:** 900-1400 m
- **Climate Regime:** warm-temperate, humid, frequent rainfall
- **Soil Base:** weathered granitic and clay-rich soils
- **Farming Model:** smallholder dominant

#### What Comes Out of This System
- **Dominant Varieties:** Catuai, Catucaí, Robusta
- **Typical Processing:** washed, pulped natural, natural
- **Cup Profile (structural):** round sweetness, mild fruit, cocoa
- **Acidity Character:** malic-soft
- **Body Character:** medium

#### Why This Macro Stands Out
High humidity and mixed varietal base soften acidity and increase body vs Mantiqueira

---

### Mantiqueira Highlands

**Country:** Brazil  **Admin Regions it overlaps:** Minas Gerais / São Paulo
**Typical Meso Terroirs (reference only; not canonical):** Carmo de Minas, São Lourenço, Campos do Jordão, Cristina

#### Context
Mountain system with higher elevation and slower maturation than most of Brazil

#### Environmental System
- **Elevation Band:** 1100-1600 m
- **Climate Regime:** temperate, cooler nights, seasonal rainfall
- **Soil Base:** volcanic-influenced and metamorphic soils
- **Farming Model:** smallholder + estate

#### What Comes Out of This System
- **Dominant Varieties:** Bourbon, Yellow Bourbon, Catuai
- **Typical Processing:** natural, pulped natural, washed
- **Cup Profile (structural):** sweet citrus, florals, stone fruit
- **Acidity Character:** malic-citric, more defined than Brazil baseline
- **Body Character:** medium silky

#### Why This Macro Stands Out
One of the few Brazilian systems with consistent high-elevation acidity and clarity potential

---

### Mogiana Highlands

**Country:** Brazil  **Admin Regions it overlaps:** São Paulo / Minas Gerais
**Typical Meso Terroirs (reference only; not canonical):** Franca, Pedregulho, Altinópolis, Garça

#### Context
Transitional plateau between Cerrado and Mantiqueira systems

#### Environmental System
- **Elevation Band:** 900-1300 m
- **Climate Regime:** warm-temperate, seasonal rainfall
- **Soil Base:** red-yellow latosols
- **Farming Model:** mixed estate

#### What Comes Out of This System
- **Dominant Varieties:** Catuai, Mundo Novo
- **Typical Processing:** natural, pulped natural
- **Cup Profile (structural):** balanced chocolate + light fruit
- **Acidity Character:** mild malic
- **Body Character:** medium

#### Why This Macro Stands Out
Acts as a balance zone between Cerrado density and Mantiqueira clarity

---

### Mumirwa Escarpment

**Country:** Burundi  **Admin Regions it overlaps:** Kayanza / Muramvya / Mwaro
**Typical Meso Terroirs (reference only; not canonical):** Kayanza, Muramvya, Mwaro

#### Context
Western escarpment descending toward Lake Tanganyika with high elevation and dense production

#### Environmental System
- **Elevation Band:** 1500-2100 m
- **Climate Regime:** cooler, humid, consistent rainfall
- **Soil Base:** volcanic and clay-rich soils
- **Farming Model:** smallholder, washing station-based

#### What Comes Out of This System
- **Dominant Varieties:** Bourbon
- **Typical Processing:** washed
- **Cup Profile (structural):** bright citrus, florals, refined sweetness
- **Acidity Character:** citric-linear
- **Body Character:** medium-light

#### Why This Macro Stands Out
High elevation and strong washing station network produce some of the cleanest cups in Central Africa

---

### Northern Interior Highlands

**Country:** Burundi  **Admin Regions it overlaps:** Ngozi / Kirundo / Muyinga
**Typical Meso Terroirs (reference only; not canonical):** Ngozi, Kirundo, Muyinga

#### Context
Inland plateau system with slightly warmer climate and less direct lake influence

#### Environmental System
- **Elevation Band:** 1400-1900 m
- **Climate Regime:** temperate, moderate humidity
- **Soil Base:** red clay loam
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Bourbon
- **Typical Processing:** washed
- **Cup Profile (structural):** citrus, red fruit, slightly rounder than Mumirwa
- **Acidity Character:** malic-citric
- **Body Character:** medium

#### Why This Macro Stands Out
Reduced humidity vs escarpment increases structure and body slightly while maintaining clarity

---

### Fujian Coastal Highlands

**Country:** China  **Admin Regions it overlaps:** Fujian
**Typical Meso Terroirs (reference only; not canonical):** Zhangping, Wuyi foothills, Longyan

#### Context
Small, fragmented coffee system within a humid coastal tea-growing region

#### Environmental System
- **Elevation Band:** 800-1400 m
- **Climate Regime:** humid subtropical, high rainfall, maritime influence
- **Soil Base:** acidic red soils
- **Farming Model:** smallholder experimental

#### What Comes Out of This System
- **Dominant Varieties:** Catimor
- **Typical Processing:** washed
- **Cup Profile (structural):** muted fruit, herbal, soft sweetness
- **Acidity Character:** low, soft
- **Body Character:** medium

#### Why This Macro Stands Out
High humidity and lower elevation suppress acidity and clarity vs inland systems

---

### Guangxi Southern Frontier Highlands

**Country:** China  **Admin Regions it overlaps:** Guangxi
**Typical Meso Terroirs (reference only; not canonical):** Baise, Longlin, Hechi

#### Context
Emerging karst mountain system along Vietnam border

#### Environmental System
- **Elevation Band:** 800-1400 m
- **Climate Regime:** warm subtropical, seasonal rainfall
- **Soil Base:** limestone-derived karst soils, thin topsoil
- **Farming Model:** smallholder experimental

#### What Comes Out of This System
- **Dominant Varieties:** Catimor
- **Typical Processing:** washed
- **Cup Profile (structural):** mild fruit, slight mineral edge
- **Acidity Character:** malic-soft
- **Body Character:** light to medium

#### Why This Macro Stands Out
Limestone soils and moderate elevation produce lighter structure but limited acidity ceiling

---

### Hainan Tropical Low-Mountain Belt

**Country:** China  **Admin Regions it overlaps:** Hainan
**Typical Meso Terroirs (reference only; not canonical):** Wanning, Qionghai, Baisha

#### Context
Island-based tropical system with historically robusta-dominant production

#### Environmental System
- **Elevation Band:** 200-800 m
- **Climate Regime:** hot, humid, year-round tropical
- **Soil Base:** lateritic tropical soils
- **Farming Model:** estate + state farm legacy

#### What Comes Out of This System
- **Dominant Varieties:** Robusta, some arabica
- **Typical Processing:** natural, washed
- **Cup Profile (structural):** dense, earthy, low complexity
- **Acidity Character:** muted
- **Body Character:** heavy

#### Why This Macro Stands Out
Low elevation and heat drive rapid maturation and low-acid, high-body structure

---

### Yunnan Central Highlands

**Country:** China  **Admin Regions it overlaps:** Yunnan
**Typical Meso Terroirs (reference only; not canonical):** Baoshan, Dehong, Lincang high elevations

#### Context
Transitional plateau between tropical south and cooler north

#### Environmental System
- **Elevation Band:** 1400-1800 m
- **Climate Regime:** temperate-warm, seasonal rainfall, moderate humidity
- **Soil Base:** red loam with improved structure vs south
- **Farming Model:** smallholder + estate

#### What Comes Out of This System
- **Dominant Varieties:** Catimor
- **Typical Processing:** washed
- **Cup Profile (structural):** emerging fruit clarity, balanced sweetness
- **Acidity Character:** malic-rounded
- **Body Character:** medium silky

#### Why This Macro Stands Out
Slower ripening improves structure and balance compared to southern Yunnan

---

### Yunnan Northern Highlands

**Country:** China  **Admin Regions it overlaps:** Yunnan
**Typical Meso Terroirs (reference only; not canonical):** Diqing, Northern Baoshan, Nujiang fringe

#### Context
High-elevation fringe zone with cooler climate and slower maturation

#### Environmental System
- **Elevation Band:** 1600-2000 m
- **Climate Regime:** cooler, drier, larger diurnal swings
- **Soil Base:** mountain loam, less weathered soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Catimor, improved hybrids
- **Typical Processing:** washed
- **Cup Profile (structural):** lighter florals, citrus, tea-like structure
- **Acidity Character:** citric-linear (relative to China baseline)
- **Body Character:** light to medium

#### Why This Macro Stands Out
Closest China gets to high-clarity profiles due to slower ripening and cooler climate

---

### Yunnan Southern Highlands

**Country:** China  **Admin Regions it overlaps:** Yunnan
**Typical Meso Terroirs (reference only; not canonical):** Pu’er, Xishuangbanna, Lincang

#### Context
Tropical mountain system near SE Asia borders with rapid maturation and heavy rainfall

#### Environmental System
- **Elevation Band:** 1000-1600 m
- **Climate Regime:** warm, humid, monsoonal with strong wet season
- **Soil Base:** red lateritic soils, iron-rich, highly weathered
- **Farming Model:** smallholder dominant

#### What Comes Out of This System
- **Dominant Varieties:** Catimor, Sarchimor-derived lines
- **Typical Processing:** washed, honey, natural
- **Cup Profile (structural):** soft cocoa, muted fruit, low definition
- **Acidity Character:** malic-soft to muted
- **Body Character:** medium-heavy

#### Why This Macro Stands Out
Fast maturation and high rainfall reduce acidity and increase body, limiting clarity ceiling

---

### Central Andean Cordillera

**Country:** Colombia  **Admin Regions it overlaps:** Antioquia / Caldas / Quindío / Tolima
**Typical Meso Terroirs (reference only; not canonical):** Santa Elena, Manizales, Villamaría, Chinchiná, Armenia, Salento, Filandia, Ibagué (Tolima — added MCP feedback batch 7 after the Gesha Clouds dog-food surfaced Tolima as a registry gap)

#### Context
Core Colombian mountain chain with stable climate and strong infrastructure

#### Environmental System
- **Elevation Band:** 1400-2000 m
- **Climate Regime:** temperate, bimodal rainfall
- **Soil Base:** young volcanic ash soils
- **Farming Model:** smallholder dominant

#### What Comes Out of This System
- **Dominant Varieties:** Caturra, Castillo, Colombia
- **Typical Processing:** washed
- **Cup Profile (structural):** bright fruit, caramel sweetness, balanced florals
- **Acidity Character:** citric-malic
- **Body Character:** medium silky

#### Why This Macro Stands Out
Consistent rainfall and elevation create one of the most balanced and repeatable coffee systems globally

---

### Huila Highlands

**Country:** Colombia  **Admin Regions it overlaps:** Huila
**Typical Meso Terroirs (reference only; not canonical):** Pitalito, San Agustín, Acevedo, Garzón, La Plata

#### Context
High-elevation basin with strong diurnal shifts and consistent rainfall

#### Environmental System
- **Elevation Band:** 1500-2100 m
- **Climate Regime:** cool nights, stable rainfall
- **Soil Base:** young volcanic soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Caturra, Castillo
- **Typical Processing:** washed
- **Cup Profile (structural):** bright citrus, florals
- **Acidity Character:** citric-linear
- **Body Character:** medium-light

#### Why This Macro Stands Out
High elevation + stable climate produces some of Colombia’s highest clarity cups

---

### Northern Andean Cordillera

**Country:** Colombia  **Admin Regions it overlaps:** Santander / Norte de Santander
**Typical Meso Terroirs (reference only; not canonical):** Bucaramanga uplands, San Gil, El Socorro, Ocaña, Toledo

#### Context
Drier mountain system with more solar exposure and lower rainfall

#### Environmental System
- **Elevation Band:** 1200-1800 m
- **Climate Regime:** warm-dry relative to other Colombian zones
- **Soil Base:** mixed sedimentary soils
- **Farming Model:** mixed estate + smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Castillo, Typica, Bourbon
- **Typical Processing:** washed
- **Cup Profile (structural):** nutty, cocoa, mild fruit
- **Acidity Character:** lower, rounded
- **Body Character:** medium

#### Why This Macro Stands Out
Drier conditions reduce acidity and increase body vs southern systems

---

### Western Andean Cordillera

**Country:** Colombia  **Admin Regions it overlaps:** Valle del Cauca / Risaralda / Cauca
**Typical Meso Terroirs (reference only; not canonical):** Trujillo, El Cairo, Santuario, Apía, Balboa, Inzá, Piendamó

#### Context
Closer to Pacific moisture influence with higher humidity and cloud cover

#### Environmental System
- **Elevation Band:** 1400-2000 m
- **Climate Regime:** cool, high humidity, heavy rainfall
- **Soil Base:** volcanic soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Caturra, Castillo
- **Typical Processing:** washed
- **Cup Profile (structural):** softer fruit, more rounded cup
- **Acidity Character:** malic, softer
- **Body Character:** medium

#### Why This Macro Stands Out
Increased cloud cover slows drying and softens acidity vs Central Cordillera

---

### Caribbean Slope Highlands

**Country:** Costa Rica  **Admin Regions it overlaps:** Limón
**Typical Meso Terroirs (reference only; not canonical):** Turrialba, Siquirres, Matina foothills

#### Context
Eastern slope system exposed to constant Caribbean moisture and limited drying windows

#### Environmental System
- **Elevation Band:** 800-1400 m
- **Climate Regime:** hot, humid, heavy year-round rainfall
- **Soil Base:** weathered volcanic soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Catuai, Caturra
- **Typical Processing:** washed, honey
- **Cup Profile (structural):** soft fruit, muted citrus
- **Acidity Character:** malic-soft
- **Body Character:** medium

#### Why This Macro Stands Out
High humidity suppresses acidity and clarity compared to Pacific-facing systems

---

### Central Volcanic Highlands

**Country:** Costa Rica  **Admin Regions it overlaps:** Alajuela / Heredia / San José
**Typical Meso Terroirs (reference only; not canonical):** Naranjo, Palmares, Grecia, Heredia foothills, Tarrazú (San Marcos, Santa María, León Cortés)

#### Context
Volcanic chain with structured elevations and strong infrastructure

#### Environmental System
- **Elevation Band:** 1200-1800 m
- **Climate Regime:** temperate, distinct wet/dry seasons
- **Soil Base:** volcanic ash soils
- **Farming Model:** smallholder + estate

#### What Comes Out of This System
- **Dominant Varieties:** Caturra, Catuai, SL hybrids
- **Typical Processing:** washed, honey
- **Cup Profile (structural):** common citrus, honey sweetness
- **Acidity Character:** citric-linear
- **Body Character:** medium silky

#### Why This Macro Stands Out
Strong processing control and volcanic soils drive clarity and balance

---

### Pacific Slope Highlands

**Country:** Costa Rica  **Admin Regions it overlaps:** Puntarenas
**Typical Meso Terroirs (reference only; not canonical):** Coto Brus, Brus Valley, Pérez Zeledón, Buenos Aires

#### Context
Drier slope with faster maturation and more sun exposure

#### Environmental System
- **Elevation Band:** 1000-1600 m
- **Climate Regime:** warm, pronounced dry season
- **Soil Base:** volcanic soils
- **Farming Model:** mixed

#### What Comes Out of This System
- **Dominant Varieties:** Catuai, Caturra
- **Typical Processing:** honey, natural
- **Cup Profile (structural):** more fruit-forward, less structured
- **Acidity Character:** malic
- **Body Character:** medium

#### Why This Macro Stands Out
More sun exposure increases fruit expression but reduces acidity precision

---

### Southern Highlands

**Country:** Costa Rica  **Admin Regions it overlaps:** San José / Cartago
**Typical Meso Terroirs (reference only; not canonical):** Dota, Tarrazú (San Marcos), San Pablo de León Cortés, Santa María de Dota

#### Context
Talamanca mountain system with high elevation and slower maturation than central regions

#### Environmental System
- **Elevation Band:** 1400-2000 m
- **Climate Regime:** cooler, high rainfall, frequent cloud cover
- **Soil Base:** volcanic ash soils
- **Farming Model:** smallholder + micro-mill

#### What Comes Out of This System
- **Dominant Varieties:** Caturra, Catuai, SL hybrids, Villa Sarchi
- **Typical Processing:** washed, honey
- **Cup Profile (structural):** citrus, floral, refined sweetness
- **Acidity Character:** citric-linear
- **Body Character:** medium-light

#### Why This Macro Stands Out
Higher elevation and slower ripening produce more refined acidity than most Costa Rican systems

---

### Escambray Massif

**Country:** Cuba  **Admin Regions it overlaps:** Sancti Spíritus / Cienfuegos
**Typical Meso Terroirs (reference only; not canonical):** Cumanayagua, Trinidad, Topes de Collantes

#### Context
Central mountain massif with slightly higher elevations and cooler microclimates

#### Environmental System
- **Elevation Band:** 900-1600 m
- **Climate Regime:** warm-temperate, moderate rainfall
- **Soil Base:** mixed soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Typica, Bourbon
- **Typical Processing:** washed
- **Cup Profile (structural):** mild citrus, cocoa, balanced sweetness
- **Acidity Character:** malic-soft
- **Body Character:** medium

#### Why This Macro Stands Out
Improved elevation vs Sierra Maestra yields slightly more structure and clarity

---

### Pinar del Río Western Highlands

**Country:** Cuba  **Admin Regions it overlaps:** Pinar del Río
**Typical Meso Terroirs (reference only; not canonical):** Sierra del Rosario, Viñales

#### Context
Western isolated mountain system with lower elevation and less consistency

#### Environmental System
- **Elevation Band:** 600-1200 m
- **Climate Regime:** warm, variable rainfall
- **Soil Base:** mixed soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Typica
- **Typical Processing:** washed
- **Cup Profile (structural):** muted fruit, heavier body
- **Acidity Character:** low
- **Body Character:** medium-heavy

#### Why This Macro Stands Out
Lower elevation and variability reduce clarity and increase body

---

### Sierra Maestra Mountains

**Country:** Cuba  **Admin Regions it overlaps:** Santiago de Cuba / Granma / Guantánamo
**Typical Meso Terroirs (reference only; not canonical):** Santiago uplands, Guantánamo, Granma

#### Context
Primary eastern mountain system with moderate elevation and tropical climate

#### Environmental System
- **Elevation Band:** 800-1500 m
- **Climate Regime:** warm, humid, seasonal rainfall
- **Soil Base:** mixed mountain soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Typica, Bourbon
- **Typical Processing:** washed
- **Cup Profile (structural):** chocolate, mild fruit, soft sweetness
- **Acidity Character:** low to malic-soft
- **Body Character:** medium

#### Why This Macro Stands Out
Lower elevation and humidity reduce acidity and complexity vs Central American systems

---

### Ituri Albertine Highlands

**Country:** DR Congo  **Admin Regions it overlaps:** Ituri
**Typical Meso Terroirs (reference only; not canonical):** Irumu, Djugu, Mahagi

#### Context
Transitional highland plateau near Albertine Rift with lower density production

#### Environmental System
- **Elevation Band:** 1200-1800 m
- **Climate Regime:** warm-temperate, moderate rainfall
- **Soil Base:** mixed soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Bourbon derivatives
- **Typical Processing:** washed
- **Cup Profile (structural):** mild fruit, herbal, less defined structure
- **Acidity Character:** malic-low
- **Body Character:** medium

#### Why This Macro Stands Out
Lower infrastructure and transitional ecology limit clarity and acidity structure

---

### Lake Kivu Highlands

**Country:** DR Congo  **Admin Regions it overlaps:** South Kivu / North Kivu
**Typical Meso Terroirs (reference only; not canonical):** Idjwi, Kalehe, Kabare, Minova

#### Context
Volcanic highland system surrounding Lake Kivu with strong humidity and lake influence

#### Environmental System
- **Elevation Band:** 1400-2000 m
- **Climate Regime:** cool-temperate, high humidity, consistent rainfall
- **Soil Base:** volcanic soils
- **Farming Model:** smallholder, washing station-based

#### What Comes Out of This System
- **Dominant Varieties:** Bourbon derivatives
- **Typical Processing:** washed
- **Cup Profile (structural):** citrus, red fruit, softer structure
- **Acidity Character:** citric-malic, rounded
- **Body Character:** medium silky

#### Why This Macro Stands Out
Lake influence moderates acidity and increases roundness compared to inland East African systems

---

### Rwenzori Grand Nord Highlands

**Country:** DR Congo  **Admin Regions it overlaps:** North Kivu
**Typical Meso Terroirs (reference only; not canonical):** Beni, Lubero, Butembo

#### Context
Mountain system extending from Rwenzori range with more isolation and less infrastructure

#### Environmental System
- **Elevation Band:** 1400-2000 m
- **Climate Regime:** humid, variable rainfall, cooler at elevation
- **Soil Base:** mixed volcanic and mountain soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Bourbon derivatives
- **Typical Processing:** washed
- **Cup Profile (structural):** muted fruit, cocoa, softer clarity
- **Acidity Character:** malic-soft
- **Body Character:** medium

#### Why This Macro Stands Out
Inconsistent processing and isolation reduce clarity despite strong elevation potential

---

### Cordillera Central Highlands

**Country:** Dominican Republic  **Admin Regions it overlaps:** La Vega / Monseñor Nouel / San José de Ocoa
**Typical Meso Terroirs (reference only; not canonical):** Jarabacoa, Constanza, Bonao, Ocoa

#### Context
Main central mountain system with highest elevations in the country

#### Environmental System
- **Elevation Band:** 1000-1700 m
- **Climate Regime:** temperate, moderate rainfall
- **Soil Base:** volcanic-influenced soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Caturra, Typica, Bourbon
- **Typical Processing:** washed
- **Cup Profile (structural):** citrus, cocoa, balanced sweetness
- **Acidity Character:** malic-citric soft
- **Body Character:** medium

#### Why This Macro Stands Out
Best structure and clarity potential in Dominican Republic due to elevation

---

### Cordillera Septentrional Highlands

**Country:** Dominican Republic  **Admin Regions it overlaps:** Santiago / Espaillat / Puerto Plata
**Typical Meso Terroirs (reference only; not canonical):** San José de las Matas, Jamao, Moca

#### Context
Northern range with more humidity and lower average elevation

#### Environmental System
- **Elevation Band:** 800-1400 m
- **Climate Regime:** humid, high rainfall
- **Soil Base:** mixed soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Typica, Caturra
- **Typical Processing:** washed
- **Cup Profile (structural):** soft fruit, round sweetness
- **Acidity Character:** malic-soft
- **Body Character:** medium

#### Why This Macro Stands Out
Higher humidity reduces clarity compared to Cordillera Central

---

### Sierra de Bahoruco Highlands

**Country:** Dominican Republic  **Admin Regions it overlaps:** Barahona
**Typical Meso Terroirs (reference only; not canonical):** Polo, Paraíso

#### Context
Southwestern highland system with slightly drier conditions and isolated production

#### Environmental System
- **Elevation Band:** 1000-1600 m
- **Climate Regime:** warm, moderate rainfall, slightly drier than north
- **Soil Base:** mixed mountain soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Typica, Bourbon
- **Typical Processing:** washed
- **Cup Profile (structural):** cocoa, light fruit, mild structure
- **Acidity Character:** malic-low
- **Body Character:** medium

#### Why This Macro Stands Out
Drier conditions improve structure slightly but varietal base limits acidity ceiling

---

### Northern Andean Highlands

**Country:** Ecuador  **Admin Regions it overlaps:** Pichincha / Imbabura / Carchi
**Typical Meso Terroirs (reference only; not canonical):** Pichincha, Imbabura, Intag

#### Context
Northern Andes system with higher humidity and stronger cloud forest influence

#### Environmental System
- **Elevation Band:** 1200-1800 m
- **Climate Regime:** humid, cloud cover, frequent rainfall
- **Soil Base:** volcanic soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Caturra, Typica
- **Typical Processing:** washed, natural
- **Cup Profile (structural):** muted fruit, herbal, softer structure
- **Acidity Character:** malic-soft
- **Body Character:** medium

#### Why This Macro Stands Out
Increased humidity and cloud cover reduce acidity definition compared to southern Ecuador

---

### Southern Andean Highlands

**Country:** Ecuador  **Admin Regions it overlaps:** Loja / Zamora-Chinchipe
**Typical Meso Terroirs (reference only; not canonical):** Loja, Vilcabamba, Zamora

#### Context
High-elevation southern Andes system with moderate isolation and emerging specialty focus

#### Environmental System
- **Elevation Band:** 1400-2000 m
- **Climate Regime:** temperate, moderate rainfall, less humidity than northern Andes
- **Soil Base:** mixed volcanic and loamy soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Caturra, Typica, Bourbon, Loja hybrids
- **Typical Processing:** washed
- **Cup Profile (structural):** citrus, mild florals, soft sweetness
- **Acidity Character:** malic-citric soft
- **Body Character:** medium-light

#### Why This Macro Stands Out
Good elevation but less processing consistency reduces clarity vs Colombia or Guatemala

---

### Alotepec-Metapán Highlands

**Country:** El Salvador  **Admin Regions it overlaps:** Chalatenango / Santa Ana
**Typical Meso Terroirs (reference only; not canonical):** Metapán, La Palma

#### Context
Northern mountainous region with cooler climate and less density of production

#### Environmental System
- **Elevation Band:** 1200-1700 m
- **Climate Regime:** cooler, moderate rainfall
- **Soil Base:** mixed volcanic soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Bourbon, Pacas
- **Typical Processing:** washed
- **Cup Profile (structural):** citrus, herbal notes, structured sweetness
- **Acidity Character:** citric-malic
- **Body Character:** medium

#### Why This Macro Stands Out
Cooler northern climate improves structure while maintaining moderate body

---

### Apaneca-Ilamatepec Highlands

**Country:** El Salvador  **Admin Regions it overlaps:** Santa Ana / Ahuachapán
**Typical Meso Terroirs (reference only; not canonical):** Apaneca, Ataco, Juayúa

#### Context
Primary volcanic chain with highest concentration of elevation and production

#### Environmental System
- **Elevation Band:** 1200-1800 m
- **Climate Regime:** temperate, distinct wet/dry seasons
- **Soil Base:** young volcanic ash soils
- **Farming Model:** estate + smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Bourbon, Pacas, Pacamara
- **Typical Processing:** washed, honey
- **Cup Profile (structural):** citrus, caramel, floral structure
- **Acidity Character:** citric-malic
- **Body Character:** medium silky

#### Why This Macro Stands Out
Best combination of elevation and volcanic soils produces highest clarity in the country

---

### Bálsamo Volcanic Belt

**Country:** El Salvador  **Admin Regions it overlaps:** La Libertad / San Salvador
**Typical Meso Terroirs (reference only; not canonical):** Comasagua, Talnique

#### Context
Lower elevation volcanic belt closer to Pacific with higher temperatures

#### Environmental System
- **Elevation Band:** 900-1400 m
- **Climate Regime:** warm, strong sun exposure, seasonal rainfall
- **Soil Base:** volcanic soils
- **Farming Model:** estate

#### What Comes Out of This System
- **Dominant Varieties:** Bourbon, Pacas
- **Typical Processing:** honey, natural
- **Cup Profile (structural):** round sweetness, mild fruit
- **Acidity Character:** malic-soft
- **Body Character:** medium

#### Why This Macro Stands Out
Lower elevation and heat soften acidity and increase body compared to Apaneca

---

### Cacahuatique Eastern Highlands

**Country:** El Salvador  **Admin Regions it overlaps:** Morazán
**Typical Meso Terroirs (reference only; not canonical):** Ciudad Barrios

#### Context
Remote eastern highland system with lower infrastructure and warmer baseline climate

#### Environmental System
- **Elevation Band:** 900-1400 m
- **Climate Regime:** warm, moderate rainfall
- **Soil Base:** mixed soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Bourbon
- **Typical Processing:** washed
- **Cup Profile (structural):** muted fruit, soft sweetness
- **Acidity Character:** malic-low
- **Body Character:** medium

#### Why This Macro Stands Out
Lower elevation and infrastructure reduce clarity and consistency compared to western regions

---

### Chinchontepec Volcanic Slopes

**Country:** El Salvador  **Admin Regions it overlaps:** San Vicente
**Typical Meso Terroirs (reference only; not canonical):** San Vicente

#### Context
Isolated volcano system with moderate elevation and less intensive farming

#### Environmental System
- **Elevation Band:** 1000-1600 m
- **Climate Regime:** warm-temperate, seasonal rainfall
- **Soil Base:** volcanic soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Bourbon
- **Typical Processing:** washed, honey
- **Cup Profile (structural):** mild fruit, cocoa, balanced sweetness
- **Acidity Character:** malic-soft
- **Body Character:** medium

#### Why This Macro Stands Out
Moderate elevation produces balanced but less expressive cups

---

### Tecapa-Chinameca Highlands

**Country:** El Salvador  **Admin Regions it overlaps:** Usulután / San Miguel
**Typical Meso Terroirs (reference only; not canonical):** Alegría, Berlín

#### Context
Eastern volcanic system with slightly higher elevation pockets and cooler microclimates

#### Environmental System
- **Elevation Band:** 1100-1700 m
- **Climate Regime:** temperate, moderate humidity
- **Soil Base:** volcanic soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Bourbon, Pacas, Pacamara
- **Typical Processing:** washed, honey
- **Cup Profile (structural):** fruit-forward, floral sweetness
- **Acidity Character:** malic-citric
- **Body Character:** medium-light

#### Why This Macro Stands Out
Higher elevation pockets allow more expressive cups than surrounding eastern regions

---

### Bench Sheko Highlands

**Country:** Ethiopia  **Admin Regions it overlaps:** South West Ethiopia Peoples Region (Bench Sheko / West Omo)
**Typical Meso Terroirs (reference only; not canonical):** Gesha Village, Gori Gesha forest, Surma fringe zones

#### Context
Remote high-elevation forest system near origin of Gesha genetics with dense agroforestry and minimal historical domestication

#### Environmental System
- **Elevation Band:** 1800-2200 m
- **Climate Regime:** cool, humid, high rainfall, stable cloud cover
- **Soil Base:** virgin forest, brown-red loamy soils
- **Farming Model:** estate + controlled agroforestry (semi-wild structure)

#### What Comes Out of This System
- **Dominant Varieties:** Gesha (Gori Gesha), Ethiopian landrace selections
- **Typical Processing:** washed + natural
- **Cup Profile (structural):** floral (jasmine), citrus, stone fruit, tea-like clarity
- **Acidity Character:** citric-linear to malic, high clarity
- **Body Character:** light silky

#### Why This Macro Stands Out
Combination of origin genetics, high elevation, and forest ecology produces some of the highest clarity and most floral coffees globally

---

### Guji Highlands

**Country:** Ethiopia  **Admin Regions it overlaps:** Oromia (Guji)
**Typical Meso Terroirs (reference only; not canonical):** Hambela, Uraga

#### Context
Expanded southern system with more spacing and slightly warmer climate than Yirgacheffe

#### Environmental System
- **Elevation Band:** 1600-2200 m
- **Climate Regime:** temperate, slightly warmer, consistent rainfall
- **Soil Base:** red loam
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Ethiopian landrace populations
- **Typical Processing:** washed, natural
- **Cup Profile (structural):** floral fruit, round sweetness, less angular than Yirgacheffe
- **Acidity Character:** malic-citric rounded
- **Body Character:** medium-light

#### Why This Macro Stands Out
More forgiving and fruit-forward than Yirgacheffe with slightly softer acidity

---

### Harar Eastern Highlands

**Country:** Ethiopia  **Admin Regions it overlaps:** Hararghe
**Typical Meso Terroirs (reference only; not canonical):** Hararghe zones

#### Context
Drier eastern plateau system with strong sun exposure and traditional processing

#### Environmental System
- **Elevation Band:** 1400-2000 m
- **Climate Regime:** warm-dry, lower rainfall, high sun exposure
- **Soil Base:** rocky, less fertile soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Ethiopian landrace populations
- **Typical Processing:** natural
- **Cup Profile (structural):** blueberry, winey fruit, rustic sweetness
- **Acidity Character:** low to malic-winey
- **Body Character:** medium

#### Why This Macro Stands Out
Dry climate and natural processing create distinct fruit-forward but less structured profiles

---

### Sidama Highlands

**Country:** Ethiopia  **Admin Regions it overlaps:** Sidama
**Typical Meso Terroirs (reference only; not canonical):** Aleta Wondo, Bensa

#### Context
High-elevation southern system with balanced rainfall and broad production base

#### Environmental System
- **Elevation Band:** 1600-2300 m
- **Climate Regime:** temperate, reliable rainfall, moderate humidity
- **Soil Base:** red-brown clay loam
- **Farming Model:** smallholder, washing station-based

#### What Comes Out of This System
- **Dominant Varieties:** Ethiopian landrace populations
- **Typical Processing:** washed, natural
- **Cup Profile (structural):** citrus, florals, balanced sweetness
- **Acidity Character:** citric-malic balanced
- **Body Character:** medium silky

#### Why This Macro Stands Out
Acts as a “baseline Ethiopia” with strong balance between clarity and body

---

### West Arsi Highlands

**Country:** Ethiopia  **Admin Regions it overlaps:** Oromia (West Arsi)
**Typical Meso Terroirs (reference only; not canonical):** Nensebo, Dodola

#### Context
Higher elevation extension with cooler climate and structured ripening

#### Environmental System
- **Elevation Band:** 1700-2300 m
- **Climate Regime:** cooler, stable rainfall, lower humidity than Yirgacheffe
- **Soil Base:** mixed volcanic-influenced soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Ethiopian landrace populations
- **Typical Processing:** washed
- **Cup Profile (structural):** clean citrus, florals, structured sweetness
- **Acidity Character:** citric-linear
- **Body Character:** light to medium

#### Why This Macro Stands Out
Combines Yirgacheffe clarity with slightly more structure and stability

---

### Western Ethiopian Forest Highlands

**Country:** Ethiopia  **Admin Regions it overlaps:** Oromia / SNNP
**Typical Meso Terroirs (reference only; not canonical):** Jimma, Limu, Kaffa

#### Context
Forest-grown system with heavier shade and less controlled processing

#### Environmental System
- **Elevation Band:** 1400-2000 m
- **Climate Regime:** warm-humid, high rainfall, dense canopy
- **Soil Base:** forest loam, organic-rich soils
- **Farming Model:** smallholder, semi-forest systems

#### What Comes Out of This System
- **Dominant Varieties:** Ethiopian landrace populations
- **Typical Processing:** natural, washed
- **Cup Profile (structural):** muted fruit, cocoa, spice, lower clarity
- **Acidity Character:** malic-soft to muted
- **Body Character:** medium to heavy

#### Why This Macro Stands Out
Shade-grown and less controlled fermentation reduce clarity and increase body

---

### Yirgacheffe Highlands

**Country:** Ethiopia  **Admin Regions it overlaps:** Gedeo
**Typical Meso Terroirs (reference only; not canonical):** Kochere, Gedeb

#### Context
Dense highland microclimate with intense elevation and slower maturation

#### Environmental System
- **Elevation Band:** 1700-2200 m
- **Climate Regime:** cooler, high humidity, frequent cloud cover
- **Soil Base:** highly weathered red soils
- **Farming Model:** smallholder, dense washing station network

#### What Comes Out of This System
- **Dominant Varieties:** Ethiopian landrace populations
- **Typical Processing:** washed, natural
- **Cup Profile (structural):** high florals, tea-like, citrus and bergamot
- **Acidity Character:** citric-linear, high clarity
- **Body Character:** light silky

#### Why This Macro Stands Out
One of the highest clarity systems globally due to slow ripening and tight elevation clustering

---

### Caribbean Slope Highlands

**Country:** Guatemala  **Admin Regions it overlaps:** Izabal
**Typical Meso Terroirs (reference only; not canonical):** Livingston, Los Amates, Morales foothills

#### Context
Low-elevation humid Caribbean-facing system with heavy rainfall

#### Environmental System
- **Elevation Band:** 800-1400 m
- **Climate Regime:** hot, humid, high rainfall
- **Soil Base:** alluvial and mixed soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Caturra
- **Typical Processing:** washed
- **Cup Profile (structural):** soft fruit, muted citrus
- **Acidity Character:** malic-soft
- **Body Character:** medium

#### Why This Macro Stands Out
Humidity and drying challenges suppress clarity compared to inland volcanic systems

---

### Central Volcanic Highlands

**Country:** Guatemala  **Admin Regions it overlaps:** Sacatepéquez / Chimaltenango
**Typical Meso Terroirs (reference only; not canonical):** Antigua Valley, Ciudad Vieja, San Miguel Dueñas, Pastores, Acatenango, San Martín Jilotepeque

#### Context
Core volcanic chain with strong elevation and consistent specialty infrastructure

#### Environmental System
- **Elevation Band:** 1300-1900 m
- **Climate Regime:** temperate, distinct wet/dry seasons
- **Soil Base:** young volcanic ash soils
- **Farming Model:** smallholder + estate

#### What Comes Out of This System
- **Dominant Varieties:** Bourbon, Caturra, Catuai
- **Typical Processing:** washed
- **Cup Profile (structural):** citrus, floral, caramel sweetness
- **Acidity Character:** citric-linear
- **Body Character:** medium silky

#### Why This Macro Stands Out
One of the most consistent high-clarity washed systems due to volcanic soils and stable climate

---

### Eastern Highlands

**Country:** Guatemala  **Admin Regions it overlaps:** Zacapa / Chiquimula
**Typical Meso Terroirs (reference only; not canonical):** Esquipulas, Jocotán, Camotán, Olopa

#### Context
Lower elevation, drier inland region with less dense production

#### Environmental System
- **Elevation Band:** 1000-1600 m
- **Climate Regime:** warm-dry, strong sun exposure
- **Soil Base:** mixed soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Caturra, Bourbon
- **Typical Processing:** washed
- **Cup Profile (structural):** mild fruit, cocoa, softer structure
- **Acidity Character:** malic-low
- **Body Character:** medium

#### Why This Macro Stands Out
Lower elevation and heat reduce clarity and increase body vs western regions

---

### Western Dry Highlands

**Country:** Guatemala  **Admin Regions it overlaps:** Huehuetenango / Quiché
**Typical Meso Terroirs (reference only; not canonical):** La Democracia, San Pedro Necta, La Libertad, Todos Santos Cuchumatán, Santa Eulalia

#### Context
High-altitude region with dry climate and strong diurnal shifts

#### Environmental System
- **Elevation Band:** 1500-2200 m
- **Climate Regime:** drier, high sun exposure, cooler nights
- **Soil Base:** limestone + mixed soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Bourbon, Caturra
- **Typical Processing:** washed
- **Cup Profile (structural):** bright citrus, stone fruit, high clarity
- **Acidity Character:** citric-bright
- **Body Character:** medium-light

#### Why This Macro Stands Out
Dry climate allows precise drying and high acidity expression despite extreme elevation

---

### Cahos Matheux Range

**Country:** Haiti  **Admin Regions it overlaps:** Centre
**Typical Meso Terroirs (reference only; not canonical):** Thomonde, Mirebalais

#### Context
Interior mountain range with lower elevation and warmer baseline climate

#### Environmental System
- **Elevation Band:** 700-1300 m
- **Climate Regime:** warm, moderate rainfall
- **Soil Base:** mixed soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Typica
- **Typical Processing:** natural, washed
- **Cup Profile (structural):** mild fruit, soft sweetness
- **Acidity Character:** malic-soft
- **Body Character:** medium

#### Why This Macro Stands Out
Lower elevation and less organized processing reduce acidity and structure

---

### Massif de la Hotte

**Country:** Haiti  **Admin Regions it overlaps:** Sud / Grand’Anse
**Typical Meso Terroirs (reference only; not canonical):** Beaumont

#### Context
Remote southwestern system with isolation and minimal infrastructure

#### Environmental System
- **Elevation Band:** 800-1400 m
- **Climate Regime:** humid, high rainfall
- **Soil Base:** mixed soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Typica
- **Typical Processing:** natural
- **Cup Profile (structural):** muted fruit, heavier sweetness
- **Acidity Character:** malic-low
- **Body Character:** medium-heavy

#### Why This Macro Stands Out
Isolation and drying constraints produce heavier, less defined profiles

---

### Massif de la Selle

**Country:** Haiti  **Admin Regions it overlaps:** Ouest / Sud-Est
**Typical Meso Terroirs (reference only; not canonical):** Kenscoff, Thiotte

#### Context
Highest elevation system in Haiti with cooler temperatures and strong potential

#### Environmental System
- **Elevation Band:** 1200-1800 m
- **Climate Regime:** temperate, moderate humidity
- **Soil Base:** mixed mountain soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Typica, Bourbon
- **Typical Processing:** washed
- **Cup Profile (structural):** citrus, light florals, cleaner structure
- **Acidity Character:** citric-malic
- **Body Character:** medium-light

#### Why This Macro Stands Out
Best clarity potential in Haiti due to elevation, though still limited by processing variability

---

### Massif du Nord Highlands

**Country:** Haiti  **Admin Regions it overlaps:** Nord
**Typical Meso Terroirs (reference only; not canonical):** Dondon, Marmelade

#### Context
Northern mountain chain with moderate elevation and limited infrastructure

#### Environmental System
- **Elevation Band:** 800-1400 m
- **Climate Regime:** warm, humid, seasonal rainfall
- **Soil Base:** mixed mountain soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Typica, Bourbon
- **Typical Processing:** natural, washed
- **Cup Profile (structural):** muted fruit, cocoa, rustic sweetness
- **Acidity Character:** malic-low
- **Body Character:** medium

#### Why This Macro Stands Out
Infrastructure and processing inconsistency limit clarity despite viable elevation

---

### Central Honduras Highlands

**Country:** Honduras  **Admin Regions it overlaps:** Comayagua / La Paz
**Typical Meso Terroirs (reference only; not canonical):** Montecillos, Comayagua

#### Context
Central mountain system with moderate elevation and strong cooperative presence

#### Environmental System
- **Elevation Band:** 1200-1700 m
- **Climate Regime:** temperate, seasonal rainfall
- **Soil Base:** mixed soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Catuai, Bourbon, Pacas
- **Typical Processing:** washed
- **Cup Profile (structural):** citrus, soft fruit, balanced sweetness
- **Acidity Character:** malic-citric
- **Body Character:** medium

#### Why This Macro Stands Out
Consistent processing and moderate elevation produce balanced, approachable profiles

---

### Eastern Honduras Highlands

**Country:** Honduras  **Admin Regions it overlaps:** El Paraíso
**Typical Meso Terroirs (reference only; not canonical):** El Paraíso

#### Context
Eastern system with slightly lower elevation and warmer baseline climate

#### Environmental System
- **Elevation Band:** 1000-1500 m
- **Climate Regime:** warm-temperate, moderate rainfall
- **Soil Base:** mixed soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Catuai, Bourbon
- **Typical Processing:** washed
- **Cup Profile (structural):** mild fruit, cocoa, softer structure
- **Acidity Character:** malic-soft
- **Body Character:** medium

#### Why This Macro Stands Out
Lower elevation reduces acidity definition compared to western and central regions

---

### Western Honduras Highlands

**Country:** Honduras  **Admin Regions it overlaps:** Copán / Ocotepeque / Lempira
**Typical Meso Terroirs (reference only; not canonical):** Copán, Ocotepeque, Lempira

#### Context
High-elevation western system bordering Guatemala with strong specialty development

#### Environmental System
- **Elevation Band:** 1200-1800 m
- **Climate Regime:** temperate, moderate rainfall
- **Soil Base:** mixed volcanic and loam soils
- **Farming Model:** smallholder + cooperative

#### What Comes Out of This System
- **Dominant Varieties:** Bourbon, Catuai, Lempira
- **Typical Processing:** washed
- **Cup Profile (structural):** citrus, caramel, balanced sweetness
- **Acidity Character:** citric-malic
- **Body Character:** medium silky

#### Why This Macro Stands Out
One of the most consistent Central American systems with strong clarity and structure

---

### Araku Eastern Ghats Highlands

**Country:** India  **Admin Regions it overlaps:** Andhra Pradesh / Odisha
**Typical Meso Terroirs (reference only; not canonical):** Araku Valley

#### Context
Isolated tribal highland system with increasing specialty focus and improved processing

#### Environmental System
- **Elevation Band:** 900-1400 m
- **Climate Regime:** warm-temperate, moderate rainfall
- **Soil Base:** red loam
- **Farming Model:** smallholder cooperative

#### What Comes Out of This System
- **Dominant Varieties:** Arabica hybrids (S795, Catimor)
- **Typical Processing:** washed, natural
- **Cup Profile (structural):** fruit-forward, softer spice, cleaner profile
- **Acidity Character:** malic-citric
- **Body Character:** medium-light

#### Why This Macro Stands Out
Improved processing and moderate elevation produce cleaner cups than Western Ghats systems

---

### Karnataka Western Ghats

**Country:** India  **Admin Regions it overlaps:** Karnataka
**Typical Meso Terroirs (reference only; not canonical):** Chikkamagaluru, Coorg

#### Context
Dense shade-grown mountain system with intercropping and high biodiversity

#### Environmental System
- **Elevation Band:** 900-1500 m
- **Climate Regime:** warm, humid, monsoonal with heavy rainfall
- **Soil Base:** red loam and lateritic soils
- **Farming Model:** estate dominant, shade-grown

#### What Comes Out of This System
- **Dominant Varieties:** S795, Sln9, Catimor, some Robusta
- **Typical Processing:** washed, natural
- **Cup Profile (structural):** spice, cocoa, mild fruit
- **Acidity Character:** malic-soft
- **Body Character:** medium to heavy

#### Why This Macro Stands Out
Shade and intercropping slow maturation and increase body while muting acidity

---

### Kerala Western Ghats

**Country:** India  **Admin Regions it overlaps:** Kerala
**Typical Meso Terroirs (reference only; not canonical):** Wayanad

#### Context
Lower elevation extension of Western Ghats with stronger tropical influence

#### Environmental System
- **Elevation Band:** 800-1200 m
- **Climate Regime:** hot, humid, heavy rainfall
- **Soil Base:** lateritic soils
- **Farming Model:** estate + smallholder

#### What Comes Out of This System
- **Dominant Varieties:** S795, Robusta blends
- **Typical Processing:** washed, natural
- **Cup Profile (structural):** chocolate, earth, soft sweetness
- **Acidity Character:** low to malic-soft
- **Body Character:** medium-heavy

#### Why This Macro Stands Out
Higher heat and humidity further suppress acidity and increase density vs Karnataka

---

### Tamil Nadu High Ranges

**Country:** India  **Admin Regions it overlaps:** Tamil Nadu
**Typical Meso Terroirs (reference only; not canonical):** Nilgiris, Anamalai

#### Context
Higher elevation southern system with slightly cooler climate and more structured growth

#### Environmental System
- **Elevation Band:** 1200-2000 m
- **Climate Regime:** temperate, seasonal rainfall
- **Soil Base:** mixed loam and forest soils
- **Farming Model:** estate

#### What Comes Out of This System
- **Dominant Varieties:** S795, Kent, Catimor
- **Typical Processing:** washed
- **Cup Profile (structural):** citrus, spice, balanced sweetness
- **Acidity Character:** malic-citric soft
- **Body Character:** medium

#### Why This Macro Stands Out
Higher elevation improves structure and clarity compared to other Indian systems

---

### Bali Volcanic Highlands

**Country:** Indonesia  **Admin Regions it overlaps:** Bali
**Typical Meso Terroirs (reference only; not canonical):** Kintamani

#### Context
Isolated volcanic system with cooperative farming and consistent washed processing

#### Environmental System
- **Elevation Band:** 1200-1600 m
- **Climate Regime:** moderate humidity, distinct wet/dry seasons
- **Soil Base:** volcanic soils
- **Farming Model:** smallholder cooperative

#### What Comes Out of This System
- **Dominant Varieties:** Kintamani Typica, S795
- **Typical Processing:** washed
- **Cup Profile (structural):** citrus, light fruit, clean sweetness
- **Acidity Character:** citric-soft
- **Body Character:** medium-light

#### Why This Macro Stands Out
One of the cleanest Indonesian systems due to consistent washed processing and cooperative control

---

### Flores Volcanic Highlands

**Country:** Indonesia  **Admin Regions it overlaps:** East Nusa Tenggara (Flores)
**Typical Meso Terroirs (reference only; not canonical):** Bajawa, Ngada

#### Context
Volcanic island system with mixed processing and moderate humidity

#### Environmental System
- **Elevation Band:** 1100-1600 m
- **Climate Regime:** warm, moderate rainfall, less humid than Sumatra
- **Soil Base:** volcanic soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** S795, Typica derivatives
- **Typical Processing:** washed, wet-hulled
- **Cup Profile (structural):** chocolate, mild fruit, softer structure
- **Acidity Character:** malic-soft
- **Body Character:** medium

#### Why This Macro Stands Out
Intermediate system between Java clarity and Sumatra density

---

### Java Volcanic Highlands

**Country:** Indonesia  **Admin Regions it overlaps:** West Java / Central Java / East Java
**Typical Meso Terroirs (reference only; not canonical):** Priangan, Ijen, Malang

#### Context
Volcanic chain with more structured estates and improved processing control

#### Environmental System
- **Elevation Band:** 1000-1600 m
- **Climate Regime:** temperate, seasonal rainfall, less humidity than Sumatra
- **Soil Base:** volcanic soils (andosols)
- **Farming Model:** estate + smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Typica, S795, Catimor
- **Typical Processing:** washed, wet-hulled
- **Cup Profile (structural):** cleaner chocolate, mild fruit, structured
- **Acidity Character:** malic-soft
- **Body Character:** medium

#### Why This Macro Stands Out
Better processing control and lower humidity produce cleaner profiles than Sumatra

---

### Papua Highlands

**Country:** Indonesia  **Admin Regions it overlaps:** Papua
**Typical Meso Terroirs (reference only; not canonical):** Wamena, Baliem Valley

#### Context
Remote highland system with cooler climate and limited processing infrastructure

#### Environmental System
- **Elevation Band:** 1400-1800 m
- **Climate Regime:** cooler, humid, isolated
- **Soil Base:** mountain loam
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Typica, local hybrids
- **Typical Processing:** washed
- **Cup Profile (structural):** light fruit, herbal, less developed structure
- **Acidity Character:** malic-soft
- **Body Character:** medium

#### Why This Macro Stands Out
Cooler climate increases potential clarity but inconsistency limits expression

---

### Sulawesi Highlands

**Country:** Indonesia  **Admin Regions it overlaps:** South Sulawesi / Central Sulawesi
**Typical Meso Terroirs (reference only; not canonical):** Toraja, Enrekang, Mamasa

#### Context
Mountain system with mixed processing and complex microclimates

#### Environmental System
- **Elevation Band:** 1200-1800 m
- **Climate Regime:** humid but more variable than Sumatra
- **Soil Base:** volcanic and metamorphic soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** S795, Typica
- **Typical Processing:** wet-hulled, washed
- **Cup Profile (structural):** herbal, spice, deeper fruit, structured body
- **Acidity Character:** malic-muted
- **Body Character:** medium to heavy

#### Why This Macro Stands Out
Hybrid system combining wet-hulled body with occasional clarity from washed processing

---

### Sumatra Highlands

**Country:** Indonesia  **Admin Regions it overlaps:** Aceh / North Sumatra / West Sumatra
**Typical Meso Terroirs (reference only; not canonical):** Gayo, Lintong, Mandheling

#### Context
Mountain system with high humidity and wet-hulled processing dominating drying conditions

#### Environmental System
- **Elevation Band:** 1200-1700 m
- **Climate Regime:** warm-humid, frequent rainfall, limited drying windows
- **Soil Base:** volcanic andosols with high organic content
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Catimor, Ateng
- **Typical Processing:** wet-hulled
- **Cup Profile (structural):** earthy, spice, cocoa, low clarity
- **Acidity Character:** muted to low
- **Body Character:** heavy, dense

#### Why This Macro Stands Out
Wet-hulled processing and humidity suppress acidity and create uniquely heavy body profiles

---

### Timor Highlands

**Country:** Indonesia  **Admin Regions it overlaps:** East Nusa Tenggara (Timor)
**Typical Meso Terroirs (reference only; not canonical):** Kefamenanu, Mollo

#### Context
Drier island system with simpler processing and lower infrastructure

#### Environmental System
- **Elevation Band:** 1000-1500 m
- **Climate Regime:** warm, seasonal rainfall, drier than Flores
- **Soil Base:** mixed volcanic and limestone soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Catimor
- **Typical Processing:** washed, natural
- **Cup Profile (structural):** muted fruit, cocoa, simple sweetness
- **Acidity Character:** muted
- **Body Character:** medium

#### Why This Macro Stands Out
Drier climate improves drying but varietal base limits complexity

---

### Central Kenyan Volcanic Highlands

**Country:** Kenya  **Admin Regions it overlaps:** Central Province / Rift Valley
**Typical Meso Terroirs (reference only; not canonical):** Nyeri, Kirinyaga, Murang’a

#### Context
High-elevation volcanic system along Mount Kenya with strong cooperative infrastructure

#### Environmental System
- **Elevation Band:** 1500-2200 m
- **Climate Regime:** cool, stable rainfall, strong diurnal shifts
- **Soil Base:** deep volcanic red soils
- **Farming Model:** smallholder cooperative

#### What Comes Out of This System
- **Dominant Varieties:** SL28, SL34, Ruiru 11, Batian
- **Typical Processing:** washed
- **Cup Profile (structural):** intense citrus, blackcurrant, florals
- **Acidity Character:** phosphoric-citric, high intensity
- **Body Character:** medium-light

#### Why This Macro Stands Out
Benchmark for high-acidity precision due to elevation, varietals, and processing control

---

### Western Rift Valley Highlands

**Country:** Kenya  **Admin Regions it overlaps:** Western Kenya / Rift Valley
**Typical Meso Terroirs (reference only; not canonical):** Kisii, Bungoma

#### Context
Lower elevation western system with more humidity and less infrastructure

#### Environmental System
- **Elevation Band:** 1400-1900 m
- **Climate Regime:** warm-temperate, higher humidity
- **Soil Base:** mixed volcanic soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** SL varieties + Ruiru 11
- **Typical Processing:** washed
- **Cup Profile (structural):** softer fruit, less intensity
- **Acidity Character:** malic-citric, reduced intensity
- **Body Character:** medium

#### Why This Macro Stands Out
Higher humidity and lower elevation soften acidity compared to Central Kenya

---

### Bolaven Plateau Volcanic Highlands

**Country:** Laos  **Admin Regions it overlaps:** Champasak / Sekong / Saravane
**Typical Meso Terroirs (reference only; not canonical):** Paksong, Thateng

#### Context
Elevated volcanic plateau with relatively consistent production and improving infrastructure

#### Environmental System
- **Elevation Band:** 1000-1300 m
- **Climate Regime:** warm-temperate, high rainfall, moderate humidity
- **Soil Base:** volcanic soils
- **Farming Model:** smallholder + estate

#### What Comes Out of This System
- **Dominant Varieties:** Catimor, Typica derivatives
- **Typical Processing:** washed, natural
- **Cup Profile (structural):** chocolate, soft fruit, mild citrus
- **Acidity Character:** malic-soft
- **Body Character:** medium

#### Why This Macro Stands Out
One of the most stable Southeast Asian systems with repeatable baseline profiles

---

### Northern Laos Highlands

**Country:** Laos  **Admin Regions it overlaps:** Luang Prabang / Oudomxay
**Typical Meso Terroirs (reference only; not canonical):** Luang Prabang, Oudomxay

#### Context
Emerging mountain system with lower density production and less consistency

#### Environmental System
- **Elevation Band:** 900-1400 m
- **Climate Regime:** warm-temperate, seasonal rainfall
- **Soil Base:** mixed soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Catimor
- **Typical Processing:** washed
- **Cup Profile (structural):** mild fruit, herbal, soft sweetness
- **Acidity Character:** malic-low
- **Body Character:** medium

#### Why This Macro Stands Out
Lower infrastructure and smaller scale reduce clarity and consistency vs Bolaven

---

### Northern Malawi Highlands

**Country:** Malawi  **Admin Regions it overlaps:** Northern Region
**Typical Meso Terroirs (reference only; not canonical):** Misuku Hills, Viphya Plateau

#### Context
Higher elevation northern system with cooler climate and improving specialty focus

#### Environmental System
- **Elevation Band:** 1200-1800 m
- **Climate Regime:** temperate, moderate rainfall
- **Soil Base:** red clay loam
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Catimor, Bourbon
- **Typical Processing:** washed
- **Cup Profile (structural):** mild fruit, cleaner structure than south
- **Acidity Character:** malic-citric
- **Body Character:** medium-light

#### Why This Macro Stands Out
Higher elevation improves clarity relative to southern Malawi but still below Kenya/Rwanda ceiling

---

### Southern Malawi Highlands

**Country:** Malawi  **Admin Regions it overlaps:** Southern Region
**Typical Meso Terroirs (reference only; not canonical):** Thyolo, Mulanje, Zomba

#### Context
Southern estate-driven system with moderate elevation and tropical influence

#### Environmental System
- **Elevation Band:** 900-1300 m
- **Climate Regime:** warm, humid, seasonal rainfall
- **Soil Base:** lateritic and loamy soils
- **Farming Model:** estate + smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Catimor, Geisha (limited), Bourbon
- **Typical Processing:** washed, natural
- **Cup Profile (structural):** cocoa, soft citrus, mild sweetness
- **Acidity Character:** malic-soft
- **Body Character:** medium

#### Why This Macro Stands Out
Lower elevation and tropical climate reduce acidity and increase body vs East African benchmarks

---

### Chiapas Highlands

**Country:** Mexico  **Admin Regions it overlaps:** Chiapas
**Typical Meso Terroirs (reference only; not canonical):** Soconusco, Sierra Madre de Chiapas

#### Context
Large southern mountain system influenced by Pacific moisture and high production volume

#### Environmental System
- **Elevation Band:** 1000-1700 m
- **Climate Regime:** warm-temperate, humid, high rainfall
- **Soil Base:** mixed volcanic and loam soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Bourbon, Typica, Caturra
- **Typical Processing:** washed
- **Cup Profile (structural):** chocolate, soft citrus, mild sweetness
- **Acidity Character:** malic-soft
- **Body Character:** medium

#### Why This Macro Stands Out
High humidity and scale reduce clarity compared to Central American volcanic systems

---

### Gulf Highlands

**Country:** Mexico  **Admin Regions it overlaps:** Veracruz / Puebla
**Typical Meso Terroirs (reference only; not canonical):** Coatepec, Huatusco

#### Context
Gulf-facing system with strong humidity and cloud forest influence

#### Environmental System
- **Elevation Band:** 900-1500 m
- **Climate Regime:** humid, frequent rainfall, cloud cover
- **Soil Base:** volcanic soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Caturra, Typica
- **Typical Processing:** washed
- **Cup Profile (structural):** muted fruit, cocoa, soft acidity
- **Acidity Character:** malic-soft
- **Body Character:** medium

#### Why This Macro Stands Out
Humidity suppresses clarity and creates softer, rounder cups

---

### Oaxaca Southern Highlands

**Country:** Mexico  **Admin Regions it overlaps:** Oaxaca
**Typical Meso Terroirs (reference only; not canonical):** Pluma Hidalgo, Sierra Sur

#### Context
Southern highland system with moderate elevation and more isolated production

#### Environmental System
- **Elevation Band:** 1200-1800 m
- **Climate Regime:** temperate, moderate rainfall
- **Soil Base:** mixed mountain soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Typica, Pluma Hidalgo
- **Typical Processing:** washed, natural
- **Cup Profile (structural):** floral, citrus, lighter structure
- **Acidity Character:** malic-citric
- **Body Character:** medium-light

#### Why This Macro Stands Out
Better elevation and isolation allow more expressive cups than Chiapas

---

### Western Sierra Madre

**Country:** Mexico  **Admin Regions it overlaps:** Jalisco / Nayarit
**Typical Meso Terroirs (reference only; not canonical):** Talpa, San Sebastián

#### Context
Western mountain system with drier climate and smaller production scale

#### Environmental System
- **Elevation Band:** 1200-1800 m
- **Climate Regime:** warm-temperate, seasonal rainfall
- **Soil Base:** mixed soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Bourbon, Typica
- **Typical Processing:** washed
- **Cup Profile (structural):** citrus, mild fruit, balanced sweetness
- **Acidity Character:** malic-citric
- **Body Character:** medium

#### Why This Macro Stands Out
Drier conditions improve clarity compared to Gulf-facing systems

---

### Chin Highlands

**Country:** Myanmar  **Admin Regions it overlaps:** Chin State
**Typical Meso Terroirs (reference only; not canonical):** Falam, Hakha

#### Context
Remote highland system with high elevation but minimal infrastructure

#### Environmental System
- **Elevation Band:** 1300-1800 m
- **Climate Regime:** cooler, moderate rainfall
- **Soil Base:** mountain soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Catimor
- **Typical Processing:** washed
- **Cup Profile (structural):** muted fruit, herbal, uneven structure
- **Acidity Character:** malic-low
- **Body Character:** medium

#### Why This Macro Stands Out
Elevation potential is high but lack of processing control suppresses clarity

---

### Pyin Oo Lwin Plateau

**Country:** Myanmar  **Admin Regions it overlaps:** Mandalay Region
**Typical Meso Terroirs (reference only; not canonical):** Pyin Oo Lwin

#### Context
Historic coffee region with moderate elevation and mixed production quality

#### Environmental System
- **Elevation Band:** 1000-1400 m
- **Climate Regime:** warm-temperate, seasonal rainfall
- **Soil Base:** mixed soils
- **Farming Model:** smallholder + estate

#### What Comes Out of This System
- **Dominant Varieties:** Catimor
- **Typical Processing:** washed, natural
- **Cup Profile (structural):** mild fruit, cocoa, softer structure
- **Acidity Character:** malic-soft
- **Body Character:** medium

#### Why This Macro Stands Out
Older production base with variable quality limits clarity ceiling

---

### Southern Shan Highlands

**Country:** Myanmar  **Admin Regions it overlaps:** Shan State
**Typical Meso Terroirs (reference only; not canonical):** Ywangan, Pindaya

#### Context
Primary coffee-growing plateau with strong recent specialty development

#### Environmental System
- **Elevation Band:** 1100-1500 m
- **Climate Regime:** temperate, seasonal rainfall, moderate humidity
- **Soil Base:** red loam
- **Farming Model:** smallholder cooperative

#### What Comes Out of This System
- **Dominant Varieties:** Catimor, Catuai
- **Typical Processing:** washed, natural
- **Cup Profile (structural):** citrus, soft fruit, balanced sweetness
- **Acidity Character:** malic-citric
- **Body Character:** medium

#### Why This Macro Stands Out
Improving processing and elevation produce clean, approachable profiles

---

### Central Eastern Mid-Hills

**Country:** Nepal  **Admin Regions it overlaps:** Bagmati / Province 1
**Typical Meso Terroirs (reference only; not canonical):** Nuwakot, Ilam

#### Context
Mid-hill extension with slightly higher humidity and variability

#### Environmental System
- **Elevation Band:** 900-1600 m
- **Climate Regime:** warm-temperate, moderate humidity
- **Soil Base:** mixed soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Caturra, Bourbon
- **Typical Processing:** washed, natural
- **Cup Profile (structural):** mild fruit, herbal, softer structure
- **Acidity Character:** malic-soft
- **Body Character:** medium

#### Why This Macro Stands Out
Higher humidity and variability reduce clarity vs western Nepal

---

### Western Mid-Hills

**Country:** Nepal  **Admin Regions it overlaps:** Gandaki / Lumbini
**Typical Meso Terroirs (reference only; not canonical):** Gulmi, Palpa, Syangja

#### Context
Mid-hill system with moderate elevation and emerging specialty development

#### Environmental System
- **Elevation Band:** 900-1600 m
- **Climate Regime:** temperate, seasonal rainfall
- **Soil Base:** mountain loam
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Caturra, Bourbon
- **Typical Processing:** washed
- **Cup Profile (structural):** citrus, mild florals, soft sweetness
- **Acidity Character:** malic-citric soft
- **Body Character:** medium-light

#### Why This Macro Stands Out
Elevation provides clarity potential but scale and infrastructure limit consistency

---

### Northern Highlands

**Country:** Nicaragua  **Admin Regions it overlaps:** Nueva Segovia / Jinotega / Matagalpa
**Typical Meso Terroirs (reference only; not canonical):** Jinotega, Matagalpa, Nueva Segovia

#### Context
Core Nicaraguan mountain system with strong specialty development and infrastructure

#### Environmental System
- **Elevation Band:** 1100-1700 m
- **Climate Regime:** temperate, seasonal rainfall
- **Soil Base:** mixed volcanic and loam soils
- **Farming Model:** smallholder + estate

#### What Comes Out of This System
- **Dominant Varieties:** Catuai, Bourbon, Pacas
- **Typical Processing:** washed
- **Cup Profile (structural):** citrus, caramel, balanced sweetness
- **Acidity Character:** citric-malic
- **Body Character:** medium silky

#### Why This Macro Stands Out
Consistent elevation and processing create reliable, balanced Central American profiles

---

### Santa Clara Highlands

**Country:** Panama  **Admin Regions it overlaps:** Chiriquí
**Typical Meso Terroirs (reference only; not canonical):** Santa Clara, Renacimiento, Río Sereno

#### Context
Isolated lower-elevation system with warmer baseline climate

#### Environmental System
- **Elevation Band:** 1200-1700 m
- **Climate Regime:** warm-temperate, moderate rainfall
- **Soil Base:** volcanic soils
- **Farming Model:** estate

#### What Comes Out of This System
- **Dominant Varieties:** Caturra, Catuai
- **Typical Processing:** washed
- **Cup Profile (structural):** mild fruit, softer structure
- **Acidity Character:** malic-soft
- **Body Character:** medium

#### Why This Macro Stands Out
Lower elevation reduces clarity and floral intensity compared to Barú systems

---

### Volcán Barú Highlands

**Country:** Panama  **Admin Regions it overlaps:** Chiriquí
**Typical Meso Terroirs (reference only; not canonical):** Boquete (Jaramillo, Alto Quiel, Palmira), Cerro Punta, Volcán, Guadalupe

#### Context
High-elevation volcanic system centered around Volcán Barú with strong microclimate variation

#### Environmental System
- **Elevation Band:** 1500-2200 m
- **Climate Regime:** cool, frequent cloud cover, strong diurnal shifts
- **Soil Base:** volcanic ash soils
- **Farming Model:** estate

#### What Comes Out of This System
- **Dominant Varieties:** Gesha, Caturra, Catuai
- **Typical Processing:** washed, natural
- **Cup Profile (structural):** intense florals, citrus, high clarity
- **Acidity Character:** citric-linear to complex
- **Body Character:** light silky

#### Why This Macro Stands Out
One of the highest clarity systems globally due to elevation, microclimate, and cultivar selection

---

### PNG Central Highlands

**Country:** Papua New Guinea  **Admin Regions it overlaps:** Eastern Highlands / Western Highlands
**Typical Meso Terroirs (reference only; not canonical):** Goroka, Kainantu, Mt. Hagen

#### Context
High-elevation inland system with strong potential but variable processing quality

#### Environmental System
- **Elevation Band:** 1400-2000 m
- **Climate Regime:** cool-temperate, high rainfall, frequent cloud cover
- **Soil Base:** mountain loam
- **Farming Model:** smallholder + cooperative

#### What Comes Out of This System
- **Dominant Varieties:** Typica, Bourbon, Arusha
- **Typical Processing:** washed
- **Cup Profile (structural):** citrus, tropical fruit, soft florals
- **Acidity Character:** malic-citric
- **Body Character:** medium-light

#### Why This Macro Stands Out
High elevation supports clarity but inconsistent processing limits repeatability

---

### PNG Fringe Highlands

**Country:** Papua New Guinea  **Admin Regions it overlaps:** Jiwaka / Morobe
**Typical Meso Terroirs (reference only; not canonical):** Jiwaka, Morobe uplands

#### Context
Lower-density highland system with more variability and less infrastructure

#### Environmental System
- **Elevation Band:** 1200-1800 m
- **Climate Regime:** temperate, moderate rainfall
- **Soil Base:** mixed soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Typica, Bourbon
- **Typical Processing:** washed
- **Cup Profile (structural):** mild fruit, cocoa, softer structure
- **Acidity Character:** malic-soft
- **Body Character:** medium

#### Why This Macro Stands Out
Reduced infrastructure and variation suppress clarity relative to central highlands

---

### Amazonian Fringe

**Country:** Peru  **Admin Regions it overlaps:** San Martín / Huánuco
**Typical Meso Terroirs (reference only; not canonical):** Moyobamba, Rioja, Tingo María, Tocache

#### Context
Lower elevation transition zone between Andes and Amazon basin

#### Environmental System
- **Elevation Band:** 800-1400 m
- **Climate Regime:** warm, humid, high rainfall
- **Soil Base:** alluvial and loamy soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Caturra, Typica
- **Typical Processing:** washed
- **Cup Profile (structural):** muted fruit, cocoa, soft sweetness
- **Acidity Character:** malic-low
- **Body Character:** medium

#### Why This Macro Stands Out
Lower elevation and humidity reduce clarity and increase body

---

### Central Andean Highlands

**Country:** Peru  **Admin Regions it overlaps:** Junín / Pasco
**Typical Meso Terroirs (reference only; not canonical):** Satipo, Chanchamayo, Villa Rica, Oxapampa

#### Context
Transitional Andean system with moderate elevation and infrastructure variability

#### Environmental System
- **Elevation Band:** 1100-1800 m
- **Climate Regime:** temperate, seasonal rainfall
- **Soil Base:** mixed soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Caturra, Typica
- **Typical Processing:** washed
- **Cup Profile (structural):** mild fruit, balanced sweetness
- **Acidity Character:** malic-soft
- **Body Character:** medium

#### Why This Macro Stands Out
Moderate elevation and variability produce balanced but less expressive cups

---

### Northern Andean Highlands

**Country:** Peru  **Admin Regions it overlaps:** Cajamarca / Amazonas
**Typical Meso Terroirs (reference only; not canonical):** Jaén, San Ignacio, Bagua, Utcubamba

#### Context
Large northern mountain system with diverse microclimates and expanding specialty production

#### Environmental System
- **Elevation Band:** 1200-1900 m
- **Climate Regime:** temperate, moderate rainfall
- **Soil Base:** mixed volcanic and loam soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Caturra, Bourbon, Typica
- **Typical Processing:** washed
- **Cup Profile (structural):** citrus, cocoa, mild florals
- **Acidity Character:** malic-citric
- **Body Character:** medium

#### Why This Macro Stands Out
Strong elevation but variable processing leads to moderate clarity ceiling

---

### Southern Andean Highlands

**Country:** Peru  **Admin Regions it overlaps:** Cusco / Puno
**Typical Meso Terroirs (reference only; not canonical):** La Convención, Quillabamba, Sandia

#### Context
Higher elevation southern Andes with cooler climate and slower maturation

#### Environmental System
- **Elevation Band:** 1400-2100 m
- **Climate Regime:** cooler, moderate rainfall
- **Soil Base:** mixed mountain soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Caturra, Bourbon, Typica
- **Typical Processing:** washed
- **Cup Profile (structural):** citrus, light florals, cleaner structure
- **Acidity Character:** malic-citric
- **Body Character:** medium-light

#### Why This Macro Stands Out
Higher elevation improves structure relative to central Peru

---

### Cordillera Highlands

**Country:** Philippines  **Admin Regions it overlaps:** Benguet / Ifugao
**Typical Meso Terroirs (reference only; not canonical):** Sagada, Atok, Banaue

#### Context
Primary high-elevation mountain system with cooler climate and improving specialty focus

#### Environmental System
- **Elevation Band:** 1200-1800 m
- **Climate Regime:** cooler, moderate rainfall, cloud cover
- **Soil Base:** mountain loam
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Typica, Bourbon, Catimor
- **Typical Processing:** washed, natural
- **Cup Profile (structural):** citrus, mild florals, light sweetness
- **Acidity Character:** malic-citric
- **Body Character:** medium-light

#### Why This Macro Stands Out
Best clarity potential in the Philippines due to elevation and cooler climate

---

### Mindanao Highlands

**Country:** Philippines  **Admin Regions it overlaps:** Bukidnon / Davao
**Typical Meso Terroirs (reference only; not canonical):** Bukidnon, Mt. Apo slopes

#### Context
Volcanic highland system with moderate elevation and larger farm structures

#### Environmental System
- **Elevation Band:** 1000-1600 m
- **Climate Regime:** warm-temperate, moderate rainfall
- **Soil Base:** volcanic soils
- **Farming Model:** estate + cooperative

#### What Comes Out of This System
- **Dominant Varieties:** Catimor, Catuai
- **Typical Processing:** washed, natural
- **Cup Profile (structural):** cocoa, soft fruit, balanced sweetness
- **Acidity Character:** malic-soft
- **Body Character:** medium

#### Why This Macro Stands Out
More structured and consistent than other Philippine systems due to farm scale

---

### Southern Luzon Belt

**Country:** Philippines  **Admin Regions it overlaps:** Batangas / Cavite
**Typical Meso Terroirs (reference only; not canonical):** Lipa, Tagaytay

#### Context
Lower elevation volcanic system with warmer climate and historic production

#### Environmental System
- **Elevation Band:** 800-1200 m
- **Climate Regime:** warm, moderate rainfall
- **Soil Base:** volcanic soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Typica, Robusta blends
- **Typical Processing:** washed, natural
- **Cup Profile (structural):** muted fruit, heavier sweetness
- **Acidity Character:** malic-low
- **Body Character:** medium

#### Why This Macro Stands Out
Lower elevation and warmer climate reduce acidity and increase body

---

### Central Plateau Highlands

**Country:** Rwanda  **Admin Regions it overlaps:** Southern Province
**Typical Meso Terroirs (reference only; not canonical):** Huye, Nyanza

#### Context
Interior plateau system with slightly lower elevation and reduced lake influence

#### Environmental System
- **Elevation Band:** 1400-1900 m
- **Climate Regime:** temperate, moderate humidity
- **Soil Base:** red clay loam
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Bourbon
- **Typical Processing:** washed
- **Cup Profile (structural):** citrus, soft fruit, balanced structure
- **Acidity Character:** malic-citric
- **Body Character:** medium

#### Why This Macro Stands Out
More structured and slightly heavier than Kivu due to reduced humidity

---

### Eastern Low Highlands

**Country:** Rwanda  **Admin Regions it overlaps:** Eastern Province
**Typical Meso Terroirs (reference only; not canonical):** Ngoma, Kayonza

#### Context
Lower elevation eastern system with warmer climate and less specialty focus

#### Environmental System
- **Elevation Band:** 1200-1600 m
- **Climate Regime:** warm-temperate, lower rainfall
- **Soil Base:** mixed soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Bourbon
- **Typical Processing:** washed
- **Cup Profile (structural):** mild fruit, cocoa, softer sweetness
- **Acidity Character:** malic-low
- **Body Character:** medium

#### Why This Macro Stands Out
Lower elevation reduces acidity and clarity compared to western regions

---

### Lake Kivu Highlands

**Country:** Rwanda  **Admin Regions it overlaps:** Western Province
**Typical Meso Terroirs (reference only; not canonical):** Nyamasheke, Rutsiro, Karongi

#### Context
High-elevation volcanic system along Lake Kivu with strong washing station infrastructure

#### Environmental System
- **Elevation Band:** 1500-2000 m
- **Climate Regime:** cool-temperate, high humidity, consistent rainfall
- **Soil Base:** volcanic soils
- **Farming Model:** smallholder, washing station-based

#### What Comes Out of This System
- **Dominant Varieties:** Bourbon
- **Typical Processing:** washed
- **Cup Profile (structural):** citrus, red fruit, refined sweetness
- **Acidity Character:** citric-malic, rounded
- **Body Character:** medium-light

#### Why This Macro Stands Out
Lake influence softens acidity slightly while maintaining clarity and balance

---

### Alishan Belt

**Country:** Taiwan  **Admin Regions it overlaps:** Chiayi
**Typical Meso Terroirs (reference only; not canonical):** Alishan, Meishan

#### Context
High-elevation mountain system with strong parallels to specialty tea production

#### Environmental System
- **Elevation Band:** 1000-1600 m
- **Climate Regime:** cool, humid, frequent mist and cloud cover
- **Soil Base:** acidic mountain soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Catimor, Typica derivatives
- **Typical Processing:** washed, honey
- **Cup Profile (structural):** floral, tea-like, refined sweetness
- **Acidity Character:** citric-soft to malic
- **Body Character:** light silky

#### Why This Macro Stands Out
Slow maturation and tea-like growing conditions produce delicate, high-aroma profiles

---

### Central Foothills

**Country:** Taiwan  **Admin Regions it overlaps:** Nantou
**Typical Meso Terroirs (reference only; not canonical):** Puli, Guoxing

#### Context
Transitional foothill system between high mountains and lowlands

#### Environmental System
- **Elevation Band:** 800-1300 m
- **Climate Regime:** warm-temperate, moderate humidity
- **Soil Base:** mixed soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Catimor
- **Typical Processing:** washed, honey
- **Cup Profile (structural):** balanced sweetness, mild fruit
- **Acidity Character:** malic-soft
- **Body Character:** medium

#### Why This Macro Stands Out
Intermediate structure between Alishan clarity and lowland softness

---

### Southern Eastern Belt

**Country:** Taiwan  **Admin Regions it overlaps:** Taitung / Pingtung
**Typical Meso Terroirs (reference only; not canonical):** Taimali, Pingtung uplands

#### Context
Warm southern system with lower elevation and stronger tropical influence

#### Environmental System
- **Elevation Band:** 500-1000 m
- **Climate Regime:** warm, humid, high rainfall
- **Soil Base:** mixed soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Catimor
- **Typical Processing:** natural, washed
- **Cup Profile (structural):** muted fruit, heavier sweetness
- **Acidity Character:** malic-low
- **Body Character:** medium-heavy

#### Why This Macro Stands Out
Heat and humidity suppress acidity and increase body

---

### Yunlin Uplands

**Country:** Taiwan  **Admin Regions it overlaps:** Yunlin
**Typical Meso Terroirs (reference only; not canonical):** Gukeng, Caoling

#### Context
Lower elevation central upland system with warmer climate and more variability

#### Environmental System
- **Elevation Band:** 600-1200 m
- **Climate Regime:** warm, humid, seasonal rainfall
- **Soil Base:** mixed soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Catimor
- **Typical Processing:** washed
- **Cup Profile (structural):** mild fruit, cocoa, soft sweetness
- **Acidity Character:** malic-soft
- **Body Character:** medium

#### Why This Macro Stands Out
Lower elevation and humidity reduce clarity compared to Alishan

---

### Kilimanjaro Highlands

**Country:** Tanzania  **Admin Regions it overlaps:** Kilimanjaro
**Typical Meso Terroirs (reference only; not canonical):** Moshi, Rombo, Machame

#### Context
Volcanic slopes of Mount Kilimanjaro with strong elevation and structured farming

#### Environmental System
- **Elevation Band:** 1400-2000 m
- **Climate Regime:** cooler, stable rainfall
- **Soil Base:** volcanic soils
- **Farming Model:** smallholder cooperative

#### What Comes Out of This System
- **Dominant Varieties:** Bourbon, Kent
- **Typical Processing:** washed
- **Cup Profile (structural):** citrus, floral hints, clean sweetness
- **Acidity Character:** citric-malic
- **Body Character:** medium-light

#### Why This Macro Stands Out
One of Tanzania’s cleanest and most structured systems due to elevation and organization

---

### Lake Victoria Highlands

**Country:** Tanzania  **Admin Regions it overlaps:** Kagera
**Typical Meso Terroirs (reference only; not canonical):** Bukoba, Muleba

#### Context
Lake-influenced system with lower elevation and higher humidity

#### Environmental System
- **Elevation Band:** 1100-1500 m
- **Climate Regime:** warm, humid, high rainfall
- **Soil Base:** mixed soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Bourbon + Robusta influence
- **Typical Processing:** washed
- **Cup Profile (structural):** muted fruit, heavier sweetness
- **Acidity Character:** malic-low
- **Body Character:** medium-heavy

#### Why This Macro Stands Out
Humidity and lower elevation reduce clarity and increase body

---

### Northern Rift Highlands

**Country:** Tanzania  **Admin Regions it overlaps:** Arusha / Manyara
**Typical Meso Terroirs (reference only; not canonical):** Karatu, Ngorongoro

#### Context
Highland system along the Rift Valley with moderate elevation and mixed production

#### Environmental System
- **Elevation Band:** 1400-1800 m
- **Climate Regime:** temperate, moderate rainfall
- **Soil Base:** volcanic soils
- **Farming Model:** smallholder + estate

#### What Comes Out of This System
- **Dominant Varieties:** Bourbon, Kent
- **Typical Processing:** washed
- **Cup Profile (structural):** citrus, mild fruit, balanced sweetness
- **Acidity Character:** malic-citric
- **Body Character:** medium

#### Why This Macro Stands Out
Sits between Kenya precision and softer Tanzanian systems

---

### Southern Highlands

**Country:** Tanzania  **Admin Regions it overlaps:** Mbeya / Ruvuma
**Typical Meso Terroirs (reference only; not canonical):** Mbeya, Mbinga, Rungwe

#### Context
Large southern plateau with strong specialty presence and moderate elevation

#### Environmental System
- **Elevation Band:** 1200-1700 m
- **Climate Regime:** temperate, seasonal rainfall
- **Soil Base:** mixed volcanic soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Catimor, Bourbon
- **Typical Processing:** washed, natural
- **Cup Profile (structural):** cocoa, soft fruit, round sweetness
- **Acidity Character:** malic-soft
- **Body Character:** medium

#### Why This Macro Stands Out
More consistent than other Tanzanian systems but lower clarity ceiling than Kilimanjaro

---

### Northern Thai Highlands

**Country:** Thailand  **Admin Regions it overlaps:** Chiang Rai / Chiang Mai
**Typical Meso Terroirs (reference only; not canonical):** Chiang Rai, Doi Chang, Doi Tung

#### Context
Mountain system with cooler temperatures and improving specialty infrastructure

#### Environmental System
- **Elevation Band:** 1100-1700 m
- **Climate Regime:** temperate, seasonal rainfall, moderate humidity
- **Soil Base:** red loam
- **Farming Model:** smallholder + cooperative

#### What Comes Out of This System
- **Dominant Varieties:** Catimor, Catuai
- **Typical Processing:** washed, natural
- **Cup Profile (structural):** citrus, soft fruit, balanced sweetness
- **Acidity Character:** malic-citric
- **Body Character:** medium-light

#### Why This Macro Stands Out
Best Thai arabica system with moderate clarity potential due to elevation and improved processing

---

### Southern Peninsula Robusta

**Country:** Thailand  **Admin Regions it overlaps:** Chumphon / Surat Thani
**Typical Meso Terroirs (reference only; not canonical):** Chumphon, Surat Thani

#### Context
Tropical lowland system dominated by robusta production

#### Environmental System
- **Elevation Band:** 0-800 m
- **Climate Regime:** hot, humid, heavy rainfall
- **Soil Base:** lateritic soils
- **Farming Model:** estate + smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Robusta
- **Typical Processing:** natural
- **Cup Profile (structural):** dense, earthy, chocolate
- **Acidity Character:** muted
- **Body Character:** heavy

#### Why This Macro Stands Out
Low elevation and robusta genetics produce high body and minimal acidity

---

### South Central Highlands

**Country:** Timor-Leste  **Admin Regions it overlaps:** Manufahi
**Typical Meso Terroirs (reference only; not canonical):** Same, Manufahi uplands

#### Context
Secondary highland zone with slightly warmer climate and less density

#### Environmental System
- **Elevation Band:** 900-1500 m
- **Climate Regime:** warm, moderate rainfall
- **Soil Base:** mixed soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Híbrido de Timor
- **Typical Processing:** washed, natural
- **Cup Profile (structural):** muted fruit, heavier sweetness
- **Acidity Character:** malic-low
- **Body Character:** medium

#### Why This Macro Stands Out
Lower elevation and warmer climate reduce clarity compared to western highlands

---

### Western Central Highlands

**Country:** Timor-Leste  **Admin Regions it overlaps:** Ermera / Aileu / Ainaro
**Typical Meso Terroirs (reference only; not canonical):** Ermera, Letefoho

#### Context
Core production zone with moderate elevation and strong smallholder networks

#### Environmental System
- **Elevation Band:** 1000-1600 m
- **Climate Regime:** warm-temperate, seasonal rainfall
- **Soil Base:** mixed volcanic and limestone soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Híbrido de Timor, Catimor
- **Typical Processing:** washed, natural
- **Cup Profile (structural):** cocoa, mild fruit, balanced sweetness
- **Acidity Character:** malic-soft
- **Body Character:** medium

#### Why This Macro Stands Out
Consistent structure but limited acidity ceiling due to hybrid genetics

---

### Mount Elgon Highlands

**Country:** Uganda  **Admin Regions it overlaps:** Eastern Region
**Typical Meso Terroirs (reference only; not canonical):** Bugisu, Sironko, Kapchorwa

#### Context
Volcanic highland system on Mount Elgon with strong arabica production and cooperative structure

#### Environmental System
- **Elevation Band:** 1500-2100 m
- **Climate Regime:** cool-temperate, moderate rainfall
- **Soil Base:** volcanic soils
- **Farming Model:** smallholder cooperative

#### What Comes Out of This System
- **Dominant Varieties:** Bourbon, SL-derived, local selections
- **Typical Processing:** washed
- **Cup Profile (structural):** citrus, soft florals, balanced sweetness
- **Acidity Character:** citric-malic
- **Body Character:** medium-light

#### Why This Macro Stands Out
One of Uganda’s highest clarity systems due to elevation and volcanic soils

---

### Rwenzori Highlands

**Country:** Uganda  **Admin Regions it overlaps:** Western Region
**Typical Meso Terroirs (reference only; not canonical):** Kasese, Bundibugyo

#### Context
Mountain system along Rwenzori range with more humidity and less infrastructure

#### Environmental System
- **Elevation Band:** 1400-2000 m
- **Climate Regime:** humid, high rainfall
- **Soil Base:** mixed mountain soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Bourbon
- **Typical Processing:** washed
- **Cup Profile (structural):** mild fruit, cocoa, softer clarity
- **Acidity Character:** malic-soft
- **Body Character:** medium

#### Why This Macro Stands Out
Higher humidity reduces clarity and increases body compared to Elgon

---

### Southwestern Highlands

**Country:** Uganda  **Admin Regions it overlaps:** Southwestern Region
**Typical Meso Terroirs (reference only; not canonical):** Kisoro, Kabale

#### Context
Volcanic highland system near Rwanda border with strong elevation potential

#### Environmental System
- **Elevation Band:** 1500-2000 m
- **Climate Regime:** cool-temperate, moderate rainfall
- **Soil Base:** volcanic soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Bourbon
- **Typical Processing:** washed
- **Cup Profile (structural):** citrus, soft florals, clean sweetness
- **Acidity Character:** citric-malic
- **Body Character:** medium-light

#### Why This Macro Stands Out
Closest Ugandan system to Rwanda/Kivu-style clarity due to elevation and soil

---

### West Nile Highlands

**Country:** Uganda  **Admin Regions it overlaps:** Northwestern Region
**Typical Meso Terroirs (reference only; not canonical):** Zombo, Nebbi

#### Context
Remote highland system with moderate elevation and emerging specialty focus

#### Environmental System
- **Elevation Band:** 1400-1800 m
- **Climate Regime:** temperate, moderate rainfall
- **Soil Base:** red clay loam
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Bourbon
- **Typical Processing:** washed
- **Cup Profile (structural):** citrus, mild fruit, balanced sweetness
- **Acidity Character:** malic-citric
- **Body Character:** medium

#### Why This Macro Stands Out
Improving infrastructure produces cleaner cups than other secondary systems

---

### Hawaiian Volcanic Highlands

**Country:** United States  **Admin Regions it overlaps:** Hawaii
**Typical Meso Terroirs (reference only; not canonical):** Kona, Ka‘u, Maui uplands

#### Context
Volcanic island system with stable climate and strong farm-level control

#### Environmental System
- **Elevation Band:** 600-1200 m
- **Climate Regime:** warm-temperate, consistent rainfall, cloud cover
- **Soil Base:** volcanic soils
- **Farming Model:** estate

#### What Comes Out of This System
- **Dominant Varieties:** Catuai, Typica, Bourbon
- **Typical Processing:** washed
- **Cup Profile (structural):** citrus, nutty sweetness, clean structure
- **Acidity Character:** malic-citric soft
- **Body Character:** medium

#### Why This Macro Stands Out
Highly controlled environment produces clean, consistent cups despite moderate elevation

---

### Southern California Highlands

**Country:** United States  **Admin Regions it overlaps:** California
**Typical Meso Terroirs (reference only; not canonical):** Santa Barbara, Ventura foothills

#### Context
Emerging subtropical system with limited suitable zones and experimental production

#### Environmental System
- **Elevation Band:** 300-900 m
- **Climate Regime:** warm, dry, Mediterranean climate
- **Soil Base:** mixed soils
- **Farming Model:** smallholder experimental

#### What Comes Out of This System
- **Dominant Varieties:** Catuai, Typica, SL varieties
- **Typical Processing:** washed, natural
- **Cup Profile (structural):** mild fruit, soft sweetness, low complexity
- **Acidity Character:** malic-low
- **Body Character:** medium

#### Why This Macro Stands Out
Non-traditional climate limits acidity and density, resulting in lower clarity ceiling

---

### Central Highlands Plateau

**Country:** Vietnam  **Admin Regions it overlaps:** Đắk Lắk / Lâm Đồng
**Typical Meso Terroirs (reference only; not canonical):** Buôn Ma Thuột, Đà Lạt

#### Context
Large plateau system dominating global robusta production with some arabica zones at elevation

#### Environmental System
- **Elevation Band:** 500-1500 m
- **Climate Regime:** warm, seasonal rainfall
- **Soil Base:** red basalt soils
- **Farming Model:** estate + cooperative

#### What Comes Out of This System
- **Dominant Varieties:** Robusta, Catimor
- **Typical Processing:** natural, washed
- **Cup Profile (structural):** dense chocolate, low complexity
- **Acidity Character:** muted
- **Body Character:** heavy

#### Why This Macro Stands Out
Scale, climate, and varietals drive body-focused profiles with minimal acidity

---

### North Central Highlands

**Country:** Vietnam  **Admin Regions it overlaps:** Quảng Trị
**Typical Meso Terroirs (reference only; not canonical):** Khe Sanh

#### Context
Transitional highland system with moderate elevation and variable climate

#### Environmental System
- **Elevation Band:** 800-1400 m
- **Climate Regime:** warm-temperate, seasonal rainfall
- **Soil Base:** mixed soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Catimor
- **Typical Processing:** washed, natural
- **Cup Profile (structural):** mild fruit, cocoa, balanced sweetness
- **Acidity Character:** malic-soft
- **Body Character:** medium

#### Why This Macro Stands Out
Sits between plateau density and northern clarity with moderate structure

---

### Northwest Highlands

**Country:** Vietnam  **Admin Regions it overlaps:** Sơn La / Điện Biên
**Typical Meso Terroirs (reference only; not canonical):** Sơn La, Điện Biên

#### Context
Higher elevation northern system with cooler climate and increasing arabica production

#### Environmental System
- **Elevation Band:** 1000-1600 m
- **Climate Regime:** temperate, moderate rainfall
- **Soil Base:** mountain soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Catimor
- **Typical Processing:** washed
- **Cup Profile (structural):** citrus, mild fruit, cleaner profile
- **Acidity Character:** malic-citric
- **Body Character:** medium-light

#### Why This Macro Stands Out
Elevation improves structure relative to Central Highlands but still limited by varietals

---

### Central Highlands

**Country:** Yemen  **Admin Regions it overlaps:** Ibb / Hajjah
**Typical Meso Terroirs (reference only; not canonical):** Ibb, Hajjah uplands

#### Context
Transitional central system with moderate elevation and mixed conditions

#### Environmental System
- **Elevation Band:** 1500-2100 m
- **Climate Regime:** temperate-dry, seasonal rainfall
- **Soil Base:** mixed mountain soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Yemeni landrace
- **Typical Processing:** natural
- **Cup Profile (structural):** balanced dried fruit, cocoa, mild spice
- **Acidity Character:** malic-soft
- **Body Character:** medium

#### Why This Macro Stands Out
Sits between Haraz intensity and southern softness with moderate structure

---

### Haraz Highlands

**Country:** Yemen  **Admin Regions it overlaps:** Sana’a / Al Mahwit
**Typical Meso Terroirs (reference only; not canonical):** Manakhah, Haraaz villages

#### Context
High-altitude terraced mountain system with extreme dryness and traditional farming

#### Environmental System
- **Elevation Band:** 1800-2400 m
- **Climate Regime:** dry, low rainfall, high diurnal shifts
- **Soil Base:** rocky, terraced mountain soils
- **Farming Model:** smallholder, terrace-grown

#### What Comes Out of This System
- **Dominant Varieties:** Yemeni landrace
- **Typical Processing:** natural
- **Cup Profile (structural):** dried fruit, spice, cocoa, wine-like complexity
- **Acidity Character:** malic-winey, low to moderate
- **Body Character:** medium to heavy

#### Why This Macro Stands Out
Extreme environment and natural processing produce highly distinctive, concentrated profiles unlike modern washed systems

---

### Sana’a Western Highlands

**Country:** Yemen  **Admin Regions it overlaps:** Sana’a / Raymah
**Typical Meso Terroirs (reference only; not canonical):** Bani Matar, Raymah uplands

#### Context
Western extension of highland system with slightly more rainfall and variability

#### Environmental System
- **Elevation Band:** 1600-2200 m
- **Climate Regime:** dry-temperate, slightly higher rainfall than Haraz
- **Soil Base:** rocky mountain soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Yemeni landrace
- **Typical Processing:** natural
- **Cup Profile (structural):** muted fruit, spice, heavier sweetness
- **Acidity Character:** malic-low
- **Body Character:** medium

#### Why This Macro Stands Out
Higher variability and slightly lower elevation reduce clarity compared to Haraz

---

### Yafa Highlands

**Country:** Yemen  **Admin Regions it overlaps:** Abyan / Lahij
**Typical Meso Terroirs (reference only; not canonical):** Yafa, southern uplands

#### Context
Southern highland system with warmer climate and less dense production

#### Environmental System
- **Elevation Band:** 1400-2000 m
- **Climate Regime:** warm-dry, moderate rainfall
- **Soil Base:** mixed soils
- **Farming Model:** smallholder

#### What Comes Out of This System
- **Dominant Varieties:** Yemeni landrace
- **Typical Processing:** natural
- **Cup Profile (structural):** chocolate, spice, soft fruit
- **Acidity Character:** malic-low
- **Body Character:** medium-heavy

#### Why This Macro Stands Out
Warmer climate increases body and reduces acidity compared to northern systems

---

### Zambian Northern Highlands

**Country:** Zambia  **Admin Regions it overlaps:** Northern Province / Muchinga
**Typical Meso Terroirs (reference only; not canonical):** Kasama, Mbala, Isoka, Nakonde

#### Context
Highland plateau system near Tanzania border with limited but structured production

#### Environmental System
- **Elevation Band:** 1200-1600 m
- **Climate Regime:** temperate, seasonal rainfall
- **Soil Base:** red loam
- **Farming Model:** smallholder + estate

#### What Comes Out of This System
- **Dominant Varieties:** Catimor, Bourbon
- **Typical Processing:** washed
- **Cup Profile (structural):** cocoa, soft citrus, mild sweetness
- **Acidity Character:** malic-soft
- **Body Character:** medium

#### Why This Macro Stands Out
Simple, balanced profiles with moderate structure but lower clarity ceiling than East African benchmarks

---

## Sources

Per-claim citations at authoring time; rollup below.

- **Chris's ChatGPT context doc** (`context for chatgpt on coffee info, terroir, cultivar, best brew`, pre-2026-04-22). Ruleset framework (5-level hierarchy: Country -> Admin -> Macro -> Meso -> Micro; Macro Validation Check; Macro Registry Rule; red-flag rules for drift). Source for the per-macro attribute template adopted in this doc (Context / Elevation Band / Climate / Soil / Farming Model / Dominant Varieties / Typical Processing / Cup Profile / Acidity Character / Body Character / Why It Stands Out).
- **Sweet Maria's origin pages** (sweetmarias.com/origin). Primary source for country overview + macro-level admin groupings, particularly for Colombia / Guatemala / Honduras / Ethiopia / Kenya.
- **Specialty Coffee Association origin references** (sca.coffee). Secondary source for regional-system naming conventions.
- **World Coffee Research** (worldcoffeeresearch.org). Referenced for cultivar-to-terroir behavior crosswalks.
- **SCA / CQI origin reference materials** and **producer-published farm documentation** (Hacienda La Esmeralda / Gesha Village Coffee Estate / Finca El Paraiso / CGLE / others) for per-macro cultivar + processing evidence.
- **Chris's 55-brew corpus** (latent-coffee DB, 2026-04-22 snapshot). Source for `Observed Across My Corpus` subsections (added in sprint 1d.2+).

---

## Changelog

- **2026-04-22 (sprint 1d.1):** Initial adoption. 121 canonical macros across 38 countries (127 country-scoped entries) ported from Chris's research CSV (126 rows) plus one hand-authored extension (Bench Sheko Highlands, Ethiopia South West). 11 DB-row renames / reclassifications applied via migration 023 to align existing terroirs table with the CSV canonical names:
  - Acatenango Volcanic Highlands (GT/Chimaltenango) -> Central Volcanic Highlands
  - Costa Rican Central Volcanic Highlands (CR/Alajuela) -> Central Volcanic Highlands (country prefix dropped; country column carries it)
  - Huehuetenango Highlands (GT/Huehuetenango) -> Western Dry Highlands
  - Marcala Highlands (HN/La Paz) -> Central Honduras Highlands
  - Sierra Sur Highlands (MX/Oaxaca) -> Oaxaca Southern Highlands
  - Southern Andean Cordillera (CO/Cauca) -> Western Andean Cordillera (Cauca moves under Western per CSV row 28; Southern Andean Cordillera retired as a Colombia macro)
  - Western Andean Cordillera (CO/Antioquia) -> Central Andean Cordillera (CSV row 31 groups Antioquia/Caldas/Quindío under Central)
  - Northern Andean Cordillera (PE/Cajamarca) -> Northern Andean Highlands (name split: "Cordillera" is Colombia-only in CSV)
  - Northern Andean Cordillera (EC/Imbabura) -> Northern Andean Highlands (same split logic)
  - Yunnan Monsoonal Highlands (CN/Yunnan) -> Yunnan Central Highlands (CSV Yunnan is 3-way split Northern/Central/Southern; defaulted to Central given the generic admin_region)
  - Lake Kivu Highlands (BU/Kayanza) -> Mumirwa Escarpment (CSV row 23 puts Burundi Kayanza/Muramvya/Mwaro under Mumirwa Escarpment; Lake Kivu Highlands in CSV is DR Congo + Rwanda only)
  Structural only - no content backfill in this migration. Meso/micro explicitly demoted from canonical registry to free-text annotation on terroir rows; column retained in DB schema. Dual-registry drift killed: `lib/brew-import.ts` `TERROIR_REGISTRY` retired, re-exported from `lib/terroir-registry.ts`. Sprint 1d.2 (content backfill to DB columns) and 1d.3 (CanonicalTextInput enforcement on /add + /brews/[id]/edit) follow.
