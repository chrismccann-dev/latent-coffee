// Card-chrome collapsible. Extracted in Sub Pages 6.7 /simplify pass after
// the duplicated `<details className="bg-white border border-latent-border
// rounded-md p-6 mb-4">` skeleton hit 5+ call sites (RoastLogTable's
// defaultCollapsed branch / All Cuppings + Experiment Journey on the
// resolved view / CrossBatchNotesBlock / PerRoastReflections). Pre-formatted
// title string keeps the API dumb — caller composes count/suffix inline.

type Props = {
  title: React.ReactNode
  children: React.ReactNode
}

export function CollapsibleSection({ title, children }: Props) {
  return (
    <details className="bg-white border border-latent-border rounded-md p-6 mb-4">
      <summary className="cursor-pointer font-mono text-xxs font-semibold tracking-wide uppercase text-latent-mid hover:text-latent-fg">
        {title}
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  )
}
