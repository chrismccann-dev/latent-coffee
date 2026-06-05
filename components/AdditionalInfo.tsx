import { TagLinkList } from '@/components/TagLinkList'
import { FlavorNotesByFamily } from '@/components/FlavorNotesByFamily'
import { CollapsibleBlock } from '@/components/CollapsibleBlock'
import type { CrossLinkDimension, CrossLinks } from '@/lib/cross-links'

// Standardized first-person section voice (matches the app's journal voice:
// "WHAT I'VE LEARNED…", "Coffees I Have Brewed…"). Pages may override an
// individual section title when the wording carries real context (e.g. the
// roaster section names the region/cultivar it's scoped to). Centralizing the
// defaults here is what kills the "I HAVE EXPLORED" vs "EXPLORED" drift the
// audit flagged.
const DEFAULT_TITLES: Record<CrossLinkDimension, string> = {
  cultivars: 'CULTIVARS I HAVE EXPLORED',
  terroirs: 'TERROIRS I HAVE EXPLORED',
  roasters: 'ROASTERS I HAVE EXPLORED',
  processes: 'PROCESSES I HAVE EXPLORED',
}

const FLAVOR_TITLE = 'FLAVOR NOTES I HAVE EXPERIENCED'

export interface CrossLinkSection {
  dimension: CrossLinkDimension
  /** Override the standardized first-person title for this one section. */
  title?: string
}

interface AdditionalInfoProps {
  /** Pre-sorted [note, count] pairs from `aggregateFlavorNotes`. */
  flavors: [string, number][]
  /** Output of `extractCrossLinks(brewList)`. */
  links: CrossLinks
  /** Which cross-link sections to render, in order. */
  sections: CrossLinkSection[]
  /** Optional block rendered above the flavor notes (e.g. roaster metadata). */
  prepend?: React.ReactNode
}

/** The collapsed "ADDITIONAL INFORMATION" disclosure shared by all 8
 *  aggregation detail pages — flavor notes + cross-link chip groups, plus an
 *  optional prepend slot. Owns the section-title defaults and the standardized
 *  flavor-notes title, and returns `null` when there is nothing to show (so the
 *  per-page `hasAdditionalInfo` gate is no longer needed). Candidate 3 of the
 *  detail-page dedup audit (docs/audits/architecture/01-detail-pages.md). */
export function AdditionalInfo({ flavors, links, sections, prepend }: AdditionalInfoProps) {
  // TagLinkList / FlavorNotesByFamily each render null on empty input, so the
  // only gate we need is "is there anything at all?" (avoid an empty disclosure).
  const hasContent =
    prepend != null || flavors.length > 0 || sections.some((s) => links[s.dimension].length > 0)
  if (!hasContent) return null

  return (
    <CollapsibleBlock title="ADDITIONAL INFORMATION">
      {prepend}
      <FlavorNotesByFamily notes={flavors} title={FLAVOR_TITLE} />
      {sections.map((s) => (
        <TagLinkList
          key={s.dimension}
          title={s.title ?? DEFAULT_TITLES[s.dimension]}
          items={links[s.dimension]}
        />
      ))}
    </CollapsibleBlock>
  )
}
