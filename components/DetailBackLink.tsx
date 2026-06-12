import Link from 'next/link'

interface DetailBackLinkProps {
  /** Destination of the back-link, e.g. `/terroirs` or `baseHubUrl(base)`. */
  href: string
  /** The destination label; rendered after the constant "← Back to " prefix. */
  children: React.ReactNode
}

/** The "← Back to X" link that leads every detail page (aggregation + brew +
 *  green — the last inline copies swapped in the polish-audit sprint). The
 *  single consistency point so a style-token change is a one-file edit;
 *  tracking snapped from the off-scale 0.16em to tracking-widest (0.15em) in
 *  the same sprint. Candidate 2 of the detail-page dedup audit
 *  (docs/audits/architecture/01-detail-pages.md). */
export function DetailBackLink({ href, children }: DetailBackLinkProps) {
  return (
    <Link
      href={href}
      className="font-mono text-xs uppercase tracking-widest text-latent-mid hover:text-latent-fg"
    >
      ← Back to {children}
    </Link>
  )
}
