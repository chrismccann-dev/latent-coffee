import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { patchBrew } from '@/lib/brew-import'
import type { McpAuthContext } from '@/lib/mcp/auth'

// patch_brew (Sprint 2.6) — field-level mutation Tool. Mirrors push_brew's
// surface but every field is optional except `brew_id`. Re-uses the shared
// `patchBrew()` helper in lib/brew-import.ts (also used by the
// app/api/brews/[id]/route.ts PATCH route — single source of truth for brew
// patch semantics).

export const patchBrewInputSchema = {
  brew_id: z.string().uuid().describe(
    'PK of the brew row to update. Get via get_bean_pipeline (for self-roasted beans — returns brews[] with id) or via the app UI.',
  ),

  // ---- Editable fields (all optional, mirror push_brew) ----
  coffee_name: z.string().optional().nullable(),
  roaster: z.string().optional().nullable(),
  roaster_override: z.boolean().optional(),
  producer: z.string().optional().nullable(),
  producer_override: z.boolean().optional(),
  variety: z.string().optional().nullable(),
  process: z.string().optional().nullable(),
  base_process: z.enum(['Washed', 'Honey', 'Natural', 'Wet-hulled']).optional().nullable(),
  subprocess: z.string().optional().nullable(),
  fermentation_modifiers: z.array(z.string()).optional().nullable(),
  drying_modifiers: z.array(z.string()).optional().nullable(),
  intervention_modifiers: z.array(z.string()).optional().nullable(),
  experimental_modifiers: z.array(z.string()).optional().nullable(),
  decaf_modifier: z.string().optional().nullable(),
  signature_method: z.string().optional().nullable(),
  roast_level: z.string().optional().nullable(),
  brewer: z.string().optional().nullable(),
  brewer_override: z.boolean().optional(),
  filter: z.string().optional().nullable(),
  filter_override: z.boolean().optional(),
  grinder: z.string().optional().nullable(),
  grinder_override: z.boolean().optional(),
  grind: z.string().optional().nullable(),
  grind_setting: z.string().optional().nullable(),
  dose_g: z.number().optional().nullable(),
  water_g: z.number().optional().nullable(),
  ratio: z.string().optional().nullable(),
  temp_c: z.number().optional().nullable(),
  bloom: z.string().optional().nullable(),
  pour_structure: z.string().optional().nullable(),
  total_time: z.string().optional().nullable(),
  extraction_strategy: z.string().optional().nullable(),
  extraction_confirmed: z.string().optional().nullable(),
  strategy_notes: z.string().optional().nullable(),
  modifiers: z.array(z.unknown()).optional().nullable(),
  flavors: z.array(z.unknown()).optional().nullable(),
  structure_tags: z.array(z.string()).optional().nullable(),
  flavor_notes: z.array(z.string()).optional().nullable(),
  aroma: z.string().optional().nullable(),
  attack: z.string().optional().nullable(),
  mid_palate: z.string().optional().nullable(),
  body: z.string().optional().nullable(),
  finish: z.string().optional().nullable(),
  temperature_evolution: z.string().optional().nullable(),
  peak_expression: z.string().optional().nullable(),
  what_i_learned: z.string().optional().nullable(),
  is_process_dominant: z.boolean().optional(),
  classification: z.string().optional().nullable(),
  key_takeaways: z.array(z.string()).optional().nullable(),
  terroir_connection: z.string().optional().nullable(),
  cultivar_connection: z.string().optional().nullable(),
  process_category: z.string().optional().nullable(),
  process_details: z.string().optional().nullable(),
  green_bean_id: z.string().uuid().optional().nullable().describe(
    'FK to green_beans.id. Most common patch_brew use case: backfill an orphan brew where green_bean_id was null at push time.',
  ),
  roast_id: z.string().uuid().optional().nullable().describe(
    'FK to roasts.id. Most common patch_brew use case: backfill an orphan brew where roast_id was null at push time (R16 from MCP feedback log).',
  ),

  // ---- FK re-resolution (re-route through Sprint 2.6 strict findOrCreate*) ----
  cultivar_name: z.string().optional().nullable().describe(
    'When supplied, re-resolves brews.cultivar_id via the strict-canonical findOrCreateCultivar path. Set to update the cultivar FK on this brew row.',
  ),
  country: z.string().optional().nullable().describe(
    'When supplied alongside terroir_name, re-resolves brews.terroir_id via findOrCreateTerroir (strict-canonical with country/macro pair validation post-Sprint 2.6).',
  ),
  terroir_name: z.string().optional().nullable().describe('Macro terroir name. Resolves with country.'),
  admin_region: z.string().optional().nullable().describe('Optional admin region passed to findOrCreateTerroir.'),
  meso_terroir: z.string().optional().nullable().describe('Per-bean meso terroir. Now part of the match key as of Sprint 2.6 — distinct mesos for the same macro produce distinct terroir rows.'),
}

export function registerPatchBrewTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'patch_brew',
    {
      title: 'Patch Brew',
      description:
        'Update / save / record / push field-level changes to an existing brew row by brew_id. Sibling of push_brew (for new rows) — use this when you need to backfill a missing field on an existing brew (orphan-brew with NULL roast_id, prose typo, FK linkage correction), or otherwise mutate a single brew without re-pushing the whole payload. Field-level mutation: only fields you EXPLICITLY supply in the body are updated; omitted fields are untouched. Re-validates every canonical-validated field (roaster / producer / brewer / filter / grinder / roast_level / flavors / structure_tags / extraction_strategy / process axes) the same way push_brew does — including the `*_override` flags for legitimately net-new entities. Validation errors aggregate (multi-field problems collapse to one round-trip). To find brew_ids: call get_bean_pipeline (returns brews[] for self-roasted beans).',
      inputSchema: patchBrewInputSchema,
    },
    async (input) => {
      const result = await patchBrew(auth.supabase, auth.userId, input.brew_id, input as Record<string, unknown>)
      if (!result.ok) {
        if (result.code === 'validation') {
          throw new Error(`Validation failed:\n${result.errors.map((e) => `  - ${e}`).join('\n')}`)
        }
        if (result.code === 'no_op') throw new Error(result.message)
        if (result.code === 'not_found') throw new Error(result.message)
        throw new Error(`Database error: ${result.message}`)
      }
      const out = { brew_id: result.brewId }
      return {
        content: [{ type: 'text', text: JSON.stringify(out) }],
        structuredContent: out,
      }
    },
  )
}
