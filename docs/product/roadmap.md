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

**2026-07-08** (whole-arc tasting-capture brainstorm): the queued Brainstorms entry grilled + scoped ([scoping doc](docs/features/whole-arc-tasting-capture-brainstorm-2026-07-08.md)) — concluded build-yes with a full spec; build promoted to the top of On deck (Chris-triggered); Coffee Brief expected-half scope reduced (descriptor expected/actual moved into the build, partial bundle); cooling-behavior tracking's gate re-pointed at the build shipping + scored data accumulating.

**2026-06-18** (brewing dogfood review): flipped Active queue #4 (brewing→Claude Code migration) to ✅ GRADUATED - two live mobile-CC dogfood brews closed both deferred gates (4a skill-loading via `/brew`; 4b audio parity workaround-not-blocker), operator prefers the CC surface; collapsed #4 to a closed-pointer, added the shipped.md row, landed the 4c friction-log entry. Active queue now has #2 (Lot Coordinator dogfood) as the only live item.

**2026-06-15** (North Star roadmap review): promoted brewing→Claude Code from On deck → Active queue #4, **decoupled** from #2 (own trigger = next real brew, not gated behind the fresh-lot trigger); split out the cross-domain **apex coordinator bake-in** as a standalone #3 (shippable now, serves the live AN10 dogfood - the `roasting-coordinator` skill was built pre-apex and is apex-blind); collapsed the COMPLETE Cluster B #1 to a closed-pointer; updated #2 to reflect the live AN10 dogfood; scheduled the whole-arc / layered-evolving tasting-capture brainstorm (coupled to #4); folded the producer-index sourcing signal into the Producers-first-class brainstorm.

**2026-06-02** (post-redesign / post-compaction review): retired the consumed 2026-06-02 working queue; Cluster B set NOW; Lot Coordinator graduated to a brainstorm doc + promoted to NEXT/operator-gated; two MCP context items re-tagged as Lot-Coordinator prerequisites. Prior reorders: 2026-05-26 (closed Sprint R's Option 1 sequence; Sprints 3.4 / 3.6 / 3.7 killed), 2026-05-25 (Sprint R), 2026-05-08 (post-v8.5).

**Capstone reprioritization (2026-05-31)** themes that still frame the queue:
- **Cluster A — cross-domain lot↔brew scaffold. SHIPPED 2026-06-01** (A1 schema migration 075 + A2/A3 workflow prompts + A4 CONTEXT/ADR-0019 + Peer-Learning archivist). Detail in [shipped.md](docs/sprints/shipped.md).
- **Cluster B — system-maintenance / anti-bloat layer.** The Claude Code + Latent *system* side has had the least optimization, and nothing actively synthesizes/prunes/curates docs. This is the current NOW theme (see below).

---

## Active queue (set 2026-06-02)

### 1. Cluster B — system-maintenance / anti-bloat — ✅ COMPLETE (2026-06-05)

Closed; full member list + shipped detail in [shipped.md](docs/sprints/shipped.md). Standing operations it left running - the `check:*` gates + daily crons (doc-sizes / doc-links / migrations / hotspots), the feedback route→plan pipeline, the doc-pruning + architecture-review triggers - keep the system side net-flat. No remaining sprints.

### 2. Lot Coordinator + V-Set Assistant — 🔄 IN DOGFOOD (built 2026-06-09; live on lot AN10)

Roasting-only restructure mirroring the Research Coordinator / Research Assistant pattern ([ADR-0017](docs/adr/0017-research-assistant-architecture.md)). **All seams resolved + graduated to plan 2026-06-09** — architecture locked in **[ADR-0024](docs/adr/0024-lot-coordinator-claude-code-native.md)**; plan-sprint kickoff brief at [docs/features/lot-coordinator-plan-kickoff-2026-06-09.md](docs/features/lot-coordinator-plan-kickoff-2026-06-09.md); narrative trail in the [brainstorm doc § 2026-06-09 resolution](docs/features/lot-coordinator-brainstorm-2026-06-02.md). **Built + dogfooding live** on lot `RWA-NOVA-AN10-RB-2026`, currently at *waiting-for-next-cupping* - roasting cycle-time is long, so this runs for a while yet. Skills + 8 cluster docs built; Phase A shipped (stored `lot_status` + `since:` pull + drop-rules back-prop). The first lot is the explicit dogfood; architecture revisable on its evidence. **Note (2026-06-15): the coordinator was built before the North Star apex propagated (PR #443, 2026-06-14) and was apex-blind; the cross-domain apex bake-in (item 3 below) SHIPPED 2026-06-15 - the `roasting-coordinator` skill now carries the `## Apex anchor` section + design/route/reference/close pointers, applied mid-dogfood (touched no lot data).**

**Framing (2026-06-05 roadmap recap):** built consciously as **instance 2 of the self-improving skill loop** ([ADR-0023](docs/adr/0023-self-improving-skill-loop.md)) — a deliberate worked example of the generalized spine (plan↔execute via handoff packets + the improvement/compaction loops), not a bespoke roasting thing. (Instance 1 = architecture-review; first improvement cycle run 2026-06-12 — [cycle record](docs/audits/architecture/improvement-log.md).) The system-level framework named this session: the **formalization tax** ([ADR-0022](docs/adr/0022-formalization-tax-and-self-improvement-counterbalance.md)) + the **self-improving skill loop** (ADR-0023). Sequencing locked **bottom-up**: name the pattern now, accumulate ≥3 full-loop instances, graduate the universal "self-improvement skill every skill invokes" later. The cupping "does more than one job" decomposition (case 006 STAGE 5/6) is a one-skill-one-job candidate this brainstorm will surface.

**Why:** roasting runs as ONE claude.ai session per green-bean lot — the whole lifecycle (design → V-set roast → cupping → iterate → reference call → learnings) in a single thread. That single-session model is the root cause of cross-domain handoff verbosity. The fix: a **Lot Coordinator** holds the lot-level plan; a **V-Set / Experiment Assistant** is spawned per V-set, takes that set roast→cupping→learned, STOPS, and returns a thin handoff the coordinator consumes.

**Trigger:** the next *fresh* green-bean lot ready to start clean on the new process (current lots are mid-cycle, can't be retrofitted). Big sprint — design done, build fires on the trigger.

**Scope (resolved 2026-06-09, per [ADR-0024](docs/adr/0024-lot-coordinator-claude-code-native.md)):** Claude-Code-native (roasting-domain → Claude Code; brewing-domain → claude.ai); ADR-0024 written; CONTEXT-roasting vocab grill at plan-kickoff (still to do); Brief + Handoff-down + Results-up packet shapes; **Brief-persistent / session-transient** Coordinator (Model B); stored `lot_status` (one `waiting_for_brewing` catch-all) + `check:lifecycle-consistency` guardrail; operator-direct + hybrid skill reconciliation (subsume design/close prose, keep thin write-executors, compose knowledge clusters); build net-new / destroy nothing (grace-handoff). MCP context-efficiency prerequisites (`read_canonical(axis, name)` + `get_bean_pipeline(since:)` — both in [issues.md](docs/product/issues.md)) keep the packets + per-session pulls thin.

**Surface note (2026-06-09):** Claude Code mobile shipping (cloud-container sessions, resumable threads) is what made Claude-Code-native viable for the roasting loop and is the future trigger that could eventually pull *brewing* into Claude Code too — collapsing the roasting/brewing surface split. Out of scope now (brewing stays claude.ai); tracked as the watch-item in ADR-0024 § 1. See the brewing-surface migration entry in [On deck](#on-deck) for the mobile probe findings.

**Surfaced by the log-cupping prune (case 006, 2026-06-04):** `log-cupping.md` currently does too much in one prompt — beyond recording the cupping it also (a) designs V_(n+1) inline (STAGE 6: `push_experiment` + `push_roast_recipe` × N + `push_roast_profile` × N) and (b) proposes cluster-doc changes inline (STAGE 7). Both arguably belong in a dedicated roast-design skill + a docs workflow, leaving the cupping prompt to record-the-cup-and-emit-a-handoff-packet. **Deliberately NOT changed in the prune** (it would alter how the live cupping cycle works, and the right boundary depends on the whole roast flow, not just the cupping side). Decide the boundary here, against the full Coordinator/Assistant design — the cupping prompt's prototype packet-handoff shape (`Next Roast Design Packet` / `Doc Maintenance Packet`) is the candidate target. **Boundary decided 2026-06-09 ([ADR-0024](docs/adr/0024-lot-coordinator-claude-code-native.md) § 3):** the cupping step's *one job* = record + interpret the cup (V-Set Assistant); V_(n+1) design moves up to the Coordinator; doc-proposals move to close-time substrate-fold. Implemented at build. See [pruning case 006](docs/sprints/pruning-cases/006-log-cupping.md).

### 3. Apex coordinator bake-in — cross-domain doc-layer pass — ✅ SHIPPED (2026-06-15)

Closed; full member list + shipped detail in [shipped.md](docs/sprints/shipped.md). Propagated the North Star apex into the apex-blind `roasting-coordinator` skill's own steps (new `## Apex anchor` section + inline pointers at V-set design / SPG / reference / close — pointer insertion, not re-authoring; served the live AN10 dogfood), enforced whole-arc station discipline in the `brewing-assistant` Step 3 iteration loop, and landed the six-actor ride-along currency fixes (`reveal-not-inject` → humanizer `USER_OVERRIDE`; the stale 4-modifier list → the 5-set in brew-recorder + catalog + CONTEXT-brewing, resolving the open issues.md modifier entry; `wbc-materials.md` same-drift flagged-not-fixed as a fresh issues.md grill item). Pure doc-layer, no schema.

### 4. Brewing-session migration to Claude Code — ✅ GRADUATED (2026-06-18; dogfood closed)

Closed; detail in [shipped.md](docs/sprints/shipped.md). Two live mobile-CC dogfood brews - El Pilón (Moonwake, 06-17) + El Mango (Snite, 06-18) - ran end-to-end and pushed clean (brew row + canonical-queue entries + `propose_doc_changes`, all well-formed, none errored/orphaned). Both deferred gates resolved: **4a skill-loading** - the `/brew` slash invocation surfaces the skill reliably on mobile (natural-language auto-trigger was inconsistent; `/brew` is the reliable entry); **4b audio parity** - the Claude **mobile-app** audio-dictation button is unstable under Claude Code, but the operator workaround (dictate a note to self → paste the text) holds, so it is **NOT a migration blocker** and the fix is Claude-mobile-app-side, not Latent-side. Operator verdict: prefers the CC surface over claude.ai. Friction captured in [process-friction-log.md](docs/skills/brewing-assistant/cluster/process-friction-log.md) (4c entry). **claude.ai brewing retired 2026-06-18** on Chris's signal: the surviving prompts `start-brew.md` (mobile fallback entry) + `bundled-brewing-completion.md` (completion engine) were re-framed as Claude-Code `/brew` substrate, and the two dead redirect stubs (`log-brew.md` / `propose-doc-changes-from-brew.md`) were removed; the claude.ai-UI brewing-project teardown is Chris's Actor-3 action. An N=1 watch-item (NL auto-trigger inconsistency on mobile) is logged, not yet graduated.

**Coupled follow-on (NOT bundled):** the whole-arc tasting-capture *schema* question on `brews` ([issues.md](docs/product/issues.md)) - the migration's whole-arc evaluation discipline is the forcing function. Scope as a [brainstorm](#brainstorms-to-schedule); gate the build.

### Workflow rule that bounds the queue

Per `memory/user_workflow.md`, each bean uploads to the app as a single bundle when its full cycle resolves. Mid-iteration beans not yet in the DB are **not** a backlog — they land event-driven. **Do not propose a "backfill the missing beans" sprint.**

---

## On deck

Product-side candidates with enough shape to discuss or scope, not active until the Cluster B / Lot Coordinator gates resolve. Most are trigger-gated.

- **Whole-arc tasting-capture build (spec'd, ready to fire — highest-leverage queued build per the WBC brainstorm).** Full spec + kickoff brief in [docs/features/whole-arc-tasting-capture-brainstorm-2026-07-08.md](docs/features/whole-arc-tasting-capture-brainstorm-2026-07-08.md): 9 `score_*` columns + `tasting_arc` jsonb + `descriptors_expected` on `brews`, mirrored (minus expected) nullable on `cuppings`; `/brew` score-completeness push gate + close-lot reference-cup gate; dictation-extraction + one-page tasting card; six-actor trace enumerated. Planned-execution work (autonomy rule applies). **Trigger:** Chris's go, ideally before the next optimized brew so the instrument starts landing. **Standing checkpoint:** Dec 2026 — diff the 2027 WBrC rules drop against the score-column names; migrate if drifted.
- **Predicted vs Actual roast delta surface.** Substrate exists (`roast_recipes.predicted_*` vs `roasts` + cupping actuals); the missing piece is a delta surface ("predicted X°C FC, got X+2.3; gap-closing notes") so cycle-time tightens as prediction improves. **Trigger:** 3+ completed V-sets with full predicted + actual data.
- **Coffee brief / `brews.roaster_tasting_notes`.** Brewing captures actuals but not the pre-brew expected layer; roaster bag notes vanish into the conversation. Outcome could be a full `brew_briefs` entity, a first-pass `brews.roaster_tasting_notes` column, or no change (the expected layer may belong in claude.ai only). Right unit per Chris: "experiment set of one" — plan + bag + final brew. Brainstorm shape (see [Brainstorms to schedule](#brainstorms-to-schedule)).
- **Roasted-variant-of-same-green modeling.** For ~25-30% of lots Chris also buys the roasted variant from the same source as an external-roaster calibration anchor; today the pair has no FK link. Standing instinct: keep separate. Grilling-queue item 17 explores FK link vs `peer_reference_brews` join table. **Trigger:** 3+ more pairs land + the grill clarifies whether the lifecycle wants formal modeling.
- **Experiments + Cupping History rework on `/green/[id]`.** Long histories get hard to scan: experiment cards/grid exposing hypothesis → levels tested → outcome → insight; cupping grouped by batch / rest-day; active diagnostic vs archive cups distinguished. Plan-mode interpretive sprint.
- **Auto-research on green-bean upload.** claude.ai already auto-researches when assembling inventory; open question is what lives in the app vs claude.ai. Likely a thin `research_notes` block on `/green/[id]`.
- **Product surface duo** (completionist, not gated): `/experiments` · homepage/dashboard. Homepage also seeds any future public-surface v1. (`/producers` shipped 2026-06-19 — see [shipped.md](docs/sprints/shipped.md).)
- **Process content fill.** Thin process taxonomy content (honey subprocess descriptions, missing summaries). Content substrate, not app work. **Prerequisite:** extend `list_skeleton_entries` to a process axis so blank content surfaces in the arbiter queue.
- **Section-read navigation pattern across CONTEXT zones + prompt surfaces** (flagged 2026-06-03, post pruning case 002). Make agents actively route to the Reading-order / term-index scaffolding instead of full-reading glossaries: (1) point claude.ai/roasting instructions at the Reading-order section; (2) per-prompt preload (each prompt pulls only the section it needs); (3) replicate the scaffolding into CONTEXT-brewing + CONTEXT-shared; (4) a first-reader index pointer. **Trigger:** step 1 validated in a live roasting session, then fan out.
- **Pour-structure schema migration.** `brews.pour_structure` text → `brews.pours jsonb`. `lib/pour-structure.ts` already extracts the shape; mostly mechanical. Future-proofing, not urgent. **Trigger:** parse drift hurts render / a downstream feature demands structured data.
- **Blend-cultivar schema modeling + future blending research framework.** `lot_compositions` join table or `green_beans.blend_composition jsonb`. **Trigger:** Chris starts the WBC blending research project OR blend lots exceed ~10% of inventory.
- **Signature method "what I learned" synthesis variant.** **Trigger:** 2nd brew lands on any signature OR Chris wants the signature pages filled.
- **Producer research subagent during arbiter** — arbiter spawns a research subagent drafting a `ProducerEntry` per queued producer. **Trigger:** when manual cadence becomes onerous.
- **Backfill remaining `what_i_learned`** (~19 brews) — bundle with the per-brew directed-prompt rework so Chris isn't writing generic prose.
- **BREWING.md Cross-Coffee Insight Layer structural pass** — may be partly handled by the Brewing Historian cluster. **Narrowed 2026-07-08:** the first full-corpus digest ([docs/skills/ccil/cluster/digests/brewing-corpus-digest-2026-07.md](docs/skills/ccil/cluster/digests/brewing-corpus-digest-2026-07.md)) found no structural gap in the Historian cluster — the capsules + Coffee Brief Read Order already carry the per-anchor rules cleanly; what remains of this entry is purely the original trigger. **Trigger:** the brewing-side cross-coffee surface gets in the way of new-recipe design.
- **Producer post-resolution disposition capture (close-lot step).** At lot close, the workflow asks Chris a going-forward posture on the producer - **Re-source / Back burner / Retire** (+ a one-line why) - captured and used to drive the `resolved_reference` "Next action" cell on `/producers/[id]` (today an interim doctrine line, "Re-source if a new lot fits the apex; otherwise retire."). Surfaced by design-audit 01 Finding 7: the DECISION strip's Buy-posture and Next-action cells duplicated for 3 of 5 relationship states because `nextAction()` only authored distinct copy for 2; the de-dup shipped, but `resolved_reference`'s next move is genuinely per-producer (proven across GV-OMA / CGLE / El Socorro / Gesha Clouds) and isn't rule-derivable. **Open design question:** producers has no DB table (text-equality aggregation), so the disposition likely rides on `roast_learnings` (written at close-lot, latest-lot-wins in the producer aggregation) - needs a grill. Six-actor change: schema field → `lib/producers.ts` derivation → `push_roast_learnings` (Actor 4) → `close-lot.md` prompt (Actor 2) → UI cell. **Trigger:** next lot reaches the close-lot step (the natural capture moment).

### Needs Chris's design thinking (parked, not yet scoped)

These came out of the 2026-06-02 priority-stack recount but are bigger than tweaks:

- **Navigation reorg by actual usage.** Lived nav: **brews / roasters / green** are primary; **terroirs / cultivars / processes** rarely visited. Reorder the desktop nav by usage, or use the hamburger even on desktop.
- **Brew-card recall mismatch (variety vs bag name).** Chris recalls coffees by bag name ("Picolot → Loud Giants"); `/brews` cards show the variety name, so he falls back to the roaster page. Surfacing the bag/coffee name on brew cards interacts with producer prominence + card density — needs thought, not a quick edit.

### Blocked and parked

- **Split `brews.producer` into `producer_name` + `farm_name`** — demoted 2026-05-05 (less important post producer-taxonomy). If it returns, it's inside the Producers-first-class-citizen brainstorm, not a standalone sprint.

---

## Brainstorms to schedule

Each is its own session, sized small-to-medium, output is a scoping doc that feeds a future sprint. Opportunistic order — Chris triggers when bandwidth lines up.

- **Whole-arc / layered-evolving tasting-capture on `brews` - ✅ SCOPED (2026-07-08), build promoted to On deck.** Grilled + resolved in [docs/features/whole-arc-tasting-capture-brainstorm-2026-07-08.md](docs/features/whole-arc-tasting-capture-brainstorm-2026-07-08.md): archive principle holds (only optimized-brew + cupping rows score; rehearsal scores are practice equipment), hybrid schema (9 discrete `score_*` smallint 0-9 columns incl. the Latent-native apex-anchored `score_layered_evolving` + a fixed-station-key `tasting_arc` jsonb, mirrored nullable onto `cuppings`), two forcing gates (`/brew` push gate + close-lot reference-cup gate), dictation-extraction ergonomics + a one-page tasting card, partial bundle with the Coffee Brief expected-half (`descriptors_expected` + `score_descriptor_accuracy` land here with dual judge/competitor semantics; the rest stays split), build-now with a Dec 2026 WBrC-rules re-verify checkpoint. Kickoff brief in the doc; see the On deck entry.
- **Coffee brief / `brews.roaster_tasting_notes` scoping.** Roasting captures expected→actual at both stages; brewing only captures actual. The Coffee Brief is the missing "expected" half. Outcome could be a full entity, a column-only first sprint, or deferred ("could conclude we don't need to do anything"). **Scope reduced 2026-07-08:** the descriptor expected/actual overlap (`brews.descriptors_expected` + `score_descriptor_accuracy`) moved into the tasting-capture build (partial bundle, [scoping doc Decision 5](docs/features/whole-arc-tasting-capture-brainstorm-2026-07-08.md)); what remains here is the fuller capture — `roaster_tasting_notes` verbatim, brief storage, provenance — with a strengthened premise (bag notes now have a consumer on the brew row).
- **WBC-mastery long-term feature direction - ✅ SCOPED (2026-07-08).** Grilled + resolved in [docs/features/wbc-mastery-brainstorm-2026-07-08.md](docs/features/wbc-mastery-brainstorm-2026-07-08.md): 2028 season anchored as first competition-circuit presence (2027 = observe/volunteer/JSP year), the PicoLot-bar gate made checkable (WBrC score-sheet self-scoring as the standing instrument + opportunistic blind side-by-side; freezer backlog reframed as calibration material), research sequence locked (water finish → blending as 2027 centerpiece → rest-curves demoted to concurrent protocol), three performance rituals committed (descriptor accuracy now / quarterly mock service 2027 / compulsory drills with WBC-recipe replication folded in), own-roast locked + replication protocol scheduled post-blending + the Oct 2026 Panama trip re-scoped as the competition-lot producer-relationship opener (one producer holding 5-10kg by mid-2027). The 9-theme ranked spine + what the app is explicitly NOT asked to do live in the doc. It feeds: the whole-arc tasting-capture brainstorm above (spec sharpened - WBrC seven components + descriptor expected/actual + a layered-evolving axis; now the highest-leverage queued brainstorm), the Coffee Brief expected-half (competition-justified), the blend-schema trigger (fires with the 2027 blending project), and a wbc-materials refresh with the 2026 rules/scoresheets.

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

**Substrate side discharged 2026-07-08** by the first full-corpus digest ([docs/skills/ccil/cluster/digests/brewing-corpus-digest-2026-07.md](docs/skills/ccil/cluster/digests/brewing-corpus-digest-2026-07.md)) — a durable doc now covers the time-window view, the cross-source reference-roast commonalities, per-roaster recipe drift, and the cooling-arc distribution as a point-in-time read. What remains below is the *app-surface* question only, and the digest sharpened each entry's premise:

- Time-window compounding ("learned in the last 30/60/90 days") — digest § 5 is the v1; an app surface earns its keep only if the read wants to be recurring rather than per-doubling.
- Cross-domain insight digest ("your reference roasts share X") — digest § 3 answers the seed question; re-evaluate after the next 2-3 lots close.
- Recipe-drift visualizer per roaster — **premise revised by the digest**: the real drifts are temperature (Moonwake), valve structure (Picolot), and strategy-era (Latent), not "Balanced → Suppression"; any viz should plot those axes.
- Cooling-behavior tracking — brainstorm resolved 2026-07-08 (structured `tasting_arc` capture spec'd — see On deck); **now gated on the build shipping + scored arc data accumulating** (existing 100 prose arcs stay unbackfilled by design; nothing to track until forward capture compounds).
- Cross-dimensional queries ("all Clarity-First Gesha from the Central Andean Cordillera") — attempted in the digest and dropped: no insight beyond the by-cultivar capsules at current corpus size.

### Producers + farms

- **Producers — farm lineage + relationship graph** (medium-term). The v1 **Producers-first-class** surface **shipped 2026-06-19** — `/producers` index + `/producers/[slug]` detail (sourcing-forward buy/learn/remember surface), the `processSignature` registry field as acquisition-signal #1, a relationship-state tab spine, and a rule-derived decision strip ([scoping doc](docs/features/producers-first-class-scoping-2026-06-18.md) · [shipped.md](docs/sprints/shipped.md)). The corpus-signal gate is met (9 producers ≥3 brews as of 2026-06-18). The curated **`sourcingPriority` shortlist** (the **Priority targets** tab + detail Sourcing-lens rows) **shipped 2026-06-19**, and the follow-up **sourcing-priority canon pass** **shipped 2026-06-19** ([#487](https://github.com/chrismccann-dev/latent-coffee/pull/487) · [shipped.md](docs/sprints/shipped.md)) — folded the three-axis model into canon (Fit / Role / Action), renamed the `reference` bucket → `calibration`, populated the full `pursue`/`watch`/`learning`/`calibration` roster, and added the Mikava/Santuario canonical. **Still open** (explicitly out of v1): farm-level lineage and a full relationship graph (producer → farm → importer → roaster), plus authored decision-strip overrides + channel/small-format registry fields. **Trigger:** a concrete need beyond aggregation, or the long-tail signature backlog becomes onerous (see "Producer research subagent during arbiter" on deck).

### Public surface

The app is a living memory + livable archive; a public surface emerges as a side-effect of polishing personal surfaces, not as its own project. Single-tenant; writes stay Chris-only.

- Single-brew share link (`/brews/[id]` as a gated public read-only page).
- Single-coffee share-to-roaster link ("here's how I brewed your coffee").
- **Triggers when** knowledge has visibly compounded (substrate done + friction gone + months of dense logging).

### Workflow integration (low priority, mostly covered)

- Voice input for brew lessons / mobile MCP logging while brewing — already covered via claude.ai voice + `push_brew`. Defer unless app-side friction surfaces.

### Substrate expansion (Chris-gated, future)

- **Filter drawdown comprehensive test** — empirical timing of every owned filter on real beds. Output ingests into `lib/filter-registry.ts` + the Brewing Equipment Expert cluster. Authoring effort, not a code sprint. (The prior Filter-drawdown *research experiment* closed 2026-05-27 — see [shipped.md](docs/sprints/shipped.md) + the Research Coordinator roadmap; this is the substrate-ingest follow-on.)
- **Water chemistry as an 11th canonical taxonomy + a "Water Design" Step 1d gate** — `lib/water-registry.ts` + `docs/taxonomies/water.md` + `brews.water` text canonical, **plus** a dedicated "Water Design" Coffee Brief Step 1d gate (peer to brewer/filter/temp). Water is the brewing philosophy's named **#1 frontier lever** (the comp winner's edge, Chris's biggest gap) but its promotion is **gated on completing the water research project** — until then it stays a cross-cutting doc-layer flag (the WBC corpus check's cross-cutting half), NOT a forced Named Consideration. Decision source: [CONTEXT-taste.md § Brewing philosophy](CONTEXT-taste.md) (decision 15) + the water research project is a natural Research Coordinator project per ADR-0017. **Triggers when:** the water research project completes and produces enough data to define canonical entries.

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
