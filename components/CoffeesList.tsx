// Shared coffees-list section for every aggregation detail page (roaster /
// cultivar / terroir / processes). Re-skinned to the v2 Ssp* lab-document family
// in Redesign Sprint 5 (2026-05-29), generalizing the prior ProcessCoffeesList:
// `<SspShead>` header + bordered list of hairline-divided rows + book-cover
// swatch (getCoverColor) + the 10 + <details> "show more" expander.
//
// metaFor composes the per-coffee meta line (each page passes its own).
// showProcessBadge surfaces a PROCESS chip on is_process_dominant rows
// (cultivar / terroir pages); off by default.

import Link from 'next/link'
import { getCoverColor } from '@/lib/brew-colors'
import type { Brew } from '@/lib/types'
import { SspShead } from '@/components/Ssp'

export interface CoffeesListProps {
  title: string
  brews: Brew[]
  metaFor?: (brew: Brew) => string
  showProcessBadge?: boolean
}

const DEFAULT_META = (brew: Brew) =>
  [brew.variety, brew.terroir?.country, brew.roaster].filter(Boolean).join(' · ')

const VISIBLE_LIMIT = 10

function CoffeeRow({
  brew,
  metaFor,
  showProcessBadge,
}: {
  brew: Brew
  metaFor: (brew: Brew) => string
  showProcessBadge: boolean
}) {
  return (
    <Link
      href={`/brews/${brew.id}`}
      className="flex items-center gap-3 px-4 py-3 border-b border-latent-hairline last:border-b-0 hover:bg-latent-bg transition-colors group"
    >
      <div
        className="w-8 h-10 flex-shrink-0"
        style={{ backgroundColor: getCoverColor(brew) }}
      />
      <div className="flex-1 min-w-0">
        <div className="font-sans text-sm font-semibold flex items-center flex-wrap gap-2">
          <span>{brew.coffee_name}</span>
          {showProcessBadge && brew.is_process_dominant && (
            <span className="font-mono text-chip uppercase tracking-wide bg-latent-highlight border border-latent-highlight-border text-latent-fg px-2 py-0.5">
              PROCESS
            </span>
          )}
        </div>
        <div className="font-mono text-xxs text-latent-mid">{metaFor(brew)}</div>
      </div>
      <span className="font-mono text-xs text-latent-mid opacity-0 group-hover:opacity-100 transition-opacity">
        →
      </span>
    </Link>
  )
}

export function CoffeesList({
  title,
  brews,
  metaFor = DEFAULT_META,
  showProcessBadge = false,
}: CoffeesListProps) {
  const visible = brews.slice(0, VISIBLE_LIMIT)
  const hidden = brews.slice(VISIBLE_LIMIT)
  const count = brews.length

  return (
    <div>
      <SspShead ct={`${count} ${count === 1 ? 'coffee' : 'coffees'}`}>{title}</SspShead>
      <div className="border border-latent-border bg-white">
        {visible.map((brew) => (
          <CoffeeRow key={brew.id} brew={brew} metaFor={metaFor} showProcessBadge={showProcessBadge} />
        ))}
        {hidden.length > 0 && (
          <details className="group">
            <summary className="flex items-center gap-2 px-4 py-3 cursor-pointer list-none [&::-webkit-details-marker]:hidden font-mono text-xs text-latent-mid hover:text-latent-fg transition-colors border-t border-latent-hairline">
              <span className="group-open:hidden">Show {hidden.length} more</span>
              <span className="hidden group-open:inline">Show fewer</span>
              <span className="transition-transform group-open:rotate-180">▾</span>
            </summary>
            <div>
              {hidden.map((brew) => (
                <CoffeeRow key={brew.id} brew={brew} metaFor={metaFor} showProcessBadge={showProcessBadge} />
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  )
}
