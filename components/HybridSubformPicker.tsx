'use client'

import { HYBRID_SUBFORM_ENTRIES, type HybridSubform } from '@/lib/hybrid-subform'

interface HybridSubformPickerProps {
  value: string | null | undefined
  onChange: (next: HybridSubform | null) => void
  // Optional label override (default 'Hybrid sub-form'). Pass empty string to omit.
  label?: string
}

/** Conditional sub-form picker for the Hybrid extraction strategy (v8.4).
 *  Render only when extraction_strategy === 'Hybrid'; the parent form is
 *  responsible for the conditional. Selecting null is permitted at the field
 *  level but the save-gate in the parent must require non-null when strategy
 *  is Hybrid.
 *
 *  The description for the currently-selected sub-form renders below the
 *  select as a small mono-uppercase hint, mirroring the GreenBeanHint /
 *  RESOLVED-block pattern used elsewhere in the form chrome. */
export function HybridSubformPicker({ value, onChange, label = 'Hybrid sub-form' }: HybridSubformPickerProps) {
  const current = HYBRID_SUBFORM_ENTRIES.find((e) => e.id === value) ?? null
  return (
    <div>
      {label && <label className="label">{label}</label>}
      <select
        className="input"
        value={value ?? ''}
        onChange={(e) => {
          const v = e.target.value
          onChange(v === '' ? null : (v as HybridSubform))
        }}
      >
        <option value="">Select sub-form…</option>
        {HYBRID_SUBFORM_ENTRIES.map((entry) => (
          <option key={entry.id} value={entry.id}>{entry.label}</option>
        ))}
      </select>
      {current && (
        <div className="mt-1 font-mono text-xxs text-latent-mid leading-relaxed">
          {current.description}
        </div>
      )}
      {!current && (
        <div className="mt-1 font-mono text-xxs text-latent-mid">
          Required when extraction strategy is Hybrid.
        </div>
      )}
    </div>
  )
}
