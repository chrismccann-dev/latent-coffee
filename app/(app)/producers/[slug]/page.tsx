import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Brew, GreenBean, RoastLearning } from '@/lib/types'
import {
  aggregateProducers,
  producerKey,
  relationshipBadge,
  deriveDecisionStrip,
  channelType,
  roasterSignals,
  type ProducerAggregate,
} from '@/lib/producers'
import {
  SspTopBar,
  SspNamePlate,
  SspShead,
  SspKVStrip,
  SspProseRows,
  StatusPill,
  compactRows,
  type MetaPair,
} from '@/components/Ssp'
import { CoffeesList } from '@/components/CoffeesList'
import { CollapsibleBlock } from '@/components/CollapsibleSection'
import { DetailBackLink } from '@/components/DetailBackLink'
import { getCountryColor } from '@/lib/country-colors'

const LOT_STATUS_LABEL: Record<string, string> = {
  in_inventory: 'In inventory',
  waiting_for_next_roast: 'Waiting for next roast',
  waiting_for_next_cupping: 'Waiting for next cupping',
  waiting_for_brewing: 'Waiting for brewing',
  resolved: 'Resolved',
}

function greenLotMeta(lot: GreenBean): string {
  const kg = lot.quantity_g != null ? `${(lot.quantity_g / 1000).toFixed(1)}kg` : null
  const elev = lot.elevation_m != null ? `${lot.elevation_m}m` : null
  const status = lot.lot_status ? LOT_STATUS_LABEL[lot.lot_status] ?? lot.lot_status : null
  return [lot.importer, kg, elev, lot.density, status].filter(Boolean).join(' · ')
}

function list(arr: string[] | undefined): string | null {
  return arr && arr.length ? arr.join(', ') : null
}

export default async function ProducerDetailPage({ params }: { params: { slug: string } }) {
  const supabase = createClient()

  const decoded = decodeURIComponent(params.slug)
  const key = producerKey(decoded)
  if (!key) notFound()

  const [brewsRes, greenRes, learningsRes] = await Promise.all([
    supabase
      .from('brews')
      .select(
        'id, coffee_name, roaster, producer, source, variety, process, extraction_strategy, peak_expression, green_bean_id, created_at, terroir:terroirs(country, admin_region, macro_terroir)',
      )
      .order('created_at', { ascending: false }),
    supabase
      .from('green_beans')
      .select(
        'id, lot_id, name, producer, importer, exporter, quantity_g, elevation_m, density, lot_status',
      ),
    supabase
      .from('roast_learnings')
      .select(
        'id, green_bean_id, best_roast_id, why_this_roast_won, primary_lever, underdevelopment_signal, overdevelopment_signal, rest_behavior, brewing_tolerance, reference_roasts, general_takeaway',
      ),
  ])

  const brews = (brewsRes.data || []) as unknown as Brew[]
  const greenLots = (greenRes.data || []) as unknown as GreenBean[]
  const roastLearnings = (learningsRes.data || []) as unknown as RoastLearning[]

  const agg = aggregateProducers(brews, greenLots, roastLearnings).find(
    (a) => a.key === key,
  ) as ProducerAggregate | undefined

  // Only 404 a producer with neither a registry entry nor any evidence.
  if (!agg || (!agg.entry && agg.brews.length === 0 && agg.greenLots.length === 0)) {
    notFound()
  }

  const entry = agg.entry
  const country = entry?.country ?? agg.brews.find((b) => b.terroir?.country)?.terroir?.country ?? null
  const badge = relationshipBadge(agg.relationshipState)
  const decision = deriveDecisionStrip(agg)
  const signals = roasterSignals(agg)
  const brewCount = agg.brews.length

  // --- Header meta ---
  const meta: MetaPair[] = compactRows([
    { label: 'Farm', value: entry?.farmName },
    { label: 'Region', value: entry?.adminRegion },
    { label: 'Macro terroir', value: entry?.macroTerroir },
    { label: 'Tier', value: entry?.tier != null ? `Tier ${entry.tier}` : null },
    { label: 'Reference role', value: entry?.referenceRole },
  ]) as MetaPair[]

  // --- Process signature rows ---
  const signatureRows = compactRows([
    { label: 'System', value: entry?.producerSystem },
    { label: 'Processing', value: list(entry?.processingStyleTags) },
    { label: 'Drying', value: entry?.dryingMethod },
    { label: 'Known for', value: list(entry?.knownFor) },
  ])

  // --- Sourcing lens rows ---
  const contactValue = entry?.contact
    ? entry.contact.startsWith('http')
      ? (
          <a
            href={entry.contact}
            target="_blank"
            rel="noreferrer noopener"
            className="underline"
          >
            {entry.contact.replace(/^https?:\/\//, '').replace(/\/$/, '')}
          </a>
        )
      : entry.contact
    : null
  const brewedRefCount = signals.filter((s) => s.brewed).length
  const sourcingRows = compactRows([
    { label: 'Buy priority', value: decision.find((d) => d.label === 'Buy posture')?.value },
    { label: 'Target lots / cultivars', value: list(entry?.primaryCultivars) },
    { label: 'Process fit', value: decision.find((d) => d.label === 'Latent fit')?.value },
    { label: 'Known risks', value: decision.find((d) => d.label === 'Primary risk')?.value },
    { label: 'Channel type', value: channelType(entry) },
    { label: 'Importer', value: list(entry?.importers) },
    { label: 'Exporter', value: list(entry?.exporters) },
    { label: 'Direct contact', value: contactValue },
    {
      label: 'Roaster validation',
      value:
        signals.length > 0
          ? `${brewedRefCount} of ${signals.length} reference roasters brewed`
          : null,
    },
  ])

  const hasEvidence =
    agg.brews.length > 0 || agg.greenLots.length > 0 || agg.roastLearnings.length > 0

  // --- Registry-facts groups (below the fold) ---
  const identityRows = compactRows([
    { label: 'Producer type', value: entry?.producerType },
    { label: 'Farming model', value: entry?.farmingModel },
    { label: 'Market tier', value: entry?.marketTier },
    { label: 'Consistency', value: entry?.consistencyRating },
  ])
  const cultivarRows = compactRows([
    { label: 'Primary', value: list(entry?.primaryCultivars) },
    { label: 'Secondary', value: list(entry?.secondaryCultivars) },
    { label: 'Experimental', value: list(entry?.experimentalCultivars) },
  ])
  const processingRows = compactRows([
    { label: 'Capability', value: entry?.processingCapability },
    { label: 'Style tags', value: list(entry?.processingStyleTags) },
    { label: 'System tags', value: list(entry?.processingSystemTags) },
    { label: 'Drying method', value: entry?.dryingMethod },
  ])
  const flavorRows = compactRows([
    { label: 'Typical profile', value: list(entry?.typicalFlavorProfile) },
    { label: 'Acidity', value: entry?.acidityStyle },
    { label: 'Body', value: entry?.bodyStyle },
  ])

  return (
    <div className="ssp-page">
      <DetailBackLink href="/producers">Producers</DetailBackLink>

      {/* 1. Header */}
      <SspTopBar
        count={brewCount > 0 ? `${brewCount} COFFEE${brewCount === 1 ? '' : 'S'}` : 'INDEXED'}
        anchor={country ?? entry?.producerSystem ?? 'Producer'}
        kind="Producer Profile"
      />
      <SspNamePlate
        title={entry?.name ?? agg.key}
        meta={meta}
        coverColor={country ? getCountryColor(country) : undefined}
        edgeColor={country ? getCountryColor(country) : undefined}
        pills={[<StatusPill key="rel" label={badge.label} tone={badge.tone} />]}
      />

      {/* 2. Decision strip */}
      <div className="ssp-card">
        <SspShead>Decision</SspShead>
        <SspKVStrip items={decision.map((d) => ({ label: d.label, value: d.value }))} />
      </div>

      {/* 3. Process signature */}
      <div className="ssp-card">
        <SspShead>Process Signature</SspShead>
        {entry?.processSignature ? (
          <p className="font-sans text-sm text-latent-fg mb-3">{entry.processSignature}</p>
        ) : (
          <p className="font-sans text-sm text-latent-mid mb-3">
            No process signature authored yet — derived from the system + processing facts below.
          </p>
        )}
        {signatureRows.length > 0 && <SspProseRows rows={signatureRows} />}
      </div>

      {/* 4. Sourcing lens */}
      {sourcingRows.length > 0 && (
        <div className="ssp-card">
          <SspShead>Sourcing Lens</SspShead>
          <SspProseRows rows={sourcingRows} />
        </div>
      )}

      {/* 5. My evidence */}
      {hasEvidence ? (
        <div className="ssp-card">
          <SspShead>My Evidence</SspShead>

          {agg.brews.length > 0 && (
            <div className="mb-5">
              <CoffeesList
                title="Brewed Coffees"
                brews={agg.brews}
                metaFor={(brew) =>
                  [brew.roaster, brew.variety, brew.process, brew.extraction_strategy, brew.peak_expression]
                    .filter(Boolean)
                    .join(' · ')
                }
              />
            </div>
          )}

          {agg.greenLots.length > 0 && (
            <div className="mb-5">
              <SspShead ct={`${agg.greenLots.length} ${agg.greenLots.length === 1 ? 'lot' : 'lots'}`}>
                Green Lots
              </SspShead>
              <div className="border border-latent-border bg-white">
                {agg.greenLots.map((lot) => (
                  <Link
                    key={lot.id}
                    href={`/green/${lot.id}`}
                    className="flex items-center gap-3 px-4 py-3 border-b border-latent-hairline last:border-b-0 hover:bg-latent-bg transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-sans text-sm font-semibold">{lot.lot_id || lot.name}</div>
                      <div className="font-mono text-xxs text-latent-mid">{greenLotMeta(lot)}</div>
                    </div>
                    <span className="font-mono text-xs text-latent-mid opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {agg.roastLearnings.length > 0 && (
            <div>
              <SspShead
                ct={`${agg.roastLearnings.length} ${agg.roastLearnings.length === 1 ? 'lot' : 'lots'}`}
              >
                Roast Learnings
              </SspShead>
              <div className="flex flex-col gap-3">
                {agg.roastLearnings.map((rl) => {
                  const rows = compactRows([
                    { label: 'Reference roast', value: rl.reference_roasts || rl.why_this_roast_won },
                    { label: 'Primary lever', value: rl.primary_lever },
                    { label: 'Underdevelopment signal', value: rl.underdevelopment_signal },
                    { label: 'Overdevelopment signal', value: rl.overdevelopment_signal },
                    { label: 'Rest behavior', value: rl.rest_behavior },
                    { label: 'Brewing tolerance', value: rl.brewing_tolerance },
                  ])
                  return (
                    <div key={rl.id} className="border border-latent-border bg-white p-4">
                      {rows.length > 0 ? (
                        <SspProseRows rows={rows} />
                      ) : (
                        <p className="font-mono text-xxs text-latent-mid">Lot resolved.</p>
                      )}
                      <Link
                        href={`/green/${rl.green_bean_id}`}
                        className="inline-block mt-3 font-mono text-xxs uppercase tracking-wide text-latent-mid hover:text-latent-fg"
                      >
                        View lot →
                      </Link>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="ssp-card">
          <SspShead>My Evidence</SspShead>
          <p className="font-sans text-sm text-latent-mid">
            No personal evidence yet — indexed from the canonical registry. Acquisition signal only.
          </p>
        </div>
      )}

      {/* 6. Roaster signal */}
      {signals.length > 0 && (
        <div className="ssp-card">
          <SspShead>Roaster Signal</SspShead>
          <div className="flex flex-wrap gap-1.5">
            {signals.map((s) => (
              <span key={s.name} className={s.brewed ? 'chip green' : 'chip'}>
                {s.brewed ? '✓ ' : ''}
                {s.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 7. Registry facts (below the fold) */}
      {entry && (
        <CollapsibleBlock title="REGISTRY FACTS">
          {identityRows.length > 0 && (
            <div className="ssp-sub">
              <h3>IDENTITY</h3>
              <SspProseRows rows={identityRows} />
            </div>
          )}
          {cultivarRows.length > 0 && (
            <div className="ssp-sub">
              <h3>CULTIVARS</h3>
              <SspProseRows rows={cultivarRows} />
            </div>
          )}
          {processingRows.length > 0 && (
            <div className="ssp-sub">
              <h3>PROCESSING</h3>
              <SspProseRows rows={processingRows} />
            </div>
          )}
          {flavorRows.length > 0 && (
            <div className="ssp-sub">
              <h3>FLAVOR PROFILE</h3>
              <SspProseRows rows={flavorRows} />
            </div>
          )}
        </CollapsibleBlock>
      )}
    </div>
  )
}
