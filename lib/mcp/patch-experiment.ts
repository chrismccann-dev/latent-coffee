import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import {
  patchExperiment,
  EXPERIMENT_PATCH_FIELDS,
  type PatchExperimentPayload,
} from '@/lib/roast-import'
import type { McpAuthContext } from '@/lib/mcp/auth'
import { withToolErrorLogging } from '@/lib/mcp/tool-wrapper'

export const patchExperimentInputSchema = {
  experiment_pk: z.string().uuid().describe(
    'PK of the experiment row to update. Distinct from `experiment_id` (the human-readable label like "MX-DEV-v1"). Get via get_bean_pipeline (returns experiments[] with id).',
  ),
  // UPSERT-key fields — patchable but rarely changed
  green_bean_id: z.string().uuid().optional().nullable(),
  experiment_id: z.string().optional().describe(
    'Human-readable label like "MX-DEV-v1" — a no-space hyphen-joined slug (typically <LOT-PREFIX>-V<n>). Patchable but rarely changed. The response echoes experiment_id in canonical_values, plus an experiment_id_format_warning when the value contains whitespace (descriptive prose belongs in additional_notes / context, not the label).',
  ),
  // Pass-through fields (mirror push_experiment)
  batch_ids: z.string().optional().nullable().describe(
    'Comma- or hyphen-separated Roest batch numbers participating in this experiment (e.g. "139, 140, 141"). Omit the field entirely to leave NULL at design time — do NOT pass the string "null" or "NULL" (those land as literal strings, not SQL NULL). log-roast.md STAGE 5 fills this in once V_n is roasted; design-time push_experiment / patch_experiment from log-cupping.md V_(n+1) design should omit.',
  ),
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
  winner: z.string().optional().nullable().describe(
    'V-set leading slot designation. Format strictly as "V<n><letter> (Batch <Roest#>)" — e.g. "V5C (Batch 189)". Free-text on the column but the response echoes a format_valid signal in canonical_values.winner_format_warning when the value diverges from that shape (anything past the slot identifier should land in additional_notes instead, per log-cupping.md STAGE 3).',
  ),
  key_insight: z.string().optional().nullable(),
  key_insight_confidence: z
    .enum(['Low', 'Medium', 'Medium-High', 'High'])
    .optional()
    .nullable()
    .describe(
      'Hypothesis confidence on key_insight (operational ladder, apply consistently across sessions): Low = interesting hypothesis, single-V-set observation, not yet replicated, flag in the log but do not act yet. Medium = consistent with 1-2 prior data points (this lot\'s earlier V-sets or a closely-similar prior lot\'s carry-forward), worth weighting in V_(n+1) design but not promotion-ready. Medium-High = strong evidence within this lot, ready to be a working assumption for the rest of the lot\'s V-sets + similar-cultivar carry-forward, survives "what would change my mind?" prompting. High = ready to promote to a protocol change in ROASTING.md (typically requires multi-V-set repetition within this lot OR strong cross-lot corroboration). If unsure between two levels, pick the lower and explain why in additional_notes.',
    ),
  what_changes_going_forward: z.string().optional().nullable(),
  open_questions: z.string().optional().nullable().describe('What this experiment did NOT answer - distinct from what_changes_going_forward. Round-4 dogfood (2026-05-11).'),
  additional_notes: z.string().optional().nullable().describe('Free-text catch-all for operator-framing prose that does not fit observed_outcome_* / key_insight. Round-4 dogfood (2026-05-11).'),
  // Sub Pages 6.1 (migration 052, 2026-05-13) — 16 cross-batch fields.
  // See docs/roasting/redesign.md § 4.2 for write-moment rationale.
  updated_cup_prediction_a: z.string().optional().nullable().describe('Post-roast cup prediction for batch A (between roast and cupping). Sub Pages 6.1.'),
  updated_cup_prediction_b: z.string().optional().nullable(),
  updated_cup_prediction_c: z.string().optional().nullable(),
  updated_cup_prediction_d: z.string().optional().nullable(),
  taste_for_a: z.string().optional().nullable().describe('Cupping-table question for batch A. Sub Pages 6.1.'),
  taste_for_b: z.string().optional().nullable(),
  taste_for_c: z.string().optional().nullable(),
  taste_for_d: z.string().optional().nullable(),
  delta_from_roast_a: z.string().optional().nullable().describe('Post-roast reconciliation vs recipe predictions, batch A. Sub Pages 6.1.'),
  delta_from_roast_b: z.string().optional().nullable(),
  delta_from_roast_c: z.string().optional().nullable(),
  delta_from_roast_d: z.string().optional().nullable(),
  delta_from_cup_a: z.string().optional().nullable().describe(
    'Post-cupping reconciliation for batch A — compare against experiments.updated_cup_prediction_a if populated, else fall back to design-time roast_recipes.predicted_cup for the matching recipe row. Sub Pages 6.1.',
  ),
  delta_from_cup_b: z.string().optional().nullable(),
  delta_from_cup_c: z.string().optional().nullable(),
  delta_from_cup_d: z.string().optional().nullable(),
}

export function registerPatchExperimentTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'patch_experiment',
    {
      title: 'Patch Experiment',
      description:
        'Update / save / record / push field-level changes to an existing experiment by experiment_pk (the primary-key path). The companion INSERT path of the same domain UPSERTs by composite (green_bean_id, experiment_id) — that covers the iterative-design path; this Tool uses the PK so you can correct the experiment_id label itself or fix prose typos in observed_outcome_* / key_insight without composite-key matching. Field-level mutation: only fields you EXPLICITLY supply are updated; omitted fields are untouched. To find experiment_pk: call get_bean_pipeline (returns experiments[] with id keyed by experiment_id). 16 cross-batch fields per Sub Pages 6.1 (migration 052) — four families: updated_cup_prediction_a/b/c/d (post-roast), taste_for_a/b/c/d (cupping-table prep), delta_from_roast_a/b/c/d (vs recipe predictions), delta_from_cup_a/b/c/d (vs updated_cup_prediction_* if populated, else vs roast_recipes.predicted_cup). Returns { experiment_pk, updated_fields: [...], canonical_values? } — updated_fields echoes which columns landed; canonical_values echoes the values of enum-validated and format-checked fields (key_insight_confidence + winner + batch_ids + experiment_id, plus a sibling *_format_warning when a format-checked value diverges: winner from "V<n><letter> (Batch <Roest#>)", batch_ids from comma/hyphen-separated Roest numbers, experiment_id from a no-space hyphen-joined slug). canonical_values is OMITTED entirely from the response when no echo-tracked field was supplied — treat it as optional. Co-owned by Cupping Specialist (cup-side closure — delta_from_cup_* / winner / key_insight + key_insight_confidence / what_changes_going_forward / open_questions / additional_notes) + Roast Recorder (roast-side closure at log-roast STAGE 5 — observed_outcome_* / delta_from_roast_* / updated_cup_prediction_* / taste_for_*) per ADR-0011.',
      inputSchema: patchExperimentInputSchema,
    },
    withToolErrorLogging('patch_experiment', async (input) => {
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
      // Round-7 dogfood (2026-05-12): also echo the VALUES of enum-validated
      // fields. The updated_fields[] array tells the caller WHICH columns
      // landed; canonical_values tells them WHAT enum-vocabulary value the
      // server received. Small-vocab fields like key_insight_confidence
      // benefit from level confirmation - "Medium" landing as "Medium" (not
      // "medium" or "med") is worth surfacing without a follow-up read.
      // Cleanup-actions PR (Round-1 #7): omit canonical_values entirely
      // when no enum-validated field was touched - dropping the empty {}
      // keeps response payloads lean. The shape stays `{ ...values? }` so
      // consumers must treat the field as optional.
      const canonical_values: Record<string, unknown> = {}
      if (payloadObj.key_insight_confidence !== undefined) {
        canonical_values.key_insight_confidence = payloadObj.key_insight_confidence
      }
      // Cleanup-actions PR (Round-3 #7 + Round-6 #9): winner is free-text
      // but log-cupping.md STAGE 3 mandates the "V<n><letter> (Batch <N>)"
      // format. Echo the value back so callers can confirm what landed;
      // surface a format_warning when the value diverges from the slot-id
      // shape (verdict prose past the slot id should go to additional_notes).
      if (payloadObj.winner !== undefined && payloadObj.winner !== null) {
        const winnerStr = String(payloadObj.winner)
        canonical_values.winner = winnerStr
        // Slot id: V<digits><A-D> (Batch <digits>). Case-insensitive on V/letter.
        const WINNER_FORMAT_RE = /^V\d+[A-D] \(Batch \d+\)$/i
        if (winnerStr !== '' && !WINNER_FORMAT_RE.test(winnerStr)) {
          canonical_values.winner_format_warning = `Expected "V<n><letter> (Batch <Roest#>)" per log-cupping.md STAGE 3. Got: "${winnerStr}". Verdict prose beyond the slot identifier belongs in additional_notes.`
        }
      }
      // Cleanup-actions (Round-17 block2 #1 / 2026-06-04): extend the
      // accept-and-warn shape to the other free-string fields that carry a
      // canonical format. Same pattern as winner — accept the value, echo it,
      // surface a non-blocking *_format_warning when it diverges so prose lands
      // in the right field. batch_ids is comma/hyphen-separated Roest numbers;
      // experiment_id is a no-space hyphen-joined slug (e.g. "MX-DEV-v1").
      if (payloadObj.batch_ids !== undefined && payloadObj.batch_ids !== null) {
        const batchStr = String(payloadObj.batch_ids)
        canonical_values.batch_ids = batchStr
        // Digits separated by comma / hyphen / whitespace only.
        const BATCH_IDS_FORMAT_RE = /^\d+(\s*[,\-–—]\s*\d+)*$/
        if (batchStr !== '' && !BATCH_IDS_FORMAT_RE.test(batchStr)) {
          canonical_values.batch_ids_format_warning = `Expected comma- or hyphen-separated Roest batch numbers (e.g. "139, 140, 141"). Got: "${batchStr}". Non-numeric prose belongs in additional_notes.`
        }
      }
      if (payloadObj.experiment_id !== undefined && payloadObj.experiment_id !== null) {
        const expStr = String(payloadObj.experiment_id)
        canonical_values.experiment_id = expStr
        // Hyphen-joined label, no whitespace (e.g. "MX-DEV-v1").
        const EXPERIMENT_ID_FORMAT_RE = /^\S+$/
        if (expStr !== '' && !EXPERIMENT_ID_FORMAT_RE.test(expStr)) {
          canonical_values.experiment_id_format_warning = `Expected a no-space hyphen-joined label (e.g. "MX-DEV-v1"). Got: "${expStr}". Descriptive prose belongs in additional_notes / context.`
        }
      }
      const out: {
        experiment_pk: string
        updated_fields: typeof updated_fields
        canonical_values?: Record<string, unknown>
      } = {
        experiment_pk: result.experiment_pk,
        updated_fields,
      }
      if (Object.keys(canonical_values).length > 0) {
        out.canonical_values = canonical_values
      }
      return {
        content: [{ type: 'text', text: JSON.stringify(out) }],
        structuredContent: out,
      }
    }),
  )
}
