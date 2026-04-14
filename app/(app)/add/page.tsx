'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

type SourceType = 'self-roasted' | 'purchased' | null

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
  const [parsedTerroir, setParsedTerroir] = useState<any>(null)
  const [parsedCultivar, setParsedCultivar] = useState<any>(null)
  const [parsedBrew, setParsedBrew] = useState<any>(null)
  const [parsedCoffee, setParsedCoffee] = useState<any>(null)

  const totalSteps = sourceType === 'self-roasted' ? 9 : 5

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

      // 1. Create or get terroir
      let terroirId = null
      if (parsedTerroir?.country) {
        const { data: existingTerroir } = await supabase
          .from('terroirs')
          .select('id')
          .eq('user_id', user.id)
          .eq('country', parsedTerroir.country)
          .eq('macro_terroir', parsedTerroir.macroTerroir || '')
          .single()

        if (existingTerroir) {
          terroirId = existingTerroir.id
        } else {
          const { data: newTerroir, error: terroirError } = await supabase
            .from('terroirs')
            .insert({
              user_id: user.id,
              country: parsedTerroir.country,
              admin_region: parsedTerroir.adminRegion,
              macro_terroir: parsedTerroir.macroTerroir,
              meso_terroir: parsedTerroir.mesoTerroir,
              elevation_min: parsedTerroir.elevationMin ? parseInt(parsedTerroir.elevationMin) : null,
              elevation_max: parsedTerroir.elevationMax ? parseInt(parsedTerroir.elevationMax) : null,
              climate_stress: parsedTerroir.climateStress,
            })
            .select()
            .single()

          if (terroirError) throw terroirError
          terroirId = newTerroir.id
        }
      }

      // 2. Create or get cultivar
      let cultivarId = null
      if (parsedCultivar?.cultivar) {
        const { data: existingCultivar } = await supabase
          .from('cultivars')
          .select('id')
          .eq('user_id', user.id)
          .eq('cultivar_name', parsedCultivar.cultivar)
          .single()

        if (existingCultivar) {
          cultivarId = existingCultivar.id
        } else {
          const { data: newCultivar, error: cultivarError } = await supabase
            .from('cultivars')
            .insert({
              user_id: user.id,
              species: parsedCultivar.species || 'Arabica',
              genetic_family: parsedCultivar.geneticFamily,
              lineage: parsedCultivar.lineage,
              cultivar_name: parsedCultivar.cultivar,
              genetic_background: parsedCultivar.geneticBackground,
              acidity_style: parsedCultivar.acidityStyle,
              body_style: parsedCultivar.bodyStyle,
              aromatics: parsedCultivar.aromatics,
            })
            .select()
            .single()

          if (cultivarError) throw cultivarError
          cultivarId = newCultivar.id
        }
      }

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
          process: parsedGreenBean?.process,
          roast_level: 'Light',
          flavor_notes: [],
          brewer: parsedBrew?.recipe?.brewer,
          filter: parsedBrew?.recipe?.filter,
          dose_g: parsedBrew?.recipe?.doseG ? parseFloat(parsedBrew.recipe.doseG) : null,
          water_g: parsedBrew?.recipe?.waterG ? parseFloat(parsedBrew.recipe.waterG) : null,
          grind: parsedBrew?.recipe?.grind,
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
          <span className={`font-mono text-[10px] font-semibold px-2 py-1 rounded ${
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

    // Steps 4-9: Experiments, Cuppings, Learnings, Terroir, Cultivar, Brew
    // (Simplified for now - would follow same pattern)
    
    if (step >= 4 && step <= 8) {
      const stepConfig: Record<number, { title: string, field: string, setter: any, value: string }> = {
        4: { title: 'Experiments (Optional)', field: 'experiments', setter: setExperimentInput, value: experimentInput },
        5: { title: 'Cupping Notes', field: 'cuppings', setter: setCuppingInput, value: cuppingInput },
        6: { title: 'Roast Learnings', field: 'learnings', setter: setLearningsInput, value: learningsInput },
        7: { title: 'Terroir Info', field: 'terroir', setter: setTerroirInput, value: terroirInput },
        8: { title: 'Cultivar Info', field: 'cultivar', setter: setCultivarInput, value: cultivarInput },
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
              {step === 8 ? 'Next →' : 'Skip / Next →'}
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

          {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

          <div className="flex gap-3 mt-6">
            <button onClick={() => setStep(8)} className="btn btn-secondary">Back</button>
            <button 
              onClick={handleSaveSelfRoasted}
              disabled={isProcessing}
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

  // Purchased flow (simplified)
  if (sourceType === 'purchased') {
    return (
      <div className="max-w-lg mx-auto px-6 py-8">
        <button onClick={resetFlow} className="font-mono text-xs text-latent-mid hover:text-latent-fg mb-6">
          ← Start Over
        </button>
        
        <StepHeader num={step} title="Coffee Details" />
        
        <p className="text-latent-mid mb-6">
          Purchased coffee flow coming soon. For now, use the self-roasted flow.
        </p>

        <button onClick={resetFlow} className="btn btn-secondary">
          Go Back
        </button>
      </div>
    )
  }

  return null
}
