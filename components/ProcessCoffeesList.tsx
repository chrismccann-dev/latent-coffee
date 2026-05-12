// Shared coffees-list section for all 6 /processes aggregation page kinds.
// Renders an internal-section list of brews with book-cover swatch + name +
// meta line + hover affordance. Meta line is composable; defaults to
// "variety · country · roaster".

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

export function ProcessCoffeesList({ title, brews, metaFor = DEFAULT_META }: ProcessCoffeesListProps) {
  return (
    <SectionCard title={title}>
      <div className="space-y-0">
        {brews.map((brew) => (
          <Link
            key={brew.id}
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
        ))}
      </div>
    </SectionCard>
  )
}
