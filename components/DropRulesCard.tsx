import { SspInset } from '@/components/Ssp'
import type { RoastRecipe } from '@/lib/types'

// Drop rules — 2 rows (if running fast / slow) × N batches. Renders
// unconditionally; auto-hide guards live at every call site. Re-skinned to the
// amber `.ssp-inset` (grid mode) in Redesign Sprint 4 (2026-05-29) via the
// shared SspInset primitive — the single drop-rules grid builder across all
// /green views. Consumers: the waiting-roast hypothesis card (passes a
// V-labelled `title`), the cupping Recipe-Design-Intent disclosure, and the
// resolved/unresolved Reference/Leading Recipe Design Intent disclosures.
export function DropRulesCard({
  recipes,
  title = 'Drop Rules',
}: {
  recipes: RoastRecipe[]
  title?: string
}) {
  const cols = recipes.map((r) => r.batch_slot ?? r.recipe_name ?? '?')
  const rows = [
    {
      label: 'If running fast',
      sub: 'hits end before exp. total',
      cells: recipes.map((r) => r.drop_rule_if_fast ?? '—'),
    },
    {
      label: 'If running slow',
      sub: 'past exp. total no end hit',
      cells: recipes.map((r) => r.drop_rule_if_slow ?? '—'),
    },
  ]
  return <SspInset mode="grid" tone="amber" title={title} cols={cols} rows={rows} />
}
