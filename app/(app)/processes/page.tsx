import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import {
  PROCESS_FAMILIES,
  getProcessFamily,
  getFamilyColor,
  type ProcessFamily,
} from '@/lib/process-families'

interface ProcessGroup {
  process: string
  brewCount: number
}

type FamilyKey = ProcessFamily | 'Other'

export default async function ProcessesPage() {
  const supabase = createClient()

  const { data: brews, error } = await supabase
    .from('brews')
    .select('id, process')

  if (error) console.error('Error fetching brews:', error)

  // Build family → process groups with brew counts
  const familyMap: Record<string, ProcessGroup[]> = {}

  for (const brew of brews || []) {
    if (!brew.process) continue
    const family = getProcessFamily(brew.process)
    if (!familyMap[family]) familyMap[family] = []

    const existing = familyMap[family].find(g => g.process === brew.process)
    if (existing) {
      existing.brewCount += 1
    } else {
      familyMap[family].push({ process: brew.process, brewCount: 1 })
    }
  }

  // Sort processes within each family by brew count desc, then name asc
  for (const groups of Object.values(familyMap)) {
    groups.sort((a, b) => b.brewCount - a.brewCount || a.process.localeCompare(b.process))
  }

  // Emit families in canonical order, appending "Other" if present
  const familyOrder: FamilyKey[] = [
    ...PROCESS_FAMILIES,
    ...(familyMap['Other'] ? ['Other' as const] : []),
  ]
  const orderedFamilies = familyOrder.filter(f => familyMap[f]?.length)

  const totalProcesses = Object.values(familyMap).reduce((sum, groups) => sum + groups.length, 0)

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-mono text-xs font-semibold tracking-wide uppercase text-latent-mid">
          PROCESSES
        </h1>
        <div className="font-mono text-xs text-latent-mid">
          {totalProcesses} {totalProcesses === 1 ? 'PROCESS' : 'PROCESSES'}
        </div>
      </div>

      {totalProcesses === 0 ? (
        <div className="text-center py-16">
          <p className="font-mono text-sm text-latent-mid">NO PROCESSES YET</p>
        </div>
      ) : (
        <div className="space-y-8">
          {orderedFamilies.map((family) => {
            const groups = familyMap[family]
            const color = getFamilyColor(family)
            return (
              <div key={family}>
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-4 h-4 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <h2 className="font-mono text-xs font-semibold tracking-wide uppercase text-latent-mid">
                    {family} ({groups.length})
                  </h2>
                </div>

                <div className="space-y-0">
                  {groups.map((group) => (
                    <Link
                      key={group.process}
                      href={`/processes/${encodeURIComponent(group.process)}`}
                      className="flex items-center gap-3 py-3 border-b border-latent-border hover:bg-white transition-colors group"
                    >
                      <div
                        className="w-10 h-10 rounded flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <div className="flex-1">
                        <div className="font-sans text-sm font-semibold">
                          {group.process}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="font-mono text-xs text-latent-mid">
                          {group.brewCount} {group.brewCount === 1 ? 'coffee' : 'coffees'}
                        </div>
                        <span className="font-mono text-xs text-latent-mid opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
