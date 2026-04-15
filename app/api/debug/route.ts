import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createClient()

  // Get all distinct variety values from brews
  const { data: brews } = await supabase
    .from('brews')
    .select('variety')

  const varieties = Array.from(new Set((brews || []).map((b: any) => b.variety).filter(Boolean))).sort()

  // Get all cultivars with lineage
  const { data: cultivars } = await supabase
    .from('cultivars')
    .select('id, lineage, cultivar_name, genetic_family')
    .order('lineage')

  return NextResponse.json({
    distinctVarieties: varieties,
    cultivars: (cultivars || []).map((c: any) => ({
      id: c.id.slice(0, 8),
      lineage: c.lineage,
      cultivar_name: c.cultivar_name,
      family: c.genetic_family,
    })),
  })
}
