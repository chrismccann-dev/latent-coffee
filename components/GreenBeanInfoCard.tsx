import { SspShead, SspProseRows, type ProseRow } from '@/components/Ssp'

// Sub Pages 6.4 (2026-05-13). Shared across all 5 /green lifecycle shapes —
// surfaces the same lot-intake spec rows + producer's tasting notes off the
// green_beans row. Re-skinned to the Ssp* lab-document family in Redesign
// Sprint 4 (2026-05-29): `.ssp-card` + SspShead + SspProseRows (artboard
// `GreenBeanInfoCard`).
//
// Prop-driven (not self-fetching): the parent already has the green_beans row.
//
// producer_tasting_notes is a DB column (migration 039) not yet typed on the
// GreenBean interface in lib/types.ts; read via a structural type here.
//
// Moisture / density store BARE numeric strings ("8.70" / "776") per the
// post-Sprint-A convention — the single canonical unit (% / g/L) is appended
// at render time. Preserve that here.

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

  const rows: ProseRow[] = []
  if (bean.producer) rows.push({ label: 'Producer', value: bean.producer })
  if (bean.purchase_date) rows.push({ label: 'Purchased', value: bean.purchase_date })
  if (bean.price_per_kg) rows.push({ label: 'Price', value: `$${bean.price_per_kg} / kg` })
  if (bean.quantity_g) rows.push({ label: 'Quantity', value: `${bean.quantity_g} g` })
  if (bean.moisture) rows.push({ label: 'Moisture', value: `${bean.moisture}%` })
  if (bean.density) rows.push({ label: 'Density', value: `${bean.density} g/L` })
  if (bean.producer_tasting_notes) {
    rows.push({ label: "Producer's notes", value: bean.producer_tasting_notes })
  }

  return (
    <div className="ssp-card">
      <SspShead ct="Lot intake data">Green Bean Info</SspShead>
      <SspProseRows rows={rows} />
      {showProvenanceFooter && (
        <div className="mt-4 pt-3 border-t border-latent-border text-xs text-latent-mid font-sans space-y-1">
          {autoTerroir && (
            <div>Terroir was auto-created by the most recent canonical resolution.</div>
          )}
          {autoCultivar && (
            <div>Cultivar was auto-created by the most recent canonical resolution.</div>
          )}
          {canonicalsDate && <div>Canonicals last updated: {canonicalsDate}</div>}
        </div>
      )}
    </div>
  )
}
