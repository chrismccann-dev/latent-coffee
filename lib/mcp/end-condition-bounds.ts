// Sprint 3.2 (item #3) — end_condition cross-field bounds.
//
// The numeric `end_condition_value` / `end_condition_target` has different
// meaning depending on the `end_condition` / `end_condition_type` label:
//   - bean_temp / BEAN_TEMP → °C (Chris's window 198-208; widened for buffer)
//   - dev_time / DEV_TIME / DTR / TOTAL_TIME → seconds
//   - manual / NONE → no target; should be null (0 accepted on NONE per Roest API)
//
// Round-2 review surfaced that nothing was catching a pair like
// (bean_temp, 30) — would post to the Roest API and silently land an
// impossibly-cold drop trigger. This helper is the single source of truth
// for the bounds; called by push_roast / patch_roast / push_roast_recipe /
// patch_roast_recipe / push_roast_profile handlers before persistence.

const BEAN_TEMP_RANGE: readonly [number, number] = [100, 250]
const TIME_RANGE: readonly [number, number] = [0, 2000]

export function checkEndConditionBounds(
  type: string | null | undefined,
  value: number | null | undefined,
): string | null {
  if (type == null || type === '') return null
  if (value == null) return null

  const t = type.toLowerCase()

  if (t === 'manual' || t === 'none') {
    return value !== 0
      ? `end_condition_target ${value} must be null (or 0 for NONE) when end_condition_type is "${type}" — drop is operator-controlled with no machine target.`
      : null
  }
  if (t === 'bean_temp') {
    const [lo, hi] = BEAN_TEMP_RANGE
    if (value < lo || value > hi) {
      return `end_condition_target ${value}°C out of plausible range [${lo}, ${hi}] for bean_temp drop. Typical Chris window: 198-208°C.`
    }
    return null
  }
  if (t === 'dev_time' || t === 'total_time' || t === 'dtr') {
    const [lo, hi] = TIME_RANGE
    if (value < lo || value > hi) {
      return `end_condition_target ${value}s out of plausible range [${lo}, ${hi}] seconds for ${type} drop.`
    }
    return null
  }

  return null
}
