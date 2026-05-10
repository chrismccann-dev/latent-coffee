interface CollapsibleBlockProps {
  title: string
  children: React.ReactNode
}

/** SectionCard variant that's open on desktop and collapsed on mobile.
 *  Pure CSS — renders two trees and toggles visibility at the md: breakpoint
 *  (768px). No client component, no hydration flicker. Used on /brews/[id]
 *  for the "Full Brew Notes" archive block (sensory / temp evo / takeaways).
 *  Children re-mount across the breakpoint, so this is only safe for static
 *  prose; don't pass stateful client components. */
export function CollapsibleBlock({ title, children }: CollapsibleBlockProps) {
  return (
    <>
      {/* Desktop: open SectionCard equivalent. */}
      <div className="hidden md:block rounded-md p-6 mb-4 bg-white border border-latent-border">
        <div className="font-mono text-xxs font-semibold tracking-wide uppercase mb-4 text-latent-mid">
          {title}
        </div>
        {children}
      </div>
      {/* Mobile: native <details>, collapsed by default. */}
      <details className="md:hidden rounded-md p-6 mb-4 bg-white border border-latent-border group">
        <summary className="font-mono text-xxs font-semibold tracking-wide uppercase text-latent-mid cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden flex items-center justify-between">
          <span>{title}</span>
          <span aria-hidden className="ml-2 transition-transform group-open:rotate-180">▾</span>
        </summary>
        <div className="mt-4">{children}</div>
      </details>
    </>
  )
}
