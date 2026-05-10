import type { Brew } from '@/lib/types'

/** Reference Brew Recipe table — the 6 canonical brewing variables. Lives at
 *  the top of /brews/[id] as the page anchor. Pure presentational, takes the
 *  joined Brew. Bloom + pour structure + drawdown render as their own blocks
 *  underneath this table on the page. */
export function RecipeTable({ brew }: { brew: Pick<Brew, 'brewer' | 'filter' | 'dose_g' | 'water_g' | 'grind' | 'temp_c'> }) {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-2 font-sans text-sm">
      <div><strong>Brewer:</strong> {brew.brewer ?? '—'}</div>
      <div><strong>Filter:</strong> {brew.filter ?? '—'}</div>
      <div><strong>Dose:</strong> {brew.dose_g != null ? `${brew.dose_g}g` : '—'}</div>
      <div><strong>Water:</strong> {brew.water_g != null ? `${brew.water_g}g` : '—'}</div>
      <div><strong>Grind:</strong> {brew.grind ?? '—'}</div>
      <div><strong>Temp:</strong> {brew.temp_c != null ? `${brew.temp_c}°C` : '—'}</div>
    </div>
  )
}
