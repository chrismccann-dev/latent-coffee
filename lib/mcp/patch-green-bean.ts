import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { patchGreenBean, type PatchGreenBeanPayload } from '@/lib/roast-import'
import type { McpAuthContext } from '@/lib/mcp/auth'

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
}

export function registerPatchGreenBeanTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'patch_green_bean',
    {
      title: 'Patch Green Bean',
      description:
        'Update / save / record / push field-level changes to an existing green coffee bean lot by green_bean_id. Sibling of push_green_bean (for new lots). Use this when registry adds happen mid-flight (e.g. an alias was added so producer should re-canonicalize), to backfill missing fields (additional_notes, producer_tasting_notes), to correct previously-saved values, or to update terroir / cultivar via the strict-canonical findOrCreate* path (Sprint 2.6). Field-level mutation: only fields you EXPLICITLY supply are updated; omitted fields are untouched. Producer canonicalizes via PRODUCER_LOOKUP with `producer_override:true` for net-new producers. To find green_bean_id: call get_green_bean({lot_id}) or list it via get_bean_pipeline.',
      inputSchema: patchGreenBeanInputSchema,
    },
    async (input) => {
      const result = await patchGreenBean(auth.supabase, auth.userId, input as PatchGreenBeanPayload)
      if (!result.ok) {
        if (result.code === 'validation') {
          throw new Error(`Validation failed:\n${result.errors.map((e) => `  - ${e}`).join('\n')}`)
        }
        if (result.code === 'no_op') throw new Error(result.message)
        if (result.code === 'not_found') throw new Error(result.message)
        throw new Error(`Database error: ${result.message}`)
      }
      const out = { green_bean_id: result.green_bean_id }
      return {
        content: [{ type: 'text', text: JSON.stringify(out) }],
        structuredContent: out,
      }
    },
  )
}
