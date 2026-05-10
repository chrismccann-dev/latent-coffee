import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import {
  patchExperiment,
  EXPERIMENT_PATCH_FIELDS,
  type PatchExperimentPayload,
} from '@/lib/roast-import'
import type { McpAuthContext } from '@/lib/mcp/auth'

export const patchExperimentInputSchema = {
  experiment_pk: z.string().uuid().describe(
    'PK of the experiment row to update. Distinct from `experiment_id` (the human-readable label like "MX-DEV-v1"). Get via get_bean_pipeline (returns experiments[] with id).',
  ),
  // UPSERT-key fields — patchable but rarely changed
  green_bean_id: z.string().uuid().optional().nullable(),
  experiment_id: z.string().optional(),
  // Pass-through fields (mirror push_experiment)
  batch_ids: z.string().optional().nullable(),
  context: z.string().optional().nullable(),
  primary_question: z.string().optional().nullable(),
  control_baseline: z.string().optional().nullable(),
  shared_constants: z.string().optional().nullable(),
  variable_changed: z.string().optional().nullable(),
  levels_tested: z.string().optional().nullable(),
  expected_outcomes: z.string().optional().nullable(),
  failure_boundary: z.string().optional().nullable(),
  observed_outcome_a: z.string().optional().nullable(),
  observed_outcome_b: z.string().optional().nullable(),
  observed_outcome_c: z.string().optional().nullable(),
  observed_outcome_d: z.string().optional().nullable(),
  winner: z.string().optional().nullable(),
  key_insight: z.string().optional().nullable(),
  key_insight_confidence: z
    .enum(['Low', 'Medium', 'Medium-High', 'High'])
    .optional()
    .nullable()
    .describe('Hypothesis confidence on key_insight: Low / Medium / Medium-High / High. Round-4 dogfood (2026-05-11).'),
  what_changes_going_forward: z.string().optional().nullable(),
  open_questions: z.string().optional().nullable().describe('What this experiment did NOT answer - distinct from what_changes_going_forward. Round-4 dogfood (2026-05-11).'),
  additional_notes: z.string().optional().nullable().describe('Free-text catch-all for operator-framing prose that does not fit observed_outcome_* / key_insight. Round-4 dogfood (2026-05-11).'),
}

export function registerPatchExperimentTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'patch_experiment',
    {
      title: 'Patch Experiment',
      description:
        'Update / save / record / push field-level changes to an existing experiment by experiment_pk. Sibling of push_experiment — push_experiment UPSERTs by composite (green_bean_id, experiment_id) so the iterative-design path is well covered, but patch_experiment uses the PK so you can correct the experiment_id label itself or fix prose typos in observed_outcome_* / key_insight without composite-key matching. Field-level mutation: only fields you EXPLICITLY supply are updated; omitted fields are untouched. To find experiment_pk: call get_bean_pipeline (returns experiments[] with id keyed by experiment_id). Returns { experiment_pk, updated_fields: [...] } — updated_fields echoes which columns landed in the patch so you can sanity-check without a follow-up read (mirrors patch_inventory pattern).',
      inputSchema: patchExperimentInputSchema,
    },
    async (input) => {
      const payload = input as PatchExperimentPayload
      const result = await patchExperiment(auth.supabase, auth.userId, payload)
      if (!result.ok) {
        if (result.code === 'validation') {
          throw new Error(`Validation failed:\n${result.errors.map((e) => `  - ${e}`).join('\n')}`)
        }
        if (result.code === 'no_op') throw new Error(result.message)
        if (result.code === 'not_found') throw new Error(result.message)
        throw new Error(`Database error: ${result.message}`)
      }
      // Echo the diff so the caller can sanity-check which fields landed
      // without a follow-up get_bean_pipeline read. Mirrors patch_inventory's
      // updated_fields pattern. Round-5 dogfood (2026-05-10).
      const payloadObj = payload as unknown as Record<string, unknown>
      const updated_fields = EXPERIMENT_PATCH_FIELDS.filter(
        (k) => k in payloadObj && payloadObj[k] !== undefined,
      )
      const out = { experiment_pk: result.experiment_pk, updated_fields }
      return {
        content: [{ type: 'text', text: JSON.stringify(out) }],
        structuredContent: out,
      }
    },
  )
}
