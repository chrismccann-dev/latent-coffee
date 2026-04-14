import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { GreenBean } from '@/lib/types'

export default async function GreenBeansPage() {
  const supabase = createClient()
  
  const { data: greenBeans, error } = await supabase
    .from('green_beans')
    .select(`
      *,
      roasts(id),
      roast_learnings(best_batch_id)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching green beans:', error)
  }

  const beans = (greenBeans || []) as (GreenBean & { roasts: { id: string }[], roast_learnings: { best_batch_id: string } | null })[]

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="font-mono text-xs font-semibold tracking-wide uppercase text-latent-mid">
            GREEN BEANS
          </h1>
        </div>
        <div className="font-mono text-xs text-latent-mid">
          {beans.length} {beans.length === 1 ? 'LOT' : 'LOTS'}
        </div>
      </div>

      {/* Empty state */}
      {beans.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-latent-accent rounded-lg mx-auto mb-6 flex items-center justify-center">
            <span className="text-2xl">🌱</span>
          </div>
          <p className="font-mono text-sm text-latent-mid mb-6">
            NO GREEN BEANS YET
          </p>
          <Link href="/add?type=self-roasted" className="btn btn-primary">
            + ADD YOUR FIRST LOT
          </Link>
        </div>
      ) : (
        /* Bean list */
        <div className="space-y-0">
          {beans.map((bean) => {
            const roastCount = bean.roasts?.length || 0
            return (
              <Link 
                key={bean.id} 
                href={`/green/${bean.id}`}
                className="flex items-center gap-5 py-5 border-b border-latent-border hover:bg-latent-highlight/30 transition-colors -mx-4 px-4"
              >
                {/* Icon */}
                <div className="w-12 h-12 bg-latent-accent rounded flex-shrink-0" />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-mono text-sm font-semibold truncate">
                    {bean.name || bean.lot_id}
                  </h3>
                  <p className="font-mono text-xs text-latent-mid truncate">
                    {bean.origin} · {bean.variety} · {bean.process}
                  </p>
                </div>

                {/* Roast count */}
                <div className="font-mono text-xs text-latent-mid flex-shrink-0">
                  {roastCount} {roastCount === 1 ? 'roast' : 'roasts'}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
