import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function TerroirsPage() {
  const supabase = createClient()
  
  // Get terroirs with brew counts
  const { data: terroirs, error } = await supabase
    .from('terroirs')
    .select(`
      *,
      brews(id)
    `)
    .order('country', { ascending: true })

  if (error) {
    console.error('Error fetching terroirs:', error)
  }

  // Group by country -> macro_terroir
  const grouped: Record<string, typeof terroirs> = {}
  for (const terroir of terroirs || []) {
    const key = terroir.country || 'Unknown'
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(terroir)
  }

  const totalTerroirs = terroirs?.length || 0

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-mono text-xs font-semibold tracking-wide uppercase text-latent-mid">
            TERROIRS
          </h1>
        </div>
        <div className="font-mono text-xs text-latent-mid">
          {totalTerroirs} {totalTerroirs === 1 ? 'REGION' : 'REGIONS'}
        </div>
      </div>

      {/* Empty state */}
      {totalTerroirs === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-latent-accent rounded-lg mx-auto mb-6 flex items-center justify-center">
            <span className="text-2xl">🌍</span>
          </div>
          <p className="font-mono text-sm text-latent-mid mb-4">
            NO TERROIRS YET
          </p>
          <p className="text-sm text-latent-mid max-w-sm mx-auto">
            Terroirs are created automatically when you add brews. Start by adding a brew to build your terroir knowledge base.
          </p>
        </div>
      ) : (
        /* Grouped terroir list */
        <div className="space-y-8">
          {Object.entries(grouped).map(([country, countryTerroirs]) => (
            <div key={country}>
              <h2 className="font-mono text-xs font-semibold tracking-wide uppercase text-latent-mid mb-3">
                {country}
              </h2>
              <div className="space-y-0">
                {countryTerroirs?.map((terroir: any) => {
                  const brewCount = terroir.brews?.length || 0
                  return (
                    <Link 
                      key={terroir.id}
                      href={`/terroirs/${terroir.id}`}
                      className="flex items-center justify-between py-4 border-b border-latent-border hover:bg-latent-highlight/30 transition-colors -mx-4 px-4"
                    >
                      <div>
                        <div className="font-sans text-sm font-medium">
                          {terroir.admin_region} → <strong>{terroir.macro_terroir}</strong>
                        </div>
                        {terroir.meso_terroir && (
                          <div className="font-sans text-xs text-latent-mid">
                            Meso: {terroir.meso_terroir}
                          </div>
                        )}
                        {(terroir.elevation_min || terroir.elevation_max) && (
                          <div className="font-mono text-xxs text-latent-subtle mt-1">
                            {terroir.elevation_min}-{terroir.elevation_max}m ({terroir.climate_stress || 'temperate'})
                          </div>
                        )}
                      </div>
                      <div className="font-mono text-xs text-latent-mid">
                        {brewCount} {brewCount === 1 ? 'brew' : 'brews'}
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
