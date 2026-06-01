import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Brew } from '@/lib/types'
import { EXTRACTION_STRATEGIES } from '@/lib/extraction-strategy'
import { BrewsFilterBar } from '@/components/BrewsFilterBar'
import { BrewCard } from '@/components/BrewCard'
import { IndexCap } from '@/components/IndexList'
import { getDisplayName } from '@/lib/roaster-registry'

interface BrewsPageProps {
  searchParams: {
    strategy?: string
    roasters?: string
  }
}

function parseList(param: string | undefined): string[] {
  if (!param) return []
  return param.split(',').map((s) => s.trim()).filter(Boolean)
}

export default async function BrewsPage({ searchParams }: BrewsPageProps) {
  const supabase = createClient()

  const activeStrategy =
    searchParams.strategy && (EXTRACTION_STRATEGIES as readonly string[]).includes(searchParams.strategy)
      ? searchParams.strategy
      : null

  const { data: brews, error } = await supabase
    .from('brews')
    .select(`
      *,
      green_bean:green_beans!green_bean_id(name, lot_id, producer),
      terroir:terroirs(country, admin_region, macro_terroir),
      cultivar:cultivars(cultivar_name, lineage)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching brews:', error)
  }

  const allBrews = (brews || []) as Brew[]

  // Distinct individual roasters that have >=1 brew (Sub-sprint 4c Bundle B).
  // Sorted by display name; the filter matches on the canonical brews.roaster value.
  const allRoasters = Array.from(
    new Set(allBrews.map((b) => b.roaster).filter((v): v is string => !!v))
  ).sort((a, b) => (getDisplayName(a) ?? a).localeCompare(getDisplayName(b) ?? b))

  // Only keep requested roasters that actually appear in the corpus.
  const activeRoasters = parseList(searchParams.roasters).filter((r) => allRoasters.includes(r))

  const anyActive = !!activeStrategy || activeRoasters.length > 0

  const brewList = !anyActive ? allBrews : allBrews.filter((b) => {
    if (activeStrategy && b.extraction_strategy !== activeStrategy) return false
    if (activeRoasters.length > 0 && (!b.roaster || !activeRoasters.includes(b.roaster))) return false
    return true
  })

  const countLabel =
    anyActive && allBrews.length !== brewList.length
      ? `${brewList.length} / ${allBrews.length} COFFEES`
      : `${brewList.length} ${brewList.length === 1 ? 'COFFEE' : 'COFFEES'}`

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <IndexCap left="BREWS" right={countLabel} />

      <BrewsFilterBar
        activeStrategy={activeStrategy}
        activeRoasters={activeRoasters}
        allRoasters={allRoasters}
        anyActive={anyActive}
      />

      {brewList.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-latent-accent rounded-lg mx-auto mb-6 flex items-center justify-center">
            <span className="text-2xl">☕</span>
          </div>
          <p className="font-mono text-sm text-latent-mid mb-6">
            {anyActive ? 'NO BREWS MATCH THESE FILTERS' : 'NO BREWS YET'}
          </p>
          {anyActive ? (
            <Link href="/brews" className="btn btn-secondary">CLEAR ALL FILTERS</Link>
          ) : (
            <p className="font-sans text-sm text-latent-mid max-w-md mx-auto">
              Brews land here once a brewing session in claude.ai writes via the Latent MCP server.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 auto-rows-fr">
          {brewList.map((brew) => (
            <BrewCard key={brew.id} brew={brew} />
          ))}
        </div>
      )}
    </div>
  )
}
