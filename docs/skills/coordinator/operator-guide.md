# Master Coordinator — operator guide

*Coffee Research · Latent · Master Coordinator*

Cross-domain operational reference for working with the Latent stack via the MCP server. Migrated from BREWING.md § How to Use This Document + § Canonical taxonomy lookups + § Working with the Latent MCP server AND ROASTING.md § Schema model + § Canonical taxonomy lookups + § Working with the Latent MCP server + § Data Capture Per Step + § Per-Coffee Threads in Wave 4 PR 4b (2026-05-21). Single cross-cutting operator guide replaces two parallel sections in the master docs.

This doc is for operators starting a brew session or a roast session in claude.ai and wanting to know how to reach the rest of the Latent stack. The companion sub-skill SKILL.md files (brewing-assistant, roasting-assistant, etc.) handle the workflow-specific framing; this doc covers the cross-cutting plumbing: canonical lookups, MCP server operational notes, per-coffee thread discipline, data capture.

---

## Schema model — roasting redesign

The roasting workflow is driven by 4 lifecycle-mapped operational prompts in `docs/prompts/`, each mapped 1:1 to a lifecycle-state transition. Re-entry into the loop happens at `log-roast.md` ⇄ `log-cupping.md` until a reference roast is declared; `start-lot.md` runs once at intake; `close-lot.md` runs once at close-out.

| Lifecycle transition | Prompt | MCP Tools called |
|---|---|---|
| In inventory → Waiting for next roast (V1 design at intake, or any later V-set design via `log-cupping.md`) | `start-lot.md` | `push_green_bean` + `push_inventory` + `push_experiment` (V_n frame) + `push_roast_recipe` × N (design intent per slot) + `push_roast_profile` × N (Roest tablet) + `propose_doc_changes` (Active Lots) |
| Waiting for next roast → Waiting for next cupping (roasts pushed, prep cupping table) | `log-roast.md` | `pull_roest_log` × N + `push_roast` × N (each linked to its `recipe_id`) + `patch_roast_recipe` (Roest linkage) + `patch_experiment` (batch_ids + observed_outcome_* roast layer + delta_from_roast_* + updated_cup_prediction_* + taste_for_*) + optional `propose_doc_changes` (mid-iteration) |
| Waiting for next cupping → Waiting for next roast (loop continues, V_(n+1) designed) OR Resolved-pending | `log-cupping.md` | `push_cupping` × N + `patch_experiment` (delta_from_cup_* + observed_outcome_* cup layer + winner / leading slot + key_insight) + (Path B) `push_experiment` (V_(n+1) frame) + `push_roast_recipe` × N + `push_roast_profile` × N + optional `propose_doc_changes` |
| Resolved-pending → Resolved (lot close-out) | `close-lot.md` | `patch_roast` (`is_reference: true` on the reference roast) + `push_roast_learnings` + `push_brew` (SR reference brew) + `propose_doc_changes` (close-out narrative) + `patch_inventory` (Roest archive) |

**One-shot lots** (`green_beans.is_one_shot=true`, single-batch samples ~100-120g, no iteration possible) use a separate 2-prompt pipeline that bundles intake / design / roast / cupping into one prompt and close-out into a second:

| Lifecycle transition | Prompt | MCP Tools called |
|---|---|---|
| In inventory → Waiting for next roast → Waiting for next cupping → Resolved-pending (intake + tolerance-anchored design + roast + Day 7 cupping, single batch) | `one-shot.md` | `push_green_bean(is_one_shot:true)` + `push_inventory` + carry-forward search across similar prior lots + `push_experiment` (V1 frame, batch_ids cardinality 1) + `push_roast_recipe` × 1 + `push_roast_profile` × 1 + `push_roast` (linked to recipe_id) + `patch_experiment` (delta_from_roast_a + updated_cup_prediction_a + taste_for_a) + `push_cupping` + `patch_experiment` (delta_from_cup_a + winner + key_insight + Outcome A/B verdict) |
| Resolved-pending → Resolved (one-shot close-out) | `one-shot-closeout.md` | `patch_roast` (`is_reference: true` on Outcome A only) + `push_brew` (optimized brew with what_i_learned compensation reasoning) + `push_roast_learnings` (constrained per migration 054: lever-attribution fields rejected; carry-forward prefixed "Low confidence — N=1") + `propose_doc_changes` (one-shot close-out narrative) + `patch_inventory` (Roest archive) |

The one-shot pipeline's structural difference from V-set: lever-attribution fields on `roast_learnings` (`primary_lever` / `secondary_levers` / `roast_window_width` / `brewing_tolerance` / `what_didnt_move_needle` / `underdevelopment_signal` / `overdevelopment_signal`) MUST be NULL — these require cross-batch evidence which one-shot (N=1) cannot provide. Schema validation in `persistRoastLearnings` rejects populated values with a specific error per field. `terroir_takeaway` (added Sprint 10, migration 060) is NOT in this list — terroir attribution does not require cross-batch evidence and is populatable on one-shot lots. See [CONTEXT.md](../../../CONTEXT.md) "One-shot lot" + "Tolerance-anchored design" + "Closed without reference" entries.

**Per-table field reference:** the underlying app schema is broader than the original spreadsheet. See [README.md § Database Schema](../../../README.md#database-schema) for current tables; each push Tool's input_schema is the source of truth for required + optional fields.

**Roest API write integration:** see [docs/features/roest-write-integration.md](../../features/roest-write-integration.md) for the bidirectional Roest sync (`push_roast_profile` + `push_inventory` + `patch_inventory` push; `pull_roest_log` + `list_roest_inventory` + `list_roest_logs` pull).

**Full sync architecture:** see [SYNC_V2.md](../../../SYNC_V2.md) for the MCP transport, auth, Resources, and Tool catalog.

---

## Canonical taxonomy lookups (live via MCP)

The Latent Coffee app validates every field on resolved entities (brews / roasts / cuppings / etc.) against canonical registries. The Latent MCP server serves these registries live; **call `read_canonical(axis: "<name>")` to fetch any one** — the axis names below are the inputs. Live fetch is preferred over any uploaded copy in the project Files; the registries change as Chris adds new producers, cultivars, brewers, etc., and stale uploads cause spurious "did you mean X?" warnings at sync time.

| Field on the resolved entity | `read_canonical` axis | Notes |
|---|---|---|
| Country + Macro Terroir | `terroirs` | `regions` is also accepted as an alias (resolves to `terroirs`); `docs://taxonomies/regions.md` is the doc-path equivalent for prose. |
| Cultivar | `cultivars` | `varieties` is also accepted as an alias (resolves to `cultivars`); `docs://taxonomies/varieties.md` is the doc-path equivalent. |
| Base Process + fermentation / drying / intervention / experimental modifiers + decaf + signature | `processes` | |
| Roaster | `roasters` | |
| Producer | `producers` | |
| Brewer | `brewers` | |
| Filter | `filters` | |
| Flavor Notes + Structure Tags | `flavors` | |
| Grinder + Grind Setting | `grinders` | |
| Roast Level | `roast-levels` | |
| Extraction Strategy | `extraction-strategies` | Strict 6-value enum (v8.4 — Hybrid promoted 2026-05-06); rarely needs lookup at brew-write time. |
| Hybrid Sub-form | `hybrid-subforms` | Strict 5-value enum, required when extraction_strategy=Hybrid. |
| Extraction Modifiers | `modifiers` | Optional Axis 2 on the resolved brew. |

**Tool, not URI.** `canonicals://{axis}` URIs ALSO exist as MCP Resources (same JSON payload), but two gotchas: (1) many MCP clients (claude.ai mobile in particular) don't enumerate URI templates in the resource list, and (2) `read_doc(uri="canonicals://...")` returns "Unknown doc URI" because `read_doc` only handles `docs://` URIs. **Always use the `read_canonical(axis)` Tool**; it serves the same content and works on every client. The catalog of available axes is at `list_canonicals()`.

**Lookup discipline.** For every resolved-entity field that has a corresponding taxonomy:

1. Call `read_canonical(axis: "<name>")` for the axis. If the value matches a canonical name (or an alias that resolves to canonical), use the canonical form.
2. If it does not match canonically but a close match exists (e.g. "Geisha" → "Gesha", "Espro Bloom Flat" → "xBloom Premium Paper Filters"), use the canonical and add a one-line note that the original term was an alias.
3. If nothing resolves, write the best guess and flag it as `(NET-NEW)`. The sync step surfaces this for a deliberate canonical-registry edit. For the few axes where overrides are accepted at write time (`roaster_override` / `producer_override` / `brewer_override` / `filter_override` / `grinder_override`), set the corresponding flag — the value persists verbatim AND is queued for canonical promotion via `taxonomy_overrides_queue`. Cultivars + terroirs are strict — no override; net-new requires either a registry edit OR a `propose_canonical_addition` Tool call followed by an arbiter session.

Drift is caught at sync time, not after. Be precise.

---

## Working with the Latent MCP server

A few operational notes for fetching MCP Resources and calling Tools via claude.ai:

- **Tool search ranking is opaque.** If a Tool you expect (e.g. `push_brew`, `propose_doc_changes`) does not surface on the first `tool_search`, retry with broader search terms before assuming the Tool isn't loaded. The MCP server has 35 Tools live; if `push_brew` returns nothing, try "brew", "push", or "latent" before concluding it's missing.
- **Re-fetch the schema before claiming a field is missing.** The deployed Tool manifest may be fresher than the model's session memory. If a field on `push_brew` or another Tool seems to have changed shape, call the Tool's introspection (or read the Tool's input_schema directly) before reporting it as missing.
- **After a code merge, wait for Vercel deploy and start a fresh conversation.** New MCP Tools and updated schemas propagate via Vercel's auto-deploy (~30-60 seconds typical). The claude.ai conversation's tool manifest is cached at conversation start; a fresh conversation picks up the new manifest. Reusing an old conversation after a server-side change can produce stale-tool errors that look like real bugs but are cache propagation issues.
- **Sub-skill clusters are reachable via `read_doc(uri="docs://skills/<name>/...")`.** Master Coordinator catalog dispatch rules in [dispatch-rules.md](./dispatch-rules.md) enumerate the per-intent fetch targets; handoff chains in [handoff-rules.md](./handoff-rules.md) enumerate the per-workflow composition order. claude.ai project memory should NOT replicate cluster content — it should fetch fresh on each session via the catalog. See [feedback_claude_ai_memory_merge_only.md](../../../~/.claude/projects/-Users-chrismccann-latent-coffee/memory/feedback_claude_ai_memory_merge_only.md) (operator memory) for why memory drift becomes inert when substrate is fetched live.

---

## Per-Coffee Threads (claude.ai workflow)

One claude.ai thread per green lot, active while that coffee is in rotation. Each thread runs the iteration loop end-to-end (intake → V1 design → roast → cupping → V2 design → ... → reference roast → reference brew → lot close-out), syncing to the app via the MCP Tools above as each step lands. When a coffee is finished and the close-out has fired, the thread is archived in claude.ai and the per-bean knowledge lives in the DB + roasting-historian cluster (per-process patterns + per-cultivar patterns + cross-coffee insights + per-lot learnings).

---

## How to start a new session

**New brew session.** Post the [`docs/prompts/start-brew.md`](../../prompts/start-brew.md) prompt (or its substance) at the top of a new conversation:

- The coffee product URL
- Dose: 15g or 18g (Chris's two formats)
- Brewing location: Home or Office (constraints differ — see [brewing-equipment-expert/cluster/operational-reference.md § Location Constraints](../brewing-equipment-expert/cluster/operational-reference.md))
- Reference experience (optional): tasting notes from a café or elsewhere for this specific coffee
- Roaster brew guide URL (optional): paste if you have it

Claude works through the Coffee Brief (see [brewing-assistant/cluster/operational-guide.md § Step 1](../brewing-assistant/cluster/operational-guide.md)), confirms the extraction strategy with Chris, and outputs a full recipe. Do not skip the strategy confirmation step — it is intentional. The strategy is the primary act of recipe design; equipment and parameters fall out of it.

**New roast session (V-set intake).** Post the [`docs/prompts/start-lot.md`](../../prompts/start-lot.md) prompt with the full green bean spec + producer notes verbatim + reference roast pointer (if any) + learning intent. See the [roasting-assistant SKILL.md](../roasting-assistant/SKILL.md) and the start-lot.md prompt for the full intake protocol.

**New roast session (one-shot calibration).** Post the [`docs/prompts/one-shot.md`](../../prompts/one-shot.md) prompt with the full green bean spec marked one-shot.

**Mid-loop continuations.** Use [`log-roast.md`](../../prompts/log-roast.md) → [`log-cupping.md`](../../prompts/log-cupping.md) → (loop or close) → [`close-lot.md`](../../prompts/close-lot.md). One-shot lots close via [`one-shot-closeout.md`](../../prompts/one-shot-closeout.md).

**Brewing continuation / completion.** Use [`log-brew.md`](../../prompts/log-brew.md) for in-thread iteration; [`bundled-brewing-completion.md`](../../prompts/bundled-brewing-completion.md) to push the final optimized brew + propose doc changes downstream.

---

---

## Session debrief paste template (optional operator convenience)

Migrated from ROASTING.md § Session Debrief Template in Wave 4 PR 4b (2026-05-21). The substantive operational flow lives in the per-prompt logic (`log-roast.md` for post-roast updates, `log-cupping.md` for Day 7 cuppings, `bundled-brewing-completion.md` / `close-lot.md` for optimized brew sessions). This template is the structured-paste convenience for batch session debriefs covering all 3 V_n batches at once.

**Use after each roast session.** Copy and paste the block below at the start of a new message, fill in your answers, and attach any Roest Connect screenshots. Complete within 24 hours of roasting while the details are fresh.

```
SESSION DEBRIEF - [Coffee Name] [Experiment Set e.g. V3]

Date:
Batches roasted (Roest batch numbers):
Profile used:
Variable tested this session:

ROAST OUTCOMES (fill in from Roest Connect):
Batch A - FC time/temp, drop time/temp, dev time/%, Maillard %, Agtron WB, weight loss:
Batch B - FC time/temp, drop time/temp, dev time/%, Maillard %, Agtron WB, weight loss:
Batch C - FC time/temp, drop time/temp, dev time/%, Maillard %, Agtron WB, weight loss:

QUALITATIVE NOTES:
1. What surprised you during the session?
2. Did anything behave differently than expected vs. the hypothesis?
3. Which batch felt like it ran best during the roast (before tasting)?
4. Any FC marking exceptions this session (false positive, silent crack, auto-mark)?
5. Hopper load timing used (standard 125°C or different)?
6. Session position - was this a first roast of day or mid-session?

OPEN QUESTIONS:
What are you most uncertain about heading into the Day 7 pourover?

ANYTHING ELSE:
```

**What Claude does with the debrief:**

- Updates the `roasts` table data for all batches in this session (via `push_roast` per [log-roast.md](../../prompts/log-roast.md))
- Updates the `experiments` table `observed_outcome_*` fields with roast-level data (via `patch_experiment`)
- Flags any roasts that breach failure boundaries (Maillard too high, Agtron out of range, FC outside target window)
- Notes any unplanned variables that may confound the experiment (session position, hopper timing anomalies, FC marking exceptions)
- Carries forward hypotheses and questions to inform the Day 7 pourover evaluation (consumed by [log-cupping.md](../../prompts/log-cupping.md))

**After Day 7 pourover.** Provide a voice or text transcript of your tasting notes per the [log-cupping.md](../../prompts/log-cupping.md) prompt structure. Include: Ground Agtron readings for each batch (measured before brewing); aroma and flavor notes for each batch, hot and as it cools; full cup sip notes (not just spoon); temperature behavior — does it open up, close down, or stay neutral as it cools?; comparative statements — which is preferred and why; whether any batch felt under-extracted (likely a brew recipe issue, not a roast issue — try a pushed brew before concluding the roast is at fault).

**After optimized brew session.** Once a winner is identified from Day 7 evaluation, run an optimized brew session and report per the [bundled-brewing-completion.md](../../prompts/bundled-brewing-completion.md) prompt structure: brew recipe used (brewer, dose, water, grind, temp, pour structure); tasting notes at hot, warm, and fully cool stages; whether the cup improves as it cools (brewing-tolerance signal); whether it matches the producer's published tasting notes. **Reference [brewing-assistant/cluster/operational-guide.md](../brewing-assistant/cluster/operational-guide.md) when designing the optimized brew session** — the reference roast becomes a roasted-bean input to the full Two-Axis Framework, including the Coffee Brief / Step 1d strategy confirmation / WBC corpus check. Treat the SR reference brew the same way you'd treat a brew on a roasted bean from any other roaster. The SR reference brew gets pushed via `close-lot.md` STAGE 4 as part of the lot close-out (don't push separately).

---

## Cross-references

- [SKILL.md](./SKILL.md) — Master Coordinator orchestration role
- [catalog.md](./catalog.md) — 18-sub-skill catalog + dispatch I/O metadata
- [dispatch-rules.md](./dispatch-rules.md) — intent → executor mappings
- [handoff-rules.md](./handoff-rules.md) — 6-chain workflow composition rules
- [CONTEXT.md](../../../CONTEXT.md) — Latent-specific terminology glossary
- [SYNC_V2.md](../../../SYNC_V2.md) — MCP transport + auth + Resource + Tool catalog
- [ARBITER.md](../../../ARBITER.md) — doc-proposal + canonical-queue arbiter playbook
