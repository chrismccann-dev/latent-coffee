import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

// Country -> color swatch mapping matching local design
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

export default async function TerroirsPage() {
  const supabase = createClient()
  
  const { data: terroirs, error } = await supabase
    .from('terroirs')
    .select(`*, brews(id)`)
    .order('country', { ascending: true })

  if (error) console.error('Error fetching terroirs:', error)

  const grouped: Record<string, any[]> = {}
  for (const terroir of terroirs || []) {
    const key = terroir.country || 'Unknown'
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(terroir)
  }

  const totalTerroirs = terroirs?.length || 0

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-mono text-xs font-semibold tracking-wide uppercase text-latent-mid">
          TERROIRS
        </h1>
        <div className="font-mono text-xs text-latent-mid">
          {totalTerroirs} {totalTerroirs === 1 ? 'REGION' : 'REGIONS'}
        </div>
      </div>

      {totalTerroirs === 0 ? (
        <div className="text-center py-16">
          <p className="font-mono text-sm text-latent-mid">NO TERROIRS YET</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([country, countryTerroirs]) => (
            <div key={country}>
              {/* Country header with swatch */}
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-4 h-4 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: getCountryColor(country) }}
                />
                <h2 className="font-mono text-xs font-semibold tracking-wide uppercase text-latent-mid">
                  {country} ({countryTerroirs.length})
                </h2>
              </div>

              <div className="space-y-0">
                {countryTerroirs.map((terroir: any) => {
                  const brewCount = terroir.brews?.length || 0
                  return (
                    <Link
                      key={terroir.id}
                      href={`/terroirs/${terroir.id}`}
                      className="flex items-center gap-3 py-3 border-b border-latent-border hover:bg-white transition-colors group"
                    >
                      {/* Color swatch */}
                      <div
                        className="w-10 h-10 rounded flex-shrink-0"
                        style={{ backgroundColor: getCountryColor(country) }}
                      />
                      <div className="flex-1">
                        <div className="font-sans text-sm font-semibold">
                          {terroir.macro_terroir || terroir.admin_region}
                        </div>
                        <div className="font-sans text-xs text-latent-mid">
                          {[terroir.meso_terroir, terroir.admin_region]
                            .filter(Boolean)
                            .join(', ')}
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
