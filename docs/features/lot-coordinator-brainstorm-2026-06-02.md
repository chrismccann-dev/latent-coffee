# Lot Coordinator + V-Set Assistant — brainstorm

**Status:** Brainstorm CONVERGED 2026-06-02; **all seams resolved + GRADUATED TO PLAN 2026-06-09** (see [§ 2026-06-09 resolution](#2026-06-09-resolution-all-seams-walked-graduated-to-plan) below). Architecture locked in **[ADR-0024](docs/adr/0024-lot-coordinator-claude-code-native.md)**; plan-sprint kickoff at [docs/features/lot-coordinator-plan-kickoff-2026-06-09.md](docs/features/lot-coordinator-plan-kickoff-2026-06-09.md). **Build trigger-gated** on the next fresh green-bean lot (operator out of town; prepped and ready for return); the first lot is an explicit dogfood. The big reversal from this doc's original framing: the Coordinator/Assistant pair is **Claude-Code-native, not claude.ai-mediated** — which means it *confirms* ADR-0017 Exception 1 rather than breaking it, and the Coordinator is **Brief-persistent / session-transient** (Model B), not a persistent thread.

**Session:** Capstone roadmap-review + Lot Coordinator brainstorm (grilling/interpretive). Mirror pattern: [ADR-0017 — Research Coordinator + Research Assistant](docs/adr/0017-research-assistant-architecture.md).

---

## The problem (root cause, not symptom)

Roasting runs as **one claude.ai/roasting session per green-bean lot**. That single session carries the entire lifecycle — green-bean intake → V1 design → V1 roast → V1 cupping → iterate → V2 → V3 → … → reference-roast call → optimized brew → learnings synthesis — over **weeks to months** (each V-set spans 7-9 days minimum: roast → rest → cupping).

This predates everything (the app, the precursor app, even the spreadsheet). It was the right shape *then*: the end-of-lot "full fill" needed one session holding all roasts + cuppings + brewing history + back-and-forth in its head.

It is now the **root cause of two compounding failures**:

1. **Context-window bloat.** claude.ai/roasting is already auto-compacting mid-lot — the window is filling. Small docs don't fix it: feeding many concurrent documents over many weeks/months *inevitably* bloats a single long-standing session.
2. **Process-update resistance.** Because the session holds not just the lot's data but every *old way of doing the process*, any substrate change (e.g. "emit a thin packet now, not the rich one") forces the session to re-derive against all the old methods still in its head. This is what the rich-vs-thin Optimized Brew Packet friction (2026-06-02) actually exposed — **packet verbosity is a symptom of the single-session model, not a packet-template problem.** Tightening templates fights the symptom.

**Contrast — brewing has none of this.** Brewing is sequential by nature, thread-per-brew, ~3-4 iterations over 1-3 days, little carried state (no V-set, no parallel comparison). The single-session problem is **roasting-specific**. → **v1 scope is roasting-only** (Chris-ratified 2026-06-02).

---

## The architecture (Chris's diagram, 2026-06-02)

Mirror ADR-0017: a persistent **Coordinator** holds the master plan + state and does the design + close, but never runs the individual cycles; ephemeral **Assistants** run each cycle and roll only *results* back up. Chris is the **courier** between sessions.

```
   V-Set Assistant (1)            ┌──────────────────────────────────┐
   in: V1 Packet                  │       ROASTING COORDINATOR       │
   runs V1 roast + cupping  ◀─────│  (persistent — one per lot)      │
   out: V1 Results Packet  ──────▶│                                  │
                                  │  ┌────────────────────────────┐  │
   V-Set Assistant (2)            │  │ START LOT                  │  │
   in: V2 Packet                  │  │  green-bean intake         │  │
   runs V2 roast + cupping  ◀─────│  │  sets up V1                │  │
   out: V2 Results Packet  ──────▶│  │  → V1 Handoff Packet       │  │
                                  │  └────────────────────────────┘  │
   V-Set Assistant (3)            │  ┌────────────────────────────┐  │
   in: V3 Packet                  │  │ V1 result → writes V2      │  │
   runs V3 roast + cupping  ◀─────│  │  → V2 Handoff Packet       │  │
   out: V3 Results Packet  ──────▶│  └────────────────────────────┘  │
        … loops V_n → V_(n+1)     │  ┌────────────────────────────┐  │
          until green exhausted   │  │ V2 result → writes V3      │  │
                                  │  │  → V3 Handoff Packet       │  │
                                  │  └────────────────────────────┘  │
                                  │  ┌────────────────────────────┐  │   Brewing Assistant (1)
                                  │  │ V3 result → Sim Pourover   │──┼──▶ in: Sim Pourover Packet
                                  │  │  → Sim Pourover Packet     │◀─┼─── out: Sim Pourover Recipe
                                  │  └────────────────────────────┘  │
                                  │  ┌────────────────────────────┐  │   Brewing Assistant (2)
                                  │  │ Sim Pourover runoff        │──┼──▶ in: Optimized Pourover Packet
                                  │  │ Reference Roast declared   │  │   full brewing iteration cycle
                                  │  │  → Optimized Recipe Packet │◀─┼─── out: inserted Brew ID
                                  │  └────────────────────────────┘  │
                                  │  ┌────────────────────────────┐  │
                                  │  │ CLOSE LOT                  │  │
                                  │  │  reconcile all data        │  │
                                  │  │  tie optimized brew_id     │  │
                                  │  │  write roast learnings     │  │
                                  │  └────────────────────────────┘  │
                                  └──────────────────────────────────┘
```

### Roles

| Role | Session | Owns | Never does |
|---|---|---|---|
| **Roasting Coordinator** | claude.ai, **persistent** (one per lot) | Lot plan (the *Roasting Brief*), V-set *design* writes, the close/iterate/sim-pour decisions, sim-pour + optimized-brew orchestration, lot close-out + reconciliation | Run a roast; pull Roest logs; push roasts/cuppings; hold raw cycle data (pulls from MCP on demand) |
| **V-Set Assistant** | claude.ai, **ephemeral** (one per V-set, 7-9+ days) | The full V_n cycle — roast → rest → cupping — all `roasts`/`cuppings` writes, `roast_recipes` actual-patching, leading-slot marking, and the **V_n Results Packet** | Design V_(n+1); decide close vs iterate; touch lot-level plan |
| **Brewing Assistant (1)** | existing brewing surface | Sim-pourover recipe from a Sim Pourover Packet (= `simulated-pourover.md`) | — |
| **Brewing Assistant (2)** | existing brewing surface | Full brewing iteration on the reference roast → inserted `brew_id` (= optimized-brew path in `bundled-brewing-completion.md`) | — |

---

## Key structural findings

### 1. The Coordinator/Assistant boundary IS the predicted-vs-actual boundary

The seam cleaves prediction-authorship from actual-capture:

- **Coordinator writes the *predictions*** — `roast_recipes` rows + `experiments.predicted_cup_*` (design intent). This is today's `start-lot` S2-3 and `log-cupping` S5 (Design V_(n+1)).
- **V-Set Assistant writes the *actuals*** — `roasts` + `cuppings`, and patches the recipe rows with Roest linkage. This is today's `log-roast` + `log-cupping` S1-3.

The handoff packet carries predictions *down*; the results packet carries actuals + interpretation *up*. Consequence: **building the Coordinator naturally produces the predicted/actual pairing that the [Predicted-vs-Actual roast delta surface](PRODUCT.md) roadmap item renders.** Two roadmap items share one spine.

The seam is already a stage break in today's prompts: `log-cupping` STAGE 3 → STAGE 4. Today's single session runs S1-5 in one breath *because it holds the whole lot in its head*; the split ends the Assistant at S3 (record + interpret the cup) and moves S4-5 (decide + design next) up to the Coordinator.

### 2. Cluster A (shipped 2026-06-01) is already the brewing-handoff half of this

The two Brewing Assistants are **existing surfaces**, not new builds:
- Brewing Assistant (1) = `simulated-pourover.md` + `log-cupping` `eval_method:'Simulated Pourover'` flip.
- Brewing Assistant (2) = optimized-brew LINK path in `bundled-brewing-completion.md` + `close-lot` S4.

The verbose cross-domain packet that started this whole thread *is* a Coordinator→Brewing-Assistant handoff — verbose **because the bloated single session emitted it**. Once a thin Coordinator emits it instead, the packet gets thin for free. The cause-fix is structural, not aspirational.

### 3. MCP is shared state — handoffs can be near-empty

Unlike research (no shared store, handoffs carry everything), roasting has the **MCP DB as shared state** between Coordinator and Assistant. The Assistant writes roasts/cuppings to the DB; the Coordinator pulls `get_bean_pipeline` to see them. So:
- Handoff/results packets carry **only interpretation + pointers**, never numbers.
- A fresh V-Set Assistant can **reconstruct most of its input** by pulling the lot pipeline — the courier paste shrinks toward "run V2 for bean X, focus = the 108°C drop hypothesis."

This makes [`get_bean_pipeline since:`](PRODUCT.md) and the [`read_canonical` name-filter](PRODUCT.md) **prerequisites of this architecture, not loose MCP side-quests** — they keep couriering cheap as the lot grows.

### 4. Sim Pourover Packet → Coordinator owns it

The sim-pour is the *reference-roast contention* decision — cross-candidate, lot-level (`log-cupping` STAGE 4 Simulated Pourover Gate). The V-Set Assistant only *surfaces* the leading candidates in its results packet; the Coordinator decides to run the runoff and emits the Sim Pourover Packet. (Confirmed against Chris's diagram, which places it Coordinator-side.)

---

## Resolved open tensions (Chris-ratified 2026-06-02)

1. **V-set vs roast/cupping granularity → V-set is the container.** Considered splitting roast and cupping into two finer assistants, rejected: a V-set is the complete cycle of the (typically 3) roasts → end cupping, and predicted/actual for *both* roast and cup must survive together as one unit. The 7-9 day span is exactly why it must live in its own ephemeral session rather than the Coordinator. Re-split only if a single V-set ever grows exponentially — don't over-design now.
2. **Coordinator bloat is accepted.** It's persistent, so it accumulates — but it holds only the plan + thin handoffs, never raw cycle data (pulled on demand). Grows far slower than today's everything-in-one-session. Not zero; acceptable.
3. **The lot plan lives Coordinator-side as a "Roasting Brief."** Mirror of the brewing-side Coffee Brief. The Coordinator intakes the green-bean lot, authors the brief, holds plan state, keeps the lot on-plan, and closes out when reference roast + optimized pourover are both done.

---

## Open questions for the eventual plan sprint (NOT decided here)

- **Packet/brief templates (the core deliverable).** Define three shapes — *V-set Handoff Packet* (down), *V-set Results Packet* (up), *Roasting Brief* (the lot plan). Getting these thin *is* the thin-handoff discipline.
- **Master Coordinator composition.** Is the Roasting Coordinator operator-direct (like Research Coordinator, ADR-0017 Exception 1) or Master-Coordinator-dispatched? How do the existing `start-lot` / `log-roast` / `log-cupping` / `close-lot` prompts re-slot across the two session types (Coordinator owns start-lot + close-lot + design; Assistant owns log-roast + log-cupping S1-3)?
- **Where does the Roasting Brief persist?** Coordinator session memory only, a doc (`docs/lots/<lot>.md`, research-projects style), or a `green_beans` field (`lot_strategy_arc`)? Persisting it makes the Coordinator *reconstructable* — de-risking the single-session fragility that motivated this whole thread. Biggest-change / highest-prize option.
- **Sim-pour runoff data-capture ownership.** The runoff logs as `cuppings` with `eval_method='Simulated Pourover'` — does the Coordinator capture it, or spawn a mini-assistant? Minor; resolve at plan time.
- **Needs its own ADR.** This *breaks* ADR-0017 Exception 1 (research = Claude-Code-direct, no shared store). This is **claude.ai-mediated with MCP as shared state** — a genuinely new pattern, and the reason handoffs can be thin. New ADR, not an amendment.
- **CONTEXT-roasting grill.** New vocabulary to lock: *Roasting Coordinator*, *V-Set Assistant*, *Roasting Brief*, *V-set Handoff Packet*, *V-set Results Packet*. Run a `/grill-with-docs` pass before/at the plan sprint.
- **Missing "awaiting brew-side completion" lifecycle state(s) on `/green`** (folded in from the 2026-06-03 priority-stack recount; see [docs/product/issues.md](docs/product/issues.md)). The current lifecycle has `waiting_for_next_roast` / `waiting_for_next_cupping` but **no state for "pourover packet emitted to the brewing side, waiting for the brew-side task to finish before the next roasting-side step."** Two variants the Coordinator/Assistant model needs to represent: (1) **one-shot** — optimized-pourover packet → brew → close-out (resolved/unresolved); today the cupped-but-not-closed one-shot mis-buckets to "waiting for next roast" (`computeLifecycleState` rule (f)) because there's no such state (Mountain Harvest is the live example). (2) **V-set** — simulated-pourover packet → brew-side runoff → declare reference roast OR iterate (this is the Sim Pourover Gate / §4 above). **Both are state-shaped, not design-shaped**, and were deliberately NOT patched in the recount session (Chris: don't design something this sprint will rework). Decide here whether these become first-class lifecycle states, a Coordinator-side "brief" status, or a thin derived signal — and how `computeLifecycleState` + the `/green` index sections reflect them. `green_beans.optimized_brew_id` / `peer_reference_brew_id` already exist and may be the hook.

## Prerequisites already on the roadmap

- `get_bean_pipeline since:` incremental fetch + `read_canonical` name-filter (Missing/Incomplete) — re-tagged as Lot-Coordinator prerequisites.

## Trigger

**Operator-gated.** Chris green-lights when the next *fresh* green-bean lot is ready to start clean on the new process (dogfood + design simultaneously). Cluster B completes first.

---

## 2026-06-09 resolution (all seams walked; graduated to plan)

Grilling continuation of this brainstorm. Every open seam resolved + Chris-ratified by audio, fork by fork. Canonical record is **[ADR-0024](docs/adr/0024-lot-coordinator-claude-code-native.md)**; this section is the narrative trail. Two operator-provided prototype inputs were mined (treated as input-not-canon per Chris): an agent-surface-area prototype + a handoff diagram, and the lived Gesha Clouds full-cycle example (incl. an SPG-fails-back-to-V4 case) — useful for *shape*; the system as-built stayed the ground truth. The [severity handoff (2026-06-06)](docs/features/roasting-context-window-severity-handoff-2026-06-06.md) made the problem empirical (~80-90% post-compaction; cost flipped to conversation prose; a lived `get_bean_pipeline`-skip staleness failure).

### The big reversal: Claude-Code-native, not claude.ai-mediated

This doc originally assumed the pair would be **claude.ai-mediated** (and therefore *break* ADR-0017 Exception 1, needing a new "claude.ai-mediated + MCP-shared-state" ADR). Chris reopened that inherited assumption and we flipped it: **roasting moves to Claude Code.** Decided on the **domain-boundary principle** — put the surface boundary where the domain boundary already is: roasting-domain → Claude Code; brewing-domain → claude.ai (for now). The optimized brew + the SPG *execution* stay claude.ai (both brewing-domain); the SPG *decision/verdict* is Coordinator-side. Going Claude-Code-native resolves three hard problems at once (forces the Brief into durable substrate; *confirms* Exception 1 instead of forking a new pattern; makes instance 2 coherent with the spine) and puts the skill where the self-improving loop can see/edit it. Accepted cost: no mobile fallback for the roasting loop (core loop is home+laptop anyway). Grace-handoff migration: build net-new, destroy nothing; retire claude.ai/roasting when the last in-flight lot resolves.

### Persistence: Model B (Brief-persistent, session-transient)

Chris initially pictured a long-running Coordinator thread (Research's nominal shape). After walking the tradeoffs we chose **Model B**: the **Roasting Brief** (`docs/lots/<lot>.md`) is the source of truth; coordinator sessions are transient (a role any fresh session adopts by reading the Brief + `get_bean_pipeline`); keep-warm is an allowed optimization, never depended on. Deciding argument: **asymmetry of failure modes** — Model A's failure mode (long thread bloats + compacts lossily) is the exact thing we're escaping; Model B's (imperfect write-discipline drops a little nuance, recovered from the DB) is mild + self-correcting, and the transient-session constraint is a healthy forcing function keeping the Brief complete. First-class Coordinator responsibility: write the Brief at every natural break.

### Fork-by-fork resolutions

1. **The cut (Forks 1+2).** Predicted/actual, three roles. **V-Set Assistant** = execute the cycle only (roast → post-roast re-prediction → cupping record → patch experiment cup-side → Results Packet → STOP; writes `roasts` + `cuppings`). **Coordinator** = plan + close (Brief, every V-set design = predictions, route decisions, reference, close-out). **Doc-proposals** = close-time substrate-fold (Execution role), out of the cupping step entirely. This decomposes today's overloaded `log-cupping.md` (record + design-next + propose-docs → three jobs).
2. **Prediction = three-point delta chain.** Design prediction (Coordinator, pre-roast) → roast-actual re-prediction (Assistant, post-roast, **durable write** — chosen over ephemeral) → cup-actual (Assistant). Drop rules are *why* the roast diverges from design, so the honest cupping-table baseline is the roast-actual re-prediction, not the design one. Assistant holds #2/#3 in-cycle (triangulated vs producer notes); Coordinator resolves all deltas on return. This is the predicted-vs-actual delta surface the roadmap wants.
3. **Packets (Fork 3).** Brief (durable, points at DB for numbers) / near-empty Handoff-down (Coordinator stages recipe rows + Roest profiles first; packet = "run V2, focus = X") / thin Results-up (row pointers + interpretation + next-step hypothesis as input-not-canon + route recommendation as input). MCP shared state keeps all packets thin. Route recommendation is **input**; the Coordinator decides because it owns the plan and the next step *is* the plan.
4. **Lifecycle (Fork 4).** Move from *derived* to **stored `lot_status`** — because the brew-side-wait has no row to derive from. Coarse set with one catch-all `waiting_for_brewing` (the Brief holds which brewing task). Guardrails recover derived's can't-drift virtue: single write path (MCP Tools + Coordinator) + a `check:lifecycle-consistency` validator gate. Visible on `/green`. (Chris pushed for the stored field over my initial derived-lean; the brew-wait forcing stored signal anyway settled it.)
5. **Skills (Fork 5).** Operator-direct (Exception 1 confirmed + extended). **Hybrid** reconciliation: subsume the prose-heavy design/close logic into the two session skills; keep the thin Tool-owning executors (`roast-recorder` / `cupping-specialist` / `roest-api-worker`) as called primitives; compose the knowledge clusters unchanged. **Build net-new, destroy nothing** (grace-handoff). **One-shot = N=1 lot** (degenerate Coordinator, one Assistant).
6. **Brewing scope (Fork 6).** Roasting-only, locked (re-confirmed). Brewing stays claude.ai; the cross-domain seam is the designed packet boundary.

### Operator dry-run (validated; the thing to test against the real lot)

T0 Start lot (Coordinator, fresh CC session) → V1 Handoff. T1 V1 roast+cup (Assistant) → Results Packet → STOP. T2 Coordinator (fresh session, reconstructs from Brief + DB) resolves deltas + routes: next V-set | SPG | reference. T3 SPG on brewing side (claude.ai) → verdict back. T4 Coordinator consumes verdict: pass → declare reference + optimized-brew packet; fail (fighting too hard brewing-side = roasting problem) → design V4. T5 Optimized brew (claude.ai) → return packet. T6 Close lot (Coordinator): reconcile, tie `brew_id`, `roast_learnings`, substrate-fold, archive inventory, `resolved`. Every "back to Coordinator" is a fresh session reconstructing from the Brief.

### Parked / deferred

- **Drop-rules mechanism edits** — Chris has specific improvements to how drop rules are designed/executed (surfaced during the prediction discussion). Parked to the [grilling queue](docs/grilling-queue.md), separate from item 35 (drop-rules UI persistence).
- **CONTEXT-roasting vocab grill** ([item 46](docs/grilling-queue.md)) — fires at plan-sprint kickoff, *before* the build (grilling-first).
- Exact schema (`lot_status` enum + migration + resolution-pointer FKs), exact cluster contents, the `check:lifecycle-consistency` script — all build-time (tax: states named, schema deferred).
