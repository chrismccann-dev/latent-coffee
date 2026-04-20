import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SectionCard } from '@/components/SectionCard'

function LearningField({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div>
      <div className="label">{label}</div>
      {value}
    </div>
  )
}

export default async function GreenBeanDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  
  // Fetch green bean with related data
  const { data: bean, error } = await supabase
    .from('green_beans')
    .select(`
      *,
      terroir:terroirs(*),
      cultivar:cultivars(*),
      roasts(*),
      experiments(*),
      roast_learnings(*)
    `)
    .eq('id', params.id)
    .single()

  if (error || !bean) {
    notFound()
  }

  // Get cuppings for each roast
  const roastIds = bean.roasts?.map((r: any) => r.id) || []
  let cuppings: any[] = []
  if (roastIds.length > 0) {
    const { data } = await supabase
      .from('cuppings')
      .select('*')
      .in('roast_id', roastIds)
    cuppings = data || []
  }

  const learnings = bean.roast_learnings?.[0] || bean.roast_learnings
  const bestBatchId = learnings?.best_batch_id

  // Get related brews
  const { data: relatedBrews } = await supabase
    .from('brews')
    .select('id, coffee_name')
    .eq('green_bean_id', params.id)

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Back button */}
      <Link 
        href="/green" 
        className="font-mono text-xs text-latent-mid hover:text-latent-fg mb-6 inline-block"
      >
        ← Back to Green Beans
      </Link>

      {/* Hero */}
      <div className="flex gap-6 mb-8">
        <div className="w-20 h-20 bg-latent-accent rounded-md flex-shrink-0" />
        <div>
          <h1 className="font-sans text-2xl font-semibold mb-2">
            🌱 {bean.name || bean.lot_id}
          </h1>
          {bean.lot_id && (
            <div className="font-mono text-xs text-latent-mid mb-1">
              Lot: {bean.lot_id}
            </div>
          )}
          <div className="font-mono text-sm text-latent-mid">
            {bean.origin} · {bean.variety} · {bean.process}
          </div>
        </div>
      </div>

      {/* Green Bean Details */}
      <SectionCard title="GREEN BEAN DETAILS">
        <div className="grid grid-cols-2 gap-x-8 gap-y-3 font-sans text-sm">
          {bean.producer && <div><strong>Producer:</strong> {bean.producer}</div>}
          {bean.region && <div><strong>Region:</strong> {bean.region}</div>}
          {bean.importer && <div><strong>Importer:</strong> {bean.importer}</div>}
          {bean.purchase_date && <div><strong>Purchased:</strong> {bean.purchase_date}</div>}
          {bean.price_per_kg && <div><strong>Price:</strong> ${bean.price_per_kg}/kg</div>}
          {bean.quantity_g && <div><strong>Quantity:</strong> {bean.quantity_g}g</div>}
          {bean.moisture && <div><strong>Moisture:</strong> {bean.moisture}%</div>}
          {bean.density && <div><strong>Density:</strong> {bean.density} g/L</div>}
        </div>
      </SectionCard>

      {/* Best Roast */}
      {bestBatchId && (
        <SectionCard title="🏆 BEST ROAST" dark>
          <div className="font-mono text-lg font-semibold mb-3">
            Batch #{bestBatchId}
          </div>
          {learnings?.why_this_roast_won && (
            <div className="font-sans text-sm leading-relaxed">
              <strong>Why it won:</strong> {learnings.why_this_roast_won}
            </div>
          )}
        </SectionCard>
      )}

      {/* Roast Log */}
      {bean.roasts && bean.roasts.length > 0 && (
        <SectionCard title={`ROAST LOG (${bean.roasts.length} ROASTS)`}>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Batch</th>
                  <th>Date</th>
                  <th>FC</th>
                  <th>FC Temp</th>
                  <th>Drop</th>
                  <th>Drop Temp</th>
                  <th>Dev</th>
                  <th>Agtron</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {bean.roasts.map((roast: any) => (
                  <tr
                    key={roast.id}
                    className={String(roast.batch_id) === String(bestBatchId) ? 'highlight' : ''}
                  >
                    <td className={String(roast.batch_id) === String(bestBatchId) ? 'font-semibold' : ''}>
                      #{roast.batch_id} {String(roast.batch_id) === String(bestBatchId) && '★'}
                    </td>
                    <td>{roast.roast_date || '—'}</td>
                    <td>{roast.fc_start || '—'}</td>
                    <td>{roast.fc_temp ? `${roast.fc_temp}°C` : '—'}</td>
                    <td>{roast.drop_time || '—'}</td>
                    <td>{roast.drop_temp ? `${roast.drop_temp}°C` : '—'}</td>
                    <td>
                      {roast.dev_time_s ? `${roast.dev_time_s}s` : '—'}
                      {roast.dev_ratio && ` (${roast.dev_ratio})`}
                    </td>
                    <td>{roast.agtron || '—'}</td>
                    <td>
                      {roast.profile_link && (
                        <a
                          href={roast.profile_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-latent-mid hover:text-latent-fg"
                          title="Roest profile"
                        >
                          ↗
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      {/* Experiments */}
      {bean.experiments && bean.experiments.length > 0 && (
        <SectionCard title={`EXPERIMENTS (${bean.experiments.length})`}>
          {bean.experiments.map((exp: any, i: number) => (
            <div
              key={exp.id}
              className={`${i < bean.experiments.length - 1 ? 'mb-6 pb-6 border-b border-latent-border' : ''}`}
            >
              <div className="font-mono text-sm font-semibold mb-1">{exp.experiment_id}</div>
              {exp.batch_ids && (
                <div className="font-mono text-xs text-latent-mid mb-4">Batches: {exp.batch_ids}</div>
              )}
              <div className="space-y-4 font-sans text-sm leading-relaxed">
                {exp.primary_question && (
                  <div>
                    <div className="label">Question</div>
                    {exp.primary_question}
                  </div>
                )}
                {exp.variable_changed && (
                  <div>
                    <div className="label">Variable</div>
                    {exp.variable_changed}
                  </div>
                )}
                {exp.winner && (
                  <div className="bg-latent-highlight p-3 rounded">
                    <div className="label">Winner</div>
                    {exp.winner}
                  </div>
                )}
                {exp.key_insight && (
                  <div>
                    <div className="label">Key Insight</div>
                    {exp.key_insight}
                  </div>
                )}
                {exp.what_changes_going_forward && (
                  <div>
                    <div className="label">What Changes Going Forward</div>
                    {exp.what_changes_going_forward}
                  </div>
                )}
              </div>
            </div>
          ))}
        </SectionCard>
      )}

      {/* Roast Learnings */}
      {learnings && (
        <SectionCard title="🔥 ROAST LEARNINGS">
          <div className="space-y-4 font-sans text-sm leading-relaxed">
            <LearningField label="Aromatic Behavior" value={learnings.aromatic_behavior} />
            <LearningField label="Structural Behavior" value={learnings.structural_behavior} />
            <LearningField label="Elasticity" value={learnings.elasticity} />
            <LearningField label="Roast Window Width" value={learnings.roast_window_width} />
            <LearningField label="Primary Lever" value={learnings.primary_lever} />
            <LearningField label="Secondary Levers" value={learnings.secondary_levers} />
            <LearningField label="What Didn't Move the Needle" value={learnings.what_didnt_move_needle} />
            <LearningField label="Underdevelopment Signal" value={learnings.underdevelopment_signal} />
            <LearningField label="Overdevelopment Signal" value={learnings.overdevelopment_signal} />
            <LearningField label="Cultivar Takeaway" value={learnings.cultivar_takeaway} />
            <LearningField label="General Takeaway" value={learnings.general_takeaway} />
            <LearningField label="Rest Behavior" value={learnings.rest_behavior} />
            <LearningField label="Reference Roasts" value={learnings.reference_roasts} />
            <LearningField label="Starting Hypothesis" value={learnings.starting_hypothesis} />
          </div>
        </SectionCard>
      )}

      {/* Cupping History */}
      {cuppings.length > 0 && (
        <SectionCard title={`CUPPING HISTORY (${cuppings.length} EVALUATIONS)`}>
          {cuppings.map((cup: any, i: number) => {
            const roast = bean.roasts?.find((r: any) => r.id === cup.roast_id)
            return (
              <div 
                key={cup.id}
                className={`${i < cuppings.length - 1 ? 'mb-4 pb-4 border-b border-latent-border' : ''}`}
              >
                <div className="font-mono text-xs text-latent-mid mb-1">
                  Batch #{roast?.batch_id || '?'} · {cup.rest_days}d rest · {cup.eval_method}
                  {cup.ground_agtron && ` · Gnd Agtron: ${cup.ground_agtron}`}
                </div>
                <div className="font-sans text-sm">
                  {cup.overall || [cup.aroma, cup.flavor, cup.acidity, cup.body, cup.finish].filter(Boolean).join(' · ')}
                </div>
              </div>
            )
          })}
        </SectionCard>
      )}

      {/* Related Brews */}
      {relatedBrews && relatedBrews.length > 0 && (
        <div className="mt-6">
          <div className="label">RELATED BREWS</div>
          {relatedBrews.map((brew: any) => (
            <Link 
              key={brew.id}
              href={`/brews/${brew.id}`}
              className="flex justify-between items-center bg-white border border-latent-border rounded p-4 mb-2 hover:border-latent-mid transition-colors"
            >
              <div className="font-mono text-sm font-semibold">{brew.coffee_name}</div>
              <span className="text-latent-mid">→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
