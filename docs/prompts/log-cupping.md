**State transition**: Waiting for next cupping → Waiting for next roast (loop continues, V_(n+1) designed) OR → Resolved-pending (lot ready for close-out, routes to `close-lot.md`) OR → Waiting for next cupping (held, pre-V_(n+1) calibration gate fires — Path C).

**Trigger**: I just cupped V_n at Day 7 and have the cupping transcript. I'll paste the per-slot tasting notes below this message. Your job is two moves rolled into one session: (a) close out V_n - push the cuppings, compute cup deltas, name the leading slot, capture key insight; and (b) decide whether the lot is ready for close-out OR design the next adjustment as V_(n+1) OR halt for a pre-V_(n+1) calibration step.

**Workflow position**: Third of four lifecycle prompts (`start-lot.md` → `log-roast.md` ⇄ **`log-cupping.md`** → `close-lot.md`). This one is the loop step - runs once per V-set's Day 7 cupping. Three outcomes:

- Most common: design V_(n+1) inline → state flips to **Waiting for next roast** → I roast V_(n+1) and we re-enter `log-roast.md`.
- Eventual: leading slot for V_n is also the lot-level reference roast candidate, and a control-experiment V-set isn't warranted → state flips to **Resolved-pending** and I run `close-lot.md` next.
- Less common: V_(n+1) design is blocked on missing calibration data (peer-roasted reference cup) OR on a missing cup-side discriminator (a second recipe_variant on the already-roasted beans). State stays **Waiting for next cupping** — Chris executes the calibration step, then re-enters `log-cupping.md` to design V_(n+1) on the richer evidence base.

Vocabulary used in this prompt is defined in CONTEXT-roasting.md (leading slot vs reference roast, adjustment, roast→cup trace, lever vs variable vs non-factor, control experiment, pre-V_n calibration gate, recipe_variant). Cross-cutting infrastructure terminology in CONTEXT-shared.md (glossary index — operational vocabulary lives in dedicated reference docs at docs/reference/mcp-architecture.md / canonical-registries.md / wbc-materials.md / synthesis-pipeline.md per the 2026-05-25 Pattern J pruning sprint; pull via `read_doc` when a specific term needs validation).

## Tools for this session

`get_green_bean`, `get_bean_pipeline`, `push_cupping`, `patch_cupping`,
`push_experiment`, `patch_experiment`, `push_roast_recipe`, `patch_roast_recipe`,
`push_roast_profile`, `read_doc`, `read_doc_section`, `list_doc_sections`,
`read_canonical`, `propose_doc_changes`.

MCP namespace: tools surface under `Latent Coffee`.

## Routing

I'll reference the lot by `lot_id` or `green_bean_id` + tell you which V-set just got cupped (e.g. "Sudan Rume Natural V5 cupped, batches 187/188/189"). You decide downstream whether the lot is ready for close-out, whether V_(n+1) needs to be designed, or whether a pre-V_(n+1) calibration gate fires.

## STAGE 0 - State-shape migration (pre-rewrite lot detection)

**This STAGE writes**: `experiments.updated_cup_prediction_a/b/c/d`, `experiments.taste_for_a/b/c/d`, `roast_recipes.predicted_cup` (one-pass backfill, ONLY when the lot was authored under pre-rewrite prompts). SKIP STAGE 0 entirely on fresh-from-rewrite lots.

**Why this exists**: V-set lots authored before the 4-prompt rewrite (PR #157) lack the post-roast / pre-cupping prediction fields that STAGE 3 reconciles against. Without backfill, the delta_from_cup_* fields have nothing to compare to and the leading-slot prose becomes fuzzy. Detect once, backfill once, then proceed.

### Detection

Run a minimal `get_bean_pipeline` read first to evaluate:

A V_n is **pre-rewrite** when ALL three hold:
- `experiments` row for V_n exists with `batch_ids` populated (V_n was roasted)
- `experiments.updated_cup_prediction_a` IS NULL (no post-roast prediction was captured at log-roast time)
- One or more V_n `roast_recipes` rows have `predicted_cup IS NULL` OR no recipe rows exist for the experiment at all

If detection does NOT fire (any of the three are false), skip STAGE 0 entirely and start at STAGE 1.

### Inline backfill (when detection fires)

Three writes, in order. Each call's payload is reconstructed from session memory + the existing DB state — no fabrication. If a piece is genuinely unknowable from what's in front of you, halt and report which slot's which field is missing, do NOT guess.

**(a) `roast_recipes.predicted_cup` backfill** — one `patch_roast_recipe` call per recipe row missing the field. **Always include `was_backfilled: true` + `backfill_notes: "..."`** on these calls (Schema sprint S4, migration 057, 2026-05-18) — the recipe row's design intent is being recovered post-roast, not captured at design time. Standard `backfill_notes` phrasing: `"Recovered from <source> at V_<n> cup, YYYY-MM-DD"` where source is "session chat memory" / "expected_outcomes per-slot split" / "log-roast.md prose".

Reconstruct from `experiments.expected_outcomes` (the design-time per-slot cup hypothesis prose) when it's per-slot-shaped. Worked example:

> `expected_outcomes` reads: "v3a underdev hypothesis: clean attack, possibly hollow middle; v3b structural target — closest to design intent; v3c overrun hypothesis: heavier body, tannin emphasis."

Split into three `patch_roast_recipe(recipe_id, predicted_cup: "...", was_backfilled: true, backfill_notes: "...")` calls:
- v3a: `predicted_cup: "Clean attack, possibly hollow middle - underdev hypothesis."` + `was_backfilled: true` + `backfill_notes: "Recovered from expected_outcomes per-slot split at V3 cup, 2026-05-19"`.
- v3b: `predicted_cup: "Structural target - closest to design intent."` + `was_backfilled: true` + `backfill_notes: "..."`.
- v3c: `predicted_cup: "Heavier body, tannin emphasis - overrun hypothesis."` + `was_backfilled: true` + `backfill_notes: "..."`.

**If no recipe row exists at all for a slot** (`roasts.recipe_id` IS NULL, not just `roast_recipes.predicted_cup` IS NULL — the V_n was pushed via `push_roast_profile` to Roest but `push_roast_recipe` was never called): use `push_roast_recipe` to CREATE the row instead of `patch_roast_recipe`, then link it via `patch_roast(roast_id, recipe_id: <new_recipe_id>)`. Sequence per slot:

1. `push_roast_recipe(green_bean_id, experiment_id, batch_slot, recipe_name, predicted_cup: "...", was_backfilled: true, backfill_notes: "Created during V_<n> cup backfill — original push_roast_recipe missed at design time, YYYY-MM-DD", + curves/end-condition/charge/hopper reconstructed from session memory or the Roest profile)` → returns `recipe_id`.
2. `patch_roast(roast_id: <V_n slot roast row>, recipe_id: <recipe_id from step 1>)` → links the execution row to its design-intent row.

This is the "half-migrated" case observed on CGLE Sudan Rume Natural V5 (2026-05-21, first lived test of this prompt). The detection criteria above already flag it; this paragraph describes how to resolve it. If curve/end-condition/charge/hopper are unrecoverable, halt and ask Chris to ballpark before fabricating.

If `expected_outcomes` is generic ("we expect the lower-peak slot to read cleaner"), it can't be cleanly split — halt and ask Chris to ballpark each slot's predicted_cup before proceeding. Do NOT fabricate a per-slot prediction from a single-blob `expected_outcomes`.

**(b) `experiments.updated_cup_prediction_a/b/c/d` backfill** — one `patch_experiment` call updating all populated slots in a single payload.

Reconstruct from the V_n roast rows' `what_worked` / `what_didnt` / `what_to_change` prose (the post-roast structural observations log-roast.md captured) plus session memory of what Chris said after the roasting session. Worked example:

> roast row for v3a: `what_worked = "structurally sound through Maillard"`, `what_didnt = "FC fired 45s late, dev phase compressed by ~30s"`, `what_to_change = "lower peak inlet 1-2°C next iteration"`.

Compose `updated_cup_prediction_a`:

> "v3a likely reads developed-but-compressed - attack clean from the Maillard-through-FC structure, but mid-palate may collapse from the FC-late dev squeeze. Watch for hollow middle; brightness OK."

Each `updated_cup_prediction_<slot>` is 1-2 sentences mapping the structural roast observation to a cup-side hypothesis. If the roast prose is sparse (one-line per field), keep the prediction equally sparse — don't pad.

**(c) `experiments.taste_for_a/b/c/d` backfill** — same `patch_experiment` call as (b), or a follow-up call if (b) was already issued.

Each `taste_for_<slot>` is 1-3 sentences combining three reference points: producer tasting notes (external ballpark), prior V_(n-1) slot memory (where I am vs the last try), the specific adjustment being tested this round. Worked example for v3a:

> "Producer: lemongrass, ginger, brown sugar, bergamot, blueberry. V2A on this lot tasted creamy on attack but tannin-heavy at finish. This slot tests lower peak inlet - listen for cleaner attack, but possibly hollow middle from the compressed dev."

Skip slots that genuinely weren't roasted in V_n (e.g. only v1a/v1b roasted, c skipped).

### Confirmation

After the three writes, print a one-line `STAGE 0: backfilled <N> recipe rows + <M> experiment-slot fields` summary, then proceed to STAGE 1.

## STAGE 1 - Resolve bean + V_n state, baseline pipeline

**This STAGE writes**: nothing (read-only).

- `get_green_bean({lot_id})` → returns `green_bean_id`.
- `get_bean_pipeline({green_bean_id})` → full state: `green_bean`, `roasts[]`, `cuppings[]`, `experiments[]`, `roast_recipes[]`, `brews[]`, `roast_learnings`.
- Identify V_n experiment row (most recent by `created_at` matching `<LOT-PREFIX>-V<n>`). Confirm `batch_ids` is populated (otherwise `log-roast.md` didn't run - halt and report).
- Build the slot → roast_id map from `roast_recipes.batch_slot` joined to `roasts.recipe_id`.
- Read each V_n recipe's `predicted_cup` (design-time prediction, frozen) and the V_n experiment's `updated_cup_prediction_a/b/c/d` (post-roast, pre-cupping prediction) + `taste_for_a/b/c/d` - these are the two predictions you'll compute deltas against in STAGE 3. STAGE 0's backfill should have populated all three if the lot was pre-rewrite.

## STAGE 2 - Push the cuppings

**This STAGE writes**: `cuppings` rows (one per slot cupped, via UPSERT on `(user_id, roast_id, cupping_date, eval_method, recipe_variant)`).

For each slot Chris cupped (typically all V_n slots; sometimes one or two are skipped):

- `push_cupping(payload)`:
  - `roast_id` from STAGE 1's map (NOT batch_id).
  - `cupping_date`: YYYY-MM-DD of the cupping session.
  - `rest_days`: integer. V4 evaluation gate is Day 7; Day 6-10 is the acceptance window. **If `rest_days` is outside [6,10] OR the implied `cupping_date - roast_date` doesn't match the reported `rest_days`, flag it explicitly** in the same line: prefix `additional_notes` (or `overall` if `additional_notes` isn't a field on cuppings) with `"REST_DAYS_DRIFT: cupped Day <N>, off the Day 7 gate by <delta>"` so cross-lot rest-curve analysis can filter on the flag later. Common cause is a multi-day cupping push that drifted: Chris said "I cupped V3 on the 14th" but the roast was on the 5th → `rest_days: 9`, not 7. **Two structural sources** (Phase 2 / Item 13 audio elaboration / 2026-05-24, see [CONTEXT-roasting.md § Rest-days drift](../../CONTEXT-roasting.md)): (1) **within-V-set scheduling drift** (~1-2 days, managed) — Chris can't do 3-5 cuppings in one day, so the assistant spaces them (e.g. 3 same-day roasts → cupped Day 6 / 7 / 8); this is the case the existing prefix is designed for. (2) **cross-V-set comparison drift** (7+ days, structural) — in a Simulated Pourover Gate / candidate-runoff cup-set, V_n's candidate is brewed alongside V_(n-1)'s candidate, and V_(n-1) has typically rested 7+ extra days because the roasting cycle is long. When the drift is the cross-V-set variant, **add a second prefix** on the V_(n-1) cupping row's `additional_notes`: `"REST_DAYS_DRIFT_COMPARISON: SPG / candidate-runoff vs V_n at Day <N>, +<delta> days older"`. This denotes that the drift here is structural unfairness in the comparison frame, not a scheduling miss — important for the comparison interpretation because no structured experiments yet exist on rest-days effects across this magnitude.
  - `eval_method`: `"Pourover"` for Day 7 evaluation. `"Cupping"` (table bowl) is the legacy Day 4 defect-screen - deprecated as a primary evaluation per CONTEXT-roasting.md § Reference cup, but still accepted if you ran one.
  - **`recipe_variant`**: distinguishes multiple cuppings of the same `(roast_id, cupping_date, eval_method)` under different brewing recipes. Examples: `"xbloom_gate"` (mechanically-consistent gate cupping that defines the reference cup), `"real_pourover"` (optimized brew at Chris's daily-consumption recipe). When pushing both for the same slot on the same day, use distinct labels. When pushing only one and you know a second is unlikely, leave NULL - but if a second is *likely* later (the "first of likely two" case), explicitly label this one (e.g. `"xbloom_gate"`) to avoid retroactive patching when the second lands. The NULLS NOT DISTINCT composite key collapses two unlabeled cuppings into one row.
  - `ground_agtron`: paired with `roasts.agtron` for the WB→Ground delta - V4 primary internal-development signal (target ≤3 points). `wb_agtron` is auto-snapshot from the joined roast row at insert time per Schema sprint S1 (migration 055); `wb_to_ground_delta` is a generated column you can later query directly for cross-lot analysis.
  - The ten prose fields: `aroma`, `flavor`, `acidity`, **`sweetness`**, `body`, `finish`, `overall`, **`temperature_behavior`**, **`aromatic_behavior`**, **`structural_behavior`**. Source from Chris's transcript verbatim where possible, your synthesis only where the transcript is fragmentary.
    - **`sweetness` is a distinct axis from acidity and body** (Schema sprint S3, 2026-05-18) — do NOT fold "sweet citrus" into acidity or "syrupy sweetness" into body. The axis stays implicit and uncross-queryable when you do. Examples: "Moderate, structurally honey-like" / "Hidden behind acidity; emerges at 50°C" / "Layered cane sugar → maple as it cools" / NULL if Chris's transcript genuinely doesn't address sweetness.
    - **`temperature_behavior`** captures direction + when + what changes across the cooling arc (parallel to brews.temperature_evolution). Examples: "Rose emerges below 50°C" / "Bitter tail resolves on cooling" / "Flattens cooler — V3a pattern" / NULL if cup didn't materially evolve.
    - **`aromatic_behavior`** (Sprint 11 RO-6 / migration 062 / 2026-05-20 — relocated from roast_learnings per ADR-0008): how aromatics present in time and intensity for THIS cup — immediate vs late-blooming, expressive vs muted, lifted vs grounded, sustained vs transient. Per-tasting observation tied to this specific cupping event, NOT a lot-aggregate carry-forward (lot-aggregate lessons live on `roast_learnings.cultivar_takeaway` / `general_takeaway` / etc.). On lots with multiple cuppings, populate the canonical pourover cupping on the reference roast (the row /green/[id] ResolvedView surfaces); patch_cupping later if a second variant evaluation lands.
    - **`structural_behavior`** (Sprint 11 RO-6 / migration 062 / ADR-0008): shape and balance of acidity, body, and finish for THIS cup, separate from flavor. Per-tasting observation. Same per-cup framing as aromatic_behavior.

`push_cupping` UPSERTs on `(user_id, roast_id, cupping_date, eval_method, recipe_variant)` with NULLS NOT DISTINCT. Re-pushing is safe - returns `created: false` and field values are NOT overwritten. Use `patch_cupping` for field-level corrections after the first push.

The response echoes `composite_key: {roast_id, cupping_date, eval_method, recipe_variant}` - sanity-check the row landed under the intended tuple.

Capture `cupping_id` per slot for cross-reference.

## STAGE 3 - Patch the V_n experiment row with cup deltas + leading slot

**This STAGE writes**: `experiments.delta_from_cup_a/b/c/d`, `experiments.observed_outcome_a/b/c/d` (refine), `experiments.winner`, `experiments.key_insight`, `experiments.key_insight_confidence`, `experiments.what_changes_going_forward`, `experiments.open_questions`, `experiments.additional_notes`. Optionally also: **`roasts.is_reference_candidate = true` on the leading-slot roast** when the cup is reference-quality at the V-set level (see "Mark the leading slot as a reference candidate" below).

`patch_experiment(experiment_pk, ...)`:

- **`delta_from_cup_a/b/c/d`**: per-slot reconciliation of actual cup vs `updated_cup_prediction_*` (the post-roast prediction). Then **walk the three taste_for_* reference points and note which materialized as expected vs not**:
  1. Producer notes ballpark — did this slot land in the producer's descriptor zone? Cite specifics.
  2. Prior V_(n-1) memory — where did this slot land vs the corresponding prior-V-set slot? (e.g. "v3a was cleaner on attack than v2a, confirming the lower-peak hypothesis.")
  3. Specific adjustment tested — did the lever move the cup as predicted, partly, or not at all?

  Worked example: "v3a updated prediction said 'pungent attack, fast fadeout'; actual cup *was* pungent on attack but held expressiveness through cool stage longer than predicted - the hard cliff produced an accidental slow-bake that integrated flavor compounds more thoroughly than expected. **Taste-for reconciliation**: producer notes (lemongrass / ginger / brown sugar) all present and forward — matched. V2A memory (tannin-heavy finish) did NOT recur — improved. Adjustment hypothesis (lower peak → cleaner attack but possibly hollow middle) — attack confirmed clean, middle did NOT hollow, instead integrated more thoroughly than predicted." Both layers of the roast→cup trace become tasteable across slots: roast-delta (already captured in `log-roast.md`) + cup-delta (this field) + taste_for-reconciliation (this field's extension).
- `observed_outcome_a/b/c/d` (refine): if `log-roast.md` populated these with roast-side observations, **extend** them with the cupping observations rather than overwriting. The same observed_outcome field carries both layers' findings.
- **`winner`** (post-cupping resolution): the **leading slot** for V_n - which slot won this V-set's comparison. Format strictly as `"V<n><letter> (Batch <Roest#>)"` — for example `"V5C (Batch 189)"`. **Everything past that string goes in `additional_notes`, not in `winner`** — the field is a slot identifier, not a verdict prose blob. Distinct terms:
  - **Leading slot** = winner of one V-set's comparison. Lives in `experiments.winner`. Changes V-set to V-set.
  - **Reference roast** = lot-level final designation. Lives in `roast_learnings.best_roast_id`. Set exactly once per lot at close-out.

  Verdict prose ("V5C won because the lower peak resolved the tannin overhang while preserving body") belongs in `additional_notes` or `key_insight`, not appended to `winner`.
- **`key_insight`**: what V_n taught - Chris's post-hoc framing. 2-4 sentences. Variable → lever / non-factor promotions belong here. ("Peak inlet height is the lever for this lot; post-peak decline rate was tested but produced no clear cup difference - non-factor.")
- **`key_insight_confidence`**: enum `Low` / `Medium` / `Medium-High` / `High`. The operational ladder (apply consistently across sessions; mirrors Cross-Coffee Insight Layer marker language):
  - **Low** — interesting hypothesis. Single-V-set observation, not yet replicated. Flag in the log but don't act on it yet.
  - **Medium** — consistent with 1-2 prior data points (this lot's earlier V-sets, or a closely-similar prior lot's carry-forward). Worth weighting in V_(n+1) design but not promotion-ready.
  - **Medium-High** — strong evidence within this lot, ready to be a working assumption for the rest of the lot's V-sets and for similar-cultivar carry-forward. Survives "what would change my mind?" prompting.
  - **High** — ready to promote to a protocol change in the cluster docs (typically routes through STAGE 6 of THIS prompt as an APPEND or REPLACE on a protocol cluster doc). Requires either multi-V-set repetition within this lot OR strong cross-lot corroboration.

  Used by downstream queries + cluster-doc routing decisions. If you're not sure between two levels, pick the lower one and explain why in `additional_notes`.
- **`what_changes_going_forward`**: lessons-applied-forward. What changes about V_(n+1) / next bean / general approach. **Field is forward-looking and actionable** — phrase as "next time / V_(n+1) does X". Don't conflate with open questions.
- **`open_questions`**: what V_n did NOT answer. Separate field so the V_n → V_(n+1) transition is crisp - open questions inform V_(n+1)'s `primary_question`. **Field is interrogative** — phrase as questions ("does peak inlet matter above 244°C on this lot?" / "is the audibility window real or noise?").
- **`additional_notes`**: free-text catch-all for cross-slot narrative tension that resists categorization - operator-framing prose, cup-vs-structure disconnects, reframe-the-direction observations, verdict-prose for the leading slot when it doesn't fit `key_insight`. **Field is descriptive, not directive** — if a sentence ends with "next time we should…" it belongs in `what_changes_going_forward`; if it ends in "?" it belongs in `open_questions`; if it describes something the leading slot did or didn't do, it belongs here.

  Quick disambiguation rule: forward + actionable → `what_changes_going_forward`. Interrogative → `open_questions`. Everything else cross-slot narrative-shaped → `additional_notes`.

`patch_experiment` echoes `updated_fields: [...]` + `canonical_values: { key_insight_confidence }` so you can confirm enum vocabulary landed cleanly.

### Mark the leading slot as a reference candidate (Schema sprint S2, 2026-05-18)

After the V_n leading slot is identified, **assess reference quality** and patch `roasts.is_reference_candidate` accordingly. Distinct from `experiments.winner` (which is always the V-set leading slot, regardless of quality) and `roasts.is_reference` (lot-level final, set at close-out).

**This prompt owns the flag** (Round 14 / Item 34 / 2026-05-24 convention). The candidate flag is set exclusively here — on cup grounds, after the V_n leading slot is identified — NOT at roast-time in `log-roast.md` STAGE 3 on roast-structure grounds. Round 14 surfaced the ambiguity (Gesha Clouds v3a flagged true at roast-time on closest-to-#172 reasoning; "that was a guess") — roast structure alone can mislead, late-blooming aromatic lots roast cleanly without being cup-reference quality. By definition the flag is a cup-quality judgment; wait for cupping data before setting. See CONTEXT-roasting.md § Reference candidate § Timing convention.

- **Set `is_reference_candidate: true`** when the leading slot reads as a plausible lot reference at close-out — the cup is reference-quality at the V-set level, even if more V-sets are coming.
- **Set `is_reference_candidate: false`** (or leave default false) when the leading slot is "best of the worst" — Fazenda Um V1B is the canonical case: leading slot by Chris's verdict, framed as "best of the worst, NOT a reference example."
- The candidate flag does NOT auto-flip to `is_reference` at close-out. `close-lot.md` STAGE 2 (or `one-shot-closeout.md` STAGE 2) makes the promotion explicit via a separate `patch_roast(is_reference: true)` on the lot-level final reference.

`patch_roast(roast_id: <leading_slot_roast_id>, is_reference_candidate: true|false)`. Multiple V-sets on one lot can each have a candidate; only one batch ultimately gets `is_reference=true` at close-out.

## STAGE 4 - Decide: close out, design V_(n+1), or run a pre-V_(n+1) calibration step?

**This STAGE writes**: nothing (routing decision only).

Three paths. **Path C is the less-common "design blocked, hold the lot" routing** — split into two variants: **C-1** (missing peer-roasted reference cup) and **Simulated Pourover Gate** (the renamed-from-Path-C-2 path, locked at Item 7 grill 2026-05-24 — see [CONTEXT-roasting.md § Simulated pourover gate](../../CONTEXT-roasting.md) for the full definition). Both halt V_(n+1) design pending the calibration cup; the difference is which cup needs capturing.

### Path A - Lot ready for close-out

Route to `close-lot.md` next, skip STAGES 5 + 6 of this prompt. The leading slot is the lot-level reference roast candidate AND no control experiment is warranted. Signals:

- Cup matches producer-notes ballpark check + Chris's expectations.
- Diminishing returns: the leading slot reads close to "as good as this coffee gets" and the open_questions don't suggest a different region of the response surface would be better.
- Brewing-side confirmation: the leading slot held up at real pourover (the `real_pourover` recipe_variant), not just at the xBloom gate.
- Often (but not required): a control experiment V-set (replicate of the leading slot with two slight adjustments) was already run and confirmed.

**Pre-declaration discipline (Path A push-back duty)** — Phase 1 / Item 34 follow-up / 2026-05-24. Declaring `roasts.is_reference = true` is the **load-bearing cross-domain workflow-transition gate** (see [CONTEXT-roasting.md § Reference roast](../../CONTEXT-roasting.md)) — it transitions the lot from roasting-side iteration to brewing-side optimized-brew dial-in. The declaration must be definite, not ambiguous. **Before confirming Path A, push back if any of these pre-conditions are missing:**

1. **Multiple V-set iterations done** (at least V2 or V3) — Path A on V1 is suspect.
2. **Full Day 7 xBloom cupping done** (`recipe_variant: xbloom_gate` on the candidate batch).
3. **Simulated Pourover Gate cup-set done** — V_n winner + secondary contender + V_(n-1) winner brewed on the real pourover setup with a non-optimized recipe close to end-state.

If SPG hasn't been done, push back with the standard language: *"If you really want to declare this a reference roast, I suggest we do a simulated pourover recipe first."* Re-route to the Simulated Pourover Gate path (see § Simulated Pourover Gate below) and wait for the SPG cup before confirming Path A. Only after the operator has run SPG, compared the cup-set against a couple of contenders, and still wants the designation does Path A proceed to close-out. See [docs/skills/cupping-specialist/SKILL.md § Pre-declaration discipline (Path A push-back duty)](../skills/cupping-specialist/SKILL.md) for the sub-skill spec. **One-shot exemption**: this push-back does NOT apply to one-shot lots (single roast / single cup read; `one-shot-closeout.md` STAGE 2 sets `is_reference = true` directly).

If routing to close-out (post-push-back-cleared), halt this prompt and tell Chris to run `close-lot.md` next. Report STAGE 5 as "skipped - routing to close-out".

### Path B - Design V_(n+1)

Continue to STAGE 5. V_(n+1) is warranted when:

- Open questions remain that V_(n+1) can answer.
- A clear lever was identified but the optimum within it isn't yet pinned down.
- A new variable (held constant in V_1…V_n) is worth probing now that the primary lever is understood.
- Or: this is V_2 / V_3 and you're still in the search space - the adjustment is informed by V_n's cup observations.

V_(n+1) at the same lever with two slight adjustments around the leading slot **is** a control experiment — that's still Path B (a new V-set), not Path C. Control experiments lock in a candidate reference roast within a V-set frame; Path C halts on missing evidence external to a new V-set.

### Path C-1 - Pre-V_(n+1) calibration gate: missing peer-roasted reference cup

Halt V_(n+1) design. State stays **Waiting for next cupping**. The lot needs an external reference cup before V_(n+1)'s design can be calibrated.

Triggered when V_n's cup landed in a plausible zone but Chris doesn't have a peer-roasted version of the same green to calibrate against, AND the seller / a peer roaster has a roasted version available. Canonical case: Fazenda Um — Untold sells a roasted version, Chris hasn't cupped it yet, V1 produced a reasonable but uncalibrated cup. Without the peer reference, V_(n+1)'s adjustment direction is operator-guesswork; with it, the cup-side delta tells you which direction to move.

Distinct from a control experiment (which IS a new V-set replicating the leading slot — that's Path B). Distinct from "design more cuppings on already-roasted V_n beans" — see Simulated Pourover Gate below.

Output:
- Report Path C-1 fired and why.
- List the calibration action Chris needs to take ("buy Untold's roasted Fazenda Um, run a Day 7 pourover, paste the cupping transcript back into a new `log-cupping.md` session referencing the peer-roasted cup").
- Tell Chris the state stays Waiting for next cupping and the lot will re-enter this prompt when the peer cup is captured.

Linked CONTEXT-roasting.md entry: **Pre-V_n calibration gate**.

### Simulated Pourover Gate - Pre-reference-roast decision-support cup (renamed from Path C-2 at Item 7 grill, 2026-05-24)

Halt V_(n+1) design. State stays **Waiting for next cupping**. The V_n leading slot's identity (or the lot's reference-roast call) is provisional pending a simulated-pourover cup brewed on the real pourover setup. See [CONTEXT-roasting.md § Simulated pourover gate](../../CONTEXT-roasting.md) for the full vocabulary.

**Two trigger shapes** — proactive and reactive — both route here:

**Proactive (most common, lived end-of-V-set workflow).** Chris is nearing the reference-roast call — typically V3 or later, roasting-side optimization is hitting diminishing returns, and one of the current V-set's slots is plausibly the lot reference. The xBloom Day-7 gate gave the consistent cross-slot read, but the xBloom-vs-end-optimized-pourover delta is large enough that the gate alone isn't decisive for committing the reference. A simulated pourover step pushes the read closer to the end-state cup before the call. Triggers:

- V_n's xBloom cup landed and at least one slot is plausibly the lot reference (Path A territory).
- Diminishing-returns signal: the V_(n+1) design space feels like fine-tuning, not direction-finding.
- Chris's signal in-thread: "I think these two are worth taking to the simulated pourover step" / "if either one of these go well, I might call one of these as the end reference roast."

**Reactive (less common, original Path C-2 shape).** The V_n leading-slot identity is provisional because cup-side discrimination is missing — V_n was cupped at one recipe_variant only AND prior V-sets showed recipe_variant inversions. A separate **roast-quality concern** can also motivate an SPG read in combination with cup-side ambiguity — most commonly when the leading slot's WB-to-ground Agtron delta is wide enough to signal internal-development risk (per [`docs/skills/roest-knowledge/cluster/machine/counterflow-observations.md` § WB-to-Ground Agtron Delta as Development Signal](../skills/roest-knowledge/cluster/machine/counterflow-observations.md), wide delta = surface ahead of underdeveloped core), but wide delta on its own is **primarily a roast-quality signal, not a routing-decisive SPG trigger** — it argues "the xBloom gate read may be distorted by underdevelopment, worth validating at the real pourover." Canonical lived case: CGLE Sudan Rume Natural V5 (2026-05-21) — V5A's delta 15.7 vs prior reference 169's delta 3.1 raised the roast-quality concern; the simulated pourover discriminated V5A 187 vs reference 169 at a confirmed April Glass recipe. Higuito V3 (cupped at `xbloom_gate` only, V2 showed gate-vs-pourover inversion) is the cup-side-only variant.

Distinct from Path C-1 (which needs an EXTERNAL peer-roasted reference cup); Simulated Pourover Gate needs a NEW BREW of the candidate slots on the already-roasted V_n beans (no machine time required).

**Cup set** — typical cup-set for the simulated-pourover step:
- V_n winner (the leading slot from this V-set).
- V_n secondary contender (the next-best slot in the same V-set, if there's a credible second).
- V_(n-1) winner (the previous V-set's winner) when it's worth carrying as a control baseline.

The simulated-pourover recipe is "much closer in scope to what the end optimized recipe will be" — close enough to give the roast a real shot at expressing the end-state cup, but explicitly NOT the optimized recipe (no full brewing iteration loop here; that happens AFTER reference roast is called, as a separate brewing-side dial-in flow).

Output:
- Report Simulated Pourover Gate fired and why (proactive: nearing reference; reactive: cite the inversion evidence or delta anomaly).
- List the simulated-pourover action Chris needs to take: which slots to brew (V_n winner + secondary + optional V_(n-1) winner), the recipe shape (real pourover setup at confirmed brewer / filter / dose / water / grinder / grind_setting, non-optimized but close-to-end-state), and where to paste the cupping transcript back ("re-enter `log-cupping.md` with the simulated-pourover cup; STAGE 3's `delta_from_cup` and `winner` may need patching once the simulated-pourover cup lands").
- Tell Chris the state stays Waiting for next cupping and the lot will re-enter this prompt when the simulated-pourover cup is captured.

**Schema note (vocabulary locked, migration deferred).** Chris's preference is for the simulated pourover to slot into the `cupping_method` / `eval_method` taxonomy on `cuppings` (it IS a cupping in Chris's mental model), rather than living outside it. The migration adding `eval_method = 'Simulated Pourover'` as a canonical value is gated on the full POD-1 rewrite sprint — see [`docs/skills/cupping-specialist/cluster/pod-1-routing.md`](../skills/cupping-specialist/cluster/pod-1-routing.md) § Schema scoping. Today's simulated-pourover cups are pushed as `cuppings` rows with the closest existing `eval_method` + `recipe_variant: real_pourover` + a free-text note flagging the simulated-pourover purpose.

## STAGE 5 - Design V_(n+1) (Path B only)

**This STAGE writes**: `experiments` row (V_{n+1}), `roast_recipes` rows × N, Roest tablet profiles × N (via `push_roast_profile`), `roast_recipes` patches linking Roest profile IDs back.

Read cluster-migrated sections via `read_doc(uri=...)`:

- `docs://skills/roest-knowledge/cluster/protocols/fan-strategy.md` — Standard Inlet Curve Template + Fan Strategy (migrated from ROASTING.md in Wave 3 PR 1).
- `docs://skills/roasting-historian/cluster/patterns/cross-coffee-insights.md` — relevant lessons from prior similar lots (migrated in Wave 2 PR 3).

Read the lot's per-lot working hypothesis in the Roasting Historian cluster (Active Lots migrated to one file per lot in Wave 2 PR 3 / 2026-05-26):

- `docs://skills/roasting-historian/cluster/active-lots/<lot-slug>.md` for the current lot's working hypothesis + per-lot protocol notes. Resolve `<lot-slug>` via `list_docs` against `skills/roasting-historian/cluster/active-lots/` if uncertain.

### Adjustment scale rule

The adjustment from V_n → V_(n+1) is scale-dependent. Calibrate the spread based on V_n's V number AND what V_n's cup signal taught:

- **V1 → V2**: typically still wide, often multi-variable. V1 was exploratory; V2 narrows on V1's signal but stays wide-ish when V1's leading slot wasn't unambiguous. Don't force narrow when the response surface still feels under-explored.
- **V2 → V3**: narrow on V2's leading slot, usually single-variable. 1-2°C peak spread is typical, or replicate V2's leading slot with two slight adjustments (a control experiment).
- **V3 → V4+**: probe a NEW variable held constant in V_1…V_3 (fan curve through development, drop temp ceiling at fixed peak inlet, charge temperature, hopper pre-load), or run a control experiment to lock in the reference roast.

Override: if V_n's `open_questions` explicitly demand re-bracketing ("we don't know if the window is in this range at all"), widen the spread regardless of V number.

### V_(n+1) experiment frame

Draft six fields:

- `context`: cites V_n's resolved finding + the chosen open_question that V_(n+1) addresses.
- `primary_question`: what V_(n+1) is asking. Usually frames the chosen open_question + the lever being probed.
- `control_baseline`: V_n's leading slot, cited with its peak inlet / drop temp / profile name so V_(n+1) has a comparison anchor.
- `shared_constants`: hopper pre-load 125°C, charge 117°C, preheat air 210°C, fan curve, RPM, drum direction - recover from V_n's recipes via `get_bean_pipeline`. Sanity-check that you're holding the lot's existing protocol constant.
- `levels_tested`: the values the variable takes across V_(n+1)a / b / c (or just a / b for a 2-slot control experiment).
- `expected_outcomes`: predicted roast-layer outcomes (FC / total / Agtron) AND predicted cup-layer outcomes per slot. Both layers required.

Plus `failure_boundary` (what "broken" looks like across the slots) and `variable_changed` (the primary axis being probed).

### Write V_(n+1) - three calls pair up, do all three

(a) `push_experiment(payload)`:
- `green_bean_id` from STAGE 1
- `experiment_id`: `<LOT-PREFIX>-V<n+1>` (same prefix as V_n, increment V number)
- `batch_ids`: omit entirely at design time (leave NULL). `log-roast.md` populates when V_(n+1) is roasted. Do NOT pass the string `"null"`.
- Frame fields from above.

(b) `push_roast_recipe(payload)` × N:
- `green_bean_id`, `experiment_id` (UUID from `push_experiment`'s `experiment_pk` response), `batch_slot` (`v<n+1>a`, `v<n+1>b`, `v<n+1>c`), `recipe_name`, optional `parent_recipe_id` (when V_(n+1) slot is directly informed by V_n's slot — including a shifted spread anchored on that slot, not only strict replication; set parent to V_n's recipe_id to make the lineage queryable).
- `rationale`: per-batch Hypothesis prose.
- Curve definition: `temperature_bezier`, `fan_bezier`, `rpm_bezier` (jsonb). `power_bezier` MUST be null on INLET_TEMP profiles.
- `end_condition_type` + `end_condition_target`, `charge_temp`, `hopper_load_temp`, `preheat_temperature_c`.
- Design-time predictions: `predicted_fc_temp`, `predicted_fc_time`, `predicted_total_time`, `predicted_maillard_pct`, `predicted_agtron_wb`, `predicted_cup` (1-2 sentences). These are frozen at recipe-creation time.
- Drop rules: `drop_rule_if_fast`, `drop_rule_if_slow`.

(c) `push_roast_profile(payload)` × N - same beziers, writes to Roest tablet only. `enable_share: true`. Returns `profile_id` + `share_url`. After it returns, `patch_roast_recipe` to link `roest_profile_id` + `roest_share_url` + `roest_profile_name` + `pushed_to_roest_at` on the matching recipe row.

## STAGE 6 - Optional: propose cluster-doc update

**This STAGE writes**: `doc_proposals` row (one multi-citation proposal), OR nothing if skipped.

Post-cupping is the natural moment for cluster-doc updates - cup signal is the strongest evidence. Route by SHAPE of the insight:

- **Lot-state change** (new working hypothesis going into V_(n+1), narrowing confidence band) → per-lot file at `docs/skills/roasting-historian/cluster/active-lots/<lot-slug>.md` (replace); citation `target_doc: 'skills/roasting-historian/cluster/active-lots/<lot-slug>.md'`.
- **Protocol-level insight** confirmed by this V_n's cupping ("audibility count is diagnostic-primary on silent-FC lots", "anaerobic naturals tolerate drop ceiling 1°C above the Sudan-Rume-Washed-derived 207°C") → appropriate workflow / protocol cluster doc — FC Marking Protocol at `docs://skills/roest-knowledge/cluster/protocols/fc-marking.md`; Drop Temp as the Primary Drop Signal subsection at `docs://skills/roest-knowledge/cluster/machine/counterflow-observations.md#drop-temp-as-the-primary-drop-signal`; Between Batch Protocol at `docs://skills/roest-knowledge/cluster/protocols/between-batch-protocol.md`. Use citation `target_doc: 'skills/roest-knowledge/cluster/<file>.md'`. REPLACE when contradictory; APPEND when additive.
- **Cross-coffee pattern** (NOT protocol-level - e.g. "naturals from this farm carry distinctive lemongrass", "84-hour anaerobic produces silent FC") → Roasting Historian's Cross-Coffee Insight Layer at `docs://skills/roasting-historian/cluster/patterns/cross-coffee-insights.md` (append with confidence marker matching `key_insight_confidence`); citation `target_doc: 'skills/roasting-historian/cluster/patterns/cross-coffee-insights.md'`.
- **Per-lot FC ceiling calibration** confirmed by V_n → FC Floor & Ceiling subsection of Cross-Coffee Insight Layer at `docs://skills/roasting-historian/cluster/patterns/cross-coffee-insights.md` (append with confidence marker).

Fetch live anchors via `read_doc(uri="docs://skills/<cluster-path>.md")` (or `read_doc_section` against the same URI) BEFORE drafting. Submit as a single multi-citation `propose_doc_changes` call with per-citation `target_doc: "skills/<cluster-path>.md"` matching where each insight routes (`'roasting.md'` is deprecated post Wave 4 PR 4b per ARBITER.md § target_doc routing). Citations: `[{section_anchor, op, proposed_text, current_text, target_doc?}]`.

### When to skip and report why

Defer the proposal to the next round when downstream evidence is imminent and would either confirm or invalidate the insight:

- **Simulated Pourover Gate fired** (simulated-pourover cup pending). The cup-side leading-slot identity or reference-roast call is provisional; doc-changes citing the provisional leading slot would need re-issuing once the simulated-pourover cup lands. Skip and tell Chris the proposal queues for the post-simulated-pourover session.
- **V_(n+1) is imminent and would directly test the insight**. E.g. "V3 hypothesized peak-inlet-is-the-lever, V4 is designed to probe drop ceiling at fixed peak — V4's cupping will confirm whether peak-inlet-is-the-lever generalizes or is only the V3-zone lever". Skip; the V_(n+1) cupping will either promote the insight to Medium-High or knock it back to Low.
- **`key_insight_confidence` is Low**. Low-confidence insights belong in `additional_notes` on the experiment row, NOT in cluster docs. The CCIL append threshold is Medium minimum.

In all three cases, print one line: `STAGE 6: skipped - <reason>`. Don't fabricate a proposal just to fill the stage.

AVOID editing mid-iteration: Recently Closed Lots, Reference Brew Recipes by Lot - close-out artifacts owned by `close-lot.md`.

## STAGE 7 - Confirmation output

**This STAGE writes**: nothing (output only).

Print:

- `green_bean_id`
- STAGE 0 backfill summary (if it ran): "Backfilled <N> recipe rows + <M> experiment-slot fields" OR "STAGE 0: skipped - fresh-from-rewrite lot".
- **V_n close-out summary**:
  - For each cupped slot: `cupping_id`, `composite_key`, ground_agtron + WB→Gnd delta, leading-slot determination one-liner
  - `experiment_pk` (V_n) + `updated_fields: [...]` from patch_experiment
  - `winner` (leading slot) - phrased `"V<n><letter> (Batch <Roest#>)"`
  - `key_insight` + `key_insight_confidence`
- **Routing decision**: Path A (close-out) or Path B (design V_(n+1)) or Path C-1 (peer-cup calibration) or Simulated Pourover Gate (pre-reference-roast decision-support cup; renamed from Path C-2 2026-05-24).
- **If Path B**:
  - `experiment_pk` (V_(n+1)) + `experiment_id`
  - For each V_(n+1) slot: `recipe_id`, `batch_slot`, `roest_profile_id`, `roest_share_url`, end condition, design-time prediction summary
  - Roest tablet name table:
    ```
    | Slot | Profile name | End condition | Roest URL |
    ```
- **If Path C-1 or Simulated Pourover Gate**: the calibration action Chris needs to take (peer-cup acquisition or simulated-pourover cup respectively), plus the re-entry instruction.
- `proposal_id` from `propose_doc_changes` (if STAGE 6 ran), or `STAGE 6: skipped - <reason>`.
- Lifecycle state confirmation:
  - Path A: "V_n closed. Lot state: **Resolved-pending**. Next step: `close-lot.md`."
  - Path B: "V_n closed, V_(n+1) designed. Lot state flipped to **Waiting for next roast**. Next step: roast V_(n+1) at the machine, then run `log-roast.md`."
  - Path C-1 / Simulated Pourover Gate: "V_n cuppings recorded; V_(n+1) design held pending <calibration action>. Lot state stays **Waiting for next cupping**. Next step: <calibration action>, then re-enter `log-cupping.md`."

## What this prompt does NOT do

- Push roast learnings (`push_roast_learnings`). That's `close-lot.md` - happens once at lot close-out after the lot-level reference roast is declared.
- Declare a lot-level reference roast (set `roast_learnings.best_roast_id`). That's `close-lot.md`. The V-set-level `experiments.winner` (leading slot) is what this prompt sets.
- Dial in the optimized brew. That's part of `close-lot.md`'s flow.
- Archive the Roest inventory row. `close-lot.md` does that at lot close-out.
