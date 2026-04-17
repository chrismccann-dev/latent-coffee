'use client'

import { useId, useMemo, useState } from 'react'
import {
  FLAVOR_REGISTRY,
  findClosestFlavor,
  getFamilyColor,
  getFlavorFamily,
  isCanonicalFlavor,
} from '@/lib/flavor-registry'

interface FlavorNotesInputProps {
  value: string[]
  onChange: (next: string[]) => void
  label?: string
}

export function FlavorNotesInput({ value, onChange, label = 'Flavor notes' }: FlavorNotesInputProps) {
  const [input, setInput] = useState('')
  const datalistId = useId()

  const trimmed = input.trim()
  const suggestion = useMemo(() => {
    if (!trimmed) return null
    if (isCanonicalFlavor(trimmed)) return null
    return findClosestFlavor(trimmed)
  }, [trimmed])

  const addChip = (raw: string) => {
    const chip = raw.trim()
    if (!chip) return
    if (value.includes(chip)) {
      setInput('')
      return
    }
    onChange([...value, chip])
    setInput('')
  }

  const removeChip = (chip: string) => {
    onChange(value.filter((c) => c !== chip))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === 'Tab' || e.key === ',') {
      if (trimmed) {
        e.preventDefault()
        addChip(trimmed)
      }
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      // Backspace on empty input removes last chip
      removeChip(value[value.length - 1])
    }
  }

  return (
    <div>
      <label className="label">{label}</label>
      <div className="border border-latent-border rounded-md bg-white p-2 focus-within:border-latent-fg">
        <div className="flex flex-wrap gap-1.5 items-center">
          {value.map((chip) => {
            const fam = getFlavorFamily(chip)
            const color = getFamilyColor(fam)
            const canonical = isCanonicalFlavor(chip)
            return (
              <span
                key={chip}
                className="font-sans text-xs inline-flex items-center gap-1 px-2 py-1 rounded-full border"
                style={{
                  borderColor: color,
                  color,
                  backgroundColor: `${color}14`, // 8% alpha tint
                  borderStyle: canonical ? 'solid' : 'dashed',
                }}
                title={canonical ? `${fam}` : `${fam} · not in canonical registry`}
              >
                {chip}
                <button
                  type="button"
                  onClick={() => removeChip(chip)}
                  className="font-mono text-[10px] opacity-60 hover:opacity-100"
                  aria-label={`Remove ${chip}`}
                >
                  ✕
                </button>
              </span>
            )
          })}
          <input
            type="text"
            list={datalistId}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => trimmed && addChip(trimmed)}
            className="flex-1 min-w-[8rem] outline-none text-sm font-sans bg-transparent py-1 px-1"
            placeholder={value.length === 0 ? 'Type a flavor, press Enter…' : ''}
          />
          <datalist id={datalistId}>
            {FLAVOR_REGISTRY.map((f) => (
              <option key={f} value={f} />
            ))}
          </datalist>
        </div>
      </div>
      {trimmed && !isCanonicalFlavor(trimmed) && (
        <div className="mt-1 font-mono text-xxs text-amber-700">
          {suggestion
            ? `Not in registry — did you mean "${suggestion}"?`
            : 'Not in registry — will be added as free-text.'}
        </div>
      )}
      <div className="mt-1 font-mono text-xxs text-latent-mid">
        {value.length} note{value.length === 1 ? '' : 's'} · Enter / Tab / comma to add
      </div>
    </div>
  )
}
