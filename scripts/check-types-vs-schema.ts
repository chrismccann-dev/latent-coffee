// Type-vs-schema drift gate (Class-A-gating). Standing invariant:
//   every DB column on a modeled table is typed in lib/types.ts.
//
// Decision (Chris, 2026-06-05): Class A gates (non-zero exit), Class B/C warn.
// This deliberately REVERSES the old "type-as-consumed" policy (the GreenBean
// "leave untyped until a consumer adopts them" comment) that the 2026-06-05
// schema-vs-type drift scan (PR #396) closed by typing 18 drifted columns
// (GreenBean +6, Roast +12 — mostly Roest-pull server-populated curves). The
// surface is clean today; this gate keeps it clean — it goes red only when a
// future migration adds a column without touching lib/types.ts. Pairs with the
// "migration >= 076 must self-register" discipline and the cross-system audit's
// Actor-6 hop (CLAUDE.md § six-actor chain).
//
// Three drift classes + posture:
//   Class A — DB column not in the interface          => GATE (exit 1). The
//             safe, mechanical, actionable class: type it in lib/types.ts.
//   Class B — interface field with no DB column        => WARN. Could be a
//             stale field OR a phantom-column bug (the migration-069 class) —
//             needs judgment, so it never fails the build.
//   Class C — type-CATEGORY mismatch (e.g. db boolean  => WARN. Reliable
//             vs ts string)                               category mismatch only.
//
// Nullability is ADVISORY ONLY and intentionally NOT checked at all: PostgREST's
// `required` array can't distinguish NOT-NULL-with-default from nullable, so a
// nullable-vs-non-null signal would be noise. We compare base type category only.
//
// Two non-negotiable false-positive filters (or the report fills with noise):
//   - embed/relation fields (interface field whose type is another table
//     interface or an array of one — GreenBean.roasts, Brew.terroir, ...) are
//     NOT columns; excluded from every class.
//   - generated columns (OpenAPI description starts with "Generated column:",
//     e.g. cuppings.wb_to_ground_delta) are server-computed; excluded entirely.
//
// Untyped-table handling: 8 infra/cache/queue tables have no interface by
// design — listed in INTENTIONALLY_UNTYPED. Any OTHER table with no interface
// WARNS ("did you forget the interface?") so a brand-new unmodeled table
// surfaces instead of silently passing.
//
// Schema source: PostgREST OpenAPI introspection — GET /rest/v1/ with the
// service-role key (project uhqxyxglyuhmpxegqsrt). No DB password, no new
// dependency, no node_modules (raw fetch + text-parse lib/types.ts) — runs in
// any worktree. Mirrors scripts/check-migrations.ts secret-loading.
//
// Fail-not-skip: without the service key we cannot read the schema, so we FAIL
// (exit 2) rather than green-skip. A silent skip is exactly why migration 069
// drifted undetected for 8 days (memory/feedback_migration_drift_pattern.md).
//
// Run via:
//   npm run check:types-vs-schema
//
// Exits 0 when no Class A. Exits 1 on Class A drift. Exits 2 on fatal error
// (missing secret / schema unreachable / parse failure).

import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const REPO_ROOT = resolve(__dirname, '..')
const TYPES_FILE = resolve(REPO_ROOT, 'lib/types.ts')

// ---------------------------------------------------------------------------
// Secret loading (copied from scripts/check-migrations.ts — same fail-not-skip
// contract).
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Interface -> table mapping. The 9 core entities + Profile. New modeled table
// = add its interface-name -> table-name line here (the 2-step deliberate edit,
// same discipline as lib/*-registry.ts mirroring docs/taxonomies).
// ---------------------------------------------------------------------------

const IFACE_TO_TABLE: Record<string, string> = {
  Profile: 'profiles',
  Terroir: 'terroirs',
  Cultivar: 'cultivars',
  GreenBean: 'green_beans',
  Roast: 'roasts',
  Experiment: 'experiments',
  Cupping: 'cuppings',
  RoastLearning: 'roast_learnings',
  RoastRecipe: 'roast_recipes',
  Brew: 'brews',
}

const IFACE_NAMES = new Set(Object.keys(IFACE_TO_TABLE))

// 8 infra/cache/queue tables with no interface BY DESIGN. Any other unmodeled
// table warns instead of silently passing.
const INTENTIONALLY_UNTYPED = new Set<string>([
  'api_keys',
  'applied_migrations',
  'doc_proposals',
  'oauth_authorization_codes',
  'process_aggregation_syntheses',
  'roast_recipe_divergence',
  'roaster_syntheses',
  'taxonomy_overrides_queue',
])

// ---------------------------------------------------------------------------
// lib/types.ts parse — text, not import (no node_modules needed).
// ---------------------------------------------------------------------------

type TsCategory = 'string' | 'number' | 'boolean' | 'string[]' | 'opaque'

interface TsField {
  name: string
  category: TsCategory
  rawType: string
}

// Maps a TS type annotation to a coarse category for Class C. 'opaque' means
// "do not flag" — jsonb-backed (FlavorChip[], Modifier[], PourStep[], unknown,
// import(...) types) or otherwise not reliably categorizable.
function tsCategory(rawType: string): TsCategory {
  const t = rawType.replace(/\s*\|\s*null\b/g, '').trim()
  if (/\[\]$/.test(t)) {
    const inner = t.replace(/\[\]$/, '').trim()
    return inner === 'string' ? 'string[]' : 'opaque'
  }
  if (t === 'string') return 'string'
  if (t === 'number') return 'number'
  if (t === 'boolean') return 'boolean'
  // String-literal union (e.g. 'canonical' | 'auto_created', 'yes' | 'no') is a
  // text column in PG -> treat as string.
  if (/^'[^']*'(\s*\|\s*'[^']*')*$/.test(t)) return 'string'
  return 'opaque' // unknown, import(...).X, anything else -> don't flag Class C
}

interface ParsedInterface {
  table: string
  fields: TsField[] // non-embed fields only (embeds excluded — not columns)
}

function parseInterfaces(src: string): ParsedInterface[] {
  const out: ParsedInterface[] = []
  // Match `export interface Name {  ... \n}` — interface bodies here are flat
  // (no nested object-literal types), so a non-greedy match to the first
  // line-leading `}` is safe.
  const re = /export interface (\w+) \{([\s\S]*?)\n\}/g
  let m: RegExpExecArray | null
  while ((m = re.exec(src)) !== null) {
    const name = m[1]
    const table = IFACE_TO_TABLE[name]
    if (!table) continue
    const fields: TsField[] = []
    for (const line of m[2].split('\n')) {
      const t = line.trim()
      if (!t || t.startsWith('//')) continue
      const fm = t.match(/^([a-z_][a-zA-Z0-9_]*)\??:\s*(.+?);?$/)
      if (!fm) continue
      const fname = fm[1]
      const ftype = fm[2].trim()
      // Embed/relation: base type (strip []/| null) is a known table interface.
      const base = ftype.replace(/\[\]/g, '').replace(/\s*\|\s*null\b/g, '').trim()
      if (IFACE_NAMES.has(base)) continue
      fields.push({ name: fname, category: tsCategory(ftype), rawType: ftype })
    }
    out.push({ table, fields })
  }
  return out
}

// ---------------------------------------------------------------------------
// PostgREST OpenAPI schema.
// ---------------------------------------------------------------------------

type DbCategory = 'string' | 'number' | 'boolean' | 'string[]' | 'jsonb' | 'unknown'

interface DbColumn {
  name: string
  format: string
  category: DbCategory
}

interface DbTable {
  name: string
  columns: DbColumn[] // generated columns already excluded
  generated: Set<string> // generated column names — legitimately typeable, so a
  // typed interface field matching one must NOT flag Class B.
}

function dbCategory(format: string): DbCategory {
  switch (format) {
    case 'uuid':
    case 'text':
    case 'date':
    case 'timestamp with time zone':
    case 'timestamp without time zone':
      return 'string'
    case 'integer':
    case 'bigint':
    case 'smallint':
    case 'numeric':
    case 'double precision':
    case 'real':
      return 'number'
    case 'boolean':
      return 'boolean'
    case 'text[]':
      return 'string[]'
    case 'jsonb':
    case 'json':
      return 'jsonb'
    default:
      return 'unknown'
  }
}

interface OpenApiProp {
  format?: string
  description?: string
}
interface OpenApiDef {
  properties?: Record<string, OpenApiProp>
}
interface OpenApiSpec {
  definitions?: Record<string, OpenApiDef>
}

async function fetchSchema(): Promise<DbTable[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  // Fail-not-skip: cannot verify without the key -> exit 2, never green-skip.
  if (!url || !key) {
    throw new FatalError(
      'FAIL: SUPABASE_SERVICE_ROLE_KEY / NEXT_PUBLIC_SUPABASE_URL not set - cannot read the PostgREST schema to verify drift.\n' +
        'This is a hard failure, not a skip. Configure the secret (CI) or .env.local (local) and re-run.',
    )
  }
  let spec: OpenApiSpec
  try {
    const res = await fetch(`${url}/rest/v1/`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
    spec = (await res.json()) as OpenApiSpec
  } catch (err) {
    throw new FatalError(
      `Failed to fetch PostgREST OpenAPI schema from ${url}/rest/v1/: ${err instanceof Error ? err.message : String(err)}`,
    )
  }
  if (!spec.definitions || Object.keys(spec.definitions).length === 0) {
    throw new FatalError('PostgREST OpenAPI spec had no `definitions` — cannot verify drift.')
  }
  const tables: DbTable[] = []
  for (const [name, def] of Object.entries(spec.definitions)) {
    const columns: DbColumn[] = []
    const generated = new Set<string>()
    for (const [col, prop] of Object.entries(def.properties ?? {})) {
      if ((prop.description ?? '').startsWith('Generated column:')) {
        generated.add(col)
        continue
      }
      const format = prop.format ?? 'unknown'
      columns.push({ name: col, format, category: dbCategory(format) })
    }
    tables.push({ name, columns, generated })
  }
  return tables
}

class FatalError extends Error {}

// ---------------------------------------------------------------------------
// Drift detection.
// ---------------------------------------------------------------------------

interface ClassAMiss {
  table: string
  column: string
  format: string
}
interface ClassBMiss {
  table: string
  field: string
  rawType: string
}
interface ClassCMiss {
  table: string
  column: string
  dbCat: DbCategory
  tsCat: TsCategory
  format: string
  rawType: string
}

interface Report {
  classA: ClassAMiss[]
  classB: ClassBMiss[]
  classC: ClassCMiss[]
  unmodeled: string[] // tables with no interface, not in the allowlist
}

function detectDrift(parsed: ParsedInterface[], dbTables: DbTable[]): Report {
  const byTable = new Map(parsed.map((p) => [p.table, p]))
  const modeledTables = new Set(Object.values(IFACE_TO_TABLE))
  const report: Report = { classA: [], classB: [], classC: [], unmodeled: [] }

  for (const db of dbTables) {
    if (!modeledTables.has(db.name)) {
      // Unmodeled table: allowlisted = silent; anything else = WARN.
      if (!INTENTIONALLY_UNTYPED.has(db.name)) report.unmodeled.push(db.name)
      continue
    }
    const iface = byTable.get(db.name)
    if (!iface) {
      // Modeled per the map but no interface parsed -> structural problem.
      report.unmodeled.push(`${db.name} (mapped but interface not parsed)`)
      continue
    }
    const tsByName = new Map(iface.fields.map((f) => [f.name, f]))
    const dbByName = new Map(db.columns.map((c) => [c.name, c]))

    // Class A: DB column not typed in the interface.
    for (const col of db.columns) {
      if (!tsByName.has(col.name)) {
        report.classA.push({ table: db.name, column: col.name, format: col.format })
      }
    }
    // Class B: interface field with no DB column. A field matching a GENERATED
    // column (excluded from db.columns) is legitimately typed — not Class B.
    for (const f of iface.fields) {
      if (!dbByName.has(f.name) && !db.generated.has(f.name)) {
        report.classB.push({ table: db.name, field: f.name, rawType: f.rawType })
      }
    }
    // Class C: reliable type-category mismatch on shared columns.
    for (const col of db.columns) {
      const f = tsByName.get(col.name)
      if (!f) continue
      if (col.category === 'jsonb' || col.category === 'unknown') continue // can't reliably compare
      if (f.category === 'opaque') continue // TS side opaque -> don't flag
      if (col.category !== f.category) {
        report.classC.push({
          table: db.name,
          column: col.name,
          dbCat: col.category,
          tsCat: f.category,
          format: col.format,
          rawType: f.rawType,
        })
      }
    }
  }
  return report
}

// ---------------------------------------------------------------------------
// Report rendering — mirrors check-doc-sizes / check-mcp-bundle per-miss format.
// ---------------------------------------------------------------------------

function printReport(report: Report): void {
  const { classA, classB, classC, unmodeled } = report

  if (classA.length > 0) {
    console.error(`\nClass A — ${classA.length} DB column(s) NOT typed in lib/types.ts (GATE):`)
    for (const m of classA) console.error(`  🔴 ${m.table}.${m.column}  (pg: ${m.format})`)
    console.error('\nFix: add the column to its interface in lib/types.ts (every DB column on a modeled table is typed).')
  }
  if (classB.length > 0) {
    console.log(`\nClass B — ${classB.length} interface field(s) with NO matching DB column (warn):`)
    for (const m of classB) console.log(`  ⚠️  ${m.table}.${m.field}  (ts: ${m.rawType})`)
    console.log('  Judgment call: a stale field to delete, OR a phantom-column bug (migration-069 class). Not failing.')
  }
  if (classC.length > 0) {
    console.log(`\nClass C — ${classC.length} type-category mismatch(es) (warn; nullability NOT checked):`)
    for (const m of classC) {
      console.log(`  ⚠️  ${m.table}.${m.column}  db=${m.dbCat} (${m.format})  ts=${m.tsCat} (${m.rawType})`)
    }
    console.log('  Reconcile the TS type with the column type. Not failing.')
  }
  if (unmodeled.length > 0) {
    console.log(`\nUnmodeled — ${unmodeled.length} table(s) with no interface, not in INTENTIONALLY_UNTYPED (warn):`)
    for (const t of unmodeled) console.log(`  ⚠️  ${t}`)
    console.log('  Did you forget the interface? Add it to lib/types.ts + IFACE_TO_TABLE, or to INTENTIONALLY_UNTYPED if infra-only.')
  }
}

// ---------------------------------------------------------------------------
// Main.
// ---------------------------------------------------------------------------

async function main(): Promise<number> {
  let parsed: ParsedInterface[]
  try {
    const src = readFileSync(TYPES_FILE, 'utf8')
    parsed = parseInterfaces(src)
  } catch (err) {
    console.error('Failed to read/parse lib/types.ts:', err instanceof Error ? err.message : err)
    return 2
  }
  if (parsed.length !== Object.keys(IFACE_TO_TABLE).length) {
    const found = new Set(parsed.map((p) => p.table))
    const missing = Object.values(IFACE_TO_TABLE).filter((t) => !found.has(t))
    console.error(
      `Parsed ${parsed.length}/${Object.keys(IFACE_TO_TABLE).length} expected interfaces from lib/types.ts. Missing table(s): ${missing.join(', ') || '(none — extra parsed?)'}`,
    )
    console.error('The interface parser likely needs updating (a renamed/removed interface).')
    return 2
  }

  let dbTables: DbTable[]
  try {
    dbTables = await fetchSchema()
  } catch (err) {
    if (err instanceof FatalError) {
      console.error(err.message)
      return 2
    }
    console.error('Unexpected error fetching schema:', err instanceof Error ? err.message : err)
    return 2
  }

  const report = detectDrift(parsed, dbTables)
  printReport(report)

  const modeledCount = Object.keys(IFACE_TO_TABLE).length
  const colCount = dbTables
    .filter((t) => Object.values(IFACE_TO_TABLE).includes(t.name))
    .reduce((n, t) => n + t.columns.length, 0)

  console.log('')
  if (report.classA.length === 0) {
    const warnTotal = report.classB.length + report.classC.length + report.unmodeled.length
    console.log(
      `check-types-vs-schema OK — ${colCount} column(s) across ${modeledCount} modeled table(s) all typed in lib/types.ts.` +
        (warnTotal ? ` (${warnTotal} non-gating warning(s) above — review when convenient.)` : ''),
    )
    return 0
  }
  console.error(
    `\ncheck-types-vs-schema: ${report.classA.length} Class-A drift(s) — a DB column is untyped. This gates the build.`,
  )
  return 1
}

main().then((code) => process.exit(code))
