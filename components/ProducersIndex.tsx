'use client'

// Client shell for the /producers index (Producers-first-class sprint,
// 2026-06-19). Owns the relationship-state tab spine + facet filters; the
// server page does the DB read + aggregation and hands down a lightweight
// ProducerCardData[]. Tabs are views (a producer can match several), not a
// partition. Default sort: evidence depth → tier → brew count (open-question
// lean, accepted). Grid responsive at the 1024 point (index pages aren't
// .ssp-page container surfaces; the header @media exception applies).

import { useMemo, useState } from 'react'
import { IndexCap } from '@/components/IndexList'
import { ProducerCard } from '@/components/ProducerCard'
import type { ProducerCardData, ProducerTab } from '@/lib/producers'

const TABS: { key: ProducerTab; label: string }[] = [
  { key: 'all', label: 'All producers' },
  { key: 'in_inventory', label: 'In inventory' },
  { key: 'roasted', label: 'Roasted by me' },
  { key: 'brewed', label: 'Brewed' },
  { key: 'target', label: 'Target producer' },
  { key: 'needs_enrichment', label: 'Needs enrichment' },
]

const ANY = '__any__'

export function ProducersIndex({ producers }: { producers: ProducerCardData[] }) {
  const [tab, setTab] = useState<ProducerTab>('all')
  const [country, setCountry] = useState<string>(ANY)
  const [tier, setTier] = useState<string>(ANY)
  const [system, setSystem] = useState<string>(ANY)
  const [query, setQuery] = useState<string>('')

  // Facet option lists (from the full corpus, not the active filter).
  const countries = useMemo(
    () =>
      producers
        .map((p) => p.country)
        .filter((c): c is string => !!c)
        .filter((c, i, a) => a.indexOf(c) === i)
        .sort(),
    [producers],
  )
  const systems = useMemo(
    () =>
      producers
        .map((p) => p.producerSystem)
        .filter((s): s is string => !!s)
        .filter((s, i, a) => a.indexOf(s) === i)
        .sort(),
    [producers],
  )

  // Per-tab counts (facet filters don't change the tab badge counts).
  const tabCounts = useMemo(() => {
    const counts = {} as Record<ProducerTab, number>
    for (const t of TABS) counts[t.key] = producers.filter((p) => p.tabs.includes(t.key)).length
    return counts
  }, [producers])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = producers.filter((p) => {
      if (!p.tabs.includes(tab)) return false
      if (country !== ANY && p.country !== country) return false
      if (tier !== ANY && String(p.tier ?? '') !== tier) return false
      if (system !== ANY && p.producerSystem !== system) return false
      if (q) {
        const hay = [
          p.name,
          p.farmName ?? '',
          p.country ?? '',
          p.region ?? '',
          p.producerSystem ?? '',
          ...p.knownFor,
          ...p.primaryCultivars,
        ]
          .join(' ')
          .toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
    return filtered.sort((a, b) => {
      if (b.evidenceDepth !== a.evidenceDepth) return b.evidenceDepth - a.evidenceDepth
      const ta = a.tier ?? 99
      const tb = b.tier ?? 99
      if (ta !== tb) return ta - tb
      if (b.evidence.brews !== a.evidence.brews) return b.evidence.brews - a.evidence.brews
      return a.name.localeCompare(b.name)
    })
  }, [producers, tab, country, tier, system, query])

  const totalVisible = producers.filter((p) => p.tabs.includes('all')).length

  const selectClass =
    'font-mono text-xxs uppercase tracking-wide bg-latent-surface border border-latent-border px-2 py-1.5 text-latent-fg'

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <IndexCap
        left="PRODUCERS"
        right={`${totalVisible} PRODUCERS · ${producers.length} TRACKED`}
      />

      {/* Relationship-state tab spine */}
      <div className="flex flex-wrap gap-1.5 mt-4">
        {TABS.map((t) => {
          const active = t.key === tab
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`font-mono text-xxs uppercase tracking-wide px-3 py-1.5 border transition-colors ${
                active
                  ? 'bg-latent-accent text-white border-latent-accent'
                  : 'bg-latent-surface text-latent-mid border-latent-border hover:text-latent-fg'
              }`}
            >
              {t.label}
              <span className={active ? 'ml-1.5 opacity-70' : 'ml-1.5 text-latent-subtle'}>
                {tabCounts[t.key]}
              </span>
            </button>
          )
        })}
      </div>

      {/* Facet filters */}
      <div className="flex flex-wrap items-center gap-2 mt-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search producers…"
          className="font-mono text-xxs bg-latent-surface border border-latent-border px-2.5 py-1.5 text-latent-fg placeholder:text-latent-subtle flex-1 min-w-[160px]"
        />
        <select className={selectClass} value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value={ANY}>All countries</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select className={selectClass} value={tier} onChange={(e) => setTier(e.target.value)}>
          <option value={ANY}>All tiers</option>
          <option value="1">Tier 1</option>
          <option value="2">Tier 2</option>
          <option value="3">Tier 3</option>
        </select>
        <select className={selectClass} value={system} onChange={(e) => setSystem(e.target.value)}>
          <option value={ANY}>All systems</option>
          {systems.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Card grid */}
      {visible.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-mono text-sm text-latent-mid">NO PRODUCERS MATCH</p>
        </div>
      ) : (
        <>
          <div className="font-mono text-xxs text-latent-mid mt-4 mb-2">
            {visible.length} {visible.length === 1 ? 'producer' : 'producers'}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {visible.map((p) => (
              <ProducerCard key={p.key} p={p} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
