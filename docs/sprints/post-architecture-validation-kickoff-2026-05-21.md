# Sprint R Phase 4 — Post-architecture validation cluster

**Status:** Kickoff brief authored 2026-05-21 (post-Wave-4-PR-4b). Ready to launch in the next session.

**Predecessors:** Architecture implementation arc CLOSED 2026-05-21 with [Wave 4 PR 4b](https://github.com/chrismccann-dev/latent-coffee/pull/213) (merge `1c0692216`). 9 PRs across 4 waves; ~358KB cumulative master-doc shrink. Sprint R Phase 4 promotes from queued → ACTIVE per [PRODUCT.md § Roadmap entry #4](../../PRODUCT.md).

## Goal

Validate that the new sub-skills architecture works as designed *before* re-prioritizing the queued post-architecture roadmap. The architecture work was Claude-Code-driven; validation requires the operator surfaces (prompts + claude.ai project context + lived practice) to be re-aligned with the new substrate, then exercised, then grilled.

## 5-step sequence

Two sessions:

**Session 1: Validation cluster (Steps 0-4)**

- **Step 0 (Chris-driven, opens session):** Confirm which prompt surfaces are canonical. The 10 prompts in `docs/prompts/` represent the operational entry surface today; Chris uses some subset routinely and some rarely. Audit scope should match lived practice — no point hand-tightening a prompt that hasn't fired in 6 months. Chris reconfirms the active set at session start.
- **Step 1 (Claude Code):** Prompt audit. For each in-scope prompt: grep for stale `BREWING.md` / `ROASTING.md` / migrated-section refs; update to cluster URIs; validate the prompt's cluster-fetch path lands on the right sub-skill; check for operational drift since prompt's last edit; flag any prompt that needs Chris-side rewriting (vs Claude-Code-side mechanical refresh).
- **Step 2 (Chris-driven):** claude.ai surface refresh. Chris updates the brewing project + roasting project instructions + memory in the claude.ai UI to reflect the new substrate (cluster fetch targets, redirect-stub awareness, operator-guide pointer). Per [feedback_claude_ai_memory_merge_only.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_claude_ai_memory_merge_only.md), bulk additions compress to pointers — "Forget X. Remember Y." lands cleanest. The substrate-fetched-live discipline means memory drift is functionally inert once session-start fetch targets are correct.
- **Step 3 (Chris-driven):** Dog-food cycle. 1 brewing session + 1 roasting session against the new architecture. Capture friction inline in [feedback_mcp_continuous_log.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_mcp_continuous_log.md). Watch for: cluster-fetch failures, missing pointer paths, drift between sub-skill SKILL.md framing and lived workflow.
- **Step 4 (Cross-party — Claude Code + Chris):** `/grill-with-docs` session on new concepts. CCIL + Sudan Rume seed pattern, master-doc redirect stubs, coordinator/operator-guide.md, brewing-assistant operational-guide.md, brewing-equipment-expert operational-reference.md, roasting-assistant onboarding-protocol.md, by-process/{natural,honey}.md, active-lots/ directory structure. Outputs: CONTEXT.md entries for any new terminology + substrate-practice gap log for follow-up.

**Session 2 (separate): Roadmap re-session (Step 5)**

- **Step 5 (Claude Code + Chris):** Re-prioritize PRODUCT.md § Queued post-architecture (Sprints 3.3-3.7 + deferred candidates) against the validated architectural baseline. Likely subsumed: Sprint 3.6 BREWING/ROASTING doc reconciliation (both are redirect stubs now). Likely reshaped: Sprint 3.7 Prompt v5 rewrites (sub-skills are now the canonical fetch target). Still standalone: Sprint 3.3 auto-supersede friction (architecture-independent).

## Step 0 — Confirm canonical prompt surfaces

At session start, surface this question to Chris before any file edits:

> **Which of the 10 prompts in `docs/prompts/` are in routine lived use?**
>
> Brewing side:
> - `start-brew.md` (1KB; thin pointer; Phase 1 brew session intake)
> - `log-brew.md` (1KB; thin pointer; Phase 2 finalization)
> - `bundled-brewing-completion.md` (4KB; Phase 3 handoff + propose_doc_changes)
> - `propose-doc-changes-from-brew.md` (3KB; standalone doc-proposal flow)
>
> Roasting side (V-set lifecycle):
> - `start-lot.md` (13KB; In inventory → Waiting for next roast)
> - `log-roast.md` (17KB; Waiting for next roast → Waiting for next cupping)
> - `log-cupping.md` (35KB; Waiting for next cupping → next loop or close-out)
> - `close-lot.md` (22KB; Resolved-pending → Resolved)
>
> Roasting side (one-shot lifecycle):
> - `one-shot.md` (22KB; STAGES 1-4 for one-shot calibration lots)
> - `one-shot-closeout.md` (16KB; STAGE 5 close-out, constrained)
>
> Mark each as: **(a)** routine use this month, **(b)** seen-this-quarter, **(c)** rarely / never used. The audit prioritizes (a) first, (b) second; (c) gets a light pass.

Default if Chris doesn't override: audit all 10 in priority order (a) > (b) > (c) based on his recollection.

## Step 1 — Prompt audit (Claude Code)

For each in-scope prompt:

1. **Grep for stale refs:** `BREWING.md`, `ROASTING.md`, `docs/brewing/wbc-*.md`, `docs/roasting/wbc-*.md`, `docs/roasting/dongzhe-livestream-2026-05.md`, `docs/taxonomies/{brewers,filters,grinders,sworks}.md` — all of these have migrated to sub-skill clusters. Update to cluster URIs.
2. **Validate cluster fetch paths:** does the prompt fetch the right sub-skill at the right step? E.g. `log-cupping.md` should reach Cupping Specialist; `close-lot.md` should reach Close-Lot Specialist; `start-brew.md` (already updated in PR 4b) reaches Brewing Assistant + Brewing Equipment Expert + WBC Brewing Archivist.
3. **Check for operational drift:** prompts last edited before the architecture work may reference workflow patterns that have since refined (POD-1 absorption, fermentation_qualifiers Anoxic cue, scope_tags, is_reference_candidate flag, fc_audibility enum).
4. **Classify each prompt** as Claude-Code-mechanical-refresh (stale-refs only) vs Chris-side-rewrite-needed (operational shape changed). Mechanical refreshes ship in-session; rewrites land in their own follow-up sprints.

**Pre-flight commands at kickoff:**

```bash
# 1. Branch state — sync with main since PR 4b merged
git fetch origin && git log --oneline origin/main -5

# 2. Get the full self-ref grep across all prompts
for f in docs/prompts/*.md; do
  echo "=== $f ==="
  grep -n "BREWING\.md\|ROASTING\.md\|docs/brewing/wbc\|docs/roasting/wbc\|docs/roasting/dongzhe\|docs/taxonomies/brewers\|docs/taxonomies/filters\|docs/taxonomies/grinders\|docs/taxonomies/sworks" "$f" 2>/dev/null
done

# 3. wc -l all prompts to confirm sizes match the brief
wc -l docs/prompts/*.md

# 4. Read coordinator catalog + operator-guide for current cluster targets
cat docs/skills/coordinator/operator-guide.md | head -50

# 5. Inspect sub-skill SKILL.md for current Phase descriptions
ls docs/skills/*/SKILL.md
```

## Step 2 — claude.ai surface refresh (Chris-driven)

Chris updates two claude.ai project surfaces:

**Brewing project (claude.ai):**
- Project instructions: replace any `read_doc(uri="docs://brewing.md")` references with the cluster fetch chain from `docs/prompts/start-brew.md` (Brewing Assistant operational-guide + Brewing Equipment Expert operational-reference + WBC Brewing Archivist clusters + coordinator/operator-guide)
- Project memory: per [feedback_claude_ai_memory_merge_only.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_claude_ai_memory_merge_only.md), bulk-replace any architectural-status memory with a single pointer to `docs/architecture/sub-skills-status.md` — "fetch live via MCP, don't replicate". Stale memory becomes inert when substrate is fetched live.

**Roasting project (claude.ai):**
- Project instructions: replace `read_doc(uri="docs://roasting.md")` references with the cluster fetch chain (Roasting Assistant onboarding-protocol + Roest Knowledge cluster + Roasting Historian active-lots/learnings/patterns + Peer-Learning Roasting Archivist + coordinator/operator-guide)
- Project memory: same as brewing — pointer to sub-skills-status.md, fetch substrate live.

Output: brief diff of claude.ai surface changes for Claude Code to review post-refresh.

## Step 3 — Dog-food cycle (Chris-driven)

**Brewing session.** Pick a coffee currently in rotation. Run `start-brew.md` → `log-brew.md` → `bundled-brewing-completion.md` end-to-end against the new architecture. Watch for:

- Does claude.ai correctly dispatch to Brewing Assistant operational-guide for Step 1?
- Does the Coffee Brief Step 1d strategy confirmation surface come through cleanly?
- Does `read_canonical` work for all 13 axes the resolved brew references?
- Does `propose_doc_changes` route to a cluster path (per ARBITER.md post-PR-4b allow-list)?
- Any friction in the iteration loop (Phase 2 in-thread)?
- Final `push_brew` validates without override-queue surprises?

**Roasting session.** Pick an active lot (e.g. SR Natural V5 Day 7 pourover, or whichever next lot is up). Run the appropriate prompt:
- V-set lot → `log-roast.md` or `log-cupping.md` depending on state
- Close a lot → `close-lot.md` or `one-shot-closeout.md`

Watch for:
- Active-lot doc at `docs/skills/roasting-historian/cluster/active-lots/<lot>.md` reaches claude.ai correctly?
- Roest Knowledge protocols/* reachable for BBP + Hopper + Fan Strategy?
- Cupping Specialist's V-set Path A/B/C-1/C-2 routing fires correctly?
- For close-out: scope_tags + carry-forward fields work cleanly?

Capture friction inline in `~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_mcp_continuous_log.md` per the standing continuous-feedback channel.

## Step 4 — `/grill-with-docs` on new concepts (cross-party)

Per [feedback_grilling_refresh_at_feature_ship.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_grilling_refresh_at_feature_ship.md): proactively force a `/grill-with-docs` pass at start/end of every feature ship to keep CONTEXT.md currency in sync.

Suggested grilling topics (Chris + Claude Code surface; CONTEXT.md gets updates):

1. **CCIL framing** — when is a pattern "cross-domain" vs internal-to-Historian? The Sudan Rume seed pattern in `docs/skills/ccil/cluster/coffee/sudan-rume/across-roasting-and-brewing.md` is the working example; what terms got introduced (variety throughline, per-layer mechanics, vehicle-dependency rule's process-scoped vs variety-scoped split)?
2. **Master-doc redirect stubs** — is `BREWING.md` / `ROASTING.md` still a coherent noun, or do we say "the brewing reference architecture"? CONTEXT.md may need an entry for "redirect stub" + "cluster path" + "operator-guide" + "operational-guide" (the per-tier shape distinction matters: coordinator's operator-guide is cross-domain; brewing-assistant's operational-guide is domain-specific).
3. **3-tier sub-skills vocabulary** — Knowledge / Workflow / CCIL tiers + Master Coordinator router. Chris's day-to-day terminology may not match the architectural terms; surface the drift.
4. **Per-lot directory structure** — `cluster/active-lots/<lot>.md` vs `cluster/learnings/<lot>.md` vs `cluster/one-shot-calibrations/<lot>.md`. 3 lifecycle dimensions mapped to 3 directories; does this match Chris's mental model?
5. **Pattern F (decomposition) tripwires** — 120KB total cluster / 60KB single doc. When does Chris consider a cluster "too big"?
6. **Substrate-practice gap audit (Practice-to-substrate)** — is there lived practice from the last 1-2 months that hasn't been captured in any cluster doc? The grilling pass should surface it.

Output: CONTEXT.md updates + `docs/sprints/grilling-2026-05-21-post-architecture-followups.md` capturing any gaps that need follow-up sprints.

## Step 5 (separate session) — Roadmap re-session

After Steps 1-4 close (likely 1-3 sessions), open a fresh session for Phase 4 closeout:

- Re-read PRODUCT.md § Queued post-architecture (Sprints 3.3-3.7 + deferred candidates)
- Re-assess each against the new architectural baseline:
  - **Sprint 3.3 — Auto-supersede paired sprint** — independent of architecture; likely ships as-is
  - **Sprint 3.4-3.5** — re-evaluate priority
  - **Sprint 3.6 — BREWING/ROASTING doc reconciliation** — likely subsumed (both are redirect stubs)
  - **Sprint 3.7 — Prompt v5 rewrites** — likely reshape (sub-skills are canonical fetch target now; some prompts may simplify)
  - **Deferred candidates** (CR-7-promote / CR-9 / WBC-4-large / DF-OPS1 / DF-OPS2 / BR-6) — re-rank
  - **Brewing-side `/add?type=purchased` deprecation** per [feedback_mcp_only_input.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_mcp_only_input.md) — when does this fire?
  - **Prompt subsumption sprint** — deferred until sub-skills exercised in lived practice ≥3 times; track use counter
  - **Learning Knowledge promotion** — ≥2 completed research tracks
  - **POD-1 follow-up** — 4 trigger conditions per `cluster/pod-1-routing.md`

- Output: new PRODUCT.md § Active Sprint Queue ordering + 1-2 kickoff briefs for the highest-priority follow-ups.

**Triggers when:** Steps 1-4 of this brief close. **Sizing:** S (single session, similar shape to Sprint R itself).

## Scope (in / out)

**In scope (Session 1):**
- Step 0 audit-scope confirmation with Chris
- Step 1 prompt audit (mechanical-refresh subset)
- Step 4 `/grill-with-docs` session (cross-party)
- Steps 2-3 prep + observation (Chris-side actions; Claude Code reviews diffs/logs)

**Out of scope:**
- Step 5 Roadmap re-session (separate session per Chris-locked decision)
- Sub-skill cluster expansion (Pattern A refresh events on CCIL; gated on lot close-outs)
- New MCP Tools (Tool count stays at 35)
- DB schema changes
- Prompt rewrites where shape has structurally changed (those become their own follow-up sprints per Step 1 classification)

## Verification plan

- After prompt audit: `grep -rn "BREWING\.md\|ROASTING\.md" docs/prompts/` returns zero meaningful hits (only intentional historical refs)
- After Step 4: `wc -c CONTEXT.md` shows the new terminology entries landed
- Continuous-feedback log gains at least one entry per dog-food session (sets baseline for future sessions)

## Sizing

**Session 1: M** (audit + observation + grill — roughly the shape of Wave 3 PR 1 in scope: cluster authoring + cross-party doc updates).
**Session 2: S** (roadmap re-session — same shape as Sprint R itself).

**Branch suggestion:** the worktree harness will assign one. Default merge style: squash + delete branch per [feedback_autonomy](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_autonomy.md).
