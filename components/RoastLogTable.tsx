import { SectionCard } from '@/components/SectionCard'
import { CollapsibleSection } from '@/components/CollapsibleSection'

// Sub Pages 6.4 (2026-05-13). Extracted from app/(app)/green/[id]/page.tsx
// 6.3 inline render. Shared across the waiting-for-next-roast (6.3),
// waiting-for-next-cupping (6.4), and resolved (6.5) page shapes — all three
// surface the same 9-col table off the same roasts rows.
//
// API:
// - roasts: chronologically sorted Roast rows for the lot
// - cuppings: full cupping rows (used to compute the WB-to-Ground Agtron
//   delta — primary cupping per roast, "primary" = first by cupping_date asc
//   per the legacy convention)
// - highlightedBatchIds: optional list of batch_id strings to visually emphasize.
//   6.3 + 6.4 pass the current experiment's batch_ids (for V_n highlighting);
//   6.5 will pass a single-element [best_batch_id] for reference-roast
//   highlighting (same mechanism, different intent).
// - defaultCollapsed: when true, renders inside a native <details> rather
//   than an always-expanded SectionCard. 6.5's resolved view passes true so
//   the archival log defaults closed; 6.3 + 6.4 default to expanded.

// Type shape kept structural so the component doesn't bind to the full Roast
// / Cupping interfaces — caller passes whatever shape it has (joined arrays
// from the green_beans top-level fetch).
type RoastRow = {
  id: string
  batch_id?: string | null
  roast_date?: string | null
  fc_start?: string | null
  fc_temp?: number | null
  drop_time?: string | null
  drop_temp?: number | null
  dev_time_s?: number | null
  dev_ratio?: string | null
  agtron?: number | null
  profile_link?: string | null
}

type CuppingRow = {
  roast_id?: string | null
  ground_agtron?: number | null
}

type Props = {
  roasts: RoastRow[]
  cuppings: CuppingRow[]
  highlightedBatchIds?: string[]
  defaultCollapsed?: boolean
}

export function RoastLogTable({
  roasts,
  cuppings,
  highlightedBatchIds,
  defaultCollapsed = false,
}: Props) {
  if (roasts.length === 0) return null

  // Primary ground Agtron per roast — first cupping by encounter order
  // (callers should pass cuppings sorted by cupping_date asc, which the
  // existing page.tsx fetch does via .order('cupping_date', ascending)).
  const primaryGroundAgtronByRoast: Record<string, number> = {}
  for (const cup of cuppings) {
    if (
      cup.roast_id &&
      typeof cup.ground_agtron === 'number' &&
      !(cup.roast_id in primaryGroundAgtronByRoast)
    ) {
      primaryGroundAgtronByRoast[cup.roast_id] = cup.ground_agtron
    }
  }

  // O(1) highlight membership.
  const highlightSet = new Set(highlightedBatchIds ?? [])

  const tableBody = (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th>Batch</th>
            <th>Date</th>
            <th>FC</th>
            <th>FC Temp</th>
            <th>Drop</th>
            <th>Drop Temp</th>
            <th>Dev</th>
            <th>Agtron</th>
            <th title="Whole bean Agtron minus ground Agtron (primary cupping). ROASTING.md targets |Δ| ≤ 2 for even internal development.">
              WB→Gnd Δ
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {roasts.map((roast) => {
            const groundAgtron = primaryGroundAgtronByRoast[roast.id]
            const delta =
              typeof roast.agtron === 'number' && typeof groundAgtron === 'number'
                ? Number((roast.agtron - groundAgtron).toFixed(1))
                : null
            const isHighlighted =
              roast.batch_id != null && highlightSet.has(String(roast.batch_id))
            return (
              <tr key={roast.id} className={isHighlighted ? 'highlight' : ''}>
                <td className={isHighlighted ? 'font-semibold' : ''}>
                  #{roast.batch_id}
                  {isHighlighted && (
                    <span className="ml-1 font-mono text-chip text-latent-mid">●</span>
                  )}
                </td>
                <td>{roast.roast_date || '—'}</td>
                <td>{roast.fc_start || '—'}</td>
                <td>{roast.fc_temp ? `${roast.fc_temp}°C` : '—'}</td>
                <td>{roast.drop_time || '—'}</td>
                <td>{roast.drop_temp ? `${roast.drop_temp}°C` : '—'}</td>
                <td>
                  {roast.dev_time_s ? `${roast.dev_time_s}s` : '—'}
                  {roast.dev_ratio && ` (${roast.dev_ratio})`}
                </td>
                <td>{roast.agtron || '—'}</td>
                <td
                  title={
                    groundAgtron != null
                      ? `Ground Agtron: ${groundAgtron}`
                      : 'No cupping with ground Agtron'
                  }
                >
                  {delta != null ? `${delta > 0 ? '+' : ''}${delta}` : '—'}
                </td>
                <td>
                  {roast.profile_link && (
                    <a
                      href={roast.profile_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-latent-mid hover:text-latent-fg"
                      title="Roest profile"
                    >
                      ↗
                    </a>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )

  // Collapsed-by-default uses CollapsibleSection so the archival log on 6.5's
  // resolved view starts closed without React state.
  if (defaultCollapsed) {
    return (
      <CollapsibleSection title={`ROAST LOG (${roasts.length} ROASTS)`}>
        {tableBody}
      </CollapsibleSection>
    )
  }

  return (
    <SectionCard title={`ROAST LOG (${roasts.length} ROASTS)`}>
      {tableBody}
    </SectionCard>
  )
}
