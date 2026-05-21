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
  // Brewing Historian (Wave 2 PR 2) — SKILL.md + cluster files extracted from
  // BREWING.md "Cross-Coffee Insight Layer" section. BREWING.md retains its
  // h1 + pointer block at #cross-coffee-insight-layer for anchor back-compat.
  'docs://skills/brewing-historian/SKILL.md': 'docs/skills/brewing-historian/SKILL.md',
  'docs://skills/brewing-historian/cluster/patterns/cross-coffee-insights.md': 'docs/skills/brewing-historian/cluster/patterns/cross-coffee-insights.md',
  'docs://skills/brewing-historian/cluster/patterns/by-strategy/clarity-first.md': 'docs/skills/brewing-historian/cluster/patterns/by-strategy/clarity-first.md',
  'docs://skills/brewing-historian/cluster/patterns/by-strategy/suppression.md': 'docs/skills/brewing-historian/cluster/patterns/by-strategy/suppression.md',
  'docs://skills/brewing-historian/cluster/patterns/by-strategy/balanced-intensity.md': 'docs/skills/brewing-historian/cluster/patterns/by-strategy/balanced-intensity.md',
  'docs://skills/brewing-historian/cluster/patterns/by-strategy/full-expression.md': 'docs/skills/brewing-historian/cluster/patterns/by-strategy/full-expression.md',
  'docs://skills/brewing-historian/cluster/patterns/by-strategy/extraction-push.md': 'docs/skills/brewing-historian/cluster/patterns/by-strategy/extraction-push.md',
  'docs://skills/brewing-historian/cluster/patterns/by-strategy/hybrid.md': 'docs/skills/brewing-historian/cluster/patterns/by-strategy/hybrid.md',
  'docs://skills/brewing-historian/cluster/patterns/by-cultivar/gesha.md': 'docs/skills/brewing-historian/cluster/patterns/by-cultivar/gesha.md',
  'docs://skills/brewing-historian/cluster/patterns/by-cultivar/74158.md': 'docs/skills/brewing-historian/cluster/patterns/by-cultivar/74158.md',
  'docs://skills/brewing-historian/cluster/patterns/by-cultivar/sidra.md': 'docs/skills/brewing-historian/cluster/patterns/by-cultivar/sidra.md',
  'docs://skills/brewing-historian/cluster/patterns/by-cultivar/ethiopian-landrace-population.md': 'docs/skills/brewing-historian/cluster/patterns/by-cultivar/ethiopian-landrace-population.md',
  'docs://skills/brewing-historian/cluster/patterns/by-cultivar/mejorado.md': 'docs/skills/brewing-historian/cluster/patterns/by-cultivar/mejorado.md',
  'docs://skills/brewing-historian/cluster/patterns/by-cultivar/pacamara.md': 'docs/skills/brewing-historian/cluster/patterns/by-cultivar/pacamara.md',
  'docs://skills/brewing-historian/cluster/patterns/by-cultivar/sudan-rume.md': 'docs/skills/brewing-historian/cluster/patterns/by-cultivar/sudan-rume.md',
  'docs://skills/brewing-historian/cluster/patterns/by-coffee-family/anaerobic-natural.md': 'docs/skills/brewing-historian/cluster/patterns/by-coffee-family/anaerobic-natural.md',
  'docs://skills/brewing-historian/cluster/patterns/by-coffee-family/anaerobic-washed.md': 'docs/skills/brewing-historian/cluster/patterns/by-coffee-family/anaerobic-washed.md',
  'docs://skills/brewing-historian/cluster/patterns/by-coffee-family/yeast-inoculated-washed.md': 'docs/skills/brewing-historian/cluster/patterns/by-coffee-family/yeast-inoculated-washed.md',
  'docs://skills/brewing-historian/cluster/patterns/by-coffee-family/yeast-inoculated-natural.md': 'docs/skills/brewing-historian/cluster/patterns/by-coffee-family/yeast-inoculated-natural.md',
  'docs://skills/brewing-historian/cluster/patterns/by-coffee-family/double-anaerobic-washed.md': 'docs/skills/brewing-historian/cluster/patterns/by-coffee-family/double-anaerobic-washed.md',
  'docs://skills/brewing-historian/cluster/patterns/by-coffee-family/thermal-shock-washed.md': 'docs/skills/brewing-historian/cluster/patterns/by-coffee-family/thermal-shock-washed.md',
  // Roasting Historian (Wave 2 PR 3) — SKILL.md + cluster files extracted from
  // ROASTING.md § Cross-Coffee Insight Layer (lines 776-982) + § Open Questions
  // (lines 984-1011). ROASTING.md retains h1 + pointer blocks at
  // #cross-coffee-insight-layer + #open-questions for anchor back-compat.
  'docs://skills/roasting-historian/SKILL.md': 'docs/skills/roasting-historian/SKILL.md',
  'docs://skills/roasting-historian/cluster/patterns/cross-coffee-insights.md': 'docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md',
  'docs://skills/roasting-historian/cluster/patterns/open-questions.md': 'docs/skills/roasting-historian/cluster/patterns/open-questions.md',
  'docs://skills/roasting-historian/cluster/patterns/general.md': 'docs/skills/roasting-historian/cluster/patterns/general.md',
  'docs://skills/roasting-historian/cluster/patterns/by-cultivar/gesha.md': 'docs/skills/roasting-historian/cluster/patterns/by-cultivar/gesha.md',
  'docs://skills/roasting-historian/cluster/patterns/by-process/washed.md': 'docs/skills/roasting-historian/cluster/patterns/by-process/washed.md',
  'docs://skills/roasting-historian/cluster/learnings/cgle-mandela-xo.md': 'docs/skills/roasting-historian/cluster/learnings/cgle-mandela-xo.md',
  'docs://skills/roasting-historian/cluster/learnings/cgle-sudan-rume-hybrid-washed.md': 'docs/skills/roasting-historian/cluster/learnings/cgle-sudan-rume-hybrid-washed.md',
  'docs://skills/roasting-historian/cluster/learnings/gv-oma-lot-25-035.md': 'docs/skills/roasting-historian/cluster/learnings/gv-oma-lot-25-035.md',
  'docs://skills/roasting-historian/cluster/learnings/gv-surma-lot-25-039.md': 'docs/skills/roasting-historian/cluster/learnings/gv-surma-lot-25-039.md',
  'docs://skills/roasting-historian/cluster/learnings/gua-el-socorro-java.md': 'docs/skills/roasting-historian/cluster/learnings/gua-el-socorro-java.md',
  'docs://skills/roasting-historian/cluster/learnings/gua-libertad-aurelio-del-cerro.md': 'docs/skills/roasting-historian/cluster/learnings/gua-libertad-aurelio-del-cerro.md',
  'docs://skills/roasting-historian/cluster/learnings/rancho-tio-emilio.md': 'docs/skills/roasting-historian/cluster/learnings/rancho-tio-emilio.md',
  // Roasting Historian cluster — Wave 3 PR 1 addition (R-to-B Translation override of prior lock)
  'docs://skills/roasting-historian/cluster/patterns/roast-to-brew-translation.md': 'docs/skills/roasting-historian/cluster/patterns/roast-to-brew-translation.md',
  // ----- Peer-Learning Roasting Archivist (Wave 3 PR 1, ADR-0011) ------------
  'docs://skills/peer-learning-roasting-archivist/SKILL.md': 'docs/skills/peer-learning-roasting-archivist/SKILL.md',
  'docs://skills/peer-learning-roasting-archivist/cluster/per-peer/dongzhe.md': 'docs/skills/peer-learning-roasting-archivist/cluster/per-peer/dongzhe.md',
  'docs://skills/peer-learning-roasting-archivist/cluster/cross-peer/patterns.md': 'docs/skills/peer-learning-roasting-archivist/cluster/cross-peer/patterns.md',
  'docs://skills/peer-learning-roasting-archivist/cluster/source-index.md': 'docs/skills/peer-learning-roasting-archivist/cluster/source-index.md',
  // ----- Roest Knowledge (Wave 3 PR 1, ADR-0011) -----------------------------
  'docs://skills/roest-knowledge/SKILL.md': 'docs/skills/roest-knowledge/SKILL.md',
  'docs://skills/roest-knowledge/cluster/machine/l200-ultra.md': 'docs/skills/roest-knowledge/cluster/machine/l200-ultra.md',
  'docs://skills/roest-knowledge/cluster/machine/counterflow-observations.md': 'docs/skills/roest-knowledge/cluster/machine/counterflow-observations.md',
  'docs://skills/roest-knowledge/cluster/protocols/evaluation.md': 'docs/skills/roest-knowledge/cluster/protocols/evaluation.md',
  'docs://skills/roest-knowledge/cluster/protocols/fan-strategy.md': 'docs/skills/roest-knowledge/cluster/protocols/fan-strategy.md',
  'docs://skills/roest-knowledge/cluster/protocols/fc-marking.md': 'docs/skills/roest-knowledge/cluster/protocols/fc-marking.md',
  'docs://skills/roest-knowledge/cluster/api/read-surface.md': 'docs/skills/roest-knowledge/cluster/api/read-surface.md',
  'docs://skills/roest-knowledge/cluster/api/write-surface.md': 'docs/skills/roest-knowledge/cluster/api/write-surface.md',
  'docs://skills/roest-knowledge/cluster/api/quirks.md': 'docs/skills/roest-knowledge/cluster/api/quirks.md',
  'docs://skills/roest-knowledge/cluster/firmware/README.md': 'docs/skills/roest-knowledge/cluster/firmware/README.md',
  'docs://skills/roest-knowledge/cluster/observed-quirks.md': 'docs/skills/roest-knowledge/cluster/observed-quirks.md',
  // ----- Workflow Planning tier (Wave 3 PR 2, ADR-0011 + ADR-0012) -----------
  // 4 reads-only composition sub-skills over Wave 1+2 Knowledge clusters; no
  // cluster/ subdirectories per scope decision 1 (SKILL.md captures composition
  // logic; cluster/templates/ accrue under Pattern F if templates emerge in
  // lived use). Prompts unchanged per scope decision 2; handoff chains pre-
  // authored in coordinator/handoff-rules.md per scope decision 3.
  'docs://skills/roasting-assistant/SKILL.md': 'docs/skills/roasting-assistant/SKILL.md',
  'docs://skills/brewing-assistant/SKILL.md': 'docs/skills/brewing-assistant/SKILL.md',
  'docs://skills/learning-assistant/SKILL.md': 'docs/skills/learning-assistant/SKILL.md',
  'docs://skills/sourcing-workflow-planner/SKILL.md': 'docs/skills/sourcing-workflow-planner/SKILL.md',
  // Wave 3 PR 3: 5 Workflow Executing tier sub-skills (substrate-writers wrapping
  // existing push_*/patch_* MCP Tools). Cupping Specialist absorbs POD-1 at
  // SKILL.md level + bookmarks the full rewrite at cluster/pod-1-routing.md
  // pending lived-practice trigger conditions. Other 4 ship SKILL.md only.
  // Tool descriptions in lib/mcp/push-*.ts / patch-*.ts carry an "Owned by
  // <sub-skill> per ADR-0011" pointer for dispatch-time signal. Chains 1-4
  // promoted PARTIAL → ACTIVE in coordinator/handoff-rules.md.
  'docs://skills/roast-recorder/SKILL.md': 'docs/skills/roast-recorder/SKILL.md',
  'docs://skills/brew-recorder/SKILL.md': 'docs/skills/brew-recorder/SKILL.md',
  'docs://skills/cupping-specialist/SKILL.md': 'docs/skills/cupping-specialist/SKILL.md',
  'docs://skills/cupping-specialist/cluster/pod-1-routing.md':
    'docs/skills/cupping-specialist/cluster/pod-1-routing.md',
  'docs://skills/roest-api-worker/SKILL.md': 'docs/skills/roest-api-worker/SKILL.md',
  'docs://skills/close-lot-specialist/SKILL.md': 'docs/skills/close-lot-specialist/SKILL.md',
  // ----- Cross-Coffee Insight Layer (Wave 4 PR 4a, ADR-0011 + ADR-0013) -------
  // CCIL is the cross-domain synthesis layer above both domain Historians.
  // Wave 4 PR 4a shipped skeleton + Sudan Rume seed pattern. Wave 4 PR 4b closes
  // the architecture implementation arc by rewriting BREWING.md + ROASTING.md as
  // ~500-byte redirect stubs + extracting CLAUDE.md sub-skills section to
  // docs/architecture/sub-skills-status.md. Future cross-domain patterns accrue
  // via Pattern A refresh events; Pattern F decomposition logged at
  // cluster/decomposition-log.md.
  'docs://skills/ccil/SKILL.md': 'docs/skills/ccil/SKILL.md',
  'docs://skills/ccil/cluster/coffee/sudan-rume/across-roasting-and-brewing.md':
    'docs/skills/ccil/cluster/coffee/sudan-rume/across-roasting-and-brewing.md',
  'docs://skills/ccil/cluster/decomposition-log.md':
    'docs/skills/ccil/cluster/decomposition-log.md',
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
    'Use when planning a new brew recipe — contains the 6-strategy + 4-modifier Two-Axis framework, Step 1d Coffee Brief structure, equipment reference. The Cross-Coffee Insight Layer migrated to the Brewing Historian cluster in Wave 2 PR 2 (2026-05-26); BREWING.md retains its h1 + pointer block at #cross-coffee-insight-layer for back-compat. Pull docs://skills/brewing-historian/cluster/patterns/* for the migrated cross-coffee learnings.',
  'docs://brewing/roasters.md':
    'Use when working with a specific roaster — per-roaster brewing lessons + house-style cards (e.g. Hydrangea El Paraíso thermal-shock guidance, Sey extraction expectations). Reference for roaster-anchored brew design.',
  'docs://brewing/wbc-reference.md':
    '[MIGRATED in Wave 2 PR 1] Authoritative content lives at docs://skills/wbc-brewing-archivist/cluster/wbc-reference.md. This URI resolves to a redirect stub for back-compat with sessions still referencing the old path.',
  'docs://brewing/wbc-recipes.md':
    '[MIGRATED in Wave 2 PR 1] Authoritative content lives at docs://skills/wbc-brewing-archivist/cluster/wbc-recipes.md. This URI resolves to a redirect stub for back-compat with sessions still referencing the old path.',
  'docs://roasting.md':
    'Use when planning a roast on the Roest L200 Ultra (counterflow mode) — covers the New Coffee Onboarding Protocol (Steps 1-4), Standard Workflow (BBP / Hopper Pre-Load), Naturals + Honey roast-direction frameworks, Lot Knowledge (Active Lots + One-Shot Calibrations + Closed Lots), Green Bean Storage, Session Debrief Template, and Archive pointer. Multiple sections migrated to sub-skill clusters: Wave 2 PR 3 moved Cross-Coffee Insight Layer + Open Questions to Roasting Historian (h1 + pointer blocks at #cross-coffee-insight-layer + #open-questions); Wave 3 PR 1 moved Equipment / Evaluation Protocol / Standard Inlet Curve Template / Fan Strategy / Key Counterflow Observations / FC Marking Protocol to Roest Knowledge cluster, Reference Roast Target + Peer Insights to Peer-Learning Roasting Archivist cluster, and Roast-to-Brew Translation to Roasting Historian cluster. All migration anchors preserved as h1 + pointer blocks for back-compat. Pull docs://skills/roest-knowledge/cluster/* + docs://skills/peer-learning-roasting-archivist/cluster/* + docs://skills/roasting-historian/cluster/* for migrated content.',
  'docs://roasting/archive.md':
    'Use when researching closed-lot roasting outcomes — per-lot Key Learnings, reference roast parameters, and structural takeaways from completed beans. Read before roasting a similar coffee.',
  'docs://roasting/wbc-roasting.md':
    '[MIGRATED in Wave 2 PR 1] Authoritative content lives at docs://skills/wbc-roasting-archivist/cluster/wbc-roasting.md. This URI resolves to a redirect stub for back-compat with sessions still referencing the old path.',
  'docs://roasting/wbc-sourcing.md':
    '[MIGRATED in Wave 2 PR 1] Authoritative content lives at docs://skills/wbc-roasting-archivist/cluster/sourcing/strategy.md. This URI resolves to a redirect stub for back-compat with sessions still referencing the old path.',
  'docs://roasting/redesign.md':
    'Use when implementing or extending the roasting-side data model / pages — series-level scope doc for the 7-sub-sprint roasting rebuild (Sub Pages 6.1-6.7, scoped + shipped 2026-05-13). Covers the lifecycle states, the new roast_recipes entity, the 16 cross-batch fields on experiments, MCP-only writes (deprecating /add for roasting), and the 4-page-shape index + waiting-for-roast + waiting-for-cupping + resolved layout. Read end-to-end before working on roasting pages or MCP Tool surface.',
  'docs://roasting/dongzhe-livestream-2026-05.md':
    '[MIGRATED in Wave 3 PR 1] Authoritative content lives at docs://skills/peer-learning-roasting-archivist/cluster/per-peer/dongzhe.md. This URI resolves to a redirect stub for back-compat with sessions still referencing the old path. The cluster file carries Dongzhe\'s full per-peer profile (Reference Roast Target #249, Core Principles, full Yunnan-Hatchi 2026-05-17 livestream extraction, five operational deltas, caveats).',
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
  // ----- Brewing Historian (Wave 2 PR 2, ADR-0011) ---------------------------
  'docs://skills/brewing-historian/SKILL.md':
    'Use when claude.ai needs the brewing-side cross-coffee learnings cluster — sub-skill scope, cluster contents, inputs/outputs/handoffs. Wave 2 PR 2 (2026-05-26) extracted the BREWING.md "Cross-Coffee Insight Layer" + 6 per-strategy "Coffees That Confirmed X" sub-sections into this cluster.',
  'docs://skills/brewing-historian/cluster/patterns/cross-coffee-insights.md':
    'Use when looking up cross-coffee brewing learnings — By Modifier (Axis 2) compatibility matrix + Output Selection / Aroma Capture / Inverted Temp Staging patterns; By Process default-strategy table (10+ process classes with observed exceptions); By Variety per-cultivar entries (Panama/Colombian Gesha sub-types, Pink Bourbon, Rosado, Pacamara, Mokka/Mokkita, Sudan Rume, Catimor, Sydra, Catuai, Thai cultivar-mix); Cooling Behavior Observations (per-cup cooling-arc patterns); Office Brewing Notes (SWORKS valve calibration + restriction timing principles + tap-water dose-aware rules); Open Questions queue. Migrated from BREWING.md § Cross-Coffee Insight Layer in Wave 2 PR 2 (2026-05-26).',
  'docs://skills/brewing-historian/cluster/patterns/by-strategy/clarity-first.md':
    'Use when designing a Clarity-First recipe and looking for confirmed per-coffee data points — washed Gesha (Panama/Colombia highlands), Ethiopian washed landraces, Typica Mejorado / Sydra, Laurina, Esmeralda NC climate-controlled naturals, Finca Sophia standard raised-bed naturals, Lamastus DRD Geshas, Rwandan washed Red Bourbon. Migrated from BREWING.md § Cross-Coffee Insight Layer > Coffees That Confirmed Clarity-First in Wave 2 PR 2.',
  'docs://skills/brewing-historian/cluster/patterns/by-strategy/suppression.md':
    'Use when designing a Suppression recipe and looking for confirmed per-coffee data points — Colombian / Ethiopian / Panamanian anaerobic naturals + cold-room dehydration naturals; temperature-primacy resolves bitter tail; SWORKS Dial 6 office template + valve-tolerance sub-rule (anaerobic-natural vs cold-room split). Migrated from BREWING.md § Cross-Coffee Insight Layer > Coffees That Confirmed Suppression in Wave 2 PR 2.',
  'docs://skills/brewing-historian/cluster/patterns/by-strategy/balanced-intensity.md':
    'Use when designing a Balanced Intensity recipe and looking for confirmed per-coffee data points — honey-process lots, Pacamara, Mokkita, washed Pink Bourbon, 5 yeast-inoculated subtypes (anaerobic natural / thermal shock washed / white honey / natural with washed finish / anaerobic honey), Finca El Paraíso recipe gradient, Ethiopian standard natural with brightness-forward targets, CGLE Sudan Rume Natural. Migrated from BREWING.md § Cross-Coffee Insight Layer > Coffees That Needed Balanced Intensity in Wave 2 PR 2.',
  'docs://skills/brewing-historian/cluster/patterns/by-strategy/full-expression.md':
    'Use when designing a Full Expression recipe and looking for confirmed per-coffee data points — Jeferson Motta anaerobic washed Colombian Gesha (Huila/Cauca pattern), Pikudo\'s Rosado anoxic natural, Moonwake Blooms washed Catuai (Honduras), Tamarind heavy co-ferment washed, Picolot Emerald Garrido Mokka Natural (with fast/fast/slow valve), DAK Apricoast Ethiopian anaerobic washed. Migrated from BREWING.md § Cross-Coffee Insight Layer > Coffees That Needed Full Expression in Wave 2 PR 2.',
  'docs://skills/brewing-historian/cluster/patterns/by-strategy/extraction-push.md':
    'Use when designing an Extraction Push recipe and looking for confirmed per-coffee data points — Pepe Jijón Sidra Wave Hybrid is the strategy\'s first-confirmed brew (EG-1 5.8 / 95°C / 4-pour Melodrip on Orea v4 + Sibarist FLAT FAST). Includes failure-mode diagnostic, drying-tail-as-unintegrated-rose finding, and candidate-coffee list. Migrated from BREWING.md § Cross-Coffee Insight Layer > Coffees That Confirmed Extraction Push in Wave 2 PR 2.',
  'docs://skills/brewing-historian/cluster/patterns/by-strategy/hybrid.md':
    'Use when designing a Hybrid recipe and looking for confirmed per-coffee data points — SWORKS slow/slow/open Sequential template across three yeast-inoculated Geshas (Janson 1010 / Sebastian Ramirez White Honey / Finca La Reserva Anaerobic Honey); 4 other sub-forms (Phase-Mapped / Selective Bloom / Intensity-Clarity Split / Temperature-Staged) empty with candidate-experiment scoping. Migrated from BREWING.md § Cross-Coffee Insight Layer > Coffees That Confirmed Hybrid in Wave 2 PR 2.',
  'docs://skills/brewing-historian/cluster/patterns/by-cultivar/gesha.md':
    'Use when designing a Gesha recipe — pointer / cross-strategy entry index for the largest single-cultivar corpus (N=34). Per-cultivar deep-dive patterns will accrue here beyond the by-variety rollup.',
  'docs://skills/brewing-historian/cluster/patterns/by-cultivar/74158.md':
    'Use when designing a recipe for cultivar 74158 (Ethiopian landrace) — pointer to the Ethiopian Landraces (74110/74112/74158) cross-rollup and the Hydrangea Basha Bekele Kokose Suppression entry. N=5.',
  'docs://skills/brewing-historian/cluster/patterns/by-cultivar/sidra.md':
    'Use when designing a Sidra recipe — pointer / cross-strategy entry index, including the Pepe Jijón Wave Hybrid Extraction Push reference and the Sidra tannin-ceiling rule. N=5.',
  'docs://skills/brewing-historian/cluster/patterns/by-cultivar/ethiopian-landrace-population.md':
    'Use when designing a recipe for unspecified Ethiopian landrace population — pointer to the broader landrace rollups (74158 + 74110/74112 blend have their own deep-dives). N=4.',
  'docs://skills/brewing-historian/cluster/patterns/by-cultivar/mejorado.md':
    'Use when designing a Mejorado (Typica Mejorado) recipe — pointer to the Sydra/Sidra-family default + Finca Soledad TyOxidator Clarity-First confirmation. N=3.',
  'docs://skills/brewing-historian/cluster/patterns/by-cultivar/pacamara.md':
    'Use when designing a Pacamara recipe — Balanced Intensity default + Picolot Garrido Full Expression exception + bean-density grind ladder (Mokka 6.0 → Pacamara 6.1 on Picolot naturals). N=3.',
  'docs://skills/brewing-historian/cluster/patterns/by-cultivar/sudan-rume.md':
    'Use when designing a Sudan Rume recipe — CGLE Las Margaritas Balanced Intensity confirmation + April Brewer Glass + April Paper vehicle-dependency rule (two-data-point confirmed for SL-lineage / aromatic-landrace varieties on fast-cone vehicles) + temperature ceiling 91°C. N=3.',
  'docs://skills/brewing-historian/cluster/patterns/by-coffee-family/anaerobic-natural.md':
    'Use when designing a recipe for Anaerobic Natural lots — Suppression default across 4 confirmed origins (Colombia/Ethiopia/Panama + cold-room Ethiopian). Includes SWORKS Dial 6 office template + fallback to Balanced + Inverted Temperature Staging. N=10 (largest coffee-family cluster).',
  'docs://skills/brewing-historian/cluster/patterns/by-coffee-family/anaerobic-washed.md':
    'Use when designing a recipe for Anaerobic Washed lots — split-by-intensity defaults (clean/lighter → Balanced Intensity with Full Expression roaster-override; heavy/Colombian Huila/Cauca → Full Expression). N=5.',
  'docs://skills/brewing-historian/cluster/patterns/by-coffee-family/yeast-inoculated-washed.md':
    'Use when designing a recipe for Yeast-Inoculated Washed lots — Balanced Intensity default, recipe gradient tracks flavor register (rose-forward 6.3/95°C; aromatic-floral 6.3/94°C; lighter floral 6.4/94°C). N=4.',
  'docs://skills/brewing-historian/cluster/patterns/by-coffee-family/yeast-inoculated-natural.md':
    'Use when designing a recipe for Yeast-Inoculated Natural lots — Balanced Intensity default; honey vs anaerobic-natural finish split shifts temperature ceiling 1°C. N=3.',
  'docs://skills/brewing-historian/cluster/patterns/by-coffee-family/double-anaerobic-washed.md':
    'Use when designing a recipe for Double Anaerobic Washed lots — Full Expression default (heavy-end of anaerobic-washed continuum); may benefit from Output Selection (late cut) or SWORKS Dial 5 contact-time control. N=3.',
  'docs://skills/brewing-historian/cluster/patterns/by-coffee-family/thermal-shock-washed.md':
    'Use when designing a recipe for Thermal Shock Washed lots — Balanced Intensity default with flavor-register-driven recipe gradient (Finca El Paraíso canonical producer; three confirmed lots: Letty / Luna / Lychee). N=3.',
  // Roasting Historian cluster (Wave 2 PR 3)
  'docs://skills/roasting-historian/SKILL.md':
    'Roasting Historian sub-skill (Wave 2 PR 3 shipped 2026-05-26). Per-lot learnings + cross-lot patterns extracted from ROASTING.md § Cross-Coffee Insight Layer + § Open Questions. Knowledge-tier sub-skill consumed by Roasting Assistant during V1 design and by CCIL during cross-domain synthesis.',
  'docs://skills/roasting-historian/cluster/patterns/cross-coffee-insights.md':
    'Use when planning a new V1 roast and seeking cross-lot starting hypotheses — Confirmed Patterns (drop ceiling, Day 7 evaluation gate, WB-to-Ground delta sensitivity, etc.) + FC Floor & Ceiling by Process + WB-to-Ground Delta Norms + Session Position Effect + Green Spec→Starting Hypothesis (Additive + Precedence tables) + Varietal Aromatic Fingerprints + Rest Behavior Patterns + FC-Temp Architectural Constraint on Naturals + xbloom Misranking + Working Hypotheses (Single-Lot, Low Confidence). The central CCIL document — read first when scoping a new lot.',
  'docs://skills/roasting-historian/cluster/patterns/open-questions.md':
    'Use when planning a V1 design where a relevant Open Question is in scope — 12 research questions tracked for future roast sessions. Includes FC-Temp anchoring on naturals (3rd lot pending), audible FC threshold on heavy anaerobic naturals, Day 7 cupping-table-vs-pourover reversal on heavy-anaerobic Gesha, altitude-as-density proxy on one-shot calibrations, bean-temp end condition validation. Resolved questions are deleted, not strikethrough.',
  'docs://skills/roasting-historian/cluster/patterns/general.md':
    'Use when no per-axis pattern doc applies but a general roasting principle is in scope. Currently sparse — forward investment for non-axis-scoped patterns that emerge in future lots.',
  'docs://skills/roasting-historian/cluster/patterns/by-cultivar/gesha.md':
    'Use when designing a roast for a Gesha lot — per-cultivar roll-up + pointers. Corpus N=3 (Oma + Surma closed pre-counterflow + Gesha Clouds active). 48s dev-time floor for washed Gesha in counterflow + Gesha-Clouds Low-confidence hypotheses tracked here.',
  'docs://skills/roasting-historian/cluster/patterns/by-process/washed.md':
    'Use when designing a roast for a washed-process lot — per-process roll-up + pointers. Corpus N=6 closed (Sudan Rume Hybrid Washed + GV Oma + GV Surma + GUA El Socorro + GUA Libertad + Rancho Tio Emilio). Most data-rich slice of the archive; tightest FC + drop temp windows; Maillard-energy-continuity inlet-shape discipline.',
  'docs://skills/roasting-historian/cluster/learnings/cgle-mandela-xo.md':
    'Per-lot learnings for CGLE Mandela XO Extended Fermentation (closed April 2026, reference batch #139). Pointer to roast_learnings DB row + cross-lot framing — XO-fermented drop ceiling ~205-206°C; silent FC the rule; fan curve shape as single most impactful variable. Canonical Heavy-Ferment / XO-Family lot anchor.',
  'docs://skills/roasting-historian/cluster/learnings/cgle-sudan-rume-hybrid-washed.md':
    'Per-lot learnings for CGLE Sudan Rume Hybrid Washed (closed April 2026, reference #133 / closest replication #148). Most data-rich lot in archive (20+ batches, 6 experiment sets); empirical anchor for FC floor/ceiling, WB-to-Ground delta sensitivity, xbloom under-extraction discovery, varietal aromatic vocabulary unlock.',
  'docs://skills/roasting-historian/cluster/learnings/gv-oma-lot-25-035.md':
    'Per-lot learnings for Gesha Village Oma (closed counterflow-incomplete, green exhausted). Anchors the 48s dev-time floor for washed Gesha in counterflow; FC floor / drop ceiling row at Very low confidence pending a complete Gesha counterflow resolution.',
  'docs://skills/roasting-historian/cluster/learnings/gv-surma-lot-25-039.md':
    'Per-lot learnings for Gesha Village Surma (closed pre-counterflow). Pre-counterflow companion to GV Oma; same low-density/low-moisture green spec signature; dev-time-relative-to-FC primary lever.',
  'docs://skills/roasting-historian/cluster/learnings/gua-el-socorro-java.md':
    'Per-lot learnings for Guatemala El Socorro Java (closed pre-counterflow). RoR-shape-not-dev-time foundational pre-counterflow lesson. Highest-moisture (11.60%) lot in the archive — high-moisture row in Green Spec→Starting Hypothesis is Medium-High confidence pending a counterflow high-moisture lot.',
  'docs://skills/roasting-historian/cluster/learnings/gua-libertad-aurelio-del-cerro.md':
    'Per-lot learnings for Guatemala Libertad Aurelio del Cerro (closed pre-counterflow, Bourbon/Caturra blend). Canonical Maillard-energy-continuity inlet-shape lesson — recurring oversteeped-tea dryness resolved by smooth monotonically declining RoR into FC.',
  'docs://skills/roasting-historian/cluster/learnings/rancho-tio-emilio.md':
    'Per-lot learnings for Rancho Tio Emilio Typica Mejorado Washed (closed 2026-05-11, one-shot calibration). Brew-anchor-transferability lesson (variety signal dominates over anchor-roast brew lineage) + altitude-as-weak-proxy-for-density on one-shots + Typica Mejorado varietal aromatic fingerprint sourced here.',
  // Roasting Historian cluster — Wave 3 PR 1 addition (R-to-B Translation)
  'docs://skills/roasting-historian/cluster/patterns/roast-to-brew-translation.md':
    'Use when designing the optimized brew for a lot reaching reference-roast declaration, or when reading the cup at any planned recipe — translates roast parameter patterns into brew predictions. Reading Roast Parameters to Predict Brew Behavior table (WB-Ground delta + Agtron WB + Maillard% + FC temp/drop → starting adjustment) + Pushed vs Standard Recipe Decision Logic + Processing Method Starting Hypotheses for Brew + Brew-Reveals-Roast Principle (with the Low-confidence Rancho Tio extension on brew-strategy-mismatch-as-false-discordance). Plus 2 working hypotheses at the tail (WB-to-Ground Agtron Delta Hypothesis Violation on Drop-Ceiling-Breached Batch; Total Time Outweighs Peak Inlet for Body Weight on Pulp-Fermentation Washed at High Moisture). Migrated from ROASTING.md § Roast-to-Brew Translation in Wave 3 PR 1 (2026-05-26).',
  // ----- Peer-Learning Roasting Archivist (Wave 3 PR 1, ADR-0011) ------------
  'docs://skills/peer-learning-roasting-archivist/SKILL.md':
    'Peer-Learning Roasting Archivist sub-skill (Wave 3 PR 1 shipped 2026-05-26). Operator-curated cluster of external peer-roaster knowledge specifically for Roest L200 Ultra / counterflow practitioners. Low-volume; Chris-stubbed-Claude-integrates per Pattern I. Use when evaluating novel approaches against peer-roaster precedent.',
  'docs://skills/peer-learning-roasting-archivist/cluster/per-peer/dongzhe.md':
    'Use when scoping a new green intake or anchor profile — peer roaster Dongzhe profile (same Roest L200 Ultra in counterflow mode as Chris). Reference Roast Target #249 + Core Principles (RoR shape over dev time / Maillard + dev flavor axis / Naturals starting framework) folded from prior chat-history extractions, plus full Yunnan-Hatchi 2026-05-17 livestream extraction (three coffees roasted, intake hierarchy, five operational deltas + caveats about single-batch methodology + darker cup target). Tier 2 reference signal — directional principles transfer, his specific numbers do not. Migrated from docs/roasting/dongzhe-livestream-2026-05.md + ROASTING.md § Reference Roast Target + § Peer Insights in Wave 3 PR 1 (2026-05-26).',
  'docs://skills/peer-learning-roasting-archivist/cluster/cross-peer/patterns.md':
    'Use when looking for directional principles that converge across ≥3 peer-roaster profiles. Today N<3 (only Dongzhe profile authored); empty-state pointer back to per-peer/dongzhe.md. Activates when promotion criteria met.',
  'docs://skills/peer-learning-roasting-archivist/cluster/source-index.md':
    'Use when checking provenance + freshness of peer-roaster content in the cluster — per-peer source table (primary sources / last integrated / refresh signal) + source-type tier framework (Tier A livestream → Tier D short-form) + pending-source operator-watch list + stale-claim review log.',
  // ----- Roest Knowledge (Wave 3 PR 1, ADR-0011) -----------------------------
  'docs://skills/roest-knowledge/SKILL.md':
    'Roest Knowledge sub-skill (Wave 3 PR 1 shipped 2026-05-26). Machine + API knowledge for the Roest L200 Ultra in counterflow mode. Symmetry-promoted alongside Brewing Equipment Expert per ADR-0011. Read by Roasting Assistant during recipe design and Roest API Worker during push validation. Chris-stubbed-Claude-integrates per Patterns A / B / I.',
  'docs://skills/roest-knowledge/cluster/machine/l200-ultra.md':
    'Use when looking up Chris\'s Roest L200 Ultra hardware + accessory stack (Roest L200 Ultra counterflow 100g batches / Lightcells CM-200 / xbloom Brian Quan evaluation recipe / EG-1 Weber Workshop grinder). Cross-links into the cluster\'s protocols + counterflow-observations for behavioral detail. Migrated from ROASTING.md § Equipment in Wave 3 PR 1 (2026-05-26).',
  'docs://skills/roest-knowledge/cluster/machine/counterflow-observations.md':
    'Use when designing a roast and needing machine-specific thermal-behavior anchors — Turning Point (TP) probe artifact (Chris\'s 78-81°C vs peer 94°C), FC Temperature Targeting (200-205°C window), Charge Temperature (resolved at 117°C with probe lag explanation), Total Roast Time band (4:30-6:00 firm floor, softer ceiling), Session Position Effect (10-15s first-batch slow), Drop Temp as Primary Drop Signal (bean-temp end condition default + 4 manual-override exception rules), WB-to-Ground Agtron Delta as Development Signal (magnitude operational; sign flips by lot family). All observations machine-specific to Chris\'s L200 unit. Migrated from ROASTING.md § Key Counterflow Observations in Wave 3 PR 1 (2026-05-26).',
  'docs://skills/roest-knowledge/cluster/protocols/evaluation.md':
    'Use when running a Day 7 evaluation session — Current Protocol (Day 7 pourover sole gate, xbloom Brian Quan recipe, 15g dose, ≤3 batches preferred, full cup sips not spoon-only) + Ground Agtron measurement (target WB→Gnd delta ≤3 points) + Optimized brew session as separate post-winner step + Why Day 4 Cupping Was Removed rationale (Sudan Rume Hybrid Washed 20+ batches showed Day 4 misleading both directions). Cross-link into counterflow-observations.md for per-lot-family delta interpretation. Migrated from ROASTING.md § Evaluation Protocol in Wave 3 PR 1 (2026-05-26).',
  'docs://skills/roest-knowledge/cluster/protocols/fan-strategy.md':
    'Use when designing a roast curve — bundles Standard Inlet Curve Template (7-timestamp fixed template for V1 experiments: 00:00 / 01:15 / 02:30 / 03:15 peak / 04:00 / 05:00 / 06:00 + V1 design rules: hold timestamps constant, vary inlet temperature values, V1 is a wide mapping pass) + Fan Strategy (counterflow-shaped curves required, never flat fan, drying 78-82% → Maillard 63-70% → development 70-75%, per-coffee-type Maillard floor variation, current reference fan curves for Sudan Rume Washed / Natural / Mandela XO). Both controls are counterflow-conditioned; the conventional drum-mode flat-fan default does not apply. Migrated from ROASTING.md § Standard Inlet Curve Template + § Fan Strategy in Wave 3 PR 1 (2026-05-26).',
  'docs://skills/roest-knowledge/cluster/protocols/fc-marking.md':
    'Use when interpreting or recording FC events — manual marking at first audible crack above 202°C is the standard; false positive below 202°C never marked; auto-mark accepted for high-volume crack; silent-crack coffees (Mandela XO / anaerobic naturals / XO process) log as manual-no-audio at drop temp. FC marking decoupled from drop control as of 2026-05-04 (drop is controlled by bean-temp end condition). Why dev time as end condition is retired explained. Cross-link to roasts.fc_audibility enum (Sprint 11, migration 061). Migrated from ROASTING.md § FC Marking Protocol in Wave 3 PR 1 (2026-05-26).',
  'docs://skills/roest-knowledge/cluster/api/read-surface.md':
    'Use when interpreting Roest log fetches or scoping a read-side API behavior — endpoint table (pull_roest_log + list_roest_inventory + list_roest_logs) with implementation pointers. Operator-stub today; Pattern A + B refresh expected as Chris accumulates same-endpoint anomalies or firmware updates change read-surface shape.',
  'docs://skills/roest-knowledge/cluster/api/write-surface.md':
    'Use when designing a profile push or scoping a write-side API behavior — endpoint table (push_roast_profile + push_inventory + patch_inventory) with implementation pointers + per-curve format documentation (inlet [msec, °C] / fan [msec, %] / rpm [msec, rpm] / power [msec, %] per-axis validation) + inventory write schema fields. Seeded from Sprint Roest API write Phase 1+2 (2026-05-06).',
  'docs://skills/roest-knowledge/cluster/api/quirks.md':
    'Use when troubleshooting a Roest API push/pull failure or scoping a workaround — observed-quirk catalog. Operator-stub today (no quirks logged); promotion criteria documented. Patterns A + B flow content here.',
  'docs://skills/roest-knowledge/cluster/firmware/README.md':
    'Use when looking up per-firmware-version behavioral notes for the Roest L200 Ultra — placeholder for per-version files when firmware changes affect machine or API behavior. Empty today.',
  'docs://skills/roest-knowledge/cluster/observed-quirks.md':
    'Use when checking for machine-side anomalies that don\'t directly drive recipe construction — load-bearing machine quirks live inline in counterflow-observations.md. This doc is for non-recipe-driving anomalies. Operator-stub today.',
  // ----- Workflow Planning tier (Wave 3 PR 2, ADR-0011) ---------------------
  'docs://skills/roasting-assistant/SKILL.md':
    'Roasting Assistant sub-skill (Wave 3 PR 2 shipped 2026-05-26). Workflow Planning tier; reads-only composition over Roasting Historian + WBC Roasting Archivist + Roest Knowledge + Peer-Learning Roasting Archivist clusters. Constructs roast recipe proposals before the physical roast happens — V-set design (V_n a/b/c with deliberate variance against documented variable + expected outcome) or one-shot single-batch design. Outputs a typed structure matching roast_recipes schema columns (charge_temp / hopper_load_temp / bezier curves / drop rules / predicted FC / predicted cup / rationale) pre-push; Roest API Worker pushes to Roest, Roast Recorder writes to corpus post-roast. Called by Master Coordinator via start-lot.md / one-shot.md / log-cupping.md STAGE 3 V_(n+1) design intent + Cupping Specialist Path B. No MCP Tools directly. No cluster authored at ship time per scope decision 1 (templates accrue under Pattern F if they emerge in lived use).',
  'docs://skills/brewing-assistant/SKILL.md':
    'Brewing Assistant sub-skill (Wave 3 PR 2 shipped 2026-05-26). Workflow Planning tier; reads-only composition over Brewing Historian + WBC Brewing Archivist + Brewing Equipment Expert clusters. Three-phase: Phase 1 (initial recipe construction — pick extraction strategy + modifiers + dose + water + grinder + grind setting + temp + pour structure) → Phase 2 (in-thread iteration on tasting notes, absorbing the Palate Evaluator role per ADR-0011 § iteration-depth asymmetry; intermediate iterations stay in claude.ai thread context, not persisted) → Phase 3 (handoff to Brew Recorder with the optimized recipe). Outputs typed shape matching brews schema. Called by Master Coordinator via start-brew.md / log-brew.md + Cupping Specialist Path A (Chain 1 optimized brew dial-in at lot resolution). No MCP Tools directly. No cluster authored at ship time per scope decision 1.',
  'docs://skills/learning-assistant/SKILL.md':
    'Learning Assistant sub-skill (Wave 3 PR 2 shipped 2026-05-26). Workflow Planning tier; the only cross-domain planner. Constructs research tracks — long-running cross-lot / cross-coffee studies (examples: "test water side across next 5 lots", "blending experiments", "longitudinal resting-curve study"). Vocabulary discipline: research track vs experiment (experiments are per-lot V-set rows in the experiments table). Reads-only composition over both Historians + Brewing Equipment Expert (when equipment dimension applies) + WBC Roasting Archivist § sourcing/ + CCIL (Wave 4 dependency; degrades gracefully until then) + direct green_beans table reads. Outputs research-track design + execution plan + outcome-capture template. Constituent roasts/brews flow through Roast Recorder / Brew Recorder with track-aware metadata. No MCP Tools directly. No cluster authored per scope decision 1. Learning Knowledge stays deferred until ≥2 research tracks complete per ADR-0011 trigger.',
  'docs://skills/sourcing-workflow-planner/SKILL.md':
    'Sourcing Workflow Planner sub-skill (Wave 3 PR 2 shipped 2026-05-26). Workflow Planning tier; reads-only composition over WBC Roasting Archivist § sourcing/ (currently merged per ADR-0011 tentative collapse; future split when sourcing book lands) + Roasting Historian closed-lot lane retros + direct green_beans table reads. Evaluates a new lot opportunity against sourcing strategy + current portfolio; outputs buy / hold / pass recommendation + lane-fit assessment ("fits Tier 2 / Lane B — Experimental Processing") + rationale prose. Sourcing decisions are physical-world events; no substrate write until the lot physically arrives via Chain 3 (start-lot.md → Roasting Assistant). Called by Master Coordinator via new-sourcing-opportunity intent (operator-initiated; no dedicated prompt today). No MCP Tools directly. No cluster authored per scope decision 1.',
  // ----- Workflow Executing tier (Wave 3 PR 3, ADR-0011) --------------------
  'docs://skills/roast-recorder/SKILL.md':
    'Roast Recorder sub-skill (Wave 3 PR 3 shipped 2026-05-26). Workflow Executing tier; substrate-writer wrapping push_roast + push_roast_recipe (when not pre-pushed by Roasting Assistant) + patch_roast + patch_roast_recipe. Writes per-batch roast execution after the physical roast completes; reads Roest log + per-batch reflections + Roest Knowledge cluster (log interpretation + protocols) + Roasting Historian cluster (retrospective comparison). Owns the slot → recipe_id map resolution including pre-rewrite-lot fallback (a) + missing-recipe-row inline backfill (b) per log-roast.md STAGE 1; halts when neither path can reconstruct design intent. Sets fc_audibility 4-value enum per batch (Sprint 11 RO-CP-3). Called by Master Coordinator via log-roast.md; Chain 3 hop after Roest API Worker + physical roast event. N=10 Stage 1 → 2 graduation per ADR-0013 substrate-writer rule. No cluster authored per PR 2/3 precedent.',
  'docs://skills/brew-recorder/SKILL.md':
    'Brew Recorder sub-skill (Wave 3 PR 3 shipped 2026-05-26). Workflow Executing tier; substrate-writer wrapping push_brew + patch_brew + propose_doc_changes (downstream into Brewing Historian cluster via bundled-brewing-completion pipeline). Per-coffee terminal write — brewing iterates IN-THREAD ONLY per ADR-0011 § iteration-depth asymmetry; intermediate iterations stay in claude.ai thread context and never persist, only the optimized brew lands here. Validates canonical-registry compliance against Brewing Equipment Expert + per-axis registries + fermentation_qualifiers (Sprint T3 / CR-5 Anoxic cue). Sets *_override:true to bypass canonical for net-new text-only columns (roaster / producer / brewer / filter / grinder) + queues via taxonomy_overrides_queue. Called by Master Coordinator via bundled-brewing-completion.md (purchased) or Brewing Assistant Phase 3 handoff (self-roasted); Chain 1 + Chain 4 terminal hop. N=10 Stage 1 → 2 graduation. No cluster authored per PR 2/3 precedent.',
  'docs://skills/cupping-specialist/SKILL.md':
    'Cupping Specialist sub-skill (Wave 3 PR 3 shipped 2026-05-26). Workflow Executing tier; substrate-writer wrapping push_cupping + patch_cupping + patch_experiment + patch_roast (is_reference_candidate flag, co-owned with Roast Recorder) + propose_doc_changes. Executes Day-7 xBloom cupping evaluation, writes cup-side experiment closure (delta_from_cup_* / winner / key_insight + key_insight_confidence Low/Medium/Medium-High/High ladder / what_changes_going_forward / open_questions / additional_notes), marks is_reference_candidate on V-set leading slot (Schema sprint S2, decoupled from is_reference), and routes the V-set forward via Path A (close-out via Chain 1) / Path B (Roasting Assistant for V_(n+1)) / Path C-1 (peer-cup calibration halt) / Path C-2 (real-pourover discriminator halt). **POD-1 absorbed at SKILL.md level + bookmarked at cluster/pod-1-routing.md** pending lived-practice trigger conditions; today\'s Path C-1/C-2 substrate kept intact, future simulated-pourover-gate rewrite deferred. Called by Master Coordinator via log-cupping.md; Chain 1 entry (Path A) + Chain 3 mid-stage closer. N=10 Stage 1 → 2 graduation.',
  'docs://skills/cupping-specialist/cluster/pod-1-routing.md':
    'POD-1 routing scoping draft carried forward into Cupping Specialist\'s cluster (Wave 3 PR 3). Bookmarks the simulated-pourover-as-3rd-cup-read concept + Path C-1/C-2 rewrite directions + schema scoping (cuppings.eval_method=\'Simulated Pourover\' vs brews.is_simulated_pourover flag vs hybrid) + cross-project handoff lifecycle states. **Full rewrite gated on 4 lived-practice trigger conditions:** 2-3 more V-set lots progressing through Path A; at least one one-shot close-out; Stefano Um / Bukure / Higuito decisions observed; C-2 disambiguation cases either observed or deprecated. Until then, today\'s Path C-1/C-2 substrate is canonical; this doc is the dormant scoping context for the future POD-1 follow-up sprint.',
  'docs://skills/roest-api-worker/SKILL.md':
    'Roest API Worker sub-skill (Wave 3 PR 3 shipped 2026-05-26). Workflow Executing tier; substrate-writer wrapping push_roast_profile + patch_roast_recipe (Roest profile linkage, co-owned with Roast Recorder). Symmetry-split from Roest Knowledge per ADR-0011 — Roest Knowledge holds machine + API docs, Roest API Worker is the executor that calls the API. Pushes roast profiles to Roest L200 Ultra; translates recipe (bezier curves + drop rules + end-condition + charge + hopper) into push_roast_profile payload; returns profile_id + share_url; patches roast_recipes with roest_profile_id linkage. Validation gap acknowledged today (returns success on API acceptance, not machine confirmation); future verify_roast_profile_landed Tool may close the gap. Called by Roasting Assistant on operator approval OR Master Coordinator via start-lot.md STAGE 3; Chain 3 hop between Roasting Assistant and Roast Recorder. Pattern B self-improvement (API drift events → Roest Knowledge refresh). N=10 Stage 1 → 2 graduation. No cluster authored.',
  'docs://skills/close-lot-specialist/SKILL.md':
    'Close-Lot Specialist sub-skill (Wave 3 PR 3 shipped 2026-05-26). Workflow Executing tier; **resolved-lot completion gate**. Substrate-writer wrapping push_roast_learnings + patch_roast_learnings + patch_roast (is_reference + worth_repeating, co-owned) + patch_inventory + propose_doc_changes. Handles both V-set close-out (close-lot.md; full carry-forward field discipline) and one-shot close-out (one-shot-closeout.md; 7 lever-attribution fields schema-rejected per migration 054; "Low confidence - N=1" prefix discipline; Outcome A reference-quality vs Outcome B "Closed without reference" via why_this_roast_won:NULL routing). Verifies cross-link integrity end-to-end: roasts.is_reference + roast_learnings.best_roast_id (typed FK) + best_batch_id (legacy text back-compat) + reference cup (cuppings on best_roast_id with eval_method ILIKE pourover) + optimized brew (brews.green_bean_id, ideally roast_id=best_roast_id). Scope tags discipline per Sprint 12 / ADR-0009 (loose-canonical namespaced prefixes — process:* / variety:* / country:* / altitude:* / evaluation_method:* / general). Called by Master Coordinator via close-lot.md / one-shot-closeout.md; Chain 1 terminal hop after Brew Recorder writes optimized brew (cross-domain handoff from Brewing Assistant); Chain 3 Path C close-without-reference terminal hop. N=10 Stage 1 → 2 graduation.',
  'docs://skills/ccil/SKILL.md':
    'Cross-Coffee Insight Layer (CCIL) sub-skill (Wave 4 PR 4a shipped 2026-05-21; skeleton + Sudan Rume seed pattern). Special / cross-domain tier above both domain Historians. Synthesizes ACROSS roasting + brewing domains (e.g. "what I learned about Sudan Rume from BOTH my brewing AND my roasting of this variety") — distinct from each Historian\'s internal-to-domain cross-coffee synthesis. Reads-only consumption of Roasting Historian + Brewing Historian + WBC Archivists + Latent per-entity terminal synthesis caches; outputs cross-domain pattern docs consumed by Roasting Assistant + Brewing Assistant + Learning Assistant (the 3 cross-domain-aware planners). Does NOT call workflow tier. No MCP Tools directly. Pattern F (bloat-tripwire decomposition) is the PRIMARY self-improvement pattern — when total cluster exceeds 120KB OR a single doc exceeds 60KB, decompose into sub-domain CCILs. Pattern A also active (Historians\' patterns drift → CCIL re-synthesizes). Wave 4 PR 4b closes the architecture implementation arc by rewriting BREWING.md + ROASTING.md as ~500-byte redirect stubs + extracting CLAUDE.md sub-skills section to docs/architecture/sub-skills-status.md. Stage-1 autonomy with N=3 fast-graduation threshold per ADR-0013 outlier rules; Stage-2→3 advancement slower than default because cross-domain synthesis errors propagate further.',
  'docs://skills/ccil/cluster/coffee/sudan-rume/across-roasting-and-brewing.md':
    'CCIL seed pattern doc — Sudan Rume across roasting + brewing (Wave 4 PR 4a). Demonstrates the cross-domain synthesis shape: variety throughline (transparency-driven aromatic landrace, light brown-tea body, herbal-spicy register) + per-layer mechanics (roasting: FC window 200-205°C / Washed WB-Ground delta target ≤3 / Natural fruit-layer insulation needs washed-level energy / Dongzhe washed-profile-anchor caveat) + per-layer mechanics (brewing: April Brewer Glass + April Paper for naturals as vehicle-corrective / fast-cone counter-example on Latent-roasted SR Hybrid Washed / 91°C temperature ceiling / body-intuition body-not-grind rule). Flags the cross-domain tension: process-scoped vs variety-scoped vehicle-dependency rule (low-confidence working hypothesis pending second SR Washed brew). Outputs structured planner-consumable recommendations for Roasting Assistant + Brewing Assistant + Learning Assistant. N=3 across both domains (2 Latent-roasted SR lots + 1 externally-roasted SR brewing lot).',
  'docs://skills/ccil/cluster/decomposition-log.md':
    'CCIL Pattern F audit trail (Wave 4 PR 4a — first entry logs the skeleton + seed pattern ship). Append-only log of every CCIL self-decomposition event: when CCIL split into sub-domain CCILs, what triggered the split (bloat tripwire / dispatch-accuracy degradation / cross-pattern density). Trigger conditions enumerated at top: >120KB total cluster size; >60KB single doc; dispatch-accuracy drift below autonomy graduation threshold; cross-domain pattern density exceeds intra-pattern coherence. Decomposition procedure: move pattern docs to new sub-structure, preserve back-compat redirect stubs, update CCIL SKILL.md cluster contents, register new paths in lib/mcp/docs.ts, run cross-system audit. Historical entries are NOT edited or removed.',
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
    // Brewing Historian (Wave 2 PR 2, ADR-0011)
    entry(
      'docs://skills/brewing-historian/SKILL.md',
      'docs/skills/brewing-historian/SKILL.md',
      'Brewing Historian — SKILL',
    ),
    entry(
      'docs://skills/brewing-historian/cluster/patterns/cross-coffee-insights.md',
      'docs/skills/brewing-historian/cluster/patterns/cross-coffee-insights.md',
      'Brewing Historian — Cross-Coffee Insights (By Modifier / Process / Variety / Cooling / Office / Open Questions)',
    ),
    entry(
      'docs://skills/brewing-historian/cluster/patterns/by-strategy/clarity-first.md',
      'docs/skills/brewing-historian/cluster/patterns/by-strategy/clarity-first.md',
      'Brewing Historian — By Strategy: Clarity-First',
    ),
    entry(
      'docs://skills/brewing-historian/cluster/patterns/by-strategy/suppression.md',
      'docs/skills/brewing-historian/cluster/patterns/by-strategy/suppression.md',
      'Brewing Historian — By Strategy: Suppression',
    ),
    entry(
      'docs://skills/brewing-historian/cluster/patterns/by-strategy/balanced-intensity.md',
      'docs/skills/brewing-historian/cluster/patterns/by-strategy/balanced-intensity.md',
      'Brewing Historian — By Strategy: Balanced Intensity',
    ),
    entry(
      'docs://skills/brewing-historian/cluster/patterns/by-strategy/full-expression.md',
      'docs/skills/brewing-historian/cluster/patterns/by-strategy/full-expression.md',
      'Brewing Historian — By Strategy: Full Expression',
    ),
    entry(
      'docs://skills/brewing-historian/cluster/patterns/by-strategy/extraction-push.md',
      'docs/skills/brewing-historian/cluster/patterns/by-strategy/extraction-push.md',
      'Brewing Historian — By Strategy: Extraction Push',
    ),
    entry(
      'docs://skills/brewing-historian/cluster/patterns/by-strategy/hybrid.md',
      'docs/skills/brewing-historian/cluster/patterns/by-strategy/hybrid.md',
      'Brewing Historian — By Strategy: Hybrid',
    ),
    entry(
      'docs://skills/brewing-historian/cluster/patterns/by-cultivar/gesha.md',
      'docs/skills/brewing-historian/cluster/patterns/by-cultivar/gesha.md',
      'Brewing Historian — By Cultivar: Gesha (N=34)',
    ),
    entry(
      'docs://skills/brewing-historian/cluster/patterns/by-cultivar/74158.md',
      'docs/skills/brewing-historian/cluster/patterns/by-cultivar/74158.md',
      'Brewing Historian — By Cultivar: 74158 (N=5)',
    ),
    entry(
      'docs://skills/brewing-historian/cluster/patterns/by-cultivar/sidra.md',
      'docs/skills/brewing-historian/cluster/patterns/by-cultivar/sidra.md',
      'Brewing Historian — By Cultivar: Sidra (N=5)',
    ),
    entry(
      'docs://skills/brewing-historian/cluster/patterns/by-cultivar/ethiopian-landrace-population.md',
      'docs/skills/brewing-historian/cluster/patterns/by-cultivar/ethiopian-landrace-population.md',
      'Brewing Historian — By Cultivar: Ethiopian landrace population (N=4)',
    ),
    entry(
      'docs://skills/brewing-historian/cluster/patterns/by-cultivar/mejorado.md',
      'docs/skills/brewing-historian/cluster/patterns/by-cultivar/mejorado.md',
      'Brewing Historian — By Cultivar: Mejorado (N=3)',
    ),
    entry(
      'docs://skills/brewing-historian/cluster/patterns/by-cultivar/pacamara.md',
      'docs/skills/brewing-historian/cluster/patterns/by-cultivar/pacamara.md',
      'Brewing Historian — By Cultivar: Pacamara (N=3)',
    ),
    entry(
      'docs://skills/brewing-historian/cluster/patterns/by-cultivar/sudan-rume.md',
      'docs/skills/brewing-historian/cluster/patterns/by-cultivar/sudan-rume.md',
      'Brewing Historian — By Cultivar: Sudan Rume (N=3)',
    ),
    entry(
      'docs://skills/brewing-historian/cluster/patterns/by-coffee-family/anaerobic-natural.md',
      'docs/skills/brewing-historian/cluster/patterns/by-coffee-family/anaerobic-natural.md',
      'Brewing Historian — By Coffee Family: Anaerobic Natural (N=10)',
    ),
    entry(
      'docs://skills/brewing-historian/cluster/patterns/by-coffee-family/anaerobic-washed.md',
      'docs/skills/brewing-historian/cluster/patterns/by-coffee-family/anaerobic-washed.md',
      'Brewing Historian — By Coffee Family: Anaerobic Washed (N=5)',
    ),
    entry(
      'docs://skills/brewing-historian/cluster/patterns/by-coffee-family/yeast-inoculated-washed.md',
      'docs/skills/brewing-historian/cluster/patterns/by-coffee-family/yeast-inoculated-washed.md',
      'Brewing Historian — By Coffee Family: Yeast-Inoculated Washed (N=4)',
    ),
    entry(
      'docs://skills/brewing-historian/cluster/patterns/by-coffee-family/yeast-inoculated-natural.md',
      'docs/skills/brewing-historian/cluster/patterns/by-coffee-family/yeast-inoculated-natural.md',
      'Brewing Historian — By Coffee Family: Yeast-Inoculated Natural (N=3)',
    ),
    entry(
      'docs://skills/brewing-historian/cluster/patterns/by-coffee-family/double-anaerobic-washed.md',
      'docs/skills/brewing-historian/cluster/patterns/by-coffee-family/double-anaerobic-washed.md',
      'Brewing Historian — By Coffee Family: Double Anaerobic Washed (N=3)',
    ),
    entry(
      'docs://skills/brewing-historian/cluster/patterns/by-coffee-family/thermal-shock-washed.md',
      'docs/skills/brewing-historian/cluster/patterns/by-coffee-family/thermal-shock-washed.md',
      'Brewing Historian — By Coffee Family: Thermal Shock Washed (N=3)',
    ),
    // Roasting Historian (Wave 2 PR 3 — listDocs entries originally missed; added retroactively in Wave 3 PR 1)
    entry(
      'docs://skills/roasting-historian/SKILL.md',
      'docs/skills/roasting-historian/SKILL.md',
      'Roasting Historian — SKILL',
    ),
    entry(
      'docs://skills/roasting-historian/cluster/patterns/cross-coffee-insights.md',
      'docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md',
      'Roasting Historian — Cross-Coffee Insights (CCIL)',
    ),
    entry(
      'docs://skills/roasting-historian/cluster/patterns/open-questions.md',
      'docs/skills/roasting-historian/cluster/patterns/open-questions.md',
      'Roasting Historian — Open Questions (12 research questions)',
    ),
    entry(
      'docs://skills/roasting-historian/cluster/patterns/general.md',
      'docs/skills/roasting-historian/cluster/patterns/general.md',
      'Roasting Historian — General (non-axis-scoped patterns)',
    ),
    entry(
      'docs://skills/roasting-historian/cluster/patterns/by-cultivar/gesha.md',
      'docs/skills/roasting-historian/cluster/patterns/by-cultivar/gesha.md',
      'Roasting Historian — By Cultivar: Gesha (N=3)',
    ),
    entry(
      'docs://skills/roasting-historian/cluster/patterns/by-process/washed.md',
      'docs/skills/roasting-historian/cluster/patterns/by-process/washed.md',
      'Roasting Historian — By Process: Washed (N=6)',
    ),
    entry(
      'docs://skills/roasting-historian/cluster/patterns/roast-to-brew-translation.md',
      'docs/skills/roasting-historian/cluster/patterns/roast-to-brew-translation.md',
      'Roasting Historian — Roast-to-Brew Translation (Wave 3 PR 1 addition)',
    ),
    entry(
      'docs://skills/roasting-historian/cluster/learnings/cgle-mandela-xo.md',
      'docs/skills/roasting-historian/cluster/learnings/cgle-mandela-xo.md',
      'Roasting Historian — Per-Lot: CGLE Mandela XO',
    ),
    entry(
      'docs://skills/roasting-historian/cluster/learnings/cgle-sudan-rume-hybrid-washed.md',
      'docs/skills/roasting-historian/cluster/learnings/cgle-sudan-rume-hybrid-washed.md',
      'Roasting Historian — Per-Lot: CGLE Sudan Rume Hybrid Washed',
    ),
    entry(
      'docs://skills/roasting-historian/cluster/learnings/gv-oma-lot-25-035.md',
      'docs/skills/roasting-historian/cluster/learnings/gv-oma-lot-25-035.md',
      'Roasting Historian — Per-Lot: Gesha Village Oma (Lot 25-035)',
    ),
    entry(
      'docs://skills/roasting-historian/cluster/learnings/gv-surma-lot-25-039.md',
      'docs/skills/roasting-historian/cluster/learnings/gv-surma-lot-25-039.md',
      'Roasting Historian — Per-Lot: Gesha Village Surma (Lot 25-039)',
    ),
    entry(
      'docs://skills/roasting-historian/cluster/learnings/gua-el-socorro-java.md',
      'docs/skills/roasting-historian/cluster/learnings/gua-el-socorro-java.md',
      'Roasting Historian — Per-Lot: Guatemala El Socorro Java',
    ),
    entry(
      'docs://skills/roasting-historian/cluster/learnings/gua-libertad-aurelio-del-cerro.md',
      'docs/skills/roasting-historian/cluster/learnings/gua-libertad-aurelio-del-cerro.md',
      'Roasting Historian — Per-Lot: Guatemala Libertad Aurelio del Cerro',
    ),
    entry(
      'docs://skills/roasting-historian/cluster/learnings/rancho-tio-emilio.md',
      'docs/skills/roasting-historian/cluster/learnings/rancho-tio-emilio.md',
      'Roasting Historian — Per-Lot: Rancho Tio Emilio (one-shot calibration)',
    ),
    // Peer-Learning Roasting Archivist (Wave 3 PR 1, ADR-0011)
    entry(
      'docs://skills/peer-learning-roasting-archivist/SKILL.md',
      'docs/skills/peer-learning-roasting-archivist/SKILL.md',
      'Peer-Learning Roasting Archivist — SKILL',
    ),
    entry(
      'docs://skills/peer-learning-roasting-archivist/cluster/per-peer/dongzhe.md',
      'docs/skills/peer-learning-roasting-archivist/cluster/per-peer/dongzhe.md',
      'Peer-Learning Roasting Archivist — Per-Peer: Dongzhe (Tier 2 same-machine peer)',
    ),
    entry(
      'docs://skills/peer-learning-roasting-archivist/cluster/cross-peer/patterns.md',
      'docs/skills/peer-learning-roasting-archivist/cluster/cross-peer/patterns.md',
      'Peer-Learning Roasting Archivist — Cross-Peer Patterns (N<3 placeholder)',
    ),
    entry(
      'docs://skills/peer-learning-roasting-archivist/cluster/source-index.md',
      'docs/skills/peer-learning-roasting-archivist/cluster/source-index.md',
      'Peer-Learning Roasting Archivist — Source Index (provenance + freshness)',
    ),
    // Roest Knowledge (Wave 3 PR 1, ADR-0011)
    entry(
      'docs://skills/roest-knowledge/SKILL.md',
      'docs/skills/roest-knowledge/SKILL.md',
      'Roest Knowledge — SKILL',
    ),
    entry(
      'docs://skills/roest-knowledge/cluster/machine/l200-ultra.md',
      'docs/skills/roest-knowledge/cluster/machine/l200-ultra.md',
      'Roest Knowledge — Machine: L200 Ultra (hardware + accessory stack)',
    ),
    entry(
      'docs://skills/roest-knowledge/cluster/machine/counterflow-observations.md',
      'docs/skills/roest-knowledge/cluster/machine/counterflow-observations.md',
      'Roest Knowledge — Machine: Counterflow Observations (TP / FC / Charge / Drop / WB-Gnd Delta)',
    ),
    entry(
      'docs://skills/roest-knowledge/cluster/protocols/evaluation.md',
      'docs/skills/roest-knowledge/cluster/protocols/evaluation.md',
      'Roest Knowledge — Protocol: Day 7 Evaluation',
    ),
    entry(
      'docs://skills/roest-knowledge/cluster/protocols/fan-strategy.md',
      'docs/skills/roest-knowledge/cluster/protocols/fan-strategy.md',
      'Roest Knowledge — Protocol: Fan Strategy + Standard Inlet Curve Template',
    ),
    entry(
      'docs://skills/roest-knowledge/cluster/protocols/fc-marking.md',
      'docs/skills/roest-knowledge/cluster/protocols/fc-marking.md',
      'Roest Knowledge — Protocol: FC Marking',
    ),
    entry(
      'docs://skills/roest-knowledge/cluster/api/read-surface.md',
      'docs/skills/roest-knowledge/cluster/api/read-surface.md',
      'Roest Knowledge — API: Read Surface (pull_roest_log + list_roest_*)',
    ),
    entry(
      'docs://skills/roest-knowledge/cluster/api/write-surface.md',
      'docs/skills/roest-knowledge/cluster/api/write-surface.md',
      'Roest Knowledge — API: Write Surface (push_roast_profile + push/patch_inventory)',
    ),
    entry(
      'docs://skills/roest-knowledge/cluster/api/quirks.md',
      'docs/skills/roest-knowledge/cluster/api/quirks.md',
      'Roest Knowledge — API: Observed Quirks (operator-stub)',
    ),
    entry(
      'docs://skills/roest-knowledge/cluster/firmware/README.md',
      'docs/skills/roest-knowledge/cluster/firmware/README.md',
      'Roest Knowledge — Firmware: Per-Version Notes (operator-stub)',
    ),
    entry(
      'docs://skills/roest-knowledge/cluster/observed-quirks.md',
      'docs/skills/roest-knowledge/cluster/observed-quirks.md',
      'Roest Knowledge — Machine-Side Observed Quirks (operator-stub)',
    ),
    // Workflow Planning tier (Wave 3 PR 2, ADR-0011 + ADR-0012)
    entry(
      'docs://skills/roasting-assistant/SKILL.md',
      'docs/skills/roasting-assistant/SKILL.md',
      'Roasting Assistant — SKILL (Workflow Planning; V-set + one-shot recipe design)',
    ),
    entry(
      'docs://skills/brewing-assistant/SKILL.md',
      'docs/skills/brewing-assistant/SKILL.md',
      'Brewing Assistant — SKILL (Workflow Planning; recipe construction + in-thread iteration absorbs Palate Evaluator)',
    ),
    entry(
      'docs://skills/learning-assistant/SKILL.md',
      'docs/skills/learning-assistant/SKILL.md',
      'Learning Assistant — SKILL (Workflow Planning; cross-domain research-track design)',
    ),
    entry(
      'docs://skills/sourcing-workflow-planner/SKILL.md',
      'docs/skills/sourcing-workflow-planner/SKILL.md',
      'Sourcing Workflow Planner — SKILL (Workflow Planning; buy/hold/pass + lane-fit assessment)',
    ),
    // Workflow Executing tier (Wave 3 PR 3, ADR-0011)
    entry(
      'docs://skills/roast-recorder/SKILL.md',
      'docs/skills/roast-recorder/SKILL.md',
      'Roast Recorder — SKILL (Workflow Executing; push_roast + push_roast_recipe + slot→recipe map)',
    ),
    entry(
      'docs://skills/brew-recorder/SKILL.md',
      'docs/skills/brew-recorder/SKILL.md',
      'Brew Recorder — SKILL (Workflow Executing; push_brew + canonical validation + bundled-completion)',
    ),
    entry(
      'docs://skills/cupping-specialist/SKILL.md',
      'docs/skills/cupping-specialist/SKILL.md',
      'Cupping Specialist — SKILL (Workflow Executing; push_cupping + V-set Path A/B/C-1/C-2 routing; absorbs POD-1)',
    ),
    entry(
      'docs://skills/cupping-specialist/cluster/pod-1-routing.md',
      'docs/skills/cupping-specialist/cluster/pod-1-routing.md',
      'Cupping Specialist — POD-1 routing scoping draft (deferred; gated on 4 trigger conditions)',
    ),
    entry(
      'docs://skills/roest-api-worker/SKILL.md',
      'docs/skills/roest-api-worker/SKILL.md',
      'Roest API Worker — SKILL (Workflow Executing; push_roast_profile to Roest L200 Ultra)',
    ),
    entry(
      'docs://skills/close-lot-specialist/SKILL.md',
      'docs/skills/close-lot-specialist/SKILL.md',
      'Close-Lot Specialist — SKILL (Workflow Executing; resolved-lot completion gate; push_roast_learnings + cross-link verification)',
    ),
    // Cross-Coffee Insight Layer (Wave 4 PR 4a)
    entry(
      'docs://skills/ccil/SKILL.md',
      'docs/skills/ccil/SKILL.md',
      'Cross-Coffee Insight Layer — SKILL (Special; cross-domain synthesis above both Historians; Pattern F decomposition)',
    ),
    entry(
      'docs://skills/ccil/cluster/coffee/sudan-rume/across-roasting-and-brewing.md',
      'docs/skills/ccil/cluster/coffee/sudan-rume/across-roasting-and-brewing.md',
      'CCIL — Sudan Rume across roasting + brewing (seed pattern; N=3; variety throughline + per-layer mechanics + vehicle-dependency cross-domain tension)',
    ),
    entry(
      'docs://skills/ccil/cluster/decomposition-log.md',
      'docs/skills/ccil/cluster/decomposition-log.md',
      'CCIL — decomposition log (Pattern F audit trail; append-only; logs every self-decomposition event)',
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
