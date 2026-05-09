'use client'

import { useState, useEffect } from 'react'
import { SectionCard } from '@/components/SectionCard'
import SynthesisRenderer from '@/components/SynthesisRenderer'

interface SynthesisCardProps {
  title: string
  // Stable string identifying the entity for the regeneration effect dep.
  fetchKey: string
  endpoint: string
  requestBody: Record<string, unknown>
  loadingText: string
  existingSynthesis: string | null
  existingBrewCount: number | null
  currentBrewCount: number
}

export default function SynthesisCard({
  title,
  fetchKey,
  endpoint,
  requestBody,
  loadingText,
  existingSynthesis,
  existingBrewCount,
  currentBrewCount,
}: SynthesisCardProps) {
  const [synthesis, setSynthesis] = useState(existingSynthesis)
  const [loading, setLoading] = useState(false)

  const needsUpdate =
    currentBrewCount > 0 && (!existingSynthesis || existingBrewCount !== currentBrewCount)

  useEffect(() => {
    if (needsUpdate) {
      generateSynthesis()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchKey])

  async function generateSynthesis() {
    setLoading(true)
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })
      const data = await res.json()
      if (data.synthesis) {
        setSynthesis(data.synthesis)
      }
    } catch (err) {
      console.error('Failed to generate synthesis:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!synthesis && !loading && currentBrewCount === 0) return null

  return (
    <SectionCard title={title}>
      {loading ? (
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-latent-mid border-t-latent-fg rounded-full animate-spin" />
          <p className="font-mono text-xs text-latent-mid">{loadingText}</p>
        </div>
      ) : synthesis ? (
        <div>
          <SynthesisRenderer text={synthesis} />
          <button
            onClick={generateSynthesis}
            className="font-mono text-xxs text-latent-mid hover:text-latent-fg mt-4 transition-colors"
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
