import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Brew } from '@/lib/types'
import { getCoverColor } from '@/lib/brew-colors'
import {
  getRoasterFamily,
  getFamilyColor,
  getRoasterMetadata,
} from '@/lib/roaster-registry'
import { SectionCard } from '@/components/SectionCard'
import { TagLinkList } from '@/components/TagLinkList'
import { FlavorNotesByFamily } from '@/components/FlavorNotesByFamily'
import { aggregateFlavorNotes } from '@/lib/flavor-registry'
import RoasterSynthesis from './RoasterSynthesis'

export default async function RoasterDetailPage({ params }: { params: { slug: string } }) {
  const supabase = createClient()

  const roasterName = decodeURIComponent(params.slug)

  const [brewResult, cacheResult] = await Promise.all([
    supabase
      .from('brews')
      .select(`*, terroir:terroirs(id, country, admin_region, macro_terroir), cultivar:cultivars(id, cultivar_name, lineage)`)
      .eq('roaster', roasterName)
      .order('created_at', { ascending: false }),
    supabase
      .from('roaster_syntheses')
      .select('synthesis, synthesis_brew_count')
      .eq('roaster', roasterName)
      .maybeSingle(),
  ])

  const brewList = (brewResult.data || []) as Brew[]
  if (brewList.length === 0) notFound()

  const cache = cacheResult.data

  const family = getRoasterFamily(roasterName)
  const color = getFamilyColor(family)
  const meta = getRoasterMetadata(roasterName)

  const sortedFlavors = aggregateFlavorNotes(brewList)

  const cultivarMap = new Map<string, string>()
  const terroirMap = new Map<string, { id: string; country: string }>()
  const processSet = new Set<string>()
  for (const brew of brewList) {
    if (brew.cultivar?.cultivar_name && brew.cultivar.id) {
      cultivarMap.set(brew.cultivar.cultivar_name, brew.cultivar.id)
    }
    if (brew.terroir?.country && brew.terroir.id) {
      const key = brew.terroir.macro_terroir || brew.terroir.admin_region || brew.terroir.country
      if (!terroirMap.has(key)) {
        terroirMap.set(key, {
          id: brew.terroir.id,
          country: brew.terroir.country,
        })
      }
    }
    if (brew.process) processSet.add(brew.process)
  }

  const brewCount = brewList.length
  const confidence = brewCount >= 5 ? { emoji: '\uD83D\uDFE2', label: 'HIGH', desc: `${brewCount} coffees explored` }
    : brewCount >= 2 ? { emoji: '\uD83D\uDFE1', label: 'MEDIUM', desc: `${brewCount} coffees explored` }
    : { emoji: '\uD83D\uDD34', label: 'LOW', desc: `${brewCount} ${brewCount === 1 ? 'coffee' : 'coffees'} explored` }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Link
        href="/roasters"
        className="font-mono text-xs text-latent-mid hover:text-latent-fg mb-6 inline-block"
      >
        &larr; Back to Roasters
      </Link>

      {/* Hero */}
      <div className="section-card mb-6">
        <div className="flex gap-6 items-start">
          <div
            className="w-16 h-16 rounded flex-shrink-0"
            style={{ backgroundColor: color }}
          />
          <div className="flex-1">
            <h1 className="font-sans text-2xl font-semibold mb-1">
              {meta?.fullName || roasterName}
            </h1>
            <p className="font-mono text-xs text-latent-mid">
              {family} family &middot; {brewCount} {brewCount === 1 ? 'coffee' : 'coffees'}
              {meta?.location && ` · ${meta.location}`}
            </p>
            {(meta?.bmrStrategy || meta?.url) && (
              <div className="flex flex-wrap items-center gap-3 mt-3">
                {meta?.bmrStrategy && (
                  <span
                    className="font-mono text-[10px] font-semibold tracking-wide uppercase px-2 py-1 rounded"
                    style={{ backgroundColor: color, color: 'white' }}
                  >
                    {meta.bmrStrategy}
                  </span>
                )}
                {meta?.url && (
                  <a
                    href={meta.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-mono text-[10px] text-latent-mid hover:text-latent-fg underline"
                  >
                    {meta.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* House style (BMR-derived, surfaced as static context) */}
      {meta?.bmrHouseStyle && (
        <SectionCard title="HOUSE STYLE">
          <p className="font-sans text-sm leading-relaxed">{meta.bmrHouseStyle}</p>
          {meta.notes && (
            <p className="font-sans text-sm leading-relaxed mt-3 text-latent-mid">{meta.notes}</p>
          )}
        </SectionCard>
      )}

      {/* AI Synthesis */}
      <RoasterSynthesis
        roaster={roasterName}
        existingSynthesis={cache?.synthesis ?? null}
        existingBrewCount={cache?.synthesis_brew_count ?? null}
        currentBrewCount={brewCount}
      />

      {/* Common Flavor Notes (grouped by registry family) */}
      <FlavorNotesByFamily notes={sortedFlavors} />

      <TagLinkList
        title="CULTIVARS EXPLORED"
        items={Array.from(cultivarMap.entries()).map(([name, id]) => ({
          key: name, label: name, href: `/cultivars/${id}`,
        }))}
      />

      <TagLinkList
        title="TERROIRS EXPLORED"
        items={Array.from(terroirMap.entries()).map(([name, { id, country }]) => ({
          key: name, label: `${country} / ${name}`, href: `/terroirs/${id}`,
        }))}
      />

      <TagLinkList
        title="PROCESSES EXPLORED"
        items={Array.from(processSet).map((p) => ({
          key: p, label: p, href: `/processes/${encodeURIComponent(p)}`,
        }))}
      />

      {/* Coffee list */}
      <SectionCard title={`COFFEES FROM THIS ROASTER (${brewCount})`}>
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
              <div className="flex-1 min-w-0">
                <div className="font-sans text-sm font-semibold">
                  {brew.coffee_name}
                </div>
                <div className="font-mono text-[10px] text-latent-mid">
                  {[brew.variety, brew.terroir?.country, brew.process].filter(Boolean).join(' · ')}
                </div>
              </div>
              <span className="font-mono text-xs text-latent-mid opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
            </Link>
          ))}
        </div>
      </SectionCard>

      {/* Confidence */}
      <SectionCard dark>
        <div className="font-mono text-xxs font-medium opacity-60 uppercase mb-3">CONFIDENCE</div>
        <div className="flex items-center gap-3">
          <span className="text-xl">{confidence.emoji}</span>
          <div>
            <div className="font-mono text-sm font-semibold">{confidence.label}</div>
            <div className="font-mono text-xs opacity-60">{confidence.desc}</div>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
