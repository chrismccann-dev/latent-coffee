import { Chip } from '@/components/Ssp'
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
  // Retained for back-compat with un-migrated callers; the component always
  // renders the bare `.ssp-sub` form now (it only ever lives inside a
  // CollapsibleBlock on the aggregation pages). Removed once every caller drops it.
  bare?: boolean
}

type FamilyKey = FlavorFamily | 'Other'

// Render order: registry families first in registry order, then Other last.
const FAMILY_ORDER: FamilyKey[] = [...FLAVOR_FAMILIES, 'Other']

/** Family-grouped flavor-note chips. Re-skinned to the v2 Ssp* lab-document
 *  family in Redesign Sprint 5 (2026-05-29) — renders a `.ssp-sub` block (mono
 *  `<h3>` title + per-family `Chip` clusters in family color). Lives inside a
 *  CollapsibleBlock `.body`. */
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
    <div className="ssp-sub">
      <h3>{title}</h3>
      <div className="space-y-3">
        {FAMILY_ORDER.map((family) => {
          const items = byFamily[family]
          if (items.length === 0) return null
          const color = getFamilyColor(family)
          return (
            <div key={family}>
              <div
                className="font-mono text-micro font-semibold tracking-[0.18em] uppercase mb-1.5"
                style={{ color }}
              >
                {family}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {items.map(([note, count]) => (
                  <Chip key={note} name={count > 1 ? `${note} (${count})` : note} tone="green" />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
