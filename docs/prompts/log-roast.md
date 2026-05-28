**State transition**: Waiting for next roast → Waiting for next cupping.

**Trigger**: I just roasted V_n at the machine and have the Roest logs in hand. I'll paste the per-slot data + photos of the roast curves below this message. Your job: record what actually happened, compute the roast-side deltas, update the cup prediction now that we've seen the actuals, and prep the taste-for hints for the Day 7 cupping table.

**Workflow position**: Second of four lifecycle prompts (`start-lot.md` → **`log-roast.md`** ⇄ `log-cupping.md` → `close-lot.md`). This one runs once per V-set, immediately after the roasting session.

Vocabulary used in this prompt is defined in CONTEXT-roasting.md (V-set, batch slot, taste-for, roast→cup trace, variable / lever / non-factor). The taste-for field is *not* a cup prediction - it's a directional listening hint with three reference points (producer notes / prior V-set memory / specific adjustment being tested).

## Tools for this session

`get_green_bean`, `get_bean_pipeline`, `list_roest_logs`, `pull_roest_log`,
`push_roast`, `patch_roast`, `push_roast_recipe`, `patch_roast_recipe`,
`push_experiment`, `patch_experiment`, `read_doc`, `read_doc_section`,
`list_doc_sections`, `read_canonical`, `propose_doc_changes`.

MCP namespace: tools surface under `Latent Coffee`.

## Routing

I'll reference the lot by `lot_id` or `green_bean_id` + tell you which V-set just finished (e.g. "V3 on Higuito done, batches 152/153/154"). Pull the V_n design intent from `get_bean_pipeline` and use the slot ↔ batch_id linkage from the matching `roast_recipes` rows.

## STAGE 1 - Resolve bean + V_n state, baseline pipeline

**This STAGE writes**: read-only by default. **STAGE 1(b) inline backfill writes substantively when it fires**: 1 `experiments` row (when the V_n experiment row doesn't exist — e.g. when V_n profiles were pushed to Roest via `push_roast_profile` in a prior session but `push_experiment` was never called) + N `roast_recipes` rows (one per slot). Treat 1(b) as a distinct write phase even though it lives under STAGE 1.

- `get_green_bean({lot_id})` → returns `green_bean_id`.
- `get_bean_pipeline({green_bean_id})` → returns `green_bean`, `roasts[]`, `cuppings[]`, `experiments[]`, `roast_learnings`, `brews[]`, `roast_recipes[]`.
- Identify the V_n `experiment` row (most recent by `created_at` matching `<LOT-PREFIX>-V<n>`). Its `roast_recipes[]` (filtered by `experiment_id` matching the experiment_pk) are the design-intent rows authored by `start-lot.md` or `log-cupping.md` (forward-design step from V_(n-1) → V_n).
- Build the slot → recipe_id map: `v<n>a` → recipe_id, `v<n>b` → recipe_id, etc., keyed on `roast_recipes.batch_slot`.
- Compare project-doc / paste-in claims against existing DB state (intake-drift detection). Flag any divergence.

### (a) Pre-rewrite-lot `batch_slot` fallback

Pre-rewrite lots (V-sets authored before PR #157) have `roast_recipes` rows with `batch_slot IS NULL` and `experiment_id IS NULL`. The slot → recipe_id map can't be built directly.

Fallback: infer the slot from `roast_recipes.roest_profile_name` (or `roast_recipes.recipe_name`) matching the V-set / slot pattern. The Roest profile name carries the slot tag explicitly. Patterns the regex should accept:

- `<LOT-PREFIX> - v<n><letter>` (canonical post-rewrite format: `"Higuito - v3a"`)
- `<LOT-PREFIX> v<n><letter>` (pre-rewrite, no hyphen: `"Higuito v3a"`)
- `... v<n><letter> ...` (slot tag anywhere in the name: `"Higuito Test v3a 2026-05-09"`)

Where `<letter>` ∈ `{a, b, c, d}`. Case-insensitive on `v` and the letter.

When the fallback fires, **also** `patch_roast_recipe(recipe_id, batch_slot: "v<n><letter>", experiment_id: <V_n experiment_pk>)` so future passes can use the direct map without re-running the fallback. One patch per recipe row. The fallback is opportunistic, not blocking — proceed to STAGE 2 once the map is built.

### (b) Missing-recipe-row halt relaxation

If the slot → recipe_id map is empty (no `roast_recipes` rows exist for the V_n experiment at all) **and** the design intent is reconstructable from session memory (the conversation in front of you contains the design-time hypothesis Chris and I framed before the roast), inline-backfill the recipe rows before proceeding. Specifically:

- `push_roast_recipe(payload)` × N for each V_n slot. Fill the curve fields (`temperature_bezier` / `fan_bezier` / `rpm_bezier`) from the design-time discussion + any Roest tablet artifacts Chris pasted. Design-time predictions (`predicted_fc_temp` / `predicted_fc_time` / `predicted_total_time` / `predicted_maillard_pct` / `predicted_agtron_wb` / `predicted_cup`) get reconstructed from session memory; if a field is genuinely unknown (e.g. Chris doesn't recall what we predicted Agtron WB would be), leave NULL — do NOT fabricate.
- Set `batch_slot`, `experiment_id`, `recipe_name`, `rationale`, `end_condition_type`, `end_condition_target`, `charge_temp`, `hopper_load_temp`, `preheat_temperature_c` on each.
- Drop rules (`drop_rule_if_fast` / `drop_rule_if_slow`) when documented.
- **Always set `was_backfilled: true` + `backfill_notes: "Recovered from session chat memory at log-roast.md STAGE 1(b), YYYY-MM-DD"`** (Schema sprint S4, migration 057, 2026-05-18) — these recipe rows are being reconstructed post-roast, not authored at design time. Distinguishes them from forward-design pushes via `push_roast_recipe` at V_n design time (which leave `was_backfilled` default false).

If the design intent is NOT reconstructable from session memory (the lot was V'd in a project-doc thread that's since rolled off, no Roest tablet artifact pasted in, Chris doesn't remember the per-slot rationale), THEN halt and report — pushing roasts without design-intent linkage breaks the resolved-view's "intended vs achieved" render.

Whichever way recipe rows landed (already present / fallback fired / inline backfill), the slot → recipe_id map must be complete before STAGE 2.

## STAGE 2 - Pull the Roest logs for the slots Chris just roasted

**This STAGE writes**: nothing (read-only).

For each slot in V_n:

- `list_roest_logs({inventory_id})` to find the just-recorded batch numbers. Compare against `existing_batch_ids` from STAGE 1 - the new ones are the V_n roasts.
- `pull_roest_log(log_id)` returns a normalized `push_roast`-shaped payload. Capture fc_start / fc_temp / drop_time / drop_temp / dev_time_s / agtron / end_condition_type / end_condition_target / roast_profile_name.
- Notes:
  - `hopper_load_temp` comes back as null from Roest - the API doesn't expose the bean-probe hopper-load reading. Set manually from session memory (V4 standard: 125°C).
  - `end_condition_type` + `end_condition_target` now come back populated directly from the Roest API (Round-7 capability confirmed 2026-05-14). Use these as ground truth.
  - **Operator-override check**: if `end_condition_target` (profile-set drop trigger) and `drop_temp` (where the machine actually dropped) diverge by more than ~0.5°C / a couple seconds AND the divergence isn't explained by Roest behavior (ceiling breach from session-position acceleration, dev-time timer firing slightly early/late), ASK whether the operator manually pulled the drop. If yes, override `end_condition_type: "manual"` on the push_roast payload regardless of what the profile encoded.
  - **Drop-rule deterministic case (Round 14, 2026-05-23) — skip the ask when the drop matches a written rule**: if the divergence (drop_temp + drop_time) matches the recipe's `drop_rule_if_fast` or `drop_rule_if_slow` text exactly (e.g. rule says "if 4:45 elapses without BEAN_TEMP 207°C, manual-drop at 4:45" and the roast dropped at 4:45 / 204.2°C), record `end_condition_type: "manual"` directly without blocking on Chris's confirmation — the deterministic match IS the confirmation. Note in the push_roast `what_didnt` or `what_to_change` prose that the drop rule fired (and which rule). This saves a blocking question on the canonical-known case while preserving the ASK fallback for ambiguous cases.
  - **Consistent same-direction overshoot does NOT rule out manual pulls** (Round 14, Red Plum / Gesha Clouds). Multiple slots dropping 1-2°C above target in the same direction can read as auto-drop probe-lag overshoot — but it can ALSO indicate manual pulls to a target time (e.g. operator holding all three batches to 4:30 because the 209°C trigger was firing too early). The ASK is the right call when in doubt; don't infer auto-drop from consistency alone. Specifically check the drop-time column — if all three dropped at the same round-number wall-clock time (e.g. exactly 5:00 / 5:00 / 5:00), that's a strong manual-to-time signal.
  - On silent-FC coffees (anaerobic naturals, heavy co-ferments - Sudan Rume Natural is the case study), `fc_start` / `fc_temp` may be null. Don't fabricate values. Record `fc_total_cracks` (count of audible cracks from FC through drop, 0 on silent-FC) as the numeric audibility signal.
  - **`fc_audibility`** (Sprint 11 RO-CP-3 / migration 061 / 2026-05-20; 5th value `did_not_fire` added Group 3 / migration 066 / 2026-05-24) — set the 5-value enum per batch:
    - `audible` (multi-snap canonical FC, cell-wall intact)
    - `subtle` (partial detection, some snaps but not the canonical signature; operationally treated as not-audible for downstream protocol BUT the FC timestamp is real — if a specific `fc_start` fired, record `fc_start` / `fc_temp` / `dev_time_s` from the timestamp; do NOT null them. Round 14 Bukure v2b clarification: 1 crack at 5:27 with 18s dev was a real event, the snap fired even though the canonical signature didn't)
    - `silent` (no audibility — heavy-ferment cellulose modification; FC structurally happened but produced no snap; "inaudible" is a near-synonym used when hedging on detection vs asserting bean-property silence)
    - `ambiguous` (operator-property uncertainty — couldn't tell whether FC happened, missed it, or it's still upcoming)
    - `did_not_fire` (Round 14 case — bean did NOT reach FC temperature; FC structurally did not happen. Distinguished from `silent` by the absence of an event, not just of audibility. Bukure v2a topped at 199.9°C with 0 cracks; Mt Elgon batch 199 similar. When set, `fc_start` / `fc_temp` / `dev_time_s` MUST be null — there is no event to anchor to.)

    Four of the five (subtle / silent / ambiguous / did_not_fire) trigger the same downstream protocol stack: bean-temp `end_condition_type`, drop-ceiling-primary, Agtron + WB→Gnd delta as proxies. The distinction matters for cause attribution and for predicting audibility on future similar lots. See CONTEXT-roasting.md § FC audibility state. Historical roasts (pre-Sprint-11) are NULL; populate going forward. Pre-Round-14 underdeveloped probes that were forced into `ambiguous` may be patched to `did_not_fire` via `patch_roast` when re-reviewed.

## STAGE 3 - Push the V_n roasts

**This STAGE writes**: `roasts` rows (one per slot, via UPSERT on `(user_id, green_bean_id, batch_id)`).

For each slot:

- `push_roast(payload)`:
  - `green_bean_id` from STAGE 1
  - `batch_id` from Roest (the integer batch number as string - e.g. `"187"`)
  - **`recipe_id`**: FK to the matching `roast_recipes` row from the slot → recipe_id map. This is the design-intent linkage - without it the page can't render "intended vs achieved" on the resolved view. STAGE 1's fallback + inline-backfill paths produce this; if both failed in STAGE 1 we already halted there.
  - All numeric fields from Roest: fc_start, fc_temp, drop_time, drop_temp, dev_time_s, agtron, charge_temp, hopper_load_temp, end_condition_type, end_condition_target, fc_total_cracks, weight_loss_pct.
  - **Sprint 3.5 /datapoints/ unlock** — `pull_roest_log` now also returns: `tp_time` + `tp_temp` (bt local min in first half of roast), `yellowing_temp` (bt at dryend), `inlet_curve_recorded` (as-recorded inlet, sister to as-designed `inlet_curve`), `ror_at_2_30` + `ror_at_4_00` + `ror_at_fc_minus_30s` (°C/min, 30s centered window). Pass these through verbatim from the pull payload — they're server-side computed from the Roest /datapoints/ time-series.
  - `fc_audibility`: the 5-value enum from STAGE 2's silent-FC bullet (audible / subtle / silent / ambiguous / did_not_fire). Sprint 11 RO-CP-3 + Group 3 / Item 31 / migration 066. On `did_not_fire`, `fc_start` / `fc_temp` / `dev_time_s` must all be null.
  - `roest_log_id` (cross-ref) + `color_description` (Sprint 3.5 R57: the Roest UI Notes / first_comment.comment lands here — Chris uses it to record post-CM200 color descriptors; pass through verbatim from pull payload. If a given Roest note isn't a color descriptor, fold the prose into `what_didnt` or `what_to_change` instead). The legacy `roest_notes` field still accepts input for back-compat but should be left empty in new flows.
  - `roast_profile_name` from Roest.
  - **Prose** (your synthesis, NOT operator-supplied):
    - `what_worked`: structural observations on this slot's curve - what hit predictions cleanly
    - `what_didnt`: where the curve diverged from intent
    - `what_to_change`: what I'd adjust if re-roasting this exact recipe
  - `worth_repeating`: `"yes"` / `"no"` / `"pending"` (use `"pending"` for "yes at the structural-roast level but waiting on Day 7 cupping confirmation" - boolean true/false can't represent the conditional case).
  - `is_reference: false`. The reference-roast designation only lands at `close-lot.md` after a Day 7 cupping confirms the lot-level winner.
  - **`is_reference_candidate`: leave unset (NULL).** Round 14 / Item 34 / 2026-05-24 convention: the candidate flag is set **exclusively in `log-cupping.md` STAGE 3 after the V_n leading slot is identified on cup grounds**, never at roast-time on roast-structure grounds. Round 14 surfaced the ambiguity (Gesha Clouds v3a flagged true at roast-time on closest-to-#172 reasoning; "that was a guess") — roast structure alone can mislead, late-blooming aromatic lots roast cleanly without being cup-reference quality. Wait for cupping data. See CONTEXT-roasting.md § Reference candidate § Timing convention.

**`end_condition_type: "manual"` validation rule (Round 14, 2026-05-23)**: when `end_condition_type` is set to `"manual"`, `end_condition_target` MUST be `null` (or `0` for NONE). The validation rule fires "end_condition_target X must be null when end_condition_type is manual" — a manual drop has no machine target by definition. **Recipe vs roast divergence is intentional, not contradictory**: the `roast_recipes` row preserves the design intent (e.g. `end_condition_target: 207, end_condition_type: "bean_temp"`); the `roasts` row records execution reality (e.g. `end_condition_target: null, end_condition_type: "manual"`). Both coexist legitimately on the same V_n slot. A naive cross-table query may read them as conflicting; the resolved-view + design-vs-achieved render handles them correctly. Pre-Sprint-14 manual roast rows that carry a non-null `end_condition_target` (grandfathered from before this rule) are inconsistent with the constraint going forward; backfill-null via `patch_roast(roast_id, end_condition_target: null)` if encountered.

**"Profile trigger never fired / bean topped out below target" case (Round 14, Bukure v2a + Mt Elgon)**: when the profile sets `bean_temp` end condition but the bean never reaches the trigger temperature (e.g. peak too low, bean tops out 5-10°C below target, drops at the safety floor or a manual pull at the time cap), record `end_condition_type: "manual"` (with `end_condition_target: null` per the rule above) since the effective drop was operator-controlled (clock cap / safety floor), NOT machine-controlled (the bean-temp trigger never fired). The design-intent target (e.g. 207°C bean_temp) stays preserved on the recipe row. Document the non-fire explicitly in `what_didnt` prose: "profile set bean_temp 207°C but bean topped out at 199.9°C; drop fired at safety floor / clock cap instead". The `fc_audibility` value in this case is **`did_not_fire`** (Group 3 / Item 31 / migration 066 / 2026-05-24 — the 5th enum value added specifically for the underdeveloped-low-energy-probe case where the bean did NOT reach FC). When `did_not_fire` is set, `fc_start` / `fc_temp` / `dev_time_s` MUST all be null (no event to anchor to) and Maillard % MUST NOT be computed in `observed_outcome_*` prose (the phase calculator collapses yellow→drop into a single phase and produces a structural artifact — Bukure v2a's "61.4% Maillard despite no FC" is the case study; record "Maillard % N/A (FC did not fire)" instead). See CONTEXT-roasting.md § Maillard % § Computation rule on `did_not_fire` batches.

`push_roast` UPSERTs on `(user_id, green_bean_id, batch_id)`. Re-pushing the same `batch_id` returns `created: false` and field values are NOT overwritten - use `patch_roast` for field-level corrections.

Capture `roast_id` per slot for STAGE 5's experiment-row patch and `log-cupping.md`'s cupping pushes later.

## STAGE 4 - Patch the recipe rows with Roest linkage

**This STAGE writes**: `roast_recipes` patches (Roest profile linkage fields).

For each V_n recipe row authored at design time, link back to its Roest profile if not already done:

- `patch_roast_recipe(recipe_id, roest_profile_id, roest_share_url, roest_profile_name, pushed_to_roest_at)`.

Skip slots where these fields already populated.

## STAGE 5 - Patch the V_n experiment row

**This STAGE writes**: `experiments.batch_ids`, `experiments.observed_outcome_a/b/c/d`, `experiments.delta_from_roast_a/b/c/d`, `experiments.updated_cup_prediction_a/b/c/d`, `experiments.taste_for_a/b/c/d`. Optional: `key_insight` / `key_insight_confidence` / `what_changes_going_forward` / `open_questions` / `additional_notes`.

`patch_experiment(experiment_pk, ...)`:

- `batch_ids`: comma-separated string of the Roest batch numbers (e.g. `"187, 188, 189"`).
- `observed_outcome_a/b/c/d`: structural roast observations per slot. Source from Roest + your push_roast prose. 1-2 sentences each covering: FC time/temp, drop time/temp, dev time, Agtron WB + (if available from a quick cupping) ground Agtron + WB→Gnd delta, Maillard %, plus one-line cup-side hypothesis (which is *not* the taste_for - see below).
- `delta_from_roast_a/b/c/d`: reconciliation vs recipe predictions per slot. "Predicted FC 4:25 / 203°C, actual 5:11 / 202.5°C → late by ~45s, temp on target. Drop hit end_condition cleanly at 205°C / 6:00." Compare against `roast_recipes.predicted_fc_temp / predicted_fc_time / predicted_total_time / predicted_agtron_wb`.
- `updated_cup_prediction_a/b/c/d`: **post-roast cup prediction per slot, given how each actually roasted**. Distinct from `roast_recipes.predicted_cup` (frozen at design time, stays put). Now that we've seen the curves, refine the cup prediction. E.g. design-time predicted "sweet, balanced, lemongrass-forward"; post-roast updated prediction "v3a underdeveloped - pungent attack, fast fadeout, less integration than predicted; v3b structurally sound - closest to design intent; v3c overran - body and tannin emphasized."
- `taste_for_a/b/c/d`: **cupping-table prep, NOT a prediction**. 1-3 short sentences per slot, action-verb-led ("Listen for X" / "Check whether Y" / "Look for Z" / "Taste only to calibrate Z"). Each becomes the prompt Chris reads at the cup Day 7; the page UI surfaces it front-and-center on the Cupping Hypothesis card. **Tightening rule shipped Sub-sprint 4a Bundle C (2026-05-27):** before Bundle C the spec asked for "1-3 sentences combining three reference points (producer notes + V_(n-1) memory + adjustment tested)" with numbered citations, which produced 80+ word slots that drowned the actual taste prompts. The flat action-verb shape replaces it.

  **What goes in:**
  - **Questions to ask at the cup** — the load-bearing job. "Does X show up?" / "Is the body Y?" / "Is the finish puckering or smooth?"
  - **Diagnostic framing for failure-mode batches** — when a batch is intentionally below the floor (e.g. no-FC marker) or above the ceiling, frame as "Taste only to calibrate what <signature> tastes like on this lot — diagnostic data point, not a candidate." Even failed batches produce lasting signature reference material for future lots; the prose captures the underdev / overdev / off-balance signature so Chris can recognize it later in the cup notes.
  - **Forward-looking V_(n+1) implications when load-bearing** — "If v2c still reads darker-than-it-says like all of V1, V_(n+1) must attack dev time" — surfaces the branch logic that will drive next-set design.
  - **Brief comparators when they sharpen the question** — "closest analog cupped grassy/nutty/raw under a fruit attack" sets the prior-memory contrast in under 10 words. Cite the prior slot/batch identifier; don't re-explain the prior cup at length.
  - **Reference-candidate criterion when applicable** — "If it's clean and balanced, it's the reference candidate" surfaces the explicit promotion gate the cup decides.

  **What does NOT go in:**
  - **Don't re-state the full producer tasting notes** — they're already on the Cupping Hypothesis card in the Producer Notes sub-card (Sub-sprint 4a Bundle B). Reference them once if pointing at ONE specific note ("does the rose-like drying tail soften?") but don't enumerate the full list every slot.
  - **Don't use numbered citation structure** — flat 1-3 sentences with action verbs is the shape, not "(1) producer notes ... (2) V_(n-1) memory ... (3) adjustment tested ...".
  - **Don't recap the design intent** — the recipe row already carries `rationale` + `predicted_cup` + Drop Rules; the cupping-table read doesn't need to re-explain why this batch was designed this way.
  - **Don't write "single-cup observation" / "no second batch to disambiguate" tangents** — those are roast-side caveats that belong in `observed_outcome_*`.

  **Worked examples (Phase 1 audit rewrites, 2026-05-27):**

  *Diagnostic failure-mode batch (Bukure v2a — no-FC underdevelopment floor marker):*
  > "Producer notes are almost certainly absent — don't expect them through underdevelopment. Taste only to calibrate what underdevelopment tastes like on this lot — it's a diagnostic data point, not a candidate."

  *Question-led + forward-looking V_(n+1) (Bukure v2b — lowest energy that reached FC):*
  > "This is the most interesting slot for the cranberry/honeycomb/lingonberry question — lowest energy that still reached FC, so if lower energy unlocks the bright side, the first hint shows here. If you taste brightness layered on a thin base, V_(n+1)'s job is to keep this energy but fix the development."

  *Branch-logic forward-looking (Bukure v2c — adjustment 2°C below V1 winner):*
  > "Check whether cranberry/honeycomb/lingonberry surface at all — this is the cleanest-developed V2 cup. If v2c still reads 'darker than what it says' like all of V1, the dark-tea ceiling is NOT an energy-lever problem and V_(n+1) must attack dev time."

  *Reference-candidate criterion (Red Plum v2c — cleanest roast on lot):*
  > "Best chance of the V2 set to hit the producer's notes. Structurally this is the cleanest roast on the entire lot, and this is the batch that could resolve the lot. If it's clean and balanced, it's the reference candidate."

  Skip slots that genuinely weren't roasted in V_n (e.g. only v1a/v1b roasted, c skipped).

Optional: also update `key_insight` / `key_insight_confidence` / `what_changes_going_forward` / `open_questions` / `additional_notes` if the roast-side actuals alone already reveal something insightful (rare at the post-roast stage; usually wait for cupping data). When set, use the `key_insight_confidence` ladder documented in `log-cupping.md` STAGE 3.

The `winner` field stays NULL until Day 7 cupping resolves it. `log-cupping.md` declares the leading slot for V_n.

`patch_experiment` echoes `updated_fields: [...]` so you can sanity-check which columns landed.

## STAGE 6 - Optional: propose cluster-doc mid-iteration update

**This STAGE writes**: `doc_proposals` row (one multi-citation proposal), OR nothing if skipped.

Only if V_n's roast-side observations reveal a lot-state change worth recording NOW (rather than waiting for cupping). Examples:

- Calibration shift confirmed on this lot ("Higuito drop ceiling 209°C, not the protocol-default 207°C - Medium confidence pending V_(n+1)")
- Protocol-level insight applicable beyond this lot ("audibility count is the diagnostic primary on silent-FC lots - FC timestamp unreliable")
- Drift detection: live cluster docs disagree with what you observed in Roest data this V_n

Route by SHAPE of the insight:

- Lot-state changes → per-lot file at `docs/skills/roasting-historian/cluster/active-lots/<lot-slug>.md` (replace); citation `target_doc: 'skills/roasting-historian/cluster/active-lots/<lot-slug>.md'`. **Lot-slug convention** (Round 14): the active-lot doc filename is the lowercased lot_id form (e.g. `rwa-nova-nat21-rb-2026.md`, `cgle-srume-natural-2026.md`, `cos-hig-bor-2026.md`), NOT a producer/cultivar name-slug. When the slug is uncertain, run `list_docs(prefix="skills/roasting-historian/cluster/active-lots/")` to enumerate before drafting the citation — saves a round-trip on the propose_doc_changes anchor resolution.
- Protocol-level insights → workflow / protocol cluster doc — FC Marking Protocol at `docs://skills/roest-knowledge/cluster/protocols/fc-marking.md`; Drop Temp as the Primary Drop Signal at `docs://skills/roest-knowledge/cluster/machine/counterflow-observations.md#drop-temp-as-the-primary-drop-signal`; Between Batch Protocol at `docs://skills/roest-knowledge/cluster/protocols/between-batch-protocol.md`. Use citation `target_doc: 'skills/roest-knowledge/cluster/<file>.md'`.
- Mid-iteration cross-coffee patterns → Roasting Historian's Cross-Coffee Insight Layer at `docs://skills/roasting-historian/cluster/patterns/cross-coffee-insights.md` (append with confidence marker); citation `target_doc: 'skills/roasting-historian/cluster/patterns/cross-coffee-insights.md'`

Fetch live anchors via `read_doc(uri="docs://skills/<cluster-path>.md")` (or `read_doc_section` against the same URI) BEFORE drafting. Submit as a single multi-citation `propose_doc_changes` call with per-citation `target_doc: "skills/<cluster-path>.md"` matching where each insight routes (`'roasting.md'` is deprecated post Wave 4 PR 4b per ARBITER.md § target_doc routing). Citations: `[{section_anchor, op, proposed_text, current_text, target_doc?}]`.

**Partial-proposal pattern (Round 14, Bukure)**: STAGE 6 is NOT strictly binary "propose or skip-and-defer." Roast-layer-only facts that are cupping-INDEPENDENT can ship now even when cup-dependent synthesis defers. Examples of cupping-independent facts safe to propose at log-roast time:

- **Energy floor / ceiling bracket** — "234°C peak inlet doesn't reach FC on this lot (v2a no-FC); 238°C marginal (v2b 18s dev); 242°C cleanly developed (v2c). V_(n+1) peak inlet floor: don't go below 238°C." This is a roast-layer fact the cup can't invalidate.
- **End-condition timing calibration** — "209°C bean-temp target firing at 4:00-4:10 forces manual-hold to 4:30 across all slots; target mismatched to this coffee's FC timing at these peak inlets." Roast-layer mechanical observation.
- **Lot-state status flip** — "V_n complete, lot state flipped to Waiting for next cupping" + retire stale "V_n not yet roasted" prose on the active-lot doc.
- **Drop-rule fire events** — "drop_rule_if_slow fired on v2a + v2b (manual pull at clock cap)" documents the operational pattern even if the cup verdict is pending.

What still defers to log-cupping.md STAGE 6:
- Leading slot identity (cupping resolves it via `winner`)
- V_(n+1) design direction (depends on which cup wins + how)
- CCIL / Cross-Coffee Insight Layer entries that synthesize a generalizable pattern (need cup confirmation before the insight is promotion-worthy)
- Varietal Fingerprint additions / Per-lot FC ceiling promotion (cup-side validation expected)

**When to skip the whole STAGE 6 (full defer)**: Day 7 cupping is imminent AND every candidate insight depends on cup data. Skip and tell Chris the proposal queues for the `log-cupping.md` STAGE 6 pass. Print `STAGE 6: skipped - cupping imminent, defer`.

AVOID editing mid-iteration: Recently Closed Lots, Reference Brew Recipes by Lot - those are close-out artifacts owned by `close-lot.md`.

## STAGE 7 - Confirmation output

**This STAGE writes**: nothing (output only).

Print:

- `green_bean_id`
- For each slot (v_n a / b / c / d):
  - `batch_id` (Roest #) + `roast_id` (UUID)
  - `recipe_id` linkage confirmed
  - End condition (actual: bean_temp 204.2°C @ 6:00, vs target 205°C - `delta_from_roast` summary)
  - `updated_cup_prediction` (1-line)
  - `taste_for` (1-line)
- `experiment_pk` + `updated_fields: [...]` from patch_experiment
- `proposal_id` from propose_doc_changes (if STAGE 6 ran), or `STAGE 6: skipped - <reason>`
- Lifecycle state confirmation: "V_n complete, lot state flipped to **Waiting for next cupping**. Day 7 cupping target: <YYYY-MM-DD>."

## What this prompt does NOT do

- Push cuppings (`push_cupping`). Cupping happens Day 7, that's `log-cupping.md`.
- Declare a leading slot or update `experiments.winner`. The leading slot is declared post-cupping in `log-cupping.md`.
- Design V_(n+1). That's `log-cupping.md` - the adjustment is informed by what the cup taught, not what the roast taught.
- Declare a lot-level reference roast. Reference roast lives at `close-lot.md` after iterating through enough V-sets.
- Push roast learnings. That's `close-lot.md`.
