// Helper for the roasts://by-bean/{green_bean_id} Resource (Sprint 2.5).
//
// Returns one fat JSON: { green_bean, roasts, cuppings, experiments, roast_learnings }
// scoped to the authenticated user's data. Mirrors lib/mcp/brews.ts shape.

import type { SupabaseClient } from '@supabase/supabase-js'

export type ByBeanPayload = {
  green_bean: Record<string, unknown> | null
  roasts: Record<string, unknown>[]
  cuppings: Record<string, unknown>[]
  experiments: Record<string, unknown>[]
  roast_learnings: Record<string, unknown> | null
}

export async function fetchByBean(
  supabase: SupabaseClient,
  userId: string,
  green_bean_id: string,
): Promise<ByBeanPayload | null> {
  const { data: bean, error: beanErr } = await supabase
    .from('green_beans')
    .select('*')
    .eq('user_id', userId)
    .eq('id', green_bean_id)
    .maybeSingle()
  if (beanErr) throw new Error(`green_beans fetch failed: ${beanErr.message}`)
  if (!bean) return null

  // Roasts ordered by date asc — chronological reading matches how Chris iterates.
  const { data: roasts, error: roastsErr } = await supabase
    .from('roasts')
    .select('*')
    .eq('user_id', userId)
    .eq('green_bean_id', green_bean_id)
    .order('roast_date', { ascending: true })
  if (roastsErr) throw new Error(`roasts fetch failed: ${roastsErr.message}`)
  const roastRows = roasts ?? []

  // Cuppings keyed by roast_id IN (...)
  let cuppingRows: Record<string, unknown>[] = []
  if (roastRows.length) {
    const roastIds = roastRows.map((r) => (r as { id: string }).id)
    const { data: cuppings, error: cuppingsErr } = await supabase
      .from('cuppings')
      .select('*')
      .eq('user_id', userId)
      .in('roast_id', roastIds)
      .order('cupping_date', { ascending: true })
    if (cuppingsErr) throw new Error(`cuppings fetch failed: ${cuppingsErr.message}`)
    cuppingRows = cuppings ?? []
  }

  const { data: experiments, error: expErr } = await supabase
    .from('experiments')
    .select('*')
    .eq('user_id', userId)
    .eq('green_bean_id', green_bean_id)
    .order('experiment_id', { ascending: true })
  if (expErr) throw new Error(`experiments fetch failed: ${expErr.message}`)

  const { data: lessons, error: lessonsErr } = await supabase
    .from('roast_learnings')
    .select('*')
    .eq('user_id', userId)
    .eq('green_bean_id', green_bean_id)
    .maybeSingle()
  if (lessonsErr) throw new Error(`roast_learnings fetch failed: ${lessonsErr.message}`)

  return {
    green_bean: bean,
    roasts: roastRows,
    cuppings: cuppingRows,
    experiments: experiments ?? [],
    roast_learnings: lessons,
  }
}
