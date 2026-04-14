import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function CultivarsPage() {
  const supabase = createClient()
  
  // Get cultivars with brew counts
  const { data: cultivars, error } = await supabase
    .from('cultivars')
    .select(`
      *,
      brews(id)
    `)
    .order('genetic_family', { ascending: true })

  if (error) {
    console.error('Error fetching cultivars:', error)
  }

  // Group by genetic_family -> lineage
  const grouped: Record<string, typeof cultivars> = {}
  for (const cultivar of cultivars || []) {
    const key = cultivar.genetic_family || 'Unknown Family'
    if (!grouped[key]) grouped[key] = []
    grouped[key].push(cultivar)
  }

  const totalCultivars = cultivars?.length || 0

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-mono text-xs font-semibold tracking-wide uppercase text-latent-mid">
            CULTIVARS
          </h1>
        </div>
        <div className="font-mono text-xs text-latent-mid">
          {totalCultivars} {totalCultivars === 1 ? 'VARIETY' : 'VARIETIES'}
        </div>
      </div>

      {/* Empty state */}
      {totalCultivars === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-latent-accent rounded-lg mx-auto mb-6 flex items-center justify-center">
            <span className="text-2xl">🧬</span>
          </div>
          <p className="font-mono text-sm text-latent-mid mb-4">
            NO CULTIVARS YET
          </p>
          <p className="text-sm text-latent-mid max-w-sm mx-auto">
            Cultivars are created automatically when you add brews. Start by adding a brew to build your cultivar knowledge base.
          </p>
        </div>
      ) : (
        /* Grouped cultivar list */
        <div className="space-y-8">
          {Object.entries(grouped).map(([family, familyCultivars]) => (
            <div key={family}>
              <h2 className="font-mono text-xs font-semibold tracking-wide uppercase text-latent-mid mb-3">
                {family}
              </h2>
              <div className="space-y-0">
                {familyCultivars?.map((cultivar: any) => {
                  const brewCount = cultivar.brews?.length || 0
                  return (
                    <Link 
                      key={cultivar.id}
                      href={`/cultivars/${cultivar.id}`}
                      className="flex items-center justify-between py-4 border-b border-latent-border hover:bg-latent-highlight/30 transition-colors -mx-4 px-4"
                    >
                      <div>
                        <div className="font-sans text-sm font-medium">
                          {cultivar.lineage} → <strong>{cultivar.cultivar_name}</strong>
                        </div>
                        {cultivar.species && (
                          <div className="font-mono text-xxs text-latent-subtle mt-1">
                            {cultivar.species}
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
