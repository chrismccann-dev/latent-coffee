import { createClient } from '@/lib/supabase/server'
import { IndexCap, GrlCap, GrlGroupHeader, GrlRow } from '@/components/IndexList'
import {
  ROASTER_FAMILIES,
  getRoasterFamily,
  getFamilyColor,
  getDisplayName,
  getRoasterEntry,
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

  const allGroups = Object.values(familyMap).flat()
  const totalRoasters = allGroups.length
  const totalCoffees = allGroups.reduce((sum, g) => sum + g.brewCount, 0)
  // Per-page max for the 5-block bar — highest brew count across all rows.
  const maxCount = Math.max(0, ...allGroups.map((g) => g.brewCount))

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <IndexCap
        left="ROASTERS"
        right={`${totalRoasters} ${totalRoasters === 1 ? 'ROASTER' : 'ROASTERS'} · ${orderedFamilies.length} ${orderedFamilies.length === 1 ? 'FAMILY' : 'FAMILIES'}`}
      />

      {totalRoasters === 0 ? (
        <div className="text-center py-16">
          <p className="font-mono text-sm text-latent-mid">NO ROASTERS YET</p>
        </div>
      ) : (
        <div className="grl">
          <GrlCap label="ROASTERS" count={totalCoffees} />
          {orderedFamilies.map((family) => {
            const groups = familyMap[family]
            const color = getFamilyColor(family)
            return (
              <div key={family}>
                <GrlGroupHeader swatchColor={color} name={family} count={groups.length} />
                {groups.map((group) => {
                  const loc = getRoasterEntry(group.roaster)?.location
                  return (
                    <GrlRow
                      key={group.roaster}
                      href={`/roasters/${encodeURIComponent(group.roaster)}`}
                      tileColor={color}
                      name={getDisplayName(group.roaster) || group.roaster}
                      meta={loc || undefined}
                      count={group.brewCount}
                      max={maxCount}
                    />
                  )
                })}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
