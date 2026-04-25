'use client'

import { useEffect, useId, useMemo } from 'react'
import type { CanonicalLookup } from '@/lib/canonical-registry'

interface CanonicalTextInputProps {
  label: string
  value: string
  onChange: (next: string) => void
  registry: CanonicalLookup
  placeholder?: string
  // When true, a "Use anyway" link appears under the amber warning for
  // non-resolvable values. Clicking it calls onOverrideChange(true) so the
  // parent can unblock its save-gate and persist the verbatim string. Used
  // for `brews.roaster` (text-only column, no FK) where legitimate tail
  // entries appear. Cultivar / terroir / roast-level should stay strict.
  allowOverride?: boolean
  overridden?: boolean
  onOverrideChange?: (next: boolean) => void
}

export function CanonicalTextInput({
  label,
  value,
  onChange,
  registry,
  placeholder,
  allowOverride = false,
  overridden = false,
  onOverrideChange,
}: CanonicalTextInputProps) {
  const listId = useId()

  const warning = useMemo(() => {
    const trimmed = value.trim()
    if (!trimmed) return { show: false, suggestion: null as string | null, resolvable: true }
    if (registry.isCanonical(trimmed)) return { show: false, suggestion: null, resolvable: true }
    const suggestion = registry.findClosest(trimmed)
    return { show: true, suggestion, resolvable: suggestion !== null }
  }, [value, registry])

  // Auto-reset override when the value becomes resolvable (canonical or alias).
  // Prevents stale-override state after a user corrects their typing.
  useEffect(() => {
    if (overridden && warning.resolvable) onOverrideChange?.(false)
  }, [overridden, warning.resolvable, onOverrideChange])

  const showAmber = warning.show && !overridden
  const showAcknowledged = allowOverride && overridden && !warning.resolvable

  return (
    <div>
      <label className="label">{label}</label>
      <input
        className="input"
        list={listId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <datalist id={listId}>
        {registry.list.map((r) => (
          <option key={r} value={r} />
        ))}
      </datalist>
      {showAmber && (
        <div className="mt-1 font-mono text-xxs text-amber-700">
          {warning.suggestion
            ? `Not in registry — did you mean "${warning.suggestion}"?`
            : 'Not in registry — add via /add to save.'}
          {allowOverride && !warning.resolvable && (
            <>
              {' '}
              <button
                type="button"
                className="underline hover:no-underline"
                onClick={() => onOverrideChange?.(true)}
              >
                Use anyway
              </button>
            </>
          )}
        </div>
      )}
      {showAcknowledged && (
        <div className="mt-1 font-mono text-xxs text-green-700">
          Using non-canonical value — will save verbatim.
        </div>
      )}
    </div>
  )
}
