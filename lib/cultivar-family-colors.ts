// Cultivar genetic-family swatch colors used on /cultivars index + detail.
// Mirrors the country-palette approach: each family gets a distinct warm/cool hue.
// Consolidated from two previously-divergent copies — detail-page palette is canonical
// (index page used to collapse all non-Ethiopian families to a single gray, losing
// the per-family visual differentiation).

export const CULTIVAR_FAMILY_COLORS: Record<string, string> = {
  'Ethiopian Landrace Families': '#4A7C59',
  'Bourbon Family': '#7A3B4B',
  'Modern Hybrids': '#3B5B6B',
  'Typica × Bourbon Crosses': '#6B4A3B',
  'Typica Family': '#4A3728',
  'SL Selections': '#8B3B2B',
}

export function getFamilyColor(family: string): string {
  return CULTIVAR_FAMILY_COLORS[family] || '#555555'
}
