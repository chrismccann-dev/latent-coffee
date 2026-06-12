// Lifecycle-consistency gate (Lot Coordinator dogfood, migration 080 / ADR-0024 § 6).
//
// Run via:
//   npm run check:lifecycle-consistency
//
// The stored green_beans.lot_status moved the lifecycle off derive-on-read, but
// the derived logic in lib/lifecycle-state.ts survives as the VALIDATOR — this
// script recovers derived's can't-drift virtue for the stored column. For every
// lot it compares the stored lot_status against what the lot's rows imply
// (computeLifecycleState) and flags disagreement.
//
// Verdicts per lot:
//   legacy   - lot_status NULL (pre-080 row; renders via the derived fallback).
//     Informational, never fails. In-flight claude.ai lots live here until
//     their next MCP write starts maintaining the column.
//   ok       - stored === derived, OR the one DESIGNED exception: stored
//     'waiting_for_brewing' where derived says 'waiting_for_next_roast'.
//     Derivation is blind to the brewing handoff (no row to derive from —
//     the reason the stored column exists), and a fully-cupped V-set with a
//     landed winner derives to waiting_for_next_roast; the pair is exactly
//     "Coordinator routed to brewing."
//   MISMATCH - anything else, including a stored value outside
//     LOT_STATUS_VALUES. Exit 1.
//
// Exits 0 when clean, 1 on mismatch, 2 on fatal (missing secret = cannot
// verify = FAIL, not skip — same policy as check:migrations).

import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  computeLifecycleState,
  LOT_STATUS_VALUES,
  type LifecycleInputs,
} from '../lib/lifecycle-state'

const REPO_ROOT = resolve(__dirname, '..')

function loadDotenvLocal(): void {
  const candidates = [
    resolve(REPO_ROOT, '.env.local'),
    resolve(REPO_ROOT, '..', '..', '..', '.env.local'),
  ]
  for (const p of candidates) {
    if (!existsSync(p)) continue
    for (const line of readFileSync(p, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
      if (!m) continue
      const k = m[1]
      const v = m[2].replace(/^["']|["']$/g, '')
      if (!(k in process.env)) process.env[k] = v
    }
    break
  }
}

loadDotenvLocal()

type LotRow = LifecycleInputs & {
  id: string
  lot_id: string | null
  name: string | null
  lot_status: string | null
}

async function main(): Promise<number> {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error(
      'FAIL: SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_URL not set - cannot read green_beans to verify lifecycle consistency.',
    )
    console.error('This is a hard failure, not a skip. Configure the secret (CI) or .env.local (local) and re-run.')
    return 2
  }

  // Lazy import so the missing-secret path above prints its message even if
  // the service-client module ever grows env-eager initialization.
  const { createServiceClient } = await import('../lib/supabase/service')

  let lots: LotRow[]
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('green_beans')
      .select(
        `
        id, lot_id, name, lot_status,
        experiments(id, batch_ids, winner, created_at),
        roasts(id, batch_id, cuppings(id)),
        roast_learnings(id, why_this_roast_won)
      `,
      )
      .order('created_at', { ascending: true })
    if (error) throw error
    lots = (data ?? []) as unknown as LotRow[]
  } catch (err) {
    console.error('Failed to read green_beans:', err instanceof Error ? err.message : err)
    console.error('If the column is missing, apply migration 080_lot_status.sql first.')
    return 2
  }

  const validValues = LOT_STATUS_VALUES as readonly string[]
  let okCount = 0
  let legacyCount = 0
  const mismatches: string[] = []

  for (const lot of lots) {
    const label = `${lot.lot_id ?? lot.id}${lot.name ? ` (${lot.name})` : ''}`
    const stored = lot.lot_status
    const derived = computeLifecycleState(lot)

    if (stored == null) {
      legacyCount++
      continue
    }
    if (!validValues.includes(stored)) {
      mismatches.push(`${label}: stored '${stored}' is not a valid lot_status value`)
      continue
    }
    const designedException = stored === 'waiting_for_brewing' && derived === 'waiting_for_next_roast'
    if (stored === derived || designedException) {
      okCount++
      continue
    }
    mismatches.push(`${label}: stored '${stored}' but rows imply '${derived}'`)
  }

  if (mismatches.length === 0) {
    console.log(
      `lifecycle-consistency OK - ${lots.length} lot(s): ${okCount} consistent, ${legacyCount} legacy (NULL, derived fallback).`,
    )
    return 0
  }

  console.log(`\n${mismatches.length} lifecycle mismatch(es) - stored lot_status disagrees with what the rows imply:`)
  for (const m of mismatches) console.log(`  - ${m}`)
  console.log(
    '\nFix: the stored value transitions ONLY through the MCP write path (lib/roast-import.ts setLotStatus call sites)',
  )
  console.log(
    'or a deliberate patch_green_bean({lot_status}). Re-trace the last write for each lot above; correct via patch_green_bean.',
  )
  return 1
}

main().then((code) => process.exit(code))
