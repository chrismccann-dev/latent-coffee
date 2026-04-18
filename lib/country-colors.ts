// Country swatch colors used on /terroirs index + detail.
// Semantic palette — each country gets a distinct earth-toned hue.
// Fallback slate (#555555) for any country not in the map.

export const COUNTRY_COLORS: Record<string, string> = {
  'Brazil': '#4A3728',
  'China': '#3D3D3D',
  'Colombia': '#7A3B4B',
  'Costa Rica': '#2D5E3A',
  'Ecuador': '#4A6B3B',
  'Ethiopia': '#6B7B3B',
  'Guatemala': '#3B5B6B',
  'Panama': '#4A7C59',
  'Peru': '#5B4A6B',
  'Burundi': '#6B4A3B',
  'Kenya': '#8B3B2B',
  'Rwanda': '#7B3B4B',
}

export function getCountryColor(country: string): string {
  return COUNTRY_COLORS[country] || '#555555'
}
