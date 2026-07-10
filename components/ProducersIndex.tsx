'use client'

// Client shell for the /producers index (Producers-first-class sprint,
// 2026-06-19; reshaped 2026-07-09, design-audit F2+F4 close-out). Owns the
// relationship-state pill spine + facet filters; the server page does the DB
// read + aggregation and hands down a lightweight ProducerCardData[]. Pills
// are views (a producer can match several), not a partition. The index's job
// is filtered scanning — default view is Priority targets, cards are terse
// single-column rows, dossier reading lives on the detail page. Default sort:
// evidence depth → tier → brew count (Priority tab leads with bucket rank).
// Facet row collapses behind FILTERS ▾ below lg (chrome @media exception,
// grilling-queue 52; index pages aren't .ssp-page container surfaces).

import { useMemo, useState } from 'react'
import { FilterTrigger, IndexCap } from '@/components/IndexList'
import { ProducerCard } from '@/components/ProducerCard'
import { bucketRank, type ProducerCardData, type ProducerTab } from '@/lib/producers'

// Pill order = lived priority (2026-07-09). "Indexed" dropped from the row —
// it's the zero-evidence catalog tail, reachable via All producers, not a
// browse mode. "Needs enrichment" is arbiter-facing, kept reachable but muted.
const TABS: { key: ProducerTab; label: string; muted?: boolean }[] = [
  { key: 'priority', label: 'Priority targets' },
  { key: 'in_inventory', label: 'In inventory' },
  { key: 'roasted', label: 'Roasted by me' },
  { key: 'brewed', label: 'Brewed' },
  { key: 'all', label: 'All producers' },
  { key: 'needs_enrichment', label: 'Needs enrichment', muted: true },
]

const ANY = '__any__'

export function ProducersIndex({ producers }: { producers: ProducerCardData[] }) {
  const [tab, setTab] = useState<ProducerTab>('priority')
  const [country, setCountry] = useState<string>(ANY)
  const [tier, setTier] = useState<string>(ANY)
  const [system, setSystem] = useState<string>(ANY)
  const [query, setQuery] = useState<string>('')
  const [filtersOpen, setFiltersOpen] = useState(false)

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

  // Per-tab counts (facet filters don't change the pill badge counts).
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
      // Priority tab leads with the authored sourcing-bucket rank (pursue first);
      // every other tab keeps the evidence-depth spine.
      if (tab === 'priority') {
        const rankDelta = bucketRank(a.sourcingPriority) - bucketRank(b.sourcingPriority)
        if (rankDelta !== 0) return rankDelta
      }
      if (b.evidenceDepth !== a.evidenceDepth) return b.evidenceDepth - a.evidenceDepth
      const ta = a.tier ?? 99
      const tb = b.tier ?? 99
      if (ta !== tb) return ta - tb
      if (b.evidence.brews !== a.evidence.brews) return b.evidence.brews - a.evidence.brews
      return a.name.localeCompare(b.name)
    })
  }, [producers, tab, country, tier, system, query])

  const totalVisible = producers.filter((p) => p.tabs.includes('all')).length
  const facetsActive =
    (country !== ANY ? 1 : 0) + (tier !== ANY ? 1 : 0) + (system !== ANY ? 1 : 0) + (query.trim() ? 1 : 0)

  const selectClass =
    'font-mono text-xxs uppercase tracking-wide bg-latent-surface border border-latent-border px-2 py-1.5 text-latent-fg'

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <IndexCap
        left="PRODUCERS"
        right={`${totalVisible} PRODUCERS · ${producers.length} TRACKED`}
      />

      {/* Relationship-state pill spine (always visible — these are views, not facets) */}
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
                  : t.muted
                    ? 'bg-transparent text-latent-subtle border-latent-hairline hover:text-latent-mid ml-auto'
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

      {/* Facet filters — collapse behind FILTERS ▾ below lg (brews pattern) */}
      <div className="lg:hidden mt-3">
        <FilterTrigger
          label="Filters"
          activeCount={facetsActive}
          open={filtersOpen}
          onClick={() => setFiltersOpen((v) => !v)}
        />
      </div>
      <div className={`${filtersOpen ? 'flex' : 'hidden'} lg:flex flex-wrap items-center gap-2 mt-3`}>
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

      {/* Card list — single column; dossier depth lives on the detail page */}
      {visible.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-mono text-sm text-latent-mid">NO PRODUCERS MATCH</p>
        </div>
      ) : (
        <>
          <div className="font-mono text-xxs text-latent-mid mt-4 mb-2">
            {visible.length} {visible.length === 1 ? 'producer' : 'producers'}
          </div>
          <div className="flex flex-col gap-3">
            {visible.map((p) => (
              <ProducerCard key={p.key} p={p} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
