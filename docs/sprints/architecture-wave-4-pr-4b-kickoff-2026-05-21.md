# Wave 4 PR 4b — Master-doc residual migration + redirect stubs + CLAUDE.md compaction + cleanup pass (architecture arc closing PR)

**Status:** Kickoff brief authored 2026-05-21 (post-PR-4a). Ready to launch in the next session.

**Predecessor:** [Wave 4 PR 4a shipped 2026-05-21](https://github.com/chrismccann-dev/latent-coffee/pull/210) (merge `2b70b32`) — CCIL skeleton + Sudan Rume seed pattern + Chain 6 activation. See [retro](../../~/.claude/projects/-Users-chrismccann-latent-coffee/memory/project_architecture_wave_4_pr_4a_2026-05-21.md).

## Goal

Close the architecture implementation arc. Per [ADR-0011](../adr/0011-composable-sub-skills-architecture.md) / [ADR-0012](../adr/0012-master-coordinator-pattern.md) / [ADR-0013](../adr/0013-self-improvement-primitives.md) and `docs/architecture/master-doc-transition-plan.md` § Wave 4:

1. **Rewrite BREWING.md + ROASTING.md as ~500-byte redirect stubs** enumerating where each former section now lives. End-state per the transition plan: a navigable pointer block routes every former anchor to its new cluster home.
2. **Migrate residual operational content** from both master docs to appropriate sub-skill clusters or `coordinator/catalog.md § domain-principles`.
3. **Fold in the Naturals + Honey + 3 ambiguous ROASTING.md sections cleanup pass** per Wave 3 PR 1 Chris-lock (deferred to Wave 4 in scope decision 3 of PR 4a).
4. **Compact the CLAUDE.md sub-skills section** via extraction to a new `docs/architecture/sub-skills-status.md` doc per scope decision 4 of PR 4a. Drops CLAUDE.md back under the 120KB tripwire.

## Residual content to migrate (substrate inventory from PR 4a pre-flight)

### BREWING.md (124,399 bytes; ~120KB to migrate)

**Currently pointer-block stubs (already migrated in prior waves):**
- # Cross-Coffee Insight Layer → Brewing Historian cluster (Wave 2 PR 2)
- # SECTION 2 - ROASTER REFERENCE → docs/brewing/roasters.md (Sprint 2.4)
- # SECTION 4 - WBC REFERENCE → wbc-brewing-archivist cluster (Wave 2 PR 1)

**Residual substantial content (PR 4b migrates):**
- SECTION 1 - BREW PROMPT (Steps 1-4 + Coffee Brief + Recipe Output + Iteration Loop + Resolved Brew Output Format): ~575 lines. **Target destination:** `docs/prompts/start-brew.md` + `docs/prompts/log-brew.md` already exist as the canonical operational entry surface (1075 + 1075 bytes today — they're thin pointer prompts; the substantive operational guidance is duplicated in BREWING.md). The PR 4b move: either (a) consolidate the operational guidance into the prompts and delete from BREWING.md, OR (b) move to a new `docs/skills/brewing-assistant/cluster/operational-guide.md` that the prompts compose over via `read_doc`. Default: (b) — matches the sub-skill-as-canonical-source pattern from PR 4a; prompts stay as thin entry-surface invocations.
- The Two-Axis Framework (Axis 1 Extraction Strategy + Axis 2 Modifiers + Strategy + Modifier Notation): ~lines 85-150. **Target:** `coordinator/catalog.md § brewing-domain-principles` is the right home per transition plan; current entry is 1-2KB. PR 4b expands it to ~5-8KB to absorb the Two-Axis framing.
- Location Constraints (Office + Home equipment) + Equipment Reference + Valve Position Reference (SWORKS) + Filter System + Example Outputs: ~lines 65-572. **Target:** `docs/skills/brewing-equipment-expert/cluster/` already holds the per-brewer / per-filter / per-grinder / per-sworks docs. PR 4b authors a new `cluster/location-constraints.md` or `cluster/operational-reference.md` that absorbs Location + Valve Position + Example Outputs as one consolidated operational reference.
- Brewer rotation discipline: ~lines 150-155. **Target:** Brewing Equipment Expert cluster has the canonical lookup; the rotation discipline framing is a 1-paragraph addition.
- Process / Variety Signal Table: ~lines 408-426. **Target:** Brewing Historian's `cluster/patterns/cross-coffee-insights.md` already has By Process + By Variety sections; signal-table is a structured-table addition.

**Expected BREWING.md shrink: 124KB → ~500 bytes (redirect stub).**

### ROASTING.md (72,610 bytes; ~70KB to migrate)

**Currently pointer-block stubs (already migrated in prior waves):**
- # Cross-Coffee Insight Layer → Roasting Historian cluster (Wave 2 PR 3)
- # Open Questions → Roasting Historian cluster (Wave 2 PR 3)
- # Equipment + Evaluation Protocol + Standard Inlet Curve Template + Fan Strategy + Key Counterflow Observations + FC Marking Protocol → Roest Knowledge cluster (Wave 3 PR 1)
- # Reference Roast Target + Peer Insights → Peer-Learning Roasting Archivist cluster (Wave 3 PR 1)
- # Roast-to-Brew Translation → Roasting Historian cluster (Wave 3 PR 1; override of prior lock)
- # Archive → docs/roasting/archive.md (pre-Wave 1)

**Residual substantial content (PR 4b migrates):**
- Schema model + Canonical taxonomy lookups + Working with the Latent MCP server: ~lines 9-50. **Target:** `coordinator/catalog.md § roasting-domain-principles` for the principles; canonical taxonomy + MCP server how-to is shared across both brewing + roasting, target a new `docs/skills/coordinator/operator-guide.md`.
- How to Use This Document + Roasting Philosophy + What Good Looks Like For Each Coffee + What I Am Not Trying To Do: ~lines 53-232 (the 3 ambiguous sections from Wave 3 PR 1 Chris-lock). **Target:** `coordinator/catalog.md § roasting-domain-principles` expands to absorb. **Per scope decision 3 of PR 4a, this is the resolution destination.**
- Standard Workflow (Between Batch Protocol + Hopper Pre-Load Timing): ~lines 93-127. **Target:** Roest Knowledge cluster — `cluster/protocols/between-batch-protocol.md` (new) + extend `cluster/machine/l200-ultra.md` § Hopper pre-load.
- **Naturals - Roasting Framework** + **Honey Process - Roast Direction Fork**: ~lines 146-177 (the 2 Chris-locked sections). **Target per scope decision 3 of PR 4a:** `docs/skills/roasting-historian/cluster/by-process/natural.md` (new — Naturals framework) + `docs/skills/roasting-historian/cluster/by-process/honey.md` (new — Honey direction fork). Today's `by-process/washed.md` is the precedent stub; Natural + Honey become the second and third process docs.
- Data Capture Per Step + Per-Coffee Threads: ~lines 178-208. **Target:** `coordinator/catalog.md § roasting-domain-principles` (data capture as part of operating principles) OR `docs/skills/coordinator/operator-guide.md`.
- New Coffee Onboarding Protocol (Steps 1-4) + Naming Conventions + Parallel Experiment Considerations: ~lines 234-313. **Target:** `docs/prompts/start-lot.md` already covers Steps 1-4 as the canonical operational entry surface (13,480 bytes). PR 4b consolidates the ROASTING.md prose into the prompt OR into Roasting Assistant cluster.
- Lot Knowledge (Active Lots + One-Shot Calibrations + Closed Lots): ~lines 314-460. **Target:** This is the per-lot reference inventory. Active Lots → `docs/skills/roasting-historian/cluster/active-lots/<lot>.md` (new directory; mirrors the per-lot `cluster/learnings/<lot>.md` precedent for closed lots). One-Shot Calibrations → `docs/skills/roasting-historian/cluster/one-shot-calibrations/<lot>.md` (new directory). Closed Lots → already migrated to `cluster/learnings/<lot>.md` in Wave 2 PR 3; ROASTING.md retains pointers to them.
- Green Bean Storage Protocol: ~lines 472-481. **Target:** Roest Knowledge cluster — `cluster/protocols/green-storage.md` (new).
- Session Debrief Template (After Day 7 Pourover + After Optimized Brew Session): ~lines 488-555. **Target:** Roast Recorder + Cupping Specialist + Close-Lot Specialist sub-skills already cover their respective hops. PR 4b moves the Debrief Template prose into a shared `docs/skills/coordinator/operator-guide.md § session-debrief` OR distributes per sub-skill.

**Expected ROASTING.md shrink: 72KB → ~500 bytes (redirect stub).**

## Scope (in)

- BREWING.md → ~500-byte redirect stub
- ROASTING.md → ~500-byte redirect stub
- Substantial residual content migration per the inventory above. **Use bash surgery (head + cat pointer + tail bottom-up) per Wave 2 PR 3 + Wave 3 PR 1 precedent for big-block deletions.**
- Naturals + Honey + 3 ambiguous ROASTING.md sections cleanup pass (per PR 4a scope decision 3)
- CLAUDE.md sub-skills section compaction via extraction to new `docs/architecture/sub-skills-status.md` doc (per PR 4a scope decision 4)
- MCP Resource registration for any new cluster files authored (BREWING.md/ROASTING.md will get redirect stub descriptions; new cluster files need SKILL_FILES + DOC_DESCRIPTIONS + listDocs entries)
- ARBITER.md update if any new propose_doc_changes target_doc paths needed (`skills/roasting-historian/cluster/by-process/natural.md` etc.)
- Self-ref cleanup in BREWING.md + ROASTING.md before redirect-stub rewrite (find every `BREWING.md` / `ROASTING.md` reference across docs/ and update to point at the new home)
- Update `coordinator/catalog.md § brewing-domain-principles` + `§ roasting-domain-principles` to absorb the framing prose

## Scope (out)

- No new MCP Tools (Tool count stays at 35)
- No DB schema changes
- No prompt deprecation (deferred per Wave 3 PR 2/3 scope decision until sub-skills exercised in lived practice ≥3 times)
- No new CCIL seed patterns (PR 4a's Sudan Rume is the only one this wave; future patterns accrue via Pattern A refresh events)
- No Learning Knowledge promotion (deferred per ADR-0011 trigger of ≥2 completed research tracks)
- No POD-1 follow-up sprint (gated on 4 trigger conditions per `docs/skills/cupping-specialist/cluster/pod-1-routing.md`)

## Open scope decisions to surface at session start

Per `feedback_recommend_prior_lock_as_default.md`, pre-flight grep for prior locks BEFORE drafting AskUserQuestion. Especially in: `docs/architecture/master-doc-transition-plan.md` § Wave 4 + the CCIL placeholder + Wave 3 PR 1 retro for the cleanup-pass framing + Brewing/Roasting Historian SKILL.md files for any locked migration destinations.

1. **BREW PROMPT operational content destination.** Options: (a) consolidate into `docs/prompts/start-brew.md` + `log-brew.md` (which are thin pointer prompts today); (b) move to a new `docs/skills/brewing-assistant/cluster/operational-guide.md` that prompts compose over via `read_doc`; (c) split — Steps 1-4 + Coffee Brief to prompts, Recipe Output + Iteration Loop + Resolved Brew Output Format to Brewing Assistant cluster. Brief default: (b) — matches the sub-skill-as-canonical-source pattern from PR 4a; prompts stay as thin entry-surface invocations.

2. **Lot Knowledge migration shape.** Options: (a) per-lot directories under `docs/skills/roasting-historian/cluster/{active-lots,one-shot-calibrations}/`; (b) flatten into single `cluster/lots/<status>/<lot>.md` files; (c) keep in ROASTING.md as the one section that doesn't migrate (treat lot inventory as ROASTING.md's last canonical content). Brief default: (a) — mirrors the per-lot `cluster/learnings/<lot>.md` precedent for closed lots; active vs. one-shot vs. closed are 3 lifecycle dimensions worth keeping separated.

3. **Session Debrief Template distribution.** Options: (a) consolidated single `docs/skills/coordinator/operator-guide.md § session-debrief` doc; (b) distributed per sub-skill (the After Day 7 Pourover bullet goes to Cupping Specialist's cluster; After Optimized Brew Session bullet goes to Brew Recorder's cluster); (c) keep in `docs/prompts/log-cupping.md` + `bundled-brewing-completion.md` since they're the operational entry surfaces. Brief default: (c) — already lives in the prompts; the ROASTING.md text duplicates the prompt content.

4. **PR commit strategy.** Options: (a) single large PR with all migrations + redirect stubs + CLAUDE.md compaction in one commit; (b) split into 2-3 commits within the PR (one per master doc + one for CLAUDE.md); (c) split into 2-3 separate PRs (PR 4b-1 BREWING.md, PR 4b-2 ROASTING.md, PR 4b-3 CLAUDE.md compaction). Brief default: (a) — Wave 4 PR 4b is conceptually one architectural-arc-closing event; the file count is large but the change is coherent. If session-blow-out risk surfaces, fall back to (b) within-PR commits or (c) split-PR.

## Carry-forwards from PR 4a retro (gotchas to avoid)

- **Pre-flight READ of file content + size is mandatory.** PR 4a surfaced that the kickoff brief's "M — likely 1 session" sizing was unrealistic because the brief didn't pre-flight BREWING.md + ROASTING.md residual content. PR 4b's pre-flight should: (1) wc -c the residual files, (2) section-header grep both, (3) inspect the existing back-compat pointer blocks to understand what's already migrated. Same discipline should hold for the cluster docs that PR 4b authors.
- **Pre-flight grep is still load-bearing.** Pattern: `grep -rn "BREWING.md\|ROASTING.md" --include="*.md" --include="*.ts" docs/ lib/ app/ 2>/dev/null | grep -v node_modules`. Every self-ref needs updating before the redirect-stub rewrite. Wave 3 PR 1 found 3 ROASTING.md self-refs; PR 4b should find more across the now-stable cluster ecosystem.
- **Bash surgery pattern is the right tool for big-block deletions.** Use `head -n <start>` + `cat <pointer-block>` + `tail -n +<end+1>` per Wave 2 PR 3 + Wave 3 PR 1 precedent. Build pointer blocks in `/tmp/<file>-pointers.md` first, then splice. Process bottom-up to preserve line numbers across deletions.
- **listDocs sibling-cluster sanity check at commit time.** PR 4b will add several new cluster files (Natural + Honey by-process docs + new directories under roasting-historian/cluster/active-lots/ + one-shot-calibrations/ + possibly brewing-assistant/cluster/operational-guide.md). Run `awk '/^export function listDocs/,/^export function listTaxonomyAxes/' lib/mcp/docs.ts | grep -c "entry("` before commit; expect count to grow from 100 to ~110-120.
- **`<when_to_verify>` — pure-doc + MCP Resource registration sprint; not browser-observable.** Skip preview verification. Same pattern as Wave 3 PR 1-3 + Wave 4 PR 4a retros.
- **Master-doc shrink discipline.** Every deleted line from BREWING.md / ROASTING.md must land somewhere in the new cluster docs OR the redirect stub OR coordinator/catalog.md § domain-principles. Use `git diff` review of the master-doc shrinks to confirm.
- **Self-refs in BREWING.md / ROASTING.md.** Both files reference each other + the prompts + the cluster docs. Grep before redirect-stub rewrite; update or remove each reference.

## Pre-flight commands at kickoff

```bash
# 1. Branch state — sync with main since PR 4a merged
git fetch origin && git log --oneline origin/main -5

# 2. Read the master-doc transition plan § Wave 4 carefully
cat docs/architecture/master-doc-transition-plan.md

# 3. Wc -c both master docs to confirm residual sizes match this brief
wc -c BREWING.md ROASTING.md

# 4. Section-header grep both
grep -n "^#\|^##\|^###" BREWING.md
grep -n "^#\|^##\|^###" ROASTING.md

# 5. Self-ref grep — every BREWING.md / ROASTING.md reference that needs updating
grep -rn "BREWING.md\|ROASTING.md" --include="*.md" --include="*.ts" --include="*.tsx" docs/ lib/ app/ 2>/dev/null | grep -v node_modules

# 6. Read coordinator catalog § domain principles current state
sed -n '/Brewing domain principles/,/## Sub-skill catalog/p' docs/skills/coordinator/catalog.md

# 7. Read the existing back-compat pointer blocks in both master docs
awk '/^# Cross-Coffee Insight Layer/,/^# SECTION 4/' BREWING.md
awk '/^# Roast-to-Brew Translation/,EOF' ROASTING.md

# 8. Read the Wave 4 PR 4a retro
cat ~/.claude/projects/-Users-chrismccann-latent-coffee/memory/project_architecture_wave_4_pr_4a_2026-05-21.md

# 9. listDocs baseline (should be 100 post-PR-4a)
awk '/^export function listDocs/,/^export function listTaxonomyAxes/' lib/mcp/docs.ts | grep -c "entry("

# 10. Verify baseline checks pass before any edits
npm run check:mcp-bundle && npx -y -p tsx@4 tsx scripts/check-registry-md-sync.ts

# 11. CLAUDE.md size (will be at 125,750 bytes; PR 4b extraction targets <120,000)
wc -c CLAUDE.md
```

## Verification plan

- `npm run check:mcp-bundle` clean (new cluster paths covered by existing `./docs/skills/**/*.md` glob — Wave 1 work, no change needed; new `docs/architecture/sub-skills-status.md` path: verify it's covered by the existing `./docs/**/*.md` glob OR add a new glob in next.config.js)
- `npx -y -p tsx@4 tsx scripts/check-registry-md-sync.ts` 20 axes in sync (no registry changes expected)
- `npx tsc --noEmit` exit 0 via worktree node_modules symlink
- Skip preview per `<when_to_verify>` — pure-doc + MCP Resource registration
- Master-doc shrink verification: `wc -c BREWING.md ROASTING.md` shows both at ~500 bytes
- CLAUDE.md size verification: `wc -c CLAUDE.md` shows < 120,000 bytes (drops back under tripwire)
- `git diff` review of master-doc shrinks confirms every deleted line lands somewhere in the new cluster docs OR redirect stub OR coordinator/catalog.md

## Cross-system audit (6-actor) checklist

- Actor 6 (substrate): all new cluster files exist; master-doc shrinks land; new `docs/architecture/sub-skills-status.md` exists
- Actor 4 (MCP): new cluster paths registered in `lib/mcp/docs.ts` (SKILL_FILES + DOC_DESCRIPTIONS + listDocs); BREWING.md + ROASTING.md descriptions updated to redirect-stub language; ARBITER.md target_doc allow-list extended via `isKnownDoc()` if new cluster URIs added
- Actor 5 (Claude Code): CLAUDE.md sub-skills section compacted + extracted to docs/architecture/sub-skills-status.md; PRODUCT.md § Active Sprints "Wave 4 PR 4b shipped — architecture implementation arc closed"; docs/sprints/shipped.md row added
- Actor 2 (prompts): every `docs/prompts/*.md` reference to BREWING.md / ROASTING.md updated to point at the new home (cluster URI or coordinator/catalog.md anchor)
- Actor 3 (claude.ai): catalog refresh on next session start picks up redirect-stub descriptions + new cluster files
- Actor 1 (Chris): rendered behavior unchanged or improved — all former anchors resolve via redirect stubs; new cluster files findable via Master Coordinator catalog

## Roadmap currency at PR close

- Move PRODUCT.md § Active Sprints Wave 4 PR 4b entry to "Wave 4 PR 4b shipped 2026-05-21; **architecture implementation arc closed**"
- Section #4 Roadmap re-session promotes from PRODUCT.md Section #3 (was queued behind architecture implementation work) to **active** — architecture work now complete; Sprint R's 4-phase sequence (audit → brainstorm → implementation → re-session) reaches its final phase
- Promote candidates from PRODUCT.md § Queued post-architecture for re-prioritization: Sprints 3.3-3.7 + deferred candidates (CR-7-promote + CR-9 / WBC-4-large + DF-OPS1 + DF-OPS2 + BR-6); brewing-side `/add?type=purchased` deprecation per `feedback_mcp_only_input.md`; prompt subsumption sprint if sub-skills exercised in lived practice ≥3 times by then; Learning Knowledge promotion if ≥2 research tracks have completed; POD-1 follow-up if the 4 trigger conditions are met
- Add `docs/sprints/shipped.md` row for PR 4b
- Update CLAUDE.md sub-skills section header to mark Wave 4 closed + architecture implementation arc complete (extraction to sub-skills-status.md handles the body)
- Update `MEMORY.md` index with PR 4b retro pointer

## After Wave 4 PR 4b closes

**Architecture implementation arc complete.** Sprint R's 4-phase Option 1 sequence reaches its final phase: roadmap re-session. The deferred + queued items re-prioritize against the new architectural baseline.

## Sizing

**M-to-L** — likely 1 session at M (if the brief defaults all hold and Bash surgery cleanly executes), risk of L (if scope decisions surface unexpected complexity in the BREW PROMPT migration destination or the Lot Knowledge inventory shape). Larger than PR 4a (which was M); comparable to Wave 2 PR 2 (Brewing Historian extraction, ~88KB shrink) + Wave 2 PR 3 (Roasting Historian extraction, ~43KB shrink) **combined**. Cumulative master-doc shrink target: ~196KB (BREWING 124KB + ROASTING 72KB).

**Branch suggestion:** the worktree harness will assign one. Default merge style: squash + delete branch per `feedback_autonomy`.
