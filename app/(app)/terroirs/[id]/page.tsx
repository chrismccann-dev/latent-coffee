import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Brew, Terroir } from '@/lib/types'
import {
  Chip,
  SspTopBar,
  SspNamePlate,
  SspShead,
  SspProseRows,
  SspStructure,
  compactRows,
  countLabel,
  type MetaPair,
  type StructureRow,
} from '@/components/Ssp'
import { AdditionalInfo } from '@/components/AdditionalInfo'
import { DetailBackLink } from '@/components/DetailBackLink'
import { CoffeesList } from '@/components/CoffeesList'
import { ConfidenceCard } from '@/components/ConfidenceCard'
import { aggregateFlavorNotes } from '@/lib/flavor-registry'
import { extractCrossLinks } from '@/lib/cross-links'
import SynthesisCard from '@/components/SynthesisCard'
import { computeInputMaxUpdatedAt } from '@/lib/synthesis/inputUpdatedAt'
import { getCountryColor } from '@/lib/country-colors'
import { confidenceFor } from '@/lib/confidence'

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
    .select(`*, terroir:terroirs(country, admin_region, macro_terroir, meso_terroir), cultivar:cultivars(id, cultivar_name, lineage)`)
    .in('terroir_id', terriorIds)
    .order('created_at', { ascending: false })

  const brewList = (brews || []) as Brew[]

  // SYN-7: page-side content-change signal. We pull updated_at across the
  // brews corpus + the roast_learnings rows that join this terroir (via
  // green_beans.terroir_id). The page-rendered max() compares against the
  // cache's synthesis_input_max_updated_at; mismatch triggers regen in
  // SynthesisCard even when the brew count is unchanged.
  const { data: roastLearningsUpdates } = await supabase
    .from('roast_learnings')
    .select('updated_at, green_beans!inner(terroir_id)')
    .in('green_beans.terroir_id', terriorIds)
  const currentInputMaxUpdatedAt = computeInputMaxUpdatedAt(
    brewList,
    roastLearningsUpdates ?? [],
  )
  const color = getCountryColor(terroir.country)

  // Merge context across all terroirs in the macro group
  const merged = mergeMacroTerroirContext(allTerroirs)

  const sortedFlavors = aggregateFlavorNotes(brewList)
  const links = extractCrossLinks(brewList)

  // Confidence — shared thresholds via confidenceFor; terroir keeps its
  // non-process-count MEDIUM desc via the ConfidenceCard `desc` override.
  const brewCount = brewList.length
  const nonProcessCount = brewList.filter(b => !b.is_process_dominant).length
  const confidenceDesc =
    confidenceFor(brewCount).label === 'MEDIUM' ? `${nonProcessCount} non-process coffees` : undefined

  const contextRows = compactRows([
    { label: 'Soil', value: merged.soil },
    { label: 'Cup Profile', value: merged.cup_profile },
    { label: 'Why It Stands Out', value: merged.why_it_stands_out },
  ])

  const characterRows = compactRows([
    { label: 'Acidity', value: merged.acidity_character },
    { label: 'Body', value: merged.body_character },
    { label: 'Farming Model', value: merged.farming_model },
  ])

  const productionRows: StructureRow[] = [
    ...(merged.dominant_varieties.length > 0
      ? [{ lbl: 'Dominant Varieties', chips: merged.dominant_varieties.map((v) => ({ name: v })) }]
      : []),
    ...(merged.typical_processing.length > 0
      ? [{ lbl: 'Typical Processing', chips: merged.typical_processing.map((p) => ({ name: p })) }]
      : []),
  ]

  // Country row dropped (polish-audit Pass 1): the topbar anchor slot already
  // carries the country — topbar = identity, hero meta = differentiation.
  const meta: MetaPair[] = [
    ...(terroir.admin_region ? [{ label: 'Admin Region', value: terroir.admin_region }] : []),
    ...(merged.elevation_min && merged.elevation_max
      ? [{ label: 'Elevation', value: `${merged.elevation_min}–${merged.elevation_max}m` }]
      : []),
    ...(merged.climate_stress ? [{ label: 'Climate', value: merged.climate_stress }] : []),
  ]

  return (
    <div className="ssp-page">
      <DetailBackLink href="/terroirs">Terroirs</DetailBackLink>

      {/* Header */}
      <SspTopBar
        count={brewCount > 0 ? countLabel(brewCount, 'COFFEE') : undefined}
        anchor={terroir.country ?? undefined}
        kind="Terroir Profile"
      />
      <SspNamePlate
        title={macroName}
        meta={meta}
        coverColor={color}
        edgeColor={color}
      />

      {/* High Level Summary */}
      {merged.context && (
        <div className="ssp-card">
          <SspShead>High Level Summary</SspShead>
          <div className="ssp-prose">{merged.context}</div>
        </div>
      )}

      {/* Meso Terroirs */}
      {merged.mesoTerroirs.length > 0 && (
        <div className="ssp-card">
          <SspShead>Meso Terroirs Explored</SspShead>
          <div className="flex flex-wrap gap-1.5">
            {merged.mesoTerroirs.map((meso) => (
              <Chip key={meso} name={meso} />
            ))}
          </div>
        </div>
      )}

      {/* Terroir Context */}
      {contextRows.length > 0 && (
        <div className="ssp-card">
          <SspShead>Terroir Context</SspShead>
          <SspProseRows rows={contextRows} />
        </div>
      )}

      {/* Terroir Character */}
      {characterRows.length > 0 && (
        <div className="ssp-card">
          <SspShead>Terroir Character</SspShead>
          <SspProseRows rows={characterRows} />
        </div>
      )}

      {/* Typical Production */}
      {productionRows.length > 0 && (
        <div className="ssp-card">
          <SspShead>Typical Production</SspShead>
          <SspStructure rows={productionRows} />
        </div>
      )}

      {/* Job 2: AI Synthesis - the primary aggregation surface */}
      {brewCount > 0 && (
        <SynthesisCard
          title="WHAT I'VE LEARNED ABOUT THIS TERROIR"
          fetchKey={terriorIds.join(',')}
          endpoint="/api/terroirs/synthesize"
          requestBody={{ terriorIds }}
          loadingText={`Synthesizing knowledge from ${brewCount} coffees across ${macroName || terroir.country}...`}
          existingSynthesis={terroir.synthesis}
          existingBrewCount={terroir.synthesis_brew_count}
          currentBrewCount={brewCount}
          existingShortForm={terroir.short_form_capsule}
          existingSynthesisInputUpdatedAt={terroir.synthesis_input_max_updated_at}
          currentInputMaxUpdatedAt={currentInputMaxUpdatedAt}
        />
      )}

      {/* Job 3: Coffees brewed from this region */}
      {brewCount > 0 && (
        <CoffeesList
          title="Coffees Brewed From This Region"
          brews={brewList}
          showProcessBadge
          metaFor={(brew) => [brew.variety, brew.process].filter(Boolean).join(' · ')}
        />
      )}

      {/* Additional Information — collapsed by default */}
      <AdditionalInfo
        flavors={sortedFlavors}
        links={links}
        sections={[
          { dimension: 'cultivars' },
          { dimension: 'processes' },
          { dimension: 'roasters', title: 'ROASTERS EXPLORED WHO SOURCED FROM THIS REGION' },
        ]}
      />

      {/* Confidence */}
      <ConfidenceCard brewCount={brewCount} desc={confidenceDesc} />
    </div>
  )
}
