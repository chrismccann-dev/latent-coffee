/**
 * Text-based matching between terroirs and brews.
 * FK relationships (terroir_id) are not populated in the database,
 * so we match using terroir location names against green_bean origin/region
 * and brew coffee_name fields.
 */

import { Terroir } from '@/lib/types'

/**
 * Extract search keywords from a terroir record.
 * Returns location names that should match against green_bean origin/region
 * and brew coffee_name.
 */
export function getTerroirKeywords(terroir: Terroir): string[] {
  const keywords: string[] = []

  if (terroir.meso_terroir) {
    for (const meso of terroir.meso_terroir.split(',')) {
      const trimmed = meso.trim()
      if (trimmed && trimmed !== '-') keywords.push(trimmed.toLowerCase())
    }
  }

  if (terroir.macro_terroir && terroir.macro_terroir !== '-') {
    keywords.push(terroir.macro_terroir.toLowerCase())
  }

  if (terroir.admin_region) {
    keywords.push(terroir.admin_region.toLowerCase())
  }

  return Array.from(new Set(keywords))
}

/**
 * Build Supabase OR filter strings for matching terroir keywords
 * against a given column using ilike.
 */
export function buildTerroirIlikeFilter(keywords: string[], column: string): string {
  return keywords.map(kw => `${column}.ilike.%${kw}%`).join(',')
}
