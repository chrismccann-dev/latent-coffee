// Single source of truth for process → family mapping and family colors.
// Process names are free-text in brews.process (no FK). This lookup collapses
// the ~20 distinct values into 5 families for index grouping.

export const PROCESS_FAMILIES = [
  'Washed',
  'Natural',
  'Honey',
  'Anaerobic',
  'Experimental',
] as const

export type ProcessFamily = (typeof PROCESS_FAMILIES)[number]

const FAMILY_MAP: Record<string, ProcessFamily> = {
  // Washed — classic wet processing + close cousins
  'Washed': 'Washed',
  'Moonshadow Washed': 'Washed',
  'Cold Fermented Washed': 'Washed',

  // Natural — dry processing + controlled variants (DRD)
  'Natural': 'Natural',
  'Dark Room Dry Natural': 'Natural',

  // Honey — pulp-retained drying
  'Honey': 'Honey',
  'White Honey': 'Honey',

  // Anaerobic — sealed-tank / inoculated / thermal-shock fermentation
  'Anaerobic Washed': 'Anaerobic',
  'Anaerobic Natural': 'Anaerobic',
  'Anaerobic Honey': 'Anaerobic',
  'Anoxic Natural': 'Anaerobic',
  'ASD Natural': 'Anaerobic',
  'Yeast Anaerobic Natural': 'Anaerobic',
  'Yeast Inoculated Natural': 'Anaerobic',
  'Double Anaerobic Thermal Shock': 'Anaerobic',
  'Double Fermentation Thermal Shock': 'Anaerobic',
  'TyOxidator': 'Anaerobic',

  // Experimental — external ingredient / infusion on a base process
  'Tamarind + Red Fruit Co-ferment Washed': 'Experimental',
  'Washed Sakura Co-ferment': 'Experimental',
  'Washed Cascara Infused': 'Experimental',
}

export function getProcessFamily(process: string | null | undefined): ProcessFamily | 'Other' {
  if (!process) return 'Other'
  return FAMILY_MAP[process] || 'Other'
}

// Hue-separated family palette, aligned with brew-colors.ts where they overlap
// so a Natural-family swatch matches the book-cover of a Natural brew.
const FAMILY_COLORS: Record<ProcessFamily | 'Other', string> = {
  'Washed':       '#4A7C59',
  'Natural':      '#8B4513',
  'Honey':        '#8B6914',
  'Anaerobic':    '#722F4B',
  'Experimental': '#5B4A6B',
  'Other':        '#5C6570',
}

export function getFamilyColor(family: ProcessFamily | 'Other' | string): string {
  return FAMILY_COLORS[family as ProcessFamily | 'Other'] || FAMILY_COLORS.Other
}
