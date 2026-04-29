import type { SupabaseClient } from '@supabase/supabase-js'

const RECENT_DEFAULT_N = 20

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
  extraction_strategy, extraction_confirmed, modifiers,
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
): Promise<RawBrewRow[]> {
  const { data, error } = await supabase
    .from('brews')
    .select(RECENT_SELECT)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(RECENT_DEFAULT_N)
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

