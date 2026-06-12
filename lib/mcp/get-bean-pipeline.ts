import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { fetchByBean } from '@/lib/mcp/roasts'
import type { McpAuthContext } from '@/lib/mcp/auth'
import { withToolErrorLogging } from '@/lib/mcp/tool-wrapper'

// get_bean_pipeline — read-only fetch of the full SR pipeline for one
// green_bean_id. Returns { green_bean, roasts[], cuppings[], experiments[],
// roast_learnings } in a single call. Mirrors the existing
// roasts://by-bean/{green_bean_id} Resource exactly (same fetchByBean helper).
//
// Why this Tool exists (MCP feedback batch 4, 2026-05-01):
// push_roast is now UPSERT (returns existing roast_id on conflict, per #R13),
// which solves same-payload retry. But cross-session retry where the model
// needs to map batch_id → roast_id for STAGE 4 cuppings (or experiment_id →
// experiment_pk for STAGE 5 updates) needs a bulk read path. Calling
// push_roast 20 times to discover existing roast_ids is wasteful + indirect.
// One get_bean_pipeline call covers the entire FK-chain recovery for a lot.
//
// The Resource (roasts://by-bean/{id}) already exists but isn't reliably
// surfaced to claude.ai's tool_search per the "Tools-as-model-surface"
// architectural rule from MCP feedback batch 2 #8. Tool wrapper closes the
// gap.

export const getBeanPipelineInputSchema = {
  green_bean_id: z.string().uuid().describe(
    'green_bean UUID. Get via get_green_bean({lot_id}) if you only know the lot_id.',
  ),
  // Lot Coordinator dogfood (2026-06-11): incremental fetch. The full pipeline
  // is ~25-35KB by mid-V-set; `since` keeps reconstruct-pulls thin so sessions
  // never have an incentive to skip the pull (the lived staleness failure).
  since: z
    .string()
    .optional()
    .describe(
      'Optional ISO timestamp (e.g. "2026-06-10T00:00:00Z" — typically the updated_at high-water mark from your last pull). When set, the child arrays (roasts / cuppings / experiments / roast_recipes / brews) return ONLY rows with updated_at >= since; green_bean always returns full (it is the anchor row and carries lot_status); roast_learnings returns null when unchanged-or-absent. STRONGLY PREFER THIS on any repeat pull within a lot — the full pipeline payload dominates context cost by mid-V-set. Omit for the full pipeline (first pull of a session, or full FK-chain recovery). The response echoes since_applied so you can confirm the filter ran.',
    ),
}

export function registerGetBeanPipelineTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'get_bean_pipeline',
    {
      title: 'Get Bean Pipeline',
      description:
        'Look up / fetch / get / list / read all roasts + cuppings + experiments + roast_learnings + brews for a green coffee bean lot in one call. Returns { green_bean (full row incl. lot_status), roasts[] (full rows, chronological), cuppings[] (full rows including recipe_variant, the 6 prose fields, and ground_agtron — ordered by cupping_date asc), experiments[] (full rows including the Round-4 additions additional_notes / open_questions / key_insight_confidence), roast_learnings (single full row or null), brews[] (LIGHTWEIGHT SUMMARIES only: id + coffee_name + source + roast_id + extraction_strategy + what_i_learned + created_at, sorted latest-first) }. brews[] is the only trimmed array — the others all carry every column. INCREMENTAL FETCH: pass since:<ISO timestamp> on repeat pulls to get only rows created/updated after your last pull — strongly preferred mid-lot, the full payload is ~25-35KB by mid-V-set (see the since param description for semantics). Use this AFTER a crash / cross-session retry to recover roast_ids (for the push_cupping FK chain), experiment_pks (for push_experiment UPSERT key matching), or just to verify pipeline state across sessions. Surfaces orphan brews where roast_id is null (those need patch_brew backfill). Most common workflow: get_green_bean({lot_id}) recovers green_bean_id, then get_bean_pipeline({green_bean_id}) recovers all downstream IDs. Mirrors the roasts://by-bean/{green_bean_id} Resource (the Resource is always the full fetch).',
      inputSchema: getBeanPipelineInputSchema,
    },
    withToolErrorLogging('get_bean_pipeline', async (input) => {
      const green_bean_id = input.green_bean_id as string
      const since = input.since as string | undefined
      const payload = await fetchByBean(auth.supabase, auth.userId, green_bean_id, since)
      if (!payload) {
        throw new Error(
          `Green bean ${green_bean_id} not found (or not owned by this api_key's user). Use get_green_bean({lot_id}) to look up by lot_id, or list_roest_inventory to discover the inventory.`,
        )
      }
      return {
        content: [{ type: 'text', text: JSON.stringify(payload) }],
        structuredContent: payload as unknown as { [k: string]: unknown },
      }
    }),
  )
}
