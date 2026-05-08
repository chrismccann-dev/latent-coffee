import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { McpAuthContext } from '@/lib/mcp/auth'
import { insertQueueRow } from '@/lib/taxonomy-queue'

// propose_canonical_addition — model-callable Tool that submits a net-new
// canonical value to the taxonomy_overrides_queue with submission_path =
// 'manual_propose'. Mirror of propose_doc_changes for canonical promotions.
//
// Why this Tool exists (Phase 3, #R75): for terroir + cultivar specifically
// the strict-canonical findOrCreate* helpers fail-fast on non-canonical
// input. The model can't push a brew with a fresh region. This Tool is the
// recovery surface — submit the gap, wait for the arbiter to land the
// registry edit, then retry the push.
//
// For producer / roaster / brewer / filter / grinder, the *_override flag
// path on push tools also queues; this Tool is for cases where the model
// knows ahead of time that a value is net-new and wants to flag it
// explicitly without first attempting the push.

const AXIS_VALUES = [
  'producer',
  'roaster',
  'brewer',
  'filter',
  'grinder',
  'terroir',
  'cultivar',
] as const

const evidence = z
  .object({
    source_url: z.string().optional().describe(
      'Producer / roaster website, Instagram post, lot spec sheet — any URL the arbiter can read to confirm the canonical-promotion decision.',
    ),
    notes: z.string().optional().describe(
      'Free-form prose. Producer tier rationale, regional context, why this is genuinely net-new vs. a drift / typo, etc.',
    ),
    tier: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional().describe(
      'Producer-only: tier classification (1 = Anchor, 2 = Signal, 3 = Experimental). Helps the arbiter decide ProducerEntry shape during the registry edit.',
    ),
    country: z.string().optional().describe(
      'Terroir-only: country the proposed macro_terroir falls under. Required when axis="terroir".',
    ),
    macro: z.string().optional().describe(
      'Terroir-only: existing macro_terroir this region nests under (when proposing a meso-locality), or a NEW macro the proposal recommends adopting.',
    ),
  })
  .passthrough()

export const proposeCanonicalAdditionInputSchema = {
  axis: z.enum(AXIS_VALUES).describe(
    'Which canonical axis the proposal targets. terroir + cultivar are STRICT (no override path on push); manual_propose is the only way to queue net-new entries for those axes.',
  ),
  value: z.string().describe(
    'The verbatim raw_value to queue. Trimmed server-side; case is preserved as the arbiter sees it.',
  ),
  evidence: evidence.optional().describe(
    'Optional context for the arbiter. URLs, prose, tier, country/macro. Stored as jsonb on the queue row.',
  ),
}

export function registerProposeCanonicalAdditionTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'propose_canonical_addition',
    {
      title: 'Propose Canonical Addition',
      description:
        'Propose / submit / register / log / save a net-new canonical-registry value to the taxonomy_overrides_queue (Phase 3) — the model-callable path for "this region / cultivar / producer is genuinely new and needs registry promotion." Mirrors propose_doc_changes but for canonical entries instead of prose. Required for terroir + cultivar (strict-canonical, no override path on push tools); also useful for producer / roaster / brewer / filter / grinder when you know ahead of time a value is net-new and want to flag it before attempting a push. Auto-collapses on duplicate: a second proposal for the same (axis, value) returns the existing pending row id with status="duplicate" instead of creating a second row. Status flow: pending → arbiter calls resolve_queue_entry → promoted | aliased | rejected. Promotion happens via a registry edit during a Claude Code arbiter session; this Tool only files the proposal. Returns { queue_id, status: "pending" | "duplicate", duplicate_of? } where duplicate_of is set when status="duplicate".',
      inputSchema: proposeCanonicalAdditionInputSchema,
    },
    async ({ axis, value, evidence: evidencePayload }) => {
      const trimmed = value.trim()
      if (!trimmed) {
        throw new Error('value cannot be empty')
      }
      const result = await insertQueueRow(auth.supabase, auth.userId, {
        axis,
        raw_value: trimmed,
        submission_path: 'manual_propose',
        source_kind: 'manual',
        source_id: null,
        evidence: evidencePayload ?? null,
      })
      if (!result.ok) {
        throw new Error(`Queue insert failed: ${result.error}`)
      }
      const out = {
        queue_id: result.queue_id,
        status: result.created ? ('pending' as const) : ('duplicate' as const),
        ...(result.created ? {} : { duplicate_of: result.queue_id }),
      }
      return {
        content: [{ type: 'text', text: JSON.stringify(out) }],
        structuredContent: out,
      }
    },
  )
}
