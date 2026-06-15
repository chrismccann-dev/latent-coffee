# Roaster Reference - Brewing Lessons

Per-roaster brewing lessons + house-style cards. Use this reference during the Coffee Brief (Step 1 of [BREWING.md](BREWING.md)). The strategy tag on each roaster tells you whether your default Clarity-First approach is appropriate or whether you should expect a different extraction strategy from the start.

Split out of BREWING.md SECTION 2 on 2026-04-29 (Sprint 2.4) so each roaster card section-anchors cleanly under MCP for `propose_doc_changes` Tool support. This is the **lessons / brew-pattern** doc - distinct from [docs/taxonomies/roasters.md](docs/taxonomies/roasters.md), which is the canonical registry mirror with strategy tag + structural metadata.

## Strategy Tag Legend

| **Tag**               | **Meaning**                                                                                    |
|-----------------------|------------------------------------------------------------------------------------------------|
| **CLARITY-FIRST**     | Compatible with your default approach. Start at 6.8-6.5 with low agitation.                    |
| **BALANCED**          | Moderate extraction. Start at 6.5-6.3, moderate agitation.                                     |
| **BALANCED to FULL**  | Extraction-forward. Treat as Balanced Intensity minimum; many lots need Full Expression.       |
| **FULL EXPRESSION**   | Intentionally pushes high extraction. Start at 6.3-6.0, higher temp, more agitation.           |
| **VARIES**            | Strategy depends on the specific coffee's process and variety. Check Process Signal Table.     |
| **ASSESS PER COFFEE** | No guide found or too small/new. Let process/variety drive strategy. Start Balanced Intensity. |

---

## Moonwake Coffee Roasters

★ **VARIES**

|                         |                                                                                                                                                                       |
|-------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | San Francisco, CA (local)                                                                                                                                             |
| **Strategy Tag**        | VARIES                                                                                                                                                                |
| **EG-1 Starting Range** | 6.6-6.4 for most. Processed lots: consider 6.4-6.2 with higher temp.                                                                                                  |
| **House Style**         | Clarity-to-Balanced. V60 focused. 15g / 240g / 1:16. Multiple pours with bed exposure. Notes that lighter temps suit processed lots.                                  |
| **Brew Guide**          | Official - moonwakecoffeeroasters.com/pages/brew-guide                                                                                                                |
| **Notes**               | Two confirmed processed-lot patterns. (1) Heavy anaerobic washed (e.g. Jeferson Motta) - Full Expression at EG-1 6.0 / 98°C confirmed. (2) Yeast-inoculated lots (Project One Light Peach Oolong / Blue Iris, Sebastian Ramirez El Placer) - Balanced Intensity at EG-1 6.3 across all three lots; temperature ceiling varies by finishing process (anaerobic natural 96°C, anaerobic honey 95°C, white honey 95°C). Don't assume Full Expression on yeast-inoculated lots; their roaster page often lands at house style guidance. Café reference available here. |

**Brew-guide signal validated on washed lots (one data point).** Moonwake's house brew guide states '90-94°C for light roast (lower temps for processed coffees, higher temps for washed coffees).' On Fernando Bocanegra El Oasis 60hr Washed Gesha (Tolima, 2150 masl), a single-variable temperature test from 94°C -> 96°C produced more sweetness density and muscat clarity at cool window with no drying tail, no floral compression. Take Moonwake's 'higher temps for washed coffees' guidance seriously on clean washed Gesha - default to the upper edge of the Clarity-First temp range (95-96°C), not the middle (93-94°C). Brew ID: ae628408-0786-4611-8766-92cd3c6b6686.

**Pepe Jijón Sidra Wave Hybrid - Extraction Push first-confirmed (Imbabura, Ecuador, 1515m).** Producer-named hybrid natural-then-honey process (4-day cold-tank rest + 12-day natural dry + rehydrate-and-depulp + 3-day cold-room honey finish). On a Sidra (Ethiopian-landrace lineage, transparency-driven), variety signal dominates the novel process flag - confirmed Extraction Push at EG-1 5.8 / 95°C / 4-pour Melodrip on Orea v4 + Sibarist FLAT FAST / 15g / 240g (1:16). Pattern matches the rest of the Finca Soledad archive on Moonwake (TyOxidator and Sidra Cold Fermented Washed DRD both Clarity-First-adjacent on variety): Pepe Jijón's lots are variety-driven regardless of process novelty - the cold-room control across all stages prevents the process from accumulating fermentation density that would push toward Balanced or Full. **Tasting note framing for Pepe Jijón aromatic-transparency lots:** what initially reads as 'drying tail' in under-developed extractions is rose aromatic that hasn't extracted into the cup as a recognizable aromatic; with proper pour structure, rose extracts as rose. Future Pepe Jijón Sidra brews showing 'drying without sweetness' should be diagnosed as pour-structure issues, not grind/temp. Brew ID: 15c67c4a-9bd1-4181-be52-2cd074ac2e8c. Aroma Capture variant (bloom + Pour 1 application): brew ID b27afe61-0ca0-4cbd-8e25-d460cbead9ac - real but modest amplitude lift, peak expression shifts warmer to ~48-50°C from the non-modifier reference's 45°C peak.

## Dak Coffee Roasters

★ **FULL EXPRESSION**

|                         |                                                                                                                                                                                                               |
|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Netherlands                                                                                                                                                                                                   |
| **Strategy Tag**        | FULL EXPRESSION                                                                                                                                                                                               |
| **EG-1 Starting Range** | 6.4-6.2                                                                                                                                                                                                       |
| **House Style**         | High extraction, high temperature, long brew. 15g / 270g / 1:18. 99°C. 75g bloom for 60s. Two pours. Target 4:00 total.                                                                                       |
| **Brew Guide**          | Reddit thread (from Dak directly) - reddit.com/r/pourover/comments/1j89aw7                                                                                                                                    |
| **Notes**               | Dak roasts competition-adjacent and exotic lots. Their 99°C / 4 minute target is a strong signal. Default Clarity-First will under-extract. Start Balanced Intensity minimum; many lots want Full Expression. **Temperature management note (confirmed: Apricoast Ethiopia Anaerobic Washed):** kettle ON base throughout - do NOT apply the standard Full Expression off-base taper on the final pour. DAK's roast is engineered for sustained high heat; off-base management produces under-extraction even at 6.0 grind. This is a DAK-specific exception to the general Full Expression temperature-taper protocol. |

## Sey Coffee

★ **FULL EXPRESSION**

|                         |                                                                                                                                                                         |
|-------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Brooklyn, NY                                                                                                                                                            |
| **Strategy Tag**        | FULL EXPRESSION                                                                                                                                                         |
| **EG-1 Starting Range** | 6.2-6.0                                                                                                                                                                 |
| **House Style**         | No official guide. Uses Aeropress in-café. Collab recipe: 20g / 340g / boiling water. Grind as fine as possible. Long bloom (60s), Melodrip, multiple aggressive spins. |
| **Brew Guide**          | No official guide. Reddit thread + Fellow collab recipe.                                                                                                                |
| **Notes**               | Sey targets very high EY (24%+). Their boiling water temp is intentional. Approach every Sey coffee expecting Full Expression. Rest 3-4 weeks minimum before brewing.   |

## Hydrangea Coffee

★ **CLARITY-FIRST to BALANCED**

|                         |                                                                                                                                                                                                                                                                  |
|-------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Berkeley, CA                                                                                                                                                                                                                                                     |
| **Strategy Tag**        | CLARITY-FIRST to BALANCED                                                                                                                                                                                                                                        |
| **EG-1 Starting Range** | 6.7-6.5 for washed. 6.6-6.4 for naturals.                                                                                                                                                                                                                        |
| **House Style**         | V60, 15g / 250g. 93°C / ~50ppm soft water. 4-pour structure: 50g / 130g / 190g / 250g. Target 2:30.                                                                                                                                                              |
| **Brew Guide**          | Official - hydrangea.coffee/pages/faq                                                                                                                                                                                                                            |
| **Notes**               | Close to default approach. Finca El Paraíso thermal shock lots: start 6.4 / 94°C; push grind to 6.3 first (hold temp at 94°C) if thin. Push temperature to 95°C only for rose-forward targets (Letty Bermúdez profile) - non-rose lots over-steep into bitter tea phenolics at 95°C. Cooling behavior is flavor-target-driven, not lot-driven: rose-forward lots evaluate near 40°C; aromatic-floral lots without rose (Luna Bermúdez egg waffle/blueberry/oolong) peak in the standard 45-50°C window. Three confirmed El Paraíso lots: Letty Gesha 6.3/95°C (rose), Luna Gesha 6.3/94°C (egg waffle/blueberry/oolong), Lychee Castillo 6.4/94°C (lighter floral). Counterflow roasting style (very light, fast structure). |

## Leaves Coffee

★ **CLARITY-FIRST**

|                         |                                                                                                                                                                                                    |
|-------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Japan                                                                                                                                                                                              |
| **Strategy Tag**        | CLARITY-FIRST                                                                                                                                                                                      |
| **EG-1 Starting Range** | 6.8-6.7                                                                                                                                                                                            |
| **House Style**         | V60, 15g / 240g / 92°C. 4 pours: 40g bloom at 0:00, +110g at 0:30, +50g at 1:10, +40g at 1:40. Target 2:15-2:30. No agitation.                                                                     |
| **Brew Guide**          | Official printed guide (confirmed first-party).                                                                                                                                                    |
| **Notes**               | 40g bloom (2.7:1 ratio) is notably lower than typical. Conservative, clarity-first style. Start 6.7-6.8 / 92°C following their pour structure before adjusting. If thin, coarsen rather than fine. |

## Strait Coffee

★ **BALANCED / VARIES**

|                         |                                                                                                                                                                                    |
|-------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | San Jose, CA (local - farmers market Sunday)                                                                                                                                       |
| **Strategy Tag**        | BALANCED / VARIES                                                                                                                                                                  |
| **EG-1 Starting Range** | Switch: 6.4-6.2. V60: 6.6-6.5.                                                                                                                                                     |
| **House Style**         | Switch recipe: 15g / 250g / 95°C. Split dose method. Bloom 30g / 40s then close lever. Open at 2:30, finish 4:00. V60: standard parameters.                                        |
| **Brew Guide**          | V60 page + Switch recipe shared directly.                                                                                                                                          |
| **Notes**               | Focuses on terroir expression. Switch recipe is immersion-forward. For percolation brewers, Balanced Intensity is safer default than Clarity-First, especially for processed lots. |

## The Picky Chemist

★ **FULL EXPRESSION**

|                         |                                                                                                                                                                                                       |
|-------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Unknown                                                                                                                                                                                               |
| **Strategy Tag**        | FULL EXPRESSION                                                                                                                                                                                       |
| **EG-1 Starting Range** | 6.2-6.0 (their ~450µm target; EG-1 compensates via temp/agitation)                                                                                                                                    |
| **House Style**         | V60-02, Cafec Abaca. 15g / 250g / 95°C. Soft water. Grind ~450µm. Target 3:30-3:50. Bloom 60g / 50s rest. High extraction intent - 24%+ EY targets.                                                   |
| **Brew Guide**          | Embedded on product pages.                                                                                                                                                                            |
| **Notes**               | Targets very high extraction. Their 450 µm target is unachievable on EG-1 - compensate via temp (boiling), agitation, T-92 filter, and brew time. Treat all Picky Chemist coffees as Full Expression. |

## Flower Child Coffee

★ **FULL EXPRESSION**

|                         |                                                                                                                                                          |
|-------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Oakland, CA                                                                                                                                              |
| **Strategy Tag**        | FULL EXPRESSION                                                                                                                                          |
| **EG-1 Starting Range** | 6.2-6.0                                                                                                                                                  |
| **House Style**         | V60, Cafec T-92, Melodrip. 16g / 288g / 1:18+. Boiling water (210-211°F / 99°C). Medium-fine. Target 4-5+ min. Bloom 2-3x coffee weight. 25-27% EY goal. |
| **Brew Guide**          | Official - flowerchildcoffee.com/blogs/brewing-tips-guides-extrapolation/brew-guides                                                                     |
| **Notes**               | Among most extraction-forward roasters. T-92 filter + boiling water + 5 min + 25-27% EY. Full Expression from the start.                                 |

## Substance Café

★ **BALANCED to FULL**

|                         |                                                                                                                                                      |
|-------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Paris, France                                                                                                                                        |
| **Strategy Tag**        | BALANCED to FULL                                                                                                                                     |
| **EG-1 Starting Range** | 6.5-6.3                                                                                                                                              |
| **House Style**         | V60-01, Cafec Abaca. 12g / 200g / ~91°C. 90GH / 40KH water. 5 pours with big horizontal spirals to bed edge. Target 3:00-3:15. High agitation.       |
| **Brew Guide**          | Official - substancecafe.com/our-techniques/                                                                                                         |
| **Notes**               | One of the most deliberate technical roasters. High-agitation + specific mineral water are intentional extraction tools. Balanced Intensity minimum. |

## Picolot (Brian Quan)

★ **VARIES**

|                         |                                                                                                                                                                                                                          |
|-------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Queens, NY                                                                                                                                                                                                              |
| **Strategy Tag**        | VARIES (Clarity-First on clean washed -> Full Expression on processed/loud)                                                                                                                                              |
| **EG-1 Starting Range** | VARIES by lot. Processed/loud lots (e.g. Garrido Panama Mokka Natural): 6.3-6.0 / 95°C declining / Full Expression. Clean washed Panama Gesha (e.g. Lovely Vuelta DRD): 6.6 / 92°C / Clarity-First. Assess the specific coffee's process and variety - do not assume Full Expression across Picolot's full catalog. |
| **House Style**         | Orea Z1. 15g / 250g / 95°C (natural decline). Diluted Third Wave Water 1:3-1:4. 3-pour: fast/fast/slow structure. Target 2:30-3:00. Grind ref: ~300 µm on M98V. House recipe is a starting point for processed lots; clean washed lots want Clarity-First parameters instead.                                                          |
| **Brew Guide**          | Official YouTube video.                                                                                                                                                                                                  |
| **Notes**               | Comp-edition project led by Brian Quan; Stronghold S7X competition-style roasting. Coffees historically described as 'loud,' but this characterization is process-dependent - washed Panama Gesha lots present transparency-driven, not extraction-forward, and anaerobic-natural Panama Gesha lots want Suppression rather than Full Expression. Fast/fast/slow: acidity then sweetness then clarity (applies to processed/loud lots; Clarity-First lots may want Dial 5 contact time through Pours 1-2 at office 15g). Orea Z1 not in inventory - translate to Orea Glass/Porcelain, April, Kalita 155, or SWORKS at office. Kettle-off temp management (95°C declining) smooths finish on processed lots; clean washed lots use steady 92°C kettle-on; Suppression-strategy anaerobic-natural lots also acceptable at 92°C kettle-on (Altieri NASD confirmed). **Garrido natural template confirmed across two data points on the SWORKS at the office** (fast/fast/slow Dial 7 -> 7 -> 5, 95°C kettle-off, 15g / 250g 1:16.7): Mokka Natural (Emerald PL#015) at EG-1 6.0; Pacamara Natural (Loud Giants PL#16) at EG-1 6.1. Bean-density delta is one click coarser for Pacamara; both peak cool (<50°C) with full label profile only emerging in the cool window. House fast/fast/slow valve structure is correct for straight Garrido naturals; do not invert. **Altieri NASD template (Panama anaerobic natural) confirmed at the office** (Suppression, slow/slow with no open finish, 92°C kettle-on): Comp Edition Altieri Gesha CHOMBI Natural Dry Fermentation (PL#20) at EG-1 6.5 / SWORKS Dial 0 bloom -> Dial 6 main pours / xBloom Premium Paper / 15g / 240g (1:16) / 3:00-3:30. **Simba Cold Room Natural template (Ethiopian heirloom green, Garrido family Panama processing) confirmed at the office** (Suppression, slow/slow/slow with no open finish, 93°C kettle-on - +1°C from Altieri NASD): Simba's Comp Edition Ethiopia Heirloom Cold Room Natural at EG-1 6.5 / SWORKS Dial 0 bloom -> Dial 6/6/6 main pours / xBloom Premium Paper / 15g / 240g (1:16) / 3:30-4:00. Two key distinctions from the Altieri NASD template: (1) cold-room dehydration wants +1°C (93°C kettle-on instead of 92°C) - this lot's grassy/raw under-extracted finish at 92°C/Dial 6/6/6 cleared with temperature push but resisted valve restriction; (2) cold-room dehydration has narrower valve tolerance - Dial 5/5/6 at 92°C over-extracted phenolic bitter + roast attack at warm window (Brew 2), while still leaving the under-extracted finish from Brew 1 unresolved. Selectivity ceiling not yield ceiling on the valve side. Treats cold-room dehydration as a separate sub-lane within Suppression, distinct from anaerobic slow-dry. The Altieri NASD and Simba Cold Room templates are the third and fourth Picolot office reference recipes and live in a separate strategy lane from both the Garrido raised-bed naturals (Full Expression, fast/fast/slow Dial 7->7->5) and the Janson 1010 yeast-anaerobic natural (Hybrid Sequential, slow/slow/open Dial 0->5->7). Four Picolot lot-type templates now coexist: Garrido raised-bed natural = Full Expression, Lovely Vuelta washed DRD = Clarity-First, Altieri NASD anaerobic natural = Suppression at 92°C/Dial 6, Simba Cold Room Natural = Suppression at 93°C/Dial 6 (cold-room dehydration sub-lane). Drying tannic edge on Simba finish reads as lot-level character of cold-room concentration, not extraction defect. **Cooling signature:** all comp-edition lots brewed to date gain significant complexity on cooling (55°C -> 45°C window) - evaluate before locking a verdict. Cool-window discipline now confirmed across three process classes (raised-bed natural, washed DRD, anaerobic natural) - the S7X cooling signature applies regardless of process. |

## Big Sur Coffee

★ **FULL EXPRESSION**

|                         |                                                                                                       |
|-------------------------|-------------------------------------------------------------------------------------------------------|
| **Location**            | Big Sur, CA                                                                                           |
| **Strategy Tag**        | FULL EXPRESSION                                                                                       |
| **EG-1 Starting Range** | 6.4-6.2                                                                                               |
| **House Style**         | V60. 1:17. 99°C. Medium-fine. Extremely light roast profile.                                          |
| **Brew Guide**          | YouTube video (no official guide).                                                                    |
| **Notes**               | 99°C + extremely light roast = maximum extraction intent. Will read thin/sour at Clarity-First temps. |

## Shoebox Coffee

★ **BALANCED**

|                         |                                                                                                                                                                                                                                                                              |
|-------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Unknown                                                                                                                                                                                                                                                                      |
| **Strategy Tag**        | BALANCED                                                                                                                                                                                                                                                                     |
| **EG-1 Starting Range** | 6.5-6.3                                                                                                                                                                                                                                                                      |
| **House Style**         | Primary: UFO brewer, 1:16.67, 95°C. Secondary: V60, 1:16.7, 92°C.                                                                                                                                                                                                            |
| **Brew Guide**          | YouTube video.                                                                                                                                                                                                                                                               |
| **Notes**               | UFO as primary at 95°C is higher than Clarity-First default. Secondary V60 at 92°C used to accentuate brightness. Lean Balanced Intensity. Your archive now has multiple Shoebox washed lots confirmed at Clarity-First - strategy tag may need re-evaluation toward Varies. |

## Scenery Coffee

★ **VARIES**

|                         |                                                                                                                                                                                                                                |
|-------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | London, UK                                                                                                                                                                                                                     |
| **Strategy Tag**        | VARIES                                                                                                                                                                                                                         |
| **EG-1 Starting Range** | Washed / lightly processed: 6.6-6.4. Anoxic naturals: 6.0 confirmed (Pikudo's Rosado).                                                                                                                                         |
| **House Style**         | Roasts lighter than Nordic but slightly more developed. House recipe: low-bypass flat-bottom, long bloom (1 min), pulse pours, no agitation. 62-64g/L. 92-96°C.                                                                |
| **Brew Guide**          | Official - scenery.coffee + per-coffee lot archive pages (check these before brewing).                                                                                                                                         |
| **Notes**               | Always check lot archive page before brewing. House guide conservative - anoxic naturals needed Full Expression despite their restrained guide. Washed lots compatible with Clarity-First to Balanced. Rest 3-4 weeks minimum. |

## Luminous Coffee

★ **FULL EXPRESSION**

|                         |                                                                                                                                             |
|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Unknown                                                                                                                                     |
| **Strategy Tag**        | FULL EXPRESSION                                                                                                                             |
| **EG-1 Starting Range** | 6.2-6.0                                                                                                                                     |
| **House Style**         | 17g / 288g / 1:17. 93°C. 5 pours x 50g. Target 3:30. Grind: 490-575µm D50.                                                                  |
| **Brew Guide**          | Official - loveluminous.coffee/pages/coffee-extraction-calculator                                                                           |
| **Notes**               | Distinctive in providing a specific µm target - 490-575µm is a real extraction signal. 5-pour pulse with 17g dose = Full Expression intent. |

## Subtext Coffee

★ **BALANCED to FULL**

|                         |                                                                                                                                                                        |
|-------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Unknown                                                                                                                                                                |
| **Strategy Tag**        | BALANCED to FULL                                                                                                                                                       |
| **EG-1 Starting Range** | 6.4-6.2 for V60 and Switch. 6.5-6.3 for Kalita/Orea.                                                                                                                   |
| **House Style**         | Three recipes: V60 (16g/265g/97°C, TDS 1.41-1.45%, EY 21-21.7%), Switch (16g/240g/97°C, EY 21.9-22.7%), Kalita/Orea (14g/230g/96°C, EY 20.8-21.85%).                   |
| **Brew Guide**          | Official - three recipes provided.                                                                                                                                     |
| **Notes**               | Most data-rich roaster on this list. 97°C across all recipes. EY targets meaningfully above Clarity-First range. Kalita/Orea recipe directly relevant to office setup. |

## September Coffee

★ **BALANCED to FULL**

|                         |                                                                                                                                                                                           |
|-------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Unknown                                                                                                                                                                                   |
| **Strategy Tag**        | BALANCED to FULL                                                                                                                                                                          |
| **EG-1 Starting Range** | 6.3-6.0 for 3-pour track                                                                                                                                                                  |
| **House Style**         | Extra-light specialists. 3-pour track (uniform grinders): 40-50g bloom, two main pours. 93-98°C depending on rest. ZP6 4.5-5.0 reference. Heavy agitation.                                |
| **Brew Guide**          | Reddit thread (roaster-sourced).                                                                                                                                                          |
| **Notes**               | Roasts extremely light and compensates with temperature (up to 98°C rested) and heavy agitation. Do not apply Clarity-First defaults. Temperature should track rest time per their guide. |

## normlppl/minmax

★ **CLARITY-FIRST**

|                         |                                                                                                                                                                 |
|-------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Unknown (small independent)                                                                                                                                     |
| **Strategy Tag**        | CLARITY-FIRST                                                                                                                                                   |
| **EG-1 Starting Range** | 6.8-6.6                                                                                                                                                         |
| **House Style**         | V60 01, Cafec Abaca. 12.5g / 200g / 91-93°C. 5 pours of 40g every ~30s. Target 2:45-4:00. Coarse grind. Extensive rest recommended (2-5 weeks, up to 3 months). |
| **Brew Guide**          | Wayback Machine archived guide.                                                                                                                                 |
| **Notes**               | Deeply clarity-oriented. Lower dose (12.5g) + long rest = patience over intensity. Rest timing is important.                                                    |

## Tim Wendelboe

★ **CLARITY-FIRST**

|                         |                                                                                        |
|-------------------------|----------------------------------------------------------------------------------------|
| **Location**            | Oslo, Norway                                                                           |
| **Strategy Tag**        | CLARITY-FIRST                                                                          |
| **EG-1 Starting Range** | 6.8-6.5                                                                                |
| **House Style**         | Precision pour-over. Ultra-light Nordic roasts. Explicit clarity-first intent.         |
| **Brew Guide**          | Official - timwendelboe.no                                                             |
| **Notes**               | Canonical Nordic clarity roaster. Reference point for precision clarity-first brewing. |

## April Coffee

★ **CLARITY-FIRST**

|                         |                                                                                                                                 |
|-------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Copenhagen, Denmark                                                                                                             |
| **Strategy Tag**        | CLARITY-FIRST                                                                                                                   |
| **EG-1 Starting Range** | 6.8-6.5                                                                                                                         |
| **House Style**         | Named after the April Brewer. Recipes designed around that brewer's behavior. Per-coffee recipes available on site.             |
| **Brew Guide**          | Official - aprilcoffeeroasters.com/pages/coffee-inf-recipes                                                                     |
| **Notes**               | Retrieve per-coffee recipe before brewing. Note April Brewer at office drains fast (~2:30) - adjust pour structure accordingly. |

## Glitch Coffee

★ **BALANCED**

|                         |                                                                                                            |
|-------------------------|------------------------------------------------------------------------------------------------------------|
| **Location**            | Tokyo, Japan                                                                                               |
| **Strategy Tag**        | BALANCED                                                                                                   |
| **EG-1 Starting Range** | 6.5-6.4                                                                                                    |
| **House Style (my EG-1)** | 260g / 86°C / 15g. Bloom 70g, stir 3x. Pour 1: 0:30 to 140g. Pour 2: 1:20, 50g. Target 2:30.            |
| **Official Recipe**     | Origami + Kalita Wave + gold flow-control insert. 14.5g / 260g water / 86-90°C. Two 30g blooms (0:00, 0:20), two 100g pours (0:50, ~1:30). Stop at ~200-220g beverage YIELD (pull carafe early while it still drips) - real ratio ~1:16, not the ~1:18 it looks like. Target 2:30-2:45, ~1.5 TDS. Origami insert subs: April dripper or a 49-51mm puck screen. |
| **Brew Guide**          | Official (website + 2026 Osaka field transcript).                                                          |
| **Notes**               | 86°C is standout signal - deliberately low; the developed-light roast (Agtron ~94) makes low temp + high contact safe rather than under-extracting. If cups taste flat, step up to 88-90°C before adjusting grind. The yield-cutoff is the trap: drain the full 260g and the cup goes weak/thin. Pre-wet the filter. Fruit-intensity house (naturals/anaerobics/co-ferments/infused, expressive Geisha for washed); optional chilling ball helps loud fruity coffees, hurts nutty/caramel profiles. |

## Tanat Coffee

★ **CLARITY-FIRST**

|                         |                                                                                                                                            |
|-------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Unknown                                                                                                                                    |
| **Strategy Tag**        | CLARITY-FIRST                                                                                                                              |
| **EG-1 Starting Range** | 6.8-6.6 for V60. 6.7-6.5 for Orea.                                                                                                         |
| **House Style**         | V60: 12g / 200g / 92°C, Cafec Abaca+. Orea: 15g / 240g / 94°C, flat-bottom filter. Both target ~2:30. Controlled even pours, no agitation. |
| **Brew Guide**          | Official - two recipe tracks on site.                                                                                                      |
| **Notes**               | Clearly clarity-first intent. Orea recipe references Sibarist flat filters - same as inventory. Start EG-1 6.6 / 94°C for Orea.            |

## Kurasu

★ **CLARITY-FIRST**

|                         |                                                                                                                                                                |
|-------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Kyoto, Japan                                                                                                                                                   |
| **Strategy Tag**        | CLARITY-FIRST                                                                                                                                                  |
| **EG-1 Starting Range** | 6.7-6.8                                                                                                                                                        |
| **House Style**         | V60, 15g / 240g / 92°C. Identical pour structure to Leaves Coffee Roasters. Low agitation by design. Explicit 'neutral baseline' recipe.                       |
| **Brew Guide**          | Official.                                                                                                                                                      |
| **Notes**               | Positions recipe explicitly as a low-agitation moderate-extraction baseline for comparing roasts. Useful as cross-roaster comparison tool against Leaves lots. |

## Prodigal Coffee

★ **BALANCED**

|                         |                                                                                                                |
|-------------------------|----------------------------------------------------------------------------------------------------------------|
| **Location**            | Unknown                                                                                                        |
| **Strategy Tag**        | BALANCED                                                                                                       |
| **EG-1 Starting Range** | 6.5-6.3                                                                                                        |
| **House Style**         | Links to Scott Rao's blog - no proprietary recipe. Technically grounded, process-aware philosophy.             |
| **Brew Guide**          | scottrao.com/blog                                                                                              |
| **Notes**               | Start Balanced Intensity and apply normal Coffee Brief process signal logic. No strong extraction push signal. |

## Datura Coffee

★ **BALANCED**

|                         |                                                                                                           |
|-------------------------|-----------------------------------------------------------------------------------------------------------|
| **Location**            | Unknown                                                                                                   |
| **Strategy Tag**        | BALANCED                                                                                                  |
| **EG-1 Starting Range** | 6.5-6.3                                                                                                   |
| **House Style**         | No direct brew guide. Paris-adjacent (Dayglow collab). Quality-focused positioning.                       |
| **Brew Guide**          | Referenced via Dayglow Coffee collab.                                                                     |
| **Notes**               | Insufficient data for strong signal. Start Balanced Intensity and be ready to pivot after the first brew. |

## Thankfully Coffee

★ **ASSESS PER COFFEE**

|                         |                                                                                                                           |
|-------------------------|---------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Unknown                                                                                                                   |
| **Strategy Tag**        | ASSESS PER COFFEE                                                                                                         |
| **EG-1 Starting Range** | 6.6-6.4 (Typica Mejorado/Sydra-adjacent lots)                                                                             |
| **House Style**         | No official guide. Sources Pepe Jijón lots. Third-party recipe for Typica Oxidator lot suggests clarity-oriented brewing. |
| **Notes**               | Given Pepe Jijón sourcing, expect variety-driven strategy. Variety can override process flag for Typica Mejorado/Sidra.   |

## Aviary

★ **ASSESS PER COFFEE**

|                         |                                                                                    |
|-------------------------|------------------------------------------------------------------------------------|
| **Location**            | Unknown                                                                            |
| **Strategy Tag**        | ASSESS PER COFFEE                                                                  |
| **EG-1 Starting Range** | 6.4-6.3 (anaerobic Ethiopian lots)                                                 |
| **House Style**         | No official guide. Sources anaerobic Ethiopian lots (Bekele Yutute).               |
| **Notes**               | No first-party guide. For anaerobic Ethiopian lots, Balanced Intensity as default. |

## Dongzhe

★ **CLARITY-FIRST**

|                         |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
|-------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Unknown (micro roaster; SF-adjacent per industry connection to Hydrangea)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| **Strategy Tag**        | CLARITY-FIRST                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| **EG-1 Starting Range** | 6.5 at 12.5g (confirmed across 5 brews at home). Primary dial is temperature, not grind: 93-94°C depending on process. Process-to-temp mapping at 12.5g / 200g / Hario V60 + CONE B3: washed = 93°C (Heritage Collection); NC climate-controlled natural = 93.5°C (HLE Valle 3NC); standard raised-bed natural = 94°C (Finca Sophia Grand Reserve Natural). Standard naturals want ~+0.5°C over NC drying at the same dose. |
| **House Style**         | Ultralight micro roaster (Steven), Substance-inspired. Small-pouch format: 12.5g / 200g (1:16). Label guide: V60 / ~21 clicks on his grinder / 92°C / 4 pours (30/70/70/30). Friends with Hydrangea's Bill; shares lots (incl. Hacienda La Esmeralda). Direct-ship through coffee-with-dongze.myshopify.com.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Brew Guide**          | Per-pouch label (QR code + printed recipe). No centralized brew guide page; per-coffee label is the source.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Notes**               | Confirmed CLARITY-FIRST across 6 brews - all at 12.5g / 200g / Hario V60 + Sibarist CONE B3 at home: Longboard Misty Mountain; Finca Nuguo Natural (94°C, standard raised-bed natural); Finca Sophia Heritage Washed (93°C); HLE Valle 3NC Natural (93.5°C, NC climate-controlled drying); Finca Sophia Grand Reserve Natural (94°C, standard raised-bed natural); Best of Panama 25' Finca Nuguo GW-03 Washed (93°C, BOP-mix Gesha). Key principle: the label's 92°C under-extracts at 12.5g bed depth - correct upward. Process-to-temp ladder at 12.5g / 200g / Hario V60 + CONE B3: washed = 93°C (now 2 data points: Heritage Collection single-microlot + GW-03 BOP-mix); NC climate-controlled natural = 93.5°C; standard raised-bed natural = 94°C. Standard naturals want ~+0.5°C over NC drying at the same dose (one A/B data point: Valle 3NC vs Sophia Grand Reserve). Grind stays at 6.5 regardless of process - at 12.5g, coarser than 6.5 produces hollow body despite the Clarity-First strategy. Pulse-pour structure from the label guide (collapsed to 3 pours on V60): 30g bloom -> 100g -> 170g -> 200g. Hario V60 + Sibarist CONE B3 is the confirmed vehicle; stop experimenting with brewer on Dongze small-format pouches. **Filter precision matters at 6.5+ grind.** Re-brewing Longboard Misty Mountain at 6.6 with B3 (rather than the intended FAST Cone) landed Balanced-adjacent (heavier body, more bergamot/tannin tea, less aromatic separation) despite Clarity-First strategy and grind. Reinforces 6.5 as the canonical setting at this dose; for pure Clarity-First on delicate washed Gesha, Sibarist FAST Cone is the recommended path. **BOP-mix vs single-microlot washed:** GW-03 added the second 93°C washed data point and revealed a within-process density distinction. BOP-mix submissions (matrix-blended for cupping-point maximization, not transparency) cup denser and more textured than polished single-microlot washed lots at the same recipe - more body, more concentration, warmer-toned citrus (orange over a brown-tea base, vs lemon/bergamot over white tea on Heritage Collection). Same recipe handles both; body density is the green, not a grind signal - do not adjust on the basis of added body alone. Diagnostic: on a Dongzhe washed lot, warm-toned citrus + brown tea = denser cup expected; cool-toned citrus + white tea = polished cup expected. Seventh lot (hedged): Finca Nuguo 899 N-NS Natural - brewed once at the label-default 92°C and presented under-developed (subtle aroma, hidden attack, light brown tea structure, slight steepness on tail), exactly the failure mode the +1.5-2°C process-temp ladder was built to prevent. Single-pouch Christmas-set lot, no second-brew possible; 94°C revision proposed but not brewed. Treat the under-extraction as additional confirmation of the existing rule, not as a new sensory profile for this lot. Peak expression cool (45-50°C) on naturals. Washed BOP-mix lots (GW-03) hold appeal across the cooling curve - punchy and present warm, blended and cohesive cool - rather than peaking distinctly cool. Evaluate below 50°C on all Dongze naturals; washed BOP-mixes are forgiving across the curve. |

## Exposure Therapy Coffee

★ **ASSESS PER COFFEE**

|                         |                                                                                                                          |
|-------------------------|--------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Unknown                                                                                                                  |
| **Strategy Tag**        | ASSESS PER COFFEE                                                                                                        |
| **EG-1 Starting Range** | Assess per process/variety signal. Start Balanced Intensity.                                                             |
| **House Style**         | No brew guide found.                                                                                                     |
| **Notes**               | No documentation available. Small independent roasters often source competition-adjacent lots that want more extraction. |

## Archers Coffee

★ **ASSESS PER COFFEE**

> NOTE: "Archers Coffee" is not yet in `docs/taxonomies/roasters.md`. Logged as Sprint 2.4 follow-up to add to canonical registry. Section anchor preserved verbatim until then.

|                         |                                                                                                                                  |
|-------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Unknown                                                                                                                          |
| **Strategy Tag**        | ASSESS PER COFFEE                                                                                                                |
| **EG-1 Starting Range** | Assess per process/variety signal.                                                                                               |
| **House Style**         | No brew guide found. Sourced: Ethiopia Elto Elora Station River Flow Washed CF10 (74158 landrace).                               |
| **Notes**               | No documentation available. Apply Coffee Brief process/variety signal logic. Ethiopian washed landraces then Clarity-First default. |

## Colibri Coffee Roasters

★ **BALANCED**

|                         |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
|-------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Camano Island, WA                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Strategy Tag**        | BALANCED                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **EG-1 Starting Range** | 6.5-6.4 for honey/anaerobic lots; 6.7-6.5 for washed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **House Style**         | Small family-owned roaster. Single-origin focus. No public brew guide found.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Brew Guide**          | No public guide found. Note: kolibricoffee.com is a different Dutch roaster - do not confuse with colibricoffeeroasters.com.                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **Notes**               | First confirmed lot: Finca La Reserva Gesha Anaerobic Honey (Antioquia, Colombia) - Balanced Intensity confirmed across two sessions (April Glass dialing session + SWORKS first-pass). Reference recipe: EG-1 6.4 / 93°C kettle off-base / SWORKS Restricted (Dial 5) through Pour 1, crack to Half-Open (Dial 6) once bed drops in Pour 2 / 18g / 288g (1:16). Grind floor confirmed hard at 6.4 - 6.5 produced sour under-extracted acidity across both sessions. Temperature sensitivity within 1°C; prefer off-base natural taper over fixed high temp. Cup peaks cool at 40-50°C (optimal window); below 40°C slight sourness returns. Flavors: green apple, fresh grape, honeyed white tea. Anaerobic honey process amplifies florals without adding fermentation weight - does not push toward Full Expression. |

## Untold Coffee Lab

★ **VARIES**

|                         |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
|-------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Rochester, NY                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **Strategy Tag**        | VARIES                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| **EG-1 Starting Range** | Lot-dependent - treat each lot individually. No house recipe.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **House Style**         | Primarily a green-bean curator of auction/competition lots with roasted variants; production on Stronghold S7X/S9. No public brew guide. Roasted inventory vacuum-sealed and frozen. Sells BOTH green and roasted from untoldcoffeelab.com - discriminate by URL path, not domain, when determining self-roasted vs purchased.                                                                                                                                                                                                                                     |
| **Brew Guide**          | None published. Use lot / process / cultivar signal first; start clarity-first for clean washed/high-end Panama lots, then push only if body is missing.                                                                                                                                                                                                                                                                                                                                                                                                         |
| **Notes**               | **ROAST LEVEL IS NOT RELIABLE FROM FRAMING - CHECK AGTRON AT DOSE-OUT.** Untold's VARIES/clarity-to-balanced framing implies light/light-medium, but two archive lots came in materially darker than the framing suggested. (1) Brazil Fazenda Um Wush Wush Natural (WWNAT, 2026-05-22) - roasted MEDIUM; Balanced Intensity amplified developed-roast solubles into an oversteeped-black-tea wall; resolved via Hybrid Intensity-Clarity Split (first confirmed data point for that sub-form). (2) Panama Janson Pacamara Natural (Hacienda 491, 2026-05-31) - whole-bean Agtron 47.9, MEDIUM-DARK and visibly oily (darkest roast in the archive); the roast overrode both the Pacamara-density and the Dark Room Dried cold-room-dehydration signals; resolved via Hybrid Intensity-Clarity Split on the Switch (EG-1 6.8 / 88°C / Sibarist CONE FAST / tight late_cut ~205g of 250g; brew 24b39678). **Working rule for Untold lots: take an Agtron read at dose-out and let roast level lead strategy. On a medium/dark Untold lot, expect to need Hybrid clarity-recovery structure (Intensity-Clarity Split) to relocate roast ashiness beneath the fruit - single-mode Balanced/Clarity mechanics amplify the roast rather than tame it. At Agtron ~48 the roast-derived ashiness is inherent and not fully eliminable; the win is relocation, not elimination.** Both medium/dark-roast-tail data points so far are Untold lots - a strong roaster-level signal that Untold's roasted offerings skew more developed than their curator framing implies. |

## Newbery Street Coffee Roasters

★ **CLARITY-FIRST** (published) - but **roast-forward in practice** (Latent finding, see Notes)

|                         |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
|-------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Shirley, MA, USA                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Strategy Tag**        | CLARITY-FIRST (published) - Latent lots run roast-forward; budget for cool-window discipline or a Hybrid reach                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **EG-1 Starting Range** | 6.6 washed (cool-window). Honor Pack's published 1:14.7 ratio rather than defaulting to 1:16.                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| **House Style**         | Pack Katisomsakul (2024 US Brewers Cup Champion). OREA V4 Classic + Kalita Wave 185, 15g / 240g (1:16), 93-94°C published, short ~2:00 brew (50g bloom → pours to 110 / 180 / 240g). Flow-first rather than high-contact.                                                                                                                                                                                                                                                                                                                                          |
| **Brew Guide**          | Official (Website) - newberyst.com/blogs/coffee/how-to-brew-pour-over-coffee-with-newbery-street                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Notes**               | **Newbery Thai roasts are roast-forward by default** despite the 'simple, accessible' CLARITY-FIRST framing - Pack develops Thai coffees longer for sweetness, so they carry more developed-roast solubles than the published guide implies. Confirmed across two lots. **(1) Nawin Doi Chang Washed** (Thailand, Doi Chang / Mae Suai, Chiang Rai; Akha producer Nawin Yaesorkoo, 1,300-1,500 masl). Reference recipe: 15g / 220g (1:14.7 - honor Pack's ratio) / April Brewer Glass + April Paper / EG-1 6.6 / 91°C kettle on base / 4-pour to 40/100/165/220, 2:30-3:00 / home TWW Light Roast. Cup: milk chocolate tea, lemon, grapefruit, apple; peak 45-50°C. Viable temperature window is narrow (91°C ONLY) - 92°C surfaces roast character at the warm window, 90°C under-extracts cool-window sweetness; closer to Glitch's deliberate low-temp philosophy than the ultra-light Clarity-First default. **Vehicle determines integration, not extraction depth:** Orea Glass + Sibarist FLAT FAST phase-separated (milk chocolate body + lemon top + hollow tail as distinct layers); April Brewer Glass + April Paper integrated them (second data point for the Sudan Rume aromatic-landrace / SL-lineage vehicle pattern - the Chiang Mai cross is SL28 × HW 26/5 × Caturra/Timor; full variety mix Catuaí + Typica + Chiang Mai hybrid + SJ133). **Roast-character ceiling on the late fraction:** a 'slightly thin / not-fully-extracted' aftertaste survived seven brews of parameter iteration - confirmed as roast-character ceiling, not recipe deficit (a front-loaded pour filled the tail but turned it bitter). Pack's roast does not contain honeyed late-fraction sugars; chasing them with extraction depth produces roast character. **(2) Jaroon Khun Lao Double Honey** (home brew, 2026-05-26) confirmed the roast-forward tendency on a second lot - an even-extraction Balanced Intensity recipe amplified the developed-roast solubles into an oversteeped-black-tea / smoky-toasty wall. **Resolution differs by lot:** Nawin was a cooling-curve problem (evaluate at 45-50°C and the roast recedes); Khun Lao was a strategy problem needing a Hybrid Sequential phase separation (see [by-strategy/hybrid.md](docs/skills/brewing-historian/cluster/patterns/by-strategy/hybrid.md)). Treat Newbery Thai roasts as roast-forward-by-default and budget for either cool-window evaluation discipline OR a Hybrid reach depending on whether the roast reads cooling-gated (Nawin) or structurally-walled (Khun Lao). **Warm-window reads are actively misleading (Nawin):** hot/warm (≥55°C) reads milk-chocolate-forward with a drying tail and muted citrus - roast-forward and NOT representative despite being inside the Clarity-First parameter window; 50-55°C integrates and lemon emerges; 45-50°C is peak. Stronger temperature-gating than the Picolot S7X cooling signature - the warm window doesn't just under-deliver, it misrepresents. Sample at 60/55/50/45/40°C; evaluate at 45-50°C. |

## Terraform Coffee Roasters

★ **CLARITY-FIRST** (published, taxonomy card) - but **cupping-muted lots resolve to Hybrid** (Latent finding, single data point, see Notes)

|                         |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
|-------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Location**            | Shanghai, China                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| **Strategy Tag**        | CLARITY-FIRST (published baseline) - first-default holds for transparent-projection Terraform lots; cupping-muted lots invert toward Hybrid (Intensity-Clarity Split) regardless of variety/process default                                                                                                                                                                                                                                                                                                                                                     |
| **EG-1 Starting Range** | 6.5-6.7 on washed (per Terraform's published 1:16-1:17 baseline). For cupping-muted lots, jump to EG-1 6.4 with Hybrid structure.                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **House Style**         | Light (modern clarity-focused). V60 / Kalita recipes with even pours, moderate temp (90-93°C published), low agitation. 14-15g / 210-255g / 1:16-1:17 / 2:10-2:30 brew time. Loring roaster. Per Airworks resale framing: "not ultralight, but definitely light"; peaks 3-4 weeks post-roast, falls off 7-8 weeks.                                                                                                                                                                                                                                                |
| **Brew Guide**          | Official (archived) - web.archive.org/web/20260221111636/https://www.terraformcoffee.com/pages/brew-guides                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Notes**               | **Cupping-muted Sidra Natural inverts the Clarity-First default**, confirmed 2026-06-06 on Loja Ecuador Clara Luz Sidra Natural (Servio Lenin González Jiménez / Finca Clara Luz / Loja-Quilanga / Sidra / Natural / WB Agtron 62.4 Light-Medium / 2025/09 harvest / brew_id 37affc20-67ce-438d-a255-ad801afe1644). Reference recipe: **April Hybrid Brewer (April Switch) + April Paper Filter, 15g / 250g (1:16.7), EG-1 6.4, 94°C kettle on base, Hybrid (Intensity-Clarity Split): closed bloom 50g × 45s → drain 10s → re-close → closed Pour 1 to 150g × 18s + 20s steep → open Pour 2 to 250g × 15s drain, total 2:45-3:10**. v1 ran the Terraform Clarity-First baseline (UFO + Sibarist Fast Cone / 6.6 / 91°C / 1:17 / 2 pours) and read under-extracted/muted; the override signal was a third-party cupping of the same lot ALSO reading quiet, which is an aromatic-ceiling-limited-at-the-source signal (see [cross-coffee-insights.md Pattern 7](docs/skills/brewing-historian/cluster/patterns/cross-coffee-insights.md) for the axis-agnostic rule). Resolution was structural front-loading (closed-immersion Hybrid via April Switch), NOT deeper extraction. Cup: apple-apricot-pie with lemon-rind garnish, light-brown-tea body, integration holds across the full cooling arc. **Operational rules from this lot (one data point - second confirmation needed):** (1) Clarity-First card stays the default for transparent-projection Terraform lots (washed Kenyas, washed Ethiopians, the Mejorado-adjacent stuff). (2) For Terraform Naturals at Light-Medium development (Agtron 60-65), check cupping behavior before defaulting - cupping-muted lots want Hybrid Intensity-Clarity Split on the Switch. (3) The Terraform card's published temperature range (90-93°C) is non-binding on cupping-muted lots; 94°C produced no roast bleed across the full cooling arc despite Agtron 62.4. (4) Roast date was not on the bag - inquire directly if accurate date matters; Airworks resale rest-window framing (3-4 wk peak, 7-8 wk drop-off) is a reasonable proxy. (5) Process detail came from the Chinese label (日晒 = natural / sun-dried), not the English copy - watch for Chinese-side process flags on Terraform bags. (6) Producer Servio Lenin González Jiménez is net-new to the producer registry - candidate for Tier 3 promotion (Ecuador Mejorado + Precision Estates family, Loja, Sidra/Geisha varietal additions to a 1935-era Typica farm; multi-year Cup of Excellence finalist).                                                                                                                                                                                                                                                                                                                                              |
