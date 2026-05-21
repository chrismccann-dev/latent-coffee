# Architecture Wave 2 implementation kickoff — Historians + WBC Archivists (4 consolidation ships)

**Date:** 2026-05-26
**Predecessor:** Wave 1 ([architecture-wave-1-kickoff-2026-05-26.md](architecture-wave-1-kickoff-2026-05-26.md) → shipped via [PR #202](https://github.com/chrismccann-dev/latent-coffee/pull/202), merge commit `5e29683`, retro at [project_architecture_wave_1_2026-05-26.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/project_architecture_wave_1_2026-05-26.md))
**Successor:** Wave 3 (operator-stub clusters + 9 Workflow tier sub-skills; POD-1 absorbs into Cupping Specialist here)
**Sizing:** L (biggest BREWING.md / ROASTING.md shrink event in the architecture arc; ~60-80KB each per [master-doc-transition-plan.md](../architecture/master-doc-transition-plan.md))
**Branch (suggested):** `claude/architecture-wave-2-2026-05-XX`
**Mode:** Implementation — second ship of the composable sub-skills architecture per [ADR-0011](../adr/0011-composable-sub-skills-architecture.md) / [ADR-0012](../adr/0012-master-coordinator-pattern.md) / [ADR-0013](../adr/0013-self-improvement-primitives.md).

## Goal

Fill in the 4 Knowledge-tier sub-skill placeholders that landed at brainstorm time + migrate the load-bearing content out of BREWING.md / ROASTING.md / `docs/brewing/wbc-*.md` / `docs/roasting/wbc-*.md` into per-sub-skill clusters. This is **the biggest substrate-shrink event of the entire architecture arc** — BREWING.md goes 213KB → ~130-150KB, ROASTING.md goes 147KB → ~70-90KB.

## Why 4 ships, paired or sequenced

Per [ADR-0011](../adr/0011-composable-sub-skills-architecture.md) Wave 2 = 4 consolidation sub-skills:

1. **Brewing Historian** — absorbs BREWING.md "Cross-Coffee Insight Layer" + per-strategy patterns
2. **Roasting Historian** — absorbs ROASTING.md equivalent + per-bean experiment patterns + lot knowledge
3. **WBC Brewing Archivist** — migrates `docs/brewing/wbc-reference.md` + `docs/brewing/wbc-recipes.md` (5-axis foundational map + 8 strategy families + 102-recipe corpus)
4. **WBC Roasting Archivist** — migrates `docs/roasting/wbc-roasting.md` + `docs/roasting/wbc-sourcing.md` (tentatively merged Sourcing Knowledge per [ADR-0011](../adr/0011-composable-sub-skills-architecture.md))

**Recommended sequencing (3 PRs):**

- **PR 1 — WBC Archivists pair** (mechanical file moves): WBC Brewing + WBC Roasting Archivist together. `docs/brewing/wbc-*.md` and `docs/roasting/wbc-*.md` already exist as separate files; this PR is structurally a Wave 1 repeat (git mv → cluster/ + redirect stubs + path-depth updates + MCP registration + cross-system propagation). Estimated 1 implementation session.
- **PR 2 — Brewing Historian** (substantive content extraction): pull "Cross-Coffee Insight Layer" + per-strategy pattern docs out of BREWING.md into `cluster/patterns/`. BREWING.md shrinks ~60-80KB. Estimated 1-2 sessions because the extraction is interpretive (sections aren't cleanly bounded; need judgment on what stays in BREWING.md residual prose vs. moves to cluster).
- **PR 3 — Roasting Historian** (substantive content extraction): parallel work on ROASTING.md. Same shape and similar scope. Estimated 1-2 sessions.

Alternative: **single PR for all 4**. Defensible but risks reviewer fatigue + the Brewing/Roasting Historian extractions are interpretive enough that landing them with the mechanical Archivist moves muddies what's being decided.

**Locked decision at kickoff:** sequence into 3 PRs as above. Chris can override at session-start if preferred.

## Scope (in) — per sub-skill

### Brewing Historian

- **Status:** placeholder SKILL.md exists ([docs/skills/brewing-historian/SKILL.md](../skills/brewing-historian/SKILL.md)) — fill in full content during this Wave's session
- **Cluster authoring:**
  - `cluster/patterns/cross-coffee-insights.md` — absorbs BREWING.md "Cross-Coffee Insight Layer" section verbatim
  - `cluster/patterns/by-strategy/<strategy>.md` — 6 files (Suppression / Clarity-First / Balanced Intensity / Full Expression / Extraction Push / Hybrid) extracted from BREWING.md's per-strategy reference
  - `cluster/patterns/by-cultivar/<cultivar>.md` — initially seeded from observed clusters in `brews` table (likely Gesha / Sudan Rume / others with N≥3)
  - `cluster/patterns/by-coffee-family/<family>.md` — initially seeded from observed processing-family clusters (Anaerobic Washed / Yeast-inoculated Honey / etc.)
- **BREWING.md shrink:** delete the Cross-Coffee Insight Layer section + the per-strategy pattern blocks + any other prose that lifts cleanly. Replace with section-level pointers to the new cluster locations.

### Roasting Historian

- **Status:** placeholder SKILL.md exists ([docs/skills/roasting-historian/SKILL.md](../skills/roasting-historian/SKILL.md)) — fill in full content
- **Cluster authoring:**
  - `cluster/patterns/cross-coffee-insights.md` — absorbs ROASTING.md equivalent section
  - `cluster/learnings/<lot>.md` — 6 initial per-lot deep-dive learnings (CGLE Sudan Rume Hybrid Washed / CGLE Mandela XO / GV Surma / GV Oma / GUA Libertad / GUA El Socorro) sourced from `roast_learnings` rows + ROASTING.md per-bean experiment sections
  - `cluster/patterns/by-cultivar/<cultivar>.md` — scoped via `scope_tags`-driven aggregation
  - `cluster/patterns/by-process/<process>.md` — scoped via `scope_tags`-driven aggregation
  - `cluster/patterns/by-density-moisture/<bucket>.md` — green-physics-first patterns per Dongzhe-livestream framing
  - `cluster/patterns/general.md` — patterns that don't scope to a single axis
- **ROASTING.md shrink:** delete the cross-coffee section + per-bean experiment patterns + lot-specific learnings now living in `cluster/learnings/`. Counterflow methodology + Roest L200 specifics stay in ROASTING.md through Wave 3 (Roest Knowledge cluster gets them then).

### WBC Brewing Archivist

- **Status:** placeholder SKILL.md exists ([docs/skills/wbc-brewing-archivist/SKILL.md](../skills/wbc-brewing-archivist/SKILL.md)) — fill in full content
- **Cluster authoring:**
  - `cluster/wbc-reference.md` — `git mv` from `docs/brewing/wbc-reference.md` (verbatim move + path-depth tweaks for any relative links)
  - `cluster/wbc-recipes.md` — `git mv` from `docs/brewing/wbc-recipes.md` (102-recipe corpus, ~moderate size)
  - `cluster/per-strategy/<strategy>.md` — 6 files synthesizing WBC competitor recipes within each Latent strategy (deferred from Wave 1; can be seeded with N=1-2 examples each from the 102-recipe corpus)
  - `cluster/canonical/wbc-tested-recipes.md` — underlying canonical sub-resource per the "knowledge cluster sub-resources" pattern Chris flagged in brainstorm Round 2

### WBC Roasting Archivist

- **Status:** placeholder SKILL.md exists ([docs/skills/wbc-roasting-archivist/SKILL.md](../skills/wbc-roasting-archivist/SKILL.md)) — fill in full content
- **Cluster authoring:**
  - `cluster/wbc-roasting.md` — `git mv` from `docs/roasting/wbc-roasting.md`
  - `cluster/sourcing/strategy.md` — `git mv` from `docs/roasting/wbc-sourcing.md` (tentative merge with WBC Roasting per ADR-0011; split when Chris does dedicated sourcing research)
  - `cluster/sourcing/portfolio-lanes.md` — extracted from `wbc-sourcing.md` (5-lane portfolio definitions + inventory mapping)
  - `cluster/sourcing/priority-targets.md` — extracted from `wbc-sourcing.md` (Tier 1/2/3 priority targets)
  - `cluster/per-competitor/<year>-<competitor>.md` — per-competitor extracts (initial seeding; can be sparse, grow as Chris researches)

### Redirect stubs

- `docs/brewing/wbc-reference.md` → ~200-byte redirect pointing to `docs/skills/wbc-brewing-archivist/cluster/wbc-reference.md` (matches Wave 1 stub shape)
- `docs/brewing/wbc-recipes.md` → same shape
- `docs/roasting/wbc-roasting.md` → same shape (→ wbc-roasting-archivist cluster)
- `docs/roasting/wbc-sourcing.md` → same shape

### MCP Resource registration (`lib/mcp/docs.ts`)

Adds entries for every new cluster file + every `SKILL.md` that flips from placeholder to authored. Count estimate: 4 SKILL.md + 4 mechanical-move cluster docs + ~6 Brewing Historian cluster docs + ~10 Roasting Historian cluster docs + ~4 WBC Brewing per-strategy + ~4 WBC Roasting sourcing/per-competitor docs = **~28-32 new DOC_FILES entries** + matching DOC_DESCRIPTIONS + listDocs entries. `next.config.js` glob already covers `./docs/skills/**/*.md` (Wave 1 work); no new glob needed.

Old `docs://brewing/wbc-{reference,recipes}.md` + `docs://roasting/wbc-{roasting,sourcing}.md` URIs continue resolving to redirect stubs for back-compat (same pattern as Wave 1's `docs://taxonomies/{4 axes}.md`).

### Cross-system propagation (per CLAUDE.md sprint cadence #4)

**Master docs (the substrate-shrink event itself):**
- BREWING.md — delete migrated sections, replace with section-level pointers, target: 213KB → ~130-150KB
- ROASTING.md — delete migrated sections, replace with section-level pointers, target: 147KB → ~70-90KB

**Living docs:**
- CLAUDE.md — Documentation Index sections update to reference new cluster paths; "Composable sub-skills" section adds Wave 2 sub-skills + status
- PRODUCT.md — § Active Sprints Wave 2 → shipped (renumber Wave 3/4/Roadmap re-session as #1/2/3); table rows reflect new locations
- CONTEXT.md — any glossary entries pointing at the moved sections update path references
- ARBITER.md — **update arbiter routing** to direct new `propose_doc_changes` proposals to the appropriate sub-skill cluster (per master-doc-transition-plan.md § Risk: BREWING.md / ROASTING.md keep growing during migration). This is a Wave 2 must-do; without it the arbiter pipeline keeps appending to BREWING.md / ROASTING.md and undoes the shrink.

**Prompts:**
- `bundled-brewing-completion.md` — STEP 2 propose_doc_changes section updates `target_doc` discipline. Today's `"brewing.md"` target should route via the Brewing Historian cluster (e.g. `"skills/brewing-historian/cluster/patterns/cross-coffee-insights.md"`); existing alias shapes need extension
- `propose-doc-changes-from-brew.md` — same `target_doc` updates
- `close-lot.md` STAGE 3 — references Roasting Historian as the carry-forward home (per [docs/skills/roasting-historian/SKILL.md](../skills/roasting-historian/SKILL.md) line 47)
- `start-lot.md` STAGE 2 carry-forward search — references WBC Roasting Archivist as a knowledge cluster (per [docs/skills/wbc-roasting-archivist/SKILL.md](../skills/wbc-roasting-archivist/SKILL.md) line 49)
- `start-brew.md` Step 1 — reference WBC Brewing Archivist for WBC-anchor lookups
- `bundled-brewing-completion.md` — same WBC reference update

**Sync-check script:** [`scripts/check-registry-md-sync.ts`](../../scripts/check-registry-md-sync.ts) — no change (only the 4 brewing-equipment axes were tracked; Historians + WBC don't have validation-mirror counterparts in `lib/`)

**Pre-execution `grep -rn` is mandatory** per Wave 1 retro lesson — the brief here can't enumerate every reference site exhaustively; grep against the moved file paths at session start surfaces the rest. Wave 1 found 5 additional sites the brief missed (registry comments / script mdPath / ARBITER table / PRODUCT.md links / CONTEXT.md line). Expect a similar surface for Wave 2 given the master-doc surface area is larger.

## Scope (out)

- No DB schema changes (Wave 2 is pure file authoring + content migration)
- No new MCP Tools (Tool count stays at 35)
- No code-backed dispatch helper in `lib/agents/` (Wave 3+ if needed)
- No Workflow tier sub-skill content (Wave 3 — POD-1 inside Cupping Specialist)
- No CCIL content authoring (Wave 4 — once Historians have content to synthesize across)
- ROASTING.md residual content (counterflow methodology + Roest L200 specifics) stays through Wave 3 when Roest Knowledge cluster ships
- BREWING.md residual content (Two-Axis Framework intro + Coffee Brief Step 1d framing) stays through Wave 4 redirect-stub transition

## Files likely to touch

| Category | Files | Notes |
|---|---|---|
| New cluster files | ~25-30 across the 4 sub-skills | See per-sub-skill enumeration above |
| Updated SKILL.md | 4 (brewing-historian / roasting-historian / wbc-brewing-archivist / wbc-roasting-archivist) | Flip "PLACEHOLDER" → "Wave 2 shipped" |
| Migrated source files | 4 (`docs/brewing/wbc-{reference,recipes}.md` + `docs/roasting/wbc-{roasting,sourcing}.md`) | `git mv` to cluster/ |
| Redirect stubs | 4 (at original `docs/brewing/wbc-*.md` + `docs/roasting/wbc-*.md` paths) | ~200 bytes each, Wave 1 stub shape |
| Master doc shrinks | BREWING.md + ROASTING.md | The substantive content extraction; sections deleted with pointers added |
| MCP registration | `lib/mcp/docs.ts` | +~28-32 DOC_FILES + DOC_DESCRIPTIONS + listDocs entries |
| Living-doc propagation | CLAUDE.md / PRODUCT.md / CONTEXT.md / ARBITER.md | Per cross-system audit |
| Prompt updates | 5-6 prompts (`bundled-brewing-completion.md` / `propose-doc-changes-from-brew.md` / `close-lot.md` / `start-lot.md` / `start-brew.md` / `bundled-brewing-completion.md`) | target_doc + cluster reference updates |
| Roadmap currency | PRODUCT.md § Active Sprints + `docs/sprints/shipped.md` | Wave 2 → shipped + per-PR rows |

**Estimated total per-PR scope:** PR 1 (WBC Archivists pair) ~20-25 files. PR 2 (Brewing Historian) ~15-20 files. PR 3 (Roasting Historian) ~15-20 files. Sum ~50-65 files across the wave.

## Verification plan

### Per-PR (each of the 3)

- `npm run check:mcp-bundle` clean (new cluster paths covered by existing `./docs/skills/**/*.md` glob; total path/glob counts stay sane)
- `npx tsx scripts/check-registry-md-sync.ts` all 20 axes in sync (no registry changes)
- `npx tsc --noEmit` zero errors via worktree node_modules symlink (CLAUDE.md build-hygiene rule)
- BREWING.md / ROASTING.md size deltas land roughly within the master-doc-transition-plan.md estimates (PR 2 shrinks BREWING.md ~60-80KB; PR 3 shrinks ROASTING.md ~60-80KB; PR 1 is pure file moves with negligible master-doc impact)
- Vercel preview deploy validates the static-file bundling picks up the new doc paths

### Wave-level (post all 3 PRs)

End-to-end MCP test in claude.ai:
1. Open a brewing session
2. Verify `docs://skills/coordinator/catalog.md` fetches on session start; verify catalog now lists Brewing Historian + WBC Brewing Archivist as available knowledge clusters
3. Type intent like "What have I learned across my Suppression brews?" — verify response uses content from `docs/skills/brewing-historian/cluster/patterns/by-strategy/suppression.md`
4. Type WBC-related intent — verify response uses content from `docs/skills/wbc-brewing-archivist/cluster/`
5. Repeat for roasting side (start-lot or close-lot session)

### Cross-system audit (6-actor matrix, per PR)

| Actor | Check |
|---|---|
| 6 (substrate) | BREWING.md / ROASTING.md `git diff` confirms every deleted line lands somewhere in the new cluster docs (per master-doc-transition-plan.md § Risk: content loss) |
| 4 (MCP) | New Resources registered + described in `lib/mcp/docs.ts`; `check:mcp-bundle` passes |
| 5 (Claude Code) | CLAUDE.md Documentation Index + living-doc sections updated; CONTEXT.md cross-refs intact |
| 2 (prompts) | All 5-6 prompts updated with new `target_doc` alias shapes + cluster pointers |
| 3 (claude.ai) | Catalog refresh on next session start picks up new Resources |
| 1 (operator) | Brewing + roasting sessions get richer per-cluster knowledge surfaces |

### Roadmap currency (per Sprint R rule)

- PRODUCT.md § Active Sprints moves Wave 2 to closed (after final PR merges); Wave 3 promotes to #1
- `docs/sprints/shipped.md` adds 1 row per PR (or 1 combined row if Chris prefers a single Wave 2 shipped row referencing all 3 PRs)

## Open questions

1. **PR sequencing: 3 PRs or 1 single Wave 2 PR?** Recommendation: **3 PRs (WBC Archivists pair → Brewing Historian → Roasting Historian)** for reviewer cleanliness + faster individual gate cycles. Override at session start if a single PR feels cleaner — both shapes are defensible.

2. **Per-strategy + per-cultivar pattern docs in Brewing Historian — author from scratch or seed from BREWING.md extracts?** Recommendation: **seed from BREWING.md extracts** where the existing prose has per-strategy structure; author from scratch only where BREWING.md is unstructured prose. Don't over-author at Wave 2 ship time — placeholder cluster files with "Patterns to populate as corpus grows" stubs are acceptable when N<3 brews scope the cluster's intended axis.

3. **Roasting Historian per-lot deep-dive learnings — full prose extraction or pointers to `roast_learnings` rows?** Recommendation: **pointers + brief synthesis prose** (not full extraction). The DB rows are substrate; the cluster doc adds the cross-lot pattern framing and a one-line synthesis per lot. Full lot-narrative duplication would bloat the cluster and create two-home drift.

4. **Sourcing Knowledge split: keep tentatively-merged with WBC Roasting Archivist this wave, or split now?** Recommendation: **keep merged this wave** per ADR-0011's tentative-merge decision. Split when Chris does dedicated sourcing research (sourcing book on his TODO list). Future-trigger: dedicated `cluster/sourcing/` subdir grows beyond ~3-5 docs OR sourcing research session produces content that doesn't fit alongside WBC strategy patterns.

5. **ARBITER.md update timing — Wave 2 PR 1 or a separate ride-along?** Recommendation: **bundle into Wave 2 PR 1 (WBC Archivists pair)** so the routing change lands before PR 2/3 generate new propose_doc_changes proposals against the wrong destinations. Without this, the arbiter risk in master-doc-transition-plan.md § Risk surfaces immediately.

6. **`docs/brewing/roasters.md` (BMR roaster cards) — does it migrate now or stay where it is?** Recommendation: **stay where it is**. It's not under a Historian or Archivist scope; it's per-roaster brewing lessons. Future Wave 3 sub-skill (possibly Brewing Assistant or a new "Roaster Knowledge" cluster) may absorb it.

## Pre-flight commands at kickoff

```bash
# 1. Branch state — sync with main since Wave 1 just landed
git fetch origin && git log --oneline origin/main -5

# 2. Verify the 4 Wave 2 SKILL.md placeholders exist (from brainstorm cluster PR #201)
ls docs/skills/{brewing-historian,roasting-historian,wbc-brewing-archivist,wbc-roasting-archivist}/SKILL.md

# 3. Read the 4 placeholder SKILL.md files for current scope framing
cat docs/skills/{brewing-historian,roasting-historian,wbc-brewing-archivist,wbc-roasting-archivist}/SKILL.md

# 4. Read the 3 ADRs + master-doc transition plan
ls docs/adr/0011* docs/adr/0012* docs/adr/0013* docs/architecture/master-doc-transition-plan.md

# 5. Current size of master docs + WBC sources (drives PR-2 / PR-3 sizing estimate)
wc -c BREWING.md ROASTING.md docs/brewing/wbc-{reference,recipes}.md docs/roasting/wbc-{roasting,sourcing}.md

# 6. Pre-execution grep for ALL reference sites of the WBC source files (Wave 1 retro lesson)
grep -rn "docs/brewing/wbc-\(reference\|recipes\)\.md\|docs/roasting/wbc-\(roasting\|sourcing\)\.md" --include="*.md" --include="*.ts" --include="*.tsx" --include="*.js" .

# 7. Verify Wave 1 baseline checks pass
npm run check:mcp-bundle
npx -y -p tsx@4 tsx scripts/check-registry-md-sync.ts
```

## Coordination notes

- **Master-doc compaction is the load-bearing outcome.** If BREWING.md / ROASTING.md don't shrink by ~60-80KB each, Wave 2 hasn't met its goal — the placeholder SKILL.md files being filled in is necessary but not sufficient. Per master-doc-transition-plan.md § Risk: BREWING.md / ROASTING.md keep growing during migration, the ARBITER.md routing update is what prevents the master docs from re-bloating during the wave itself.
- **Pre-execution `grep -rn` against every moved file path is mandatory** (Wave 1 retro lesson). The brief here can't enumerate every reference site exhaustively; grep at session start surfaces the rest.
- **Trust but verify the SKILL.md scope** — the brainstorm cluster authored them as placeholders. Some scope framings may need adjustment once Chris starts authoring real content. Treat the SKILL.md content as 80% locked, 20% open for adjustment during this wave.
- **POD-1 stays absorbed into Cupping Specialist Wave 3.** Not in Wave 2 scope.

## After Wave 2 closes

Next sprint = **Wave 3** (Operator-stub clusters + 9 Workflow tier sub-skills with POD-1 absorbed into Cupping Specialist). Wave 3 is structurally heavier than Wave 2 — code-backed handoff chains start mattering, the 5 substrate-writer sub-skills (Roast Recorder / Brew Recorder / Cupping Specialist / Roest API Worker / Close-Lot Specialist) potentially want `lib/agents/` helpers, and the operator-stub-then-integrate pattern lands for the first time (Peer-Learning Roasting Archivist + Roest Knowledge clusters seeded by Chris).
