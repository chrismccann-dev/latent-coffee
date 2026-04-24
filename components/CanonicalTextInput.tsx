'use client'

import { useId, useMemo } from 'react'
import type { CanonicalLookup } from '@/lib/canonical-registry'

interface CanonicalTextInputProps {
  label: string
  value: string
  onChange: (next: string) => void
  registry: CanonicalLookup
  placeholder?: string
}

export function CanonicalTextInput({
  label,
  value,
  onChange,
  registry,
  placeholder,
}: CanonicalTextInputProps) {
  const listId = useId()

  const warning = useMemo(() => {
    const trimmed = value.trim()
    if (!trimmed) return { show: false, suggestion: null as string | null }
    if (registry.isCanonical(trimmed)) return { show: false, suggestion: null }
    return { show: true, suggestion: registry.findClosest(trimmed) }
  }, [value, registry])

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
      {warning.show && (
        <div className="mt-1 font-mono text-xxs text-amber-700">
          {warning.suggestion
            ? `Not in registry — did you mean "${warning.suggestion}"?`
            : 'Not in registry — add via /add to save.'}
        </div>
      )}
    </div>
  )
}
