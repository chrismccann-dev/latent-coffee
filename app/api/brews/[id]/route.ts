import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  EXTRACTION_STRATEGIES,
  type ExtractionStrategy,
  findOrCreateCultivar,
  findOrCreateTerroir,
  type FindOrCreateResult,
} from '@/lib/brew-import'
import {
  BASE_PROCESSES,
  type BaseProcess,
  HONEY_SUBPROCESSES,
  type HoneySubprocess,
  FERMENTATION_LOOKUP,
  DRYING_LOOKUP,
  INTERVENTION_LOOKUP,
  EXPERIMENTAL_LOOKUP,
  DECAF_MODIFIERS,
  type DecafModifier,
  SIGNATURE_LOOKUP,
} from '@/lib/process-registry'
import { ROASTER_LOOKUP } from '@/lib/roaster-registry'
import { ROAST_LEVEL_LOOKUP } from '@/lib/roast-level-registry'
import { GRINDER_LOOKUP, isResolvableSetting } from '@/lib/grinder-registry'
import { PRODUCER_LOOKUP } from '@/lib/producer-registry'
import { BREWER_LOOKUP } from '@/lib/brewer-registry'
import { FILTER_LOOKUP } from '@/lib/filter-registry'
import { composeGrind } from '@/lib/brew-import'
import { cleanFlavors, cleanStructureTags, composeFlavorNotes } from '@/lib/flavor-registry'
import { cleanModifiers } from '@/lib/extraction-modifiers'
import type { CanonicalLookup } from '@/lib/canonical-registry'

// Whitelist for direct PATCH. `cultivar_id` / `terroir_id` are resolved
// server-side via findOrCreateCultivar / findOrCreateTerroir, not here.
const EDITABLE_FIELDS = [
  'coffee_name',
  'roaster',
  'producer',
  'variety',
  'process',
  'roast_level',
  'flavor_notes',
  'flavors',
  'structure_tags',
  'brewer',
  'filter',
  'dose_g',
  'water_g',
  'ratio',
  'grind',
  'grinder',
  'grind_setting',
  'temp_c',
  'bloom',
  'pour_structure',
  'total_time',
  'extraction_strategy',
  'extraction_confirmed',
  'modifiers',
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
  'base_process',
  'subprocess',
  'fermentation_modifiers',
  'drying_modifiers',
  'intervention_modifiers',
  'experimental_modifiers',
  'decaf_modifier',
  'signature_method',
] as const

function resultToResponse(result: Extract<FindOrCreateResult, { ok: false }>) {
  return NextResponse.json(
    result.status === 400
      ? { error: 'validation', errors: [result.error] }
      : { error: result.error },
    { status: result.status },
  )
}

// Canonicalize a text-only-no-FK PATCH field with an `allowOverride` escape
// hatch (roaster / producer / grinder share this shape). Mutates `patch[field]`
// in place. Returns a 400 NextResponse to short-circuit, or null to continue.
function canonicalizeOverridable(
  patch: Record<string, unknown>,
  body: Record<string, unknown>,
  field: string,
  lookup: CanonicalLookup,
  overrideKey: string,
): NextResponse | null {
  if (!(field in patch)) return null
  const v = patch[field]
  if (v === '' || v === null) {
    patch[field] = null
    return null
  }
  if (typeof v !== 'string') {
    return NextResponse.json(
      { error: 'validation', errors: [`${field} must be a string`] },
      { status: 400 },
    )
  }
  const canonical = lookup.canonicalize(v)
  if (canonical) {
    patch[field] = canonical
    return null
  }
  if (body[overrideKey] === true) {
    patch[field] = v.trim()
    return null
  }
  return NextResponse.json(
    {
      error: 'validation',
      errors: [`${field} "${v}" is not in the canonical registry. Send ${overrideKey}:true to bypass.`],
    },
    { status: 400 },
  )
}

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

  const hasCanonicalKey = 'cultivar_name' in body || 'terroir_name' in body || 'country' in body
  if (Object.keys(patch).length === 0 && !hasCanonicalKey) {
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

  // Validate modifiers (Axis 2) against canonical shape.
  if ('modifiers' in patch) {
    const result = cleanModifiers(patch.modifiers)
    if (!result.ok) {
      return NextResponse.json(
        { error: 'validation', errors: [result.error] },
        { status: 400 },
      )
    }
    patch.modifiers = result.value
  }

  // Validate structured process fields against canonical registries.
  if ('base_process' in patch) {
    const v = patch.base_process
    if (v !== null && (typeof v !== 'string' || !BASE_PROCESSES.includes(v as BaseProcess))) {
      return NextResponse.json(
        { error: 'validation', errors: [`base_process must be one of: ${BASE_PROCESSES.join(', ')}`] },
        { status: 400 },
      )
    }
  }
  if ('subprocess' in patch) {
    const v = patch.subprocess
    if (v !== null && v !== '' && (typeof v !== 'string' || !HONEY_SUBPROCESSES.includes(v as HoneySubprocess))) {
      return NextResponse.json(
        { error: 'validation', errors: [`subprocess must be one of: ${HONEY_SUBPROCESSES.join(', ')}`] },
        { status: 400 },
      )
    }
    if (v === '') patch.subprocess = null
  }
  for (const [key, lookup] of [
    ['fermentation_modifiers', FERMENTATION_LOOKUP],
    ['drying_modifiers', DRYING_LOOKUP],
    ['intervention_modifiers', INTERVENTION_LOOKUP],
    ['experimental_modifiers', EXPERIMENTAL_LOOKUP],
  ] as const satisfies ReadonlyArray<readonly [string, CanonicalLookup]>) {
    if (!(key in patch)) continue
    const v = patch[key]
    if (!Array.isArray(v) || v.some((x) => typeof x !== 'string' || !lookup.isCanonical(x))) {
      return NextResponse.json(
        { error: 'validation', errors: [`${key} must be an array of canonical values`] },
        { status: 400 },
      )
    }
  }
  if ('decaf_modifier' in patch) {
    const v = patch.decaf_modifier
    if (v !== null && v !== '' && (typeof v !== 'string' || !DECAF_MODIFIERS.includes(v as DecafModifier))) {
      return NextResponse.json(
        { error: 'validation', errors: [`decaf_modifier must be one of: ${DECAF_MODIFIERS.join(', ')}`] },
        { status: 400 },
      )
    }
    if (v === '') patch.decaf_modifier = null
  }
  if ('signature_method' in patch) {
    const v = patch.signature_method
    if (v !== null && v !== '' && (typeof v !== 'string' || !SIGNATURE_LOOKUP.isResolvable(v))) {
      return NextResponse.json(
        { error: 'validation', errors: [`signature_method "${String(v)}" is not in the canonical registry`] },
        { status: 400 },
      )
    }
    if (v === '') patch.signature_method = null
  }

  // Roast level: strict canonical, canonicalize on write.
  if ('roast_level' in patch) {
    const v = patch.roast_level
    if (v === '' || v === null) {
      patch.roast_level = null
    } else if (typeof v !== 'string') {
      return NextResponse.json({ error: 'validation', errors: ['roast_level must be a string'] }, { status: 400 })
    } else {
      const canonical = ROAST_LEVEL_LOOKUP.canonicalize(v)
      if (!canonical) {
        return NextResponse.json(
          { error: 'validation', errors: [`roast_level "${v}" is not in the canonical registry`] },
          { status: 400 },
        )
      }
      patch.roast_level = canonical
    }
  }

  // Text-only-no-FK fields with allowOverride escape hatch. brews.roaster /
  // brews.producer / brews.grinder all share this shape: canonicalize via
  // their lookup, accept verbatim if `<field>_override` is true, else 400.
  const roasterErr = canonicalizeOverridable(patch, body, 'roaster', ROASTER_LOOKUP, 'roaster_override')
  if (roasterErr) return roasterErr
  const producerErr = canonicalizeOverridable(patch, body, 'producer', PRODUCER_LOOKUP, 'producer_override')
  if (producerErr) return producerErr
  const grinderErr = canonicalizeOverridable(patch, body, 'grinder', GRINDER_LOOKUP, 'grinder_override')
  if (grinderErr) return grinderErr
  const brewerErr = canonicalizeOverridable(patch, body, 'brewer', BREWER_LOOKUP, 'brewer_override')
  if (brewerErr) return brewerErr
  const filterErr = canonicalizeOverridable(patch, body, 'filter', FILTER_LOOKUP, 'filter_override')
  if (filterErr) return filterErr
  if ('grind_setting' in patch) {
    const v = patch.grind_setting
    if (v === '' || v === null) {
      patch.grind_setting = null
    } else if (typeof v !== 'string') {
      return NextResponse.json({ error: 'validation', errors: ['grind_setting must be a string'] }, { status: 400 })
    } else {
      const trimmed = v.trim()
      // Validate against the grinder's per-grinder enumerated settings.
      // Uses the grinder from this same patch when present (the form sends
      // both together). When grinder is absent from the patch, the setting
      // is accepted — the next save will catch it.
      const grinderForLookup = typeof patch.grinder === 'string' ? patch.grinder : null
      if (grinderForLookup && !isResolvableSetting(grinderForLookup, trimmed)) {
        return NextResponse.json(
          { error: 'validation', errors: [`grind_setting "${trimmed}" is not valid on ${grinderForLookup}`] },
          { status: 400 },
        )
      }
      patch.grind_setting = trimmed
    }
  }
  if ('flavors' in patch) {
    const result = cleanFlavors(patch.flavors)
    if (!result.ok) return NextResponse.json({ error: 'validation', errors: [result.error] }, { status: 400 })
    patch.flavors = result.value
    // flavor_notes is recomputed from flavors so back-compat reads stay aligned.
    patch.flavor_notes = composeFlavorNotes(result.value)
  }
  if ('structure_tags' in patch) {
    const result = cleanStructureTags(patch.structure_tags)
    if (!result.ok) return NextResponse.json({ error: 'validation', errors: [result.error] }, { status: 400 })
    patch.structure_tags = result.value
  }

  // Recompute legacy display column from structured pair when either changes.
  if ('grinder' in patch || 'grind_setting' in patch) {
    patch.grind = composeGrind({
      grinder: typeof patch.grinder === 'string' ? patch.grinder : null,
      grind_setting: typeof patch.grind_setting === 'string' ? patch.grind_setting : null,
    })
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

  if ('cultivar_name' in body) {
    const result = await findOrCreateCultivar(
      supabase,
      user.id,
      typeof body.cultivar_name === 'string' ? body.cultivar_name : null,
    )
    if (!result.ok) return resultToResponse(result)
    patch.cultivar_id = result.id
  }

  if ('terroir_name' in body || 'country' in body) {
    const result = await findOrCreateTerroir(
      supabase,
      user.id,
      typeof body.country === 'string' ? body.country : null,
      typeof body.terroir_name === 'string' ? body.terroir_name : null,
      typeof body.admin_region === 'string' ? body.admin_region : null,
      typeof body.meso_terroir === 'string' ? body.meso_terroir : null,
    )
    if (!result.ok) return resultToResponse(result)
    patch.terroir_id = result.id
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
