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
  // aromatic_behavior + structural_behavior REMOVED Sprint 11 (migration 062, 2026-05-20) per ADR-0008.
  // They relocated to cuppings.aromatic_behavior + cuppings.structural_behavior because they describe
  // what a cup IS (per-tasting observation), not what a lot TAUGHT. Push via push_cupping / patch_cupping.
  brewing_tolerance: z.string().optional().nullable().describe('How well the cup holds up when brewing variables are pushed toward extremes (Full Expression / Suppression / Extraction Push / etc.). High = cup stays coherent across a wide brew range; Low = cup falls in on itself when pushed. Distinct from acceptable roast window (roast_window_width) which captures latitude on the roast side. Renamed from "elasticity" in Sprint 10 (migration 060, 2026-05-19) per ADR-0007 to remove the ambiguous-polarity physics metaphor.'),
  roast_window_width: z.string().optional().nullable().describe('"Narrow" | "Moderate" | "Wide" — how forgiving the acceptable roast window is (the range of primary-lever values that keep the cup in the desired zone). Distinct from brewing_tolerance which captures latitude on the brew side. UI renders this as "Acceptable Roast Window".'),
  primary_lever: z.string().optional().nullable().describe('The single variable that mattered most for this lot.'),
  secondary_levers: z.string().optional().nullable(),
  what_didnt_move_needle: z.string().optional().nullable().describe('Variables tested that didn\'t materially affect the cup, and why.'),
  underdevelopment_signal: z.string().optional().nullable().describe('What "underdeveloped" tasted like for this lot — the diagnostic signal to watch for.'),
  overdevelopment_signal: z.string().optional().nullable(),
  cultivar_takeaway: z.string().optional().nullable().describe('What this lot taught about the cultivar generally.'),
  terroir_takeaway: z.string().optional().nullable().describe('What this lot taught about the terroir generally (country / admin region / macro terroir patterns). Populatable on one-shot lots (terroir attribution does not require cross-batch evidence the way primary_lever does). Added Sprint 10 (migration 060, 2026-05-19) to close the missing carry-forward axis in CONTEXT.md § Carry-forward learnings.'),
  general_takeaway: z.string().optional().nullable().describe('What this lot taught about roasting generally / cross-coffee patterns.'),
  reference_roasts: z.string().optional().nullable().describe('Which batches to keep in mind for replication / comparison.'),
  starting_hypothesis: z.string().optional().nullable().describe('Hypothesis for the next similar coffee — what to start from.'),
  rest_behavior: z.string().optional().nullable().describe('How rest evolves the cup — Day 4 vs 7 vs 10+ patterns.'),
  // Sprint 12 (migration 064, 2026-05-21): per-field scope_tags arrays. ADR-0009.
  // Loose-canonical prefix convention; write paths do NOT enforce.
  cultivar_takeaway_scope_tags: z.array(z.string()).optional().describe(
    'Loose-canonical scope tags for cultivar_takeaway. Sub-scopes within the cultivar axis when the lesson only applies under specific conditions — e.g. ["process:washed"] when the takeaway is "Sudan Rume aromatic vocabulary holds at washed but not at natural." Convention: namespaced prefixes (process:washed / process:xo-fermented / variety:gesha-1931 / altitude:high / country:colombia / terroir:macro:huila / evaluation_method:day-7-pourover / density:high). Default [] when the takeaway applies broadly across the cultivar. See ADR-0009.',
  ),
  terroir_takeaway_scope_tags: z.array(z.string()).optional().describe(
    'Loose-canonical scope tags for terroir_takeaway. Sub-scopes within the terroir axis — e.g. ["altitude:high","process:washed"] when the terroir lesson only holds for high-altitude washed lots in this country/region. Default [] when broad. See ADR-0009.',
  ),
  general_takeaway_scope_tags: z.array(z.string()).optional().describe(
    'Loose-canonical scope tags for general_takeaway. Cross-axis scoping — e.g. ["process:xo-fermented"] for "shaped fan curve mandatory for heavy-ferment under counterflow", or ["evaluation_method:day-4-cupping"] for "Day 4 cupping misleads on delicate aromatics." Use tag "general" for genuinely-universal principles ("Fix the RoR shape before varying any other lever"). See ADR-0009.',
  ),
  starting_hypothesis_scope_tags: z.array(z.string()).optional().describe(
    'Loose-canonical scope tags for starting_hypothesis. Defines which future similar-lot pattern should consume this hypothesis on STAGE 1 carry-forward search — e.g. ["variety:typica-mejorado","process:honey","altitude:high"] makes the hypothesis surface for the queued Cruz Loma TM Honey one-shot. Default [] when broadly applicable. See ADR-0009.',
  ),
}

export function registerPushRoastLearningsTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'push_roast_learnings',
    {
      title: 'Push Roast Learnings',
      description:
        'Log / save / record / push the per-bean roast lessons row at lot close-out — one row per closed bean. UPSERTs the structured "Overall Lessons (Per Bean)" 18-col shape keyed on (user_id, green_bean_id) — re-pushing the same green_bean_id updates the existing row. Distinct from propose_doc_changes against ROASTING.md — this Tool fills the structured DB table that /green/[id] renders; propose_doc_changes adds prose narrative to the living roasting reference doc. Returns { roast_learnings_id, created } where created=true on first push, false on update. **One-shot lot constraint (migration 054, 2026-05-15)**: when the parent green_beans row has is_one_shot=true, the lever-attribution fields (primary_lever / secondary_levers / roast_window_width / brewing_tolerance / what_didnt_move_needle / underdevelopment_signal / overdevelopment_signal) MUST be NULL. These fields require cross-batch evidence (variable→lever attribution across V_n slots); one-shot lots have N=1 and cannot populate them. Populated fields trigger a validation error with a specific message per field. Move that prose to cultivar_takeaway / terroir_takeaway / general_takeaway / starting_hypothesis with explicit "Low confidence - N=1, verify on next similar lot" prefix per docs/prompts/one-shot-closeout.md. **Schema notes (Sprint 10, migration 060, 2026-05-19)**: column `elasticity` renamed to `brewing_tolerance` (workflow-language fix per ADR-0007); column `terroir_takeaway` added (closes missing carry-forward axis — populatable on one-shot lots, NOT subject to the lever-attribution constraint). **Sprint 11 (migration 062, 2026-05-20)**: columns `aromatic_behavior` + `structural_behavior` REMOVED per ADR-0008 — relocated to `cuppings.aromatic_behavior` / `cuppings.structural_behavior` because they describe a per-tasting observation (what a cup IS), not a lot-level lesson (what a lot TAUGHT). Push them via `push_cupping` (or `patch_cupping`) on the canonical pourover cupping for the reference roast. **Sprint 12 (migration 064, 2026-05-21)**: 4 new `*_scope_tags text[]` columns paired to the carry-forward fields (cultivar / terroir / general / starting_hypothesis). Loose-canonical prefix convention (`process:washed` / `variety:sudan-rume` / `country:colombia` / etc.) — write paths do NOT enforce; prompts capture. Use to make cross-lot queries reliable ("which takeaways apply to washed Colombians?") rather than scraping prose. See ADR-0009 + close-lot.md STAGE 3 + one-shot-closeout.md STAGE 4 for the capture convention. Owned by Close-Lot Specialist per ADR-0011.',
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
