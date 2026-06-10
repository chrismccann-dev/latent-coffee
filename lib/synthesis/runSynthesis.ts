// Orchestrator: takes an adapter + entity + brews + (optional) roast_learnings,
// returns a polished synthesis + short-form digest ready to save to the
// cache table.
//
// THREE LLM calls (Sprint 13 / ADR-0010 — extends ADR-0002's 2-call shape):
//   1) Sonnet generates the raw directed synthesis from buildSynthesisPrompt.
//   2) Sonnet (humanizer pass) polishes AI-tells out of the prose.
//   3) Sonnet (short-form pass) digests the polished long-form into 1-2 paragraphs
//      + 2-3 takeaways for mobile rendering.
//
// Latency is ~15-20s combined; cached after generation per entity. Cost is
// ~3x credit per regeneration vs the pre-Sprint-13 single-call shape; bounded
// by the lazy SYN-7 regeneration trigger (page-visit only, on
// brewCount-delta OR synthesis_input_max_updated_at-delta).
//
// Cross-source corpus shape (SYN-6): when the adapter declares
// formatRoastLearningRow AND the caller supplies roastLearnings rows,
// buildSynthesisPrompt renders a second JSON block. The capsule integrates
// both sources into a single narrative per SHARED_RULES.

import Anthropic from '@anthropic-ai/sdk'
import { buildSynthesisPrompt } from './buildPrompt'
import { buildShortFormPrompt } from './buildShortFormPrompt'
import { applyHumanizer } from './humanizer'
import type { EntityAdapter } from './types'
import { computeInputMaxUpdatedAt } from './inputUpdatedAt'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface SynthesisOutcome {
  synthesis: string | null
  shortForm: string | null
  brewCount: number
  learningRowCount: number
  roastLearningRowCount: number
  inputMaxUpdatedAt: string | null
  tier?: string
  message?: string
}

interface RunSynthesisInput<T> {
  adapter: EntityAdapter<T>
  entity: T
  entityName: string
  brews: Record<string, unknown>[]
  roastLearnings?: Record<string, unknown>[]
}

export async function runSynthesis<T>(input: RunSynthesisInput<T>): Promise<SynthesisOutcome> {
  const { adapter, entity, entityName, brews, roastLearnings } = input

  const corpusEmpty = brews.length === 0 && (!roastLearnings || roastLearnings.length === 0)
  if (corpusEmpty) {
    return {
      synthesis: null,
      shortForm: null,
      brewCount: 0,
      learningRowCount: 0,
      roastLearningRowCount: 0,
      inputMaxUpdatedAt: null,
      message: `No corpus rows found for this ${adapter.entityNoun}`,
    }
  }

  const { prompt, learningRows, roastLearningRows, tier } = buildSynthesisPrompt({
    adapter,
    entity,
    entityName,
    brews,
    roastLearnings,
  })

  const totalRows = learningRows.length + roastLearningRows.length
  if (totalRows === 0) {
    return {
      synthesis: null,
      shortForm: null,
      brewCount: brews.length,
      learningRowCount: 0,
      roastLearningRowCount: 0,
      inputMaxUpdatedAt: computeInputMaxUpdatedAt(brews, roastLearnings),
      message: 'Corpus rows found but no learning data to synthesize',
    }
  }

  // Call 1: raw directed synthesis.
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: tier.maxTokens,
    messages: [{ role: 'user', content: prompt }],
  })

  const raw = message.content[0]?.type === 'text' ? message.content[0].text : null
  if (!raw) {
    return {
      synthesis: null,
      shortForm: null,
      brewCount: brews.length,
      learningRowCount: learningRows.length,
      roastLearningRowCount: roastLearningRows.length,
      inputMaxUpdatedAt: computeInputMaxUpdatedAt(brews, roastLearnings),
      tier: tier.tier,
      message: 'Synthesis call returned no text',
    }
  }

  // Call 2: humanizer polish.
  const polished = await applyHumanizer(raw)

  // Call 3: short-form digest (SYN-3). Best-effort — if it fails, the long
  // form is still serviceable on mobile via a fallback render path.
  let shortForm: string | null = null
  try {
    const shortFormPrompt = buildShortFormPrompt({
      longForm: polished,
      entityName,
      capsuleNoun: adapter.capsuleNoun,
      tier: tier.tier,
    })
    const shortFormMessage = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 500,
      messages: [{ role: 'user', content: shortFormPrompt }],
    })
    const shortFormRaw =
      shortFormMessage.content[0]?.type === 'text' ? shortFormMessage.content[0].text : null
    shortForm = shortFormRaw?.trim() || null
  } catch (err: any) {
    console.error('Short-form digest call failed:', err?.message || err)
  }

  return {
    synthesis: polished,
    shortForm,
    brewCount: brews.length,
    learningRowCount: learningRows.length,
    roastLearningRowCount: roastLearningRows.length,
    inputMaxUpdatedAt: computeInputMaxUpdatedAt(brews, roastLearnings),
    tier: tier.tier,
  }
}
