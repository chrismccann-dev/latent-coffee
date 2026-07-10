import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { DetailBackLink } from '@/components/DetailBackLink'
import {
  Chip,
  StatusPill,
  SspTopBar,
  SspNamePlate,
  SspShead,
  SspRecipeHead,
  SspTimeline,
  SspModifier,
  SspStructure,
  SspIdentGrid,
  type TimelineStep,
  type StructureRow,
  type IdentCell,
} from '@/components/Ssp'
import { cleanModifiers, splitModifierLabel } from '@/lib/extraction-modifiers'
import { getStrategyStyle } from '@/lib/extraction-strategy'
import { composeHybridSubformLabel } from '@/lib/hybrid-subform'
import { extractDrawdown, parsePourSteps, pourTimelineRows } from '@/lib/pour-structure'
import { getFilterDisplayName } from '@/lib/filter-registry'

// Canonical axis order for grouping structure_tags ("Axis:Descriptor") into
// SspStructure rows. Anything outside the list falls to the end alphabetically.
const STRUCTURE_AXIS_ORDER = [
  'Acidity',
  'Body',
  'Clarity',
  'Finish',
  'Sweetness',
  'Balance',
  'Overall',
]

export default async function BrewDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: brew, error } = await supabase
    .from('brews')
    .select(`
      *,
      green_bean:green_beans!green_bean_id(*),
      terroir:terroirs(*),
      cultivar:cultivars(*),
      roast:roasts(*)
    `)
    .eq('id', params.id)
    .single()

  if (error || !brew) {
    notFound()
  }

  const producer = brew.producer || brew.green_bean?.producer || null
  const drawdown = extractDrawdown(brew.total_time, brew.pour_structure)

  const modifiersResult = cleanModifiers(brew.modifiers)
  const modifiers = modifiersResult.ok ? modifiersResult.value : []
  const modifierSplits = modifiers.map((m) => splitModifierLabel(m))
  const modifierHeads = modifierSplits.map((s) => s.head)
  const detailSplits = modifierSplits.filter((s) => s.detail)

  const hybridSubformLabel =
    brew.extraction_strategy === 'Hybrid'
      ? composeHybridSubformLabel(brew.hybrid_subform)
      : null

  const tastedDiverged =
    !!brew.extraction_confirmed?.trim() &&
    brew.extraction_confirmed.trim().toLowerCase() !==
      brew.extraction_strategy?.trim().toLowerCase()

  // --- T1 Recipe head (6 canonical variables; always renders — page anchor) ---
  const ratio =
    brew.ratio ??
    (brew.water_g != null && brew.dose_g
      ? `1:${Math.round(brew.water_g / brew.dose_g)}`
      : null)
  const recipeCells = [
    { label: 'Dose', value: brew.dose_g != null ? `${brew.dose_g}g` : '—' },
    { label: 'Water', value: brew.water_g != null ? `${brew.water_g}g` : '—' },
    { label: 'Ratio', value: ratio ?? '—' },
    { label: 'Grind', value: brew.grind ?? '—' },
    { label: 'Temp', value: brew.temp_c != null ? `${brew.temp_c}°C` : '—' },
    { label: 'Total', value: brew.total_time ?? drawdown ?? '—' },
  ]

  // --- T1 Timeline ---
  // Structured `brews.pours` (migration 074) is canonical: bloom is index 0,
  // one row per real step, start times explicit. When present we render it
  // directly — no parsing, so no double-bloom / `·` / meta-leak failure modes.
  // Legacy rows (NULL pours) fall back to prepending `bloom` + parsing the
  // free-text `pour_structure`. The parser keeps `raw` intact, so a pour's raw
  // text often re-states its own label + time ("Pour 1: 0:57 → 110g …") — both
  // already shown in the timeline columns; strip that leading echo.
  const cleanPourDesc = (raw: string, time?: string): string => {
    let s = raw.replace(/^(Pour\s*\d+(?:\s*\([^)]+\))?|Bloom|Drawdown)\s*[:.–-]?\s*/i, '')
    if (time) {
      s = s.replace(/^~?\d+:\d{2}(?:\s*[–-]\s*~?\d+:\d{2})?\s*[→–-]?\s*/, '')
    }
    return s.trim() || raw
  }
  const timelineSteps: TimelineStep[] = []
  if (brew.pours && brew.pours.length > 0) {
    timelineSteps.push(...pourTimelineRows(brew.pours))
  } else {
    if (brew.bloom) {
      timelineSteps.push({ t: '0:00', label: 'Bloom', desc: brew.bloom })
    }
    parsePourSteps(brew.pour_structure).forEach((step, i) => {
      timelineSteps.push({
        t: step.time ?? '·',
        label: step.label ?? `Pour ${i + 1}`,
        desc: cleanPourDesc(step.raw, step.time),
      })
    })
  }

  // --- T1 Modifier detail prose (label-prefixed only when >1 detail row) ---
  const modifierDetail =
    detailSplits.length > 0 ? (
      <div className="space-y-1">
        {detailSplits.map((s, i) => (
          <div key={i}>
            {detailSplits.length > 1 && <span className="font-semibold">{s.head}: </span>}
            {s.detail}
          </div>
        ))}
      </div>
    ) : null

  const strategyLabel = brew.extraction_strategy
    ? hybridSubformLabel
      ? `${brew.extraction_strategy} · ${hybridSubformLabel}`
      : brew.extraction_strategy
    : null

  // --- T2 Structure rows grouped by axis ---
  const structureByAxis = new Map<string, string[]>()
  for (const tag of (brew.structure_tags ?? []) as string[]) {
    const idx = tag.indexOf(':')
    const axis = idx >= 0 ? tag.slice(0, idx) : 'Other'
    const desc = idx >= 0 ? tag.slice(idx + 1) : tag
    const list = structureByAxis.get(axis) ?? []
    list.push(desc)
    structureByAxis.set(axis, list)
  }
  const structureRows: StructureRow[] = Array.from(structureByAxis.entries())
    .sort(([a], [b]) => {
      const ai = STRUCTURE_AXIS_ORDER.indexOf(a)
      const bi = STRUCTURE_AXIS_ORDER.indexOf(b)
      return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi) || a.localeCompare(b)
    })
    .map(([axis, descs]) => ({
      lbl: axis,
      chips: descs.map((d) => ({ name: d, tone: 'green' as const })),
    }))

  const hasFlavors = !!(brew.flavor_notes && brew.flavor_notes.length > 0)
  const hasStructure = structureRows.length > 0

  // --- T4 Coffee Overview (5-cell identity grid) ---
  const cultivarSub = brew.cultivar
    ? [brew.cultivar.species, brew.cultivar.genetic_family, brew.cultivar.lineage]
        .filter(Boolean)
        .join(' → ')
    : null
  const terroirSub = brew.terroir
    ? [brew.terroir.country, brew.terroir.admin_region].filter(Boolean).join(' → ')
    : null
  const processSub =
    Array.isArray(brew.fermentation_qualifiers) && brew.fermentation_qualifiers.length > 0
      ? brew.fermentation_qualifiers.join(' · ')
      : null
  const identCells: IdentCell[] = [
    { label: 'Roast Level', value: brew.roast_level ?? '—' },
    {
      label: 'Cultivar',
      value: brew.cultivar?.cultivar_name ?? brew.variety ?? '—',
      sub: cultivarSub,
    },
    { label: 'Process', value: brew.process ?? brew.base_process ?? '—', sub: processSub },
    { label: 'Terroir', value: brew.terroir?.macro_terroir ?? '—', sub: terroirSub },
    { label: 'Producer', value: producer ?? '—' },
  ]

  // --- T4 Full Brew Notes (catch-all; gated to populated fields) ---
  const sensoryRows = (
    [
      ['Aroma', brew.aroma],
      ['Attack', brew.attack],
      ['Mid Palate', brew.mid_palate],
      ['Body', brew.body],
      ['Finish', brew.finish],
    ] as const
  ).filter(([, v]) => !!v)
  const proseFields = (
    [
      ['Strategy Notes', brew.strategy_notes],
      ['Cooling-Curve Target', brew.cooling_curve_target],
      ['Terroir Connection', brew.terroir_connection],
      ['Cultivar Connection', brew.cultivar_connection],
    ] as const
  ).filter(([, v]) => !!v)
  const hasTakeaways = !!(brew.key_takeaways && brew.key_takeaways.length > 0)
  const showFullBrewNotes =
    sensoryRows.length > 0 ||
    !!brew.temperature_evolution ||
    hasTakeaways ||
    proseFields.length > 0 ||
    !!brew.classification

  // Strategy renders with status-pill casing/sizing but keeps the strategy hue
  // (design-audit 02 Finding 3: strategy is a classification signal, not
  // content vocabulary — it must read as one row with its status siblings).
  const strategyStyle = getStrategyStyle(brew.extraction_strategy)

  // Roaster row dropped (polish-audit Pass 1): the topbar anchor slot already
  // carries the roaster — topbar = identity, hero meta = differentiation.
  const meta = [
    {
      label: 'Variety',
      value: brew.variety || brew.cultivar?.cultivar_name || '—',
    },
    { label: 'Producer', value: producer || '—' },
  ]

  return (
    <div className="ssp-page">
      <DetailBackLink href="/brews">Brews</DetailBackLink>

      {/* Header */}
      <SspTopBar
        id={
          brew.source === 'self-roasted' && brew.roast?.batch_id
            ? `Batch #${brew.roast.batch_id}`
            : undefined
        }
        count={brew.created_at?.slice(0, 10)}
        anchor={brew.roaster?.toUpperCase()}
        kind="Brew Detail"
      />
      <SspNamePlate
        title={brew.coffee_name}
        meta={meta}
        pills={[
          <StatusPill
            key="src"
            label={brew.source === 'self-roasted' ? 'Roasted' : 'Purchased'}
          />,
          ...(brew.roast_level
            ? [<StatusPill key="roast" label={`Roast · ${brew.roast_level}`} tone="amber" />]
            : []),
          ...(brew.extraction_strategy && strategyStyle
            ? [<StatusPill key="strat" label={brew.extraction_strategy} hue={strategyStyle} />]
            : []),
        ]}
      />

      {/* TIER 1 — Reference Brew Recipe */}
      <div>
        <SspShead
          ct={[brew.brewer, getFilterDisplayName(brew.filter) || null]
            .filter(Boolean)
            .join(' · ') || undefined}
        >
          Reference Brew Recipe
        </SspShead>
        <SspRecipeHead items={recipeCells} />
        {timelineSteps.length > 0 && <SspTimeline steps={timelineSteps} />}
        {drawdown && <div className="ssp-tail">Drawdown · {drawdown}</div>}
        {brew.water_recipe && (
          <div className="ssp-tail">Water · {brew.water_recipe}</div>
        )}
        {strategyLabel && (
          <div className="mt-2.5">
            <SspModifier
              strategy={strategyLabel}
              modifiers={modifierHeads}
              detail={modifierDetail}
              tastedAs={tastedDiverged ? brew.extraction_confirmed : undefined}
            />
          </div>
        )}
      </div>

      {/* TIER 2 — Presentation: Flavor Notes + Structure */}
      {(hasFlavors || hasStructure) && (
        <div className="ssp-card zero-pad">
          {hasFlavors && (
            <div className="ssp-card-sect">
              <SspShead ct={`${brew.flavor_notes!.length} notes`}>Flavor Notes</SspShead>
              <div className="flex flex-wrap gap-1.5">
                {brew.flavor_notes!.map((note: string) => (
                  <Chip key={note} name={note} tone="green" />
                ))}
              </div>
            </div>
          )}
          {hasStructure && (
            <div className="ssp-card-sect">
              <SspShead>Structure</SspShead>
              <SspStructure rows={structureRows} />
            </div>
          )}
        </div>
      )}

      {/* TIER 3 — Peak Expression */}
      {brew.peak_expression && (
        <div className="ssp-peak">
          <div className="hd">Peak Expression</div>
          <div className="body">{brew.peak_expression}</div>
        </div>
      )}

      {/* TIER 4 — Coffee Overview */}
      <div>
        <SspShead>Coffee Overview</SspShead>
        <SspIdentGrid cells={identCells} />
      </div>

      {/* TIER 4 — What I Learned */}
      {brew.what_i_learned && (
        <div className="ssp-learned">
          <div className="hd">What I Learned</div>
          <p className="whitespace-pre-line">{brew.what_i_learned}</p>
        </div>
      )}

      {/* TIER 4 — Full Brew Notes collapse */}
      {showFullBrewNotes && (
        <details className="ssp-coll">
          <summary>
            Additional Information
            <span className="ct">Sensory · Temperature · Takeaways · Classification</span>
            <span className="chev" />
          </summary>
          <div className="body">
            {sensoryRows.length > 0 && (
              <div className="ssp-sub">
                <h3>Sensory Notes</h3>
                <div className="ssp-sense">
                  {sensoryRows.map(([label, value]) => (
                    <div className="row" key={label}>
                      <b>{label}</b>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {brew.temperature_evolution && (
              <div className="ssp-sub">
                <h3>Temperature Evolution</h3>
                <div className="ssp-prose">{brew.temperature_evolution}</div>
              </div>
            )}

            {hasTakeaways && (
              <div className="ssp-sub">
                <h3>Key Takeaways · {brew.key_takeaways!.length} entries</h3>
                <ol className="ssp-take">
                  {brew.key_takeaways!.map((t: string, i: number) => (
                    <li key={i}>{t}</li>
                  ))}
                </ol>
              </div>
            )}

            {proseFields.map(([label, value]) => (
              <div className="ssp-sub" key={label}>
                <h3>{label}</h3>
                <div className="ssp-prose">{value}</div>
              </div>
            ))}

            {brew.classification && (
              <div className="ssp-sub">
                <h3>Classification</h3>
                <div className="ssp-classif">
                  <b>Indexed</b>
                  {brew.classification}
                </div>
              </div>
            )}
          </div>
        </details>
      )}
    </div>
  )
}
