// Sub Pages 4 (2026-05-11) — cross-base Modifier Index page.
// Re-skinned to the v2 Ssp* lab-document family in Redesign Sprint 5 (2026-05-29).
//
// URL: /processes/modifiers/{modifier}
// Eligibility: Rule 1 — ≥3 brews containing this modifier in any axis,
// across all bases (including signature brews). Below threshold returns notFound.

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Brew } from '@/lib/types'
import {
  SspTopBar,
  SspNamePlate,
  SspShead,
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
import { axisColor } from '@/lib/process-axis-colors'

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
    .select('synthesis, synthesis_brew_count, short_form_capsule, synthesis_input_max_updated_at')
    .eq('aggregation_kind', 'modifier_index')
    .eq('aggregation_key', cacheKey)
    .maybeSingle()

  const entry = getModifierEntry(parsed.name)
  const color = axisColor(parsed.axis)
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

  const meta: MetaPair[] = [
    { label: 'Axis', value: parsed.axis },
    { label: 'Coffees', value: `${agg.all.length}` },
    { label: 'Bases', value: `${baseEntries.length}` },
  ]

  return (
    <div className="ssp-page">
      <Link
        href="/processes"
        className="font-mono text-xs uppercase tracking-[0.16em] text-latent-mid hover:text-latent-fg"
      >
        ← Back to Processes
      </Link>

      {/* Header */}
      <SspTopBar roaster={`${parsed.axis} modifier`} kind="Modifier Index" />
      <SspNamePlate title={parsed.name} meta={meta} coverColor={color} edgeColor={color} />

      {/* Modifier Overview (authored Tier B prose) */}
      <div className="ssp-card">
        <SspShead>Modifier Overview</SspShead>
        {entry?.overview ? (
          <div className="ssp-prose">{entry.overview}</div>
        ) : (
          <p className="font-mono text-xs text-latent-mid italic">Modifier overview pending authoring.</p>
        )}
      </div>

      {/* By Base Process */}
      <div className="ssp-card">
        <SspShead>By Base Process</SspShead>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {baseEntries.map(([base, count]) => (
            <Link
              key={base}
              href={baseHubUrl(base)}
              className="border border-latent-border bg-white p-3 hover:bg-latent-bg transition-colors"
            >
              <div className="font-sans text-sm font-semibold mb-1">{base}</div>
              <div className="font-mono text-xxs text-latent-mid">
                {count} {count === 1 ? 'coffee' : 'coffees'}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Common Stacks */}
      {agg.commonStacks.length > 0 && (
        <div className="ssp-card">
          <SspShead>Common Stacks</SspShead>
          <ul className="space-y-2">
            {agg.commonStacks.map((stack) => (
              <li key={`${stack.base}|${stack.label}`} className="flex items-baseline justify-between gap-3">
                <span className="font-sans text-sm">
                  <span className="font-mono text-xxs text-latent-mid uppercase mr-2">{stack.base}</span>
                  {stack.label}
                </span>
                <span className="font-mono text-xxs text-latent-mid">
                  {stack.count} {stack.count === 1 ? 'coffee' : 'coffees'}
                </span>
              </li>
            ))}
          </ul>
        </div>
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
          existingShortForm={cache?.short_form_capsule ?? null}
          existingSynthesisInputUpdatedAt={cache?.synthesis_input_max_updated_at ?? null}
          currentInputMaxUpdatedAt={computeInputMaxUpdatedAt(agg.all)}
        />
      )}

      {/* Coffees list — meta leads with base_process to highlight cross-base coverage */}
      <CoffeesList
        title={`Coffees Containing ${parsed.name}`}
        brews={agg.all}
        metaFor={(brew) => [brew.base_process, brew.terroir?.country, brew.roaster].filter(Boolean).join(' · ')}
      />

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
      <ConfidenceCard brewCount={agg.all.length} />
    </div>
  )
}
