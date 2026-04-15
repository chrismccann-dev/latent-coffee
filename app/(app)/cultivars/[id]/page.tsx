import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Brew } from '@/lib/types'

const familyColors: Record<string, string> = {
  'Ethiopian Landrace Families': '#4A7C59',
  'Bourbon Family': '#7A3B4B',
  'Modern Hybrids': '#3B5B6B',
  'Typica × Bourbon Crosses': '#6B4A3B',
  'Typica Family': '#4A3728',
  'SL Selections': '#8B3B2B',
}

function getFamilyColor(family: string): string {
  return familyColors[family] || '#555555'
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

export default async function CultivarDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: cultivar, error } = await supabase
    .from('cultivars')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !cultivar) notFound()

  // Brews don't use FK relationships to cultivars — match by variety text
  // Build search terms from cultivar data (e.g. "Gesha" from "Gesha lineage")
  const searchTerms: string[] = []
  if (cultivar.lineage) {
    // Extract root name: "Gesha lineage" → "Gesha", "SL-28 lineage" → "SL-28"
    const root = cultivar.lineage.replace(/\s*lineage\s*/i, '').trim()
    if (root) searchTerms.push(root)
  }
  if (cultivar.cultivar_name && !searchTerms.some(t => cultivar.cultivar_name.toLowerCase().includes(t.toLowerCase()))) {
    searchTerms.push(cultivar.cultivar_name)
  }

  let brewList: Brew[] = []
  if (searchTerms.length > 0) {
    // Build OR filter: variety ilike any of the search terms
    const orFilter = searchTerms.map(t => `variety.ilike.%${t}%`).join(',')
    const { data: matchingBrews } = await supabase
      .from('brews')
      .select('*, terroir:terroirs(country, admin_region, macro_terroir)')
      .or(orFilter)
      .order('created_at', { ascending: false })
    brewList = (matchingBrews || []) as Brew[]
  }

  // Attach cultivar info to each brew for display
  for (const brew of brewList) {
    (brew as any).cultivar = { cultivar_name: cultivar.cultivar_name, lineage: cultivar.lineage }
  }
  const color = getFamilyColor(cultivar.genetic_family || '')

  // Aggregate flavor notes
  const flavorCounts: Record<string, number> = {}
  for (const brew of brewList) {
    for (const note of brew.flavor_notes || []) {
      flavorCounts[note] = (flavorCounts[note] || 0) + 1
    }
  }
  const sortedFlavors = Object.entries(flavorCounts).sort((a, b) => b[1] - a[1])

  // Aggregate terroirs and processes
  const terroirSet = new Map<string, string>()
  const processSet = new Set<string>()
  for (const brew of brewList) {
    if (brew.terroir?.country) {
      const key = brew.terroir.macro_terroir || brew.terroir.admin_region || brew.terroir.country
      terroirSet.set(key, brew.terroir.country)
    }
    if (brew.process) processSet.add(brew.process)
  }

  // Confidence
  const brewCount = brewList.length
  const confidence = brewCount >= 5 ? { emoji: '\uD83D\uDFE2', label: 'HIGH', desc: `${brewCount} coffees explored` }
    : brewCount >= 2 ? { emoji: '\uD83D\uDFE1', label: 'MEDIUM', desc: `${brewCount} coffees explored` }
    : { emoji: '\uD83D\uDD34', label: 'LOW', desc: `${brewCount} ${brewCount === 1 ? 'coffee' : 'coffees'} explored` }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Link
        href="/cultivars"
        className="font-mono text-xs text-latent-mid hover:text-latent-fg mb-6 inline-block"
      >
        &larr; Back to Cultivars
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
              {cultivar.lineage || cultivar.cultivar_name}
            </h1>
            <p className="font-mono text-xs text-latent-mid">
              {cultivar.species} &rarr; {cultivar.genetic_family}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Tag>{cultivar.cultivar_name}</Tag>
              {cultivar.cultivar_raw && cultivar.cultivar_raw !== cultivar.cultivar_name && (
                <Tag>{cultivar.cultivar_raw}</Tag>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Genetic Background */}
      {cultivar.genetic_background && (
        <Section title="GENETIC BACKGROUND">
          <p className="font-sans text-sm leading-relaxed">{cultivar.genetic_background}</p>
        </Section>
      )}

      {/* Cup Characteristics */}
      {(cultivar.acidity_style || cultivar.body_style || cultivar.aromatics) && (
        <Section title="CUP CHARACTERISTICS">
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 font-sans text-sm">
            {cultivar.acidity_style && (
              <div>
                <div className="font-mono text-xxs text-latent-mid uppercase mb-1">Acidity Style</div>
                <div>{cultivar.acidity_style}</div>
              </div>
            )}
            {cultivar.body_style && (
              <div>
                <div className="font-mono text-xxs text-latent-mid uppercase mb-1">Body Style</div>
                <div>{cultivar.body_style}</div>
              </div>
            )}
            {cultivar.aromatics && (
              <div className="col-span-2">
                <div className="font-mono text-xxs text-latent-mid uppercase mb-1">Aromatics</div>
                <div>{cultivar.aromatics}</div>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Brewing & Roasting */}
      {(cultivar.extraction_sensitivity || cultivar.roast_tolerance || cultivar.brewing_tendencies) && (
        <Section title="BREWING & ROASTING">
          <div className="space-y-3 font-sans text-sm">
            {cultivar.extraction_sensitivity && (
              <div>
                <span className="font-mono text-xs text-latent-mid mr-2">Extraction Sensitivity:</span>
                {cultivar.extraction_sensitivity}
              </div>
            )}
            {cultivar.roast_tolerance && (
              <div>
                <span className="font-mono text-xs text-latent-mid mr-2">Roast Tolerance:</span>
                {cultivar.roast_tolerance}
              </div>
            )}
            {cultivar.brewing_tendencies && (
              <div>
                <span className="font-mono text-xs text-latent-mid mr-2">Brewing Tendencies:</span>
                {cultivar.brewing_tendencies}
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

      {/* Terroirs + Processes grid */}
      {(terroirSet.size > 0 || processSet.size > 0) && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          {terroirSet.size > 0 && (
            <Section title="TERROIRS EXPLORED">
              <div className="flex flex-wrap gap-2">
                {Array.from(terroirSet.entries()).map(([name, country]) => (
                  <Tag key={name}>{country} / {name}</Tag>
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
        <Section title={`COFFEES WITH THIS CULTIVAR (${brewList.length})`}>
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
                      {[brew.terroir?.country, brew.process].filter(Boolean).join(' · ')}
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
