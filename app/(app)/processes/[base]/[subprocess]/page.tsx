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
import Link from 'next/link'
import { Brew } from '@/lib/types'
import {
  SspTopBar,
  SspNamePlate,
  SspShead,
  SspStructure,
  type MetaPair,
} from '@/components/Ssp'
import { TagLinkList } from '@/components/TagLinkList'
import { FlavorNotesByFamily } from '@/components/FlavorNotesByFamily'
import { CollapsibleBlock } from '@/components/CollapsibleBlock'
import { ConfidenceCard } from '@/components/ConfidenceCard'
import { CoffeesList } from '@/components/CoffeesList'
import { aggregateFlavorNotes } from '@/lib/flavor-registry'
import SynthesisCard from '@/components/SynthesisCard'
import { computeInputMaxUpdatedAt } from '@/lib/synthesis/inputUpdatedAt'
import { getFamilyColor } from '@/lib/process-registry'
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

  const meta: MetaPair[] = [
    { label: 'Base', value: 'Honey' },
    { label: 'Coffees', value: `${brewList.length}` },
  ]

  return (
    <div className="ssp-page">
      <Link
        href="/processes/honey"
        className="font-mono text-xs uppercase tracking-[0.16em] text-latent-mid hover:text-latent-fg"
      >
        ← Back to Honey
      </Link>

      {/* Header */}
      <SspTopBar roaster="Honey" kind="Process Variant" />
      <SspNamePlate title={subprocess} meta={meta} coverColor={color} edgeColor={color} />

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
      {hasAdditional && (
        <CollapsibleBlock title="ADDITIONAL INFORMATION">
          <FlavorNotesByFamily notes={sortedFlavors} title="FLAVOR NOTES I HAVE EXPERIENCED" />
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
            title="ROASTERS EXPLORED"
            items={Array.from(roasterSet).map((r) => ({
              key: r, label: r, href: `/roasters/${encodeURIComponent(r)}`,
            }))}
          />
        </CollapsibleBlock>
      )}

      {/* Confidence */}
      <ConfidenceCard brewCount={brewList.length} />
    </div>
  )
}
