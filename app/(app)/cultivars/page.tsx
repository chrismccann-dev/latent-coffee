import { createClient } from '@/lib/supabase/server'
import { Cultivar } from '@/lib/types'
import { getFamilyColor } from '@/lib/cultivar-family-colors'
import { IndexCap, GrlCap, GrlGroupHeader, GrlRow } from '@/components/IndexList'

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

  // Flatten the species → family → lineage → leaf tree once for the page-level
  // aggregates (cleaner than four nested reduces per metric).
  const allLeaves = speciesGroups.flatMap((s) =>
    s.familyGroups.flatMap((f) => f.lineageGroups.flatMap((l) => l.leaves)),
  )
  const totalCultivars = allLeaves.length
  const totalCoffees = allLeaves.reduce((sum, leaf) => sum + leaf.brewCount, 0)
  const familyCount = speciesGroups.reduce((sum, s) => sum + s.familyGroups.length, 0)
  // Per-page max for the 5-block bar — highest brew count across all leaves.
  const maxCount = Math.max(0, ...allLeaves.map((leaf) => leaf.brewCount))

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <IndexCap
        left="CULTIVARS"
        right={`${totalCultivars} ${totalCultivars === 1 ? 'CULTIVAR' : 'CULTIVARS'} · ${familyCount} ${familyCount === 1 ? 'FAMILY' : 'FAMILIES'}`}
      />

      {totalCultivars === 0 ? (
        <div className="text-center py-16">
          <p className="font-mono text-sm text-latent-mid">NO CULTIVARS YET</p>
        </div>
      ) : (
        <div className="grl">
          <GrlCap label="CULTIVARS" count={totalCoffees} />
          {speciesGroups.map((speciesGroup) => (
            <div key={speciesGroup.species}>
              <h2 className="font-mono text-xs font-semibold tracking-wide uppercase text-latent-mid pt-6 pb-1">
                {speciesGroup.species}
              </h2>
              {speciesGroup.familyGroups.map((familyGroup) => {
                const color = getFamilyColor(familyGroup.family)
                return (
                  <div key={familyGroup.family}>
                    <GrlGroupHeader swatchColor={color} name={familyGroup.family} count={familyGroup.lineageGroups.length} />
                    {familyGroup.lineageGroups.map((lineageGroup) => (
                      <div key={lineageGroup.lineage}>
                        <div className="grl-lineage">{lineageGroup.lineage}</div>
                        {lineageGroup.leaves.map(({ cultivar, brewCount }) => (
                          <GrlRow
                            key={cultivar.id}
                            href={`/cultivars/${cultivar.id}`}
                            tileColor={color}
                            name={cultivar.cultivar_name}
                            count={brewCount}
                            max={maxCount}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
