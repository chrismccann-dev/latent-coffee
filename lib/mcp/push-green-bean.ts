import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { persistGreenBean, type GreenBeanPayload } from '@/lib/roast-import'
import type { McpAuthContext } from '@/lib/mcp/auth'

// push_green_bean — top-level entry point for the self-roasted lineage.
// Inserts a green_beans row with terroir + cultivar FK resolution via
// findOrCreateTerroir / findOrCreateCultivar. Producer canonicalizes through
// PRODUCER_LOOKUP (allowOverride pattern via producer_override).
//
// Roest cross-ref: pass roest_inventory_id when seeded from pull_roest_log
// or list_roest_inventory results — server stores it for round-trip lookups.

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

export const pushGreenBeanInputSchema = {
  // Identity
  lot_id: z.string().describe('Stable lot identifier (e.g. CGLE-MANDELA-XO-2026, GV-OMA-25-035).'),
  name: z.string().describe('Bean display name (e.g. "CGLE - Mandela XO", "Gesha Village - Surma - Lot 25/039").'),
  // Origin / FK
  terroir: terroir.optional().nullable().describe(
    'Origin terroir. country is required when set; macro_terroir resolves through TERROIR_MACRO_LOOKUP.',
  ),
  cultivar: cultivar.optional().nullable().describe(
    'Cultivar. cultivar_name resolves through CULTIVAR_LOOKUP. Aliases accepted ("Geisha" -> "Gesha").',
  ),
  // Free-text fallbacks (kept on green_beans alongside FK)
  origin: z.string().optional().nullable(),
  region: z.string().optional().nullable(),
  variety: z.string().optional().nullable().describe('Legacy free-text; prefer cultivar.cultivar_name.'),
  process: z.string().optional().nullable().describe('Free-text process display (e.g. "Washed", "XO", "Anaerobic Natural"). green_beans.process is text-only (no canonical enforcement).'),
  // Provenance
  producer: z.string().optional().nullable().describe('Producer name. Canonicalizes via PRODUCER_LOOKUP unless producer_override:true.'),
  producer_override: z.boolean().optional(),
  importer: z.string().optional().nullable(),
  seller: z.string().optional().nullable().describe('Direct seller (e.g. Sweet Maria\'s, Cafe Imports). Distinct from importer.'),
  exporter: z.string().optional().nullable().describe('Supply chain exporter (often producer cooperative).'),
  source_type: z.string().optional().nullable().describe('Sourcing channel: "Importer" | "Roaster" | "Farm Direct" | etc.'),
  link: z.string().optional().nullable().describe('Spec sheet / purchase URL.'),
  // Lot economics
  purchase_date: z.string().optional().nullable().describe('YYYY-MM-DD.'),
  price_per_kg: z.number().optional().nullable(),
  quantity_g: z.number().int().optional().nullable().describe('Total purchased in grams.'),
  // Bean specs
  moisture: z.string().optional().nullable().describe('Bare numeric string ("8.70"); % appended on render. NO % suffix in stored value.'),
  density: z.string().optional().nullable().describe('Bare numeric string ("776"); g/L appended on render. NO g/L suffix in stored value.'),
  elevation_m: z.number().int().optional().nullable().describe('Lot elevation in meters.'),
  // Notes
  producer_tasting_notes: z.string().optional().nullable().describe('Producer/seller-supplied tasting notes. Promoted from optional to required intake field per V2 onboarding protocol.'),
  additional_notes: z.string().optional().nullable().describe('Catch-all for processing / history / additional context.'),
  // Roest cross-ref
  roest_inventory_id: z.number().int().optional().nullable().describe('api.roestcoffee.com /inventories/{id}/ — set when seeded from pull_roest_log.'),
}

export function registerPushGreenBeanTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'push_green_bean',
    {
      title: 'Push Green Bean',
      description:
        'Log / register / save / add / push / import a new green coffee bean lot to the app — the top-level entry for the self-roasted lineage. Inserts a green_beans row + resolves terroir + cultivar FKs via lazy find-or-create against canonical registries. Producer canonicalizes via PRODUCER_LOOKUP (allowOverride). Returns green_bean_id + flags for newly-created FKs. Use list_roest_inventory + pull_roest_log first to seed structured fields from Roest, then augment with seller/price/notes.',
      inputSchema: pushGreenBeanInputSchema,
    },
    async (input) => {
      const payload = input as GreenBeanPayload
      const result = await persistGreenBean(auth.supabase, auth.userId, payload)
      if (!result.ok) {
        if (result.code === 'validation') {
          throw new Error(`Validation failed:\n${result.errors.map((e) => `  - ${e}`).join('\n')}`)
        }
        throw new Error(`Database error: ${result.message}`)
      }
      const out = {
        green_bean_id: result.green_bean_id,
        terroir_id: result.terroir_id,
        cultivar_id: result.cultivar_id,
      }
      return {
        content: [{ type: 'text', text: JSON.stringify(out) }],
        structuredContent: out,
      }
    },
  )
}
