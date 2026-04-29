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
// target_doc allow-list:
//   - 'brewing.md'                                — repo root BREWING.md
//   - 'roasting.md'                               — repo root ROASTING.md (file lands in 2.5; arbiter surfaces orphan in 2.4)
//   - 'roaster/{Canonical Roaster Name}'          — section in docs/brewing/roasters.md (Sprint 2.4 split)
//   - 'taxonomies/{axis}.md'                      — one of 10 canonical taxonomy MD files
//
// Roaster names are canonicalized via ROASTER_LOOKUP.canonicalize on insert so
// 'roaster/hydrangea coffee' and 'roaster/Hydrangea Coffee' converge to the
// same target_doc value (auto-supersede then matches both).

const VALID_OPERATIONS = ['append', 'replace', 'prepend'] as const
const VALID_SOURCE_KINDS = ['brew', 'roast', 'cupping', 'session'] as const

const citation = z.object({
  section_anchor: z.string().describe('Header text WITHOUT the leading `#` characters. E.g. "Equipment Reference".'),
  line_range: z.tuple([z.number(), z.number()]).optional(),
  current_text: z.string().optional().describe('Best-effort excerpt of what the section looks like now. Helps the arbiter detect drift.'),
  proposed_text: z.string().describe('The text to append / prepend / replace with.'),
  operation: z.enum(VALID_OPERATIONS),
  rationale: z.string().describe('Free-text justification — surfaced to the arbiter at apply time.'),
})

const sourceRef = z.object({
  kind: z.enum(VALID_SOURCE_KINDS),
  id: z.string().optional(),
})

export const proposeDocChangesInputSchema = {
  target_doc: z.string().describe(
    'Doc identifier: "brewing.md" | "roasting.md" | "roaster/{Canonical Roaster Name}" | "taxonomies/{axis}.md". Roaster names are auto-canonicalized via ROASTER_LOOKUP. Unknown roasters are rejected (no override path); add to docs/taxonomies/roasters.md first.',
  ),
  source: sourceRef.describe('What triggered the proposal — a brew log session, a roast cupping, an end-of-coffee debrief, or a general session.'),
  citations: z.array(citation).min(1).describe(
    'One or more edits, each scoped to a section_anchor. Multi-citation proposals are arbitrated per-citation; partial application is supported.',
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
  const normalized = normalizeTargetDoc(input.target_doc)
  if (!normalized.ok) return { ok: false, error: normalized.error }
  const target_doc = normalized.target_doc

  // INSERT first so we have the new id for the supersede UPDATE's `notes`. Two
  // calls (INSERT then UPDATE) instead of a single transaction — supabase-js
  // doesn't expose Postgres transactions natively in this shape. The race window
  // is bounded: a parallel write would just supersede whichever arrives second.
  const insertRow = {
    user_id: auth.userId,
    target_doc,
    source: input.source,
    citations: input.citations,
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
  // (target_doc, section_anchor) pairs. Per-citation UPDATEs; overlap on the
  // same older row across multiple citations is harmless (status is idempotent).
  // Soft-fail on UPDATE error so the INSERT still succeeds; arbiter can manually
  // reconcile if needed.
  const supersededIds = new Set<string>()
  for (const citation of input.citations) {
    const anchor = citation.section_anchor
    const { data: superseded, error: updErr } = await auth.supabase
      .from('doc_proposals')
      .update({
        status: 'superseded',
        notes: `Superseded by ${newId} on ${new Date().toISOString()}`,
      })
      .eq('user_id', auth.userId)
      .eq('target_doc', target_doc)
      .eq('status', 'pending')
      .neq('id', newId)
      .contains('citations', [{ section_anchor: anchor }])
      .select('id')
    if (updErr) {
      console.error(`[propose_doc_changes] supersede UPDATE failed for anchor "${anchor}":`, updErr)
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
        'Stage a prose change to a brewing/roasting doc. Claude.ai writes a proposal; Claude Code arbitrates and applies asynchronously. Each citation targets a section_anchor (header text without `#` prefix). Multi-citation proposals are arbitrated per-citation. Auto-supersedes older pending proposals overlapping the same (target_doc, section_anchor).',
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
