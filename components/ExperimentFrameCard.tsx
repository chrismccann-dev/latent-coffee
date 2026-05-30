import { SspShead, SspProseRows } from '@/components/Ssp'

// skipControlBaseline lets the cupping view hide the field because it's
// already surfaced inside <ReferenceSignalsCard> as "Anchor cup".

type ExperimentFrameLike = {
  experiment_id?: string | null
  context?: string | null
  control_baseline?: string | null
  shared_constants?: string | null
  levels_tested?: string | null
  expected_outcomes?: string | null
  failure_boundary?: string | null
}

type Props = {
  latestExp: ExperimentFrameLike
  title: string
  skipControlBaseline?: boolean
  // Sub-sprint 4a Bundle B: bare=true skips the outer SectionCard so the
  // body can render inside a CollapsibleSection wrapper (which provides its
  // own card chrome + title). The WaitingForNextRoastView + WaitingForNextCuppingView
  // both pass bare=true so the frame card collapses by default — design-time
  // context is reference, not load-bearing for the active roast/cup decision.
  bare?: boolean
}

export function ExperimentFrameCard({
  latestExp,
  title,
  skipControlBaseline = false,
  bare = false,
}: Props) {
  type RowSpec = { label: string; value: string | null | undefined }
  const rows: RowSpec[] = [
    { label: 'Context', value: latestExp.context },
    skipControlBaseline
      ? null
      : { label: 'Control baseline', value: latestExp.control_baseline },
    { label: 'Shared constants', value: latestExp.shared_constants },
    { label: 'Levels tested', value: latestExp.levels_tested },
    { label: 'Expected outcomes', value: latestExp.expected_outcomes },
    { label: 'Failure boundary', value: latestExp.failure_boundary },
  ].filter((r): r is RowSpec => r != null)

  const visible = rows.filter((r) => r.value != null && r.value !== '')
  if (visible.length === 0) return null

  const body = (
    <SspProseRows rows={visible.map((row) => ({ label: row.label, value: row.value }))} />
  )

  if (bare) return body

  return (
    <div className="ssp-card">
      <SspShead>{title}</SspShead>
      {body}
    </div>
  )
}
