// Pour structure: structured `brews.pours` jsonb (canonical, forward) +
// the legacy free-text `brews.pour_structure` parser (read-fallback).
//
// HYBRID MODEL (data-model session, 2026-05-30 / BS-1). claude.ai writes the
// structured `pours` array via push_brew going forward; the render reads it
// when present. Legacy rows (free-text `bloom` + `pour_structure`) still parse
// through parsePourSteps below until they're re-pushed structured. This kills
// the parse-ambiguity class — double-blooms, `·` missing times, meta/footer
// sentences leaking in as phantom pours, "Steep N"/"Phase N" under-segmentation
// — because the writer now emits one object per real step instead of prose the
// reader has to re-segment against an uncontracted format.
//
// Lean by design (Chris-locked): six flat keys, no nesting. `detail` is the
// human-readable line; `to_g`/`at` drive the timeline columns; `valve`/`pour_s`/
// `hold_s` are queryable mirrors (NOT rendered) so "every brew where P1 ran
// closed" becomes a SQL query. Valve transitions, drain-and-reclose, and kettle
// on/off-base stance all live as prose in `detail` — deliberately NOT typed
// (don't-overcomplicate). bloom is always index 0.

import type { CleanResult } from './extraction-modifiers'

export interface PourStep {
  type: 'bloom' | 'pour'
  /** Start time "m:ss". Required — the next step's `at` reads as this step's end. */
  at: string
  /** Cumulative grams (Chris always thinks cumulative). Optional for water-free actions. */
  to_g?: number | null
  /** Seconds the pour itself takes. Query-only mirror; not rendered. */
  pour_s?: number | null
  /** Seconds of still / closed-immersion hold. Query-only mirror; not rendered. */
  hold_s?: number | null
  /** Valve state for valve brewers ("closed" | "open" | "Dial 5"); null otherwise. Query-only; transitions live in `detail`. */
  valve?: string | null
  /** The readable technique line. Pattern / agitation / kettle stance / drain-reclose all live here as prose. */
  detail?: string | null
}

const POUR_STEP_TYPES = ['bloom', 'pour'] as const

function cleanNumber(v: unknown): number | null | 'invalid' {
  if (v === null || v === undefined || v === '') return null
  const n = typeof v === 'number' ? v : Number(v)
  if (!Number.isFinite(n) || n < 0) return 'invalid'
  return n
}

/**
 * Validate + normalize a structured pours array. Mirrors cleanModifiers /
 * cleanFlavors (CleanResult). Drops unknown keys, coerces numerics, trims
 * strings (empty → null), and enforces the bloom-at-index-0 invariant the
 * render relies on. Errors aggregate into one message.
 */
export function cleanPours(input: unknown): CleanResult<PourStep[]> {
  if (input === null || input === undefined) return { ok: true, value: [] }
  if (!Array.isArray(input)) return { ok: false, error: 'pours must be an array of step objects' }

  const errors: string[] = []
  const out: PourStep[] = []

  input.forEach((raw, i) => {
    if (typeof raw !== 'object' || raw === null) {
      errors.push(`pours[${i}] must be an object`)
      return
    }
    const r = raw as Record<string, unknown>

    const type = r.type
    if (type !== 'bloom' && type !== 'pour') {
      errors.push(`pours[${i}].type must be one of: ${POUR_STEP_TYPES.join(' | ')}`)
      return
    }
    if (type === 'bloom' && i !== 0) {
      errors.push(`pours[${i}].type='bloom' is only valid at index 0 (bloom is always the first step)`)
    }

    const at = typeof r.at === 'string' ? r.at.trim() : ''
    if (!at) {
      errors.push(`pours[${i}].at (start time "m:ss") is required`)
    }

    const step: PourStep = { type, at }

    const toG = cleanNumber(r.to_g)
    if (toG === 'invalid') errors.push(`pours[${i}].to_g must be a positive number or null`)
    else if (toG !== null) step.to_g = toG

    const pourS = cleanNumber(r.pour_s)
    if (pourS === 'invalid') errors.push(`pours[${i}].pour_s must be a number ≥ 0 or null`)
    else if (pourS !== null) step.pour_s = pourS

    const holdS = cleanNumber(r.hold_s)
    if (holdS === 'invalid') errors.push(`pours[${i}].hold_s must be a number ≥ 0 or null`)
    else if (holdS !== null) step.hold_s = holdS

    if (r.valve != null) {
      if (typeof r.valve !== 'string') errors.push(`pours[${i}].valve must be a string or null`)
      else if (r.valve.trim()) step.valve = r.valve.trim()
    }
    if (r.detail != null) {
      if (typeof r.detail !== 'string') errors.push(`pours[${i}].detail must be a string or null`)
      else if (r.detail.trim()) step.detail = r.detail.trim()
    }

    out.push(step)
  })

  if (errors.length) return { ok: false, error: errors.join('; ') }
  return { ok: true, value: out }
}

/**
 * Map a structured pours array to timeline rows for SspTimeline. bloom →
 * "Bloom"; pours number sequentially (1-based, excluding bloom). `t` is the
 * start time; `desc` leads with the cumulative target then the prose detail.
 * valve / pour_s / hold_s are deliberately NOT surfaced here — query-only.
 */
export function pourTimelineRows(pours: PourStep[]): { t: string; label: string; desc: string }[] {
  let pourN = 0
  return pours.map((step) => {
    const label = step.type === 'bloom' ? 'Bloom' : `Pour ${++pourN}`
    const desc = [step.to_g != null ? `→ ${step.to_g}g` : null, step.detail || null]
      .filter(Boolean)
      .join(' · ')
    return { t: step.at || '·', label, desc }
  })
}

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
