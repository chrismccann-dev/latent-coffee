// Single source of truth for flavor-note → family mapping and family colors.
// Flavor notes are free-text in brews.flavor_notes (text[]). This lookup
// canonicalizes ~135 distinct tags into 8 families + Other for aggregation.
//
// Lookup strategy (see getFlavorFamily): exact → case-insensitive → longest
// canonical substring. The substring tier lets composite tags ("Floral
// sweetness", "Stone fruit sweetness", "Tea-like finish") classify into their
// base family without needing a migration to collapse them.

export const FLAVOR_FAMILIES = [
  'Citrus',
  'Stone Fruit',
  'Berry',
  'Tropical',
  'Grape & Wine',
  'Floral',
  'Tea & Herbal',
  'Sweet & Confection',
] as const

export type FlavorFamily = (typeof FLAVOR_FAMILIES)[number]

// Canonical tag → family. Title-cased. Keep ordered within each family block
// for readability. Additions require a deliberate decision, not drift.
const FLAVOR_MAP: Record<string, FlavorFamily> = {
  // Citrus
  'Lemon': 'Citrus',
  'Lemon Zest': 'Citrus',
  'Meyer Lemon': 'Citrus',
  'Lime': 'Citrus',
  'Lime Juice': 'Citrus',
  'Key Lime': 'Citrus',
  'Orange': 'Citrus',
  'Tangerine': 'Citrus',
  'Mandarin': 'Citrus',
  'Grapefruit': 'Citrus',
  'Grapefruit Zest': 'Citrus',
  'Pomelo': 'Citrus',
  'Bergamot': 'Citrus',
  'Marmalade': 'Citrus',
  'Citrus': 'Citrus',

  // Stone Fruit (absorbs pome: cherry / apple / pear)
  'Peach': 'Stone Fruit',
  'White Peach': 'Stone Fruit',
  'Peach Tea': 'Stone Fruit',
  'Peach Candy': 'Stone Fruit',
  'Nectarine': 'Stone Fruit',
  'White Nectarine': 'Stone Fruit',
  'Apricot': 'Stone Fruit',
  'Plum': 'Stone Fruit',
  'Prune': 'Stone Fruit',
  'Cherry': 'Stone Fruit',
  'Apple': 'Stone Fruit',
  'Red Apple': 'Stone Fruit',
  'Green Apple': 'Stone Fruit',
  'Apple Cider': 'Stone Fruit',
  'Apple Jam': 'Stone Fruit',
  'Pear': 'Stone Fruit',
  'Stone Fruit': 'Stone Fruit',

  // Berry
  'Blackberry': 'Berry',
  'Juicy Blackberry': 'Berry',
  'Raspberry': 'Berry',
  'Raspberry Compote': 'Berry',
  'Strawberry': 'Berry',
  'Candied Strawberry': 'Berry',
  'Pomegranate': 'Berry',
  'Hibiscus': 'Berry',

  // Tropical
  'Mango': 'Tropical',
  'Pineapple': 'Tropical',
  'Sweet Pineapple': 'Tropical',
  'Passion Fruit': 'Tropical',
  'Passionfruit': 'Tropical',
  'Lychee': 'Tropical',
  'Kiwi': 'Tropical',
  'Watermelon': 'Tropical',
  'Watermelon Candy': 'Tropical',
  'Tropical Fruit': 'Tropical',
  'Tropical Fruits': 'Tropical',

  // Grape & Wine
  'Grape': 'Grape & Wine',
  'Red Grape': 'Grape & Wine',
  'White Grape': 'Grape & Wine',
  'Fresh Grape': 'Grape & Wine',
  'Sparkling Red Grape': 'Grape & Wine',
  'Muscat': 'Grape & Wine',
  'Muscat Rouge': 'Grape & Wine',
  'Chardonnay': 'Grape & Wine',
  'Red Wine': 'Grape & Wine',
  'Wine-like Fruit': 'Grape & Wine',

  // Floral
  'Floral': 'Floral',
  'Soft Florals': 'Floral',
  'Yellow Florals': 'Floral',
  'Candied Floral': 'Floral',
  'Floral Tea': 'Floral',
  'Jasmine': 'Floral',
  'Jasmine Pearls': 'Floral',
  'Lavender': 'Floral',
  'Rose': 'Floral',
  'Rose Water': 'Floral',
  'Honeysuckle': 'Floral',
  'Chamomile': 'Floral',
  'Violet': 'Floral',
  'Cherry Blossom': 'Floral',
  'Ginger Flower': 'Floral',

  // Tea & Herbal
  'Black Tea': 'Tea & Herbal',
  'Green Tea': 'Tea & Herbal',
  'White Tea': 'Tea & Herbal',
  'Oolong': 'Tea & Herbal',
  "Pu'er": 'Tea & Herbal',
  'Earl Grey': 'Tea & Herbal',
  'Earl Grey Tea': 'Tea & Herbal',
  'Milk Tea': 'Tea & Herbal',
  'Jasmine Milk Tea': 'Tea & Herbal',
  'Honeyed Tea': 'Tea & Herbal',
  'Fruity Tea': 'Tea & Herbal',
  'Tea Spice': 'Tea & Herbal',
  'Mint': 'Tea & Herbal',
  'Eucalyptus': 'Tea & Herbal',
  'Lemongrass': 'Tea & Herbal',
  'Cardamom': 'Tea & Herbal',
  'Cinnamon': 'Tea & Herbal',
  'Spices': 'Tea & Herbal',
  'Tomato': 'Tea & Herbal',
  'Tomato Leaf': 'Tea & Herbal',

  // Sweet & Confection
  'Honey': 'Sweet & Confection',
  'Spring Honey': 'Sweet & Confection',
  'Maple Syrup': 'Sweet & Confection',
  'Caramel': 'Sweet & Confection',
  'Vanilla': 'Sweet & Confection',
  'Vanilla Bean': 'Sweet & Confection',
  'Vanilla Cream': 'Sweet & Confection',
  'Cacao': 'Sweet & Confection',
  'Raw Sugar': 'Sweet & Confection',
  'Sugar Cane': 'Sweet & Confection',
  'Baklava': 'Sweet & Confection',
  'Hard Candy': 'Sweet & Confection',
  'Milk Candy': 'Sweet & Confection',
  'Haw Flake': 'Sweet & Confection',
  'Cinnamon French Toast': 'Sweet & Confection',
}

// Sorted flat list — consumed by the autocomplete datalist in the edit form.
export const FLAVOR_REGISTRY = Object.keys(FLAVOR_MAP).sort()

// Hue-separated palette. Each family gets a distinct hue (not just lightness)
// per feedback_design_conventions: two colors in the same hue family at
// different saturation read as "the same color."
const FAMILY_COLORS: Record<FlavorFamily | 'Other', string> = {
  'Citrus':             '#B8A247', // warm gold
  'Stone Fruit':        '#C67B68', // coral
  'Berry':              '#8B3B4B', // burgundy (matches brew-cover burgundy)
  'Tropical':           '#D88248', // warm orange
  'Grape & Wine':       '#5C3A6B', // deep purple
  'Floral':             '#4A8B7C', // teal (matches brew-cover floral teal)
  'Tea & Herbal':       '#6B7B4A', // moss green
  'Sweet & Confection': '#8B5A3C', // warm brown
  'Other':              '#5C6570', // neutral slate
}

export function getFamilyColor(family: FlavorFamily | 'Other' | string): string {
  return FAMILY_COLORS[family as FlavorFamily | 'Other'] || FAMILY_COLORS.Other
}

// ---------------------------------------------------------------------------
// Classification — exact → case-insensitive → longest canonical substring
// ---------------------------------------------------------------------------

// Pre-built lowercase lookup for tier 2.
const LOWER_LOOKUP: Map<string, FlavorFamily> = new Map(
  Object.entries(FLAVOR_MAP).map(([k, v]) => [k.toLowerCase(), v])
)

// Canonical keys sorted longest-first for substring matching. Longest match
// wins so "Stone Fruit" beats "Fruit" (if both were in the registry).
const SUBSTRING_KEYS: Array<{ lower: string; family: FlavorFamily }> = Object.entries(FLAVOR_MAP)
  .map(([k, v]) => ({ lower: k.toLowerCase(), family: v }))
  .sort((a, b) => b.lower.length - a.lower.length)

export function getFlavorFamily(note: string | null | undefined): FlavorFamily | 'Other' {
  if (!note) return 'Other'
  const trimmed = note.trim()
  if (!trimmed) return 'Other'

  // Tier 1: exact
  const exact = FLAVOR_MAP[trimmed]
  if (exact) return exact

  // Tier 2: case-insensitive
  const ci = LOWER_LOOKUP.get(trimmed.toLowerCase())
  if (ci) return ci

  // Tier 3: longest canonical substring contained in the note
  // Only match on word boundaries via simple includes — short canonical
  // names like "cup" don't exist in the registry, so false matches are rare.
  const lowerNote = trimmed.toLowerCase()
  for (const entry of SUBSTRING_KEYS) {
    if (lowerNote.includes(entry.lower)) return entry.family
  }

  return 'Other'
}

// Suggest the closest canonical name for a non-registry input — used by the
// edit form's flavor-chip input to surface "not canonical — did you mean X?"
// Strategy: prefer a canonical whose lowercase form is a substring of the
// input (or vice versa); otherwise pick the canonical with the smallest
// length-delta that shares a prefix. Returns null when nothing is close.
export function findClosestFlavor(input: string | null | undefined): string | null {
  if (!input) return null
  const trimmed = input.trim()
  if (!trimmed) return null
  const lower = trimmed.toLowerCase()

  if (FLAVOR_MAP[trimmed] || LOWER_LOOKUP.get(lower)) return null // already canonical

  // Substring both directions
  for (const canonical of FLAVOR_REGISTRY) {
    const cl = canonical.toLowerCase()
    if (lower.includes(cl) || cl.includes(lower)) return canonical
  }

  // Prefix match, pick shortest
  const prefixed = FLAVOR_REGISTRY
    .filter((c) => c.toLowerCase().startsWith(lower.slice(0, Math.min(3, lower.length))))
    .sort((a, b) => a.length - b.length)
  return prefixed[0] ?? null
}

export function isCanonicalFlavor(note: string | null | undefined): boolean {
  if (!note) return false
  const trimmed = note.trim()
  if (!trimmed) return false
  return !!FLAVOR_MAP[trimmed] || LOWER_LOOKUP.has(trimmed.toLowerCase())
}

// ---------------------------------------------------------------------------
// Aggregation helper — used by all 3 aggregation detail pages
// ---------------------------------------------------------------------------

// Count flavor_notes across a list of brews and return [note, count] pairs
// sorted by count descending. Consumed by FlavorNotesByFamily which re-groups
// by family at render time.
export function aggregateFlavorNotes(
  brews: Array<{ flavor_notes: string[] | null }>
): [string, number][] {
  const counts: Record<string, number> = {}
  for (const brew of brews) {
    for (const note of brew.flavor_notes || []) {
      counts[note] = (counts[note] || 0) + 1
    }
  }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])
}
