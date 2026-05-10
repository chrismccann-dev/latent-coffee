import { parsePourSteps } from '@/lib/pour-structure'

interface PourStructureListProps {
  pourStructure: string | null | undefined
}

/** Renders brews.pour_structure as one line per parsed step so the recipe
 *  reads as executable bullets at the kettle. Falls back to the original
 *  prose as a single line when no separator hits — see lib/pour-structure.ts
 *  for the cascade. */
export function PourStructureList({ pourStructure }: PourStructureListProps) {
  const steps = parsePourSteps(pourStructure)
  if (steps.length === 0) return null
  return (
    <div className="space-y-1.5 font-sans text-sm leading-relaxed">
      {steps.map((s, i) => (
        <div key={i}>{s.raw}</div>
      ))}
    </div>
  )
}
