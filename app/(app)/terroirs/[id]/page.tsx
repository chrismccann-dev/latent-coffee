import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Brew, Terroir } from '@/lib/types'
import { SectionCard } from '@/components/SectionCard'
import { Tag } from '@/components/Tag'
import { TagLinkList } from '@/components/TagLinkList'
import { FlavorNotesByFamily } from '@/components/FlavorNotesByFamily'
import { aggregateFlavorNotes } from '@/lib/flavor-registry'
import TerroirSynthesis from './TerroirSynthesis'
import { getCountryColor } from '@/lib/country-colors'

/**
 * Merge terroir context fields across all terroirs in a macro terroir group.
 * Uses first-non-null for scalar fields, combines meso terroirs, merges elevation ranges.
 */
function mergeMacroTerroirContext(terroirs: Terroir[]) {
  const first = <T,>(fn: (t: Terroir) => T | null | undefined): T | null => {
    for (const t of terroirs) {
      const v = fn(t)
      if (v) return v
    }
    return null
  }

  // Collect all unique meso terroirs
  const mesoSet = new Set<string>()
  for (const t of terroirs) {
    if (t.meso_terroir) {
      for (const meso of t.meso_terroir.split(',')) {
        const trimmed = meso.trim()
        if (trimmed) mesoSet.add(trimmed)
      }
    }
  }

  // Merge elevation ranges (min of mins, max of maxes)
  let elevMin: number | null = null
  let elevMax: number | null = null
  for (const t of terroirs) {
    if (t.elevation_min != null) elevMin = elevMin == null ? t.elevation_min : Math.min(elevMin, t.elevation_min)
    if (t.elevation_max != null) elevMax = elevMax == null ? t.elevation_max : Math.max(elevMax, t.elevation_max)
  }

  // Merge array fields (union of all values)
  const mergeArrays = (fn: (t: Terroir) => string[] | null | undefined): string[] => {
    const set = new Set<string>()
    for (const t of terroirs) {
      for (const v of fn(t) || []) set.add(v)
    }
    return Array.from(set)
  }

  return {
    context: first(t => t.context),
    soil: first(t => t.soil),
    cup_profile: first(t => t.cup_profile),
    why_it_stands_out: first(t => t.why_it_stands_out),
    climate_stress: first(t => t.climate_stress),
    acidity_character: first(t => t.acidity_character),
    body_character: first(t => t.body_character),
    farming_model: first(t => t.farming_model),
    dominant_varieties: mergeArrays(t => t.dominant_varieties),
    typical_processing: mergeArrays(t => t.typical_processing),
    mesoTerroirs: Array.from(mesoSet),
    elevation_min: elevMin,
    elevation_max: elevMax,
  }
}

export default async function TerroirDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  // Load the clicked terroir to get its macro_terroir
  const { data: terroir, error } = await supabase
    .from('terroirs')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !terroir) notFound()

  // Load ALL terroirs in this macro terroir group
  const macroName = terroir.macro_terroir || terroir.admin_region
  const { data: macroTerroirs } = terroir.macro_terroir
    ? await supabase
        .from('terroirs')
        .select('*')
        .eq('macro_terroir', terroir.macro_terroir)
        .eq('country', terroir.country)
    : { data: [terroir] }

  const allTerroirs = (macroTerroirs || [terroir]) as Terroir[]
  const terriorIds = allTerroirs.map(t => t.id)

  // Fetch all brews matching ANY terroir in this macro group (via terroir_id FK)
  const { data: brews } = await supabase
    .from('brews')
    .select(`*, terroir:terroirs(country, admin_region, macro_terroir, meso_terroir), cultivar:cultivars(cultivar_name, lineage)`)
    .in('terroir_id', terriorIds)
    .order('created_at', { ascending: false })

  const brewList = (brews || []) as Brew[]
  const color = getCountryColor(terroir.country)

  // Merge context across all terroirs in the macro group
  const merged = mergeMacroTerroirContext(allTerroirs)

  const sortedFlavors = aggregateFlavorNotes(brewList)

  const cultivarSet = new Map<string, string>()
  const processSet = new Set<string>()
  const roasterSet = new Set<string>()
  for (const brew of brewList) {
    if (brew.cultivar?.cultivar_name) cultivarSet.set(brew.cultivar.cultivar_name, brew.cultivar.lineage || '')
    if (brew.process) processSet.add(brew.process)
    if (brew.roaster) roasterSet.add(brew.roaster)
  }

  // Confidence level
  const brewCount = brewList.length
  const nonProcessCount = brewList.filter(b => !b.is_process_dominant).length
  const confidence = brewCount >= 5 ? { emoji: '\uD83D\uDFE2', label: 'HIGH', desc: `${brewCount} coffees explored` }
    : brewCount >= 2 ? { emoji: '\uD83D\uDFE1', label: 'Medium', desc: `${nonProcessCount} non-process coffees` }
    : brewCount >= 1 ? { emoji: '\uD83D\uDD34', label: 'LOW', desc: `${brewCount} ${brewCount === 1 ? 'coffee' : 'coffees'} explored` }
    : { emoji: '\uD83D\uDD34', label: 'LOW', desc: '0 coffees explored' }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Link
        href="/terroirs"
        className="font-mono text-xs text-latent-mid hover:text-latent-fg mb-6 inline-block"
      >
        &larr; Back to Terroirs
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
              {macroName}
            </h1>
            <p className="font-mono text-xs text-latent-mid">
              {terroir.country} &rarr; {terroir.admin_region}
            </p>
            <div className="font-mono text-xs text-latent-mid mt-2">
              {merged.elevation_min && merged.elevation_max && (
                <span>{merged.elevation_min}&ndash;{merged.elevation_max}m</span>
              )}
              {merged.climate_stress && (
                <span> &middot; {merged.climate_stress}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Meso Terroirs */}
      {merged.mesoTerroirs.length > 0 && (
        <SectionCard title="MESO TERROIRS EXPLORED">
          <div className="flex flex-wrap gap-2">
            {merged.mesoTerroirs.map((meso) => (
              <Tag key={meso}>{meso}</Tag>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Terroir Context */}
      {(merged.context || merged.soil || merged.cup_profile || merged.why_it_stands_out) && (
        <SectionCard title="TERROIR CONTEXT">
          <div className="space-y-3 font-sans text-sm">
            {merged.context && (
              <div>
                <span className="font-mono text-xxs font-semibold text-latent-fg uppercase mr-2">Context:</span>
                {merged.context}
              </div>
            )}
            {merged.soil && (
              <div>
                <span className="font-mono text-xxs font-semibold text-latent-fg uppercase mr-2">Soil:</span>
                {merged.soil}
              </div>
            )}
            {merged.cup_profile && (
              <div>
                <span className="font-mono text-xxs font-semibold text-latent-fg uppercase mr-2">Cup Profile:</span>
                {merged.cup_profile}
              </div>
            )}
            {merged.why_it_stands_out && (
              <div>
                <span className="font-mono text-xxs font-semibold text-latent-fg uppercase mr-2">Why It Stands Out:</span>
                {merged.why_it_stands_out}
              </div>
            )}
          </div>
        </SectionCard>
      )}

      {/* Terroir Character */}
      {(merged.acidity_character || merged.body_character || merged.farming_model) && (
        <SectionCard title="TERROIR CHARACTER">
          <div className="space-y-3 font-sans text-sm">
            {merged.acidity_character && (
              <div>
                <span className="font-mono text-xxs font-semibold text-latent-fg uppercase mr-2">Acidity:</span>
                {merged.acidity_character}
              </div>
            )}
            {merged.body_character && (
              <div>
                <span className="font-mono text-xxs font-semibold text-latent-fg uppercase mr-2">Body:</span>
                {merged.body_character}
              </div>
            )}
            {merged.farming_model && (
              <div>
                <span className="font-mono text-xxs font-semibold text-latent-fg uppercase mr-2">Farming Model:</span>
                {merged.farming_model}
              </div>
            )}
          </div>
        </SectionCard>
      )}

      {/* Dominant Varieties & Typical Processing */}
      {(merged.dominant_varieties.length > 0 || merged.typical_processing.length > 0) && (
        <SectionCard title="TYPICAL PRODUCTION">
          {merged.dominant_varieties.length > 0 && (
            <div className="mb-4">
              <div className="font-mono text-xxs font-semibold text-latent-fg uppercase mb-2">Dominant Varieties</div>
              <div className="flex flex-wrap gap-2">
                {merged.dominant_varieties.map((v) => <Tag key={v}>{v}</Tag>)}
              </div>
            </div>
          )}
          {merged.typical_processing.length > 0 && (
            <div>
              <div className="font-mono text-xxs font-semibold text-latent-fg uppercase mb-2">Typical Processing</div>
              <div className="flex flex-wrap gap-2">
                {merged.typical_processing.map((p) => <Tag key={p}>{p}</Tag>)}
              </div>
            </div>
          )}
        </SectionCard>
      )}

      {/* AI Synthesis */}
      {brewList.length > 0 && (
        <TerroirSynthesis
          terriorIds={terriorIds}
          macroTerroirName={macroName || terroir.country}
          existingSynthesis={terroir.synthesis}
          existingBrewCount={terroir.synthesis_brew_count}
          currentBrewCount={brewList.length}
        />
      )}

      {/* Common Flavor Notes (grouped by registry family) */}
      <FlavorNotesByFamily notes={sortedFlavors} />


      {/* Cultivars Explored */}
      {cultivarSet.size > 0 && (
        <SectionCard title="CULTIVARS EXPLORED">
          <div className="flex flex-wrap gap-2">
            {Array.from(cultivarSet.entries()).map(([name, lineage]) => (
              <Tag key={name}>{lineage ? `${lineage} / ${name}` : name}</Tag>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Processes */}
      {processSet.size > 0 && (
        <SectionCard title="PROCESSES">
          <div className="flex flex-wrap gap-2">
            {Array.from(processSet).map((p) => (
              <Tag key={p}>{p}</Tag>
            ))}
          </div>
        </SectionCard>
      )}

      <TagLinkList
        title="ROASTERS EXPLORED"
        items={Array.from(roasterSet).map((r) => ({
          key: r, label: r, href: `/roasters/${encodeURIComponent(r)}`,
        }))}
      />

      {/* Coffee list */}
      {brewList.length > 0 && (
        <div className="mb-4">
          <div className="font-mono text-xxs font-semibold tracking-wide uppercase text-latent-mid mb-3">
            COFFEES FROM {(macroName || terroir.country).toUpperCase()}
          </div>
          <div className="space-y-0">
            {brewList.map((brew) => (
              <Link
                key={brew.id}
                href={`/brews/${brew.id}`}
                className="flex items-center gap-3 py-3 border border-latent-border rounded-md mb-2 px-4 hover:bg-latent-bg transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-sans text-sm font-semibold flex items-center flex-wrap gap-2">
                    <span>{brew.coffee_name}</span>
                    {brew.is_process_dominant && (
                      <span className="inline-flex items-center gap-1 text-xxs font-mono bg-latent-bg px-2 py-0.5 rounded">
                        PROCESS
                      </span>
                    )}
                  </div>
                  <div className="font-mono text-xxs text-latent-mid">
                    {[brew.variety, brew.process].filter(Boolean).join(' · ')}
                  </div>
                </div>
                <span className="font-mono text-xs text-latent-mid opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Confidence */}
      <SectionCard dark>
        <div className="font-mono text-xxs font-medium opacity-60 uppercase mb-3">CONFIDENCE</div>
        <div className="flex items-center justify-end gap-3">
          <span className="text-xl">{confidence.emoji}</span>
          <div>
            <span className="font-mono text-sm font-semibold">{confidence.label}</span>
            <span className="font-mono text-xs opacity-60 ml-2">&mdash; {confidence.desc}</span>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
