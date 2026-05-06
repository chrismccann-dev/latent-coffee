import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { authedWrite, type RoestInventory } from '@/lib/roest-client'
import type { McpAuthContext } from '@/lib/mcp/auth'

// patch_inventory — PATCH /inventories/{id}/ on api.roestcoffee.com.
// Phase 2 of Roest write integration. Field-level updates to an existing
// Roest inventory: archive/unarchive, adjust current_weight after a roast,
// fix typos on producer / notes / cultivar.
//
// No DB-side effects — the green_beans.roest_inventory_id link (if any) is
// established at push_inventory time. To bind an existing Roest inventory to
// an existing green_beans row, use patch_green_bean directly.

export const patchInventoryInputSchema = {
  roest_inventory_id: z.number().int().describe('Roest inventory id (the integer from /inventories/{id}/).'),
  // Mutable subset of RoestInventory + is_archived. All optional — the API
  // PATCHes only the keys present in the body.
  name: z.string().optional().nullable(),
  producer: z.string().optional().nullable(),
  farm: z.string().optional().nullable(),
  region: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  cultivar: z.string().optional().nullable(),
  bean_process: z
    .number()
    .int()
    .min(1)
    .max(5)
    .optional()
    .nullable()
    .describe('Roest enum: 1=Natural, 2=Washed, 3=Honey, 4=Co-fermented/XO, 5=Anaerobic.'),
  moisture: z.number().optional().nullable().describe('Percentage value (8.7), not fraction.'),
  water_activity: z.number().optional().nullable(),
  elevation: z.number().optional().nullable(),
  density: z.number().optional().nullable(),
  initial_weight: z.number().optional().nullable().describe('Raw grams.'),
  current_weight: z.number().optional().nullable().describe('Raw grams. Use to record post-roast remaining weight.'),
  price: z.number().optional().nullable(),
  notes: z.string().optional().nullable(),
  importer: z.string().optional().nullable(),
  exporter: z.string().optional().nullable(),
  bean_size: z.number().int().optional().nullable(),
  drying_speed: z.number().int().optional().nullable(),
  green_bean_color: z.number().int().optional().nullable(),
  is_archived: z.boolean().optional().nullable().describe(
    'true marks the lot as closed/finished in Roest UI (filters out of active picker). Use after final roast on a lot.',
  ),
}

type PatchInventoryInput = {
  roest_inventory_id: number
} & Partial<{
  name: string | null
  producer: string | null
  farm: string | null
  region: string | null
  country: string | null
  cultivar: string | null
  bean_process: number | null
  moisture: number | null
  water_activity: number | null
  elevation: number | null
  density: number | null
  initial_weight: number | null
  current_weight: number | null
  price: number | null
  notes: string | null
  importer: string | null
  exporter: string | null
  bean_size: number | null
  drying_speed: number | null
  green_bean_color: number | null
  is_archived: boolean | null
}>

export function registerPatchInventoryTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'patch_inventory',
    {
      title: 'Patch Inventory',
      description:
        'Patch / update / modify / archive / adjust a single Roest inventory by id via api.roestcoffee.com PATCH /inventories/{id}/. Field-level updates: only keys present in the input are sent. Common uses: mark is_archived=true after final roast on a lot, update current_weight after a roast, fix typos on producer / notes / cultivar. Weight units: raw grams (same convention as push_inventory). Moisture: percentage value (8.7), not fraction. bean_process: Roest 5-bucket enum (1=Natural, 2=Washed, 3=Honey, 4=Co-fermented/XO, 5=Anaerobic). No DB-side effects — the green_beans.roest_inventory_id link (if any) is established at push_inventory time; to bind an existing Roest inventory to an existing green_beans row, use patch_green_bean. Returns { ok: true, updated_fields: [...] }.',
      inputSchema: patchInventoryInputSchema,
    },
    async (input) => {
      const { roest_inventory_id, ...rest } = input as PatchInventoryInput
      // Strip undefined keys but PRESERVE explicit null (Roest treats null as
      // "clear this field"). Spread of `rest` already omits keys the caller
      // never set (zod gives undefined for omitted optional fields).
      const body: Record<string, unknown> = {}
      const updated_fields: string[] = []
      for (const [k, v] of Object.entries(rest)) {
        if (v !== undefined) {
          body[k] = v
          updated_fields.push(k)
        }
      }
      if (updated_fields.length === 0) {
        throw new Error(
          'patch_inventory called with no updatable fields. Pass at least one field (e.g. is_archived, current_weight, notes).',
        )
      }
      await authedWrite<typeof body, RoestInventory>(
        'PATCH',
        `/inventories/${roest_inventory_id}/`,
        body,
      )
      void auth
      const out = { ok: true as const, updated_fields }
      return {
        content: [{ type: 'text', text: JSON.stringify(out) }],
        structuredContent: out,
      }
    },
  )
}
