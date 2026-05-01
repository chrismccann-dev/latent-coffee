import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { searchRoestLogs, msecToMMSS } from '@/lib/roest-client'
import type { McpAuthContext } from '@/lib/mcp/auth'

// list_roest_logs — discover Roest roast log batches by inventory_id.
//
// Sister Tool to pull_roest_log + list_roest_inventory. The Roest API exposes
// /logs/?inventory={id}&limit={n} returning a paginated array of log summaries.
// Wraps `searchRoestLogs` (lib/roest-client.ts:209) which already exists for
// internal use but had no MCP wrapper through Sprint 2.5.
//
// Workflow:
//   1. claude.ai calls list_roest_inventory({ search: 'sudan rume' }) to find inventory_id
//   2. claude.ai calls list_roest_logs({ inventory_id }) to enumerate log_ids
//   3. claude.ai calls pull_roest_log({ log_id }) per batch to get the full normalized payload
//   4. push_green_bean → push_roast loop
//
// Returns lightweight summaries (log_id + batch_no + roast_date + key control
// temps + machine slug) — NOT the full log payload. For the full payload use
// pull_roest_log on a specific log_id.

export const listRoestLogsInputSchema = {
  inventory_id: z.number().int().describe(
    'Roest inventory id (the integer from /inventories/{id}/). Discover via list_roest_inventory.',
  ),
  limit: z.number().int().min(1).max(200).optional().describe(
    'Max logs to return. Default 50 (matches Roest API default page size). Set higher for closed lots with many batches.',
  ),
}

export function registerListRoestLogsTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'list_roest_logs',
    {
      title: 'List Roest Logs',
      description:
        'List / browse / discover / find / enumerate / search all Roest roast log batches for a given green coffee inventory (lot). Returns lightweight summaries (log_id + batch_no + roast_date + fc_temp + drop_temp + agtron + profile_name + share_uuid) for each batch the Roest machine recorded against this inventory_id. Use BEFORE pull_roest_log when you don\'t already know the log IDs — pull_roest_log requires a specific log_id; this Tool discovers them by inventory_id. Pairs with list_roest_inventory (which discovers inventory_id from a name search) to give a complete two-step lookup. Roest credentials never leave the server.',
      inputSchema: listRoestLogsInputSchema,
    },
    async (input) => {
      const inventory_id = input.inventory_id as number
      const limit = (input.limit as number | undefined) ?? 50
      const logs = await searchRoestLogs(inventory_id, limit)
      // Trim to lightweight summaries — pull_roest_log returns the full normalized
      // payload. This Tool's job is enumeration, not full-fetch.
      const summaries = logs.map((log) => ({
        log_id: log.id,
        batch_no: log.batch_no,
        roast_date: log.start_timestamp ? log.start_timestamp.slice(0, 10) : null,
        profile_name: log.profile_data?.name ?? null,
        machine_slug: log.machine_slug,
        fc_temp: log.fc_temp,
        drop_temp: log.end_temp,
        fc_start: msecToMMSS(log.firstcrack_event_msec),
        agtron: log.whole_bean_color,
        weight_loss_pct:
          log.start_weight != null && log.end_weight != null && log.start_weight > 0
            ? Number(((1 - log.end_weight / log.start_weight) * 100).toFixed(2))
            : null,
        share_uuid: log.share_uuid,
        profile_link: log.share_uuid
          ? `https://connect.roestcoffee.com/shared_log/${log.share_uuid}`
          : null,
      }))
      void auth
      const out = {
        inventory_id,
        count: summaries.length,
        logs: summaries,
      }
      return {
        content: [{ type: 'text', text: JSON.stringify(out) }],
        structuredContent: out,
      }
    },
  )
}
