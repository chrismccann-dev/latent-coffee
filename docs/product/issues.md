# Latent Coffee Research — Product Issues Queue

*Last updated: 2026-06-03 (split out of PRODUCT.md)*

Product bugs, missing states, and incomplete substrate — kept out of [PRODUCT.md](PRODUCT.md) and the [roadmap](docs/product/roadmap.md) so neither bloats. Distinct from the roadmap's *Longer-Term Items* (which are "this works but is thin"); items here are "this exists but is broken / stub-state" or "this should exist but doesn't yet."

Long-term home: migrate to GitHub Issues if volume grows. Markdown queue for now (~handful of live items).

When an item resolves: move it to [docs/sprints/shipped.md](docs/sprints/shipped.md) or the relevant retro — do not keep resolved detail here.

---

## Active issues / incomplete substrate

### `patch_brew` jsonb-ish fields are untyped in the Tool schema — schema-strict MCP clients can't send them

**Status:** surfaced 2026-07-09 during design-audit-02 Batch 1 (Finding-5 data fix).

`patch_brew`'s input schema declares `flavors` as `z.array(z.unknown())` and leaves most passthrough fields (`modifiers`, `pours`, `structure_tags`, `key_takeaways`, ...) as bare `{}` in the emitted JSON schema. A schema-strict client (Claude Code's harness) serializes values for untyped properties as strings, so `patch_brew` with a `flavors` array fails client-side validation before the server's coercion layer ever sees it — the Batch-1 flavor dedupe had to fall back to a direct PostgREST PATCH. Fix shape: give the structured fields real JSON-schema types on `patch_brew` (mirror the `push_brew` definitions — `flavorChip`, `modifierEntry`, pours). Note the MCP catalog-cache rule: needs a fresh client session after shipping.

### `docs/reference/wbc-materials.md` modifier mapping stale (4 → 5; needs a grill, not a rename)

**Status:** substrate-currency miss; surfaced 2026-06-15 apex coordinator bake-in six-actor audit (#3).

`docs/reference/wbc-materials.md:55` + `:64` still describe **"Latent's 4 modifier types map structurally 1:1 onto WBC axes 2-5"** using the pre-4c name `inverted_temperature_staging`. The brew-recorder / CONTEXT-brewing / catalog instances of this drift were fixed mechanically in the #3 bake-in, but this one is **not a clean rename**: the 5th canonical type `equipment` (persistent/timed gear) does **not** map onto a WBC control axis the way the other four do, so adding it breaks the "1:1 onto axes 2-5" framing. The fix needs a judgment call on how `equipment` sits relative to the WBC-axis mapping (own row? noted as gear-not-axis? out-of-scope like Physical System?). Land it at the next brewing `/grill-with-docs` pass (or a scoped reconciliation), not a find-replace. Until then the rename half (`inverted_temperature_staging` → `thermal_staging`) is also pending here.

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

### Whole-arc tasting capture on `brews` — ✅ SCOPED 2026-07-08 (build promoted)

**Status:** scoping question surfaced 2026-06-14 (North Star arc propagation; brewing philosophy decision 14); **grilled + resolved 2026-07-08** in [docs/features/whole-arc-tasting-capture-brainstorm-2026-07-08.md](docs/features/whole-arc-tasting-capture-brainstorm-2026-07-08.md), spec sharpened by the WBC-mastery brainstorm (WBrC seven components + descriptor expected/actual + a Latent-native layered-evolving axis).

The answer: build-yes, hybrid shape — 9 discrete `score_*` smallint (0-9) columns + a fixed-station-key `tasting_arc` jsonb + `descriptors_expected text[]` on `brews`, mirrored (minus expected) nullable onto `cuppings`; archive principle holds (rehearsal scores never land in the DB); two forcing gates (`/brew` push gate, close-lot reference-cup gate); no backfill of the 100 prose arcs. Build entry + trigger now at the top of [roadmap § On deck](docs/product/roadmap.md); full spec + kickoff brief in the scoping doc. Canon: [CONTEXT-taste.md § Brewing philosophy](CONTEXT-taste.md).

### Producer index gap — ✅ RESOLVED 2026-06-19

**Status:** scoping question surfaced 2026-06-14 (North Star arc propagation; sourcing philosophy); scoped 2026-06-18 ([producers-first-class-scoping-2026-06-18.md](docs/features/producers-first-class-scoping-2026-06-18.md)); **shipped 2026-06-19.** The corpus-signal gate was met before the build (9 producers ≥3 brews as of 2026-06-18, not "only Pepe Jijón" — that note was stale).

The sourcing philosophy's acquisition signal #1 — **producer reputation as proxy for the engineered process** — now has an app home: `/producers` index + `/producers/[slug]` detail render the registry + DB evidence as a sourcing-forward buy/learn/remember surface, and the **`processSignature` (+ `processSignatureConfidence`) registry field** carries the "known-for engineered process" attribute (the homeless signal this issue named). The question "index surface + process-signature attribute, or stay doc-layer?" resolved to **both** (app surface + registry field; sourcing-strategy doc stays the deeper canon). Still out of v1 (now tracked in [roadmap](docs/product/roadmap.md) § Future Directions → Producers): farm-level lineage + a full relationship graph. See [shipped.md](docs/sprints/shipped.md). Canon: [CONTEXT-taste.md § Sourcing philosophy](CONTEXT-taste.md).

### CCIL consolidation due (roasting side) — stale CGLE-GESHA-CLOUDS-2026 working hypotheses

**Status:** maintenance overdue; surfaced 2026-06-15 arbiter session (Gesha Clouds close-out, [#445](https://github.com/chrismccann-dev/latent-coffee/pull/445)).

The Gesha Clouds close-out promoted the bean-temp-target-above-FC lever + the xbloom-flatters-vs-real-pourover corollary to `docs/skills/roasting-historian/cluster/patterns/cross-coffee-insights.md § Confirmed Patterns` (High, resolved across 4 V-sets). But the now-closed lot still has stale **single-lot Low-confidence** entries in that file's § Working Hypotheses (the four CGLE-GESHA-CLOUDS-2026 rows: heavy-anaerobic WB-to-Ground delta pattern · cupping-table reversal of Day 7 pourover · bean-temp-end-condition-as-safer-default · V2 aggressive-direction-recipe-dependent), plus the `## FC-Temp Architectural Constraint on Naturals` / `## xbloom Evaluation Gate Misranking on Anaerobic Naturals` Working-Hypothesis H2 sections that the close-out evidence now bears on. Run a CCIL consolidation pass (`consolidate cross-coffee insights`; [ARBITER.md § CCIL consolidation pass](ARBITER.md)) to retire / fold the resolved hypotheses into the Confirmed-Patterns index + reference tables. Interpretive (retire-vs-promote-vs-fold is Chris's call) — not arbiter-automatable.

---

## Resolved / shipped

Do not keep resolved detail here — it moves to [docs/sprints/shipped.md](docs/sprints/shipped.md) or the relevant retro.
