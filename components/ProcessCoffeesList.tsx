// Shared coffees-list section for all 6 /processes aggregation page kinds.
// Renders an internal-section list of brews with book-cover swatch + name +
// meta line + hover affordance. Meta line is composable; defaults to
// "variety · country · roaster".
//
// Long-list guard (Sub-sprint 4f, 2026-05-28): high-count processes (Natural,
// Washed) can run dozens of coffees. Show the first 10 inline and tuck the
// remainder behind a pure-CSS <details> expander so the section never grows
// unbounded. Same group-open disclosure idiom as CollapsibleBlock — no client
// component, no hydration.

import Link from 'next/link'
import { getCoverColor } from '@/lib/brew-colors'
import type { Brew } from '@/lib/types'
import { SectionCard } from '@/components/SectionCard'

export interface ProcessCoffeesListProps {
  title: string
  brews: Brew[]
  metaFor?: (brew: Brew) => string
}

const DEFAULT_META = (brew: Brew) =>
  [brew.variety, brew.terroir?.country, brew.roaster].filter(Boolean).join(' · ')

const VISIBLE_LIMIT = 10

function CoffeeRow({ brew, metaFor }: { brew: Brew; metaFor: (brew: Brew) => string }) {
  return (
    <Link
      href={`/brews/${brew.id}`}
      className="flex items-center gap-3 py-3 border-b border-latent-border last:border-b-0 hover:bg-latent-bg transition-colors group"
    >
      <div
        className="w-8 h-10 rounded flex-shrink-0"
        style={{ backgroundColor: getCoverColor(brew) }}
      />
      <div className="flex-1 min-w-0">
        <div className="font-sans text-sm font-semibold">{brew.coffee_name}</div>
        <div className="font-mono text-xxs text-latent-mid">{metaFor(brew)}</div>
      </div>
      <span className="font-mono text-xs text-latent-mid opacity-0 group-hover:opacity-100 transition-opacity">→</span>
    </Link>
  )
}

export function ProcessCoffeesList({ title, brews, metaFor = DEFAULT_META }: ProcessCoffeesListProps) {
  const visible = brews.slice(0, VISIBLE_LIMIT)
  const hidden = brews.slice(VISIBLE_LIMIT)

  return (
    <SectionCard title={title}>
      <div className="space-y-0">
        {visible.map((brew) => (
          <CoffeeRow key={brew.id} brew={brew} metaFor={metaFor} />
        ))}
        {hidden.length > 0 && (
          <details className="group">
            <summary className="flex items-center gap-2 py-3 cursor-pointer list-none font-mono text-xs text-latent-mid hover:text-latent-fg transition-colors">
              <span className="group-open:hidden">Show {hidden.length} more</span>
              <span className="hidden group-open:inline">Show fewer</span>
              <span className="transition-transform group-open:rotate-180">▾</span>
            </summary>
            <div className="space-y-0">
              {hidden.map((brew) => (
                <CoffeeRow key={brew.id} brew={brew} metaFor={metaFor} />
              ))}
            </div>
          </details>
        )}
      </div>
    </SectionCard>
  )
}
