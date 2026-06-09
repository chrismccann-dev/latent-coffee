# ADR-0024: The Lot Coordinator + V-Set Assistant — Claude-Code-native, Brief-persistent

**Date:** 2026-06-09 · **Status:** Accepted (architecture locked) — **build trigger-gated** on the next fresh green-bean lot; the first lot is an explicit dogfood that may revise details before final.

This records the architecture resolved in the 2026-06-09 Lot Coordinator brainstorm (the grilling continuation of the [2026-06-02 brainstorm](docs/features/lot-coordinator-brainstorm-2026-06-02.md)). It is **instance 2 of the self-improving skill loop** ([ADR-0023](docs/adr/0023-self-improving-skill-loop.md)) — a deliberate worked example of the plan↔execute spine, not a bespoke roasting thing. It **confirms and extends** [ADR-0017](docs/adr/0017-research-assistant-architecture.md) Exception 1 (the 2026-06-02 doc assumed this would *break* Exception 1 by being claude.ai-mediated; the surface decision below reverses that).

## Context

Roasting has always run as **one claude.ai session per green-bean lot** — design → V-set roast → cupping → iterate → reference call → optimized brew → learnings, over weeks to months, in a single thread (inherited from the pre-app spreadsheet era). The [severity handoff (2026-06-06)](docs/features/roasting-context-window-severity-handoff-2026-06-06.md) made the case empirical: a mid-lot REDPLUM thread measured **~80-90% of the 200K window post-compaction**, the dominant cost having flipped from MCP payloads to **claude.ai's own accumulated prose**. Compaction is lossy over exactly the load-bearing data (prior roast actuals, drop rules, cupping deltas), and a lived failure already occurred — under context pressure the session skipped `get_bean_pipeline` and missed that V2 recipes had grown populated `predicted_*` fields. **Context overflow on a roasting lot is a correctness problem, not a cost problem.**

The single-session model is the root cause. Brewing does not have it (short, thread-per-brew). So the fix is roasting-only.

## Decision

Build a **Roasting Coordinator + V-Set Assistant** pair, Claude-Code-native, with a durable Brief as the persistence mechanism. Eight locked decisions:

### 1. Surface — Claude-Code-native (the reversal)

The Coordinator and V-Set Assistant run as **Claude Code sessions**, mirroring Research (operator types "start a new lot" / "run V2's roast" into a fresh session). Not claude.ai-mediated, not Master-Coordinator-dispatched, not MCP-registered, not in `docs/prompts`.

The cut follows the **domain boundary**: roasting-domain → Claude Code; brewing-domain → claude.ai (for now). Consequences: the **optimized brew** (a brewing activity a roasting milestone triggers) and the **SPG execution** (brew finalists + cup + reason about reference-grade — "really a brewing exercise") both stay claude.ai. The SPG *decision + verdict consumption* is roasting-domain → Coordinator. The seam tracks the domain, so if brewing ever moves to Claude Code, the optimized brew follows for free.

This was an inherited assumption, not a chosen one — claude.ai for roasting came from the spreadsheet-era single-thread model. Going Claude-Code-native resolves three hard problems at once: it forces the Brief into durable substrate (decision 2), it *confirms* ADR-0017 Exception 1 instead of spawning a new claude.ai-mediated pattern, and it makes instance 2 coherent with the spine (instances 1/spine-ref/2 all on one surface → cleaner N=3 graduation). It also puts the skill where the self-improving loop can see and edit it (claude.ai is the one surface Claude Code can't).

Accepted cost: **no mobile fallback** for the roasting loop. The core roast→cup loop is inherently home+laptop (Roest live view; cupping is home-mornings), and the only mobile-wanting step (optimized brew) stays claude.ai. Watch-item: roasting-side (loop-visible) vs brewing-side (claude.ai, silent-drift) **methodology divergence** — accepted as transitional, mitigated by the cross-domain handoff being a designed seam.

### 2. Persistence — Model B (persistent Brief, transient sessions)

The **Roasting Brief** (`docs/lots/<lot>.md`, mirror of Research's `docs/research-projects/<track>.md`) is the source of truth. **Coordinator sessions are transient** — any fresh Claude Code session adopts the Coordinator role by reading the Brief + pulling `get_bean_pipeline`. Keeping a session warm within a sitting is an allowed optimization, never a thing the design depends on. The rule that makes it safe: **the Brief is written at every natural break, and no session is trusted to survive one** — so updating the Brief is a first-class Coordinator responsibility.

Rejected: **Model A** (long-running Coordinator thread, the Research nominal shape). Reason — asymmetry of failure modes. Model A's failure mode *is the thing we are escaping*: a long roasting thread that bloats and compacts lossily (the 2026-06-02 doc already conceded "Coordinator bloat is accepted… not zero"). Model B's failure mode is mild and self-correcting (imperfect write-discipline drops a bit of nuance, recovered from the DB) and the transient-session constraint is a healthy forcing function (per [ADR-0022](docs/adr/0022-formalization-tax-and-self-improvement-counterbalance.md) "constraint as forcing function") that keeps the Brief complete. "Persistent Coordinator" therefore means **persistent Brief, transient sessions** — there is no long-lived session to bloat.

### 3. The cut — predicted/actual, three roles

One-skill-one-job applied to today's overloaded `log-cupping.md` (it records the cup, designs V_(n+1), and proposes docs — three jobs):

- **V-Set Assistant — one job: execute the cycle.** Runs the roast, pulls/logs roast actuals, writes the post-roast cup re-prediction, records the cupping, patches the experiment cup-side, emits a Results Packet, **stops.** Writes `roasts` + `cuppings`. Designs nothing forward, proposes no docs. Ephemeral, one per V-set.
- **Coordinator — plans + closes.** Authors the Brief, designs every V-set (`roast_recipes` + design-intent `predicted_cup`), reads each Results Packet, resolves deltas, decides route, runs the SPG decision, declares reference, owns close-out.
- **Close-time substrate-fold (Execution role).** Doc-proposals move out of the cupping step entirely to lot close, mirroring Research's Execution session.

### 4. Prediction — a three-point delta chain

Drop rules guarantee the roast diverges from the design (organic material: runs long, never cracks, runs fast). So there are three points, not two:

1. **Design prediction** (Coordinator, pre-roast) — what the plan expected.
2. **Roast-actual re-prediction** (Assistant, post-roast) — what the *actual* roast leads us to expect in cup. **Durable write** (chosen over ephemeral guidance) so the delta surface can render both baselines. This is the honest cupping-table baseline.
3. **Cup actual** (Assistant) — judged against #2.

The Assistant holds #2 and #3 in-cycle (triangulated against producer tasting notes); the Coordinator **resolves all deltas** on Results-Packet return. This is the predicted-vs-actual delta surface the roadmap item wants.

### 5. Packets — thin via MCP shared state

- **Roasting Brief** — durable narrative plan + state; points at the DB for every number.
- **V-set Handoff Packet** (down) — **near-empty.** The Coordinator stages the `roast_recipes` rows + Roest profiles before spawning, so the packet is "run V2, focus = X"; the Assistant reconstructs from `get_bean_pipeline`.
- **V-set Results Packet** (up) — **thin:** row pointers (not numbers), leading slot + why, did-the-roast-behave, cup-vs-re-prediction read, next-step hypothesis (**input-not-canon**), route recommendation (**input** — Coordinator decides, because it owns the plan and the next step *is* the plan).
- Two cross-domain brewing handoffs (SPG-execution, optimized-brew), both claude.ai, both returning via DB + a thin verdict.

### 6. Lifecycle — stored `lot_status`

Move from today's *derived* lifecycle to a **stored `lot_status`**, because the brew-side-wait has no row to derive from (absence of a brew row can't distinguish not-handed-off from handed-off-and-waiting). Once one state needs stored signal, a single stored field beats derive-plus-exception. Coarse set: `in_inventory → waiting_for_roast ⇄ waiting_for_cupping → waiting_for_brewing → resolved / unresolved` (plus one-shot variants), with **one catch-all `waiting_for_brewing`** (the Brief holds which brewing task). Guardrails recover derived's can't-drift virtue: **single write path** (status only transitions through the MCP Tools that write the rows + the Coordinator at handoff) + a **`check:lifecycle-consistency`** gate (the derived logic survives as a validator). The brew-side-wait becomes visible on `/green`.

### 7. Skills — operator-direct, hybrid, net-new

- **Operator-direct** (ADR-0017 Exception 1 confirmed + extended to roasting); the 6-actor audit collapses to ~3.
- **Hybrid reconciliation** of the existing 5 roasting workflow skills: the two new session-skills **subsume the prose-heavy planning/design/close logic** (`roasting-assistant` design framework + `close-lot-specialist`), but **keep the thin Tool-owning executors as called primitives** (`roast-recorder`=push_roast, `cupping-specialist`=push_cupping, `roest-api-worker`=push_roast_profile — each genuinely one job). Knowledge clusters (`roest-knowledge`, `roasting-historian`, archivists) **compose** unchanged.
- **Build net-new, destroy nothing.** The existing prompts + skills stay live until the last in-flight claude.ai lot resolves, then retire on operator signal (grace-handoff). "Subsume" = the net-new skills *carry* the logic; the old surfaces are not deleted now.
- **One-shot = N=1 lot** (degenerate Coordinator, one Assistant spawn, close) — one structure with a trivial case, not a parallel structure.

### 8. The dry-run validated the flow

Start lot (Coordinator) → V1 Handoff → V1 roast+cup (Assistant, stops) → V1 Results → Coordinator resolves + routes → (next V-set | SPG→brewing | reference→optimized-brew→brewing) → close (Coordinator). Every "back to Coordinator" is a fresh session reconstructing from the Brief. The first real lot is the dogfood.

## Relationship to the other ADRs

- **[ADR-0017](docs/adr/0017-research-assistant-architecture.md)** — this *confirms* Exception 1 (Claude-Code-native coordinator/assistant) and extends it to roasting. It **differs** from Research on persistence: Research is nominally persistent-session; roasting takes Model B (Brief-persistent, transient sessions) because the lot duration + the proven context-bloat failure make a long session the exact thing to avoid.
- **[ADR-0023](docs/adr/0023-self-improving-skill-loop.md)** — instance 2 of the loop; built consciously to the spine so the eventual universal framework graduates from coherent instances.
- **[ADR-0022](docs/adr/0022-formalization-tax-and-self-improvement-counterbalance.md)** — the tax is applied throughout: lifecycle *states named, schema deferred* to build; the prototype docs treated as input-not-canon; Model B's transient-session constraint as a forcing function.

## Deferred to the build (not decided here)

Exact `lot_status` enum + migration; the resolution-pointer FKs (`reference_roast_id` etc.); exact cluster-doc contents of the two new skills; the `check:lifecycle-consistency` script. The **CONTEXT-roasting vocab grill** ([grilling-queue item 46](docs/grilling-queue.md)) fires at plan-sprint kickoff, *before* the build, to lock the terms (Roasting Coordinator / V-Set Assistant / Roasting Brief / V-set Handoff Packet / V-set Results Packet + the predicted/actual framing).

## Trigger

The next fresh green-bean lot, started clean on the new process. Plan-sprint kickoff brief: [docs/features/lot-coordinator-plan-kickoff-2026-06-09.md](docs/features/lot-coordinator-plan-kickoff-2026-06-09.md).
