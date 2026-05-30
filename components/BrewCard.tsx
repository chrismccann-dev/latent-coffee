import Link from 'next/link'
import type { Brew } from '@/lib/types'
import { getCoverColor } from '@/lib/brew-colors'
import { getStrategyStyle } from '@/lib/extraction-strategy'
import { getDisplayName } from '@/lib/roaster-registry'

/**
 * /brews book-cover card (Redesign Sprint 6 PR3, 2026-05-29). Adopts the v2
 * paper-foot split: identity + flavor on the colored cover FACE, producer /
 * region / roaster on a warm-paper FOOTER below it. This supersedes the prior
 * "all content on the cover, no text below" rule for the brews index (Chris's
 * call). CSS = `.brew-card` in globals.css.
 *
 * The strategy abbrev (CLA / BAL / FUL) renders as a neutral white `.pill-tr`
 * per v2 — the cover bg already carries the per-brew color.
 */
export function BrewCard({ brew }: { brew: Brew }) {
  const coverColor = getCoverColor(brew)
  const short = getStrategyStyle(brew.extraction_strategy)?.short
  // The card's big title is the coffee's variety. Many brews carry the cultivar
  // only via the cultivar_id FK (brew.variety free-text is null), so fall back
  // to the joined cultivar name — otherwise the card loses its visual anchor.
  const variety = brew.variety || brew.cultivar?.cultivar_name || null
  const producer = brew.producer || brew.green_bean?.producer || null
  const region =
    brew.terroir?.macro_terroir ||
    brew.terroir?.admin_region ||
    brew.terroir?.country ||
    null
  const roaster = getDisplayName(brew.roaster)
  const flavorLine =
    brew.flavor_notes && brew.flavor_notes.length > 0
      ? brew.flavor_notes.slice(0, 4).join(' · ')
      : null

  return (
    <Link href={`/brews/${brew.id}`} className="brew-card">
      <div className="face" style={{ background: coverColor }}>
        {short ? <span className="pill-tr">{short}</span> : null}
        {variety ? <div className="variety">{variety}</div> : null}
        {brew.process ? <div className="process">{brew.process}</div> : null}
        {flavorLine ? <div className="flav">{flavorLine}</div> : null}
      </div>
      {(producer || region || roaster) && (
        <div className="who">
          {producer ? <div className="producer">{producer}</div> : null}
          {region ? <div className="where">{region}</div> : null}
          {roaster ? <div className="roaster">via {roaster}</div> : null}
        </div>
      )}
    </Link>
  )
}
