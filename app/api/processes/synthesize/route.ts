// Sub Pages 4 (2026-05-11) — synthesize endpoint for the new /processes
// aggregation architecture.
//
// POST body: { kind: ProcessAggregationKind, key: string }
//   - kind:  'base' | 'honey_subprocess' | 'modifier_combo' | 'modifier_index' | 'signature'
//   - key:   the aggregation_key from lib/process-routing.ts helpers
//
// Per-kind brew set is resolved via lib/process-aggregation.ts, then routed
// through the matching adapter from lib/synthesis/adapters/process.ts.
// Result cached in process_aggregation_syntheses (migration 051).

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { runSynthesis } from '@/lib/synthesis/runSynthesis'
import {
  getProcessAdapter,
  type ProcessAggregationKind,
} from '@/lib/synthesis/adapters/process'
import {
  aggregateBaseHub,
  aggregateHoneySubprocess,
  aggregateModifierCombo,
  aggregateModifierIndex,
  aggregateSignature,
} from '@/lib/process-aggregation'
import {
  parseBaseSlug,
  parseSubprocessSlug,
  parseSignatureSlug,
  parseModifierComboSlug,
  parseModifierSlug,
} from '@/lib/process-routing'
import type { Brew } from '@/lib/types'
import {
  composeProcessDisplay,
  type BaseProcess,
  type HoneySubprocess,
} from '@/lib/process-registry'

const VALID_KINDS: ProcessAggregationKind[] = [
  'base',
  'honey_subprocess',
  'modifier_combo',
  'modifier_index',
  'signature',
]

interface DispatchResult {
  brews: Brew[]
  entityName: string
  entity: any
}

function dispatchAggregation(
  kind: ProcessAggregationKind,
  key: string,
  allBrews: Brew[],
): DispatchResult | { error: string; status: number } {
  switch (kind) {
    case 'base': {
      const base = parseBaseSlug(key)
      if (!base) return { error: `Unknown base slug: ${key}`, status: 404 }
      const hub = aggregateBaseHub(allBrews, base)
      return { brews: hub.all, entityName: base, entity: { base } }
    }
    case 'honey_subprocess': {
      const subprocess = parseSubprocessSlug(key)
      if (!subprocess) return { error: `Unknown subprocess slug: ${key}`, status: 404 }
      const brews = aggregateHoneySubprocess(allBrews, subprocess)
      return { brews, entityName: subprocess, entity: { subprocess } }
    }
    case 'modifier_combo': {
      // key shape: "{base}/{combo}"
      const [baseSlug, comboSlug] = key.split('/')
      const base = parseBaseSlug(baseSlug)
      if (!base) return { error: `Unknown base in modifier_combo key: ${baseSlug}`, status: 404 }
      const structured = parseModifierComboSlug(comboSlug, base)
      if (!structured) return { error: `Unknown combo slug: ${comboSlug}`, status: 404 }
      const brews = aggregateModifierCombo(allBrews, base, structured)
      const label = composeProcessDisplay(structured)
      return { brews, entityName: label, entity: { base, structured } }
    }
    case 'modifier_index': {
      const modifier = parseModifierSlug(key)
      if (!modifier) return { error: `Unknown modifier slug: ${key}`, status: 404 }
      const result = aggregateModifierIndex(allBrews, modifier.name)
      return {
        brews: result.all,
        entityName: modifier.name,
        entity: { modifier: modifier.name, byBase: result.byBase },
      }
    }
    case 'signature': {
      const name = parseSignatureSlug(key)
      if (!name) return { error: `Unknown signature slug: ${key}`, status: 404 }
      const brews = aggregateSignature(allBrews, name)
      return { brews, entityName: name, entity: { name } }
    }
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  const { kind, key } = body as { kind?: ProcessAggregationKind; key?: string }

  if (!kind || !key) {
    return NextResponse.json({ error: 'kind and key required' }, { status: 400 })
  }
  if (!VALID_KINDS.includes(kind)) {
    return NextResponse.json({ error: `Invalid kind: ${kind}` }, { status: 400 })
  }

  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { data: allBrews } = await supabase
    .from('brews')
    .select('*')
    .order('created_at', { ascending: false })

  const dispatch = dispatchAggregation(kind, key, (allBrews ?? []) as Brew[])
  if ('error' in dispatch) {
    return NextResponse.json({ error: dispatch.error }, { status: dispatch.status })
  }

  try {
    const adapter = getProcessAdapter(kind)
    const outcome = await runSynthesis({
      adapter: adapter as any,
      entity: dispatch.entity,
      entityName: dispatch.entityName,
      brews: dispatch.brews as unknown as Record<string, unknown>[],
    })

    if (outcome.synthesis) {
      // Sprint 13: process adapter is brews-only for SYN-6 (deferred per
      // ADR-0010 Q2) but still persists short_form_capsule + the SYN-7
      // content-change timestamp so /processes pages get the same mobile
      // render + better resynthesize trigger as the other axes.
      await supabase.from('process_aggregation_syntheses').upsert({
        user_id: user.id,
        aggregation_kind: kind,
        aggregation_key: key,
        synthesis: outcome.synthesis,
        synthesis_brew_count: outcome.brewCount,
        short_form_capsule: outcome.shortForm,
        synthesis_input_max_updated_at: outcome.inputMaxUpdatedAt,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,aggregation_kind,aggregation_key',
      })
    }

    return NextResponse.json({
      synthesis: outcome.synthesis,
      short_form: outcome.shortForm,
      brew_count: outcome.brewCount,
      input_max_updated_at: outcome.inputMaxUpdatedAt,
      message: outcome.message,
    })
  } catch (err: any) {
    console.error('Process synthesis error:', err?.message || err)
    return NextResponse.json(
      { error: err?.message || 'Failed to generate synthesis' },
      { status: 500 },
    )
  }
}
