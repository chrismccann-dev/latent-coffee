// Shared confidence card for all 6 /processes aggregation page kinds.
// Reads the canonical confidence label via lib/confidence.

import { SectionCard } from '@/components/SectionCard'
import { confidenceFor } from '@/lib/confidence'

export function ProcessConfidenceCard({ brewCount }: { brewCount: number }) {
  const confidence = confidenceFor(brewCount)
  return (
    <SectionCard dark>
      <div className="font-mono text-xxs font-medium opacity-60 uppercase mb-3">CONFIDENCE</div>
      <div className="flex items-center gap-3">
        <span className="text-xl">{confidence.emoji}</span>
        <div>
          <div className="font-mono text-sm font-semibold">{confidence.label}</div>
          <div className="font-mono text-xs opacity-60">{confidence.desc}</div>
        </div>
      </div>
    </SectionCard>
  )
}
