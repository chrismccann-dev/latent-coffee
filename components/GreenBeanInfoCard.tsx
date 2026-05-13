import { SectionCard } from '@/components/SectionCard'

// Sub Pages 6.4 (2026-05-13). Extracted from app/(app)/green/[id]/page.tsx 6.3
// inline render. Shared across the waiting-for-next-roast (6.3),
// waiting-for-next-cupping (6.4), and resolved (6.5) page shapes — all three
// surface the same 6-field grid plus producer's tasting notes prose, driven
// by the same green_beans row.
//
// Prop-driven (not self-fetching): the parent already has the green_beans row
// from its top-level Supabase query. No duplicate round-trip.
//
// producer_tasting_notes is a DB column (migration 039) but not yet typed on
// the GreenBean interface in lib/types.ts. Reading it via a structural type
// here keeps the component compatible until the type is updated.

type GreenBeanInfo = {
  producer?: string | null
  purchase_date?: string | null
  price_per_kg?: number | null
  quantity_g?: number | null
  moisture?: string | null
  density?: string | null
  producer_tasting_notes?: string | null
}

export function GreenBeanInfoCard({ bean }: { bean: GreenBeanInfo }) {
  return (
    <SectionCard title="GREEN BEAN INFO">
      <div className="grid grid-cols-2 gap-x-8 gap-y-3 font-sans text-sm mb-4">
        {bean.producer && (
          <div>
            <strong>Producer:</strong> {bean.producer}
          </div>
        )}
        {bean.purchase_date && (
          <div>
            <strong>Purchased:</strong> {bean.purchase_date}
          </div>
        )}
        {bean.price_per_kg && (
          <div>
            <strong>Price:</strong> ${bean.price_per_kg}/kg
          </div>
        )}
        {bean.quantity_g && (
          <div>
            <strong>Quantity:</strong> {bean.quantity_g}g
          </div>
        )}
        {bean.moisture && (
          <div>
            <strong>Moisture:</strong> {bean.moisture}%
          </div>
        )}
        {bean.density && (
          <div>
            <strong>Density:</strong> {bean.density} g/L
          </div>
        )}
      </div>
      {bean.producer_tasting_notes && (
        <div>
          <div className="label">Producer&apos;s Tasting Notes</div>
          <div className="font-sans text-sm leading-relaxed">
            {bean.producer_tasting_notes}
          </div>
        </div>
      )}
    </SectionCard>
  )
}
