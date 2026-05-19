// SYN-7 (Sprint 13) — shared helper for computing the page-side
// `currentInputMaxUpdatedAt` signal that drives SynthesisCard regeneration.
//
// The page fetches its corpus (brews + optionally roast_learnings for cross-
// source axes) and passes the per-row `updated_at` arrays here. The result
// is compared against `synthesis_input_max_updated_at` on the cache row:
// any mismatch triggers regeneration on the next page visit, even when the
// row count has not changed (rewritten what_i_learned, newly-filled
// roast_learnings).
//
// Used on 8 consumer pages — terroirs/[id], cultivars/[id], roasters/[slug],
// processes/[base], processes/[base]/[subprocess],
// processes/[base]/modifiers/[combo], processes/modifiers/[modifier],
// processes/signatures/[name]. Process pages pass only the brews array
// (process adapter is brews-only per ADR-0010 Q2).

type RowWithUpdatedAt = { updated_at?: string | null }

export function computeInputMaxUpdatedAt(...sets: Array<RowWithUpdatedAt[] | null | undefined>): string | null {
  let max: string | null = null
  for (const rows of sets) {
    if (!rows) continue
    for (const row of rows) {
      const ts = row.updated_at
      if (typeof ts === 'string' && (max === null || ts > max)) {
        max = ts
      }
    }
  }
  return max
}
