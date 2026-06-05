// Cluster 2 (item #31) — cupping_date / rest_days consistency guard.
//
// Voice-to-text date slips are a real transcript-drift class: a bare "March 31"
// dictated with no day-of-week can land a cupping_date that precedes the roast,
// writing nonsense rest_days like -23. This helper is the single source of truth
// for the date bounds; called by persistCupping / patchCupping before persistence
// (mirrors lib/mcp/end-condition-bounds.ts).
//
// Rules (each returns a readable error string, or null when clean):
//   1. rest_days < 0                          -> always reject (no valid roast precedes its cupping)
//   2. cupping_date < roast_date + 1 day      -> reject (a cup is evaluated at least a day after roast;
//                                                 the V4 gate is Day 7. Same-day or earlier = a date slip)
//   3. |rest_days - (cupping_date - roast_date)| > 1 -> reject (supplied rest_days disagrees with the
//                                                 dates; ±1 day tolerance absorbs timezone / boundary slips)
//
// Date-dependent checks (2 + 3) are skipped when roast_date or cupping_date is
// absent — cupping_date is optional on the payload, and a missing roast_date
// (roast row not found / unset) means there's nothing to compare against. Rule 1
// always fires because it needs neither date.

// Parse a YYYY-MM-DD date string to a UTC day-count (days since epoch). Returns
// null for anything that isn't a clean calendar date so a malformed value falls
// through to "skip" rather than throwing.
function toUtcDayNumber(date: string | null | undefined): number | null {
  if (date == null) return null
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(date.trim())
  if (!m) return null
  const ms = Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  if (Number.isNaN(ms)) return null
  return Math.round(ms / 86_400_000)
}

const REST_DAYS_TOLERANCE = 1

export function checkCuppingDateConsistency(
  roastDate: string | null | undefined,
  cuppingDate: string | null | undefined,
  restDays: number | null | undefined,
): string | null {
  // Rule 1 — negative rest_days is invalid regardless of the dates.
  if (restDays != null && restDays < 0) {
    return `rest_days ${restDays} is negative - a cupping cannot precede its roast. Likely a voice-to-text date slip on cupping_date.`
  }

  const roastDay = toUtcDayNumber(roastDate)
  const cuppingDay = toUtcDayNumber(cuppingDate)
  if (roastDay == null || cuppingDay == null) return null

  const deltaDays = cuppingDay - roastDay

  // Rule 2 — the cup is evaluated at least a day after the roast.
  if (deltaDays < 1) {
    return `cupping_date ${cuppingDate} must be at least 1 day after roast_date ${roastDate} (got ${deltaDays} day${deltaDays === 1 ? '' : 's'}). Likely a voice-to-text date slip.`
  }

  // Rule 3 — supplied rest_days must match the date arithmetic (±1 day).
  if (restDays != null && Math.abs(restDays - deltaDays) > REST_DAYS_TOLERANCE) {
    return `rest_days ${restDays} disagrees with (cupping_date - roast_date) = ${deltaDays} days (roast_date ${roastDate} to cupping_date ${cuppingDate}). Likely a date or rest_days slip.`
  }

  return null
}
