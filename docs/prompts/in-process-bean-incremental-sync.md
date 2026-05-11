This is a mid-iteration sync via the Latent Coffee MCP. Push only what's
new since last sync, UPSERT the experiments that have advanced, and propose
any prose updates for ROASTING.md Active Lots. push_roast_learnings is
deferred to close-out (kept in the numbered sequence below). If you have
feedback for Claude Code on the roasting MCP path, mention it.

Tools for this session (load via tool_search at session start so they're all
warm before STAGE 1 runs):
list_roest_inventory, get_green_bean, push_green_bean, get_bean_pipeline,
list_roest_logs, pull_roest_log, push_roast, patch_roast, push_cupping,
patch_cupping, push_experiment, patch_experiment, push_brew, patch_brew,
push_roast_profile, read_doc, read_doc_section, list_doc_sections,
read_canonical, propose_doc_changes.

MCP NAMESPACE: tools surface under `Latent Coffee` (with space, capitalized).

TOOL SEARCH NOTE: tool_search ranks by name+description match. If a tool
you expect doesn't surface on the first search, try the verb alone ("push",
"list", "log", "get", "patch"), the domain word ("roast", "Roest", "green",
"cupping"), or both. Only flag a tool as missing after 3 broadly-varied
searches all return empty.

PUSH vs PATCH: every push_* Tool has a paired patch_* Tool (patch_roast /
patch_cupping / patch_experiment / patch_green_bean / patch_roast_learnings /
patch_brew) for field-level updates. Use push_* on first write or full
re-archive; use patch_* when only a few fields change post-push (avoids
re-sending the full payload + risks accidental overwrite of preserved-
context fields like context / shared_constants on push_experiment). Every
patch_* Tool now echoes `updated_fields: [...]` in the response so you can
sanity-check which columns landed without a follow-up get_bean_pipeline
read (Round-5 symmetry sweep, 2026-05-10). FK re-resolutions on
patch_green_bean / patch_brew (terroir / cultivar / producer / roaster /
process axes) are NOT echoed — they touch multiple columns + sibling rows;
do a follow-up read if you need to confirm those landed.

FK DEPENDENCY CHAIN: STAGE 1 returns green_bean_id (used by STAGES 2-7) +
the FULL pipeline state baseline so downstream stages can skip what's
already pushed. STAGE 2 returns roast_ids per NEW batch (used by STAGE 3
cuppings + STAGE 6 brew if pushed). STAGE 8 (push_roast_profile, optional
forward design) is independent of the FK chain - writes to Roest only. If a
stage fails, halt and report; downstream stages will fail FK validation.

STAGE 1 - Resolve the bean against Roest + DB, then baseline pipeline state:

- list_roest_inventory({search: "<bean term>"}) FIRST. Returns the lot's
  producer / region / elevation / moisture / density / cultivar / process /
  producer_tasting_notes / additional_notes per match. Always run this
  BEFORE any project-doc claim of "tasting notes unavailable" — the Roest
  inventory data is often richer than the project doc.

- get_green_bean({lot_id: "<lot_id>"}) — preferred lookup, deterministic
  from the bean name. Returns green_bean_id + terroir_id + cultivar_id.
  Alternative: get_green_bean({roest_inventory_id: <id>}) if only Roest ID.

- INTAKE DRIFT DETECTION: compare project-doc claims (moisture / density /
  region / cultivar) against the Roest inventory + DB row from the calls
  above. Flag any divergence in the report-back step (e.g. "project doc
  says 11.2% moisture, Roest inventory says 10.8%; using Roest as source
  of truth"). Same shape as STAGE 7's prose drift detection but applied at
  intake.

- If get_green_bean returns not_found: bean has never been pushed. Call
  push_green_bean(payload) — UPSERT-safe so this branch is non-destructive.

  Decision flowchart for the canonical fields BEFORE pushing:

  - Producer in PRODUCER_LOOKUP? Verify via read_canonical(axis: "producers").
    NO → set producer_override:true. Tier-3 attribution philosophy means
    many small producers (especially small Colombian farms) won't be in
    canonical; do not let find-or-create silently create a non-canonical
    row.
    YES → use canonical name.

  - Region/department in canonical macro_terroir? Verify via read_canonical(
    axis: "terroirs"). Roest labels meso/locality (Caicedonia, Las Margaritas,
    Ibagué) as "region"; the canonical macro_terroir is the BROADER area
    (Western Andean Cordillera, Central Andean Cordillera). Locality goes
    in meso_terroir, NOT macro_terroir.
    NO CANONICAL MACRO FOUND for the actual region: HALT, report the gap,
    and ask whether to add the macro to the registry OR confirm a fallback.
    If fallback: include "TERROIR_DRIFT: actual region <X>, registry doesn't
    cover; using closest macro <Y>" in additional_notes so it stays visible
    at arbiter review.

  - Cultivar in canonical? Verify via read_canonical(axis: "cultivars").
    Spanish-accent variants (Sudán Rumé) alias to canonical (Sudan Rume).
    If your input doesn't match canonical AND doesn't match an alias,
    find-or-create silently creates a non-canonical row with NULL metadata.

- DO NOT rely on green_bean_id from prior conversation memory.

- get_bean_pipeline({green_bean_id: <returned by get_green_bean or
  push_green_bean>}) — returns { green_bean, roasts[], cuppings[],
  experiments[], roast_learnings, brews[] }.

- Build local maps from the pipeline:
  - existing_batch_ids: Set from roasts[]. STAGE 2 skips matches.
  - batch_id -> roast_id: for STAGE 3 lookups.
  - existing_cuppings: Set of (roast_id, cupping_date, eval_method,
    recipe_variant). STAGE 3 skips matches; recipe_variant is part of the
    composite key (NULLS NOT DISTINCT) — see STAGE 3.
  - existing_experiment_ids: Set from experiments[]. STAGE 4 UPSERTs.
  - existing_brews: lightweight summaries from brews[]. STAGE 6 dedupes.

- This baseline is load-bearing for the rest of the stages.

STAGE 2 - Push NEW roasts since last sync:
- list_roest_logs({inventory_id: <STAGE 1>}) to enumerate ALL Roest batches
  for this lot. Compare against existing_batch_ids.
- For each NEW batch_id:
  - pull_roest_log(log_id=<int>) for normalized push_roast-shaped payload.
  - hopper_load_temp comes back as null from Roest — Roest's API does not
    expose the bean-probe hopper-load reading (the Roest profile field
    `preheat_temperature` is the air-preheat target ~210°C, a different
    signal). Set hopper_load_temp manually from session memory when known
    (V4 standard: 125°C). The Roest air-preheat value surfaces in
    inference_hints[] for trace.
  - Augment with prose: what_worked / what_didnt / what_to_change /
    worth_repeating.
  - is_reference: true ONLY if this batch is the lot's confirmed reference
    (rare mid-iteration; usually set at close-out).
  - OPERATOR-OVERRIDE CHECK before pushing: if `end_condition_target` (the
    profile-set drop trigger, °C for bean_temp / seconds for dev_time) and
    `drop_temp` (where the machine actually dropped) diverge by more than
    ~0.5°C / a couple seconds AND the divergence isn't explained by Roest
    behavior (ceiling breach from session-position acceleration, dev-time
    timer firing slightly early/late), ASK whether the operator manually
    pulled the drop. If yes, override `end_condition_type: "manual"` on the
    push_roast payload regardless of what the profile encoded — the schema's
    end_condition_type enum (bean_temp / dev_time / manual) is for
    distinguishing operator-initiated from machine-initiated drops in
    downstream analysis. Without this check, a manually-pulled drop on a
    BEAN_TEMP profile would persist as `end_condition_type: "bean_temp"`
    and contaminate any "what was the typical FC-to-drop time when the
    machine fired auto-drop" filter.
  - push_roast(payload) with green_bean_id + roest_log_id cross-ref.
- push_roast UPSERTs on (user_id, green_bean_id, batch_id); re-pushing is
  safe (returns created: false) but skipping is more efficient.
- For field-level updates to a roast already pushed (e.g. correcting agtron
  after re-measure, adding worth_repeating prose), prefer patch_roast over
  re-sending the full push_roast payload.
- Capture roast_ids per batch_no for STAGE 3.

STAGE 3 - Push NEW cuppings since last sync:
- For each Day 7 pourover row (or Day 4 defect-screen row, if a catastrophic
  defect was being checked — Day 4 is NOT for ranking; ROASTING.md § Evaluation
  Protocol demoted Day 4 to defect-screen-only) that's landed since last sync:
  - Look up roast_id via the batch_id -> roast_id map.
  - SKIP if (roast_id, cupping_date, eval_method, recipe_variant) is in
    existing_cuppings.
  - Otherwise push_cupping(payload) with roast_id + cupping_date (YYYY-MM-DD)
    + rest_days + eval_method ("Pourover" for Day 7 evaluation, "Cupping"
    only for the rare Day 4 defect-screen pass) + recipe_variant
    (optional; distinguishes multiple cuppings of the same batch on the
    same day under different recipes — e.g. "xbloom_gate",
    "balanced_intensity_pourover") + ground_agtron (paired with
    roasts.agtron for WB-to-Ground delta) + 6 prose fields (aroma /
    flavor / acidity / body / finish / overall).
- Cupping composite key is (user_id, roast_id, cupping_date, eval_method,
  recipe_variant) with NULLS NOT DISTINCT — meaning when you push a row
  with recipe_variant unset, the server treats NULL as a real key value
  and a same-day same-method second cupping with recipe_variant ALSO unset
  returns created:false (no duplicate). To intentionally push two
  evaluations on the same (roast, date, method), set distinct
  recipe_variant labels on at least one of them so the keys diverge.
- FIRST-OF-LIKELY-TWO RULE: when a single-recipe round is "the first of
  likely two" (e.g. xbloom-only this week, real-pourover next week), label
  the variant explicitly (e.g. "xbloom_gate") rather than leaving it null.
  NULL is technically valid for true single-cupping rounds, but explicit
  labels avoid retroactive patching when the second evaluation lands - if
  you leave round 1 NULL and round 2 also defaults NULL, NULLS NOT DISTINCT
  collapses both into the same row, forcing you to patch round 1 to add
  a label after the fact. Being explicit upfront is the safer call. Use
  NULL only when you're confident no second evaluation will follow.
- The push_cupping response echoes the composite_key tuple (roast_id +
  cupping_date + eval_method + recipe_variant) so you can sanity-check
  the row landed where you expected. If the composite_key shows null for
  recipe_variant when you intended a label, treat as a bug and patch.
- For field-level updates to a cupping already pushed (e.g. refining a
  flavor descriptor or correcting ground_agtron), prefer patch_cupping
  over re-sending.

STAGE 4 - UPSERT experiments:
- push_experiment UPSERTs on (user_id, green_bean_id, experiment_id).
- Schema fields (use these names exactly): green_bean_id, experiment_id,
  batch_ids, context (what prompted this experiment), primary_question
  (what it's asking), control_baseline, shared_constants (what was held
  constant), variable_changed (single variable being tested), levels_tested
  (A/B/C levels), expected_outcomes, failure_boundary (what "broken" looks
  like), observed_outcome_a/b/c/d, winner, key_insight,
  key_insight_confidence (Low / Medium / Medium-High / High - mirrors the
  Cross-Coffee Insight Layer hypothesis-confidence vocabulary),
  what_changes_going_forward (lessons-applied-forward only),
  open_questions (what this experiment did NOT answer - distinct from
  what_changes_going_forward), additional_notes (free-text catch-all for
  operator-framing prose / "opposite ends of the spectrum" / cup-vs-
  structure tension narratives that do not fit observed_outcome_*).
- For each experiment with new observations / determined winner /
  key_insight: use the SAME experiment_id you used previously (or a fresh
  one for new experiments). The created flag in the response distinguishes
  fresh insert (true) from update (false).
- Don't pass null for fields you want preserved — UPSERT overwrites with
  whatever you send. If you only have new observations, send the full
  payload with prior context / shared_constants / control_baseline /
  expected_outcomes preserved.
- For field-level updates (e.g. just adding observed_outcome_b after the
  next batch), prefer patch_experiment over re-sending — patch_* preserves
  the fields you don't pass, eliminating the overwrite-with-null risk.

STAGE 5 - push_roast_learnings — skipped at mid-iteration:
- See the closed-bean prompt for close-out shape. Mid-iteration the
  elasticity / roast_window_width / primary_lever / cultivar_takeaway
  fields are still hypotheses; pushing half-formed lessons rows produces
  a misleading /green/[id] render. Defer until the lot is closed.
- If the lot IS closed and you're retro-filling, switch to the closed-bean
  prompt instead.
- For field-level edits to a roast_learnings row already pushed, prefer
  patch_roast_learnings.

STAGE 6 - One representative SR brew (optional — skip if no SR brew this
session):
- SKIP if any apply: no SR brew this session; brewing was paused
  mid-iteration without a final recipe; brews this round were exploratory
  tastings without resolved tasting notes / extraction strategy.
- If pushing: check existing_brews from STAGE 1 first. Brews don't UPSERT
  (multi-brews-per-coffee is normal); a duplicate creates a separate row
  needing cleanup. Confirm before pushing if signature matches.
- BEFORE pushing: apply canonical-validation discipline from the brewing
  prompt (extraction_strategy z.enum 6 canonicals incl. Hybrid v8.4;
  hybrid_subform required when strategy=Hybrid; structure_tags z.enum,
  flavors chip array, *_override pattern; cooling_curve_target free-text
  only when peak window IS the strategy).
- push_brew(payload) with source:"self-roasted", green_bean_id from STAGE 1,
  optional roast_id from the batch_id -> roast_id map.
- For field-level edits to a brew already pushed, prefer patch_brew.

STAGE 7 - Propose ROASTING.md updates for in-process state:

BEFORE drafting any citation, fetch the live doc via
read_doc_section(uri="docs://roasting.md", anchor="<Section Name>"). If
anchor doesn't resolve, list_doc_sections(uri="docs://roasting.md") to find
verbatim. section_anchor is case-sensitive, no leading #.

Routing decision tree - pick the section that matches the SHAPE of the
insight, not just the topic:

- For lot-state changes (current best batch, working hypothesis for next
  session, open questions): REPLACE the existing `### LOT-CODE - Description`
  sub-section under Active Lots. Each lot has its own anchor - citations
  should target ONE lot's anchor, not the parent `Active Lots` section. If
  the lot has no entry yet, APPEND a new `### LOT-CODE - Description`
  sub-section under Active Lots.
- For one-shot calibration lots (no V1/V2/V3 framing, single-question
  bean-system comparison or machine calibration): add a `### LOT-CODE -
  Description` sub-section under "One-Shot Calibrations in Process" instead
  of Active Lots. One-shots get a different shape (no next-session
  hypothesis, no V-numbering) and live in the dedicated subsection.
- For PROTOCOL-LEVEL insights that generalize beyond a single coffee - e.g.
  "use bean-temp end conditions on silent-FC coffees", "load hopper at
  125°C as the default", "FC marking is unreliable on anaerobic naturals
  and requires audibility-count + total-cracks confirmation": route these
  to the appropriate workflow / protocol section (FC Marking Protocol,
  Hopper Pre-Load Timing, Standard Inlet Curve Template, Drop Temp as the
  Primary Drop Signal, Between Batch Protocol). DO NOT park protocol-level
  insights in Cross-Coffee Insight Layer just because that section is
  always mid-iteration-safe - protocol changes belong in the protocol
  sections so future onboarding reads them. If the live protocol section
  contradicts the new insight, REPLACE the relevant paragraph; if the
  insight is additive, APPEND.
- For mid-iteration insights worth surfacing across coffees that AREN'T
  protocol-level ("naturals from this farm carry distinctive lemongrass,"
  "84-hour anaerobic produces silent FC"): APPEND to Cross-Coffee Insight
  Layer with confidence marker (Low / Medium / Medium-High / High) and a
  hypothesis tag rather than a confirmed claim.
- For Varietal Aromatic Fingerprints: only update if a NEW descriptor
  consistently appeared across multiple roasts. If still hypothetical,
  leave alone or annotate "(working hypothesis)".
- AVOID editing mid-iteration: Recently Closed Lots, Reference Brew Recipes
  by Lot, FC Floor & Ceiling (close-out artifacts).

For replace, copy the existing text VERBATIM into current_text. For append,
omit current_text unless a positional hint is helpful.

Submit as a single multi-citation propose_doc_changes call. Required fields:
top-level `target_doc` (default "roasting.md" for this prompt), top-level
`summary` (one-line, the arbiter sees this when triaging), `citations` array
with each citation carrying `section_anchor` (no leading #), `op`
(append / prepend / replace), `proposed_text` (the new text), and
`current_text` for replace ops. Per-citation `target_doc` only when a
citation diverges from the proposal-level default (rare). Optional
proposal-level `source = {kind: "session", id: "<lot_id or date stamp>"}`
for arbiter context.

DRIFT DETECTION: if the live doc disagrees with what you observed in Roest
data during STAGES 1-2 (e.g. existing Active Lot entry quotes a fan curve
that doesn't match the actual Roest profile), include a replace citation
that updates the doc to match observed reality.

STAGE 8 - Optional: design + push the next experiment set (v2 / v3 / etc.):

If we're designing forward at this sync - V1 debrief points at a V2
hypothesis, V2 winner indicates a V3 confirmation, etc. - push the next
profile set inline. Skip this stage if no forward design this session.

Alternative entry point: when the V_N data is already pushed and you want
a standalone forward-design session (no sync work in the same chat), use
`design-next-experiment-set.md` instead. Same workflow, no sync overhead.

- Apply the new-bean-intake prompt's framework (Standard Inlet Curve
  Template, hopper pre-load 125°C, charge 117°C, preheat air 210°C, fan
  curve held constant, RPM flat 65, BEAN_TEMP end condition).
- V2 narrows on V1's winning peak (1-2°C spread typical); V3 confirms on
  V2's winner. Don't carry V1's bracket-wide default forward.
- Print the full push_roast_profile payload for each batch (bezier arrays
  in msec, name, end_condition + value) BEFORE pushing.
- After my confirm, push all batches with enable_share=true. Return
  profile_id + share_url + tablet-name table per batch.
- Capture the design hypothesis via STAGE 4's push_experiment with a fresh
  experiment_id (e.g. "v2-peak-sweep") + expected_outcomes per batch. The
  push_roast_profile call writes to Roest only; the parallel push_experiment
  carries green_bean_id from STAGE 1.

Report back: green_bean_id + count of NEW roasts pushed (STAGE 2) + count
of NEW cuppings pushed (STAGE 3) + experiment_pks UPSERTed with created
flag for each (STAGE 4) + brew_id (STAGE 6, if pushed; "skipped: <reason>"
if not) + proposal_id (STAGE 7) + push_roast_profile profile_ids + share_urls
(STAGE 8, if designed forward; "skipped: not designing forward this sync"
if not) + intake drift findings from STAGE 1, if any.
