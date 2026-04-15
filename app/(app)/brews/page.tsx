import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Brew } from '@/lib/types'

// Color helper matching original local design palette
function getFlavorColor(brew: Brew): string {
  const process = brew.process?.toLowerCase() || ''
  const flavorText = (brew.flavor_notes || []).join(' ').toLowerCase()
  const variety = brew.variety?.toLowerCase() || ''

  if (process.includes('natural') && (process.includes('anaerobic') || process.includes('yeast'))) {
    return '#722F4B'
  }
  if (process.includes('anaerobic') || process.includes('thermal shock') || process.includes('anoxic')) {
    return '#722F4B'
  }
  if (process.includes('honey')) {
    return '#8B6914'
  }
  if (process.includes('natural')) {
    return '#8B4513'
  }
  if (variety.includes('gesha') || variety.includes('geisha')) {
    if (process.includes('washed')) return '#4A7C59'
    return '#5B7A6B'
  }
  if (flavorText.includes('berry') || flavorText.includes('wine') || flavorText.includes('grape')) {
    return '#722F4B'
  }
  if (flavorText.includes('floral') || flavorText.includes('jasmine') || flavorText.includes('bergamot')) {
    return '#6B8E7B'
  }
  return '#6B7B6B'
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
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-mono text-xs font-semibold tracking-wide uppercase text-latent-mid">
          BREWS
        </h1>
        <div className="font-mono text-xs text-latent-mid">
          {brewList.length} {brewList.length === 1 ? 'COFFEE' : 'COFFEES'}
        </div>
      </div>

      {/* Empty state */}
      {brewList.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-latent-accent rounded-lg mx-auto mb-6 flex items-center justify-center">
            <span className="text-2xl">☕</span>
          </div>
          <p className="font-mono text-sm text-latent-mid mb-6">NO BREWS YET</p>
          <Link href="/add" className="btn btn-primary">+ ADD YOUR FIRST BREW</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0 border-t border-l border-latent-border">
          {brewList.map((brew) => {
            const cardColor = getFlavorColor(brew)
            const subtitleParts = []
            if (brew.variety) subtitleParts.push(brew.variety)
            if (brew.process) subtitleParts.push(brew.process)
            if (brew.source === 'purchased') subtitleParts.push('Purchased')
            else if (brew.source === 'self-roasted') subtitleParts.push('Roasted')

            return (
              <Link
                key={brew.id}
                href={`/brews/${brew.id}`}
                className="border-r border-b border-latent-border p-4 hover:bg-white transition-colors group flex flex-col"
              >
                {/* Large card image */}
                <div
                  className="w-full aspect-[3/4] rounded mb-3 flex-shrink-0 flex flex-col justify-between p-3"
                  style={{ backgroundColor: cardColor }}
                >
                  <div className="font-mono text-[7px] font-semibold leading-tight uppercase text-white/90">
                    {brew.coffee_name?.slice(0, 40)}
                  </div>
                  <div className="font-mono text-[9px] font-bold tracking-widest opacity-20 text-white text-center">
                    LATENT
                  </div>
                </div>

                {/* Card text below */}
                <h3 className="font-mono text-xs font-semibold leading-tight mb-1 group-hover:text-latent-accent-light transition-colors line-clamp-2">
                  {brew.coffee_name}
                </h3>
                <p className="font-mono text-[10px] text-latent-mid leading-snug">
                  {subtitleParts.join(' · ')}
                </p>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
