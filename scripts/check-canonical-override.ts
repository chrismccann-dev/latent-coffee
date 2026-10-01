// Regression gate for the override-vs-prefix write bug (2026-10-01).
//
// Run via:
//   npm run check:canonical-override
//
// The canonical-registry factory's `canonicalize()` falls through
// alias -> substring -> 3-char prefix (shortest canonical wins). Before the fix,
// push_brew / patch_brew ran that loose matcher BEFORE consulting
// `<field>_override`, so a net-new "Wilder Lazo" with producer_override: true
// still landed as "Wilton Benitez" (brew 23b48be7). Under override the write
// paths must now use `canonicalizeExact()` (exact canonical / explicit alias
// only) and otherwise persist the raw trimmed value.
//
// Three layers are asserted, each against the real lib code (no mocks):
//   1. the factory (`makeCanonicalLookup`) on a synthetic registry,
//   2. the push-path helper (`findOrCreateProducer`, same helper the
//      green-bean / roast producer paths use),
//   3. the patch-path helper (`patchBrew`) driven with a stub Supabase client
//      so the canonicalization step runs without a DB.
//
// Exits 0 when every case passes, 1 with a per-case report otherwise.

import { makeCanonicalLookup } from '../lib/canonical-registry'
import { findOrCreateProducer, findOrCreateRoaster, patchBrew } from '../lib/brew-import'
import { PRODUCER_LOOKUP } from '../lib/producer-registry'
import { ROASTER_LOOKUP } from '../lib/roaster-registry'
import { BREWER_LOOKUP } from '../lib/brewer-registry'
import { FILTER_LOOKUP } from '../lib/filter-registry'
import { GRINDER_LOOKUP } from '../lib/grinder-registry'

const failures: string[] = []
function expect(label: string, actual: unknown, expected: unknown) {
  if (actual !== expected) failures.push(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`)
}

// 1. Factory layer - synthetic registry reproducing the attractor shape.
const lookup = makeCanonicalLookup(['Wilton Benitez', 'Finca Sophia'], { 'Finca Soledad': 'Pepe Jijón' })
expect('factory loose: prefix attractor still fires without override', lookup.canonicalize('Wilder Lazo'), 'Wilton Benitez')
expect('factory exact: prefix match rejected', lookup.canonicalizeExact('Wilder Lazo'), null)
expect('factory exact: substring match rejected', lookup.canonicalizeExact('Finca'), null)
expect('factory exact: case-insensitive canonical accepted', lookup.canonicalizeExact('wilton benitez'), 'Wilton Benitez')
expect('factory exact: explicit alias accepted', lookup.canonicalizeExact('finca soledad'), 'Pepe Jijón')

// 2. Push path - the real producer registry. Pick a name that is NOT canonical
// and NOT aliased but shares a 3-char prefix with a canonical, so the loose
// matcher resolves it while the strict one does not.
function pickAttractorVictim(list: readonly string[], lk: typeof PRODUCER_LOOKUP): string | null {
  for (const canon of list) {
    const victim = `${canon.slice(0, 3)}zzq Regression`
    if (lk.canonicalizeExact(victim) === null && lk.canonicalize(victim) !== null) return victim
  }
  return null
}
const victim = pickAttractorVictim(PRODUCER_LOOKUP.list, PRODUCER_LOOKUP)
if (!victim) {
  failures.push('push: could not construct a prefix-attractor victim against PRODUCER_LOOKUP')
} else {
  const loose = findOrCreateProducer(victim)
  expect('push no-override: loose matcher still resolves', loose.ok && loose.canonicalName !== victim, true)
  const strict = findOrCreateProducer(victim, { allowOverride: true })
  expect('push override: raw value persisted', strict.ok ? strict.canonicalName : strict.error, victim)
  expect('push override: queued for arbiter', strict.ok ? strict.needsQueue : null, true)
}
// Exact canonical under override still canonicalizes (title-case form).
const exactUnderOverride = findOrCreateProducer('wilton benitez', { allowOverride: true })
expect('push override: exact canonical still resolves', exactUnderOverride.ok ? exactUnderOverride.canonicalName : null, 'Wilton Benitez')
expect('push override: exact canonical not queued', exactUnderOverride.ok ? exactUnderOverride.needsQueue : null, false)
// Explicit alias under override still canonicalizes.
const aliasUnderOverride = findOrCreateProducer('La Dinastia', { allowOverride: true })
expect('push override: explicit alias still resolves', aliasUnderOverride.ok ? aliasUnderOverride.canonicalName : null, 'Wilder Lazo')
// The observed case itself now resolves exactly (registry entry landed).
const wilder = findOrCreateProducer('Wilder Lazo')
expect('push: "Wilder Lazo" is now canonical', wilder.ok ? wilder.canonicalName : wilder.error, 'Wilder Lazo')
// Roaster path shares the helper - spot-check one override write.
const roasterVictim = pickAttractorVictim(ROASTER_LOOKUP.list, ROASTER_LOOKUP)
if (roasterVictim) {
  const r = findOrCreateRoaster(roasterVictim, { allowOverride: true })
  expect('push roaster override: raw value persisted', r.ok ? r.canonicalName : r.error, roasterVictim)
}

// 3. Patch path - drive patchBrew with a stub client. All five overridable
// fields in one body; the stub captures the UPDATE payload.
async function runPatchCase() {
  const fields: Array<[string, typeof PRODUCER_LOOKUP]> = [
    ['roaster', ROASTER_LOOKUP],
    ['producer', PRODUCER_LOOKUP],
    ['grinder', GRINDER_LOOKUP],
    ['brewer', BREWER_LOOKUP],
    ['filter', FILTER_LOOKUP],
  ]
  const body: Record<string, unknown> = {}
  const expected: Record<string, string> = {}
  for (const [field, lk] of fields) {
    const v = pickAttractorVictim(lk.list, lk)
    if (!v) {
      failures.push(`patch: could not construct a prefix-attractor victim for ${field}`)
      continue
    }
    body[field] = `  ${v}  `
    body[`${field}_override`] = true
    expected[field] = v
  }
  const holder: { captured: Record<string, unknown> | null } = { captured: null }
  const stub = {
    from: () => ({
      update: (payload: Record<string, unknown>) => {
        holder.captured = payload
        return {
          eq: () => ({
            eq: () => ({
              select: () => ({
                single: async () => ({ data: { id: 'stub' }, error: null }),
              }),
            }),
          }),
        }
      },
    }),
  }
  const res = await patchBrew(stub as never, 'user', 'brew', body)
  expect('patch: result ok', res.ok, true)
  if (!res.ok) failures.push(`patch: ${JSON.stringify(res)}`)
  for (const [field, v] of Object.entries(expected)) {
    expect(`patch override ${field}: raw trimmed value persisted`, holder.captured?.[field], v)
  }
  // No override on the same victim -> loose matcher applies.
  holder.captured = null as Record<string, unknown> | null
  const resLoose = await patchBrew(stub as never, 'user', 'brew', { producer: expected.producer })
  expect('patch no-override: ok', resLoose.ok, true)
  const looseProducer = (holder.captured as Record<string, unknown> | null)?.producer
  expect('patch no-override: loose matcher still resolves', typeof looseProducer === 'string' && looseProducer !== expected.producer, true)
}

runPatchCase().then(() => {
  if (failures.length) {
    console.error(`check:canonical-override FAILED (${failures.length})`)
    for (const f of failures) console.error(`  - ${f}`)
    process.exit(1)
  }
  console.log('check:canonical-override OK - override writes bypass the substring / prefix matcher on push + patch for all five overridable fields')
})
