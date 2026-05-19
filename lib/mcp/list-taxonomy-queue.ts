import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { McpAuthContext } from '@/lib/mcp/auth'
import type { QueueAxis, QueueSourceKind, QueueSubmissionPath } from '@/lib/taxonomy-queue'
import { withToolErrorLogging } from '@/lib/mcp/tool-wrapper'

// list_taxonomy_queue — read-only browse of the taxonomy_overrides_queue
// (Phase 3, migration 045). Mirrors the propose_doc_changes / list_canonicals
// pattern: claude.ai checks "is this producer already pending review?" before
// re-submitting; Chris-as-arbiter (Claude Code) walks the pending list at
// arbitration time.

const STATUS_VALUES = ['pending', 'promoted', 'aliased', 'rejected', 'duplicate'] as const
const AXIS_VALUES = [
  'producer',
  'roaster',
  'brewer',
  'filter',
  'grinder',
  'terroir',
  'cultivar',
  // Sprint 12 / MCP-1 (2026-05-21, migration 063): signature_method joins the
  // queue as the 8th override-eligible axis.
  'signature_method',
] as const

export const listTaxonomyQueueInputSchema = {
  status: z.enum(STATUS_VALUES).optional().describe(
    'Filter by lifecycle status. Default: "pending". Use "promoted" / "aliased" / "rejected" / "duplicate" to audit historical decisions.',
  ),
  axis: z.enum(AXIS_VALUES).optional().describe(
    'Filter by axis. Useful when arbitrating one axis at a time (one PR per axis since registry edits are per-file).',
  ),
  since: z.string().optional().describe(
    'ISO 8601 timestamp. Only entries submitted at or after this time are returned. Use to scope an arbiter session to "what landed since the last review."',
  ),
  limit: z.number().int().min(1).max(200).optional().describe(
    'Cap on rows returned. Default 50, max 200.',
  ),
}

export interface QueueListEntry {
  id: string
  axis: QueueAxis
  raw_value: string
  submission_path: QueueSubmissionPath
  source_kind: QueueSourceKind | null
  source_id: string | null
  status: (typeof STATUS_VALUES)[number]
  canonical_target: string | null
  evidence: Record<string, unknown> | null
  arbiter_notes: string | null
  submitted_at: string
  resolved_at: string | null
}

export function registerListTaxonomyQueueTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'list_taxonomy_queue',
    {
      title: 'List Taxonomy Overrides Queue',
      description:
        'List / browse / read / discover entries in the taxonomy_overrides_queue (Phase 3) — the canonical-promotion queue. Returns rows for canonical-name overrides (producer / roaster / brewer / filter / grinder via push tool *_override flags) and net-new canonical proposals (terroir / cultivar / etc. via propose_canonical_addition). Each entry pairs a `raw_value` (verbatim input) with lifecycle status (pending → promoted | aliased | rejected | duplicate). Use this BEFORE re-submitting a producer/roaster name to check whether it is already pending review (avoids duplicates). Used by Chris-as-arbiter (Claude Code session) to walk the pending list during a "process pending arbitration" run. Filters: status (default "pending"), axis, since (ISO timestamp), limit (default 50, max 200).',
      inputSchema: listTaxonomyQueueInputSchema,
    },
    withToolErrorLogging('list_taxonomy_queue', async ({ status, axis, since, limit }) => {
      const effectiveStatus = status ?? 'pending'
      let q = auth.supabase
        .from('taxonomy_overrides_queue')
        .select(
          'id, axis, raw_value, submission_path, source_kind, source_id, status, canonical_target, evidence, arbiter_notes, submitted_at, resolved_at',
        )
        .eq('user_id', auth.userId)
        .eq('status', effectiveStatus)
        .order('submitted_at', { ascending: false })
      if (axis) q = q.eq('axis', axis)
      if (since) q = q.gte('submitted_at', since)
      q = q.limit(limit ?? 50)

      const { data, error, count } = await q
      if (error) {
        throw new Error(`Database error: ${error.message}`)
      }
      const entries = (data ?? []) as unknown as QueueListEntry[]
      const out = { entries, total: count ?? entries.length }
      return {
        content: [{ type: 'text', text: JSON.stringify(out) }],
        structuredContent: out as unknown as { [k: string]: unknown },
      }
    }),
  )
}
