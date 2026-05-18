// Sub Pages 4 (2026-05-11) — /processes index, three navigation surfaces:
//   1. Core Process Portals   — 4 base hubs (Washed / Natural / Honey / Wet-hulled)
//                                Wet-hulled hidden until first brew lands.
//   2. Modifier Index         — cross-base modifiers w/ ≥3 brews
//   3. Signature Methods      — Moonshadow / Hybrid Washed / TyOxidator
//
// All counts computed live from the brew corpus via lib/process-aggregation.ts.

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
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

const MODIFIER_AXIS_COLOR: Record<string, string> = {
  fermentation: '#722F4B',
  drying: '#8B6914',
  intervention: '#5B4A6B',
  experimental: '#5B4A6B',
}

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-mono text-xs font-semibold tracking-wide uppercase text-latent-mid">
          PROCESSES
        </h1>
        <div className="font-mono text-xs text-latent-mid">
          {baseHubs.length} BASE &middot; {totalModifiers} MODIFIERS &middot; {totalSignatures} SIGNATURES &middot; {totalCoffees} COFFEES
        </div>
      </div>

      {/* Section 1 — Core Process Portals */}
      <section className="mb-10">
        <h2 className="font-mono text-xs font-semibold tracking-wide uppercase text-latent-mid mb-3">
          Core Process Portals
        </h2>
        <div className="space-y-3">
          {baseHubs.map(({ base, hub }) => (
            <CorePortalCard key={base} base={base} hub={hub} />
          ))}
        </div>
      </section>

      {/* Section 2 — Modifier Index */}
      {modifierEntries.length > 0 && (
        <section className="mb-10">
          <h2 className="font-mono text-xs font-semibold tracking-wide uppercase text-latent-mid mb-3">
            Modifier Index
          </h2>
          <div className="space-y-0">
            {modifierEntries.map((entry) => (
              <Link
                key={entry.name}
                href={modifierIndexUrl(entry.name)}
                className="flex items-center gap-3 py-3 border-b border-latent-border hover:bg-white transition-colors group"
              >
                <div
                  className="w-4 h-4 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: MODIFIER_AXIS_COLOR[entry.axis] ?? '#5C6570' }}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-sans text-sm font-semibold">{entry.name}</div>
                  <div className="font-mono text-xxs text-latent-mid">
                    {byBaseLine(entry.byBase)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="font-mono text-xs text-latent-mid">
                    {entry.count} {entry.count === 1 ? 'coffee' : 'coffees'}
                  </div>
                  <span className="font-mono text-xs text-latent-mid opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Section 3 — Signature Methods */}
      {signatures.length > 0 && (
        <section>
          <h2 className="font-mono text-xs font-semibold tracking-wide uppercase text-latent-mid mb-3">
            Signature Methods
          </h2>
          <div className="space-y-0">
            {signatures.map((sig) => {
              const entry = getSignatureEntry(sig.name)
              let producerLine: string | null = null
              if (entry) {
                producerLine = entry.producer && entry.country
                  ? `${entry.base} · ${entry.producer}, ${entry.country}`
                  : entry.base
              }
              return (
                <Link
                  key={sig.name}
                  href={signatureUrl(sig.name)}
                  className="flex items-center gap-3 py-3 border-b border-latent-border hover:bg-white transition-colors group"
                >
                  <div
                    className="w-4 h-4 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: '#5B4A6B' }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-sans text-sm font-semibold">{sig.name}</div>
                    {producerLine && (
                      <div className="font-mono text-xxs text-latent-mid">{producerLine}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="font-mono text-xs text-latent-mid">
                      {sig.count} {sig.count === 1 ? 'coffee' : 'coffees'}
                    </div>
                    <span className="font-mono text-xs text-latent-mid opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </div>
                </Link>
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
      className="flex gap-4 items-stretch border border-latent-border rounded-md p-4 hover:bg-white transition-colors group"
    >
      <div
        className="w-24 h-24 rounded flex-shrink-0"
        style={{ backgroundColor: color }}
      />
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
        <div className="flex flex-wrap gap-1.5">
          <span className="inline-block font-mono text-chip uppercase tracking-wide bg-latent-highlight border border-latent-highlight-border text-latent-fg px-2 py-1 rounded">
            Pure {base} ({hub.pure.length})
          </span>
          {inlineCombos.map((combo) => (
            <span
              key={combo.slug}
              className="inline-block font-mono text-chip uppercase tracking-wide bg-latent-highlight border border-latent-highlight-border text-latent-fg px-2 py-1 rounded"
            >
              {combo.label} ({combo.count})
            </span>
          ))}
          {eligibleCombos.length > inlineCombos.length && (
            <span className="inline-block font-mono text-chip uppercase tracking-wide text-latent-mid px-2 py-1">
              +{eligibleCombos.length - inlineCombos.length} more
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
