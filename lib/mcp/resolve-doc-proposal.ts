import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { McpAuthContext } from '@/lib/mcp/auth'
import { withToolErrorLogging, toolJson } from '@/lib/mcp/tool-wrapper'

// resolve_doc_proposal — arbiter-side Tool that flips a doc_proposals row from
// 'pending' to 'applied' / 'rejected' / 'superseded' and records notes +
// applied_by_session + applied_at. The prose-side analog of resolve_queue_entry.
//
// IMPORTANT: this Tool does NOT edit the repo prose files. The arbiter (Claude
// Code session) applies the citation edits via the Edit tool (ARBITER.md Step 6),
// then calls this Tool to record the roll-up decision (Step 7). Mirrors the
// propose_doc_changes → ARBITER.md flow exactly: human-mediated apply, then a
// status flip.
//
// `supersede_ids` folds in the arbiter-walked implicit-supersession UPDATEs
// (ARBITER.md § Implicit-intent supersession detection, Patterns 1 + 2): when a
// newer pending proposal corrects older ones whose (target_doc, section_anchor)
// didn't overlap at write time, pass the older IDs to flip them in the same
// call. Additive on top of the write-time auto-supersede in propose_doc_changes.

const STATUS_VALUES = ['applied', 'rejected', 'superseded'] as const

export const resolveDocProposalInputSchema = {
  proposal_id: z.string().uuid().describe(
    'UUID of the doc_proposals row to resolve. Get from list_doc_proposals.',
  ),
  status: z.enum(STATUS_VALUES).describe(
    'Roll-up resolution (ARBITER.md Step 7). "applied" = every citation applied, OR a mixed apply (some applied / some rejected) with per-citation outcomes captured in notes; "rejected" = every citation discarded; "superseded" = every citation orphaned + discarded, or closing a stale proposal a newer one replaces. Partial-orphaned "leave pending" = do NOT call this Tool.',
  ),
  notes: z.string().optional().describe(
    'Arbiter notes recorded on the row (doc_proposals.notes). Use for per-citation outcomes on a mixed apply ("citation 1 applied; citation 2 rejected: stale anchor"), cross-doc apply notes, or supersession context.',
  ),
  applied_by_session: z.string().optional().describe(
    'Claude Code session id that applied the change, for the audit trail (doc_proposals.applied_by_session). Pass the session you are in.',
  ),
  supersede_ids: z.array(z.string().uuid()).optional().describe(
    'Optional. Other pending proposal UUIDs this resolution supersedes — the arbiter-walked implicit-supersession path (ARBITER.md Patterns 1 + 2, for older rows whose anchor did not overlap at write time). Each is flipped to "superseded" with a note pointing at proposal_id. Same RLS scope; already-resolved / non-pending IDs no-op. The IDs that actually flipped are returned in superseded_ids[].',
  ),
}

export function registerResolveDocProposalTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'resolve_doc_proposal',
    {
      title: 'Resolve Doc Proposal',
      description:
        'Update / resolve / save / record / log an arbiter decision on a doc_proposals row (Sprint 2.4) — flips status from "pending" to "applied" | "rejected" | "superseded" and records notes + applied_by_session + applied_at. The prose-side analog of resolve_queue_entry. Used by Chris-as-arbiter (Claude Code session) AFTER the citation edits have been applied to the repo prose file (ARBITER.md Step 6); this Tool only records the roll-up decision (Step 7) — it does NOT edit the doc. Pass supersede_ids[] to also flip older pending proposals this one corrects (the arbiter-walked implicit-supersession path, ARBITER.md Patterns 1 + 2) in the same call. Resolution is one-way: only pending rows resolve. Returns { proposal_id, status, applied_at, superseded_ids }.',
      inputSchema: resolveDocProposalInputSchema,
    },
    withToolErrorLogging(
      'resolve_doc_proposal',
      async ({ proposal_id, status, notes, applied_by_session, supersede_ids }) => {
        // Verify the row exists + is owned by this user + is currently pending.
        const { data: row, error: lookupErr } = await auth.supabase
          .from('doc_proposals')
          .select('id, status, target_doc')
          .eq('id', proposal_id)
          .eq('user_id', auth.userId)
          .maybeSingle()
        if (lookupErr) {
          throw new Error(`Database error: ${lookupErr.message}`)
        }
        if (!row) {
          throw new Error(`Doc proposal ${proposal_id} not found (or not owned by this user).`)
        }
        if (row.status !== 'pending') {
          throw new Error(
            `Doc proposal ${proposal_id} is already in status "${row.status}". Resolutions are not reversible via this Tool — file a new propose_doc_changes proposal.`,
          )
        }

        const resolvedAt = new Date().toISOString()
        const update: {
          status: typeof status
          applied_at: string
          notes?: string | null
          applied_by_session?: string | null
        } = {
          status,
          applied_at: resolvedAt,
        }
        if (notes?.trim()) update.notes = notes.trim()
        if (applied_by_session?.trim()) update.applied_by_session = applied_by_session.trim()

        const { data, error } = await auth.supabase
          .from('doc_proposals')
          .update(update)
          .eq('id', proposal_id)
          .eq('user_id', auth.userId)
          .select('id, status, applied_at')
          .single()
        if (error || !data) {
          throw new Error(`Database error: ${error?.message ?? 'no row returned'}`)
        }

        // Arbiter-walked implicit supersession (ARBITER.md Patterns 1 + 2). Flip
        // the named older pending rows to 'superseded' in the same call. Same RLS
        // scope + status='pending' filter for idempotency (already-resolved IDs
        // no-op). Excludes proposal_id itself defensively.
        const supersededIds: string[] = []
        const ids = (supersede_ids ?? []).filter((id) => id !== proposal_id)
        if (ids.length > 0) {
          const note = `Superseded by ${proposal_id} on ${resolvedAt} via arbiter resolve_doc_proposal`
          const { data: flipped, error: supErr } = await auth.supabase
            .from('doc_proposals')
            .update({ status: 'superseded', applied_at: resolvedAt, notes: note })
            .eq('user_id', auth.userId)
            .eq('status', 'pending')
            .in('id', ids)
            .select('id')
          if (supErr) {
            throw new Error(`Database error (supersede_ids): ${supErr.message}`)
          }
          for (const r of flipped ?? []) supersededIds.push(r.id as string)
        }

        const out = {
          proposal_id: data.id as string,
          status: data.status as string,
          applied_at: data.applied_at as string,
          superseded_ids: supersededIds,
        }
        return toolJson(out)
      },
    ),
  )
}
