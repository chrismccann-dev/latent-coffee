// Producer index card (Producers-first-class sprint, 2026-06-19; simplified
// 2026-07-09, design-audit F2+F4 close-out). A terse single-column scan row:
// name + farm · tier + relationship badge · country swatch + geography ·
// decision prose clamped to 2 lines · evidence counts. The dossier depth
// (system, known-for/cultivar chips, roaster signals, NEXT action, full prose)
// lives on the detail page. Whole card links to /producers/[slug].
// Presentational; rendered inside the client ProducersIndex.

import Link from 'next/link'
import { StatusPill } from '@/components/Ssp'
import { getCountryColor } from '@/lib/country-colors'
import type { ProducerCardData } from '@/lib/producers'

function evidenceLine(e: ProducerCardData['evidence']): string {
  const parts: string[] = []
  if (e.brews) parts.push(`${e.brews} brew${e.brews === 1 ? '' : 's'}`)
  if (e.roasters) parts.push(`${e.roasters} roaster${e.roasters === 1 ? '' : 's'}`)
  if (e.lots) parts.push(`${e.lots} lot${e.lots === 1 ? '' : 's'}`)
  if (e.learnings) parts.push(`${e.learnings} learning${e.learnings === 1 ? '' : 's'}`)
  return parts.length ? parts.join(' · ') : 'No personal evidence yet'
}

export function ProducerCard({ p }: { p: ProducerCardData }) {
  const geo = [p.country, p.region].filter(Boolean).join(' · ')
  return (
    <Link
      href={`/producers/${p.slug}`}
      className="flex flex-col border border-latent-border bg-latent-surface hover:bg-latent-bg transition-colors p-4 group"
    >
      {/* Top row — name + farm | tier + relationship */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-sans text-sm font-semibold leading-snug">{p.name}</div>
          {p.farmName && (
            <div className="font-mono text-xxs text-latent-mid truncate mt-0.5">{p.farmName}</div>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {p.tier != null && <span className="chip">T{p.tier}</span>}
          <StatusPill label={p.relationship.label} tone={p.relationship.tone} />
        </div>
      </div>

      {/* Geography */}
      <div className="mt-2 font-mono text-xxs text-latent-mid">
        {p.country ? (
          <span className="inline-flex items-center gap-1.5">
            <span
              className="inline-block w-2.5 h-2.5"
              style={{ background: getCountryColor(p.country) }}
            />
            {geo}
          </span>
        ) : (
          <span className="text-latent-subtle">Origin unknown</span>
        )}
      </div>

      {/* Decision prose, clamped — full text on the detail page */}
      {p.processSignature ? (
        <p className="font-sans text-sm text-latent-fg mt-2 leading-snug line-clamp-2">
          {p.processSignature}
        </p>
      ) : p.knownFor.length > 0 ? (
        <p className="font-sans text-sm text-latent-mid mt-2 leading-snug line-clamp-2">
          Known for {p.knownFor.slice(0, 3).join(', ')}.
        </p>
      ) : null}

      {/* Evidence line */}
      <div className="font-mono text-xxs text-latent-mid mt-3">{evidenceLine(p.evidence)}</div>
    </Link>
  )
}
