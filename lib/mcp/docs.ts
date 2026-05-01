import { readFile } from 'fs/promises'
import path from 'path'

// Doc URI -> repo-relative file path. Multi-doc support added Sprint 2.4 alongside
// the section-anchor parser for `propose_doc_changes`. The 10 taxonomy MD files are
// surfaced so claude.ai's "Coffee Brewing" project no longer has to paste-and-drift.
const TAXONOMY_AXES = [
  'regions',
  'varieties',
  'processes',
  'roasters',
  'producers',
  'brewers',
  'filters',
  'flavors',
  'grinders',
  'roast-levels',
] as const

export type TaxonomyAxis = (typeof TAXONOMY_AXES)[number]

const DOC_FILES: Record<string, string> = {
  'docs://brewing.md': 'BREWING.md',
  'docs://roasting.md': 'ROASTING.md',
  'docs://brewing/roasters.md': 'docs/brewing/roasters.md',
  ...Object.fromEntries(
    TAXONOMY_AXES.map((axis) => [`docs://taxonomies/${axis}.md`, `docs/taxonomies/${axis}.md`]),
  ),
}

export type Section = {
  anchor: string
  level: number
  body: string
}

type CacheEntry = {
  text: string
  sections: Map<string, Section>
}

// Vercel serverless filesystem is read-only and per-deploy immutable, so doc
// content + parsed sections are invariant across the lifetime of one warm
// container. Cache after first read; deploys reset the container which reloads
// on next call.
const DOC_CACHE = new Map<string, CacheEntry>()

export function isKnownDoc(uri: string): boolean {
  return uri in DOC_FILES
}

export function listDocs(): { uri: string; name: string; title: string; mimeType: string }[] {
  return [
    {
      uri: 'docs://brewing.md',
      name: 'docs/brewing.md',
      title: 'Brewing Master Reference',
      mimeType: 'text/markdown',
    },
    {
      uri: 'docs://roasting.md',
      name: 'docs/roasting.md',
      title: 'Roasting Master Reference',
      mimeType: 'text/markdown',
    },
    {
      uri: 'docs://brewing/roasters.md',
      name: 'docs/brewing/roasters.md',
      title: 'Roaster Brewing Lessons',
      mimeType: 'text/markdown',
    },
    ...TAXONOMY_AXES.map((axis) => ({
      uri: `docs://taxonomies/${axis}.md`,
      name: `docs/taxonomies/${axis}.md`,
      title: `Taxonomy: ${axis}`,
      mimeType: 'text/markdown',
    })),
  ]
}

export function listTaxonomyAxes(): readonly TaxonomyAxis[] {
  return TAXONOMY_AXES
}

// Parse a markdown document into a section map keyed by header anchor text.
// A section's body extends from the line after its header to the line before the
// next header of EQUAL OR HIGHER level (lower numeric value). Header text is
// matched verbatim (case-sensitive); duplicates resolve to the first occurrence.
export function parseSections(text: string): Map<string, Section> {
  const lines = text.split('\n')
  const sections = new Map<string, Section>()
  // Pass 1: collect headers with their positions + levels.
  type Header = { anchor: string; level: number; line: number }
  const headers: Header[] = []
  for (let i = 0; i < lines.length; i++) {
    const match = /^(#{1,6})\s+(.+?)\s*$/.exec(lines[i])
    if (!match) continue
    headers.push({ level: match[1].length, anchor: match[2], line: i })
  }
  // Pass 2: body for each header runs up to the next header of equal or higher level.
  for (let i = 0; i < headers.length; i++) {
    const { anchor, level, line } = headers[i]
    if (sections.has(anchor)) continue // first occurrence wins on duplicates
    let endLine = lines.length
    for (let j = i + 1; j < headers.length; j++) {
      if (headers[j].level <= level) {
        endLine = headers[j].line
        break
      }
    }
    const body = lines.slice(line + 1, endLine).join('\n').trim()
    sections.set(anchor, { anchor, level, body })
  }
  return sections
}

async function loadDoc(uri: string): Promise<CacheEntry> {
  const cached = DOC_CACHE.get(uri)
  if (cached !== undefined) return cached
  const filename = DOC_FILES[uri]
  if (!filename) throw new Error(`Unknown doc URI: ${uri}`)
  const text = await readFile(path.join(process.cwd(), filename), 'utf-8')
  const entry: CacheEntry = { text, sections: parseSections(text) }
  DOC_CACHE.set(uri, entry)
  return entry
}

export async function readDoc(uri: string): Promise<string> {
  const { text } = await loadDoc(uri)
  return text
}

// Returns the body text of the named section, or null if the anchor isn't found.
// Used by the section-anchor MCP Resource (e.g. docs://brewing.md#Equipment Reference)
// and by the arbiter when resolving propose_doc_changes citations.
export async function readDocSection(uri: string, anchor: string): Promise<string | null> {
  const { sections } = await loadDoc(uri)
  const section = sections.get(anchor)
  return section ? section.body : null
}

// Lists every header anchor in the doc (useful for the arbiter when surfacing
// orphaned proposals — show Chris the actual section list so he can retarget).
export async function listDocSections(uri: string): Promise<string[]> {
  const { sections } = await loadDoc(uri)
  return Array.from(sections.keys())
}
