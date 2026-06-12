// Sub Pages 4 (2026-05-11) — signature method page.
// Re-skinned to the v2 Ssp* lab-document family in Redesign Sprint 5 (2026-05-29).
//
// URL: /processes/signatures/{name}
// Eligibility: Rule 2 — signature methods always earn a page, even at 1 brew.
// Process Overview + Observed Cup Profile come from authored SignatureEntry
// content (Tier B). "What I Learned" synthesis is hidden below 2 brews.

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
import { buildBreakdownRows } from '@/lib/process-breakdown'
import { AdditionalInfo } from '@/components/AdditionalInfo'
import { DetailBackLink } from '@/components/DetailBackLink'
import { ConfidenceCard } from '@/components/ConfidenceCard'
import { CoffeesList } from '@/components/CoffeesList'
import { aggregateFlavorNotes } from '@/lib/flavor-registry'
import { extractCrossLinks } from '@/lib/cross-links'
import SynthesisCard from '@/components/SynthesisCard'
import { computeInputMaxUpdatedAt } from '@/lib/synthesis/inputUpdatedAt'
import { getSignatureEntry, getFamilyColor } from '@/lib/process-registry'
import { aggregateSignature } from '@/lib/process-aggregation'
import { parseSignatureSlug, signatureAggregationKey } from '@/lib/process-routing'

export default async function SignaturePage({
  params,
}: {
  params: { name: string }
}) {
  const name = parseSignatureSlug(params.name)
  if (!name) notFound()

  const entry = getSignatureEntry(name)
  if (!entry) notFound()

  const supabase = createClient()

  const { data: allBrews } = await supabase
    .from('brews')
    .select(`*, terroir:terroirs(id, country, admin_region, macro_terroir), cultivar:cultivars(id, cultivar_name, lineage)`)
    .eq('signature_method', name)
    .order('created_at', { ascending: false })

  const brewList = aggregateSignature((allBrews ?? []) as Brew[], name)
  // Signatures always render even at 0 brews when authored content exists,
  // but for now require ≥1 brew so we don't ship empty pages.
  if (brewList.length === 0) notFound()

  const cacheKey = signatureAggregationKey(name)
  const { data: cache } = await supabase
    .from('process_aggregation_syntheses')
    .select('synthesis, synthesis_brew_count, short_form_capsule, synthesis_input_max_updated_at')
    .eq('aggregation_kind', 'signature')
    .eq('aggregation_key', cacheKey)
    .maybeSingle()

  const color = getFamilyColor(entry.base === 'Wet-hulled' ? 'Other' : entry.base)
  const sortedFlavors = aggregateFlavorNotes(brewList)
  const links = extractCrossLinks(brewList)

  const breakdownRows = buildBreakdownRows([
    { lbl: 'Base', chips: [entry.base] },
    { lbl: 'Fermentation', chips: entry.fermentation_modifiers ?? [] },
    { lbl: 'Drying', chips: entry.drying_modifiers ?? [] },
    { lbl: 'Intervention', chips: entry.intervention_modifiers ?? [] },
  ])

  const meta: MetaPair[] = [
    { label: 'Method', value: 'Signature' },
    ...(entry.producer && entry.country
      ? [{ label: 'Producer', value: `${entry.producer}, ${entry.country}` }]
      : []),
    { label: 'Coffees', value: `${brewList.length}` },
  ]

  return (
    <div className="ssp-page">
      <DetailBackLink href="/processes">Processes</DetailBackLink>

      {/* Header */}
      <SspTopBar anchor="Signature Method" kind="Process Profile" />
      <SspNamePlate title={name} meta={meta} coverColor={color} edgeColor={color} />

      {/* Process Overview (authored Tier B prose) */}
      <div className="ssp-card">
        <SspShead>Process Overview</SspShead>
        {entry.overview ? (
          <div className="ssp-prose space-y-3">
            {entry.overview.split(/\n\n+/).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        ) : (
          <p className="font-mono text-xs text-latent-mid italic">Process overview pending authoring.</p>
        )}
      </div>

      {/* Process Breakdown (from canonical SignatureEntry decomposition) */}
      <div className="ssp-card">
        <SspShead>Process Breakdown</SspShead>
        <SspStructure rows={breakdownRows} />
      </div>

      {/* Observed Cup Profile (authored Tier B bullets) */}
      <div className="ssp-card">
        <SspShead>Observed Cup Profile</SspShead>
        {entry.observedCupProfile && entry.observedCupProfile.length > 0 ? (
          <ul className="list-disc list-inside space-y-1 font-sans text-sm leading-relaxed">
            {entry.observedCupProfile.map((bullet, i) => (
              <li key={i}>{bullet}</li>
            ))}
          </ul>
        ) : (
          <p className="font-mono text-xs text-latent-mid italic">Cup profile pending authoring.</p>
        )}
      </div>

      {/* What I Learned (synthesis) — hidden below 2 brews */}
      {brewList.length >= 2 && (
        <SynthesisCard
          title="WHAT I LEARNED ABOUT THIS SIGNATURE"
          fetchKey={`signature:${cacheKey}`}
          endpoint="/api/processes/synthesize"
          requestBody={{ kind: 'signature', key: cacheKey }}
          loadingText={`Synthesizing knowledge from ${brewList.length} ${name} coffees...`}
          existingSynthesis={cache?.synthesis ?? null}
          existingBrewCount={cache?.synthesis_brew_count ?? null}
          currentBrewCount={brewList.length}
          existingShortForm={cache?.short_form_capsule ?? null}
          existingSynthesisInputUpdatedAt={cache?.synthesis_input_max_updated_at ?? null}
          currentInputMaxUpdatedAt={computeInputMaxUpdatedAt(brewList)}
        />
      )}

      {/* Coffees list */}
      <CoffeesList title="Coffees" brews={brewList} />

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
