# Cupping Specialist

**Tier:** Workflow / **Sub-tier:** Executing / **Domain:** Roasting / **Wave:** 3 / **Status:** ACTIVE (Wave 3 PR 3 shipped 2026-05-26)
**ADR origin:** [ADR-0011](../../adr/0011-composable-sub-skills-architecture.md) + [ADR-0012](../../adr/0012-master-coordinator-pattern.md) + [ADR-0013](../../adr/0013-self-improvement-primitives.md)

## Job-to-be-done

Execute Day-7 xBloom cupping evaluation, write cuppings + cup-side experiment patches, identify the V-set leading slot, and route the V-set forward via Path A / Path B / Path C-1 / Path C-2. **Absorbs POD-1's scope** per ADR-0011 sequencing collapse — simulated-pourover-as-3rd-cup-read concept is acknowledged here; full Path C rewrite is gated on lived-practice trigger conditions in [`cluster/pod-1-routing.md`](cluster/pod-1-routing.md).

## Workflow scope

1. **Resolve lot + V_n state.** `get_green_bean` + `get_bean_pipeline`. Build the slot → `roast_id` map from `roast_recipes.batch_slot` joined to `roasts.recipe_id`. Read each V_n recipe's `predicted_cup` (design-time, frozen) AND the V_n experiment's `updated_cup_prediction_a/b/c/d` + `taste_for_a/b/c/d` (post-roast hints written by Roast Recorder).
2. **STAGE 0 pre-rewrite-lot backfill** (when detection fires per `log-cupping.md` STAGE 0). Backfills `roast_recipes.predicted_cup` + `experiments.updated_cup_prediction_*` + `experiments.taste_for_*` from session memory; flag with `was_backfilled: true` + canonical `backfill_notes`. Halt if reconstructability fails (no fabrication).
3. **`push_cupping` per slot.** UPSERTs on `(user_id, roast_id, cupping_date, eval_method, recipe_variant)` with NULLS NOT DISTINCT. Required: `roast_id` (not batch_id), `cupping_date`, `rest_days` (Day 6-10 window; flag drift via `additional_notes` prefix `"REST_DAYS_DRIFT: ..."`), `eval_method` (`"Pourover"` for Day-7 evaluation; `"Cupping"` for legacy Day-4 defect screen).
4. **`recipe_variant` discipline.** Use `"xbloom_gate"` for the mechanically-consistent gate cupping that defines the reference cup; `"real_pourover"` for optimized brew at daily-consumption recipe. When pushing both, distinct labels. When pushing only one and a second is likely later, explicitly label this one (avoid retroactive patching when the second lands).
5. **Snapshot Agtron.** `ground_agtron` paired with the joined `roasts.agtron` → `wb_agtron` snapshot at insert (Schema sprint S1 / migration 055) + `wb_to_ground_delta` generated column. Target ≤3 points; cross-lot deltas now queryable directly.
6. **Push prose.** 10 prose fields: `aroma` / `flavor` / `acidity` / `sweetness` / `body` / `finish` / `overall` / `temperature_behavior` / `aromatic_behavior` / `structural_behavior`. `sweetness` is a distinct axis (Schema sprint S3); `aromatic_behavior` + `structural_behavior` are per-cup observations (Sprint 11 / migration 062 / ADR-0008) — relocated from `roast_learnings` because they describe what a CUP IS, not what a lot taught.
7. **Patch the V_n experiment row** with cup-side closure: `delta_from_cup_a/b/c/d`, refined `observed_outcome_a/b/c/d`, `winner` (strictly formatted `"V<n><letter> (Batch <Roest#>)"` — slot identifier only; verdict prose belongs in `additional_notes` or `key_insight`), `key_insight` + `key_insight_confidence` (Low / Medium / Medium-High / High ladder; promotion-ready content surfaces at the ROASTING.md proposal stage), `what_changes_going_forward` (forward-looking, actionable), `open_questions` (interrogative, what V_n did NOT answer), `additional_notes` (descriptive cross-slot narrative).
8. **Mark `is_reference_candidate`** on the leading-slot roast (Schema sprint S2, migration 056). `true` when the leading slot reads as plausible lot reference even mid-V-set; `false` when "best of the worst" (Fazenda Um V1B is the canonical case). Decoupled from `is_reference` — the candidate flag does NOT auto-flip; Close-Lot Specialist STAGE 2 makes the promotion explicit.
9. **Route forward via Path A / B / C-1 / C-2.** See § Path routing below.

## Path routing (V-set discriminator)

The lot's lifecycle state transition depends on which path fires:

- **Path A — Lot ready for close-out.** Leading slot is lot-level reference candidate AND no control experiment warranted. Cup matches producer-notes ballpark; diminishing returns; brewing-side confirmation. Routes to Brewing Assistant for optimized brew dial-in (cross-domain Chain 1 hop) → Close-Lot Specialist after `push_brew` lands. State: → `resolved_pending`. **Pre-declaration discipline applies** — see § Pre-declaration discipline (Path A push-back duty) below; the Cupping Specialist MUST push back on Path A when the Simulated Pourover Gate comparison hasn't been done.
- **Path B — Design V_(n+1).** Open questions remain; clear lever identified but optimum within it not yet pinned; new variable held constant in V_1…V_n worth probing. Routes to Roasting Assistant for V_(n+1) design. Control experiments (replicating leading slot with two slight adjustments) are still Path B, not Path C. State: → `waiting_for_next_roast`.
- **Path C-1 — Pre-V_(n+1) calibration gate: missing peer-roasted reference cup.** V_n cup landed in plausible zone but no peer-roasted version available to calibrate against; seller or peer has a roasted version. Canonical case: Fazenda Um — Untold sells a roasted version. Halts V_(n+1); state stays `waiting_for_next_cupping` until the peer cup is captured.
- **Simulated Pourover Gate — Pre-reference-roast decision-support cup.** (Renamed from Path C-2 at Item 7 grill, 2026-05-24 — see [CONTEXT-roasting.md § Simulated pourover gate](../../../CONTEXT-roasting.md).) End-of-V-set cup brewed on the real pourover setup (real water, real brewer, real filter) using a non-optimized recipe that's much closer in scope to what the end optimized recipe will be — close enough to give the roast a real shot at expressing the end-state cup, but explicitly NOT going through the full brewing iteration loop because no reference roast is set yet. Purpose: choose the reference roast. Typical cup-set: V_n winner + V_n secondary contender + V_(n-1) winner (the previous V-set's winner as a control baseline). Triggered whenever Chris nears the reference-roast call (typically V3+ when roasting-side optimization hits diminishing returns) OR when the V_n leading slot's identity is provisional via cup-side recipe_variant inversions on prior V-sets. A roast-quality concern (e.g. wide WB-to-ground Agtron delta signaling internal underdevelopment) can also motivate an SPG read in combination — see [`cluster/pod-1-routing.md`](cluster/pod-1-routing.md) § Lived-practice trigger fires for the lived V5 case where roast-quality concern was the motivating factor. Halts V_(n+1); state stays `waiting_for_next_cupping` until the simulated-pourover cup is captured + pushed. **Packet emission (Cluster A, 2026-06-01):** the SPG recipe is NOT designed roasting-side. On SPG kickoff, emit the thin **SIMULATED POUROVER PACKET** (`green_bean_id` + finalist batches + one-line intent) per `log-cupping.md` STAGE 4 for the operator to run in a dedicated `simulated-pourover.md` brewing thread; the SPG cup returns as `cuppings` rows with `eval_method: 'Simulated Pourover'` (one per finalist `roast_id`). Keeping recipe design out of the roasting thread is deliberate context-protection (the brewing-to-roasting handoff brief) and the few-lines-only discipline that keeps this trigger from bloating the roasting thread.

**Path C status — vocabulary rename shipped; substrate-identifier rewrite still gated.** The Item 7 grill (2026-05-24) locked the simulated-pourover-gate vocabulary + reframed Path C-2's purpose per Chris's lived shape. The DRAFT POD-1 scoping work (`docs/sprints/pod-1-scoping-draft-2026-05-26.md`) proposes further consolidating Path C-1 + Simulated Pourover Gate into a unified single-concept Path C when the trigger conditions in [`cluster/pod-1-routing.md`](cluster/pod-1-routing.md) are met. The schema *shape* is resolved and the free-text write convention shipped (Cluster A, 2026-06-01): SPG cups record as `cuppings` rows with `eval_method = 'Simulated Pourover'` today, NOT a `brews.is_simulated_pourover` flag. Only the *canonicalization* (lookup / validation / `cupping_method` taxonomy) + the Path C-1 + Simulated Pourover Gate consolidation remain for the full rewrite — formalization, not enablement.

## Pre-declaration discipline (Path A push-back duty)

Declaring `roasts.is_reference = true` is the **load-bearing cross-domain workflow-transition gate** (see [CONTEXT-roasting.md § Reference roast](../../../CONTEXT-roasting.md)) — it transitions a lot from the roasting-side workflow to the brewing-side workflow, and the operator hands the reference roast into the brewing-side iteration loop to dial in the optimized brew. The declaration is intentionally definite, not ambiguous; the consequences begin downstream as soon as the flag flips. **The Cupping Specialist's job is to make sure the reference call lands on solid ground before the cross-domain transition begins.**

When the operator signals Path A on a V-set lot, push back if any of these pre-conditions are missing:

1. **Multiple V-set iterations.** At least V2 or V3 should be done. Path A on V1 is suspect; the operator hasn't yet explored the lot's lever space.
2. **Full Day 7 xBloom cupping.** `recipe_variant: xbloom_gate` must be on the candidate batch — the canonical mechanically-consistent reference-cup gate.
3. **Simulated Pourover Gate cup-set.** V_n winner + secondary contender + V_(n-1) winner brewed on the real pourover setup (real water, real brewer, real filter) with a non-optimized recipe that's close to the eventual end-state recipe. See [`cluster/pod-1-routing.md`](cluster/pod-1-routing.md) § Cup-set convention.

**Standard push-back language** when SPG hasn't been done:

> "If you really want to declare this a reference roast, I suggest we do a simulated pourover recipe first."

Re-route the V-set to the Simulated Pourover Gate path (cluster/pod-1-routing.md trigger #1 advances toward the unified-path rewrite) and wait for the SPG cup before confirming Path A. Only after the operator has run SPG, compared the cup-set against a couple of contenders, and still wants the designation does the reference call land. At that point, Path A proceeds normally → Brewing Assistant (Chain 1 cross-domain hop) for optimized-brew dial-in → Close-Lot Specialist for the `is_reference = true` patch (via `close-lot.md` STAGE 2) and roast_learnings synthesis.

**One-shot exemption.** One-shot lots are structurally exempt from conditions (1) and (3): single roast by definition (no V-set iteration possible), one cup read at Day 7 (no V-set lineage means no secondary contender or V_(n-1) winner to compare against). The pre-declaration discipline degenerates to "you reached one-shot close-out; designate confidently if the cup is a reasonable expression of the lot." [`one-shot-closeout.md`](../../prompts/one-shot-closeout.md) STAGE 2 sets `is_reference = true` directly without the push-back gate; the Cupping Specialist does not interpose on one-shot Path A.

**Audit signal.** Path A overrides — where the operator declines the push-back and proceeds to close-out without running SPG — should be logged via Pattern H against `coordinator/dispatch-override-log.md` for the future POD-1 follow-up to incorporate.

## STAGE 6 optional ROASTING.md / cluster propose_doc_changes

Post-cupping is the natural moment for ROASTING.md / Roest Knowledge cluster updates — cup signal is the strongest evidence. Route by SHAPE of the insight:

- **Lot-state change** → `### LOT-CODE - Description` sub-section under Active Lots (replace) in ROASTING.md
- **Protocol-level insight** → appropriate Roest Knowledge cluster doc (`skills/roest-knowledge/cluster/protocols/fc-marking.md` / `cluster/machine/counterflow-observations.md#drop-temp-as-the-primary-drop-signal` / Standard Inlet Curve Template at `cluster/protocols/fan-strategy.md#standard-inlet-curve-template`). Between Batch Protocol still in ROASTING.md § Standard Workflow.
- **Cross-coffee pattern** → Roasting Historian's `cluster/patterns/cross-coffee-insights.md` (append with confidence marker matching `key_insight_confidence`)
- **Per-lot FC ceiling calibration** → FC Floor & Ceiling section (append with confidence marker)

Skip when: Simulated Pourover Gate fired (cup-side leading slot is provisional pending the simulated-pourover cup); V_(n+1) imminent and would directly test the insight; `key_insight_confidence` is Low (Low belongs in `additional_notes`, not in cluster docs).

## Inputs

- Day-7 cupping data + roast + cup observations (per batch in V-set)
- [Roasting Historian](../roasting-historian/) cluster — `is_reference_candidate` signal patterns + cross-lot retrospectives
- [Roest Knowledge](../roest-knowledge/) cluster — for protocol-stack signals (silent-FC → bean-temp end condition + Agtron proxy)
- (Future) Brewing Assistant when POD-1's simulated-pourover-recipe-construction lands — see `cluster/pod-1-routing.md`

## Outputs

- `push_cupping` row(s) per cupped batch
- `patch_experiment` writing cup-side closure on V_n
- `patch_roast` setting `is_reference_candidate` on the leading slot
- V-set routing decision: Path A → cross-domain Chain 1 (Brewing Assistant); Path B → Roasting Assistant; Path C-1 / Simulated Pourover Gate → halt with calibration action
- Optional `propose_doc_changes` proposals (multi-citation) targeting ROASTING.md / Roasting Historian / Roest Knowledge clusters

## Called by / Calls

- **Called by:** Master Coordinator (via `log-cupping.md`); Chain 3 mid-stage hop after Day-7 cupping event
- **Calls:** Roasting Historian · Roest Knowledge
- **Hands off to:** Path A → Brewing Assistant (Chain 1 cross-domain); Path B → Roasting Assistant for V_(n+1); Path C-1 → halt (operator-side peer-cup calibration action; re-entry via `log-cupping.md`); Simulated Pourover Gate → Brewing Assistant for simulated-pourover recipe construction on the V_n winner + secondary + V_(n-1) winner (re-entry via `log-cupping.md` once the simulated-pourover cup is captured); future POD-1 rewrite further consolidates Path C-1 + Simulated Pourover Gate into a unified path (cluster/pod-1-routing.md)

## MCP Tools owned

- `push_cupping` — primary write (UPSERT on `(user_id, roast_id, cupping_date, eval_method, recipe_variant)` with NULLS NOT DISTINCT)
- `patch_cupping` — post-push corrections
- `patch_experiment` — cup-side experiment closure (`delta_from_cup_*`, `winner`, `key_insight*`, `what_changes_going_forward`, `open_questions`, `additional_notes`)
- `patch_roast` — `is_reference_candidate` flag on leading slot (decoupled from `is_reference`)
- `propose_doc_changes` — co-owned with arbiter; cup-signal-driven proposals (see STAGE 6 above)

Tool descriptions in `lib/mcp/push-cupping.ts` / `patch-cupping.ts` / `patch-experiment.ts` carry an "Owned by Cupping Specialist per ADR-0011" pointer. (`patch_roast` is co-owned with Roast Recorder; pointer reflects that.)

## Self-improvement

- **Patterns:** A (substrate-event refresh on `push_cupping` events feeding Roasting Historian's per-lot pattern docs) + E (workflow-execution refresh — Path routing accuracy measured against actual lot outcomes; observed routing-decision overrides → Pattern E retro)
- **Stage:** 1 (in-loop). N=10 for Stage 1 → 2 graduation per ADR-0013 outlier rule for substrate-writers.
- **Signal:** POD-1 trigger conditions met in lived practice (see `cluster/pod-1-routing.md`) → Path C-1 / Simulated Pourover Gate substrate revision (unified-path rewrite + cuppings.eval_method canonical addition) via this sub-skill's update path. Observed routing-decision overrides logged via Pattern H against `coordinator/dispatch-override-log.md`.

## Wave 3 PR 3 ship notes (2026-05-26)

- **POD-1 scope absorbed at the SKILL.md level + bookmarked at cluster level.** Per scope decision at PR 3 kickoff: summary inline in this SKILL.md + full POD-1 scoping doc preserved at [`cluster/pod-1-routing.md`](cluster/pod-1-routing.md) with trigger conditions for when the Path C rewrite actually lands. Respects the scoping draft's own "Decision deferred. More cross-thread observation needed" lock — the rewrite waits for lived practice on 2-3 V-set Path A lots + at least one one-shot close-out + the Stefano Um / Bukure / Higuito lots' simulated-pourover decisions.
- **Cluster authored.** This is the only Wave 3 PR 3 sub-skill with a `cluster/` directory — `cluster/pod-1-routing.md` ports the DRAFT scoping content + trigger conditions. Future Path C rewrite + simulated-pourover schema scoping happen in a follow-up sprint, not now.
- **Schema shape RESOLVED + write convention SHIPPED** (Cluster A, 2026-06-01): simulated pourover is a `cuppings` row with `eval_method = 'Simulated Pourover'` (unconstrained free-text, stores today) — the `brews.is_simulated_pourover` flag / thread-context alternatives are closed. What remains for POD-1 is **canonicalization only** (lookup / validation / `cupping_method` taxonomy) — formalization, not enablement. See `cluster/pod-1-routing.md` § Schema scoping.
- **All Knowledge tier dependencies ACTIVE:** Roasting Historian (Wave 2 PR 3) + Roest Knowledge (Wave 3 PR 1). Brewing Assistant (Wave 3 PR 2) reachable for Chain 1 Path A handoff + future POD-1 simulated-pourover Brewing Assistant dispatch.
- **Chain 1 + Chain 3 mid-stage hop ACTIVE.** Cupping Specialist is the named dispatcher for Chain 1 entry (Path A) and the mid-stage closer on Chain 3 (cup-side closure on V_n; routes forward). Promoted in `coordinator/handoff-rules.md` Chains 1 + 3 at PR 3 ship time.
- **Migration source:** `docs/prompts/log-cupping.md` STAGES 1-6 cover the workflow. Sub-skill spec elevates the logic; prompt stays as operator entry surface.
- **PRODUCT.md POD-1 status update:** roadmap entry moves from "parked" → "absorbed into Cupping Specialist; full Path-C rewrite gated on lived-practice trigger conditions per `docs/skills/cupping-specialist/cluster/pod-1-routing.md`."
- **Cross-system audit:** Actor 6 (no schema change Wave 3 PR 3; potential schema additions land in the future POD-1 follow-up), Actor 4 (MCP Resource registration for SKILL.md + cluster/pod-1-routing.md + 4-5 Tool description pointers), Actor 5 (CLAUDE.md notes ACTIVE; PRODUCT.md POD-1 status update), Actor 2 (prompts unchanged), Actor 3 (catalog refresh), Actor 1 (cupping flow streamlined — Master Coordinator dispatch surfaces Path A/B/C routing decisions explicitly).
