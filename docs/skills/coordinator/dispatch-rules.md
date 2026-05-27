# Dispatch Rules

Intent → sub-skill mapping. Populated as sub-skills ship.

## Wave 1 entries (active)

| Operator intent / prompt context | Dispatch target | Knowledge clusters to load |
|---|---|---|
| Any brewing session that needs equipment guidance (brewer + filter + grinder + grind setting constraints) | [Brewing Equipment Expert](../brewing-equipment-expert/SKILL.md) | `brewing-equipment-expert/cluster/` |
| Operator asks about EG-1 grind setting safety/quirks | Brewing Equipment Expert | `brewing-equipment-expert/cluster/grinder-eg1.md` |
| Operator asks about SWORKS dial behavior | Brewing Equipment Expert | `brewing-equipment-expert/cluster/sworks.md` |

## Wave 3 PR 2 entries (active — Workflow Planning tier)

| Operator intent / prompt context | Dispatch target | Knowledge clusters to load |
|---|---|---|
| New lot intake (operator opens `start-lot.md` or describes a green-bean lot they just received) | [Roasting Assistant](../roasting-assistant/SKILL.md) | `roasting-historian/cluster/` + `wbc-roasting-archivist/cluster/` + `roest-knowledge/cluster/` + `peer-learning-roasting-archivist/cluster/` |
| One-shot lot design (single-batch sample, operator opens `one-shot.md` STAGE 2) | Roasting Assistant | Same as new lot intake |
| V_(n+1) recipe design after current V-set cupping (operator at `log-cupping.md` STAGE 3 or Cupping Specialist Path B routes here) | Roasting Assistant | Same as new lot intake + `roasting-historian/cluster/learnings/<this-lot>.md` if exists |
| New brew session (operator opens `start-brew.md` or describes a coffee they're about to brew) | [Brewing Assistant](../brewing-assistant/SKILL.md) | `brewing-historian/cluster/` + `wbc-brewing-archivist/cluster/` + `brewing-equipment-expert/cluster/` |
| In-thread brew iteration (operator inside the active brew session reports tasting notes, wants refinement) | Brewing Assistant | Same as new brew session; Phase 2 sub-prompt active |
| Optimized brew dial-in on reference roast (Chain 1 mid-step) | Brewing Assistant | Same as new brew session + `roasting-historian/cluster/learnings/<this-lot>.md` for roast context |
| Research-track design (operator: "I want to test X across the next N lots/brews") | [Learning Assistant](../learning-assistant/SKILL.md) | `roasting-historian/cluster/` + `brewing-historian/cluster/` + `brewing-equipment-expert/cluster/` (when track has equipment dimension) + `wbc-roasting-archivist/cluster/sourcing/` |
| Sourcing opportunity evaluation (operator: "importer offered me X, should I buy?") | [Sourcing Workflow Planner](../sourcing-workflow-planner/SKILL.md) | `wbc-roasting-archivist/cluster/sourcing/` + `roasting-historian/cluster/` + direct `green_beans` table read |

## Wave 3 PR 3 entries (active — Workflow Executing tier)

Substrate-writer sub-skills wrapping existing MCP Tools. Each owns 1-5 `push_*` / `patch_*` Tools + validation discipline + cross-link verification. Tool descriptions in `lib/mcp/push-*.ts` / `patch-*.ts` carry an "Owned by <sub-skill> per ADR-0011" pointer for dispatch-time signal.

| Operator intent / prompt context | Dispatch target | Knowledge clusters to load |
|---|---|---|
| Post-roast batch logging (operator at `log-roast.md` STAGE 3 has Roest logs + per-batch reflections) | [Roast Recorder](../roast-recorder/SKILL.md) | `roest-knowledge/cluster/` (log interpretation + protocols) + `roasting-historian/cluster/` (retrospective comparison) |
| Pre-rewrite-lot inline backfill (`roast_recipes` missing for V_n, design intent reconstructable) | Roast Recorder STAGE 1(b) | Same as post-roast batch logging |
| Optimized brew completion (`bundled-brewing-completion.md`, purchased or self-roasted) | [Brew Recorder](../brew-recorder/SKILL.md) | `brewing-equipment-expert/cluster/` (canonical validation) + `brewing-historian/cluster/` (retrospective) |
| In-thread brew finalization (Brewing Assistant Phase 3 handoff) | Brew Recorder | Same as optimized brew completion |
| Day-7 xBloom cupping push + V-set Path A/B/C/C-1/C-2 routing (operator at `log-cupping.md`) | [Cupping Specialist](../cupping-specialist/SKILL.md) | `roasting-historian/cluster/` (`is_reference_candidate` patterns + cross-lot retros) + `roest-knowledge/cluster/protocols/` (silent-FC protocol stack) + `cupping-specialist/cluster/pod-1-routing.md` (when nearing reference) |
| `is_reference_candidate` flag-setting on V-set leading slot | Cupping Specialist STAGE 3 | Same as Day-7 cupping |
| Roest API profile push (Roasting Assistant produced approved recipe; operator at `start-lot.md` STAGE 3 or `log-cupping.md` STAGE 5(c)) | [Roest API Worker](../roest-api-worker/SKILL.md) | `roest-knowledge/cluster/api/` (write surface + quirks) + `roest-knowledge/cluster/firmware/` (version constraints) + `roest-knowledge/cluster/observed-quirks.md` (live issues) |
| V-set lot close-out (operator at `close-lot.md` after Cupping Specialist Path A → Brewing Assistant → Brew Recorder Chain 1) | [Close-Lot Specialist](../close-lot-specialist/SKILL.md) | `roasting-historian/cluster/` (verdict synthesis + carry-forward field discipline) |
| One-shot lot close-out (operator at `one-shot-closeout.md`, `green_beans.is_one_shot=true`) | Close-Lot Specialist | Same as V-set close-out; 7 lever-attribution fields rejected by schema |
| Chain 3 Path C close-without-reference (Cupping Specialist routes directly to Close-Lot Specialist) | Close-Lot Specialist | Same as V-set close-out |

## Wave 4 entries (placeholder — CCIL)

Wave 4 adds CCIL dispatch rules for cross-domain synthesis intents.

## Cross-domain dispatch (see also handoff-rules.md)

When operator intent spans both brewing and roasting, see [`handoff-rules.md`](handoff-rules.md) for the canonical chains. PR 2 made Chains 1 + 2 + 3 + 4 substantive (Planner halves ACTIVE). **PR 3 promotes Chains 1 + 2 + 3 + 4 from PARTIAL → ACTIVE** (all 5 Workflow Executing sub-skills flipped ACTIVE); Chain 5 already ACTIVE (single-step Sourcing Workflow Planner); Chain 6 remains placeholder for Wave 4 CCIL.

## Override logging (Pattern H)

When operator overrides a proposed dispatch, log the tuple `(intent → wrong dispatch → correct dispatch)` for periodic review. Pattern H consumes this log.

Format for override log entries:

```
- Date: YYYY-MM-DD
- Intent: <verbatim or paraphrased operator message>
- Proposed dispatch: <sub-skill>
- Correct dispatch: <sub-skill>
- Cause: <e.g. "rule too narrow" / "rule missing" / "rule conflicting with another">
- Patch applied: <link to commit or PR>
```

The log lives at `docs/skills/coordinator/dispatch-override-log.md` (file created on first override; not pre-stubbed).
