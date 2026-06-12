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
  // Sub Pages 6.1 (2026-05-13): first-class design-intent rows joined here so
  // claude.ai can read both the as-designed recipe and the as-recorded roast
  // in one Resource fetch.
  roast_recipes: Record<string, unknown>[]
  // Lot Coordinator dogfood (2026-06-11): echoed back when the caller passed
  // `since` — the arrays then contain ONLY rows created/updated at-or-after
  // this timestamp (green_bean stays full; roast_learnings is null when
  // unchanged-or-absent). Absent on a full fetch.
  since_applied?: string
}

export async function fetchByBean(
  supabase: SupabaseClient,
  userId: string,
  green_bean_id: string,
  // Lot Coordinator dogfood (2026-06-11): incremental fetch. When set (ISO
  // timestamp), child arrays return only rows with updated_at >= since —
  // the full pipeline is ~25-35KB by mid-V-set and dominates context cost on
  // long roasting arcs; `since` removes the skip-incentive that caused the
  // lived staleness failure (severity handoff 2026-06-06). green_bean always
  // returns full (it's the anchor and carries lot_status).
  since?: string,
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
  let roastsQuery = supabase
    .from('roasts')
    .select('*')
    .eq('user_id', userId)
    .eq('green_bean_id', green_bean_id)
    .order('roast_date', { ascending: true })
  if (since) roastsQuery = roastsQuery.gte('updated_at', since)
  const { data: roasts, error: roastsErr } = await roastsQuery
  if (roastsErr) throw new Error(`roasts fetch failed: ${roastsErr.message}`)
  const roastRows = roasts ?? []

  // Cuppings keyed by roast_id IN (...). On an incremental fetch the key set
  // must be ALL the lot's roast ids, not the since-filtered ones — a new
  // cupping usually lands on a roast that hasn't changed since the last pull.
  let cuppingKeyIds = roastRows.map((r) => (r as { id: string }).id)
  if (since) {
    const { data: allRoastIds, error: allIdsErr } = await supabase
      .from('roasts')
      .select('id')
      .eq('user_id', userId)
      .eq('green_bean_id', green_bean_id)
    if (allIdsErr) throw new Error(`roast id fetch failed: ${allIdsErr.message}`)
    cuppingKeyIds = (allRoastIds ?? []).map((r) => (r as { id: string }).id)
  }
  let cuppingRows: Record<string, unknown>[] = []
  if (cuppingKeyIds.length) {
    let cuppingsQuery = supabase
      .from('cuppings')
      .select('*')
      .eq('user_id', userId)
      .in('roast_id', cuppingKeyIds)
      .order('cupping_date', { ascending: true })
    if (since) cuppingsQuery = cuppingsQuery.gte('updated_at', since)
    const { data: cuppings, error: cuppingsErr } = await cuppingsQuery
    if (cuppingsErr) throw new Error(`cuppings fetch failed: ${cuppingsErr.message}`)
    cuppingRows = cuppings ?? []
  }

  let experimentsQuery = supabase
    .from('experiments')
    .select('*')
    .eq('user_id', userId)
    .eq('green_bean_id', green_bean_id)
    .order('experiment_id', { ascending: true })
  if (since) experimentsQuery = experimentsQuery.gte('updated_at', since)
  const { data: experiments, error: expErr } = await experimentsQuery
  if (expErr) throw new Error(`experiments fetch failed: ${expErr.message}`)

  const { data: lessons, error: lessonsErr } = await supabase
    .from('roast_learnings')
    .select('*')
    .eq('user_id', userId)
    .eq('green_bean_id', green_bean_id)
    .maybeSingle()
  if (lessonsErr) throw new Error(`roast_learnings fetch failed: ${lessonsErr.message}`)
  // Incremental semantics: drop the learnings row when unchanged since the
  // cutoff (null then means "unchanged or absent" — the caller's prior pull
  // already has it either way).
  const lessonsOut =
    since && lessons && typeof lessons.updated_at === 'string' && lessons.updated_at < since
      ? null
      : lessons

  // Brews: lightweight summaries (id + key linkage + the prose field that
  // tells the caller what this brew taught). Sorted desc by created_at so
  // the latest brew is first — matches how a session-resume caller would
  // ask "what's the most recent brew for this bean?". Full brew row is
  // available via brews://by-id/{brew_id} for round-trip detail.
  let brewsQuery = supabase
    .from('brews')
    .select('id, coffee_name, source, roast_id, extraction_strategy, what_i_learned, created_at')
    .eq('user_id', userId)
    .eq('green_bean_id', green_bean_id)
    .order('created_at', { ascending: false })
  if (since) brewsQuery = brewsQuery.gte('updated_at', since)
  const { data: brews, error: brewsErr } = await brewsQuery
  if (brewsErr) throw new Error(`brews fetch failed: ${brewsErr.message}`)

  // Sub Pages 6.1 (2026-05-13): pull design-intent rows for the bean. Ordered
  // by created_at desc so the most-recent V-set lands first — matches how a
  // mid-iteration caller asks "what's the latest recipe I designed?".
  let recipesQuery = supabase
    .from('roast_recipes')
    .select('*')
    .eq('user_id', userId)
    .eq('green_bean_id', green_bean_id)
    .order('created_at', { ascending: false })
  if (since) recipesQuery = recipesQuery.gte('updated_at', since)
  const { data: recipes, error: recipesErr } = await recipesQuery
  if (recipesErr) throw new Error(`roast_recipes fetch failed: ${recipesErr.message}`)

  return {
    green_bean: bean,
    roasts: roastRows,
    cuppings: cuppingRows,
    experiments: experiments ?? [],
    roast_learnings: lessonsOut,
    brews: (brews ?? []) as BrewSummary[],
    roast_recipes: recipes ?? [],
    ...(since ? { since_applied: since } : {}),
  }
}
