import Link from 'next/link'
import { Chip } from '@/components/Ssp'

interface TagLinkItem {
  key: string
  label: string
  href: string
}

interface TagLinkListProps {
  title: string
  items: TagLinkItem[]
  // Retained for back-compat with un-migrated callers; the component always
  // renders the bare `.ssp-sub` form now (it only ever lives inside a
  // CollapsibleBlock on the aggregation pages). Removed once every caller drops it.
  bare?: boolean
}

/** Cross-link chip block (CULTIVARS / TERROIRS / PROCESSES / ROASTERS EXPLORED).
 *  Re-skinned to the v2 Ssp* lab-document family in Redesign Sprint 5
 *  (2026-05-29) — a `.ssp-sub` block (mono `<h3>` title + flex-wrap of linked
 *  `Chip`s). Lives inside a CollapsibleBlock `.body`. */
export function TagLinkList({ title, items }: TagLinkListProps) {
  if (items.length === 0) return null

  return (
    <div className="ssp-sub">
      <h3>{title}</h3>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <Link key={item.key} href={item.href}>
            <Chip name={item.label} />
          </Link>
        ))}
      </div>
    </div>
  )
}
