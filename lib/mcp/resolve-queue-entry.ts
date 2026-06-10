import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { McpAuthContext } from '@/lib/mcp/auth'
import { withToolErrorLogging, toolJson } from '@/lib/mcp/tool-wrapper'

// resolve_queue_entry — arbiter-side Tool that flips a queue row from
// 'pending' to 'promoted' / 'aliased' / 'rejected' / 'duplicate'.
//
// IMPORTANT: this Tool does NOT edit the registry source files. The arbiter
// (Claude Code session) edits docs/taxonomies/{axis}.md + lib/{axis}-registry.ts
// via the Edit tool, then calls this Tool to record the decision. Auto-editing
// TS source from MCP would require Claude Code execution context the server
// doesn't have. Mirrors propose_doc_changes → ARBITER.md flow exactly.

const ACTION_VALUES = ['promoted', 'aliased', 'rejected', 'duplicate'] as const

export const resolveQueueEntryInputSchema = {
  queue_id: z.string().uuid().describe(
    'UUID of the taxonomy_overrides_queue row to resolve. Get from list_taxonomy_queue.',
  ),
  action: z.enum(ACTION_VALUES).describe(
    'Resolution decision. "promoted" = registry edit landed; "aliased" = mapped to existing canonical via alias map (no new registry entry); "rejected" = drift / typo / not actually net-new; "duplicate" = collapse to another pending row.',
  ),
  canonical_target: z.string().optional().describe(
    'REQUIRED when action="promoted" or "aliased". The canonical name this raw_value resolves to (the new registry entry name on promote, or the existing canonical alias target on alias).',
  ),
  duplicate_of: z.string().uuid().optional().describe(
    'REQUIRED when action="duplicate". UUID of the canonical pending row this entry collapses to.',
  ),
  arbiter_notes: z.string().optional().describe(
    'Free-form prose recorded with the resolution. Useful for "promoted to tier 2; producer of Las Margaritas in Caicedonia, Valle del Cauca" or similar context the next session might want to look back at.',
  ),
}

export function registerResolveQueueEntryTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'resolve_queue_entry',
    {
      title: 'Resolve Taxonomy Queue Entry',
      description:
        'Update / resolve / save / record / log an arbiter decision on a taxonomy_overrides_queue row (Phase 3) — flips status from "pending" to "promoted" | "aliased" | "rejected" | "duplicate" and records canonical_target + arbiter_notes. Used by Chris-as-arbiter (Claude Code session) AFTER the registry edit (docs/taxonomies/{axis}.md + lib/{axis}-registry.ts) has been committed. This Tool does NOT edit the registry — it only records the decision; the editor session is the source of truth for the actual canonical promotion. Mirrors the propose_doc_changes → ARBITER.md flow: human-mediated apply, then status flip. promoted/aliased require canonical_target; duplicate requires duplicate_of (UUID of the survivor pending row). Returns { queue_id, status, resolved_at }.',
      inputSchema: resolveQueueEntryInputSchema,
    },
    withToolErrorLogging('resolve_queue_entry', async ({ queue_id, action, canonical_target, duplicate_of, arbiter_notes }) => {
      // Per-action input validation
      if ((action === 'promoted' || action === 'aliased') && !canonical_target?.trim()) {
        throw new Error(`action="${action}" requires canonical_target.`)
      }
      if (action === 'duplicate' && !duplicate_of) {
        throw new Error('action="duplicate" requires duplicate_of (queue_id of the survivor row).')
      }

      // Verify the row exists + is owned by this user + is currently pending.
      const { data: row, error: lookupErr } = await auth.supabase
        .from('taxonomy_overrides_queue')
        .select('id, status, axis, raw_value')
        .eq('id', queue_id)
        .eq('user_id', auth.userId)
        .maybeSingle()
      if (lookupErr) {
        throw new Error(`Database error: ${lookupErr.message}`)
      }
      if (!row) {
        throw new Error(`Queue row ${queue_id} not found (or not owned by this user).`)
      }
      if (row.status !== 'pending') {
        throw new Error(
          `Queue row ${queue_id} is already in status "${row.status}". Resolutions are not reversible via this Tool — file a new propose_canonical_addition or open a follow-on entry.`,
        )
      }

      const update: {
        status: typeof action
        resolved_at: string
        canonical_target?: string | null
        arbiter_notes?: string | null
      } = {
        status: action,
        resolved_at: new Date().toISOString(),
      }
      if (action === 'promoted' || action === 'aliased') {
        update.canonical_target = canonical_target!.trim()
      } else if (action === 'duplicate') {
        // Stash the survivor pointer in arbiter_notes prefix; the column is
        // already enum-checked. Mirrors doc_proposals supersede pattern.
        const prefix = `duplicate_of: ${duplicate_of}`
        update.arbiter_notes = arbiter_notes?.trim()
          ? `${prefix} — ${arbiter_notes.trim()}`
          : prefix
      }
      if (arbiter_notes?.trim() && action !== 'duplicate') {
        update.arbiter_notes = arbiter_notes.trim()
      }

      const { data, error } = await auth.supabase
        .from('taxonomy_overrides_queue')
        .update(update)
        .eq('id', queue_id)
        .eq('user_id', auth.userId)
        .select('id, status, resolved_at')
        .single()
      if (error || !data) {
        throw new Error(`Database error: ${error?.message ?? 'no row returned'}`)
      }
      const out = {
        queue_id: data.id as string,
        status: data.status as string,
        resolved_at: data.resolved_at as string,
      }
      return toolJson(out)
    }),
  )
}
