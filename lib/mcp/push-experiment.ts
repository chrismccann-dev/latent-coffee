import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { persistExperiment, type ExperimentPayload } from '@/lib/roast-import'
import type { McpAuthContext } from '@/lib/mcp/auth'

// push_experiment — UPSERT on (user_id, green_bean_id, experiment_id).
// Experiments iterate as observations land — first push at experiment design,
// subsequent pushes update outcomes / winner / key_insight as the A/B/C/D
// batches resolve.

export const pushExperimentInputSchema = {
  green_bean_id: z.string().uuid().describe('FK to green_beans.id.'),
  experiment_id: z.string().describe(
    'Stable experiment identifier (e.g. "MX-DEV-v1", "MX-FAN-CURVE-v1"). UPSERT key alongside green_bean_id — same identifier updates the existing row.',
  ),
  batch_ids: z.string().optional().nullable().describe(
    'Comma- or hyphen-separated Roest batch numbers participating in this experiment (e.g. "139, 140, 141").',
  ),
  context: z.string().optional().nullable().describe('What prompted this experiment.'),
  primary_question: z.string().optional().nullable().describe('What the experiment is asking.'),
  control_baseline: z.string().optional().nullable(),
  shared_constants: z.string().optional().nullable().describe('What was held constant across batches.'),
  variable_changed: z.string().optional().nullable().describe('The single variable being tested.'),
  levels_tested: z.string().optional().nullable().describe('A/B/C levels of the variable.'),
  expected_outcomes: z.string().optional().nullable(),
  failure_boundary: z.string().optional().nullable().describe(
    'What "broken" looks like — the cup descriptors that mean the experiment failed regardless of which batch wins.',
  ),
  observed_outcome_a: z.string().optional().nullable(),
  observed_outcome_b: z.string().optional().nullable(),
  observed_outcome_c: z.string().optional().nullable(),
  observed_outcome_d: z.string().optional().nullable().describe('Optional 4th level (used when 4-batch sessions are run).'),
  winner: z.string().optional().nullable().describe('Which batch / level won at Day 7 pourover.'),
  key_insight: z.string().optional().nullable().describe('What this experiment taught — Chris\'s post-hoc framing.'),
  what_changes_going_forward: z.string().optional().nullable().describe(
    'What changes about the next experiment / next bean / general approach as a result.',
  ),
}

export function registerPushExperimentTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'push_experiment',
    {
      title: 'Push Experiment',
      description:
        'UPSERTs an experiment row keyed on (user_id, green_bean_id, experiment_id). Same experiment_id pushed twice updates the existing row — supports the iterative shape where experiment design lands first, then outcomes / winner / key_insight populate as batches resolve at Day 7. Returns experiment_pk + created flag (true on first push, false on update).',
      inputSchema: pushExperimentInputSchema,
    },
    async (input) => {
      const payload = input as ExperimentPayload
      const result = await persistExperiment(auth.supabase, auth.userId, payload)
      if (!result.ok) {
        if (result.code === 'validation') {
          throw new Error(`Validation failed:\n${result.errors.map((e) => `  - ${e}`).join('\n')}`)
        }
        throw new Error(`Database error: ${result.message}`)
      }
      const out = { experiment_pk: result.experiment_pk, created: result.created }
      return {
        content: [{ type: 'text', text: JSON.stringify(out) }],
        structuredContent: out,
      }
    },
  )
}
