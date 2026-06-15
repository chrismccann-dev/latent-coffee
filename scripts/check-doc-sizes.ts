// Doc-size tripwire gate (Cluster B doc-pruning, light-systematization 2026-06-03).
//
// The trigger half of the doc-pruning mechanism (the response half stays the
// manual operator-led pruning exercise — see
// docs/features/doc-pruning-mechanism-brainstorm-2026-06-03.md). It computes the
// LIVE size of every constantly-loaded doc surface and flags any that crossed
// its tripwire, so a prune sprint gets scheduled before the doc degrades a live
// claude.ai / Claude Code session.
//
// Why a script: the tripwire registry's "current size" was hand-maintained and
// drifted 3x in 3 days (CONTEXT-roasting 105->116, PRODUCT 114->126->127). Live
// sizes live in exactly one place now — this script's output — never copied by
// hand. `--write` regenerates the live-size block in docs/architecture/
// doc-tripwires.md between the BEGIN/END markers.
//
// SCOPE = loading-profile across BOTH surfaces (Chris-confirmed 2026-06-03):
//   Tier 1 (hard cap)   — constantly loaded into a live session budget:
//                          root living docs + CONTEXT-* (claude.ai section-read)
//                          + docs/prompts/* (claude.ai full-read, 40KB) +
//                          docs/skills/* clusters (claude.ai, per ADR-0014 tiers).
//   Tier 2 (monitor)    — on-demand reference; report size, flag only if egregious.
//   Excluded            — archives (docs/sprints/*, docs/roasting/archive.md,
//                          docs/features/*, docs/taxonomies/*, docs/adr/*) +
//                          README.md (GitHub-facing, never session-loaded).
//                          Archives are WHERE pruned content goes to grow freely —
//                          capping them fights the mechanism.
//
// Run via:
//   npm run check:doc-sizes            # report + exit 1 if any Tier-1 over cap
//   npm run check:doc-sizes -- --write # also regenerate the registry live block
//
// DB-free + reads no node_modules-only deps — runs in any worktree. Mirrors
// scripts/check-mcp-bundle.ts.

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { resolve, join } from 'node:path'

const repoRoot = resolve(__dirname, '..')
const KB = 1024
const MONITOR_FLAG_KB = 150 // Tier-2 docs only complain past this

type Status = 'ok' | 'approaching' | 'over'

interface Row {
  group: string
  label: string
  cap: number | null // null = monitor-only
  sizeKB: number
  profile: string
  status: Status
}

// ---------------------------------------------------------------------------
// Size helpers
// ---------------------------------------------------------------------------

function fileKB(rel: string): number {
  return statSync(resolve(repoRoot, rel)).size / KB
}

function dirKB(rel: string): number {
  const abs = resolve(repoRoot, rel)
  let total = 0
  for (const entry of readdirSync(abs, { withFileTypes: true })) {
    const child = join(abs, entry.name)
    if (entry.isDirectory()) total += dirKB(join(rel, entry.name))
    else total += statSync(child).size / KB
  }
  return total
}

function maxFileKB(rel: string): { name: string; kb: number } {
  const abs = resolve(repoRoot, rel)
  let best = { name: '', kb: 0 }
  for (const entry of readdirSync(abs, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const inner = maxFileKB(join(rel, entry.name))
      if (inner.kb > best.kb) best = inner
    } else if (entry.name.endsWith('.md')) {
      const kb = statSync(join(abs, entry.name)).size / KB
      if (kb > best.kb) best = { name: join(rel, entry.name), kb }
    }
  }
  return best
}

function statusFor(sizeKB: number, cap: number): Status {
  if (sizeKB > cap) return 'over'
  if (sizeKB >= cap * 0.8) return 'approaching' // "approaching" = within 20%
  return 'ok'
}

// ---------------------------------------------------------------------------
// Tier 1 — hard caps (constantly loaded into a live session)
// ---------------------------------------------------------------------------

const ROOT_AND_CONTEXT: { path: string; cap: number; profile: string }[] = [
  { path: 'CLAUDE.md', cap: 120, profile: 'full · every Claude Code session' },
  { path: 'PRODUCT.md', cap: 120, profile: 'consulted (product-system index)' },
  { path: 'docs/product/roadmap.md', cap: 120, profile: 'consulted (roadmap growth driver)' },
  { path: 'docs/product/issues.md', cap: 120, profile: 'consulted' },
  { path: 'CONTEXT-roasting.md', cap: 120, profile: 'section-read · claude.ai roasting' },
  { path: 'CONTEXT-brewing.md', cap: 120, profile: 'section-read · claude.ai brewing' },
  { path: 'CONTEXT-shared.md', cap: 120, profile: 'section-read · both' },
  { path: 'CONTEXT-taste.md', cap: 120, profile: 'section-read · claude.ai taste' },
]

const PROMPT_CAP = 40 // full-read every claude.ai session
const PROMPT_DIR = 'docs/prompts'

// docs/skills/* cluster caps — MIRROR of ADR-0014 pattern-aware tiers. When a
// new sub-skill ships, add its cluster->class mapping here (the 2-step deliberate
// edit, same discipline as lib/*-registry.ts mirroring docs/taxonomies).
const SKILL_CLASS_CAP: Record<string, { cluster: number; single: number }> = {
  Historian: { cluster: 250, single: 80 },
  Archivist: { cluster: 200, single: 60 },
  EquipmentReference: { cluster: 150, single: 60 },
  Workflow: { cluster: 100, single: 60 },
  Coordinator: { cluster: 80, single: 40 },
  CCIL: { cluster: 150, single: 60 },
}
const SKILL_CLUSTER_CLASS: Record<string, keyof typeof SKILL_CLASS_CAP> = {
  'brewing-historian': 'Historian',
  'roasting-historian': 'Historian',
  'wbc-brewing-archivist': 'Archivist',
  'wbc-roasting-archivist': 'Archivist',
  'peer-learning-roasting-archivist': 'Archivist',
  'brewing-equipment-expert': 'EquipmentReference',
  'research-coordinator': 'EquipmentReference',
  'roest-knowledge': 'EquipmentReference',
  coordinator: 'Coordinator',
  // Lot Coordinator pair (ADR-0024, PR #424) — Coordinator plans/closes lots;
  // V-Set Assistant is an in-cycle workflow skill like the other *-assistants.
  'roasting-coordinator': 'Coordinator',
  'v-set-assistant': 'Workflow',
  ccil: 'CCIL',
  'brewing-assistant': 'Workflow',
  'roasting-assistant': 'Workflow',
  'cupping-specialist': 'Workflow',
  'close-lot-specialist': 'Workflow',
  'roast-recorder': 'Workflow',
  'brew-recorder': 'Workflow',
  'research-assistant': 'Workflow',
  'sourcing-workflow-planner': 'Workflow',
  'roest-api-worker': 'Workflow',
}

// ---------------------------------------------------------------------------
// Tier 2 — monitor only (on-demand reference; flag only if egregiously large)
// ---------------------------------------------------------------------------

const MONITOR: { path: string; profile: string }[] = [
  { path: 'docs/architecture/data-model.md', profile: 'on-demand · touching a column' },
  { path: 'docs/architecture/page-ia.md', profile: 'on-demand · touching a surface' },
  { path: 'docs/architecture/registries.md', profile: 'on-demand · touching a registry' },
  { path: 'docs/design-system.md', profile: 'on-demand · UI work' },
  { path: 'ARBITER.md', profile: 'on-demand · process pending arbitration' },
  { path: 'SYNC_V2.md', profile: 'on-demand · MCP work' },
]

// ---------------------------------------------------------------------------
// Build rows
// ---------------------------------------------------------------------------

function collectRows(): { rows: Row[]; warnings: string[] } {
  const rows: Row[] = []
  const warnings: string[] = []

  for (const d of ROOT_AND_CONTEXT) {
    const sizeKB = fileKB(d.path)
    rows.push({ group: 'Tier 1 · root + CONTEXT', label: d.path, cap: d.cap, sizeKB, profile: d.profile, status: statusFor(sizeKB, d.cap) })
  }

  for (const name of readdirSync(resolve(repoRoot, PROMPT_DIR)).filter((n) => n.endsWith('.md')).sort()) {
    const rel = join(PROMPT_DIR, name)
    const sizeKB = fileKB(rel)
    rows.push({ group: 'Tier 1 · prompts (40KB full-read)', label: rel, cap: PROMPT_CAP, sizeKB, profile: 'full-read · claude.ai', status: statusFor(sizeKB, PROMPT_CAP) })
  }

  for (const name of readdirSync(resolve(repoRoot, 'docs/skills'), { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name).sort()) {
    const cls = SKILL_CLUSTER_CLASS[name]
    if (!cls) {
      warnings.push(`docs/skills/${name}: no ADR-0014 class mapping in SKILL_CLUSTER_CLASS — add one (defaulting to Workflow cap for this run).`)
    }
    const caps = SKILL_CLASS_CAP[cls ?? 'Workflow']
    const clusterKB = dirKB(join('docs/skills', name))
    rows.push({ group: 'Tier 1 · skills clusters (ADR-0014)', label: `docs/skills/${name}/  [${cls ?? 'Workflow?'}]`, cap: caps.cluster, sizeKB: clusterKB, profile: 'claude.ai workflow', status: statusFor(clusterKB, caps.cluster) })
    const biggest = maxFileKB(join('docs/skills', name))
    if (biggest.kb >= caps.single * 0.8) {
      rows.push({ group: 'Tier 1 · skills clusters (ADR-0014)', label: `  ↳ largest doc: ${biggest.name}`, cap: caps.single, sizeKB: biggest.kb, profile: `single-doc cap ${caps.single}KB`, status: statusFor(biggest.kb, caps.single) })
    }
  }

  for (const d of MONITOR) {
    const sizeKB = fileKB(d.path)
    rows.push({ group: 'Tier 2 · monitor (on-demand)', label: d.path, cap: null, sizeKB, profile: d.profile, status: sizeKB > MONITOR_FLAG_KB ? 'over' : 'ok' })
  }

  return { rows, warnings }
}

// ---------------------------------------------------------------------------
// Report + registry --write
// ---------------------------------------------------------------------------

const ICON: Record<Status, string> = { ok: '✅', approaching: '⚠️', over: '🔴' }

function fmt(n: number): string {
  return n.toFixed(1)
}

function printReport(rows: Row[], warnings: string[]): void {
  let group = ''
  for (const r of rows) {
    if (r.group !== group) {
      group = r.group
      console.log(`\n${group}`)
    }
    const capStr = r.cap === null ? `(monitor, flag >${MONITOR_FLAG_KB})` : `/ ${r.cap}KB`
    console.log(`  ${ICON[r.status]} ${fmt(r.sizeKB).padStart(6)} KB ${capStr.padEnd(20)} ${r.label}`)
  }
  if (warnings.length) {
    console.log('\nWarnings:')
    for (const w of warnings) console.log(`  ! ${w}`)
  }
}

const BEGIN = '<!-- BEGIN check:doc-sizes (generated — do not edit by hand; run `npm run check:doc-sizes -- --write`) -->'
const END = '<!-- END check:doc-sizes -->'

function generatedBlock(rows: Row[]): string {
  const lines: string[] = [BEGIN, '', `_Live sizes — regenerated by \`npm run check:doc-sizes -- --write\`. Do not hand-edit; that is exactly what drifted._`]
  let group = ''
  for (const r of rows) {
    if (r.group !== group) {
      group = r.group
      lines.push('', `**${group}**`, '', '| | Doc | Size | Cap | Loading profile |', '|---|---|---|---|---|')
    }
    const capStr = r.cap === null ? `monitor (flag >${MONITOR_FLAG_KB})` : `${r.cap} KB`
    lines.push(`| ${ICON[r.status]} | ${r.label.trim()} | ${fmt(r.sizeKB)} KB | ${capStr} | ${r.profile} |`)
  }
  lines.push('', END)
  return lines.join('\n')
}

function writeRegistry(rows: Row[]): void {
  const rel = 'docs/architecture/doc-tripwires.md'
  const abs = resolve(repoRoot, rel)
  const src = readFileSync(abs, 'utf-8')
  const block = generatedBlock(rows)
  let next: string
  if (src.includes(BEGIN) && src.includes(END)) {
    next = src.replace(new RegExp(`${escapeRe(BEGIN)}[\\s\\S]*?${escapeRe(END)}`), block)
  } else {
    throw new Error(`${rel}: BEGIN/END markers not found — add the marker pair where the live-size block should render.`)
  }
  writeFileSync(abs, next)
  console.log(`\n--write: regenerated the live-size block in ${rel}.`)
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main(): void {
  const write = process.argv.includes('--write')
  const { rows, warnings } = collectRows()
  printReport(rows, warnings)
  if (write) writeRegistry(rows)

  const over = rows.filter((r) => r.status === 'over')
  const tier1Over = over.filter((r) => r.cap !== null && r.group.startsWith('Tier 1'))

  console.log('')
  if (tier1Over.length === 0) {
    console.log(`check-doc-sizes: all Tier-1 surfaces within cap. ${over.length ? `(${over.length} Tier-2 monitor flag(s) — review when convenient.)` : ''}`)
    process.exit(0)
  }
  console.error(`check-doc-sizes: ${tier1Over.length} Tier-1 surface(s) OVER tripwire — schedule a pruning exercise (next sprint):`)
  for (const r of tier1Over) console.error(`  🔴 ${r.label} — ${fmt(r.sizeKB)} / ${r.cap} KB`)
  console.error(`\nKickoff a manual prune per the protocol: docs/features/doc-pruning-mechanism-brainstorm-2026-06-03.md`)
  process.exit(1)
}

main()
