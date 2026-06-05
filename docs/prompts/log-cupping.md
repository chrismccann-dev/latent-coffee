# log-cupping.md

## Purpose

This prompt runs when Chris starts the cupping portion of a V-set roast cycle.

Chris has already roasted a V-set, usually three slots such as V2a / V2b / V2c. The roasts have rested around the Day 7 gate. Chris then cups the slots side-by-side, usually on the xBloom gate recipe, while looking at the Latent app's **Taste For** section. He records an audio note that references the batch numbers written on the bags. This prompt receives that transcript and turns it into structured Latent records, then decides and sets up the next step.

This file owns the **cupping procedure**:

1. Resolve the lot, V-set, slots, batches, roasts, recipes, prior predictions, and Taste For prompts.
2. Push one cupping row per cupped slot.
3. Patch the just-cupped experiment row with cup deltas, observed outcomes, leading slot, key insight, open questions, and next-step implications.
4. Route the lot: close-out (-> `close-lot.md`), design the next V-set inline, or hold for a calibration cup.

This file does **not** re-define roasting concepts. Those live in `CONTEXT-roasting.md`. When a concept is needed, read the relevant section there and keep this prompt procedural.

> **Forward note (roasting-coordinator workflow, roadmap).** STAGE 6 (design V_(n+1)) and STAGE 7 (propose doc changes) currently run inline here. Whether they should move out into a dedicated roast-design skill + docs workflow is a real question — but it must be designed against the *whole* roast flow, not just the cupping side, so it lives on the product roadmap, not in this prune. Today's behavior is unchanged: this prompt still designs the next V-set and proposes doc changes inline.

## Workflow position

Lifecycle:

```text
start-lot.md -> log-roast.md <-> log-cupping.md -> close-lot.md
```

This prompt runs once per V-set cupping session, looping with `log-roast.md` (roast -> cup -> roast -> cup) and incrementing V-sets until a reference roast is reached.

State transition after this prompt:

- **Waiting for next roast** when the result routes to another V-set (V_(n+1) designed inline).
- **Resolved-pending** when the lot should move to `close-lot.md`.
- **Waiting for next cupping** when a calibration cup or Simulated Pourover Gate is needed before designing the next V-set.

## Required context pointers

`CONTEXT-roasting.md` is the source of truth for terminology and conceptual rules. Read these sections as needed (do not re-derive them here):

- **Reading order for agents -> Task-based path -> Logging a cupping** (and -> Designing V_n+1 after cupping)
- **Cupping and cup-character interpretation**
- **V-set close synthesis** (+ **Key-insight confidence ladder**)
- **Reference designation terms** (+ **Reference candidate**, **Reference Cup**, **Leading Slot**)
- **Rest-days drift**
- **Pre-V_n calibration gate**
- **Simulated Pourover Gate system** (+ **Simulated Pourover Packet**, **SPG standing recipe**, **`eval_method: 'Simulated Pourover'`**)
- **Adjustment** (+ **Operator-fixed constants**, **Control experiment**, **Acceptable roast window**)
- **Schema notes -> Backfilled recipe**

High-risk pairs to keep straight (full definitions in `CONTEXT-roasting.md -> High-risk term pairs`):

- leading slot vs reference candidate vs reference roast
- reference cup vs optimized brew
- variable vs lever vs non-factor
- Simulated Pourover Packet vs Simulated Pourover Gate vs SPG standing recipe
- rest behavior vs rest-days drift
- recipe vs Roest profile

## Inputs Chris typically provides

All or some of: `lot_id` or `green_bean_id`; the V-set being cupped (e.g. `V3`); batch numbers for the slots (e.g. `187 / 188 / 189`); cupping date; roast date or stated rest days; the cupping transcript; whether the session was the standard xBloom gate, a real pourover, a Simulated Pourover Gate, or a peer-roasted reference cup; an optional explicit candidate / route preference.

If batch numbers are present, use them to map notes back to slots. Do not rely on slot order alone when batch numbers are available.

## Tools for this session

```text
get_green_bean        get_bean_pipeline
push_cupping          patch_cupping
patch_experiment      patch_roast
push_experiment       push_roast_recipe      patch_roast_recipe
push_roast_profile
read_doc              read_doc_section        list_doc_sections        read_canonical
propose_doc_changes
```

MCP namespace: tools surface under `Latent Coffee`.

## Operating principles

- Transcript first. Preserve Chris's tasting language where it is clear.
- Taste For is a guide, not a script. Use it to reconcile the cup, not to force descriptors Chris did not taste.
- No fabrication. If a required slot, batch, roast, recipe, date, or prediction is missing and cannot be recovered from the pipeline or transcript, halt and report the missing piece.
- Keep concepts single-sourced. Point to `CONTEXT-roasting.md` instead of copying long definitions here.
- Keep writes narrow. Each stage writes only the fields it owns.

---

## STAGE 0 - Optional state-shape migration (pre-rewrite lots only)

**Writes:** `roast_recipes.predicted_cup`, `experiments.updated_cup_prediction_*`, `experiments.taste_for_*`, and (only for missing-recipe-row cases) `roasts.recipe_id`.

Almost always skipped — every live lot is post-rewrite. Run a minimal `get_bean_pipeline` read and check the V_n being cupped. Detection fires only when ALL hold:

- V_n experiment row exists with `batch_ids` populated.
- `updated_cup_prediction_a` IS NULL.
- One or more V_n recipe rows have `predicted_cup` NULL, OR the V_n roast rows lack linked recipe rows.

If detection does NOT fire, print `STAGE 0: skipped - fresh-from-rewrite lot` and continue to STAGE 1.

If it DOES fire (a pre-rewrite lot is being re-cupped), the full backfill procedure is archived at [`log-cupping-stage0-migration.md`](log-cupping-stage0-migration.md) — pull it in, run the backfill (one-pass, evidence-only, no fabrication), print `STAGE 0: backfilled <N> recipe rows + <M> experiment-slot fields`, then continue.

---

## STAGE 1 - Resolve lot, V-set, and comparison frame

**Writes:** nothing.

1. If Chris gave `lot_id`, call `get_green_bean({ lot_id })` to get `green_bean_id`.
2. Call `get_bean_pipeline({ green_bean_id })`.

Build a session work packet: `green_bean`; the V_n experiment row; per slot the roast row, batch number, recipe row, recipe `predicted_cup`, experiment `updated_cup_prediction_*`, and `taste_for_*`; prior V-set leading slots / reference candidates when relevant; prior cuppings needed for comparison or SPG routing.

Validation (halt on failure):

- V_n exists.
- V_n `batch_ids` is populated — if not, `log-roast.md` has not completed; halt and report.
- Each cupped batch maps to exactly one roast row — if ambiguous, halt and list the candidates.
- Recipe linkage exists, unless STAGE 0 recovered it.
- Dates are sufficient to compute `rest_days`, or mark date/rest ambiguity in the confirmation output.

---

## STAGE 2 - Parse transcript into slot notes

**Writes:** nothing.

Map transcript references to slots: prefer explicit batch numbers; use slot names (V2a/b/c) if stated; use order only when the transcript clearly states it and no batch numbers exist.

For each slot, extract: aroma, flavor, acidity, sweetness, body, finish, overall, temperature behavior, aromatic behavior, structural behavior; plus defect / underdevelopment / overdevelopment signs, direct comparison statements, preference / ranking, and uncertainty language.

Rules:

- Use Chris's language where possible; synthesize only when the transcript is fragmentary but the meaning is clear.
- Leave a field NULL when the transcript does not support it.
- Do not collapse sweetness into acidity or body (it is a distinct axis; collapsing it makes it uncross-queryable).
- Do not turn a Taste For prompt into observed cup notes unless Chris tasted it.

---

## STAGE 3 - Push cupping rows

**Writes:** `cuppings` rows via `push_cupping`, one per cupped slot.

Required mapping per slot:

- `roast_id`: from STAGE 1 (NEVER the batch number).
- `cupping_date`: `YYYY-MM-DD`.
- `rest_days`: integer from roast date to cupping date.
- `eval_method`: `"Pourover"` for the standard Day 7 xBloom gate; `"Cupping"` for the legacy bowl defect-screen; `"Simulated Pourover"` for an SPG cup.
- `recipe_variant`: `"xbloom_gate"` when this is the standardized gate and a later real-pourover/SPG comparison is plausible; `"real_pourover"` for an optimized daily-consumption cup; a clear SPG label only to disambiguate variants (keep `eval_method: "Simulated Pourover"`); leave NULL only when a second same-day/same-method variant is unlikely. The composite key is NULLS NOT DISTINCT, so two unlabeled cuppings collapse into one row.
- The ten prose fields: `aroma`, `flavor`, `acidity`, `sweetness`, `body`, `finish`, `overall`, `temperature_behavior`, `aromatic_behavior`, `structural_behavior`. (Definitions: `CONTEXT-roasting.md -> Cupping and cup-character interpretation`.) The transcript usually carries temperature-evolution + aromatic-presentation + structural observations — route those to `temperature_behavior` / `aromatic_behavior` / `structural_behavior`, NOT into `body` / `finish` / `overall`. `sweetness` is a distinct axis from `acidity` / `body` — don't fold it in.
- `cooling_arc_pattern`: canonical 4-value enum for the SHAPE of the cooling arc, set ALONGSIDE the `temperature_behavior` prose (not instead of it). Pick `degrade` (cools worse — loses balance / turns bitter / flattens), `hold` (good and steady, no meaningful change), `improve` (opens up / gains sweetness / integrates better as it cools), or `flat` (low-amplitude, muted, little movement either way — distinct from `hold`). This is the queryable mirror of the prose so cross-lot "which lots cooling-arc degrade vs hold" works without regex. Leave NULL when the transcript doesn't speak to the cooling arc. A non-canonical value is rejected.
- `ground_agtron` when Chris provides it. `wb_agtron` is auto-snapshot from the joined roast; `wb_to_ground_delta` is generated — report it in confirmation when available.

Rest-days drift (apply the row-level prose flag only; interpretation lives in `CONTEXT-roasting.md -> Rest-days drift`):

- Day 7 target; Day 6-10 acceptable.
- Hard server guard (Cluster 2 / migration 078): `push_cupping` / `patch_cupping` REJECT a `cupping_date` that is not at least 1 day after the roast's `roast_date`, a negative `rest_days`, or a `rest_days` that disagrees with `cupping_date − roast_date` by more than 1 day. This catches voice-to-text date slips (a bare "March 31" dictated with no day-of-week landing a negative rest). If a push is rejected for this, re-confirm the cupping_date with Chris rather than guessing — don't work around it by zeroing `rest_days`.
- If `rest_days` is outside 6-10, or stated rest days don't match the dates, prefix `additional_notes`: `REST_DAYS_DRIFT: cupped Day <N>, off the Day 7 gate by <delta>`.
- For cross-V-set SPG / runoff comparisons where an older candidate is structurally disadvantaged, also prefix the older row's `additional_notes`: `REST_DAYS_DRIFT_COMPARISON: SPG / candidate-runoff vs V_n at Day <N>, +<delta> days older`.

UPSERT behavior: `push_cupping` UPSERTs on `(user_id, roast_id, cupping_date, eval_method, recipe_variant)`. Re-pushing is safe (`created: false`, fields NOT overwritten); use `patch_cupping` for corrections. Capture `cupping_id` + echoed `composite_key` per slot.

---

## STAGE 4 - Patch the V_n experiment close-out

**Writes:** V_n experiment fields via `patch_experiment`, plus the leading-slot reference-candidate flag via `patch_roast`. Writing model: `CONTEXT-roasting.md -> V-set close synthesis`.

**4.1 Per-slot cup deltas** — patch `delta_from_cup_a/b/c/d` for cupped slots. Each reconciles: actual cup vs `updated_cup_prediction_*`; vs `taste_for_*`; vs prior V-set memory (when relevant); vs the specific adjustment tested in V_n; and a producer-notes ballpark check. Keep it compact — the goal is an accurate roast-prediction -> cup-evidence trace, not an essay.

**4.2 Observed outcomes** — patch `observed_outcome_a/b/c/d`. EXTEND existing roast-side observations from `log-roast.md`; do not overwrite. The same field carries both layers.

**4.3 Leading slot** — patch `experiments.winner`, formatted strictly `V<n><letter> (Batch <Roest#>)` (e.g. `V5C (Batch 189)`). Do NOT append verdict prose to `winner` — rationale goes in `key_insight` / `additional_notes` / `what_changes_going_forward`. (Leading slot = winner of this V-set's comparison; distinct from reference candidate and reference roast — see `CONTEXT-roasting.md -> Reference designation terms`.)

**4.4 V-set insight fields** — patch:

- `key_insight`: 2-4 sentences on what V_n taught.
- `key_insight_confidence`: the enum from `CONTEXT-roasting.md -> Key-insight confidence ladder`. If unsure between two levels, pick the lower and explain in `additional_notes`.
- `what_changes_going_forward`: forward-looking + actionable ("V_(n+1) should...").
- `open_questions`: interrogative (questions V_n did not answer; these inform V_(n+1)'s `primary_question`).
- `additional_notes`: descriptive cross-slot narrative that fits nowhere else.

Field split: forward + actionable -> `what_changes_going_forward`; interrogative -> `open_questions`; descriptive / comparative / verdict rationale -> `additional_notes`. Apparent variable -> lever / non-factor signals may be described in `key_insight`, but the final lot-level promotion belongs in close-out synthesis, not here.

`patch_experiment` echoes `updated_fields` + `canonical_values: { key_insight_confidence }` — confirm the enum landed.

**4.5 Reference-candidate flag** — after identifying the leading slot, assess reference quality and patch the leading-slot roast: `patch_roast(roast_id: <leading_slot_roast_id>, is_reference_candidate: true|false)`. This prompt OWNS this flag (it is a cup-quality judgment, set here on cup grounds — not at roast time). `true` when the leading slot is plausibly lot-reference quality; `false` (or leave default) when it is only "best of the set." Do NOT set `roasts.is_reference` — that is `close-lot.md`'s at close-out. Multiple V-sets can each carry a candidate; only one becomes `is_reference` at close-out. **If `winner` is null because a calibration gate fired (Path C-1 / C-2 / SPG):** set no candidate flag — there is no leading slot to assess, so the reference-quality question is moot. Defer it to the post-calibration re-entry, when the gate cup resolves the leading slot.

---

## STAGE 5 - Route decision

**Writes:** nothing (routing only).

Choose exactly one path. (Conceptual definitions for all paths: `CONTEXT-roasting.md -> Pre-V_n calibration gate` and `-> Simulated Pourover Gate system`.)

### Path A - Ready for close-out

Route to `close-lot.md` (skip STAGES 6-7). Signals: the leading slot is a plausible lot-level reference roast; producer-notes ballpark + Chris's expectations are satisfied; diminishing returns (open questions don't point at a better region of the response surface); the leading slot held up at the Simulated Pourover Gate; often (not required) a control experiment already confirmed it.

**Pre-declaration discipline (push-back duty).** Declaring `roasts.is_reference = true` is the load-bearing cross-domain workflow-transition gate (`CONTEXT-roasting.md -> Cross-domain workflow-transition gate`). Before confirming Path A, push back if any precondition is missing: (1) multiple V-set iterations done (Path A on V1 is suspect); (2) full Day 7 xBloom cupping done; (3) Simulated Pourover Gate cup-set done. If SPG hasn't run, push back: *"If you really want to declare this a reference roast, I suggest we do a simulated pourover recipe first,"* and re-route to the SPG path below. **One-shot exemption:** this push-back does NOT apply to one-shot lots.

If routing to close-out (post-push-back-cleared): halt and tell Chris to run `close-lot.md`. Report STAGES 6-7 as "skipped - routing to close-out".

### Path B - Design V_(n+1)

Continue to STAGE 6. Warranted when: open questions remain that V_(n+1) can answer; a lever was identified but its optimum isn't pinned; a new variable is worth probing now the primary lever is understood; or this is V2/V3 still in search space. A V_(n+1) at the same lever with two slight adjustments around the leading slot IS a control experiment — still Path B.

**Operator-fixed constants are off the table — even conversationally.** Before floating ANY lever with Chris (here at route time, before the STAGE 6 design read), recall that charge / hopper pre-load / BBP / warm-up / preheat air are operator-discipline constants — never varied across V-sets, beans, or roast types. Do NOT offer one of these as a candidate adjustment in conversation; only recipe-level levers (peak inlet / temperature curve / fan curve / drum speed / drop temp / end condition / dev-time-relative-to-FC) are in scope. Full list + rationale loads in STAGE 6 and `CONTEXT-roasting.md -> Operator-fixed constants` — this callout exists so an invalid lever isn't proposed before that read happens.

### Path C-1 - Pre-V_(n+1) calibration gate (missing peer-roasted reference cup)

Halt V_(n+1) design; state stays **Waiting for next cupping**. Fires when V_n landed in a plausible but uncalibrated zone, Chris lacks a peer-roasted version of the same green, and the seller / a peer roaster has one available (canonical case: Fazenda Um). Distinct from a control experiment (Path B) and from the SPG (needs a NEW brew of already-roasted beans, not an external cup).

Output: report Path C-1 fired + why; list the calibration action ("buy the peer-roasted version, run a Day 7 pourover, paste the transcript into a new `log-cupping.md` session"); state stays Waiting for next cupping; lot re-enters this prompt when the peer cup is captured.

### Path C-2 - Simulated Pourover Gate

Halt V_(n+1) design; state stays **Waiting for next cupping**. The leading-slot identity (or the reference-roast call) is provisional pending a simulated-pourover cup on the real pourover setup. Full definition + trigger shapes (proactive: nearing the reference call, xBloom-vs-end-optimized delta too large to commit; reactive: cup-side discrimination missing or a wide WB->Ground delta raises a roast-quality concern): `CONTEXT-roasting.md -> Simulated Pourover Gate system`.

The SPG **recipe is not designed here** — it is dialed in a dedicated brewing thread running `simulated-pourover.md`. This prompt emits a thin handoff packet and stops. Cup-set logic (V_n winner + secondary contender + optional V_(n-1) winner) decides the finalists.

Emit the **SIMULATED POUROVER PACKET** for the operator to paste into a fresh `simulated-pourover.md` thread — exactly these lines, no cupping notes / roast data / recipe (the brewing side derives the recipe from the green + lot history):

```text
SIMULATED POUROVER PACKET
- green_bean_id: <the lot's green_bean_id>
- lot: <name / lot_id>
- finalist batches: <finalists, e.g. 191, 192>
- intent: <diagnostic — what's wrong with the current gate read> + <test — what the SPG should differentiate>
```

The `intent` line is two-part: a **diagnostic** (what's wrong with the current gate read — e.g. "xbloom amplifying dark-tea, masking deeper producer notes") and a **test** (what the SPG should differentiate — e.g. "which roast preserves the bright/berry side under non-dark-leaning extraction"). Do NOT duplicate producer / origin / process in the intent — the brewing side fetches the green via `get_green_bean` for full lot context.

State stays Waiting for next cupping; the lot re-enters this prompt when the SPG cup is captured (on re-entry, STAGE 4's `delta_from_cup` / `winner` may need patching). When the SPG cup returns, push it per finalist with `eval_method: 'Simulated Pourover'` (one row per finalist `roast_id`); recipe metadata goes in `additional_notes` free-text using the canonical phrasing `SPG: brewed alongside <finalist sibling roast_id> at <SPG recipe>` so cross-lot SPG queries grep consistently until the `eval_method` migration lands. See `CONTEXT-roasting.md -> eval_method: 'Simulated Pourover'`.

---

## STAGE 6 - Design V_(n+1) (Path B only)

**Writes:** `experiments` row (V_{n+1}); `roast_recipes` rows × N; Roest tablet profiles × N (via `push_roast_profile`); `roast_recipes` patches linking the Roest profile IDs back.

Read before designing:

- `docs://skills/roest-knowledge/cluster/protocols/fan-strategy.md` — Standard Inlet Curve Template + Fan Strategy.
- `docs://skills/roasting-historian/cluster/patterns/cross-coffee-insights.md` — lessons from prior similar lots.
- `docs://skills/roasting-historian/cluster/active-lots/<lot-slug>.md` — the current lot's working hypothesis + per-lot protocol notes (resolve `<lot-slug>` via `list_docs` if uncertain).
- **Peer-variant handoff:** if the green row has `peer_reference_brew_id` set, read `docs://skills/peer-learning-roasting-archivist/cluster/peer-variant-handoffs.md` and fold the roast-design takeaway + discount list into the design, weighted by the handoff's information-value rating. Skip if no `peer_reference_brew_id`.

**Operator-fixed constants:** do NOT vary charge / hopper pre-load / BBP / warm-up / preheat air — these are operator-discipline constants, never varied. Vary only recipe-level levers (peak inlet / temperature curve / fan curve / drum speed / drop temp / end condition / dev-time-relative-to-FC). Full list + empirical rationale: `CONTEXT-roasting.md -> Operator-fixed constants` (+ `docs://skills/roest-knowledge/cluster/protocols/between-batch-protocol.md`). Proposing a charge/hopper/BBP change is structurally invalid.

**Adjustment scale:** calibrate the V_n -> V_(n+1) spread by V number + what V_n's cup taught, per `CONTEXT-roasting.md -> Adjustment` (V1->V2 wide/multi-variable; V2->V3 narrow/single-variable or control experiment; V3->V4+ probe a new variable or lock the reference). Override and widen if `open_questions` demand re-bracketing.

**V_(n+1) experiment frame** — draft: `context` (cites V_n's resolved finding + the chosen open_question), `primary_question`, `control_baseline` (V_n's leading slot with its peak inlet / drop temp / profile name), `shared_constants` (recover from V_n's recipes), `levels_tested` (the values across a/b/c), `expected_outcomes` (predicted roast-layer AND cup-layer per slot — both required). Plus `failure_boundary` and `variable_changed`.

**Write — three calls, do all three:**

(a) `push_experiment`: `green_bean_id`; `experiment_id` = `<LOT-PREFIX>-V<n+1>`; omit `batch_ids` at design time (NULL; `log-roast.md` populates — do not pass `"null"`); frame fields from above.

(b) `push_roast_recipe` × N: `green_bean_id`, `experiment_id` (UUID from the `push_experiment` response), `batch_slot` (`v<n+1>a/b/c`), `recipe_name`, optional `parent_recipe_id` (set to V_n's recipe_id when the slot is informed by it — including a shifted spread anchored on it — to keep lineage queryable); `rationale` (per-batch hypothesis); curves `temperature_bezier` / `fan_bezier` / `rpm_bezier` (jsonb — `power_bezier` MUST be null on INLET_TEMP profiles); `end_condition_type` + `end_condition_target`, `charge_temp`, `hopper_load_temp`, `preheat_temperature_c`; design-time predictions `predicted_fc_temp` / `predicted_fc_time` / `predicted_total_time` / `predicted_maillard_pct` / `predicted_agtron_wb` / `predicted_cup` (frozen at creation); drop rules `drop_rule_if_fast` / `drop_rule_if_slow`.

(c) `push_roast_profile` × N: same beziers, writes to the Roest tablet only, `enable_share: true`. Returns `profile_id` + `share_url`. After it returns, `patch_roast_recipe` to link `roest_profile_id` + `roest_share_url` + `roest_profile_name` + `pushed_to_roest_at` on the matching recipe row.

---

## STAGE 7 - Propose cluster-doc update (optional)

**Writes:** one multi-citation `doc_proposals` row, OR nothing if skipped.

Post-cupping is the natural moment for cluster-doc updates — cup signal is the strongest evidence. Route by the SHAPE of the insight:

- **Lot-state change** (new working hypothesis going into V_(n+1), narrowing band) -> per-lot file `skills/roasting-historian/cluster/active-lots/<lot-slug>.md` (REPLACE).
- **Protocol-level insight** confirmed by this cup -> the matching `skills/roest-knowledge/cluster/...` doc (FC marking / drop-temp / between-batch). REPLACE when contradictory; APPEND when additive.
- **Cross-coffee pattern** (not protocol-level) -> `skills/roasting-historian/cluster/patterns/cross-coffee-insights.md` (APPEND with a confidence marker matching `key_insight_confidence`).
- **Per-lot FC ceiling calibration** -> the FC Floor & Ceiling subsection of the same cross-coffee-insights doc (APPEND with marker).

Fetch live anchors via `read_doc` (or `read_doc_section`) BEFORE drafting. Submit ONE multi-citation `propose_doc_changes` call with per-citation `target_doc: "skills/<cluster-path>.md"` (the `'roasting.md'` target is deprecated). Citations: `[{section_anchor, op, proposed_text, current_text, target_doc?}]`.

**Skip** and report why when downstream evidence is imminent: SPG fired (leading-slot identity provisional); V_(n+1) is designed to directly test the insight; or `key_insight_confidence` is Low (Low belongs in `additional_notes`, not cluster docs — the CCIL append threshold is Medium minimum). Print `STAGE 7: skipped - <reason>`. Don't fabricate a proposal to fill the stage. AVOID editing close-out artifacts (Recently Closed Lots, Reference Brew Recipes) — those are `close-lot.md`'s.

---

## STAGE 8 - Confirmation output

**Writes:** nothing.

Print a compact confirmation:

- `green_bean_id`, `lot_id`, `v_set`.
- STAGE 0: backfill summary, or `skipped - fresh-from-rewrite lot`.
- **V_n close-out:** per cupped slot — `cupping_id`, `composite_key`, `ground_agtron` + WB->Gnd delta, leading-slot one-liner; the `experiment_pk` + `updated_fields`; `winner` (`V<n><letter> (Batch <Roest#>)`, OR `deferred pending SPG` when a calibration gate fired and the leading slot is unresolved — never a slot id in that case); `key_insight` + `key_insight_confidence`; reference-candidate patch (`roast_id`, `is_reference_candidate`), or `none — winner deferred` when a gate fired.
- **Route:** Path A / Path B / Path C-1 / Path C-2.
- **If Path B:** `experiment_pk` (V_(n+1)) + `experiment_id`; per slot `recipe_id` / `batch_slot` / `roest_profile_id` / `roest_share_url` / end condition / design prediction; a Roest tablet name table (`| Slot | Profile name | End condition | Roest URL |`).
- **If Path C-1 / C-2:** the calibration action + re-entry instruction (and, for C-2, the SIMULATED POUROVER PACKET).
- STAGE 7: `proposal_id`, or `skipped - <reason>`.
- Lifecycle state confirmation: Path A -> "Resolved-pending. Next: `close-lot.md`." Path B -> "Waiting for next roast. Next: roast V_(n+1), then `log-roast.md`." Path C -> "Waiting for next cupping. Next: <calibration action>, then re-enter `log-cupping.md`."
- Any missing data / assumptions, rest-days-drift flags applied, skipped cuppings, and fields left NULL for weak transcript evidence.

---

## What this prompt does NOT do

- Does not define roasting vocabulary — use `CONTEXT-roasting.md`.
- Does not declare the lot-level reference roast — `close-lot.md` owns `roasts.is_reference` + `roast_learnings.best_roast_id`. This prompt sets the V-set-level `experiments.winner` (leading slot) + the `is_reference_candidate` flag.
- Does not push lot-level roast learnings (`push_roast_learnings`) — `close-lot.md`, once at close-out.
- Does not dial in the optimized brew — the brewing workflow, after reference designation.
- Does not archive the Roest inventory row — `close-lot.md`.
