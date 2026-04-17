import { getStrategyStyle } from '@/lib/extraction-strategy'

interface StrategyPillProps {
  strategy: string | null | undefined
  // 'row': bordered pill with full strategy name, used in coffee-row lists.
  // 'card': borderless rounded-full pill with abbreviated label, used on brew covers.
  variant?: 'row' | 'card'
}

export function StrategyPill({ strategy, variant = 'row' }: StrategyPillProps) {
  const style = getStrategyStyle(strategy)
  if (!style) return null

  if (variant === 'card') {
    return (
      <span
        className="font-mono text-[8px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0"
        style={{ backgroundColor: style.bg, color: style.text }}
      >
        {style.short}
      </span>
    )
  }

  return (
    <span
      className="font-mono text-[9px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded border"
      style={{
        backgroundColor: style.bg,
        color: style.text,
        borderColor: style.border,
      }}
    >
      {strategy}
    </span>
  )
}
