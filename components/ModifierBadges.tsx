import { composeModifierLabel, type Modifier } from '@/lib/extraction-modifiers'

interface ModifierBadgesProps {
  modifiers: Modifier[] | null | undefined
}

/** Display-only render of the modifiers axis on a brew detail page.
 *  Empty/null state renders muted "None" text. Each modifier renders as a
 *  pill with the composed label inline. */
export function ModifierBadges({ modifiers }: ModifierBadgesProps) {
  const list = modifiers ?? []
  if (list.length === 0) {
    return <span className="font-mono text-xs text-latent-mid">None</span>
  }
  return (
    <div className="flex flex-wrap gap-2">
      {list.map((m, i) => (
        <span
          key={i}
          className="inline-flex items-center px-2 py-1 rounded-full border border-latent-border bg-latent-highlight text-latent-fg font-sans text-xs"
        >
          {composeModifierLabel(m)}
        </span>
      ))}
    </div>
  )
}
