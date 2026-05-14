import { SectionCard } from '@/components/SectionCard'

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
}

export function ExperimentFrameCard({
  latestExp,
  title,
  skipControlBaseline = false,
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

  return (
    <SectionCard title={title}>
      <div className="space-y-4 font-sans text-sm leading-relaxed">
        {visible.map((row) => (
          <div key={row.label}>
            <div className="label">{row.label}</div>
            {row.value}
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
