// Internal-doc-link gate (Cluster B, spec'd in full by architecture-audit
// Session 04 — docs/audits/architecture/04-doc-substrate.md). The deterministic
// spin-out of the /architecture-review doc-substrate mode: it DETECTS dead file
// targets + dead `#anchor` fragments; the skill keeps the live-vs-archive +
// stale-vs-dead JUDGMENT the gate can't have.
//
// Resolution base = REPO ROOT, per ADR-0021 (docs/adr/0021-root-relative-doc-links.md).
// The Claude Code agent — the primary doc consumer — resolves links from cwd =
// repo root, so a `docs/x.md` link is correct and a `../../docs/x.md` link is a
// convention violation this gate flags (the Session-04 Candidate 1/3/4 backlog).
//
// THE HIGH-VALUE CHECK is anchor validation (Session 04-F3): a "does the file
// exist" checker passes every redirect-stub link — ROASTING.md/BREWING.md still
// EXIST as ~3-8KB pointer stubs, but their deep section anchors were migrated
// into cluster docs and are gone, so an agent following the link lands on a stub
// with no error signal. We generate GitHub-slug anchor sets per target file and
// validate every `#fragment`.
//
// THE SKIP-LIST is the deliverable as much as the checks (Session 04-F2): the
// naive checker's ~8% false-positive rate maps 1:1 to Latent doc conventions the
// external sources never anticipated. Each skip class below is one FP taxonomy
// row from Session 04:
//   - http(s)/mailto/tel                         → external
//   - ~/… , /Users/… , leading-/                 → memory refs / out-of-repo
//   - docs://…                                    → MCP Resource; validated
//                                                  against lib/mcp/docs.ts, NOT fs
//                                                  (a docs:// → unregistered
//                                                  Resource is itself a real bug)
//   - trailing :NN and #LNN line suffixes        → Claude-Code clickable-line
//                                                  refs; the file exists
//   - <…> template placeholders                  → fill-in-the-blank tokens
//   - per-file `<!-- skeleton -->` opt-out       → deliberate not-yet-authored
//                                                  forward-refs (CCIL seed tree)
//   - grill-with-docs *-FORMAT.md templates      → portable-skill example paths
//                                                  (./src/ordering/…), not this repo
//
// Live-vs-archive (Session 04-F5): misses in the live substrate (root docs +
// docs/skills + docs/prompts + docs/architecture + docs/reference + docs/product)
// FAIL the gate; misses in the archive layer (sprints/features/audits/adr/
// taxonomies/roasting-archive) are reported as non-failing warnings — treating a
// dead link in a closed sprint doc at the same priority as a live CONTEXT-* link
// would waste the whole budget on dead history.
//
// NOTE (cron status): until the Session-04 remediation sprint migrates the
// file-relative minority to root-relative, this gate is EXPECTED to report live
// misses. It runs schedule-only (no pull_request trigger) so it never red-blocks
// an unrelated PR on that pre-existing convention debt — same posture as
// doc-sizes-check.yml. A non-zero run = the remediation backlog still has items.
//
// Pure file reads, no node_modules deps — runs in any worktree. Mirrors
// scripts/check-doc-sizes.ts / check-mcp-bundle.ts.
//
// Run via:
//   npm run check:doc-links              # report; exit 1 if any LIVE miss
//   npm run check:doc-links -- --all     # also list archive-layer warnings in full

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs'
import { resolve, join, dirname, basename } from 'node:path'

const repoRoot = resolve(__dirname, '..')

// ---------------------------------------------------------------------------
// File walk
// ---------------------------------------------------------------------------

function walkMd(rel: string, out: string[]): void {
  const abs = resolve(repoRoot, rel)
  let entries
  try {
    entries = readdirSync(abs, { withFileTypes: true })
  } catch {
    return
  }
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === '.next' || e.name === '.git') continue
    const childRel = rel === '.' ? e.name : join(rel, e.name)
    if (e.isDirectory()) walkMd(childRel, out)
    else if (e.name.endsWith('.md')) out.push(childRel)
  }
}

// ---------------------------------------------------------------------------
// GitHub-slug anchor-set generation (the high-value check — Session 04-F3)
// ---------------------------------------------------------------------------

function stripInlineMarkdown(text: string): string {
  return text
    .replace(/`([^`]*)`/g, '$1') // inline code
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // [label](url) → label
    .replace(/[*~]/g, '') // emphasis markers — NOT `_`: GitHub keeps underscores
    .replace(/<[^>]+>/g, '') // inline HTML tags
    .trim()
  // Underscores survive (they're `\w`, kept by githubSlug's filter) so snake_case
  // headings like `## propose_doc_changes` slug to `propose_doc_changes`, matching
  // GitHub. Stripping `_` as emphasis would false-flag every identifier anchor in
  // this snake_case-heavy repo.
}

function githubSlug(headingText: string): string {
  return stripInlineMarkdown(headingText)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // drop punctuation/unicode (·, —, :, etc.) — GitHub behaviour
    .trim()
    .replace(/\s+/g, '-')
}

// Build the set of anchors a target file exposes: heading slugs (deduped with
// -1/-2 suffixes, GitHub-style) + explicit <a name>/<a id>/{#custom} anchors.
const anchorCache = new Map<string, Set<string>>()

function anchorsFor(absPath: string): Set<string> {
  const cached = anchorCache.get(absPath)
  if (cached) return cached
  const set = new Set<string>()
  let src: string
  try {
    src = readFileSync(absPath, 'utf-8')
  } catch {
    anchorCache.set(absPath, set)
    return set
  }
  const counts = new Map<string, number>()
  let inFence = false
  for (const raw of src.split('\n')) {
    const line = raw.replace(/\r$/, '')
    const trimmed = line.trim()
    if (/^(```|~~~)/.test(trimmed)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue

    const h = /^(#{1,6})\s+(.*)$/.exec(trimmed)
    if (h) {
      let text = h[2]
      // explicit {#custom-id} heading suffix
      const custom = /\{#([\w-]+)\}\s*$/.exec(text)
      if (custom) {
        set.add(custom[1])
        text = text.replace(/\{#[\w-]+\}\s*$/, '').trim()
      }
      let slug = githubSlug(text)
      if (slug === '') continue
      const n = counts.get(slug) ?? 0
      counts.set(slug, n + 1)
      if (n > 0) slug = `${slug}-${n}`
      set.add(slug)
    }
    // explicit HTML anchors anywhere in the line
    for (const m of Array.from(line.matchAll(/<a\s+(?:name|id)=["']([\w-]+)["']/g))) set.add(m[1])
  }
  anchorCache.set(absPath, set)
  return set
}

// ---------------------------------------------------------------------------
// docs:// MCP Resource catalog (validate against lib/mcp/docs.ts, not the fs)
// ---------------------------------------------------------------------------

function buildDocsUriSet(): Set<string> {
  const set = new Set<string>()
  const src = readFileSync(resolve(repoRoot, 'lib/mcp/docs.ts'), 'utf-8')
  // Literal registered keys: 'docs://…': '…'  (also covers DOC_DESCRIPTIONS keys,
  // which are the same URI namespace — a superset is fine for "is it registered").
  for (const m of Array.from(src.matchAll(/'(docs:\/\/[^']+)'/g))) set.add(m[1])
  // Spread-template registrations expand 1:1 over their source dirs.
  for (const f of readdirSync(resolve(repoRoot, 'docs/taxonomies')).filter((n) => n.endsWith('.md'))) {
    set.add(`docs://taxonomies/${basename(f, '.md')}.md`)
  }
  for (const f of readdirSync(resolve(repoRoot, 'docs/prompts')).filter((n) => n.endsWith('.md'))) {
    set.add(`docs://prompts/${basename(f, '.md')}.md`)
  }
  return set
}

// ---------------------------------------------------------------------------
// Live-vs-archive segmentation (Session 04-F5)
// ---------------------------------------------------------------------------

const ARCHIVE_PREFIXES = [
  'docs/sprints/',
  'docs/features/',
  'docs/audits/',
  'docs/adr/',
  'docs/taxonomies/',
  'docs/brewing/',
  'docs/roasting/',
]
const ARCHIVE_FILES = new Set(['docs/grilling-queue.md', 'docs/grilling-flagged-ambiguities.md'])

function isArchive(file: string): boolean {
  const f = file.split('\\').join('/')
  return ARCHIVE_FILES.has(f) || ARCHIVE_PREFIXES.some((p) => f.startsWith(p))
}

// ---------------------------------------------------------------------------
// Per-file skip predicates (FP taxonomy, Session 04)
// ---------------------------------------------------------------------------

function fileIsSkipped(file: string, src: string): boolean {
  const f = file.split('\\').join('/')
  if (/<!--\s*skeleton\s*-->/i.test(src)) return true // per-file opt-out marker
  // grill-with-docs is a vendored PORTABLE skill — its self-contained `./`
  // sibling links + `./src/ordering/…` generic-template examples are its own
  // convention, not Latent substrate (Session 04 FP taxonomy).
  if (f.includes('.claude/skills/grill-with-docs/')) return true
  return false
}

// ---------------------------------------------------------------------------
// Link extraction + classification
// ---------------------------------------------------------------------------

type Reason = 'file-missing' | 'anchor-missing' | 'docs-unregistered'

interface Miss {
  file: string
  line: number
  target: string
  reason: Reason
  detail: string
}

const LINK_RE = /\[(?:[^\]]*)\]\(\s*(<[^>]+>|[^)\s]+)(?:\s+"[^"]*")?\s*\)/g

function isExternalOrMemory(target: string): boolean {
  return (
    /^(https?:|mailto:|tel:|#?ftp:)/i.test(target) ||
    target.startsWith('~') ||
    target.startsWith('/') // /Users/…, absolute fs paths, leading-slash (never a repo root-relative link)
  )
}

function checkFile(file: string, docsUris: Set<string>): Miss[] {
  const abs = resolve(repoRoot, file)
  const src = readFileSync(abs, 'utf-8')
  if (fileIsSkipped(file, src)) return []

  const misses: Miss[] = []
  const lines = src.split('\n')
  let inFence = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()
    if (/^(```|~~~)/.test(trimmed)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue

    LINK_RE.lastIndex = 0
    let m: RegExpExecArray | null
    while ((m = LINK_RE.exec(line)) !== null) {
      let target = m[1]
      if (target.startsWith('<') && target.endsWith('>')) target = target.slice(1, -1)

      // <…> template placeholder anywhere in the target
      if (target.includes('<') || target.includes('>')) continue
      if (isExternalOrMemory(target)) continue

      // docs:// — validate against the MCP Resource catalog, not the filesystem.
      if (target.startsWith('docs://')) {
        const uri = target.split('#')[0]
        if (!docsUris.has(uri)) {
          misses.push({ file, line: i + 1, target, reason: 'docs-unregistered', detail: 'docs:// URI not registered in lib/mcp/docs.ts' })
        }
        continue
      }

      // Split fragment; strip trailing :NN line suffix from the file half.
      const hashIdx = target.indexOf('#')
      let filePart = hashIdx >= 0 ? target.slice(0, hashIdx) : target
      const fragment = hashIdx >= 0 ? target.slice(hashIdx + 1) : ''
      filePart = filePart.replace(/:\d+$/, '')
      // Percent-encoded paths (e.g. app/%28app%29/… for app/(app)/…) resolve once
      // decoded — markdown renderers and the agent both decode before resolving.
      try {
        filePart = decodeURIComponent(filePart)
      } catch {
        /* malformed escape — leave as-is */
      }

      // #LNN / #L10-L20 line refs → not anchors; only file existence matters.
      const isLineRef = /^L\d+(?:-L?\d+)?$/i.test(fragment)

      // In-file anchor (target is just "#frag"): validate against THIS file.
      if (filePart === '') {
        if (fragment === '' || isLineRef) continue
        if (!anchorsFor(abs).has(fragment)) {
          misses.push({ file, line: i + 1, target, reason: 'anchor-missing', detail: 'in-file anchor not found' })
        }
        continue
      }

      // Resolve the file half relative to repo root (ADR-0021).
      const targetAbs = resolve(repoRoot, filePart)
      if (!existsSync(targetAbs)) {
        misses.push({ file, line: i + 1, target, reason: 'file-missing', detail: `no file at repo-root/${filePart}` })
        continue
      }
      // Anchor check only for files (a dir target with a fragment is unusual; skip).
      if (fragment !== '' && !isLineRef && statSync(targetAbs).isFile()) {
        if (!anchorsFor(targetAbs).has(fragment)) {
          misses.push({ file, line: i + 1, target, reason: 'anchor-missing', detail: `#${fragment} not in ${filePart}` })
        }
      }
    }
  }
  return misses
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

const REASON_LABEL: Record<Reason, string> = {
  'file-missing': 'file missing (root-relative)',
  'anchor-missing': 'dead #anchor',
  'docs-unregistered': 'unregistered docs:// Resource',
}

function printGroup(title: string, misses: Miss[], full: boolean): void {
  console.log(`\n${title} — ${misses.length} miss(es)`)
  if (misses.length === 0) return
  const byReason: Record<string, number> = {}
  for (const x of misses) byReason[x.reason] = (byReason[x.reason] ?? 0) + 1
  console.log(`  ${Object.entries(byReason).map(([r, n]) => `${REASON_LABEL[r as Reason]}: ${n}`).join(' · ')}`)
  const limit = full ? misses.length : Math.min(misses.length, 40)
  for (const x of misses.slice(0, limit)) {
    console.log(`  ${x.file}:${x.line}  →  ${x.target}  [${REASON_LABEL[x.reason]}]`)
  }
  if (limit < misses.length) console.log(`  … and ${misses.length - limit} more (run with --all).`)
}

function main(): void {
  const full = process.argv.includes('--all')
  const docsUris = buildDocsUriSet()

  const files: string[] = []
  walkMd('.', files)
  files.sort()

  const live: Miss[] = []
  const archive: Miss[] = []
  for (const f of files) {
    for (const miss of checkFile(f, docsUris)) {
      ;(isArchive(f) ? archive : live).push(miss)
    }
  }

  printGroup('LIVE substrate (gating)', live, full)
  printGroup('ARCHIVE layer (warnings, non-gating)', archive, full)

  console.log('')
  console.log(
    `check-doc-links: scanned ${files.length} markdown files · ${live.length} live miss(es) · ${archive.length} archive warning(s).`,
  )
  if (live.length === 0) {
    console.log('check-doc-links: no live-substrate dead links. ✅')
    process.exit(0)
  }
  console.error(
    `\ncheck-doc-links: ${live.length} live-substrate dead link(s) — repoint to the migrated target, or drop the fragment.`,
  )
  console.error('Convention is root-relative (ADR-0021); a `../../` link from a doc is a violation, not a typo.')
  process.exit(1)
}

main()
