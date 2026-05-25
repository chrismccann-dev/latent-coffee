**State transition**: In inventory → Waiting for next roast.

**Trigger**: I have a new green-bean lot in hand. Design V1 - the first V-set - and get everything prepped so I can take the Roest profiles to the machine.

**Workflow class**: V-set lot (5-10+ batches, comparative iteration). If this lot is a **one-shot** (single-batch sample ~100-120g, no iteration possible - auction sample, farm-direct sample, rare allocation), use `one-shot.md` instead. Set `green_beans.is_one_shot: true` at intake; the one-shot pipeline (`one-shot.md` + `one-shot-closeout.md`) handles the constrained workflow.

**Workflow position**: First of four lifecycle prompts (`start-lot.md` → `log-roast.md` ⇄ `log-cupping.md` → `close-lot.md`). This one runs once per lot.

Vocabulary used in this prompt is defined in CONTEXT-roasting.md (V-set, batch slot, experiment frame, variable, lever, taste-for, leading slot, reference roast, adjustment). When the file ships, claude.ai already has the CONTEXT-{roasting,brewing,shared}.md glossary family in its project context - don't re-explain.

## Tools for this session

Load via `tool_search` at session start so they're warm before STAGE 1:

`read_doc`, `read_doc_section`, `list_doc_sections`, `read_canonical`,
`list_roest_inventory`, `push_green_bean`, `get_green_bean`, `push_inventory`,
`push_experiment`, `push_roast_recipe`, `push_roast_profile`,
`propose_doc_changes`.

MCP namespace: tools surface under `Latent Coffee` (with space, capitalized).

## Routing

- **Fresh intake (lot not in DB)**: I'll paste a LOT SPEC block below this message with green-bean data + intake hypothesis. Run STAGES 1-5 end to end.
- **Lot already pushed to DB but no V1 yet**: I'll reference the `lot_id` or `green_bean_id`. Skip STAGE 1 (the bean push) and resume at STAGE 2.

Intake fields (paste in the LOT SPEC block when fresh):

```
Green Lot ID:
Coffee Name:
Variety:
Producer:
Region / Origin:
Seller / Importer:
Process:
Moisture %:
Density g/L:
Purchase Date:
Altitude (optional):
Source type / Price per kg (optional):
Producer's tasting notes (REQUIRED, paste verbatim):
Process detail (fermentation length, drying method, anaerobic / thermal
  shock / co-ferment specifics):
Reference roast comparison (peer / competition lot - what did it taste like?):
Learning intent: [find out what this coffee wants | optimize toward specific
  expression]
```

## STAGE 1 - Push the bean

Canonical-field decision flowchart BEFORE the push:

- **Producer** in `PRODUCER_LOOKUP`? Verify via `read_canonical(axis: "producers")`. If NO → set `producer_override: true`. Tier-3 attribution philosophy means many small producers (especially small Colombian farms) won't be in canonical; don't let find-or-create silently create a non-canonical row.
- **Region / department** in canonical macro_terroir? Verify via `read_canonical(axis: "terroirs")`. Roest labels meso / locality ("Caicedonia", "Las Margaritas") as "region"; the canonical macro_terroir is the BROADER area ("Western Andean Cordillera"). Locality goes in `meso_terroir`, NOT `macro_terroir`. If no canonical macro covers the actual region: HALT, report the gap, and ask whether to add the macro to the registry OR confirm a fallback. If fallback: include `TERROIR_DRIFT: <details>` in `additional_notes`.
- **Cultivar** in canonical? Verify via `read_canonical(axis: "cultivars")`. Spanish-accent variants (Sudán Rumé) alias to canonical (Sudan Rume). If your input doesn't match canonical AND doesn't match an alias, find-or-create silently creates a non-canonical row with NULL metadata.
- **Multi-cultivar blend with net-new members** (East African SL-blends are the canonical case — e.g. Mount Elgon Ladies' Lot is SL28 + SL14 + Nyasaland, with SL14 + Nyasaland net-new to the registry): `green_beans.cultivar` is single-value strict-canonical (no `cultivar_override` path); net-new individual cultivars require `propose_canonical_addition(axis: "cultivar")` + a deliberate registry edit before they resolve. Sanctioned blend-handling pattern (mirrored from one-shot.md):
  1. Pick the **representative canonical member** (the one that's both in the registry AND most load-bearing for design) and set `green_beans.cultivar.cultivar_name = "<that canonical>"`.
  2. Preserve the **full verbatim blend string** in the legacy `green_beans.variety` free-text field AND in `additional_notes`.
  3. Push the **comma-separated string** to `roest_inventory.cultivar` (which accepts comma-separated multi-cultivar strings by design).
  4. File `propose_canonical_addition(axis: "cultivar", name: "<member>")` for each net-new blend member.

Then:

- `list_roest_inventory({search: "<bean term>"})` first - Roest inventory often has richer producer / region / moisture / density / tasting notes than the project doc. Use Roest values as source of truth when they diverge from project doc.
- `push_green_bean(payload)` with canonical terroir + cultivar + producer + the intake fields. Store `moisture` and `density` as bare numeric strings (NO `%` / `g/L` suffix - render-time appends).
- `push_inventory(payload)` with `green_bean_id` for FK linkage + Roest `inventory_id` from `list_roest_inventory`.

Capture `green_bean_id` for STAGES 2-4.

## STAGE 2 - Design the V1 experiment frame

Read cluster-migrated sections via `read_doc(uri=...)`:

- `docs://skills/roest-knowledge/cluster/protocols/fan-strategy.md` — Standard Inlet Curve Template (7-timestamp fixed template) + Fan Strategy bundled (migrated from ROASTING.md in Wave 3 PR 1 / 2026-05-26; legacy `read_doc_section(uri="docs://roasting.md", anchor="Standard Inlet Curve Template")` resolves to back-compat pointer block).
- `docs://skills/roasting-historian/cluster/patterns/cross-coffee-insights.md` — any starting hypothesis from prior similar lots (migrated in Wave 2 PR 3; legacy anchor preserved).
- Carry-forward learnings from `roast_learnings` rows of prior lots with overlapping cultivar / terroir / process - call `get_bean_pipeline` on each relevant lot to pull the structured carry-forward.

For WBC-derived roasting hypotheses, sourcing-tier framing, portfolio-lane placement, and blending-experiment protocols, also consult the WBC Roasting Archivist knowledge cluster (Wave 2 PR 1, ADR-0011):

- `read_doc(uri="docs://skills/wbc-roasting-archivist/cluster/wbc-roasting.md")` — open-ideas + Roest L200 hypotheses + same-green dev ladder + structured rest-curve protocol.
- `read_doc(uri="docs://skills/wbc-roasting-archivist/cluster/sourcing/strategy.md")` — Tier 1/2/3 priority targets + 5-lane portfolio frame + sourcing channels + current Latent inventory mapped to lanes. Sourcing tier shapes how much experiment investment is justified on this lot.

**Scope-tag-driven carry-forward search (Sprint 12 / ADR-0009 / migration 064, 2026-05-21)**: when prior lots carry populated `*_scope_tags text[]` arrays on their `roast_learnings` rows, prefer querying against tag overlap rather than free-text grep against takeaway prose. Conventional prefixes to match against the current lot's attributes: `variety:<canonical-cultivar>` / `process:<base>` / `country:<canonical>` / `altitude:<low|medium|high>` / `density:<low|medium|high>` / `evaluation_method:day-7-pourover`. Tag-matched takeaways are more reliable carry-forward than prose-grep matches. Today's scope_tags population may still be sparse (Sprint 12 is recent); fall back to `get_bean_pipeline` + prose-read on prior lots when no tag-matched results return. As the tagged-lot count grows, this becomes the primary V1 carry-forward query path.

Then draft the V1 **experiment frame** - six fields, authored before any roasting happens:

| Field | Content |
|---|---|
| `context` | What prompted this V-set. For V1: "First V-set on this lot - exploring response surface broadly." |
| `primary_question` | What V1 is asking - should be broad on a first V-set ("Where does this coffee's window sit across [variables]?"), not a single-variable narrowing question. |
| `control_baseline` | If there's a reference peer from another roaster or another similar lot, cite it here. Optional on V1. |
| `shared_constants` | Charge temp (V4 standard 117°C), hopper pre-load temp (V4 standard 125°C), preheat air (210°C), fan curve, RPM, drum direction. These are held still across V1's slots. |
| `levels_tested` | The values the variables take across V1a / V1b / V1c (see V1 width rule below). |
| `expected_outcomes` | Predicted roast-layer outcome (FC time / temp, total time, Agtron) AND predicted cup-layer outcome (which slot likely cups how) for each slot. Both layers required. |

Plus optional `failure_boundary` - what "broken" looks like across all three slots (the cup descriptors that mean V1 failed regardless of which slot is leading).

### V1 width rule - multi-variable exploratory, NOT narrow

V1 (and often V2) are **wide-variance, multi-variable exploratory** V-sets. The "1-2 variables, narrow spread" rule applies from V3 onward, not at V1.

Concretely for V1:

- Spread can be wide on multiple axes simultaneously (e.g. lower peak / medium peak / higher peak AND faster decline / slower decline across the same three slots - not "all three slots same shape, only peak varies").
- ~5°C+ peak inlet spread is fine and often correct. Going wider is fine when carry-forward learnings don't constrain the window.
- The point of V1 is to *find the response surface*, not to narrow on it. The cup deltas across V1a / b / c teach which axis is the lever - V2 then narrows on that lever.
- V2 stays wide-ish when V1's signal was ambiguous (still in search space); only V3+ commits to single-variable narrowing.

Carry-forward learnings from prior similar lots inform V1's central estimate (where to anchor the spread), not its width. A new cultivar + new processing combination = anchor-with-low-confidence, widen the spread.

## STAGE 3 - Write the V1 experiment row + the three recipe rows

Three writes pair up here. **Do all three or the page surface breaks.**

(a) `push_experiment(payload)`:
- `green_bean_id` from STAGE 1
- `experiment_id`: stable label, e.g. `<LOT-PREFIX>-V1` (use the lot's short prefix, NOT a per-V-set sub-label like `v1-peak-sweep` - those go in `variable_changed`)
- `batch_ids`: leave NULL at design time. `log-roast.md` fills it after the roasts run.
- All six frame fields from STAGE 2 plus `variable_changed` (the single axis being probed primarily - e.g. "peak inlet + post-peak decline rate") and optional `failure_boundary`.

(b) `push_roast_recipe(payload)` × N (typically 3, occasionally 4 if you decided to design V1d):
- `green_bean_id` from STAGE 1
- `experiment_id` UUID (NOT the human label - get it from the `push_experiment` response's `experiment_pk`)
- `batch_slot`: `"v1a"`, `"v1b"`, `"v1c"` (the V-set + slot identifier - matches the Roest profile name + spreadsheet label + DB record end-to-end)
- `recipe_name`: human label like `"<Lot prefix> - v1a"` - surfaces in UI, no UPSERT load-bearing
- `rationale`: per-batch Hypothesis prose - "why this specific recipe / what we expect to learn from this slot". 1-3 sentences. Renders in the Roast Hypothesis row on the waiting-for-next-roast page.
- Curve definition: `temperature_bezier` + `fan_bezier` + `rpm_bezier` as bezier control points (jsonb). `power_bezier` MUST be null / empty on INLET_TEMP profiles (Chris's exclusive mode). Same shape as `push_roast_profile`'s beziers.
- `end_condition_type`: `"bean_temp"` (default). `"dev_time"` and `"manual"` only when V1 deliberately probes them.
- `end_condition_target`: °C when `bean_temp`, seconds when `dev_time`, null when `manual`.
- `charge_temp`, `hopper_load_temp`, `preheat_temperature_c`.
- Design-time predictions (frozen at recipe creation, NOT updated after seeing actuals): `predicted_fc_temp`, `predicted_fc_time` (mm:ss), `predicted_total_time` (mm:ss), `predicted_maillard_pct`, `predicted_agtron_wb`, `predicted_cup` (1-2 sentences - the cup prediction at design time; post-roast re-prediction lives on `experiments.updated_cup_prediction_*`, not here).
- Drop rules: `drop_rule_if_fast` ("what to do if end-condition fires before predicted total"), `drop_rule_if_slow` ("what to do if total overruns without hitting end-condition"). Both render in the Drop Rules card.

(c) `push_roast_profile(payload)` × N - same beziers as (b), writes to Roest tablet only. Returns `profile_id` + `share_url`. Pass `enable_share: true`.

After (c) returns, patch the matching `roast_recipes` row via `patch_roast_recipe(recipe_id, roest_profile_id, roest_share_url, roest_profile_name, pushed_to_roest_at)` so the recipe links back to its Roest profile.

## STAGE 4 - Optional: propose new active-lot cluster entry

If the lot warrants a new entry (most do), propose creating `docs/skills/roasting-historian/cluster/active-lots/<lot-slug>.md` via `propose_doc_changes`. The file body is what would have been the `### LOT-CODE - Description` block in the legacy ROASTING.md: working hypothesis, V1 framing, carry-forward learnings being tested, any per-lot protocol deviations.

Required fields: top-level `target_doc: "skills/roasting-historian/cluster/active-lots/<lot-slug>.md"` (`'roasting.md'` is deprecated post Wave 4 PR 4b per ARBITER.md § target_doc routing), top-level `summary` (one-line, the arbiter sees this when triaging), `citations: [{section_anchor, op: "append", proposed_text}]`. Optional `source = {kind: "session", id: "<lot_id V1 intake>"}`.

If unsure which `<lot-slug>` to use, run `list_docs(prefix="skills/roasting-historian/cluster/active-lots/")` to see the current naming convention. Reference the [Master Coordinator catalog](docs://skills/coordinator/catalog.md) for the canonical cluster paths.

## STAGE 5 - Confirmation output

Print all of the following so I can verify the state-flip is complete before going to the machine:

- `green_bean_id`
- `experiment_pk` (UUID) + `experiment_id` (human label like `<LOT-PREFIX>-V1`)
- For each slot (v1a, v1b, v1c, optionally v1d):
  - `recipe_id` (UUID)
  - `batch_slot`
  - `roest_profile_id`
  - `roest_share_url`
  - End condition (e.g. `BEAN_TEMP 205°C`)
  - Design-time prediction summary (predicted FC temp / total time / Agtron WB)
- `proposal_id` from `propose_doc_changes` (if STAGE 4 ran)
- Roest tablet name table (so I can pull the right profile at the machine):
  ```
  | Slot | Profile name | End condition | Roest URL |
  ```

State after STAGE 5: **Waiting for next roast**. The lot will surface on `/green` under "Waiting for next roast" until I push the actuals via `log-roast.md`.

## What this prompt does NOT do

- Push roasts (`push_roast`). Roasts haven't happened yet - that's `log-roast.md`.
- Push cuppings or update `experiments.observed_outcome_*`. Cupping hasn't happened - that's `log-cupping.md`.
- Push roast learnings or declare a reference roast. That's `close-lot.md`, only after iterating through enough V-sets to land on a reference.
