// Shared confidence card for every aggregation detail page (roaster / cultivar /
// terroir / processes). Re-skinned to the v2 Ssp* lab-document family in Redesign
// Sprint 5 (2026-05-29) — `.ssp-card.dark` + `<SspShead>`. Reads the canonical
// brew-count label via lib/confidence `confidenceFor` (5+ HIGH / 2-4 MED / 1 LOW —
// do NOT re-inline). The visual is the shared 5-block bar (`barBlocks`, unified
// scale per grilling-queue 54 — replaced the 🟢🟡🔴 emoji 2026-06-11, the last
// pictographic icon in the product); white-fill blocks via `.conf-bar`. `desc`
// overrides the default count line (terroir passes its non-process-count MEDIUM
// line).

import { SspShead } from '@/components/Ssp'
import { barBlocks } from '@/components/IndexList'
import { confidenceFor } from '@/lib/confidence'

export function ConfidenceCard({ brewCount, desc }: { brewCount: number; desc?: string }) {
  const confidence = confidenceFor(brewCount)
  return (
    <div className="ssp-card dark">
      <SspShead>Confidence</SspShead>
      <div className="flex items-center gap-3">
        <span className="conf-bar">
          {barBlocks(brewCount).map((on, i) => (
            <i key={i} className={on ? 'on' : undefined} />
          ))}
        </span>
        <div>
          <div className="font-mono text-sm font-semibold">{confidence.label}</div>
          <div className="font-mono text-xs opacity-60">{desc ?? confidence.desc}</div>
        </div>
      </div>
    </div>
  )
}
