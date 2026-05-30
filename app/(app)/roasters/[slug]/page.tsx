import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
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
  type MetaPair,
} from '@/components/Ssp'
import { TagLinkList } from '@/components/TagLinkList'
import { FlavorNotesByFamily } from '@/components/FlavorNotesByFamily'
import { CollapsibleBlock } from '@/components/CollapsibleBlock'
import { CoffeesList } from '@/components/CoffeesList'
import { ConfidenceCard } from '@/components/ConfidenceCard'
import { aggregateFlavorNotes } from '@/lib/flavor-registry'
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
    if (brew.base_process) processSet.add(brew.base_process)
  }

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

  const hasAdditionalInfo = metadataRows.length > 0 || sortedFlavors.length > 0 ||
    cultivarMap.size > 0 || terroirMap.size > 0 || processSet.size > 0

  const meta: MetaPair[] = [
    { label: 'Family', value: family },
    ...(locationStr ? [{ label: 'Location', value: locationStr }] : []),
    { label: 'Coffees', value: `${brewCount}` },
  ]

  return (
    <div className="ssp-page">
      <Link
        href="/roasters"
        className="font-mono text-xs uppercase tracking-[0.16em] text-latent-mid hover:text-latent-fg"
      >
        ← Back to Roasters
      </Link>

      {/* Header */}
      <SspTopBar roaster={`${family} family`} kind="Roaster Profile" />
      <SspNamePlate
        title={entry?.name || roasterName}
        meta={meta}
        coverColor={color}
        edgeColor={color}
      />

      {/* Job 1: Brewing Philosophy */}
      {entry && (
        <div className="ssp-card">
          <SspShead>Brewing Philosophy</SspShead>
          <SspProseRows rows={brewingRows} />
        </div>
      )}

      {/* Job 2a: Roasting Philosophy */}
      {roastingRows.length > 0 && (
        <div className="ssp-card">
          <SspShead>Roasting Philosophy</SspShead>
          <SspProseRows rows={roastingRows} />
        </div>
      )}

      {/* Job 1 (deep): Roasters Reference Brew Recipe */}
      {recipeRows.length > 0 && (
        <div className="ssp-card">
          <SspShead>Roasters Reference Brew Recipe</SspShead>
          <SspProseRows rows={recipeRows} />
        </div>
      )}

      {/* Job 2b: Resting Info */}
      {restingRows.length > 0 && (
        <div className="ssp-card">
          <SspShead>Resting Info For This Roaster</SspShead>
          <SspProseRows rows={restingRows} />
        </div>
      )}

      {/* Job 3: Coffees I Have Brewed */}
      <CoffeesList
        title="Coffees I Have Brewed From This Roaster"
        brews={brewList}
        metaFor={(brew) =>
          [brew.variety, brew.producer, brew.terroir?.country, brew.process].filter(Boolean).join(' · ')
        }
      />

      {/* Synthesis (demoted below coffees list per three-jobs reorder) */}
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
      />

      {/* Additional Information — collapsed by default */}
      {hasAdditionalInfo && (
        <CollapsibleBlock title="ADDITIONAL INFORMATION">
          {metadataRows.length > 0 && (
            <div className="ssp-sub">
              <h3>ROASTER METADATA</h3>
              <SspProseRows rows={metadataRows} />
            </div>
          )}

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
              key: p, label: p, href: `/processes/${p.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            }))}
          />
        </CollapsibleBlock>
      )}

      {/* Confidence */}
      <ConfidenceCard brewCount={brewCount} />
    </div>
  )
}
