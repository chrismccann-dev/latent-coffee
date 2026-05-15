import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { persistRoastLearnings, type RoastLearningsPayload } from '@/lib/roast-import'
import type { McpAuthContext } from '@/lib/mcp/auth'
import { withToolErrorLogging } from '@/lib/mcp/tool-wrapper'

// push_roast_learnings — UPSERT on (user_id, green_bean_id). One row per closed
// bean, filled at lot close-out. The 17 structured fields mirror the
// "Overall Lessons (Per Bean)" sheet of the roasting spreadsheet.
//
// Distinct from propose_doc_changes against ROASTING.md: this Tool fills the
// structured DB row that /green/[id] renders; propose_doc_changes adds prose
// narrative to ROASTING.md § Recently Closed Lots / Cross-Coffee Insight Layer
// for claude.ai's roasting project to consume as living context.

export const pushRoastLearningsInputSchema = {
  green_bean_id: z.string().uuid().describe('FK to green_beans.id. UPSERT key — pushing twice for the same bean updates the row.'),
  // Sub Pages 6.1 (migration 052, 2026-05-13): typed FK to the winning roast.
  // Preferred over best_batch_id going forward; best_batch_id stays as
  // free-text back-compat through Phase 3.
  best_roast_id: z.string().uuid().optional().nullable().describe(
    'FK to roasts.id — the winning roast execution. Sub Pages 6.1 (2026-05-13) addition. Preferred over best_batch_id; populate both during the transition for back-compat. Get via the roasts://by-bean/{green_bean_id} Resource (returns roasts[] with id keyed by batch_id).',
  ),
  best_batch_id: z.string().optional().nullable().describe('Free-text reference roast batch number (e.g. "133", "Batch 139"). Legacy; prefer best_roast_id (typed FK).'),
  why_this_roast_won: z.string().optional().nullable().describe('What about this batch made it the lot winner.'),
  aromatic_behavior: z.string().optional().nullable().describe('How aromatics behaved across the lot (when they peak, what suppresses them, what amplifies).'),
  structural_behavior: z.string().optional().nullable().describe('Body / acidity / sweetness behavior across the lot.'),
  elasticity: z.string().optional().nullable().describe('How well the roast responds to brewing variation. V4: "Roast for elasticity, brew for intensity."'),
  roast_window_width: z.string().optional().nullable().describe('"Narrow" | "Moderate" | "Wide" — how forgiving the roast window is.'),
  primary_lever: z.string().optional().nullable().describe('The single variable that mattered most for this lot.'),
  secondary_levers: z.string().optional().nullable(),
  what_didnt_move_needle: z.string().optional().nullable().describe('Variables tested that didn\'t materially affect the cup, and why.'),
  underdevelopment_signal: z.string().optional().nullable().describe('What "underdeveloped" tasted like for this lot — the diagnostic signal to watch for.'),
  overdevelopment_signal: z.string().optional().nullable(),
  cultivar_takeaway: z.string().optional().nullable().describe('What this lot taught about the cultivar generally.'),
  general_takeaway: z.string().optional().nullable().describe('What this lot taught about roasting generally / cross-coffee patterns.'),
  reference_roasts: z.string().optional().nullable().describe('Which batches to keep in mind for replication / comparison.'),
  starting_hypothesis: z.string().optional().nullable().describe('Hypothesis for the next similar coffee — what to start from.'),
  rest_behavior: z.string().optional().nullable().describe('How rest evolves the cup — Day 4 vs 7 vs 10+ patterns.'),
}

export function registerPushRoastLearningsTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'push_roast_learnings',
    {
      title: 'Push Roast Learnings',
      description:
        'Log / save / record / push the per-bean roast lessons row at lot close-out — one row per closed bean. UPSERTs the structured "Overall Lessons (Per Bean)" 17-col shape keyed on (user_id, green_bean_id) — re-pushing the same green_bean_id updates the existing row. Distinct from propose_doc_changes against ROASTING.md — this Tool fills the structured DB table that /green/[id] renders; propose_doc_changes adds prose narrative to the living roasting reference doc. Returns { roast_learnings_id, created } where created=true on first push, false on update. **One-shot lot constraint (migration 054, 2026-05-15)**: when the parent green_beans row has is_one_shot=true, the lever-attribution fields (primary_lever / secondary_levers / roast_window_width / elasticity / what_didnt_move_needle / underdevelopment_signal / overdevelopment_signal) MUST be NULL. These fields require cross-batch evidence (variable→lever attribution across V_n slots); one-shot lots have N=1 and cannot populate them. Populated fields trigger a validation error with a specific message per field. Move that prose to cultivar_takeaway / general_takeaway / starting_hypothesis with explicit "Low confidence - N=1, verify on next similar lot" prefix per docs/prompts/one-shot-closeout.md.',
      inputSchema: pushRoastLearningsInputSchema,
    },
    withToolErrorLogging('push_roast_learnings', async (input) => {
      const payload = input as RoastLearningsPayload
      const result = await persistRoastLearnings(auth.supabase, auth.userId, payload)
      if (!result.ok) {
        if (result.code === 'validation') {
          throw new Error(`Validation failed:\n${result.errors.map((e) => `  - ${e}`).join('\n')}`)
        }
        throw new Error(`Database error: ${result.message}`)
      }
      const out = { roast_learnings_id: result.roast_learnings_id, created: result.created }
      return {
        content: [{ type: 'text', text: JSON.stringify(out) }],
        structuredContent: out,
      }
    }),
  )
}
