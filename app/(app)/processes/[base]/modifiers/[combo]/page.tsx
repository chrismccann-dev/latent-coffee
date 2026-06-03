// Sub Pages 4 (2026-05-11) — per-base modifier-combo mini-page.
// Re-skinned to the v2 Ssp* lab-document family in Redesign Sprint 5 (2026-05-29).
//
// URL: /processes/{base}/modifiers/{combo-slug}
// Eligibility: Rule 1 — ≥3 non-signature non-subprocess brews share the same
// structural fingerprint within a base. Below threshold returns notFound.

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
import { buildBreakdownRows } from '@/lib/process-breakdown'
import { TagLinkList } from '@/components/TagLinkList'
import { FlavorNotesByFamily } from '@/components/FlavorNotesByFamily'
import { CollapsibleBlock } from '@/components/CollapsibleBlock'
import { ConfidenceCard } from '@/components/ConfidenceCard'
import { CoffeesList } from '@/components/CoffeesList'
import { ProcessDescriptionCard } from '@/components/ProcessDescriptionCard'
import { aggregateFlavorNotes } from '@/lib/flavor-registry'
import SynthesisCard from '@/components/SynthesisCard'
import { computeInputMaxUpdatedAt } from '@/lib/synthesis/inputUpdatedAt'
import {
  getFamilyColor,
  composeProcessDisplay,
  getModifierComboOverview,
  type BaseProcess,
} from '@/lib/process-registry'
import { aggregateModifierCombo } from '@/lib/process-aggregation'
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
  const overview = getModifierComboOverview(cacheKey)

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
    { label: 'Base', value: base },
    { label: 'Coffees', value: `${brewList.length}` },
  ]

  return (
    <div className="ssp-page">
      <Link
        href={baseHubUrl(base)}
        className="font-mono text-xs uppercase tracking-[0.16em] text-latent-mid hover:text-latent-fg"
      >
        ← Back to {base}
      </Link>

      {/* Header */}
      <SspTopBar roaster={base} kind="Process Variant" />
      <SspNamePlate title={label} meta={meta} coverColor={color} edgeColor={color} />

      {/* Process Description (authored — priority-stack recount Tweak 6) */}
      <ProcessDescriptionCard overview={overview} />

      {/* Process Breakdown */}
      <div className="ssp-card">
        <SspShead>Process Breakdown</SspShead>
        <SspStructure
          rows={buildBreakdownRows([
            { lbl: 'Base', chips: [base] },
            { lbl: 'Fermentation', chips: structured.fermentation_modifiers },
            { lbl: 'Drying', chips: structured.drying_modifiers },
            { lbl: 'Intervention', chips: structured.intervention_modifiers },
            { lbl: 'Experimental', chips: structured.experimental_modifiers },
          ])}
        />
      </div>

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
