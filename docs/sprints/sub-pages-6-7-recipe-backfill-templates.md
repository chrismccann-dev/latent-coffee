# Sub Pages 6.7 — Recipe Backfill Templates (Track B)

Paste-ready `patch_roast_recipe` calls for the 13 recipes Chris is enriching with Phase 3 design intent. Bezier curves (`temperature_bezier` / `fan_bezier` / `rpm_bezier` / `power_bezier`) are **out of scope here** — they ride in Sprint 3.5 (Roest API parity Phase 3) once the pull-side schema gaps close.

## Priority field set

Per the Sub Pages 6.7 brief, these are the 10 design-intent fields most load-bearing for the on-page rendering:

- `rationale` — per-batch "why this specific recipe" prose (Hypothesis row on the transposed Roast Hypothesis table on the waiting-for-next-roast view)
- `drop_rule_if_fast` — what to do if the roast hits its end condition before expected total time (Drop Rules card)
- `drop_rule_if_slow` — what to do if the roast overruns expected total without hitting its end condition (Drop Rules card)
- `end_condition_type` — one of `'bean_temp'` / `'dev_time'` / `'manual'` (Drop temp row when `bean_temp`, End Condition row regardless)
- `end_condition_target` — numeric target (°C when `bean_temp`, seconds when `dev_time`)
- `predicted_fc_temp` — design-time expected FC temperature (Expected FC row)
- `predicted_total_time` — design-time expected total roast time (Expected Total row, rendered bold per scope doc § 5.2)
- `predicted_agtron_wb` — design-time expected whole-bean Agtron (Predicted Agtron WB row)
- `predicted_cup` — design-time cup prediction; this is the "Original prediction" row on the cupping view's Summary table
- `roest_share_url` — Roest tablet share URL for the profile (link out to Roest graph)

Optional but high-leverage:

- `predicted_fc_time` — design-time expected FC time string (folds into Expected FC row alongside temp)
- `predicted_maillard_pct` — design-time Maillard target

## Lookup: which recipes ride this backfill?

Chris is bringing 7 active-lot recipes + 6 resolved-lot recipes = 13 total. Run this read query in `claude.ai` (via the `roast_recipes` MCP Resource) or the Supabase SQL editor to confirm recipe IDs and current null counts:

```sql
SELECT
  rr.id AS recipe_id,
  rr.batch_slot,
  rr.recipe_name,
  gb.name AS lot_name,
  ex.experiment_id,
  rr.rationale IS NULL AS rationale_null,
  rr.predicted_cup IS NULL AS predicted_cup_null,
  rr.roest_share_url IS NULL AS roest_share_url_null
FROM roast_recipes rr
LEFT JOIN green_beans gb ON gb.id = rr.green_bean_id
LEFT JOIN experiments ex ON ex.id = rr.experiment_id
ORDER BY gb.name, rr.batch_slot, rr.created_at;
```

## Per-recipe paste template

One block per recipe slot. Fire each in a claude.ai workflow session — claude.ai resolves the MCP Tool surface, validates against the Zod schema, and writes via Supabase. Empty / unknown values: skip the line.

```js
patch_roast_recipe({
  recipe_id: "<uuid>",                       // from the SELECT above
  // Per-batch "why this specific recipe" — distinct from `notes`.
  // 1-3 sentences.
  rationale: "...",
  // If end condition fires before expected total time:
  drop_rule_if_fast: "...",
  // If roast overruns expected total without hitting end condition:
  drop_rule_if_slow: "...",
  // 'bean_temp' / 'dev_time' / 'manual'
  end_condition_type: "bean_temp",
  // °C when bean_temp, seconds when dev_time, null when manual
  end_condition_target: 210,
  predicted_fc_temp: 203,                    // °C
  predicted_fc_time: "4:25",                 // mm:ss
  predicted_total_time: "5:30",              // mm:ss
  predicted_maillard_pct: 51,
  predicted_agtron_wb: 78,
  predicted_cup: "...",                      // 1-2 sentences
  // Roest tablet share URL (renders as ↗ on the ROAST LOG row)
  roest_share_url: "https://app.roestcoffee.com/p/..."
})
```

## Active-lot recipes (7)

These are the recipes linked to V-sets on lots in `waiting_for_next_roast` or `waiting_for_next_cupping` state. Enrichment lights up the design-intent surface on the `/green/[id]` page shape immediately on the next render.

- Gesha Clouds V2 (`CGLE-GESHA-CLOUDS-2026-V2`) — 3 recipes (v2a / v2b / v2c)
- Higuito V3 (`COS-HIG-BOR-2026-V3`) — 3 recipes (v3a / v3b / v3c)
- Sudan Rume Natural V1 — 1 recipe (v1a or whichever slot the experiment frames)

> If the lot count drifted by the time Chris reads this, re-run the SELECT to ground-truth. The exact slot allocation is shaped at design time.

## Resolved-lot recipes (6)

These are the recipes linked to the `best_roast_id` on each of the 6 resolved lots. Enrichment lights up the Design column of the Reference Roast Recipe 2-col grid on the resolved view (today it renders em-dashes for all rows except Charge / Hopper which were already populated).

- CGLE Sudan Rume Hybrid Washed → Batch #133
- CGLE Mandela XO → Batch #139
- Gesha Village Surma → Batch #25
- Gesha Village Oma → Batch #52
- Guatemala Libertad → Batch #94
- Guatemala El Socorro → Batch #88

Lookup the specific recipe_id per resolved lot:

```sql
SELECT
  gb.name AS lot_name,
  rl.best_batch_id,
  r.id AS roast_id,
  r.batch_id,
  r.recipe_id,
  rr.recipe_name,
  rr.rationale IS NULL AS rationale_null
FROM roast_learnings rl
JOIN green_beans gb ON gb.id = rl.green_bean_id
JOIN roasts r ON r.id = rl.best_roast_id
LEFT JOIN roast_recipes rr ON rr.id = r.recipe_id
ORDER BY gb.name;
```

## Deliberately deferred from Track B

- **Bezier curves** (`temperature_bezier` / `fan_bezier` / `rpm_bezier` / `power_bezier`) — ride in Sprint 3.5 (Roest API parity Phase 3). Without them, Peak inlet + Fan curve on the resolved view's Design column will continue to render em-dashes after this backfill lands.
- **`parent_recipe_id` lineage** — opportunistic; if Chris knows "v3a replicates v2b's curve," that's a follow-up patch with a single field. Not a hard requirement for any render.
- **Experiments cross-batch fields** (`updated_cup_prediction_a/b/c/d` / `taste_for_a/b/c/d` / `delta_from_roast_a/b/c/d` / `delta_from_cup_a/b/c/d`) — go-forward workflow only, not retroactive. The cupping view's tables will populate naturally as future V-sets cycle through roast → cupping → synthesis with claude.ai writing into the new fields.

## Verification after backfill

Run this in claude.ai to confirm the population delta closed:

```sql
SELECT
  COUNT(*) AS total_recipes,
  COUNT(rationale) AS rationale_pop,
  COUNT(drop_rule_if_fast) AS drop_if_fast_pop,
  COUNT(drop_rule_if_slow) AS drop_if_slow_pop,
  COUNT(end_condition_type) AS end_type_pop,
  COUNT(end_condition_target) AS end_target_pop,
  COUNT(predicted_fc_temp) AS pred_fc_temp_pop,
  COUNT(predicted_total_time) AS pred_total_pop,
  COUNT(predicted_agtron_wb) AS pred_agtron_pop,
  COUNT(predicted_cup) AS pred_cup_pop,
  COUNT(roest_share_url) AS roest_url_pop
FROM roast_recipes;
```

Pre-backfill baseline (per the kickoff brief, 2026-05-13): all 10 fields below the populated count expected post-backfill = 13 for the priority field set. After Chris's 13-recipe paste round, the surfaces light up on `/green/[id]` for the 4 active lots and the 6 resolved lots.

## Why no automated SQL UPDATE script

Per [feedback_mcp_only_input.md](~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_mcp_only_input.md), claude.ai via the Latent MCP server is the canonical writer for roasting-side entities. The values themselves come from Chris's design notes and Roest profiles — they're not derivable from existing DB state — so a SQL script would still need the same human input. Routing through `patch_roast_recipe` keeps the write path consistent with how every future recipe will be written, and surfaces validation errors at the Zod boundary rather than discovering them post-insert.
