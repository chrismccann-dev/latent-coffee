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
  key_insight_confidence: z
    .enum(['Low', 'Medium', 'Medium-High', 'High'])
    .optional()
    .nullable()
    .describe(
      'Hypothesis confidence on key_insight. Mirrors the Cross-Coffee Insight Layer pattern in ROASTING.md - High = ready to promote to a protocol change; Medium-High = strong but warrants another lot to confirm; Medium = directional, not yet generalizable; Low = early signal worth flagging but not relying on. Round-4 dogfood (2026-05-11): structuring this lets downstream queries filter "what insights are High confidence" without parsing inline prose markers.',
    ),
  what_changes_going_forward: z.string().optional().nullable().describe(
    'What changes about the next experiment / next bean / general approach as a result. Lessons-applied-forward only - park "what we still don\'t know" in open_questions instead.',
  ),
  open_questions: z.string().optional().nullable().describe(
    'What this experiment did NOT answer. Round-4 dogfood (2026-05-11): separated from what_changes_going_forward to avoid conflating lessons-applied-forward with open-questions-for-next-iteration. The Higuito V1->V2 transition surfaced the gap - V1 had three open questions, two were design-relevant for V2 and one wasn\'t; structured separation makes the V-to-V transition crisp.',
  ),
  additional_notes: z.string().optional().nullable().describe(
    'Free-text catch-all for operator-framing observations and tasting prose that does not fit the structured outcome / insight fields. Examples: "almost like opposite ends of the spectrum" cup framings, narrow-roast-window hypotheses, cup-vs-structure tension narratives. Round-4 dogfood (2026-05-11): keeps observed_outcome_a/b/c/d and key_insight tight rather than bloated with prose.',
  ),
}

export function registerPushExperimentTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'push_experiment',
    {
      title: 'Push Experiment',
      description:
        'Log / save / update / record / push a roasting experiment (A/B/C/D batch comparison) — UPSERTs on (user_id, green_bean_id, experiment_id). Same experiment_id pushed twice updates the existing row — supports the iterative shape where experiment design lands first, then outcomes / winner / key_insight populate as batches resolve at Day 7. Three Round-4 (2026-05-11) free-text additions live alongside the structured fields: additional_notes (operator-framing prose that does not fit observed_outcome_*), open_questions (what this experiment did NOT answer - distinct from what_changes_going_forward), and key_insight_confidence (Low / Medium / Medium-High / High). Returns { experiment_pk, created }.',
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
