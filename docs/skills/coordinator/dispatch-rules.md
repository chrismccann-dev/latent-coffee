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
| In-thread brew iteration (operator at `log-brew.md` reports tasting notes, wants refinement) | Brewing Assistant | Same as new brew session; Phase 2 sub-prompt active |
| Optimized brew dial-in on reference roast (Chain 1 mid-step) | Brewing Assistant | Same as new brew session + `roasting-historian/cluster/learnings/<this-lot>.md` for roast context |
| Research-track design (operator: "I want to test X across the next N lots/brews") | [Learning Assistant](../learning-assistant/SKILL.md) | `roasting-historian/cluster/` + `brewing-historian/cluster/` + `brewing-equipment-expert/cluster/` (when track has equipment dimension) + `wbc-roasting-archivist/cluster/sourcing/` |
| Sourcing opportunity evaluation (operator: "importer offered me X, should I buy?") | [Sourcing Workflow Planner](../sourcing-workflow-planner/SKILL.md) | `wbc-roasting-archivist/cluster/sourcing/` + `roasting-historian/cluster/` + direct `green_beans` table read |

## Wave 3 PR 3 entries (placeholder — Workflow Executing tier)

Wave 3 PR 3 adds dispatch rules for substrate-writer sub-skills (Roast Recorder + Brew Recorder + Cupping Specialist + Roest API Worker + Close-Lot Specialist). Until then, substrate writes flow through prompts directly (`log-roast.md` → `push_roast` etc.) — Planning tier sub-skills hand off to the same prompt surface that calls the MCP Tools today.

## Wave 4 entries (placeholder — CCIL)

Wave 4 adds CCIL dispatch rules for cross-domain synthesis intents.

## Cross-domain dispatch (see also handoff-rules.md)

When operator intent spans both brewing and roasting, see [`handoff-rules.md`](handoff-rules.md) for the canonical chains. PR 2 makes Chains 1 + 2 + 3 + 4 substantive (the Planner halves are now ACTIVE); Cupping Specialist + Close-Lot Specialist hops on Chain 1 activate at PR 3.

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
