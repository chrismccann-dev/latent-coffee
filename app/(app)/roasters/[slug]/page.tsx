import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Brew } from '@/lib/types'
import {
  getRoasterEntry,
  getRoasterFamily,
  getFamilyColor,
} from '@/lib/roaster-registry'
import {
  SspTopBar,
  SspNamePlate,
  SspShead,
  SspProseRows,
  compactRows,
  countLabel,
  type MetaPair,
} from '@/components/Ssp'
import { AdditionalInfo } from '@/components/AdditionalInfo'
import { DetailBackLink } from '@/components/DetailBackLink'
import { CoffeesList } from '@/components/CoffeesList'
import { ConfidenceCard } from '@/components/ConfidenceCard'
import { aggregateFlavorNotes } from '@/lib/flavor-registry'
import { extractCrossLinks } from '@/lib/cross-links'
import SynthesisCard from '@/components/SynthesisCard'
import { computeInputMaxUpdatedAt } from '@/lib/synthesis/inputUpdatedAt'

function composeBaselineRecipe(entry: NonNullable<ReturnType<typeof getRoasterEntry>>): string | null {
  const dosePart = entry.doseG ? `${entry.doseG}g coffee` : null
  const waterPart = entry.waterG ? `${entry.waterG}g water` : null
  const tempPart = entry.tempC ? `${entry.tempC}°C` : null
  const ratioPart = entry.ratio ? `${entry.ratio} ratio` : null
  const timePart = entry.typicalBrewTime ? `${entry.typicalBrewTime} drawdown` : null
  const agitationPart = entry.agitationLevel ? `${entry.agitationLevel.toLowerCase()} agitation` : null
  const bits = [dosePart, waterPart, tempPart, ratioPart, timePart, agitationPart].filter(Boolean)
  return bits.length > 0 ? bits.join(' · ') : null
}

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
      .select('synthesis, synthesis_brew_count, short_form_capsule, synthesis_input_max_updated_at')
      .eq('roaster', roasterName)
      .maybeSingle(),
  ])

  const brewList = (brewResult.data || []) as Brew[]
  if (brewList.length === 0) notFound()

  const cache = cacheResult.data

  // SYN-7: page-side content-change signal. The roaster adapter is cross-
  // source only on the Latent path (other roasters have no associated
  // roast_learnings rows); fall through to brews-only on every other roaster.
  const { data: roastLearningsUpdates } =
    roasterName === 'Latent'
      ? await supabase.from('roast_learnings').select('updated_at')
      : { data: [] as Array<{ updated_at: string | null }> }
  const currentInputMaxUpdatedAt = computeInputMaxUpdatedAt(
    brewList,
    roastLearningsUpdates ?? [],
  )

  const family = getRoasterFamily(roasterName)
  const color = getFamilyColor(family)
  const entry = getRoasterEntry(roasterName)

  const sortedFlavors = aggregateFlavorNotes(brewList)
  const links = extractCrossLinks(brewList)

  const brewCount = brewList.length

  const locationStr = entry?.location && entry?.country && entry.location !== entry.country
    ? `${entry.location}, ${entry.country}`
    : entry?.location ?? entry?.country ?? null

  // --- Brewing Philosophy: Brew Guide value (3-state render gate) ---
  let brewGuideValue: React.ReactNode = null
  if (entry) {
    const linkLabel = entry.brewGuideLink?.replace(/^https?:\/\//, '').replace(/\/$/, '')
    if (entry.brewGuideStatus === 'official' && entry.brewGuideLink) {
      brewGuideValue = (
        <>
          <a href={entry.brewGuideLink} target="_blank" rel="noreferrer noopener" className="underline">
            {linkLabel}
          </a>
          <span className="font-mono text-xxs text-latent-mid ml-2">(Official)</span>
        </>
      )
    } else if (entry.brewGuideStatus === 'official') {
      brewGuideValue = `Official guide${entry.brewGuideType ? ` — ${entry.brewGuideType}` : ''}`
    } else if (entry.brewGuideStatus === 'implied' && entry.brewGuideLink) {
      brewGuideValue = (
        <>
          <a href={entry.brewGuideLink} target="_blank" rel="noreferrer noopener" className="underline">
            {linkLabel}
          </a>
          <span className="font-mono text-xxs text-latent-mid ml-2">
            (Implied{entry.brewGuideType ? ` — sourced from ${entry.brewGuideType}` : ''})
          </span>
        </>
      )
    } else if (entry.brewGuideStatus === 'implied') {
      brewGuideValue = `Implied recipe${entry.brewGuideType ? ` — sourced from ${entry.brewGuideType}` : ''}`
    } else {
      brewGuideValue = 'No brew guide'
    }
  }

  const baselineRecipe = entry ? composeBaselineRecipe(entry) : null
  const recipeRows = entry
    ? compactRows([
        { label: 'Primary brewer', value: entry.primaryBrewer },
        { label: 'Filter type', value: entry.filterType },
        { label: 'Baseline recipe', value: baselineRecipe },
        { label: 'Extraction intent', value: entry.extractionIntent },
        { label: 'Brew adjustment method', value: entry.brewAdjustmentMethod },
        { label: 'Over-extraction tolerance', value: entry.overExtractionTolerance },
        { label: 'Process sensitivity', value: entry.processSensitivity },
        { label: 'Failure mode', value: entry.failureMode },
        { label: 'Other notes', value: entry.notes },
      ])
    : []

  const brewingRows = entry
    ? compactRows([
        { label: 'Brew guide', value: brewGuideValue },
        { label: 'House style', value: entry.houseStyle },
        { label: 'Brewing intent', value: entry.extractionPurpose },
      ])
    : []

  const roastingRows = entry
    ? compactRows([
        { label: 'Roast style', value: entry.roastStyle },
        { label: 'Development bias', value: entry.developmentBias },
      ])
    : []

  const restingRows = entry
    ? compactRows([{ label: 'Rest curve', value: entry.restCurve }])
    : []

  // Additional Information metadata sub-block — surface leftover rich fields
  // not represented in the dedicated sections above.
  const showBmrHouseStyle = entry?.bmrHouseStyle && entry.bmrHouseStyle !== entry.houseStyle
  const metadataRows = entry
    ? compactRows([
        { label: 'Strategy tag', value: entry.strategyTag },
        { label: 'Primary driver', value: entry.primaryDriver },
        { label: 'Brew guide source', value: entry.brewGuideSource },
        { label: 'Brew guide type', value: entry.brewGuideType },
        { label: 'Calibration role', value: entry.calibrationRole },
        { label: 'House-style confidence', value: entry.confidenceLevel },
        { label: 'BMR house style', value: showBmrHouseStyle ? entry.bmrHouseStyle : null },
        { label: 'BMR notes', value: entry.bmrNotes },
      ])
    : []

  // Family + Coffees rows dropped (polish-audit Pass 1): the topbar anchor
  // slot carries the family and the topbar count slot carries the coffee
  // count — topbar = identity, hero meta = differentiation. (The CoffeesList
  // shead keeps its own per-section count.)
  const meta: MetaPair[] = [
    ...(locationStr ? [{ label: 'Location', value: locationStr }] : []),
  ]

  return (
    <div className="ssp-page">
      <DetailBackLink href="/roasters">Roasters</DetailBackLink>

      {/* Header */}
      <SspTopBar
        count={countLabel(brewCount, 'COFFEE')}
        anchor={`${family} family`}
        kind="Roaster Profile"
      />
      <SspNamePlate
        title={entry?.name || roasterName}
        meta={meta}
        coverColor={color}
        edgeColor={color}
      />

      {/* Primary — Coffees list. Roaster is the navigational spine into brews
          (recall is by roaster + bag style, not coffee name), so the coffees
          list is the page's gateway job and leads right after the hero. Promoted
          to top in the 2026-06-03 priority-stack recount; see
          docs/design-system.md § Detail-page grammar (the roaster exception). */}
      <CoffeesList
        title="Coffees I Have Brewed From This Roaster"
        brews={brewList}
        metaFor={(brew) =>
          [brew.variety, brew.producer, brew.terroir?.country, brew.process].filter(Boolean).join(' · ')
        }
      />

      {/* Secondary — Roaster info (brewing template · philosophy · reference
          recipe · resting). The "why" / supporting context behind a coffee from
          this roaster; visible, below the primary coffees list. */}
      {entry && (
        <div className="ssp-card">
          <SspShead>Brewing Philosophy</SspShead>
          <SspProseRows rows={brewingRows} />
        </div>
      )}

      {roastingRows.length > 0 && (
        <div className="ssp-card">
          <SspShead>Roasting Philosophy</SspShead>
          <SspProseRows rows={roastingRows} />
        </div>
      )}

      {recipeRows.length > 0 && (
        <div className="ssp-card">
          <SspShead>Roaster&apos;s Reference Brew Recipe</SspShead>
          <SspProseRows rows={recipeRows} />
        </div>
      )}

      {restingRows.length > 0 && (
        <div className="ssp-card">
          <SspShead>Resting Info For This Roaster</SspShead>
          <SspProseRows rows={restingRows} />
        </div>
      )}

      {/* Tertiary — Synthesis, collapsed by default (the roaster exception:
          synthesis is nice-to-have on a roaster page vs. front-and-center on
          terroir / cultivar / processes). 2026-06-03 priority-stack recount. */}
      <SynthesisCard
        title="WHAT I'VE LEARNED ABOUT THIS ROASTER"
        fetchKey={roasterName}
        endpoint="/api/roasters/synthesize"
        requestBody={{ roaster: roasterName }}
        loadingText={`Synthesizing knowledge from ${brewCount} ${brewCount === 1 ? 'coffee' : 'coffees'} from ${roasterName}...`}
        existingSynthesis={cache?.synthesis ?? null}
        existingBrewCount={cache?.synthesis_brew_count ?? null}
        currentBrewCount={brewCount}
        existingShortForm={cache?.short_form_capsule ?? null}
        existingSynthesisInputUpdatedAt={cache?.synthesis_input_max_updated_at ?? null}
        currentInputMaxUpdatedAt={currentInputMaxUpdatedAt}
        collapsible
      />

      {/* Additional Information — collapsed by default */}
      <AdditionalInfo
        flavors={sortedFlavors}
        links={links}
        sections={[
          { dimension: 'cultivars' },
          { dimension: 'terroirs' },
          { dimension: 'processes' },
        ]}
        prepend={
          metadataRows.length > 0 ? (
            <div className="ssp-sub">
              <h3>ROASTER METADATA</h3>
              <SspProseRows rows={metadataRows} />
            </div>
          ) : null
        }
      />

      {/* Confidence */}
      <ConfidenceCard brewCount={brewCount} />
    </div>
  )
}
