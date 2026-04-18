'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Brew, Terroir, Cultivar } from '@/lib/types'
import { EXTRACTION_STRATEGIES } from '@/lib/brew-import'
import { SectionCard } from '@/components/SectionCard'
import { FlavorNotesInput } from '@/components/FlavorNotesInput'

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
  process: string
  roast_level: string
  flavor_notes: string[]
  terroir_id: string
  cultivar_id: string
  brewer: string
  filter: string
  dose_g: string
  water_g: string
  grind: string
  temp_c: string
  bloom: string
  pour_structure: string
  total_time: string
  extraction_strategy: string
  extraction_confirmed: string
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

function initial(brew: Brew): FormState {
  return {
    coffee_name: brew.coffee_name ?? '',
    roaster: brew.roaster ?? '',
    producer: brew.producer ?? '',
    variety: brew.variety ?? '',
    process: brew.process ?? '',
    roast_level: brew.roast_level ?? '',
    flavor_notes: brew.flavor_notes ?? [],
    terroir_id: brew.terroir_id ?? '',
    cultivar_id: brew.cultivar_id ?? '',
    brewer: brew.brewer ?? '',
    filter: brew.filter ?? '',
    dose_g: brew.dose_g != null ? String(brew.dose_g) : '',
    water_g: brew.water_g != null ? String(brew.water_g) : '',
    grind: brew.grind ?? '',
    temp_c: brew.temp_c != null ? String(brew.temp_c) : '',
    bloom: brew.bloom ?? '',
    pour_structure: brew.pour_structure ?? '',
    total_time: brew.total_time ?? '',
    extraction_strategy: brew.extraction_strategy ?? '',
    extraction_confirmed: brew.extraction_confirmed ?? '',
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

function terroirLabel(t: TerroirOption): string {
  const parts = [t.country, t.admin_region, t.macro_terroir || t.meso_terroir].filter(Boolean)
  return parts.join(' → ')
}

function cultivarLabel(c: CultivarOption): string {
  return c.lineage ? `${c.cultivar_name} (${c.lineage})` : c.cultivar_name
}

export function EditBrewForm({ brew, terroirs, cultivars }: EditBrewFormProps) {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(() => initial(brew))
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      producer: form.producer.trim() || null,
      variety: form.variety.trim() || null,
      process: form.process.trim() || null,
      roast_level: form.roast_level.trim() || null,
      flavor_notes: form.flavor_notes,
      terroir_id: form.terroir_id || null,
      cultivar_id: form.cultivar_id || null,
      brewer: form.brewer.trim() || null,
      filter: form.filter.trim() || null,
      dose_g: form.dose_g ? parseFloat(form.dose_g) : null,
      water_g: form.water_g ? parseFloat(form.water_g) : null,
      grind: form.grind.trim() || null,
      temp_c: form.temp_c ? parseFloat(form.temp_c) : null,
      bloom: form.bloom.trim() || null,
      pour_structure: form.pour_structure.trim() || null,
      total_time: form.total_time.trim() || null,
      extraction_strategy: form.extraction_strategy || null,
      extraction_confirmed: form.extraction_confirmed.trim() || null,
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
          <div>
            <label className="label">Roaster</label>
            <input className="input" value={form.roaster} onChange={(e) => set('roaster', e.target.value)} />
          </div>
          <div>
            <label className="label">Producer</label>
            <input className="input" value={form.producer} onChange={(e) => set('producer', e.target.value)} />
          </div>
          <div>
            <label className="label">Variety</label>
            <input className="input" value={form.variety} onChange={(e) => set('variety', e.target.value)} />
          </div>
          <div>
            <label className="label">Process</label>
            <input className="input" value={form.process} onChange={(e) => set('process', e.target.value)} />
          </div>
          <div>
            <label className="label">Roast level</label>
            <input className="input" value={form.roast_level} onChange={(e) => set('roast_level', e.target.value)} />
          </div>
          <div className="col-span-2">
            <FlavorNotesInput
              value={form.flavor_notes}
              onChange={(v) => set('flavor_notes', v)}
              label="Flavor notes"
            />
          </div>
        </div>
      </SectionCard>

      {/* Classification (read-only selects) */}
      <SectionCard title="TERROIR & CULTIVAR">
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="label">Terroir (select from existing)</label>
            <select
              className="input"
              value={form.terroir_id}
              onChange={(e) => set('terroir_id', e.target.value)}
            >
              <option value="">—</option>
              {terroirs.map((t) => (
                <option key={t.id} value={t.id}>{terroirLabel(t)}</option>
              ))}
            </select>
            <p className="font-mono text-xxs text-latent-mid mt-1">
              Creating new terroirs is out of scope here — use /add for a new terroir.
            </p>
          </div>
          <div>
            <label className="label">Cultivar (select from existing)</label>
            <select
              className="input"
              value={form.cultivar_id}
              onChange={(e) => set('cultivar_id', e.target.value)}
            >
              <option value="">—</option>
              {cultivars.map((c) => (
                <option key={c.id} value={c.id}>{cultivarLabel(c)}</option>
              ))}
            </select>
          </div>
        </div>
      </SectionCard>

      {/* Recipe */}
      <SectionCard title="RECIPE">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="label">Brewer</label>
            <input className="input" value={form.brewer} onChange={(e) => set('brewer', e.target.value)} />
          </div>
          <div>
            <label className="label">Filter</label>
            <input className="input" value={form.filter} onChange={(e) => set('filter', e.target.value)} />
          </div>
          <div>
            <label className="label">Grind</label>
            <input className="input" value={form.grind} onChange={(e) => set('grind', e.target.value)} />
          </div>
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

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={() => router.push(`/brews/${brew.id}`)}
          className="btn btn-secondary"
          disabled={isSaving}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSaving}>
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
