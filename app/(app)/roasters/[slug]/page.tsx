import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Brew } from '@/lib/types'
import { getCoverColor } from '@/lib/brew-colors'
import {
  getRoasterEntry,
  getRoasterFamily,
  getFamilyColor,
} from '@/lib/roaster-registry'
import { SectionCard } from '@/components/SectionCard'
import { TagLinkList } from '@/components/TagLinkList'
import { FlavorNotesByFamily } from '@/components/FlavorNotesByFamily'
import { CollapsibleBlock } from '@/components/CollapsibleBlock'
import { aggregateFlavorNotes } from '@/lib/flavor-registry'
import SynthesisCard from '@/components/SynthesisCard'
import { computeInputMaxUpdatedAt } from '@/lib/synthesis/inputUpdatedAt'

interface LabelledFieldProps {
  label: string
  value?: string | null
}

function LabelledField({ label, value }: LabelledFieldProps) {
  if (!value) return null
  return (
    <div className="mb-3 last:mb-0">
      <span className="font-sans text-sm font-semibold">{label}: </span>
      <span className="font-sans text-sm">{value}</span>
    </div>
  )
}

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
  const confidence = brewCount >= 5 ? { emoji: '🟢', label: 'HIGH', desc: `${brewCount} coffees explored` }
    : brewCount >= 2 ? { emoji: '🟡', label: 'MEDIUM', desc: `${brewCount} coffees explored` }
    : { emoji: '🔴', label: 'LOW', desc: `${brewCount} ${brewCount === 1 ? 'coffee' : 'coffees'} explored` }

  const locationStr = entry?.location && entry?.country && entry.location !== entry.country
    ? `${entry.location}, ${entry.country}`
    : entry?.location ?? entry?.country ?? null

  const hasRoastingPhilosophy = Boolean(entry?.roastStyle || entry?.developmentBias)
  const baselineRecipe = entry ? composeBaselineRecipe(entry) : null
  const hasGeneralizedRecipe = Boolean(
    entry && (
      entry.primaryBrewer || entry.extractionIntent || entry.brewAdjustmentMethod ||
      entry.overExtractionTolerance || entry.filterType || baselineRecipe ||
      entry.processSensitivity || entry.failureMode || entry.notes
    )
  )
  const hasRestingInfo = Boolean(entry?.restCurve)

  // Additional Information metadata sub-block — surface leftover rich fields
  // not represented in the dedicated sections above.
  const showBmrHouseStyle = entry?.bmrHouseStyle && entry.bmrHouseStyle !== entry.houseStyle
  const hasMetadata = Boolean(
    entry && (
      entry.strategyTag || entry.primaryDriver || entry.brewGuideSource ||
      entry.brewGuideType || entry.calibrationRole ||
      entry.confidenceLevel || showBmrHouseStyle || entry.bmrNotes
    )
  )

  const hasAdditionalInfo = hasMetadata || sortedFlavors.length > 0 ||
    cultivarMap.size > 0 || terroirMap.size > 0 || processSet.size > 0

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
              {entry?.name || roasterName}
            </h1>
            <p className="font-mono text-xs text-latent-mid">
              {family} family &middot; {brewCount} {brewCount === 1 ? 'coffee' : 'coffees'}
              {locationStr && ` · ${locationStr}`}
            </p>
          </div>
        </div>
      </div>

      {/* Job 1: Brewing Philosophy */}
      {entry && (
        <SectionCard title="BREWING PHILOSOPHY">
          <div className="mb-3 last:mb-0">
            <span className="font-sans text-sm font-semibold">Brew Guide: </span>
            {entry.brewGuideLink ? (
              <a
                href={entry.brewGuideLink}
                target="_blank"
                rel="noreferrer noopener"
                className="font-sans text-sm underline"
              >
                {entry.brewGuideLink.replace(/^https?:\/\//, '').replace(/\/$/, '')}
              </a>
            ) : (
              <span className="font-sans text-sm">No official brew guide</span>
            )}
            {entry.brewGuideSource && entry.brewGuideLink && (
              <span className="font-mono text-xxs text-latent-mid ml-2">({entry.brewGuideSource})</span>
            )}
          </div>
          <LabelledField label="House Style" value={entry.houseStyle} />
          <LabelledField label="Brewing Intent" value={entry.extractionPurpose} />
        </SectionCard>
      )}

      {/* Job 2a: Roasting Philosophy */}
      {hasRoastingPhilosophy && (
        <SectionCard title="ROASTING PHILOSOPHY">
          <LabelledField label="Roast Style" value={entry?.roastStyle} />
          <LabelledField label="Development Bias" value={entry?.developmentBias} />
        </SectionCard>
      )}

      {/* Job 1 (deep): Roasters Reference Brew Recipe */}
      {hasGeneralizedRecipe && entry && (
        <SectionCard title="ROASTERS REFERENCE BREW RECIPE">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <div>
              <LabelledField label="Primary brewer" value={entry.primaryBrewer} />
              <LabelledField label="Extraction intent" value={entry.extractionIntent} />
              <LabelledField label="Brew adjustment method" value={entry.brewAdjustmentMethod} />
              <LabelledField label="Over-extraction tolerance" value={entry.overExtractionTolerance} />
            </div>
            <div>
              <LabelledField label="Filter type" value={entry.filterType} />
              <LabelledField label="Baseline Recipe" value={baselineRecipe} />
            </div>
          </div>
          {(entry.processSensitivity || entry.failureMode || entry.notes) && (
            <div className="mt-4 pt-4 border-t border-latent-border">
              <LabelledField label="Process sensitivity" value={entry.processSensitivity} />
              <LabelledField label="Failure mode" value={entry.failureMode} />
              <LabelledField label="Other Notes" value={entry.notes} />
            </div>
          )}
        </SectionCard>
      )}

      {/* Job 2b: Resting Info */}
      {hasRestingInfo && (
        <SectionCard title="RESTING INFO FOR THIS ROASTER">
          <LabelledField label="Rest curve" value={entry?.restCurve} />
        </SectionCard>
      )}

      {/* Job 3: Coffees I Have Brewed */}
      <SectionCard title={`COFFEES I HAVE BREWED FROM THIS ROASTER (${brewCount})`}>
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
                <div className="font-mono text-xxs text-latent-mid">
                  {[brew.variety, brew.producer, brew.terroir?.country, brew.process].filter(Boolean).join(' · ')}
                </div>
              </div>
              <span className="font-mono text-xs text-latent-mid opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
            </Link>
          ))}
        </div>
      </SectionCard>

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

      {/* Additional Information — collapsed on mobile, expanded on desktop */}
      {hasAdditionalInfo && (
        <CollapsibleBlock title="ADDITIONAL INFORMATION">
          {hasMetadata && entry && (
            <div className="mb-6 last:mb-0">
              <div className="font-mono text-xxs font-semibold tracking-wide uppercase mb-2 text-latent-mid">
                ROASTER METADATA
              </div>
              <LabelledField label="Strategy tag" value={entry.strategyTag} />
              <LabelledField label="Primary driver" value={entry.primaryDriver} />
              <LabelledField label="Brew guide source" value={entry.brewGuideSource} />
              <LabelledField label="Brew guide type" value={entry.brewGuideType} />
              <LabelledField label="Calibration role" value={entry.calibrationRole} />
              <LabelledField label="House-style confidence" value={entry.confidenceLevel} />
              {showBmrHouseStyle && (
                <LabelledField label="BMR house style" value={entry.bmrHouseStyle} />
              )}
              <LabelledField label="BMR notes" value={entry.bmrNotes} />
            </div>
          )}

          <FlavorNotesByFamily notes={sortedFlavors} bare />

          <TagLinkList
            title="CULTIVARS EXPLORED"
            bare
            items={Array.from(cultivarMap.entries()).map(([name, id]) => ({
              key: name, label: name, href: `/cultivars/${id}`,
            }))}
          />

          <TagLinkList
            title="TERROIRS EXPLORED"
            bare
            items={Array.from(terroirMap.entries()).map(([name, { id, country }]) => ({
              key: name, label: `${country} / ${name}`, href: `/terroirs/${id}`,
            }))}
          />

          <TagLinkList
            title="PROCESSES EXPLORED"
            bare
            items={Array.from(processSet).map((p) => ({
              key: p, label: p, href: `/processes/${p.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            }))}
          />
        </CollapsibleBlock>
      )}

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
