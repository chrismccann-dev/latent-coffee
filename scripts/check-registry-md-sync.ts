// Permanent guard against drift between lib/<axis>-registry.ts (validation
// mirrors) and docs/taxonomies/<axis>.md (authored sources).
//
// Run via:
//   npm run check:registry-sync
//
// Exits 0 when every axis is in sync, 1 with per-axis diffs otherwise. Each
// axis defines a tsExtractor + mdExtractor that returns canonical names. The
// shared diff helper compares both directions. Aliases are out of scope for
// this first cut (defer; alias drift is lower-impact than missing canonicals).
//
// Parses the .ts files as text — does NOT import them, so the script runs in
// the worktree without node_modules and without crossing Next.js path-alias
// boundaries.

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AxisCheck {
  /** Display label like "brewers" or "process — base". */
  name: string
  /** Path to .ts source, relative to repo root. */
  tsPath: string
  /** Path to .md source, relative to repo root. */
  mdPath: string
  /**
   * Optional second .md source whose names are UNIONed with mdPath's. Used when
   * one registry is mirrored across two docs — e.g. filters split into an
   * owned-only cluster doc + a not-owned archive (pruning case 004, 2026-06-03).
   */
  mdPathExtra?: string
  /** Pull canonical names from the .ts source text. */
  extractTs: (src: string) => string[]
  /** Pull canonical names from the .md source text. */
  extractMd: (src: string) => string[]
}

interface AxisResult {
  axis: AxisCheck
  tsNames: string[]
  mdNames: string[]
  missingInMd: string[]
  missingInTs: string[]
}

// ---------------------------------------------------------------------------
// Shared parsing helpers
// ---------------------------------------------------------------------------

/**
 * Capture the source text between the matching `[` and `]` of a top-level
 * `export const NAME = [ ... ]` (or `export const NAME: T = [ ... ]`).
 * Walks bracket depth while ignoring `[` / `]` inside string / template
 * literals and line comments. Throws when the export isn't found.
 */
function extractArrayBlock(src: string, exportName: string): string {
  const startRe = new RegExp(
    `export\\s+const\\s+${exportName}\\b[^=]*=\\s*\\[`,
    'm',
  )
  const m = startRe.exec(src)
  if (!m) throw new Error(`extractArrayBlock: could not find export ${exportName}`)
  const open = m.index + m[0].length - 1 // position of the `[`
  let i = open + 1
  let depth = 1
  while (i < src.length) {
    const ch = src[i]
    // Line comment — skip to newline.
    if (ch === '/' && src[i + 1] === '/') {
      const nl = src.indexOf('\n', i)
      i = nl < 0 ? src.length : nl + 1
      continue
    }
    // Block comment.
    if (ch === '/' && src[i + 1] === '*') {
      const end = src.indexOf('*/', i + 2)
      i = end < 0 ? src.length : end + 2
      continue
    }
    // String / template literal — skip past matching quote.
    if (ch === '"' || ch === "'" || ch === '`') {
      i = skipString(src, i)
      continue
    }
    if (ch === '[') depth++
    else if (ch === ']') {
      depth--
      if (depth === 0) return src.slice(open + 1, i)
    }
    i++
  }
  throw new Error(`extractArrayBlock: unbalanced array for ${exportName}`)
}

/** Advance past a string starting at src[i] (the opening quote), returning the index after the closing quote. */
function skipString(src: string, start: number): number {
  const quote = src[start]
  let i = start + 1
  while (i < src.length) {
    const ch = src[i]
    if (ch === '\\') {
      i += 2
      continue
    }
    if (ch === quote) return i + 1
    i++
  }
  return src.length
}

/** Pull every `name: '...'` / `name: "..."` value from a block (rich-entry array). */
function extractNameFields(block: string): string[] {
  const re = /\bname:\s*(['"])((?:\\.|(?!\1).)*)\1/g
  const out: string[] = []
  // Array.from materializes the iterator so this compiles under the
  // project's default TS target (no downlevelIteration required).
  for (const m of Array.from(block.matchAll(re))) out.push(unescape(m[2]))
  return out
}

/** Pull every quoted top-level string literal from a block (string-only array). */
function extractStringLiterals(block: string): string[] {
  const re = /(['"`])((?:\\.|(?!\1).)*)\1/g
  const out: string[] = []
  for (const m of Array.from(block.matchAll(re))) out.push(unescape(m[2]))
  return out
}

function unescape(s: string): string {
  return s.replace(/\\(['"`\\])/g, '$1')
}

/**
 * Slice a markdown source down to the body of a specific H2 / H3 section
 * (between the named header and the next same-or-higher-level header).
 * Returns null when the header isn't found. `level` is `2` for `## H` /
 * `3` for `### H`.
 */
function sliceSection(src: string, level: 2 | 3, title: string): string | null {
  const prefix = '#'.repeat(level)
  // Match the header literally — caller passes the exact title text.
  const startRe = new RegExp(
    `^${prefix}\\s+${escapeRegex(title)}\\s*$`,
    'm',
  )
  const m = startRe.exec(src)
  if (!m) return null
  const startIdx = m.index + m[0].length
  // Stop at the next header of equal or higher level (i.e. `^#{1..level} `).
  const stopRe = new RegExp(`^#{1,${level}}\\s+`, 'm')
  stopRe.lastIndex = startIdx
  const rest = src.slice(startIdx)
  const stop = stopRe.exec(rest)
  return stop ? rest.slice(0, stop.index) : rest
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Strip leading/trailing markdown decoration (bold + italic) from a name string. */
function stripDecor(s: string): string {
  let out = s.trim()
  // Strip surrounding bold / italic markers, repeatedly.
  while (true) {
    const next = out.replace(/^\*\*([^*]*)\*\*$/, '$1').replace(/^\*([^*]+)\*$/, '$1')
    if (next === out) break
    out = next.trim()
  }
  return out
}

// ---------------------------------------------------------------------------
// Per-axis extractors
// ---------------------------------------------------------------------------

// --- ts: rich-entry arrays (BREWERS / FILTERS / CULTIVARS / PRODUCERS /
//         ROASTERS / ROAST_LEVELS / GRINDERS / SIGNATURE_METHODS / BASE_FLAVORS / FLAVOR_MODIFIERS)

function tsRichArray(exportName: string) {
  return (src: string) => extractNameFields(extractArrayBlock(src, exportName))
}

// --- ts: plain string arrays (TERROIR_MACROS / BASE_PROCESSES / etc.)

function tsStringArray(exportName: string) {
  return (src: string) => extractStringLiterals(extractArrayBlock(src, exportName))
}

// --- ts: STRUCTURE_TAGS — combine `axis:descriptor`

function tsStructureTags(src: string): string[] {
  const block = extractArrayBlock(src, 'STRUCTURE_TAGS')
  // Each entry is { axis: "X", descriptor: "Y", ... }.
  const re = /\{[^{}]*\baxis:\s*(['"])([^'"]+)\1[^{}]*\bdescriptor:\s*(['"])([^'"]+)\3[^{}]*\}/g
  const out: string[] = []
  for (const m of Array.from(block.matchAll(re))) out.push(`${m[2]}:${m[4]}`)
  return out
}

// --- md: H3 headers under a specific H2 section.
//
// Optional `headerNormalizer` strips suffixes like ` — Owned` or
// ` *[skeleton — pending rich research]*` and may return null to signal
// "this header isn't a canonical name (e.g. system grouper)".
function mdH3Headers(
  parentH2: string,
  headerNormalizer?: (raw: string) => string | null,
) {
  return (src: string) => {
    const section = sliceSection(src, 2, parentH2)
    if (section == null) {
      throw new Error(`mdH3Headers: H2 section not found: ${parentH2}`)
    }
    const out: string[] = []
    for (const line of section.split('\n')) {
      const m = /^### \s*(.+?)\s*$/.exec(line)
      if (!m) continue
      const raw = m[1]
      const normalized = headerNormalizer ? headerNormalizer(raw) : raw
      if (normalized) out.push(normalized)
    }
    return out
  }
}

// --- md: brewer/filter shape — `### {Name}` or `### {Name} — Owned`.
// Non-entry H2 sections whose H3 children are prose, NOT canonical entries.
// Matched on the trimmed H2 title (case-insensitive). `appendix` is a substring
// match so research appendices of any name are covered (filters.md RP5 appendix
// added 2026-06-20: `### Texture is flow-mediated (...)` is a finding, not a filter).
const OWNABLE_NON_ENTRY_H2 = /(^purpose\b|^selection rules\b|^aliases\b|^sources\b|^changelog\b|appendix)/i
function mdH3HeadersForOwnable(rootSrc: string): string[] {
  // brewers.md and filters.md list canonical entries as H3 under gear-category
  // H2s. The doc-meta sections (Purpose / Selection rules / Research measurement
  // appendix / Aliases / Sources / Changelog) may carry their own H3 subsections
  // that are NOT entries — track the current H2 and skip those, so an appendix
  // heading never reads as a phantom canonical.
  const out: string[] = []
  let inNonEntrySection = false
  for (const line of rootSrc.split('\n')) {
    const h2 = /^## \s*(.+?)\s*$/.exec(line)
    if (h2) {
      inNonEntrySection = OWNABLE_NON_ENTRY_H2.test(h2[1].trim())
      continue
    }
    const m = /^### \s*(.+?)\s*$/.exec(line)
    if (!m) continue
    if (inNonEntrySection) continue
    let name = m[1]
    // Strip heading suffixes: ` — Owned` (brewers.md) and ` — \`SKU\`` (filters.md
    // entries carry their SKU code in a trailing backtick span).
    name = name.replace(/\s+—\s+`[^`]+`\s*$/, '')
    name = name.replace(/\s+—\s+Owned\s*$/, '')
    out.push(name.trim())
  }
  return out
}

// --- md: producer shape — `### {Name}` or `### {Name} *[skeleton ...]*`,
//         skipping system-grouping headers like `### Colombia Processing Labs · 14 producers`.
function mdH3HeadersForProducers(src: string): string[] {
  const out: string[] = []
  for (const line of src.split('\n')) {
    const m = /^### \s*(.+?)\s*$/.exec(line)
    if (!m) continue
    let name = m[1]
    // System-grouping headers carry a `· N producers` suffix.
    if (/·\s+\d+\s+producers?\s*$/.test(name)) continue
    // Strip skeleton annotation: ` *[skeleton — pending rich research]*`.
    name = name.replace(/\s+\*\[[^\]]+\]\*\s*$/, '')
    out.push(name.trim())
  }
  return out
}

// --- md: roaster shape — `- **{Name}**` bullets under `## Canonical list`.
function mdRoasterCanonicals(src: string): string[] {
  const section = sliceSection(src, 2, 'Canonical list')
  if (section == null) throw new Error('mdRoasterCanonicals: ## Canonical list missing')
  const out: string[] = []
  for (const line of section.split('\n')) {
    const m = /^-\s+\*\*([^*]+?)\*\*/.exec(line)
    if (!m) continue
    out.push(m[1].trim())
  }
  return out
}

// --- md: roast-level shape — table rows `| **{Name}** |` under `## Canonical list`.
function mdRoastLevelCanonicals(src: string): string[] {
  const section = sliceSection(src, 2, 'Canonical list')
  if (section == null) throw new Error('mdRoastLevelCanonicals: ## Canonical list missing')
  const out: string[] = []
  for (const line of section.split('\n')) {
    const m = /^\|\s*\*\*([^*]+?)\*\*\s*\|/.exec(line)
    if (!m) continue
    out.push(m[1].trim())
  }
  return out
}

// --- md: grinder shape — table rows `| **EG-1** | ... |` under `## Canonical list`.
function mdGrinderCanonicals(src: string): string[] {
  return mdRoastLevelCanonicals(src) // identical pattern (single column with bolded name)
}

// --- md: regions — `### {Macro}` headers under `## Reference content`,
//         deduped (a macro spanning multiple countries is documented per-country).
function mdRegionMacros(src: string): string[] {
  const ext = mdH3Headers('Reference content')
  const seen = new Set<string>()
  const out: string[] = []
  for (const name of ext(src)) {
    if (seen.has(name)) continue
    seen.add(name)
    out.push(name)
  }
  return out
}

// --- md: process / flavor sub-axis bullets like `- **{Name}** - desc...`,
//         scoped to a specific H3 under `## Canonical list` (or wherever).
function mdBoldBullets(parentH2: string, h3Title: string) {
  return (src: string) => {
    const h2Section = sliceSection(src, 2, parentH2)
    if (h2Section == null) throw new Error(`mdBoldBullets: H2 missing: ${parentH2}`)
    const h3Section = sliceSection(h2Section, 3, h3Title)
    if (h3Section == null) throw new Error(`mdBoldBullets: H3 missing under ${parentH2}: ${h3Title}`)
    const out: string[] = []
    for (const line of h3Section.split('\n')) {
      const m = /^-\s+\*\*([^*]+?)\*\*/.exec(line)
      if (!m) continue
      out.push(m[1].trim())
    }
    return out
  }
}

// --- md: flavor base lists (mixed shapes — plain comma list / bolded subcat / inline bold names).
//
// Inside `## Base Flavors` each H3 like `### Acid (1)` carries either:
//   - Plain bullets: `- Cardboard, Earthy, Leather, ...`
//   - Sub-categorized bullets: `- **Berry (15):** Black Currant, Blackberry, ...`
//   - Mixed inline bold names: `- Cherry Blossom, ..., **+ Coffee Blossom**`
//   - Bolded names with italic note: `- ..., **Sugar** *(generic catch-all)*`
function mdFlavorBases(src: string): string[] {
  const section = sliceSection(src, 2, 'Base Flavors (182)')
  if (section == null) throw new Error('mdFlavorBases: ## Base Flavors (182) missing')
  const out: string[] = []
  const seen = new Set<string>()
  for (const line of section.split('\n')) {
    if (!/^-\s/.test(line)) continue
    let body = line.replace(/^-\s+/, '')
    // Strip leading sub-category prefix `**Berry (15):**` (with the colon).
    body = body.replace(/^\*\*[^*]+\*\*\s*:?\s*/, '')
    for (const piece of body.split(',')) {
      let name = piece.trim()
      if (!name) continue
      // Strip trailing italic note, e.g. `*(generic catch-all)*`.
      name = name.replace(/\s*\*\([^)]+\)\*\s*$/, '').trim()
      // Strip surrounding bold first so `**+ Coffee Blossom**` peels to `+ Coffee Blossom`.
      name = name.replace(/^\*\*(.+?)\*\*$/, '$1').trim()
      // Strip `+ ` prefix marker.
      name = name.replace(/^\+\s+/, '').trim()
      // Drop a trailing parenthetical that may survive (e.g. category counts).
      name = name.replace(/\s*\([^)]*\)\s*$/, '').trim()
      if (!name) continue
      if (seen.has(name)) continue
      seen.add(name)
      out.push(name)
    }
  }
  return out
}

// --- md: flavor modifiers — table rows `| {Name} | description |` under each H3 of `## Modifiers`.
function mdFlavorModifiers(src: string): string[] {
  const section = sliceSection(src, 2, 'Modifiers (44)')
  if (section == null) throw new Error('mdFlavorModifiers: ## Modifiers (44) missing')
  const out: string[] = []
  const seen = new Set<string>()
  for (const line of section.split('\n')) {
    if (!line.startsWith('|')) continue
    // Skip the header row and separator row (`| Modifier | Description |` / `|---|---|`).
    if (/^\|\s*Modifier\s*\|/i.test(line)) continue
    if (/^\|\s*-+\s*\|/.test(line)) continue
    const m = /^\|\s*([^|]+?)\s*\|/.exec(line)
    if (!m) continue
    const name = stripDecor(m[1])
    if (!name) continue
    if (seen.has(name)) continue
    seen.add(name)
    out.push(name)
  }
  return out
}

// --- md: structure tags — `## Structure (29)` H2, then per-axis H3 like
//         `### Acidity (4)` with `| Bright | desc |` rows.
function mdStructureTags(src: string): string[] {
  const section = sliceSection(src, 2, 'Structure (29)')
  if (section == null) throw new Error('mdStructureTags: ## Structure (29) missing')
  const out: string[] = []
  const seen = new Set<string>()
  let currentAxis: string | null = null
  for (const line of section.split('\n')) {
    const h3 = /^###\s+([A-Za-z]+)\s*\(\d+\)\s*$/.exec(line)
    if (h3) {
      currentAxis = h3[1]
      continue
    }
    if (!currentAxis) continue
    if (!line.startsWith('|')) continue
    if (/^\|\s*Descriptor\s*\|/i.test(line)) continue
    if (/^\|\s*-+\s*\|/.test(line)) continue
    const m = /^\|\s*([^|]+?)\s*\|/.exec(line)
    if (!m) continue
    const descriptor = stripDecor(m[1])
    if (!descriptor) continue
    const key = `${currentAxis}:${descriptor}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push(key)
  }
  return out
}

// ---------------------------------------------------------------------------
// Axis registry
// ---------------------------------------------------------------------------

const AXES: AxisCheck[] = [
  // 1. Brewers — H3 headers under any H2; ` — Owned` suffix stripped.
  //    Migrated to Brewing Equipment Expert cluster in Wave 1 (ADR-0011).
  {
    name: 'brewers',
    tsPath: 'lib/brewer-registry.ts',
    mdPath: 'docs/skills/brewing-equipment-expert/cluster/brewers.md',
    extractTs: tsRichArray('BREWERS'),
    extractMd: (src) => mdH3HeadersForOwnable(src),
  },

  // 2. Filters — same shape as brewers.
  //    Migrated to Brewing Equipment Expert cluster in Wave 1 (ADR-0011).
  {
    name: 'filters',
    tsPath: 'lib/filter-registry.ts',
    mdPath: 'docs/skills/brewing-equipment-expert/cluster/filters.md',
    // Owned-only cluster doc + not-owned archive (pruning case 004); union both.
    mdPathExtra: 'docs/taxonomies/filters-not-owned-archive.md',
    extractTs: tsRichArray('FILTERS'),
    extractMd: (src) => mdH3HeadersForOwnable(src),
  },

  // 3. Cultivars — `### {Name}` under `## Reference content`.
  {
    name: 'cultivars',
    tsPath: 'lib/cultivar-registry.ts',
    mdPath: 'docs/taxonomies/varieties.md',
    extractTs: tsRichArray('CULTIVARS'),
    extractMd: mdH3Headers('Reference content'),
  },

  // 4. Terroirs (regions) — TERROIR_MACROS distinct names; .md duplicates
  //    one H3 per (country, macro) pair (deduped).
  {
    name: 'terroirs',
    tsPath: 'lib/terroir-registry.ts',
    mdPath: 'docs/taxonomies/regions.md',
    extractTs: tsStringArray('TERROIR_MACROS'),
    extractMd: mdRegionMacros,
  },

  // 5. Roasters — `- **{Name}**` bullets under `## Canonical list`.
  {
    name: 'roasters',
    tsPath: 'lib/roaster-registry.ts',
    mdPath: 'docs/taxonomies/roasters.md',
    extractTs: tsRichArray('ROASTERS'),
    extractMd: mdRoasterCanonicals,
  },

  // 6. Producers — `### {Name}` under `## By Producer System`, skipping
  //    `### {System} · N producers` groupers and stripping skeleton annotation.
  {
    name: 'producers',
    tsPath: 'lib/producer-registry.ts',
    mdPath: 'docs/taxonomies/producers.md',
    extractTs: tsRichArray('PRODUCERS'),
    extractMd: mdH3HeadersForProducers,
  },

  // 7. Roast levels — `| **{Name}** |` table rows under `## Canonical list`.
  {
    name: 'roast-levels',
    tsPath: 'lib/roast-level-registry.ts',
    mdPath: 'docs/taxonomies/roast-levels.md',
    extractTs: tsRichArray('ROAST_LEVELS'),
    extractMd: mdRoastLevelCanonicals,
  },

  // 8. Grinders — `| **{Name}** | ... |` table rows under `## Canonical list`.
  //    Migrated to Brewing Equipment Expert cluster in Wave 1 (ADR-0011);
  //    file renamed to grinder-eg1.md to leave the cluster expandable.
  {
    name: 'grinders',
    tsPath: 'lib/grinder-registry.ts',
    mdPath: 'docs/skills/brewing-equipment-expert/cluster/grinder-eg1.md',
    extractTs: tsRichArray('GRINDERS'),
    extractMd: mdGrinderCanonicals,
  },

  // 8b. SWORKS valve flow (Sprint T5 / CR-7) — single canonical dripper.
  //     Same `| **{Name}** | ... |` pattern as grinders.
  //     Migrated to Brewing Equipment Expert cluster in Wave 1 (ADR-0011).
  {
    name: 'sworks',
    tsPath: 'lib/sworks-registry.ts',
    mdPath: 'docs/skills/brewing-equipment-expert/cluster/sworks.md',
    extractTs: tsRichArray('SWORKS_DRIPPERS'),
    extractMd: mdGrinderCanonicals,
  },

  // 9. Process — composable, 8 sub-axes. Each gets its own row so a drift in
  //    one axis surfaces with that axis's name.
  {
    name: 'process — base',
    tsPath: 'lib/process-registry.ts',
    mdPath: 'docs/taxonomies/processes.md',
    extractTs: tsStringArray('BASE_PROCESSES'),
    extractMd: mdBoldBullets('Canonical list', 'Base processes (4)'),
  },
  {
    name: 'process — honey subprocess',
    tsPath: 'lib/process-registry.ts',
    mdPath: 'docs/taxonomies/processes.md',
    extractTs: tsStringArray('HONEY_SUBPROCESSES'),
    extractMd: mdBoldBullets('Canonical list', 'Subprocesses (Honey color tiers only, 7)'),
  },
  {
    name: 'process — fermentation',
    tsPath: 'lib/process-registry.ts',
    mdPath: 'docs/taxonomies/processes.md',
    extractTs: tsStringArray('FERMENTATION_MODIFIERS'),
    extractMd: mdBoldBullets('Canonical list', 'Fermentation modifiers (13)'),
  },
  {
    name: 'process — drying',
    tsPath: 'lib/process-registry.ts',
    mdPath: 'docs/taxonomies/processes.md',
    extractTs: tsStringArray('DRYING_MODIFIERS'),
    extractMd: mdBoldBullets('Canonical list', 'Drying modifiers (5)'),
  },
  {
    name: 'process — intervention',
    tsPath: 'lib/process-registry.ts',
    mdPath: 'docs/taxonomies/processes.md',
    extractTs: tsStringArray('INTERVENTION_MODIFIERS'),
    extractMd: mdBoldBullets('Canonical list', 'Intervention modifiers (7)'),
  },
  {
    name: 'process — experimental',
    tsPath: 'lib/process-registry.ts',
    mdPath: 'docs/taxonomies/processes.md',
    extractTs: tsStringArray('EXPERIMENTAL_MODIFIERS'),
    extractMd: mdBoldBullets('Canonical list', 'Experimental modifiers (4)'),
  },
  {
    name: 'process — decaf',
    tsPath: 'lib/process-registry.ts',
    mdPath: 'docs/taxonomies/processes.md',
    extractTs: tsStringArray('DECAF_MODIFIERS'),
    extractMd: mdBoldBullets('Canonical list', 'Decaf modifiers (4)'),
  },
  {
    name: 'process — signature',
    tsPath: 'lib/process-registry.ts',
    mdPath: 'docs/taxonomies/processes.md',
    extractTs: tsRichArray('SIGNATURE_METHODS'),
    extractMd: mdBoldBullets('Canonical list', 'Signature methods (15)'),
  },

  // 10. Flavor — composable, 3 sub-axes (bases / modifiers / structure).
  {
    name: 'flavor — base',
    tsPath: 'lib/flavor-registry.ts',
    mdPath: 'docs/taxonomies/flavors.md',
    extractTs: tsRichArray('BASE_FLAVORS'),
    extractMd: mdFlavorBases,
  },
  {
    name: 'flavor — modifier',
    tsPath: 'lib/flavor-registry.ts',
    mdPath: 'docs/taxonomies/flavors.md',
    extractTs: tsRichArray('FLAVOR_MODIFIERS'),
    extractMd: mdFlavorModifiers,
  },
  {
    name: 'flavor — structure',
    tsPath: 'lib/flavor-registry.ts',
    mdPath: 'docs/taxonomies/flavors.md',
    extractTs: tsStructureTags,
    extractMd: mdStructureTags,
  },
]

// ---------------------------------------------------------------------------
// Diff + report
// ---------------------------------------------------------------------------

function diffAxis(axis: AxisCheck, repoRoot: string): AxisResult {
  const tsSrc = readFileSync(resolve(repoRoot, axis.tsPath), 'utf8')
  const mdSrc = readFileSync(resolve(repoRoot, axis.mdPath), 'utf8')
  const tsNamesRaw = axis.extractTs(tsSrc)
  const mdNamesRaw = axis.extractMd(mdSrc)
  // Two-doc registries (e.g. filters: owned cluster doc + not-owned archive)
  // union the extra doc's names into the md side.
  if (axis.mdPathExtra) {
    const extraSrc = readFileSync(resolve(repoRoot, axis.mdPathExtra), 'utf8')
    mdNamesRaw.push(...axis.extractMd(extraSrc))
  }

  const tsNames = unique(tsNamesRaw)
  const mdNames = unique(mdNamesRaw)

  // Compare case-sensitively. The factory's `canonicalize` is case-insensitive,
  // but the doc + registry should agree on the title-case canonical form.
  const tsSet = new Set(tsNames)
  const mdSet = new Set(mdNames)

  const missingInMd = tsNames.filter((n) => !mdSet.has(n))
  const missingInTs = mdNames.filter((n) => !tsSet.has(n))

  return { axis, tsNames, mdNames, missingInMd, missingInTs }
}

function unique(xs: string[]): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const x of xs) {
    if (seen.has(x)) continue
    seen.add(x)
    out.push(x)
  }
  return out
}

function formatResult(r: AxisResult): { ok: boolean; lines: string[] } {
  const ok = r.missingInMd.length === 0 && r.missingInTs.length === 0
  const status = ok ? 'OK ' : 'FAIL'
  const lines: string[] = [
    `[${status}] ${r.axis.name}  (ts: ${r.tsNames.length}, md: ${r.mdNames.length})`,
  ]
  if (r.missingInMd.length) {
    lines.push(`  In ${r.axis.tsPath} but missing from ${r.axis.mdPath}:`)
    for (const n of r.missingInMd) lines.push(`    - ${n}`)
  }
  if (r.missingInTs.length) {
    lines.push(`  In ${r.axis.mdPath} but missing from ${r.axis.tsPath}:`)
    for (const n of r.missingInTs) lines.push(`    - ${n}`)
  }
  return { ok, lines }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main(): void {
  // Repo root = parent of scripts/ — resolve from this file's location.
  // tsx runs the script as TS so `__dirname` works after the loader rewrite,
  // but use a relative path resolution so we don't depend on it.
  const repoRoot = resolve(process.cwd())

  let anyFail = false
  const out: string[] = []
  out.push('Registry ↔ taxonomy markdown sync check')
  out.push('=========================================')

  for (const axis of AXES) {
    let result: AxisResult
    try {
      result = diffAxis(axis, repoRoot)
    } catch (err) {
      anyFail = true
      out.push(`[ERR ] ${axis.name}: ${(err as Error).message}`)
      continue
    }
    const { ok, lines } = formatResult(result)
    if (!ok) anyFail = true
    for (const l of lines) out.push(l)
  }

  out.push('')
  out.push(anyFail ? 'DRIFT DETECTED — see entries above.' : 'All axes in sync.')

  // eslint-disable-next-line no-console
  console.log(out.join('\n'))
  process.exit(anyFail ? 1 : 0)
}

main()
