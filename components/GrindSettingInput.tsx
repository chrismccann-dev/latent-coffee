'use client'

import { useId } from 'react'
import {
  getGrinderEntry,
  getSettingEntry,
  type GrinderSettingEntry,
} from '@/lib/grinder-registry'

interface GrindSettingInputProps {
  grinderName: string | null | undefined
  value: string
  onChange: (v: string) => void
  label?: string
}

// Per-grinder strict setting input. Renders a numeric stepper + datalist
// of the measured settings (subset that carries D50 / zone / extraction
// content) so Chris sees the recommended dial positions during typeahead.
// All 51 valid EG-1 settings (3.0-8.0 by 0.1) save successfully — the
// datalist is a UX hint, not the validation surface.
//
// Grinder-aware: input's `step` / `min` / `max` come from the grinder
// entry's scale config. Click-count grinders (Comandante/ZP6) and notch
// grinders (Niche/Ode) would render with step=1; the EG-1 uses step=0.1.
//
// Falls back to a plain free-text input when grinderName is empty or
// non-canonical so the form remains editable while the grinder picker
// resolves.
export function GrindSettingInput({
  grinderName,
  value,
  onChange,
  label = 'Grind setting',
}: GrindSettingInputProps) {
  const datalistId = useId()
  const grinder = getGrinderEntry(grinderName ?? null)

  if (!grinder) {
    return (
      <div>
        <label className="label">{label}</label>
        <input
          className="input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Pick a grinder first"
        />
      </div>
    )
  }

  const measuredSettings = grinder.validSettings.filter((s) => s.d50 !== undefined || s.status)
  const matchedEntry = getSettingEntry(grinder.name, value)
  const trimmed = value.trim()
  const isResolvable = !trimmed || matchedEntry !== undefined

  return (
    <div>
      <label className="label">{label}</label>
      <input
        className="input"
        type="number"
        step={grinder.settingStep}
        min={grinder.settingMin}
        max={grinder.settingMax}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        list={datalistId}
        placeholder={`${grinder.settingMin}-${grinder.settingMax}`}
      />
      <datalist id={datalistId}>
        {measuredSettings.map((s) => (
          <option key={s.value} value={s.value}>
            {settingHint(s)}
          </option>
        ))}
      </datalist>
      {!isResolvable && (
        <p className="font-mono text-xxs text-amber-700 mt-1">
          Not a canonical setting on the {grinder.name} ({grinder.settingMin}-{grinder.settingMax} in {grinder.settingStep} steps).
        </p>
      )}
      {matchedEntry?.status === 'needs_fresh_measurement' && (
        <p className="font-mono text-xxs text-amber-700 mt-1">
          Measurement pending — D50 reading was contaminated and needs a fresh session.
        </p>
      )}
      {matchedEntry?.status === 'anomalous' && (
        <p className="font-mono text-xxs text-amber-700 mt-1">
          Anomalous: {matchedEntry.extractionBehavior?.toLowerCase()}.
        </p>
      )}
      {matchedEntry?.outOfTypicalRange && !matchedEntry.status && (
        <p className="font-mono text-xxs text-latent-mid mt-1">
          Outside typical range ({grinder.typicalRangeMin}-{grinder.typicalRangeMax}).
        </p>
      )}
    </div>
  )
}

function settingHint(s: GrinderSettingEntry): string {
  if (s.status === 'needs_fresh_measurement') return 'measurement pending'
  if (s.status === 'anomalous') return 'anomalous'
  if (s.zone) return `${s.zone}${s.d50 ? ` · ~${s.d50} µm` : ''}`
  return ''
}
