import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import {
  ROASTER_FAMILIES,
  getRoasterFamily,
  getFamilyColor,
  type RoasterFamily,
} from '@/lib/roaster-registry'

interface RoasterGroup {
  roaster: string
  brewCount: number
}

type FamilyKey = RoasterFamily | 'Unknown'

export default async function RoastersPage() {
  const supabase = createClient()

  const { data: brews, error } = await supabase
    .from('brews')
    .select('roaster')

  if (error) console.error('Error fetching brews:', error)

  const familyMap: Record<string, RoasterGroup[]> = {}

  for (const brew of brews || []) {
    if (!brew.roaster) continue
    const family = getRoasterFamily(brew.roaster)
    if (!familyMap[family]) familyMap[family] = []

    const existing = familyMap[family].find(g => g.roaster === brew.roaster)
    if (existing) {
      existing.brewCount += 1
    } else {
      familyMap[family].push({ roaster: brew.roaster, brewCount: 1 })
    }
  }

  for (const groups of Object.values(familyMap)) {
    groups.sort((a, b) => b.brewCount - a.brewCount || a.roaster.localeCompare(b.roaster))
  }

  const familyOrder: FamilyKey[] = [
    ...ROASTER_FAMILIES,
    ...(familyMap['Unknown'] ? ['Unknown' as const] : []),
  ]
  const orderedFamilies = familyOrder.filter(f => familyMap[f]?.length)

  const totalRoasters = Object.values(familyMap).reduce((sum, groups) => sum + groups.length, 0)

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-mono text-xs font-semibold tracking-wide uppercase text-latent-mid">
          ROASTERS
        </h1>
        <div className="font-mono text-xs text-latent-mid">
          {totalRoasters} {totalRoasters === 1 ? 'ROASTER' : 'ROASTERS'}
        </div>
      </div>

      {totalRoasters === 0 ? (
        <div className="text-center py-16">
          <p className="font-mono text-sm text-latent-mid">NO ROASTERS YET</p>
        </div>
      ) : (
        <div className="space-y-8">
          {orderedFamilies.map((family) => {
            const groups = familyMap[family]
            const color = getFamilyColor(family)
            return (
              <div key={family}>
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-4 h-4 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <h2 className="font-mono text-xs font-semibold tracking-wide uppercase text-latent-mid">
                    {family} ({groups.length})
                  </h2>
                </div>

                <div className="space-y-0">
                  {groups.map((group) => (
                    <Link
                      key={group.roaster}
                      href={`/roasters/${encodeURIComponent(group.roaster)}`}
                      className="flex items-center gap-3 py-3 border-b border-latent-border hover:bg-white transition-colors group"
                    >
                      <div
                        className="w-10 h-10 rounded flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <div className="flex-1">
                        <div className="font-sans text-sm font-semibold">
                          {group.roaster}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="font-mono text-xs text-latent-mid">
                          {group.brewCount} {group.brewCount === 1 ? 'coffee' : 'coffees'}
                        </div>
                        <span className="font-mono text-xs text-latent-mid opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
