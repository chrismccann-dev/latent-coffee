import type { RoastRecipe } from '@/lib/types'

// Drop rules card — 2 rows (if running fast / slow) × N batches. Renders
// unconditionally; auto-hide guards live at every call site so the import
// surface stays simple. Amber-tinted (latent-roast-emphasis token) per
// redesign.md § 5.5 — drop rules are roast-side signals to watch during
// execution. Originally inline in app/(app)/green/[id]/page.tsx (Sub Pages
// 6.3); extracted when the rule-of-3 hit at Sub Pages 6.8 — foreground
// surface on waiting-for-next-roast, collapsible disclosure on
// waiting-for-next-cupping + resolved.
export function DropRulesCard({ recipes }: { recipes: RoastRecipe[] }) {
  return (
    <div className="bg-latent-roast-emphasis-surface border border-latent-roast-emphasis rounded p-4">
      <div className="label mb-3">Drop Rules</div>
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className="text-left pr-4 font-sans font-normal text-latent-mid text-xs pb-2">
              {/* row-label column — blank header */}
            </th>
            {recipes.map((r) => (
              <th
                key={r.id}
                className="text-left px-3 font-sans font-semibold text-latent-fg text-xs pb-2"
              >
                {r.batch_slot ?? r.recipe_name ?? '?'}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="pr-4 font-sans text-xs text-latent-mid align-top py-2">
              <div>If running fast</div>
              <div className="text-latent-subtle font-normal">hits end before exp. total</div>
            </td>
            {recipes.map((r) => (
              <td key={r.id} className="px-3 align-top py-2 text-xs leading-relaxed">
                {r.drop_rule_if_fast ?? '—'}
              </td>
            ))}
          </tr>
          <tr>
            <td className="pr-4 font-sans text-xs text-latent-mid align-top py-2">
              <div>If running slow</div>
              <div className="text-latent-subtle font-normal">past exp. total no end hit</div>
            </td>
            {recipes.map((r) => (
              <td key={r.id} className="px-3 align-top py-2 text-xs leading-relaxed">
                {r.drop_rule_if_slow ?? '—'}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
