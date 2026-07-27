import type { SupabaseClient } from '@supabase/supabase-js'

export const RECENT_DEFAULT_LIMIT = 20
export const RECENT_MAX_LIMIT = 50

type RawBrewRow = Record<string, unknown> & {
  id: string
  green_bean?: { name?: string | null; lot_id?: string | null; producer?: string | null } | null
  terroir?: { country?: string | null; admin_region?: string | null; macro_terroir?: string | null; meso_terroir?: string | null } | null
  cultivar?: { cultivar_name?: string | null; species?: string | null; genetic_family?: string | null; lineage?: string | null } | null
}

// The allowlist: every scalar brews column the trimmed Tool surfaces may
// select. list_recent_brews selects all of them; query_brews validates its
// `fields` widener against this set (via z.enum, so the list is introspectable).
export const BREW_SCALAR_COLUMNS = [
  'id', 'created_at', 'source', 'classification',
  'roaster', 'coffee_name', 'producer', 'roast_level',
  'brewer', 'filter', 'grinder', 'grind', 'grind_setting',
  'dose_g', 'water_g', 'ratio', 'temp_c', 'water_recipe', 'bloom', 'pour_structure', 'pours', 'total_time',
  'process', 'base_process', 'subprocess', 'fermentation_modifiers', 'drying_modifiers', 'intervention_modifiers', 'experimental_modifiers', 'decaf_modifier', 'signature_method',
  'extraction_strategy', 'hybrid_subform', 'extraction_confirmed', 'strategy_notes', 'cooling_curve_target', 'modifiers',
  'flavors', 'structure_tags', 'flavor_notes',
  'aroma', 'attack', 'mid_palate', 'body', 'finish', 'temperature_evolution', 'peak_expression', 'what_i_learned',
  'is_process_dominant',
] as const

export type BrewScalarColumn = (typeof BREW_SCALAR_COLUMNS)[number]

const TERROIR_EMBED = 'terroir:terroirs(country, admin_region, macro_terroir, meso_terroir)'
const CULTIVAR_EMBED_COLS = 'cultivar_name, species, genetic_family, lineage'
const GREEN_BEAN_EMBED = 'green_bean:green_beans!green_bean_id(name, lot_id, producer)'

// query_brews' bounded default projection: identity + core recipe + the three
// FK embeds (the sibling-lot correctness case needs the canonical terroir /
// cultivar / green_bean rows). Widen per-call via `fields`.
export const QUERY_DEFAULT_COLUMNS = [
  'id', 'created_at', 'source', 'roaster', 'coffee_name', 'producer', 'roast_level',
  'base_process', 'extraction_strategy',
  'brewer', 'dose_g', 'water_g', 'ratio', 'temp_c', 'total_time',
] as const satisfies readonly BrewScalarColumn[]

export type BrewQueryFilters = {
  roaster?: string
  coffee_name?: string
  extraction_strategy?: string
  base_process?: string
  cultivar?: string
  since_date?: string
  green_bean_id?: string
}

const FULL_SELECT = `
  *,
  terroir:terroirs(*),
  cultivar:cultivars(*),
  green_bean:green_beans!green_bean_id(*)
`

export async function fetchRecentBrews(
  supabase: SupabaseClient,
  userId: string,
  limit: number = RECENT_DEFAULT_LIMIT,
): Promise<RawBrewRow[]> {
  return fetchBrewsFiltered(supabase, userId, {}, limit, BREW_SCALAR_COLUMNS)
}

export async function fetchBrewsFiltered(
  supabase: SupabaseClient,
  userId: string,
  filters: BrewQueryFilters,
  limit: number = RECENT_DEFAULT_LIMIT,
  extraFields: readonly BrewScalarColumn[] = [],
): Promise<RawBrewRow[]> {
  const clamped = Math.max(1, Math.min(RECENT_MAX_LIMIT, Math.trunc(limit)))
  const scalar = Array.from(new Set<string>([...QUERY_DEFAULT_COLUMNS, ...extraFields]))
  const select = [
    ...scalar,
    TERROIR_EMBED,
    // !inner when filtering on the embed so non-matching parents drop out
    // instead of returning with a null cultivar.
    `cultivar:cultivars${filters.cultivar ? '!inner' : ''}(${CULTIVAR_EMBED_COLS})`,
    GREEN_BEAN_EMBED,
  ].join(', ')

  let query = supabase.from('brews').select(select).eq('user_id', userId)
  if (filters.roaster) query = query.ilike('roaster', `%${filters.roaster}%`)
  if (filters.coffee_name) query = query.ilike('coffee_name', `%${filters.coffee_name}%`)
  if (filters.extraction_strategy) query = query.ilike('extraction_strategy', filters.extraction_strategy)
  if (filters.base_process) query = query.ilike('base_process', filters.base_process)
  if (filters.cultivar) query = query.ilike('cultivar.cultivar_name', `%${filters.cultivar}%`)
  if (filters.since_date) query = query.gte('created_at', filters.since_date)
  if (filters.green_bean_id) query = query.eq('green_bean_id', filters.green_bean_id)

  const { data, error } = await query.order('created_at', { ascending: false }).limit(clamped)
  if (error) throw error
  return (data ?? []) as unknown as RawBrewRow[]
}

export async function fetchBrewById(
  supabase: SupabaseClient,
  userId: string,
  id: string,
): Promise<RawBrewRow | null> {
  const { data, error } = await supabase
    .from('brews')
    .select(FULL_SELECT)
    .eq('user_id', userId)
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return (data ?? null) as unknown as RawBrewRow | null
}

