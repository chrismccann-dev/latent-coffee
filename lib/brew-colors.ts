// Single source of truth for the book-cover color shown on a brew card.
// Used by the /brews index (BrewCard) + the CoffeesList swatch on every
// aggregation detail page (roaster / cultivar / terroir / processes).
//
// Cover color = extraction strategy (2026-06-03 priority-stack recount). The
// prior process×flavor×variety keying drifted to mean nothing once extraction
// strategy became the canonical brewing axis (6 strategies, each already
// carrying its own hue in lib/extraction-strategy.ts). The hue now comes from
// that single source of truth so the cover, the strategy pill, and any other
// strategy signal all read the same hue. Brews with no strategy fall back to a
// neutral slate.

import type { Brew } from './types'
import { getStrategyCoverColor } from './extraction-strategy'

export function getCoverColor(brew: Brew): string {
  return getStrategyCoverColor(brew.extraction_strategy)
}
