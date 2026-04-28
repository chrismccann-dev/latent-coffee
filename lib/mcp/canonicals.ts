// Canonical-registry payloads served as MCP Resources at canonicals://{axis}.
// Single source of truth; the route handler registers one ResourceTemplate that
// dispatches via this lookup.

import {
  CULTIVARS,
  CULTIVAR_ALIASES,
  CULTIVAR_NAMES,
  CULTIVAR_LINEAGES,
  GENETIC_FAMILIES,
  CULTIVAR_SPECIES,
} from '@/lib/cultivar-registry'
import {
  TERROIRS,
  TERROIR_COUNTRIES,
  TERROIR_MACROS,
  TERROIR_MACRO_ALIASES,
} from '@/lib/terroir-registry'
import {
  BASE_PROCESSES,
  BASE_PROCESS_ALIASES,
  HONEY_SUBPROCESSES,
  HONEY_SUBPROCESS_ALIASES,
  FERMENTATION_MODIFIERS,
  FERMENTATION_ALIASES,
  DRYING_MODIFIERS,
  DRYING_ALIASES,
  INTERVENTION_MODIFIERS,
  INTERVENTION_ALIASES,
  EXPERIMENTAL_MODIFIERS,
  EXPERIMENTAL_ALIASES,
  DECAF_MODIFIERS,
  DECAF_ALIASES,
  SIGNATURE_METHODS,
  SIGNATURE_ALIASES,
  LEGACY_DECOMPOSITIONS,
} from '@/lib/process-registry'
import {
  ROASTERS,
  ROASTER_NAMES,
  ROASTER_ALIASES,
  ROASTER_FAMILIES,
  ROASTER_STRATEGY_TAGS,
  STRATEGY_TAG_FAMILY,
} from '@/lib/roaster-registry'
import {
  PRODUCERS,
  PRODUCER_NAMES,
  PRODUCER_ALIASES,
} from '@/lib/producer-registry'
import {
  BREWERS,
  BREWER_NAMES,
  BREWER_ALIASES,
} from '@/lib/brewer-registry'
import {
  FILTERS,
  FILTER_NAMES,
  FILTER_ALIASES,
} from '@/lib/filter-registry'
import {
  BASE_FLAVORS,
  FLAVOR_MODIFIERS,
  STRUCTURE_TAGS,
  STRUCTURE_BY_AXIS,
  ALIAS_MAP,
  FALLBACK_ANCHORS,
  TEA_BASES,
} from '@/lib/flavor-registry'
import {
  ROAST_LEVELS,
  ROAST_LEVEL_NAMES,
  ROAST_LEVEL_ALIASES,
} from '@/lib/roast-level-registry'
import {
  GRINDERS,
  GRINDER_NAMES,
  GRINDER_ALIASES,
} from '@/lib/grinder-registry'
import { EXTRACTION_STRATEGIES, type ExtractionStrategy } from '@/lib/brew-import'
import { MODIFIER_TYPES, type ModifierType } from '@/lib/extraction-modifiers'

const STRATEGY_DESCRIPTIONS: Record<ExtractionStrategy, string> = {
  'Suppression':
    'Mechanics-of-Clarity intent: hold an over-expressive co-ferment back. Coarse grind, low temp, low agitation. Mechanically twins with Clarity-First but the coffee dictates the choice.',
  'Clarity-First':
    'Protect a delicate cup. Coarse-ish grind, lower temp, gentle agitation. Mechanically twins with Suppression but used on clean coffees, not muscular ones.',
  'Balanced Intensity':
    'Middle of the spectrum. Standard mechanics, mid temps, mid agitation. Default for most coffees that don’t need pushing or holding.',
  'Full Expression':
    'Develop heavy co-ferments. Fine grind + high temp + high agitation to drive the coffee. Mechanically twins with Extraction Push but uses agitation as the lever.',
  'Extraction Push':
    'Push yield on a clean coffee while preserving transparency. Fine grind + high temp + Melodrip / low agitation. Wölfl/Tran/Giachgia pattern.',
}

const MODIFIER_TYPE_DESCRIPTIONS: Record<ModifierType, { description: string; subfields: Record<string, string> }> = {
  output_selection: {
    description:
      'Cut early or late from the brew (or both). Used when you want to drop the head or tail of the extraction.',
    subfields: {
      form: 'early_cut | late_cut | both',
      brew_weight: 'Total grams brewed before cutting (number, optional).',
      cup_yield: 'Grams kept after the cut (number, optional).',
      notes: 'Free-text rationale.',
    },
  },
  inverted_temperature_staging: {
    description: 'Brew with temperature rising or falling across phases. E.g. 86°C bloom → 92°C late pours.',
    subfields: { phases: 'Free-text description, e.g. "86°C → 92°C across two phases".' },
  },
  aroma_capture: {
    description: 'Aromatic-distillation accessory inserted into the brew (Paragon ball, scent diffuser).',
    subfields: { application: 'Free-text, e.g. "Paragon ball on bloom + Pour 1".' },
  },
  immersion: {
    description:
      'Valve-modulated or staged immersion (SWORKS Bottomless valve mod, Hario Switch). Distinct from a flat-bed percolation; the contact time is part of the recipe.',
    subfields: { application: 'Free-text, e.g. "Hario Switch staged: closed bloom + open pour".' },
  },
}

export type CanonicalAxis =
  | 'cultivars'
  | 'terroirs'
  | 'processes'
  | 'roasters'
  | 'producers'
  | 'brewers'
  | 'filters'
  | 'flavors'
  | 'roast-levels'
  | 'grinders'
  | 'extraction-strategies'
  | 'modifiers'

export const CANONICAL_AXES: { axis: CanonicalAxis; title: string; description: string }[] = [
  { axis: 'cultivars', title: 'Cultivars', description: '63 canonical cultivars + 48 aliases. Genetic family + lineage hierarchy. Strict — adopt aliases, don’t add net-new bases without registry edit.' },
  { axis: 'terroirs', title: 'Terroirs', description: '121 macro terroirs across 38 countries + 12 structural aliases. Country + macro_terroir is the canonical compound key; meso/micro are pass-through free-text.' },
  { axis: 'processes', title: 'Processes', description: 'Composable taxonomy: base (4) + honey subprocess + 4 modifier axes (fermentation/drying/intervention/experimental) + decaf + signature method.' },
  { axis: 'roasters', title: 'Roasters', description: '70 canonical roasters, 6 families (Clarity-First / Balanced / Extraction-Forward / System / Varies / Self-Roasted) via 10 strategy tags. allowOverride pattern — net-new roasters more common than net-new cultivars.' },
  { axis: 'producers', title: 'Producers', description: '120 canonical producers, tier-scoped (60-70% coverage per Chris’s framing). 6 ProducerSystem canonicals. allowOverride for net-new (research routine in 2.6 sweeps the queue).' },
  { axis: 'brewers', title: 'Brewers', description: '46 brewers (12 owned, 24 aliases). 80% comprehensive — allowOverride for net-new. Material axis dropped (drift, not sub-axis).' },
  { axis: 'filters', title: 'Filters', description: '64 filters (22 owned, 34 aliases). Pair-aware — some bare filter names map to different canonicals depending on brewer pairing (e.g. Sibarist FAST → FLAT/CONE/UFO FAST).' },
  { axis: 'flavors', title: 'Flavors', description: '3-axis composable taxonomy: 182 bases (12 categories) + 43 modifiers (10 categories with priority order) + 29 structure tags (7 axes). Tea-base reversal rule + fallback anchors.' },
  { axis: 'roast-levels', title: 'Roast Levels', description: '8 Agtron-anchored canonical buckets (Extremely Light → Very Dark, 10-unit ranges) + 22 aliases. Marketing tags (Nordic / Ultra Light / etc.) are aliases-only.' },
  { axis: 'grinders', title: 'Grinders', description: 'Single canonical: EG-1 with 51 valid settings (3.0-8.0 in 0.1 steps); 16 carry rich measured-D50 content. Setting axis is enumerated strict, not free-text.' },
  { axis: 'extraction-strategies', title: 'Extraction Strategies', description: '5 canonical strategies post Sprint Extraction Strategy v2 (2026-04-27). Mechanics-vs-intent symmetry: Suppression / Clarity-First share mechanics, Full Expression / Extraction Push share grind+temp.' },
  { axis: 'modifiers', title: 'Extraction Modifiers', description: '4 canonical modifier types (output_selection, inverted_temperature_staging, aroma_capture, immersion). Optional + stackable.' },
]

export type CanonicalPayload = {
  axis: CanonicalAxis
  notes: string
  data: Record<string, unknown>
}

function buildPayload(meta: { axis: CanonicalAxis; description: string }): CanonicalPayload {
  const data = (() => {
    switch (meta.axis) {
      case 'cultivars':
        return {
          species: CULTIVAR_SPECIES,
          genetic_families: GENETIC_FAMILIES,
          lineages: CULTIVAR_LINEAGES,
          cultivars: CULTIVARS,
          names: CULTIVAR_NAMES,
          aliases: CULTIVAR_ALIASES,
        }
      case 'terroirs':
        return {
          countries: TERROIR_COUNTRIES,
          macros: TERROIR_MACROS,
          terroirs: TERROIRS,
          aliases: TERROIR_MACRO_ALIASES,
        }
      case 'processes':
        return {
          base: { canonicals: BASE_PROCESSES, aliases: BASE_PROCESS_ALIASES },
          honey_subprocess: { canonicals: HONEY_SUBPROCESSES, aliases: HONEY_SUBPROCESS_ALIASES },
          fermentation_modifiers: { canonicals: FERMENTATION_MODIFIERS, aliases: FERMENTATION_ALIASES },
          drying_modifiers: { canonicals: DRYING_MODIFIERS, aliases: DRYING_ALIASES },
          intervention_modifiers: { canonicals: INTERVENTION_MODIFIERS, aliases: INTERVENTION_ALIASES },
          experimental_modifiers: { canonicals: EXPERIMENTAL_MODIFIERS, aliases: EXPERIMENTAL_ALIASES },
          decaf: { canonicals: DECAF_MODIFIERS, aliases: DECAF_ALIASES },
          signature: { canonicals: SIGNATURE_METHODS, aliases: SIGNATURE_ALIASES },
          legacy_decompositions: LEGACY_DECOMPOSITIONS,
        }
      case 'roasters':
        return {
          families: ROASTER_FAMILIES,
          strategy_tags: ROASTER_STRATEGY_TAGS,
          strategy_to_family: STRATEGY_TAG_FAMILY,
          roasters: ROASTERS,
          names: ROASTER_NAMES,
          aliases: ROASTER_ALIASES,
        }
      case 'producers':
        return {
          producers: PRODUCERS,
          names: PRODUCER_NAMES,
          aliases: PRODUCER_ALIASES,
        }
      case 'brewers':
        return {
          brewers: BREWERS,
          names: BREWER_NAMES,
          aliases: BREWER_ALIASES,
        }
      case 'filters':
        return {
          filters: FILTERS,
          names: FILTER_NAMES,
          aliases: FILTER_ALIASES,
        }
      case 'flavors':
        return {
          bases: BASE_FLAVORS,
          modifiers: FLAVOR_MODIFIERS,
          structure_tags: STRUCTURE_TAGS,
          structure_by_axis: STRUCTURE_BY_AXIS,
          aliases: ALIAS_MAP,
          fallback_anchors: FALLBACK_ANCHORS,
          tea_bases: TEA_BASES,
        }
      case 'roast-levels':
        return {
          roast_levels: ROAST_LEVELS,
          names: ROAST_LEVEL_NAMES,
          aliases: ROAST_LEVEL_ALIASES,
        }
      case 'grinders':
        return {
          grinders: GRINDERS,
          names: GRINDER_NAMES,
          aliases: GRINDER_ALIASES,
        }
      case 'extraction-strategies':
        return {
          strategies: EXTRACTION_STRATEGIES.map((name) => ({
            name,
            description: STRATEGY_DESCRIPTIONS[name] ?? '',
          })),
        }
      case 'modifiers':
        return {
          types: MODIFIER_TYPES.map((type) => ({
            type,
            ...MODIFIER_TYPE_DESCRIPTIONS[type],
          })),
        }
    }
  })()

  return { axis: meta.axis, notes: meta.description, data: data as Record<string, unknown> }
}

const PAYLOAD_CACHE: Record<CanonicalAxis, CanonicalPayload> = Object.fromEntries(
  CANONICAL_AXES.map((meta) => [meta.axis, buildPayload(meta)]),
) as Record<CanonicalAxis, CanonicalPayload>

export function getCanonicalPayload(axis: string): CanonicalPayload | null {
  return (PAYLOAD_CACHE as Record<string, CanonicalPayload | undefined>)[axis] ?? null
}
