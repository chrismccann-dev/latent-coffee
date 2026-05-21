# Handoff Rules

Cross-domain dispatch chains where a single operator workflow spans multiple sub-skills. **Chains are read top-down**: the bracketed sub-skill on the left dispatches the next, with inputs/workflow/output documented per hop.

## Chain status legend

- **ACTIVE** = every hop in the chain has an ACTIVE sub-skill
- **PARTIAL** = some hops are ACTIVE, others are placeholder (chain works for the active hops; placeholder hops degrade to direct prompt dispatch)
- **PLACEHOLDER** = no hops ACTIVE yet

---

## Chain 1: V-set Path A → optimized brew → resolved lot

**Status:** ACTIVE post Wave 3 PR 3 (Cupping Specialist + Brewing Assistant + Brew Recorder + Close-Lot Specialist all ACTIVE).

Today this still lives in `close-lot.md` STAGE 4 as manual paste-by-brew_id-reference at the prompt surface; under the hood, dispatch flows through the chain below. Prompt subsumption is a future cleanup sprint per scope decision 2.

```
Cupping Specialist (executes Day-7 cupping)
   └─ Path A routing: reference roast picked, reference cup data captured
      └─ Dispatch: Brewing Assistant
         └─ Inputs: green_bean_id + reference-roast metadata
         └─ Workflow: optimized brew dial-in (full brewing-project iteration via Phase 1 + Phase 2)
         └─ Output: push_brew with roast_id = best_roast_id (via Brew Recorder)
            └─ Dispatch: Close-Lot Specialist
               └─ Inputs: green_bean_id + reference_brew_id
               └─ Workflow: write roast_learnings + set best_roast_id + verify cross-links
               └─ Output: lot transitions to lifecycle state `resolved`
```

**POD-1 absorption status:** POD-1's scope is absorbed into Cupping Specialist at the SKILL.md level (Wave 3 PR 3) + bookmarked at [`docs/skills/cupping-specialist/cluster/pod-1-routing.md`](../cupping-specialist/cluster/pod-1-routing.md) with trigger conditions for the future Path C rewrite + simulated-pourover schema scoping. The "optimized brew lifecycle states" half stays as DRAFT until lived-practice trigger conditions are met (2-3 V-set Path A lots observed + 1 one-shot close-out + Stefano Um / Bukure / Higuito decisions).

## Chain 2: New research track design

**Status:** ACTIVE-pending-Learning-Knowledge post Wave 3 PR 3 (Learning Assistant + Roasting Assistant + Brewing Assistant + Roast Recorder + Brew Recorder all ACTIVE; Learning Knowledge deferred per ADR-0011 trigger of ≥2 completed research tracks). All authoring hops ACTIVE; the archival hop sits at placeholder by design.

```
Operator: "I want to test water side across my next 5 lots"
   └─ Dispatch: Learning Assistant
      └─ Inputs: hypothesis + inventory + Historians + (CCIL when Wave 4)
      └─ Workflow: research-track design (multi-step protocol across lots)
      └─ Output: track design doc + execution plan
         └─ Each constituent roast: dispatch Roasting Assistant → Roest API Worker → Roast Recorder
            with track-aware metadata for cross-linking
         └─ Each constituent brew: dispatch Brewing Assistant → Brew Recorder
            with track-aware metadata for cross-linking
   └─ Track-completion event: dispatch future Learning Knowledge worker for archival
      (Learning Knowledge deferred per ADR-0011 trigger — ≥2 completed tracks)
```

## Chain 3: New lot intake → roasted batch → cupped batch → next V-set

**Status:** ACTIVE post Wave 3 PR 3 (Roasting Assistant + Roest API Worker + Roast Recorder + Cupping Specialist + Close-Lot Specialist all ACTIVE).

Today this still lives across `start-lot.md` STAGES 1-3 + `log-roast.md` + `log-cupping.md` at the prompt surface; under the hood, each hop dispatches to its named sub-skill:

```
Operator: opens start-lot.md OR describes new lot intake in claude.ai
   └─ Dispatch: Roasting Assistant
      └─ Inputs: lot specs + Roasting Historian + WBC Roasting + Roest Knowledge + Peer-Learning
      └─ Workflow: V1a/V1b/V1c recipe design (or one-shot single-batch design)
      └─ Output: recipe proposal (typed, matching roast_recipes schema, pre-push)
         └─ Dispatch: Roest API Worker
            └─ Inputs: recipe proposal
            └─ Workflow: push profile to Roest L200 Ultra + landing verification
            └─ Output: roast_profile_id + share_url
               └─ [Physical roast happens on Roest]
                  └─ Dispatch: Roast Recorder
                     └─ Inputs: Roest log + batch metrics + per-batch reflections
                     └─ Workflow: push_roast + push_roast_recipe (write to corpus)
                     └─ Output: roasts row + roast_recipes row + lifecycle transitions
                        └─ [Day-7 cupping happens]
                           └─ Dispatch: Cupping Specialist
                              └─ Inputs: Day-7 cupping data + roast + cup observations
                              └─ Workflow: push_cupping + V-set path routing (A/B/C)
                              └─ Output: cuppings row + Path A/B/C routing decision
                                 └─ Path A → Chain 1 (optimized brew dial-in)
                                 └─ Path B → loop back to Roasting Assistant for V_(n+1) design
                                 └─ Path C → Close-Lot Specialist directly (close without reference)
```

## Chain 4: New brew session → optimized brew (single-coffee terminal)

**Status:** ACTIVE post Wave 3 PR 3 (Brewing Assistant + Brew Recorder both ACTIVE).

The single-coffee brewing terminal path — distinct from Chain 1's lot-close-out optimized brew because this fires for any coffee Chris is iterating on, not just self-roasted lots at close-out.

```
Operator: opens start-brew.md OR describes a brew session in claude.ai
   └─ Dispatch: Brewing Assistant
      └─ Phase 1 (recipe construction)
         └─ Inputs: coffee + location + Brewing Historian + WBC Brewing + Brewing Equipment Expert
         └─ Workflow: pick strategy + modifiers + dose + water + grinder + grind setting + temp + pour structure
         └─ Output: starting recipe
      └─ Phase 2 (in-thread iteration; absorbs Palate Evaluator)
         └─ Inputs: operator's audio tasting notes per iteration
         └─ Workflow: refine recipe based on what was tasted; maintain session arc context
         └─ Output: refined recipe (repeats until operator declares optimized)
      └─ Phase 3 (handoff)
         └─ Dispatch: Brew Recorder
            └─ Inputs: final optimized recipe + tasting outcome
            └─ Workflow: push_brew (the per-coffee terminal write — intermediate iterations not persisted)
            └─ Output: brews row
```

## Chain 5: Sourcing opportunity evaluation (single-step)

**Status:** ACTIVE post Wave 3 PR 2 (Sourcing Workflow Planner is the only sub-skill in this chain).

```
Operator: "Importer offered me a Tier 2 Gesha sample — should I buy?"
   └─ Dispatch: Sourcing Workflow Planner
      └─ Inputs: opportunity details + WBC Roasting Archivist § sourcing/ + current inventory
                 + Roasting Historian closed-lot lane retros
      └─ Workflow: lane-fit assessment + portfolio-gap analysis + lane-performance reference
      └─ Output: buy / hold / pass + lane assignment + rationale prose
         └─ [Physical buy decision happens — operator-side, off-platform]
            └─ [If buy + lot arrives:] dispatch Chain 3 starting at new lot intake
```

Single-step chain; no downstream substrate-writer hop because sourcing decisions are physical-world events. The substrate write happens later via Chain 3 when the lot physically arrives.

## Chain 6: Cross-pollination Wölfl-design brew (future)

**Status:** PLACEHOLDER (not yet sub-skill-decomposed; PRODUCT.md Future Directions item).

Future handoff chain TBD. Likely shape: Learning Assistant proposes the cross-pollination experiment → Roasting Assistant designs the roast targeting the brew partner → Chain 3 + Chain 4 execute → CCIL synthesizes the cross-domain outcome.

---

## Wave status

- **Wave 1:** No cross-domain chains ACTIVE — only Brewing Equipment Expert + Master Coordinator shipped, both single-domain.
- **Wave 2:** Knowledge tier consolidation — no new chains introduced; chains were pre-authored anticipating Wave 3.
- **Wave 3 PR 1:** No chain changes — operator-stub Knowledge pair + Roasting Historian R-to-B Translation extension.
- **Wave 3 PR 2:** 4 Workflow Planning sub-skills ACTIVE → Chains 1, 2, 3, 4 move from PLACEHOLDER to PARTIAL; Chain 5 moves to ACTIVE (single-step).
- **Wave 3 PR 3:** 5 Workflow Executing sub-skills ACTIVE → Chains 1, 3, 4 move from PARTIAL to ACTIVE; Chain 2 moves to ACTIVE-pending-Learning-Knowledge (archival hop deferred per ADR-0011 trigger of ≥2 completed research tracks). **Wave 3 closed.**
- **Wave 4:** Chain 6 (Wölfl cross-pollination) likely activates after CCIL ships.

## Discipline

When a new cross-domain workflow surfaces in lived practice that isn't covered by an existing chain, add it here as a new section. Same PR that introduces the workflow must update this file.

If two chains have ambiguous routing for the same operator intent, log it as a Pattern H override event in `dispatch-override-log.md` and resolve via dispatch-rule patch.
