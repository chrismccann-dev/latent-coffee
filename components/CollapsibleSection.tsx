// Lab-document collapsible (`.ssp-coll`) — the ONE disclosure shell for both
// page families (polish-audit Pass 3 merged the byte-similar former
// CollapsibleSection / CollapsibleBlock pair; both export names survive).
//
// `padded` wraps children in a `.ssp-sub` padded block — the green-page shape
// (CollapsibleSection). Without it children render bare inside `.body` and
// carry their own `.ssp-sub` blocks stacking with hairline dividers — the
// aggregation-page shape (CollapsibleBlock). Pure CSS, collapsed by default,
// no client component / hydration flicker.
//
// `ct` is an optional right-aligned context line in the summary.

type Props = {
  title: React.ReactNode
  ct?: React.ReactNode
  padded?: boolean
  children: React.ReactNode
}

function Collapsible({ title, ct, padded, children }: Props) {
  return (
    <details className="ssp-coll">
      <summary>
        {title}
        {ct ? <span className="ct">{ct}</span> : null}
        <span className="chev" />
      </summary>
      <div className="body">{padded ? <div className="ssp-sub">{children}</div> : children}</div>
    </details>
  )
}

/** Green-page collapsible — padded `.ssp-sub` body. */
export function CollapsibleSection(props: Omit<Props, 'padded'>) {
  return <Collapsible {...props} padded />
}

/** Aggregation-page "Additional Information" collapsible — bare body. */
export function CollapsibleBlock(props: Omit<Props, 'padded'>) {
  return <Collapsible {...props} />
}
