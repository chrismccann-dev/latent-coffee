// Migration-drift gate (repairs Sprint 3.2 #5).
//
// Run via:
//   npm run check:migrations
//
// Baseline: public.applied_migrations (migration 076). Migrations on this
// project are applied MANUALLY via the Supabase SQL Editor, so the CLI-only
// supabase_migrations.schema_migrations table is empty and was never a valid
// baseline. Instead, each migration records itself in public.applied_migrations
// as its last statement (the >= 076 self-register convention), and this script
// diffs the files on disk against that table.
//
// Flags drift in two directions:
//   pending - local file with NO matching applied row (the recurring failure
//     mode from memory/feedback_migration_drift_pattern.md: PR lands but the
//     migration is never pasted into the Supabase SQL Editor)
//   orphan  - applied row with NO matching local file (rare; a SQL Editor change
//     or registry row that wasn't committed to the repo)
//
// Match is EXACT filename (the registry stores the literal "NNN_name.sql").
//
// Also runs two DB-free checks:
//   self-register lint - every file with prefix >= 076 must contain its own
//     `INSERT INTO public.applied_migrations ... '<filename>'` line, or it would
//     silently produce false drift once applied. Lint failure => exit 1.
//   prefix collisions - two files sharing the same NNN. Reported as a WARNING
//     only (does NOT fail): a genuinely dangerous collision (an UNapplied dupe)
//     is already caught by the pending check, and there is a grandfathered
//     historical collision (prefix 046) that must not permanently block the gate.
//
// Exits 0 when clean. Exits 1 when drift / lint failure exists. Exits 2 on fatal
// error (missing secret => cannot verify => FAIL, not skip; DB unreachable).

import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

const REPO_ROOT = resolve(__dirname, '..')
const MIGRATIONS_DIR = resolve(REPO_ROOT, 'supabase/migrations')
const SELF_REGISTER_CONVENTION_FROM = 76 // files with prefix >= this must self-register

function loadDotenvLocal(): void {
  const candidates = [
    resolve(REPO_ROOT, '.env.local'),
    resolve(REPO_ROOT, '..', '..', '..', '.env.local'),
  ]
  for (const path of candidates) {
    if (!existsSync(path)) continue
    const src = readFileSync(path, 'utf8')
    for (const rawLine of src.split('\n')) {
      const line = rawLine.trim()
      if (!line || line.startsWith('#')) continue
      const eq = line.indexOf('=')
      if (eq < 0) continue
      const k = line.slice(0, eq).trim()
      let v = line.slice(eq + 1).trim()
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1)
      }
      if (!(k in process.env)) process.env[k] = v
    }
  }
}

loadDotenvLocal()

import { createServiceClient } from '../lib/supabase/service'

interface LocalMigration {
  filename: string // "053_green_beans_cleanup_backfill.sql"
  prefix: number | null // 53
}

function parseLocalMigrations(): LocalMigration[] {
  if (!existsSync(MIGRATIONS_DIR)) return []
  return readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort()
    .map((filename) => {
      const m = filename.match(/^(\d+)_/)
      return { filename, prefix: m ? parseInt(m[1], 10) : null }
    })
}

function findCollisions(files: LocalMigration[]): Array<{ prefix: number; filenames: string[] }> {
  const byPrefix = new Map<number, string[]>()
  for (const f of files) {
    if (f.prefix == null) continue
    const list = byPrefix.get(f.prefix) ?? []
    list.push(f.filename)
    byPrefix.set(f.prefix, list)
  }
  return Array.from(byPrefix.entries())
    .filter(([, fs]) => fs.length > 1)
    .map(([prefix, filenames]) => ({ prefix, filenames }))
}

// Files with prefix >= 076 must contain their own self-register INSERT, or they
// produce false "pending" drift after they're applied.
function findMissingSelfRegister(files: LocalMigration[]): string[] {
  const missing: string[] = []
  for (const f of files) {
    if (f.prefix == null || f.prefix < SELF_REGISTER_CONVENTION_FROM) continue
    const text = readFileSync(resolve(MIGRATIONS_DIR, f.filename), 'utf8')
    const hasInsert = /insert\s+into\s+public\.applied_migrations/i.test(text)
    const namesItself = text.includes(`'${f.filename}'`)
    if (!hasInsert || !namesItself) missing.push(f.filename)
  }
  return missing
}

async function main(): Promise<number> {
  const local = parseLocalMigrations()
  if (local.length === 0) {
    console.error('No migration files found under supabase/migrations/')
    return 2
  }

  // DB-free checks run unconditionally.
  const collisions = findCollisions(local)
  const missingSelfRegister = findMissingSelfRegister(local)

  // Fail-not-skip: without the service key we cannot read the applied set, so we
  // cannot verify drift. That is a FAILURE (exit 2), never a silent green skip -
  // the previous skip-green behavior is exactly why migration 069 drifted for 8
  // days. (See memory/feedback_migration_drift_pattern.md.)
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error(
      'FAIL: SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_URL not set - cannot read public.applied_migrations to verify drift.',
    )
    console.error('This is a hard failure, not a skip. Configure the secret (CI) or .env.local (local) and re-run.')
    return 2
  }

  let appliedNames: Set<string>
  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase.from('applied_migrations').select('filename')
    if (error) throw error
    appliedNames = new Set((data ?? []).map((r: { filename: string }) => r.filename))
  } catch (err) {
    console.error('Failed to read public.applied_migrations:', err instanceof Error ? err.message : err)
    console.error('If the table is missing, apply migration 076_applied_migrations_registry.sql first.')
    return 2
  }

  const localNames = new Set(local.map((f) => f.filename))
  const pending = local.filter((f) => !appliedNames.has(f.filename)).map((f) => f.filename)
  const orphans = Array.from(appliedNames).filter((n) => !localNames.has(n)).sort()

  // Collisions are informational only (see header) - print but don't fail.
  if (collisions.length > 0) {
    console.log(`\nWARNING - ${collisions.length} numeric-prefix collision(s) in supabase/migrations/ (not failing):`)
    for (const c of collisions) console.log(`  - prefix ${String(c.prefix).padStart(3, '0')}: ${c.filenames.join(', ')}`)
    console.log('  Renumber future colliding files; an UNapplied dupe is caught by the pending check below.')
  }

  const drift = pending.length > 0 || orphans.length > 0 || missingSelfRegister.length > 0
  if (!drift) {
    console.log(`migrations:check OK - ${local.length} local file(s), all applied (public.applied_migrations).`)
    return 0
  }

  if (pending.length > 0) {
    console.log(`\n${pending.length} pending migration(s) - file present in git, NOT recorded in public.applied_migrations:`)
    for (const f of pending) console.log(`  - ${f}`)
    console.log('\nFix: open Supabase SQL Editor and apply each pending migration (its self-register INSERT records it), then re-run.')
  }
  if (orphans.length > 0) {
    console.log(`\n${orphans.length} orphan applied row(s) - recorded in public.applied_migrations, NO matching local file:`)
    for (const name of orphans) console.log(`  - ${name}`)
    console.log('\nFix: commit the missing file to supabase/migrations/, or delete the stale registry row.')
  }
  if (missingSelfRegister.length > 0) {
    console.log(`\n${missingSelfRegister.length} migration(s) >= ${String(SELF_REGISTER_CONVENTION_FROM).padStart(3, '0')} missing the self-register INSERT:`)
    for (const f of missingSelfRegister) console.log(`  - ${f}`)
    console.log("\nFix: append to the file:\n  INSERT INTO public.applied_migrations (filename) VALUES ('<this-file>.sql') ON CONFLICT (filename) DO NOTHING;")
  }

  return 1
}

main().then((code) => process.exit(code))
