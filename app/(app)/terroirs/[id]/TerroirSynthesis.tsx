'use client'

import { useState, useEffect } from 'react'
import { SectionCard } from '@/components/SectionCard'

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
      }
    } catch (err) {
      console.error('Failed to generate terroir synthesis:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!synthesis && !loading && currentBrewCount === 0) return null

  return (
    <SectionCard title="WHAT I'VE LEARNED ABOUT THIS TERROIR">
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
            className="font-mono text-xxs text-latent-mid hover:text-latent-fg mt-3 transition-colors"
          >
            Regenerate
          </button>
        </div>
      ) : (
        <p className="font-mono text-xs text-latent-mid">Not enough data to synthesize yet.</p>
      )}
    </SectionCard>
  )
}
