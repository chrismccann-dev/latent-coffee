'use client'

import { useId, useMemo, useState } from 'react'
import type { CanonicalLookup } from '@/lib/canonical-registry'
import {
  BASE_PROCESSES,
  type BaseProcess,
  HONEY_SUBPROCESSES,
  type HoneySubprocess,
  FERMENTATION_LOOKUP,
  DRYING_LOOKUP,
  INTERVENTION_LOOKUP,
  EXPERIMENTAL_LOOKUP,
  DECAF_MODIFIERS,
  type DecafModifier,
  SIGNATURE_LOOKUP,
  getSignatureEntry,
  composeProcess,
  type StructuredProcess,
} from '@/lib/process-registry'
export { isProcessResolvable } from '@/lib/process-registry'
import { CanonicalTextInput } from './CanonicalTextInput'

interface ProcessPickerProps {
  value: StructuredProcess
  onChange: (next: StructuredProcess) => void
}

export function ProcessPicker({ value, onChange }: ProcessPickerProps) {
  const setField = <K extends keyof StructuredProcess>(key: K, next: StructuredProcess[K]) => {
    onChange({ ...value, [key]: next })
  }

  const handleBaseChange = (base: BaseProcess) => {
    // Clear Honey subprocess when switching away from Honey
    const subprocess = base === 'Honey' ? value.subprocess : null
    onChange({ ...value, base_process: base, subprocess })
  }

  const signatureEntry = getSignatureEntry(value.signature_method)

  return (
    <div className="space-y-3">
      {/* Base */}
      <div>
        <label className="label">Base process *</label>
        <select
          className="input"
          value={value.base_process}
          onChange={(e) => handleBaseChange(e.target.value as BaseProcess)}
        >
          {BASE_PROCESSES.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      {/* Honey subprocess — only when base=Honey */}
      {value.base_process === 'Honey' && (
        <div>
          <label className="label">Honey subprocess</label>
          <select
            className="input"
            value={value.subprocess ?? ''}
            onChange={(e) => setField('subprocess', (e.target.value || null) as HoneySubprocess | null)}
          >
            <option value="">—</option>
            {HONEY_SUBPROCESSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}

      {/* Modifier axes */}
      <ProcessChipsInput
        label="Fermentation modifiers"
        registry={FERMENTATION_LOOKUP}
        value={value.fermentation_modifiers}
        onChange={(v) => setField('fermentation_modifiers', v as readonly StructuredProcess['fermentation_modifiers'][number][])}
      />
      <ProcessChipsInput
        label="Drying modifiers"
        registry={DRYING_LOOKUP}
        value={value.drying_modifiers}
        onChange={(v) => setField('drying_modifiers', v as readonly StructuredProcess['drying_modifiers'][number][])}
      />
      <ProcessChipsInput
        label="Intervention modifiers (co-ferments, infusions)"
        registry={INTERVENTION_LOOKUP}
        value={value.intervention_modifiers}
        onChange={(v) => setField('intervention_modifiers', v as readonly StructuredProcess['intervention_modifiers'][number][])}
      />
      <ProcessChipsInput
        label="Experimental modifiers"
        registry={EXPERIMENTAL_LOOKUP}
        value={value.experimental_modifiers}
        onChange={(v) => setField('experimental_modifiers', v as readonly StructuredProcess['experimental_modifiers'][number][])}
      />

      {/* Decaf */}
      <div>
        <label className="label">Decaf method</label>
        <select
          className="input"
          value={value.decaf_modifier ?? ''}
          onChange={(e) => setField('decaf_modifier', (e.target.value || null) as DecafModifier | null)}
        >
          <option value="">—</option>
          {DECAF_MODIFIERS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Signature */}
      <div>
        <CanonicalTextInput
          label="Signature method (optional)"
          value={value.signature_method ?? ''}
          onChange={(v) => setField('signature_method', v.trim() ? v : null)}
          registry={SIGNATURE_LOOKUP}
          placeholder="Moonshadow, TyOxidator, Hybrid Washed"
        />
        {signatureEntry && (
          <div className="mt-1 font-mono text-xxs text-latent-mid">
            {signatureEntry.name} is typically {signatureEntry.base} at {signatureEntry.producer}.
          </div>
        )}
      </div>

      {/* Composed preview */}
      <div className="font-mono text-xxs text-latent-mid">
        Saved as: <span className="text-latent-fg">{composeProcess(value) || '—'}</span>
      </div>
    </div>
  )
}

interface ProcessChipsInputProps {
  label: string
  registry: CanonicalLookup
  value: readonly string[]
  onChange: (next: string[]) => void
}

function ProcessChipsInput({ label, registry, value, onChange }: ProcessChipsInputProps) {
  const [input, setInput] = useState('')
  const datalistId = useId()

  const trimmed = input.trim()
  const suggestion = useMemo(() => {
    if (!trimmed || registry.isCanonical(trimmed)) return null
    return registry.findClosest(trimmed)
  }, [trimmed, registry])

  const addChip = (raw: string) => {
    const chip = raw.trim()
    if (!chip) return
    const canonical = registry.isCanonical(chip) ? chip : (registry.findClosest(chip) ?? chip)
    if (value.includes(canonical)) {
      setInput('')
      return
    }
    onChange([...value, canonical])
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
      removeChip(value[value.length - 1])
    }
  }

  return (
    <div>
      <label className="label">{label}</label>
      <div className="border border-latent-border rounded-md bg-white p-2 focus-within:border-latent-fg">
        <div className="flex flex-wrap gap-1.5 items-center">
          {value.map((chip) => {
            const canonical = registry.isCanonical(chip)
            return (
              <span
                key={chip}
                className="font-sans text-xs inline-flex items-center gap-1 px-2 py-1 rounded-full border"
                style={{
                  borderColor: 'var(--latent-fg, #2b2b2b)',
                  color: 'var(--latent-fg, #2b2b2b)',
                  backgroundColor: 'rgba(43,43,43,0.05)',
                  borderStyle: canonical ? 'solid' : 'dashed',
                }}
                title={canonical ? 'Canonical' : 'Not in canonical registry'}
              >
                {chip}
                <button
                  type="button"
                  onClick={() => removeChip(chip)}
                  className="font-mono text-xxs opacity-60 hover:opacity-100"
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
            placeholder={value.length === 0 ? 'Type, press Enter…' : ''}
          />
          <datalist id={datalistId}>
            {registry.list.map((r) => (
              <option key={r} value={r} />
            ))}
          </datalist>
        </div>
      </div>
      {trimmed && !registry.isCanonical(trimmed) && (
        <div className="mt-1 font-mono text-xxs text-amber-700">
          {suggestion
            ? `Not in registry — did you mean "${suggestion}"?`
            : 'Not in registry — add via /add to save.'}
        </div>
      )}
    </div>
  )
}

