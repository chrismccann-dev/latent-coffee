interface CollapsibleBlockProps {
  title: string
  children: React.ReactNode
}

/** Aggregation-page "Additional Information" disclosure. Re-skinned to the v2
 *  Ssp* lab-document family in Redesign Sprint 5 (2026-05-29) — the `.ssp-coll`
 *  collapse (hairline-prefixed mono summary + chevron + `.body`), the direct
 *  analog of the CollapsibleSection → `.ssp-coll` move from Sprint 4. Children
 *  are bare `.ssp-sub` blocks (FlavorNotesByFamily / TagLinkList) that stack with
 *  hairline dividers inside `.body`. Pure CSS, collapsed by default at every
 *  breakpoint, no client component / hydration flicker. */
export function CollapsibleBlock({ title, children }: CollapsibleBlockProps) {
  return (
    <details className="ssp-coll">
      <summary>
        {title}
        <span className="chev" />
      </summary>
      <div className="body">{children}</div>
    </details>
  )
}
