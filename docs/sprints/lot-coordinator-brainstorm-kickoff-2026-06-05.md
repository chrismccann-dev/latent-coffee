# KICKOFF — Lot Coordinator + V-Set Assistant brainstorm (2026-06-05)

**THIS IS A GRILLING / BRAINSTORM SESSION. DO NOT EXECUTE. DO NOT BUILD.** Chris's audio is the load-bearing signal — interview in long-form prose, fork by fork, default to "ask, don't ship." The autonomy rule does NOT apply. This is **brainstorm → plan → roadmap**, with **no build until the trigger fires** (the next fresh green-bean lot). Walk the whole roasting workflow end-to-end before scoping anything.

## What this is (the framing that changed 2026-06-05)

Restructure roasting from ONE claude.ai session per lot into a **Lot Coordinator** (persistent, holds the lot plan, does design + close, never runs a cycle) + a **V-Set Assistant** (ephemeral, spawned per V-set, runs roast→cup→learned, STOPS, returns a thin packet). Mirrors the Research Coordinator/Assistant pattern.

**But it is no longer a bespoke roasting thing.** Per the roadmap recap, Lot Coordinator is **instance 2 of the self-improving skill loop** ([ADR-0023](docs/adr/0023-self-improving-skill-loop.md)) — a deliberate worked example of the *generalized spine* (plan-session ↔ execute-session via handoff packets). Get the spine right, because it is the reusable shape that ≥3 instances will graduate into a universal framework. (Instance 1 = architecture-review, maturing.)

## Read first (don't re-derive — these are canonical)

- **[ADR-0023](docs/adr/0023-self-improving-skill-loop.md)** — the self-improving skill loop. The spine + Loop 1 (improvement, anti-lawyer-redline safeguard) + Loop 2 (compaction) + **one-skill-one-job**. *This brainstorm is its instance 2.*
- **[ADR-0022](docs/adr/0022-formalization-tax-and-self-improvement-counterbalance.md)** — the formalization tax + graduation threshold (N=3) + arbiter-shaped clawback + prototype-as-input-not-canon. The governing principles. **Apply the tax here: don't over-formalize the brainstorm; name shapes, defer build.**
- **[ADR-0017](docs/adr/0017-research-assistant-architecture.md)** — the existing coordinator/assistant spine + its **Exception 1**, which this pattern *breaks* (claude.ai-mediated coordinator/assistant with MCP shared state, not in-process). The brainstorm should produce a new ADR capturing that break.
- **[docs/features/lot-coordinator-brainstorm-2026-06-02.md](docs/features/lot-coordinator-brainstorm-2026-06-02.md)** — the prior brainstorm. Already converged: V-set is the assistant container; Coordinator/Assistant boundary = the **predicted/actual boundary** (Coordinator writes `roast_recipes` + `experiments.predicted_cup`; Assistant writes `roasts` + `cuppings`); Cluster A is already the brewing-handoff half; MCP shared state keeps packets thin; lot plan = the "Roasting Brief."

## The load-bearing context

Roasting has always run as **ONE claude.ai session per green-bean lot** — the whole lifecycle (design → V-set roast → cupping → iterate → reference call → learnings) in a single thread (carried from the pre-app spreadsheet era). That single-session model is the **root cause of cross-domain handoff verbosity** (the rich-vs-thin Optimized Brew Packet friction): the session holds the lot's entire history "in its head" and can't compress to a thin packet. Brewing, by contrast, is already thread-per-brew, short-lived. Current roasting prompts: V-set lifecycle = `start-lot` / `log-roast` / `log-cupping` / `close-lot`; one-shot = `one-shot` + `one-shot-closeout`.

## Seams to walk (the brainstorm agenda — fork by fork, with Chris)

1. **The spine.** Coordinator ↔ Assistant boundary = predicted/actual boundary — stress-test it against the real workflow. What exactly does the Coordinator hold across V-sets? When is an Assistant spawned, and what's its exact stop condition?
2. **One-skill-one-job (ADR-0023).** `log-cupping.md` currently does too much — beyond recording the cup it *designs V_(n+1) inline* (STAGE 5/6) and *proposes doc changes* (STAGE 7). Case 006 deliberately deferred this boundary here. Decide: does V_(n+1) design move to the Coordinator (it's a *predicted/design* act)? Does doc-proposal move to a docs workflow? What's the cupping skill's *one job*?
3. **The three packet shapes** (the handoff-packet design the whole loop depends on): **Roasting Brief** (the Coordinator-side lot plan, mirror of the brewing Coffee Brief), **V-set Handoff Packet** (Coordinator→Assistant, design intent *down*), **V-set Results Packet** (Assistant→Coordinator, actuals + interpretation *up*). MCP shared state keeps them thin — what's in the packet vs. what's a shared-DB read?
4. **Lifecycle-state model.** Brew-side handoff waits (the "awaiting brew-side completion" state gap, one-shot + V-set) — does the lifecycle state machine need new states for the Coordinator/Assistant + brew-side waits?
5. **Composition with the Master Coordinator + existing prompts.** How do the 4+2 prompts map onto Coordinator vs Assistant? Which become Coordinator stages, which become Assistant stages?
6. **Brewing scope.** Roasting-only (locked), or does brewing's short thread-per-brew need anything? (Prior lean: roasting-only; brewing already thin.)

## Vocab to grill into CONTEXT-roasting (grilling-queue item 46)

**Roasting Coordinator**, **V-Set Assistant**, **Roasting Brief**, **V-set Handoff Packet**, **V-set Results Packet** + the structural framing (Coordinator/Assistant boundary = predicted/actual boundary). **Grill at/just before the plan sprint** (grilling-first, not bulk-authored ahead of the build).

## Also fold in (same surface)

- **Grilling-queue item 48** — `cupping-specialist` + `roasting-assistant` SKILL.md descriptions in `lib/mcp/docs.ts` are drifted ("Path C-2 / real-pourover discriminator," "STAGE 3 V_(n+1) design intent"); the STAGE 5/6 boundary decision is the moment to reconcile them.
- **MCP context-efficiency prerequisites** (in [issues.md](docs/product/issues.md)): `read_canonical(axis, name)` + `get_bean_pipeline(since:)` — both make the thin-packet + shared-state model viable. Note: `get_bean_pipeline` returns ~85-135 KB and exceeds the tool output cap (auto-saves to a file; jq it) — a real constraint on the packet design.

## Output

- The [lot-coordinator brainstorm doc](docs/features/lot-coordinator-brainstorm-2026-06-02.md) extended/refreshed with the resolved seams + the spine design.
- A decision: does it graduate to a **plan** now (scoped, still trigger-gated on a fresh lot), or stay brainstorm?
- A **new ADR** if the claude.ai-mediated + MCP-shared-state coordinator/assistant pattern firms up (it breaks ADR-0017 Exception 1).
- The CONTEXT-roasting vocab grill (item 46) at/near the plan point.
- Roadmap currency.

## Standing rules

- Grilling close runs the **claude.ai grilling review** IF claude.ai-facing substrate changed (CONTEXT-roasting vocab / prompt changes / MCP descriptions).
- Six-actor audit on anything that touches substrate.
- Apply the **formalization tax** to the brainstorm itself — name the spine + packet shapes; don't build the universal loop; let this be a clean instance-2 worked example.

BRANCH: own branch off latest main when edits are ratified.
