import type { SupabaseClient } from '@supabase/supabase-js'

export const RECENT_DEFAULT_LIMIT = 20
export const RECENT_MAX_LIMIT = 50

type RawBrewRow = Record<string, unknown> & {
  id: string
  green_bean?: { name?: string | null; lot_id?: string | null; producer?: string | null } | null
  terroir?: { country?: string | null; admin_region?: string | null; macro_terroir?: string | null; meso_terroir?: string | null } | null
  cultivar?: { cultivar_name?: string | null; species?: string | null; genetic_family?: string | null; lineage?: string | null } | null
}

const RECENT_SELECT = `
  id, created_at, source, classification,
  roaster, coffee_name, producer, roast_level,
  brewer, filter, grinder, grind, grind_setting,
  dose_g, water_g, ratio, temp_c, bloom, pour_structure, total_time,
  process, base_process, subprocess, fermentation_modifiers, drying_modifiers, intervention_modifiers, experimental_modifiers, decaf_modifier, signature_method,
  extraction_strategy, hybrid_subform, extraction_confirmed, strategy_notes, cooling_curve_target, modifiers,
  flavors, structure_tags, flavor_notes,
  aroma, attack, mid_palate, body, finish, temperature_evolution, peak_expression, what_i_learned,
  is_process_dominant,
  terroir:terroirs(country, admin_region, macro_terroir, meso_terroir),
  cultivar:cultivars(cultivar_name, species, genetic_family, lineage),
  green_bean:green_beans(name, lot_id, producer)
`

const FULL_SELECT = `
  *,
  terroir:terroirs(*),
  cultivar:cultivars(*),
  green_bean:green_beans(*)
`

export async function fetchRecentBrews(
  supabase: SupabaseClient,
  userId: string,
  limit: number = RECENT_DEFAULT_LIMIT,
): Promise<RawBrewRow[]> {
  const clamped = Math.max(1, Math.min(RECENT_MAX_LIMIT, Math.trunc(limit)))
  const { data, error } = await supabase
    .from('brews')
    .select(RECENT_SELECT)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(clamped)
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

