'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Brew, Terroir, Cultivar } from '@/lib/types'
import { EXTRACTION_STRATEGIES, seedStructuredProcess } from '@/lib/brew-import'
import { PRODUCER_LOOKUP } from '@/lib/producer-registry'
import { BREWER_LOOKUP } from '@/lib/brewer-registry'
import { FILTER_LOOKUP } from '@/lib/filter-registry'
import { isOverridableValid } from '@/lib/canonical-registry'
import { ROASTER_LOOKUP } from '@/lib/roaster-registry'
import { ROAST_LEVEL_LOOKUP } from '@/lib/roast-level-registry'
import { GRINDER_LOOKUP, isResolvableSetting } from '@/lib/grinder-registry'
import { GrindSettingInput } from '@/components/GrindSettingInput'
import { CULTIVAR_LOOKUP } from '@/lib/cultivar-registry'
import { TERROIR_COUNTRY_LOOKUP, TERROIR_MACRO_LOOKUP } from '@/lib/terroir-registry'
import { composeProcess, structuredProcessColumns, type StructuredProcess } from '@/lib/process-registry'
import { SectionCard } from '@/components/SectionCard'
import { CanonicalTextInput } from '@/components/CanonicalTextInput'
import { SaveGateWarning } from '@/components/SaveGateWarning'
import { FlavorComposer } from '@/components/FlavorComposer'
import { StructureTagsPicker } from '@/components/StructureTagsPicker'
import type { FlavorChip } from '@/lib/flavor-registry'
import { ProcessPicker, isProcessResolvable } from '@/components/ProcessPicker'
import { ModifierComposer } from '@/components/ModifierComposer'
import { cleanModifiers, type Modifier } from '@/lib/extraction-modifiers'

type TerroirOption = Pick<Terroir, 'id' | 'country' | 'admin_region' | 'macro_terroir' | 'meso_terroir'>
type CultivarOption = Pick<Cultivar, 'id' | 'cultivar_name' | 'lineage' | 'genetic_family'>

interface EditBrewFormProps {
  brew: Brew
  terroirs: TerroirOption[]
  cultivars: CultivarOption[]
}

type FormState = {
  coffee_name: string
  roaster: string
  producer: string
  variety: string
  structuredProcess: StructuredProcess
  roast_level: string
  flavors: FlavorChip[]
  structure_tags: string[]
  country: string
  macro_terroir: string
  meso_terroir: string
  cultivar_name: string
  brewer: string
  filter: string
  dose_g: string
  water_g: string
  grinder: string
  grind_setting: string
  temp_c: string
  bloom: string
  pour_structure: string
  total_time: string
  extraction_strategy: string
  extraction_confirmed: string
  modifiers: Modifier[]
  aroma: string
  attack: string
  mid_palate: string
  body: string
  finish: string
  temperature_evolution: string
  peak_expression: string
  key_takeaways: string[]
  terroir_connection: string
  cultivar_connection: string
  what_i_learned: string
}

function initial(brew: Brew, terroirs: TerroirOption[], cultivars: CultivarOption[]): FormState {
  const currentCultivar = brew.cultivar_id
    ? cultivars.find((c) => c.id === brew.cultivar_id)
    : null
  const currentTerroir = brew.terroir_id
    ? terroirs.find((t) => t.id === brew.terroir_id)
    : null
  return {
    coffee_name: brew.coffee_name ?? '',
    roaster: brew.roaster ?? '',
    producer: brew.producer ?? '',
    variety: brew.variety ?? '',
    structuredProcess: seedStructuredProcess({
      process: brew.process ?? null,
      base_process: brew.base_process as StructuredProcess['base_process'] | undefined,
      subprocess: brew.subprocess as StructuredProcess['subprocess'],
      fermentation_modifiers: brew.fermentation_modifiers ?? undefined,
      drying_modifiers: brew.drying_modifiers ?? undefined,
      intervention_modifiers: brew.intervention_modifiers ?? undefined,
      experimental_modifiers: brew.experimental_modifiers ?? undefined,
      decaf_modifier: brew.decaf_modifier as StructuredProcess['decaf_modifier'],
      signature_method: brew.signature_method ?? null,
    }),
    roast_level: brew.roast_level ?? '',
    flavors: (brew.flavors ?? []) as FlavorChip[],
    structure_tags: brew.structure_tags ?? [],
    country: currentTerroir?.country ?? '',
    macro_terroir: currentTerroir?.macro_terroir ?? '',
    meso_terroir: currentTerroir?.meso_terroir ?? '',
    cultivar_name: currentCultivar?.cultivar_name ?? '',
    brewer: brew.brewer ?? '',
    filter: brew.filter ?? '',
    dose_g: brew.dose_g != null ? String(brew.dose_g) : '',
    water_g: brew.water_g != null ? String(brew.water_g) : '',
    grinder: brew.grinder ?? '',
    grind_setting: brew.grind_setting ?? '',
    temp_c: brew.temp_c != null ? String(brew.temp_c) : '',
    bloom: brew.bloom ?? '',
    pour_structure: brew.pour_structure ?? '',
    total_time: brew.total_time ?? '',
    extraction_strategy: brew.extraction_strategy ?? '',
    extraction_confirmed: brew.extraction_confirmed ?? '',
    modifiers: (() => {
      const r = cleanModifiers(brew.modifiers)
      return r.ok ? r.value : []
    })(),
    aroma: brew.aroma ?? '',
    attack: brew.attack ?? '',
    mid_palate: brew.mid_palate ?? '',
    body: brew.body ?? '',
    finish: brew.finish ?? '',
    temperature_evolution: brew.temperature_evolution ?? '',
    peak_expression: brew.peak_expression ?? '',
    key_takeaways: brew.key_takeaways ?? [],
    terroir_connection: brew.terroir_connection ?? '',
    cultivar_connection: brew.cultivar_connection ?? '',
    what_i_learned: brew.what_i_learned ?? '',
  }
}

export function EditBrewForm({ brew, terroirs, cultivars }: EditBrewFormProps) {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(() => initial(brew, terroirs, cultivars))
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [roasterOverride, setRoasterOverride] = useState(false)
  const [producerOverride, setProducerOverride] = useState(false)
  const [grinderOverride, setGrinderOverride] = useState(false)
  const [brewerOverride, setBrewerOverride] = useState(false)
  const [filterOverride, setFilterOverride] = useState(false)

  const cultivarValid = CULTIVAR_LOOKUP.isResolvable(form.cultivar_name)
  const macroValid = TERROIR_MACRO_LOOKUP.isResolvable(form.macro_terroir)
  const processValid = isProcessResolvable(form.structuredProcess)
  const roasterValid = isOverridableValid(form.roaster, ROASTER_LOOKUP, roasterOverride)
  const producerValid = isOverridableValid(form.producer, PRODUCER_LOOKUP, producerOverride)
  const roastLevelValid = ROAST_LEVEL_LOOKUP.isResolvable(form.roast_level)
  const grinderValid = isOverridableValid(form.grinder, GRINDER_LOOKUP, grinderOverride)
  const grinderCanonical = GRINDER_LOOKUP.canonicalize(form.grinder) ?? form.grinder
  const settingValid = isResolvableSetting(grinderCanonical, form.grind_setting)
  const brewerValid = isOverridableValid(form.brewer, BREWER_LOOKUP, brewerOverride)
  const filterValid = isOverridableValid(form.filter, FILTER_LOOKUP, filterOverride)
  const saveEnabled =
    cultivarValid && macroValid && processValid && roasterValid && producerValid &&
    roastLevelValid && grinderValid && settingValid && brewerValid && filterValid

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    const payload: Record<string, unknown> = {
      coffee_name: form.coffee_name.trim(),
      roaster: form.roaster.trim() || null,
      roaster_override: roasterOverride,
      producer: form.producer.trim() || null,
      producer_override: producerOverride,
      variety: form.variety.trim() || null,
      process: composeProcess(form.structuredProcess) || null,
      ...structuredProcessColumns(form.structuredProcess),
      roast_level: form.roast_level.trim() || null,
      flavors: form.flavors,
      structure_tags: form.structure_tags,
      country: form.country.trim() || null,
      terroir_name: form.macro_terroir.trim(),
      meso_terroir: form.meso_terroir.trim() || null,
      cultivar_name: form.cultivar_name.trim(),
      brewer: form.brewer.trim() || null,
      brewer_override: brewerOverride,
      filter: form.filter.trim() || null,
      filter_override: filterOverride,
      dose_g: form.dose_g ? parseFloat(form.dose_g) : null,
      water_g: form.water_g ? parseFloat(form.water_g) : null,
      grinder: form.grinder.trim() || null,
      grinder_override: grinderOverride,
      grind_setting: form.grind_setting.trim() || null,
      temp_c: form.temp_c ? parseFloat(form.temp_c) : null,
      bloom: form.bloom.trim() || null,
      pour_structure: form.pour_structure.trim() || null,
      total_time: form.total_time.trim() || null,
      extraction_strategy: form.extraction_strategy || null,
      extraction_confirmed: form.extraction_confirmed.trim() || null,
      modifiers: form.modifiers,
      aroma: form.aroma.trim() || null,
      attack: form.attack.trim() || null,
      mid_palate: form.mid_palate.trim() || null,
      body: form.body.trim() || null,
      finish: form.finish.trim() || null,
      temperature_evolution: form.temperature_evolution.trim() || null,
      peak_expression: form.peak_expression.trim() || null,
      key_takeaways: form.key_takeaways,
      terroir_connection: form.terroir_connection.trim() || null,
      cultivar_connection: form.cultivar_connection.trim() || null,
      what_i_learned: form.what_i_learned.trim() || null,
    }

    try {
      const res = await fetch(`/api/brews/${brew.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.errors?.join('; ') || data.error || 'Save failed')
      router.push(`/brews/${brew.id}`)
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed')
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSave}>
      {/* Coffee */}
      <SectionCard title="COFFEE">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="label">Coffee name *</label>
            <input className="input" value={form.coffee_name} onChange={(e) => set('coffee_name', e.target.value)} required />
          </div>
          <CanonicalTextInput
            label="Roaster"
            value={form.roaster}
            onChange={(v) => { set('roaster', v); setRoasterOverride(false) }}
            registry={ROASTER_LOOKUP}
            allowOverride
            overridden={roasterOverride}
            onOverrideChange={setRoasterOverride}
          />
          <CanonicalTextInput
            label="Producer"
            value={form.producer}
            onChange={(v) => { set('producer', v); setProducerOverride(false) }}
            registry={PRODUCER_LOOKUP}
            allowOverride
            overridden={producerOverride}
            onOverrideChange={setProducerOverride}
          />

          <div>
            <label className="label">Variety</label>
            <input className="input" value={form.variety} onChange={(e) => set('variety', e.target.value)} />
          </div>
          <CanonicalTextInput
            label="Roast level"
            value={form.roast_level}
            onChange={(v) => set('roast_level', v)}
            registry={ROAST_LEVEL_LOOKUP}
          />
          <div className="col-span-2">
            <ProcessPicker
              value={form.structuredProcess}
              onChange={(s) => set('structuredProcess', s)}
            />
          </div>
          <div className="col-span-2">
            <FlavorComposer
              value={form.flavors}
              onChange={(v) => set('flavors', v)}
            />
          </div>
          <div className="col-span-2">
            <StructureTagsPicker
              value={form.structure_tags}
              onChange={(v) => set('structure_tags', v)}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="TERROIR & CULTIVAR">
        <div className="grid grid-cols-2 gap-3">
          <CanonicalTextInput
            label="Country"
            value={form.country}
            onChange={(v) => set('country', v)}
            registry={TERROIR_COUNTRY_LOOKUP}
          />
          <CanonicalTextInput
            label="Macro terroir"
            value={form.macro_terroir}
            onChange={(v) => set('macro_terroir', v)}
            registry={TERROIR_MACRO_LOOKUP}
          />
          <div className="col-span-2">
            <label className="label">Meso terroir (free-text)</label>
            <input
              className="input"
              value={form.meso_terroir}
              onChange={(e) => set('meso_terroir', e.target.value)}
            />
          </div>
          <div className="col-span-2">
            <CanonicalTextInput
              label="Cultivar"
              value={form.cultivar_name}
              onChange={(v) => set('cultivar_name', v)}
              registry={CULTIVAR_LOOKUP}
            />
          </div>
          <p className="col-span-2 font-mono text-xxs text-latent-mid">
            Canonical registries: {TERROIR_MACRO_LOOKUP.list.length} macros across {TERROIR_COUNTRY_LOOKUP.list.length} countries, {CULTIVAR_LOOKUP.list.length} cultivars. Aliases resolve on save. For genuinely new entries, use /add.
          </p>
        </div>
      </SectionCard>

      {/* Recipe */}
      <SectionCard title="RECIPE">
        <div className="grid grid-cols-3 gap-3">
          <CanonicalTextInput
            label="Brewer"
            value={form.brewer}
            onChange={(v) => { set('brewer', v); setBrewerOverride(false) }}
            registry={BREWER_LOOKUP}
            allowOverride
            overridden={brewerOverride}
            onOverrideChange={setBrewerOverride}
          />
          <CanonicalTextInput
            label="Filter"
            value={form.filter}
            onChange={(v) => { set('filter', v); setFilterOverride(false) }}
            registry={FILTER_LOOKUP}
            allowOverride
            overridden={filterOverride}
            onOverrideChange={setFilterOverride}
          />
          <CanonicalTextInput
            label="Grinder"
            value={form.grinder}
            onChange={(v) => { set('grinder', v); setGrinderOverride(false) }}
            registry={GRINDER_LOOKUP}
            allowOverride
            overridden={grinderOverride}
            onOverrideChange={setGrinderOverride}
          />
          <GrindSettingInput
            grinderName={grinderCanonical}
            value={form.grind_setting}
            onChange={(v) => set('grind_setting', v)}
          />
          <div>
            <label className="label">Dose (g)</label>
            <input className="input" type="number" step="0.1" value={form.dose_g} onChange={(e) => set('dose_g', e.target.value)} />
          </div>
          <div>
            <label className="label">Water (g)</label>
            <input className="input" type="number" step="1" value={form.water_g} onChange={(e) => set('water_g', e.target.value)} />
          </div>
          <div>
            <label className="label">Temp (°C)</label>
            <input className="input" type="number" step="0.1" value={form.temp_c} onChange={(e) => set('temp_c', e.target.value)} />
          </div>
          <div>
            <label className="label">Bloom</label>
            <input className="input" value={form.bloom} onChange={(e) => set('bloom', e.target.value)} />
          </div>
          <div>
            <label className="label">Pour structure</label>
            <input className="input" value={form.pour_structure} onChange={(e) => set('pour_structure', e.target.value)} />
          </div>
          <div>
            <label className="label">Total time</label>
            <input className="input" value={form.total_time} onChange={(e) => set('total_time', e.target.value)} />
          </div>
        </div>
      </SectionCard>

      {/* Extraction */}
      <SectionCard title="EXTRACTION">
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="label">Extraction strategy</label>
            <select
              className="input"
              value={form.extraction_strategy}
              onChange={(e) => set('extraction_strategy', e.target.value)}
            >
              <option value="">—</option>
              {EXTRACTION_STRATEGIES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Extraction confirmed (only if it diverged from plan)</label>
            <textarea
              className="textarea"
              rows={2}
              value={form.extraction_confirmed}
              onChange={(e) => set('extraction_confirmed', e.target.value)}
            />
          </div>
          <ModifierComposer
            value={form.modifiers}
            onChange={(next) => set('modifiers', next)}
          />
        </div>
      </SectionCard>

      {/* Sensory */}
      <SectionCard title="SENSORY">
        <div className="grid grid-cols-1 gap-3">
          {([
            ['aroma', 'Aroma'],
            ['attack', 'Attack'],
            ['mid_palate', 'Mid palate'],
            ['body', 'Body'],
            ['finish', 'Finish'],
            ['temperature_evolution', 'Temperature evolution'],
            ['peak_expression', 'Peak expression'],
          ] as const).map(([key, label]) => (
            <div key={key}>
              <label className="label">{label}</label>
              <textarea
                className="textarea"
                rows={2}
                value={form[key]}
                onChange={(e) => set(key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Learnings */}
      <SectionCard title="LEARNINGS">
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="label">What I learned from this coffee</label>
            <textarea
              className="textarea"
              rows={6}
              value={form.what_i_learned}
              onChange={(e) => set('what_i_learned', e.target.value)}
            />
          </div>
          <div>
            <label className="label">Terroir connection</label>
            <textarea
              className="textarea"
              rows={3}
              value={form.terroir_connection}
              onChange={(e) => set('terroir_connection', e.target.value)}
            />
          </div>
          <div>
            <label className="label">Cultivar connection</label>
            <textarea
              className="textarea"
              rows={3}
              value={form.cultivar_connection}
              onChange={(e) => set('cultivar_connection', e.target.value)}
            />
          </div>
          <KeyTakeawaysEditor
            value={form.key_takeaways}
            onChange={(v) => set('key_takeaways', v)}
          />
        </div>
      </SectionCard>

      {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

      <SaveGateWarning
        requirements={[
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
        ]}
      />

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={() => router.push(`/brews/${brew.id}`)}
          className="btn btn-secondary"
          disabled={isSaving}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSaving || !saveEnabled}>
          {isSaving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}

// Free-text chip input for key_takeaways — simpler than FlavorNotesInput
// (no registry validation, no family tinting). Kept colocated since it's
// only used here.
function KeyTakeawaysEditor({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState('')

  const add = (raw: string) => {
    const t = raw.trim()
    if (!t || value.includes(t)) return
    onChange([...value, t])
    setInput('')
  }

  return (
    <div>
      <label className="label">Key takeaways</label>
      <div className="border border-latent-border rounded-md bg-white p-2 focus-within:border-latent-fg">
        <div className="flex flex-wrap gap-1.5 items-start">
          {value.map((chip) => (
            <span
              key={chip}
              className="font-sans text-xs inline-flex items-center gap-1 px-2 py-1 rounded border border-latent-border bg-latent-bg"
            >
              {chip}
              <button
                type="button"
                onClick={() => onChange(value.filter((c) => c !== chip))}
                className="font-mono text-xxs opacity-60 hover:opacity-100"
                aria-label={`Remove ${chip}`}
              >
                ✕
              </button>
            </span>
          ))}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                add(input)
              } else if (e.key === 'Backspace' && !input && value.length > 0) {
                onChange(value.slice(0, -1))
              }
            }}
            onBlur={() => input.trim() && add(input)}
            placeholder={value.length === 0 ? 'Type a takeaway, press Enter…' : ''}
            className="flex-1 min-w-[10rem] outline-none text-sm font-sans bg-transparent py-1 px-1"
          />
        </div>
      </div>
    </div>
  )
}
