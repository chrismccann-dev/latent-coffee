import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { patchCupping, CUPPING_PATCH_FIELDS, type PatchCuppingPayload } from '@/lib/roast-import'
import type { McpAuthContext } from '@/lib/mcp/auth'
import { withToolErrorLogging } from '@/lib/mcp/tool-wrapper'

// patch_cupping (Sprint 2.6) — composite-key lookup mirroring the
// migration-041 NULLS NOT DISTINCT unique constraint on
// (user_id, roast_id, cupping_date, eval_method, recipe_variant).

export const patchCuppingInputSchema = {
  // Composite-key lookup fields (required to identify the row)
  roast_id: z.string().uuid().describe('FK to roasts.id — part of the composite lookup key.'),
  cupping_date: z.string().nullable().describe(
    'YYYY-MM-DD or null. Part of the composite lookup key (NULLS NOT DISTINCT — null matches null).',
  ),
  eval_method: z.string().nullable().describe(
    '"Cupping" | "Pourover" | "Espresso" | etc., or null. Part of the composite lookup key.',
  ),
  recipe_variant: z.string().nullable().describe(
    'Free-text variant label (e.g. "xbloom_gate", "balanced_intensity_pourover") or null. Part of the composite lookup key (migration 041). NULL matches NULL on the composite key — patching a single-cupping row leaves recipe_variant unset.',
  ),
  // Pass-through fields (mirror push_cupping)
  rest_days: z.number().int().optional().nullable(),
  ground_agtron: z.number().optional().nullable(),
  ground_color_description: z.string().optional().nullable(),
  aroma: z.string().optional().nullable(),
  flavor: z.string().optional().nullable(),
  acidity: z.string().optional().nullable(),
  sweetness: z.string().optional().nullable().describe(
    'Distinct prose axis from acidity / body / overall (migration 046, 2026-05-07 — surfaced via MCP in Schema sprint S3, 2026-05-18). See push_cupping for examples.',
  ),
  body: z.string().optional().nullable(),
  finish: z.string().optional().nullable(),
  overall: z.string().optional().nullable(),
  temperature_behavior: z.string().optional().nullable().describe(
    'Parallel to brews.temperature_evolution (migration 046, 2026-05-07 — surfaced via MCP in Schema sprint S3). Direction + when + what changes prose across the cooling arc.',
  ),
  // Sprint 11 RO-6 (migration 062, 2026-05-20) — character relocation from roast_learnings per ADR-0008.
  aromatic_behavior: z.string().optional().nullable().describe(
    'How aromatics present in time and intensity for THIS cup. See push_cupping.aromatic_behavior for the full per-tasting framing + the ADR-0008 relocation rationale.',
  ),
  structural_behavior: z.string().optional().nullable().describe(
    'Shape and balance of acidity, body, finish, separate from flavor. See push_cupping.structural_behavior.',
  ),
  wb_agtron: z.number().optional().nullable().describe(
    'Whole-bean Agtron override (Schema sprint S1, migration 055, 2026-05-18). RARE — normally auto-snapshot from joined roasts.agtron at push_cupping time. Use this only when the source roast row was patched post-cupping (Agtron re-measured days later, etc.) and you want to realign the cupping snapshot. wb_to_ground_delta is a generated column on (wb_agtron - ground_agtron) — it updates automatically.',
  ),
}

export function registerPatchCuppingTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'patch_cupping',
    {
      title: 'Patch Cupping',
      description:
        'Update / save / record / push field-level changes to an existing cupping evaluation by composite key (roast_id + cupping_date + eval_method + recipe_variant — the migration 041 NULLS NOT DISTINCT key from push_cupping). Sibling of push_cupping (for new evaluations); push_cupping returns `created:false` without overwriting fields on conflict, so this Tool closes the prose-typo / numeric-correction path (R29 from the MCP feedback log). Use this for fixes to the 10 prose fields (aroma / flavor / acidity / sweetness / body / finish / overall / temperature_behavior / aromatic_behavior / structural_behavior — last two relocated from roast_learnings in Sprint 11 / migration 062 / ADR-0008) or numeric ground_agtron / rest_days. wb_agtron override is available for the rare post-hoc Agtron re-measurement case (normally auto-snapshot at push_cupping). Field-level mutation: only fields you EXPLICITLY supply are updated; omitted fields are untouched. NULL matches NULL on the composite key (NULLS NOT DISTINCT) — single-cupping rows look up cleanly with recipe_variant: null. To find cupping rows: call get_bean_pipeline (returns cuppings[] with the composite-key fields). Returns { cupping_id, updated_fields: [...] } — updated_fields echoes which columns landed in the patch (mirrors patch_inventory + patch_experiment pattern). Owned by Cupping Specialist per ADR-0011.',
      inputSchema: patchCuppingInputSchema,
    },
    withToolErrorLogging('patch_cupping', async (input) => {
      const payload = input as PatchCuppingPayload
      const result = await patchCupping(auth.supabase, auth.userId, payload)
      if (!result.ok) {
        if (result.code === 'validation') {
          throw new Error(`Validation failed:\n${result.errors.map((e) => `  - ${e}`).join('\n')}`)
        }
        if (result.code === 'no_op') throw new Error(result.message)
        if (result.code === 'not_found') throw new Error(result.message)
        throw new Error(`Database error: ${result.message}`)
      }
      // Echo the diff. Round-5 dogfood symmetry sweep (2026-05-10).
      const payloadObj = payload as unknown as Record<string, unknown>
      const updated_fields = CUPPING_PATCH_FIELDS.filter(
        (k) => k in payloadObj && payloadObj[k] !== undefined,
      )
      const out = { cupping_id: result.cupping_id, updated_fields }
      return {
        content: [{ type: 'text', text: JSON.stringify(out) }],
        structuredContent: out,
      }
    }),
  )
}
