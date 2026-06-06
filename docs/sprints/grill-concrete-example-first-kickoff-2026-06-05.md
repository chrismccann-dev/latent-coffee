# KICKOFF — grill: "concrete-example-first reasoning" (grilling-queue item 49)

**THIS IS A SHORT GRILLING SESSION.** Use the `grill-with-docs` skill. Ask-don't-ship; Chris's audio is load-bearing; do not pre-pick the definition. Goal: **name + define one concept, lock its relationships, decide its home.** Small — one headword, not a sweep.

## The concept (from [grilling-queue item 49](docs/grilling-queue.md))

Chris flagged it 2026-06-05 ("before I forget... may be its own concept"): he consistently prefers to **walk an entire specific lived example rather than the abstract concept**, accumulate **3+** such worked examples, then promote the generalized concept across them as the thing to plan + build + execute against. *"Let's not talk about the general concept — let's talk about the specific lived examples, accumulate them, then generalize."* He has no word for it yet.

## What the grill must resolve

1. **Name it.** It's the *reasoning method* (the HOW of Chris's design thinking — insist on concrete before abstract). Candidates to put up + let Chris pick/veto: "concrete-example-first," "example-first design," "walk-the-example," "lived-example-first." (Apply the formalization tax to the naming — reuse/short over coined.)
2. **Lock the relationship to the [graduation threshold (N=3)](docs/adr/0022-formalization-tax-and-self-improvement-counterbalance.md).** They're twins but distinct: the graduation threshold is *when an abstraction is allowed to promote* (a gate on the substrate); concrete-example-first is *how Chris reasons toward it* (a gate on his own thinking — refuse to design from the abstract; demand the worked examples). Same number (3), different object. Make the distinction crisp or decide they're one thing.
3. **Lock the relationship to [prototype-as-input-not-canon](docs/adr/0022-formalization-tax-and-self-improvement-counterbalance.md).** They compose — the prototype is *a* concrete example offered as input; concrete-example-first is the broader insistence on ≥3 of them before generalizing. Is concrete-example-first the parent, or a sibling?
4. **Decide the home.** A `docs/reference/mcp-architecture.md` method headword (joining the formalization-tax family), or a short ADR-0022 amendment, or both. Apply the tax — it likely earns a headword (Chris invokes it constantly; clears its own N=3 by inspection) but probably not its own ADR.

## Output

- One ratified headword (+ its _Avoid_ line) in the agreed home.
- grilling-queue item 49 → § Resolved.
- If it changes claude.ai-facing substrate materially, note the claude.ai grilling review (likely minor — it's a Claude-Code/design-process concept).

Self-aware note: this grill is *itself* a concrete example of concrete-example-first (Chris walked the lived instances — the design-system reconciliation, the PRODUCT.md refactor, the CCIL re-architecture, this whole session — before naming it). Lampshade it in the headword if it helps.

---

## Outcome (resolved 2026-06-05)

All four resolution points locked with Chris (audio-ratified):

1. **Name:** `concrete-example-first`. Rejected: "example-first design" (drops *concrete/lived*), "walk-the-example" (names step one only), "lived-example-first" (strong runner-up; "concrete" names the operative concrete↔abstract axis), "show-don't-tell", "rule of three" (that's the threshold's count).
2. **Graduation threshold (N=3):** human-facing generative **twin**. Feeder → gate — concrete-example-first *produces* the worked instances; the threshold *counts* them and gates the leap. Shared N=3 dial, different object. Gate-family kin: Simulated Pourover Gate, doc-size tripwire (stake-in-the-ground, not auto-act).
3. **Prototype-as-input-not-canon:** interrelated **sibling** (not parent/child). Both express *lived/concrete/internal is canonical; abstract/external is input you generalize-from or pull-from and test, never canon you reshape your reality to fit.* concrete-example-first = construction axis; prototype-as-input-not-canon = consumption axis. The shared-root umbrella was **considered and parked at N<3** — mint only if it recurs 3×.
4. **Home:** headword in [docs/reference/mcp-architecture.md](docs/reference/mcp-architecture.md) + one-line pointer in [ADR-0022 § Mechanism 1](docs/adr/0022-formalization-tax-and-self-improvement-counterbalance.md). **No standalone ADR** (vocabulary, not a hard-to-reverse decision).

Two enrichments past the original flag, surfaced in Chris's audio: **do-it-for-real (forcing function)** and **generalize-from-lived-not-imagined** (the plan/execute deviation rationale; the architecture-review skill is the canonical instance — run on 3 real surfaces, lived outcomes fed back, then graduated).

Also logged (do **not** act now): mcp-architecture.md scope-drift re-home candidate → future `CONTEXT-system.md`, deferred until a doc-size tripwire fires ([grilling-queue § Open candidates](docs/grilling-queue.md)).

claude.ai grilling review: minor — the headword is served via `docs://reference/mcp-architecture.md` but concrete-example-first is a Claude-Code/design-process concept claude.ai doesn't operationally invoke mid-workflow. No instruction edit needed; flag at next review.
