import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Brew, Cultivar } from '@/lib/types'
import {
  SspTopBar,
  SspNamePlate,
  SspShead,
  SspProseRows,
  compactRows,
  type MetaPair,
  type ProseRow,
} from '@/components/Ssp'
import { TagLinkList } from '@/components/TagLinkList'
import { FlavorNotesByFamily } from '@/components/FlavorNotesByFamily'
import { CollapsibleBlock } from '@/components/CollapsibleBlock'
import { CoffeesList } from '@/components/CoffeesList'
import { ConfidenceCard } from '@/components/ConfidenceCard'
import { aggregateFlavorNotes } from '@/lib/flavor-registry'
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

  const terroirMap = new Map<string, { id: string; country: string }>()
  const processSet = new Set<string>()
  const roasterSet = new Set<string>()
  for (const brew of brewList) {
    if (brew.terroir?.country && brew.terroir.id) {
      const key = brew.terroir.macro_terroir || brew.terroir.admin_region || brew.terroir.country
      if (!terroirMap.has(key)) {
        terroirMap.set(key, { id: brew.terroir.id, country: brew.terroir.country })
      }
    }
    if (brew.base_process) processSet.add(brew.base_process)
    if (brew.roaster) roasterSet.add(brew.roaster)
  }

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

  const hasAdditionalInfo =
    sortedFlavors.length > 0 || terroirMap.size > 0 || processSet.size > 0 || roasterSet.size > 0

  const meta: MetaPair[] = [
    ...(cultivar.species ? [{ label: 'Species', value: cultivar.species }] : []),
    ...(cultivar.genetic_family ? [{ label: 'Family', value: cultivar.genetic_family }] : []),
    ...(cultivar.lineage ? [{ label: 'Lineage', value: cultivar.lineage }] : []),
  ]

  return (
    <div className="ssp-page">
      <Link
        href="/cultivars"
        className="font-mono text-xs uppercase tracking-[0.16em] text-latent-mid hover:text-latent-fg"
      >
        ← Back to Cultivars
      </Link>

      {/* Header */}
      <SspTopBar roaster={cultivar.species ?? undefined} kind="Cultivar Profile" />
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
      {hasAdditionalInfo && (
        <CollapsibleBlock title="ADDITIONAL INFORMATION">
          <FlavorNotesByFamily notes={sortedFlavors} title="FLAVOR NOTES I HAVE EXPERIENCED" />
          <TagLinkList
            title="TERROIRS I HAVE EXPLORED"
            items={Array.from(terroirMap.entries()).map(([name, { id }]) => ({
              key: name,
              label: name,
              href: `/terroirs/${id}`,
            }))}
          />
          <TagLinkList
            title="PROCESSES I HAVE EXPLORED"
            items={Array.from(processSet).map((p) => ({
              key: p,
              label: p,
              href: `/processes/${p.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            }))}
          />
          <TagLinkList
            title="ROASTERS WHO ROASTED THIS CULTIVAR"
            items={Array.from(roasterSet).map((r) => ({
              key: r,
              label: r,
              href: `/roasters/${encodeURIComponent(r)}`,
            }))}
          />
        </CollapsibleBlock>
      )}

      {/* Confidence */}
      <ConfidenceCard brewCount={brewCount} />
    </div>
  )
}
