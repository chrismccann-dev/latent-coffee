// Permanent guard against regression of the REDPLUM-CAS-2026 V4 lifecycle
// drift (confirmed 2026-06-17).
//
// Background: computeLifecycleState decided whether the latest experiment "has
// roasts" by parsing the experiment's free-text `batch_ids` column and matching
// the tokens against roasts.batch_id. That string is hand-maintained and can
// drift from the authoritative experiment↔batch link (roasts.recipe_id →
// roast_recipes.id → roast_recipes.experiment_id). REDPLUM's V4 experiment was
// created with batch_ids = NULL, then 4 roasts were pushed whose roast_recipes
// correctly carried experiment_id = "V4". batch_ids being null, the derivation
// matched ZERO roasts and fell through to waiting_for_next_roast, disagreeing
// with the (correct) stored waiting_for_next_cupping and reddening the
// check:lifecycle-consistency gate.
//
// The fix (lib/lifecycle-state.ts) makes the recipe_id → experiment_id FK chain
// the authoritative match, keeping batch_ids as a graceful fallback. This script
// exercises computeLifecycleState directly so a future refactor can't silently
// revert the FK path. Pure logic — no DB, no secret. Exits 0 on green, 1 with a
// per-case report on red.
//
// Run via:
//   npm run check:lifecycle-derivation

import {
  computeLifecycleState,
  type LifecycleInputs,
  type LifecycleState,
} from '../lib/lifecycle-state'

// Each case is pure input → expected derived state, so a data table beats
// per-case closures (cf. check-terroir-resolver.ts, whose cases carry custom
// multi-step logic and so keep the closure form).
interface Case {
  name: string
  inputs: LifecycleInputs
  expected: LifecycleState
}

const cases: Case[] = [
  {
    // The exact REDPLUM V4 shape: experiment label "V4", batch_ids null, 4
    // roasts linked via recipe_id → roast_recipes(experiment_id = "V4"), no
    // cuppings logged, no winner yet. Pre-fix this derived waiting_for_next_roast.
    name: 'REGRESSION: latest experiment with batch_ids=NULL whose roasts link via recipe_id derives waiting_for_next_cupping',
    inputs: {
      experiments: [
        { id: 'exp-v4', experiment_id: 'V4', batch_ids: null, winner: null, created_at: '2026-06-17T00:00:00Z' },
      ],
      roasts: [
        { id: 'r210', batch_id: '210', recipe_id: 'rec-a', cuppings: [] },
        { id: 'r211', batch_id: '211', recipe_id: 'rec-b', cuppings: [] },
        { id: 'r212', batch_id: '212', recipe_id: 'rec-c', cuppings: [] },
        { id: 'r213', batch_id: '213', recipe_id: 'rec-d', cuppings: [] },
      ],
      roast_recipes: [
        { id: 'rec-a', experiment_id: 'V4' },
        { id: 'rec-b', experiment_id: 'V4' },
        { id: 'rec-c', experiment_id: 'V4' },
        { id: 'rec-d', experiment_id: 'V4' },
      ],
    },
    expected: 'waiting_for_next_cupping',
  },
  {
    // FK-linked roasts feed the cupping gate too: fully cupped + winner → the
    // V_(n+1) loop back to the roast wait.
    name: 'FK-linked roasts feed the cupping gate: cuppings + winner present derives waiting_for_next_roast',
    inputs: {
      experiments: [
        { id: 'exp-v4', experiment_id: 'V4', batch_ids: null, winner: 'v4b', created_at: '2026-06-17T00:00:00Z' },
      ],
      roasts: [
        { id: 'r210', batch_id: '210', recipe_id: 'rec-a', cuppings: [{ id: 'c1' }] },
        { id: 'r211', batch_id: '211', recipe_id: 'rec-b', cuppings: [{ id: 'c2' }] },
      ],
      roast_recipes: [
        { id: 'rec-a', experiment_id: 'V4' },
        { id: 'rec-b', experiment_id: 'V4' },
      ],
    },
    expected: 'waiting_for_next_roast',
  },
  {
    name: 'latest experiment with no roasts (no recipe linkage, no batch_ids) derives waiting_for_next_roast',
    inputs: {
      experiments: [
        { id: 'exp-v2', experiment_id: 'V2', batch_ids: null, winner: null, created_at: '2026-06-17T00:00:00Z' },
      ],
      roasts: [],
      roast_recipes: [],
    },
    expected: 'waiting_for_next_roast',
  },
  {
    // Two experiments. V1's roasts link via recipe to V1; V2 (latest, batch_ids
    // null) has nothing. The latest must read as waiting_for_next_roast — the
    // V1 roasts must not be miscounted as V2's.
    name: 'prior-experiment roasts do NOT count toward the latest: latest V2 has no roasts of its own',
    inputs: {
      experiments: [
        { id: 'exp-v1', experiment_id: 'V1', batch_ids: '101, 102', winner: 'v1a', created_at: '2026-06-01T00:00:00Z' },
        { id: 'exp-v2', experiment_id: 'V2', batch_ids: null, winner: null, created_at: '2026-06-17T00:00:00Z' },
      ],
      roasts: [
        { id: 'r101', batch_id: '101', recipe_id: 'rec-v1a', cuppings: [{ id: 'c1' }] },
        { id: 'r102', batch_id: '102', recipe_id: 'rec-v1b', cuppings: [{ id: 'c2' }] },
      ],
      roast_recipes: [
        { id: 'rec-v1a', experiment_id: 'V1' },
        { id: 'rec-v1b', experiment_id: 'V1' },
      ],
    },
    expected: 'waiting_for_next_roast',
  },
  {
    // The legacy path — caller did not join roast_recipes. batch_ids carries
    // the link; the derivation must still match via the fallback.
    name: 'BACK-COMPAT: batch_ids fallback still matches when no recipe linkage is supplied',
    inputs: {
      experiments: [
        { id: 'exp-v3', experiment_id: 'V3', batch_ids: '180, 181, 182', winner: null, created_at: '2026-05-01T00:00:00Z' },
      ],
      roasts: [
        { id: 'r180', batch_id: '180', recipe_id: null, cuppings: [] },
        { id: 'r181', batch_id: '181', recipe_id: null, cuppings: [] },
      ],
      // roast_recipes deliberately omitted (legacy caller).
    },
    expected: 'waiting_for_next_cupping',
  },
  {
    name: 'no experiments + no roasts derives in_inventory (unchanged)',
    inputs: { experiments: [], roasts: [], roast_recipes: [] },
    expected: 'in_inventory',
  },
  {
    name: 'roast_learnings with verdict derives resolved (close-out branch unchanged)',
    inputs: {
      experiments: [{ id: 'exp-v4', experiment_id: 'V4', batch_ids: null, winner: 'v4b', created_at: '2026-06-17T00:00:00Z' }],
      roasts: [{ id: 'r210', batch_id: '210', recipe_id: 'rec-a', cuppings: [{ id: 'c1' }] }],
      roast_recipes: [{ id: 'rec-a', experiment_id: 'V4' }],
      roast_learnings: { id: 'rl-1', why_this_roast_won: 'Batch 210 held the floral top note through the cooling arc.' },
    },
    expected: 'resolved',
  },
]

const failures: { name: string; reason: string }[] = []
for (const c of cases) {
  const got = computeLifecycleState(c.inputs)
  if (got !== c.expected) failures.push({ name: c.name, reason: `expected ${c.expected}; got ${got}` })
}

if (failures.length === 0) {
  console.log(`check-lifecycle-derivation: ${cases.length}/${cases.length} cases passing`)
  process.exit(0)
}

console.error('check-lifecycle-derivation: regressions detected')
console.error('')
for (const f of failures) {
  console.error(`  FAIL  ${f.name}`)
  console.error(`        ${f.reason}`)
  console.error('')
}
console.error(`${failures.length}/${cases.length} cases failed`)
process.exit(1)
