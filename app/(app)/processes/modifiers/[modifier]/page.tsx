// Sub Pages 4 (2026-05-11) — cross-base Modifier Index page.
//
// URL: /processes/modifiers/{modifier}
// Eligibility: Rule 1 — ≥3 brews containing this modifier in any axis,
// across all bases (including signature brews per Chris's brainstorm example
// "Anaerobic + Aerobic (Hybrid Washed)"). Below threshold returns notFound.
//
// Tier B content: authored ModifierEntry.overview prose lands here once
// Phase A finalizes. Sections below ship with empty-state messaging until
// then.

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Brew } from '@/lib/types'
import { SectionCard } from '@/components/SectionCard'
import { TagLinkList } from '@/components/TagLinkList'
import { FlavorNotesByFamily } from '@/components/FlavorNotesByFamily'
import { CollapsibleBlock } from '@/components/CollapsibleBlock'
import { ProcessConfidenceCard } from '@/components/ProcessConfidenceCard'
import { ProcessCoffeesList } from '@/components/ProcessCoffeesList'
import { aggregateFlavorNotes } from '@/lib/flavor-registry'
import SynthesisCard from '@/components/SynthesisCard'
import {
  getModifierEntry,
  type BaseProcess,
} from '@/lib/process-registry'
import { aggregateModifierIndex } from '@/lib/process-aggregation'
import {
  parseModifierSlug,
  modifierIndexAggregationKey,
  SUB_PAGE_THRESHOLD,
  baseHubUrl,
} from '@/lib/process-routing'

const AXIS_SWATCH_COLOR: Record<string, string> = {
  fermentation: '#722F4B',
  drying: '#8B6914',
  intervention: '#5B4A6B',
  experimental: '#5B4A6B',
}

export default async function ModifierIndexPage({
  params,
}: {
  params: { modifier: string }
}) {
  const parsed = parseModifierSlug(params.modifier)
  if (!parsed) notFound()

  const supabase = createClient()

  const { data: allBrews } = await supabase
    .from('brews')
    .select(`*, terroir:terroirs(id, country, admin_region, macro_terroir), cultivar:cultivars(id, cultivar_name, lineage)`)
    .order('created_at', { ascending: false })

  const agg = aggregateModifierIndex((allBrews ?? []) as Brew[], parsed.name)
  if (agg.all.length < SUB_PAGE_THRESHOLD) notFound()

  const cacheKey = modifierIndexAggregationKey(parsed.name)
  const { data: cache } = await supabase
    .from('process_aggregation_syntheses')
    .select('synthesis, synthesis_brew_count')
    .eq('aggregation_kind', 'modifier_index')
    .eq('aggregation_key', cacheKey)
    .maybeSingle()

  const entry = getModifierEntry(parsed.name)
  const color = AXIS_SWATCH_COLOR[parsed.axis] ?? '#5C6570'
  const sortedFlavors = aggregateFlavorNotes(agg.all)

  const terroirMap = new Map<string, { id: string; country: string }>()
  const cultivarMap = new Map<string, string>()
  const roasterSet = new Set<string>()
  for (const brew of agg.all) {
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

  const baseEntries = (Object.entries(agg.byBase) as [BaseProcess, number][])
    .filter(([_, c]) => (c ?? 0) > 0)
    .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0))

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
            <h1 className="font-sans text-2xl font-semibold mb-1">{parsed.name}</h1>
            <p className="font-mono text-xs text-latent-mid">
              {parsed.axis} modifier &middot; {agg.all.length} {agg.all.length === 1 ? 'coffee' : 'coffees'} across {baseEntries.length} {baseEntries.length === 1 ? 'base' : 'bases'}
            </p>
          </div>
        </div>
      </div>

      {/* Modifier Overview (authored Tier B prose) */}
      {entry?.overview ? (
        <SectionCard title="MODIFIER OVERVIEW">
          <p className="font-sans text-sm leading-relaxed">{entry.overview}</p>
        </SectionCard>
      ) : (
        <SectionCard title="MODIFIER OVERVIEW">
          <p className="font-mono text-xs text-latent-mid italic">
            Modifier overview pending authoring.
          </p>
        </SectionCard>
      )}

      {/* By Base Process */}
      <SectionCard title="BY BASE PROCESS">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {baseEntries.map(([base, count]) => (
            <Link
              key={base}
              href={baseHubUrl(base)}
              className="border border-latent-border rounded-md p-3 hover:bg-white transition-colors group"
            >
              <div className="font-sans text-sm font-semibold mb-1">{base}</div>
              <div className="font-mono text-xs text-latent-mid">
                {count} {count === 1 ? 'coffee' : 'coffees'}
              </div>
            </Link>
          ))}
        </div>
      </SectionCard>

      {/* Common Stacks */}
      {agg.commonStacks.length > 0 && (
        <SectionCard title="COMMON STACKS">
          <ul className="space-y-2">
            {agg.commonStacks.map((stack) => (
              <li key={`${stack.base}|${stack.label}`} className="flex items-baseline justify-between gap-3">
                <span className="font-sans text-sm">
                  <span className="font-mono text-xxs text-latent-mid uppercase mr-2">{stack.base}</span>
                  {stack.label}
                </span>
                <span className="font-mono text-xs text-latent-mid">
                  {stack.count} {stack.count === 1 ? 'coffee' : 'coffees'}
                </span>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {/* What I've Learned (synthesis) */}
      {agg.all.length >= 2 && (
        <SynthesisCard
          title={`WHAT I'VE LEARNED ABOUT ${parsed.name.toUpperCase()}`}
          fetchKey={`modifier_index:${cacheKey}`}
          endpoint="/api/processes/synthesize"
          requestBody={{ kind: 'modifier_index', key: cacheKey }}
          loadingText={`Synthesizing knowledge from ${agg.all.length} coffees containing ${parsed.name.toLowerCase()}...`}
          existingSynthesis={cache?.synthesis ?? null}
          existingBrewCount={cache?.synthesis_brew_count ?? null}
          currentBrewCount={agg.all.length}
        />
      )}

      {/* Coffees list — meta line leads with base_process to highlight cross-base coverage */}
      <ProcessCoffeesList
        title={`COFFEES CONTAINING ${parsed.name.toUpperCase()} (${agg.all.length})`}
        brews={agg.all}
        metaFor={(brew) => [brew.base_process, brew.terroir?.country, brew.roaster].filter(Boolean).join(' · ')}
      />

      {/* Additional Information (mobile-collapsed) */}
      {hasAdditional && (
        <CollapsibleBlock title="ADDITIONAL INFORMATION">
          <FlavorNotesByFamily notes={sortedFlavors} title="FLAVOR NOTES I HAVE EXPERIENCED" bare />
          <TagLinkList
            title="CULTIVARS EXPLORED"
            bare
            items={Array.from(cultivarMap.entries()).map(([name, id]) => ({
              key: name,
              label: name,
              href: `/cultivars/${id}`,
            }))}
          />
          <TagLinkList
            title="TERROIRS EXPLORED"
            bare
            items={Array.from(terroirMap.entries()).map(([name, { id, country }]) => ({
              key: name,
              label: `${country} / ${name}`,
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
      <ProcessConfidenceCard brewCount={agg.all.length} />
    </div>
  )
}
