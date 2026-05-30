import { CollapsibleSection } from '@/components/CollapsibleSection'
import { SspProseRows } from '@/components/Ssp'
import { SLOT_LETTERS, type PriorExperimentShape } from '@/lib/lifecycle-state'

// Reads V_(n-1)'s observed_outcome_* slots — the CURRENT experiment's are
// still NULL during the cupping window. See docs/roasting/redesign.md § 4.2
// for the cross-batch-notes framing.

type Props = {
  priorExp: PriorExperimentShape | null
}

export function CrossBatchNotesBlock({ priorExp }: Props) {
  if (!priorExp) return null

  const rows = SLOT_LETTERS.map((slot) => ({
    slot,
    value: priorExp[`observed_outcome_${slot}`] ?? null,
  })).filter((r) => r.value != null && r.value !== '')

  if (rows.length === 0) return null

  const label = priorExp.experiment_id
    ? `Cross-Batch Notes · ${priorExp.experiment_id}`
    : 'Cross-Batch Notes · V_(n-1)'

  return (
    <CollapsibleSection title={label} ct={`${rows.length} populated`}>
      <SspProseRows
        rows={rows.map((row) => ({ label: row.slot.toUpperCase(), value: row.value }))}
      />
    </CollapsibleSection>
  )
}
