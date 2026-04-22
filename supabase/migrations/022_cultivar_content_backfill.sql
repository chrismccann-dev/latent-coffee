-- 022_cultivar_content_backfill
--
-- Populates the 18 attribute content columns on the 26 existing cultivar rows
-- with Chris's 2026-04-22 Variety research (CSV → docs/taxonomies/varieties.md
-- → this migration). Overwrite mode: CSV is authoritative and replaces any
-- prior content from migrations 010 / 017 (those migrations were stopgaps;
-- varieties.md is now the canonical source).
--
-- Columns updated per row (18 fields):
--   Text:   genetic_background, altitude_sensitivity, terroir_transparency,
--           acidity_style, body_style, aromatics, extraction_sensitivity,
--           roast_tolerance, roast_behavior, resting_behavior,
--           brewing_tendencies, market_context, cultivar_notes
--   Array:  typical_origins, common_processing_methods, typical_flavor_notes,
--           common_pitfalls, limiting_factors
--
-- No schema change. No row inserts / deletes. Order follows varieties.md
-- (Ethiopian Landrace → Typica → Bourbon → Crosses → Modern Hybrids).
--
-- Sprint 1a.2 of the Reference Taxonomies umbrella Variety adoption.

BEGIN;

-- =========================================================================
-- Ethiopian Landrace Families — JARC selection lineage
-- =========================================================================

UPDATE cultivars SET
  genetic_background = $c$Selected from Ethiopia's Metu Bishari selections; released 1979; Metu (Illuababora) origin. CBD resistance + high yield potential among the defining traits.$c$,
  typical_origins = ARRAY['Southwestern Ethiopia'],
  altitude_sensitivity = '2,000-2,400+ masl',
  terroir_transparency = 'High',
  common_processing_methods = ARRAY['Natural', 'Controlled natural', 'Washed', 'Experimental naturals'],
  typical_flavor_notes = ARRAY['Bright citrus', 'Tropical fruit', 'Purple fruit / grape / berry', 'Florals', 'Candy-like sweetness'],
  acidity_style = 'Bright, citric to winey',
  body_style = 'Silky to medium',
  aromatics = 'White florals + high fruit intensity',
  extraction_sensitivity = 'Moderate-high',
  roast_tolerance = 'Light to medium-light',
  roast_behavior = 'Rewards shorter, clean development (preserves florals + fruit); extended development can mute top notes.',
  resting_behavior = 'Often improves with a bit of rest; high-aromatic lots can be volatile very early.',
  brewing_tendencies = 'High-clarity pour-over and bright, fruit-forward filter; can also make expressive modern espresso when dialed for sweetness.',
  common_pitfalls = ARRAY['Underdevelopment → thin body, sharp acidity, muted sweetness', 'Over-processing / heavy fermentation swamps florals with funk'],
  market_context = 'Specialty premium; competition-adjacent.',
  limiting_factors = ARRAY['Variable seed purity at farm level', 'Site sensitivity'],
  cultivar_notes = 'Ethiopian JARC selection with high aromatic intensity. 4 brews in Chris''s corpus as of 2026-04-22.',
  updated_at = NOW()
WHERE cultivar_name = '74158';

-- =========================================================================
-- Ethiopian Landrace Families — JARC blend lineage
-- =========================================================================

UPDATE cultivars SET
  genetic_background = $c$Field or mill blend of the three JARC selections (74110, 74112, 74158); common in Sidama and Guji where plantings are mixed.$c$,
  typical_origins = ARRAY['Ethiopia (Sidama)', 'Ethiopia (Guji)'],
  altitude_sensitivity = 'Best >1800m',
  terroir_transparency = 'Very high',
  common_processing_methods = ARRAY['Washed', 'Honey'],
  typical_flavor_notes = ARRAY['Lemon', 'Peach', 'Chamomile', 'Floral'],
  acidity_style = 'High citrus',
  body_style = 'Light-silky',
  aromatics = 'Floral-citrus',
  extraction_sensitivity = 'High',
  roast_tolerance = 'Low-moderate',
  roast_behavior = 'Performs best ultra-light.',
  resting_behavior = 'Under-rested tastes grassy; cooling unlocks expression.',
  brewing_tendencies = 'Gentle percolation.',
  common_pitfalls = ARRAY['Lot variability', 'Uneven ripening'],
  market_context = 'Specialty staple.',
  limiting_factors = ARRAY['Uneven ripening across mixed plant stock'],
  cultivar_notes = 'Indigenous Ethiopian populations; mill-level blend of 3 JARC selections.',
  updated_at = NOW()
WHERE cultivar_name = '74158/74110/74112 blend';

UPDATE cultivars SET
  genetic_background = $c$Field or mill blend of 74110 and 74112 JARC selections; canonical for lots that genuinely mix both (the Heart Tagel Alemayehu archive pattern).$c$,
  typical_origins = ARRAY['Ethiopia (Sidama)', 'Ethiopia (Guji)', 'Ethiopia (Yirgacheffe)'],
  altitude_sensitivity = '>1800m',
  terroir_transparency = 'Very high',
  common_processing_methods = ARRAY['Washed', 'Natural'],
  typical_flavor_notes = ARRAY['Citrus', 'Florals', 'Stone fruit', 'Lemon', 'Peach'],
  acidity_style = 'High citric',
  body_style = 'Light',
  aromatics = 'Floral lift',
  extraction_sensitivity = 'High',
  roast_tolerance = 'Low',
  roast_behavior = 'Prefers short development; mixed stock means some variability in thermal response.',
  resting_behavior = 'Needs rest.',
  brewing_tendencies = 'High-clarity pour-over.',
  common_pitfalls = ARRAY['Thin if pushed', 'Lot variability'],
  market_context = 'Specialty staple.',
  limiting_factors = ARRAY['Uneven ripening', 'Mixed plant stock'],
  cultivar_notes = 'Promoted from the prior "74110/74112" combined canonical during the 2026-04-22 Variety sprint. Pure-lot 74110 / 74112 are now separate canonicals for future use.',
  updated_at = NOW()
WHERE cultivar_name = 'Ethiopian Landrace Blend (74110/74112)';

-- =========================================================================
-- Ethiopian Landrace Families — Gesha lineage
-- =========================================================================

UPDATE cultivars SET
  genetic_background = $c$Ethiopian forest origin (Bench Sheko / Gesha region); isolated lineage. Regional selections (Panamanian, Colombian, Brazilian) and "1931" are named adaptations of the same root lineage, not genetically distinct cultivars. Green-tip, peaberry, and "Queen" are phenotypic / sorting / branding markers, not separate genetics. All consolidate to the single Gesha canonical per migration 016.$c$,
  typical_origins = ARRAY['Panama (Boquete / Chiriquí)', 'Ethiopia (Bench Sheko)', 'Colombia highlands', 'Brazil (experimental plantings)'],
  altitude_sensitivity = 'Extremely high; best >1700m',
  terroir_transparency = 'Extremely high',
  common_processing_methods = ARRAY['Washed', 'Honey', 'Natural'],
  typical_flavor_notes = ARRAY['Jasmine', 'Bergamot', 'Peach', 'Lime', 'Citrus', 'Stone fruit', 'Honey sweetness', 'Tea-like'],
  acidity_style = 'High; floral-citric, high-definition',
  body_style = 'Light, tea-like, delicate',
  aromatics = 'Extremely high; volatile white florals, citrus oils',
  extraction_sensitivity = 'Very high; sensitive to grind, agitation, and temperature',
  roast_tolerance = 'Low-moderate; best at light to light-medium',
  roast_behavior = 'Prefers short, controlled development; easily mutes with excess heat; small roast changes shift expression significantly.',
  resting_behavior = 'Often volatile early; improves with rest (commonly 2-3+ weeks for peak clarity).',
  brewing_tendencies = 'High-clarity pour-over; low agitation; fast-flow brewers; delicate espresso possible with restraint. Peaks hot-warm.',
  common_pitfalls = ARRAY['Over-extraction introduces bitterness', 'Agitation collapses florals', 'Overdevelopment flattens aromatics', 'Underdevelopment feels hollow'],
  market_context = 'Ultra-premium; competition-driven; benchmark cultivar for high-end specialty.',
  limiting_factors = ARRAY['Low yield', 'Fragile tall plant structure', 'Disease sensitivity', 'Requires careful farm management'],
  cultivar_notes = $c$22 brews in Chris's corpus. Peaberry, green-tip, and "Queen" selections are phenotypic markers, not separate cultivars. Regional selections (Panamanian / Colombian / Brazilian / 1931) express variation around the same lineage root; consolidated to the single Gesha canonical per migration 016.$c$,
  updated_at = NOW()
WHERE cultivar_name = 'Gesha';

-- =========================================================================
-- Ethiopian Landrace Families — non-JARC landrace-derived selection
-- =========================================================================

UPDATE cultivars SET
  genetic_background = $c$Indigenous Ethiopian coffee populations consisting of thousands of genetically diverse Arabica genotypes originating in Ethiopian forest systems. Typically not stabilized cultivars but mixed local selections maintained by farmers. Represents population genetics rather than a single selection.$c$,
  typical_origins = ARRAY['Ethiopia (Sidama)', 'Ethiopia (Yirgacheffe)', 'Ethiopia (Guji)', 'Ethiopia (Bench Sheko)', 'Ethiopia (Limu)', 'Ethiopia (Kaffa)', 'Ethiopia (West Arsi)'],
  altitude_sensitivity = '1,700-2,200 masl; very high',
  terroir_transparency = 'Very high',
  common_processing_methods = ARRAY['Washed', 'Natural', 'Honey', 'Extended fermentation'],
  typical_flavor_notes = ARRAY['Citrus', 'Bergamot', 'Jasmine', 'Orange blossom', 'Peach', 'Apricot', 'Berry', 'Honey sweetness'],
  acidity_style = 'Medium-high to high; typically citric with occasional malic brightness',
  body_style = 'Light to medium-light; tea-like to silky',
  aromatics = 'Very high; floral and fruit aromatics dominate',
  extraction_sensitivity = 'Medium-high; delicate lots show bitterness if over-extracted',
  roast_tolerance = 'Low-medium; best at light to light-medium roasts',
  roast_behavior = 'Prefers shorter development; extended development mutes florals.',
  resting_behavior = 'Often volatile early; improves with moderate rest.',
  brewing_tendencies = 'High-clarity pour-over; balanced omni brewing possible; lighter espresso possible with careful extraction.',
  common_pitfalls = ARRAY['Over-fermentation amplification in experimental processing', 'Roast flattening', 'Underdevelopment in very light roasts'],
  market_context = 'Specialty premium; foundation of high-end Ethiopian coffee; frequently used in competition coffees.',
  limiting_factors = ARRAY['Genetic heterogeneity', 'Variable yield', 'Uneven ripening', 'Lot-to-lot cup variability'],
  cultivar_notes = $c$Population-level label — individual trees may belong to many distinct landrace genotypes within a single lot. Canonical catch-all when a lot is marketed as "heirloom" without a named selection.$c$,
  updated_at = NOW()
WHERE cultivar_name = 'Ethiopian landrace population';

UPDATE cultivars SET
  genetic_background = $c$Ethiopian-origin landrace material introduced to Indonesia (Java) in the 19th century; selected and stabilized locally after Typica was largely wiped out by leaf rust. Not genetically Typica despite the name association.$c$,
  typical_origins = ARRAY['Indonesia (Java)', 'Indonesia (Bali)', 'Guatemala', 'Costa Rica', 'Rwanda'],
  altitude_sensitivity = '1,200-2,000 masl; high',
  terroir_transparency = 'High',
  common_processing_methods = ARRAY['Washed', 'Natural', 'Honey'],
  typical_flavor_notes = ARRAY['Tea-like', 'Citrus', 'Lemongrass', 'Light florals', 'Raw sugar sweetness', 'Spice accents'],
  acidity_style = 'Medium; brisk citric with herbal lift',
  body_style = 'Light to medium-light; crisp',
  aromatics = 'High-toned, refined, tea-like',
  extraction_sensitivity = 'Moderate-high; sensitive to over-extraction',
  roast_tolerance = 'Low-medium; best at light to light-medium',
  roast_behavior = 'Prefers shorter development; easily loses clarity and aromatics with excess heat.',
  resting_behavior = 'Often improves with moderate rest; early cups can feel slightly sharp or thin.',
  brewing_tendencies = 'High-clarity pour-over; filter-focused; delicate espresso possible.',
  common_pitfalls = ARRAY['Overdevelopment flattens tea-like structure', 'Underdevelopment feels grassy', 'Extraction bitterness if pushed'],
  market_context = 'Specialty premium; increasingly used in high-end Central American and Rwandan lots.',
  limiting_factors = ARRAY['Moderate yield', 'Less widely planted', 'Variability by selection'],
  cultivar_notes = 'Despite the name "Java," genetically aligns with Ethiopian landrace material. Known for clean, transparent sweetness and tea-like structure rather than heavy body.',
  updated_at = NOW()
WHERE cultivar_name = 'Java';

UPDATE cultivars SET
  genetic_background = $c$Originally believed to be a natural hybrid between Red Bourbon and Yellow Bourbon due to cherry color. Modern genetic testing indicates Pink Bourbon is not part of the Bourbon Family but instead derives from Ethiopian landrace material introduced into Colombia. Stabilized selection identified by pink / orange cherry coloration.$c$,
  typical_origins = ARRAY['Colombia (Huila - San Agustín, Pitalito)', 'Colombia (Cauca)', 'Colombia (Nariño)', 'Colombia (Tolima)'],
  altitude_sensitivity = '1,700-2,000m; high',
  terroir_transparency = 'High',
  common_processing_methods = ARRAY['Washed', 'Honey', 'Natural', 'Controlled fermentations'],
  typical_flavor_notes = ARRAY['Pink grapefruit', 'Sweet lemon', 'Strawberry', 'Raspberry', 'White peach', 'Rose', 'Cane sugar'],
  acidity_style = 'Medium-high to high; citric-malic blend; juicy, often rounded',
  body_style = 'Medium-light; silky, slightly more weight than Gesha; balanced',
  aromatics = 'High; floral-fruit forward; less purely white-floral than Gesha, more fruit-integrated',
  extraction_sensitivity = 'Medium to high; over-extraction introduces dryness quickly',
  roast_tolerance = 'Low to medium; best at light to light-medium',
  roast_behavior = 'Prefers shorter development; easily mutes under excess heat; can taste thin if underdeveloped.',
  resting_behavior = 'Volatile early; improves with moderate rest; peak window often narrower than Bourbon classic.',
  brewing_tendencies = 'High-clarity pour-over; balanced omni possible; espresso works if extraction restrained and development slightly extended.',
  common_pitfalls = ARRAY['Underdevelopment risk', 'Over-fermentation amplification in experimental lots', 'Roast flattening when pushed darker'],
  market_context = 'Specialty premium; often positioned as a "Gesha alternative" with stronger fruit character; popular in competition.',
  limiting_factors = ARRAY['Moderate yield', 'Genetic instability in some seed stock', 'Requires elevation for peak aromatic expression'],
  cultivar_notes = 'Sits structurally between Gesha and 74110 in cup behavior — more fruit weight than Gesha but retains Ethiopian-derived clarity. Distinct from Rosado (kept as separate canonical).',
  updated_at = NOW()
WHERE cultivar_name = 'Pink Bourbon';

UPDATE cultivars SET
  genetic_background = $c$Refers to pink / orange-fruited selections found primarily in Colombia and nearby regions. Historically conflated with Pink Bourbon, but many Rosado lots are distinct selections with unclear or mixed pedigree. Genetic testing is limited.$c$,
  typical_origins = ARRAY['Colombia (Huila)', 'Colombia (Nariño)', 'Colombia (Cauca)'],
  altitude_sensitivity = '1,600-2,000 masl',
  terroir_transparency = 'High',
  common_processing_methods = ARRAY['Washed', 'Honey', 'Natural', 'Experimental fermentations'],
  typical_flavor_notes = ARRAY['Grapefruit', 'Sweet lemon', 'Red fruit', 'Light florals', 'Cane sugar'],
  acidity_style = 'Medium-high; citric-malic, often rounded',
  body_style = 'Medium-light; silky',
  aromatics = 'High; fruit-forward with some floral lift',
  extraction_sensitivity = 'Moderate-high; sensitive to over-extraction',
  roast_tolerance = 'Low-medium; best at light to light-medium',
  roast_behavior = 'Prefers shorter development; easily mutes with excess heat.',
  resting_behavior = 'Often volatile early; improves with moderate rest.',
  brewing_tendencies = 'High-clarity pour-over; balanced omni possible; careful espresso.',
  common_pitfalls = ARRAY['Mislabeling (confusion with Pink Bourbon)', 'Process amplification masking cultivar', 'Roast flattening'],
  market_context = 'Specialty premium / experimental micro-lots.',
  limiting_factors = ARRAY['Genetic inconsistency', 'Unclear pedigree', 'Variable plant stock across farms'],
  cultivar_notes = 'Treat as a named selection with unclear pedigree. Do not automatically equate with Pink Bourbon. If a specific lot is verified as Pink Bourbon, reclassify. Otherwise retain Rosado and flag uncertainty.',
  updated_at = NOW()
WHERE cultivar_name = 'Rosado';

UPDATE cultivars SET
  genetic_background = $c$Historic Ethiopian-related landrace material originating from the Boma Plateau in South Sudan; represents indigenous Arabica populations rather than a stabilized modern cultivar or breeding program.$c$,
  typical_origins = ARRAY['South Sudan', 'Latin America (specialty lots)'],
  altitude_sensitivity = '1,500-2,000+ masl; very high',
  terroir_transparency = 'Very high',
  common_processing_methods = ARRAY['Washed', 'Natural', 'Experimental lots'],
  typical_flavor_notes = ARRAY['Floral', 'Tropical fruit', 'Citrus', 'Complex sweetness'],
  acidity_style = 'Bright, elegant',
  body_style = 'Light to medium',
  aromatics = 'High-toned floral and fruit aromatics',
  extraction_sensitivity = 'Moderate-high',
  roast_tolerance = 'Light to light-medium',
  roast_behavior = 'Easily muted if overdeveloped; benefits from preserving aromatic lift.',
  resting_behavior = 'Benefits from a careful rest rather than very early opening.',
  brewing_tendencies = 'High-clarity pour-over; filter-focused; competition-style presentation.',
  common_pitfalls = ARRAY['Low yield', 'Disease vulnerability', 'Roast flattening if pushed too far'],
  market_context = 'Specialty premium; rare / competition-adjacent.',
  limiting_factors = ARRAY['Low yield', 'Disease sensitivity', 'Limited global planting base'],
  cultivar_notes = 'Historic landrace; rare outside origin. Highlights floral / citrus profile similar to Ethiopian Landrace populations.',
  updated_at = NOW()
WHERE cultivar_name = 'Sudan Rume';

-- =========================================================================
-- Bourbon Family — Bourbon (classic)
-- =========================================================================

UPDATE cultivars SET
  genetic_background = 'Bourbon mutation; Colombian selection (formerly labeled "Bourbon Aruzi"; canonical = Aruzi post Variety sprint).',
  typical_origins = ARRAY['Colombia'],
  altitude_sensitivity = '1500-1800m; medium-high',
  terroir_transparency = 'Medium-high',
  common_processing_methods = ARRAY['Washed'],
  typical_flavor_notes = ARRAY['Red apple', 'Caramel', 'Rose'],
  acidity_style = 'Medium malic',
  body_style = 'Medium',
  aromatics = 'Soft florals',
  extraction_sensitivity = 'Moderate',
  roast_tolerance = 'Moderate-high',
  roast_behavior = 'Handles light-medium.',
  resting_behavior = 'Stable; improves cooled.',
  brewing_tendencies = 'Wide tolerance.',
  common_pitfalls = ARRAY['Over-fermentation risk'],
  market_context = 'Estate-focused specialty.',
  limiting_factors = ARRAY['Rust susceptibility'],
  cultivar_notes = 'Canonical name = Aruzi (formerly Bourbon Aruzi, collapsed 2026-04-22).',
  updated_at = NOW()
WHERE cultivar_name = 'Aruzi';

UPDATE cultivars SET
  genetic_background = 'A red-fruited phenotype within the Bourbon group, commonly treated as a Bourbon "color type" rather than a distinct new genetic root. Bourbon itself traces through Réunion (Île Bourbon) dissemination.',
  typical_origins = ARRAY['Latin America', 'Africa'],
  altitude_sensitivity = '1,100-2,000 masl; high',
  terroir_transparency = 'High',
  common_processing_methods = ARRAY['Washed', 'Honey', 'Natural'],
  typical_flavor_notes = ARRAY['Caramel', 'Brown sugar', 'Red fruit', 'Stone fruit', 'Balanced citrus', 'Vanilla', 'Chocolate'],
  acidity_style = 'Medium to medium-high; citric and rounded',
  body_style = 'Medium; smooth / creamy when well grown',
  aromatics = 'Sweet fruit, light florals, confectionary notes',
  extraction_sensitivity = 'Medium',
  roast_tolerance = 'Light to medium',
  roast_behavior = 'Handles moderate development; too much development flattens fruit into generic caramel.',
  resting_behavior = 'Stable; improves with moderate rest.',
  brewing_tendencies = 'Omni (filter + espresso); great "sweet base" espresso.',
  common_pitfalls = ARRAY['Confusing color type with separate lineage', 'Over-roasting → dull cups'],
  market_context = 'Specialty staple / quality premium.',
  limiting_factors = ARRAY['Disease susceptibility (rust)', 'Lower yield vs modern hybrids'],
  cultivar_notes = 'If a producer documents a specific stabilized "Red Bourbon" selection, treat as named selection; otherwise reads as a Bourbon color phenotype.',
  updated_at = NOW()
WHERE cultivar_name = 'Red Bourbon';

UPDATE cultivars SET
  genetic_background = $c$Traditional Bourbon-derived cultivars grown in Burundi; Mibirizi is a locally distributed Bourbon selection alongside Red Bourbon. Field blends are common due to mixed plantings.$c$,
  typical_origins = ARRAY['Burundi (Kayanza)', 'Burundi (Ngozi)', 'Burundi (Muyinga)'],
  altitude_sensitivity = '1,600-2,000 masl; high',
  terroir_transparency = 'High',
  common_processing_methods = ARRAY['Washed', 'Natural'],
  typical_flavor_notes = ARRAY['Citrus', 'Red fruit', 'Tea', 'Sugar sweetness'],
  acidity_style = 'Medium-high, citric',
  body_style = 'Medium-light, tea-like',
  aromatics = 'Floral, citrus, light fruit',
  extraction_sensitivity = 'Moderate',
  roast_tolerance = 'Light to medium',
  roast_behavior = 'Handles moderate development; too much flattens acidity.',
  resting_behavior = 'Improves with rest.',
  brewing_tendencies = 'High-clarity pour-over; clean percolation.',
  common_pitfalls = ARRAY['Expecting single-cultivar precision', 'Lot variability'],
  market_context = 'Specialty staple.',
  limiting_factors = ARRAY['Mixed plant stock', 'Variable yield'],
  cultivar_notes = 'Treat as a field blend; do not separate into component cultivars unless the lot is explicitly mill-separated.',
  updated_at = NOW()
WHERE cultivar_name = 'Red Bourbon / Mibirizi blend';

-- =========================================================================
-- Bourbon Family — Bourbon mutation lineage
-- =========================================================================

UPDATE cultivars SET
  genetic_background = 'Blend of Bourbon (classic lineage) and Caturra (Bourbon mutation). Typical Central American farm composition where Bourbon-derived cultivars dominate and are processed together at mill level.',
  typical_origins = ARRAY['Guatemala (Huehuetenango)', 'Central America'],
  altitude_sensitivity = '1,600-2,000 masl; medium-high',
  terroir_transparency = 'Medium-high',
  common_processing_methods = ARRAY['Washed'],
  typical_flavor_notes = ARRAY['Citrus', 'Cocoa', 'Brown sugar', 'Dried fruit', 'Light spice'],
  acidity_style = 'Medium; rounded citric',
  body_style = 'Medium; structured, slightly weighty',
  aromatics = 'Moderate; sweetness-forward with mild florals',
  extraction_sensitivity = 'Low-moderate; forgiving',
  roast_tolerance = 'Medium; wide workable range',
  roast_behavior = 'Handles moderate development well; increased development emphasizes cocoa and sugar browning.',
  resting_behavior = 'Stable; performs consistently across rest windows.',
  brewing_tendencies = 'Balanced omni; strong espresso performance; forgiving pour-over.',
  common_pitfalls = ARRAY['Expecting high-aromatic clarity', 'Can flatten if pushed too dark', 'Blend reduces distinct top-note expression'],
  market_context = 'Specialty-commercial bridge; classic Guatemala profile.',
  limiting_factors = ARRAY['Mixed plant stock', 'Not optimized for single-cultivar expression'],
  cultivar_notes = 'Normalize as blend; do not include Typica or "modern hybrids" since those are not documented parents.',
  updated_at = NOW()
WHERE cultivar_name = 'Bourbon / Caturra blend';

UPDATE cultivars SET
  genetic_background = 'Dwarf Bourbon mutation.',
  typical_origins = ARRAY['Latin America'],
  altitude_sensitivity = '1400-1800m',
  terroir_transparency = 'Medium',
  common_processing_methods = ARRAY['Washed'],
  typical_flavor_notes = ARRAY['Orange', 'Caramel'],
  acidity_style = 'Medium',
  body_style = 'Medium',
  aromatics = 'Moderate',
  extraction_sensitivity = 'Moderate',
  roast_tolerance = 'Moderate',
  roast_behavior = 'Even heat.',
  resting_behavior = 'Stable.',
  brewing_tendencies = 'Wide tolerance.',
  common_pitfalls = ARRAY['Over-ferments easily'],
  market_context = 'Classic cultivar.',
  limiting_factors = ARRAY['Rust susceptibility'],
  cultivar_notes = 'Balanced baseline; reliable reference when comparing rarer Bourbon-family selections. Red / Yellow Caturra are phenotype aliases; Purple Caturra kept separate.',
  updated_at = NOW()
WHERE cultivar_name = 'Caturra';

UPDATE cultivars SET
  genetic_background = 'Low caffeine mutation of Bourbon.',
  typical_origins = ARRAY['Brazil', 'Colombia'],
  altitude_sensitivity = '>1500m; medium-high',
  terroir_transparency = 'Medium-high',
  common_processing_methods = ARRAY['Washed', 'Natural'],
  typical_flavor_notes = ARRAY['Plum', 'Citrus'],
  acidity_style = 'Medium soft',
  body_style = 'Light silky',
  aromatics = 'Subtle',
  extraction_sensitivity = 'Moderate',
  roast_tolerance = 'Moderate',
  roast_behavior = 'Light-medium tolerant.',
  resting_behavior = 'Stable.',
  brewing_tendencies = 'Gentle percolation.',
  common_pitfalls = ARRAY['Forcing body ruins clarity'],
  market_context = 'Boutique novelty.',
  limiting_factors = ARRAY['Moderate yield'],
  cultivar_notes = 'Intrinsically light body — trying to brew it for density fights the cultivar. Reclassified from Bourbon (classic) to Bourbon mutation lineage 2026-04-22.',
  updated_at = NOW()
WHERE cultivar_name = 'Laurina';

UPDATE cultivars SET
  genetic_background = $c$A Caturra-type Bourbon mutation expression characterized by purple / cherry coloration. Typically treated as a fruit-color phenotype rather than a fully standardized genetic cultivar.$c$,
  typical_origins = ARRAY['Colombia'],
  altitude_sensitivity = '1,730-1,850m; medium',
  terroir_transparency = 'Medium',
  common_processing_methods = ARRAY['Washed', 'Anaerobic washed', 'Experimental fermentations'],
  typical_flavor_notes = ARRAY['Red fruit', 'Purple fruit', 'Candy-like sweetness', 'Florals'],
  acidity_style = 'Bright, fruit-driven',
  body_style = 'Medium, juicy',
  aromatics = 'Red fruit, florals depending on roast + process',
  extraction_sensitivity = 'Medium',
  roast_tolerance = 'Light to light-medium',
  roast_behavior = 'Too much development turns fruit into generic caramel; too light can emphasize ferment sharpness.',
  resting_behavior = 'Can be volatile early if heavily processed; often stabilizes after moderate rest.',
  brewing_tendencies = 'Filter-forward for clarity; espresso can be punchy but can over-emphasize ferment notes.',
  common_pitfalls = ARRAY['Over-fermentation amplification', 'Confusing "purple" phenotype with a fully documented genetic cultivar'],
  market_context = 'Experimental / specialty premium micro-lots.',
  limiting_factors = ARRAY['Genetic documentation / standardization', 'Consistency across farms and harvests'],
  cultivar_notes = 'Kept canonical; Red / Yellow Caturra collapse to base Caturra.',
  updated_at = NOW()
WHERE cultivar_name = 'Purple Caturra';

-- =========================================================================
-- Typica × Bourbon Crosses
-- =========================================================================

UPDATE cultivars SET
  genetic_background = $c$Hybrid between Maragogype (Typica mutation, large-bean) and Caturra (Bourbon mutation). Combines large bean size and structure with more compact plant traits from Caturra.$c$,
  typical_origins = ARRAY['Nicaragua', 'El Salvador', 'Guatemala', 'Brazil', 'Colombia'],
  altitude_sensitivity = '1,200-1,800 masl; medium-high',
  terroir_transparency = 'Medium-high',
  common_processing_methods = ARRAY['Washed', 'Natural', 'Honey', 'Experimental fermentations'],
  typical_flavor_notes = ARRAY['Citrus', 'Stone fruit', 'Tropical fruit', 'Cocoa'],
  acidity_style = 'Medium to medium-high; rounder than Gesha but more lifted than Catuaí',
  body_style = 'Medium to medium-full; more weight than Ethiopian cultivars',
  aromatics = 'Moderate-high; less purely floral, more fruit + sweetness driven',
  extraction_sensitivity = 'Moderate',
  roast_tolerance = 'Medium',
  roast_behavior = 'Handles development better than Gesha; too much heat flattens fruit into cocoa-heavy profile.',
  resting_behavior = 'Benefits from rest; stabilizes and sweetens after initial degassing.',
  brewing_tendencies = 'Balanced omni; slightly coarser grind often helps due to large beans.',
  common_pitfalls = ARRAY['Uneven extraction due to large bean size', 'Can become heavy / muddy with aggressive processing'],
  market_context = 'Specialty premium (recognizable but variable); used in competitions occasionally.',
  limiting_factors = ARRAY['Large bean size variability', 'Inconsistent cup quality across farms', 'Moderate disease susceptibility'],
  cultivar_notes = 'Often confused with Pacamara (different cross — Pacas × Maragogype). Larger beans require grind adjustments.',
  updated_at = NOW()
WHERE cultivar_name = 'Maracaturra';

UPDATE cultivars SET
  genetic_background = $c$Developed in Brazil (Instituto Agronômico de Campinas, mid-20th century). Cross between Mundo Novo (Typica × Bourbon natural hybrid) and Caturra (Bourbon mutation). Selected for compact plant structure, high yield, wind resistance, and productivity.$c$,
  typical_origins = ARRAY['Brazil (Minas Gerais)', 'Brazil (São Paulo)', 'Brazil (Bahia)', 'Honduras', 'Guatemala', 'Costa Rica', 'Nicaragua'],
  altitude_sensitivity = '1,000-1,800 masl; moderate',
  terroir_transparency = 'Medium',
  common_processing_methods = ARRAY['Washed', 'Natural', 'Honey', 'Anaerobic'],
  typical_flavor_notes = ARRAY['Orange', 'Brown sugar', 'Caramel', 'Milk chocolate', 'Almond', 'Hazelnut', 'Red fruit'],
  acidity_style = 'Low to medium; soft citric; rounded',
  body_style = 'Medium; balanced, slightly creamy',
  aromatics = 'Low to moderate; sweet, nutty, cocoa-forward',
  extraction_sensitivity = 'Low to medium; forgiving across brew styles',
  roast_tolerance = 'Medium to high; performs well from light-medium through medium',
  roast_behavior = 'Handles extended development; prefers moderate development to build sweetness; easily mutes if pushed too dark.',
  resting_behavior = 'Fast opener; stable profile with moderate rest; does not require extended aging.',
  brewing_tendencies = 'Balanced omni; strong espresso performer; stable in batch brew and immersion.',
  common_pitfalls = ARRAY['Underdevelopment at very light roast', 'Roast flattening when pushed too dark', 'Expecting high florality'],
  market_context = 'Volume stable; widely planted workhorse; valued for reliability, yield, balanced cup profile.',
  limiting_factors = ARRAY['Moderate disease susceptibility', 'Cup ceiling lower than high-aromatic cultivars', 'Can become generic at low elevation'],
  cultivar_notes = 'Structurally dependable. Excels as a sweetness-and-balance cultivar. At higher elevations in Honduras and Guatemala, can show surprising clarity. Yellow / Red Catuaí collapse to base Catuaí.',
  updated_at = NOW()
WHERE cultivar_name = 'Catuaí';

UPDATE cultivars SET
  genetic_background = 'Hybrid large-seed cultivar from Pacas × Maragogype.',
  typical_origins = ARRAY['El Salvador', 'Panama'],
  altitude_sensitivity = '>1600m; medium',
  terroir_transparency = 'Medium',
  common_processing_methods = ARRAY['Washed', 'Natural'],
  typical_flavor_notes = ARRAY['Orange', 'Melon', 'Papaya'],
  acidity_style = 'Medium-high',
  body_style = 'Medium-full',
  aromatics = 'Herbal-floral',
  extraction_sensitivity = 'Moderate-high',
  roast_tolerance = 'Moderate',
  roast_behavior = 'Requires careful heat.',
  resting_behavior = 'Benefits from rest.',
  brewing_tendencies = 'Slightly coarser grind.',
  common_pitfalls = ARRAY['Uneven extraction risk', 'Natural lots can muddle'],
  market_context = 'Recognized but variable.',
  limiting_factors = ARRAY['Bean size inconsistency'],
  cultivar_notes = 'Sibling to Maracaturra but with different structural parentage (Pacas-derived, not Caturra-derived).',
  updated_at = NOW()
WHERE cultivar_name = 'Pacamara';

UPDATE cultivars SET
  genetic_background = 'Ecuadorian Typica selection (Typica Mejorado).',
  typical_origins = ARRAY['Ecuador', 'Peru'],
  altitude_sensitivity = '1600-1900m; high',
  terroir_transparency = 'High',
  common_processing_methods = ARRAY['Washed', 'Oxidative'],
  typical_flavor_notes = ARRAY['Orange', 'Apple', 'Tea'],
  acidity_style = 'Medium-high malic',
  body_style = 'Medium soft',
  aromatics = 'Subtle florals',
  extraction_sensitivity = 'Moderate',
  roast_tolerance = 'Moderate',
  roast_behavior = 'Accepts more development than Gesha.',
  resting_behavior = 'Stable.',
  brewing_tendencies = 'Longer contact helpful.',
  common_pitfalls = ARRAY['Savory if over-bloomed', 'Oxidative lots require restraint'],
  market_context = 'Niche high-end.',
  limiting_factors = ARRAY['Low yield'],
  cultivar_notes = 'Typica Mejorado aliases to Mejorado (canonical).',
  updated_at = NOW()
WHERE cultivar_name = 'Mejorado';

UPDATE cultivars SET
  genetic_background = $c$Ecuador-associated cultivar with uncertain breeding history; commonly believed to involve Typica and Bourbon ancestry though genetic documentation remains limited.$c$,
  typical_origins = ARRAY['Ecuador', 'Colombia'],
  altitude_sensitivity = '1500-2100m; high',
  terroir_transparency = 'High',
  common_processing_methods = ARRAY['Washed', 'Natural', 'Controlled fermentations'],
  typical_flavor_notes = ARRAY['Floral', 'High-toned fruit', 'High sweetness', 'Complex'],
  acidity_style = 'Vibrant, sparkling',
  body_style = 'Velvety / silky, medium',
  aromatics = 'Floral, perfumed, high-toned fruit aromatics',
  extraction_sensitivity = 'Moderate-high',
  roast_tolerance = 'Light to medium-light',
  roast_behavior = 'Prefers shorter development to preserve aromatics; heavier development can mute florals.',
  resting_behavior = 'Often improves with rest; early cups may be volatile.',
  brewing_tendencies = 'High-clarity pour-over; strong fruit-forward espresso.',
  common_pitfalls = ARRAY['Seed / identity inconsistency', 'Heavy fermentation can overshadow varietal character'],
  market_context = 'Specialty premium / competition-driven.',
  limiting_factors = ARRAY['Traceability + varietal purity risk due to unclear seed system'],
  cultivar_notes = '"Bourbon Sidra" labels reflect suspected pedigree rather than a formally-recognized distinct cultivar. 3 brews in Chris''s corpus.',
  updated_at = NOW()
WHERE cultivar_name = 'Sidra';

-- =========================================================================
-- Modern Hybrids
-- =========================================================================

UPDATE cultivars SET
  genetic_background = 'Rust-resistant Colombian hybrid (Caturra × Timor Hybrid-derived).',
  typical_origins = ARRAY['Colombia'],
  altitude_sensitivity = '1400-1900m; medium',
  terroir_transparency = 'Medium',
  common_processing_methods = ARRAY['Washed'],
  typical_flavor_notes = ARRAY['Citrus', 'Caramel'],
  acidity_style = 'Medium',
  body_style = 'Medium',
  aromatics = 'Moderate',
  extraction_sensitivity = 'Low-medium',
  roast_tolerance = 'Medium-high',
  roast_behavior = 'Even heat.',
  resting_behavior = 'Stable.',
  brewing_tendencies = 'Forgiving.',
  common_pitfalls = ARRAY['Can taste generic'],
  market_context = 'Widely planted; built for yield + resistance.',
  limiting_factors = ARRAY['Hybrid genetics'],
  cultivar_notes = 'Rust-resistant workhorse.',
  updated_at = NOW()
WHERE cultivar_name = 'Castillo';

UPDATE cultivars SET
  genetic_background = $c$Modern proprietary or semi-proprietary cultivar (often associated with specific Panamanian producers such as Garrido). Likely derived from multi-parent breeding involving Bourbon / Typica backgrounds and possibly disease-resistant material, but exact pedigree is not publicly disclosed.$c$,
  typical_origins = ARRAY['Panama (Chiriquí)', 'Panama (Boquete)'],
  altitude_sensitivity = '1,400-2,100 masl; medium-high',
  terroir_transparency = 'Medium',
  common_processing_methods = ARRAY['Natural', 'Washed', 'Experimental fermentations'],
  typical_flavor_notes = ARRAY['Red fruit', 'Tropical fruit', 'Confectionary sweetness', 'Wine-like'],
  acidity_style = 'Medium; rounded, fruit-driven',
  body_style = 'Medium; more structure than Ethiopian landrace types',
  aromatics = 'Medium-high; fruit-forward rather than purely floral',
  extraction_sensitivity = 'Moderate; more forgiving than delicate heirloom cultivars',
  roast_tolerance = 'Medium; tolerates wider roast range than Gesha',
  roast_behavior = 'Handles moderate development; excessive development can mute fruit.',
  resting_behavior = 'Typically stable; benefits from moderate rest, especially for processed lots.',
  brewing_tendencies = 'Balanced omni; performs well in both filter and espresso.',
  common_pitfalls = ARRAY['Process-driven variability', 'Over-extraction can dull fruit clarity', 'Identity confusion due to unclear genetics'],
  market_context = 'Experimental / specialty premium / producer-driven.',
  limiting_factors = ARRAY['Unclear pedigree', 'Limited transparency', 'Availability restricted to specific farms'],
  cultivar_notes = 'Treat as named cultivar with uncertain genetics. Distinct from Mokka despite name similarity.',
  updated_at = NOW()
WHERE cultivar_name = 'Mokkita';

UPDATE cultivars SET
  genetic_background = $c$Not a single distinct cultivar but a group of many distinct varieties with similar parentage, generally deriving from Caturra crossed with Timor Hybrid material. World Coffee Research explicitly notes it is a group rather than one uniform variety.$c$,
  typical_origins = ARRAY['Latin America', 'Asia', 'Rust-affected producing regions'],
  altitude_sensitivity = '700-1,600 masl; low to medium',
  terroir_transparency = 'Low-medium',
  common_processing_methods = ARRAY['Washed', 'Commercial naturals', 'Specialty processing in better selections'],
  typical_flavor_notes = ARRAY['Nutty', 'Cocoa', 'Spice', 'Mild fruit'],
  acidity_style = 'Moderate to lower-brightness',
  body_style = 'Medium to heavier',
  aromatics = 'Less overtly floral; selection-dependent',
  extraction_sensitivity = 'Generally forgiving',
  roast_tolerance = 'Medium to medium-dark',
  roast_behavior = 'Tolerates more development than delicate heirloom types, but can flatten quickly.',
  resting_behavior = 'Usually stable; not especially volatile.',
  brewing_tendencies = 'Balanced omni; approachable espresso; practical production brewing.',
  common_pitfalls = ARRAY['Mislabeling Catimor as a single cultivar', 'Expecting high-aromatic clarity', 'Roast flattening with excessive development'],
  market_context = 'Volume-stable, disease-management-driven; commercial-to-specialty depending on selection.',
  limiting_factors = ARRAY['Cup quality ceiling varies widely by selection', 'Lineage often oversimplified'],
  cultivar_notes = 'Group label, not a single canonical cultivar. When a specific released selection (e.g. Castillo, Marsellesa) is known, classify using that cultivar instead.',
  updated_at = NOW()
WHERE cultivar_name = 'Catimor (group)';

UPDATE cultivars SET
  genetic_background = 'Bourbon × Timor ancestry; rust-resistant.',
  typical_origins = ARRAY['Mexico', 'Colombia'],
  altitude_sensitivity = 'Mid elevations; medium',
  terroir_transparency = 'Medium',
  common_processing_methods = ARRAY['Washed', 'Natural'],
  typical_flavor_notes = ARRAY['Nutty', 'Grain-sweet', 'Soft fruit'],
  acidity_style = 'Low-medium citric',
  body_style = 'Medium rounded',
  aromatics = 'Low-moderate',
  extraction_sensitivity = 'Low-medium',
  roast_tolerance = 'Medium-high',
  roast_behavior = 'Accepts more development.',
  resting_behavior = 'Stable.',
  brewing_tendencies = 'Forgiving.',
  common_pitfalls = ARRAY['Can taste dull if pushed', 'Less aromatic intensity than heirloom types'],
  market_context = 'Commercial-specialty bridge.',
  limiting_factors = ARRAY['Disease resistance breeding reduces aromatic ceiling'],
  cultivar_notes = 'Moved to Modern Hybrids per migration 017; Bourbon × Timor ancestry is the modern-hybrid fit.',
  updated_at = NOW()
WHERE cultivar_name = 'Garnica';

UPDATE cultivars SET
  genetic_background = $c$Cross between Timor Hybrid 832/2 and Villa Sarchi (CIFC 971/10); selected by ECOM / CIRAD in Nicaragua for leaf rust resistance; released ~2009. A rust-resistant Sarchimor-type line.$c$,
  typical_origins = ARRAY['Central America', 'Latin America'],
  altitude_sensitivity = '1,400-1,900 masl; medium',
  terroir_transparency = 'Medium',
  common_processing_methods = ARRAY['Washed', 'Honey', 'Natural'],
  typical_flavor_notes = ARRAY['Sweet citrus', 'Cocoa', 'Stonefruit', 'Red fruit', 'Balanced chocolate', 'Caramel'],
  acidity_style = 'Medium; citric / structured',
  body_style = 'Medium, rounded',
  aromatics = 'Fruit + sweet spice; less overtly floral than Gesha',
  extraction_sensitivity = 'Medium; forgiving',
  roast_tolerance = 'Light to medium',
  roast_behavior = 'Handles extended development better than Gesha; avoid baking.',
  resting_behavior = 'Typically stable after moderate rest.',
  brewing_tendencies = 'Omni (filter / espresso) depending on roast intent.',
  common_pitfalls = ARRAY['Treating "rust-resistant" as "low quality"', 'Roast flattening if baked', 'Generic character if site quality is weak'],
  market_context = 'Volume-stable + specialty-capable (workhorse with upside).',
  limiting_factors = ARRAY['Cup quality depends heavily on selection + farm management', 'Perception bias in some markets'],
  cultivar_notes = 'Can deliver genuinely specialty-grade cups when grown / processed well, but won''t typically mimic Gesha-like perfume.',
  updated_at = NOW()
WHERE cultivar_name = 'Marsellesa';

COMMIT;
