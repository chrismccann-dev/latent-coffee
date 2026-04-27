'use client'

import { useMemo, useState } from 'react'
import {
  STRUCTURE_BY_AXIS,
  STRUCTURE_AXES,
  parseStructureTag,
  structureTagKey,
  type StructureAxis,
} from '@/lib/flavor-registry'

interface StructureTagsPickerProps {
  /** Stored as ["Axis:Descriptor", ...]. */
  value: string[]
  onChange: (next: string[]) => void
  label?: string
}

const PRIMARY_AXES: StructureAxis[] = ['Acidity', 'Body', 'Clarity', 'Finish']
const SECONDARY_AXES: StructureAxis[] = ['Sweetness', 'Balance', 'Overall']

export function StructureTagsPicker({ value, onChange, label = 'Structure' }: StructureTagsPickerProps) {
  const [moreOpen, setMoreOpen] = useState(false)

  // Parse value into per-axis selections (last value per axis wins if duplicates)
  const byAxis = useMemo(() => {
    const out: Record<StructureAxis, string | null> = {
      Acidity: null, Body: null, Clarity: null, Finish: null,
      Sweetness: null, Balance: null, Overall: null,
    }
    for (const v of value) {
      const parsed = parseStructureTag(v)
      if (parsed && STRUCTURE_AXES.includes(parsed.axis)) {
        out[parsed.axis] = parsed.descriptor
      }
    }
    return out
  }, [value])

  function setAxisValue(axis: StructureAxis, descriptor: string | null) {
    // Rebuild value list preserving order: PRIMARY then SECONDARY axes
    const next: string[] = []
    for (const a of [...PRIMARY_AXES, ...SECONDARY_AXES]) {
      const desc = a === axis ? descriptor : byAxis[a]
      if (desc) next.push(structureTagKey({ axis: a, descriptor: desc }))
    }
    onChange(next)
  }

  const totalCount = value.length
  const countOk = totalCount >= 2 && totalCount <= 3

  function renderAxisRow(axis: StructureAxis) {
    const descriptors = STRUCTURE_BY_AXIS[axis] ?? []
    return (
      <div key={axis} className="grid grid-cols-[7rem_1fr] items-center gap-2">
        <label className="font-mono text-xxs uppercase text-latent-mid">{axis}</label>
        <select
          className="input"
          value={byAxis[axis] ?? ''}
          onChange={(e) => setAxisValue(axis, e.target.value || null)}
        >
          <option value="">— none —</option>
          {descriptors.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>
    )
  }

  // Should the secondary section auto-open? If any secondary axes already have values, yes.
  const hasSecondaryValues = SECONDARY_AXES.some(a => byAxis[a])
  const showSecondary = moreOpen || hasSecondaryValues

  return (
    <div>
      <label className="label">{label}</label>
      <div className="space-y-2 border border-latent-border rounded-md bg-white p-3">
        {PRIMARY_AXES.map(renderAxisRow)}
        {showSecondary ? (
          <>
            <div className="border-t border-latent-border pt-2 mt-2 space-y-2">
              {SECONDARY_AXES.map(renderAxisRow)}
            </div>
            {moreOpen && (
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                className="font-mono text-xxs text-latent-mid hover:text-latent-fg"
              >
                ▴ less structure
              </button>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className="font-mono text-xxs text-latent-mid hover:text-latent-fg"
          >
            ▾ more structure (Sweetness / Balance / Overall)
          </button>
        )}
      </div>
      <div className="mt-1 font-mono text-xxs text-latent-mid">
        {totalCount} tag{totalCount === 1 ? '' : 's'}
        {!countOk && totalCount > 0 && (
          <span className="text-amber-700 ml-2">
            · Rule 8: aim for 2-3 structure tags per coffee
          </span>
        )}
      </div>
    </div>
  )
}
