import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Brew, Cultivar } from '@/lib/types'
import { SectionCard } from '@/components/SectionCard'
import { TagLinkList } from '@/components/TagLinkList'
import { FlavorNotesByFamily } from '@/components/FlavorNotesByFamily'
import { CollapsibleBlock } from '@/components/CollapsibleBlock'
import { aggregateFlavorNotes } from '@/lib/flavor-registry'
import SynthesisCard from '@/components/SynthesisCard'
import { computeInputMaxUpdatedAt } from '@/lib/synthesis/inputUpdatedAt'
import { getFamilyColor } from '@/lib/cultivar-family-colors'

interface GridFieldProps {
  label: string
  value: string | string[] | null
}

function GridField({ label, value }: GridFieldProps) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null
  const display = Array.isArray(value) ? value.join(', ') : value
  return (
    <div>
      <div className="font-mono text-xxs font-semibold text-latent-fg uppercase mb-1">{label}</div>
      <div className="font-sans text-sm leading-relaxed">{display}</div>
    </div>
  )
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
  const confidence =
    brewCount >= 5
      ? { emoji: '🟢', label: 'HIGH', desc: `${brewCount} coffees explored` }
      : brewCount >= 2
        ? { emoji: '🟡', label: 'MEDIUM', desc: `${brewCount} coffees explored` }
        : { emoji: '🔴', label: 'LOW', desc: `${brewCount} ${brewCount === 1 ? 'coffee' : 'coffees'} explored` }

  const hasCultivarContext =
    cultivar.typical_origins?.length ||
    cultivar.altitude_sensitivity ||
    cultivar.limiting_factors?.length ||
    cultivar.market_context

  const hasBrewingProfile =
    cultivar.common_processing_methods?.length ||
    cultivar.typical_flavor_notes?.length ||
    cultivar.acidity_style ||
    cultivar.body_style ||
    cultivar.aromatics ||
    cultivar.terroir_transparency ||
    cultivar.extraction_sensitivity ||
    cultivar.brewing_tendencies

  const hasRoasting =
    cultivar.roast_tolerance ||
    cultivar.roast_behavior ||
    cultivar.resting_behavior ||
    cultivar.common_pitfalls?.length

  const hasAdditionalInfo =
    sortedFlavors.length > 0 || terroirMap.size > 0 || processSet.size > 0 || roasterSet.size > 0

  const breadcrumb = [cultivar.species, cultivar.genetic_family, cultivar.lineage]
    .filter(Boolean)
    .join(' → ')

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
          <div className="w-16 h-16 rounded flex-shrink-0" style={{ backgroundColor: color }} />
          <div className="flex-1">
            <h1 className="font-sans text-2xl font-semibold mb-1">
              {cultivar.cultivar_name}
            </h1>
            {breadcrumb && (
              <p className="font-mono text-xs text-latent-mid">{breadcrumb}</p>
            )}
          </div>
        </div>
      </div>

      {/* Genetic Background */}
      {cultivar.genetic_background && (
        <SectionCard title="GENETIC BACKGROUND">
          <p className="font-sans text-sm leading-relaxed">{cultivar.genetic_background}</p>
        </SectionCard>
      )}

      {/* Cultivar Context (2-col grid, 4 fields) */}
      {hasCultivarContext && (
        <SectionCard title="CULTIVAR CONTEXT">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <GridField label="Typical Origins" value={cultivar.typical_origins} />
            <GridField label="Altitude Sensitivity" value={cultivar.altitude_sensitivity} />
            <GridField label="Limiting Factors" value={cultivar.limiting_factors} />
            <GridField label="Market Context" value={cultivar.market_context} />
          </div>
        </SectionCard>
      )}

      {/* Brewing & Cup Profile (2-col grid, 8 fields) */}
      {hasBrewingProfile && (
        <SectionCard title="BREWING & CUP PROFILE">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <GridField label="Common Processing Methods" value={cultivar.common_processing_methods} />
            <GridField label="Typical Flavor Notes" value={cultivar.typical_flavor_notes} />
            <GridField label="Acidity Style" value={cultivar.acidity_style} />
            <GridField label="Body Style" value={cultivar.body_style} />
            <GridField label="Aromatics" value={cultivar.aromatics} />
            <GridField label="Terroir Transparency" value={cultivar.terroir_transparency} />
            <GridField label="Extraction Sensitivity" value={cultivar.extraction_sensitivity} />
            <GridField label="Brewing Tendencies" value={cultivar.brewing_tendencies} />
          </div>
        </SectionCard>
      )}

      {/* Roasting Characteristics (2-col grid, 4 fields) */}
      {hasRoasting && (
        <SectionCard title="ROASTING CHARACTERISTICS">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <GridField label="Roast Tolerance" value={cultivar.roast_tolerance} />
            <GridField label="Roast Behavior" value={cultivar.roast_behavior} />
            <GridField label="Resting Behavior" value={cultivar.resting_behavior} />
            <GridField label="Common Pitfalls" value={cultivar.common_pitfalls} />
          </div>
        </SectionCard>
      )}

      {/* Job 2: What I've Learned (synthesis) - rendered only at >=2 brews */}
      {brewList.length >= 2 && (
        <SynthesisCard
          title="WHAT I'VE LEARNED ABOUT THIS CULTIVAR"
          fetchKey={cultivar.id}
          endpoint="/api/cultivars/synthesize"
          requestBody={{ cultivarIds: [cultivar.id] }}
          loadingText={`Synthesizing knowledge from ${brewList.length} coffees of ${cultivar.cultivar_name}...`}
          existingSynthesis={cultivar.synthesis}
          existingBrewCount={cultivar.synthesis_brew_count}
          currentBrewCount={brewList.length}
          existingShortForm={cultivar.short_form_capsule}
          existingSynthesisInputUpdatedAt={cultivar.synthesis_input_max_updated_at}
          currentInputMaxUpdatedAt={currentInputMaxUpdatedAt}
        />
      )}

      {/* Job 3: Coffees brewed in this cultivar */}
      {brewList.length > 0 && (
        <SectionCard title={`COFFEES I HAVE BREWED IN THIS CULTIVAR (${brewList.length})`}>
          <div className="space-y-0">
            {brewList.map((brew) => (
              <Link
                key={brew.id}
                href={`/brews/${brew.id}`}
                className="flex items-center gap-3 py-3 border border-latent-border rounded-md mb-2 last:mb-0 px-4 hover:bg-latent-bg transition-colors group"
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
                    {[brew.terroir?.country, brew.process].filter(Boolean).join(' · ')}
                  </div>
                </div>
                <span className="font-mono text-xs text-latent-mid opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
              </Link>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Supporting context: flavor notes + cross-axis tag lists.
          Visible on desktop, collapsed-by-default on mobile. */}
      {hasAdditionalInfo && (
        <CollapsibleBlock title="ADDITIONAL INFORMATION">
          <FlavorNotesByFamily
            notes={sortedFlavors}
            title="FLAVOR NOTES I HAVE EXPERIENCED"
            bare
          />
          <TagLinkList
            title="TERROIRS I HAVE EXPLORED"
            bare
            items={Array.from(terroirMap.entries()).map(([name, { id }]) => ({
              key: name,
              label: name,
              href: `/terroirs/${id}`,
            }))}
          />
          <TagLinkList
            title="PROCESSES I HAVE EXPLORED"
            bare
            items={Array.from(processSet).map((p) => ({
              key: p,
              label: p,
              href: `/processes/${p.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            }))}
          />
          <TagLinkList
            title="ROASTERS WHO ROASTED THIS CULTIVAR"
            bare
            items={Array.from(roasterSet).map((r) => ({
              key: r,
              label: r,
              href: `/roasters/${encodeURIComponent(r)}`,
            }))}
          />
        </CollapsibleBlock>
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
