import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { persistRoast, type RoastPayload } from '@/lib/roast-import'
import type { McpAuthContext } from '@/lib/mcp/auth'

// push_roast — single batch roast log insert. green_bean_id is required (FK).
// All other fields optional. The 8 Sprint-2.5 enrichment columns (added in
// migration 039) are documented inline so claude.ai can populate them when
// the source is the V4 doc / Roest profile data.

export const pushRoastInputSchema = {
  // Required identity
  green_bean_id: z.string().uuid().describe(
    'FK to green_beans.id. Use push_green_bean first if the lot isn\'t in DB yet.',
  ),
  batch_id: z.string().describe(
    'Stable batch identifier — typically the Roest batch number ("139") or lot-batch composite ("MX-139").',
  ),
  // Provenance
  roast_date: z.string().optional().nullable().describe('YYYY-MM-DD.'),
  coffee_name: z.string().optional().nullable(),
  profile_link: z.string().optional().nullable().describe('Roest connect.roestcoffee.com/shared_log URL.'),
  drum_direction: z.string().optional().nullable().describe('"Counterflow" | "Conventional".'),
  // Mass + color
  batch_size_g: z.number().optional().nullable().describe('Green coffee weight in g (typically 100).'),
  roasted_weight_g: z.number().optional().nullable(),
  weight_loss_pct: z.number().optional().nullable().describe('Decimal fraction (0.124 = 12.4%) OR percentage value (12.4); persistRoast accepts either.'),
  agtron: z.number().optional().nullable().describe('Whole-bean Agtron post-roast (Lightcells CM-200).'),
  color_description: z.string().optional().nullable(),
  // Times
  yellowing_time: z.string().optional().nullable().describe('mm:ss text.'),
  fc_start: z.string().optional().nullable().describe('First crack time as mm:ss text.'),
  drop_time: z.string().optional().nullable(),
  // Temps + dev
  charge_temp: z.number().optional().nullable().describe('Drum temp °C at charge. V4 standard: 117°C.'),
  fc_temp: z.number().optional().nullable().describe('Bean temp °C at FC. V4 target window: 200-205°C for Sudan Rume Washed (coffee-specific).'),
  drop_temp: z.number().optional().nullable().describe('Bean temp °C at drop. Drop on temp, not on clock — primary control gate per V4.'),
  dev_time_s: z.number().int().optional().nullable(),
  dev_ratio: z.string().optional().nullable().describe('Decimal as text ("0.124" = 12.4%).'),
  // Sprint 2.5 V4 enrichments
  roast_profile_name: z.string().optional().nullable().describe(
    'Roest profile template name (e.g. "Sudan Rume Washed - 119"). Distinct from profile_link (data-graph URL).',
  ),
  tp_time: z.string().optional().nullable().describe(
    'Turning Point time as mm:ss. V4: TP probe reads consistently low (78-81°C) on this machine — diagnostic-only, not a primary lever.',
  ),
  tp_temp: z.number().optional().nullable(),
  yellowing_temp: z.number().optional().nullable().describe('Bean temp °C at yellowing. V4 standard: ~165°C.'),
  hopper_load_temp: z.number().optional().nullable().describe(
    'Drum temp °C at hopper pre-load. V4 standard: 125°C (was 120°C pre-Sudan-Rume-Washed). Primary control lever.',
  ),
  fan_curve: z.string().optional().nullable().describe(
    'Shaped fan curve as display string (e.g. "80% at 0:00 -> 70% at 1:45 -> 65% at 2:30 -> 72% at 4:15 -> 75% at 5:30"). Source: Roest profile fan_bezier.',
  ),
  inlet_curve: z.string().optional().nullable().describe(
    'Shaped inlet temp curve as display string. Source: Roest profile temperature_bezier.',
  ),
  roest_log_id: z.number().int().optional().nullable().describe(
    'api.roestcoffee.com /logs/{id}/ — set when seeded from pull_roest_log.',
  ),
  // Prose
  what_worked: z.string().optional().nullable(),
  what_didnt: z.string().optional().nullable(),
  what_to_change: z.string().optional().nullable(),
  worth_repeating: z.boolean().optional().nullable(),
  is_reference: z.boolean().optional().nullable().describe(
    'True for the lot\'s confirmed reference roast (the batch you\'d replicate). One per closed bean typically.',
  ),
}

export function registerPushRoastTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'push_roast',
    {
      title: 'Push Roast',
      description:
        'Log / record / save / push / import a single roast batch (Roest log or manual entry) scoped to a green_bean_id. Mirrors the roasts table 1:1 plus 8 Sprint 2.5 enrichments (roast_profile_name, tp_time/temp, yellowing_temp, hopper_load_temp, fan_curve, inlet_curve, roest_log_id). Pull from Roest via pull_roest_log first when the source is a real machine batch — that returns a normalized payload with most fields populated; augment with prose and push.',
      inputSchema: pushRoastInputSchema,
    },
    async (input) => {
      const payload = input as RoastPayload
      const result = await persistRoast(auth.supabase, auth.userId, payload)
      if (!result.ok) {
        if (result.code === 'validation') {
          throw new Error(`Validation failed:\n${result.errors.map((e) => `  - ${e}`).join('\n')}`)
        }
        throw new Error(`Database error: ${result.message}`)
      }
      const out = { roast_id: result.roast_id }
      return {
        content: [{ type: 'text', text: JSON.stringify(out) }],
        structuredContent: out,
      }
    },
  )
}
