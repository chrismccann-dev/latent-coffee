// Sprint 3.2 #5 — migration drift guard.
//
// Run via:
//   npm run check:migrations
//
// Diffs supabase/migrations/*.sql against supabase_migrations.schema_migrations
// on the live DB. Flags drift in two directions:
//
//   pending — local file with NO matching applied row (the recurring failure
//     mode from memory/feedback_migration_drift_pattern.md: PR lands but the
//     migration is never run in Supabase SQL Editor)
//   orphan  — applied row with NO matching local file (rare; happens when a
//     SQL Editor change wasn't committed to the repo)
//
// Match strategy is fuzzy because applied names drifted historically (some
// were applied with the NNN_ prefix, some without). For each local file
// NNN_<rest>.sql we check both "NNN_<rest>" and "<rest>" against the
// applied schema_migrations.name set; either match counts as applied.
// Numeric-prefix collisions in the local dir (two files sharing the same
// NNN) are flagged separately — they're a different bug class.
//
// Exits 0 when clean. Exits 1 when drift exists. Exits 2 on fatal error
// (missing env, DB unreachable). Treat exit 1 as a soft block that the
// author must address before merging.

import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'

const REPO_ROOT = resolve(__dirname, '..')
const MIGRATIONS_DIR = resolve(REPO_ROOT, 'supabase/migrations')

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
  basename: string // "053_green_beans_cleanup_backfill"
  prefix: string | null // "053"
  withoutPrefix: string // "green_beans_cleanup_backfill"
}

function parseLocalMigrations(): LocalMigration[] {
  if (!existsSync(MIGRATIONS_DIR)) return []
  return readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort()
    .map((filename) => {
      const basename = filename.replace(/\.sql$/, '')
      const m = basename.match(/^(\d+)_(.+)$/)
      return {
        filename,
        basename,
        prefix: m ? m[1] : null,
        withoutPrefix: m ? m[2] : basename,
      }
    })
}

function findCollisions(files: LocalMigration[]): Array<{ prefix: string; filenames: string[] }> {
  const byPrefix = new Map<string, string[]>()
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

async function main(): Promise<number> {
  const local = parseLocalMigrations()
  if (local.length === 0) {
    console.error('No migration files found under supabase/migrations/')
    return 2
  }

  // Numeric-prefix collisions are detectable without DB access — run that
  // check unconditionally so local pre-push runs catch them even when the
  // service-role key isn't configured (see feedback_local_verification_fallbacks).
  const collisions = findCollisions(local)

  let appliedNames: Set<string> | null = null
  if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = createServiceClient()
      const { data, error } = await supabase
        .schema('supabase_migrations' as never)
        .from('schema_migrations')
        .select('version, name')
      if (error) throw error
      appliedNames = new Set((data ?? []).map((r: { name: string }) => r.name))
    } catch (err) {
      console.error('Failed to query schema_migrations:', err instanceof Error ? err.message : err)
      return 2
    }
  } else {
    console.log('SUPABASE_SERVICE_ROLE_KEY not set — running prefix-collision check only.')
    console.log('Set the env var (or rely on the CI gate in .github/workflows/migrations-check.yml) for the full drift diff.\n')
  }

  const pending: LocalMigration[] = []
  const matchedAppliedNames = new Set<string>()
  if (appliedNames) {
    for (const f of local) {
      const candidates = [f.basename, f.withoutPrefix].filter(Boolean)
      let matched: string | null = null
      for (const c of candidates) {
        if (appliedNames.has(c)) {
          matched = c
          break
        }
      }
      if (!matched) pending.push(f)
      else matchedAppliedNames.add(matched)
    }
  }
  const orphans = appliedNames
    ? Array.from(appliedNames).filter((n) => !matchedAppliedNames.has(n)).sort()
    : []

  const clean = pending.length === 0 && orphans.length === 0 && collisions.length === 0
  if (clean) {
    console.log(`migrations:check OK — ${local.length} local file(s), all applied.`)
    return 0
  }

  if (pending.length > 0) {
    console.log(`\n${pending.length} pending migration(s) — file present in git, NOT applied to DB:`)
    for (const f of pending) console.log(`  - ${f.filename}`)
    console.log('\nFix: open Supabase SQL Editor and apply each pending migration, then re-run.')
  }
  if (orphans.length > 0) {
    console.log(`\n${orphans.length} orphan applied migration(s) — applied to DB, NO matching local file:`)
    for (const name of orphans) console.log(`  - ${name}`)
    console.log('\nFix: capture the applied DDL into supabase/migrations/ so the repo is the source of truth.')
  }
  if (collisions.length > 0) {
    console.log(`\n${collisions.length} numeric-prefix collision(s) in supabase/migrations/:`)
    for (const c of collisions) console.log(`  - prefix ${c.prefix}: ${c.filenames.join(', ')}`)
    console.log('\nFix: renumber one of the colliding files to the next unused prefix.')
  }

  return 1
}

main().then((code) => process.exit(code))
