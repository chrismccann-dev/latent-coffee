// Sub Pages 4 (2026-05-11) — base process hub page.
//
// URL: /processes/{base}
// Bases: Washed / Natural / Honey / Wet-hulled (Wet-hulled returns notFound
//        when no brews exist for it; hidden on the index too).
//
// Sections:
//   1. Hero
//   2. Process Summary (authored prose from BaseProcessEntry.summary)
//   3. Observed Process Variants & Modifiers (chip clusters by axis)
//   4. Brew Archetypes (5-field grid from BaseProcessEntry.brewArchetype)
//   5. What I've Learned About [Base] Coffees (SynthesisCard, kind=base)
//   6. [Base] Coffees I Have Brewed (full list)
//   7. Additional Information (CollapsibleBlock with FlavorNotes + 3 TagLinkLists)
//   8. Confidence

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
  BASE_PROCESSES,
  getBaseProcessEntry,
  getFamilyColor,
  type BaseProcess,
} from '@/lib/process-registry'
import { aggregateBaseHub } from '@/lib/process-aggregation'
import {
  parseBaseSlug,
  modifierComboUrl,
  honeySubprocessUrl,
  signatureUrl,
  baseAggregationKey,
} from '@/lib/process-routing'

export function generateStaticParams() {
  return BASE_PROCESSES.map((base) => ({ base: base.toLowerCase().replace(/[^a-z0-9]+/g, '-') }))
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
      .select('synthesis, synthesis_brew_count')
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

  // Cross-link maps
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
            <h1 className="font-sans text-2xl font-semibold mb-1">{base}</h1>
            <p className="font-mono text-xs text-latent-mid">
              {base} family &middot; {brewList.length} {brewList.length === 1 ? 'coffee' : 'coffees'}
            </p>
          </div>
        </div>
      </div>

      {/* Process Summary */}
      {entry?.summary ? (
        <SectionCard title="PROCESS SUMMARY">
          <p className="font-sans text-sm leading-relaxed">{entry.summary}</p>
        </SectionCard>
      ) : (
        <SectionCard title="PROCESS SUMMARY">
          <p className="font-mono text-xs text-latent-mid italic">
            Process summary pending authoring.
          </p>
        </SectionCard>
      )}

      {/* Observed Process Variants & Modifiers */}
      <SectionCard title="OBSERVED PROCESS VARIANTS &amp; MODIFIERS">
        <div className="space-y-4">
          <ChipCluster label="Base">
            <Chip
              clickable={false}
              label={`Pure ${base} (${hub.pure.length})`}
            />
          </ChipCluster>

          {hub.honeySubprocesses.length > 0 && (
            <ChipCluster label="Subprocess">
              {hub.honeySubprocesses.map((s) => (
                <Chip
                  key={s.name}
                  clickable={s.eligible}
                  href={honeySubprocessUrl(s.name)}
                  label={`${s.name} (${s.count})`}
                />
              ))}
            </ChipCluster>
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
              <ChipCluster key={axis} label={label}>
                {axisCombos.map((c) => (
                  <Chip
                    key={c.slug}
                    clickable={c.eligible}
                    href={c.eligible ? modifierComboUrl(base, c.slug) : undefined}
                    label={`${c.label} (${c.count})`}
                  />
                ))}
              </ChipCluster>
            )
          })}

          {hub.signatures.length > 0 && (
            <ChipCluster label="Signature Methods">
              {hub.signatures.map((s) => (
                <Chip
                  key={s.name}
                  clickable
                  href={signatureUrl(s.name)}
                  label={`${s.name} (${s.count})`}
                />
              ))}
            </ChipCluster>
          )}
        </div>
      </SectionCard>

      {/* Brew Archetypes */}
      {entry?.brewArchetype ? (
        <SectionCard title={`BREW ARCHETYPES FOR ${base.toUpperCase()} COFFEES`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <ArchetypeField label="Best archetype" value={entry.brewArchetype.bestArchetype} />
            <ArchetypeField label="Typical strength" value={entry.brewArchetype.typicalStrength} />
            <ArchetypeField label="Common failure mode" value={entry.brewArchetype.commonFailureMode} />
            <ArchetypeField label="What usually helps" value={entry.brewArchetype.whatUsuallyHelps} />
            <ArchetypeField label="When to deviate" value={entry.brewArchetype.whenToDeviate} />
          </div>
        </SectionCard>
      ) : (
        <SectionCard title={`BREW ARCHETYPES FOR ${base.toUpperCase()} COFFEES`}>
          <p className="font-mono text-xs text-latent-mid italic">
            Brew archetype framing pending authoring.
          </p>
        </SectionCard>
      )}

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
        />
      )}

      {/* Coffees list */}
      <ProcessCoffeesList
        title={`${base.toUpperCase()} COFFEES I HAVE BREWED (${brewList.length})`}
        brews={brewList}
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
      <ProcessConfidenceCard brewCount={brewList.length} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Local helpers
// ---------------------------------------------------------------------------

function ChipCluster({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-sans text-sm font-semibold mb-2">{label}</div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

function Chip({
  label,
  clickable,
  href,
}: {
  label: string
  clickable: boolean
  href?: string
}) {
  const className =
    'inline-block font-mono text-chip uppercase tracking-wide bg-latent-highlight border border-latent-highlight-border text-latent-fg px-2 py-1 rounded'
  if (clickable && href) {
    return (
      <Link href={href} className={`${className} hover:bg-latent-bg transition-colors`}>
        {label}
      </Link>
    )
  }
  return <span className={className}>{label}</span>
}

function ArchetypeField({ label, value }: { label: string; value: string | null }) {
  if (!value) return null
  return (
    <div>
      <div className="font-mono text-xxs font-semibold text-latent-fg uppercase mb-1">{label}</div>
      <div className="font-sans text-sm leading-relaxed">{value}</div>
    </div>
  )
}
