// Canonical confidence-label helper — the ONE brew-count rule for every
// confidence bar app-wide (process / roaster / cultivar / terroir). Chris-locked
// 2026-05-28: "that feels about right as a general rule for all of the confidence
// bars." Consolidated here 2026-05-28 so the four surfaces can't drift apart.
//   5+   = HIGH   (Strong)
//   2-4  = MEDIUM (Emerging)
//   1    = LOW    (Anecdotal); 0 also LOW
// Callers that need a surface-specific `desc` (e.g. terroir's non-process count)
// spread the result and override `desc` while keeping the shared `label`/`emoji`.
// Do NOT re-inline these thresholds in a page — import confidenceFor.

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
