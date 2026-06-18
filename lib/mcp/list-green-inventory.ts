import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { listGreenInventory } from '@/lib/roast-import'
import type { McpAuthContext } from '@/lib/mcp/auth'
import { withToolErrorLogging, toolJson } from '@/lib/mcp/tool-wrapper'

// list_green_inventory — read-only bulk fetch of the in_inventory roast-queue
// working set: every green_bean lot sitting in storage awaiting its first roast
// (lifecycle = in_inventory: no experiments, no roasts), ordered the way /green
// renders them (roast_priority asc NULLS LAST, created_at desc).
//
// Why this Tool exists (Inventory → Claude Code Phase 2, 2026-06-17):
// the Roasting Coordinator's "re-rank my inventory" operation — and the
// intake-time insert that slots a new lot into the existing order — both need
// to see the CURRENT ranking of all in_inventory lots in one call. No existing
// read covers it: get_green_bean is single-row, get_bean_pipeline is per-lot,
// list_roest_inventory is Roest-API-side (no roast_priority). This closes the
// bulk-read gap. Each row carries the fields the re-rank reasons over
// (intake_hypothesis + green specs + lot_status) plus the current rank
// (roast_priority + rationale) so the Coordinator can decide what to shift.
// See docs/skills/roasting-coordinator/cluster/inventory-rerank.md.

export const listGreenInventoryInputSchema = {}

export function registerListGreenInventoryTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'list_green_inventory',
    {
      title: 'List Green Inventory',
      description:
        'List / read / fetch all in_inventory green coffee lots — the "what to roast next" working set: lots sitting in storage awaiting their first roast (no V-set designed yet). Returns rows sorted by roast_priority ascending with unranked (NULL) lots last, created_at descending as the in-band tiebreak — the same order the /green inventory section renders. Each row carries { id, lot_id, name, origin, variety, process, density, quantity_g, lot_status, intake_hypothesis, roast_priority, roast_priority_rationale, created_at }. Use this to power the inventory roast-queue re-rank: read the current ranking + each lot\'s intake hypothesis and green specs in one call, reason the stack-rank, then write each lot back via patch_green_bean (roast_priority + roast_priority_rationale). Also the read step for the intake-time insert — see the current order to slot a newly-added lot cleanly. Scoped to the authenticated user; takes no arguments.',
      inputSchema: listGreenInventoryInputSchema,
    },
    withToolErrorLogging('list_green_inventory', async () => {
      const result = await listGreenInventory(auth.supabase, auth.userId)
      if (!result.ok) throw new Error(`Database error: ${result.message}`)
      return toolJson({ count: result.rows.length, lots: result.rows })
    }),
  )
}
