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
}

export function TagLinkList({ title, items }: TagLinkListProps) {
  if (items.length === 0) return null
  return (
    <SectionCard title={title}>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Link key={item.key} href={item.href}>
            <Tag>{item.label}</Tag>
          </Link>
        ))}
      </div>
    </SectionCard>
  )
}
