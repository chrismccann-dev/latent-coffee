// Lab-document collapsible (`.ssp-coll`). Re-skinned in Redesign Sprint 4
// (2026-05-29) from the prior `<details className="bg-white border ...">`
// card-chrome to the v2 Ssp* family — hairline-prefixed mono summary +
// chevron + `.ssp-sub` padded body. Used ONLY by the /green page + its three
// collapsible shared components (RoastLogTable's defaultCollapsed branch /
// PerRoastReflections / CrossBatchNotesBlock) plus the page-level All-Cuppings
// / Experiment-Journey / Experiment-Frame / Drop-Rules disclosures — re-skinning
// it here is what closes the green collapse seam in one move. (The aggregation
// pages use the separate CollapsibleBlock, untouched.)
//
// `ct` is an optional right-aligned context line in the summary (additive —
// every existing caller passes `title` only).

type Props = {
  title: React.ReactNode
  ct?: React.ReactNode
  children: React.ReactNode
}

export function CollapsibleSection({ title, ct, children }: Props) {
  return (
    <details className="ssp-coll">
      <summary>
        {title}
        {ct ? <span className="ct">{ct}</span> : null}
        <span className="chev" />
      </summary>
      <div className="body">
        <div className="ssp-sub">{children}</div>
      </div>
    </details>
  )
}
