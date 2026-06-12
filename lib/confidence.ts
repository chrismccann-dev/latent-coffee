// Canonical confidence-label helper — the ONE brew-count rule for every
// confidence bar app-wide (process / roaster / cultivar / terroir). Chris-locked
// 2026-05-28: "that feels about right as a general rule for all of the confidence
// bars." Consolidated here 2026-05-28 so the four surfaces can't drift apart.
//   5+   = HIGH   (Strong)
//   2-4  = MEDIUM (Emerging)
//   1    = LOW    (Anecdotal); 0 also LOW
// The visual companion is the shared 5-block bar (components/IndexList
// `barBlocks`, scale unified with these thresholds per grilling-queue 54,
// 2026-06-11 — HIGH always lights the 4th block; the old emoji field is gone).
// Callers that need a surface-specific `desc` (e.g. terroir's non-process count)
// spread the result and override `desc` while keeping the shared `label`.
// Do NOT re-inline these thresholds in a page — import confidenceFor.

export interface ConfidenceLabel {
  label: string
  desc: string
}

export function confidenceFor(brewCount: number): ConfidenceLabel {
  if (brewCount >= 5) {
    return { label: 'HIGH', desc: `${brewCount} coffees explored` }
  }
  if (brewCount >= 2) {
    return { label: 'MEDIUM', desc: `${brewCount} coffees explored` }
  }
  const noun = brewCount === 1 ? 'coffee' : 'coffees'
  return { label: 'LOW', desc: `${brewCount} ${noun} explored` }
}
