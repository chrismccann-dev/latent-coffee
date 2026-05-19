// Orchestrator: takes an adapter + entity + brews, returns a polished
// synthesis string ready to save to the cache table.
//
// Two LLM calls:
//   1) Sonnet generates the raw directed synthesis from buildSynthesisPrompt.
//   2) Sonnet (humanizer pass) polishes AI-tells out of the prose.
//
// Latency is ~10-15s combined; cached after generation per entity.

import Anthropic from '@anthropic-ai/sdk'
import { buildSynthesisPrompt } from './buildPrompt'
import { applyHumanizer } from './humanizer'
import type { EntityAdapter } from './types'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface SynthesisOutcome {
  synthesis: string | null
  brewCount: number
  learningRowCount: number
  tier?: string
  message?: string
}

interface RunSynthesisInput<T> {
  adapter: EntityAdapter<T>
  entity: T
  entityName: string
  brews: Record<string, unknown>[]
}

export async function runSynthesis<T>(input: RunSynthesisInput<T>): Promise<SynthesisOutcome> {
  const { adapter, entity, entityName, brews } = input

  if (brews.length === 0) {
    return {
      synthesis: null,
      brewCount: 0,
      learningRowCount: 0,
      message: `No brews found for this ${adapter.entityNoun}`,
    }
  }

  const { prompt, learningRows, tier } = buildSynthesisPrompt({
    adapter,
    entity,
    entityName,
    brews,
  })

  if (learningRows.length === 0) {
    return {
      synthesis: null,
      brewCount: brews.length,
      learningRowCount: 0,
      message: 'Brews found but no learning data to synthesize',
    }
  }

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: tier.maxTokens,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = message.content[0]?.type === 'text' ? message.content[0].text : null
  if (!raw) {
    return {
      synthesis: null,
      brewCount: brews.length,
      learningRowCount: learningRows.length,
      tier: tier.tier,
      message: 'Synthesis call returned no text',
    }
  }

  const polished = await applyHumanizer(raw)

  return {
    synthesis: polished,
    brewCount: brews.length,
    learningRowCount: learningRows.length,
    tier: tier.tier,
  }
}
