import type { BuildPromptInput, WeightTier } from './types'

const WEIGHT_LABELS: Record<WeightTier, string> = {
  highest: 'Highest weight',
  high: 'High weight',
  medium: 'Medium weight',
  low: 'Low weight',
}

// SHARED_RULES — read top-to-bottom. The first two entries (the re-synthesis
// directive + the anti-pattern example) are the non-negotiable framing.
// SYN-4: promoted from a single aspirational "do not summarize each coffee"
// line to a directive + concrete anti-pattern pair so large-corpus capsules
// don't degrade into appended per-coffee notes.
// SYN-6 (Sprint 13): 3 new directives added below for the cross-source
// brewing+roasting corpus — unified-narrative bridging (Q3), is_process_dominant
// flagging (Q5), and roasting-vocab preservation. See ADR-0010.
const SHARED_RULES = [
  'This is a re-synthesis, not a summary. Read the corpus as a whole, find the recurring patterns, and write ONE narrative voice. The output must NOT have the shape of a list of coffees with one observation per coffee. New data points get pulled in multiplicatively, not appended — each regeneration is from scratch.',
  'Anti-pattern to avoid: "In Coffee A I noticed X. In Coffee B I noticed Y. In Coffee C I noticed Z." That is appending, not synthesizing. Instead, surface the underlying pattern: "X-Y-Z reads as a single tendency for this anchor, with the C-style appearing only when the process is anaerobic."',
  'When both a brewing corpus AND a roasting carry-forward block are present, integrate them into ONE unified narrative voice. Roasting carry-forward names what the lot teaches at the bean level (primary lever, brewing tolerance, scope-tagged generalizations); brewing observations name how that teaching shows up in the cup (extraction strategy, modifiers, peak expression). Do NOT produce two appended sections, a "brewing-side / roasting-side" split, or a list-of-sources structure. Anti-pattern to avoid: "From brewing: X. From roasting: Y." Instead: "X-Y reads as the same recurring tendency — the roast lever is what causes the cup behavior."',
  'When a brew is flagged `is_process_dominant: true`, surface its observations with explicit attribution to the process layer rather than letting them generalize to the anchor (e.g. "this Mandela XO reads more as Anaerobic Co-ferment Natural than as Modern Hybrid cultivar character"). Heavy-process coffees are evidence about the process, not about the cultivar / terroir / roaster they happen to ride on.',
  'Preserve roasting-side vocabulary verbatim when it appears in the carry-forward block: primary lever, brewing tolerance, acceptable roast window, underdevelopment signal, overdevelopment signal, aromatic behavior, structural behavior, rest behavior, and scope tags (e.g. `process:washed`, `variety:sudan-rume`, `terroir:western-andean-cordillera`). Do not paraphrase these into looser language.',
  'Preserve the Latent taste-apex vocabulary verbatim when it appears: layered-evolving (the canonical apex term — multidimensional and in motion across the temperature + structural arcs) and its antonym one-dimensional. Do not soften to "complex", "expressive", "loud", or "flat".',
  'Separate entity-level rules from sibling-dimension-specific rules.',
  'Do not overfit to a single coffee. If one brew is the only evidence for a claim, flag it as a hypothesis.',
  'If the dataset is narrow by origin, cultivar, process, or roaster, say so explicitly.',
  'Preserve nuance, but make the final output concise enough to paste into a profile card.',
  'Write in a natural human field-note voice. Default to third person about the entity, with occasional first-person attribution ("in my archive", "I have found"). No headers in the output, no markdown tables.',
]

interface LearningRow {
  [key: string]: unknown
}

const LEARNING_FIELDS = [
  'what_i_learned',
  'key_takeaways',
  'peak_expression',
  'temperature_evolution',
  'terroir_connection',
  'cultivar_connection',
  'classification',
  'flavor_notes',
] as const

function hasLearningSignal(row: LearningRow): boolean {
  return LEARNING_FIELDS.some((field) => {
    const value = row[field]
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === 'string') return value.trim().length > 0
    return value != null
  })
}

// ---------------------------------------------------------------------------
// SYN-2: corpus-size tiers. The synthesis pipeline classifies the learning-
// row count into one of 4 tiers, each driving (a) target paragraph count,
// (b) target takeaway count, (c) max_tokens budget, (d) confidence-language
// hint injected into the prompt. Replaces the prior binary `earlyData` flag.
// See CONTEXT-shared.md § Synthesis Pipeline > Corpus tier.
// ---------------------------------------------------------------------------

export type SynthesisTier = 'early' | 'emerging' | 'established' | 'mature'

export interface TierConfig {
  tier: SynthesisTier
  paragraphCount: string
  takeawayCount: string
  maxTokens: number
  confidenceHint: string
}

export function classifyTier(rowCount: number): TierConfig {
  if (rowCount < 3) {
    return {
      tier: 'early',
      paragraphCount: '2-3',
      takeawayCount: '2-3',
      maxTokens: 700,
      confidenceHint:
        `Early data: only ${rowCount} ${rowCount === 1 ? 'lot is' : 'lots are'} archived. Frame patterns as provisional first impressions. Use phrases like "too early to call", "first impressions suggest", "one more data point would settle this". Keep the capsule short — the corpus is too narrow for confident generalization, and a long capsule overstates the signal.`,
    }
  }
  if (rowCount < 8) {
    return {
      tier: 'emerging',
      paragraphCount: '3-4',
      takeawayCount: '3-4',
      maxTokens: 1100,
      confidenceHint:
        `Emerging pattern: ${rowCount} lots archived. Tendencies are recurring but narrow. Use hedge language like "usually", "in my archive so far", "the pattern is recurring but the sample is still narrow". Surface real tendencies without overclaiming — there is signal but not enough volume for sweeping rules.`,
    }
  }
  if (rowCount < 16) {
    return {
      tier: 'established',
      paragraphCount: '4-5',
      takeawayCount: '4-5',
      maxTokens: 1500,
      confidenceHint:
        `Established pattern: ${rowCount} lots archived. Use standard hedge language ("often", "tends to", "consistently"). The corpus is broad enough to surface cup characteristics, brewing traps, and process interactions reliably.`,
    }
  }
  return {
    tier: 'mature',
    paragraphCount: '4-6',
    takeawayCount: '4-6',
    maxTokens: 1500,
    confidenceHint:
      `Mature signal: ${rowCount} lots archived. The corpus is broad enough that recurring patterns can be stated with less hedging ("reliably", "consistently"). Surface the deep generalizations plus the specific edge-cases where the pattern breaks (cultivar override, process override, roaster override).`,
  }
}

export interface BuildPromptResult {
  prompt: string
  learningRows: LearningRow[]
  roastLearningRows: LearningRow[]
  tier: TierConfig
}

export function buildSynthesisPrompt<T>(input: BuildPromptInput<T>): BuildPromptResult {
  const { adapter, entity, entityName, brews, roastLearnings } = input

  const learningRows = brews
    .map((brew) => adapter.formatLearningRow(brew))
    .filter(hasLearningSignal)

  // SYN-6: cross-source corpus. Only present when the adapter declares
  // formatRoastLearningRow AND the route passed any roast_learnings rows.
  // Empty array on non-cross-source adapters (process) or zero-row axes.
  const roastLearningRows: LearningRow[] =
    adapter.formatRoastLearningRow && roastLearnings?.length
      ? roastLearnings.map((rl) => adapter.formatRoastLearningRow!(rl))
      : []

  // Tier classifies the combined corpus size so paragraph count + max_tokens
  // budget reflect both signals. A 3-brew axis with 2 roast_learnings is
  // 'emerging', not 'early'.
  const tier = classifyTier(learningRows.length + roastLearningRows.length)
  const anchor = adapter.renderAnchor(entity)

  const anchorBlock = anchor
    ? `Documented context for ${entityName} (treat as a working hypothesis — confirm or push back from the corpus, do not just recite):

${anchor}`
    : `No documented registry context exists for ${entityName} yet — synthesize purely from the corpus below.`

  const tierBlock = `\n\n${tier.confidenceHint}`

  const weightingBlock = adapter.weighting
    .map((w) => `- ${WEIGHT_LABELS[w.weight]}: ${w.label}. ${w.description}`)
    .join('\n')

  const outputFormatBlock = [
    `Write ${tier.paragraphCount} short paragraphs in a natural, human field-note style, followed by a final bulleted list of ${tier.takeawayCount} practical takeaways. The bullet list is the only structural element — no section headers, no inline boldface for emphasis.`,
    '',
    'Paragraph order:',
    ...adapter.outputFormat.map((step, i) => `${i + 1}. ${step}`),
    '',
    `After the paragraphs, end with a bulleted list (markdown \`*\` items) of ${tier.takeawayCount} practical takeaways grounded in direct brewing experience. Each item is one sentence, concrete enough to act on.`,
  ].join('\n')

  const allRules = [...SHARED_RULES, ...(adapter.extraRules ?? [])]
    .map((r) => `- ${r}`)
    .join('\n')

  const brewsBlock = `Brewing corpus (${learningRows.length} ${learningRows.length === 1 ? 'coffee' : 'coffees'}):

${JSON.stringify(learningRows, null, 2)}`

  // SYN-6: roasting carry-forward block, conditional on rows existing. When
  // present, the prompt's earlier SHARED_RULE directs the model to integrate
  // both sources into a single narrative voice rather than appending sections.
  const roastingBlock = roastLearningRows.length
    ? `

Roasting carry-forward (${roastLearningRows.length} lot${roastLearningRows.length === 1 ? '' : 's'} of self-roasted archive on this anchor — what each lot taught at the bean level, to be integrated with the brewing observations above):

${JSON.stringify(roastLearningRows, null, 2)}`
    : ''

  const prompt = `You are synthesizing brewing knowledge from Chris's coffee research archive into a "${adapter.capsuleNoun}" for the ${adapter.entityNoun} "${entityName}". The capsule is regenerated as the archive grows; treat it as living, not final.

Chris's palate has widened beyond clean-washed-tea-like profiles — controlled naturals, co-ferments, and red-wine-structured coffees are genuinely enjoyed when well-executed. Frame patterns as "when this style delivers vs. when it goes off", not as good/bad scoring.

${anchorBlock}${tierBlock}

${brewsBlock}${roastingBlock}

Weight the inputs roughly like this:
${weightingBlock}

${outputFormatBlock}

Rules:
${allRules}`

  return { prompt, learningRows, roastLearningRows, tier }
}
