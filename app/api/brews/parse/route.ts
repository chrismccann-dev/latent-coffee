import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import {
  parseSpreadsheetRow,
  matchTerroir,
  matchCultivar,
  terroirInRegistry,
  cultivarInRegistry,
  detectDrift,
  TERROIR_REGISTRY,
  CULTIVAR_REGISTRY,
  EXTRACTION_STRATEGIES,
  GENETIC_FAMILIES,
  type BrewPayload,
  type TerroirCandidate,
  type CultivarCandidate,
  type TerroirMatch,
  type CultivarMatch,
} from '@/lib/brew-import'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function buildPrompt(text: string): string {
  return `You are helping archive a purchased coffee into a research journal. Extract structured data from the pasted notes below and return a JSON object matching the schema. Return ONLY valid JSON — no prose, no markdown fences.

Schema:
{
  "coffee_name": string,
  "roaster": string | null,
  "producer": string | null,
  "variety": string | null,
  "process": string | null,
  "roast_level": string | null,
  "flavor_notes": string[] | null,
  "terroir": {
    "country": string,
    "admin_region": string | null,
    "macro_terroir": string | null,
    "meso_terroir": string | null,
    "elevation_min": number | null,
    "elevation_max": number | null,
    "climate_stress": string | null
  },
  "cultivar": {
    "cultivar_name": string,
    "species": "Arabica" | "Robusta" | string,
    "genetic_family": ${GENETIC_FAMILIES.map((f) => `"${f}"`).join(' | ')} | null,
    "lineage": string | null
  },
  "brewer": string | null,
  "filter": string | null,
  "dose_g": number | null,
  "water_g": number | null,
  "ratio": string | null,
  "grind": string | null,
  "temp_c": number | null,
  "bloom": string | null,
  "pour_structure": string | null,
  "total_time": string | null,
  "extraction_strategy": ${EXTRACTION_STRATEGIES.map((s) => `"${s}"`).join(' | ')} | null,
  "extraction_confirmed": string | null,
  "modifiers": Modifier[] | null,
  "aroma": string | null,
  "attack": string | null,
  "mid_palate": string | null,
  "body": string | null,
  "finish": string | null,
  "temperature_evolution": string | null,
  "peak_expression": string | null,
  "key_takeaways": string[] | null,
  "classification": string | null,
  "terroir_connection": string | null,
  "cultivar_connection": string | null,
  "what_i_learned": string | null,
  "is_process_dominant": boolean | null,
  "process_category": string | null,
  "process_details": string | null
}

Rules:
- Normalize marketing names to canonical cultivar names. If the notes say "Geisha" or "Gesha" and the country is Panama, use "Gesha (Panamanian selection)". Colombia → "Gesha (Colombian selection)". Brazil → "Gesha (Brazilian selection)". Ethiopia (landrace origin) → "Gesha" or "Gesha 1931" if stated.
- The canonical macro_terroir registry (country → macro_terroir) is:
${TERROIR_REGISTRY.map((t) => `  • ${t.country} → ${t.macro_terroir} (${t.admin_region})`).join('\n')}
  If the roaster's region maps to one of these, use the canonical macro_terroir name. Otherwise pick the best ecological macro-region name (not an administrative name).
- The canonical cultivar registry (${CULTIVAR_REGISTRY.length} entries) includes: ${CULTIVAR_REGISTRY.map((c) => c.cultivar_name).join(', ')}.
- extraction_strategy must be one of: ${EXTRACTION_STRATEGIES.join(', ')}. If not explicitly stated, infer from context or leave null. Mechanics-vs-intent matters here: "Suppression" and "Clarity-First" share coarse/low-temp/low-agitation mechanics but differ in intent (Suppression holds an over-expressive co-ferment back; Clarity-First protects a delicate cup); "Full Expression" and "Extraction Push" both use fine grind + high temp but differ in agitation (Full Expression is high agitation, used to develop heavy co-ferments; Extraction Push uses Melodrip / low agitation to push yield on a clean coffee while preserving transparency).
- modifiers (Axis 2) is an array of optional, stackable techniques layered on top of any strategy. Most brews have none — only include when the notes explicitly mention them. Shape per modifier:
  • { "type": "output_selection", "form": "early_cut" | "late_cut" | "both", "brew_weight": number | null, "cup_yield": number | null, "notes": string | null } — discarding portions of the extraction curve to reshape the cup. brew_weight and cup_yield are grams (brewed vs. served).
  • { "type": "inverted_temperature_staging", "phases": string | null } — starting low and ending high, opposite of natural decline. e.g. "86°C → 92°C across two phases".
  • { "type": "aroma_capture", "application": string | null } — mid-brew cooling of the early extract fraction to preserve aromatics. e.g. "Paragon ball on bloom + Pour 1".
  • { "type": "immersion", "application": string | null } — switch-style or multi-stage immersion brewing (full immersion, staged immersion, or hybrid immersion-to-percolation). e.g. "Hario Switch closed 0-1:30 then opened for percolation finish" or "full immersion 3:00 then drained".
  Return [] (empty array) or null when no modifiers are mentioned.
- key_takeaways: 5-7 short bullet strings covering primary levers, extraction ceiling/floor, cooling behavior, reference transferability, cross-coffee insights.
- Unknown fields → null. Do not invent data.

Pasted notes:
-----
${text}
-----
`
}

function extractJson(raw: string): any {
  // Strip common markdown fences if Claude adds them
  const cleaned = raw.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim()
  // Find first { and last } to tolerate leading/trailing prose
  const first = cleaned.indexOf('{')
  const last = cleaned.lastIndexOf('}')
  if (first < 0 || last < 0) throw new Error('no JSON object found in model output')
  return JSON.parse(cleaned.slice(first, last + 1))
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { text?: string; useClaude?: boolean } | null
  if (!body?.text?.trim()) {
    return NextResponse.json({ error: 'text required' }, { status: 400 })
  }

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  // Always try the deterministic parser first — it's free and handles Chris's
  // structured paste in one pass.
  const deterministic = parseSpreadsheetRow(body.text) as Partial<BrewPayload> | null

  let payload: Partial<BrewPayload> = deterministic ?? {}
  let usedClaude = false

  const wantClaude = body.useClaude !== false // default ON
  const deterministicInsufficient =
    !deterministic ||
    !deterministic.terroir?.country ||
    !deterministic.cultivar?.cultivar_name ||
    !deterministic.coffee_name

  if (wantClaude && deterministicInsufficient) {
    if (!process.env.ANTHROPIC_API_KEY) {
      // If deterministic produced *something* usable, continue without Claude
      // rather than 500ing. Only hard-fail when we have nothing.
      if (!deterministic || Object.keys(deterministic).length === 0) {
        return NextResponse.json(
          { error: 'Claude parsing unavailable: ANTHROPIC_API_KEY not configured, and deterministic parse produced nothing' },
          { status: 500 }
        )
      }
      // Fall through with deterministic-only payload
    } else {
    try {
      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 2000,
        messages: [{ role: 'user', content: buildPrompt(body.text) }],
      })
      const raw = message.content[0].type === 'text' ? message.content[0].text : ''
      const parsed = extractJson(raw)
      // Merge deterministic on top of Claude output so explicit paste wins
      payload = { ...(parsed || {}), ...payload, terroir: { ...(parsed?.terroir || {}), ...(payload.terroir || {}) } as TerroirCandidate, cultivar: { ...(parsed?.cultivar || {}), ...(payload.cultivar || {}) } as CultivarCandidate }
      usedClaude = true
    } catch (err: any) {
      console.error('Claude parse failed:', err?.message || err)
      return NextResponse.json(
        { error: 'Claude parse failed', detail: err?.message || String(err) },
        { status: 500 }
      )
    }
    }
  }

  // Annotate terroir/cultivar with match info against user's DB
  let terroirMatch: TerroirMatch | null = null
  let cultivarMatch: CultivarMatch | null = null
  if (payload.terroir?.country) {
    terroirMatch = await matchTerroir(supabase, user.id, payload.terroir as TerroirCandidate)
  }
  if (payload.cultivar?.cultivar_name) {
    cultivarMatch = await matchCultivar(supabase, user.id, payload.cultivar as CultivarCandidate)
  }

  const drift = detectDrift(payload as BrewPayload)

  return NextResponse.json({
    parsed: payload,
    terroirMatch,
    cultivarMatch,
    usedClaude,
    drift,
    registryInfo: {
      terroirInRegistry: payload.terroir?.country
        ? terroirInRegistry(payload.terroir.country, payload.terroir.macro_terroir || null)
        : false,
      cultivarInRegistry: payload.cultivar?.cultivar_name
        ? cultivarInRegistry(payload.cultivar.cultivar_name)
        : false,
    },
  })
}
