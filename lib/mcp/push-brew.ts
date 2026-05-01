import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { persistBrew, type BrewPayload } from '@/lib/brew-import'
import {
  HONEY_SUBPROCESSES,
  FERMENTATION_MODIFIERS,
  DRYING_MODIFIERS,
  INTERVENTION_MODIFIERS,
  EXPERIMENTAL_MODIFIERS,
  DECAF_MODIFIERS,
  SIGNATURE_NAMES,
} from '@/lib/process-registry'
import { STRUCTURE_KEYS } from '@/lib/flavor-registry'
import type { McpAuthContext } from '@/lib/mcp/auth'

// Input schema mirrors lib/brew-import.ts BrewPayload + SYNC_V2.md push_brew spec.
// We let zod validate shape, then hand the typed object to persistBrew which
// runs the canonical-registry checks via the existing findOrCreate* + clean*
// helpers. That keeps validation logic in ONE place (lib/brew-import.ts).
//
// Schema-discoverability tradeoff (MCP feedback batch 2, 2026-04-30):
// - Axes with active alias resolution (fermentation / drying / intervention /
//   decaf / signature / subprocess) stay `z.string()` so server-side aliases
//   ('Anoxic' → 'Anaerobic', 'CM' → 'Carbonic Maceration', etc.) keep working.
//   Their canonical lists are surfaced via `.describe()` for tool-introspection.
// - Axes with zero aliases (experimental_modifiers, structure_tags) tighten
//   to `z.enum()` so introspection sees the literal values + zod rejects
//   typos before they reach the server.
const baseProcess = z.enum(['Washed', 'Honey', 'Natural', 'Wet-hulled'])

// readonly arrays → z.enum tuple cast. zod v4 z.enum requires [string, ...string[]].
const experimentalModifierEnum = z.enum(EXPERIMENTAL_MODIFIERS as readonly [string, ...string[]])
const structureTagEnum = z.enum(STRUCTURE_KEYS as readonly [string, ...string[]])

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
  base_process: baseProcess.optional().nullable().describe(
    'Canonical: Washed | Honey | Natural | Wet-hulled. See `canonicals://processes` or `docs://taxonomies/processes.md` for full registry.',
  ),
  subprocess: z.string().optional().nullable().describe(
    `Honey color tier (only valid when base_process = Honey). Canonical: ${HONEY_SUBPROCESSES.join(' | ')}. Aliases also accepted (Blanco/Amarillo/Rojo/Negro). See \`canonicals://processes\`.`,
  ),
  fermentation_modifiers: z.array(z.string()).optional().nullable().describe(
    `Process modifier — fermentation axis. Canonical: ${FERMENTATION_MODIFIERS.join(' | ')}. Aliases accepted (e.g. CM → Carbonic Maceration, Cryo → Cryomaceration, "Yeast Fermentation" → Yeast Inoculated). See \`canonicals://processes\` for the full alias map.`,
  ),
  drying_modifiers: z.array(z.string()).optional().nullable().describe(
    `Process modifier — drying axis. Canonical: ${DRYING_MODIFIERS.join(' | ')}. Aliases accepted (DRD/LDE → Dark Room Dried, ASD → Anaerobic Slow Dry). See \`canonicals://processes\`.`,
  ),
  intervention_modifiers: z.array(z.string()).optional().nullable().describe(
    `Process modifier — co-ferments + infusions. Canonical: ${INTERVENTION_MODIFIERS.join(' | ')}. Aliases accepted (Coferment → Co-ferment, Infused → Infusion). See \`canonicals://processes\`.`,
  ),
  experimental_modifiers: z.array(experimentalModifierEnum).optional().nullable().describe(
    `Process modifier — experimental techniques. Strict canonical (no aliases): ${EXPERIMENTAL_MODIFIERS.join(' | ')}.`,
  ),
  decaf_modifier: z.string().optional().nullable().describe(
    `Decaffeination process. Canonical: ${DECAF_MODIFIERS.join(' | ')}. Aliases accepted (SWP → Swiss Water, MWP → Mountain Water, EA → Ethyl Acetate). See \`canonicals://processes\`.`,
  ),
  signature_method: z.string().optional().nullable().describe(
    `Proper-name proprietary technique. Canonical: ${SIGNATURE_NAMES.join(' | ')}. Aliases accepted (Moonshadow Natural / Moonshadow Washed → Moonshadow). See \`canonicals://processes\`.`,
  ),

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
  flavors: z.array(flavorChip).optional().nullable().describe(
    'Structured flavor chips. Each chip = { base: <canonical base name>, modifiers: [<up to 2 modifier names>] }. Bases (181 canonical, e.g. Blueberry, Jasmine, Earl Grey) and modifiers (43 canonical, e.g. Baked, Dried, Candied) live in `canonicals://flavors` + `docs://taxonomies/flavors.md`. Tea-base rule: when base ∈ {Tea, Black Tea, Green Tea, Earl Grey, etc.}, modifiers can include other base flavor names ("Peach Tea" → {base: "Tea", modifiers: ["Peach"]}). Aliases accepted via the canonical-registry alias map.',
  ),
  structure_tags: z.array(structureTagEnum).optional().nullable().describe(
    `Per-coffee structure descriptors as canonical "Axis:Descriptor" keys. Strict (no aliases). 29 valid keys across 7 axes (Acidity / Body / Clarity / Finish / Sweetness / Balance / Overall). Examples: "Body:Light", "Acidity:Bright", "Clarity:Transparent". Full list (sorted): ${STRUCTURE_KEYS.join(', ')}. See \`canonicals://flavors\` or \`docs://taxonomies/flavors.md#Structure Tags\`.`,
  ),
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

  // Self-roasted lineage (Sprint 2.5)
  source: z.enum(['purchased', 'self-roasted']).optional().describe(
    'Origin of the coffee. Defaults to "purchased". When "self-roasted", green_bean_id is required (cross-validated server-side).',
  ),
  green_bean_id: z.string().uuid().optional().nullable().describe(
    'FK to green_beans.id — required when source = "self-roasted". Use list_roest_inventory + push_green_bean to seed if the bean isn\'t in DB yet.',
  ),
  roast_id: z.string().uuid().optional().nullable().describe(
    'FK to roasts.id — optional even for self-roasted; links the brew to the specific roast batch (e.g. Mandela XO Batch 139).',
  ),
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
