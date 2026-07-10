import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Brew, Cultivar } from '@/lib/types'
import {
  SspTopBar,
  SspNamePlate,
  SspShead,
  SspProseRows,
  compactRows,
  countLabel,
  type MetaPair,
  type ProseRow,
} from '@/components/Ssp'
import { AdditionalInfo } from '@/components/AdditionalInfo'
import { DetailBackLink } from '@/components/DetailBackLink'
import { CoffeesList } from '@/components/CoffeesList'
import { ConfidenceCard } from '@/components/ConfidenceCard'
import { aggregateFlavorNotes } from '@/lib/flavor-registry'
import { extractCrossLinks } from '@/lib/cross-links'
import SynthesisCard from '@/components/SynthesisCard'
import { computeInputMaxUpdatedAt } from '@/lib/synthesis/inputUpdatedAt'
import { getFamilyColor } from '@/lib/cultivar-family-colors'

// Build a prose row from a scalar or array field; arrays join with ', '
// (empty arrays collapse to '' and get dropped by compactRows).
function field(label: string, value: string | string[] | null | undefined): ProseRow {
  return { label, value: Array.isArray(value) ? value.join(', ') : value }
}

export default async function CultivarDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: cultivar, error } = await supabase
    .from('cultivars')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !cultivar) notFound()

  const { data: brews } = await supabase
    .from('brews')
    .select(`*, terroir:terroirs(id, country, admin_region, macro_terroir), cultivar:cultivars(cultivar_name, lineage)`)
    .eq('cultivar_id', params.id)
    .order('created_at', { ascending: false })

  const brewList = (brews || []) as Brew[]

  // SYN-7: page-side content-change signal. Pull roast_learnings updated_at
  // for lots whose green_beans.cultivar_id matches this cultivar; combined
  // max() drives the SynthesisCard regeneration trigger when content edits
  // arrive without changing the brew count.
  const { data: roastLearningsUpdates } = await supabase
    .from('roast_learnings')
    .select('updated_at, green_beans!inner(cultivar_id)')
    .eq('green_beans.cultivar_id', params.id)
  const currentInputMaxUpdatedAt = computeInputMaxUpdatedAt(
    brewList,
    roastLearningsUpdates ?? [],
  )

  const color = getFamilyColor(cultivar.genetic_family || '')
  const sortedFlavors = aggregateFlavorNotes(brewList)
  const links = extractCrossLinks(brewList)

  const brewCount = brewList.length

  const contextRows = compactRows([
    field('Typical Origins', cultivar.typical_origins),
    field('Altitude Sensitivity', cultivar.altitude_sensitivity),
    field('Limiting Factors', cultivar.limiting_factors),
    field('Market Context', cultivar.market_context),
  ])

  const brewingRows = compactRows([
    field('Common Processing Methods', cultivar.common_processing_methods),
    field('Typical Flavor Notes', cultivar.typical_flavor_notes),
    field('Acidity Style', cultivar.acidity_style),
    field('Body Style', cultivar.body_style),
    field('Aromatics', cultivar.aromatics),
    field('Terroir Transparency', cultivar.terroir_transparency),
    field('Extraction Sensitivity', cultivar.extraction_sensitivity),
    field('Brewing Tendencies', cultivar.brewing_tendencies),
  ])

  const roastingRows = compactRows([
    field('Roast Tolerance', cultivar.roast_tolerance),
    field('Roast Behavior', cultivar.roast_behavior),
    field('Resting Behavior', cultivar.resting_behavior),
    field('Common Pitfalls', cultivar.common_pitfalls),
  ])

  // Species row dropped (polish-audit Pass 1): the topbar anchor slot already
  // carries the species — topbar = identity, hero meta = differentiation.
  const meta: MetaPair[] = [
    ...(cultivar.genetic_family ? [{ label: 'Family', value: cultivar.genetic_family }] : []),
    ...(cultivar.lineage ? [{ label: 'Lineage', value: cultivar.lineage }] : []),
  ]

  return (
    <div className="ssp-page">
      <DetailBackLink href="/cultivars">Cultivars</DetailBackLink>

      {/* Header */}
      <SspTopBar
        count={brewCount > 0 ? countLabel(brewCount, 'COFFEE') : undefined}
        anchor={cultivar.species ?? undefined}
        kind="Cultivar Profile"
      />
      <SspNamePlate
        title={cultivar.cultivar_name}
        meta={meta}
        coverColor={color}
        edgeColor={color}
      />

      {/* Genetic Background */}
      {cultivar.genetic_background && (
        <div className="ssp-card">
          <SspShead>Genetic Background</SspShead>
          <div className="ssp-prose">{cultivar.genetic_background}</div>
        </div>
      )}

      {/* Cultivar Context */}
      {contextRows.length > 0 && (
        <div className="ssp-card">
          <SspShead>Cultivar Context</SspShead>
          <SspProseRows rows={contextRows} />
        </div>
      )}

      {/* Brewing & Cup Profile */}
      {brewingRows.length > 0 && (
        <div className="ssp-card">
          <SspShead>Brewing &amp; Cup Profile</SspShead>
          <SspProseRows rows={brewingRows} />
        </div>
      )}

      {/* Roasting Characteristics */}
      {roastingRows.length > 0 && (
        <div className="ssp-card">
          <SspShead>Roasting Characteristics</SspShead>
          <SspProseRows rows={roastingRows} />
        </div>
      )}

      {/* Job 2: What I've Learned (synthesis) - rendered only at >=2 brews */}
      {brewCount >= 2 && (
        <SynthesisCard
          title="WHAT I'VE LEARNED ABOUT THIS CULTIVAR"
          fetchKey={cultivar.id}
          endpoint="/api/cultivars/synthesize"
          requestBody={{ cultivarIds: [cultivar.id] }}
          loadingText={`Synthesizing knowledge from ${brewCount} coffees of ${cultivar.cultivar_name}...`}
          existingSynthesis={cultivar.synthesis}
          existingBrewCount={cultivar.synthesis_brew_count}
          currentBrewCount={brewCount}
          existingShortForm={cultivar.short_form_capsule}
          existingSynthesisInputUpdatedAt={cultivar.synthesis_input_max_updated_at}
          currentInputMaxUpdatedAt={currentInputMaxUpdatedAt}
        />
      )}

      {/* Job 3: Coffees brewed in this cultivar */}
      {brewCount > 0 && (
        <CoffeesList
          title="Coffees I Have Brewed In This Cultivar"
          brews={brewList}
          showProcessBadge
          metaFor={(brew) => [brew.terroir?.country, brew.process].filter(Boolean).join(' · ')}
        />
      )}

      {/* Additional Information — collapsed by default */}
      <AdditionalInfo
        flavors={sortedFlavors}
        links={links}
        sections={[
          { dimension: 'terroirs' },
          { dimension: 'processes' },
          { dimension: 'roasters', title: 'ROASTERS WHO ROASTED THIS CULTIVAR' },
        ]}
      />

      {/* Confidence */}
      <ConfidenceCard brewCount={brewCount} />
    </div>
  )
}
