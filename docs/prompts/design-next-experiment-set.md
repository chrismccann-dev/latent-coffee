Design + push the next experiment set (V2 / V3 / V4 ...) for a green bean
that's already in iteration. Used when a V-set has resolved (Day 7 cup data
pushed, experiment record updated with observations + winner + key_insight +
open_questions) and you're ready to design + push the next batch trio.

Fetch ROASTING.md via read_doc(uri="docs://roasting.md") for the Standard
Inlet Curve Template + per-lot Active Lots state. Read the lot's
`### LOT-CODE - Description` sub-section under Active Lots for the current
working hypothesis + any protocol-level notes specific to this lot.

Tools for this session (load via tool_search at session start):
get_green_bean, get_bean_pipeline, read_doc, read_doc_section, read_canonical,
push_roast_profile, push_experiment, propose_doc_changes.

Routing:
- Paste the lot reference (lot_id or green_bean_id) below this message.
- Tell me which V-set we're designing (e.g. "design V2 after V1c won" or
  "design V3 after V2b won, fan-curve probe").

State recovery:
- get_green_bean({lot_id}) returns green_bean_id + bean metadata.
- get_bean_pipeline({green_bean_id}) returns the full state - roasts[]
  (end_condition_type / drop_temp / fc_temp / agtron / profile names),
  cuppings[] (per-recipe_variant evaluations), experiments[] (winner /
  key_insight / key_insight_confidence / open_questions /
  what_changes_going_forward / additional_notes).
- The MOST RECENT resolved experiment record is the seed: its
  open_questions field is the brief for V_{N+1}'s primary_question; its
  winner anchors V_{N+1}'s control_baseline.
- Recover the lot's existing protocol (fan curve, RPM, preheat air, drum
  direction, hopper pre-load, end_condition convention) from the most
  recent roast's profile fields - hold these constant across V_{N+1}
  unless the open_question explicitly demands changing one.

Design discipline - V_N -> V_{N+1} progression:
- V1: brackets the window. Wide directional probe (~5°C peak inlet spread)
  per new-bean-intake.md.
- V2: narrows on V1 winner. Typically 1-2°C peak spread around V1's best
  batch.
- V3: confirms V2 winner. 1°C narrow probe around V2's best, or replication
  at standard ceiling if V2 was unambiguous.
- V4+: probe a NEW variable held constant in V1-V3 (e.g. fan curve through
  development, drop temp ceiling at a fixed peak inlet, charge temperature).
- Default is NARROW unless the prior set's open_questions explicitly demand
  a re-bracket. Re-bracket = "we don't know if the window is in this range
  at all"; narrow = "where in this window is the optimum."
- Apply the Standard Inlet Curve Template (ROASTING.md § Standard Inlet
  Curve Template) - 7 timestamps fixed (00:00 / 01:15 / 02:30 / 03:15 /
  04:00 / 05:00 / 06:00). Only the inlet values change across batches;
  fan / RPM / preheat air / drum direction / hopper pre-load held constant
  per the lot's existing protocol.
- End condition: BEAN_TEMP @ <target>°C is the default. If V_N used the
  hybrid pattern (DEV_TIME safety net + manual bean-temp drop), continue
  it unless the open_question demands a switch.
- Profile names: "<short-name> - v<N+1><letter>" matching V_N convention
  exactly. Keep short for Roest tablet display.

Output expectations:
- Print the full design table BEFORE any push:
  - V_{N+1} hypothesis (1-2 sentences citing V_N's winner + chosen
    open_question).
  - 3 batches: profile_name / peak inlet °C / end_condition + value.
  - Full 7-point inlet bezier per batch as [msec, °C] tuples (convert
    mm:ss timestamps from the Standard Inlet Curve Template).
  - Shared constants (fan curve, RPM, preheat air, drum direction, hopper
    pre-load) recovered from V_N - sanity-check that the lot's existing
    protocol is what you're holding constant.
- Wait for my confirm.
- Push 3 profiles via push_roast_profile with enable_share=true. Return
  profile_id + share_url + tablet name table for all three.
- Push 1 new experiment record via push_experiment with a fresh
  experiment_id (e.g. "<lot-prefix>-v<N+1>-peak-sweep" or
  "<lot-prefix>-v<N+1>-fan-curve" matching the variable_changed):
  - green_bean_id (from STATE RECOVERY)
  - experiment_id (fresh)
  - context (cites V_N's resolved finding + the open_question chosen)
  - primary_question
  - control_baseline (V_N's winner with its peak inlet / drop temp /
    profile name as reference)
  - shared_constants (fan curve, RPM, preheat air, drum direction, hopper
    pre-load, charge temp - everything held constant)
  - variable_changed (single axis being probed)
  - levels_tested (the 3 values for V_{N+1}a/b/c)
  - expected_outcomes (one short prose per batch - what you predict)
  - failure_boundary (what "broken" looks like across all 3 batches)
  - batch_ids stays NULL at design time - in-process-bean-incremental-sync
    STAGE 2 fills it in after the roasts happen.
- Return: 3 profile_ids + 3 share_urls + experiment_pk.

Optional STAGE - propose ROASTING.md Active Lots update:

If V_N's debrief revealed a lot-state change worth recording (new working
hypothesis going into V_{N+1}, narrowing confidence band, protocol shift
specific to this lot), include a propose_doc_changes call targeting the
lot's `### LOT-CODE - Description` sub-anchor under Active Lots.

BEFORE drafting any citation, fetch the live doc via
read_doc_section(uri="docs://roasting.md", anchor="<LOT-CODE - Description>").
section_anchor is case-sensitive, no leading #.

Submit as a single multi-citation propose_doc_changes call. Required fields:
top-level `target_doc` ("roasting.md"), top-level `summary` (one-line),
`citations` array with each citation carrying `section_anchor`, `op`
(append / prepend / replace), `proposed_text`, and `current_text` for
replace ops. For replace, copy the existing text VERBATIM into current_text.
Optional `source = {kind: "session", id: "<lot_id v<N+1> design>"}`.

Cross-reference:
- in-process-bean-incremental-sync.md STAGE 8 covers the "design forward
  inline with a sync session" path. Use THAT prompt when you're also
  pushing fresh V_N data in the same session; use THIS prompt when V_N
  is already pushed and only the V_{N+1} design + push is needed.
- new-bean-intake.md covers V1 design from a green bean's intake spec.
  Use THAT prompt for the very first V-set on a lot.
