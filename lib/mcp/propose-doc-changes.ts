import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { ROASTER_LOOKUP } from '@/lib/roaster-registry'
import {
  isKnownDoc,
  listDocSections,
  listTaxonomyAxes,
  readDocSection,
  type TaxonomyAxis,
} from '@/lib/mcp/docs'
import type { McpAuthContext } from '@/lib/mcp/auth'
import { withToolErrorLogging } from '@/lib/mcp/tool-wrapper'

// Cheap fuzzy-match for anchor "did you mean" hints (#R50). Returns the
// best candidate from the doc's sections list when the supplied anchor
// doesn't resolve. Score = lowercase substring containment first, then
// Levenshtein distance below a threshold relative to the input length.
// Returns null when no candidate is good enough (avoids noisy hints on
// totally-unrelated input).
function levenshtein(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length
  const prev = new Array<number>(b.length + 1)
  const curr = new Array<number>(b.length + 1)
  for (let j = 0; j <= b.length; j++) prev[j] = j
  for (let i = 1; i <= a.length; i++) {
    curr[0] = i
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost)
    }
    for (let j = 0; j <= b.length; j++) prev[j] = curr[j]
  }
  return prev[b.length]
}

function findClosestAnchor(target: string, candidates: string[]): string | null {
  if (!candidates.length) return null
  const lower = target.toLowerCase()
  // First pass: substring-contains either direction.
  const containers = candidates.filter((c) => {
    const cl = c.toLowerCase()
    return cl.includes(lower) || lower.includes(cl)
  })
  if (containers.length === 1) return containers[0]
  if (containers.length > 1) {
    // Pick the shortest container; it's typically the most specific match.
    return containers.sort((a, b) => a.length - b.length)[0]
  }
  // Second pass: Levenshtein. Threshold = 40% of the longer string's length,
  // floor 3, cap 10. Conservative — avoids surfacing nonsense for typos
  // that are too far off.
  let best: { name: string; dist: number } | null = null
  for (const c of candidates) {
    const dist = levenshtein(lower, c.toLowerCase())
    const threshold = Math.max(3, Math.min(10, Math.floor(Math.max(c.length, target.length) * 0.4)))
    if (dist <= threshold && (!best || dist < best.dist)) {
      best = { name: c, dist }
    }
  }
  return best?.name ?? null
}

// propose_doc_changes — the polymorphic prose-edit Tool.
//
// Per SYNC_V2.md § "Asymmetric write trust": canonical-validated entities
// (brews via push_brew) get DIRECT writes; prose docs flow through this Tool.
// Claude.ai stages a proposal; Claude Code (the arbiter) reads pending rows
// and applies them to the actual repo file in a follow-up session.
//
// target_doc allow-list (proposal-level default + per-citation override):
//   - 'brewing.md'                                — repo root BREWING.md
//   - 'roasting.md'                               — repo root ROASTING.md (file lands in 2.5; arbiter surfaces orphan in 2.4)
//   - 'roaster/{Canonical Roaster Name}'          — section in docs/brewing/roasters.md (Sprint 2.4 split)
//   - 'taxonomies/{axis}.md'                      — one of 10 canonical taxonomy MD files
//   - 'skills/{path}.md'                          — Wave 2 PR 1: composable sub-skills cluster docs (ADR-0011).
//                                                   Validated against isKnownDoc(`docs://skills/${path}.md`); only registered
//                                                   cluster paths in lib/mcp/docs.ts SKILL_FILES are accepted. Routes new
//                                                   WBC content proposals into the cluster instead of BREWING.md / ROASTING.md.
//
// Roaster names are canonicalized via ROASTER_LOOKUP.canonicalize on insert so
// 'roaster/hydrangea coffee' and 'roaster/Hydrangea Coffee' converge to the
// same target_doc value (auto-supersede then matches both).
//
// Per-citation target_doc (Sprint 2.4.1 follow-up): a single brew-debrief
// insight often spans multiple files (e.g. one finding lands a roaster card
// edit + a BREWING.md archive bullet). Citations may override the proposal-
// level target_doc on a per-citation basis. The proposal-level field stays
// as the default for citations that don't specify one. Each citation's
// EFFECTIVE target_doc is normalized + stored on the citation itself, which
// makes auto-supersede operate cleanly per (target_doc, section_anchor)
// regardless of how the proposal-level field is set.

const VALID_OPERATIONS = ['append', 'replace', 'prepend'] as const
const VALID_SOURCE_KINDS = ['brew', 'roast', 'cupping', 'session'] as const

const citation = z.object({
  section_anchor: z.string().describe(
    'Header text WITHOUT the leading `#` characters. E.g. "Equipment Reference". Anchor matching is case-sensitive exact match against `## ` or `### ` headers in the resolved file — call `list_doc_sections(uri)` to discover valid anchors before drafting. The arbiter does NOT fuzzy-match — stale anchors surface to the user with current_text + proposed_text for retarget vs discard decision.',
  ),
  line_range: z.tuple([z.number(), z.number()]).optional(),
  current_text: z.string().optional().describe(
    'For `replace` operations: REQUIRED-IF-LOAD-BEARING. Include the exact verbatim text being replaced (copy via `read_doc_section`) so the arbiter can detect drift between when you wrote the proposal and when it gets applied. **Matching is byte-for-byte exact via String.includes(); NO automatic ASCII→Unicode normalization is applied.** If the live doc contains an en-dash (`–`, U+2013), passing an ASCII hyphen (`-`, U+002D) in current_text registers as a miss in preflight.current_text_match. Common offenders to watch: en-dash `–` (U+2013) vs hyphen `-` (U+002D); em-dash `—` (U+2014) vs hyphen; curly quotes `‘` `’` `“` `”` (U+2018/2019/201C/201D) vs straight `\'` `"`; non-breaking space (U+00A0) vs regular space (U+0020); soft hyphen (U+00AD) vs nothing. Unicode normalization (NFC vs NFD) also passes through unchanged. Always copy current_text via `read_doc_section` rather than re-typing from memory — the surface area for character-level drift is bigger than it looks. For `append` / `prepend`: this field is currently IGNORED by the arbiter (positional hints are not yet wired). Omit on append/prepend ops to keep proposals lean.',
  ),
  proposed_text: z.string().describe('The text to append / prepend / replace with.'),
  operation: z.enum(VALID_OPERATIONS).describe(
    '`replace` — substitute matching text (uses current_text for drift detection). `append` — add to the END of the named section. `prepend` — add to the START of the named section. Note: append/prepend currently land at section boundaries; mid-section positioning relative to specific bullets is not yet supported.',
  ),
  rationale: z.string().describe('Free-text justification — surfaced to the arbiter at apply time.'),
  target_doc: z.string().optional().describe(
    'OPTIONAL per-citation override of the proposal-level target_doc. Accepts the same shape as the proposal-level field: `brewing.md` | `roasting.md` | `roaster/{Canonical Roaster Name}` | `taxonomies/{axis}.md` | `skills/{path}.md`. Use when a single proposal\'s citations span multiple files (e.g. one citation targets `roaster/Dongzhe` and another targets `brewing.md`). When omitted, inherits the proposal-level target_doc.',
  ),
})

const sourceRef = z.object({
  kind: z.enum(VALID_SOURCE_KINDS).describe('What triggered the proposal. `brew` = a single completed brew; `roast` / `cupping` = roasting-side events (Sprint 2.5+); `session` = a general working-session not tied to a specific entity.'),
  id: z.string().optional().describe(
    'For `kind: brew`, set this to the brew_id returned by `push_brew`. Establishes a queryable lineage from the proposal back to the brew that triggered it (visible in the arbiter UI + DB). For `kind: roast` / `cupping`, set to the roast/cupping id once those tools land in Sprint 2.5. For `kind: session`, optional free-text id (e.g. a date stamp).',
  ),
})

export const proposeDocChangesInputSchema = {
  target_doc: z.string().describe(
    'Default doc identifier for citations that don\'t override it. Allowed values: "brewing.md" | "roasting.md" | "roaster/{Canonical Roaster Name}" | "taxonomies/{axis}.md" | "skills/{path}.md". Roaster names auto-canonicalize via ROASTER_LOOKUP; unknown roasters are rejected (add to docs/taxonomies/roasters.md first). `skills/{path}.md` routes proposals into composable sub-skill cluster docs (Wave 2 PR 1+, ADR-0011) — e.g. `skills/wbc-brewing-archivist/cluster/wbc-reference.md`; validated against the registered SKILL_FILES allow-list. For cross-doc proposals, set per-citation target_doc on each citation that diverges from this default.',
  ),
  source: sourceRef.describe('What triggered the proposal — a brew log session, a roast cupping, an end-of-coffee debrief, or a general session.'),
  citations: z.array(citation).min(1).describe(
    'One or more edits, each scoped to a section_anchor + optional per-citation target_doc. Multi-citation proposals are arbitrated per-citation; partial application is supported. Multi-target_doc proposals (where citations span multiple files) are arbitrated per (target_doc, section_anchor) group.',
  ),
  summary: z.string().describe('One-line summary the arbiter sees when triaging the queue.'),
}

type ProposeDocChangesInput = {
  target_doc: string
  source: z.infer<typeof sourceRef>
  citations: z.infer<typeof citation>[]
  summary: string
}

export type CitationPreflight = {
  target_doc: string
  section_anchor: string
  operation: (typeof VALID_OPERATIONS)[number]
  anchor_resolved: boolean
  // For replace ops: did current_text match what's actually in the live doc?
  // null = not checked (no current_text supplied, or operation isn't replace).
  current_text_match: boolean | null
  // Phase 2 (#R50). Populated only when anchor_resolved is false AND a fuzzy
  // candidate scored above threshold. Saves one round-trip vs. having the
  // caller list_doc_sections + manually pick. null = anchor resolved cleanly,
  // or no good candidate exists.
  closest_match: string | null
}

export type ProposeDocChangesResult =
  | {
      ok: true
      proposal_id: string
      superseded_ids: string[]
      summary: string
      target_doc: string
      citation_count: number
      preflight: CitationPreflight[]
    }
  | { ok: false; error: string }

// Map a normalized target_doc back to its docs:// URI for live-doc reads
// (used by the per-citation preflight).
//
// For roaster/{name}, the URI always resolves to docs://brewing/roasters.md
// (the post-Sprint-2.4 split location); the section_anchor on the citation
// is the canonical roaster name verbatim. Sprint 2.5 added roasting.md as
// a real served doc; the prior "return null" stub silently set
// anchor_resolved: false on every roasting.md proposal — fixed in this
// follow-up.
function targetDocToUri(targetDoc: string): string | null {
  if (targetDoc === 'brewing.md') return 'docs://brewing.md'
  if (targetDoc === 'roasting.md') return 'docs://roasting.md'
  if (targetDoc.startsWith('roaster/')) return 'docs://brewing/roasters.md'
  if (targetDoc.startsWith('taxonomies/')) return `docs://${targetDoc}`
  if (targetDoc.startsWith('skills/')) return `docs://${targetDoc}`
  return null
}

// Validates target_doc against the allow-list. On roaster/{name} input, the name
// is canonicalized via ROASTER_LOOKUP so the stored value is always the canonical
// form — auto-supersede then matches across drift / case variants.
function normalizeTargetDoc(
  raw: string,
): { ok: true; target_doc: string } | { ok: false; error: string } {
  const trimmed = raw.trim()
  if (trimmed === 'brewing.md' || trimmed === 'roasting.md') {
    return { ok: true, target_doc: trimmed }
  }
  const taxMatch = /^taxonomies\/([a-z][a-z-]*)\.md$/.exec(trimmed)
  if (taxMatch) {
    const axis = taxMatch[1] as TaxonomyAxis
    if (!listTaxonomyAxes().includes(axis)) {
      return {
        ok: false,
        error: `Unknown taxonomy axis: ${axis}. Valid: ${listTaxonomyAxes().join(', ')}`,
      }
    }
    return { ok: true, target_doc: trimmed }
  }
  if (trimmed.startsWith('roaster/')) {
    const rawName = trimmed.slice('roaster/'.length)
    const canonical = ROASTER_LOOKUP.canonicalize(rawName)
    if (!canonical) {
      return {
        ok: false,
        error: `Unknown roaster: '${rawName}'. Use a canonical name from docs/taxonomies/roasters.md, or add the entry to the registry first (no override path on roaster/{slug}).`,
      }
    }
    return { ok: true, target_doc: `roaster/${canonical}` }
  }
  if (trimmed.startsWith('skills/')) {
    // Wave 2 PR 1 (ADR-0011): composable sub-skill cluster docs. Validated via
    // isKnownDoc against the docs:// URI so only registered SKILL_FILES paths
    // resolve — adding a new sub-skill requires registering it in lib/mcp/docs.ts
    // first.
    const uri = `docs://${trimmed}`
    if (!isKnownDoc(uri)) {
      return {
        ok: false,
        error: `Unknown skills target: '${trimmed}'. Register the path in lib/mcp/docs.ts SKILL_FILES first, then re-attempt.`,
      }
    }
    return { ok: true, target_doc: trimmed }
  }
  return {
    ok: false,
    error: `target_doc must be 'brewing.md', 'roasting.md', 'roaster/{Canonical Name}', 'taxonomies/{axis}.md', or 'skills/{path}.md'. Got: ${raw}`,
  }
}

export async function proposeDocChanges(
  auth: McpAuthContext,
  input: ProposeDocChangesInput,
): Promise<ProposeDocChangesResult> {
  // Normalize the proposal-level default first.
  const normalizedProposal = normalizeTargetDoc(input.target_doc)
  if (!normalizedProposal.ok) return { ok: false, error: normalizedProposal.error }
  const proposalTargetDoc = normalizedProposal.target_doc

  // Resolve + normalize each citation's effective target_doc. Always write the
  // canonical form back onto the citation so auto-supersede operates cleanly
  // per (target_doc, section_anchor) regardless of whether the field was
  // explicitly set or inherited from the proposal-level default.
  const normalizedCitations: Array<z.infer<typeof citation> & { target_doc: string }> = []
  for (const c of input.citations) {
    const effectiveRaw = c.target_doc ?? input.target_doc
    const normalized = normalizeTargetDoc(effectiveRaw)
    if (!normalized.ok) {
      return {
        ok: false,
        error: `Citation "${c.section_anchor}" target_doc invalid: ${normalized.error}`,
      }
    }
    normalizedCitations.push({ ...c, target_doc: normalized.target_doc })
  }

  // Preflight each citation against the live doc (Sprint 2.4.3). Resolves
  // section_anchor existence + (for replace ops with current_text) drift
  // detection BEFORE the proposal lands in the queue. Returns the per-citation
  // status in the response so the caller can immediately retarget stale
  // anchors / re-fetch verbatim text without round-tripping through the
  // arbiter. This does NOT block insert — even citations with unresolved
  // anchors get queued so the arbiter can still surface them with full
  // context. The preflight is a SIGNAL, not a gate.
  //
  // target_doc → docs:// URI mapping: bare files map directly; roaster/{name}
  // maps to docs://brewing/roasters.md (anchor = canonical name); taxonomies/
  // {axis}.md maps directly. Anchors that don't have a docs:// mapping
  // (currently only roasting.md before Sprint 2.5 ships the file) preflight
  // to anchor_resolved: false but the proposal still queues.
  const preflight: CitationPreflight[] = []
  for (const c of normalizedCitations) {
    const docUri = targetDocToUri(c.target_doc)
    let anchorResolved = false
    let currentTextMatch: boolean | null = null
    let closestMatch: string | null = null
    if (docUri && isKnownDoc(docUri)) {
      try {
        const body = await readDocSection(docUri, c.section_anchor)
        anchorResolved = body !== null
        if (c.operation === 'replace' && c.current_text != null && body != null) {
          currentTextMatch = body.includes(c.current_text)
        }
        // Phase 2 (#R50): fuzzy "did you mean X" hint when anchor misses.
        if (!anchorResolved) {
          const anchors = await listDocSections(docUri)
          closestMatch = findClosestAnchor(c.section_anchor, anchors)
        }
      } catch (err) {
        console.error(
          `[propose_doc_changes] preflight failed for ${c.target_doc}#${c.section_anchor}:`,
          err,
        )
        // Soft-fail; let the arbiter handle it.
      }
    }
    preflight.push({
      target_doc: c.target_doc,
      section_anchor: c.section_anchor,
      operation: c.operation,
      anchor_resolved: anchorResolved,
      current_text_match: currentTextMatch,
      closest_match: closestMatch,
    })
  }

  // INSERT first so we have the new id for the supersede UPDATE's `notes`. Two
  // calls (INSERT then UPDATE) instead of a single transaction — supabase-js
  // doesn't expose Postgres transactions natively in this shape. The race window
  // is bounded: a parallel write would just supersede whichever arrives second.
  const insertRow = {
    user_id: auth.userId,
    target_doc: proposalTargetDoc,
    source: input.source,
    citations: normalizedCitations,
    summary: input.summary,
  }
  const { data: inserted, error: insertErr } = await auth.supabase
    .from('doc_proposals')
    .insert(insertRow)
    .select('id')
    .single()
  if (insertErr || !inserted) {
    return {
      ok: false,
      error: `INSERT failed: ${insertErr?.message ?? 'no row returned'}`,
    }
  }
  const newId = inserted.id as string

  // Supersede older pending proposals overlapping any of the new citations'
  // (target_doc, section_anchor) pairs. The per-citation target_doc is now
  // always set (above), so the @> match scopes by both fields cleanly. Older
  // pre-2.4.1 proposals have only proposal-level target_doc — they won't match
  // a citation-level @> filter. That's OK; pre-2.4.1 rows in the wild are rare
  // (only proposals filed via the original Tool shape, which auto-superseded
  // the same way).
  const supersededIds = new Set<string>()
  for (const c of normalizedCitations) {
    const { data: superseded, error: updErr } = await auth.supabase
      .from('doc_proposals')
      .update({
        status: 'superseded',
        notes: `Superseded by ${newId} on ${new Date().toISOString()}`,
      })
      .eq('user_id', auth.userId)
      .eq('status', 'pending')
      .neq('id', newId)
      .contains('citations', [{ target_doc: c.target_doc, section_anchor: c.section_anchor }])
      .select('id')
    if (updErr) {
      console.error(
        `[propose_doc_changes] supersede UPDATE failed for ${c.target_doc}#${c.section_anchor}:`,
        updErr,
      )
      continue
    }
    if (superseded) {
      for (const row of superseded) supersededIds.add(row.id as string)
    }
  }

  return {
    ok: true,
    proposal_id: newId,
    superseded_ids: Array.from(supersededIds),
    summary: input.summary,
    target_doc: proposalTargetDoc,
    citation_count: normalizedCitations.length,
    preflight,
  }
}

export function registerProposeDocChangesTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'propose_doc_changes',
    {
      title: 'Propose Doc Changes',
      description:
        'Propose / submit / save / log / archive a prose change to a brewing or roasting doc - the primary write path for living-reference markdown. EVERY citation requires section_anchor + operation + proposed_text + rationale (all four are required; the schema rejects missing fields). Claude.ai writes a proposal; Claude Code arbitrates and applies asynchronously. WORKFLOW: before drafting, call `read_doc_section(uri, anchor)` to fetch the live target so `current_text` (for replace ops) is verbatim from what\'s actually in the doc - project-uploaded copies often drift behind live, especially for fields with pending-but-unapplied edits. **current_text matching is byte-for-byte; NO ASCII→Unicode normalization is applied** (see current_text field description for the common offenders — en-dashes, curly quotes, NBSP, NFC vs NFD). Each citation targets a section_anchor (header text without `#` prefix; case-sensitive exact match against `## ` / `### ` headers). Citations may optionally override the proposal-level target_doc to span multiple files in one proposal - the brew-debrief shape (one insight, multiple files) is supported natively. Multi-citation + multi-target_doc proposals are arbitrated per (target_doc, section_anchor) group; partial application is supported. Auto-supersedes older pending proposals overlapping the same per-citation (target_doc, section_anchor). Returns { proposal_id, status: "pending", superseded_ids[], summary, target_doc, citation_count, preflight[] } where each preflight entry echoes { target_doc, section_anchor, operation, anchor_resolved, current_text_match, closest_match? } so stale anchors / drifted current_text surface immediately, not at arbiter time.',
      inputSchema: proposeDocChangesInputSchema,
    },
    withToolErrorLogging('propose_doc_changes', async (input) => {
      const result = await proposeDocChanges(auth, input as ProposeDocChangesInput)
      if (!result.ok) {
        throw new Error(`Proposal failed: ${result.error}`)
      }
      const responsePayload = {
        proposal_id: result.proposal_id,
        status: 'pending' as const,
        superseded_ids: result.superseded_ids,
        summary: result.summary,
        target_doc: result.target_doc,
        citation_count: result.citation_count,
        preflight: result.preflight,
      }
      return {
        content: [{ type: 'text', text: JSON.stringify(responsePayload) }],
        structuredContent: responsePayload,
      }
    }),
  )
}
