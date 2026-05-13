'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  EXTRACTION_STRATEGIES,
  GENETIC_FAMILIES,
  seedStructuredProcess,
  seedStructuredGrind,
  structuredGrindColumns,
  type BrewPayload,
  type TerroirCandidate,
  type CultivarCandidate,
} from '@/lib/brew-import'
import { CULTIVAR_LOOKUP, resolveCultivar } from '@/lib/cultivar-registry'
import {
  TERROIR_MACRO_LOOKUP,
  resolveTerroirMacro,
  getTerroirEntry,
} from '@/lib/terroir-registry'
import { composeProcess, structuredProcessColumns } from '@/lib/process-registry'
import { ROASTER_LOOKUP } from '@/lib/roaster-registry'
import { PRODUCER_LOOKUP } from '@/lib/producer-registry'
import { GRINDER_LOOKUP, isResolvableSetting } from '@/lib/grinder-registry'
import { BREWER_LOOKUP } from '@/lib/brewer-registry'
import { FILTER_LOOKUP } from '@/lib/filter-registry'
import { isOverridableValid } from '@/lib/canonical-registry'
import { GrindSettingInput } from '@/components/GrindSettingInput'
import { ROAST_LEVEL_LOOKUP } from '@/lib/roast-level-registry'
import { CanonicalTextInput } from '@/components/CanonicalTextInput'
import { SaveGateWarning } from '@/components/SaveGateWarning'
import { ProcessPicker, isProcessResolvable } from '@/components/ProcessPicker'
import { FlavorComposer } from '@/components/FlavorComposer'
import { StructureTagsPicker } from '@/components/StructureTagsPicker'
import { ModifierComposer } from '@/components/ModifierComposer'
import { HybridSubformPicker } from '@/components/HybridSubformPicker'
import type { HybridSubform } from '@/lib/hybrid-subform'

// Sub Pages 6.6 (2026-05-13) — /add is now purchased-only. The self-roasted
// branch deprecated; claude.ai via MCP is the canonical writer for every
// roasting-side entity. Legacy ?type=self-roasted URLs replace to /green.
const TOTAL_STEPS = 5

export default function AddPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const legacySelfRoasted = searchParams.get('type') === 'self-roasted'

  // Legacy SR URL — bounce to /green. Page is a client component, so
  // next/navigation `redirect()` isn't applicable here; router.replace runs
  // post-mount.
  useEffect(() => {
    if (legacySelfRoasted) router.replace('/green')
  }, [legacySelfRoasted, router])

  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Per-step paste state (4-step wizard: Bean / Terroir / Cultivar / Brew)
  const [beanTabInput, setBeanTabInput] = useState('')
  const [terroirTabInput, setTerroirTabInput] = useState('')
  const [cultivarTabInput, setCultivarTabInput] = useState('')
  const [brewTabInput, setBrewTabInput] = useState('')
  const [purchasedUseClaude, setPurchasedUseClaude] = useState(true)
  const [purchasedPayload, setPurchasedPayload] = useState<BrewPayload | null>(null)
  const [purchasedTerroirMatch, setPurchasedTerroirMatch] = useState<any>(null)
  const [purchasedCultivarMatch, setPurchasedCultivarMatch] = useState<any>(null)
  const [purchasedDrift, setPurchasedDrift] = useState<any>(null)
  const [purchasedUsedClaude, setPurchasedUsedClaude] = useState(false)
  const [purchasedConfirmTerroir, setPurchasedConfirmTerroir] = useState(false)
  const [purchasedConfirmCultivar, setPurchasedConfirmCultivar] = useState(false)
  const [purchasedRoasterOverride, setPurchasedRoasterOverride] = useState(false)
  const [purchasedProducerOverride, setPurchasedProducerOverride] = useState(false)
  const [purchasedGrinderOverride, setPurchasedGrinderOverride] = useState(false)
  const [purchasedBrewerOverride, setPurchasedBrewerOverride] = useState(false)
  const [purchasedFilterOverride, setPurchasedFilterOverride] = useState(false)

  // Reset all state
  const resetFlow = () => {
    setStep(1)
    setError(null)
    setBeanTabInput('')
    setTerroirTabInput('')
    setCultivarTabInput('')
    setBrewTabInput('')
    setPurchasedPayload(null)
    setPurchasedTerroirMatch(null)
    setPurchasedCultivarMatch(null)
    setPurchasedUsedClaude(false)
    setPurchasedDrift(null)
    setPurchasedConfirmTerroir(false)
    setPurchasedConfirmCultivar(false)
    setPurchasedRoasterOverride(false)
    setPurchasedProducerOverride(false)
    setPurchasedGrinderOverride(false)
    setPurchasedBrewerOverride(false)
    setPurchasedFilterOverride(false)
  }

  // Components
  const StepHeader = ({ num, title }: { num: number; title: string }) => (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        <span className="font-mono text-xxs font-semibold px-2 py-1 rounded bg-latent-accent-light text-white">
          PURCHASED
        </span>
        <span className="font-mono text-xs text-latent-mid">
          Step {num} of {TOTAL_STEPS}
        </span>
      </div>
      <h2 className="font-sans text-xl font-semibold">{title}</h2>
    </div>
  )

  const Progress = () => (
    <div className="flex gap-1 mt-8 justify-center">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${i < step ? 'bg-latent-fg' : 'bg-latent-border'}`}
        />
      ))}
    </div>
  )

  // Render null while the legacy SR URL is being redirected away.
  if (legacySelfRoasted) return null

  // Purchased flow: 4-step wizard (Bean → Terroir → Cultivar → Brew) → Review & save
  // Shared helper: parse a step's paste and merge result into purchasedPayload.
  // Uses "later tab wins" semantics — any non-null field from the new parse
  // overwrites the cumulative payload.
  const parseAndMerge = async (text: string, nextStep: number) => {
    if (!text.trim()) {
      setStep(nextStep)
      return
    }
    setIsProcessing(true)
    setError(null)
    try {
      const res = await fetch('/api/brews/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, useClaude: purchasedUseClaude }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || data.detail || 'Parse failed')
      const incoming = data.parsed || {}
      setPurchasedPayload((prev) => {
        const base: BrewPayload = prev ?? {
          coffee_name: '',
          source: 'purchased',
          terroir: { country: '' },
          cultivar: { cultivar_name: '', species: 'Arabica' },
        }
        // Later tab wins: only overwrite when incoming has a non-null value
        const merged: BrewPayload = { ...base, source: 'purchased' }
        for (const k of Object.keys(incoming)) {
          const v = (incoming as any)[k]
          if (v === null || v === undefined || v === '') continue
          if (k === 'terroir') {
            const t = { ...base.terroir }
            for (const tk of Object.keys(v)) {
              const tv = v[tk]
              if (tv === null || tv === undefined || tv === '') continue
              ;(t as any)[tk] = tv
            }
            merged.terroir = t
          } else if (k === 'cultivar') {
            const c = { ...base.cultivar }
            for (const ck of Object.keys(v)) {
              const cv = v[ck]
              if (cv === null || cv === undefined || cv === '') continue
              ;(c as any)[ck] = cv
            }
            merged.cultivar = c
          } else {
            ;(merged as any)[k] = v
          }
        }
        // Re-seed structured process + grinder fields whenever they arrive
        // or change through the wizard path.
        Object.assign(merged, structuredProcessColumns(seedStructuredProcess(merged)))
        Object.assign(merged, structuredGrindColumns(seedStructuredGrind(merged)))
        return merged
      })
      // Update match + drift every parse; final review step shows cumulative state
      setPurchasedTerroirMatch(data.terroirMatch ?? purchasedTerroirMatch)
      setPurchasedCultivarMatch(data.cultivarMatch ?? purchasedCultivarMatch)
      setPurchasedDrift(data.drift ?? purchasedDrift)
      setPurchasedUsedClaude(data.usedClaude || purchasedUsedClaude)
      setStep(nextStep)
    } catch (err: any) {
      setError(err.message || 'Parse failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const stepFrames: Record<1 | 2 | 3 | 4, { title: string; label: string; placeholder: string; value: string; setter: (v: string) => void }> = {
    1: {
      title: 'Bean details',
      label: 'Paste the Bean tab (Roaster / Coffee Name / Origin / Variety / Process / Producer / Elevation / Roast level / Flavor notes / Link)',
      placeholder: 'Roaster\tCoffee Name\tOrigin\tVariety\tProcess\tProducer\tElevation\tRoast level\tFlavor notes (primary)\tLink\nColibri\tFinca La Reserva Gesha\tCiudad Bolívar, Antioquia, Colombia\tGesha\tAnaerobic Honey\t\t1900–2000 masl\tBalanced Intensity\tWhite grape, honey, green apple\t',
      value: beanTabInput,
      setter: setBeanTabInput,
    },
    2: {
      title: 'Terroir',
      label: 'Paste the Terroir tab (Country / Admin Region / Macro Terroir / Meso Terroir / ...)',
      placeholder: 'Country\tAdmin Region\tMacro Terroir\tMeso Terroir\tMicro Terroir\tContext\tElevation Band\tClimate\tSoil\tFarming Model\tDominant Varieties\tTypical Processing\tCup Profile\tAcidity Character\tBody Character\tWhy It Stands Out\nColombia\tAntioquia\tWestern Andean Cordillera\tCiudad Bolívar highlands\t...',
      value: terroirTabInput,
      setter: setTerroirTabInput,
    },
    3: {
      title: 'Cultivar',
      label: 'Paste the Cultivar tab (Cultivar / Species / Genetic Family / Lineage / ...)',
      placeholder: 'Cultivar\tSpecies\tGenetic Family\tLineage\tGenetic Background\tTypical Origins\t...\nGesha (Colombian selection)\tArabica\tEthiopian Landrace Families\tGesha lineage\t...',
      value: cultivarTabInput,
      setter: setCultivarTabInput,
    },
    4: {
      title: 'Best brew (archived recipe)',
      label: 'Paste the Best Brew tab (Coffee Name / Brewer / Filter / Dose / Water / Grind / Extraction Strategy / Temp / Bloom / Pour Structure / Total Time / Aroma / Attack / Mid-Palate / Body / Finish / Temperature Evolution / Peak Expression / What I learned / Extraction Strategy Confirmed)',
      placeholder: 'Coffee Name\tBrewer\tFilter\tDose\tWater\tGrind\tExtraction Strategy\tTemp\tBloom\tPour Structure\tTotal Time\tAroma\tAttack\tMid-Palate\tBody\tFinish\tTemperature Evolution\tPeak Expression\tWhat I learned from this coffee\tExtraction Strategy Confirmed',
      value: brewTabInput,
      setter: setBrewTabInput,
    },
  }

  if (step === 1 || step === 2 || step === 3 || step === 4) {
    const frame = stepFrames[step as 1 | 2 | 3 | 4]
    const payload = purchasedPayload
    // Inline summary of what's been captured so far
    const summary: Array<[string, string | null | undefined]> = []
    if (step === 1 && payload) {
      summary.push(['Coffee', payload.coffee_name])
      summary.push(['Roaster', payload.roaster])
      summary.push(['Producer', payload.producer])
      summary.push(['Variety', payload.variety])
      summary.push(['Process', payload.process])
      summary.push(['Flavor notes', payload.flavor_notes?.join(', ') || null])
    } else if (step === 2 && payload) {
      summary.push(['Country', payload.terroir?.country])
      summary.push(['Admin region', payload.terroir?.admin_region])
      summary.push(['Macro terroir', payload.terroir?.macro_terroir])
      summary.push(['Meso terroir', payload.terroir?.meso_terroir])
      summary.push([
        'Elevation',
        payload.terroir?.elevation_min != null || payload.terroir?.elevation_max != null
          ? `${payload.terroir?.elevation_min ?? '?'}–${payload.terroir?.elevation_max ?? '?'} m`
          : null,
      ])
    } else if (step === 3 && payload) {
      summary.push(['Cultivar', payload.cultivar?.cultivar_name])
      summary.push(['Species', payload.cultivar?.species])
      summary.push(['Genetic family', payload.cultivar?.genetic_family as string | null])
      summary.push(['Lineage', payload.cultivar?.lineage])
    } else if (step === 4 && payload) {
      summary.push(['Brewer', payload.brewer])
      summary.push(['Dose', payload.dose_g != null ? `${payload.dose_g} g` : null])
      summary.push(['Water', payload.water_g != null ? `${payload.water_g} g` : null])
      summary.push(['Temp', payload.temp_c != null ? `${payload.temp_c} °C` : null])
      summary.push(['Extraction strategy', payload.extraction_strategy as string | null])
      summary.push(['Total time', payload.total_time])
    }
    const hasSummary = summary.some(([, v]) => !!v)

    return (
      <div className="max-w-2xl mx-auto px-6 py-8">
        <button onClick={resetFlow} className="font-mono text-xs text-latent-mid hover:text-latent-fg mb-6">
          ← Start Over
        </button>

        <StepHeader num={step} title={frame.title} />

        <div className="mb-4">
          <label className="label">{frame.label}</label>
          <textarea
            value={frame.value}
            onChange={(e) => frame.setter(e.target.value)}
            className="textarea"
            placeholder={frame.placeholder}
            rows={8}
          />
        </div>

        {step === 1 && (
          <label className="flex items-center gap-2 mb-4 text-sm text-latent-mid">
            <input
              type="checkbox"
              checked={purchasedUseClaude}
              onChange={(e) => setPurchasedUseClaude(e.target.checked)}
            />
            Use Claude to enrich &amp; validate (normalize cultivar names, match to registry)
          </label>
        )}

        {hasSummary && (
          <div className="section-card">
            <div className="label">Captured so far</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {summary
                .filter(([, v]) => !!v)
                .map(([k, v]) => (
                  <div key={k}>
                    <div className="font-mono text-xxs uppercase text-latent-mid">{k}</div>
                    <div>{v}</div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

        <div className="flex gap-3">
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="btn btn-secondary" disabled={isProcessing}>
              ← Back
            </button>
          )}
          <button
            onClick={() => parseAndMerge(frame.value, step + 1)}
            disabled={isProcessing}
            className="btn btn-primary"
          >
            {isProcessing
              ? 'Parsing…'
              : frame.value.trim()
                ? step === 4
                  ? 'Parse & Review →'
                  : 'Parse & Next →'
                : step === 4
                  ? 'Skip → Review'
                  : 'Skip →'}
          </button>
        </div>

        <Progress />
      </div>
    )
  }

  // Step 5: Review & save (final review after the 4 paste steps)
  if (step === 5 && purchasedPayload) {
    const payload = purchasedPayload
    const terroirMatch = purchasedTerroirMatch
    const cultivarMatch = purchasedCultivarMatch

    // Tri-state: existing | new-in-registry | new-not-in-registry
    const terroirState: 'existing' | 'new-registry' | 'new-unknown' = !terroirMatch
      ? 'new-unknown'
      : terroirMatch.isNew === false
        ? 'existing'
        : terroirMatch.inRegistry
          ? 'new-registry'
          : 'new-unknown'
    const cultivarState: 'existing' | 'new-registry' | 'new-unknown' = !cultivarMatch
      ? 'new-unknown'
      : cultivarMatch.isNew === false
        ? 'existing'
        : cultivarMatch.inRegistry
          ? 'new-registry'
          : 'new-unknown'

    const needsTerroirConfirm = terroirState !== 'existing'
    const needsCultivarConfirm = cultivarState !== 'existing'
    const macroValid = TERROIR_MACRO_LOOKUP.isResolvable(payload.terroir.macro_terroir || '')
    const cultivarValid = CULTIVAR_LOOKUP.isResolvable(payload.cultivar.cultivar_name || '')
    const structuredProcess = seedStructuredProcess(payload)
    const processValid = isProcessResolvable(structuredProcess)
    const roasterValid = isOverridableValid(payload.roaster, ROASTER_LOOKUP, purchasedRoasterOverride)
    const producerValid = isOverridableValid(payload.producer, PRODUCER_LOOKUP, purchasedProducerOverride)
    const roastLevelValid = ROAST_LEVEL_LOOKUP.isResolvable(payload.roast_level || '')
    const grinderValid = isOverridableValid(payload.grinder, GRINDER_LOOKUP, purchasedGrinderOverride)
    const grinderCanonical = GRINDER_LOOKUP.canonicalize(payload.grinder || '') ?? payload.grinder ?? ''
    const settingValid = isResolvableSetting(grinderCanonical, payload.grind_setting || '')
    const brewerValid = isOverridableValid(payload.brewer, BREWER_LOOKUP, purchasedBrewerOverride)
    const filterValid = isOverridableValid(payload.filter, FILTER_LOOKUP, purchasedFilterOverride)
    // v8.4 — hybrid_subform required when extraction_strategy='Hybrid'.
    const hybridSubformValid = payload.extraction_strategy === 'Hybrid'
      ? !!payload.hybrid_subform
      : true
    const saveEnabled =
      !!payload.coffee_name?.trim() &&
      !!payload.terroir.country?.trim() &&
      !!payload.cultivar.cultivar_name?.trim() &&
      macroValid &&
      cultivarValid &&
      processValid &&
      roasterValid &&
      producerValid &&
      roastLevelValid &&
      grinderValid &&
      settingValid &&
      brewerValid &&
      filterValid &&
      hybridSubformValid &&
      (!needsTerroirConfirm || purchasedConfirmTerroir) &&
      (!needsCultivarConfirm || purchasedConfirmCultivar)

    const updateField = (key: keyof BrewPayload, value: any) => {
      setPurchasedPayload({ ...payload, [key]: value } as BrewPayload)
    }
    const updateTerroir = (key: keyof TerroirCandidate, value: any) => {
      setPurchasedPayload({ ...payload, terroir: { ...payload.terroir, [key]: value } })
      setPurchasedConfirmTerroir(false)
    }
    const updateCultivar = (key: keyof CultivarCandidate, value: any) => {
      setPurchasedPayload({ ...payload, cultivar: { ...payload.cultivar, [key]: value } })
      setPurchasedConfirmCultivar(false)
    }
    // Auto-populate species / genetic_family / lineage from the rich-shape
    // registry when the typed cultivar name resolves canonically (including
    // via alias). Preserves editability: only overwrites the 3 derived
    // fields, and only when the name actually resolves.
    const updateCultivarName = (next: string) => {
      const entry = resolveCultivar(next)
      setPurchasedPayload({
        ...payload,
        cultivar: {
          ...payload.cultivar,
          cultivar_name: next,
          ...(entry
            ? {
                species: entry.species,
                genetic_family: entry.family,
                lineage: entry.lineage,
              }
            : {}),
        },
      })
      setPurchasedConfirmCultivar(false)
    }
    // Auto-populate admin_region from the registry when the macro resolves
    // and admin_region hasn't been user-edited. Parallel to updateCultivarName.
    const updateMacroTerroir = (next: string) => {
      const country = payload.terroir.country?.trim()
      const entry = country ? getTerroirEntry(country, next) : resolveTerroirMacro(next)
      const adminEmpty = !payload.terroir.admin_region?.trim()
      setPurchasedPayload({
        ...payload,
        terroir: {
          ...payload.terroir,
          macro_terroir: next || null,
          ...(entry && adminEmpty ? { admin_region: entry.admin_region } : {}),
        },
      })
      setPurchasedConfirmTerroir(false)
    }

    const handleSave = async () => {
      setIsProcessing(true)
      setError(null)
      try {
        const res = await fetch('/api/brews/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            payload: {
              ...payload,
              source: 'purchased',
              roaster_override: purchasedRoasterOverride,
              producer_override: purchasedProducerOverride,
              grinder_override: purchasedGrinderOverride,
              brewer_override: purchasedBrewerOverride,
              filter_override: purchasedFilterOverride,
            },
            confirmNewTerroir: purchasedConfirmTerroir,
            confirmNewCultivar: purchasedConfirmCultivar,
          }),
        })
        const data = await res.json()
        if (!res.ok) {
          if (data.error === 'validation') throw new Error(data.errors?.join('; ') || 'validation failed')
          if (data.error === 'confirm_required') throw new Error('Registry confirmation required')
          throw new Error(data.error || 'Save failed')
        }
        router.push(`/brews/${data.brewId}`)
        router.refresh()
      } catch (err: any) {
        setError(err.message || 'Save failed')
      } finally {
        setIsProcessing(false)
      }
    }

    const stateCardClass = (s: string) =>
      s === 'existing'
        ? 'border-latent-highlight-border bg-latent-highlight'
        : s === 'new-registry'
          ? 'border-amber-300 bg-amber-50'
          : 'border-red-300 bg-red-50'
    const stateBadge = (s: string) =>
      s === 'existing'
        ? { label: 'MATCHED EXISTING', class: 'bg-latent-accent text-white' }
        : s === 'new-registry'
          ? { label: 'NEW — IN REGISTRY', class: 'bg-amber-500 text-white' }
          : { label: 'NEW — NOT IN REGISTRY', class: 'bg-red-600 text-white' }

    return (
      <div className="max-w-3xl mx-auto px-6 py-8">
        <button onClick={resetFlow} className="font-mono text-xs text-latent-mid hover:text-latent-fg mb-6">
          ← Start Over
        </button>

        <StepHeader num={5} title="Review & save" />

        {purchasedUsedClaude && (
          <div className="text-xs font-mono text-latent-mid mb-4">
            ✨ Enriched by Claude
          </div>
        )}

        {/* Coffee details */}
        <div className="section-card">
          <div className="label">Coffee details</div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Coffee name</label>
              <input
                className="input"
                value={payload.coffee_name}
                onChange={(e) => updateField('coffee_name', e.target.value)}
              />
            </div>
            <div>
              <CanonicalTextInput
                label="Roaster"
                value={payload.roaster || ''}
                onChange={(v) => {
                  updateField('roaster', v || null)
                  setPurchasedRoasterOverride(false)
                }}
                registry={ROASTER_LOOKUP}
                allowOverride
                overridden={purchasedRoasterOverride}
                onOverrideChange={setPurchasedRoasterOverride}
              />
            </div>
            <div>
              <CanonicalTextInput
                label="Producer"
                value={payload.producer || ''}
                onChange={(v) => {
                  updateField('producer', v || null)
                  setPurchasedProducerOverride(false)
                }}
                registry={PRODUCER_LOOKUP}
                allowOverride
                overridden={purchasedProducerOverride}
                onOverrideChange={setPurchasedProducerOverride}
              />
            </div>
            <div>
              <label className="label">Variety (marketing)</label>
              <input
                className="input"
                value={payload.variety || ''}
                onChange={(e) => updateField('variety', e.target.value || null)}
              />
            </div>
            <div className="col-span-2">
              <ProcessPicker
                value={structuredProcess}
                onChange={(s) => {
                  setPurchasedPayload((prev) => prev ? ({
                    ...prev,
                    ...structuredProcessColumns(s),
                    process: composeProcess(s) || null,
                  }) : prev)
                }}
              />
            </div>
            <div>
              <CanonicalTextInput
                label="Roast level"
                value={payload.roast_level || ''}
                onChange={(v) => updateField('roast_level', v || null)}
                registry={ROAST_LEVEL_LOOKUP}
              />
            </div>
            <div className="md:col-span-2">
              <FlavorComposer
                value={payload.flavors ?? []}
                onChange={(v) => updateField('flavors', v)}
              />
            </div>
            <div className="md:col-span-2">
              <StructureTagsPicker
                value={payload.structure_tags ?? []}
                onChange={(v) => updateField('structure_tags', v)}
              />
            </div>
          </div>
        </div>

        {/* Terroir card */}
        <div className={`border rounded-md p-6 mb-4 ${stateCardClass(terroirState)}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="label !mb-0">Terroir</div>
            <span className={`font-mono text-xxs font-semibold px-2 py-1 rounded ${stateBadge(terroirState).class}`}>
              {stateBadge(terroirState).label}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Country *</label>
              <input
                className="input"
                value={payload.terroir.country}
                onChange={(e) => updateTerroir('country', e.target.value)}
              />
            </div>
            <div>
              <label className="label">Admin region</label>
              <input
                className="input"
                value={payload.terroir.admin_region || ''}
                onChange={(e) => updateTerroir('admin_region', e.target.value || null)}
              />
            </div>
            <div>
              <CanonicalTextInput
                label="Macro terroir"
                value={payload.terroir.macro_terroir || ''}
                onChange={updateMacroTerroir}
                registry={TERROIR_MACRO_LOOKUP}
              />
            </div>
            <div>
              <label className="label">Meso terroir</label>
              <input
                className="input"
                value={payload.terroir.meso_terroir || ''}
                onChange={(e) => updateTerroir('meso_terroir', e.target.value || null)}
              />
            </div>
            <div>
              <label className="label">Elevation min (m)</label>
              <input
                className="input"
                type="number"
                value={payload.terroir.elevation_min ?? ''}
                onChange={(e) =>
                  updateTerroir('elevation_min', e.target.value ? parseInt(e.target.value, 10) : null)
                }
              />
            </div>
            <div>
              <label className="label">Elevation max (m)</label>
              <input
                className="input"
                type="number"
                value={payload.terroir.elevation_max ?? ''}
                onChange={(e) =>
                  updateTerroir('elevation_max', e.target.value ? parseInt(e.target.value, 10) : null)
                }
              />
            </div>
          </div>

          {purchasedDrift?.terroir?.kind && purchasedDrift.terroir.kind !== 'none' && (
            <div className="mt-4 p-3 bg-amber-100 border border-amber-300 rounded text-sm">
              <div className="font-mono text-xs font-semibold text-amber-900 mb-1">
                ⚠ TERROIR DRIFT
              </div>
              <div className="text-amber-900">{purchasedDrift.terroir.message}</div>
              {purchasedDrift.terroir.suggestion && (
                <button
                  type="button"
                  className="mt-2 font-mono text-xs font-semibold px-3 py-1 bg-amber-600 text-white rounded hover:bg-amber-700"
                  onClick={() => {
                    const s = purchasedDrift.terroir.suggestion
                    setPurchasedPayload((prev) => prev ? ({
                      ...prev,
                      terroir: {
                        ...prev.terroir,
                        country: s.country,
                        macro_terroir: s.macro_terroir,
                        admin_region: prev.terroir.admin_region || s.admin_region,
                      },
                    }) : prev)
                    setPurchasedDrift((prev: any) => ({ ...prev, terroir: { kind: 'none' } }))
                  }}
                >
                  Auto-fix to canonical
                </button>
              )}
            </div>
          )}

          {needsTerroirConfirm && (
            <label className="flex items-start gap-2 mt-4 text-sm">
              <input
                type="checkbox"
                checked={purchasedConfirmTerroir}
                onChange={(e) => setPurchasedConfirmTerroir(e.target.checked)}
              />
              <span>
                {terroirState === 'new-registry'
                  ? 'Create this new terroir (matches canonical registry).'
                  : 'Create this new terroir — NOT in the canonical macro-terroir registry. Confirm you want to grow the registry.'}
              </span>
            </label>
          )}
        </div>

        {/* Cultivar card */}
        <div className={`border rounded-md p-6 mb-4 ${stateCardClass(cultivarState)}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="label !mb-0">Cultivar</div>
            <span className={`font-mono text-xxs font-semibold px-2 py-1 rounded ${stateBadge(cultivarState).class}`}>
              {stateBadge(cultivarState).label}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <CanonicalTextInput
              label="Cultivar name *"
              value={payload.cultivar.cultivar_name}
              onChange={updateCultivarName}
              registry={CULTIVAR_LOOKUP}
            />
            <div>
              <label className="label">Species</label>
              <input
                className="input"
                value={payload.cultivar.species || ''}
                onChange={(e) => updateCultivar('species', e.target.value || 'Arabica')}
              />
            </div>
            <div>
              <label className="label">Genetic family</label>
              <select
                className="input"
                value={payload.cultivar.genetic_family || ''}
                onChange={(e) => updateCultivar('genetic_family', e.target.value || null)}
              >
                <option value="">—</option>
                {GENETIC_FAMILIES.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Lineage</label>
              <input
                className="input"
                value={payload.cultivar.lineage || ''}
                onChange={(e) => updateCultivar('lineage', e.target.value || null)}
              />
            </div>
          </div>

          {purchasedDrift?.cultivar?.kind && purchasedDrift.cultivar.kind !== 'none' && (
            <div className="mt-4 p-3 bg-amber-100 border border-amber-300 rounded text-sm">
              <div className="font-mono text-xs font-semibold text-amber-900 mb-1">
                ⚠ CULTIVAR DRIFT
              </div>
              <div className="text-amber-900">{purchasedDrift.cultivar.message}</div>
              {purchasedDrift.cultivar.suggestion && (
                <button
                  type="button"
                  className="mt-2 font-mono text-xs font-semibold px-3 py-1 bg-amber-600 text-white rounded hover:bg-amber-700"
                  onClick={() => {
                    const s = purchasedDrift.cultivar.suggestion
                    setPurchasedPayload((prev) => prev ? ({
                      ...prev,
                      cultivar: {
                        ...prev.cultivar,
                        cultivar_name: s.cultivar_name,
                        genetic_family: s.genetic_family,
                        lineage: s.lineage,
                      },
                    }) : prev)
                    setPurchasedDrift((prev: any) => ({ ...prev, cultivar: { kind: 'none' } }))
                  }}
                >
                  Auto-fix to canonical
                </button>
              )}
            </div>
          )}

          {needsCultivarConfirm && (
            <label className="flex items-start gap-2 mt-4 text-sm">
              <input
                type="checkbox"
                checked={purchasedConfirmCultivar}
                onChange={(e) => setPurchasedConfirmCultivar(e.target.checked)}
              />
              <span>
                {cultivarState === 'new-registry'
                  ? 'Create this new cultivar (matches canonical registry).'
                  : 'Create this new cultivar — NOT in the canonical registry. Confirm you want to grow the registry.'}
              </span>
            </label>
          )}
        </div>

        {/* Recipe */}
        <div className="section-card">
          <div className="label">Recipe</div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <CanonicalTextInput
                label="Brewer"
                value={payload.brewer || ''}
                onChange={(v) => {
                  updateField('brewer', v || null)
                  setPurchasedBrewerOverride(false)
                }}
                registry={BREWER_LOOKUP}
                allowOverride
                overridden={purchasedBrewerOverride}
                onOverrideChange={setPurchasedBrewerOverride}
              />
            </div>
            <div>
              <CanonicalTextInput
                label="Filter"
                value={payload.filter || ''}
                onChange={(v) => {
                  updateField('filter', v || null)
                  setPurchasedFilterOverride(false)
                }}
                registry={FILTER_LOOKUP}
                allowOverride
                overridden={purchasedFilterOverride}
                onOverrideChange={setPurchasedFilterOverride}
              />
            </div>
            <div>
              <CanonicalTextInput
                label="Grinder"
                value={payload.grinder || ''}
                onChange={(v) => {
                  updateField('grinder', v || null)
                  setPurchasedGrinderOverride(false)
                }}
                registry={GRINDER_LOOKUP}
                allowOverride
                overridden={purchasedGrinderOverride}
                onOverrideChange={setPurchasedGrinderOverride}
              />
            </div>
            <div>
              <GrindSettingInput
                grinderName={grinderCanonical}
                value={payload.grind_setting || ''}
                onChange={(v) => updateField('grind_setting', v || null)}
              />
            </div>
            <div>
              <label className="label">Dose (g)</label>
              <input className="input" type="number" step="0.1" value={payload.dose_g ?? ''} onChange={(e) => updateField('dose_g', e.target.value ? parseFloat(e.target.value) : null)} />
            </div>
            <div>
              <label className="label">Water (g)</label>
              <input className="input" type="number" step="1" value={payload.water_g ?? ''} onChange={(e) => updateField('water_g', e.target.value ? parseFloat(e.target.value) : null)} />
            </div>
            <div>
              <label className="label">Temp (°C)</label>
              <input className="input" type="number" step="0.1" value={payload.temp_c ?? ''} onChange={(e) => updateField('temp_c', e.target.value ? parseFloat(e.target.value) : null)} />
            </div>
            <div>
              <label className="label">Bloom</label>
              <input className="input" value={payload.bloom || ''} onChange={(e) => updateField('bloom', e.target.value || null)} />
            </div>
            <div>
              <label className="label">Pour structure</label>
              <input className="input" value={payload.pour_structure || ''} onChange={(e) => updateField('pour_structure', e.target.value || null)} />
            </div>
            <div>
              <label className="label">Total time</label>
              <input className="input" value={payload.total_time || ''} onChange={(e) => updateField('total_time', e.target.value || null)} />
            </div>
            <div className="col-span-3">
              <label className="label">Extraction strategy</label>
              <select
                className="input"
                value={payload.extraction_strategy || ''}
                onChange={(e) => {
                  const next = e.target.value || null
                  // v8.4 — auto-clear hybrid_subform when strategy moves away from Hybrid.
                  setPurchasedPayload({
                    ...payload,
                    extraction_strategy: next,
                    hybrid_subform: next === 'Hybrid' ? payload.hybrid_subform ?? null : null,
                  } as BrewPayload)
                }}
              >
                <option value="">—</option>
                {EXTRACTION_STRATEGIES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            {payload.extraction_strategy === 'Hybrid' && (
              <div className="col-span-3">
                <HybridSubformPicker
                  value={payload.hybrid_subform ?? null}
                  onChange={(next: HybridSubform | null) => updateField('hybrid_subform', next)}
                />
              </div>
            )}
            <div className="col-span-3">
              <label className="label">Extraction confirmed (strategy + explanation)</label>
              <textarea
                className="textarea"
                rows={2}
                value={payload.extraction_confirmed || ''}
                onChange={(e) => updateField('extraction_confirmed', e.target.value || null)}
              />
            </div>
            <div className="col-span-3">
              <label className="label">Cooling-curve target (v8.4 — only when peak window IS the strategy)</label>
              <input
                className="input"
                value={payload.cooling_curve_target || ''}
                onChange={(e) => updateField('cooling_curve_target', e.target.value || null)}
                placeholder='e.g. "40-45°C peak", "evaluate below 50°C". Leave blank for normal cooling progression.'
              />
            </div>
            <div className="col-span-3">
              <ModifierComposer
                value={payload.modifiers ?? []}
                onChange={(next) => updateField('modifiers', next)}
              />
            </div>
          </div>
        </div>

        {/* Sensory */}
        <div className="section-card">
          <div className="label">Sensory</div>
          <div className="grid grid-cols-1 gap-3">
            {(['aroma', 'attack', 'mid_palate', 'body', 'finish', 'temperature_evolution', 'peak_expression'] as const).map(
              (field) => (
                <div key={field}>
                  <label className="label">{field.replace('_', ' ')}</label>
                  <textarea
                    className="textarea"
                    rows={2}
                    value={(payload as any)[field] || ''}
                    onChange={(e) => updateField(field as keyof BrewPayload, e.target.value || null)}
                  />
                </div>
              )
            )}
          </div>
        </div>

        {/* Learnings */}
        <div className="section-card">
          <div className="label">Learnings</div>
          <div>
            <label className="label">What I learned from this coffee</label>
            <textarea
              className="textarea"
              rows={6}
              value={payload.what_i_learned || ''}
              onChange={(e) => updateField('what_i_learned', e.target.value || null)}
            />
          </div>
        </div>

        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

        <SaveGateWarning
          requirements={[
            { met: !!payload.coffee_name?.trim(), message: 'Coffee name is required' },
            { met: !!payload.terroir.country?.trim(), message: 'Terroir country is required' },
            { met: !!payload.cultivar.cultivar_name?.trim(), message: 'Cultivar name is required' },
            { met: macroValid, message: 'Macro terroir is not in the canonical registry' },
            { met: cultivarValid, message: 'Cultivar is not in the canonical registry' },
            { met: processValid, message: 'Process is not fully resolvable' },
            { met: roasterValid, message: 'Roaster is not in the canonical registry — pick from the list or click "Use anyway"' },
            { met: producerValid, message: 'Producer is not in the canonical registry — pick from the list or click "Use anyway"' },
            { met: roastLevelValid, message: 'Roast level is not in the canonical registry' },
            { met: grinderValid, message: 'Grinder is not in the canonical registry — pick from the list or click "Use anyway"' },
            { met: settingValid, message: 'Grind setting is not in the grinder’s valid range' },
            { met: brewerValid, message: 'Brewer is not in the canonical registry — pick from the list or click "Use anyway"' },
            { met: filterValid, message: 'Filter is not in the canonical registry — pick from the list or click "Use anyway"' },
            { met: !needsTerroirConfirm || purchasedConfirmTerroir, message: 'Confirm new terroir below' },
            { met: !needsCultivarConfirm || purchasedConfirmCultivar, message: 'Confirm new cultivar below' },
          ]}
        />

        <div className="flex gap-3">
          <button onClick={() => setStep(4)} className="btn btn-secondary">
            ← Back
          </button>
          <button
            onClick={handleSave}
            disabled={!saveEnabled || isProcessing}
            className="btn btn-primary"
          >
            {isProcessing ? 'Saving…' : 'Save brew'}
          </button>
        </div>

        <Progress />
      </div>
    )
  }

  return null
}
