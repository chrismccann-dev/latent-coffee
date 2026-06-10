import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import {
  getRoestLog,
  getRoestProfile,
  getRoestDatapoints,
  roestLogToPushRoastPayload,
  type NormalizedRoastPayload,
  type RoestProfile,
  type RoestDatapoint,
} from '@/lib/roest-client'
import type { McpAuthContext } from '@/lib/mcp/auth'
import { withToolErrorLogging, toolJson } from '@/lib/mcp/tool-wrapper'

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
        'Pull / fetch / import / load / sync a Roest machine roast log from api.roestcoffee.com. Hits THREE endpoints: /logs/{id}/ (summary + event timestamps), /profiles/{profile_id}/ (as-designed bezier curves), AND /datapoints/?log={id} (raw bt / inlet_temp time-series, auto-paginated). Returns a normalized push_roast-shaped payload covering: identity (batch_id, roast_date, coffee_name, profile_link) — roast_date is in the user\'s configured local timezone (ROEST_USER_TIMEZONE env var, default America/Los_Angeles); roast_date_utc carries the raw UTC slice. Discrete event temps + times (fc_temp, drop_temp, fc_start, drop_time, dev_time_s, dev_ratio, yellowing_time, charge_temp). Sprint 3.5 server-side compute from /datapoints/: tp_time + tp_temp (bt local min in first half of roast), yellowing_temp (bt interpolated at dryend_event_msec), inlet_curve_recorded (as-recorded inlet sampled at the designed-bezier msec keys), ror_at_2_30 + ror_at_4_00 + ror_at_fc_minus_30s (°C/min via 30s centered window). As-designed bezier curves: fan_curve, inlet_curve. Mass + color: batch_size_g, roasted_weight_g, weight_loss_pct, agtron. End-condition trigger from the profile: end_condition_type + end_condition_target. R57 routing (Sprint 3.5): the Roest UI Notes field / log.first_comment.comment lands in color_description on the payload (Chris uses Roest notes to record post-CM200 color descriptor); the legacy roest_notes payload field was retired — push_roast.roest_notes still accepts input for back-compat but pull_roest_log no longer auto-populates it. Caller augments with prose fields (what_worked / what_didnt / what_to_change), fc_audibility, fc_total_cracks (visible in Roest UI but not API), hopper_load_temp (NOT exposed by Roest API at all — caller sets from session memory; V4 standard 125°C). inlet_curve reflects the as-DESIGNED template; inlet_curve_recorded captures any mid-roast operator overrides — compare the two strings to detect divergence. green_bean_id is null in the response - caller resolves by matching log.inventory_id against green_beans.roest_inventory_id and calling push_green_bean first if needed.',
      inputSchema: pullRoestLogInputSchema,
    },
    withToolErrorLogging('pull_roest_log', async (input) => {
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
      // Sprint 3.5: /datapoints/ time-series fetch is the third API hit per
      // pull. Failures are non-fatal — the normalizer degrades gracefully
      // (TP / yellowing_temp / RoR / inlet_curve_recorded null with a hint).
      let datapoints: RoestDatapoint[] = []
      try {
        datapoints = await getRoestDatapoints(log_id)
      } catch (err) {
        inferenceExtra.push(
          `/datapoints/ fetch failed for log=${log_id}: ${err instanceof Error ? err.message : String(err)}. TP / yellowing_temp / RoR / inlet_curve_recorded omitted.`,
        )
      }
      const payload = roestLogToPushRoastPayload(log, profile, null, datapoints)
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
      return toolJson(out)
    }),
  )
}
