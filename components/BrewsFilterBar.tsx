'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { FilterTrigger } from '@/components/IndexList'
import { EXTRACTION_STRATEGIES, getStrategyStyle } from '@/lib/extraction-strategy'
import { getDisplayName } from '@/lib/roaster-registry'

// Sub-sprint 4c Bundle B (2026-05-28): collapsed the 4-dimension family-level
// filter set (Strategy / Process family / Roaster family / Origin) to TWO
// filters per Chris's audit — he doesn't filter by family, he recalls coffees
// by the specific roaster ("that Picolot coffee"). Kept the Strategy pills
// (already worked, cheap to keep) + replaced the roaster-FAMILY row with a
// by-INDIVIDUAL-roaster popover. Process + Origin (Lineage/Macro) rows removed
// — that family-level slicing lives on the aggregation pages
// (/processes, /terroirs, /cultivars).

interface BrewsFilterBarProps {
  activeStrategy: string | null
  activeRoasters: string[]   // individual canonical roaster names
  allRoasters: string[]      // distinct canonical roaster names with >=1 brew
  anyActive: boolean
}

export function BrewsFilterBar({
  activeStrategy,
  activeRoasters,
  allRoasters,
  anyActive,
}: BrewsFilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function updateParam(key: 'strategy' | 'roasters', next: string[] | string | null) {
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

  function toggleStrategy(value: string) {
    updateParam('strategy', activeStrategy === value ? null : value)
  }

  function toggleRoaster(value: string) {
    const next = activeRoasters.includes(value)
      ? activeRoasters.filter((v) => v !== value)
      : [...activeRoasters, value]
    updateParam('roasters', next)
  }

  const [mobileOpen, setMobileOpen] = useState(false)
  const totalActive = (activeStrategy ? 1 : 0) + activeRoasters.length

  // Chrome @media exception (grilling-queue 52, ratified 2026-06-11): the
  // FILTERS disclosure collapses at lg: (1024) per the two-point 390/1024
  // model — viewport chrome uses Tailwind @media, not container queries.
  return (
    <div className="mb-6">
      <div className="lg:hidden mb-2">
        <FilterTrigger
          label="Filters"
          activeCount={totalActive}
          open={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        />
      </div>
      <div className={`${mobileOpen ? 'block' : 'hidden'} lg:block space-y-2`}>
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
                onClick={() => toggleStrategy(s)}
              />
            )
          })}
        </DimensionRow>

        <DimensionRow label="Roaster">
          <FilterPopover
            label="Roaster"
            options={allRoasters}
            active={activeRoasters}
            formatOption={(v) => getDisplayName(v) ?? v}
            onToggle={toggleRoaster}
            onClear={() => updateParam('roasters', null)}
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
    </div>
  )
}

function DimensionRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-mono text-xxs tracking-wide uppercase text-latent-mid mr-1">
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
  formatOption?: (value: string) => string
}

function FilterPopover({ label, options, active, onToggle, onClear, formatOption }: FilterPopoverProps) {
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
      <FilterTrigger
        label={label}
        activeCount={activeCount}
        open={open}
        onClick={() => setOpen((v) => !v)}
      />

      {/* Popover is left-anchored on every breakpoint (was right-0 on mobile, which
          pushed its left edge to ~-43px on a 390 viewport — names clipped per Chris's
          mobile pass MB-1, 2026-05-30). The trigger sits near the left of the filter
          row, so left-0 + the viewport width clamp keeps it on-screen. */}
      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-latent-border rounded shadow-lg min-w-[220px] max-w-[calc(100vw-3rem)] max-h-[320px] flex flex-col">
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
                    <span className="truncate">{formatOption ? formatOption(opt) : opt}</span>
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
