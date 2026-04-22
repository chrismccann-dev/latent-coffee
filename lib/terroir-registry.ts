// Canonical registries for the three positions of the archive-format Terroir
// field: `Country / Macro Terroir / Meso Terroir` (see BREWING.md § Step 4).
// Each position gets its own independent CanonicalLookup — the sync validator
// parses the slash-separated string, checks each slot against its registry,
// and surfaces per-field suggestions. Composite and hierarchical lookups were
// considered; independent lookups mirror how the archive is written and keep
// the factory contract uniform across registries. Revisit if wrong-combo
// detection (Panama / Sidama) becomes a real V1 concern.
//
// Source: `SELECT DISTINCT country|macro_terroir|meso_terroir FROM terroirs`
// (2026-04-21 — 13 countries / 19 macros / 22 mesos). Additions require a
// deliberate decision, not drift — same discipline as producer / roaster /
// flavor registries.

import { makeCanonicalLookup } from './canonical-registry'

export const TERROIR_COUNTRIES = [
  'Brazil',
  'Burundi',
  'China',
  'Colombia',
  'Costa Rica',
  'Ecuador',
  'Ethiopia',
  'Guatemala',
  'Honduras',
  'Mexico',
  'Panama',
  'Peru',
  'Rwanda',
] as const

export const TERROIR_MACROS = [
  'Acatenango Volcanic Highlands',
  'Bench Sheko Highlands',
  'Central Andean Cordillera',
  'Cerrado Mineiro',
  'Chiapas Highlands',
  'Costa Rican Central Volcanic Highlands',
  'Guji Highlands',
  'Huehuetenango Highlands',
  'Huila Highlands',
  'Lake Kivu Highlands',
  'Marcala Highlands',
  'Northern Andean Cordillera',
  'Sidama Highlands',
  'Sierra Sur Highlands',
  'Southern Andean Cordillera',
  'Volcán Barú Highlands',
  'West Arsi Highlands',
  'Western Andean Cordillera',
  'Yunnan Monsoonal Highlands',
] as const

export const TERROIR_MESOS = [
  'Acatenango Highlands',
  'Alajuela Highlands',
  'Bensa',
  'Boquete Valley',
  'Cajamarca',
  'Ciudad Bolívar highlands',
  'Filandia, Calarcá',
  'Gesha Village Estate',
  'Gitesi Sector',
  'Hambela',
  'Intag Valley',
  'La Libertad Highlands',
  'Laboyos Valley, San Agustín, Pitalito',
  'Liquidambar zone',
  'Mangshi Highlands',
  'Nensebo',
  'Ninga Hills',
  'Patrocínio',
  'Popayán plateau',
  'San Agustín Loxicha',
  'Tenejapa',
  'Trujillo highlands',
] as const

export const TERROIR_COUNTRY_LOOKUP = makeCanonicalLookup(TERROIR_COUNTRIES)
export const isCanonicalCountry = TERROIR_COUNTRY_LOOKUP.isCanonical
export const findClosestCountry = TERROIR_COUNTRY_LOOKUP.findClosest

export const TERROIR_MACRO_LOOKUP = makeCanonicalLookup(TERROIR_MACROS)
export const isCanonicalMacroTerroir = TERROIR_MACRO_LOOKUP.isCanonical
export const findClosestMacroTerroir = TERROIR_MACRO_LOOKUP.findClosest

export const TERROIR_MESO_LOOKUP = makeCanonicalLookup(TERROIR_MESOS)
export const isCanonicalMesoTerroir = TERROIR_MESO_LOOKUP.isCanonical
export const findClosestMesoTerroir = TERROIR_MESO_LOOKUP.findClosest
