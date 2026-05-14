import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { patchBrew, PATCH_BREW_EDITABLE_FIELDS } from '@/lib/brew-import'
import type { McpAuthContext } from '@/lib/mcp/auth'
import { withToolErrorLogging } from '@/lib/mcp/tool-wrapper'

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
  extraction_strategy: z.string().optional().nullable().describe(
    "Strict 6-value enum (v8.4): Suppression | Clarity-First | Balanced Intensity | Full Expression | Extraction Push | Hybrid. When patching to 'Hybrid', also send hybrid_subform in the same patch. When patching AWAY from 'Hybrid', the server auto-clears hybrid_subform.",
  ),
  hybrid_subform: z.string().optional().nullable().describe(
    'v8.4 conditional sub-form. Required when extraction_strategy = Hybrid. Canonical: sequential | phase_mapped | selective_bloom | intensity_clarity_split | temperature_staged. See `canonicals://hybrid-subforms`.',
  ),
  extraction_confirmed: z.string().optional().nullable(),
  strategy_notes: z.string().optional().nullable(),
  cooling_curve_target: z.string().optional().nullable().describe(
    'v8.4 named consideration. Free-text peak evaluation window when it IS the strategy (e.g. "40-45°C peak"). Default null = normal cooling progression. Empty string normalizes to null.',
  ),
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

  // ---- Display recompose flag (post-2.6 cleanup) ----
  recompose_process: z.boolean().optional().describe(
    'Set to true to recompute the legacy `process` display string from the row\'s current structured process columns (base_process / subprocess / *_modifiers / decaf_modifier / signature_method). Used to fix legacy rows where the structured cols are correct but the display string was never run through composeProcess (e.g. verbose paste-text imports pre-Sprint 1e.3). When true, the helper fetches the row, merges with any structured-process fields you also supply in this patch, and writes the canonical composed form. Auto-applies whenever any structured-process field is in the patch (mirrors the grind/grind_setting recompute).',
  ),
}

export function registerPatchBrewTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'patch_brew',
    {
      title: 'Patch Brew',
      description:
        'Update / fix / correct / save / record / push field-level changes to an existing brew row by brew_id. Sibling of push_brew (for new rows) — use this when you need to fix a typo on a brew you already pushed, backfill a missing field on an existing brew (orphan-brew with NULL roast_id, FK linkage correction), or otherwise mutate a single brew without re-pushing the whole payload. Field-level mutation: only fields you EXPLICITLY supply in the body are updated; omitted fields are untouched. Re-validates every canonical-validated field (roaster / producer / brewer / filter / grinder / roast_level / flavors / structure_tags / extraction_strategy / process axes) the same way push_brew does — including the `*_override` flags for legitimately net-new entities. Validation errors aggregate (multi-field problems collapse to one round-trip). To find brew_ids: call get_bean_pipeline (returns brews[] for self-roasted beans). Returns { brew_id, updated_fields: [...] } — updated_fields echoes simple-column keys the caller supplied (canonical re-resolutions like roaster / producer / cultivar / terroir / process axes are NOT echoed because they touch multiple columns; check a follow-up read if you need to confirm those landed).',
      inputSchema: patchBrewInputSchema,
    },
    withToolErrorLogging('patch_brew', async (input) => {
      const body = input as Record<string, unknown>
      const result = await patchBrew(auth.supabase, auth.userId, input.brew_id, body)
      if (!result.ok) {
        if (result.code === 'validation') {
          throw new Error(`Validation failed:\n${result.errors.map((e) => `  - ${e}`).join('\n')}`)
        }
        if (result.code === 'no_op') throw new Error(result.message)
        if (result.code === 'not_found') throw new Error(result.message)
        throw new Error(`Database error: ${result.message}`)
      }
      // Echo simple-column diff. FK re-resolutions (roaster / producer /
      // cultivar / terroir / process axes) intentionally excluded - they touch
      // multiple columns + sibling rows. Round-5 dogfood symmetry sweep
      // (2026-05-10).
      const updated_fields = PATCH_BREW_EDITABLE_FIELDS.filter(
        (k) => k in body && body[k] !== undefined,
      )
      const out = { brew_id: result.brewId, updated_fields }
      return {
        content: [{ type: 'text', text: JSON.stringify(out) }],
        structuredContent: out,
      }
    }),
  )
}
