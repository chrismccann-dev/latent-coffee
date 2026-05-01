import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { EXTRACTION_STRATEGIES, persistBrew, type BrewPayload } from '@/lib/brew-import'
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
// Extraction strategy is a strict 5-value enum with zero aliases — same shape as
// structure_tags. Tightening to z.enum lets tool-introspection see the canonical
// list directly. Within-strategy gradient ("lower edge of Balanced Intensity")
// goes in strategy_notes; cross-strategy divergence ("planned Balanced, drank
// like Suppression") goes in extraction_confirmed.
const extractionStrategyEnum = z.enum(EXTRACTION_STRATEGIES as readonly [string, ...string[]])

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
  roaster: z.string().describe(
    'Canonical roaster name. Resolves via ROASTER_LOOKUP — alias inputs auto-canonicalize ("Hydrangea Coffee Roasters" → "Hydrangea Coffee"). Inspect via `read_canonical(axis="roasters")` or `docs://taxonomies/roasters.md`. For net-new roasters not in the registry, set `roaster_override: true` to persist verbatim.',
  ),
  roaster_override: z.boolean().optional().describe(
    'Set true to bypass canonical-roaster validation for legitimately net-new roasters. Persists verbatim; the registry will need a deliberate edit before the next brew from this roaster matches canonical.',
  ),
  producer: z.string().optional().nullable().describe(
    'Producer / farm. Convention: "Person, Farm" or canonical farm name. Resolves via PRODUCER_LOOKUP (~120 canonicals + alias map; tier-scoped, ~60-70% coverage). Inspect via `read_canonical(axis="producers")` or `docs://taxonomies/producers.md`. For net-new, set `producer_override: true`.',
  ),
  producer_override: z.boolean().optional().describe(
    'Set true to bypass canonical-producer validation for legitimately net-new producers. Persists verbatim; queues for the producer-research routine (Sprint 2.6) which proposes a registry entry async.',
  ),

  // Origin (FK targets)
  terroir,
  cultivar,
  variety: z.string().optional().nullable().describe('Legacy compat — use cultivar.cultivar_name.'),

  // Process
  process: z.string().optional().nullable().describe(
    'Composed display string ("Natural · Anaerobic · Yeast Inoculated"). Server-side `composeProcess(structured)` recomputes this from base_process + the modifier arrays on every save, so when structured fields are supplied this field is OPTIONAL and any value here is overwritten by the recomposed form. Use only as a back-compat path or sanity-check echo.',
  ),
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
  roast_level: z.string().optional().nullable().describe(
    'Roast level. Resolves via ROAST_LEVEL_LOOKUP — 8 Agtron-anchored canonical buckets (Extremely Light → Very Dark) + 22 aliases (marketing tags like Nordic Light / Specialty Light alias to objective buckets). Strict; no override. Inspect via `read_canonical(axis="roast-levels")`. Omit when the bag does not state a roast level — house-style inferences belong on the roaster card, not on the brew row.',
  ),

  // Recipe
  brewer: z.string().optional().nullable().describe(
    'Brewer / dripper. Resolves via BREWER_LOOKUP (46 canonicals, 24 aliases). Inspect via `read_canonical(axis="brewers")` or `docs://taxonomies/brewers.md`. For net-new, set `brewer_override: true`.',
  ),
  brewer_override: z.boolean().optional().describe(
    'Set true to bypass canonical-brewer validation for legitimately net-new brewers. Persists verbatim.',
  ),
  filter: z.string().optional().nullable().describe(
    'Filter paper. Resolves via FILTER_LOOKUP (64 canonicals, 34 aliases). Pair-aware on some bare names (e.g. "Sibarist FAST" maps to FLAT/CONE/UFO FAST depending on brewer). Inspect via `read_canonical(axis="filters")` or `docs://taxonomies/filters.md`. For net-new, set `filter_override: true`.',
  ),
  filter_override: z.boolean().optional().describe(
    'Set true to bypass canonical-filter validation for legitimately net-new filters. Persists verbatim.',
  ),
  grinder: z.string().optional().nullable().describe(
    'Grinder. Resolves via GRINDER_LOOKUP (currently only EG-1 + aliases; not comprehensive — captures only what Chris owns). Inspect via `read_canonical(axis="grinders")`. For other grinders, set `grinder_override: true`.',
  ),
  grinder_override: z.boolean().optional().describe(
    'Set true to bypass canonical-grinder validation for legitimately net-new grinders. Persists verbatim.',
  ),
  grind: z.string().optional().nullable().describe(
    'Legacy denormalized "EG-1 6.5". Server-side `composeGrind(grinder, grind_setting)` recomputes this on save when both structured fields are supplied — when you supply structured `grinder` + `grind_setting`, OMIT this field; any value here is overwritten by the recomposed form.',
  ),
  grind_setting: z.string().optional().nullable().describe(
    'Strict canonical setting value for the supplied grinder. EG-1 has 51 valid settings (3.0-8.0 in 0.1 steps). Server validates via `isResolvableSetting(grinder, setting)`. If you set `grinder_override: true`, this field is unvalidated.',
  ),
  dose_g: z.number().optional().nullable(),
  water_g: z.number().optional().nullable(),
  ratio: z.string().optional().nullable(),
  temp_c: z.number().optional().nullable(),
  bloom: z.string().optional().nullable(),
  pour_structure: z.string().optional().nullable(),
  total_time: z.string().optional().nullable(),

  // Extraction
  extraction_strategy: extractionStrategyEnum.optional().nullable().describe(
    `Strict canonical 5-value enum: ${EXTRACTION_STRATEGIES.join(' | ')}. Within-strategy gradient ("lower edge of Balanced Intensity") goes in \`strategy_notes\`. Cross-strategy divergence ("planned Balanced, drank like Suppression") goes in \`extraction_confirmed\`.`,
  ),
  extraction_confirmed: z.string().optional().nullable().describe(
    'Free-text. Set ONLY when the planned extraction_strategy diverged from what was tasted in the cup. Cross-strategy correction signal. Leave null when the planned strategy delivered. (See SYNC_V2 logged follow-up #5 — semantic re-spec deferred to Sprint 2.7.)',
  ),
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
  flavor_notes: z.array(z.string()).optional().nullable().describe(
    'Legacy display strings ("Blueberry (Baked)"). When `flavors[]` structured form is supplied, the server composes `flavor_notes` from it — OMIT this field on the structured path; any value here is overwritten.',
  ),
  aroma: z.string().optional().nullable(),
  attack: z.string().optional().nullable(),
  mid_palate: z.string().optional().nullable(),
  body: z.string().optional().nullable(),
  finish: z.string().optional().nullable(),
  temperature_evolution: z.string().optional().nullable(),
  peak_expression: z.string().optional().nullable(),
  what_i_learned: z.string().optional().nullable().describe(
    'Free-text prose summary of the brew lesson — narrative, conversational. Distinct from `key_takeaways` (bulleted, testable rules). Both are persisted; pick the one that matches the shape of the insight, or split between them when both apply (prose narrative + 2-4 bullets).',
  ),

  // Flags + extras
  is_process_dominant: z.boolean().optional().describe(
    'Set true when process (e.g. yeast inoculation, thermal shock, anaerobic fermentation) is overriding typical varietal expression in the cup. Aggregation pages weight this signal when surfacing "this coffee is a process showcase, not a variety showcase." Default false.',
  ),
  classification: z.string().optional().nullable().describe(
    'Free-text lot code + roast date stash until structured fields land (lot_code / roast_date / roast_machine — architectural follow-up tracked in MCP feedback log). Use for things like "899 N-NS, roasted 2026-04-12, S7X" until the dedicated columns ship.',
  ),
  key_takeaways: z.array(z.string()).optional().nullable().describe(
    'Bulleted, testable rules learned from this brew (4-6 short bullets typical). Distinct from `what_i_learned` (free-text prose). Both persisted; surface in the brew detail UI as a takeaways block.',
  ),
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
        'Log / submit / save / archive / record a brew to the app — the primary write path for finished brews. Inserts a resolved brew row into the brews table; validates every field against canonical registries (cultivars / terroirs / processes / roasters / producers / brewers / filters / flavors / structure_tags / extraction_strategy / etc.); FK-resolves terroir + cultivar via lazy find-or-create. ALL validation errors return aggregated in one response (no fail-fast), so a payload with multiple problems gets the full list back in a single retry round. Returns brew_id + per-field resolution metadata (which FKs were newly created, which canonicals matched). For canonical lookup before drafting the payload, call list_canonicals + read_canonical.',
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
          // Validation errors now aggregate (Sprint 2.4.3 — was fail-fast). All
          // failing fields are reported together so the caller can fix every-
          // thing in ONE retry round instead of N. Append the override-hint when
          // the failure looks like a missing canonical.
          const hint = result.errors.some((e) => /not in the canonical|not canonical/.test(e))
            ? '\n\nHint: For genuinely net-new entities (roaster / producer / brewer / filter / grinder), re-send with the matching `*_override: true` flag (e.g. `producer_override: true`).'
            : ''
          throw new Error(`Validation failed:\n${result.errors.map((e) => `  - ${e}`).join('\n')}${hint}`)
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

      // Response shape (Sprint 2.4.3 — was {brew_id, terroir_id, cultivar_id,
      // created_terroir, created_cultivar} only):
      // - `warnings` is a stable empty-by-default array; future soft-issue signals
      //   land here without changing the response shape (e.g. "structure_tags
      //   includes both Body:Silky and Body:Light — consider whether one supersedes
      //   the other").
      // - For full canonical-resolution detail (which input alias canonicalized to
      //   what), fetch the inserted brew via the `brews://by-id/{brew_id}` Resource
      //   (or the upcoming `query_brews` Tool) — round-tripping through the DB
      //   guarantees the response matches what was actually persisted.
      const responsePayload = {
        brew_id: result.brewId,
        terroir_id: result.terroirId,
        cultivar_id: result.cultivarId,
        created_terroir: result.createdTerroir,
        created_cultivar: result.createdCultivar,
        warnings: [] as string[],
      }
      return {
        content: [{ type: 'text', text: JSON.stringify(responsePayload) }],
        structuredContent: responsePayload,
      }
    },
  )
}
