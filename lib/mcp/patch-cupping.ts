import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { patchCupping, type PatchCuppingPayload } from '@/lib/roast-import'
import type { McpAuthContext } from '@/lib/mcp/auth'

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
  body: z.string().optional().nullable(),
  finish: z.string().optional().nullable(),
  overall: z.string().optional().nullable(),
}

export function registerPatchCuppingTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'patch_cupping',
    {
      title: 'Patch Cupping',
      description:
        'Update / save / record / push field-level changes to an existing cupping evaluation by composite key (roast_id + cupping_date + eval_method + recipe_variant — the migration 041 NULLS NOT DISTINCT key from push_cupping). Sibling of push_cupping (for new evaluations); push_cupping returns `created:false` without overwriting fields on conflict, so this Tool closes the prose-typo / numeric-correction path (R29 from the MCP feedback log). Use this for fixes to aroma / flavor / acidity / body / finish / overall prose or numeric ground_agtron / rest_days. Field-level mutation: only fields you EXPLICITLY supply are updated; omitted fields are untouched. NULL matches NULL on the composite key (NULLS NOT DISTINCT) — single-cupping rows look up cleanly with recipe_variant: null. To find cupping rows: call get_bean_pipeline (returns cuppings[] with the composite-key fields).',
      inputSchema: patchCuppingInputSchema,
    },
    async (input) => {
      const result = await patchCupping(auth.supabase, auth.userId, input as PatchCuppingPayload)
      if (!result.ok) {
        if (result.code === 'validation') {
          throw new Error(`Validation failed:\n${result.errors.map((e) => `  - ${e}`).join('\n')}`)
        }
        if (result.code === 'no_op') throw new Error(result.message)
        if (result.code === 'not_found') throw new Error(result.message)
        throw new Error(`Database error: ${result.message}`)
      }
      const out = { cupping_id: result.cupping_id }
      return {
        content: [{ type: 'text', text: JSON.stringify(out) }],
        structuredContent: out,
      }
    },
  )
}
