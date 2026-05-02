import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { persistCupping, type CuppingPayload } from '@/lib/roast-import'
import type { McpAuthContext } from '@/lib/mcp/auth'

// push_cupping — single cupping evaluation insert. roast_id is required (FK).
// V4 evaluation protocol is Day 7 pourover — this Tool captures both Day 4
// table cupping (catastrophic-defect screen) and Day 7+ pourover sessions.

export const pushCuppingInputSchema = {
  roast_id: z.string().uuid().describe('FK to roasts.id. Use push_roast first if the batch isn\'t in DB.'),
  cupping_date: z.string().optional().nullable().describe('YYYY-MM-DD.'),
  rest_days: z.number().int().optional().nullable().describe('Days from roast to cupping. V4 evaluation gate: Day 7.'),
  eval_method: z.string().optional().nullable().describe('"Cupping" | "Pourover" | "Espresso" | etc. V4: Day 7 pourover is the only evaluation gate.'),
  recipe_variant: z.string().optional().nullable().describe(
    'OPTIONAL free-text label distinguishing two evaluations on the same (roast_id, cupping_date, eval_method) - the dual-cupping pattern (e.g. xbloom-gate cupping + Balanced-Intensity pourover on the same Day 7 for the same roast). Migration 041 (MCP feedback batch 8). Common labels: "xbloom_gate", "balanced_intensity_pourover", "extraction_push", "full_expression". Leave NULL when only one evaluation per (roast/date/method) exists - the unique constraint uses NULLS NOT DISTINCT so the single-cupping idempotency case still works. Free-text by design; canonicalize later if patterns stabilize.',
  ),
  ground_agtron: z.number().optional().nullable().describe(
    'Ground Agtron pre-brew (Lightcells CM-200). Pair with roasts.agtron for WB-to-Ground delta — V4 primary internal-development signal (target ≤3 points).',
  ),
  ground_color_description: z.string().optional().nullable(),
  aroma: z.string().optional().nullable(),
  flavor: z.string().optional().nullable(),
  acidity: z.string().optional().nullable(),
  body: z.string().optional().nullable(),
  finish: z.string().optional().nullable(),
  overall: z.string().optional().nullable().describe('Overall impression / verdict prose.'),
}

export function registerPushCuppingTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'push_cupping',
    {
      title: 'Push Cupping',
      description:
        'Log / record / save / push / archive a cupping evaluation (Day 7 post-roast pourover or Day 4 table cupping) — STAGE 4 of the self-roasted roasting pipeline; runs after push_roast for each batch you cup. UPSERT semantics on (user_id, roast_id, cupping_date, eval_method, recipe_variant): safe to re-push during mid-iteration syncs - when a row already exists with the same composite key, the existing cupping_id is returned with `created: false` and field values are NOT overwritten (use the app /add or /edit UI to update notes on an existing cupping). The optional recipe_variant field lets you push TWO evaluations on the same (roast_id, date, method) for the dual-cupping workflow (e.g. xbloom-gate cupping + Balanced-Intensity pourover on the same Day 7) — set distinct recipe_variant labels per row. When only one evaluation per (roast/date/method) exists, leave recipe_variant NULL (the constraint uses NULLS NOT DISTINCT so single-cupping idempotency still works). Captures eval_method (Cupping vs Pourover), rest_days (V4 evaluation gate is Day 7), ground_agtron (paired with roasts.agtron for WB-to-Ground delta), and the 6 prose fields (aroma / flavor / acidity / body / finish / overall). Requires roast_id from a prior push_roast.',
      inputSchema: pushCuppingInputSchema,
    },
    async (input) => {
      const payload = input as CuppingPayload
      const result = await persistCupping(auth.supabase, auth.userId, payload)
      if (!result.ok) {
        if (result.code === 'validation') {
          throw new Error(`Validation failed:\n${result.errors.map((e) => `  - ${e}`).join('\n')}`)
        }
        throw new Error(`Database error: ${result.message}`)
      }
      const out = { cupping_id: result.cupping_id, created: result.created }
      return {
        content: [{ type: 'text', text: JSON.stringify(out) }],
        structuredContent: out,
      }
    },
  )
}
