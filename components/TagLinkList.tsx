import Link from 'next/link'
import { SectionCard } from './SectionCard'
import { Tag } from './Tag'

interface TagLinkItem {
  key: string
  label: string
  href: string
}

interface TagLinkListProps {
  title: string
  items: TagLinkItem[]
  // When true, renders without the SectionCard wrapper - for nesting inside
  // CollapsibleBlock or other parent chrome. Title becomes a label row,
  // tags flex-wrap directly.
  bare?: boolean
}

export function TagLinkList({ title, items, bare }: TagLinkListProps) {
  if (items.length === 0) return null

  const body = (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Link key={item.key} href={item.href}>
          <Tag>{item.label}</Tag>
        </Link>
      ))}
    </div>
  )

  if (bare) {
    return (
      <div className="mb-6 last:mb-0">
        <div className="font-mono text-xxs font-semibold tracking-wide uppercase mb-2 text-latent-mid">
          {title}
        </div>
        {body}
      </div>
    )
  }

  return <SectionCard title={title}>{body}</SectionCard>
}
