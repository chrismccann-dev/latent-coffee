// Permanent guard against regression of the Item 22 cross-country fuzzy-match
// bug (Sprint R Phase 4 Step 4 Group 2 grill, 2026-05-24).
//
// Background: `findOrCreateTerroir` previously called the country-agnostic
// `TERROIR_MACRO_LOOKUP.findClosest` and could surface a wrong-country macro
// as the suggestion (e.g. "Minas Gerais" for Brazil cross-matching to
// "Mindanao Highlands" from the Philippines because they're alphabetically
// adjacent globally). The fix introduces `canonicalizeMacroInCountry` which
// scopes the resolver candidates to macros registered for the supplied
// country and `macrosForAdminRegion` which surfaces useful in-country guidance
// when the caller typed an admin_region as if it were a macro.
//
// This script exercises the new helpers via direct TS import so a future
// refactor can't silently revert the scoping without one of these cases
// failing. Exits 0 on green, 1 with a per-case report on red.
//
// Run via:
//   npm run check:terroir-resolver

import {
  canonicalizeMacroInCountry,
  macrosForAdminRegion,
  adminRegionsForCountry,
  getTerroirEntry,
  resolveTerroirMacro,
} from '../lib/terroir-registry'

interface Check {
  name: string
  run: () => string | null
}

const checks: Check[] = [
  {
    name: 'admin_region typed as macro for Brazil rejects without cross-country drift',
    run: () => {
      const result = canonicalizeMacroInCountry('Brazil', 'Minas Gerais')
      if (result !== null) {
        return `expected null (Minas Gerais is an admin_region, not a macro); got "${result}"`
      }
      const macroAgnostic = resolveTerroirMacro('Minas Gerais')
      if (macroAgnostic && macroAgnostic.country !== 'Brazil') {
        // The country-agnostic resolver may still surface drift hints (e.g.
        // returning a Mindanao Highlands entry under the Philippines); the
        // country-scoped path must NOT inherit that and must return null.
      }
      return null
    },
  },
  {
    name: 'admin_region hint surfaces every Brazil macro whose admin_region includes Minas Gerais',
    run: () => {
      const hint = macrosForAdminRegion('Brazil', 'Minas Gerais')
      // Cerrado Mineiro (admin_region "Minas Gerais"), Mantiqueira Highlands
      // ("Minas Gerais / São Paulo"), and Mogiana Highlands ("São Paulo /
      // Minas Gerais") all span Minas Gerais via substring match — all three
      // are legitimate hints for a caller who typed "Minas Gerais".
      const expected = new Set(['Cerrado Mineiro', 'Mantiqueira Highlands', 'Mogiana Highlands'])
      const actual = new Set(hint)
      const missing = Array.from(expected).filter((m) => !actual.has(m))
      const extra = Array.from(actual).filter((m) => !expected.has(m))
      if (missing.length > 0 || extra.length > 0) {
        return `expected ${Array.from(expected).join(', ')}; got ${Array.from(actual).join(', ')}`
      }
      return null
    },
  },
  {
    name: 'cross-country drift candidate "Sidama" typed under Panama returns null (no Ethiopia leak)',
    run: () => {
      const result = canonicalizeMacroInCountry('Panama', 'Sidama Highlands')
      if (result !== null) {
        return `expected null (Sidama Highlands is Ethiopia, not Panama); got "${result}"`
      }
      return null
    },
  },
  {
    name: 'valid canonical macro for Panama resolves cleanly',
    run: () => {
      const result = canonicalizeMacroInCountry('Panama', 'Volcán Barú Highlands')
      if (result !== 'Volcán Barú Highlands') {
        return `expected "Volcán Barú Highlands"; got "${result ?? 'null'}"`
      }
      return null
    },
  },
  {
    name: 'ASCII alias "Volcan Baru Highlands" still resolves for Panama (country-scoped alias kept)',
    run: () => {
      const result = canonicalizeMacroInCountry('Panama', 'Volcan Baru Highlands')
      if (result !== 'Volcán Barú Highlands') {
        return `expected "Volcán Barú Highlands" via alias; got "${result ?? 'null'}"`
      }
      return null
    },
  },
  {
    name: 'cross-country alias does NOT resolve under wrong country (alias map is country-scoped)',
    run: () => {
      // "Volcan Baru Highlands" is the Panama-targeted alias. Under any
      // non-Panama country, it must return null.
      const result = canonicalizeMacroInCountry('Brazil', 'Volcan Baru Highlands')
      if (result !== null) {
        return `expected null (Panama alias must not resolve under Brazil); got "${result}"`
      }
      return null
    },
  },
  {
    name: 'unknown country returns null cleanly',
    run: () => {
      const result = canonicalizeMacroInCountry('Atlantis', 'Cerrado Mineiro')
      if (result !== null) {
        return `expected null (Atlantis is not a registered country); got "${result}"`
      }
      return null
    },
  },
  {
    name: 'empty input returns null',
    run: () => {
      const a = canonicalizeMacroInCountry('Brazil', '')
      const b = canonicalizeMacroInCountry('', 'Cerrado Mineiro')
      const c = canonicalizeMacroInCountry(null, null)
      if (a !== null || b !== null || c !== null) {
        return `expected null on empty input; got a=${a}, b=${b}, c=${c}`
      }
      return null
    },
  },
  {
    name: 'getTerroirEntry pair lookup confirms the country-scoped canonical roundtrip',
    run: () => {
      const canonical = canonicalizeMacroInCountry('Brazil', 'Cerrado Mineiro')
      if (canonical === null) return 'canonicalizeMacroInCountry returned null for valid macro'
      const entry = getTerroirEntry('Brazil', canonical)
      if (!entry) return `getTerroirEntry returned null for ("Brazil", "${canonical}")`
      if (entry.country !== 'Brazil') return `expected Brazil; got ${entry.country}`
      return null
    },
  },
  {
    name: 'adminRegionsForCountry returns at least one admin_region per registered country',
    run: () => {
      const brazil = adminRegionsForCountry('Brazil')
      if (brazil.length === 0) return 'expected at least one admin_region for Brazil'
      const colombia = adminRegionsForCountry('Colombia')
      if (colombia.length === 0) return 'expected at least one admin_region for Colombia'
      return null
    },
  },
]

const failures: { name: string; reason: string }[] = []
for (const c of checks) {
  const reason = c.run()
  if (reason) failures.push({ name: c.name, reason })
}

if (failures.length === 0) {
  console.log(`check-terroir-resolver: ${checks.length}/${checks.length} cases passing`)
  process.exit(0)
}

console.error('check-terroir-resolver: regressions detected')
console.error('')
for (const f of failures) {
  console.error(`  FAIL  ${f.name}`)
  console.error(`        ${f.reason}`)
  console.error('')
}
console.error(`${failures.length}/${checks.length} cases failed`)
process.exit(1)
