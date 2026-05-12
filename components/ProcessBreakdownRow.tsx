// Shared label-prefixed chip row for the Process Breakdown block on
// Honey subprocess / modifier-combo / signature sub-pages. Each row is a
// canonical axis label (Base / Fermentation / Drying / Intervention /
// Subprocess) + a flex-wrap of canonical-form chips.

export function ProcessBreakdownRow({
  label,
  chips,
}: {
  label: string
  chips: readonly string[]
}) {
  if (chips.length === 0) return null
  return (
    <div className="flex items-center gap-3">
      <div className="font-mono text-xxs uppercase tracking-wide text-latent-mid w-24 flex-shrink-0">
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {chips.map((c) => (
          <span
            key={c}
            className="inline-block font-mono text-chip uppercase tracking-wide bg-latent-highlight border border-latent-highlight-border text-latent-fg px-2 py-1 rounded"
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  )
}
