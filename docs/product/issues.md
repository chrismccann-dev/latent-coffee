# Latent Coffee Research — Product Issues Queue

*Last updated: 2026-06-03 (split out of PRODUCT.md)*

Product bugs, missing states, and incomplete substrate — kept out of [PRODUCT.md](PRODUCT.md) and the [roadmap](docs/product/roadmap.md) so neither bloats. Distinct from the roadmap's *Longer-Term Items* (which are "this works but is thin"); items here are "this exists but is broken / stub-state" or "this should exist but doesn't yet."

Long-term home: migrate to GitHub Issues if volume grows. Markdown queue for now (~handful of live items).

When an item resolves: move it to [docs/sprints/shipped.md](docs/sprints/shipped.md) or the relevant retro — do not keep resolved detail here.

---

## Active issues / incomplete substrate

### `CONTEXT-brewing.md` modifier list stale (4 → 5; rename + `equipment` missing)

**Status:** substrate-currency miss; surfaced 2026-06-05 claude.ai grilling review (Component 1).

`CONTEXT-brewing.md:20` (the **Modifier** glossary entry) still reads *"Four canonical types post-v8.5: `output_selection`, `inverted_temperature_staging`, `aroma_capture`, `role_based_pulse`."* Shipped reality per `lib/extraction-modifiers.ts` (write-side source of truth) is **five**: `output_selection`, `thermal_staging` (renamed from `inverted_temperature_staging`, alias-safe), `aroma_capture`, `role_based_pulse`, `equipment` — both the rename and `equipment` landed in Sub-sprint 4c (2026-05-28). The #399 Thermal-Staging rename sweep hit the cluster docs but **missed CONTEXT-brewing.md**, a missed hop in the 4c/#399 six-actor trace. claude.ai reads this file as a `docs://` Resource, so the stale Resource re-feeds the old vocab even after the project-memory fix. **Do NOT** rename the "Temperature-Staged" Hybrid *sub-form* (CONTEXT-brewing.md:28 / hybrid.md) — that's a different concept; the rename was modifier-only. CONTEXT is grilling-grown, so land this as a currency correction at the next brewing grill (or a targeted fix PR) rather than bulk-authoring.

### `log-cupping-stage0-migration.md` not registered in `lib/mcp/docs.ts`

**Status:** latent break-glass gap, low urgency; surfaced 2026-06-05 claude.ai grilling review (Component 1).

The STAGE 0 pre-rewrite migration procedure was extracted from `log-cupping.md` (pruning case 006) into `docs/prompts/log-cupping-stage0-migration.md`, but the path is **not** in `docs.ts` — so if STAGE 0 detection fires (a pre-rewrite lot re-cupped), claude.ai is told to pull a doc it cannot fetch as a Resource. Low urgency because no pre-rewrite lots remain on live state today, but it violates the "register reference docs in MCP same PR" rule. Register the path (+ confirm `next.config.js` `outputFileTracingIncludes` coverage via `npm run check:mcp-bundle`).

### Missing lifecycle state: pourover packet handed off, awaiting brew-side completion

**Status:** deferred to the Lot Coordinator + V-Set Assistant sprint (Chris audio 2026-06-03; kept as-is for now).

The `/green` lifecycle has `waiting_for_next_roast` and `waiting_for_next_cupping` but **no state for "I emitted a pourover packet to the brewing side and am waiting for the brew-side task to finish."** Two real variants:

- **One-shot:** cupping emits the optimized-pourover packet → operator runs the brew → result triggers one-shot close-out. (Mountain Harvest is here now — a `is_one_shot=true` lot, cupped, `roast_learnings` still NULL, mis-rendering under "Waiting for next roast" because `computeLifecycleState` rule (f) routes a fully-cupped experiment back to waiting-for-next-roast. Will close as **unresolved**.)
- **V-set:** an iteration emits the simulated-pourover packet → operator runs a brew-side runoff → result either declares a reference roast or feeds the next iteration.

**Decision (Chris, 2026-06-03):** these are **state-shaped, not design-shaped**, and the Lot Coordinator sprint touches all these surfaces — do **not** patch the lifecycle derivation now (it'll likely change). Address both missing-wait states in that sprint's lifecycle/state model.

### `read_canonical` name filter (MCP context-efficiency)

**Status:** high-leverage; spawned as a task 2026-05-31. Re-tagged 2026-06-02 as a Lot-Coordinator prerequisite.

`read_canonical` returns the full axis registry (flavors ~20K tokens, ~5% used) — the #1 context-window sink in roasting/brewing claude.ai sessions (surfaced in the 2026-05-31 grilling review). Both project memories already *document* `read_canonical(axis, name)`, so the fix is to implement the documented behavior: add an optional `name` (consider `names[]`) param resolving through canonical + alias lookup, returning just the resolved entry(ies) + aliases; omitted = current full-registry behavior (back-compat). Additive, low-risk.

### `get_bean_pipeline` incremental fetch (`since:`)

**Status:** high-leverage. Re-tagged 2026-06-02 as a Lot-Coordinator prerequisite.

By mid-V-set the single pipeline response exceeds all prompt-fetched docs combined; MCP payloads dominate context cost on long roasting arcs. A `since:<timestamp>` param returning only newer-than-last-pull rows cuts the largest accumulation category. Pairs with the `read_canonical` name filter as the two highest-leverage roasting context wins — they keep Coordinator↔V-Set-Assistant handoff packets thin (a fresh assistant reconstructs its input from a `since:` pull rather than a fat courier paste).

### Cross-dimensional search — saved/named views + full-text missing

**Status:** works partially.

`/brews` filters across dimensions (strategy / individual roaster after Sub-sprint 4c) with multi-select + intersection, URL-driven, shareable, back-button works. Still missing: full-text search across `what_i_learned` narratives; saved / named views once repeated lookup patterns stabilize.

### Experiments table — partially backfilled

**Status:** not an urgent standalone sprint (event-driven per the workflow rule).

Schema supports structured A/B/C/D experiments (hypothesis → outcome → insight). 18 experiments imported (migration 019) for the green beans currently in the DB. The roasting spreadsheet has ~16 more tied to CGLE / Forrest / Higuito beans whose `green_beans` rows aren't imported yet — they land event-driven when each lot finalizes.

### Historical `end_condition` backfill (DF-OPS2)

**Status:** small operator/data cleanup; ride along with the next writing-path sprint touching `patch_roast_recipe`.

Recipe rows landed in migration 052 (116/116 historical roasts have a `roast_recipes` row), but `end_condition_type` is populated on only 6/116 (all `"manual"`) and `end_condition_target` is 0/116. ~110 historical roasts still need both fields. The "I thought we did this" intuition matched the recipe-row backfill, not the end-condition fields.

### Apex domain serves over HTTP

**Status:** known infra bug; low priority.

`latentcoffee.com` (apex) currently serves over HTTP rather than redirecting to HTTPS. Verify/fix the HTTPS redirect on the apex domain in the Vercel/DNS config (referenced from the README deploy steps).

### `/brews` index unbounded render (~100-brew tripwire)

**Status:** monitor (also tracked in [PRODUCT.md § Scaling Watch-Items](PRODUCT.md)).

`/brews` renders every brew as a `BrewCard` with no cap/pagination. At ~89 brews this is a non-issue (server-rendered, no client list JS). **Action when crossing ~100 brews:** a small "show first N + load more" mini-sprint on the *unfiltered* view only (filters already narrow the list). The per-roaster Coffees-list half is already handled (`CoffeesList` caps at 10 with a "Show N more" expander).

### Whole-arc tasting capture on `brews` (data-model question — scope, don't build)

**Status:** scoping question surfaced 2026-06-14 (North Star arc propagation; brewing philosophy decision 14). Scope-only — do NOT auto-build.

The brewing philosophy makes **whole-arc evaluation** the governing frame: every brew is designed + judged across the full temperature arc (aroma -> hot ~59-60°C -> warm ~54-55°C -> cool ≤50°C), "never iterate off a single temperature." But the `brews` data model can't store that shape: `flavors` jsonb is **not temperature-stationed**, and `cooling_curve_target` is a single window, not a per-station record. The cupping side already has the analog (`cuppings.temperature_behavior` prose axis). **Question:** does `brews` need per-station (hot/warm/cool) tasting capture paralleling cuppings, or is the single `cooling_curve_target` + free-text `flavors` enough for the optimized-brew archive? Scope as a brainstorm (could conclude column-only, a structured `tasting_arc` jsonb, or "no change needed") before any build. Canon: [CONTEXT-taste.md § Brewing philosophy](CONTEXT-taste.md).

### Producer index gap (sourcing acquisition signal has no app home — scope, don't build)

**Status:** scoping question surfaced 2026-06-14 (North Star arc propagation; sourcing philosophy). Scope-only — do NOT auto-build.

The sourcing philosophy's acquisition signal #1 is **producer reputation as proxy for the engineered process** ("source by cross-referencing weak signal"). The `producer-taxonomy` registry exists (`docs/taxonomies/producers.md`, 120 canonical producers) and `brews.producer` / `green_beans` carry it, but there is **no producer index page** and **no "known-for engineered process" attribute** — the reputation signal that drives buying has nowhere to live in the app. Distinct from the parked "Split `brews.producer` into producer_name + farm_name" (roadmap § Blocked and parked) and the "Producers as a first-class citizen" brainstorm. **Question:** does the producer-reputation acquisition signal earn a producer index surface + a process-signature attribute, or stay doc-layer (sourcing strategy.md § 1)? Scope before any build. Canon: [CONTEXT-taste.md § Sourcing philosophy](CONTEXT-taste.md).

### CCIL consolidation due (roasting side) — stale CGLE-GESHA-CLOUDS-2026 working hypotheses

**Status:** maintenance overdue; surfaced 2026-06-15 arbiter session (Gesha Clouds close-out, [#445](https://github.com/chrismccann-dev/latent-coffee/pull/445)).

The Gesha Clouds close-out promoted the bean-temp-target-above-FC lever + the xbloom-flatters-vs-real-pourover corollary to `docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md § Confirmed Patterns` (High, resolved across 4 V-sets). But the now-closed lot still has stale **single-lot Low-confidence** entries in that file's § Working Hypotheses (the four CGLE-GESHA-CLOUDS-2026 rows: heavy-anaerobic WB-to-Ground delta pattern · cupping-table reversal of Day 7 pourover · bean-temp-end-condition-as-safer-default · V2 aggressive-direction-recipe-dependent), plus the `## FC-Temp Architectural Constraint on Naturals` / `## xbloom Evaluation Gate Misranking on Anaerobic Naturals` Working-Hypothesis H2 sections that the close-out evidence now bears on. Run a CCIL consolidation pass (`consolidate cross-coffee insights`; [ARBITER.md § CCIL consolidation pass](ARBITER.md)) to retire / fold the resolved hypotheses into the Confirmed-Patterns index + reference tables. Interpretive (retire-vs-promote-vs-fold is Chris's call) — not arbiter-automatable.

---

## Resolved / shipped

Do not keep resolved detail here — it moves to [docs/sprints/shipped.md](docs/sprints/shipped.md) or the relevant retro.
