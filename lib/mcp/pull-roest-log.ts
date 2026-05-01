import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import {
  getRoestLog,
  getRoestProfile,
  roestLogToPushRoastPayload,
  type NormalizedRoastPayload,
  type RoestProfile,
} from '@/lib/roest-client'
import type { McpAuthContext } from '@/lib/mcp/auth'

// pull_roest_log — server-side fetch of a Roest /logs/{id}/ row + its linked
// /profiles/{profile_id}/ (for fan_curve / inlet_curve beziers). Returns a
// normalized push_roast-shaped payload. Roest credentials never round-trip to
// the caller; the MCP server holds them in env.
//
// Workflow:
//   1. claude.ai gets log_id (e.g. from list_roest_inventory or shared_log URL)
//   2. claude.ai calls pull_roest_log({ log_id })
//   3. Tool returns payload + inference_hints
//   4. claude.ai augments with prose (what_worked / what_didnt / what_to_change)
//   5. claude.ai calls push_roast(payload)
//
// green_bean_id is left null in the response; the caller resolves it by
// matching log.inventory_id against green_beans.roest_inventory_id and
// pushing push_green_bean first if the bean isn't in DB yet.

export const pullRoestLogInputSchema = {
  log_id: z.number().int().describe(
    'Roest log id (the integer from /logs/{id}/ — visible in connect.roestcoffee.com URL paths).',
  ),
}

export function registerPullRoestLogTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'pull_roest_log',
    {
      title: 'Pull Roest Log',
      description:
        'Fetches a Roest roast log + linked profile from api.roestcoffee.com and returns a normalized push_roast-shaped payload (batch_id, fc_temp, drop_temp, fc_start, drop_time, dev_time_s, fan_curve display string, inlet_curve display string, agtron, weight_loss_pct). Sets roest_log_id for cross-reference. Caller augments with prose fields (what_worked / what_didnt / what_to_change) before calling push_roast. green_bean_id is null in the response — caller resolves by matching log.inventory_id against green_beans.roest_inventory_id and calling push_green_bean first if needed.',
      inputSchema: pullRoestLogInputSchema,
    },
    async (input) => {
      const log_id = input.log_id as number
      const log = await getRoestLog(log_id)
      // Profile fetch is opportunistic — some logs may have no profile_data
      // (custom-curve roasts, deleted profiles, etc.). When absent or fetch
      // fails, fan_curve + inlet_curve come back null and inference_hints
      // surfaces the gap.
      let profile: RoestProfile | null = null
      const inferenceExtra: string[] = []
      if (log.profile_data?.id != null) {
        try {
          profile = await getRoestProfile(log.profile_data.id)
        } catch (err) {
          inferenceExtra.push(
            `Profile fetch failed for id=${log.profile_data.id}: ${err instanceof Error ? err.message : String(err)}. fan_curve / inlet_curve omitted.`,
          )
        }
      } else {
        inferenceExtra.push('Log has no linked profile — fan_curve / inlet_curve will be null.')
      }
      const payload = roestLogToPushRoastPayload(log, profile, null)
      payload.inference_hints.push(...inferenceExtra)
      // Surface the inventory_id so the caller can map it to green_bean_id.
      const out = {
        ...payload,
        roest_inventory_id: log.inventory_id,
        roest_inventory_name: log.inventory_name,
      } satisfies NormalizedRoastPayload & {
        roest_inventory_id: number | null
        roest_inventory_name: string | null
      }
      // Reference auth so the param isn't flagged as unused — pull_roest_log
      // doesn't write but Tool registration retains userId for symmetry with
      // the push tools and future query-Tools that scope to user.
      void auth
      return {
        content: [{ type: 'text', text: JSON.stringify(out) }],
        structuredContent: out,
      }
    },
  )
}
