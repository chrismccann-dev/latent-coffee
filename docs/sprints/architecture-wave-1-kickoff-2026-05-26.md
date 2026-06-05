# Architecture Wave 1 implementation kickoff — Master Coordinator + Brewing Equipment Expert paired ship

**Date:** 2026-05-26
**Predecessor:** Architecture brainstorm cluster ([architecture-rethink-cluster-kickoff-2026-05-25.md](docs/sprints/architecture-rethink-cluster-kickoff-2026-05-25.md) → shipped via [project-architecture-brainstorm-2026-05-26](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/project_architecture_brainstorm_2026-05-26.md))
**Successor:** Architecture Wave 2 (4 consolidation ships — Historians + WBC Archivists)
**Sizing:** M (1 implementation sprint; markdown + cluster migration, no DB schema change)
**Branch:** suggest `claude/architecture-wave-1-2026-05-XX`
**Mode:** Implementation — first ship of the composable sub-skills architecture per [ADR-0011](docs/adr/0011-composable-sub-skills-architecture.md), [ADR-0012](docs/adr/0012-master-coordinator-pattern.md), [ADR-0013](docs/adr/0013-self-improvement-primitives.md).

## Goal

Ship the **Master Coordinator catalog** (markdown-only, MCP-endpoint-exposed) **+ Brewing Equipment Expert cluster** (consolidating 8 existing files) as the paired proof-of-pattern first ship. Single PR proves: catalog mechanics + lazy-loading + MCP wire-up + first sub-skill content + cross-system audit gates simultaneously.

Why paired (per ADR-0012): Master Coordinator with an empty catalog isn't testable; Brewing Equipment Expert without a catalog has no architectural home. Ship together so end-to-end dispatch can be validated in claude.ai immediately.

## Scope (in)

### Master Coordinator (4 files exist as stubs; Wave 1 fills with full content)

- [`docs/skills/coordinator/SKILL.md`](docs/skills/coordinator/SKILL.md) — already authored in brainstorm PR; no Wave 1 changes
- [`docs/skills/coordinator/catalog.md`](docs/skills/coordinator/catalog.md) — already authored as Wave 1 starter; verify brewing/roasting domain principles sections match BREWING.md / ROASTING.md top-section content (extract + paste)
- [`docs/skills/coordinator/dispatch-rules.md`](docs/skills/coordinator/dispatch-rules.md) — already authored; verify Wave 1 entries (Brewing Equipment Expert) are accurate
- [`docs/skills/coordinator/handoff-rules.md`](docs/skills/coordinator/handoff-rules.md) — already authored; Wave 1 status is "no cross-domain chains active yet"

### Brewing Equipment Expert cluster (Wave 1 migration of 8 existing files)

- [`docs/skills/brewing-equipment-expert/SKILL.md`](docs/skills/brewing-equipment-expert/SKILL.md) — already authored in brainstorm PR; no Wave 1 changes
- `docs/skills/brewing-equipment-expert/cluster/brewers.md` — **NEW** (migrate from `docs/taxonomies/brewers.md`)
- `docs/skills/brewing-equipment-expert/cluster/filters.md` — **NEW** (migrate from `docs/taxonomies/filters.md`)
- `docs/skills/brewing-equipment-expert/cluster/grinder-eg1.md` — **NEW** (migrate from `docs/taxonomies/grinders.md`)
- `docs/skills/brewing-equipment-expert/cluster/sworks.md` — **NEW** (migrate from `docs/taxonomies/sworks.md`)
- `docs/skills/brewing-equipment-expert/resources/` — pointer/symlink references to existing `lib/{brewer,filter,grinder,sworks}-registry.ts` files (registries stay as `.ts` code, not migrated)

### Redirect stubs at original taxonomy locations

- `docs/taxonomies/brewers.md` → ~200-byte redirect: "Content migrated to `docs/skills/brewing-equipment-expert/cluster/brewers.md` per [ADR-0011](docs/adr/0011-composable-sub-skills-architecture.md)."
- `docs/taxonomies/filters.md` → same shape
- `docs/taxonomies/grinders.md` → same shape
- `docs/taxonomies/sworks.md` → same shape

### MCP Resource registration

- [`lib/mcp/docs.ts`](lib/mcp/docs.ts) `DOC_FILES` array adds 8 new Resource entries:
  - `docs://skills/coordinator/SKILL.md`
  - `docs://skills/coordinator/catalog.md`
  - `docs://skills/coordinator/dispatch-rules.md`
  - `docs://skills/coordinator/handoff-rules.md`
  - `docs://skills/brewing-equipment-expert/SKILL.md`
  - `docs://skills/brewing-equipment-expert/cluster/brewers.md`
  - `docs://skills/brewing-equipment-expert/cluster/filters.md`
  - `docs://skills/brewing-equipment-expert/cluster/grinder-eg1.md`
  - `docs://skills/brewing-equipment-expert/cluster/sworks.md`
- [`next.config.js`](next.config.js) `outputFileTracingIncludes['/api/mcp/**']` adds glob coverage for `docs/skills/**/*.md`

### CLAUDE.md updates

- Add new docs/skills/ architecture section near the top of CLAUDE.md (after `## Documentation Index`)
- Update existing `Brewer + Filter names` / `Grinder taxonomy` / `SWORKS valve flow taxonomy` sections to reference new cluster locations (keep `lib/*-registry.ts` references; only update doc path pointers)
- Brewing Equipment Expert sub-skill entry in the new docs index

### `docs/prompts/*.md` updates (minimal in Wave 1)

- `start-brew.md`: add session-start fetch of `docs://coordinator/catalog.md` (operator pastes the prompt → claude.ai fetches catalog at session start)
- `bundled-brewing-completion.md`: same — session-start catalog fetch
- Wave 1's footprint here is small; later prompts get bigger updates as more sub-skills ship

## Scope (out)

- No DB schema changes
- No content migration from BREWING.md / ROASTING.md (Wave 2)
- No other sub-skill clusters authored (Wave 2+)
- No code-backed dispatch (markdown-only per ADR-0012; Wave 2+ if needed)
- No `lib/agents/` directory creation (Wave 2+ if needed)
- No `.claude/skills/` entries added (sub-skills aren't slash commands per ADR-0012)

## Files likely to touch

| File | Action | Notes |
|---|---|---|
| `docs/skills/coordinator/*.md` (4 files) | Verify / refine (already exist as Wave-1 starters) | Brainstorm PR shipped these as starters |
| `docs/skills/brewing-equipment-expert/cluster/*.md` (4 files) | **Create new** | Migrate from `docs/taxonomies/{brewers,filters,grinders,sworks}.md` |
| `docs/skills/brewing-equipment-expert/resources/` | **Create new directory** | Pointer/symlink to existing `lib/*-registry.ts` |
| `docs/taxonomies/{brewers,filters,grinders,sworks}.md` | **Rewrite as redirect stubs** | ~200 bytes each |
| `lib/mcp/docs.ts` | Add 8 `DOC_FILES` entries | Each entry needs file path + description + canonical URI |
| `next.config.js` | Update `outputFileTracingIncludes` glob | Cover `docs/skills/**/*.md` |
| `CLAUDE.md` | Update docs-index section | Add new architecture pointers; update Brewer/Filter/Grinder/SWORKS section pointers |
| `docs/prompts/start-brew.md` | Update | Add session-start fetch of coordinator catalog |
| `docs/prompts/bundled-brewing-completion.md` | Update | Same |
| `PRODUCT.md` | Update roadmap | Move Wave-1 ship from "queued" to "shipped" (post-merge); add Wave 2 entry |
| `docs/sprints/shipped.md` | Add row | Date + sprint name + landmark per Sprint R roadmap currency rule |

**Estimated PR scope:** ~25-30 files touched. Mix of new files (cluster docs), updates (taxonomy redirect stubs, MCP registration, CLAUDE.md, prompts), and roadmap currency edits.

## Verification plan

### Build + tests

- `npm run check:mcp-bundle` passes — every new `docs://` Resource path is covered by `outputFileTracingIncludes`
- `npx tsc --noEmit` passes — no type errors from any TypeScript referencing the registry files (brewer-registry.ts etc.) which DON'T move
- `npm run build` succeeds — Vercel build validates the static-file bundling picks up new doc paths

### End-to-end MCP test (the test loop Chris named in Round 3)

1. Open a claude.ai roasting OR brewing project session
2. Verify session-start fetches `docs://coordinator/catalog.md` (catalog should appear in fetched Resources list)
3. Type intent that should dispatch to Brewing Equipment Expert: "What are the EG-1 grinder setting quirks?"
4. Verify claude.ai's response uses content from `docs/skills/brewing-equipment-expert/cluster/grinder-eg1.md` (e.g. mentions dial 6.6 contamination)
5. Confirm the dispatch happens via natural-language reasoning over `dispatch-rules.md` (no code path needed)

### Cross-system audit (6-actor matrix)

| Actor | Check |
|---|---|
| 6 (substrate) | Files moved, not deleted; `git diff` confirms content lands in new locations |
| 4 (MCP) | New Resources registered; `check:mcp-bundle` passes |
| 5 (Claude Code / CLAUDE.md) | CLAUDE.md docs-index updated; new architecture section added |
| 2 (prompts) | `start-brew.md` + `bundled-brewing-completion.md` updated with catalog fetch |
| 3 (claude.ai) | Catalog fetches at session start; dispatch reasoning works |
| 1 (operator) | Brewing sessions surface equipment knowledge as before; flow unchanged in feel |

### Roadmap currency (per Sprint R rule)

- PRODUCT.md updated to move Wave 1 from "queued / next" to "shipped" (post-merge); Wave 2 entry added
- `docs/sprints/shipped.md` adds a row with date + sprint name + landmark

## Open questions

1. **Does the existing `docs/taxonomies/{brewers,filters,grinders,sworks}.md` content fit cleanly under `docs/skills/brewing-equipment-expert/cluster/<axis>.md`, or does it need restructuring?** The existing taxonomies are authoritative authored content (CLAUDE.md § Canonical registries pattern); moving them shouldn't change their content, just their path.
2. **Should the cluster docs be authored from scratch with reference to existing taxonomies, OR moved verbatim?** Recommendation: **move verbatim** to minimize Wave-1 risk; refinement comes in Wave-2 + as Pattern A signals accumulate.
3. **Should `lib/{brewer,filter,grinder,sworks}-registry.ts` be moved, symlinked, or just referenced?** Recommendation: **stay in `lib/`**; they're code (validation mirrors), not docs. Cluster references them via doc pointers (e.g. `resources/brewer-registry.ts.md` is a markdown pointer that links to `../../../lib/brewer-registry.ts`).
4. **`start-brew.md` + `bundled-brewing-completion.md` catalog fetch:** what's the minimal prompt change? Recommendation: prepend a 2-line instruction at session start: "Fetch `docs://coordinator/catalog.md` to identify available knowledge clusters. For brewing equipment knowledge, dispatch to Brewing Equipment Expert (cluster path: `docs://skills/brewing-equipment-expert/cluster/`)."

## Pre-flight commands at kickoff

```bash
# 1. Branch state
git fetch origin && git log --oneline origin/main -5

# 2. Confirm brainstorm PR shipped + retro exists
ls ~/.claude/projects/-Users-chrismccann-latent-coffee/memory/project_architecture_brainstorm_*.md

# 3. Verify Wave-1 starter files exist (from brainstorm PR)
ls -la docs/skills/coordinator/ docs/skills/brewing-equipment-expert/

# 4. Read the 3 ADRs
ls docs/adr/0011* docs/adr/0012* docs/adr/0013*

# 5. Check current size of files that will migrate
wc -c docs/taxonomies/{brewers,filters,grinders,sworks}.md

# 6. Verify check:mcp-bundle baseline passes
npm run check:mcp-bundle
```

## Coordination notes

- **Wave 1 implementation does NOT touch BREWING.md / ROASTING.md content** — only domain principles sections of the catalog get extracted from their tops. The big BREWING.md / ROASTING.md shrink happens in Wave 2 (per [master-doc-transition-plan.md](docs/architecture/master-doc-transition-plan.md)).
- **The Surface 1 follow-up sprint (Immersion modifier + 2 audit-prep typos)** is still parked. Not in Wave 1 scope.
- **POD-1 stays in scope as absorbed into Cupping Specialist (Wave 3)**; PRODUCT.md update reflects this.

## After Wave 1 closes

Next sprint = Wave 2 (4 consolidation ships paired or sequenced):
1. Brewing Historian (absorbs BREWING.md Cross-Coffee Insight Layer section)
2. Roasting Historian (absorbs ROASTING.md equivalent section)
3. WBC Brewing Archivist (migrates `docs/brewing/wbc-reference.md` + `docs/brewing/wbc-recipes.md`)
4. WBC Roasting Archivist (migrates `docs/roasting/wbc-roasting.md` + `docs/roasting/wbc-sourcing.md` — tentatively merged Sourcing per ADR-0011)

Wave 2 is the biggest shrink event for BREWING.md + ROASTING.md (~60-80KB each).
