// Cultivar genetic-family swatch colors used on /cultivars index + detail.
// Mirrors the country-palette approach: each family gets a distinct warm/cool hue.
// 5 Arabica families + 3 non-Arabica species families (Eugenioides / Liberica /
// Robusta) added during the Variety sprint (2026-04-22) for when those lots land.
//
// Removed: 'SL Selections' (orphan — SL28/SL34 live under Ethiopian Landrace
// Families per lib/cultivar-registry.ts, no cultivar maps to that family name).

export const CULTIVAR_FAMILY_COLORS: Record<string, string> = {
  'Ethiopian Landrace Families': '#4A7C59',
  'Bourbon Family': '#7A3B4B',
  'Modern Hybrids': '#3B5B6B',
  'Typica × Bourbon Crosses': '#6B4A3B',
  'Typica Family': '#4A3728',
  'Eugenioides': '#C5A47A',
  'Liberica': '#4A5B3B',
  'Robusta': '#3D2D2D',
}

export function getFamilyColor(family: string): string {
  return CULTIVAR_FAMILY_COLORS[family] || '#555555'
}
