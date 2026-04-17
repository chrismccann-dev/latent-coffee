import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Brew } from '@/lib/types'
import { getCoverColor } from '@/lib/brew-colors'
import { getProcessFamily, getFamilyColor } from '@/lib/process-families'
import { StrategyPill } from '@/components/StrategyPill'
import ProcessSynthesis from './ProcessSynthesis'

function Section({ title, dark, children }: { title?: string, dark?: boolean, children: React.ReactNode }) {
  return (
    <div className={`rounded-md p-6 mb-4 ${dark ? 'bg-latent-fg text-white' : 'bg-white border border-latent-border'}`}>
      {title && (
        <div className={`font-mono text-xs font-bold tracking-wide uppercase mb-4 ${dark ? 'opacity-60' : 'text-latent-fg'}`}>
          {title}
        </div>
      )}
      {children}
    </div>
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="tag">{children}</span>
}

export default async function ProcessDetailPage({ params }: { params: { slug: string } }) {
  const supabase = createClient()

  const processName = decodeURIComponent(params.slug)

  const [brewResult, cacheResult] = await Promise.all([
    supabase
      .from('brews')
      .select(`*, terroir:terroirs(country, admin_region, macro_terroir), cultivar:cultivars(cultivar_name, lineage)`)
      .eq('process', processName)
      .order('created_at', { ascending: false }),
    supabase
      .from('process_syntheses')
      .select('synthesis, synthesis_brew_count')
      .eq('process', processName)
      .maybeSingle(),
  ])

  const brewList = (brewResult.data || []) as Brew[]
  if (brewList.length === 0) notFound()

  const cache = cacheResult.data

  const family = getProcessFamily(processName)
  const color = getFamilyColor(family)

  // Aggregate flavor notes across all brews
  const flavorCounts: Record<string, number> = {}
  for (const brew of brewList) {
    for (const note of brew.flavor_notes || []) {
      flavorCounts[note] = (flavorCounts[note] || 0) + 1
    }
  }
  const sortedFlavors = Object.entries(flavorCounts).sort((a, b) => b[1] - a[1])

  // Aggregate terroirs and cultivars
  const terroirSet = new Map<string, string>()
  const cultivarSet = new Set<string>()
  for (const brew of brewList) {
    if (brew.terroir?.country) {
      const key = brew.terroir.macro_terroir || brew.terroir.admin_region || brew.terroir.country
      terroirSet.set(key, brew.terroir.country)
    }
    if (brew.cultivar?.cultivar_name) cultivarSet.add(brew.cultivar.cultivar_name)
  }

  const brewCount = brewList.length
  const confidence = brewCount >= 5 ? { emoji: '\uD83D\uDFE2', label: 'HIGH', desc: `${brewCount} coffees explored` }
    : brewCount >= 2 ? { emoji: '\uD83D\uDFE1', label: 'MEDIUM', desc: `${brewCount} coffees explored` }
    : { emoji: '\uD83D\uDD34', label: 'LOW', desc: `${brewCount} ${brewCount === 1 ? 'coffee' : 'coffees'} explored` }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Link
        href="/processes"
        className="font-mono text-xs text-latent-mid hover:text-latent-fg mb-6 inline-block"
      >
        &larr; Back to Processes
      </Link>

      <div className="section-card mb-6">
        <div className="flex gap-6 items-start">
          <div
            className="w-16 h-16 rounded flex-shrink-0"
            style={{ backgroundColor: color }}
          />
          <div className="flex-1">
            <h1 className="font-sans text-2xl font-semibold mb-1">
              {processName}
            </h1>
            <p className="font-mono text-xs text-latent-mid">
              {family} family &middot; {brewCount} {brewCount === 1 ? 'coffee' : 'coffees'}
            </p>
          </div>
        </div>
      </div>

      {/* AI Synthesis — What I've Learned (process-level) */}
      <ProcessSynthesis
        process={processName}
        existingSynthesis={cache?.synthesis ?? null}
        existingBrewCount={cache?.synthesis_brew_count ?? null}
        currentBrewCount={brewCount}
      />

      {/* Common Flavor Notes */}
      {sortedFlavors.length > 0 && (
        <Section title="COMMON FLAVOR NOTES">
          <div className="flex flex-wrap gap-2">
            {sortedFlavors.map(([note, count]) => (
              <Tag key={note}>{note}{count > 1 ? ` (${count})` : ''}</Tag>
            ))}
          </div>
        </Section>
      )}

      {/* Cultivars */}
      {cultivarSet.size > 0 && (
        <Section title="CULTIVARS EXPLORED">
          <div className="flex flex-wrap gap-2">
            {Array.from(cultivarSet).map((name) => (
              <Tag key={name}>{name}</Tag>
            ))}
          </div>
        </Section>
      )}

      {/* Terroirs */}
      {terroirSet.size > 0 && (
        <Section title="TERROIRS EXPLORED">
          <div className="flex flex-wrap gap-2">
            {Array.from(terroirSet.entries()).map(([name, country]) => (
              <Tag key={name}>{country} / {name}</Tag>
            ))}
          </div>
        </Section>
      )}

      <Section title={`COFFEES WITH THIS PROCESS (${brewCount})`}>
        <div className="space-y-0">
          {brewList.map((brew) => (
            <Link
              key={brew.id}
              href={`/brews/${brew.id}`}
              className="flex items-center gap-3 py-3 border-b border-latent-border last:border-b-0 hover:bg-latent-bg transition-colors group"
            >
              <div
                className="w-8 h-10 rounded flex-shrink-0"
                style={{ backgroundColor: getCoverColor(brew) }}
              />
              <div className="flex-1">
                <div className="font-sans text-sm font-semibold flex items-center flex-wrap gap-2">
                  <span>{brew.coffee_name}</span>
                  <StrategyPill strategy={brew.extraction_strategy} />
                </div>
                <div className="font-mono text-[10px] text-latent-mid">
                  {[brew.variety, brew.terroir?.country, brew.roaster].filter(Boolean).join(' · ')}
                </div>
              </div>
              <span className="font-mono text-xs text-latent-mid opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
            </Link>
          ))}
        </div>
      </Section>

      {/* Confidence */}
      <Section dark>
        <div className="font-mono text-xxs font-medium opacity-60 uppercase mb-3">CONFIDENCE</div>
        <div className="flex items-center gap-3">
          <span className="text-xl">{confidence.emoji}</span>
          <div>
            <div className="font-mono text-sm font-semibold">{confidence.label}</div>
            <div className="font-mono text-xs opacity-60">{confidence.desc}</div>
          </div>
        </div>
      </Section>
    </div>
  )
}
