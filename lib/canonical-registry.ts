// Shared factory for canonical name registries (flavor / producer / roaster /
// terroir / cultivar). Returns a bundle of `list`, `isCanonical`, and
// `findClosest` over a given name array. Each registry file wraps this factory
// and re-exports the parts its call sites expect.
//
// `findClosest` strategy, in order:
//   0. explicit alias map  (optional — for trade-name drift like "Geisha" → "Gesha")
//   1. canonical short-circuit  (input already canonical → null)
//   2. substring match, either direction
//   3. 3-char prefix match, shortest canonical wins
//
// Aliases are "we know what you mean but write the canonical form." They
// intentionally do NOT make `isCanonical` return true — the sync surfaces
// the suggestion so Chris can canonicalize on write.

export interface CanonicalLookup {
  list: readonly string[]
  isCanonical: (input: string | null | undefined) => boolean
  findClosest: (input: string | null | undefined) => string | null
  // True when the input is either canonical or resolvable to a canonical via
  // alias/substring/prefix — i.e. safe to accept for strict registries that
  // canonicalize on write (cultivars). Empty input is treated as resolvable
  // so callers can use it to gate a "Save" button without forcing a value.
  isResolvable: (input: string | null | undefined) => boolean
  // Resolution order: case-insensitive canonical → alias → substring →
  // 3-char prefix. Returns the registry's title-case form so DB writes
  // never drift in case. Null when unresolvable.
  canonicalize: (input: string | null | undefined) => string | null
}

export function makeCanonicalLookup(
  registry: readonly string[],
  aliases: Readonly<Record<string, string>> = {},
): CanonicalLookup {
  const lowerRegistry = registry.map((r) => r.toLowerCase())
  const lowerLookup = new Set(lowerRegistry)
  const lowerAliases = new Map<string, string>(
    Object.entries(aliases).map(([k, v]) => [k.toLowerCase(), v]),
  )

  function isCanonical(input: string | null | undefined): boolean {
    if (!input) return false
    const trimmed = input.trim()
    if (!trimmed) return false
    return lowerLookup.has(trimmed.toLowerCase())
  }

  function findClosest(input: string | null | undefined): string | null {
    if (!input) return null
    const trimmed = input.trim()
    if (!trimmed) return null
    const lower = trimmed.toLowerCase()
    if (lowerLookup.has(lower)) return null

    const alias = lowerAliases.get(lower)
    if (alias) return alias

    for (let i = 0; i < registry.length; i++) {
      const cl = lowerRegistry[i]
      if (lower.includes(cl) || cl.includes(lower)) return registry[i]
    }

    const prefix = lower.slice(0, Math.min(3, lower.length))
    let best: string | null = null
    let bestLen = Infinity
    for (let i = 0; i < registry.length; i++) {
      if (lowerRegistry[i].startsWith(prefix) && registry[i].length < bestLen) {
        best = registry[i]
        bestLen = registry[i].length
      }
    }
    return best
  }

  function isResolvable(input: string | null | undefined): boolean {
    if (!input) return true
    const trimmed = input.trim()
    if (!trimmed) return true
    return isCanonical(trimmed) || findClosest(trimmed) !== null
  }

  function canonicalize(input: string | null | undefined): string | null {
    if (!input) return null
    const trimmed = input.trim()
    if (!trimmed) return null
    const lower = trimmed.toLowerCase()

    // Case-insensitive canonical match → return registry title-case form.
    for (let i = 0; i < registry.length; i++) {
      if (lowerRegistry[i] === lower) return registry[i]
    }

    // Alias match → return alias target (already canonical form).
    const alias = lowerAliases.get(lower)
    if (alias) return alias

    // Substring (either direction).
    for (let i = 0; i < registry.length; i++) {
      const cl = lowerRegistry[i]
      if (lower.includes(cl) || cl.includes(lower)) return registry[i]
    }

    // 3-char prefix, shortest canonical wins.
    const prefix = lower.slice(0, Math.min(3, lower.length))
    let best: string | null = null
    let bestLen = Infinity
    for (let i = 0; i < registry.length; i++) {
      if (lowerRegistry[i].startsWith(prefix) && registry[i].length < bestLen) {
        best = registry[i]
        bestLen = registry[i].length
      }
    }
    return best
  }

  return { list: registry, isCanonical, findClosest, isResolvable, canonicalize }
}
