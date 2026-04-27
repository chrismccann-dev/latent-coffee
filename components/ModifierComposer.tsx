'use client'

import { useId, useRef, useState } from 'react'
import {
  MODIFIER_TYPES,
  OUTPUT_SELECTION_FORMS,
  emptyModifier,
  modifierTypeLabel,
  outputSelectionFormLabel,
  type Modifier,
  type ModifierType,
  type OutputSelectionModifier,
  type InvertedTemperatureStagingModifier,
  type AromaCaptureModifier,
  type ImmersionModifier,
} from '@/lib/extraction-modifiers'

interface ModifierComposerProps {
  value: Modifier[]
  onChange: (next: Modifier[]) => void
  label?: string
}

interface RowState {
  key: number
  modifier: Modifier
}

export function ModifierComposer({ value, onChange, label = 'Modifiers' }: ModifierComposerProps) {
  const keyCounter = useRef(0)
  const nextKey = () => ++keyCounter.current
  const [rows, setRows] = useState<RowState[]>(() =>
    value.map(m => ({ key: nextKey(), modifier: m }))
  )
  const [pickerType, setPickerType] = useState<ModifierType | ''>('')
  const datalistId = useId()

  function syncRows(next: RowState[]) {
    setRows(next)
    onChange(next.map(r => r.modifier))
  }

  function addModifier(type: ModifierType) {
    syncRows([...rows, { key: nextKey(), modifier: emptyModifier(type) }])
    setPickerType('')
  }

  function removeRow(key: number) {
    syncRows(rows.filter(r => r.key !== key))
  }

  function updateRow(key: number, mutator: (m: Modifier) => Modifier) {
    syncRows(rows.map(r => r.key === key ? { ...r, modifier: mutator(r.modifier) } : r))
  }

  return (
    <div>
      <label className="label">{label}</label>
      <div className="space-y-2">
        {rows.map(r => (
          <ModifierRow
            key={r.key}
            modifier={r.modifier}
            onChange={(next) => updateRow(r.key, () => next)}
            onRemove={() => removeRow(r.key)}
          />
        ))}
        <div className="flex items-center gap-2">
          <select
            className="input"
            value={pickerType}
            onChange={(e) => {
              const t = e.target.value as ModifierType | ''
              if (t) addModifier(t)
            }}
          >
            <option value="">+ Add modifier…</option>
            {MODIFIER_TYPES.map(t => (
              <option key={t} value={t}>{modifierTypeLabel(t)}</option>
            ))}
          </select>
        </div>
        <datalist id={datalistId} />
      </div>
      <div className="mt-1 font-mono text-xxs text-latent-mid">
        {rows.length === 0
          ? 'Modifiers are optional. Most brews have none.'
          : `${rows.length} modifier${rows.length === 1 ? '' : 's'}`}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Per-type row renderer
// ---------------------------------------------------------------------------

interface ModifierRowProps {
  modifier: Modifier
  onChange: (next: Modifier) => void
  onRemove: () => void
}

function ModifierRow({ modifier, onChange, onRemove }: ModifierRowProps) {
  return (
    <div className="border border-latent-border rounded-md bg-white">
      <div className="flex items-center justify-between p-2 border-b border-latent-border bg-latent-bg/40">
        <span className="font-mono text-xxs uppercase text-latent-mid">
          {modifierTypeLabel(modifier.type)}
        </span>
        <button
          type="button"
          onClick={onRemove}
          className="font-mono text-xxs text-latent-mid hover:text-latent-fg"
          aria-label={`Remove ${modifierTypeLabel(modifier.type)}`}
        >
          ✕ Remove
        </button>
      </div>
      <div className="p-2">
        {modifier.type === 'output_selection' && (
          <OutputSelectionFields modifier={modifier} onChange={onChange} />
        )}
        {modifier.type === 'inverted_temperature_staging' && (
          <InvertedTempFields modifier={modifier} onChange={onChange} />
        )}
        {modifier.type === 'aroma_capture' && (
          <AromaCaptureFields modifier={modifier} onChange={onChange} />
        )}
        {modifier.type === 'immersion' && (
          <ImmersionFields modifier={modifier} onChange={onChange} />
        )}
      </div>
    </div>
  )
}

function OutputSelectionFields({
  modifier,
  onChange,
}: {
  modifier: OutputSelectionModifier
  onChange: (next: Modifier) => void
}) {
  const update = (patch: Partial<OutputSelectionModifier>) => onChange({ ...modifier, ...patch })
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="font-mono text-xxs uppercase text-latent-mid">Form</label>
          <select
            className="input mt-0.5"
            value={modifier.form}
            onChange={(e) => update({ form: e.target.value as OutputSelectionModifier['form'] })}
          >
            {OUTPUT_SELECTION_FORMS.map(f => (
              <option key={f} value={f}>{outputSelectionFormLabel(f)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-mono text-xxs uppercase text-latent-mid">Brew weight (g)</label>
          <input
            type="number"
            className="input mt-0.5"
            value={modifier.brew_weight ?? ''}
            onChange={(e) => update({ brew_weight: e.target.value === '' ? null : Number(e.target.value) })}
            placeholder="e.g. 288"
          />
        </div>
        <div>
          <label className="font-mono text-xxs uppercase text-latent-mid">Cup yield (g)</label>
          <input
            type="number"
            className="input mt-0.5"
            value={modifier.cup_yield ?? ''}
            onChange={(e) => update({ cup_yield: e.target.value === '' ? null : Number(e.target.value) })}
            placeholder="e.g. 245"
          />
        </div>
      </div>
      <div>
        <label className="font-mono text-xxs uppercase text-latent-mid">Notes</label>
        <input
          className="input mt-0.5"
          value={modifier.notes ?? ''}
          onChange={(e) => update({ notes: e.target.value || null })}
          placeholder="e.g. discarded first 8g + last 37g"
        />
      </div>
    </div>
  )
}

function InvertedTempFields({
  modifier,
  onChange,
}: {
  modifier: InvertedTemperatureStagingModifier
  onChange: (next: Modifier) => void
}) {
  return (
    <div>
      <label className="font-mono text-xxs uppercase text-latent-mid">Phases</label>
      <input
        className="input mt-0.5"
        value={modifier.phases ?? ''}
        onChange={(e) => onChange({ ...modifier, phases: e.target.value || null })}
        placeholder="e.g. 86°C → 92°C across two phases"
      />
    </div>
  )
}

function AromaCaptureFields({
  modifier,
  onChange,
}: {
  modifier: AromaCaptureModifier
  onChange: (next: Modifier) => void
}) {
  return (
    <div>
      <label className="font-mono text-xxs uppercase text-latent-mid">Application</label>
      <input
        className="input mt-0.5"
        value={modifier.application ?? ''}
        onChange={(e) => onChange({ ...modifier, application: e.target.value || null })}
        placeholder="e.g. Paragon ball on bloom + Pour 1"
      />
    </div>
  )
}

function ImmersionFields({
  modifier,
  onChange,
}: {
  modifier: ImmersionModifier
  onChange: (next: Modifier) => void
}) {
  return (
    <div>
      <label className="font-mono text-xxs uppercase text-latent-mid">Application</label>
      <input
        className="input mt-0.5"
        value={modifier.application ?? ''}
        onChange={(e) => onChange({ ...modifier, application: e.target.value || null })}
        placeholder="e.g. Switch closed 0-1:30, opened for 1:30-3:00 percolation finish"
      />
    </div>
  )
}
