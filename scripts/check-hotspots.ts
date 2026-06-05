// Architecture-review mechanical-scan layer (Cluster B, derived 2026-06-04 from
// the 5 architecture-audit dogfood sessions — docs/audits/architecture/01..05).
//
// Emits the hotspot table the /architecture-review skill points its judgment at:
//
//   file | logic_loc | churn_90d | import_fanout | product
//
// sorted by product, descending. This was the single most-requested artifact
// across the dogfood sessions (01-F6, 02-F6, 03-F2/F4): every session ran size
// and churn as two separate hand invocations and eyeballed the intersection.
//
// THREE deliberate signal choices, each a friction-log correction:
//
//   - logic_loc, NOT raw LOC (R2 / 03-F2,F4). Raw `wc -l` actively misleads:
//     03's two biggest files needed OPPOSITE verdicts (docs.ts 1,342 = literal
//     bloat to refactor; brew-import.ts 1,459 = legitimate engine depth to keep),
//     and `.describe()`-heavy MCP schema files are "large" only with load-bearing
//     documentation prose. So we subtract blank lines, comment lines, and
//     string-literal/`.describe()` documentation lines before size means anything.
//
//   - churn_90d sourced from git, the cleanest signal in every session (02-F6:
//     "29 commits/3mo on the page vs 5 on its helper instantly justified the
//     audit"). It feeds the skill's `change_freq` score directly (Step 5).
//
//   - import_fanout is reported but DOWN-weighted in the product (R11 / 03-F5):
//     the top-fanout modules (tool-wrapper 31, auth 31) were the HEALTHIEST in
//     the surface, not smells. Fanout is a smell only as fanout × (instability |
//     mixed-concern) — a judgment the skill makes, not the script. So the product
//     uses (1 + fanout), never bare fanout: a file nothing imports (every
//     `page.tsx` — including Session 02's green/[id] hotspot) must still rank on
//     churn × logic_loc, and fanout amplifies without ever zeroing it.
//
//       product = logic_loc × churn_90d × (1 + import_fanout)
//
// The script SURFACES where to point the skill; it makes NO keep/refactor call —
// that's the interpretive R6/R8 work the skill owns and CI can't automate.
//
// Pure file + git reads, no node_modules deps — runs in any worktree. Mirrors
// scripts/check-doc-sizes.ts / check-mcp-bundle.ts.
//
// Run via:
//   npm run check:hotspots            # top 30 by product
//   npm run check:hotspots -- --all   # the full ranked table
//   npm run check:hotspots -- --top 50

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { resolve, join, relative, dirname } from 'node:path'

const repoRoot = resolve(__dirname, '..')
const SCAN_DIRS = ['app', 'lib', 'components']
const SRC_RE = /\.tsx?$/
const SKIP_RE = /\.d\.ts$/

// ---------------------------------------------------------------------------
// 1. Collect the source-file set.
// ---------------------------------------------------------------------------

function walk(rel: string, out: string[]): void {
  const abs = resolve(repoRoot, rel)
  let entries
  try {
    entries = readdirSync(abs, { withFileTypes: true })
  } catch {
    return
  }
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === '.next' || e.name === '.git') continue
    const childRel = join(rel, e.name)
    if (e.isDirectory()) walk(childRel, out)
    else if (SRC_RE.test(e.name) && !SKIP_RE.test(e.name)) out.push(childRel)
  }
}

function collectSourceFiles(): string[] {
  const out: string[] = []
  for (const d of SCAN_DIRS) walk(d, out)
  return out.sort()
}

// ---------------------------------------------------------------------------
// 2. logic_loc — total minus blank / comment / string-literal-doc lines.
//
//    Heuristic (documented as approximate, per 03-F4). We track block-comment
//    state and drop:
//      - blank lines
//      - `//` line comments and `/* … */` / `*` block-comment bodies
//      - lines bearing `.describe(` — the MCP tool-introspection documentation
//        prose (load-bearing, but NOT logic; 03 push-brew is 350/409 describe)
//      - lines that are purely a string-literal continuation (open quote with no
//        closing on the line, or a line that is only a quoted fragment)
//    The docs.ts `listDocs()` 596-line `entry(...)` literal is intentionally
//    COUNTED — it is data-as-code cognitive load the skill should see, exactly
//    the Session-03 Candidate-1 target.
// ---------------------------------------------------------------------------

function logicLoc(src: string): number {
  let count = 0
  let inBlockComment = false
  for (const raw of src.split('\n')) {
    const line = raw.trim()
    if (line === '') continue

    if (inBlockComment) {
      if (line.includes('*/')) inBlockComment = false
      continue
    }
    if (line.startsWith('//')) continue
    if (line.startsWith('/*')) {
      if (!line.includes('*/')) inBlockComment = true
      continue
    }
    if (line.startsWith('*')) continue // block-comment continuation body

    // .describe('…') documentation prose — not logic.
    if (line.includes('.describe(')) continue

    // Pure string-literal continuation lines (a long doc string broken across
    // lines, or a bare quoted fragment) — count as data, not logic.
    if (/^['"`]/.test(line) && !/[;,{}()=]/.test(line.replace(/^['"`][^'"`]*['"`]?/, ''))) continue

    count++
  }
  return count
}

// ---------------------------------------------------------------------------
// 3. churn_90d — commits in the last 90 days touching each file.
// ---------------------------------------------------------------------------

function churnByFile(): Map<string, number> {
  const map = new Map<string, number>()
  let out: string
  try {
    out = execFileSync(
      'git',
      ['log', '--since=90 days ago', '--name-only', '--format=', '--', ...SCAN_DIRS],
      { cwd: repoRoot, encoding: 'utf-8', maxBuffer: 64 * 1024 * 1024 },
    )
  } catch {
    return map // not a git repo / git unavailable → all churn 0
  }
  for (const raw of out.split('\n')) {
    const f = raw.trim()
    if (f === '' || !SRC_RE.test(f) || SKIP_RE.test(f)) continue
    map.set(f, (map.get(f) ?? 0) + 1)
  }
  return map
}

// ---------------------------------------------------------------------------
// 4. import_fanout — distinct source files importing each file.
//    Resolves `@/x` (tsconfig alias → repo root) and relative `./` / `../`;
//    bare specifiers (node_modules) are skipped.
// ---------------------------------------------------------------------------

const IMPORT_RE = /(?:import|export)[^'"]*?\bfrom\s*['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)|require\(\s*['"]([^'"]+)['"]\s*\)/g

function resolveSpecifier(spec: string, fromFile: string, fileSet: Set<string>): string | null {
  let base: string
  if (spec.startsWith('@/')) base = spec.slice(2)
  else if (spec.startsWith('.')) base = relative(repoRoot, resolve(dirname(resolve(repoRoot, fromFile)), spec))
  else return null // bare → node_modules

  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    join(base, 'index.ts'),
    join(base, 'index.tsx'),
  ]
  for (const c of candidates) {
    const norm = c.split(/[\\/]/).join('/')
    if (fileSet.has(norm)) return norm
  }
  return null
}

function fanoutByFile(files: string[], srcByFile: Map<string, string>): Map<string, number> {
  const fileSet = new Set(files)
  const importers = new Map<string, Set<string>>()
  for (const f of files) {
    const src = srcByFile.get(f)!
    IMPORT_RE.lastIndex = 0
    let m: RegExpExecArray | null
    while ((m = IMPORT_RE.exec(src)) !== null) {
      const spec = m[1] ?? m[2] ?? m[3]
      if (!spec) continue
      const target = resolveSpecifier(spec, f, fileSet)
      if (target && target !== f) {
        if (!importers.has(target)) importers.set(target, new Set())
        importers.get(target)!.add(f)
      }
    }
  }
  const out = new Map<string, number>()
  for (const [target, set] of Array.from(importers)) out.set(target, set.size)
  return out
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

interface Row {
  file: string
  logic: number
  churn: number
  fanout: number
  product: number
}

function main(): void {
  const argv = process.argv.slice(2)
  const all = argv.includes('--all')
  const topIdx = argv.indexOf('--top')
  const top = topIdx >= 0 && argv[topIdx + 1] ? parseInt(argv[topIdx + 1], 10) : 30

  const files = collectSourceFiles()
  const srcByFile = new Map<string, string>()
  for (const f of files) srcByFile.set(f, readFileSync(resolve(repoRoot, f), 'utf-8'))

  const churn = churnByFile()
  const fanout = fanoutByFile(files, srcByFile)

  const rows: Row[] = files.map((f) => {
    const logic = logicLoc(srcByFile.get(f)!)
    const c = churn.get(f) ?? 0
    const fo = fanout.get(f) ?? 0
    return { file: f, logic, churn: c, fanout: fo, product: logic * c * (1 + fo) }
  })

  rows.sort((a, b) => b.product - a.product || b.churn - a.churn || b.logic - a.logic)

  const shown = all ? rows : rows.slice(0, top)

  const wFile = Math.max(4, ...shown.map((r) => r.file.length))
  const head = `${'file'.padEnd(wFile)}  ${'logic_loc'.padStart(9)}  ${'churn_90d'.padStart(9)}  ${'fanout'.padStart(6)}  ${'product'.padStart(9)}`
  console.log(head)
  console.log('-'.repeat(head.length))
  for (const r of shown) {
    console.log(
      `${r.file.padEnd(wFile)}  ${String(r.logic).padStart(9)}  ${String(r.churn).padStart(9)}  ${String(r.fanout).padStart(6)}  ${String(r.product).padStart(9)}`,
    )
  }

  const hot = rows.filter((r) => r.churn > 0).length
  console.log('')
  console.log(
    `check-hotspots: ${rows.length} source files scanned · ${hot} touched in last 90d · showing ${shown.length}${all ? '' : ` of ${rows.length} (--all for full table)`}.`,
  )
  console.log(
    'Ranking surfaces WHERE to point /architecture-review; the keep/refactor call is the skill’s judgment (R6/R8), not this table’s.',
  )
  // Informational only — never gates a build. (A hotspot is "go look here", not
  // "this is broken".) Always exits 0.
  process.exit(0)
}

main()
