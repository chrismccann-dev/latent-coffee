interface SaveGateWarningProps {
  // Each entry: when `met` is false, the message renders. Renders null when all met.
  requirements: ReadonlyArray<{ met: boolean; message: string }>
}

export function SaveGateWarning({ requirements }: SaveGateWarningProps) {
  const unmet = requirements.filter((r) => !r.met)
  if (unmet.length === 0) return null
  return (
    <div className="mb-4 p-3 border border-amber-300 bg-amber-50 rounded">
      <div className="font-mono text-xxs font-semibold text-amber-800 mb-1">CANNOT SAVE YET</div>
      <ul className="text-sm text-amber-900 list-disc ml-5">
        {unmet.map((r, i) => (
          <li key={i}>{r.message}</li>
        ))}
      </ul>
    </div>
  )
}
