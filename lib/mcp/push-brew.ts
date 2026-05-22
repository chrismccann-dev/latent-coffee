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
import { HYBRID_SUBFORMS } from '@/lib/hybrid-subform'
import type { McpAuthContext } from '@/lib/mcp/auth'
import { withToolErrorLogging } from '@/lib/mcp/tool-wrapper'

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

// Shared describe-suffix for the four modifier-array axes. composeProcess
// (lib/process-registry.ts) sorts each modifier array alphabetically before
// emitting the display string, so callers don't need to pre-order.
const MODIFIER_ORDER_NOTE =
  "Order doesn't affect storage or composition — composeProcess sorts each modifier array alphabetically before producing the display string."

// readonly arrays → z.enum tuple cast. zod v4 z.enum requires [string, ...string[]].
const experimentalModifierEnum = z.enum(EXPERIMENTAL_MODIFIERS as readonly [string, ...string[]])
const structureTagEnum = z.enum(STRUCTURE_KEYS as readonly [string, ...string[]])
// Extraction strategy is a strict 6-value enum with zero aliases — same shape as
// structure_tags (was 5 pre-v8.4; Hybrid promoted 2026-05-06). Tightening to
// z.enum lets tool-introspection see the canonical list directly. Within-strategy
// gradient ("lower edge of Balanced Intensity") goes in strategy_notes;
// cross-strategy divergence ("planned Balanced, drank like Suppression") goes
// in extraction_confirmed.
const extractionStrategyEnum = z.enum(EXTRACTION_STRATEGIES as readonly [string, ...string[]])
// v8.4: conditional sub-form when extraction_strategy = 'Hybrid'. Required when
// strategy is Hybrid; must be null otherwise. Server-side cross-field check in
// validateBrewPayload (lib/brew-import.ts) — zod can't express the conditional
// across sibling fields without .superRefine, kept simple.
const hybridSubformEnum = z.enum(HYBRID_SUBFORMS as readonly [string, ...string[]])

const flavorChip = z.object({
  base: z.string(),
  modifiers: z.array(z.string()).default([]),
})

const modifierEntry = z.object({
  // v8.4 (2026-05-06): MODIFIER_TYPES dropped from 4 -> 3. Immersion was absorbed
  // into the Hybrid strategy via hybrid_subform; sending modifier.type='immersion'
  // now fails validation with a hint pointing at extraction_strategy='Hybrid'.
  // v8.5 (2026-05-08): MODIFIER_TYPES grew 3 -> 4 with `role_based_pulse` (per-pour
  // sensory roles on percolation-only brewers). OUTPUT_SELECTION_FORMS grew 3 -> 4
  // with `dilution` (post-brew dilution; carries optional `dilution_g`).
  type: z.enum(['output_selection', 'inverted_temperature_staging', 'aroma_capture', 'role_based_pulse']),
  // type-specific subfields (the discriminated union is hand-validated in cleanModifiers)
  form: z.enum(['early_cut', 'late_cut', 'both', 'dilution']).optional(),
  brew_weight: z.number().optional().nullable(),
  cup_yield: z.number().optional().nullable(),
  dilution_g: z.number().optional().nullable(),
  notes: z.string().optional().nullable(),
  phases: z.string().optional().nullable(),
  application: z.string().optional().nullable(),
  roles: z.string().optional().nullable(),
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
  cultivar_name: z.string().describe(
    'Canonical cultivar name (e.g. "Gesha", "Pink Bourbon", "Mokka", "Sudan Rume"). Resolves via CULTIVAR_LOOKUP — bare canonical name is sufficient; species / genetic_family / lineage auto-populate from the registry on insert. Aliases also resolve ("Geisha" → "Gesha", "Green-Tip Gesha" → "Gesha"). Strict canonical: no `cultivar_override` flag exists; net-new cultivars require a registry edit (docs/taxonomies/varieties.md + lib/cultivar-registry.ts) before the brew can land. Inspect via `read_canonical(axis="cultivars")`.',
  ),
  species: z.string().optional().nullable().describe(
    'OPTIONAL — auto-populates from CULTIVAR_LOOKUP when cultivar_name resolves. Set explicitly only when you need to override the registry derivation, which is rare.',
  ),
  genetic_family: z.string().optional().nullable().describe(
    'OPTIONAL — auto-populates from CULTIVAR_LOOKUP. Same caveat as species.',
  ),
  lineage: z.string().optional().nullable().describe(
    'OPTIONAL — auto-populates from CULTIVAR_LOOKUP. Same caveat as species.',
  ),
})

export const pushBrewInputSchema = {
  // Identity
  coffee_name: z.string().describe('Coffee marketing name (e.g. "Emerald PL#015").'),
  roaster: z.string().describe(
    'When in doubt, use the roaster name as it appears on the bag - alias resolution will canonicalize it ("Hydrangea Coffee Roasters" -> "Hydrangea Coffee"). For genuinely net-new roasters not in the registry, set `roaster_override: true` to persist verbatim. Inspect the canonical list via `read_canonical(axis="roasters")` or `docs://taxonomies/roasters.md`.',
  ),
  roaster_override: z.boolean().optional().describe(
    'Set true to bypass canonical-roaster validation for legitimately net-new roasters. Persists verbatim; the registry will need a deliberate edit before the next brew from this roaster matches canonical.',
  ),
  producer: z.string().optional().nullable().describe(
    'Producer / farm. Convention: "Person, Farm" or canonical farm name. Resolves via PRODUCER_LOOKUP (~120 canonicals + alias map; tier-scoped, ~60-70% coverage). Inspect via `read_canonical(axis="producers")` or `docs://taxonomies/producers.md`. For net-new, set `producer_override: true`.',
  ),
  producer_override: z.boolean().optional().describe(
    'Set true to bypass canonical-producer validation for legitimately net-new producers. Persists verbatim. NOTE: there is currently no async research routine — promoting an overridden producer to canonical requires a deliberate edit to docs/taxonomies/producers.md + lib/producer-registry.ts. Until that edit lands, every brew with this producer name will need `producer_override: true` again.',
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
    `Process modifier — fermentation axis. Canonical: ${FERMENTATION_MODIFIERS.join(' | ')}. Aliases accepted (e.g. CM → Carbonic Maceration, Cryo → Cryomaceration, "Yeast Fermentation" → Yeast Inoculated). See \`canonicals://processes\` for the full alias map. ${MODIFIER_ORDER_NOTE}`,
  ),
  fermentation_qualifiers: z.array(z.string()).optional().nullable().describe(
    'Orthogonal annotations on a fermentation modifier — e.g. `Anoxic` on `Anaerobic` (sealed-container, no-headspace execution). Record-when-known, NOT a strategy-decision layer: aggregation stays at the modifier (Anaerobic), not the qualifier (Anoxic). Canonical: Anoxic. Aliases accepted (No Oxygen / Zero O2 / Oxygen Free → Anoxic). Populate alongside fermentation_modifiers when the producer documents fully-sealed no-headspace execution; leave empty (default) when the producer says only "Anaerobic" without qualifier detail. See `docs://taxonomies/processes.md` § Qualifiers + `canonicals://processes` for the full alias map.',
  ),
  drying_modifiers: z.array(z.string()).optional().nullable().describe(
    `Process modifier — drying axis. Canonical: ${DRYING_MODIFIERS.join(' | ')}. Aliases accepted (DRD/LDE → Dark Room Dried, ASD → Anaerobic Slow Dry). See \`canonicals://processes\`. ${MODIFIER_ORDER_NOTE}`,
  ),
  intervention_modifiers: z.array(z.string()).optional().nullable().describe(
    `Process modifier — co-ferments + infusions. Canonical: ${INTERVENTION_MODIFIERS.join(' | ')}. Aliases accepted (Coferment → Co-ferment, Infused → Infusion). See \`canonicals://processes\`. ${MODIFIER_ORDER_NOTE}`,
  ),
  experimental_modifiers: z.array(experimentalModifierEnum).optional().nullable().describe(
    `Process modifier — experimental techniques. Strict canonical (no aliases): ${EXPERIMENTAL_MODIFIERS.join(' | ')}. ${MODIFIER_ORDER_NOTE}`,
  ),
  decaf_modifier: z.string().optional().nullable().describe(
    `Decaffeination process. Canonical: ${DECAF_MODIFIERS.join(' | ')}. Aliases accepted (SWP → Swiss Water, MWP → Mountain Water, EA → Ethyl Acetate). See \`canonicals://processes\`.`,
  ),
  signature_method: z.string().optional().nullable().describe(
    `Proper-name proprietary technique. Canonical: ${SIGNATURE_NAMES.join(' | ')}. Aliases accepted (Moonshadow Natural / Moonshadow Washed → Moonshadow). See \`canonicals://processes\`. For genuinely net-new signatures (Alchemy, TIM, Enzyflow, etc.) not yet in the registry, set \`signature_method_override: true\` to persist verbatim and queue a row in \`taxonomy_overrides_queue\` for arbiter review.`,
  ),
  signature_method_override: z.boolean().optional().describe(
    'Set true to bypass canonical-signature_method validation for legitimately net-new proprietary processes. Persists the raw value verbatim and inserts a row in `taxonomy_overrides_queue` (axis="signature_method") for Chris-as-arbiter to promote / alias / reject. Mirrors `producer_override`. NOTE: until the arbiter lands the registry edit (`lib/process-registry.ts` SIGNATURE_METHODS + `docs/taxonomies/processes.md`), every brew with this signature name will need `signature_method_override: true` again. Sprint 12 / MCP-1 (2026-05-21, migration 063).',
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
    `Strict canonical 6-value enum (v8.4 — Hybrid promoted 2026-05-06): ${EXTRACTION_STRATEGIES.join(' | ')}. Five describe extraction intensity (single-mode logic running throughout); Hybrid describes extraction structure (phase boundaries where the brewer changes mode). When set to 'Hybrid', \`hybrid_subform\` is required. Within-strategy gradient ("lower edge of Balanced Intensity") goes in \`strategy_notes\`. Cross-strategy divergence ("planned Balanced, drank like Suppression") goes in \`extraction_confirmed\`.`,
  ),
  hybrid_subform: hybridSubformEnum.optional().nullable().describe(
    `Conditional sub-form, REQUIRED when extraction_strategy='Hybrid', null otherwise. Canonical 5-value enum (v8.4): ${HYBRID_SUBFORMS.join(' | ')}. See \`canonicals://hybrid-subforms\` or \`docs://brewing.md#Axis 1 - Extraction Strategy\` for sub-form descriptions. Mapping: sequential = "immersion phase then percolation, each does one job" (canonical Switch + SWORKS slow/slow/open); phase_mapped = "each pour has explicit sensory target"; selective_bloom = "bloom liquid separated"; intensity_clarity_split = "immersion builds body then percolation recovers clarity"; temperature_staged = "phase boundaries coincide with temp changes".`,
  ),
  extraction_confirmed: z.string().optional().nullable().describe(
    'Free-text. Set ONLY when the planned extraction_strategy diverged from what was tasted in the cup (cross-strategy correction signal: planned Balanced, drank like Suppression). Leave null when the planned strategy delivered. NOTE: the framework-default-vs-executed-vs-confirmed reshape (Phase 2 #R49 - splitting framework_default for the Process/Variety table prediction out of this field) is deferred to its own sprint. For now, do NOT use this field to record framework-default divergence - keep that nuance in `strategy_notes` until the schema reshape lands.',
  ),
  strategy_notes: z.string().optional().nullable().describe(
    'Free-text within-strategy gradient + miscellaneous recipe nuance that does NOT fit the canonical extraction_strategy enum. Use for "lower edge of Balanced Intensity", "leaning toward Suppression", or recipe-context that the 6-value enum + extraction_confirmed (cross-strategy divergence) cannot capture. Distinct from `classification` (lot code + roast date stash).',
  ),
  cooling_curve_target: z.string().optional().nullable().describe(
    'v8.4 named consideration. Free-text. Default null = normal cooling progression (the answer for most brews). Populated when peak evaluation window IS the strategy (e.g. "40-45°C peak", "evaluate below 50°C"). Surfaces a previously-implicit decision at brief time so iteration starts in the right window rather than discovering it on brew 2. Most relevant on El Paraíso lots, Garrido Mokka/Mokkita, anaerobic naturals, and other coffees where the cup integrates well below 50°C.',
  ),
  modifiers: z.array(modifierEntry).optional().nullable().describe(
    'Axis 2 - extraction modifiers (Output Selection / Inverted Temperature Staging / Aroma Capture / Role-Based Pulse). Optional + stackable. v8.4 (2026-05-06): the Immersion modifier was absorbed into the Hybrid strategy — sending modifier.type="immersion" fails validation; use extraction_strategy="Hybrid" with hybrid_subform set instead. v8.5 (2026-05-08): MODIFIER_TYPES grew 3 -> 4 with `role_based_pulse` (per-pour sensory roles on percolation-only brewers — V60 / Orea / Kalita; if the recipe involves immersion, classify under Hybrid (Phase-Mapped) instead). OUTPUT_SELECTION_FORMS grew 3 -> 4 with `dilution` (post-brew dilution; carries optional `dilution_g` numeric sub-field). Per-type sub-fields: output_selection={form,brew_weight?,cup_yield?,dilution_g?,notes?}, inverted_temperature_staging={phases?}, aroma_capture={application?}, role_based_pulse={roles?}. Persistence equivalence: `[]`, `null`, and omitted are all stored as the empty array (cleanModifiers() normalizes; the column never holds null). Send `[]` to be explicit that modifiers were considered and rejected, or omit when there\'s nothing to say.',
  ),

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
        'INSERT / CREATE / log / submit / archive / record a NEW brew row into the brews table — the primary write path for finished brews completing the brewing pipeline (start-brew session → in-thread iteration → bundled-brewing-completion finalize). Use to write a brew that does not yet exist in the database; use patch_brew (different Tool) to mutate fields on a brew that already exists. Validates every field against canonical registries (cultivars / terroirs / processes / roasters / producers / brewers / filters / flavors / structure_tags / extraction_strategy / etc.). FK resolution behavior is asymmetric per axis: terroir lazy find-or-creates a row for new (admin_region, macro_terroir, meso_terroir) combinations whose macro_terroir is ALREADY in the canonical registry — but macro_terroir itself is strict-canonical with no terroir_override path (net-new macros require `propose_canonical_addition(axis: "terroir")` + a separate registry edit before they resolve); cultivar lazy find-or-creates similarly with cultivar_name strict-canonical. For text-only canonical axes (roaster / producer / brewer / filter / grinder), `*_override: true` accepts net-new entities and queues them via `taxonomy_overrides_queue`. ALL validation errors return aggregated in one response (no fail-fast), so a payload with multiple problems gets the full list back in a single retry round. Returns brew_id + per-field resolution metadata (which FKs were newly created, which canonicals matched). For canonical lookup before drafting the payload, call list_canonicals + read_canonical. Owned by Brew Recorder per ADR-0011.',
      inputSchema: pushBrewInputSchema,
    },
    withToolErrorLogging('push_brew', async (input) => {
      const payload: BrewPayload = {
        ...input,
        coffee_name: input.coffee_name,
        roaster: input.roaster,
        terroir: input.terroir,
        cultivar: input.cultivar,
      } as BrewPayload

      // Sprint 2.6 — opts param is no-op now (strict-canonical model has no
      // confirm-new flow). persistBrew always routes terroir/cultivar through
      // findOrCreate* which fail-fast on non-canonical input.
      const result = await persistBrew(auth.supabase, auth.userId, payload)

      if (!result.ok) {
        if (result.code === 'validation') {
          // Validation errors aggregate (Sprint 2.4.3). All failing fields are
          // reported together so the caller can fix everything in ONE retry
          // round instead of N. Two distinct hint surfaces:
          //   - text-only canonicals (roaster / producer / brewer / filter /
          //     grinder) → suggest *_override flag for genuinely net-new entries
          //   - terroir / cultivar → strict, no override; suggest the registry
          //     edit path (Sprint 2.6 closed the override path on FK tables)
          const hasOverridable = result.errors.some(
            (e) => /\b(roaster|producer|brewer|filter|grinder|signature_method)\b.*not in the canonical/i.test(e),
          )
          const hasRegistryGap = result.errors.some(
            (e) => /registry gap|cultivar.*not in the canonical|macro terroir.*not in the canonical/i.test(e),
          )
          const hints: string[] = []
          if (hasOverridable) {
            hints.push(
              'For genuinely net-new entities (roaster / producer / brewer / filter / grinder / signature_method), re-send with the matching `*_override: true` flag (e.g. `producer_override: true` or `signature_method_override: true`).',
            )
          }
          if (hasRegistryGap) {
            hints.push(
              'Terroir and cultivar are strict-canonical (no override). To add a new entry, edit `docs/taxonomies/regions.md` + `lib/terroir-registry.ts` (or `varieties.md` + `lib/cultivar-registry.ts`) and redeploy before pushing.',
            )
          }
          const hint = hints.length ? '\n\nHint:\n  - ' + hints.join('\n  - ') : ''
          throw new Error(`Validation failed:\n${result.errors.map((e) => `  - ${e}`).join('\n')}${hint}`)
        }
        if (result.code === 'db_error') {
          throw new Error(`Database error: ${result.message}`)
        }
        throw new Error(`Unknown persistBrew failure: ${JSON.stringify(result)}`)
      }

      // Response shape (Sprint 2.4.3 — was {brew_id, terroir_id, cultivar_id,
      // created_terroir, created_cultivar} only):
      // - `warnings` is a stable empty-by-default array; future soft-issue signals
      //   land here without changing the response shape (e.g. "structure_tags
      //   includes both Body:Silky and Body:Light — consider whether one supersedes
      //   the other").
      // - `created_with_overrides` echoes which fields used the *_override flag on
      //   this push (Phase 2 #R47). Empty array when no overrides were used.
      //   Confirms the override path was taken without requiring a re-query.
      // - For full canonical-resolution detail (which input alias canonicalized to
      //   what), fetch the inserted brew via the `brews://by-id/{brew_id}` Resource
      //   (or the upcoming `query_brews` Tool) — round-tripping through the DB
      //   guarantees the response matches what was actually persisted.
      const overridable: Array<keyof typeof input> = [
        'roaster_override',
        'producer_override',
        'brewer_override',
        'filter_override',
        'grinder_override',
        // Sprint 12 / MCP-1 (2026-05-21, migration 063): signature_method joins.
        'signature_method_override',
      ]
      const created_with_overrides = overridable
        .filter((key) => input[key] === true)
        .map((key) => key.replace(/_override$/, ''))
      // Phase 3 (#R47): queued_for_taxonomy_review echoes the queue rows
      // inserted post-brew-insert by Site A hooks. Empty array when no
      // overrides were applied or every overridden value resolved canonically.
      // Each entry: { axis, raw_value, queue_id }. Confirms the queue picked
      // up the override without requiring a list_taxonomy_queue follow-up.
      const responsePayload = {
        brew_id: result.brewId,
        terroir_id: result.terroirId,
        cultivar_id: result.cultivarId,
        created_terroir: result.createdTerroir,
        created_cultivar: result.createdCultivar,
        created_with_overrides,
        queued_for_taxonomy_review: result.queuedForTaxonomyReview,
        warnings: [] as string[],
      }
      return {
        content: [{ type: 'text', text: JSON.stringify(responsePayload) }],
        structuredContent: responsePayload,
      }
    }),
  )
}
