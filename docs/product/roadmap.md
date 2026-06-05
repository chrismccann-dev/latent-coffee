# Latent Coffee Research — Product Roadmap

*Last updated: 2026-06-03 (split out of PRODUCT.md)*

The live product roadmap. **Current, on-deck, and future product work only.** Closed sprint bodies, per-sprint retros, research-experiment history, and long bug narratives do not live here — see [Out of scope](#out-of-scope-for-this-roadmap) for where each goes.

- Shipped sprint index: [docs/sprints/shipped.md](docs/sprints/shipped.md)
- Per-sprint retrospectives: `memory/project_*.md`
- Product bugs / missing-or-incomplete substrate: [docs/product/issues.md](docs/product/issues.md)
- Grilling sessions: per-session records in `docs/sprints/grilling-<date>-*.md`; standing concept queue + resolution history in [docs/grilling-queue.md](docs/grilling-queue.md).

## Roadmap hygiene

When a sprint ships:

1. Append the shipped summary to [docs/sprints/shipped.md](docs/sprints/shipped.md).
2. File / update the per-sprint retrospective (`memory/project_*.md`).
3. Promote unresolved follow-ups into this roadmap, [issues.md](docs/product/issues.md), or a domain-specific roadmap (research, etc.).
4. Remove the completed sprint body from this roadmap.

When work is **not** product-side: research experiments go to the Research Coordinator roadmap; brewing concepts to brewing coordinator / expert-skill docs; roasting concepts to roasting context / coordinator docs; bugs to [issues.md](docs/product/issues.md) unless they are the top active product sprint.

> The "shipped → handoff doc → append to shipped → remove from roadmap" loop as a *formalized standing rule* (auto-handoff at every ship) is flagged for the Cluster B feedback-handoff-formalization brainstorm — not yet codified as autonomous behavior.

## Last reorder

**2026-06-02** (post-redesign / post-compaction review): retired the consumed 2026-06-02 working queue; Cluster B set NOW; Lot Coordinator graduated to a brainstorm doc + promoted to NEXT/operator-gated; two MCP context items re-tagged as Lot-Coordinator prerequisites. Prior reorders: 2026-05-26 (closed Sprint R's Option 1 sequence; Sprints 3.4 / 3.6 / 3.7 killed), 2026-05-25 (Sprint R), 2026-05-08 (post-v8.5).

**Capstone reprioritization (2026-05-31)** themes that still frame the queue:
- **Cluster A — cross-domain lot↔brew scaffold. SHIPPED 2026-06-01** (A1 schema migration 075 + A2/A3 workflow prompts + A4 CONTEXT/ADR-0019 + Peer-Learning archivist). Detail in [shipped.md](docs/sprints/shipped.md).
- **Cluster B — system-maintenance / anti-bloat layer.** The Claude Code + Latent *system* side has had the least optimization, and nothing actively synthesizes/prunes/curates docs. This is the current NOW theme (see below).

---

## Active queue (set 2026-06-02)

### 1. Cluster B — system-maintenance / anti-bloat — ✅ COMPLETE (2026-06-05)

The most-neglected surface area, now closed. Every member shipped: the system side gained **two matched anti-bloat mechanisms** (doc-pruning + architecture-review, both "mechanical trigger + interpretive operator-led judgment, stops-at-report") plus the feedback-handoff pipeline. The next theme is the Lot Coordinator restructure (below) — operator-gated on the next fresh green-bean lot.

**Shipped members:** migration-drift gate ([#350](https://github.com/chrismccann-dev/latent-coffee/pull/350)) · CLAUDE.md compaction ([#352](https://github.com/chrismccann-dev/latent-coffee/pull/352)) · **doc-pruning mechanism — COMPLETE** ([scope doc](docs/features/doc-pruning-mechanism-brainstorm-2026-06-03.md), [tripwires](docs/architecture/doc-tripwires.md)): Pattern J promoted placeholder→defined via light formalization ([#369](https://github.com/chrismccann-dev/latent-coffee/pull/369) — `check:doc-sizes` script + daily CI cron as the automated trigger, manual operator-led prune as the response), **six shapes** worked across 7 cases (001 CLAUDE.md / 002 CONTEXT-roasting / 003 PRODUCT.md / 004 filters.md / 006 log-cupping / 007 cross-coffee-insights — the last surfaced the `re-home` shape; 005 mooted), **over-cap backlog fully drained** (all Tier-1 surfaces within cap as of 2026-06-04).

**Shipped members (cont.):** **feedback-handoff formalization — COMPLETE** ([ADR-0020](docs/adr/0020-feedback-handoff-pipeline.md)): the route→plan→[implement] pipeline — `route-feedback` + `plan-feedback` skills + the [feedback-backlog](docs/product/feedback-backlog.md) seam (master-log reframe + recurrence-counted routing); proven by dogfooding `plan-feedback` over the real Round-19 backlog. Implementer skill deferred (spawned sub-agent for now), per the doc-pruning light-formalization posture. · **architecture-review skill + 2 gates — COMPLETE** ([derivation](docs/features/architecture-review-skill-derivation-2026-06-04.md)): the code-side sibling of doc-pruning — derived from 5 dogfood audits ([docs/audits/architecture/](docs/audits/architecture/) `01..05`), locked the v1 rubric (R1-R13) + smell taxonomy + candidate-card-v1. Shipped `/architecture-review <surface>` (read-only, stops-at-report) + `check:hotspots` (mechanical scan) + `check:doc-links` (root-relative + dead-anchor gate, [ADR-0021](docs/adr/0021-root-relative-doc-links.md)). The doc-link *remediation* (the 169-link `../../`→root-relative migration) is the spun-out follow-up, not this build. · **CCIL + librarian content-accuracy audit — COMPLETE** ([#383](https://github.com/chrismccann-dev/latent-coffee/pull/383)): cross-checked the librarians' synthesized assertions (lot states, reference-roast batch #s, deltas, densities, inventory) against the live DB; 10 corrections D1-D10 across CCIL seed + roasting-historian + WBC clusters (biggest: SR Natural "V5 active, ref #169" → resolved, ref #187). Spawned two follow-ups: the Thermal-Staging rename sweep + ROASTING/BREWING dead-anchor link-rot (**the latter converged into the doc-link remediation below**). · **doc-link remediation — COMPLETE** ([shipped.md](docs/sprints/shipped.md), 2026-06-05): drove `check:doc-links` from 1065 live misses to 0 — file-relative `../../`→root-relative migration across ~270 docs under [ADR-0021](docs/adr/0021-root-relative-doc-links.md) + redirect-stub dead-anchor repoints (absorbing the CCIL audit's ROASTING/BREWING follow-up) + `page-ia.md` stale-component reconciliation (Session 04 Candidates 1/3/4) + a gate slug fix so anchor generation matches GitHub's per-whitespace slugger.

**Final members (closed 2026-06-05):**
- **MEMORY.md consolidation** — ✅ done (operator-confirmed the `consolidate-memory` pass closed; index reflects the ADR-0020 pipeline + capstone refresh).
- **Thermal-Staging rename sweep** + **doc-link remediation** — ✅ shipped (the two CCIL-audit / architecture-review follow-ups; "Inverted Temperature Staging" → "Thermal Staging" across the brewing clusters bar 2 provenance refs; `check:doc-links` green at 0 live misses).
- **MCP continuous-feedback drain** — not a sprint: the *mechanism* shipped (`route-feedback` + `plan-feedback`); draining is a **standing operation** (run `plan-feedback` when the backlog piles up). Open backlog items route per `plan-feedback` (lifecycle-gate cluster → Lot Coordinator; failure-boundary breach #6; MCP intermittent-execution; execute_sql doc-accuracy).

**Cluster B is closed.** No remaining sprints. The standing operations it leaves running — the `check:*` gates + daily crons (doc-sizes / doc-links / migrations / hotspots), the feedback pipeline, and the doc-pruning + architecture-review triggers — keep the system side net-flat from here.

### 2. Lot Coordinator + V-Set Assistant — NEXT, operator-gated

Roasting-only restructure mirroring the Research Coordinator / Research Assistant pattern ([ADR-0017](docs/adr/0017-research-assistant-architecture.md)). Brainstorm doc: [docs/features/lot-coordinator-brainstorm-2026-06-02.md](docs/features/lot-coordinator-brainstorm-2026-06-02.md).

**Framing (2026-06-05 roadmap recap):** built consciously as **instance 2 of the self-improving skill loop** ([ADR-0023](docs/adr/0023-self-improving-skill-loop.md)) — a deliberate worked example of the generalized spine (plan↔execute via handoff packets + the improvement/compaction loops), not a bespoke roasting thing. (Instance 1 = architecture-review, maturing toward its first improvement cycle.) The system-level framework named this session: the **formalization tax** ([ADR-0022](docs/adr/0022-formalization-tax-and-self-improvement-counterbalance.md)) + the **self-improving skill loop** (ADR-0023). Sequencing locked **bottom-up**: name the pattern now, accumulate ≥3 full-loop instances, graduate the universal "self-improvement skill every skill invokes" later. The cupping "does more than one job" decomposition (case 006 STAGE 5/6) is a one-skill-one-job candidate this brainstorm will surface.

**Why:** roasting runs as ONE claude.ai session per green-bean lot — the whole lifecycle (design → V-set roast → cupping → iterate → reference call → learnings) in a single thread. That single-session model is the root cause of cross-domain handoff verbosity. The fix: a **Lot Coordinator** holds the lot-level plan; a **V-Set / Experiment Assistant** is spawned per V-set, takes that set roast→cupping→learned, STOPS, and returns a thin handoff the coordinator consumes.

**Trigger:** the next *fresh* green-bean lot ready to start clean on the new process (current lots are mid-cycle, can't be retrofitted). Big sprint — brainstorm → plan → build, no build until the trigger fires.

**Likely scope:** own ADR · CONTEXT-roasting grill · three packet/brief templates · lifecycle-state model updates for brew-side handoff waits · MCP context-efficiency prerequisites (`read_canonical(axis, name)` + `get_bean_pipeline(since:)` — both in [issues.md](docs/product/issues.md)).

**Surfaced by the log-cupping prune (case 006, 2026-06-04):** `log-cupping.md` currently does too much in one prompt — beyond recording the cupping it also (a) designs V_(n+1) inline (STAGE 6: `push_experiment` + `push_roast_recipe` × N + `push_roast_profile` × N) and (b) proposes cluster-doc changes inline (STAGE 7). Both arguably belong in a dedicated roast-design skill + a docs workflow, leaving the cupping prompt to record-the-cup-and-emit-a-handoff-packet. **Deliberately NOT changed in the prune** (it would alter how the live cupping cycle works, and the right boundary depends on the whole roast flow, not just the cupping side). Decide the boundary here, against the full Coordinator/Assistant design — the cupping prompt's prototype packet-handoff shape (`Next Roast Design Packet` / `Doc Maintenance Packet`) is the candidate target. See [pruning case 006](docs/sprints/pruning-cases/006-log-cupping.md).

### Workflow rule that bounds the queue

Per `memory/user_workflow.md`, each bean uploads to the app as a single bundle when its full cycle resolves. Mid-iteration beans not yet in the DB are **not** a backlog — they land event-driven. **Do not propose a "backfill the missing beans" sprint.**

---

## On deck

Product-side candidates with enough shape to discuss or scope, not active until the Cluster B / Lot Coordinator gates resolve. Most are trigger-gated.

- **Predicted vs Actual roast delta surface.** Substrate exists (`roast_recipes.predicted_*` vs `roasts` + cupping actuals); the missing piece is a delta surface ("predicted X°C FC, got X+2.3; gap-closing notes") so cycle-time tightens as prediction improves. **Trigger:** 3+ completed V-sets with full predicted + actual data.
- **Coffee brief / `brews.roaster_tasting_notes`.** Brewing captures actuals but not the pre-brew expected layer; roaster bag notes vanish into the conversation. Outcome could be a full `brew_briefs` entity, a first-pass `brews.roaster_tasting_notes` column, or no change (the expected layer may belong in claude.ai only). Right unit per Chris: "experiment set of one" — plan + bag + final brew. Brainstorm shape (see [Brainstorms to schedule](#brainstorms-to-schedule)).
- **Roasted-variant-of-same-green modeling.** For ~25-30% of lots Chris also buys the roasted variant from the same source as an external-roaster calibration anchor; today the pair has no FK link. Standing instinct: keep separate. Grilling-queue item 17 explores FK link vs `peer_reference_brews` join table. **Trigger:** 3+ more pairs land + the grill clarifies whether the lifecycle wants formal modeling.
- **Experiments + Cupping History rework on `/green/[id]`.** Long histories get hard to scan: experiment cards/grid exposing hypothesis → levels tested → outcome → insight; cupping grouped by batch / rest-day; active diagnostic vs archive cups distinguished. Plan-mode interpretive sprint.
- **Auto-research on green-bean upload.** claude.ai already auto-researches when assembling inventory; open question is what lives in the app vs claude.ai. Likely a thin `research_notes` block on `/green/[id]`.
- **Product surface trio** (completionist, not gated): `/producers` · `/experiments` · homepage/dashboard. Homepage also seeds any future public-surface v1.
- **Process content fill.** Thin process taxonomy content (honey subprocess descriptions, missing summaries). Content substrate, not app work. **Prerequisite:** extend `list_skeleton_entries` to a process axis so blank content surfaces in the arbiter queue.
- **Section-read navigation pattern across CONTEXT zones + prompt surfaces** (flagged 2026-06-03, post pruning case 002). Make agents actively route to the Reading-order / term-index scaffolding instead of full-reading glossaries: (1) point claude.ai/roasting instructions at the Reading-order section; (2) per-prompt preload (each prompt pulls only the section it needs); (3) replicate the scaffolding into CONTEXT-brewing + CONTEXT-shared; (4) a first-reader index pointer. **Trigger:** step 1 validated in a live roasting session, then fan out.
- **Producers aggregation starting point** — mechanical "copy the /roasters pattern" sprint. **Trigger:** 2+ producers with 3+ brews each (today only Pepe Jijon qualifies).
- **Pour-structure schema migration.** `brews.pour_structure` text → `brews.pours jsonb`. `lib/pour-structure.ts` already extracts the shape; mostly mechanical. Future-proofing, not urgent. **Trigger:** parse drift hurts render / a downstream feature demands structured data.
- **Blend-cultivar schema modeling + future blending research framework.** `lot_compositions` join table or `green_beans.blend_composition jsonb`. **Trigger:** Chris starts the WBC blending research project OR blend lots exceed ~10% of inventory.
- **Signature method "what I learned" synthesis variant.** **Trigger:** 2nd brew lands on any signature OR Chris wants the signature pages filled.
- **Producer research subagent during arbiter** — arbiter spawns a research subagent drafting a `ProducerEntry` per queued producer. **Trigger:** when manual cadence becomes onerous.
- **Backfill remaining `what_i_learned`** (~19 brews) — bundle with the per-brew directed-prompt rework so Chris isn't writing generic prose.
- **BREWING.md Cross-Coffee Insight Layer structural pass** — may be partly handled by the Brewing Historian cluster. **Trigger:** the brewing-side cross-coffee surface gets in the way of new-recipe design.

### Needs Chris's design thinking (parked, not yet scoped)

These came out of the 2026-06-02 priority-stack recount but are bigger than tweaks:

- **Synthesis surface rethink.** The recount demoted synthesis below the entity-info block on every aggregation page *because it's too long*, not low-value. Fix is shortening/restructuring synthesis so its weight matches its secondary rank — not reordering. Connects to the three-LLM-call short-form work.
- **Navigation reorg by actual usage.** Lived nav: **brews / roasters / green** are primary; **terroirs / cultivars / processes** rarely visited. Reorder the desktop nav by usage, or use the hamburger even on desktop.
- **Brew-card recall mismatch (variety vs bag name).** Chris recalls coffees by bag name ("Picolot → Loud Giants"); `/brews` cards show the variety name, so he falls back to the roaster page. Surfacing the bag/coffee name on brew cards interacts with producer prominence + card density — needs thought, not a quick edit.

### Blocked and parked

- **Split `brews.producer` into `producer_name` + `farm_name`** — demoted 2026-05-05 (less important post producer-taxonomy). If it returns, it's inside the Producers-first-class-citizen brainstorm, not a standalone sprint.

---

## Brainstorms to schedule

Each is its own session, sized small-to-medium, output is a scoping doc that feeds a future sprint. Opportunistic order — Chris triggers when bandwidth lines up.

- **Coffee brief / `brews.roaster_tasting_notes` scoping.** Roasting captures expected→actual at both stages; brewing only captures actual. The Coffee Brief is the missing "expected" half. Outcome could be a full entity, a column-only first sprint, or deferred ("could conclude we don't need to do anything").
- **WBC-mastery long-term feature direction.** "What do I need to do to get closer to entering, competing, and winning the World Brewers Cup — not just making the app nicer?" Strategic vision brainstorm; output is longer-term roadmap themes ranked against the mastery goal.

---

## Future Directions

Idea-stage — not yet scoped, may never ship in current form.

### Compounding shape

- **Recipe accelerator on new-bean intake.** Given a new bean's (cultivar + terroir + producer + process), surface "your data implies start at strategy X, ratio Y:Z, temp T" with confidence. **Reframed 2026-05-26:** Brewing + Roasting Assistant sub-skills already compose recipe recommendations at session start — re-evaluate if a dedicated in-app surface earns its keep over the in-thread workflow.
- **Cross-pollination pushing.** The app pushes Chris toward ideas from outside sources (Brewers Cup champions). **Reframed 2026-05-26:** the Cross-Coffee Insight Layer (CCIL) absorbs the substrate side; re-evaluate a dedicated in-app push surface later.
- **WBC champion recipe corpus expansion** — substrate that powers cross-pollination. Today covers 2023-2025 World Brewers Cup finalists; worth going further back + adding sub-region winners. Authoring effort, not a code sprint. Open question: is there a roasting-side equivalent worth chasing?

### Brewing-side planning capture

- **Coffee brief as a first-class entity.** The recipe lives on `brews`; what's discarded when the conversation closes is the **reasoning chain that produced it** (strategy decision, signal-flag reconciliation, named considerations, risk-if-wrong, WBC corpus check). A `brew_briefs` table (MCP-written, FK to `brews`) would surface "the plan" alongside "the result."
- **`brews.roaster_tasting_notes`** ("a big field I have missing today"). Self-roasted captures `green_beans.producer_tasting_notes`; purchased brews lose the roaster's bag notes. Could ship column-only first and fold into the brief entity later. More urgent than the full brief because the friction is concrete today.

### Surfacing what's already queryable

- Time-window compounding ("learned in the last 30/60/90 days").
- Cross-domain insight digest ("your reference roasts share X").
- Recipe-drift visualizer per roaster (the "started Balanced, drifted to Suppression" pattern).
- Cooling-behavior tracking (evaluation-temperature thresholds, today scattered in `temperature_evolution`).
- Cross-dimensional queries ("all Clarity-First Gesha from the Central Andean Cordillera").

### Producers + farms

- **Producers as a first-class citizen** (medium-term, needs a dedicated brainstorm). What does Chris fundamentally want — sourcing intelligence? farm-level lineage? a relationship graph (producer → farm → importer → roaster)? Brainstorm precedes any code. **Deferred until:** corpus has signal (currently only Pepe Jijon / Finca Soledad has 3+ brews).

### Public surface

The app is a living memory + livable archive; a public surface emerges as a side-effect of polishing personal surfaces, not as its own project. Single-tenant; writes stay Chris-only.

- Single-brew share link (`/brews/[id]` as a gated public read-only page).
- Single-coffee share-to-roaster link ("here's how I brewed your coffee").
- **Triggers when** knowledge has visibly compounded (substrate done + friction gone + months of dense logging).

### Workflow integration (low priority, mostly covered)

- Voice input for brew lessons / mobile MCP logging while brewing — already covered via claude.ai voice + `push_brew`. Defer unless app-side friction surfaces.

### Substrate expansion (Chris-gated, future)

- **Filter drawdown comprehensive test** — empirical timing of every owned filter on real beds. Output ingests into `lib/filter-registry.ts` + the Brewing Equipment Expert cluster. Authoring effort, not a code sprint. (The prior Filter-drawdown *research experiment* closed 2026-05-27 — see [shipped.md](docs/sprints/shipped.md) + the Research Coordinator roadmap; this is the substrate-ingest follow-on.)
- **Water chemistry as an 11th canonical taxonomy** — `lib/water-registry.ts` + `docs/taxonomies/water.md` + `brews.water` text canonical. **Triggers when:** Chris's water-chemistry experiments produce enough data to define canonical entries.

---

## Out of scope for this roadmap

These belong in their own docs:

- Closed sprint bodies → [docs/sprints/shipped.md](docs/sprints/shipped.md).
- Per-sprint retrospective detail → `memory/project_*.md`.
- Research-experiment history (e.g. filter drawdown) → Research Coordinator roadmap.
- Product bugs / missing-or-incomplete substrate → [docs/product/issues.md](docs/product/issues.md).
- Taste-profile doctrine → brewing-side substrate; handled per coffee.
- Spreadsheet-era source-data counts → query the DB.
- Brewing / roasting / equipment concept definitions → coordinator + context docs.
