import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

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

export default async function CultivarsPage() {
  const supabase = createClient()
  
  const { data: cultivars, error } = await supabase
    .from('cultivars')
    .select(`*, brews(id)`)
    .order('genetic_family', { ascending: true })

  if (error) console.error('Error fetching cultivars:', error)

  const grouped: Record<string, any[]> = {}
  for (const cultivar of cultivars || []) {
    const key = cultivar.genetic_family || 'Unknown Family'
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(cultivar)
  }

  const totalCultivars = cultivars?.length || 0

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-mono text-xs font-semibold tracking-wide uppercase text-latent-mid">
          CULTIVARS
        </h1>
        <div className="font-mono text-xs text-latent-mid">
          {totalCultivars} {totalCultivars === 1 ? 'VARIETY' : 'VARIETIES'}
        </div>
      </div>

      {totalCultivars === 0 ? (
        <div className="text-center py-16">
          <p className="font-mono text-sm text-latent-mid">NO CULTIVARS YET</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([family, familyCultivars]) => (
            <div key={family}>
              {/* Family header with swatch */}
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-4 h-4 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: getFamilyColor(family) }}
                />
                <h2 className="font-mono text-xs font-semibold tracking-wide uppercase text-latent-mid">
                  {family} ({familyCultivars.length})
                </h2>
              </div>

              <div className="space-y-0">
                {familyCultivars.map((cultivar: any) => {
                  const brewCount = cultivar.brews?.length || 0
                  return (
                    <Link
                      key={cultivar.id}
                      href={`/cultivars/${cultivar.id}`}
                      className="flex items-center gap-3 py-3 border-b border-latent-border hover:bg-white transition-colors group"
                    >
                      {/* Color swatch */}
                      <div
                        className="w-10 h-10 rounded flex-shrink-0"
                        style={{ backgroundColor: getFamilyColor(family) }}
                      />
                      <div className="flex-1">
                        <div className="font-sans text-sm font-semibold">
                          {cultivar.lineage}
                        </div>
                        <div className="font-sans text-xs text-latent-mid">
                          {cultivar.cultivar_name}
                          {cultivar.species ? `, ${cultivar.species}` : ''}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="font-mono text-xs text-latent-mid">
                          {brewCount} {brewCount === 1 ? 'coffee' : 'coffees'}
                        </div>
                        <span className="font-mono text-xs text-latent-mid opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
