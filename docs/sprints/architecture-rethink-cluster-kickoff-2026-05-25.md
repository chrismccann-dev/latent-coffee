# Architecture brainstorm cluster kickoff — composable sub-skills + self-improving + cross-corpus

**Date:** 2026-05-25
**Predecessor:** Audit cluster ([audit-cluster-kickoff-2026-05-25.md](docs/sprints/audit-cluster-kickoff-2026-05-25.md))
**Successor:** Architecture implementation sprint(s) — scope TBD post-brainstorm
**Sizing:** L (1-2 day brainstorm session; not implementation; produces ADR(s) + decomposition spec)
**Branch:** TBD at kickoff (suggest `claude/architecture-brainstorm-2026-05-XX`)
**Mode:** Plan-mode or `grill-with-docs` shaped session — interpretive, not concrete

## Goal

Convergent brainstorm on three tightly-coupled architectural questions that Chris surfaced in Sprint R's input-collection turn (2026-05-25). Output: an ADR (likely 2-3) + a decomposition spec for the sub-skills architecture that gets implemented in subsequent sprints.

The three questions:

### Q1 (Chris's input #6) — What does "self-improving" actually mean for Latent?

The system positions itself as compounding knowledge. But does it actually self-improve, or does it accumulate? What's the difference? What's the test for "self-improving"? Are there parts of the system where the loop closes cleanly (synthesis cache regenerates on delta) vs parts where it doesn't (BREWING.md / ROASTING.md grow but don't compact)? What would a deliberate self-improvement architecture look like, vs what we have today?

### Q2 (Chris's input #5) — Cross-brewing + cross-roasting joined learning

Today the synthesis pipeline does cross-source corpus reads (Sprint 13 / SYN-6) — terroir / cultivar / roaster adapters read both `brews` AND `roast_learnings`. But the **integration is at the cache adapter level, not at the workflow level**. There's no first-class "what did I learn about Sudan Rume across both my brewing of Hydrangea's Sudan Rume AND my roasting of CGLE Sudan Rume Hybrid Washed" surface. Should there be? Or does the synthesis-cache integration cover it?

This question is downstream of Q1 — if "self-improving" means compounding cross-domain insights, this is one of the surfaces.

### Q3 (Chris's input #7) — Decompose BREWING.md / ROASTING.md into composable sub-skills

This is THE big architectural rethink. Chris's audio note (verbatim in Sprint R thread, 2026-05-25) proposes:

> "I should almost have a roasting assistant whose sole job is to construct a new initial starting roasting recipe based on the most important levers — repeatability / cultivar / process / density+moisture pair... and then a roast recorder whose whole job is to take the roast data post-roast and push it into the app... a Roest expert who's expert on all things working with the Roest machine... the cupping specialist... the roasting historian... and a peer-learning roasting archivist that goes out from the web and looks and finds other roasters that use the Roest L200 Ultra on the same counterflow method... a World Brewers Champion reference archivist that has taken general knowledge from all the top WBrC competitors 2022-2025... a sourcing assistant... a learning assistant keeping track across the full roasting cycle about experiments to run."

The roasting decomposition is one half; the brewing-side has the equivalent. Plus a cross-domain layer that synthesizes across both.

Chris's articulated motivation: "if I keep shoving it all in just a master roasting MD file, that this thing gets bigger and bigger and bloated... it doesn't really scale and compound over time. How do you keep the knowledge scalable? How do you pull in the right context at the right time, but also not load in the whole thing and overwhelm everything... but actually work at scale, compound at scale, learn at scale, and be extensible."

This question has a **hard system trigger justifying it now**: BREWING.md is 204KB and ROASTING.md is 132KB — both past the 120KB tripwire codified in CLAUDE.md § Sprint cadence § Standing tripwires. The tripwire already fired. We've been ignoring it. This is the response.

## Why these three are one brainstorm, not three sprints

- Q1 frames Q3 (what shape the decomposition should take depends on what "self-improving" means)
- Q3 contains Q2 as a sub-skill (the cross-corpus synthesizer is one of the proposed sub-agents)
- Trying to scope them independently produces contradictory output (e.g. Q3 ships sub-skills that don't have a self-improvement story per Q1; Q2 ships a cross-corpus surface that doesn't fit the sub-skill decomposition per Q3)

One coherent brainstorm. Output: 2-3 ADRs + a decomposition spec.

## Input materials (read at kickoff in this order)

1. **Audio note from Chris** (verbatim in Sprint R conversation thread, 2026-05-25 turn — the long audio-dictation turn that proposed the roasting assistant / roast recorder / Roest expert / cupping specialist / roasting historian / peer-learning archivist / WBC champion archivist / sourcing assistant / learning assistant decomposition). **Primary source for Q3.**
2. **Audit cluster retro** (`memory/project_audit_cluster_2026-05-XX.md` after audit sprint closes) — surfaces lived-practice drift that should inform the decomposition.
3. **Audit prep artifacts** from Sprint R (under `docs/sprints/`):
   - `sprint-r-audit-prep-claude-ai-memory-diff-2026-05-25.md`
   - `sprint-r-audit-prep-roasting-workflow-baseline-2026-05-25.md`
   - `sprint-r-audit-prep-brewing-workflow-baseline-2026-05-25.md`
4. **PRODUCT.md** § Future Directions — Chris's prior framing of "Recipe accelerator on new bean intake" + "Cross-pollination pushing" (Q1 + Q2 prior framing)
5. **CLAUDE.md** § Architecture — current Latent app architecture (35 Tools, synthesis pipeline, 11 canonical axes)
6. **CONTEXT.md** § Cross-source / § Short-form capsule — current synthesis-side integration shape
7. **CLAUDE.md** § Sprint cadence § Standing tripwires — the 120KB tripwire that fired
8. **CLAUDE.md** § Living reference docs — current pattern (Chris hand-edits + propose_doc_changes pipeline)
9. **ARBITER.md** § Substrate-practice gap audit — the existing practice-to-substrate mechanism

Optional reference (for the WBC champion archivist sub-skill discussion):
- `docs/brewing/wbc-recipes.md` — 102-recipe corpus
- `docs/roasting/wbc-roasting.md` + `wbc-sourcing.md` — WBC-derived lessons

Optional reference (for the Roest expert sub-skill discussion):
- `lib/mcp/push-roast-profile.ts` + `pull-roest-log.ts` — current Roest API integration surface

## Suggested brainstorm shape

Loosely structured like the V2 brainstorm (Sprint 2.2) or Sprint 3.1 brainstorm — round-based with AskUserQuestion forks at the inflection points.

### Round 1 — Self-improving (Q1)

- What's the test for "self-improving"? What's the difference between accumulating and compounding?
- Where does the loop close cleanly today? Where doesn't it?
- What's the role of the human (Chris) in the self-improvement cycle vs the system?
- Are there self-improvement primitives missing (e.g. "the system should notice when an aggregation page's synthesis hasn't changed in N visits and prompt for a recipe refresh")?

Output: a working definition of self-improving for Latent + a list of loops that close cleanly vs don't.

### Round 2 — Sub-skill decomposition (Q3)

Walk Chris's audio-note enumeration. For each proposed sub-skill:
- What's its job-to-be-done in one sentence?
- What's its input surface? Output surface?
- What sub-skills does it call? (master coordinator pattern)
- What MCP Tools / Resources / canonical registries does it consume?
- What's the boundary that makes it composable (vs leaky / overlapping with another sub-skill)?

Roasting-side proposed sub-skills:
- Roasting Assistant (recipe construction)
- Roast Recorder (post-roast app push)
- Roest Expert (Roest L200 Ultra + API)
- Cupping Specialist (cupping evaluation + Path A/B/C routing)
- Roasting Historian (cross-lot knowledge)
- Peer-Learning Roasting Archivist (web research, other L200 counterflow roasters)
- WBC Champion Reference Archivist (2022-2025 WBrC corpus on roasting)
- Sourcing Assistant (inventory + portfolio lanes + sourcing channels)
- Learning Assistant (open questions + experiment queue + compounded knowledge check-ins)
- Master Coordinator (the master roasting workflow orchestrator)

Brewing-side equivalents (Chris's audio note implied symmetry but didn't enumerate):
- Brewing Assistant
- Brew Recorder
- Brewing Equipment Expert (vs Roest Expert)
- Palate Evaluator (vs Cupping Specialist)
- Brewing Historian
- WBC Champion Brewing Archivist
- Master Coordinator

Cross-domain layer (Q2 surface):
- Cross-Corpus Synthesizer
- Recipe Accelerator (PRODUCT.md Future Directions Q1)
- Cross-Pollination Suggester (PRODUCT.md Future Directions Q2)

Output: a sub-skill decomposition spec — one file per sub-skill probably under `docs/skills/` or `docs/architecture/`, each with job-to-be-done + inputs + outputs + called-by + calls + substrate dependencies.

### Round 3 — Implementation shape (transition to next sprint)

- Where does each sub-skill live? Options:
  - (a) `.claude/skills/<name>/SKILL.md` per the existing skill pattern (used today for `grill-with-docs`)
  - (b) New `docs/skills/<name>.md` registered as MCP Resources
  - (c) Sub-directory under `lib/agents/` if they need code, not just markdown
  - (d) Mix — markdown for the skill knowledge, code helpers where automation needed
- What's the master-coordinator implementation? Is it a master prompt loaded into claude.ai, or a Claude Code orchestrator, or something else?
- What's the minimum-viable subset to ship first? (Probably not all 10+ at once.)
- What do BREWING.md and ROASTING.md become after decomposition? Pointers? Reduced "core principles only"?

Output: ADR(s) on the implementation shape + first-shipment subset + transition plan for the master docs.

### Round 4 — Self-improvement loops (Q1 closure)

Tie back to Q1. For each sub-skill, identify: what's its self-improvement loop? How does it get better over time? Without explicit answers per sub-skill, the architecture risks shipping 10 dead docs.

Output: per-sub-skill self-improvement primitive spec.

## Expected output

- **2-3 ADRs:**
  - ADR-0011 (probably): "Composable sub-skills architecture replacing monolithic BREWING.md / ROASTING.md"
  - ADR-0012 (probably): "Master coordinator pattern + sub-skill call graph"
  - ADR-0013 (possibly): "Self-improvement primitives per sub-skill"
- **Decomposition spec:** one file per sub-skill (probably ~10-15 sub-skills total), under TBD path (decided in Round 3)
- **Transition plan for master docs:** BREWING.md and ROASTING.md migration shape
- **First-shipment subset:** which 2-3 sub-skills ship first as the proof of pattern
- **Implementation sprint kickoff brief:** paste-ready brief for the next sprint that starts implementation

## Scope (out)

- Implementation — none in this sprint
- Sub-skill content authoring beyond outlines — defer to per-sub-skill implementation sprints
- The "peer-learning roasting archivist" web-research sub-skill — may need a separate technology-evaluation sprint (web fetch + caching strategy + freshness model). Surface as a deferred dependency if so.
- Brewing-side `/add` deprecation — Chris-stated future sprint; doesn't block this brainstorm

## Standing rules that bind this sprint

- Plan before coding when scope is interpretive (CLAUDE.md sprint cadence #1) — this is plan-mode all the way through
- Cross-system audit before PR (CLAUDE.md sprint cadence #4) — ADR + decomposition spec touch substrate; trace through 6-actor matrix at PR time
- Run `/simplify` before commit if 2+ sites share a new pattern (CLAUDE.md sprint cadence #5)
- Retro before docs (CLAUDE.md sprint cadence #6)
- Worktree-local `git config user.email chris.r.mccann@gmail.com` before commits per [feedback_git_email.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_git_email.md)

## Pre-flight commands at kickoff

```bash
# 1. Branch state
git fetch origin && git log --oneline origin/main -10

# 2. Confirm audit cluster shipped + retro exists
ls memory/project_audit_cluster_*.md docs/sprints/audit-cluster-kickoff-2026-05-25.md

# 3. Quick size check on the docs being decomposed
wc -c BREWING.md ROASTING.md CLAUDE.md PRODUCT.md

# 4. ADR count
ls docs/adr/

# 5. Existing skills pattern (for option (a) in Round 3)
ls -la .claude/skills/

# 6. Existing MCP Resources catalog (for option (b) in Round 3)
grep -c 'docs://' lib/mcp/docs.ts
```

## Open questions to surface at kickoff (interpretive forks)

1. **Does claude.ai's project structure support sub-agents natively, or are sub-skills loaded into a single claude.ai context?** This drives whether the master coordinator is a routing layer or an in-context orchestrator.
2. **Should the audio note's exact decomposition be honored, or is it a starting hypothesis to push back on?** Recommend: starting hypothesis. Some sub-skills may collapse together; some may split further.
3. **Is the cross-domain layer (Q2) its own coordinator, or does it sit under both Master Brewing Coordinator + Master Roasting Coordinator?** Architectural choice with downstream consequences for cache shape.
4. **What's the "feedback handoff queue" (Chris input #4) under this architecture?** It's a sub-skill, but which one? Probably the Learning Assistant's input surface — but worth confirming early so it doesn't fall through the cracks.

## Coordination notes

- The audit cluster MUST close before this sprint opens — its retro is a primary input
- POD-1 (pour-over discriminator + optimized brew lifecycle states) is deliberately delayed behind this brainstorm. POD-1 may land naturally inside the new architecture (e.g. as a sub-skill route), so designing it before the architecture risks rework.
- If this brainstorm shifts the implementation pattern radically, the post-architecture roadmap re-session may need to re-scope POD-1 too.

## After this sprint closes

Next sprint(s) = architecture implementation. Likely 2-4 sprints in sequence:
1. First-shipment sub-skill subset (proof of pattern, 2-3 sub-skills)
2. Master coordinator implementation
3. BREWING.md / ROASTING.md migration to pointer-shape
4. Self-improvement primitives per shipped sub-skill

Then the post-architecture roadmap re-session reassesses POD-1 / Sprint 3.3 / 3.4 / 3.5 / 3.6 / 3.7 / deferred candidates in light of the new architecture.
