// Sub Pages 4 (2026-05-11) — signature method page.
//
// URL: /processes/signatures/{name}
// Eligibility: Rule 2 — signature methods always earn a page, even at 1 brew.
// Process Overview + Observed Cup Profile come from authored SignatureEntry
// content (Tier B). "What I Learned" synthesis is hidden below 2 brews.

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Brew } from '@/lib/types'
import { SectionCard } from '@/components/SectionCard'
import { TagLinkList } from '@/components/TagLinkList'
import { FlavorNotesByFamily } from '@/components/FlavorNotesByFamily'
import { CollapsibleBlock } from '@/components/CollapsibleBlock'
import { ProcessBreakdownRow } from '@/components/ProcessBreakdownRow'
import { ProcessConfidenceCard } from '@/components/ProcessConfidenceCard'
import { ProcessCoffeesList } from '@/components/ProcessCoffeesList'
import { aggregateFlavorNotes } from '@/lib/flavor-registry'
import SynthesisCard from '@/components/SynthesisCard'
import {
  getSignatureEntry,
  getFamilyColor,
} from '@/lib/process-registry'
import { aggregateSignature } from '@/lib/process-aggregation'
import {
  parseSignatureSlug,
  signatureAggregationKey,
} from '@/lib/process-routing'

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
    .select('synthesis, synthesis_brew_count')
    .eq('aggregation_kind', 'signature')
    .eq('aggregation_key', cacheKey)
    .maybeSingle()

  const color = getFamilyColor(entry.base === 'Wet-hulled' ? 'Other' : entry.base)
  const sortedFlavors = aggregateFlavorNotes(brewList)

  const terroirMap = new Map<string, { id: string; country: string }>()
  const cultivarMap = new Map<string, string>()
  const roasterSet = new Set<string>()
  for (const brew of brewList) {
    if (brew.terroir?.country && brew.terroir.id) {
      const key = brew.terroir.macro_terroir || brew.terroir.admin_region || brew.terroir.country
      if (!terroirMap.has(key)) {
        terroirMap.set(key, { id: brew.terroir.id, country: brew.terroir.country })
      }
    }
    if (brew.cultivar?.cultivar_name && brew.cultivar.id) {
      cultivarMap.set(brew.cultivar.cultivar_name, brew.cultivar.id)
    }
    if (brew.roaster) roasterSet.add(brew.roaster)
  }
  const hasAdditional =
    sortedFlavors.length > 0 || terroirMap.size > 0 || cultivarMap.size > 0 || roasterSet.size > 0

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Link
        href="/processes"
        className="font-mono text-xs text-latent-mid hover:text-latent-fg mb-6 inline-block"
      >
        &larr; Back to Processes
      </Link>

      {/* Hero */}
      <div className="section-card mb-6">
        <div className="flex gap-6 items-start">
          <div className="w-16 h-16 rounded flex-shrink-0" style={{ backgroundColor: color }} />
          <div className="flex-1">
            <h1 className="font-sans text-2xl font-semibold mb-1">{name}</h1>
            <p className="font-mono text-xs text-latent-mid">
              Signature method &middot; {entry.producer}, {entry.country} &middot; {brewList.length} {brewList.length === 1 ? 'coffee' : 'coffees'}
            </p>
          </div>
        </div>
      </div>

      {/* Process Overview (authored Tier B prose) */}
      {entry.overview ? (
        <SectionCard title="PROCESS OVERVIEW">
          {entry.overview.split(/\n\n+/).map((para, i) => (
            <p key={i} className="font-sans text-sm leading-relaxed mb-3 last:mb-0">{para}</p>
          ))}
        </SectionCard>
      ) : (
        <SectionCard title="PROCESS OVERVIEW">
          <p className="font-mono text-xs text-latent-mid italic">
            Process overview pending authoring.
          </p>
        </SectionCard>
      )}

      {/* Process Breakdown (from canonical SignatureEntry decomposition) */}
      <SectionCard title="PROCESS BREAKDOWN">
        <div className="space-y-3">
          <ProcessBreakdownRow label="Base" chips={[entry.base]} />
          <ProcessBreakdownRow label="Fermentation" chips={entry.fermentation_modifiers ?? []} />
          <ProcessBreakdownRow label="Drying" chips={entry.drying_modifiers ?? []} />
          <ProcessBreakdownRow label="Intervention" chips={entry.intervention_modifiers ?? []} />
        </div>
      </SectionCard>

      {/* Observed Cup Profile (authored Tier B bullets) */}
      {entry.observedCupProfile && entry.observedCupProfile.length > 0 ? (
        <SectionCard title="OBSERVED CUP PROFILE">
          <ul className="list-disc list-inside space-y-1 font-sans text-sm">
            {entry.observedCupProfile.map((bullet, i) => (
              <li key={i}>{bullet}</li>
            ))}
          </ul>
        </SectionCard>
      ) : (
        <SectionCard title="OBSERVED CUP PROFILE">
          <p className="font-mono text-xs text-latent-mid italic">
            Cup profile pending authoring.
          </p>
        </SectionCard>
      )}

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
        />
      )}

      {/* Coffees list */}
      <ProcessCoffeesList title={`COFFEES (${brewList.length})`} brews={brewList} />

      {/* Additional Information (mobile-collapsed; thin on 1-brew signature pages) */}
      {hasAdditional && (
        <CollapsibleBlock title="ADDITIONAL INFORMATION">
          <FlavorNotesByFamily notes={sortedFlavors} title="FLAVOR NOTES I HAVE EXPERIENCED" bare />
          <TagLinkList
            title="CULTIVARS EXPLORED"
            bare
            items={Array.from(cultivarMap.entries()).map(([n, id]) => ({
              key: n,
              label: n,
              href: `/cultivars/${id}`,
            }))}
          />
          <TagLinkList
            title="TERROIRS EXPLORED"
            bare
            items={Array.from(terroirMap.entries()).map(([n, { id, country }]) => ({
              key: n,
              label: `${country} / ${n}`,
              href: `/terroirs/${id}`,
            }))}
          />
          <TagLinkList
            title="ROASTERS EXPLORED"
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
      <ProcessConfidenceCard brewCount={brewList.length} />
    </div>
  )
}
