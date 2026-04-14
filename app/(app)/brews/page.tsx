import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Brew } from '@/lib/types'

// Color helper based on process/flavor
function getFlavorColor(brew: Brew) {
  const process = brew.process?.toLowerCase() || ''
  const flavorText = (brew.flavor_notes || []).join(' ').toLowerCase()
  
  if (process.includes('natural') || process.includes('anaerobic')) {
    return { bg: '#8B4513', text: '#FFF8DC' } // Warm brown
  }
  if (flavorText.includes('floral') || flavorText.includes('jasmine') || flavorText.includes('bergamot')) {
    return { bg: '#6B8E7B', text: '#F0FFF0' } // Sage green
  }
  if (flavorText.includes('berry') || flavorText.includes('wine') || flavorText.includes('grape')) {
    return { bg: '#722F4B', text: '#FFE4E9' } // Berry
  }
  if (flavorText.includes('citrus') || flavorText.includes('lemon') || flavorText.includes('orange')) {
    return { bg: '#CC8800', text: '#FFFEF0' } // Citrus gold
  }
  if (flavorText.includes('chocolate') || flavorText.includes('nutty') || flavorText.includes('caramel')) {
    return { bg: '#5D4037', text: '#EFEBE9' } // Chocolate brown
  }
  return { bg: '#6B7B6B', text: '#F5F5F5' } // Default sage
}

export default async function BrewsPage() {
  const supabase = createClient()
  
  const { data: brews, error } = await supabase
    .from('brews')
    .select(`
      *,
      green_bean:green_beans(name, lot_id),
      terroir:terroirs(country, admin_region, macro_terroir),
      cultivar:cultivars(cultivar_name, lineage)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching brews:', error)
  }

  const brewList = (brews || []) as Brew[]

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-mono text-xs font-semibold tracking-wide uppercase text-latent-mid">
            BREWS
          </h1>
        </div>
        <div className="font-mono text-xs text-latent-mid">
          {brewList.length} {brewList.length === 1 ? 'DOCUMENT' : 'DOCUMENTS'}
        </div>
      </div>

      {/* Empty state */}
      {brewList.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-latent-accent rounded-lg mx-auto mb-6 flex items-center justify-center">
            <span className="text-2xl">☕</span>
          </div>
          <p className="font-mono text-sm text-latent-mid mb-6">
            NO BREWS YET
          </p>
          <Link href="/add" className="btn btn-primary">
            + ADD YOUR FIRST BREW
          </Link>
        </div>
      ) : (
        /* Brew grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {brewList.map((brew) => {
            const colors = getFlavorColor(brew)
            return (
              <Link 
                key={brew.id} 
                href={`/brews/${brew.id}`}
                className="coffee-card group"
              >
                <div className="flex gap-4">
                  {/* Mini card */}
                  <div 
                    className="w-14 h-20 rounded flex-shrink-0 flex flex-col justify-between p-2"
                    style={{ background: colors.bg, color: colors.text }}
                  >
                    <div className="font-mono text-[6px] font-semibold leading-tight uppercase">
                      {brew.coffee_name?.slice(0, 25)}
                    </div>
                    <div className="font-mono text-[8px] font-bold tracking-widest opacity-20 text-center">
                      LATENT
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span 
                        className="font-mono text-[10px] font-semibold px-2 py-0.5 rounded"
                        style={{ 
                          background: brew.source === 'self-roasted' ? '#1a1a1a' : '#4A7C59',
                          color: '#fff'
                        }}
                      >
                        {brew.source === 'self-roasted' ? 'ROASTED' : 'PURCHASED'}
                      </span>
                    </div>
                    
                    <h3 className="font-mono text-sm font-semibold truncate group-hover:text-latent-accent-light transition-colors">
                      {brew.coffee_name}
                    </h3>
                    
                    <p className="font-mono text-xs text-latent-mid truncate">
                      {brew.terroir?.country} · {brew.variety}
                    </p>
                    
                    {brew.flavor_notes && brew.flavor_notes.length > 0 && (
                      <p className="font-sans text-xs text-latent-mid mt-2 truncate">
                        {brew.flavor_notes.slice(0, 3).join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
