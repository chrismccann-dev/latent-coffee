# Why the roasting side needs the Lot Coordinator — severity handoff

**Audience:** the Lot Coordinator / V-Set Assistant kickoff thread.
**Purpose:** make sure we're on the same page about *why this is urgent*, not just nice-to-have. This is the empirical case, from a real lived lot (REDPLUM-CAS-2026), measured in the 2026-06-05 claude.ai grilling review ([full record](../sprints/grilling-2026-06-05-claude-ai-review.md)).

**TL;DR:** the roasting workflow concentrates an entire multi-day, multi-V-set lot into **one** claude.ai thread. That thread has now been measured at **~80-90% of the 200K context window mid-lot — and that reading is *after* the thread already compacted once or twice.** Context overflow on a roasting lot isn't a cost problem; it's a **silent data-integrity / decision-quality problem**, because compaction is lossy and the model can't tell you what it dropped. The Lot Coordinator / V-Set Assistant split is the structural fix.

---

## 1. Why roasting is structurally different from brewing

Brewing is short-cycle: one coffee, one (or a few) sessions, then archive. Context never accumulates far.

Roasting is **state-heavy and long**: a single green-bean lot runs for weeks across V1 → V2 → V3+ iterations, each with a roast, a Day-7 cupping, often a Simulated Pourover Gate, then a close-out with reference designation + `roast_learnings` synthesis. Today, **all of that lives in one continuous claude.ai thread per lot.** The thread is the lot's working memory. As the lot progresses, that memory grows monotonically and never sheds — until the window forces compaction.

This is a roasting-specific architecture problem. The brewing side does not have it.

## 2. What we measured (REDPLUM-CAS-2026, mid-V-set)

REDPLUM at the time of measurement: V1 closed, V2 roasted + cupped, SPG run, V3 designed — **three sessions stacked in one thread**, lot **not yet closed**.

| Reading | Peak context | Dominant cost |
|---|---|---|
| 2026-05-31 (earlier, less deep) | ~55-65% | **MCP tool payloads** |
| 2026-06-05 (3 sessions deep) | **~80-90%** | **conversation prose (~50-55%)** |

Two things changed between readings:

1. **The peak jumped** ~55-65% → ~80-90% as sessions stacked.
2. **The dominant cost flipped.** It's no longer MCP payloads (~30-35% now) or docs (~3-5%) — it's **claude.ai's own accumulated prose** across the stacked sessions (long structured outputs: roast debriefs, V_n design tables, experiment closures, proposal text, feedback summaries). Every turn stays in the window forever.

### The severity multiplier: it already compacted

**The ~80-90% is a post-compaction snapshot.** The REDPLUM thread compacted once or twice *before* this reading. So true cumulative demand already exceeded the window — compaction shed load, and the thread *still* refilled to 80-90%. And the lot **isn't closed yet**: close-lot + `roast_learnings` synthesis + reference designation are still ahead, and each future V-set adds another stacked session. The single-thread model has **no ceiling control** — it will compact repeatedly over a full lot, increasingly.

## 3. Why this is a correctness problem, not just a cost problem

Compaction is **lossy summarization**, and on a roasting lot the things at risk of being silently dropped are exactly the load-bearing ones:

- prior-V-set **roast actuals** (RoR shape into FC, FC temp/time, drop conditions, Agtron deltas),
- **design intent + drop rules** for the current roast,
- hard-won **schema-discovery** (which fields exist, enum values, validation rules like `manual` → `end_condition_target: null`),
- cupping **deltas** that drive the next iteration's hypothesis.

The next V-set's design *depends* on precise recall of the prior ones. Lossy mid-arc memory means the model can design the next roast against a degraded picture **without knowing it has.**

This isn't hypothetical — we already saw the precursor failure. Under context pressure, claude.ai **deliberately skipped `get_bean_pipeline` pulls** to save tokens, and as a direct result **missed that the V2 recipes had grown populated `predicted_*` fields** when it went to write deltas. That's a real state-staleness error caused by context-saving behavior — and compaction makes that class of error worse *and* invisible.

## 4. Why the Lot Coordinator / V-Set Assistant split fixes it

The split attacks the now-#1 cost (cumulative conversation prose) at the root:

- **V-Set Assistant** = ephemeral. It runs **one** roast → cup cycle, emits a thin **Results Packet**, and **stops.** Its conversation prose never accumulates into the lot's long-lived memory. A fresh Assistant per V-set means per-session context is bounded to one cycle's work.
- **Roasting Coordinator** = persistent, but holds only the **durable plan** (Roasting Brief) + the thin packets crossing in/out — *not* the full prose of every cycle.
- **Shared state lives in the DB** (the MCP layer), reconstructed via **thin pulls** rather than carried as conversation history. A fresh Assistant rebuilds its input from a `get_bean_pipeline since:<last>` pull, not from a fat courier paste or inherited thread.

Net: the lot's cumulative knowledge lives in **substrate** (experiments / roasts / cuppings / roast_learnings + the Brief), where it belongs and where it's lossless — not in an ever-growing thread that compacts.

## 5. Two prerequisite MCP fixes (already in issues.md, tagged Lot-Coordinator prerequisites)

These keep the handoff packets and per-session pulls thin, so the split actually delivers the savings:

- **`read_canonical` name filter** — today the bare form returns the full axis registry (flavors ~20K tokens) for a one-row lookup; observed 3× as a cost driver. (Note: the project memory already *documents* a `read_canonical(axis, name)` signature that **isn't implemented** — so it's also a memory-vs-reality gap.)
- **`get_bean_pipeline since:<timestamp>`** — incremental fetch returning only newer-than-last-pull rows. The full pipeline response is ~25-35KB by mid-V-set and grows every pull; it's what claude.ai was skipping (and getting stale) to avoid. A `since:` param removes the incentive to skip and is what lets a fresh V-Set Assistant cheaply reconstruct state.

## 6. The one caveat

The clean **full-lifecycle** number doesn't exist yet — 80-90% is a *mid*-V-set, post-compaction lower bound. Re-measure at REDPLUM's close-out; it will be higher. But the trajectory and the compaction evidence are already conclusive enough to design against: **the single-session-per-lot model cannot hold a full roasting lot without lossy overflow, and that overflow corrupts the lot's own working memory mid-arc.** That's the problem the Lot Coordinator exists to solve.
