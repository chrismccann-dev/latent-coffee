// Pour structure parser. Splits a free-text `brews.pour_structure` entry into
// per-step segments so /brews/[id] can render them as executable bullets.
//
// Storage shape today: text column. Each entry follows one of ~5 separator
// conventions Chris has used in the wild (newline / "; " / period+marker /
// " · " / arrow chain). The parser tries them in order and falls back to a
// single segment when no separator hits.
//
// Forward compat: each segment also carries optional structured fields
// (label / time / amount_g / method) extracted via best-effort regex. Today
// those drive nothing in render — they're forward investment for a future
// schema migration to brews.pours jsonb. When that lands, swap the parse
// source from text → structured rows; the render layer stays the same.

export interface ParsedPourStep {
  raw: string
  label?: string
  time?: string
  amount_g?: number
  method?: string
}

export function parsePourSteps(text: string | null | undefined): ParsedPourStep[] {
  if (!text) return []
  const trimmed = text.trim()
  if (!trimmed) return []
  // Drop drawdown segments — drawdown surfaces in its own footer row on the
  // detail page (preferring brews.total_time, falling back to extractDrawdown).
  return splitIntoSegments(trimmed)
    .map(parseStep)
    .filter((s) => !/^drawdown\b/i.test(s.label ?? '') && !/^drawdown\b/i.test(s.raw))
}

function splitIntoSegments(text: string): string[] {
  // Clean separators first — newline, semicolon, middle-dot. Each defines a
  // step boundary unambiguously.
  if (/\n/.test(text)) {
    return text.split(/\n+/).map(cleanSegment).filter(Boolean)
  }
  if (/;\s/.test(text)) {
    return text.split(/;\s+/).map(cleanSegment).filter(Boolean)
  }
  if (/\s·\s/.test(text)) {
    return text.split(/\s·\s/).map(cleanSegment).filter(Boolean)
  }
  // Period before a marker word (Pepe Jijón and most pour-N: entries).
  const markerSplit = /\.\s+(?=(?:Pour\s\d+|Bloom\b|Drawdown\b|Carafe\b|Kettle\b|Tap\s|Office\s|Home\s|Drum\b|Pre-?wet|Wait\b|Hold\b|Crack\b)[^.;])/i
  const periodSegments = markerSplit.test(text)
    ? text.split(markerSplit).map(cleanSegment).filter(Boolean)
    : [text.trim()]
  // For each period-separated segment, try arrow-chain splitting. Period-
  // marker splits sentence-level boundaries (Picolot meta blocks); arrow
  // chains split step-level boundaries inside the recipe prose. Composing
  // them lets a single entry use both — Loud Giants is exactly this shape.
  return periodSegments.flatMap((seg) => trySplitArrowChain(seg) ?? [seg])
}

function trySplitArrowChain(text: string): string[] | null {
  const segments: string[] = []
  let last = 0
  let nonTimeArrows = 0
  const re = /\s→\s/g
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    const beforeTail = text.slice(0, m.index).slice(-12)
    if (/\d+:\d+\s*$/.test(beforeTail)) continue // intra-pour arrow, skip
    segments.push(text.slice(last, m.index).trim())
    last = m.index + m[0].length
    nonTimeArrows++
  }
  if (nonTimeArrows < 2) return null
  segments.push(text.slice(last).trim())
  return segments.map(cleanSegment).filter(Boolean)
}

function cleanSegment(s: string): string {
  return s.trim().replace(/[.;·]+$/, '').trim()
}

function parseStep(raw: string): ParsedPourStep {
  const step: ParsedPourStep = { raw }

  // Label: "Pour N", "Pour N (parenthetical)", "Bloom", "Drawdown".
  const labelMatch = raw.match(/^(Pour\s\d+(?:\s*\([^)]+\))?|Bloom|Drawdown)/i)
  if (labelMatch) step.label = labelMatch[1].trim()

  // Time: ~?M:SS optionally with range (M:SS-M:SS or M:SS–M:SS).
  const timeMatch = raw.match(/~?\d+:\d{2}(?:\s*[-–]\s*~?\d+:\d{2})?/)
  if (timeMatch) step.time = timeMatch[0].trim()

  // Amount: prefer "to NNNg", "NNNg cumulative", "NNNg total", "(+NNg)".
  // Don't match temperatures (followed by °C) or other bare numbers.
  const amountMatch =
    raw.match(/(?:to\s+)?(\d{2,4})\s*g(?:\s+(?:cumulative|total))?(?!\w)/i)?.[1] ??
    raw.match(/\(\+(\d{1,3})\s*g\)/)?.[1]
  if (amountMatch) {
    const n = parseInt(amountMatch, 10)
    if (Number.isFinite(n) && n > 0) step.amount_g = n
  }

  // Method: known shapes only. Don't try to canonicalize every method.
  const methodMatch = raw.match(
    /\b(Melodrip|Paragon\s+ball|Vannelli|center\s+pour|center\s+spiral|gentle\s+spiral|gentle\s+swirl|spiral|continuous|valve\s+(?:closed|restricted|half-open|open))\b/i
  )
  if (methodMatch) step.method = methodMatch[1].replace(/\s+/g, ' ').trim()

  return step
}

// Drawdown extraction. Prefer explicit `total_time` column when present;
// fall back to scraping a "Drawdown ..." mention from pour_structure prose.
export function extractDrawdown(
  totalTime: string | null | undefined,
  pourStructure: string | null | undefined
): string | null {
  const tt = totalTime?.trim()
  if (tt) return tt
  if (!pourStructure) return null
  const m = pourStructure.match(/Drawdown[:\s~]*([0-9:~–\-\s]+?)(?:[.;]|$)/i)
  return m?.[1]?.trim() || null
}
