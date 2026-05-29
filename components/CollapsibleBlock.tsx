interface CollapsibleBlockProps {
  title: string
  children: React.ReactNode
}

/** SectionCard variant collapsed by default at every breakpoint.
 *  Pure CSS — a single native <details> with a SectionCard-styled summary bar.
 *  No client component, no hydration flicker. Used for archive-style catch-all
 *  blocks (terroir / cultivar / roaster "Additional Information", /brews/[id]
 *  "Full Brew Notes", /processes/* sub-pages). Children render once, so the
 *  earlier re-mount caveat no longer applies — but keep to static prose; this
 *  isn't meant for stateful client components. */
export function CollapsibleBlock({ title, children }: CollapsibleBlockProps) {
  return (
    <details className="rounded-md p-6 mb-4 bg-white border border-latent-border group">
      <summary className="font-mono text-xxs font-semibold tracking-wide uppercase text-latent-mid cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden flex items-center justify-between">
        <span>{title}</span>
        <span aria-hidden className="ml-2 transition-transform group-open:rotate-180">▾</span>
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  )
}
