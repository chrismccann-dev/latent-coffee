// Sub Pages 4 (2026-05-11) — Honey subprocess sub-page.
// Re-skinned to the v2 Ssp* lab-document family in Redesign Sprint 5 (2026-05-29).
//
// URL: /processes/honey/{subprocess}
// Subprocesses: white / generic / yellow / red / black / purple / hydro
// Eligibility: Rule 3 — Honey color tiers are structurally meaningful, so
// even a 1-brew subprocess gets a page. Only Honey base supports subprocess
// routing today; other bases return notFound.

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Brew } from '@/lib/types'
import {
  SspTopBar,
  SspNamePlate,
  SspShead,
  SspStructure,
  type MetaPair,
} from '@/components/Ssp'
import { AdditionalInfo } from '@/components/AdditionalInfo'
import { DetailBackLink } from '@/components/DetailBackLink'
import { ConfidenceCard } from '@/components/ConfidenceCard'
import { CoffeesList } from '@/components/CoffeesList'
import { ProcessDescriptionCard } from '@/components/ProcessDescriptionCard'
import { aggregateFlavorNotes } from '@/lib/flavor-registry'
import { extractCrossLinks } from '@/lib/cross-links'
import SynthesisCard from '@/components/SynthesisCard'
import { computeInputMaxUpdatedAt } from '@/lib/synthesis/inputUpdatedAt'
import { getFamilyColor, getHoneySubprocessOverview } from '@/lib/process-registry'
import { aggregateHoneySubprocess } from '@/lib/process-aggregation'
import {
  parseBaseSlug,
  parseSubprocessSlug,
  honeySubprocessAggregationKey,
} from '@/lib/process-routing'

export default async function HoneySubprocessPage({
  params,
}: {
  params: { base: string; subprocess: string }
}) {
  const base = parseBaseSlug(params.base)
  // Only Honey base supports subprocess routing.
  if (base !== 'Honey') notFound()

  const subprocess = parseSubprocessSlug(params.subprocess)
  if (!subprocess) notFound()

  const supabase = createClient()

  const [{ data: brews }, { data: cache }] = await Promise.all([
    supabase
      .from('brews')
      .select(`*, terroir:terroirs(id, country, admin_region, macro_terroir), cultivar:cultivars(id, cultivar_name, lineage)`)
      .eq('base_process', 'Honey')
      .eq('subprocess', subprocess)
      .order('created_at', { ascending: false }),
    supabase
      .from('process_aggregation_syntheses')
      .select('synthesis, synthesis_brew_count, short_form_capsule, synthesis_input_max_updated_at')
      .eq('aggregation_kind', 'honey_subprocess')
      .eq('aggregation_key', honeySubprocessAggregationKey(subprocess))
      .maybeSingle(),
  ])

  const brewList = aggregateHoneySubprocess((brews ?? []) as Brew[], subprocess)
  if (brewList.length === 0) notFound()

  const color = getFamilyColor('Honey')
  const sortedFlavors = aggregateFlavorNotes(brewList)
  const overview = getHoneySubprocessOverview(subprocess)
  // Generic Honey IS the default Honey process (Chris's convention) — title it
  // "Honey" rather than the canonical "Generic Honey" so the page reads as the
  // base process it represents. Specific tiers keep their canonical name.
  const displayTitle = subprocess === 'Generic Honey' ? 'Honey' : subprocess
  const links = extractCrossLinks(brewList)

  const meta: MetaPair[] = [
    { label: 'Base', value: 'Honey' },
    { label: 'Coffees', value: `${brewList.length}` },
  ]

  return (
    <div className="ssp-page">
      <DetailBackLink href="/processes/honey">Honey</DetailBackLink>

      {/* Header */}
      <SspTopBar roaster="Honey" kind="Process Variant" />
      <SspNamePlate title={displayTitle} meta={meta} coverColor={color} edgeColor={color} />

      {/* Process Description (authored — priority-stack recount Tweak 6) */}
      <ProcessDescriptionCard overview={overview} />

      {/* Process Breakdown */}
      <div className="ssp-card">
        <SspShead>Process Breakdown</SspShead>
        <SspStructure
          rows={[
            { lbl: 'Base', chips: [{ name: 'Honey' }] },
            { lbl: 'Subprocess', chips: [{ name: subprocess }] },
          ]}
        />
      </div>

      {/* What I Learned (synthesis) */}
      {brewList.length >= 2 && (
        <SynthesisCard
          title="WHAT I LEARNED ABOUT THIS PROCESS"
          fetchKey={`honey_subprocess:${subprocess}`}
          endpoint="/api/processes/synthesize"
          requestBody={{ kind: 'honey_subprocess', key: honeySubprocessAggregationKey(subprocess) }}
          loadingText={`Synthesizing knowledge from ${brewList.length} ${subprocess.toLowerCase()} coffees...`}
          existingSynthesis={cache?.synthesis ?? null}
          existingBrewCount={cache?.synthesis_brew_count ?? null}
          currentBrewCount={brewList.length}
          existingShortForm={cache?.short_form_capsule ?? null}
          existingSynthesisInputUpdatedAt={cache?.synthesis_input_max_updated_at ?? null}
          currentInputMaxUpdatedAt={computeInputMaxUpdatedAt(brewList)}
        />
      )}

      {/* Coffees list */}
      <CoffeesList title="Coffees I Have Experienced With This Process" brews={brewList} />

      {/* Additional Information */}
      <AdditionalInfo
        flavors={sortedFlavors}
        links={links}
        sections={[
          { dimension: 'cultivars' },
          { dimension: 'terroirs' },
          { dimension: 'roasters' },
        ]}
      />

      {/* Confidence */}
      <ConfidenceCard brewCount={brewList.length} />
    </div>
  )
}
