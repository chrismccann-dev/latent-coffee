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

const PROMPT_FILES = [
  'start-brew',
  'log-brew',
  'propose-doc-changes-from-brew',
  'bundled-brewing-completion',
  'new-bean-intake',
  'in-process-bean-incremental-sync',
  'closed-bean-full-fill',
] as const

const DOC_FILES: Record<string, string> = {
  'docs://brewing.md': 'BREWING.md',
  'docs://brewing/roasters.md': 'docs/brewing/roasters.md',
  'docs://brewing/wbc-reference.md': 'docs/brewing/wbc-reference.md',
  'docs://brewing/wbc-recipes.md': 'docs/brewing/wbc-recipes.md',
  'docs://roasting.md': 'ROASTING.md',
  'docs://roasting/archive.md': 'docs/roasting/archive.md',
  'docs://roasting/wbc-roasting.md': 'docs/roasting/wbc-roasting.md',
  'docs://roasting/wbc-sourcing.md': 'docs/roasting/wbc-sourcing.md',
  ...Object.fromEntries(
    TAXONOMY_AXES.map((axis) => [`docs://taxonomies/${axis}.md`, `docs/taxonomies/${axis}.md`]),
  ),
  ...Object.fromEntries(
    PROMPT_FILES.map((name) => [`docs://prompts/${name}.md`, `docs/prompts/${name}.md`]),
  ),
}

// Per-doc descriptions used in listDocs() catalog so claude.ai can route to the
// right doc without fetching first. New rule when adding a doc here: also write
// a one-sentence "use when..." description below. Without descriptions, claude.ai
// has only the title to go on (titles are short and mechanical).
const DOC_DESCRIPTIONS: Record<string, string> = {
  'docs://brewing.md':
    'Use when planning a new brew recipe — contains the 6-strategy + 3-modifier Two-Axis framework, Step 1d Coffee Brief structure, equipment reference, and archive patterns by strategy/modifier/process/variety.',
  'docs://brewing/roasters.md':
    'Use when working with a specific roaster — per-roaster brewing lessons + house-style cards (e.g. Hydrangea El Paraíso thermal-shock guidance, Sey extraction expectations). Reference for roaster-anchored brew design.',
  'docs://brewing/wbc-reference.md':
    'Use when looking up WBC competition technique categories — 5 foundational control axes + 8 strategy families mapped onto the Latent framework. Lean reference layer.',
  'docs://brewing/wbc-recipes.md':
    'Use when looking up specific competitor recipes from World Brewers Cup 2022-2025 — 102-recipe archive with subtype definitions. Reference material for the "experiment Chris wouldn\'t think of" goal.',
  'docs://roasting.md':
    'Use when planning a roast on the Roest L200 Ultra (counterflow mode) — covers the New Coffee Onboarding Protocol (Steps 1-4), Standard Workflow, evaluation protocol (Day 7 pourover gate), fan/inlet curve templates, FC marking protocol, and per-coffee + cross-coffee insight layers.',
  'docs://roasting/archive.md':
    'Use when researching closed-lot roasting outcomes — per-lot Key Learnings, reference roast parameters, and structural takeaways from completed beans. Read before roasting a similar coffee.',
  'docs://roasting/wbc-roasting.md':
    'Use when scoping a roast experiment or designing a V1 profile — WBC-derived lessons, Roest L200 hypotheses, blending experiment protocols, and structured rest-curve protocol. Ideas / hypotheses doc, not a recipe lookup.',
  'docs://roasting/wbc-sourcing.md':
    'Use when evaluating a green offer or rebalancing inventory — WBC-derived sourcing strategy across producers / origins / varieties / processes / elevation, Tier 1/2/3 priority targets, and current Latent inventory mapped to portfolio lanes (snapshot 2026-05-09).',
  'docs://taxonomies/regions.md':
    'Use when validating or looking up a country/macro_terroir for a green bean or brew. 121 canonical macros across 38 countries; meso/locality stays free-text.',
  'docs://taxonomies/varieties.md':
    'Use when validating or looking up a cultivar — 63 canonical cultivars across 5 Arabica genetic families + 3 non-Arabica species. Aliases (e.g. "Geisha" → "Gesha") resolve at canonicalize time.',
  'docs://taxonomies/processes.md':
    'Use when decomposing a process into the composable taxonomy — 4 bases (Washed/Honey/Natural/Wet-hulled) + Honey color subprocesses + 4 modifier axes (fermentation/drying/intervention/experimental) + decaf + signature methods.',
  'docs://taxonomies/roasters.md':
    'Use when validating or looking up a roaster — 70 canonical roasters across 6 strategy families (Clarity-First / Balanced / Extraction-Forward / System / Varies / Self-Roasted). Includes BMR house-style cards.',
  'docs://taxonomies/producers.md':
    'Use when validating or looking up a producer — 120 canonical producers across 6 producer systems. Tier-scoped (60-70% comprehensive); allowOverride pattern for net-new entries.',
  'docs://taxonomies/brewers.md':
    'Use when validating or looking up a brewer — 46 canonical brewers (12 owned by Chris). Material axis dropped (model name only). allowOverride pattern.',
  'docs://taxonomies/filters.md':
    'Use when validating or looking up a filter — 64 canonical filters (22 owned), pairs with brewer registry. allowOverride pattern.',
  'docs://taxonomies/flavors.md':
    'Use when validating flavor notes or structure tags — 3-axis composable: 181 base flavors across 12 categories + 43 modifiers + 29 structure descriptors across 7 axes. Tea-base reversal rule for "Peach Tea" type chips.',
  'docs://taxonomies/grinders.md':
    'Use when validating grinder + grind setting — currently single canonical (EG-1) with 51 enumerated valid settings (3.0-8.0 in 0.1 steps).',
  'docs://taxonomies/roast-levels.md':
    'Use when validating roast level — 8 Agtron-anchored canonical buckets (Extremely Light → Very Dark, 10-unit ranges) + marketing-tag aliases.',
  'docs://prompts/start-brew.md':
    'Operational prompt for starting a new brew session in claude.ai — fetches BREWING.md and runs the Coffee Brief through Step 1d strategy confirmation.',
  'docs://prompts/log-brew.md':
    'Operational prompt for logging a finished brew via push_brew — short, no-confirmation submission with canonical-validation discipline.',
  'docs://prompts/propose-doc-changes-from-brew.md':
    'Operational prompt for proposing BREWING.md / roaster card / taxonomy edits after a brew session via propose_doc_changes.',
  'docs://prompts/bundled-brewing-completion.md':
    'Operational prompt combining log-brew + propose-doc-changes in one shot. Use for a finished PURCHASED brew. (Self-roasted brews flow through closed-bean-full-fill.md STAGE 7.)',
  'docs://prompts/new-bean-intake.md':
    'Operational prompt for green bean intake + V1 profile design — runs ROASTING.md New Coffee Onboarding Protocol Steps 1-4, pushes green_bean + inventory + 3 roast profiles to Roest.',
  'docs://prompts/in-process-bean-incremental-sync.md':
    'Operational prompt for mid-iteration roast sync — push roasts/cuppings/experiments since last sync, optionally design forward (V2/V3), propose ROASTING.md Active Lots updates.',
  'docs://prompts/closed-bean-full-fill.md':
    'Operational prompt for lot close-out — push every layer (green_bean / roasts / cuppings / experiments / roast_learnings / SR reference brew) + propose ROASTING.md close-out narrative + archive Roest inventory.',
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

export function listDocs(): {
  uri: string
  name: string
  title: string
  mimeType: string
  description: string
}[] {
  const entry = (uri: string, name: string, title: string) => ({
    uri,
    name,
    title,
    mimeType: 'text/markdown',
    description: DOC_DESCRIPTIONS[uri] ?? '',
  })

  return [
    entry('docs://brewing.md', 'docs/brewing.md', 'Brewing Master Reference'),
    entry('docs://brewing/roasters.md', 'docs/brewing/roasters.md', 'Roaster Brewing Lessons'),
    entry('docs://brewing/wbc-reference.md', 'docs/brewing/wbc-reference.md', 'WBC Reference (Latent mapping)'),
    entry('docs://brewing/wbc-recipes.md', 'docs/brewing/wbc-recipes.md', 'WBC 102-Recipe Archive (2022-2025)'),
    entry('docs://roasting.md', 'docs/roasting.md', 'Roasting Master Reference'),
    entry('docs://roasting/archive.md', 'docs/roasting/archive.md', 'Roasting Closed-Lot Archive'),
    entry('docs://roasting/wbc-roasting.md', 'docs/roasting/wbc-roasting.md', 'WBC Roasting (lessons + open ideas)'),
    entry('docs://roasting/wbc-sourcing.md', 'docs/roasting/wbc-sourcing.md', 'WBC Sourcing Strategy (Latent)'),
    ...TAXONOMY_AXES.map((axis) =>
      entry(`docs://taxonomies/${axis}.md`, `docs/taxonomies/${axis}.md`, `Taxonomy: ${axis}`),
    ),
    ...PROMPT_FILES.map((name) =>
      entry(`docs://prompts/${name}.md`, `docs/prompts/${name}.md`, `Prompt: ${name}`),
    ),
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
