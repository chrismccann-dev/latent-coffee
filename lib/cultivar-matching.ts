/**
 * Text-based matching between cultivars and brews.
 * FK relationships (cultivar_id) are not populated in the database,
 * so we match using brew.variety against cultivar name/lineage keywords.
 */

export interface CultivarMatchInfo {
  cultivar_name: string
  lineage: string | null
  cultivar_raw: string | null
}

/**
 * Extract search keywords from a cultivar record.
 * Returns lowercase keywords that should match against brew.variety.
 *
 * Examples:
 *   "Gesha lineage" + "Colombian Gesha selection" → ["gesha", "colombian gesha selection"]
 *   "Bourbon (classic)" + "Bourbon Aruzi" → ["bourbon", "bourbon aruzi"]
 *   "SL Bourbon lineage" + "Mokkha" → ["mokkha", "sl bourbon"]
 */
export function getCultivarKeywords(cultivar: CultivarMatchInfo): string[] {
  const keywords: string[] = []

  // Add cultivar_name as a keyword (e.g., "Colombian Gesha selection", "Mokkha", "Castillo")
  if (cultivar.cultivar_name) {
    keywords.push(cultivar.cultivar_name.toLowerCase().trim())
  }

  // Add cultivar_raw if different from cultivar_name
  if (cultivar.cultivar_raw && cultivar.cultivar_raw !== cultivar.cultivar_name) {
    keywords.push(cultivar.cultivar_raw.toLowerCase().trim())
  }

  // Extract root from lineage (e.g., "Gesha" from "Gesha lineage", "Bourbon" from "Bourbon (classic)")
  if (cultivar.lineage) {
    const root = cultivar.lineage
      .replace(/\s*lineage\s*/i, '')
      .replace(/\s*\(.*?\)\s*/g, '')
      .replace(/\s*(mutation|derived|selection|hybrid|crosses?)\s*/gi, '')
      .trim()
      .toLowerCase()
    if (root && root.length > 1) {
      keywords.push(root)
    }
  }

  // Deduplicate
  return Array.from(new Set(keywords))
}

/**
 * Check if a brew's variety matches a cultivar based on text keywords.
 */
export function brewMatchesCultivar(brewVariety: string | null, cultivar: CultivarMatchInfo): boolean {
  if (!brewVariety) return false
  const variety = brewVariety.toLowerCase().trim()
  const keywords = getCultivarKeywords(cultivar)

  return keywords.some(keyword => {
    // Check both directions: variety contains keyword OR keyword contains variety
    // e.g., variety "Gesha" matches keyword "gesha"
    // e.g., variety "SL-28" matches keyword "sl-28"
    // e.g., variety "Pink Bourbon" matches keyword "bourbon" (variety contains keyword)
    return variety.includes(keyword) || keyword.includes(variety)
  })
}
