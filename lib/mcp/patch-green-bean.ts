import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { patchGreenBean, GREEN_BEAN_PATCH_FIELDS, type PatchGreenBeanPayload } from '@/lib/roast-import'
import { LOT_STATUS_VALUES } from '@/lib/lifecycle-state'
import type { McpAuthContext } from '@/lib/mcp/auth'
import { withToolErrorLogging, echoUpdatedFields, throwToolFail, toolJson } from '@/lib/mcp/tool-wrapper'

const terroir = z.object({
  country: z.string(),
  admin_region: z.string().optional().nullable(),
  macro_terroir: z.string().optional().nullable(),
  meso_terroir: z.string().optional().nullable(),
})

const cultivar = z.object({
  cultivar_name: z.string(),
  species: z.string().optional().nullable(),
  genetic_family: z.string().optional().nullable(),
  lineage: z.string().optional().nullable(),
})

export const patchGreenBeanInputSchema = {
  green_bean_id: z.string().uuid().describe(
    'PK of the green_bean row to update. Get via get_green_bean({lot_id}) or get_bean_pipeline.',
  ),
  // Re-resolvable FKs
  terroir: terroir.optional().nullable().describe(
    'When supplied, re-resolves green_beans.terroir_id via the strict-canonical findOrCreateTerroir path (Sprint 2.6: country/macro pair validated, meso in match key).',
  ),
  cultivar: cultivar.optional().nullable().describe(
    'When supplied, re-resolves green_beans.cultivar_id via the strict-canonical findOrCreateCultivar.',
  ),
  // Producer canonicalize (with override)
  producer: z.string().optional().nullable(),
  producer_override: z.boolean().optional(),
  // Pass-through fields
  lot_id: z.string().optional(),
  name: z.string().optional(),
  origin: z.string().optional().nullable(),
  region: z.string().optional().nullable(),
  variety: z.string().optional().nullable(),
  process: z.string().optional().nullable(),
  importer: z.string().optional().nullable(),
  seller: z.string().optional().nullable(),
  exporter: z.string().optional().nullable(),
  source_type: z.string().optional().nullable(),
  link: z.string().optional().nullable(),
  purchase_date: z.string().optional().nullable(),
  price_per_kg: z.number().optional().nullable(),
  quantity_g: z.number().int().optional().nullable(),
  moisture: z.string().optional().nullable(),
  density: z.string().optional().nullable(),
  elevation_m: z.number().int().optional().nullable(),
  producer_tasting_notes: z.string().optional().nullable(),
  additional_notes: z.string().optional().nullable(),
  roest_inventory_id: z.number().int().optional().nullable(),
  // Migration 054 — workflow class flag, patchable for retroactive flagging
  // (e.g. Rancho Tio post-merge backfill where the one-shot framing wasn't
  // known at push time).
  is_one_shot: z.boolean().optional().nullable().describe(
    'True for single-batch sample lots (~100-120g, no iteration possible — no cross-batch evidence to attribute levers from). Patchable post-intake when the one-shot framing is determined or corrected later. Note: changing false → true on a lot that already has roast_learnings with lever-attribution fields populated (primary_lever / secondary_levers / roast_window_width / brewing_tolerance / what_didnt_move_needle / underdevelopment_signal / overdevelopment_signal) does NOT retroactively clear those fields — the migration 054 validation only fires on new writes to roast_learnings. Clear them explicitly via the field-level mutation path on roast_learnings if needed. See CONTEXT-roasting.md § One-shot lot.',
  ),
  // Migration 069 (Phase 2 Item 17, 2026-05-24): patchable post-intake when
  // the peer-roasted variant brew row lands in the DB later (common case —
  // the peer brew is logged via push_brew after the green lot is registered,
  // then this FK gets backfilled).
  peer_reference_brew_id: z.string().uuid().optional().nullable().describe(
    'Optional FK to a brews(id) row for the peer-roasted reference brew of the same green-bean lot. ~25-30%+ of lots have a peer-roasted variant the operator buys as a calibration anchor for the roasting side. Typically set HERE (not at green-bean push time) because the peer brew row is logged separately via the brewing-side write path, then this FK is backfilled. Pass NULL to clear an existing link. See CONTEXT-roasting.md § Peer-roasted reference brew.',
  ),
  // Migration 075 (Cluster A / MB-7, 2026-06-01): patchable — set at close-lot
  // from the brew_id in the optimized-brew handoff brief, or backfilled for
  // lots closed before this column existed.
  optimized_brew_id: z.string().uuid().optional().nullable().describe(
    'Optional FK to a brews(id) row for the canonical optimized brew of THIS green-bean lot (the operator own daily-consumption pour-over for the reference roast). The primary set-point: at close-lot, read the brew_id from the optimized-brew handoff brief and patch it here; or backfill it for a lot closed before this column existed. Distinct from peer_reference_brew_id (external roaster version). Pass NULL to clear. See CONTEXT-roasting.md section Optimized brew + ADR-0019.',
  ),
  // Migration 080 (ADR-0024 § 6, Lot Coordinator dogfood 2026-06-11): the
  // Coordinator-explicit slot in the lot_status single write path.
  lot_status: z
    .enum(LOT_STATUS_VALUES)
    .optional()
    .describe(
      'Stored lot lifecycle status (migration 080). Most transitions are AUTOMATIC — push_roast advances to waiting_for_next_cupping, push_experiment / a landed winner advance to waiting_for_next_roast, push_roast_learnings closes to resolved/unresolved — so you rarely set this. Set it explicitly ONLY for the transitions no row write implies: → waiting_for_brewing when the lot is handed to the brewing side (SPG execution or optimized brew — the Roasting Brief records WHICH), or a deliberate correction/reopen. Cannot be cleared to NULL (NULL = pre-080 derived fallback). The derived lifecycle survives as a validator (check:lifecycle-consistency flags stored-vs-rows disagreement).',
    ),
}

export function registerPatchGreenBeanTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'patch_green_bean',
    {
      title: 'Patch Green Bean',
      description:
        'Update / save / record / push field-level changes to an existing green coffee bean lot by green_bean_id. Sibling of push_green_bean (for new lots). Use this when registry adds happen mid-flight (e.g. an alias was added so producer should re-canonicalize), to backfill missing fields (additional_notes, producer_tasting_notes), to correct previously-saved values, or to update terroir / cultivar via the strict-canonical findOrCreate* path (Sprint 2.6). Field-level mutation: only fields you EXPLICITLY supply are updated; omitted fields are untouched. Producer canonicalizes via PRODUCER_LOOKUP with `producer_override:true` for net-new producers. To find green_bean_id: call get_green_bean({lot_id}) or list it via get_bean_pipeline. Returns { green_bean_id, updated_fields: [...] } — updated_fields echoes which simple text/numeric columns landed in the patch (mirrors patch_inventory + patch_experiment pattern). FK re-resolutions (terroir / cultivar / producer) are NOT echoed because they touch multiple columns + sibling rows; check terroir_id / cultivar_id on a follow-up read if you need to confirm those landed.',
      inputSchema: patchGreenBeanInputSchema,
    },
    withToolErrorLogging('patch_green_bean', async (input) => {
      const payload = input as PatchGreenBeanPayload
      const result = await patchGreenBean(auth.supabase, auth.userId, payload)
      if (!result.ok) throwToolFail(result)
      // Echo simple-column diff. FK re-resolutions (terroir / cultivar /
      // producer) intentionally excluded - they touch multiple columns + sibling
      // rows; caller should follow-up read if they need terroir_id / cultivar_id
      // confirmation. Round-5 dogfood symmetry sweep (2026-05-10).
      const updated_fields = echoUpdatedFields(payload, GREEN_BEAN_PATCH_FIELDS)
      const out = { green_bean_id: result.green_bean_id, updated_fields }
      return toolJson(out)
    }),
  )
}
