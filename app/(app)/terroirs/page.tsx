import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Terroir } from '@/lib/types'

const countryColors: Record<string, string> = {
  'Brazil': '#4A3728',
  'China': '#3D3D3D',
  'Colombia': '#7A3B4B',
  'Costa Rica': '#2D5E3A',
  'Ecuador': '#4A6B3B',
  'Ethiopia': '#6B7B3B',
  'Guatemala': '#3B5B6B',
  'Panama': '#4A7C59',
  'Peru': '#5B4A6B',
  'Burundi': '#6B4A3B',
  'Kenya': '#8B3B2B',
  'Rwanda': '#7B3B4B',
}

function getCountryColor(country: string): string {
  return countryColors[country] || '#555555'
}

interface MacroTerroirGroup {
  macroTerroir: string
  terroirs: Terroir[]
  mesoTerroirs: string[]
  brewCount: number
  representativeId: string
}

export default async function TerroirsPage() {
  const supabase = createClient()

  // Fetch terroirs, brews, and green_beans separately to count via both paths
  const [terroirResult, brewResult, greenBeanResult] = await Promise.all([
    supabase.from('terroirs').select('*').order('country', { ascending: true }),
    supabase.from('brews').select('id, terroir_id, green_bean_id'),
    supabase.from('green_beans').select('id, terroir_id').not('terroir_id', 'is', null)
  ])

  if (terroirResult.error) console.error('Error fetching terroirs:', terroirResult.error)
  if (brewResult.error) console.error('Error fetching brews:', brewResult.error)
  if (greenBeanResult.error) console.error('Error fetching green_beans:', greenBeanResult.error)

  const terroirs = terroirResult.data
  const allBrews = (brewResult.data || []) as any[]
  const allGreenBeans = (greenBeanResult.data || []) as any[]

  // DEBUG: surface data state in the UI (remove after fixing)
  const sampleBrews = allBrews.slice(0, 5).map((b: any) => ({
    coffee_name: b.coffee_name,
    variety: b.variety,
    terroir_id: b.terroir_id,
    green_bean_id: b.green_bean_id,
  }))
  const sampleTerroirs = (terroirs || []).slice(0, 3).map((t: any) => ({
    country: t.country,
    admin_region: t.admin_region,
    macro_terroir: t.macro_terroir,
    meso_terroir: t.meso_terroir,
  }))
  const debugInfo = {
    brewCount: allBrews.length,
    brewsWithTerroirId: allBrews.filter((b: any) => b.terroir_id).length,
    sampleBrews,
    sampleTerroirs,
  }

  // Map green_bean_id → terroir_id
  const gbTerroirMap: Record<string, string> = {}
  for (const gb of allGreenBeans) {
    if (gb.terroir_id) gbTerroirMap[gb.id] = gb.terroir_id
  }

  // Build terroir_id → brew count (direct FK or via green_bean)
  const terroirBrewCounts: Record<string, number> = {}
  for (const brew of allBrews) {
    const tid = brew.terroir_id || (brew.green_bean_id && gbTerroirMap[brew.green_bean_id])
    if (tid) {
      terroirBrewCounts[tid] = (terroirBrewCounts[tid] || 0) + 1
    }
  }

  // Group by country → macro_terroir
  const countryMap: Record<string, MacroTerroirGroup[]> = {}

  for (const terroir of (terroirs || []) as any[]) {
    const country = terroir.country || 'Unknown'
    const macroKey = terroir.macro_terroir || terroir.admin_region || country

    if (!countryMap[country]) countryMap[country] = []

    const existing = countryMap[country].find(g => g.macroTerroir === macroKey)
    if (existing) {
      existing.terroirs.push(terroir)
      // Accumulate brew count
      existing.brewCount += terroirBrewCounts[terroir.id] || 0
      // Collect meso terroirs
      if (terroir.meso_terroir) {
        for (const meso of terroir.meso_terroir.split(',')) {
          const trimmed = meso.trim()
          if (trimmed && !existing.mesoTerroirs.includes(trimmed)) {
            existing.mesoTerroirs.push(trimmed)
          }
        }
      }
    } else {
      const mesoTerroirs: string[] = []
      if (terroir.meso_terroir) {
        for (const meso of terroir.meso_terroir.split(',')) {
          const trimmed = meso.trim()
          if (trimmed) mesoTerroirs.push(trimmed)
        }
      }
      countryMap[country].push({
        macroTerroir: macroKey,
        terroirs: [terroir],
        mesoTerroirs,
        brewCount: terroirBrewCounts[terroir.id] || 0,
        representativeId: terroir.id,
      })
    }
  }

  const totalMacroTerroirs = Object.values(countryMap).reduce((sum, groups) => sum + groups.length, 0)

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-mono text-xs font-semibold tracking-wide uppercase text-latent-mid">
          TERROIRS
        </h1>
        <div className="font-mono text-xs text-latent-mid">
          {totalMacroTerroirs} {totalMacroTerroirs === 1 ? 'REGION' : 'REGIONS'}
        </div>
      </div>

      {/* DEBUG: remove after fixing brew counts */}
      <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-6 font-mono text-xs">
        <div className="font-bold mb-2">DEBUG DATA STATE</div>
        <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
      </div>

      {totalMacroTerroirs === 0 ? (
        <div className="text-center py-16">
          <p className="font-mono text-sm text-latent-mid">NO TERROIRS YET</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(countryMap).map(([country, macroGroups]) => (
            <div key={country}>
              {/* Country header with swatch */}
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-4 h-4 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: getCountryColor(country) }}
                />
                <h2 className="font-mono text-xs font-semibold tracking-wide uppercase text-latent-mid">
                  {country} ({macroGroups.length})
                </h2>
              </div>

              <div className="space-y-0">
                {macroGroups.map((group) => (
                  <Link
                    key={group.macroTerroir}
                    href={`/terroirs/${group.representativeId}`}
                    className="flex items-center gap-3 py-3 border-b border-latent-border hover:bg-white transition-colors group"
                  >
                    {/* Color swatch */}
                    <div
                      className="w-10 h-10 rounded flex-shrink-0"
                      style={{ backgroundColor: getCountryColor(country) }}
                    />
                    <div className="flex-1">
                      <div className="font-sans text-sm font-semibold">
                        {group.macroTerroir}
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
          ))}
        </div>
      )}
    </div>
  )
}
