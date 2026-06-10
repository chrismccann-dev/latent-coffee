import * as z from 'zod/v4'
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import {
  authedWrite,
  getRoestCustomerInfo,
  resolveRoestTimezone,
  roestTimestampToLocalDate,
  type RoestInventory,
} from '@/lib/roest-client'
import type { McpAuthContext } from '@/lib/mcp/auth'
import { withToolErrorLogging, toolJson } from '@/lib/mcp/tool-wrapper'

// Today's date in YYYY-MM-DD as the user's configured TZ (ROEST_USER_TIMEZONE,
// default America/Los_Angeles). Used as the reg_date default — Roest requires
// reg_date and a UTC slice can drift into tomorrow when Chris registers a bean
// late evening PT. Falls back to UTC slice if the TZ formatter throws.
function todayInUserTz(): string {
  const { tz } = resolveRoestTimezone()
  const now = new Date().toISOString()
  return roestTimestampToLocalDate(now, tz) ?? now.slice(0, 10)
}

// push_inventory — server-side POST /inventories/ to api.roestcoffee.com.
// Phase 2 of Roest write integration. Pushes a green coffee lot from our DB
// (or claude.ai-constructed input) to Chris's Roest inventory so the Roest
// tablet shows the lot when picking which inventory to associate with a roast
// log. Closes the bidirectional sync: pull_roest_log + list_roest_inventory
// already let us READ from Roest; this lets us WRITE to Roest.
//
// When the caller passes green_bean_id, on successful POST we also update
// our `green_beans.roest_inventory_id` column so the two records are
// permanently linked. Without that link, a later pull_roest_log for a roast
// against this lot can't resolve the FK back to our DB row.

// Roest bean_process enum mapping (mirror of BEAN_PROCESS_MAP in roest-client.ts):
//   1 = Natural
//   2 = Washed
//   3 = Honey
//   4 = Co-fermented / XO
//   5 = Anaerobic
// Caller (claude.ai) is responsible for collapsing our composable taxonomy
// (base + 4 modifier axes + signature) down to one of these 5 buckets — Roest's
// schema can't represent the structured form, so this is intentionally lossy.

export const pushInventoryInputSchema = {
  name: z.string().min(1).describe(
    'Inventory display name (visible in Roest tablet picker). Match the convention used elsewhere in your DB — typically `<short producer> <process> <variety>` or whatever name claude.ai uses internally for the lot. Required.',
  ),
  green_bean_id: z.string().uuid().optional().nullable().describe(
    'Our DB green_beans.id. When provided, on successful Roest create we update green_beans.roest_inventory_id to the new Roest inventory id, linking the two records. Omit only when seeding a Roest-only entry (rare).',
  ),
  producer: z.string().optional().nullable().describe('Producer / farmer / cooperative name.'),
  farm: z.string().optional().nullable().describe('Specific farm or estate name (often same as producer for single-farm lots).'),
  region: z.string().optional().nullable().describe('Admin or sub-regional locality (e.g. "Huila", "Kayanza", "Sidamo").'),
  country: z.string().optional().nullable().describe('Country of origin (e.g. "Colombia", "Ethiopia").'),
  cultivar: z.string().optional().nullable().describe('Variety / cultivar — comma-separated string when multiple ("Caturra, Castillo"). Roest field is a single string, not an array.'),
  bean_process: z
    .number()
    .int()
    .min(1)
    .max(5)
    .optional()
    .nullable()
    .describe(
      'Roest process enum (lossy 5-bucket mapping): 1=Natural, 2=Washed, 3=Honey, 4=Co-fermented / XO, 5=Anaerobic. Collapse our composable taxonomy to one bucket — for co-ferment / XO / anaerobic naturals lean toward 4 or 5; for clean washed lean 2; for plain naturals 1.',
    ),
  moisture: z.number().optional().nullable().describe(
    'Moisture content as a percentage (e.g. 8.7 for 8.7%). Send as percentage value, not fraction — Roest reads come back fraction-or-percentage drift but writes accept percentage cleanly.',
  ),
  water_activity: z.number().optional().nullable().describe('Water activity (aw), typically 0.45-0.65.'),
  elevation: z.number().optional().nullable().describe('Elevation in meters above sea level (single number; for ranges, send the midpoint).'),
  density: z.number().optional().nullable().describe('Bulk density in g/L (e.g. 776).'),
  initial_weight: z.number().describe(
    'Initial lot weight in grams (raw — do not multiply by 1000). Roest reads return weights as kg-as-integer-with-1000x multiplier; the write side accepts raw grams. Required — Roest rejects without it, and the wrapper uses this value as the default for current_weight when current_weight is omitted.',
  ),
  current_weight: z.number().optional().nullable().describe(
    'Current remaining weight in grams. Same unit convention as initial_weight. When omitted, the wrapper auto-mirrors initial_weight on initial push (typical fresh-intake case). Roest requires this field; the auto-mirror prevents a silent 400.',
  ),
  reg_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'reg_date must be YYYY-MM-DD')
    .optional()
    .nullable()
    .describe(
      'Registration date (YYYY-MM-DD). The date this lot was registered in inventory — typically receipt / arrival date. Pass green_beans.purchase_date when known for accuracy on backfilled lots; defaults to today in the configured user TZ (ROEST_USER_TIMEZONE, default America/Los_Angeles) when omitted. Roest requires this field; the wrapper auto-defaults so you cannot accidentally 400.',
    ),
  price: z.number().optional().nullable().describe('Price per kg in your local currency (Roest does not specify currency).'),
  notes: z.string().optional().nullable().describe('Free-text notes — Roest UI Notes field.'),
  importer: z.string().optional().nullable(),
  exporter: z.string().optional().nullable(),
  bean_size: z.number().int().optional().nullable().describe('Roest bean size enum — leave null unless you know the integer mapping.'),
  drying_speed: z.number().int().optional().nullable().describe('Roest drying speed enum — leave null unless you know the mapping.'),
  green_bean_color: z.number().int().optional().nullable().describe('Roest green bean color enum — leave null unless you know the mapping.'),
}

type PushInventoryInput = {
  name: string
  green_bean_id?: string | null
  producer?: string | null
  farm?: string | null
  region?: string | null
  country?: string | null
  cultivar?: string | null
  bean_process?: number | null
  moisture?: number | null
  water_activity?: number | null
  elevation?: number | null
  density?: number | null
  initial_weight: number
  current_weight?: number | null
  reg_date?: string | null
  price?: number | null
  notes?: string | null
  importer?: string | null
  exporter?: string | null
  bean_size?: number | null
  drying_speed?: number | null
  green_bean_color?: number | null
}

type CreateInventoryBody = Omit<PushInventoryInput, 'green_bean_id'> & {
  customer: string
  current_weight: number
  reg_date: string
}

export function registerPushInventoryTool(server: McpServer, auth: McpAuthContext) {
  server.registerTool(
    'push_inventory',
    {
      title: 'Push Inventory',
      description:
        'Push / create / upload / sync / register a green coffee lot to Chris\'s Roest inventory via api.roestcoffee.com POST /inventories/. Mirrors the read shape from list_roest_inventory (RoestInventory) — same fields, write direction. When green_bean_id is provided, on successful create the Tool also updates our `green_beans.roest_inventory_id` column so the two records are permanently linked (closing the loop with pull_roest_log / list_roest_inventory which depend on that FK to map a Roest log back to our DB row). Roest bean_process enum is 5 buckets (1=Natural, 2=Washed, 3=Honey, 4=Co-fermented/XO, 5=Anaerobic) — caller collapses our composable taxonomy down to one. Weight units: send raw grams (not the kg-as-integer-1000x form returned on read). Moisture: send as percentage value (8.7), not fraction. customer + reg_date + current_weight are auto-filled server-side when omitted (reg_date defaults to today in user TZ; current_weight mirrors initial_weight on fresh intake) — these were silent-400 sources before the wrapper learned to default them (Roest dog-food round 1, 2026-05-06). initial_weight is required at the schema level since the mirror needs it. Returns { roest_inventory_id, linked: bool } where linked is true when green_bean_id was provided AND the green_beans update succeeded. Idempotency: create-new (no upsert); pushing the same lot twice yields two Roest rows.',
      inputSchema: pushInventoryInputSchema,
    },
    withToolErrorLogging('push_inventory', async (input) => {
      const i = input as PushInventoryInput
      const { url: customerUrl } = await getRoestCustomerInfo()
      const { green_bean_id, ...inventoryFields } = i
      // Auto-fill the two Roest-required fields whose absence Chris's first
      // dog-food run hit as 400s (2026-05-06): reg_date defaults to today in
      // user TZ; current_weight mirrors initial_weight on fresh intake.
      const reg_date = inventoryFields.reg_date ?? todayInUserTz()
      const current_weight =
        inventoryFields.current_weight ?? inventoryFields.initial_weight
      const body: CreateInventoryBody = {
        ...inventoryFields,
        reg_date,
        current_weight,
        customer: customerUrl,
      }
      const created = await authedWrite<CreateInventoryBody, RoestInventory>(
        'POST',
        '/inventories/',
        body,
      )
      let linked = false
      let link_error: string | null = null
      if (green_bean_id) {
        const { error } = await auth.supabase
          .from('green_beans')
          .update({ roest_inventory_id: created.id })
          .eq('id', green_bean_id)
          .eq('user_id', auth.userId)
        if (error) {
          link_error = `Roest inventory ${created.id} created, but green_beans.${green_bean_id}.roest_inventory_id update failed: ${error.message}. Patch manually via patch_green_bean.`
        } else {
          linked = true
        }
      }
      const out = {
        roest_inventory_id: created.id,
        linked,
        link_error,
      }
      return toolJson(out)
    }),
  )
}
