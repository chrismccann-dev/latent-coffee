import { SspShead } from '@/components/Ssp'
import { CollapsibleSection } from '@/components/CollapsibleSection'

// Sub Pages 6.4 (2026-05-13). Shared across all 5 /green lifecycle shapes —
// the same 9-col dense roast log off the same roasts rows. Re-skinned to the
// Ssp* `.ssp-log` mono table in Redesign Sprint 4 (2026-05-29) (artboard
// `GreenRoastLog`).
//
// API:
// - roasts: chronologically sorted Roast rows for the lot
// - cuppings: full cupping rows (used to compute the WB-to-Ground Agtron delta
//   — primary cupping per roast = first by cupping_date asc)
// - highlightedBatchIds: optional batch_id strings to emphasize. Waiting views
//   pass the current experiment's batch_ids; resolved/unresolved pass the
//   single reference/leading batch. Rendered as `tr.winner` (green tint) — the
//   artboard's one row-highlight treatment — plus a neutral marker on the batch
//   cell.
// - defaultCollapsed: when true, renders inside a `.ssp-coll` CollapsibleSection
//   (all current callers pass true); otherwise an `.ssp-card` titled section.

// Structural row shape — caller passes joined arrays from the green_beans fetch.
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

  // Primary ground Agtron per roast — first cupping by encounter order (callers
  // pass cuppings sorted by cupping_date asc).
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

  const highlightSet = new Set(highlightedBatchIds ?? [])

  const tableBody = (
    <div className="ssp-log-wrap">
      <table className="ssp-log">
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
              <tr key={roast.id} className={isHighlighted ? 'winner' : ''}>
                <td>
                  #{roast.batch_id}
                  {isHighlighted && <span className="ml-1">●</span>}
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

  if (defaultCollapsed) {
    return (
      <CollapsibleSection title={`Roast Log · ${roasts.length} roasts`}>
        {tableBody}
      </CollapsibleSection>
    )
  }

  return (
    <div className="ssp-card">
      <SspShead ct="As-recorded per batch">Roast Log · {roasts.length} roasts</SspShead>
      {tableBody}
    </div>
  )
}
