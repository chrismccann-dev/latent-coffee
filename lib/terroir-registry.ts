// Canonical terroir registry for the latent-coffee app. Authored content lives
// in [docs/taxonomies/regions.md](../docs/taxonomies/regions.md); this file is
// the validation mirror. Matches the markdown canonical list exactly.
//
// Shape refactor 2026-04-22 (sprint 1d.1): flat 3-bundle (countries / macros /
// mesos as string arrays) -> rich `TerroirEntry[]` with country / admin_region /
// macro_terroir per row, mirroring the Variety sprint's cultivar-registry.ts
// shape. Meso and Micro were demoted from canonical registry to free-text
// annotation on terroir rows (the DB `terroirs.meso_terroir` column is retained
// but no longer validated or autocompleted - Chris's CSV research confirmed every
// behavioral attribute is macro-scoped and meso / micro carry no distinct
// aggregation signal).
//
// Source: Chris's Terroir Reference Taxonomy CSV (126 rows) + one hand-
// authored extension (Bench Sheko Highlands, Ethiopia South West) ported in
// sprint 1d.1. 121 distinct canonical macros across 38
// countries (127 country-scoped entries - macros like Lake Kivu Highlands
// span multiple countries and appear as multiple entries). Additions require a
// 3-step edit: docs/taxonomies/regions.md, this file, and a DB migration if an
// existing row needs renaming.

import { makeCanonicalLookup } from './canonical-registry'

// ---------------------------------------------------------------------------
// Rich entry shape
// ---------------------------------------------------------------------------

export interface TerroirEntry {
  country: string
  admin_region: string
  macro_terroir: string
}

export const TERROIRS: readonly TerroirEntry[] = [
  { country: 'Bolivia', admin_region: 'La Paz / Cochabamba', macro_terroir: 'Bolivian Yungas Cloud Forest Slopes' },
  { country: 'Bolivia', admin_region: 'Santa Cruz', macro_terroir: 'Santa Cruz Andean Foothills' },
  { country: 'Brazil', admin_region: 'Bahia', macro_terroir: 'Bahia Highlands' },
  { country: 'Brazil', admin_region: 'Espírito Santo', macro_terroir: 'Espírito Santo Highlands' },
  { country: 'Brazil', admin_region: 'Espírito Santo / Rondônia / Bahia', macro_terroir: 'Brazilian Lowland Robusta Systems' },
  { country: 'Brazil', admin_region: 'Minas Gerais', macro_terroir: 'Cerrado Mineiro' },
  { country: 'Brazil', admin_region: 'Minas Gerais / São Paulo', macro_terroir: 'Mantiqueira Highlands' },
  { country: 'Brazil', admin_region: 'São Paulo / Minas Gerais', macro_terroir: 'Mogiana Highlands' },
  { country: 'Burundi', admin_region: 'Kayanza / Muramvya / Mwaro', macro_terroir: 'Mumirwa Escarpment' },
  { country: 'Burundi', admin_region: 'Ngozi / Kirundo / Muyinga', macro_terroir: 'Northern Interior Highlands' },
  { country: 'China', admin_region: 'Fujian', macro_terroir: 'Fujian Coastal Highlands' },
  { country: 'China', admin_region: 'Guangxi', macro_terroir: 'Guangxi Southern Frontier Highlands' },
  { country: 'China', admin_region: 'Hainan', macro_terroir: 'Hainan Tropical Low-Mountain Belt' },
  { country: 'China', admin_region: 'Yunnan', macro_terroir: 'Yunnan Central Highlands' },
  { country: 'China', admin_region: 'Yunnan', macro_terroir: 'Yunnan Northern Highlands' },
  { country: 'China', admin_region: 'Yunnan', macro_terroir: 'Yunnan Southern Highlands' },
  { country: 'Colombia', admin_region: 'Antioquia / Caldas / Quindío', macro_terroir: 'Central Andean Cordillera' },
  { country: 'Colombia', admin_region: 'Huila', macro_terroir: 'Huila Highlands' },
  { country: 'Colombia', admin_region: 'Santander / Norte de Santander', macro_terroir: 'Northern Andean Cordillera' },
  { country: 'Colombia', admin_region: 'Valle del Cauca / Risaralda / Cauca', macro_terroir: 'Western Andean Cordillera' },
  { country: 'Costa Rica', admin_region: 'Alajuela / Heredia / San José', macro_terroir: 'Central Volcanic Highlands' },
  { country: 'Costa Rica', admin_region: 'Limón', macro_terroir: 'Caribbean Slope Highlands' },
  { country: 'Costa Rica', admin_region: 'Puntarenas', macro_terroir: 'Pacific Slope Highlands' },
  { country: 'Costa Rica', admin_region: 'San José / Cartago', macro_terroir: 'Southern Highlands' },
  { country: 'Cuba', admin_region: 'Pinar del Río', macro_terroir: 'Pinar del Río Western Highlands' },
  { country: 'Cuba', admin_region: 'Sancti Spíritus / Cienfuegos', macro_terroir: 'Escambray Massif' },
  { country: 'Cuba', admin_region: 'Santiago de Cuba / Granma / Guantánamo', macro_terroir: 'Sierra Maestra Mountains' },
  { country: 'DR Congo', admin_region: 'Ituri', macro_terroir: 'Ituri Albertine Highlands' },
  { country: 'DR Congo', admin_region: 'North Kivu', macro_terroir: 'Rwenzori Grand Nord Highlands' },
  { country: 'DR Congo', admin_region: 'South Kivu / North Kivu', macro_terroir: 'Lake Kivu Highlands' },
  { country: 'Dominican Republic', admin_region: 'Barahona', macro_terroir: 'Sierra de Bahoruco Highlands' },
  { country: 'Dominican Republic', admin_region: 'La Vega / Monseñor Nouel / San José de Ocoa', macro_terroir: 'Cordillera Central Highlands' },
  { country: 'Dominican Republic', admin_region: 'Santiago / Espaillat / Puerto Plata', macro_terroir: 'Cordillera Septentrional Highlands' },
  { country: 'Ecuador', admin_region: 'Loja / Zamora-Chinchipe', macro_terroir: 'Southern Andean Highlands' },
  { country: 'Ecuador', admin_region: 'Pichincha / Imbabura / Carchi', macro_terroir: 'Northern Andean Highlands' },
  { country: 'El Salvador', admin_region: 'Chalatenango / Santa Ana', macro_terroir: 'Alotepec-Metapán Highlands' },
  { country: 'El Salvador', admin_region: 'La Libertad / San Salvador', macro_terroir: 'Bálsamo Volcanic Belt' },
  { country: 'El Salvador', admin_region: 'Morazán', macro_terroir: 'Cacahuatique Eastern Highlands' },
  { country: 'El Salvador', admin_region: 'San Vicente', macro_terroir: 'Chinchontepec Volcanic Slopes' },
  { country: 'El Salvador', admin_region: 'Santa Ana / Ahuachapán', macro_terroir: 'Apaneca-Ilamatepec Highlands' },
  { country: 'El Salvador', admin_region: 'Usulután / San Miguel', macro_terroir: 'Tecapa-Chinameca Highlands' },
  { country: 'Ethiopia', admin_region: 'Gedeo', macro_terroir: 'Yirgacheffe Highlands' },
  { country: 'Ethiopia', admin_region: 'Hararghe', macro_terroir: 'Harar Eastern Highlands' },
  { country: 'Ethiopia', admin_region: 'Oromia (Guji)', macro_terroir: 'Guji Highlands' },
  { country: 'Ethiopia', admin_region: 'Oromia (West Arsi)', macro_terroir: 'West Arsi Highlands' },
  { country: 'Ethiopia', admin_region: 'Oromia / SNNP', macro_terroir: 'Western Ethiopian Forest Highlands' },
  { country: 'Ethiopia', admin_region: 'Sidama', macro_terroir: 'Sidama Highlands' },
  { country: 'Ethiopia', admin_region: 'South West Ethiopia Peoples Region (Bench Sheko / West Omo)', macro_terroir: 'Bench Sheko Highlands' },
  { country: 'Guatemala', admin_region: 'Huehuetenango / Quiché', macro_terroir: 'Western Dry Highlands' },
  { country: 'Guatemala', admin_region: 'Izabal', macro_terroir: 'Caribbean Slope Highlands' },
  { country: 'Guatemala', admin_region: 'Sacatepéquez / Chimaltenango', macro_terroir: 'Central Volcanic Highlands' },
  { country: 'Guatemala', admin_region: 'Zacapa / Chiquimula', macro_terroir: 'Eastern Highlands' },
  { country: 'Haiti', admin_region: 'Centre', macro_terroir: 'Cahos Matheux Range' },
  { country: 'Haiti', admin_region: 'Nord', macro_terroir: 'Massif du Nord Highlands' },
  { country: 'Haiti', admin_region: 'Ouest / Sud-Est', macro_terroir: 'Massif de la Selle' },
  { country: 'Haiti', admin_region: 'Sud / Grand’Anse', macro_terroir: 'Massif de la Hotte' },
  { country: 'Honduras', admin_region: 'Comayagua / La Paz', macro_terroir: 'Central Honduras Highlands' },
  { country: 'Honduras', admin_region: 'Copán / Ocotepeque / Lempira', macro_terroir: 'Western Honduras Highlands' },
  { country: 'Honduras', admin_region: 'El Paraíso', macro_terroir: 'Eastern Honduras Highlands' },
  { country: 'India', admin_region: 'Andhra Pradesh / Odisha', macro_terroir: 'Araku Eastern Ghats Highlands' },
  { country: 'India', admin_region: 'Karnataka', macro_terroir: 'Karnataka Western Ghats' },
  { country: 'India', admin_region: 'Kerala', macro_terroir: 'Kerala Western Ghats' },
  { country: 'India', admin_region: 'Tamil Nadu', macro_terroir: 'Tamil Nadu High Ranges' },
  { country: 'Indonesia', admin_region: 'Aceh / North Sumatra / West Sumatra', macro_terroir: 'Sumatra Highlands' },
  { country: 'Indonesia', admin_region: 'Bali', macro_terroir: 'Bali Volcanic Highlands' },
  { country: 'Indonesia', admin_region: 'East Nusa Tenggara (Flores)', macro_terroir: 'Flores Volcanic Highlands' },
  { country: 'Indonesia', admin_region: 'East Nusa Tenggara (Timor)', macro_terroir: 'Timor Highlands' },
  { country: 'Indonesia', admin_region: 'Papua', macro_terroir: 'Papua Highlands' },
  { country: 'Indonesia', admin_region: 'South Sulawesi / Central Sulawesi', macro_terroir: 'Sulawesi Highlands' },
  { country: 'Indonesia', admin_region: 'West Java / Central Java / East Java', macro_terroir: 'Java Volcanic Highlands' },
  { country: 'Kenya', admin_region: 'Central Province / Rift Valley', macro_terroir: 'Central Kenyan Volcanic Highlands' },
  { country: 'Kenya', admin_region: 'Western Kenya / Rift Valley', macro_terroir: 'Western Rift Valley Highlands' },
  { country: 'Laos', admin_region: 'Champasak / Sekong / Saravane', macro_terroir: 'Bolaven Plateau Volcanic Highlands' },
  { country: 'Laos', admin_region: 'Luang Prabang / Oudomxay', macro_terroir: 'Northern Laos Highlands' },
  { country: 'Malawi', admin_region: 'Northern Region', macro_terroir: 'Northern Malawi Highlands' },
  { country: 'Malawi', admin_region: 'Southern Region', macro_terroir: 'Southern Malawi Highlands' },
  { country: 'Mexico', admin_region: 'Chiapas', macro_terroir: 'Chiapas Highlands' },
  { country: 'Mexico', admin_region: 'Jalisco / Nayarit', macro_terroir: 'Western Sierra Madre' },
  { country: 'Mexico', admin_region: 'Oaxaca', macro_terroir: 'Oaxaca Southern Highlands' },
  { country: 'Mexico', admin_region: 'Veracruz / Puebla', macro_terroir: 'Gulf Highlands' },
  { country: 'Myanmar', admin_region: 'Chin State', macro_terroir: 'Chin Highlands' },
  { country: 'Myanmar', admin_region: 'Mandalay Region', macro_terroir: 'Pyin Oo Lwin Plateau' },
  { country: 'Myanmar', admin_region: 'Shan State', macro_terroir: 'Southern Shan Highlands' },
  { country: 'Nepal', admin_region: 'Bagmati / Province 1', macro_terroir: 'Central Eastern Mid-Hills' },
  { country: 'Nepal', admin_region: 'Gandaki / Lumbini', macro_terroir: 'Western Mid-Hills' },
  { country: 'Nicaragua', admin_region: 'Nueva Segovia / Jinotega / Matagalpa', macro_terroir: 'Northern Highlands' },
  { country: 'Panama', admin_region: 'Chiriquí', macro_terroir: 'Boquete Slopes' },
  { country: 'Panama', admin_region: 'Chiriquí', macro_terroir: 'Santa Clara Highlands' },
  { country: 'Panama', admin_region: 'Chiriquí', macro_terroir: 'Volcán Barú Highlands' },
  { country: 'Papua New Guinea', admin_region: 'Eastern Highlands / Western Highlands', macro_terroir: 'PNG Central Highlands' },
  { country: 'Papua New Guinea', admin_region: 'Jiwaka / Morobe', macro_terroir: 'PNG Fringe Highlands' },
  { country: 'Peru', admin_region: 'Cajamarca / Amazonas', macro_terroir: 'Northern Andean Highlands' },
  { country: 'Peru', admin_region: 'Cusco / Puno', macro_terroir: 'Southern Andean Highlands' },
  { country: 'Peru', admin_region: 'Junín / Pasco', macro_terroir: 'Central Andean Highlands' },
  { country: 'Peru', admin_region: 'San Martín / Huánuco', macro_terroir: 'Amazonian Fringe' },
  { country: 'Philippines', admin_region: 'Batangas / Cavite', macro_terroir: 'Southern Luzon Belt' },
  { country: 'Philippines', admin_region: 'Benguet / Ifugao', macro_terroir: 'Cordillera Highlands' },
  { country: 'Philippines', admin_region: 'Bukidnon / Davao', macro_terroir: 'Mindanao Highlands' },
  { country: 'Rwanda', admin_region: 'Eastern Province', macro_terroir: 'Eastern Low Highlands' },
  { country: 'Rwanda', admin_region: 'Southern Province', macro_terroir: 'Central Plateau Highlands' },
  { country: 'Rwanda', admin_region: 'Western Province', macro_terroir: 'Lake Kivu Highlands' },
  { country: 'Taiwan', admin_region: 'Chiayi', macro_terroir: 'Alishan Belt' },
  { country: 'Taiwan', admin_region: 'Nantou', macro_terroir: 'Central Foothills' },
  { country: 'Taiwan', admin_region: 'Taitung / Pingtung', macro_terroir: 'Southern Eastern Belt' },
  { country: 'Taiwan', admin_region: 'Yunlin', macro_terroir: 'Yunlin Uplands' },
  { country: 'Tanzania', admin_region: 'Arusha / Manyara', macro_terroir: 'Northern Rift Highlands' },
  { country: 'Tanzania', admin_region: 'Kagera', macro_terroir: 'Lake Victoria Highlands' },
  { country: 'Tanzania', admin_region: 'Kilimanjaro', macro_terroir: 'Kilimanjaro Highlands' },
  { country: 'Tanzania', admin_region: 'Mbeya / Ruvuma', macro_terroir: 'Southern Highlands' },
  { country: 'Thailand', admin_region: 'Chiang Rai / Chiang Mai', macro_terroir: 'Northern Thai Highlands' },
  { country: 'Thailand', admin_region: 'Chumphon / Surat Thani', macro_terroir: 'Southern Peninsula Robusta' },
  { country: 'Timor-Leste', admin_region: 'Ermera / Aileu / Ainaro', macro_terroir: 'Western Central Highlands' },
  { country: 'Timor-Leste', admin_region: 'Manufahi', macro_terroir: 'South Central Highlands' },
  { country: 'Uganda', admin_region: 'Eastern Region', macro_terroir: 'Mount Elgon Highlands' },
  { country: 'Uganda', admin_region: 'Northwestern Region', macro_terroir: 'West Nile Highlands' },
  { country: 'Uganda', admin_region: 'Southwestern Region', macro_terroir: 'Southwestern Highlands' },
  { country: 'Uganda', admin_region: 'Western Region', macro_terroir: 'Rwenzori Highlands' },
  { country: 'United States', admin_region: 'California', macro_terroir: 'Southern California Highlands' },
  { country: 'United States', admin_region: 'Hawaii', macro_terroir: 'Hawaiian Volcanic Highlands' },
  { country: 'Vietnam', admin_region: 'Quảng Trị', macro_terroir: 'North Central Highlands' },
  { country: 'Vietnam', admin_region: 'Sơn La / Điện Biên', macro_terroir: 'Northwest Highlands' },
  { country: 'Vietnam', admin_region: 'Đắk Lắk / Lâm Đồng', macro_terroir: 'Central Highlands Plateau' },
  { country: 'Yemen', admin_region: 'Abyan / Lahij', macro_terroir: 'Yafa Highlands' },
  { country: 'Yemen', admin_region: 'Ibb / Hajjah', macro_terroir: 'Central Highlands' },
  { country: 'Yemen', admin_region: 'Sana’a / Al Mahwit', macro_terroir: 'Haraz Highlands' },
  { country: 'Yemen', admin_region: 'Sana’a / Raymah', macro_terroir: 'Sana’a Western Highlands' },
  { country: 'Zambia', admin_region: 'Northern Province / Muchinga', macro_terroir: 'Zambian Northern Highlands' },
] as const

// ---------------------------------------------------------------------------
// Derived unique lists (legacy exports preserved for back-compat)
// ---------------------------------------------------------------------------

export const TERROIR_COUNTRIES: readonly string[] = [
  'Bolivia',
  'Brazil',
  'Burundi',
  'China',
  'Colombia',
  'Costa Rica',
  'Cuba',
  'DR Congo',
  'Dominican Republic',
  'Ecuador',
  'El Salvador',
  'Ethiopia',
  'Guatemala',
  'Haiti',
  'Honduras',
  'India',
  'Indonesia',
  'Kenya',
  'Laos',
  'Malawi',
  'Mexico',
  'Myanmar',
  'Nepal',
  'Nicaragua',
  'Panama',
  'Papua New Guinea',
  'Peru',
  'Philippines',
  'Rwanda',
  'Taiwan',
  'Tanzania',
  'Thailand',
  'Timor-Leste',
  'Uganda',
  'United States',
  'Vietnam',
  'Yemen',
  'Zambia',
] as const

export const TERROIR_MACROS: readonly string[] = [
  'Alishan Belt',
  'Alotepec-Metapán Highlands',
  'Amazonian Fringe',
  'Apaneca-Ilamatepec Highlands',
  'Araku Eastern Ghats Highlands',
  'Bahia Highlands',
  'Bali Volcanic Highlands',
  'Bench Sheko Highlands',
  'Bolaven Plateau Volcanic Highlands',
  'Bolivian Yungas Cloud Forest Slopes',
  'Boquete Slopes',
  'Brazilian Lowland Robusta Systems',
  'Bálsamo Volcanic Belt',
  'Cacahuatique Eastern Highlands',
  'Cahos Matheux Range',
  'Caribbean Slope Highlands',
  'Central Andean Cordillera',
  'Central Andean Highlands',
  'Central Eastern Mid-Hills',
  'Central Foothills',
  'Central Highlands',
  'Central Highlands Plateau',
  'Central Honduras Highlands',
  'Central Kenyan Volcanic Highlands',
  'Central Plateau Highlands',
  'Central Volcanic Highlands',
  'Cerrado Mineiro',
  'Chiapas Highlands',
  'Chin Highlands',
  'Chinchontepec Volcanic Slopes',
  'Cordillera Central Highlands',
  'Cordillera Highlands',
  'Cordillera Septentrional Highlands',
  'Eastern Highlands',
  'Eastern Honduras Highlands',
  'Eastern Low Highlands',
  'Escambray Massif',
  'Espírito Santo Highlands',
  'Flores Volcanic Highlands',
  'Fujian Coastal Highlands',
  'Guangxi Southern Frontier Highlands',
  'Guji Highlands',
  'Gulf Highlands',
  'Hainan Tropical Low-Mountain Belt',
  'Harar Eastern Highlands',
  'Haraz Highlands',
  'Hawaiian Volcanic Highlands',
  'Huila Highlands',
  'Ituri Albertine Highlands',
  'Java Volcanic Highlands',
  'Karnataka Western Ghats',
  'Kerala Western Ghats',
  'Kilimanjaro Highlands',
  'Lake Kivu Highlands',
  'Lake Victoria Highlands',
  'Mantiqueira Highlands',
  'Massif de la Hotte',
  'Massif de la Selle',
  'Massif du Nord Highlands',
  'Mindanao Highlands',
  'Mogiana Highlands',
  'Mount Elgon Highlands',
  'Mumirwa Escarpment',
  'North Central Highlands',
  'Northern Andean Cordillera',
  'Northern Andean Highlands',
  'Northern Highlands',
  'Northern Interior Highlands',
  'Northern Laos Highlands',
  'Northern Malawi Highlands',
  'Northern Rift Highlands',
  'Northern Thai Highlands',
  'Northwest Highlands',
  'Oaxaca Southern Highlands',
  'PNG Central Highlands',
  'PNG Fringe Highlands',
  'Pacific Slope Highlands',
  'Papua Highlands',
  'Pinar del Río Western Highlands',
  'Pyin Oo Lwin Plateau',
  'Rwenzori Grand Nord Highlands',
  'Rwenzori Highlands',
  'Sana’a Western Highlands',
  'Santa Clara Highlands',
  'Santa Cruz Andean Foothills',
  'Sidama Highlands',
  'Sierra Maestra Mountains',
  'Sierra de Bahoruco Highlands',
  'South Central Highlands',
  'Southern Andean Highlands',
  'Southern California Highlands',
  'Southern Eastern Belt',
  'Southern Highlands',
  'Southern Luzon Belt',
  'Southern Malawi Highlands',
  'Southern Peninsula Robusta',
  'Southern Shan Highlands',
  'Southwestern Highlands',
  'Sulawesi Highlands',
  'Sumatra Highlands',
  'Tamil Nadu High Ranges',
  'Tecapa-Chinameca Highlands',
  'Timor Highlands',
  'Volcán Barú Highlands',
  'West Arsi Highlands',
  'West Nile Highlands',
  'Western Andean Cordillera',
  'Western Central Highlands',
  'Western Dry Highlands',
  'Western Ethiopian Forest Highlands',
  'Western Honduras Highlands',
  'Western Mid-Hills',
  'Western Rift Valley Highlands',
  'Western Sierra Madre',
  'Yafa Highlands',
  'Yirgacheffe Highlands',
  'Yunlin Uplands',
  'Yunnan Central Highlands',
  'Yunnan Northern Highlands',
  'Yunnan Southern Highlands',
  'Zambian Northern Highlands',
] as const

// ---------------------------------------------------------------------------
// Aliases - pre-1d.1 canonical drift + diacritic-free spellings
// ---------------------------------------------------------------------------

const TERROIR_MACRO_ALIASES: Readonly<Record<string, string>> = {
  'Acatenango Volcanic Highlands': 'Central Volcanic Highlands',
  'Alotepec-Metapan Highlands': 'Alotepec-Metapán Highlands',
  'Balsamo Volcanic Belt': 'Bálsamo Volcanic Belt',
  'Costa Rican Central Volcanic Highlands': 'Central Volcanic Highlands',
  'Espirito Santo Highlands': 'Espírito Santo Highlands',
  'Huehuetenango Highlands': 'Western Dry Highlands',
  'Marcala Highlands': 'Central Honduras Highlands',
  'Pinar del Rio Western Highlands': 'Pinar del Río Western Highlands',
  'Sierra Sur Highlands': 'Oaxaca Southern Highlands',
  'Southern Andean Cordillera': 'Western Andean Cordillera',
  'Volcan Baru Highlands': 'Volcán Barú Highlands',
  'Yunnan Monsoonal Highlands': 'Yunnan Central Highlands',
}

// ---------------------------------------------------------------------------
// Lookups
// ---------------------------------------------------------------------------

export const TERROIR_COUNTRY_LOOKUP = makeCanonicalLookup(TERROIR_COUNTRIES)
export const isCanonicalCountry = TERROIR_COUNTRY_LOOKUP.isCanonical
export const findClosestCountry = TERROIR_COUNTRY_LOOKUP.findClosest

export const TERROIR_MACRO_LOOKUP = makeCanonicalLookup(TERROIR_MACROS, TERROIR_MACRO_ALIASES)
export const isCanonicalMacroTerroir = TERROIR_MACRO_LOOKUP.isCanonical
export const findClosestMacroTerroir = TERROIR_MACRO_LOOKUP.findClosest

// ---------------------------------------------------------------------------
// Rich-shape helpers (mirror getCultivarEntry / resolveCultivar)
// ---------------------------------------------------------------------------

const byCountryMacroKey = new Map(
  TERROIRS.map((t) => [`${t.country.toLowerCase()}|${t.macro_terroir.toLowerCase()}`, t]),
)

// First entry seen wins for country-agnostic resolution - used by the cross-
// country drift warning in canonicalizeMacroTerroir where we just need any
// canonical country pairing to surface.
const byMacro = new Map<string, TerroirEntry>()
for (const t of TERROIRS) {
  const key = t.macro_terroir.toLowerCase()
  if (!byMacro.has(key)) byMacro.set(key, t)
}

/** Exact country+macro match. Returns the TerroirEntry if the pair is in the registry, else null. */
export function getTerroirEntry(
  country: string | null | undefined,
  macro_terroir: string | null | undefined,
): TerroirEntry | null {
  if (!country || !macro_terroir) return null
  const key = `${country.trim().toLowerCase()}|${macro_terroir.trim().toLowerCase()}`
  return byCountryMacroKey.get(key) ?? null
}

/**
 * Country-agnostic macro resolver. Resolves an input (canonical or alias) to a
 * TerroirEntry from any country. Useful for cross-country drift detection
 * ("Sidama Highlands" typed under Panama context - resolves to Ethiopia entry
 * which the caller can surface as a warning).
 */
export function resolveTerroirMacro(
  macro_terroir: string | null | undefined,
): TerroirEntry | null {
  if (!macro_terroir) return null
  const canonical = TERROIR_MACRO_LOOKUP.isCanonical(macro_terroir)
    ? macro_terroir
    : TERROIR_MACRO_LOOKUP.findClosest(macro_terroir)
  if (!canonical) return null
  return byMacro.get(canonical.toLowerCase()) ?? null
}
