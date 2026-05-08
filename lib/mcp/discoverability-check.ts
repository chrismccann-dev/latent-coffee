// Tool description discoverability guard (MCP feedback batch 4, 2026-05-01).
//
// claude.ai's MCP client lazy-loads tools via `tool_search`. Tools whose first
// sentence buries the user-action verb (e.g. starts with "Inserts a..." /
// "UPSERTs a..." / "Fetches a...") don't surface for searches phrased in user
// vocabulary ("log brew", "save roast", "find canonical name"). PR #71 #P1
// fixed push_brew this way; Sprint 2.5 shipped 7 new roasting Tools that
// regressed into the same anti-pattern, blocking the Sudan Rume Hybrid Washed
// dog-food (Stages 1-6 unrunnable).
//
// This module enforces the post-#71 pattern: every Tool's first sentence must
// contain >= 2 user-vocabulary action synonyms. Catches the regression class
// at module-init in dev (via lib/mcp/server.ts) and on demand via
// `npm run check:mcp` (scripts/check-mcp-tools.ts).
//
// ────────────────────────────────────────────────────────────────────────────
// DESCRIPTION CONVENTION (post-#114 audit, 2026-05-08)
//
// Every Tool description should hit three things, in this order:
//
//   1. Verb cluster + entity (the discoverability sentence — needs >= 2 of
//      the ACTION_SYNONYMS below to surface in claude.ai's tool_search).
//      Example: "Log / save / record / push a brew row to the app — ..."
//
//   2. WHEN to use it. Trigger context, sibling Tool relationships, the
//      workflow stage this slots into. Example: "Use after push_roast for
//      each batch you cup", "Sibling of push_brew (for new rows) — use this
//      when you need to backfill a missing field on an existing brew".
//
//   3. PAYLOAD highlights. UPSERT semantics, FK requirements, validation
//      behavior, override flags, units. Don't restate every Zod field
//      description — call out the non-obvious shape constraints.
//
//   4. RETURNS shape. Always explicit, last sentence, of the form
//      "Returns { field1, field2: type, ... }". Lets claude.ai chain Tool
//      calls without having to fetch a sample response first.
//
// The goal: a model reading just the description should be able to (a) decide
// whether to call this Tool vs. a sibling, (b) draft the input without a
// schema fetch, and (c) know what shape to destructure from the response.
// ────────────────────────────────────────────────────────────────────────────

const ACTION_SYNONYMS = [
  // Write verbs
  'log',
  'save',
  'submit',
  'archive',
  'record',
  'push',
  'add',
  'create',
  'register',
  'update',
  // Read / pull verbs
  'read',
  'get',
  'fetch',
  'pull',
  'load',
  'import',
  'sync',
  // Discovery verbs
  'list',
  'lookup',
  'look up',
  'find',
  'search',
  'browse',
  'enumerate',
  'discover',
  'validate',
  'check',
  // Doc-specific (proposal flow)
  'propose',
] as const

const MIN_SYNONYMS = 2

export interface ToolDescriptor {
  name: string
  description: string
}

export interface DiscoverabilityFailure {
  name: string
  firstSentence: string
  matchedSynonyms: string[]
}

function firstSentence(description: string): string {
  // Split on sentence-terminating punctuation. Em-dash also acts as a clause
  // break in the post-#71 pattern (e.g. "Log / save a brew - the primary..."),
  // so include hyphen-with-spaces. Take the first chunk only.
  const head = description.split(/[.!?]|\s-\s/)[0]
  return (head ?? '').trim()
}

function matchSynonyms(text: string): string[] {
  const lower = text.toLowerCase()
  return ACTION_SYNONYMS.filter((syn) => {
    // Word-boundary match so "list" doesn't match "blistering". Multi-word
    // synonyms ("look up") allow flexible whitespace.
    const pattern = syn.replace(/ /g, '\\s+')
    const re = new RegExp(`\\b${pattern}\\b`, 'i')
    return re.test(lower)
  })
}

export function checkToolDiscoverability(
  tools: ReadonlyArray<ToolDescriptor>,
): DiscoverabilityFailure[] {
  const failures: DiscoverabilityFailure[] = []
  for (const tool of tools) {
    const sentence = firstSentence(tool.description)
    const matched = matchSynonyms(sentence)
    if (matched.length < MIN_SYNONYMS) {
      failures.push({
        name: tool.name,
        firstSentence: sentence,
        matchedSynonyms: matched,
      })
    }
  }
  return failures
}

export function formatDiscoverabilityFailures(
  failures: ReadonlyArray<DiscoverabilityFailure>,
): string {
  const lines = failures.map(
    (f) =>
      `  - ${f.name}: only ${f.matchedSynonyms.length} action synonym match (${
        f.matchedSynonyms.join(', ') || 'none'
      })\n      first sentence: "${f.firstSentence}"`,
  )
  return [
    `MCP tool discoverability check failed for ${failures.length} tool(s).`,
    `claude.ai's tool_search needs >= ${MIN_SYNONYMS} user-vocabulary verbs in the`,
    `first sentence to surface a tool reliably. Pattern (post-PR #71): start with`,
    `a 4-6 verb cluster like "Log / save / push / record a brew..." before the`,
    `implementation detail. Action synonym list:`,
    `  ${ACTION_SYNONYMS.join(', ')}`,
    '',
    'Failures:',
    ...lines,
  ].join('\n')
}

export function assertToolDiscoverability(
  tools: ReadonlyArray<ToolDescriptor>,
): void {
  const failures = checkToolDiscoverability(tools)
  if (failures.length > 0) {
    throw new Error(formatDiscoverabilityFailures(failures))
  }
}

// Exposed for tests + the standalone scripts/check-mcp-tools.ts script.
export { ACTION_SYNONYMS, MIN_SYNONYMS }
