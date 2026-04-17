import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Brew, Terroir, Cultivar } from '@/lib/types'
import { EditBrewForm } from './EditBrewForm'

export default async function EditBrewPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) notFound()

  const [{ data: brew, error: brewErr }, { data: terroirs }, { data: cultivars }] = await Promise.all([
    supabase.from('brews').select('*').eq('id', params.id).eq('user_id', user.id).single(),
    supabase
      .from('terroirs')
      .select('id, country, admin_region, macro_terroir, meso_terroir')
      .eq('user_id', user.id)
      .order('country', { ascending: true }),
    supabase
      .from('cultivars')
      .select('id, cultivar_name, lineage, genetic_family')
      .eq('user_id', user.id)
      .order('cultivar_name', { ascending: true }),
  ])

  if (brewErr || !brew) notFound()

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Link
        href={`/brews/${params.id}`}
        className="font-mono text-xs text-latent-mid hover:text-latent-fg mb-6 inline-block"
      >
        ← Back to brew
      </Link>

      <h1 className="font-sans text-2xl font-semibold mb-1">Edit brew</h1>
      <p className="font-mono text-xs text-latent-mid mb-6">{brew.coffee_name}</p>

      <EditBrewForm
        brew={brew as Brew}
        terroirs={(terroirs || []) as Pick<Terroir, 'id' | 'country' | 'admin_region' | 'macro_terroir' | 'meso_terroir'>[]}
        cultivars={(cultivars || []) as Pick<Cultivar, 'id' | 'cultivar_name' | 'lineage' | 'genetic_family'>[]}
      />
    </div>
  )
}
