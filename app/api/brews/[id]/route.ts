import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { EXTRACTION_STRATEGIES, type ExtractionStrategy } from '@/lib/brew-import'

// Fields the edit form is allowed to PATCH. Excludes identity + audit columns
// (id/user_id/created_at/updated_at) and the classification FKs that live in
// a canonical registry (terroir_id/cultivar_id are updatable but only to
// existing rows — the form enforces "select from existing", no creation).
const EDITABLE_FIELDS = [
  'coffee_name',
  'roaster',
  'producer',
  'variety',
  'process',
  'roast_level',
  'flavor_notes',
  'terroir_id',
  'cultivar_id',
  'brewer',
  'filter',
  'dose_g',
  'water_g',
  'ratio',
  'grind',
  'temp_c',
  'bloom',
  'pour_structure',
  'total_time',
  'extraction_strategy',
  'extraction_confirmed',
  'aroma',
  'attack',
  'mid_palate',
  'body',
  'finish',
  'temperature_evolution',
  'peak_expression',
  'key_takeaways',
  'classification',
  'terroir_connection',
  'cultivar_connection',
  'what_i_learned',
  'is_process_dominant',
  'process_category',
  'process_details',
] as const

type EditableField = (typeof EDITABLE_FIELDS)[number]

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 })
  }

  // Whitelist: only pull fields from EDITABLE_FIELDS into the update patch.
  const patch: Record<string, unknown> = {}
  for (const key of EDITABLE_FIELDS) {
    if (key in body) patch[key] = body[key]
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'no editable fields in body' }, { status: 400 })
  }

  // Validate extraction_strategy against canonical list if provided.
  if ('extraction_strategy' in patch) {
    const s = patch.extraction_strategy
    if (s !== null && s !== '' && !EXTRACTION_STRATEGIES.includes(s as ExtractionStrategy)) {
      return NextResponse.json(
        {
          error: 'validation',
          errors: [`extraction_strategy must be one of: ${EXTRACTION_STRATEGIES.join(', ')} (got "${String(s)}")`],
        },
        { status: 400 }
      )
    }
    if (s === '') patch.extraction_strategy = null
  }

  // Require coffee_name to be non-empty when provided (can't clear it).
  if ('coffee_name' in patch) {
    const name = typeof patch.coffee_name === 'string' ? patch.coffee_name.trim() : ''
    if (!name) {
      return NextResponse.json(
        { error: 'validation', errors: ['coffee_name cannot be empty'] },
        { status: 400 }
      )
    }
    patch.coffee_name = name
  }

  // RLS scopes to the owning user; `.eq('user_id')` is belt-and-suspenders.
  const { data, error } = await supabase
    .from('brews')
    .update(patch)
    .eq('id', params.id)
    .eq('user_id', user.id)
    .select('id')
    .single()

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || 'brew update failed' },
      { status: error?.code === 'PGRST116' ? 404 : 500 }
    )
  }

  return NextResponse.json({ ok: true, brewId: data.id })
}
