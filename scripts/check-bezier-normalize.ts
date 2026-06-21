// check:bezier-normalize — unit guard for normalizeBezier (lib/roast-import.ts).
//
// Regression test for the string-coerced-jsonb bug: MCP clients with a stale
// published catalog serialize the z.unknown() bezier array args as JSON strings,
// which were persisted verbatim into the jsonb columns (the 3 AN10 V2 recipe
// rows, 2026-06-21). normalizeBezier parses them back to arrays at the persist
// chokepoint. Pure-function test — no DB, no network. Exits non-zero on failure.

import { normalizeBezier } from '../lib/roast-import'

let failures = 0
function check(name: string, fn: () => void) {
  try {
    fn()
    console.log(`  ok   ${name}`)
  } catch (e) {
    failures++
    console.error(`  FAIL ${name}: ${e instanceof Error ? e.message : String(e)}`)
  }
}
function eq(actual: unknown, expected: unknown) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`)
  }
}
function throws(fn: () => void) {
  let threw = false
  try {
    fn()
  } catch {
    threw = true
  }
  if (!threw) throw new Error('expected a throw, got none')
}

const CANON_TEMP = [[0, 195], [75000, 233], [150000, 241], [195000, 242], [240000, 239], [300000, 235], [360000, 231], [420000, 228]]

console.log('normalizeBezier:')

// Pass-through cases — idempotent on the shapes the column already accepts.
check('null -> null', () => eq(normalizeBezier(null, 'f'), null))
check('undefined -> undefined', () => eq(normalizeBezier(undefined, 'f'), undefined))
check('array -> same array (idempotent)', () => eq(normalizeBezier(CANON_TEMP, 'f'), CANON_TEMP))
check('empty array -> empty array', () => eq(normalizeBezier([], 'f'), []))

// The bug: a JSON string of the array gets parsed back to the array.
check('stringified array -> array', () =>
  eq(normalizeBezier(JSON.stringify(CANON_TEMP), 'temperature_bezier'), CANON_TEMP))
check('stringified rpm -> array', () =>
  eq(normalizeBezier('[[0, 65], [720000, 65]]', 'rpm_bezier'), [[0, 65], [720000, 65]]))
check('double normalize is stable', () =>
  eq(normalizeBezier(normalizeBezier(JSON.stringify(CANON_TEMP), 'f'), 'f'), CANON_TEMP))

// Edge / defensive cases.
check('blank string -> null', () => eq(normalizeBezier('   ', 'f'), null))
check('non-JSON string throws', () => throws(() => normalizeBezier('not json', 'f')))
check('JSON scalar string (non-array) throws', () => throws(() => normalizeBezier('195', 'f')))
check('JSON object string (non-array) throws', () => throws(() => normalizeBezier('{"a":1}', 'f')))

if (failures > 0) {
  console.error(`\n${failures} failure(s).`)
  process.exit(1)
}
console.log('\nAll normalizeBezier checks passed.')
