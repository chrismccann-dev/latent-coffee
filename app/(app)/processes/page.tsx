// Sub Pages 4 (2026-05-11) — /processes index, three navigation surfaces:
//   1. Core Process Portals   — 4 base hubs (Washed / Natural / Honey / Wet-hulled)
//                                Wet-hulled hidden until first brew lands.
//   2. Modifier Index         — cross-base modifiers w/ ≥3 brews
//   3. Signature Methods      — 15 canonicals post Sprint T1 / BR-1 (2026-05-18);
//                                only those with ≥1 brewed surface here (today:
//                                Moonshadow + TyOxidator). Hybrid Washed deprecated.
//
// All counts computed live from the brew corpus via lib/process-aggregation.ts.

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Chip } from '@/components/Ssp'
import { IndexCap, GrlCap, GrlRow } from '@/components/IndexList'
import {
  BASE_PROCESSES,
  getSignatureEntry,
  type BaseProcess,
} from '@/lib/process-registry'
import { getFamilyColor } from '@/lib/process-registry'
import {
  aggregateBaseHub,
  brewedSignatures,
  eligibleModifierIndexEntries,
} from '@/lib/process-aggregation'
import {
  baseHubUrl,
  modifierIndexUrl,
  signatureUrl,
} from '@/lib/process-routing'
import type { Brew } from '@/lib/types'
import { axisColor, SIGNATURE_SWATCH_COLOR } from '@/lib/process-axis-colors'

export default async function ProcessesIndexPage() {
  const supabase = createClient()
  const { data } = await supabase.from('brews').select('*')
  const brews = ((data ?? []) as Brew[]).filter((b) => b.base_process)

  const baseHubs = BASE_PROCESSES
    .map((base) => ({ base, hub: aggregateBaseHub(brews, base) }))
    .filter(({ hub }) => hub.all.length > 0)  // hide 0-brew bases (Wet-hulled today)
    .sort((a, b) => b.hub.all.length - a.hub.all.length)  // brew count desc

  const modifierEntries = eligibleModifierIndexEntries(brews)
  const signatures = brewedSignatures(brews)

  const totalCoffees = brews.length
  const totalModifiers = modifierEntries.length
  const totalSignatures = signatures.length

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <IndexCap
        left="PROCESSES"
        right={`${baseHubs.length} BASE · ${totalModifiers} MODIFIERS · ${totalSignatures} SIGNATURES`}
      />
      {/* Shared corpus-count sub-row — same "<X> EXPLORED / COFFEES REPRESENTED ·
          N" register as the other 3 aggregation indexes (audit 01 Finding 3). */}
      <GrlCap label="PROCESSES" count={totalCoffees} />

      {/* Section 1 — Core Process Portals (richer portal cards, kept) */}
      <section className="mb-10">
        <h2 className="label mb-3 mt-2">Core Process Portals</h2>
        <div className="space-y-3">
          {baseHubs.map(({ base, hub }) => (
            <CorePortalCard key={base} base={base} hub={hub} />
          ))}
        </div>
      </section>

      {/* Section 2 — Modifier Index */}
      {modifierEntries.length > 0 && (
        <section className="mb-10">
          <h2 className="label mb-1">Modifier Index</h2>
          <div className="grl">
            {modifierEntries.map((entry) => (
              <GrlRow
                key={entry.name}
                href={modifierIndexUrl(entry.name)}
                tileColor={axisColor(entry.axis)}
                name={entry.name}
                meta={byBaseLine(entry.byBase)}
                count={entry.count}
              />
            ))}
          </div>
        </section>
      )}

      {/* Section 3 — Signature Methods */}
      {signatures.length > 0 && (
        <section>
          <h2 className="label mb-1">Signature Methods</h2>
          <div className="grl">
            {signatures.map((sig) => {
              const entry = getSignatureEntry(sig.name)
              let producerLine: string | undefined
              if (entry) {
                producerLine = entry.producer && entry.country
                  ? `${entry.base} · ${entry.producer}, ${entry.country}`
                  : entry.base
              }
              return (
                <GrlRow
                  key={sig.name}
                  href={signatureUrl(sig.name)}
                  tileColor={SIGNATURE_SWATCH_COLOR}
                  name={sig.name}
                  meta={producerLine}
                  count={sig.count}
                />
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}

function byBaseLine(byBase: Partial<Record<BaseProcess, number>>): string {
  return (Object.entries(byBase) as [BaseProcess, number][])
    .filter(([_, c]) => (c ?? 0) > 0)
    .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0))
    .map(([base, count]) => `${base} ${count}`)
    .join(' · ')
}

interface CorePortalCardProps {
  base: BaseProcess
  hub: ReturnType<typeof aggregateBaseHub>
}

function CorePortalCard({ base, hub }: CorePortalCardProps) {
  const family = base === 'Wet-hulled' ? 'Other' : base
  const color = getFamilyColor(family)
  const eligibleCombos = hub.modifierCombos.filter((c) => c.eligible)
  const inlineCombos = eligibleCombos.slice(0, 3)  // first 3 chips; rest discoverable on hub

  return (
    <Link
      href={baseHubUrl(base)}
      className="flex gap-4 items-stretch border border-latent-border p-4 hover:bg-white transition-colors group"
    >
      <div className="w-24 h-24 flex-shrink-0" style={{ backgroundColor: color }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-3 mb-1">
          <h3 className="font-sans text-lg font-semibold">{base}</h3>
          <div className="font-mono text-xs text-latent-mid">
            {hub.all.length} {hub.all.length === 1 ? 'coffee' : 'coffees'}
          </div>
        </div>
        <div className="font-mono text-xxs text-latent-mid mb-3">
          {hub.pure.length} pure &middot; {hub.modified.length} modified
        </div>
        {/* Canonical Chip primitive (polish-audit Pass 3 — was a hand-drawn
            re-creation of the deleted `.tag` look). Suppress any 0-count variant
            chip — a "(0)" chip is a dead affordance that resolves to nothing
            (audit 01 Finding 6; general rule, not Honey-specific). The combos
            are pre-filtered to eligible (count ≥ threshold), so Pure is the only
            variant that can reach 0. */}
        <div className="flex flex-wrap gap-1.5">
          {hub.pure.length > 0 && <Chip name={`Pure ${base} (${hub.pure.length})`} tone="green" />}
          {inlineCombos.map((combo) => (
            <Chip key={combo.slug} name={`${combo.label} (${combo.count})`} tone="green" />
          ))}
          {eligibleCombos.length > inlineCombos.length && (
            <span className="font-mono text-xxs text-latent-mid self-center">
              +{eligibleCombos.length - inlineCombos.length} more
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
