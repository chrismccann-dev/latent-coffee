# Roast Recorder

**Tier:** Workflow / **Sub-tier:** Executing / **Domain:** Roasting / **Wave:** 3 / **Status:** ACTIVE (Wave 3 PR 3 shipped 2026-05-26)
**ADR origin:** [ADR-0011](../../adr/0011-composable-sub-skills-architecture.md) + [ADR-0012](../../adr/0012-master-coordinator-pattern.md) + [ADR-0013](../../adr/0013-self-improvement-primitives.md)

## Job-to-be-done

Write per-batch roast execution to substrate after the physical roast completes. Owns `push_roast` + `push_roast_recipe` (when the recipe wasn't pre-pushed by Roasting Assistant) + `patch_roast` for corrections. Reads Roest log + per-batch operator reflections, validates payload against Roest Knowledge + Roasting Historian, then writes.

## Workflow scope

1. **Resolve lot + V_n state.** `get_green_bean({lot_id})` → `green_bean_id`. `get_bean_pipeline({green_bean_id})` → full pipeline read for the slot→recipe_id map (see § Slot-to-recipe map handling).
2. **Read Roest logs** for the just-roasted batches via `list_roest_logs` + `pull_roest_log`. Capture FC start / FC temp / drop time / drop temp / dev time / Agtron / end-condition / roast profile name.
3. **Operator-override check.** If `end_condition_target` (profile-set drop trigger) and `drop_temp` (actual machine drop) diverge by more than ~0.5°C / a couple seconds and the divergence isn't explainable by Roest behavior, confirm whether the operator manually pulled the drop; override `end_condition_type: "manual"` if so.
4. **`fc_audibility` enum (Sprint 11 RO-CP-3).** Per batch: `audible` / `subtle` / `silent` / `ambiguous`. Three of four (subtle / silent / ambiguous) trigger the same downstream protocol (bean-temp end condition + drop-ceiling-primary + Agtron proxies). See `cluster/protocols/fc-marking.md` in Roest Knowledge for the protocol stack.
5. **`push_roast` per slot.** UPSERTs on `(user_id, green_bean_id, batch_id)`. Required FK: `recipe_id` linking to the matching `roast_recipes` row (without it, ResolvedView can't render "intended vs achieved"). Prose fields are this sub-skill's synthesis, not operator-supplied: `what_worked` / `what_didnt` / `what_to_change`. Set `worth_repeating` to `"yes"` / `"no"` / `"pending"` (the conditional "yes at roast level, waiting on cup" case). `is_reference: false` always — reference designation is Close-Lot Specialist's concern.
6. **`patch_roast_recipe`** for Roest profile linkage if not already populated at design time: `roest_profile_id` / `roest_share_url` / `roest_profile_name` / `pushed_to_roest_at`.
7. **Cross-validate** the structural-roast observations against Roasting Historian's similar-lot patterns (FK-seeded by-cultivar / by-process stubs today; `scope_tags`-driven query once arrays populate). Surface "this slot's drop curve diverges from typical washed Gesha closed-lot pattern" kind of signal in the prose fields, not as a separate write.

## Slot-to-recipe map handling

Three paths to resolve the V_n slot → `roast_recipes.id` map. Same logic as `docs/prompts/log-roast.md` STAGE 1; the executor takes ownership of the discipline:

- **(a) Pre-rewrite-lot fallback.** Pre-PR-#157 lots have `roast_recipes` rows with `batch_slot IS NULL` and `experiment_id IS NULL`. Infer slot from `roest_profile_name` regex (`<LOT-PREFIX> - v<n><letter>` or `<LOT-PREFIX> v<n><letter>`). Patch the recipe row with `batch_slot` + `experiment_id` so future passes use the direct map.
- **(b) Missing-recipe-row inline backfill.** If no `roast_recipes` rows exist for V_n at all AND design intent is reconstructable from session memory, `push_roast_recipe` per slot with `was_backfilled: true` + `backfill_notes: "Recovered from session chat memory at Roast Recorder STAGE 1(b), YYYY-MM-DD"` (Schema sprint S4, migration 057). Reconstruct curves from session-memory + Roest tablet artifacts; leave genuinely unknowable predictions NULL (do not fabricate).
- **(c) Halt if neither (a) nor (b) applies.** Pushing roasts without design-intent linkage breaks ResolvedView. Report which slot is unreconstructable; ask operator for missing context.

## Inputs

- Operator-provided batch metrics (start/end weight, color, bag label) + per-batch reflections
- Roest log (via `pull_roest_log` or operator-pasted screenshot)
- [Roest Knowledge](../roest-knowledge/) cluster — for log interpretation, FC audibility protocol, drop-temp signals, evaluation discipline
- [Roasting Historian](../roasting-historian/) cluster — for retrospective comparison ("how did this slot compare to similar prior lots?")

## Outputs

- `push_roast` row(s) in `roasts` table (one per slot, UPSERT on `(user_id, green_bean_id, batch_id)`)
- `push_roast_recipe` row(s) when fallback (b) fired
- `patch_roast_recipe` row(s) for Roest profile linkage
- Optional `patch_roast` corrections post-push
- Side effects: `lifecycle-state.ts` flips lot from `waiting_for_next_roast` → `waiting_for_next_cupping` (computed, not written)

## Called by / Calls

- **Called by:** Master Coordinator (via `log-roast.md`); Chain 3 hop after Roest API Worker + physical roast event
- **Calls:** Roest Knowledge · Roasting Historian
- **Hands off to:** Cupping Specialist (Day-7 cupping captures cup-side closure on V_n; experiment row's `observed_outcome_*` + `updated_cup_prediction_*` + `taste_for_*` already written by this sub-skill's STAGE 5 in the prompt walkthrough lives in the calling prompt logic for now)

## MCP Tools owned

- `push_roast` — primary write (UPSERT on `(user_id, green_bean_id, batch_id)`)
- `push_roast_recipe` — fallback (b) inline backfill only
- `patch_roast` — post-push corrections (the `is_reference_candidate` flag on V-set leading slot at log-cupping time lives in Cupping Specialist's scope, not here)
- `patch_roast_recipe` — Roest profile linkage post-roast
- `pull_roest_log` — read-side dependency, not a write

Tool descriptions in `lib/mcp/push-roast.ts` / `push-roast-recipe.ts` / `patch-roast.ts` / `patch-roast-recipe.ts` carry an "Owned by Roast Recorder per ADR-0011" pointer (Wave 3 PR 3 ship discipline).

## Self-improvement

- **Patterns:** A (substrate-event refresh — new substrate column lands, e.g. `fc_audibility` Sprint 11, recording interface refreshes to surface it during the next push)
- **Stage:** 1 (in-loop). Per ADR-0013, substrate-writing executors stay at Stage 1 longer; N=10 consecutive auto-approvals required for Stage 1 → 2 graduation (vs. N=5 default) because writes are irreversible.
- **Signal:** new column appears in `push_roast` / `push_roast_recipe` Zod schemas → SKILL.md updates to surface the new field's recording discipline. The `fc_audibility` Sprint 11 lift + Schema sprint S2's `is_reference_candidate` add are the textbook precedents.

## Wave 3 PR 3 ship notes (2026-05-26)

- **No cluster authored.** Per scope decision (mirrored from PR 2's planner pattern), executors ship SKILL.md only. Cluster materializes later under Pattern F if templates / validation rules / error patterns accrue across lived use.
- **Prompts unchanged.** `docs/prompts/log-roast.md` continues as the claude.ai entry surface; Roast Recorder is the canonical fetch target Master Coordinator dispatches to. Prompt subsumption / deprecation is deferred to a future cleanup sprint once sub-skills are exercised in lived practice ≥3 times.
- **All Knowledge tier dependencies ACTIVE:** Roest Knowledge (Wave 3 PR 1) + Roasting Historian (Wave 2 PR 3).
- **Chain 3 hop ACTIVE.** Roasting Assistant → Roest API Worker → physical roast → **Roast Recorder** → Cupping Specialist (after Day-7 cupping). Promoted PARTIAL → ACTIVE in `coordinator/handoff-rules.md` Chain 3 at PR 3 ship time per Chain promotion scope decision.
- **Migration source:** `docs/prompts/log-roast.md` STAGES 1-5 cover the recording workflow. Sub-skill spec elevates the logic; prompt stays as operator entry surface.
- **Cross-system audit:** Actor 6 (no schema change), Actor 4 (MCP Resource registration for SKILL.md + 4 Tool description pointers), Actor 5 (CLAUDE.md sub-skills section notes ACTIVE), Actor 2 (prompts unchanged), Actor 3 (catalog refresh on next session), Actor 1 (logging flow unchanged in feel; structured underneath via dispatch).
