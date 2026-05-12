// Sub Pages 4 (2026-05-11) — Honey subprocess sub-page.
//
// URL: /processes/honey/{subprocess}
// Subprocesses: white / generic / yellow / red / black / purple / hydro
// Eligibility: Rule 3 — Honey color tiers are structurally meaningful, so
// even a 1-brew subprocess gets a page. Only Honey base supports subprocess
// routing today; other bases return notFound.
//
// Tier B content scope excludes mini-pages → no authored Process Overview /
// Cup Profile blocks. The page shows Process Breakdown chips + synthesized
// What I Learned + coffees list + cross-link block + Confidence.

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Brew } from '@/lib/types'
import { SectionCard } from '@/components/SectionCard'
import { TagLinkList } from '@/components/TagLinkList'
import { FlavorNotesByFamily } from '@/components/FlavorNotesByFamily'
import { ProcessBreakdownRow } from '@/components/ProcessBreakdownRow'
import { ProcessConfidenceCard } from '@/components/ProcessConfidenceCard'
import { ProcessCoffeesList } from '@/components/ProcessCoffeesList'
import { aggregateFlavorNotes } from '@/lib/flavor-registry'
import SynthesisCard from '@/components/SynthesisCard'
import {
  getFamilyColor,
  type HoneySubprocess,
} from '@/lib/process-registry'
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
      .select('synthesis, synthesis_brew_count')
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

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Link
        href={`/processes/honey`}
        className="font-mono text-xs text-latent-mid hover:text-latent-fg mb-6 inline-block"
      >
        &larr; Back to Honey
      </Link>

      {/* Hero */}
      <div className="section-card mb-6">
        <div className="flex gap-6 items-start">
          <div className="w-16 h-16 rounded flex-shrink-0" style={{ backgroundColor: color }} />
          <div className="flex-1">
            <h1 className="font-sans text-2xl font-semibold mb-1">{subprocess}</h1>
            <p className="font-mono text-xs text-latent-mid">
              Honey family &middot; {brewList.length} {brewList.length === 1 ? 'coffee' : 'coffees'}
            </p>
          </div>
        </div>
      </div>

      {/* Process Breakdown */}
      <SectionCard title="PROCESS BREAKDOWN">
        <div className="space-y-3">
          <ProcessBreakdownRow label="Base" chips={['Honey']} />
          <ProcessBreakdownRow label="Subprocess" chips={[subprocess]} />
        </div>
      </SectionCard>

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
        />
      )}

      {/* Coffees list */}
      <ProcessCoffeesList
        title={`COFFEES I HAVE EXPERIENCED WITH THIS PROCESS (${brewList.length})`}
        brews={brewList}
      />

      {/* Flavor + cross-link blocks (visible by default; page is short) */}
      <FlavorNotesByFamily notes={sortedFlavors} />
      <TagLinkList
        title="CULTIVARS EXPLORED"
        items={Array.from(cultivarMap.entries()).map(([name, id]) => ({
          key: name,
          label: name,
          href: `/cultivars/${id}`,
        }))}
      />
      <TagLinkList
        title="TERROIRS EXPLORED"
        items={Array.from(terroirMap.entries()).map(([name, { id, country }]) => ({
          key: name,
          label: `${country} / ${name}`,
          href: `/terroirs/${id}`,
        }))}
      />
      <TagLinkList
        title="ROASTERS EXPLORED"
        items={Array.from(roasterSet).map((r) => ({
          key: r,
          label: r,
          href: `/roasters/${encodeURIComponent(r)}`,
        }))}
      />

      {/* Confidence */}
      <ProcessConfidenceCard brewCount={brewList.length} />
    </div>
  )
}
