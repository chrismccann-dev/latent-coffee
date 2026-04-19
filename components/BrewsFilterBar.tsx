'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { EXTRACTION_STRATEGIES, getStrategyStyle } from '@/lib/extraction-strategy'
import { PROCESS_FAMILIES, getFamilyColor as getProcessFamilyColor } from '@/lib/process-families'
import { ROASTER_FAMILIES, getFamilyColor as getRoasterFamilyColor } from '@/lib/roaster-registry'

type MultiKey = 'processes' | 'roasters' | 'lineages' | 'macros'
type DimensionKey = 'strategy' | MultiKey

interface BrewsFilterBarProps {
  activeStrategy: string | null
  activeProcesses: string[]
  activeRoasters: string[]
  activeLineages: string[]
  activeMacros: string[]
  allLineages: string[]
  allMacros: string[]
  anyActive: boolean
}

export function BrewsFilterBar({
  activeStrategy,
  activeProcesses,
  activeRoasters,
  activeLineages,
  activeMacros,
  allLineages,
  allMacros,
  anyActive,
}: BrewsFilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const multiActive: Record<MultiKey, string[]> = {
    processes: activeProcesses,
    roasters: activeRoasters,
    lineages: activeLineages,
    macros: activeMacros,
  }

  function updateParam(key: DimensionKey, next: string[] | string | null) {
    const sp = new URLSearchParams(searchParams.toString())
    if (next === null || (Array.isArray(next) && next.length === 0) || next === '') {
      sp.delete(key)
    } else if (Array.isArray(next)) {
      sp.set(key, next.join(','))
    } else {
      sp.set(key, next)
    }
    const qs = sp.toString()
    router.push(qs ? `/brews?${qs}` : '/brews', { scroll: false })
  }

  function toggleSingle(value: string) {
    updateParam('strategy', activeStrategy === value ? null : value)
  }

  function toggleMulti(key: MultiKey, value: string) {
    const current = multiActive[key]
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    updateParam(key, next)
  }

  return (
    <div className="space-y-2 mb-6">
      <DimensionRow label="Strategy">
        {EXTRACTION_STRATEGIES.map((s) => {
          const style = getStrategyStyle(s)!
          return (
            <FilterPill
              key={s}
              label={s}
              active={activeStrategy === s}
              activeBg={style.border}
              activeFg="#fff"
              inactiveBg={style.bg}
              inactiveFg={style.text}
              borderColor={style.border}
              onClick={() => toggleSingle(s)}
            />
          )
        })}
      </DimensionRow>

      <DimensionRow label="Process">
        {PROCESS_FAMILIES.map((p) => {
          const color = getProcessFamilyColor(p)
          return (
            <FilterPill
              key={p}
              label={p}
              active={activeProcesses.includes(p)}
              activeBg={color}
              activeFg="#fff"
              inactiveBg="white"
              inactiveFg={color}
              borderColor={color}
              onClick={() => toggleMulti('processes', p)}
            />
          )
        })}
      </DimensionRow>

      <DimensionRow label="Roaster">
        {ROASTER_FAMILIES.map((r) => {
          const color = getRoasterFamilyColor(r)
          return (
            <FilterPill
              key={r}
              label={r}
              active={activeRoasters.includes(r)}
              activeBg={color}
              activeFg="#fff"
              inactiveBg="white"
              inactiveFg={color}
              borderColor={color}
              onClick={() => toggleMulti('roasters', r)}
            />
          )
        })}
      </DimensionRow>

      <DimensionRow label="Origin">
        <FilterPopover
          label="Lineage"
          options={allLineages}
          active={activeLineages}
          onToggle={(v) => toggleMulti('lineages', v)}
          onClear={() => updateParam('lineages', null)}
        />
        <FilterPopover
          label="Macro"
          options={allMacros}
          active={activeMacros}
          onToggle={(v) => toggleMulti('macros', v)}
          onClear={() => updateParam('macros', null)}
        />
        {anyActive && (
          <button
            type="button"
            onClick={() => router.push('/brews', { scroll: false })}
            className="font-mono text-xxs tracking-wide uppercase text-latent-mid hover:text-latent-fg transition-colors ml-2"
          >
            Clear all
          </button>
        )}
      </DimensionRow>
    </div>
  )
}

function DimensionRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-mono text-xxs tracking-wide uppercase text-latent-mid mr-1 w-16 flex-shrink-0">
        {label}
      </span>
      {children}
    </div>
  )
}

interface FilterPillProps {
  label: string
  active: boolean
  activeBg: string
  activeFg: string
  inactiveBg: string
  inactiveFg: string
  borderColor: string
  onClick: () => void
}

function FilterPill({
  label, active, activeBg, activeFg, inactiveBg, inactiveFg, borderColor, onClick,
}: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="font-mono text-xxs font-semibold tracking-wide uppercase px-3 py-1.5 rounded border transition-colors"
      style={
        active
          ? { backgroundColor: activeBg, color: activeFg, borderColor: borderColor }
          : { backgroundColor: inactiveBg, color: inactiveFg, borderColor: borderColor }
      }
    >
      {label}
    </button>
  )
}

interface FilterPopoverProps {
  label: string
  options: string[]
  active: string[]
  onToggle: (value: string) => void
  onClear: () => void
}

function FilterPopover({ label, options, active, onToggle, onClear }: FilterPopoverProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const activeCount = active.length

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`font-mono text-xxs font-semibold tracking-wide uppercase px-3 py-1.5 rounded border transition-colors flex items-center gap-1.5 ${
          activeCount > 0
            ? 'bg-latent-fg text-white border-latent-fg'
            : 'bg-white text-latent-mid border-latent-border hover:border-latent-fg'
        }`}
      >
        <span>{label}</span>
        {activeCount > 0 && (
          <span className="font-mono text-chip bg-white/20 rounded px-1 py-0.5">
            {activeCount}
          </span>
        )}
        <span aria-hidden>{open ? '▴' : '▾'}</span>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-latent-border rounded shadow-lg min-w-[220px] max-h-[320px] flex flex-col">
          <div className="flex-1 overflow-y-auto py-1">
            {options.length === 0 ? (
              <div className="px-3 py-2 font-mono text-xxs text-latent-mid">
                No options
              </div>
            ) : (
              options.map((opt) => {
                const isActive = active.includes(opt)
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => onToggle(opt)}
                    className="w-full text-left px-3 py-1.5 font-sans text-xs hover:bg-latent-highlight transition-colors flex items-center gap-2"
                  >
                    <span
                      className={`w-3 h-3 rounded-sm border flex-shrink-0 flex items-center justify-center ${
                        isActive
                          ? 'bg-latent-fg border-latent-fg'
                          : 'bg-white border-latent-border'
                      }`}
                    >
                      {isActive && (
                        <span className="text-white text-[8px] leading-none">✓</span>
                      )}
                    </span>
                    <span className="truncate">{opt}</span>
                  </button>
                )
              })
            )}
          </div>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="border-t border-latent-border px-3 py-2 font-mono text-xxs tracking-wide uppercase text-latent-mid hover:text-latent-fg text-left transition-colors"
            >
              Clear {label}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
