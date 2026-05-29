import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Brew } from '@/lib/types'
import { getCoverColor } from '@/lib/brew-colors'
import { SectionCard } from '@/components/SectionCard'
import { Tag } from '@/components/Tag'
import { StrategyPill } from '@/components/StrategyPill'
import { RecipeTable } from '@/components/RecipeTable'
import { PourStructureList } from '@/components/PourStructureList'
import { CollapsibleBlock } from '@/components/CollapsibleBlock'
import { cleanModifiers, splitModifierLabel } from '@/lib/extraction-modifiers'
import { composeHybridSubformLabel } from '@/lib/hybrid-subform'
import { extractDrawdown } from '@/lib/pour-structure'

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

  const coverColor = getCoverColor(brew as Brew)
  const producer = brew.producer || brew.green_bean?.producer || null
  const drawdown = extractDrawdown(brew.total_time, brew.pour_structure)

  const modifiersResult = cleanModifiers(brew.modifiers)
  const modifiers = modifiersResult.ok ? modifiersResult.value : []
  const modifierSplits = modifiers.map((m) => splitModifierLabel(m))
  const hasModifierDetails = modifierSplits.some((s) => s.detail)

  const hybridSubformLabel = brew.extraction_strategy === 'Hybrid'
    ? composeHybridSubformLabel(brew.hybrid_subform)
    : null

  const tastedDiverged =
    !!brew.extraction_confirmed?.trim() &&
    brew.extraction_confirmed.trim().toLowerCase() !== brew.extraction_strategy?.trim().toLowerCase()

  const structureLabels = (brew.structure_tags ?? []).map((t: string) => {
    const idx = t.indexOf(':')
    return idx >= 0 ? t.slice(idx + 1) : t
  })

  // Full Brew Notes is a catch-all for archive detail. Render it whenever any
  // of its 9 conditional fields is populated; suppress the section entirely
  // for brews that have none.
  const showFullBrewNotes =
    !!brew.aroma ||
    !!brew.attack ||
    !!brew.mid_palate ||
    !!brew.body ||
    !!brew.finish ||
    !!brew.temperature_evolution ||
    !!(brew.key_takeaways && brew.key_takeaways.length > 0) ||
    !!brew.classification ||
    !!brew.terroir_connection ||
    !!brew.cultivar_connection ||
    !!brew.strategy_notes ||
    !!brew.cooling_curve_target ||
    !!(brew.extraction_confirmed && !tastedDiverged)

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Link
        href="/brews"
        className="font-mono text-xs text-latent-mid hover:text-latent-fg mb-6 inline-block"
      >
        ← Back to Brews
      </Link>

      {/* 1. Header */}
      <div className="section-card mb-6">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
          {/* Book cover */}
          <div
            className="w-28 h-40 rounded flex-shrink-0 flex flex-col justify-between p-3 text-white"
            style={{ background: coverColor }}
          >
            <div className="font-mono text-chip font-semibold leading-tight uppercase opacity-90">
              {brew.coffee_name?.slice(0, 35)}
            </div>
            <div className="font-mono text-xs font-bold tracking-widest opacity-10 text-center">
              LATENT
            </div>
          </div>

          {/* Title + meta */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start gap-2 sm:gap-3 mb-3">
              <h1 className="font-sans text-2xl font-semibold w-full sm:w-auto sm:flex-1 sm:min-w-0">
                {brew.coffee_name}
              </h1>
              <span
                className={`font-mono text-xxs font-semibold px-2 py-1 rounded text-white ${
                  brew.source === 'self-roasted' ? 'bg-latent-fg' : 'bg-latent-accent-light'
                }`}
              >
                {brew.source === 'self-roasted' ? 'ROASTED' : 'PURCHASED'}
              </span>
            </div>

            <div className="space-y-1 font-sans text-sm">
              {(brew.variety || brew.cultivar?.cultivar_name) && (
                <div><strong>Variety:</strong> {brew.variety || brew.cultivar?.cultivar_name}</div>
              )}
              {brew.roaster && <div><strong>Roaster:</strong> {brew.roaster}</div>}
              {producer && <div><strong>Producer:</strong> {producer}</div>}
              {brew.source === 'self-roasted' && brew.green_bean && (
                <div className="font-mono text-xs text-latent-mid pt-1">
                  Batch #{brew.roast?.batch_id || '?'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Reference Brew Recipe — page anchor */}
      <SectionCard title="REFERENCE BREW RECIPE">
        <RecipeTable brew={brew as Brew} />

        {brew.water_recipe && (
          <div className="mt-3 font-sans text-sm">
            <strong>Water Recipe:</strong> {brew.water_recipe}
          </div>
        )}

        {brew.bloom && (
          <div className="mt-6">
            <div className="font-sans text-sm font-semibold mb-1">Bloom</div>
            <p className="font-sans text-sm leading-relaxed">{brew.bloom}</p>
          </div>
        )}

        {brew.pour_structure && (
          <div className="mt-6">
            <div className="font-sans text-sm font-semibold mb-2">Pour Structure</div>
            <PourStructureList pourStructure={brew.pour_structure} />
            {drawdown && (
              <div className="mt-2 font-sans text-sm">
                <strong>Drawdown:</strong> {drawdown}
              </div>
            )}
          </div>
        )}

        {brew.extraction_strategy && (
          <div className="mt-6 pt-4 border-t border-latent-border">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="font-sans text-sm font-semibold mb-2">Extraction Strategy</div>
                <div className="flex flex-wrap items-center gap-2">
                  <StrategyPill strategy={brew.extraction_strategy} variant="row" />
                  {hybridSubformLabel && (
                    <span className="font-sans text-sm text-latent-mid">{hybridSubformLabel}</span>
                  )}
                </div>
              </div>
              {modifierSplits.length > 0 && (
                <div>
                  <div className="font-sans text-sm font-semibold mb-2">Extraction Modifiers</div>
                  <div className="flex flex-wrap gap-2">
                    {modifierSplits.map((s, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2 py-1 rounded-full border border-latent-border bg-latent-highlight text-latent-fg font-sans text-xs"
                      >
                        {s.head}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {tastedDiverged && (
                <div>
                  <div className="font-mono text-xxs text-latent-accent-light uppercase mb-1">
                    Tasted As (differs)
                  </div>
                  <div className="font-sans text-sm">{brew.extraction_confirmed}</div>
                </div>
              )}
            </div>

            {hasModifierDetails && (
              <div className="mt-4">
                <div className="font-sans text-sm font-semibold mb-1">Modifier Detail</div>
                <div className="space-y-1 font-sans text-sm leading-relaxed">
                  {modifierSplits.map((s, i) => s.detail && (
                    <div key={i}>
                      {modifierSplits.filter((x) => x.detail).length > 1 && (
                        <span className="font-semibold">{s.head}: </span>
                      )}
                      {s.detail}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </SectionCard>

      {/* 3. Presentation Overview */}
      {(brew.flavor_notes?.length || structureLabels.length > 0) && (
        <SectionCard title="PRESENTATION OVERVIEW">
          {brew.flavor_notes && brew.flavor_notes.length > 0 && (
            <div className="mb-3">
              <div className="font-sans text-sm font-semibold mb-2">Flavor Notes</div>
              <div className="flex flex-wrap gap-1.5">
                {brew.flavor_notes.map((note: string) => <Tag key={note}>{note}</Tag>)}
              </div>
            </div>
          )}
          {structureLabels.length > 0 && (
            <div>
              <div className="font-sans text-sm font-semibold mb-2">Structure Notes</div>
              <div className="flex flex-wrap gap-1.5">
                {structureLabels.map((label: string) => <Tag key={label}>{label}</Tag>)}
              </div>
            </div>
          )}
        </SectionCard>
      )}

      {/* 4. Peak Expression — high-contrast */}
      {brew.peak_expression && (
        <SectionCard dark>
          <div className="font-mono text-xxs font-medium opacity-60 uppercase mb-3">PEAK EXPRESSION</div>
          <p className="font-mono text-base font-semibold leading-relaxed">
            {brew.peak_expression}
          </p>
        </SectionCard>
      )}

      {/* 5. Coffee Overview — appendix-style; deep hierarchies live on aggregation pages */}
      <SectionCard title="COFFEE OVERVIEW">
        <div className="space-y-2 font-sans text-sm">
          {brew.roast_level && (
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-latent-mid w-24 flex-shrink-0">Roast Level:</span>
              <Tag>{brew.roast_level}</Tag>
            </div>
          )}
          {brew.cultivar && (
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-latent-mid w-24 flex-shrink-0">Cultivar:</span>
              <span className="text-latent-mid">
                {brew.cultivar.species}
                {brew.cultivar.genetic_family && <> → {brew.cultivar.genetic_family}</>}
                {' → '}
              </span>
              <Tag>{brew.cultivar.cultivar_name}</Tag>
            </div>
          )}
          {brew.process && (
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-latent-mid w-24 flex-shrink-0">Process:</span>
              <Tag>{brew.process}</Tag>
              {Array.isArray(brew.fermentation_qualifiers) && brew.fermentation_qualifiers.length > 0 && (
                <>
                  <span className="text-latent-mid font-mono text-xxs uppercase opacity-70">qualifier</span>
                  {brew.fermentation_qualifiers.map((q: string) => (
                    <Tag key={q}>{q}</Tag>
                  ))}
                </>
              )}
            </div>
          )}
          {brew.terroir && (
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-latent-mid w-24 flex-shrink-0">Terroir:</span>
              <span className="text-latent-mid">
                {brew.terroir.country}
                {brew.terroir.admin_region && <> → {brew.terroir.admin_region}</>}
                {' → '}
              </span>
              <Tag>{brew.terroir.macro_terroir || brew.terroir.meso_terroir || '—'}</Tag>
            </div>
          )}
        </div>
      </SectionCard>

      {/* 6. What I Learned — high-contrast */}
      {brew.what_i_learned && (
        <SectionCard dark title="WHAT I LEARNED">
          <p className="font-sans text-sm leading-relaxed whitespace-pre-line">
            {brew.what_i_learned}
          </p>
        </SectionCard>
      )}

      {/* 7. Full Brew Notes — mobile-collapsed catch-all */}
      {showFullBrewNotes && (
        <CollapsibleBlock title="FULL BREW NOTES">
          {(brew.aroma || brew.attack || brew.mid_palate || brew.body || brew.finish) && (
            <div className="mb-5">
              <div className="label">SENSORY NOTES</div>
              <div className="space-y-2 font-sans text-sm">
                {brew.aroma && <div><span className="font-mono text-xs text-latent-mid mr-2">Aroma:</span>{brew.aroma}</div>}
                {brew.attack && <div><span className="font-mono text-xs text-latent-mid mr-2">Attack:</span>{brew.attack}</div>}
                {brew.mid_palate && <div><span className="font-mono text-xs text-latent-mid mr-2">Mid Palate:</span>{brew.mid_palate}</div>}
                {brew.body && <div><span className="font-mono text-xs text-latent-mid mr-2">Body:</span>{brew.body}</div>}
                {brew.finish && <div><span className="font-mono text-xs text-latent-mid mr-2">Finish:</span>{brew.finish}</div>}
              </div>
            </div>
          )}

          {brew.temperature_evolution && (
            <div className="mb-5">
              <div className="label">TEMPERATURE EVOLUTION</div>
              <p className="font-sans text-sm leading-relaxed">{brew.temperature_evolution}</p>
            </div>
          )}

          {brew.key_takeaways && brew.key_takeaways.length > 0 && (
            <div className="mb-5">
              <div className="label">KEY TAKEAWAYS</div>
              <ul className="list-disc list-inside space-y-2 font-sans text-sm">
                {brew.key_takeaways.map((takeaway: string, i: number) => (
                  <li key={i}>{takeaway}</li>
                ))}
              </ul>
            </div>
          )}

          {([
            ['STRATEGY NOTES', brew.strategy_notes],
            ['COOLING-CURVE TARGET', brew.cooling_curve_target],
            ['TERROIR CONNECTION', brew.terroir_connection],
            ['CULTIVAR CONNECTION', brew.cultivar_connection],
            ['CLASSIFICATION', brew.classification],
          ] as const).map(([title, value]) => value && (
            <div key={title} className="mb-5 last:mb-0">
              <div className="label">{title}</div>
              <p className="font-sans text-sm leading-relaxed">{value}</p>
            </div>
          ))}
        </CollapsibleBlock>
      )}
    </div>
  )
}
