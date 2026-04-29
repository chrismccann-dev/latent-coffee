import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { ROASTER_LOOKUP } from '@/lib/roaster-registry'
import { listTaxonomyAxes, type TaxonomyAxis } from '@/lib/mcp/docs'
import type { McpAuthContext } from '@/lib/mcp/auth'

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
    'Header text WITHOUT the leading `#` characters. E.g. "Equipment Reference". Anchor matching is case-sensitive exact match against `## ` or `### ` headers in the resolved file. The arbiter does NOT fuzzy-match — stale anchors surface to the user with current_text + proposed_text for retarget vs discard decision.',
  ),
  line_range: z.tuple([z.number(), z.number()]).optional(),
  current_text: z.string().optional().describe(
    'OPTIONAL. For `replace` operations, include the exact text being replaced — lets the arbiter detect drift if the file content has changed since you wrote the proposal. For `append` / `prepend`, omit unless you want to give the arbiter a positional hint (e.g. "after the Heritage Collection bullet").',
  ),
  proposed_text: z.string().describe('The text to append / prepend / replace with.'),
  operation: z.enum(VALID_OPERATIONS),
  rationale: z.string().describe('Free-text justification — surfaced to the arbiter at apply time.'),
  target_doc: z.string().optional().describe(
    'OPTIONAL per-citation override of the proposal-level target_doc. Use when a single proposal\'s citations span multiple files (e.g. one citation targets `roaster/Dongzhe` and another targets `brewing.md`). When omitted, inherits the proposal-level target_doc.',
  ),
})

const sourceRef = z.object({
  kind: z.enum(VALID_SOURCE_KINDS),
  id: z.string().optional(),
})

export const proposeDocChangesInputSchema = {
  target_doc: z.string().describe(
    'Default doc identifier for citations that don\'t override it. Allowed values: "brewing.md" | "roasting.md" | "roaster/{Canonical Roaster Name}" | "taxonomies/{axis}.md". Roaster names auto-canonicalize via ROASTER_LOOKUP; unknown roasters are rejected (add to docs/taxonomies/roasters.md first). For cross-doc proposals, set per-citation target_doc on each citation that diverges from this default.',
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

export type ProposeDocChangesResult =
  | { ok: true; proposal_id: string; superseded_ids: string[] }
  | { ok: false; error: string }

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
  return {
    ok: false,
    error: `target_doc must be 'brewing.md', 'roasting.md', 'roaster/{Canonical Name}', or 'taxonomies/{axis}.md'. Got: ${raw}`,
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

  return { ok: true, proposal_id: newId, superseded_ids: Array.from(supersededIds) }
}

export function registerProposeDocChangesTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'propose_doc_changes',
    {
      title: 'Propose Doc Changes',
      description:
        'Stage a prose change to a brewing/roasting doc. Claude.ai writes a proposal; Claude Code arbitrates and applies asynchronously. Each citation targets a section_anchor (header text without `#` prefix; case-sensitive exact match). Citations may optionally override the proposal-level target_doc to span multiple files in one proposal — the brew-debrief shape (one insight, multiple files) is supported natively. Multi-citation + multi-target_doc proposals are arbitrated per (target_doc, section_anchor) group; partial application is supported. Auto-supersedes older pending proposals overlapping the same per-citation (target_doc, section_anchor).',
      inputSchema: proposeDocChangesInputSchema,
    },
    async (input) => {
      const result = await proposeDocChanges(auth, input as ProposeDocChangesInput)
      if (!result.ok) {
        throw new Error(`Proposal failed: ${result.error}`)
      }
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              proposal_id: result.proposal_id,
              status: 'pending',
              superseded_ids: result.superseded_ids,
            }),
          },
        ],
        structuredContent: {
          proposal_id: result.proposal_id,
          status: 'pending',
          superseded_ids: result.superseded_ids,
        },
      }
    },
  )
}
