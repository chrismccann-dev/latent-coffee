import { createClient } from '@/lib/supabase/server'
import { aggregateProducers, toCardData } from '@/lib/producers'
import { ProducersIndex } from '@/components/ProducersIndex'
import type { Brew, GreenBean, RoastLearning } from '@/lib/types'

// /producers — sourcing-forward "buy / learn / remember" index. No DB table:
// aggregation is text-equality on brews.producer / green_beans.producer
// (canonicalized via PRODUCER_LOOKUP), exactly like brews.roaster on /roasters.
// The registry seeds target-only producers; the DB rows supply evidence. See
// docs/features/producers-first-class-scoping-2026-06-18.md.
export default async function ProducersPage() {
  const supabase = createClient()

  const [brewsRes, greenRes, learningsRes] = await Promise.all([
    supabase.from('brews').select('id, producer, roaster, source'),
    supabase.from('green_beans').select('id, producer, lot_status'),
    supabase.from('roast_learnings').select('id, green_bean_id'),
  ])

  if (brewsRes.error) console.error('Error fetching brews:', brewsRes.error)
  if (greenRes.error) console.error('Error fetching green_beans:', greenRes.error)
  if (learningsRes.error) console.error('Error fetching roast_learnings:', learningsRes.error)

  const brews = (brewsRes.data || []) as unknown as Brew[]
  const greenLots = (greenRes.data || []) as unknown as GreenBean[]
  const roastLearnings = (learningsRes.data || []) as unknown as RoastLearning[]

  const aggregates = aggregateProducers(brews, greenLots, roastLearnings)
  const producers = aggregates.map(toCardData)

  return <ProducersIndex producers={producers} />
}
