import { SectionCard } from '@/components/SectionCard'
import { Tag } from '@/components/Tag'
import {
  FLAVOR_FAMILIES,
  getFamilyColor,
  getFlavorFamily,
  type FlavorFamily,
} from '@/lib/flavor-registry'

interface FlavorNotesByFamilyProps {
  // Pairs of [note, count], typically pre-sorted by count desc.
  notes: [string, number][]
  title?: string
}

type FamilyKey = FlavorFamily | 'Other'

// Render order: registry families first in registry order, then Other last.
const FAMILY_ORDER: FamilyKey[] = [...FLAVOR_FAMILIES, 'Other']

export function FlavorNotesByFamily({ notes, title = 'COMMON FLAVOR NOTES' }: FlavorNotesByFamilyProps) {
  if (notes.length === 0) return null

  const byFamily: Record<FamilyKey, [string, number][]> = {
    Citrus: [], 'Stone Fruit': [], Berry: [], Tropical: [], 'Grape & Wine': [],
    Floral: [], 'Tea & Herbal': [], 'Sweet & Confection': [], Other: [],
  }
  for (const entry of notes) {
    byFamily[getFlavorFamily(entry[0])].push(entry)
  }

  return (
    <SectionCard title={title}>
      <div className="space-y-4">
        {FAMILY_ORDER.map((family) => {
          const items = byFamily[family]
          if (items.length === 0) return null
          const color = getFamilyColor(family)
          return (
            <div key={family}>
              <div
                className="font-mono text-xxs font-semibold tracking-wide uppercase mb-2"
                style={{ color }}
              >
                {family}
              </div>
              <div className="flex flex-wrap gap-2">
                {items.map(([note, count]) => (
                  <Tag key={note}>
                    {note}
                    {count > 1 ? ` (${count})` : ''}
                  </Tag>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </SectionCard>
  )
}
