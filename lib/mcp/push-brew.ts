import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { persistBrew, type BrewPayload } from '@/lib/brew-import'
import type { McpAuthContext } from '@/lib/mcp/auth'

// Input schema mirrors lib/brew-import.ts BrewPayload + SYNC_V2.md push_brew spec.
// We let zod validate shape, then hand the typed object to persistBrew which
// runs the canonical-registry checks via the existing findOrCreate* + clean*
// helpers. That keeps validation logic in ONE place (lib/brew-import.ts).
const baseProcess = z.enum(['Washed', 'Honey', 'Natural', 'Wet-hulled'])

const flavorChip = z.object({
  base: z.string(),
  modifiers: z.array(z.string()).default([]),
})

const modifierEntry = z.object({
  type: z.enum(['output_selection', 'inverted_temperature_staging', 'aroma_capture', 'immersion']),
  // type-specific subfields (the discriminated union is hand-validated in cleanModifiers)
  form: z.enum(['early_cut', 'late_cut', 'both']).optional(),
  brew_weight: z.number().optional().nullable(),
  cup_yield: z.number().optional().nullable(),
  notes: z.string().optional().nullable(),
  phases: z.string().optional().nullable(),
  application: z.string().optional().nullable(),
})

// Elevation + climate_stress live at the TERROIR level (canonical registry +
// terroirs row), not per-brew. They populate at terroir-create time only and
// are not pushable through push_brew. Lot-specific elevation gradients are
// not currently a tracked dimension; folding them in here would create silent
// drift between the lot fact and the macro-terroir envelope.
const terroir = z.object({
  country: z.string(),
  admin_region: z.string().optional().nullable(),
  macro_terroir: z.string().optional().nullable(),
  meso_terroir: z.string().optional().nullable(),
})

const cultivar = z.object({
  cultivar_name: z.string(),
  species: z.string().optional().nullable(),
  genetic_family: z.string().optional().nullable(),
  lineage: z.string().optional().nullable(),
})

export const pushBrewInputSchema = {
  // Identity
  coffee_name: z.string().describe('Coffee marketing name (e.g. "Emerald PL#015").'),
  roaster: z.string().describe('Canonical roaster name. allowOverride via roaster_override.'),
  roaster_override: z.boolean().optional(),
  producer: z.string().optional().nullable(),
  producer_override: z.boolean().optional(),

  // Origin (FK targets)
  terroir,
  cultivar,
  variety: z.string().optional().nullable().describe('Legacy compat — use cultivar.cultivar_name.'),

  // Process
  process: z.string().optional().nullable().describe('Composed display string. Optional if structured fields supplied.'),
  base_process: baseProcess.optional().nullable(),
  subprocess: z.string().optional().nullable(),
  fermentation_modifiers: z.array(z.string()).optional().nullable(),
  drying_modifiers: z.array(z.string()).optional().nullable(),
  intervention_modifiers: z.array(z.string()).optional().nullable(),
  experimental_modifiers: z.array(z.string()).optional().nullable(),
  decaf_modifier: z.string().optional().nullable(),
  signature_method: z.string().optional().nullable(),

  // Roast
  roast_level: z.string().optional().nullable(),

  // Recipe
  brewer: z.string().optional().nullable(),
  brewer_override: z.boolean().optional(),
  filter: z.string().optional().nullable(),
  filter_override: z.boolean().optional(),
  grinder: z.string().optional().nullable(),
  grinder_override: z.boolean().optional(),
  grind: z.string().optional().nullable().describe('Legacy denormalized "EG-1 6.5". Use grinder + grind_setting instead when possible.'),
  grind_setting: z.string().optional().nullable(),
  dose_g: z.number().optional().nullable(),
  water_g: z.number().optional().nullable(),
  ratio: z.string().optional().nullable(),
  temp_c: z.number().optional().nullable(),
  bloom: z.string().optional().nullable(),
  pour_structure: z.string().optional().nullable(),
  total_time: z.string().optional().nullable(),

  // Extraction
  extraction_strategy: z.string().optional().nullable(),
  extraction_confirmed: z.string().optional().nullable(),
  strategy_notes: z.string().optional().nullable().describe(
    'Free-text within-strategy gradient + miscellaneous recipe nuance that does NOT fit the canonical extraction_strategy enum. Use for "lower edge of Balanced Intensity", "leaning toward Suppression", or recipe-context that the 5-value enum + extraction_confirmed (cross-strategy divergence) cannot capture. Distinct from `classification` (lot code + roast date stash).',
  ),
  modifiers: z.array(modifierEntry).optional().nullable(),

  // Tasting
  flavors: z.array(flavorChip).optional().nullable(),
  structure_tags: z.array(z.string()).optional().nullable(),
  flavor_notes: z.array(z.string()).optional().nullable().describe('Legacy display strings; use flavors[] structured form.'),
  aroma: z.string().optional().nullable(),
  attack: z.string().optional().nullable(),
  mid_palate: z.string().optional().nullable(),
  body: z.string().optional().nullable(),
  finish: z.string().optional().nullable(),
  temperature_evolution: z.string().optional().nullable(),
  peak_expression: z.string().optional().nullable(),
  what_i_learned: z.string().optional().nullable(),

  // Flags + extras
  is_process_dominant: z.boolean().optional(),
  classification: z.string().optional().nullable().describe('Free-text lot code + roast date stash until schema add.'),
  key_takeaways: z.array(z.string()).optional().nullable(),
  terroir_connection: z.string().optional().nullable(),
  cultivar_connection: z.string().optional().nullable(),
  process_category: z.string().optional().nullable(),
  process_details: z.string().optional().nullable(),
}

export function registerPushBrewTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'push_brew',
    {
      title: 'Push Brew',
      description:
        'Inserts a resolved brew into the app. Validates against canonical registries; FK-resolves terroir + cultivar via lazy find-or-create. Returns brew_id + flags for which FKs were newly created. On validation failure returns the error list as a tool error so the caller can retry with corrections.',
      inputSchema: pushBrewInputSchema,
    },
    async (input) => {
      const payload: BrewPayload = {
        ...input,
        coffee_name: input.coffee_name,
        roaster: input.roaster,
        terroir: input.terroir,
        cultivar: input.cultivar,
      } as BrewPayload

      const result = await persistBrew(auth.supabase, auth.userId, payload, {
        confirmNewTerroir: true,
        confirmNewCultivar: true,
      })

      if (!result.ok) {
        if (result.code === 'validation') {
          throw new Error(`Validation failed:\n${result.errors.map((e) => `  - ${e}`).join('\n')}`)
        }
        if (result.code === 'db_error') {
          throw new Error(`Database error: ${result.message}`)
        }
        if (result.code === 'confirm_required') {
          throw new Error(
            'Unexpected confirm_required result — push_brew opts in to confirmNew{Terroir,Cultivar}; this should not fire.',
          )
        }
        throw new Error(`Unknown persistBrew failure: ${JSON.stringify(result)}`)
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              brew_id: result.brewId,
              terroir_id: result.terroirId,
              cultivar_id: result.cultivarId,
              created_terroir: result.createdTerroir,
              created_cultivar: result.createdCultivar,
            }),
          },
        ],
        structuredContent: {
          brew_id: result.brewId,
          terroir_id: result.terroirId,
          cultivar_id: result.cultivarId,
          created_terroir: result.createdTerroir,
          created_cultivar: result.createdCultivar,
        },
      }
    },
  )
}
