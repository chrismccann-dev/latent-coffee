// Track 2 of the General cleanup sprint (2026-05-08). One-shot audit that
// surfaces drift between text/legacy columns and structured columns plus
// orphan rows / queue health / cache staleness across the production
// Supabase DB. Writes a Markdown report to docs/audits/.
//
// Run via:
//   npm run audit:data
//
// Requires .env.local with NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
// in process.cwd(). Exits 0 when every dimension is clean, 1 with findings
// otherwise. 2 on fatal error.
//
// 12 dimensions audited. Each `audit*` returns DimensionResult with a list of
// Findings tagged Severity A (inline-fix) / B (mini-sprint) / C (known-state)
// / info (observational). Known-states encoded as constants at top so future
// runs skip them cleanly.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

// Repo root resolved from this file's location (scripts/data-sanity-audit.ts
// → repo root is one level up). __dirname is reliable under tsx@4 CJS.
const REPO_ROOT = resolve(__dirname, '..')

// Tiny .env.local loader — populate process.env BEFORE importing anything that
// reads it. tsx@4 does not auto-load .env files; the project has no `dotenv`
// dep. Format: KEY=VALUE per line, # comments, optional surrounding quotes.
//
// Falls back to the main checkout's .env.local when running inside a worktree
// whose own .env.local is incomplete (e.g. anon-only). Worktree path shape:
// <main>/.claude/worktrees/<name>/ — so <main>'s .env.local sits 3 dirs up.
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
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1)
      }
      if (!(k in process.env)) process.env[k] = v
    }
  }
}

loadDotenvLocal()

import type { SupabaseClient } from '@supabase/supabase-js'
import type { CanonicalLookup } from '../lib/canonical-registry'
import { createServiceClient } from '../lib/supabase/service'
import { ROASTER_LOOKUP } from '../lib/roaster-registry'
import { PRODUCER_LOOKUP } from '../lib/producer-registry'
import { BREWER_LOOKUP } from '../lib/brewer-registry'
import { FILTER_LOOKUP } from '../lib/filter-registry'
import { GRINDER_LOOKUP } from '../lib/grinder-registry'
import { ROAST_LEVEL_LOOKUP } from '../lib/roast-level-registry'
import { cleanModifiers } from '../lib/extraction-modifiers'
import { cleanFlavors, cleanStructureTags } from '../lib/flavor-registry'
import {
  composeProcess,
  isProcessResolvable,
  type StructuredProcess,
} from '../lib/process-registry'
import { composeGrind } from '../lib/brew-import'

// ---------------------------------------------------------------------------
// Known-state constants (Bucket C). Round-2 additions go here post-dry-run.
// ---------------------------------------------------------------------------

const KNOWN_STATE = {
  experiments_orphan_from_green_beans: {
    expected_count: 16,
    reason:
      'Spreadsheet-only experiments blocked on green_beans backfill (5 missing beans). Per workflow rule: event-driven uploads, no backlog sprint.',
  },
} as const

// Output path for the committed report — anchored to the script's repo root,
// not process.cwd(), so the report lands in the worktree's docs/audits/
// regardless of where the script is invoked from.
const REPORT_PATH = resolve(REPO_ROOT, 'docs/audits/track-2-2026-05-08.md')

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Severity = 'A' | 'B' | 'C' | 'info'

interface Finding {
  severity: Severity
  row?: string
  detail: string
}

interface DimensionResult {
  number: number
  name: string
  findings: Finding[]
  clean: boolean
  summary?: string
}

// ---------------------------------------------------------------------------
// Setup helpers
// ---------------------------------------------------------------------------

async function resolveUserId(supabase: SupabaseClient): Promise<string> {
  // Single-tenant — pull from any populated table. brews always has rows.
  const { data, error } = await supabase
    .from('brews')
    .select('user_id')
    .limit(1)
    .single()
  if (error || !data?.user_id) {
    throw new Error(
      `Could not resolve user_id from brews: ${error?.message ?? 'no rows'}`,
    )
  }
  return data.user_id as string
}

async function fetchAll<T>(
  supabase: SupabaseClient,
  table: string,
  columns: string,
  userId: string,
): Promise<T[]> {
  const { data, error } = await supabase
    .from(table)
    .select(columns)
    .eq('user_id', userId)
  if (error) throw new Error(`fetch ${table}: ${error.message}`)
  return (data ?? []) as T[]
}

function brewLabel(b: { id: string; coffee_name?: string | null; roaster?: string | null }): string {
  const head = b.roaster ? `${b.roaster} — ${b.coffee_name ?? '?'}` : (b.coffee_name ?? '?')
  return `brews/${b.id.slice(0, 8)} · ${head}`
}

function daysAgo(iso: string | null | undefined): number | null {
  if (!iso) return null
  const t = Date.parse(iso)
  if (!Number.isFinite(t)) return null
  return Math.floor((Date.now() - t) / 86_400_000)
}

// ---------------------------------------------------------------------------
// Brew row shape consumed by every audit that walks brews.
// ---------------------------------------------------------------------------

interface BrewRow {
  id: string
  user_id: string
  source: string | null
  coffee_name: string | null
  roaster: string | null
  producer: string | null
  brewer: string | null
  filter: string | null
  grinder: string | null
  grind_setting: string | null
  grind: string | null
  roast_level: string | null
  process: string | null
  base_process: string | null
  subprocess: string | null
  fermentation_modifiers: string[] | null
  fermentation_qualifiers: string[] | null
  drying_modifiers: string[] | null
  intervention_modifiers: string[] | null
  experimental_modifiers: string[] | null
  decaf_modifier: string | null
  signature_method: string | null
  modifiers: unknown
  flavors: unknown
  structure_tags: string[] | null
  green_bean_id: string | null
  terroir_id: string | null
  cultivar_id: string | null
  created_at: string | null
}

const BREW_COLUMNS =
  'id,user_id,source,coffee_name,roaster,producer,brewer,filter,grinder,grind_setting,grind,roast_level,process,base_process,subprocess,fermentation_modifiers,fermentation_qualifiers,drying_modifiers,intervention_modifiers,experimental_modifiers,decaf_modifier,signature_method,modifiers,flavors,structure_tags,green_bean_id,terroir_id,cultivar_id,created_at'

// ---------------------------------------------------------------------------
// Dimension 1 — orphan rows
// ---------------------------------------------------------------------------

interface TerroirRow { id: string; country: string | null; macro_terroir: string | null }
interface CultivarRow { id: string; name: string | null; lineage: string | null }
interface GreenBeanRow {
  id: string
  lot_id: string | null
  name: string | null
  terroir_id: string | null
  cultivar_id: string | null
  terroir_provenance: string | null
  cultivar_provenance: string | null
  canonicals_updated_at: string | null
}
interface RoastRow { id: string; green_bean_id: string | null; roast_date: string | null; is_reference: boolean | null; batch_id: string | null }
interface CuppingRow { id: string; roast_id: string | null; cupping_date: string | null }
interface ExperimentRow { id: string; experiment_id: string | null; green_bean_id: string | null }

async function auditOrphanRows(
  supabase: SupabaseClient,
  userId: string,
): Promise<DimensionResult> {
  const findings: Finding[] = []

  const terroirs = await fetchAll<TerroirRow>(supabase, 'terroirs', 'id, country, macro_terroir', userId)
  const cultivars = await fetchAll<CultivarRow>(supabase, 'cultivars', 'id, name, lineage', userId)
  const greenBeans = await fetchAll<GreenBeanRow>(
    supabase,
    'green_beans',
    'id, lot_id, name, terroir_id, cultivar_id, terroir_provenance, cultivar_provenance, canonicals_updated_at',
    userId,
  )
  const brews = await fetchAll<{ id: string; terroir_id: string | null; cultivar_id: string | null; green_bean_id: string | null }>(
    supabase,
    'brews',
    'id, terroir_id, cultivar_id, green_bean_id',
    userId,
  )
  const roasts = await fetchAll<RoastRow>(supabase, 'roasts', 'id, green_bean_id, roast_date, is_reference, batch_id', userId)
  const experiments = await fetchAll<ExperimentRow>(supabase, 'experiments', 'id, experiment_id, green_bean_id', userId)

  const terroirRefs = new Set<string>([
    ...brews.filter((b) => b.terroir_id).map((b) => b.terroir_id as string),
    ...greenBeans.filter((g) => g.terroir_id).map((g) => g.terroir_id as string),
  ])
  for (const t of terroirs) {
    if (!terroirRefs.has(t.id)) {
      findings.push({
        severity: 'B',
        row: `terroirs/${t.id.slice(0, 8)}`,
        detail: `Orphan macro terroir: ${t.country ?? '?'} · ${t.macro_terroir ?? '?'} — referenced by 0 brews + 0 green_beans.`,
      })
    }
  }

  const cultivarRefs = new Set<string>([
    ...brews.filter((b) => b.cultivar_id).map((b) => b.cultivar_id as string),
    ...greenBeans.filter((g) => g.cultivar_id).map((g) => g.cultivar_id as string),
  ])
  for (const c of cultivars) {
    if (!cultivarRefs.has(c.id)) {
      findings.push({
        severity: 'B',
        row: `cultivars/${c.id.slice(0, 8)}`,
        detail: `Orphan cultivar: ${c.name ?? '?'} (lineage ${c.lineage ?? '?'}) — referenced by 0 brews + 0 green_beans.`,
      })
    }
  }

  const beansWithRoasts = new Set(roasts.filter((r) => r.green_bean_id).map((r) => r.green_bean_id as string))
  for (const gb of greenBeans) {
    if (!beansWithRoasts.has(gb.id)) {
      findings.push({
        severity: 'B',
        row: `green_beans/${gb.id.slice(0, 8)}`,
        detail: `Green bean has 0 roasts: lot=${gb.lot_id ?? '?'} name=${gb.name ?? '?'}.`,
      })
    }
  }

  const greenBeanIds = new Set(greenBeans.map((g) => g.id))
  for (const e of experiments) {
    if (!e.green_bean_id || !greenBeanIds.has(e.green_bean_id)) {
      findings.push({
        severity: 'B',
        row: `experiments/${e.id.slice(0, 8)}`,
        detail: `Experiment ${e.experiment_id ?? '?'} green_bean_id=${e.green_bean_id ?? 'null'} does not resolve.`,
      })
    }
  }

  return {
    number: 1,
    name: 'Orphan rows',
    summary: `Scanned ${terroirs.length} terroirs, ${cultivars.length} cultivars, ${greenBeans.length} green_beans, ${experiments.length} experiments.`,
    findings,
    clean: findings.length === 0,
  }
}

// ---------------------------------------------------------------------------
// Dimension 2 — childless pairs
// ---------------------------------------------------------------------------
// dim 10 covers SR-without-green_bean_id; this dimension scopes to other
// childless-pair shapes: cuppings whose roast_id FK doesn't resolve.

async function auditChildlessPairs(
  supabase: SupabaseClient,
  userId: string,
): Promise<DimensionResult> {
  const findings: Finding[] = []

  const roasts = await fetchAll<{ id: string }>(supabase, 'roasts', 'id', userId)
  const cuppings = await fetchAll<CuppingRow>(supabase, 'cuppings', 'id, roast_id, cupping_date', userId)

  const roastIds = new Set(roasts.map((r) => r.id))
  for (const c of cuppings) {
    if (!c.roast_id || !roastIds.has(c.roast_id)) {
      findings.push({
        severity: 'B',
        row: `cuppings/${c.id.slice(0, 8)}`,
        detail: `Cupping (date ${c.cupping_date ?? '?'}) roast_id=${c.roast_id ?? 'null'} does not resolve.`,
      })
    }
  }

  return {
    number: 2,
    name: 'Childless pairs',
    summary: `Scanned ${cuppings.length} cuppings against ${roasts.length} roasts. SR-brew-without-green_bean_id is checked separately in dimension 10.`,
    findings,
    clean: findings.length === 0,
  }
}

// ---------------------------------------------------------------------------
// Dimension 3 — text/structured drift on process
// ---------------------------------------------------------------------------

function buildStructuredProcess(b: BrewRow): StructuredProcess {
  return {
    base_process: (b.base_process ?? 'Washed') as StructuredProcess['base_process'],
    subprocess: (b.subprocess ?? null) as StructuredProcess['subprocess'],
    fermentation_modifiers: (b.fermentation_modifiers ?? []) as StructuredProcess['fermentation_modifiers'],
    fermentation_qualifiers: (b.fermentation_qualifiers ?? []) as StructuredProcess['fermentation_qualifiers'],
    drying_modifiers: (b.drying_modifiers ?? []) as StructuredProcess['drying_modifiers'],
    intervention_modifiers: (b.intervention_modifiers ?? []) as StructuredProcess['intervention_modifiers'],
    experimental_modifiers: (b.experimental_modifiers ?? []) as StructuredProcess['experimental_modifiers'],
    decaf_modifier: (b.decaf_modifier ?? null) as StructuredProcess['decaf_modifier'],
    signature_method: b.signature_method ?? null,
  }
}

async function auditProcessDrift(
  supabase: SupabaseClient,
  userId: string,
): Promise<DimensionResult> {
  const findings: Finding[] = []
  const brews = await fetchAll<BrewRow>(supabase, 'brews', BREW_COLUMNS, userId)

  for (const b of brews) {
    const s = buildStructuredProcess(b)
    if (!isProcessResolvable(s)) {
      findings.push({
        severity: 'B',
        row: brewLabel(b),
        detail: `isProcessResolvable=false. base=${s.base_process} sub=${s.subprocess ?? '∅'} ferm=[${(s.fermentation_modifiers ?? []).join(',')}] dry=[${(s.drying_modifiers ?? []).join(',')}] interv=[${(s.intervention_modifiers ?? []).join(',')}] exp=[${(s.experimental_modifiers ?? []).join(',')}] decaf=${s.decaf_modifier ?? '∅'} sig=${s.signature_method ?? '∅'}.`,
      })
      continue
    }
    const composed = composeProcess(s)
    const stored = (b.process ?? '').trim()
    if (stored !== composed) {
      findings.push({
        severity: 'A',
        row: brewLabel(b),
        detail: `Legacy brews.process="${stored}" diverges from composeProcess(structured)="${composed}". Recompose to canonical via single UPDATE.`,
      })
    }
  }

  return {
    number: 3,
    name: 'Process drift (legacy text vs structured)',
    summary: `Scanned ${brews.length} brews. Compares brews.process (legacy denormalized text, kept through 1e.4) against composeProcess(structured-cols).`,
    findings,
    clean: findings.length === 0,
  }
}

// ---------------------------------------------------------------------------
// Dimension 4 — text/structured drift on grind
// ---------------------------------------------------------------------------

async function auditGrindDrift(
  supabase: SupabaseClient,
  userId: string,
): Promise<DimensionResult> {
  const findings: Finding[] = []
  const brews = await fetchAll<BrewRow>(supabase, 'brews', BREW_COLUMNS, userId)

  for (const b of brews) {
    const composed = composeGrind({ grinder: b.grinder, grind_setting: b.grind_setting })
    const stored = b.grind?.trim() ?? null
    const composedTrim = composed?.trim() ?? null
    if ((stored ?? '') !== (composedTrim ?? '')) {
      findings.push({
        severity: 'A',
        row: brewLabel(b),
        detail: `Legacy brews.grind="${stored ?? '∅'}" diverges from composeGrind(grinder="${b.grinder ?? '∅'}", setting="${b.grind_setting ?? '∅'}")="${composedTrim ?? '∅'}".`,
      })
    }
  }

  return {
    number: 4,
    name: 'Grind drift (legacy text vs structured)',
    summary: `Scanned ${brews.length} brews. Compares brews.grind against composeGrind(grinder + grind_setting).`,
    findings,
    clean: findings.length === 0,
  }
}

// ---------------------------------------------------------------------------
// Dimension 5 — canonical drift on text-only canonical columns
// ---------------------------------------------------------------------------

interface QueueRow {
  id: string
  axis: string
  raw_value: string
  source_kind: string | null
  source_id: string | null
  status: string
  submitted_at: string | null
  resolved_at: string | null
  canonical_target: string | null
}

interface CanonicalAxis {
  axis: string
  column: keyof BrewRow
  lookup: CanonicalLookup
  /** Roast level has no override path — any non-resolvable is automatic Bucket B. */
  allowOverride: boolean
}

const CANONICAL_AXES: readonly CanonicalAxis[] = [
  { axis: 'roaster', column: 'roaster', lookup: ROASTER_LOOKUP, allowOverride: true },
  { axis: 'producer', column: 'producer', lookup: PRODUCER_LOOKUP, allowOverride: true },
  { axis: 'brewer', column: 'brewer', lookup: BREWER_LOOKUP, allowOverride: true },
  { axis: 'filter', column: 'filter', lookup: FILTER_LOOKUP, allowOverride: true },
  { axis: 'grinder', column: 'grinder', lookup: GRINDER_LOOKUP, allowOverride: true },
  { axis: 'roast_level', column: 'roast_level', lookup: ROAST_LEVEL_LOOKUP, allowOverride: false },
] as const

async function auditCanonicalDrift(
  supabase: SupabaseClient,
  userId: string,
): Promise<DimensionResult> {
  const findings: Finding[] = []
  const brews = await fetchAll<BrewRow>(supabase, 'brews', BREW_COLUMNS, userId)
  const queue = await fetchAll<QueueRow>(
    supabase,
    'taxonomy_overrides_queue',
    'id, axis, raw_value, source_kind, source_id, status, submitted_at, resolved_at, canonical_target',
    userId,
  )

  // Index queue by (axis, lower(raw_value), source_id) for cross-reference.
  type QueueKey = string
  const queueIdx = new Map<QueueKey, QueueRow[]>()
  function key(axis: string, value: string, sourceId: string | null): QueueKey {
    return `${axis}::${value.toLowerCase()}::${sourceId ?? ''}`
  }
  for (const q of queue) {
    const k = key(q.axis, q.raw_value, q.source_id)
    const bucket = queueIdx.get(k) ?? []
    bucket.push(q)
    queueIdx.set(k, bucket)
  }

  for (const ax of CANONICAL_AXES) {
    for (const b of brews) {
      const raw = b[ax.column] as string | null | undefined
      if (!raw || !raw.trim()) continue
      if (ax.lookup.isResolvable(raw)) continue

      const queueMatches =
        queueIdx.get(key(ax.axis, raw, b.id)) ??
        queueIdx.get(key(ax.axis, raw, null)) ??
        []

      const pendingMatch = queueMatches.find((q) => q.status === 'pending')
      const resolvedMatch = queueMatches.find((q) =>
        ['promoted', 'aliased'].includes(q.status),
      )
      const rejectedMatch = queueMatches.find((q) =>
        ['rejected', 'duplicate'].includes(q.status),
      )

      if (pendingMatch) {
        findings.push({
          severity: 'info',
          row: brewLabel(b),
          detail: `${ax.axis}="${raw}" non-resolvable but queued (status=pending, queue/${pendingMatch.id.slice(0, 8)}). Legitimate override awaiting arbitration.`,
        })
      } else if (resolvedMatch) {
        findings.push({
          severity: 'A',
          row: brewLabel(b),
          detail: `${ax.axis}="${raw}" non-resolvable but queue resolved (status=${resolvedMatch.status}, target="${resolvedMatch.canonical_target ?? '?'}", queue/${resolvedMatch.id.slice(0, 8)}). Brew row should have been re-canonicalized post-resolution.`,
        })
      } else if (rejectedMatch) {
        findings.push({
          severity: 'B',
          row: brewLabel(b),
          detail: `${ax.axis}="${raw}" non-resolvable; queue entry was ${rejectedMatch.status} (queue/${rejectedMatch.id.slice(0, 8)}). Brew should have been corrected.`,
        })
      } else {
        // No queue entry at all — silent drift.
        const sev: Severity = ax.allowOverride ? 'B' : 'B'
        const note = ax.allowOverride
          ? 'Override flag was passed but queue insert failed, OR row bypassed the API.'
          : 'No override path exists for this axis (strict registry).'
        findings.push({
          severity: sev,
          row: brewLabel(b),
          detail: `${ax.axis}="${raw}" non-resolvable. No taxonomy_overrides_queue entry found. ${note}`,
        })
      }
    }
  }

  return {
    number: 5,
    name: 'Canonical drift on text-only columns',
    summary: `Scanned ${brews.length} brews × 6 canonical axes (roaster / producer / brewer / filter / grinder / roast_level). Cross-references taxonomy_overrides_queue by (axis, raw_value, source_id) to label queued-override (info) vs silent-drift (B).`,
    findings,
    clean: findings.length === 0,
  }
}

// ---------------------------------------------------------------------------
// Dimension 6 — Phase 3 queue health
// ---------------------------------------------------------------------------

async function auditPhase3QueueHealth(
  supabase: SupabaseClient,
  userId: string,
): Promise<DimensionResult> {
  const findings: Finding[] = []

  const queue = await fetchAll<QueueRow>(
    supabase,
    'taxonomy_overrides_queue',
    'id, axis, raw_value, source_kind, source_id, status, submitted_at, resolved_at, canonical_target',
    userId,
  )
  for (const q of queue) {
    if (q.status !== 'pending') continue
    const age = daysAgo(q.submitted_at)
    if (age != null && age > 7) {
      findings.push({
        severity: 'B',
        row: `taxonomy_overrides_queue/${q.id.slice(0, 8)}`,
        detail: `Pending ${age}d (>7d): axis=${q.axis} raw="${q.raw_value}" source=${q.source_kind ?? '?'}/${q.source_id?.slice(0, 8) ?? '?'}. Needs arbitration via ARBITER.md playbook.`,
      })
    }
  }

  // Provenance bug: row marked auto_created whose FK now resolves to a canonical row.
  // We can't tell from the green_beans table alone whether the FK target row was
  // ever auto_created vs canonical; surface the marker as a candidate for review
  // and recommend manual SQL spot-check before flipping the flag.
  const greenBeans = await fetchAll<GreenBeanRow>(
    supabase,
    'green_beans',
    'id, lot_id, name, terroir_id, cultivar_id, terroir_provenance, cultivar_provenance, canonicals_updated_at',
    userId,
  )
  for (const gb of greenBeans) {
    if (gb.terroir_provenance === 'auto_created' && gb.terroir_id) {
      findings.push({
        severity: 'A',
        row: `green_beans/${gb.id.slice(0, 8)}`,
        detail: `terroir_provenance='auto_created' on ${gb.lot_id ?? '?'} ${gb.name ?? '?'} — confirm whether the FK target row resolves to canonical (Latent-side drift = bug per memory rule); if so, flip to 'canonical' + bump canonicals_updated_at.`,
      })
    }
    if (gb.cultivar_provenance === 'auto_created' && gb.cultivar_id) {
      findings.push({
        severity: 'A',
        row: `green_beans/${gb.id.slice(0, 8)}`,
        detail: `cultivar_provenance='auto_created' on ${gb.lot_id ?? '?'} ${gb.name ?? '?'} — confirm whether the FK target row resolves to canonical; if so, flip to 'canonical' + bump canonicals_updated_at.`,
      })
    }
  }

  return {
    number: 6,
    name: 'Phase 3 queue health',
    summary: `Scanned ${queue.length} taxonomy_overrides_queue rows + ${greenBeans.length} green_beans for provenance markers.`,
    findings,
    clean: findings.length === 0,
  }
}

// ---------------------------------------------------------------------------
// Dimension 7 — pair completeness (roast → cupping)
// ---------------------------------------------------------------------------

async function auditPairCompleteness(
  supabase: SupabaseClient,
  userId: string,
): Promise<DimensionResult> {
  const findings: Finding[] = []

  const roasts = await fetchAll<RoastRow>(
    supabase,
    'roasts',
    'id, green_bean_id, roast_date, is_reference, batch_id',
    userId,
  )
  const cuppings = await fetchAll<CuppingRow>(supabase, 'cuppings', 'id, roast_id, cupping_date', userId)

  const cuppingsByRoast = new Map<string, CuppingRow[]>()
  for (const c of cuppings) {
    if (!c.roast_id) continue
    const bucket = cuppingsByRoast.get(c.roast_id) ?? []
    bucket.push(c)
    cuppingsByRoast.set(c.roast_id, bucket)
  }

  for (const r of roasts) {
    const has = cuppingsByRoast.get(r.id)?.length ?? 0
    if (has > 0) continue
    const age = daysAgo(r.roast_date)
    // Per Chris's workflow: only the ULTIMATE reference roast per green-bean
    // lot needs a formal cupping. Per-experiment iterations are intentionally
    // not cupped. So is_reference=true + no cupping is the only Bucket B case;
    // everything else is observational (info).
    let severity: Severity = 'info'
    let bucketLabel: string
    if (r.is_reference) {
      severity = age != null && age >= 7 ? 'B' : 'info'
      bucketLabel = 'is_reference=true (must have cupping ≥ day 7)'
    } else if (age != null && age >= 30) {
      bucketLabel = '>30d non-reference (intentional, no formal cupping)'
    } else if (age != null && age >= 7) {
      bucketLabel = '7-30d non-reference'
    } else {
      bucketLabel = '<7d (mid-iteration)'
    }
    findings.push({
      severity,
      row: `roasts/${r.id.slice(0, 8)}`,
      detail: `0 cuppings on roast batch=${r.batch_id ?? '?'} (${age != null ? `${age}d old, ${bucketLabel}` : 'no roast_date'}${r.is_reference ? ', is_reference=true' : ''}).`,
    })
  }

  return {
    number: 7,
    name: 'Roast → cupping pair completeness',
    summary: `Scanned ${roasts.length} roasts × ${cuppings.length} cuppings. Bucket B reserved for is_reference=true with no cupping ≥ 7d old; non-reference findings are observational (Chris doesn't formally cup every iteration — only the lot's ultimate reference).`,
    findings,
    clean: findings.every((f) => f.severity === 'info'),
  }
}

// ---------------------------------------------------------------------------
// Dimension 8 — modifier shape integrity
// ---------------------------------------------------------------------------

async function auditModifierShape(
  supabase: SupabaseClient,
  userId: string,
): Promise<DimensionResult> {
  const findings: Finding[] = []
  const brews = await fetchAll<BrewRow>(supabase, 'brews', BREW_COLUMNS, userId)

  for (const b of brews) {
    const result = cleanModifiers(b.modifiers)
    if (!result.ok) {
      findings.push({
        severity: 'B',
        row: brewLabel(b),
        detail: `cleanModifiers failed: ${result.error}. Raw: ${JSON.stringify(b.modifiers)}.`,
      })
      continue
    }
    for (const m of result.value) {
      if (m.type === 'output_selection' && m.form === 'dilution' && m.dilution_g == null) {
        findings.push({
          severity: 'A',
          row: brewLabel(b),
          detail: `output_selection.form='dilution' but dilution_g is null. Populate the post-brew dilution amount.`,
        })
      }
      if (m.type === 'role_based_pulse' && (!m.roles || !m.roles.trim())) {
        findings.push({
          severity: 'A',
          row: brewLabel(b),
          detail: `role_based_pulse modifier present but roles field is empty. Populate per-pour role assignment.`,
        })
      }
    }
  }

  return {
    number: 8,
    name: 'Modifier shape integrity (brews.modifiers jsonb)',
    summary: `Scanned ${brews.length} brews. Validates via cleanModifiers() + post-v8.5 sub-field checks (dilution_g, roles).`,
    findings,
    clean: findings.length === 0,
  }
}

// ---------------------------------------------------------------------------
// Dimension 9 — flavor / structure_tags integrity
// ---------------------------------------------------------------------------

async function auditFlavorIntegrity(
  supabase: SupabaseClient,
  userId: string,
): Promise<DimensionResult> {
  const findings: Finding[] = []
  const brews = await fetchAll<BrewRow>(supabase, 'brews', BREW_COLUMNS, userId)

  for (const b of brews) {
    const flavorsResult = cleanFlavors(b.flavors)
    if (!flavorsResult.ok) {
      findings.push({
        severity: 'B',
        row: brewLabel(b),
        detail: `cleanFlavors failed: ${flavorsResult.error}.`,
      })
    }
    const tagsResult = cleanStructureTags(b.structure_tags)
    if (!tagsResult.ok) {
      findings.push({
        severity: 'B',
        row: brewLabel(b),
        detail: `cleanStructureTags failed: ${tagsResult.error}. Raw: ${JSON.stringify(b.structure_tags)}.`,
      })
    }
  }

  return {
    number: 9,
    name: 'Flavor / structure_tags integrity',
    summary: `Scanned ${brews.length} brews. Validates brews.flavors via cleanFlavors() and brews.structure_tags via cleanStructureTags().`,
    findings,
    clean: findings.length === 0,
  }
}

// ---------------------------------------------------------------------------
// Dimension 10 — SR brews must have green_bean_id
// ---------------------------------------------------------------------------

async function auditSrGreenBeanLink(
  supabase: SupabaseClient,
  userId: string,
): Promise<DimensionResult> {
  const findings: Finding[] = []
  const brews = await fetchAll<BrewRow>(supabase, 'brews', BREW_COLUMNS, userId)

  for (const b of brews) {
    if (b.roaster === 'Latent' && !b.green_bean_id) {
      findings.push({
        severity: 'B',
        row: brewLabel(b),
        detail: `Self-roasted brew (roaster='Latent') missing green_bean_id. Should have been caught at write time.`,
      })
    }
  }

  return {
    number: 10,
    name: 'SR brews must have green_bean_id',
    summary: `Scanned ${brews.length} brews for roaster='Latent' AND green_bean_id IS NULL. Any finding is broken state.`,
    findings,
    clean: findings.length === 0,
  }
}

// ---------------------------------------------------------------------------
// Dimension 11 — doc_proposals queue health
// ---------------------------------------------------------------------------

interface DocProposalRow {
  id: string
  target_doc: string
  summary: string
  status: string
  created_at: string | null
  applied_at: string | null
}

async function auditDocProposalsHealth(
  supabase: SupabaseClient,
  userId: string,
): Promise<DimensionResult> {
  const findings: Finding[] = []
  const proposals = await fetchAll<DocProposalRow>(
    supabase,
    'doc_proposals',
    'id, target_doc, summary, status, created_at, applied_at',
    userId,
  )

  for (const p of proposals) {
    if (p.status !== 'pending') continue
    const age = daysAgo(p.created_at)
    if (age != null && age > 14) {
      findings.push({
        severity: 'B',
        row: `doc_proposals/${p.id.slice(0, 8)}`,
        detail: `Pending ${age}d (>14d): target_doc=${p.target_doc} summary="${p.summary.slice(0, 80)}${p.summary.length > 80 ? '…' : ''}". Needs arbitration via ARBITER.md.`,
      })
    }
  }

  return {
    number: 11,
    name: 'doc_proposals queue health',
    summary: `Scanned ${proposals.length} doc_proposals rows; threshold is 14d for pending (longer than taxonomy queue because prose proposals are slower-moving).`,
    findings,
    clean: findings.length === 0,
  }
}

// ---------------------------------------------------------------------------
// Dimension 12 — synthesis cache staleness
// ---------------------------------------------------------------------------

async function auditSynthesisCacheStaleness(
  supabase: SupabaseClient,
  userId: string,
): Promise<DimensionResult> {
  const findings: Finding[] = []

  // (a) terroirs.synthesis_brew_count vs actual brew count by terroir_id
  const terroirs = await fetchAll<{ id: string; macro_terroir: string | null; country: string | null; synthesis: string | null; synthesis_brew_count: number | null }>(
    supabase,
    'terroirs',
    'id, macro_terroir, country, synthesis, synthesis_brew_count',
    userId,
  )
  const cultivars = await fetchAll<{ id: string; name: string | null; lineage: string | null; synthesis: string | null; synthesis_brew_count: number | null }>(
    supabase,
    'cultivars',
    'id, name, lineage, synthesis, synthesis_brew_count',
    userId,
  )
  const brews = await fetchAll<{ id: string; terroir_id: string | null; cultivar_id: string | null; process: string | null; roaster: string | null; created_at: string | null }>(
    supabase,
    'brews',
    'id, terroir_id, cultivar_id, process, roaster, created_at',
    userId,
  )

  const terroirCounts = new Map<string, number>()
  for (const b of brews) {
    if (b.terroir_id) terroirCounts.set(b.terroir_id, (terroirCounts.get(b.terroir_id) ?? 0) + 1)
  }
  for (const t of terroirs) {
    if (t.synthesis == null || t.synthesis_brew_count == null) continue
    const actual = terroirCounts.get(t.id) ?? 0
    if (actual !== t.synthesis_brew_count) {
      findings.push({
        severity: 'info',
        row: `terroirs/${t.id.slice(0, 8)}`,
        detail: `terroir cache stale: ${t.country ?? '?'} · ${t.macro_terroir ?? '?'} · cached_count=${t.synthesis_brew_count} actual_count=${actual}.`,
      })
    }
  }

  const cultivarCounts = new Map<string, number>()
  for (const b of brews) {
    if (b.cultivar_id) cultivarCounts.set(b.cultivar_id, (cultivarCounts.get(b.cultivar_id) ?? 0) + 1)
  }
  for (const c of cultivars) {
    if (c.synthesis == null || c.synthesis_brew_count == null) continue
    const actual = cultivarCounts.get(c.id) ?? 0
    if (actual !== c.synthesis_brew_count) {
      findings.push({
        severity: 'info',
        row: `cultivars/${c.id.slice(0, 8)}`,
        detail: `cultivar cache stale: ${c.name ?? '?'} (lineage ${c.lineage ?? '?'}) · cached_count=${c.synthesis_brew_count} actual_count=${actual}.`,
      })
    }
  }

  // (b) process_syntheses + roaster_syntheses vs MAX(brews.created_at) by dimension.
  interface CacheRow { user_id: string; updated_at: string | null }
  type ProcessCache = CacheRow & { process: string }
  type RoasterCache = CacheRow & { roaster: string }

  const { data: processCache } = await supabase
    .from('process_syntheses')
    .select('user_id, process, updated_at')
    .eq('user_id', userId)
  const { data: roasterCache } = await supabase
    .from('roaster_syntheses')
    .select('user_id, roaster, updated_at')
    .eq('user_id', userId)

  const latestByProcess = new Map<string, string>()
  const latestByRoaster = new Map<string, string>()
  for (const b of brews) {
    if (!b.created_at) continue
    if (b.process) {
      const prev = latestByProcess.get(b.process)
      if (!prev || b.created_at > prev) latestByProcess.set(b.process, b.created_at)
    }
    if (b.roaster) {
      const prev = latestByRoaster.get(b.roaster)
      if (!prev || b.created_at > prev) latestByRoaster.set(b.roaster, b.created_at)
    }
  }

  for (const row of (processCache ?? []) as ProcessCache[]) {
    const latest = latestByProcess.get(row.process)
    if (!latest) continue
    if (!row.updated_at || row.updated_at < latest) {
      findings.push({
        severity: 'info',
        row: `process_syntheses/${row.process}`,
        detail: `cache updated_at=${row.updated_at ?? 'null'} < latest brew created_at=${latest}.`,
      })
    }
  }
  for (const row of (roasterCache ?? []) as RoasterCache[]) {
    const latest = latestByRoaster.get(row.roaster)
    if (!latest) continue
    if (!row.updated_at || row.updated_at < latest) {
      findings.push({
        severity: 'info',
        row: `roaster_syntheses/${row.roaster}`,
        detail: `cache updated_at=${row.updated_at ?? 'null'} < latest brew created_at=${latest}.`,
      })
    }
  }

  return {
    number: 12,
    name: 'Synthesis cache staleness',
    summary: `Cache vs source comparison across terroirs / cultivars / process_syntheses / roaster_syntheses. Severity is info — cache staleness ≠ data drift; use to schedule a re-synthesize pass when convenient.`,
    findings,
    // Cache staleness is observational; treat as clean for the exit code.
    clean: findings.every((f) => f.severity === 'info'),
  }
}

// ---------------------------------------------------------------------------
// Markdown formatter
// ---------------------------------------------------------------------------

function escapePipe(s: string): string {
  return s.replace(/\|/g, '\\|').replace(/\n/g, ' ')
}

function formatMarkdown(results: DimensionResult[]): string {
  const date = new Date().toISOString().split('T')[0]
  const totalFindings = results.reduce((s, r) => s + r.findings.length, 0)
  const dirtyDimensions = results.filter((r) => !r.clean).length
  const lines: string[] = []
  lines.push(`# Data Sanity Audit — ${date}`)
  lines.push('')
  lines.push(`Track 2 of the General cleanup sprint. ${results.length} dimensions audited. ${totalFindings} findings across ${dirtyDimensions} dirty dimensions.`)
  lines.push('')
  lines.push(`Generated by \`scripts/data-sanity-audit.ts\`. Run via \`npm run audit:data\` (one-shot, requires .env.local with NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY).`)
  lines.push('')
  lines.push('## Triage legend')
  lines.push('')
  lines.push('- **Severity A** — inline-fixable. Single-row UPDATE or short series; bundle into a follow-up PR with each fix on its own commit.')
  lines.push('- **Severity B** — needs its own mini-sprint. Multi-row data correction, schema drift requiring migration, or interpretive judgment.')
  lines.push('- **Severity C** — accept-as-known-state. Should round-trip into `KNOWN_STATE` in `scripts/data-sanity-audit.ts`.')
  lines.push('- **Severity info** — observational only, not drift (e.g. cache staleness, queued legitimate overrides).')
  lines.push('')
  lines.push('---')
  lines.push('')
  for (const r of results) {
    lines.push(`## ${r.number}. ${r.name}`)
    lines.push('')
    if (r.summary) {
      lines.push(`> ${r.summary}`)
      lines.push('')
    }
    if (r.findings.length === 0) {
      lines.push('**Status:** 0 findings — clean.')
      lines.push('')
      continue
    }
    const counts = r.findings.reduce<Record<Severity, number>>(
      (acc, f) => { acc[f.severity] = (acc[f.severity] ?? 0) + 1; return acc },
      { A: 0, B: 0, C: 0, info: 0 },
    )
    const cleanLabel = r.clean ? ' (treated as clean for exit code)' : ''
    lines.push(`**Status:** ${r.findings.length} findings — A=${counts.A} B=${counts.B} C=${counts.C} info=${counts.info}${cleanLabel}.`)
    lines.push('')
    lines.push('| Severity | Row | Detail |')
    lines.push('| --- | --- | --- |')
    for (const f of r.findings) {
      lines.push(`| ${f.severity} | ${escapePipe(f.row ?? '—')} | ${escapePipe(f.detail)} |`)
    }
    lines.push('')
  }
  lines.push('---')
  lines.push('')
  lines.push('## Known-state constants in effect')
  lines.push('')
  for (const [key, val] of Object.entries(KNOWN_STATE)) {
    lines.push(`- **${key}** — ${(val as { reason: string }).reason}`)
  }
  lines.push('')
  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const supabase = createServiceClient()
  const userId = await resolveUserId(supabase)

  const results: DimensionResult[] = []
  results.push(await auditOrphanRows(supabase, userId))
  results.push(await auditChildlessPairs(supabase, userId))
  results.push(await auditProcessDrift(supabase, userId))
  results.push(await auditGrindDrift(supabase, userId))
  results.push(await auditCanonicalDrift(supabase, userId))
  results.push(await auditPhase3QueueHealth(supabase, userId))
  results.push(await auditPairCompleteness(supabase, userId))
  results.push(await auditModifierShape(supabase, userId))
  results.push(await auditFlavorIntegrity(supabase, userId))
  results.push(await auditSrGreenBeanLink(supabase, userId))
  results.push(await auditDocProposalsHealth(supabase, userId))
  results.push(await auditSynthesisCacheStaleness(supabase, userId))

  const report = formatMarkdown(results)
  mkdirSync(dirname(REPORT_PATH), { recursive: true })
  writeFileSync(REPORT_PATH, report, 'utf8')

  // eslint-disable-next-line no-console
  console.log(report)
  // eslint-disable-next-line no-console
  console.log(`\nReport written to: ${REPORT_PATH}`)

  const anyFindings = results.some((r) => !r.clean)
  process.exit(anyFindings ? 1 : 0)
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('FATAL:', err instanceof Error ? err.stack ?? err.message : err)
  process.exit(2)
})
