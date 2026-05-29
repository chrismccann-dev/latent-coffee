import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Cultivar } from '@/lib/types'
import { getFamilyColor } from '@/lib/cultivar-family-colors'

interface CultivarLeaf {
  cultivar: Cultivar
  brewCount: number
}

interface LineageGroup {
  lineage: string
  leaves: CultivarLeaf[]
}

interface FamilyGroup {
  family: string
  lineageGroups: LineageGroup[]
}

interface SpeciesGroup {
  species: string
  familyGroups: FamilyGroup[]
}

export default async function CultivarsPage() {
  const supabase = createClient()

  const [cultivarResult, brewResult] = await Promise.all([
    supabase.from('cultivars').select('*').order('cultivar_name', { ascending: true }),
    supabase.from('brews').select('id, cultivar_id'),
  ])

  if (cultivarResult.error) console.error('Error fetching cultivars:', cultivarResult.error)

  const cultivars = (cultivarResult.data || []) as Cultivar[]
  const allBrews = brewResult.data || []

  const brewCountByCultivar = new Map<string, number>()
  for (const brew of allBrews) {
    if (brew.cultivar_id) {
      brewCountByCultivar.set(brew.cultivar_id, (brewCountByCultivar.get(brew.cultivar_id) ?? 0) + 1)
    }
  }

  // Build species -> family -> lineage -> cultivar leaves, hiding 0-brew leaves.
  // Lineage hides when all its leaves hide; family hides when all its lineages hide;
  // species hides when all its families hide.
  const speciesMap = new Map<string, Map<string, Map<string, CultivarLeaf[]>>>()

  for (const cultivar of cultivars) {
    const brewCount = brewCountByCultivar.get(cultivar.id) ?? 0
    if (brewCount === 0) continue

    const species = cultivar.species || 'Unknown Species'
    const family = cultivar.genetic_family || 'Unknown Family'
    const lineage = cultivar.lineage || cultivar.cultivar_name

    if (!speciesMap.has(species)) speciesMap.set(species, new Map())
    const familyMap = speciesMap.get(species)!
    if (!familyMap.has(family)) familyMap.set(family, new Map())
    const lineageMap = familyMap.get(family)!
    if (!lineageMap.has(lineage)) lineageMap.set(lineage, [])
    lineageMap.get(lineage)!.push({ cultivar, brewCount })
  }

  const speciesGroups: SpeciesGroup[] = Array.from(speciesMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([species, familyMap]) => ({
      species,
      familyGroups: Array.from(familyMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([family, lineageMap]) => ({
          family,
          lineageGroups: Array.from(lineageMap.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([lineage, leaves]) => ({
              lineage,
              leaves: leaves.sort(
                (a, b) => b.brewCount - a.brewCount || a.cultivar.cultivar_name.localeCompare(b.cultivar.cultivar_name)
              ),
            })),
        })),
    }))

  const totalCultivars = speciesGroups.reduce(
    (sum, s) => sum + s.familyGroups.reduce((sm, f) => sm + f.lineageGroups.reduce((sn, l) => sn + l.leaves.length, 0), 0),
    0
  )

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-mono text-xs font-semibold tracking-wide uppercase text-latent-mid">
          CULTIVARS
        </h1>
        <div className="font-mono text-xs text-latent-mid">
          {totalCultivars} {totalCultivars === 1 ? 'CULTIVAR' : 'CULTIVARS'}
        </div>
      </div>

      {totalCultivars === 0 ? (
        <div className="text-center py-16">
          <p className="font-mono text-sm text-latent-mid">NO CULTIVARS YET</p>
        </div>
      ) : (
        <div className="space-y-10">
          {speciesGroups.map((speciesGroup) => (
            <div key={speciesGroup.species}>
              <h2 className="font-mono text-lg font-semibold tracking-wide uppercase text-latent-fg mb-4">
                {speciesGroup.species}
              </h2>

              <div className="space-y-8">
                {speciesGroup.familyGroups.map((familyGroup) => (
                  <div key={familyGroup.family}>
                    <div className="flex items-center gap-2 mb-4">
                      <div
                        className="w-4 h-4 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: getFamilyColor(familyGroup.family) }}
                      />
                      <h3 className="font-mono text-xs font-semibold tracking-wide uppercase text-latent-fg">
                        {familyGroup.family} ({familyGroup.lineageGroups.length})
                      </h3>
                    </div>

                    <div className="space-y-6">
                      {familyGroup.lineageGroups.map((lineageGroup) => (
                        <div key={lineageGroup.lineage}>
                          <div className="font-mono text-xxs font-semibold tracking-wide uppercase text-latent-mid mb-2">
                            {lineageGroup.lineage}
                          </div>
                          <div className="space-y-0">
                            {lineageGroup.leaves.map(({ cultivar, brewCount }) => (
                              <Link
                                key={cultivar.id}
                                href={`/cultivars/${cultivar.id}`}
                                className="flex items-center gap-3 py-3 border-b border-latent-border hover:bg-white transition-colors group"
                              >
                                <div
                                  className="w-10 h-10 rounded flex-shrink-0"
                                  style={{ backgroundColor: getFamilyColor(familyGroup.family) }}
                                />
                                <div className="flex-1">
                                  <div className="font-sans text-sm font-semibold">
                                    {cultivar.cultivar_name}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="font-mono text-xs text-latent-mid">
                                    {brewCount} {brewCount === 1 ? 'coffee' : 'coffees'}
                                  </div>
                                  <span className="font-mono text-xs text-latent-mid opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
