import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Terroir } from '@/lib/types'
import { getTerroirKeywords } from '@/lib/terroir-matching'

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
  brewCount: number
  representativeId: string
}

export default async function TerroirsPage() {
  const supabase = createClient()

  // Fetch terroirs, brews, and green_beans for text-based matching
  const [terroirResult, brewResult, greenBeanResult] = await Promise.all([
    supabase.from('terroirs').select('*').order('country', { ascending: true }),
    supabase.from('brews').select('id, coffee_name, green_bean_id'),
    supabase.from('green_beans').select('id, name, origin, region')
  ])

  if (terroirResult.error) console.error('Error fetching terroirs:', terroirResult.error)

  const terroirs = (terroirResult.data || []) as Terroir[]
  const allBrews = (brewResult.data || []) as any[]
  const allGreenBeans = (greenBeanResult.data || []) as any[]

  // Map green_bean_id → {origin, region}
  const gbMap: Record<string, { origin: string | null, region: string | null }> = {}
  for (const gb of allGreenBeans) {
    gbMap[gb.id] = { origin: gb.origin, region: gb.region }
  }

  // For each terroir, count matching brews via text search
  // A brew matches a terroir if the brew's coffee_name OR its green_bean's
  // origin/region contains any of the terroir's location keywords
  function countBrewsForTerroir(terroir: Terroir): number {
    const keywords = getTerroirKeywords(terroir)
    if (keywords.length === 0) return 0

    let count = 0
    for (const brew of allBrews) {
      const coffeeName = (brew.coffee_name || '').toLowerCase()
      const gb = brew.green_bean_id ? gbMap[brew.green_bean_id] : null
      const gbOrigin = (gb?.origin || '').toLowerCase()
      const gbRegion = (gb?.region || '').toLowerCase()

      const matches = keywords.some(kw =>
        coffeeName.includes(kw) || gbOrigin.includes(kw) || gbRegion.includes(kw)
      )
      if (matches) count++
    }
    return count
  }

  // Group by country → macro_terroir
  const countryMap: Record<string, MacroTerroirGroup[]> = {}

  for (const terroir of terroirs) {
    const country = terroir.country || 'Unknown'
    const macroKey = terroir.macro_terroir || terroir.admin_region || country

    if (!countryMap[country]) countryMap[country] = []

    const existing = countryMap[country].find(g => g.macroTerroir === macroKey)
    if (existing) {
      existing.terroirs.push(terroir)
      existing.brewCount += countBrewsForTerroir(terroir)
    } else {
      countryMap[country].push({
        macroTerroir: macroKey,
        terroirs: [terroir],
        brewCount: countBrewsForTerroir(terroir),
        representativeId: terroir.id,
      })
    }
  }

  // Deduplicate brew counts per macro group (a brew might match multiple terroirs in the group)
  for (const groups of Object.values(countryMap)) {
    for (const group of groups) {
      if (group.terroirs.length > 1) {
        // Recount: a brew matching ANY terroir in the group counts once
        const allKeywords = group.terroirs.flatMap(t => getTerroirKeywords(t))
        const uniqueKeywords = Array.from(new Set(allKeywords))
        let count = 0
        for (const brew of allBrews) {
          const coffeeName = (brew.coffee_name || '').toLowerCase()
          const gb = brew.green_bean_id ? gbMap[brew.green_bean_id] : null
          const gbOrigin = (gb?.origin || '').toLowerCase()
          const gbRegion = (gb?.region || '').toLowerCase()

          const matches = uniqueKeywords.some(kw =>
            coffeeName.includes(kw) || gbOrigin.includes(kw) || gbRegion.includes(kw)
          )
          if (matches) count++
        }
        group.brewCount = count
      }
    }
  }

  // DEBUG: check green_bean data
  const sampleGBs = allGreenBeans.slice(0, 5).map((gb: any) => ({
    name: gb.name, origin: gb.origin, region: gb.region, id: gb.id
  }))
  const debugInfo = {
    brewCount: allBrews.length,
    greenBeanCount: allGreenBeans.length,
    brewsWithGreenBeanId: allBrews.filter((b: any) => b.green_bean_id).length,
    sampleGBs,
    sampleBrews: allBrews.slice(0, 3).map((b: any) => ({ coffee_name: b.coffee_name, green_bean_id: b.green_bean_id })),
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

      {/* DEBUG: remove after fixing */}
      <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-6 font-mono text-xs">
        <div className="font-bold mb-2">DEBUG</div>
        <pre className="whitespace-pre-wrap">{JSON.stringify(debugInfo, null, 2)}</pre>
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
