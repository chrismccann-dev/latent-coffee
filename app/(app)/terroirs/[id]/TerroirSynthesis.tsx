'use client'

import { useState, useEffect } from 'react'

interface TerroirSynthesisProps {
  terriorIds: string[]
  macroTerroirName: string
  existingSynthesis: string | null
  existingBrewCount: number | null
  currentBrewCount: number
}

export default function TerroirSynthesis({
  terriorIds,
  macroTerroirName,
  existingSynthesis,
  existingBrewCount,
  currentBrewCount,
}: TerroirSynthesisProps) {
  const [synthesis, setSynthesis] = useState(existingSynthesis)
  const [loading, setLoading] = useState(false)
  const [debugMsg, setDebugMsg] = useState<string | null>(null)

  const needsUpdate = currentBrewCount > 0 && (
    !existingSynthesis || existingBrewCount !== currentBrewCount
  )

  useEffect(() => {
    if (needsUpdate) {
      generateSynthesis()
    }
  }, [terriorIds.join(',')]) // eslint-disable-line react-hooks/exhaustive-deps

  async function generateSynthesis() {
    setLoading(true)
    try {
      const res = await fetch('/api/terroirs/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ terriorIds }),
      })
      const data = await res.json()
      if (data.synthesis) {
        setSynthesis(data.synthesis)
      } else {
        setDebugMsg(`API response: ${JSON.stringify(data)}`)
      }
    } catch (err: any) {
      setDebugMsg(`Fetch error: ${err?.message || err}`)
    } finally {
      setLoading(false)
    }
  }

  if (!synthesis && !loading && currentBrewCount === 0) return null

  return (
    <div className="rounded-md p-6 mb-4 bg-white border border-latent-border">
      <div className="font-mono text-xs font-bold tracking-wide uppercase mb-4 text-latent-fg">
        WHAT I&apos;VE LEARNED ABOUT THIS TERROIR
      </div>
      {loading ? (
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-latent-mid border-t-latent-fg rounded-full animate-spin" />
          <p className="font-mono text-xs text-latent-mid">Synthesizing knowledge from {currentBrewCount} coffees across {macroTerroirName}...</p>
        </div>
      ) : synthesis ? (
        <div>
          <p className="font-sans text-sm leading-relaxed">{synthesis}</p>
          <button
            onClick={generateSynthesis}
            className="font-mono text-[10px] text-latent-mid hover:text-latent-fg mt-3 transition-colors"
          >
            Regenerate
          </button>
        </div>
      ) : (
        <div>
          <p className="font-mono text-xs text-latent-mid">Not enough data to synthesize yet.</p>
          {debugMsg && <p className="font-mono text-[10px] text-red-500 mt-2">{debugMsg}</p>}
        </div>
      )}
    </div>
  )
}
