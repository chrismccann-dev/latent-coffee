'use client'

import { useState, useEffect } from 'react'
import { SspShead } from '@/components/Ssp'
import { CollapsibleBlock } from '@/components/CollapsibleBlock'
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
  // Sprint 13 — SYN-3 / SYN-7 props. All three are nullable; missing values
  // fall back to the count-based trigger and to the long-form render.
  existingShortForm?: string | null
  existingSynthesisInputUpdatedAt?: string | null
  currentInputMaxUpdatedAt?: string | null
  // Roaster exception (2026-06-03 priority-stack recount): on /roasters/[id]
  // the Coffees list is primary and synthesis drops to collapsible tertiary.
  // When true, render inside a `details.ssp-coll` (collapsed by default) using
  // `title` as the summary, instead of the always-open `.ssp-card`. Default
  // false keeps terroir / cultivar / processes synthesis open (secondary).
  collapsible?: boolean
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
  existingShortForm = null,
  existingSynthesisInputUpdatedAt = null,
  currentInputMaxUpdatedAt = null,
  collapsible = false,
}: SynthesisCardProps) {
  const [synthesis, setSynthesis] = useState(existingSynthesis)
  const [shortForm, setShortForm] = useState<string | null>(existingShortForm)
  const [loading, setLoading] = useState(false)

  // SYN-7: belt-and-suspenders trigger. The brew-count delta is the legacy
  // signal; synthesis_input_max_updated_at catches content edits that don't
  // change the count (e.g. rewritten what_i_learned, newly-filled
  // roast_learnings). Either signal alone triggers regeneration. The
  // currentInputMaxUpdatedAt check is gated on truthiness so consumers that
  // haven't been updated yet fall back cleanly to the count signal.
  const needsUpdate =
    currentBrewCount > 0 &&
    (!existingSynthesis ||
      existingBrewCount !== currentBrewCount ||
      (currentInputMaxUpdatedAt != null &&
        existingSynthesisInputUpdatedAt !== currentInputMaxUpdatedAt))

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
      // The short-form is best-effort in runSynthesis (Sprint 13 / SYN-3);
      // if the 3rd call failed, data.short_form is null and the mobile view
      // falls back to the long-form render below.
      if (data.short_form !== undefined) {
        setShortForm(data.short_form ?? null)
      }
    } catch (err) {
      console.error('Failed to generate synthesis:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!synthesis && !loading && currentBrewCount === 0) return null

  // SYN-3 mobile fallback: when short_form is null (post-migration window or
  // 3rd-call failure), render the long-form on mobile too rather than a
  // blank state. The Regenerate button stays available either way.
  const mobileText = shortForm ?? synthesis

  const inner = loading ? (
    <div className="flex items-center gap-3">
      <div className="w-4 h-4 border-2 border-latent-mid border-t-latent-fg rounded-full animate-spin" />
      <p className="font-mono text-xs text-latent-mid">{loadingText}</p>
    </div>
  ) : synthesis ? (
    <div>
      {/* Mobile (<md:): short-form when available, long-form fallback. The
          one @media split left in the migrated surfaces — kept because it's a
          content switch (mobile gets the digest), not a layout reflow. */}
      <div className="md:hidden">
        {mobileText && <SynthesisRenderer text={mobileText} />}
      </div>
      {/* Desktop (md+): full long-form */}
      <div className="hidden md:block">
        <SynthesisRenderer text={synthesis} />
      </div>
      <button
        onClick={generateSynthesis}
        className="font-mono text-xxs text-latent-mid hover:text-latent-fg mt-4 transition-colors"
      >
        Regenerate
      </button>
    </div>
  ) : (
    <p className="font-mono text-xs text-latent-mid">Not enough data to synthesize yet.</p>
  )

  // Roaster exception: collapse via the shared CollapsibleBlock (`details.ssp-coll`
  // with `title` as the summary) so the collapse markup lives in one place. The
  // synthesis still mounts (details children always render), so auto-generation
  // + caching fire even while collapsed. `inner` carries no title — the summary
  // is the only heading here, vs the SspShead in the always-open branch.
  if (collapsible) {
    return <CollapsibleBlock title={title}>{inner}</CollapsibleBlock>
  }

  return (
    <div className="ssp-card">
      <SspShead>{title}</SspShead>
      {inner}
    </div>
  )
}
