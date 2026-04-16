// Single source of truth for the book-cover color shown on a brew card.
// All color decisions live here so list, detail, terroir-detail, and
// cultivar-detail pages stay in sync.

import type { Brew } from './types'

export function getCoverColor(brew: Brew): string {
  const process = brew.process?.toLowerCase() || ''
  const flavorText = (brew.flavor_notes || []).join(' ').toLowerCase()
  const variety = brew.variety?.toLowerCase() || ''

  if (process.includes('natural') && (process.includes('anaerobic') || process.includes('yeast'))) {
    return '#722F4B'
  }
  if (process.includes('anaerobic') || process.includes('thermal shock') || process.includes('anoxic')) {
    return '#722F4B'
  }
  if (process.includes('honey')) {
    return '#8B6914'
  }
  if (process.includes('natural')) {
    return '#8B4513'
  }
  if (variety.includes('gesha') || variety.includes('geisha')) {
    if (process.includes('washed')) return '#4A7C59'
    return '#5B7A6B'
  }
  if (flavorText.includes('berry') || flavorText.includes('wine') || flavorText.includes('grape')) {
    return '#722F4B'
  }
  if (flavorText.includes('floral') || flavorText.includes('jasmine') || flavorText.includes('bergamot')) {
    // Muted teal — flavor-driven signal, intentionally blue-shifted so it
    // doesn't compete with the Gesha greens.
    return '#3F6F73'
  }
  // Fallback neutral — intentionally non-green so it doesn't read as a variety
  // or flavor signal alongside the Gesha / floral / sage greens.
  return '#5C6570'
}
