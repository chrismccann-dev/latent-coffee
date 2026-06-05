// Shared cross-link aggregation for the aggregation detail pages
// (terroirs / cultivars / roasters / processes [id|base|...]). Replaces the
// hand-rolled `for (const brew of brewList)` loop + per-page Map→items `.map()`
// that was copy-pasted across all 8 detail pages and had begun to rot (the
// `cultivarMap` value shape diverged: `{ id }` object on terroirs/[id] vs a
// bare `string` everywhere else). One canonical shape, one keying rule.
//
// Each page renders the subset it needs; a page omits its own dimension simply
// by not selecting that embed's `id` (so the slice comes back empty) or by not
// listing the section. See <AdditionalInfo> for the render side.
//
// Candidate 1 of the detail-page dedup audit
// (docs/audits/architecture/01-detail-pages.md).

import type { Brew } from '@/lib/types'
import { processCrossLinkUrl } from '@/lib/process-routing'

export type CrossLinkDimension = 'cultivars' | 'terroirs' | 'roasters' | 'processes'

/** A single linked chip — ready to hand straight to `<TagLinkList>`. */
export interface CrossLink {
  key: string
  label: string
  href: string
}

export type CrossLinks = Record<CrossLinkDimension, CrossLink[]>

/**
 * Build the cross-link chip lists from a brew corpus.
 *
 * - **terroirs** dedupe on `macro_terroir || admin_region || country` and the
 *   label is the standardized `Country / Macro` form (the cultivars page used
 *   to render a bare macro name — that drift is fixed here).
 * - **cultivars** key on `cultivar_name`.
 * - **roasters** / **processes** are flat string sets.
 *
 * Slices for which the brew embed omits the needed `id` come back empty, which
 * is exactly what an own-dimension page wants (e.g. the cultivars page selects
 * `cultivar(cultivar_name)` without `id`, so `links.cultivars` is `[]`).
 */
export function extractCrossLinks(brews: Brew[]): CrossLinks {
  const cultivarMap = new Map<string, string>() // name -> cultivar id
  const terroirMap = new Map<string, { id: string; country: string }>() // key -> { id, country }
  const roasterSet = new Set<string>()
  const processSet = new Set<string>()

  for (const brew of brews) {
    if (brew.cultivar?.cultivar_name && brew.cultivar.id) {
      cultivarMap.set(brew.cultivar.cultivar_name, brew.cultivar.id)
    }
    if (brew.terroir?.country && brew.terroir.id) {
      const key = brew.terroir.macro_terroir || brew.terroir.admin_region || brew.terroir.country
      if (!terroirMap.has(key)) {
        terroirMap.set(key, { id: brew.terroir.id, country: brew.terroir.country })
      }
    }
    if (brew.roaster) roasterSet.add(brew.roaster)
    if (brew.base_process) processSet.add(brew.base_process)
  }

  return {
    cultivars: Array.from(cultivarMap.entries()).map(([name, id]) => ({
      key: name,
      label: name,
      href: `/cultivars/${id}`,
    })),
    terroirs: Array.from(terroirMap.entries()).map(([name, { id, country }]) => ({
      key: name,
      label: `${country} / ${name}`,
      href: `/terroirs/${id}`,
    })),
    roasters: Array.from(roasterSet).map((r) => ({
      key: r,
      label: r,
      href: `/roasters/${encodeURIComponent(r)}`,
    })),
    processes: Array.from(processSet).map((p) => ({
      key: p,
      label: p,
      href: processCrossLinkUrl(p),
    })),
  }
}
