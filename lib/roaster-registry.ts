// Roaster → family + per-roaster metadata. Names match brews.roaster exactly (free-text, no FK).
// Family shape mirrors the BMR's extraction-strategy tags.

import { makeCanonicalLookup } from './canonical-registry'

export const ROASTER_FAMILIES = [
  'Clarity-First',
  'Balanced',
  'Extraction-Forward',
  'Varies',
  'Self-Roasted',
] as const

export type RoasterFamily = (typeof ROASTER_FAMILIES)[number]

// Adding a new roaster requires deciding family + adding a ROASTER_METADATA card.
const ROASTER_MAP: Record<string, RoasterFamily> = {
  'Leaves': 'Clarity-First',
  'Hydrangea': 'Clarity-First',
  'Heart': 'Clarity-First',
  'Oma': 'Clarity-First',

  'Shoebox': 'Balanced',
  'Colibri': 'Balanced',
  'T&M': 'Balanced',
  'Bean & Bean': 'Balanced',
  'Olympia': 'Balanced',

  'Sey': 'Extraction-Forward',
  'Flower Child': 'Extraction-Forward',
  'Substance': 'Extraction-Forward',
  'Picolot': 'Extraction-Forward',
  'Luminous': 'Extraction-Forward',
  'The Picky Chemist': 'Extraction-Forward',
  'Rose': 'Extraction-Forward',
  'Noma Kaffe': 'Extraction-Forward',

  'Moonwake': 'Varies',
  'Strait': 'Varies',
  'Scenery': 'Varies',

  'Latent': 'Self-Roasted',
}

export function getRoasterFamily(roaster: string | null | undefined): RoasterFamily | 'Unknown' {
  if (!roaster) return 'Unknown'
  return ROASTER_MAP[roaster] || 'Unknown'
}

// Sorted canonical roaster names — consumed by the edit-form typeahead
// datalist and by the ROASTER_LOOKUP bundle below.
export const ROASTER_REGISTRY = Object.keys(ROASTER_MAP).sort()
export const ROASTER_LOOKUP = makeCanonicalLookup(ROASTER_REGISTRY)
export const isCanonicalRoaster = ROASTER_LOOKUP.isCanonical
export const findClosestRoaster = ROASTER_LOOKUP.findClosest

// Hue-separated palette per feedback_design_conventions. Warm-neutral, distinct from
// process / flavor / brew-cover palettes.
const FAMILY_COLORS: Record<RoasterFamily | 'Unknown', string> = {
  'Clarity-First':       '#7A8B7B',
  'Balanced':            '#B89B6B',
  'Extraction-Forward':  '#B5563C',
  'Varies':              '#8B6B7B',
  'Self-Roasted':        '#5A4A45',
  'Unknown':             '#5C6570',
}

export function getFamilyColor(family: RoasterFamily | 'Unknown'): string {
  return FAMILY_COLORS[family]
}

// bmrStrategy + bmrHouseStyle are injected into the synthesis prompt as Claude's working
// hypothesis to confirm or push back on against the brew corpus.
export interface RoasterMetadata {
  fullName?: string
  location?: string
  url?: string
  bmrStrategy?: string         // BMR-style strategy tag, verbatim
  bmrHouseStyle?: string       // 1-2 sentence house-style read; injected into synthesis prompt
  notes?: string               // 1-line learning from prior brews; injected into synthesis prompt
}

export const ROASTER_METADATA: Record<string, RoasterMetadata> = {
  'Moonwake': {
    fullName: 'Moonwake Coffee Roasters',
    location: 'San Francisco, CA',
    url: 'https://moonwakecoffeeroasters.com/pages/brew-guide',
    bmrStrategy: 'VARIES',
    bmrHouseStyle: 'Clarity-to-Balanced. V60 focused, 15g / 240g / 1:16, multiple pours with bed exposure. Lighter temps suit processed lots.',
    notes: 'Processed/anaerobic lots (e.g. Jeferson Motta) consistently need Full Expression — confirmed at EG-1 6.0 / 98°C.',
  },
  'Hydrangea': {
    fullName: 'Hydrangea Coffee Roasters',
    location: 'Berkeley, CA',
    url: 'https://hydrangea.coffee/pages/faq',
    bmrStrategy: 'CLARITY-FIRST → BALANCED',
    bmrHouseStyle: 'V60, 15g / 250g / 93°C / ~50ppm soft water. 4-pour structure (50/130/190/250). Target 2:30. Counterflow roasting style — very light, fast structure.',
    notes: 'Finca El Paraíso thermal-shock lots: start 6.4 / 94°C, push 6.3 / 95°C only if thin. Cooling behavior extreme — evaluate near 40°C for rose/floral targets.',
  },
  'Strait': {
    fullName: 'Strait Coffee Roasters',
    location: 'San Jose, CA',
    bmrStrategy: 'BALANCED / VARIES',
    bmrHouseStyle: 'Switch-recipe focused: 15g / 250g / 95°C, split-dose, bloom 30g / 40s, open at 2:30, finish 4:00. V60 standard. Terroir-expression focus.',
    notes: 'For percolation brewers, Balanced Intensity is safer than Clarity-First, especially for processed lots.',
  },
  'Latent': {
    fullName: 'Latent (self-roasted)',
    location: 'Home (Roest sample roaster, 100g batches)',
    bmrStrategy: 'SELF-ROASTED',
    bmrHouseStyle: 'Roast for elasticity, brew for intensity. Roasts designed to contain many possible cups, not demand one narrow set of conditions.',
  },
  'Sey': {
    fullName: 'Sey Coffee',
    location: 'Brooklyn, NY',
    bmrStrategy: 'FULL EXPRESSION',
    bmrHouseStyle: 'No official guide. In-café Aeropress. Collab recipe: 20g / 340g / boiling water. Grind as fine as possible. Long bloom (60s), Melodrip, multiple aggressive spins.',
    notes: 'Targets very high EY (24%+). Boiling water intentional. Approach every Sey coffee expecting Full Expression. Rest 3–4 weeks minimum.',
  },
  'Shoebox': {
    fullName: 'Shoebox Coffee',
    bmrStrategy: 'BALANCED',
    bmrHouseStyle: 'Primary: UFO brewer, 1:16.67, 95°C. Secondary: V60, 1:16.7, 92°C.',
    notes: 'UFO at 95°C higher than Clarity-First default. Multiple Shoebox washed lots in archive confirmed at Clarity-First — strategy tag may shift toward Varies.',
  },
  'Colibri': {
    fullName: 'Colibri Coffee Roasters',
    location: 'Camano Island, WA',
    url: 'https://colibricoffeeroasters.com',
    bmrStrategy: 'BALANCED',
    bmrHouseStyle: 'Small family-owned, single-origin focus. No public brew guide. EG-1 6.5–6.4 for honey/anaerobic lots; 6.7–6.5 for washed.',
    notes: 'Anaerobic honey amplifies florals without heavy fermentation weight — Gesha + honey signals Balanced Intensity, not Full Expression.',
  },
  'Flower Child': {
    fullName: 'Flower Child Coffee',
    location: 'Oakland, CA',
    url: 'https://flowerchildcoffee.com/blogs/brewing-tips-guides-extrapolation/brew-guides',
    bmrStrategy: 'FULL EXPRESSION',
    bmrHouseStyle: 'V60 + Cafec T-92 + Melodrip. 16g / 288g / 1:18+. Boiling water (210–211°F / 99°C). Medium-fine. Target 4–5+ min. Bloom 2–3x coffee weight. 25–27% EY goal.',
    notes: 'Among most extraction-forward roasters in the archive. T-92 + boiling + 5 min + 25–27% EY. Full Expression from the start.',
  },
  'Substance': {
    fullName: 'Substance Café',
    location: 'Paris, France',
    url: 'https://substancecafe.com/our-techniques/',
    bmrStrategy: 'BALANCED → FULL',
    bmrHouseStyle: 'V60-01 + Cafec Abaca. 12g / 200g / ~91°C. 90GH / 40KH water. 5 pours with big horizontal spirals to bed edge. Target 3:00–3:15. High agitation.',
    notes: 'One of the most deliberate technical roasters. High-agitation + specific mineral water are intentional extraction tools.',
  },
  'Picolot': {
    fullName: 'Picolot (Brian Quan)',
    bmrStrategy: 'BALANCED → FULL',
    bmrHouseStyle: 'Orea Z1. 15g / 250g / 95°C (natural decline). Diluted Third Wave Water 1:3–1:4. 3-pour fast/fast/slow structure. Target 2:30–3:00. Grind ~300µm on M98V.',
    notes: "Coffees described as 'loud.' Fast/fast/slow: acidity → sweetness → clarity. Kettle-off temp management smooths finish.",
  },
  'The Picky Chemist': {
    fullName: 'The Picky Chemist',
    bmrStrategy: 'FULL EXPRESSION',
    bmrHouseStyle: 'V60-02 + Cafec Abaca. 15g / 250g / 95°C. Soft water. Grind ~450µm. Target 3:30–3:50. Bloom 60g / 50s rest. 24%+ EY targets.',
    notes: '450µm target unachievable on EG-1 — compensate via temp (boiling), agitation, T-92 filter, brew time. Treat all Picky Chemist coffees as Full Expression.',
  },
  'Leaves': {
    fullName: 'Leaves Coffee Roasters',
    location: 'Japan',
    bmrStrategy: 'CLARITY-FIRST',
    bmrHouseStyle: 'V60, 15g / 240g / 92°C. 4 pours: 40g bloom at 0:00, +110g at 0:30, +50g at 1:10, +40g at 1:40. Target 2:15–2:30. No agitation.',
    notes: '40g bloom (2.7:1 ratio) notably lower than typical. Conservative, clarity-first. Start 6.7–6.8 / 92°C following pour structure before adjusting. If thin, coarsen rather than fine.',
  },
  'Luminous': {
    fullName: 'Luminous Coffee',
    url: 'https://loveluminous.coffee/pages/coffee-extraction-calculator',
    bmrStrategy: 'FULL EXPRESSION',
    bmrHouseStyle: '17g / 288g / 1:17. 93°C. 5 pours × 50g. Target 3:30. Grind: 490–575µm D50.',
    notes: 'Distinctive in providing a specific µm target. 5-pour pulse with 17g dose = Full Expression intent.',
  },
  'Scenery': {
    fullName: 'Scenery Coffee Roasters',
    location: 'London, UK',
    url: 'https://scenery.coffee',
    bmrStrategy: 'VARIES',
    bmrHouseStyle: 'Roasts lighter than Nordic but slightly more developed. House recipe: low-bypass flat-bottom, long bloom (1 min), pulse pours, no agitation. 62–64g/L. 92–96°C.',
    notes: 'Always check lot archive page before brewing. House guide conservative — anoxic naturals needed Full Expression despite restrained guide. Washed lots compatible Clarity-First to Balanced. Rest 3–4 weeks minimum.',
  },

  // — Chris-researched (no BMR card before this sprint) —

  'Heart': {
    fullName: 'Heart Coffee Roasters',
    location: 'Portland, Oregon',
    url: 'https://www.heartroasters.com/pages/v60',
    bmrStrategy: 'CLARITY-FIRST',
    bmrHouseStyle: 'Portland roaster with very light, transparency-forward roast style favoring washed classic cultivars and clean Ethiopian landraces. V60 recipe is moderate across every lever (22g / 360g / 200–205°F / medium-fine / 2:20–2:30) with a short contact time signaling the coffee is meant to give itself up cleanly rather than be pushed for EY.',
    notes: 'Two archive data points (Jairo Arcila Bourbon Aruzi, Tagel Alemayehu) confirmed Clarity-First first-pass at EG-1 6.6–6.7 / 92.5–93°C with low/no agitation. Cups temperature-sensitive — evaluate below 50°C.',
  },
  'Rose': {
    fullName: 'Rose',
    location: 'Zurich, Switzerland',
    url: 'https://rose-coffee.com',
    bmrStrategy: 'BALANCED → FULL',
    bmrHouseStyle: "V60, 20g / 300g (tight 1:15) / 93°C → 88°C taper across 5 pulse pours with deliberately aggressive agitation from height, total ~6:50 using fast papers. Very light roasts targeting 'bright and clean with as much sweetness as possible before tasting any roastiness' on transparency-forward sourcing.",
    notes: "Philosophy reads clarity-first but method is extraction-forward — same shape as Substance Café. Temperature taper integral to method. Sibarist UFO Fast Cone or FAST cone S should be default. Don't confuse clarity-first vocabulary for low-extraction intent.",
  },
  'T&M': {
    fullName: 'T&M Coffee',
    location: 'Naha, Okinawa, Japan',
    url: 'https://tmcoffee.jp',
    bmrStrategy: 'BALANCED',
    bmrHouseStyle: "Okinawan roastery running a Giesen W1-A with Cropster integration. Philosophy explicitly rejects a single 'optimal balance' and targets terroir/fruity acidity with sweetness and mouthfeel as co-equal levers, bean by bean. Roast levels span light (Kenya SL28 washed, Panama/Brazil Gesha anaerobic natural) to medium (Sumatran method Indonesia).",
  },
  'Bean & Bean': {
    fullName: 'Bean & Bean Coffee Roasters',
    location: 'New York City, NY',
    url: 'https://beannbeancoffee.com/blogs/beansider/brew-guides',
    bmrStrategy: 'BALANCED',
    bmrHouseStyle: "Published V60 guide is generic-audience (18g / 285g / 195–205°F / 'fine salt' grind / 60s bloom / 3-pour / 3–4 min) and not precise enough to treat as philosophical signal. Catalog spans Chocolatey & Nutty to Floral & Delicate to competition Geshas — house style deliberately broad.",
    notes: "Brew guide reads as customer-education rather than house commitment — don't over-weight it. Treat limited-release competition coffees (Jamie's, Hachi Project) as Clarity-First to Balanced candidates separate from the day-to-day single-origin lineup.",
  },
  'Noma Kaffe': {
    fullName: 'Noma Kaffe',
    location: 'Copenhagen, Denmark',
    url: 'https://nomaprojects.com/blogs/recipes/v60',
    bmrStrategy: 'BALANCED → FULL',
    bmrHouseStyle: 'V60 recipe notably extraction-forward: 1:15.4 ratio (65g / 1000g), just-off-boil water, 4-pour structure with aggressive early pouring (400g by 1:00), ~3:50 total. Sourcing direct-trade transparency-forward (Tenejapa Garnica, Guji heirloom, Luis Alejandro Ortega Gesha, La Perla del Otun) with heavy farmer-story emphasis.',
    notes: 'Recipe shape closest to Substance Café in archive but more extraction-forward. Restaurant-first origin (brewed for end-of-meal service) means likely light-to-medium roast rather than ultra-light. Sustainability/farmer-story is core positioning — sourcing stays transparent and terroir-forward, not ferment-driven.',
  },
  'Olympia': {
    fullName: 'Olympia Coffee Roasting Company',
    location: 'Olympia, WA',
    url: 'https://olympiacoffee.com/pages/brewing',
    bmrStrategy: 'BALANCED',
    bmrHouseStyle: 'Established PNW multi-location roastery/cafe operation (founded 2005) with strong wholesale, retail, and espresso presence. Published brew guide is principles-only: 200–205°F, 1:17 starting ratio, 2:30–4:30 drip window — no pour structure, grind target, or temperature specificity.',
    notes: 'Brew guide too generic to extract house philosophy from — the absence of a specific recipe is itself the signal, differentiating cafe-broad roasters (Olympia, Bean & Bean) from recipe-publishing boutique roasters (Leaves, Substance, Noma).',
  },
  'Oma': {
    fullName: 'Oma Coffee Roaster',
    location: 'Hong Kong',
    url: 'https://omacoffeeroaster.com',
    bmrStrategy: 'CLARITY-FIRST → BALANCED',
    bmrHouseStyle: "Small-batch Hong Kong boutique roastery, Loring S7, profiles disclosed per coffee as 'Roasted for: Filter.' Lineup is the signal: 7 of 9 current filter offerings are Gesha (Arnulfo Cuellar, Franceschi, El Porvenir across multiple processes including Competition Reserve) or Ethiopian nano-lots from Elto Coffee. Flavor vocabulary on product pages is clarity-first (jasmine, bergamot, tangerine, apricot).",
    notes: 'Closest archive analogue is Hydrangea: same producer roster (El Porvenir heavy), same Loring light-roast profile, same Gesha-forward sourcing. El Porvenir lots from Oma should follow archived thermal-shock learnings (start 6.4 / 94°C, push 6.3 / 95°C only if thin).',
  },
}

export function getRoasterMetadata(roaster: string | null | undefined): RoasterMetadata | undefined {
  if (!roaster) return undefined
  return ROASTER_METADATA[roaster]
}
