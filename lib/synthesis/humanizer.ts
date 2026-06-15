// humanizer-skill.md is vendored verbatim from
// https://github.com/blader/humanizer (MIT). Resync periodically; do not
// edit in place. The runtime override below suppresses the skill's default
// multi-step Draft/Audit/Final output format so the polished text returns
// in one shot.
import path from 'path'
import fs from 'fs'
import Anthropic from '@anthropic-ai/sdk'

let cachedSkill: string | null = null

function loadHumanizerSkill(): string {
  if (cachedSkill) return cachedSkill
  const skillPath = path.join(process.cwd(), 'lib/synthesis/humanizer-skill.md')
  cachedSkill = fs.readFileSync(skillPath, 'utf8')
  return cachedSkill
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const USER_OVERRIDE = `Humanize the synthesis below.

Important overrides to your default Process and Output Format:
- Skip the multi-step "Draft → Audit → Final" walkthrough. Output ONLY the final humanized text. No preamble, no change-summary, no section headers like "Final rewrite".
- Preserve domain vocabulary verbatim: extraction-strategy names (Suppression, Clarity-First, Balanced Intensity, Full Expression, Extraction Push, Hybrid), gear (SWORKS, Melodrip, Hario Switch, Sibarist, Orea), proper nouns (producer + farm + roaster names like Picolot, Garrido, Janson, Diego Bermúdez), cultivar names (Gesha, Pacamara, Bourbon, Mokka), and process terms (washed / natural / honey / anaerobic / yeast-inoculated / thermal shock / co-ferment / Moonshadow / TyOxidator).
- Preserve any other Latent canonical term verbatim, including: signature methods (proper-name proprietary techniques such as Alchemy, TIM, XO, Enzyflow, Bio-innovation, Sous-vide, Amazake, Anti-maceration, Dynamic cherry, Dry fermentation, Splash, Symbiotic, Wave Hybrid); fermentation qualifiers (e.g. Anoxic); drying / intervention / experimental modifier names (Slow Dry, Raised Bed, Dark Room Dried, Carbonic Maceration, Lactic, Double Anaerobic); honey color tiers (White / Yellow / Red / Black / Purple Honey); and any specific cultivar / terroir / producer / farm / roaster proper noun the synthesis names — even when it is not in the example list above.
- Preserve roasting-side vocabulary verbatim when the synthesis names it (Sprint 13 cross-source capsules carry these from the roast_learnings carry-forward block): primary lever, brewing tolerance, acceptable roast window, underdevelopment signal, overdevelopment signal, aromatic behavior, structural behavior, rest behavior, and scope tags (\`process:*\` / \`variety:*\` / \`terroir:*\` / \`general\`) — do not paraphrase any of these into looser language.
- Preserve the Latent taste-apex vocabulary verbatim when the synthesis names it: layered-evolving (the canonical apex term — multidimensional and in motion across the temperature + structural arcs) and its antonym one-dimensional — do not paraphrase these into "complex", "expressive", "loud", or "flat".
- Preserve any temperature/grind/ratio numbers verbatim.
- Preserve markdown bullet structure if present (the final paragraph block is often a list of practical takeaways — do not collapse it into prose).
- Keep paragraph breaks. Do not merge paragraphs into one wall of text.

Synthesis to humanize:

`

export async function applyHumanizer(rawText: string): Promise<string> {
  if (!rawText.trim()) return rawText
  const skill = loadHumanizerSkill()

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    system: skill,
    messages: [{ role: 'user', content: USER_OVERRIDE + rawText }],
  })

  const polished = message.content[0].type === 'text' ? message.content[0].text : null
  return polished?.trim() || rawText
}
