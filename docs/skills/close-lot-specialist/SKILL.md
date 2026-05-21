# Close-Lot Specialist

**Tier:** Workflow / **Sub-tier:** Executing / **Domain:** Roasting / **Wave:** 3 / **Status:** ACTIVE (Wave 3 PR 3 shipped 2026-05-26)
**ADR origin:** [ADR-0011](../../adr/0011-composable-sub-skills-architecture.md) + [ADR-0012](../../adr/0012-master-coordinator-pattern.md) + [ADR-0013](../../adr/0013-self-improvement-primitives.md)

## Job-to-be-done

**Resolved-lot completion gate.** Verify reference roast + reference cup + optimized brew + roast_learnings all landed AND cross-linked. Write the final `push_roast_learnings` row + set `best_roast_id` (typed FK) + flip `is_reference` on the reference roast + archive Roest inventory. Owns `push_roast_learnings` + `patch_roast_learnings` + the final-pass cross-link verification.

Two flavors of lot close-out:

- **V-set close-out** (`close-lot.md`) — multi-V-set lot; reference roast picked from a winning V-set leading slot; full carry-forward learnings (cultivar / terroir / general / starting_hypothesis with scope_tags).
- **One-shot close-out** (`one-shot-closeout.md`) — single-batch lot (`green_beans.is_one_shot = true`); 7 lever-attribution fields rejected by schema validation (migration 054); `"Low confidence - N=1"` prefix on carry-forward prose; Outcome A (reference-quality) vs Outcome B ("Closed without reference" via `why_this_roast_won: NULL`) routing.

## Workflow scope

1. **Resolve lot + verify Resolved-pending state.** `get_green_bean` + `get_bean_pipeline`. Verify:
   - At least one experiment has non-null `winner` (V-set close-out) OR `is_one_shot: true` + Day-7 cupping captured (one-shot close-out)
   - Named reference roast is in `roasts[]` with `recipe_id` FK linkage
   - `roast_learnings` row does NOT yet exist (or exists incomplete — both UPSERT-safe on `(user_id, green_bean_id)`)
2. **Mark the reference roast (STAGE 2).** `patch_roast(roast_id, is_reference: true, worth_repeating: "yes" | "no")`. The `is_reference_candidate` flag set during V-set iteration does NOT auto-flip — this STAGE 2 patch is the explicit promotion. **For one-shots: `is_reference: true` is set unconditionally regardless of Outcome A/B** (the resolved-view's reference-roast slot has to render something; the A/B distinction lives on `worth_repeating` + `why_this_roast_won`, not on `is_reference`).
3. **Write the per-lot `roast_learnings` row.** `push_roast_learnings(payload)`. UPSERTs on `(user_id, green_bean_id)`. See § Carry-forward field discipline below.
4. **Push the optimized brew.** `push_brew` with `source: "self-roasted"` + `green_bean_id` + `roast_id` (reference roast). Apply canonical-validation discipline from Brew Recorder. **Co-ownership with Brew Recorder:** the `push_brew` call here is delegated to Brew Recorder when the close-out arrives via Chain 1 (Brewing Assistant → Brew Recorder → Close-Lot Specialist); when the operator paste-references an existing `brew_id`, Close-Lot Specialist just verifies the FK cross-link, no new push.
5. **STAGE 5 propose_doc_changes.** ROASTING.md close-out narrative — Active Lots § removal + Recently Closed Lots § append + protocol-cluster updates (Roest Knowledge `cluster/protocols/*.md` when applicable) + Roasting Historian cluster (cross-coffee insights / per-lot learnings file). Multi-citation single proposal. Drift detection: live doc disagreement with observed DB state → `replace` citation that updates doc to match observed reality.
6. **STAGE 6 archive Roest inventory.** `patch_inventory({roest_inventory_id, is_archived: true})` so the tablet picker hides the lot from the active inventory list. Skip if lot was never on Roest (rare).
7. **Cross-link verification.** Final integrity check before lifecycle flip:
   - `roasts.is_reference = true` on the reference roast row
   - `roast_learnings.best_roast_id` matches that reference roast UUID (typed FK)
   - `roast_learnings.best_batch_id` matches the legacy text batch number (back-compat)
   - At least one `cuppings` row exists on `best_roast_id` with `eval_method ILIKE '%pourover%'` (reference cup)
   - At least one `brews` row exists with `green_bean_id` set; ideally `roast_id = best_roast_id` (optimized brew FK match)
   - Surface any missing link for operator to address before declaring lot resolved

## Carry-forward field discipline

`push_roast_learnings` is the **compounding-knowledge primitive** — future `start-lot.md` / `one-shot.md` STAGE 1 carry-forward search consumes these fields when designing the next lot of overlapping cultivar / terroir / process.

### V-set close-out fields

**Required FK:**
- `green_bean_id`
- `best_roast_id` (typed FK, Sub Pages 6.1)
- `best_batch_id` (legacy text, back-compat through Phase 3)

**Reference-roast explainer:**
- `why_this_roast_won` — 3-6 sentences. Cite specific roast measurements (FC time/temp, drop temp, Agtron, WB→Gnd delta) AND specific cup descriptors. Distinguish "won the V-set comparison" from "is the lot-level reference." NULL is reserved for "Closed without reference" — see one-shot Outcome B below.

**Roasted bean characteristic (3 attributes per CONTEXT.md):**
- `primary_lever` — single variable that mattered most for this lot
- `secondary_levers` — smaller-impact levers that still moved the cup
- `roast_window_width` — `"Narrow"` / `"Moderate"` / `"Wide"` — acceptable roast window for the primary lever
- `brewing_tolerance` — how well the cup holds up across brewing extremes (renamed from `elasticity` Sprint 10 / migration 060 per ADR-0007)

**Variable post-hoc promotions:**
- `what_didnt_move_needle` — variables tested across V-sets that produced no clear cup effect (non-factors)

**Cup-side diagnostic signals (cup-first + labeled-roast-correlate pattern, Sprint 11 RO-5):**
- `underdevelopment_signal` — what underdev TASTED like for this lot; optionally append a roast-side correlate framed explicitly (e.g. "Agtron WB above 77, ground above 74")
- `overdevelopment_signal` — same shape, cup-side mirror

**Lot-level rest behavior:**
- `rest_behavior` — three-thread content scope (Day-4/7/10 evolution + cross-cup vehicle + storage observations). 3/7 closed lots populate (43%).

**Carry-forward learnings (with paired `*_scope_tags` Sprint 12 / migration 064 / ADR-0009):**
- `cultivar_takeaway` + `cultivar_takeaway_scope_tags` — within-cultivar accession + process-modifier sub-scoping
- `terroir_takeaway` + `terroir_takeaway_scope_tags` — country / admin region / macro terroir sub-scoping
- `general_takeaway` + `general_takeaway_scope_tags` — most likely to need explicit tagging; "general" prose drifts across scopes
- `starting_hypothesis` + `starting_hypothesis_scope_tags` — most actionable for future similar-lot search
- `reference_roasts` — string list of batches for replication / comparison

Scope tags use loose-canonical namespaced prefixes (`process:washed` / `variety:sudan-rume` / `country:colombia` / `altitude:high` / `evaluation_method:day-7-pourover` / etc.; `general` catch-all for genuinely universal principles). Loose-canonical = prompts describe vocabulary; write paths do NOT enforce.

### One-shot close-out fields (Outcome A vs B)

**Schema-rejected fields (migration 054, when `green_beans.is_one_shot: true`):**
- `primary_lever`, `secondary_levers`, `roast_window_width`, `brewing_tolerance`, `what_didnt_move_needle`, `underdevelopment_signal`, `overdevelopment_signal` — all MUST be NULL; schema validation rejects with specific error messages. These fields require cross-batch evidence.

**Allowed and recommended:**
- `best_roast_id` + `best_batch_id` — single batch IS the reference (Outcome A) or only roast (Outcome B); either way it's the row ResolvedView renders
- `why_this_roast_won` — Outcome A: verdict prose. Outcome B: **explicitly NULL** (the Sprint 3.2 #18 "Closed without reference" sub-card on ResolvedView triggers on this field being NULL, NOT on `is_reference: false`)
- Carry-forward 4 fields (`cultivar_takeaway` / `terroir_takeaway` / `general_takeaway` / `starting_hypothesis`) — prefix with `"Low confidence - N=1, verify on next similar lot. "`. **Tag aggressively** via `*_scope_tags` — the structured scope is what compensates for the single-observation confidence floor.

## Inputs

- `green_bean_id` + `reference_brew_id` (from upstream Brewing Assistant → Brew Recorder cross-domain Chain 1 handoff) OR operator paste with the values inline
- All per-lot substrate state (read across `roasts` + `cuppings` + `experiments` + `brews` + `roast_recipes` + `roest_inventory`)
- [Roasting Historian](../roasting-historian/) cluster — `why_this_roast_won` verdict + per-lot character + carry-forward field discipline; close-out triggers Pattern A refresh into Historian's `cluster/learnings/<lot>.md`

## Outputs

- `push_roast_learnings` row in `roast_learnings` table (UPSERTs on `(user_id, green_bean_id)`)
- `patch_roast` setting `is_reference: true` + `worth_repeating` on the reference roast
- `patch_inventory` archiving the Roest inventory row
- Optional `push_brew` (when Chain 1 routes the optimized brew through this sub-skill instead of Brew Recorder)
- `propose_doc_changes` multi-citation proposal — ROASTING.md close-out narrative + Roasting Historian cluster updates + Roest Knowledge protocol-cluster updates when applicable
- Cross-link verification report — logs any missing FK links for operator to address
- Side effect: lifecycle state flips to `resolved` (computed in `lib/lifecycle-state.ts` once `roast_learnings` row exists)

## Called by / Calls

- **Called by:** Master Coordinator (via `close-lot.md` for V-sets, `one-shot-closeout.md` for one-shots); Chain 1 terminal hop after Brew Recorder writes the optimized brew (cross-domain handoff from Brewing Assistant); Chain 3 Path C close-without-reference terminal hop
- **Calls:** Roasting Historian (verdict synthesis discipline + carry-forward field shape); Brew Recorder (when Chain 1 routes the optimized brew through this sub-skill rather than directly through Brew Recorder)

## MCP Tools owned

- `push_roast_learnings` — primary write
- `patch_roast_learnings` — post-push corrections
- `patch_roast` — `is_reference: true` + `worth_repeating` on reference roast (co-owned with Roast Recorder + Cupping Specialist)
- `patch_inventory` — Roest inventory archive
- `propose_doc_changes` — co-owned with arbiter; close-out narrative proposals (multi-citation)
- Read-only access across `roasts` / `cuppings` / `experiments` / `brews` / `roast_recipes` / `roest_inventory` for verification

Tool descriptions in `lib/mcp/push-roast-learnings.ts` / `patch-roast-learnings.ts` / `patch-inventory.ts` carry an "Owned by Close-Lot Specialist per ADR-0011" pointer.

## Self-improvement

- **Patterns:** A (substrate-event refresh — each resolved-lot completion → Roasting Historian's `cluster/learnings/<lot>.md` refresh + cross-lot pattern updates in `cluster/patterns/cross-coffee-insights.md` via Pattern A flow)
- **Stage:** 1 (in-loop). N=10 for Stage 1 → 2 graduation per ADR-0013 outlier rule for substrate-writers. Lot-completion writes are particularly load-bearing — they trigger downstream Pattern A on multiple Historian cluster files.
- **Signal:** each resolved-lot completion → verify cross-links + trigger Roasting Historian refresh proposal via `propose_doc_changes`. Stage graduation gated on N=10 consecutive auto-approvals of the cross-link verification AND the carry-forward field discipline AND the close-out proposal application.

## Wave 3 PR 3 ship notes (2026-05-26)

- **No cluster authored.** SKILL.md only per PR 2/3 precedent. Future `cluster/validation-rules.md` if cross-link verification logic accrues across lived use.
- **One-shot handling first-class.** The 7-field lever-attribution rejection (migration 054) + Outcome A/B routing live in this SKILL.md, not in a separate sub-skill. Same executor; bifurcated payload discipline.
- **All Knowledge tier dependencies ACTIVE:** Roasting Historian (Wave 2 PR 3).
- **Chain 1 + Chain 3 terminal hop ACTIVE.** Chain 1: Cupping Specialist Path A → Brewing Assistant → Brew Recorder → **Close-Lot Specialist** for resolved-lot completion. Chain 3 Path C: Cupping Specialist → **Close-Lot Specialist** directly (close without reference). Promoted in `coordinator/handoff-rules.md` Chains 1 + 3 at PR 3 ship time.
- **Migration source:** `docs/prompts/close-lot.md` STAGES 1-7 (V-set) + `docs/prompts/one-shot-closeout.md` STAGES 1-7 (one-shot) cover the completion workflow. Sub-skill spec elevates both; prompts stay as operator entry surface.
- **Cross-system audit:** Actor 6 (no schema change), Actor 4 (MCP Resource registration + 4 Tool description pointers — `push_roast_learnings` / `patch_roast_learnings` / `patch_inventory` + `patch_roast` co-ownership pointer), Actor 5 (CLAUDE.md notes ACTIVE; PRODUCT.md Wave 3 closed if PR 3 is the last Wave 3 PR), Actor 2 (close-lot.md + one-shot-closeout.md unchanged otherwise), Actor 3 (catalog refresh), Actor 1 (operator's lot-closure flow streamlined — verification gates surface missing cross-links automatically).
