'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import {
  EXTRACTION_STRATEGIES,
  GENETIC_FAMILIES,
  seedStructuredProcess,
  seedStructuredGrind,
  composeGrind,
  structuredGrindColumns,
  findOrCreateCultivar,
  findOrCreateTerroir,
  type BrewPayload,
  type TerroirCandidate,
  type CultivarCandidate,
} from '@/lib/brew-import'
import { CULTIVAR_LOOKUP, resolveCultivar } from '@/lib/cultivar-registry'
import { TERROIR_COUNTRY_LOOKUP, TERROIR_MACRO_LOOKUP, resolveTerroirMacro, getTerroirEntry } from '@/lib/terroir-registry'
import { composeProcess, structuredProcessColumns, type StructuredProcess } from '@/lib/process-registry'
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

type SourceType = 'self-roasted' | 'purchased' | null

type ParsedTerroir = {
  country?: string
  macroTerroir?: string
  adminRegion?: string
  mesoTerroir?: string
}

type ParsedCultivar = {
  cultivar?: string
}

function GreenBeanHint({ fields }: { fields: Array<[string, string | null | undefined]> }) {
  const populated = fields.filter(([, v]) => v && v.trim().length > 0)
  if (populated.length === 0) return null
  return (
    <div className="mb-6 p-4 bg-latent-highlight border border-latent-highlight-border rounded">
      <div className="font-mono text-xxs font-semibold mb-1 text-latent-mid">FROM GREEN BEAN</div>
      <div className="text-sm">
        {populated.map(([label, value], i) => (
          <span key={label}>
            {i > 0 && ' · '}
            <span className="font-mono text-xxs text-latent-mid">{label}:</span> {value}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function AddPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialType = searchParams.get('type') as SourceType
  
  const supabase = createClient()
  
  // Flow state
  const [sourceType, setSourceType] = useState<SourceType>(initialType)
  const [step, setStep] = useState(initialType ? 2 : 1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form data
  const [greenBeanInput, setGreenBeanInput] = useState('')
  const [roastLogInput, setRoastLogInput] = useState('')
  const [experimentInput, setExperimentInput] = useState('')
  const [cuppingInput, setCuppingInput] = useState('')
  const [learningsInput, setLearningsInput] = useState('')
  const [terroirInput, setTerroirInput] = useState('')
  const [cultivarInput, setCultivarInput] = useState('')
  const [brewInput, setBrewInput] = useState('')
  const [coffeeInput, setCoffeeInput] = useState('')

  // Parsed data
  const [parsedGreenBean, setParsedGreenBean] = useState<any>(null)
  const [parsedRoasts, setParsedRoasts] = useState<any[]>([])
  const [parsedExperiments, setParsedExperiments] = useState<any[]>([])
  const [parsedCuppings, setParsedCuppings] = useState<any[]>([])
  const [parsedLearnings, setParsedLearnings] = useState<any>(null)
  const [parsedTerroir, setParsedTerroir] = useState<ParsedTerroir | null>(null)
  const [parsedCultivar, setParsedCultivar] = useState<ParsedCultivar | null>(null)
  const [parsedBrew, setParsedBrew] = useState<any>(null)
  const [parsedCoffee, setParsedCoffee] = useState<any>(null)

  // Purchased flow state
  const [purchasedInput, setPurchasedInput] = useState('')
  // Per-step paste state (4-step wizard: Bean/Terroir/Cultivar/Brew)
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

  const totalSteps = sourceType === 'self-roasted' ? 9 : 6

  // Reset all state
  const resetFlow = () => {
    setSourceType(null)
    setStep(1)
    setError(null)
    setGreenBeanInput('')
    setRoastLogInput('')
    setExperimentInput('')
    setCuppingInput('')
    setLearningsInput('')
    setTerroirInput('')
    setCultivarInput('')
    setBrewInput('')
    setCoffeeInput('')
    setParsedGreenBean(null)
    setParsedRoasts([])
    setParsedExperiments([])
    setParsedCuppings([])
    setParsedLearnings(null)
    setParsedTerroir(null)
    setParsedCultivar(null)
    setParsedBrew(null)
    setParsedCoffee(null)
    setPurchasedInput('')
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
  }

  // Parse spreadsheet data helper
  const parseSpreadsheet = (input: string): Record<string, string>[] => {
    const lines = input.trim().split('\n')
    if (lines.length < 2) return []
    
    const headers = lines[0].split('\t').map(h => 
      h.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '')
    )
    
    return lines.slice(1).map(line => {
      const values = line.split('\t')
      const row: Record<string, string> = {}
      headers.forEach((h, i) => {
        if (values[i]?.trim()) row[h] = values[i].trim()
      })
      return row
    }).filter(row => Object.keys(row).length > 0)
  }

  // Simple parse for green bean spreadsheet
  const parseGreenBeanSpreadsheet = (input: string) => {
    const rows = parseSpreadsheet(input)
    if (rows.length === 0) return null
    
    const row = rows[0]
    return {
      lotId: row.green_lot_id__unique_key_ || row.lot_id || row.lotid || '',
      name: row.coffee_name || row.name || '',
      producer: row.producer || '',
      origin: row.origin || row.country || '',
      region: row.region || '',
      variety: row.variety || row.cultivar || '',
      process: row.process || '',
      importer: row.importer || '',
      sourceType: row.source_type__importer___roaster___farm_direct_ || row.source_type || '',
      link: row.link || row.url || '',
      purchaseDate: row.purchase_date || '',
      pricePerKg: row.price___kg_ || row.price_per_kg || '',
      moisture: row.moisture___ || row.moisture || '',
      density: row.density__g_l_ || row.density || '',
      quantity: row.total_purchased__g_ || row.quantity || '',
    }
  }

  // Parse roast log spreadsheet
  const parseRoastLogSpreadsheet = (input: string) => {
    const rows = parseSpreadsheet(input)
    return rows.map(row => ({
      batchId: row.roest_batch__ || row.batch_id || row.batch || '',
      roastDate: row.roast_date || row.date || '',
      coffeeName: row.coffee_name || '',
      profileLink: row.roest_graph || row.profile_link || '',
      batchSize: row.green_coffee_weight__g_ || row.batch_size || '',
      roastedWeight: row.roasted_weight__g_ || row.roasted_weight || '',
      weightLoss: row.weight_loss___ || row.weight_loss || '',
      agtron: row.agtron_color || row.agtron || '',
      colorDescription: row.color_description || '',
      yellowingTime: row.yellow_time || row.yellowing_time || '',
      fcStart: row.first_crack_time || row.fc_time || row.fc_start || '',
      fcTemp: row.first_crack_bean_temp__c_ || row.fc_temp || '',
      dropTime: row.drop_time || '',
      dropTemp: row.drop_bean_temp__c_ || row.drop_temp || '',
      devTime: row.dev_time__s_ || row.dev_time || '',
      devRatio: row.dev__ || row.dev_ratio || '',
      whatWorked: row.what_worked_ || row.what_worked || '',
      whatDidnt: row.what_didn_t_work_ || row.what_didnt || '',
      whatToChange: row.what_will_you_change_next_time_ || row.what_to_change || '',
      worthRepeating: row.worth_repeating_ || row.worth_repeating || '',
      isReference: row.reference_roast_ || row.is_reference || '',
      drumDirection: row.drum_direction || '',
    })).filter(r => r.batchId)
  }

  // Handle save for self-roasted flow
  const handleSaveSelfRoasted = async () => {
    setIsProcessing(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Resolve terroir + cultivar in parallel — independent lookups, saves ~1 RTT
      const [terroirResult, cultivarResult] = await Promise.all([
        findOrCreateTerroir(
          supabase,
          user.id,
          parsedTerroir?.country ?? null,
          parsedTerroir?.macroTerroir ?? null,
          parsedTerroir?.adminRegion ?? null,
          parsedTerroir?.mesoTerroir ?? null,
        ),
        findOrCreateCultivar(supabase, user.id, parsedCultivar?.cultivar ?? null),
      ])
      if (!terroirResult.ok) throw new Error(terroirResult.error)
      if (!cultivarResult.ok) throw new Error(cultivarResult.error)
      const terroirId = terroirResult.id
      const cultivarId = cultivarResult.id

      // 3. Create green bean
      const { data: greenBean, error: greenBeanError } = await supabase
        .from('green_beans')
        .insert({
          user_id: user.id,
          lot_id: parsedGreenBean?.lotId || `LOT-${Date.now()}`,
          name: parsedGreenBean?.name || 'Unnamed',
          producer: parsedGreenBean?.producer,
          origin: parsedGreenBean?.origin,
          region: parsedGreenBean?.region,
          variety: parsedGreenBean?.variety,
          process: parsedGreenBean?.process,
          importer: parsedGreenBean?.importer,
          source_type: parsedGreenBean?.sourceType,
          link: parsedGreenBean?.link,
          purchase_date: parsedGreenBean?.purchaseDate || null,
          price_per_kg: parsedGreenBean?.pricePerKg ? parseFloat(parsedGreenBean.pricePerKg.replace(/[^0-9.]/g, '')) : null,
          quantity_g: parsedGreenBean?.quantity ? parseInt(parsedGreenBean.quantity) : null,
          moisture: parsedGreenBean?.moisture,
          density: parsedGreenBean?.density,
          terroir_id: terroirId,
          cultivar_id: cultivarId,
        })
        .select()
        .single()

      if (greenBeanError) throw greenBeanError

      // 4. Create roasts
      const roastIdMap: Record<string, string> = {}
      for (const roast of parsedRoasts) {
        const { data: newRoast, error: roastError } = await supabase
          .from('roasts')
          .insert({
            user_id: user.id,
            green_bean_id: greenBean.id,
            batch_id: roast.batchId,
            roast_date: roast.roastDate || null,
            coffee_name: roast.coffeeName,
            profile_link: roast.profileLink,
            batch_size_g: roast.batchSize ? parseInt(roast.batchSize) : null,
            roasted_weight_g: roast.roastedWeight ? parseInt(roast.roastedWeight) : null,
            weight_loss_pct: roast.weightLoss ? parseFloat(roast.weightLoss.replace('%', '')) : null,
            agtron: roast.agtron ? parseFloat(roast.agtron) : null,
            color_description: roast.colorDescription,
            yellowing_time: roast.yellowingTime,
            fc_start: roast.fcStart,
            fc_temp: roast.fcTemp ? parseFloat(roast.fcTemp) : null,
            drop_time: roast.dropTime,
            drop_temp: roast.dropTemp ? parseFloat(roast.dropTemp) : null,
            dev_time_s: roast.devTime ? parseInt(roast.devTime) : null,
            dev_ratio: roast.devRatio,
            what_worked: roast.whatWorked,
            what_didnt: roast.whatDidnt,
            what_to_change: roast.whatToChange,
            worth_repeating: roast.worthRepeating?.toLowerCase() === 'yes',
            is_reference: roast.isReference?.toLowerCase() === 'yes',
            drum_direction: roast.drumDirection,
          })
          .select()
          .single()

        if (!roastError && newRoast) {
          roastIdMap[roast.batchId] = newRoast.id
        }
      }

      // 5. Create experiments
      for (const exp of parsedExperiments) {
        await supabase.from('experiments').insert({
          user_id: user.id,
          green_bean_id: greenBean.id,
          experiment_id: exp.experimentId,
          batch_ids: exp.batchIds,
          context: exp.context,
          primary_question: exp.primaryQuestion,
          control_baseline: exp.controlBaseline,
          shared_constants: exp.sharedConstants,
          variable_changed: exp.variableChanged,
          levels_tested: exp.levelsTested,
          expected_outcomes: exp.expectedOutcomes,
          failure_boundary: exp.failureBoundary,
          observed_outcome_a: exp.observedOutcomeA,
          observed_outcome_b: exp.observedOutcomeB,
          observed_outcome_c: exp.observedOutcomeC,
          observed_outcome_d: exp.observedOutcomeD,
          winner: exp.winner,
          key_insight: exp.keyInsight,
          what_changes_going_forward: exp.whatChangesGoingForward,
        })
      }

      // 6. Create cuppings (linked to roasts)
      for (const cup of parsedCuppings) {
        const roastId = roastIdMap[cup.batchId]
        if (roastId) {
          await supabase.from('cuppings').insert({
            user_id: user.id,
            roast_id: roastId,
            cupping_date: cup.cuppingDate || null,
            rest_days: cup.restDays ? parseInt(cup.restDays) : null,
            eval_method: cup.evalMethod,
            ground_agtron: cup.groundAgtron ? parseFloat(cup.groundAgtron) : null,
            ground_color_description: cup.groundColorDescription,
            aroma: cup.aroma,
            flavor: cup.flavor,
            acidity: cup.acidity,
            body: cup.body,
            finish: cup.finish,
            overall: cup.overall,
          })
        }
      }

      // 7. Create roast learnings
      if (parsedLearnings) {
        await supabase.from('roast_learnings').insert({
          user_id: user.id,
          green_bean_id: greenBean.id,
          best_batch_id: parsedLearnings.bestBatchId,
          why_this_roast_won: parsedLearnings.whyThisRoastWon,
          aromatic_behavior: parsedLearnings.aromaticBehavior,
          structural_behavior: parsedLearnings.structuralBehavior,
          elasticity: parsedLearnings.elasticity,
          roast_window_width: parsedLearnings.roastWindowWidth,
          primary_lever: parsedLearnings.primaryLever,
          secondary_levers: parsedLearnings.secondaryLevers,
          what_didnt_move_needle: parsedLearnings.whatDidntMoveNeedle,
          underdevelopment_signal: parsedLearnings.underdevelopmentSignal,
          overdevelopment_signal: parsedLearnings.overdevelopmentSignal,
          cultivar_takeaway: parsedLearnings.cultivarTakeaway,
          general_takeaway: parsedLearnings.generalTakeaway,
          reference_roasts: parsedLearnings.referenceRoasts,
          starting_hypothesis: parsedLearnings.startingHypothesis,
          rest_behavior: parsedLearnings.restBehavior,
        })
      }

      // 8. Create brew document
      const bestRoastId = parsedLearnings?.bestBatchId ? roastIdMap[parsedLearnings.bestBatchId] : null
      const srStructured = seedStructuredProcess({ process: parsedGreenBean?.process ?? null })
      const srGrind = seedStructuredGrind({ grind: parsedBrew?.recipe?.grind ?? null })

      const { data: brew, error: brewError } = await supabase
        .from('brews')
        .insert({
          user_id: user.id,
          source: 'self-roasted',
          green_bean_id: greenBean.id,
          roast_id: bestRoastId,
          terroir_id: terroirId,
          cultivar_id: cultivarId,
          coffee_name: `${parsedGreenBean?.name} (Batch #${parsedLearnings?.bestBatchId || 'TBD'})`,
          variety: parsedGreenBean?.variety,
          process: composeProcess(srStructured),
          ...structuredProcessColumns(srStructured),
          roast_level: null,
          flavor_notes: [],
          brewer: parsedBrew?.recipe?.brewer,
          filter: parsedBrew?.recipe?.filter,
          dose_g: parsedBrew?.recipe?.doseG ? parseFloat(parsedBrew.recipe.doseG) : null,
          water_g: parsedBrew?.recipe?.waterG ? parseFloat(parsedBrew.recipe.waterG) : null,
          grinder: srGrind.grinder,
          grind_setting: srGrind.grind_setting,
          grind: composeGrind(srGrind) ?? parsedBrew?.recipe?.grind,
          temp_c: parsedBrew?.recipe?.tempC ? parseFloat(parsedBrew.recipe.tempC) : null,
          bloom: parsedBrew?.recipe?.bloom,
          pour_structure: parsedBrew?.recipe?.pourStructure,
          total_time: parsedBrew?.recipe?.totalTime,
          extraction_strategy: parsedBrew?.recipe?.extractionStrategy,
          extraction_confirmed: parsedBrew?.recipe?.extractionConfirmed,
          aroma: parsedBrew?.sensory?.aroma,
          attack: parsedBrew?.sensory?.attack,
          mid_palate: parsedBrew?.sensory?.midPalate,
          body: parsedBrew?.sensory?.body,
          finish: parsedBrew?.sensory?.finish,
          temperature_evolution: parsedBrew?.sensory?.temperatureEvolution,
          peak_expression: parsedBrew?.sensory?.peakExpression,
          key_takeaways: parsedBrew?.learnings?.keyTakeaways || [],
          classification: parsedBrew?.learnings?.classification,
        })
        .select()
        .single()

      if (brewError) throw brewError

      // Success - redirect to the new brew
      router.push(`/brews/${brew.id}`)
      router.refresh()

    } catch (err: any) {
      console.error('Error saving:', err)
      setError(err.message || 'Failed to save')
    } finally {
      setIsProcessing(false)
    }
  }

  // Components
  const StepHeader = ({ num, title }: { num: number, title: string }) => (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2">
        {sourceType && (
          <span className={`font-mono text-xxs font-semibold px-2 py-1 rounded ${
            sourceType === 'self-roasted' ? 'bg-latent-fg text-white' : 'bg-latent-accent-light text-white'
          }`}>
            {sourceType === 'self-roasted' ? 'ROASTED' : 'PURCHASED'}
          </span>
        )}
        <span className="font-mono text-xs text-latent-mid">
          Step {num} of {totalSteps}
        </span>
      </div>
      <h2 className="font-sans text-xl font-semibold">{title}</h2>
    </div>
  )

  const Progress = () => (
    <div className="flex gap-1 mt-8 justify-center">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${i < step ? 'bg-latent-fg' : 'bg-latent-border'}`}
        />
      ))}
    </div>
  )

  // Step 1: Choose source type
  if (step === 1) {
    return (
      <div className="max-w-lg mx-auto px-6 py-12">
        <Link href="/brews" className="font-mono text-xs text-latent-mid hover:text-latent-fg mb-8 inline-block">
          ← Cancel
        </Link>
        
        <h1 className="font-sans text-2xl font-semibold mb-2">Add New Coffee</h1>
        <p className="text-latent-mid mb-8">How did you get this coffee?</p>

        <div className="space-y-4">
          <button
            onClick={() => { setSourceType('self-roasted'); setStep(2); }}
            className="w-full text-left p-6 border border-latent-border rounded-md hover:border-latent-fg transition-colors group"
          >
            <div className="flex items-start gap-4">
              <span className="text-2xl">🌱</span>
              <div>
                <div className="font-mono text-sm font-semibold group-hover:text-latent-accent-light">
                  I roasted it myself
                </div>
                <div className="text-sm text-latent-mid mt-1">
                  Track green beans, roast logs, experiments, and learnings
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={() => { setSourceType('purchased'); setStep(2); }}
            className="w-full text-left p-6 border border-latent-border rounded-md hover:border-latent-fg transition-colors group"
          >
            <div className="flex items-start gap-4">
              <span className="text-2xl">☕</span>
              <div>
                <div className="font-mono text-sm font-semibold group-hover:text-latent-accent-light">
                  I bought it roasted
                </div>
                <div className="text-sm text-latent-mid mt-1">
                  Document coffee from a roaster with brew notes
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    )
  }

  // Self-roasted flow
  if (sourceType === 'self-roasted') {
    const countryInput = parsedTerroir?.country ?? ''
    const macroInput = parsedTerroir?.macroTerroir ?? ''
    const cultivarInputName = parsedCultivar?.cultivar ?? ''
    const countryValid = TERROIR_COUNTRY_LOOKUP.isResolvable(countryInput) && countryInput.trim().length > 0
    const macroValid = TERROIR_MACRO_LOOKUP.isResolvable(macroInput) && macroInput.trim().length > 0
    const cultivarValid = CULTIVAR_LOOKUP.isResolvable(cultivarInputName) && cultivarInputName.trim().length > 0
    const gateOk = countryValid && macroValid && cultivarValid

    const setTerroirField = (key: keyof ParsedTerroir, val: string) => {
      setParsedTerroir((prev) => ({ ...(prev ?? {}), [key]: val }))
    }

    // Step 2: Green Bean Details
    if (step === 2) {
      return (
        <div className="max-w-lg mx-auto px-6 py-8">
          <button onClick={resetFlow} className="font-mono text-xs text-latent-mid hover:text-latent-fg mb-6">
            ← Start Over
          </button>
          
          <StepHeader num={2} title="Green Bean Details" />
          
          <div className="mb-6">
            <label className="label">Paste spreadsheet row or description</label>
            <textarea
              value={greenBeanInput}
              onChange={(e) => setGreenBeanInput(e.target.value)}
              className="textarea"
              placeholder="Paste green bean details here..."
              rows={6}
            />
          </div>

          {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

          <div className="flex gap-3">
            <button
              onClick={() => {
                const parsed = parseGreenBeanSpreadsheet(greenBeanInput)
                if (parsed) {
                  setParsedGreenBean(parsed)
                } else {
                  setError('Could not parse input')
                }
              }}
              disabled={!greenBeanInput.trim()}
              className="btn btn-secondary"
            >
              Parse
            </button>
          </div>

          {parsedGreenBean && (
            <div className="mt-6 p-4 bg-latent-highlight border border-latent-highlight-border rounded">
              <div className="font-mono text-xs font-semibold mb-2">Parsed:</div>
              <div className="font-mono text-sm">{parsedGreenBean.name || parsedGreenBean.lotId}</div>
              <div className="text-sm text-latent-mid">
                {parsedGreenBean.origin} · {parsedGreenBean.variety} · {parsedGreenBean.process}
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(1)} className="btn btn-secondary">Back</button>
            <button 
              onClick={() => setStep(3)} 
              disabled={!parsedGreenBean}
              className="btn btn-primary"
            >
              Next →
            </button>
          </div>

          <Progress />
        </div>
      )
    }

    // Step 3: Roast Log
    if (step === 3) {
      return (
        <div className="max-w-lg mx-auto px-6 py-8">
          <button onClick={resetFlow} className="font-mono text-xs text-latent-mid hover:text-latent-fg mb-6">
            ← Start Over
          </button>
          
          <StepHeader num={3} title="Roast Log" />
          
          <div className="mb-6">
            <label className="label">Paste roast log rows</label>
            <textarea
              value={roastLogInput}
              onChange={(e) => setRoastLogInput(e.target.value)}
              className="textarea"
              placeholder="Paste all roast log rows here (with headers)..."
              rows={8}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                const parsed = parseRoastLogSpreadsheet(roastLogInput)
                setParsedRoasts(parsed)
              }}
              disabled={!roastLogInput.trim()}
              className="btn btn-secondary"
            >
              Parse
            </button>
          </div>

          {parsedRoasts.length > 0 && (
            <div className="mt-6 p-4 bg-latent-highlight border border-latent-highlight-border rounded">
              <div className="font-mono text-xs font-semibold mb-2">
                Parsed {parsedRoasts.length} roasts
              </div>
              <div className="text-sm text-latent-mid">
                Batches: {parsedRoasts.map(r => `#${r.batchId}`).join(', ')}
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(2)} className="btn btn-secondary">Back</button>
            <button onClick={() => setStep(4)} className="btn btn-primary">
              Next →
            </button>
          </div>

          <Progress />
        </div>
      )
    }

    // Steps 4-6: Experiments, Cuppings, Learnings — generic paste-textarea
    // (parsers not yet wired; save flow currently ignores these — follow-up sprint)
    if (step >= 4 && step <= 6) {
      const stepConfig: Record<number, { title: string, field: string, setter: any, value: string }> = {
        4: { title: 'Experiments (Optional)', field: 'experiments', setter: setExperimentInput, value: experimentInput },
        5: { title: 'Cupping Notes', field: 'cuppings', setter: setCuppingInput, value: cuppingInput },
        6: { title: 'Roast Learnings', field: 'learnings', setter: setLearningsInput, value: learningsInput },
      }

      const config = stepConfig[step]

      return (
        <div className="max-w-lg mx-auto px-6 py-8">
          <button onClick={resetFlow} className="font-mono text-xs text-latent-mid hover:text-latent-fg mb-6">
            ← Start Over
          </button>

          <StepHeader num={step} title={config.title} />

          <div className="mb-6">
            <label className="label">Paste data</label>
            <textarea
              value={config.value}
              onChange={(e) => config.setter(e.target.value)}
              className="textarea"
              placeholder={`Paste ${config.field} data here...`}
              rows={6}
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(step - 1)} className="btn btn-secondary">Back</button>
            <button onClick={() => setStep(step + 1)} className="btn btn-primary">
              Skip / Next →
            </button>
          </div>

          <Progress />
        </div>
      )
    }

    // Step 7: Terroir — structured form backed by canonical registry
    if (step === 7) {
      const adminRegion = parsedTerroir?.adminRegion ?? ''
      const mesoTerroir = parsedTerroir?.mesoTerroir ?? ''
      const autoAdmin = (countryInput && macroInput
        ? getTerroirEntry(countryInput, macroInput)?.admin_region
        : null) ?? ''

      return (
        <div className="max-w-lg mx-auto px-6 py-8">
          <button onClick={resetFlow} className="font-mono text-xs text-latent-mid hover:text-latent-fg mb-6">
            ← Start Over
          </button>

          <StepHeader num={7} title="Terroir" />

          <GreenBeanHint
            fields={[
              ['Origin', parsedGreenBean?.origin],
              ['Region', parsedGreenBean?.region],
            ]}
          />

          <div className="grid grid-cols-2 gap-3 mb-4">
            <CanonicalTextInput
              label="Country *"
              value={countryInput}
              onChange={(v) => setTerroirField('country', v)}
              registry={TERROIR_COUNTRY_LOOKUP}
            />
            <CanonicalTextInput
              label="Macro terroir *"
              value={macroInput}
              onChange={(v) => setTerroirField('macroTerroir', v)}
              registry={TERROIR_MACRO_LOOKUP}
            />
            <div className="col-span-2">
              <label className="label">Admin region</label>
              <input
                className="input"
                value={adminRegion}
                onChange={(e) => setTerroirField('adminRegion', e.target.value)}
                placeholder={autoAdmin || ''}
              />
              {autoAdmin && !adminRegion && (
                <div className="mt-1 font-mono text-xxs text-latent-mid">
                  Leave empty to use registry default: {autoAdmin}
                </div>
              )}
            </div>
            <div className="col-span-2">
              <label className="label">Meso terroir (free-text)</label>
              <input
                className="input"
                value={mesoTerroir}
                onChange={(e) => setTerroirField('mesoTerroir', e.target.value)}
              />
            </div>
          </div>

          <p className="font-mono text-xxs text-latent-mid mb-4">
            Registry: {TERROIR_MACRO_LOOKUP.list.length} macros across {TERROIR_COUNTRY_LOOKUP.list.length} countries. Aliases resolve on save.
          </p>

          {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(6)} className="btn btn-secondary">Back</button>
            <button
              onClick={() => setStep(8)}
              disabled={!countryValid || !macroValid}
              className="btn btn-primary"
            >
              Next →
            </button>
          </div>

          <Progress />
        </div>
      )
    }

    // Step 8: Cultivar — structured form backed by canonical registry
    if (step === 8) {
      const resolved = cultivarInputName ? resolveCultivar(cultivarInputName) : null
      const setCultivarName = (val: string) => {
        setParsedCultivar((prev) => ({ ...(prev ?? {}), cultivar: val }))
      }

      return (
        <div className="max-w-lg mx-auto px-6 py-8">
          <button onClick={resetFlow} className="font-mono text-xs text-latent-mid hover:text-latent-fg mb-6">
            ← Start Over
          </button>

          <StepHeader num={8} title="Cultivar" />

          <GreenBeanHint fields={[['Variety', parsedGreenBean?.variety]]} />

          <div className="mb-4">
            <CanonicalTextInput
              label="Cultivar *"
              value={cultivarInputName}
              onChange={setCultivarName}
              registry={CULTIVAR_LOOKUP}
            />
          </div>

          {resolved && (
            <div className="mb-4 p-3 bg-latent-bg border border-latent-border rounded-md">
              <div className="font-mono text-xxs font-semibold mb-1 text-latent-mid">RESOLVED</div>
              <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
                <span className="font-mono text-xxs text-latent-mid">Species</span>
                <span>{resolved.species}</span>
                <span className="font-mono text-xxs text-latent-mid">Family</span>
                <span>{resolved.family}</span>
                <span className="font-mono text-xxs text-latent-mid">Lineage</span>
                <span>{resolved.lineage}</span>
              </div>
            </div>
          )}

          <p className="font-mono text-xxs text-latent-mid mb-4">
            Registry: {CULTIVAR_LOOKUP.list.length} canonical cultivars. Aliases resolve on save.
          </p>

          {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(7)} className="btn btn-secondary">Back</button>
            <button
              onClick={() => setStep(9)}
              disabled={!cultivarValid}
              className="btn btn-primary"
            >
              Next →
            </button>
          </div>

          <Progress />
        </div>
      )
    }

    // Step 9: Best Brew & Save
    if (step === 9) {
      return (
        <div className="max-w-lg mx-auto px-6 py-8">
          <button onClick={resetFlow} className="font-mono text-xs text-latent-mid hover:text-latent-fg mb-6">
            ← Start Over
          </button>

          <StepHeader num={9} title="Best Brew & Tasting Notes" />

          <div className="mb-6">
            <label className="label">Paste brew recipe & sensory notes</label>
            <textarea
              value={brewInput}
              onChange={(e) => setBrewInput(e.target.value)}
              className="textarea"
              placeholder="Paste brew data here..."
              rows={8}
            />
          </div>

          {!gateOk && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-300 rounded-md font-mono text-xxs text-amber-900">
              <div className="font-semibold mb-1">Cannot save yet</div>
              {!countryValid && <div>• Step 7: country must resolve to the canonical registry</div>}
              {!macroValid && <div>• Step 7: macro terroir must resolve to the canonical registry</div>}
              {!cultivarValid && <div>• Step 8: cultivar must resolve to the canonical registry</div>}
            </div>
          )}

          {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(8)} className="btn btn-secondary">Back</button>
            <button
              onClick={handleSaveSelfRoasted}
              disabled={isProcessing || !gateOk}
              className="btn btn-primary"
            >
              {isProcessing ? 'Saving...' : 'Save & Finish'}
            </button>
          </div>

          <Progress />
        </div>
      )
    }
  }

  // Purchased flow: 4-step wizard (Bean → Terroir → Cultivar → Brew) → Review & save
  if (sourceType === 'purchased') {
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

    const stepFrames: Record<2 | 3 | 4 | 5, { title: string; label: string; placeholder: string; value: string; setter: (v: string) => void }> = {
      2: {
        title: 'Bean details',
        label: 'Paste the Bean tab (Roaster / Coffee Name / Origin / Variety / Process / Producer / Elevation / Roast level / Flavor notes / Link)',
        placeholder: 'Roaster\tCoffee Name\tOrigin\tVariety\tProcess\tProducer\tElevation\tRoast level\tFlavor notes (primary)\tLink\nColibri\tFinca La Reserva Gesha\tCiudad Bolívar, Antioquia, Colombia\tGesha\tAnaerobic Honey\t\t1900–2000 masl\tBalanced Intensity\tWhite grape, honey, green apple\t',
        value: beanTabInput,
        setter: setBeanTabInput,
      },
      3: {
        title: 'Terroir',
        label: 'Paste the Terroir tab (Country / Admin Region / Macro Terroir / Meso Terroir / ...)',
        placeholder: 'Country\tAdmin Region\tMacro Terroir\tMeso Terroir\tMicro Terroir\tContext\tElevation Band\tClimate\tSoil\tFarming Model\tDominant Varieties\tTypical Processing\tCup Profile\tAcidity Character\tBody Character\tWhy It Stands Out\nColombia\tAntioquia\tWestern Andean Cordillera\tCiudad Bolívar highlands\t...',
        value: terroirTabInput,
        setter: setTerroirTabInput,
      },
      4: {
        title: 'Cultivar',
        label: 'Paste the Cultivar tab (Cultivar / Species / Genetic Family / Lineage / ...)',
        placeholder: 'Cultivar\tSpecies\tGenetic Family\tLineage\tGenetic Background\tTypical Origins\t...\nGesha (Colombian selection)\tArabica\tEthiopian Landrace Families\tGesha lineage\t...',
        value: cultivarTabInput,
        setter: setCultivarTabInput,
      },
      5: {
        title: 'Best brew (archived recipe)',
        label: 'Paste the Best Brew tab (Coffee Name / Brewer / Filter / Dose / Water / Grind / Extraction Strategy / Temp / Bloom / Pour Structure / Total Time / Aroma / Attack / Mid-Palate / Body / Finish / Temperature Evolution / Peak Expression / What I learned / Extraction Strategy Confirmed)',
        placeholder: 'Coffee Name\tBrewer\tFilter\tDose\tWater\tGrind\tExtraction Strategy\tTemp\tBloom\tPour Structure\tTotal Time\tAroma\tAttack\tMid-Palate\tBody\tFinish\tTemperature Evolution\tPeak Expression\tWhat I learned from this coffee\tExtraction Strategy Confirmed',
        value: brewTabInput,
        setter: setBrewTabInput,
      },
    }

    if (step === 2 || step === 3 || step === 4 || step === 5) {
      const frame = stepFrames[step as 2 | 3 | 4 | 5]
      const payload = purchasedPayload
      // Inline summary of what's been captured so far
      const summary: Array<[string, string | null | undefined]> = []
      if (step === 2 && payload) {
        summary.push(['Coffee', payload.coffee_name])
        summary.push(['Roaster', payload.roaster])
        summary.push(['Producer', payload.producer])
        summary.push(['Variety', payload.variety])
        summary.push(['Process', payload.process])
        summary.push(['Flavor notes', payload.flavor_notes?.join(', ') || null])
      } else if (step === 3 && payload) {
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
      } else if (step === 4 && payload) {
        summary.push(['Cultivar', payload.cultivar?.cultivar_name])
        summary.push(['Species', payload.cultivar?.species])
        summary.push(['Genetic family', payload.cultivar?.genetic_family as string | null])
        summary.push(['Lineage', payload.cultivar?.lineage])
      } else if (step === 5 && payload) {
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

          {step === 2 && (
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
            {step > 2 && (
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
                  ? step === 5
                    ? 'Parse & Review →'
                    : 'Parse & Next →'
                  : step === 5
                    ? 'Skip → Review'
                    : 'Skip →'}
            </button>
          </div>

          <Progress />
        </div>
      )
    }

    // Legacy single-paste step (still reachable via step=99 if ever needed) — keep for compat
    if (step === -99) {
      return (
        <div className="max-w-2xl mx-auto px-6 py-8">
          <button onClick={resetFlow} className="font-mono text-xs text-latent-mid hover:text-latent-fg mb-6">
            ← Start Over
          </button>

          <StepHeader num={2} title="Paste the archived recipe" />

          <p className="text-sm text-latent-mid mb-4">
            Paste the full archived recipe from your iteration loop. Include the pipe-delimited recipe line
            (Coffee | Brewer | Filter | Dose | ...) and any labeled fields like &quot;Country:&quot;, &quot;Cultivar:&quot;, &quot;Process:&quot;.
          </p>

          <div className="mb-4">
            <label className="label">Recipe text</label>
            <textarea
              value={purchasedInput}
              onChange={(e) => setPurchasedInput(e.target.value)}
              className="textarea"
              placeholder={`Coffee: Los Nogales Washed Gesha\nRoaster: Sey Coffee\nCountry: Panama\nMacro Terroir: Volcán Barú Highlands\nCultivar: Gesha\nProcess: Washed\n\n<coffee_name> | V60 | Cafec Abaca | 15 | 250 | medium-fine | Clarity-First | 94 | 30g/45s | 3 pours | 3:15 | floral | ...`}
              rows={12}
            />
          </div>

          <label className="flex items-center gap-2 mb-4 text-sm text-latent-mid">
            <input
              type="checkbox"
              checked={purchasedUseClaude}
              onChange={(e) => setPurchasedUseClaude(e.target.checked)}
            />
            Use Claude to enrich &amp; validate (normalize cultivar names, match to registry)
          </label>

          {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

          <div className="flex gap-3">
            <button
              onClick={async () => {
                setIsProcessing(true)
                setError(null)
                try {
                  const res = await fetch('/api/brews/parse', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: purchasedInput, useClaude: purchasedUseClaude }),
                  })
                  const data = await res.json()
                  if (!res.ok) throw new Error(data.error || data.detail || 'Parse failed')
                  // Ensure required fields default to empty strings so review inputs are controlled
                  const p: BrewPayload = {
                    coffee_name: data.parsed?.coffee_name || '',
                    source: 'purchased',
                    roaster: data.parsed?.roaster ?? null,
                    producer: data.parsed?.producer ?? null,
                    variety: data.parsed?.variety ?? null,
                    process: data.parsed?.process ?? null,
                    roast_level: data.parsed?.roast_level ?? null,
                    flavor_notes: data.parsed?.flavor_notes ?? null,
                    terroir: {
                      country: data.parsed?.terroir?.country || '',
                      admin_region: data.parsed?.terroir?.admin_region ?? null,
                      macro_terroir: data.parsed?.terroir?.macro_terroir ?? null,
                      meso_terroir: data.parsed?.terroir?.meso_terroir ?? null,
                      elevation_min: data.parsed?.terroir?.elevation_min ?? null,
                      elevation_max: data.parsed?.terroir?.elevation_max ?? null,
                      climate_stress: data.parsed?.terroir?.climate_stress ?? null,
                    },
                    cultivar: {
                      cultivar_name: data.parsed?.cultivar?.cultivar_name || '',
                      species: data.parsed?.cultivar?.species ?? 'Arabica',
                      genetic_family: data.parsed?.cultivar?.genetic_family ?? null,
                      lineage: data.parsed?.cultivar?.lineage ?? null,
                    },
                    brewer: data.parsed?.brewer ?? null,
                    filter: data.parsed?.filter ?? null,
                    dose_g: data.parsed?.dose_g ?? null,
                    water_g: data.parsed?.water_g ?? null,
                    ratio: data.parsed?.ratio ?? null,
                    grind: data.parsed?.grind ?? null,
                    temp_c: data.parsed?.temp_c ?? null,
                    bloom: data.parsed?.bloom ?? null,
                    pour_structure: data.parsed?.pour_structure ?? null,
                    total_time: data.parsed?.total_time ?? null,
                    extraction_strategy: data.parsed?.extraction_strategy ?? null,
                    extraction_confirmed: data.parsed?.extraction_confirmed ?? null,
                    modifiers: data.parsed?.modifiers ?? [],
                    aroma: data.parsed?.aroma ?? null,
                    attack: data.parsed?.attack ?? null,
                    mid_palate: data.parsed?.mid_palate ?? null,
                    body: data.parsed?.body ?? null,
                    finish: data.parsed?.finish ?? null,
                    temperature_evolution: data.parsed?.temperature_evolution ?? null,
                    peak_expression: data.parsed?.peak_expression ?? null,
                    key_takeaways: data.parsed?.key_takeaways ?? null,
                    classification: data.parsed?.classification ?? null,
                    terroir_connection: data.parsed?.terroir_connection ?? null,
                    cultivar_connection: data.parsed?.cultivar_connection ?? null,
                    what_i_learned: data.parsed?.what_i_learned ?? null,
                    is_process_dominant: data.parsed?.is_process_dominant ?? false,
                    process_category: data.parsed?.process_category ?? null,
                    process_details: data.parsed?.process_details ?? null,
                  }
                  // Seed structured process + grinder fields so the picker in
                  // step 6 is pre-populated.
                  Object.assign(p, structuredProcessColumns(seedStructuredProcess(p)))
                  Object.assign(p, structuredGrindColumns(seedStructuredGrind(p)))
                  setPurchasedPayload(p)
                  setPurchasedTerroirMatch(data.terroirMatch)
                  setPurchasedCultivarMatch(data.cultivarMatch)
                  setPurchasedDrift(data.drift)
                  setPurchasedUsedClaude(data.usedClaude)
                  setPurchasedConfirmTerroir(false)
                  setPurchasedConfirmCultivar(false)
                  setPurchasedRoasterOverride(false)
                  setPurchasedGrinderOverride(false)
                  setStep(3)
                } catch (err: any) {
                  setError(err.message || 'Parse failed')
                } finally {
                  setIsProcessing(false)
                }
              }}
              disabled={!purchasedInput.trim() || isProcessing}
              className="btn btn-primary"
            >
              {isProcessing ? 'Parsing…' : 'Parse & Review →'}
            </button>
          </div>

          <Progress />
        </div>
      )
    }

    // Step 6: Review & save (final review after the 4 paste steps)
    if (step === 6 && purchasedPayload) {
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

          <StepHeader num={6} title="Review & save" />

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
                  onChange={(e) => updateField('extraction_strategy', e.target.value || null)}
                >
                  <option value="">—</option>
                  {EXTRACTION_STRATEGIES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
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
            <button onClick={() => setStep(5)} className="btn btn-secondary">
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

  return null
}
