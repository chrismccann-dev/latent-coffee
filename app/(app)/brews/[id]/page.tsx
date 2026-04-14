import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Brew } from '@/lib/types'

// Color helper
function getFlavorColor(brew: Brew) {
  const process = brew.process?.toLowerCase() || ''
  const flavorText = (brew.flavor_notes || []).join(' ').toLowerCase()
  
  if (process.includes('natural') || process.includes('anaerobic')) {
    return { bg: '#8B4513', text: '#FFF8DC' }
  }
  if (flavorText.includes('floral') || flavorText.includes('jasmine') || flavorText.includes('bergamot')) {
    return { bg: '#6B8E7B', text: '#F0FFF0' }
  }
  if (flavorText.includes('berry') || flavorText.includes('wine')) {
    return { bg: '#722F4B', text: '#FFE4E9' }
  }
  if (flavorText.includes('citrus') || flavorText.includes('lemon')) {
    return { bg: '#CC8800', text: '#FFFEF0' }
  }
  return { bg: '#6B7B6B', text: '#F5F5F5' }
}

function Section({ title, dark, children }: { title?: string, dark?: boolean, children: React.ReactNode }) {
  return (
    <div className={`rounded-md p-6 mb-4 ${dark ? 'bg-latent-fg text-white' : 'bg-white border border-latent-border'}`}>
      {title && (
        <div className={`font-mono text-xxs font-semibold tracking-wide uppercase mb-4 ${dark ? 'opacity-60' : 'text-latent-mid'}`}>
          {title}
        </div>
      )}
      {children}
    </div>
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="tag">{children}</span>
  )
}

export default async function BrewDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  
  const { data: brew, error } = await supabase
    .from('brews')
    .select(`
      *,
      green_bean:green_beans(*),
      terroir:terroirs(*),
      cultivar:cultivars(*),
      roast:roasts(*)
    `)
    .eq('id', params.id)
    .single()

  if (error || !brew) {
    notFound()
  }

  const colors = getFlavorColor(brew as Brew)

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Back button */}
      <Link 
        href="/brews" 
        className="font-mono text-xs text-latent-mid hover:text-latent-fg mb-6 inline-block"
      >
        ← Back to Brews
      </Link>

      {/* Hero Card */}
      <div className="section-card mb-6">
        <div className="flex gap-8 mb-6">
          {/* Book cover */}
          <div 
            className="w-28 h-40 rounded flex-shrink-0 flex flex-col justify-between p-3"
            style={{ background: colors.bg, color: colors.text }}
          >
            <div className="font-mono text-[8px] font-semibold leading-tight uppercase">
              {brew.coffee_name?.slice(0, 35)}
            </div>
            <div className="font-mono text-xs font-bold tracking-widest opacity-10 text-center">
              LATENT
            </div>
          </div>

          {/* Title info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-sans text-2xl font-semibold">
                {brew.coffee_name}
              </h1>
              <span 
                className="font-mono text-[10px] font-semibold px-2 py-1 rounded"
                style={{ 
                  background: brew.source === 'self-roasted' ? '#1a1a1a' : '#4A7C59',
                  color: '#fff'
                }}
              >
                {brew.source === 'self-roasted' ? 'ROASTED' : 'PURCHASED'}
              </span>
            </div>
            
            {brew.source === 'self-roasted' && brew.green_bean && (
              <p className="font-sans text-sm text-latent-mid mb-1">
                Batch #{brew.roast?.batch_id || '?'}
              </p>
            )}
            {brew.source === 'purchased' && brew.roaster && (
              <p className="font-sans text-sm text-latent-mid mb-1">
                {brew.roaster}
              </p>
            )}
            
            <p className="font-mono text-xs text-latent-mid">
              {brew.terroir?.country} · {brew.terroir?.admin_region} · {brew.terroir?.macro_terroir || brew.terroir?.meso_terroir}
            </p>
          </div>
        </div>

        {/* Coffee details */}
        <div className="border-t border-latent-border pt-5">
          <div className="label">COFFEE DETAILS</div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 font-sans text-sm mb-4">
            <div><strong>Variety:</strong> {brew.variety || brew.cultivar?.cultivar_name}</div>
            <div><strong>Process:</strong> {brew.process}</div>
            <div><strong>Roast:</strong> {brew.roast_level || 'Light'}</div>
          </div>

          {brew.flavor_notes && brew.flavor_notes.length > 0 && (
            <>
              <div className="label mt-4">FLAVOR NOTES</div>
              <div>
                {brew.flavor_notes.map(note => <Tag key={note}>{note}</Tag>)}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Terroir */}
      {brew.terroir && (
        <Section title="🌍 TERROIR">
          <div className="font-sans text-sm font-medium mb-2">
            <strong>{brew.terroir.country}</strong> → {brew.terroir.admin_region} → <strong>{brew.terroir.macro_terroir}</strong>
          </div>
          {brew.terroir.meso_terroir && (
            <div className="font-sans text-sm text-latent-mid mb-1">
              Meso: {brew.terroir.meso_terroir}
            </div>
          )}
          <div className="font-mono text-xs text-latent-mid">
            Elevation: {brew.terroir.elevation_min}-{brew.terroir.elevation_max}m ({brew.terroir.climate_stress || 'temperate'})
          </div>
        </Section>
      )}

      {/* Cultivar */}
      {brew.cultivar && (
        <Section title="🧬 CULTIVAR">
          <div className="font-sans text-sm font-medium mb-2">
            <strong>{brew.cultivar.species}</strong> → {brew.cultivar.genetic_family} → <strong>{brew.cultivar.lineage}</strong>
          </div>
          <div className="font-sans text-sm text-latent-mid">
            Cultivar: {brew.cultivar.cultivar_name}
          </div>
        </Section>
      )}

      {/* Recipe */}
      {brew.brewer && (
        <Section title="BEST BREW RECIPE">
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 font-sans text-sm mb-4">
            <div><strong>Brewer:</strong> {brew.brewer}</div>
            <div><strong>Filter:</strong> {brew.filter}</div>
            <div><strong>Dose:</strong> {brew.dose_g}g</div>
            <div><strong>Water:</strong> {brew.water_g}g</div>
            <div><strong>Grind:</strong> {brew.grind}</div>
            <div><strong>Temp:</strong> {brew.temp_c}°C</div>
          </div>
          {brew.bloom && (
            <div className="font-sans text-sm mb-2">
              <strong>Bloom:</strong> {brew.bloom}
            </div>
          )}
          {brew.pour_structure && (
            <div className="font-sans text-sm mb-2">
              <strong>Pour:</strong> {brew.pour_structure}
            </div>
          )}
          {brew.extraction_strategy && (
            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-latent-border">
              <div>
                <div className="font-mono text-xxs text-latent-mid uppercase mb-1">Extraction Strategy</div>
                <div className="font-sans text-sm">{brew.extraction_strategy}</div>
              </div>
              {brew.extraction_confirmed && (
                <div>
                  <div className="font-mono text-xxs text-latent-mid uppercase mb-1">Confirmed</div>
                  <div className="font-sans text-sm">{brew.extraction_confirmed}</div>
                </div>
              )}
            </div>
          )}
        </Section>
      )}

      {/* Sensory Notes */}
      {(brew.aroma || brew.attack || brew.body) && (
        <Section title="SENSORY NOTES">
          <div className="space-y-2 font-sans text-sm">
            {brew.aroma && <div><span className="font-mono text-xs text-latent-mid mr-2">Aroma:</span>{brew.aroma}</div>}
            {brew.attack && <div><span className="font-mono text-xs text-latent-mid mr-2">Attack:</span>{brew.attack}</div>}
            {brew.mid_palate && <div><span className="font-mono text-xs text-latent-mid mr-2">Mid Palate:</span>{brew.mid_palate}</div>}
            {brew.body && <div><span className="font-mono text-xs text-latent-mid mr-2">Body:</span>{brew.body}</div>}
            {brew.finish && <div><span className="font-mono text-xs text-latent-mid mr-2">Finish:</span>{brew.finish}</div>}
          </div>
        </Section>
      )}

      {/* Temperature Evolution */}
      {brew.temperature_evolution && (
        <Section title="TEMPERATURE EVOLUTION">
          <p className="font-sans text-sm leading-relaxed">{brew.temperature_evolution}</p>
        </Section>
      )}

      {/* Peak Expression */}
      {brew.peak_expression && (
        <Section dark>
          <div className="font-mono text-xxs font-medium opacity-60 uppercase mb-3">PEAK EXPRESSION</div>
          <p className="font-mono text-base font-semibold leading-relaxed">
            {brew.peak_expression}
          </p>
        </Section>
      )}

      {/* Key Takeaways */}
      {brew.key_takeaways && brew.key_takeaways.length > 0 && (
        <div className="mb-6">
          <div className="label">KEY TAKEAWAYS</div>
          <ul className="list-disc list-inside space-y-2 font-sans text-sm">
            {brew.key_takeaways.map((takeaway, i) => (
              <li key={i}>{takeaway}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Classification */}
      {brew.classification && (
        <Section dark title="CLASSIFICATION">
          <p className="font-sans text-sm leading-relaxed">{brew.classification}</p>
        </Section>
      )}
    </div>
  )
}
