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
  'sworks',
] as const

export type TaxonomyAxis = (typeof TAXONOMY_AXES)[number]

const PROMPT_FILES = [
  // Brewing-side prompts (4)
  'start-brew',
  'log-brew',
  'propose-doc-changes-from-brew',
  'bundled-brewing-completion',
  // Roasting-side prompts (4) - V-set lifecycle (2026-05-14 rewrite)
  'start-lot',
  'log-roast',
  'log-cupping',
  'close-lot',
  // Roasting-side prompts (2) - one-shot lifecycle (2026-05-15 sprint)
  'one-shot',
  'one-shot-closeout',
] as const

const DOC_FILES: Record<string, string> = {
  'docs://context.md': 'CONTEXT.md',
  'docs://brewing.md': 'BREWING.md',
  'docs://brewing/roasters.md': 'docs/brewing/roasters.md',
  'docs://brewing/wbc-reference.md': 'docs/brewing/wbc-reference.md',
  'docs://brewing/wbc-recipes.md': 'docs/brewing/wbc-recipes.md',
  'docs://roasting.md': 'ROASTING.md',
  'docs://roasting/archive.md': 'docs/roasting/archive.md',
  'docs://roasting/wbc-roasting.md': 'docs/roasting/wbc-roasting.md',
  'docs://roasting/wbc-sourcing.md': 'docs/roasting/wbc-sourcing.md',
  'docs://roasting/redesign.md': 'docs/roasting/redesign.md',
  'docs://roasting/dongzhe-livestream-2026-05.md': 'docs/roasting/dongzhe-livestream-2026-05.md',
  'docs://features/importer-exporter-scoping.md': 'docs/features/importer-exporter-scoping.md',
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
  'docs://context.md':
    'Use when validating or looking up the meaning of any Latent-specific term — strict glossary across six clusters. Roasting workflow (V-set, batch slot, experiment frame, variable / lever / non-factor, roast→cup trace, taste-for, reference roast / reference cup / optimized brew, xBloom, control experiment, 3-axis Roast Character with primary lever / acceptable roast window / brewing tolerance, 4-state lifecycle, lot-close synthesis, forward design). Brewing workflow (Coffee Brief, Two-Axis Framework, extraction strategy, modifier, Named Consideration, WBC corpus check, Cooling-Curve Target, signal arbitration with variety / process / roaster signals, Strategy zone, Wrong-zone trap, Iteration loop, Iteration budget, Diminishing returns, Strategy pivot, Brewer rotation discipline, Hybrid sub-form, signature method). MCP / Sync Architecture (Latent MCP server, Tool vs Resource, dual-surface pattern, MCP-only input principle, role separation across claude.ai / Claude Code / Latent / Chris, asymmetric write trust, propose-then-apply, arbiter procedure). Canonical Registries (alias / override / lookup factory / find-or-create / canonical promotion). WBC Reference Materials (5-axis foundational map, 8 strategy families, Cross-cutting control patterns, Consciously-not-pursuing, full-map workflow accessibility). Synthesis Pipeline (entity-directed adapters, humanizer pass, aggregation eligibility). No implementation details; grown via /grill-with-docs sessions. Read this first before authoring any prose into Latent so terminology stays consistent.',
  'docs://brewing.md':
    'Use when planning a new brew recipe — contains the 6-strategy + 3-modifier Two-Axis framework, Step 1d Coffee Brief structure, equipment reference, and Cross-Coffee Insight Layer organized by strategy/modifier/process/variety.',
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
  'docs://roasting/redesign.md':
    'Use when implementing or extending the roasting-side data model / pages — series-level scope doc for the 7-sub-sprint roasting rebuild (Sub Pages 6.1-6.7, scoped + shipped 2026-05-13). Covers the lifecycle states, the new roast_recipes entity, the 16 cross-batch fields on experiments, MCP-only writes (deprecating /add for roasting), and the 4-page-shape index + waiting-for-roast + waiting-for-cupping + resolved layout. Read end-to-end before working on roasting pages or MCP Tool surface.',
  'docs://roasting/dongzhe-livestream-2026-05.md':
    'Use when scoping a new green-bean intake or anchor profile — long-form extraction of peer roaster Dongzhe\'s operational decision tree, captured 2026-05-17 from a Yunnan-Hatchi livestream on the same Roest L200 Ultra in counterflow mode as Chris. Provenance anchor for the green-physics-first framing (moisture/density picks the energy envelope, process picks stretch-vs-compress), the momentum-into-FC > weight-loss principle, the honey-process fork (washed-direction vs natural-direction), and the low-moisture / high-moisture energy adjustment rules. Holds the five operational deltas folded back into ROASTING.md + caveats (single-batch methodology, darker cup target, specific numbers don\'t transfer). Tier 2 reference signal - directional principles transfer, his specific numbers do not.',
  'docs://features/importer-exporter-scoping.md':
    'Use when discussing or scoping any future axis for coffee importers and exporters (currently unmodeled — `brews.producer` is the only supply-chain attribution today). Records the Sprint T3 / CR-3 scoping decision (Option C — unmodeled, deferred) + the four forward triggers that would re-open the question + concrete pain from the Nordic Approach alias drift that the override queue now catches. Read before authoring any importer-axis proposal so the prior decision and its reasons stay visible.',
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
  'docs://taxonomies/sworks.md':
    'Use when authoring a SWORKS Bottomless Dripper recipe or interpreting a SWORKS valve-dial sequence in archive prose — single owned instrument; self-only canonical sub-taxonomy. Per-dial state names (Closed / Restricted / Half-Open / Open + Dead Zone 1-4 + Maximum Flow past-7) + per-dial flow rate calibration (Dial 5 ~60 sec/100g · Dial 6 ~45 sec/100g · Dial 7 ~30 sec/100g at EG-1 6.0 + xBloom Premium Paper). Includes adjustment logic (valve-first; grind secondary) + 5 canonical recipe patterns (slow/slow/open Sequential Hybrid · fast/fast/slow Phase-Mapped · Half-Open throughout Suppression · Restricted-then-Half-Open transition · Restricted-main-Half-Open-finish Sequential).',
  'docs://prompts/start-brew.md':
    'Operational prompt for starting a new brew session in claude.ai — fetches BREWING.md and runs the Coffee Brief through Step 1d strategy confirmation.',
  'docs://prompts/log-brew.md':
    'Operational prompt for logging a finished brew via push_brew — short, no-confirmation submission with canonical-validation discipline.',
  'docs://prompts/propose-doc-changes-from-brew.md':
    'Operational prompt for proposing BREWING.md / roaster card / taxonomy edits after a brew session via propose_doc_changes.',
  'docs://prompts/bundled-brewing-completion.md':
    'Operational prompt combining log-brew + propose-doc-changes in one shot. Use for a finished PURCHASED brew. (Self-roasted brews flow through close-lot.md STAGE 4.)',
  'docs://prompts/start-lot.md':
    'Operational prompt for starting a green-bean lot (V1 design at intake, or any later V-set design re-entered via log-cupping.md routing). Triggers state In inventory → Waiting for next roast. Pushes green_bean + inventory + V1 experiment frame + roast_recipes (design intent) + push_roast_profile to Roest. V1 (and often V2) is wide-variance multi-variable exploratory per CONTEXT.md.',
  'docs://prompts/log-roast.md':
    'Operational prompt for recording V_n roast actuals after Chris roasted at the machine. Triggers state Waiting for next roast → Waiting for next cupping. Pulls Roest logs, push_roast × N (linked to recipe_id), patches experiment with batch_ids + observed_outcome_* + delta_from_roast_* + updated_cup_prediction_* + taste_for_*. Preps the Day 7 cupping table.',
  'docs://prompts/log-cupping.md':
    'Operational prompt for the Day 7 cupping update + adjustment move. Triggers state Waiting for next cupping → Waiting for next roast (loop continues, V_(n+1) designed) OR Resolved-pending (lot ready for close-out). Pushes cuppings, patches experiment with delta_from_cup_* + leading slot (V-set winner) + key_insight, and either designs V_(n+1) inline (push_experiment + push_roast_recipe × N + push_roast_profile × N) or routes to close-lot.md.',
  'docs://prompts/close-lot.md':
    'Operational prompt for lot close-out. Triggers state Resolved-pending → Resolved. Marks is_reference: true on the lot-level reference roast (distinct from any V-set leading slot), pushes roast_learnings (lot-specific + carry-forward), pushes the optimized SR brew, proposes ROASTING.md close-out narrative, archives the Roest inventory row. For one-shot lots (green_beans.is_one_shot=true), use one-shot-closeout.md instead.',
  'docs://prompts/one-shot.md':
    'Operational prompt for one-shot green-bean lots (single-batch samples ~100-120g, no iteration possible — auction-lot samples, farm-direct samples, rare allocations). Covers STAGES 1-4: intake (push_green_bean with is_one_shot:true + carry-forward search across similar prior lots) + tolerance-anchored design (push_experiment with batch_ids cardinality 1, push_roast_recipe × 1, push_roast_profile × 1) + record the roast (push_roast linked to recipe_id) + record Day 7 cupping (push_cupping + verdict decision). Verdict outcomes: A (reference-quality) or B (Closed without reference). STAGE 5 close-out lives in one-shot-closeout.md. Distinct from the 4-prompt V-set lifecycle (start-lot.md / log-roast.md / log-cupping.md / close-lot.md). See CONTEXT.md "One-shot lot" + "Tolerance-anchored design" entries.',
  'docs://prompts/one-shot-closeout.md':
    'Operational prompt for one-shot lot close-out (STAGE 5 of the one-shot lifecycle, sibling of one-shot.md). Triggers state Resolved-pending → Resolved. Marks is_reference: true on the single roast (Outcome A only; Outcome B leaves it false), pushes the optimized brew via push_brew (the salvageable artifact when roast wasn\'t reference quality, with what_i_learned capturing compensation reasoning), writes the constrained roast_learnings row (schema validation rejects 7 lever-attribution fields per migration 054: primary_lever / secondary_levers / roast_window_width / elasticity / what_didnt_move_needle / underdevelopment_signal / overdevelopment_signal), proposes ROASTING.md close-out narrative (tagged as one-shot), archives Roest inventory. Carry-forward fields (cultivar_takeaway / general_takeaway / starting_hypothesis) prefixed with "Low confidence - N=1, verify on next similar lot".',
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
    entry('docs://context.md', 'docs/context.md', 'Latent Shared-Language Glossary'),
    entry('docs://brewing.md', 'docs/brewing.md', 'Brewing Master Reference'),
    entry('docs://brewing/roasters.md', 'docs/brewing/roasters.md', 'Roaster Brewing Lessons'),
    entry('docs://brewing/wbc-reference.md', 'docs/brewing/wbc-reference.md', 'WBC Reference (Latent mapping)'),
    entry('docs://brewing/wbc-recipes.md', 'docs/brewing/wbc-recipes.md', 'WBC 102-Recipe Archive (2022-2025)'),
    entry('docs://roasting.md', 'docs/roasting.md', 'Roasting Master Reference'),
    entry('docs://roasting/archive.md', 'docs/roasting/archive.md', 'Roasting Closed-Lot Archive'),
    entry('docs://roasting/wbc-roasting.md', 'docs/roasting/wbc-roasting.md', 'WBC Roasting (lessons + open ideas)'),
    entry('docs://roasting/wbc-sourcing.md', 'docs/roasting/wbc-sourcing.md', 'WBC Sourcing Strategy (Latent)'),
    entry(
      'docs://features/importer-exporter-scoping.md',
      'docs/features/importer-exporter-scoping.md',
      'Importer / Exporter Axis Scoping (Sprint T3 / CR-3)',
    ),
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
