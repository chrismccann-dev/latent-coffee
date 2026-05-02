// Helper for the roasts://by-bean/{green_bean_id} Resource (Sprint 2.5)
// + the get_bean_pipeline Tool (PR #78 / batch 4 + brews[] extension batch 5).
//
// Returns one fat JSON:
//   { green_bean, roasts, cuppings, experiments, roast_learnings, brews }
// scoped to the authenticated user's data. Mirrors lib/mcp/brews.ts shape.
//
// brews[] (added MCP feedback batch 5, 2026-05-02): lightweight per-brew
// summaries filtered by green_bean_id. Surfaces the prior-brew-detection case
// the latest dog-food hit — the model pushed a duplicate brew because it
// couldn't see existing brews for the bean before push_brew. Each summary
// includes roast_id (null = orphan brew not linked to any roast); future
// patch_brew Tool (architectural-queue #R16) would let callers backfill
// missing roast_id linkage.

import type { SupabaseClient } from '@supabase/supabase-js'

export type BrewSummary = {
  id: string
  coffee_name: string | null
  source: string | null
  roast_id: string | null
  extraction_strategy: string | null
  what_i_learned: string | null
  created_at: string
}

export type ByBeanPayload = {
  green_bean: Record<string, unknown> | null
  roasts: Record<string, unknown>[]
  cuppings: Record<string, unknown>[]
  experiments: Record<string, unknown>[]
  roast_learnings: Record<string, unknown> | null
  brews: BrewSummary[]
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

  // Brews: lightweight summaries (id + key linkage + the prose field that
  // tells the caller what this brew taught). Sorted desc by created_at so
  // the latest brew is first — matches how a session-resume caller would
  // ask "what's the most recent brew for this bean?". Full brew row is
  // available via brews://by-id/{brew_id} for round-trip detail.
  const { data: brews, error: brewsErr } = await supabase
    .from('brews')
    .select('id, coffee_name, source, roast_id, extraction_strategy, what_i_learned, created_at')
    .eq('user_id', userId)
    .eq('green_bean_id', green_bean_id)
    .order('created_at', { ascending: false })
  if (brewsErr) throw new Error(`brews fetch failed: ${brewsErr.message}`)

  return {
    green_bean: bean,
    roasts: roastRows,
    cuppings: cuppingRows,
    experiments: experiments ?? [],
    roast_learnings: lessons,
    brews: (brews ?? []) as BrewSummary[],
  }
}
