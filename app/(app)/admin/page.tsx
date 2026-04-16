'use client'

import { useState } from 'react'
import Link from 'next/link'

type SynthesisResults = {
  terroirs_count: number
  cultivars_count: number
  results: {
    terroirs: Record<string, string>
    cultivars: Record<string, string>
  }
}

export default function AdminPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<SynthesisResults | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [type, setType] = useState<'all' | 'terroirs' | 'cultivars'>('all')

  async function handleSynthesize() {
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const res = await fetch('/api/synthesize-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      })

      if (!res.ok) {
        throw new Error(`Failed: ${res.status} ${res.statusText}`)
      }

      const data = await res.json()
      setResults(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Link
        href="/brews"
        className="font-mono text-xs text-latent-mid hover:text-latent-fg mb-6 inline-block"
      >
        ← Back to Brews
      </Link>

      <h1 className="font-sans text-2xl font-semibold mb-6">Admin</h1>

      {/* Re-synthesis */}
      <div className="section-card mb-6">
        <div className="font-mono text-xs font-bold tracking-wide uppercase mb-4 text-latent-fg">
          BULK RE-SYNTHESIS
        </div>
        <p className="font-sans text-sm text-latent-mid mb-4">
          Regenerate AI synthesis for all terroir and cultivar pages. This calls Claude for each
          macro terroir group and each cultivar lineage. Takes 1-2 minutes for all.
        </p>

        <div className="flex items-center gap-4 mb-4">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="font-mono text-xs border border-latent-border rounded px-3 py-2 bg-white"
          >
            <option value="all">All (terroirs + cultivars)</option>
            <option value="terroirs">Terroirs only</option>
            <option value="cultivars">Cultivars only</option>
          </select>

          <button
            onClick={handleSynthesize}
            disabled={loading}
            className="font-mono text-xs font-semibold px-4 py-2 rounded bg-latent-fg text-white hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Synthesizing...' : 'Re-synthesize'}
          </button>
        </div>

        {loading && (
          <div className="font-mono text-xs text-latent-mid animate-pulse">
            Running synthesis across all groups — this takes a minute or two...
          </div>
        )}

        {error && (
          <div className="font-mono text-xs text-red-600 mt-2">
            Error: {error}
          </div>
        )}

        {results && (
          <div className="mt-4 space-y-4">
            <div className="font-mono text-xs text-latent-fg font-semibold">
              Done — {results.terroirs_count} terroir groups, {results.cultivars_count} cultivar lineages
            </div>

            {Object.keys(results.results.terroirs).length > 0 && (
              <div>
                <div className="font-mono text-xxs font-semibold text-latent-mid uppercase mb-2">Terroirs</div>
                <div className="space-y-1">
                  {Object.entries(results.results.terroirs).map(([key, status]) => (
                    <div key={key} className="font-mono text-xs flex justify-between">
                      <span>{key.replace('::', ' → ')}</span>
                      <span className={status.startsWith('✓') ? 'text-green-600' : status.startsWith('error') ? 'text-red-600' : 'text-latent-mid'}>
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {Object.keys(results.results.cultivars).length > 0 && (
              <div>
                <div className="font-mono text-xxs font-semibold text-latent-mid uppercase mb-2">Cultivars</div>
                <div className="space-y-1">
                  {Object.entries(results.results.cultivars).map(([key, status]) => (
                    <div key={key} className="font-mono text-xs flex justify-between">
                      <span>{key}</span>
                      <span className={status.startsWith('✓') ? 'text-green-600' : status.startsWith('error') ? 'text-red-600' : 'text-latent-mid'}>
                        {status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
