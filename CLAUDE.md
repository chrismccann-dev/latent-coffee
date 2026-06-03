# Latent Coffee Research

Latent Coffee Research is Chris's personal coffee research journal — single-tenant, single-user, no plans for multi-tenancy. Two workflows compound knowledge: **brewing is archive-driven** (claude.ai iterates, the app gets the final brew); **roasting is iterative** (Roest API streams logs/experiments/cuppings into the app as the lot resolves, then closes with a reference roast + roast_learnings synthesis). Built with Next.js 14, Supabase (Postgres + Auth + RLS), deployed on Vercel. **claude.ai writing via MCP is the canonical input path** — no manual DB inserts, no paste-into-spreadsheet flows, no in-app forms. End state reached: roasting deprecation landed Sub Pages 6.6 (2026-05-13); brewing-side `/add` + `/brews/[id]/edit` deprecation landed Writing-path Sub-sprint 4 (2026-05-27). Every entity (brews + green_beans + roasts + roast_recipes + experiments + cuppings + roast_learnings) writes exclusively via the Latent MCP server. See [feedback_mcp_only_input.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_mcp_only_input.md) for the standing principle.

## Documentation Index

Foundational living docs (root level — first thing you read):
- **[PRODUCT.md](PRODUCT.md)** — Vision, data model, taste profile, full Roadmap (7 sections: Active Sprints / Side Quests / Blocked and Parked / Missing and Incomplete / Bugs and Issues / Longer Term Items / Future Directions), Scaling Watch-Items, Lessons Learned.
- **[BREWING.md](BREWING.md)** — ~3KB redirect-stub pointer table as of Wave 4 PR 4b (2026-05-21). All brewing operational content migrated to sub-skill clusters (full mapping in the stub). Brew sessions enter via `docs/prompts/start-brew.md`; the prompt + Brewing Assistant cluster + Brewing Equipment Expert cluster + Brewing Historian cluster + WBC Brewing Archivist cluster + coordinator/catalog § brewing-domain-principles compose over the substrate.
- **[ROASTING.md](ROASTING.md)** — ~6KB redirect-stub pointer table as of Wave 4 PR 4b (2026-05-21). All roasting operational content migrated to sub-skill clusters (full mapping in the stub). Roast sessions enter via `docs/prompts/start-lot.md` (V-set) or `one-shot.md` (one-shot); the prompts + Roasting Assistant cluster + Roest Knowledge cluster + Roasting Historian cluster (active-lots / learnings / patterns) + Peer-Learning Roasting Archivist cluster + WBC Roasting Archivist cluster + coordinator/catalog § roasting-domain-principles + coordinator/operator-guide compose over the substrate.

Shared language + decisions:
- **CONTEXT-* glossary family** — Glossary of Latent-specific terminology, split into 3 zone-aligned docs as of 2026-05-24 (Sprint R Phase 4 Step 5) so claude.ai sessions can load only the zone they need: **[CONTEXT-roasting.md](CONTEXT-roasting.md)** (V-set / Recipe / Roest profile / Anchor profile / Operator-fixed constants / Lifecycle / Lever / Reference candidate / Reference roast / FC audibility / Maillard % / Cup character / Forward design / Pre-V_n calibration gate / Simulated Pourover Gate), **[CONTEXT-brewing.md](CONTEXT-brewing.md)** (Two-Axis Framework / Extraction Strategy / Modifier / Coffee Brief / signal arbitration / Strategy zone / Wrong-zone trap / Iteration loop / Hybrid sub-form / Cooling-Curve Target / WBC corpus check / Signature method), **[CONTEXT-shared.md](CONTEXT-shared.md)** (now a thin glossary INDEX at ~49 KB post Pattern J pruning 2026-05-25 — the 4 operational subsections moved to dedicated reference-tier docs: [docs/reference/mcp-architecture.md](docs/reference/mcp-architecture.md) / [docs/reference/canonical-registries.md](docs/reference/canonical-registries.md) / [docs/reference/wbc-materials.md](docs/reference/wbc-materials.md) / [docs/reference/synthesis-pipeline.md](docs/reference/synthesis-pipeline.md); the Flagged ambiguities ledger moved to sibling [docs/grilling-flagged-ambiguities.md](docs/grilling-flagged-ambiguities.md). Only Relationships + Example dialogue + back-pointers remain in the shared zone file). Strict glossary per [grill-with-docs](.claude/skills/grill-with-docs/SKILL.md) format — no implementation details, only term definitions + cardinality relationships. Grown incrementally via `/grill-with-docs` sessions, not bulk-authored. [CONTEXT.md](CONTEXT.md) is a back-compat redirect stub pointing at the 3 zone files.
- **[docs/adr/](docs/adr/)** — Architectural Decision Records. One markdown file per non-obvious decision that is hard to reverse + surprising without context + the result of a real trade-off. Most are 1-3 sentences. Directory created lazily on first ADR.
- **[docs/grilling-queue.md](docs/grilling-queue.md)** — Standing list of concepts and framing questions for the next `/grill-with-docs` session. Append candidates between grills (during dog-food sessions, sprint reviews, anywhere substrate ambiguity surfaces); drain at each grill pass. Per [feedback_grilling_refresh_at_feature_ship](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_grilling_refresh_at_feature_ship.md), grilling fires at start/end of every feature ship. Distinct from `feedback_mcp_continuous_log.md` (friction-shaped, per-session) — grilling queue is concept-clarification-shaped, standing. **At every grilling-session CLOSE**, run the **claude.ai grilling review** (3-part: memory/instruction currency + cross-party claude.ai grill + context-window usage check, roasting-emphasized) per [feedback_claude_ai_grilling_review](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_claude_ai_grilling_review.md) — the claude.ai layer is the one surface Claude Code can't see/edit and drifts silently on substrate change. Per-session grill records live in `docs/sprints/grilling-<date>-*.md`; resolution history in [docs/grilling-queue.md](docs/grilling-queue.md) § Resolved.

Architecture & operating playbooks:
- **[SYNC_V2.md](SYNC_V2.md)** — MCP-based sync architecture (claude.ai ↔ app, bidirectional). Five locked decisions; transport, auth (bearer + OAuth 2.1), Resources, Tools, asymmetric write trust.
- **[ARBITER.md](ARBITER.md)** — Doc-proposal + canonical-queue arbiter playbook. Triggered by `process pending arbitration` in a Claude Code session.

Composable sub-skills (**Wave 4 PR 4b shipped 2026-05-21 — architecture implementation arc CLOSED**):
- **[docs/skills/](docs/skills/)** — 3-tier sub-skills architecture (Knowledge / Workflow / CCIL) + Master Coordinator router, per [ADR-0011](docs/adr/0011-composable-sub-skills-architecture.md) (amended 2026-05-27) / [ADR-0012](docs/adr/0012-master-coordinator-pattern.md) / [ADR-0013](docs/adr/0013-self-improvement-primitives.md) / [ADR-0017](docs/adr/0017-research-assistant-architecture.md). **17 sub-skills active** post Research Assistant Step 2 scaffolding (2026-05-27 — Research Coordinator + Research Assistant added; Learning Assistant + Learning Knowledge deprecated). Master Coordinator catalog at [docs/skills/coordinator/catalog.md](docs/skills/coordinator/catalog.md) is the primary lookup; dispatch rules at [docs/skills/coordinator/dispatch-rules.md](docs/skills/coordinator/dispatch-rules.md); handoff chains at [docs/skills/coordinator/handoff-rules.md](docs/skills/coordinator/handoff-rules.md). Cross-domain operator guide at [docs/skills/coordinator/operator-guide.md](docs/skills/coordinator/operator-guide.md) (canonical lookups + MCP server how-to + per-coffee threads + Session Debrief template). **Research Coordinator + Research Assistant ([docs/skills/research-coordinator/](docs/skills/research-coordinator/) + [docs/skills/research-assistant/](docs/skills/research-assistant/)) are operator-direct in Claude Code per ADR-0017** — not Master-Coordinator-dispatched, not MCP-registered. Entry surface is "operator types 'I want to start a research project' into a fresh Claude Code session." Full wave-by-wave ship log + per-sub-skill scope notes + the master-doc residual migration inventory live in [docs/architecture/sub-skills-status.md](docs/architecture/sub-skills-status.md) (extracted in Wave 4 PR 4b per scope decision 4 of PR 4a — drops CLAUDE.md back under the 120KB tripwire). The master-doc transition plan lives in [docs/architecture/master-doc-transition-plan.md](docs/architecture/master-doc-transition-plan.md).

Domain references in `docs/`:
- **[docs/taxonomies/](docs/taxonomies/)** — 11 canonical axes authored by Chris (regions / varieties / processes / roasters / producers / flavors / roast-levels remain here; brewers / filters / grinders / sworks migrated to [docs/skills/brewing-equipment-expert/cluster/](docs/skills/brewing-equipment-expert/cluster/) in Wave 1 per [ADR-0011](docs/adr/0011-composable-sub-skills-architecture.md), back-compat redirect stubs preserved at the original paths). Each authored .md is the source of truth; `lib/<axis>-registry.ts` is the validation mirror (2-step deliberate edit when adding a new entry).
- **[docs/brewing/](docs/brewing/)** — Roaster reference cards. WBC reference + 102-recipe corpus migrated to the WBC Brewing Archivist cluster in Wave 2 PR 1 (2026-05-26): [docs/skills/wbc-brewing-archivist/cluster/](docs/skills/wbc-brewing-archivist/cluster/). Back-compat redirect stubs preserved at the original paths.
- **[docs/roasting/](docs/roasting/)** — [archive.md](docs/roasting/archive.md) (closed-lot archive, per-lot Key Learnings). WBC roasting + sourcing docs migrated to the WBC Roasting Archivist cluster in Wave 2 PR 1 (2026-05-26): [docs/skills/wbc-roasting-archivist/cluster/wbc-roasting.md](docs/skills/wbc-roasting-archivist/cluster/wbc-roasting.md) (WBC-derived lessons + Roest L200 hypotheses + blending experiment protocols + structured rest-curve protocol) + [docs/skills/wbc-roasting-archivist/cluster/sourcing/strategy.md](docs/skills/wbc-roasting-archivist/cluster/sourcing/strategy.md) (sourcing strategy + Tier 1/2/3 priority targets + current Latent inventory mapped to portfolio lanes — refresh on inventory change). [dongzhe-livestream-2026-05.md](docs/roasting/dongzhe-livestream-2026-05.md) migrated to the [Peer-Learning Roasting Archivist cluster](docs/skills/peer-learning-roasting-archivist/cluster/per-peer/dongzhe.md) in Wave 3 PR 1 (2026-05-26). All migrated paths preserved as back-compat redirect stubs at the original paths.
- **[docs/prompts/](docs/prompts/)** — 10 operational prompts for claude.ai sessions. Roasting-side has two families: V-set lots use 4 lifecycle-mapped prompts (`start-lot.md` / `log-roast.md` / `log-cupping.md` / `close-lot.md`) running 1:1 against the 4-state lifecycle (In inventory → Waiting for next roast ⇄ Waiting for next cupping → Resolved); one-shot lots (`green_beans.is_one_shot=true`, single-batch samples ~100-120g, no iteration possible) use 2 prompts (`one-shot.md` covers STAGES 1-4 intake/design/roast/cupping, `one-shot-closeout.md` covers STAGE 5 close-out with constrained carry-forward writes). Brewing-side is `start-brew.md` / `bundled-brewing-completion.md` (canonical entry surfaces post Writing-path Sub-sprint 3 / 2026-05-26 — `log-brew.md` + `propose-doc-changes-from-brew.md` are back-compat redirect stubs pointing at `bundled-brewing-completion.md`, which covers the full push_brew + propose_doc_changes path in one shot).
- **[docs/features/](docs/features/)** — Per-sprint scoping/brainstorm docs (archive layer, not surfaced via MCP).
- **[docs/sprints/shipped.md](docs/sprints/shipped.md)** — Reverse-chronological shipped log.

Per-sprint retrospectives: `~/.claude/projects/-Users-chrismccann-latent-coffee/memory/project_*.md`.

**MCP server status:** 35 Tools live as of 2026-05-21 (Sprint 12 / CR-4 added `list_skeleton_entries`; prior 34-Tool baseline since Sub Pages 6.1 — `push_roast_recipe` + `patch_roast_recipe`). Auth: bearer-token (desktop MCP clients) + OAuth 2.1 + PKCE (claude.ai web). All 35 Tools, schema, and discovery surfaces documented in [SYNC_V2.md](SYNC_V2.md).

Claude Code development reference (read on demand — extracted from this file 2026-06-02 / root-doc compaction to keep CLAUDE.md every-session-lean):
- **[docs/architecture/page-ia.md](docs/architecture/page-ia.md)** — Per-surface page information-architecture (index + detail render shapes, section order, re-skin history) for all app surfaces. Grab when touching a page.
- **[docs/architecture/data-model.md](docs/architecture/data-model.md)** — Per-column schema histories (migration provenance + populate-side notes) + full relationship-pattern detail. Grab when touching a column or migration.
- **[docs/architecture/registries.md](docs/architecture/registries.md)** — Canonical-registry implementation rules (`lib/*-registry.ts` mirrors, alias maps, write-time enforcement) + the flavor-notes registry. Grab when touching a registry.
- **[docs/design-system.md](docs/design-system.md)** — Full design token map / palette / type scale / component-primitive reference + design conventions. Shared source of truth (PRODUCT.md § Design System points here too); the inline enforcement checklist stays in § Design / UX conventions below.

`PRODUCT.md` + the sub-skill clusters are **living documents**: Chris hand-edits them when the mental model shifts (new strategy, new page, new data source, new lot closed); Claude Code patches them via the V2 `propose_doc_changes` arbiter pipeline (post-Wave-4-PR-4b proposals target sub-skill cluster paths, not the master docs — see [ARBITER.md](ARBITER.md)). None auto-generated; they compound edit-by-edit. The Dropbox originals (BMR / Roasting Master Reference / Terroir-Cultivar Ruleset) remain archival snapshots; the repo copies compound going forward.

## Git Discipline

- **Approved or planned work** (sprint with kickoff brief, plan-mode plan approved, explicit "go for it"): commit + push + open PR + merge autonomously as one flow when ready; no second sign-off round. End the message with the merged-PR URL + main-branch commit SHA. Per Chris reinforced 4× across 2026-04 to 2026-05 (last 2026-05-24): "usually much cleaner when you just do it." Don't end shipped-implementation messages with "Ready for commit/review" framings — push the commit step back to Chris with no actual decision-signal wastes a round-trip. See [feedback_autonomy.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_autonomy.md) for the full rule + sub-rules (destructive-decision escalation, CI gating, repo merge-style detection).
- **Unscoped or ambiguous work**: ask first before committing.
- Before starting work, verify branch is up to date with main; many PRs may have landed since last thread touch
- When squash-merges happen, rebase/reset against the new main rather than the pre-merge state
- Never reset a branch without confirming via reflog that recoverable work is preserved

## Architecture

- **Framework:** Next.js 14 App Router, server components by default, client components only for interactivity (synthesis auto-generation)
- **Database:** Supabase Postgres with Row Level Security — all queries scoped to authenticated user
- **Auth:** Supabase cookie-based auth via `@supabase/ssr`
- **AI Synthesis:** Claude Sonnet 4.6 via `@anthropic-ai/sdk`. Per-entity directed pipeline: shared scaffolding in [lib/synthesis/](lib/synthesis/) (`buildPrompt.ts` + `runSynthesis.ts` orchestrator + vendored `humanizer-skill.md` polish pass + Sprint 13 `buildShortFormPrompt.ts` mobile digest) + 4 per-entity adapters in `lib/synthesis/adapters/{terroir,cultivar,process,roaster}.ts`. Each adapter contributes the registry anchor (TerroirEntry / CultivarEntry / composed-process structure / RoasterEntry's 29 CSV fields), a weighting tuple, the directed-question slots, and (Sprint 13 / SYN-6) an optional `formatRoastLearningRow` companion for cross-source corpus reads. **Paragraph + takeaway count + `max_tokens` budget are corpus-tier-aware** (Sprint T4, 2026-05-18) — `classifyTier(rowCount)` in buildPrompt.ts buckets the corpus into 4 tiers (early / emerging / established / mature) driving target shape: 2-3 paragraphs at N<3, up to 4-6 at N≥16. Sprint 13 extends tier classification to count the combined brews + roast_learnings rows. See [docs/reference/synthesis-pipeline.md § Corpus tier](docs/reference/synthesis-pipeline.md) for the locked thresholds. **Three LLM calls per synthesis** post Sprint 13 / [ADR-0010](docs/adr/0010-cross-source-synthesis-and-three-call-pipeline.md) (raw → humanizer pass to strip AI-tells → short-form digest for mobile rendering); humanizer's `USER_OVERRIDE` carries the canonical-vocabulary preservation list including extraction strategies, signature methods, fermentation qualifiers (Anoxic), roasting-side vocabulary (primary lever / brewing tolerance / underdevelopment signal / overdevelopment signal / aromatic behavior / structural behavior / rest behavior / scope tags), and a categorical clarifier for any cultivar / terroir / producer / farm / roaster proper noun. **Cross-source corpus** (Sprint 13 / SYN-6): terroir / cultivar / roaster adapters read both `brews` AND `roast_learnings` rows joined through `green_beans.{terroir_id,cultivar_id}` (Latent path on the roaster adapter pulls all roast_learnings); process adapter ships unchanged per ADR-0010 Q2. **Resynthesize trigger** (Sprint 13 / SYN-7): every cache surface carries `synthesis_input_max_updated_at` alongside `synthesis_brew_count`; SynthesisCard regenerates on either delta. **Mobile short-form** (Sprint 13 / SYN-3): every cache surface carries `short_form_capsule text`; SynthesisCard renders short-form below `md:` and long-form at `md:` and up, with long-form fallback when short-form is NULL. Polished long-form + short-form cached per-axis. New aggregation surface = one new adapter; do NOT inline a fifth per-entity prompt.
- **Deployment:** Vercel, preview deployments per branch

## Data Model

Per-column schema histories (migration provenance + populate-side notes) + full per-FK relationship detail live in **[docs/architecture/data-model.md](docs/architecture/data-model.md)** — read when touching a column or migration. The roster below is the every-session shape.

### Core entities (roster)
- **brews** — individual coffee tastings (purchased or self-roasted). Distinct `roaster` vs `producer` columns (don't conflate); self-roasted carry `roaster='Latent'`. jsonb: `flavors` / `modifiers` / `pours`; `structure_tags text[]`; 9 structured process columns.
- **terroirs** — geographic zones. Country → Admin Region → Macro Terroir (macro = canonical/aggregation level). Meso/micro are free-text annotations, not canonical.
- **cultivars** — varieties. Species → Genetic Family → Lineage → Cultivar (cultivar = canonical/aggregation level post Sub Pages 3).
- **green_beans** — raw self-roasted lots. Lifecycle state derived per row, not stored (5-state rules in [docs/architecture/page-ia.md § Green](docs/architecture/page-ia.md)). Has roasts / experiments / cuppings / roast_recipes.
- **roast_recipes** — per-batch design intent (one row per Roest profile pushed). Curves + design specs + predictions + drop rules + per-batch rationale. UPSERT on (user_id, experiment_id, batch_slot) or (user_id, green_bean_id, recipe_name).
- **roasts** — per-batch execution. Links recipe via `recipe_id`; RoR + inlet-curve + tp/yellowing columns populated server-side by `pull_roest_log`. `is_reference_candidate` (mid-flight) vs `is_reference` (final) vs `worth_repeating`; `fc_audibility` 4-enum.
- **cuppings** — per-tasting evals. `wb_agtron` snapshot + `wb_to_ground_delta` generated column; prose axes `sweetness` / `temperature_behavior` / `aromatic_behavior` / `structural_behavior`.
- **experiments** — V-set frames (41-field schema; 16 cross-batch fields drive the waiting-views).
- **roast_learnings** — lot-aggregate carry-forward. `best_roast_id` FK to the winning roast; 14 prose fields + 4 `*_scope_tags text[]` arrays. `why_this_roast_won` is the resolved-vs-unresolved discriminator.
- **taxonomy_overrides_queue** — canonical-promotion queue (mirror of `doc_proposals` for canonical entries).
- **Provenance columns** — `terroir_provenance` / `cultivar_provenance` (`canonical` | `auto_created`) on green_beans + brews; `green_beans.canonicals_updated_at`.

### Relationship patterns (IMPORTANT)
- **FK joins, not text matching:** brews→terroir (`terroir_id`) · brews→cultivar (`cultivar_id`) · brews→green_bean (`green_bean_id`) · green_beans→terroir/cultivar · roasts→roast_recipes (`recipe_id`) · roast_recipes→experiment (`experiment_id`) · roast_learnings→roast (`best_roast_id`).
- **New brews MUST set `terroir_id` and `cultivar_id` on insert** — `push_brew` handles both via `findOrCreateTerroir` + `findOrCreateCultivar` in [lib/brew-import.ts](lib/brew-import.ts).
- Full per-FK detail (backfill migrations, cardinality notes) in [docs/architecture/data-model.md](docs/architecture/data-model.md).

### Canonical registries
The canonical-registry system (10 taxonomy axes, `lib/*-registry.ts` validation mirrors, alias maps, write-time enforcement, the `makeCanonicalLookup` factory) is implementation reference — full rules in **[docs/architecture/registries.md](docs/architecture/registries.md)**. Glossary/cardinality cut: [docs/reference/canonical-registries.md](docs/reference/canonical-registries.md). The authored markdown in [docs/taxonomies/](docs/taxonomies/) is the source of truth; the registry `.ts` is the mirror (2-step deliberate edit to add an entry).

## Page structure

Per-surface information-architecture (index + detail render shapes, section order, re-skin history) lives in **[docs/architecture/page-ia.md](docs/architecture/page-ia.md)** — read the relevant § when touching that surface. The flavor-notes registry moved to [docs/architecture/registries.md](docs/architecture/registries.md).

### Terroirs
Per-page IA in [docs/architecture/page-ia.md § Terroirs](docs/architecture/page-ia.md). Read when touching `app/(app)/terroirs/`.
### Cultivars
Per-page IA in [docs/architecture/page-ia.md § Cultivars](docs/architecture/page-ia.md). Read when touching `app/(app)/cultivars/`.
### Processes
Per-page IA in [docs/architecture/page-ia.md § Processes](docs/architecture/page-ia.md). Read when touching `app/(app)/processes/`.
### Roasters
Per-page IA in [docs/architecture/page-ia.md § Roasters](docs/architecture/page-ia.md). Read when touching `app/(app)/roasters/`.
### Brews
Per-page IA in [docs/architecture/page-ia.md § Brews](docs/architecture/page-ia.md). Read when touching `app/(app)/brews/`.
### Header nav slot allocation (`components/Header.tsx`)
Per-component IA in [docs/architecture/page-ia.md § Header nav slot allocation](docs/architecture/page-ia.md).
### Flavor notes registry (`lib/flavor-registry.ts`)
Moved to [docs/architecture/registries.md § Flavor notes registry](docs/architecture/registries.md).
### Green
Per-page IA in [docs/architecture/page-ia.md § Green](docs/architecture/page-ia.md) (5 lifecycle view shapes + lifecycle-state derivation). Read when touching `app/(app)/green/`.

## Dev notes

- `ANTHROPIC_API_KEY` must be explicitly passed to `new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })` — auto-detection fails in Vercel serverless
- Country color swatches are hardcoded in terroir pages (12 countries mapped)
- Cultivar family colors are hardcoded in cultivar pages
- Migrations are in `supabase/migrations/` — run manually via Supabase SQL Editor
- The `@anthropic-ai/sdk` package doesn't resolve in the worktree dev server (missing node_modules) but works in Vercel builds
- **tsconfig has `strictNullChecks: true`** (under `strict: false`) — required so discriminated-union narrowing (`if (result.ok) return; result.code`) compiles under Next.js build. Do not turn it off without refactoring the `PersistResult` / `ValidationResult` / `TerroirMatch` / `CultivarMatch` usages in `lib/brew-import.ts` and the import/parse routes.
- **Always run `npm run build` before pushing** if you touched API routes or `lib/brew-import.ts`. Vercel will fail the deploy on TS errors, and the worktree can't run the full build because it's missing `@anthropic-ai/sdk`. Two options: (1) use the main repo dir `/Users/chrismccann/latent-coffee` for `npx tsc --noEmit` as a cheap proxy, or (2) `ln -sf ../../../node_modules node_modules` from the worktree to reuse the main repo's node_modules — then `npx tsc --noEmit` works in-place. Remove the symlink before committing (`rm node_modules`); it's gitignored but cleaner to not leave it around.
- **MCP tool-list cache visibility (Sprint 3.3 / #R90):** `npm run check:mcp` prints each registered toolʼs source-file mtime + a total count + `lib/mcp/server.ts` mtime so the count delta is visible after a registration edit. claude.aiʼs MCP client may cache its tool catalog; after shipping a new Tool, confirm the count moved and force a fresh claude.ai session (or explicit `tool_search(query: "<name>")` discovery) before assuming the Tool is live.

## Running locally

```bash
npm install
npm run dev
```

Requires `.env.local` with:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for local server-side reads + migrations check)
- `ANTHROPIC_API_KEY`

**Worktrees auto-pick up `.env.local`** (added Sprint 10, 2026-05-19): the `SessionStart` hook in [.claude/settings.json](.claude/settings.json) symlinks `/Users/chrismccann/latent-coffee/.env.local` into any `.claude/worktrees/*` working dir on session start when the source file exists. Single source of truth — rotate a key in the main repo's `.env.local` and every worktree picks it up next session. The hook is idempotent (no-op when symlink/file already exists; no-op when the main-repo source is missing — chicken-and-egg safe).

### Local Verification Fallbacks
If `.env.local` is missing `SUPABASE_SERVICE_ROLE_KEY` or local dev has Anthropic auth shadowing, fall back to: (1) MCP `execute_sql` for DB work, (2) Vercel preview for end-to-end UI verification. Do not block the sprint waiting for local config.

## Design / UX conventions

Full token map / palette / type scale / component-primitive reference + the design conventions live in **[docs/design-system.md](docs/design-system.md)** (shared source of truth — PRODUCT.md § Design System points there too). Read it when doing UI work. The code-level enforcement points wanted every UI session:

- **Tokens live in `tailwind.config.ts` + `app/globals.css`.** No arbitrary `text-[Npx]` / `p-[Npx]` for chrome — if a size isn't in the scale, add it to the theme (deliberately) or don't use it. `next dev` does NOT hot-reload `tailwind.config.ts` theme-extend changes — restart before verifying in `preview_*`.
- **Use primitives, don't reimplement** — `Ssp*` family ([components/Ssp.tsx](components/Ssp.tsx)) for all detail surfaces; `IndexList` family ([components/IndexList.tsx](components/IndexList.tsx)) + `BrewCard` for index pages; `CoffeesList` / `ConfidenceCard` / `TagLinkList` / `FlavorNotesByFamily` / `StrategyPill` shared. `SectionCard` + `Tag` were DELETED (Redesign Sprint 5) — don't reintroduce.
- **Confidence bars use ONE canonical rule app-wide** — `1=LOW · 2-4=MEDIUM · 5+=HIGH`. Import `confidenceFor` from [lib/confidence.ts](lib/confidence.ts); never re-inline the thresholds.
- **Semantic colors: one helper per signal** ([lib/brew-colors.ts](lib/brew-colors.ts) / [lib/extraction-strategy.ts](lib/extraction-strategy.ts) / [lib/process-registry.ts](lib/process-registry.ts) / [lib/flavor-registry.ts](lib/flavor-registry.ts) / etc.) — don't copy the constants into page files. **Hue-not-lightness**: a distinct signal gets a hue shift, not a lightness shift.
- **Responsive = CSS container queries, not `@media`.** Wrap a page in `.ssp-page`; two-point model **390 + 1024**. Per-surface mobile pattern (`order-*` single-tree where mobile is a *resequence*; `.s2-desktop`/`.s2-mobile` dual-subtree where mobile needs a different *composition*) + the one-shared-IA / mobile-as-forcing-function rule: see [ADR-0018](docs/adr/0018-per-surface-mobile-pattern.md).
- **Desktop-primary default**; named **workflow-companion surfaces** are mobile-primary (`/brews/[id]` recipe, `/green/[id]` cupping). Spot-check at 390 + 1024 via `preview_resize`.

## Sprint cadence (for Claude)

These rules bias toward caution. For trivial tasks, use judgment — but err on the side of pausing.
Run these seven checkpoints on every non-trivial sprint:

1. **Plan before coding when scope is interpretive — and err toward planning.** If the brief is a mockup, a redesign, or anything with "make it better" — enter plan mode (ExitPlanMode tool) and surface your interpretation *before* editing files. When proposing a non-obvious approach, present 2-3 options with tradeoffs and your recommendation, not a single silent pick. Skip plan mode only when the scope is *genuinely* concrete (specific file, specific line, specific fix); "simple" is where unexamined assumptions waste the most work.

2. **State success criteria before implementing.** Transform vague tasks into verifiable goals. "Add validation" → "These cases pass: X / Y / Z." "Fix the bug" → "This specific reproduction now succeeds." Strong criteria let me self-loop without constant clarification; weak criteria force back-and-forth. When writing a plan, no placeholders — no "TBD", "TODO", "implement later", "add appropriate error handling." Concrete content or the step doesn't ship.

3. **Preview every UI change.** Start the dev server (`preview_start`), take a screenshot after each change, and verify via `preview_eval` / `preview_screenshot` before committing. Don't rely on "it should work" — the mismatched Alo Village cover color would have been caught on the first screenshot.

4. **Cross-system audit before PR.** If this sprint changed substrate (a new strategy, Tool, column, count delta, registry entry, page, type, schema, prompt vocabulary, or anything that propagates beyond the file edited), trace the change through the **six-actor chain** before declaring done. Each substrate change should be traceable through every hop where it affects behavior; missing a hop is the bug pattern that has bitten this codebase repeatedly (PR #65 humanizer-skill bundle miss, PR #164 CONTEXT.md + docs/roasting/*.md bundle miss). Don't wait for Chris to prompt the consistency check. Audit at substrate-change time, not monthly cleanup time.

   The six actors:

   | # | Actor | Read direction | Write direction |
   |---|---|---|---|
   | 1 | Chris (human) | reads CONTEXT-{roasting,brewing,shared}.md / CLAUDE.md / PRODUCT.md / rendered app pages | authors source data via claude.ai sessions; writes to DB via MCP |
   | 2 | `docs/prompts/*.md` | claude.ai loads at session start | Claude Code edits |
   | 3 | claude.ai project instructions | reads `docs://...` Resources at runtime via MCP | Chris edits in claude.ai UI |
   | 4 | MCP server (`lib/mcp/*.ts` Tools + Resources + descriptions) | exposes Tool surface + Resource catalog to claude.ai | Claude Code edits |
   | 5 | Claude Code (CLAUDE.md + CONTEXT-{roasting,brewing,shared}.md + docs/) | reads at session start | Claude Code edits |
   | 6 | Latent app (schema + UI + registries) | renders to Chris via /pages | Claude Code edits schema + UI + `lib/*-registry.ts` |

   Two named change directions are real and both are subject to this audit. Naming them lets sprints reference the right pipeline cleanly:

   - **Substrate-to-substrate** = the existing `propose_doc_changes` arbiter pipeline. A workflow output (a brew session, a roast close-out) generates structured edits to a doc (a sub-skill cluster pattern doc / a roaster card / a per-lot learnings doc); the arbiter applies them. Closed loop. See [ARBITER.md](ARBITER.md). Post-Wave-4-PR-4b: targets sub-skill cluster paths, not BREWING.md / ROASTING.md.
   - **Practice-to-substrate** = cross-party `/grill-with-docs` audit (the **substrate-practice gap audit** pattern). Lived practice has diverged from documented substrate; the cross-party audit surfaces the gap; output becomes substrate updates (CONTEXT-{roasting,brewing,shared}.md entries / ADRs / sub-skill cluster pattern docs). See [docs/sprints/grilling-2026-05-17-roasting-cross-party-followups.md](docs/sprints/grilling-2026-05-17-roasting-cross-party-followups.md) for the precedent that named the pattern + [ARBITER.md § Substrate-practice gap audit](ARBITER.md#substrate-practice-gap-audit) for the mechanism.

   Trace template — use as a checklist when auditing a substrate change. Skip hops that genuinely don't apply, but be explicit about the skip:

   - Actor 6 (schema/UI): does the change land in `lib/types.ts` / migration / UI render path? **Build-kickoff migration gate:** if this work rests on a prior migration's column/FK, verify it's actually applied to PROD before building (a column-existence `SELECT`, or a public-table PostgREST `.select('<col>')` that errors `42703` if missing) - this manual check stays the belt-and-suspenders kickoff verification. `check:migrations` was **repaired 2026-06-02** and is now functional: it diffs `supabase/migrations/*.sql` against `public.applied_migrations` (the manual-apply receipt table, migration 076), with a daily CI cron as the catch-all for a migration merged but never pasted into the SQL Editor. **Convention: every migration `>= 076` MUST end with its self-register line** (`INSERT INTO public.applied_migrations (filename) VALUES ('NNN_name.sql') ON CONFLICT (filename) DO NOTHING;`) - the script statically lints for it. Migration 069 was spec'd against a phantom column for a full grill cycle because nobody checked at kickoff; the repaired gate + cron now catch that class of drift within a day.
   - Actor 4 (MCP): does the new field/value land in the Tool input schema + Tool description + matching Resource description?
   - Actor 5 (Claude Code): does CLAUDE.md / the right CONTEXT-{zone}.md / docs/ reflect the new vocabulary?
   - Actor 2 (prompts): do `docs/prompts/*.md` flows use the new field/vocabulary correctly?
   - Actor 3 (claude.ai): will claude.ai see the new Tool / Resource on its next session start (catalog refresh)?
   - Actor 1 (Chris): does the rendered UI / Resource read surface to Chris coherently?

   **MCP Resource bundle check (enforced via script):** if this sprint added a new `docs://` Resource to [lib/mcp/docs.ts](lib/mcp/docs.ts) `DOC_FILES`, run `npm run check:mcp-bundle` to verify the file path is covered by a glob in [next.config.js](next.config.js) `outputFileTracingIncludes['/api/mcp/**']`. Script exits non-zero with a per-miss report on mismatch. The recurring misses (PR #65 humanizer-skill, PR #164 CONTEXT.md, PR #164 docs/roasting/*.md) prove prose alone is insufficient — the script is the enforcement.

   **Roadmap currency:** if this sprint shipped from `PRODUCT.md § Active Sprints` / `Newly queued` / `Side Quests`, move the entry out of those sections AND add a new line to `docs/sprints/shipped.md` with date / sprint name (bold) / landmark, all in the same PR. The rule prevents drift between "what's queued" and "what's done" — closed-out sprints lingering in Active Sprints implies work that doesn't exist; a shipped item missing from shipped.md erases the audit trail.

5. **Run `/simplify` before review or commit.** Claude over-engineers — duplicate JSX across pages, inline IIFEs, copy-pasted inline styles. Let the simplify skill catch it before it becomes tech debt. Run once per sprint, after implementation is done but before the commit step. Especially important when a sprint touched 2+ files that now share a rendering pattern.

6. **Retro before docs.** Before updating PRODUCT.md / CLAUDE.md / memory files at the end of a sprint, explicitly pause and list: what we tried that didn't work, what surprised us, what we'd do differently next time. The doc updates then write themselves. Don't wait for Chris to ask — this is a standing part of every sprint.

7. **Produce a kickoff brief for the next sprint.** Before closing the session, write a paste-ready brief: goal (1-2 sentences), scope (in/out), files likely to touch, verification plan, open questions. The handoff context lets the next session start with full situational awareness instead of rediscovery.

   **Grilling vs executing distinction (when authoring the brief).** Briefs for grilling sessions (e.g. `/grill-with-docs` drains, Step N grill items on the [grilling queue](docs/grilling-queue.md), audit passes) must NOT reference the autonomy rule, pre-pick implementation details, or frame work as ship-without-grilling. The autonomy rule applies to planned-execution work where Chris has already audio-confirmed the substantive call. Grilling sessions are interpretive — Chris's audio is the load-bearing signal. Sample header: **"THIS IS A GRILLING SESSION. DO NOT EXECUTE. Interview Chris in long-form prose on every substrate-altering call. Default to 'ask, don't ship' — the autonomy rule does NOT apply to grilling sessions."** Failure mode (Sprint R Phase 4 Step 4 Group 3, 2026-05-24): a planned-execution-shaped kickoff brief for grilling work pushed 4 substantive calls into ship-without-sign-off; recovered via the [Ratification queue subsection](docs/grilling-queue.md) at the next grill. See [feedback_grilling_vs_executing_distinction.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_grilling_vs_executing_distinction.md) for the full rule + the recovery mechanism.

**Standing tripwires (not per-sprint, but always-on):**
- **120KB on any root-level living doc** — when crossed, plan a split sprint. Currently (measured post root-doc compaction, 2026-06-02): **CLAUDE.md ~38KB** (well under — per-page IA / data-model column histories / canonical-registry impl / design token map all extracted to `docs/architecture/page-ia.md` + `docs/architecture/data-model.md` + `docs/architecture/registries.md` + `docs/design-system.md`, pulled on demand); **PRODUCT.md ~114KB** (back under — § Design System extracted to the shared `docs/design-system.md`, but the Roadmap grows over time — watch); CONTEXT-roasting.md ~105KB (approaching, ~15KB headroom — watch); CONTEXT-brewing.md ~60KB, CONTEXT-shared.md ~47KB, CONTEXT.md ~7KB redirect; BREWING.md ~3KB + ROASTING.md ~6KB redirect stubs. PRODUCT.md's `## Scaling Watch-Items` section enumerates the broader set.
- **Tool count crosses 50** — consider Tool consolidation (merging related `push_*` into polymorphic) or namespace grouping. Currently 35 Tools.
- **MEMORY.md index size** — already at warning. Run `consolidate-memory` skill quarterly, not just when warned.
