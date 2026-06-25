import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { McpAuthContext } from '@/lib/mcp/auth'
import { withToolErrorLogging } from '@/lib/mcp/tool-wrapper'

// list_doc_proposals — read-only browse of the doc_proposals queue (Sprint 2.4,
// migration 037). The prose-side analog of list_taxonomy_queue: Chris-as-arbiter
// (Claude Code) walks the pending list during a "process pending arbitration"
// run, then resolve_doc_proposal flips each row.
//
// Why this Tool exists: until it shipped, doc_proposals was the ONLY arbiter
// queue with a write path (propose_doc_changes) but no dedicated reader, so the
// ARBITER.md playbook reached for raw `execute_sql`. This Tool +
// resolve_doc_proposal close that gap — the prose-proposal pass now runs
// entirely on typed Tools, one connector, no raw SQL surface.

const STATUS_VALUES = ['pending', 'applied', 'rejected', 'superseded'] as const
const SOURCE_KIND_VALUES = ['brew', 'roast', 'cupping', 'session'] as const

export const listDocProposalsInputSchema = {
  status: z.enum(STATUS_VALUES).optional().describe(
    'Filter by lifecycle status. Default "pending". Use "applied" / "rejected" / "superseded" to audit historical decisions (e.g. "what got superseded recently?").',
  ),
  target_doc: z.string().optional().describe(
    'Filter to one target_doc (e.g. "roaster/Hydrangea Coffee", "skills/wbc-brewing-archivist/cluster/wbc-reference.md"). Useful when arbitrating one file at a time (one PR per target_doc).',
  ),
  source_kind: z.enum(SOURCE_KIND_VALUES).optional().describe(
    'Filter by source.kind ("brew" | "roast" | "cupping" | "session"). Use for the source-id-stem supersession scan (ARBITER.md Pattern 2) — pull all pending close-lot proposals to spot V1/V2 stems on the same lot.',
  ),
  since: z.string().optional().describe(
    'ISO 8601 timestamp. Only proposals created at or after this time are returned. Scopes a session to "what landed since the last arbitration."',
  ),
  limit: z.number().int().min(1).max(200).optional().describe(
    'Cap on rows returned. Default 50, max 200.',
  ),
}

interface DocProposalListEntry {
  id: string
  target_doc: string
  source: Record<string, unknown> | null
  citations: unknown
  summary: string
  status: (typeof STATUS_VALUES)[number]
  notes: string | null
  applied_by_session: string | null
  created_at: string
  applied_at: string | null
}

export function registerListDocProposalsTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'list_doc_proposals',
    {
      title: 'List Doc Proposals Queue',
      description:
        'List / browse / read / discover entries in the doc_proposals queue (Sprint 2.4, migration 037) — the prose-doc change queue claude.ai writes via propose_doc_changes. Returns rows pairing a target_doc + source + citations[] + summary with lifecycle status (pending → applied | rejected | superseded). The prose-side analog of list_taxonomy_queue: used by Chris-as-arbiter (Claude Code session) to walk the pending list during a "process pending arbitration" run, then resolve_doc_proposal flips each row. Sorted by (target_doc, created_at) so proposals group contiguously by file (one PR per target_doc). Filters: status (default "pending"), target_doc, source_kind, since (ISO timestamp), limit (default 50, max 200). Returns { entries: [{ id, target_doc, source, citations, summary, status, notes, applied_by_session, created_at, applied_at }], total }.',
      inputSchema: listDocProposalsInputSchema,
    },
    withToolErrorLogging('list_doc_proposals', async ({ status, target_doc, source_kind, since, limit }) => {
      const effectiveStatus = status ?? 'pending'
      let q = auth.supabase
        .from('doc_proposals')
        .select(
          'id, target_doc, source, citations, summary, status, notes, applied_by_session, created_at, applied_at',
        )
        .eq('user_id', auth.userId)
        .eq('status', effectiveStatus)
        .order('target_doc', { ascending: true })
        .order('created_at', { ascending: true })
      if (target_doc) q = q.eq('target_doc', target_doc)
      if (source_kind) q = q.eq('source->>kind', source_kind)
      if (since) q = q.gte('created_at', since)
      q = q.limit(limit ?? 50)

      const { data, error, count } = await q
      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }
      const entries = (data ?? []) as unknown as DocProposalListEntry[]
      const out = { entries, total: count ?? entries.length }
      return {
        content: [{ type: 'text', text: JSON.stringify(out) }],
        structuredContent: out as unknown as { [k: string]: unknown },
      }
    }),
  )
}
