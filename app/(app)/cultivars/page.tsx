import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Cultivar } from '@/lib/types'

const familyColors: Record<string, string> = {
  'Ethiopian Landrace Families': '#4A7C59',
  'Bourbon Family': '#3D3D3D',
  'Modern Hybrids': '#3D3D3D',
  'Typica × Bourbon Crosses': '#3D3D3D',
  'Typica Family': '#3D3D3D',
  'SL Selections': '#3D3D3D',
}

function getFamilyColor(family: string): string {
  return familyColors[family] || '#555555'
}

interface LineageGroup {
  lineage: string
  cultivars: Cultivar[]
  brewCount: number
  representativeId: string
}

export default async function CultivarsPage() {
  const supabase = createClient()

  const [cultivarResult, brewResult] = await Promise.all([
    supabase.from('cultivars').select('*').order('genetic_family', { ascending: true }),
    supabase.from('brews').select('id, cultivar_id')
  ])

  if (cultivarResult.error) console.error('Error fetching cultivars:', cultivarResult.error)

  const cultivars = (cultivarResult.data || []) as Cultivar[]
  const allBrews = brewResult.data || []

  // Build family → lineage groups first
  const familyMap: Record<string, LineageGroup[]> = {}

  for (const cultivar of cultivars) {
    const family = cultivar.genetic_family || 'Unknown Family'
    const lineage = cultivar.lineage || cultivar.cultivar_name

    if (!familyMap[family]) familyMap[family] = []

    const existing = familyMap[family].find(g => g.lineage === lineage)
    if (existing) {
      existing.cultivars.push(cultivar)
    } else {
      familyMap[family].push({
        lineage,
        cultivars: [cultivar],
        brewCount: 0,
        representativeId: cultivar.id,
      })
    }
  }

  // Count unique brews per lineage via cultivar_id FK
  for (const groups of Object.values(familyMap)) {
    for (const group of groups) {
      const cultivarIds = new Set(group.cultivars.map(c => c.id))
      group.brewCount = allBrews.filter(b => b.cultivar_id && cultivarIds.has(b.cultivar_id)).length
    }
  }

  const totalLineages = Object.values(familyMap).reduce((sum, groups) => sum + groups.length, 0)

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-mono text-xs font-semibold tracking-wide uppercase text-latent-mid">
          CULTIVARS
        </h1>
        <div className="font-mono text-xs text-latent-mid">
          {totalLineages} {totalLineages === 1 ? 'LINEAGE' : 'LINEAGES'}
        </div>
      </div>

      {totalLineages === 0 ? (
        <div className="text-center py-16">
          <p className="font-mono text-sm text-latent-mid">NO CULTIVARS YET</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(familyMap).map(([family, lineageGroups]) => (
            <div key={family}>
              {/* Family header with swatch */}
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-4 h-4 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: getFamilyColor(family) }}
                />
                <h2 className="font-mono text-xs font-semibold tracking-wide uppercase text-latent-mid">
                  {family} ({lineageGroups.length})
                </h2>
              </div>

              <div className="space-y-0">
                {lineageGroups.map((group) => (
                  <Link
                    key={group.lineage}
                    href={`/cultivars/${group.representativeId}`}
                    className="flex items-center gap-3 py-3 border-b border-latent-border hover:bg-white transition-colors group"
                  >
                    {/* Color swatch */}
                    <div
                      className="w-10 h-10 rounded flex-shrink-0"
                      style={{ backgroundColor: getFamilyColor(family) }}
                    />
                    <div className="flex-1">
                      <div className="font-sans text-sm font-semibold">
                        {group.lineage}
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
