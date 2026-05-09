import type { BuildPromptInput, WeightTier } from './types'

const WEIGHT_LABELS: Record<WeightTier, string> = {
  highest: 'Highest weight',
  high: 'High weight',
  medium: 'Medium weight',
  low: 'Low weight',
}

const SHARED_RULES = [
  'Do not summarize each coffee one by one. Extract recurring patterns across the corpus and write a human-readable field note.',
  'Separate entity-level rules from sibling-dimension-specific rules.',
  'Do not overfit to a single coffee. If one brew is the only evidence for a claim, flag it as a hypothesis.',
  'Use phrases like "usually", "often", or "in my archive" where the evidence is suggestive but not universal.',
  'If the dataset is narrow by origin, cultivar, process, or roaster, say so explicitly.',
  'Preserve nuance, but make the final output concise enough to paste into a profile card.',
  'Write in a natural human field-note voice. Default to third person about the entity, with occasional first-person attribution ("in my archive", "I have found"). No headers in the output, no markdown tables.',
]

const OUTPUT_FORMAT_PREFIX = [
  'Write 4-6 short paragraphs in a natural, human field-note style, followed by a final bulleted list of 4-6 practical takeaways. The bullet list is the only structural element — no section headers, no inline boldface for emphasis.',
  '',
  'Paragraph order:',
]

const PRACTICAL_TAKEAWAYS_INSTRUCTION =
  'After the paragraphs, end with a bulleted list (markdown `*` items) of 4-6 practical takeaways grounded in direct brewing experience. Each item is one sentence, concrete enough to act on.'

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

export interface BuildPromptResult {
  prompt: string
  learningRows: LearningRow[]
}

export function buildSynthesisPrompt<T>(input: BuildPromptInput<T>): BuildPromptResult {
  const { adapter, entity, entityName, brews } = input

  const learningRows = brews
    .map((brew) => adapter.formatLearningRow(brew))
    .filter(hasLearningSignal)

  const earlyData = learningRows.length > 0 && learningRows.length < 3
  const anchor = adapter.renderAnchor(entity)

  const anchorBlock = anchor
    ? `Documented context for ${entityName} (treat as a working hypothesis — confirm or push back from the corpus, do not just recite):

${anchor}`
    : `No documented registry context exists for ${entityName} yet — synthesize purely from the brew corpus below.`

  const earlyBlock = earlyData
    ? `\n\nEarly data: only ${learningRows.length} ${learningRows.length === 1 ? 'lot is' : 'lots are'} archived for this ${adapter.entityNoun}. Frame patterns as tentative; flag where one more data point would settle a question.`
    : ''

  const weightingBlock = adapter.weighting
    .map((w) => `- ${WEIGHT_LABELS[w.weight]}: ${w.label}. ${w.description}`)
    .join('\n')

  const outputFormatBlock = [
    ...OUTPUT_FORMAT_PREFIX,
    ...adapter.outputFormat.map((step, i) => `${i + 1}. ${step}`),
    '',
    PRACTICAL_TAKEAWAYS_INSTRUCTION,
  ].join('\n')

  const allRules = [...SHARED_RULES, ...(adapter.extraRules ?? [])]
    .map((r) => `- ${r}`)
    .join('\n')

  const prompt = `You are synthesizing brewing knowledge from Chris's coffee research archive into a "${adapter.capsuleNoun}" for the ${adapter.entityNoun} "${entityName}". The capsule is regenerated as the archive grows; treat it as living, not final.

Chris's palate has widened beyond clean-washed-tea-like profiles — controlled naturals, co-ferments, and red-wine-structured coffees are genuinely enjoyed when well-executed. Frame patterns as "when this style delivers vs. when it goes off", not as good/bad scoring.

${anchorBlock}${earlyBlock}

Brewing corpus (${learningRows.length} ${learningRows.length === 1 ? 'coffee' : 'coffees'}):

${JSON.stringify(learningRows, null, 2)}

Weight the inputs roughly like this:
${weightingBlock}

${outputFormatBlock}

Rules:
${allRules}`

  return { prompt, learningRows }
}
