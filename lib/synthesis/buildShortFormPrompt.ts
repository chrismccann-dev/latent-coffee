// SYN-3 (Sprint 13) — 3rd-call prompt that digests the polished long-form
// capsule into a mobile-friendly short-form. Runs after the humanizer pass
// in runSynthesis (raw → humanizer → short-form). Cached separately on each
// of the 4 synthesis cache surfaces (terroirs / cultivars / roaster_syntheses
// / process_aggregation_syntheses) as the `short_form_capsule` column.
//
// Design intent ("synthesis of the synthesis"): the long-form is field-note
// prose at ~4-6 paragraphs + ~4-6 takeaways for mature corpora; the short-
// form collapses it to 1-2 paragraphs + 2-3 takeaways while preserving
// canonical vocabulary verbatim (humanizer-grade preservation list).
//
// See ADR-0010 for the 3-call cost-shape rationale (extends ADR-0002).

import type { SynthesisTier } from './buildPrompt'

interface BuildShortFormPromptInput {
  longForm: string
  entityName: string
  capsuleNoun: string
  tier: SynthesisTier
}

export function buildShortFormPrompt(input: BuildShortFormPromptInput): string {
  const { longForm, entityName, capsuleNoun, tier } = input

  // Tier-aware target shape — narrow corpora already produce short long-forms,
  // so the digest target stays the same (1-2 paragraphs / 2-3 takeaways) but
  // we vary the framing so the model doesn't over-shrink early-tier prose.
  const paragraphTarget = '1-2 paragraphs'
  const takeawayTarget = '2-3 takeaways'
  const tierHint =
    tier === 'early' || tier === 'emerging'
      ? 'The source is already narrow — preserve every concrete observation worth carrying forward; do not over-compress into vague abstractions.'
      : 'The source is broad — your job is to surface the load-bearing patterns, not to enumerate every signal. Drop edge cases and over-hedged caveats; keep the core tendencies.'

  return `You are condensing a polished knowledge capsule into a short-form version for mobile reading. The long-form is read on desktop; this short-form renders below the md: breakpoint alongside it.

Source: ${capsuleNoun} for ${entityName}.

Target shape:
- ${paragraphTarget} of field-note prose (each ~2-3 sentences).
- A bulleted list of ${takeawayTarget} (markdown \`*\` items, each one concrete sentence).
- No headers, no inline boldface, no markdown tables.

${tierHint}

Vocabulary preservation (HARD requirement — do NOT paraphrase these):
- Extraction strategies: Suppression, Clarity-First, Balanced Intensity, Full Expression, Extraction Push, Hybrid.
- Modifier types: output_selection, thermal_staging, aroma_capture, role_based_pulse, equipment.
- Gear / proper nouns: SWORKS, Melodrip, Hario Switch, Sibarist, Orea, EG-1, Picolot, Garrido, Janson, Diego Bermúdez, etc.
- Cultivar / process / signature-method names: Gesha, Pacamara, Sudan Rume, Moonshadow, TyOxidator, Anoxic, washed, natural, honey, anaerobic, yeast-inoculated, thermal shock, co-ferment.
- Roasting vocabulary (when present in source): primary lever, brewing tolerance, acceptable roast window, underdevelopment signal, overdevelopment signal, aromatic behavior, structural behavior, rest behavior, scope tags (process:* / variety:* / terroir:*).
- All temperature / grind / ratio numbers verbatim.
- Any cultivar / terroir / producer / farm / roaster proper noun the long-form names.

Anti-pattern to avoid: a generic 1-paragraph executive summary that drops every concrete signal. Keep the load-bearing observations; cut the connective tissue.

Output ONLY the final short-form text — no preamble, no "Short form:" header, no commentary.

Long-form source:

${longForm}`
}
