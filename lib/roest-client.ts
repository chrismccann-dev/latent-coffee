// Roest API client (Sprint 2.5; write scope added Phase 1 of Roest write integration).
//
// Server-side OAuth2 client_credentials flow against api.roestcoffee.com (Django
// REST framework + Django OAuth Toolkit). Mints a Bearer token via Basic auth
// against /o/token/, caches in-memory for the token lifetime (typ. 36000s = 10h),
// and exposes typed fetchers for the read endpoints we consume:
// /logs/{id}/, /profiles/{id}/, /inventories/{id}/, /inventories/?customer=&search=
// plus an `authedWrite` sibling for POST/PATCH/PUT against /profiles/ and
// future /inventories/ writes.
//
// Plus a normalizer (`roestLogToPushRoastPayload`) that translates a Roest log
// payload into our `push_roast` input shape.
//
// Why server-side only:
// - Roest credentials mint scope `read write` but the secret must not be
//   exposed to claude.ai. The MCP Tools (pull_roest_log, list_roest_inventory,
//   push_roast_profile) call THIS module, never round-trip the secret to the
//   caller.
// - Vercel container memory is the cache lifetime. Cold start = 1 token mint
//   + 1 customer-info fetch; warm container = 1 mint per ~10h, customer-info
//   reused for the container lifetime.

const ROEST_BASE = 'https://api.roestcoffee.com'

type CachedToken = {
  access_token: string
  expires_at: number // epoch ms
}

let tokenCache: CachedToken | null = null

function readCreds(): { client_id: string; client_secret: string } {
  const client_id = process.env.ROEST_CLIENT_ID
  const client_secret = process.env.ROEST_CLIENT_SECRET
  if (!client_id || !client_secret) {
    throw new Error(
      'Roest credentials not configured. Set ROEST_CLIENT_ID + ROEST_CLIENT_SECRET in env (Vercel + .env.local).',
    )
  }
  return { client_id, client_secret }
}

async function mintToken(): Promise<CachedToken> {
  const { client_id, client_secret } = readCreds()
  const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64')
  const res = await fetch(`${ROEST_BASE}/o/token/`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    // scope=read+write so a cached token can hit POST /profiles/ etc.
    // Phase 1 of Roest write integration. The credential itself is provisioned
    // for write; without the explicit scope param the issued token defaults to
    // read-only and a write attempt 403s. Including it on every mint keeps the
    // cache invariant: every token in tokenCache is read+write, no scope drift.
    body: 'grant_type=client_credentials&scope=read+write',
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Roest token mint failed: ${res.status} ${text.slice(0, 200)}`)
  }
  const json = (await res.json()) as { access_token: string; expires_in: number }
  // Refresh 60s before actual expiry to avoid edge-case 401s mid-request.
  const expires_at = Date.now() + Math.max(0, (json.expires_in - 60) * 1000)
  return { access_token: json.access_token, expires_at }
}

async function getToken(): Promise<string> {
  if (tokenCache && tokenCache.expires_at > Date.now()) {
    return tokenCache.access_token
  }
  tokenCache = await mintToken()
  return tokenCache.access_token
}

async function authedFetch<T>(path: string): Promise<T> {
  const token = await getToken()
  const res = await fetch(`${ROEST_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Roest GET ${path} failed: ${res.status} ${text.slice(0, 200)}`)
  }
  return (await res.json()) as T
}

// Write sibling to authedFetch. Kept as a separate function rather than a
// method param on authedFetch so that GET (idempotent, cached) and POST/PUT/PATCH
// (state-changing) paths are visibly distinct at every call site.
export async function authedWrite<TIn, TOut>(
  method: 'POST' | 'PATCH' | 'PUT',
  path: string,
  body: TIn,
): Promise<TOut> {
  const token = await getToken()
  const res = await fetch(`${ROEST_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Roest ${method} ${path} failed: ${res.status} ${text.slice(0, 500)}`)
  }
  return (await res.json()) as TOut
}

// Customer info — needed two ways: as a numeric ID for the existing read
// endpoints (?customer=2424 query param) and as a Roest API URL for write FK
// fields (POST /profiles/ body customer: "https://api.roestcoffee.com/customers/2424/").
// Cached at module level for the lifetime of the Vercel container — same as
// the token cache. Replaces the previously hardcoded customer=2424.
type CustomerInfo = { id: number; url: string }
let customerInfoCache: CustomerInfo | null = null

type RoestUserSelf = {
  customers: { id: number; url: string }[]
}

export async function getRoestCustomerInfo(): Promise<CustomerInfo> {
  if (customerInfoCache) return customerInfoCache
  const data = await authedFetch<RoestUserSelf>('/users/self/')
  const first = data.customers?.[0]
  if (!first || typeof first.id !== 'number' || typeof first.url !== 'string') {
    throw new Error(
      'Roest /users/self/ returned no customers; cannot resolve customer URL for API calls.',
    )
  }
  customerInfoCache = { id: first.id, url: first.url }
  return customerInfoCache
}

// --- Roest types (subset; only fields we consume) ----------------------------

export type RoestLog = {
  id: number
  url: string
  fc_temp: number | null
  end_temp: number | null
  charge_drum_temp: number | null
  end_drum_temp: number | null
  machine_name: string | null
  machine_slug: string | null
  profile_data: {
    id: number
    name: string
    profile_type: number
    batch_weight: number
    reversed_drum_direction: boolean
  } | null
  inventory_id: number | null
  inventory_name: string | null
  inventory_current_weight: number | null
  end_timestamp: string | null
  firstcrack_timestamp: string | null
  drop_timestamp: string | null
  start_timestamp: string | null
  events: { type: number; msec: number }[]
  batch_no: number | null
  start_weight: number | null
  end_weight: number | null
  whole_bean_color: number | null
  ground_bean_color: number | null
  green_bean_color: number | null
  dryend_event_msec: number | null
  firstcrack_event_msec: number | null
  bean_name: string | null
  batch_uuid: number | null
  share_uuid: string | null
  profile: string | null
  inventory: string | null
  first_comment: {
    comment: string
    cupping_score: number | null
    created: string
  } | null
  latest_cupping_score: number | null
}

export type RoestProfile = {
  id: number
  name: string
  profile_type: number
  preheat_temperature: number | null
  batch_weight: number
  end_condition: number
  end_condition_value: number | null
  is_bbp_profile: boolean
  reversed_drum_direction: boolean
  notes: string | null
  // Bezier curves: array of [msec, value] tuples
  temperature_bezier: [number, number][] | null
  fan_bezier: [number, number][] | null
  rpm_bezier: [number, number][] | null
  power_bezier: [number, number][] | null
}

export type RoestInventory = {
  id: number
  customer_id: number
  name: string
  cultivar: string | null
  farm: string | null
  region: string | null
  country: string | null
  exporter: string | null
  importer: string | null
  producer: string | null
  bean_size: number | null
  drying_speed: number | null
  bean_process: number | null
  moisture: number | null
  water_activity: number | null
  elevation: number | null
  density: number | null
  green_bean_color: number | null
  reg_date: string | null
  current_weight: number | null
  initial_weight: number | null
  price: number | null
  notes: string | null
  is_archived: boolean
  url: string
}

type Paginated<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// --- Endpoints ----------------------------------------------------------------

export function getRoestLog(log_id: number): Promise<RoestLog> {
  return authedFetch<RoestLog>(`/logs/${log_id}/`)
}

export async function getRoestProfile(profile_id: number): Promise<RoestProfile> {
  const { id } = await getRoestCustomerInfo()
  return authedFetch<RoestProfile>(`/profiles/${profile_id}/?customer=${id}`)
}

export async function getRoestInventory(inventory_id: number): Promise<RoestInventory> {
  const { id } = await getRoestCustomerInfo()
  return authedFetch<RoestInventory>(`/inventories/${inventory_id}/?customer=${id}`)
}

export type SearchInventoriesOpts = {
  search?: string
  archived?: boolean
  limit?: number
}

export async function searchRoestInventories(opts: SearchInventoriesOpts = {}): Promise<RoestInventory[]> {
  const { id } = await getRoestCustomerInfo()
  const params = new URLSearchParams({ customer: String(id) })
  if (opts.search) params.set('search', opts.search)
  if (typeof opts.archived === 'boolean') params.set('is_archived', String(opts.archived))
  if (opts.limit) params.set('limit', String(opts.limit))
  const data = await authedFetch<Paginated<RoestInventory>>(`/inventories/?${params.toString()}`)
  return data.results
}

export async function searchRoestLogs(inventory_id: number, limit = 50): Promise<RoestLog[]> {
  const data = await authedFetch<Paginated<RoestLog>>(
    `/logs/?inventory=${inventory_id}&limit=${limit}`,
  )
  return data.results
}

// --- Normalizer ---------------------------------------------------------------

// bean_process enum mapping (sampled across Chris's 10 inventories on 2026-04-30).
// 1 = Natural, 2 = Washed, 4 = Co-fermented / XO, 5 = Anaerobic.
// 3 is unsampled but presumed Honey by ordering convention. Caller (push_roast)
// can override base_process if the enum reading is wrong for an edge case.
const BEAN_PROCESS_MAP: Record<number, { base: 'Washed' | 'Natural' | 'Honey'; hint?: string }> = {
  1: { base: 'Natural' },
  2: { base: 'Washed' },
  3: { base: 'Honey' },
  4: { base: 'Natural', hint: 'Roest enum 4 = co-fermented / XO; consider intervention or experimental modifiers' },
  5: { base: 'Natural', hint: 'Roest enum 5 = anaerobic; consider fermentation_modifiers: ["Anaerobic"]' },
}

export function mapBeanProcessToBase(
  bean_process: number | null,
): { base: 'Washed' | 'Natural' | 'Honey' | null; hint: string | null } {
  if (bean_process == null) return { base: null, hint: null }
  const entry = BEAN_PROCESS_MAP[bean_process]
  if (!entry) return { base: null, hint: `Unknown Roest bean_process enum: ${bean_process}` }
  return { base: entry.base, hint: entry.hint ?? null }
}

// Convert a Roest events msec offset to a "mm:ss" display string. The Roest log
// records events as ms-since-charge; our schema has fc_start/drop_time as text
// in mm:ss. Negative values clamp to "00:00".
export function msecToMMSS(msec: number | null | undefined): string | null {
  if (msec == null || !Number.isFinite(msec)) return null
  const totalSec = Math.max(0, Math.round(msec / 1000))
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

// Resolved TZ used for converting Roest UTC timestamps to local roast_date.
// Roest's API returns ISO-8601 timestamps in UTC; slicing the date portion
// silently drifts the recorded date forward whenever a roast happens late-day
// local time (Bean 4 case: Roest returned 2026-05-05 for a 2026-05-04 17:00
// PT roast — Phase 2 #R65). The MCP server runs on Vercel (UTC), so we
// can't rely on system locale. Configured via ROEST_USER_TIMEZONE env var
// (IANA name like "America/Los_Angeles"). Default surfaces a hint when fired.
export const DEFAULT_ROEST_TZ = 'America/Los_Angeles'

export function resolveRoestTimezone(): { tz: string; defaulted: boolean } {
  const configured = process.env.ROEST_USER_TIMEZONE?.trim()
  if (configured) return { tz: configured, defaulted: false }
  return { tz: DEFAULT_ROEST_TZ, defaulted: true }
}

// Convert a Roest UTC ISO timestamp to a YYYY-MM-DD date string in the user's
// configured local timezone. Returns null when the input is null / unparseable.
// Phase 2 (#R65).
export function roestTimestampToLocalDate(
  iso: string | null | undefined,
  tz: string,
): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  // Intl.DateTimeFormat is the only stdlib path in Node that knows IANA TZ
  // rules. Use the en-CA locale because it natively renders ISO-style
  // YYYY-MM-DD without a workaround for parts ordering.
  try {
    const fmt = new Intl.DateTimeFormat('en-CA', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    return fmt.format(d)
  } catch {
    // Invalid TZ string — fall back to the UTC slice rather than throwing,
    // since this would break Roest pulls entirely. Caller can surface the
    // hint via inference_hints if it cares.
    return iso.slice(0, 10)
  }
}

// Format a bezier curve as a display string. e.g. [[0,80],[105000,68],[150000,63]]
// becomes "80% at 0:00 -> 68% at 1:45 -> 63% at 2:30". Pass `unit` to format the
// y-axis label (% for fan, deg-C for inlet).
export function formatBezier(
  bezier: [number, number][] | null | undefined,
  unit: '%' | '°C',
): string | null {
  if (!bezier || bezier.length === 0) return null
  return bezier
    .map(([msec, value]) => {
      const time = msecToMMSS(msec)
      const v = Number.isInteger(value) ? value.toString() : value.toFixed(1)
      return `${v}${unit} at ${time}`
    })
    .join(' -> ')
}

// Translate a Roest log + linked profile + linked inventory into a push_roast
// input shape. The MCP Tool (pull_roest_log) is the consumer; claude.ai then
// augments with prose fields (what_worked, what_didnt, what_to_change) and
// pushes via push_roast.
//
// `green_bean_id` is the OUR DB uuid (resolved via roest_inventory_id lookup
// before this function is called). Pass null if the bean hasn't been pushed yet.
export type NormalizedRoastPayload = {
  // FK fields — caller resolves green_bean_id from the inventory mapping
  green_bean_id: string | null
  roest_log_id: number
  // Identity
  batch_id: string
  // Phase 2 (#R65): roast_date is in the user's configured local TZ
  // (ROEST_USER_TIMEZONE, default America/Los_Angeles). roast_date_utc carries
  // the raw UTC slice for callers that want the original.
  roast_date: string | null
  roast_date_utc: string | null
  coffee_name: string | null
  profile_link: string | null
  // Profile shape
  roast_profile_name: string | null
  drum_direction: string | null
  // Recipe / control
  charge_temp: number | null
  // Phase 2 (#R59): pulled from RoestProfile.preheat_temperature when available.
  // V4 standard: 125°C. Primary control lever per ROASTING.md.
  hopper_load_temp: number | null
  fc_temp: number | null
  drop_temp: number | null
  // Phase 2 (#R58): drop trigger as set on the Roest profile. Not what the
  // machine actually dropped at — that's drop_temp / drop_time.
  end_condition_type: 'bean_temp' | 'dev_time' | 'manual' | null
  end_condition_target: number | null
  // Times (mm:ss)
  fc_start: string | null
  drop_time: string | null
  yellowing_time: string | null
  dev_time_s: number | null
  dev_ratio: string | null
  // Curves (display strings). Phase 2 (#R64): inlet_curve is the as-DESIGNED
  // template (RoestProfile.temperature_bezier). Mid-roast operator overrides
  // (manual inlet adjustments during the roast) are NOT exposed by the Roest
  // API and therefore not captured here.
  fan_curve: string | null
  inlet_curve: string | null
  // Mass / color
  batch_size_g: number | null
  roasted_weight_g: number | null
  weight_loss_pct: number | null
  agtron: number | null
  // Phase 2 (#R57) — pass-through of Roest UI Notes / first_comment.comment.
  // Renamed from `notes` to disambiguate from operator-prose fields. Caller
  // sets push_roast.roest_notes from this on the augment step.
  roest_notes: string | null
  // Reference roast flag — Roest doesn't track this; caller sets it explicitly
  is_reference: boolean
  // Surface for caller to know what was inferred
  inference_hints: string[]
}

// Roest profile end_condition enum — corrected 2026-05-06 against the Roest UI
// Profiles page dropdown (Chris's screenshot). The dropdown order matches the
// OpenAPI integer enum 1:1: 0=None / 1=Total time / 2=Dev time / 3=Dev time %
// / 4=Bean temp. Prior version of this decoder had `1 → bean_temp` from a
// stale reading; corrected as part of the Phase 1 push_roast_profile cross-
// system audit. Surface the integer + a hint when the trigger doesn't map to
// our 3-bucket type so the caller can override explicitly.
function mapEndConditionEnum(n: number | null | undefined): {
  type: 'bean_temp' | 'dev_time' | 'manual' | null
  hint: string | null
} {
  if (n == null) return { type: null, hint: null }
  if (n === 0) return { type: 'manual', hint: null } // None
  if (n === 4) return { type: 'bean_temp', hint: null } // Bean temp
  if (n === 2) return { type: 'dev_time', hint: null } // Dev time
  if (n === 1) {
    return {
      type: 'manual',
      hint: 'Roest end_condition enum 1 = Total time target; mapped to manual since push_roast does not have a total_time bucket. Override end_condition_type explicitly if you want to record this as something else.',
    }
  }
  if (n === 3) {
    return {
      type: 'dev_time',
      hint: 'Roest end_condition enum 3 = Development time percentage (DTR); collapsed to dev_time bucket since push_roast does not distinguish. end_condition_target carries the percentage value.',
    }
  }
  return {
    type: 'manual',
    hint: `Unknown Roest end_condition enum ${n}; defaulted to 'manual'. Override end_condition_type explicitly if the trigger was bean_temp or dev_time.`,
  }
}

export function roestLogToPushRoastPayload(
  log: RoestLog,
  profile: RoestProfile | null,
  green_bean_id: string | null,
): NormalizedRoastPayload {
  const hints: string[] = []
  // Phase 2 (#R65): resolve the user's configured TZ for roast_date conversion.
  const { tz, defaulted } = resolveRoestTimezone()
  const utcSlice = log.start_timestamp ? log.start_timestamp.slice(0, 10) : null
  const localDate = roestTimestampToLocalDate(log.start_timestamp, tz)
  if (defaulted && log.start_timestamp) {
    hints.push(
      `roast_date converted to ${tz} (default - set ROEST_USER_TIMEZONE env var to override). UTC slice was ${utcSlice}.`,
    )
  } else if (localDate !== utcSlice && log.start_timestamp) {
    hints.push(
      `roast_date converted UTC ${utcSlice} -> ${tz} ${localDate}.`,
    )
  }
  // Phase 2 (#R58): map RoestProfile.end_condition + end_condition_value to
  // the structured fields on push_roast. Profile may be null (no linked
  // profile) — fall through to null.
  const endCondition = mapEndConditionEnum(profile?.end_condition)
  if (endCondition.hint) hints.push(endCondition.hint)
  // Dev time = drop_event - firstcrack_event (in seconds)
  let dev_time_s: number | null = null
  let dev_ratio: string | null = null
  // Roest's events array carries the charge / dryend / firstcrack / drop times.
  // event types: 0=charge, 1=drop, 4=dryend (yellow), 5=firstcrack (per the
  // sample log at 3655311). If firstcrack_event_msec / drop_timestamp differ,
  // prefer the explicit msec field where present.
  const fc_msec = log.firstcrack_event_msec
  const dropEvent = log.events?.find((e) => e.type === 1)
  const drop_msec = dropEvent?.msec ?? null
  if (fc_msec != null && drop_msec != null && drop_msec > fc_msec) {
    dev_time_s = Math.round((drop_msec - fc_msec) / 1000)
    if (drop_msec > 0) {
      const ratio = (drop_msec - fc_msec) / drop_msec
      dev_ratio = ratio.toFixed(3)
    }
  } else if (fc_msec != null && drop_msec == null) {
    hints.push('Drop event not found in Roest events; dev_time_s could not be computed')
  }
  const yellowing_time = msecToMMSS(log.dryend_event_msec)
  const fc_start = msecToMMSS(fc_msec)
  const drop_time = msecToMMSS(drop_msec)
  const weight_loss_pct =
    log.start_weight != null && log.end_weight != null && log.start_weight > 0
      ? Number(((1 - log.end_weight / log.start_weight) * 100).toFixed(2))
      : null
  return {
    green_bean_id,
    roest_log_id: log.id,
    batch_id: log.batch_no != null ? String(log.batch_no) : `roest-${log.id}`,
    roast_date: localDate,
    roast_date_utc: utcSlice,
    coffee_name: log.inventory_name ?? log.bean_name ?? null,
    profile_link: log.share_uuid
      ? `https://connect.roestcoffee.com/shared_log/${log.share_uuid}`
      : null,
    roast_profile_name: log.profile_data?.name ?? null,
    drum_direction: log.profile_data?.reversed_drum_direction ? 'Counterflow' : 'Conventional',
    charge_temp: log.charge_drum_temp,
    // Phase 2 (#R59): pull from RoestProfile.preheat_temperature when present.
    hopper_load_temp: profile?.preheat_temperature ?? null,
    fc_temp: log.fc_temp,
    drop_temp: log.end_temp,
    // Phase 2 (#R58): structured end-condition trigger from the profile.
    end_condition_type: endCondition.type,
    end_condition_target: profile?.end_condition_value ?? null,
    fc_start,
    drop_time,
    yellowing_time,
    dev_time_s,
    dev_ratio,
    fan_curve: profile ? formatBezier(profile.fan_bezier, '%') : null,
    inlet_curve: profile ? formatBezier(profile.temperature_bezier, '°C') : null,
    batch_size_g: log.start_weight,
    roasted_weight_g: log.end_weight,
    weight_loss_pct,
    agtron: log.whole_bean_color,
    roest_notes: log.first_comment?.comment ?? null,
    is_reference: false,
    inference_hints: hints,
  }
}

// Translate a Roest inventory into a push_green_bean input shape. Caller
// (claude.ai) augments with seller, price (Roest has price but not seller name),
// terroir resolution, and cultivar canonicalization before pushing.
export type NormalizedGreenBeanPayload = {
  roest_inventory_id: number
  name: string
  producer: string | null
  origin: string | null
  region: string | null
  variety: string | null
  base_process_hint: 'Washed' | 'Natural' | 'Honey' | null
  process_freeform_hint: string | null
  importer: string | null
  exporter: string | null
  elevation_m: number | null
  moisture: string | null
  density: string | null
  quantity_g: number | null
  price_per_kg: number | null
  purchase_date: string | null
  // Roest's inventory schema has a single `notes` field — there is no separate
  // producer_tasting_notes column. Whatever the user typed in the Roest UI
  // notes field (which may contain producer prose, importer prose, sourcing
  // notes, anything) lands here. caller (claude.ai) decides how to split into
  // green_beans.producer_tasting_notes vs green_beans.additional_notes when
  // pushing onward via push_green_bean.
  additional_notes: string | null
  is_archived: boolean
  inference_hints: string[]
}

// Roest inventory weight normalization. Exported for tests + reuse if other
// Roest weight fields surface the same unit ambiguity. See note in
// roestInventoryToPushGreenBeanPayload for the heuristic rationale.
export function normalizeRoestInventoryWeightG(raw: number | null): number | null {
  if (raw == null || !Number.isFinite(raw) || raw <= 0) return null
  // Threshold: > 100kg = unrealistic home-roaster lot, treat as 1000x-multiplied unit.
  return raw > 100_000 ? Math.round(raw / 1000) : Math.round(raw)
}

export function roestInventoryToPushGreenBeanPayload(
  inv: RoestInventory,
): NormalizedGreenBeanPayload {
  const { base, hint } = mapBeanProcessToBase(inv.bean_process)
  const hints: string[] = []
  if (hint) hints.push(hint)
  // Roest stores moisture as fraction (0.087 = 8.7%) for some lots and as the
  // percentage value (10.4 = 10.4%) for others. Sample data: GESHA CLOUDS
  // 10.4 (number), GV-SURMA 0.087 (fraction). Normalize to percentage value
  // string per green_beans column convention (bare numeric, % appended on render).
  let moisture: string | null = null
  if (inv.moisture != null && inv.moisture > 0) {
    const pct = inv.moisture < 1 ? inv.moisture * 100 : inv.moisture
    moisture = pct.toFixed(2)
  }
  // Density: bare numeric, no g/L suffix (column convention).
  const density =
    inv.density != null && inv.density > 0 ? inv.density.toFixed(0) : null
  // Quantity: Roest returns inventory weight as kg-as-integer-with-1000x
  // multiplier (e.g. 2268000 for a 2.268kg / 2268g lot). The schema column
  // is grams, so divide. MCP feedback batch 6 (2026-05-02) — without this
  // normalization the model in every Roest dog-food had to manually override
  // the inflated normalizer value with the spreadsheet ground-truth.
  //
  // Heuristic: > 100000 g = > 100kg, unrealistic for any home roaster lot, so
  // treat as the multiplied unit and divide. Below threshold treat as grams
  // (defensive against future Roest API changes that might return raw grams).
  // Sample data: 2268000 -> 2268g (CGLE 5lb), 1360000 -> 1360g (CGLE 3lb).
  return {
    roest_inventory_id: inv.id,
    name: inv.name,
    producer: inv.producer,
    origin: inv.country,
    region: inv.region,
    variety: inv.cultivar,
    base_process_hint: base,
    process_freeform_hint: hint ?? null,
    importer: inv.importer,
    exporter: inv.exporter,
    elevation_m: inv.elevation != null && inv.elevation > 0 ? Math.round(inv.elevation) : null,
    moisture,
    density,
    quantity_g: normalizeRoestInventoryWeightG(inv.initial_weight),
    price_per_kg: inv.price,
    purchase_date: inv.reg_date ? inv.reg_date.slice(0, 10) : null,
    // Roest has only one notes field (inv.notes) — caller decides whether the
    // contents are producer prose, importer prose, or sourcing notes when
    // pushing onward via push_green_bean. Surfacing a separate
    // producer_tasting_notes:null here was misleading (looked like a write
    // target that wasn't), so the field was dropped from this payload shape
    // 2026-05-09 per Roest dog-food round-3 feedback.
    additional_notes: inv.notes,
    is_archived: inv.is_archived,
    inference_hints: hints,
  }
}
