import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { persistExperiment, type ExperimentPayload } from '@/lib/roast-import'
import type { McpAuthContext } from '@/lib/mcp/auth'
import { withToolErrorLogging } from '@/lib/mcp/tool-wrapper'

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
  // Sub Pages 6.1 (migration 052, 2026-05-13). See docs/roasting/redesign.md
  // § 4.2 for the four-write-moments rationale. All 16 fields are optional;
  // populated at distinct workflow stages per the lifecycle:
  //   - design time           → recipe (predicted_cup on roast_recipes)
  //   - post-roast            → experiments.updated_cup_prediction_*
  //   - cupping table prep    → experiments.taste_for_*
  //   - post-roast review     → experiments.delta_from_roast_*
  //   - post-cupping review   → experiments.delta_from_cup_*
  // Legacy observed_outcome_a-d + expected_outcomes stay populated through
  // Phase 3 — semantic relabel deferred.
  updated_cup_prediction_a: z.string().optional().nullable().describe(
    'Post-roast cup prediction for batch A — written between roast and cupping once roast actuals are in. The original design-time prediction stays frozen on roast_recipes.predicted_cup for diff later.',
  ),
  updated_cup_prediction_b: z.string().optional().nullable(),
  updated_cup_prediction_c: z.string().optional().nullable(),
  updated_cup_prediction_d: z.string().optional().nullable(),
  taste_for_a: z.string().optional().nullable().describe(
    'Cupping-table question for batch A — what to actively listen for in this cup (e.g. "Does v3a cup match v2b memory? If yes → reference candidate."). Sets up the post-cupping delta cleanly.',
  ),
  taste_for_b: z.string().optional().nullable(),
  taste_for_c: z.string().optional().nullable(),
  taste_for_d: z.string().optional().nullable(),
  delta_from_roast_a: z.string().optional().nullable().describe(
    'Post-roast reconciliation for batch A — what worked vs didn\'t relative to recipe predictions. Compare against roast_recipes.predicted_fc_temp / predicted_total_time / predicted_agtron_wb.',
  ),
  delta_from_roast_b: z.string().optional().nullable(),
  delta_from_roast_c: z.string().optional().nullable(),
  delta_from_roast_d: z.string().optional().nullable(),
  delta_from_cup_a: z.string().optional().nullable().describe(
    'Post-cupping reconciliation for batch A — what the cup actually was vs the updated_cup_prediction. Surfaces in the resolved-view "Roasting Learnings" synthesis.',
  ),
  delta_from_cup_b: z.string().optional().nullable(),
  delta_from_cup_c: z.string().optional().nullable(),
  delta_from_cup_d: z.string().optional().nullable(),
}

export function registerPushExperimentTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'push_experiment',
    {
      title: 'Push Experiment',
      description:
        'Log / save / update / record / push a roasting experiment (A/B/C/D batch comparison) — UPSERTs on (user_id, green_bean_id, experiment_id). Same experiment_id pushed twice updates the existing row — supports the iterative shape where experiment design lands first, then outcomes / winner / key_insight populate as batches resolve at Day 7. Three Round-4 (2026-05-11) free-text additions live alongside the structured fields: additional_notes, open_questions, and key_insight_confidence (Low / Medium / Medium-High / High). Sub Pages 6.1 (2026-05-13, migration 052) adds 16 cross-batch fields covering 4 temporal write moments per docs/roasting/redesign.md § 4.2: updated_cup_prediction_a/b/c/d (post-roast, before cupping), taste_for_a/b/c/d (cupping-table questions), delta_from_roast_a/b/c/d (reconciliation vs recipe predictions), delta_from_cup_a/b/c/d (reconciliation vs updated cup prediction). Legacy observed_outcome_a-d + expected_outcomes stay populated through Phase 3. Returns { experiment_pk, created }.',
      inputSchema: pushExperimentInputSchema,
    },
    withToolErrorLogging('push_experiment', async (input) => {
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
    }),
  )
}
