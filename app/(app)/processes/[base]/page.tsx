// Sub Pages 4 (2026-05-11) — base process hub page.
// Re-skinned to the v2 Ssp* lab-document family in Redesign Sprint 5 (2026-05-29).
//
// URL: /processes/{base}
// Bases: Washed / Natural / Honey / Wet-hulled (Wet-hulled returns notFound
//        when no brews exist for it; hidden on the index too).
//
// Sections (IA unchanged):
//   1. Hero
//   2. Process Summary (authored prose from BaseProcessEntry.summary)
//   3. Observed Process Variants & Modifiers (chip clusters by axis)
//   4. Brew Archetypes (5-field grid from BaseProcessEntry.brewArchetype)
//   5. What I've Learned About [Base] Coffees (SynthesisCard, kind=base)
//   6. [Base] Coffees I Have Brewed (full list)
//   7. Additional Information (<AdditionalInfo>: flavor notes + 3 cross-link groups)
//   8. Confidence

import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Brew } from '@/lib/types'
import {
  Chip,
  SspTopBar,
  SspNamePlate,
  SspShead,
  SspProseRows,
  compactRows,
  countLabel,
} from '@/components/Ssp'
import { AdditionalInfo } from '@/components/AdditionalInfo'
import { DetailBackLink } from '@/components/DetailBackLink'
import { ConfidenceCard } from '@/components/ConfidenceCard'
import { CoffeesList } from '@/components/CoffeesList'
import { aggregateFlavorNotes } from '@/lib/flavor-registry'
import { extractCrossLinks } from '@/lib/cross-links'
import SynthesisCard from '@/components/SynthesisCard'
import { computeInputMaxUpdatedAt } from '@/lib/synthesis/inputUpdatedAt'
import {
  BASE_PROCESSES,
  getBaseProcessEntry,
  getFamilyColor,
} from '@/lib/process-registry'
import { aggregateBaseHub } from '@/lib/process-aggregation'
import {
  parseBaseSlug,
  baseSlug,
  modifierComboUrl,
  honeySubprocessUrl,
  signatureUrl,
  baseAggregationKey,
} from '@/lib/process-routing'

export function generateStaticParams() {
  return BASE_PROCESSES.map((base) => ({ base: baseSlug(base) }))
}

export default async function BaseHubPage({ params }: { params: { base: string } }) {
  const base = parseBaseSlug(params.base)
  if (!base) notFound()

  const supabase = createClient()

  const [{ data: brews }, { data: cache }] = await Promise.all([
    supabase
      .from('brews')
      .select(`*, terroir:terroirs(id, country, admin_region, macro_terroir), cultivar:cultivars(id, cultivar_name, lineage)`)
      .eq('base_process', base)
      .order('created_at', { ascending: false }),
    supabase
      .from('process_aggregation_syntheses')
      .select('synthesis, synthesis_brew_count, short_form_capsule, synthesis_input_max_updated_at')
      .eq('aggregation_kind', 'base')
      .eq('aggregation_key', baseAggregationKey(base))
      .maybeSingle(),
  ])

  const brewList = (brews ?? []) as Brew[]
  if (brewList.length === 0) notFound()

  const hub = aggregateBaseHub(brewList, base)
  const entry = getBaseProcessEntry(base)
  const family = base === 'Wet-hulled' ? 'Other' : base
  const color = getFamilyColor(family)
  const sortedFlavors = aggregateFlavorNotes(brewList)
  const links = extractCrossLinks(brewList)

  const archetypeRows = entry?.brewArchetype
    ? compactRows([
        { label: 'Best archetype', value: entry.brewArchetype.bestArchetype },
        { label: 'Typical strength', value: entry.brewArchetype.typicalStrength },
        { label: 'Common failure mode', value: entry.brewArchetype.commonFailureMode },
        { label: 'What usually helps', value: entry.brewArchetype.whatUsuallyHelps },
        { label: 'When to deviate', value: entry.brewArchetype.whenToDeviate },
      ])
    : []

  return (
    <div className="ssp-page">
      <DetailBackLink href="/processes">Processes</DetailBackLink>

      {/* Header — the nameplate meta row was dropped (design-audit 02 Finding 4):
          BASE PROCESS restated the h1 and the topbar anchor; the coffee count
          lives in the topbar count slot per the Finding-1 count-home canon. */}
      <SspTopBar
        count={countLabel(brewList.length, 'COFFEE')}
        anchor="Base Process"
        kind="Process Hub"
      />
      <SspNamePlate title={base} meta={[]} coverColor={color} edgeColor={color} />

      {/* Process Summary */}
      <div className="ssp-card">
        <SspShead>Process Summary</SspShead>
        {entry?.summary ? (
          <div className="ssp-prose">{entry.summary}</div>
        ) : (
          <p className="font-mono text-xs text-latent-mid italic">Process summary pending authoring.</p>
        )}
      </div>

      {/* Observed Process Variants & Modifiers */}
      <div className="ssp-card">
        <SspShead>Observed Process Variants &amp; Modifiers</SspShead>
        <div className="space-y-4">
          <VariantCluster label="Base">
            <VariantChip label={`Pure ${base} (${hub.pure.length})`} />
          </VariantCluster>

          {hub.honeySubprocesses.length > 0 && (
            <VariantCluster label="Subprocess">
              {hub.honeySubprocesses.map((s) => (
                <VariantChip
                  key={s.name}
                  href={s.eligible ? honeySubprocessUrl(s.name) : undefined}
                  label={`${s.name} (${s.count})`}
                />
              ))}
            </VariantCluster>
          )}

          {(['fermentation', 'drying', 'intervention', 'experimental', 'multi'] as const).map((axis) => {
            const axisCombos = hub.modifierCombos.filter((c) => c.axis === axis)
            if (axisCombos.length === 0) return null
            const label =
              axis === 'fermentation' ? 'Fermentation Modifiers'
              : axis === 'drying' ? 'Drying Modifiers'
              : axis === 'intervention' ? 'Intervention Modifiers'
              : axis === 'experimental' ? 'Experimental Modifiers'
              : 'Multi-modifier Combinations'
            return (
              <VariantCluster key={axis} label={label}>
                {axisCombos.map((c) => (
                  <VariantChip
                    key={c.slug}
                    href={c.eligible ? modifierComboUrl(base, c.slug) : undefined}
                    label={`${c.label} (${c.count})`}
                  />
                ))}
              </VariantCluster>
            )
          })}

          {hub.signatures.length > 0 && (
            <VariantCluster label="Signature Methods">
              {hub.signatures.map((s) => (
                <VariantChip key={s.name} href={signatureUrl(s.name)} label={`${s.name} (${s.count})`} />
              ))}
            </VariantCluster>
          )}
        </div>
      </div>

      {/* Brew Archetypes */}
      <div className="ssp-card">
        <SspShead>{`Brew Archetypes For ${base} Coffees`}</SspShead>
        {archetypeRows.length > 0 ? (
          <SspProseRows rows={archetypeRows} />
        ) : (
          <p className="font-mono text-xs text-latent-mid italic">Brew archetype framing pending authoring.</p>
        )}
      </div>

      {/* What I've Learned (synthesis) */}
      {brewList.length >= 2 && (
        <SynthesisCard
          title={`WHAT I'VE LEARNED ABOUT ${base.toUpperCase()} COFFEES`}
          fetchKey={`base:${base}`}
          endpoint="/api/processes/synthesize"
          requestBody={{ kind: 'base', key: baseAggregationKey(base) }}
          loadingText={`Synthesizing knowledge from ${brewList.length} ${base.toLowerCase()} coffees...`}
          existingSynthesis={cache?.synthesis ?? null}
          existingBrewCount={cache?.synthesis_brew_count ?? null}
          currentBrewCount={brewList.length}
          existingShortForm={cache?.short_form_capsule ?? null}
          existingSynthesisInputUpdatedAt={cache?.synthesis_input_max_updated_at ?? null}
          currentInputMaxUpdatedAt={computeInputMaxUpdatedAt(brewList)}
        />
      )}

      {/* Coffees list */}
      <CoffeesList title={`${base} Coffees I Have Brewed`} brews={brewList} />

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

// ---------------------------------------------------------------------------
// Local helpers — Observed Variants chip clusters (clickable when a sub-page exists)
// ---------------------------------------------------------------------------

function VariantCluster({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-mono text-micro font-semibold tracking-[0.18em] uppercase text-latent-mid mb-2">
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

function VariantChip({ label, href }: { label: string; href?: string }) {
  if (href) {
    return (
      <Link href={href}>
        <Chip name={label} />
      </Link>
    )
  }
  return <Chip name={label} />
}
