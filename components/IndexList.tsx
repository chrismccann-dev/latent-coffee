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
 * 5-block count bar fill — recomputed per page so the highest-count row in the
 * viewport always reads 5/5 (v2 spec). Any non-zero count shows at least one
 * block.
 */
export function barBlocks(count: number, max: number): boolean[] {
  const on = max > 0 ? Math.max(count > 0 ? 1 : 0, Math.round((count / max) * 5)) : 0
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
 *  - count + max → `.cnt` + 5-block bar (the 4 aggregation indexes).
 *  - right → `.simple` variant, free right-aligned meta (e.g. /green stage label).
 */
export function GrlRow(
  props: GrlRowBase &
    ({ count: number; max: number; right?: never } | { right: ReactNode; count?: never; max?: never }),
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
            {barBlocks(props.count, props.max).map((on, i) => (
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
