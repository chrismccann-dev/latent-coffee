// Confidence-label helper shared across all /processes aggregation pages.
// Rule 5 thresholds (HIGH cutoff confirmed at 5+ in Sub-sprint 4f 2026-05-28 —
// 5 is the honest "HIGH" bar; the doc was aligned to the long-standing code):
//   5+   = Strong   (HIGH on the dark confidence card)
//   2-4  = Emerging (MEDIUM)
//   1    = Anecdotal (LOW)
// Signature methods may render at 1 brew and use the same LOW label - the
// "signature" badge lives on the page chrome, not the confidence card.

export interface ConfidenceLabel {
  emoji: string
  label: string
  desc: string
}

export function confidenceFor(brewCount: number): ConfidenceLabel {
  if (brewCount >= 5) {
    return { emoji: '🟢', label: 'HIGH', desc: `${brewCount} coffees explored` }
  }
  if (brewCount >= 2) {
    return { emoji: '🟡', label: 'MEDIUM', desc: `${brewCount} coffees explored` }
  }
  const noun = brewCount === 1 ? 'coffee' : 'coffees'
  return { emoji: '🔴', label: 'LOW', desc: `${brewCount} ${noun} explored` }
}
