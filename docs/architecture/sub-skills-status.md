# Sub-skills architecture status

*Coffee Research · Latent · Architecture reference*

Extracted from CLAUDE.md § Composable sub-skills in Wave 4 PR 4b (2026-05-21) per scope decision 4 of Wave 4 PR 4a. Architecture-arc-narrative density was driving CLAUDE.md growth past the 120KB tripwire (125,750 bytes post-PR-4a); the architecture implementation log deserves its own dimension.

This doc summarizes wave-by-wave what shipped + when + with what. For the architectural rationale, see [ADR-0011](../adr/0011-composable-sub-skills-architecture.md) (composable sub-skills) + [ADR-0012](../adr/0012-master-coordinator-pattern.md) (master coordinator) + [ADR-0013](../adr/0013-self-improvement-primitives.md) (self-improvement primitives). For the wave-by-wave master-doc migration plan, see [master-doc-transition-plan.md](./master-doc-transition-plan.md).

**Status overall:** Wave 4 PR 4b shipped 2026-05-21 → architecture implementation arc CLOSED.

## Sub-skill catalog summary

3-tier architecture (Knowledge / Workflow / CCIL) + Master Coordinator router. 18 sub-skills + 1 deferred (Learning Knowledge, gated on ≥2 research tracks complete). Full catalog with I/O metadata + dispatch rules at [docs/skills/coordinator/catalog.md](../skills/coordinator/catalog.md).

| Tier | Sub-skill | Wave | Status |
|---|---|---|---|
| Knowledge | [Brewing Equipment Expert](../skills/brewing-equipment-expert/) | 1 | ACTIVE |
| Knowledge | [WBC Brewing Archivist](../skills/wbc-brewing-archivist/) | 2 PR 1 | ACTIVE |
| Knowledge | [WBC Roasting Archivist](../skills/wbc-roasting-archivist/) | 2 PR 1 | ACTIVE |
| Knowledge | [Brewing Historian](../skills/brewing-historian/) | 2 PR 2 | ACTIVE |
| Knowledge | [Roasting Historian](../skills/roasting-historian/) | 2 PR 3 | ACTIVE |
| Knowledge | [Peer-Learning Roasting Archivist](../skills/peer-learning-roasting-archivist/) | 3 PR 1 | ACTIVE |
| Knowledge | [Roest Knowledge](../skills/roest-knowledge/) | 3 PR 1 | ACTIVE |
| Knowledge | Learning Knowledge | (deferred) | PLACEHOLDER |
| Workflow Planning | [Roasting Assistant](../skills/roasting-assistant/) | 3 PR 2 | ACTIVE |
| Workflow Planning | [Brewing Assistant](../skills/brewing-assistant/) | 3 PR 2 | ACTIVE |
| Workflow Planning | [Learning Assistant](../skills/learning-assistant/) | 3 PR 2 | ACTIVE |
| Workflow Planning | [Sourcing Workflow Planner](../skills/sourcing-workflow-planner/) | 3 PR 2 | ACTIVE |
| Workflow Executing | [Roast Recorder](../skills/roast-recorder/) | 3 PR 3 | ACTIVE |
| Workflow Executing | [Brew Recorder](../skills/brew-recorder/) | 3 PR 3 | ACTIVE |
| Workflow Executing | [Cupping Specialist](../skills/cupping-specialist/) | 3 PR 3 | ACTIVE (POD-1 absorbed) |
| Workflow Executing | [Roest API Worker](../skills/roest-api-worker/) | 3 PR 3 | ACTIVE |
| Workflow Executing | [Close-Lot Specialist](../skills/close-lot-specialist/) | 3 PR 3 | ACTIVE |
| Special | [Cross-Coffee Insight Layer (CCIL)](../skills/ccil/) | 4 PR 4a | ACTIVE |
| Coordinator | [Master Coordinator](../skills/coordinator/) | 1 | ACTIVE |

## Wave-by-wave ship log

### Wave 1 (shipped 2026-05-26)

**Master Coordinator catalog** ([docs/skills/coordinator/](../skills/coordinator/)) — 18-sub-skill registry + dispatch rules + handoff chains.

**Brewing Equipment Expert cluster** ([docs/skills/brewing-equipment-expert/](../skills/brewing-equipment-expert/)) — consolidates `brewers / filters / grinder-eg1 / sworks` taxonomies under one knowledge cluster. Migrated from `docs/taxonomies/` with redirect stubs preserved at original paths.

### Wave 2 PR 1 (shipped 2026-05-26)

**WBC Brewing Archivist** ([docs/skills/wbc-brewing-archivist/](../skills/wbc-brewing-archivist/)) — migrates `docs/brewing/wbc-{reference,recipes}.md`; back-compat redirect stubs at original paths.

**WBC Roasting Archivist** ([docs/skills/wbc-roasting-archivist/](../skills/wbc-roasting-archivist/)) — migrates `docs/roasting/wbc-{roasting,sourcing}.md`; tentatively absorbs Sourcing Knowledge per [ADR-0011](../adr/0011-composable-sub-skills-architecture.md).

### Wave 2 PR 2 (shipped 2026-05-26)

**Brewing Historian** ([docs/skills/brewing-historian/](../skills/brewing-historian/)) — extracts BREWING.md § Cross-Coffee Insight Layer into `cluster/patterns/cross-coffee-insights.md` + 6 `cluster/patterns/by-strategy/<strategy>.md` files + 7 N≥3 `by-cultivar/` stubs + 6 N≥3 `by-coffee-family/` stubs. **BREWING.md shrunk 213KB → 124KB.**

### Wave 2 PR 3 (shipped 2026-05-26)

**Roasting Historian** ([docs/skills/roasting-historian/](../skills/roasting-historian/)) — extracts ROASTING.md § Cross-Coffee Insight Layer + § Open Questions into `cluster/patterns/cross-coffee-insights.md` + `cluster/patterns/open-questions.md` + `cluster/patterns/general.md` + FK-seeded `by-cultivar/gesha.md` + `by-process/washed.md` stubs + 7 per-lot `cluster/learnings/<lot>.md` pointer files. **ROASTING.md shrunk 147KB → 103KB.** Wave 2 closed; cumulative BREWING.md + ROASTING.md shrink ~133KB.

### Wave 3 PR 1 (shipped 2026-05-26) — operator-stub Knowledge pair

**Peer-Learning Roasting Archivist** ([docs/skills/peer-learning-roasting-archivist/](../skills/peer-learning-roasting-archivist/)) — `cluster/per-peer/dongzhe.md` migrated from `docs/roasting/dongzhe-livestream-2026-05.md` + ROASTING.md § Reference Roast Target + § Peer Insights. Plus `cluster/cross-peer/patterns.md` N<3 stub + `cluster/source-index.md` provenance log.

**Roest Knowledge** ([docs/skills/roest-knowledge/](../skills/roest-knowledge/)) — 10 cluster files: machine/l200-ultra + machine/counterflow-observations + protocols/{evaluation, fan-strategy, fc-marking} + api/{read-surface, write-surface, quirks} + firmware/README + observed-quirks. Migrates ROASTING.md § Equipment + § Evaluation Protocol + § Standard Inlet Curve Template + § Fan Strategy + § Key Counterflow Observations + § FC Marking Protocol.

Also extracts **Roasting Historian's `cluster/patterns/roast-to-brew-translation.md`** from ROASTING.md (override of the prior Chris-lock that kept R-to-B in ROASTING.md until Wave 4 per [feedback_recommend_prior_lock_as_default.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_recommend_prior_lock_as_default.md)).

**ROASTING.md shrunk 103KB → 72KB** (~31KB shrink, within ~25-40KB target band per Chris-lock that kept Naturals + Honey + 3 sections in ROASTING.md for Wave 3 cleanup pass).

### Wave 3 PR 2 (shipped 2026-05-26) — Workflow Planning tier

4 Workflow Planning sub-skills, reads-only composition over Wave 1+2 Knowledge clusters:

- **Roasting Assistant** ([docs/skills/roasting-assistant/](../skills/roasting-assistant/)) — V-set + one-shot recipe design composing Roasting Historian + WBC Roasting Archivist + Roest Knowledge + Peer-Learning Roasting Archivist
- **Brewing Assistant** ([docs/skills/brewing-assistant/](../skills/brewing-assistant/)) — 3-phase recipe construction + in-thread iteration absorbing Palate Evaluator per [ADR-0011 § iteration-depth asymmetry](../adr/0011-composable-sub-skills-architecture.md). Composes Brewing Historian + WBC Brewing Archivist + Brewing Equipment Expert
- **Learning Assistant** ([docs/skills/learning-assistant/](../skills/learning-assistant/)) — the only cross-domain planner. Constructs research tracks (distinct vocabulary from per-lot `experiments` table rows). Composes both Historians + sourcing + CCIL (when Wave 4 lands)
- **Sourcing Workflow Planner** ([docs/skills/sourcing-workflow-planner/](../skills/sourcing-workflow-planner/)) — buy/hold/pass + lane-fit assessment composing WBC Roasting Archivist § sourcing/ + Roasting Historian closed-lot retros + direct `green_beans` reads

No `cluster/` subdirectories per scope decision 1 (templates accrue under Pattern F if they emerge in lived use). Prompts unchanged per scope decision 2 — `start-lot.md` / `log-roast.md` / `one-shot.md` / `start-brew.md` / `log-brew.md` continue as the claude.ai entry surface; sub-skills become the canonical fetch target the prompts compose over.

Master Coordinator handoff chains extended per scope decision 3 — `coordinator/handoff-rules.md` now enumerates 6 chains:

1. V-set Path A → optimized brew → resolved lot
2. Research track
3. New lot intake
4. Single-coffee brew terminal
5. Sourcing eval
6. Wölfl cross-pollination (placeholder)

Chains 1-4 PARTIAL, Chain 5 ACTIVE, Chain 6 placeholder for Wave 4 CCIL.

Learning Knowledge stays deferred per ADR-0011 trigger (≥2 completed research tracks).

### Wave 3 PR 3 (shipped 2026-05-26) — Workflow Executing tier; Wave 3 closed

5 Workflow Executing sub-skills wrapping the existing `push_*` / `patch_*` MCP Tools:

- **Roast Recorder** — wraps `push_roast` + `push_roast_recipe` (when not pre-pushed) + `patch_roast` + `patch_roast_recipe`. Owns slot → recipe_id map resolution incl. pre-rewrite-lot fallback + missing-recipe inline backfill per `log-roast.md` STAGE 1. Sets `fc_audibility` 4-value enum per Sprint 11 RO-CP-3.
- **Brew Recorder** — wraps `push_brew` + `patch_brew` + downstream `propose_doc_changes` into Brewing Historian cluster. Per-coffee terminal write (brewing iterates IN-THREAD ONLY per ADR-0011 § iteration-depth asymmetry). Validates canonical compliance against Brewing Equipment Expert + per-axis registries + `fermentation_qualifiers` Anoxic cue (Sprint T3 / CR-5).
- **Cupping Specialist** — wraps `push_cupping` + `patch_cupping` + `patch_experiment` + `patch_roast` (`is_reference_candidate`) + `propose_doc_changes`. Executes Day-7 xBloom cupping + V-set Path A/B/C-1/C-2 routing. **POD-1 absorbed at SKILL.md level + bookmarked at [`cluster/pod-1-routing.md`](../skills/cupping-specialist/cluster/pod-1-routing.md) pending 4 lived-practice trigger conditions** — today's Path C-1/C-2 substrate kept intact; future simulated-pourover-gate rewrite deferred.
- **Roest API Worker** — wraps `push_roast_profile` (Roest L200 Ultra API write) + `patch_roast_recipe` (Roest profile linkage). Symmetry-split from Roest Knowledge per ADR-0011. Validation gap (success on API acceptance, not machine confirmation) acknowledged today.
- **Close-Lot Specialist** — **resolved-lot completion gate**. Wraps `push_roast_learnings` + `patch_roast_learnings` + `patch_roast` (`is_reference` + `worth_repeating` promotion) + `patch_inventory` (archive) + `propose_doc_changes`. Handles both V-set + one-shot close-out (7 lever-attribution fields schema-rejected on one-shots per migration 054; Outcome A reference-quality vs Outcome B "Closed without reference" via `why_this_roast_won: NULL` routing). Cross-link verification end-to-end.

Cupping Specialist is the only Wave 3 PR 3 sub-skill with a `cluster/` — [`pod-1-routing.md`](../skills/cupping-specialist/cluster/pod-1-routing.md) carries forward the POD-1 scoping draft + 4 trigger conditions (2-3 more V-set Path A lots + at least one one-shot close-out + Stefano Um / Bukure / Higuito decisions + C-2 disambiguation cases). **Trigger #4 fired 2026-05-21 on CGLE Sudan Rume Natural V5** (Sprint R Phase 4 Step 3 dog-food, first lived test) — inverts the "if never observed, deprecate" framing; Path C-2 is validated by lived practice. See `cluster/pod-1-routing.md § Lived-practice trigger fires` for the dated event log. Other 4 ship SKILL.md only per PR 2/3 precedent.

Tool descriptions in `lib/mcp/push-*.ts` + `patch-*.ts` carry single-line "Owned by <sub-skill> per ADR-0011" pointers (13 Tools touched).

Master Coordinator: catalog flipped 5 entries placeholder → ACTIVE + wave-status updated to mark Wave 3 closed; dispatch-rules added 10 new intent → executor mappings; handoff-rules promoted Chains 1 + 3 + 4 from PARTIAL → ACTIVE, Chain 2 to ACTIVE-pending-Learning-Knowledge (archival hop deferred per ADR-0011 trigger of ≥2 completed research tracks), Chain 5 already ACTIVE single-step, Chain 6 placeholder for Wave 4 CCIL.

`lib/agents/` helper authoring skipped per scope decision (ADR-0011 + ADR-0012 defer-code-until-needed pattern; future authoring gated on lived-practice friction). 6 new MCP Resources registered in `lib/mcp/docs.ts` (5 SKILL.md + 1 cluster doc). **Wave 3 closed.**

### Wave 4 PR 4a (shipped 2026-05-21) — CCIL skeleton + Sudan Rume seed

**Cross-Coffee Insight Layer (CCIL)** ([docs/skills/ccil/](../skills/ccil/)) — flipped PLACEHOLDER → ACTIVE.

- [`cluster/coffee/sudan-rume/across-roasting-and-brewing.md`](../skills/ccil/cluster/coffee/sudan-rume/across-roasting-and-brewing.md) — proof-of-pattern seed synthesizing the brewing-side variety-intrinsic-light-body + aromatic-landrace-pungency-risk + vehicle-determined-integration rules with the roasting-side hopper-pre-load + counterflow-FC-window + density-vs-thermal-insulation rules. Surfaces planner-consumable cross-domain recommendations. N=3 across both domains (2 Latent-roasted SR lots + 1 externally-roasted SR brewing lot).
- [`cluster/decomposition-log.md`](../skills/ccil/cluster/decomposition-log.md) — Pattern F audit trail starter. Append-only log of CCIL self-decomposition events triggered by 120KB total cluster / 60KB single doc / dispatch-accuracy degradation / cross-pattern density tripwires per [ADR-0013](../adr/0013-self-improvement-primitives.md).

Chain 6 (Wölfl cross-pollination brew) promoted from PLACEHOLDER → ACTIVE-pending-lived-practice. Every sub-skill in the chain exists on paper (Learning Assistant → Roasting Assistant → Chain 3 + Chain 4 → CCIL synthesizes); chain not yet exercised against a real cross-pollination lot.

Master Coordinator catalog flipped CCIL entry → ACTIVE + Learning Assistant entry updated to reference CCIL as live (not "when Wave 4"). 3 new MCP Resources registered (CCIL SKILL.md + sudan-rume seed + decomposition-log; listDocs count 97 → 100).

### Wave 4 PR 4b (shipped 2026-05-21) — architecture implementation arc CLOSED

**Master-doc residual migration + redirect stubs + CLAUDE.md compaction + Naturals + Honey + 3 ambiguous ROASTING.md sections cleanup pass.**

BREWING.md + ROASTING.md rewritten as ~3KB and ~6KB pointer-table stubs (from 124KB and 72KB residual content). ~196KB of operational content migrated to:

- [coordinator/catalog.md § brewing-domain-principles](../skills/coordinator/catalog.md) + [§ roasting-domain-principles](../skills/coordinator/catalog.md) — expanded from ~1-2KB each to ~3-4KB each to absorb Two-Axis Framework framing + Roasting Philosophy + What Good Looks Like + What I Am Not Trying To Do + V-set methodology
- [coordinator/operator-guide.md](../skills/coordinator/operator-guide.md) (new) — cross-domain operator guide replacing BREWING.md/ROASTING.md § How to Use + Schema model + Canonical lookups + MCP server + Data Capture + Per-Coffee Threads + Session Debrief Template
- [brewing-assistant/cluster/operational-guide.md](../skills/brewing-assistant/cluster/operational-guide.md) (new) — full BREW PROMPT Steps 1-4 + Coffee Brief + Recipe Output + Iteration Loop + Resolved Brew Output Format
- [brewing-equipment-expert/cluster/operational-reference.md](../skills/brewing-equipment-expert/cluster/operational-reference.md) (new) — Location Constraints + Equipment Reference + Valve Position Reference + Filter System + Example Outputs + Brewer Rotation Framework
- [roasting-assistant/cluster/onboarding-protocol.md](../skills/roasting-assistant/cluster/onboarding-protocol.md) (new) — full New Coffee Onboarding Protocol Steps 1-4 + Naming Conventions + Parallel Experiment Considerations
- [roasting-historian/cluster/patterns/by-process/natural.md](../skills/roasting-historian/cluster/patterns/by-process/natural.md) (new) + [by-process/honey.md](../skills/roasting-historian/cluster/patterns/by-process/honey.md) (new) — Naturals + Honey roast-direction frameworks (per scope decision 3 of PR 4a — fold cleanup pass into PR 4b)
- [roasting-historian/cluster/active-lots/](../skills/roasting-historian/cluster/active-lots/) (new directory; 6 per-lot files + README) — Active Lots from ROASTING.md § Lot Knowledge
- [roasting-historian/cluster/one-shot-calibrations/](../skills/roasting-historian/cluster/one-shot-calibrations/) (new directory; README only, currently empty)
- [roest-knowledge/cluster/protocols/between-batch-protocol.md](../skills/roest-knowledge/cluster/protocols/between-batch-protocol.md) (new) — Standard Workflow + BBP + Hopper Pre-Load Timing
- [roest-knowledge/cluster/protocols/green-storage.md](../skills/roest-knowledge/cluster/protocols/green-storage.md) (new) — Green Bean Storage Protocol
- [brewing-historian/cluster/patterns/cross-coffee-insights.md](../skills/brewing-historian/cluster/patterns/cross-coffee-insights.md) — Process / Variety Signal Table appended as a top-level structured-table addition

CLAUDE.md sub-skills section extracted to this doc per scope decision 4 of PR 4a (CLAUDE.md back under the 120KB tripwire). 14 new MCP Resources registered in `lib/mcp/docs.ts` (listDocs count 100 → 114).

**Architecture implementation arc closed.** Sprint R's 4-phase Option 1 sequence (audit cluster → architecture brainstorm → architecture implementation → roadmap re-session) reaches its final phase: roadmap re-session.

## Cross-references

- [ADR-0011](../adr/0011-composable-sub-skills-architecture.md) — composable sub-skills architecture (the architectural rationale)
- [ADR-0012](../adr/0012-master-coordinator-pattern.md) — Master Coordinator router pattern
- [ADR-0013](../adr/0013-self-improvement-primitives.md) — self-improvement primitives (Patterns A-I)
- [master-doc-transition-plan.md](./master-doc-transition-plan.md) — wave-by-wave BREWING.md + ROASTING.md migration plan
- [docs/skills/coordinator/catalog.md](../skills/coordinator/catalog.md) — full 18-sub-skill registry + dispatch I/O metadata
- [docs/skills/coordinator/dispatch-rules.md](../skills/coordinator/dispatch-rules.md) — intent → executor mappings
- [docs/skills/coordinator/handoff-rules.md](../skills/coordinator/handoff-rules.md) — 6-chain workflow composition rules
