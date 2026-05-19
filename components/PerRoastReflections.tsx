import { CollapsibleSection } from '@/components/CollapsibleSection'

// Per-roast reflection prose — roast-specific narrative that doesn't
// generalize to cross-batch reasoning (redesign § 4.4). Drill-down below
// RoastLogTable on all three lifecycle states rather than per-row expansion
// keeps the dense 9-column table compact.

type RoastReflectionLike = {
  id: string
  batch_id?: string | null
  roast_date?: string | null
  what_worked?: string | null
  what_didnt?: string | null
  what_to_change?: string | null
  // Sprint 11 (migration 061, 2026-05-20): RO-CP-3 4-value audibility enum.
  fc_audibility?: 'audible' | 'subtle' | 'silent' | 'ambiguous' | null
}

type Props = {
  roasts: RoastReflectionLike[]
}

export function PerRoastReflections({ roasts }: Props) {
  const populated = roasts.filter(
    (r) => r.what_worked || r.what_didnt || r.what_to_change || r.fc_audibility,
  )
  if (populated.length === 0) return null

  return (
    <CollapsibleSection
      title={`PER-ROAST REFLECTIONS (${populated.length} POPULATED)`}
    >
      <div className="space-y-6">
        {populated.map((roast) => (
          <div
            key={roast.id}
            className="pb-6 border-b border-latent-border last:border-b-0 last:pb-0"
          >
            <div className="font-mono text-xs text-latent-mid mb-3">
              Batch #{roast.batch_id ?? '?'}
              {roast.roast_date && ` · ${roast.roast_date}`}
            </div>
            <div className="space-y-3 font-sans text-sm leading-relaxed">
              {roast.fc_audibility && (
                <div>
                  <div className="label">FC audibility</div>
                  {roast.fc_audibility}
                </div>
              )}
              {roast.what_worked && (
                <div>
                  <div className="label">What worked</div>
                  {roast.what_worked}
                </div>
              )}
              {roast.what_didnt && (
                <div>
                  <div className="label">What didn&apos;t</div>
                  {roast.what_didnt}
                </div>
              )}
              {roast.what_to_change && (
                <div>
                  <div className="label">What to change</div>
                  {roast.what_to_change}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </CollapsibleSection>
  )
}
