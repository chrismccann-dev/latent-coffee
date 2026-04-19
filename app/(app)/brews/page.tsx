import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Brew } from '@/lib/types'
import { EXTRACTION_STRATEGIES } from '@/lib/extraction-strategy'
import { getCoverColor } from '@/lib/brew-colors'
import { StrategyPill } from '@/components/StrategyPill'
import { BrewsFilterBar } from '@/components/BrewsFilterBar'
import { PROCESS_FAMILIES, getProcessFamily } from '@/lib/process-families'
import { ROASTER_FAMILIES, getRoasterFamily } from '@/lib/roaster-registry'

interface BrewsPageProps {
  searchParams: {
    strategy?: string
    processes?: string
    lineages?: string
    macros?: string
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
  const activeProcesses = parseList(searchParams.processes).filter((p) =>
    (PROCESS_FAMILIES as readonly string[]).includes(p)
  )
  const activeRoasters = parseList(searchParams.roasters).filter((r) =>
    (ROASTER_FAMILIES as readonly string[]).includes(r)
  )
  const activeLineages = parseList(searchParams.lineages)
  const activeMacros = parseList(searchParams.macros)

  const { data: brews, error } = await supabase
    .from('brews')
    .select(`
      *,
      green_bean:green_beans(name, lot_id, producer),
      terroir:terroirs(country, admin_region, macro_terroir),
      cultivar:cultivars(cultivar_name, lineage)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching brews:', error)
  }

  const allBrews = (brews || []) as Brew[]

  const allLineages = Array.from(
    new Set(allBrews.map((b) => b.cultivar?.lineage).filter((v): v is string => !!v))
  ).sort()
  const allMacros = Array.from(
    new Set(allBrews.map((b) => b.terroir?.macro_terroir).filter((v): v is string => !!v))
  ).sort()

  const anyActive =
    !!activeStrategy ||
    activeProcesses.length > 0 ||
    activeRoasters.length > 0 ||
    activeLineages.length > 0 ||
    activeMacros.length > 0

  const brewList = !anyActive ? allBrews : allBrews.filter((b) => {
    if (activeStrategy && b.extraction_strategy !== activeStrategy) return false
    if (activeProcesses.length > 0 && !activeProcesses.includes(getProcessFamily(b.process))) return false
    if (activeRoasters.length > 0 && !activeRoasters.includes(getRoasterFamily(b.roaster))) return false
    if (activeLineages.length > 0) {
      const lin = b.cultivar?.lineage
      if (!lin || !activeLineages.includes(lin)) return false
    }
    if (activeMacros.length > 0) {
      const m = b.terroir?.macro_terroir
      if (!m || !activeMacros.includes(m)) return false
    }
    return true
  })

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-mono text-xs font-semibold tracking-wide uppercase text-latent-mid">
          BREWS
        </h1>
        <div className="font-mono text-xs text-latent-mid">
          {brewList.length} {brewList.length === 1 ? 'COFFEE' : 'COFFEES'}
          {anyActive && allBrews.length !== brewList.length && (
            <span className="ml-1 text-latent-subtle">/ {allBrews.length}</span>
          )}
        </div>
      </div>

      <BrewsFilterBar
        activeStrategy={activeStrategy}
        activeProcesses={activeProcesses}
        activeRoasters={activeRoasters}
        activeLineages={activeLineages}
        activeMacros={activeMacros}
        allLineages={allLineages}
        allMacros={allMacros}
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
            <Link href="/add" className="btn btn-primary">+ ADD YOUR FIRST BREW</Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0 border-t border-l border-latent-border">
          {brewList.map((brew) => {
            const cardColor = getCoverColor(brew)
            const producer = brew.producer || brew.green_bean?.producer || null
            const roaster = brew.roaster || null
            const region =
              brew.terroir?.macro_terroir ||
              brew.terroir?.admin_region ||
              brew.terroir?.country ||
              null
            const flavorLine = brew.flavor_notes && brew.flavor_notes.length > 0
              ? brew.flavor_notes.slice(0, 4).join(' · ')
              : null

            return (
              <Link
                key={brew.id}
                href={`/brews/${brew.id}`}
                className="border-r border-b border-latent-border p-4 hover:bg-white transition-colors group"
              >
                <div
                  className="w-full aspect-[3/4] rounded flex flex-col justify-between p-4 relative overflow-hidden transition-all duration-200 group-hover:-translate-y-1 group-hover:scale-[1.01] group-hover:shadow-lg"
                  style={{ backgroundColor: cardColor }}
                >
                  {/* Top row: metadata stack + strategy chip */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-mono text-xxs leading-snug text-white/90 space-y-0.5 min-w-0">
                      {brew.variety && <div className="font-semibold truncate">{brew.variety}</div>}
                      {brew.process && <div className="text-white/75 truncate">{brew.process}</div>}
                      {producer && <div className="text-white/75 truncate">{producer}</div>}
                      {region && <div className="text-white/75 truncate">{region}</div>}
                      {roaster && <div className="text-white/75 truncate">{roaster}</div>}
                    </div>
                    <StrategyPill strategy={brew.extraction_strategy} variant="card" />
                  </div>

                  {/* Bottom: flavor notes */}
                  {flavorLine && (
                    <div className="font-mono text-micro leading-snug text-white/70">
                      {flavorLine}
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
