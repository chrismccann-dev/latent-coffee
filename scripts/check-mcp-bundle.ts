// Permanent guard against drift between lib/mcp/docs.ts `DOC_FILES` registrations
// and next.config.js `outputFileTracingIncludes['/api/mcp/**']` bundle globs.
//
// Background: Vercel's static-trace bundles only files it can statically prove
// the route reads. The /api/mcp serverless route reads files at runtime via
// `readFile(path.join(process.cwd(), filename))` where `filename` comes from
// DOC_FILES. Static-trace can't see this, so we explicitly include the files
// via outputFileTracingIncludes. The pattern has bitten three times:
//   - PR #65   — humanizer-skill.md missing
//   - PR #164  — CONTEXT.md missing (cold from brewing cross-party grilling)
//   - PR #164  — docs/roasting/*.md missing (same session)
//
// This script enumerates every file path registered in DOC_FILES and confirms
// at least one glob in outputFileTracingIncludes['/api/mcp/**'] matches it.
// Exits 0 on success, 1 with per-miss report on failure. Wire into pre-push
// hooks or CI when convenient.
//
// Parses both source files as text — does NOT import them — so this runs in
// any worktree without node_modules. Matches scripts/check-registry-md-sync.ts.
//
// Run via:
//   npm run check:mcp-bundle

import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const repoRoot = resolve(__dirname, '..')

function readSrc(rel: string): string {
  return readFileSync(resolve(repoRoot, rel), 'utf-8')
}

// ---------------------------------------------------------------------------
// 1. Isolate the DOC_FILES block from lib/mcp/docs.ts so we don't accidentally
//    pull entries from DOC_DESCRIPTIONS (same shape, different table).
// ---------------------------------------------------------------------------

function extractDocFilesBlock(src: string): string {
  const startRe = /const\s+DOC_FILES[^=]*=\s*\{/
  const m = startRe.exec(src)
  if (!m) {
    throw new Error('extractDocFilesBlock: DOC_FILES declaration not found in lib/mcp/docs.ts')
  }
  let depth = 1
  let i = m.index + m[0].length
  while (i < src.length && depth > 0) {
    const ch = src[i]
    if (ch === '{') depth++
    else if (ch === '}') depth--
    i++
  }
  if (depth !== 0) {
    throw new Error('extractDocFilesBlock: unterminated DOC_FILES block')
  }
  return src.slice(m.index, i)
}

// ---------------------------------------------------------------------------
// 2. Extract every expected file path the MCP route reads at runtime.
//    Two shapes:
//      a. Explicit `'docs://...': '<filepath>'` literal entries
//      b. Spread expressions over const arrays with template-literal paths
//         (e.g. `docs/taxonomies/${axis}.md` → glob `docs/taxonomies/*.md`)
// ---------------------------------------------------------------------------

interface ExpectedFile {
  // Either a literal repo-relative path or a glob with '*' wildcards.
  pattern: string
  source: string
}

function extractExpectedFiles(block: string): ExpectedFile[] {
  const out: ExpectedFile[] = []

  // (a) Literal entries.
  const literalRe = /'(docs:\/\/[^']*)':\s*'([^']+)'/g
  let m: RegExpExecArray | null
  while ((m = literalRe.exec(block)) !== null) {
    out.push({ pattern: m[2], source: `DOC_FILES literal for ${m[1]}` })
  }

  // (b) Template-literal patterns inside spread .map() calls. Each spread
  // produces TWO templates per iteration — URI side + file side. Skip URI side
  // (starts with `docs://`); convert ${var} to * on the file side.
  const templateRe = /`([^`]*\$\{[^`]+\}[^`]*)`/g
  while ((m = templateRe.exec(block)) !== null) {
    const tmpl = m[1]
    if (tmpl.startsWith('docs://')) continue
    const pattern = tmpl.replace(/\$\{[^}]+\}/g, '*')
    out.push({ pattern, source: `DOC_FILES spread template \`${tmpl}\`` })
  }

  return out
}

// ---------------------------------------------------------------------------
// 3. Extract the bundle globs from next.config.js for the /api/mcp/** route.
// ---------------------------------------------------------------------------

function extractBundleGlobs(src: string): string[] {
  const blockRe = /['"]\/api\/mcp\/\*\*['"]\s*:\s*\[([\s\S]*?)\]/
  const m = blockRe.exec(src)
  if (!m) {
    throw new Error(
      "extractBundleGlobs: outputFileTracingIncludes['/api/mcp/**'] block not found in next.config.js",
    )
  }
  const body = m[1]
  const stringRe = /['"]([^'"]+)['"]/g
  const globs: string[] = []
  let g: RegExpExecArray | null
  while ((g = stringRe.exec(body)) !== null) {
    globs.push(g[1].replace(/^\.\//, ''))
  }
  return globs
}

// ---------------------------------------------------------------------------
// 4. Glob matcher. Supports single-* wildcards (no /**, none in current
//    next.config.js); extend if a future bundle glob uses /**.
// ---------------------------------------------------------------------------

function globMatches(glob: string, filePath: string): boolean {
  const re = new RegExp(
    '^' +
      glob
        .replace(/[.+^${}()|[\]\\]/g, '\\$&')
        .replace(/\*/g, '[^/]+') +
      '$',
  )
  return re.test(filePath)
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main(): void {
  const docsTs = readSrc('lib/mcp/docs.ts')
  const nextConfig = readSrc('next.config.js')

  const block = extractDocFilesBlock(docsTs)
  const expected = extractExpectedFiles(block)
  const globs = extractBundleGlobs(nextConfig)

  if (expected.length === 0) {
    console.error(
      'check-mcp-bundle: no entries extracted from lib/mcp/docs.ts DOC_FILES.',
    )
    console.error(
      'This likely means the file structure changed and the parser needs updating.',
    )
    process.exit(1)
  }

  // Dedupe (template patterns may match multiple literal entries).
  const seen = new Set<string>()
  const unique = expected.filter((e) => {
    if (seen.has(e.pattern)) return false
    seen.add(e.pattern)
    return true
  })

  const misses: ExpectedFile[] = []
  for (const e of unique) {
    if (!globs.some((g) => globMatches(g, e.pattern))) {
      misses.push(e)
    }
  }

  if (misses.length === 0) {
    console.log(
      `check-mcp-bundle: ${unique.length} DOC_FILES path(s) / pattern(s) all covered by ${globs.length} bundle glob(s).`,
    )
    process.exit(0)
  }

  console.error(
    `check-mcp-bundle: ${misses.length} DOC_FILES entry/pattern NOT covered by /api/mcp/** bundle:`,
  )
  for (const miss of misses) {
    console.error(`  - ${miss.pattern}  (${miss.source})`)
  }
  console.error('')
  console.error(
    "Add the missing path(s) to next.config.js outputFileTracingIncludes['/api/mcp/**'].",
  )
  console.error(
    'If the registered doc is intentionally not bundled, remove it from lib/mcp/docs.ts DOC_FILES instead.',
  )
  process.exit(1)
}

main()
