import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * Index-page primitives — the v2 "legacy" index family (Redesign Sprint 6,
 * 2026-05-29). React server components lifting the visual output of the
 * claude.ai/design v2 bundle §04 index archetypes; CSS lives alongside the
 * `.cap` / `.grl-*` / `.lot-stage` classes in app/globals.css. Distinct from
 * the `.ssp-*` detail-page family.
 *
 * Shared across all 6 index pages: `IndexCap` (every page), `GrlRow` +
 * `GrlGroupHeader` (the 4 aggregation indexes), `LotStage` (the /green
 * lifecycle section headers). The /brews book-cover card is its own primitive
 * (components/BrewCard.tsx).
 */

/** Page caption — left page label + right aggregate stats. */
export function IndexCap({ left, right }: { left: ReactNode; right?: ReactNode }) {
  return (
    <div className="cap">
      <span className="l">{left}</span>
      {right != null ? <span className="r">{right}</span> : null}
    </div>
  )
}

/**
 * Secondary caption under the page cap (the 4 aggregation indexes): left =
 * "{label} EXPLORED", right = "COFFEES REPRESENTED · {count}". Mono uppercase,
 * matching the page-cap register.
 */
export function GrlCap({ label, count }: { label: string; count: number }) {
  return (
    <div className="grl-cap">
      <span className="l">{label} EXPLORED</span>
      <span className="r">
        <b>COFFEES REPRESENTED</b>· {count}
      </span>
    </div>
  )
}

/** Group header — 11px swatch + uppercase group name + dim count. */
export function GrlGroupHeader({
  swatchColor,
  name,
  count,
}: {
  swatchColor: string
  name: ReactNode
  count?: number
}) {
  return (
    <div className="grl-group-hd">
      <span className="sw" style={{ background: swatchColor }} />
      {name}
      {count != null ? <span className="ct">({count})</span> : null}
    </div>
  )
}

/**
 * 5-block count bar fill — ABSOLUTE thresholds (Chris-locked 2026-05-30), so a
 * bar means the same thing on every index page rather than normalizing to the
 * per-page max. Scale: 1→1 · 2→2 · 3-4→3 · 5-7→4 · 8+→5; zero shows no blocks.
 * Unified with the confidence scale (grilling-queue 54, 2026-06-11): the
 * boundaries align with lib/confidence's Chris-locked 1 / 2-4 / 5+ labels, so
 * HIGH (5+) always lights the 4th block. ConfidenceCard renders this same fill
 * inside the dark card — the two surfaces can't drift.
 */
export function barBlocks(count: number): boolean[] {
  const on = count <= 0 ? 0 : count === 1 ? 1 : count === 2 ? 2 : count <= 4 ? 3 : count <= 7 ? 4 : 5
  return Array.from({ length: 5 }, (_, i) => i < on)
}

type GrlRowBase = {
  href: string
  tileColor: string
  name: ReactNode
  meta?: ReactNode
}

/**
 * Grouped-list row. Two shapes:
 *  - count → `.cnt` + 5-block bar with absolute thresholds (the 4 aggregation indexes).
 *  - right → `.simple` variant, free right-aligned meta (e.g. /green stage label).
 */
export function GrlRow(
  props: GrlRowBase &
    ({ count: number; right?: never } | { right: ReactNode; count?: never }),
) {
  const { href, tileColor, name, meta } = props
  const simple = 'right' in props

  return (
    <Link href={href} className={simple ? 'grl-row simple' : 'grl-row'}>
      <span className="tile" style={{ background: tileColor }} />
      <div className="body">
        <div className="name">{name}</div>
        {meta ? <div className="meta">{meta}</div> : null}
      </div>
      {'right' in props ? (
        <span className="right">{props.right}</span>
      ) : (
        <>
          <span className="cnt">{props.count}</span>
          <span className="bar">
            {barBlocks(props.count).map((on, i) => (
              <i key={i} className={on ? 'on' : undefined} />
            ))}
          </span>
        </>
      )}
    </Link>
  )
}

/** /green lifecycle section header (flat list, not the v2 card grid). */
export function LotStage({
  title,
  summary,
  rightLabel,
}: {
  title: ReactNode
  summary?: ReactNode
  rightLabel?: ReactNode
}) {
  return (
    <div className="lot-stage">
      <span className="l">
        {title}
        {summary ? <span className="ct">{summary}</span> : null}
      </span>
      {rightLabel ? <span className="r">{rightLabel}</span> : null}
    </div>
  )
}
