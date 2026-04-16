// Shared UI helpers for the extraction-strategy badge + what_i_learned preview.
// Color palette maps each canonical strategy (see lib/brew-import.ts) to a
// muted pill style that works on both dark book-covers and light cards.

import { EXTRACTION_STRATEGIES, type ExtractionStrategy } from './brew-import'

export { EXTRACTION_STRATEGIES }
export type { ExtractionStrategy }

export interface StrategyStyle {
  bg: string
  text: string
  border: string
  short: string
}

const STRATEGY_STYLES: Record<ExtractionStrategy, StrategyStyle> = {
  'Clarity-First':       { bg: '#E8F0EA', text: '#2D5E3A', border: '#4A7C59', short: 'CLARITY' },
  'Balanced Intensity':  { bg: '#F5E8D0', text: '#6B4A10', border: '#8B6914', short: 'BALANCED' },
  'Full Expression':     { bg: '#F0DCE1', text: '#722F4B', border: '#8B3B4B', short: 'FULL' },
}

export function getStrategyStyle(strategy: string | null | undefined): StrategyStyle | null {
  if (!strategy) return null
  if ((EXTRACTION_STRATEGIES as readonly string[]).includes(strategy)) {
    return STRATEGY_STYLES[strategy as ExtractionStrategy]
  }
  return { bg: '#EEEEEE', text: '#555555', border: '#BBBBBB', short: strategy.slice(0, 8).toUpperCase() }
}

export function truncateLearning(text: string | null | undefined, max = 80): string | null {
  if (!text) return null
  const clean = text.trim().replace(/\s+/g, ' ')
  if (clean.length <= max) return clean
  // Prefer breaking at a word boundary
  const slice = clean.slice(0, max)
  const lastSpace = slice.lastIndexOf(' ')
  const cut = lastSpace > max * 0.6 ? slice.slice(0, lastSpace) : slice
  return cut.trimEnd() + '…'
}
