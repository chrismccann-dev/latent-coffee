// Producer index card (Producers-first-class sprint, 2026-06-19). The richer
// sibling of the /roasters GrlRow — a sourcing-forward "buy / learn / remember"
// card: name + farm · tier + relationship badge · geography · system ·
// process-signature one-liner · known-for + cultivar chips · evidence line ·
// roaster-signal chips (✓ where brewed) · next-action line. Whole card links to
// /producers/[slug]. Presentational; rendered inside the client ProducersIndex.

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

      {/* Geography + system */}
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
        <span className="mx-1.5 text-latent-subtle">·</span>
        {p.producerSystem ?? 'System unknown'}
      </div>

      {/* Process signature (headline) — falls back to known-for prose when un-authored */}
      {p.processSignature ? (
        <p className="font-sans text-sm text-latent-fg mt-2 leading-snug">{p.processSignature}</p>
      ) : p.knownFor.length > 0 ? (
        <p className="font-sans text-sm text-latent-mid mt-2 leading-snug">
          Known for {p.knownFor.slice(0, 3).join(', ')}.
        </p>
      ) : null}

      {/* Known-for + cultivar chips */}
      {(p.knownFor.length > 0 || p.primaryCultivars.length > 0) && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {p.knownFor.slice(0, 3).map((k) => (
            <span key={`kf-${k}`} className="chip">
              {k}
            </span>
          ))}
          {p.primaryCultivars.slice(0, 3).map((c) => (
            <span key={`cv-${c}`} className="chip plum">
              {c}
            </span>
          ))}
        </div>
      )}

      {/* Evidence line */}
      <div className="font-mono text-xxs text-latent-mid mt-3">{evidenceLine(p.evidence)}</div>

      {/* Roaster signal chips — ✓ where actually brewed */}
      {p.roasterSignals.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {p.roasterSignals.slice(0, 6).map((r) => (
            <span key={`rs-${r.name}`} className={r.brewed ? 'chip green' : 'chip'}>
              {r.brewed ? '✓ ' : ''}
              {r.name}
            </span>
          ))}
        </div>
      )}

      {/* Next action */}
      <div className="font-mono text-xxs text-latent-mid mt-3 pt-2.5 border-t border-latent-hairline">
        <span className="text-latent-subtle tracking-wide">NEXT</span> {p.nextAction}
      </div>
    </Link>
  )
}
