// Sub Pages 4 (2026-05-11) — per-base modifier-combo mini-page.
//
// URL: /processes/{base}/modifiers/{combo-slug}
// Eligibility: Rule 1 — ≥3 non-signature non-subprocess brews share the same
// structural fingerprint within a base. Below threshold returns notFound.
//
// Tier B content scope excludes mini-pages → no authored Process Overview /
// Cup Profile blocks. The page shows Process Breakdown chips + synthesized
// What I Learned + coffees list + cross-link blocks + Confidence.

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
import { computeInputMaxUpdatedAt } from '@/lib/synthesis/inputUpdatedAt'
import {
  getFamilyColor,
  composeProcessDisplay,
  type BaseProcess,
} from '@/lib/process-registry'
import {
  aggregateModifierCombo,
} from '@/lib/process-aggregation'
import {
  parseBaseSlug,
  parseModifierComboSlug,
  modifierComboAggregationKey,
  SUB_PAGE_THRESHOLD,
  baseHubUrl,
} from '@/lib/process-routing'

export default async function ModifierComboPage({
  params,
}: {
  params: { base: string; combo: string }
}) {
  const base = parseBaseSlug(params.base) as BaseProcess | null
  if (!base) notFound()

  const structured = parseModifierComboSlug(params.combo, base)
  if (!structured) notFound()

  const supabase = createClient()

  const { data: allBrews } = await supabase
    .from('brews')
    .select(`*, terroir:terroirs(id, country, admin_region, macro_terroir), cultivar:cultivars(id, cultivar_name, lineage)`)
    .eq('base_process', base)
    .order('created_at', { ascending: false })

  const brewList = aggregateModifierCombo((allBrews ?? []) as Brew[], base, structured)

  // Eligibility gate: below threshold = notFound (no thin mini-pages).
  if (brewList.length < SUB_PAGE_THRESHOLD) notFound()

  const cacheKey = modifierComboAggregationKey(base, params.combo)
  const { data: cache } = await supabase
    .from('process_aggregation_syntheses')
    .select('synthesis, synthesis_brew_count, short_form_capsule, synthesis_input_max_updated_at')
    .eq('aggregation_kind', 'modifier_combo')
    .eq('aggregation_key', cacheKey)
    .maybeSingle()

  const label = composeProcessDisplay(structured)
  const color = getFamilyColor(base === 'Wet-hulled' ? 'Other' : base)
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
        href={baseHubUrl(base)}
        className="font-mono text-xs text-latent-mid hover:text-latent-fg mb-6 inline-block"
      >
        &larr; Back to {base}
      </Link>

      {/* Hero */}
      <div className="section-card mb-6">
        <div className="flex gap-6 items-start">
          <div className="w-16 h-16 rounded flex-shrink-0" style={{ backgroundColor: color }} />
          <div className="flex-1">
            <h1 className="font-sans text-2xl font-semibold mb-1">{label}</h1>
            <p className="font-mono text-xs text-latent-mid">
              {base} family &middot; {brewList.length} {brewList.length === 1 ? 'coffee' : 'coffees'}
            </p>
          </div>
        </div>
      </div>

      {/* Process Breakdown */}
      <SectionCard title="PROCESS BREAKDOWN">
        <div className="space-y-3">
          <ProcessBreakdownRow label="Base" chips={[base]} />
          <ProcessBreakdownRow label="Fermentation" chips={[...structured.fermentation_modifiers]} />
          <ProcessBreakdownRow label="Drying" chips={[...structured.drying_modifiers]} />
          <ProcessBreakdownRow label="Intervention" chips={[...structured.intervention_modifiers]} />
          <ProcessBreakdownRow label="Experimental" chips={[...structured.experimental_modifiers]} />
        </div>
      </SectionCard>

      {/* What I Learned (synthesis) */}
      {brewList.length >= 2 && (
        <SynthesisCard
          title="WHAT I LEARNED ABOUT THIS PROCESS"
          fetchKey={`modifier_combo:${cacheKey}`}
          endpoint="/api/processes/synthesize"
          requestBody={{ kind: 'modifier_combo', key: cacheKey }}
          loadingText={`Synthesizing knowledge from ${brewList.length} coffees of this specific variant...`}
          existingSynthesis={cache?.synthesis ?? null}
          existingBrewCount={cache?.synthesis_brew_count ?? null}
          currentBrewCount={brewList.length}
          existingShortForm={cache?.short_form_capsule ?? null}
          existingSynthesisInputUpdatedAt={cache?.synthesis_input_max_updated_at ?? null}
          currentInputMaxUpdatedAt={computeInputMaxUpdatedAt(brewList)}
        />
      )}

      {/* Coffees list */}
      <ProcessCoffeesList
        title={`COFFEES I HAVE EXPERIENCED WITH THIS PROCESS (${brewList.length})`}
        brews={brewList}
      />

      {/* Flavor + cross-links (visible by default; page is short) */}
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
