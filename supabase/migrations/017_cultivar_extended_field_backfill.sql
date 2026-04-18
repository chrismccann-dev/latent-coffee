-- Migration 017 - Extended-field backfill for 9 sparse cultivar lineages
--
-- Post-migration-016 state: 9 of the 13 lineages render blank on 5
-- array fields (typical_origins, limiting_factors,
-- common_processing_methods, typical_flavor_notes, common_pitfalls).
-- The detail page merges these fields across a lineage using
-- first-non-null semantics, so populating ONE representative cultivar
-- per lineage is sufficient to surface the content.
--
-- Content drafted at the LINEAGE level (not cultivar-specific), drawing
-- on Chris's cultivar reference doc + general coffee knowledge.
-- Approved 2026-04-20 for write.
--
-- Operation per lineage: UPDATE the lineage's representative cultivar
-- (highest brew count or canonical exemplar) to set all 5 array fields.
-- Nothing else on the row is touched.

BEGIN;

-- ==================================================================
-- 1. Bourbon mutation lineage -> Caturra
-- ==================================================================
UPDATE cultivars
SET
  typical_origins = ARRAY[
    'Brazil', 'Colombia', 'Costa Rica', 'Honduras', 'Guatemala', 'Nicaragua'
  ]::TEXT[],
  limiting_factors = ARRAY[
    'Lower yield than modern hybrids',
    'Leaf-rust susceptible',
    'Coffee berry disease sensitivity',
    'Dense planting needed',
    'Quality plateaus below ~1400m'
  ]::TEXT[],
  common_processing_methods = ARRAY[
    'Washed', 'Honey', 'Natural', 'Anaerobic'
  ]::TEXT[],
  typical_flavor_notes = ARRAY[
    'Red apple', 'Caramel', 'Cocoa', 'Dried berry', 'Toasted nut',
    'Balanced citrus', 'Brown sugar', 'Structured body'
  ]::TEXT[],
  common_pitfalls = ARRAY[
    'Below 1400m reads flat and papery',
    'Over-roasted drifts into generic commodity character',
    'Underdevelopment surfaces green / vegetal',
    'Can feel competent but unremarkable without processing differentiation'
  ]::TEXT[]
WHERE id = 'a9068464-ce15-4aaa-ba56-e5c76ff17de4';

-- ==================================================================
-- 2. Ethiopian landrace-derived (non-JARC) -> Ethiopian landrace population
-- ==================================================================
UPDATE cultivars
SET
  typical_origins = ARRAY[
    'Ethiopia (Sidama, Yirgacheffe, Guji, Bench Sheko, Kaffa)',
    'Colombia (Pink Bourbon - Huila)',
    'Indonesia (Java selection historical)',
    'Kenya (Sudan Rume historical)',
    'Panama, Costa Rica (replanted)'
  ]::TEXT[],
  limiting_factors = ARRAY[
    'Genetic heterogeneity makes selection uneven',
    'Moderate yield',
    'Rust and CBD sensitive depending on selection',
    'Narrow optimal elevation for peak aromatic expression',
    'Batch-to-batch population variance'
  ]::TEXT[],
  common_processing_methods = ARRAY[
    'Washed', 'Natural', 'Honey', 'Anaerobic', 'Carbonic maceration'
  ]::TEXT[],
  typical_flavor_notes = ARRAY[
    'Jasmine', 'Orange blossom', 'Bergamot',
    'Lemon', 'Lime', 'Tangerine',
    'Peach', 'Apricot',
    'Blueberry', 'Strawberry',
    'Tea-like structure', 'Honeyed sweetness'
  ]::TEXT[],
  common_pitfalls = ARRAY[
    'Population heterogeneity produces batch-to-batch cup variance',
    'Narrow roast window - tips to green/vegetal if underdeveloped',
    'Flattens florals if over-roasted',
    'Heavy fermentation-forward processing can mask native aromatic complexity',
    'Extraction demands clarity'
  ]::TEXT[]
WHERE id = 'dc73c6cd-b218-4ff6-8bee-ce995fcad105';

-- ==================================================================
-- 3. Timor Hybrid-derived lineage -> Catimor Group
-- ==================================================================
UPDATE cultivars
SET
  typical_origins = ARRAY[
    'Honduras', 'Nicaragua', 'Mexico', 'Costa Rica',
    'India (Catimor breeding origin)',
    'Colombia (to lesser degree)'
  ]::TEXT[],
  limiting_factors = ARRAY[
    'Robusta genetic residue can surface as rubbery / woody / herbaceous notes',
    'Careful cup-quality selection required at origin',
    'Can mute terroir expression',
    'Narrow optimal roast window in some clones'
  ]::TEXT[],
  common_processing_methods = ARRAY[
    'Washed', 'Natural', 'Honey'
  ]::TEXT[],
  typical_flavor_notes = ARRAY[
    'Cocoa', 'Toasted nut', 'Brown sugar', 'Caramel',
    'Prune', 'Fig',
    'Moderate malic-to-citric acidity', 'Rounder body'
  ]::TEXT[],
  common_pitfalls = ARRAY[
    'Robusta residue surfaces as papery / rubbery / vegetal when underdeveloped',
    'Extended roast pushes into commodity character',
    'Below 1200m tends toward flat cup',
    'Drier extraction amplifies any Robusta-derived harshness'
  ]::TEXT[]
WHERE id = '29817e43-bd4a-4517-92c8-11f3b4c3ffdb';

-- ==================================================================
-- 4. Caturra × Timor Hybrid lineage -> Castillo
-- ==================================================================
UPDATE cultivars
SET
  typical_origins = ARRAY[
    'Colombia (exclusively - Huila, Antioquia, Cauca, Nariño, Risaralda, Quindío)'
  ]::TEXT[],
  limiting_factors = ARRAY[
    'Slightly less aromatic intensity than Caturra',
    'Quality varies with microclimate and altitude',
    'Requires >1400m for clean cup',
    'Robusta-derived residue possible at lower elevations'
  ]::TEXT[],
  common_processing_methods = ARRAY[
    'Washed', 'Natural', 'Honey', 'Anaerobic',
    'Lactic ferment', 'Yeast-inoculated'
  ]::TEXT[],
  typical_flavor_notes = ARRAY[
    'Red apple', 'Caramel', 'Brown sugar', 'Cocoa',
    'Plum', 'Peach', 'Mild mandarin',
    'Moderate body'
  ]::TEXT[],
  common_pitfalls = ARRAY[
    'Below-elevation reads flat and papery',
    'Extended roasts muddy the moderate acidity',
    'Can feel competent but unexciting without experimental processing',
    'Co-ferment lots sometimes overpower native cultivar character'
  ]::TEXT[]
WHERE id = '677530f4-916f-4115-9e72-1ce21b81806b';

-- ==================================================================
-- 5. JARC selection lineage -> 74158
-- ==================================================================
UPDATE cultivars
SET
  typical_origins = ARRAY[
    'Ethiopia (Sidama, Yirgacheffe, Guji, West Arsi, Bench Sheko, Kaffa)'
  ]::TEXT[],
  limiting_factors = ARRAY[
    'Geographic restriction to Ethiopian origin',
    'Narrow elevation range for peak expression (~1800-2200m)',
    'Some stress-disease sensitivity outside native climate',
    'Low commercial yield relative to modern hybrids'
  ]::TEXT[],
  common_processing_methods = ARRAY[
    'Washed', 'Natural', 'Honey', 'Anaerobic'
  ]::TEXT[],
  typical_flavor_notes = ARRAY[
    'Jasmine', 'Lavender',
    'Bergamot', 'Lemon',
    'Peach', 'Apricot',
    'Black tea', 'Earl Grey',
    'Honeyed sweetness', 'Delicate body'
  ]::TEXT[],
  common_pitfalls = ARRAY[
    'Narrow roast window - tips to green/vegetal if underdeveloped',
    'Flattens florals if over-roasted',
    'Best in short-development profiles',
    'Extraction demands clarity (no bypass, clean pour-over)',
    'Heavy fermentation can bury native delicacy'
  ]::TEXT[]
WHERE id = '08a53114-31b2-4938-94d8-98fe745d15d2';

-- ==================================================================
-- 6. Maragogype × Caturra lineage -> Maracaturra
-- ==================================================================
UPDATE cultivars
SET
  typical_origins = ARRAY[
    'Nicaragua (Matagalpa, Jinotega primary)',
    'Guatemala', 'Honduras', 'El Salvador'
  ]::TEXT[],
  limiting_factors = ARRAY[
    'Low yield',
    'Large bean size slows pulping and drying',
    'High cup variance lot-to-lot',
    'Coffee berry disease sensitive',
    'Requires >1400m for structural density',
    'Specialty-only commercial viability'
  ]::TEXT[],
  common_processing_methods = ARRAY[
    'Washed', 'Natural', 'Honey', 'Anaerobic', 'Extended fermentation'
  ]::TEXT[],
  typical_flavor_notes = ARRAY[
    'Dense syrupy sweetness',
    'Passion fruit', 'Pineapple',
    'Peach',
    'Red wine character',
    'Honey', 'Cocoa richness',
    'Full round body'
  ]::TEXT[],
  common_pitfalls = ARRAY[
    'Large bean complicates even roast development (tipping / scorching risk)',
    'Underdevelopment reads starchy / vegetal',
    'High variance means some lots underdeliver the flagship profile',
    'Overdevelopment flattens the signature syrupy weight'
  ]::TEXT[]
WHERE id = 'bfd3f87f-be8a-4a66-807d-3136376aec1f';

-- ==================================================================
-- 7. Mundo Novo × Caturra lineage -> Catuaí
-- ==================================================================
UPDATE cultivars
SET
  typical_origins = ARRAY[
    'Brazil (Cerrado Mineiro, Mogiana, Sul de Minas, Espírito Santo)',
    'Honduras', 'Costa Rica', 'Guatemala', 'Nicaragua'
  ]::TEXT[],
  limiting_factors = ARRAY[
    'Cup quality plateaus at origin - workhorse production variety',
    'Moderate disease resistance',
    'Yield-over-quality breeding focus',
    'Needs >1000m for decent cup, peaks ~1400-1600m'
  ]::TEXT[],
  common_processing_methods = ARRAY[
    'Natural', 'Pulped Natural', 'Honey', 'Washed', 'Anaerobic'
  ]::TEXT[],
  typical_flavor_notes = ARRAY[
    'Milk chocolate', 'Brown sugar', 'Cocoa nib',
    'Almond', 'Hazelnut',
    'Caramel', 'Orange',
    'Moderate body', 'Low-to-moderate acidity'
  ]::TEXT[],
  common_pitfalls = ARRAY[
    'Over-roasted drifts into generic commodity character',
    'Washed-only treatment flattens native sweetness strengths',
    'Lower-elevation Catuaí lacks structure',
    'Commonly blended into commodity-tier lots where origin specificity is lost'
  ]::TEXT[]
WHERE id = '73c4bd41-047e-4ee3-b920-9da9f0a81e02';

-- ==================================================================
-- 8. Pacas × Maragogype lineage -> Pacamara
-- ==================================================================
UPDATE cultivars
SET
  typical_origins = ARRAY[
    'El Salvador (origin)',
    'Honduras', 'Nicaragua', 'Guatemala',
    'Panama, Costa Rica (lesser)'
  ]::TEXT[],
  limiting_factors = ARRAY[
    'Very low yield',
    'High variance across lots',
    'Large bean size complicates drying',
    'Elevation-picky (best >1400m)',
    'Expensive to produce - specialty-only viability'
  ]::TEXT[],
  common_processing_methods = ARRAY[
    'Washed', 'Natural', 'Honey', 'Anaerobic', 'Extended fermentation'
  ]::TEXT[],
  typical_flavor_notes = ARRAY[
    'Peach', 'Apricot', 'Nectarine',
    'Red wine', 'Dark fruit',
    'Lychee', 'Passion fruit',
    'Jasmine',
    'Dense syrupy body', 'Complex layered sweetness'
  ]::TEXT[],
  common_pitfalls = ARRAY[
    'Large bean produces uneven roast development (tipping / scorching)',
    'Underdevelopment reads grassy / starchy',
    'Contest-bid pricing inflates quality expectations',
    'Heavy process-forward treatments can bury native complexity under fermentation character'
  ]::TEXT[]
WHERE id = '8cf189aa-2b25-4abf-8f22-5bc065a49f5c';

-- ==================================================================
-- 9. Multi-parent hybrid lineage -> Mokkita (partial - 2 fields only)
-- ==================================================================
UPDATE cultivars
SET
  limiting_factors = ARRAY[
    'Limited commercial distribution',
    'Small-scale breeding origin',
    'Cup behavior varies by parent-line selection',
    'Young variety with limited long-term performance data',
    'Ideal elevation range still being characterized'
  ]::TEXT[],
  common_pitfalls = ARRAY[
    'Narrow data volume means roast-window bounds are still being learned',
    'Early adopters may over-generalize from one lot',
    'Processing experimentation can obscure native cultivar signal',
    'Market confusion with trademark / marketing names'
  ]::TEXT[]
WHERE id = '2109b2fc-3724-4ce2-b0cd-efb62a8a502b';

COMMIT;
