import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Brew } from '@/lib/types'
import { EXTRACTION_STRATEGIES, getStrategyStyle } from '@/lib/extraction-strategy'
import { getCoverColor } from '@/lib/brew-colors'
import { StrategyPill } from '@/components/StrategyPill'

interface BrewsPageProps {
  searchParams: { strategy?: string }
}

export default async function BrewsPage({ searchParams }: BrewsPageProps) {
  const supabase = createClient()

  const activeStrategy =
    searchParams.strategy && (EXTRACTION_STRATEGIES as readonly string[]).includes(searchParams.strategy)
      ? searchParams.strategy
      : null

  let query = supabase
    .from('brews')
    .select(`
      *,
      green_bean:green_beans(name, lot_id, producer),
      terroir:terroirs(country, admin_region, macro_terroir),
      cultivar:cultivars(cultivar_name, lineage)
    `)
    .order('created_at', { ascending: false })

  if (activeStrategy) {
    query = query.eq('extraction_strategy', activeStrategy)
  }

  const { data: brews, error } = await query

  if (error) {
    console.error('Error fetching brews:', error)
  }

  const brewList = (brews || []) as Brew[]

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-mono text-xs font-semibold tracking-wide uppercase text-latent-mid">
          BREWS
        </h1>
        <div className="font-mono text-xs text-latent-mid">
          {brewList.length} {brewList.length === 1 ? 'COFFEE' : 'COFFEES'}
        </div>
      </div>

      {/* Extraction-strategy filter pills */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="font-mono text-xxs tracking-wide uppercase text-latent-mid mr-1">
          Strategy
        </span>
        <Link
          href="/brews"
          className={`font-mono text-xxs font-semibold tracking-wide uppercase px-3 py-1.5 rounded border transition-colors ${
            activeStrategy === null
              ? 'bg-latent-fg text-white border-latent-fg'
              : 'bg-white text-latent-mid border-latent-border hover:border-latent-fg'
          }`}
        >
          All
        </Link>
        {EXTRACTION_STRATEGIES.map((s) => {
          const style = getStrategyStyle(s)!
          const active = activeStrategy === s
          return (
            <Link
              key={s}
              href={`/brews?strategy=${encodeURIComponent(s)}`}
              className="font-mono text-xxs font-semibold tracking-wide uppercase px-3 py-1.5 rounded border transition-colors"
              style={
                active
                  ? { backgroundColor: style.border, color: '#fff', borderColor: style.border }
                  : { backgroundColor: style.bg, color: style.text, borderColor: style.border }
              }
            >
              {s}
            </Link>
          )
        })}
      </div>

      {/* Empty state */}
      {brewList.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-latent-accent rounded-lg mx-auto mb-6 flex items-center justify-center">
            <span className="text-2xl">☕</span>
          </div>
          <p className="font-mono text-sm text-latent-mid mb-6">
            {activeStrategy ? `NO ${activeStrategy.toUpperCase()} BREWS YET` : 'NO BREWS YET'}
          </p>
          <Link href="/add" className="btn btn-primary">+ ADD YOUR FIRST BREW</Link>
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
                    <div className="font-mono text-[10px] leading-snug text-white/90 space-y-0.5 min-w-0">
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
                    <div className="font-mono text-[9px] leading-snug text-white/70">
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
