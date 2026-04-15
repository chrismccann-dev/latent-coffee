import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Brew } from '@/lib/types'

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
  return <span className="tag">{children}</span>
}

// Color helper for brew cards
function getFlavorColor(brew: Brew): string {
  const process = brew.process?.toLowerCase() || ''
  const flavorText = (brew.flavor_notes || []).join(' ').toLowerCase()
  const variety = brew.variety?.toLowerCase() || ''

  if (process.includes('natural') && (process.includes('anaerobic') || process.includes('yeast'))) return '#722F4B'
  if (process.includes('anaerobic') || process.includes('thermal shock') || process.includes('anoxic')) return '#722F4B'
  if (process.includes('honey')) return '#8B6914'
  if (process.includes('natural')) return '#8B4513'
  if (variety.includes('gesha') || variety.includes('geisha')) return process.includes('washed') ? '#4A7C59' : '#5B7A6B'
  if (flavorText.includes('berry') || flavorText.includes('wine') || flavorText.includes('grape')) return '#722F4B'
  if (flavorText.includes('floral') || flavorText.includes('jasmine') || flavorText.includes('bergamot')) return '#6B8E7B'
  return '#6B7B6B'
}

export default async function TerroirDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: terroir, error } = await supabase
    .from('terroirs')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !terroir) notFound()

  // Get brew IDs via reverse join (same pattern that works on list page)
  const { data: terroirWithBrews, error: joinError } = await supabase
    .from('terroirs')
    .select('brews(id)')
    .eq('id', params.id)
    .single()

  if (joinError) console.error('Terroir reverse join error:', joinError)

  const brewIds = ((terroirWithBrews as any)?.brews || []).map((b: any) => b.id)
  console.log('Terroir detail - brew IDs from reverse join:', brewIds.length)

  let brewList: Brew[] = []
  if (brewIds.length > 0) {
    const { data: brews, error: brewsError } = await supabase
      .from('brews')
      .select('*, cultivar:cultivars(cultivar_name, lineage)')
      .in('id', brewIds)
      .order('created_at', { ascending: false })

    if (brewsError) console.error('Brews fetch error:', brewsError)
    brewList = (brews || []) as Brew[]
  }

  // Attach terroir info to each brew for display
  for (const brew of brewList) {
    (brew as any).terroir = { country: terroir.country, admin_region: terroir.admin_region }
  }
  const color = getCountryColor(terroir.country)

  // Aggregate flavor notes from all brews
  const flavorCounts: Record<string, number> = {}
  for (const brew of brewList) {
    for (const note of brew.flavor_notes || []) {
      flavorCounts[note] = (flavorCounts[note] || 0) + 1
    }
  }
  const sortedFlavors = Object.entries(flavorCounts).sort((a, b) => b[1] - a[1])

  // Aggregate cultivars and processes
  const cultivarSet = new Map<string, string>()
  const processSet = new Set<string>()
  for (const brew of brewList) {
    if (brew.cultivar?.cultivar_name) cultivarSet.set(brew.cultivar.cultivar_name, brew.cultivar.lineage || '')
    if (brew.process) processSet.add(brew.process)
  }

  // Confidence level
  const brewCount = brewList.length
  const confidence = brewCount >= 5 ? { emoji: '\uD83D\uDFE2', label: 'HIGH', desc: `${brewCount} coffees explored` }
    : brewCount >= 2 ? { emoji: '\uD83D\uDFE1', label: 'MEDIUM', desc: `${brewCount} coffees explored` }
    : { emoji: '\uD83D\uDD34', label: 'LOW', desc: `${brewCount} ${brewCount === 1 ? 'coffee' : 'coffees'} explored` }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Link
        href="/terroirs"
        className="font-mono text-xs text-latent-mid hover:text-latent-fg mb-6 inline-block"
      >
        &larr; Back to Terroirs
      </Link>

      {/* Hero */}
      <div className="section-card mb-6">
        <div className="flex gap-6 items-start">
          <div
            className="w-16 h-16 rounded flex-shrink-0"
            style={{ backgroundColor: color }}
          />
          <div className="flex-1">
            <h1 className="font-sans text-2xl font-semibold mb-1">
              {terroir.macro_terroir || terroir.admin_region}
            </h1>
            <p className="font-mono text-xs text-latent-mid">
              {terroir.country} &rarr; {terroir.admin_region}
            </p>
            <div className="font-mono text-xs text-latent-mid mt-2">
              {terroir.elevation_min && terroir.elevation_max && (
                <span>{terroir.elevation_min}&ndash;{terroir.elevation_max}m</span>
              )}
              {terroir.climate_stress && (
                <span> &middot; {terroir.climate_stress}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Meso Terroirs */}
      {terroir.meso_terroir && (
        <Section title="MESO TERROIRS EXPLORED">
          <div className="flex flex-wrap gap-2">
            {terroir.meso_terroir.split(',').map((meso: string) => (
              <Tag key={meso.trim()}>{meso.trim()}</Tag>
            ))}
          </div>
        </Section>
      )}

      {/* Terroir Context */}
      {(terroir.context || terroir.soil || terroir.cup_profile || terroir.why_it_stands_out) && (
        <Section title="TERROIR CONTEXT">
          <div className="space-y-3 font-sans text-sm">
            {terroir.context && (
              <div>
                <span className="font-mono text-xs text-latent-mid mr-2">Context:</span>
                {terroir.context}
              </div>
            )}
            {terroir.soil && (
              <div>
                <span className="font-mono text-xs text-latent-mid mr-2">Soil:</span>
                {terroir.soil}
              </div>
            )}
            {terroir.cup_profile && (
              <div>
                <span className="font-mono text-xs text-latent-mid mr-2">Cup Profile:</span>
                {terroir.cup_profile}
              </div>
            )}
            {terroir.why_it_stands_out && (
              <div>
                <span className="font-mono text-xs text-latent-mid mr-2">Why It Stands Out:</span>
                {terroir.why_it_stands_out}
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Common Flavor Notes */}
      {sortedFlavors.length > 0 && (
        <Section title="COMMON FLAVOR NOTES">
          <div className="flex flex-wrap gap-2">
            {sortedFlavors.map(([note, count]) => (
              <Tag key={note}>{note}{count > 1 ? ` (${count})` : ''}</Tag>
            ))}
          </div>
        </Section>
      )}

      {/* Cultivars + Processes grid */}
      {(cultivarSet.size > 0 || processSet.size > 0) && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          {cultivarSet.size > 0 && (
            <Section title="CULTIVARS EXPLORED">
              <div className="flex flex-wrap gap-2">
                {Array.from(cultivarSet.entries()).map(([name, lineage]) => (
                  <Tag key={name}>{lineage ? `${lineage} / ${name}` : name}</Tag>
                ))}
              </div>
            </Section>
          )}
          {processSet.size > 0 && (
            <Section title="PROCESSES">
              <div className="flex flex-wrap gap-2">
                {Array.from(processSet).map((p) => (
                  <Tag key={p}>{p}</Tag>
                ))}
              </div>
            </Section>
          )}
        </div>
      )}

      {/* Coffee list */}
      {brewList.length > 0 && (
        <Section title={`COFFEES FROM THIS TERROIR (${brewList.length})`}>
          <div className="space-y-0">
            {brewList.map((brew) => {
              const cardColor = getFlavorColor(brew)
              return (
                <Link
                  key={brew.id}
                  href={`/brews/${brew.id}`}
                  className="flex items-center gap-3 py-3 border-b border-latent-border last:border-b-0 hover:bg-latent-bg transition-colors group"
                >
                  <div
                    className="w-8 h-10 rounded flex-shrink-0"
                    style={{ backgroundColor: cardColor }}
                  />
                  <div className="flex-1">
                    <div className="font-sans text-sm font-semibold">{brew.coffee_name}</div>
                    <div className="font-mono text-[10px] text-latent-mid">
                      {[brew.variety, brew.process].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                  <span className="font-mono text-xs text-latent-mid opacity-0 group-hover:opacity-100 transition-opacity">&rarr;</span>
                </Link>
              )
            })}
          </div>
        </Section>
      )}

      {/* Confidence */}
      <Section dark>
        <div className="font-mono text-xxs font-medium opacity-60 uppercase mb-3">CONFIDENCE</div>
        <div className="flex items-center gap-3">
          <span className="text-xl">{confidence.emoji}</span>
          <div>
            <div className="font-mono text-sm font-semibold">{confidence.label}</div>
            <div className="font-mono text-xs opacity-60">{confidence.desc}</div>
          </div>
        </div>
      </Section>
    </div>
  )
}
