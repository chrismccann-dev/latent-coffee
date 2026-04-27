'use client'

import { useId, useRef, useState } from 'react'
import {
  ALIAS_MAP,
  BASE_FLAVORS,
  BASE_FLAVOR_LOOKUP,
  FLAVOR_MODIFIERS,
  composeFlavorNote,
  decomposeFlavorNote,
  getCategoryFamily,
  getFamilyColor,
  getBaseEntry,
  isTeaBase,
  type FlavorChip,
} from '@/lib/flavor-registry'

interface FlavorComposerProps {
  value: FlavorChip[]
  onChange: (next: FlavorChip[]) => void
  label?: string
}

interface ChipState {
  key: number
  chip: FlavorChip
  expanded: boolean
  baseInput: string
  baseOverride: boolean
}

interface ModifierOption { name: string; description?: string }

// Module-level pre-computes — input data is constant. Hoisting drops the
// per-mount useMemo overhead and keeps these arrays interned.
const AUTOCOMPLETE_OPTIONS: string[] = (() => {
  const baseNames = BASE_FLAVORS.map(b => b.name)
  const aliasKeys = Object.keys(ALIAS_MAP).map(k => {
    const decomp = ALIAS_MAP[k]
    const tail = decomp.modifiers.length > 0
      ? ` → ${decomp.base} (${decomp.modifiers.join(', ')})`
      : ` → ${decomp.base}`
    return `${k}${tail}`
  })
  return [...baseNames, ...aliasKeys].sort((a, b) => a.localeCompare(b))
})()

const MODIFIER_OPTIONS_DEFAULT: ModifierOption[] = FLAVOR_MODIFIERS
  .map(m => ({ name: m.name, description: m.description }))
  .sort((a, b) => a.name.localeCompare(b.name))

const MODIFIER_OPTIONS_TEA: ModifierOption[] = [
  ...MODIFIER_OPTIONS_DEFAULT,
  ...BASE_FLAVORS
    .filter(b => !isTeaBase(b.name))
    .map(b => ({ name: b.name, description: `${b.category} flavor as Tea modifier` })),
].sort((a, b) => a.name.localeCompare(b.name))

function stripAliasTail(input: string): string {
  const idx = input.indexOf(' → ')
  return idx >= 0 ? input.slice(0, idx) : input
}

function modifierOptions(base: string): ModifierOption[] {
  return isTeaBase(base) ? MODIFIER_OPTIONS_TEA : MODIFIER_OPTIONS_DEFAULT
}

function chipFamily(base: string): string {
  const entry = getBaseEntry(base)
  if (!entry) return 'Other'
  return getCategoryFamily(entry.category, entry.subCategory)
}

export function FlavorComposer({ value, onChange, label = 'Flavor notes' }: FlavorComposerProps) {
  const keyCounter = useRef(0)
  const nextKey = () => ++keyCounter.current
  const [chips, setChips] = useState<ChipState[]>(() => value.map(c => ({
    key: nextKey(),
    chip: c,
    expanded: false,
    baseInput: c.base,
    baseOverride: false,
  })))
  const [newInput, setNewInput] = useState('')
  const datalistId = useId()

  function syncChips(next: ChipState[]) {
    setChips(next)
    onChange(next.map(c => c.chip))
  }

  function addChipFromInput(raw: string) {
    const trimmed = stripAliasTail(raw).trim()
    if (!trimmed) return

    const resolved = decomposeFlavorNote(trimmed)
    if (resolved) {
      syncChips([...chips, {
        key: nextKey(),
        chip: resolved,
        expanded: false,
        baseInput: resolved.base,
        baseOverride: false,
      }])
    } else {
      syncChips([...chips, {
        key: nextKey(),
        chip: { base: trimmed, modifiers: [] },
        expanded: true,
        baseInput: trimmed,
        baseOverride: false,
      }])
    }
    setNewInput('')
  }

  function removeChip(key: number) {
    syncChips(chips.filter(c => c.key !== key))
  }

  function updateChip(key: number, mutator: (c: ChipState) => ChipState) {
    syncChips(chips.map(c => c.key === key ? mutator(c) : c))
  }

  function setBase(key: number, raw: string) {
    const trimmed = stripAliasTail(raw).trim()
    const resolved = decomposeFlavorNote(trimmed)
    updateChip(key, c => ({
      ...c,
      baseInput: trimmed,
      chip: resolved ?? { base: trimmed, modifiers: c.chip.modifiers },
      // Reset baseOverride if newly-resolvable
      baseOverride: resolved ? false : c.baseOverride,
    }))
  }

  function setModifier(key: number, slot: 0 | 1, value: string | null) {
    updateChip(key, c => {
      const mods = [...c.chip.modifiers]
      if (value === null || value.trim() === '') {
        // Clear slot — and clear slot+1 too if clearing slot 0 (no orphan mod)
        if (slot === 0) return { ...c, chip: { ...c.chip, modifiers: [] } }
        return { ...c, chip: { ...c.chip, modifiers: mods.slice(0, slot) } }
      }
      mods[slot] = value
      // Pad if setting slot 1 with no slot 0 (shouldn't happen via UI, but safety)
      while (mods.length <= slot) mods.push('')
      return { ...c, chip: { ...c.chip, modifiers: mods.filter(Boolean) } }
    })
  }

  function toggleExpand(key: number) {
    updateChip(key, c => ({ ...c, expanded: !c.expanded }))
  }

  // Soft save-gate warning per Rule 11: 2-4 flavors total
  const countOk = chips.length >= 2 && chips.length <= 4

  return (
    <div>
      <label className="label">{label}</label>
      <div className="space-y-2">
        {chips.map(c => {
          const family = chipFamily(c.chip.base)
          const color = getFamilyColor(family)
          const isCanonicalBase = BASE_FLAVOR_LOOKUP.isCanonical(c.chip.base)
          const baseNonResolvable = !isCanonicalBase && !decomposeFlavorNote(c.chip.base)
          const showOverrideLink = baseNonResolvable && !c.baseOverride
          const display = composeFlavorNote(c.chip)
          const modOpts = modifierOptions(c.chip.base)

          return (
            <div key={c.key} className="border border-latent-border rounded-md bg-white">
              <div className="flex items-center gap-2 p-2">
                <button
                  type="button"
                  onClick={() => toggleExpand(c.key)}
                  className="font-sans text-xs inline-flex items-center gap-1 px-2 py-1 rounded-full border"
                  style={{
                    borderColor: color,
                    color,
                    backgroundColor: `${color}14`,
                    borderStyle: isCanonicalBase || c.baseOverride ? 'solid' : 'dashed',
                  }}
                  title={`${family} · click to ${c.expanded ? 'collapse' : 'edit'}`}
                >
                  {display}
                  <span className="font-mono text-xxs opacity-60">
                    {c.expanded ? '−' : '✎'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => removeChip(c.key)}
                  className="font-mono text-xxs text-latent-mid hover:text-latent-fg"
                  aria-label={`Remove ${c.chip.base}`}
                >
                  ✕
                </button>
                {isTeaBase(c.chip.base) && (
                  <span className="font-mono text-xxs text-latent-mid">tea-base · modifier accepts flavors</span>
                )}
              </div>
              {c.expanded && (
                <div className="border-t border-latent-border p-2 space-y-2 bg-latent-bg/40">
                  {/* Base typeahead */}
                  <div>
                    <label className="font-mono text-xxs uppercase text-latent-mid">Base</label>
                    <input
                      className="input mt-0.5"
                      list={datalistId}
                      value={c.baseInput}
                      onChange={(e) => setBase(c.key, e.target.value)}
                      placeholder="Pick or type a base flavor"
                    />
                    {baseNonResolvable && (
                      <div className="mt-1 font-mono text-xxs text-amber-700">
                        {`"${c.chip.base}" not in registry — `}
                        {showOverrideLink && (
                          <button
                            type="button"
                            className="underline hover:no-underline"
                            onClick={() => updateChip(c.key, x => ({ ...x, baseOverride: true }))}
                          >
                            Use anyway
                          </button>
                        )}
                        {c.baseOverride && (
                          <span className="text-green-700">using verbatim</span>
                        )}
                      </div>
                    )}
                  </div>
                  {/* Modifier 1 */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-mono text-xxs uppercase text-latent-mid">Modifier 1</label>
                      <select
                        className="input mt-0.5"
                        value={c.chip.modifiers[0] ?? ''}
                        onChange={(e) => setModifier(c.key, 0, e.target.value || null)}
                      >
                        <option value="">— none —</option>
                        {modOpts.map(m => (
                          <option key={m.name} value={m.name} title={m.description}>{m.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-mono text-xxs uppercase text-latent-mid">Modifier 2</label>
                      <select
                        className="input mt-0.5"
                        value={c.chip.modifiers[1] ?? ''}
                        onChange={(e) => setModifier(c.key, 1, e.target.value || null)}
                        disabled={!c.chip.modifiers[0]}
                      >
                        <option value="">— none —</option>
                        {modOpts.map(m => (
                          <option key={m.name} value={m.name} title={m.description}>{m.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
        <div className="flex items-center gap-2">
          <input
            type="text"
            list={datalistId}
            value={newInput}
            onChange={(e) => setNewInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault()
                addChipFromInput(newInput)
              }
            }}
            onBlur={() => newInput.trim() && addChipFromInput(newInput)}
            className="input flex-1"
            placeholder={chips.length === 0 ? 'Type a flavor or alias (e.g. "Blueberry Muffin"), Enter to add' : 'Add another flavor…'}
          />
        </div>
        <datalist id={datalistId}>
          {AUTOCOMPLETE_OPTIONS.map(opt => (
            <option key={opt} value={opt} />
          ))}
        </datalist>
      </div>
      <div className="mt-1 font-mono text-xxs text-latent-mid">
        {chips.length} flavor{chips.length === 1 ? '' : 's'}
        {!countOk && chips.length > 0 && (
          <span className="text-amber-700 ml-2">
            · Rule 11: aim for 2-4 flavors per coffee
          </span>
        )}
        {' · click chip to edit modifiers'}
      </div>
    </div>
  )
}
