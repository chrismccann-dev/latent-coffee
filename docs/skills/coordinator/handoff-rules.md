# Handoff Rules

Cross-domain dispatch chains where a single operator workflow spans multiple sub-skills.

## Canonical chains (Wave 3+ — when constituent sub-skills ship)

### Chain 1: V-set Path A → optimized brew → resolved lot

Today this lives in `close-lot.md` STAGE 4 as manual paste-by-brew_id-reference. Once Cupping Specialist + Brewing Assistant + Close-Lot Specialist ship in Wave 3, this becomes an explicit dispatch path:

```
Cupping Specialist (executes Day-7 cupping)
   └─ Path A routing: reference roast picked, reference cup data captured
      └─ Dispatch: Brewing Assistant
         └─ Inputs: green_bean_id + reference-roast metadata
         └─ Workflow: optimized brew dial-in (full brewing-project iteration)
         └─ Output: push_brew with roast_id = best_roast_id
            └─ Dispatch: Close-Lot Specialist
               └─ Inputs: green_bean_id + reference_brew_id
               └─ Workflow: write roast_learnings + set best_roast_id + verify cross-links
               └─ Output: lot transitions to lifecycle state `resolved`
```

**POD-1 resolution lands here.** The "optimized brew lifecycle states" half of POD-1's scoping draft (`docs/sprints/pod-1-scoping-draft-2026-05-26.md`) becomes this chain's explicit phases.

### Chain 2: New research track design

```
Operator: "I want to test water side across my next 5 lots"
   └─ Dispatch: Learning Assistant
      └─ Inputs: hypothesis + inventory + Historians + CCIL context
      └─ Workflow: research-track design (multi-step protocol across lots)
      └─ Output: track design doc + execution plan
         └─ Each constituent roast: dispatch normal Roasting Assistant + Roast Recorder chain
            with track-aware metadata for cross-linking
         └─ Each constituent brew: dispatch normal Brewing Assistant + Brew Recorder chain
            with track-aware metadata for cross-linking
   └─ Track-completion event: dispatch future Learning Knowledge worker for archival
```

### Chain 3: Cross-pollination Wölfl-design brew (future)

PRODUCT.md Future Directions item. Not yet sub-skill-decomposed; future handoff chain TBD.

## Wave 1 status

No cross-domain chains active yet — Wave 1 only ships Master Coordinator + Brewing Equipment Expert, both within single-domain dispatch. Cross-domain chains activate as Wave 3 sub-skills (Cupping Specialist, Brewing Assistant, Close-Lot Specialist) ship.

## Discipline

When a new cross-domain workflow surfaces in lived practice that isn't covered by an existing chain, add it here as a new section. Same PR that introduces the workflow must update this file.

If two chains have ambiguous routing for the same operator intent, log it as a Pattern H override event in `dispatch-override-log.md` and resolve via dispatch-rule patch.
