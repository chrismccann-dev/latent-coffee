import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Brew, Cultivar } from '@/lib/types'
import CultivarSynthesis from './CultivarSynthesis'

const familyColors: Record<string, string> = {
  'Ethiopian Landrace Families': '#4A7C59',
  'Bourbon Family': '#7A3B4B',
  'Modern Hybrids': '#3B5B6B',
  'Typica × Bourbon Crosses': '#6B4A3B',
  'Typica Family': '#4A3728',
  'SL Selections': '#8B3B2B',
}

function getFamilyColor(family: string): string {
  return familyColors[family] || '#555555'
}

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

function getFlavorColor(brew: Brew): string {
  const process = brew.process?.toLowerCase() || ''
  const flavorText = (brew.flavor_notes || []).join(' ').toLowerCase()
  const variety = brew.variety?.toLowerCase() || ''

  if (process.includes('natural') && (process.includes('anaerobic') || process.includes('yeast'))) return '#722F4B'
  if (process.includes('anaerobic') || process.includes('thermal shock') || process.includes('anoxic')) return '#722F4B'
  if (process.includes('honey')) return '#8B6914'
  if (process.includes('natural')) return '#8B4513'
  if (variety.includes('gesha') || variety.includes('geisha')) return process.includes('washed') ? '#4A7C59' : '#5B7A6B'
  if (flavorText.includes('berry') || flavorText.includes('wine') || flavorText.includes('grape')) return '#722F4B'
  if (flavorText.includes('floral') || flavorText.includes('jasmine') || flavorText.includes('bergamot')) return '#6B8E7B'
  return '#6B7B6B'
}

/**
 * Merge characteristic fields from multiple cultivars in a lineage.
 * Returns the first non-null value found for each field, or combines where appropriate.
 */
function mergeLineageCharacteristics(cultivars: Cultivar[]) {
  const first = <T,>(fn: (c: Cultivar) => T | null | undefined): T | null => {
    for (const c of cultivars) {
      const v = fn(c)
      if (v) return v
    }
    return null
  }

  const mergeArrays = (fn: (c: Cultivar) => string[] | null | undefined): string[] => {
    const set = new Set<string>()
    for (const c of cultivars) {
      for (const v of fn(c) || []) set.add(v)
    }
    return Array.from(set)
  }

  return {
    genetic_background: first(c => c.genetic_background),
    acidity_style: first(c => c.acidity_style),
    body_style: first(c => c.body_style),
    aromatics: first(c => c.aromatics),
    extraction_sensitivity: first(c => c.extraction_sensitivity),
    roast_tolerance: first(c => c.roast_tolerance),
    brewing_tendencies: first(c => c.brewing_tendencies),
    typical_origins: mergeArrays(c => c.typical_origins),
    limiting_factors: mergeArrays(c => c.limiting_factors),
    altitude_sensitivity: first(c => c.altitude_sensitivity),
    terroir_transparency: first(c => c.terroir_transparency),
    common_processing_methods: mergeArrays(c => c.common_processing_methods),
    typical_flavor_notes: mergeArrays(c => c.typical_flavor_notes),
    common_pitfalls: mergeArrays(c => c.common_pitfalls),
    cultivar_notes: first(c => c.cultivar_notes),
  }
}

export default async function CultivarLineagePage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  // Load the clicked cultivar to get its lineage
  const { data: cultivar, error } = await supabase
    .from('cultivars')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !cultivar) notFound()

  // Load ALL cultivars in this lineage
  const lineageName = cultivar.lineage || cultivar.cultivar_name
  const { data: lineageCultivars } = cultivar.lineage
    ? await supabase
        .from('cultivars')
        .select('*')
        .eq('lineage', cultivar.lineage)
        .order('cultivar_name')
    : { data: [cultivar] }

  const allCultivars = (lineageCultivars || [cultivar]) as Cultivar[]
  const cultivarIds = allCultivars.map(c => c.id)

  // Fetch brews matching ANY cultivar in this lineage via FK
  const { data: brews } = await supabase
    .from('brews')
    .select(`*, terroir:terroirs(country, admin_region, macro_terroir), cultivar:cultivars(cultivar_name, lineage)`)
    .in('cultivar_id', cultivarIds)
    .order('created_at', { ascending: false })

  const brewList = (brews || []) as Brew[]

  // Merge characteristics across all cultivars in the lineage
  const merged = mergeLineageCharacteristics(allCultivars)

  const color = getFamilyColor(cultivar.genetic_family || '')

  // Aggregate flavor notes across all brews
  const flavorCounts: Record<string, number> = {}
  for (const brew of brewList) {
    for (const note of brew.flavor_notes || []) {
      flavorCounts[note] = (flavorCounts[note] || 0) + 1
    }
  }
  const sortedFlavors = Object.entries(flavorCounts).sort((a, b) => b[1] - a[1])

  // Aggregate terroirs and processes
  const terroirSet = new Map<string, string>()
  const processSet = new Set<string>()
  for (const brew of brewList) {
    if (brew.terroir?.country) {
      const key = brew.terroir.macro_terroir || brew.terroir.admin_region || brew.terroir.country
      terroirSet.set(key, brew.terroir.country)
    }
    if (brew.process) processSet.add(brew.process)
  }

  // Confidence based on total brew count across lineage
  const brewCount = brewList.length
  const confidence = brewCount >= 5 ? { emoji: '\uD83D\uDFE2', label: 'HIGH', desc: `${brewCount} coffees explored` }
    : brewCount >= 2 ? { emoji: '\uD83D\uDFE1', label: 'MEDIUM', desc: `${brewCount} coffees explored` }
    : { emoji: '\uD83D\uDD34', label: 'LOW', desc: `${brewCount} ${brewCount === 1 ? 'coffee' : 'coffees'} explored` }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Link
        href="/cultivars"
        className="font-mono text-xs text-latent-mid hover:text-latent-fg mb-6 inline-block"
      >
        &larr; Back to Cultivars
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
              {lineageName}
            </h1>
            <p className="font-mono text-xs text-latent-mid">
              {cultivar.species} &rarr; {cultivar.genetic_family}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {allCultivars.map((c) => (
                <Tag key={c.id}>{c.cultivar_name}</Tag>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Genetic Background */}
      {merged.genetic_background && (
        <Section title="GENETIC BACKGROUND">
          <p className="font-sans text-sm leading-relaxed">{merged.genetic_background}</p>
        </Section>
      )}

      {/* Cup Characteristics */}
      {(merged.acidity_style || merged.body_style || merged.aromatics) && (
        <Section title="CUP CHARACTERISTICS">
          <div className="space-y-3 font-sans text-sm">
            {merged.acidity_style && (
              <div>
                <div className="font-mono text-xxs font-semibold text-latent-fg uppercase mb-1">Acidity Style</div>
                <div>{merged.acidity_style}</div>
              </div>
            )}
            {merged.body_style && (
              <div>
                <div className="font-mono text-xxs font-semibold text-latent-fg uppercase mb-1">Body Style</div>
                <div>{merged.body_style}</div>
              </div>
            )}
            {merged.aromatics && (
              <div>
                <div className="font-mono text-xxs font-semibold text-latent-fg uppercase mb-1">Aromatics</div>
                <div>{merged.aromatics}</div>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Brewing & Roasting */}
      {(merged.extraction_sensitivity || merged.roast_tolerance || merged.brewing_tendencies) && (
        <Section title="BREWING & ROASTING">
          <div className="space-y-3 font-sans text-sm">
            {merged.extraction_sensitivity && (
              <div>
                <span className="font-mono text-xs font-semibold text-latent-fg mr-2">Extraction Sensitivity:</span>
                {merged.extraction_sensitivity}
              </div>
            )}
            {merged.roast_tolerance && (
              <div>
                <span className="font-mono text-xs font-semibold text-latent-fg mr-2">Roast Tolerance:</span>
                {merged.roast_tolerance}
              </div>
            )}
            {merged.brewing_tendencies && (
              <div>
                <span className="font-mono text-xs font-semibold text-latent-fg mr-2">Brewing Tendencies:</span>
                {merged.brewing_tendencies}
              </div>
            )}
          </div>
        </Section>
      )}

      {/* AI Synthesis — What I've Learned (lineage-level) */}
      {brewList.length > 0 && (
        <CultivarSynthesis
          cultivarIds={cultivarIds}
          lineageName={lineageName}
          existingSynthesis={cultivar.synthesis}
          existingBrewCount={cultivar.synthesis_brew_count}
          currentBrewCount={brewList.length}
        />
      )}

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

      {/* Processes */}
      {processSet.size > 0 && (
        <Section title="PROCESSES">
          <div className="flex flex-wrap gap-2">
            {Array.from(processSet).map((p) => (
              <Tag key={p}>{p}</Tag>
            ))}
          </div>
        </Section>
      )}

      {/* Coffee list */}
      {brewList.length > 0 && (
        <Section title={`COFFEES IN THIS LINEAGE (${brewList.length})`}>
          <div className="space-y-0">
            {brewList.map((brew) => {
              const cardColor = getFlavorColor(brew)
              return (
                <Link
                  key={brew.id}
                  href={`/brews/${brew.id}`}
                  className="flex items-center gap-3 py-3 border-b border-latent-border last:border-b-0 hover:bg-latent-bg transition-colors group"
                >
                  <div
                    className="w-8 h-10 rounded flex-shrink-0"
                    style={{ backgroundColor: cardColor }}
                  />
                  <div className="flex-1">
                    <div className="font-sans text-sm font-semibold">{brew.coffee_name}</div>
                    <div className="font-mono text-[10px] text-latent-mid">
                      {[brew.variety, brew.terroir?.country, brew.process].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                  <span className="font-mono text-xs text-latent-mid opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                </Link>
              )
            })}
          </div>
        </Section>
      )}

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
