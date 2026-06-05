import Link from 'next/link'

interface DetailBackLinkProps {
  /** Destination of the back-link, e.g. `/terroirs` or `baseHubUrl(base)`. */
  href: string
  /** The destination label; rendered after the constant "← Back to " prefix. */
  children: React.ReactNode
}

/** The "← Back to X" link that leads every aggregation detail page. Was an
 *  identical inline `<Link>` (same 4-class mono/uppercase/tracking style) copy-
 *  pasted across all 8 detail pages; this is the single consistency point so a
 *  style-token change is a one-file edit. Candidate 2 of the detail-page dedup
 *  audit (docs/audits/architecture/01-detail-pages.md). */
export function DetailBackLink({ href, children }: DetailBackLinkProps) {
  return (
    <Link
      href={href}
      className="font-mono text-xs uppercase tracking-[0.16em] text-latent-mid hover:text-latent-fg"
    >
      ← Back to {children}
    </Link>
  )
}
