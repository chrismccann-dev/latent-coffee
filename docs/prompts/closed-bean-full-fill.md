Closed-lot retro-fill end-to-end via the Latent Coffee MCP. Push every layer
of the structured archive, then propose the close-out narrative for
ROASTING.md. If you have feedback for Claude Code, mention it.

Tools for this session (load via tool_search at session start so they're all
warm before STAGE 1 runs):
list_roest_inventory, push_green_bean, get_green_bean, list_roest_logs,
pull_roest_log, push_roast, patch_roast, push_cupping, patch_cupping,
push_experiment, patch_experiment, push_roast_learnings,
patch_roast_learnings, push_brew, patch_brew, patch_inventory, read_doc,
read_doc_section, list_doc_sections, read_canonical, propose_doc_changes.

MCP NAMESPACE: tools surface under `Latent Coffee` (with space, capitalized).

TOOL SEARCH NOTE: tool_search ranks by name+description match. If a tool
you expect doesn't surface on the first search, try the verb alone or the
domain word. Only flag a tool as missing after 3 broadly-varied searches.

PUSH vs PATCH: every push_* Tool has a paired patch_* Tool (patch_roast /
patch_cupping / patch_experiment / patch_green_bean / patch_roast_learnings /
patch_brew) for field-level updates. Use push_* on first write or full
re-archive (the closed-lot path); use patch_* when only a few fields need
correction post-push (avoids re-sending the full payload + risks accidental
overwrite of preserved-context fields). Every patch_* Tool now echoes
`updated_fields: [...]` in the response so you can sanity-check which
columns landed without a follow-up read (Round-5 symmetry sweep,
2026-05-10). patch_experiment / patch_roast / patch_inventory additionally
echo `canonical_values: { ... }` for enum-validated fields
(key_insight_confidence / end_condition_type / worth_repeating /
bean_process / is_archived) so the caller can confirm the exact vocabulary
landed (Round-7, 2026-05-12). FK re-resolutions on patch_green_bean /
patch_brew (terroir / cultivar / producer / roaster / process axes) are
NOT echoed — they touch multiple columns + sibling rows; do a follow-up
read if you need to confirm those landed. patch_green_bean DOES write
`canonicals_updated_at` when terroir_id / cultivar_id actually change vs.
existing.

FK DEPENDENCY CHAIN: STAGE 2 returns green_bean_id (used by STAGES 3, 5, 6,
7). STAGE 3 returns roast_id per batch (used by STAGE 4 + STAGE 7 reference
brew). STAGE 8 (patch_inventory archive) uses inventory_id from STAGE 1 -
independent of the green_bean / roast FK chain. If a stage fails, halt and
report; downstream stages will fail FK validation.

STAGE 1 - Resolve the bean against Roest:
- list_roest_inventory({search: "<bean term>"}) returns matches with
  producer / region / elevation / moisture / density / process / cultivar /
  notes (push_green_bean payload shape) per match. Pick the right
  inventory_id.

STAGE 2 - Push the bean:

Decision flowchart for the canonical fields BEFORE pushing:

- Producer in PRODUCER_LOOKUP? Verify via read_canonical(axis: "producers").
  NO → set producer_override:true. Tier-3 attribution philosophy means
  many small producers (especially small Colombian farms) won't be in
  canonical; do not let find-or-create silently create a non-canonical row.
  YES → use canonical name.

- Region/department in canonical macro_terroir? Verify via read_canonical(
  axis: "terroirs"). Roest labels meso/locality (Caicedonia, Las Margaritas)
  as "region". Canonical macro_terroir is the BROADER geography (Western
  Andean Cordillera). Locality goes in meso_terroir.
  NO CANONICAL MACRO FOUND for the actual region: HALT, report the gap,
  and ask whether to add the macro to the registry OR confirm a fallback.
  If fallback: include "TERROIR_DRIFT: <details>" in additional_notes so
  it stays visible at arbiter review.

- Cultivar in canonical? Verify via read_canonical(axis: "cultivars").
  Spanish-accent variants (Sudán Rumé) alias to canonical (Sudan Rume).
  If your input doesn't match canonical AND doesn't match an alias,
  find-or-create silently creates a non-canonical row with NULL metadata.

Then push:
- push_green_bean(payload) with terroir.country + terroir.macro_terroir
  resolved per above. Set producer (canonicalizes through PRODUCER_LOOKUP;
  producer_override:true only if legitimately new), seller / exporter /
  importer, elevation_m, moisture (bare numeric, NO % suffix), density
  (bare numeric, NO g/L suffix), purchase_date, price_per_kg, quantity_g,
  producer_tasting_notes, additional_notes, roest_inventory_id from STAGE 1.
- For field-level corrections to a green_bean already pushed (rare on a
  retro-fill but possible if Roest data differs from project-doc values),
  prefer patch_green_bean.
- Capture green_bean_id for STAGES 3, 5, 6, 7.

STAGE 3 - Loop push_roast for every batch:
- list_roest_logs({inventory_id: <STAGE 1>}) returns all log_ids for this
  lot (lightweight summaries: log_id + batch_no + roast_date + fc_temp +
  drop_temp + agtron + profile_name + share_uuid). Don't extrapolate
  log_ids from URL patterns — this Tool is the canonical discovery path.
- For each log_id: pull_roest_log(log_id=<int>) returns normalized
  push_roast-shaped payload. hopper_load_temp comes back as null — Roest's
  API does not expose the bean-probe hopper-load reading; the air-preheat
  trace surfaces in inference_hints[]. Set hopper_load_temp manually from
  session memory or session notes when known (V4 standard: 125°C).
  Augment with prose: what_worked / what_didnt /
  what_to_change / worth_repeating. Set is_reference:true on the lot's
  confirmed reference roast (one per closed bean; the batch named in the
  V4 / spreadsheet "Best Roast Batch #").
- push_roast(payload) with green_bean_id + roest_log_id. Capture roast_id
  per batch_no for STAGE 4.
- For field-level corrections to a roast already pushed, prefer patch_roast.

STAGE 4 - Loop push_cupping for every Day 7 evaluation:
- For each cupping row: roast_id from STAGE 3 (matched by batch number),
  cupping_date, rest_days, eval_method, recipe_variant (optional;
  distinguishes multiple cuppings of the same batch on the same day under
  different recipes — e.g. "xbloom_gate", "balanced_intensity_pourover";
  leave NULL for single-cupping rows), ground_agtron, aroma / flavor /
  acidity / body / finish / overall.
- Cupping composite key is (user_id, roast_id, cupping_date, eval_method,
  recipe_variant) with NULLS NOT DISTINCT — single-cupping rows look up
  cleanly with recipe_variant: NULL. To push two same-day same-method
  cuppings of the same roast, set distinct recipe_variant labels on at
  least one of them.
- For field-level corrections to a cupping already pushed (prose typos,
  numeric ground_agtron after re-measure), prefer patch_cupping.

STAGE 5 - Loop push_experiment (UPSERT keyed on experiment_id):
- For each experiment set: experiment_id, batch_ids, context, primary_question,
  control_baseline, shared_constants, variable_changed, levels_tested,
  expected_outcomes, failure_boundary, observed_outcome_a/b/c/d, winner,
  key_insight, key_insight_confidence (Low / Medium / Medium-High / High -
  mirrors Cross-Coffee Insight Layer vocabulary), what_changes_going_forward
  (lessons-applied-forward only), open_questions (what was NOT answered -
  distinct from what_changes_going_forward), additional_notes (free-text
  catch-all for operator-framing prose that does not fit the structured
  fields).
- For field-level updates (e.g. amending what_changes_going_forward after
  a follow-up roast), prefer patch_experiment over re-sending the full
  payload — patch_* preserves the fields you don't pass.

STAGE 6 - push_roast_learnings (one row per closed bean):
- All 17 fields from "Overall Lessons (Per Bean)": best_batch_id,
  why_this_roast_won, aromatic_behavior, structural_behavior, elasticity,
  roast_window_width, primary_lever, secondary_levers, what_didnt_move_needle,
  underdevelopment_signal, overdevelopment_signal, cultivar_takeaway,
  general_takeaway, reference_roasts, starting_hypothesis, rest_behavior.
- For field-level edits to a roast_learnings row already pushed (e.g.
  adding a new general_takeaway after cross-coffee pattern emerges),
  prefer patch_roast_learnings.

STAGE 7 - One representative SR brew (strongly preferred) + propose
ROASTING.md close-out narrative:

(a) SR brew:
- Pick the optimized brew session that established the reference brew recipe.
- Apply the canonical-validation discipline from `log-brew.md` /
  `bundled-brewing-completion.md`. Key schema-strict gates:
  - extraction_strategy z.enum, 6 strict canonicals (v8.4: Suppression /
    Clarity-First / Balanced Intensity / Full Expression / Extraction Push /
    Hybrid). When extraction_strategy = 'Hybrid', hybrid_subform is
    REQUIRED — pick one of: sequential / phase_mapped / selective_bloom /
    intensity_clarity_split / temperature_staged. Within-strategy gradient
    ("lower edge of Balanced Intensity") goes in strategy_notes, NOT
    extraction_strategy. Cooling-window-as-strategy goes in
    cooling_curve_target (free-text), populated only when peak evaluation
    window IS the strategy (e.g. "40-45°C peak"). Modifier slot dropped from
    4 to 3 in v8.4 — Immersion was absorbed into Hybrid.
  - structure_tags z.enum on canonical "Axis:Descriptor" keys. Inspect via
    read_canonical(axis: "flavors") for the full list.
  - flavors: structured chip array of {base, modifiers[]}, NOT free-text.
  - roaster / producer / brewer / filter / grinder canonicalize via their
    *_LOOKUP; *_override:true ONLY if legitimately new.
- push_brew(payload) with source:"self-roasted", green_bean_id from STAGE 2,
  roast_id of the reference batch from STAGE 3, recipe / extraction_strategy /
  hybrid_subform (if Hybrid) / strategy_notes / cooling_curve_target (if
  applicable) / flavors / structure_tags / prose.
- For field-level edits to a brew already pushed, prefer patch_brew.

(b) Propose ROASTING.md close-out:

BEFORE drafting any citation, fetch the live doc via
read_doc_section(uri="docs://roasting.md", anchor="<Section Name>"). If
anchor doesn't resolve, list_doc_sections(uri="docs://roasting.md").
section_anchor case-sensitive, no leading #.

Routing decision tree - pick the section that matches the SHAPE of the
insight, not just the topic:

- Active Lots `### LOT-CODE - Description` sub-section: REMOVE the closed
  lot's block (use a `replace` op with `proposed_text: ""` against the
  full sub-section body). Each lot has its own `### ` anchor under Active
  Lots - target the lot anchor, not the parent `Active Lots` section.
- Recently Closed Lots: APPEND close-out summary row to the table + link
  to the new archive subdoc section.
- For PROTOCOL-LEVEL insights confirmed by close-out - e.g. "use bean-temp
  end conditions on silent-FC coffees", "anaerobic naturals tolerate
  drop ceilings 1°C above the Sudan-Rume-Washed-derived 207°C", "audibility
  count is the diagnostic primary on silent-FC lots": route to the
  appropriate workflow / protocol section (FC Marking Protocol, Drop Temp
  as the Primary Drop Signal, Between Batch Protocol). DO NOT park
  protocol-level insights in Cross-Coffee Insight Layer just because the
  lot's state is changing - protocol changes belong in the protocol
  sections so future onboarding reads them. REPLACE the relevant paragraph
  when the new insight contradicts; APPEND when additive.
- Varietal Aromatic Fingerprints: APPEND or REPLACE if variety already had
  a placeholder.
- Reference Brew Recipes by Lot: APPEND optimized recipe.
- FC Floor & Ceiling: APPEND if new floor/ceiling confirmed.
- Cross-Coffee Insight Layer: APPEND if new generalizable cross-COFFEE
  pattern (NOT protocol-level - see above).
- Rest Behavior Patterns: APPEND if new rest-curve insight.
- Green Spec to Starting Hypothesis: APPEND if new green-spec rule.

For replace, copy the existing text VERBATIM. For append, omit current_text
unless a positional hint is helpful.

Submit as a single multi-citation propose_doc_changes call. Required fields:
top-level `target_doc` (default "roasting.md" for this prompt; switch to
`roaster/{Canonical Name}` or `taxonomies/{axis}.md` per citation when a
single proposal spans multiple files), top-level `summary` (one-line, the
arbiter sees this when triaging), `citations` array with each citation
carrying `section_anchor` (no leading #), `op` (append / prepend / replace),
`proposed_text` (the new text), and `current_text` for replace ops. Optional
proposal-level `source = {kind: "session", id: "<lot_id close-out>"}` for
arbiter context.

DRIFT DETECTION: if the live doc disagrees with what you observed in Roest
data during STAGES 1-3 (e.g. reference brew recipe specifies a fan curve
that doesn't match the actual Roest profile), include a replace citation
that updates the doc to match observed reality.

STAGE 8 - Archive the lot in Roest:

After the close-out proposal lands (STAGE 7), mark the Roest inventory row
archived so the tablet picker hides the lot from the active inventory list.

- patch_inventory({roest_inventory_id: <STAGE 1>, is_archived: true}).
- Skip if the lot was never pushed to Roest (rare; most beans flow through
  Roest first).
- Report back: archived: true, or "skipped: <reason>".

Report back: green_bean_id + roast count + cupping count + experiment count +
roast_learnings_id + brew_id (if pushed) + proposal_id + archived: bool
(STAGE 8).
