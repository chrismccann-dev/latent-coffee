import { readFile } from 'fs/promises'
import path from 'path'

// Doc URI -> repo-relative file path. Multi-doc support added Sprint 2.4 alongside
// the section-anchor parser for `propose_doc_changes`. The 10 taxonomy MD files are
// surfaced so claude.ai's "Coffee Brewing" project no longer has to paste-and-drift.
const TAXONOMY_AXES = [
  'regions',
  'varieties',
  'processes',
  'roasters',
  'producers',
  'brewers',
  'filters',
  'flavors',
  'grinders',
  'roast-levels',
  'sworks',
] as const

export type TaxonomyAxis = (typeof TAXONOMY_AXES)[number]

const PROMPT_FILES = [
  // Brewing-side prompts (4)
  'start-brew',
  'log-brew',
  'propose-doc-changes-from-brew',
  'bundled-brewing-completion',
  // Roasting-side prompts (4) - V-set lifecycle (2026-05-14 rewrite)
  'start-lot',
  'log-roast',
  'log-cupping',
  'close-lot',
  // Roasting-side prompts (2) - one-shot lifecycle (2026-05-15 sprint)
  'one-shot',
  'one-shot-closeout',
] as const

// Composable sub-skills architecture (2026-05-26, ADR-0011 / ADR-0012 / ADR-0013).
// Wave 1 (2026-05-26): Master Coordinator catalog + Brewing Equipment Expert cluster.
// Wave 2 PR 1 (2026-05-26): WBC Brewing + Roasting Archivists (paired ship).
// Subsequent waves add Historians (Wave 2 PRs 2/3), Workflow tier (Wave 3), and CCIL (Wave 4).
// Each new skill file landing here must be (a) added below, (b) covered by the
// `./docs/skills/**/*.md` glob in next.config.js, and (c) described in
// DOC_DESCRIPTIONS. Run `npm run check:mcp-bundle` before shipping.
const SKILL_FILES: Record<string, string> = {
  // Master Coordinator (Wave 1)
  'docs://skills/coordinator/SKILL.md': 'docs/skills/coordinator/SKILL.md',
  'docs://skills/coordinator/catalog.md': 'docs/skills/coordinator/catalog.md',
  'docs://skills/coordinator/dispatch-rules.md': 'docs/skills/coordinator/dispatch-rules.md',
  'docs://skills/coordinator/handoff-rules.md': 'docs/skills/coordinator/handoff-rules.md',
  // Brewing Equipment Expert (Wave 1) — SKILL.md + 4 cluster files migrated from
  // docs/taxonomies/{brewers,filters,grinders,sworks}.md. Old taxonomy URIs above
  // continue resolving to ~200-byte redirect stubs for back-compat.
  'docs://skills/brewing-equipment-expert/SKILL.md': 'docs/skills/brewing-equipment-expert/SKILL.md',
  'docs://skills/brewing-equipment-expert/cluster/brewers.md': 'docs/skills/brewing-equipment-expert/cluster/brewers.md',
  'docs://skills/brewing-equipment-expert/cluster/filters.md': 'docs/skills/brewing-equipment-expert/cluster/filters.md',
  'docs://skills/brewing-equipment-expert/cluster/grinder-eg1.md': 'docs/skills/brewing-equipment-expert/cluster/grinder-eg1.md',
  'docs://skills/brewing-equipment-expert/cluster/sworks.md': 'docs/skills/brewing-equipment-expert/cluster/sworks.md',
  // WBC Brewing Archivist (Wave 2 PR 1) — SKILL.md + cluster files migrated from
  // docs/brewing/wbc-{reference,recipes}.md. Old paths above continue resolving to
  // ~200-byte redirect stubs for back-compat.
  'docs://skills/wbc-brewing-archivist/SKILL.md': 'docs/skills/wbc-brewing-archivist/SKILL.md',
  'docs://skills/wbc-brewing-archivist/cluster/wbc-reference.md': 'docs/skills/wbc-brewing-archivist/cluster/wbc-reference.md',
  'docs://skills/wbc-brewing-archivist/cluster/wbc-recipes.md': 'docs/skills/wbc-brewing-archivist/cluster/wbc-recipes.md',
  'docs://skills/wbc-brewing-archivist/cluster/per-strategy/suppression.md': 'docs/skills/wbc-brewing-archivist/cluster/per-strategy/suppression.md',
  'docs://skills/wbc-brewing-archivist/cluster/per-strategy/clarity-first.md': 'docs/skills/wbc-brewing-archivist/cluster/per-strategy/clarity-first.md',
  'docs://skills/wbc-brewing-archivist/cluster/per-strategy/balanced-intensity.md': 'docs/skills/wbc-brewing-archivist/cluster/per-strategy/balanced-intensity.md',
  'docs://skills/wbc-brewing-archivist/cluster/per-strategy/full-expression.md': 'docs/skills/wbc-brewing-archivist/cluster/per-strategy/full-expression.md',
  'docs://skills/wbc-brewing-archivist/cluster/per-strategy/extraction-push.md': 'docs/skills/wbc-brewing-archivist/cluster/per-strategy/extraction-push.md',
  'docs://skills/wbc-brewing-archivist/cluster/per-strategy/hybrid.md': 'docs/skills/wbc-brewing-archivist/cluster/per-strategy/hybrid.md',
  'docs://skills/wbc-brewing-archivist/cluster/canonical/wbc-tested-recipes.md': 'docs/skills/wbc-brewing-archivist/cluster/canonical/wbc-tested-recipes.md',
  // WBC Roasting Archivist (Wave 2 PR 1) — SKILL.md + cluster files migrated from
  // docs/roasting/wbc-{roasting,sourcing}.md. Old paths above continue resolving to
  // ~200-byte redirect stubs for back-compat. Sourcing tentatively merged here per
  // ADR-0011 Round 2 collapse; future split when sourcing research grows.
  'docs://skills/wbc-roasting-archivist/SKILL.md': 'docs/skills/wbc-roasting-archivist/SKILL.md',
  'docs://skills/wbc-roasting-archivist/cluster/wbc-roasting.md': 'docs/skills/wbc-roasting-archivist/cluster/wbc-roasting.md',
  'docs://skills/wbc-roasting-archivist/cluster/sourcing/strategy.md': 'docs/skills/wbc-roasting-archivist/cluster/sourcing/strategy.md',
  'docs://skills/wbc-roasting-archivist/cluster/sourcing/portfolio-lanes.md': 'docs/skills/wbc-roasting-archivist/cluster/sourcing/portfolio-lanes.md',
  'docs://skills/wbc-roasting-archivist/cluster/sourcing/priority-targets.md': 'docs/skills/wbc-roasting-archivist/cluster/sourcing/priority-targets.md',
  'docs://skills/wbc-roasting-archivist/cluster/canonical/wbc-tested-cultivars.md': 'docs/skills/wbc-roasting-archivist/cluster/canonical/wbc-tested-cultivars.md',
}

const DOC_FILES: Record<string, string> = {
  'docs://context.md': 'CONTEXT.md',
  'docs://brewing.md': 'BREWING.md',
  'docs://brewing/roasters.md': 'docs/brewing/roasters.md',
  'docs://brewing/wbc-reference.md': 'docs/brewing/wbc-reference.md',
  'docs://brewing/wbc-recipes.md': 'docs/brewing/wbc-recipes.md',
  'docs://roasting.md': 'ROASTING.md',
  'docs://roasting/archive.md': 'docs/roasting/archive.md',
  'docs://roasting/wbc-roasting.md': 'docs/roasting/wbc-roasting.md',
  'docs://roasting/wbc-sourcing.md': 'docs/roasting/wbc-sourcing.md',
  'docs://roasting/redesign.md': 'docs/roasting/redesign.md',
  'docs://roasting/dongzhe-livestream-2026-05.md': 'docs/roasting/dongzhe-livestream-2026-05.md',
  'docs://features/importer-exporter-scoping.md': 'docs/features/importer-exporter-scoping.md',
  ...SKILL_FILES,
  ...Object.fromEntries(
    TAXONOMY_AXES.map((axis) => [`docs://taxonomies/${axis}.md`, `docs/taxonomies/${axis}.md`]),
  ),
  ...Object.fromEntries(
    PROMPT_FILES.map((name) => [`docs://prompts/${name}.md`, `docs/prompts/${name}.md`]),
  ),
}

// Per-doc descriptions used in listDocs() catalog so claude.ai can route to the
// right doc without fetching first. New rule when adding a doc here: also write
// a one-sentence "use when..." description below. Without descriptions, claude.ai
// has only the title to go on (titles are short and mechanical).
const DOC_DESCRIPTIONS: Record<string, string> = {
  'docs://context.md':
    'Use when validating or looking up the meaning of any Latent-specific term — strict glossary across six clusters. Roasting workflow (V-set, batch slot, experiment frame, variable / lever / non-factor, roast→cup trace, taste-for, reference roast / reference cup / optimized brew, xBloom, control experiment, 3-axis Roast Character with primary lever / acceptable roast window / brewing tolerance, 4-state lifecycle, lot-close synthesis, forward design). Brewing workflow (Coffee Brief, Two-Axis Framework, extraction strategy, modifier, Named Consideration, WBC corpus check, Cooling-Curve Target, signal arbitration with variety / process / roaster signals, Strategy zone, Wrong-zone trap, Iteration loop, Iteration budget, Diminishing returns, Strategy pivot, Brewer rotation discipline, Hybrid sub-form, signature method). MCP / Sync Architecture (Latent MCP server, Tool vs Resource, dual-surface pattern, MCP-only input principle, role separation across claude.ai / Claude Code / Latent / Chris, asymmetric write trust, propose-then-apply, arbiter procedure). Canonical Registries (alias / override / lookup factory / find-or-create / canonical promotion). WBC Reference Materials (5-axis foundational map, 8 strategy families, Cross-cutting control patterns, Consciously-not-pursuing, full-map workflow accessibility). Synthesis Pipeline (entity-directed adapters, humanizer pass, aggregation eligibility). No implementation details; grown via /grill-with-docs sessions. Read this first before authoring any prose into Latent so terminology stays consistent.',
  'docs://brewing.md':
    'Use when planning a new brew recipe — contains the 6-strategy + 3-modifier Two-Axis framework, Step 1d Coffee Brief structure, equipment reference, and Cross-Coffee Insight Layer organized by strategy/modifier/process/variety.',
  'docs://brewing/roasters.md':
    'Use when working with a specific roaster — per-roaster brewing lessons + house-style cards (e.g. Hydrangea El Paraíso thermal-shock guidance, Sey extraction expectations). Reference for roaster-anchored brew design.',
  'docs://brewing/wbc-reference.md':
    '[MIGRATED in Wave 2 PR 1] Authoritative content lives at docs://skills/wbc-brewing-archivist/cluster/wbc-reference.md. This URI resolves to a redirect stub for back-compat with sessions still referencing the old path.',
  'docs://brewing/wbc-recipes.md':
    '[MIGRATED in Wave 2 PR 1] Authoritative content lives at docs://skills/wbc-brewing-archivist/cluster/wbc-recipes.md. This URI resolves to a redirect stub for back-compat with sessions still referencing the old path.',
  'docs://roasting.md':
    'Use when planning a roast on the Roest L200 Ultra (counterflow mode) — covers the New Coffee Onboarding Protocol (Steps 1-4), Standard Workflow, evaluation protocol (Day 7 pourover gate), fan/inlet curve templates, FC marking protocol, and per-coffee + cross-coffee insight layers.',
  'docs://roasting/archive.md':
    'Use when researching closed-lot roasting outcomes — per-lot Key Learnings, reference roast parameters, and structural takeaways from completed beans. Read before roasting a similar coffee.',
  'docs://roasting/wbc-roasting.md':
    '[MIGRATED in Wave 2 PR 1] Authoritative content lives at docs://skills/wbc-roasting-archivist/cluster/wbc-roasting.md. This URI resolves to a redirect stub for back-compat with sessions still referencing the old path.',
  'docs://roasting/wbc-sourcing.md':
    '[MIGRATED in Wave 2 PR 1] Authoritative content lives at docs://skills/wbc-roasting-archivist/cluster/sourcing/strategy.md. This URI resolves to a redirect stub for back-compat with sessions still referencing the old path.',
  'docs://roasting/redesign.md':
    'Use when implementing or extending the roasting-side data model / pages — series-level scope doc for the 7-sub-sprint roasting rebuild (Sub Pages 6.1-6.7, scoped + shipped 2026-05-13). Covers the lifecycle states, the new roast_recipes entity, the 16 cross-batch fields on experiments, MCP-only writes (deprecating /add for roasting), and the 4-page-shape index + waiting-for-roast + waiting-for-cupping + resolved layout. Read end-to-end before working on roasting pages or MCP Tool surface.',
  'docs://roasting/dongzhe-livestream-2026-05.md':
    'Use when scoping a new green-bean intake or anchor profile — long-form extraction of peer roaster Dongzhe\'s operational decision tree, captured 2026-05-17 from a Yunnan-Hatchi livestream on the same Roest L200 Ultra in counterflow mode as Chris. Provenance anchor for the green-physics-first framing (moisture/density picks the energy envelope, process picks stretch-vs-compress), the momentum-into-FC > weight-loss principle, the honey-process fork (washed-direction vs natural-direction), and the low-moisture / high-moisture energy adjustment rules. Holds the five operational deltas folded back into ROASTING.md + caveats (single-batch methodology, darker cup target, specific numbers don\'t transfer). Tier 2 reference signal - directional principles transfer, his specific numbers do not.',
  'docs://features/importer-exporter-scoping.md':
    'Use when discussing or scoping any future axis for coffee importers and exporters (currently unmodeled — `brews.producer` is the only supply-chain attribution today). Records the Sprint T3 / CR-3 scoping decision (Option C — unmodeled, deferred) + the four forward triggers that would re-open the question + concrete pain from the Nordic Approach alias drift that the override queue now catches. Read before authoring any importer-axis proposal so the prior decision and its reasons stay visible.',
  'docs://taxonomies/regions.md':
    'Use when validating or looking up a country/macro_terroir for a green bean or brew. 121 canonical macros across 38 countries; meso/locality stays free-text.',
  'docs://taxonomies/varieties.md':
    'Use when validating or looking up a cultivar — 63 canonical cultivars across 5 Arabica genetic families + 3 non-Arabica species. Aliases (e.g. "Geisha" → "Gesha") resolve at canonicalize time.',
  'docs://taxonomies/processes.md':
    'Use when decomposing a process into the composable taxonomy — 4 bases (Washed/Honey/Natural/Wet-hulled) + Honey color subprocesses + 4 modifier axes (fermentation/drying/intervention/experimental) + decaf + signature methods.',
  'docs://taxonomies/roasters.md':
    'Use when validating or looking up a roaster — 70 canonical roasters across 6 strategy families (Clarity-First / Balanced / Extraction-Forward / System / Varies / Self-Roasted). Includes BMR house-style cards.',
  'docs://taxonomies/producers.md':
    'Use when validating or looking up a producer — 120 canonical producers across 6 producer systems. Tier-scoped (60-70% comprehensive); allowOverride pattern for net-new entries.',
  'docs://taxonomies/brewers.md':
    '[MIGRATED in Wave 1] Authoritative content lives at docs://skills/brewing-equipment-expert/cluster/brewers.md. This URI resolves to a redirect stub for back-compat with sessions still referencing the old path.',
  'docs://taxonomies/filters.md':
    '[MIGRATED in Wave 1] Authoritative content lives at docs://skills/brewing-equipment-expert/cluster/filters.md. This URI resolves to a redirect stub for back-compat with sessions still referencing the old path.',
  'docs://taxonomies/flavors.md':
    'Use when validating flavor notes or structure tags — 3-axis composable: 181 base flavors across 12 categories + 43 modifiers + 29 structure descriptors across 7 axes. Tea-base reversal rule for "Peach Tea" type chips.',
  'docs://taxonomies/grinders.md':
    '[MIGRATED in Wave 1] Authoritative content lives at docs://skills/brewing-equipment-expert/cluster/grinder-eg1.md. This URI resolves to a redirect stub for back-compat with sessions still referencing the old path.',
  'docs://taxonomies/roast-levels.md':
    'Use when validating roast level — 8 Agtron-anchored canonical buckets (Extremely Light → Very Dark, 10-unit ranges) + marketing-tag aliases.',
  'docs://taxonomies/sworks.md':
    '[MIGRATED in Wave 1] Authoritative content lives at docs://skills/brewing-equipment-expert/cluster/sworks.md. This URI resolves to a redirect stub for back-compat with sessions still referencing the old path.',
  // ----- Composable sub-skills (Wave 1, ADR-0011) ----------------------------
  'docs://skills/coordinator/SKILL.md':
    'Use when claude.ai needs to identify which Workflow tier sub-skill matches the operator intent — Master Coordinator routes natural-language input to one of 18 sub-skills via the catalog + dispatch rules. Lazy-load this first; the dispatched sub-skill SKILL.md + its knowledge cluster load on demand.',
  'docs://skills/coordinator/catalog.md':
    'Use when looking up the full 18-sub-skill registry — Master Coordinator primary lookup table. Each entry carries I/O metadata, wave assignment, pattern tags, and status (placeholder vs. full content). Also includes the brewing + roasting domain-principles preamble extracted from the top sections of BREWING.md / ROASTING.md.',
  'docs://skills/coordinator/dispatch-rules.md':
    'Use when mapping operator intent or prompt context to a specific sub-skill dispatch target — Wave 1 covers Brewing Equipment Expert only; later waves populate the rest. Records the override-log convention for Pattern H dispatch-accuracy tracking.',
  'docs://skills/coordinator/handoff-rules.md':
    'Use when an operator workflow spans multiple sub-skills — canonical cross-domain dispatch chains (e.g. V-set Path A → optimized brew → resolved lot via Cupping Specialist → Brewing Assistant → Close-Lot Specialist; Learning Assistant research-track design). Wave 1 status: no chains active yet.',
  'docs://skills/brewing-equipment-expert/SKILL.md':
    'Use when surfacing equipment-aware recipe constraints (brewer + filter + grinder + grind setting) to Brewing Assistant during recipe construction, OR when authoring/maintaining the brewing equipment registry. Wave 1 consolidates 8 existing assets (4 lib/*-registry.ts validation mirrors + 4 cluster authored docs) under one sub-skill.',
  'docs://skills/brewing-equipment-expert/cluster/brewers.md':
    'Use when validating or looking up a brewer (dripper) — 46 canonical brewers (12 owned by Chris) + 24 aliases. Material axis dropped (model name only); Orea v3/v4 ambiguity defaults to v4. allowOverride pattern. Migrated from docs/taxonomies/brewers.md in Wave 1.',
  'docs://skills/brewing-equipment-expert/cluster/filters.md':
    'Use when validating or looking up a filter — 64 canonical filters (22 owned) + 34 aliases. Pairs with the brewer registry; Sibarist FAST drift is brewer-aware on canonicalize. allowOverride pattern. Migrated from docs/taxonomies/filters.md in Wave 1.',
  'docs://skills/brewing-equipment-expert/cluster/grinder-eg1.md':
    'Use when validating grinder + grind setting — single canonical (EG-1, Weber Workshop, ULTRA SSP burrs, 80mm flat) with 51 enumerated settings (3.0-8.0 in 0.1 steps); 16 carry rich D50 + zone + extraction-behavior + use-case content. Status flags: needs_fresh_measurement (6.6) and anomalous (7.0). Migrated from docs/taxonomies/grinders.md in Wave 1.',
  'docs://skills/brewing-equipment-expert/cluster/sworks.md':
    'Use when authoring a SWORKS Bottomless Dripper recipe or interpreting a valve-dial sequence — single owned instrument (office). Per-dial state names (Closed / Restricted / Half-Open / Open + Dead Zone 1-4 + Maximum Flow past-7) + per-dial flow-rate calibration (Dial 5 ~60 sec/100g · Dial 6 ~45 sec/100g · Dial 7 ~30 sec/100g at EG-1 6.0 + xBloom Premium Paper). Includes adjustment logic (valve-first; grind secondary) + 5 canonical recipe patterns (slow/slow/open Sequential Hybrid · fast/fast/slow Phase-Mapped · Half-Open throughout Suppression · Restricted-then-Half-Open transition · Restricted-main-Half-Open-finish Sequential). Migrated from docs/taxonomies/sworks.md in Wave 1.',
  // ----- WBC Brewing Archivist (Wave 2 PR 1, ADR-0011) -----------------------
  'docs://skills/wbc-brewing-archivist/SKILL.md':
    'Use when claude.ai needs the WBC brewing-side knowledge cluster — sub-skill scope, cluster contents, inputs/outputs/handoffs. Wave 2 PR 1 (2026-05-26) consolidates the WBC brewing corpus (5-axis foundational map + 8 strategy families + 102-recipe archive 2022-2025) into one knowledge cluster.',
  'docs://skills/wbc-brewing-archivist/cluster/wbc-reference.md':
    'Use when looking up WBC competition technique categories — 5 foundational control axes + 8 strategy families mapped onto the Latent 6+4 framework. Lean reference layer + Cross-Cutting Control Patterns playbook (water strength / agitation taper / filter behavior / pre-brew conditioning) + Practical Experiment Queue + Consciously not pursuing appendix. Migrated from docs/brewing/wbc-reference.md in Wave 2 PR 1.',
  'docs://skills/wbc-brewing-archivist/cluster/wbc-recipes.md':
    'Use when looking up specific competitor recipes from World Brewers Cup 2022-2025 — 102-recipe archive with subtype definitions and per-recipe detail organized by strategy family. Reference material for the "experiment Chris wouldn\'t think of" goal. Migrated from docs/brewing/wbc-recipes.md in Wave 2 PR 1.',
  'docs://skills/wbc-brewing-archivist/cluster/per-strategy/suppression.md':
    'Use when looking for WBC competitor recipes that match Latent\'s Suppression strategy (coarse + low-temp + low-agitation; co-ferment hold-back). Placeholder content today; populate as Chris\'s Suppression corpus crystallizes.',
  'docs://skills/wbc-brewing-archivist/cluster/per-strategy/clarity-first.md':
    'Use when looking for WBC competitor recipes that match Latent\'s Clarity-First strategy (coarse-to-medium-coarse + moderate-to-low-temp + low-agitation + fast papers; delicate aromatic protection). Placeholder content today; WBC corpus is heavy on this lane so this doc will grow fastest.',
  'docs://skills/wbc-brewing-archivist/cluster/per-strategy/balanced-intensity.md':
    'Use when looking for WBC competitor recipes that match Latent\'s Balanced Intensity strategy (default mid-extraction baseline before a coffee asks for a deliberate move). Placeholder content today.',
  'docs://skills/wbc-brewing-archivist/cluster/per-strategy/full-expression.md':
    'Use when looking for WBC competitor recipes that match Latent\'s Full Expression strategy (fine + high-temp + high-agitation; heavy co-ferment / natural projection). Placeholder content today.',
  'docs://skills/wbc-brewing-archivist/cluster/per-strategy/extraction-push.md':
    'Use when looking for WBC competitor recipes that match Latent\'s Extraction Push strategy (fine + high-temp + low-agitation + Melodrip; yield push on clean coffees). Wölfl 2024 / Tran / Giachgia anchors. Placeholder content today.',
  'docs://skills/wbc-brewing-archivist/cluster/per-strategy/hybrid.md':
    'Use when looking for WBC competitor recipes that match Latent\'s Hybrid strategy (5 sub-forms: Sequential / Phase-Mapped / Selective Bloom / Inverted / Side-by-Side). Eline Ferket 2025 Selective Bloom anchor. Placeholder content today.',
  'docs://skills/wbc-brewing-archivist/cluster/canonical/wbc-tested-recipes.md':
    'Use when tracking which WBC competitor recipes have been directly tested by Chris on a Latent brew (vs. reference-only in the 102-recipe corpus). Placeholder canonical sub-resource — empty today; grows via the Step 1d WBC corpus-check Named Consideration.',
  // ----- WBC Roasting Archivist (Wave 2 PR 1, ADR-0011) ----------------------
  'docs://skills/wbc-roasting-archivist/SKILL.md':
    'Use when claude.ai needs the WBC roasting + sourcing knowledge cluster — sub-skill scope, cluster contents, inputs/outputs/handoffs. Wave 2 PR 1 (2026-05-26) consolidates WBC roasting lessons + sourcing strategy (tentatively merged per ADR-0011) into one knowledge cluster.',
  'docs://skills/wbc-roasting-archivist/cluster/wbc-roasting.md':
    'Use when scoping a roast experiment or designing a V1 profile — WBC-derived lessons, Roest L200 hypotheses, blending experiment protocols (same-green dev ladder), and structured rest-curve protocol. Ideas / hypotheses doc, not a recipe lookup. Migrated from docs/roasting/wbc-roasting.md in Wave 2 PR 1.',
  'docs://skills/wbc-roasting-archivist/cluster/sourcing/strategy.md':
    'Use when evaluating a green offer or rebalancing inventory — WBC-derived sourcing strategy across producers / origins / varieties / processes / elevation, Tier 1/2/3 priority targets, 5-lane portfolio frame, sourcing channel classifications, and current Latent inventory mapped to portfolio lanes (snapshot 2026-05-09; Sprint T2 lane formalization 2026-05-18). Migrated from docs/roasting/wbc-sourcing.md in Wave 2 PR 1.',
  'docs://skills/wbc-roasting-archivist/cluster/sourcing/portfolio-lanes.md':
    'Use when looking up the 5-lane portfolio frame for green-bean inventory balance (Reference clarity / Fruit-tea expression / Process learning / Roast-learning hybrids / Value+roast-practice). Navigational sub-resource pointing at strategy.md § 10 for substantive content.',
  'docs://skills/wbc-roasting-archivist/cluster/sourcing/priority-targets.md':
    'Use when looking up Tier 1/2/3 sourcing priorities and Latent-adjusted next-buy framing. Navigational sub-resource pointing at strategy.md § 7-9 for substantive content.',
  'docs://skills/wbc-roasting-archivist/cluster/canonical/wbc-tested-cultivars.md':
    'Use when tracking which WBC-validated cultivar / process / sourcing patterns have been tested in Latent\'s lineup. Placeholder canonical sub-resource — empty today; grows via Latent buying cycles driven by the priority-targets list.',
  // ---------------------------------------------------------------------------
  'docs://prompts/start-brew.md':
    'Operational prompt for starting a new brew session in claude.ai — fetches BREWING.md and runs the Coffee Brief through Step 1d strategy confirmation.',
  'docs://prompts/log-brew.md':
    'Operational prompt for logging a finished brew via push_brew — short, no-confirmation submission with canonical-validation discipline.',
  'docs://prompts/propose-doc-changes-from-brew.md':
    'Operational prompt for proposing BREWING.md / roaster card / taxonomy edits after a brew session via propose_doc_changes.',
  'docs://prompts/bundled-brewing-completion.md':
    'Operational prompt combining log-brew + propose-doc-changes in one shot. Use for a finished PURCHASED brew. (Self-roasted brews flow through close-lot.md STAGE 4.)',
  'docs://prompts/start-lot.md':
    'Operational prompt for starting a green-bean lot (V1 design at intake, or any later V-set design re-entered via log-cupping.md routing). Triggers state In inventory → Waiting for next roast. Pushes green_bean + inventory + V1 experiment frame + roast_recipes (design intent) + push_roast_profile to Roest. V1 (and often V2) is wide-variance multi-variable exploratory per CONTEXT.md.',
  'docs://prompts/log-roast.md':
    'Operational prompt for recording V_n roast actuals after Chris roasted at the machine. Triggers state Waiting for next roast → Waiting for next cupping. Pulls Roest logs, push_roast × N (linked to recipe_id), patches experiment with batch_ids + observed_outcome_* + delta_from_roast_* + updated_cup_prediction_* + taste_for_*. Preps the Day 7 cupping table.',
  'docs://prompts/log-cupping.md':
    'Operational prompt for the Day 7 cupping update + adjustment move. Triggers state Waiting for next cupping → Waiting for next roast (loop continues, V_(n+1) designed) OR Resolved-pending (lot ready for close-out). Pushes cuppings, patches experiment with delta_from_cup_* + leading slot (V-set winner) + key_insight, and either designs V_(n+1) inline (push_experiment + push_roast_recipe × N + push_roast_profile × N) or routes to close-lot.md.',
  'docs://prompts/close-lot.md':
    'Operational prompt for lot close-out. Triggers state Resolved-pending → Resolved. Marks is_reference: true on the lot-level reference roast (distinct from any V-set leading slot), pushes roast_learnings (lot-specific + carry-forward), pushes the optimized SR brew, proposes ROASTING.md close-out narrative, archives the Roest inventory row. For one-shot lots (green_beans.is_one_shot=true), use one-shot-closeout.md instead.',
  'docs://prompts/one-shot.md':
    'Operational prompt for one-shot green-bean lots (single-batch samples ~100-120g, no iteration possible — auction-lot samples, farm-direct samples, rare allocations). Covers STAGES 1-4: intake (push_green_bean with is_one_shot:true + carry-forward search across similar prior lots) + tolerance-anchored design (push_experiment with batch_ids cardinality 1, push_roast_recipe × 1, push_roast_profile × 1) + record the roast (push_roast linked to recipe_id) + record Day 7 cupping (push_cupping + verdict decision). Verdict outcomes: A (reference-quality) or B (Closed without reference). STAGE 5 close-out lives in one-shot-closeout.md. Distinct from the 4-prompt V-set lifecycle (start-lot.md / log-roast.md / log-cupping.md / close-lot.md). See CONTEXT.md "One-shot lot" + "Tolerance-anchored design" entries.',
  'docs://prompts/one-shot-closeout.md':
    'Operational prompt for one-shot lot close-out (STAGE 5 of the one-shot lifecycle, sibling of one-shot.md). Triggers state Resolved-pending → Resolved. Marks is_reference: true on the single roast (Outcome A only; Outcome B leaves it false), pushes the optimized brew via push_brew (the salvageable artifact when roast wasn\'t reference quality, with what_i_learned capturing compensation reasoning), writes the constrained roast_learnings row (schema validation rejects 7 lever-attribution fields per migration 054: primary_lever / secondary_levers / roast_window_width / brewing_tolerance / what_didnt_move_needle / underdevelopment_signal / overdevelopment_signal), proposes ROASTING.md close-out narrative (tagged as one-shot), archives Roest inventory. Carry-forward fields (cultivar_takeaway / terroir_takeaway / general_takeaway / starting_hypothesis) prefixed with "Low confidence - N=1, verify on next similar lot".',
}

export type Section = {
  anchor: string
  level: number
  body: string
}

type CacheEntry = {
  text: string
  sections: Map<string, Section>
}

// Vercel serverless filesystem is read-only and per-deploy immutable, so doc
// content + parsed sections are invariant across the lifetime of one warm
// container. Cache after first read; deploys reset the container which reloads
// on next call.
const DOC_CACHE = new Map<string, CacheEntry>()

export function isKnownDoc(uri: string): boolean {
  return uri in DOC_FILES
}

export function listDocs(): {
  uri: string
  name: string
  title: string
  mimeType: string
  description: string
}[] {
  const entry = (uri: string, name: string, title: string) => ({
    uri,
    name,
    title,
    mimeType: 'text/markdown',
    description: DOC_DESCRIPTIONS[uri] ?? '',
  })

  return [
    entry('docs://context.md', 'docs/context.md', 'Latent Shared-Language Glossary'),
    entry('docs://brewing.md', 'docs/brewing.md', 'Brewing Master Reference'),
    entry('docs://brewing/roasters.md', 'docs/brewing/roasters.md', 'Roaster Brewing Lessons'),
    entry('docs://brewing/wbc-reference.md', 'docs/brewing/wbc-reference.md', 'WBC Reference (Latent mapping)'),
    entry('docs://brewing/wbc-recipes.md', 'docs/brewing/wbc-recipes.md', 'WBC 102-Recipe Archive (2022-2025)'),
    entry('docs://roasting.md', 'docs/roasting.md', 'Roasting Master Reference'),
    entry('docs://roasting/archive.md', 'docs/roasting/archive.md', 'Roasting Closed-Lot Archive'),
    entry('docs://roasting/wbc-roasting.md', 'docs/roasting/wbc-roasting.md', 'WBC Roasting (lessons + open ideas)'),
    entry('docs://roasting/wbc-sourcing.md', 'docs/roasting/wbc-sourcing.md', 'WBC Sourcing Strategy (Latent)'),
    entry(
      'docs://features/importer-exporter-scoping.md',
      'docs/features/importer-exporter-scoping.md',
      'Importer / Exporter Axis Scoping (Sprint T3 / CR-3)',
    ),
    // Composable sub-skills (Wave 1, ADR-0011)
    entry(
      'docs://skills/coordinator/SKILL.md',
      'docs/skills/coordinator/SKILL.md',
      'Master Coordinator — SKILL',
    ),
    entry(
      'docs://skills/coordinator/catalog.md',
      'docs/skills/coordinator/catalog.md',
      'Master Coordinator — 18-sub-skill Catalog',
    ),
    entry(
      'docs://skills/coordinator/dispatch-rules.md',
      'docs/skills/coordinator/dispatch-rules.md',
      'Master Coordinator — Dispatch Rules',
    ),
    entry(
      'docs://skills/coordinator/handoff-rules.md',
      'docs/skills/coordinator/handoff-rules.md',
      'Master Coordinator — Handoff Rules',
    ),
    entry(
      'docs://skills/brewing-equipment-expert/SKILL.md',
      'docs/skills/brewing-equipment-expert/SKILL.md',
      'Brewing Equipment Expert — SKILL',
    ),
    entry(
      'docs://skills/brewing-equipment-expert/cluster/brewers.md',
      'docs/skills/brewing-equipment-expert/cluster/brewers.md',
      'Brewing Equipment Expert — Brewers cluster',
    ),
    entry(
      'docs://skills/brewing-equipment-expert/cluster/filters.md',
      'docs/skills/brewing-equipment-expert/cluster/filters.md',
      'Brewing Equipment Expert — Filters cluster',
    ),
    entry(
      'docs://skills/brewing-equipment-expert/cluster/grinder-eg1.md',
      'docs/skills/brewing-equipment-expert/cluster/grinder-eg1.md',
      'Brewing Equipment Expert — Grinder (EG-1) cluster',
    ),
    entry(
      'docs://skills/brewing-equipment-expert/cluster/sworks.md',
      'docs/skills/brewing-equipment-expert/cluster/sworks.md',
      'Brewing Equipment Expert — SWORKS cluster',
    ),
    // WBC Brewing Archivist (Wave 2 PR 1, ADR-0011)
    entry(
      'docs://skills/wbc-brewing-archivist/SKILL.md',
      'docs/skills/wbc-brewing-archivist/SKILL.md',
      'WBC Brewing Archivist — SKILL',
    ),
    entry(
      'docs://skills/wbc-brewing-archivist/cluster/wbc-reference.md',
      'docs/skills/wbc-brewing-archivist/cluster/wbc-reference.md',
      'WBC Brewing Archivist — Reference (Latent mapping)',
    ),
    entry(
      'docs://skills/wbc-brewing-archivist/cluster/wbc-recipes.md',
      'docs/skills/wbc-brewing-archivist/cluster/wbc-recipes.md',
      'WBC Brewing Archivist — 102-Recipe Archive (2022-2025)',
    ),
    entry(
      'docs://skills/wbc-brewing-archivist/cluster/per-strategy/suppression.md',
      'docs/skills/wbc-brewing-archivist/cluster/per-strategy/suppression.md',
      'WBC Brewing Archivist — Per-Strategy: Suppression',
    ),
    entry(
      'docs://skills/wbc-brewing-archivist/cluster/per-strategy/clarity-first.md',
      'docs/skills/wbc-brewing-archivist/cluster/per-strategy/clarity-first.md',
      'WBC Brewing Archivist — Per-Strategy: Clarity-First',
    ),
    entry(
      'docs://skills/wbc-brewing-archivist/cluster/per-strategy/balanced-intensity.md',
      'docs/skills/wbc-brewing-archivist/cluster/per-strategy/balanced-intensity.md',
      'WBC Brewing Archivist — Per-Strategy: Balanced Intensity',
    ),
    entry(
      'docs://skills/wbc-brewing-archivist/cluster/per-strategy/full-expression.md',
      'docs/skills/wbc-brewing-archivist/cluster/per-strategy/full-expression.md',
      'WBC Brewing Archivist — Per-Strategy: Full Expression',
    ),
    entry(
      'docs://skills/wbc-brewing-archivist/cluster/per-strategy/extraction-push.md',
      'docs/skills/wbc-brewing-archivist/cluster/per-strategy/extraction-push.md',
      'WBC Brewing Archivist — Per-Strategy: Extraction Push',
    ),
    entry(
      'docs://skills/wbc-brewing-archivist/cluster/per-strategy/hybrid.md',
      'docs/skills/wbc-brewing-archivist/cluster/per-strategy/hybrid.md',
      'WBC Brewing Archivist — Per-Strategy: Hybrid',
    ),
    entry(
      'docs://skills/wbc-brewing-archivist/cluster/canonical/wbc-tested-recipes.md',
      'docs/skills/wbc-brewing-archivist/cluster/canonical/wbc-tested-recipes.md',
      'WBC Brewing Archivist — Canonical: WBC-Tested Recipes',
    ),
    // WBC Roasting Archivist (Wave 2 PR 1, ADR-0011)
    entry(
      'docs://skills/wbc-roasting-archivist/SKILL.md',
      'docs/skills/wbc-roasting-archivist/SKILL.md',
      'WBC Roasting Archivist — SKILL',
    ),
    entry(
      'docs://skills/wbc-roasting-archivist/cluster/wbc-roasting.md',
      'docs/skills/wbc-roasting-archivist/cluster/wbc-roasting.md',
      'WBC Roasting Archivist — Roasting (lessons + open ideas)',
    ),
    entry(
      'docs://skills/wbc-roasting-archivist/cluster/sourcing/strategy.md',
      'docs/skills/wbc-roasting-archivist/cluster/sourcing/strategy.md',
      'WBC Roasting Archivist — Sourcing Strategy',
    ),
    entry(
      'docs://skills/wbc-roasting-archivist/cluster/sourcing/portfolio-lanes.md',
      'docs/skills/wbc-roasting-archivist/cluster/sourcing/portfolio-lanes.md',
      'WBC Roasting Archivist — Sourcing: Portfolio Lanes',
    ),
    entry(
      'docs://skills/wbc-roasting-archivist/cluster/sourcing/priority-targets.md',
      'docs/skills/wbc-roasting-archivist/cluster/sourcing/priority-targets.md',
      'WBC Roasting Archivist — Sourcing: Priority Targets (Tier 1/2/3)',
    ),
    entry(
      'docs://skills/wbc-roasting-archivist/cluster/canonical/wbc-tested-cultivars.md',
      'docs/skills/wbc-roasting-archivist/cluster/canonical/wbc-tested-cultivars.md',
      'WBC Roasting Archivist — Canonical: WBC-Tested Cultivars / Processes / Sourcing',
    ),
    ...TAXONOMY_AXES.map((axis) =>
      entry(`docs://taxonomies/${axis}.md`, `docs/taxonomies/${axis}.md`, `Taxonomy: ${axis}`),
    ),
    ...PROMPT_FILES.map((name) =>
      entry(`docs://prompts/${name}.md`, `docs/prompts/${name}.md`, `Prompt: ${name}`),
    ),
  ]
}

export function listTaxonomyAxes(): readonly TaxonomyAxis[] {
  return TAXONOMY_AXES
}

// Parse a markdown document into a section map keyed by header anchor text.
// A section's body extends from the line after its header to the line before the
// next header of EQUAL OR HIGHER level (lower numeric value). Header text is
// matched verbatim (case-sensitive); duplicates resolve to the first occurrence.
export function parseSections(text: string): Map<string, Section> {
  const lines = text.split('\n')
  const sections = new Map<string, Section>()
  // Pass 1: collect headers with their positions + levels.
  type Header = { anchor: string; level: number; line: number }
  const headers: Header[] = []
  for (let i = 0; i < lines.length; i++) {
    const match = /^(#{1,6})\s+(.+?)\s*$/.exec(lines[i])
    if (!match) continue
    headers.push({ level: match[1].length, anchor: match[2], line: i })
  }
  // Pass 2: body for each header runs up to the next header of equal or higher level.
  for (let i = 0; i < headers.length; i++) {
    const { anchor, level, line } = headers[i]
    if (sections.has(anchor)) continue // first occurrence wins on duplicates
    let endLine = lines.length
    for (let j = i + 1; j < headers.length; j++) {
      if (headers[j].level <= level) {
        endLine = headers[j].line
        break
      }
    }
    const body = lines.slice(line + 1, endLine).join('\n').trim()
    sections.set(anchor, { anchor, level, body })
  }
  return sections
}

async function loadDoc(uri: string): Promise<CacheEntry> {
  const cached = DOC_CACHE.get(uri)
  if (cached !== undefined) return cached
  const filename = DOC_FILES[uri]
  if (!filename) throw new Error(`Unknown doc URI: ${uri}`)
  const text = await readFile(path.join(process.cwd(), filename), 'utf-8')
  const entry: CacheEntry = { text, sections: parseSections(text) }
  DOC_CACHE.set(uri, entry)
  return entry
}

export async function readDoc(uri: string): Promise<string> {
  const { text } = await loadDoc(uri)
  return text
}

// Returns the body text of the named section, or null if the anchor isn't found.
// Used by the section-anchor MCP Resource (e.g. docs://brewing.md#Equipment Reference)
// and by the arbiter when resolving propose_doc_changes citations.
export async function readDocSection(uri: string, anchor: string): Promise<string | null> {
  const { sections } = await loadDoc(uri)
  const section = sections.get(anchor)
  return section ? section.body : null
}

// Lists every header anchor in the doc (useful for the arbiter when surfacing
// orphaned proposals — show Chris the actual section list so he can retarget).
export async function listDocSections(uri: string): Promise<string[]> {
  const { sections } = await loadDoc(uri)
  return Array.from(sections.keys())
}
