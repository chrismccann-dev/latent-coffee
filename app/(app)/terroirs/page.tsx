import { createClient } from '@/lib/supabase/server'
import { Terroir } from '@/lib/types'
import { getCountryColor } from '@/lib/country-colors'
import { IndexCap, GrlCap, GrlGroupHeader, GrlRow } from '@/components/IndexList'

interface MacroTerroirGroup {
  macroTerroir: string
  terroirs: Terroir[]
  brewCount: number
  representativeId: string
}

// Compose the mono-uppercase meta line for a macro group: elevation range
// (min of mins → max of maxes across the group's terroirs) · climate stress
// (first non-null). Either part omits when absent.
function terroirMeta(group: MacroTerroirGroup): string | undefined {
  const mins = group.terroirs.map((t) => t.elevation_min).filter((v): v is number => v != null)
  const maxs = group.terroirs.map((t) => t.elevation_max).filter((v): v is number => v != null)
  const climate = group.terroirs.find((t) => t.climate_stress)?.climate_stress
  const parts: string[] = []
  if (mins.length && maxs.length) parts.push(`${Math.min(...mins)}–${Math.max(...maxs)}m`)
  if (climate) parts.push(climate)
  return parts.length ? parts.join(' · ') : undefined
}

export default async function TerroirsPage() {
  const supabase = createClient()

  const { data: terroirs, error } = await supabase
    .from('terroirs')
    .select(`*, brews(id)`)
    .order('country', { ascending: true })

  if (error) console.error('Error fetching terroirs:', error)

  // Group by country → macro_terroir
  const countryMap: Record<string, MacroTerroirGroup[]> = {}

  for (const terroir of (terroirs || []) as any[]) {
    const country = terroir.country || 'Unknown'
    const macroKey = terroir.macro_terroir || terroir.admin_region || country

    if (!countryMap[country]) countryMap[country] = []

    const existing = countryMap[country].find(g => g.macroTerroir === macroKey)
    if (existing) {
      existing.terroirs.push(terroir)
      existing.brewCount += terroir.brews?.length || 0
    } else {
      countryMap[country].push({
        macroTerroir: macroKey,
        terroirs: [terroir],
        brewCount: terroir.brews?.length || 0,
        representativeId: terroir.id,
      })
    }
  }

  // Hide macro_terroir groups with 0 brews (auto-created skeletons from
  // green-bean uploads not yet associated with a brew). New terroirs appear
  // on the index once at least one brew references them. Matches the
  // event-driven workflow rule (memory/feedback_upload_on_resolution.md).
  for (const country of Object.keys(countryMap)) {
    countryMap[country] = countryMap[country].filter(g => g.brewCount > 0)
    if (countryMap[country].length === 0) delete countryMap[country]
  }

  const allGroups = Object.values(countryMap).flat()
  const totalMacroTerroirs = allGroups.length
  const totalCoffees = allGroups.reduce((sum, g) => sum + g.brewCount, 0)
  const countryCount = Object.keys(countryMap).length

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <IndexCap
        left="TERROIRS"
        right={`${totalMacroTerroirs} ${totalMacroTerroirs === 1 ? 'REGION' : 'REGIONS'} · ${countryCount} ${countryCount === 1 ? 'COUNTRY' : 'COUNTRIES'}`}
      />

      {totalMacroTerroirs === 0 ? (
        <div className="text-center py-16">
          <p className="font-mono text-sm text-latent-mid">NO TERROIRS YET</p>
        </div>
      ) : (
        <div className="grl">
          <GrlCap label="TERROIRS" count={totalCoffees} />
          {Object.entries(countryMap).map(([country, macroGroups]) => {
            const color = getCountryColor(country)
            return (
              <div key={country}>
                <GrlGroupHeader swatchColor={color} name={country} count={macroGroups.length} />
                {macroGroups.map((group) => (
                  <GrlRow
                    key={group.macroTerroir}
                    href={`/terroirs/${group.representativeId}`}
                    tileColor={color}
                    name={group.macroTerroir}
                    meta={terroirMeta(group)}
                    count={group.brewCount}
                  />
                ))}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
