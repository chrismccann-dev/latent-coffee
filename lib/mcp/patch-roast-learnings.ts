import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import {
  patchRoastLearnings,
  ROAST_LEARNINGS_PATCH_FIELDS,
  type PatchRoastLearningsPayload,
} from '@/lib/roast-import'
import type { McpAuthContext } from '@/lib/mcp/auth'
import { withToolErrorLogging, echoUpdatedFields, throwToolFail, toolJson } from '@/lib/mcp/tool-wrapper'

export const patchRoastLearningsInputSchema = {
  roast_learnings_id: z.string().uuid().describe(
    'PK of the roast_learnings row to update (one row per closed bean). Get via get_bean_pipeline (returns roast_learnings.id).',
  ),
  // UPSERT-key — patchable but rarely changed
  green_bean_id: z.string().uuid().optional().nullable(),
  // Pass-through fields (mirror push_roast_learnings)
  best_batch_id: z.string().optional().nullable().describe('Legacy free-text; prefer best_roast_id.'),
  // Sub Pages 6.1 (migration 052, 2026-05-13)
  best_roast_id: z.string().uuid().optional().nullable().describe(
    'Typed FK to roasts.id — the winning roast execution. Sub Pages 6.1 addition; preferred over best_batch_id going forward.',
  ),
  why_this_roast_won: z.string().optional().nullable(),
  // aromatic_behavior + structural_behavior REMOVED Sprint 11 (migration 062, 2026-05-20) per ADR-0008.
  // Relocated to cuppings.{aromatic,structural}_behavior. Use patch_cupping for prose corrections.
  brewing_tolerance: z.string().optional().nullable().describe('Renamed from "elasticity" in Sprint 10 (migration 060, 2026-05-19) per ADR-0007. How well the cup holds up when brewing variables are pushed toward extremes.'),
  roast_window_width: z.string().optional().nullable().describe('"Narrow" | "Moderate" | "Wide" — UI renders this as "Acceptable Roast Window". Distinct from brewing_tolerance.'),
  primary_lever: z.string().optional().nullable(),
  secondary_levers: z.string().optional().nullable(),
  what_didnt_move_needle: z.string().optional().nullable(),
  underdevelopment_signal: z.string().optional().nullable(),
  overdevelopment_signal: z.string().optional().nullable(),
  cultivar_takeaway: z.string().optional().nullable(),
  terroir_takeaway: z.string().optional().nullable().describe('What this lot taught about the terroir generally. Populatable on one-shot lots. Added Sprint 10 (migration 060, 2026-05-19).'),
  general_takeaway: z.string().optional().nullable(),
  reference_roasts: z.string().optional().nullable(),
  starting_hypothesis: z.string().optional().nullable(),
  rest_behavior: z.string().optional().nullable(),
  // Sprint 12 (migration 064, 2026-05-21): per-field scope_tags arrays. ADR-0009.
  // See push_roast_learnings for the prefix convention. Pass [] to clear; omit
  // to leave untouched.
  cultivar_takeaway_scope_tags: z.array(z.string()).optional().describe(
    'Loose-canonical scope tags for cultivar_takeaway. See ADR-0009 + push_roast_learnings.cultivar_takeaway_scope_tags for the prefix convention (process:washed / variety:gesha-1931 / altitude:high / etc.).',
  ),
  terroir_takeaway_scope_tags: z.array(z.string()).optional().describe(
    'Loose-canonical scope tags for terroir_takeaway. See ADR-0009.',
  ),
  general_takeaway_scope_tags: z.array(z.string()).optional().describe(
    'Loose-canonical scope tags for general_takeaway. Use tag "general" for genuinely-universal principles. See ADR-0009.',
  ),
  starting_hypothesis_scope_tags: z.array(z.string()).optional().describe(
    'Loose-canonical scope tags for starting_hypothesis. Defines future similar-lot pattern for STAGE 1 carry-forward search. See ADR-0009.',
  ),
}

export function registerPatchRoastLearningsTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'patch_roast_learnings',
    {
      title: 'Patch Roast Learnings',
      description:
        'Update / save / record / push field-level changes to the per-bean roast lessons row by roast_learnings_id (the primary-key path). The companion INSERT path of the same domain UPSERTs by green_bean_id (one row per closed bean) — this Tool covers post-close-out edits: starting_hypothesis revision after a related bean lands, or correcting a prose field on the canonical "lot lessons" record without a full re-push. Field-level mutation: only fields you EXPLICITLY supply are updated; omitted fields are untouched. To find roast_learnings_id: call get_bean_pipeline (returns the roast_learnings record). Returns { roast_learnings_id, updated_fields: [...] } — updated_fields echoes which columns landed in the patch. **One-shot lot constraint (migration 054, 2026-05-15)**: when the parent green_beans row has is_one_shot=true, patches that populate the lever-attribution fields (primary_lever / secondary_levers / roast_window_width / brewing_tolerance / what_didnt_move_needle / underdevelopment_signal / overdevelopment_signal) trigger a validation error. Use this Tool to CLEAR those fields (pass explicit null) when retroactively flagging a lot as one-shot after lever-attribution prose was previously written. **Schema notes (Sprint 10, migration 060, 2026-05-19)**: column `elasticity` renamed to `brewing_tolerance` per ADR-0007; column `terroir_takeaway` added — populatable on one-shot lots, NOT subject to the lever-attribution constraint. **Sprint 11 (migration 062, 2026-05-20)**: columns `aromatic_behavior` + `structural_behavior` REMOVED per ADR-0008 — relocated to the cuppings table; write them via the cupping write path on the canonical pourover cupping for the reference roast. **Sprint 12 (migration 064, 2026-05-21)**: 4 new `*_scope_tags text[]` columns paired to the carry-forward fields. Loose-canonical prefix convention (`process:washed` / `variety:sudan-rume` / `country:colombia` / etc.); see ADR-0009 + close-lot.md STAGE 3 + one-shot-closeout.md STAGE 4 for capture guidance. Owned by Close-Lot Specialist per ADR-0011.',
      inputSchema: patchRoastLearningsInputSchema,
    },
    withToolErrorLogging('patch_roast_learnings', async (input) => {
      const payload = input as PatchRoastLearningsPayload
      const result = await patchRoastLearnings(auth.supabase, auth.userId, payload)
      if (!result.ok) throwToolFail(result)
      // Echo the diff. Round-5 dogfood symmetry sweep (2026-05-10).
      const updated_fields = echoUpdatedFields(payload, ROAST_LEARNINGS_PATCH_FIELDS)
      const out = { roast_learnings_id: result.roast_learnings_id, updated_fields }
      return toolJson(out)
    }),
  )
}
