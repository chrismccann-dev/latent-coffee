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
  // Sprint 3.2 #8 — Phase 3 canonical provenance flags. 'auto_created' when
  // push_green_bean materialized the FK row; 'canonical' when an existing
  // row resolved. canonicals_updated_at bumps when terroir_id / cultivar_id
  // change via patch_green_bean. Surfaces as a muted footer on the card.
  terroir_provenance?: 'canonical' | 'auto_created' | null
  cultivar_provenance?: 'canonical' | 'auto_created' | null
  canonicals_updated_at?: string | null
}

function formatProvenanceDate(iso: string | null | undefined): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString().slice(0, 10)
}

export function GreenBeanInfoCard({ bean }: { bean: GreenBeanInfo }) {
  const autoTerroir = bean.terroir_provenance === 'auto_created'
  const autoCultivar = bean.cultivar_provenance === 'auto_created'
  const canonicalsDate = formatProvenanceDate(bean.canonicals_updated_at)
  const showProvenanceFooter = autoTerroir || autoCultivar || canonicalsDate

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
      {showProvenanceFooter && (
        <div className="mt-4 pt-3 border-t border-latent-border text-xs text-latent-mid font-sans space-y-1">
          {autoTerroir && (
            <div>Terroir was auto-created by the most recent canonical resolution.</div>
          )}
          {autoCultivar && (
            <div>Cultivar was auto-created by the most recent canonical resolution.</div>
          )}
          {canonicalsDate && (
            <div>Canonicals last updated: {canonicalsDate}</div>
          )}
        </div>
      )}
    </SectionCard>
  )
}
