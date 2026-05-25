import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { persistGreenBean, type GreenBeanPayload } from '@/lib/roast-import'
import type { McpAuthContext } from '@/lib/mcp/auth'
import { withToolErrorLogging } from '@/lib/mcp/tool-wrapper'

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
  // Workflow class (migration 054, 2026-05-15)
  is_one_shot: z.boolean().optional().nullable().describe(
    'True for single-batch sample lots (~100-120g, no iteration possible). Origin: auction-lot sample sets, farm sample sets sent during sourcing negotiations, rare allocations. Routes the lot through docs/prompts/one-shot.md + one-shot-closeout.md instead of the 4-prompt V-set pipeline (start-lot / log-roast / log-cupping / close-lot). Triggers schema-validation on push_roast_learnings / patch_roast_learnings: lever-attribution fields (primary_lever / secondary_levers / roast_window_width / brewing_tolerance / what_didnt_move_needle / underdevelopment_signal / overdevelopment_signal) must be NULL on one-shot close-outs (N=1 cannot populate; require cross-batch evidence). terroir_takeaway is NOT in this list — terroir attribution does not require cross-batch evidence and is populatable on one-shot lots. Defaults false. See CONTEXT-roasting.md "One-shot lot" entry for the workflow class.',
  ),
  // Migration 069 (Phase 2 Item 17, 2026-05-24)
  peer_reference_brew_id: z.string().uuid().optional().nullable().describe(
    'Optional FK to a brews(id) row for the peer-roasted reference brew of the same green-bean lot. ~25-30%+ of lots have a peer-roasted variant the operator buys as a calibration anchor for the roasting side (CGLE Sudan Rume Natural / Wush Wush / every Untold Coffee Lab lot pattern). 1:1 in current practice (one green-bean lot, at most one peer reference). Typically NULL at first push and set later via the green-bean field-level mutation companion once the peer brew row exists. See CONTEXT-roasting.md § Peer-roasted reference brew.',
  ),
}

export function registerPushGreenBeanTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'push_green_bean',
    {
      title: 'Push Green Bean',
      description:
        'Log / register / save / push / import / archive a new green coffee bean lot to the app — STAGE 1 of the self-roasted roasting pipeline (this Tool runs FIRST; the downstream pipeline writers — roast / cupping / experiment / roast_learnings — all require green_bean_id as a non-nullable FK and will fail without a prior green_bean row). UPSERT semantics on (user_id, lot_id): safe to retry after crash — when a row already exists the existing green_bean_id + terroir_id + cultivar_id are returned with `created: false` and field values are NOT overwritten (field-level updates run through the green-beans field-level mutation companion of the same domain). On a fresh insert, resolves terroir + cultivar FKs via lazy find-or-create against canonical registries; producer canonicalizes via PRODUCER_LOOKUP (allowOverride). When the lot has a paired Roest inventory record, the Roest inventory list + log-pull Tools seed the structured fields from Roest first; that hydration step is independent of this Tool but commonly precedes it. To recover green_bean_id without re-pushing (e.g. cross-session retry where you only have the lot_id), the green-bean read Tool returns the row keyed on lot_id.',
      inputSchema: pushGreenBeanInputSchema,
    },
    withToolErrorLogging('push_green_bean', async (input) => {
      const payload = input as GreenBeanPayload
      const result = await persistGreenBean(auth.supabase, auth.userId, payload)
      if (!result.ok) {
        if (result.code === 'validation') {
          throw new Error(`Validation failed:\n${result.errors.map((e) => `  - ${e}`).join('\n')}`)
        }
        throw new Error(`Database error: ${result.message}`)
      }
      // Phase 3 (#R47): queued_for_taxonomy_review echoes Site A queue inserts
      // for the producer override path. Empty on existing-row hits and when
      // producer resolves canonically.
      const out = {
        green_bean_id: result.green_bean_id,
        terroir_id: result.terroir_id,
        cultivar_id: result.cultivar_id,
        created: result.created,
        queued_for_taxonomy_review: result.queued_for_taxonomy_review,
      }
      return {
        content: [{ type: 'text', text: JSON.stringify(out) }],
        structuredContent: out,
      }
    }),
  )
}
