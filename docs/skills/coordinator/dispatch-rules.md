# Dispatch Rules

Intent → sub-skill mapping. Populated as sub-skills ship; Wave 1 covers Brewing Equipment Expert only.

## Wave 1 entries (active)

| Operator intent / prompt context | Dispatch target | Knowledge clusters to load |
|---|---|---|
| Any brewing session that needs equipment guidance (brewer + filter + grinder + grind setting constraints) | [Brewing Equipment Expert](../brewing-equipment-expert/SKILL.md) | `brewing-equipment-expert/cluster/` |
| Operator asks about EG-1 grind setting safety/quirks | Brewing Equipment Expert | `brewing-equipment-expert/cluster/grinder-eg1.md` (when authored) |
| Operator asks about SWORKS dial behavior | Brewing Equipment Expert | `brewing-equipment-expert/cluster/sworks.md` (when authored) |

## Wave 2+ entries (TBD as sub-skills ship)

Wave 2 will add dispatch rules for Brewing Historian, Roasting Historian, WBC Brewing Archivist, WBC Roasting Archivist. Wave 3 adds the 9 workflow tier sub-skills. Wave 4 adds CCIL.

Pattern for adding a new entry: when a sub-skill ships, add a row above mapping the operator intent(s) that should dispatch to it.

## Cross-domain dispatch (see also handoff-rules.md)

When operator intent spans both brewing and roasting, see [`handoff-rules.md`](handoff-rules.md) for the canonical chains.

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
