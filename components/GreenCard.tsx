import Link from 'next/link'
import type { LifecycleState } from '@/lib/lifecycle-state'

/**
 * /green index lot card (side-quest MB-6, 2026-05-30). Parallels BrewCard's
 * paper-foot split, but the content is lifecycle-state-dependent because a
 * green lot has no single "flavor" the way a brew does:
 *
 *  - Active lots (waiting-for-roast / -cupping): face shows identity
 *    (origin · variety · process); foot shows the lot code. The top-right pill
 *    is the current V-set (V2 / V3) or ONE-SHOT.
 *  - Resolved / unresolved lots: face shows the reference/leading brew's
 *    tasting notes; foot shows the reference/leading batch + the V-set / roast /
 *    cupping tally. The top-right pill is the reference batch (#187).
 *
 * Face background = the --tile-* lifecycle gradient color (sage → olive-bronze
 * → roasted-brown → grey), bound per-state in page.tsx's TILE_COLOR map. CSS =
 * `.green-card` in globals.css. The card is purely presentational — page.tsx
 * builds the GreenCardData (it owns the FK joins + pick logic).
 */

export type GreenCardData = {
  id: string
  name: string
  tileColor: string
  state: LifecycleState
  /** Top-right pill: "V2" / "ONE-SHOT" (active) or "#187" (archive). */
  pill: string | null
  /** Active face line: "Brazil · Wush Wush · Natural". */
  identityLine: string | null
  /** Archive face line: reference/leading brew flavor notes. */
  flavorLine: string | null
  /** Active foot: lot code. */
  lotCode: string | null
  /** Archive foot line 1: "Reference: Batch #187" / "Leading Candidate: Batch #179". */
  referenceLabel: string | null
  /** Archive foot line 2: "5 V-Sets · 16 Roasts · 20 Cuppings" or "One-Shot Lot". */
  summaryLine: string | null
}

function isArchive(state: LifecycleState): boolean {
  return state === 'resolved' || state === 'unresolved'
}

export function GreenCard({ lot }: { lot: GreenCardData }) {
  const archive = isArchive(lot.state)
  const bottomLine = archive ? lot.flavorLine : lot.identityLine

  return (
    <Link href={`/green/${lot.id}`} className="green-card">
      <div className="face" style={{ background: lot.tileColor }}>
        {lot.pill ? <span className="pill-tr">{lot.pill}</span> : null}
        <div className="lot-name">{lot.name}</div>
        {bottomLine ? <div className="line">{bottomLine}</div> : null}
      </div>
      <div className="foot">
        {archive ? (
          <>
            {lot.referenceLabel ? <div className="ref">{lot.referenceLabel}</div> : null}
            {lot.summaryLine ? <div className="tally">{lot.summaryLine}</div> : null}
          </>
        ) : lot.lotCode ? (
          <div className="code">{lot.lotCode}</div>
        ) : null}
      </div>
    </Link>
  )
}
